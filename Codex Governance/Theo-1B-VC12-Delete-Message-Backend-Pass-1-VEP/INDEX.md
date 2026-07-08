# Theo 1B — VC-12 Delete-a-Message Backend — Pass 1 VEP (index)

**Regime:** Theo backend governance (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development` @ `bc81692`. **Deploy target:** `vaultgpt-func-chat`. **Migration:** YES (Walter, first). Delete piece of the message-actions trio (VC-11 reply / VC-12 delete / VC-13 forward).

## Microstep
WhatsApp-style **"delete for everyone" by the sender** — a soft tombstone (`deleted_at`) that truly removes the content (`body = NULL`); renders "This message was deleted" everywhere, including inside a VC-11 `reply_to` quote.

## Migration (Walter, before deploy)
`theo_chat_messages.deleted_at`/`deleted_by`; a conditional body CHECK (tombstoned row may have `body NULL`; live row keeps 1..8000; the old CHECK is dropped by discovered name in a `DO` block); `SECURITY DEFINER theo_chat_delete_message(uuid)` (sender-only, `FOR UPDATE` + predicate-in-UPDATE, `REVOKE`/`GRANT authenticated`, pinned search_path). Same justified class as VC-16's `theo_chat_leave` — messages have no app-role UPDATE policy, so the tombstone write goes through the definer fn.

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC12_Delete_Message_Backend_VEP.md` | Pass 1 backend VEP (lint PASS): GCR + Rule Anchor + P1–P8 + Gap Register + §MIGRATION (+verify) + Primary Reference (`theo_chat_leave_channel` pair, deployed byte-verbatim) + §HG.1 delete (NEW) + §HG.2 list_messages (MODIFY) + §HG.3 send_message (MODIFY) + §API-SPEC/Schema Role-C + §DEPLOY + §CURL. |
| `vc12_delete_migration.sql` | Migration: tombstone columns + conditional body CHECK + `theo_chat_delete_message` definer fn. |
| `theo_chat_delete_message.index.js` / `.function.json` | NEW — sender-only soft delete (RLS-visibility 404 / sender 403 / definer fn / best-effort `message_deleted` publish). |
| `theo_chat_list_messages.index.js` / `.function.json` | MODIFY — `deleted`/`deleted_at` on messages + `deleted` on the `reply_to` preview (mask tombstones). function.json unchanged. |
| `theo_chat_send_message.index.js` / `.function.json` | MODIFY — `deleted` shape parity + mask a deleted reply parent. function.json unchanged. |

## Pass 3 ordering
1. **Walter** runs `vc12_delete_migration.sql` + verify (columns + CHECK + fn must exist before deploy).
2. **Claude Code** deploys the 1 new + 2 overwrites to `vaultgpt-func-chat` (§1E/DR-T7, Kudu VFS), restart, confirm 15 functions, get-back verify, run §CURL.
3. Role-C: API-Spec §2.10 (delete route + tombstone fields) + Schema §3 (`deleted_at`/`deleted_by` + fn + amended immutability note). Then VC-12-FE.
