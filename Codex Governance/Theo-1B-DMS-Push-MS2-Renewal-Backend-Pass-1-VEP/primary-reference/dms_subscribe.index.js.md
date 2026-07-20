# Primary Reference (Golden Handler §2) — deployed `dms_subscribe` `index.js` (keyless, DMS-Push MS1 Pass-4)

Canonical Primary Reference for MS2. Deployed on `vaultgpt-func-chat` (Tier DMS-Push MS1, keyless Pass-4, Codex-APPROVED + golden-verified 2026-07-19). It is the closest deployed structural match to `dms_renew_subscriptions`: identical `pg` Pool idiom, identical keyless `getManagedIdentityAccessToken` + http/https `requestUrl`, identical `GRAPH_RESOURCE`, an app-only Graph call, and app-infra SECURITY DEFINER access (`dms_sub_*`). Inlined FULL VERBATIM (no ellipsis). MS2's deltas vs this reference: the trigger is a timer (greenfield binding), the Graph call is `PATCH /subscriptions/{id}` (renewal, Walter-authorized) instead of `POST /subscriptions`, and the SECURITY DEFINER helpers are the enumeration/renewal set (`dms_sub_list_expiring`/`dms_sub_touch_expiration`/`dms_sub_delete`).

```javascript
const crypto = require("crypto");
const { Pool } = require("pg");

// dms_subscribe (Tier DMS-Push MS1 — Pass-4 keyless) — idempotently ensure a Microsoft Graph
// change-notification subscription exists for a DMS drive root, so SharePoint changes push to
// viewers. Called by the signed-in user's DMS remote when a drive is first viewed. App-level: the
// subscription is created with an APP-ONLY Graph token acquired KEYLESSLY via the Function App's
// system-assigned managed identity (scope https://graph.microsoft.com — the MI carries the
// Walter-consented Graph `Sites.Read.All` application permission) — NOT a user token and NOT a
// client-secret. This mirrors the deployed HF-T6 audio brokers' keyless MI-token idiom. The change
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
// App-only Graph audience for the managed-identity token (the MI holds Sites.Read.All Application).
const GRAPH_RESOURCE = "https://graph.microsoft.com";

let pool = null;
function getPool() {
  // EXACT match to the deployed func-chat handler theo_chat_send_message (verified via Kudu this turn):
  // POSTGRES_CONNECTION_STRING + ssl.rejectUnauthorized:false. A different env/ssl would fail to connect.
  if (!pool) pool = new Pool({ connectionString: process.env.POSTGRES_CONNECTION_STRING, ssl: { rejectUnauthorized: false }, max: 2 });
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

// ---- Raw http/https helper (verbatim from the theo_transcribe_audio Primary Reference):
// picks http vs https by protocol so it can reach BOTH the http localhost MI token endpoint and
// the https Graph endpoint; writes an optional request body and buffers the response text.
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// ---- Managed-identity access token (verbatim from the theo_transcribe_audio Primary Reference;
// keyless). Scope/resource is Graph instead of Cognitive Services — the sole allowed delta.
async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error(
      "Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing). " +
      "Ensure System Assigned Managed Identity is enabled on the Function App."
    );
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) {
    throw new Error("Managed Identity token endpoint did not return access_token.");
  }
  return payload.access_token;
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
  // Strict input contract (Golden Handler §3): the body accepts EXACTLY { siteId, driveId }. Reject
  // any unknown/extra field deterministically before any Graph/DB work.
  const allowed = new Set(["siteId", "driveId"]);
  const extraKeys = Object.keys(body).filter((k) => !allowed.has(k));
  if (extraKeys.length > 0) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Unexpected field(s): ${extraKeys.join(", ")}.`, 400));
  }
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

    const graphToken = await getManagedIdentityAccessToken(GRAPH_RESOURCE);
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
```
