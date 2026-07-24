// Shared conversation-menu items (Conversation-Star program). One source of the Star / Rename /
// Add to project (submenu) / Delete list, used by BOTH the header title dropdown (ChatMenu) and the
// sidebar/recents row ellipsis menu (RowMenu) so they never drift. The trigger + open/close +
// click-outside live in the callers; this renders only the item buttons (+ the project submenu),
// and the caller passes `close` and `onStartRename` (header → inline title edit; row → row inline
// edit). `submenuSide` flips the project submenu to the left in the narrow sidebar. Hover is state
// (no global CSS). Reuses VA-T1 tokens/icons + the deployed conversation handlers via callbacks.
import { useState } from "react";
import type { CSSProperties } from "react";
import { C, SANS } from "../theme";
import { IcStar, IcCompose, IcTrash, IcProjects } from "./icons";
import type { ConversationSummary, Project } from "../types";

export function ConvMenuItems({ conversation, projects, submenuSide = "right", onToggleStar, onAddToProject, onDelete, onStartRename, close }: {
  conversation: ConversationSummary;
  projects: Project[];
  submenuSide?: "left" | "right";
  onToggleStar: (id: string, starred: boolean) => void;
  onAddToProject: (id: string, projectId: string) => void;
  onDelete: (id: string) => void;
  onStartRename: () => void;
  close: () => void;
}) {
  const [subOpen, setSubOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const starred = !!conversation.starred;
  const inProject = conversation.project_id != null;
  const title = (conversation.title || "").trim() || "this chat";

  const item = (key: string, danger = false): CSSProperties => ({
    display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 12px",
    background: hover === key ? C.coralTint : "none", border: "none", cursor: "pointer",
    fontSize: 13.5, color: danger ? C.coralDk : C.ink, fontFamily: SANS, textAlign: "left", borderRadius: 8, whiteSpace: "nowrap",
  });
  const subSurface: CSSProperties = {
    position: "absolute", top: -6, maxHeight: 320, overflowY: "auto", minWidth: 200,
    background: C.bg, border: `1px solid ${C.line2}`, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.14)", padding: 6, zIndex: 62,
    ...(submenuSide === "left" ? { right: "calc(100% + 4px)" } : { left: "calc(100% + 4px)" }),
  };

  return (
    <>
      <button style={item("star")} onMouseEnter={() => setHover("star")} onMouseLeave={() => setHover(null)}
        onClick={() => { close(); onToggleStar(conversation.id, !starred); }}>
        <IcStar s={16} filled={starred} /> {starred ? "Unstar" : "Star"}
      </button>
      <button style={item("rename")} onMouseEnter={() => setHover("rename")} onMouseLeave={() => setHover(null)}
        onClick={() => { close(); onStartRename(); }}>
        <IcCompose s={16} /> Rename
      </button>
      <div style={{ position: "relative" }}>
        <button style={item("proj")} onMouseEnter={() => { setHover("proj"); setSubOpen(true); }} onMouseLeave={() => setHover(null)}
          onClick={() => setSubOpen((v) => !v)}>
          <IcProjects s={16} /> Add to project <span style={{ marginLeft: "auto", color: C.ink3, paddingLeft: 12 }}>{submenuSide === "left" ? "‹" : "›"}</span>
        </button>
        {subOpen && (
          <div onMouseLeave={() => setSubOpen(false)} style={subSurface}>
            {projects.length === 0 && <div style={{ padding: "8px 12px", fontSize: 12.5, color: C.ink3 }}>No projects yet</div>}
            {projects.map((p) => {
              const cur = conversation.project_id === p.id;
              const disabled = inProject && !cur;
              return (
                <button key={p.id} disabled={disabled}
                  title={disabled ? "This chat is already in a project" : undefined}
                  style={{ ...item(`p:${p.id}`), opacity: disabled ? 0.5 : 1, cursor: disabled ? "default" : "pointer", maxWidth: 260 }}
                  onMouseEnter={() => setHover(`p:${p.id}`)} onMouseLeave={() => setHover(null)}
                  onClick={() => { if (disabled) return; close(); setSubOpen(false); if (!cur) onAddToProject(conversation.id, p.id); }}>
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
        onClick={() => { close(); if (window.confirm(`Delete chat "${title}"? This permanently removes the conversation and its messages.`)) onDelete(conversation.id); }}>
        <IcTrash s={16} /> Delete
      </button>
    </>
  );
}
