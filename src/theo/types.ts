// Shared types — mirror the reference surface's in-memory shapes exactly (CCT §2A).
import type { JSX } from "react";

export type Role = "user" | "assistant";
// Web-grounding citation (from the gateway's web_search/web_fetch text blocks; API Spec §2.1).
export interface Citation { url: string; title: string; cited_text?: string }
// A cited span: a run of assistant text followed by the citations attached to it.
export interface CitedRun { text: string; citations: Citation[] }
// B8e: a lightweight, presentational record of an attachment shown on a SENT user turn
// (chip in the bubble). Carries just enough to render the chip + expandable preview; the
// authoritative file lives server-side (theo_attachments) and reaches the model via the gateway.
export type AttachmentKind = "file" | "pasted";
export interface SentAttachment {
  name: string; kind: AttachmentKind; contentType: string; byteSize: number;
  previewText?: string;                              // text/pasted: expandable preview
}
// VA-T7 agent-activity: one tool call surfaced live on a streaming agent turn (sigma_review_agent_stream).
// `status` advances running → done|fail as the `tool` / `tool_result` SSE events arrive. Presentational.
export interface AgentToolCall { name: string; input: unknown; status: "running" | "done" | "fail" }
// B9 streaming: `thinking` holds the model's extended-thinking text (streamed via thinking_delta),
// rendered in a collapsible panel. Presentational/ephemeral — not persisted as message content.
// VA-T7: `reasoning` + `tools` carry a review-agent turn's live activity (streamed reasoning + each tool
// call) — rendered by AgentActivity above the answer. Distinct from `thinking` (general-chat panel);
// a sigma review turn uses reasoning/tools, general chat uses thinking. Presentational/ephemeral.
// DR-T11 tool-loop: a downloadable file a tool produced, streamed to the turn as `event: vault_export`
// (API Spec §2.10; payload shape = the export tool result, §2.12). Rendered as a DownloadCard (VA-T9)
// after the reply body. `expiresAt` rides along (short-lived SAS) but is not displayed (Walter-approved).
export interface FileDownload {
  downloadUrl: string;
  filename: string;
  contentType?: string;
  byteSize?: number;
  expiresAt?: string;
}
export interface Message { role: Role; content: string; runs?: CitedRun[]; attachments?: SentAttachment[]; thinking?: string; reasoning?: string; tools?: AgentToolCall[]; download?: FileDownload; tokens?: number; streaming?: boolean }

export interface Knowledge { id: string; title: string; content: string }
export type ProjectVisibility = "private" | "group";
export interface Project {
  id: string; name: string; desc: string; updated: string;
  instructions: string; knowledge: Knowledge[];
  // B5a sharing: 'group' = visible to any authenticated Vault user (config-only: knowledge + instructions,
  // not chat transcripts). isOwner = the signed-in user owns it (only owners may edit/share/delete; a
  // shared-with-me project is read-only + chat). theo_list_projects returns both fields.
  visibility: ProjectVisibility; isOwner: boolean;
  // B5c per-member invite: true when this project was shared with the caller via a theo_project_members
  // row (theo_list_projects computes it). Distinct from group-visible: an invited project is readable
  // even while private. Used to badge "Shared with you" on a targeted invite (vs the team-wide 'group').
  sharedWithMe: boolean;
  // B5d: for the caller's OWN rows, the number of members they've invited (theo_list_projects computes
  // it owner-gated — 0 for non-owner rows). Lets the owner's grid badge a privately-shared project as
  // "Shared" (visibility='group' already badges team-wide).
  memberCount: number;
}
// B5c: a project membership row (theo_list_project_members; owner-only). member_oid is the invitee's
// Entra object id — the identity theo_list_people returns; the FE joins to a Person for display.
export interface ProjectMember { memberOid: string; invitedBy: string; createdAt: string }
// B5c: a person from the roster (theo_list_people) — the invite picker's source. id = Entra OID.
export interface Person {
  id: string; displayName: string; email: string | null; jobTitle: string | null;
  availability: string | null; activity: string | null; photo: string | null; isSelf: boolean;
}

export type ArtifactType = "document" | "code" | "html";
export interface ArtifactVersion { content: string; ts: number }
export interface Artifact { id: string; title: string; type: ArtifactType; versions: ArtifactVersion[] }
export interface ArtifactBlock { title: string; type: ArtifactType; content: string }
// B4h: a persisted-artifact summary row for the cross-chat Artifacts gallery (theo_list_artifacts —
// metadata only, no version content). Distinct from the in-memory `Artifact` (which carries versions);
// opening a summary fetches the full Artifact via theo_get_artifact.
export interface ArtifactSummary {
  id: string; title: string; type: ArtifactType;
  currentVersion: number; updated: string;
}

export type StyleKey = "normal" | "concise" | "explanatory" | "formal";
export interface Style { key: StyleKey; label: string; desc: string; mod: string }

export interface OpenArtifact { id: string; v: number }   // v < 0 ⇒ latest version
export type View = "chats" | "projects" | "project" | "artifacts" | "customize";

export type IconComp = (props: { s?: number }) => JSX.Element;
export interface NavItem { key: View; label: string; Icon: IconComp }

export interface NpDraft { name: string; desc: string; instructions: string }
export interface KDraft { title: string; content: string }

// B8e — composer attachment (live compose state, before/while uploading). `id` is the server
// attachment id, set once finalize succeeds; `attachment_ids` sent on the next message use ready ids.
export type AttachmentStatus = "uploading" | "ready" | "error";
export interface ComposerAttachment {
  localId: string;                                   // stable client key
  id: string | null;                                 // server attachment id (after finalize)
  name: string;
  contentType: string;
  byteSize: number;
  kind: AttachmentKind;
  status: AttachmentStatus;
  previewText?: string;                              // text/pasted: expandable preview
  error?: string;
}

// B8b upload-handshake shapes (theo_create_attachment_upload response).
export interface AttachmentUpload {
  attachmentId: string;
  ingestionClass: string;
  maxBytes: number;
  upload: {
    account: string; container: string; blobKey: string; blobUrl: string;
    uploadUrl: string; method: string;
    requiredHeaders: Record<string, string>;
    expiresAt: string;
  };
}

export interface GatewayRequest {
  model: string; max_tokens: number; system: string; messages: Message[];
  conversation_id?: string;                          // B3a: omit to start a new thread
  app_key?: string | null;                           // B3a: persisted on a new conversation
  app_context?: Record<string, unknown> | null;      // B3a: opaque anchor (jsonb)
  attachment_ids?: string[];                         // B8d: owner-scoped attachments to inject
}
export interface GatewayResponse {
  content: { type: string; text?: string; citations?: { url?: string; title?: string; cited_text?: string }[] }[];
  conversation_id?: string;                          // B3a: server-assigned/echoed thread id
}

// Conversation history (B3b read endpoints; API Spec §2.1). Recents + reload.
export interface ConversationSummary {
  id: string; title: string; model: string | null;
  project_id: string | null; app_key: string | null;
  created_at: string; updated_at: string;
  last_opened_at: string | null;   // restore-on-reopen: theo_list_conversations orders last-opened-first
}
export interface PersistedMessage {
  id: string; seq: number; role: Role; content: string;
  model: string | null;
  citations: { url?: string; title?: string; cited_text?: string }[] | null;
  created_at: string;
}
export interface ConversationDetail {
  conversation: ConversationSummary & { app_context?: Record<string, unknown> | null };
  messages: PersistedMessage[];
}

// B8i/B8j reload parity — a conversation's persisted attachments (theo_list_conversation_attachments).
// `message_seq` is the seq of the user turn the file was sent with (NULL for pre-B8i / never-sent rows);
// the reload path groups these by message_seq to rehydrate each user turn's SentAttachment chips.
export interface ConversationAttachment {
  id: string;
  filename: string;
  content_type: string;
  byte_size: number;
  ingestion_class: string;
  message_seq: number | null;
  created_at: string;
}

export interface Settings { styleKey: StyleKey; custom: string }

// App-context (Pass B) — the anchor Origin broadcasts to the hosted Theo surface in-process
// (App Host §6A; VA-T3 §2.4; API Spec §2.5). app_key = active app (null = Origin-level general
// chat); app_context = opaque jsonb anchor (e.g. { workpaper_id, period_id }). Carried on the
// conversation in 1A (in-memory); 1B → theo_conversations.app_key / app_context. Context-only.
export interface AppContext { app_key: string | null; app_context: Record<string, unknown> | null }
