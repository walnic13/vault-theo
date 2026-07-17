// VA-T9 — Theo Download Card (visual authority; reproduce faithfully, do not redesign).
//
// The in-chat affordance for a tool-produced downloadable file (first producer: the general-chat
// tool-loop's `theo_export_spreadsheet` → `event: vault_export`; API Spec §2.10 / §2.12, DR-T11).
// It renders INSIDE an assistant turn, directly after the reply body — parallel to how the artifact
// card (ArtifactCard) renders, and using the SAME zero-dependency inline-style idiom as
// VA-T1/VA-T5/VA-T7/VA-T8 (no Tailwind, no browser storage, no external deps).
//
// Design (Walter-approved 2026-07-17):
//  - a coral-tint rounded tile holding a spreadsheet grid glyph (coral stroke),
//  - the filename (600 weight, single-line ellipsis),
//  - a muted subtitle: "Excel spreadsheet · <human size>" (NO expiry text — the SAS link is
//    short-lived and re-minted on demand later; the card stays clean),
//  - a filled-coral "Download" button (download glyph + label) — a real
//    <a href={downloadUrl} download target="_blank" rel="noopener noreferrer">.
// Everything else on the surface is unchanged (VA-T1).
//
// The live component reads Theo's shared theme tokens (`C`, `SANS` from ../theme); they are inlined
// here so this reference renders standalone.

const C = {
  card: "#FFFFFF", ink: "#28261F", ink3: "#8A8577",
  line2: "#EAE6DC", coral: "#D97757", coralTint: "#FBF0EB", bubble: "#F3F0E9", bg: "#FAF9F5",
};
const SANS = 'ui-sans-serif, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Human-readable byte size (mirrors ChatView's formatSize).
function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// A friendly file-kind label from the content type (spreadsheet is the only producer today).
function kindLabel(contentType) {
  if (typeof contentType === "string" && contentType.includes("spreadsheet")) return "Excel spreadsheet";
  return "File";
}

function IcGrid({ s = 20 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}
function IcDownload({ s = 15 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
    </svg>
  );
}

// The download card. `download` = the vault_export payload
// { downloadUrl, filename, contentType?, byteSize?, expiresAt? }.
export function DownloadCard({ download }) {
  if (!download || !download.downloadUrl || !download.filename) return null;
  const size = formatSize(download.byteSize);
  const sub = [kindLabel(download.contentType), size].filter(Boolean).join(" · ");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13, background: C.card,
      border: `1px solid ${C.line2}`, borderRadius: 12, padding: "13px 15px", margin: "4px 0 14px", maxWidth: 430 }}>
      <span style={{ width: 38, height: 38, borderRadius: 9, background: C.coralTint, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", color: C.coral }}>
        <IcGrid s={20} />
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {download.filename}
        </div>
        <div style={{ fontSize: 12, color: C.ink3, marginTop: 1 }}>{sub}</div>
      </div>
      <a href={download.downloadUrl} download={download.filename} target="_blank" rel="noopener noreferrer"
        aria-label={`Download ${download.filename}`}
        style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6, background: C.coral,
          color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600,
          cursor: "pointer", fontFamily: SANS, textDecoration: "none" }}>
        <IcDownload s={15} /> Download
      </a>
    </div>
  );
}

// ---- Standalone demo (reference only; not shipped) ----------------------------------------------
export default function DownloadCardReference() {
  const demo = {
    downloadUrl: "#",
    filename: "2023 K-1 Export.xlsx",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    byteSize: 17408,
  };
  return (
    <div style={{ background: C.bg, padding: 40, fontFamily: SANS, color: C.ink }}>
      <div style={{ maxWidth: 740, margin: "0 auto", display: "flex", gap: 13 }}>
        <div style={{ width: 22, height: 22, flexShrink: 0, borderRadius: "50%", marginTop: 2,
          background: `conic-gradient(from 210deg, ${C.coral}, #B85C3E, ${C.coral})` }} />
        <div style={{ fontSize: 15, lineHeight: 1.6, flex: 1, minWidth: 0 }}>
          <p style={{ margin: "0 0 12px" }}>
            Done — I pulled the figures from your 2023 K-1 and laid them out as current-year workpaper
            input: partner, EIN, and each K-1 box with its amount. Your Excel file is ready:
          </p>
          <DownloadCard download={demo} />
          <p style={{ margin: 0 }}>
            Want me to add a second sheet reconciling it against the prior-year workpaper, or adjust any
            of the columns?
          </p>
        </div>
      </div>
    </div>
  );
}
