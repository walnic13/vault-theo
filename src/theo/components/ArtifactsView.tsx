// ArtifactsView — VA-T1 L434–455. Owns its scroll container (identical pixels).
import { C } from "../theme";
import { IcArtifacts, IcDoc } from "./icons";
import type { Artifact } from "../types";

export interface ArtifactsViewProps {
  artifacts: Artifact[];
  onOpenArtifact: (id: string) => void;
}

export function ArtifactsView({ artifacts, onOpenArtifact }: ArtifactsViewProps) {
  return (
    <div className="vo-scroll" style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "26px 24px" }}>
        <p style={{ color: C.ink2, fontSize: 14, marginTop: 0, marginBottom: 18 }}>Documents and tools the assistant has produced. Versioned in Blob, indexed in Postgres.</p>
        {artifacts.length === 0 ? (
          <div style={{ border: `1.5px dashed ${C.line2}`, borderRadius: 14, padding: "44px 24px", textAlign: "center", color: C.ink2 }}>
            <div style={{ color: C.ink3, display: "flex", justifyContent: "center", marginBottom: 12 }}><IcArtifacts s={30} /></div>
            Artifacts you create in chat will appear here. Try asking for an email, memo, or checklist.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
            {artifacts.map((a) => (<div key={a.id} className="vo-card" onClick={() => onOpenArtifact(a.id)} style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, padding: 18, cursor: "pointer", transition: "all .15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ color: C.coral }}><IcDoc s={18} /></span>
                <span style={{ fontSize: 11.5, color: C.ink3, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 999, padding: "2px 9px" }}>{a.type}{a.versions.length > 1 ? ` · v${a.versions.length}` : ""}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 6 }}>{a.title}</div>
              <div style={{ fontSize: 13, color: C.ink2, lineHeight: 1.5, minHeight: 38, overflow: "hidden" }}>{a.versions[a.versions.length - 1].content.replace(/[#*`]/g, "").slice(0, 96)}…</div>
            </div>))}
          </div>
        )}
      </div>
    </div>
  );
}
