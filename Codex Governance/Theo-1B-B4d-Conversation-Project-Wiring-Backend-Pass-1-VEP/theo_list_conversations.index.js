const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

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

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
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

  let limit = DEFAULT_LIMIT;
  if (req.query && typeof req.query.limit === "string" && req.query.limit.trim() !== "") {
    const raw = req.query.limit.trim();
    const n = /^[0-9]+$/.test(raw) ? parseInt(raw, 10) : NaN;
    if (!Number.isInteger(n) || n < 1 || n > MAX_LIMIT) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'limit', when supplied, must be an integer 1..200.", 400));
    }
    limit = n;
  }

  // B4d: optional per-project filter. When supplied, must be a valid UUID; scopes the list to the
  // signed-in user's conversations linked to that project (theo_conversations.project_id).
  let projectId = null;
  if (req.query && typeof req.query.projectId === "string" && req.query.projectId.trim() !== "") {
    projectId = req.query.projectId.trim();
    if (!isUuid(projectId)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'projectId', when supplied, must be a valid UUID.", 400));
    }
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

    // Explicit ownership scope: the shared Functions connection role bypasses RLS, so per-user
    // isolation MUST be enforced in the query itself (created_by = the signed-in OID), not by RLS.
    // Optional project filter appended; LIMIT is always the last positional parameter.
    const conditions = ["created_by = $1"];
    const params = [oid];
    if (projectId !== null) {
      params.push(projectId);
      conditions.push(`project_id = $${params.length}`);
    }
    params.push(limit);
    const limitParam = params.length;

    const result = await client.query(
      `
      SELECT
        id,
        title,
        model,
        project_id,
        app_key,
        created_at,
        updated_at
      FROM public.theo_conversations
      WHERE ${conditions.join(" AND ")}
      ORDER BY updated_at DESC, id DESC
      LIMIT $${limitParam}
      `,
      params
    );

    return send(context, 200, successBody({ conversations: result.rows }));
  } catch (err) {
    context.log.error("theo_list_conversations failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list conversations.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
