// AgentActivity — the Claude-Code-style live agent view for tool-driven agents (first consumer: the
// Sigma K-1 review agent via sigma_review_agent_stream). Faithful reproduction of the VA-T7 reference
// (artifacts/theo-agent-activity-reference.jsx) — no redesign. Two states:
//   RUNNING — a live "activity" panel that streams the agent's reasoning and lists each tool call the
//             instant it fires (status dots: coral running · green done · red fail).
//   DONE    — the panel collapses to a one-line summary; the tool calls persist as deduped chips.
// Mounted ABOVE the assistant answer body in the chat turn (ChatView); the answer renders below.
// Zero-dependency, inline-style — the VA-T1 / VA-T5 idiom. Palette from ../theme (C) + the reference's
// green/red status colors (not in the VA-T1 palette). Event→prop mapping is done in useTheoState.
import { useState } from "react";
import { C, SANS, MONO } from "../theme";
import type { AgentToolCall } from "../types";

const GREEN = "#4f7a4a";
const RED = "#B23A2E";

export interface AgentActivityProps {
  running: boolean;
  reasoning: string;
  tools: AgentToolCall[];
  fund?: string;
  defaultOpen?: boolean;
}

// A single tool-call row inside the activity panel.
function ToolRow({ name, input, status }: AgentToolCall) {
  const dot = status === "done" ? GREEN : status === "fail" ? RED : C.coral;
  const label =
    input && typeof input === "object" && Object.keys(input as Record<string, unknown>).length
      ? `${name}(${Object.values(input as Record<string, unknown>).map((v) => (typeof v === "string" ? v : JSON.stringify(v))).join(", ")})`
      : `${name}()`;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", fontFamily: MONO, fontSize: 12 }}>
      <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0, ...(status === "running" ? { animation: "vaPulse 1s infinite" } : {}) }} />
      <span style={{ color: C.ink2 }}>→</span>
      <span style={{ color: C.ink, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={label}>{label}</span>
      {status === "done" && <span style={{ color: GREEN }}>✓</span>}
      {status === "fail" && <span style={{ color: RED }}>✕</span>}
    </div>
  );
}

// Persistent tool chips on a finished message. Deduped by name with a count.
function ToolChips({ tools }: { tools: AgentToolCall[] }) {
  const counts = tools.reduce<Record<string, number>>((m, t) => { m[t.name] = (m[t.name] || 0) + 1; return m; }, {});
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, marginBottom: 4 }}>
      {Object.entries(counts).map(([name, n]) => (
        <span key={name} style={{ fontFamily: MONO, fontSize: 11, color: C.ink2, background: C.card, border: `1px solid ${C.line}`, borderRadius: 999, padding: "2px 9px" }}>
          {name}{n > 1 ? ` ×${n}` : ""}
        </span>
      ))}
    </div>
  );
}

export function AgentActivity({ running, reasoning, tools, fund, defaultOpen }: AgentActivityProps) {
  const [open, setOpen] = useState(defaultOpen ?? running);
  const label = fund && fund.trim() ? fund.trim() : "the workbook set";
  return (
    <div>
      <style>{"@keyframes vaSpin{to{transform:rotate(360deg)}}@keyframes vaBlink{50%{opacity:0}}@keyframes vaPulse{50%{opacity:.35}}"}</style>
      <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, background: C.sidebar, marginBottom: 10, overflow: "hidden" }}>
        <button
          type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: SANS }}
        >
          {running
            ? <span aria-hidden style={{ width: 12, height: 12, border: `2px solid ${C.line}`, borderTopColor: C.coral, borderRadius: "50%", animation: "vaSpin .8s linear infinite", flexShrink: 0 }} />
            : <span aria-hidden style={{ color: GREEN, fontSize: 13 }}>✓</span>}
          <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: C.ink2 }}>
            {running ? `Reviewing ${label}…` : `Checked ${label} · ${tools.length} tool${tools.length === 1 ? "" : "s"}`}
          </span>
          <span aria-hidden style={{ color: C.ink3, fontSize: 12 }}>{open ? "▾" : "▸"}</span>
        </button>
        {open && (
          <div style={{ padding: "2px 12px 10px 12px" }}>
            {reasoning && (
              <div style={{ fontFamily: SANS, fontSize: 12.5, fontStyle: "italic", color: C.ink3, marginBottom: 8, lineHeight: 1.5 }}>
                {reasoning}{running && <span aria-hidden style={{ borderRight: `2px solid ${C.coral}`, marginLeft: 1, animation: "vaBlink 1s step-end infinite" }}>&nbsp;</span>}
              </div>
            )}
            {tools.map((t, i) => <ToolRow key={i} {...t} />)}
          </div>
        )}
      </div>
      {!running && tools.length > 0 && <ToolChips tools={tools} />}
    </div>
  );
}
