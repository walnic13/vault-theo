# Theo 1B — B8h Large-Document Handling (input budget + large-PDF extraction) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete corrected handlers for Walter to redeploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier **B8h** — make large/multi-document attachments work without timing out, by **bounding the synchronous request's input**. Two changes, no schema change: **(Level 2)** `theo_finalize_attachment` promotes a **PDF larger than `PDF_NATIVE_MAX_BYTES` (3 MB)** from native (a giant document block) to **extract-class** — its text is extracted in-process (`pdf-parse`) and stored as the sibling, exactly the deployed B8c extraction path; small PDFs stay native (visual fidelity). **(Level 1)** `theo_message` injects strictly by the row's **`ingestion_class`** (a promoted PDF injects its **budgeted text**, not a 5.7 MB document block) and tightens the native byte budget. Net effect: a text-dense LP agreement becomes answerable (budgeted) and the synchronous call stays fast/within-context, instead of the silent "Couldn't reach the assistant" timeout. Reuses the deployed B8c/B8d machinery + the B8c `ingestion_class`/`extracted_text_path` columns (no migration). One new dep (`pdf-parse`, Kudu) — Walter-authorized (§WALTER-AUTH). Diff-verified additive.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Turn issued against HEAD: `ec73341819df3974dd43880e4af963fddc4b3423` (vault-theo, `development`)
Detail: Pass 1 backend VEP; P1–P8 walked. Two deployed handlers under change: Primary Reference (1/2) = the deployed B8c `theo_finalize_attachment` (blob `b829d98d`) + function.json (`9fdd3c54`); Primary Reference (2/2) = the deployed B8d-MI-fix `theo_message` (blob `9912d297`) + function.json (`bd476fc8`). The corrected full handlers are inlined §H-FINALIZE / §H-MESSAGE; the diff-verified additive delta is enumerated in §CHANGESET. The PDF text extractor (`pdf-parse`) is the **same kind of npm extraction helper** as the deployed B8c `xlsx`/`mammoth`/`officeparser` (Golden §3) — it extends the B8c "path a" pattern to PDF and is authorized verbatim by Walter (§WALTER-AUTH). **No schema change** — reuses the deployed B8c `ingestion_class`/`extracted_text_path` columns. `theo_create_attachment_upload` / `theo_delete_attachment` are unchanged. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§3 helper authorization) | `Grep("EXACT mirror against a deployed handler")` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B8) | `Grep("extract-then-inject")` this turn | `ebdf4d73306190ab5b44f61fb2db08932b1f3638` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§2.3 HF-T1) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§7 `ingestion_class`/`extracted_text_path`) | `Grep("extracted_text_path")` this turn | `f9164d8a22194b87e9601c5dcc61528bc7c7be2e` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.8 Attachments) | `Grep("ingestion-class")` this turn | `be621ba62396a12c8ddd873d4805e433bc1d82cc` |
| 10 | **Primary Reference (1/2)** — deployed B8c finalize — `Codex Governance/Theo-1B-B8c-Attachment-Extraction-Pass-1-VEP/theo_finalize_attachment.index.js` | `Read(full)` this turn | `b829d98d0ad93e03f61f6ef56199c92f9d80b37c` |
| 11 | **Primary Reference (2/2)** — deployed B8d-MI-fix gateway — `Codex Governance/Theo-1B-B8d-MI-Protocol-Fix-Pass-1-VEP/theo_message.index.js` | `Read(full)` this turn | `9912d2970bdbab953df32ad1f57840e9c9976558` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No write SQL / no schema change. No `theo_create_attachment_upload` / `theo_delete_attachment` change.

---

## §WALTER-AUTH — verbatim authorization for the PDF extraction lib + the approach (Golden §3 / T12)
Walter, current turn, authorizing **Levels 1 + 2** (where Level 2 was defined in the immediately-preceding turn as "**+ Large-PDF text-extraction (adds `pdf-parse` via Kudu, `finalize` change)** — big text PDFs become answerable, extracted to budgeted text; small PDFs stay native"):
> "proceed with levels 1 and 2"
This authorizes the `pdf-parse` extraction helper (extending the B8c "path a" npm-extraction authorization to PDF) and the native-vs-extract size threshold.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "a Walter authorization quoted verbatim and predating the VEP" | §WALTER-AUTH — pdf-parse authorization |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §7 | "extracted_text_path" | §H-FINALIZE — promoted PDFs stored at extracted_text_path (no new column) |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §H — all queries remain explicit `created_by`-scoped |

---

## P1 — Feature identification
Tier **B8h (large-document handling)**. The deployed attachment pipeline times out on large/multiple **text-dense** documents (a 5.7 MB LP agreement + others) because a big PDF is injected as a full document block → a huge token load → the synchronous request exceeds the model/time budget → the FE shows "Couldn't reach the assistant." (Proven: a low-text 5.5 MB PDF returns in ~5 s; the failure is token VOLUME, not file size.) B8h bounds the input: large PDFs are text-extracted + budgeted (Level 2), and the gateway injects strictly by ingestion class + caps the native budget (Level 1). Small PDFs/images keep native visual fidelity. No new capability surface; an enhancement to deployed B8c (finalize) + B8d (gateway).

## P2 — Architecture & boundary reconciliation
- **Level 2 (`theo_finalize_attachment`).** After the HEAD/size/allow-list checks, a PDF with actual size `> PDF_NATIVE_MAX_BYTES` (3 MB, env-overridable) is promoted to **extract-class**: the existing B8c extraction path runs, with a new `pdf-parse` branch in `extractTextFromBlob` producing the text, stored as the sibling `…/<id>.extracted.md`, and `ingestion_class='extract'` + `extracted_text_path` set. Small PDFs and images keep `ingestion_class='native'`. Extraction stays **non-fatal** (the file is stored regardless). No change to the allow-list, the per-class cap, ownership, or the INSERT columns (the B8c columns already exist).
- **Level 1 (`theo_message`).** `buildAttachmentBlocks` now decides native-vs-extract by the **row's `ingestion_class`** (`isExtractRow = ingestion_class==='extract'` — **path-independent**, so an extract-class row is never injected natively even if extraction failed; it degrades to a note), not by `content_type` — so a promoted PDF (still `content_type: application/pdf`) injects its **budgeted extracted text** rather than a multi-MB document block. The extract-text budget (`ATTACH_EXTRACT_BUDGET_CHARS`, 200 K) bounds the injected tokens; the native byte budget is tightened (25 MB → 14 MB). Everything else (memory, history-RAG, persistence, attachment ownership fetch, streaming-tools) is unchanged.
- **Boundary.** Reads/writes only `theo_attachments` + the `theo-content` container; **no `reporting_*`**; no schema change; managed-identity blob access (B8b/B8c pattern) unchanged; `pdf-parse` is in-process (no network), same posture as `xlsx`/`mammoth`/`officeparser`.

## P2.5 / GR — Gap Register
Vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`.
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **npm dependency (Walter, Kudu).** `pdf-parse` must be `npm install`ed into `vaultgpt-func-premium` (same Kudu mechanism as `xlsx`/`mammoth`/`officeparser`) before the new `finalize` runs — else PDF promotion's extraction throws (caught; non-fatal → row persists with `extracted_text_path=NULL`). | **PRE-LAND** — §DEPS; Walter installs, then redeploys the two handlers. |
| G-2 | **Redeploy (Walter).** Replace `theo_finalize_attachment` + `theo_message` `index.js` (function.json unchanged). | **PRE-LAND** — §DEPLOY; Claude Code re-runs §GOLDEN after. |
| G-3 | **Visual fidelity trade.** A PDF > 3 MB is read as **text**, not as a visual document block — fine for text docs (agreements); a very large *scanned/table-heavy* PDF loses layout. Threshold env-tunable (`THEO_PDF_NATIVE_MAX_BYTES`). | **PROCEED** — accepted; full large-doc fidelity is the future RAG-over-attachment step (Level 3). |
| G-4 | **API-Spec note.** §2.8 read-path could note the PDF native/extract threshold. | **PROCEED** — minor doc Role-C after green curls (optional). |

No write SQL. No `reporting_*` change.

## P3 — Backend / contract grounding
No contract change (request/response identical). Contract basis = the deployed `theo_attachments` table incl. the B8c `ingestion_class`/`extracted_text_path` columns (doc #8). The finalize response's `ingestion_class` now reports `extract` for promoted PDFs (additive, already in the returned shape). No DDL.

## P4 — Schema definition
None — reuses the deployed B8c `ingestion_class` + `extracted_text_path` columns.

## P5 — Component reference grounding
- **Primary Reference (1/2):** deployed B8c `theo_finalize_attachment` (blob `b829d98d`) + fj (`9fdd3c54`) — §H-FINALIZE inlines the corrected full file; the only delta is §CHANGESET items 1–3.
- **Primary Reference (2/2):** deployed B8d-MI-fix `theo_message` (blob `9912d297`) + fj (`bd476fc8`) — §H-MESSAGE inlines the corrected full file; the only delta is §CHANGESET items 4–6.
- **`pdf-parse`** is the same class of in-process npm text extractor as the deployed B8c `xlsx`/`mammoth`/`officeparser` (Golden §3); authorized §WALTER-AUTH.

## §CHANGESET — exact additive delta (diff-verified)
**`theo_finalize_attachment` (Level 2):**
1. `PDF_NATIVE_MAX_BYTES` const (env `THEO_PDF_NATIVE_MAX_BYTES`, default 3 MB).
2. `extractTextFromBlob` gains an `application/pdf` branch (`pdf-parse` → `data.text`).
3. The extraction decision promotes large PDFs: `const isLargePdf = contentType==='application/pdf' && byteSize > PDF_NATIVE_MAX_BYTES; let ingestionClass = isLargePdf ? 'extract' : ingestion.class;` and the extraction block is guarded by `if (ingestionClass === 'extract')`.

**`theo_message` (Level 1):**
4. `ATTACH_NATIVE_BUDGET_BYTES` default tightened 25 MB → 14 MB.
5. `buildAttachmentBlocks` decides by ingestion class: `const isExtractRow = row.ingestion_class==='extract'; const native = !isExtractRow && NATIVE_MEDIA_TYPES[row.content_type];` — `isExtractRow` is **path-independent**, so an extract-class row is never native (T13): a promoted PDF injects its extracted text, or — if extraction failed (no `extracted_text_path`) — a "could not be read" note, **never** a document block.
6. The extract **text** branch keys on `isExtractRow && row.extracted_text_path`; an extract-class row with no extracted text falls through to the note (never native).

Everything else in both handlers is byte-for-byte the deployed version.

## P6 — Repository & active-surface grounding
Changed artifacts (this package): `theo_finalize_attachment.index.js` + `theo_message.index.js` (supersede the B8c/B8d deploy copies) + their unchanged `function.json`. `node --check` clean for both; diffs vs the deployed versions are the §CHANGESET additive delta only.

## P7 — Risk / regression
- **Small PDFs / images / office docs / csv-txt:** unchanged behaviour (a ≤3 MB PDF still goes native; office/text still extract). No regression to B8c/B8d for those.
- **Big PDFs:** now extract-class → bounded text → fast + answerable (vs the prior timeout). The extract is non-fatal (failure → `extracted_text_path=NULL`, gateway notes it).
- **Gateway:** injects by ingestion class — a promoted PDF can no longer push a multi-MB document block; the extract budget caps tokens; the native budget is tighter. Zero-attachment path unchanged.
- **Dependency:** missing `pdf-parse` → extraction throws → caught (non-fatal); G-1 makes the install a PRE-LAND step.
- **Empirical basis:** a low-text 5.5 MB PDF already returns in ~5 s; bounding the text-dense case to a budget keeps it in that fast regime.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) + §WALTER-AUTH open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED); §CHANGESET the diff-verified delta; §H-FINALIZE/§H-MESSAGE the corrected full handlers; §FJ the unchanged function.jsons; §DEPS the Kudu install; §GOLDEN the re-run incl. the big-PDF case; §DEPLOY the steps. Plan-only. On Codex APPROVAL, Walter installs `pdf-parse` + redeploys the two handlers; Claude Code re-runs the round-trip (incl. a >3 MB text-dense PDF, now expected to answer fast).

---

## §DEPS — npm dependency (Walter installs via Kudu before redeploy — G-1)
Install into `vaultgpt-func-premium` (Kudu console `npm install`, same as the B8c libs):
```json
{ "dependencies": { "pdf-parse": "^1.1.1" } }
```
(`pg`, `xlsx`, `mammoth`, `officeparser` already present. `pdf-parse` is pure-JS, in-process, no network.)

## §H-FINALIZE — `theo_finalize_attachment/index.js` (complete; B8h Level 2)
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
    const pdfParse = require("pdf-parse");
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

## §FJ-FINALIZE — `theo_finalize_attachment/function.json` (unchanged)
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

## §H-MESSAGE — `theo_message/index.js` (complete; B8h Level 1)
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

## §GOLDEN — golden-curl re-run (Claude Code, post-redeploy; token via `az`, never printed)
1. **small PDF (≤3 MB) — native unchanged:** upload a small PDF → finalize → `ingestion_class:"native"`; `theo_message` with it → 200, Theo reads it (document block). Regression check.
2. **large text-dense PDF (>3 MB) — the fix:** upload a ~5.5 MB text-dense PDF → finalize → **`ingestion_class:"extract"`**, `extracted_text_path` non-null; `theo_message` with it → **200 within seconds** (no timeout), Theo answers from the extracted text.
3. **multi-doc:** the big PDF + an xlsx + a text file together → 200, bounded, fast.
4. **dep-missing guard:** (pre-install) a >3 MB PDF finalize → row persists with `extracted_text_path=NULL` (non-fatal); post-install → populated.
5. native budget: confirm a normal image/small-PDF still injects. Evidence under `.local/`.

## §DEPLOY — Walter deploy steps
1. **Kudu:** `npm install pdf-parse` in `vaultgpt-func-premium`.
2. Replace `theo_finalize_attachment/index.js` (§H-FINALIZE) + `theo_message/index.js` (§H-MESSAGE); function.json unchanged.
3. Reply "B8h deployed" → Claude Code re-runs §GOLDEN (incl. the >3 MB text-dense PDF, now expected to answer fast), captures evidence.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B8h Large-Document Handling Pass-1 Backend VEP (plan only).*
