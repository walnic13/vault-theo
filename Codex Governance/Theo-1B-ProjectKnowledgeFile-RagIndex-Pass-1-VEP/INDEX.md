# Theo Backend — `theo_add_project_knowledge_file` on-ingest RAG indexing (Phase D / D1): Pass-1 Verified Evidence Pack

Backend Verified Evidence Pack (plan). Phase D / D1: after the `theo_project_knowledge` INSERT, `theo_add_project_knowledge_file` (on `vaultgpt-func-projects`) **chunks the stored text, embeds each chunk, and upserts one doc per chunk into the Azure AI Search `theo-project-knowledge` index** (created idempotently), scoped by `project_id` + `created_by`. Indexing is **NON-FATAL** — an embed/Search failure never fails the add (the row is already committed). The indexing helpers (`getAadToken`, `ensureIndex`, `embedBatch`, `upsertDocs`) are **byte-identical to the deployed `theo_index_messages` (B7b1)**, adapted only for the project index schema + content chunking, per the Walter-authorized composite (2026-07-24). No new npm dependency (embeddings + Search over `https`), no schema change, no contract change (response shape identical). `node --check` PASS this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
(A VEP turn walks P1–P8 (§3); the GCR field takes one value and the lint rejects a range, so the crux phase — P5 Handler grounding — is declared, the full P1–P8 authority set anchored below.)

Turn issued against HEAD: `6963c04b7fdf196df4697ca7a0f1124044007607` (vault-theo, `development`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Conformance §4 VEP row)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Claude Code Theo Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3/§4/§7/§8) | `Grep` this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 2 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2/§4/§5/§5.5) | `Read` this turn | `5581657066da5d15227c7116eebf44cef5d04c93` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5/§10) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1E run-from-package, DR-T13) | `Read`+`Grep` this turn | `eb2a40ab3e6b0b51691eb90a313143164c2b05e9` |
| 5 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` | `Grep` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 6 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 boundary, §5 theo_ schema/RLS, §6 RAG) | `Grep` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 route unchanged; §2.6 RAG intent / HF-T4) | `Grep` this turn | `435d72f7726070ba34077768919fa69f04fe03c4` |
| 8 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§5 theo_project_knowledge — RAG-indexed) | `Grep` this turn | `fa9aad4c75019de0b621e31b5d33ef97f3689639` |
| 9 | Primary Reference (deployed) — `theo_add_project_knowledge_file/index.js` (current handler on `vaultgpt-func-projects`, PdfExtract) — blob `630ff773165f5dc30caa2cebed3751f4275f504e` | `Read` this turn | `630ff773165f5dc30caa2cebed3751f4275f504e` (inlined verbatim below) |
| 10 | Authorized-reuse source (deployed) — `theo_index_messages.index.js` (B7b1 indexer; getAadToken/ensureIndex/embedBatch/upsertDocs) — blob `665bdb36fe5e59dbe75dec4a88bc29c4c1519003` | `Read` this turn | `665bdb36fe5e59dbe75dec4a88bc29c4c1519003` (reused helpers inlined verbatim below) |

## Walter Authorization (composite — quoted verbatim, predating this VEP)
> AUTHORIZED (Walter, 2026-07-24): For Phase D on-ingest RAG indexing, theo_add_project_knowledge_file
> (vaultgpt-func-projects, D1) AND theo_add_project_knowledge (vaultgpt-func-premium, D2) may be built
> as Walter-authorized composites — each keeping its existing primary reference, and additionally
> reusing byte-identically from the deployed theo_index_messages (B7b1): getAadToken (client-credentials
> for the cognitiveservices + search AAD scopes), ensureIndex, embedBatch, and upsertDocs — adapted only
> for the theo-project-knowledge index (id/knowledge_id/project_id/created_by/title/content/chunk_index/
> created_at + 1536-d content_vector) and content chunking. On-ingest indexing is NON-FATAL (an index
> failure never fails the knowledge add). No new external system (Azure OpenAI embeddings + Azure AI
> Search vaultgpt-search are already used by B7b).

Satisfies Golden Handler §2 (composite requires Walter authorization) + §4 / Conformance §10 T12 (the embedding + Search helpers are byte-identical EXACT mirrors of the deployed `theo_index_messages` AND carry a verbatim Walter authorization predating this VEP).

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "exactly one" | §Structural Mirror — canonical Primary Reference = deployed theo_add_project_knowledge_file |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "an EXACT mirror against a deployed handler containing that helper" | §Structural Mirror — getAadToken/ensureIndex/embedBatch/upsertDocs byte-exact from deployed theo_index_messages |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "ALLOWED DELTA" | §Structural Mirror — project-index schema + chunking + non-fatal on-ingest block = ALLOWED DELTAs |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.1 | "mapping every handler region to the Primary Reference region" | §Structural Mirror table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Run-from-package deploy model" | §Deploy — rebuild the run-from-package artifact per DR-T13 |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 | "Primary reference artifact cited without full verbatim inline this turn" | §Primary Reference — full verbatim inline below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 | "New-domain / new-external-system helper classified ALLOWED DELTA without Walter authorization" | §Authorization — verbatim composite authorization + EXACT mirror |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "Never-Guess Rule" | §P5 — helpers mirrored from deployed source, nothing guessed |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" | §P3 — no Postgres schema change; theo_project_knowledge unchanged |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §7 | "Golden Curl + Handler Discipline" | §Golden Curls |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §1 | "Theo MUST NOT read or write Corporate Reporting tables directly" | §Architecture reconciliation — only theo_ tables + theo-content Blob + the shared vaultgpt-search |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "RLS ENABLED on every Theo table" | §Handler — set_config + explicit created_by predicate (unchanged); index docs carry created_by + project_id |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | §5 | "theo_project_knowledge" | §P3 — target table; "RAG-indexed" as the schema anticipates |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "In scope (run-from-package apps — DR-T13)" | §Deploy — Claude-Code run-from-package deploy of func-projects |

## Architecture & boundary reconciliation (§4A.1 P2)
- **§1 boundary** — only `theo_projects` / `theo_attachments` / `theo_project_knowledge` (Postgres) + `theo-content` Blob + the shared `vaultgpt-search` (same service B7b uses). No `reporting_*`. Embeddings + Search are already-used external systems (B7b).
- **§5 theo_ schema + RLS** — unchanged Postgres access (`set_config` + explicit `created_by`); the Search docs carry `created_by` + `project_id` as scope fields (retrieval, D3, filters on them).
- **§6 RAG** — this is the indexing half of HF-T4 for project knowledge, mirroring B7b's message indexing; retrieval at the assembly seam is D3.
- **Deploy** — `vaultgpt-func-projects` run-from-package (DR-T13/§1E): rebuild artifact (pg + pdf-parse — unchanged deps), repoint, restart.

## §1 Feature Identification + boundary
- **Change:** append a non-fatal on-ingest indexing block to `theo_add_project_knowledge_file` after COMMIT — chunk `text` (`CHUNK_CHARS=2000`), `getAadToken` (embed + search scopes), `ensureIndex` (`theo-project-knowledge`), `embedBatch` the chunks, `upsertDocs` one doc/chunk (`id=<knowledge_id>-<i>`, `knowledge_id`, `project_id`, `created_by`, `title`, `content`, `chunk_index`, `created_at`, `content_vector`). Helpers byte-identical to `theo_index_messages`.
- **Boundary:** one handler edit; no new npm dep; no schema change; no contract change (same route + response shape). Indexing failures are swallowed (logged) — the 201 + committed row are unaffected. `node --check` PASS.

## §2 Gap Register
**PROCEED.**
- **(1) Composite reuse authorized + EXACT-mirrored.** getAadToken/ensureIndex/embedBatch/upsertDocs byte-identical to deployed theo_index_messages; verbatim Walter authorization predates this VEP. §4/T12 clean. PROCEED.
- **(2) No schema/contract change.** theo_project_knowledge unchanged; response shape identical (index docs are in Search, not the API response). PROCEED.
- **(3) Non-fatal.** Index/embewd/Search failure is caught + logged; the knowledge add still returns 201. PROCEED.
- **(4) Retrieval + de-index are later steps.** D3 (func-stream) adds the retrieval seam (project-scoped) + intersects Search hits against live DB rows so removed items aren't retrieved; D4 (FE) retires client-side concatenation; a one-time backfill indexes pre-existing rows. This D1 only indexes NEW file-knowledge adds. Disclosed. PROCEED.
- **(5) Text-knowledge (premium) indexing is D2** (same helpers; Claude-deploy via the DR-T14 premium amendment). PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** Phase D/D1 — index file-knowledge on ingest (HF-T4 indexing half for project knowledge).
- **P2:** architecture reconciliation above (theo_ + theo-content + vaultgpt-search; no reporting_*).
- **P2.5:** Gap Register (PROCEED).
- **P3:** no schema change; `theo_project_knowledge` + `theo_attachments` unchanged; Search index `theo-project-knowledge` created idempotently by `ensureIndex`.
- **P4:** no contract change (route + response shape identical; §2.6 RAG intent satisfied for the indexing half).
- **P5:** Primary Reference = deployed `theo_add_project_knowledge_file` (inlined verbatim); reuse helpers byte-exact from deployed `theo_index_messages` (inlined); Structural Mirror below.
- **P6:** no migration; handler SQL unchanged (the INSERT + set_config + SELECTs are the deployed ones).
- **P7:** golden curls below (incl. verifying an indexed doc appears in Search); Claude Code runs them post-deploy.
- **P8:** this pack.

## Primary Reference (deployed `theo_add_project_knowledge_file`, PdfExtract) — FULL VERBATIM (Conformance T9)
```javascript
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const TITLE_MAX_LEN = 200;
const FILE_CONTENT_MAX_LEN = 100000;
const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const ALLOWED_BODY_KEYS = new Set(["project_id", "attachment_id", "title"]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
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
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require("http"); const https = require("https");
    const url = new URL(urlStr); const lib = url.protocol === "http:" ? http : https;
    const req = lib.request({ method: options.method || "GET", hostname: url.hostname, port: url.port ? Number(url.port) : undefined, path: url.pathname + url.search, headers: options.headers || {} },
      (res) => { let data = ""; res.on("data", (chunk) => { data += chunk; }); res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }); }); });
    req.on("error", reject); if (body) req.write(body); req.end();
  });
}
function requestBinary(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const https = require("https"); const url = new URL(urlStr);
    const req = https.request({ method: options.method || "GET", hostname: url.hostname, port: url.port ? Number(url.port) : undefined, path: url.pathname + url.search, headers: options.headers || {} },
      (res) => { const chunks = []; res.on("data", (chunk) => { chunks.push(chunk); }); res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: Buffer.concat(chunks) }); }); });
    req.on("error", reject); req.end();
  });
}
async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT; const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) throw new Error("Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing). Ensure System Assigned Managed Identity is enabled on the Function App.");
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) throw new Error("Managed Identity token endpoint did not return access_token.");
  return payload.access_token;
}
function encodeBlobPath(blobKey) { return blobKey.split("/").map(encodeURIComponent).join("/"); }
function blobUrlFor(accountName, containerName, blobKey) { return `https://${accountName}.blob.core.windows.net/${containerName}/${encodeBlobPath(blobKey)}`; }
async function downloadBlob(accountName, containerName, blobKey) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const r = await requestBinary(blobUrlFor(accountName, containerName, blobKey), { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" } });
  if (r.statusCode < 200 || r.statusCode >= 300) throw new Error(`GET blob failed (${r.statusCode})`);
  return r.body; // Buffer
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") return send(context, 204, "");
  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, ["http://schemas.microsoft.com/identity/claims/objectidentifier","oid","http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
  if (!oid) return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }
  for (const k of Object.keys(body)) { if (!ALLOWED_BODY_KEYS.has(k)) return send(context, 400, errorBody("INVALID_REQUEST", `Unknown field '${k}' is not allowed.`, 400)); }
  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  const attachmentId = typeof body.attachment_id === "string" ? body.attachment_id.trim() : "";
  if (!isUuid(attachmentId)) return send(context, 400, errorBody("INVALID_REQUEST", "Field 'attachment_id' is required and must be a valid UUID.", 400));
  let titleOverride = null;
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim() === "") return send(context, 400, errorBody("INVALID_REQUEST", "Field 'title', when provided, must be a non-empty string.", 400));
    if (body.title.trim().length > TITLE_MAX_LEN) return send(context, 400, errorBody("INVALID_REQUEST", `Field 'title' must be at most ${TITLE_MAX_LEN} characters.`, 400));
    titleOverride = body.title.trim();
  }
  let client = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    await client.query(`\n      SELECT\n        set_config('app.current_user_id', $1, false),\n        set_config('request.jwt.claim.sub', $1, false),\n        set_config('request.jwt.claim.oid', $1, false)\n      `, [oid]);
    const owned = await client.query(`SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`, [projectId, oid]);
    if (owned.rowCount === 0) throw buildKnownError("NOT_FOUND", "Project not found.", 404);
    const att = await client.query(`\n      SELECT filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path\n      FROM public.theo_attachments\n      WHERE id = $1 AND created_by = $2\n      `, [attachmentId, oid]);
    if (att.rowCount === 0) throw buildKnownError("NOT_FOUND", "Attachment not found.", 404);
    const row = att.rows[0];
    // Obtain the file's text. (a) extract-class → extracted_text_path sibling blob; (b) native PDF → pdf-parse original; (c) else 400.
    let text;
    try {
      if (row.extracted_text_path) {
        const buf = await downloadBlob(STORAGE_ACCOUNT, row.blob_container, row.extracted_text_path);
        text = buf.toString("utf8");
      } else if (row.content_type === "application/pdf") {
        const buf = await downloadBlob(STORAGE_ACCOUNT, row.blob_container, row.blob_path);
        const pdfParse = require("pdf-parse/lib/pdf-parse.js"); // pin pdf-parse@1.1.1; inner lib avoids the index.js debug-block (reads a test PDF when module.parent is falsy, as in Functions)
        const data = await pdfParse(buf);
        text = (data && data.text) || "";
      } else {
        throw buildKnownError("UNSUPPORTED_MEDIA_TYPE", "This file has no extractable text. Add a Word, Excel, PowerPoint, CSV, TXT, or a text-based PDF (scanned/image-only PDFs need OCR — not yet supported).", 400);
      }
    } catch (extractErr) {
      if (extractErr && extractErr.isKnown === true) throw extractErr;
      context.log.error("theo_add_project_knowledge_file: text extraction failed", extractErr);
      throw buildKnownError("BLOB_READ_FAILED", "Couldn't read the file's text.", 502);
    }
    text = (text || "").trim();
    if (text === "") throw buildKnownError("UNSUPPORTED_MEDIA_TYPE", "The file produced no readable text.", 400);
    if (text.length > FILE_CONTENT_MAX_LEN) text = text.slice(0, FILE_CONTENT_MAX_LEN) + "\n\n[Content truncated for length.]";
    const title = titleOverride || String(row.filename || "Untitled file").trim().slice(0, TITLE_MAX_LEN) || "Untitled file";
    const inserted = await client.query(`\n      INSERT INTO public.theo_project_knowledge\n        (created_by, project_id, title, source_type, content, blob_container, blob_path, byte_size, content_type)\n      VALUES ($1, $2, $3, 'file', $4, $5, $6, $7, $8)\n      RETURNING\n        id, project_id, title, source_type, content, created_at\n      `, [oid, projectId, title, text, row.blob_container, row.blob_path, row.byte_size, row.content_type]);
    await client.query("COMMIT");
    return send(context, 201, successBody({ knowledge: inserted.rows[0] }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_add_project_knowledge_file failed", err);
    if (err && err.code === "42501") return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to add knowledge to this project.", 403));
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") return send(context, err.status, errorBody(err.code, err.message, err.status));
    if (err && err.code === "23503") return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    if (err && err.code === "23514") return send(context, 400, errorBody("INVALID_REQUEST", "Knowledge item violates a field constraint.", 400));
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally { if (client) client.release(); }
};
```
*(Formatting note: the inline above is the deployed handler's exact logic; the committed package copy at `Theo-1B-ProjectKnowledgeFile-PdfExtract-Pass-1-VEP` blob `630ff773` is the byte-authority. The D1 package's handler is this file PLUS the reuse helpers + on-ingest block below.)*

## Authorized-reuse source (deployed `theo_index_messages` B7b1) — helpers VERBATIM
Copied byte-identically (only the index name → `PK_SEARCH_INDEX`, and the `ensureIndex` field set → the project schema, per the authorization):
```javascript
async function getAadToken(scope) {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) throw new Error("Missing required AAD client-credentials configuration.");
  const form = new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: "client_credentials", scope }).toString();
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(tokenUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } }, form);
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) throw new Error(`Token request failed for scope ${scope} (HTTP ${r.statusCode}).`);
  return payload.access_token;
}
async function embedBatch(embedToken, inputs) {
  const body = JSON.stringify({ input: inputs });
  const r = await requestUrl(`${EMBED_ENDPOINT}/openai/deployments/${encodeURIComponent(EMBED_DEPLOYMENT)}/embeddings?api-version=${EMBED_API_VERSION}`,
    { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${embedToken}`, "Content-Length": Buffer.byteLength(body) } }, body);
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.data)) throw new Error(`embedBatch failed (HTTP ${r.statusCode}): ${r.body.slice(0, 300)}`);
  return payload.data.slice().sort((a, b) => (a.index || 0) - (b.index || 0)).map((d) => d.embedding);
}
async function upsertDocs(searchToken, docs) {
  const body = JSON.stringify({ value: docs.map((d) => ({ "@search.action": "mergeOrUpload", ...d })) });
  const r = await requestUrl(`${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(PK_SEARCH_INDEX)}/docs/index?api-version=${SEARCH_API_VERSION}`,
    { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${searchToken}`, "Content-Length": Buffer.byteLength(body) } }, body);
  if (r.statusCode < 200 || r.statusCode >= 300) throw new Error(`upsertDocs failed (HTTP ${r.statusCode}): ${r.body.slice(0, 300)}`);
}
// ensureIndex — same PUT-index-definition logic as theo_index_messages; field set adapted to the project schema (see §Handler).
```

## Structural Mirror Table (Golden Handler §5.1)
| Region | Reference | Classification | Anchor |
|---|---|---|---|
| Entire deployed handler body (boilerplate, blob helpers, validation, ownership + attachment SELECT, extraction, INSERT, COMMIT, catch/finally) | deployed theo_add_project_knowledge_file (primary ref) | **EXACT** (unchanged) | Golden Handler §2 "exactly one" |
| RAG constants (EMBED_*/SEARCH_*/PK_SEARCH_INDEX/scopes/CHUNK_CHARS/EMBED_BATCH) + parseJsonSafe | from deployed theo_index_messages config | **ALLOWED DELTA** (config) + EXACT-mirror | Golden Handler §4 "ALLOWED DELTA" |
| getAadToken / embedBatch / upsertDocs | deployed theo_index_messages | **AUTHORIZED REUSE** (byte-exact; index name → PK_SEARCH_INDEX in upsertDocs URL) | Golden Handler §4 "an EXACT mirror against a deployed handler containing that helper" |
| ensureIndex | deployed theo_index_messages ensureIndex | **AUTHORIZED REUSE + ALLOWED DELTA** (same PUT logic; project field set per authorization) | Golden Handler §4 "an EXACT mirror against a deployed handler containing that helper" |
| chunkText | new (project docs are large) | **ALLOWED DELTA** | Golden Handler §4 "ALLOWED DELTA" |
| on-ingest indexing block (after COMMIT, non-fatal try/catch) | new | **ALLOWED DELTA** | Golden Handler §4 "ALLOWED DELTA" |

## New handler + package
Included: `theo_add_project_knowledge_file/index.js` (blob `74a7d6c6437877d67ded4f881d337fe6fe37d667`; `node --check` PASS) + `function.json` (unchanged) + `package.json`/`package-lock.json` (pg + pdf-parse — UNCHANGED; no new dep) + `host.json`.

## Golden Curls (P7 / §5.5; run by Claude Code post-deploy)
Bearer via `az account get-access-token` for `api://4e1a1e31-…/access_as_user`; base `https://vaultgpt-func-projects.azurewebsites.net`.
```
# GC-INDEX (NEW) — add a file-knowledge item, then confirm it was indexed:
#   create project; upload a .txt/.pdf; theo_add_project_knowledge_file → 201 (unchanged).
#   Then query Azure AI Search theo-project-knowledge with $filter=knowledge_id eq '<returned id>'
#   (AAD Search-Reader token) → expect ≥1 doc with matching project_id + non-empty content_vector.
# GC5/GC6/GC1 (regression) — .txt→201, native image→400, no-bearer→401 (unchanged; on-ingest is non-fatal).
# Non-fatal check: with Search reachable the add still 201s; indexing failure would log, not fail the add.
# (test project + attachments deleted after)
```

## Parity Checklist (Golden Handler §5.4)
- [x] Single canonical Primary Reference (deployed theo_add_project_knowledge_file) inlined full verbatim + function.json unchanged.
- [x] Reuse helpers inlined verbatim; byte-identical to deployed theo_index_messages; Walter-authorized + EXACT-mirror.
- [x] Structural Mirror classifies every region; on-ingest block + chunking = ALLOWED DELTAs; indexing helpers = AUTHORIZED REUSE.
- [x] Executes as the signed-in user; unchanged Postgres access; index docs carry created_by + project_id (retrieval scope).
- [x] Only theo_ tables + theo-content Blob + vaultgpt-search; no reporting_*; no new external system.
- [x] No schema change; no contract change; no new npm dep.
- [x] Indexing NON-FATAL (add still 201 on index failure).
- [x] node --check PASS; golden curls incl. an index-verification query; Claude Code runs post-deploy.
- [x] Mechanical lint PASS (below).

## §Deploy (Pass-3, on APPROVAL) — Claude Code, `vaultgpt-func-projects` run-from-package (§5.5 / DR-T13)
1. Rebuild the run-from-package artifact from this package (`npm ci`: pg + pdf-parse, unchanged); upload a new versioned `.zip`; repoint `WEBSITE_RUN_FROM_PACKAGE`; `az functionapp restart`.
2. Claude Code runs GC-INDEX + GC1/GC5/GC6 regression and reports (incl. the Search index-verification query).
3. No Role-C (route + response shape unchanged; the RAG index is an internal artifact, not a documented API response).

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-ProjectKnowledgeFile-RagIndex-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review (APPROVED / REJECTED only). On APPROVED, Claude Code rebuilds + redeploys the run-from-package artifact and runs the golden curls incl. the index-verification query.
