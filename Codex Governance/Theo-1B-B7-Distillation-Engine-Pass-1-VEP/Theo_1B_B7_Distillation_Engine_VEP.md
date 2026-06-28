# Theo 1B — B7 Distillation Engine (`theo_distill_memory` timer) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete migration + handler provided for Walter to deploy at Pass 3, after which Claude Code verifies. **Microstep:** Tier **B7 (distillation)** — auto-populate `theo_user_memory` so users don't add facts by hand. A **timer-triggered** function (`theo_distill_memory`, CRON every 15 min) scans conversations idle ≥ `THEO_DISTILL_IDLE_MINUTES` (default 30) that have new activity since last distillation, runs **one cheap Foundry-Claude extraction** per conversation (≤8 durable facts as JSON, fed the user's existing memory to avoid duplicates), and writes them to `theo_user_memory` with `created_by` = the conversation's owner. Implements the **D-7 RESOLVED** policy (distill on idle/close; cheap JSON extraction; durable facts only). D-3 ZDR RESOLVED. Adds one nullable watermark column (`theo_conversations.last_distilled_at`). Injection (deployed) makes the distilled memory immediately usable.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `056f9b35046c7063a40b49bf84eeb4c688053972` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference (Golden §2) = the **deployed `theo_message`** (the injection version running in Azure; blob `f41362bb`, inlined §SM) — the closest deployed handler for the Foundry-Claude-call + `pg` idiom this timer reuses (`getFoundryToken`/`requestUrl`/`parseJsonSafe`/Pool) — plus its `function.json` (blob `bd476fc8`, §SM-FJ). **NEW binding type:** `theo_distill_memory` is a `timerTrigger` (no deployed timer handler exists in the repo to mirror); its `function.json` (§FJ) is the Azure Functions documented timer-binding shape, explicitly NOT a structural mirror of the httpTrigger reference (P5). Memory writes are explicit `created_by` = the conversation owner (the timer has no user identity; the connection role bypasses RLS — SEC-fix discipline). Schema add is one nullable column (§DDL), mirroring the B2/B7a DDL idiom. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §5 SM) | `Grep("selects \*\*exactly one\*\* deployed handler file")` this turn | `2ee83c036e21a5dabe3405b6532c3471c680da0b` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B7; D-7 RESOLVED) | `Grep("distillation step")` this turn | `f433158a9ef37789ae3a7133906d3c08c31c1783` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.7 Memory — distilled memory written from completed turns) | `Grep("§2.7 Memory")` this turn | `0d5ac940baf402cf369862694adcac394232c137` |
| 9 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§6 `theo_user_memory`; §3 `theo_conversations`) | `Grep("theo_user_memory")` this turn | `95538419e01ff95d20342e6b65d97c332912c614` |
| 10 | **Primary Reference handler** (deployed; Foundry + pg idiom) — `Codex Governance/Theo-1B-B7-Memory-Injection-Pass-1-VEP/theo_message.index.js` | `Read(full)` this turn | `f41362bb020a2488915fce0699f8598344b558e8` |
| 11 | **Primary Reference function.json** (deployed httpTrigger) — `api/theo_message/function.json` | `Read(full)` this turn | `bd476fc8d144ed9592b561b4c0ded84f5911cff0` |
| 12 | Schema DDL idiom reference — `Codex Governance/Theo-1B-B7a-Memory-Substrate-Schema-Pass-1-VEP/b7a_migration.sql` | `Read(full)` this turn | `bbb66f45d5b598bf104499f32b3812af41c64e26` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B7 | "distillation step" | §P1 / §HG — the timer extraction engine |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_message` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §HG — every write `created_by` = the conversation owner |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §6 | "theo_user_memory" | §HG — writes the deployed B7a memory table |

---

## P1 — Feature identification
**Microstep:** Theo Phase 1B **Tier B7 — distillation engine** (Rule Anchor on Plan Tier B7 "distillation step"). A timer-triggered function periodically extracts durable user memory from finished conversations into `theo_user_memory`, so memory accrues automatically (the deployed B7a CRUD lets users curate it; the deployed injection makes it recalled). No HTTP surface; no user request; no contract change.

## P2 — Architecture & boundary reconciliation
- **Trigger.** `timerTrigger`, CRON `0 */15 * * * *` (every 15 min). On each tick, scans for due conversations and distills a bounded batch.
- **Due-scan.** `SELECT id, created_by FROM theo_conversations WHERE updated_at < now() - (IDLE_MINUTES‖' minutes')::interval AND (last_distilled_at IS NULL OR last_distilled_at < updated_at) ORDER BY updated_at ASC LIMIT BATCH` (defaults: idle 30 min, batch 20). The new `last_distilled_at` watermark (§DDL) ensures each thread is distilled once per activity burst.
- **Extraction.** Per due conversation: load its messages (`created_by`-scoped) + the owner's existing `scope='user'` memory; one cheap Foundry-Claude call (NO web tools) returning ≤`MAX_FACTS` (8) durable facts as JSON, instructed to skip anything already in existing memory or third-party confidential data; parse, sanitise (trim/clamp), and INSERT each into `theo_user_memory` (`created_by` = owner, `scope='user'`, `source_conversation_id` = the thread, salience 0–10); set `last_distilled_at = now()`. Per-conversation `BEGIN/COMMIT`; per-conversation `catch ROLLBACK` so one failure never aborts the batch, and a failed conversation is watermarked to avoid hot-looping.
- **Identity / isolation.** The timer has no user token; it is a server-side batch process. It reads across owners (the connection role bypasses RLS) and writes each row with the **conversation's** `created_by` explicitly — memory is always attributed to the correct owner; no cross-user contamination.
- **Boundary.** Reads `theo_conversations`/`theo_messages`, writes `theo_user_memory`; **no `reporting_*`**; the only model call is the extraction (server-side Foundry, the existing credential path).

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** (a) Run §DDL (one column + index) as `pgadmin_vault`; (b) create the new `theo_distill_memory` timer function (§HG + §FJ) on `vaultgpt-func-premium`. `pg` + Foundry creds already present. | **PRE-LAND** — §DEPLOY; Claude Code verifies (seed an idle conversation → memory appears after a tick / forced run). |
| G-2 | **NEW binding type — `timerTrigger`.** No deployed timer handler exists in the repo to mirror; §FJ is the Azure Functions documented timer shape, not a structural mirror of the httpTrigger Primary Reference. | **PROCEED** — disclosed in P5; the handler *code* idiom (Foundry + pg) mirrors the deployed `theo_message` Primary Reference; only the trigger binding is new. |
| G-3 | **Schema-doc + API-Spec follow-ups.** `theo_conversations.last_distilled_at` and the distillation behaviour should be recorded post-deploy. | **PRE-LAND** — short schema-doc + (already-present) API-Spec §2.7 note; a Role-C follows deploy, mirroring prior DEPLOYED Role-Cs. |
| G-4 | **Extraction quality / cost.** LLM extraction may occasionally capture a weak fact; cost is bounded (≤BATCH calls/tick). | **PROCEED** — users curate via the B7a CRUD (edit/delete); salience ranks injection; batch + idle thresholds are env-tunable. Durable-facts-only prompt + existing-memory dedup limit noise. |

No write SQL executed in this pack (plan only; Walter runs §DDL at Pass 3). No `reporting_*` change.

## P3 — Backend / contract grounding
No HTTP contract (timer). Writes conform to the deployed `theo_user_memory` shape (Schema §6) and API Spec §2.7 ("distilled memory written from completed turns; injected at system-prompt assembly"). The extraction call uses the established Foundry-Claude path (`THEO_FOUNDRY_BASE`/`THEO_FOUNDRY_DEPLOYMENT` + `AAD_*` client-credentials), no web tools.

## P4 — Configuration
Env (all optional, safe defaults): `THEO_DISTILL_IDLE_MINUTES`=30, `THEO_DISTILL_BATCH`=20, `THEO_DISTILL_MAX_FACTS`=8, `THEO_DISTILL_MAX_TOKENS`=1024. Reuses the existing Foundry + Postgres settings. CRON in §FJ (15 min) — adjust there if needed.

## P5 — Component reference grounding
Primary Reference (Golden §2) = the **deployed `theo_message`** pair — handler (§SM, blob `f41362bb`, the injection version in Azure) for the Foundry-call + `pg` idiom (`getFoundryToken`, `requestUrl`, `parseJsonSafe`, Pool), and its `function.json` (§SM-FJ, blob `bd476fc8`). **Binding deviation (disclosed):** `theo_distill_memory` is a `timerTrigger`; there is no deployed timer handler to mirror, so §FJ is the Azure Functions documented timer-binding shape — a NEW binding, classified explicitly (not a structural mirror of the httpTrigger reference). The handler omits the HTTP request/response plumbing (`send`/`getPrincipal`/CORS) since it is not request-driven; it adds the due-scan + per-conversation extraction/insert loop.

## P6 — Repository & active-surface grounding
New artifacts (this package): `b7d_migration.sql`, `theo_distill_memory.index.js`, `theo_distill_memory.function.json`. No existing source changed. Guardrails: explicit `created_by` on every write; per-conversation transactions + error isolation; no `reporting_*`; extraction-only model call (no web tools). Handler passes `node --check`; function.json valid; migration idempotent (`ADD COLUMN IF NOT EXISTS`).

## P7 — Risk / regression
- **Bounded cost:** ≤BATCH (20) Foundry calls per 15-min tick.
- **Isolation:** each memory row written with the conversation's `created_by`; the timer never mixes owners.
- **Resilience:** per-conversation try/catch + watermark-on-failure prevents one bad conversation from blocking or repeating the batch.
- **No user-path impact:** the timer is independent of `theo_message`; a distillation failure never affects live chat.
- **Privacy:** durable-facts-only prompt; users can delete any item (B7a); D-3 ZDR confirmed.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-3 PRE-LAND; G-2/G-4 PROCEED); Primary Reference pair inlined byte-identical (§SM + §SM-FJ); migration (§DDL) + timer handler (§HG, `node --check` clean) + timer function.json (§FJ, valid) inlined. Plan-only. On Codex APPROVAL, Walter runs §DDL + creates the timer function; Claude Code verifies an idle conversation distils into `theo_user_memory`; then the schema-doc DEPLOYED Role-C (G-3).

---

## §SM — Primary Reference handler (deployed `theo_message`, byte-identical; Foundry + pg idiom)
```js
const https = require("https");
const { Pool } = require("pg");

const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT;
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MAX_TOKENS = 4096;
const TITLE_MAX_LEN = 80;

// Internet grounding — server-side Foundry-Claude tools (architecture §2.3; HF-T1 scope).
const WEB_FETCH_BETA = "web-fetch-2025-09-10";

function parsePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

const WEB_SEARCH_MAX_USES = parsePositiveInt(process.env.THEO_WEB_SEARCH_MAX_USES, 5);
const WEB_FETCH_MAX_USES = parsePositiveInt(process.env.THEO_WEB_FETCH_MAX_USES, 5);
const WEB_FETCH_ALLOWED_DOMAINS = (process.env.THEO_WEB_FETCH_ALLOWED_DOMAINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Persistence pool (Family-B pattern; shared `vaultgpt` instance). The shared Functions connection
// role bypasses RLS, so per-user isolation is enforced by explicit `created_by = $oid` predicates on
// every query below (never by RLS alone) — set_config still establishes the request identity.
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
    if (match && typeof match.val === "string" && match.val.trim() !== "") {
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

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

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
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers || {},
            body: data,
          });
        });
      }
    );

    req.on("error", reject);

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

async function getFoundryToken() {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw buildKnownError(
      "INTERNAL_SERVER_ERROR",
      "Missing required model gateway configuration.",
      500
    );
  }

  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://ai.azure.com/.default",
  }).toString();

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const r = await requestUrl(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(form),
    },
  }, form);

  const payload = parseJsonSafe(r.body);

  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    const description =
      payload &&
      (payload.error_description || payload.error || payload.error_codes?.join(", "));
    const message = description
      ? `Model gateway token request failed: ${description}`
      : "Model gateway token request failed.";

    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }

  return payload.access_token;
}

// Server-side grounding tools attached to every upstream Messages call. Claude invokes them
// autonomously only when a query needs live web data; max_uses caps spend. web_fetch carries an
// optional domain allowlist (THEO_WEB_FETCH_ALLOWED_DOMAINS) and requires the web-fetch beta header.
function buildGroundingTools() {
  const webFetch = {
    type: "web_fetch_20250910",
    name: "web_fetch",
    max_uses: WEB_FETCH_MAX_USES,
  };
  if (WEB_FETCH_ALLOWED_DOMAINS.length > 0) {
    webFetch.allowed_domains = WEB_FETCH_ALLOWED_DOMAINS;
  }
  return [
    { type: "web_search_20250305", name: "web_search", max_uses: WEB_SEARCH_MAX_USES },
    webFetch,
  ];
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
    return send(
      context,
      401,
      errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401)
    );
  }

  if (!FOUNDRY_BASE || !FOUNDRY_DEPLOYMENT) {
    context.log.error("theo_message: missing gateway configuration");
    return send(
      context,
      500,
      errorBody("INTERNAL_SERVER_ERROR", "Model gateway is not configured.", 500)
    );
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)
    );
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Field 'messages' must be a non-empty array.", 400)
    );
  }

  const maxTokens = Number.isInteger(body.max_tokens) ? body.max_tokens : DEFAULT_MAX_TOKENS;
  const systemPrompt = typeof body.system === "string" ? body.system : null;

  // B3 persistence inputs: optional conversation id + app-context anchor; the new user turn is
  // the last user message in the submitted history.
  const requestedConversationId =
    typeof body.conversation_id === "string" && body.conversation_id.trim() !== ""
      ? body.conversation_id.trim()
      : null;
  const appKey =
    typeof body.app_key === "string" && body.app_key.trim() !== "" ? body.app_key.trim() : null;
  const appContext =
    body.app_context != null && typeof body.app_context === "object" ? body.app_context : null;
  const lastUser = [...messages]
    .reverse()
    .find((m) => m && m.role === "user" && typeof m.content === "string");
  const userText = lastUser ? lastUser.content : "";

  if (requestedConversationId !== null && !isUuid(requestedConversationId)) {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Field 'conversation_id' must be a valid UUID.", 400)
    );
  }

  // ---- Memory injection (B7): prepend the user's distilled memory profile to the system prompt ----
  // Read-only, user-scoped (explicit created_by; the shared connection role bypasses RLS), and
  // NON-FATAL — a memory-fetch failure must never break chat, so it degrades to no memory block.
  let memoryBlock = "";
  {
    let memClient = null;
    try {
      memClient = await pool.connect();
      await memClient.query(
        `
        SELECT
          set_config('app.current_user_id', $1, false),
          set_config('request.jwt.claim.sub', $1, false),
          set_config('request.jwt.claim.oid', $1, false)
        `,
        [oid]
      );
      const mem = await memClient.query(
        `
        SELECT content
        FROM public.theo_user_memory
        WHERE created_by = $1 AND scope = 'user'
        ORDER BY salience DESC, updated_at DESC, id DESC
        LIMIT 50
        `,
        [oid]
      );
      if (mem.rowCount > 0) {
        memoryBlock =
          "Saved memory about this user (apply when relevant; do not recite verbatim):\n" +
          mem.rows.map((r) => `- ${r.content}`).join("\n");
      }
    } catch (memErr) {
      context.log.error("theo_message: memory fetch failed (non-fatal)", memErr);
    } finally {
      if (memClient) {
        memClient.release();
      }
    }
  }
  const effectiveSystem =
    [memoryBlock, systemPrompt].filter((s) => typeof s === "string" && s.trim() !== "").join("\n\n") || null;

  let client = null;
  try {
    const token = await getFoundryToken();

    const upstreamPayload = JSON.stringify({
      model: FOUNDRY_DEPLOYMENT,
      max_tokens: maxTokens,
      ...(effectiveSystem ? { system: effectiveSystem } : {}),
      messages,
      tools: buildGroundingTools(),
      stream: false,
    });

    const upstream = await requestUrl(
      `${FOUNDRY_BASE}/anthropic/v1/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "anthropic-version": ANTHROPIC_VERSION,
          "anthropic-beta": WEB_FETCH_BETA,
          "Content-Length": Buffer.byteLength(upstreamPayload),
        },
      },
      upstreamPayload
    );

    const parsed = parseJsonSafe(upstream.body);

    if (upstream.statusCode < 200 || upstream.statusCode >= 300 || !parsed) {
      context.log.error("theo_message: gateway non-2xx", upstream.statusCode);
      if (upstream.statusCode === 429) {
        return send(
          context,
          429,
          errorBody("RATE_LIMITED", "Model gateway rate limit exceeded.", 429)
        );
      }
      return send(
        context,
        502,
        errorBody("BAD_GATEWAY", "Model gateway call failed.", 502)
      );
    }

    const textContent = Array.isArray(parsed.content)
      ? parsed.content.filter((b) => b && b.type === "text")
      : [];
    const assistantModel = typeof parsed.model === "string" ? parsed.model : FOUNDRY_DEPLOYMENT;
    const assistantText = textContent
      .map((b) => (typeof b.text === "string" ? b.text : ""))
      .join("");
    const assistantCitations = textContent.flatMap((b) =>
      Array.isArray(b.citations) ? b.citations : []
    );

    // ---- Persist the turn (HF-T2; explicit created_by ownership; shared vaultgpt instance) ----
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

    let conversationId = requestedConversationId;
    if (conversationId) {
      // Explicit ownership scope (the shared connection role bypasses RLS): a user may only
      // append to a conversation they own. Non-owned id → 0 rows → 403 (exists) / 404 (absent).
      const owned = await client.query(
        `SELECT id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
        [conversationId, oid]
      );
      if (owned.rowCount === 0) {
        const existsResult = await client.query(
          `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
          [conversationId]
        );
        const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
        throw exists
          ? buildKnownError("FORBIDDEN", "You do not have access to this conversation.", 403)
          : buildKnownError("NOT_FOUND", "Conversation not found.", 404);
      }
    } else {
      const title = userText.trim().slice(0, TITLE_MAX_LEN) || "New chat";
      const created = await client.query(
        `
        INSERT INTO public.theo_conversations (created_by, title, model, app_key, app_context)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [oid, title, assistantModel, appKey, appContext != null ? JSON.stringify(appContext) : null]
      );
      conversationId = created.rows[0].id;
    }

    const seqResult = await client.query(
      `SELECT count(*)::int AS n FROM public.theo_messages WHERE conversation_id = $1 AND created_by = $2`,
      [conversationId, oid]
    );
    const baseSeq = seqResult.rows[0].n;

    await client.query(
      `
      INSERT INTO public.theo_messages (created_by, conversation_id, seq, role, content, model)
      VALUES ($1, $2, $3, 'user', $4, NULL)
      `,
      [oid, conversationId, baseSeq, userText]
    );

    await client.query(
      `
      INSERT INTO public.theo_messages (created_by, conversation_id, seq, role, content, model, citations)
      VALUES ($1, $2, $3, 'assistant', $4, $5, $6)
      `,
      [
        oid,
        conversationId,
        baseSeq + 1,
        assistantText,
        assistantModel,
        assistantCitations.length ? JSON.stringify(assistantCitations) : null,
      ]
    );

    await client.query(
      `UPDATE public.theo_conversations SET updated_at = now() WHERE id = $1 AND created_by = $2`,
      [conversationId, oid]
    );

    await client.query("COMMIT");

    return send(
      context,
      200,
      successBody({
        conversation_id: conversationId,
        role: typeof parsed.role === "string" ? parsed.role : "assistant",
        model: assistantModel,
        content: textContent,
        stop_reason: parsed.stop_reason != null ? parsed.stop_reason : null,
        usage: parsed.usage != null ? parsed.usage : null,
      })
    );
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_message failed", err);

    if (err && err.code === "42501") {
      return send(
        context,
        403,
        errorBody("FORBIDDEN", "You do not have permission for this conversation.", 403)
      );
    }

    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(
        context,
        err.status,
        errorBody(err.code, err.message, err.status)
      );
    }

    return send(
      context,
      500,
      errorBody("INTERNAL_SERVER_ERROR", "Failed to process message.", 500)
    );
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

## §SM-FJ — Primary Reference function.json (deployed `theo_message/function.json`, byte-identical httpTrigger)
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_message"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

---

## §DDL — `b7d_migration.sql` (complete; Walter-executable; idempotent)
```sql
-- ============================================================================
-- Theo 1B — Tier B7 distillation watermark: theo_conversations.last_distilled_at
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent.
-- Additive: one nullable column + a supporting index. The distillation timer marks a
-- conversation distilled (sets last_distilled_at = now()) after processing it; a thread is
-- re-distilled only when it gains new activity (updated_at advances past last_distilled_at).
-- ============================================================================

ALTER TABLE public.theo_conversations
  ADD COLUMN IF NOT EXISTS last_distilled_at timestamptz NULL;

-- Supports the timer's due-scan (idle + not-yet-distilled-since-last-activity).
CREATE INDEX IF NOT EXISTS idx_theo_conversations_distill_scan
  ON public.theo_conversations (updated_at)
  WHERE last_distilled_at IS NULL OR last_distilled_at < updated_at;
```

## §HG — `theo_distill_memory/index.js` (full; timer-triggered)
```js
const https = require("https");
const { Pool } = require("pg");

const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT;
const ANTHROPIC_VERSION = "2023-06-01";
const CONTENT_MAX_LEN = 4000;
const KIND_MAX_LEN = 64;
const TRANSCRIPT_MAX_CHARS = 24000;

function parsePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

// Tunable via app settings; safe defaults per D-7 (distill on idle/close; cheap extraction; durable facts only).
const IDLE_MINUTES = parsePositiveInt(process.env.THEO_DISTILL_IDLE_MINUTES, 30);
const BATCH = parsePositiveInt(process.env.THEO_DISTILL_BATCH, 20);
const MAX_FACTS = parsePositiveInt(process.env.THEO_DISTILL_MAX_FACTS, 8);
const DISTILL_MAX_TOKENS = parsePositiveInt(process.env.THEO_DISTILL_MAX_TOKENS, 1024);

// Persistence pool (shared `vaultgpt` instance). The timer is a server-side batch process with no user
// identity; it reads across owners (the connection role bypasses RLS) and writes each memory row with
// created_by = the conversation's owner explicitly (never RLS-derived).
const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

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
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data });
        });
      }
    );
    req.on("error", reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function getFoundryToken() {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing required model gateway configuration.");
  }

  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://ai.azure.com/.default",
  }).toString();

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(
    tokenUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(form),
      },
    },
    form
  );

  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    throw new Error("Model gateway token request failed.");
  }
  return payload.access_token;
}

const EXTRACTION_SYSTEM =
  "You extract durable, long-term memory about the USER from a chat transcript with a tax assistant. " +
  "Return ONLY a JSON array (no prose, no code fences) of at most %MAX% objects, each " +
  '{"content": string, "kind": "fact"|"preference"|"profile", "salience": integer 0-10}. ' +
  "Include ONLY stable facts/preferences about the user that would help in future, unrelated chats " +
  "(e.g. their name, role, firm, working/style preferences, recurring entities or matters they own). " +
  "EXCLUDE one-off question content, transient task details, anything already present in EXISTING MEMORY, " +
  "and any third party's confidential data. If nothing qualifies, return [].";

module.exports = async function (context, distillTimer) {
  if (!FOUNDRY_BASE || !FOUNDRY_DEPLOYMENT) {
    context.log.error("theo_distill_memory: missing model gateway configuration");
    return;
  }

  let token;
  try {
    token = await getFoundryToken();
  } catch (err) {
    context.log.error("theo_distill_memory: token acquisition failed", err);
    return;
  }

  const client = await pool.connect();
  try {
    const due = await client.query(
      `
      SELECT id, created_by
      FROM public.theo_conversations
      WHERE updated_at < now() - (($1)::text || ' minutes')::interval
        AND (last_distilled_at IS NULL OR last_distilled_at < updated_at)
      ORDER BY updated_at ASC
      LIMIT $2
      `,
      [IDLE_MINUTES, BATCH]
    );

    context.log(`theo_distill_memory: ${due.rowCount} conversation(s) due`);

    for (const conv of due.rows) {
      try {
        const msgs = await client.query(
          `
          SELECT role, content
          FROM public.theo_messages
          WHERE conversation_id = $1 AND created_by = $2
          ORDER BY seq ASC, created_at ASC
          `,
          [conv.id, conv.created_by]
        );

        if (msgs.rowCount === 0) {
          await client.query(
            `UPDATE public.theo_conversations SET last_distilled_at = now() WHERE id = $1`,
            [conv.id]
          );
          continue;
        }

        const existing = await client.query(
          `
          SELECT content
          FROM public.theo_user_memory
          WHERE created_by = $1 AND scope = 'user'
          ORDER BY salience DESC, updated_at DESC
          LIMIT 100
          `,
          [conv.created_by]
        );

        const transcript = msgs.rows
          .map((m) => `${m.role}: ${typeof m.content === "string" ? m.content : ""}`)
          .join("\n")
          .slice(0, TRANSCRIPT_MAX_CHARS);
        const existingList = existing.rows.map((r) => `- ${r.content}`).join("\n") || "(none)";

        const systemPrompt = EXTRACTION_SYSTEM.replace("%MAX%", String(MAX_FACTS));
        const userContent = `EXISTING MEMORY:\n${existingList}\n\nTRANSCRIPT:\n${transcript}`;
        const payload = JSON.stringify({
          model: FOUNDRY_DEPLOYMENT,
          max_tokens: DISTILL_MAX_TOKENS,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }],
          stream: false,
        });

        const upstream = await requestUrl(
          `${FOUNDRY_BASE}/anthropic/v1/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "anthropic-version": ANTHROPIC_VERSION,
              "Content-Length": Buffer.byteLength(payload),
            },
          },
          payload
        );

        let facts = [];
        const parsed = parseJsonSafe(upstream.body);
        if (upstream.statusCode >= 200 && upstream.statusCode < 300 && parsed && Array.isArray(parsed.content)) {
          const text = parsed.content
            .filter((b) => b && b.type === "text")
            .map((b) => (typeof b.text === "string" ? b.text : ""))
            .join("")
            .trim();
          const arr = parseJsonSafe(text);
          if (Array.isArray(arr)) {
            facts = arr;
          }
        } else {
          context.log.error(`theo_distill_memory: extraction non-2xx for ${conv.id}`, upstream.statusCode);
        }

        await client.query("BEGIN");
        let inserted = 0;
        for (const f of facts.slice(0, MAX_FACTS)) {
          const content =
            f && typeof f.content === "string" ? f.content.trim().slice(0, CONTENT_MAX_LEN) : "";
          if (content === "") continue;
          const kind =
            f && typeof f.kind === "string" && f.kind.trim() !== "" ? f.kind.trim().slice(0, KIND_MAX_LEN) : "fact";
          const salience =
            f && Number.isInteger(f.salience) ? Math.max(0, Math.min(10, f.salience)) : 0;
          await client.query(
            `
            INSERT INTO public.theo_user_memory
              (created_by, scope, project_id, kind, content, source_conversation_id, salience)
            VALUES ($1, 'user', NULL, $2, $3, $4, $5)
            `,
            [conv.created_by, kind, content, conv.id, salience]
          );
          inserted++;
        }
        await client.query(
          `UPDATE public.theo_conversations SET last_distilled_at = now() WHERE id = $1`,
          [conv.id]
        );
        await client.query("COMMIT");

        context.log(`theo_distill_memory: conversation ${conv.id} -> ${inserted} memory item(s)`);
      } catch (convErr) {
        try { await client.query("ROLLBACK"); } catch {}
        context.log.error(`theo_distill_memory: conversation ${conv.id} failed`, convErr);
        // Mark distilled so a persistently-failing conversation does not hot-loop the batch each tick;
        // it re-distills only if it gains new activity (updated_at advances).
        try {
          await client.query(
            `UPDATE public.theo_conversations SET last_distilled_at = now() WHERE id = $1`,
            [conv.id]
          );
        } catch (markErr) {
          context.log.error(`theo_distill_memory: watermark update failed for ${conv.id}`, markErr);
        }
      }
    }
  } catch (err) {
    context.log.error("theo_distill_memory: batch failed", err);
  } finally {
    client.release();
  }
};
```

## §FJ — `theo_distill_memory/function.json` (NEW timerTrigger binding)
```json
{
  "bindings": [
    {
      "name": "distillTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */15 * * * *"
    }
  ]
}
```

---

## §DEPLOY — Walter deploy steps
1. Run `b7d_migration.sql` against the shared `vaultgpt` Postgres **as `pgadmin_vault`** (one column + index; idempotent).
2. Create a new function **`theo_distill_memory`** on `vaultgpt-func-premium`: `index.js` = §HG, `function.json` = §FJ (timerTrigger, 15-min CRON). No env var required (defaults apply); reuses existing Foundry + Postgres settings.
3. Reply "B7 distillation deployed" → Claude Code verifies (seed/age an idle conversation, confirm `theo_user_memory` gains distilled items after a tick), then prepares the schema-doc DEPLOYED Role-C (G-3).

## §VERIFY — post-deploy check (Claude Code)
Seed a conversation via `theo_message`, age it past the idle threshold (or temporarily lower `THEO_DISTILL_IDLE_MINUTES`), wait for a tick, then `GET /api/theo_list_user_memory` → distilled items present with `source_conversation_id` = the seeded thread; `theo_conversations.last_distilled_at` set (RO catalog/`theo_get_conversation` corroboration). Confirm a second user's conversation distils only into that user's memory (isolation).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B7 Distillation Engine Pass-1 Backend VEP (plan only).*
