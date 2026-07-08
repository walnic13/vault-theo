# Theo 1B — VC-8 Teams-Style Read Receipts Backend — Pass 1 VEP (index)

**Regime:** Theo backend governance (lint-gated `tools/lint_microstep_submission.mjs`; Codex Pass 2 APPROVED/REJECTED). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development`. **Deploy target:** `vaultgpt-func-chat` (never monolith/sidecar). **Migration:** NONE.

## Microstep (Walter-preferred Teams "Seen")
Teams-style read receipts. Two deployed VC-1 handlers modified, **no schema change**:
- `theo_chat_list_threads` → adds `members_read: [{ oid, last_read_seq }]` per thread (peers' read positions) so a sender renders "Seen" on load.
- `theo_chat_mark_read` → publishes a transient `{ type:"read", thread_id, reader_oid, last_read_seq }` to the thread's Web PubSub group so "Seen" advances live.

DM-first (group "Seen by N" deferred). FE "Seen" indicator + new-messages divider = separate vault-origin **VC-8-FE** VEP.

## Why no migration
The VC-1 schema already stores per-member `last_read_seq` in `theo_chat_thread_members`, and the deployed `theo_chat_member_select` RLS policy already lets a participant read any member row of their threads. VC-8 reads data that already exists under a policy that already permits it, and reuses the deployed `theo_chat_send_message` Web PubSub publish idiom verbatim. **No DDL → no Walter migration; deploy the two handlers only.**

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC8_Read_Receipts_Backend_VEP.md` | Pass 1 backend VEP (lint PASS): GCR + Rule Anchor Table + P1–P8 + Gap Register + §NO-MIGRATION analysis + Primary Reference (`theo_chat_send_message` pair, verbatim) + both handlers CURRENT + MODIFIED (full replacements) + unchanged function.jsons + §API-SPEC Role-C delta + §DEPLOY + §CURL. |
| `theo_chat_mark_read.index.js` | MODIFIED handler (adds best-effort `read` publish). |
| `theo_chat_list_threads.index.js` | MODIFIED handler (adds `members_read` LATERAL projection). |
| `theo_chat_mark_read.function.json` / `theo_chat_list_threads.function.json` | UNCHANGED bindings (deploy bundle). |

## Pass 3 (Walter)
Deploy the two handlers to `vaultgpt-func-chat` (config-zip full wwwroot with these two index.js swapped in; function.jsons unchanged; `WebPubSubConnectionString` already present). No migration. Then Claude Code runs §CURL; Role-C lands the API-Spec §2.10 delta.
