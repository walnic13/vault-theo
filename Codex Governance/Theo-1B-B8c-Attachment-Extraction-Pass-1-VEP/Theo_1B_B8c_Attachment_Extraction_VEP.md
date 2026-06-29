# Theo 1B — B8c Attachment Extraction-at-Upload (`theo_finalize_attachment` + schema addendum) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete migration + handler for Walter to deploy at Pass 3, after which Claude Code re-runs the golden curls. **Microstep:** Tier **B8c (extraction-at-upload)**. (1) An **additive schema addendum** on `theo_attachments` — `ingestion_class text` + `extracted_text_path text` (idempotent ALTER). (2) Extends the deployed `theo_finalize_attachment` so that, for **extract-class** uploads (Excel/Word/PPT/CSV/TXT), it downloads the blob, **extracts text in-process**, stores the text as a sibling blob in `theo-content`, and records `ingestion_class` + `extracted_text_path` on the row. Native types (PDF/image) are unchanged. Extraction uses Walter-authorized npm libraries (path (a)). This makes extract-class files model-readable; the gateway injection (B8d) consumes the stored text next. **`theo_create_attachment_upload` / `theo_delete_attachment` are unchanged.**

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `2583040c29aaac78ca5ad8e7ff5c9fff5cdadc69` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference handler (Golden §2) = the **deployed** `theo_finalize_attachment` (blob `23112e4a`) — this microstep extends it; inlined verbatim §SM + its function.json §SM-FJ. The extension adds a **new-domain helper** (document text extraction via `xlsx`/`mammoth`/`officeparser`) with no deployed mirror; per Golden Handler §3 (T12) it is authorized by Walter's verbatim direction quoted in §WALTER-AUTH, predating this VEP. Schema addendum mirrors the additive-ALTER idiom; columns are `text` (free-text, no CHECK — mirrors the `app_key` promotable convention). Binary blob download uses a `requestBinary` Buffer-collecting variant (the string `requestUrl` would corrupt OOXML zips). Extraction is non-fatal (the file is already stored). Contract/ownership/validation/SAS-side behaviour is unchanged from the deployed B8b finalize. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates; T12 new-domain helper) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 new-domain helper authorization; §6 HF-T2/HF-T5) | `Grep("new-domain or new-external-system helper")` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B8 B8c) | `Grep("extraction at upload")` this turn | `ebdf4d73306190ab5b44f61fb2db08932b1f3638` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis (1/2)** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§7 `theo_attachments` DEPLOYED) | `Grep("theo_attachments")` this turn | `0936b75e47c9f9d48876acbebc2f0d8f750b012b` |
| 9 | **Contract basis (2/2)** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.8 Attachments) | `Grep("§2.8 Attachments")` this turn | `f5eea60a0010822671f05da75b78ba90179afc83` |
| 10 | **Primary Reference handler** (artifact extended) — `Codex Governance/Theo-1B-B8b-Attachment-Upload-Handlers-Pass-1-VEP/theo_finalize_attachment.index.js` | `Read(full)` this turn | `23112e4a7f6d77e0b6742ef7115b535962648b94` |
| 11 | **Primary Reference function.json** — `Codex Governance/Theo-1B-B8b-Attachment-Upload-Handlers-Pass-1-VEP/theo_finalize_attachment.function.json` | `Read(full)` this turn | `9fdd3c54d25b7a8c3bcf285459acd0ddea8316e7` |
| 12 | **DDL idiom reference** — deployed B8a migration — `Codex Governance/Theo-1B-B8a-Attachments-Schema-Pass-1-VEP/b8a_migration.sql` | `Read(full)` this turn | `cc61acf1bbb2187260fd88232b92e445141ea395` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No write SQL executed (plan only; Walter runs the addendum at Pass 3).

---

## §WALTER-AUTH — verbatim authorization for the new-domain extraction helpers (Golden Handler §3 / T12)
Walter, current turn (predating this VEP), authorizing path (a) = the npm extraction libraries (`xlsx`/SheetJS for Excel, `mammoth` for Word, an officeparser for PowerPoint; CSV/TXT native) installed into `vaultgpt-func-premium` via Kudu (the same mechanism that installed `pg`):
> "path a is the way to go .  i am pretty sure we used kudo"
This is the explicit Walter authorization the Golden Handler Standard §3 requires for a new-domain helper classified as ALLOWED DELTA with no deployed EXACT mirror.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "a Walter authorization quoted verbatim and predating the VEP" | §WALTER-AUTH — extraction-lib authorization |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B8 | "extraction at upload" | §P1 / §H — B8c extraction at finalize |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §7 | "theo_attachments" | §DDL — additive columns on the deployed table |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §H — INSERT remains explicit `created_by`-scoped |

---

## P1 — Feature identification
**Microstep:** Tier **B8c** (Plan Tier B8, "extraction at upload"). Makes **extract-class** attachments (Excel/Word/PPT/CSV/TXT) model-readable by extracting their text at finalize and storing it for the gateway (B8d) to inject. Two parts: an additive schema addendum (`ingestion_class` + `extracted_text_path` on `theo_attachments`) and an extension of the deployed `theo_finalize_attachment`. Native types (PDF/image) are untouched (they inject directly as content blocks). `theo_create_attachment_upload` / `theo_delete_attachment` unchanged.

## P2 — Architecture & boundary reconciliation
- **Extends the deployed handler (EXACT base + ALLOWED DELTA).** The B8b finalize (Primary Reference §SM) is preserved verbatim through validation, HEAD, actual-type/size enforcement, ownership check, and the INSERT/error mapping. The **delta**: between the size check and the DB transaction, for `ingestion.class === "extract"` it downloads the blob (managed-identity GET via a Buffer-collecting `requestBinary`), extracts text, writes a sibling blob `…/<attachmentId>.extracted.md` (managed-identity PUT), and sets `ingestion_class` + `extracted_text_path`; the INSERT gains those two columns. Native types set `ingestion_class='native'`, `extracted_text_path=NULL`.
- **New-domain helper (Walter-authorized).** `extractTextFromBlob` dispatches on the actual content-type: `xlsx`/SheetJS (per-sheet CSV + a sheet manifest, as markdown), `mammoth` (docx raw text), `officeparser` (pptx text), native UTF-8 (csv/txt). No deployed mirror exists → authorized verbatim in §WALTER-AUTH (Golden §3 / T12). These are the **first Theo handler dependencies beyond `pg`** (§DEPS).
- **Non-fatal extraction.** The file is already stored before extraction; on any extractor error the row is still inserted with `extracted_text_path=NULL` (B8d reports "couldn't read this file" rather than losing the upload).
- **Boundary.** Reads/writes only `theo_attachments` + the existing `theo-content` Blob container; **no `reporting_*`**; the addendum is additive (no RLS/behaviour change — the new columns inherit the table's four ownership policies); managed-identity Blob access only (no new credential).

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Migration (Walter).** One idempotent additive ALTER (`ingestion_class`, `extracted_text_path`) on `theo_attachments`, as `pgadmin_vault`. No RLS/data change. | **PRE-LAND** — §DEPLOY step 1; Claude Code runs §VERIFY after. |
| G-2 | **npm dependencies (Walter, Kudu).** `xlsx`, `mammoth`, `officeparser` must be installed into `vaultgpt-func-premium` via Kudu `npm install` (the same mechanism that installed `pg`) before the extended handler runs — else `require(...)` throws at runtime and extraction fails (non-fatal: native still works; extract-class rows persist with `extracted_text_path=NULL`). | **PRE-LAND** — §DEPS; Walter installs, then deploys the handler. |
| G-3 | **Schema-doc + API-Spec doc refresh.** The §7 `theo_attachments` columns + the §2.8 "read path" status advance once B8c + B8d land. | **PRE-LAND** — a short Role-C after green curls (mirrors prior doc Role-Cs). |
| G-4 | **B8d gateway injection.** `theo_message` reads `extracted_text_path` (extract-class) / base64 blob (native) and injects per the token budget. | **PROCEED (future-trigger)** — next microstep; B8c only produces + stores the text. |

No write SQL in this pack (plan only). No `reporting_*` change.

## P3 — Backend / contract grounding
Contract basis = the deployed `theo_attachments` table (doc #8, §7 DEPLOYED) + the §2.8 endpoint (doc #9). The finalize response gains `ingestion_class` + `extracted_text_path` in `data.attachment` (additive, backward-compatible). No request-shape change. The schema-doc DEPLOYED row + §2.8 status refresh follow post-deploy (G-3).

## P4 — Schema definition
See §DDL — additive idempotent ALTER adding `ingestion_class text` + `extracted_text_path text` to `theo_attachments`; §VERIFY catalog-checks the two columns.

## P5 — Component reference grounding
- **Primary Reference (extended):** deployed `theo_finalize_attachment` §SM (blob `23112e4a`) + function.json §SM-FJ (blob `9fdd3c54`), full verbatim. §H reproduces it and adds only the extraction delta.
- **DDL idiom:** deployed B8a migration (blob `cc61acf1`) — same additive, idempotent, owner-as-`pgadmin_vault` shape.
- **New-domain extraction helper:** authorized §WALTER-AUTH; libraries pinned in §DEPS.

## P6 — Repository & active-surface grounding
New artifacts (this package): `b8c_addendum.sql`, `b8c_verify.sql`, the extended `theo_finalize_attachment.index.js` (supersedes the B8b copy for deploy) + its unchanged `function.json`. `node --check` clean. Guardrails: additive migration; no `reporting_*`; ownership-scoped INSERT; managed-identity Blob only; extraction non-fatal.

## P7 — Risk / regression
- **Native path unchanged:** PDF/image finalize behaviour is byte-for-byte the deployed flow (extraction block is skipped). No regression to the green B8b round-trip.
- **Dependency risk bounded:** if a lib is missing/throws, extraction is caught and the row still persists (`extracted_text_path=NULL`); native uploads are unaffected. G-2 makes the install a PRE-LAND step.
- **Binary correctness:** `requestBinary` collects `Buffer` chunks (never string-coerced) so OOXML zips are not corrupted before parsing.
- **Memory/time:** a 50 MB extract-class file is downloaded + parsed in-process on the premium plan; extracted text (small relative to source) is stored as a sibling blob. Token-budgeting is B8d's concern, not B8c's.
- **Idempotent migration:** `ADD COLUMN IF NOT EXISTS`; re-runnable; existing rows keep NULL (no backfill needed).

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) + §WALTER-AUTH open the pack; P1–P8 walked; Gap Register present (G-1/G-2/G-3 PRE-LAND; G-4 PROCEED); §DDL/§VERIFY for the addendum; §SM/§SM-FJ Primary Reference full verbatim; §H the extended handler; §DEPS the Kudu libs; §GOLDEN the re-run incl. an extract-class probe; §DEPLOY the sequence. Plan-only. On Codex APPROVAL, Walter runs the migration + installs the libs + deploys the handler; Claude Code re-runs the round-trip + the extraction probe + §VERIFY, then the doc Role-C (G-3) and B8d.

---

## §DDL — `b8c_addendum.sql` (complete; Walter-executable; idempotent)
```sql
-- Tier B8c addendum migration: extraction metadata on theo_attachments (ADDITIVE; idempotent).
-- Run as pgadmin_vault (owner), same as every prior theo migration. No RLS change — the new
-- columns inherit theo_attachments' existing four ownership policies. No data backfill needed
-- (theo_finalize_attachment sets these on insert going forward; pre-existing rows keep NULL).

ALTER TABLE public.theo_attachments
  ADD COLUMN IF NOT EXISTS ingestion_class text,
  ADD COLUMN IF NOT EXISTS extracted_text_path text;

COMMENT ON COLUMN public.theo_attachments.ingestion_class IS
  'native | extract | stored — how the attachment is fed to the model (B8c). Free-text (no CHECK), mirrors the app_key promotable convention.';
COMMENT ON COLUMN public.theo_attachments.extracted_text_path IS
  'Blob pointer (within blob_container) to the extracted text for extract-class attachments; NULL for native, or when extraction failed/has not run (B8c).';
```

## §VERIFY — post-deploy read-only catalog probe (Claude Code runs via `.local\run-reporting-ro-query.ps1`)
```sql
-- B8c addendum post-deploy verification (read-only; catalog).
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema='public' AND table_name='theo_attachments'
  AND column_name IN ('ingestion_class','extracted_text_path')
ORDER BY column_name;
```

## §DEPS — npm dependencies (Walter installs via Kudu before deploying the handler — G-2)
Install into `vaultgpt-func-premium` (Kudu console `npm install`, the same mechanism that added `pg`):
```json
{
  "dependencies": {
    "xlsx": "^0.18.5",
    "mammoth": "^1.8.0",
    "officeparser": "^5.1.1"
  }
}
```
(`pg` already present. CSV/TXT need no library — native UTF-8 decode. `xlsx` = SheetJS community build; `officeparser` exposes `parseOfficeAsync(buffer)`; `mammoth` exposes `extractRawText({buffer})`.)

## §SM — Primary Reference handler (deployed `theo_finalize_attachment.index.js`, blob `23112e4a`, full verbatim — the artifact this microstep extends)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

// ---- Ingestion classes (D-8 RESOLVED): declared-type allow-list + per-class size cap.
const NATIVE_MAX_BYTES = 10 * 1024 * 1024;
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

// HEAD the blob to read its AUTHORITATIVE byte size (the client cannot misdeclare size:
// Content-Length is the actual stored length). Returns null when the blob is absent.
async function getBlobProperties(accountName, containerName, blobKey) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const url = `https://${accountName}.blob.core.windows.net/${containerName}/${encodeBlobPath(blobKey)}`;
  const r = await requestUrl(url, {
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

async function deleteBlobBestEffort(context, accountName, containerName, blobKey) {
  try {
    const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
    const url = `https://${accountName}.blob.core.windows.net/${containerName}/${encodeBlobPath(blobKey)}`;
    await requestUrl(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" },
    });
  } catch (e) {
    context.log.warn("theo_finalize_attachment: best-effort blob cleanup failed", e);
  }
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
        (id, created_by, conversation_id, filename, content_type, byte_size, blob_container, blob_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id, conversation_id, filename, content_type, byte_size, blob_container, blob_path, created_at
      `,
      [attachmentId, oid, conversationId, filename, contentType, byteSize, STORAGE_CONTAINER, blobKey]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({
      attachment: { ...inserted.rows[0], ingestion_class: ingestion.class },
    }));
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

## §SM-FJ — Primary Reference function.json (deployed `theo_finalize_attachment.function.json`, blob `9fdd3c54`, full verbatim — UNCHANGED; also the B8c deploy function.json)
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

## §H — `theo_finalize_attachment/index.js` (complete; B8c — adds extract-class extraction + the two columns)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

// ---- Ingestion classes (D-8 RESOLVED): declared-type allow-list + per-class size cap.
const NATIVE_MAX_BYTES = 10 * 1024 * 1024;
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
  let ingestionClass = ingestion.class; // 'native' | 'extract'
  let extractedTextPath = null;
  if (ingestion.class === "extract") {
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

## §GOLDEN — golden-curl re-run (Claude Code, post-deploy; token via `az`, never printed)
1. **native regression** — create(pdf) → PUT → finalize → expect **201** with `ingestion_class:"native"`, `extracted_text_path:null` (the B8b green path, unchanged); delete.
2. **extract probe (CSV — pipeline proof, zero-lib path)** — create `{filename:"probe.csv", content_type:"text/csv"}` → PUT a small CSV with `Content-Type: text/csv` → finalize → **201** with `ingestion_class:"extract"`, `extracted_text_path` = `attachments/<oid>/<attachmentId>.extracted.md` (non-null); HEAD/GET the sibling blob → contains the CSV text.
3. **extract probe (XLSX — exercises SheetJS)** — generate a tiny valid `.xlsx` (locally, post-deploy), upload + finalize → **201**; sibling text contains the sheet name + cell values as markdown/CSV. (docx/pptx spot-checked similarly once the libs are installed.)
4. **RO verify** (`.local\run-reporting-ro-query.ps1`): the two new columns exist; a finalized extract-class row has `ingestion_class='extract'` + non-null `extracted_text_path` (catalog + the §VERIFY column check; row reads remain RLS-bounded — owner-scoped handler responses are the row proof).
5. cleanup: delete the probes.

## §DEPLOY — Walter deploy steps
1. Run `b8c_addendum.sql` against the shared `vaultgpt` Postgres **as `pgadmin_vault`** → reply lets Claude Code run §VERIFY.
2. **Kudu:** `npm install xlsx mammoth officeparser` in `vaultgpt-func-premium` (same as `pg`).
3. Replace **only** `theo_finalize_attachment/index.js` with §H (route + function.json unchanged; create/delete untouched).
4. Reply "B8c deployed" → Claude Code re-runs §GOLDEN + §VERIFY, captures evidence, then prepares the doc Role-C (G-3) and begins B8d (gateway injection).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B8c Attachment Extraction-at-Upload Pass-1 Backend VEP (plan only).*
