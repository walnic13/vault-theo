// ChatView — chat scroll content + composer (VA-T1 L348–377, L479–492). The view-switched
// 54px header bar is shared chrome rendered by TheoMain (identical pixels; allowed split delta).
// B8e: composer gains an attach control + attachment chips + paste-to-attachment (a large paste
// becomes a collapsed, expandable "Pasted text" chip — Claude-style — instead of flooding the box).
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, ReactNode } from "react";
import { C, SANS, SERIF } from "../theme";
import { Burst } from "./icons";
import { CitedText } from "./CitedText";
import { AgentActivity } from "./AgentActivity";
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

export function ChatView(props: ChatViewProps) {
  const {
    messages, loading, error, draft, attachments, attachmentsAvailable,
    onDraftChange, onSend, onStop, queuedText, onCancelQueued, onAddFiles, onAddPastedText, onRemoveAttachment,
    chatProject, assistantName, greeting, starters, renderAssistant, reviewFund, reviewMode, sigmaMode,
  } = props;
  const scroller = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [messages, loading]);
  useEffect(() => { const ta = taRef.current; if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 200) + "px"; } }, [draft]);

  const uploading = attachments.some((a) => a.status === "uploading");
  const hasReady = attachments.some((a) => a.status === "ready");
  const canSend = (!!draft.trim() || hasReady) && !loading && !uploading;
  // Message-queue: while a reply streams, Enter still submits — send() queues it instead of sending.
  const canSubmit = (!!draft.trim() || hasReady) && !uploading;

  function onPaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData("text/plain");
    if (text && onAddPastedText(text)) e.preventDefault();   // captured as an attachment → don't insert
  }
  function onFilePick(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length) onAddFiles(e.target.files);
    e.target.value = "";   // allow re-picking the same file
  }

  return (
    <>
      <div ref={scroller} className="vo-scroll" style={{ flex: 1, overflowY: "auto" }}>
        {messages.length === 0 ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
            <Burst size={40} />
            <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 32, margin: "18px 0 6px", letterSpacing: -0.2 }}>{greeting}</h1>
            <p style={{ color: C.ink2, fontSize: 15, margin: "0 0 22px" }}>{reviewMode ? `I've loaded ${reviewFund ?? "this fund"}'s workpapers — pick where to start, or ask me anything about this review.` : sigmaMode ? "I'm your K-1 review assistant. Open a fund from the worklist to start a review — I'll walk you through the exceptions, explain the controls, and help you sign off. Or ask me how reviews work." : chatProject ? `Working in ${chatProject.name}.` : "How can I help with your work today?"}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 520 }}>
              {starters.map((s) => <button key={s} className="vo-chip" onClick={() => onSend(s)} style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 999, padding: "8px 15px", fontSize: 13, color: C.ink2, cursor: "pointer", fontFamily: SANS }}>{s}</button>)}
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 740, margin: "0 auto", padding: "28px 24px 8px" }}>
            {messages.map((m, i) => m.role === "user" ? (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", margin: "0 0 22px" }}>
                {m.attachments && m.attachments.length > 0 && <SentAttachments items={m.attachments} />}
                <div style={{ background: C.bubble, borderRadius: 16, padding: "11px 16px", maxWidth: "82%", fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{m.content}</div>
              </div>
            ) : (
              <div key={i} style={{ display: "flex", gap: 13, margin: "0 0 26px" }}>
                <div style={{ marginTop: 2, flexShrink: 0 }}><Burst size={22} /></div>
                <div style={{ fontSize: 15, paddingTop: 1, minWidth: 0, flex: 1 }}>
                  {/* VA-T7: review-agent activity (live reasoning + tool calls) above the answer. Only
                      sigma review turns carry reasoning/tools; general chat turns render neither. */}
                  {(m.reasoning || (m.tools && m.tools.length)) ? (
                    <AgentActivity running={loading && i === messages.length - 1} reasoning={m.reasoning ?? ""} tools={m.tools ?? []} fund={reviewFund} />
                  ) : null}
                  {m.thinking ? <ThinkingPanel text={m.thinking} live={loading && i === messages.length - 1 && !m.content} /> : null}
                  {m.content
                    ? (m.runs?.some((r) => r.citations.length) ? <CitedText runs={m.runs} renderText={renderAssistant} /> : renderAssistant(m.content))
                    : (loading && i === messages.length - 1 ? <StatusLine /> : null)}
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
            <textarea ref={taRef} value={draft} onChange={(e) => onDraftChange(e.target.value)} onPaste={onPaste} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (canSubmit) onSend(); } }} rows={1} placeholder={`Message ${assistantName}…`} style={{ width: "100%", border: "none", resize: "none", fontFamily: SANS, fontSize: 15, color: C.ink, background: "transparent", lineHeight: 1.5, maxHeight: 200 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <input ref={fileRef} type="file" multiple onChange={onFilePick} style={{ display: "none" }} />
              <button
                className="vo-attach" disabled={!attachmentsAvailable} onClick={() => fileRef.current?.click()}
                title={attachmentsAvailable ? "Attach files" : "Attachments unavailable in this preview"}
                aria-label="Attach files"
                style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "transparent", color: attachmentsAvailable ? C.ink2 : C.line2, cursor: attachmentsAvailable ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}
              ><Paperclip size={18} /></button>
              {loading ? (
                // Stop-generating: while streaming, the primary action becomes a Stop button in the same
                // .vo-send slot/size. Always enabled; a filled square glyph; coral (never the disabled
                // grey). Clicking aborts the stream and keeps the partial reply (useTheoState.stop()).
                <button
                  className="vo-send" onClick={() => onStop()}
                  aria-label="Stop generating" title="Stop"
                  style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: C.coral, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, transition: "background .15s" }}
                >◼</button>
              ) : (
                <button className="vo-send" disabled={!canSend} onClick={() => onSend()} style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: canSend ? C.coral : C.line2, color: "#fff", cursor: canSend ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "background .15s" }}>↑</button>
              )}
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: 11.5, color: C.ink3, marginTop: 9 }}>{assistantName} can make mistakes. Verify tax conclusions before relying on them.</div>
        </div>
      </div>
    </>
  );
}
