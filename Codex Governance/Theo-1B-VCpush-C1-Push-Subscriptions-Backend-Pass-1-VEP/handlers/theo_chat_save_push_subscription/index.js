const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const MAX_UA = 1000;

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
function isHttpsUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  let u;
  try { u = new URL(value.trim()); } catch { return false; }
  return u.protocol === "https:";
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

  // Validate the full field set BEFORE any SQL (deterministic 400).
  const endpoint = typeof body.endpoint === "string" ? body.endpoint.trim() : "";
  if (!isHttpsUrl(endpoint)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'endpoint' is required and must be a non-empty https URL.", 400));
  }
  const p256dh = typeof body.p256dh === "string" ? body.p256dh.trim() : "";
  if (!p256dh) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'p256dh' is required and must be non-empty.", 400));
  }
  const auth = typeof body.auth === "string" ? body.auth.trim() : "";
  if (!auth) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'auth' is required and must be non-empty.", 400));
  }
  let ua = null;
  if (body.ua != null) {
    if (typeof body.ua !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'ua' must be a string when provided.", 400));
    }
    ua = body.ua.trim().slice(0, MAX_UA) || null;
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

    // Single-owner-per-endpoint claim (endpoint is GLOBALLY UNIQUE). The SECURITY DEFINER function
    // theo_chat_claim_push_subscription atomically reassigns the endpoint to the authenticated caller
    // (created_by := auth.uid(), NEVER a client value), removing any prior owner's access in the same
    // statement — so a shared-browser re-subscribe cannot leave two owners for one endpoint. It returns
    // (id, created_at) so the response contract below is produced.
    const claim = await client.query(
      `SELECT id, created_at FROM public.theo_chat_claim_push_subscription($1, $2, $3, $4)`,
      [endpoint, p256dh, auth, ua]
    );

    return send(context, 201, successBody({ subscription: { id: claim.rows[0].id, endpoint, created_at: claim.rows[0].created_at } }));
  } catch (err) {
    context.log.error("theo_chat_save_push_subscription failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this subscription.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
