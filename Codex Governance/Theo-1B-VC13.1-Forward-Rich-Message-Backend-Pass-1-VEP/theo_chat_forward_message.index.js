const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
// VC-13.1: project the attachment preview (filename/content_type/byte_size) or null — the raw blob_path is
// NEVER exposed (a read SAS is issued per-request by theo_chat_attachment_download; VC-9 parity).
function attachmentPreview(row) {
  if (!row || row.attachment_blob_path == null) return null;
  return {
    filename: row.attachment_filename,
    content_type: row.attachment_content_type,
    byte_size: row.attachment_byte_size == null ? null : Number(row.attachment_byte_size),
  };
}
// VC-13.1: project the gif (external GIPHY reference) or null (VC-10 parity).
function gifPreview(row) {
  if (!row || row.gif_id == null) return null;
  return {
    provider: row.gif_provider,
    id: row.gif_id,
    url: row.gif_url,
    preview_url: row.gif_preview_url,
    width: row.gif_width == null ? null : Number(row.gif_width),
    height: row.gif_height == null ? null : Number(row.gif_height),
    title: row.gif_title,
  };
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const messageId = typeof body.message_id === "string" ? body.message_id.trim() : "";
  if (!isUuid(messageId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'message_id' is required and must be a valid UUID.", 400));
  }
  const toThreadId = typeof body.to_thread_id === "string" ? body.to_thread_id.trim() : "";
  if (!isUuid(toThreadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'to_thread_id' is required and must be a valid UUID.", 400));
  }

  let client = null;
  let saved = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Read the SOURCE message under RLS — theo_chat_message_select only returns it if the caller is a
    // participant of its thread, so a caller can only forward a message they can already see. Absent /
    // not visible → 404 (no existence leak). The body is copied server-side (not client-supplied).
    // VC-19: the SOURCE thread being archived does NOT block forwarding OUT of it — reading is unaffected;
    // only landing a NEW copy in an archived TARGET is gated below.
    // VC-13.1: also read the source's attachment_* + gif_* so a forwarded attachment/gif message carries
    // its content (copying only `body` would drop it — and an attachment-only/gif-only source has body NULL,
    // which would violate theo_chat_messages_body_ck on the INSERT). The attachment copy references the SAME
    // blob (owner-scoped to the ORIGINAL sender); download stays message-membership-gated, not owner-gated.
    const srcRes = await client.query(
      `SELECT body, deleted_at,
              attachment_blob_path, attachment_filename, attachment_content_type, attachment_byte_size,
              gif_provider, gif_id, gif_url, gif_preview_url, gif_width, gif_height, gif_title
       FROM public.theo_chat_messages WHERE id = $1`,
      [messageId]
    );
    if (srcRes.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Message not found.", 404);
    }
    const src = srcRes.rows[0];
    if (src.deleted_at != null) {
      throw buildKnownError("INVALID_REQUEST", "Cannot forward a deleted message.", 400);
    }

    // Target membership: the caller must belong to the destination thread. Not a participant → 404.
    // (The theo_chat_message_insert WITH CHECK independently enforces this on the INSERT below.)
    // VC-19: read the TARGET's archived_at in the same gate — a forward is a NEW message, so an archived
    // target is closed to it (mirrors the theo_chat_send_message write-gate).
    const acc = await client.query(
      `SELECT archived_at FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [toThreadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    // VC-19: reject forwarding INTO an archived thread with a deterministic 409. A DM never has archived_at
    // set (only a channel is archivable), so this only ever fires for an archived channel. Cooperative UX
    // write-gate, not a security boundary (see the VEP §P8 TOCTOU note).
    if (acc.rows[0].archived_at != null) {
      throw buildKnownError("CONVERSATION_ARCHIVED", "This conversation is archived; you can no longer post to it.", 409);
    }

    // Insert the copy into the target thread with the next per-thread seq computed atomically; the
    // UNIQUE(thread_id, seq) guards a concurrent sender — retry on a 23505 race, then bump the thread.
    // forwarded_from_message_id records provenance (the API exposes only the derived `forwarded` bool).
    // VC-13.1: carry the source's body + attachment_* + gif_* so the forwarded copy preserves the content
    // (the coherence/body CHECKs are satisfied because the copied columns are a valid source row's shape).
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages
            (thread_id, seq, sender_oid, body, forwarded_from_message_id,
             attachment_blob_path, attachment_filename, attachment_content_type, attachment_byte_size,
             gif_provider, gif_id, gif_url, gif_preview_url, gif_width, gif_height, gif_title)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
          FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id,
                    attachment_blob_path, attachment_filename, attachment_content_type, attachment_byte_size,
                    gif_provider, gif_id, gif_url, gif_preview_url, gif_width, gif_height, gif_title
          `,
          [
            toThreadId, oid, src.body, messageId,
            src.attachment_blob_path, src.attachment_filename, src.attachment_content_type, src.attachment_byte_size,
            src.gif_provider, src.gif_id, src.gif_url, src.gif_preview_url, src.gif_width, src.gif_height, src.gif_title,
          ]
        );
        await client.query(`UPDATE public.theo_chat_threads SET updated_at = now() WHERE id = $1`, [toThreadId]);
        await client.query("COMMIT");
        saved = ins.rows[0];
      } catch (e) {
        try { await client.query("ROLLBACK"); } catch {}
        if (e && e.code === "23505") continue; // seq race — recompute and retry
        throw e;
      }
    }
    if (!saved) {
      throw buildKnownError("CONFLICT", "Could not assign a message sequence; please retry.", 409);
    }

    // Shape to match the list_messages / send_message message projection exactly: a forward is never a
    // reply and never (freshly) deleted; `forwarded` is the ONLY provenance exposed (never the raw origin id).
    // VC-13.1: project the carried attachment/gif (or null), then drop the raw columns so the blob_path
    // never leaks (VC-9/VC-10 parity).
    saved.reply_to = null;
    saved.deleted = false;
    saved.deleted_at = null;
    saved.forwarded = true;
    saved.attachment = attachmentPreview(saved);
    saved.gif = gifPreview(saved);
    delete saved.attachment_blob_path;
    delete saved.attachment_filename;
    delete saved.attachment_content_type;
    delete saved.attachment_byte_size;
    delete saved.gif_provider;
    delete saved.gif_id;
    delete saved.gif_url;
    delete saved.gif_preview_url;
    delete saved.gif_width;
    delete saved.gif_height;
    delete saved.gif_title;

    // Publish to the TARGET thread's group so its participants receive the forwarded message instantly.
    // Best-effort: already durably persisted; a publish failure must not fail the forward.
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(toThreadId).sendToAll({
          type: "message",
          thread_id: saved.thread_id,
          message: saved,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_forward_message publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ message: saved }));
  } catch (err) {
    context.log.error("theo_chat_forward_message failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Message violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
