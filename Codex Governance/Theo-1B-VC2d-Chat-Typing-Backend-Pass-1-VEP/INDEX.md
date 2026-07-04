# Theo 1B — VC-2d Chat Typing Indicator (backend `theo_chat_typing`) — Pass 1 Backend VEP (index)

**Regime:** Theo backend governance. **Pass:** 1 (Claude Code VEP, plan-only). **Reviewer:** Codex (Pass 2, APPROVED / REJECTED only). **Deploy:** Claude Code → `vaultgpt-func-chat` under Orchestration §1E/DR-T7 (never monolith/sidecar). **Lint:** PASS.

## Microstep
`theo_chat_typing` — a participant-gated, **ephemeral** typing signal: validates the caller belongs to the thread, then best-effort publishes `{ type:'typing', thread_id, sender_oid }` to the thread's Azure Web PubSub group (`vaultchat`). **No persistence, no schema change, no migration.** Backs the WhatsApp-style "…typing" indicator (FE debounces the ping + renders the bubble — a separate vault-origin FE increment). Client tokens stay **receive-only** — typing is server-relayed (never client-broadcast).

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC2d_Chat_Typing_Backend_VEP.md` | The Pass 1 VEP (GCR + Rule Anchor Table + P1–P8 + §MIGRATION=None + §SM/§SM-FJ Primary Reference + §HG.1 + §PARITY + §DEPLOY + §CURL). Lint PASS. |
| `theo_chat_typing.index.js` / `.function.json` | The handler + binding (POST, anonymous httpTrigger, route `theo_chat_typing`). |

## Key facts
- **Primary Reference** = deployed `theo_chat_send_message` (VC-1) — participant gate + Web PubSub publish; VC-2d is that pattern **minus persistence** (ALLOWED DELTA).
- **No migration / no write / no schema change** — reads one membership-existence row from `theo_chat_threads`; publishes a transient signal.
- **Security:** participant gate (`auth.uid() = ANY(member_oids)`) → non-participant 404, no publish; no new SECURITY DEFINER/elevated-read; receive-only client tokens preserved (server-authoritative relay).
- **Gap Register:** typing not yet in API Spec/Plan → PROCEED with a Role-C future-trigger to add `theo_chat_typing` to API Spec §2.10 (ephemeral; no Schema change).
