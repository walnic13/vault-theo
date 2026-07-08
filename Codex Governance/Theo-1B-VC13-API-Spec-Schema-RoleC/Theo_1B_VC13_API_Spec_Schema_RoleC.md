# Theo 1B — VC-13 Forward-a-Message: API-Spec §2.10 + Schema §3 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-13 reality. **APPROVED / REJECTED only.** Codex, please finish with the `[Codex Pass 4]` **commit** (a Role-C is complete only when committed at HEAD — satisfies VC-13-FE's T22).

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `303716466d94e4e06180e01ef1db8801e0336fcc` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-06) VC-13 reality — API-Spec §2.10 `read / send messages` row gains the `theo_chat_forward_message` route + a `forwarded` boolean on the message projection; Schema §3 `theo_chat_messages` gains `forwarded_from_message_id` (exposed only as `forwarded`). Verbatim before/after against the committed spec. Migration was run by Walter; handlers deployed + golden-verified (see the sibling deploy-evidence).
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row — edit target line 92) | `grep -n "read / send messages"` this turn | `97885afd31b5ce84d9095bc674b33529c63db67e` |
| 2 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` row — edit target line 40) | `grep -n "Message within a chat thread"` this turn | `66e8908b40019e406449192dd26b8f6a2c9c5243` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | EDIT 1 + EDIT 2 — forwarded field + the forward route |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Message within a chat thread" | EDIT 3 — `forwarded_from_message_id` column |

## Verbatim edits (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10 (line 92) — add `forwarded` to the `list_messages` projection

**BEFORE (exact substring):**
```
sender_oid, body, created_at, reply_to_message_id, reply_to, deleted, deleted_at }], page: { limit, has_more, next_before } }
```
**AFTER (exact):**
```
sender_oid, body, created_at, reply_to_message_id, reply_to, deleted, deleted_at, forwarded }], page: { limit, has_more, next_before } }
```

### EDIT 2 — `spec/THEO_API_SPEC.md` §2.10 (line 92) — add the forward route + note at the end of the row

**BEFORE (exact substring):**
```
a tombstoned message — and a tombstoned `reply_to` parent — has `body:null` + `deleted:true`. | `theo_chat_messages` + `theo_chat_threads` + Web PubSub |
```
**AFTER (exact):**
```
a tombstoned message — and a tombstoned `reply_to` parent — has `body:null` + `deleted:true`. **VC-13 — DEPLOYED 2026-07-06:** `POST /api/theo_chat_forward_message` `{ message_id, to_thread_id }` → **201** `{ message }` — copies a source message the caller can see (read under RLS) into another thread they belong to, marked `forwarded:true`; the source body is copied server-side. Source not visible / not found → **404**; a **deleted** source → **400**; target not a participant → **404**. `list_messages`/`send_message` messages now also carry `forwarded` (bool); the raw origin id is never exposed (only the boolean — cross-thread privacy). | `theo_chat_messages` + `theo_chat_threads` + Web PubSub |
```

### EDIT 3 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 (line 40) — add `forwarded_from_message_id` to the `theo_chat_messages` row

**BEFORE (exact substring):**
```
which keeps 1..8000 for a live row). Immutable EXCEPT a sender-scoped soft-delete:
```
**AFTER (exact):**
```
which keeps 1..8000 for a live row), `forwarded_from_message_id uuid NULL` (**VC-13, DEPLOYED 2026-07-06** — self-FK → `theo_chat_messages(id)` `ON DELETE SET NULL`; the origin of a forwarded copy, set by `theo_chat_forward_message`; exposed to clients ONLY as a `forwarded` boolean, never the raw id — cross-thread privacy). Immutable EXCEPT a sender-scoped soft-delete:
```

## Scope note
API-Spec §2.10 (line 92) + Schema §3 (line 40) only. No Plan delta (the VC tier is recorded). No handler/code change (documents deployed reality). No RLS/policy change (the forward INSERT rides the existing `theo_chat_message_insert` policy).

*End of Role-C Verbatim-Edit Handoff.*
