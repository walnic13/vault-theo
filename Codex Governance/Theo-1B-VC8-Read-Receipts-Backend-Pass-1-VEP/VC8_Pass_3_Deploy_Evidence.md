# VC-8 Read Receipts Backend — Pass 3 Deploy Evidence

**Feature:** VC-8 Teams-style read receipts backend (2 handler MODIFYs; no migration).
**VEP:** `Theo_1B_VC8_Read_Receipts_Backend_VEP.md` — **Codex APPROVED** (Pass 2, HEAD `0e5cdbe`).
**Deploy authority:** Orchestration §1E / DR-T7 (Claude Code MAY deploy handler code to `vaultgpt-func-chat` after a Codex-APPROVED VEP). Monolith + sidecar untouched; no DB write; no migration.
**App:** `vaultgpt-func-chat` (RG `Vault-Tax`, Running). **Date:** 2026-07-05.

---

## 1. Method — Kudu VFS surgical two-file overwrite

Because only two `index.js` files changed and `config-zip` would replace the entire wwwroot (risking node_modules / other functions), the deploy used the Kudu VFS REST API to overwrite exactly the two files — zero blast radius on the other 6 functions or node_modules. Auth: ARM bearer token (`az account get-access-token`, `wmansfield@vault-tax.com`); no credential printed/logged.

## 2. Pre-deploy baseline integrity (rollback safety)

The live deployed files were fetched first (`GET /api/vfs/...`) and confirmed **byte-identical (modulo CRLF)** to the committed VC-1 source — i.e., the MODIFIED handlers were built on the exact deployed baseline:
- `theo_chat_mark_read/index.js` (123 lines) == VC-1 committed → **IDENTICAL**
- `theo_chat_list_threads/index.js` (128 lines) == VC-1 committed → **IDENTICAL**

The captured baselines (`/tmp/cur_*.js`) are the rollback source if ever needed (re-PUT them).

## 3. Deltas deployed (diff vs live baseline)

- `theo_chat_mark_read`: `+ require("@azure/web-pubsub")` + `HUB`; capture `readState`; best-effort post-commit publish `{type:"read", thread_id, reader_oid, last_read_seq}` to `group(threadId)`; return uses `readState`. Nothing else changed.
- `theo_chat_list_threads`: `+ LEFT JOIN LATERAL` aggregating peers' `(member_oid, last_read_seq)` → `members_read` JSON; `+ COALESCE(reads.members_read,'[]'::json)` in SELECT; `+ members_read` normalized projection. Nothing else changed.

(Full diffs captured in the deploy session; deltas match the VEP §HG.1/§HG.2 MODIFIED replacements exactly.)

## 4. Write + verification

| Step | Result |
| ---- | ------ |
| PUT `theo_chat_mark_read/index.js` (If-Match: *) | **HTTP 204** |
| PUT `theo_chat_list_threads/index.js` (If-Match: *) | **HTTP 204** |
| GET-back `mark_read` vs intended payload | **DEPLOYED == INTENDED** |
| GET-back `list_threads` vs intended payload | **DEPLOYED == INTENDED** |
| `az functionapp restart` | issued OK |
| Function inventory after restart | **all 8 present** (create_channel, create_dm, list_messages, list_threads, mark_read, negotiate, send_message, typing) |

## 5. Health probe (unauthenticated → expect 401 EasyAuth, not 500)

| Endpoint | HTTP |
| -------- | ---- |
| `GET /api/theo_chat_list_threads` (modified) | **401** |
| `POST /api/theo_chat_mark_read` (modified) | **401** |
| `POST /api/theo_chat_send_message` (unchanged control) | **401** |

401 (not 500) confirms both modified handlers load and route cleanly — the `@azure/web-pubsub` require in `mark_read` resolves (already used by `send_message`/`typing`), and the new `list_threads` LATERAL parses.

## 5b. Authenticated golden curl (az-login token, as `wmansfield@vault-tax.com`)

EasyAuth (authV2) is enabled on the app: AAD clientId `4e1a1e31-5c20-4480-99e4-098901707d9e`, allowedAudiences `["api://4e1a1e31-5c20-4480-99e4-098901707d9e"]`. A user token minted with `az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e` is accepted by EasyAuth (principal injected), so the handler runs as the signed-in user.

| Check | Result |
| ----- | ------ |
| `GET /api/theo_chat_list_threads` (Bearer) | **HTTP 200** |
| Every thread carries `members_read` | **true** (5/5 threads) |
| `members_read` shape `[{ oid, last_read_seq:int }]` | **shape_ok true** for all threads (DM + channel) |

Structural check only — no OIDs / message bodies / token printed (no-leakage). This verifies the **Teams-"Seen" load path** end-to-end (deployed `list_threads` returns the peer read positions). The live `read` group frame from `mark_read` (the real-time advance) is observed in the browser during **VC-8-FE** testing (needs a WS client); the `mark_read` HTTP contract is unchanged from the already-deployed handler.

## 6. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 delta — `list_threads` gains `members_read`; `mark_read` documented to publish the transient `read` event. (Handoff authored alongside this evidence.)
- **VC-8-FE:** the Teams-style "Seen" indicator + new-messages divider (vault-origin FE VEP) consuming `members_read` + the `read` event.
