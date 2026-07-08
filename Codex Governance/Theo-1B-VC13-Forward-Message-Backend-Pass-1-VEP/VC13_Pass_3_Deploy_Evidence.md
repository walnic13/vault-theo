# VC-13 Forward-a-Message — Pass 3 Deploy Evidence

**Feature:** VC-13 — forward a message you can see into another thread you belong to (marked "Forwarded"). New `theo_chat_forward_message` + `list_messages`/`send_message` `forwarded` projection.
**VEP:** `Theo_1B_VC13_Forward_Message_Backend_VEP.md` — **Codex APPROVED** (Pass 2, HEAD `3037164`; lint PASS; `node --check` clean on all three).
**Authority:** Orchestration §1E / DR-T7 (deploy to `vaultgpt-func-chat` only). **Migration run by Walter** (confirmed: "sql migrated") BEFORE deploy. **Date:** 2026-07-06.

---

## 1. Sequence
1. **Walter ran** `vc13_forward_migration.sql` (`ADD COLUMN IF NOT EXISTS forwarded_from_message_id uuid NULL` self-FK `ON DELETE SET NULL`) — confirmed BEFORE deploy; verified live below (forward copies + marks; no 500).
2. **Claude Code deployed** via Kudu VFS surgical writes (ARM bearer; no token/secret logged):
   - new `theo_chat_forward_message/{index.js,function.json}` → **201/201** (confirmed absent — 404 — before the PUT).
   - overwrite `theo_chat_send_message/index.js` → **204**; `theo_chat_list_messages/index.js` → **204**.
   - **Baselines** captured before overwrite: send = 9123 bytes, list = 7122 bytes, no `forwarded` marker (⇒ VC-12 versions); rollback copies retained.
   - **Get-back verification:** all three re-fetched and `diff` (modulo CRLF) **MATCH** the approved package source byte-for-byte.
3. Restart → `theo_chat_forward_message` registered; inventory **16 → 17**.

## 2. Authenticated golden curls (az-login token for `api://4e1a1e31-…`, as `wmansfield@vault-tax.com`; structural only — no OIDs/bodies)

End-to-end against two disposable solo channels (A with a message, B empty) created by the caller — **no real teammate/thread mutated**.

| # | Check | Result |
| - | ----- | ------ |
| 1 | `POST forward_message` bad `message_id`/`to_thread_id` | **400** (UUID guards) |
| 2 | `POST forward_message` non-existent/non-visible source | **404** |
| 3 | `POST forward_message` a real A-message → non-participant target | **404** |
| 4 | `POST forward_message` A-message → B | **201**; `message.forwarded === true`, `body` equals the source body, `thread_id === B` |
| 5 | `GET list_messages?threadId=B` | the forwarded message present with `forwarded:true` + copied body |
| 6 | `POST forward_message` a **deleted** source (deleted in A first) | **400** (cannot forward a deleted message) |
| 7 | Regression: `POST send_message` (normal) | **201**; `message.forwarded === false` |

All forward paths behave per the VEP; the body is copied server-side and only the `forwarded` boolean is exposed (the raw origin id is never returned). Residue: two disposable channels ("VC-13 verify A/B") by the caller — harmless, archivable via VC-16.

## 3. Boundary
No migration by Claude Code (Walter ran it); no `reporting_*`/monolith/sidecar write. RLS unchanged: the source read rides `theo_chat_message_select` (forward only what you can see → 404); the target INSERT is governed by the column-agnostic `theo_chat_message_insert` WITH CHECK (member of the target thread, as self). No `SECURITY DEFINER`. `forwarded_from_message_id` is stored but never projected (only the `forwarded` boolean).

## 4. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 `read / send messages` row (forward route + `forwarded` field) + Schema §3 `theo_chat_messages.forwarded_from_message_id`. Authored alongside as `Theo-1B-VC13-API-Spec-Schema-RoleC/`.
- **VC-13-FE:** a "Forward" affordance on a message + a target-thread picker + a "Forwarded" label; closes the reply/delete/forward message-actions FE.
