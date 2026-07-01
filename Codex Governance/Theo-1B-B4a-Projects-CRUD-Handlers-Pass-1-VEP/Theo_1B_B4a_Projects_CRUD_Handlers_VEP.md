# Theo 1B — B4a Projects CRUD Handlers (`theo_*_project`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handlers + one additive migration provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier **B4a (handlers)** — the Projects core CRUD set over the deployed `theo_projects` table (B2): `theo_list_projects` (read), `theo_create_project`, `theo_update_project`, `theo_delete_project`. These make the Projects surface **real and persistent** (today the frontend mocks projects in-memory; they vanish on reload) — the Claude-style create / rename / edit-instructions / delete workspace. **One additive migration** adds the `description` column the Projects cards already surface (B2 deployed `name`/`instructions`/`app_key` only). **Every query is explicitly scoped `created_by = $oid`** — the shared Functions connection role bypasses RLS, so isolation is enforced in the query (per the deployed SEC user-isolation fix), with RLS the second layer. Family-B pattern; mutations `connect→BEGIN→set_config→…→COMMIT` / `catch ROLLBACK + 42501→403/23514→400` with `theo_project_exists_unscoped` for 403/404; read is the same minus `BEGIN/COMMIT`. **Ungated** (user-managed CRUD over a deployed table; no model/index/Blob traffic). Project **knowledge** CRUD (`theo_project_knowledge`), the FE mock→live swap, and conversation↔project wiring are the separate following microsteps B4b / B4c / B4d.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `f3530c434805ae8184b6338664a29462a6a0654a` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference (Golden §2) = the **deployed** `theo_create_user_memory` **pair** — same-repo Theo mutation pattern (BEGIN / `set_config` triad / FK-ownership→404 / INSERT RETURNING / COMMIT + 42501/23503/23514 mapping; inlined verbatim §SM) and its deployed `function.json` (inlined verbatim §SM-FJ). The read handler (`theo_list_projects`) follows the deployed read idiom (`theo_list_user_memory` / `theo_list_conversations`); update/delete ownership 403/404 via the deployed `theo_project_exists_unscoped` helper (B2 §5). Contract basis = the deployed `theo_projects` table (Schema §3/§5, DEPLOYED + RO-verified) + Backend Plan Tier B4; one additive `description` column (Schema-delta, additive — the same posture as the B8c/B8i addenda). API Spec §2.2 Projects row + Golden-Handler family-registry update follow post-deploy (§GR G-2), mirroring B3b/B7a. Validation precedes SQL (deterministic 400s). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `grep -F "Gap Register"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `Grep("§4A\\.1")` + `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (Role-C / review gates) | `grep -F "executes the directed edits"` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §4 deltas; §5 SM; §6 HF-T2) | `Read(full)` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (roles / pass axis) | `grep -F "the model swap point"` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B4) | `Grep("B4")` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 row + §5 `theo_projects` DEPLOYED) | `Read(full)` this turn | `59924ef06b64e62b4cc6a268793d52bd82945cbd` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§1 route naming; §2.2 Projects) | `Read(full)` this turn | `c5d6c7b68469ae6605fd625890a8474fabe333c9` |
| 10 | **Primary Reference handler** (deployed Theo mutation pattern) — `Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_create_user_memory.index.js` | `Read(full)` this turn | `9dafc7a0931642b3ac6c05eb8f7b3618b7fa4b23` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_create_user_memory.function.json` | `Read(full)` this turn | `de8f818677215accdf525e4e0ca61a8df8846cc2` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §P1 — B4a projects core CRUD handlers |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference handler = deployed `theo_create_user_memory` |
| Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_create_user_memory.function.json | binding | "httpTrigger" | §SM-FJ — Primary Reference function.json |
| Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_create_user_memory.index.js | mutation | "set_config('app.current_user_id', $1, false)" | §HG.1–§HG.4 — per-request session context |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §HG.1–§HG.4 — every query scoped `created_by = $oid` |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_projects" | §MIGRATION + §HG.1–§HG.4 — handlers operate over the deployed B2 table |
| spec/THEO_API_SPEC.md | §1 | "theo_create_project" | §P3/§P4 — route naming `theo_<operation>_<entity>` |
| spec/THEO_API_SPEC.md | §2.2 | "add / remove project knowledge" | §GR G-3 — knowledge CRUD is the separate B4b microstep |

---

## P1 — Feature identification
**Microstep:** Theo Phase 1B **Tier B4a (handlers)** — the Projects core CRUD set over the deployed `theo_projects` table (Rule Anchor on Plan Tier B4: "Projects + project-knowledge + artifacts + settings CRUD"). Four handlers back the Claude-style Projects surface: **list** (the user's projects, newest-updated first), **create** (`name` + optional `description`/`instructions`/`app_key`), **update** (rename + edit description/instructions/app_key), **delete** (permanent; dependent rows cascade / null per the deployed FKs). This is the persistence the surface needs: today the frontend creates and edits projects only in memory, so a reload loses them; these handlers make projects durable, per-user, RLS-isolated. **Out of scope here (separate microsteps):** project *knowledge* CRUD over `theo_project_knowledge` (B4b); the frontend mock→live swap (B4c); conversation↔project wiring — `project_id` send/persist/restore (B4d). User-managed CRUD only; no model/index/Blob traffic.

## P2 — Architecture & boundary reconciliation
- **Family-B.** `pg` Pool over `POSTGRES_CONNECTION_STRING`; per-request `set_config` triad; mutations `connect→BEGIN→…→COMMIT` with `catch ROLLBACK`; read is the same minus `BEGIN/COMMIT`. Identical helper block to the deployed Theo handlers (`getPrincipal`/`getClaimValue`/`send`/`errorBody`/`successBody`/`parseBody`/`buildKnownError`/`isUuid`).
- **Explicit ownership (SEC-fix discipline).** Every SELECT/UPDATE/DELETE carries `created_by = $oid`; the shared connection role bypasses RLS, so the predicate — not RLS — enforces per-user isolation. Update/delete on a non-owned id → 0 rows → `theo_project_exists_unscoped` → 403/404 (no leakage).
- **Validation before SQL.** `isUuid` on `id`; non-blank `name` ≤200; length-bounded `description`/`instructions`/`app_key`; `update` requires ≥1 updatable field — all deterministic 400s before any query.
- **Boundary.** Reads/writes only `theo_projects` (deployed B2); **no `reporting_*` access**; no Blob, no model gateway, no external system. The additive `description` column is a net-new `NOT NULL DEFAULT ''` column on an existing Theo table (mirrors `instructions`); 23514 (name CHECK) mapped defensively to 400.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Migration + deploy (Walter).** One additive column (`theo_projects.description text NOT NULL DEFAULT ''`, §MIGRATION) then four new functions on the shared `vaultgpt-func-premium` app. `pg` + connection vars already present (B2/B3); the column inherits the table's four ownership policies. | **PRE-LAND** — §MIGRATION + §DEPLOY; Claude Code golden curls confirm (incl. cross-user isolation) + §b4a_verify read-only. |
| G-2 | **Authority-doc updates post-deploy.** API Spec §2.2 Projects row is finalized to name the four endpoints (`theo_list/create/update/delete_project`) — the deployed contract generalizes the v0.1 "patch-instructions" line to a full `update` and adds `delete` (Claude parity); the Golden Handler family registry already lists HF-T2 over `theo_projects`. | **PRE-LAND** — a short API-Spec Projects Role-C follows deploy (mirrors the B3b / B7a Role-C), before any FE projects-live VEP (B4c) cites it (T22 prevention). |
| G-3 | **Project knowledge CRUD + FE swap + conversation↔project wiring.** `theo_project_knowledge` add/remove (B4b); `theoClient` mock→live + `useTheoState` async (B4c); `project_id` send/persist/restore + per-project chat list (B4d). | **PROCEED (future-trigger).** Separate, sequenced microsteps; `theo_list_projects` here intentionally returns project rows without the `knowledge[]` array (B4b adds the knowledge read/write). Not in this pack. |

No write SQL executes in this pack (plan only); the additive migration is Walter-executed at Pass 3 per §MIGRATION. No `reporting_*` change.

## P3 — Backend / contract grounding
Contract basis = the deployed `theo_projects` table (Schema §3/§5; columns `name` (CHECK not-blank) / `instructions` (NOT NULL DEFAULT '') / `app_key` (NULL) + `id`/`created_by`/timestamps) **plus** the additive `description text NOT NULL DEFAULT ''` column (§MIGRATION). Omitted `description`/`instructions` insert `""` (never NULL, honouring the NOT NULL columns); omitted `app_key` inserts NULL (nullable). Response envelope = the standard `{ data, meta }` / `{ error }` shape used by every Theo handler. Endpoints (new): `GET /api/theo_list_projects`; `POST /api/theo_create_project`; `POST /api/theo_update_project`; `POST /api/theo_delete_project` — route naming `theo_<operation>_<entity>` (API Spec §1, anchor "theo_create_project"). API Spec §2.2 Projects row is finalized to these four post-deploy (G-2).

## P4 — Per-handler contract
- **`theo_list_projects`** (GET): no params; `SELECT id, name, description, instructions, app_key, created_at, updated_at WHERE created_by=$1 ORDER BY updated_at DESC, id DESC LIMIT 500` → **200** `{ projects: [...] }` (own rows only).
- **`theo_create_project`** (POST): validates `name` (non-blank ≤200) + optional `description` (≤500) / `instructions` (≤8000) / `app_key` (≤200); omitted `description`/`instructions` default to `""` (both NOT NULL columns), omitted `app_key` → NULL; `INSERT (created_by, name, description, instructions, app_key) RETURNING …` → **201** `{ project }`; 23514→400.
- **`theo_update_project`** (POST): `id` uuid + ≥1 of `name`(non-blank)/`description`/`instructions`/`app_key`; `UPDATE … SET …, updated_at=now() WHERE id=$ AND created_by=$ RETURNING …`; 0 rows → 403/404 via helper → **200** `{ project }`; 23514→400. (`description`/`instructions`/`app_key` may be `""` to clear; `name` must stay non-blank.)
- **`theo_delete_project`** (POST): `id` uuid; `DELETE … WHERE id=$ AND created_by=$ RETURNING id`; 0 rows → 403/404 → **200** `{ deleted:true, id }`. Dependents follow the deployed FKs (Schema §3): `theo_project_knowledge` + `theo_user_memory` CASCADE; `theo_conversations` + `theo_artifacts` `project_id` SET NULL (chats survive, unlinked).

## P5 — Component reference grounding
Primary Reference (Golden §2) = the **deployed** `theo_create_user_memory` **pair** — the handler (Theo mutation pattern, inlined byte-identical §SM) and its deployed `function.json` (inlined byte-identical §SM-FJ; `httpTrigger` POST/OPTIONS, underscore route = handler name, anonymous — EasyAuth in front). The four handlers reuse that deployed helper block verbatim and the `theo_list_user_memory` read / `*_exists_unscoped` ownership idiom; only the `theo_projects`-specific columns/validation differ (ALLOWED DELTA per Golden §4: table/column names, the validated field set, the RLS-scoped query, the response shape). The four new `function.json` (§FJ.1–§FJ.4) follow the §SM-FJ binding shape (list = GET/OPTIONS; mutations = POST/OPTIONS; underscore route = handler name; anonymous). No new external-system helper is introduced (no DEVIATION).

## P6 — Repository & active-surface grounding
New artifacts (this package): four `*.index.js` + four `*.function.json` + one additive migration (`b4a_migration.sql`) + read-only verify (`b4a_verify.sql`). No existing source changed. Guardrails: no browser storage (backend); no `reporting_*`; explicit `created_by` on every query; `node --check` clean for all four handlers; `function.json` methods = GET (list) / POST (mutations), routes match handler names, `authLevel` anonymous. The additive column inherits the table's four ownership RLS policies (RLS is table-scoped), so no policy change is needed.

## P7 — Risk / regression
- **Migration:** additive `NOT NULL DEFAULT ''` column (`ADD COLUMN IF NOT EXISTS`) — existing rows backfill to `''` (Postgres applies the default), no CHECK, no policy change; reversible by `DROP COLUMN` if ever needed.
- **Greenfield handlers:** four new functions; no change to deployed handlers/tables/policies.
- **Isolation:** explicit `created_by` on every query (verified by the cross-user golden curl).
- **Permanent delete:** `theo_delete_project` hard-deletes; ownership-checked first; dependents follow deployed FK actions (knowledge/memory cascade; conversations/artifacts unlink, not deleted).

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3 PROCEED future-trigger); Primary Reference inlined byte-identical (§SM/§SM-FJ); additive migration + read-only verify (§MIGRATION); four full handlers (§HG.1–§HG.4) + four `function.json` (§FJ.1–§FJ.4) inlined, each `node --check` / JSON-valid. Plan-only. On Codex APPROVAL, Walter runs §MIGRATION, deploys the four functions; Claude Code golden-curls (create→list→update→delete→validation→cross-user isolation) + §b4a_verify; then the API-Spec Projects Role-C (G-2).

---

## §MIGRATION — Walter-executable additive migration (`b4a_migration.sql`)
Additive `NOT NULL DEFAULT ''` column (mirrors the same table's `instructions text NOT NULL DEFAULT ''` from B2 line 16, and the FE `desc: string` shape — never null; existing rows backfill to `''`); no transaction control per the Golden SQL Standard §5.2; inherits the table's four ownership policies (RLS is table-scoped).
```sql
-- Theo Tier B4a — additive: project description column.
-- theo_projects gained name / instructions / app_key in B2 (§5). The Projects surface (and the
-- Claude-parity project cards) also carry a short description. This adds it additively as
-- NOT NULL DEFAULT '' — mirroring the same table's `instructions text NOT NULL DEFAULT ''` column
-- (B2 line 16) and the FE `desc: string` shape, so the column is never null (existing rows backfill
-- to ''). New columns inherit the table's four ownership RLS policies automatically (RLS is
-- table-scoped), so no policy change is required. No top-level transaction control per the Golden
-- SQL Standard (§5.2); Walter executes.
ALTER TABLE public.theo_projects ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';
```

### §b4a_verify — read-only post-migration verification (`b4a_verify.sql`)
```sql
-- Read-only verification for Tier B4a (SELECT-only; no writes, no transaction control).
-- V1 — the additive description column exists on theo_projects (text, NOT NULL DEFAULT '').
-- column_default is selected so the DEFAULT '' is verified, not just the nullability.
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_projects'
ORDER BY ordinal_position;

-- V2 — RLS remains enabled with the four ownership policies (unchanged by an additive column).
SELECT polname, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'theo_projects'
ORDER BY polname;

-- V3 — the 403/404 discrimination helper used by update/delete is present.
SELECT proname
FROM pg_proc
WHERE proname = 'theo_project_exists_unscoped';
```

---

## §SM — Primary Reference (deployed `theo_create_user_memory`, byte-identical; Theo mutation pattern)
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

    // FK ownership (the connection role bypasses RLS, so FK existence does NOT prove ownership):
    // a referenced project / conversation MUST belong to the caller, else 404 (no leakage).
    if (projectId !== null) {
      const owned = await client.query(
        `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
        [projectId, oid]
      );
      if (owned.rowCount === 0) {
        throw buildKnownError("NOT_FOUND", "Referenced project not found.", 404);
      }
    }
    if (sourceConversationId !== null) {
      const owned = await client.query(
        `SELECT 1 FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
        [sourceConversationId, oid]
      );
      if (owned.rowCount === 0) {
        throw buildKnownError("NOT_FOUND", "Referenced conversation not found.", 404);
      }
    }

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
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
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

## §SM-FJ — Primary Reference function.json (deployed `theo_create_user_memory.function.json`, byte-identical)
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

---

## §HG.1 — `theo_list_projects/index.js` (full)
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
    // by the created_by predicate (never RLS alone). Newest-updated first (backs the Projects list).
    const result = await client.query(
      `
      SELECT
        id,
        name,
        description,
        instructions,
        app_key,
        created_at,
        updated_at
      FROM public.theo_projects
      WHERE created_by = $1
      ORDER BY updated_at DESC, id DESC
      LIMIT 500
      `,
      [oid]
    );

    return send(context, 200, successBody({ projects: result.rows }));
  } catch (err) {
    context.log.error("theo_list_projects failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list projects.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```
## §FJ.1 — `theo_list_projects/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_projects"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.2 — `theo_create_project/index.js` (full)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const NAME_MAX_LEN = 200;
const DESCRIPTION_MAX_LEN = 500;
const INSTRUCTIONS_MAX_LEN = 8000;
const APP_KEY_MAX_LEN = 200;

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
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'name' is required and must be a non-empty string.", 400));
  }
  if (name.length > NAME_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'name' must be at most ${NAME_MAX_LEN} characters.`, 400));
  }

  // description / instructions are optional; they default to "" (both columns are
  // NOT NULL DEFAULT '' — instructions from B2, description from the B4a migration), so an
  // omitted value must insert "" not NULL. app_key is nullable, so it stays null when omitted.
  let description = "";
  if (body.description != null) {
    if (typeof body.description !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'description', when supplied, must be a string.", 400));
    }
    if (body.description.length > DESCRIPTION_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'description' must be at most ${DESCRIPTION_MAX_LEN} characters.`, 400));
    }
    description = body.description;
  }

  let instructions = "";
  if (body.instructions != null) {
    if (typeof body.instructions !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'instructions', when supplied, must be a string.", 400));
    }
    if (body.instructions.length > INSTRUCTIONS_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'instructions' must be at most ${INSTRUCTIONS_MAX_LEN} characters.`, 400));
    }
    instructions = body.instructions;
  }

  let appKey = null;
  if (body.app_key != null) {
    if (typeof body.app_key !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'app_key', when supplied, must be a string.", 400));
    }
    if (body.app_key.length > APP_KEY_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'app_key' must be at most ${APP_KEY_MAX_LEN} characters.`, 400));
    }
    appKey = body.app_key;
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
      INSERT INTO public.theo_projects
        (created_by, name, description, instructions, app_key)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id, name, description, instructions, app_key, created_at, updated_at
      `,
      [oid, name, description, instructions, appKey]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({ project: inserted.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_create_project failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create a project.", 403));
    }
    // CHECK violation (name not-blank), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Project violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```
## §FJ.2 — `theo_create_project/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_create_project"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.3 — `theo_update_project/index.js` (full)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const NAME_MAX_LEN = 200;
const DESCRIPTION_MAX_LEN = 500;
const INSTRUCTIONS_MAX_LEN = 8000;
const APP_KEY_MAX_LEN = 200;

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

  // Editable fields: name (non-blank), description, instructions, app_key. At least one required.
  // description / instructions / app_key may be set to "" to clear them; name must stay non-blank.
  const updates = [];
  const params = [];

  if (body.name != null) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'name', when supplied, must be a non-empty string.", 400));
    }
    if (body.name.trim().length > NAME_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'name' must be at most ${NAME_MAX_LEN} characters.`, 400));
    }
    params.push(body.name.trim());
    updates.push(`name = $${params.length}`);
  }

  if (body.description != null) {
    if (typeof body.description !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'description', when supplied, must be a string.", 400));
    }
    if (body.description.length > DESCRIPTION_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'description' must be at most ${DESCRIPTION_MAX_LEN} characters.`, 400));
    }
    params.push(body.description);
    updates.push(`description = $${params.length}`);
  }

  if (body.instructions != null) {
    if (typeof body.instructions !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'instructions', when supplied, must be a string.", 400));
    }
    if (body.instructions.length > INSTRUCTIONS_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'instructions' must be at most ${INSTRUCTIONS_MAX_LEN} characters.`, 400));
    }
    params.push(body.instructions);
    updates.push(`instructions = $${params.length}`);
  }

  if (body.app_key != null) {
    if (typeof body.app_key !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'app_key', when supplied, must be a string.", 400));
    }
    if (body.app_key.length > APP_KEY_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'app_key' must be at most ${APP_KEY_MAX_LEN} characters.`, 400));
    }
    params.push(body.app_key);
    updates.push(`app_key = $${params.length}`);
  }

  if (updates.length === 0) {
    return send(context, 400, errorBody("INVALID_REQUEST", "At least one updatable field ('name', 'description', 'instructions', or 'app_key') is required.", 400));
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
      UPDATE public.theo_projects
      SET ${updates.join(", ")}, updated_at = now()
      WHERE id = $${idParam} AND created_by = $${oidParam}
      RETURNING
        id, name, description, instructions, app_key, created_at, updated_at
      `,
      params
    );

    if (updated.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_exists_unscoped($1::uuid) AS e`,
        [id]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this project.", 403)
        : buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ project: updated.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_update_project failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // CHECK violation (name not-blank), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Project violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```
## §FJ.3 — `theo_update_project/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_update_project"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.4 — `theo_delete_project/index.js` (full)
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

    // Explicit ownership scope (connection role bypasses RLS): permanent delete.
    // FK cascades (theo_project_knowledge, theo_user_memory) / SET NULL (theo_conversations,
    // theo_artifacts) are defined on the dependent tables (Schema §3): chats survive, unlinked.
    const deleted = await client.query(
      `DELETE FROM public.theo_projects WHERE id = $1 AND created_by = $2 RETURNING id`,
      [id, oid]
    );

    if (deleted.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_exists_unscoped($1::uuid) AS e`,
        [id]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this project.", 403)
        : buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ deleted: true, id: deleted.rows[0].id }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_delete_project failed", err);

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
## §FJ.4 — `theo_delete_project/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_delete_project"
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

## §SM-TABLE — Structural Mirror (every region → Primary Reference, with classification)
| Region | Primary Reference region (`theo_create_user_memory`) | Classification |
| --- | --- | --- |
| `pg` Pool + `ssl` | identical | EXACT |
| `corsHeaders` (GET for list; POST for mutations) | identical (POST); list swaps `Access-Control-Allow-Methods` to `GET, OPTIONS` (matches deployed `theo_list_user_memory`) | EXACT / ALLOWED DELTA (method string) |
| `send`/`nowIso`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`buildKnownError`/`isUuid` | identical helper block | EXACT |
| OID extraction + 401 | identical | EXACT |
| Input validation (deterministic 400s) | same discipline; `theo_projects` field set (`name`/`description`/`instructions`/`app_key`/`id`) | ALLOWED DELTA (validated field set) |
| `connect`→`BEGIN`→`set_config` triad | identical | EXACT |
| RLS-scoped SQL (`INSERT`/`SELECT`/`UPDATE`/`DELETE` over `theo_projects`, `created_by = $oid`) | same idiom; `theo_projects` table/columns | ALLOWED DELTA (table/column names; RLS-scoped query) |
| 0-row → `theo_project_exists_unscoped` → 403/404 | same idiom as `theo_update/delete_user_memory` (`theo_user_memory_exists_unscoped`) | ALLOWED DELTA (helper name) |
| `COMMIT` + success envelope (`{ project }` / `{ projects }` / `{ deleted, id }`) | same `{ data, meta }` shape | ALLOWED DELTA (response payload) |
| `catch` ROLLBACK + 42501→403 / 23514→400 / isKnown / 500 | identical mapping (no `23503` here — no inbound FK on create) | EXACT / ALLOWED DELTA (omits 23503) |
| `function.json` (httpTrigger, anonymous, underscore route; GET list / POST mutations) | identical binding shape | EXACT / ALLOWED DELTA (method + route name) |

No new external-system helper; no DEVIATION.

## §PARITY — Golden Handler Standard parity checklist (§5.4)
- [x] Single canonical Primary Reference handler + function.json selected and inlined full-verbatim (§SM/§SM-FJ).
- [x] Structural Mirror Table present, every region classified + anchored (§SM-TABLE).
- [x] Executes as the signed-in user (OID); explicit `created_by` predicate on every query; RLS second layer.
- [x] Reads/writes only `theo_` tables; no `reporting_*`; no tokens/OIDs/URLs leaked in responses or logs.
- [x] Input validated against contract; deterministic 400s before SQL; spec status codes (401/400/403/404/500).
- [x] Migration carries no top-level transaction control; no prohibited psql meta-commands (§MIGRATION).
- [x] Deterministic golden curls for every endpoint (§CURL); `node --check` clean; `function.json` JSON-valid.

---

## §DEPLOY — Walter deploy steps (one migration; four new functions; no env, no dependency)
1. Run `b4a_migration.sql` (§MIGRATION) against `vaultgpt-postgres-prod` (adds `theo_projects.description`).
2. Create `theo_list_projects` (§HG.1 + §FJ.1).
3. Create `theo_create_project` (§HG.2 + §FJ.2).
4. Create `theo_update_project` (§HG.3 + §FJ.3).
5. Create `theo_delete_project` (§HG.4 + §FJ.4).
6. Reply "B4a deployed" → Claude Code runs §b4a_verify (read-only) + §CURL.

## §CURL — verification plan (token via `az`; never printed; captured under `.local/`)
1. **Create** — `POST theo_create_project {name:"Da Vinci Capital — 2025 K-1s", description:"Fund K-1 workpapers", instructions:"Default to US partnership framing."}` → **201** + `project.id`, `description`/`instructions` echoed.
2. **List (self)** — `GET theo_list_projects` → 200; includes the created project; **only the caller's own** rows; newest-updated first.
3. **Update (rename + instructions)** — `POST theo_update_project {id, name:"Da Vinci Capital — 2025", instructions:"Flag any 1446(f) trigger."}` → 200; fields changed, `updated_at` advanced.
4. **Delete** — `POST theo_delete_project {id}` → 200 `{deleted:true}`; subsequent list omits it.
5. **Validation** — empty `name` on create → 400; `update` with only `{id}` (no updatable field) → 400; bad `id` uuid → 400.
6. **Cross-user isolation** — update/delete an **existing foreign-owned** `id` → **403** (via `theo_project_exists_unscoped` = true; never another user's project data), and a random **nonexistent** `id` → **404** (helper = false); list returns only the caller's own rows.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B4a Projects CRUD Handlers Pass-1 Backend VEP (plan only).*
