# Theo 1B — B8b Attachment Upload Handlers (`theo_create_attachment_upload` / `theo_finalize_attachment` / `theo_delete_attachment`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handlers provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier **B8b (upload handlers)** over the deployed `theo_attachments` table (B8a). Three GREENFIELD handlers implementing the D-8-resolved **SAS direct-to-Blob** flow: `theo_create_attachment_upload` (issue a short-lived, single-blob, owner-scoped **write SAS** + the deterministic blob path), `theo_finalize_attachment` (HEAD the uploaded blob to read its **actual** size, enforce the per-class cap + ingestion-class allow-list, insert the owner-scoped row), and `theo_delete_attachment` (owner-scoped row delete + best-effort blob reclaim). **Every query is explicitly scoped `created_by = $oid`** (per the deployed SEC user-isolation fix), with RLS the second layer. SAS issuance mirrors the deployed `axis/artifacts-upload-url` user-delegation technique (managed identity → user delegation key → manually-signed SAS; pure `crypto`+`https`, no `@azure/storage-blob` dependency). Mutation idiom mirrors the canonical Family-B Primary Reference `reporting_create_entity`. **Ungated** — D-8 RESOLVED (mechanism + limits + ingestion classes); B8a substrate DEPLOYED + RO-verified. Storage substrate + upload only — extraction-at-upload (B8c), gateway injection (B8d), and FE (B8e) are subsequent microsteps.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `c989795f0a1fb0d6d50245041125d704a459710c` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference handler (Golden §2) = the deployed `reporting_create_entity` (pg mutation pattern: BEGIN/set_config/INSERT RETURNING/COMMIT + 42501/23503/23514 mapping; inlined verbatim §SM) + its function.json (§SM-FJ). **SAS technique reference** = the deployed `axis/api/pm/artifacts-upload-url/index.js` (managed-identity user-delegation SAS; inlined verbatim §SAS) — its `getManagedIdentityAccessToken` / `getUserDelegationKey` / `computeUserDelegationSignature` / `buildUserDelegationSas` block is reproduced unchanged in the create handler and its MI-bearer data-plane access in finalize/delete. Contract basis = the deployed `theo_attachments` table (B8a migration `b8a_migration.sql`, Codex-APPROVED + deployed + RO-verified — table + 4-policy RLS + `theo_attachment_exists_unscoped`); the schema-doc §7 DEPLOYED row (B8a G-2 Role-C) is now applied (schema doc §7, blob `0936b75e`), and the API-Spec rows + Golden-Handler registry follow post-deploy (§GR), mirroring B3b/B7a. Validation precedes SQL/Blob (deterministic 400s). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §5 SM) | `Grep("selects \*\*exactly one\*\* deployed handler file")` this turn | `af4ef9fd93ce886ad968d3644599e54e29c67220` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B8 B8b; §8 D-8 RESOLVED) | `Read(offset=116,limit=85)` + `Grep("theo_create_attachment_upload")` this turn | `ebdf4d73306190ab5b44f61fb2db08932b1f3638` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis (1/2)** — deployed B8a migration — `Codex Governance/Theo-1B-B8a-Attachments-Schema-Pass-1-VEP/b8a_migration.sql` | `Read(full)` this turn | `cc61acf1bbb2187260fd88232b92e445141ea395` |
| 9 | **Contract basis (2/2)** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 set + §7 `theo_attachments` DEPLOYED row, now applied) | `Grep("theo_attachments")` this turn | `0936b75e47c9f9d48876acbebc2f0d8f750b012b` |
| 10 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2 boundary; attachment rows follow post-deploy) | `Read(offset=1, limit=20)` this turn | `f491b3986dd1fdbcaa91346def08520217fc9370` |
| 11 | **Primary Reference handler** (pg mutation pattern) — `../corporate-reporting/reference-artifacts/handlers/reporting_create_entity.index.js.md` | `Read(full)` + `Grep("BEGIN|RETURNING|23503")` this turn | blob `c2f02bf0f6c5be50900a9fbb7a015529e649ad25` (corporate-reporting `38da0d6a722de6042ece0a6c5979b13dff7da736`) |
| 12 | **Primary Reference function.json** (canonical deployed) — `../corporate-reporting/reference-artifacts/function-json/reporting_create_entity.function.json.md` | `Read(full)` this turn | blob `25400b61661db135baa73392e5c0d7b76ae742b3` (corporate-reporting `38da0d6a722de6042ece0a6c5979b13dff7da736`) |
| 13 | **SAS technique reference** (deployed user-delegation SAS) — `../axis/api/pm/artifacts-upload-url/index.js` | `Read(full)` this turn | blob `ea7e21ade7f8beafe1aed619dd8ca921cd8029dc` (axis `d58a7929e8d68b644a0de2be6ff5ca9b314dfd04`) |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting`/`axis` change (both inlined verbatim as read-only references). No write SQL executed (plan only).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B8 | "theo_create_attachment_upload" | §P1 / §H1–§H3 — the B8b upload handlers |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B8 | "write SAS" | §H1 — SAS-issuance mechanism |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `reporting_create_entity` |
| ../corporate-reporting/reference-artifacts/function-json/reporting_create_entity.function.json.md | binding | "httpTrigger" | §SM-FJ / §FJ1–§FJ3 — function.json binding shape |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §H1–§H3 — every query scoped `created_by = $oid` |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §2 | "Four separate policies per table" | §H2/§H3 — handlers operate over the deployed B8a ownership-RLS table |

---

## P1 — Feature identification
**Microstep:** Theo Phase 1B **Tier B8b (upload handlers)** over the deployed `theo_attachments` table (Rule Anchor on Plan Tier B8). Three handlers implement the D-8-resolved upload flow so a user can attach a file to a chat:
- **`theo_create_attachment_upload`** — validate `filename` + `content_type` (ingestion-class allow-list), mint an attachment id + deterministic owner-scoped blob path `attachments/<oid>/<attachmentId>`, and return a short-lived (15-min), single-blob, create+write **user-delegation SAS** the client PUTs the bytes to directly.
- **`theo_finalize_attachment`** — after the client uploads, HEAD the blob to read its **actual** byte size (authoritative; the client cannot misdeclare it), enforce the per-class cap (10 MB native / 50 MB extract) + the allow-list, verify any referenced conversation is owned, and insert the owner-scoped `theo_attachments` row (`id = attachmentId`, so row ↔ blob are 1:1).
- **`theo_delete_attachment`** — owner-scoped permanent delete of the row (403/404 split via `theo_attachment_exists_unscoped`) + best-effort blob reclaim.

Storage + upload only. Extraction-at-upload (B8c), gateway document/image-block injection (B8d), and the FE composer control (B8e) are separate, later microsteps.

## P2 — Architecture & boundary reconciliation
- **Family-B (finalize/delete).** `pg` Pool over `POSTGRES_CONNECTION_STRING` (`ssl.rejectUnauthorized:false`); per-request `set_config(oid)` (the three settings); mutations `connect→BEGIN→set_config→…→COMMIT` with `catch ROLLBACK` and the `42501→403 / 23503→404 / 23514→400` mapping. Identical helper block (`send`/`nowIso`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`buildKnownError`/`isUuid`) to the deployed theo handlers.
- **SAS issuance (create).** Reproduces the deployed `axis/artifacts-upload-url` user-delegation technique **verbatim** (§SAS): managed-identity token for `https://storage.azure.com/` (`IDENTITY_ENDPOINT`/`IDENTITY_HEADER`, api-version `2019-08-01`) → `Get User Delegation Key` (`x-ms-version: 2022-11-02`) → manually-signed SAS (`sp=cw`, `sr=b`, 15-min, `rsct` pinned to the declared content-type). No `@azure/storage-blob` dependency (pure `crypto`+`https`) — matches the deployed pattern and avoids adding a package.
- **Managed-identity data-plane access (finalize/delete).** The same MI token is used as a `Bearer` on a **HEAD** (read actual size/type) and **DELETE** (reclaim) against the blob — no SAS needed server-side.
- **Explicit ownership (SEC-fix discipline).** The blob path embeds the caller OID, so create/finalize/delete operate only within `attachments/<thisOID>/…`; the row INSERT/SELECT/DELETE all carry `created_by = $oid`. A non-owned id → 0 rows → `theo_attachment_exists_unscoped` → 403/404 (no leakage).
- **Validation before SQL/Blob.** `cleanFileName` non-empty; `content_type` normalized + allow-listed (else 400 `UNSUPPORTED_MEDIA_TYPE`); `attachment_id`/`conversation_id` `isUuid`; actual size `> 0` and `≤ cap` (else 400, with best-effort cleanup of the offending blob) — all before the INSERT.
- **Boundary.** Reads/writes only `theo_attachments` (deployed B8a) + the existing `theo-content` Blob container; FK `conversation_id` references the deployed B2 `theo_conversations`; **no `reporting_*` access**; the `reporting_create_entity` and `axis` files are inlined read-only references, unchanged.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** Three new handlers + three `function.json` files copy-pasted into the shared Functions app (routes `theo_create_attachment_upload` / `theo_finalize_attachment` / `theo_delete_attachment`). `pg` already present (theo handlers); **no new npm dependency** (SAS is pure `crypto`+`https`). | **PRE-LAND** — §DEPLOY; Claude Code runs the §GOLDEN curl round-trip after. |
| G-2 | **SAS infra prerequisite (FIRST Theo Blob I/O).** The Theo Function App's **system-assigned managed identity** must hold **Storage Blob Data Contributor** on `vaultgptstorage01` (needed to get a user-delegation key + HEAD/DELETE blobs). Blob-service **CORS** on `vaultgptstorage01` must allow `PUT`/`HEAD` from the Origin/Theo SWA origin (the browser PUTs directly to Blob). `IDENTITY_ENDPOINT`/`IDENTITY_HEADER` exist automatically once MI is enabled. | **PRE-LAND** — Walter confirms/grants before deploy; Claude Code's golden curl will surface a 500 from `Get User Delegation Key` if the role is missing. Optional app settings `THEO_BLOB_ACCOUNT`/`THEO_BLOB_CONTAINER` default to `vaultgptstorage01`/`theo-content` (baked in). |
| G-3 | **API Spec + Golden-Handler registry.** The three endpoint rows (request/response envelopes) + the registry entries land post-deploy. | **PRE-LAND** — short API-Spec + registry Role-C after green curls (mirrors B3b/B7a). |
| G-4 | **Schema-doc §7 `theo_attachments` DEPLOYED row.** The B8a G-2 Role-C is **applied** (Codex-executed; schema doc §7 + §3 row present at blob `0936b75e`). | **PROCEED** — resolved; the schema doc now records the deployed B8a table and doc #9 anchors the post-edit blob. No in-scope action remains. |
| G-5 | **B8c extraction + additive schema addendum.** Extraction-at-upload (SheetJS/mammoth/PPT/native) + the additive `ingestion_class`/`extracted_text_path` columns on `theo_attachments`. | **PROCEED (future-trigger)** — next microstep; B8b persists raw metadata + blob pointer only. |

No write SQL in this pack (plan only — no DDL; the B8a table is already deployed). No `reporting_*`/`axis` change.

## P3 — Backend / contract grounding
No new DDL — the handlers operate over the deployed `theo_attachments` table (doc #8, RO-verified: 4 ownership policies on `created_by = auth.uid()`, `theo_attachment_exists_unscoped(uuid)` SECURITY DEFINER, FK `conversation_id → theo_conversations` ON DELETE SET NULL, `byte_size >= 0`, non-empty `filename`). Endpoint request/response envelopes (success `{data,meta}` / error `{error:{code,message,status,timestamp}}`) mirror the deployed theo handlers; the API-Spec rows + Golden-Handler registry follow post-deploy (G-3). All three columns the INSERT writes (`id`, `created_by`, `conversation_id`, `filename`, `content_type`, `byte_size`, `blob_container`, `blob_path`) exist in the B8a table; `created_at` defaults.

## P4 — Schema definition
None for B8b — substrate is the deployed B8a `theo_attachments` table. (The B8c extraction addendum — `ingestion_class`/`extracted_text_path` — is a later microstep, G-5.)

## P5 — Component reference grounding
- **Primary Reference (mutation idiom):** deployed `reporting_create_entity` — handler §SM (blob `c2f02bf0`) + function.json §SM-FJ (blob `25400b61`), full verbatim. `theo_finalize_attachment` reproduces its `connect→BEGIN→set_config→INSERT RETURNING→COMMIT` shape and error mapping; `theo_delete_attachment` reproduces the deployed `theo_delete_user_memory` 403/404 `_exists_unscoped` split (same Family-B lineage).
- **SAS technique reference:** deployed `axis/artifacts-upload-url/index.js` — §SAS (blob `ea7e21ad`), full verbatim. The create handler reproduces its `requestUrl`/`getManagedIdentityAccessToken`/`xmlEscape`/`encodeBlobPath`/`decodeXmlTag`/`toIsoNoMillis`/`getUserDelegationKey`/`computeUserDelegationSignature`/`buildUserDelegationSas` block unchanged (only the account/container/path/permissions inputs differ); finalize/delete reuse `requestUrl`/`getManagedIdentityAccessToken`/`encodeBlobPath` for MI-bearer HEAD/DELETE.

## P6 — Repository & active-surface grounding
New artifacts (this package): `theo_create_attachment_upload.index.js` + `.function.json`, `theo_finalize_attachment.index.js` + `.function.json`, `theo_delete_attachment.index.js` + `.function.json`. No existing source/handler/active-surface file changed (the deployed `theo_message` gateway is untouched in B8b — it gains `attachment_ids` in B8d). Guardrails: no `reporting_*`; ownership-scoped queries; validation-before-effect; no new dependency. All three `index.js` pass `node --check`; all three `function.json` parse as JSON.

## P7 — Risk / regression
- **Additive only:** three brand-new routes; nothing existing is modified. No live traffic touches them until the FE (B8e) wires the composer.
- **No secret exposure:** the SAS is signed server-side with the user-delegation key (never the account key); the key bytes are never logged; the golden curls obtain the auth token via `az` and **never** print token bytes.
- **Abuse bounds:** the SAS is single-blob, create+write only, 15-min; the path is owner-scoped; finalize enforces the size cap on the **actual** uploaded bytes (not the client's claim) and deletes an over-cap/empty blob. Cross-user finalize/delete is impossible (path + `created_by` both bind to the request OID).
- **Orphan safety:** an abandoned upload (created SAS, never finalized) leaves a blob with no row — reclaimable by a future sweeper; a deleted row whose blob reclaim fails leaves a harmless orphan blob (DB is source of truth).
- **Failure modes mapped:** missing MI Storage role → `Get User Delegation Key` 500 (surfaced by the golden curl, fixed by G-2); blob absent at finalize → 404; duplicate finalize → 409; non-owned conversation → 404.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2/G-3 PRE-LAND; G-4/G-5 PROCEED); complete handlers in §H1–§H3 + function.json in §FJ1–§FJ3; Primary Reference pair §SM/§SM-FJ + SAS technique reference §SAS inlined full verbatim; golden-curl round-trip in §GOLDEN; deploy steps in §DEPLOY. Plan-only. On Codex APPROVAL, Walter confirms G-2 infra + deploys; Claude Code runs the §GOLDEN round-trip; then the API-Spec/registry Role-C (G-3) and the B8c extraction microstep.

---

## §SM — Primary Reference handler (deployed `reporting_create_entity.index.js.md`, blob `c2f02bf0`, full verbatim)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

const ALLOWED_ENTITY_CLASSIFICATIONS = ["c_corp", "s_corp", "partnership", "disregarded"];
const FUNCTIONAL_CURRENCY_REGEX = /^[A-Z]{3}$/;
const FEDERAL_EIN_REGEX = /^\d{2}-?\d{7}$/;

const CLIENT_SITE_ID_MIN_LEN = 1;
const CLIENT_SITE_ID_MAX_LEN = 200;
const ENTITY_NAME_MAX_LEN = 200;
const TAX_JURISDICTION_MAX_LEN = 100;

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
  try { body = parseBody(req); }
  catch { return send(context, 400, errorBody("INVALID_REQUEST", "Request body must be valid JSON.", 400)); }

  const clientSiteId = typeof body.client_site_id === "string" ? body.client_site_id.trim() : "";
  if (clientSiteId.length < CLIENT_SITE_ID_MIN_LEN || clientSiteId.length > CLIENT_SITE_ID_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", "client_site_id is required and must be a non-empty string.", 400));
  }

  const entityName = typeof body.entity_name === "string" ? body.entity_name.trim() : "";
  if (entityName.length === 0 || entityName.length > ENTITY_NAME_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", "entity_name is required and must be a non-empty string within the allowed length.", 400));
  }

  const functionalCurrency = typeof body.functional_currency === "string" ? body.functional_currency : "";
  if (!FUNCTIONAL_CURRENCY_REGEX.test(functionalCurrency)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "functional_currency is required and must be a three-letter ISO 4217 code.", 400));
  }

  let entityClassification = null;
  if (body.entity_classification !== undefined && body.entity_classification !== null) {
    if (typeof body.entity_classification !== "string" || !ALLOWED_ENTITY_CLASSIFICATIONS.includes(body.entity_classification)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "entity_classification, when supplied, must be one of: c_corp, s_corp, partnership, disregarded.", 400));
    }
    entityClassification = body.entity_classification;
  }

  let taxJurisdiction = null;
  if (body.tax_jurisdiction !== undefined && body.tax_jurisdiction !== null) {
    if (typeof body.tax_jurisdiction !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "tax_jurisdiction, when supplied, must be a non-empty string within the allowed length.", 400));
    }
    const trimmed = body.tax_jurisdiction.trim();
    if (trimmed.length === 0 || body.tax_jurisdiction.length > TAX_JURISDICTION_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", "tax_jurisdiction, when supplied, must be a non-empty string within the allowed length.", 400));
    }
    taxJurisdiction = body.tax_jurisdiction;
  }

  let federalEin = null;
  if (body.federal_ein !== undefined && body.federal_ein !== null) {
    if (typeof body.federal_ein !== "string" || !FEDERAL_EIN_REGEX.test(body.federal_ein)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "federal_ein, when supplied, must be nine digits with an optional single hyphen after the second digit.", 400));
    }
    federalEin = body.federal_ein;
  }

  const client = await pool.connect();

  try {
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

    const clientSiteAccessResult = await client.query(
      `
      SELECT 1
      FROM public.reporting_client_sites
      WHERE site_id = $1
        AND is_active = TRUE
      LIMIT 1
      `,
      [clientSiteId]
    );

    if (clientSiteAccessResult.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Client site not found.", 404);
    }

    const insertResult = await client.query(
      `
      INSERT INTO public.reporting_entities (
        client_site_id,
        entity_name,
        functional_currency,
        entity_classification,
        tax_jurisdiction,
        federal_ein,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        client_site_id,
        entity_name,
        functional_currency,
        entity_classification,
        tax_jurisdiction,
        federal_ein,
        incorporation_date,
        state_of_incorporation,
        country_of_tax_residence,
        naics_code,
        business_activity_desc,
        product_service_desc,
        address,
        created_by,
        created_at,
        updated_at
      `,
      [clientSiteId, entityName, functionalCurrency, entityClassification, taxJurisdiction, federalEin, oid]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({ entity: insertResult.rows[0] }));
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}

    context.log.error("reporting_create_entity failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create an entity for this client site.", 403));
    }

    if (err && err.code === "23503" && err.constraint === "reporting_entities_client_site_id_fkey") {
      return send(context, 404, errorBody("NOT_FOUND", "Client site not found.", 404));
    }

    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Request violates a database CHECK constraint.", 400));
    }

    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Unexpected error.", 500));
  } finally {
    client.release();
  }
};
```

## §SM-FJ — Primary Reference function.json (deployed `reporting_create_entity.function.json.md`, blob `25400b61`, full verbatim)
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "reporting_create_entity"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §SAS — SAS technique reference (deployed `axis/api/pm/artifacts-upload-url/index.js`, blob `ea7e21ad`, full verbatim)
```js
const crypto = require("crypto");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, x-ms-client-principal"
};

function getOidFromEasyAuth(req) {
  const header = req.headers["x-ms-client-principal"];
  if (!header) return null;

  try {
    const decoded = Buffer.from(header, "base64").toString("utf8");
    const principal = JSON.parse(decoded);
    const claims = principal.claims || [];
    const oidClaim =
      claims.find((c) => c.typ === "http://schemas.microsoft.com/identity/claims/objectidentifier") ||
      claims.find((c) => c.typ === "oid");
    return oidClaim ? oidClaim.val : null;
  } catch {
    return null;
  }
}

function send(context, status, body, extraHeaders = {}) {
  context.res = {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...extraHeaders },
    body
  };
}

function errorBody(code, message, field = null, details = {}) {
  return { error: { code, message, field, details } };
}

function badRequest(context, message, field = null, details = {}) {
  return send(context, 400, errorBody("VALIDATION_ERROR", message, field, details));
}

function unauthorized(context) {
  return send(context, 401, errorBody("UNAUTHORIZED", "No EasyAuth principal / oid.", null, {}));
}

function methodNotAllowed(context) {
  context.res = { status: 405, headers: corsHeaders };
}

function cleanStr(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function isUuidLike(s) {
  return (
    typeof s === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)
  );
}

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
        headers: options.headers || {}
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
            body: data
          });
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

  const r = await requestUrl(tokenUrl, {
    method: "GET",
    headers: { "X-IDENTITY-HEADER": identityHeader }
  });

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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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
    `<KeyInfo>` +
    `<Start>${xmlEscape(startTime)}</Start>` +
    `<Expiry>${xmlEscape(expiryTime)}</Expiry>` +
    `</KeyInfo>`;

  const r = await requestUrl(
    url,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-ms-version": "2022-11-02",
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(body, "utf8")
      }
    },
    body
  );

  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Get User Delegation Key failed (${r.statusCode}): ${r.body}`);
  }

  const signedOid = decodeXmlTag(r.body, "SignedOid");
  const signedTid = decodeXmlTag(r.body, "SignedTid");
  const signedStart = decodeXmlTag(r.body, "SignedStart");
  const signedExpiry = decodeXmlTag(r.body, "SignedExpiry");
  const signedService = decodeXmlTag(r.body, "SignedService");
  const signedVersion = decodeXmlTag(r.body, "SignedVersion");
  const value = decodeXmlTag(r.body, "Value");

  if (!signedOid || !signedTid || !signedStart || !signedExpiry || !signedService || !signedVersion || !value) {
    throw new Error("Get User Delegation Key response was missing required fields.");
  }

  return {
    signedOid,
    signedTid,
    signedStart,
    signedExpiry,
    signedService,
    signedVersion,
    value
  };
}

function computeUserDelegationSignature(params, userDelegationKey) {
  const stringToSign =
    `${params.sp}\n` +
    `${params.st}\n` +
    `${params.se}\n` +
    `${params.canonicalizedResource}\n` +
    `${userDelegationKey.signedOid}\n` +
    `${userDelegationKey.signedTid}\n` +
    `${userDelegationKey.signedStart}\n` +
    `${userDelegationKey.signedExpiry}\n` +
    `${userDelegationKey.signedService}\n` +
    `${userDelegationKey.signedVersion}\n` +
    `\n` +
    `\n` +
    `\n` +
    `\n` +
    `${params.spr}\n` +
    `${params.sv}\n` +
    `${params.sr}\n` +
    `\n` +
    `\n` +
    `\n` +
    `\n` +
    `\n` +
    `${params.rsct || ""}`;

  const key = Buffer.from(userDelegationKey.value, "base64");
  return crypto.createHmac("sha256", key).update(stringToSign, "utf8").digest("base64");
}

function cleanFileName(name) {
  const raw = cleanStr(name);
  if (!raw) return null;

  const cleaned = raw
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length ? cleaned.slice(0, 180) : null;
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
    {
      sp: permissions,
      st,
      se,
      canonicalizedResource,
      spr,
      sv,
      sr,
      rsct: mimeType || ""
    },
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

  return {
    sas: qp.toString(),
    expiresAt: se
  };
}

const allowedEntityType = ["client", "engagement", "workstream", "task"];
const STORAGE_ACCOUNT = process.env.ARTIFACT_BLOB_ACCOUNT || "vaultaxisartifacts";
const STORAGE_CONTAINER = process.env.ARTIFACT_BLOB_CONTAINER || "artifacts";

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    context.res = { status: 200, headers: corsHeaders, body: null };
    return;
  }

  const oid = getOidFromEasyAuth(req);
  if (!oid) return unauthorized(context);

  try {
    if (req.method !== "POST") {
      return methodNotAllowed(context);
    }

    const body = req.body || {};

    const entityType = cleanStr(body.entityType);
    const entityId = cleanStr(body.entityId);
    const domainId = cleanStr(body.domainId);
    const fileName = cleanFileName(body.fileName);
    const mimeType = cleanStr(body.mimeType);
    const sizeBytesRaw = body.sizeBytes;

    if (!entityType) return badRequest(context, "Missing entityType.", "entityType");
    if (!allowedEntityType.includes(entityType)) {
      return badRequest(context, "Invalid entityType.", "entityType", { allowed: allowedEntityType });
    }
    if (!entityId || !isUuidLike(entityId)) {
      return badRequest(context, "Missing or invalid entityId.", "entityId");
    }
    if (!domainId || !isUuidLike(domainId)) {
      return badRequest(context, "Missing or invalid domainId.", "domainId");
    }
    if (!fileName) return badRequest(context, "Missing or invalid fileName.", "fileName");
    if (!mimeType) return badRequest(context, "Missing or invalid mimeType.", "mimeType");

    const sizeBytes = Number(sizeBytesRaw);
    if (!Number.isFinite(sizeBytes) || sizeBytes < 0) {
      return badRequest(context, "Missing or invalid sizeBytes.", "sizeBytes");
    }

    const uniquePart = crypto.randomUUID();
    const blobKey = `${domainId}/${entityType}/${entityId}/${uniquePart}--${fileName}`;

    const { sas, expiresAt } = await buildUserDelegationSas(
      STORAGE_ACCOUNT,
      STORAGE_CONTAINER,
      blobKey,
      "cw",
      15,
      mimeType
    );

    const encodedBlobPath = encodeBlobPath(blobKey);
    const blobUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodedBlobPath}`;
    const uploadUrl = `${blobUrl}?${sas}`;

    return send(context, 200, {
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
          "Content-Type": mimeType
        },
        expiresAt
      }
    });
  } catch (err) {
    context.log.error(err);
    return send(
      context,
      500,
      errorBody("INTERNAL_ERROR", err && err.message ? err.message : String(err), null, {})
    );
  }
};
```

## §H1 — `theo_create_attachment_upload/index.js` (complete; issues the owner-scoped write SAS)
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
  const stringToSign =
    `${params.sp}\n` +
    `${params.st}\n` +
    `${params.se}\n` +
    `${params.canonicalizedResource}\n` +
    `${userDelegationKey.signedOid}\n` +
    `${userDelegationKey.signedTid}\n` +
    `${userDelegationKey.signedStart}\n` +
    `${userDelegationKey.signedExpiry}\n` +
    `${userDelegationKey.signedService}\n` +
    `${userDelegationKey.signedVersion}\n` +
    `\n\n\n\n` +
    `${params.spr}\n` +
    `${params.sv}\n` +
    `${params.sr}\n` +
    `\n\n\n\n\n` +
    `${params.rsct || ""}`;
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

## §FJ1 — `theo_create_attachment_upload/function.json`
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

## §H2 — `theo_finalize_attachment/index.js` (complete; reads actual size, enforces caps, inserts the owner-scoped row)
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

## §FJ2 — `theo_finalize_attachment/function.json`
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

## §H3 — `theo_delete_attachment/index.js` (complete; owner-scoped delete + best-effort blob reclaim)
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

// ---- Managed-identity data-plane Blob delete (mirrors the deployed axis MI technique).
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

// Best-effort blob delete AFTER the row is removed. The DB row is the source of truth;
// a residual blob (if this fails) is a harmless orphan that a future sweeper can reclaim.
async function deleteBlobBestEffort(context, accountName, containerName, blobKey) {
  try {
    const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
    const url = `https://${accountName}.blob.core.windows.net/${containerName}/${encodeBlobPath(blobKey)}`;
    await requestUrl(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" },
    });
  } catch (e) {
    context.log.warn("theo_delete_attachment: best-effort blob cleanup failed", e);
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

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!isUuid(id)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'id' is required and must be a valid UUID.", 400));
  }

  let client = null;
  let removed = null;
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

    // Explicit owner-scoped delete; RETURNING the blob pointer so we can clean it up after commit.
    const deleted = await client.query(
      `DELETE FROM public.theo_attachments WHERE id = $1 AND created_by = $2 RETURNING id, blob_container, blob_path`,
      [id, oid]
    );

    if (deleted.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_attachment_exists_unscoped($1::uuid) AS e`,
        [id]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this attachment.", 403)
        : buildKnownError("NOT_FOUND", "Attachment not found.", 404);
    }

    await client.query("COMMIT");
    removed = deleted.rows[0];
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_delete_attachment failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this attachment.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }

  // Row committed-deleted; reclaim the blob (best-effort, orphan-safe).
  if (removed && removed.blob_path) {
    await deleteBlobBestEffort(context, STORAGE_ACCOUNT, removed.blob_container || "theo-content", removed.blob_path);
  }

  return send(context, 200, successBody({ deleted: true, id: removed.id }));
};
```

## §FJ3 — `theo_delete_attachment/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_delete_attachment"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §INFRA — SAS prerequisite (G-2; Walter confirms before deploy)
- **Managed identity role:** the Theo Function App's system-assigned managed identity → **Storage Blob Data Contributor** on storage account `vaultgptstorage01` (scope: the account, or at least the `theo-content` container). Required for both the user-delegation-key call and the HEAD/DELETE data-plane calls.
- **Blob CORS** on `vaultgptstorage01`: allow `PUT, HEAD, OPTIONS` from the Origin/Theo SWA origin(s), allowed headers `x-ms-blob-type, Content-Type`, a sane max-age. (The browser PUTs the bytes directly to Blob using the returned SAS URL.)
- **App settings:** none required (defaults `THEO_BLOB_ACCOUNT=vaultgptstorage01`, `THEO_BLOB_CONTAINER=theo-content` are baked in; override only if the account/container differs). `IDENTITY_ENDPOINT`/`IDENTITY_HEADER` are injected automatically when MI is enabled.

## §GOLDEN — golden-curl round-trip (Claude Code runs post-deploy; token via `az`, never printed)
1. **create** → `POST /api/theo_create_attachment_upload` `{ "filename": "b8b_probe.pdf", "content_type": "application/pdf" }` → expect **201** with `data.attachmentId` + `data.upload.uploadUrl` (+ `ingestionClass:"native"`, `maxBytes:10485760`). Capture both.
2. **PUT to Blob** → `PUT <uploadUrl>` with headers `x-ms-blob-type: BlockBlob`, `Content-Type: application/pdf`, body = a small valid test PDF → expect **201** (Created) from Blob.
3. **finalize** → `POST /api/theo_finalize_attachment` `{ "attachment_id": "<attachmentId>", "filename": "b8b_probe.pdf", "content_type": "application/pdf" }` → expect **201** with `data.attachment.byte_size` = the actual uploaded length, `blob_path = attachments/<oid>/<attachmentId>`.
4. **RO verify** (`.local\run-reporting-ro-query.ps1`, SELECT-only): confirm exactly one `theo_attachments` row for the probe id, `created_by` = the caller OID.
5. **negatives:** finalize a random unused `attachment_id` → **404**; create with `content_type:"application/x-msdownload"` → **400 UNSUPPORTED_MEDIA_TYPE**; (size cap) PUT a >10 MB body for a native type then finalize → **400 PAYLOAD_TOO_LARGE** (+ blob auto-deleted).
6. **delete** → `POST /api/theo_delete_attachment` `{ "id": "<attachmentId>" }` → expect **200** `data.deleted:true`; re-finalize/HEAD confirms the blob + row are gone; deleting a non-owned id → **403/404**.
All captured under `.local/` (no token bytes).

## §DEPLOY — Walter deploy steps
1. Confirm **G-2** infra (MI Storage Blob Data Contributor on `vaultgptstorage01` + Blob CORS for the SWA origin).
2. Create three Functions (routes `theo_create_attachment_upload`, `theo_finalize_attachment`, `theo_delete_attachment`); paste each `index.js` (§H1–§H3) + `function.json` (§FJ1–§FJ3).
3. Reply "B8b deployed" → Claude Code runs the §GOLDEN round-trip + RO verify, captures evidence, then prepares the API-Spec/registry Role-C (G-3) and begins B8c (extraction).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B8b Attachment Upload Handlers Pass-1 Backend VEP (plan only).*
