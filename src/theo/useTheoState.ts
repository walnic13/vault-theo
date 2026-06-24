// App state + handlers for the Theo shell — ports VaultOriginShell's state/logic (VA-T1
// L155–237) but routes every backend-bound call through `theoClient` (the single service
// boundary). No browser storage; React/in-memory only.
import { useState } from "react";
import { theoClient } from "./services/theoClient";
import { stripArtifactRefs } from "./lib/artifacts";
import { buildSystemPrompt, greeting } from "./lib/prompt";
import { MODEL } from "./swapBlock";
import { RECENTS, STYLES } from "./data";
import type { Artifact, KDraft, Message, NpDraft, OpenArtifact, Project, Settings, StyleKey, View } from "./types";

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

  const detail = projects.find((p) => p.id === detailId) ?? null;
  const chatProject = projects.find((p) => p.id === chatProjectId) ?? null;
  const art = openArt ? (artifacts.find((a) => a.id === openArt.id) ?? null) : null;
  const recents = RECENTS.filter((r) => r.toLowerCase().includes(search.toLowerCase()));
  const activeStyle = STYLES.find((s) => s.key === styleKey) ?? STYLES[0];

  function go(v: View) { setView(v); setDetailId(null); }
  function newChat() { setMessages([]); setChatProjectId(null); go("chats"); }
  function startInProject(id: string) { setChatProjectId(id); setMessages([]); setView("chats"); setDetailId(null); }
  function openProject(id: string) { setDetailId(id); setView("project"); }

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
      });
      const reply = (res.content || []).filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n").trim();
      const { display, openId } = theoClient.ingestReply(reply);
      setArtifacts(theoClient.listArtifacts());
      setMessages((m) => [...m, { role: "assistant", content: display }]);
      if (openId) setOpenArt({ id: openId, v: -1 });
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
    styleKey, custom, saved, copied, npOpen, np, kdraft, recents, activeStyle,
    // setters / handlers
    go, toggleCollapse: () => setCollapsed((v) => !v), setSearch, setDraft, newChat, startInProject, openProject,
    clearChatProject: () => setChatProjectId(null), send,
    toggleNp: () => setNpOpen((v) => !v), setNp, createProject, patchInstructions, setKdraft, addKnowledge, removeKnowledge,
    selectStyle: setStyleKey, setCustom, save, copyArt,
    selectVersion: (v: number) => setOpenArt(openArt ? { id: openArt.id, v } : null),
    openArtifact: (id: string) => setOpenArt({ id, v: -1 }), closeArt: () => setOpenArt(null),
    greeting: greeting(),
  };
}
