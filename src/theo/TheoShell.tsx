// TheoShell — the productionised Theo surface (VA-T1 VaultOriginShell). Outer layout +
// shared <style> block + view-switched header chrome; the per-view content is delegated to
// the split components. Faithful reproduction of the reference (no redesign; inline styles
// preserved). State + handlers come from useTheoState; the gateway/persistence are mocked
// behind theoClient.
import type { ReactNode } from "react";
import { C, SANS } from "./theme";
import { ASSISTANT_NAME, PRODUCT_NAME, WORKSPACE_NAME, MODEL_LABEL } from "./swapBlock";
import { NAV, STYLES, STARTERS } from "./data";
import { IcBack, IcClose } from "./components/icons";
import { Formatted } from "./lib/markdown";
import { splitAssistant } from "./lib/artifacts";
import { ArtifactCard } from "./components/ArtifactCard";
import { Sidebar } from "./components/Sidebar";
import { ChatView } from "./components/ChatView";
import { ProjectsView } from "./components/ProjectsView";
import { ProjectDetail } from "./components/ProjectDetail";
import { ArtifactsView } from "./components/ArtifactsView";
import { Customize } from "./components/Customize";
import { ArtifactPanel } from "./components/ArtifactPanel";
import { useTheoState } from "./useTheoState";

const STYLE_BLOCK = `
  * { box-sizing: border-box; }
  textarea::placeholder, input::placeholder { color: ${C.ink3}; }
  .vo-scroll::-webkit-scrollbar { width: 10px; }
  .vo-scroll::-webkit-scrollbar-thumb { background: ${C.line2}; border-radius: 8px; border: 3px solid transparent; background-clip: padding-box; }
  .vo-row:hover { background: rgba(0,0,0,0.04); }
  .vo-nav:hover { background: rgba(0,0,0,0.04); }
  .vo-send:hover:not(:disabled) { background: ${C.coralDk}; }
  .vo-new:hover { background: ${C.coralDk}; }
  .vo-chip:hover { background: ${C.coralSoft}; border-color: ${C.coral}; }
  .vo-card:hover { border-color: ${C.coral}; box-shadow: 0 4px 18px rgba(40,38,31,.07); }
  .vo-ghost:hover { background: rgba(0,0,0,0.04); }
  button:focus-visible, textarea:focus-visible, input:focus-visible { outline: 2px solid ${C.coral}; outline-offset: 2px; }
  textarea:focus, input:focus { outline: none; }
  @keyframes vo-bounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-4px);opacity:1} }
  @media (prefers-reduced-motion: reduce){ * { animation: none !important; transition: none !important; } }
  @media (max-width: 720px){ .vo-aside{ display:none !important; } .vo-panel{ position:absolute !important; inset:0 !important; width:100% !important; flex:none !important; z-index:20; } }
`;

export default function TheoShell() {
  const t = useTheoState();

  function renderAssistant(content: string): ReactNode {
    return splitAssistant(content).map((part, i) => {
      if (part.kind === "artifact") {
        const id = part.value;
        return <ArtifactCard key={i} artifact={t.artifacts.find((a) => a.id === id)} onOpen={() => t.openArtifact(id)} />;
      }
      return part.value.trim() ? <Formatted key={i} text={part.value} /> : null;
    });
  }

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", fontFamily: SANS, color: C.ink, background: C.bg, overflow: "hidden" }}>
      <style>{STYLE_BLOCK}</style>

      <Sidebar
        collapsed={t.collapsed} onToggleCollapse={t.toggleCollapse} view={t.view} onNavigate={t.go} nav={NAV}
        search={t.search} onSearch={t.setSearch} recents={t.recents} onSelectRecent={() => t.go("chats")}
        onNewChat={t.newChat} workspaceName={WORKSPACE_NAME} productName={PRODUCT_NAME}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 54, flexShrink: 0, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px" }}>
          {t.view === "chats" ? (<>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink2 }}>{MODEL_LABEL} <span style={{ color: C.ink3, fontSize: 11 }}>▾</span></span>
              {t.styleKey !== "normal" && <span style={{ fontSize: 12, color: C.coralDk, background: C.coralSoft, borderRadius: 999, padding: "3px 10px" }}>{t.activeStyle.label}</span>}
              {t.chatProject && <span style={{ fontSize: 12, color: C.ink2, background: C.coralTint, borderRadius: 999, padding: "3px 10px", display: "flex", alignItems: "center", gap: 6 }}>{t.chatProject.name}<span onClick={t.clearChatProject} style={{ cursor: "pointer", display: "flex" }}><IcClose s={12} /></span></span>}
            </div>
            <div style={{ fontSize: 12.5, color: C.ink3 }}>{ASSISTANT_NAME} in {PRODUCT_NAME}</div>
          </>) : (<div style={{ fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 9 }}>
            {t.view === "project" && <button onClick={() => t.go("projects")} style={{ background: "none", border: "none", cursor: "pointer", color: C.ink2, display: "flex", padding: 0 }}><IcBack s={20} /></button>}
            {t.view === "projects" && "Projects"}{t.view === "artifacts" && "Artifacts"}{t.view === "customize" && "Customize"}{t.view === "project" && t.detail?.name}
          </div>)}
        </header>

        <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            {t.view === "chats" && (
              <ChatView
                messages={t.messages} loading={t.loading} error={t.error} draft={t.draft}
                onDraftChange={t.setDraft} onSend={t.send} chatProject={t.chatProject}
                assistantName={ASSISTANT_NAME} greeting={t.greeting} starters={STARTERS} renderAssistant={renderAssistant}
              />
            )}
            {t.view === "projects" && (
              <ProjectsView projects={t.projects} npOpen={t.npOpen} np={t.np} onNpChange={t.setNp} onToggleNp={t.toggleNp} onCreate={t.createProject} onOpenProject={t.openProject} />
            )}
            {t.view === "project" && t.detail && (
              <ProjectDetail project={t.detail} kdraft={t.kdraft} onKdraftChange={t.setKdraft} onAddKnowledge={t.addKnowledge} onRemoveKnowledge={t.removeKnowledge} onPatchInstructions={t.patchInstructions} onStartChat={() => t.startInProject(t.detail!.id)} />
            )}
            {t.view === "artifacts" && (
              <ArtifactsView artifacts={t.artifacts} onOpenArtifact={t.openArtifact} />
            )}
            {t.view === "customize" && (
              <Customize styles={STYLES} styleKey={t.styleKey} onSelectStyle={t.selectStyle} custom={t.custom} onCustomChange={t.setCustom} onSave={t.save} saved={t.saved} productName={PRODUCT_NAME} />
            )}
          </div>

          {t.art && (
            <ArtifactPanel artifact={t.art} openVersion={t.openArt ? t.openArt.v : -1} onSelectVersion={t.selectVersion} onCopy={t.copyArt} copied={t.copied} onClose={t.closeArt} />
          )}
        </div>
      </main>
    </div>
  );
}
