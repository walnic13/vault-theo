// VA-T8 — Theo Voice Controls Rendering Reference (canonical surface; reproduce faithfully, do not
// redesign). Two additions to the existing Theo chat surface (VA-T1): (1) a DICTATION mic button in
// the composer action row, and (2) a READ-ALOUD control under each assistant reply. Everything else
// on the surface is unchanged. Zero-dependency, inline-style, no Tailwind, no browser storage — the
// VA-T1 / VA-T5 / VA-T7 idiom. Backends are DEPLOYED: theo_transcribe_audio (Whisper STT) +
// theo_synthesize_speech (Azure AI Speech TTS), API Spec §2.11.
//
// (1) Dictation mic — composer action row, left of Send, beside the existing attach button.
//   IDLE: a 34x34 transparent button (mic glyph, ink2) matching the attach button; warm hover.
//   RECORDING: a coral-soft tray above the row (animated waveform + tabular-nums timer + Cancel +
//     "Listening… up to 7:00"); the mic button becomes a coral-tinted STOP (filled square). Stop →
//     the transcript is dropped into the composer draft for review; NOTHING is sent automatically.
//     Client caps the recording at 7:00 (backend byte cap ~24 MB is the safety ceiling).
//   Wiring: MediaRecorder → base64 → theo_transcribe_audio { audio_base64, content_type } → { text }.
//
// (2) Read-aloud — a quiet text button in an actions row under each assistant message body.
//   IDLE: muted (ink3) "🔊 Read aloud" text button, same family as other message affordances; warm hover.
//   PLAYING: coralDk with a tiny equalizer + "Playing…"; tap to stop. One premium default voice for
//     v1 (no picker; the backend accepts an optional voice, so a picker is a later FE-only add).
//   Wiring: theo_synthesize_speech { text } → { audio_base64, content_type:"audio/mpeg" } → <audio> play.
//
// Palette (theo-*, inline, verbatim from VA-T1 theme.ts):
//   bg #FAF9F5, bubble #EDEAE0, card #FFFFFF, ink #28261F, ink2 #6B6A63, ink3 #94928A,
//   line #E4E1D6, line2 #D8D4C7, coral #D97757, coralDk #BD5D3A, coralSoft #F4E6DD, coralTint #EFE4DC.

import { useState } from "react";

const C = {
  bg: "#FAF9F5", bubble: "#EDEAE0", card: "#FFFFFF",
  ink: "#28261F", ink2: "#6B6A63", ink3: "#94928A",
  line: "#E4E1D6", line2: "#D8D4C7",
  coral: "#D97757", coralDk: "#BD5D3A", coralSoft: "#F4E6DD", coralTint: "#EFE4DC",
};
const SANS = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';

// Keyframes the reference relies on (host surface already defines vo-bounce; these are additive).
const KEYFRAMES = `
@keyframes vt-wave { 0%,100%{ transform:scaleY(0.3) } 50%{ transform:scaleY(1) } }
@keyframes vt-pulse { 0%,100%{ opacity:1 } 50%{ opacity:.4 } }
`;

function MicGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}
function StopGlyph({ size = 15 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><rect x="6" y="6" width="12" height="12" rx="2" /></svg>;
}
function SpeakerGlyph({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="3 9 3 15 8 15 13 20 13 4 8 9 3 9" fill="currentColor" stroke="none" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 6a8 8 0 0 1 0 12" />
    </svg>
  );
}
function Paperclip({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
function Burst({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="15" fill={C.coralTint} />
      <path d="M16 7l2.6 5.9L24.5 15l-5.9 2.4L16 24l-2.6-6.6L7.5 15l5.9-2.1z" fill={C.coral} />
    </svg>
  );
}

// The animated listening waveform shown in the recording tray.
function Waveform() {
  const bars = [0, 120, 60, 200, 90, 160, 30, 220, 110];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 20, flex: 1 }} aria-hidden>
      {bars.map((d, i) => (
        <span key={i} style={{ width: 3, height: 16, borderRadius: 2, background: C.coral, transformOrigin: "center", animation: `vt-wave 1s ${d}ms infinite ease-in-out` }} />
      ))}
    </div>
  );
}
function Equalizer() {
  const bars = [0, 140, 70, 200];
  return (
    <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 13 }} aria-hidden>
      {bars.map((d, i) => (
        <span key={i} style={{ width: 2.5, height: 12, borderRadius: 1, background: C.coralDk, transformOrigin: "bottom", animation: `vt-wave 900ms ${d}ms infinite ease-in-out` }} />
      ))}
    </span>
  );
}

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// (1) DICTATION — the composer with the mic button. `recording` toggles the tray + stop affordance.
// In the real surface this lives in ChatView's composer action row (left cluster, beside attach).
export function ComposerWithMic({ recording: initial = false }) {
  const [recording, setRecording] = useState(initial);
  const [secs] = useState(12); // reference shows a representative elapsed time
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 18, padding: "12px 14px", boxShadow: "0 2px 14px rgba(40,38,31,0.05)", fontFamily: SANS }}>
      {recording ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.coralSoft, border: `1px solid ${C.coralTint}`, borderRadius: 12, padding: "9px 12px", marginBottom: 10 }}>
          <Waveform />
          <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600, color: C.coralDk, fontSize: 13.5 }}>{mmss(secs)}</span>
          <button onClick={() => setRecording(false)} style={{ border: "none", background: "transparent", color: C.ink2, cursor: "pointer", fontSize: 13, fontFamily: SANS }} title="Cancel">Cancel</button>
        </div>
      ) : (
        <div style={{ color: C.ink3, fontSize: 15, minHeight: 24 }}>Message Theo…</div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: recording ? 4 : 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button aria-label="Attach files" title="Attach files" style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: "transparent", color: C.ink2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Paperclip /></button>
          {recording
            ? <span style={{ fontSize: 11.5, color: C.ink3 }}>Listening… up to 7:00</span>
            : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* NEW — dictation mic: idle=mic, recording=stop (coral-tinted). Same 34x34 slot as attach/send. */}
          <button
            onClick={() => setRecording((r) => !r)}
            aria-label={recording ? "Stop and transcribe" : "Dictate a message"}
            title={recording ? "Stop & transcribe" : "Dictate a message"}
            style={{
              width: 34, height: 34, borderRadius: 10, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: recording ? C.coralSoft : "transparent",
              color: recording ? C.coralDk : C.ink2,
            }}
          >{recording ? <StopGlyph /> : <MicGlyph />}</button>
          {/* Existing send button — unchanged. */}
          <button aria-label="Send" style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: C.line2, color: "#fff", cursor: "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// (2) READ-ALOUD — a message actions row under the assistant body. `playing` toggles the affordance.
export function ReadAloudButton({ playing: initial = false }) {
  const [playing, setPlaying] = useState(initial);
  return (
    <button
      onClick={() => setPlaying((p) => !p)}
      aria-label={playing ? "Stop reading" : "Read this reply aloud"}
      title={playing ? "Stop" : "Read aloud"}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "transparent",
        color: playing ? C.coralDk : C.ink3, cursor: "pointer", fontFamily: SANS, fontSize: 12.5,
        borderRadius: 8, padding: "5px 8px",
      }}
    >
      {playing ? <Equalizer /> : <SpeakerGlyph />}
      {playing ? "Playing…" : "Read aloud"}
    </button>
  );
}

// Composed reference — shows placement of both controls on the real surface.
export default function VoiceControlsReference() {
  return (
    <div style={{ background: C.bg, padding: 24, fontFamily: SANS, color: C.ink }}>
      <style>{KEYFRAMES}</style>

      {/* An assistant reply carrying the new read-aloud control in its actions row. */}
      <div style={{ maxWidth: 740, margin: "0 auto 26px", display: "flex", gap: 13 }}>
        <div style={{ marginTop: 2, flexShrink: 0 }}><Burst size={22} /></div>
        <div style={{ fontSize: 15, minWidth: 0, flex: 1 }}>
          <p style={{ margin: "0 0 8px", lineHeight: 1.55 }}>
            Total assets tie out to the trial balance — Schedule L agrees to the TB within tolerance.
            One partner allocation needs a look before sign-off.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 4 }}>
            <ReadAloudButton />
          </div>
        </div>
      </div>

      {/* The composer with the new mic button. */}
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <ComposerWithMic />
      </div>
    </div>
  );
}
