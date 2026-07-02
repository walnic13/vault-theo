# Theo 1B — B9 Streaming (`theo_message_stream` on the sidecar) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handler for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier **B9** — Theo chat streaming, to kill the perceived-latency that threatens adoption. **Scope is exactly ONE new handler, `theo_message_stream`, on a NEW Windows v4 Function App (`vaultgpt-func-stream`) that shares the existing EP1 plan (≈$0).** The **monolith (`vaultgpt-func-premium`) and its `theo_message` are NOT touched** — they stay v3, deployed, as the non-streaming endpoint. The new handler is a faithful **port of the deployed B8i `theo_message`** (memory B7 + history-RAG B7b-2 + attachment injection B8d + B8i `message_seq` persistence are byte-identical helpers), changed only to: run the **v4 programming model**, set `stream:true`, **relay Foundry's SSE to the browser verbatim**, and **persist the full turn on stream completion** (same DB write → history/reload identical). Both feasibility gates passed: **Gate 1** Foundry relays SSE; **Gate 2** Windows v4 Functions flushes SSE on EP1 (proven 2026-06-30). No schema change. Extended thinking is wired but OFF by default (gated env), pending a Foundry thinking-passthrough check.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Turn issued against HEAD: `a9b7209e272ba459a6f3753b32cd5845806ad81a` (vault-theo, `development`)
Detail: Pass 1 backend VEP for ONE new v4 streaming handler on the sidecar. Primary Reference (1/2) = the deployed **B8i `theo_message`** (blob `7b912574`) — the logic being ported; its helpers are reproduced byte-for-byte (EXACT mirror, Golden §4), inlined full §REF-MESSAGE. Primary Reference (2/2) = the **Gate-2-proven v4 streaming echo** (`app.setup({enableHttpStream:true})` + `PassThrough` SSE body on Windows EP1), inlined full §REF-ECHO. The new handler is inlined full §H-STREAM; its v4 app files §HOSTJSON / §PKG. **No monolith change** (zero files in `vaultgpt-func-premium` touched). **No schema change** (reuses the deployed tables incl. B8i `message_seq`). Both gates verified this session (`.local`-style evidence in the streaming assessment memory). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | cited; unchanged blob @ HEAD | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§4 EXACT mirror) | `Grep("EXACT mirror")` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles / DR-T2 gateway) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§ streaming sidecar follow-on, L188) | `Grep("streaming")` this turn | `54f22fe12b5bc0c6e3c089be2474ff0226d1497c` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§2.3 HF-T1 gateway; §5.2 ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§7 theo_attachments/message_seq; persistence tables) | cited; unchanged contract basis @ HEAD | `59924ef06b64e62b4cc6a268793d52bd82945cbd` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 gateway contract) | cited; contract basis @ HEAD | `1f166aad5f56635fb850f0e2376bda9f2adc8bc2` |
| 10 | **Primary Reference (1/2)** — deployed B8i `theo_message` (port base) — `Codex Governance/Theo-1B-B8i-Reload-Parity-Backend-Pass-1-VEP/theo_message.index.js` | `Read(full)` this turn | `7b9125749968537fdcb2bec2d64c4a924387c81c` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. **No monolith change.** No write SQL / no schema change.

---

## §WALTER-AUTH — verbatim directive authorizing B9 streaming (the feature authority)
Walter, current turn, making streaming urgent and scoping it:
> "the streaming is now urgent, i really don't think we can deploy theo without streaming, the pshycological torment on our people with buffering is too great, their perception of latency will cause them to simply not use theo. i'd like to replicate exactly how claude code manages streaming, using silly processing terms while it's gathering information, etc. and then showing its thinking during the process."

Constraints Walter set (same turn-sequence):
> "no linux, only windows, and we stay inside our current plan" … "we are only making one handler theo_message streaming, the rest of the monolith belong where they are, no changes at all to them" … "streaming … will only be used for theo and the theo message handler".

This authorizes: a single new streaming handler on a Windows v4 sidecar sharing the existing EP1 plan; the SSE relay of Foundry-Claude; and (FE, separate VEP) the Claude-Code-style status words + thinking display. It does NOT authorize any monolith change or streaming for any other handler.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "EXACT mirror against a deployed handler" | §H-STREAM helpers mirror the deployed B8i `theo_message` (§REF-MESSAGE) |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §H-STREAM / §persistTurn — every query explicit `created_by`-scoped |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §7 | "streaming (a deliberate sidecar — see the streaming assessment)" | §P1 — the B9 streaming microstep |

---

## P1 — Feature identification
Tier **B9 (streaming)**. The non-streaming `theo_message` buffers the whole reply (~several seconds of dead air → "perception of latency" Walter flags as an adoption killer). B9 adds a **streaming** path: a new `theo_message_stream` handler that relays Foundry-Claude's SSE token-by-token to the browser, so the answer appears as it generates. It is the Plan's "deliberate sidecar" streaming follow-on (Plan §7, L188) and Walter's urgent directive (§WALTER-AUTH). Backend-only here; the FE consumption + status words + thinking panel are the separate B9-FE VEP.

## P2 — Architecture & boundary reconciliation
- **Sidecar, not the monolith.** Streaming requires the **v4 programming model**, which is app-wide; the monolith is v3 and cannot stream. So `theo_message_stream` lives on a **new Windows v4 Function App `vaultgpt-func-stream`** that **shares the existing EP1 plan `ASP-VaultTax-931c`** (verified `appServicePlanId`; ≈$0). The monolith and all ~126 of its functions — including `theo_message` — are **untouched**.
- **Feasibility proven (both gates).** Gate 1: Foundry `…/anthropic/v1/messages` with `stream:true` returns `text/event-stream` and relays Anthropic events incrementally (~1.8s TTFT, deltas over ~3.2s). Gate 2: a v4 streaming echo on this exact app flushed 20 SSE ticks ~300ms apart on Windows EP1 (no re-buffering).
- **Faithful port.** The handler reproduces the deployed B8i `theo_message` logic byte-for-byte for: auth (EasyAuth → OID), input validation, memory (B7), history-RAG (B7b-2), attachment fetch + `buildAttachmentBlocks` (B8d/B8h), and persistence incl. the B8i `message_seq` linkage. The ONLY changes are the v4 model surface, `stream:true`, the SSE relay, persistence-on-completion, and a pre-stream ownership check (§CHANGESET).
- **Same data plane.** Reads/writes the same `theo_conversations`/`theo_messages`/`theo_attachments`, same `theo-content` Blob, same Foundry gateway (DR-T2). A turn produced via streaming is identical in storage to one via `theo_message` → reload/history/attachments (incl. B8i chips) work unchanged. **No schema change.**
- **Boundary.** No `reporting_*`. No monolith change. The FE will point its chat call at the new endpoint (separate B9-FE VEP); until then nothing changes for users.

## P2.5 / GR — Gap Register
Vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`.
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Sidecar runtime config (Walter).** The new app needs: system-assigned MI + **Storage Blob Data Contributor on `vaultgptstorage01`**; app settings (`THEO_FOUNDRY_BASE`, `THEO_FOUNDRY_DEPLOYMENT`, `AAD_TENANT_ID`/`CLIENT_ID`/`CLIENT_SECRET`, `POSTGRES_CONNECTION_STRING`, `THEO_BLOB_ACCOUNT`/`CONTAINER`, optional `THEO_EMBED_*`/`SEARCH_*`/`HISTORY_TOP_K`/`WEB_*`); Easy-Auth = the same Entra app (aud `api://4e1a1e31-5c20-4480-99e4-098901707d9e`); CORS = the SWA origin(s), no trailing slash. | **PRE-LAND** — §DEPLOY; before the handler can run. |
| G-2 | **Deploy the handler (Walter).** v4 zip-deploy `theo_message_stream` + `host.json` + `package.json` (incl. `node_modules`) to `vaultgpt-func-stream`. | **PRE-LAND** — §DEPLOY; Claude Code runs §GOLDEN after. |
| G-3 | **Plan amendment.** Add a formal B9 tier to Plan §7 (the sidecar is already noted at L188). | **PRE-LAND** — small Role-C, parallel; does not block the handler. |
| G-4 | **Extended thinking.** Wired but OFF (`THEO_THINKING_BUDGET_TOKENS` unset → `0`). Enabling requires verifying Foundry passes the `thinking` param + emits `thinking_delta` (the relay already forwards them verbatim). | **PROCEED (future-trigger)** — flip the env after a Foundry thinking check; no code change. |
| G-5 | **Persistence-after-stream.** The turn is persisted when the upstream stream ends; if that DB write fails, the answer was already shown but won't be saved (the handler emits `vault_meta {persisted:false}` and logs). | **PROCEED** — accepted, logged; far better than failing the visible answer. |
| G-6 | **FE consumption.** SSE consume + status words + thinking panel + repointing the chat call are the **B9-FE VEP** (Theo-FE regime). | **PROCEED (future-trigger)** — next package; until it ships, users still use the non-streaming `theo_message`. |
| G-7 | **API Spec row.** §2 should gain a `theo_message_stream` contract row. | **PROCEED** — doc Role-C after green curls. |

No write SQL. No `reporting_*` change. No monolith change.

## P3 — Backend / contract grounding
- **New endpoint:** `POST /api/theo_message_stream` on `vaultgpt-func-stream`. **Request body identical to `theo_message`** (`messages`, `max_tokens?`, `system?`, `conversation_id?`, `app_key?`, `app_context?`, `attachment_ids?`). **Response = `text/event-stream`**: the upstream Anthropic events relayed verbatim (`message_start` → `content_block_delta`… → `message_delta` → `message_stop`; plus `thinking_delta` when enabled), followed by a final app event `event: vault_meta\ndata: {conversation_id, model}` so the FE learns the (possibly new) conversation id. Pre-stream failures (auth/validation/ownership/attachments/gateway-non-2xx) return a normal **JSON error** (`{error:{…}}`) with the right status — the status is only committed to 200+SSE once the upstream returns 2xx. On a mid-stream upstream error → `event: vault_error`.
- **Persistence:** on stream end, the same INSERTs as `theo_message` (user turn at `seq=baseSeq`, assistant turn at `baseSeq+1`, B8i `message_seq` attachment linkage, `updated_at` bump). Contract basis = the deployed tables (doc #8). **No DDL.**

## P4 — Schema definition
None — reuses the deployed `theo_conversations` / `theo_messages` / `theo_attachments` (incl. the B8i `message_seq` column). No migration.

## P5 — Component reference grounding
- **Primary Reference (1/2):** deployed B8i `theo_message` (blob `7b912574`), inlined full §REF-MESSAGE — the logic ported. Every helper in §H-STREAM (`getFoundryToken`, `buildGroundingTools`, `getAadToken`, `embedQuery`, `searchHistory`, `getManagedIdentityAccessToken`, blob helpers, `buildAttachmentBlocks`, `parseJsonSafe`, `isUuid`, `getClaimValue`, `requestUrl`, `requestBinary`, and the persistence SQL) is a byte-for-byte EXACT mirror (Golden §4), except `context.log.error`→`context.error` (v4 logging).
- **Primary Reference (2/2):** the Gate-2-proven v4 streaming echo, inlined full §REF-ECHO — establishes the streaming mechanism used here (`app.setup({enableHttpStream:true})` + a `PassThrough`/`Readable` response body that flushes on Windows EP1).

## §CHANGESET — what differs from the B8i `theo_message` port base (diff-reviewed)
1. **v4 programming model:** `const { app } = require("@azure/functions")` + `app.setup({enableHttpStream:true})` + `app.http("theo_message_stream", {methods:["POST","OPTIONS"], authLevel:"anonymous", handler})` — replaces `module.exports = async (context, req)`. Request: `request.headers.get(...)`, `await request.text()`. Response: return `{status, headers, jsonBody}` (errors) or `{status:200, headers, body: PassThrough}` (stream). Logging: `context.error(...)`.
2. **`stream:true`** on the upstream payload (was `false`) + `Accept: text/event-stream`.
3. **SSE relay + accumulate:** open the upstream, branch on its status (JSON error vs stream); on 2xx, pipe each upstream chunk to a `PassThrough` (client) AND append to `rawAll`. `parseSseForPersistence(rawAll)` reconstructs the assistant text/citations/model/stop_reason for the DB write (thinking deltas ignored for storage).
4. **Persistence extracted to `persistTurn(...)`** (identical SQL incl. B8i `message_seq`), run on stream **end**; then emit `vault_meta`. Persistence failure is non-fatal post-stream (G-5).
5. **Pre-stream conversation ownership check** moved BEFORE the upstream call so a non-owned/absent `conversation_id` is a clean JSON 403/404 (not a mid-stream error); `persistTurn` re-checks under its transaction (defense-in-depth).
6. **Extended thinking** gated behind `THEO_THINKING_BUDGET_TOKENS` (default 0 = off; G-4).

Everything else is the B8i `theo_message` logic, unchanged.

## P6 — Repository & active-surface grounding
New package artifacts (this pack, `proposed-app/`): `src/functions/theo_message_stream.js` + `host.json` + `package.json`. `node --check` clean; the module **loads + registers** (`HTTP streaming enabled.` logged; `app.http` registration runs). The monolith repo footprint is **zero** (no file under `vaultgpt-func-premium` is touched; the monolith isn't in git anyway — only reference copies). Applied at Pass 3 by Walter deploying to `vaultgpt-func-stream`.

## P7 — Risk / regression
- **Monolith:** zero changes → zero regression to the existing non-streaming chat or any other function.
- **New endpoint additive:** nothing uses it until the FE (B9-FE) repoints — so it can't break current users.
- **Feasibility:** both gates passed on the exact target (Windows v4 on EP1 + Foundry SSE).
- **Persistence parity:** identical INSERTs to `theo_message` → a streamed turn is indistinguishable in storage; reload/history/attachments unaffected. `message_seq` linkage preserved (B8i).
- **Error handling:** pre-stream errors are clean JSON; mid-stream upstream errors emit `vault_error`; persistence failure is logged + `vault_meta {persisted:false}` (answer already delivered).
- **Cost:** shares the EP1 instance (≈$0); only heavy concurrent load would scale the plan out (shared, usage-based).
- **Thinking OFF** by default → no dependence on unverified Foundry thinking support.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) + §WALTER-AUTH open the pack; P1–P8 walked; Gap Register present (G-1/G-2/G-3 PRE-LAND; G-4/G-5/G-6/G-7 PROCEED); §CHANGESET the diff vs the port base; §H-STREAM the full handler; §HOSTJSON/§PKG the v4 app files; §REF-MESSAGE/§REF-ECHO the two Primary References (full verbatim); §DEPLOY the sidecar config + v4 deploy; §GOLDEN the streaming round-trip. Plan-only. On Codex APPROVAL, Walter completes the sidecar runtime config + deploys the handler; Claude Code runs §GOLDEN.

---

## §H-STREAM — `theo_message_stream/index` (complete; v4 streaming handler)
```js
const { app } = require("@azure/functions");
const https = require("https");
const http = require("http");
const { Pool } = require("pg");
const { PassThrough } = require("node:stream");

// HTTP streaming must be explicitly enabled in the v4 Node model (proven on Windows EP1, Gate 2).
app.setup({ enableHttpStream: true });

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

// Extended thinking (B9): OFF unless THEO_THINKING_BUDGET_TOKENS > 0 is set, AND only after the
// Foundry thinking-passthrough is verified (see VEP §GOLDEN). When enabled, the upstream stream
// includes thinking_delta events, which are relayed VERBATIM to the client (the FE renders them in
// a collapsible panel). Thinking is NOT persisted as message content (ephemeral, like Claude).
const THINKING_BUDGET = parsePositiveInt(process.env.THEO_THINKING_BUDGET_TOKENS, 0);

// History-RAG (B7b-2): embedding + Azure AI Search config. When unset, history recall is silently
// skipped (non-fatal — never breaks chat).
const EMBED_ENDPOINT = (process.env.THEO_EMBED_ENDPOINT || "").replace(/\/+$/, "");
const EMBED_DEPLOYMENT = process.env.THEO_EMBED_DEPLOYMENT;
const EMBED_API_VERSION = process.env.THEO_EMBED_API_VERSION || "2023-05-15";
const SEARCH_ENDPOINT = (process.env.THEO_SEARCH_ENDPOINT || "").replace(/\/+$/, "");
const SEARCH_INDEX = process.env.THEO_SEARCH_INDEX || "theo-messages";
const SEARCH_API_VERSION = process.env.THEO_SEARCH_API_VERSION || "2023-11-01";
const EMBED_SCOPE = "https://cognitiveservices.azure.com/.default";
const SEARCH_SCOPE = "https://search.azure.com/.default";
const HISTORY_TOP_K = parsePositiveInt(process.env.THEO_HISTORY_TOP_K, 5);
const HISTORY_QUERY_MAX_CHARS = 8000;

// Attachments (B8d): blob lives in theo-content; read via the Function's managed identity
// (Storage Blob Data Contributor). Native (PDF/image) inject as document/image content blocks;
// extract-class inject the stored extracted text. Budgets bound the upstream payload.
const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";
const ATTACH_MAX_COUNT = parsePositiveInt(process.env.THEO_ATTACH_MAX_COUNT, 10);
const ATTACH_NATIVE_BUDGET_BYTES = parsePositiveInt(process.env.THEO_ATTACH_NATIVE_BUDGET_BYTES, 14 * 1024 * 1024);
const ATTACH_EXTRACT_BUDGET_CHARS = parsePositiveInt(process.env.THEO_ATTACH_EXTRACT_BUDGET_CHARS, 200000);
const NATIVE_MEDIA_TYPES = {
  "application/pdf": "document",
  "image/png": "image",
  "image/jpeg": "image",
  "image/webp": "image",
  "image/gif": "image",
};

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

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return { error: { code, message, status, timestamp: nowIso() } };
}

// Extract the EasyAuth client principal (v4: headers is a Headers object — use .get()).
function getPrincipal(request) {
  const raw = request.headers.get("x-ms-client-principal");
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
    const lib = url.protocol === "http:" ? http : https;

    const req = lib.request(
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

// Binary HTTP GET (collects Buffer chunks; must NOT string-coerce — attachment blobs are binary).
function requestBinary(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : 443,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => { chunks.push(chunk); });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: Buffer.concat(chunks) });
        });
      }
    );
    req.on("error", reject);
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

// Client-credentials token for an arbitrary Azure resource scope (same AAD app as the gateway).
async function getAadToken(scope) {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing required AAD client-credentials configuration.");
  }
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope,
  }).toString();
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(
    tokenUrl,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } },
    form
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    throw new Error(`Token request failed for scope ${scope} (HTTP ${r.statusCode}).`);
  }
  return payload.access_token;
}

// Embed a single query string → 1536-d vector (text-embedding-3-small).
async function embedQuery(embedToken, text) {
  const body = JSON.stringify({ input: text });
  const r = await requestUrl(
    `${EMBED_ENDPOINT}/openai/deployments/${encodeURIComponent(EMBED_DEPLOYMENT)}/embeddings?api-version=${EMBED_API_VERSION}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${embedToken}`, "Content-Length": Buffer.byteLength(body) },
    },
    body
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.data) || !payload.data[0]) {
    throw new Error(`embedQuery failed (HTTP ${r.statusCode}).`);
  }
  return payload.data[0].embedding;
}

// Hybrid (vector + keyword) search over the user's OWN indexed messages. created_by filter is the
// isolation boundary; the current conversation is excluded so we recall PAST discussions only.
async function searchHistory(searchToken, queryText, queryVector, ownerOid, excludeConversationId) {
  let filter = `created_by eq '${ownerOid.replace(/'/g, "''")}'`;
  if (excludeConversationId) {
    filter += ` and conversation_id ne '${excludeConversationId.replace(/'/g, "''")}'`;
  }
  const body = JSON.stringify({
    search: queryText,
    filter,
    top: HISTORY_TOP_K,
    select: "role,content,created_at",
    vectorQueries: [{ kind: "vector", vector: queryVector, fields: "content_vector", k: HISTORY_TOP_K }],
  });
  const r = await requestUrl(
    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(SEARCH_INDEX)}/docs/search?api-version=${SEARCH_API_VERSION}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${searchToken}`, "Content-Length": Buffer.byteLength(body) },
    },
    body
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.value)) {
    throw new Error(`searchHistory failed (HTTP ${r.statusCode}).`);
  }
  return payload.value;
}

// Managed-identity token (Storage data-plane). Distinct from the AAD client-credentials app above:
// blob reads use the Function's system-assigned identity (Storage Blob Data Contributor).
async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error("Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing).");
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    throw new Error(`Managed Identity token endpoint failed (HTTP ${r.statusCode}).`);
  }
  return payload.access_token;
}

function encodeBlobPath(blobKey) {
  return blobKey.split("/").map(encodeURIComponent).join("/");
}

function blobUrlFor(blobKey) {
  return `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeBlobPath(blobKey)}`;
}

async function downloadBlobBinary(storageToken, blobKey) {
  const r = await requestBinary(blobUrlFor(blobKey), {
    method: "GET",
    headers: { Authorization: `Bearer ${storageToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`GET blob (binary) failed (HTTP ${r.statusCode}).`);
  }
  return r.body; // Buffer
}

async function downloadBlobText(storageToken, blobKey) {
  const r = await requestUrl(blobUrlFor(blobKey), {
    method: "GET",
    headers: { Authorization: `Bearer ${storageToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`GET blob (text) failed (HTTP ${r.statusCode}).`);
  }
  return r.body; // string
}

// Build Anthropic content blocks for the owned attachment rows, honouring the size/char budgets.
// Native (PDF/image) → document/image base64 block; extract-class → text block (stored extracted
// text); unreadable → a short text note. Per-attachment failures degrade to a note (never throw).
async function buildAttachmentBlocks(context, rows) {
  if (!rows.length) return [];
  let storageToken;
  try {
    storageToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  } catch (tokErr) {
    context.error("theo_message_stream: storage token for attachments failed (non-fatal)", tokErr);
    return rows.map((r) => ({ type: "text", text: `[Attached file "${r.filename}" could not be loaded.]` }));
  }

  const blocks = [];
  let nativeBytes = 0;
  let extractChars = 0;
  for (const row of rows) {
    // Honor finalize's classification — a row marked extract-class (e.g. a large PDF promoted to
    // text) injects its extracted text, not a giant document block, even though content_type is
    // application/pdf. Only non-extract rows with a native media type inject document/image blocks.
    const isExtractRow = row.ingestion_class === "extract"; // extract-class NEVER falls back to native (T13)
    const native = !isExtractRow && NATIVE_MEDIA_TYPES[row.content_type];
    try {
      if (native) {
        const buf = await downloadBlobBinary(storageToken, row.blob_path);
        if (nativeBytes + buf.length > ATTACH_NATIVE_BUDGET_BYTES) {
          blocks.push({ type: "text", text: `[Attached file "${row.filename}" omitted — exceeds the per-message attachment size budget.]` });
          continue;
        }
        nativeBytes += buf.length;
        const b64 = buf.toString("base64");
        if (native === "document") {
          blocks.push({ type: "document", source: { type: "base64", media_type: row.content_type, data: b64 } });
        } else {
          blocks.push({ type: "image", source: { type: "base64", media_type: row.content_type, data: b64 } });
        }
        blocks.push({ type: "text", text: `(above is the attached file "${row.filename}")` });
      } else if (isExtractRow && row.extracted_text_path) {
        const text = await downloadBlobText(storageToken, row.extracted_text_path);
        const remaining = ATTACH_EXTRACT_BUDGET_CHARS - extractChars;
        if (remaining <= 0) {
          blocks.push({ type: "text", text: `[Attached file "${row.filename}" omitted — exceeds the per-message extracted-text budget.]` });
          continue;
        }
        const clipped = text.length > remaining ? text.slice(0, remaining) + "\n…[truncated]" : text;
        extractChars += clipped.length;
        blocks.push({ type: "text", text: `Attached file "${row.filename}" (${row.content_type}):\n\n${clipped}` });
      } else {
        blocks.push({ type: "text", text: `[Attached file "${row.filename}" (${row.content_type}) is stored but could not be read into this message.]` });
      }
    } catch (attErr) {
      context.error(`theo_message_stream: attachment ${row.id} load failed (non-fatal)`, attErr);
      blocks.push({ type: "text", text: `[Attached file "${row.filename}" could not be loaded.]` });
    }
  }
  return blocks;
}

// Parse the accumulated upstream SSE text to reconstruct the assistant turn for persistence.
// (The raw SSE is relayed to the client verbatim; this parse is ONLY for the DB write.) Thinking
// deltas are intentionally ignored — thinking is ephemeral and not persisted as message content.
function parseSseForPersistence(raw) {
  let text = "";
  let model = null;
  let stopReason = null;
  let usage = null;
  const citations = [];
  for (const ev of raw.split("\n\n")) {
    const dataLine = ev.split("\n").find((l) => l.startsWith("data:"));
    if (!dataLine) continue;
    const json = parseJsonSafe(dataLine.slice(5).trim());
    if (!json || typeof json.type !== "string") continue;
    if (json.type === "message_start" && json.message && typeof json.message.model === "string") {
      model = json.message.model;
    } else if (json.type === "content_block_delta" && json.delta) {
      if (json.delta.type === "text_delta" && typeof json.delta.text === "string") {
        text += json.delta.text;
      } else if (json.delta.type === "citations_delta" && json.delta.citation) {
        citations.push(json.delta.citation);
      }
    } else if (json.type === "message_delta") {
      if (json.delta && json.delta.stop_reason != null) stopReason = json.delta.stop_reason;
      if (json.usage != null) usage = json.usage;
    }
  }
  return { text, citations, model, stopReason, usage };
}

// Persist the completed turn (HF-T2; explicit created_by ownership; shared vaultgpt instance).
// Mirrors theo_message's persistence EXACTLY (incl. B8i message_seq linkage). Returns conversationId.
async function persistTurn(opts) {
  const { oid, requestedConversationId, appKey, appContext, userText, attachmentIds, acc } = opts;
  const assistantModel = acc.model || FOUNDRY_DEPLOYMENT;
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

    let conversationId = requestedConversationId;
    if (conversationId) {
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

    // B8i: link the sent attachments to this conversation AND to the user-turn seq (owner-scoped;
    // only when not already linked) so a reloaded thread surfaces chips on the matching message.
    if (attachmentIds.length > 0) {
      await client.query(
        `
        UPDATE public.theo_attachments
        SET conversation_id = $1, message_seq = $2
        WHERE id = ANY($3::uuid[]) AND created_by = $4 AND conversation_id IS NULL
        `,
        [conversationId, baseSeq, attachmentIds, oid]
      );
    }

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
        acc.text,
        assistantModel,
        acc.citations.length ? JSON.stringify(acc.citations) : null,
      ]
    );

    await client.query(
      `UPDATE public.theo_conversations SET updated_at = now() WHERE id = $1 AND created_by = $2`,
      [conversationId, oid]
    );

    await client.query("COMMIT");
    return conversationId;
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
}

app.http("theo_message_stream", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const jsonErr = (status, code, message) => ({
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      jsonBody: errorBody(code, message, status),
    });

    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    const principal = getPrincipal(request);
    const oid = getClaimValue(principal, [
      "http://schemas.microsoft.com/identity/claims/objectidentifier",
      "oid",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    ]);
    if (!oid) return jsonErr(401, "UNAUTHORIZED", "Missing or invalid EasyAuth identity.");
    if (!FOUNDRY_BASE || !FOUNDRY_DEPLOYMENT) {
      context.error("theo_message_stream: missing gateway configuration");
      return jsonErr(500, "INTERNAL_SERVER_ERROR", "Model gateway is not configured.");
    }

    let body;
    try {
      body = JSON.parse((await request.text()) || "{}");
    } catch {
      return jsonErr(400, "BAD_REQUEST", "Request body is not valid JSON.");
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonErr(400, "BAD_REQUEST", "Field 'messages' must be a non-empty array.");
    }

    let maxTokens = Number.isInteger(body.max_tokens) ? body.max_tokens : DEFAULT_MAX_TOKENS;
    const systemPrompt = typeof body.system === "string" ? body.system : null;

    const requestedConversationId =
      typeof body.conversation_id === "string" && body.conversation_id.trim() !== ""
        ? body.conversation_id.trim()
        : null;
    const appKey =
      typeof body.app_key === "string" && body.app_key.trim() !== "" ? body.app_key.trim() : null;
    const appContext =
      body.app_context != null && typeof body.app_context === "object" ? body.app_context : null;

    const lastUserIndex = (() => {
      for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i];
        if (m && m.role === "user" && typeof m.content === "string") return i;
      }
      return -1;
    })();
    const userText = lastUserIndex >= 0 ? messages[lastUserIndex].content : "";

    if (requestedConversationId !== null && !isUuid(requestedConversationId)) {
      return jsonErr(400, "BAD_REQUEST", "Field 'conversation_id' must be a valid UUID.");
    }

    let attachmentIds = [];
    if (body.attachment_ids != null) {
      if (!Array.isArray(body.attachment_ids)) {
        return jsonErr(400, "BAD_REQUEST", "Field 'attachment_ids' must be an array of UUIDs.");
      }
      attachmentIds = [...new Set(body.attachment_ids)];
      if (attachmentIds.length > ATTACH_MAX_COUNT) {
        return jsonErr(400, "BAD_REQUEST", `At most ${ATTACH_MAX_COUNT} attachments may be sent per message.`);
      }
      if (!attachmentIds.every((id) => isUuid(id))) {
        return jsonErr(400, "BAD_REQUEST", "Every entry in 'attachment_ids' must be a valid UUID.");
      }
      if (attachmentIds.length > 0 && lastUserIndex < 0) {
        return jsonErr(400, "BAD_REQUEST", "Attachments require a user message with text content.");
      }
    }

    // ---- Memory injection (B7): prepend the user's distilled memory profile to the system prompt ----
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
        context.error("theo_message_stream: memory fetch failed (non-fatal)", memErr);
      } finally {
        if (memClient) {
          memClient.release();
        }
      }
    }

    // ---- History-RAG injection (B7b-2): recall relevant excerpts from the user's PAST conversations ----
    let historyBlock = "";
    if (EMBED_ENDPOINT && EMBED_DEPLOYMENT && SEARCH_ENDPOINT && userText.trim() !== "") {
      try {
        const [embedToken, searchToken] = await Promise.all([getAadToken(EMBED_SCOPE), getAadToken(SEARCH_SCOPE)]);
        const queryVector = await embedQuery(embedToken, userText.slice(0, HISTORY_QUERY_MAX_CHARS));
        const hits = await searchHistory(searchToken, userText.slice(0, HISTORY_QUERY_MAX_CHARS), queryVector, oid, requestedConversationId);
        const lines = hits
          .map((h) => (typeof h.content === "string" ? h.content.trim() : ""))
          .filter((c) => c !== "")
          .map((c) => `- ${c.slice(0, 500)}`);
        if (lines.length > 0) {
          historyBlock =
            "Relevant excerpts from this user's earlier conversations (context only; may be unrelated — use if helpful, do not assume continuity):\n" +
            lines.join("\n");
        }
      } catch (histErr) {
        context.error("theo_message_stream: history-RAG retrieval failed (non-fatal)", histErr);
      }
    }

    const effectiveSystem =
      [memoryBlock, historyBlock, systemPrompt].filter((s) => typeof s === "string" && s.trim() !== "").join("\n\n") || null;

    // ---- Attachments: fetch OWNED rows + assemble blocks; strict ownership (404 on any missing) ----
    let attachmentRows = [];
    try {
      if (attachmentIds.length > 0) {
        const attClient = await pool.connect();
        try {
          await attClient.query(
            `
            SELECT
              set_config('app.current_user_id', $1, false),
              set_config('request.jwt.claim.sub', $1, false),
              set_config('request.jwt.claim.oid', $1, false)
            `,
            [oid]
          );
          const res = await attClient.query(
            `
            SELECT id, filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path
            FROM public.theo_attachments
            WHERE id = ANY($1::uuid[]) AND created_by = $2
            `,
            [attachmentIds, oid]
          );
          attachmentRows = res.rows;
        } finally {
          attClient.release();
        }
        if (attachmentRows.length !== attachmentIds.length) {
          return jsonErr(404, "NOT_FOUND", "One or more attachments were not found.");
        }
        const orderById = new Map(attachmentIds.map((id, i) => [id, i]));
        attachmentRows.sort((a, b) => orderById.get(a.id) - orderById.get(b.id));
      }
    } catch (attErr) {
      context.error("theo_message_stream: attachment fetch failed", attErr);
      return jsonErr(500, "INTERNAL_SERVER_ERROR", "Failed to load attachments.");
    }

    // ---- Pre-stream conversation ownership check (so a non-owned id is a clean JSON 403/404, not a
    // mid-stream error). Persistence re-checks under the transaction as defense-in-depth. ----
    if (requestedConversationId) {
      let chkClient = null;
      try {
        chkClient = await pool.connect();
        await chkClient.query(
          `
          SELECT
            set_config('app.current_user_id', $1, false),
            set_config('request.jwt.claim.sub', $1, false),
            set_config('request.jwt.claim.oid', $1, false)
          `,
          [oid]
        );
        const owned = await chkClient.query(
          `SELECT id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
          [requestedConversationId, oid]
        );
        if (owned.rowCount === 0) {
          const existsResult = await chkClient.query(
            `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
            [requestedConversationId]
          );
          const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
          return exists
            ? jsonErr(403, "FORBIDDEN", "You do not have access to this conversation.")
            : jsonErr(404, "NOT_FOUND", "Conversation not found.");
        }
      } catch (chkErr) {
        context.error("theo_message_stream: conversation ownership check failed", chkErr);
        return jsonErr(500, "INTERNAL_SERVER_ERROR", "Failed to verify the conversation.");
      } finally {
        if (chkClient) chkClient.release();
      }
    }

    const attachmentBlocks = await buildAttachmentBlocks(context, attachmentRows);

    let messagesForUpstream = messages;
    if (attachmentBlocks.length > 0 && lastUserIndex >= 0) {
      messagesForUpstream = messages.map((m, i) => {
        if (i !== lastUserIndex) return m;
        return {
          ...m,
          content: [...attachmentBlocks, { type: "text", text: userText }],
        };
      });
    }

    // ---- Open the upstream Foundry stream; decide JSON-error vs stream from the response status ----
    let token;
    try {
      token = await getFoundryToken();
    } catch (e) {
      return jsonErr(e.status || 500, e.code || "INTERNAL_SERVER_ERROR", e.message || "Model gateway token failed.");
    }

    if (THINKING_BUDGET > 0 && maxTokens <= THINKING_BUDGET) {
      maxTokens = THINKING_BUDGET + 1024; // Anthropic requires max_tokens > thinking budget
    }
    const upstreamPayload = JSON.stringify({
      model: FOUNDRY_DEPLOYMENT,
      max_tokens: maxTokens,
      ...(effectiveSystem ? { system: effectiveSystem } : {}),
      messages: messagesForUpstream,
      tools: buildGroundingTools(),
      stream: true,
      ...(THINKING_BUDGET > 0 ? { thinking: { type: "enabled", budget_tokens: THINKING_BUDGET } } : {}),
    });

    const upstreamRes = await new Promise((resolve) => {
      const u = new URL(`${FOUNDRY_BASE}/anthropic/v1/messages`);
      const lib = u.protocol === "http:" ? http : https;
      const r = lib.request(
        {
          method: "POST",
          hostname: u.hostname,
          port: u.port ? Number(u.port) : 443,
          path: u.pathname + u.search,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "anthropic-version": ANTHROPIC_VERSION,
            "anthropic-beta": WEB_FETCH_BETA,
            "Content-Length": Buffer.byteLength(upstreamPayload),
            Accept: "text/event-stream",
          },
        },
        (res) => resolve(res)
      );
      r.on("error", (e) => {
        context.error("theo_message_stream: upstream connect failed", e);
        resolve(null);
      });
      r.write(upstreamPayload);
      r.end();
    });

    if (!upstreamRes) {
      return jsonErr(502, "BAD_GATEWAY", "Model gateway call failed.");
    }
    if (upstreamRes.statusCode < 200 || upstreamRes.statusCode >= 300) {
      const errText = await new Promise((res) => {
        let d = "";
        upstreamRes.setEncoding("utf8");
        upstreamRes.on("data", (c) => { d += c; });
        upstreamRes.on("end", () => res(d));
        upstreamRes.on("error", () => res(d));
      });
      context.error("theo_message_stream: gateway non-2xx", upstreamRes.statusCode, errText.slice(0, 300));
      if (upstreamRes.statusCode === 429) {
        return jsonErr(429, "RATE_LIMITED", "Model gateway rate limit exceeded.");
      }
      return jsonErr(502, "BAD_GATEWAY", "Model gateway call failed.");
    }

    // ---- 2xx → stream. Relay upstream SSE verbatim to the client AND accumulate for persistence. ----
    const stream = new PassThrough();
    let rawAll = "";
    upstreamRes.setEncoding("utf8");
    upstreamRes.on("data", (chunk) => {
      rawAll += chunk;
      stream.write(chunk);
    });
    upstreamRes.on("end", async () => {
      let conversationId = null;
      try {
        const acc = parseSseForPersistence(rawAll);
        conversationId = await persistTurn({
          oid, requestedConversationId, appKey, appContext, userText, attachmentIds, acc,
        });
        // Emit a final app-level event so the FE learns the (possibly new) conversation id.
        stream.write(`event: vault_meta\ndata: ${JSON.stringify({ conversation_id: conversationId, model: acc.model || FOUNDRY_DEPLOYMENT })}\n\n`);
      } catch (perr) {
        // The answer was already streamed to the user; a persistence failure must not crash the
        // response — log it and tell the FE the turn was not saved (it just won't appear in history).
        context.error("theo_message_stream: persistence failed (answer already streamed)", perr);
        stream.write(`event: vault_meta\ndata: ${JSON.stringify({ conversation_id: null, persisted: false })}\n\n`);
      } finally {
        stream.end();
      }
    });
    upstreamRes.on("error", (e) => {
      context.error("theo_message_stream: upstream stream error", e);
      try { stream.write(`event: vault_error\ndata: ${JSON.stringify({ message: "The model stream was interrupted." })}\n\n`); } catch {}
      stream.end();
    });

    return {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
      body: stream,
    };
  },
});
```

## §HOSTJSON — `host.json` (sidecar)
```json
{
  "version": "2.0",
  "logging": { "applicationInsights": { "samplingSettings": { "isEnabled": true, "excludedTypes": "Request" } } },
  "extensionBundle": { "id": "Microsoft.Azure.Functions.ExtensionBundle", "version": "[4.*, 5.0.0)" }
}
```

## §PKG — `package.json` (sidecar)
```json
{
  "name": "vaultgpt-func-stream",
  "version": "1.0.0",
  "description": "Theo streaming sidecar — theo_message_stream (v4 model, SSE relay of Foundry-Claude).",
  "main": "src/functions/*.js",
  "dependencies": {
    "@azure/functions": "^4.5.0",
    "pg": "^8.11.0"
  }
}
```

## §REF-MESSAGE — Primary Reference (1/2): deployed B8i `theo_message/index.js` (full verbatim; the ported logic — T9)
```js
const https = require("https");
const http = require("http");
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

// History-RAG (B7b-2): embedding + Azure AI Search config. When unset, history recall is silently
// skipped (non-fatal — never breaks chat).
const EMBED_ENDPOINT = (process.env.THEO_EMBED_ENDPOINT || "").replace(/\/+$/, "");
const EMBED_DEPLOYMENT = process.env.THEO_EMBED_DEPLOYMENT;
const EMBED_API_VERSION = process.env.THEO_EMBED_API_VERSION || "2023-05-15";
const SEARCH_ENDPOINT = (process.env.THEO_SEARCH_ENDPOINT || "").replace(/\/+$/, "");
const SEARCH_INDEX = process.env.THEO_SEARCH_INDEX || "theo-messages";
const SEARCH_API_VERSION = process.env.THEO_SEARCH_API_VERSION || "2023-11-01";
const EMBED_SCOPE = "https://cognitiveservices.azure.com/.default";
const SEARCH_SCOPE = "https://search.azure.com/.default";
const HISTORY_TOP_K = parsePositiveInt(process.env.THEO_HISTORY_TOP_K, 5);
const HISTORY_QUERY_MAX_CHARS = 8000;

// Attachments (B8d): blob lives in theo-content; read via the Function's managed identity
// (Storage Blob Data Contributor, granted in B8b). Native (PDF/image) inject as document/image
// content blocks; extract-class inject the stored extracted text. Budgets bound the upstream payload.
const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";
const ATTACH_MAX_COUNT = parsePositiveInt(process.env.THEO_ATTACH_MAX_COUNT, 10);
const ATTACH_NATIVE_BUDGET_BYTES = parsePositiveInt(process.env.THEO_ATTACH_NATIVE_BUDGET_BYTES, 14 * 1024 * 1024);
const ATTACH_EXTRACT_BUDGET_CHARS = parsePositiveInt(process.env.THEO_ATTACH_EXTRACT_BUDGET_CHARS, 200000);
const NATIVE_MEDIA_TYPES = {
  "application/pdf": "document",
  "image/png": "image",
  "image/jpeg": "image",
  "image/webp": "image",
  "image/gif": "image",
};

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
    const lib = url.protocol === "http:" ? http : https;

    const req = lib.request(
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

// Binary HTTP GET (collects Buffer chunks; must NOT string-coerce — attachment blobs are binary).
function requestBinary(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : 443,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => { chunks.push(chunk); });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: Buffer.concat(chunks) });
        });
      }
    );
    req.on("error", reject);
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

// Client-credentials token for an arbitrary Azure resource scope (same AAD app as the gateway).
async function getAadToken(scope) {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing required AAD client-credentials configuration.");
  }
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope,
  }).toString();
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(
    tokenUrl,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } },
    form
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    throw new Error(`Token request failed for scope ${scope} (HTTP ${r.statusCode}).`);
  }
  return payload.access_token;
}

// Embed a single query string → 1536-d vector (text-embedding-3-small).
async function embedQuery(embedToken, text) {
  const body = JSON.stringify({ input: text });
  const r = await requestUrl(
    `${EMBED_ENDPOINT}/openai/deployments/${encodeURIComponent(EMBED_DEPLOYMENT)}/embeddings?api-version=${EMBED_API_VERSION}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${embedToken}`, "Content-Length": Buffer.byteLength(body) },
    },
    body
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.data) || !payload.data[0]) {
    throw new Error(`embedQuery failed (HTTP ${r.statusCode}).`);
  }
  return payload.data[0].embedding;
}

// Hybrid (vector + keyword) search over the user's OWN indexed messages. created_by filter is the
// isolation boundary; the current conversation is excluded so we recall PAST discussions only.
async function searchHistory(searchToken, queryText, queryVector, ownerOid, excludeConversationId) {
  let filter = `created_by eq '${ownerOid.replace(/'/g, "''")}'`;
  if (excludeConversationId) {
    filter += ` and conversation_id ne '${excludeConversationId.replace(/'/g, "''")}'`;
  }
  const body = JSON.stringify({
    search: queryText,
    filter,
    top: HISTORY_TOP_K,
    select: "role,content,created_at",
    vectorQueries: [{ kind: "vector", vector: queryVector, fields: "content_vector", k: HISTORY_TOP_K }],
  });
  const r = await requestUrl(
    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(SEARCH_INDEX)}/docs/search?api-version=${SEARCH_API_VERSION}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${searchToken}`, "Content-Length": Buffer.byteLength(body) },
    },
    body
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.value)) {
    throw new Error(`searchHistory failed (HTTP ${r.statusCode}).`);
  }
  return payload.value;
}

// Managed-identity token (Storage data-plane). Distinct from the AAD client-credentials app above:
// blob reads use the Function's system-assigned identity (Storage Blob Data Contributor, B8b).
async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error("Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing).");
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    throw new Error(`Managed Identity token endpoint failed (HTTP ${r.statusCode}).`);
  }
  return payload.access_token;
}

function encodeBlobPath(blobKey) {
  return blobKey.split("/").map(encodeURIComponent).join("/");
}

function blobUrlFor(blobKey) {
  return `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeBlobPath(blobKey)}`;
}

async function downloadBlobBinary(storageToken, blobKey) {
  const r = await requestBinary(blobUrlFor(blobKey), {
    method: "GET",
    headers: { Authorization: `Bearer ${storageToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`GET blob (binary) failed (HTTP ${r.statusCode}).`);
  }
  return r.body; // Buffer
}

async function downloadBlobText(storageToken, blobKey) {
  const r = await requestUrl(blobUrlFor(blobKey), {
    method: "GET",
    headers: { Authorization: `Bearer ${storageToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`GET blob (text) failed (HTTP ${r.statusCode}).`);
  }
  return r.body; // string
}

// Build Anthropic content blocks for the owned attachment rows, honouring the size/char budgets.
// Native (PDF/image) → document/image base64 block; extract-class → text block (stored extracted
// text); unreadable → a short text note. Per-attachment failures degrade to a note (never throw).
async function buildAttachmentBlocks(context, rows) {
  if (!rows.length) return [];
  let storageToken;
  try {
    storageToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  } catch (tokErr) {
    context.log.error("theo_message: storage token for attachments failed (non-fatal)", tokErr);
    return rows.map((r) => ({ type: "text", text: `[Attached file "${r.filename}" could not be loaded.]` }));
  }

  const blocks = [];
  let nativeBytes = 0;
  let extractChars = 0;
  for (const row of rows) {
    // B8f: honor finalize's classification — a row marked extract-class (e.g. a large PDF promoted
    // to text) injects its extracted text, not a giant document block, even though content_type is
    // application/pdf. Only non-extract rows with a native media type inject document/image blocks.
    const isExtractRow = row.ingestion_class === "extract"; // extract-class NEVER falls back to native (T13)
    const native = !isExtractRow && NATIVE_MEDIA_TYPES[row.content_type];
    try {
      if (native) {
        const buf = await downloadBlobBinary(storageToken, row.blob_path);
        if (nativeBytes + buf.length > ATTACH_NATIVE_BUDGET_BYTES) {
          blocks.push({ type: "text", text: `[Attached file "${row.filename}" omitted — exceeds the per-message attachment size budget.]` });
          continue;
        }
        nativeBytes += buf.length;
        const b64 = buf.toString("base64");
        if (native === "document") {
          blocks.push({ type: "document", source: { type: "base64", media_type: row.content_type, data: b64 } });
        } else {
          blocks.push({ type: "image", source: { type: "base64", media_type: row.content_type, data: b64 } });
        }
        blocks.push({ type: "text", text: `(above is the attached file "${row.filename}")` });
      } else if (isExtractRow && row.extracted_text_path) {
        const text = await downloadBlobText(storageToken, row.extracted_text_path);
        const remaining = ATTACH_EXTRACT_BUDGET_CHARS - extractChars;
        if (remaining <= 0) {
          blocks.push({ type: "text", text: `[Attached file "${row.filename}" omitted — exceeds the per-message extracted-text budget.]` });
          continue;
        }
        const clipped = text.length > remaining ? text.slice(0, remaining) + "\n…[truncated]" : text;
        extractChars += clipped.length;
        blocks.push({ type: "text", text: `Attached file "${row.filename}" (${row.content_type}):\n\n${clipped}` });
      } else {
        blocks.push({ type: "text", text: `[Attached file "${row.filename}" (${row.content_type}) is stored but could not be read into this message.]` });
      }
    } catch (attErr) {
      context.log.error(`theo_message: attachment ${row.id} load failed (non-fatal)`, attErr);
      blocks.push({ type: "text", text: `[Attached file "${row.filename}" could not be loaded.]` });
    }
  }
  return blocks;
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
  // The client sends the user turn as a STRING in messages[] AND any attachment_ids as a SEPARATE
  // top-level field — so userText (persistence/title/history-query) derivation is unchanged; the
  // attachment content blocks are assembled server-side for the upstream payload only.
  const lastUserIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m && m.role === "user" && typeof m.content === "string") return i;
    }
    return -1;
  })();
  const userText = lastUserIndex >= 0 ? messages[lastUserIndex].content : "";

  if (requestedConversationId !== null && !isUuid(requestedConversationId)) {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Field 'conversation_id' must be a valid UUID.", 400)
    );
  }

  // B8d: validate attachment_ids (optional; array of unique UUIDs, capped count).
  let attachmentIds = [];
  if (body.attachment_ids != null) {
    if (!Array.isArray(body.attachment_ids)) {
      return send(context, 400, errorBody("BAD_REQUEST", "Field 'attachment_ids' must be an array of UUIDs.", 400));
    }
    attachmentIds = [...new Set(body.attachment_ids)];
    if (attachmentIds.length > ATTACH_MAX_COUNT) {
      return send(context, 400, errorBody("BAD_REQUEST", `At most ${ATTACH_MAX_COUNT} attachments may be sent per message.`, 400));
    }
    if (!attachmentIds.every((id) => isUuid(id))) {
      return send(context, 400, errorBody("BAD_REQUEST", "Every entry in 'attachment_ids' must be a valid UUID.", 400));
    }
    if (attachmentIds.length > 0 && lastUserIndex < 0) {
      return send(context, 400, errorBody("BAD_REQUEST", "Attachments require a user message with text content.", 400));
    }
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
  // ---- History-RAG injection (B7b-2): recall relevant excerpts from the user's PAST conversations ----
  // Non-fatal + user-scoped (created_by filter is the isolation boundary). Skipped silently if the
  // embedding/search config is absent or the index is empty. The current conversation is excluded.
  let historyBlock = "";
  if (EMBED_ENDPOINT && EMBED_DEPLOYMENT && SEARCH_ENDPOINT && userText.trim() !== "") {
    try {
      const [embedToken, searchToken] = await Promise.all([getAadToken(EMBED_SCOPE), getAadToken(SEARCH_SCOPE)]);
      const queryVector = await embedQuery(embedToken, userText.slice(0, HISTORY_QUERY_MAX_CHARS));
      const hits = await searchHistory(searchToken, userText.slice(0, HISTORY_QUERY_MAX_CHARS), queryVector, oid, requestedConversationId);
      const lines = hits
        .map((h) => (typeof h.content === "string" ? h.content.trim() : ""))
        .filter((c) => c !== "")
        .map((c) => `- ${c.slice(0, 500)}`);
      if (lines.length > 0) {
        historyBlock =
          "Relevant excerpts from this user's earlier conversations (context only; may be unrelated — use if helpful, do not assume continuity):\n" +
          lines.join("\n");
      }
    } catch (histErr) {
      context.log.error("theo_message: history-RAG retrieval failed (non-fatal)", histErr);
    }
  }

  const effectiveSystem =
    [memoryBlock, historyBlock, systemPrompt].filter((s) => typeof s === "string" && s.trim() !== "").join("\n\n") || null;

  let client = null;
  try {
    // ---- B8d: fetch the OWNED attachment rows + assemble content blocks (before the upstream call) ----
    // Owner-scoped (explicit created_by); any requested id not owned/found → 404 (no leakage).
    // Building the blocks (blob reads) is degrade-on-error; the ownership check is strict.
    let attachmentRows = [];
    if (attachmentIds.length > 0) {
      const attClient = await pool.connect();
      try {
        await attClient.query(
          `
          SELECT
            set_config('app.current_user_id', $1, false),
            set_config('request.jwt.claim.sub', $1, false),
            set_config('request.jwt.claim.oid', $1, false)
          `,
          [oid]
        );
        const res = await attClient.query(
          `
          SELECT id, filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path
          FROM public.theo_attachments
          WHERE id = ANY($1::uuid[]) AND created_by = $2
          `,
          [attachmentIds, oid]
        );
        attachmentRows = res.rows;
      } finally {
        attClient.release();
      }
      if (attachmentRows.length !== attachmentIds.length) {
        throw buildKnownError("NOT_FOUND", "One or more attachments were not found.", 404);
      }
      // Preserve the caller's attachment order.
      const orderById = new Map(attachmentIds.map((id, i) => [id, i]));
      attachmentRows.sort((a, b) => orderById.get(a.id) - orderById.get(b.id));
    }

    const attachmentBlocks = await buildAttachmentBlocks(context, attachmentRows);

    // Build the upstream messages. When attachments are present, the last user message's string
    // content becomes a block array: [ ...attachmentBlocks, { type:"text", text: <original text> } ].
    // When absent, the messages array is sent UNCHANGED (byte-for-byte the deployed behaviour).
    let messagesForUpstream = messages;
    if (attachmentBlocks.length > 0 && lastUserIndex >= 0) {
      messagesForUpstream = messages.map((m, i) => {
        if (i !== lastUserIndex) return m;
        return {
          ...m,
          content: [...attachmentBlocks, { type: "text", text: userText }],
        };
      });
    }

    const token = await getFoundryToken();

    const upstreamPayload = JSON.stringify({
      model: FOUNDRY_DEPLOYMENT,
      max_tokens: maxTokens,
      ...(effectiveSystem ? { system: effectiveSystem } : {}),
      messages: messagesForUpstream,
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

    // B8i: link the sent attachments to this conversation AND to the user-turn seq (owner-scoped;
    // only when not already linked) so a reloaded thread surfaces chips on the matching message.
    if (attachmentIds.length > 0) {
      await client.query(
        `
        UPDATE public.theo_attachments
        SET conversation_id = $1, message_seq = $2
        WHERE id = ANY($3::uuid[]) AND created_by = $4 AND conversation_id IS NULL
        `,
        [conversationId, baseSeq, attachmentIds, oid]
      );
    }

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

## §REF-ECHO — Primary Reference (2/2): the Gate-2-proven v4 streaming echo (full verbatim; the streaming mechanism — T9)
```js
const { app } = require("@azure/functions");
const { Readable } = require("node:stream");

// HTTP streaming must be explicitly enabled in the v4 Node model.
app.setup({ enableHttpStream: true });

// Gate-2 probe: emit one SSE "tick" every 300ms for 20 ticks (~6s). Each line carries the
// server-side timestamp so we can see when the platform actually flushed it. Anonymous = curl-able.
app.http("echostream", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const stream = new Readable({ read() {} });
    let i = 1;
    const id = setInterval(() => {
      stream.push(`data: tick ${i} @${Date.now()}\n\n`);
      if (++i > 20) { clearInterval(id); stream.push(null); }
    }, 300);
    return {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "X-Accel-Buffering": "no" },
      body: stream,
    };
  },
});
```

## §DEPLOY — Walter deploy steps (sidecar `vaultgpt-func-stream`, on the existing EP1 plan)
1. **Identity:** System-assigned managed identity → On. Grant it **`Storage Blob Data Contributor` on `vaultgptstorage01`**.
2. **App settings:** copy from the monolith — `THEO_FOUNDRY_BASE`, `THEO_FOUNDRY_DEPLOYMENT`, `AAD_TENANT_ID`, `AAD_CLIENT_ID`, `AAD_CLIENT_SECRET`, `POSTGRES_CONNECTION_STRING`, `THEO_BLOB_ACCOUNT`, `THEO_BLOB_CONTAINER`; optional for full parity: `THEO_EMBED_ENDPOINT`/`THEO_EMBED_DEPLOYMENT`/`THEO_EMBED_API_VERSION`, `THEO_SEARCH_ENDPOINT`/`THEO_SEARCH_INDEX`/`THEO_SEARCH_API_VERSION`, `THEO_HISTORY_TOP_K`, `THEO_WEB_*`. Leave `THEO_THINKING_BUDGET_TOKENS` UNSET (thinking off until verified).
3. **Easy-Auth:** Authentication → add the **same Microsoft Entra app** the monolith uses (audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`).
4. **CORS:** add the SWA origin(s), no trailing slash.
5. **Deploy the handler:** zip-deploy `theo_message_stream` (§H-STREAM) + `host.json` (§HOSTJSON) + `package.json` (§PKG) with `node_modules` included (Windows, no remote build) — e.g. Cloud Shell `az functionapp deployment source config-zip -g Vault-Tax -n vaultgpt-func-stream --src <zip>`.
6. Reply "B9 deployed" → Claude Code runs §GOLDEN.

## §GOLDEN — golden-curl round-trip (Claude Code, post-deploy; token via `az`, never printed)
1. **stream a new chat:** `POST …/api/theo_message_stream` (Bearer user token) with a simple prompt → **HTTP 200 `text/event-stream`**, Anthropic deltas arrive incrementally (timing probe shows spread), terminated by `event: vault_meta` carrying a `conversation_id`.
2. **persistence parity:** `GET …/api/theo_get_conversation?conversationId=<that id>` (on the monolith) → the user + assistant turns are present with the streamed text + any citations.
3. **append to existing conversation:** stream a 2nd message with `conversation_id` → 200 stream; the thread now has 4 turns; `message_seq` continuity intact.
4. **attachment streaming:** upload an attachment (B8b/B8c on the monolith) → stream with `attachment_ids` → answer grounded in it; chip linkage (`message_seq`) verified via `theo_list_conversation_attachments`.
5. **negatives:** non-owned `conversation_id` → JSON 403/404 (no stream); bad uuid → 400; missing identity → 401.
6. **(deferred)** thinking: only after the Foundry thinking-passthrough check (G-4). Evidence under `.local/`.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B9 Streaming Pass-1 Backend VEP (plan only).*
