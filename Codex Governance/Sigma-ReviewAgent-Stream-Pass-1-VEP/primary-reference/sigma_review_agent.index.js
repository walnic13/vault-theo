const https = require("https");
const XLSX = require("xlsx");
const { Pool } = require("pg");

// Deterministic engine + the reusable tool-use loop (deployed alongside the handlers under the app root).
// The engine is compute-only; the loop drives Claude ↔ deterministic tools until Theo stops calling tools.
const { runReviewLoop } = require("../engine/tool-loop");
const T = require("../engine/sheet-tools");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const DMS_API_BASE_URL = process.env.DMS_API_BASE_URL || "https://vaultgpt-func-dms.azurewebsites.net";

// Foundry/Claude gateway (same client-credentials pattern Theo's handlers use; env copied from func-premium).
const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT;
const AAD_TENANT_ID = process.env.AAD_TENANT_ID;
const AAD_CLIENT_ID = process.env.AAD_CLIENT_ID;
const AAD_CLIENT_SECRET = process.env.AAD_CLIENT_SECRET; // resolved from Key Vault reference
const ANTHROPIC_VERSION = "2023-06-01";
const MAX_TOKENS = 4096;

const REQUIRED_ROLES = ["input", "output"];
const OPTIONAL_ROLES = ["tables", "dataconn"];

// The K-1 review-agent ruleset — the SERVER-SIDE, mandatory, non-bypassable leading system block for the
// review agent (Operating Ruleset §1: injected server-side, a client cannot supply or omit it). It is
// self-contained: it carries the anti-fabrication / tool-grounding discipline (never do arithmetic; every
// figure via a deterministic tool; cite the cell) AND the review-specialist behavior. The per-review state
// block follows it. (Layer-1 user memory is injected SERVER-SIDE by the vault-theo delegation in a later
// VEP — it is never accepted from the request body.)
const K1_REVIEW_RULESET = [
  "You are the Vault K-1 review specialist. A deterministic engine has already computed every control for this fund's workbook set; the results are in CURRENT REVIEW STATE below.",
  "YOU NEVER DO ARITHMETIC. For every figure, call a deterministic tool (read_cell, get_range, find_label, tie_out, k1_box_tie, recompute_control, scan_errors, scan_external_links) and cite the exact workbook cell(s) it read. Never state or infer a number you did not get from a tool this turn.",
  "For each control needing attention: explain in plain English what failed, cite the workbook cell(s), state the most likely cause, and tell the preparer exactly what to check or fix. Work crown severity first, then high, then normal.",
  "When the preparer says they have fixed something, RE-VERIFY it with recompute_control(control_id) against the current workbooks — report the fresh status; do not take 'fixed' on trust.",
  "Track cleared vs still-open across the conversation. When (and only when) every exception is cleared, confirm the review is ready to submit to Jake for sign-off. Never green-light a submission while any exception remains.",
  "Be concise and directive — a senior reviewer walking a preparer through the file, not a chatbot.",
].join("\n");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal, x-ms-token-aad-access-token",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
function getOboInputToken(req) {
  const raw = req.headers["authorization"];
  const m = raw && typeof raw === "string" ? raw.match(/^Bearer\s+(.+)$/i) : null;
  if (m && m[1]) return m[1].trim();
  const store = req.headers["x-ms-token-aad-access-token"];
  if (typeof store === "string" && store.trim() !== "") return store.trim();
  return null;
}

// GET a DMS file's bytes from vault-dms dms_read_file (driveId + itemId), as the signed-in user (OBO).
function dmsReadFile(driveId, itemId, token) {
  return new Promise((resolve) => {
    const url = new URL(`${DMS_API_BASE_URL}/api/dms_read_file`);
    url.searchParams.set("driveId", driveId);
    url.searchParams.set("itemId", itemId);
    const reqOpts = {
      method: "GET", hostname: url.hostname, port: url.port ? Number(url.port) : 443,
      path: url.pathname + url.search,
      headers: { Authorization: `Bearer ${token}`, "x-ms-token-aad-access-token": token },
    };
    const r = https.request(reqOpts, (res) => {
      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) { res.resume(); return resolve(null); }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    r.on("error", () => resolve(null));
    r.end();
  });
}

// Generic JSON POST over https (Foundry token + model call). Never logs bodies/tokens.
function httpsJsonPost(urlStr, headers, bodyStr) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const reqOpts = {
      method: "POST", hostname: url.hostname, port: url.port ? Number(url.port) : 443,
      path: url.pathname + url.search, headers,
    };
    const r = https.request(reqOpts, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        let json = null; try { json = text ? JSON.parse(text) : null; } catch { json = null; }
        resolve({ status: res.statusCode || 0, json });
      });
    });
    r.on("error", reject);
    r.write(bodyStr);
    r.end();
  });
}

// AAD client-credentials token for the Foundry resource (scope https://ai.azure.com/.default).
async function getFoundryToken() {
  const form = new URLSearchParams({
    client_id: AAD_CLIENT_ID,
    client_secret: AAD_CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: "https://ai.azure.com/.default",
  }).toString();
  const { status, json } = await httpsJsonPost(
    `https://login.microsoftonline.com/${AAD_TENANT_ID}/oauth2/v2.0/token`,
    { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) },
    form
  );
  if (status < 200 || status >= 300 || !json || !json.access_token) throw new Error("foundry token acquisition failed");
  return json.access_token;
}

// Build the compact per-review state block from the stored engine results (read once per turn; the agent
// drills/re-verifies via tools). Non-pass controls first (what needs attention), severity-ordered.
function reviewStateBlock(session, checks) {
  const sev = { crown: 0, high: 1, normal: 2 };
  const attention = checks
    .filter((c) => c.status !== "pass")
    .sort((a, b) => (sev[a.severity] ?? 3) - (sev[b.severity] ?? 3));
  const lines = attention.map((c) => {
    const computed = c.computed != null ? JSON.stringify(c.computed) : "—";
    const cells = Array.isArray(c.cell_refs) && c.cell_refs.length ? c.cell_refs.join(" · ") : "—";
    const delta = c.delta != null ? ` delta=${c.delta}` : "";
    return `- [${c.severity}] ${c.control_id} (${c.control_group}) — ${c.status}; computed=${computed};${delta} cells=${cells}`;
  });
  const sc = session.scorecard || {};
  const by = sc.byStatus || {};
  return [
    "CURRENT REVIEW STATE",
    `Fund: ${session.fund_name || session.fund_id} · Period: ${session.period} · Currency: ${session.currency || "—"}`,
    `Status: ${session.status} · Scorecard: ${(by.pass ?? 0)}/${sc.total ?? checks.length} passing, ${(by.exception ?? 0)} exceptions`,
    attention.length ? `Controls needing attention (${attention.length}):\n${lines.join("\n")}` : "No open exceptions — all controls pass.",
  ].join("\n");
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") return send(context, 204, "");

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));

  const token = getOboInputToken(req);
  if (!token) return send(context, 401, errorBody("UNAUTHORIZED", "Missing delegated token input.", 401));

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  // ---- Validate inputs before any SQL (deterministic 400s) ----
  const reviewId = typeof body.review_id === "string" ? body.review_id.trim() : "";
  if (!isUuid(reviewId)) return send(context, 400, errorBody("INVALID_REQUEST", "Field 'review_id' is required and must be a valid UUID.", 400));

  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages || messages.length === 0) return send(context, 400, errorBody("INVALID_REQUEST", "Field 'messages' is required and must be a non-empty array.", 400));
  // Each message must match the contract shape { role: 'user'|'assistant', content: string|array } —
  // validated before any forward so malformed input is a deterministic 400, never an upstream/model error.
  const VALID_ROLES = new Set(["user", "assistant"]);
  for (const m of messages) {
    if (!m || typeof m !== "object" || !VALID_ROLES.has(m.role) || m.content == null || (typeof m.content !== "string" && !Array.isArray(m.content))) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Each message must be { role: 'user' | 'assistant', content: string | array }.", 400));
    }
  }

  const files = body.files && typeof body.files === "object" ? body.files : {};
  for (const role of REQUIRED_ROLES) {
    const f = files[role];
    if (!f || typeof f !== "object" || typeof f.driveId !== "string" || !f.driveId || typeof f.itemId !== "string" || !f.itemId) {
      return send(context, 400, errorBody("INVALID_REQUEST", `files.${role} is required and must be { driveId, itemId }.`, 400));
    }
  }
  let client = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    await client.query(
      `SELECT set_config('app.current_user_id', $1, false), set_config('request.jwt.claim.sub', $1, false), set_config('request.jwt.claim.oid', $1, false)`,
      [oid]
    );

    // Owner-scoped review resolution (same discrimination as sigma_run_review).
    const sessionRes = await client.query(
      `SELECT id, fund_id, fund_name, period, currency, status, scorecard FROM public.sigma_review_sessions WHERE id = $1 AND created_by = $2`,
      [reviewId, oid]
    );
    if (sessionRes.rows.length === 0) {
      const exists = await client.query(`SELECT public.sigma_review_session_exists_unscoped($1) AS e`, [reviewId]);
      await client.query("COMMIT");
      if (exists.rows[0] && exists.rows[0].e) return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to discuss this review.", 403));
      return send(context, 404, errorBody("NOT_FOUND", "Review not found.", 404));
    }
    const session = sessionRes.rows[0];

    // Stored engine results (the review state the agent reasons from + drills with tools).
    const checksRes = await client.query(
      `SELECT control_id, control_group, severity, status, computed, delta, cell_refs FROM public.sigma_review_checks WHERE session_id = $1 ORDER BY control_group ASC, control_id ASC`,
      [reviewId]
    );
    await client.query("COMMIT");
    const checks = checksRes.rows;

    // ---- Load the workbook set (OBO via vault-dms) + build ctx (verbatim from sigma_run_review) ----
    const buffers = {};
    for (const role of [...REQUIRED_ROLES, ...OPTIONAL_ROLES]) {
      const f = files[role];
      if (!f || typeof f.driveId !== "string" || typeof f.itemId !== "string") continue;
      const buf = await dmsReadFile(f.driveId, f.itemId, token);
      if (buf) buffers[role] = buf;
    }
    for (const role of REQUIRED_ROLES) {
      if (!buffers[role]) return send(context, 422, errorBody("UNRESOLVED_WORKBOOK_SET", `Could not read the '${role}' workbook from the DMS as the signed-in user.`, 422));
    }
    const wb = {};
    for (const [role, buf] of Object.entries(buffers)) {
      wb[role] = XLSX.read(buf, { type: "buffer", cellFormula: true, cellNF: false, cellHTML: false });
    }
    const outWs = wb.output.Sheets["Schedule K-1s"];
    const partnerCols = [];
    if (outWs && outWs["!ref"]) {
      const rng = XLSX.utils.decode_range(outWs["!ref"]);
      for (let c = 9; c <= rng.e.c; c++) {
        const cell = outWs[T.A1(3, c)];
        if (cell && cell.v != null && String(cell.v).trim()) partnerCols.push(c);
      }
    }
    const ctx = {
      wb,
      k1Layout: { sheet: "Schedule K-1s", schedKCol: 7, partnerCols, boxRows: [5, 6, 7, 8, 9, 10, 12, 16, 17, 22, 23] },
      py: { endingTaxCapital: {} },
      cy: { beginningTaxCapital: {} },
      ratios: {},
    };

    // ---- Assemble the system prompt: the server-side mandatory ruleset (non-bypassable) → review state.
    // Nothing here is caller-supplied (Operating Ruleset §1). Layer-1 memory is added server-side by the
    // vault-theo delegation in a later VEP, never from the request body. ----
    const effectiveSystem = [K1_REVIEW_RULESET, reviewStateBlock(session, checks)]
      .filter((s) => typeof s === "string" && s.trim() !== "")
      .join("\n\n");

    // ---- Foundry callModel (token acquired once per turn; reused across loop iterations) ----
    const foundryToken = await getFoundryToken();
    const callModel = async ({ system, tools, messages: convo }) => {
      const payload = JSON.stringify({ model: FOUNDRY_DEPLOYMENT, max_tokens: MAX_TOKENS, system, tools, messages: convo, stream: false });
      const { status, json } = await httpsJsonPost(
        `${FOUNDRY_BASE}/anthropic/v1/messages`,
        { "Content-Type": "application/json", Authorization: `Bearer ${foundryToken}`, "anthropic-version": ANTHROPIC_VERSION, "Content-Length": Buffer.byteLength(payload) },
        payload
      );
      if (status < 200 || status >= 300 || !json) throw new Error(`foundry upstream ${status}`);
      return json;
    };

    const { final, toolTrace } = await runReviewLoop({ system: effectiveSystem, messages, ctx, callModel });

    return send(context, 200, successBody({
      role: "assistant",
      content: final.content,
      stop_reason: final.stop_reason,
      model: final.model || FOUNDRY_DEPLOYMENT,
      tool_trace: toolTrace,
    }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("sigma_review_agent failed", err);
    if (err && err.code === "42501") return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to discuss this review.", 403));
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
