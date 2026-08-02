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

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

// Map a SECURITY DEFINER gate-function SQLSTATE (SPW Phase 2b-1) to an HTTP error, or null if not a
// recognised gate error. 28000 → 401, 42501 → 403, 22023 → 400, P0002 → 404.
function mapGateError(err) {
  if (!err || typeof err.code !== "string") return null;
  switch (err.code) {
    case "28000": return { status: 401, code: "UNAUTHORIZED", message: "Missing or invalid identity." };
    case "42501": return { status: 403, code: "FORBIDDEN", message: "Only the conversation owner may publish it." };
    case "22023": return { status: 400, code: "INVALID_REQUEST", message: err.message || "Conversation is not linked to a project." };
    case "P0002": return { status: 404, code: "NOT_FOUND", message: "Conversation not found." };
    default: return null;
  }
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

    // SPW Phase 2b-1: publish the conversation into its linked project, via the deployed SECURITY
    // DEFINER theo_publish_conversation. CONVERSATION-owner-only (non-owner → 42501); conversation
    // must be linked to a project (project_id NULL → 22023); absent → P0002. Idempotent — re-publish
    // preserves the original publish metadata (gate returns false). The conversation is published
    // regardless of the newly-published boolean, so the response reports published:true.
    await client.query(
      `SELECT public.theo_publish_conversation($1::uuid)`,
      [conversationId]
    );

    return send(context, 200, successBody({ conversation_id: conversationId, published: true }));
  } catch (err) {
    context.log.error("theo_publish_conversation failed", err);
    const mapped = mapGateError(err);
    if (mapped) {
      return send(context, mapped.status, errorBody(mapped.code, mapped.message, mapped.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
