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
// VC-Reactions: an emoji is a short, non-empty string (1-32 chars) with no control characters (must match
// the value the client sent to theo_chat_add_reaction). Deterministic 400 before any SQL.
function isValidReactionEmoji(value) {
  if (typeof value !== "string") return false;
  if (value.length < 1 || value.length > EMOJI_MAX) return false;
  if (value.trim().length < 1) return false;                 // reject whitespace-only
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return false;          // reject C0 control chars + DEL
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

    // Idempotent remove. The theo_chat_message_reaction_delete RLS policy independently enforces
    // oid = auth.uid() AND caller ∈ thread; the WHERE oid = $2 makes it doubly explicit that a caller
    // can only remove their OWN reaction. Nothing matching (already gone / never existed / not a
    // participant) → removed:false, 200 (idempotent — no existence leak, no 404). RETURNING thread_id
    // yields the group id for the best-effort publish. Single statement runs in autocommit.
    const del = await client.query(
      `DELETE FROM public.theo_chat_message_reactions
       WHERE message_id = $1 AND oid = $2 AND emoji = $3
       RETURNING thread_id`,
      [messageId, oid, emoji]
    );
    const removed = del.rowCount > 0;
    const threadId = removed ? del.rows[0].thread_id : null;

    // Best-effort realtime: tell connected participants to drop the reaction live. Already durably
    // committed; a publish failure must not fail the request (peers reconcile on their next list).
    if (removed && process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "reaction_removed",
          thread_id: threadId,
          message_id: messageId,
          emoji,
          oid,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_remove_reaction publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 200, successBody({ removed, message_id: messageId, emoji }));
  } catch (err) {
    context.log.error("theo_chat_remove_reaction failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
