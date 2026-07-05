# Theo 1B — VC-15 Channel Admin Lifecycle (rename + transfer-admin) Backend — Pass 1 VEP (index)

**Regime:** Theo backend governance (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development`. **Deploy target:** `vaultgpt-func-chat`. **Migration:** NONE.

## Microstep (channels cluster — admin lifecycle, no-migration half)
Two new admin-gated handlers: `theo_chat_rename_channel { thread_id, name }` and `theo_chat_transfer_admin { thread_id, new_admin_oid }`. Both mutate only existing columns (`name`, `admin_oid`) with `member_oids` unchanged, so the deployed thread UPDATE RLS `WITH CHECK (auth.uid() = ANY(member_oids))` holds (admin/caller stays a member). Transfer flips `admin_oid` to a different current member — the reason `admin_oid` was made first-class.

## Why leave + archive are VC-16 (not here)
`leave` removes the CALLER from `member_oids` → violates the thread UPDATE `WITH CHECK` → needs an RLS accommodation (migration). `archive` needs an `archived_at` column (migration). VC-15 is the clean migration-free half; VC-16 carries the one migration for both. (Grounded in the enforced-RLS reality — schema §8's stale "bypasses RLS" sentence is flagged for a separate Role-C.)

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC15_Channel_Rename_Transfer_Backend_VEP.md` | Pass 1 backend VEP (lint PASS): GCR + Rule Anchor Table + P1–P8 + Gap Register + §MIGRATION=none + Primary Reference (`theo_chat_add_member` pair, verbatim) + §HG (rename + transfer, full) + §API-SPEC Role-C + §DEPLOY + §CURL. |
| `theo_chat_rename_channel.index.js` / `.function.json` | NEW — admin rename. |
| `theo_chat_transfer_admin.index.js` / `.function.json` | NEW — admin transfer (new admin must be a different current member). |

## Pass 3 (Claude Code; no Walter DB step)
Deploy both handlers to `vaultgpt-func-chat` (§1E/DR-T7, Kudu VFS), restart, confirm the 2 new functions, run §CURL. Role-C: API-Spec §2.10 (+2 routes). No migration.
