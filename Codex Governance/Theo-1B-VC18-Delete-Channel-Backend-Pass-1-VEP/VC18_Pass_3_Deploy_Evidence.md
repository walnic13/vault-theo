# VC-18 Hard-Delete-a-Channel — Pass 3 Deploy Evidence

**Feature:** VC-18 — admin permanently deletes a channel (cascades messages + members). New `theo_chat_delete_channel`.
**VEP:** `Theo_1B_VC18_Delete_Channel_Backend_VEP.md` — **Codex APPROVED** (Pass 2, HEAD `0af890c`; lint PASS; `node --check` clean).
**Authority:** Orchestration §1E / DR-T7 (deploy to `vaultgpt-func-chat` only). **Migration run by Walter** (confirmed: "migration run") BEFORE deploy. **Date:** 2026-07-05.

---

## 1. Sequence
1. **Walter ran** `vc18_delete_channel_migration.sql` (admin-only `theo_chat_thread_delete` policy) — confirmed BEFORE deploy; verified live below (admin delete cascades; DM rejected; no 500).
2. **Claude Code deployed** via Kudu VFS surgical writes (ARM bearer; no token/secret logged):
   - new `theo_chat_delete_channel/{index.js,function.json}` → **201/201** (confirmed absent — 404 — before the PUT).
   - **Get-back verification:** re-fetched `index.js` `diff` (modulo CRLF) **MATCH** the approved source byte-for-byte.
3. Restart → `theo_chat_delete_channel` registered; inventory **15 → 16**.

## 2. Authenticated golden curls (az-login token for `api://4e1a1e31-…`, as `wmansfield@vault-tax.com`; structural only — no OIDs/bodies)

Against disposable threads created by the caller — **no real teammate/thread mutated**.

| # | Check | Result |
| - | ----- | ------ |
| 1 | `POST delete_channel` `thread_id:"nope"` | **400** (UUID guard) |
| 2 | `POST delete_channel` non-participant thread | **404** (RLS-scoped) |
| 3 | `POST delete_channel` a **DM** | **400** (only a channel can be deleted) |
| 4 | `POST delete_channel` own channel | **200** `deleted:true` |
| 5 | `GET list_threads` after delete | the channel is **gone** |
| 6 | `GET list_messages?threadId=<deleted>` | **404** (thread + messages cascade-removed) |

The cascade is confirmed by #6: with the thread row gone, its messages are gone too (the caller is no longer a participant of a non-existent thread → 404). The non-admin 403 path is covered by the handler pre-check + the RLS DELETE policy (`admin_oid = auth.uid()`); not solo-reproducible. Residue: one disposable DM (bogus-peer) + the deleted channel — harmless.

## 3. Boundary
No migration by Claude Code (Walter ran it); no `reporting_*`/monolith/sidecar write. RLS: one additive admin-only `DELETE` policy on `theo_chat_threads`; no `SECURITY DEFINER`; the delete cascades to `theo_chat_thread_members` + `theo_chat_messages` via the existing VC-1 FKs. The delete is execution-time-guarded (`FOR UPDATE` + `admin_oid = caller AND kind='channel'` in the `DELETE` + 0-row → 403).

## 4. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 admin-lifecycle row (the delete route) + Schema §8 (the admin-only `theo_chat_thread_delete` policy — amends the "no DELETE" note). Authored alongside as `Theo-1B-VC18-API-Spec-Schema-RoleC/`.
- **VC-17-FE:** the per-channel ⋯ menu (Rename / Archive / **Delete** / Leave, role-gated) + the `+`-into-list move + the rename-propagation fix (kills the observed rename-revert bug). Delete is now T22-eligible once this Role-C is committed.
