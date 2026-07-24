// Chat-header title + dropdown menu (Conversation-Star program). Claude-style: the active
// conversation's title sits top-left with a chevron; clicking opens a menu with Star / Rename /
// Add to project (submenu of the user's projects) / Delete. Rename is edit-in-place (the title
// becomes an input). Reuses the deployed conversation handlers via the passed callbacks; no browser
// storage. Only rendered for a saved conversation (an id exists). Hover is tracked in state so no new
// global CSS rule is needed. Reuses the VA-T1 icon set (+ IcStar/IcChevron) and theme tokens.
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { C, SANS } from "../theme";
import { IcStar, IcChevron, IcCompose, IcTrash, IcProjects } from "./icons";
import type { ConversationSummary, Project } from "../types";

function RenameInput({ initial, onCommit, onCancel }: { initial: string; onCommit: (next: string) => void; onCancel: () => void }) {
  const [v, setV] = useState(initial);
  const ref = useRef<HTMLInputElement>(null);
  const done = useRef(false);
  useEffect(() => { const el = ref.current; if (el) { el.focus(); el.select(); } }, []);
  const finish = (fn: () => void) => { if (done.current) return; done.current = true; fn(); };
  const commit = () => finish(() => { const t = v.trim(); if (t) onCommit(t); else onCancel(); });
  const cancel = () => finish(onCancel);
  return (
    <input
      ref={ref}
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={commit}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") { e.preventDefault(); commit(); } else if (e.key === "Escape") { e.preventDefault(); cancel(); } }}
      style={{ fontSize: 15, fontWeight: 600, color: C.ink, fontFamily: SANS, border: `1px solid ${C.line2}`, borderRadius: 8, padding: "3px 8px", maxWidth: 360, background: C.bg }}
    />
  );
}

export function ChatMenu({ conversation, projects, onRename, onDelete, onToggleStar, onAddToProject }: {
  conversation: ConversationSummary;
  projects: Project[];
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string, starred: boolean) => void;
  onAddToProject: (id: string, projectId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) { setOpen(false); setSubOpen(false); } };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const title = (conversation.title || "").trim() || "New chat";
  const starred = !!conversation.starred;
  const inProject = conversation.project_id != null;

  if (editing) {
    return <RenameInput initial={title} onCommit={(next) => { setEditing(false); if (next !== title) onRename(conversation.id, next); }} onCancel={() => setEditing(false)} />;
  }

  const item = (key: string, danger = false): CSSProperties => ({
    display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 12px",
    background: hover === key ? C.coralTint : "none", border: "none", cursor: "pointer",
    fontSize: 13.5, color: danger ? C.coralDk : C.ink, fontFamily: SANS, textAlign: "left", borderRadius: 8, whiteSpace: "nowrap",
  });
  const surface: CSSProperties = {
    minWidth: 224, background: C.bg, border: `1px solid ${C.line2}`, borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.14)", padding: 6, zIndex: 60,
  };

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        title={title}
        style={{ display: "flex", alignItems: "center", gap: 6, background: open ? C.coralTint : "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 8, fontSize: 15, fontWeight: 600, color: C.ink, fontFamily: SANS, maxWidth: 380 }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
        {starred && <span style={{ color: C.coralDk, display: "flex", flexShrink: 0 }}><IcStar s={13} filled /></span>}
        <span style={{ color: C.ink3, display: "flex", flexShrink: 0 }}><IcChevron s={16} /></span>
      </button>

      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, ...surface }}>
          <button style={item("star")} onMouseEnter={() => setHover("star")} onMouseLeave={() => setHover(null)}
            onClick={() => { setOpen(false); onToggleStar(conversation.id, !starred); }}>
            <IcStar s={16} filled={starred} /> {starred ? "Unstar" : "Star"}
          </button>
          <button style={item("rename")} onMouseEnter={() => setHover("rename")} onMouseLeave={() => setHover(null)}
            onClick={() => { setOpen(false); setEditing(true); }}>
            <IcCompose s={16} /> Rename
          </button>

          <div style={{ position: "relative" }}>
            <button style={item("proj")} onMouseEnter={() => { setHover("proj"); setSubOpen(true); }} onMouseLeave={() => setHover(null)}
              onClick={() => setSubOpen((v) => !v)}>
              <IcProjects s={16} /> Add to project <span style={{ marginLeft: "auto", color: C.ink3, paddingLeft: 12 }}>›</span>
            </button>
            {subOpen && (
              <div onMouseLeave={() => setSubOpen(false)} style={{ position: "absolute", top: -6, left: "calc(100% + 4px)", maxHeight: 320, overflowY: "auto", ...surface, zIndex: 61 }}>
                {projects.length === 0 && <div style={{ padding: "8px 12px", fontSize: 12.5, color: C.ink3 }}>No projects yet</div>}
                {projects.map((p) => {
                  const cur = conversation.project_id === p.id;
                  const disabled = inProject && !cur;
                  return (
                    <button key={p.id} disabled={disabled}
                      title={disabled ? "This chat is already in a project" : undefined}
                      style={{ ...item(`p:${p.id}`), opacity: disabled ? 0.5 : 1, cursor: disabled ? "default" : "pointer", maxWidth: 260 }}
                      onMouseEnter={() => setHover(`p:${p.id}`)} onMouseLeave={() => setHover(null)}
                      onClick={() => { if (disabled) return; setOpen(false); setSubOpen(false); if (!cur) onAddToProject(conversation.id, p.id); }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                      {cur && <span style={{ marginLeft: "auto", color: C.coralDk, paddingLeft: 12 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ height: 1, background: C.line2, margin: "6px 4px" }} />
          <button style={item("del", true)} onMouseEnter={() => setHover("del")} onMouseLeave={() => setHover(null)}
            onClick={() => { setOpen(false); if (window.confirm(`Delete chat "${title}"? This permanently removes the conversation and its messages.`)) onDelete(conversation.id); }}>
            <IcTrash s={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
