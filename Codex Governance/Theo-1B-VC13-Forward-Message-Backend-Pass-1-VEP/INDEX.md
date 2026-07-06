# Theo 1B — VC-13 Forward-a-Message Backend — Pass 1 VEP (index)

**Regime:** Theo backend governance (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development` @ `0b23197`. **Deploy target:** `vaultgpt-func-chat`. **Migration:** YES (Walter, first). The forward piece of the message-actions trio (VC-11 reply / VC-12 delete / VC-13 forward).

## Microstep
A participant **forwards** a message they can see into another thread they belong to (WhatsApp-style); the copy is marked "Forwarded". The source is read under RLS + copied server-side; provenance (`forwarded_from_message_id`) is stored but only a `forwarded` **boolean** is ever exposed (cross-thread privacy).

## Migration (Walter, before deploy)
`ALTER TABLE public.theo_chat_messages ADD COLUMN IF NOT EXISTS forwarded_from_message_id uuid NULL REFERENCES public.theo_chat_messages(id) ON DELETE SET NULL`. No RLS change (the `theo_chat_message_insert` WITH CHECK is column-agnostic + enforces target membership); no new index.

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC13_Forward_Message_Backend_VEP.md` | Pass 1 backend VEP (lint PASS): GCR + Rule Anchor + P1–P8 + Gap Register + §MIGRATION (+verify) + Primary Reference (deployed `theo_chat_send_message` pair, byte-verbatim) + §HG.1 forward (NEW) + §HG.2 list_messages (MODIFY) + §HG.3 send_message (MODIFY) + §API-SPEC/Schema Role-C + §DEPLOY + §CURL. |
| `vc13_forward_migration.sql` | Migration: `forwarded_from_message_id` self-FK. |
| `theo_chat_forward_message.index.js` / `.function.json` | NEW — reads source under RLS (404/400) + target membership (404) + copies body into target with `forwarded_from_message_id`; best-effort publish. |
| `theo_chat_list_messages.index.js` / `.function.json` | MODIFY — project the `forwarded` boolean (raw origin id never exposed). function.json unchanged. |
| `theo_chat_send_message.index.js` / `.function.json` | MODIFY — carry `forwarded:false` for shape parity. function.json unchanged. |

## Pass 3 ordering
1. **Walter** runs `vc13_forward_migration.sql` + verify (column + self-FK before deploy).
2. **Claude Code** deploys 1 new + 2 overwrites to `vaultgpt-func-chat` (§1E/DR-T7, Kudu VFS), restart, confirm 17 functions, get-back verify, run §CURL.
3. Role-C: API-Spec §2.10 (forward route + `forwarded`) + Schema §3 (`forwarded_from_message_id`). Then VC-13-FE.
