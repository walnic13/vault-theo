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

  // Optional filters. scope, when supplied, must be 'user' or 'project'; projectId must be a UUID.
  let scope = null;
  if (req.query && typeof req.query.scope === "string" && req.query.scope.trim() !== "") {
    scope = req.query.scope.trim();
    if (scope !== "user" && scope !== "project") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'scope', when supplied, must be 'user' or 'project'.", 400));
    }
  }
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

    // Explicit ownership scope: the shared connection role bypasses RLS, so isolation is enforced
    // by the created_by predicate (never RLS alone). Optional scope/project filters appended.
    const conditions = ["created_by = $1"];
    const params = [oid];
    if (scope !== null) {
      params.push(scope);
      conditions.push(`scope = $${params.length}`);
    }
    if (projectId !== null) {
      params.push(projectId);
      conditions.push(`project_id = $${params.length}`);
    }

    const result = await client.query(
      `
      SELECT
        id,
        scope,
        project_id,
        kind,
        content,
        source_conversation_id,
        salience,
        created_at,
        updated_at
      FROM public.theo_user_memory
      WHERE ${conditions.join(" AND ")}
      ORDER BY salience DESC, updated_at DESC, id DESC
      LIMIT 500
      `,
      params
    );

    return send(context, 200, successBody({ memory: result.rows }));
  } catch (err) {
    context.log.error("theo_list_user_memory failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list memory.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
