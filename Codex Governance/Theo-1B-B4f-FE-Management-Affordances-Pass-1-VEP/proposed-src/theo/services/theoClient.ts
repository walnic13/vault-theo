// THE single service / contracts boundary (FE Governor §6.2; 1A handover §2.3).
// Every backend-bound call routes through here. Chat → gateway (mock in the standalone harness,
// live model gateway when a token/base is configured). B4c: projects + project-knowledge are now
// live `theo_*` calls (with the same mock fallback), replacing the 1A in-memory store; artifacts /
// settings stay in-memory pending their own tiers. NO browser storage (1A handover §2.5).
import type {
  AppContext, Artifact, ConversationAttachment, ConversationDetail, ConversationSummary, GatewayRequest, GatewayResponse,
  KDraft, Knowledge, NpDraft, Project, Settings,
} from "../types";
import { parseArtifacts, remapToIds, upsert } from "../lib/artifacts";
import {
  sendMessage as gatewaySend, sendMessageStream as gatewaySendStream, configureGateway as gatewayConfigure,
  listConversations as gatewayList, getConversation as gatewayGet,
  listProjectConversations as gatewayListProjectConversations,
  listConversationAttachments as gatewayListConvAttachments,
  createAttachmentUpload as gatewayCreateUpload, uploadToBlob as gatewayUploadToBlob,
  finalizeAttachment as gatewayFinalize, deleteAttachment as gatewayDeleteAttachment,
  attachmentsAvailable as gatewayAttachmentsAvailable,
  listProjects as gatewayListProjects, createProject as gatewayCreateProject,
  updateProjectInstructions as gatewayUpdateProjectInstructions, deleteProject as gatewayDeleteProject,
  listProjectKnowledge as gatewayListProjectKnowledge, addProjectKnowledge as gatewayAddProjectKnowledge,
  removeProjectKnowledge as gatewayRemoveProjectKnowledge,
  setConversationProject as gatewaySetConversationProject,
  renameProject as gatewayRenameProject,
  renameConversation as gatewayRenameConversation, deleteConversation as gatewayDeleteConversation,
  type StreamHandlers,
} from "./gateway.live";

let artifacts: Artifact[] = [];
let settings: Settings = { styleKey: "normal", custom: "" };
let appContext: AppContext = { app_key: null, app_context: null };

export const theoClient = {
  // ── Gateway wiring (Origin mount supplies the token provider; switches mock → live) ──
  configureGateway(opts: { getAccessToken?: (() => Promise<string | null>) | null; baseUrl?: string | null; streamBaseUrl?: string | null }): void {
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
  // B4e: a project's conversations (theo_list_conversations?projectId) — backs the project-home chat list.
  listProjectConversations(projectId: string): Promise<ConversationSummary[]> {
    return gatewayListProjectConversations(projectId);
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

  // ── Projects + project-knowledge (B4c: live theo_*_project / theo_*_project_knowledge; API Spec
  // §2.2). Owner-scoped server-side; mock fallback in the standalone harness. Each returns the
  // FE-mapped shape (gateway.live maps the deployed rows) so the surface is unchanged. ──
  listProjects(): Promise<Project[]> { return gatewayListProjects(); },
  createProject(d: NpDraft): Promise<Project> { return gatewayCreateProject(d); },
  updateProjectInstructions(id: string, instructions: string): Promise<Project> {
    return gatewayUpdateProjectInstructions(id, instructions);
  },
  // B4f: rename a project (theo_update_project {id, name}; deployed B4a).
  renameProject(id: string, name: string): Promise<Project> { return gatewayRenameProject(id, name); },
  deleteProject(id: string): Promise<void> { return gatewayDeleteProject(id); },
  listProjectKnowledge(projectId: string): Promise<Knowledge[]> { return gatewayListProjectKnowledge(projectId); },
  addProjectKnowledge(projectId: string, k: KDraft): Promise<Knowledge> { return gatewayAddProjectKnowledge(projectId, k); },
  removeProjectKnowledge(knowledgeId: string): Promise<void> { return gatewayRemoveProjectKnowledge(knowledgeId); },
  // B4d: link a conversation to a project (owner-scoped, idempotent set-once). Called once after a
  // project chat's first turn returns a conversation_id (theo_conversations.project_id).
  setConversationProject(conversationId: string, projectId: string): Promise<void> {
    return gatewaySetConversationProject(conversationId, projectId);
  },
  // B4f: rename / delete a conversation (theo_rename_conversation / theo_delete_conversation; deployed B4f).
  renameConversation(id: string, title: string): Promise<{ id: string; title: string }> {
    return gatewayRenameConversation(id, title);
  },
  deleteConversation(id: string): Promise<void> { return gatewayDeleteConversation(id); },

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
