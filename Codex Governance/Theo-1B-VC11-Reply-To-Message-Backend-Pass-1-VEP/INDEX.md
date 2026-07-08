# Theo 1B — VC-11 Reply-to-Message Backend — Pass 1 VEP (index)

**Regime:** Theo backend governance (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development` @ `0c95e02`. **Deploy target:** `vaultgpt-func-chat`. **Migration:** YES (Walter, first). First of the message-actions trio (VC-11 reply / VC-12 delete / VC-13 forward).

## Microstep
A message can **quote-reply** to an earlier message in the **same thread** (WhatsApp-style). The reply persists a pointer; the send response, the realtime publish, and `list_messages` all carry a bounded `reply_to` preview so the quote renders identically live and on cold load.

## Migration (Walter, before deploy)
`ALTER TABLE public.theo_chat_messages ADD COLUMN IF NOT EXISTS reply_to_message_id uuid NULL REFERENCES public.theo_chat_messages(id) ON DELETE SET NULL`. No RLS change (the `theo_chat_message_insert` WITH CHECK is column-agnostic); no new index (parent resolves by PK). `ON DELETE SET NULL` is defensive — VC-12 is a soft delete, so a reply keeps pointing at its tombstone.

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC11_Reply_To_Message_Backend_VEP.md` | Pass 1 backend VEP (lint PASS): GCR + Rule Anchor + P1–P8 + Gap Register + §MIGRATION (+verify) + Primary Reference (`theo_chat_send_message` pair, deployed byte-verbatim) + §HG.1 send_message MODIFY + §HG.2 list_messages MODIFY + §API-SPEC/Schema Role-C + §DEPLOY + §CURL. |
| `vc11_reply_migration.sql` | Migration: `reply_to_message_id` self-FK (`ON DELETE SET NULL`). |
| `theo_chat_send_message.index.js` / `.function.json` | MODIFY — accepts optional `reply_to_message_id`, validates same-thread, returns/publishes the `reply_to` preview. function.json unchanged. |
| `theo_chat_list_messages.index.js` / `.function.json` | MODIFY — LEFT JOIN LATERAL the parent for a `reply_to` preview (null when not a reply). function.json unchanged. |

## Pass 3 ordering
1. **Walter** runs `vc11_reply_migration.sql` + verify (column + self-FK must exist before deploy).
2. **Claude Code** overwrites the two handlers on `vaultgpt-func-chat` (§1E/DR-T7, Kudu VFS), restart, get-back verify, run §CURL.
3. Role-C: API-Spec §2.10 `read / send messages` row + Schema §3 `theo_chat_messages.reply_to_message_id`. Then VC-11-FE.
