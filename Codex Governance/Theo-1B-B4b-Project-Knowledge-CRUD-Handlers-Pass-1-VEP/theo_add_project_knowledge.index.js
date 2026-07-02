const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const TITLE_MAX_LEN = 200;
const CONTENT_MAX_LEN = 10000;

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
  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (title === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'title' is required and must be a non-empty string.", 400));
  }
  if (title.length > TITLE_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'title' must be at most ${TITLE_MAX_LEN} characters.`, 400));
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (content === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'content' is required and must be a non-empty string.", 400));
  }
  if (content.length > CONTENT_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'content' must be at most ${CONTENT_MAX_LEN} characters.`, 400));
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

    // FK ownership (the connection role bypasses RLS, so FK existence does NOT prove ownership):
    // the referenced project MUST belong to the caller, else 404 (no leakage).
    const owned = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
      [projectId, oid]
    );
    if (owned.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // created_by = the signed-in OID (explicit ownership; the connection role bypasses RLS).
    // source_type is fixed to 'text' (inline content); file-backed knowledge is a later microstep.
    const inserted = await client.query(
      `
      INSERT INTO public.theo_project_knowledge
        (created_by, project_id, title, source_type, content)
      VALUES ($1, $2, $3, 'text', $4)
      RETURNING
        id, project_id, title, source_type, content, created_at
      `,
      [oid, projectId, title, content]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({ knowledge: inserted.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_add_project_knowledge failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to add knowledge to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // FK violation: project_id absent or not owned.
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    }
    // CHECK violation (title non-blank or source_type), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Knowledge item violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
