# Deterministic note to Codex — VC-10 GIF picker (Path A: hardened GIPHY proxy) — Pass 1 backend VEP

Codex — please review the Pass 1 VEP at `Codex Governance/Theo-1B-VC10-GIF-Picker-Backend-Pass-1-VEP/Theo_1B_VC10_GIF_Picker_Backend_VEP.md` (vault-theo `development` @ `5da33d5`).

**Open your review with a governance-bound Grounding Conformance Receipt + Rule Anchor Table** (Theo Grounding Conformance Standard §3–§5) and hard-gate the pack against the Codex Theo Backend Review Standard before substantive review. **APPROVED or REJECTED only.**

## What it is
A WhatsApp-style GIF picker (Walter-decided **Path A** — GIPHY via a hardened server-side proxy, not a self-hosted import). Migration adds seven `gif_*` columns to `theo_chat_messages` (+ gif-aware body CHECK + gif coherence + attach/gif mutual-exclusion). Two NEW handlers (`theo_chat_gif_search` server-side GIPHY proxy; `theo_chat_send_gif` resolve-by-id + insert) + two MODIFY (`list_messages` projects `gif` masked-on-tombstone; `send_message` carries `gif:null`).

## Grounding pointers
- **GIPHY is a NEW external system (Golden §4)** — this is the crux to scrutinize. Justified §P3 under Walter's Path A decision, hardened: `GIPHY_API_KEY` server-side only (already set); search proxied + sanitized (no payload passthrough); `rating=pg-13`; **send resolves by id** (`/v1/gifs/{id}`, id strictly `^[A-Za-z0-9]{1,64}$`, URL-encoded) so the client never supplies a URL (no SSRF/stored-XSS); egress-only to `api.giphy.com`; upstream failures → 429 `RATE_LIMITED` / 502 `UPSTREAM_ERROR`. The residual Path-A exposure (search-term egress + CDN hotlinking of history) is deliberately accepted + documented §P3/§P8; CSP + attribution are VC-10-FE obligations.
- **Primary Reference** = the DEPLOYED VC-9 `theo_chat_send_message` (blob `92053b2`), inlined byte-verbatim §SM; `send_gif` mirrors its insert+seq+publish+**archived (VC-19) gate**. All four handlers inlined full and byte-match the deployable artifacts (verified this turn).
- **Migration ordering:** VC-10's migration DROPs/ADDs `theo_chat_messages_body_ck` to extend VC-9's widened form (adds the `gif_id` presence term) — it runs AFTER the VC-9 migration (landed @ `5da33d5`). §DEPLOY states this.
- **Tombstone masking:** deleted gif messages mask `gif` to `null` in `list_messages` (VC-12 parity, mirroring VC-9's attachment mask).
- **Discovered adjacent gap (out of scope, disclosed §P2.5):** `theo_chat_forward_message` (VC-13) copies only `body`; forwarding an attachment-only/gif-only message would violate the body CHECK. Recommend a future VC-13.x fix — flagged for your awareness, not fixed here.
- **Lint:** `node tools/lint_microstep_submission.mjs <vep> --repo-root .` → PASS. No MI/Search role needed (Path A uses GIPHY, not vaultgpt-search).

## On APPROVED
Walter runs `vc10_gif_migration.sql` (after VC-9's); Claude Code deploys the 2 new handlers + 2 overwrites to `vaultgpt-func-chat` (inventory 18→20) + golden curls (GIPHY key already set), then the Role-C (Pass 4). VC-10-FE is a separate vault-origin microstep.
