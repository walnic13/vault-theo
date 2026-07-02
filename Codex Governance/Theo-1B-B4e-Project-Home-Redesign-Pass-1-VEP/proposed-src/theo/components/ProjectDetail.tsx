// ProjectDetail — B4e project-home redesign. A project is a HOME for its chats: the primary surface
// is the project's chat list + "New chat in this project"; Project knowledge and Custom instructions
// are secondary, collapsible sections (expanded while the project has no chats yet, collapsed once it
// does — the Claude idiom). Consumes the live per-project chat list (theo_list_conversations?projectId,
// B4d) via the `chats` prop; selecting a chat reopens it (restoring the project). Knowledge/instructions
// editing is unchanged from B4c (now inside collapsibles). Tokens per VA-T1 (../theme).
import { useState } from "react";
import { C, SANS } from "../theme";
import { IcChat, IcCompose, IcDoc, IcTrash } from "./icons";
import { InputBox } from "./ui";
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

export function ProjectDetail({ project, chats, kdraft, onKdraftChange, onAddKnowledge, onRemoveKnowledge, onPatchInstructions, onStartChat, onSelectChat }: ProjectDetailProps) {
  // Adaptive default: sections start expanded while the project has no chats (setup-first), and
  // collapse once it has chats (chats-first) — until the user explicitly toggles (null = follow default).
  const hasChats = chats.length > 0;
  const [kOpen, setKOpen] = useState<boolean | null>(null);
  const [iOpen, setIOpen] = useState<boolean | null>(null);
  const knowledgeOpen = kOpen ?? !hasChats;
  const instructionsOpen = iOpen ?? !hasChats;

  return (
    <div className="vo-scroll" style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "26px 24px" }}>
        {project.desc && <p style={{ color: C.ink2, fontSize: 14, marginTop: 0, marginBottom: 18 }}>{project.desc}</p>}

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
            {chats.map((c) => (
              <div
                key={c.id} className="vo-row" onClick={() => onSelectChat(c.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer", borderBottom: `1px solid ${C.line}` }}
              >
                <span style={{ color: C.ink3, display: "flex", flexShrink: 0 }}><IcChat s={16} /></span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title || "Untitled chat"}</span>
              </div>
            ))}
          </div>
        )}

        {/* Collapsible: Project knowledge */}
        <Section title={`Project knowledge (${project.knowledge.length})`} open={knowledgeOpen} onToggle={() => setKOpen(!knowledgeOpen)}>
          {project.knowledge.map((d) => (
            <div key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
              <span style={{ color: C.ink3, marginTop: 2 }}><IcDoc s={17} /></span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{d.title}</div><div style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.45 }}>{d.content}</div></div>
              <button className="vo-ghost" onClick={() => onRemoveKnowledge(d.id)} title="Remove" style={{ background: "none", border: "none", cursor: "pointer", color: C.ink3, borderRadius: 6, padding: 4, display: "flex" }}><IcTrash s={15} /></button>
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <InputBox value={kdraft.title} onChange={(v) => onKdraftChange({ ...kdraft, title: v })} placeholder="Knowledge title" />
            <InputBox value={kdraft.content} onChange={(v) => onKdraftChange({ ...kdraft, content: v })} placeholder="Paste reference content the assistant should know" rows={2} />
            <div><button className="vo-chip" onClick={onAddKnowledge} style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 9, padding: "8px 14px", fontSize: 13, color: C.ink, cursor: "pointer", fontFamily: SANS }}>+ Add knowledge</button></div>
          </div>
          <div style={{ fontSize: 12, color: C.ink3, marginTop: 12 }}>Injected into context when you chat in this project (Azure AI Search / pgvector in production).</div>
        </Section>

        {/* Collapsible: Custom instructions */}
        <Section title="Custom instructions" open={instructionsOpen} onToggle={() => setIOpen(!instructionsOpen)}>
          <InputBox value={project.instructions} onChange={(v) => onPatchInstructions(v)} placeholder="How the assistant should behave in this project" rows={4} />
        </Section>
      </div>
    </div>
  );
}
