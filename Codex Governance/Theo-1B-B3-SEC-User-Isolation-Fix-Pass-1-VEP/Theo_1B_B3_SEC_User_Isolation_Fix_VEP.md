# Theo 1B — B3 SECURITY FIX: per-user chat isolation (explicit `created_by` scoping) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete full-replacement handlers provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **SECURITY FIX (live cross-user data leak).** A signed-in user currently sees **other users' conversations** in Recents and can read/append to them. Root cause (verified against the live catalog): the shared Functions app connects to Postgres as **`pgadmin_vault`**, which has **`rolbypassrls = t`** — so the ownership RLS on `theo_*` is **silently skipped**, and the three deployed B3/B3b handlers rely on RLS alone (no explicit `created_by` predicate). Fix: add explicit `created_by = <signed-in OID>` scoping to **every** query in `theo_list_conversations`, `theo_get_conversation`, and `theo_message` — exactly how the deployed `reporting_*` handlers stay isolated (they always filter explicitly). Robust regardless of the connection role; no DB/grant/connection change required; reporting untouched.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend security fix)
Turn issued against HEAD: `bacdd14f27f99c28691a7adda279556a8645d14b` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference handler (Golden §2) = the deployed `reporting_list_entities` (explicit-ownership-filter read pattern; inlined verbatim §SM). Root cause evidenced by live read-only catalog probes (§DIAG): `pg_roles.rolbypassrls`, `auth.uid()` prosrc, `pg_auth_members`, `role_table_grants`. The three handlers being fixed are byte-identical to the currently-deployed code (confirmed against the Azure portal Code+Test view this session). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §5 SM) | `Grep("selects \*\*exactly one\*\* deployed handler file")` this turn | `2ee83c036e21a5dabe3405b6532c3471c680da0b` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B3) | `sed §7 Tier B3` this turn | `d3d02ccfaf9f244c60e71438972397e994b08330` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 persist/list/get) | `Read(offset=1, limit=55)` this turn | `010133b146b5fa8c5ed1820f6b25b40f6bb1656b` |
| 9 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 tables; §2 RLS) | `Grep("Four separate policies per table")` this turn | `2c9d013b9bbff00c8023a8a19497bbab5f97a4f7` |
| 10 | **Primary Reference handler** (explicit-ownership read pattern) — `../corporate-reporting/reference-artifacts/handlers/reporting_list_entities.index.js.md` | `Read(full)` + `Grep("WHERE client_site_id")` this turn | blob `7fd1568e2563e05bc2d95c4cece966f6377105ca` (corporate-reporting `38da0d6a722de6042ece0a6c5979b13dff7da736`) |
| 11 | Deployed `theo_message` (B3a; fix target) — `api/theo_message/index.js` | `Read(full)` this turn (+ portal Code+Test parity check) | `549f9a57f8c05ed99b2ce5ac1e586e28109d1deb` |
| 12 | Deployed `theo_list_conversations` (B3b; fix target) — `Codex Governance/Theo-1B-B3b-Conversation-Read-Handlers-Pass-1-VEP/theo_list_conversations.index.js` | `Read(full)` this turn (+ portal parity check) | `4d309eaf4d66cf091f82a29144c6f56c02fb276a` |
| 13 | Deployed `theo_get_conversation` (B3b; fix target) — `Codex Governance/Theo-1B-B3b-Conversation-Read-Handlers-Pass-1-VEP/theo_get_conversation.index.js` | `Read(full)` this turn (+ portal parity check) | `c292ff18e9c06bc9c10e6b53266aa4a82b90161d` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| ../corporate-reporting/reference-artifacts/handlers/reporting_list_entities.index.js.md | read pattern | "WHERE client_site_id = $1" | §SM / §FIX — explicit-ownership filter is the proven Reporting pattern this fix mirrors |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `reporting_list_entities` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §FIX — every theo query scoped to `created_by = $oid` |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §2 | "Four separate policies per table" | §DIAG — RLS is correct but bypassed by the connection role |

---

## P1 — Feature identification
**Microstep:** a security fix to the deployed Theo Phase 1B **Tier B3 / B3b** handlers (Rule Anchor on Backend Plan Tier B3). Three deployed handlers — `theo_message` (B3a; persist/append), `theo_list_conversations` (B3b; Recents), `theo_get_conversation` (B3b; reload) — currently return/accept rows across **all** users because they depend solely on RLS, which the shared connection role bypasses. The fix scopes every query to the signed-in `created_by` OID. No surface/contract change (response shapes unchanged); the only behavioural change is that a user now sees and touches **only their own** conversations + messages.

## P2 — Architecture & boundary reconciliation
- **Root cause (verified, §DIAG).** App connects as `pgadmin_vault` (`rolbypassrls = t`) → ownership RLS on `theo_*` is skipped for the app connection. Policies + `auth.uid()` are correct, but a no-`WHERE`-filter query returns every user's rows.
- **Fix pattern (Family-B, mirrors Reporting).** The deployed `reporting_*` handlers never rely on RLS alone — they always filter explicitly (`WHERE client_site_id = $1`, etc.). This fix applies the same discipline: explicit `created_by = $oid` on every `theo_*` SELECT/UPDATE and the append-ownership check. `set_config(...)` is retained (establishes request identity; harmless and forward-compatible if the connection role is later made RLS-subject).
- **Boundary.** Touches only the three theo handlers; **no `reporting_*` access**, no schema/DDL change, no connection/grant change, no contract/response-shape change. The `theo_conversation_exists_unscoped` 403/404 discrimination is preserved.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** Three deployed handlers are replaced in place on the shared `vaultgpt-func-premium` app. No new function, no env var, no dependency. | **PRE-LAND** — enumerated in §DEPLOY; Claude Code golden curls confirm (incl. the cross-user check). |
| G-2 | **Systemic DB hardening (future, Walter's domain).** The robust long-term posture is least-privilege: a non-bypass app role with explicit `GRANT`s + `FORCE ROW LEVEL SECURITY`, so RLS is a second enforcement layer. Today this is blocked — `pgadmin_vault ∉ authenticated` (FORCE would deny-all) and `vaultgpt_app` has **no grants** on `theo_*` (switching the role would 42501); both also affect the shared reporting app. | **PROCEED** — future-trigger note. This handler-side fix fully closes the leak independent of the DB posture; the DB hardening is a separate, carefully-scoped effort and is NOT required for this fix. |
| G-3 | **B7 memory (option C) inherits this requirement.** The planned `theo_user_memory` + history-RAG must also explicit-filter `created_by`. | **PROCEED** — future-trigger; recorded for the B7 microstep. |

No write SQL in this pack (plan only); the fix is handler code Walter deploys. No `reporting_*` change.

## P3 — Backend / contract grounding
Contracts unchanged (API Spec §2.1 persist/list/get rows). Response envelopes, status codes, and the `_exists_unscoped` 403/404 split are identical to the deployed handlers. The only change is the addition of `created_by = $oid` predicates (and one parameter-position shift in `theo_list_conversations`: `LIMIT $1` → `WHERE created_by = $1 … LIMIT $2`).

## P4 — Per-query fix (exact changes)
- **`theo_list_conversations`** — list SELECT: add `WHERE created_by = $1`, shift `LIMIT $1`→`LIMIT $2`; params `[oid, limit]`. (§FIX.1)
- **`theo_get_conversation`** — conversation SELECT: `WHERE id = $1` → `WHERE id = $1 AND created_by = $2` (params `[conversationId, oid]`); messages SELECT: `WHERE conversation_id = $1` → `… AND created_by = $2` (params `[conversationId, oid]`). 403/404 helper path unchanged. (§FIX.2)
- **`theo_message`** — append-ownership check: `WHERE id = $1` → `WHERE id = $1 AND created_by = $2`; seq count + final `UPDATE`: add `AND created_by = $2`; the connection comment corrected to state isolation is enforced by explicit predicates (the connection role bypasses RLS). INSERTs already set `created_by = oid`. (§FIX.3)

## P5 — Component reference grounding
Primary Reference (Golden §2) = the deployed `reporting_list_entities` — the canonical Family-B read handler whose isolation comes from an explicit ownership `WHERE` filter (not RLS). Inlined byte-identical in §SM. The three fixed handlers are full replacements of the deployed code with only the per-query scoping changes of §P4.

## P6 — Repository & active-surface grounding
Fix targets, ACTIVE @ vault-theo `bacdd14f`: `api/theo_message/index.js` (blob `549f9a57`), and the two B3b deploy files (`theo_list_conversations.index.js` `4d309eaf`, `theo_get_conversation.index.js` `c292ff18`) — all byte-identical to the live Azure code (portal Code+Test parity-checked this session). Guardrails: no browser storage (backend); no `reporting_*` change; no schema/DDL/grant/connection change; response contracts unchanged. Each replacement handler passes `node --check`.

## P7 — Risk / regression
- **No contract regression:** response shapes/status codes unchanged; existing single-user flows behave identically (a user still sees and appends to their own threads).
- **Behavioural change (the fix):** cross-user rows no longer returned/appendable.
- **`set_config` retained:** keeps the handlers correct if the DB posture is later hardened (G-2); harmless under the current bypass role.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1 PRE-LAND deploy; G-2/G-3 PROCEED future-triggers); Primary Reference inlined byte-identical (§SM); three full-replacement handlers inlined (§FIX.1–§FIX.3), each `node --check` clean. No implementation begun beyond authoring (plan-only). On Codex APPROVAL, Walter replaces the three handlers; Claude Code runs the §CURL golden curls including the cross-user isolation check.

---

## §SM — Primary Reference (deployed `reporting_list_entities`, byte-identical; explicit-ownership read pattern)
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

const CLIENT_SITE_ID_MIN_LEN = 1;
const CLIENT_SITE_ID_MAX_LEN = 200;

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

  const clientSiteId = req.query && typeof req.query.clientSiteId === "string" ? req.query.clientSiteId.trim() : "";
  if (clientSiteId.length < CLIENT_SITE_ID_MIN_LEN || clientSiteId.length > CLIENT_SITE_ID_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'clientSiteId' is required and must be a non-empty string of length 1..200.", 400));
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
      return send(context, 404, errorBody("NOT_FOUND", "Client site not found.", 404));
    }

    const entitiesResult = await client.query(
      `
      SELECT
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
      FROM public.reporting_entities
      WHERE client_site_id = $1
      ORDER BY entity_name ASC, id ASC
      `,
      [clientSiteId]
    );

    return send(context, 200, successBody({ entities: entitiesResult.rows }));
  } catch (err) {
    context.log.error("reporting_list_entities failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list entities for this client site.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

---

## §DIAG — Root-cause evidence (live read-only catalog probes this session)
```
-- role attributes
 vaultgpt_app        rolsuper=f  rolbypassrls=f   (member of: authenticated, anon, service_role)
 pgadmin_vault       rolsuper=f  rolbypassrls=t   (member of: azure_pg_admin, pg_read_all_*)   <-- app connects as this
 codex_reporting_ro  rolsuper=f  rolbypassrls=f   (member of: authenticated)

-- theo_* tables: owner=pgadmin_vault, relrowsecurity=t, relforcerowsecurity=f
-- theo_conversations policies: SELECT/INSERT/UPDATE/DELETE TO authenticated, created_by = auth.uid()
-- auth.uid()  =>  SELECT current_setting('app.current_user_id', true)
-- vaultgpt_app direct grants on theo_conversations: NONE (0 rows)
-- Function App POSTGRES_USER = pgadmin_vault@vaultgpt-postgres-prod
```
**Conclusion:** policies + `auth.uid()` are correct, but the app connects as `pgadmin_vault` (`rolbypassrls=t`), so RLS is skipped and RLS-only queries leak across users. Neither `FORCE ROW LEVEL SECURITY` (pgadmin_vault ∉ authenticated → deny-all) nor switching to `vaultgpt_app` (no grants → 42501) is a safe stand-alone DB fix; the handler-side explicit filter is the correct, low-risk remedy and matches the Reporting pattern (§SM).

---

## §FIX.1 — `theo_list_conversations/index.js` (full replacement)
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

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

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

  let limit = DEFAULT_LIMIT;
  if (req.query && typeof req.query.limit === "string" && req.query.limit.trim() !== "") {
    const raw = req.query.limit.trim();
    const n = /^[0-9]+$/.test(raw) ? parseInt(raw, 10) : NaN;
    if (!Number.isInteger(n) || n < 1 || n > MAX_LIMIT) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'limit', when supplied, must be an integer 1..200.", 400));
    }
    limit = n;
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

    // Explicit ownership scope: the shared Functions connection role bypasses RLS, so per-user
    // isolation MUST be enforced in the query itself (created_by = the signed-in OID), not by RLS.
    const result = await client.query(
      `
      SELECT
        id,
        title,
        model,
        project_id,
        app_key,
        created_at,
        updated_at
      FROM public.theo_conversations
      WHERE created_by = $1
      ORDER BY updated_at DESC, id DESC
      LIMIT $2
      `,
      [oid, limit]
    );

    return send(context, 200, successBody({ conversations: result.rows }));
  } catch (err) {
    context.log.error("theo_list_conversations failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list conversations.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

## §FIX.2 — `theo_get_conversation/index.js` (full replacement)
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

    // Explicit ownership scope: the shared Functions connection role bypasses RLS, so the
    // by-id read MUST also filter created_by = the signed-in OID. A non-owned id yields 0 rows
    // here and is then discriminated 403 (exists, not owned) vs 404 (absent) via the helper.
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
      WHERE conversation_id = $1 AND created_by = $2
      ORDER BY seq ASC, created_at ASC
      `,
      [conversationId, oid]
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

## §FIX.3 — `theo_message/index.js` (full replacement)
```js
const https = require("https");
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

    const req = https.request(
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
  const lastUser = [...messages]
    .reverse()
    .find((m) => m && m.role === "user" && typeof m.content === "string");
  const userText = lastUser ? lastUser.content : "";

  if (requestedConversationId !== null && !isUuid(requestedConversationId)) {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Field 'conversation_id' must be a valid UUID.", 400)
    );
  }

  let client = null;
  try {
    const token = await getFoundryToken();

    const upstreamPayload = JSON.stringify({
      model: FOUNDRY_DEPLOYMENT,
      max_tokens: maxTokens,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages,
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

---

## §DEPLOY — Walter deploy steps (replace three handlers in place; no migration, no env, no dependency)
1. Replace `theo_list_conversations` `index.js` with §FIX.1.
2. Replace `theo_get_conversation` `index.js` with §FIX.2.
3. Replace `theo_message` `index.js` with §FIX.3.
4. Reply "SEC fix deployed" → Claude Code runs the §CURL golden curls.

## §CURL — verification plan (token via `az`; never printed; captured under `.local/`)
1. **List (self)** — `GET /api/theo_list_conversations` → 200; `conversations[]` contains **only the caller's own** threads (the B3a `00419de2-…` thread present; the colleague's thread **absent**).
2. **Cross-user isolation (the leak check)** — using a **second** user's token (or a conversationId known to belong to another user): `GET /api/theo_get_conversation?conversationId=<other-user-id>` → **404** (absent to this user) — never 200 with another user's transcript. `GET /api/theo_list_conversations` for user B returns only user B's threads.
3. **Append-isolation** — `POST /api/theo_message` with a `conversation_id` owned by **another** user → **404/403** (cannot append to a foreign thread); a self-owned id → 200 appends.
4. **Self happy-path unchanged** — new conversation → 200 + `conversation_id`; reload self thread → 200 with ordered messages + citations.
5. **Validation unchanged** — malformed `conversationId` → 400; `?limit=0`/`1.5` → 400.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B3 Security Fix (per-user isolation) Pass-1 Backend VEP (plan only).*
