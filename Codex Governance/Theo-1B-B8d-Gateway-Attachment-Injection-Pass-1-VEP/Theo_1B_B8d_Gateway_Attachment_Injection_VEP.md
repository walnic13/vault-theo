# Theo 1B — B8d Gateway Attachment Injection (`theo_message`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handler for Walter to redeploy `theo_message` at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier **B8d (gateway injection)** — the payoff. Extends the **deployed** `theo_message` (B7b-2: persistence + memory + history-RAG + web grounding) to accept an optional top-level `attachment_ids` array. For each **owner-scoped** attachment it injects, into the last user message's content sent **upstream only**, either a **native** PDF/image `document`/`image` base64 content block or the **extracted text** (read from `extracted_text_path`), token/size-budgeted. Blob reads use the Function's **managed identity** (Storage Blob Data Contributor, in place since B8b) — an EXACT mirror of the deployed B8b/B8c blob helpers (no new-domain helper). **Purely additive:** when `attachment_ids` is absent the upstream payload is byte-for-byte the deployed behaviour; persistence, RLS, memory, history-RAG, grounding, and citations are unchanged. After this, only the FE composer (B8e) remains.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `32592bab5c46430c6ebcf92e84536398d411558a` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference handler (Golden §2) = the **deployed** `theo_message` (B7b-2; blob `4eb4ed62`) — this microstep extends it; inlined verbatim §SM + its function.json §SM-FJ (blob `bd476fc8`). The change is **additive** (verified by diff, §CHANGESET): new attachment constants, `requestBinary`, the managed-identity blob-read helpers (`getManagedIdentityAccessToken`/`encodeBlobPath`/`downloadBlobBinary`/`downloadBlobText`) which **EXACTLY mirror the deployed B8b/B8c handlers** (Golden §3 — no new-domain helper / no Walter authorization needed), `buildAttachmentBlocks`, `attachment_ids` validation, the owner-scoped attachment fetch + block assembly, `messages → messagesForUpstream` (a no-op when no attachments), and an owner-scoped attachment→conversation linkage. The only edit to existing logic is `lastUser`→`lastUserIndex` (behaviour-identical `userText`, needed to target the message for upstream injection). Document/image blocks ride the existing Foundry Messages call (`anthropic-version: 2023-06-01`; capability golden-curl-verified — no extra beta). `attachment_ids` is a **separate top-level field** (not array content in `messages[]`), so `userText`/title/history-query/persistence derivation is unchanged — the array-content path exists only in the upstream payload. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 EXACT-mirror helper; §6 HF-T1/HF-T5) | `Grep("EXACT mirror against a deployed handler")` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B8 B8d) | `Grep("gateway integration")` this turn | `ebdf4d73306190ab5b44f61fb2db08932b1f3638` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§2.3 HF-T1; §5.2 ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis (1/2)** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 gateway; §2.8 read path) | `Grep("§2.8 Attachments")` this turn | `f5eea60a0010822671f05da75b78ba90179afc83` |
| 9 | **Contract basis (2/2)** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§7 `theo_attachments`; the B8c `ingestion_class`/`extracted_text_path` columns are deployed + RO-verified, schema-doc refresh pending Codex) | `Grep("theo_attachments")` this turn | `0936b75e47c9f9d48876acbebc2f0d8f750b012b` |
| 10 | **Primary Reference handler** (artifact extended) — `Codex Governance/Theo-1B-B7b2-History-RAG-Retrieval-Pass-1-VEP/theo_message.index.js` | `Read(full)` this turn | `4eb4ed62adda8c8f83fcbb0d251b4d7cb62df9cf` |
| 11 | **Primary Reference function.json** — `api/theo_message/function.json` | `Read(full)` this turn | `bd476fc8d144ed9592b561b4c0ded84f5911cff0` |
| 12 | **EXACT-mirror precedent for the MI blob helpers** — deployed B8c finalize — `Codex Governance/Theo-1B-B8c-Attachment-Extraction-Pass-1-VEP/theo_finalize_attachment.index.js` | `Read(full)` this turn | `b829d98d0ad93e03f61f6ef56199c92f9d80b37c` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting`/`axis` change. No write SQL executed (plan only). No schema change (B8c addendum already deployed). Token bytes never printed in any golden curl.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B8 | "gateway integration" | §P1 / §H — B8d attachment injection |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "an EXACT mirror against a deployed handler containing that helper" | §CHANGESET — MI blob helpers mirror deployed B8b/B8c |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §7 | "theo_attachments" | §H — attachment fetch over the deployed `theo_attachments` table; extract-class reads `extracted_text_path` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §H — attachment fetch is explicit `created_by`-scoped |

---

## P1 — Feature identification
**Microstep:** Tier **B8d** (Plan Tier B8, "gateway integration") — the step that puts uploaded files in front of Claude. `theo_message` accepts an optional `attachment_ids` array; each **owned** attachment is injected into the upstream user turn as a native PDF/image content block (base64) or its extracted text. This completes the read path: a user can attach a K-1 / TB / workpaper and ask Theo about it. The FE composer (B8e) is the only remaining microstep.

## P2 — Architecture & boundary reconciliation
- **Extends the deployed gateway (EXACT base + additive delta).** The B7b-2 `theo_message` (Primary Reference §SM) is preserved through auth, config checks, body parse, memory injection, history-RAG injection, the Foundry call, response shaping, persistence, ownership checks, and error mapping. The additions (§CHANGESET) never alter those paths.
- **`attachment_ids` is a separate top-level field** (not array content in `messages[]`). So `userText` (persistence/title/history-query) derivation is unchanged; the document/image/text block array is constructed **only** for the upstream `messages` payload (`messagesForUpstream`), and only when attachments are present. With no attachments, `messagesForUpstream === messages` — identical upstream behaviour.
- **Owner-scoping (SEC-fix discipline).** The attachment fetch is `WHERE id = ANY($ids) AND created_by = $oid`; any requested id not owned/found → **404** (no leakage), mirroring the conversation-ownership check. Blob reads are MI data-plane; per-attachment read failures **degrade to a text note** (never break chat).
- **MI blob helpers are an EXACT mirror** of the deployed B8b/B8c handlers (`getManagedIdentityAccessToken`, `encodeBlobPath`, binary/text GET) — Golden §3 EXACT-mirror, not a new-domain helper. The MI already holds Storage Blob Data Contributor (B8b G-2; proven by the B8b/B8c green curls).
- **Budgets** bound the upstream payload: ≤ `ATTACH_MAX_COUNT` (10) attachments; cumulative native base64 ≤ `ATTACH_NATIVE_BUDGET_BYTES` (~25 MB, under the model request ceiling); cumulative extracted text ≤ `ATTACH_EXTRACT_BUDGET_CHARS` (200k) — overflow degrades to a note. **Linkage:** owned attachments are linked to the conversation (`conversation_id` set when null) so a reloaded thread can surface them.
- **Boundary.** Reads `theo_attachments` (owner-scoped) + the `theo-content` Blob container; **no `reporting_*`**; document/image blocks ride the existing Foundry Messages call (capability verified; no header change); no schema change.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Redeploy (Walter).** Replace **only** the `theo_message` handler `index.js` with §H (route + function.json unchanged). No migration, no new dependency, no new env (attachment budgets default in code). | **PRE-LAND** — §DEPLOY; Claude Code runs the §GOLDEN payoff round-trip after. |
| G-2 | **Infra already in place.** The Function MI's Storage Blob Data Contributor on `vaultgptstorage01` is live (B8b/B8c green curls); the same MI reads attachment blobs here. | **PROCEED** — no new infra. |
| G-3 | **API-Spec §2.8 read-path status.** Advances to "gateway injection DEPLOYED" once green. | **PRE-LAND** — short Role-C after green curls. |
| G-4 | **B8e frontend.** Composer attach control + chips (Theo-FE regime). | **PROCEED (future-trigger)** — final attachments microstep; backend read path complete after B8d. |

No write SQL. No `reporting_*` change.

## P3 — Backend / contract grounding
Contract basis = the §2.1 gateway contract (request gains optional `attachment_ids: uuid[]`; response unchanged) + the deployed `theo_attachments` table incl. the B8c `ingestion_class`/`extracted_text_path` columns (doc #9, §7). Additive, backward-compatible — existing callers omit `attachment_ids` and see identical behaviour. The §2.8 read-path status advances post-deploy (G-3).

## P4 — Schema definition
None — no DDL. `theo_attachments` (incl. the B8c columns) is already deployed; B8d only reads it + sets `conversation_id` (existing column).

## P5 — Component reference grounding
- **Primary Reference (extended):** deployed `theo_message` §SM (blob `4eb4ed62`) + function.json §SM-FJ (blob `bd476fc8`), full verbatim. §H reproduces it and adds only the §CHANGESET delta.
- **EXACT-mirror precedent:** the MI blob-read helpers + `requestBinary` are byte-for-byte the deployed B8b `theo_create_attachment_upload` / B8c `theo_finalize_attachment` pattern (Golden §3 EXACT-mirror) — no new-domain authorization required.

## §CHANGESET — exact additive delta vs the deployed `theo_message` (diff-verified)
1. **Attachment constants** — `STORAGE_ACCOUNT`/`STORAGE_CONTAINER`, `ATTACH_MAX_COUNT`, `ATTACH_NATIVE_BUDGET_BYTES`, `ATTACH_EXTRACT_BUDGET_CHARS`, `NATIVE_MEDIA_TYPES`.
2. **`requestBinary`** — Buffer-collecting GET (mirrors B8c; avoids string-coercing binary blobs).
3. **MI helpers** — `getManagedIdentityAccessToken`, `encodeBlobPath`, `blobUrlFor`, `downloadBlobBinary`, `downloadBlobText` (EXACT mirror of deployed B8b/B8c).
4. **`buildAttachmentBlocks`** — native → document/image base64 block; extract-class → text block from `extracted_text_path`; unreadable → text note; budget overflow → note; per-attachment failure → note (non-fatal).
5. **`lastUser` → `lastUserIndex`** — the only existing-logic edit; `userText` is computed identically; the index lets B8d target the message for upstream injection.
6. **`attachment_ids` validation** — optional; unique; ≤ cap; all UUIDs; requires a text user message (deterministic 400s).
7. **Owner-scoped attachment fetch** — `WHERE id = ANY($ids) AND created_by=$oid`; missing any → 404; caller order preserved.
8. **`messages` → `messages: messagesForUpstream`** in the upstream payload — when attachments present, the last user message content becomes `[...attachmentBlocks, {type:"text", text:userText}]`; otherwise unchanged.
9. **Attachment→conversation linkage** — owner-scoped `UPDATE … SET conversation_id WHERE … conversation_id IS NULL` (additive; never reassigns).
Everything else (memory, history-RAG, persistence, RLS predicates, grounding tools, citations, response shape, error mapping) is byte-for-byte the deployed handler.

## P6 — Repository & active-surface grounding
Changed artifact: `theo_message/index.js` (this package; supersedes the B7b-2 copy for deploy) + its unchanged `function.json`. `node --check` clean; diff vs the deployed handler confirms additive-only (§CHANGESET). No other source touched.

## P7 — Risk / regression
- **Zero-attachment path is byte-identical:** `attachment_ids` absent → `messagesForUpstream === messages`, no MI calls, no extra queries — the deployed B7b-2 behaviour exactly. No regression to chat/memory/history-RAG.
- **Isolation:** attachment fetch is explicit `created_by`-scoped; non-owned id → 404; the blob path is owner-embedded; the conversation-ownership + linkage are owner-scoped.
- **Payload safety:** count + native-bytes + extract-chars budgets keep the upstream request under the model ceiling; overflow degrades to notes, never a hard failure.
- **Non-fatal blob reads:** an attachment that can't be loaded becomes a text note; chat still completes.
- **Capability:** document/image blocks on the Foundry Messages call were golden-curl-verified (no header change); the existing `anthropic-version` + web-fetch beta are unchanged.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-3 PRE-LAND; G-2/G-4 PROCEED); §CHANGESET enumerates the diff-verified additive delta; §SM/§SM-FJ Primary Reference full verbatim; §H the extended handler; §GOLDEN the payoff round-trip; §DEPLOY the replace-only step. Plan-only. On Codex APPROVAL, Walter replaces the `theo_message` handler; Claude Code runs §GOLDEN (incl. a real "read my uploaded PDF" test), then the API-Spec read-path Role-C (G-3) and B8e (FE).

---

## §SM — Primary Reference handler (deployed `theo_message.index.js`, B7b-2, blob `4eb4ed62`, full verbatim — the artifact this microstep extends)
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

## §SM-FJ — Primary Reference function.json (deployed `theo_message.function.json`, blob `bd476fc8`, full verbatim — UNCHANGED; also the B8d deploy function.json)
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

## §H — `theo_message/index.js` (complete; B8d — adds `attachment_ids` injection)
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
const ATTACH_NATIVE_BUDGET_BYTES = parsePositiveInt(process.env.THEO_ATTACH_NATIVE_BUDGET_BYTES, 25 * 1024 * 1024);
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

// Binary HTTP GET (collects Buffer chunks; must NOT string-coerce — attachment blobs are binary).
function requestBinary(urlStr, options = {}) {
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
    const native = NATIVE_MEDIA_TYPES[row.content_type];
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
      } else if (row.ingestion_class === "extract" && row.extracted_text_path) {
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

    // B8d: link the sent attachments to this conversation (owner-scoped; only when not already
    // linked) so a reloaded thread can surface its attachments. Additive; never reassigns.
    if (attachmentIds.length > 0) {
      await client.query(
        `
        UPDATE public.theo_attachments
        SET conversation_id = $1
        WHERE id = ANY($2::uuid[]) AND created_by = $3 AND conversation_id IS NULL
        `,
        [conversationId, attachmentIds, oid]
      );
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

## §GOLDEN — golden-curl payoff round-trip (Claude Code, post-deploy; token via `az`, never printed)
1. **regression (no attachments)** — `POST /api/theo_message` `{messages:[{role:"user",content:"Reply with exactly: ok"}], max_tokens:64}` → **200**, `data.content[0].text == "ok"`; a conversation row persists (B7b-2 behaviour unchanged).
2. **payoff (native PDF)** — create+PUT+finalize a small PDF whose text says e.g. "Da Vinci Fund III LP — Form 1065 — net income $42,000" (B8b/B8c path); then `POST /api/theo_message` `{messages:[{role:"user",content:"What is the net income and entity name in the attached file?"}], attachment_ids:["<id>"], max_tokens:256}` → **200**, and `data.content[0].text` contains **"42,000"** and **"Da Vinci"** (Claude read the injected document block).
3. **payoff (extract XLSX)** — finalize the SheetJS probe workbook; ask "what is the total in the attached spreadsheet?" with its `attachment_ids` → **200**, answer references the sheet values (extracted-text injection).
4. **negatives** — `attachment_ids:["<random-uuid>"]` (not owned) → **404**; `attachment_ids:["not-a-uuid"]` → **400**; an 11-element `attachment_ids` → **400**.
5. **linkage + cleanup** — RO-confirm the used attachments' `conversation_id` was set to the chat; delete the probe attachments + (optionally) the test conversations. Evidence under `.local/`.

## §DEPLOY — Walter deploy step
1. Replace **only** the `theo_message` function `index.js` with §H (route + `function.json` unchanged; no migration, no new dependency, no new app setting).
2. Reply "B8d deployed" → Claude Code runs §GOLDEN (incl. the "read my uploaded PDF/XLSX" payoff test), captures evidence, then prepares the API-Spec read-path Role-C (G-3) and begins B8e (FE composer).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B8d Gateway Attachment Injection Pass-1 Backend VEP (plan only).*
