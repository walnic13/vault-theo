# VC-13.1 Forward carries attachment + gif — Pass 3 Deploy Evidence

**Feature:** VC-13.1 — `theo_chat_forward_message` now carries the source's `attachment_*` + `gif_*` into the forwarded copy (was `body`-only). One MODIFY handler; no migration.
**VEP:** `Theo_1B_VC13_1_Forward_Rich_Message_Backend_VEP.md` — **Codex APPROVED** (Pass 2, HEAD `5434bf1`; lint PASS; `node --check` clean).
**Authority:** Orchestration §1E / DR-T7 (deploy to `vaultgpt-func-chat` only). **No migration; no Role-C-blocking dependency.** **Date:** 2026-07-07.

---

## 1. Deploy (Kudu VFS surgical PUT; ARM bearer; no token logged)
- Baseline get-back **byte-matches** the deployed VC-19 forward (blob `251853a0`).
- `theo_chat_forward_message/index.js` → **204** (overwrite, `If-Match: *`); **get-back byte-matches** the approved package source.
- Restart → inventory **21 → 21** (MODIFY only). `function.json` UNCHANGED (not re-deployed).

## 2. Authenticated golden curls (az-login token for `api://4e1a1e31-…`, as `wmansfield@vault-tax.com`; structural — no OIDs/bodies)

Two disposable channels A (source) + B (target); in A: a text message, an **attachment-only** message (26-byte blob uploaded to `attachments/<oid>/<uuid>`), and a **gif-only** message (via `gif_search` → `send_gif`).

| # | Check | Expected | Result |
| - | ----- | -------- | ------ |
| 1 | forward the **text** message A→B | 201, `attachment:null`, `gif:null` | **201** `forwarded:true`, `attachment:null`, `gif:null` (regression) |
| 2 | forward the **attachment-only** message A→B | 201 + `attachment` (was **400** pre-fix) | **201**; `attachment = { filename:"vc131.txt", content_type:"text/plain", byte_size:26 }`; **no raw `attachment_blob_path`** |
| 3 | forward the **gif-only** message A→B | 201 + `gif` | **201**; `gif = { provider:"giphy", id, url (media*.giphy.com), preview_url, width:172, height:200, title }`; `attachment:null` |
| 4 | `attachment_download` on the **forwarded** attachment message | 200 | **200** `filename:"vc131.txt"` (**target participant can download the forwarded blob — message-membership-gated, not owner-gated**) |

The two previously-broken paths (attachment-only + gif-only forward) now succeed and round-trip the content; the raw blob_path is never projected; the forwarded attachment is downloadable by the target participant. Text forward + the deleted-source 400 / archived-target 409 / non-participant 404 gates are unchanged.

## 3. Boundary
No migration; no schema/RLS change (the `theo_chat_message_insert` WITH CHECK is column-agnostic; the copy carries a verbatim valid source-row shape, so the body/coherence/exclusion CHECKs hold). Deploy target `vaultgpt-func-chat` only. The attachment copy references the ORIGINAL sender's blob; `theo_chat_attachment_download` gates on the forwarded message's thread membership (RLS), not blob ownership — no access widening. Gif copies the stored GIPHY URLs (no fresh GIPHY call).

**Residue:** two disposable channels ("VC-13.1 A/B") + a 26-byte test blob — harmless.

## 4. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 `read / send messages` row — note that forward carries the source's `attachment`/`gif`. No Schema delta (columns already documented §3). Authored alongside as `Theo_1B_VC13_1_API_Spec_RoleC.md`.
- **No FE change** — the bubble already renders `attachment`/`gif` from `list_messages`; a forwarded rich message now displays correctly with no FE work.
