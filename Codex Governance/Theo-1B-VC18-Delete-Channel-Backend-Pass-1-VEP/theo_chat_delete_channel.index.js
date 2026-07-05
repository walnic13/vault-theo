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

  const threadId = typeof body.thread_id === "string" ? body.thread_id.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'thread_id' is required and must be a valid UUID.", 400));
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

    await client.query("BEGIN");

    // ROW-LOCK the thread (FOR UPDATE) so admin authority can't change under a concurrent transfer.
    // Absent / not a participant → 404. Only a CHANNEL is deletable; only the ADMIN may delete.
    const t = await client.query(
      `SELECT kind, admin_oid FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids) FOR UPDATE`,
      [threadId, oid]
    );
    if (t.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    const row = t.rows[0];
    if (row.kind !== "channel") {
      throw buildKnownError("INVALID_REQUEST", "Only a channel can be deleted.", 400);
    }
    if (row.admin_oid !== oid) {
      throw buildKnownError("FORBIDDEN", "Only the channel admin can delete the channel.", 403);
    }

    // Admin predicate is IN the DELETE (execution-time safe: 0 rows if admin changed under a race). The
    // theo_chat_thread_delete RLS policy (admin_oid = auth.uid()) is the second gate. Deleting the thread
    // CASCADES to theo_chat_thread_members + theo_chat_messages via their ON DELETE CASCADE FKs.
    const del = await client.query(
      `DELETE FROM public.theo_chat_threads WHERE id = $1 AND admin_oid = $2 AND kind = 'channel' RETURNING id`,
      [threadId, oid]
    );
    if (del.rowCount === 0) {
      // Under the FOR UPDATE lock this only happens if admin changed before the lock; not the admin → 403.
      throw buildKnownError("FORBIDDEN", "Only the channel admin can delete the channel.", 403);
    }

    await client.query("COMMIT");

    // Best-effort realtime: tell connected participants the channel is gone so they drop it live. The
    // delete is already committed; a publish failure must not fail the delete (peers reconcile on reload).
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "channel_deleted",
          thread_id: threadId,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_delete_channel publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 200, successBody({ thread_id: threadId, deleted: true }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_delete_channel failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "Only the channel admin can delete the channel.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
