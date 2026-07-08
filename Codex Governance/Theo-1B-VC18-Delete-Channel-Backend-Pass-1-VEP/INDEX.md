# Theo 1B — VC-18 Hard-Delete-a-Channel Backend — Pass 1 VEP (index)

**Regime:** Theo backend governance (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development` @ `de8c6d2`. **Deploy target:** `vaultgpt-func-chat`. **Migration:** YES (Walter, first). The true hard-delete Walter asked for, alongside VC-16's soft archive ("Both").

## Microstep
A channel **admin permanently deletes** a channel; its messages + members are removed by the existing `ON DELETE CASCADE` FKs. Irreversible; admin-only; channel-only.

## Migration (Walter, before deploy)
An admin-only `DELETE` policy on `theo_chat_threads`: `theo_chat_thread_delete FOR DELETE TO authenticated USING (admin_oid = auth.uid())`. No column, no `SECURITY DEFINER` — the app role had no DELETE policy (VC-1 = SELECT/INSERT/UPDATE only), and the child FKs already cascade. A DM has `admin_oid` NULL → not deletable; the handler also requires `kind='channel'` + the execution-time admin guard (FOR UPDATE + admin-in-DELETE + 0-row→403), mirroring VC-15/VC-16.

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC18_Delete_Channel_Backend_VEP.md` | Pass 1 backend VEP (lint PASS): GCR + Rule Anchor + P1–P8 + Gap Register + §MIGRATION (+verify) + Primary Reference (`theo_chat_archive_channel` pair, deployed byte-verbatim) + §HG.1 delete_channel (NEW) + §API-SPEC/Schema Role-C + §DEPLOY + §CURL. |
| `vc18_delete_channel_migration.sql` | Migration: admin-only `theo_chat_thread_delete` policy. |
| `theo_chat_delete_channel.index.js` / `.function.json` | NEW — admin-gated cascade delete (FOR UPDATE + admin-in-DELETE + 0-row→403; best-effort `channel_deleted` publish). |

## Pass 3 ordering
1. **Walter** runs `vc18_delete_channel_migration.sql` + verify (the DELETE policy must exist before deploy).
2. **Claude Code** deploys the 1 new function to `vaultgpt-func-chat` (§1E/DR-T7, Kudu VFS), restart, confirm 16 functions, get-back verify, run §CURL.
3. Role-C: API-Spec §2.10 (delete route) + Schema §8 (the DELETE policy). Then **VC-17-FE** (the per-channel ⋯ menu with delete/archive/rename/leave + the `+`-into-list move).
