const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const NAME_MAX_LEN = 200;
const DESCRIPTION_MAX_LEN = 500;
const INSTRUCTIONS_MAX_LEN = 8000;
const APP_KEY_MAX_LEN = 200;
const SOURCE_REF_MAX_LEN = 200;

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

// Get-or-create a project keyed to an external reference (owner + app_key + source_ref) — idempotent
// and race-safe via the partial unique index theo_projects_owner_app_ref_uk. Used so a host app (Sigma's
// review dock) maps a durable external entity (a K-1 review, source_ref = sigma_review_id) to exactly one
// Theo project: the first call creates it; every later call returns the SAME project (ON CONFLICT DO
// UPDATE touches updated_at only, so a user-renamed project keeps its name). Owner-scoped; mirrors
// theo_create_project's boundary/validation idiom. Generic — not Sigma-specific.
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
  const appKey = typeof body.app_key === "string" ? body.app_key.trim() : "";
  if (appKey === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'app_key' is required and must be a non-empty string.", 400));
  }
  if (appKey.length > APP_KEY_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'app_key' must be at most ${APP_KEY_MAX_LEN} characters.`, 400));
  }

  const sourceRef = typeof body.source_ref === "string" ? body.source_ref.trim() : "";
  if (sourceRef === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'source_ref' is required and must be a non-empty string.", 400));
  }
  if (sourceRef.length > SOURCE_REF_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'source_ref' must be at most ${SOURCE_REF_MAX_LEN} characters.`, 400));
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'name' is required and must be a non-empty string.", 400));
  }
  if (name.length > NAME_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'name' must be at most ${NAME_MAX_LEN} characters.`, 400));
  }

  // description / instructions optional (both NOT NULL DEFAULT ''); only used when this call CREATES the
  // project — on an existing project ON CONFLICT DO UPDATE touches only updated_at, so they are ignored.
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

    // Idempotent get-or-create keyed on (created_by, app_key, source_ref) — the partial unique index
    // theo_projects_owner_app_ref_uk makes concurrent first-calls race-safe. On an existing project the
    // DO UPDATE touches only updated_at, so the returned row keeps its (possibly user-renamed) name.
    const upserted = await client.query(
      `
      INSERT INTO public.theo_projects
        (created_by, name, description, instructions, app_key, source_ref)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (created_by, app_key, source_ref) WHERE source_ref IS NOT NULL
      DO UPDATE SET updated_at = now()
      RETURNING
        id, name, description, instructions, app_key, source_ref, created_at, updated_at,
        (xmax = 0) AS created
      `,
      [oid, name, description, instructions, appKey, sourceRef]
    );

    await client.query("COMMIT");

    const row = upserted.rows[0];
    const created = row.created === true;
    delete row.created;
    return send(context, created ? 201 : 200, successBody({ project: row }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_get_or_create_review_project failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create a project.", 403));
    }
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
