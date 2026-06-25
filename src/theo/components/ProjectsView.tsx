// ProjectsView — VA-T1 L380–401. Owns its scroll container (identical pixels).
import { C, SANS } from "../theme";
import { IcProjects } from "./icons";
import { InputBox } from "./ui";
import type { NpDraft, Project } from "../types";

export interface ProjectsViewProps {
  projects: Project[];
  npOpen: boolean;
  np: NpDraft;
  onNpChange: (next: NpDraft) => void;
  onToggleNp: () => void;
  onCreate: () => void;
  onOpenProject: (id: string) => void;
}

export function ProjectsView({ projects, npOpen, np, onNpChange, onToggleNp, onCreate, onOpenProject }: ProjectsViewProps) {
  return (
    <div className="vo-scroll" style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "26px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <p style={{ color: C.ink2, fontSize: 14, margin: 0 }}>Workspaces that bundle chats, knowledge and instructions.</p>
          <button className="vo-new" onClick={onToggleNp} style={{ background: C.coral, color: "#fff", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>{npOpen ? "Cancel" : "+ New project"}</button>
        </div>
        {npOpen && (<div style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, padding: 18, marginBottom: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <InputBox value={np.name} onChange={(v) => onNpChange({ ...np, name: v })} placeholder="Project name" />
          <InputBox value={np.desc} onChange={(v) => onNpChange({ ...np, desc: v })} placeholder="Short description" />
          <InputBox value={np.instructions} onChange={(v) => onNpChange({ ...np, instructions: v })} placeholder="Custom instructions for this project (optional)" rows={2} />
          <div><button className="vo-new" onClick={onCreate} style={{ background: C.coral, color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>Create project</button></div>
        </div>)}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
          {projects.map((p) => (<div key={p.id} className="vo-card" onClick={() => onOpenProject(p.id)} style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, padding: 18, cursor: "pointer", transition: "all .15s" }}>
            <div style={{ color: C.coral, marginBottom: 10 }}><IcProjects s={20} /></div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontSize: 13, color: C.ink2, lineHeight: 1.5, marginBottom: 14, minHeight: 38 }}>{p.desc}</div>
            <div style={{ fontSize: 12, color: C.ink3 }}>{p.knowledge.length} docs · {p.updated}</div>
          </div>))}
        </div>
      </div>
    </div>
  );
}
