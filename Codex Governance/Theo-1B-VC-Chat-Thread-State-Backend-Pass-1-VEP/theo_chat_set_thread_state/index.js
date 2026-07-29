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
  // Per-user state flags. Each is OPTIONAL but must be a boolean when present; at least one is required. A field
  // that is omitted is left unchanged (partial update via COALESCE), so a caller can toggle hidden without
  // clobbering muted and vice-versa. No enum/regex parsing — strict boolean typeof only.
  const hasHidden = body.hidden !== undefined;
  const hasMuted = body.muted !== undefined;
  if (!hasHidden && !hasMuted) {
    return send(context, 400, errorBody("INVALID_REQUEST", "At least one of 'hidden' / 'muted' is required.", 400));
  }
  if (hasHidden && typeof body.hidden !== "boolean") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'hidden' must be a boolean.", 400));
  }
  if (hasMuted && typeof body.muted !== "boolean") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'muted' must be a boolean.", 400));
  }
  const hidden = hasHidden ? body.hidden : null;
  const muted = hasMuted ? body.muted : null;

  let client = null;
  let threadState = null;
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

    // Membership gate — not a participant → 404.
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Upsert the caller's own per-thread state row. A NULL param means "leave that flag unchanged" (COALESCE to
    // the existing value on UPDATE, or to false on a first INSERT). The member INSERT/UPDATE RLS policies restrict
    // this to the caller's own row within a thread they belong to (member_oid = $2 = the authenticated OID).
    const upd = await client.query(
      `
      INSERT INTO public.theo_chat_thread_members (thread_id, member_oid, hidden, muted)
      VALUES ($1, $2, COALESCE($3::boolean, false), COALESCE($4::boolean, false))
      ON CONFLICT (thread_id, member_oid)
      DO UPDATE SET
        hidden = COALESCE($3::boolean, public.theo_chat_thread_members.hidden),
        muted  = COALESCE($4::boolean, public.theo_chat_thread_members.muted)
      RETURNING thread_id, member_oid, hidden, muted
      `,
      [threadId, oid, hidden, muted]
    );
    threadState = upd.rows[0];

    // NO realtime publish. hidden/muted are PRIVATE per-user state — unlike read receipts, they must not be
    // disclosed to other thread participants. The deployed chat realtime contract auto-joins every participant
    // to the thread group, so a group publish would leak "member X hid/muted this" to everyone (T13 / backend
    // hard gate). The durable write is authoritative; the caller's OTHER sessions reconcile on their next
    // list_threads fetch. A user-scoped realtime channel (caller-only) is a separate, future concern.
    return send(context, 200, successBody({ thread_state: threadState }));
  } catch (err) {
    context.log.error("theo_chat_set_thread_state failed", err);
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
