const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const KIND_MAX_LEN = 64;
const CONTENT_MAX_LEN = 4000;

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

  // ---- Validate inputs before any SQL (deterministic 400s) ----
  const scope = typeof body.scope === "string" && body.scope.trim() !== "" ? body.scope.trim() : "user";
  if (scope !== "user" && scope !== "project") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'scope' must be 'user' or 'project'.", 400));
  }

  const projectId =
    body.project_id != null && typeof body.project_id === "string" && body.project_id.trim() !== ""
      ? body.project_id.trim()
      : null;
  if (projectId !== null && !isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id', when supplied, must be a valid UUID.", 400));
  }
  // Invariant (mirrors the DB CHECK): project scope iff project_id present.
  if ((scope === "project") !== (projectId !== null)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required when scope='project' and must be omitted otherwise.", 400));
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (content === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'content' is required and must be a non-empty string.", 400));
  }
  if (content.length > CONTENT_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'content' must be at most ${CONTENT_MAX_LEN} characters.`, 400));
  }

  let kind = "fact";
  if (body.kind != null) {
    if (typeof body.kind !== "string" || body.kind.trim() === "") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'kind', when supplied, must be a non-empty string.", 400));
    }
    kind = body.kind.trim().slice(0, KIND_MAX_LEN);
  }

  const sourceConversationId =
    body.source_conversation_id != null && typeof body.source_conversation_id === "string" && body.source_conversation_id.trim() !== ""
      ? body.source_conversation_id.trim()
      : null;
  if (sourceConversationId !== null && !isUuid(sourceConversationId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'source_conversation_id', when supplied, must be a valid UUID.", 400));
  }

  let salience = 0;
  if (body.salience != null) {
    if (!Number.isInteger(body.salience)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'salience', when supplied, must be an integer.", 400));
    }
    salience = body.salience;
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

    // created_by = the signed-in OID (explicit ownership; the connection role bypasses RLS).
    const inserted = await client.query(
      `
      INSERT INTO public.theo_user_memory
        (created_by, scope, project_id, kind, content, source_conversation_id, salience)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id, scope, project_id, kind, content, source_conversation_id, salience, created_at, updated_at
      `,
      [oid, scope, projectId, kind, content, sourceConversationId, salience]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({ memory: inserted.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_create_user_memory failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create memory.", 403));
    }
    // FK violation: project_id / source_conversation_id not owned or absent.
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Referenced project or conversation not found.", 404));
    }
    // CHECK violation (scope/project invariant or non-empty content), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Memory item violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
