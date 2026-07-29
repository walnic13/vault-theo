# Theo 1B — Chat per-user thread-state (hidden / muted) Backend — Pass 1 VEP (index)

**Regime:** Theo backend governance (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development`. **Deploy target:** `vaultgpt-func-chat`. **Migration:** YES (Walter, first). Server-persisted DM hide/mute for the Orbit list (vault-origin Increment B).

## Microstep
- **set state** — `POST /api/theo_chat_set_thread_state { thread_id, hidden?, muted? }` toggles the caller's own per-thread flags (NEW handler; mirrors deployed `theo_chat_mark_read`).
- **list** — `theo_chat_list_threads` returns `hidden`/`muted` per thread and drops hidden threads UNLESS they have unread (resurface-on-unread).

## Migration (Walter, before deploy)
`ALTER TABLE theo_chat_thread_members ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false` + same for `muted`. Additive/idempotent; inherits the table's existing "your own row" UPDATE policy — no new policy, no SECURITY DEFINER.

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC_Chat_Thread_State_Backend_VEP.md` | Pass 1 backend VEP (lint PASS): GCR + Rule Anchor + P1–P8 + Gap Register + §MIGRATION (+verify) + Primary Reference (deployed `theo_chat_mark_read`) + §HG (set_thread_state NEW; list_threads MODIFIED) + §API-SPEC/Schema Role-C + §DEPLOY + §CURL. |
| `chat_thread_state_migration.sql` / `chat_thread_state_verify.sql` | Migration (two additive booleans) + read-only verify. |
| `theo_chat_set_thread_state/index.js` / `.function.json` | NEW — own-row hidden/muted upsert (mirrors mark_read). |
| `theo_chat_list_threads/index.js` / `.function.json` | MODIFIED — returns hidden/muted + excludes hidden-without-unread. |
| `primary-reference/theo_chat_mark_read.index.js.md` / `.function.json.md` | Deployed primary reference, byte-verbatim (Kudu blob `450be900`). |

## Pass 3 ordering
1. **Walter** runs `chat_thread_state_migration.sql` + verify (both columns must exist before deploy).
2. **Claude Code** deploys the 1 new + 1 overwrite to `vaultgpt-func-chat` (§1E/DR-T7, Kudu VFS), restart, confirm the new function, run §CURL.
3. Role-C: API-Spec §2.10 (set_thread_state route + list_threads hidden/muted) + Schema (the two columns). Then vault-origin Increment C (DM ⋯ menu).
