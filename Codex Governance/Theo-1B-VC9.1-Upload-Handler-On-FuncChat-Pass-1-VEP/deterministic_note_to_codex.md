# Deterministic note to Codex — VC-9.1 Deploy `theo_create_attachment_upload` to func-chat (Pass 1 backend VEP)

Codex — please review the Pass 1 VEP at `Codex Governance/Theo-1B-VC9.1-Upload-Handler-On-FuncChat-Pass-1-VEP/Theo_1B_VC9_1_Upload_Handler_On_FuncChat_VEP.md` (vault-theo `development` @ `1f35c8e`).

**Open your review with a governance-bound Grounding Conformance Receipt + Rule Anchor Table** (Theo Grounding Conformance Standard §3–§5) and hard-gate the pack against the Codex Theo Backend Review Standard before substantive review. **APPROVED or REJECTED only.**

## What it is
Host-parity only: deploy the DEPLOYED, already-approved `theo_create_attachment_upload` (B8b SAS-signature-fix, blob `bc1aa7c5`) **byte-identically** to `vaultgpt-func-chat`. **No code change, no migration, no contract change → no Role-C.** Walter-decided (over the cross-app alternative) so the chat attachment flow (upload + send + list + download) is all on the func-chat host the FE client already targets (`VITE_CHAT_API_BASE_URL`).

## Grounding pointers
- **Primary Reference** = the deployed `theo_create_attachment_upload` (blob `bc1aa7c5`), inlined byte-verbatim §SM; §HG.1 deploys those exact bytes to func-chat (no diff). `node --check` clean; inlined code byte-matches the artifact.
- **No new external system (Golden §4):** Blob is already used by func-chat — VC-9's `theo_chat_send_message` (blob HEAD) + `theo_chat_attachment_download` (user-delegation read SAS) were deployed + curl-verified there this session. This handler uses the same MI technique (`cw` SAS). func-chat's MI has Storage Blob Data Contributor (includes `generateUserDelegationKey`).
- **No DB/RLS** — stateless SAS issuer. Owner-scoped key `attachments/<oid>/<uuid>`.
- **Note:** the live monolith Kudu SCM was not reachable this turn (HTTP 000); the approved package blob `bc1aa7c5` is used as the governance source of truth (it is the last Codex-approved change to this handler — later B8 tiers touched `theo_finalize_attachment`). Disclosed §P2.5.
- **Lint:** `node tools/lint_microstep_submission.mjs <vep> --repo-root .` → PASS.

## On APPROVED
No migration. Claude Code deploys the handler to `vaultgpt-func-chat` (inventory 20→21) + a golden curl (SAS mints on func-chat MI + a PUT to the SAS works). No Role-C. Then VC-9-FE.
