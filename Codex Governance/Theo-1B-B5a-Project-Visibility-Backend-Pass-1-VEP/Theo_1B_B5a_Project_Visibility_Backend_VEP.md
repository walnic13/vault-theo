# Theo 1B — B5a Project Visibility (backend: `theo_set_project_visibility` + group-visible RLS/handler broadening) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete migration + handlers provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** the first step of the Sharing/Visibility tier (Tier B5) — a **group-visible** project sharing model (Walter-directed 2026-07-01; sharing model = "both, phased" → this is the group-visible half; per-member invite is a Phase-2 fast-follow). A project owner can flip a project to `visibility = 'group'`, making it (and its **knowledge + instructions**) readable by any authenticated Vault user; each member chats with **their own** conversations in it (**config-only sharing** — `theo_conversations`/`theo_messages` RLS is UNCHANGED, so no one reads another user's transcripts). **Additive, reversible migration** (`theo_projects.visibility` + broadened SELECT-only RLS on `theo_projects` + `theo_project_knowledge`). One GREENFIELD handler (`theo_set_project_visibility`, owner-only) + three MODIFIED handlers (`theo_list_projects`, `theo_list_project_knowledge`, `theo_set_conversation_project`) broaden their explicit predicate to `owned ∨ group-visible`. No Microsoft Graph, no vault-origin change (that's Phase 2: roster/presence + per-member invite).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `87de16e` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked; includes an **additive schema migration** (§MIGRATION). Primary Reference (Golden §2) = the **deployed** `theo_update_project` **pair** (B4a) — owner-scoped UPDATE over `theo_projects` with the `set_config` triad / `UPDATE … WHERE id AND created_by` / 0-row → `theo_project_exists_unscoped` → 403-404 / 42501-isKnown-500 mapping, inlined verbatim §SM/§SM-FJ. `theo_set_project_visibility` mirrors it (sets `visibility`; owner-only). The three MODIFIED handlers are their own deployed selves with the single ALLOWED DELTA of broadening the project predicate from `created_by = $oid` to `created_by = $oid OR visibility = 'group'` (list_projects also returns `visibility` + `is_owner`; list_project_knowledge lists all of an accessible project's knowledge). Contract basis = deployed `theo_projects` + `theo_project_knowledge` (Schema §3/§5) + Backend Plan Tier B4 (projects CRUD). Config-only sharing: `theo_conversations`/`theo_messages` RLS UNCHANGED. Schema change is Walter-authorized (sharing-model decision, 2026-07-01). Validation precedes SQL. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `git grep -F "Gap Register"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §4 deltas; §5 SM) | `git grep -F "selects **exactly one** deployed handler file"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (pass axis) | cited | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4 projects CRUD) | `git grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `git grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3/§5 `theo_projects` + `theo_project_knowledge`) | `git grep -F "theo_projects"` this turn | `59924ef06b64e62b4cc6a268793d52bd82945cbd` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 projects) | `Read` this turn | `4808c4dd6d43013c6defe94e636542e47d639449` |
| 10 | **Primary Reference handler** (deployed owner-scoped UPDATE over theo_projects) — `Codex Governance/Theo-1B-B4a-Projects-CRUD-Handlers-Pass-1-VEP/theo_update_project.index.js` | `Read(full)` this turn | `c59db3c3978b00c95bbcab0971f792eeb435bc6c` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-B4a-Projects-CRUD-Handlers-Pass-1-VEP/theo_update_project.function.json` | `Read(full)` this turn | `f53239ebaa5a64aedfa331f48e3346c52eb26c2b` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. `theo_message`/`theo_message_stream` NOT touched. `theo_conversations`/`theo_messages` RLS NOT touched (config-only sharing).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §P1 — visibility extends the deployed projects CRUD surface |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_update_project` |
| Codex Governance/Theo-1B-B4a-Projects-CRUD-Handlers-Pass-1-VEP/theo_update_project.function.json | binding | "httpTrigger" | §SM-FJ — Primary Reference function.json |
| Codex Governance/Theo-1B-B4a-Projects-CRUD-Handlers-Pass-1-VEP/theo_update_project.index.js | 0-row | "theo_project_exists_unscoped" | §HG.1 — `theo_set_project_visibility` 0-row → 403/404 (same idiom) |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P2 — visibility='group' is a cited, deliberate SELECT-only extension of the ownership family |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_projects" | §MIGRATION — additive `visibility` column + broadened SELECT RLS on the deployed table |

---

## P1 — Feature identification
**Microstep:** project **group-visibility** — the group-visible half of the Sharing/Visibility tier (Walter's "both, phased" decision; extends the Plan Tier B4 projects CRUD). Today `theo_projects` is owner-only. This adds:
- **`theo_set_project_visibility`** (POST `{id, visibility}`, owner-only) — flip a project between `'private'` and `'group'`.
- A **group-visible** project (+ its knowledge/instructions) becomes readable by any authenticated Vault user (only eligible users can authenticate, so "group" = the eligible population — no Graph needed at the RLS layer).
- Members chat with **their own** conversations in a shared project (`theo_conversations`/`theo_messages` RLS UNCHANGED — **config-only sharing**, no transcript exposure).

**Out of scope (Phase 2):** roster/presence (vault-origin shell + OBO→Graph), per-member invite (`theo_project_members` + share/unshare handlers), and the FE share affordance (paired B5a-FE handles the visibility toggle + "Shared" badge; invite is Phase 2).

## P2 — Architecture & boundary reconciliation
- **Family-B.** `pg` Pool; per-request `set_config` triad; `theo_set_project_visibility` is a mutation `connect→BEGIN→…→COMMIT` with `catch ROLLBACK`; the three reads/link handlers keep their existing shapes.
- **Ownership family + a cited extension (Architecture §5.2 "Default family: ownership-based").** The ownership RLS family is preserved for writes (INSERT/UPDATE/DELETE stay `created_by = auth.uid()` — only the owner creates/edits/deletes/re-shares). The **SELECT-only** policies on `theo_projects` + `theo_project_knowledge` gain a deliberate `OR visibility = 'group'` clause — a cited, minimal read-broadening, not a general relaxation. Handlers carry the matching explicit predicate (`created_by = $oid OR visibility = 'group'`); RLS is the defense layer.
- **Config-only sharing boundary.** `theo_conversations` + `theo_messages` RLS is **untouched** — a shared project shares its config (knowledge/instructions), never another user's chat transcripts. `theo_set_conversation_project` lets a member link **their own** conversation to a group-visible project; the conversation stays owner-scoped.
- **Validation before SQL.** `isUuid` on ids; `visibility ∈ {private,group}` — deterministic 400s before any query.
- **Boundary.** Reads/writes only `theo_projects` + `theo_project_knowledge` (+ `theo_conversations.project_id` link, owner-scoped); **no `reporting_*`**; no Blob, no model gateway, no Graph; **no change to `theo_message`/`theo_message_stream`**.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Migration + deploy (Walter).** One additive column + 2 SELECT-policy broadenings (§MIGRATION); one new function + three redeployed functions on `vaultgpt-func-premium`. Additive + reversible; Walter-authorized (sharing-model decision). | **PRE-LAND** — §DEPLOY; Claude Code golden curls confirm (set visibility → cross-user group-visible read of project + knowledge → private stays isolated → member links own chat → owner-only visibility change). |
| G-2 | **Authority-doc update post-deploy.** API Spec §2.2 gains the `theo_set_project_visibility` row + notes the group-visible read semantics on list/knowledge. | **PRE-LAND** — a short API-Spec Role-C follows deploy (mirrors B4x), before the B5a-FE VEP cites it. |
| G-3 | **Config-only vs transcript sharing.** A shared project shares knowledge/instructions, not chat transcripts (conversations/messages RLS untouched). | **PROCEED (Walter-decided default).** Full transcript-sharing would be a separate, explicitly-authorized RLS change (deferred). |
| G-4 | **Per-member invite + roster/presence (Phase 2).** `theo_project_members`, share/unshare, OBO→Graph roster/presence, vault-origin shell panel. | **PROCEED (future-trigger).** Separate Phase-2 microsteps; not in this pack. Needs an admin-consented Graph grant (out of this pack). |

No write SQL executes in this pack (plan only); the migration executes only when Walter deploys it. No `reporting_*` change.

## P3 — Backend / contract grounding
Contract basis = deployed `theo_projects` (owner-scoped; gains `visibility text NOT NULL DEFAULT 'private' CHECK IN ('private','group')`) + `theo_project_knowledge` (immutable; SELECT broadened to group-visible parent) + `theo_project_exists_unscoped` (Schema §3/§5). Response envelope = standard `{ data, meta }` / `{ error }`. New endpoint: `POST /api/theo_set_project_visibility` `{ id, visibility }` → `{ project: { id, visibility } }`. Modified: `GET /api/theo_list_projects` → each row gains `visibility` + `is_owner`, and the set includes group-visible projects; `GET /api/theo_list_project_knowledge?projectId` → lists an accessible (owned ∨ group-visible) project's knowledge; `POST /api/theo_set_conversation_project` → accepts an owned ∨ group-visible target project. API Spec §2.2 row lands post-deploy (G-2).

## P4 — Per-handler contract
- **`theo_set_project_visibility`** (POST, NEW): `id` uuid + `visibility ∈ {private,group}`; `UPDATE theo_projects SET visibility=$1, updated_at=now() WHERE id=$2 AND created_by=$3 RETURNING id, visibility`; 0 rows → 403/404 via helper → **200** `{ project:{ id, visibility } }`.
- **`theo_list_projects`** (GET, MODIFIED): `WHERE created_by=$1 OR visibility='group'`; SELECT adds `visibility`, `(created_by=$1) AS is_owner`. → **200** `{ projects:[…] }`.
- **`theo_list_project_knowledge`** (GET, MODIFIED): access = `id=$1 AND (created_by=$2 OR visibility='group')` → 403/404 else; knowledge `WHERE project_id=$1` (all of the accessible project's knowledge). → **200** `{ knowledge:[…] }`.
- **`theo_set_conversation_project`** (POST, MODIFIED): accessible project = `id=$1 AND (created_by=$2 OR visibility='group')` → 404 else; conversation stays owner-scoped (403/404 via helper); idempotent set-once. → **200** `{ conversation_id, project_id }`.

## P5 — Component reference grounding
Primary Reference (Golden §2) = the **deployed** `theo_update_project` **pair** — owner-scoped UPDATE over `theo_projects` (`set_config` triad; `UPDATE … WHERE id AND created_by`; 0-row → `theo_project_exists_unscoped` → 403/404; 42501/isKnown/23514/500 mapping), inlined byte-identical §SM/§SM-FJ. `theo_set_project_visibility` mirrors it (ALLOWED DELTA = the single `visibility` field + its CHECK-vocabulary validation). The three MODIFIED handlers mirror **their own deployed selves** (ALLOWED DELTA = the `OR visibility='group'` predicate broadening + list_projects' added columns + list_project_knowledge dropping the redundant `created_by` filter after the access gate). No new external-system helper (no DEVIATION).

## P6 — Repository & active-surface grounding
New: `theo_set_project_visibility.index.js` + `.function.json`. Modified (full replacements): `theo_list_projects`, `theo_list_project_knowledge`, `theo_set_conversation_project` (each `.index.js`; function.json unchanged, re-supplied). Migration `b5a_migration.sql` + read-only `b5a_verify.sql`. `theo_message`/`theo_message_stream` + conversations/messages RLS unchanged. Guardrails: no browser storage; no `reporting_*`; explicit predicate on every query; `node --check` clean all four handlers; `function.json` methods correct (POST set/link, GET lists), routes match handler names, `authLevel` anonymous.

## P7 — Risk / regression
- **Additive migration:** new column defaults `'private'` → every existing project stays private (no behavior change until an owner opts in). SELECT-policy broadening is guarded/idempotent.
- **Write isolation preserved:** INSERT/UPDATE/DELETE RLS + handler predicates remain owner-only; only SELECT broadens. Only the owner can change visibility (verified by the owner-only golden curl).
- **No transcript leak:** conversations/messages RLS untouched; a member sees only their own chats in a shared project (verified cross-user).
- **Redeploy discipline:** three MODIFIED handlers each need their own redeploy (the B4d lesson) — §DEPLOY lists all four functions explicitly.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED); §MIGRATION additive+reversible; Primary Reference inlined byte-identical (§SM/§SM-FJ); one new + three modified handlers (§HG.1–4) + four `function.json` (§FJ.1–4) inlined, each `node --check` / JSON-valid; Structural Mirror (§SM-TABLE) + parity checklist (§PARITY). Plan-only. On Codex APPROVAL, Walter runs the migration + deploys the four functions; Claude Code golden-curls (set visibility → cross-user group read → private isolation → member links own chat → owner-only change); then the API-Spec Role-C (G-2); then B5a-FE (visibility toggle + "Shared" badge).

---

## §MIGRATION — `b5a_migration.sql` (additive + reversible; Walter runs at deploy)
```sql
-- Theo B5a — Project Visibility (group-visible sharing). ADDITIVE + REVERSIBLE.
-- Adds theo_projects.visibility ('private' default | 'group') and broadens the SELECT-only RLS on
-- theo_projects + theo_project_knowledge so a group-visible project (and its knowledge/instructions)
-- is readable by any authenticated Vault user. INSERT/UPDATE/DELETE stay owner-only. Conversations /
-- messages RLS is UNCHANGED (config-only sharing: members chat with their own conversations; no one
-- reads another user's transcripts). Idempotent; safe to re-run.

-- 1) Additive column: visibility (default preserves existing rows as private).
ALTER TABLE public.theo_projects
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'private';

-- 2) Constrain to the closed vocabulary (guarded so re-run is safe).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'theo_projects_visibility_chk'
  ) THEN
    ALTER TABLE public.theo_projects
      ADD CONSTRAINT theo_projects_visibility_chk CHECK (visibility IN ('private','group'));
  END IF;
END $$;

-- 3) Broaden theo_projects SELECT policy: own OR group-visible. (INSERT/UPDATE/DELETE unchanged — owner-only.)
DROP POLICY IF EXISTS "theo_project_select_own" ON public.theo_projects;
CREATE POLICY "theo_project_select_own" ON public.theo_projects
  FOR SELECT TO authenticated
  USING (created_by = auth.uid() OR visibility = 'group');

-- 4) Broaden theo_project_knowledge SELECT policy: own OR belongs to a group-visible project.
--    (INSERT/UPDATE/DELETE unchanged — only the project owner adds/removes knowledge.)
DROP POLICY IF EXISTS "theo_project_knowledge_select_own" ON public.theo_project_knowledge;
CREATE POLICY "theo_project_knowledge_select_own" ON public.theo_project_knowledge
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR project_id IN (SELECT id FROM public.theo_projects WHERE visibility = 'group')
  );
```

### Read-only verification — `b5a_verify.sql`
```sql
-- Theo B5a — read-only post-migration verification (run via the RO grounding path).
-- V1: the visibility column exists, is NOT NULL, defaults 'private'.
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_projects' AND column_name = 'visibility';

-- V2: the CHECK constraint is present.
SELECT conname, pg_get_constraintdef(oid) AS def
FROM pg_constraint WHERE conname = 'theo_projects_visibility_chk';

-- V3: the broadened SELECT policies (own OR group-visible).
SELECT tablename, polname, pg_get_expr(polqual, polrelid) AS using_expr
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname IN ('theo_projects','theo_project_knowledge') AND p.polcmd = 'r'
ORDER BY tablename, polname;

-- V4: conversations/messages RLS UNCHANGED (still owner-only) — confirm no group clause leaked in.
SELECT c.relname, p.polname, p.polcmd, pg_get_expr(polqual, polrelid) AS using_expr
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname IN ('theo_conversations','theo_messages')
ORDER BY c.relname, p.polname;
```

---

## §SM — Primary Reference (deployed `theo_update_project`, byte-identical; owner-scoped UPDATE over theo_projects)
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

## §SM-FJ — Primary Reference function.json (deployed `theo_update_project.function.json`, byte-identical)
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

---

## §HG.1 — `theo_set_project_visibility/index.js` (full, NEW)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const VALID_VISIBILITY = ["private", "group"];

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

  const visibility = typeof body.visibility === "string" ? body.visibility.trim() : "";
  if (!VALID_VISIBILITY.includes(visibility)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'visibility' must be one of 'private' or 'group'.", 400));
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

    // Explicit ownership scope (connection role bypasses RLS): only the project OWNER may change
    // visibility — id AND created_by = the signed-in OID. Group-visible readers cannot re-share.
    const updated = await client.query(
      `
      UPDATE public.theo_projects
      SET visibility = $1, updated_at = now()
      WHERE id = $2 AND created_by = $3
      RETURNING id, visibility
      `,
      [visibility, id, oid]
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

    context.log.error("theo_set_project_visibility failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // CHECK violation (visibility vocabulary), defensive (validated above).
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
## §FJ.1 — `theo_set_project_visibility/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_set_project_visibility"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.2 — `theo_list_projects/index.js` (full, MODIFIED — broadened predicate + visibility/is_owner)
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

    // B5a: return the caller's OWN projects plus any GROUP-VISIBLE project (shared to all authenticated
    // Vault users). Explicit predicate (the shared connection role bypasses RLS; the broadened SELECT
    // policy is the defense layer). `is_owner` lets the FE badge shared-by-others without exposing the
    // owner OID. Newest-updated first (backs the Projects list).
    const result = await client.query(
      `
      SELECT
        id,
        name,
        description,
        instructions,
        app_key,
        visibility,
        (created_by = $1) AS is_owner,
        created_at,
        updated_at
      FROM public.theo_projects
      WHERE created_by = $1 OR visibility = 'group'
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
## §FJ.2 — `theo_list_projects/function.json` (unchanged; re-supplied)
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

## §HG.3 — `theo_list_project_knowledge/index.js` (full, MODIFIED — accessible-project gate)
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

    // B5a: resolve project ACCESS first — owned OR group-visible (explicit predicate; the connection
    // role bypasses RLS, the broadened SELECT policy is defense). Accessible → list; exists but neither
    // owned nor group-visible → 403; absent → 404. No leakage of private projects.
    const access = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND (created_by = $2 OR visibility = 'group')`,
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

    // Knowledge belongs to the project (rows carry the owner's created_by). Access is authorized above,
    // so list ALL of the project's knowledge — a group-visible project shares its knowledge/instructions
    // with members (config-only sharing). No created_by filter here.
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
## §FJ.3 — `theo_list_project_knowledge/function.json` (unchanged; re-supplied)
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

## §HG.4 — `theo_set_conversation_project/index.js` (full, MODIFIED — accessible-project link)
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

  const conversationId = typeof body.conversation_id === "string" ? body.conversation_id.trim() : "";
  if (!isUuid(conversationId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'conversation_id' is required and must be a valid UUID.", 400));
  }
  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
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

    // B5a: the referenced project must be ACCESSIBLE to the caller — owned OR group-visible (the
    // connection role bypasses RLS, so FK existence does NOT prove access). A member may link their
    // OWN conversation to a group-visible project (config-only sharing: their chat, the shared project).
    // Neither owned nor group-visible → 404 (no leakage). The conversation is still owner-scoped below.
    const accessibleProject = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND (created_by = $2 OR visibility = 'group')`,
      [projectId, oid]
    );
    if (accessibleProject.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // Fetch the conversation owner-scoped; 0 rows → 403 (existing-foreign) / 404 (absent) via helper.
    const conv = await client.query(
      `SELECT id, project_id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
      [conversationId, oid]
    );
    if (conv.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [conversationId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this conversation.", 403)
        : buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Set the project link only when currently unset (a conversation belongs to one project, set
    // once). Idempotent: an already-linked conversation returns its current project_id unchanged.
    let resultProjectId = conv.rows[0].project_id;
    if (resultProjectId == null) {
      const updated = await client.query(
        `
        UPDATE public.theo_conversations
        SET project_id = $1, updated_at = now()
        WHERE id = $2 AND created_by = $3 AND project_id IS NULL
        RETURNING project_id
        `,
        [projectId, conversationId, oid]
      );
      resultProjectId = updated.rowCount > 0 ? updated.rows[0].project_id : projectId;
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ conversation_id: conversationId, project_id: resultProjectId }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_set_conversation_project failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // FK violation: project_id not owned or absent (defensive; validated above).
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```
## §FJ.4 — `theo_set_conversation_project/function.json` (unchanged; re-supplied)
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_set_conversation_project"
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
| Region | Primary Reference region (`theo_update_project`) | Classification |
| --- | --- | --- |
| `pg` Pool + `ssl`; `corsHeaders`; `send`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`buildKnownError`/`isUuid` helper block | identical | EXACT |
| OID extraction + 401; `parseBody` + 400; input validation (deterministic 400s) | same discipline; `id` uuid + `visibility` vocabulary (`theo_set_project_visibility`) | ALLOWED DELTA (validated field set) |
| `connect`→`BEGIN`→`set_config` triad (set_project_visibility, set_conversation_project); read-only variants (list_projects, list_project_knowledge) | same triad; the two reads omit BEGIN/COMMIT | ALLOWED DELTA (read-only handlers) |
| Owner-scoped UPDATE — `theo_set_project_visibility`: `UPDATE theo_projects SET visibility=…, updated_at=now() WHERE id AND created_by RETURNING id, visibility` | `UPDATE theo_projects SET … WHERE id AND created_by RETURNING …` | ALLOWED DELTA (column set) |
| Read/link predicate broadening — `created_by = $oid OR visibility = 'group'` (list_projects, list_project_knowledge access gate, set_conversation_project access gate); list_projects adds `visibility`, `(created_by=$1) AS is_owner` | Primary Reference is owner-only; the read-broadening is the cited B5a delta (Architecture §5.2 extension) | ALLOWED DELTA (SELECT-only group extension) |
| 0-row → `theo_project_exists_unscoped` → 403/404 (set_project_visibility); `theo_conversation_exists_unscoped` (set_conversation_project) | identical helper-split idiom | EXACT / ALLOWED DELTA (helper name) |
| `COMMIT` + success envelope | same `{ data, meta }` shape | ALLOWED DELTA (response payload) |
| `catch` ROLLBACK + 42501→403 / 23514→400 / isKnown / 500 | identical mapping | EXACT |
| `function.json` (httpTrigger, anonymous, underscore route) | identical binding shape | EXACT / ALLOWED DELTA (route names; GET vs POST) |

No new external-system helper; no DEVIATION. `theo_message`/`theo_message_stream` + conversations/messages RLS unmodified.

## §PARITY — Golden Handler Standard parity checklist (§5.4)
- [x] Single canonical Primary Reference handler + function.json selected and inlined full-verbatim (§SM/§SM-FJ).
- [x] Structural Mirror Table present, every region classified + anchored (§SM-TABLE).
- [x] Executes as the signed-in user (OID); explicit predicate on every query; RLS (broadened SELECT-only) is the defense layer; writes stay owner-only.
- [x] Reads/writes only `theo_` tables; no `reporting_*`; no gateway-handler change; no tokens/OIDs/URLs leaked.
- [x] Input validated against contract; deterministic 400s before SQL; spec status codes (401/400/403/404/500).
- [x] Additive + reversible migration; no prohibited psql meta-commands in the `sql` fences (plain DDL/SELECT).
- [x] Deterministic golden curls for every endpoint (§CURL); `node --check` clean all four handlers; `function.json` JSON-valid.

---

## §DEPLOY — Walter deploy steps (1 migration + 1 new function + 3 redeployed functions)
1. Run `b5a_migration.sql` (additive column + broadened SELECT policies) against `vaultgpt-postgres-prod`; confirm with `b5a_verify.sql` (read-only).
2. Create `theo_set_project_visibility` (§HG.1 + §FJ.1).
3. **Redeploy** `theo_list_projects` (§HG.2), `theo_list_project_knowledge` (§HG.3), `theo_set_conversation_project` (§HG.4) — each MODIFIED handler needs its own redeploy (the B4d lesson).
4. Reply "B5a backend deployed" → Claude Code runs §CURL.

## §CURL — verification plan (token via `az`; never printed; captured under `.local/`)
Single-identity curls (cross-user group-read is asserted structurally via the broadened predicate; a 2nd identity is not curl-run):
1. **Setup** — `theo_create_project {name:"Visibility Test <ts>"}` → `id=P` (default private).
2. **List baseline** — `theo_list_projects` → P present, `visibility:"private"`, `is_owner:true`.
3. **Set group** — `theo_set_project_visibility {id:P, visibility:"group"}` → **200** `{project:{id:P, visibility:"group"}}`; list again → P `visibility:"group"`.
4. **Validation** — `theo_set_project_visibility {id:P, visibility:"public"}` → 400; `{id:"not-a-uuid", visibility:"group"}` → 400; nonexistent id → 404.
5. **Knowledge on a shared project** — add a knowledge item to P; `theo_list_project_knowledge?projectId=P` → returns it (accessible).
6. **Set private** — `theo_set_project_visibility {id:P, visibility:"private"}` → 200; list → private again.
7. **Cleanup** — `theo_delete_project {id:P}`.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B5a Project Visibility (backend) Pass-1 Backend VEP (plan only).*
