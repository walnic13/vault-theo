// ProjectDetail — B4e project-home redesign. A project is a HOME for its chats: the primary surface
// is the project's chat list + "New chat in this project"; Project knowledge and Custom instructions
// are secondary, collapsible sections (expanded while the project has no chats yet, collapsed once it
// does — the Claude idiom). Consumes the live per-project chat list (theo_list_conversations?projectId,
// B4d) via the `chats` prop; selecting a chat reopens it (restoring the project). Knowledge/instructions
// editing is unchanged from B4c (now inside collapsibles). Tokens per VA-T1 (../theme).
// B4f: each chat row gains hover-revealed manage actions — Rename (edit-in-place) and Delete (native
// confirm) — wired to theo_rename_conversation / theo_delete_conversation (deployed B4f), same as the
// Sidebar recents rows.
import { useState } from "react";
import { C, SANS } from "../theme";
import { IcChat, IcCompose, IcDoc, IcTrash } from "./icons";
import { InputBox } from "./ui";
import { InlineEdit, RowActions } from "./RowManage";
import type { ConversationSummary, KDraft, Project } from "../types";

export interface ProjectDetailProps {
  project: Project;
  chats: ConversationSummary[];                 // B4e: this project's conversations (theo_list_conversations?projectId)
  kdraft: KDraft;
  onKdraftChange: (next: KDraft) => void;
  onAddKnowledge: () => void;
  onRemoveKnowledge: (kid: string) => void;
  onPatchInstructions: (text: string) => void;
  onStartChat: () => void;                       // "+ New chat in this project"
  onSelectChat: (id: string) => void;            // B4e: open an existing project chat (restores the project)
  onRenameChat: (id: string, title: string) => void;   // B4f
  onDeleteChat: (id: string) => void;                   // B4f
  onPatchDescription: (text: string) => void;           // B4g: edit the project description (theo_update_project {id, description})
  onSetVisibility: (id: string, visibility: "private" | "group") => void;   // B5a: owner-only share toggle
}

// A collapsible section header (caret + title) with a conditional body. Local, inline — no new dep.
function Section({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, marginTop: 14 }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "14px 18px", fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.ink, textAlign: "left" }}
      >
        <span style={{ color: C.ink3, fontSize: 12, width: 12, display: "inline-block" }}>{open ? "▾" : "▸"}</span>
        {title}
      </button>
      {open && <div style={{ padding: "0 18px 18px" }}>{children}</div>}
    </div>
  );
}

export function ProjectDetail({ project, chats, kdraft, onKdraftChange, onAddKnowledge, onRemoveKnowledge, onPatchInstructions, onStartChat, onSelectChat, onRenameChat, onDeleteChat, onPatchDescription, onSetVisibility }: ProjectDetailProps) {
  // B5a: only the owner may edit config (description / knowledge / instructions / sharing). A
  // shared-with-me project (isOwner=false) is read-only + chattable — members see the config but can't
  // change it, and chat with their own conversations.
  const isOwner = project.isOwner;
  // Adaptive default: sections start expanded while the project has no chats (setup-first), and
  // collapse once it has chats (chats-first) — until the user explicitly toggles (null = follow default).
  const hasChats = chats.length > 0;
  const [kOpen, setKOpen] = useState<boolean | null>(null);
  const [iOpen, setIOpen] = useState<boolean | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);   // B4f: chat row being renamed in place
  const [descEditing, setDescEditing] = useState(false);             // B4g: description edited in place
  const knowledgeOpen = kOpen ?? !hasChats;
  const instructionsOpen = iOpen ?? !hasChats;

  return (
    <div className="vo-scroll" style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "26px 24px" }}>
        {/* B4g: editable project description (OWNER-only, B5a). Click to edit in place; Enter/blur saves
            (empty allowed to clear), Esc cancels. A shared-with-me project shows the description read-only. */}
        <div style={{ marginTop: 0, marginBottom: 14 }}>
          {isOwner && descEditing ? (
            <InlineEdit
              value={project.desc} editing allowEmpty
              onCommit={(next) => { setDescEditing(false); if (next !== project.desc) onPatchDescription(next); }}
              onCancel={() => setDescEditing(false)}
              inputStyle={{ fontSize: 14, color: C.ink2 }}
            />
          ) : isOwner ? (
            <p onClick={() => setDescEditing(true)} title="Edit description"
              style={{ color: project.desc ? C.ink2 : C.ink3, fontSize: 14, margin: 0, cursor: "text" }}>
              {project.desc || "Add a description…"}
            </p>
          ) : (
            project.desc ? <p style={{ color: C.ink2, fontSize: 14, margin: 0 }}>{project.desc}</p> : null
          )}
        </div>

        {/* B5a: sharing control. Owner → toggle private↔group. Member → read-only "shared with you" note. */}
        <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {isOwner ? (
            <>
              <span style={{ fontSize: 12.5, color: C.ink3 }}>Sharing</span>
              <button
                onClick={() => onSetVisibility(project.id, project.visibility === "group" ? "private" : "group")}
                title={project.visibility === "group" ? "Make private" : "Share with the team"}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontFamily: SANS, fontSize: 12.5, fontWeight: 600,
                  borderRadius: 999, padding: "5px 12px",
                  border: `1px solid ${project.visibility === "group" ? C.coral : C.line2}`,
                  background: project.visibility === "group" ? C.coralSoft : "#fff",
                  color: project.visibility === "group" ? C.coralDk : C.ink2,
                }}
              >
                {project.visibility === "group" ? "Shared with the team — click to make private" : "Private — click to share with the team"}
              </button>
            </>
          ) : (
            <span style={{ fontSize: 12.5, color: C.coralDk, background: C.coralSoft, borderRadius: 999, padding: "5px 12px", fontWeight: 600 }}>
              Shared with you · read-only — start a chat to use its knowledge
            </span>
          )}
        </div>

        {/* Chats-first: the project's conversations + new-chat */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Chats in this project</div>
          <button
            className="vo-new" onClick={onStartChat}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.coral, color: "#fff", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}
          >
            <IcCompose s={16} /> New chat
          </button>
        </div>

        {chats.length === 0 ? (
          <div style={{ background: C.card, border: `1px dashed ${C.line2}`, borderRadius: 14, padding: "22px 18px", textAlign: "center", color: C.ink2, fontSize: 13.5 }}>
            No chats yet — start one to use this project's knowledge and instructions.
          </div>
        ) : (
          <div style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, overflow: "hidden" }}>
            {chats.map((c) => {
              const editing = editingId === c.id;
              return (
                <div
                  key={c.id} className="vo-row" onClick={() => { if (!editing) onSelectChat(c.id); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer", borderBottom: `1px solid ${C.line}` }}
                >
                  <span style={{ color: C.ink3, display: "flex", flexShrink: 0 }}><IcChat s={16} /></span>
                  <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: C.ink, overflow: "hidden" }}>
                    <InlineEdit
                      value={c.title || "Untitled chat"} editing={editing}
                      onCommit={(next) => { setEditingId(null); if (next !== c.title) onRenameChat(c.id, next); }}
                      onCancel={() => setEditingId(null)}
                      labelStyle={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                      inputStyle={{ fontSize: 13.5 }}
                    />
                  </span>
                  {!editing && (
                    <RowActions
                      renameTitle="Rename chat" deleteTitle="Delete chat"
                      onRename={() => setEditingId(c.id)}
                      onDelete={() => { if (window.confirm(`Delete chat "${c.title || "Untitled chat"}"? This permanently removes the conversation and its messages.`)) onDeleteChat(c.id); }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Collapsible: Project knowledge */}
        <Section title={`Project knowledge (${project.knowledge.length})`} open={knowledgeOpen} onToggle={() => setKOpen(!knowledgeOpen)}>
          {project.knowledge.map((d) => (
            <div key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
              <span style={{ color: C.ink3, marginTop: 2 }}><IcDoc s={17} /></span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{d.title}</div><div style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.45 }}>{d.content}</div></div>
              {/* B5a: remove is owner-only */}
              {isOwner && <button className="vo-ghost" onClick={() => onRemoveKnowledge(d.id)} title="Remove" style={{ background: "none", border: "none", cursor: "pointer", color: C.ink3, borderRadius: 6, padding: 4, display: "flex" }}><IcTrash s={15} /></button>}
            </div>
          ))}
          {/* B5a: add-knowledge form is owner-only */}
          {isOwner && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              <InputBox value={kdraft.title} onChange={(v) => onKdraftChange({ ...kdraft, title: v })} placeholder="Knowledge title" />
              <InputBox value={kdraft.content} onChange={(v) => onKdraftChange({ ...kdraft, content: v })} placeholder="Paste reference content the assistant should know" rows={2} />
              <div><button className="vo-chip" onClick={onAddKnowledge} style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 9, padding: "8px 14px", fontSize: 13, color: C.ink, cursor: "pointer", fontFamily: SANS }}>+ Add knowledge</button></div>
            </div>
          )}
          {project.knowledge.length === 0 && !isOwner && <div style={{ fontSize: 12.5, color: C.ink3, padding: "8px 0" }}>No knowledge in this project yet.</div>}
          <div style={{ fontSize: 12, color: C.ink3, marginTop: 12 }}>Injected into context when you chat in this project (Azure AI Search / pgvector in production).</div>
        </Section>

        {/* Collapsible: Custom instructions (owner edits; member reads) */}
        <Section title="Custom instructions" open={instructionsOpen} onToggle={() => setIOpen(!instructionsOpen)}>
          {isOwner ? (
            <InputBox value={project.instructions} onChange={(v) => onPatchInstructions(v)} placeholder="How the assistant should behave in this project" rows={4} />
          ) : (
            <p style={{ fontSize: 13.5, color: project.instructions ? C.ink2 : C.ink3, lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" }}>{project.instructions || "No custom instructions."}</p>
          )}
        </Section>
      </div>
    </div>
  );
}
