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
// Entra object ids are GUIDs; a DM peer is identified by its OID.
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

  const peerOid = typeof body.peer_oid === "string" ? body.peer_oid.trim() : "";
  if (!isOid(peerOid)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'peer_oid' is required and must be a valid Entra object id.", 400));
  }
  if (peerOid.toLowerCase() === oid.toLowerCase()) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Cannot open a direct message with yourself.", 400));
  }

  // Canonical DM identity: the unordered pair, sorted, joined by '|'. Guarantees A↔B and B↔A resolve to
  // one thread (backed by the unique partial index on dm_key).
  const pair = [oid, peerOid].sort((a, b) => a.localeCompare(b));
  const dmKey = `${pair[0]}|${pair[1]}`;

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

    // Get-or-create. Existing DM (either party already created it) → return it. RLS lets the caller see it
    // because the caller is in member_oids.
    const existing = await client.query(
      `SELECT id, kind, name, member_oids, created_by, dm_key, created_at, updated_at
       FROM public.theo_chat_threads
       WHERE dm_key = $1 AND $2 = ANY(member_oids)`,
      [dmKey, oid]
    );
    if (existing.rowCount > 0) {
      await client.query("COMMIT");
      return send(context, 200, successBody({ thread: existing.rows[0], created: false }));
    }

    // Create the thread with BOTH members present in member_oids (so the RLS INSERT check —
    // created_by = auth.uid() AND auth.uid() = ANY(member_oids) — passes and the peer can immediately see it).
    let thread;
    try {
      const ins = await client.query(
        `INSERT INTO public.theo_chat_threads (kind, name, member_oids, created_by, dm_key)
         VALUES ('dm', NULL, ARRAY[$1, $2]::text[], $1, $3)
         RETURNING id, kind, name, member_oids, created_by, dm_key, created_at, updated_at`,
        [oid, peerOid, dmKey]
      );
      thread = ins.rows[0];
    } catch (e) {
      // Concurrent create raced us to the unique dm_key — re-select the winning row and return it.
      if (e && e.code === "23505") {
        await client.query("ROLLBACK");
        await client.query("BEGIN");
        const race = await client.query(
          `SELECT id, kind, name, member_oids, created_by, dm_key, created_at, updated_at
           FROM public.theo_chat_threads WHERE dm_key = $1 AND $2 = ANY(member_oids)`,
          [dmKey, oid]
        );
        await client.query("COMMIT");
        if (race.rowCount > 0) return send(context, 200, successBody({ thread: race.rows[0], created: false }));
        throw buildKnownError("CONFLICT", "Could not open the conversation; please retry.", 409);
      }
      throw e;
    }

    // Read-state rows for both members (membership authority stays threads.member_oids; these track unread).
    await client.query(
      `INSERT INTO public.theo_chat_thread_members (thread_id, member_oid)
       VALUES ($1, $2), ($1, $3)
       ON CONFLICT (thread_id, member_oid) DO NOTHING`,
      [thread.id, oid, peerOid]
    );

    await client.query("COMMIT");
    return send(context, 201, successBody({ thread, created: true }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_create_dm failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Request violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
