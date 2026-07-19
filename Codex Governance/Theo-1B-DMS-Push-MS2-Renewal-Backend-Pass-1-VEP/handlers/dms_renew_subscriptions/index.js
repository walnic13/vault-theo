const { Pool } = require("pg");

// dms_renew_subscriptions (Tier DMS-Push MS2) — TIMER handler on vaultgpt-func-chat that renews the
// Microsoft Graph change-notification subscriptions created by dms_subscribe BEFORE they expire, so
// the OneDrive-grade DMS live-mirror push keeps flowing without a user re-triggering a subscribe.
// No HTTP surface, no caller identity: a scheduled handler that invokes the app-infra SECURITY
// DEFINER *enumeration* helper dms_sub_list_expiring (returns ONLY identifiers — subscription_id /
// drive_id / expiration, never user content) to find near-expiry rows, renews each at Graph with an
// APP-ONLY token acquired KEYLESSLY via the Function's managed identity (the MI holds Graph
// Sites.Read.All Application), and records the new expiration via dms_sub_touch_expiration. A
// subscription Graph no longer knows about (404) is dropped so a later dms_subscribe recreates it.
// Renewal endpoint (PATCH /v1.0/subscriptions/{id}) is Walter-authorized (DMS-Push MS1 authorization).

const GRAPH_RESOURCE = "https://graph.microsoft.com";
const RENEW_LOOKAHEAD_MINUTES = 20; // renew anything expiring within this window
const SUBSCRIPTION_MINUTES = 55;    // new lifetime — matches dms_subscribe

let pool = null;
function getPool() {
  // EXACT match to the deployed func-chat handler dms_subscribe / theo_chat_send_message:
  // POSTGRES_CONNECTION_STRING + ssl.rejectUnauthorized:false. A different env/ssl would fail to connect.
  if (!pool) pool = new Pool({ connectionString: process.env.POSTGRES_CONNECTION_STRING, ssl: { rejectUnauthorized: false }, max: 2 });
  return pool;
}

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// ---- Raw http/https helper (verbatim from the deployed dms_subscribe Primary Reference):
// picks http vs https by protocol so it reaches BOTH the http localhost MI token endpoint and the
// https Graph endpoint; writes an optional request body and buffers the response text.
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

// ---- Managed-identity access token (verbatim from the deployed dms_subscribe Primary Reference; keyless).
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

module.exports = async function (context, myTimer) {
  const db = getPool();

  // Enumerate near-expiry subscriptions via the SECURITY DEFINER enumeration helper (identifiers only).
  const cutoff = new Date(Date.now() + RENEW_LOOKAHEAD_MINUTES * 60 * 1000).toISOString();
  let rows;
  try {
    const r = await db.query("SELECT subscription_id, drive_id, expiration FROM public.dms_sub_list_expiring($1)", [cutoff]);
    rows = r.rows || [];
  } catch (e) {
    context.log.error("dms_renew_subscriptions: dms_sub_list_expiring failed", e);
    return;
  }
  if (rows.length === 0) {
    context.log("dms_renew_subscriptions: no subscriptions within the renewal window.");
    return;
  }

  let token;
  try {
    token = await getManagedIdentityAccessToken(GRAPH_RESOURCE);
  } catch (e) {
    context.log.error("dms_renew_subscriptions: managed-identity Graph token failed", e);
    return;
  }

  let renewed = 0, dropped = 0, failed = 0;
  for (const row of rows) {
    const newExpiration = new Date(Date.now() + SUBSCRIPTION_MINUTES * 60 * 1000).toISOString();
    const patchBody = JSON.stringify({ expirationDateTime: newExpiration });
    let r;
    try {
      r = await requestUrl(
        `https://graph.microsoft.com/v1.0/subscriptions/${encodeURIComponent(row.subscription_id)}`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(patchBody) } },
        patchBody
      );
    } catch (e) {
      failed++;
      context.log.warn("dms_renew_subscriptions: PATCH threw for", row.subscription_id, e);
      continue;
    }

    if (r.statusCode >= 200 && r.statusCode < 300) {
      const parsed = parseJsonSafe(r.body);
      const effective = parsed && typeof parsed.expirationDateTime === "string" ? parsed.expirationDateTime : newExpiration;
      try {
        await db.query("SELECT public.dms_sub_touch_expiration($1,$2)", [row.subscription_id, effective]);
        renewed++;
      } catch (e) {
        failed++;
        context.log.warn("dms_renew_subscriptions: dms_sub_touch_expiration failed for", row.subscription_id, e);
      }
    } else if (r.statusCode === 404) {
      // Graph no longer knows this subscription — drop the stale row so a future dms_subscribe recreates it.
      try {
        await db.query("SELECT public.dms_sub_delete($1)", [row.subscription_id]);
        dropped++;
      } catch (e) {
        context.log.warn("dms_renew_subscriptions: dms_sub_delete (stale) failed for", row.subscription_id, e);
      }
    } else {
      failed++;
      context.log.warn("dms_renew_subscriptions: Graph PATCH failed", r.statusCode, "for", row.subscription_id);
    }
  }

  context.log(`dms_renew_subscriptions: examined ${rows.length}, renewed ${renewed}, dropped ${dropped}, failed ${failed}.`);
};
