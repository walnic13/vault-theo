# Primary Reference (Golden Handler §2) — deployed `theo_chat_negotiate` `index.js`

Canonical Primary Reference for MS3a. Deployed on `vaultgpt-func-chat` — the receive-only Azure Web PubSub client-token issuer for the chat hub `vaultchat`. Retrieved this turn from the live Kudu VFS (HTTP 200). Inlined FULL VERBATIM (no ellipsis). `dms_negotiate` mirrors this handler's envelope/identity helpers and the `WebPubSubServiceClient(...).getClientAccessToken({ userId, groups })` **receive-only** token idiom EXACT; the deltas are: (a) `groups` is the single constant `["dms-changes"]` broadcast group instead of the caller's RLS-scoped thread ids, so (b) the `pg` Pool, `set_config` session context, and the `theo_chat_threads` membership query are REMOVED (no per-user data scoping is required for an opaque-drive-id broadcast).

```javascript
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
    // token is scoped to EXACTLY these thread groups, RECEIVE-ONLY — `groups` auto-joins the caller so it
    // receives server-published messages; NO publish/group-mutation role is granted. New threads created
    // later require a re-negotiate (the FE re-fetches on create/first-open). Group name = the thread id.
    const rows = await client.query(
      `SELECT id FROM public.theo_chat_threads WHERE $1 = ANY(member_oids) ORDER BY updated_at DESC LIMIT 1000`,
      [oid]
    );
    const threadIds = rows.rows.map((r) => r.id);

    const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
    // userId = the caller's OID; groups = auto-join (receive) the caller's threads; NO roles granted →
    // the client has no `sendToGroup`/direct-publish or group-mutation authority. ALL sends go through the
    // server-authoritative theo_chat_send_message (validate → seq → persist+commit → publish), so no
    // client can emit a non-durable message that bypasses persistence/seq/unread/audit ordering.
    const token = await serviceClient.getClientAccessToken({ userId: oid, groups: threadIds });

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
```
