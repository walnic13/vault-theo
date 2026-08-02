# Vault Orchestrated Access-Policy Engine (Stage-0 §7.4) — `theo_get_project_context_item` — Pass-1 VEP

Backend implementation VEP (Pass 1) for **Stage-0 §7.4** of the Codex-APPROVED access-policy engine design ([[Vault_Access_Policy_Engine_Stage0_Design.md]] §3.2/§3.3, §7 item 4) — the **capstone**. Delivers the **handler-layer orchestrated engine**: a read handler `theo_get_project_context_item` that composes the DEPLOYED `theo_can_read` (§7.3, DB dimensions) with the two app-layer gates Postgres cannot do — the **Rule-5 OBO Graph reachability probe** and the **firm-role lowest-participant filter over OTHER room participants** — strict-AND, fail-closed. It is the reference composition future read handlers adopt (Amendment 1: "no read path implements its own access logic"). **Handler-only — NO migration** (reuses the deployed §7.3 classifier + §7.2 `_exists_unscoped` helper). Claude-deployed to `vaultgpt-func-projects` (run-from-package). First §7.x to exercise `theo_can_read`'s positive path end-to-end.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Verified Evidence Pack (backend implementation package — handler, no migration)
Grounding parent (source baseline): `121559b984c6b00da3abcd4c7d1df3eca1e66cb9` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the Codex activation note; currency anchors below are tip-independent blob SHAs
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Stage-0 DESIGN (this VEP implements §3.2/§3.3 / §7 item 4) — `Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md` | Codex-APPROVED (`33f5655`); §3.2/§3.3 re-read this turn | `0e6779235c9b39935c4e63688f06a27ae92a8175` |
| 2 | GOVERNING VISION — `governance/VAULT_MEMORY_ARCHITECTURE.md` (§3 info-type floors; §7 Rule 3 lowest-participant + Rule 5 SharePoint substrate; §8 mixed-room) | `Read`(§3/§7/§8) this turn | `d17ddd0d97887b38e6db3297c56db9d6b3cfe9cf` |
| 3 | Backend Governor — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3 Never-Guess; §4 Schema Reality Lock; §8 VEP format + Gap Register) | `Grep("Never-Guess")` + `Grep("Schema Reality Lock")` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 4 | Grounding Conformance — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 5 | Golden Handler — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary reference; §4 allowed deltas / EXACT-mirror; §5.1 Structural Mirror Table; §5.3 Golden Curl; §5.5 run-from-package deploy) | `Grep("Structural Mirror Table")` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 6 | Execution Orchestration — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1D ordered pass; §1E Claude deploy to func-projects) | `Grep("ordered, non-skippable")` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 7 | CONTRACT TRUTH — `spec/THEO_API_SPEC.md` (§2 Contract Surface; §2.18 L1.5 write sibling; the §5 Role-C target) | `Grep("## §2 Contract Surface")` this turn | `758cf1e172d0e6abd86ee3aedf275a05aff9266c` |
| 8 | SCHEMA TRUTH — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§12 `theo_project_context_items` + `theo_project_context_item_exists_unscoped`; §13 `theo_can_read`) | `Read`(§12/§13) this turn | `6b213eb061ac39253d4038e2bee71ef407dadb7f` |
| 9 | **PRIMARY REFERENCE (DEPLOYED)** — `theo_list_project_knowledge` handler + function.json on `vaultgpt-func-projects` (pg + set_config + inline-access + `_exists_unscoped` 403/404 + `{data,meta}`) | `curl` Kudu VFS GET (live bytes) this turn; byte-identical copies in-package | index.js `3086312aabf1f74f80879e7c85e40d1a48b12d98`; function.json `ef3207b2373bf3313a4f77c641204cd1d4fbb7f8` |
| 10 | OBO-MIRROR SOURCE (DEPLOYED) — `theo_get_my_role.index.js` (§7.1; the OBO→Graph→`resolveFirmRole` block byte-faithfully mirrored) | `Read`(theo_get_my_role.index.js, full) this turn | `b6a85d64acf2fc5227bc16c626a032e42d832a40` |
| 11 | GRAPH-PROBE-MIRROR SOURCE (DEPLOYED, vault-dms) — `dms_resolve_item` `graphGetJson` metadata GET of `/drives/{driveId}/items/{itemId}` (2xx=allow, 401/403/404=deny) — the `graphReachable` idiom | subagent survey (paths + verbatim excerpt) this turn | vault-dms `b77ff37254bffda9c708761c26df877544aebd0a` |
| 12 | DEPLOYED FACT — `vaultgpt-func-projects` has pg (`PG*`) + OBO env (`AAD_*`=KV ref) + MI = Key Vault Secrets User; run-from-package `pkg-5a5270f`; `theo_can_read` + `theo_project_context_item_exists_unscoped` DEPLOYED (§7.2/§7.3) | catalog-verified this session; `az` app-settings names | live Azure + DB state (§3) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (head) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md | §3.2 | "no read path implements its own access logic" | §2 — the single composed decision |
| Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md | §3.3 | "internal helpers the engine calls" | §2 — theo_can_read + exists helper reused, not re-implemented |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §7 | "they can't see it through Theo either" | §2 — Rule-5 Graph reachability gate |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §3 | "partner + director + senior manager only" | §2/§6 — commercial floor (room firm-role dimension) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" | §3 — reuses only deployed functions/tables |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.1 | "Structural Mirror Table" | §5 — handler mirror table |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "deployed `function.json` file as the canonical Primary Reference" | §5 — primary reference = theo_list_project_knowledge index.js AND function.json (both inlined) |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1D | "ordered, non-skippable" | §9 — Codex → Claude deploy → API-Spec Role-C |

---

## §1 — Feature + design

**Feature.** `theo_get_project_context_item` — a `POST` read handler that returns a single L1.5 Project Context item **only if the composed access decision allows**. Body `{ item_id (uuid), room_oids? (uuid[]) }`. It is the orchestrated engine (design §3.2), composing four gates strict-AND, fail-closed:
1. **Caller firm role** — resolve via delegated Graph OBO (`/users/{callerOid}?$select=jobTitle` → `resolveFirmRole`, the §7.1 idiom).
2. **`theo_can_read('L1.5', NULL, item_id, NULL, callerFirmRole, room_oids)`** (§7.3) — the DB decision: L1.5 membership × info-type firm-role floor × the Rule-3 **membership** lowest-participant filter. `false` → 403/404 via `theo_project_context_item_exists_unscoped` (§7.2).
3. **Rule 5 (app layer)** — if the item has a `sharepoint_ref`, a bounded OBO Graph **reachability probe** (metadata GET of `/drives/{driveId}/items/{itemId}`): 2xx allows; any 401/403/404/timeout/error **denies** (403). NULL ref skips it (pure-DB item).
4. **Rule-3 firm-role dimension (app layer)** — for a room context, the LEAST-privileged OTHER participant must also clear the item's info-type floor (per-participant Graph `jobTitle`; a resolution failure ⇒ least-privileged ⇒ fail-closed). This is the piece §7.3 deferred to §7.4.

Returns `200 { data:{ item }, meta }` if every gate allows, else `403`/`404`/`401`/`400`/`500`.

**`sharepoint_ref` format pinned (this VEP):** the `theo_project_context_items.sharepoint_ref text` column (added greenfield in §7.2) is the Graph item path **`drives/{driveId}/items/{itemId}`** (the DMS `driveId`+`itemId` pair — the deployed DMS reference shape). The probe validates it (`driveId` 10..300, `itemId` 5..200, charset `[A-Za-z0-9!,._-]`); a malformed ref is **unverifiable ⇒ deny** (fail-closed). No column change — this only fixes the interpretation of the existing nullable text column.

## §2 — Architecture & boundary reconciliation

**Amendment 1 realised.** Before the engine, access was scattered (chat handlers inline `created_by`; project gates; DMS pure OBO). This handler is the single composition — **"no read path implements its own access logic"** (design §3.2): the DB decision is `theo_can_read`, the SharePoint decision is the Graph probe, combined strict-AND. Existing gates (`theo_project_effective_role`, `theo_conversation_access`) are already **"internal helpers the engine calls"** via `theo_can_read` (§7.3); this handler adds no parallel access path.

**The DB-vs-app split closed.** §7.3 (DB) does membership × info-type floor × membership-lowest-participant. §7.4 (app) adds exactly the two Postgres-impossible gates: (a) Rule 5 — "**they can't see it through Theo either**" if they can't reach the file in SharePoint (vision §7 Rule 5); (b) the firm-role lowest-participant over OTHER participants (their firm roles come from Graph, not Postgres). The room firm-role floors are **ONE POLICY** with §7.2/§7.3 — `TYPE_MIN_RANK` (commercial≥senior_manager, governance≥manager, personnel≥director) is self-verified byte-equal to the deployed classifier's floors, so the app re-check cannot drift from the DB gate.

**Boundary.** No `reporting_*`; no Blob; no write; no migration. Reads one deployed table (`theo_project_context_items`, after the classifier allows) + calls the deployed `theo_can_read` / `theo_project_context_item_exists_unscoped`. The only external calls are OBO→Graph (caller + participant `jobTitle`, and the drive-item reachability HEAD/metadata GET) — the same delegated surface as §7.1 / DMS. Runs on `vaultgpt-func-projects`.

**Fail-closed everywhere:** no caller identity → 401; no OBO bearer → 401; OBO/token failure → its mapped status; `theo_can_read` false → 403/404; unreachable/malformed `sharepoint_ref` → 403; any room participant below the floor (or unresolvable) → 403; unexpected → 500. A mis-configuration over-restricts; it never leaks.

## §3 — Schema Reality Lock (deployed grounding)

Nothing invented (Governor §3/§4) — the handler reuses only DEPLOYED objects:
- **`public.theo_can_read(text,text,uuid,uuid,text,text[])`** — DEPLOYED §7.3 (schema §13; catalog-verified `prosecdef=t`, EXECUTE to authenticated). Called with `('L1.5', NULL, item_id, NULL, callerFirmRole, room_oids)`.
- **`public.theo_project_context_item_exists_unscoped(uuid)`** — DEPLOYED §7.2 (schema §12) for 403/404 discrimination.
- **`public.theo_project_context_items`** — DEPLOYED §7.2 (schema §12); the row read (Functions role bypasses RLS) after the classifier allows.
- **Handler skeleton** = the DEPLOYED `theo_list_project_knowledge` (func-projects): `pg` pool + `set_config` per-request + `_exists_unscoped` 403/404 + `{data,meta}`/`{error}` envelope.
- **OBO block** = byte-faithful from the DEPLOYED `theo_get_my_role` (§7.1). **`graphReachable`** = the DEPLOYED `dms_resolve_item` metadata-GET idiom (2xx=allow), + a bounded socket timeout (design-required).
- **Deployed app fact:** `vaultgpt-func-projects` has pg + OBO env + MI = Key Vault Secrets User (used in §7.2). **Zero new infra.** Deploy = run-from-package (§5.5).

## §4 — No migration

This package ships **no migration** — §7.4 is the handler composition (design §7 item 4). The engine's DB objects landed in §7.2 (Tag Guard + table + exists helper) and §7.3 (`theo_can_read`), both Walter-run + deployed + documented (schema §12/§13). Walter runs nothing for this VEP.

## §5 — Primary Reference (DEPLOYED) + Structural Mirror Table

**Primary Reference:** `theo_list_project_knowledge` — DEPLOYED on `vaultgpt-func-projects`, fetched live via Kudu VFS this turn (Golden Handler §5.5: deployed is the source of truth). The canonical func-projects read handler: `pg` pool, EasyAuth identity, `set_config` per-request, inline access predicate + `_exists_unscoped` 403/404 discrimination, `{data,meta}`/`{error}` envelope. Byte-identical copies in-package; both files inlined full-verbatim (Golden Handler §2).

### §5.1 Structural Mirror Table (Golden Handler §5.1)

| Handler region | Classification vs Primary Reference | Notes |
| -------------- | ----------------------------------- | ----- |
| `require("pg")` + `pool` + `corsHeaders`/`send`/`nowIso`/`errorBody`/`successBody` | **EXACT** | byte-identical (corsHeaders methods POST vs GET — an allowed contract delta) |
| `getPrincipal` / `getClaimValue` / `buildKnownError` / `isUuid` | **EXACT** | byte-identical |
| `set_config` per-request preamble + `_exists_unscoped` 403/404 discrimination + envelope | **EXACT** | byte-identical idiom (project → context-item names) |
| `parseBody` / `parseJsonSafe` | **ALLOWED DELTA** | POST body parse (this handler is POST; the ref is GET-with-query) — standard helpers |
| OBO→Graph block (`requestUrl`/`getOboInputToken`/`exchangeGraphToken`/`graphGetJson`/`resolveFirmRole`) | **ALLOWED DELTA (new-external-system helper, EXACT-mirrored)** | Golden Handler §4 EXACT-mirror route — byte-faithful to the DEPLOYED `theo_get_my_role` (§7.1). `requestUrl` adds a socket `timeoutMs` (design §3.2 "timeout ⇒ deny"). No Walter auth needed. |
| `graphReachable` (drive-item metadata GET, 2xx=allow) | **ALLOWED DELTA (new-external-system helper, EXACT-mirrored)** | Golden Handler §4 — mirrors the DEPLOYED `dms_resolve_item` `graphGetJson` metadata GET of `/drives/{driveId}/items/{itemId}`; returns a boolean (reachability) with fail-closed timeout/error handling. |
| `theo_can_read` call + `TYPE_MIN_RANK` room firm-role floor + `FIRM_RANK` | **ALLOWED DELTA** | the composed decision per design §3.2; floors self-verified byte-equal to §7.2/§7.3 |

No DEVIATION regions.

### §5.2 Primary Reference — `theo_list_project_knowledge` index.js (full verbatim)

```javascript
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

  const projectId =
    req.query && typeof req.query.projectId === "string" ? req.query.projectId.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'projectId' is required and must be a valid UUID.", 400));
  }

  let client = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // B5c: resolve project ACCESS first — owned OR group-visible (B5a) OR shared-with-me (a
    // theo_project_members row). Explicit predicate (connection role's RLS is defense). Accessible →
    // list; exists but not accessible → 403; absent → 404. No leakage of private projects.
    const access = await client.query(
      `
      SELECT 1 FROM public.theo_projects
      WHERE id = $1
        AND (
          created_by = $2
          OR visibility = 'group'
          OR id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = $2)
        )
      `,
      [projectId, oid]
    );
    if (access.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_exists_unscoped($1::uuid) AS e`,
        [projectId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this project.", 403)
        : buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // Knowledge belongs to the project (rows carry the owner's created_by). Access is authorized
    // above, so list ALL of the project's knowledge — a shared project shares its knowledge /
    // instructions with members (config-only sharing). No created_by filter here.
    const result = await client.query(
      `
      SELECT
        id,
        project_id,
        title,
        source_type,
        content,
        created_at
      FROM public.theo_project_knowledge
      WHERE project_id = $1
      ORDER BY created_at ASC, id ASC
      LIMIT 500
      `,
      [projectId]
    );

    return send(context, 200, successBody({ knowledge: result.rows }));
  } catch (err) {
    context.log.error("theo_list_project_knowledge failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this project.", 403));
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

### §5.3 Primary Reference — `theo_list_project_knowledge` function.json (full verbatim)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_project_knowledge"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §6 — The handler (`theo_get_project_context_item`)

Deployed to `vaultgpt-func-projects` (run-from-package). `node --check` clean; `resolveFirmRole` byte-identical to deployed `theo_get_my_role`; `TYPE_MIN_RANK`/`FIRM_RANK` self-verified byte-equal to the §7.2/§7.3 floors (one policy). Full text:

```javascript
const { Pool } = require("pg");
const https = require("https");

// theo_get_project_context_item (Vault Memory Architecture Stage-0 §7.4 — the ORCHESTRATED access-policy engine).
// The single composed read decision (design §3.2 / Amendment 1 — "no read path implements its own access logic"):
//   1. resolve the CALLER's firm role via delegated Graph OBO (§7.1 idiom),
//   2. call the Postgres classifier public.theo_can_read (§7.3 — DB dimensions: L1.5 membership × info-type
//      firm-role floor × Rule-3 MEMBERSHIP lowest-participant),
//   3. Rule 5 (app layer): if the item carries a sharepoint_ref, a bounded OBO Graph reachability probe — 2xx
//      allows, any 401/403/404/timeout/error DENIES (fail-closed),
//   4. Rule-3 firm-role dimension (app layer): the LEAST-privileged OTHER room participant must also clear the
//      item's info-type floor (else the item is not surfaced to this mixed room).
// Strict AND across all four; the item is returned only if EVERY gate allows. This is the reference composition
// future read handlers adopt (removing the inline created_by scattering — design §3.3). Runs on func-projects.
// Structure mirrors the deployed theo_list_project_knowledge (pg + set_config + _exists_unscoped 403/404 +
// {data,meta}); the OBO block mirrors the deployed theo_get_my_role; graphReachable mirrors dms_resolve_item.

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const GRAPH = "https://graph.microsoft.com/v1.0";
const GRAPH_PROBE_TIMEOUT_MS = 5000; // Rule-5 probe: a slow/hung Graph call => deny (fail-closed)
const MAX_ROOM_OIDS = 50;            // bound the firm-role lowest-participant Graph fan-out
// Firm-role rank (Amendment 7): partner > director > senior_manager > manager > associate > preparer > (null=0).
const FIRM_RANK = { partner: 6, director: 5, senior_manager: 4, manager: 3, associate: 2, preparer: 1 };
// info-type read floor as a MIN firm rank — ONE POLICY with the §7.2 Tag Guard + §7.3 theo_can_read floors:
//   commercial => senior_manager (4); governance => manager (3); personnel => director (5).
//   factual/technical/deliberative have no firm floor (membership suffices).
const TYPE_MIN_RANK = { commercial: 4, governance: 3, personnel: 5 };

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

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// ── HTTP + OBO→Graph (byte-faithful from the deployed theo_get_my_role, §7.1; requestUrl adds a bounded
// timeout — an ALLOWED DELTA required by design §3.2 "timeout => deny") ──────────────────────────────────────
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
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }); });
      }
    );
    req.on("error", reject);
    if (options.timeoutMs) {
      req.setTimeout(options.timeoutMs, () => { req.destroy(new Error("graph_probe_timeout")); });
    }
    if (body) req.write(body);
    req.end();
  });
}

function getBearerTokenFromAuthorization(req) {
  const raw = req.headers["authorization"];
  if (!raw || typeof raw !== "string") return null;
  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match && match[1] ? match[1].trim() : null;
}

function getOboInputToken(req) {
  const bearer = getBearerTokenFromAuthorization(req);
  if (bearer) {
    return { token: bearer, source: "authorization_bearer" };
  }
  const tokenStore = req.headers["x-ms-token-aad-access-token"];
  if (typeof tokenStore === "string" && tokenStore.trim() !== "") {
    return { token: tokenStore.trim(), source: "x-ms-token-aad-access-token" };
  }
  return null;
}

async function exchangeGraphToken(oboInputToken) {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw buildKnownError("INTERNAL_SERVER_ERROR", "Missing required OBO configuration.", 500);
  }
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    requested_token_use: "on_behalf_of",
    assertion: oboInputToken,
    scope: "https://graph.microsoft.com/.default",
  }).toString();
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(
    tokenUrl,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } },
    form
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    const description = payload && (payload.error_description || payload.error || (payload.error_codes && payload.error_codes.join(", ")));
    const message = description ? `Delegated Graph token exchange failed: ${description}` : "Delegated Graph token exchange failed.";
    if (r.statusCode === 400 || r.statusCode === 401 || r.statusCode === 403) throw buildKnownError("FORBIDDEN", message, 403);
    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }
  return payload.access_token;
}

async function graphGetJson(url, accessToken) {
  const r = await requestUrl(url, { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }, timeoutMs: GRAPH_PROBE_TIMEOUT_MS });
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300) {
    const message = (payload && payload.error && payload.error.message) || `Graph request failed (HTTP ${r.statusCode}).`;
    if (r.statusCode === 401 || r.statusCode === 403) throw buildKnownError("FORBIDDEN", message, 403);
    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }
  return payload || {};
}

// Firm-role mapping — BYTE-IDENTICAL to the deployed theo_get_my_role.resolveFirmRole (§7.1).
function resolveFirmRole(jobTitle) {
  if (typeof jobTitle !== "string") return null;
  const t = jobTitle.trim().toLowerCase();
  if (!t) return null;
  if (t.includes("partner")) return "partner";
  if (t.includes("director")) return "director";
  if (t.includes("senior manager")) return "senior_manager";
  if (t.includes("manager")) return "manager";
  if (t.includes("associate")) return "associate";
  if (t.includes("preparer")) return "preparer";
  return null;
}

function firmRank(role) {
  return FIRM_RANK[role] || 0;
}

// Resolve ONE user's firm role (per-participant; the theo_get_my_role /users/{oid}?$select=jobTitle idiom).
// Any failure (Graph 403/404/timeout/error) => null => least-privileged (fail-closed).
async function resolveUserFirmRole(oid, accessToken) {
  try {
    const u = await graphGetJson(`${GRAPH}/users/${encodeURIComponent(oid)}?$select=id,jobTitle`, accessToken);
    return resolveFirmRole(u && typeof u.jobTitle === "string" ? u.jobTitle : null);
  } catch {
    return null;
  }
}

// Rule-5 reachability probe (mirrors dms_resolve_item's metadata GET of /drives/{driveId}/items/{itemId}).
// sharepoint_ref format = "drives/{driveId}/items/{itemId}". 2xx => reachable; malformed / non-2xx / timeout /
// error => NOT reachable (fail-closed).
async function graphReachable(sharepointRef, accessToken) {
  if (typeof sharepointRef !== "string") return false;
  const m = sharepointRef.match(/^drives\/([A-Za-z0-9!,._-]{10,300})\/items\/([A-Za-z0-9!,._-]{5,200})$/);
  if (!m) return false; // malformed ref cannot be verified => deny
  const url = `${GRAPH}/drives/${encodeURIComponent(m[1])}/items/${encodeURIComponent(m[2])}`;
  try {
    const r = await requestUrl(url, { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }, timeoutMs: GRAPH_PROBE_TIMEOUT_MS });
    return r.statusCode >= 200 && r.statusCode < 300;
  } catch {
    return false; // timeout / network error => deny
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

  const itemId = typeof body.item_id === "string" ? body.item_id.trim() : "";
  if (!isUuid(itemId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'item_id' is required and must be a valid UUID.", 400));
  }

  // optional collective-chat room participants (the Rule-3 lowest-participant context)
  let roomOids = null;
  if (body.room_oids != null) {
    if (!Array.isArray(body.room_oids)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'room_oids' must be an array of participant OIDs.", 400));
    }
    if (body.room_oids.length > MAX_ROOM_OIDS) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'room_oids' exceeds the maximum of ${MAX_ROOM_OIDS} participants.`, 400));
    }
    const cleaned = body.room_oids.map((o) => (o == null ? "" : String(o).trim())).filter(Boolean);
    for (const o of cleaned) {
      if (!isUuid(o)) {
        return send(context, 400, errorBody("INVALID_REQUEST", "Field 'room_oids' must contain only valid UUIDs.", 400));
      }
    }
    roomOids = cleaned.length > 0 ? cleaned : null;
  }

  // OBO: exchange one delegated Graph token for the caller (used for the caller's firm role, the Rule-5 probe,
  // and each room participant's firm role). No bearer => cannot resolve firm role for the restricted-tag gates.
  const oboInput = getOboInputToken(req);
  if (!oboInput) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing bearer token for delegated Graph access.", 401));
  }
  let graphToken;
  try {
    graphToken = await exchangeGraphToken(oboInput.token);
  } catch (err) {
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  }
  const callerFirmRole = await resolveUserFirmRole(oid, graphToken);

  let client = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // (1) DB decision — theo_can_read (§7.3): L1.5 membership × info-type floor × MEMBERSHIP lowest-participant.
    const decision = await client.query(
      `SELECT public.theo_can_read('L1.5', NULL, $1::uuid, NULL, $2::text, $3::text[]) AS ok`,
      [itemId, callerFirmRole, roomOids]
    );
    const dbAllow = decision.rows[0] && decision.rows[0].ok === true;
    if (!dbAllow) {
      const existsResult = await client.query(
        `SELECT public.theo_project_context_item_exists_unscoped($1::uuid) AS e`,
        [itemId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this item.", 403)
        : buildKnownError("NOT_FOUND", "Item not found.", 404);
    }

    // theo_can_read allowed => read the row (the Functions connection role bypasses RLS) for the app-layer gates
    // + the response payload.
    const rowResult = await client.query(
      `
      SELECT id, project_id, info_type, content, sharepoint_ref, source_conversation_id, created_by, created_at, updated_at
      FROM public.theo_project_context_items
      WHERE id = $1
      `,
      [itemId]
    );
    const item = rowResult.rows[0];
    if (!item) {
      // raced with a delete between the classifier call and the read
      throw buildKnownError("NOT_FOUND", "Item not found.", 404);
    }

    // (2) Rule 5 (app layer) — a SharePoint-linked item must ALSO be reachable by the caller in SharePoint via
    // OBO Graph. NULL ref skips the probe (pure-DB item).
    if (item.sharepoint_ref) {
      const reachable = await graphReachable(item.sharepoint_ref, graphToken);
      if (!reachable) {
        throw buildKnownError("FORBIDDEN", "You do not have access to the linked SharePoint item.", 403);
      }
    }

    // (3) Rule-3 firm-role dimension (app layer) — theo_can_read already applied the MEMBERSHIP lowest-participant
    // filter; here the LEAST-privileged OTHER room participant must also clear the item's info-type floor, or the
    // item is not surfaced to this mixed room. Per-participant firm role via Graph (fail => least-privileged).
    const need = TYPE_MIN_RANK[item.info_type];
    if (roomOids && need) {
      for (const participant of roomOids) {
        if (participant === oid) continue; // the caller already cleared the floor via theo_can_read
        const participantRole = await resolveUserFirmRole(participant, graphToken);
        if (firmRank(participantRole) < need) {
          throw buildKnownError("FORBIDDEN", "This item cannot be surfaced to the current room (a participant lacks sufficient access).", 403);
        }
      }
    }

    // All gates allowed.
    return send(context, 200, successBody({ item }));
  } catch (err) {
    context.log.error("theo_get_project_context_item failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this item.", 403));
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

### §6.1 function.json

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_get_project_context_item"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §7 — Golden Curls (Golden Handler §5.3; Claude runs post-deploy)

Authenticated `az` bearer (audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`, as wmansfield@vault-tax.com — a partner). Fixtures created via the deployed §7.2 `theo_create_project_context_item` (which returns the id + accepts `sharepoint_ref`), read back via §7.4.

| # | Setup → call | Expect |
| - | ------------ | ------ |
| C1 | create factual item F (no ref) → get `{item_id:F}` | **200** `{ data:{ item:{ id:F, info_type:"factual", … } } }` |
| C2 | create commercial item → get it | **200** (partner clears the commercial floor via theo_can_read) |
| C3 | get `{item_id:<random uuid>}` | **404** NOT_FOUND (exists helper → not present) |
| C4 | get `{item_id:"not-a-uuid"}` | **400** INVALID_REQUEST |
| C5 | (unauth) get | **401** UNAUTHORIZED |
| C6 | create item with `sharepoint_ref:"drives/bogusdrive000/items/bogusitem"` → get it | **403** FORBIDDEN (Rule-5 probe: unreachable/denied → deny) |
| C7 | get factual F with `room_oids:[<random uuid>]` | **403** FORBIDDEN (F exists, so the exists-helper returns true; theo_can_read's membership lowest-participant denies because the room participant is not a project member ⇒ deterministic 403) |
| C8 | get factual F with `room_oids:[<Walter's own oid>]` | **200** (self in room; membership + floor clear) |
| C9 | get `{item_id:F, room_oids:["not-a-uuid"]}` | **400** INVALID_REQUEST |

Note: the firm-role lowest-participant NEGATIVE (a real associate-level colleague in the room denied a governance/commercial item) needs a second, low-firm-role member identity and is verified with a colleague (or FE multi-user), as in §7.2's associate case. C1–C9 bound the single-identity matrix + prove the DB decision, Rule-5 deny, and membership-lowest-participant. A reachable-`sharepoint_ref` positive (→200) is confirmed against a real DMS drive-item the caller can open, if one is provisioned for the test; otherwise the C6 deny bounds the Rule-5 gate.

## §8 — Gap Register

**PROCEED.** No missing CURRENT authority; no ESCALATE.
- **G-1 (Rule-5 reachable-positive test fixture): PROCEED** — the C6 unreachable→403 proves the fail-closed probe; a reachable→200 needs a real DMS drive-item the caller can open (provisioned at test time or FE-observed). Non-blocking.
- **G-2 (firm-role lowest-participant negative test): PROCEED** — needs a second low-firm-role member identity; verified with a colleague / FE multi-user (as §7.2). The floor logic is self-verified byte-equal to §7.2/§7.3 (one policy).
- **G-3 (incremental migration of existing read handlers): PROCEED (out of scope, by design)** — design §7 item 4 migrates existing reads onto the engine **incrementally**; this VEP delivers the reference composition. Migrating chat/conversation reads onto `canRead` is follow-on, not this package.
- **G-APISPEC: PRE-LAND (Role-C, post-deploy)** — the new endpoint's API-Spec §2 row lands via Role-C after deploy + golden curls (deploy→document ordering, as §7.1/§7.2). Disclosed; does not block Pass-2.

## §9 — Deploy plan (ordered; §1D/§1E)

1. **Codex Pass-2** → APPROVED/REJECTED.
2. **Claude** deploys `theo_get_project_context_item` to `vaultgpt-func-projects` via **run-from-package** (§5.5: add handler to `vault-projects/functions/`, commit, `npm ci`, build `pkg-<sha>.zip`, upload to `deploy-packages`, repoint `WEBSITE_RUN_FROM_PACKAGE`, restart; rollback = repoint prior pkg), then runs the §7 golden curls. **No migration** (Walter runs nothing).
3. **Role-C** lands the API-Spec §2 row (G-APISPEC).

## Codex activation note (Walter forwards)

```
Codex is activated for Pass-2 review of the Vault Orchestrated Access-Policy Engine (Stage-0 §7.4),
vault-theo, "Codex Governance/Vault-Orchestrated-Engine-Stage0-7-4-Pass-1-VEP/Vault_Orchestrated_Engine_Stage0_7_4_VEP.md".
Open your Pass-2 turn with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo
Grounding Conformance §3/§5). This is a HANDLER-ONLY package (no migration; Claude run-from-package deploy
to func-projects + golden curls). Review for: (1) the composition (§2/§6) — is it the faithful design §3.2
strict-AND (theo_can_read DB AND Rule-5 Graph probe), with the firm-role lowest-participant over OTHER
participants added per the §7.3 deferral, all fail-closed? (2) helper reuse (§3) — theo_can_read +
theo_project_context_item_exists_unscoped called as deployed (schema §12/§13), no re-implemented access
logic (Amendment 1); the row is read only AFTER the classifier allows. (3) the structural mirror (§5.1) —
primary reference theo_list_project_knowledge (deployed, both files inlined); the OBO block a byte-faithful
ALLOWED-DELTA mirror of deployed theo_get_my_role and graphReachable a mirror of deployed dms_resolve_item
(Golden Handler §4 EXACT-mirror route, no Walter auth); requestUrl's added timeout is the design §3.2
"timeout ⇒ deny". (4) ONE-POLICY — TYPE_MIN_RANK/FIRM_RANK are self-verified byte-equal to the §7.2/§7.3
floors so the app re-check cannot drift. (5) fail-closed completeness — malformed/unreachable sharepoint_ref
⇒ deny; unresolvable participant ⇒ least-privileged ⇒ deny; the sharepoint_ref format is pinned to
drives/{driveId}/items/{itemId} with no column change. (6) the deploy plan (§9) — Claude-run-from-package,
API-Spec Role-C deferred post-deploy (G-APISPEC); the reachable-positive + associate-negative test gaps are
disclosed and non-blocking. Emit APPROVED or REJECTED only.
```
