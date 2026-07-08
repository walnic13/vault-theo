# VC-11 Reply-to-Message — Pass 3 Deploy Evidence

**Feature:** VC-11 — a message can quote-reply to an earlier message in the same thread. `theo_chat_messages.reply_to_message_id` + `send_message` accepts/validates/returns a `reply_to` preview + `list_messages` returns it.
**VEP:** `Theo_1B_VC11_Reply_To_Message_Backend_VEP.md` — **Codex APPROVED** (Pass 2, HEAD `542cf0f`; lint PASS; `node --check` clean on both handlers).
**Authority:** Orchestration §1E / DR-T7 (deploy to `vaultgpt-func-chat` only). **Migration run by Walter** (confirmed: "i ran the migration") BEFORE deploy. **Date:** 2026-07-05.

---

## 1. Sequence
1. **Walter ran** `vc11_reply_migration.sql` (`ADD COLUMN IF NOT EXISTS reply_to_message_id uuid NULL` self-FK `ON DELETE SET NULL`) — confirmed by Walter BEFORE any handler deploy; verified live below (send/list carry `reply_to`; no 500).
2. **Claude Code deployed** two overwrites via Kudu VFS surgical writes (ARM bearer; no token/secret logged):
   - overwrite `theo_chat_send_message/index.js` → **204**; `theo_chat_list_messages/index.js` → **204**
   - **Baselines** captured before overwrite: send = 6697 bytes, list = 5452 bytes, `grep -c reply_to = 0/0` (⇒ pre-VC-11 versions); rollback copies retained.
   - **Get-back verification:** both re-fetched and `diff` (modulo CRLF) **MATCH** the approved package source byte-for-byte; deployed `reply_to_message_id` present (send 6 / list 3 occurrences).
3. Restart (drop the warm module cache) → warm-up confirmed (`list_threads` 200). No new function → inventory unchanged at 14.

## 2. Authenticated golden curls (az-login token for `api://4e1a1e31-…`, as `wmansfield@vault-tax.com`; structural only — no OIDs/bodies)

Run end-to-end against a disposable solo channel ("VC-11 verify") created by the caller — **no real teammate/thread mutated**.

| # | Check | Result |
| - | ----- | ------ |
| 1 | `POST send_message` `reply_to_message_id:"nope"` | **400** (UUID guard) |
| 2 | `POST send_message` normal (no reply) | **201**; `message.reply_to_message_id = null`, `message.reply_to = null` (back-compat) |
| 3 | `POST send_message` well-formed but non-existent `reply_to_message_id` | **400** (not a message in this thread) |
| 4 | `POST send_message` replying to the real parent | **201**; `message.reply_to` present, `reply_to.seq = 1` (parent), `reply_to_message_id` set |
| 5 | `GET list_messages` | **200**; parent `reply_to = null`; the reply carries `reply_to` quoting `seq 1` |
| 6 | `POST send_message` bad `thread_id` | **400** (regression) |
| 7 | `POST send_message` non-participant thread | **404** (no existence leak, regression) |

All reply paths behave per the VEP; the live send and the cold `list_messages` render an identical `reply_to`. Residue: one disposable "VC-11 verify" channel by the caller — harmless, archivable via VC-16.

## 3. Boundary
No migration by Claude Code (Walter ran it); no `reporting_*`/monolith (`vaultgpt-func-premium`)/sidecar (`vaultgpt-func-stream`) write. Both modified handlers preserve every prior field + the seq-retry/publish/error map; RLS unchanged (the `theo_chat_message_insert` WITH CHECK is column-agnostic; the `LATERAL` parent read is governed by `theo_chat_message_select`).

## 4. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 `read / send messages` row (reply_to on list + send accepts reply_to_message_id + same-thread 400) + Schema §3 `theo_chat_messages.reply_to_message_id`. Authored alongside as `Theo-1B-VC11-API-Spec-Schema-RoleC/`.
- **VC-11-FE:** a reply affordance on each message + quoted-parent rendering in the composer/bubble, consuming the deployed `reply_to` preview.
