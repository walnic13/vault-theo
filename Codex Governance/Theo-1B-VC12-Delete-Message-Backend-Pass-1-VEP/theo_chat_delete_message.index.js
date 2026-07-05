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

    // User-facing validation under RLS: the message is visible only if the caller is a participant of
    // its thread (theo_chat_message_select). Absent / not a participant → 404 (no existence leak). The
    // privileged tombstone runs in the SECURITY DEFINER theo_chat_delete_message() (messages carry no
    // UPDATE policy for the app role); it independently re-checks sender = caller.
    const m = await client.query(
      `SELECT sender_oid, thread_id FROM public.theo_chat_messages WHERE id = $1`,
      [messageId]
    );
    if (m.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Message not found.", 404);
    }
    const row = m.rows[0];
    if (row.sender_oid !== oid) {
      throw buildKnownError("FORBIDDEN", "You can only delete your own message.", 403);
    }

    const res = await client.query(`SELECT public.theo_chat_delete_message($1) AS deleted`, [messageId]);
    const deleted = res.rows[0] && res.rows[0].deleted === true;

    // Best-effort realtime: tell connected participants to tombstone the message live. The delete is
    // already durably committed; a publish failure must not fail the delete (peers reconcile on reload).
    if (deleted && process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(row.thread_id).sendToAll({
          type: "message_deleted",
          thread_id: row.thread_id,
          message_id: messageId,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_delete_message publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 200, successBody({ thread_id: row.thread_id, message_id: messageId, deleted }));
  } catch (err) {
    context.log.error("theo_chat_delete_message failed", err);
    if (err && err.code === "42501") {
      // RLS denial OR the definer function's sender re-check — either way the caller may not delete this.
      return send(context, 403, errorBody("FORBIDDEN", "You can only delete your own message.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
