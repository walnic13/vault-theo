# Theo — Backend: get-or-create a project keyed to an external ref (`theo_get_or_create_review_project`) — Pass-1 VEP

Controlling artifact for Codex review. Self-contained: the migration `migration_theo_projects_source_ref.sql`, one new handler `theo_get_or_create_review_project.{index.js,function.json}`, and the deployed Primary Reference `primary-reference/theo_create_project.{index.js,function.json}`. Part 3 of the #5 custom-Theo-dock program (project-scoped review chats). So a review's chats live in a **stable per-review Theo project**, a host app (Sigma's review dock) needs each durable external entity — a K-1 review, keyed by `sigma_review_id` — to map to exactly ONE Theo project, idempotently. This adds a nullable `theo_projects.source_ref` + a partial unique index on `(created_by, app_key, source_ref)`, and a get-or-create handler (`INSERT … ON CONFLICT DO UPDATE`) that returns the same project on every later call. Generic (any `app_key` may key a project to its own ref); owner-scoped; mirrors `theo_create_project`. Reviewer: Codex.

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: fb727cedb486b871b4375515f6cdb3619e0b09af (vault-theo development; the commit that first adds this package — artifact-presence probe resolves there and at every later commit)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P6
```

Current-turn grounding (concrete tool calls this turn): Read the deployed Primary Reference `Codex Governance/Theo-1B-B4a-Projects-CRUD-Handlers-Pass-1-VEP/theo_create_project.{index.js,function.json}` (inlined verbatim as `primary-reference/`); `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §5 (`theo_projects` — `name` CHECK not-blank, `instructions`, optional `app_key`; owner-scoped RLS; `theo_conversations.project_id` FK) — confirmed **no `source_ref`** today; `spec/THEO_API_SPEC.md` §2.2 (the deployed `theo_list/create/update/delete_project` contracts + column set); `governance/THEO_GOLDEN_HANDLER_STANDARD.md` §5.1/§5.2; `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` §3/§6; `node --check` clean on `theo_get_or_create_review_project.index.js`.

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
| ----------------- | --------- | -------------------- | -------------------- |
| spec/THEO_API_SPEC.md | §2.2 | "backs Projects surface" | Contract (P4): finalizes the new §2.2 get-or-create operation (post-deploy Role-C) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §5 | "Project (instructions + knowledge scope)" | schema grounding (P3): `theo_projects` gains the PROPOSED `source_ref` column + partial unique index |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.1 | "EXACT / ALLOWED DELTA / DEVIATION" | Structural Mirror Table (P5) below |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.2 | "Migration files carry no top-level transaction control" | `migration_theo_projects_source_ref.sql` (P6): idempotent `ALTER`/`CREATE INDEX`, no `BEGIN`/`COMMIT` |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §6 | "never executed by Claude Code" | the migration is Walter-executable (P6); Claude Code never runs it |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "DEPLOYED vs PROPOSED is a classification, not an assumption" | schema grounding (P3): `theo_projects.source_ref` is PROPOSED (this migration); every other object DEPLOYED |

## Purpose

The Sigma review dock (Theo · Review assistant) should keep each review's chats in **its own project** and let the user start multiple chats within that project (Walter 2026-07-16). Theo owns projects/conversations (the §1 boundary), and `theo_conversations` already carries `project_id` + the after-first-turn `theo_set_conversation_project` link — but there is **no way to map a review to a durable project**: `createProject` always inserts a new row (no idempotency key), so arming the same review twice would spawn duplicate projects. This VEP adds the missing key + a race-safe get-or-create, so the FE (5.3b, next) can, on review arm, resolve the one project for `sigma_review_id` and scope the drawer to it. Robust for hundreds of funds (Walter's standard) — not a fragile FE name-match.

## Scope

- **In scope:** one migration (`ALTER TABLE public.theo_projects ADD COLUMN IF NOT EXISTS source_ref text` + a partial unique index `theo_projects_owner_app_ref_uk` on `(created_by, app_key, source_ref) WHERE source_ref IS NOT NULL` + a column comment); one new handler `theo_get_or_create_review_project` `{ app_key, source_ref, name, description?, instructions? }` → get-or-create keyed on `(created_by, app_key, source_ref)` via `INSERT … ON CONFLICT DO UPDATE SET updated_at`, returning `{ project }` (201 created / 200 existing). Deploy target: existing `vaultgpt-func-premium` (Kudu VFS PUT — `pg` present, no new deps — then restart), AFTER Walter runs the migration. Post-deploy Role-C adds the operation to `THEO_API_SPEC` §2.2 + `THEO_AZURE_POSTGRES_SCHEMA` §5 (`theo_projects.source_ref`).
- **Out of scope (5.3b, separate FE package):** the Theo-FE arming — on review arm call the new endpoint (`app_key='sigma'`, `source_ref=sigma_review_id`, `name='<fund> · <period>'`), `startInProject(project.id)`, and scope the ☰ drawer recents to that `project_id`; new chats stay in the project (existing `theo_set_conversation_project` after first turn). No change to `theo_create_project` or the other CRUD handlers.

## Contract (P4) — new `THEO_API_SPEC` §2.2 operation (post-deploy Role-C)

- `POST /api/theo_get_or_create_review_project` `{ app_key (string, 1–200), source_ref (string, 1–200), name (string, 1–200), description? (string ≤500), instructions? (string ≤8000) }` → **201** `{ data: { project } }` (created) / **200** `{ data: { project } }` (existing — matched on `(created_by, app_key, source_ref)`). `project` = `{ id, name, description, instructions, app_key, source_ref, created_at, updated_at }`. On an existing project the `ON CONFLICT DO UPDATE` touches only `updated_at`, so a **user-renamed** project keeps its name (description/instructions are used only on create). Owner-scoped (`created_by = OID`).
- Errors: missing identity → **401**; missing/blank/over-long `app_key`/`source_ref`/`name` → **400 INVALID_REQUEST**; field-constraint violation → **400** (`23514`); RLS denial → **403** (`42501`); upstream → **500**.

## Gap Register (P2.5)

**PROCEED.** (1) The `THEO_API_SPEC` §2.2 + `THEO_AZURE_POSTGRES_SCHEMA` §5 doc updates are a post-deploy Role-C (not this turn) — future-trigger, PROCEED; the 5.3b FE package is gated on that Role-C (the route must be a spec row at HEAD before the FE cites it). (2) The endpoint is generic — `app_key` is caller-supplied free-text (matching the deployed `app_key text NULL, no CHECK` posture); a review is just the first consumer (`app_key='sigma'`, `source_ref=sigma_review_id`). (3) `created`-vs-existing is derived from `xmax = 0` on the `RETURNING` row (Postgres upsert idiom) to pick 201 vs 200; both return the project — the FE treats them identically. (4) Existing projects (`source_ref` NULL) are unconstrained by the partial index — no backfill, no behavior change to `theo_create_project`. Disclosed, PROCEED. No PRE-LAND/ESCALATE.

## Architecture & boundary reconciliation (P2)

Single classic Azure Functions handler on `vaultgpt-func-premium`, `pg` `Pool`, EasyAuth principal → OID → `set_config` triad → owner-scoped `INSERT … ON CONFLICT` in one BEGIN/COMMIT. Identical boundary to `theo_create_project`; the only behavioral difference is the `source_ref` key + the `ON CONFLICT DO UPDATE` get-or-create (vs a plain INSERT) + the two extra required inputs (`app_key`, `source_ref`). No new dependency, table, function, or env var. Theo still owns projects/conversations; Sigma consumes the returned `project.id` via app_context (§1 boundary intact — Sigma never writes `theo_*`).

## Schema grounding (P3)

- `public.theo_projects` — **DEPLOYED** (B2; §5). Gains one **PROPOSED** column `source_ref text` (nullable; no default) + one **PROPOSED** partial unique index `theo_projects_owner_app_ref_uk`. No RLS change (the deployed owner-scoped policies govern the row). Migration idempotent (`ADD COLUMN IF NOT EXISTS` + `CREATE UNIQUE INDEX IF NOT EXISTS`).
- No other object touched. DEPLOYED vs PROPOSED asserted from this-turn reads of `THEO_AZURE_POSTGRES_SCHEMA` §5 (Governor §3 Never-Guess).

## Handler grounding (P5) — Primary Reference + Structural Mirror Table

**Primary Reference:** the deployed `theo_create_project` (`primary-reference/theo_create_project.{index.js,function.json}`, byte-faithful). Single, non-composite.

| Region (`theo_get_or_create_review_project`) | Primary Reference region (`theo_create_project`) | Classification |
|---|---|---|
| `pg` Pool + `corsHeaders` (POST/OPTIONS) + `send`/`nowIso`/`errorBody`/`successBody` + `getPrincipal`/`getClaimValue`/`parseBody` | same helpers | EXACT |
| OPTIONS 204; OID→401; body-parse→400 | same | EXACT |
| `name`/`description`/`instructions` validation (same limits) | same | EXACT |
| `app_key` **required** (non-blank, ≤200) + `source_ref` **required** (non-blank, ≤200) validation | `app_key` optional (nullable) in create | ALLOWED DELTA (two inputs promoted to required + a new required `source_ref`, same deterministic-400 idiom) |
| BEGIN + `set_config` triad | same | EXACT |
| `INSERT … (created_by,name,description,instructions,app_key,source_ref) VALUES(…) ON CONFLICT (created_by,app_key,source_ref) WHERE source_ref IS NOT NULL DO UPDATE SET updated_at=now() RETURNING …, (xmax=0) AS created` | `INSERT … (created_by,name,description,instructions,app_key) VALUES(…) RETURNING …` | ALLOWED DELTA (adds the `source_ref` column + the idempotent `ON CONFLICT` upsert on the new partial unique index; same owner-scoped INSERT) |
| 201-vs-200 from `created` (`xmax=0`); COMMIT; `{ project }` | 201; COMMIT; `{ project }` | ALLOWED DELTA (get-or-create returns 200 for the existing-row path) |
| catch: `42501`→403, `23514`→400, else 500; ROLLBACK; `release()` | same | EXACT |

No DEVIATION. `node --check` clean this turn.

## SQL grounding (P6) — Walter-executable migration

`migration_theo_projects_source_ref.sql` (in this package; Walter executes as `pgadmin_vault`, Governor §6). No top-level transaction control (Golden Handler §5.2); idempotent; no psql meta-commands:

```sql
alter table public.theo_projects
  add column if not exists source_ref text;

create unique index if not exists theo_projects_owner_app_ref_uk
  on public.theo_projects (created_by, app_key, source_ref)
  where source_ref is not null;
```

(+ a `comment on column`.) Post-migration read-only verification (V1): `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='theo_projects' AND column_name='source_ref';` → one row; and `SELECT indexname FROM pg_indexes WHERE tablename='theo_projects' AND indexname='theo_projects_owner_app_ref_uk';` → one row.

## Golden curls (P7) — run on deploy (Claude Code)

Token per Golden Handler §5.5 (never printed). Against `vaultgpt-func-premium`:
1. `POST /api/theo_get_or_create_review_project {app_key:'sigma', source_ref:'<uuidA>', name:'LG OPP · 2026-Q2'}` → **201**; capture `project.id`.
2. Repeat the identical call → **200**; `project.id` **equals** the 201 id (idempotent get-or-create; no duplicate row).
3. `POST {app_key:'sigma', source_ref:'<uuidB>', name:'Other · 2026-Q2'}` → **201**; a **different** id (distinct source_ref → distinct project).
4. Validation: missing `app_key`/`source_ref`/`name` → **400** each; no `Authorization` → **401**.
5. Isolation: a second identity get-or-creating the same `source_ref` gets its **own** project (owner-scoped key includes `created_by`).

## VEP assembly (P8)

Package = this INDEX + `migration_theo_projects_source_ref.sql` + `theo_get_or_create_review_project.{index.js,function.json}` + `primary-reference/theo_create_project.{index.js,function.json}`. Lint PASS (below). On APPROVED: **(1)** Walter runs the migration; **(2)** Claude Code deploys the handler to `vaultgpt-func-premium` via Kudu VFS PUT + restart; **(3)** runs the golden curls; **(4)** a Role-C adds the operation to `THEO_API_SPEC` §2.2 + `theo_projects.source_ref` to `THEO_AZURE_POSTGRES_SCHEMA` §5. The 5.3b Theo-FE package (arm the project on review + scope the drawer) then cites the route.

## Mechanical lint

Command: `node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-Review-Project-GetOrCreate-Pass-1-VEP/INDEX.md" --repo-root .`

Expect `PASS` and exit `0`.

## Requested action

Codex Pass-2 review against the Theo Backend Governor + Golden Handler Standard. Plan-only; no migration run, no code deployed. On APPROVED, Claude Code executes the P8 sequence (migration handoff → deploy → golden curls → Role-C). Then the 5.3b FE package (project-scoped review chats).
