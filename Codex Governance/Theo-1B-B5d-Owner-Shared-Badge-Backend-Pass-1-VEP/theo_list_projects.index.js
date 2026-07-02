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

    // B5c: return the caller's OWN projects, any GROUP-VISIBLE project (B5a), plus any project SHARED
    // WITH the caller via a theo_project_members row (per-member invite). Explicit predicate (the
    // shared connection role's RLS is the defense layer). `is_owner` (B5a) badges shared-by-others;
    // `shared_with_me` distinguishes an explicit invite from a group-visible project so the FE can
    // badge them differently. Newest-updated first (backs the Projects list).
    const result = await client.query(
      `
      SELECT
        id,
        name,
        description,
        instructions,
        app_key,
        visibility,
        (created_by = $1) AS is_owner,
        EXISTS (
          SELECT 1 FROM public.theo_project_members m
          WHERE m.project_id = theo_projects.id AND m.member_oid = $1
        ) AS shared_with_me,
        -- B5d: owner-only invitee count so the grid can badge an OWNER's private project as "Shared"
        -- once it has member invites (visibility='group' already badges team-wide). Gated to the
        -- caller's OWN rows (CASE created_by = $1) so a non-owner never learns another project's
        -- co-member count; non-owners get 0 and rely on shared_with_me for their badge.
        (CASE WHEN created_by = $1
              THEN (SELECT count(*)::int FROM public.theo_project_members m2 WHERE m2.project_id = theo_projects.id)
              ELSE 0 END) AS member_count,
        created_at,
        updated_at
      FROM public.theo_projects
      WHERE created_by = $1
        OR visibility = 'group'
        OR id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = $1)
      ORDER BY updated_at DESC, id DESC
      LIMIT 500
      `,
      [oid]
    );

    return send(context, 200, successBody({ projects: result.rows }));
  } catch (err) {
    context.log.error("theo_list_projects failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list projects.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
