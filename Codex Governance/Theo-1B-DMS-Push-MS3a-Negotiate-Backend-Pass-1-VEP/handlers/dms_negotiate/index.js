const { WebPubSubServiceClient } = require("@azure/web-pubsub");

// dms_negotiate (Tier DMS-Push MS3a) — issue a RECEIVE-ONLY Azure Web PubSub client access token for the
// DMS live-mirror subscriber. The token auto-joins the caller to the single constant broadcast group
// "dms-changes" on the shared chat hub (vaultchat), so the DMS remote receives the trigger-only
// { type:"dms_changed", drive_id } signals fanned by dms_notifications. NO publish / group-mutation role
// is granted (server-authoritative — matches theo_chat_negotiate). Employees-only (EasyAuth). The signal
// is an opaque drive_id, so — unlike chat threads — no per-user group scoping is needed: every employee
// joins the same broadcast group and each client filters to the drive it is viewing. Stateless — no DB.

const HUB = "vaultchat"; // MUST match the deployed chat hub + dms_notifications fan-out target (WEBPUBSUB_HUB)
const DMS_GROUP = "dms-changes"; // MUST match dms_notifications' fan-out group

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
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "DMS realtime is not configured.", 500));
  }

  try {
    const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
    // userId = the caller's OID; groups = auto-join (receive) the single DMS broadcast group; NO roles
    // granted → the client has no sendToGroup / group-mutation authority. All DMS signals are fanned
    // server-side by dms_notifications, so no client can emit a spoofed change event.
    const token = await serviceClient.getClientAccessToken({ userId: oid, groups: [DMS_GROUP] });

    return send(context, 200, successBody({ url: token.url, hub: HUB, groups: [DMS_GROUP] }));
  } catch (err) {
    context.log.error("dms_negotiate failed", err);
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  }
};
