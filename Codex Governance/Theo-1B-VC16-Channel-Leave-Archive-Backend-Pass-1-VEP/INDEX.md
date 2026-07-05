# Theo 1B — VC-16 Channel Leave + Archive Backend — Pass 1 VEP (index)

**Regime:** Theo backend governance (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development`. **Deploy target:** `vaultgpt-func-chat`. **Migration:** YES (Walter, first). Completes the channels cluster.

## Microstep
- **leave** — a channel member removes THEMSELVES (`theo_chat_leave_channel`); admin must transfer first.
- **archive** — admin soft-archives (`theo_chat_archive_channel` → `archived_at`); `list_threads` filters archived out.

## Migration (Walter, before deploy)
`ALTER TABLE theo_chat_threads ADD COLUMN archived_at timestamptz` + a narrowly-scoped `SECURITY DEFINER theo_chat_leave(uuid)`. The leave function exists because the thread UPDATE `WITH CHECK (auth.uid()=ANY(member_oids))` blocks self-removal for the app role; the function (owned by the migration role; tables ENABLE-not-FORCE RLS) bypasses it but removes ONLY the authenticated caller, only from a channel they belong to and don't admin. `EXECUTE` → authenticated; `REVOKE ALL FROM PUBLIC`; `search_path` pinned. Same justified class as the B7 SECURITY DEFINER helper.

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC16_Channel_Leave_Archive_Backend_VEP.md` | Pass 1 backend VEP (lint PASS): GCR + Rule Anchor + P1–P8 + Gap Register + §MIGRATION (+verify) + Primary Reference (`theo_chat_transfer_admin` pair) + §HG (leave + archive NEW; list_threads MODIFIED) + §API-SPEC/Schema Role-C + §DEPLOY + §CURL. |
| `vc16_leave_archive_migration.sql` | Migration: `archived_at` + `SECURITY DEFINER theo_chat_leave(uuid)` + grants. |
| `theo_chat_leave_channel.index.js` / `.function.json` | NEW — self-service leave (validates, then calls the definer fn). |
| `theo_chat_archive_channel.index.js` / `.function.json` | NEW — admin soft-archive (execution-time guarded). |
| `theo_chat_list_threads.index.js` / `.function.json` | MODIFIED — `AND t.archived_at IS NULL`. |

## Pass 3 ordering
1. **Walter** runs `vc16_leave_archive_migration.sql` + verify (column + function must exist before deploy).
2. **Claude Code** deploys the 2 new + 1 overwrite to `vaultgpt-func-chat` (§1E/DR-T7, Kudu VFS), restart, confirm 2 new functions, run §CURL.
3. Role-C: API-Spec §2.10 (leave/archive routes) + Schema (`archived_at` + `theo_chat_leave`). Then VC-16-FE.
