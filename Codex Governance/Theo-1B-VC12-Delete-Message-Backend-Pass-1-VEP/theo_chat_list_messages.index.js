const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const REPLY_PREVIEW_MAX = 200; // VC-11: cap the quoted-parent snippet to bound the payload (matches send).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

  const q = req.query || {};
  const threadId = typeof q.threadId === "string" ? q.threadId.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'threadId' is required and must be a valid UUID.", 400));
  }

  // Cursor: 'before' (exclusive) returns older messages for infinite scroll. Strict-regex before parseInt
  // (parseInt('1.5') → 1 would silently pass a range check) per the parseInt-drift discipline.
  let before = null;
  if (q.before != null && String(q.before).trim() !== "") {
    const raw = String(q.before).trim();
    if (!/^[0-9]+$/.test(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'before' must be a non-negative integer.", 400));
    }
    before = parseInt(raw, 10);
  }

  let limit = DEFAULT_LIMIT;
  if (q.limit != null && String(q.limit).trim() !== "") {
    const raw = String(q.limit).trim();
    if (!/^[0-9]+$/.test(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'limit' must be a positive integer.", 400));
    }
    limit = parseInt(raw, 10);
    if (limit < 1) limit = 1;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
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

    // Membership gate — not a participant → 404 (no existence leak).
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Fetch newest-first for the cursor, then return ascending for display. RLS also enforces the gate.
    // VC-11: LEFT JOIN LATERAL the replied-to parent (same thread → RLS-visible) for the quote preview.
    // VC-12: carry m.deleted_at + the parent's deleted_at so tombstoned messages/quotes render as deleted
    // (body is already NULL in the DB for a tombstoned row — a soft delete removes the content for all).
    const params = [threadId];
    let where = `m.thread_id = $1`;
    if (before != null) { params.push(before); where += ` AND m.seq < $${params.length}`; }
    params.push(limit);
    const rows = await client.query(
      `SELECT m.id, m.thread_id, m.seq, m.sender_oid, m.body, m.created_at, m.reply_to_message_id, m.deleted_at,
              p.id AS p_id, p.seq AS p_seq, p.sender_oid AS p_sender_oid, p.body AS p_body, p.deleted_at AS p_deleted_at
       FROM public.theo_chat_messages m
       LEFT JOIN LATERAL (
         SELECT pm.id, pm.seq, pm.sender_oid, pm.body, pm.deleted_at
         FROM public.theo_chat_messages pm
         WHERE pm.id = m.reply_to_message_id AND pm.thread_id = m.thread_id
         LIMIT 1
       ) p ON true
       WHERE ${where}
       ORDER BY m.seq DESC
       LIMIT $${params.length}`,
      params
    );

    // Shape each row: the message plus a `reply_to` preview (null when not a reply). VC-12: `deleted` +
    // `deleted_at` on both the message and the quoted parent; a tombstoned body is NULL (removed for all).
    const shaped = rows.rows.map((r) => ({
      id: r.id,
      thread_id: r.thread_id,
      seq: Number(r.seq),
      sender_oid: r.sender_oid,
      body: r.body,
      created_at: r.created_at,
      deleted: r.deleted_at != null,
      deleted_at: r.deleted_at,
      reply_to_message_id: r.reply_to_message_id,
      reply_to: r.p_id == null ? null : {
        id: r.p_id,
        seq: Number(r.p_seq),
        sender_oid: r.p_sender_oid,
        body: typeof r.p_body === "string" ? r.p_body.slice(0, REPLY_PREVIEW_MAX) : r.p_body,
        deleted: r.p_deleted_at != null,
      },
    }));

    const ordered = shaped.slice().reverse();
    const hasMore = rows.rowCount === limit;
    const nextBefore = ordered.length > 0 ? Number(ordered[0].seq) : null;

    return send(context, 200, successBody({
      messages: ordered,
      page: { limit, has_more: hasMore, next_before: hasMore ? nextBefore : null },
    }));
  } catch (err) {
    context.log.error("theo_chat_list_messages failed", err);
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
