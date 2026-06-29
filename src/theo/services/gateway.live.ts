// 1B LIVE gateway. Calls the deployed server-side Theo model gateway
// (POST `${VITE_FUNCTIONS_URL}/api/theo_message`; HF-T1 Foundry-Claude broker). The gateway holds
// the model credential server-side — the browser never sees a model key. The call is CROSS-ORIGIN
// to the Functions app (mirroring Origin's reporting clients: absolute base URL + Bearer, NOT a
// same-origin `/api/*` proxy — Origin's SWA has none), so the user's Entra access token is attached
// as `Authorization: Bearer` for the Functions app's EasyAuth. That is the SAME token Origin already
// mints for reporting (`api://<app-id>/access_as_user`) — golden-curl-verified 200 against the
// deployed handler. NO browser storage (1A handover §2.5).
//
// Until a live backend is configured (no `VITE_FUNCTIONS_URL` and no `configureGateway` token/base),
// this delegates to the in-repo 1A mock so the standalone vault-theo dev harness keeps working.
import type {
  AttachmentUpload, ConversationDetail, ConversationSummary, GatewayRequest, GatewayResponse,
} from "../types";
import { sendMessage as mockSend, listConversations as mockList, getConversation as mockGet } from "./gateway.mock";

type TokenProvider = () => Promise<string | null>;

function normalizeBase(v: unknown): string {
  return typeof v === "string" ? v.replace(/\/+$/, "") : "";
}

let tokenProvider: TokenProvider | null = null;
let apiBase: string = normalizeBase((import.meta.env as Record<string, unknown>).VITE_FUNCTIONS_URL);

// Configured once by the federated TheoSurface mount with the Origin shell's token provider (and,
// optionally, the Functions base URL). Supplying a token provider switches this gateway mock → live.
export function configureGateway(opts: { getAccessToken?: TokenProvider | null; baseUrl?: string | null }): void {
  if (opts.getAccessToken !== undefined) tokenProvider = opts.getAccessToken;
  if (opts.baseUrl != null) apiBase = normalizeBase(opts.baseUrl);
}

// True once a live backend is wired (token provider or a Functions base URL). Attachments require it.
function isLive(): boolean {
  return Boolean(apiBase || tokenProvider);
}
export function attachmentsAvailable(): boolean {
  return isLive();
}

// Auth headers for a live cross-origin call (Bearer = the shell's user identity token, not a model key).
async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (tokenProvider) {
    const token = await tokenProvider();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function sendMessage(req: GatewayRequest): Promise<GatewayResponse> {
  // No live backend wired (standalone dev harness) → preserve the 1A mock behavior unchanged.
  if (!apiBase && !tokenProvider) {
    return mockSend(req);
  }

  const headers = await authHeaders();

  // GatewayRequest {model, max_tokens, system, messages, conversation_id?, app_key?, app_context?,
  // attachment_ids?} → body {max_tokens, system, messages, conversation_id?, app_key?, app_context?,
  // attachment_ids?}. The handler injects the configured model (THEO_FOUNDRY_DEPLOYMENT); the client's
  // `model` is unused. conversation_id (B3a) appends to an existing thread; attachment_ids (B8d) inject
  // the owner-scoped attachments into the upstream user turn.
  const res = await fetch(`${apiBase}/api/theo_message`, {
    method: "POST",
    credentials: "same-origin",
    headers,
    body: JSON.stringify({
      max_tokens: req.max_tokens,
      system: req.system,
      messages: req.messages,
      ...(req.conversation_id ? { conversation_id: req.conversation_id } : {}),
      ...(req.app_key != null ? { app_key: req.app_key } : {}),
      ...(req.app_context != null ? { app_context: req.app_context } : {}),
      ...(req.attachment_ids && req.attachment_ids.length ? { attachment_ids: req.attachment_ids } : {}),
    }),
  });

  let json:
    | { data?: { content?: GatewayResponse["content"]; conversation_id?: string }; error?: { message?: string } }
    | null = null;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Theo gateway returned a non-JSON response (HTTP ${res.status}).`);
  }

  // Non-2xx → surface the handler's `{ error: { message } }` (the existing chat error state shows it).
  if (!res.ok) {
    throw new Error(json?.error?.message || `Theo gateway error (HTTP ${res.status}).`);
  }

  // Success envelope `{ data: { content: [{type:"text", text}], conversation_id, … }, meta }`.
  const content = json?.data?.content;
  if (!Array.isArray(content)) {
    throw new Error("Theo gateway response missing data.content[].");
  }
  const conversation_id = typeof json?.data?.conversation_id === "string" ? json.data.conversation_id : undefined;
  return { content, conversation_id };
}

// ── B8e attachment upload handshake (B8b/B8c endpoints) ───────────────────────────────────
// 1) create → owner-scoped write SAS; 2) PUT bytes straight to Blob (SAS is the auth — no Bearer,
// cross-origin to blob.core.windows.net, requires the storage account's CORS to allow PUT from the
// SWA origin); 3) finalize → the server reads the actual size/type, extracts text for extract-class,
// and inserts the owner-scoped row. Unconfigured dev harness → attachments unavailable (clear error).

export async function createAttachmentUpload(filename: string, contentType: string): Promise<AttachmentUpload> {
  if (!isLive()) throw new Error("Attachments are unavailable in the standalone preview.");
  const headers = await authHeaders();
  const res = await fetch(`${apiBase}/api/theo_create_attachment_upload`, {
    method: "POST",
    credentials: "same-origin",
    headers,
    body: JSON.stringify({ filename, content_type: contentType }),
  });
  let json: { data?: AttachmentUpload; error?: { message?: string } } | null = null;
  try { json = await res.json(); } catch { throw new Error(`Attachment upload init returned a non-JSON response (HTTP ${res.status}).`); }
  if (!res.ok) throw new Error(json?.error?.message || `Attachment upload init failed (HTTP ${res.status}).`);
  const data = json?.data;
  if (!data || !data.attachmentId || !data.upload?.uploadUrl) {
    throw new Error("Attachment upload init response missing data.upload.uploadUrl.");
  }
  return data;
}

export async function uploadToBlob(upload: AttachmentUpload["upload"], body: Blob): Promise<void> {
  // PUT directly to Blob using the SAS URL. No Authorization header — the SAS query is the credential.
  const res = await fetch(upload.uploadUrl, {
    method: "PUT",
    headers: { ...upload.requiredHeaders },
    body,
  });
  if (!res.ok) {
    throw new Error(`Direct-to-Blob upload failed (HTTP ${res.status}).`);
  }
}

export async function finalizeAttachment(
  attachmentId: string,
  filename: string,
  conversationId?: string | null
): Promise<{ id: string }> {
  if (!isLive()) throw new Error("Attachments are unavailable in the standalone preview.");
  const headers = await authHeaders();
  const res = await fetch(`${apiBase}/api/theo_finalize_attachment`, {
    method: "POST",
    credentials: "same-origin",
    headers,
    body: JSON.stringify({
      attachment_id: attachmentId,
      filename,
      ...(conversationId ? { conversation_id: conversationId } : {}),
    }),
  });
  let json: { data?: { attachment?: { id?: string } }; error?: { message?: string } } | null = null;
  try { json = await res.json(); } catch { throw new Error(`Attachment finalize returned a non-JSON response (HTTP ${res.status}).`); }
  if (!res.ok) throw new Error(json?.error?.message || `Attachment finalize failed (HTTP ${res.status}).`);
  const id = json?.data?.attachment?.id;
  if (typeof id !== "string") throw new Error("Attachment finalize response missing data.attachment.id.");
  return { id };
}

export async function deleteAttachment(id: string): Promise<void> {
  if (!isLive()) return; // nothing persisted in the standalone preview
  const headers = await authHeaders();
  await fetch(`${apiBase}/api/theo_delete_attachment`, {
    method: "POST",
    credentials: "same-origin",
    headers,
    body: JSON.stringify({ id }),
  });
  // Best-effort: a failed cleanup of an abandoned attachment is non-fatal to the UI.
}

// B3b — list the signed-in user's conversations (newest-first; backs Recents). Unconfigured → mock.
export async function listConversations(limit?: number): Promise<ConversationSummary[]> {
  if (!apiBase && !tokenProvider) {
    return mockList(limit);
  }
  const headers = await authHeaders();
  const query = limit != null ? `?limit=${encodeURIComponent(String(limit))}` : "";
  const res = await fetch(`${apiBase}/api/theo_list_conversations${query}`, {
    method: "GET",
    credentials: "same-origin",
    headers,
  });

  let json: { data?: { conversations?: ConversationSummary[] }; error?: { message?: string } } | null = null;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Theo gateway returned a non-JSON response (HTTP ${res.status}).`);
  }
  if (!res.ok) {
    throw new Error(json?.error?.message || `Theo gateway error (HTTP ${res.status}).`);
  }
  return Array.isArray(json?.data?.conversations) ? json.data.conversations : [];
}

// B3b — fetch one conversation + its ordered messages (with persisted citations; backs reload). Unconfigured → mock.
export async function getConversation(id: string): Promise<ConversationDetail> {
  if (!apiBase && !tokenProvider) {
    return mockGet(id);
  }
  const headers = await authHeaders();
  const res = await fetch(`${apiBase}/api/theo_get_conversation?conversationId=${encodeURIComponent(id)}`, {
    method: "GET",
    credentials: "same-origin",
    headers,
  });

  let json: { data?: ConversationDetail; error?: { message?: string } } | null = null;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Theo gateway returned a non-JSON response (HTTP ${res.status}).`);
  }
  if (!res.ok) {
    throw new Error(json?.error?.message || `Theo gateway error (HTTP ${res.status}).`);
  }
  if (!json?.data?.conversation || !Array.isArray(json.data.messages)) {
    throw new Error("Theo gateway response missing data.conversation/messages.");
  }
  return json.data;
}
