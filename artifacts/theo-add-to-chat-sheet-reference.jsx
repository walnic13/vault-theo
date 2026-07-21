// VA-T10 — Theo "Add to chat" mobile attachment sheet (canonical surface; reproduce faithfully, do not
// redesign). A Claude-mobile-match bottom sheet that REPLACES the raw native OS file chooser (Camera /
// Camcorder / Files) that a bare <input type="file"> triggers on a phone. On NARROW viewports
// (max-width: 767.98px — Theo's own breakpoint), tapping the composer paperclip opens this designed
// sheet instead of handing off to the OS picker; on WIDE viewports the paperclip keeps opening the
// normal file dialog (a native desktop dialog is already clean, and "Camera" does not apply) — so this
// surface is mobile-only and the wide VA-T1 composer is unchanged.
//
// Layout (Claude-match):
//   - a translucent backdrop over the surface; tap the backdrop or the ✕ to dismiss;
//   - a bottom sheet with rounded top corners, a centered drag-handle pill, and a header row:
//       ✕ (left) + "Add to chat" (centered, 600 weight);
//   - a row of THREE equal cards, each a white rounded tile with a circular grey icon chip + label:
//       Camera  — capture a photo   (hidden <input type="file" accept="image/*" capture="environment">)
//       Photos  — pick from gallery (hidden <input type="file" accept="image/*" multiple>)
//       Files   — any file          (hidden <input type="file" multiple>)
//   Picking from any card routes the chosen File(s) into the EXISTING upload+vision pipeline
//   (onAddFiles → useTheoState.addFiles → SAS upload → attachment_ids → gateway image/document block)
//   and closes the sheet. No new backend, no contract change. Claude's extra rows (Research / Web
//   search / Tool access / Add to project) are Claude-specific and intentionally NOT reproduced here.
//
// Zero-dependency, inline-style, no Tailwind, no browser storage — the VA-T1 / VA-T5 / VA-T7 / VA-T8
// idiom. Palette verbatim from VA-T1 theme.ts.

import { useState } from "react";

const C = {
  bg: "#FAF9F5", bubble: "#EDEAE0", card: "#FFFFFF",
  ink: "#28261F", ink2: "#6B6A63", ink3: "#94928A",
  line: "#E4E1D6", line2: "#D8D4C7",
  coral: "#D97757", coralDk: "#BD5D3A", coralSoft: "#F4E6DD", coralTint: "#EFE4DC",
};
const SANS = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';

const KEYFRAMES = `
@keyframes vt-sheet-up { from { transform: translateY(100%) } to { transform: translateY(0) } }
@keyframes vt-fade-in { from { opacity: 0 } to { opacity: 1 } }
`;

function CameraGlyph({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function PhotosGlyph({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
function FilesGlyph({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <polyline points="9 15 12 12 15 15" />
    </svg>
  );
}
function CloseGlyph({ size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}

// One attachment option card.
function OptionCard({ glyph, label, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        background: C.card, border: `1px solid ${C.line2}`, borderRadius: 16, padding: "18px 8px",
        cursor: "pointer", fontFamily: SANS,
      }}
    >
      <span style={{ width: 52, height: 52, borderRadius: "50%", background: C.bubble, color: C.ink2, display: "flex", alignItems: "center", justifyContent: "center" }}>{glyph}</span>
      <span style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{label}</span>
    </button>
  );
}

// The "Add to chat" bottom sheet. `open` toggles it; in the real surface it is rendered only on narrow
// (matchMedia("(max-width: 767.98px)")) and opened by the composer paperclip. Each card triggers its own
// hidden <input> (camera / photos / files) → onAddFiles(files) → the existing upload pipeline, then close.
export function AddToChatSheet({ open: initial = true }) {
  const [open, setOpen] = useState(initial);
  if (!open) return null;
  const pick = () => setOpen(false); // reference: a card tap closes the sheet after firing its input
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add to chat"
      onClick={() => setOpen(false)}
      style={{ position: "fixed", inset: 0, background: "rgba(40,38,31,0.35)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 60, animation: "vt-fade-in .15s ease" }}
    >
      <style>{KEYFRAMES}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: "10px 16px calc(20px + env(safe-area-inset-bottom))", boxShadow: "0 -6px 28px rgba(40,38,31,0.18)", animation: "vt-sheet-up .22s cubic-bezier(.22,.61,.36,1)", fontFamily: SANS }}
      >
        <div style={{ width: 36, height: 5, borderRadius: 3, background: C.line2, margin: "0 auto 12px" }} aria-hidden />
        <div style={{ position: "relative", height: 32, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <button onClick={() => setOpen(false)} aria-label="Close" title="Close" style={{ position: "absolute", left: 0, top: 0, width: 32, height: 32, border: "none", background: "transparent", color: C.ink2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><CloseGlyph /></button>
          <span style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>Add to chat</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <OptionCard glyph={<CameraGlyph />} label="Camera" onClick={pick} />
          <OptionCard glyph={<PhotosGlyph />} label="Photos" onClick={pick} />
          <OptionCard glyph={<FilesGlyph />} label="Files" onClick={pick} />
        </div>
      </div>
    </div>
  );
}

export default function AddToChatSheetReference() {
  return (
    <div style={{ position: "relative", minHeight: 480, background: C.bg }}>
      <AddToChatSheet open />
    </div>
  );
}
