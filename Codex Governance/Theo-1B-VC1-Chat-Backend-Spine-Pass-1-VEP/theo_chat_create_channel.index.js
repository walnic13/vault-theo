const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const MAX_NAME = 120;
const MAX_MEMBERS = 200;

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
function isOid(value) {
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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'name' is required and must be non-empty.", 400));
  }
  if (name.length > MAX_NAME) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'name' exceeds ${MAX_NAME} characters.`, 400));
  }

  const rawMembers = Array.isArray(body.member_oids) ? body.member_oids : [];
  for (const m of rawMembers) {
    if (!isOid(typeof m === "string" ? m.trim() : m)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Every entry in 'member_oids' must be a valid Entra object id.", 400));
    }
  }

  // Creator is always a member. De-dupe (case-insensitive on OID) and include the caller.
  const seen = new Map();
  seen.set(oid.toLowerCase(), oid);
  for (const m of rawMembers) {
    const v = m.trim();
    if (!seen.has(v.toLowerCase())) seen.set(v.toLowerCase(), v);
  }
  const members = Array.from(seen.values());
  if (members.length > MAX_MEMBERS) {
    return send(context, 400, errorBody("INVALID_REQUEST", `A channel may have at most ${MAX_MEMBERS} members.`, 400));
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

    const ins = await client.query(
      `INSERT INTO public.theo_chat_threads (kind, name, member_oids, created_by, dm_key)
       VALUES ('channel', $1, $2::text[], $3, NULL)
       RETURNING id, kind, name, member_oids, created_by, dm_key, created_at, updated_at`,
      [name, members, oid]
    );
    const thread = ins.rows[0];

    // Read-state rows for every member (values(...) built from the member list).
    const values = members.map((_, i) => `($1, $${i + 2})`).join(", ");
    await client.query(
      `INSERT INTO public.theo_chat_thread_members (thread_id, member_oid)
       VALUES ${values}
       ON CONFLICT (thread_id, member_oid) DO NOTHING`,
      [thread.id, ...members]
    );

    await client.query("COMMIT");
    return send(context, 201, successBody({ thread, created: true }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_create_channel failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create a channel.", 403));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Request violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
