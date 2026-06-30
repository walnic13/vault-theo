// THE single service / contracts boundary (FE Governor §6.2; 1A handover §2.3).
// Every backend-bound call routes through here. In 1A: chat → mock gateway; projects /
// artifacts / settings → in-memory store seeded from the reference. In 1B each method is
// swapped for a real `theo_*` API call with NO surface change. NO browser storage
// (1A handover §2.5) — module memory only.
import type {
  AppContext, Artifact, ConversationAttachment, ConversationDetail, ConversationSummary, GatewayRequest, GatewayResponse,
  KDraft, NpDraft, Project, Settings,
} from "../types";
import { INIT_PROJECTS } from "../data";
import { parseArtifacts, remapToIds, upsert } from "../lib/artifacts";
import {
  sendMessage as gatewaySend, sendMessageStream as gatewaySendStream, configureGateway as gatewayConfigure,
  listConversations as gatewayList, getConversation as gatewayGet,
  listConversationAttachments as gatewayListConvAttachments,
  createAttachmentUpload as gatewayCreateUpload, uploadToBlob as gatewayUploadToBlob,
  finalizeAttachment as gatewayFinalize, deleteAttachment as gatewayDeleteAttachment,
  attachmentsAvailable as gatewayAttachmentsAvailable,
  type StreamHandlers,
} from "./gateway.live";

let projects: Project[] = INIT_PROJECTS.map((p) => ({ ...p, knowledge: p.knowledge.slice() }));
let artifacts: Artifact[] = [];
let settings: Settings = { styleKey: "normal", custom: "" };
let appContext: AppContext = { app_key: null, app_context: null };

export const theoClient = {
  // ── Gateway wiring (Origin mount supplies the token provider; switches mock → live) ──
  configureGateway(opts: { getAccessToken?: (() => Promise<string | null>) | null; baseUrl?: string | null }): void {
    gatewayConfigure(opts);
  },

  // ── Chat (the one network-bound call; mocked in 1A) ──────────────────────
  sendMessage(req: GatewayRequest): Promise<GatewayResponse> {
    return gatewaySend(req);
  },
  // ── B9 streaming chat (theo_message_stream sidecar) — same request shape; the reply arrives as
  // SSE deltas via the handlers (live text + thinking + citations + the final conversation id). ──
  sendMessageStream(req: GatewayRequest, handlers: StreamHandlers): Promise<void> {
    return gatewaySendStream(req, handlers);
  },

  // ── Attachments (B8e) — one network round per file: create SAS → PUT bytes → finalize.
  // Returns the server attachment id (used as attachment_ids on the next sendMessage). The bytes
  // never transit the gateway — the browser PUTs straight to Blob via the owner-scoped SAS. ──
  attachmentsAvailable(): boolean { return gatewayAttachmentsAvailable(); },
  async uploadAttachment(input: { blob: Blob; name: string; contentType: string }): Promise<{ id: string }> {
    const up = await gatewayCreateUpload(input.name, input.contentType);
    await gatewayUploadToBlob(up.upload, input.blob);
    return gatewayFinalize(up.attachmentId, input.name);
  },
  deleteAttachment(id: string): Promise<void> { return gatewayDeleteAttachment(id); },

  // ── Conversation history (Recents + reload; theo_list/get_conversation in 1B) ──
  listConversations(limit?: number): Promise<ConversationSummary[]> {
    return gatewayList(limit);
  },
  getConversation(id: string): Promise<ConversationDetail> {
    return gatewayGet(id);
  },
  // B8i reload parity — a conversation's persisted attachments (grouped per user turn by message_seq).
  listConversationAttachments(id: string): Promise<ConversationAttachment[]> {
    return gatewayListConvAttachments(id);
  },

  // Parse [[ARTIFACT]] blocks out of a reply, upsert them (versioned by reused title),
  // and return the display text (artifact sentinels remapped to artifact ids) + the id to open.
  ingestReply(reply: string): { display: string; openId: string | null } {
    const { clean, blocks } = parseArtifacts(reply);
    const ids: string[] = [];
    blocks.forEach((b) => { const r = upsert(artifacts, b); artifacts = r.next; ids.push(r.id); });
    const display = remapToIds(clean, ids);
    return { display: display || "(no response)", openId: ids.length ? ids[ids.length - 1] : null };
  },

  // ── Projects (in-memory in 1A; theo_projects / theo_project_knowledge in 1B) ──
  listProjects(): Project[] { return projects.slice(); },
  createProject(d: NpDraft): Project[] {
    const id = "p" + Date.now().toString(36);
    projects = [{ id, name: d.name.trim(), desc: d.desc.trim() || "New project.", instructions: d.instructions.trim(), knowledge: [], updated: "just now" }, ...projects];
    return projects.slice();
  },
  patchInstructions(id: string, instructions: string): Project[] {
    projects = projects.map((p) => (p.id === id ? { ...p, instructions } : p));
    return projects.slice();
  },
  addKnowledge(id: string, k: KDraft): Project[] {
    projects = projects.map((p) => p.id === id
      ? { ...p, knowledge: [...p.knowledge, { id: "k" + Date.now().toString(36), title: k.title.trim(), content: k.content.trim() }] }
      : p);
    return projects.slice();
  },
  removeKnowledge(id: string, kid: string): Project[] {
    projects = projects.map((p) => p.id === id ? { ...p, knowledge: p.knowledge.filter((k) => k.id !== kid) } : p);
    return projects.slice();
  },

  // ── Artifacts (in-memory in 1A; theo_artifacts + theo_artifact_versions in 1B) ──
  listArtifacts(): Artifact[] { return artifacts.slice(); },

  // ── Settings (in-memory in 1A; theo_user_settings in 1B) ──
  readSettings(): Settings { return { ...settings }; },
  writeSettings(s: Settings): void { settings = { ...s }; },

  // ── App-context (Pass B; in-memory carry in 1A; theo_conversations.app_key/app_context in 1B) ──
  // Presentational anchor only — Origin broadcasts it in-process; Theo never fetches app data here.
  getAppContext(): AppContext { return { ...appContext }; },
  setAppContext(ctx: AppContext): void { appContext = { ...ctx }; },
};
