const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

// Phase D / D2b - de-index on removal (Azure AI Search project-knowledge index). SEARCH_* config +
// getAadToken/requestUrl/parseJsonSafe reused byte-identically from the deployed
// theo_add_project_knowledge_file (D1) per the Walter-directed D2 scope + DR-T14. De-index is NON-FATAL.
const SEARCH_ENDPOINT = (process.env.THEO_SEARCH_ENDPOINT || "").replace(/\/+$/, "");
const PK_SEARCH_INDEX = process.env.THEO_PK_SEARCH_INDEX || "theo-project-knowledge";
const SEARCH_API_VERSION = process.env.THEO_SEARCH_API_VERSION || "2023-11-01";
const SEARCH_SCOPE = "https://search.azure.com/.default";

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

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  err.isKnown = true;
  return err;
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

// ---- HTTPS helper + AAD token: byte-identical from the deployed theo_add_project_knowledge_file (D1) ----
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

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function getAadToken(scope) {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing required AAD client-credentials configuration.");
  }
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope,
  }).toString();
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(
    tokenUrl,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } },
    form
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    throw new Error(`Token request failed for scope ${scope} (HTTP ${r.statusCode}).`);
  }
  return payload.access_token;
}

// ---- Phase D / D2b de-index helper. Query shape mirrors the deployed searchProjectKnowledge (D3);
// the docs/index delete mirrors the deployed upsertDocs (D1) with @search.action "delete". Same
// vaultgpt-search service (no new external system). ----
async function deindexKnowledge(searchToken, knowledgeId) {
  const qBody = JSON.stringify({ filter: `knowledge_id eq '${knowledgeId.replace(/'/g, "''")}'`, select: "id", top: 1000 });
  const q = await requestUrl(
    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(PK_SEARCH_INDEX)}/docs/search?api-version=${SEARCH_API_VERSION}`,
    { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${searchToken}`, "Content-Length": Buffer.byteLength(qBody) } },
    qBody
  );
  const payload = parseJsonSafe(q.body);
  if (q.statusCode < 200 || q.statusCode >= 300 || !payload || !Array.isArray(payload.value)) {
    throw new Error(`deindexKnowledge search failed (HTTP ${q.statusCode}).`);
  }
  const ids = payload.value.map((d) => d && d.id).filter((id) => typeof id === "string");
  if (ids.length === 0) return 0;
  const delBody = JSON.stringify({ value: ids.map((id) => ({ "@search.action": "delete", id })) });
  const d = await requestUrl(
    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(PK_SEARCH_INDEX)}/docs/index?api-version=${SEARCH_API_VERSION}`,
    { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${searchToken}`, "Content-Length": Buffer.byteLength(delBody) } },
    delBody
  );
  if (d.statusCode < 200 || d.statusCode >= 300) {
    throw new Error(`deindexKnowledge delete failed (HTTP ${d.statusCode}).`);
  }
  return ids.length;
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

  const knowledgeId = typeof body.knowledge_id === "string" ? body.knowledge_id.trim() : "";
  if (!isUuid(knowledgeId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'knowledge_id' is required and must be a valid UUID.", 400));
  }
  // project_id is optional context; when supplied it must be a valid UUID (ownership is enforced by
  // the created_by predicate on the knowledge row itself, so project_id is not required for security).
  if (body.project_id != null) {
    const pid = typeof body.project_id === "string" ? body.project_id.trim() : "";
    if (!isUuid(pid)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id', when supplied, must be a valid UUID.", 400));
    }
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Explicit ownership scope (connection role bypasses RLS): permanent delete of a knowledge row
    // the caller owns. theo_project_knowledge is immutable, so removal is a hard delete.
    const deleted = await client.query(
      `DELETE FROM public.theo_project_knowledge WHERE id = $1 AND created_by = $2 RETURNING id`,
      [knowledgeId, oid]
    );

    if (deleted.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_knowledge_exists_unscoped($1::uuid) AS e`,
        [knowledgeId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this knowledge item.", 403)
        : buildKnownError("NOT_FOUND", "Knowledge item not found.", 404);
    }

    await client.query("COMMIT");

    const removedId = deleted.rows[0].id;

    // Phase D / D2b - best-effort de-index (NON-FATAL: a de-index failure NEVER fails the removal; the row
    // is already deleted). Delete the removed item's Search docs so it is no longer retrievable. Complements
    // D3's live-DB intersect (defence-in-depth).
    try {
      if (SEARCH_ENDPOINT) {
        const searchToken = await getAadToken(SEARCH_SCOPE);
        await deindexKnowledge(searchToken, removedId);
      }
    } catch (deindexErr) {
      context.log.error("theo_remove_project_knowledge: de-index failed (non-fatal)", deindexErr);
    }

    return send(context, 200, successBody({ deleted: true, id: removedId }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_remove_project_knowledge failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this knowledge item.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
