# Theo 1B — VC-1.2 Channel Membership + First-Class Admin (backend) — Pass 1 VEP (index)

**Regime:** Theo backend governance (lint-gated `tools/lint_microstep_submission.mjs`; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development`. **Deploy target:** `vaultgpt-func-chat`. **Migration:** YES (Walter, first).

## Microstep (channels cluster, item 2 — Walter chose first-class admin from the start)
Channel membership management with an explicit administrator. A migration adds `theo_chat_threads.admin_oid` (backfilled `= created_by`); `create_channel` stamps it; `list_threads` projects it (FE gates the manage UI to the admin); new `theo_chat_add_member` / `theo_chat_remove_member` are admin-gated (`admin_oid = caller`). Private/invite-only; the admin cannot be removed (transfer = VC-15).

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC1_2_Channel_Members_Backend_VEP.md` | Pass 1 backend VEP (lint PASS): GCR + Rule Anchor Table + P1–P8 + Gap Register + §MIGRATION (+verify) + Primary Reference (`create_channel` pair) + §HG (create_channel MODIFIED, list_threads CURRENT/MODIFIED, add_member + remove_member NEW, function.jsons) + §API-SPEC/Schema Role-C + §DEPLOY + §CURL. |
| `vc1_2_admin_migration.sql` | Migration: `ADD COLUMN admin_oid` + backfill `= created_by`. |
| `theo_chat_create_channel.index.js` | MODIFIED — stamps `admin_oid = creator`. |
| `theo_chat_list_threads.index.js` | MODIFIED — projects `admin_oid`. |
| `theo_chat_add_member.index.js` / `.function.json` | NEW — admin-gated append. |
| `theo_chat_remove_member.index.js` / `.function.json` | NEW — admin-gated removal (can't remove the admin). |
| `theo_chat_create_channel.function.json` / `theo_chat_list_threads.function.json` | UNCHANGED (deploy bundle). |

## Pass 3 ordering (critical)
1. **Walter** runs `vc1_2_admin_migration.sql` + verify (column must exist before deploy).
2. **Claude Code** deploys the 4 handlers to `vaultgpt-func-chat` (§1E/DR-T7, Kudu VFS), restarts, confirms the 2 new functions, runs §CURL.
3. Role-C: API-Spec §2.10 (add/remove routes + `admin_oid`) + Schema (`admin_oid`).

## Note
No RLS change (admin enforced in-handler; thread UPDATE policy holds — admin always a member). No new external system. Enterprise admin model chosen by Walter. VC-1.2-FE (manage-members UI) + VC-15 (transfer/rename/archive, uses admin_oid) follow.
