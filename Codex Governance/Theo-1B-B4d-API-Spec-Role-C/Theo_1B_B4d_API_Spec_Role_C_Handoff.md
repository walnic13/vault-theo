# Role-C Verbatim-Edit Handoff — Theo API Spec §2.1 (B4d conversation↔project endpoints)

> Pass 4 documentation-update package (Conformance §4 Pass 4). Author = Claude Code (Role-C). Inline executor = Codex. Authority = the B4d endpoints deployed + golden-verified 2026-07-01 (backend VEP Codex-APPROVED `25c590f`; FE VEP APPROVED `c060451`; capture `.local/b4d_conversation_project_verify_2026-07-01.txt`). Two edits to one target: add the `?projectId` filter to the deployed `theo_list_conversations` row, and add a new `theo_set_conversation_project` row. Closes B4d-backend G-2 + B4d-FE G-4.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (Pass 4 documentation update)
Turn issued against HEAD: `c06045157dc414e106af698f3162837ebd6c2605` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Role-C handoff finalizing Theo API Spec §2.1 to the deployed B4d contracts. Exact before/after for two edits to one target (`spec/THEO_API_SPEC.md`). No source/handler/schema change; documentation only. Codex executes verbatim per Codex Review §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff) | `grep -F "Role-C\|Verbatim-Edit"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4 Pass 4 row; §3/§5) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `grep -F "executes the directed edits"` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 Chat / model gateway) | `Read(offset=21, limit=9)` this turn | `4b978ef428c7b519387a7c8edc4838432a3f72bf` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No `CLAUDE.local.md` edit (Conformance §12).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this handoff) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff" | This handoff's before/after edit format |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "executes the directed edits" | Execution instruction to Codex |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 Pass 4 | "Verbatim documentation edits to Governor" | Pass-4 turn type; edits the named target only |
| spec/THEO_API_SPEC.md | §2.1 | "List conversations" | EDIT 1 target row |

---

## Edit set (2 verbatim edits, 1 target document)

Target `spec/THEO_API_SPEC.md` at HEAD `4b978ef` (blob). Codex executes each edit verbatim; no substantive additions beyond the AFTER text.

---

### EDIT 1 — `spec/THEO_API_SPEC.md` — REPLACE the "List conversations → Recents" row (add `?projectId`)

**Locate (BEFORE):**

```
| List conversations → Recents | `GET /api/theo_list_conversations` (optional `?limit`, integer 1..200, default 50; malformed → 400); response `{ conversations: [{ id, title, model, project_id, app_key, created_at, updated_at }] }` newest-first, RLS-scoped to the signed-in user | `1B-deployed` — **DEPLOYED 2026-06-27** (B3b) | `theo_conversations` (HF-T2) |
```

**Replace with (AFTER):**

```
| List conversations → Recents | `GET /api/theo_list_conversations` (optional `?limit`, integer 1..200, default 50; optional `?projectId=<uuid>` — B4d additive filter scoping the result to the signed-in user's conversations linked to that project; malformed `limit` or `projectId` → 400); response `{ conversations: [{ id, title, model, project_id, app_key, created_at, updated_at }] }` newest-first, RLS-scoped to the signed-in user | `1B-deployed` — **DEPLOYED 2026-06-27** (B3b); `?projectId` filter **DEPLOYED 2026-07-01** (B4d) | `theo_conversations` (HF-T2) |
```

---

### EDIT 2 — `spec/THEO_API_SPEC.md` — INSERT a new "Link conversation to project" row after "Get conversation → reload thread"

**Locate (BEFORE):**

```
| Get conversation → reload thread | `GET /api/theo_get_conversation?conversationId=<uuid>`; response `{ conversation, messages: [{ id, seq, role, content, model, citations, created_at }] }` ordered by `seq`; persisted `citations` returned for assistant turns; invalid id → 400, not-found → 404, not-owned → 403 | `1B-deployed` — **DEPLOYED 2026-06-27** (B3b) | `theo_conversations` + `theo_messages` (HF-T2) |
```

**Replace with (AFTER):**

```
| Get conversation → reload thread | `GET /api/theo_get_conversation?conversationId=<uuid>`; response `{ conversation, messages: [{ id, seq, role, content, model, citations, created_at }] }` ordered by `seq`; persisted `citations` returned for assistant turns; invalid id → 400, not-found → 404, not-owned → 403 | `1B-deployed` — **DEPLOYED 2026-06-27** (B3b) | `theo_conversations` + `theo_messages` (HF-T2) |
| Link conversation to project | `POST /api/theo_set_conversation_project` `{ conversation_id, project_id }` (both UUID) → `{ conversation_id, project_id }`; owner-scoped, **idempotent set-once** of `theo_conversations.project_id` (`… WHERE id AND created_by AND project_id IS NULL`; an already-linked conversation returns its current `project_id` unchanged — a conversation belongs to one project). The FE calls it once after a project chat's first turn returns a `conversation_id`. Bad uuid → 400; referenced project not owned/absent → 404; conversation existing-foreign → 403 / absent → 404 (via `theo_conversation_exists_unscoped`). `theo_message` / `theo_message_stream` are unchanged (linking is a separate owner-scoped write). | `1B-deployed` — **DEPLOYED 2026-07-01** (B4d; golden-verified) | `theo_conversations` (HF-T2) |
```

---

## Companion note (NOT executed here)

No companion edit required. The Golden Handler family registry (HF-T2) already covers ownership CRUD over `theo_conversations`; the Schema doc §3/§5 already records `theo_conversations.project_id` (FK→`theo_projects` ON DELETE SET NULL) and the `theo_conversation_exists_unscoped` helper. Only §2.1's contract text needed the deployed-endpoint update.

---

*End of Role-C Verbatim-Edit Handoff.*
