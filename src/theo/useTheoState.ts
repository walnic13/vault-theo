// App state + handlers for the Theo shell — ports VaultOriginShell's state/logic (VA-T1
// L155–237) but routes every backend-bound call through `theoClient` (the single service
// boundary). No browser storage; React/in-memory only.
import { useCallback, useState } from "react";
import { theoClient } from "./services/theoClient";
import { stripArtifactRefs } from "./lib/artifacts";
import { buildSystemPrompt, greeting } from "./lib/prompt";
import { MODEL } from "./swapBlock";
import { STYLES } from "./data";
import type { AppContext, Artifact, ConversationSummary, KDraft, Message, NpDraft, OpenArtifact, Project, Settings, StyleKey, View } from "./types";

export function useTheoState() {
  const seeded: Settings = theoClient.readSettings();
  const [view, setView] = useState<View>("chats");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>(() => theoClient.listProjects());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [chatProjectId, setChatProjectId] = useState<string | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>(() => theoClient.listArtifacts());
  const [openArt, setOpenArt] = useState<OpenArtifact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [styleKey, setStyleKey] = useState<StyleKey>(seeded.styleKey);
  const [custom, setCustom] = useState(seeded.custom);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [npOpen, setNpOpen] = useState(false);
  const [np, setNp] = useState<NpDraft>({ name: "", desc: "", instructions: "" });
  const [kdraft, setKdraft] = useState<KDraft>({ title: "", content: "" });
  const [appContext, setAppContext] = useState<AppContext>(() => theoClient.getAppContext());
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [recentsList, setRecentsList] = useState<ConversationSummary[]>([]);

  // Pass B: ingest the inbound app-context anchor (from the Origin shell, in-process) and carry it
  // on the conversation (in-memory). Presentational — no app-data fetch (VA-T3 §2.4).
  function ingestAppContext(ctx: AppContext) { setAppContext(ctx); theoClient.setAppContext(ctx); }

  const detail = projects.find((p) => p.id === detailId) ?? null;
  const chatProject = projects.find((p) => p.id === chatProjectId) ?? null;
  const art = openArt ? (artifacts.find((a) => a.id === openArt.id) ?? null) : null;
  const recents = recentsList.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  const activeStyle = STYLES.find((s) => s.key === styleKey) ?? STYLES[0];

  // Load the signed-in user's conversations for Recents (live → theo_list_conversations; mock fallback
  // in the standalone harness). useCallback-stable so TheoSurface's mount effect runs it once.
  const loadRecents = useCallback(async () => {
    try { setRecentsList(await theoClient.listConversations(50)); } catch { /* keep current list */ }
  }, []);

  function go(v: View) { setView(v); setDetailId(null); }
  function newChat() { setMessages([]); setConversationId(null); setChatProjectId(null); go("chats"); }
  function startInProject(id: string) { setChatProjectId(id); setMessages([]); setConversationId(null); setView("chats"); setDetailId(null); }
  function openProject(id: string) { setDetailId(id); setView("project"); }

  // Reload a persisted thread (B3b): rehydrate messages, mapping each assistant turn's persisted
  // citations to a single CitedRun so the existing CitedText path renders them (ChatView L53).
  async function selectRecent(id: string) {
    setError(""); setChatProjectId(null); setView("chats"); setDetailId(null);
    try {
      const d = await theoClient.getConversation(id);
      const msgs: Message[] = d.messages.map((m) => {
        const cites = Array.isArray(m.citations) ? m.citations : [];
        if (m.role === "assistant" && cites.length) {
          return {
            role: "assistant", content: m.content,
            runs: [{ text: m.content, citations: cites.map((c) => ({ url: c.url ?? "", title: c.title ?? "", cited_text: c.cited_text })) }],
          };
        }
        return { role: m.role, content: m.content };
      });
      setMessages(msgs); setConversationId(id);
    } catch {
      setError("Couldn't load that conversation.");
    }
  }

  async function send(textArg?: string) {
    const text = (textArg ?? draft).trim();
    if (!text || loading) return;
    setError("");
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next); setDraft(""); setLoading(true);
    try {
      const res = await theoClient.sendMessage({
        model: MODEL, max_tokens: 1500, system: buildSystemPrompt(styleKey, custom, chatProject),
        messages: next.map((m) => ({ role: m.role, content: stripArtifactRefs(m.content) })),
        ...(conversationId ? { conversation_id: conversationId } : {}),
        app_key: appContext.app_key, app_context: appContext.app_context,
      });
      const blocks = (res.content || []).filter((b) => b.type === "text");
      const reply = blocks.map((b) => b.text ?? "").join("\n").trim();
      // Map each text block to a cited run, preserving citation→span association as returned.
      const runs = blocks.map((b) => ({
        text: b.text ?? "",
        citations: (b.citations ?? []).map((c) => ({ url: c.url ?? "", title: c.title ?? "", cited_text: c.cited_text })),
      }));
      const hasCites = runs.some((r) => r.citations.length > 0);
      const { display, openId } = theoClient.ingestReply(reply);
      setArtifacts(theoClient.listArtifacts());
      setMessages((m) => [...m, { role: "assistant", content: display, ...(hasCites ? { runs } : {}) }]);
      if (openId) setOpenArt({ id: openId, v: -1 });
      if (res.conversation_id) setConversationId(res.conversation_id);
      void loadRecents();  // reflect the new/updated thread in Recents (newest-first)
    } catch {
      setError("Couldn't reach the assistant. Try again.");
      setMessages((m) => m.slice(0, -1)); setDraft(text);
    } finally { setLoading(false); }
  }

  function createProject() {
    if (!np.name.trim()) return;
    setProjects(theoClient.createProject(np));
    setNp({ name: "", desc: "", instructions: "" }); setNpOpen(false);
  }
  function patchInstructions(text: string) { if (detailId) setProjects(theoClient.patchInstructions(detailId, text)); }
  function addKnowledge() {
    if (!detailId || !kdraft.title.trim() || !kdraft.content.trim()) return;
    setProjects(theoClient.addKnowledge(detailId, kdraft));
    setKdraft({ title: "", content: "" });
  }
  function removeKnowledge(kid: string) { if (detailId) setProjects(theoClient.removeKnowledge(detailId, kid)); }

  function save() { theoClient.writeSettings({ styleKey, custom }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  async function copyArt() {
    if (!art) return;
    const vi = openArt && openArt.v >= 0 ? openArt.v : art.versions.length - 1;
    try { await navigator.clipboard.writeText(art.versions[vi].content); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard unavailable */ }
  }

  return {
    // state
    view, collapsed, search, projects, artifacts, detail, chatProject, art, openArt, messages, draft, loading, error,
    styleKey, custom, saved, copied, npOpen, np, kdraft, recents, activeStyle, appContext,
    // setters / handlers
    go, toggleCollapse: () => setCollapsed((v) => !v), setSearch, setDraft, newChat, startInProject, openProject,
    clearChatProject: () => setChatProjectId(null), send, ingestAppContext, selectRecent, loadRecents,
    toggleNp: () => setNpOpen((v) => !v), setNp, createProject, patchInstructions, setKdraft, addKnowledge, removeKnowledge,
    selectStyle: setStyleKey, setCustom, save, copyArt,
    selectVersion: (v: number) => setOpenArt(openArt ? { id: openArt.id, v } : null),
    openArtifact: (id: string) => setOpenArt({ id, v: -1 }), closeArt: () => setOpenArt(null),
    greeting: greeting(),
  };
}
