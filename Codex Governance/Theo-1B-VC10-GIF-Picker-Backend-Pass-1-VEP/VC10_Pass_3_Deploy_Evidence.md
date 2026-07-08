# VC-10 GIF Picker (Path A) — Pass 3 Deploy Evidence

**Feature:** VC-10 — WhatsApp-style GIF picker (Path A: hardened server-side GIPHY proxy). Migration (7 `gif_*` cols + gif-aware body CHECK + gif coherence + attach/gif exclusion) + NEW `theo_chat_gif_search` (GIPHY search proxy) + NEW `theo_chat_send_gif` (resolve-by-id + insert) + MODIFY `theo_chat_send_message` (`gif:null` parity) + MODIFY `theo_chat_list_messages` (gif projection, masked on tombstone).
**VEP:** `Theo_1B_VC10_GIF_Picker_Backend_VEP.md` — **Codex APPROVED** (Pass 2, HEAD `b9edad5`; lint PASS; `node --check` clean ×4).
**Authority:** Orchestration §1E / DR-T7 (deploy to `vaultgpt-func-chat` only). **Migration run by Walter** ("migration ran") AFTER the VC-9 migration. **`GIPHY_API_KEY`** already set on func-chat. No MI/Search role needed (Path A uses GIPHY). **Date:** 2026-07-07.

---

## 1. Migration verification (read-only, `codex_reporting_ro`, run BEFORE deploy)
- **V1** — the seven columns exist: `gif_provider` (text), `gif_id` (text), `gif_url` (text), `gif_preview_url` (text), `gif_width` (integer), `gif_height` (integer), `gif_title` (text), all nullable. ✓
- **V2** — three CHECKs present: `theo_chat_messages_body_ck` + `theo_chat_messages_gif_ck` + `theo_chat_messages_attach_gif_excl_ck`. ✓
- **V3** — body CHECK confirmed gif-aware: `… AND ((body IS NOT NULL) OR (attachment_blob_path IS NOT NULL) OR (gif_id IS NOT NULL))` (gif-only allowed); gif coherence = core three all-present-or-all-null; exclusion = `(attachment_blob_path IS NULL) OR (gif_id IS NULL)`. ✓ Matches the approved §MIGRATION exactly.

## 2. Deploy (Kudu VFS surgical PUT; ARM bearer; no token logged)
- Baselines byte-match: live send == deployed VC-9; live list == deployed VC-9; `gif_search`/`send_gif` **absent** (404) pre-deploy.
- `theo_chat_send_message/index.js` → **204**; `theo_chat_list_messages/index.js` → **204** (overwrites, `If-Match: *`).
- NEW `theo_chat_gif_search/{index.js,function.json}` → **201/201**; NEW `theo_chat_send_gif/{index.js,function.json}` → **201/201**.
- **Get-back** of all four re-fetched and `diff` (modulo CRLF) **byte-matches** the approved package source.
- Restart → inventory **18 → 20**; `theo_chat_gif_search` + `theo_chat_send_gif` registered.

## 3. Authenticated golden curls (az-login token for `api://4e1a1e31-…`, as `wmansfield@vault-tax.com`; structural — no OIDs/bodies)

A disposable channel + a live GIPHY search that captured a real `gif_id` (`111ebonMs90YLu`, host `media4.giphy.com`).

| # | Check | Expected | Result |
| - | ----- | -------- | ------ |
| 1 | `gif_search` `{query:"thumbs up", limit:3}` | 200, gifs>0 | **200**, 3 gifs, `cached:false`; each `{id,url,preview_url,width,height}`; url host `media4.giphy.com` (**server-side GIPHY proxy works**) |
| 2 | `gif_search` empty query / `limit:"1.5"` | 400 / 400 | **400** `INVALID_REQUEST` / **400** `INVALID_REQUEST` |
| 3 | `send_gif` real id (no body) | 201, full `gif`, no raw cols | **201**; `gif={provider:giphy,id,url,preview_url,width:268,height:200,title}`; no raw `gif_*` in payload; `attachment:null` (**resolve-by-id + parseInt dims work**) |
| 4 | `send_gif` bad-charset id / well-formed nonexistent id | 400 / 400 | **400** `INVALID_REQUEST` / **400** `INVALID_REQUEST` (gif not found) |
| 5 | `send_gif` into archived channel / non-member thread | 409 / 404 | **409** `CONVERSATION_ARCHIVED` / **404** `NOT_FOUND` |
| 6 | `list_messages` | gif msg carries `gif`, no raw cols; plain msg `gif:null` | **✓** gif msg `gif={giphy:111ebonMs90YLu}`, `hasRawGif=false`, `attachment:null`; plain msg `gif:null` |
| 7 | `send_message` (normal) | 201, `gif===null` | **201**, `gif:null` (shape parity) |
| 8 | delete gif msg → list masks | 200 / `deleted:true`+`gif:null` | **200**; list shows `deleted:true` + `gif:null` (tombstone mask) |

The server-side GIPHY proxy + resolve-by-id are proven; the client never supplies a URL; the raw gif columns are never projected; `gif` is masked on a tombstone (VC-12 parity). GIPHY width/height (strings) are stored as ints.

## 4. Boundary
Migration run by Walter (after VC-9's). Deploy targets `vaultgpt-func-chat` only; monolith + sidecar READ-ONLY. RLS unchanged (the `theo_chat_message_insert` WITH CHECK is column-agnostic). GIPHY is a NEW external system (Golden §4) — key server-side only (`GIPHY_API_KEY`), egress-only to `api.giphy.com`; the stored gif URLs are public GIPHY CDN URLs (no secret persisted). No MI/Storage/Search role needed.

**Residue:** two disposable channels ("VC-10 verify", "VC-10 archived") owned by the caller — harmless, archivable.

## 5. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 (gif_search + send_gif routes + `gif` field) + Schema §3 (`theo_chat_messages` gif columns + gif-aware body CHECK + gif coherence + attach/gif exclusion). Authored alongside as `Theo_1B_VC10_API_Spec_Schema_RoleC.md`.
- **VC-10-FE:** search box + animated grid + tap-to-send + "Powered by GIPHY" attribution + a `media*.giphy.com`-scoped CSP.
- **Discovered adjacent gap (VC-13.x):** `theo_chat_forward_message` copies only `body`, so forwarding an attachment-only/gif-only message would violate the body CHECK — recommend a future fix.
- **GIPHY key hygiene:** the beta key was shared in plaintext earlier; recommend rotating it in the GIPHY dashboard + updating the `GIPHY_API_KEY` app setting once the integration is confirmed.
