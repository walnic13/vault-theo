const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const NAME_MAX_LEN = 200;
const DESCRIPTION_MAX_LEN = 500;
const INSTRUCTIONS_MAX_LEN = 8000;
const APP_KEY_MAX_LEN = 200;

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
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'name' is required and must be a non-empty string.", 400));
  }
  if (name.length > NAME_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'name' must be at most ${NAME_MAX_LEN} characters.`, 400));
  }

  // description / instructions are optional; they default to "" (both columns are
  // NOT NULL DEFAULT '' — instructions from B2, description from the B4a migration), so an
  // omitted value must insert "" not NULL. app_key is nullable, so it stays null when omitted.
  let description = "";
  if (body.description != null) {
    if (typeof body.description !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'description', when supplied, must be a string.", 400));
    }
    if (body.description.length > DESCRIPTION_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'description' must be at most ${DESCRIPTION_MAX_LEN} characters.`, 400));
    }
    description = body.description;
  }

  let instructions = "";
  if (body.instructions != null) {
    if (typeof body.instructions !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'instructions', when supplied, must be a string.", 400));
    }
    if (body.instructions.length > INSTRUCTIONS_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'instructions' must be at most ${INSTRUCTIONS_MAX_LEN} characters.`, 400));
    }
    instructions = body.instructions;
  }

  let appKey = null;
  if (body.app_key != null) {
    if (typeof body.app_key !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'app_key', when supplied, must be a string.", 400));
    }
    if (body.app_key.length > APP_KEY_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'app_key' must be at most ${APP_KEY_MAX_LEN} characters.`, 400));
    }
    appKey = body.app_key;
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
      INSERT INTO public.theo_projects
        (created_by, name, description, instructions, app_key)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id, name, description, instructions, app_key, created_at, updated_at
      `,
      [oid, name, description, instructions, appKey]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({ project: inserted.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_create_project failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create a project.", 403));
    }
    // CHECK violation (name not-blank), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Project violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
