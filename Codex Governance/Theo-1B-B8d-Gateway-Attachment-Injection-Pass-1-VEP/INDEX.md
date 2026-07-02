# Codex Governance Package — Theo 1B B8d Gateway Attachment Injection — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B8d_Gateway_Attachment_Injection_VEP.md` — Pass-1 backend VEP (plan only).
- **Deploy files:** `theo_message.index.js` (== §H; extends the deployed B7b-2 gateway) + `theo_message.function.json` (unchanged).
- **Microstep:** Tier B8d — `theo_message` accepts optional top-level `attachment_ids`; for each owner-scoped attachment it injects a native PDF/image base64 content block or the extracted text (from extracted_text_path) into the upstream user turn only, token/size-budgeted; links attachments to the conversation. Additive: zero-attachment path is byte-identical to deployed B7b-2.
- **Diff-verified additive (§CHANGESET):** new constants/requestBinary/MI blob helpers (EXACT mirror of deployed B8b/B8c — Golden §3, no T12)/buildAttachmentBlocks/attachment_ids validation/owner-scoped fetch/messages→messagesForUpstream/conversation linkage. Only existing-logic edit: lastUser→lastUserIndex (behaviour-identical userText).
- **Primary Reference:** deployed theo_message (B7b-2, blob 4eb4ed62) + function.json (bd476fc8), full verbatim.
- **PRE-LAND:** G-1 redeploy theo_message only (no migration/dep/env). G-2 MI Storage role already live (B8b/B8c).
- **Scope:** theo_message only.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Deploy = Walter (Pass 3); Claude Code runs the "read my uploaded PDF/XLSX" golden round-trip.
- **HEAD:** vault-theo `32592bab5c46430c6ebcf92e84536398d411558a`.
- **Lint:** PASS (exit 0).
