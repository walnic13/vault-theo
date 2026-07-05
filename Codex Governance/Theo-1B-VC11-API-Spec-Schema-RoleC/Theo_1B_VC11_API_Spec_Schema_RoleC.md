# Theo 1B — VC-11 Reply-to-Message: API-Spec §2.10 + Schema §3 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-11 reality. **APPROVED / REJECTED only.**

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `542cf0f3a3b9b6d36b56781df9e052fa50b59c6d` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-05) VC-11 reality — API-Spec §2.10 `read / send messages` row: `list_messages` messages gain `reply_to_message_id` + a bounded `reply_to` preview; `send_message` accepts an optional `reply_to_message_id` and returns the same enriched `message`; a target not in the same thread → 400. Schema §3 `theo_chat_messages` gains `reply_to_message_id`. Verbatim before/after against the committed spec. Migration was run by Walter; handlers deployed + golden-verified (see the sibling deploy-evidence).
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row — edit target line 92) | `grep -n "read / send messages"` this turn | `07b061022c34fcc9b08ac3b13191caeb441fa98a` |
| 2 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` row — edit target line 40) | `grep -n "Message within a chat thread"` this turn | `a944639a3b7268332954e3cb3669c7d23a64a003` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | EDIT 1 — reply_to on list + send accepts reply_to_message_id |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Immutable — no `updated_at`, no UPDATE/DELETE policy" | EDIT 2 — `theo_chat_messages.reply_to_message_id` |

## Verbatim edits (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10, the "read / send messages" row (line 92)

**BEFORE (exact substring):**
```
`GET /api/theo_chat_list_messages?threadId=<uuid>&before=<seq>&limit=<n>` → **200** `{ messages: [{ id, thread_id, seq, sender_oid, body, created_at }], page: { limit, has_more, next_before } }` (seq-cursor paged; ascending for display). `POST /api/theo_chat_send_message` `{ thread_id, body }` → **201** `{ message }` — assigns the next per-thread `seq` atomically (retry on race; **409** on exhaustion), persists + commits, then **best-effort** publishes to the thread's Web PubSub group (a publish failure never fails the durable send). Non-participant of the target thread → **404** (no existence leak); blank/oversized (>8000) body or bad `threadId` → **400**.
```
**AFTER (exact):**
```
`GET /api/theo_chat_list_messages?threadId=<uuid>&before=<seq>&limit=<n>` → **200** `{ messages: [{ id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id, reply_to }], page: { limit, has_more, next_before } }` (seq-cursor paged; ascending for display). **VC-11 — DEPLOYED 2026-07-05:** each message carries `reply_to_message_id` (uuid|null) and `reply_to` — a bounded (200-char) quoted-parent preview `{ id, seq, sender_oid, body }` (null when the message is not a reply). `POST /api/theo_chat_send_message` `{ thread_id, body, reply_to_message_id? }` → **201** `{ message }` — assigns the next per-thread `seq` atomically (retry on race; **409** on exhaustion), persists + commits, then **best-effort** publishes to the thread's Web PubSub group (a publish failure never fails the durable send). **VC-11:** the optional `reply_to_message_id` must be a message **in the same thread** (else **400**); the returned/published `message` carries the same `reply_to` preview as `list_messages` (identical live + cold-load shape). Non-participant of the target thread → **404** (no existence leak); blank/oversized (>8000) body or bad `threadId`/`reply_to_message_id` → **400**.
```

### EDIT 2 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3, the `theo_chat_messages` row (line 40)

**BEFORE (exact substring):**
```
`sender_oid text`, `body text` (CHECK length 1..8000), `created_at`. Immutable — no `updated_at`, no UPDATE/DELETE policy.
```
**AFTER (exact):**
```
`sender_oid text`, `body text` (CHECK length 1..8000), `created_at`, `reply_to_message_id uuid NULL` (**VC-11, DEPLOYED 2026-07-05** — self-FK → `theo_chat_messages(id)` `ON DELETE SET NULL`; the quoted-reply parent; null for a normal message). Immutable — no `updated_at`, no UPDATE/DELETE policy (a reply is an ordinary INSERT carrying the extra column; the `theo_chat_message_insert` WITH CHECK is column-agnostic, so RLS is unchanged).
```

## Scope note
API-Spec §2.10 (line 92) + Schema §3 (line 40) only. No Plan delta (the VC tier is recorded). No handler/code change (documents deployed reality). No RLS/policy change.

*End of Role-C Verbatim-Edit Handoff.*
