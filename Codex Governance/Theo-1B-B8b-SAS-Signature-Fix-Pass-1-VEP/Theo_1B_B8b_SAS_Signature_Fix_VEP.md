# Theo 1B — B8b SAS-Signature Fix (`theo_create_attachment_upload`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete corrected handler for Walter to **redeploy `theo_create_attachment_upload` only** at Pass 3, after which Claude Code re-runs the B8b golden-curl round-trip. **Microstep:** a golden-curl-stage fix to the **deployed** B8b create handler (approved at `1e99ca7a`). The SAS string-to-sign — copied verbatim from the deployed `axis/artifacts-upload-url` technique — omits the `signedEncryptionScope` (`ses`) field that the user-delegation-SAS canonical added in service version **2020-12-06**; since we sign `sv=2022-11-02`, the signature mismatched and every direct-to-Blob PUT returned `403 AuthenticationFailed`. **Scope: `theo_create_attachment_upload` only** — `theo_finalize_attachment` / `theo_delete_attachment` are unchanged (deployed, and returned correct `404`s in the round-trip). Empirically proven below (OLD→`AuthenticationFailed`, NEW→signature validates).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `1e99ca7a9ee9fdda61649594b1bfa635afe30752` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend fix VEP; P1–P8 walked. Artifact under fix = the deployed B8b `theo_create_attachment_upload.index.js` (blob `ed24354d`, approved `1e99ca7a`). Root cause proven at Pass-3 golden-curl time: the user-delegation SAS string-to-sign omits the `signedEncryptionScope` (`ses`) field (canonical addition in service version 2020-12-06), so with `sv=2022-11-02` the 24-field canonical is short one field and `rsct` lands in the `rscl` slot → `AuthenticationFailed`. Azure echoed its expected 24-field string-to-sign verbatim in the error (`ses` at index 18). Fix = rebuild the string-to-sign as an explicit 24-field array including `ses`. Empirically verified against `vaultgptstorage01` (OLD 5-empty → `403 AuthenticationFailed`; NEW 6-empty → signature validates, only the test user lacks write RBAC — the deployed Function MI holds Storage Blob Data Contributor). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref) | `Grep("selects \*\*exactly one\*\* deployed handler file")` this turn | `af4ef9fd93ce886ad968d3644599e54e29c67220` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B8 B8b) | `Grep("theo_create_attachment_upload")` this turn | `ebdf4d73306190ab5b44f61fb2db08932b1f3638` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Artifact under fix** — deployed B8b create handler — `Codex Governance/Theo-1B-B8b-Attachment-Upload-Handlers-Pass-1-VEP/theo_create_attachment_upload.index.js` | `Read(full)` this turn | `ed24354de518469f2cb2a061f5b3a7da2e4c7998` |
| 9 | **SAS technique reference** (source of the latent omission) — `../axis/api/pm/artifacts-upload-url/index.js` | `Read(full)` this turn | blob `ea7e21ade7f8beafe1aed619dd8ca921cd8029dc` (axis `d58a7929e8d68b644a0de2be6ff5ca9b314dfd04`) |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting`/`axis` change. No write SQL (plan only). Token bytes were never printed in any golden curl.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B8 | "theo_create_attachment_upload" | §P1 — the create handler under fix |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §H1-FIXED — single deployed handler corrected |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §H1-FIXED — owner-scoped blob path unchanged |

---

## P1 — Feature identification
**Microstep:** a Pass-3 golden-curl-stage **fix** to the deployed B8b `theo_create_attachment_upload` (Plan Tier B8). The handler issues the user-delegation **write SAS** the browser PUTs the file to; that SAS was rejected by Blob (`403 AuthenticationFailed`) because the signature was computed over a string-to-sign missing one canonical field. No behaviour/contract change — same request/response shape, same owner-scoped path; only the SAS signing string is corrected.

## P2 — Architecture & boundary reconciliation
- **Unchanged surface:** request `{filename, content_type}` → response `{attachmentId, upload:{uploadUrl,…}}`; owner-scoped path `attachments/<oid>/<attachmentId>`; managed-identity user-delegation SAS; pure `crypto`+`https` (no `@azure/storage-blob`). Helper block, validation, and the create-time allow-list check are unchanged.
- **The only change** is inside `computeUserDelegationSignature`: the string-to-sign is rebuilt as an explicit **24-field array** matching the user-delegation SAS canonical for service version ≥ 2020-12-06, adding the `signedEncryptionScope` (`ses`) empty field between `sr` and the response-header overrides. This corrects a latent omission inherited verbatim from the `axis` technique (which targets the pre-2020-12-06 23-field layout).
- **Boundary:** no `reporting_*`; no schema/DDL; no change to `theo_finalize_attachment` / `theo_delete_attachment` (deployed; their `404` paths were exercised correctly in the round-trip); no new dependency.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Redeploy (Walter).** Replace **only** `theo_create_attachment_upload/index.js` with §H1-FIXED (function.json §FJ1 unchanged). `finalize`/`delete` stay as deployed. | **PRE-LAND** — §DEPLOY; Claude Code re-runs the full §GOLDEN round-trip after. |
| G-2 | **Infra already confirmed.** The Function MI's Storage Blob Data Contributor on `vaultgptstorage01` is in place — proven because `getUserDelegationKey` succeeded (create returned 201) and the corrected signature authenticates. Blob CORS still required for the browser PUT (FE microstep B8e). | **PROCEED** — no further infra action for B8b backend; CORS is exercised by the FE step. |
| G-3 | **API-Spec/registry rows** for the three endpoints land post-green-curls. | **PRE-LAND** — unchanged from B8b; follows the re-run. |

No write SQL. No `reporting_*`/`axis` change.

## P3 — Backend / contract grounding
No contract change. The corrected handler returns the identical envelope; only the signed SAS now validates at Blob. The B8a `theo_attachments` table and the finalize INSERT are untouched.

## P4 — Schema definition
None — no DDL.

## P5 — Component reference grounding
- **Artifact under fix:** the deployed B8b `theo_create_attachment_upload.index.js` (blob `ed24354d`) — §H1-FIXED inlines the corrected file full verbatim.
- **SAS technique reference:** `axis/artifacts-upload-url/index.js` (blob `ea7e21ad`) — the source of the verbatim-copied signer. This fix **deliberately diverges** from it: the axis `computeUserDelegationSignature` emits 5 empty fields after `sr` (pre-2020-12-06 layout); the corrected handler emits 6 (adds `ses`) for `sv=2022-11-02`. (The axis handler carries the same latent defect; remediating axis is out of scope here.)

## P6 — Repository & active-surface grounding
Changed artifact: `theo_create_attachment_upload.index.js` (this fix package; supersedes the B8b-package copy for deploy). No other source touched. `node --check` clean; the corrected string-to-sign is an explicit 24-element array (provable field positions).

## P7 — Risk / regression
- **Tightly scoped:** one function body in one handler; identical inputs/outputs; no behavioural change beyond a now-valid signature.
- **Proven, not asserted:** signed locally against `vaultgptstorage01` — OLD (5-empty) → `403 AuthenticationFailed`; NEW (6-empty) → signature validates (error advances to `AuthorizationPermissionMismatch`, a *permission* error for the test user; the deployed Function MI holds the write role, so it will `201`). Azure's own echoed canonical (24 fields, `ses` at index 18) is the ground truth the fix matches.
- **No regression to finalize/delete:** unchanged and already deployed; their `404` behaviour was confirmed in the round-trip.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1 PRE-LAND; G-2/G-3); §FINDING documents the golden-curl evidence; §H1-FIXED inlines the corrected handler full verbatim; §FJ1 the unchanged function.json; §GOLDEN the re-run plan; §DEPLOY the create-only redeploy. Plan-only. On Codex APPROVAL, Walter replaces the create handler; Claude Code re-runs the full round-trip (now create→PUT→finalize→delete green) and proceeds to G-3 + B8c.

---

## §FINDING — golden-curl evidence (Pass-3; token via `az`, never printed)
Round-trip against the deployed B8b at `vaultgpt-func-premium…uksouth-01.azurewebsites.net`:
```
create   POST theo_create_attachment_upload {filename,content_type:application/pdf}  -> HTTP 201  (attachmentId + uploadUrl; getUserDelegationKey succeeded => MI role present)
PUT      <uploadUrl>  (x-ms-blob-type:BlockBlob, Content-Type:application/pdf)        -> HTTP 403  x-ms-error-code: AuthenticationFailed  ("Signature did not match")
finalize POST theo_finalize_attachment {attachment_id,filename}                       -> HTTP 404  (blob absent, because the PUT failed)
negatives: finalize-unknown -> 404 ; create-unsupported-type -> 400   (both correct)
```
Azure's `AuthenticationErrorDetail` echoed its expected **24-field** string-to-sign; field 18 is `signedEncryptionScope` (`ses`), which the handler did not emit, so `rsct` was one slot early.

Local signing proof against `vaultgptstorage01` (Walter user-delegation key; both strings differ only in the empty-field count after `sr`):
```
OLD  5 empty fields after sr (axis/current handler)  -> PUT 403 AuthenticationFailed            (signature wrong)
NEW  6 empty fields after sr (+ ses)                 -> PUT 403 AuthorizationPermissionMismatch  (signature VALID; test user lacks write RBAC; deployed MI has it)
```

## §H1-FIXED — corrected `theo_create_attachment_upload/index.js` (complete; full verbatim)
```js
const crypto = require("crypto");

// ---- Ingestion classes (D-8 RESOLVED): declared-type allow-list + per-class size cap.
// Native-read formats inject as document/image content blocks (cap 10 MB; native reading
// is accurate at/below). Extract-class formats are text-extracted at finalize (cap 50 MB).
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
const SAS_TTL_MINUTES = 15;

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

// ---- Managed-identity user-delegation SAS issuance (mirrors the deployed axis
// artifacts-upload-url technique; pure crypto + https, no @azure/storage-blob dependency).
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

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function encodeBlobPath(blobKey) {
  return blobKey.split("/").map(encodeURIComponent).join("/");
}

function decodeXmlTag(xml, tagName) {
  const m = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i"));
  return m ? m[1] : null;
}

function toIsoNoMillis(d) {
  return new Date(d).toISOString().replace(/\.\d{3}Z$/, "Z");
}

async function getUserDelegationKey(accountName, startTime, expiryTime) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const url = `https://${accountName}.blob.core.windows.net/?restype=service&comp=userdelegationkey`;
  const body =
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<KeyInfo><Start>${xmlEscape(startTime)}</Start><Expiry>${xmlEscape(expiryTime)}</Expiry></KeyInfo>`;
  const r = await requestUrl(
    url,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-ms-version": "2022-11-02",
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(body, "utf8"),
      },
    },
    body
  );
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Get User Delegation Key failed (${r.statusCode}): ${r.body}`);
  }
  const udk = {
    signedOid: decodeXmlTag(r.body, "SignedOid"),
    signedTid: decodeXmlTag(r.body, "SignedTid"),
    signedStart: decodeXmlTag(r.body, "SignedStart"),
    signedExpiry: decodeXmlTag(r.body, "SignedExpiry"),
    signedService: decodeXmlTag(r.body, "SignedService"),
    signedVersion: decodeXmlTag(r.body, "SignedVersion"),
    value: decodeXmlTag(r.body, "Value"),
  };
  if (!udk.signedOid || !udk.signedTid || !udk.signedStart || !udk.signedExpiry || !udk.signedService || !udk.signedVersion || !udk.value) {
    throw new Error("Get User Delegation Key response was missing required fields.");
  }
  return udk;
}

function computeUserDelegationSignature(params, userDelegationKey) {
  // User-delegation SAS canonical string-to-sign for service version >= 2020-12-06
  // (we sign with sv = 2022-11-02). Field order is exact and positional — every field is
  // present (empty string when unused). The block after `sr` is:
  //   sst, ses (signedEncryptionScope, added in 2020-12-06), rscc, rscd, rsce, rscl, rsct.
  // Built as an explicit array (not hand-counted newlines) so the field positions are provable
  // against Azure's canonical (which Azure echoes verbatim in any AuthenticationFailed detail).
  const stringToSign = [
    params.sp,
    params.st,
    params.se,
    params.canonicalizedResource,
    userDelegationKey.signedOid,
    userDelegationKey.signedTid,
    userDelegationKey.signedStart,
    userDelegationKey.signedExpiry,
    userDelegationKey.signedService,
    userDelegationKey.signedVersion,
    "", // signedAuthorizedUserObjectId (saoid)
    "", // signedUnauthorizedUserObjectId (suoid)
    "", // signedCorrelationId (scid)
    "", // signedIP (sip)
    params.spr,
    params.sv,
    params.sr,
    "", // signedSnapshotTime (sst)
    "", // signedEncryptionScope (ses)
    "", // rscc (Cache-Control)
    "", // rscd (Content-Disposition)
    "", // rsce (Content-Encoding)
    "", // rscl (Content-Language)
    params.rsct || "", // rsct (Content-Type)
  ].join("\n");
  const key = Buffer.from(userDelegationKey.value, "base64");
  return crypto.createHmac("sha256", key).update(stringToSign, "utf8").digest("base64");
}

async function buildUserDelegationSas(accountName, containerName, blobKey, permissions, expiresInMinutes, mimeType) {
  const now = new Date();
  const start = new Date(now.getTime() - 5 * 60 * 1000);
  const expiry = new Date(now.getTime() + expiresInMinutes * 60 * 1000);
  const udk = await getUserDelegationKey(accountName, toIsoNoMillis(start), toIsoNoMillis(expiry));

  const sv = "2022-11-02";
  const sr = "b";
  const spr = "https";
  const st = toIsoNoMillis(start);
  const se = toIsoNoMillis(expiry);
  const canonicalizedResource = `/blob/${accountName}/${containerName}/${blobKey}`;

  const sig = computeUserDelegationSignature(
    { sp: permissions, st, se, canonicalizedResource, spr, sv, sr, rsct: mimeType || "" },
    udk
  );

  const qp = new URLSearchParams();
  qp.set("sp", permissions);
  qp.set("st", st);
  qp.set("se", se);
  qp.set("skoid", udk.signedOid);
  qp.set("sktid", udk.signedTid);
  qp.set("skt", udk.signedStart);
  qp.set("ske", udk.signedExpiry);
  qp.set("sks", udk.signedService);
  qp.set("skv", udk.signedVersion);
  qp.set("spr", spr);
  qp.set("sv", sv);
  qp.set("sr", sr);
  if (mimeType) qp.set("rsct", mimeType);
  qp.set("sig", sig);

  return { sas: qp.toString(), expiresAt: se };
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

  // ---- Validate inputs before issuing any SAS (deterministic 400s) ----
  const filename = cleanFileName(body.filename);
  if (!filename) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'filename' is required and must be a non-empty string.", 400));
  }

  const contentType = normalizeContentType(body.content_type);
  const ingestion = INGESTION_CLASSES[contentType];
  if (!ingestion) {
    return send(
      context,
      400,
      errorBody(
        "UNSUPPORTED_MEDIA_TYPE",
        `Field 'content_type' must be one of the supported attachment types: ${ALLOWED_CONTENT_TYPES.join(", ")}.`,
        400
      )
    );
  }

  try {
    // Owner-scoped, deterministic blob path: attachments/<oid>/<attachmentId>.
    // The path embeds the caller OID so finalize/delete can prove ownership of the blob,
    // and embeds the attachment id so the persisted row id matches the stored blob 1:1.
    const attachmentId = crypto.randomUUID();
    const blobKey = `attachments/${oid}/${attachmentId}`;

    // Short-lived (15 min), single-blob, create+write SAS; response content-type pinned.
    const { sas, expiresAt } = await buildUserDelegationSas(
      STORAGE_ACCOUNT,
      STORAGE_CONTAINER,
      blobKey,
      "cw",
      SAS_TTL_MINUTES,
      contentType
    );

    const blobUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeBlobPath(blobKey)}`;
    const uploadUrl = `${blobUrl}?${sas}`;

    return send(context, 201, successBody({
      attachmentId,
      filename,
      contentType,
      ingestionClass: ingestion.class,
      maxBytes: ingestion.maxBytes,
      upload: {
        storageProvider: "azure_blob",
        account: STORAGE_ACCOUNT,
        container: STORAGE_CONTAINER,
        blobKey,
        blobUrl,
        uploadUrl,
        method: "PUT",
        requiredHeaders: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": contentType,
        },
        expiresAt,
      },
    }));
  } catch (err) {
    context.log.error("theo_create_attachment_upload failed", err);
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred issuing the upload URL.", 500));
  }
};
```

## §FJ1 — `theo_create_attachment_upload/function.json` (unchanged)
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_create_attachment_upload"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §GOLDEN — re-run plan (Claude Code, post-redeploy; token via `az`, never printed)
Re-run the full B8b round-trip: create → **PUT to Blob (now expect 201)** → finalize (201; `content_type` = actual blob type, `byte_size` = actual) → RO-verify the row → negatives (404 / unsupported-type 400 / **misdeclaration guard** 400 / oversize 400) → delete (200) → re-finalize-after-delete (404). Capture under `.local/`.

## §DEPLOY — Walter deploy step
1. Replace **only** `theo_create_attachment_upload/index.js` with §H1-FIXED (route + function.json unchanged; `finalize`/`delete` untouched).
2. Reply "B8b create redeployed" → Claude Code re-runs §GOLDEN, captures evidence, then prepares the API-Spec/registry Role-C (G-3) and begins B8c.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B8b SAS-Signature Fix Pass-1 Backend VEP (plan only).*
