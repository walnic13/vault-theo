# Theo 1B — VC-9.1 Deploy `theo_create_attachment_upload` to `vaultgpt-func-chat` (host-parity for the chat attachment flow) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). On APPROVED, Claude Code deploys the (byte-identical, already-approved) handler to the dedicated `vaultgpt-func-chat` app (§1E / DR-T7) + runs a golden curl. **No migration. No code change. No contract change → no Role-C.** Plan-only.
>
> **Scope (VC-9.1 = host-parity, no new behaviour):** deploy the DEPLOYED `theo_create_attachment_upload` (the B8b SAS-signature-fix version, blob `bc1aa7c5`) — currently on the reporting/Theo monolith `vaultgpt-func-premium` — **also** to `vaultgpt-func-chat`, byte-identical. **Why:** VC-9's chat attachment flow (send/list/download) is on `vaultgpt-func-chat`, but the chat FE client (`chatClient.ts`) reads ONLY `VITE_CHAT_API_BASE_URL` (func-chat) with an explicit no-fallback-to-the-monolith design. So the upload-SAS step must be reachable on the func-chat host too. `vaultgpt-func-chat` now has the System-Assigned MI + **Storage Blob Data Contributor** (provisioned for VC-9) that this handler needs to mint a user-delegation SAS — so the identical handler works there. Theo keeps using the monolith's copy (B8 attachment flow); chat uses func-chat's copy. Avoids any cross-app token-audience / CORS surface (Walter-decided over the cross-app alternative).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `1f35c8e2d6a761fc44bab23fe7ce795e82f814a2` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP to deploy the already-approved `theo_create_attachment_upload` (blob `bc1aa7c5`, B8b SAS-signature-fix) byte-identically to `vaultgpt-func-chat` for host-parity with the VC-9 chat attachment flow. NO migration; NO code change (byte-identical to the deployed monolith version — the last Codex-approved change to this handler; the live monolith Kudu SCM was not reachable this turn (HTTP 000), so the approved package blob `bc1aa7c5` is used as the governance source of truth); NO contract change (the `theo_create_attachment_upload` route + shape are already in API Spec §2.10 — no Role-C). The func-chat MI + Storage Blob Data Contributor (provisioned for VC-9, verified working by the VC-9 download-SAS curl) supplies the user-delegation-key capability this handler needs. No RLS/DB touch (the handler is stateless — SAS issuance only). No `reporting_*` change; the monolith copy is unchanged (additive second deployment). Primary Reference inlined byte-verbatim + its function.json.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register) | `grep -F "VEP Format"` + `grep -F "Gap Register"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4A P-track) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary; §4 external-system) | `grep -F "selects **exactly one** deployed handler file"` + `grep -F "It MUST NOT read or write"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis; §1E deploy exception) | `grep -F "Pass 1 (Claude Code VEP)"` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (B8 attachments; VC chat) | `grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 repo/host boundary) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo API Spec — `spec/THEO_API_SPEC.md` (`theo_create_attachment_upload` already documented — no contract change) | `grep -c "theo_create_attachment_upload"` this turn (2 hits) | `b0976ff8fbccaf28495cc0f1e7594893221bf844` |
| 9 | **Primary Reference handler** (DEPLOYED upload SAS issuer, monolith) — `Codex Governance/Theo-1B-B8b-SAS-Signature-Fix-Pass-1-VEP/theo_create_attachment_upload.index.js` | `Read(full)` this turn | `bc1aa7c51ad5b55e84d4fa625b443cab70dc8175` |
| 10 | **Primary Reference function.json** — `Codex Governance/Theo-1B-B8b-SAS-Signature-Fix-Pass-1-VEP/theo_create_attachment_upload.function.json` | `Read(full)` this turn | `c2031bdb3789a51d119c7a5c8b5055bc1c2d5a3b` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change; the monolith copy is untouched. Streaming sidecar READ-ONLY. Deploy target `vaultgpt-func-chat` (additive — a second copy of an existing handler).

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §SM + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 — recorded VC/B8 tier |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_create_attachment_upload` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — the handler touches only Blob (existing `theo-content`) + MI; no DB, no `reporting_*` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — no new external system (Blob already used by func-chat via MI in VC-9) |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — owner-scoped blob key `attachments/<oid>/<uuid>`; no RLS/DB |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | §P4 — the upload route is already documented; no contract change |

## P1 — Feature identification
**Microstep:** VC-9.1 — deploy the existing, Codex-approved `theo_create_attachment_upload` (blob `bc1aa7c5`) byte-identically to `vaultgpt-func-chat`, so the chat attachment upload-SAS step is on the same host the chat FE client already targets (`VITE_CHAT_API_BASE_URL`). No new behaviour; host-parity only.

**No migration. No code change. No contract change (route already in API Spec §2.10) → no Role-C.**
**Deploy (1), on `vaultgpt-func-chat`:** `POST /api/theo_create_attachment_upload` `{ filename, content_type }` → **201** `{ attachmentId, upload:{ uploadUrl, blobKey, requiredHeaders, expiresAt, … } }` (issues a 15-min, single-blob, create+write user-delegation SAS at the owner-scoped key `attachments/<oid>/<uuid>`).

**Out of scope (VC-9.1):** any handler behaviour change; removing/altering the monolith copy (Theo B8 keeps using it); the FE (VC-9-FE consumes this); the attachment send/list/download handlers (already deployed in VC-9).

**Plan status:** enables the clean single-host VC-9-FE (Walter-decided over the cross-app alternative). No plan/spec delta.

## P2 — Architecture & boundary reconciliation
**Handler family.** `theo_create_attachment_upload` is the DEPLOYED Family-B SAS issuer (EasyAuth OID; validate-before-issue; managed-identity user-delegation-key → positional canonical string-to-sign → HMAC; `{data,meta}`/`{error}` envelope; anonymous `httpTrigger`). VC-9.1 deploys it **unchanged** to a second app.
**Boundary.** Touches only Blob (the existing `theo-content` container) via the func-chat MI; **no DB, no `reporting_*`, no monolith mutation** (Golden §3). The monolith copy is untouched. Deploy target `vaultgpt-func-chat`; the streaming sidecar READ-ONLY.
**Host readiness.** `vaultgpt-func-chat` has System-Assigned MI + **Storage Blob Data Contributor** on `vaultgptstorage01` (provisioned for VC-9; the role includes `generateUserDelegationKey`) — verified working by the VC-9 `theo_chat_attachment_download` SAS curl. So the identical upload handler can mint its SAS there.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| Two live copies of `theo_create_attachment_upload` (monolith for Theo B8; func-chat for chat). | Deliberate host-parity; identical code. If the handler is ever revised, BOTH copies must be updated (or consolidated). | **PROCEED** — noted for future maintenance; the code is generic (owner-scoped, no per-app coupling). |
| Live monolith bytes not fetched this turn (Kudu SCM HTTP 000). | The approved package blob `bc1aa7c5` (B8b SAS-signature-fix — the last Codex-approved change to this handler; later B8 tiers touched `theo_finalize_attachment`, not upload) is the governance source of truth. | **PROCEED** — deploy the approved bytes; the golden curl proves the func-chat copy works. |
| No contract/Role-C. | The `theo_create_attachment_upload` route + response shape are already documented in API Spec §2.10; deploying to a second host doesn't change the contract. | **PROCEED** — no Role-C. |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**No new external system.** Blob (the `theo-content` container, managed-identity data-plane) is ALREADY used by `vaultgpt-func-chat` — VC-9's `theo_chat_send_message` (blob HEAD) and `theo_chat_attachment_download` (user-delegation read SAS) were deployed + curl-verified there this session. The upload handler uses the SAME MI user-delegation-key technique (permission `cw`). Per Golden §4 no new-external-system helper is introduced; func-chat's MI already carries the required role.

## P4 — Contract reconciliation
Unchanged. `POST /api/theo_create_attachment_upload` `{ filename, content_type }` → **201** `{ attachmentId, filename, contentType, ingestionClass, maxBytes, upload:{ storageProvider, account, container, blobKey, blobUrl, uploadUrl, method:"PUT", requiredHeaders:{ "x-ms-blob-type":"BlockBlob", "Content-Type" }, expiresAt } }`. Missing filename → **400**; unsupported `content_type` → **400 UNSUPPORTED_MEDIA_TYPE**; missing EasyAuth → **401**. Already in API Spec §2.10 (no delta).

## P5 — Error-model reconciliation
Unchanged (the handler's existing map): 401 (EasyAuth) / 400 (missing filename; unsupported type) / 500 (SAS issuance failure). `{data,meta}`/`{error}` envelope preserved. No new arm.

## P6 — Data-shape reconciliation
No schema change; the handler is **stateless** (no DB — it issues a SAS + returns the descriptor; no `theo_attachments`/`theo_chat_*` row is written by this handler). The blob key is the owner-scoped `attachments/<oid>/<uuid>`; the VC-9 `theo_chat_send_message` records the pointer on the message row after the client uploads.

## P7 — Idempotency / concurrency
Each call mints a fresh `attachmentId` + a fresh 15-min SAS (not idempotent by design — a new upload target per call, like the monolith copy). No shared state; no concurrency concern (stateless).

## P8 — Security / RLS reconciliation
No RLS/DB touch. The owner-scoped key `attachments/<oid>/<uuid>` embeds the caller's EasyAuth OID (so the VC-9 send handler can re-assert ownership). The SAS is single-blob, create+write, `https`-only, 15-min, content-type-pinned; signed by the func-chat MI's short-lived user-delegation key (no account key in code/env). Identical security posture to the deployed monolith copy. "Default family: ownership-based" — the per-caller key is the ownership scope.

## §SM — Primary Reference (DEPLOYED `theo_create_attachment_upload.index.js`, byte-verbatim — deployed IDENTICALLY to func-chat)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the DEPLOYED **`theo_create_attachment_upload`** (B8b SAS-signature-fix, blob `bc1aa7c5`). VC-9.1 deploys these EXACT bytes to `vaultgpt-func-chat` (no code change — §HG.1 is this file verbatim):

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

### §SM-FJ — Primary Reference function.json (byte-verbatim — deployed identically)

Blob `c2031bdb3789a51d119c7a5c8b5055bc1c2d5a3b`:

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

### §HG.1 — func-chat deployment
Byte-identical to §SM / §SM-FJ (no code change). Deployed to `vaultgpt-func-chat/theo_create_attachment_upload/{index.js,function.json}`.

## §DEPLOY — Pass 3 (Claude Code deploys to `vaultgpt-func-chat`; no migration)
1. **No migration; no infra prereq** — the func-chat MI + Storage Blob Data Contributor are already provisioned (VC-9) and verified working.
2. **Claude Code** deploys NEW `theo_create_attachment_upload/{index.js,function.json}` to `vaultgpt-func-chat` via Kudu VFS surgical PUT (ARM bearer; no token logged); restart → confirm the 1 new function registers (inventory 20 → 21); confirm absent (404) before the PUT; post-deploy get-back byte-matches this pack. The monolith copy is NOT touched.

## §CURL — post-deploy verification (Claude Code; az-login token for `api://4e1a1e31-…`; structural — no OIDs/bodies)
- `POST theo_create_attachment_upload` `{ filename:"vc91.txt", content_type:"text/plain" }` on **func-chat** → **201** `{ attachmentId, upload:{ uploadUrl, blobKey } }` where `blobKey` = `attachments/<caller-oid>/<attachmentId>` (**proves func-chat MI can mint a user-delegation SAS**).
- PUT a few bytes to the returned `uploadUrl` (`x-ms-blob-type: BlockBlob`, `Content-Type: text/plain`) → **201** (**proves the issued cw SAS actually works**).
- `POST theo_create_attachment_upload` `{ filename:"x", content_type:"application/zip" }` → **400 UNSUPPORTED_MEDIA_TYPE** (regression).
- (End-to-end tie-in: the uploaded blob can then be sent via the deployed `theo_chat_send_message` `{ attachment }` — already curl-verified in VC-9.)

## §SM-NOTE — structural mirror
`theo_create_attachment_upload` on func-chat is byte-identical to the deployed monolith copy (Primary Reference `bc1aa7c5`); no shared-helper/envelope/error-map drift; `node --check` clean (verified this turn). The only difference is the HOST (and thus which MI signs the SAS — func-chat's, already Storage-Blob-Data-Contributor).

## Requested Pass 2 verdict
**APPROVED** or **REJECTED** only. On APPROVED: no migration; Claude Code deploys the handler to `vaultgpt-func-chat` + the golden curl. No Role-C. Then VC-9-FE (single-host attachment flow).
