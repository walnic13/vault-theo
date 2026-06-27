import { useState, useRef } from "react";

/* =============================================================================
   THEO CITATION RENDERING — REFERENCE COMPONENT  (v0.1)
   -----------------------------------------------------------------------------
   A faithful reproduction of the Claude-style inline citation affordance:
     • a small rounded chip placed immediately after a cited claim
     • the source favicon + a numeric index inside the chip
     • on hover/focus: a source card (title, domain, cited snippet, open link)
     • multiple sources on one claim render as adjacent chips
   Zero external dependencies (matches theo-frontend-reference.jsx): pure React,
   inline styles, system font stack. Tune the `C` tokens to your real palette.
   NOTE: this is a high-fidelity reproduction of the *observable* pattern, not an
   extraction of Anthropic production CSS. Treat tokens as adjustable.
============================================================================= */

const C = {
  text:   "#3D3D3A",
  muted:  "#73726C",
  border: "#E8E6DE",
  chipBg: "#F0EEE6",
  chipBgHover: "#E6E3D9",
  coral:  "#D97757",
  card:   "#FFFFFF",
  shadow: "rgba(40,38,34,0.14)",
};
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/* ---- helpers --------------------------------------------------------------- */

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return ""; }
}

// Favicon source. In a locked-down enterprise frontend this is an EXTERNAL
// request — either allowlist the favicon host in CSP/egress, proxy it through
// the Theo gateway, or rely on the globe fallback below.
function faviconFor(url) {
  const h = hostOf(url);
  return h ? `https://www.google.com/s2/favicons?domain=${h}&sz=64` : "";
}

function Globe({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
    </svg>
  );
}

function Favicon({ url, size = 13 }) {
  const [err, setErr] = useState(false);
  const src = faviconFor(url);
  if (err || !src) return <Globe size={size} />;
  return (
    <img
      src={src} alt="" width={size} height={size}
      onError={() => setErr(true)}
      style={{ display: "block", borderRadius: 3, flex: "0 0 auto" }}
    />
  );
}

/* ---- single citation chip -------------------------------------------------- */

function CitationMarker({ index, citation }) {
  const [open, setOpen] = useState(false);
  const closeT = useRef(null);

  const host = hostOf(citation.url);
  const show = () => { clearTimeout(closeT.current); setOpen(true); };
  const hide = () => { closeT.current = setTimeout(() => setOpen(false), 80); };

  return (
    <span style={{ position: "relative", whiteSpace: "nowrap" }}
          onMouseEnter={show} onMouseLeave={hide}>
      <a
        href={citation.url} target="_blank" rel="noopener noreferrer"
        onFocus={show} onBlur={hide}
        aria-label={`Source ${index}: ${citation.title || host} (${host})`}
        style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          verticalAlign: "baseline", margin: "0 1px", padding: "1px 5px 1px 4px",
          height: 17, lineHeight: "15px", borderRadius: 5,
          background: open ? C.chipBgHover : C.chipBg,
          border: `1px solid ${open ? C.border : "transparent"}`,
          textDecoration: "none", cursor: "pointer", transition: "background .12s, border-color .12s",
          position: "relative", top: -1,
        }}
      >
        <Favicon url={citation.url} />
        <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, color: C.muted }}>
          {index}
        </span>
      </a>

      {open && (
        <span role="tooltip"
          style={{
            position: "absolute", bottom: "calc(100% + 7px)", left: "50%",
            transform: "translateX(-50%)", width: 300, zIndex: 40,
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
            boxShadow: `0 8px 28px ${C.shadow}`, padding: 12, textAlign: "left",
            whiteSpace: "normal", cursor: "default",
          }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
            <Favicon url={citation.url} size={15} />
            <span style={{ fontFamily: SANS, fontSize: 11.5, color: C.muted,
                           overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {host}
            </span>
          </span>
          <span style={{ display: "block", fontFamily: SANS, fontSize: 13.5, fontWeight: 600,
                         color: C.text, lineHeight: 1.35, marginBottom: citation.cited_text ? 7 : 0 }}>
            {citation.title || citation.url}
          </span>
          {citation.cited_text && (
            <span style={{
              display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
              overflow: "hidden", fontFamily: SANS, fontSize: 12.5, color: C.muted,
              lineHeight: 1.45, borderLeft: `2px solid ${C.border}`, paddingLeft: 8,
            }}>
              {citation.cited_text}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

/* ---- a cited run: text + its trailing citation chips ----------------------- */
/* `runs` is your assistant message mapped to:
   [{ text: "...", citations: [ {url,title,cited_text}, ... ] }, ...]            */

export function CitedText({ runs, startIndex = 1 }) {
  let n = startIndex - 1;
  return (
    <span style={{ fontFamily: SANS, fontSize: 15.5, lineHeight: 1.7, color: C.text }}>
      {runs.map((run, ri) => (
        <span key={ri}>
          {run.text}
          {(run.citations || []).map((cit) => {
            n += 1;
            return <CitationMarker key={`${ri}-${n}`} index={n} citation={cit} />;
          })}
        </span>
      ))}
    </span>
  );
}

/* ---- live demo (default export) ------------------------------------------- */

export default function Demo() {
  const runs = [
    { text: "A transferee of a partnership interest must generally withhold 10% of the amount realized under \u00A71446(f).",
      citations: [
        { url: "https://www.irs.gov/individuals/international-taxpayers/section-1446f",
          title: "Section 1446(f) | Internal Revenue Service",
          cited_text: "A transferee must withhold a tax equal to 10% of the amount realized on the disposition of a partnership interest by a foreign person." },
      ] },
    { text: " Withholding is not required where the transferor certifies non-foreign status or another statutory exception applies.",
      citations: [
        { url: "https://www.irs.gov/instructions/i8288",
          title: "Instructions for Form 8288 (Rev. January 2026)",
          cited_text: "Exceptions to withholding apply where the transferor furnishes a certification of non-foreign status." },
        { url: "https://example-taxfirm.com/insights/1446f-certifications",
          title: "Navigating 1446(f) certifications for fund transfers",
          cited_text: "Funds commonly rely on the non-foreign certification exception to avoid over-withholding on secondary transfers." },
      ] },
  ];
  return (
    <div style={{ background: "#FAF9F5", padding: "40px 28px", minHeight: "100%" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: ".06em",
                      textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>
          Theo — citation rendering reference
        </div>
        <p style={{ margin: 0 }}>
          <CitedText runs={runs} />
        </p>
        <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.muted, marginTop: 24, lineHeight: 1.5 }}>
          Hover or tab to a chip to see the source card. Chips bind to the API
          <code style={{ fontFamily: "monospace", fontSize: 12 }}> citations[]</code> array.
        </div>
      </div>
    </div>
  );
}
