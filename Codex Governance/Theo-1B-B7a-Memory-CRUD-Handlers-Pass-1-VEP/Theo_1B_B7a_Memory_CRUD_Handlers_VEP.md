# Theo 1B — B7a Memory CRUD Handlers (`theo_*_user_memory`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handlers provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier **B7a (handlers)** — four GREENFIELD handlers over the deployed `theo_user_memory` table (option C): `theo_list_user_memory` (read), `theo_create_user_memory`, `theo_update_user_memory`, `theo_delete_user_memory`. These back the Claude-style **view/edit/delete** memory controls. **Every query is explicitly scoped `created_by = $oid`** — the shared Functions connection role bypasses RLS, so isolation is enforced in the query (per the deployed SEC user-isolation fix), with RLS the second layer. Family-B pattern; mutations `connect→BEGIN→set_config→…→COMMIT` / `catch ROLLBACK + 42501→403/23503→404/23514→400`; read is the same minus `BEGIN/COMMIT`. **Ungated** (user-managed CRUD; no model/index traffic — distinct from the still-gated distillation engine + B7b history-RAG).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `d010a33fea0cb3f9ca33299ec8f8f0cb00e5298c` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference handler (Golden §2) = the deployed `reporting_create_entity` (pg mutation pattern: BEGIN/set_config/INSERT RETURNING/COMMIT + 42501/23503/23514 mapping; inlined verbatim §SM). The read handler (`theo_list_user_memory`) follows the established deployed read pattern (`reporting_list_entities` / `theo_list_conversations`); ownership 403/404 via the deployed `theo_user_memory_exists_unscoped` helper (B7a schema). Contract basis = the deployed `theo_user_memory` table (Schema doc §3/§6, DEPLOYED + RO-verified) + Backend Plan Tier B7; API Spec §2.x Memory row + Golden-Handler update follow post-deploy (§GR G-2), mirroring B3b. Validation precedes SQL (deterministic 400s) per the established input-validation discipline. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §5 SM) | `Grep("selects \*\*exactly one\*\* deployed handler file")` this turn | `2ee83c036e21a5dabe3405b6532c3471c680da0b` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B7; D-7 RESOLVED) | `Grep("Distilled memory profile")` this turn | `f433158a9ef37789ae3a7133906d3c08c31c1783` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 row + §6 `theo_user_memory` DEPLOYED) | `Grep("theo_user_memory")` this turn | `95538419e01ff95d20342e6b65d97c332912c614` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2 boundary; Memory row follows post-deploy) | `Read(offset=1, limit=55)` this turn | `010133b146b5fa8c5ed1820f6b25b40f6bb1656b` |
| 10 | **Primary Reference handler** (pg mutation pattern) — `../corporate-reporting/reference-artifacts/handlers/reporting_create_entity.index.js.md` | `Read(full)` + `Grep("BEGIN|RETURNING|23503")` this turn | blob `c2f02bf0f6c5be50900a9fbb7a015529e649ad25` (corporate-reporting `38da0d6a722de6042ece0a6c5979b13dff7da736`) |
| 11 | Deployed `theo_user_memory` schema source — `Codex Governance/Theo-1B-B7a-Memory-Substrate-Schema-Pass-1-VEP/b7a_migration.sql` | `Read(full)` this turn | `bbb66f45d5b598bf104499f32b3812af41c64e26` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B7 | "Distilled memory profile" | §P1 — B7a memory CRUD handlers backing view/edit/delete |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `reporting_create_entity` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §HG.1–§HG.4 — every query scoped `created_by = $oid` |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §6 | "theo_user_memory" | §HG.1–§HG.4 — handlers operate over the deployed B7a table |

---

## P1 — Feature identification
**Microstep:** Theo Phase 1B **Tier B7a (handlers)** — the memory CRUD set over the deployed `theo_user_memory` table (Rule Anchor on Plan Tier B7). Four handlers back the Claude-style memory controls: **list** (the user's memory items, scope/project filters), **create**, **update** (content/kind/salience), **delete** (permanent, per D-7). User-managed CRUD only — the automatic distillation engine, system-prompt injection, and B7b history-RAG are separate, later microsteps (the distillation/RAG parts touch model/index traffic; this set does not).

## P2 — Architecture & boundary reconciliation
- **Family-B.** `pg` Pool over `POSTGRES_CONNECTION_STRING`; per-request `set_config(oid)`; mutations `connect→BEGIN→…→COMMIT` with `catch ROLLBACK`; read is the same minus `BEGIN/COMMIT`. Identical helper block to the deployed theo handlers.
- **Explicit ownership (SEC-fix discipline).** Every SELECT/UPDATE/DELETE carries `created_by = $oid`; the shared connection role bypasses RLS, so the predicate — not RLS — enforces per-user isolation. Update/delete on a non-owned id → 0 rows → `theo_user_memory_exists_unscoped` → 403/404.
- **Validation before SQL.** `isUuid` on `id`/`project_id`/`source_conversation_id`; `scope ∈ {user,project}`; non-empty `content`; the scope⟺project_id invariant (mirrors the DB CHECK); integer `salience` — all deterministic 400s before any query.
- **Boundary.** Reads/writes only `theo_user_memory` (deployed B7a); **no `reporting_*` access**; FKs (`project_id`, `source_conversation_id`) reference deployed B2 tables; 23503→404, 23514→400 mapped defensively.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** Four new functions on the shared `vaultgpt-func-premium` app. `pg` + connection vars already present (B2/B3). | **PRE-LAND** — §DEPLOY; Claude Code golden curls confirm (incl. cross-user isolation). |
| G-2 | **Authority-doc updates post-deploy.** API Spec gains a §2.x **Memory** row (the four endpoints); Golden Handler / schema doc already record `theo_user_memory`. | **PRE-LAND** — a short API-Spec Memory Role-C follows deploy (mirrors the B3b conversation-history Role-C), before any FE memory-controls VEP cites it (T22 prevention). |
| G-3 | **Distillation engine + system-prompt injection + B7b history-RAG.** The parts that read chat content into a model/index. | **PROCEED (future-trigger).** D-3 (ZDR) + D-7 (policy) are RESOLVED; B7b history-RAG still awaits the D-5 Azure AI Search resource. Separate microsteps; not in this pack. |

No write SQL in this pack (plan only). No `reporting_*` change.

## P3 — Backend / contract grounding
Contract basis = the deployed `theo_user_memory` table (Schema doc §3/§6; columns `scope`/`project_id`/`kind`/`content`/`source_conversation_id`/`salience` + `id`/`created_by`/timestamps). Response envelope = the standard `{ data, meta }` / `{ error }` shape used by every theo handler. Endpoints (new): `GET /api/theo_list_user_memory` (`?scope`,`?projectId`); `POST /api/theo_create_user_memory`; `POST /api/theo_update_user_memory`; `POST /api/theo_delete_user_memory`. API Spec Memory row lands post-deploy (G-2).

## P4 — Per-handler contract
- **`theo_list_user_memory`** (GET): optional `?scope`(user|project)/`?projectId`(uuid) → 400 on invalid; `SELECT … WHERE created_by=$1 [AND scope][AND project_id] ORDER BY salience DESC, updated_at DESC, id DESC LIMIT 500` → `{ memory: [...] }`.
- **`theo_create_user_memory`** (POST): validates scope/content/project invariant/uuids/salience; `INSERT … (created_by, scope, project_id, kind, content, source_conversation_id, salience) RETURNING *` → **201** `{ memory }`; 23503→404, 23514→400.
- **`theo_update_user_memory`** (POST): `id` uuid + ≥1 of content/kind/salience; `UPDATE … SET … , updated_at=now() WHERE id=$ AND created_by=$ RETURNING *`; 0 rows → 403/404 via helper → **200** `{ memory }`.
- **`theo_delete_user_memory`** (POST): `id` uuid; `DELETE … WHERE id=$ AND created_by=$ RETURNING id`; 0 rows → 403/404 → **200** `{ deleted:true, id }` (permanent per D-7).

## P5 — Component reference grounding
Primary Reference (Golden §2) = deployed `reporting_create_entity` (pg mutation pattern), inlined byte-identical §SM. The four handlers reuse the deployed theo helper block verbatim and the B3b read/ownership idiom; only the `theo_user_memory`-specific columns/validation differ.

## P6 — Repository & active-surface grounding
New artifacts (this package): four `*.index.js` + four `*.function.json`. No existing source changed. Guardrails: no browser storage (backend); no `reporting_*`; explicit `created_by` on every query; `node --check` clean for all four handlers; function.json methods = GET (list) / POST (mutations), routes match handler names, authLevel anonymous (EasyAuth in front).

## P7 — Risk / regression
- **Greenfield:** four new functions; no change to deployed handlers/tables.
- **Isolation:** explicit `created_by` on every query (verified by the cross-user golden curl).
- **Permanent delete (D-7):** `theo_delete_user_memory` hard-deletes; ownership-checked first.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3 PROCEED future-trigger); Primary Reference inlined byte-identical (§SM); four full handlers (§HG.1–§HG.4) + four function.json (§FJ.1–§FJ.4) inlined, each `node --check` / JSON-valid. Plan-only. On Codex APPROVAL, Walter deploys the four functions; Claude Code golden-curls (create→list→update→delete→validation→cross-user isolation); then the API-Spec Memory Role-C (G-2).

---

## §SM — Primary Reference (deployed `reporting_create_entity`, byte-identical; pg mutation pattern)
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

---

## §HG.1 — `theo_list_user_memory/index.js` (full)
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

  // Optional filters. scope, when supplied, must be 'user' or 'project'; projectId must be a UUID.
  let scope = null;
  if (req.query && typeof req.query.scope === "string" && req.query.scope.trim() !== "") {
    scope = req.query.scope.trim();
    if (scope !== "user" && scope !== "project") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'scope', when supplied, must be 'user' or 'project'.", 400));
    }
  }
  let projectId = null;
  if (req.query && typeof req.query.projectId === "string" && req.query.projectId.trim() !== "") {
    projectId = req.query.projectId.trim();
    if (!isUuid(projectId)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'projectId', when supplied, must be a valid UUID.", 400));
    }
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

    // Explicit ownership scope: the shared connection role bypasses RLS, so isolation is enforced
    // by the created_by predicate (never RLS alone). Optional scope/project filters appended.
    const conditions = ["created_by = $1"];
    const params = [oid];
    if (scope !== null) {
      params.push(scope);
      conditions.push(`scope = $${params.length}`);
    }
    if (projectId !== null) {
      params.push(projectId);
      conditions.push(`project_id = $${params.length}`);
    }

    const result = await client.query(
      `
      SELECT
        id,
        scope,
        project_id,
        kind,
        content,
        source_conversation_id,
        salience,
        created_at,
        updated_at
      FROM public.theo_user_memory
      WHERE ${conditions.join(" AND ")}
      ORDER BY salience DESC, updated_at DESC, id DESC
      LIMIT 500
      `,
      params
    );

    return send(context, 200, successBody({ memory: result.rows }));
  } catch (err) {
    context.log.error("theo_list_user_memory failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list memory.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```
## §FJ.1 — `theo_list_user_memory/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_user_memory"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.2 — `theo_create_user_memory/index.js` (full)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const KIND_MAX_LEN = 64;
const CONTENT_MAX_LEN = 4000;

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

  // ---- Validate inputs before any SQL (deterministic 400s) ----
  const scope = typeof body.scope === "string" && body.scope.trim() !== "" ? body.scope.trim() : "user";
  if (scope !== "user" && scope !== "project") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'scope' must be 'user' or 'project'.", 400));
  }

  const projectId =
    body.project_id != null && typeof body.project_id === "string" && body.project_id.trim() !== ""
      ? body.project_id.trim()
      : null;
  if (projectId !== null && !isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id', when supplied, must be a valid UUID.", 400));
  }
  // Invariant (mirrors the DB CHECK): project scope iff project_id present.
  if ((scope === "project") !== (projectId !== null)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required when scope='project' and must be omitted otherwise.", 400));
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (content === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'content' is required and must be a non-empty string.", 400));
  }
  if (content.length > CONTENT_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'content' must be at most ${CONTENT_MAX_LEN} characters.`, 400));
  }

  let kind = "fact";
  if (body.kind != null) {
    if (typeof body.kind !== "string" || body.kind.trim() === "") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'kind', when supplied, must be a non-empty string.", 400));
    }
    kind = body.kind.trim().slice(0, KIND_MAX_LEN);
  }

  const sourceConversationId =
    body.source_conversation_id != null && typeof body.source_conversation_id === "string" && body.source_conversation_id.trim() !== ""
      ? body.source_conversation_id.trim()
      : null;
  if (sourceConversationId !== null && !isUuid(sourceConversationId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'source_conversation_id', when supplied, must be a valid UUID.", 400));
  }

  let salience = 0;
  if (body.salience != null) {
    if (!Number.isInteger(body.salience)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'salience', when supplied, must be an integer.", 400));
    }
    salience = body.salience;
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

    // created_by = the signed-in OID (explicit ownership; the connection role bypasses RLS).
    const inserted = await client.query(
      `
      INSERT INTO public.theo_user_memory
        (created_by, scope, project_id, kind, content, source_conversation_id, salience)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id, scope, project_id, kind, content, source_conversation_id, salience, created_at, updated_at
      `,
      [oid, scope, projectId, kind, content, sourceConversationId, salience]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({ memory: inserted.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_create_user_memory failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create memory.", 403));
    }
    // FK violation: project_id / source_conversation_id not owned or absent.
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Referenced project or conversation not found.", 404));
    }
    // CHECK violation (scope/project invariant or non-empty content), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Memory item violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```
## §FJ.2 — `theo_create_user_memory/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_create_user_memory"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.3 — `theo_update_user_memory/index.js` (full)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const KIND_MAX_LEN = 64;
const CONTENT_MAX_LEN = 4000;

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

  // Editable fields: content, kind, salience (scope/project_id are immutable identity of the item).
  // At least one updatable field must be present.
  const updates = [];
  const params = [];

  if (body.content != null) {
    if (typeof body.content !== "string" || body.content.trim() === "") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'content', when supplied, must be a non-empty string.", 400));
    }
    if (body.content.trim().length > CONTENT_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'content' must be at most ${CONTENT_MAX_LEN} characters.`, 400));
    }
    params.push(body.content.trim());
    updates.push(`content = $${params.length}`);
  }

  if (body.kind != null) {
    if (typeof body.kind !== "string" || body.kind.trim() === "") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'kind', when supplied, must be a non-empty string.", 400));
    }
    params.push(body.kind.trim().slice(0, KIND_MAX_LEN));
    updates.push(`kind = $${params.length}`);
  }

  if (body.salience != null) {
    if (!Number.isInteger(body.salience)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'salience', when supplied, must be an integer.", 400));
    }
    params.push(body.salience);
    updates.push(`salience = $${params.length}`);
  }

  if (updates.length === 0) {
    return send(context, 400, errorBody("INVALID_REQUEST", "At least one updatable field ('content', 'kind', or 'salience') is required.", 400));
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

    // Explicit ownership scope (connection role bypasses RLS): id AND created_by = the signed-in OID.
    params.push(id);
    const idParam = params.length;
    params.push(oid);
    const oidParam = params.length;

    const updated = await client.query(
      `
      UPDATE public.theo_user_memory
      SET ${updates.join(", ")}, updated_at = now()
      WHERE id = $${idParam} AND created_by = $${oidParam}
      RETURNING
        id, scope, project_id, kind, content, source_conversation_id, salience, created_at, updated_at
      `,
      params
    );

    if (updated.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_user_memory_exists_unscoped($1::uuid) AS e`,
        [id]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this memory item.", 403)
        : buildKnownError("NOT_FOUND", "Memory item not found.", 404);
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ memory: updated.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_update_user_memory failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this memory item.", 403));
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
};
```
## §FJ.3 — `theo_update_user_memory/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_update_user_memory"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.4 — `theo_delete_user_memory/index.js` (full)
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

    // Explicit ownership scope (connection role bypasses RLS): delete is permanent (D-7).
    const deleted = await client.query(
      `DELETE FROM public.theo_user_memory WHERE id = $1 AND created_by = $2 RETURNING id`,
      [id, oid]
    );

    if (deleted.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_user_memory_exists_unscoped($1::uuid) AS e`,
        [id]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this memory item.", 403)
        : buildKnownError("NOT_FOUND", "Memory item not found.", 404);
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ deleted: true, id: deleted.rows[0].id }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_delete_user_memory failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this memory item.", 403));
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
};
```
## §FJ.4 — `theo_delete_user_memory/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_delete_user_memory"
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

## §DEPLOY — Walter deploy steps (four new functions; no migration, no env, no dependency)
1. Create `theo_list_user_memory` (§HG.1 + §FJ.1).
2. Create `theo_create_user_memory` (§HG.2 + §FJ.2).
3. Create `theo_update_user_memory` (§HG.3 + §FJ.3).
4. Create `theo_delete_user_memory` (§HG.4 + §FJ.4).
5. Reply "B7a handlers deployed" → Claude Code runs §CURL.

## §CURL — verification plan (token via `az`; never printed; captured under `.local/`)
1. **Create** — `POST theo_create_user_memory {scope:"user", content:"prefers UK spelling"}` → **201** + `memory.id`.
2. **List (self)** — `GET theo_list_user_memory` → 200; includes the created item; **only the caller's own** rows.
3. **Update** — `POST theo_update_user_memory {id, salience:5}` → 200; `salience=5`, `updated_at` advanced.
4. **Delete** — `POST theo_delete_user_memory {id}` → 200 `{deleted:true}`; subsequent list omits it.
5. **Validation** — empty `content` → 400; `scope:"project"` without `project_id` → 400; bad `id` uuid → 400.
6. **Cross-user isolation** — update/delete a foreign-owned `id` → **404** (never another user's item); list returns only own.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B7a Memory CRUD Handlers Pass-1 Backend VEP (plan only).*
