# Theo 1B — VC-12 Delete-a-Message: API-Spec §2.10 + Schema §3 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-12 reality. **APPROVED / REJECTED only.** Codex, please finish with the `[Codex Pass 4]` **commit** (a Role-C is complete only when committed at HEAD — this satisfies the next FE VEP's T22).

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `c69a3f6b438af2591b64e63b289688c75886355f` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-05) VC-12 reality — API-Spec §2.10 `read / send messages` row: `list_messages`/`send_message` messages gain `deleted`/`deleted_at`; new `POST theo_chat_delete_message` sender-only soft delete; a tombstoned message / `reply_to` parent has `body:null` + `deleted:true`. Schema §3 `theo_chat_messages` gains `deleted_at`/`deleted_by` + the `theo_chat_delete_message` SECURITY DEFINER fn, and the immutability note is amended to allow the sender-scoped soft-delete. Verbatim before/after against the committed spec. Migration was run by Walter; handlers deployed + golden-verified (see the sibling deploy-evidence).
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row — edit target line 92) | `grep -n "read / send messages"` this turn | `63980469e13ba1136b2b660ae0e937235027fbf5` |
| 2 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` row — edit target line 40) | `grep -n "Message within a chat thread"` this turn | `12ef44c35d4f34c612bfb1402d6b7df63e3db0ff` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | EDIT 1 + EDIT 2 — deleted fields + the delete route |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Immutable — no `updated_at`, no UPDATE/DELETE policy" | EDIT 3 — deleted columns + definer fn + amended note |

## Verbatim edits (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10 (line 92) — add `deleted`/`deleted_at` to the `list_messages` projection

**BEFORE (exact substring):**
```
`GET /api/theo_chat_list_messages?threadId=<uuid>&before=<seq>&limit=<n>` → **200** `{ messages: [{ id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id, reply_to }], page: { limit, has_more, next_before } }`
```
**AFTER (exact):**
```
`GET /api/theo_chat_list_messages?threadId=<uuid>&before=<seq>&limit=<n>` → **200** `{ messages: [{ id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id, reply_to, deleted, deleted_at }], page: { limit, has_more, next_before } }`
```

### EDIT 2 — `spec/THEO_API_SPEC.md` §2.10 (line 92) — add the delete route + tombstone note at the end of the row

**BEFORE (exact substring):**
```
Non-participant of the target thread → **404** (no existence leak); blank/oversized (>8000) body or bad `threadId`/`reply_to_message_id` → **400**. | `theo_chat_messages` + `theo_chat_threads` + Web PubSub |
```
**AFTER (exact):**
```
Non-participant of the target thread → **404** (no existence leak); blank/oversized (>8000) body or bad `threadId`/`reply_to_message_id` → **400**. **VC-12 — DEPLOYED 2026-07-05:** `POST /api/theo_chat_delete_message` `{ message_id }` → **200** `{ thread_id, message_id, deleted }` — sender-only "delete for everyone" (a soft tombstone; the body is nulled and removed for all participants). Not the sender → **403**; not visible / not found → **404**; idempotent (already-deleted → `deleted:true`); a best-effort `{ type:"message_deleted", thread_id, message_id }` is published to the thread's group. `list_messages`/`send_message` messages now also carry `deleted` (bool) + `deleted_at`; a tombstoned message — and a tombstoned `reply_to` parent — has `body:null` + `deleted:true`. | `theo_chat_messages` + `theo_chat_threads` + Web PubSub |
```

### EDIT 3 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 (line 40) — add `deleted_at`/`deleted_by` + the definer fn + amend the immutability note

**BEFORE (exact substring):**
```
`reply_to_message_id uuid NULL` (**VC-11, DEPLOYED 2026-07-05** — self-FK → `theo_chat_messages(id)` `ON DELETE SET NULL`; the quoted-reply parent; null for a normal message). Immutable — no `updated_at`, no UPDATE/DELETE policy (a reply is an ordinary INSERT carrying the extra column; the `theo_chat_message_insert` WITH CHECK is column-agnostic, so RLS is unchanged).
```
**AFTER (exact):**
```
`reply_to_message_id uuid NULL` (**VC-11, DEPLOYED 2026-07-05** — self-FK → `theo_chat_messages(id)` `ON DELETE SET NULL`; the quoted-reply parent; null for a normal message), `deleted_at timestamptz NULL`/`deleted_by text NULL` (**VC-12, DEPLOYED 2026-07-05** — soft-delete tombstone; a tombstoned row may have `body NULL` per the conditional CHECK `theo_chat_messages_body_ck`, which keeps 1..8000 for a live row). Immutable EXCEPT a sender-scoped soft-delete: the app role still carries no UPDATE/DELETE policy, and the tombstone (`deleted_at`/`deleted_by` + `body NULL`) is written ONLY by the `SECURITY DEFINER theo_chat_delete_message(uuid)` — sender-only (`current_setting('request.jwt.claim.sub')`, never a parameter), `FOR UPDATE` + `sender = caller AND deleted_at IS NULL` re-asserted in the UPDATE, `REVOKE`/`GRANT authenticated`, pinned `search_path` — the same justified class as `theo_chat_leave`. A reply is an ordinary INSERT carrying the extra column; the `theo_chat_message_insert` WITH CHECK is column-agnostic, so RLS is unchanged.
```

## Scope note
API-Spec §2.10 (line 92) + Schema §3 (line 40) only. No Plan delta (the VC tier is recorded). No handler/code change (documents deployed reality). No RLS/policy change for the app role (the tombstone is confined to the SECURITY DEFINER fn).

*End of Role-C Verbatim-Edit Handoff.*
