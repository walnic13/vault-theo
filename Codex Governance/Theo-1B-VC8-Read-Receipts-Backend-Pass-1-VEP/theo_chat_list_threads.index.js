const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

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

    // RLS returns only the caller's threads. For each: the caller's read state (last_read_seq), the last
    // message (for the list preview), the unread count (messages after last_read_seq not sent by the
    // caller), and — VC-8 Teams-style read receipts — the OTHER participants' read positions (members_read).
    // All joins stay within RLS-visible rows (the theo_chat_member_select policy lets a participant read any
    // member row of a thread they belong to). members_read excludes the caller's own row.
    const rows = await client.query(
      `
      SELECT
        t.id, t.kind, t.name, t.member_oids, t.created_by, t.dm_key, t.created_at, t.updated_at,
        COALESCE(mem.last_read_seq, 0) AS last_read_seq,
        lm.seq        AS last_seq,
        lm.body       AS last_body,
        lm.sender_oid AS last_sender_oid,
        lm.created_at AS last_message_at,
        COALESCE(unread.cnt, 0) AS unread_count,
        COALESCE(reads.members_read, '[]'::json) AS members_read
      FROM public.theo_chat_threads t
      LEFT JOIN public.theo_chat_thread_members mem
        ON mem.thread_id = t.id AND mem.member_oid = $1
      LEFT JOIN LATERAL (
        SELECT m.seq, m.body, m.sender_oid, m.created_at
        FROM public.theo_chat_messages m
        WHERE m.thread_id = t.id
        ORDER BY m.seq DESC
        LIMIT 1
      ) lm ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::bigint AS cnt
        FROM public.theo_chat_messages m2
        WHERE m2.thread_id = t.id
          AND m2.seq > COALESCE(mem.last_read_seq, 0)
          AND m2.sender_oid <> $1
      ) unread ON true
      LEFT JOIN LATERAL (
        SELECT json_agg(
                 json_build_object('oid', om.member_oid, 'last_read_seq', om.last_read_seq)
                 ORDER BY om.member_oid
               ) AS members_read
        FROM public.theo_chat_thread_members om
        WHERE om.thread_id = t.id AND om.member_oid <> $1
      ) reads ON true
      WHERE $1 = ANY (t.member_oids)
      ORDER BY t.updated_at DESC
      LIMIT 1000
      `,
      [oid]
    );

    const threads = rows.rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      name: r.name,
      member_oids: r.member_oids,
      created_by: r.created_by,
      dm_key: r.dm_key,
      created_at: r.created_at,
      updated_at: r.updated_at,
      last_read_seq: Number(r.last_read_seq),
      unread_count: Number(r.unread_count),
      last_message: r.last_seq == null ? null : {
        seq: Number(r.last_seq),
        body: r.last_body,
        sender_oid: r.last_sender_oid,
        created_at: r.last_message_at,
      },
      // VC-8: other participants' read positions (Teams-style "Seen"). Empty array when alone / no peers.
      members_read: Array.isArray(r.members_read)
        ? r.members_read.map((x) => ({ oid: x.oid, last_read_seq: Number(x.last_read_seq) }))
        : [],
    }));

    return send(context, 200, successBody({ threads }));
  } catch (err) {
    context.log.error("theo_chat_list_threads failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list conversations.", 403));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
