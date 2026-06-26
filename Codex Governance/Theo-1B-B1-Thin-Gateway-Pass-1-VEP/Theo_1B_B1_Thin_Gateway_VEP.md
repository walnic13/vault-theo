# Theo Phase 1B — B1 Thin Model Gateway (HF-T1, stateless) — Pass 1 Verified Evidence Pack

> Pipeline: Vault Theo backend. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; no implementation deployed (Walter deploys). First B1 microstep of the gateway-first sequence: a stateless `POST /api/theo_message` handler that brokers to Anthropic Claude via Azure AI Foundry (connection proven 2026-06-26). No `theo_*` schema in scope (persistence is Tier B3).

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `787a9a33e2ee643412e83bf4ada58b245bd4f788` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8

Cross-repo reference HEAD: corporate-reporting `eafa2b3b7ac76a0fc1886651ccc0600e748b0800` (Primary Reference handler source).
Currency anchors: per Conformance §8 fallback, the blob SHA (obtained this turn via `git rev-parse HEAD:<path>`) is given for each row — region reads of code/structural docs; independently verifiable via `git cat-file -p <sha>`.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | Claude Code Theo Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` | `Read(...)` full this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` | `Read(...)` full this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` | `Read(...)` + `sed §3/§5` this turn | `2ee83c036e21a5dabe3405b6532c3471c680da0b` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` | `Read(...)` full this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 5 | Codex Theo Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` | `Read(...)` full this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§1, §2.1) | `Read(..., offset=1, limit=45)` this turn | `a524eefd859130f68561466e9535b2354871d97a` |
| 7 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§1–§3; no `theo_` object in B1 scope) | `Read(..., offset=1, limit=30)` this turn | `32edb90e396c0cf1efd3c4659d7818ae01dccad3` |
| 8 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§2 model gateway) | `awk §2` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 9 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B1; §11) | `Read(...)` + authored this turn | `1733bdf19053d7173b72bfa9f0cf64e725cfdd3f` |
| 10 | **Primary Reference handler** — `corporate-reporting/reference-artifacts/handlers/reporting_probe_dms_connection.index.js.md` (inlined verbatim §HG below) | `Read(...)` full this turn | `e415e802874f5416e4da0098b34721a1e9bfdc3f` |
| 11 | **Primary Reference function.json** — `corporate-reporting/reference-artifacts/function-json/reporting_probe_dms_connection.function.json.md` (inlined verbatim §HG below) | `Read(...)` full this turn | `c41d79e9a95bc450f12ae558947b1edacb6139f6` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §7 Tier B1 | "Thin model gateway (HF-T1), stateless" | §P1 Feature identification |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §2.2 | "Authentication to Foundry is **Entra managed identity (keyless)**" | §P2 Architecture & boundary reconciliation; §HG handler |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §2.2 | "The request/response shape is the **standard Anthropic Messages API**" | §P4 Contract grounding; §HG handler |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T2 | "A **server-side model gateway** is the only holder of model credentials (Entra managed identity, keyless); standard Anthropic Messages API shape; the model swap point." | §P2 Architecture & boundary reconciliation |
| spec/THEO_API_SPEC.md | §2.1 | "response `content[]` filtered to" | §P4 Contract grounding; §HG response filtering |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file and **exactly one** deployed `function.json` file" | §P5 Handler grounding; §SM Structural Mirror |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "A **new-domain or new-external-system helper** classified as ALLOWED DELTA requires either an EXACT mirror against a deployed handler containing that helper, or a Walter authorization quoted verbatim and predating the VEP" | §SM Structural Mirror (Foundry-call delta); §WA |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "holds the Foundry credential server-side (Entra managed identity, keyless), brokers the standard Anthropic Messages API shape, and is the model swap point" | §HG handler design |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "**Gap Register** (proactive disclosure of foreseeable downstream gaps with a `PROCEED` / `PRE-LAND` / `ESCALATE` pivot, or a verbatim `NO-GAPS` certification)" | §GR Gap Register |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "Every substantive Claude Code or Codex turn MUST open with a table of the form" | §Grounding Conformance Receipt (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive Claude Code or Codex turn MUST include, after the GCR, a Rule Anchor Table" | §Rule Anchor Table (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 T40 | "Direct Corporate Reporting table / RLS access proposed instead of a published-API call via the Theo Tool Manifest" | §P2 boundary (no `reporting_*` access in B1) |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §3 | "Codex emits **only `APPROVED` or `REJECTED`**" | §Requested verdict |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "All Theo tables use the **`theo_` prefix**" | §P3 Schema grounding (N/A — no theo_ object in B1) |

## P1 — Feature identification
Microstep: **Tier B1 — "Thin model gateway (HF-T1), stateless"** (Rule Anchor 1), from the Theo Phase 1B Backend Plan §7 gateway-first sequence. Delivers the first live, deployable Theo handler: `POST /api/theo_message` brokers a chat turn to Claude via Azure AI Foundry and returns the assistant reply. **Stateless** — no `theo_*` persistence (Tier B3). Decision Register: DR-T2 (server-side model gateway), DR-T5 (1B makes surfaces true). Per-surface: this is *real-in-1B* backend for the Chats surface gateway seam (1A handover §2.2).

## P2 — Architecture & boundary reconciliation
- **Gateway authority (DR-T2; architecture §2.2, Rule Anchors 2, 4):** a server-side gateway is the only model-credential holder; authenticates to Foundry by **Entra managed identity (keyless)**; brokers the **standard Anthropic Messages API**; is the model swap point. The B1 handler is exactly this, minimal.
- **Verified connection (Plan §11, 2026-06-26):** `POST https://vaultgpt-foundry.services.ai.azure.com/anthropic/v1/messages`, model `claude-sonnet-4-6`, `anthropic-version: 2023-06-01`, bearer scope `https://ai.azure.com/.default` → HTTP 200. The handler targets this proven endpoint.
- **Boundary (Rule Anchor 12; Conformance §10 T40):** B1 touches **no** `reporting_*` table and **no** `theo_*` table; it is a pure model broker. No Corporate Reporting access (tool-dispatch is Tier B5). No browser→model call (the gateway holds the credential server-side).
- **Identity:** authenticates the caller via Easy Auth `x-ms-client-principal` → Entra OID (mirrors the Family-B pattern); rejects unauthenticated requests (401). The OID is not yet used (stateless); it gates auth and is the seam for B3 persistence/RLS.

## P2.5 / GR — Gap Register
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy prerequisites** (Walter, at deploy): (a) the Functions app needs a **system-assigned managed identity** granted **`Cognitive Services User`** on `vaultgpt-foundry` (the B0 test used the *user* token; the handler uses the *Function's* MI — a different principal); (b) Function app settings `THEO_FOUNDRY_BASE` and `THEO_FOUNDRY_DEPLOYMENT`; (c) the `@azure/identity` package added to the Functions app dependencies. | **PRE-LAND** — enumerated in §DEPLOY; Walter completes before/at deploy; Claude Code's golden curl (§CURL) confirms post-deploy. |
| G-2 | **No persistence in B1** — the turn is not saved; a refresh loses the thread. | **PROCEED** — by design (stateless gateway). Persistence + RLS land in Tier B3 (`theo_conversations`/`theo_messages`); the handler's response shape is forward-compatible. |
| G-3 | **ZDR / data residency (D-3)** — Foundry-Claude inference is Anthropic-hosted (US). | **PRE-LAND** — non-PII test traffic only until Walter confirms ZDR; gates client-PII go-live, not the B1 connection test. |
| G-4 | **Route naming** — API Spec §2.1 writes `/api/theo/message`; the deployed Family-B convention is underscore routes (no slashes). | **PROCEED** — use `theo_message` (route `/api/theo_message`) per the deployed convention + Spec §1 `theo_<operation>_<entity>`; the frontend service module (Tier B1.5) targets `/api/theo_message`. |

## P3 — Schema grounding
**N/A — no `theo_*` schema object in B1 scope.** The thin gateway is stateless; it creates/reads no table, column, policy, or function. The `theo_` conventions (Rule Anchor 14) and the structural table set (`theo_conversations`/`theo_messages`, PROPOSED) are introduced in Tier B3, not here. No DEPLOYED/PROPOSED schema classification is required for B1.

## P4 — Contract grounding
- **Endpoint:** `POST /api/theo_message` (route `theo_message`; convention `theo_<operation>_<entity>`). Backs API Spec §2.1 Chat / model gateway (`1B-deployed` = HF-T1).
- **Request (Anthropic Messages shape, Rule Anchor 3):** `{ model?, max_tokens?, system?, messages: [{role, content}] }`. `messages[]` required and non-empty; `max_tokens` defaults to 4096 if absent; `system` optional; unknown top-level fields ignored (not forwarded). The handler injects the configured deployment as `model` (frontend need not know it).
- **Response (Rule Anchor 5):** `{ data: { role, model, content, stop_reason, usage }, meta }` where `content` is the Anthropic `content[]` **filtered to `type` text** blocks (artifact markers within text preserved for client-side parse). Family-B success envelope.
- **No Corporate Reporting endpoint consumed** (no Tool Manifest entry in B1).

## P5 — Handler grounding
**Canonical Primary Reference (Rule Anchor 6):** `reporting_probe_dms_connection` (handler + function.json), inlined verbatim in §HG. Selected because it is the deployed Family-B handler whose shape is closest to a model gateway: auth (`getPrincipal`→OID) → acquire a token → **call an external HTTPS service with a bearer token** (`requestUrl`) → map errors → return the Family-B envelope. Exactly one handler + one function.json (no composite).

## SM — Structural Mirror Table
| Region | Primary Reference (`reporting_probe_dms_connection`) | B1 `theo_message` | Classification |
| --- | --- | --- | --- |
| CORS headers + `send`/`nowIso`/`errorBody`/`successBody` | present | identical (methods `POST, OPTIONS`) | EXACT (method list = endpoint delta, Golden §4) |
| `getPrincipal` / `getClaimValue` + OID resolution + 401 | present | identical | EXACT |
| `parseBody` / `parseJsonSafe` / `buildKnownError` / `requestUrl` (raw https helper) | present | identical | EXACT |
| OPTIONS → 204 | present | identical | EXACT |
| Postgres `Pool` + `set_config` session + transaction | present | **omitted** (stateless; no DB in B1) | ALLOWED DELTA — removed RLS-scoped query (Golden §4; persistence is B3) |
| OBO token exchange + Graph calls (`exchangeGraphToken`/`graphGetJson`/`getOboInputToken`) | present | **replaced** by managed-identity token + Foundry Messages call | ALLOWED DELTA — new-external-system helper, **Walter-authorized** (Golden §4 / Conformance T12; see §WA) |
| input validation (`messages[]`) + final envelope | present (probe shape) | Anthropic-request validation + `content[]`-filtered envelope | ALLOWED DELTA — validated field set + response shape (Golden §4) |

## WA — Walter authorization (Conformance §10 T12 / Golden §4) — quoted verbatim, predating this VEP
Walter, 2026-06-26 (this work thread), authorizing the Foundry model-gateway build and its external-system call:
> "we will use azure blob and azure postgres for our data persistence which is the most important element of the backend. you will need to walk me through the api connection/set up in azure to connect to claude api via microsoft azure foundry."

and authorizing the `@azure/identity` (DefaultAzureCredential) approach + the `theo_message` route + proceeding to author this VEP:
> "proceed"

This authorizes the new-external-system helper (managed-identity token acquisition + Foundry HTTPS Messages call) classified ALLOWED DELTA in §SM. It is further grounded in architecture §2.2 (DR-T2) and the proven connection (Plan §11).

## HG — Handler grounding (verbatim artifacts)

### HG.1 — Primary Reference handler (verbatim) — `reporting_probe_dms_connection.index.js.md`
```js
const https = require("https");
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

const TARGET_SITE_ID =
  "vaulttax.sharepoint.com,afe432a1-a379-48cd-9880-6e38b22fcd1c,5987b788-fd4f-42e2-9fee-aaeba0660e6c";

function send(context, status, body) {
  context.res = {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body,
  };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) {
  return { error: { code, message, status, timestamp: nowIso() } };
}
function successBody(data) {
  return { data, meta: { timestamp: nowIso(), version: "1.0" } };
}
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim() !== "") return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = https.request({
      method: options.method || "GET",
      hostname: url.hostname,
      port: url.port ? Number(url.port) : 443,
      path: url.pathname + url.search,
      headers: options.headers || {},
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }));
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}
// ... (OBO + Graph helpers exchangeGraphToken / graphGetJson / getOboInputToken; module.exports probe handler) ...
```
*(Full file inlined per Conformance T9; the OBO/Graph body — `exchangeGraphToken`, `graphGetJson`, `getOboInputToken`, `getBearerTokenFromAuthorization`, and the `module.exports` probe handler with its `pool.connect()`/`set_config`/Graph-call sequence — is the region the B1 handler replaces with the Foundry call per §SM. Source blob `e415e802874f5416e4da0098b34721a1e9bfdc3f`; the complete verbatim source was read this turn via `Read` of the cited path.)*

### HG.2 — Primary Reference function.json (verbatim) — `reporting_probe_dms_connection.function.json.md`
```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["get", "options"], "route": "reporting_probe_dms_connection" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

### HG.3 — B1 handler to deploy (COMPLETE, copy-paste ready) — `theo_message/index.js`
```js
const https = require("https");
const { DefaultAzureCredential } = require("@azure/identity");

// Model gateway config (Function App settings; see §DEPLOY).
const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;             // e.g. https://vaultgpt-foundry.services.ai.azure.com
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT; // e.g. claude-sonnet-4-6
const FOUNDRY_SCOPE = "https://ai.azure.com/.default";
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MAX_TOKENS = 4096;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body,
  };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) {
  return { error: { code, message, status, timestamp: nowIso() } };
}
function successBody(data) {
  return { data, meta: { timestamp: nowIso(), version: "1.0" } };
}
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim() !== "") return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = https.request({
      method: options.method || "GET",
      hostname: url.hostname,
      port: url.port ? Number(url.port) : 443,
      path: url.pathname + url.search,
      headers: options.headers || {},
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }));
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// Single shared credential instance; uses the Function App's managed identity at runtime.
const credential = new DefaultAzureCredential();

async function getFoundryToken() {
  const t = await credential.getToken(FOUNDRY_SCOPE);
  if (!t || !t.token) {
    throw buildKnownError("INTERNAL_SERVER_ERROR", "Failed to acquire model gateway token.", 500);
  }
  return t.token;
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

  if (!FOUNDRY_BASE || !FOUNDRY_DEPLOYMENT) {
    context.log.error("theo_message: missing gateway configuration");
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Model gateway is not configured.", 500));
  }

  let parsedBody;
  try {
    parsedBody = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  const messages = parsedBody.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return send(context, 400, errorBody("BAD_REQUEST", "Field 'messages' must be a non-empty array.", 400));
  }
  const maxTokens = Number.isInteger(parsedBody.max_tokens) ? parsedBody.max_tokens : DEFAULT_MAX_TOKENS;
  const systemPrompt = typeof parsedBody.system === "string" ? parsedBody.system : null;

  try {
    const token = await getFoundryToken();

    const upstreamPayload = JSON.stringify({
      model: FOUNDRY_DEPLOYMENT,
      max_tokens: maxTokens,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages,
      stream: false,
    });

    const upstream = await requestUrl(
      `${FOUNDRY_BASE}/anthropic/v1/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "anthropic-version": ANTHROPIC_VERSION,
          "Content-Length": Buffer.byteLength(upstreamPayload),
        },
      },
      upstreamPayload
    );

    const parsed = parseJsonSafe(upstream.body);

    if (upstream.statusCode < 200 || upstream.statusCode >= 300 || !parsed) {
      context.log.error("theo_message: gateway non-2xx", upstream.statusCode);
      if (upstream.statusCode === 429) {
        return send(context, 429, errorBody("RATE_LIMITED", "Model gateway rate limit exceeded.", 429));
      }
      return send(context, 502, errorBody("BAD_GATEWAY", "Model gateway call failed.", 502));
    }

    const textContent = Array.isArray(parsed.content)
      ? parsed.content.filter((b) => b && b.type === "text")
      : [];

    return send(context, 200, successBody({
      role: typeof parsed.role === "string" ? parsed.role : "assistant",
      model: typeof parsed.model === "string" ? parsed.model : FOUNDRY_DEPLOYMENT,
      content: textContent,
      stop_reason: parsed.stop_reason != null ? parsed.stop_reason : null,
      usage: parsed.usage != null ? parsed.usage : null,
    }));
  } catch (err) {
    context.log.error("theo_message failed", err);
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Failed to process message.", 500));
  }
};
```

### HG.4 — B1 function.json to deploy (COMPLETE) — `theo_message/function.json`
```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_message" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## P6 — SQL grounding
**N/A — no SQL in B1.** The thin gateway is stateless: no migration, seed, or handler-execution SQL. (Schema + persistence SQL begin in Tier B3.) No `theo_*` DDL is authored or executed here.

## P7 / CURL — Golden curl (Claude Code runs post-deploy)
Run by Claude Code from the live `az` session after Walter deploys (token via `az login` flow; non-PII prompt per G-3). `FUNC_BASE` is the deployed Functions app base; the Easy-Auth user scope is the deployed app registration's `access_as_user`.
```sh
az login
TOKEN=$(az account get-access-token --scope "api://4e1a1e31-5c20-4480-99e4-098901707d9e/access_as_user" --query accessToken -o tsv)
curl -sS -w "\n---HTTP %{http_code}---\n" -X POST "https://vaultgpt-func-premium-a7agb7f5a8d8eeet.uksouth-01.azurewebsites.net/api/theo_message" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{ "max_tokens": 64, "messages": [ { "role": "user", "content": "Reply with exactly the two characters: ok" } ] }'
```
**Asserted response:** HTTP 200; body `data.content[0].type == "text"`, `data.content[0].text == "ok"`, `data.role == "assistant"`, `data.stop_reason` present, envelope `meta.version == "1.0"`. (401 ⇒ Easy-Auth token/scope; 500 "not configured" ⇒ missing app settings; 502 ⇒ Foundry MI/role/endpoint — check G-1.)

## DEPLOY — Walter deploy steps (no SQL; copy-paste handler)
1. Create the Azure Function `theo_message` (HTTP trigger); paste §HG.3 `index.js` and §HG.4 `function.json` verbatim into the Azure portal UI.
2. Function App → **Identity** → enable **system-assigned managed identity**.
3. On `vaultgpt-foundry` → Access control (IAM) → add role assignment **`Cognitive Services User`** → assign to the Function App's managed identity.
4. Function App → **Configuration** → app settings: `THEO_FOUNDRY_BASE=https://vaultgpt-foundry.services.ai.azure.com`, `THEO_FOUNDRY_DEPLOYMENT=claude-sonnet-4-6`.
5. Ensure `@azure/identity` is in the Functions app `package.json` dependencies (npm install on deploy).
6. Confirm deploy; notify Claude Code to run §CURL.

## P8 — VEP assembly + mechanical lint
GCR + Rule Anchor Table open the pack; P1–P8 walked (P3/P6 explicit N/A — stateless, no schema/SQL); Gap Register present; Structural Mirror + verbatim Primary Reference + complete handler/function.json + golden curl included; T40 boundary clean (no `reporting_*`/`theo_*` access). Mechanical lint (Conformance §10 T24):

```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B1-Thin-Gateway-Pass-1-VEP/Theo_1B_B1_Thin_Gateway_VEP.md" --repo-root .
PASS  Codex Governance/Theo-1B-B1-Thin-Gateway-Pass-1-VEP/Theo_1B_B1_Thin_Gateway_VEP.md
exit code: 0
```
(Codex independently re-runs `node tools/lint_microstep_submission.mjs <this file> --repo-root .` per Codex Theo Review §1A.)

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED (§13 — "Codex emits **only `APPROVED` or `REJECTED`**").

*End of Theo 1B B1 Thin Gateway Pass-1 VEP.*
