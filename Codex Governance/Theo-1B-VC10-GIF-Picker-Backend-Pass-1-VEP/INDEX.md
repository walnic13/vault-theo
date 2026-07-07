# VC-10 — WhatsApp-style GIF picker (Path A: hardened GIPHY proxy) — Pass 1 Backend VEP (index)

**Regime:** Theo backend (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development` @ `5da33d5`. **Lint:** PASS. **Walter decisions:** WhatsApp-style GIF experience; **Path A** (GIPHY via hardened server-side proxy, not a self-hosted import) after weighing the security tradeoff; API (not SDK) key; `GIPHY_API_KEY` already set on func-chat.

## Microstep
Search a GIF, tap to send; sent GIFs render inline (hotlinked from GIPHY's CDN, ToS-compliant). Migration adds seven `gif_*` columns to `theo_chat_messages` (+ gif-aware body CHECK + coherence + attach/gif exclusion). NEW `theo_chat_gif_search` (server-side GIPHY proxy — key server-side, sanitized, `rating=pg-13`, 120s cache) + NEW `theo_chat_send_gif` (resolves the gif by id against GIPHY server-side — client sends only the id, never a URL). MODIFY `list_messages` (project `gif`, masked on tombstone) + `send_message` (`gif:null` parity).

## Files
| File | Role |
| ---- | ---- |
| `Theo_1B_VC10_GIF_Picker_Backend_VEP.md` | Pass 1 VEP: GCR + Rule Anchor + P1–P8 + §MIGRATION + §SM + §HG.1–§HG.4 + §API-SPEC + §DEPLOY + §CURL. |
| `vc10_gif_migration.sql` | Walter-run migration (7 gif cols + gif-aware body CHECK + gif coherence + attach/gif exclusion). **Runs AFTER the VC-9 migration.** |
| `theo_chat_gif_search.index.js` (NEW) + `.function.json` | Server-side GIPHY search proxy. |
| `theo_chat_send_gif.index.js` (NEW) + `.function.json` | Resolve-by-id + insert + publish. |
| `theo_chat_send_message.index.js` (MODIFY) + fj | `gif:null` shape parity (on the VC-9 base). |
| `theo_chat_list_messages.index.js` (MODIFY) + fj | `gif` projection, masked on tombstone (on the VC-9 base). |
| `deterministic_note_to_codex.md` | Short pointer Walter forwards to Codex. |

## Key facts
- **GIPHY is a NEW external system** (Golden §4) — justified §P3 under Walter's Path A; hardened (key server-side, sanitized proxy, rating-pinned, resolve-by-id, egress-only). Residual exposure (search-term egress + CDN hotlinking incl. history) is the documented, accepted Path A tradeoff.
- **Migration ordering:** extends VC-9's body CHECK → runs AFTER VC-9's migration (landed @ `5da33d5`).
- **Discovered adjacent gap (out of scope, disclosed §P2.5):** `theo_chat_forward_message` copies only `body`, so forwarding an attachment-only or gif-only message would violate the body CHECK — recommend a future VC-13.x fix.
- All four handlers `node --check` clean; inlined code byte-matches artifacts; Primary Reference = deployed VC-9 send. No RLS change. No MI/Search role needed (Path A uses GIPHY).

## Pass 3 (on Codex APPROVE)
Walter runs the migration (after VC-9's); Claude Code deploys 2 new + 2 overwrites to `vaultgpt-func-chat` (inventory 18→20) + golden curls (GIPHY key already set), then the Role-C (Pass 4). **VC-10-FE** (search box + animated grid + tap-to-send + "Powered by GIPHY" attribution + `media*.giphy.com` CSP) is a separate vault-origin microstep.
