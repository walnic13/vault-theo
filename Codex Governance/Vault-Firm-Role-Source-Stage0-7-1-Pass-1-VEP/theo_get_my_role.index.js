const https = require("https");

// theo_get_my_role (Vault memory architecture Stage-0 §7.1 — firm-role source). Read-only. Resolves the
// CALLER's firm role from their Entra/Graph `jobTitle` via a delegated Microsoft Graph ON-BEHALF-OF (OBO)
// fetch — the same technique + env (AAD_TENANT_ID / AAD_CLIENT_ID / AAD_CLIENT_SECRET, the "Vault GPT API"
// app with admin-consented User.Read.All) as the deployed theo_list_people roster handler. No DB, no Blob.
// Firm role gates access in the memory model (VAULT_MEMORY_ARCHITECTURE.md §3/§4); mapping is fail-closed
// (unmapped / non-fee-earner jobTitle → null → least-privileged). Rank hierarchy (Amendment 7):
// partner > director > senior_manager > manager > associate > preparer > (null).

const GRAPH = "https://graph.microsoft.com/v1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}

function nowIso() { return new Date().toISOString(); }

function errorBody(code, message, status) {
  return { error: { code, message, status, timestamp: nowIso() } };
}

function successBody(data) {
  return { data, meta: { timestamp: nowIso(), version: "1.0" } };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim() !== "") return match.val.trim();
  }
  return null;
}

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code; err.status = status; err.isKnown = true;
  return err;
}

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// ── HTTP + OBO→Graph (verbatim technique from the deployed theo_list_people) ──────────────
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = https.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : 443,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }); });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function getBearerTokenFromAuthorization(req) {
  const raw = req.headers["authorization"];
  if (!raw || typeof raw !== "string") return null;
  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match && match[1] ? match[1].trim() : null;
}

function getOboInputToken(req) {
  const bearer = getBearerTokenFromAuthorization(req);
  if (bearer) {
    return { token: bearer, source: "authorization_bearer" };
  }
  const tokenStore = req.headers["x-ms-token-aad-access-token"];
  if (typeof tokenStore === "string" && tokenStore.trim() !== "") {
    return { token: tokenStore.trim(), source: "x-ms-token-aad-access-token" };
  }
  return null;
}

async function exchangeGraphToken(oboInputToken) {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw buildKnownError("INTERNAL_SERVER_ERROR", "Missing required OBO configuration.", 500);
  }
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    requested_token_use: "on_behalf_of",
    assertion: oboInputToken,
    scope: "https://graph.microsoft.com/.default",
  }).toString();
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(
    tokenUrl,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } },
    form
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    const description = payload && (payload.error_description || payload.error || (payload.error_codes && payload.error_codes.join(", ")));
    const message = description ? `Delegated Graph token exchange failed: ${description}` : "Delegated Graph token exchange failed.";
    if (r.statusCode === 400 || r.statusCode === 401 || r.statusCode === 403) throw buildKnownError("FORBIDDEN", message, 403);
    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }
  return payload.access_token;
}

async function graphGetJson(url, accessToken) {
  const r = await requestUrl(url, { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } });
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300) {
    const message = (payload && payload.error && payload.error.message) || `Graph request failed (HTTP ${r.statusCode}).`;
    if (r.statusCode === 401 || r.statusCode === 403) throw buildKnownError("FORBIDDEN", message, 403);
    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }
  return payload || {};
}

// ── Firm-role mapping (VAULT_MEMORY_ARCHITECTURE.md §1/§3, Amendment 7; grounded on the deployed Vault
// Staff titles: Partner / Co-Founder and Partner, Director, Senior Manager, Manager, Administrative
// Assistant). Case-insensitive substring match, MOST-SENIOR-FIRST so "Senior Manager" resolves before
// "Manager" and "Co-Founder and Partner" resolves to partner. Fail-closed: any unmapped / non-fee-earner
// title → null → least-privileged. CANONICAL: the engine's read-handlers reuse this exact mapping in-process.
function resolveFirmRole(jobTitle) {
  if (typeof jobTitle !== "string") return null;
  const t = jobTitle.trim().toLowerCase();
  if (!t) return null;
  if (t.includes("partner")) return "partner";
  if (t.includes("director")) return "director";
  if (t.includes("senior manager")) return "senior_manager";
  if (t.includes("manager")) return "manager";
  if (t.includes("associate")) return "associate";
  if (t.includes("preparer")) return "preparer";
  return null;
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") return send(context, 204, "");

  const principal = getPrincipal(req);
  const callerOid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!callerOid) return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));

  const oboInput = getOboInputToken(req);
  if (!oboInput) return send(context, 401, errorBody("UNAUTHORIZED", "Missing bearer token for delegated Graph access.", 401));

  try {
    const graphToken = await exchangeGraphToken(oboInput.token);
    // The CALLER's own profile — jobTitle is the firm-role signal (department is null across Vault Staff).
    const me = await graphGetJson(`${GRAPH}/users/${encodeURIComponent(callerOid)}?$select=id,jobTitle`, graphToken);
    const jobTitle = me && typeof me.jobTitle === "string" ? me.jobTitle : null;
    const firmRole = resolveFirmRole(jobTitle);
    return send(context, 200, successBody({ oid: callerOid, job_title: jobTitle, firm_role: firmRole }));
  } catch (err) {
    context.log.error("theo_get_my_role failed", err);
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  }
};
