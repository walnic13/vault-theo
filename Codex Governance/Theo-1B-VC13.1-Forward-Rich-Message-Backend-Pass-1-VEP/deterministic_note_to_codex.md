# Deterministic note to Codex — VC-13.1 Forward carries attachment + gif (Pass 1 backend VEP)

Codex — please review the Pass 1 VEP at `Codex Governance/Theo-1B-VC13.1-Forward-Rich-Message-Backend-Pass-1-VEP/Theo_1B_VC13_1_Forward_Rich_Message_Backend_VEP.md` (vault-theo `development` @ `e452a71`).

**Open your review with a governance-bound Grounding Conformance Receipt + Rule Anchor Table** (Theo Grounding Conformance Standard §3–§5) and hard-gate against the Codex Theo Backend Review Standard. **APPROVED or REJECTED only.**

## What it is
The forward-rich-message fix you effectively flagged (disclosed in the VC-10 VEP §P2.5). `theo_chat_forward_message` copied only `body`, so forwarding an attachment-only (VC-9) or gif-only (VC-10) message — body NULL — violated `theo_chat_messages_body_ck` (23514 → 400/500), and a captioned attachment/gif forward dropped the attachment/gif. VC-13.1 carries the source's `attachment_*` + `gif_*` into the copy and projects `attachment`/`gif`.

## Grounding pointers
- **One MODIFY handler; no migration** (the columns are DEPLOYED — VC-9 attachment_*, VC-10 gif_*); no schema/RLS change.
- **Primary Reference** = the DEPLOYED VC-19 `theo_chat_forward_message` (blob `251853a0`, archived-gate state), inlined byte-verbatim §SM; §HG.1 inlined full + byte-matches the deployable artifact (verified this turn).
- **Delta** = source SELECT reads `attachment_*`/`gif_*`; the seq-INSERT column list + SELECT + RETURNING carry them (params `$5..$15`, copied from the source row); shaping projects `attachment` (no raw blob_path — VC-9 parity) + `gif`, then deletes the raw columns. Archived gate + deleted-source 400 + membership + seq-retry + error map byte-identical.
- **Security (§P8):** the copy references the ORIGINAL sender's owner-scoped blob; `theo_chat_attachment_download` gates on the (forwarded) message's thread membership (RLS), NOT blob ownership, so target participants can download and non-participants can't — no access widening. Raw blob_path never projected. CHECKs hold because the copied columns are a verbatim copy of a valid non-deleted source row.
- **No FE change** — the bubble already renders `attachment`/`gif` from `list_messages`.
- **Lint:** `node tools/lint_microstep_submission.mjs <vep> --repo-root .` → PASS.

## On APPROVED
No migration. Claude Code deploys the one overwrite to `vaultgpt-func-chat` (inventory unchanged, 21) + golden curls (incl. the previously-broken attachment-only + gif-only forward → 201, and an attachment_download on the forwarded message → 200), then the Role-C (Pass 4) API-Spec §2.10 note.
