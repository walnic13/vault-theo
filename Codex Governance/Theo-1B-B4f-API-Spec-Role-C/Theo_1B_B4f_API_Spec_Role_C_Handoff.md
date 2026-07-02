# Role-C Verbatim-Edit Handoff — Theo API Spec §2.1 (B4f conversation rename/delete)

> Pass 4 documentation-update package (Conformance §4 Pass 4). Author = Claude Code (Role-C). Inline executor = Codex. Authority = the B4f endpoints deployed + golden-verified 2026-07-01 (backend VEP Codex-APPROVED `8980bef`; capture `.local/b4f_conversation_management_verify_2026-07-01.txt`). One edit to one target: insert `theo_rename_conversation` + `theo_delete_conversation` rows into §2.1, completing the documented conversations CRUD. Closes B4f-backend G-2.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (Pass 4 documentation update)
Turn issued against HEAD: `8980bef` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Role-C handoff adding the deployed B4f conversation-management endpoints (`theo_rename_conversation`, `theo_delete_conversation`) to Theo API Spec §2.1. Exact before/after for one edit to one target (`spec/THEO_API_SPEC.md`). No source/handler/schema change; documentation only. Codex executes verbatim per Codex Review §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff) | `grep -F "Role-C\|Verbatim-Edit"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4 Pass 4 row; §3/§5) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `grep -F "executes the directed edits"` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 Chat / model gateway) | `Read(offset=27, limit=5)` this turn | `1069096e2426a13d03c2c4b5177d10944f94b670` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No `CLAUDE.local.md` edit (Conformance §12).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this handoff) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff" | This handoff's before/after edit format |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "executes the directed edits" | Execution instruction to Codex |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 Pass 4 | "Verbatim documentation edits to Governor" | Pass-4 turn type; edits the named target only |
| spec/THEO_API_SPEC.md | §2.1 | "Link conversation to project" | EDIT 1 anchor row (new rows inserted after it) |

---

## Edit set (1 verbatim edit, 1 target document)

Target `spec/THEO_API_SPEC.md` at HEAD `1069096` (blob). Codex executes the edit verbatim; no substantive additions beyond the AFTER text.

---

### EDIT 1 — `spec/THEO_API_SPEC.md` — INSERT the rename + delete rows after "Link conversation to project"

**Locate (BEFORE):**

```
| Link conversation to project | `POST /api/theo_set_conversation_project` `{ conversation_id, project_id }` (both UUID) → `{ conversation_id, project_id }`; owner-scoped, **idempotent set-once** of `theo_conversations.project_id` (`… WHERE id AND created_by AND project_id IS NULL`; an already-linked conversation returns its current `project_id` unchanged — a conversation belongs to one project). The FE calls it once after a project chat's first turn returns a `conversation_id`. Bad uuid → 400; referenced project not owned/absent → 404; conversation existing-foreign → 403 / absent → 404 (via `theo_conversation_exists_unscoped`). `theo_message` / `theo_message_stream` are unchanged (linking is a separate owner-scoped write). | `1B-deployed` — **DEPLOYED 2026-07-01** (B4d; golden-verified) | `theo_conversations` (HF-T2) |
```

**Replace with (AFTER):**

```
| Link conversation to project | `POST /api/theo_set_conversation_project` `{ conversation_id, project_id }` (both UUID) → `{ conversation_id, project_id }`; owner-scoped, **idempotent set-once** of `theo_conversations.project_id` (`… WHERE id AND created_by AND project_id IS NULL`; an already-linked conversation returns its current `project_id` unchanged — a conversation belongs to one project). The FE calls it once after a project chat's first turn returns a `conversation_id`. Bad uuid → 400; referenced project not owned/absent → 404; conversation existing-foreign → 403 / absent → 404 (via `theo_conversation_exists_unscoped`). `theo_message` / `theo_message_stream` are unchanged (linking is a separate owner-scoped write). | `1B-deployed` — **DEPLOYED 2026-07-01** (B4d; golden-verified) | `theo_conversations` (HF-T2) |
| Rename conversation | `POST /api/theo_rename_conversation` `{ id, title }` (id UUID; title non-blank, ≤ 200 chars) → `{ conversation: { id, title } }`; owner-scoped `UPDATE theo_conversations SET title, updated_at`; bad uuid / blank / over-length title → 400; existing-foreign → 403 / absent → 404 (via `theo_conversation_exists_unscoped`). | `1B-deployed` — **DEPLOYED 2026-07-01** (B4f; golden-verified) | `theo_conversations` (HF-T2) |
| Delete conversation | `POST /api/theo_delete_conversation` `{ id }` (UUID) → `{ deleted: true, id }`; owner-scoped **permanent** delete; `theo_messages` cascade (deleted with the thread), `theo_attachments.conversation_id` SET NULL (files survive, unlinked) per the deployed FKs; bad uuid → 400; existing-foreign → 403 / absent → 404. `theo_message` / `theo_message_stream` are unchanged. | `1B-deployed` — **DEPLOYED 2026-07-01** (B4f; golden-verified) | `theo_conversations` (HF-T2) |
```

---

## Companion note (NOT executed here)

No companion edit required. HF-T2 already covers ownership CRUD over `theo_conversations`; the Schema doc §3/§5 already records the table + the `theo_conversation_exists_unscoped` helper + the child FKs (`theo_messages` ON DELETE CASCADE, `theo_attachments.conversation_id` ON DELETE SET NULL). Only §2.1's contract text needed the deployed rename/delete rows.

---

*End of Role-C Verbatim-Edit Handoff.*
