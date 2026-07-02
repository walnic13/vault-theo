import React, { useState, useRef, useEffect } from "react";

/* ────────────────────────────────────────────────────────────────────────
   VAULT ORIGIN — Claude-for-Teams shell (bridge build)
   Chats (live) · Projects (live: knowledge + instructions injected) ·
   Artifacts (live: model-generated, versioned, side panel) · Customize.
   Swap base URL + auth in send() for Azure Foundry.
   ─── SWAP BLOCK ──────────────────────────────────────────────────────── */
const ASSISTANT_NAME = "Claude";
const WORKSPACE_NAME = "Vault Group";
const PRODUCT_NAME   = "Origin";
const USER_NAME      = "";
const MODEL          = "claude-sonnet-4-6";
const MODEL_LABEL    = "Claude Sonnet 4.6";
const BASE_PROMPT =
  `You are ${ASSISTANT_NAME}, the assistant inside Vault Origin — the central hub for ` +
  `Vault Group, a UK-based US tax advisory firm serving VC, PE and real-estate funds and ` +
  `their non-US corporations with US subsidiaries. Be precise, concise and useful. Match ` +
  `the user's spelling. Never invent tax facts or figures — flag clearly when something ` +
  `needs review by a qualified preparer.`;
const ARTIFACT_RULES =
  ` When the user asks for a standalone deliverable (a document, memo, email, letter, ` +
  `checklist, table, summary, plan, or code), output it as an artifact wrapped EXACTLY like:\n` +
  `[[ARTIFACT title="Short Title" type="document"]]\n<content here>\n[[/ARTIFACT]]\n` +
  `Use type "document" for prose/markdown, "code" for code, "html" for a self-contained web ` +
  `snippet. Keep one short conversational sentence outside the markers. To revise an existing ` +
  `artifact, reuse the same exact title.`;
/* ──────────────────────────────────────────────────────────────────────── */

const C = {
  bg: "#FAF9F5", sidebar: "#F0EEE6", bubble: "#EDEAE0", card: "#FFFFFF",
  ink: "#28261F", ink2: "#6B6A63", ink3: "#94928A",
  line: "#E4E1D6", line2: "#D8D4C7",
  coral: "#D97757", coralDk: "#BD5D3A", coralSoft: "#F4E6DD", coralTint: "#EFE4DC",
};
const SANS = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
const SERIF = 'ui-serif,Georgia,"Times New Roman",serif';
const MONO = 'ui-monospace,SFMono-Regular,Menlo,monospace';
const SV = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const IcCompose = ({ s = 18 }) => (<svg {...SV} width={s} height={s}><path d="M12 20h9" /><path d="M16.4 3.6a2 2 0 0 1 2.8 2.8L7.6 18 3 19.5 4.5 15z" /></svg>);
const IcChat = ({ s = 18 }) => (<svg {...SV} width={s} height={s}><path d="M21 11.5a8.5 8.5 0 0 1-11.8 7.8L3 21l1.7-6.2A8.5 8.5 0 1 1 21 11.5Z" /></svg>);
const IcProjects = ({ s = 18 }) => (<svg {...SV} width={s} height={s}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg>);
const IcArtifacts = ({ s = 18 }) => (<svg {...SV} width={s} height={s}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /></svg>);
const IcCustomize = ({ s = 18 }) => (<svg {...SV} width={s} height={s}><path d="M4 6h7" /><path d="M16 6h4" /><circle cx="13.5" cy="6" r="2" /><path d="M4 12h4" /><path d="M13 12h7" /><circle cx="10.5" cy="12" r="2" /><path d="M4 18h7" /><path d="M16 18h4" /><circle cx="13.5" cy="18" r="2" /></svg>);
const IcSearch = ({ s = 16 }) => (<svg {...SV} width={s} height={s}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>);
const IcPanel = ({ s = 18 }) => (<svg {...SV} width={s} height={s}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>);
const IcDoc = ({ s = 18 }) => (<svg {...SV} width={s} height={s}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>);
const IcBack = ({ s = 18 }) => (<svg {...SV} width={s} height={s}><path d="m15 18-6-6 6-6" /></svg>);
const IcClose = ({ s = 18 }) => (<svg {...SV} width={s} height={s}><path d="M18 6 6 18M6 6l12 12" /></svg>);
const IcTrash = ({ s = 16 }) => (<svg {...SV} width={s} height={s}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>);

function Burst({ size = 22, color = C.coral }) {
  return (<svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true"><g fill={color}>
    {Array.from({ length: 12 }).map((_, i) => (<rect key={i} x="46.5" y="7" width="7" height="36" rx="3.5" transform={`rotate(${i * 30} 50 50)`} />))}
  </g></svg>);
}

function inline(s) {
  return s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i} style={{ fontWeight: 650 }}>{p.slice(2, -2)}</strong>;
    if (/^`[^`]+`$/.test(p)) return <code key={i} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 5, padding: "1px 5px", fontSize: "0.9em", fontFamily: MONO }}>{p.slice(1, -1)}</code>;
    return <span key={i}>{p}</span>;
  });
}
function Formatted({ text }) {
  return (<>{text.split(/\n\n+/).map((block, bi) => {
    const hm = block.match(/^(#{1,3})\s+(.*)$/);
    if (hm && !block.includes("\n")) {
      const sz = { 1: 20, 2: 17, 3: 15 }[hm[1].length];
      return <div key={bi} style={{ fontWeight: 650, fontSize: sz, margin: "16px 0 8px" }}>{inline(hm[2])}</div>;
    }
    const lines = block.split("\n");
    const isList = lines.length > 0 && lines.every((l) => /^\s*[-*]\s+/.test(l));
    if (isList) return (<ul key={bi} style={{ margin: "10px 0", paddingLeft: 22 }}>
      {lines.map((l, li) => <li key={li} style={{ margin: "5px 0", lineHeight: 1.6 }}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>)}
    </ul>);
    return (<p key={bi} style={{ margin: "0 0 12px", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
      {lines.map((l, li) => <React.Fragment key={li}>{inline(l)}{li < lines.length - 1 ? <br /> : null}</React.Fragment>)}
    </p>);
  })}</>);
}

function greeting() {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return USER_NAME ? `${part}, ${USER_NAME}` : part;
}

const STYLES = [
  { key: "normal", label: "Normal", desc: "Default responses", mod: "" },
  { key: "concise", label: "Concise", desc: "Brief and direct", mod: " Keep replies brief and direct." },
  { key: "explanatory", label: "Explanatory", desc: "Thorough and educational", mod: " Give thorough, educational answers that explain the reasoning." },
  { key: "formal", label: "Formal", desc: "Client-ready tone", mod: " Maintain a formal, client-ready professional tone." },
];
function buildSystemPrompt(styleKey, custom, project) {
  let p = BASE_PROMPT + (STYLES.find((s) => s.key === styleKey)?.mod || "") + ARTIFACT_RULES;
  if (custom.trim()) p += " Standing guidance from the team: " + custom.trim();
  if (project) {
    p += `\n\nYou are working inside the project "${project.name}". Project instructions: ${project.instructions || "(none)"}.`;
    if (project.knowledge.length) {
      p += " Project knowledge you may reference:\n";
      project.knowledge.forEach((k) => { p += `\n--- ${k.title} ---\n${k.content}\n`; });
    }
  }
  return p;
}

// pull [[ARTIFACT ...]]...[[/ARTIFACT]] blocks; return text with \0n\0 sentinels + blocks
function parseArtifacts(text) {
  const blocks = [];
  const re = /\[\[ARTIFACT([^\]]*)\]\]\s*([\s\S]*?)\s*\[\[\/ARTIFACT\]\]/g;
  const clean = text.replace(re, (m, attrs, body) => {
    const t = (attrs.match(/title="([^"]*)"/) || [])[1] || "Untitled";
    const ty = (attrs.match(/type="([^"]*)"/) || [])[1] || "document";
    blocks.push({ title: t.trim(), type: ty.trim(), content: body.trim() });
    return `\u0000${blocks.length - 1}\u0000`;
  }).trim();
  return { clean, blocks };
}
function upsert(arr, b) {
  const i = arr.findIndex((a) => a.title.toLowerCase() === b.title.toLowerCase());
  if (i >= 0) {
    const next = arr.slice();
    next[i] = { ...next[i], type: b.type, versions: [...next[i].versions, { content: b.content, ts: Date.now() }] };
    return { next, id: next[i].id };
  }
  const id = "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return { next: [{ id, title: b.title, type: b.type, versions: [{ content: b.content, ts: Date.now() }] }, ...arr], id };
}

const NAV = [
  { key: "chats", label: "Chats", Icon: IcChat },
  { key: "projects", label: "Projects", Icon: IcProjects },
  { key: "artifacts", label: "Artifacts", Icon: IcArtifacts },
  { key: "customize", label: "Customize", Icon: IcCustomize },
];
const RECENTS = ["Q2 K-1 status — Da Vinci Capital", "FIRPTA certificate mechanics", "Client update — HFL onboarding", "1446(f) withholding summary", "Luxembourg SCA classification"];
const STARTERS = ["Draft a client onboarding email", "Make a 1446(f) withholding checklist", "Summarise a K-1 engagement status"];
const INIT_PROJECTS = [
  { id: "p1", name: "Da Vinci Capital — 2025 K-1s", desc: "Engagement workspace for the 2025 K-1 cycle.", updated: "2d ago",
    instructions: "Treat all entity names as confidential. Default to US partnership tax framing. Flag any 1446(f) trigger.",
    knowledge: [
      { id: "k1", title: "Fund structure", content: "Da Vinci Fund III LP, Delaware. 2 US blocker corps. 41 LPs across US, UK, Lux. GP: Da Vinci Capital GP LLC." },
      { id: "k2", title: "Open items", content: "Investor allocation schedule pending final close adjustments. One LP transfer in Q3 may trigger 1446(f) review." },
    ] },
  { id: "p2", name: "HFL Fund Administration", desc: "Guernsey administrator partnership — shared reference and briefings.", updated: "5d ago",
    instructions: "HFL is Vault's closest partner. Keep tone collaborative and client-ready.",
    knowledge: [{ id: "k3", title: "Relationship", content: "HFL is a Guernsey fund administrator. Data exchanged via agreed spec. Joint onboarding checklist in use." }] },
  { id: "p3", name: "FIRPTA & 1446(f) Reference", desc: "Standing reference for withholding and certificate mechanics.", updated: "1w ago",
    instructions: "Always cite the governing section. Never state a withholding rate without confirming the fact pattern.",
    knowledge: [{ id: "k4", title: "Scope", content: "Covers FIRPTA certificates, 1445 and 1446(f) withholding mechanics, and partnership transfer reporting." }] },
];

export default function VaultOriginShell() {
  const [view, setView] = useState("chats");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState(INIT_PROJECTS);
  const [detailId, setDetailId] = useState(null);
  const [chatProjectId, setChatProjectId] = useState(null);
  const [artifacts, setArtifacts] = useState([]);
  const [openArt, setOpenArt] = useState(null);     // {id, v}
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [styleKey, setStyleKey] = useState("normal");
  const [custom, setCustom] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [npOpen, setNpOpen] = useState(false);
  const [np, setNp] = useState({ name: "", desc: "", instructions: "" });
  const [kdraft, setKdraft] = useState({ title: "", content: "" });
  const scroller = useRef(null);
  const taRef = useRef(null);

  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [messages, loading, view]);
  useEffect(() => { const ta = taRef.current; if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 200) + "px"; } }, [draft]);

  const detail = projects.find((p) => p.id === detailId);
  const chatProject = projects.find((p) => p.id === chatProjectId);
  const art = openArt ? artifacts.find((a) => a.id === openArt.id) : null;
  const railW = collapsed ? 58 : 270;
  const recents = RECENTS.filter((r) => r.toLowerCase().includes(search.toLowerCase()));
  const activeStyle = STYLES.find((s) => s.key === styleKey);

  async function send(textArg) {
    const text = (textArg ?? draft).trim();
    if (!text || loading) return;
    setError("");
    const next = [...messages, { role: "user", content: text }];
    setMessages(next); setDraft(""); setLoading(true);
    try {
      // Azure Foundry swap: base → https://<resource>.services.ai.azure.com/anthropic,
      // Entra keyless auth (managed identity) on your server-side proxy.
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL, max_tokens: 1500, system: buildSystemPrompt(styleKey, custom, chatProject),
          messages: next.map((m) => ({ role: m.role, content: m.content.replace(/\u0000A:[^\u0000]+\u0000/g, "") })),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      const { clean, blocks } = parseArtifacts(reply);
      let arr = artifacts; const ids = [];
      blocks.forEach((b) => { const r = upsert(arr, b); arr = r.next; ids.push(r.id); });
      if (blocks.length) setArtifacts(arr);
      const display = clean.replace(/\u0000(\d+)\u0000/g, (m, i) => `\u0000A:${ids[Number(i)]}\u0000`);
      setMessages((m) => [...m, { role: "assistant", content: display || "(no response)" }]);
      if (ids.length) setOpenArt({ id: ids[ids.length - 1], v: -1 });
    } catch {
      setError("Couldn't reach the assistant. Try again.");
      setMessages((m) => m.slice(0, -1)); setDraft(text);
    } finally { setLoading(false); }
  }

  function go(v) { setView(v); setDetailId(null); }
  function newChat() { setMessages([]); setChatProjectId(null); go("chats"); }
  function startInProject(id) { setChatProjectId(id); setMessages([]); setView("chats"); setDetailId(null); }
  function createProject() {
    if (!np.name.trim()) return;
    const id = "p" + Date.now().toString(36);
    setProjects((ps) => [{ id, name: np.name.trim(), desc: np.desc.trim() || "New project.", instructions: np.instructions.trim(), knowledge: [], updated: "just now" }, ...ps]);
    setNp({ name: "", desc: "", instructions: "" }); setNpOpen(false);
  }
  function patchProject(id, patch) { setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p))); }
  function addKnowledge(id) {
    if (!kdraft.title.trim() || !kdraft.content.trim()) return;
    setProjects((ps) => ps.map((p) => p.id === id ? { ...p, knowledge: [...p.knowledge, { id: "k" + Date.now().toString(36), title: kdraft.title.trim(), content: kdraft.content.trim() }] } : p));
    setKdraft({ title: "", content: "" });
  }
  function removeKnowledge(id, kid) { setProjects((ps) => ps.map((p) => p.id === id ? { ...p, knowledge: p.knowledge.filter((k) => k.id !== kid) } : p)); }
  async function copyArt() { try { await navigator.clipboard.writeText(curVer().content); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* sandbox */ } }
  function curVer() { const a = art; const vi = openArt.v < 0 ? a.versions.length - 1 : openArt.v; return a.versions[vi]; }

  const inputBox = (val, on, ph, rows = 1) => (
    <textarea value={val} onChange={(e) => on(e.target.value)} rows={rows} placeholder={ph}
      style={{ width: "100%", border: `1px solid ${C.line2}`, borderRadius: 10, padding: "10px 12px", fontFamily: SANS, fontSize: 14, color: C.ink, resize: "vertical", background: C.card, lineHeight: 1.5 }} />
  );

  const navBtn = (item) => {
    const active = view === item.key;
    return (<button onClick={() => go(item.key)} title={item.label} className="vo-nav" style={{
      display: "flex", alignItems: "center", gap: 11, width: "100%", justifyContent: collapsed ? "center" : "flex-start",
      padding: collapsed ? "9px 0" : "8px 10px", borderRadius: 9, border: "none", cursor: "pointer",
      background: active ? C.coralTint : "transparent", color: active ? C.ink : C.ink2,
      fontSize: 13.5, fontWeight: active ? 600 : 500, fontFamily: SANS }}>
      <item.Icon s={18} />{!collapsed && item.label}
    </button>);
  };

  function ArtifactCard({ id }) {
    const a = artifacts.find((x) => x.id === id);
    if (!a) return null;
    return (<div onClick={() => setOpenArt({ id, v: -1 })} style={{ display: "flex", alignItems: "center", gap: 12, background: C.card, border: `1px solid ${C.line2}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", margin: "4px 0 14px", maxWidth: 420 }}>
      <span style={{ color: C.coral }}><IcDoc s={22} /></span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
        <div style={{ fontSize: 12, color: C.ink3 }}>{a.type} · {a.versions.length > 1 ? `v${a.versions.length} · ` : ""}Click to open</div>
      </div>
    </div>);
  }

  function renderAssistant(content) {
    const parts = content.split(/(\u0000A:[^\u0000]+\u0000)/g);
    return parts.map((p, i) => {
      const m = p.match(/^\u0000A:([^\u0000]+)\u0000$/);
      if (m) return <ArtifactCard key={i} id={m[1]} />;
      return p.trim() ? <Formatted key={i} text={p} /> : null;
    });
  }

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", fontFamily: SANS, color: C.ink, background: C.bg, overflow: "hidden" }}>
      <style>{`
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
      `}</style>

      {/* Sidebar */}
      <aside className="vo-aside" style={{ width: railW, flexShrink: 0, background: C.sidebar, borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", transition: "width .18s" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", padding: "14px 12px 8px" }}>
          {!collapsed && (<div style={{ display: "flex", alignItems: "center", gap: 9, overflow: "hidden" }}>
            <Burst size={20} /><span style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>{WORKSPACE_NAME}</span><span style={{ color: C.ink3, fontSize: 12.5 }}>· {PRODUCT_NAME}</span>
          </div>)}
          <button onClick={() => setCollapsed((v) => !v)} title="Toggle sidebar" style={{ background: "none", border: "none", cursor: "pointer", color: C.ink3, padding: 4, display: "flex" }}><IcPanel s={18} /></button>
        </div>
        <div style={{ padding: collapsed ? "6px 9px" : "6px 12px" }}>
          <button className="vo-new" onClick={newChat} title="New chat" style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start", background: C.coral, color: "#fff", border: "none", borderRadius: 10, padding: collapsed ? "9px 0" : "9px 12px", fontSize: 13.5, fontWeight: 600, fontFamily: SANS }}>
            <IcCompose s={17} />{!collapsed && "New chat"}
          </button>
        </div>
        {!collapsed && (<div style={{ padding: "4px 12px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 9, padding: "7px 10px", color: C.ink3 }}>
            <IcSearch s={15} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" style={{ border: "none", background: "transparent", fontFamily: SANS, fontSize: 13, color: C.ink, width: "100%" }} />
          </div>
        </div>)}
        <nav style={{ padding: collapsed ? "2px 9px" : "2px 12px", display: "flex", flexDirection: "column", gap: 2 }}>{NAV.map((item) => <div key={item.key}>{navBtn(item)}</div>)}</nav>
        {!collapsed && (<>
          <div style={{ padding: "14px 18px 6px", fontSize: 11.5, letterSpacing: 0.4, textTransform: "uppercase", color: C.ink3, fontWeight: 600 }}>Recents</div>
          <div className="vo-scroll" style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
            {recents.map((ch, i) => (<div key={i} className="vo-row" onClick={() => go("chats")} style={{ padding: "8px 10px", borderRadius: 8, fontSize: 13.5, color: C.ink2, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ch}</div>))}
            {recents.length === 0 && <div style={{ padding: "8px 10px", fontSize: 13, color: C.ink3 }}>No matches.</div>}
          </div>
        </>)}
        {collapsed && <div style={{ flex: 1 }} />}
        <div style={{ borderTop: `1px solid ${C.line}`, padding: 10, display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.coral, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, flexShrink: 0 }}>V</div>
          {!collapsed && (<div style={{ lineHeight: 1.2 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{WORKSPACE_NAME}</div><div style={{ fontSize: 11.5, color: C.ink3 }}>Team plan · bridge</div></div>)}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 54, flexShrink: 0, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px" }}>
          {view === "chats" ? (<>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink2 }}>{MODEL_LABEL} <span style={{ color: C.ink3, fontSize: 11 }}>▾</span></span>
              {styleKey !== "normal" && <span style={{ fontSize: 12, color: C.coralDk, background: C.coralSoft, borderRadius: 999, padding: "3px 10px" }}>{activeStyle.label}</span>}
              {chatProject && <span style={{ fontSize: 12, color: C.ink2, background: C.coralTint, borderRadius: 999, padding: "3px 10px", display: "flex", alignItems: "center", gap: 6 }}>{chatProject.name}<span onClick={() => setChatProjectId(null)} style={{ cursor: "pointer", display: "flex" }}><IcClose s={12} /></span></span>}
            </div>
            <div style={{ fontSize: 12.5, color: C.ink3 }}>{ASSISTANT_NAME} in {PRODUCT_NAME}</div>
          </>) : (<div style={{ fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 9 }}>
            {view === "project" && <button onClick={() => go("projects")} style={{ background: "none", border: "none", cursor: "pointer", color: C.ink2, display: "flex", padding: 0 }}><IcBack s={20} /></button>}
            {view === "projects" && "Projects"}{view === "artifacts" && "Artifacts"}{view === "customize" && "Customize"}{view === "project" && detail?.name}
          </div>)}
        </header>

        <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div ref={scroller} className="vo-scroll" style={{ flex: 1, overflowY: "auto" }}>

              {/* CHATS */}
              {view === "chats" && (messages.length === 0 ? (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
                  <Burst size={40} />
                  <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 32, margin: "18px 0 6px", letterSpacing: -0.2 }}>{greeting()}</h1>
                  <p style={{ color: C.ink2, fontSize: 15, margin: "0 0 22px" }}>{chatProject ? `Working in ${chatProject.name}.` : "How can I help with your work today?"}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 520 }}>
                    {STARTERS.map((s) => <button key={s} className="vo-chip" onClick={() => send(s)} style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 999, padding: "8px 15px", fontSize: 13, color: C.ink2, cursor: "pointer", fontFamily: SANS }}>{s}</button>)}
                  </div>
                </div>
              ) : (
                <div style={{ maxWidth: 740, margin: "0 auto", padding: "28px 24px 8px" }}>
                  {messages.map((m, i) => m.role === "user" ? (
                    <div key={i} style={{ display: "flex", justifyContent: "flex-end", margin: "0 0 22px" }}>
                      <div style={{ background: C.bubble, borderRadius: 16, padding: "11px 16px", maxWidth: "82%", fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{m.content}</div>
                    </div>
                  ) : (
                    <div key={i} style={{ display: "flex", gap: 13, margin: "0 0 26px" }}>
                      <div style={{ marginTop: 2, flexShrink: 0 }}><Burst size={22} /></div>
                      <div style={{ fontSize: 15, paddingTop: 1, minWidth: 0, flex: 1 }}>{renderAssistant(m.content)}</div>
                    </div>
                  ))}
                  {loading && (<div style={{ display: "flex", gap: 13, margin: "0 0 26px" }}>
                    <div style={{ marginTop: 2 }}><Burst size={22} /></div>
                    <div style={{ display: "flex", gap: 5, paddingTop: 9 }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: C.ink3, display: "inline-block", animation: `vo-bounce 1.2s ${d * 0.16}s infinite ease-in-out` }} />)}</div>
                  </div>)}
                </div>
              ))}

              {/* PROJECTS */}
              {view === "projects" && (
                <div style={{ maxWidth: 920, margin: "0 auto", padding: "26px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <p style={{ color: C.ink2, fontSize: 14, margin: 0 }}>Workspaces that bundle chats, knowledge and instructions.</p>
                    <button className="vo-new" onClick={() => setNpOpen((v) => !v)} style={{ background: C.coral, color: "#fff", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>{npOpen ? "Cancel" : "+ New project"}</button>
                  </div>
                  {npOpen && (<div style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, padding: 18, marginBottom: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                    {inputBox(np.name, (v) => setNp({ ...np, name: v }), "Project name")}
                    {inputBox(np.desc, (v) => setNp({ ...np, desc: v }), "Short description")}
                    {inputBox(np.instructions, (v) => setNp({ ...np, instructions: v }), "Custom instructions for this project (optional)", 2)}
                    <div><button className="vo-new" onClick={createProject} style={{ background: C.coral, color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>Create project</button></div>
                  </div>)}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
                    {projects.map((p) => (<div key={p.id} className="vo-card" onClick={() => { setDetailId(p.id); setView("project"); }} style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, padding: 18, cursor: "pointer", transition: "all .15s" }}>
                      <div style={{ color: C.coral, marginBottom: 10 }}><IcProjects s={20} /></div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: C.ink2, lineHeight: 1.5, marginBottom: 14, minHeight: 38 }}>{p.desc}</div>
                      <div style={{ fontSize: 12, color: C.ink3 }}>{p.knowledge.length} docs · {p.updated}</div>
                    </div>))}
                  </div>
                </div>
              )}

              {/* PROJECT DETAIL */}
              {view === "project" && detail && (
                <div style={{ maxWidth: 820, margin: "0 auto", padding: "26px 24px" }}>
                  <p style={{ color: C.ink2, fontSize: 14, marginTop: 0 }}>{detail.desc}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 18 }}>
                    <div style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, padding: 18 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Project knowledge</div>
                      {detail.knowledge.map((d) => (<div key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
                        <span style={{ color: C.ink3, marginTop: 2 }}><IcDoc s={17} /></span>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{d.title}</div><div style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.45 }}>{d.content}</div></div>
                        <button className="vo-ghost" onClick={() => removeKnowledge(detail.id, d.id)} title="Remove" style={{ background: "none", border: "none", cursor: "pointer", color: C.ink3, borderRadius: 6, padding: 4, display: "flex" }}><IcTrash s={15} /></button>
                      </div>))}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                        {inputBox(kdraft.title, (v) => setKdraft({ ...kdraft, title: v }), "Knowledge title")}
                        {inputBox(kdraft.content, (v) => setKdraft({ ...kdraft, content: v }), "Paste reference content the assistant should know", 2)}
                        <div><button className="vo-chip" onClick={() => addKnowledge(detail.id)} style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 9, padding: "8px 14px", fontSize: 13, color: C.ink, cursor: "pointer", fontFamily: SANS }}>+ Add knowledge</button></div>
                      </div>
                      <div style={{ fontSize: 12, color: C.ink3, marginTop: 12 }}>Injected into context when you chat in this project (Azure AI Search / pgvector in production).</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      <div style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, padding: 18 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Custom instructions</div>
                        {inputBox(detail.instructions, (v) => patchProject(detail.id, { instructions: v }), "How the assistant should behave in this project", 4)}
                      </div>
                      <button onClick={() => startInProject(detail.id)} className="vo-new" style={{ background: C.coral, color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>Start a chat in this project</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ARTIFACTS */}
              {view === "artifacts" && (
                <div style={{ maxWidth: 920, margin: "0 auto", padding: "26px 24px" }}>
                  <p style={{ color: C.ink2, fontSize: 14, marginTop: 0, marginBottom: 18 }}>Documents and tools the assistant has produced. Versioned in Blob, indexed in Postgres.</p>
                  {artifacts.length === 0 ? (
                    <div style={{ border: `1.5px dashed ${C.line2}`, borderRadius: 14, padding: "44px 24px", textAlign: "center", color: C.ink2 }}>
                      <div style={{ color: C.ink3, display: "flex", justifyContent: "center", marginBottom: 12 }}><IcArtifacts s={30} /></div>
                      Artifacts you create in chat will appear here. Try asking for an email, memo, or checklist.
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
                      {artifacts.map((a) => (<div key={a.id} className="vo-card" onClick={() => setOpenArt({ id: a.id, v: -1 })} style={{ background: C.card, border: `1px solid ${C.line2}`, borderRadius: 14, padding: 18, cursor: "pointer", transition: "all .15s" }}>
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
              )}

              {/* CUSTOMIZE */}
              {view === "customize" && (
                <div style={{ maxWidth: 720, margin: "0 auto", padding: "26px 24px" }}>
                  <p style={{ color: C.ink2, fontSize: 14, marginTop: 0, marginBottom: 22 }}>Set how the assistant responds. Applies to your chats across {PRODUCT_NAME}.</p>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Writing style</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginBottom: 28 }}>
                    {STYLES.map((s) => { const on = styleKey === s.key; return (<button key={s.key} onClick={() => setStyleKey(s.key)} style={{ textAlign: "left", cursor: "pointer", background: on ? C.coralSoft : C.card, border: `1.5px solid ${on ? C.coral : C.line2}`, borderRadius: 12, padding: "13px 15px", fontFamily: SANS }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{s.label}</div><div style={{ fontSize: 12.5, color: C.ink2 }}>{s.desc}</div>
                    </button>); })}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Custom instructions</div>
                  <div style={{ fontSize: 13, color: C.ink2, marginBottom: 10 }}>Standing context for the team — entity conventions, tone, what to always flag.</div>
                  {inputBox(custom, setCustom, "e.g. Always use British spelling. Treat all client and fund names as confidential. Flag any cross-border withholding trigger.", 4)}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
                    <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="vo-new" style={{ background: C.coral, color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>Save</button>
                    {saved && <span style={{ fontSize: 13, color: C.coralDk }}>Saved — active in your next message.</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            {view === "chats" && (
              <div style={{ padding: "8px 24px 16px", flexShrink: 0 }}>
                <div style={{ maxWidth: 740, margin: "0 auto" }}>
                  {error && <div style={{ color: C.coralDk, fontSize: 13, marginBottom: 8, textAlign: "center" }}>{error}</div>}
                  <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 18, padding: "12px 14px", boxShadow: "0 2px 14px rgba(40,38,31,0.05)" }}>
                    <textarea ref={taRef} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} rows={1} placeholder={`Message ${ASSISTANT_NAME}…`} style={{ width: "100%", border: "none", resize: "none", fontFamily: SANS, fontSize: 15, color: C.ink, background: "transparent", lineHeight: 1.5, maxHeight: 200 }} />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                      <button className="vo-send" disabled={!draft.trim() || loading} onClick={() => send()} style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: draft.trim() && !loading ? C.coral : C.line2, color: "#fff", cursor: draft.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "background .15s" }}>↑</button>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 11.5, color: C.ink3, marginTop: 9 }}>{ASSISTANT_NAME} can make mistakes. Verify tax conclusions before relying on them.</div>
                </div>
              </div>
            )}
          </div>

          {/* Artifact panel */}
          {art && (
            <aside className="vo-panel" style={{ flex: "0 0 46%", minWidth: 380, borderLeft: `1px solid ${C.line}`, background: C.card, display: "flex", flexDirection: "column" }}>
              <div style={{ height: 52, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px 0 16px", flexShrink: 0 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{art.title}</div>
                  <div style={{ fontSize: 11.5, color: C.ink3 }}>{art.type}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {art.versions.length > 1 && (
                    <select value={openArt.v < 0 ? art.versions.length - 1 : openArt.v} onChange={(e) => setOpenArt({ id: art.id, v: Number(e.target.value) })} style={{ fontFamily: SANS, fontSize: 12.5, border: `1px solid ${C.line2}`, borderRadius: 8, padding: "4px 6px", color: C.ink2, background: "#fff" }}>
                      {art.versions.map((_, i) => <option key={i} value={i}>v{i + 1}</option>)}
                    </select>
                  )}
                  <button className="vo-ghost" onClick={copyArt} style={{ background: "none", border: `1px solid ${C.line2}`, borderRadius: 8, padding: "5px 10px", fontSize: 12.5, cursor: "pointer", color: C.ink2, fontFamily: SANS }}>{copied ? "Copied" : "Copy"}</button>
                  <button className="vo-ghost" onClick={() => setOpenArt(null)} title="Close" style={{ background: "none", border: "none", cursor: "pointer", color: C.ink2, padding: 5, display: "flex", borderRadius: 8 }}><IcClose s={18} /></button>
                </div>
              </div>
              <div className="vo-scroll" style={{ flex: 1, overflowY: "auto" }}>
                {art.type === "html" ? (
                  <iframe title={art.title} sandbox="allow-scripts" srcDoc={curVer().content} style={{ width: "100%", height: "100%", border: "none", background: "#fff" }} />
                ) : art.type === "code" ? (
                  <pre style={{ margin: 0, padding: 20, fontFamily: MONO, fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word", color: C.ink }}>{curVer().content}</pre>
                ) : (
                  <div style={{ padding: "22px 24px", fontSize: 14.5, color: C.ink }}><Formatted text={curVer().content} /></div>
                )}
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
