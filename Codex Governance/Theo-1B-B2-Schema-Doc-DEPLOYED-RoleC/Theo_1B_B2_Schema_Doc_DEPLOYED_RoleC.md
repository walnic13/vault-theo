# Role-C Verbatim-Edit Handoff — mark Tier B2 DEPLOYED in the Theo Azure Postgres Schema doc

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Tier B2 is deployed + verified (7 `theo_*` tables, RLS + 4 policies each, 4 `_exists_unscoped` helpers; `theo-content` container in `vaultgptstorage01`). This Role-C updates `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (the data-truth owner) from SKELETON → **DEPLOYED** for the B2 table set: flips the §3 statuses, records the additive columns + Blob container, and adds a §5 DEPLOYED-DDL record citing the canonical committed migration. The verbatim DDL is the version-controlled `b2_migration.sql` (single source of truth — not re-embedded here, to prevent two copies drifting).

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `2b75acb0e08432d71376b9b9a673c01bb203a5fc` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (banner; §3 table set; §4 boundary) | `cat -A` (banner + §3/§4, exact bytes incl. CRLF) this turn | `32edb90e396c0cf1efd3c4659d7818ae01dccad3` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Read(offset=1, limit=30)` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed B2 migration (canonical DDL, referenced) — `Codex Governance/Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/b2_migration.sql` | authored + committed this session (`c74445`) | tracked package file (B2 VEP `6eeafcd`) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDIT 1–3 — Codex applies the §3/banner/§5 edits verbatim |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "created_by text NOT NULL" | the deployed DDL realises the §1 ownership convention (recorded in EDIT 3 §5) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §2 | "Four separate policies per table" | EDIT 1/EDIT 3 — every B2 table verified with 4 policies |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
The schema doc is the `theo_*` data-truth owner; its banner says the DDL "is authored **DEPLOYED** here step-by-step through Phase 1B." Tier B2 has landed (deployed + read-only-verified), so the doc must move the 7 tables from PROPOSED → DEPLOYED, record the as-built additive columns (Walter-approved this session), and reference the canonical deployed DDL. The verbatim DDL lives in the committed `b2_migration.sql` (immutable at its commit); §5 cites it rather than duplicating 247 lines, so there is exactly one authoritative DDL copy (no drift).

## Edit set (3 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT. Target file: `spec/THEO_AZURE_POSTGRES_SCHEMA.md`.

### EDIT 1 — §3 table set: flip statuses to DEPLOYED + record additive columns

**Locate (BEFORE) — found once:**

```
## §3 Structural Table Set (architecture §5.3; DDL finalized in 1B)

| Table | Purpose | Notes | Status |
|-------|---------|-------|--------|
| `theo_conversations` | Chat thread | `app_key text NULL`, `app_context jsonb NULL`, `project_id uuid NULL`, `title`, `model`. The app-context primitive lives here. | PROPOSED — DDL 1B |
| `theo_messages` | Turn within a thread | `conversation_id` FK ON DELETE CASCADE; `role`, `content`, `model`, ordering key. Immutable — no `updated_at`. | PROPOSED — DDL 1B |
| `theo_projects` | Project (instructions + knowledge scope) | `name`, `instructions`, optional `app_key` scope. | PROPOSED — DDL 1B |
| `theo_project_knowledge` | Knowledge source under a project | `project_id` FK ON DELETE CASCADE; source pointer/title/type. RAG-indexed. | PROPOSED — DDL 1B |
| `theo_artifacts` | Artifact record | Optional `conversation_id` / `project_id`; `title`, `type`, current-version pointer. | PROPOSED — DDL 1B |
| `theo_artifact_versions` | Versioned artifact content | `artifact_id` FK ON DELETE CASCADE; `version_number`, `content`. Immutable version rows. | PROPOSED — DDL 1B |
| `theo_user_settings` | Per-user style + custom instructions (Customize) | Text PK = Entra OID. Prepended to system prompt. | PROPOSED — DDL 1B |
| `theo_apps` / `theo_app_tools` *(candidate)* | Registry of apps + Theo-callable endpoints (backs the Tool Manifest) | May start as config rather than tables; 1B decides (architecture §9 open item 1). | CANDIDATE — 1B decision |

`app_key` begins as a CHECK-constrained closed set; promotable to an FK'd app registry when app count warrants.
```

**Replace with (AFTER):**

```
## §3 Structural Table Set (DDL DEPLOYED — Tier B2, §5)

| Table | Purpose | Notes | Status |
|-------|---------|-------|--------|
| `theo_conversations` | Chat thread | `app_key text NULL`, `app_context jsonb NULL`, `project_id uuid NULL` FK→`theo_projects` ON DELETE SET NULL, `title`, `model`. The app-context primitive lives here. | DEPLOYED — B2 (§5) |
| `theo_messages` | Turn within a thread | `conversation_id` FK ON DELETE CASCADE; `seq` (ordering key, UNIQUE per conversation), `role` (CHECK user/assistant), `content`, `model`, `citations jsonb NULL` (web-grounding citations). Immutable — no `updated_at`. | DEPLOYED — B2 (§5) |
| `theo_projects` | Project (instructions + knowledge scope) | `name` (CHECK not-blank), `instructions`, optional `app_key`. | DEPLOYED — B2 (§5) |
| `theo_project_knowledge` | Knowledge source under a project | `project_id` FK ON DELETE CASCADE; `title`, `source_type` (CHECK text/file); inline `content` OR Blob pointer (`blob_container`/`blob_path`/`byte_size`/`content_type`). RAG-indexed. Immutable. | DEPLOYED — B2 (§5) |
| `theo_artifacts` | Artifact record | Optional `conversation_id` / `project_id` (FK ON DELETE SET NULL); `title`, `type` (CHECK document/code/html), `current_version int`. | DEPLOYED — B2 (§5) |
| `theo_artifact_versions` | Versioned artifact content | `artifact_id` FK ON DELETE CASCADE; `version_number` (UNIQUE per artifact); content via Blob pointer (`blob_container`/`blob_path`/`byte_size`/`content_type`). Immutable. | DEPLOYED — B2 (§5) |
| `theo_user_settings` | Per-user style + custom instructions (Customize) | Text PK = Entra OID (`user_oid`); `style_key` (CHECK), `custom_instructions`. RLS keys on `user_oid = auth.uid()`. Prepended to system prompt. | DEPLOYED — B2 (§5) |
| `theo_apps` / `theo_app_tools` *(candidate)* | Registry of apps + Theo-callable endpoints (backs the Tool Manifest) | May start as config rather than tables; 1B decides (architecture §9 open item 1). | CANDIDATE — 1B decision |

`app_key` is **`text NULL` (no CHECK)** as deployed in B2 (Walter-approved 2026-06-27) — free-text, promotable to a CHECK-constrained closed set / FK'd app registry once the app set settles.
```

### EDIT 2 — banner: record B2 DEPLOYED

**Locate (BEFORE) — found once:**

```
> **Status: v0.1 SKELETON — header only; DDL finalized in Phase 1B.** This document fixes the `theo_` conventions, the RLS baseline, and the structural table set so 1A can build against contracts shaped to it and 1B has a settled target. The concrete `CREATE TABLE` / policy / function DDL is authored **DEPLOYED** here step-by-step through Phase 1B (architecture §8.4). The content below is relocated from `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §5 and **has been reconciled against the now-landed canonical architecture doc** (delivered byte-preserving; the §5.1 conventions, §5.2 RLS baseline, and §5.3 table set match). No DDL is invented here.
```

**Replace with (AFTER):**

```
> **Status: v0.2 — Tier B2 DEPLOYED (2026-06-27).** This document fixes the `theo_` conventions, the RLS baseline, and the structural table set, and records the concrete `CREATE TABLE` / policy / function DDL as each Phase 1B tier deploys (architecture §8.4). **Tier B2** (the 7-table persistence substrate + RLS + `_exists_unscoped` helpers) is **DEPLOYED + read-only-verified** — see §5; remaining tiers (B3+ handlers, memory layer) accrete here as they land. The §1 conventions, §2 RLS baseline, and §3 table set are reconciled byte-preserving against `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §5. No DDL is invented; the canonical deployed DDL is the version-controlled migration cited in §5.
```

### EDIT 3 — append §5 (DEPLOYED DDL record for Tier B2)

**Locate (BEFORE) — found once:**

```
Theo tables are net-new and additively namespaced in the shared `vaultgpt` instance. Theo MUST NOT read or write Corporate Reporting (`reporting_*`) tables directly (architecture §0a/§1.3/§4.3). Legacy early-Theo tables (`conversations`, `chat_messages`, `theo_users`, etc.) are NOT preserved/migrated and MUST NOT be built on or dropped without explicit Walter direction (architecture §7).
```

**Replace with (AFTER):**

````
Theo tables are net-new and additively namespaced in the shared `vaultgpt` instance. Theo MUST NOT read or write Corporate Reporting (`reporting_*`) tables directly (architecture §0a/§1.3/§4.3). Legacy early-Theo tables (`conversations`, `chat_messages`, `theo_users`, etc.) are NOT preserved/migrated and MUST NOT be built on or dropped without explicit Walter direction (architecture §7).

## §5 DEPLOYED DDL — Tier B2 (2026-06-27)

**Status:** DEPLOYED + read-only-verified against the shared `vaultgpt-postgres-prod` instance (schema `public`). Verification (catalog read-only): 7 `theo_*` tables present, each with RLS enabled + 4 policies; 4 `_exists_unscoped` helpers (`theo_project`, `theo_conversation`, `theo_project_knowledge`, `theo_artifact`). Blob container `theo-content` created in storage account `vaultgptstorage01` (UK South).

**Canonical DDL (single source of truth):** the verbatim, Walter-executed migration is the version-controlled file
`Codex Governance/Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/b2_migration.sql` (committed `c74445`; authored in the B2 VEP §B2-DDL, Codex-APPROVED at `6eeafcd`). It is **not duplicated here** to avoid two divergent copies; that migration is the authoritative deployed DDL. Read-only verification queries: `…/b2_verify.sql`.

**As-built specifics (mirrors the corporate-reporting ownership-RLS pattern):**
- Conventions (§1): `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`, `created_by text NOT NULL` (Entra OID), `created_at`/`updated_at timestamptz NOT NULL DEFAULT now()`; immutable tables (`theo_messages`, `theo_project_knowledge`, `theo_artifact_versions`) omit `updated_at`.
- RLS (§2): every table RLS-enabled with four `TO authenticated` policies keyed on `auth.uid()` — SELECT `USING`-only, INSERT `WITH CHECK`-only, UPDATE `USING`+`WITH CHECK`, DELETE `USING`-only; policy names `theo_<entity>_<verb>_own`. `theo_user_settings` keys on its `user_oid` PK. `auth.uid()` + per-request `set_config` session context pre-exist in the shared instance (handlers set context in B3+).
- Helpers (§1): `theo_<entity>_exists_unscoped(p_id uuid) RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public` + `GRANT EXECUTE … TO authenticated`, for the four tables supporting individual update/delete (projects, conversations, project_knowledge, artifacts). Immutable + cascade-only tables and the upsert-by-PK settings table carry no helper.
- Additive vs the §3 column sketch (Walter-approved 2026-06-27): `theo_messages.seq` (ordering key) + `theo_messages.citations jsonb` (web-grounding citations); Blob-pointer columns on `theo_artifact_versions` (content body) + `theo_project_knowledge` (large content) per D-5; `app_key text NULL` with no CHECK (free-text, promotable).
- Boundary: no `reporting_*` object touched; the legacy `theo_users`/`conversations`/`chat_messages` tables are untouched (decommission is a separate Walter ops task).
````

## Note
Three edits to one file (`spec/THEO_AZURE_POSTGRES_SCHEMA.md`): §3 statuses + notes (EDIT 1), banner (EDIT 2), append §5 DEPLOYED record (EDIT 3). The §5 AFTER is wrapped in a four-backtick fence so its inner formatting is preserved on paste. No DDL re-embedding (canonical copy = the committed migration). No `reporting_*` change.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B2-Schema-Doc-DEPLOYED-RoleC/Theo_1B_B2_Schema_Doc_DEPLOYED_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-B2-Schema-Doc-DEPLOYED-RoleC/Theo_1B_B2_Schema_Doc_DEPLOYED_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-B2-Schema-Doc-DEPLOYED Role-C. Apply EDIT 1–3 to `spec/THEO_AZURE_POSTGRES_SCHEMA.md` verbatim (each BEFORE anchor found exactly once; HALT on any mismatch). One file, three edits — §3 statuses, banner, append §5."*

*End of Role-C Verbatim-Edit Handoff.*
