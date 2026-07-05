# VC-1.2 Channel Membership + Admin — Pass 3 Deploy Evidence

**Feature:** VC-1.2 — first-class channel admin (`admin_oid`) + `add_member`/`remove_member`.
**VEP:** `Theo_1B_VC1_2_Channel_Members_Backend_VEP.md` — **Codex APPROVED** (Pass 2, HEAD `e80832c`; lint PASS; `node --check` clean on all four handlers).
**Authority:** Orchestration §1E / DR-T7 (deploy to `vaultgpt-func-chat` only). **Migration run by Walter** (confirmed) BEFORE deploy. **Date:** 2026-07-05.

---

## 1. Sequence
1. **Walter ran** `vc1_2_admin_migration.sql` (`ADD COLUMN admin_oid` + backfill `= created_by`) — confirmed by Walter and verified live below (list_threads returns `admin_oid`; no 500).
2. **Claude Code deployed** the four handlers via Kudu VFS surgical writes (ARM bearer; no token/secret logged):
   - overwrite `theo_chat_create_channel/index.js` → **204**; `theo_chat_list_threads/index.js` → **204**
   - new `theo_chat_add_member/{index.js,function.json}` → **201/201**; `theo_chat_remove_member/{index.js,function.json}` → **201/201**
   - Baselines confirmed byte-identical before overwrite (create_channel = VC-1; list_threads = VC-8); rollback copies captured.
3. Restart → function inventory now **10** (prior 8 + `theo_chat_add_member` + `theo_chat_remove_member`).

## 2. Authenticated golden curls (az-login token, as `wmansfield@vault-tax.com`; structural only — no OIDs/bodies)

| # | Check | Result |
| - | ----- | ------ |
| 1 | `GET list_threads` — every thread carries `admin_oid` | **200; admin_oid present 5/5** (⇒ migration column exists + list_threads MODIFY live) |
| 2 | `POST create_channel` — `thread.admin_oid` | **201; non-null AND == created_by** (create_channel MODIFY live) |
| 3 | `POST add_member` (bogus UUID) then repeat | **200 added:true**, repeat **200 added:false** (idempotent) |
| 4 | `POST remove_member` (bogus UUID) | **200 removed:true** |
| 5 | `POST remove_member` (the admin) | **400** (admin cannot be removed — transfer first) |
| 6 | `POST add_member` (non-participant thread) | **404** (no existence leak) |

All admin-gate paths behave per the VEP. A non-existent-person UUID (`00000000-…`) was used for add/remove so **no real teammate or real channel was mutated**. Residue: two solo verification channels ("VC-1.2 verify", "VC-1.2 gate-check") created by the caller — harmless, archivable once VC-15 archive lands.

## 3. Boundary
No migration by Claude Code (Walter ran it); no `reporting_*`/monolith/sidecar write; the two modified handlers preserve all prior fields (list_threads keeps `members_read` etc.); RLS unchanged.

## 4. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 (add/remove routes + `admin_oid` on create_channel/list_threads) + Schema `theo_chat_threads.admin_oid`. (Authored alongside — this Role-C owns §2.10 line 91 and folds in the still-pending VC-8 `members_read` edit so the two handoffs don't collide; VC-8's mark_read `read`-event edit remains separate.)
- **VC-1.2-FE:** manage-members UI (roster + add/remove, gated to `admin_oid === self`), consuming the deployed `admin_oid` + add/remove endpoints.
