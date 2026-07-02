const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

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

  const conversationId = typeof body.conversation_id === "string" ? body.conversation_id.trim() : "";
  if (!isUuid(conversationId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'conversation_id' is required and must be a valid UUID.", 400));
  }
  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
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

    // B5c: the referenced project must be ACCESSIBLE to the caller — owned OR group-visible (B5a)
    // OR shared-with-me (a theo_project_members row). The connection role's RLS is defense, so FK
    // existence does NOT prove access. A member may link their OWN conversation to a shared project
    // (config-only sharing: their chat, the shared project). Not accessible → 404 (no leakage).
    const accessibleProject = await client.query(
      `
      SELECT 1 FROM public.theo_projects
      WHERE id = $1
        AND (
          created_by = $2
          OR visibility = 'group'
          OR id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = $2)
        )
      `,
      [projectId, oid]
    );
    if (accessibleProject.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // Fetch the conversation owner-scoped; 0 rows → 403 (existing-foreign) / 404 (absent) via helper.
    const conv = await client.query(
      `SELECT id, project_id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
      [conversationId, oid]
    );
    if (conv.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [conversationId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this conversation.", 403)
        : buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Set the project link only when currently unset (a conversation belongs to one project, set
    // once). Idempotent: an already-linked conversation returns its current project_id unchanged.
    let resultProjectId = conv.rows[0].project_id;
    if (resultProjectId == null) {
      const updated = await client.query(
        `
        UPDATE public.theo_conversations
        SET project_id = $1, updated_at = now()
        WHERE id = $2 AND created_by = $3 AND project_id IS NULL
        RETURNING project_id
        `,
        [projectId, conversationId, oid]
      );
      resultProjectId = updated.rowCount > 0 ? updated.rows[0].project_id : projectId;
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ conversation_id: conversationId, project_id: resultProjectId }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_set_conversation_project failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // FK violation: project_id not owned or absent (defensive; validated above).
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
