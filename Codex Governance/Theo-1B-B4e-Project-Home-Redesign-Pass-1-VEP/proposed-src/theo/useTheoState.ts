// App state + handlers for the Theo shell — ports VaultOriginShell's state/logic (VA-T1
// L155–237) but routes every backend-bound call through `theoClient` (the single service
// boundary). No browser storage; React/in-memory only.
import { useCallback, useRef, useState } from "react";
import { theoClient } from "./services/theoClient";
import { stripArtifactRefs } from "./lib/artifacts";
import { buildSystemPrompt, greeting } from "./lib/prompt";
import { MODEL } from "./swapBlock";
import { STYLES } from "./data";
import type { AppContext, Artifact, Citation, ComposerAttachment, ConversationSummary, KDraft, Message, NpDraft, OpenArtifact, Project, SentAttachment, Settings, StyleKey, View } from "./types";

// B8e: a paste longer than this becomes a "Pasted text" attachment (collapsed, expandable) instead
// of flooding the composer — the Claude-style behaviour. Tunable; ~a long block, not a sentence.
const PASTE_AS_ATTACHMENT_CHARS = 1500;
// B4c: debounce for persisting project-instruction edits (avoids a PATCH per keystroke — the
// keystroke updates local state immediately; the network save fires once typing pauses).
const INSTRUCTIONS_SAVE_DEBOUNCE_MS = 800;

let attCounter = 0;
function newLocalId() { attCounter += 1; return "att" + Date.now().toString(36) + "_" + attCounter; }

export function useTheoState() {
  const seeded: Settings = theoClient.readSettings();
  const [view, setView] = useState<View>("chats");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);   // B4c: loaded live on mount (was in-memory seed)
  const [detailId, setDetailId] = useState<string | null>(null);
  // B4d: the chat's active project is a SELF-CONTAINED held object (metadata + its knowledge), NOT
  // derived from the `projects` list — so an empty/late list or a later loadProjects() (which maps
  // knowledge:[]) can never strip the active chat's project context (Codex B4d-FE finding).
  const [chatProject, setChatProject] = useState<Project | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>(() => theoClient.listArtifacts());
  const [openArt, setOpenArt] = useState<OpenArtifact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
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
  // B4e: the open project's chats, KEYED by projectId so a slow/stale async load can neither show
  // nor overwrite another project's list (Codex B4e finding). A request ref guards the async setter;
  // the derived `projectChats` (below) only surfaces chats whose projectId matches the open detail.
  const [projectChatsState, setProjectChatsState] = useState<{ projectId: string; chats: ConversationSummary[] } | null>(null);
  const instrTimer = useRef<ReturnType<typeof setTimeout> | null>(null);  // B4c: instruction-save debounce
  const projectChatsReq = useRef<string | null>(null);                    // B4e: latest-opened project id (guards the chats load)

  // Pass B: ingest the inbound app-context anchor (from the Origin shell, in-process) and carry it
  // on the conversation (in-memory). Presentational — no app-data fetch (VA-T3 §2.4).
  function ingestAppContext(ctx: AppContext) { setAppContext(ctx); theoClient.setAppContext(ctx); }

  const detail = projects.find((p) => p.id === detailId) ?? null;
  // B4e: surface only the OPEN project's own chats — a stale/other-project load resolves into
  // projectChatsState keyed by its own id, so it never renders here unless it matches detailId.
  const projectChats = projectChatsState && projectChatsState.projectId === detailId ? projectChatsState.chats : [];
  const art = openArt ? (artifacts.find((a) => a.id === openArt.id) ?? null) : null;
  const recents = recentsList.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  const activeStyle = STYLES.find((s) => s.key === styleKey) ?? STYLES[0];

  // Load the signed-in user's conversations for Recents (live → theo_list_conversations; mock fallback
  // in the standalone harness). useCallback-stable so TheoSurface's mount effect runs it once.
  const loadRecents = useCallback(async () => {
    try { setRecentsList(await theoClient.listConversations(50)); } catch { /* keep current list */ }
  }, []);

  // B4c: load the signed-in user's projects (live → theo_list_projects; mock fallback). Called by
  // TheoSurface's mount effect right after configureGateway (same reason as loadRecents — so the
  // first call runs against the live gateway once the Origin token is set). Knowledge is loaded
  // per-project on open (theo_list_projects omits it).
  const loadProjects = useCallback(async () => {
    try { setProjects(await theoClient.listProjects()); } catch { /* keep current list */ }
  }, []);

  // B4c: (re)load one project's knowledge items into state (theo_list_project_knowledge). Best-effort.
  const refreshProjectKnowledge = useCallback(async (id: string) => {
    try {
      const items = await theoClient.listProjectKnowledge(id);
      setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, knowledge: items } : p)));
    } catch { /* keep current knowledge */ }
  }, []);

  // B4e: load the open project's chats (theo_list_conversations?projectId), keyed by projectId. The
  // request ref guards the setter: a response only lands if its project is still the latest opened —
  // so a slow load for a since-closed project can't clobber the current one's list.
  const loadProjectChats = useCallback(async (id: string) => {
    try {
      const chats = await theoClient.listProjectConversations(id);
      if (projectChatsReq.current === id) setProjectChatsState({ projectId: id, chats });
    } catch {
      if (projectChatsReq.current === id) setProjectChatsState({ projectId: id, chats: [] });
    }
  }, []);

  // B4d: load the chat's active project as a self-contained object (metadata + knowledge) held in
  // `chatProject`, independent of the `projects` list ordering/timing — so neither an empty/late list
  // nor a later loadProjects() (which maps knowledge:[]) can strip the active chat's context.
  // METADATA (name/desc/instructions) prefers the LOCAL `projects` entry when present: it holds any
  // un-saved optimistic instruction edit (patchInstructions is debounced 800ms), so a chat started
  // right after an edit uses the fresh local instructions, not stale server ones (Codex B4d-FE
  // finding); it falls back to a fresh server list only when the project isn't loaded locally.
  // KNOWLEDGE is always from the server (add/remove are immediate, hence authoritative). Awaited by
  // startInProject and reload-restore, so the next `send` sees full, current project context.
  // Returns true only if the REQUESTED project was actually loaded. FAILS CLOSED: on any error (or a
  // project that can't be resolved) it clears chatProject to null rather than leaving a prior/other
  // project active — so a failed switch can never start a chat with the wrong project's context, nor
  // tag the conversation to the wrong project (Codex B4d-FE finding). Callers gate switching/tagging
  // on the returned boolean.
  async function loadChatProject(id: string): Promise<boolean> {
    try {
      const knowledge = await theoClient.listProjectKnowledge(id);
      let meta = projects.find((p) => p.id === id);
      if (!meta) {
        const list = await theoClient.listProjects();
        meta = list.find((p) => p.id === id);
      }
      if (!meta) { setChatProject(null); return false; }
      setChatProject({ ...meta, knowledge });
      return true;
    } catch {
      setChatProject(null);
      return false;
    }
  }

  function go(v: View) { setView(v); setDetailId(null); }
  function clearComposer() { setAttachments([]); }
  function newChat() { setMessages([]); setConversationId(null); setChatProject(null); setOpenArt(null); clearComposer(); go("chats"); }
  // B4c/B4d: AWAIT the project's full load (metadata + knowledge, held in chatProject) before switching
  // to chat, so the first turn's system prompt (buildSystemPrompt(…, chatProject)) always includes it.
  // A fire-and-forget load could otherwise race the first send — the "Start a chat" button stays enabled.
  async function startInProject(id: string) {
    setChatProject(null);                       // clear first — never carry a prior project if load fails
    const ok = await loadChatProject(id);
    if (!ok) { setError("Couldn't open that project. Please try again."); return; }  // fail closed: no switch/tag
    setMessages([]); setConversationId(null); setOpenArt(null); clearComposer(); setView("chats"); setDetailId(null);
  }
  // B4c/B4e: open a project and lazy-load its knowledge into the `projects` list (the list endpoint
  // omits it) so the DETAIL view shows it, plus its chats (theo_list_conversations?projectId) for the
  // project-home list. The chat's own project context is loaded separately via loadChatProject
  // (startInProject / reload-restore), so it never depends on this list entry.
  function openProject(id: string) {
    projectChatsReq.current = id;      // mark this as the current chats request
    setProjectChatsState(null);        // clear any prior project's list immediately (no stale flash/rows)
    setDetailId(id); setView("project");
    void refreshProjectKnowledge(id); void loadProjectChats(id);
  }

  // ── B8e attachments ───────────────────────────────────────────────────────
  const attachmentsAvailable = theoClient.attachmentsAvailable();

  // Upload one attachment (create SAS → PUT bytes → finalize), updating its chip status in place.
  async function uploadOne(localId: string, name: string, contentType: string, blob: Blob) {
    try {
      const { id } = await theoClient.uploadAttachment({ blob, name, contentType });
      setAttachments((list) => list.map((a) => (a.localId === localId ? { ...a, id, status: "ready" } : a)));
    } catch (e) {
      setAttachments((list) => list.map((a) => (a.localId === localId ? { ...a, status: "error", error: (e as Error).message } : a)));
    }
  }

  // Add picked/dropped files → upload each; chips appear immediately (status "uploading").
  function addFiles(files: FileList | File[]) {
    if (!attachmentsAvailable) { setError("Attachments aren't available in this preview."); return; }
    for (const f of Array.from(files)) {
      const localId = newLocalId();
      const contentType = f.type || "application/octet-stream";
      setAttachments((list) => [...list, { localId, id: null, name: f.name, contentType, byteSize: f.size, kind: "file", status: "uploading" }]);
      void uploadOne(localId, f.name, contentType, f);
    }
  }

  // A large paste → a "Pasted text" attachment (text/plain). Returns true if it was captured as an
  // attachment (caller should preventDefault); false → let it fall through into the textarea.
  function addPastedText(text: string): boolean {
    if (!attachmentsAvailable || text.length < PASTE_AS_ATTACHMENT_CHARS) return false;
    const localId = newLocalId();
    const blob = new Blob([text], { type: "text/plain" });
    setAttachments((list) => [...list, { localId, id: null, name: "Pasted text", contentType: "text/plain", byteSize: blob.size, kind: "pasted", status: "uploading", previewText: text }]);
    void uploadOne(localId, "pasted-text.txt", "text/plain", blob);
    return true;
  }

  function removeAttachment(localId: string) {
    setAttachments((list) => {
      const target = list.find((a) => a.localId === localId);
      if (target?.id) void theoClient.deleteAttachment(target.id); // best-effort server cleanup
      return list.filter((a) => a.localId !== localId);
    });
  }

  // Reload a persisted thread (B3b): rehydrate messages, mapping each assistant turn's persisted
  // citations to a single CitedRun so the existing CitedText path renders them (ChatView L53).
  // B8i reload parity: also hydrate each user turn's attachment chips from the persisted attachments
  // (theo_list_conversation_attachments), grouped by message_seq — the seq of the user turn each file
  // was sent with — so a reopened thread shows its chips on the matching message (Claude-style). The
  // chips reuse the existing B8e SentAttachment rendering; previewText is omitted on reload (the
  // extracted text lives server-side). Attachment fetch is best-effort: a failure just omits the chips,
  // never blocks the thread from loading.
  async function selectRecent(id: string) {
    setError(""); setChatProject(null); setOpenArt(null); setView("chats"); setDetailId(null); clearComposer();
    try {
      const d = await theoClient.getConversation(id);
      // B4d: restore the project when reopening a chat that belongs to one (the reloaded conversation
      // carries project_id). loadChatProject fetches the project's metadata + knowledge into the
      // self-contained `chatProject` (NOT the `projects` list), and is AWAITed, so the restored chat's
      // next turn injects full project context — robust to an empty list or a later loadProjects()
      // clobbering knowledge:[] (Codex B4d-FE finding).
      if (d.conversation && d.conversation.project_id) {
        await loadChatProject(d.conversation.project_id);
      }
      const bySeq = new Map<number, SentAttachment[]>();
      try {
        const atts = await theoClient.listConversationAttachments(id);
        for (const a of atts) {
          if (a.message_seq == null) continue;            // pre-B8i / never-sent rows group at chat level (not per-message)
          const sa: SentAttachment = a.filename === "pasted-text.txt"
            ? { name: "Pasted text", kind: "pasted", contentType: a.content_type, byteSize: a.byte_size }
            : { name: a.filename, kind: "file", contentType: a.content_type, byteSize: a.byte_size };
          const list = bySeq.get(a.message_seq) ?? [];
          list.push(sa);
          bySeq.set(a.message_seq, list);
        }
      } catch { /* attachments are best-effort on reload — never block the thread */ }
      const msgs: Message[] = d.messages.map((m) => {
        const atts = m.role === "user" ? bySeq.get(m.seq) : undefined;
        const cites = Array.isArray(m.citations) ? m.citations : [];
        if (m.role === "assistant" && cites.length) {
          return {
            role: "assistant", content: m.content,
            runs: [{ text: m.content, citations: cites.map((c) => ({ url: c.url ?? "", title: c.title ?? "", cited_text: c.cited_text })) }],
          };
        }
        return { role: m.role, content: m.content, ...(atts && atts.length ? { attachments: atts } : {}) };
      });
      setMessages(msgs); setConversationId(id);
    } catch {
      setError("Couldn't load that conversation.");
    }
  }

  async function send(textArg?: string) {
    const text = (textArg ?? draft).trim();
    const ready = attachments.filter((a) => a.status === "ready" && a.id);
    const uploading = attachments.some((a) => a.status === "uploading");
    if (loading || uploading) return;                 // wait for in-flight uploads (composer also disables send)
    if (!text && ready.length === 0) return;          // nothing to send
    setError("");
    const userContent = text || "Please review the attached file(s).";
    const sentAtts: SentAttachment[] = ready.map((a) => ({ name: a.name, kind: a.kind, contentType: a.contentType, byteSize: a.byteSize, previewText: a.previewText }));
    const next: Message[] = [...messages, { role: "user", content: userContent, ...(sentAtts.length ? { attachments: sentAtts } : {}) }];
    const keptAttachments = attachments;              // restore on error so the user can retry
    // B9 streaming: append an empty assistant placeholder; tokens stream into it live. The composer
    // clears immediately; ChatView shows the rotating status word until the first token lands.
    setMessages([...next, { role: "assistant", content: "" }]);
    setDraft(""); setAttachments([]); setLoading(true);
    let acc = "";                                     // accumulated answer text
    let think = "";                                   // accumulated extended-thinking text
    const cites: Citation[] = [];                     // web-grounding citations (citations_delta)
    let convId: string | null = null;
    // Patch the last message (the streaming assistant turn) in place as deltas arrive.
    const patchLastAssistant = (patch: Partial<Message>) =>
      setMessages((m) => {
        if (!m.length) return m;
        const li = m.length - 1;
        if (m[li].role !== "assistant") return m;
        const copy = m.slice();
        copy[li] = { ...copy[li], ...patch };
        return copy;
      });
    try {
      await theoClient.sendMessageStream({
        model: MODEL, max_tokens: 1500, system: buildSystemPrompt(styleKey, custom, chatProject),
        messages: next.map((m) => ({ role: m.role, content: stripArtifactRefs(m.content) })),
        ...(conversationId ? { conversation_id: conversationId } : {}),
        app_key: appContext.app_key, app_context: appContext.app_context,
        ...(ready.length ? { attachment_ids: ready.map((a) => a.id as string) } : {}),
      }, {
        onText: (d) => { acc += d; patchLastAssistant({ content: acc }); },
        onThinking: (d) => { think += d; patchLastAssistant({ thinking: think }); },
        onCitation: (c) => { cites.push({ url: c.url ?? "", title: c.title ?? "", cited_text: c.cited_text }); },
        onMeta: (mt) => { if (mt.conversation_id) convId = mt.conversation_id; },
      });
      // Finalize on stream end: run artifact ingestion over the full text (markers → links) and, if
      // the model cited sources, attach a single CitedRun so the existing CitedText path renders them.
      const { display, openId } = theoClient.ingestReply(acc);
      setArtifacts(theoClient.listArtifacts());
      patchLastAssistant({ content: display, ...(cites.length ? { runs: [{ text: display, citations: cites }] } : {}), ...(think ? { thinking: think } : {}) });
      if (openId) setOpenArt({ id: openId, v: -1 });
      if (convId) setConversationId(convId);
      // B4d: link this conversation to the active project (idempotent set-once server-side), so it
      // shows in the project's chat list and restores the project chip on reload. Best-effort — a
      // failed link never disrupts the delivered turn. Only on the first turn does convId become new;
      // later turns re-call harmlessly (the handler no-ops once linked).
      const cpId = chatProject?.id;
      if (convId && cpId) void theoClient.setConversationProject(convId, cpId).catch(() => {});
      void loadRecents();  // reflect the new/updated thread in Recents (newest-first)
    } catch {
      setError("Couldn't reach the assistant. Try again.");
      setMessages((m) => m.slice(0, -2)); setDraft(text); setAttachments(keptAttachments);  // drop placeholder + user turn
    } finally { setLoading(false); }
  }

  // B4c: create a project live (theo_create_project); prepend the returned row to state.
  async function createProject() {
    if (!np.name.trim()) return;
    try {
      const p = await theoClient.createProject(np);
      setProjects((ps) => [p, ...ps]);
      setNp({ name: "", desc: "", instructions: "" }); setNpOpen(false);
    } catch { setError("Couldn't create the project. Try again."); }
  }
  // B4c: instruction edits update local state immediately (optimistic); the network save
  // (theo_update_project) is debounced so we don't PATCH on every keystroke. chatProject reads the
  // local value, so a chat started before the debounced save still injects the latest instructions.
  function patchInstructions(text: string) {
    if (!detailId) return;
    const id = detailId;
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, instructions: text } : p)));
    if (instrTimer.current) clearTimeout(instrTimer.current);
    instrTimer.current = setTimeout(() => {
      void theoClient.updateProjectInstructions(id, text)
        .then((p) => setProjects((ps) => ps.map((x) => (x.id === id ? { ...x, instructions: p.instructions, updated: p.updated } : x))))
        .catch(() => setError("Couldn't save the project instructions."));
    }, INSTRUCTIONS_SAVE_DEBOUNCE_MS);
  }
  // B4c: add a knowledge item live (theo_add_project_knowledge); append the returned row.
  async function addKnowledge() {
    if (!detailId || !kdraft.title.trim() || !kdraft.content.trim()) return;
    const id = detailId;
    try {
      const k = await theoClient.addProjectKnowledge(id, kdraft);
      setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, knowledge: [...p.knowledge, k] } : p)));
      setKdraft({ title: "", content: "" });
    } catch { setError("Couldn't add the knowledge item."); }
  }
  // B4c: remove a knowledge item live (theo_remove_project_knowledge); optimistic, resync on failure.
  async function removeKnowledge(kid: string) {
    if (!detailId) return;
    const id = detailId;
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, knowledge: p.knowledge.filter((k) => k.id !== kid) } : p)));
    try { await theoClient.removeProjectKnowledge(kid); }
    catch { setError("Couldn't remove the knowledge item."); void refreshProjectKnowledge(id); }
  }

  function save() { theoClient.writeSettings({ styleKey, custom }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  async function copyArt() {
    if (!art) return;
    const vi = openArt && openArt.v >= 0 ? openArt.v : art.versions.length - 1;
    try { await navigator.clipboard.writeText(art.versions[vi].content); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard unavailable */ }
  }

  return {
    // state
    view, collapsed, search, projects, projectChats, artifacts, detail, chatProject, art, openArt, messages, draft, attachments, attachmentsAvailable, loading, error,
    styleKey, custom, saved, copied, npOpen, np, kdraft, recents, activeStyle, appContext,
    // setters / handlers
    go, toggleCollapse: () => setCollapsed((v) => !v), setSearch, setDraft, newChat, startInProject, openProject,
    clearChatProject: () => setChatProject(null), send, ingestAppContext, selectRecent, loadRecents, loadProjects,
    addFiles, addPastedText, removeAttachment,
    toggleNp: () => setNpOpen((v) => !v), setNp, createProject, patchInstructions, setKdraft, addKnowledge, removeKnowledge,
    selectStyle: setStyleKey, setCustom, save, copyArt,
    selectVersion: (v: number) => setOpenArt(openArt ? { id: openArt.id, v } : null),
    openArtifact: (id: string) => setOpenArt({ id, v: -1 }), closeArt: () => setOpenArt(null),
    greeting: greeting(),
  };
}
