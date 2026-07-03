const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";

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
  if (!process.env.WebPubSubConnectionString) {
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Chat realtime is not configured.", 500));
  }

  const client = await pool.connect();
  try {
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // The caller's threads (RLS returns only threads where the caller is a participant). The Web PubSub
    // token is scoped to EXACTLY these thread groups — the client can join + publish (typing/ephemeral)
    // only to its own threads. New threads created later require a re-negotiate (the FE re-fetches on
    // create/first-open). Group name = the thread id.
    const rows = await client.query(
      `SELECT id FROM public.theo_chat_threads WHERE $1 = ANY(member_oids) ORDER BY updated_at DESC LIMIT 1000`,
      [oid]
    );
    const threadIds = rows.rows.map((r) => r.id);

    const roles = [];
    for (const tid of threadIds) {
      roles.push(`webpubsub.joinLeaveGroup.${tid}`);
      roles.push(`webpubsub.sendToGroup.${tid}`);
    }

    const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
    // userId = the caller's OID; groups = auto-join the caller's threads; roles = per-thread scoped.
    const token = await serviceClient.getClientAccessToken({ userId: oid, groups: threadIds, roles });

    return send(context, 200, successBody({ url: token.url, hub: HUB, groups: threadIds }));
  } catch (err) {
    context.log.error("theo_chat_negotiate failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to connect to chat.", 403));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
