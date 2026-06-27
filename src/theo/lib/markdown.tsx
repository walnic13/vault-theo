// Lightweight markdown rendering — ported verbatim from VA-T1 (L59–82).
import { Fragment } from "react";
import type { ReactNode } from "react";
import { C, MONO } from "../theme";

export function inline(s: string): ReactNode {
  return s.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).filter(Boolean).map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i} style={{ fontWeight: 650 }}>{p.slice(2, -2)}</strong>;
    if (/^`[^`]+`$/.test(p)) return <code key={i} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 5, padding: "1px 5px", fontSize: "0.9em", fontFamily: MONO }}>{p.slice(1, -1)}</code>;
    const lm = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (lm) return <a key={i} href={lm[2]} target="_blank" rel="noopener noreferrer" style={{ color: C.coral, textDecoration: "underline" }}>{lm[1]}</a>;
    return <span key={i}>{p}</span>;
  });
}

export function Formatted({ text }: { text: string }) {
  return (<>{text.split(/\n\n+/).map((block, bi) => {
    const hm = block.match(/^(#{1,3})\s+(.*)$/);
    if (hm && !block.includes("\n")) {
      const sz = ({ 1: 20, 2: 17, 3: 15 } as Record<number, number>)[hm[1].length];
      return <div key={bi} style={{ fontWeight: 650, fontSize: sz, margin: "16px 0 8px" }}>{inline(hm[2])}</div>;
    }
    const lines = block.split("\n");
    const isList = lines.length > 0 && lines.every((l) => /^\s*[-*]\s+/.test(l));
    if (isList) return (<ul key={bi} style={{ margin: "10px 0", paddingLeft: 22 }}>
      {lines.map((l, li) => <li key={li} style={{ margin: "5px 0", lineHeight: 1.6 }}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>)}
    </ul>);
    return (<p key={bi} style={{ margin: "0 0 12px", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
      {lines.map((l, li) => <Fragment key={li}>{inline(l)}{li < lines.length - 1 ? <br /> : null}</Fragment>)}
    </p>);
  })}</>);
}
