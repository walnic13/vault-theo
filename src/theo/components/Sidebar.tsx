// Sidebar — VA-T1 L297–328. Presentational; state + handlers come from TheoSurface (Pass B).
import { C, SANS } from "../theme";
import { Burst, IcCompose, IcSearch, IcPanel } from "./icons";
import type { NavItem, View } from "../types";

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  view: View;
  onNavigate: (v: View) => void;
  nav: NavItem[];
  search: string;
  onSearch: (s: string) => void;
  recents: { id: string; title: string }[];
  onSelectRecent: (id: string) => void;
  onNewChat: () => void;
  workspaceName: string;
  productName: string;
  // Pass C (hosted-nav fit): when hosted in the Origin 1/10 slot, the aside fills the slot
  // (width:100%) instead of the fixed 270/58 standalone rail — VA-T2 §3A.2 / VA-T3 §4. Set by
  // TheoSurface only in the portaled branch; absent/false standalone (VA-T1 270 rail preserved).
  fluid?: boolean;
}

export function Sidebar(props: SidebarProps) {
  const { collapsed, onToggleCollapse, view, onNavigate, nav, search, onSearch, recents, onSelectRecent, onNewChat, workspaceName, productName, fluid } = props;
  const railW = collapsed ? 58 : 270;

  const navBtn = (item: NavItem) => {
    const active = view === item.key;
    return (
      <button onClick={() => onNavigate(item.key)} title={item.label} className="vo-nav" style={{
        display: "flex", alignItems: "center", gap: 11, width: "100%", justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? "9px 0" : "8px 10px", borderRadius: 9, border: "none", cursor: "pointer",
        background: active ? C.coralTint : "transparent", color: active ? C.ink : C.ink2,
        fontSize: 13.5, fontWeight: active ? 600 : 500, fontFamily: SANS }}>
        <item.Icon s={18} />{!collapsed && item.label}
      </button>
    );
  };

  return (
    <aside className="vo-aside" style={{ width: fluid ? "100%" : railW, maxWidth: "100%", boxSizing: "border-box", flexShrink: 0, background: C.sidebar, borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", transition: "width .18s" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", padding: "14px 12px 8px" }}>
        {!collapsed && (<div style={{ display: "flex", alignItems: "center", gap: 9, overflow: "hidden" }}>
          <Burst size={20} /><span style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>{workspaceName}</span><span style={{ color: C.ink3, fontSize: 12.5 }}>· {productName}</span>
        </div>)}
        <button onClick={onToggleCollapse} title="Toggle sidebar" style={{ background: "none", border: "none", cursor: "pointer", color: C.ink3, padding: 4, display: "flex" }}><IcPanel s={18} /></button>
      </div>
      <div style={{ padding: collapsed ? "6px 9px" : "6px 12px" }}>
        <button className="vo-new" onClick={onNewChat} title="New chat" style={{ width: "100%", maxWidth: fluid && !collapsed ? 246 : undefined, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 9, cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start", background: C.coral, color: "#fff", border: "none", borderRadius: 10, padding: collapsed ? "9px 0" : "9px 12px", fontSize: 13.5, fontWeight: 600, fontFamily: SANS }}>
          <IcCompose s={17} />{!collapsed && "New chat"}
        </button>
      </div>
      {!collapsed && (<div style={{ padding: "4px 12px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: fluid ? 246 : undefined, boxSizing: "border-box", background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 9, padding: "7px 10px", color: C.ink3 }}>
          <IcSearch s={15} /><input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search" style={{ border: "none", background: "transparent", fontFamily: SANS, fontSize: 13, color: C.ink, width: "100%" }} />
        </div>
      </div>)}
      <nav style={{ padding: collapsed ? "2px 9px" : "2px 12px", display: "flex", flexDirection: "column", gap: 2 }}>{nav.map((item) => <div key={item.key}>{navBtn(item)}</div>)}</nav>
      {!collapsed && (<>
        <div style={{ padding: "14px 18px 6px", fontSize: 11.5, letterSpacing: 0.4, textTransform: "uppercase", color: C.ink3, fontWeight: 600 }}>Recents</div>
        <div className="vo-scroll" style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
          {recents.map((ch) => (<div key={ch.id} className="vo-row" onClick={() => onSelectRecent(ch.id)} style={{ padding: "8px 10px", borderRadius: 8, fontSize: 13.5, color: C.ink2, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ch.title}</div>))}
          {recents.length === 0 && <div style={{ padding: "8px 10px", fontSize: 13, color: C.ink3 }}>No matches.</div>}
        </div>
      </>)}
      {collapsed && <div style={{ flex: 1 }} />}
      <div style={{ borderTop: `1px solid ${C.line}`, padding: 10, display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.coral, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, flexShrink: 0 }}>V</div>
        {!collapsed && (<div style={{ lineHeight: 1.2 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{workspaceName}</div><div style={{ fontSize: 11.5, color: C.ink3 }}>Team plan · bridge</div></div>)}
      </div>
    </aside>
  );
}
