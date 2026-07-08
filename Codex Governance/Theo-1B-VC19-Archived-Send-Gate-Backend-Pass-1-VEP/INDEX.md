# VC-19 — Archived-thread write-gate — Pass 1 Backend VEP (index)

**Regime:** Theo backend (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development` @ `f64473b`. **Lint:** `tools/lint_microstep_submission.mjs` → **PASS**.

## Microstep
Soft-archive **write-gate** hardening (Codex-flagged): an archived channel (VC-16) is closed to NEW messages. `theo_chat_send_message` + `theo_chat_forward_message` gate only membership today — a stale/racing client can still post into an archived channel. VC-19 adds a deterministic **409 `CONVERSATION_ARCHIVED`** to both write paths (the membership-gate `SELECT` now reads `archived_at`; non-NULL → reject before insert). Reading history and forwarding OUT stay allowed.

## Files
| File | Role |
| ---- | ---- |
| `Theo_1B_VC19_Archived_Send_Gate_Backend_VEP.md` | Pass 1 VEP: GCR + Rule Anchor + P1–P8 + §SM + §HG.1/§HG.2 + §API-SPEC + §DEPLOY + §CURL. |
| `theo_chat_send_message.index.js` (MODIFY) | Deployable — adds the archived gate to the membership check. |
| `theo_chat_forward_message.index.js` (MODIFY) | Deployable — adds the archived gate to the TARGET membership check. |
| `theo_chat_send_message.function.json` / `theo_chat_forward_message.function.json` | UNCHANGED (included for byte-exact deploy). |
| `deterministic_note_to_codex.md` | Short pointer Walter forwards to Codex. |

## Scope facts
- **No migration** — `theo_chat_threads.archived_at` shipped in VC-16. **No schema / RLS / envelope change.** One new error code (`CONVERSATION_ARCHIVED`, 409) riding the existing `isKnown` re-map.
- **Two MODIFY handlers**; deltas are byte-verified to be ONLY the gate (`SELECT 1`→`SELECT archived_at` + the 409 reject). `node --check` clean on both; the VEP's inlined code byte-matches these artifacts and the §SM Primary Reference matches the deployed handler.

## Pass 3 (on Codex APPROVE)
No migration. Claude Code deploys the two overwrites to `vaultgpt-func-chat` (Kudu VFS) + golden curls, then the Role-C (Pass 4) API-Spec §2.10 note. **VC-19-FE** (disabled composer + archived banner + 409 mapping) is a separate vault-origin microstep.
