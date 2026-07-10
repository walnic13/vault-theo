const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const EMOJI_MAX = 32;

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
// VC-Reactions: an emoji is a short, non-empty string (1–32 chars) with no control characters. The DB
// CHECK (length(emoji) BETWEEN 1 AND 32) is the durable guard; this is the deterministic 400 before SQL.
function isValidReactionEmoji(value) {
  if (typeof value !== "string") return false;
  if (value.length < 1 || value.length > EMOJI_MAX) return false;
  if (value.trim().length < 1) return false;                 // reject whitespace-only
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return false; // reject C0 control chars + DEL
  }
  return true;
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
  const emoji = typeof body.emoji === "string" ? body.emoji : "";
  if (!isValidReactionEmoji(emoji)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'emoji' is required and must be 1-32 characters with no control characters.", 400));
  }

  let client = null;
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

    // Membership gate: resolve the message under RLS. theo_chat_message_select returns it ONLY if the
    // caller is a participant of its thread, so a caller can only react to a message they can already
    // see. Absent / not a participant → 404 (no existence leak). thread_id is read here (not client-
    // supplied) and carried into the INSERT so the reaction is always attributed to the true thread.
    const m = await client.query(
      `SELECT thread_id FROM public.theo_chat_messages WHERE id = $1`,
      [messageId]
    );
    if (m.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Message not found.", 404);
    }
    const threadId = m.rows[0].thread_id;

    // Idempotent add. The theo_chat_message_reaction_insert RLS policy independently enforces
    // oid = auth.uid() AND caller ∈ thread. ON CONFLICT (message_id, oid, emoji) DO NOTHING → re-adding
    // the same reaction is a no-op (added:false). Single statement runs in autocommit; no explicit txn.
    const ins = await client.query(
      `INSERT INTO public.theo_chat_message_reactions (message_id, thread_id, oid, emoji)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (message_id, oid, emoji) DO NOTHING
       RETURNING id`,
      [messageId, threadId, oid, emoji]
    );
    const added = ins.rowCount > 0;

    // Best-effort realtime: tell connected participants to render the reaction live. The row is already
    // durably committed; a publish failure must not fail the request (peers reconcile on their next list).
    if (added && process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "reaction_added",
          thread_id: threadId,
          message_id: messageId,
          emoji,
          oid,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_add_reaction publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ added, message_id: messageId, emoji }));
  } catch (err) {
    context.log.error("theo_chat_add_reaction failed", err);
    if (err && err.code === "42501") {
      // RLS denial (INSERT WITH CHECK) — the caller may not react in this conversation.
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Reaction violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
