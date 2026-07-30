# Role-C Verbatim-Edit Handoff — record Shared Project Workspace Phase 2a (Publish-to-Project) DEPLOYED in the Theo Azure Postgres Schema doc

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. SPW Phase 2a is deployed + read-only-verified (three publish columns on `theo_conversations`; the partial published index; three broadened RLS policies carrying the publish + project-membership branch; the five owner-only policies untouched; RLS enabled on both tables). This Role-C updates `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (the data-truth owner) by **appending a new `## §11` DEPLOYED-DDL section** recording the publish-to-project model + the three redefined policies, citing the canonical committed migration (single source of truth — not re-embedded, to prevent drift). One additive edit; no existing content changes.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Grounding parent: `b438453e523c617224c6acda2848a10b248c931b` (vault-theo, `development`) — this Role-C package is carried at a later commit named in the forward note; all currency anchors below are tip-independent blob SHAs unaffected by the carrying commit
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA) |
| - | ---------------------- | ------------------------------ | -------------------------- |
| 1 | **TARGET** Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§10 DEPLOYED section + doc tail; §8/§9 write-path idiom) | `Read`(offset §10) + `grep -oF` (exact §10-tail anchor, count=1) this turn | `df1f29a8f4cab01fb7c2f40ab152941825846203` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | carried grounding (Phase 1 Role-C, this program) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | carried grounding (this program) | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed SPW Phase 2a migration (canonical DDL, referenced) — `Codex Governance/Theo-SPW-Phase2a-Publish-To-Project-Schema-Pass-1-VEP/spw_phase2a_migration.sql` | Codex-APPROVED (`b438453`) + deployed + `spw_phase2a_verify.sql` run clean this turn | `25cdb7d08553bc3ef2c52ec996e496a20c84ece5` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits" | EDIT 1 — Codex applies the §11 append verbatim |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §8/§9 | "the governed service write-path idiom" | §11 — publish is an owner UPDATE via the unchanged owner-only policy; RLS broadened only for read + member-continuation |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "Membership/sharing models are introduced only by explicit Walter-authorized schema update" | §11 — publish-to-project RLS broadening = Walter-authorized (SPW program + Phase 2 read+write, 2026-07-30) |

## Rationale
The schema doc is the `theo_*` data-truth owner and records DDL DEPLOYED step-by-step (§5–§10). SPW Phase 2a has landed (deployed by Walter as `pgadmin_vault` + read-only-verified this session via `spw_phase2a_verify.sql`; canonical migration Codex-APPROVED at `b438453`), so the doc gains a §11 DEPLOYED record — mirroring the §9/§10 pattern: status + a canonical-DDL pointer to the committed migration (one authoritative copy, no drift) + as-built specifics (the private-by-default publish model, the three redefined policies with their predicates, the owner-only-preserved set, the attribution/non-recursion notes, the reversal block, the Walter authorization). Pure append after §10; no existing byte changes.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once (verified `grep -oF` = 1) or HALT. One file, one additive append. Target file: `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (the final sentence of §10).

### EDIT 1 — append the §11 Shared Project Workspace Phase 2a DEPLOYED section

**Locate (BEFORE) — the §10 closing sentence, found exactly once:**

```
Boundary: additive column + additive functions on an existing `theo_*` table; no `reporting_*` touched; no existing RLS policy altered. Handler wiring is Phase 1b.
```

**Replace with (AFTER) — the same sentence, then the new §11 section appended:**

```
Boundary: additive column + additive functions on an existing `theo_*` table; no `reporting_*` touched; no existing RLS policy altered. Handler wiring is Phase 1b.

## §11 DEPLOYED DDL — Shared Project Workspace Phase 2a: Publish-to-Project (2026-07-30)

**Status:** DEPLOYED against `vaultgpt-postgres-prod` (schema `public`; run by Walter as `pgadmin_vault` 2026-07-30). Read-only-verified (catalog): `theo_conversations` gains `published_to_project boolean NOT NULL DEFAULT false`, `published_at timestamptz NULL`, `published_by text NULL`; partial index `idx_theo_conversations_published ON (project_id) WHERE published_to_project = true` present; the three broadened RLS policies rewritten (`theo_conversation_select_own`, `theo_message_select_own`, `theo_message_insert_own`) each carry the publish + project-membership branch; the five owner-only policies UNTOUCHED (`theo_conversation_insert_own`/`_update_own`/`_delete_own` + `theo_message_update_own`/`_delete_own` — all bare `created_by = auth.uid()`); RLS enabled on both `theo_conversations` and `theo_messages`.

**Canonical DDL (single source of truth):** `Codex Governance/Theo-SPW-Phase2a-Publish-To-Project-Schema-Pass-1-VEP/spw_phase2a_migration.sql` (Codex-APPROVED; deployed by Walter). Additive columns + `CREATE INDEX IF NOT EXISTS` + `DROP POLICY IF EXISTS`/`CREATE POLICY` (no top-level `BEGIN`/`COMMIT`); reversible via the migration's footer reversal block (restores the strict `created_by = auth.uid()` ownership baseline and drops the columns/index). Not duplicated here.

**As-built specifics (Shared Project Workspace program, Phase 2a — the publish-to-project sharing substrate):** private-by-default — linking a conversation to a project (`project_id`) does NOT share it; **publishing is an explicit OWNER action** that sets `published_to_project = true` (an owner UPDATE via the unchanged owner-only UPDATE policy). A conversation is shared **iff** `published_to_project = true AND project_id IS NOT NULL`; only then do the broadened SELECT/INSERT policies expose it to that project's access set (**creator ∪ owner/member**, computed identically in every policy as `SELECT id FROM theo_projects WHERE created_by = auth.uid() UNION SELECT project_id FROM theo_project_members WHERE member_oid = auth.uid()`). The three redefined policies: `theo_conversation_select_own` (SELECT: own OR a published conversation in a project I belong to); `theo_message_select_own` (SELECT: own OR a message whose conversation is so published); `theo_message_insert_own` (INSERT WITH CHECK: `created_by = auth.uid()` AND (my own conversation OR a published conversation in my project)) — the write-side broadening that lets a member CONTINUE a shared thread. **Attribution:** `theo_messages.created_by` is set to `auth.uid()` on every insert (a member posts only as themselves), so a multi-party published thread attributes each turn automatically — no new column. **Owner-only preserved:** conversation INSERT/UPDATE/DELETE + message UPDATE/DELETE stay bare `created_by = auth.uid()`, so members cannot rename/delete a shared conversation or edit/delete others' messages, and publish/unpublish remains an owner UPDATE. **RLS non-recursion (mirrors the B5c design):** `theo_conversations.SELECT` references `theo_projects` + `theo_project_members`; `theo_messages.SELECT/INSERT` reference `theo_conversations`; `theo_projects`/`theo_project_members` never reference conversations/messages back — no cycle. **Authorization:** broadening conversation/message RLS beyond ownership is out of default 1B scope "unless Walter authorizes" (Backend Plan; §1) — Walter authorized the Shared Project Workspace program and explicitly directed Phase 2 read+write 2026-07-30. Boundary: additive columns + one partial index + three policy redefinitions on existing `theo_*` tables; no `reporting_*` touched; no owner-only policy altered. Handlers (publish/unpublish/list + broadened read/post wiring) are Phase 2b; FE is Phase 2c.
```

## Note
Records SPW Phase 2a as DEPLOYED in the schema doc via one additive §11 section. No §3 table-set change, no banner change, no existing-byte change. No Phase-1B Plan change. The paired Phase-2b handler VEP (publish/unpublish/list-project-conversations on `vaultgpt-func-projects` + the broadened read/post path on the chat apps) grounds on this §11 + the committed migration.

Scope attestation: this edit is enumerated here, limited to `spec/THEO_AZURE_POSTGRES_SCHEMA.md`, appends only the §11 DEPLOYED record for the already-deployed + verified SPW Phase 2a migration, and alters no existing content, VEP, or migration.

## Codex activation note (Walter forwards)

```
Codex is activated to execute the SPW Phase 2a Schema-Doc DEPLOYED Role-C handoff (vault-theo, "Codex Governance/Theo-SPW-Phase2a-Schema-Doc-DEPLOYED-RoleC/Theo_SPW_Phase2a_Schema_Doc_DEPLOYED_RoleC.md"). Open with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo Grounding Conformance §3/§5). Apply EDIT 1 to spec/THEO_AZURE_POSTGRES_SCHEMA.md verbatim — the BEFORE anchor is the §10 closing sentence ("Boundary: additive column + additive functions on an existing `theo_*` table; … Handler wiring is Phase 1b."), which MUST be found exactly once; append the new ## §11 section after it per the AFTER text; HALT on any mismatch. One file, one additive append — no line-ending normalization, no other edits. Emit APPROVED or REJECTED only.
```
