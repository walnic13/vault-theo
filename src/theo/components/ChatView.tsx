// ChatView — chat scroll content + composer (VA-T1 L348–377, L479–492). The view-switched
// 54px header bar is shared chrome rendered by TheoMain (identical pixels; allowed split delta).
// B8e: composer gains an attach control + attachment chips + paste-to-attachment (a large paste
// becomes a collapsed, expandable "Pasted text" chip — Claude-style — instead of flooding the box).
// VA-T8: composer gains a dictation mic (idle mic / recording tray + coral-tinted stop) and each
// assistant reply gains a read-aloud control (idle "Read aloud" / playing equalizer). Backends:
// theo_transcribe_audio + theo_synthesize_speech (API §2.11). Inline-style, no browser storage.
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, DragEvent, ReactNode } from "react";
import { C, SANS, SERIF } from "../theme";
import { Burst, IcMic, IcSpeaker, IcClose } from "./icons";
import { CitedText } from "./CitedText";
import { AgentActivity } from "./AgentActivity";
import { DownloadCard } from "./DownloadCard";
import type { ComposerAttachment, Message, Project, SentAttachment } from "../types";

export interface ChatViewProps {
  messages: Message[];
  loading: boolean;
  error: string;
  draft: string;
  attachments: ComposerAttachment[];
  attachmentsAvailable: boolean;
  onDraftChange: (s: string) => void;
  onSend: (text?: string) => void;
  onStop: () => void;
  queuedText: string | null;        // message-queue: the pending next message (shown as a cancelable chip)
  onCancelQueued: () => void;
  onAddFiles: (files: FileList | File[]) => void;
  onAddPastedText: (text: string) => boolean;
  onRemoveAttachment: (localId: string) => void;
  chatProject: Project | null;
  assistantName: string;
  greeting: string;
  starters: string[];
  renderAssistant: (content: string) => ReactNode;
  // VA-T8 voice: dictation (composer mic) + read-aloud (per assistant reply). Shown only when the
  // live backend is wired (voiceAvailable); state keyed by message index for read-aloud.
  voiceAvailable: boolean;
  recording: boolean;
  transcribing: boolean;
  recordingSeconds: number;
  onStartDictation: () => void;
  onStopDictation: () => void;
  onCancelDictation: () => void;
  playingIdx: number | null;
  synthesizingIdx: number | null;
  onReadAloud: (idx: number, text: string) => void;
  onStopReadAloud: () => void;
  // VA-T7: fund label for the review-agent activity panel (from the conversation's app_context; the
  // panel falls back to a generic label when absent). Only sigma review turns carry reasoning/tools.
  reviewFund?: string;
  // Sigma review context armed → review-focused landing (opener names the fund; starters carry the
  // review action pills). Fail-closed: false for generic Theo / a Sigma dock with no review.
  reviewMode?: boolean;
  // In Sigma (with or without a review armed) → app-level review-assistant landing (#5 v2). Distinct
  // from reviewMode (a specific fund) and generic Theo. false everywhere outside Sigma.
  sigmaMode?: boolean;
}

// VA-T8: the "listening" waveform + read-aloud equalizer share one keyframe, injected once (the
// reference-pack idiom — a component-scoped <style>, no Tailwind, no global stylesheet dependency).
const VOICE_KEYFRAMES = "@keyframes vt-wave { 0%, 100% { transform: scaleY(0.35) } 50% { transform: scaleY(1) } }";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Paperclip({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

// VA-T8: filled square glyph for the mic's "stop & transcribe" state.
function StopSquare({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><rect x="6" y="6" width="12" height="12" rx="2" /></svg>;
}

// VA-T8: animated listening waveform (recording tray).
function Waveform() {
  const delays = [0, 120, 60, 200, 90, 160, 30, 220, 110];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 20, flex: 1 }} aria-hidden>
      {delays.map((d, i) => (
        <span key={i} style={{ width: 3, height: 16, borderRadius: 2, background: C.coral, transformOrigin: "center", animation: `vt-wave 1s ${d}ms infinite ease-in-out` }} />
      ))}
    </div>
  );
}

// VA-T8: tiny equalizer shown while a reply is being read aloud.
function EqBars() {
  const delays = [0, 140, 70, 200];
  return (
    <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 13 }} aria-hidden>
      {delays.map((d, i) => (
        <span key={i} style={{ width: 2.5, height: 12, borderRadius: 1, background: C.coralDk, transformOrigin: "bottom", animation: `vt-wave 900ms ${d}ms infinite ease-in-out` }} />
      ))}
    </span>
  );
}

// VA-T8: the composer dictation button — idle mic / recording coral-tinted stop / transcribing dots.
// Same 34×34 action-row geometry as the attach + send buttons.
function MicButton({ recording, transcribing, disabled, onStart, onStop }: { recording: boolean; transcribing: boolean; disabled: boolean; onStart: () => void; onStop: () => void }) {
  if (transcribing) {
    return (
      <span title="Transcribing…" aria-label="Transcribing" style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: C.ink3 }}>
        <span style={{ display: "inline-flex", gap: 3 }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 5, height: 5, borderRadius: "50%", background: C.ink3, display: "inline-block", animation: `vo-bounce 1.2s ${d * 0.16}s infinite ease-in-out` }} />)}</span>
      </span>
    );
  }
  const blocked = disabled && !recording;
  return (
    <button
      className="vo-mic" onClick={() => (recording ? onStop() : onStart())} disabled={blocked}
      aria-label={recording ? "Stop and transcribe" : "Dictate a message"} title={recording ? "Stop & transcribe" : "Dictate a message"}
      style={{ width: 40, height: 40, borderRadius: "50%", border: "none", cursor: blocked ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: recording ? C.coralSoft : C.bubble, color: recording ? C.coralDk : (blocked ? C.line2 : C.ink2) }}
    >{recording ? <StopSquare /> : <IcMic s={18} />}</button>
  );
}

// VA-T8: the recording tray (replaces the textarea while recording) — waveform + tabular-nums timer
// + a 7:00 cap note + Cancel (discard). Stopping (the mic-as-stop) transcribes into the draft.
function RecordingTray({ seconds, onCancel }: { seconds: number; onCancel: () => void }) {
  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.coralSoft, border: `1px solid ${C.coralTint}`, borderRadius: 12, padding: "9px 12px" }}>
      <Waveform />
      <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600, color: C.coralDk, fontSize: 13.5, flexShrink: 0 }}>{mm}:{ss}</span>
      <span style={{ fontSize: 11.5, color: C.ink3, flexShrink: 0 }}>up to 7:00</span>
      <button onClick={onCancel} title="Cancel" style={{ flexShrink: 0, border: "none", background: "transparent", color: C.ink2, cursor: "pointer", fontSize: 13, fontFamily: SANS }}>Cancel</button>
    </div>
  );
}

// VA-T8: the per-reply read-aloud control — idle "Read aloud" / loading dots / playing equalizer.
function ReadAloudButton({ playing, loading, onToggle }: { playing: boolean; loading: boolean; onToggle: () => void }) {
  const blocked = loading && !playing;
  return (
    <button
      onClick={onToggle} disabled={blocked}
      aria-label={playing ? "Stop reading" : "Read this reply aloud"} title={playing ? "Stop" : "Read aloud"}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "transparent", color: playing ? C.coralDk : C.ink3, cursor: blocked ? "default" : "pointer", fontFamily: SANS, fontSize: 12.5, borderRadius: 8, padding: "5px 8px" }}
    >
      {loading ? <span style={{ display: "inline-flex", gap: 3 }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 4, height: 4, borderRadius: "50%", background: C.ink3, display: "inline-block", animation: `vo-bounce 1.2s ${d * 0.16}s infinite ease-in-out` }} />)}</span> : playing ? <EqBars /> : <IcSpeaker s={15} />}
      {loading ? "Loading…" : playing ? "Playing…" : "Read aloud"}
    </button>
  );
}

// VA-T10: the mobile "Add to chat" bottom sheet — glyphs + the sheet itself. Opened by the composer
// paperclip on narrow viewports; replaces the raw native OS file chooser. Each card triggers a hidden
// <input> (camera / photos / files) whose files route through the existing onAddFiles upload pipeline.
const SHEET_KEYFRAMES = "@keyframes vt-sheet-up { from { transform: translateY(100%) } to { transform: translateY(0) } } @keyframes vt-fade-in { from { opacity: 0 } to { opacity: 1 } }";

function CameraGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function PhotosGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
function FilesGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <polyline points="9 15 12 12 15 15" />
    </svg>
  );
}

function AttachOption({ glyph, label, onClick }: { glyph: ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.line2}`, borderRadius: 16, padding: "18px 8px", cursor: "pointer", fontFamily: SANS }}>
      <span style={{ width: 52, height: 52, borderRadius: "50%", background: C.bubble, color: C.ink2, display: "flex", alignItems: "center", justifyContent: "center" }}>{glyph}</span>
      <span style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{label}</span>
    </button>
  );
}

function AddToChatSheet({ open, onClose, onCamera, onPhotos, onFiles }: { open: boolean; onClose: () => void; onCamera: () => void; onPhotos: () => void; onFiles: () => void }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Add to chat" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(40,38,31,0.35)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 60, animation: "vt-fade-in .15s ease" }}>
      <style>{SHEET_KEYFRAMES}</style>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: "10px 16px calc(20px + env(safe-area-inset-bottom))", boxShadow: "0 -6px 28px rgba(40,38,31,0.18)", animation: "vt-sheet-up .22s cubic-bezier(.22,.61,.36,1)", fontFamily: SANS }}>
        <div style={{ width: 36, height: 5, borderRadius: 3, background: C.line2, margin: "0 auto 12px" }} aria-hidden />
        <div style={{ position: "relative", height: 32, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <button onClick={onClose} aria-label="Close" title="Close" style={{ position: "absolute", left: 0, top: 0, width: 32, height: 32, border: "none", background: "transparent", color: C.ink2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><IcClose s={20} /></button>
          <span style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>Add to chat</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <AttachOption glyph={<CameraGlyph />} label="Camera" onClick={onCamera} />
          <AttachOption glyph={<PhotosGlyph />} label="Photos" onClick={onPhotos} />
          <AttachOption glyph={<FilesGlyph />} label="Files" onClick={onFiles} />
        </div>
      </div>
    </div>
  );
}

// One attachment chip — file or "Pasted text". Pasted/text chips with a preview expand inline.
// `onRemove` present ⇒ composer chip (removable); absent ⇒ sent-bubble chip (read-only).
function Chip(props: {
  name: string; kind: "file" | "pasted"; byteSize: number;
  status?: ComposerAttachment["status"]; previewText?: string;
  onRemove?: () => void;
}) {
  const { name, kind, byteSize, status, previewText, onRemove } = props;
  const [open, setOpen] = useState(false);
  const expandable = previewText != null && previewText.length > 0;
  const meta =
    status === "uploading" ? "Uploading…" :
    status === "error" ? "Failed" :
    kind === "pasted" ? `${previewText ? previewText.split("\n").length : 0} lines · ${formatSize(byteSize)}` :
    formatSize(byteSize);
  const failed = status === "error";
  return (
    <div style={{ display: "flex", flexDirection: "column", maxWidth: 320 }}>
      <div
        onClick={expandable ? () => setOpen((o) => !o) : undefined}
        title={expandable ? (open ? "Hide preview" : "Show preview") : name}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "#fff",
          border: `1px solid ${failed ? C.coral : C.line2}`, borderRadius: 10, padding: "7px 10px",
          fontFamily: SANS, fontSize: 12.5, color: failed ? C.coralDk : C.ink2,
          cursor: expandable ? "pointer" : "default", maxWidth: 320,
        }}
      >
        <span style={{ flexShrink: 0, fontSize: 14 }}>{kind === "pasted" ? "¶" : "📄"}</span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.ink, fontWeight: 500 }}>{name}</span>
        <span style={{ flexShrink: 0, color: failed ? C.coralDk : C.ink3 }}>{meta}</span>
        {onRemove && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            aria-label={`Remove ${name}`}
            style={{ flexShrink: 0, marginLeft: 2, border: "none", background: "transparent", color: C.ink3, cursor: "pointer", fontSize: 15, lineHeight: 1, padding: "0 2px" }}
          >×</button>
        )}
      </div>
      {open && expandable && (
        <pre style={{
          margin: "6px 0 0", maxHeight: 220, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word",
          background: C.bubble, border: `1px solid ${C.line2}`, borderRadius: 10, padding: "10px 12px",
          fontFamily: SANS, fontSize: 12.5, color: C.ink2, lineHeight: 1.5,
        }}>{previewText}</pre>
      )}
    </div>
  );
}

function SentAttachments({ items }: { items: SentAttachment[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8, justifyContent: "flex-end" }}>
      {items.map((a, i) => (
        <Chip key={i} name={a.name} kind={a.kind} byteSize={a.byteSize} previewText={a.previewText} />
      ))}
    </div>
  );
}

// B9 streaming: whimsical processing words shown until the first token lands (and while the model is
// only thinking) — the Claude-Code-style affordance that masks the pre-first-token latency.
const STATUS_WORDS = ["Percolating", "Noodling", "Ruminating", "Tallying", "Reconciling", "Consulting the ledger", "Marshalling thoughts", "Crunching"];
function StatusLine() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % STATUS_WORDS.length), 1900);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9, color: C.ink3, fontFamily: SANS, fontSize: 14 }}>
      <span style={{ fontStyle: "italic" }}>{STATUS_WORDS[i]}…</span>
      <span style={{ display: "inline-flex", gap: 4 }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: C.ink3, display: "inline-block", animation: `vo-bounce 1.2s ${d * 0.16}s infinite ease-in-out` }} />)}</span>
    </span>
  );
}

// B9 streaming: collapsible panel for the model's extended-thinking text (streamed via thinking_delta).
// Collapsed by default; labelled "Thinking…" while live, "Thought process" once the answer is in.
function ThinkingPanel({ text, live }: { text: string; live: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 10 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "transparent", color: C.ink3, cursor: "pointer", fontFamily: SANS, fontSize: 12.5, padding: 0 }}
      >
        <span style={{ fontStyle: "italic" }}>{live ? "Thinking…" : "Thought process"}</span>
        <span style={{ fontSize: 10 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <pre style={{ margin: "6px 0 0", maxHeight: 240, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", background: C.bubble, border: `1px solid ${C.line2}`, borderRadius: 10, padding: "10px 12px", fontFamily: SANS, fontSize: 12.5, color: C.ink2, lineHeight: 1.5 }}>{text}</pre>
      )}
    </div>
  );
}

// Ephemeral: Jake's birthday banner (Walter 2026-07-21) — shown in the general-landing starters spot for
// ONE local day (the caller gates on the local date). Festive confetti + a pop-in/wiggle title; zero-dep,
// inline-style, component-scoped keyframes; prefers-reduced-motion drops the motion to a static banner.
const BIRTHDAY_KEYFRAMES = `
@keyframes vt-bday-pop { 0% { transform: scale(0.7); opacity: 0 } 60% { transform: scale(1.06) } 100% { transform: scale(1); opacity: 1 } }
@keyframes vt-bday-wiggle { 0%, 100% { transform: rotate(-2.5deg) } 50% { transform: rotate(2.5deg) } }
@keyframes vt-bday-fall { 0% { transform: translateY(-16px) rotate(0deg); opacity: 0 } 12% { opacity: 1 } 100% { transform: translateY(150px) rotate(340deg); opacity: 0 } }
@media (prefers-reduced-motion: reduce) { .vt-bday-title { animation: none !important } .vt-confetti { display: none !important } }
`;

function BirthdayBanner() {
  const COLORS = [C.coral, C.coralDk, "#E9C46A", "#2A9D8F", "#E9D6B6", "#D98C7A"];
  const lefts = [5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95, 19, 46, 73]; // confetti column positions (%)
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 520, minHeight: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{BIRTHDAY_KEYFRAMES}</style>
      <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {lefts.map((left, i) => (
          <span key={i} className="vt-confetti" style={{
            position: "absolute", top: -14, left: `${left}%`,
            width: i % 3 === 0 ? 7 : 9, height: i % 3 === 0 ? 12 : 9,
            borderRadius: i % 2 === 0 ? 2 : "50%", background: COLORS[i % COLORS.length],
            animation: `vt-bday-fall ${2.3 + (i % 5) * 0.35}s ${(i % 7) * 0.26}s ease-in infinite`,
          }} />
        ))}
      </div>
      <div className="vt-bday-title" style={{ position: "relative", animation: "vt-bday-pop .5s ease-out both", textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 25, color: C.coral, letterSpacing: -0.2, display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }} aria-hidden>🎉</span>
          <span style={{ display: "inline-block", animation: "vt-bday-wiggle 2.6s ease-in-out infinite" }}>Happy Birthday, Jake!</span>
          <span style={{ fontSize: 26 }} aria-hidden>🎂</span>
        </div>
        <div style={{ color: C.ink3, fontSize: 13, marginTop: 8 }}>from all of us at Vault 🥳</div>
      </div>
    </div>
  );
}

export function ChatView(props: ChatViewProps) {
  const {
    messages, loading, error, draft, attachments, attachmentsAvailable,
    onDraftChange, onSend, onStop, queuedText, onCancelQueued, onAddFiles, onAddPastedText, onRemoveAttachment,
    chatProject, assistantName, greeting, starters, renderAssistant, reviewFund, reviewMode, sigmaMode,
    voiceAvailable, recording, transcribing, recordingSeconds, onStartDictation, onStopDictation, onCancelDictation,
    playingIdx, synthesizingIdx, onReadAloud, onStopReadAloud,
  } = props;
  const scroller = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // VA-T10: separate hidden inputs for the mobile "Add to chat" sheet's Camera / Photos cards (Files
  // reuses fileRef). `attachOpen` toggles the sheet; it is opened only on narrow (the composer breakpoint).
  const cameraRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<HTMLInputElement>(null);
  const [attachOpen, setAttachOpen] = useState(false);
  const isNarrow = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767.98px)").matches;

  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [messages, loading]);
  useEffect(() => { const ta = taRef.current; if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 200) + "px"; } }, [draft]);

  const uploading = attachments.some((a) => a.status === "uploading");
  const hasReady = attachments.some((a) => a.status === "ready");
  const canSend = (!!draft.trim() || hasReady) && !loading && !uploading;
  // Message-queue: while a reply streams, Enter still submits — send() queues it instead of sending.
  const canSubmit = (!!draft.trim() || hasReady) && !uploading;

  function onPaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    // IMG-1: a clipboard image (e.g. a pasted screenshot) → route into the SAME upload+vision pipeline
    // as the paperclip/drag-drop (onAddFiles → useTheoState.addFiles), so Claude receives it as an image
    // block. Files present → attach and don't insert; otherwise fall through to text-paste behaviour.
    const imgs = Array.from(e.clipboardData.files ?? []).filter((f) => f.type.startsWith("image/"));
    if (imgs.length && attachmentsAvailable) { e.preventDefault(); onAddFiles(imgs); return; }
    const text = e.clipboardData.getData("text/plain");
    if (text && onAddPastedText(text)) e.preventDefault();   // captured as an attachment → don't insert
  }
  function onFilePick(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length) onAddFiles(e.target.files);
    e.target.value = "";   // allow re-picking the same file
  }

  // Drag-and-drop attaching (Akshay #3): dropping files anywhere on the chat panel routes into the
  // SAME upload path as the paperclip (onAddFiles → useTheoState.addFiles). A transient overlay shows
  // only while a file drag is over the panel. `dragDepth` counts enter/leave so moving the cursor over
  // child elements doesn't flicker the state. Gated on attachmentsAvailable; drags without a "Files"
  // type (e.g. selected text) are ignored, so paste/text behaviour is untouched.
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const dragHasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes("Files");
  function onDragEnter(e: DragEvent) {
    if (!attachmentsAvailable || !dragHasFiles(e)) return;
    e.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  }
  function onDragOver(e: DragEvent) {
    if (!attachmentsAvailable || !dragHasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }
  function onDragLeave(e: DragEvent) {
    if (!dragHasFiles(e)) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  }
  function onDrop(e: DragEvent) {
    if (!attachmentsAvailable || !dragHasFiles(e)) return;
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) onAddFiles(e.dataTransfer.files);
  }

  return (
    <div
      style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <style>{VOICE_KEYFRAMES}</style>
      {/* VA-T10: mobile "Add to chat" sheet — each card routes into the existing onAddFiles pipeline. */}
      <AddToChatSheet
        open={attachOpen}
        onClose={() => setAttachOpen(false)}
        onCamera={() => { setAttachOpen(false); cameraRef.current?.click(); }}
        onPhotos={() => { setAttachOpen(false); photosRef.current?.click(); }}
        onFiles={() => { setAttachOpen(false); fileRef.current?.click(); }}
      />
      <div ref={scroller} className="vo-scroll" style={{ flex: 1, overflowY: "auto" }}>
        {messages.length === 0 ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
            <Burst size={40} />
            <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 32, margin: "18px 0 6px", letterSpacing: -0.2 }}>{greeting}</h1>
            <p style={{ color: C.ink2, fontSize: 15, margin: "0 0 22px" }}>{reviewMode ? `I've loaded ${reviewFund ?? "this fund"}'s workpapers — pick where to start, or ask me anything about this review.` : sigmaMode ? "I'm your K-1 review assistant. Open a fund from the worklist to start a review — I'll walk you through the exceptions, explain the controls, and help you sign off. Or ask me how reviews work." : chatProject ? `Working in ${chatProject.name}.` : "How can I help with your work today?"}</p>
            {(!reviewMode && !sigmaMode)
              ? (
                // General landing: generic starter chips removed (Walter 2026-07-21). Ephemeral — Jake's
                // birthday banner shows in that spot for one LOCAL day (self-expires at local midnight).
                (() => { const d = new Date(); return d.getFullYear() === 2026 && d.getMonth() === 6 && d.getDate() === 21; })()
                  ? <BirthdayBanner />
                  : null
              )
              : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 520 }}>
                  {starters.map((s) => <button key={s} className="vo-chip" onClick={() => onSend(s)} style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 999, padding: "8px 15px", fontSize: 13, color: C.ink2, cursor: "pointer", fontFamily: SANS }}>{s}</button>)}
                </div>
              )}
          </div>
        ) : (
          <div style={{ maxWidth: 740, margin: "0 auto", padding: "28px 24px 8px" }}>
            {messages.map((m, i) => m.role === "user" ? (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", margin: "0 0 22px" }}>
                {m.attachments && m.attachments.length > 0 && <SentAttachments items={m.attachments} />}
                <div style={{ background: C.bubble, borderRadius: 16, padding: "11px 16px", maxWidth: "82%", fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.content}</div>
              </div>
            ) : (
              <div key={i} style={{ display: "flex", gap: 13, margin: "0 0 26px" }}>
                <div style={{ marginTop: 2, flexShrink: 0 }}><Burst size={22} /></div>
                <div style={{ fontSize: 15, paddingTop: 1, minWidth: 0, flex: 1 }}>
                  {/* VA-T7: review-agent activity (live reasoning + tool calls) above the answer. Only
                      sigma review turns carry reasoning/tools; general chat turns render neither. */}
                  {(m.reasoning || (m.tools && m.tools.length)) ? (
                    <AgentActivity running={loading && i === messages.length - 1} reasoning={m.reasoning ?? ""} tools={m.tools ?? []} fund={reviewFund} mode={reviewFund ? "review" : "chat"} tokens={m.tokens} streaming={m.streaming} />
                  ) : null}
                  {/* Thinking panel: suppressed on a tool turn (the activity panel above already shows
                      the reasoning); shown for ordinary extended-thinking turns as before. */}
                  {m.thinking && !(m.tools && m.tools.length) ? <ThinkingPanel text={m.thinking} live={loading && i === messages.length - 1 && !m.content} /> : null}
                  {m.content
                    ? (m.runs?.some((r) => r.citations.length) ? <CitedText runs={m.runs} renderText={renderAssistant} /> : renderAssistant(m.content))
                    : (loading && i === messages.length - 1 ? <StatusLine /> : null)}
                  {/* VA-T9: a tool-produced downloadable file → download card, directly after the reply
                      body and BEFORE the read-aloud control (DR-T11 event: vault_export). */}
                  {m.download && <DownloadCard download={m.download} />}
                  {/* FindImage: a tool-found image → rendered inline directly from the tool result
                      (event: vault_image), reusing the VA-T1 image treatment; no model URL transcription. */}
                  {m.image && (() => {
                    const items = (m.image.images && m.image.images.length)
                      ? m.image.images
                      : (m.image.url ? [{ imageUrl: m.image.url, title: m.image.title, source: m.image.source, pageUrl: m.image.pageUrl, license: m.image.license, creator: m.image.creator }] : []);
                    if (!items.length) return null;
                    const multi = items.length > 1;
                    return (
                      <div style={{ display: "grid", gridTemplateColumns: multi ? "repeat(auto-fill, minmax(200px, 1fr))" : "1fr", gap: 12, margin: "4px 0 14px" }}>
                        {items.map((im, k) => (
                          <figure key={k} style={{ margin: 0, minWidth: 0 }}>
                            <a href={im.pageUrl || im.imageUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                              <img src={im.imageUrl} alt={im.title || ""} style={multi
                                ? { width: "100%", height: 150, objectFit: "cover", borderRadius: 8, display: "block", border: `1px solid ${C.line2}` }
                                : { maxWidth: "100%", height: "auto", borderRadius: 8, display: "block", border: `1px solid ${C.line2}` }} />
                            </a>
                            <figcaption style={{ fontSize: 12, color: C.ink3, marginTop: 4, lineHeight: 1.4, overflowWrap: "anywhere" }}>
                              {im.title ? <span style={{ color: C.ink2 }}>{im.title}</span> : null}
                              {im.source ? <span>{im.title ? " · " : ""}{im.source}</span> : null}
                              {im.creator ? <span> · {im.creator}</span> : null}
                              {im.license ? <span> · {im.license}</span> : null}
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    );
                  })()}
                  {/* FindVideo: a tool-found video → rendered inline directly from the tool result
                      (event: vault_video); an in-chat YouTube iframe when embeddable, else a thumbnail
                      link-card. No model URL transcription. */}
                  {m.video && m.video.videoUrl && (
                    <div style={{ margin: "4px 0 14px" }}>
                      {m.video.embedUrl ? (
                        <div style={{ position: "relative", width: "100%", maxWidth: 560, aspectRatio: "16 / 9", borderRadius: 8, overflow: "hidden", border: `1px solid ${C.line2}` }}>
                          <iframe
                            src={m.video.embedUrl}
                            title={m.video.title || "Video"}
                            loading="lazy"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                          />
                        </div>
                      ) : (
                        <a href={m.video.videoUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: 12, alignItems: "center", maxWidth: 560, textDecoration: "none", border: `1px solid ${C.line2}`, borderRadius: 8, overflow: "hidden", background: C.card }}>
                          {m.video.thumbnail ? (
                            <img src={m.video.thumbnail} alt={m.video.title || ""} style={{ width: 160, height: 90, objectFit: "cover", display: "block", flexShrink: 0 }} />
                          ) : null}
                          <span style={{ display: "block", padding: "8px 12px 8px 0", minWidth: 0 }}>
                            <span style={{ display: "block", color: C.ink2, fontSize: 14, lineHeight: 1.3, overflowWrap: "anywhere" }}>{m.video.title || m.video.videoUrl}</span>
                            <span style={{ display: "block", color: C.ink3, fontSize: 12, marginTop: 2 }}>{m.video.source || ""}{m.video.duration ? `${m.video.source ? " · " : ""}${m.video.duration}` : ""}</span>
                          </span>
                        </a>
                      )}
                      {m.video.embedUrl && (m.video.title || m.video.source || m.video.duration) ? (
                        <div style={{ fontSize: 12, color: C.ink3, marginTop: 4, lineHeight: 1.4, overflowWrap: "anywhere", maxWidth: 560 }}>
                          {m.video.title ? <span style={{ color: C.ink2 }}>{m.video.title}</span> : null}
                          {m.video.source ? <span>{m.video.title ? " · " : ""}{m.video.source}</span> : null}
                          {m.video.duration ? <span> · {m.video.duration}</span> : null}
                        </div>
                      ) : null}
                    </div>
                  )}
                  {/* VA-T8: read-aloud control on a finished reply (not the still-streaming turn). */}
                  {voiceAvailable && m.content && !(loading && i === messages.length - 1) && (
                    <div style={{ marginTop: 4 }}>
                      <ReadAloudButton
                        playing={playingIdx === i}
                        loading={synthesizingIdx === i}
                        onToggle={() => (playingIdx === i ? onStopReadAloud() : onReadAloud(i, m.content))}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && messages.length > 0 && messages[messages.length - 1].role !== "assistant" && (<div style={{ display: "flex", gap: 13, margin: "0 0 26px" }}>
              <div style={{ marginTop: 2 }}><Burst size={22} /></div>
              <div style={{ display: "flex", gap: 5, paddingTop: 9 }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: C.ink3, display: "inline-block", animation: `vo-bounce 1.2s ${d * 0.16}s infinite ease-in-out` }} />)}</div>
            </div>)}
          </div>
        )}
      </div>

      <div style={{ padding: "8px 24px 16px", flexShrink: 0 }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          {error && <div style={{ color: C.coralDk, fontSize: 13, marginBottom: 8, textAlign: "center" }}>{error}</div>}
          <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 18, padding: "12px 14px", boxShadow: "0 2px 14px rgba(40,38,31,0.05)" }}>
            {queuedText && (
              // Message-queue: the pending next message, shown while the current reply streams. Auto-sends
              // when the turn ends; ✕ cancels it before then.
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "6px 10px", borderRadius: 10, background: "#f6f2ea", border: `1px solid ${C.line2}` }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.coral, flexShrink: 0, textTransform: "uppercase", letterSpacing: 0.4 }}>Queued</span>
                <span style={{ fontSize: 12.5, color: C.ink2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{queuedText}</span>
                <button onClick={() => onCancelQueued()} aria-label="Cancel queued message" title="Cancel queued message" style={{ border: "none", background: "transparent", color: C.ink3, cursor: "pointer", fontSize: 14, lineHeight: 1, flexShrink: 0, padding: 2 }}>✕</button>
              </div>
            )}
            {attachments.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {attachments.map((a) => (
                  <Chip key={a.localId} name={a.name} kind={a.kind} byteSize={a.byteSize} status={a.status} previewText={a.previewText} onRemove={() => onRemoveAttachment(a.localId)} />
                ))}
              </div>
            )}
            {/* VA-T8: while recording, the tray replaces the textarea; the mic (below) becomes Stop. */}
            {recording ? (
              <RecordingTray seconds={recordingSeconds} onCancel={onCancelDictation} />
            ) : (
              <textarea ref={taRef} value={draft} onChange={(e) => onDraftChange(e.target.value)} onPaste={onPaste} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !(typeof window !== "undefined" && window.matchMedia("(max-width: 767.98px)").matches)) { e.preventDefault(); if (canSubmit) onSend(); } }} rows={1} placeholder={`Message ${assistantName}…`} style={{ width: "100%", border: "none", resize: "none", fontFamily: SANS, fontSize: 15, color: C.ink, background: "transparent", lineHeight: 1.5, maxHeight: 200 }} />
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input ref={fileRef} type="file" multiple onChange={onFilePick} style={{ display: "none" }} />
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={onFilePick} style={{ display: "none" }} />
                <input ref={photosRef} type="file" accept="image/*" multiple onChange={onFilePick} style={{ display: "none" }} />
                <button
                  className="vo-attach" disabled={!attachmentsAvailable} onClick={() => { if (isNarrow()) setAttachOpen(true); else fileRef.current?.click(); }}
                  title={attachmentsAvailable ? "Attach files" : "Attachments unavailable in this preview"}
                  aria-label="Attach files"
                  style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "transparent", color: attachmentsAvailable ? C.ink2 : C.line2, cursor: attachmentsAvailable ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}
                ><Paperclip size={18} /></button>
              </div>
              {/* VA-T8 (evolved 2026-07-20, Claude-match): mic + send are a right-cluster pair of 40px
                  CIRCLES — the grey dictation mic immediately left of the coral send (bold up-arrow). */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {voiceAvailable && (
                  <MicButton recording={recording} transcribing={transcribing} disabled={loading} onStart={onStartDictation} onStop={onStopDictation} />
                )}
                {loading ? (
                  // Stop-generating: the primary action becomes a Stop button in the circular send slot;
                  // always enabled; a filled square glyph; coral. Aborts the stream, keeps the partial reply.
                  <button
                    className="vo-send" onClick={() => onStop()}
                    aria-label="Stop generating" title="Stop"
                    style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: C.coral, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, transition: "background .15s" }}
                  >◼</button>
                ) : (
                  <button className="vo-send" disabled={!canSend} onClick={() => onSend()} aria-label="Send" style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: canSend ? C.coral : C.line2, color: "#fff", cursor: canSend ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s" }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: 11.5, color: C.ink3, marginTop: 9 }}>{assistantName} can make mistakes. Verify tax conclusions before relying on them.</div>
        </div>
      </div>

      {/* Akshay #3: transient drop-zone overlay — visible only while a file drag is over the panel.
          pointerEvents:none so the drag/drop lands on the wrapper's handlers, not the overlay.
          Inline-style / C palette (VA-T1 idiom); no animation (reduced-motion safe). */}
      {dragging && (
        <div
          aria-hidden
          style={{ position: "absolute", inset: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(217,119,87,0.06)", border: `2px dashed ${C.coral}`, borderRadius: 12, pointerEvents: "none" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: `1px solid ${C.coral}`, borderRadius: 12, padding: "14px 20px", boxShadow: "0 4px 20px rgba(40,38,31,0.10)", color: C.ink }}>
            <Paperclip size={18} />
            <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600 }}>Drop files to attach</span>
          </div>
        </div>
      )}
    </div>
  );
}
