# Role-C Verbatim-Edit Handoff — Theo API Spec §2.2 Projects (B4a + B4b deployed contracts)

> Pass 4 documentation-update package (Conformance §4 Pass 4). Author = Claude Code (Role-C). Inline executor = Codex. Authority for the change = the B4a + B4b endpoints deployed + golden-verified 2026-07-01 (VEPs Codex-APPROVED at `1b6497f` / `2360c04`). This finalizes the v0.1 §2.2 skeleton (which said `1A-contract (in-memory)`) to the deployed contract naming the seven live endpoints, mirroring the §2.7 Memory / §2.8 Attachments deployed-row style. One edit, one target document. Closes G-2 of both B4a and B4b before the B4c FE-live VEP cites §2.2 (T22 prevention).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (Pass 4 documentation update)
Turn issued against HEAD: `2360c04283f365402e075fa4b5919121ff25ea8e` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Role-C handoff finalizing Theo API Spec §2.2 Projects to the deployed B4a (projects core CRUD) + B4b (project-knowledge CRUD) contracts. Exact before/after for one edit to one target (`spec/THEO_API_SPEC.md`). No source/handler/schema change; documentation only. Codex executes verbatim per Codex Review §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff) | `Grep("Role-C\|Verbatim-Edit")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4 Pass 4 row; §3/§5) | `Grep("§4A\\.1")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 Projects) | `Read(full)` this turn | `c5d6c7b68469ae6605fd625890a8474fabe333c9` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No `CLAUDE.local.md` edit (Conformance §12).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this handoff) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff" | This handoff's before/after edit format |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "executes the directed edits" | Execution instruction to Codex |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 Pass 4 | "Verbatim documentation edits to Governor" | Pass-4 turn type; edits the named target only |
| spec/THEO_API_SPEC.md | §2.2 | "Projects — backs Projects surface" | EDIT 1 target section |

---

## Edit set (1 verbatim edit, 1 target document)

Target `spec/THEO_API_SPEC.md` at HEAD `c5d6c7b` (blob). Codex executes the edit verbatim; no substantive additions beyond the AFTER text.

---

### EDIT 1 — `spec/THEO_API_SPEC.md` — REPLACE the §2.2 Projects table in full

**Locate (BEFORE):**

```
### §2.2 Projects — backs Projects surface
| Contract | Status | Backing |
|----------|--------|---------|
| list / create / patch-instructions projects | `1A-contract` (in-memory) / `1B-deployed` | `theo_projects` (HF-T2) |
| add / remove project knowledge | `1A-contract` / `1B-deployed` | `theo_project_knowledge` (HF-T2); RAG-indexed in 1B |
```

**Replace with (AFTER):**

```
### §2.2 Projects — backs Projects surface
| Contract | Status | Backing |
|----------|--------|---------|
| list / create / update / delete projects | `1B-deployed` — **DEPLOYED 2026-07-01** (B4a): `GET /api/theo_list_projects` → `{ projects: [{ id, name, description, instructions, app_key, created_at, updated_at }] }` newest-updated-first, RLS `created_by`-scoped; `POST /api/theo_create_project` `{ name, description?, instructions?, app_key? }` → **201** `{ project }` (omitted `description`/`instructions` insert `""`; omitted `app_key` → NULL); `POST /api/theo_update_project` `{ id, name?, description?, instructions?, app_key? }` (≥1 updatable field; `name` non-blank; `description`/`instructions`/`app_key` may be `""` to clear) → `{ project }`, 0-row → 403 (existing-foreign) / 404 (absent) via `theo_project_exists_unscoped`; `POST /api/theo_delete_project` `{ id }` → `{ deleted: true, id }` (dependents follow deployed FKs: `theo_project_knowledge` + `theo_user_memory` CASCADE, `theo_conversations` + `theo_artifacts` `project_id` SET NULL). Invalid uuid / blank name / no-op update → 400. The v0.1 "patch-instructions" contract is finalized as the general `update`; `delete` is added (Claude-parity). | `theo_projects` (HF-T2); additive `description text NOT NULL DEFAULT ''` column (B4a migration) |
| add / list / remove project knowledge | `1B-deployed` — **DEPLOYED 2026-07-01** (B4b): `POST /api/theo_add_project_knowledge` `{ project_id, title, content }` → **201** `{ knowledge: { id, project_id, title, source_type, content, created_at } }` (verifies the parent project is owned → 404 else; `source_type` fixed `'text'`); `GET /api/theo_list_project_knowledge?projectId=<uuid>` → `{ knowledge: [...] }` chronological, resolves project ownership first (403 existing-foreign / 404 absent); `POST /api/theo_remove_project_knowledge` `{ knowledge_id, project_id? }` → `{ deleted: true, id }` (permanent — the table is immutable; 403/404 via `theo_project_knowledge_exists_unscoped`). Invalid uuid / blank title / empty content / missing `projectId` → 400. Text knowledge only (`source_type='text'`, inline `content`); file-backed knowledge (`source_type='file'` + Blob pointer, reusing the B8 upload pipeline) and RAG retrieval (HF-T4, Tier B6) are deferred. | `theo_project_knowledge` (HF-T2); RAG-indexed in a later tier |
```

---

## Companion note (NOT executed here)

No companion edit required. The Golden Handler family registry (HF-T2, `governance/THEO_GOLDEN_HANDLER_STANDARD.md` §6) already covers `theo_projects` / `theo_project_knowledge` CRUD; the Schema doc §3/§5 already records both tables. Only §2.2 was still at the v0.1 `1A-contract` skeleton, so this is the single drift-closing edit. The additive `theo_projects.description` column is recorded in the B4a package migration; a Schema-doc §5 addendum note for `description` may be batched into a later Schema Role-C but is not required for the B4c FE-live VEP (which grounds against this §2.2 contract).

---

*End of Role-C Verbatim-Edit Handoff.*
