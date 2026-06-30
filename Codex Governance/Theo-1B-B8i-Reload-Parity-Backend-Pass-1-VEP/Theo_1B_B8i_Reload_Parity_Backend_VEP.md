# Theo 1B — B8i Reload-Parity (per-message attachment chips on reloaded threads) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handlers for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier **B8i** — make a reloaded chat thread surface its attachment chips on the **matching user message**, the way reopening a Claude conversation does. Three small changes, one additive column: **(1, schema)** an additive `theo_attachments.message_seq int` column records which user-turn seq an attachment was sent with; **(2, `theo_message`)** the existing B8d linkage UPDATE is **moved to after `baseSeq` is computed** and now also sets `message_seq = baseSeq` (the user turn's seq), so a sent attachment is bound to its message — purely a reordering + one extra assignment, no behavioural change to chat; **(3, new read handler)** `theo_list_conversation_attachments` (GET, owner-scoped) returns a conversation's attachments incl. `message_seq`, an EXACT mirror of the deployed Family-B read handler `theo_get_conversation`. No `reporting_*`. No write SQL beyond the one additive, idempotent column (Walter runs it). The FE consumer is the follow-on **B8j** (Theo-FE regime); this VEP is backend-only. `theo_create_attachment_upload` / `theo_finalize_attachment` / `theo_delete_attachment` unchanged.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Turn issued against HEAD: `5f1e7877649c0bf7e45d04d8c6e11fbd09e4df78` (vault-theo, `development`)
Detail: Pass 1 backend VEP; P1–P8 walked. One handler under change: Primary Reference (1/2) = the deployed B8h `theo_message` (blob `e5ba2018`) + function.json (`bd476fc8`); the corrected full handler is inlined §H-MESSAGE and the diff-verified additive delta is enumerated §CHANGESET. One **new** read handler `theo_list_conversation_attachments` is an EXACT mirror of the deployed Family-B read handler — Primary Reference (2/2) = `theo_get_conversation` (blob `c292ff18`) + function.json (`11257bb1`), inlined full §REF-READ; the new handler is inlined full §H-LIST / §FJ-LIST. **One additive schema column** (`message_seq int`) — canonical DDL §SCHEMA (`b8i_addendum.sql`), the same addendum pattern as the deployed B8c `ingestion_class`/`extracted_text_path` columns. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | cited; unchanged blob @ HEAD | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§4 EXACT mirror) | `Grep("EXACT mirror")` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("Codex")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B8 / reload) | `Grep("reload")` this turn | `54f22fe12b5bc0c6e3c089be2474ff0226d1497c` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 ownership family) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§7 `theo_attachments`) | `Grep("extracted_text_path") / Read(§7)` this turn | `f9164d8a22194b87e9601c5dcc61528bc7c7be2e` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.8 Attachments) | `Read(§2.8)` this turn | `70d7b15d0c743ae1d0020fb5650b5bad7d367b79` |
| 10 | **Primary Reference (1/2)** — deployed B8h gateway — `Codex Governance/Theo-1B-B8h-Large-Document-Handling-Pass-1-VEP/theo_message.index.js` | `Read(full)` this turn | `e5ba2018cbe8ba9131caa2dfc1926170132b3999` |
| 11 | Primary Reference (1/2) function.json — `Codex Governance/Theo-1B-B8h-Large-Document-Handling-Pass-1-VEP/theo_message.function.json` | `Read(full)` this turn | `bd476fc8d144ed9592b561b4c0ded84f5911cff0` |
| 12 | **Primary Reference (2/2)** — deployed read handler — `Codex Governance/Theo-1B-B3b-Conversation-Read-Handlers-Pass-1-VEP/theo_get_conversation.index.js` | `Read(full)` this turn | `c292ff18e9c06bc9c10e6b53266aa4a82b90161d` |
| 13 | Primary Reference (2/2) function.json — `Codex Governance/Theo-1B-B3b-Conversation-Read-Handlers-Pass-1-VEP/theo_get_conversation.function.json` | `Read(full)` this turn | `11257bb1733f0f351b04fc58e2355119c754902b` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. Write SQL is limited to the one additive idempotent column (§SCHEMA), run by Walter as `pgadmin_vault`. No `theo_create_attachment_upload` / `theo_finalize_attachment` / `theo_delete_attachment` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "EXACT mirror against a deployed handler" | §H-LIST mirrors the deployed `theo_get_conversation` read handler |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §H-MESSAGE / §H-LIST — every query explicit `created_by`-scoped |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §7 | "extracted_text_path" | §SCHEMA — `message_seq` added beside the B8c columns, same addendum pattern |

---

## P1 — Feature identification
Tier **B8i (reload parity)**. Today a sent attachment is linked to its conversation (B8d), so it survives reload, but the thread has **no record of which message it was sent with** — a reopened chat cannot draw the attachment chip under the right user turn the way Claude does. B8i records the user-turn seq on the attachment at send time and exposes a read endpoint the FE (B8j) calls on thread load to hydrate per-message chips. No new capability surface; an enhancement to the deployed B8d linkage + a Family-B read endpoint.

## P2 — Architecture & boundary reconciliation
- **Schema (additive).** `theo_attachments` gains a nullable `message_seq int` (the `theo_messages.seq` of the user turn the file was sent with; NULL when never sent in a message, or for pre-B8i rows). No CHECK, no FK (seq is a per-conversation ordinal, not a global key — mirrors the free-text/promotable posture of `ingestion_class`); inherits the table's four ownership policies. No backfill.
- **`theo_message` (re-order + one assignment).** The deployed B8d linkage UPDATE (which set only `conversation_id`) ran **before** `baseSeq` was known. B8i **moves it to immediately after `const baseSeq = ...`** and sets `message_seq = baseSeq` as well — `baseSeq` is exactly the seq the new user turn is about to be inserted at (the very next statement inserts the user row at `seq = baseSeq`). Still owner-scoped (`created_by = $oid`), still `conversation_id IS NULL`-guarded (never reassigns an already-linked attachment). No other line changes; chat behaviour is byte-identical.
- **New read handler `theo_list_conversation_attachments` (GET).** EXACT mirror of the deployed `theo_get_conversation` Family-B read pattern: EasyAuth principal → OID; `conversationId` query param validated by `isUuid`; `set_config` the three request-identity settings; resolve conversation ownership first (403 via `theo_conversation_exists_unscoped` when it exists but is not the caller's, 404 when absent), then return the owner-scoped attachment rows. Read-only; no transaction.
- **Boundary.** Reads/writes only `theo_attachments` + `theo_conversations` (ownership probe); **no `reporting_*`**; the only DDL is the one additive column; no Blob change; no contract change to any existing endpoint.

## P2.5 / GR — Gap Register
Vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`.
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Schema column (Walter, SQL).** `theo_message`'s moved linkage UPDATE writes `message_seq`; the column MUST exist first or the persistence transaction throws. Walter runs `b8i_addendum.sql` (§SCHEMA) as `pgadmin_vault` (idempotent `ADD COLUMN IF NOT EXISTS`) **before** redeploying `theo_message`. | **PRE-LAND** — §SCHEMA; run SQL, then deploy. |
| G-2 | **Deploy (Walter).** Replace `theo_message/index.js` (§H-MESSAGE; function.json unchanged) **and** create the new function `theo_list_conversation_attachments` (`index.js` §H-LIST + `function.json` §FJ-LIST) in `vaultgpt-func-premium`. | **PRE-LAND** — §DEPLOY; Claude Code re-runs §GOLDEN after. |
| G-3 | **Doc follow-on.** Schema §7 gains a "Tier B8i addendum" line for `message_seq`; API Spec §2.8 gains a row for the new read endpoint. | **PROCEED** — Role-C after green curls, exactly as the B8c columns were documented post-deploy. |
| G-4 | **Pre-B8i attachments.** Rows linked before B8i have `message_seq = NULL` (no backfill) → on reload they group at the chat level rather than under a specific turn. | **PROCEED** — accepted; affects only historical pre-B8i uploads; new sends are bound correctly. |

No write SQL beyond the additive column. No `reporting_*` change.

## P3 — Backend / contract grounding
- Existing endpoints: contract **unchanged**. `theo_message` request/response shape is byte-identical (the change is internal persistence ordering + one column write).
- New endpoint: `GET /api/theo_list_conversation_attachments?conversationId=<uuid>` → `{ data: { attachments: [{ id, filename, content_type, byte_size, ingestion_class, message_seq, created_at }] }, meta }`; invalid id → 400, not-found → 404, not-owned → 403. Mirrors the §2.7/§2.8 read-path envelope (`successBody`/`errorBody`). Contract basis = the deployed `theo_attachments` table (doc #8) + the additive `message_seq`.

## P4 — Schema definition
One additive, idempotent column on the deployed `theo_attachments` table — canonical DDL §SCHEMA (`b8i_addendum.sql`), read-only verify `b8i_verify.sql`. `message_seq int` NULL; no CHECK/FK; inherits the table's four `created_by = auth.uid()` ownership policies; no backfill. Same addendum mechanism as the deployed B8c `ingestion_class`/`extracted_text_path` columns (Schema §7).

## P5 — Component reference grounding
- **Primary Reference (1/2):** deployed B8h `theo_message` (blob `e5ba2018`) + fj (`bd476fc8`) — §H-MESSAGE inlines the corrected full file; the only delta is §CHANGESET items 1–2.
- **Primary Reference (2/2):** deployed `theo_get_conversation` (blob `c292ff18`) + fj (`11257bb1`), inlined full §REF-READ — the EXACT Family-B read template the new handler mirrors (Golden §4). §H-LIST inlines the new handler full; §FJ-LIST its function.json.

## §CHANGESET — exact additive delta (diff-verified)
**`theo_message` (§H-MESSAGE), vs the deployed B8h `theo_message` (`e5ba2018`):**
1. The B8d linkage block (`UPDATE public.theo_attachments SET conversation_id = $1 WHERE id = ANY($2::uuid[]) AND created_by = $3 AND conversation_id IS NULL`), previously **before** the `seqResult`/`baseSeq` computation, is **removed from that position**.
2. An equivalent block is **re-inserted immediately after `const baseSeq = seqResult.rows[0].n;`**, now `UPDATE public.theo_attachments SET conversation_id = $1, message_seq = $2 WHERE id = ANY($3::uuid[]) AND created_by = $4 AND conversation_id IS NULL` with `$2 = baseSeq` — binding each newly-linked attachment to the user turn's seq. Same ownership scope, same `conversation_id IS NULL` guard.

Net: a pure move of one block past the (side-effect-free) `count(*)` query, plus one extra assigned column. Verified by `diff` against `e5ba2018`: the only hunks are the removal at the old site and the augmented re-insertion at the new site. Everything else byte-for-byte the deployed version.

**`theo_list_conversation_attachments` (§H-LIST):** net-new; EXACT mirror of `theo_get_conversation` (§REF-READ). Allowed deltas (Golden §4): the table (`theo_attachments`), the returned column set, the owner-scoped query, and the response shape (`{ attachments }`). The CORS method list, auth/claim extraction, `isUuid` gate, `set_config` triple, and the 403/404 ownership split via `theo_conversation_exists_unscoped` are identical to the reference.

## P6 — Repository & active-surface grounding
Changed/added artifacts (this package): `theo_message/index.js` (supersedes the B8h deploy copy), the new `theo_list_conversation_attachments/index.js` + `function.json`, and `b8i_addendum.sql` / `b8i_verify.sql`. `node --check` clean for both handlers; the `theo_message` diff vs `e5ba2018` is the §CHANGESET delta only. `theo_message/function.json` unchanged (§FJ-MESSAGE).

## P7 — Risk / regression
- **Chat (`theo_message`):** the moved UPDATE runs in the same transaction, after a read-only `count(*)`; no new failure mode. Zero-attachment path unchanged (the `if (attachmentIds.length > 0)` guard is preserved). A pre-G-1 deploy (column missing) would throw inside the txn → handled by ordering G-1 before G-2.
- **New endpoint:** read-only, owner-scoped, no transaction; mirrors a deployed, golden-verified read handler. Worst case is a 4xx on bad input.
- **Schema:** additive nullable column, idempotent, no backfill, no constraint → cannot break existing inserts/reads (the B8h `theo_finalize_attachment` INSERT column list does not include `message_seq`, so it defaults to NULL — unaffected).
- **FE:** none in this VEP (B8j consumes the new endpoint).

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED); §CHANGESET the diff-verified delta; §SCHEMA the additive column DDL + verify; §H-MESSAGE the corrected full gateway; §FJ-MESSAGE its unchanged function.json; §REF-READ the Primary-Reference read handler (full); §H-LIST / §FJ-LIST the new read handler (full); §GOLDEN the round-trip; §DEPLOY the steps. Plan-only. On Codex APPROVAL, Walter runs §SCHEMA, then deploys per §DEPLOY; Claude Code runs §GOLDEN.

---

## §SCHEMA — `b8i_addendum.sql` (additive column; Walter runs as `pgadmin_vault` — G-1) + `b8i_verify.sql`
```sql
-- Tier B8i addendum: record which user-turn the attachment was sent with (reload parity). ADDITIVE; idempotent.
-- Run as pgadmin_vault. No RLS change (inherits theo_attachments' four ownership policies). No backfill
-- (theo_message sets it on send going forward; pre-existing rows keep NULL → they group at the chat level).
ALTER TABLE public.theo_attachments
  ADD COLUMN IF NOT EXISTS message_seq int;

COMMENT ON COLUMN public.theo_attachments.message_seq IS
  'The theo_messages.seq of the user turn this attachment was sent with (set by theo_message at send); NULL if not sent in a message. Lets a reloaded thread show chips on the right message (B8i).';
```

Read-only verification (run after, as `codex_reporting_ro`/RO):
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema='public' AND table_name='theo_attachments' AND column_name='message_seq';
```

## §H-MESSAGE — `theo_message/index.js` (complete; B8i linkage-move)
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

## §FJ-MESSAGE — `theo_message/function.json` (unchanged)
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

## §REF-READ — Primary Reference (2/2): deployed `theo_get_conversation/index.js` + `function.json` (full verbatim; the EXACT read template — T9)
```js
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

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
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

  const conversationId =
    req.query && typeof req.query.conversationId === "string" ? req.query.conversationId.trim() : "";
  if (!isUuid(conversationId)) {
    return send(
      context,
      400,
      errorBody("INVALID_REQUEST", "Query parameter 'conversationId' is required and must be a valid UUID.", 400)
    );
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

    const convResult = await client.query(
      `
      SELECT
        id,
        title,
        model,
        project_id,
        app_key,
        app_context,
        created_at,
        updated_at
      FROM public.theo_conversations
      WHERE id = $1
      `,
      [conversationId]
    );

    if (convResult.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [conversationId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      return exists
        ? send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403))
        : send(context, 404, errorBody("NOT_FOUND", "Conversation not found.", 404));
    }

    const messagesResult = await client.query(
      `
      SELECT
        id,
        seq,
        role,
        content,
        model,
        citations,
        created_at
      FROM public.theo_messages
      WHERE conversation_id = $1
      ORDER BY seq ASC, created_at ASC
      `,
      [conversationId]
    );

    return send(
      context,
      200,
      successBody({ conversation: convResult.rows[0], messages: messagesResult.rows })
    );
  } catch (err) {
    context.log.error("theo_get_conversation failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_get_conversation"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §H-LIST — `theo_list_conversation_attachments/index.js` (complete; new — EXACT mirror of §REF-READ)
```js
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

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
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

  const conversationId =
    req.query && typeof req.query.conversationId === "string" ? req.query.conversationId.trim() : "";
  if (!isUuid(conversationId)) {
    return send(
      context,
      400,
      errorBody("INVALID_REQUEST", "Query parameter 'conversationId' is required and must be a valid UUID.", 400)
    );
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

    // Resolve conversation ownership first so reload-parity reads return the same
    // 403/404 semantics as theo_get_conversation (owner-scoped; defense-in-depth
    // created_by filter on top of RLS, since the connection role bypasses RLS).
    const convResult = await client.query(
      `
      SELECT id
      FROM public.theo_conversations
      WHERE id = $1 AND created_by = $2
      `,
      [conversationId, oid]
    );

    if (convResult.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [conversationId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      return exists
        ? send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403))
        : send(context, 404, errorBody("NOT_FOUND", "Conversation not found.", 404));
    }

    const attachmentsResult = await client.query(
      `
      SELECT
        id,
        filename,
        content_type,
        byte_size,
        ingestion_class,
        message_seq,
        created_at
      FROM public.theo_attachments
      WHERE conversation_id = $1 AND created_by = $2
      ORDER BY message_seq ASC NULLS LAST, created_at ASC
      `,
      [conversationId, oid]
    );

    return send(context, 200, successBody({ attachments: attachmentsResult.rows }));
  } catch (err) {
    context.log.error("theo_list_conversation_attachments failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

## §FJ-LIST — `theo_list_conversation_attachments/function.json` (new)
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_conversation_attachments"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §GOLDEN — golden-curl round-trip (Claude Code, post-deploy; token via `az`, never printed)
1. **send-with-attachment binds the seq:** create a fresh conversation via `theo_message` with one `attachment_ids` entry → 200; then `GET /api/theo_list_conversation_attachments?conversationId=<id>` → 200, the attachment present with `message_seq = 0` (first user turn) and the correct `filename`/`ingestion_class`.
2. **second turn binds the next seq:** send a second message with a different attachment → that attachment lists with `message_seq = 2` (user turns at seq 0 and 2; assistant at 1) — i.e. chips land on the right turn.
3. **owner isolation:** `theo_list_conversation_attachments` for a conversation owned by another principal → 403 (exists) / 404 (absent); bad/missing `conversationId` → 400.
4. **reload parity vs `theo_get_conversation`:** `message_seq` values returned by the new endpoint align with the `seq` values of the user messages from `theo_get_conversation` for the same conversation.
5. **regression:** a `theo_message` send with **no** attachments → 200, unchanged; `theo_get_conversation` unchanged. Evidence under `.local/`.

## §DEPLOY — Walter deploy steps
1. **SQL (G-1, first):** run `b8i_addendum.sql` (§SCHEMA) against `vaultgpt-postgres-prod` as `pgadmin_vault` (idempotent).
2. Replace `theo_message/index.js` (§H-MESSAGE; function.json unchanged).
3. Create the new function `theo_list_conversation_attachments` in `vaultgpt-func-premium`: add `theo_list_conversation_attachments/index.js` (§H-LIST) + `theo_list_conversation_attachments/function.json` (§FJ-LIST).
4. Reply "B8i deployed" → Claude Code runs §GOLDEN, captures evidence.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B8i Reload-Parity Pass-1 Backend VEP (plan only).*
