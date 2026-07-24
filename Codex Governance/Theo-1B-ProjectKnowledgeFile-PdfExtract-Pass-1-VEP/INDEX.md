# Theo Backend — `theo_add_project_knowledge_file` PDF text extraction (native PDFs → file-backed knowledge): Pass-1 Verified Evidence Pack

Backend Verified Evidence Pack (plan). Amends the deployed `theo_add_project_knowledge_file` (on `vaultgpt-func-projects`) so a **text-based PDF that `theo_finalize_attachment` left native** (≤ 3 MB → no `extracted_text_path`) is text-extracted **in the handler via `pdf-parse`**, then stored as file-backed knowledge — instead of being rejected. Text PDFs (tax articles, rulings, memos) are a common knowledge source, so rejecting them was not acceptable. The extraction is **byte-identical to the deployed `theo_finalize_attachment` (B8h)** `pdf-parse` usage (Walter-authorized 2026-07-24). Only the text-acquisition block changes: prefer finalize's `extracted_text_path` (extract-class + large PDFs, unchanged) → else `pdf-parse` the original blob when `content_type='application/pdf'` → else reject (images / scanned-image PDFs; OCR out of scope). Adds `pdf-parse@1.1.1` to the app package. No premium change; no schema change; response *shape* unchanged. **Contract BEHAVIOR change:** native text PDFs (≤ 3 MB) now return **201** instead of the **400** the API Spec §2.2 note currently states — corrected via a **post-deploy §2.2 documentation Role-C** (deploy the 201 behavior, golden-curl-confirm, then immediately land the §2.2 correction; a brief, explicitly-disclosed doc-vs-runtime window — Gap Register §2). `node --check` PASS this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
(A VEP turn walks P1–P8 (§3); the GCR field takes one value and the lint rejects a range, so the crux phase — P5 Handler grounding — is declared, with the full P1–P8 authority set anchored below.)

Turn issued against HEAD: `5589be217618797c7963e5a37ba9c9b861df682c` (vault-theo, `development`; grounding parent `7e0c0b8cf1a82b536173cb59b29327e0696ba5cb`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance; not used as grounding evidence this turn).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Conformance §4 VEP row)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Claude Code Theo Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3/§4/§7/§8) | `Grep` this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 2 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2/§4/§5/§5.5 run-from-package) | `Read` this turn | `5581657066da5d15227c7116eebf44cef5d04c93` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5/§10) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1E run-from-package deploy actions, DR-T13) | `Read`+`Grep` this turn | `eb2a40ab3e6b0b51691eb90a313143164c2b05e9` |
| 5 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` | `Grep` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 6 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B8 extract; pdf-parse) | `Grep` this turn | `28183604ddfcfe80fa3f3dda6f78e437b88d32d6` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 boundary, §5 theo_ schema/RLS) | `Grep` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 `theo_add_project_knowledge_file` — response shape unchanged) | `Grep` this turn | `94145351007d3b336320fb56ac3719b9d0ce860e` |
| 9 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§5 theo_project_knowledge; §7 theo_attachments) | `Grep` this turn | `fa9aad4c75019de0b621e31b5d33ef97f3689639` |
| 10 | Primary Reference (deployed) — `theo_add_project_knowledge_file/index.js` (the current handler on `vaultgpt-func-projects`; repo copy = the run-from-package artifact source) — blob `159cd749dd98bf9e0b63347ae80be818675f0ea1` | `Read` this turn | `159cd749dd98bf9e0b63347ae80be818675f0ea1` (inlined verbatim below) |
| 11 | Authorized-reuse source (deployed) — `theo_finalize_attachment/index.js` (Kudu-GET from premium; the `pdf-parse` extraction block) | Kudu-GET + `Read` this turn | `20982 B` (reused block inlined verbatim below) |

## Walter Authorization (pdf-parse extraction — quoted verbatim, predating this VEP)
> AUTHORIZED (Walter, 2026-07-24): theo_add_project_knowledge_file (vaultgpt-func-projects)
> may extract text itself from an uploaded file when theo_finalize_attachment left it without
> extracted text — specifically PDF text extraction via pdf-parse (pinned 1.1.1), reused
> byte-identically from the deployed theo_finalize_attachment (B8h) — and add the pdf-parse
> dependency to the app. Scope: read the original blob (already authorized), run pdf-parse,
> store the text as file-backed knowledge content. No premium change; no new external system.

Satisfies Golden Handler §4 + Conformance §10 T12 (the `pdf-parse` text-extraction helper is a new capability for this handler; it is a byte-identical EXACT mirror of the deployed `theo_finalize_attachment` B8h block AND carries a verbatim Walter authorization predating this VEP).

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "exactly one" | §Structural Mirror — single canonical Primary Reference = the deployed theo_add_project_knowledge_file |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "an EXACT mirror against a deployed handler containing that helper" | §Structural Mirror — the pdf-parse block is a byte-exact mirror of deployed theo_finalize_attachment |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "ALLOWED DELTA" | §Structural Mirror — the restructured text-acquisition block + updated reject message = ALLOWED DELTAs |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.1 | "mapping every handler region to the Primary Reference region" | §Structural Mirror table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Run-from-package deploy model" | §Deploy — rebuild the run-from-package artifact (pg + pdf-parse) per the DR-T13 procedure |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 | "Primary reference artifact cited without full verbatim inline this turn" | §Primary Reference — full verbatim inline below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 | "New-domain / new-external-system helper classified ALLOWED DELTA without Walter authorization" | §Authorization — verbatim Walter pdf-parse authorization + EXACT mirror |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "Never-Guess Rule" | §P5 — pdf-parse block mirrored from the deployed source, nothing guessed |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" | §P3 — no schema change; existing theo_project_knowledge columns |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §7 | "Golden Curl + Handler Discipline" | §Golden Curls |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §1 | "Theo MUST NOT read or write Corporate Reporting tables directly" | §Architecture reconciliation — only theo_ tables + theo-content Blob |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "RLS ENABLED on every Theo table" | §Handler — set_config + explicit created_by predicate (unchanged) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.2 | "add project knowledge from a file" | §1/Gap(2) — same route + response shape; the native-PDF behavior note (400) is corrected to text-PDF acceptance (201) via a post-deploy §2.2 documentation Role-C (brief disclosed drift) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | §5 | "theo_project_knowledge" | §P3 — target table unchanged |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "In scope (run-from-package apps — DR-T13)" | §Deploy — Claude-Code run-from-package deploy of func-projects |

## Architecture & boundary reconciliation (§4A.1 P2)
- **§1 repository boundary** — unchanged: only `theo_projects` / `theo_attachments` / `theo_project_knowledge` + the `theo-content` Blob. No `reporting_*`. `pdf-parse` runs in-process over an already-owned Blob (no new external system — Blob is already used).
- **§5 theo_ schema + RLS** — unchanged: `set_config` + explicit `created_by` predicate; ownership-based.
- **Deploy** — `vaultgpt-func-projects` run-from-package (DR-T13 / §1E): rebuild the artifact with `pg` + `pdf-parse`, repoint `WEBSITE_RUN_FROM_PACKAGE`, restart.

## §1 Feature Identification + boundary
- **Change:** in `theo_add_project_knowledge_file`, replace the "reject when no `extracted_text_path`" guard with: prefer `extracted_text_path` (unchanged read) → else, for `content_type='application/pdf'`, download the original blob and `pdf-parse` it → else reject (no text; OCR out of scope). Store the resulting text as `source_type='file'` content (all else unchanged).
- **Why:** text PDFs are a common knowledge source; finalize marks PDFs ≤ 3 MB native (no extracted text) for the chat/vision path, so they were being rejected as knowledge.
- **Boundary:** one handler edit + `pdf-parse@1.1.1` added to the app package. No schema change; response *shape* identical; no premium change; no FE change (the FE already calls this route). **Contract behavior change** (native text PDF `400`→`201`) is handled by a **post-deploy §2.2 documentation Role-C** with an explicitly-disclosed temporary drift window (Gap Register §2). `node --check` PASS.

## §2 Gap Register
**PROCEED**, with one **post-deploy documentation Role-C** (the §2.2 behavior note, item 2).
- **(1) pdf-parse reuse authorized + EXACT-mirrored.** Byte-identical to deployed `theo_finalize_attachment` B8h (`require("pdf-parse/lib/pdf-parse.js")` inner-lib pin); verbatim Walter authorization predates this VEP. Golden Handler §4 / T12 clean. PROCEED.
- **(2) Contract BEHAVIOR change — post-deploy §2.2 documentation Role-C (disclosed drift).** No schema change and the response *shape* is identical, but the *documented behavior* changes: API Spec §2.2 currently states native PDFs ≤ 3 MB → 400 `UNSUPPORTED_MEDIA_TYPE`, and this microstep makes native *text* PDFs → 201. **Sequencing (unambiguous):** (i) deploy the handler; (ii) golden-curl-confirm the native-PDF 201; (iii) **immediately** land a Pass-4 §2.2 documentation Role-C correcting the note (text PDFs of any size accepted — extracted via `pdf-parse` when native; only images / scanned-image PDFs with no text layer → 400). Between (i) and (iii) there is a **brief, explicitly-disclosed doc-vs-runtime window** (deployed = 201, §2.2 note = 400), closed by (iii). This replaces the earlier "No Role-C" and "PRE-LAND" framings.
- **(3) Scanned/image-only PDFs.** Yield empty text → the empty-text 400 fires (OCR is a disclosed future item). PROCEED.
- **(4) Deploy = run-from-package rebuild.** `pdf-parse@1.1.1` added to package.json/lock; artifact rebuilt per §5.5/DR-T13. PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1 Feature identification:** close the disclosed native-PDF gap in the file-knowledge ingest.
- **P2 Architecture & boundary:** above — only theo_ tables + theo-content; pdf-parse in-process.
- **P2.5 Gap disclosure:** Gap Register above (PROCEED).
- **P3 Schema grounding:** no change — `theo_project_knowledge` columns + `theo_attachments.blob_path/content_type` already deployed.
- **P4 Contract grounding:** same route + response *shape* (API Spec §2.2), but the documented *behavior* changes (native text PDF 400→201) — handled by the post-deploy §2.2 documentation Role-C with disclosed drift (Gap §2).
- **P5 Handler grounding:** Primary Reference = deployed `theo_add_project_knowledge_file` (inlined verbatim below); pdf-parse block = byte-exact mirror of deployed `theo_finalize_attachment` (inlined below); Structural Mirror below.
- **P6 SQL grounding:** no migration; handler SQL unchanged (set_config + ownership SELECT + attachments SELECT + theo_project_knowledge INSERT).
- **P7 Curl grounding:** golden curls below, incl. a native-PDF happy path; Claude Code runs them post-deploy.
- **P8 VEP assembly:** this pack.

## Primary Reference (deployed `theo_add_project_knowledge_file`) — FULL VERBATIM (Conformance T9)
```javascript
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const TITLE_MAX_LEN = 200;
// File-backed knowledge holds extracted document text (not hand-typed), so the inline-content
// ceiling is raised well above the text-knowledge 10 000 cap; text beyond this is truncated with a
// marker (Phase D RAG retrieval over the stored content is the scale answer — API Spec §2.6).
const FILE_CONTENT_MAX_LEN = 100000;
// theo-content Blob account/container (identical resolution to the deployed theo_finalize_attachment).
const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
// Only these body fields are accepted; any extra key is rejected (Golden Handler §3.3).
const ALLOWED_BODY_KEYS = new Set(["project_id", "attachment_id", "title"]);

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
    if (match && typeof match.val === "string" && match.val.trim()) {
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

// ---- Managed-identity data-plane Blob read (reused byte-identically from the deployed
// theo_finalize_attachment per the Walter-authorized composite; this handler READS only).
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

  // ---- Validate inputs before any SQL / blob access (deterministic 400s) ----
  // Reject unknown/extra body fields (Golden Handler §3.3).
  for (const k of Object.keys(body)) {
    if (!ALLOWED_BODY_KEYS.has(k)) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Unknown field '${k}' is not allowed.`, 400));
    }
  }

  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  }

  const attachmentId = typeof body.attachment_id === "string" ? body.attachment_id.trim() : "";
  if (!isUuid(attachmentId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'attachment_id' is required and must be a valid UUID.", 400));
  }

  // Optional title override; defaults to the attachment filename. When present it must be a
  // non-blank string within the length cap.
  let titleOverride = null;
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'title', when provided, must be a non-empty string.", 400));
    }
    if (body.title.trim().length > TITLE_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'title' must be at most ${TITLE_MAX_LEN} characters.`, 400));
    }
    titleOverride = body.title.trim();
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

    // FK ownership (the connection role bypasses RLS, so FK existence does NOT prove ownership):
    // the referenced project MUST belong to the caller, else 404 (no leakage). EXACT mirror of
    // theo_add_project_knowledge.
    const owned = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
      [projectId, oid]
    );
    if (owned.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // Owner-scoped attachment lookup (authorized reuse of the deployed theo_finalize_attachment
    // theo_attachments access pattern): fetch the row's blob pointer + extracted-text path.
    const att = await client.query(
      `
      SELECT filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path
      FROM public.theo_attachments
      WHERE id = $1 AND created_by = $2
      `,
      [attachmentId, oid]
    );
    if (att.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Attachment not found.", 404);
    }
    const row = att.rows[0];

    // Only files whose text was extracted at finalize (extract-class + large PDFs) can become
    // project knowledge — the extracted text is what is stored + injected/retrieved. Native
    // PDFs (<=3 MB) and images have no extracted_text_path and are rejected with guidance.
    if (!row.extracted_text_path) {
      throw buildKnownError(
        "UNSUPPORTED_MEDIA_TYPE",
        "This file has no extractable text. Add a Word, Excel, PowerPoint, CSV, or TXT file (or a text-based PDF) as project knowledge.",
        400
      );
    }

    // Read the extracted-text sibling blob via managed identity (reused byte-identically from
    // theo_finalize_attachment). The container is the value finalize stored on the row.
    let text;
    try {
      const buf = await downloadBlob(STORAGE_ACCOUNT, row.blob_container, row.extracted_text_path);
      text = buf.toString("utf8");
    } catch (blobErr) {
      context.log.error("theo_add_project_knowledge_file: extracted-text blob read failed", blobErr);
      throw buildKnownError("BLOB_READ_FAILED", "Couldn't read the file's extracted text.", 502);
    }

    text = (text || "").trim();
    if (text === "") {
      throw buildKnownError("UNSUPPORTED_MEDIA_TYPE", "The file produced no readable text.", 400);
    }
    if (text.length > FILE_CONTENT_MAX_LEN) {
      text = text.slice(0, FILE_CONTENT_MAX_LEN) + "\n\n[Content truncated for length.]";
    }

    const title = titleOverride || String(row.filename || "Untitled file").trim().slice(0, TITLE_MAX_LEN) || "Untitled file";

    // ALLOWED DELTA vs theo_add_project_knowledge: source_type='file' + the deployed file-pointer
    // columns (blob_container/blob_path/byte_size/content_type — b2_migration.sql; Schema §5), the
    // original file's pointer carried through for later download. created_by = the signed-in OID.
    const inserted = await client.query(
      `
      INSERT INTO public.theo_project_knowledge
        (created_by, project_id, title, source_type, content, blob_container, blob_path, byte_size, content_type)
      VALUES ($1, $2, $3, 'file', $4, $5, $6, $7, $8)
      RETURNING
        id, project_id, title, source_type, content, created_at
      `,
      [oid, projectId, title, text, row.blob_container, row.blob_path, row.byte_size, row.content_type]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({ knowledge: inserted.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_add_project_knowledge_file failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to add knowledge to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // FK violation: project_id absent or not owned.
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    }
    // CHECK violation (title non-blank or source_type), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Knowledge item violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

## Primary Reference `function.json` (deployed `theo_add_project_knowledge_file`) — FULL VERBATIM (Conformance T9 / Golden Handler §2)
Unchanged by this microstep (same route/methods):
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_add_project_knowledge_file"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## Authorized-reuse source (deployed `theo_finalize_attachment`) — `pdf-parse` block VERBATIM
Copied **byte-identically** into the new handler's text-acquisition branch (Golden Handler §4 EXACT mirror; Walter-authorized):
```javascript
  if (contentType === "application/pdf") {
    const pdfParse = require("pdf-parse/lib/pdf-parse.js"); // pin pdf-parse@1.1.1; inner lib avoids the index.js debug-block (reads a test PDF when module.parent is falsy, as in Functions)
    const data = await pdfParse(buf);
    return (data && data.text) || "";
  }
```

## Structural Mirror Table (Golden Handler §5.1)
| Region | Primary Reference (deployed theo_add_project_knowledge_file) | Classification | Anchor |
|---|---|---|---|
| Pool / constants / corsHeaders / send / nowIso / errorBody / successBody / getPrincipal / getClaimValue / parseBody / buildKnownError / isUuid | identical | **EXACT** | Golden Handler §2 "exactly one" |
| Blob helpers (requestUrl / requestBinary / getManagedIdentityAccessToken / encodeBlobPath / blobUrlFor / downloadBlob) | identical | **EXACT** | Golden Handler §2 |
| OID/401, body parse/400, unknown-field/uuid/title validation | identical | **EXACT** | Golden Handler §2 |
| BEGIN + set_config + project-ownership SELECT + attachment SELECT | identical | **EXACT** | Architecture §5.2 "RLS ENABLED on every Theo table" |
| **Text acquisition** — was: reject if no `extracted_text_path`, else read sibling blob. now: read `extracted_text_path` if present; **else if `content_type='application/pdf'` → downloadBlob(original) + pdf-parse**; else reject (no-text/OCR). | restructured; adds the pdf-parse branch | **ALLOWED DELTA** (control flow / validated set) + **AUTHORIZED REUSE** (pdf-parse block byte-exact from theo_finalize_attachment) | Golden Handler §4 "ALLOWED DELTA" + "an EXACT mirror against a deployed handler containing that helper" |
| empty-text guard + content cap + title + INSERT theo_project_knowledge + COMMIT/201 | identical | **EXACT** | Golden Handler §2 |
| catch (42501/known/23503/23514/500) + finally release | identical | **EXACT** | Golden Handler §2 |
| app `package.json` | adds `"pdf-parse": "1.1.1"` beside `pg` (deploy artifact, not handler code) | **ALLOWED DELTA** (dependency) | Golden Handler §4 "ALLOWED DELTA" |

## New handler + package
Included in this package: `theo_add_project_knowledge_file/index.js` (blob `630ff773165f5dc30caa2cebed3751f4275f504e`; `node --check` PASS), `theo_add_project_knowledge_file/function.json` (unchanged), `package.json` (`pg` + `pdf-parse@1.1.1`), `host.json`.

## Golden Curls (P7 / §5.5; run by Claude Code post-deploy)
Bearer via `az account get-access-token` for `api://4e1a1e31-5c20-4480-99e4-098901707d9e/access_as_user`; base `https://vaultgpt-func-projects.azurewebsites.net`. Setup reuses the deployed premium project + attachment handlers.
```
# GC-PDF (NEW) — native text PDF (<=3 MB) → 201 source_type='file', content = PDF text
#   create project; theo_create_attachment_upload {filename:"doc.pdf",content_type:"application/pdf"};
#   PUT the PDF bytes; theo_finalize_attachment (→ ingestion_class='native', extracted_text_path=null);
#   POST /api/theo_add_project_knowledge_file {project_id, attachment_id}  → expect 201, source_type=="file", content non-empty (the PDF's text)
# GC5 (regression) — a .txt/.docx (extract-class) → still 201 via the extracted_text_path path
# GC6 (regression) — a native .png (no text) → 400 UNSUPPORTED_MEDIA_TYPE
# GC1/GC2/GC3/GC4 (regression) — 401 / 400 unknown-field / 400 bad-uuid / 404 unowned-project (unchanged)
# (test project + attachments deleted after)
```

## Parity Checklist (Golden Handler §5.4)
- [x] Single canonical Primary Reference (deployed theo_add_project_knowledge_file) inlined full verbatim.
- [x] pdf-parse reuse block inlined verbatim; byte-identical in the new handler; Walter-authorized + EXACT-mirror.
- [x] Structural Mirror Table classifies every region (EXACT / ALLOWED DELTA / AUTHORIZED REUSE), anchored.
- [x] Executes as the signed-in user; explicit `created_by` predicate + set_config (unchanged).
- [x] Only `theo_` tables + `theo-content` Blob; no `reporting_*`; no new external system (Blob already used).
- [x] No schema change; response shape unchanged (same columns; same shape). Contract BEHAVIOR change (native text PDF 400→201) handled by the post-deploy §2.2 documentation Role-C (Gap §2).
- [x] `node --check` PASS; function.json unchanged; `pdf-parse@1.1.1` pinned in package.json.
- [x] Golden curls deterministic incl. the native-PDF happy path; Claude Code runs them post-deploy.
- [x] Mechanical lint PASS (below).

## §Deploy (Pass-3, on APPROVAL) — Claude Code, `vaultgpt-func-projects` run-from-package (§5.5 / DR-T13)
1. Rebuild the run-from-package artifact from this package's `{host.json, package.json, package-lock.json (npm ci with pg+pdf-parse), theo_add_project_knowledge_file/}`; upload a new versioned `.zip` to the `deploy-packages` container; repoint `WEBSITE_RUN_FROM_PACKAGE`; `az functionapp restart`.
2. Claude Code runs the golden curls (GC-PDF + GC1–GC6 regression) and reports.
3. **Immediately land the post-deploy §2.2 documentation Role-C (Pass-4):** correct the API Spec §2.2 file-knowledge row's native-PDF note (native text PDFs → 201 via pdf-parse; only images / scanned-image PDFs → 400), right after the golden curls confirm the native-PDF 201 — closing the brief disclosed doc-vs-runtime window so the doc matches deployed behavior.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-ProjectKnowledgeFile-PdfExtract-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review (APPROVED / REJECTED only). On APPROVED, Claude Code rebuilds + redeploys the run-from-package artifact (pg + pdf-parse) and runs the golden curls (incl. the native-PDF happy path).
