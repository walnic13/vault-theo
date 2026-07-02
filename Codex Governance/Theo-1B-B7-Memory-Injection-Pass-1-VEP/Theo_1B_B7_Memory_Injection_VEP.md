# Theo 1B — B7 Memory Injection (system-prompt) into `theo_message` — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete full-replacement handler provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier **B7 (injection)** — make the deployed memory actually *work* by having `theo_message` fetch the signed-in user's distilled memory profile (`theo_user_memory`, `scope='user'`) and **prepend it to the system prompt** before the Foundry-Claude call, so it is recalled across all the user's chats. This is the keystone: without it, neither the manually-created (B7a CRUD) nor the future distilled memory reaches the model. **Minimal, isolated, non-fatal:** one self-contained read block before the upstream call (a short user-scoped `SELECT` over `theo_user_memory`, explicit `created_by`); the critical persist/isolation block is **unchanged**. A memory-fetch failure degrades to no memory block — chat never breaks.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `c1edebbaf21ce3c7247f24c8aa8165b86767d87c` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. This modifies the **deployed `theo_message`** (the SEC-fixed version is what runs in Azure; blob `2f966fe9`, inlined verbatim §SM) — so the Primary Reference (Golden §2) is that deployed handler + its `function.json` (blob `bd476fc8`, §SM-FJ; **unchanged** — deploy replaces `index.js` only). The full replacement (§FIX) adds exactly one isolated, non-fatal memory-fetch block before the Foundry call + switches the upstream `system` to the augmented prompt; everything else is byte-identical (diff confirmed). Memory read is user-scoped with explicit `created_by` (the shared connection role bypasses RLS — SEC-fix discipline). D-3 ZDR + D-7 RESOLVED (memory is client-PII; injection is now ungated). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §5 SM) | `Grep("selects \*\*exactly one\*\* deployed handler file")` this turn | `2ee83c036e21a5dabe3405b6532c3471c680da0b` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B7; D-7 RESOLVED) | `Grep("Distilled memory profile")` this turn | `f433158a9ef37789ae3a7133906d3c08c31c1783` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 ownership; system-prompt assembly seam) | `Grep("system-prompt assembly")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.7 Memory; injection at assembly) | `Grep("§2.7 Memory")` this turn | `0d5ac940baf402cf369862694adcac394232c137` |
| 9 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§6 `theo_user_memory`) | `Grep("theo_user_memory")` this turn | `95538419e01ff95d20342e6b65d97c332912c614` |
| 10 | **Primary Reference handler** (deployed; modify target) — `Codex Governance/Theo-1B-B3-SEC-User-Isolation-Fix-Pass-1-VEP/theo_message.index.js` | `Read(full)` this turn | `2f966fe9849e6a26a9fa3285cd86e756c33dbf25` |
| 11 | **Primary Reference function.json** (deployed; unchanged) — `api/theo_message/function.json` | `Read(full)` this turn | `bd476fc8d144ed9592b561b4c0ded84f5911cff0` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B7 | "injected at HF-T1 system-prompt assembly" | §P1 / §FIX — memory prepended to the system prompt |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_message` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §FIX — memory read scoped `created_by = $oid` |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §6 | "theo_user_memory" | §FIX — reads the deployed B7a memory table |

---

## P1 — Feature identification
**Microstep:** Theo Phase 1B **Tier B7 — system-prompt injection** (Rule Anchor on Plan Tier B7 "injected at HF-T1 system-prompt assembly"). `theo_message` now reads the signed-in user's `scope='user'` memory items and prepends them to the system prompt sent to Foundry-Claude. This makes the deployed B7a memory controls (and later the distillation engine) actually affect Theo's answers — memory recalled across every chat. No surface/contract change; the response envelope, persistence, citations, and per-user isolation are all unchanged.

## P2 — Architecture & boundary reconciliation
- **Injection point.** Before building the upstream Foundry payload, a self-contained block opens a short read connection, sets `set_config(oid)`, runs a user-scoped `SELECT content FROM theo_user_memory WHERE created_by = $1 AND scope = 'user' ORDER BY salience DESC, updated_at DESC, id DESC LIMIT 50`, and composes `effectiveSystem = [memoryBlock, body.system]` (joined). The upstream `system` becomes `effectiveSystem`.
- **Non-fatal.** The memory fetch is wrapped so any failure logs and degrades to an empty memory block — chat is never broken by the memory layer. The block uses its own connection (`memClient`) released in `finally`; the existing persist connection/transaction is untouched.
- **Isolation (SEC-fix discipline).** The read is explicitly `created_by = $oid` scoped (the shared connection bypasses RLS) — a user's memory can never leak into another user's prompt.
- **Scope.** Only `scope='user'` (global) memory is injected now; `scope='project'` injection (gated on resolving the active `project_id` at gateway time) is a future increment (§GR G-3). Reads only `theo_user_memory`; no `reporting_*`; no write.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** Replace the deployed `theo_message` `index.js` with §FIX (the `function.json` is unchanged). | **PRE-LAND** — §DEPLOY; Claude Code golden curls confirm (memory recalled across a fresh conversation). |
| G-2 | **In-repo `api/theo_message/index.js` is stale** (pre-SEC, blob `549f9a57`) — repo drift predating this microstep. | **PROCEED** — post-deploy housekeeping: sync `api/theo_message/index.js` to the deployed (injected) version so repo == deployed. Not a blocker for this change. |
| G-3 | **Project-scoped memory injection.** Only `scope='user'` is injected; project-scoped items are not (the gateway does not yet resolve the active `project_id`). | **PROCEED (future-trigger)** — a later increment resolves the conversation/project and injects matching `scope='project'` memory. Out of scope here. |
| G-4 | **Distillation engine.** Auto-populating `theo_user_memory` from finished conversations. | **PROCEED (future-trigger)** — next microstep (D-3/D-7 RESOLVED). Injection makes both manual (B7a) and future distilled memory usable. |

No write SQL in this pack (plan only). No `reporting_*` change.

## P3 — Backend / contract grounding
No contract/response-shape change. The Foundry request's `system` field is augmented server-side (memory + the client `system`); `data.content`/`conversation_id`/citations/persistence are identical to deployed. API Spec §2.7 documents "distilled memory … injected at system-prompt assembly" (the contract basis); `theo_user_memory` is the deployed B7a table.

## P4 — Change detail (vs deployed §SM)
Exactly two changes (diff-verified against the deployed SEC `theo_message`):
1. **Inserted** (before `const token = await getFoundryToken();`): the non-fatal memory-fetch block → `memoryBlock`, then `const effectiveSystem = [memoryBlock, systemPrompt].filter(non-empty).join("\n\n") || null;`.
2. **Changed** one line in the upstream payload: `...(systemPrompt ? { system: systemPrompt } : {})` → `...(effectiveSystem ? { system: effectiveSystem } : {})`.
All else (validation, Foundry call, persist block with explicit `created_by`, 42501/403/404/COMMIT/ROLLBACK) is byte-identical.

## P5 — Component reference grounding
Primary Reference (Golden §2) = the **deployed `theo_message`** pair — handler (§SM, blob `2f966fe9`, the SEC-fixed version running in Azure) + its `function.json` (§SM-FJ, blob `bd476fc8`, unchanged). §FIX is the full replacement; the change is the §P4 injection only.

## P6 — Repository & active-surface grounding
Modify target: the deployed `theo_message` `index.js` (Azure) → replaced by §FIX. `function.json` unchanged. `api/theo_message/index.js` (in-repo) is stale (G-2) and synced post-deploy. Guardrails: explicit `created_by` on the memory read; non-fatal; no browser storage; no `reporting_*`; response contract unchanged. §FIX passes `node --check`.

## P7 — Risk / regression
- **Non-fatal memory read:** a DB hiccup logs + degrades to no memory; chat unaffected.
- **No isolation regression:** read is `created_by`-scoped; persist block unchanged.
- **Latency:** one extra short user-scoped indexed `SELECT` (LIMIT 50) before the model call — negligible vs the Foundry round-trip.
- **Prompt size:** capped at 50 items; memory is short distilled facts.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1 PRE-LAND; G-2/G-3/G-4 PROCEED); Primary Reference pair inlined byte-identical (§SM + §SM-FJ); full replacement (§FIX) inlined + `node --check` clean + diff-verified (two changes only). Plan-only. On Codex APPROVAL, Walter replaces `theo_message` `index.js`; Claude Code golden-curls (memory recalled in a fresh conversation; non-memory chat unchanged).

---

## §SM — Primary Reference handler (deployed `theo_message`, byte-identical; the modify target)
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

  let client = null;
  try {
    const token = await getFoundryToken();

    const upstreamPayload = JSON.stringify({
      model: FOUNDRY_DEPLOYMENT,
      max_tokens: maxTokens,
      ...(systemPrompt ? { system: systemPrompt } : {}),
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

## §SM-FJ — Primary Reference function.json (deployed `theo_message/function.json`, byte-identical; UNCHANGED)
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

## §FIX — `theo_message/index.js` (full replacement; injection added)
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

---

## §DEPLOY — Walter deploy steps (replace one handler; function.json unchanged)
1. Replace `theo_message` `index.js` with §FIX. (No `function.json` change, no env var, no dependency, no migration.)
2. Reply "B7 injection deployed" → Claude Code runs §CURL.

## §CURL — verification plan (token via `az`; never printed; captured under `.local/`)
1. **Seed a memory** — `POST theo_create_user_memory {scope:"user", content:"The user's name is Walter and they prefer concise UK-spelling answers."}` → 201.
2. **Recall in a NEW conversation** — `POST theo_message` (no `conversation_id`) with a user message like *"What's my name and how do I like answers?"* → 200; the reply reflects the saved memory (name + concise/UK) — proving server-side injection.
3. **Isolation** — the injected memory is only the caller's (`created_by` scoped); a second user's chat does not see it.
4. **Non-fatal + unchanged baseline** — a normal question with no saved memory → 200, behaves exactly as before; `conversation_id` round-trip + citations intact.
5. **Cleanup** — `theo_delete_user_memory` the seed; subsequent new chat no longer reflects it.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B7 Memory Injection Pass-1 Backend VEP (plan only).*
