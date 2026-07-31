const { Pool } = require("pg");
const https = require("https");

// theo_create_project_context_item (Vault Memory Architecture Stage-0 §7.2 — L1.5 Project Context write).
// Creates a tagged L1.5 item through the Tag Guard write-path: resolves the CALLER's firm role via delegated
// Microsoft Graph OBO (the same technique + env as the deployed theo_get_my_role, §7.1 — AAD_TENANT_ID /
// AAD_CLIENT_ID / AAD_CLIENT_SECRET), then calls the SECURITY DEFINER public.theo_tag_guard_write_context_item,
// which enforces project membership + information-type tag authority (fail-closed) before inserting. Structure
// mirrors the deployed theo_publish_conversation (definer-call write + SQLSTATE map); the OBO block mirrors
// theo_get_my_role. Runs on vaultgpt-func-projects (pg + OBO both already provisioned).

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const GRAPH = "https://graph.microsoft.com/v1.0";
const CONTENT_MAX_LEN = 10000;
const VALID_INFO_TYPES = ["factual", "technical", "deliberative", "governance", "commercial", "personnel"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  if (typeof req.body === "object") {
    return req.body;
  }
  return {};
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

// Map a SECURITY DEFINER gate-function SQLSTATE (Tag Guard) to an HTTP error, or null if not a recognised
// gate error. 28000 -> 401, 42501 -> 403, 22023 -> 400, P0002 -> 404. (Same vocabulary as the SPW gates.)
function mapGateError(err) {
  if (!err || typeof err.code !== "string") return null;
  switch (err.code) {
    case "28000": return { status: 401, code: "UNAUTHORIZED", message: "Missing or invalid identity." };
    case "42501": return { status: 403, code: "FORBIDDEN", message: err.message || "You are not authorised to write this item." };
    case "22023": return { status: 400, code: "INVALID_REQUEST", message: err.message || "Invalid request." };
    case "P0002": return { status: 404, code: "NOT_FOUND", message: "Project not found." };
    default: return null;
  }
}

// ── OBO -> Graph firm-role resolution (byte-faithful mirror of the deployed theo_get_my_role, §7.1) ──────────
function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code; err.status = status; err.isKnown = true;
  return err;
}

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

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

// Firm-role mapping — BYTE-IDENTICAL to the deployed theo_get_my_role.resolveFirmRole (§7.1). Case-insensitive,
// most-senior-first substring match; unmapped / non-fee-earner / absent title => null => least-privileged.
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
  try {
    body = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  // Validate typed inputs BEFORE any SQL (isUuid / enum / length gates first).
  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  }

  const infoType = typeof body.info_type === "string" ? body.info_type.trim().toLowerCase() : "";
  if (!VALID_INFO_TYPES.includes(infoType)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'info_type' is required and must be one of: factual, technical, deliberative, governance, commercial, personnel.", 400));
  }

  const content = typeof body.content === "string" ? body.content : "";
  if (content.trim().length === 0) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'content' is required.", 400));
  }
  if (content.length > CONTENT_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'content' exceeds the maximum length of ${CONTENT_MAX_LEN} characters.`, 400));
  }

  const sharepointRef =
    body.sharepoint_ref == null ? null : (typeof body.sharepoint_ref === "string" && body.sharepoint_ref.trim() ? body.sharepoint_ref.trim() : null);

  let sourceConversationId = null;
  if (body.source_conversation_id != null && body.source_conversation_id !== "") {
    const raw = String(body.source_conversation_id).trim();
    if (!isUuid(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'source_conversation_id' must be a valid UUID when provided.", 400));
    }
    sourceConversationId = raw;
  }

  // Resolve the caller's firm role via delegated Graph OBO (same technique + env as theo_get_my_role, §7.1).
  // Best-effort: on ANY OBO/Graph failure, firmRole stays null => least-privileged (the Tag Guard rejects the
  // restricted tags with 403). Membership-only tags (factual/technical/deliberative) still succeed. This never
  // fails the write by itself.
  let firmRole = null;
  const oboInput = getOboInputToken(req);
  if (oboInput) {
    try {
      const graphToken = await exchangeGraphToken(oboInput.token);
      const me = await graphGetJson(`${GRAPH}/users/${encodeURIComponent(oid)}?$select=id,jobTitle`, graphToken);
      firmRole = resolveFirmRole(me && typeof me.jobTitle === "string" ? me.jobTitle : null);
    } catch (e) {
      context.log.warn("theo_create_project_context_item: firm-role resolution failed; proceeding least-privileged", e && e.message);
    }
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

    // Tag Guard write-path (Stage-0 §7.2): the SECURITY DEFINER function enforces project membership +
    // information-type tag authority (fail-closed) then inserts. p_firm_role is the OBO-resolved role above
    // (NULL => least-privileged). Non-member / unauthorised tag -> 42501; untagged/unknown tag/blank content
    // -> 22023; absent project -> 23503 (FK). Returns the created row.
    const result = await client.query(
      `SELECT * FROM public.theo_tag_guard_write_context_item($1::uuid, $2::text, $3::text, $4::text, $5::text, $6::uuid)`,
      [projectId, infoType, content, firmRole, sharepointRef, sourceConversationId]
    );

    const row = result.rows[0];
    return send(context, 201, successBody({ item: row }));
  } catch (err) {
    context.log.error("theo_create_project_context_item failed", err);
    const mapped = mapGateError(err);
    if (mapped) {
      return send(context, mapped.status, errorBody(mapped.code, mapped.message, mapped.status));
    }
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Item violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
