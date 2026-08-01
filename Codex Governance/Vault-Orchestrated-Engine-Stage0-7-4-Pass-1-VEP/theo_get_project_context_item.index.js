const { Pool } = require("pg");
const https = require("https");

// theo_get_project_context_item (Vault Memory Architecture Stage-0 §7.4 — the ORCHESTRATED access-policy engine).
// The single composed read decision (design §3.2 / Amendment 1 — "no read path implements its own access logic"):
//   1. resolve the CALLER's firm role via delegated Graph OBO (§7.1 idiom),
//   2. call the Postgres classifier public.theo_can_read (§7.3 — DB dimensions: L1.5 membership × info-type
//      firm-role floor × Rule-3 MEMBERSHIP lowest-participant),
//   3. Rule 5 (app layer): if the item carries a sharepoint_ref, a bounded OBO Graph reachability probe — 2xx
//      allows, any 401/403/404/timeout/error DENIES (fail-closed),
//   4. Rule-3 firm-role dimension (app layer): the LEAST-privileged OTHER room participant must also clear the
//      item's info-type floor (else the item is not surfaced to this mixed room).
// Strict AND across all four; the item is returned only if EVERY gate allows. This is the reference composition
// future read handlers adopt (removing the inline created_by scattering — design §3.3). Runs on func-projects.
// Structure mirrors the deployed theo_list_project_knowledge (pg + set_config + _exists_unscoped 403/404 +
// {data,meta}); the OBO block mirrors the deployed theo_get_my_role; graphReachable mirrors dms_resolve_item.

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const GRAPH = "https://graph.microsoft.com/v1.0";
const GRAPH_PROBE_TIMEOUT_MS = 5000; // Rule-5 probe: a slow/hung Graph call => deny (fail-closed)
const MAX_ROOM_OIDS = 50;            // bound the firm-role lowest-participant Graph fan-out
// Firm-role rank (Amendment 7): partner > director > senior_manager > manager > associate > preparer > (null=0).
const FIRM_RANK = { partner: 6, director: 5, senior_manager: 4, manager: 3, associate: 2, preparer: 1 };
// info-type read floor as a MIN firm rank — ONE POLICY with the §7.2 Tag Guard + §7.3 theo_can_read floors:
//   commercial => senior_manager (4); governance => manager (3); personnel => director (5).
//   factual/technical/deliberative have no firm floor (membership suffices).
const TYPE_MIN_RANK = { commercial: 4, governance: 3, personnel: 5 };

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

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// ── HTTP + OBO→Graph (byte-faithful from the deployed theo_get_my_role, §7.1; requestUrl adds a bounded
// timeout — an ALLOWED DELTA required by design §3.2 "timeout => deny") ──────────────────────────────────────
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = https.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : 443,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }); });
      }
    );
    req.on("error", reject);
    if (options.timeoutMs) {
      req.setTimeout(options.timeoutMs, () => { req.destroy(new Error("graph_probe_timeout")); });
    }
    if (body) req.write(body);
    req.end();
  });
}

function getBearerTokenFromAuthorization(req) {
  const raw = req.headers["authorization"];
  if (!raw || typeof raw !== "string") return null;
  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match && match[1] ? match[1].trim() : null;
}

function getOboInputToken(req) {
  const bearer = getBearerTokenFromAuthorization(req);
  if (bearer) {
    return { token: bearer, source: "authorization_bearer" };
  }
  const tokenStore = req.headers["x-ms-token-aad-access-token"];
  if (typeof tokenStore === "string" && tokenStore.trim() !== "") {
    return { token: tokenStore.trim(), source: "x-ms-token-aad-access-token" };
  }
  return null;
}

async function exchangeGraphToken(oboInputToken) {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw buildKnownError("INTERNAL_SERVER_ERROR", "Missing required OBO configuration.", 500);
  }
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    requested_token_use: "on_behalf_of",
    assertion: oboInputToken,
    scope: "https://graph.microsoft.com/.default",
  }).toString();
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(
    tokenUrl,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } },
    form
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    const description = payload && (payload.error_description || payload.error || (payload.error_codes && payload.error_codes.join(", ")));
    const message = description ? `Delegated Graph token exchange failed: ${description}` : "Delegated Graph token exchange failed.";
    if (r.statusCode === 400 || r.statusCode === 401 || r.statusCode === 403) throw buildKnownError("FORBIDDEN", message, 403);
    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }
  return payload.access_token;
}

async function graphGetJson(url, accessToken) {
  const r = await requestUrl(url, { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }, timeoutMs: GRAPH_PROBE_TIMEOUT_MS });
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300) {
    const message = (payload && payload.error && payload.error.message) || `Graph request failed (HTTP ${r.statusCode}).`;
    if (r.statusCode === 401 || r.statusCode === 403) throw buildKnownError("FORBIDDEN", message, 403);
    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }
  return payload || {};
}

// Firm-role mapping — BYTE-IDENTICAL to the deployed theo_get_my_role.resolveFirmRole (§7.1).
function resolveFirmRole(jobTitle) {
  if (typeof jobTitle !== "string") return null;
  const t = jobTitle.trim().toLowerCase();
  if (!t) return null;
  if (t.includes("partner")) return "partner";
  if (t.includes("director")) return "director";
  if (t.includes("senior manager")) return "senior_manager";
  if (t.includes("manager")) return "manager";
  if (t.includes("associate")) return "associate";
  if (t.includes("preparer")) return "preparer";
  return null;
}

function firmRank(role) {
  return FIRM_RANK[role] || 0;
}

// Resolve ONE user's firm role (per-participant; the theo_get_my_role /users/{oid}?$select=jobTitle idiom).
// Any failure (Graph 403/404/timeout/error) => null => least-privileged (fail-closed).
async function resolveUserFirmRole(oid, accessToken) {
  try {
    const u = await graphGetJson(`${GRAPH}/users/${encodeURIComponent(oid)}?$select=id,jobTitle`, accessToken);
    return resolveFirmRole(u && typeof u.jobTitle === "string" ? u.jobTitle : null);
  } catch {
    return null;
  }
}

// Rule-5 reachability probe (mirrors dms_resolve_item's metadata GET of /drives/{driveId}/items/{itemId}).
// sharepoint_ref format = "drives/{driveId}/items/{itemId}". 2xx => reachable; malformed / non-2xx / timeout /
// error => NOT reachable (fail-closed).
async function graphReachable(sharepointRef, accessToken) {
  if (typeof sharepointRef !== "string") return false;
  const m = sharepointRef.match(/^drives\/([A-Za-z0-9!,._-]{10,300})\/items\/([A-Za-z0-9!,._-]{5,200})$/);
  if (!m) return false; // malformed ref cannot be verified => deny
  const url = `${GRAPH}/drives/${encodeURIComponent(m[1])}/items/${encodeURIComponent(m[2])}`;
  try {
    const r = await requestUrl(url, { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }, timeoutMs: GRAPH_PROBE_TIMEOUT_MS });
    return r.statusCode >= 200 && r.statusCode < 300;
  } catch {
    return false; // timeout / network error => deny
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

  const itemId = typeof body.item_id === "string" ? body.item_id.trim() : "";
  if (!isUuid(itemId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'item_id' is required and must be a valid UUID.", 400));
  }

  // optional collective-chat room participants (the Rule-3 lowest-participant context)
  let roomOids = null;
  if (body.room_oids != null) {
    if (!Array.isArray(body.room_oids)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'room_oids' must be an array of participant OIDs.", 400));
    }
    if (body.room_oids.length > MAX_ROOM_OIDS) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'room_oids' exceeds the maximum of ${MAX_ROOM_OIDS} participants.`, 400));
    }
    const cleaned = body.room_oids.map((o) => (o == null ? "" : String(o).trim())).filter(Boolean);
    for (const o of cleaned) {
      if (!isUuid(o)) {
        return send(context, 400, errorBody("INVALID_REQUEST", "Field 'room_oids' must contain only valid UUIDs.", 400));
      }
    }
    roomOids = cleaned.length > 0 ? cleaned : null;
  }

  // OBO: exchange one delegated Graph token for the caller (used for the caller's firm role, the Rule-5 probe,
  // and each room participant's firm role). No bearer => cannot resolve firm role for the restricted-tag gates.
  const oboInput = getOboInputToken(req);
  if (!oboInput) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing bearer token for delegated Graph access.", 401));
  }
  let graphToken;
  try {
    graphToken = await exchangeGraphToken(oboInput.token);
  } catch (err) {
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  }
  const callerFirmRole = await resolveUserFirmRole(oid, graphToken);

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

    // (1) DB decision — theo_can_read (§7.3): L1.5 membership × info-type floor × MEMBERSHIP lowest-participant.
    const decision = await client.query(
      `SELECT public.theo_can_read('L1.5', NULL, $1::uuid, NULL, $2::text, $3::text[]) AS ok`,
      [itemId, callerFirmRole, roomOids]
    );
    const dbAllow = decision.rows[0] && decision.rows[0].ok === true;
    if (!dbAllow) {
      const existsResult = await client.query(
        `SELECT public.theo_project_context_item_exists_unscoped($1::uuid) AS e`,
        [itemId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this item.", 403)
        : buildKnownError("NOT_FOUND", "Item not found.", 404);
    }

    // theo_can_read allowed => read the row (the Functions connection role bypasses RLS) for the app-layer gates
    // + the response payload.
    const rowResult = await client.query(
      `
      SELECT id, project_id, info_type, content, sharepoint_ref, source_conversation_id, created_by, created_at, updated_at
      FROM public.theo_project_context_items
      WHERE id = $1
      `,
      [itemId]
    );
    const item = rowResult.rows[0];
    if (!item) {
      // raced with a delete between the classifier call and the read
      throw buildKnownError("NOT_FOUND", "Item not found.", 404);
    }

    // (2) Rule 5 (app layer) — a SharePoint-linked item must ALSO be reachable by the caller in SharePoint via
    // OBO Graph. NULL ref skips the probe (pure-DB item).
    if (item.sharepoint_ref) {
      const reachable = await graphReachable(item.sharepoint_ref, graphToken);
      if (!reachable) {
        throw buildKnownError("FORBIDDEN", "You do not have access to the linked SharePoint item.", 403);
      }
    }

    // (3) Rule-3 firm-role dimension (app layer) — theo_can_read already applied the MEMBERSHIP lowest-participant
    // filter; here the LEAST-privileged OTHER room participant must also clear the item's info-type floor, or the
    // item is not surfaced to this mixed room. Per-participant firm role via Graph (fail => least-privileged).
    const need = TYPE_MIN_RANK[item.info_type];
    if (roomOids && need) {
      for (const participant of roomOids) {
        if (participant === oid) continue; // the caller already cleared the floor via theo_can_read
        const participantRole = await resolveUserFirmRole(participant, graphToken);
        if (firmRank(participantRole) < need) {
          throw buildKnownError("FORBIDDEN", "This item cannot be surfaced to the current room (a participant lacks sufficient access).", 403);
        }
      }
    }

    // All gates allowed.
    return send(context, 200, successBody({ item }));
  } catch (err) {
    context.log.error("theo_get_project_context_item failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this item.", 403));
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
