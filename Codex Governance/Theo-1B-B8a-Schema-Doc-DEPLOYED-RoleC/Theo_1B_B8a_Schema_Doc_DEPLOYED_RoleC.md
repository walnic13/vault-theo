# Role-C Verbatim-Edit Handoff — Schema Doc: record `theo_attachments` DEPLOYED (Tier B8a)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Records the **deployed + read-only-verified** `theo_attachments` table (Tier B8a; Attachments substrate) in `spec/THEO_AZURE_POSTGRES_SCHEMA.md` — a §3 DEPLOYED row + a new §7 deployed-DDL record, mirroring how §5 documents Tier B2 and §6 documents Tier B7a. Three verbatim edits; no existing row/DDL changed. The migration was Codex-APPROVED and run by Walter; catalog verification captured under `.local/b8a_verify_evidence.txt`.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `1ed4f083ca2a871649953ebd46f7ea5fee053bfc` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 table set; §5/§6 deployed-DDL records) | `Read(offset=1/25/59)` + `Grep("theo_user_memory")` this turn | `95538419e01ff95d20342e6b65d97c332912c614` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed migration (source of the recorded DDL) — `Codex Governance/Theo-1B-B8a-Attachments-Schema-Pass-1-VEP/b8a_migration.sql` | `Read(full)` this turn | `cc61acf1bbb2187260fd88232b92e445141ea395` (Codex-APPROVED; deployed + RO-verified) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDITs 1–3 — Codex applies verbatim |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Structural Table Set" | EDIT 1/2 — §3 header + `theo_attachments` row |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
Tier B8a (`theo_attachments`) is deployed and read-only-verified (table + RLS-enabled + 4 ownership policies keyed on `created_by = auth.uid()` + `theo_attachment_exists_unscoped(uuid)` SECURITY DEFINER helper + the `byte_size >= 0` / non-empty-`filename` CHECKs + FK `conversation_id → theo_conversations` ON DELETE SET NULL). The schema doc (truth owner for deployed DB state) must record it so the doc reflects deployed reality (the same discipline applied for B2 in §5 and B7a in §6). Additive only.

## Edit set (3 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT. Target repo: `vault-theo`. Target file: `spec/THEO_AZURE_POSTGRES_SCHEMA.md`.

### EDIT 1 — §3 header: note Tier B8a
**Locate (BEFORE) — found once:**
```
## §3 Structural Table Set (DDL DEPLOYED — Tier B2 §5; Tier B7a §6)
```
**Replace with (AFTER):**
```
## §3 Structural Table Set (DDL DEPLOYED — Tier B2 §5; Tier B7a §6; Tier B8a §7)
```

### EDIT 2 — §3: add the `theo_attachments` DEPLOYED row
**Locate (BEFORE) — found once:**
```
| `theo_user_memory` | Distilled per-user memory (Memory Layer, option C) | `scope text` (`'user'`\|`'project'`), `project_id uuid NULL` FK→`theo_projects` ON DELETE CASCADE, `kind text`, `content text` (non-empty), `source_conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `salience int`. CHECK: `scope='project'` iff `project_id` set. Mutable. Injected at system-prompt assembly. | DEPLOYED — B7a (§6) |
```
**Replace with (AFTER):**
```
| `theo_user_memory` | Distilled per-user memory (Memory Layer, option C) | `scope text` (`'user'`\|`'project'`), `project_id uuid NULL` FK→`theo_projects` ON DELETE CASCADE, `kind text`, `content text` (non-empty), `source_conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `salience int`. CHECK: `scope='project'` iff `project_id` set. Mutable. Injected at system-prompt assembly. | DEPLOYED — B7a (§6) |
| `theo_attachments` | File attached to a chat (Attachments, Tier B8) | `conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `filename text` (non-empty CHECK), `content_type text`, `byte_size bigint` (CHECK `>= 0`), `blob_container`/`blob_path` (pointer into the existing `theo-content` container). Immutable — no `updated_at`. Body lives in Blob; the row holds only the pointer. | DEPLOYED — B8a (§7) |
```

### EDIT 3 — add §7 deployed-DDL record (after the §6 as-built bullet)
**Locate (BEFORE) — found once:**
```
**As-built specifics (mirrors the §5 ownership-RLS idiom):** `theo_user_memory` is the distilled per-user memory profile (Memory Layer option C). Columns: `scope text` (`'user'`|`'project'`), `project_id uuid NULL` FK→`theo_projects` ON DELETE CASCADE, `kind text`, `content text` (non-empty CHECK), `source_conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `salience int`, plus `id`/`created_by`/`created_at`/`updated_at` per §1 (mutable — carries `updated_at`). Per-user isolation is ALSO enforced by explicit `created_by = $oid` predicates in the B7a CRUD handlers (the shared Functions connection role bypasses RLS — see the SEC user-isolation fix); RLS is the defence-in-depth second layer. Boundary: net-new additive table; no `reporting_*` touched.
```
**Replace with (AFTER):**
```
**As-built specifics (mirrors the §5 ownership-RLS idiom):** `theo_user_memory` is the distilled per-user memory profile (Memory Layer option C). Columns: `scope text` (`'user'`|`'project'`), `project_id uuid NULL` FK→`theo_projects` ON DELETE CASCADE, `kind text`, `content text` (non-empty CHECK), `source_conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `salience int`, plus `id`/`created_by`/`created_at`/`updated_at` per §1 (mutable — carries `updated_at`). Per-user isolation is ALSO enforced by explicit `created_by = $oid` predicates in the B7a CRUD handlers (the shared Functions connection role bypasses RLS — see the SEC user-isolation fix); RLS is the defence-in-depth second layer. Boundary: net-new additive table; no `reporting_*` touched.

## §7 DEPLOYED DDL — Tier B8a (2026-06-28)

**Status:** DEPLOYED + read-only-verified against `vaultgpt-postgres-prod` (schema `public`). Verification (catalog read-only): `theo_attachments` present, RLS enabled with four `TO authenticated` policies keyed on `created_by = auth.uid()` (`theo_attachment_<verb>_own`); `theo_attachment_exists_unscoped(uuid)` SECURITY DEFINER helper present; constraints — `conversation_id` FK→`theo_conversations(id)` ON DELETE SET NULL, `byte_size >= 0`, `filename` non-empty.

**Canonical DDL (single source of truth):** `Codex Governance/Theo-1B-B8a-Attachments-Schema-Pass-1-VEP/b8a_migration.sql` (Codex-APPROVED; deployed by Walter); read-only verification `…/b8a_verify.sql`. Not duplicated here.

**As-built specifics (mirrors the §5 ownership-RLS idiom):** `theo_attachments` is the storage substrate for files a user attaches to a chat (Attachments, Tier B8). Columns: `conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL (an attachment survives deletion of its chat), `filename text` (non-empty CHECK), `content_type text`, `byte_size bigint` (CHECK `>= 0`), `blob_container`/`blob_path` (pointer into the existing `theo-content` Blob container), plus `id`/`created_by`/`created_at` per §1. Immutable file metadata — no `updated_at`. The file body lives in Blob; the row holds only the pointer. Per-user isolation is enforced by RLS (this table) AND by explicit `created_by = $oid` predicates in the Tier B8 handlers (next microsteps). Boundary: net-new additive table; no `reporting_*` touched.
```

## Note
Three verbatim edits to one file (`spec/THEO_AZURE_POSTGRES_SCHEMA.md`): §3 header annotation, the `theo_attachments` §3 row, and the new §7 deployed-DDL record. No existing row or §5/§6 content changed. Records deployed + verified reality.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B8a-Schema-Doc-DEPLOYED-RoleC/Theo_1B_B8a_Schema_Doc_DEPLOYED_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-B8a-Schema-Doc-DEPLOYED-RoleC/Theo_1B_B8a_Schema_Doc_DEPLOYED_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-B8a-Schema-Doc-DEPLOYED Role-C. Apply EDITs 1–3 to `spec/THEO_AZURE_POSTGRES_SCHEMA.md` verbatim (each BEFORE anchor found exactly once; HALT on mismatch): §3 header annotation, the `theo_attachments` §3 DEPLOYED row, and the new §7 Tier-B8a deployed-DDL record. Additive only."*

*End of Role-C Verbatim-Edit Handoff.*
