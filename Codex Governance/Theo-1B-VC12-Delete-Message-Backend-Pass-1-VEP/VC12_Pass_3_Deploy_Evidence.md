# VC-12 Delete-a-Message — Pass 3 Deploy Evidence

**Feature:** VC-12 — sender "delete for everyone" (soft tombstone; body nulled). New `theo_chat_delete_message` + `list_messages`/`send_message` tombstone masking.
**VEP:** `Theo_1B_VC12_Delete_Message_Backend_VEP.md` — **Codex APPROVED** (Pass 2, HEAD `c69a3f6`; lint PASS; `node --check` clean on all three handlers).
**Authority:** Orchestration §1E / DR-T7 (deploy to `vaultgpt-func-chat` only). **Migration run by Walter** (confirmed: "sql deployed") BEFORE deploy. **Date:** 2026-07-05.

---

## 1. Sequence
1. **Walter ran** `vc12_delete_migration.sql` (`deleted_at`/`deleted_by` + conditional body CHECK relaxation + `SECURITY DEFINER theo_chat_delete_message`) — confirmed BEFORE deploy; verified live below (delete tombstones + masks; no 500).
2. **Claude Code deployed** via Kudu VFS surgical writes (ARM bearer; no token/secret logged):
   - new `theo_chat_delete_message/{index.js,function.json}` → **201/201**
   - overwrite `theo_chat_send_message/index.js` → **204**; `theo_chat_list_messages/index.js` → **204**
   - **Baselines** captured before overwrite: send = 8671 bytes, list = 6726 bytes, no `deleted` marker (⇒ VC-11 versions); rollback copies retained.
   - **Get-back verification:** all three re-fetched and `diff` (modulo CRLF) **MATCH** the approved package source byte-for-byte.
3. Restart → `theo_chat_delete_message` registered; inventory **14 → 15**.

## 2. Authenticated golden curls (az-login token for `api://4e1a1e31-…`, as `wmansfield@vault-tax.com`; structural only — no OIDs/bodies)

End-to-end against a disposable solo channel ("VC-12 verify") created by the caller — **no real teammate/thread mutated**.

| # | Check | Result |
| - | ----- | ------ |
| 1 | `POST delete_message` `message_id:"nope"` | **400** (UUID guard) |
| 2 | `POST delete_message` well-formed non-existent/non-visible id | **404** (RLS-visibility gate) |
| 3 | `POST delete_message` own message | **200** `deleted:true` |
| 4 | repeat delete (idempotent) | **200** `deleted:true` |
| 5 | `GET list_messages` — the deleted message | `deleted:true`, `body:null` (content removed for all) |
| 6 | reply quoting the deleted message | **201**; `reply_to.deleted:true`, `reply_to.body:null` (masked parent preview) |
| 7 | normal send (regression) | **201**; `message.deleted:false` |

All delete paths behave per the VEP; the tombstone masks in `list_messages` and inside a VC-11 `reply_to` preview. The sender-gate 403 is enforced by the handler pre-check AND the `SECURITY DEFINER` re-check (`42501 → 403`); a non-sender path is unreachable solo but structurally covered by both guards. Residue: one disposable "VC-12 verify" channel by the caller — harmless, archivable via VC-16.

## 3. Boundary
No migration by Claude Code (Walter ran it); no `reporting_*`/monolith/sidecar write. The two modified handlers preserve every prior field + the seq-retry/publish/error map. RLS unchanged for the app role (no UPDATE/DELETE policy added); the tombstone write is confined to the sender-scoped `SECURITY DEFINER theo_chat_delete_message` (FOR UPDATE + `sender = caller AND deleted_at IS NULL` re-asserted in the UPDATE).

## 4. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 `read / send messages` row (delete route + `deleted`/`deleted_at` tombstone fields) + Schema §3 `theo_chat_messages` (`deleted_at`/`deleted_by` + the definer fn + the amended immutability note). Authored alongside as `Theo-1B-VC12-API-Spec-Schema-RoleC/`.
- **VC-12-FE:** a delete affordance on the caller's own messages + "This message was deleted" tombstone rendering (incl. inside a reply quote).
