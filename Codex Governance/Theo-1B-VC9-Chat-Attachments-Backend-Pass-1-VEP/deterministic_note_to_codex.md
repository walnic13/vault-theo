# Deterministic note to Codex — VC-9 Chat attachments (Pass 1 backend VEP)

Codex — please review the Pass 1 VEP at `Codex Governance/Theo-1B-VC9-Chat-Attachments-Backend-Pass-1-VEP/Theo_1B_VC9_Chat_Attachments_Backend_VEP.md` (vault-theo `development` @ `e6b88df`).

**Open your review with a governance-bound Grounding Conformance Receipt + Rule Anchor Table** (Theo Grounding Conformance Standard §3–§5) and hard-gate the pack against the Codex Theo Backend Review Standard before substantive review. **APPROVED or REJECTED only.**

## What it is
Chat attachments under the Walter-confirmed **"attachment IS a message"** model (one file per bubble). A migration adds four nullable `attachment_*` columns to `theo_chat_messages` + relaxes the body CHECK (attachment-only messages) + a coherence CHECK. Two MODIFY handlers (`send_message` accept/validate/HEAD/persist/project; `list_messages` project) + one NEW handler (`theo_chat_attachment_download` — membership-gated read SAS). The DEPLOYED `theo_create_attachment_upload` (cw SAS) is **reused unchanged**.

## Grounding pointers
- **Primary Reference** = the DEPLOYED `theo_chat_send_message` (VC-19 state, blob `fc7ef0e4`), inlined byte-verbatim in §SM; the two §HG.1/§HG.2 modified handlers + the §HG.3 new handler are inlined full and byte-match the deployable artifacts in the folder (verified this turn).
- **No new external system:** the download handler reuses the DEPLOYED MI user-delegation SAS technique — the full deployed signer (`theo_create_attachment_upload`, blob `bc1aa7c5`) is inlined in **§EXT** so §HG.3's signer is byte-diffable (it changes only `sp="r"` + adds a signed `rscd` Content-Disposition; the canonical string-to-sign field positions are identical). The send path reuses the DEPLOYED `theo_finalize_attachment` blob-HEAD technique for the authoritative size.
- **Security (§P8):** a caller may only attach `attachments/<own-oid>/<uuid>` (send re-asserts the owner prefix + UUID id); the client-claimed size is ignored (blob HEAD is authoritative); only allow-listed content-types; the raw blob_path is NEVER projected — downloads are per-request, membership-gated (RLS `theo_chat_message_select`), single-blob, read-only, 15-min. No RLS change (the insert policy is column-agnostic).
- **No migration by Claude Code** — Walter runs `vc9_attachment_migration.sql` at Pass 3 FIRST (additive/reversible; verify SQL included).
- **Lint:** `node tools/lint_microstep_submission.mjs <vep> --repo-root .` → PASS.

## On APPROVED
Walter runs the migration; Claude Code deploys the NEW download handler + two overwrites to `vaultgpt-func-chat` (inventory 17→18) + golden curls, then the Role-C (Pass 4) API-Spec §2.10 + Schema §3 deltas. VC-9-FE is a separate vault-origin microstep.
