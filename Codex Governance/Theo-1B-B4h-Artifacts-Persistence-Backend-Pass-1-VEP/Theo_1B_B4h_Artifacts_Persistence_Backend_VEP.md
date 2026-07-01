# Theo 1B — B4h Artifacts Persistence (backend: `theo_upsert_artifact` + `theo_list_artifacts` + `theo_get_artifact` + `theo_delete_artifact`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handlers provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** make **artifacts persistent** (Backend Plan Tier B4 — "Projects + project-knowledge + artifacts + settings CRUD"). Today artifacts live only in FE memory (lost on reload; the Artifacts tab is empty after a session). The deployed `theo_artifacts` + `theo_artifact_versions` tables (B2) are unused. Four GREENFIELD handlers give owner-scoped CRUD: **`theo_upsert_artifact`** (create-or-add-version, keyed by title — mirrors the FE `upsert()`), **`theo_list_artifacts`** (metadata; optional `?conversationId`), **`theo_get_artifact`** (artifact + all versions with content), **`theo_delete_artifact`** (permanent; versions cascade). Version **content is stored in Blob** (`theo-content`) exactly as the deployed schema dictates (`theo_artifact_versions` holds the Blob pointer) — written **server-side via managed identity**, the same technique as the deployed `theo_finalize_attachment` (B8h). **No migration, no schema change.** Owner-scoped (`created_by = $oid`), RLS second layer; 403/404 via the deployed `theo_artifact_exists_unscoped`. `theo_message`/`theo_message_stream` untouched. The FE wiring (persist on ingest, load on mount/reload, link by title) is the paired B4h-FE microstep.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `3a480dd` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference (Golden §2) = the **deployed** `theo_finalize_attachment` **pair** (B8h) — the one deployed Theo handler combining owner-scoped DB writes with **managed-identity data-plane Blob access** (`getManagedIdentityAccessToken` / `putTextBlob` / `downloadBlob` / `deleteBlobBestEffort`), inlined verbatim §SM/§SM-FJ. The four artifact handlers reuse its Blob helper block **byte-identical** (EXACT) and its Family-B skeleton (Pool / `set_config` triad / owner-scoped SQL / `_exists_unscoped` 403-404 / `{data,meta}` envelope); the artifact CRUD verbs are the ALLOWED DELTA (upsert-by-title, list, get, delete over `theo_artifacts`/`theo_artifact_versions`). Contract basis = deployed `theo_artifacts` + `theo_artifact_versions` (Schema §3/§5: version content is a **Blob pointer** — `blob_container`/`blob_path` NOT NULL, `byte_size`/`content_type`; `current_version int`; FK `theo_artifact_versions.artifact_id` ON DELETE CASCADE; `theo_artifact_exists_unscoped` helper). **No migration.** API Spec gains an Artifacts section post-deploy (§GR G-2). Validation precedes SQL. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `git grep -F "Gap Register"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §4 deltas; §5 SM) | `git grep -F "selects **exactly one** deployed handler file"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (pass axis) | cited | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4 artifacts CRUD) | `git grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `git grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_artifacts`/`theo_artifact_versions`; §5 helper + Blob-pointer versions) | `git grep -F "theo_artifacts"` this turn | `59924ef06b64e62b4cc6a268793d52bd82945cbd` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2 surface; Artifacts section lands post-deploy) | `Read` this turn | `82cc8153151d9edfb6fd7fd4a6cfc70b0b3ebc49` |
| 10 | **Primary Reference handler** (deployed owner-scoped DB write + managed-identity Blob) — `Codex Governance/Theo-1B-B8h-Large-Document-Handling-Pass-1-VEP/theo_finalize_attachment.index.js` | `Read(full)` this turn | `488a697aa5ea99986b5fb5e61167de6192292652` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-B8h-Large-Document-Handling-Pass-1-VEP/theo_finalize_attachment.function.json` | `Read(full)` this turn | `9fdd3c54d25b7a8c3bcf285459acd0ddea8316e7` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. `theo_message`/`theo_message_stream` NOT touched.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §P1 — artifacts CRUD is the named B4 surface being made persistent |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_finalize_attachment` |
| Codex Governance/Theo-1B-B8h-Large-Document-Handling-Pass-1-VEP/theo_finalize_attachment.function.json | binding | "httpTrigger" | §SM-FJ — Primary Reference function.json |
| Codex Governance/Theo-1B-B8h-Large-Document-Handling-Pass-1-VEP/theo_finalize_attachment.index.js | blob-helper | "putTextBlob" | §HG.1/§HG.3/§HG.4 — Blob helper block lifted byte-identical (EXACT) |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §HG.1–4 — every query scoped `created_by = $oid` |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_artifacts" | §HG.1–4 — operate over the deployed tables; version content = Blob pointer |

---

## P1 — Feature identification
**Microstep:** artifacts persistence — the CRUD that makes the deployed `theo_artifacts` + `theo_artifact_versions` tables live (Rule Anchor: Plan Tier B4 "Projects + project-knowledge + artifacts + settings CRUD"). Today the FE parses `[[ARTIFACT title=… type=…]]…[[/ARTIFACT]]` blocks out of a reply and upserts them **in memory** (`lib/artifacts.upsert`, keyed by title → new version on title reuse); they vanish on reload and never populate the Artifacts tab. Four handlers:
- **`theo_upsert_artifact`** (POST) — create-or-add-version, keyed by `(created_by, lower(title))` to mirror the FE `upsert()`; writes the version body to Blob, inserts the version row (pointer), bumps `current_version`.
- **`theo_list_artifacts`** (GET, optional `?conversationId`) — the caller's artifacts, newest-updated first (metadata; backs the Artifacts gallery + the reload path).
- **`theo_get_artifact`** (GET `?artifactId`) — one artifact + all its versions, content read back from Blob.
- **`theo_delete_artifact`** (POST) — permanent; version rows cascade (FK), version blobs best-effort deleted.

User-managed CRUD; no model/index traffic; `theo_message`/`theo_message_stream` untouched. **Out of scope (paired B4h-FE):** persist-on-ingest during `send`, load-on-mount (gallery) + reload (re-derive from persisted `[[ARTIFACT]]` blocks and link to rows by title), and `ArtifactPanel` version-content wiring.

## P2 — Architecture & boundary reconciliation
- **Family-B.** `pg` Pool over `POSTGRES_CONNECTION_STRING`; per-request `set_config` triad; mutations `connect→BEGIN→…→COMMIT` with `catch ROLLBACK` (`theo_list_artifacts`/`theo_get_artifact` are read-only, no txn). Identical helper block to the deployed Theo handlers.
- **Managed-identity Blob (EXACT lift).** Version content lives in Blob per the deployed schema (`theo_artifact_versions` has no content column — only `blob_container`/`blob_path` NOT NULL). The handlers write/read/delete blobs **server-side via managed identity**, reusing the deployed `theo_finalize_attachment` (B8h) helper block byte-identical (`getManagedIdentityAccessToken`, `requestUrl`/`requestBinary`, `blobUrlFor`, `putTextBlob`, `downloadBlob`, `deleteBlobBestEffort`). Container `theo-content`; key `artifacts/<oid>/<artifactId>/v<n>.txt`. **No SAS, no browser upload** (content is model-authored text already in the reply).
- **Explicit ownership (SEC-fix discipline).** Every query carries `created_by = $oid`; the shared connection role bypasses RLS, so the predicate enforces isolation. 0-row get/delete → `theo_artifact_exists_unscoped` → 403 (existing-foreign) / 404 (absent).
- **Validation before SQL.** `isUuid` on ids; `title` non-blank ≤200; `type` ∈ {document,code,html}; `content` string ≤1 MiB — deterministic 400s before any query/Blob call.
- **Boundary.** Reads/writes only `theo_artifacts` + `theo_artifact_versions` (deployed B2) + the `theo-content` Blob container; **no `reporting_*`**; no model gateway; **no change to `theo_message`/`theo_message_stream`**. Delete relies on the deployed `theo_artifact_versions` FK (ON DELETE CASCADE) for version rows; version blobs are best-effort cleaned.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** Four new functions on the shared `vaultgpt-func-premium` app. **No migration** (`theo_artifacts` + `theo_artifact_versions` + `theo_artifact_exists_unscoped` deployed B2). Managed identity already has Storage Blob Data access (the deployed B8h finalize writes `theo-content` server-side). | **PRE-LAND** — §DEPLOY; Claude Code golden curls confirm (upsert v1 → upsert v2 same title → list → get with content → delete → cascade → validation → cross-user 404). |
| G-2 | **Authority-doc update post-deploy.** API Spec gains an Artifacts section (upsert/list/get/delete) after deploy. | **PRE-LAND** — a short API-Spec Role-C follows deploy (mirrors B4d/B4f), before the B4h-FE VEP cites it (T22 prevention). |
| G-3 | **Upsert-by-title race.** Two concurrent upserts of the same new title could both create an artifact (no unique index on `(created_by, lower(title))`). | **PROCEED** — matches the FE in-memory `upsert()` (title match) and is effectively single-flight per reply; a unique index would be a schema change (deferred). Disclosed, not blocking. |
| G-4 | **FE wiring (paired B4h-FE).** Persist-on-ingest, load-on-mount/reload, link-by-title, `ArtifactPanel` content. | **PROCEED (future-trigger).** Separate FE microstep; not in this pack. |

No write SQL executes in this pack (plan only); no migration. No `reporting_*` change.

## P3 — Backend / contract grounding
Contract basis = deployed `theo_artifacts` (`title` CHECK not-blank; `type` CHECK document/code/html; `current_version int`; optional `conversation_id`/`project_id` FK ON DELETE SET NULL) + `theo_artifact_versions` (`artifact_id` FK ON DELETE CASCADE; `version_number` UNIQUE per artifact; **Blob-pointer content** `blob_container`/`blob_path` NOT NULL + `byte_size`/`content_type`) + `theo_artifact_exists_unscoped(uuid)` (Schema §3/§5). Response envelope = standard `{ data, meta }` / `{ error }`. Endpoints (new): `POST /api/theo_upsert_artifact` `{ title, type, content, conversation_id?, project_id? }` → `{ artifact }` (201 create / 200 new-version); `GET /api/theo_list_artifacts[?conversationId]` → `{ artifacts: [...] }`; `GET /api/theo_get_artifact?artifactId` → `{ artifact: { …, versions: [{ version_number, content, byte_size, content_type, created_at }] } }`; `POST /api/theo_delete_artifact` `{ id }` → `{ deleted: true, id }`. API Spec rows land post-deploy (G-2).

## P4 — Per-handler contract
- **`theo_upsert_artifact`** (POST): validate `title`≤200 non-blank, `type`∈{document,code,html}, `content` string ≤1 MiB, optional `conversation_id`/`project_id` uuids. Find `(created_by,lower(title))`; if present → `version_number = current_version+1`; else INSERT artifact (v1). `putTextBlob(artifacts/<oid>/<id>/v<n>.txt)`; INSERT version row (pointer + `byte_size` + `content_type`); UPDATE artifact `current_version`+`type`+`updated_at`. → **201** (new) / **200** (new version) `{ artifact }`. FK violation (bad conv/project) → 404; blob failure → ROLLBACK + best-effort blob delete + 500.
- **`theo_list_artifacts`** (GET): optional `?conversationId` (uuid → else 400). `SELECT … WHERE created_by=$oid [AND conversation_id=$c] ORDER BY updated_at DESC, id DESC LIMIT 500` → **200** `{ artifacts }` (metadata; no content).
- **`theo_get_artifact`** (GET): `artifactId` uuid. Owner-scoped SELECT; 0-row → `_exists_unscoped` 403/404. SELECT versions ASC; `downloadBlob` each (failed read degrades to `""`) → **200** `{ artifact: { …, versions } }`.
- **`theo_delete_artifact`** (POST): `id` uuid. Capture version pointers; `DELETE FROM theo_artifacts WHERE id AND created_by RETURNING id`; 0-row → `_exists_unscoped` 403/404; COMMIT (versions cascade); best-effort blob delete each → **200** `{ deleted: true, id }`.

## P5 — Component reference grounding
Primary Reference (Golden §2) = the **deployed** `theo_finalize_attachment` **pair** (B8h) — owner-scoped DB write + managed-identity Blob helpers, inlined byte-identical §SM/§SM-FJ. The four handlers reuse its **Blob helper block verbatim** (EXACT: `getManagedIdentityAccessToken`/`requestUrl`/`requestBinary`/`blobUrlFor`/`encodeBlobPath`/`putTextBlob`/`downloadBlob`/`deleteBlobBestEffort`) and its Family-B skeleton (Pool / `set_config` triad / `{data,meta}` / error mapping). ALLOWED DELTA = the artifact CRUD verbs + validation field set + the `theo_artifacts`/`theo_artifact_versions` table/column names + the `theo_artifact_exists_unscoped` helper. finalize's attachment-specific **text-extraction** block (xlsx/mammoth/pdf-parse) is **not mirrored** (artifacts store model-authored text as-is). No new external-system helper beyond the deployed Blob technique (no DEVIATION).

## P6 — Repository & active-surface grounding
New artifacts: `theo_upsert_artifact` / `theo_list_artifacts` / `theo_get_artifact` / `theo_delete_artifact` (`.index.js` + `.function.json` each). No migration. `theo_message`/`theo_message_stream` unchanged. Guardrails: no browser storage; no `reporting_*`; explicit `created_by` on every query; `node --check` clean all four handlers; `function.json` methods correct (POST for upsert/delete, GET for list/get), routes match handler names, `authLevel` anonymous.

## P7 — Risk / regression
- **Greenfield:** four new functions; no change to deployed handlers/tables/policies; no migration.
- **Isolation:** explicit `created_by` on every query (verified by the cross-user golden curl).
- **Blob:** content in `theo-content` (same container as attachments), server-side MI write/read; a failed version-blob read degrades to `""` (never fails the artifact fetch); on upsert failure the written blob is best-effort deleted after ROLLBACK.
- **Permanent delete:** hard-deletes; ownership-checked first; version rows cascade (FK); version blobs best-effort deleted.
- **Upsert-by-title:** case-insensitive title match (mirrors FE); concurrent same-title create race disclosed (G-3), non-blocking.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED); Primary Reference inlined byte-identical (§SM/§SM-FJ); four full handlers (§HG.1–4) + four `function.json` (§FJ.1–4) inlined, each `node --check` / JSON-valid; Structural Mirror (§SM-TABLE) + parity checklist (§PARITY). No migration. Plan-only. On Codex APPROVAL, Walter deploys the four functions; Claude Code golden-curls (upsert v1 → upsert v2 same title → list → get-with-content → delete → cascade → validation → cross-user isolation); then the API-Spec Role-C (G-2); then B4h-FE.

---

## §SM — Primary Reference (deployed `theo_finalize_attachment`, B8h, byte-identical; owner-scoped DB write + managed-identity Blob)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

// ---- Ingestion classes (D-8 RESOLVED): declared-type allow-list + per-class size cap.
const NATIVE_MAX_BYTES = 10 * 1024 * 1024;
const PDF_NATIVE_MAX_BYTES = parseInt(process.env.THEO_PDF_NATIVE_MAX_BYTES || "", 10) > 0 ? parseInt(process.env.THEO_PDF_NATIVE_MAX_BYTES, 10) : 3 * 1024 * 1024; // B8f: PDFs larger than this are text-extracted instead of sent as a (large) document block
const EXTRACT_MAX_BYTES = 50 * 1024 * 1024;
const INGESTION_CLASSES = {
  "application/pdf": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/png": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/jpeg": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/webp": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/gif": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .xlsx
  "application/vnd.ms-excel": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .xls
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .docx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .pptx
  "text/csv": { class: "extract", maxBytes: EXTRACT_MAX_BYTES },
  "text/plain": { class: "extract", maxBytes: EXTRACT_MAX_BYTES },
};
const ALLOWED_CONTENT_TYPES = Object.keys(INGESTION_CLASSES);

const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";

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

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return { error: { code, message, status, timestamp: nowIso() } };
}

function successBody(data) {
  return { data, meta: { timestamp: nowIso(), version: "1.0" } };
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

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
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

function normalizeContentType(ct) {
  return String(ct || "").split(";")[0].trim().toLowerCase();
}

function cleanFileName(name) {
  if (name === undefined || name === null) return null;
  const raw = String(name).trim();
  if (!raw.length) return null;
  const cleaned = raw.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, " ").trim();
  return cleaned.length ? cleaned.slice(0, 180) : null;
}

// ---- Managed-identity data-plane Blob access (mirrors the deployed axis MI technique).
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// Binary variant: collects Buffer chunks (must NOT coerce to string — blobs are binary zips).
function requestBinary(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const https = require("https");
    const url = new URL(urlStr);
    const req = https.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
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

async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error(
      "Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing). " +
      "Ensure System Assigned Managed Identity is enabled on the Function App."
    );
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) {
    throw new Error("Managed Identity token endpoint did not return access_token.");
  }
  return payload.access_token;
}

function encodeBlobPath(blobKey) {
  return blobKey.split("/").map(encodeURIComponent).join("/");
}

function blobUrlFor(accountName, containerName, blobKey) {
  return `https://${accountName}.blob.core.windows.net/${containerName}/${encodeBlobPath(blobKey)}`;
}

// HEAD the blob to read its AUTHORITATIVE byte size + stored Content-Type. Returns null when absent.
async function getBlobProperties(accountName, containerName, blobKey) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const r = await requestUrl(blobUrlFor(accountName, containerName, blobKey), {
    method: "HEAD",
    headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode === 404) return null;
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`HEAD blob failed (${r.statusCode}): ${r.body}`);
  }
  const len = Number(r.headers["content-length"]);
  return {
    contentLength: Number.isFinite(len) ? len : 0,
    contentType: r.headers["content-type"] || null,
  };
}

async function downloadBlob(accountName, containerName, blobKey) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const r = await requestBinary(blobUrlFor(accountName, containerName, blobKey), {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`GET blob failed (${r.statusCode})`);
  }
  return r.body; // Buffer
}

async function putTextBlob(accountName, containerName, blobKey, text) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const bodyBuf = Buffer.from(text, "utf8");
  const r = await requestUrl(
    blobUrlFor(accountName, containerName, blobKey),
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-ms-version": "2022-11-02",
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Length": bodyBuf.length,
      },
    },
    bodyBuf
  );
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`PUT extracted blob failed (${r.statusCode}): ${r.body}`);
  }
}

async function deleteBlobBestEffort(context, accountName, containerName, blobKey) {
  try {
    const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
    await requestUrl(blobUrlFor(accountName, containerName, blobKey), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" },
    });
  } catch (e) {
    context.log.warn("theo_finalize_attachment: best-effort blob cleanup failed", e);
  }
}

// ---- Extract-class text extraction (Walter-authorized npm libs; "path a is the way to go").
// xlsx/.xls -> SheetJS (per-sheet CSV + manifest); .docx -> mammoth; .pptx -> officeparser;
// text/csv + text/plain -> native UTF-8 decode. Returns a markdown string.
async function extractTextFromBlob(buf, contentType) {
  if (contentType === "text/plain" || contentType === "text/csv") {
    return buf.toString("utf8");
  }
  if (
    contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    contentType === "application/vnd.ms-excel"
  ) {
    const XLSX = require("xlsx");
    const wb = XLSX.read(buf, { type: "buffer" });
    const manifest = [];
    const sections = [];
    for (const name of wb.SheetNames) {
      const ws = wb.Sheets[name];
      const ref = (ws && ws["!ref"]) || "(empty)";
      const csv = ws ? XLSX.utils.sheet_to_csv(ws) : "";
      manifest.push(`- ${name} (${ref})`);
      sections.push(`## Sheet: ${name} (${ref})\n\n\`\`\`csv\n${csv}\n\`\`\``);
    }
    return `# Workbook — ${wb.SheetNames.length} sheet(s)\n\n${manifest.join("\n")}\n\n${sections.join("\n\n")}`;
  }
  if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer: buf });
    return (result && result.value) || "";
  }
  if (contentType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
    const officeParser = require("officeparser");
    return await officeParser.parseOfficeAsync(buf);
  }
  if (contentType === "application/pdf") {
    const pdfParse = require("pdf-parse/lib/pdf-parse.js"); // pin pdf-parse@1.1.1; inner lib avoids the index.js debug-block (reads a test PDF when module.parent is falsy, as in Functions)
    const data = await pdfParse(buf);
    return (data && data.text) || "";
  }
  throw new Error(`No extractor registered for content-type ${contentType}`);
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

  // ---- Validate inputs before any SQL / Blob call (deterministic 400s) ----
  const attachmentId = typeof body.attachment_id === "string" ? body.attachment_id.trim() : "";
  if (!isUuid(attachmentId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'attachment_id' is required and must be a valid UUID.", 400));
  }

  const filename = cleanFileName(body.filename);
  if (!filename) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'filename' is required and must be a non-empty string.", 400));
  }

  // NOTE: content-type is NOT taken from the request body — it is read from the blob's
  // ACTUAL stored Content-Type below (after HEAD), so the client cannot misdeclare it (D-8).

  const conversationId =
    body.conversation_id != null && typeof body.conversation_id === "string" && body.conversation_id.trim() !== ""
      ? body.conversation_id.trim()
      : null;
  if (conversationId !== null && !isUuid(conversationId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'conversation_id', when supplied, must be a valid UUID.", 400));
  }

  // Deterministic owner-scoped blob path (same construction as create). The caller cannot
  // finalize another user's blob: the path is derived from THIS request's OID.
  const blobKey = `attachments/${oid}/${attachmentId}`;

  // Read the actual stored size from Blob (authoritative; the client cannot misdeclare it).
  let props;
  try {
    props = await getBlobProperties(STORAGE_ACCOUNT, STORAGE_CONTAINER, blobKey);
  } catch (err) {
    context.log.error("theo_finalize_attachment: blob HEAD failed", err);
    return send(context, 502, errorBody("STORAGE_ERROR", "Could not read the uploaded blob.", 502));
  }
  if (!props) {
    return send(context, 404, errorBody("NOT_FOUND", "Uploaded blob not found for this attachment id (upload may have failed or expired).", 404));
  }

  // AUTHORITATIVE content-type = the blob's ACTUAL stored Content-Type (set on the client's PUT),
  // NOT a client-declared body field. The allow-list, ingestion class, and per-class cap are all
  // enforced against this actual type, so a client cannot misdeclare the type past the guardrail (D-8).
  const contentType = normalizeContentType(props.contentType);
  const ingestion = INGESTION_CLASSES[contentType];
  if (!ingestion) {
    await deleteBlobBestEffort(context, STORAGE_ACCOUNT, STORAGE_CONTAINER, blobKey);
    return send(
      context,
      400,
      errorBody(
        "UNSUPPORTED_MEDIA_TYPE",
        `Uploaded blob Content-Type '${contentType || "(none)"}' is not a supported attachment type. Allowed: ${ALLOWED_CONTENT_TYPES.join(", ")}.`,
        400
      )
    );
  }

  if (!Number.isFinite(props.contentLength) || props.contentLength <= 0) {
    await deleteBlobBestEffort(context, STORAGE_ACCOUNT, STORAGE_CONTAINER, blobKey);
    return send(context, 400, errorBody("INVALID_REQUEST", "Uploaded file is empty.", 400));
  }
  if (props.contentLength > ingestion.maxBytes) {
    await deleteBlobBestEffort(context, STORAGE_ACCOUNT, STORAGE_CONTAINER, blobKey);
    const limitMb = Math.round(ingestion.maxBytes / (1024 * 1024));
    return send(context, 400, errorBody(
      "PAYLOAD_TOO_LARGE",
      `Uploaded file (${props.contentLength} bytes) exceeds the ${limitMb} MB limit for ${ingestion.class}-class files.`,
      400
    ));
  }
  const byteSize = props.contentLength;

  // ---- B8c: extract-class types are text-extracted at finalize and the text stored as a
  // sibling blob. Native types skip extraction. Extraction failure is NON-FATAL: the file is
  // already stored, so we still persist the row (extracted_text_path = NULL) and the gateway
  // (B8d) reports the file could not be read rather than losing the upload.
  // B8f (large-document handling): a PDF larger than PDF_NATIVE_MAX_BYTES is promoted from native
  // to extract-class — its text is extracted (pdf-parse) and budgeted at the gateway — so a big,
  // text-dense PDF cannot blow the synchronous request / model context. Small PDFs stay native.
  const isLargePdf = contentType === "application/pdf" && byteSize > PDF_NATIVE_MAX_BYTES;
  let ingestionClass = isLargePdf ? "extract" : ingestion.class; // 'native' | 'extract'
  let extractedTextPath = null;
  if (ingestionClass === "extract") {
    try {
      const buf = await downloadBlob(STORAGE_ACCOUNT, STORAGE_CONTAINER, blobKey);
      const text = await extractTextFromBlob(buf, contentType);
      const siblingKey = `${blobKey}.extracted.md`;
      await putTextBlob(STORAGE_ACCOUNT, STORAGE_CONTAINER, siblingKey, text);
      extractedTextPath = siblingKey;
    } catch (exErr) {
      context.log.error("theo_finalize_attachment: extraction failed (non-fatal)", exErr);
      extractedTextPath = null;
    }
  }

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

    // FK ownership: a referenced conversation MUST belong to the caller, else 404 (no leakage).
    if (conversationId !== null) {
      const owned = await client.query(
        `SELECT 1 FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
        [conversationId, oid]
      );
      if (owned.rowCount === 0) {
        throw buildKnownError("NOT_FOUND", "Referenced conversation not found.", 404);
      }
    }

    // Persist the owner-scoped attachment row. id = attachmentId so row id ↔ blob path are 1:1.
    // created_by = the signed-in OID (explicit ownership; RLS is the defence-in-depth layer).
    const inserted = await client.query(
      `
      INSERT INTO public.theo_attachments
        (id, created_by, conversation_id, filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id, conversation_id, filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path, created_at
      `,
      [attachmentId, oid, conversationId, filename, contentType, byteSize, STORAGE_CONTAINER, blobKey, ingestionClass, extractedTextPath]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({ attachment: inserted.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_finalize_attachment failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create this attachment.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // Duplicate primary key: this attachment id was already finalized.
    if (err && err.code === "23505") {
      return send(context, 409, errorBody("CONFLICT", "This attachment has already been finalized.", 409));
    }
    // FK violation: conversation_id absent / not owned.
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Referenced conversation not found.", 404));
    }
    // CHECK violation (non-empty filename / byte_size >= 0), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Attachment violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

## §SM-FJ — Primary Reference function.json (deployed `theo_finalize_attachment.function.json`, byte-identical)
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_finalize_attachment"
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

## §HG.1 — `theo_upsert_artifact/index.js` (full)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const TITLE_MAX_LEN = 200;
const CONTENT_MAX_BYTES = 1024 * 1024; // 1 MiB per artifact version (text); generous for docs/code/html
const VALID_TYPES = ["document", "code", "html"];

const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
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

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code; err.status = status; err.isKnown = true;
  return err;
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// content_type stored on the version row, by artifact type (mirrors how the FE renders each type).
function contentTypeFor(type) {
  if (type === "html") return "text/html; charset=utf-8";
  if (type === "code") return "text/plain; charset=utf-8";
  return "text/markdown; charset=utf-8";
}

// ---- Managed-identity data-plane Blob access (verbatim technique from the deployed theo_finalize_attachment, B8h) ----
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
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
    if (body) req.write(body);
    req.end();
  });
}

async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error("Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing).");
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) throw new Error("Managed Identity token endpoint did not return access_token.");
  return payload.access_token;
}

function encodeBlobPath(blobKey) { return blobKey.split("/").map(encodeURIComponent).join("/"); }
function blobUrlFor(accountName, containerName, blobKey) {
  return `https://${accountName}.blob.core.windows.net/${containerName}/${encodeBlobPath(blobKey)}`;
}

async function putTextBlob(accountName, containerName, blobKey, text, contentType) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const bodyBuf = Buffer.from(text, "utf8");
  const r = await requestUrl(
    blobUrlFor(accountName, containerName, blobKey),
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-ms-version": "2022-11-02",
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": contentType,
        "Content-Length": bodyBuf.length,
      },
    },
    bodyBuf
  );
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`PUT artifact blob failed (${r.statusCode}): ${r.body}`);
  }
}

async function deleteBlobBestEffort(context, accountName, containerName, blobKey) {
  try {
    const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
    await requestUrl(blobUrlFor(accountName, containerName, blobKey), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" },
    });
  } catch (e) {
    context.log.warn("theo_upsert_artifact: best-effort blob cleanup failed", e);
  }
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

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return send(context, 400, errorBody("INVALID_REQUEST", "Field 'title' is required and must be non-blank.", 400));
  if (title.length > TITLE_MAX_LEN) return send(context, 400, errorBody("INVALID_REQUEST", `Field 'title' must be at most ${TITLE_MAX_LEN} characters.`, 400));

  const type = typeof body.type === "string" ? body.type.trim() : "";
  if (!VALID_TYPES.includes(type)) return send(context, 400, errorBody("INVALID_REQUEST", "Field 'type' must be one of 'document', 'code', 'html'.", 400));

  if (typeof body.content !== "string") return send(context, 400, errorBody("INVALID_REQUEST", "Field 'content' is required and must be a string.", 400));
  const content = body.content;
  if (Buffer.byteLength(content, "utf8") > CONTENT_MAX_BYTES) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'content' must be at most ${CONTENT_MAX_BYTES} bytes.`, 400));
  }

  let conversationId = null;
  if (body.conversation_id != null) {
    if (!isUuid(body.conversation_id)) return send(context, 400, errorBody("INVALID_REQUEST", "Field 'conversation_id', when supplied, must be a valid UUID.", 400));
    conversationId = body.conversation_id;
  }
  let projectId = null;
  if (body.project_id != null) {
    if (!isUuid(body.project_id)) return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id', when supplied, must be a valid UUID.", 400));
    projectId = body.project_id;
  }

  const byteSize = Buffer.byteLength(content, "utf8");
  const contentType = contentTypeFor(type);

  let client = null;
  let writtenBlobKey = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    await client.query(
      `SELECT set_config('app.current_user_id', $1, false),
              set_config('request.jwt.claim.sub', $1, false),
              set_config('request.jwt.claim.oid', $1, false)`,
      [oid]
    );

    // Upsert-by-title (owner-scoped, case-insensitive) — mirrors the FE upsert(): a reused title adds
    // a new version; a new title creates the artifact at v1. The connection role bypasses RLS, so the
    // explicit created_by predicate enforces ownership.
    const existing = await client.query(
      `SELECT id, current_version FROM public.theo_artifacts
       WHERE created_by = $1 AND lower(title) = lower($2)
       ORDER BY updated_at DESC LIMIT 1`,
      [oid, title]
    );

    let artifactId;
    let versionNumber;
    if (existing.rowCount > 0) {
      artifactId = existing.rows[0].id;
      versionNumber = existing.rows[0].current_version + 1;
    } else {
      const created = await client.query(
        `INSERT INTO public.theo_artifacts (created_by, conversation_id, project_id, title, type, current_version)
         VALUES ($1, $2, $3, $4, $5, 1)
         RETURNING id`,
        [oid, conversationId, projectId, title, type]
      );
      artifactId = created.rows[0].id;
      versionNumber = 1;
    }

    const blobKey = `artifacts/${oid}/${artifactId}/v${versionNumber}.txt`;
    await putTextBlob(STORAGE_ACCOUNT, STORAGE_CONTAINER, blobKey, content, contentType);
    writtenBlobKey = blobKey;

    await client.query(
      `INSERT INTO public.theo_artifact_versions
         (created_by, artifact_id, version_number, blob_container, blob_path, byte_size, content_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [oid, artifactId, versionNumber, STORAGE_CONTAINER, blobKey, byteSize, contentType]
    );

    // Bump the pointer + type on an existing artifact (a re-version may change the type); leave the
    // original conversation_id/project_id linkage intact. On create, current_version is already 1.
    const updated = await client.query(
      `UPDATE public.theo_artifacts
       SET current_version = $1, type = $2, updated_at = now()
       WHERE id = $3 AND created_by = $4
       RETURNING id, conversation_id, project_id, title, type, current_version, created_at, updated_at`,
      [versionNumber, type, artifactId, oid]
    );
    if (updated.rowCount === 0) {
      // Should not happen (we just created/found it under this oid), but never leave a partial write.
      throw buildKnownError("NOT_FOUND", "Artifact not found.", 404);
    }

    await client.query("COMMIT");
    return send(context, existing.rowCount > 0 ? 200 : 201, successBody({ artifact: { ...updated.rows[0], version_number: versionNumber } }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    if (writtenBlobKey) await deleteBlobBestEffort(context, STORAGE_ACCOUNT, STORAGE_CONTAINER, writtenBlobKey);
    context.log.error("theo_upsert_artifact failed", err);

    if (err && err.code === "42501") return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this artifact.", 403));
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    if (err && err.code === "23503") return send(context, 404, errorBody("NOT_FOUND", "Referenced conversation or project not found.", 404));
    if (err && err.code === "23514") return send(context, 400, errorBody("INVALID_REQUEST", "Artifact violates a field constraint.", 400));
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```
## §FJ.1 — `theo_upsert_artifact/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_upsert_artifact"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.2 — `theo_list_artifacts/index.js` (full)
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
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
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
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
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

  // Optional ?conversationId filter (scopes to one thread's artifacts; backs the reload path).
  const rawConv = req.query ? req.query.conversationId : undefined;
  let conversationId = null;
  if (rawConv != null && rawConv !== "") {
    if (!isUuid(rawConv)) return send(context, 400, errorBody("INVALID_REQUEST", "Query 'conversationId', when supplied, must be a valid UUID.", 400));
    conversationId = rawConv;
  }

  const client = await pool.connect();
  try {
    await client.query(
      `SELECT set_config('app.current_user_id', $1, false),
              set_config('request.jwt.claim.sub', $1, false),
              set_config('request.jwt.claim.oid', $1, false)`,
      [oid]
    );

    // Explicit ownership scope (the connection role bypasses RLS). Newest-updated first. Metadata only —
    // version content lives in Blob and is fetched per-artifact via theo_get_artifact.
    const params = [oid];
    let where = "created_by = $1";
    if (conversationId) { params.push(conversationId); where += ` AND conversation_id = $${params.length}`; }

    const result = await client.query(
      `SELECT id, conversation_id, project_id, title, type, current_version, created_at, updated_at
       FROM public.theo_artifacts
       WHERE ${where}
       ORDER BY updated_at DESC, id DESC
       LIMIT 500`,
      params
    );

    return send(context, 200, successBody({ artifacts: result.rows }));
  } catch (err) {
    context.log.error("theo_list_artifacts failed", err);
    if (err && err.code === "42501") return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list artifacts.", 403));
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```
## §FJ.2 — `theo_list_artifacts/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_artifacts"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.3 — `theo_get_artifact/index.js` (full)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
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
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code; err.status = status; err.isKnown = true;
  return err;
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// ---- Managed-identity data-plane Blob access (verbatim technique from the deployed theo_finalize_attachment, B8h) ----
function requestBinary(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const https = require("https");
    const url = new URL(urlStr);
    const req = https.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => { chunks.push(chunk); });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: Buffer.concat(chunks) }); });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function requestUrl(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
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
    req.end();
  });
}

async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error("Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing).");
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) throw new Error("Managed Identity token endpoint did not return access_token.");
  return payload.access_token;
}

function encodeBlobPath(blobKey) { return blobKey.split("/").map(encodeURIComponent).join("/"); }
function blobUrlFor(accountName, containerName, blobKey) {
  return `https://${accountName}.blob.core.windows.net/${containerName}/${encodeBlobPath(blobKey)}`;
}

async function downloadBlob(accountName, containerName, blobKey) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const r = await requestBinary(blobUrlFor(accountName, containerName, blobKey), {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode < 200 || r.statusCode >= 300) throw new Error(`GET blob failed (${r.statusCode})`);
  return r.body; // Buffer
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

  const artifactId = req.query ? req.query.artifactId : undefined;
  if (!isUuid(artifactId)) return send(context, 400, errorBody("INVALID_REQUEST", "Query 'artifactId' is required and must be a valid UUID.", 400));

  const client = await pool.connect();
  try {
    await client.query(
      `SELECT set_config('app.current_user_id', $1, false),
              set_config('request.jwt.claim.sub', $1, false),
              set_config('request.jwt.claim.oid', $1, false)`,
      [oid]
    );

    const artifact = await client.query(
      `SELECT id, conversation_id, project_id, title, type, current_version, created_at, updated_at
       FROM public.theo_artifacts
       WHERE id = $1 AND created_by = $2`,
      [artifactId, oid]
    );
    if (artifact.rowCount === 0) {
      const existsResult = await client.query(`SELECT public.theo_artifact_exists_unscoped($1::uuid) AS e`, [artifactId]);
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this artifact.", 403)
        : buildKnownError("NOT_FOUND", "Artifact not found.", 404);
    }

    const versionRows = await client.query(
      `SELECT version_number, blob_container, blob_path, byte_size, content_type, created_at
       FROM public.theo_artifact_versions
       WHERE artifact_id = $1 AND created_by = $2
       ORDER BY version_number ASC`,
      [artifactId, oid]
    );

    // Read each version body from Blob (server-side, managed identity). The row carries the container +
    // key; the account is the configured storage account. Small text; sequential is fine. A failed
    // blob read degrades to "" for that version rather than failing the whole artifact fetch.
    const versions = [];
    for (const v of versionRows.rows) {
      let content = "";
      try {
        const buf = await downloadBlob(STORAGE_ACCOUNT, v.blob_container, v.blob_path);
        content = buf.toString("utf8");
      } catch (e) {
        context.log.warn("theo_get_artifact: version blob read failed", { artifactId, version: v.version_number, e });
      }
      versions.push({
        version_number: v.version_number,
        content,
        byte_size: v.byte_size,
        content_type: v.content_type,
        created_at: v.created_at,
      });
    }

    return send(context, 200, successBody({ artifact: { ...artifact.rows[0], versions } }));
  } catch (err) {
    context.log.error("theo_get_artifact failed", err);
    if (err && err.code === "42501") return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this artifact.", 403));
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```
## §FJ.3 — `theo_get_artifact/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_get_artifact"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.4 — `theo_delete_artifact/index.js` (full)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
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

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code; err.status = status; err.isKnown = true;
  return err;
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// ---- Managed-identity data-plane Blob access (verbatim technique from the deployed theo_finalize_attachment, B8h) ----
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
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
    if (body) req.write(body);
    req.end();
  });
}

async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error("Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing).");
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) throw new Error("Managed Identity token endpoint did not return access_token.");
  return payload.access_token;
}

function encodeBlobPath(blobKey) { return blobKey.split("/").map(encodeURIComponent).join("/"); }
function blobUrlFor(accountName, containerName, blobKey) {
  return `https://${accountName}.blob.core.windows.net/${containerName}/${encodeBlobPath(blobKey)}`;
}

async function deleteBlobBestEffort(context, accountName, containerName, blobKey) {
  try {
    const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
    await requestUrl(blobUrlFor(accountName, containerName, blobKey), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" },
    });
  } catch (e) {
    context.log.warn("theo_delete_artifact: best-effort blob cleanup failed", e);
  }
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

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!isUuid(id)) return send(context, 400, errorBody("INVALID_REQUEST", "Field 'id' is required and must be a valid UUID.", 400));

  let client = null;
  let blobsToDelete = [];
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    await client.query(
      `SELECT set_config('app.current_user_id', $1, false),
              set_config('request.jwt.claim.sub', $1, false),
              set_config('request.jwt.claim.oid', $1, false)`,
      [oid]
    );

    // Capture version blob pointers first (own rows) so we can best-effort delete the blobs after commit.
    const versions = await client.query(
      `SELECT blob_container, blob_path FROM public.theo_artifact_versions
       WHERE artifact_id = $1 AND created_by = $2`,
      [id, oid]
    );
    blobsToDelete = versions.rows;

    const deleted = await client.query(
      `DELETE FROM public.theo_artifacts WHERE id = $1 AND created_by = $2 RETURNING id`,
      [id, oid]
    );
    if (deleted.rowCount === 0) {
      const existsResult = await client.query(`SELECT public.theo_artifact_exists_unscoped($1::uuid) AS e`, [id]);
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this artifact.", 403)
        : buildKnownError("NOT_FOUND", "Artifact not found.", 404);
    }

    await client.query("COMMIT"); // theo_artifact_versions rows cascade (FK ON DELETE CASCADE)

    // Best-effort blob cleanup (never blocks the delete result).
    for (const v of blobsToDelete) {
      await deleteBlobBestEffort(context, STORAGE_ACCOUNT, v.blob_container, v.blob_path);
    }

    return send(context, 200, successBody({ deleted: true, id }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_delete_artifact failed", err);
    if (err && err.code === "42501") return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this artifact.", 403));
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```
## §FJ.4 — `theo_delete_artifact/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_delete_artifact"
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

## §SM-TABLE — Structural Mirror (every region → Primary Reference, with classification)
| Region | Primary Reference region (`theo_finalize_attachment`) | Classification |
| --- | --- | --- |
| `pg` Pool + `ssl`; `corsHeaders`; `send`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`buildKnownError`/`isUuid` helper block | identical | EXACT |
| Managed-identity Blob helpers (`getManagedIdentityAccessToken`, `requestUrl`/`requestBinary`, `blobUrlFor`, `encodeBlobPath`, `putTextBlob`, `downloadBlob`, `deleteBlobBestEffort`) | identical (lifted byte-identical) | EXACT |
| OID extraction + 401; `parseBody` + 400; input validation (deterministic 400s) | same discipline; artifact field set (`title`/`type`/`content`/ids) | ALLOWED DELTA (validated field set) |
| `connect`→`BEGIN`→`set_config` triad (upsert/delete); read-only variants (list/get) | same triad; finalize is a single mutation | ALLOWED DELTA (read-only handlers omit BEGIN/COMMIT) |
| Owner-scoped SQL over `theo_artifacts`/`theo_artifact_versions` (upsert-by-title INSERT/UPDATE + version INSERT; list SELECT; get SELECT+versions; delete DELETE-RETURNING) | finalize INSERTs the attachment row owner-scoped | ALLOWED DELTA (tables/verbs; version model) |
| Blob write/read/delete via the MI helpers (`putTextBlob`/`downloadBlob`/`deleteBlobBestEffort`) | finalize `putTextBlob` (extracted text) / `downloadBlob` (source) | EXACT (helpers) / ALLOWED DELTA (call sites) |
| 0-row get/delete → `theo_artifact_exists_unscoped` → 403/404 | finalize has no update/delete; idiom matches the family `_exists_unscoped` split | ALLOWED DELTA (helper name; idiom from family) |
| `COMMIT` + success envelope (`{ artifact }` / `{ artifacts }` / `{ deleted, id }`) | same `{ data, meta }` shape | ALLOWED DELTA (response payload) |
| `catch` ROLLBACK + 42501→403 / 23503→404 / 23514→400 / isKnown / 500 | same mapping (finalize maps storage/DB errors) | EXACT / ALLOWED DELTA (23503/23514 added) |
| Attachment text-extraction block (xlsx/mammoth/pdf-parse/officeparser) | present in finalize | NOT MIRRORED (attachment-specific; artifacts store model-authored text as-is) |
| `function.json` (httpTrigger, anonymous, underscore route) | identical binding shape | EXACT / ALLOWED DELTA (route names; GET vs POST per verb) |

No new external-system helper; no DEVIATION. `theo_message`/`theo_message_stream` unmodified.

## §PARITY — Golden Handler Standard parity checklist (§5.4)
- [x] Single canonical Primary Reference handler + function.json selected and inlined full-verbatim (§SM/§SM-FJ).
- [x] Structural Mirror Table present, every region classified + anchored (§SM-TABLE).
- [x] Executes as the signed-in user (OID); explicit `created_by` predicate on every query; RLS second layer.
- [x] Reads/writes only `theo_` tables + the `theo-content` Blob container; no `reporting_*`; no gateway-handler change; no tokens/OIDs/URLs leaked.
- [x] Input validated against contract; deterministic 400s before SQL/Blob; spec status codes (401/400/403/404/500).
- [x] No migration; no prohibited psql meta-commands (no governed `sql` blocks).
- [x] Deterministic golden curls for every endpoint (§CURL); `node --check` clean all four handlers; `function.json` JSON-valid.

---

## §DEPLOY — Walter deploy steps (four new functions; no migration, no env, no dependency)
1. Create `theo_upsert_artifact` (§HG.1 + §FJ.1).
2. Create `theo_list_artifacts` (§HG.2 + §FJ.2).
3. Create `theo_get_artifact` (§HG.3 + §FJ.3).
4. Create `theo_delete_artifact` (§HG.4 + §FJ.4).
5. Reply "B4h backend deployed" → Claude Code runs §CURL. (Managed identity already has Storage Blob Data access — the deployed B8h finalize writes `theo-content` server-side; no new role grant.)

## §CURL — verification plan (token via `az`; never printed; captured under `.local/`)
1. **Upsert v1** — `POST theo_upsert_artifact {title:"Golden Artifact <ts>", type:"document", content:"# v1 body"}` → **201** `{ artifact:{ id:A, current_version:1 } }`.
2. **Upsert v2 (same title)** — `POST theo_upsert_artifact {title:"Golden Artifact <ts>", type:"document", content:"# v2 body"}` → **200**; `current_version:2`, same `id:A`.
3. **List** — `GET theo_list_artifacts` → **200**; A present with `current_version:2` (metadata only, no content).
4. **Get** — `GET theo_get_artifact?artifactId=A` → **200**; `versions.length===2`, `versions[0].content==="# v1 body"`, `versions[1].content==="# v2 body"` (content read back from Blob).
5. **Validation** — upsert blank title / bad type / non-string content → 400; get/delete bad `id` uuid → 400; list bad `?conversationId` → 400.
6. **Ownership** — get/delete a nonexistent `artifactId` → **404** (existing-foreign → 403 needs a 2nd identity — not curl-run).
7. **Delete** — `POST theo_delete_artifact {id:A}` → **200** `{deleted:true}`; `GET theo_get_artifact?artifactId=A` → 404 (gone; versions cascaded); `GET theo_list_artifacts` omits A.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B4h Artifacts Persistence (backend) Pass-1 Backend VEP (plan only).*
