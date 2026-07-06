# Deterministic note to Codex — VC-19 Archived-thread write-gate (Pass 1 backend VEP)

Codex — please review the Pass 1 VEP at `Codex Governance/Theo-1B-VC19-Archived-Send-Gate-Backend-Pass-1-VEP/Theo_1B_VC19_Archived_Send_Gate_Backend_VEP.md` (vault-theo `development` @ `f64473b`).

**Open your review with a governance-bound Grounding Conformance Receipt + Rule Anchor Table** (Theo Grounding Conformance Standard §3–§5) and hard-gate the pack against the Codex Theo Backend Review Standard before substantive review. **APPROVED or REJECTED only.**

## What it is
Soft-archive **write-gate** hardening (the gap you flagged): an archived channel is closed to NEW messages. Two MODIFY handlers — `theo_chat_send_message` + `theo_chat_forward_message` — each add `archived_at` to the existing membership-gate `SELECT` and reject a non-NULL value with **409 `CONVERSATION_ARCHIVED`** before any insert.

## Grounding pointers
- **No migration** — `theo_chat_threads.archived_at` is DEPLOYED (VC-16); the pack reads the existing column. No schema / RLS / envelope change.
- **Primary Reference** = the DEPLOYED `theo_chat_send_message` (VC-13 state, blob `5e3ea7a8`), inlined byte-verbatim in §SM; the two §HG modified handlers are inlined full and byte-match the deployable artifacts in this folder (verified this turn).
- **Deltas** are exactly: `SELECT 1`→`SELECT archived_at` in each membership gate + the 409 reject; nothing else. The new 409 rides the existing `isKnown` re-map (no new `catch` branch).
- **TOCTOU** (a concurrent archive between the gate read and the seq-INSERT) is disclosed in §P2.5 as a deliberately-accepted benign race — archived is a cooperative UX write-gate, not a security boundary (membership/RLS unchanged); a `FOR UPDATE` lock was considered and rejected to preserve Primary-Reference parity. Contrast VC-16's leave TOCTOU, which guarded admin authority and WAS locked.
- **Lint:** `node tools/lint_microstep_submission.mjs <vep> --repo-root .` → PASS.

## On APPROVED
No migration. Claude Code deploys the two overwrites to `vaultgpt-func-chat` + golden curls, then the Role-C (Pass 4) API-Spec §2.10 note. VC-19-FE (disabled composer + archived banner + 409 mapping) is a separate vault-origin microstep.
