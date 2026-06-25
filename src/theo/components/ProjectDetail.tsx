// ProjectDetail — VA-T1 L404–431. Owns its scroll container (identical pixels). The header
// back button is shared chrome in TheoMain (allowed split delta).
import { C, SANS } from "../theme";
import { IcDoc, IcTrash } from "./icons";
import { InputBox } from "./ui";
import type { KDraft, Project } from "../types";

export interface ProjectDetailProps {
  project: Project;
  kdraft: KDraft;
  onKdraftChange: (next: KDraft) => void;
  onAddKnowledge: () => void;
  onRemoveKnowledge: (kid: string) => void;
  onPatchInstructions: (text: string) => void;
  onStartChat: () => void;
}

export function ProjectDetail({ project, kdraft, onKdraftChange, onAddKnowledge, onRemoveKnowledge, onPatchInstructions, onStartChat }: ProjectDetailProps) {
  return (
    <div className="vo-scroll" style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "26px 24px" }}>
        <p style={{ color: C.ink2, fontSize: 14, marginTop: 0 }}>{project.desc}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 18 }}>
          <div style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, padding: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Project knowledge</div>
            {project.knowledge.map((d) => (<div key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
              <span style={{ color: C.ink3, marginTop: 2 }}><IcDoc s={17} /></span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{d.title}</div><div style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.45 }}>{d.content}</div></div>
              <button className="vo-ghost" onClick={() => onRemoveKnowledge(d.id)} title="Remove" style={{ background: "none", border: "none", cursor: "pointer", color: C.ink3, borderRadius: 6, padding: 4, display: "flex" }}><IcTrash s={15} /></button>
            </div>))}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              <InputBox value={kdraft.title} onChange={(v) => onKdraftChange({ ...kdraft, title: v })} placeholder="Knowledge title" />
              <InputBox value={kdraft.content} onChange={(v) => onKdraftChange({ ...kdraft, content: v })} placeholder="Paste reference content the assistant should know" rows={2} />
              <div><button className="vo-chip" onClick={onAddKnowledge} style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 9, padding: "8px 14px", fontSize: 13, color: C.ink, cursor: "pointer", fontFamily: SANS }}>+ Add knowledge</button></div>
            </div>
            <div style={{ fontSize: 12, color: C.ink3, marginTop: 12 }}>Injected into context when you chat in this project (Azure AI Search / pgvector in production).</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, padding: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Custom instructions</div>
              <InputBox value={project.instructions} onChange={(v) => onPatchInstructions(v)} placeholder="How the assistant should behave in this project" rows={4} />
            </div>
            <button onClick={onStartChat} className="vo-new" style={{ background: C.coral, color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>Start a chat in this project</button>
          </div>
        </div>
      </div>
    </div>
  );
}
