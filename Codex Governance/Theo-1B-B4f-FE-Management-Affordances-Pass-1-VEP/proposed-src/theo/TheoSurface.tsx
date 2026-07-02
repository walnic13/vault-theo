// TheoSurface — Pass B federated root (VA-T4; VA-T2 §3A.5). The single Module-Federation-exposed
// surface (`theoApp/TheoSurface`). It owns the one `useTheoState` tree and renders two mountable
// regions — the nav (Sidebar → Origin 1/10 section) and the main view (TheoMain → Origin 9/10
// landing / right panel). When the Origin shell provides DOM slots it PORTALS each region into its
// slot (one state tree, no cross-mount sync — §3A.5); standalone (vault-theo-dev harness) it renders
// the faithful Pass-A inline layout. App-context arrives in-process via the `appContext` prop
// (App Host §6A / VA-T3 §4 — never postMessage); context-only, no app-data fetch.
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { C, SANS } from "./theme";
import { WORKSPACE_NAME, PRODUCT_NAME } from "./swapBlock";
import { NAV } from "./data";
import { Sidebar } from "./components/Sidebar";
import { TheoMain } from "./components/TheoMain";
import { DevContextInjector } from "./components/DevContextInjector";
import { useTheoState } from "./useTheoState";
import { theoClient } from "./services/theoClient";
import type { AppContext } from "./types";

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
  .vo-actions { opacity: 0; transition: opacity .12s; }
  .vo-row:hover .vo-actions, .vo-card:hover .vo-actions, .vo-actions:focus-within { opacity: 1; }
  button:focus-visible, textarea:focus-visible, input:focus-visible { outline: 2px solid ${C.coral}; outline-offset: 2px; }
  textarea:focus, input:focus { outline: none; }
  @keyframes vo-bounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-4px);opacity:1} }
  @media (prefers-reduced-motion: reduce){ * { animation: none !important; transition: none !important; } }
  @media (max-width: 720px){ .vo-aside{ display:none !important; } .vo-panel{ position:absolute !important; inset:0 !important; width:100% !important; flex:none !important; z-index:20; } }
`;

// The dev context-injector shows in the standalone harness when running `vite dev`
// (import.meta.env.DEV) OR when `?devctx` is present on the deployed dev-SWA harness (which
// serves a production build where DEV is false). It is never rendered in the Origin mount
// (that uses the portal branch), so it stays excluded from the real product.
function showDevInjector(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("devctx");
}

export interface TheoSurfaceProps {
  // Inbound app-context from the Origin shell (in-process; App Host §6A). Absent ⇒ standalone/none.
  appContext?: AppContext;
  // Shell-provided DOM slots for the hosted mount. When both present, nav + main are portaled into
  // them (Origin 1/10 + 9/10). When absent, TheoSurface renders the standalone inline layout.
  navSlot?: HTMLElement | null;
  mainSlot?: HTMLElement | null;
  // Origin shell's Entra token provider. When supplied, the chat gateway goes live (Bearer-auth to
  // the deployed model gateway); when absent (standalone harness), the gateway stays on the 1A mock.
  getAccessToken?: () => Promise<string | null>;
}

export default function TheoSurface({ appContext, navSlot, mainSlot, getAccessToken }: TheoSurfaceProps) {
  const t = useTheoState();
  const { ingestAppContext, loadRecents, loadProjects } = t;

  // Wire the live model gateway to the shell's token provider (mock → live), then load Recents and
  // Projects. configureGateway is synchronous, so the subsequent list calls run against the live
  // gateway when a provider is present (mock fallback otherwise). Both loaders are useCallback-stable.
  useEffect(() => {
    theoClient.configureGateway({ getAccessToken: getAccessToken ?? null });
    void loadRecents();
    void loadProjects();
  }, [getAccessToken, loadRecents, loadProjects]);

  // Sync inbound app-context into state (context-only; no fetch — VA-T3 §2.4).
  useEffect(() => {
    if (appContext) ingestAppContext(appContext);
  }, [appContext, ingestAppContext]);

  const nav = (
    <Sidebar
      collapsed={t.collapsed} onToggleCollapse={t.toggleCollapse} view={t.view} onNavigate={t.go} nav={NAV}
      search={t.search} onSearch={t.setSearch} recents={t.recents} onSelectRecent={t.selectRecent}
      onRenameRecent={t.renameConversation} onDeleteRecent={t.deleteConversation}
      onNewChat={t.newChat} workspaceName={WORKSPACE_NAME} productName={PRODUCT_NAME}
      fluid={!!(navSlot && mainSlot)}
    />
  );

  // Hosted: Origin provides the 1/10 nav slot + 9/10 main slot. Portal each region in; one state tree.
  if (navSlot && mainSlot) {
    return (
      <>
        <style>{STYLE_BLOCK}</style>
        {createPortal(nav, navSlot)}
        {createPortal(<TheoMain t={t} mode="panel" />, mainSlot)}
      </>
    );
  }

  // Standalone (vault-theo-dev harness): faithful Pass-A inline layout + DEV-only context injector.
  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", fontFamily: SANS, color: C.ink, background: C.bg, overflow: "hidden" }}>
      <style>{STYLE_BLOCK}</style>
      {nav}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TheoMain t={t} mode="full" />
      </main>
      {showDevInjector() && <DevContextInjector onInject={ingestAppContext} />}
    </div>
  );
}
