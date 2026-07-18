// App state + handlers for the Theo shell — ports VaultOriginShell's state/logic (VA-T1
// L155–237) but routes every backend-bound call through `theoClient` (the single service
// boundary). No browser storage; React/in-memory only.
import { useCallback, useEffect, useRef, useState } from "react";
import { theoClient } from "./services/theoClient";
import { stripArtifactRefs } from "./lib/artifacts";
import { buildSystemPrompt, greeting } from "./lib/prompt";
import { MODEL } from "./swapBlock";
import { STYLES } from "./data";
import type { AgentToolCall, AppContext, Artifact, ArtifactSummary, Citation, ComposerAttachment, ConversationSummary, FileDownload, KDraft, Message, NpDraft, OpenArtifact, Person, Project, ProjectMember, SentAttachment, Settings, StyleKey, View } from "./types";

// B8e: a paste longer than this becomes a "Pasted text" attachment (collapsed, expandable) instead
// of flooding the composer — the Claude-style behaviour. Tunable; ~a long block, not a sentence.
const PASTE_AS_ATTACHMENT_CHARS = 1500;
// B4c: debounce for persisting project-instruction edits (avoids a PATCH per keystroke — the
// keystroke updates local state immediately; the network save fires once typing pauses).
const INSTRUCTIONS_SAVE_DEBOUNCE_MS = 800;

// Voice dictation (VA-T8): cap a recording at 7:00 (client-side), and pick the first MediaRecorder
// mime the browser supports from the §2.11 audio allow-list (Chrome → webm/Opus, Safari → mp4).
const DICTATION_MAX_MS = 7 * 60 * 1000;
const DICTATION_MIME_CANDIDATES = ["audio/webm", "audio/mp4", "audio/ogg", "audio/mpeg"];
function pickAudioMime(): string {
  const MR: typeof MediaRecorder | undefined = typeof window !== "undefined" ? window.MediaRecorder : undefined;
  if (MR && typeof MR.isTypeSupported === "function") {
    for (const m of DICTATION_MIME_CANDIDATES) if (MR.isTypeSupported(m)) return m;
  }
  return "audio/webm";
}

let attCounter = 0;
function newLocalId() { attCounter += 1; return "att" + Date.now().toString(36) + "_" + attCounter; }

// VA-T7 review-agent routing (fail-closed). A chat turn is routed to sigma_review_agent_stream ONLY
// when the conversation carries a COMPLETE review payload — the deployed Sigma mount already sends
// app_key='sigma' with app_context=null (general dock chat), which must NOT hit the review agent
// (its contract requires review_id + files). Every other case (incl. that null context, and all
// non-sigma turns) falls back to the general chat path (sendMessageStream). The complete payload is
// supplied by Sigma's New-Review flow (the paired Sigma-FE package).
function isUuid(v: unknown): boolean {
  return typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}
function isFilePointer(f: unknown): boolean {
  if (!f || typeof f !== "object") return false;
  const r = f as Record<string, unknown>;
  return typeof r.driveId === "string" && !!r.driveId && typeof r.itemId === "string" && !!r.itemId;
}
function hasReviewContext(ctx: AppContext): boolean {
  if (ctx.app_key !== "sigma" || !ctx.app_context) return false;
  const ac = ctx.app_context as Record<string, unknown>;
  const files = ac.files && typeof ac.files === "object" ? (ac.files as Record<string, unknown>) : null;
  return isUuid(ac.sigma_review_id) && !!files && isFilePointer(files.input) && isFilePointer(files.output);
}

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
  // B4h: the cross-chat Artifacts gallery (persisted summaries via theo_list_artifacts), distinct from
  // the in-memory `artifacts` working set that drives the open thread's cards + panel.
  const [galleryArtifacts, setGalleryArtifacts] = useState<ArtifactSummary[]>([]);
  const [openArt, setOpenArt] = useState<OpenArtifact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Message-queue: a next message the user submitted WHILE a reply was streaming. Held (text-only, v1)
  // and auto-sent when the current turn ends (the flush effect below); shown as a cancelable chip.
  const [queued, setQueued] = useState<string | null>(null);
  const [styleKey, setStyleKey] = useState<StyleKey>(seeded.styleKey);
  const [custom, setCustom] = useState(seeded.custom);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [npOpen, setNpOpen] = useState(false);
  const [np, setNp] = useState<NpDraft>({ name: "", desc: "", instructions: "" });
  const [kdraft, setKdraft] = useState<KDraft>({ title: "", content: "" });
  const [appContext, setAppContext] = useState<AppContext>(() => theoClient.getAppContext());
  // #5.3b: the Theo project a Sigma review's chats live in, KEYED to its review id (rid) so a stale
  // project can never be used for a different review. reviewArmRef is the request-key guard.
  const [reviewProject, setReviewProject] = useState<{ rid: string; id: string } | null>(null);
  const reviewArmRef = useRef<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [recentsList, setRecentsList] = useState<ConversationSummary[]>([]);
  // B4e: the open project's chats, KEYED by projectId so a slow/stale async load can neither show
  // nor overwrite another project's list (Codex B4e finding). A request ref guards the async setter;
  // the derived `projectChats` (below) only surfaces chats whose projectId matches the open detail.
  const [projectChatsState, setProjectChatsState] = useState<{ projectId: string; chats: ConversationSummary[] } | null>(null);
  const instrTimer = useRef<ReturnType<typeof setTimeout> | null>(null);  // B4c: instruction-save debounce
  const projectChatsReq = useRef<string | null>(null);                    // B4e: latest-opened project id (guards the chats load)
  // Stop-generating (B9 abort): the in-flight stream's AbortController, plus whether the user pressed
  // Stop (KEEP the partial reply) vs an implicit abort from a chat switch / newChat (DISCARD it). Both
  // are cleared in send()'s finally so the next turn starts fresh. React refs (not state) — no re-render.
  const abortRef = useRef<AbortController | null>(null);
  const userStoppedRef = useRef(false);
  const queuedRef = useRef<string | null>(null);  // message-queue: ref mirror of `queued` for the async flush
  // B5a: per-project in-flight guard for the visibility toggle — prevents overlapping/out-of-order
  // visibility writes on an access-control affordance (Codex B5a-FE finding). The ref is the hard
  // serialization (ignore a click while a write for that id is pending); visPending drives the disabled UI.
  const visReq = useRef<Set<string>>(new Set());
  const [visPending, setVisPending] = useState<string | null>(null);
  // B5c per-member invite. Members are KEYED by projectId (same discipline as projectChatsState) so a
  // slow/stale members load can neither render nor be acted on under a DIFFERENT open project (Codex
  // B5c-FE finding — cross-project bleed / revoke-against-wrong-project). projectMembersReq is the
  // latest-opened owner project guard; the derived `projectMembers` (below) surfaces only detailId's.
  // The roster (`people`) is the whole Vault Staff set (not project-specific), so it is not keyed.
  // memberReq is the per-(project|oid) in-flight guard (same discipline as visReq); memberPending drives
  // the disabled UI for the row currently being shared/unshared.
  const [projectMembersState, setProjectMembersState] = useState<{ projectId: string; members: ProjectMember[] } | null>(null);
  const projectMembersReq = useRef<string | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const memberReq = useRef<Set<string>>(new Set());
  const [memberPending, setMemberPending] = useState<string | null>(null);
  // Voice I/O (VA-T8). Dictation: MediaRecorder → theo_transcribe_audio → transcript into the draft,
  // capped at 7:00; recorder/stream/chunks/timers held in refs (no re-render). Read-aloud:
  // theo_synthesize_speech → an HTMLAudioElement; playReqRef guards a stale async play/synthesis.
  const voiceAvailable = theoClient.voiceAvailable();
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [synthesizingIdx, setSynthesizingIdx] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const recordTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordCapRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dictationCancelRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const playReqRef = useRef(0);

  // Pass B: ingest the inbound app-context anchor (from the Origin shell, in-process) and carry it
  // on the conversation (in-memory). Presentational — no app-data fetch (VA-T3 §2.4).
  function ingestAppContext(ctx: AppContext) { setAppContext(ctx); theoClient.setAppContext(ctx); }

  const detail = projects.find((p) => p.id === detailId) ?? null;
  // B4e: surface only the OPEN project's own chats — a stale/other-project load resolves into
  // projectChatsState keyed by its own id, so it never renders here unless it matches detailId.
  const projectChats = projectChatsState && projectChatsState.projectId === detailId ? projectChatsState.chats : [];
  // B5c: surface only the OPEN project's members — a stale/other-project members load resolves into
  // projectMembersState keyed by its own id, so it never renders (nor can be revoked) here unless it
  // matches detailId (Codex B5c-FE keyed-state finding).
  const projectMembers = projectMembersState && projectMembersState.projectId === detailId ? projectMembersState.members : [];
  const art = openArt ? (artifacts.find((a) => a.id === openArt.id) ?? null) : null;

  // #5.3b: derive the current review id + the project id PROVEN to belong to it (rid-matched). A stale
  // (other-review) reviewProject resolves activeReviewProjectId to null, so recents/re-arm never use it.
  const reviewAc = appContext.app_context;
  const currentRid = hasReviewContext(appContext) && reviewAc && typeof reviewAc.sigma_review_id === "string" ? reviewAc.sigma_review_id : null;
  const activeReviewProjectId = reviewProject && reviewProject.rid === currentRid ? reviewProject.id : null;
  // Arm: on every review-id change, immediately drop any other review's project (fail-closed), then
  // get-or-create this review's project and apply ONLY if we're still on the same review (reviewArmRef).
  useEffect(() => {
    reviewArmRef.current = currentRid;
    if (!currentRid) { setReviewProject(null); return; }
    setReviewProject((prev) => (prev && prev.rid === currentRid ? prev : null));
    const fund = reviewAc && typeof reviewAc.fund_name === "string" && reviewAc.fund_name.trim() ? reviewAc.fund_name : "Review";
    theoClient.getOrCreateReviewProject("sigma", currentRid, fund)
      .then((p) => { if (reviewArmRef.current === currentRid && p) setReviewProject({ rid: currentRid, id: p.id }); })
      .catch(() => { /* failed arm → leave unset; recents stay fail-closed until a later arm succeeds */ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRid, appContext]);
  // Re-arm: put a FRESH empty review chat into the (proven-current) review project — covers initial open,
  // the Sigma per-review newChatNonce, and the user's "New chat". Never mid-conversation, once already in
  // the project (no loop), or for a stale project (activeReviewProjectId is null during an A→B window).
  useEffect(() => {
    if (activeReviewProjectId && messages.length === 0 && chatProject?.id !== activeReviewProjectId) {
      void startInProject(activeReviewProjectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeReviewProjectId, messages.length, chatProject?.id]);

  // recents: global outside review mode; scoped to the review's project once resolved; EMPTY (fail
  // closed) while a review is armed but its project is still resolving — never global under a review.
  const recents = recentsList.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) && (!currentRid ? true : (activeReviewProjectId ? c.project_id === activeReviewProjectId : false)));
  const activeStyle = STYLES.find((s) => s.key === styleKey) ?? STYLES[0];
  // Personalization: the signed-in user's own row in the roster (theo_list_people isSelf) supplies the
  // display name. `selfFullName` is injected into the system prompt (Theo knows who it's with) and
  // `selfName` (first name) greets the user on the home landing. Empty until the roster loads (mount);
  // greeting falls back to the bare time-of-day, so there is no flash of a wrong name.
  const selfFullName = (people.find((p) => p.isSelf)?.displayName ?? "").trim();
  const selfName = selfFullName ? selfFullName.split(/\s+/)[0] : "";

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

  // B5c: load the open project's members (owner-only endpoint — a non-owner detail never calls this).
  // Request-keyed like loadProjectChats: the response only lands (into projectMembersState keyed by id)
  // if this project is still the latest-opened owner project, so a slow load for a since-closed project
  // can't clobber the current one. Best-effort: a failure keys an empty list rather than erroring.
  const loadProjectMembers = useCallback(async (id: string) => {
    try {
      const members = await theoClient.listProjectMembers(id);
      if (projectMembersReq.current === id) setProjectMembersState({ projectId: id, members });
    } catch {
      if (projectMembersReq.current === id) setProjectMembersState({ projectId: id, members: [] });
    }
  }, []);
  // B5c: load the Vault Staff roster for the invite picker (theo_list_people; §2.9). Best-effort —
  // an unconfigured harness / failure yields an empty picker (no invite candidates).
  const loadPeople = useCallback(async () => {
    try { setPeople(await theoClient.listPeople()); } catch { setPeople([]); }
  }, []);

  // B4h: load the cross-chat Artifacts gallery (live → theo_list_artifacts; mock → empty). Called by
  // TheoSurface's mount effect, on navigating to the Artifacts view, and after a send that produced
  // artifacts. Best-effort — a failure keeps the current list.
  const loadGalleryArtifacts = useCallback(async () => {
    try { setGalleryArtifacts(await theoClient.listServerArtifacts()); } catch { /* keep current list */ }
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

  function go(v: View) { setView(v); setDetailId(null); if (v === "artifacts") void loadGalleryArtifacts(); }  // B4h: refresh the gallery on open
  function clearComposer() { setAttachments([]); }
  // Stop-generating: abort any in-flight stream first (userStoppedRef stays false → the send() catch
  // takes the DISCARD path, not the keep-partial path — the fresh thread replaces the list anyway).
  // This also covers selectRecent / startInProject / deleteConversation / the host newChatNonce, which
  // all funnel through newChat() to reset the thread.
  function newChat() { abortRef.current?.abort(); setMessages([]); setConversationId(null); setChatProject(null); setOpenArt(null); theoClient.resetArtifacts(); setArtifacts([]); clearComposer(); go("chats"); }  // B4h: fresh thread = fresh in-memory artifact set
  // B4c/B4d: AWAIT the project's full load (metadata + knowledge, held in chatProject) before switching
  // to chat, so the first turn's system prompt (buildSystemPrompt(…, chatProject)) always includes it.
  // A fire-and-forget load could otherwise race the first send — the "Start a chat" button stays enabled.
  async function startInProject(id: string) {
    abortRef.current?.abort();                  // stop-generating: switching chats aborts any in-flight stream (discard path; this fn resets the thread inline, not via newChat())
    setChatProject(null);                       // clear first — never carry a prior project if load fails
    const ok = await loadChatProject(id);
    if (!ok) { setError("Couldn't open that project. Please try again."); return; }  // fail closed: no switch/tag
    setMessages([]); setConversationId(null); setOpenArt(null); theoClient.resetArtifacts(); setArtifacts([]); clearComposer(); setView("chats"); setDetailId(null);
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
    // B5c: owner-only invite management — load members + the roster picker source only when the caller
    // owns the project (theo_list_project_members is owner-only; a shared-with-me detail skips it).
    // Key + clear members immediately (like the chats list) so a prior project's members never flash.
    projectMembersReq.current = id;
    setProjectMembersState(null);
    const p = projects.find((x) => x.id === id);
    if (p?.isOwner) { void loadProjectMembers(id); void loadPeople(); }
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
    abortRef.current?.abort();  // stop-generating: opening another chat aborts any in-flight stream (discard path; this fn resets the thread inline, not via newChat())
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
      // B4h: rebuild this thread's artifacts from its persisted assistant turns. The raw [[ARTIFACT]]
      // blocks are retained in theo_messages.content, so re-running the ingest pipeline (in seq order)
      // reconstructs the in-memory artifacts AND swaps the markers for artifact-card placeholders — the
      // same result as when the turns first streamed. resetArtifacts() first so the working set is
      // exactly this thread's (not a prior thread's).
      theoClient.resetArtifacts();
      const msgs: Message[] = d.messages.map((m) => {
        const atts = m.role === "user" ? bySeq.get(m.seq) : undefined;
        const cites = Array.isArray(m.citations) ? m.citations : [];
        if (m.role === "assistant") {
          const { display } = theoClient.ingestReply(m.content);   // parse+upsert artifacts; markers → placeholders
          if (cites.length) {
            return {
              role: "assistant", content: display,
              runs: [{ text: display, citations: cites.map((c) => ({ url: c.url ?? "", title: c.title ?? "", cited_text: c.cited_text })) }],
            };
          }
          return { role: "assistant", content: display };
        }
        return { role: m.role, content: m.content, ...(atts && atts.length ? { attachments: atts } : {}) };
      });
      setArtifacts(theoClient.listArtifacts());
      setMessages(msgs); setConversationId(id);
    } catch {
      setError("Couldn't load that conversation.");
    }
  }

  async function send(textArg?: string) {
    const text = (textArg ?? draft).trim();
    const ready = attachments.filter((a) => a.status === "ready" && a.id);
    const uploading = attachments.some((a) => a.status === "uploading");
    if (uploading) return;                             // wait for in-flight uploads (composer also disables send)
    if (loading) {
      // Message-queue: a reply is already streaming — don't interrupt it. Queue the next message
      // (text-only, v1) and clear the draft so the user sees it was accepted; it auto-sends when the
      // current turn ends (the flush effect below). Queuing again replaces the pending one.
      if (text) { setQueued(text); queuedRef.current = text; setDraft(""); }
      return;
    }
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
    // Stop-generating: a fresh AbortController per turn; its signal is handed to the stream fetch so
    // stop() (or a chat switch) can cancel it. Held in abortRef for stop()/newChat() to reach.
    const ac = new AbortController(); abortRef.current = ac;
    let acc = "";                                     // accumulated answer text
    let think = "";                                   // accumulated extended-thinking text (general chat)
    let reasoning = "";                               // VA-T7: accumulated agent reasoning (review agent)
    const toolCalls: AgentToolCall[] = [];            // VA-T7: the review agent's live tool calls
    const cites: Citation[] = [];                     // web-grounding citations (citations_delta)
    let exportPayload: FileDownload | null = null;    // DR-T11: a tool-produced download (vault_export)
    let tokensOut = 0;                                // DR-T11: running output-token count (activity panel)
    let convId: string | null = null;
    // Fail-closed routing: a COMPLETE review payload (app_key='sigma' + review_id + files) → the K-1
    // review agent (sigma_review_agent_stream); anything else → the general chat path. Decided per-send.
    const useReviewAgent = hasReviewContext(appContext);
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
      const req = {
        model: MODEL, max_tokens: 1500, system: buildSystemPrompt(styleKey, custom, chatProject, selfFullName, appContext.app_key),
        messages: next.map((m) => ({ role: m.role, content: stripArtifactRefs(m.content) })),
        ...(conversationId ? { conversation_id: conversationId } : {}),
        app_key: appContext.app_key, app_context: appContext.app_context,
        ...(ready.length ? { attachment_ids: ready.map((a) => a.id as string) } : {}),
      };
      if (useReviewAgent) {
        // VA-T7: route to the K-1 review agent; stream its reasoning + tool calls into the assistant
        // turn (rendered by AgentActivity). Thinking deltas feed the activity panel's reasoning line
        // (NOT the general ThinkingPanel). onTool appends a running row; onToolResult resolves the
        // most-recent running row of that name to done/fail.
        await theoClient.sendReviewAgentStream(req, {
          onText: (d) => { acc += d; patchLastAssistant({ content: acc }); },
          onThinking: (d) => { reasoning += d; patchLastAssistant({ reasoning }); },
          onTool: (tc) => { toolCalls.push({ name: tc.name, input: tc.input, status: "running" }); patchLastAssistant({ tools: toolCalls.slice() }); },
          onToolResult: (tr) => {
            for (let k = toolCalls.length - 1; k >= 0; k--) {
              if (toolCalls[k].name === tr.name && toolCalls[k].status === "running") { toolCalls[k] = { ...toolCalls[k], status: tr.ok ? "done" : "fail" }; break; }
            }
            patchLastAssistant({ tools: toolCalls.slice() });
          },
          onMeta: (mt) => { if (mt.conversation_id) convId = mt.conversation_id; },
        }, { signal: ac.signal });
      } else {
        await theoClient.sendMessageStream(req, {
          onText: (d) => { acc += d; patchLastAssistant({ content: acc }); },
          onThinking: (d) => { think += d; patchLastAssistant({ thinking: think }); },
          onCitation: (c) => { cites.push({ url: c.url ?? "", title: c.title ?? "", cited_text: c.cited_text }); },
          onExport: (d) => { exportPayload = d; patchLastAssistant({ download: d }); },
          // DR-T11 tool-loop activity (VA-T7): surface the tool call live. On the FIRST tool, copy the
          // reasoning-so-far into `reasoning` so the activity panel shows it (general chat streams
          // thinking into `think`); the ThinkingPanel is suppressed for tool turns in ChatView.
          onTool: (tc) => {
            if (toolCalls.length === 0 && think) reasoning = think;
            toolCalls.push({ name: tc.name, input: tc.input, status: "running" });
            patchLastAssistant({ tools: toolCalls.slice(), ...(reasoning ? { reasoning } : {}) });
          },
          onToolResult: (tr) => {
            for (let k = toolCalls.length - 1; k >= 0; k--) {
              if (toolCalls[k].name === tr.name && toolCalls[k].status === "running") { toolCalls[k] = { ...toolCalls[k], status: tr.ok ? "done" : "fail" }; break; }
            }
            patchLastAssistant({ tools: toolCalls.slice() });
          },
          onUsage: (u) => { tokensOut += u.output_tokens; patchLastAssistant({ tokens: tokensOut }); },
          onMeta: (mt) => { if (mt.conversation_id) convId = mt.conversation_id; },
        }, { signal: ac.signal });
      }
      // Finalize on stream end: run artifact ingestion over the full text (markers → links) and, if
      // the model cited sources, attach a single CitedRun so the existing CitedText path renders them.
      const { display, openId, blocks } = theoClient.ingestReply(acc);
      setArtifacts(theoClient.listArtifacts());
      patchLastAssistant({ content: display, ...(cites.length ? { runs: [{ text: display, citations: cites }] } : {}), ...(think ? { thinking: think } : {}), ...(reasoning ? { reasoning } : {}), ...(toolCalls.length ? { tools: toolCalls.slice() } : {}), ...(exportPayload ? { download: exportPayload } : {}), ...(tokensOut ? { tokens: tokensOut } : {}) });
      if (openId) setOpenArt({ id: openId, v: -1 });
      if (convId) setConversationId(convId);
      // B4h: persist each artifact block server-side (theo_upsert_artifact — create-or-add-version by
      // title, matching the in-memory upsert), tagged with this conversation, then refresh the gallery.
      // Best-effort — a failed persist never disrupts the delivered turn; the artifact still shows live
      // (in-memory) and the raw [[ARTIFACT]] blocks in the persisted turn let a reload re-derive it.
      if (blocks.length) {
        const convForTag = convId || conversationId;
        void Promise.all(blocks.map((b) => theoClient.persistArtifact({ title: b.title, type: b.type, content: b.content, conversationId: convForTag })))
          .then(() => loadGalleryArtifacts())
          .catch(() => {});
      }
      // B4d: link this conversation to the active project (idempotent set-once server-side), so it
      // shows in the project's chat list and restores the project chip on reload. Best-effort — a
      // failed link never disrupts the delivered turn. Only on the first turn does convId become new;
      // later turns re-call harmlessly (the handler no-ops once linked).
      const cpId = chatProject?.id;
      if (convId && cpId) void theoClient.setConversationProject(convId, cpId).catch(() => {});
      void loadRecents();  // reflect the new/updated thread in Recents (newest-first)
    } catch (e) {
      // Stop-generating / chat-switch abort: aborting the fetch makes reader.read() reject with an
      // AbortError, which propagates here. An abort is NOT a failure — in BOTH abort cases skip the
      // real-error rollback + setError below.
      const aborted = (e as { name?: string })?.name === "AbortError" || ac.signal.aborted;
      if (aborted) {
        if (userStoppedRef.current) {
          // User pressed Stop: KEEP the partial reply already streamed into the placeholder. If nothing
          // arrived, drop ONLY the empty assistant placeholder (keep the user turn). Do NOT re-ingest
          // artifacts on a partial and do NOT roll back the user turn. A queued follow-up is preserved
          // and auto-sends into THIS (same) thread via the flush effect.
          if (acc.trim() === "") setMessages((m) => m.slice(0, -1));
        } else {
          // Implicit abort — a chat switch / newChat (newChat/selectRecent/startInProject) aborted this
          // stream and already replaced the message list with the fresh/reloaded thread. DISCARD any
          // queued follow-up so the flush effect (loading → false) does not send it into the NEW thread
          // (cross-thread send). Message-queue fix.
          queuedRef.current = null; setQueued(null);
        }
        return;
      }
      setError("Couldn't reach the assistant. Try again.");
      setMessages((m) => m.slice(0, -2)); setDraft(text); setAttachments(keptAttachments);  // drop placeholder + user turn
      queuedRef.current = null; setQueued(null);  // message-queue: discard any queued follow-up on a hard failure
    } finally { setLoading(false); abortRef.current = null; userStoppedRef.current = false; }
  }

  // Stop-generating: abort the in-flight stream and KEEP whatever has streamed so far. userStoppedRef
  // tells send()'s catch to take the keep-partial branch (not the error rollback). No-op when idle.
  function stop() { userStoppedRef.current = true; abortRef.current?.abort(); }

  // Message-queue: cancel the pending queued message (the ✕ on the chip).
  function cancelQueued() { queuedRef.current = null; setQueued(null); }

  // ── Voice dictation (VA-T8) — record → stop → transcribe → transcript into the composer draft ──
  function cleanupRecorder() {
    if (recordTickRef.current) { clearInterval(recordTickRef.current); recordTickRef.current = null; }
    if (recordCapRef.current) { clearTimeout(recordCapRef.current); recordCapRef.current = null; }
    if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach((tr) => tr.stop()); mediaStreamRef.current = null; }
    mediaRecorderRef.current = null;
  }
  async function startDictation() {
    if (!voiceAvailable || recording || transcribing) return;
    let stream: MediaStream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch { setError("Microphone access was blocked. Enable it in your browser to dictate."); return; }
    const mime = pickAudioMime();
    let rec: MediaRecorder;
    try { rec = new MediaRecorder(stream, { mimeType: mime }); }
    catch { try { rec = new MediaRecorder(stream); } catch { stream.getTracks().forEach((tr) => tr.stop()); setError("Voice recording isn't supported in this browser."); return; } }
    mediaStreamRef.current = stream; mediaRecorderRef.current = rec; mediaChunksRef.current = []; dictationCancelRef.current = false;
    rec.ondataavailable = (e) => { if (e.data && e.data.size) mediaChunksRef.current.push(e.data); };
    rec.onstop = () => {
      const canceled = dictationCancelRef.current;
      const chunks = mediaChunksRef.current; mediaChunksRef.current = [];
      const type = (rec.mimeType || mime).split(";")[0];
      cleanupRecorder();
      setRecording(false); setRecordingSeconds(0);
      if (canceled || chunks.length === 0) { setTranscribing(false); return; }
      const blob = new Blob(chunks, { type });
      setTranscribing(true);
      void theoClient.transcribeAudio({ blob, contentType: type })
        .then(({ text }) => { const t = text.trim(); if (t) setDraft((d) => (d.trim() ? d.replace(/\s*$/, "") + " " + t : t)); })
        .catch(() => setError("Couldn't transcribe the recording. Please try again."))
        .finally(() => setTranscribing(false));
    };
    rec.start();
    setError(""); setRecording(true); setRecordingSeconds(0);
    recordTickRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    recordCapRef.current = setTimeout(() => { const r = mediaRecorderRef.current; if (r && r.state !== "inactive") r.stop(); }, DICTATION_MAX_MS);
  }
  function stopDictation() {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") { dictationCancelRef.current = false; rec.stop(); }
  }
  function cancelDictation() {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") { dictationCancelRef.current = true; rec.stop(); }
    else { cleanupRecorder(); setRecording(false); setRecordingSeconds(0); setTranscribing(false); }
  }

  // ── Read-aloud (VA-T8) — synthesize a reply → play; playReqRef fences a stale async result ──
  function stopReadAloud() {
    playReqRef.current += 1;
    if (audioRef.current) { try { audioRef.current.pause(); } catch { /* ignore */ } audioRef.current = null; }
    if (audioUrlRef.current) { URL.revokeObjectURL(audioUrlRef.current); audioUrlRef.current = null; }
    setPlayingIdx(null); setSynthesizingIdx(null);
  }
  async function readAloud(idx: number, text: string) {
    if (!voiceAvailable) return;
    if (playingIdx === idx || synthesizingIdx === idx) { stopReadAloud(); return; }  // tap again → stop
    stopReadAloud();                                                                  // stop any other message's audio
    const clean = stripArtifactRefs(text).trim();
    if (!clean) return;
    const req = ++playReqRef.current;
    setSynthesizingIdx(idx);
    try {
      const { blob } = await theoClient.synthesizeSpeech({ text: clean });
      if (playReqRef.current !== req) return;                                          // superseded by a newer read/stop
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { if (playReqRef.current === req) { if (audioUrlRef.current) { URL.revokeObjectURL(audioUrlRef.current); audioUrlRef.current = null; } audioRef.current = null; setPlayingIdx(null); } };
      audio.onerror = () => { if (playReqRef.current === req) { setError("Couldn't play the audio."); stopReadAloud(); } };
      setSynthesizingIdx((s) => (s === idx ? null : s));
      setPlayingIdx(idx);
      await audio.play();
    } catch {
      if (playReqRef.current === req) { setError("Couldn't read that reply aloud. Please try again."); setSynthesizingIdx((s) => (s === idx ? null : s)); setPlayingIdx((p) => (p === idx ? null : p)); }
    }
  }

  // Message-queue: when the current turn ends (loading → false) and a message is still queued, auto-send
  // it. A hard failure clears the queue in send()'s catch, so this fires only after a normal completion
  // or a user Stop. The fresh send() (this render's closure, loading=false) sends rather than re-queues.
  useEffect(() => {
    if (loading || !queuedRef.current) return;
    const q = queuedRef.current; queuedRef.current = null; setQueued(null);
    void send(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
  // B4g: edit the project description (theo_update_project {id, description}). Committed once on
  // Enter/blur (edit-in-place), so no debounce — unlike instructions (a continuously-typed textarea).
  // Optimistic across the projects list AND the held chatProject (independent of the list, B4d/B4e);
  // on failure resync the list AND roll back the held chip's description (same discipline as renameProject
  // — a list-only resync would leave the stale optimistic description on the active chat's project).
  async function patchDescription(text: string) {
    if (!detailId) return;
    const id = detailId;
    const desc = text.trim();
    const prevChatDesc = chatProject && chatProject.id === id ? chatProject.desc : null;
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, desc } : p)));
    setChatProject((cp) => (cp && cp.id === id ? { ...cp, desc } : cp));
    try {
      const p = await theoClient.updateProjectDescription(id, desc);
      setProjects((ps) => ps.map((x) => (x.id === id ? { ...x, desc: p.desc, updated: p.updated } : x)));
      setChatProject((cp) => (cp && cp.id === id ? { ...cp, desc: p.desc } : cp));
    } catch {
      setError("Couldn't save the description.");
      void loadProjects();
      if (prevChatDesc != null) setChatProject((cp) => (cp && cp.id === id ? { ...cp, desc: prevChatDesc } : cp));
    }
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

  // B4f: rename a project (theo_update_project {id, name}; deployed B4a). Optimistic across the projects
  // list AND the held chatProject (so an open chat's chip updates immediately); resync from the server
  // row on success, roll back BOTH surfaces on failure. Blank names are ignored (the handler also
  // rejects them). chatProject is held INDEPENDENTLY of `projects` (B4d/B4e), so the failure path must
  // roll it back explicitly — a server-resync of the list alone would leave the stale optimistic name
  // on the active chip (Codex B4f-FE finding). We snapshot the prior chip name and restore it in catch.
  async function renameProject(id: string, name: string) {
    const n = name.trim();
    if (!n) return;
    const prevChatName = chatProject && chatProject.id === id ? chatProject.name : null;
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, name: n } : p)));
    setChatProject((cp) => (cp && cp.id === id ? { ...cp, name: n } : cp));
    try {
      const p = await theoClient.renameProject(id, n);
      setProjects((ps) => ps.map((x) => (x.id === id ? { ...x, name: p.name, updated: p.updated } : x)));
      setChatProject((cp) => (cp && cp.id === id ? { ...cp, name: p.name } : cp));
    } catch {
      setError("Couldn't rename the project.");
      void loadProjects();                                                                 // resync the list from the server
      if (prevChatName != null) setChatProject((cp) => (cp && cp.id === id ? { ...cp, name: prevChatName } : cp));  // roll back the held chip
    }
  }
  // B4f: delete a project (theo_delete_project; deployed B4a). Its conversations are kept but unlinked
  // (theo_conversations.project_id FK ON DELETE SET NULL). On success: drop it from the list; if its
  // detail is open, return to the grid; clear its cached chat list; and clear the chip if the open
  // chat belonged to it. Non-optimistic (removes only after the server confirms) so a failed delete
  // never vanishes the card.
  async function deleteProject(id: string) {
    try {
      await theoClient.deleteProject(id);
      setProjects((ps) => ps.filter((p) => p.id !== id));
      setChatProject((cp) => (cp && cp.id === id ? null : cp));
      if (projectChatsReq.current === id) projectChatsReq.current = null;
      setProjectChatsState((s) => (s && s.projectId === id ? null : s));
      if (detailId === id) { setDetailId(null); setView("projects"); }
    } catch { setError("Couldn't delete the project."); }
  }
  // B5a: set project visibility (theo_set_project_visibility; owner-only). Optimistic across the projects
  // list AND the held chatProject; resync from the server value on success, roll back both on failure
  // (same independent-chatProject discipline as renameProject — snapshot prior values, restore in catch).
  async function setProjectVisibility(id: string, visibility: "private" | "group") {
    // Per-project in-flight guard: a visibility write for this project is already pending → ignore
    // (the toggle is also disabled via visPending). Serializes writes so no out-of-order resolution
    // can leave the UI/server at a stale visibility (Codex B5a-FE finding).
    if (visReq.current.has(id)) return;
    visReq.current.add(id);
    setVisPending(id);
    const prev = projects.find((p) => p.id === id)?.visibility ?? null;
    const prevChat = chatProject && chatProject.id === id ? chatProject.visibility : null;
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, visibility } : p)));
    setChatProject((cp) => (cp && cp.id === id ? { ...cp, visibility } : cp));
    try {
      const r = await theoClient.setProjectVisibility(id, visibility);
      const v: "private" | "group" = r.visibility === "group" ? "group" : "private";
      setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, visibility: v } : p)));
      setChatProject((cp) => (cp && cp.id === id ? { ...cp, visibility: v } : cp));
    } catch {
      setError("Couldn't change sharing for this project.");
      if (prev != null) setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, visibility: prev } : p)));
      if (prevChat != null) setChatProject((cp) => (cp && cp.id === id ? { ...cp, visibility: prevChat } : cp));
    } finally {
      visReq.current.delete(id);
      setVisPending((p) => (p === id ? null : p));
    }
  }
  // B5c: invite / revoke a member (theo_share_project / theo_unshare_project; owner-only). Per-(project|oid)
  // in-flight guard (same discipline as setProjectVisibility) so overlapping clicks can't leave a stale
  // membership; on success re-list members from the server (source of truth); on failure surface + re-list.
  async function shareMember(projectId: string, memberOid: string) {
    const key = projectId + "|" + memberOid;
    if (memberReq.current.has(key)) return;
    memberReq.current.add(key);
    setMemberPending(key);
    try {
      await theoClient.shareProject(projectId, memberOid);
      { const members = await theoClient.listProjectMembers(projectId); if (projectMembersReq.current === projectId) setProjectMembersState({ projectId, members }); setProjects((ps) => ps.map((p) => (p.id === projectId ? { ...p, memberCount: members.length } : p))); }
    } catch {
      setError("Couldn't share this project with that person.");
      try { { const members = await theoClient.listProjectMembers(projectId); if (projectMembersReq.current === projectId) setProjectMembersState({ projectId, members }); setProjects((ps) => ps.map((p) => (p.id === projectId ? { ...p, memberCount: members.length } : p))); } } catch { /* keep current */ }
    } finally {
      memberReq.current.delete(key);
      setMemberPending((k) => (k === key ? null : k));
    }
  }
  async function unshareMember(projectId: string, memberOid: string) {
    const key = projectId + "|" + memberOid;
    if (memberReq.current.has(key)) return;
    memberReq.current.add(key);
    setMemberPending(key);
    try {
      await theoClient.unshareProject(projectId, memberOid);
      { const members = await theoClient.listProjectMembers(projectId); if (projectMembersReq.current === projectId) setProjectMembersState({ projectId, members }); setProjects((ps) => ps.map((p) => (p.id === projectId ? { ...p, memberCount: members.length } : p))); }
    } catch {
      setError("Couldn't remove that person from the project.");
      try { { const members = await theoClient.listProjectMembers(projectId); if (projectMembersReq.current === projectId) setProjectMembersState({ projectId, members }); setProjects((ps) => ps.map((p) => (p.id === projectId ? { ...p, memberCount: members.length } : p))); } } catch { /* keep current */ }
    } finally {
      memberReq.current.delete(key);
      setMemberPending((k) => (k === key ? null : k));
    }
  }
  // B4f: rename a conversation (theo_rename_conversation {id, title}; deployed B4f). Optimistic across
  // Recents AND the open project's chat list; resync (reload) on failure. Blank titles are ignored.
  async function renameConversation(id: string, title: string) {
    const tl = title.trim();
    if (!tl) return;
    setRecentsList((rs) => rs.map((c) => (c.id === id ? { ...c, title: tl } : c)));
    setProjectChatsState((s) => (s ? { ...s, chats: s.chats.map((c) => (c.id === id ? { ...c, title: tl } : c)) } : s));
    try { await theoClient.renameConversation(id, tl); }
    catch {
      setError("Couldn't rename the chat.");
      void loadRecents();
      if (detailId) void loadProjectChats(detailId);
    }
  }
  // B4f: delete a conversation permanently (theo_delete_conversation {id}; deployed B4f — theo_messages
  // cascade, attachments unlinked). On success drop it from Recents + the project chat list; if it is
  // the currently-open thread, reset to a fresh chat. Non-optimistic (removes only after the server
  // confirms) so a failed delete never vanishes the row.
  async function deleteConversation(id: string) {
    try {
      await theoClient.deleteConversation(id);
      setRecentsList((rs) => rs.filter((c) => c.id !== id));
      setProjectChatsState((s) => (s ? { ...s, chats: s.chats.filter((c) => c.id !== id) } : s));
      if (conversationId === id) newChat();
    } catch { setError("Couldn't delete the chat."); }
  }

  // B4h: open a persisted artifact from the gallery (Artifacts tab) — fetch its versions + content
  // (theo_get_artifact; content from Blob), merge it into the in-memory working set by id, and open it
  // in the panel. The panel resolves it via `art` (artifacts.find by openArt.id).
  async function openGalleryArtifact(id: string) {
    try {
      const a = await theoClient.getServerArtifact(id);
      theoClient.mergeArtifact(a);
      setArtifacts(theoClient.listArtifacts());
      setOpenArt({ id: a.id, v: -1 });
    } catch { setError("Couldn't open that artifact."); }
  }

  function save() { theoClient.writeSettings({ styleKey, custom }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  async function copyArt() {
    if (!art) return;
    const vi = openArt && openArt.v >= 0 ? openArt.v : art.versions.length - 1;
    try { await navigator.clipboard.writeText(art.versions[vi].content); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard unavailable */ }
  }

  return {
    // state
    view, collapsed, search, projects, projectChats, artifacts, galleryArtifacts, detail, chatProject, art, openArt, messages, draft, attachments, attachmentsAvailable, loading, error, queued,
    styleKey, custom, saved, copied, npOpen, np, kdraft, recents, activeStyle, appContext,
    reviewMode: hasReviewContext(appContext), // Sigma review context armed → review-assistant landing/chip
    sigmaMode: appContext.app_key === "sigma", // #5 v2: in Sigma (with or without a review) → review persona/landing
    // Voice I/O (VA-T8)
    voiceAvailable, recording, transcribing, recordingSeconds, playingIdx, synthesizingIdx,


    // setters / handlers
    go, toggleCollapse: () => setCollapsed((v) => !v), setSearch, setDraft, newChat, startInProject, openProject,
    clearChatProject: () => setChatProject(null), send, stop, cancelQueued, ingestAppContext, selectRecent, loadRecents, loadProjects, loadGalleryArtifacts,
    addFiles, addPastedText, removeAttachment,
    toggleNp: () => setNpOpen((v) => !v), setNp, createProject, patchInstructions, patchDescription, setKdraft, addKnowledge, removeKnowledge,
    renameProject, deleteProject, setProjectVisibility, visPending, renameConversation, deleteConversation,
    projectMembers, people, shareMember, unshareMember, memberPending,
    selectStyle: setStyleKey, setCustom, save, copyArt,
    selectVersion: (v: number) => setOpenArt(openArt ? { id: openArt.id, v } : null),
    openArtifact: (id: string) => setOpenArt({ id, v: -1 }), openGalleryArtifact, closeArt: () => setOpenArt(null),
    greeting: greeting(selfName), loadPeople,
    // Voice I/O (VA-T8)
    startDictation, stopDictation, cancelDictation, readAloud, stopReadAloud,
  };
}
