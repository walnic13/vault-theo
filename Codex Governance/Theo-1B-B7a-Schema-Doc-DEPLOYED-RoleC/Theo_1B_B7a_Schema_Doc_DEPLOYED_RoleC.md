# Role-C Verbatim-Edit Handoff — Schema Doc: record `theo_user_memory` DEPLOYED (Tier B7a)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Records the **deployed + read-only-verified** `theo_user_memory` table (Tier B7a; option C) in `spec/THEO_AZURE_POSTGRES_SCHEMA.md` — a §3 DEPLOYED row + a new §6 deployed-DDL record, mirroring how §5 documents Tier B2. Three verbatim edits; no existing row/DDL changed. The migration was Codex-APPROVED at `631c9a54` and run by Walter; catalog verification captured under `.local/b7a_schema_verify_result_2026-06-28.txt`.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `286fc3cc104da8a0816a61975aa166d9c32cdb41` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 table set; §5 deployed-DDL record) | `Read(offset=25/44/56)` + `Grep("theo_user_settings")` this turn | `2c9d013b9bbff00c8023a8a19497bbab5f97a4f7` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed migration (source of the recorded DDL) — `Codex Governance/Theo-1B-B7a-Memory-Substrate-Schema-Pass-1-VEP/b7a_migration.sql` | `Read(full)` this turn | `bbb66f45d5b598bf104499f32b3812af41c64e26` (B7a package; Codex-APPROVED 631c9a54) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDITs 1–3 — Codex applies verbatim |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Structural Table Set" | EDIT 1/2 — §3 header + `theo_user_memory` row |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
Tier B7a (`theo_user_memory`) is deployed and read-only-verified (table + RLS-enabled + 4 ownership policies keyed on `created_by = auth.uid()` + `theo_user_memory_exists_unscoped` helper + the content/scope/scope-project CHECKs). The schema doc (truth owner for deployed DB state) must record it so the doc reflects deployed reality (the same discipline applied for B2 in §5). Additive only.

## Edit set (3 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT. Target repo: `vault-theo`. Target file: `spec/THEO_AZURE_POSTGRES_SCHEMA.md`.

### EDIT 1 — §3 header: note Tier B7a
**Locate (BEFORE) — found once:**
```
## §3 Structural Table Set (DDL DEPLOYED — Tier B2, §5)
```
**Replace with (AFTER):**
```
## §3 Structural Table Set (DDL DEPLOYED — Tier B2 §5; Tier B7a §6)
```

### EDIT 2 — §3: add the `theo_user_memory` DEPLOYED row
**Locate (BEFORE) — found once:**
```
| `theo_user_settings` | Per-user style + custom instructions (Customize) | Text PK = Entra OID (`user_oid`); `style_key` (CHECK), `custom_instructions`. RLS keys on `user_oid = auth.uid()`. Prepended to system prompt. | DEPLOYED — B2 (§5) |
```
**Replace with (AFTER):**
```
| `theo_user_settings` | Per-user style + custom instructions (Customize) | Text PK = Entra OID (`user_oid`); `style_key` (CHECK), `custom_instructions`. RLS keys on `user_oid = auth.uid()`. Prepended to system prompt. | DEPLOYED — B2 (§5) |
| `theo_user_memory` | Distilled per-user memory (Memory Layer, option C) | `scope text` (`'user'`\|`'project'`), `project_id uuid NULL` FK→`theo_projects` ON DELETE CASCADE, `kind text`, `content text` (non-empty), `source_conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `salience int`. CHECK: `scope='project'` iff `project_id` set. Mutable. Injected at system-prompt assembly. | DEPLOYED — B7a (§6) |
```

### EDIT 3 — add §6 deployed-DDL record (after the §5 boundary bullet)
**Locate (BEFORE) — found once:**
```
- Boundary: no `reporting_*` object touched; the legacy `theo_users`/`conversations`/`chat_messages` tables are untouched (decommission is a separate Walter ops task).
```
**Replace with (AFTER):**
```
- Boundary: no `reporting_*` object touched; the legacy `theo_users`/`conversations`/`chat_messages` tables are untouched (decommission is a separate Walter ops task).

## §6 DEPLOYED DDL — Tier B7a (2026-06-28)

**Status:** DEPLOYED + read-only-verified against `vaultgpt-postgres-prod` (schema `public`). Verification (catalog read-only): `theo_user_memory` present, RLS enabled with four `TO authenticated` policies keyed on `created_by = auth.uid()`; `theo_user_memory_exists_unscoped(uuid)` helper present; CHECKs — `content` non-empty, `scope IN ('user','project')`, and `scope='project'` iff `project_id IS NOT NULL`.

**Canonical DDL (single source of truth):** `Codex Governance/Theo-1B-B7a-Memory-Substrate-Schema-Pass-1-VEP/b7a_migration.sql` (Codex-APPROVED at `631c9a54`); read-only verification `…/b7a_verify.sql`. Not duplicated here.

**As-built specifics (mirrors the §5 ownership-RLS idiom):** `theo_user_memory` is the distilled per-user memory profile (Memory Layer option C). Columns: `scope text` (`'user'`|`'project'`), `project_id uuid NULL` FK→`theo_projects` ON DELETE CASCADE, `kind text`, `content text` (non-empty CHECK), `source_conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `salience int`, plus `id`/`created_by`/`created_at`/`updated_at` per §1 (mutable — carries `updated_at`). Per-user isolation is ALSO enforced by explicit `created_by = $oid` predicates in the B7a CRUD handlers (the shared Functions connection role bypasses RLS — see the SEC user-isolation fix); RLS is the defence-in-depth second layer. Boundary: net-new additive table; no `reporting_*` touched.
```

## Note
Three verbatim edits to one file (`spec/THEO_AZURE_POSTGRES_SCHEMA.md`): §3 header annotation, the `theo_user_memory` §3 row, and the new §6 deployed-DDL record. No existing row or §5 content changed. Records deployed + verified reality.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B7a-Schema-Doc-DEPLOYED-RoleC/Theo_1B_B7a_Schema_Doc_DEPLOYED_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-B7a-Schema-Doc-DEPLOYED-RoleC/Theo_1B_B7a_Schema_Doc_DEPLOYED_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-B7a-Schema-Doc-DEPLOYED Role-C. Apply EDITs 1–3 to `spec/THEO_AZURE_POSTGRES_SCHEMA.md` verbatim (each BEFORE anchor found exactly once; HALT on mismatch): §3 header annotation, the `theo_user_memory` §3 DEPLOYED row, and the new §6 Tier-B7a deployed-DDL record. Additive only."*

*End of Role-C Verbatim-Edit Handoff.*
