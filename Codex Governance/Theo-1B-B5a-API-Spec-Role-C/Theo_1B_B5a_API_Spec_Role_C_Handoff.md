# Role-C Verbatim-Edit Handoff — Theo API Spec §2.2 (B5a project group-visibility)

> Pass 4 documentation-update package (Conformance §4 Pass 4). Author = Claude Code (Role-C). Inline executor = Codex. Authority = the B5a endpoint + RLS broadening deployed + golden-verified 2026-07-02 (backend VEP Codex-APPROVED `bfde0cd`; capture `.local/b5a_visibility_verify_2026-07-02.txt`). One edit to one target: insert a §2.2 row documenting `theo_set_project_visibility` + the group-visible read semantics (list/knowledge/set-conversation-project broadening; config-only sharing). Closes B5a-backend Gap Register G-2.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (Pass 4 documentation update)
Turn issued against HEAD: `bfde0cd` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Role-C handoff adding the deployed B5a project-visibility contract to Theo API Spec §2.2. Exact before/after for one edit to one target (`spec/THEO_API_SPEC.md`). No source/handler/schema change; documentation only. Codex executes verbatim per Codex Review §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff) | `git grep -F "emits a Role-C Verbatim-Edit Handoff"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4 Pass 4 row; §3/§5) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `git grep -F "executes the directed edits"` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 Projects) | `Read(offset=33, limit=5)` this turn | `4808c4dd6d43013c6defe94e636542e47d639449` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No `CLAUDE.local.md` edit (Conformance §12).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this handoff) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff" | This handoff's before/after edit format |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "executes the directed edits" | Execution instruction to Codex |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 Pass 4 | "Verbatim documentation edits to Governor" | Pass-4 turn type; edits the named target only |
| spec/THEO_API_SPEC.md | §2.2 | "list / create / update / delete projects" | EDIT 1 anchor row (new row inserted after it) |

---

## Edit set (1 verbatim edit, 1 target document)

Target `spec/THEO_API_SPEC.md` at HEAD `4808c4d` (blob). Codex executes the edit verbatim; no substantive additions beyond the AFTER text.

---

### EDIT 1 — `spec/THEO_API_SPEC.md` — INSERT a §2.2 row for project visibility after the "list / create / update / delete projects" row

**Locate (BEFORE)** — the trailing backing cell of the existing projects row:

```
The v0.1 "patch-instructions" contract is finalized as the general `update`; `delete` is added (Claude-parity). | `theo_projects` (HF-T2); additive `description text NOT NULL DEFAULT ''` column (B4a migration) |
```

**Replace with (AFTER)** — the same cell, then the new visibility row on the next line:

```
The v0.1 "patch-instructions" contract is finalized as the general `update`; `delete` is added (Claude-parity). | `theo_projects` (HF-T2); additive `description text NOT NULL DEFAULT ''` column (B4a migration) |
| set project visibility / group-visible sharing | `1B-deployed` — **DEPLOYED 2026-07-02** (B5a; golden-verified): `POST /api/theo_set_project_visibility` `{ id, visibility }` (`visibility ∈ {'private','group'}`; **owner-only**) → **200** `{ project: { id, visibility } }`; 0-row → 403 (existing-foreign) / 404 (absent) via `theo_project_exists_unscoped`; bad uuid / bad visibility → 400. A **group-visible** project (and its knowledge/instructions) is readable by any authenticated Vault user (only eligible users can authenticate) — **config-only sharing**: `theo_conversations`/`theo_messages` RLS is **unchanged**, so members chat with their own conversations and no chat transcripts are shared. Consequent read broadening (B5a): `theo_list_projects` returns `owner ∨ group-visible` rows, each with `visibility` + `is_owner`; `theo_list_project_knowledge` and `theo_set_conversation_project` accept an `owned ∨ group-visible` project (a member links their own conversation to a shared project). Writes (create/update/delete/visibility) stay owner-only. Per-member invite (`theo_project_members`) + roster/presence are Phase 2. | `theo_projects` (HF-T2); additive `visibility text NOT NULL DEFAULT 'private' CHECK ('private','group')` column (B5a migration); SELECT-only RLS broadened on `theo_projects` + `theo_project_knowledge` |
```

---

## Companion note (NOT executed here)

The Schema doc (§3/§5) records `theo_projects` + `theo_project_knowledge` and the ownership-RLS family; the additive `visibility` column + the SELECT-only policy broadening are captured in the B5a migration (`b5a_migration.sql`, committed in the B5a backend package) and can be folded into the Schema doc's as-built section by a later Role-C if desired — not required for this §2.2 contract edit.

---

*End of Role-C Verbatim-Edit Handoff.*
