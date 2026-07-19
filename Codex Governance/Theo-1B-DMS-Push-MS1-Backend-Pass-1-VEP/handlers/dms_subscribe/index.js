const https = require("https");
const crypto = require("crypto");
const { Pool } = require("pg");

// dms_subscribe (Tier DMS-Push MS1) — idempotently ensure a Microsoft Graph change-notification
// subscription exists for a DMS drive root, so SharePoint changes push to viewers. Called by the
// signed-in user's DMS remote when a drive is first viewed. App-level: the subscription is created
// with an APP (client_credentials) Graph token carrying the Walter-consented change-notification
// permission (NOT the user's delegated token) — one subscription per drive, shared. The change
// SIGNAL is trigger-only; per-user SharePoint trimming stays in the delegated dms_delta path.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

// Conservative subscription lifetime; the MS2 renewal timer extends before expiry. Kept well under
// Graph's driveItem-subscription maximum so creation never fails on an over-long expiration.
const SUBSCRIPTION_MINUTES = 55;
const DRIVE_ID_MIN = 5;
const DRIVE_ID_MAX = 300;
const SITE_ID_MIN = 10;
const SITE_ID_MAX = 200;

let pool = null;
function getPool() {
  if (!pool) pool = new Pool({ connectionString: process.env.PG_CONNECTION_STRING, max: 2 });
  return pool;
}

function send(context, status, body, asText) {
  context.res = {
    status,
    headers: { ...corsHeaders, "Content-Type": asText ? "text/plain" : "application/json" },
    body,
  };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const t of claimTypes) {
    const m = principal.claims.find((c) => c.typ === t);
    if (m && typeof m.val === "string" && m.val.trim() !== "") return m.val.trim();
  }
  return null;
}

function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = https.request(
      { method: options.method || "GET", hostname: url.hostname, port: url.port ? Number(url.port) : 443, path: url.pathname + url.search, headers: options.headers || {} },
      (res) => { let d = ""; res.on("data", (c) => (d += c)); res.on("end", () => resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: d })); }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// App-level Graph token via client_credentials (mirrors the deployed gateway token idiom; scope is
// Graph, not Foundry). Requires the Walter-consented change-notification application permission.
async function getAppGraphToken() {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) throw new Error("Missing Graph app credentials.");
  const form = new URLSearchParams({
    client_id: clientId, client_secret: clientSecret,
    grant_type: "client_credentials", scope: "https://graph.microsoft.com/.default",
  }).toString();
  const r = await requestUrl(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } },
    form
  );
  const p = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !p || !p.access_token) throw new Error("Graph app token request failed.");
  return p.access_token;
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") return send(context, 204, "");

  // EasyAuth identity required (an authenticated employee triggers the ensure). We do NOT use the
  // user token for Graph — the subscription is app-level — but we gate the endpoint to signed-in users.
  const oid = getClaimValue(getPrincipal(req), [
    "http://schemas.microsoft.com/identity/claims/objectidentifier", "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));

  const body = parseJsonSafe(req.rawBody || (typeof req.body === "string" ? req.body : JSON.stringify(req.body || {}))) || {};
  const siteId = typeof body.siteId === "string" ? body.siteId.trim() : "";
  const driveId = typeof body.driveId === "string" ? body.driveId.trim() : "";
  if (siteId.length < SITE_ID_MIN || siteId.length > SITE_ID_MAX || siteId.includes("%") || siteId.includes("_")) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Body 'siteId' invalid.", 400));
  }
  if (driveId.length < DRIVE_ID_MIN || driveId.length > DRIVE_ID_MAX) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Body 'driveId' invalid.", 400));
  }

  const notificationUrl = process.env.DMS_NOTIFICATION_URL; // public func-chat dms_notifications URL
  if (!notificationUrl) return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Notification URL not configured.", 500));

  const db = getPool();
  try {
    // Idempotent: if a live (not near-expiry) subscription already exists for this drive, no-op.
    const existing = await db.query("SELECT expiration FROM public.dms_sub_get_by_drive($1)", [driveId]);
    if (existing.rows.length > 0) {
      const exp = new Date(existing.rows[0].expiration).getTime();
      if (exp - Date.now() > 10 * 60 * 1000) {
        return send(context, 200, successBody({ dms_subscribe: { drive_id: driveId, ensured: true, refreshed: false } }));
      }
    }

    const graphToken = await getAppGraphToken();
    const clientState = crypto.randomBytes(24).toString("hex");
    const expiration = new Date(Date.now() + SUBSCRIPTION_MINUTES * 60 * 1000).toISOString();
    const resource = `drives/${driveId}/root`;

    // Graph validates notificationUrl SYNCHRONOUSLY during this POST (it calls dms_notifications with
    // ?validationToken=…, which must echo it back within ~10s), so dms_notifications must be deployed.
    const createBody = JSON.stringify({
      changeType: "updated",
      notificationUrl,
      resource,
      expirationDateTime: expiration,
      clientState,
    });
    const r = await requestUrl(
      "https://graph.microsoft.com/v1.0/subscriptions",
      { method: "POST", headers: { Authorization: `Bearer ${graphToken}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(createBody) } },
      createBody
    );
    const created = parseJsonSafe(r.body);
    if (r.statusCode < 200 || r.statusCode >= 300 || !created || typeof created.id !== "string") {
      const msg = created && created.error && created.error.message ? created.error.message : "Graph subscription create failed.";
      context.log.warn("dms_subscribe: graph create failed", r.statusCode, msg);
      // 403 (consent/permission) / 400 (validation/URL) -> surface as 502-class upstream failure.
      return send(context, 502, errorBody("UPSTREAM_ERROR", "Could not create the change subscription.", 502));
    }

    await db.query("SELECT public.dms_sub_upsert($1,$2,$3,$4,$5,$6)", [
      created.id, siteId, driveId, resource, clientState,
      typeof created.expirationDateTime === "string" ? created.expirationDateTime : expiration,
    ]);

    return send(context, 201, successBody({ dms_subscribe: { drive_id: driveId, ensured: true, refreshed: true, expiration: created.expirationDateTime || expiration } }));
  } catch (err) {
    context.log.error("dms_subscribe failed", err);
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Failed to ensure DMS subscription.", 500));
  }
};
