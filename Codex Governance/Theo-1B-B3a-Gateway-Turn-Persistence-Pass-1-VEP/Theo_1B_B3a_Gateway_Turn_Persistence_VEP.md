# Theo 1B — B3a Gateway Turn Persistence (`theo_message` saves conversations + messages) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; the complete replacement handler is provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier B3 (first sub-pass, B3a) — extend the deployed `theo_message` gateway so each turn is **persisted** to the B2 substrate under ownership RLS: it resolves/creates a `theo_conversations` row, then inserts the user turn + the assistant turn (with `citations`) into `theo_messages`, and returns `conversation_id`. Chats become durable. The persistence region mirrors the deployed `reporting_create_entity` Family-B pattern (`pg` Pool + `BEGIN` → `set_config(oid)` → RLS query → `INSERT` → `COMMIT` → `client.release()`); everything else is byte-identical to the deployed `theo_message` (B1.7). The read side (recents/reload) is the next sub-pass (B3b).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `4266f8140b9c368238092c3ef75aba4f9ec02423` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference handler (Golden §2) = the deployed `theo_message` (inlined verbatim §HG.1); the `pg`/RLS persistence pattern is mirrored from the deployed `reporting_create_entity` (referenced + blob-pinned; Walter-authorized per Golden §4). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 VEP Format + Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates; §2/§4) | `Read(offset=1, limit=30)` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §4 allowed delta; §5 SM) | `Grep("selects \*\*exactly one\*\* deployed handler file" / "a Walter authorization quoted verbatim and predating the VEP")` this turn | `2ee83c036e21a5dabe3405b6532c3471c680da0b` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles; §1B DR-T2) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B3) | `Grep("HF-T1 extended to persist each turn")` this turn | `1733bdf19053d7173b72bfa9f0cf64e725cfdd3f` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 gateway response; persisted citations) | `Grep("may attach a \`citations\` array to text blocks")` this turn | `b5bbd57e1544404ffe98d92fd33e98c8dc4f0289` |
| 9 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 DEPLOYED-B2 tables; §5 deployed DDL) | `Read(full)` this turn (B2 close-out) | `2c9d013b9bbff00c8023a8a19497bbab5f97a4f7` |
| 10 | **Primary Reference handler** (deployed, modify-base) — `api/theo_message/index.js` | `Read(full, 1–349)` this turn | `6c5e9c12cd1e7ee471af706563ffc7625da899f2` |
| 11 | Deployed function.json (unchanged) — `api/theo_message/function.json` | `Read(full)` this turn | `bd476fc8d144ed9592b561b4c0ded84f5911cff0` |
| 12 | Persistence pattern (referenced mirror; Golden §4 + §WA) — `../corporate-reporting/reference-artifacts/handlers/reporting_create_entity.index.js.md` | `Read(full, 1–257)` this turn (firsthand) | blob `c2f02bf0f6c5be50900a9fbb7a015529e649ad25` (corporate-reporting `38da0d6a722de6042ece0a6c5979b13dff7da736`) |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` read/write (Theo writes only `theo_*`).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B3 | "HF-T1 extended to persist each turn" | §P1 / §HG.3 — the gateway persists each turn |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §P5 / §HG.1 — Primary Reference = deployed `theo_message` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "a Walter authorization quoted verbatim and predating the VEP" | §SM / §WA — the persistence region (ALLOWED DELTA) is Walter-authorized; pattern mirrors deployed `reporting_create_entity` |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §2 | "Four separate policies per table" | §P3 — writes go through the deployed B2 ownership-RLS policies |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §HG.3 — `set_config(oid)` + `created_by = oid`; RLS scopes every row to the signed-in user |
| spec/THEO_API_SPEC.md | §2.1 | "may attach a `citations` array to text blocks" | §HG.3 — assistant `citations` persisted to `theo_messages.citations` |

---

## P1 — Feature identification
**Role/Decision Register (Orchestration §1A/§1B):** Claude Code authors (Pass 1); Codex reviews (Pass 2); Walter deploys (Pass 3); Claude Code golden-curls. **Microstep:** Theo Phase 1B **Tier B3** — "wire HF-T1 to save turns" / "HF-T1 extended to persist each turn" (Rule Anchor 3). B3a is the first sub-pass: the gateway persists each turn to the deployed B2 substrate (chats durable). Conversation auto-creates on the first turn (returns `conversation_id`); read handlers for recents/reload are B3b.

## P2 — Architecture & boundary reconciliation
- **Model gateway (DR-T2):** the gateway remains the sole model-credential holder + swap point; B1.7's web_search/web_fetch grounding + EasyAuth + the raw-`https` Foundry call are unchanged. B3a adds a persistence step **after** the (successful) Foundry call.
- **Persistence (architecture §5 / B2):** writes use `pg` Pool over `POSTGRES_CONNECTION_STRING` (as `vaultgpt_app`), per-request `set_config(oid)`, ownership RLS (`created_by = auth.uid()`). Mirrors the deployed `reporting_create_entity` Family-B mutation pattern.
- **Boundary:** writes only `theo_conversations` / `theo_messages` (deployed B2). **No `reporting_*` access.** `auth.uid()` + the `vaultgpt_app`/`pgadmin_vault`/default-ACL grant model are the verified shared-instance facts (B2 close-out).

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **`POSTGRES_CONNECTION_STRING` (Walter, at deploy).** `theo_message`'s Functions app must have it set (connecting as `vaultgpt_app`). | **PRE-LAND** — if the `reporting_*` handlers run on the same app it is already present; else Walter adds it. Enumerated in §DEPLOY; Claude Code's golden curl (§CURL) confirms post-deploy. |
| G-2 | **Multi-turn threading needs the FE to echo `conversation_id`.** Without it, every send (no `conversation_id`) auto-creates a new conversation. | **PROCEED** — turns still persist; correct threading lands with the paired FE wiring (B3b-FE: send the returned `conversation_id`, render real recents/reload). B3a's contract is additive (request `conversation_id?`, response `conversation_id`). |
| G-3 | **Persist-only-on-success.** If the Foundry call fails, nothing is persisted (no DB connection opened); if persistence fails after a successful call, the turn is not saved (500) and the client retries. | **PROCEED** — by design; no orphan turns, the returned turn is always durable. |
| G-4 | **ZDR / client-PII (D-3).** Persisting real chat content (incl. later memory) implicates Anthropic-hosted ZDR + at-rest storage of client discussion. | **PRE-LAND** — gates client-PII go-live (same posture as B1.7 G-4); non-PII dev curls proceed. |
| G-5 | **API Spec contract delta.** The request gains optional `conversation_id`/`app_key`/`app_context`; the response `data` gains `conversation_id`. | **PROCEED** — additive/backward-compatible; an API-Spec §2.1 Role-C records it on B3a land (close-out, alongside B3b). |

## P3 — Schema grounding
All objects B3a writes are **DEPLOYED** (Tier B2, verified): `theo_conversations` (INSERT on auto-create; SELECT for ownership; UPDATE `updated_at`), `theo_messages` (INSERT user + assistant, `seq`/`citations`), and the `theo_conversation_exists_unscoped(uuid)` helper (403/404 discrimination). All carry the four ownership policies (Rule Anchor 6) keyed on `auth.uid()`. No schema change in B3a (no new object). No `reporting_*` object touched.

## P4 — Contract grounding
Endpoint unchanged: `POST /api/theo_message` (API Spec §2.1; HF-T1 DEPLOYED). Request **additively** accepts optional `conversation_id`, `app_key`, `app_context`; response `data` **additively** gains `conversation_id` (existing `role`/`model`/`content`/`stop_reason`/`usage` unchanged; `content` still text blocks with `citations` per Rule Anchor 8). An API-Spec §2.1 Role-C records the delta on land (§GR G-5).

## P5 — Handler grounding
Primary Reference (Golden §2; Rule Anchor 4) = the **deployed `theo_message`** (`api/theo_message/index.js`, blob `6c5e9c12…`), inlined verbatim at §HG.1. §HG.3 is the B3a replacement: an EXACT structural mirror of §HG.1 except the persistence region (ALLOWED DELTA). The persistence region's `pg` Pool + `BEGIN`/`set_config`/`INSERT … RETURNING`/`COMMIT`/error-code-mapping/`client.release()` pattern mirrors the deployed `reporting_create_entity` (GCR #12, blob-pinned; Golden §4 — Walter-authorized §WA). `function.json` unchanged (§HG.4).

## SM — Structural Mirror (B3a §HG.3 ↔ deployed `theo_message` §HG.1)
| Region | Classification | Basis |
| --- | --- | --- |
| `require("https")`; FOUNDRY/ANTHROPIC consts; WEB_* grounding consts; `buildGroundingTools`; the 10 shared helpers (`send`…`requestUrl`); `getFoundryToken`; OPTIONS/EasyAuth-oid/config/body/messages validation; the Foundry call + non-2xx/429/502 handling + `textContent` filter | EXACT | byte-identical to §HG.1 (deployed `theo_message`) |
| `require("pg")` + module `pool` (`POSTGRES_CONNECTION_STRING`, `ssl.rejectUnauthorized:false`); `TITLE_MAX_LEN` | ALLOWED DELTA | persistence pattern (deployed `reporting_create_entity`; Golden §4 + §WA) |
| Persistence inputs (`requestedConversationId`/`appKey`/`appContext`/`userText`); `let client` | ALLOWED DELTA | B3a request contract (§P4) |
| Persistence txn: `pool.connect()` → `BEGIN` → `set_config(oid)` → resolve/create `theo_conversations` (ownership SELECT + `theo_conversation_exists_unscoped` 403/404, else INSERT) → `seq` → INSERT user + assistant `theo_messages` → `UPDATE updated_at` → `COMMIT`; `catch` ROLLBACK + `42501`→403 + isKnown + 500; `finally` `client.release()` | ALLOWED DELTA | EXACT-mirror of the `reporting_create_entity` Family-B mutation pattern (GCR #12); writes deployed B2 objects under ownership RLS |
| Success body gains `conversation_id` | ALLOWED DELTA | §P4 response contract |
| `function.json` | EXACT | unchanged (§HG.4) |

No DEVIATION regions.

## WA — Walter authorization (Conformance §10 T12 / Golden §4) — quoted verbatim, predating this VEP
> "we have azure postgres as our database and we will also use azure blob, we want memory persistence within a project and over the entire user and their own chats and projects"

> "okay, proceed please" (this turn — authorizing B3a per the design: gateway auto-creates the conversation and persists each turn; backend-only, FE wiring as B3b-FE)

Plus Theo Phase 1B Plan Tier B3 ("HF-T1 extended to persist each turn", Rule Anchor 3). Authorizes the `pg`-persistence ALLOWED DELTA, which mirrors the deployed `reporting_create_entity` Family-B pattern.

## HG — Handler grounding (verbatim artifacts)

### HG.1 — Primary Reference handler (verbatim) — deployed `api/theo_message/index.js` (blob `6c5e9c12…`)
```js
const https = require("https");

const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT;
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MAX_TOKENS = 4096;

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

    return send(
      context,
      200,
      successBody({
        role: typeof parsed.role === "string" ? parsed.role : "assistant",
        model: typeof parsed.model === "string" ? parsed.model : FOUNDRY_DEPLOYMENT,
        content: textContent,
        stop_reason: parsed.stop_reason != null ? parsed.stop_reason : null,
        usage: parsed.usage != null ? parsed.usage : null,
      })
    );
  } catch (err) {
    context.log.error("theo_message failed", err);

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
  }
};
```

### HG.3 — B3a handler to deploy (COMPLETE, copy-paste ready) — `api/theo_message/index.js`
Delta vs §HG.1: `require("pg")` + `pool` + `TITLE_MAX_LEN`; persistence inputs; the persistence transaction (after a successful Foundry call); `conversation_id` in the response; `pg` error mapping in `catch`; `client.release()` in `finally`. Everything else byte-identical.
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

// Persistence pool (Family-B pattern; shared `vaultgpt` instance; connects as vaultgpt_app).
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

    // ---- Persist the turn (HF-T2; ownership RLS; shared vaultgpt instance) ----
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
      const owned = await client.query(
        `SELECT id FROM public.theo_conversations WHERE id = $1`,
        [conversationId]
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
      `SELECT count(*)::int AS n FROM public.theo_messages WHERE conversation_id = $1`,
      [conversationId]
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
      `UPDATE public.theo_conversations SET updated_at = now() WHERE id = $1`,
      [conversationId]
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

### HG.4 — function.json (UNCHANGED) — `api/theo_message/function.json`
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

## P6 — SQL grounding
No migration (B2 deployed the schema). The SQL B3a executes is embedded in §HG.3 (parameterised `INSERT`/`SELECT`/`UPDATE` on `theo_conversations`/`theo_messages` + the `set_config` session context + the `theo_conversation_exists_unscoped` call) — all against DEPLOYED B2 objects, all ownership-RLS-scoped, all parameterised (no string interpolation).

## P7 / CURL — Golden curls (Claude Code runs post-deploy)
Claude Code acquires a user token (`az account get-access-token --scope "api://<app-id>/access_as_user"`; never printed) and runs against the deployed handler; captures under `.local/`:
1. **New conversation** — POST `/api/theo_message` `{"max_tokens":256,"messages":[{"role":"user","content":"Say hello in one short sentence."}]}` → 200, `data.conversation_id` present.
2. **Append to the same conversation** — POST again with `{"conversation_id":"<from #1>","messages":[…,{"role":"user","content":"And one more sentence."}]}` → 200, same `conversation_id`.
3. **Persistence verification (read-only SQL)** — confirm the `theo_conversations` row + 4 ordered `theo_messages` (seq 0–3, alternating user/assistant) exist for the signed-in user.
4. **Foreign conversation** — POST with a random `conversation_id` not owned → 404 (or 403 if it exists under another user).
5. **Grounded turn** — a web_search prompt → 200, assistant message persisted with `citations` populated.

## DEPLOY — Walter deploy steps (handler only; no migration, no new dependency)
1. Replace `api/theo_message/index.js` with §HG.3 in full (Azure Portal Code+Test / deploy pipeline). `function.json` unchanged.
2. Ensure the Functions app has **`POSTGRES_CONNECTION_STRING`** set (connecting as `vaultgpt_app`). If the `reporting_*` handlers share this app it is already present; otherwise add it (G-1). `pg` is already a dependency of the reporting handlers on this app; if `theo` is a separate app, ensure `pg` is in its `package.json`/node_modules.
3. Notify Claude Code to run the §CURL golden curls.

## P8 — VEP assembly + mechanical lint
GCR (§3) + Rule Anchor Table (§5) open the pack; P1–P8 walked; Gap Register present (G-1…G-5); §SM classifies every region (no DEVIATION); §WA quotes the authorization; §HG.1/§HG.3/§HG.4 inline the artifacts verbatim. On Codex APPROVAL, Walter deploys §HG.3; Claude Code runs §CURL.

```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B3a-Gateway-Turn-Persistence-Pass-1-VEP/Theo_1B_B3a_Gateway_Turn_Persistence_VEP.md" --repo-root .
PASS  Codex Governance/Theo-1B-B3a-Gateway-Turn-Persistence-Pass-1-VEP/Theo_1B_B3a_Gateway_Turn_Persistence_VEP.md
exit code: 0
```
(Codex re-runs the same command per its §1A hard gates.)

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B3a Gateway Turn Persistence Pass-1 Backend VEP (plan only).*
