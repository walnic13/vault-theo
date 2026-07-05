const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

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
    // Absent / not a participant → 404. Only a CHANNEL is archivable; only the ADMIN may archive.
    const t = await client.query(
      `SELECT kind, admin_oid FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids) FOR UPDATE`,
      [threadId, oid]
    );
    if (t.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    const row = t.rows[0];
    if (row.kind !== "channel") {
      throw buildKnownError("INVALID_REQUEST", "Only a channel can be archived.", 400);
    }
    if (row.admin_oid !== oid) {
      throw buildKnownError("FORBIDDEN", "Only the channel admin can archive the channel.", 403);
    }

    // Admin predicate is IN the UPDATE (execution-time safe: 0 rows if admin changed under a race);
    // idempotent (archived_at set once); admin remains a member → the thread UPDATE WITH CHECK holds.
    const upd = await client.query(
      `UPDATE public.theo_chat_threads SET archived_at = now(), updated_at = now()
         WHERE id = $1 AND admin_oid = $2 AND archived_at IS NULL
       RETURNING id`,
      [threadId, oid]
    );
    // rowCount 0 could mean already archived (idempotent success) OR admin changed under a race.
    // Re-read the archived state to disambiguate: still-visible + archived → success; else 403.
    if (upd.rowCount === 0) {
      const chk = await client.query(
        `SELECT archived_at IS NOT NULL AS archived, admin_oid FROM public.theo_chat_threads WHERE id = $1`,
        [threadId]
      );
      const r = chk.rows[0];
      if (!r || r.admin_oid !== oid || r.archived !== true) {
        throw buildKnownError("FORBIDDEN", "Only the channel admin can archive the channel.", 403);
      }
    }

    await client.query("COMMIT");
    return send(context, 200, successBody({ thread_id: threadId, archived: true }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_archive_channel failed", err);
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
