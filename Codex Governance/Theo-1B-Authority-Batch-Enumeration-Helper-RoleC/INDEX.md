# Codex Governance Package — Authority: Batch Enumeration Helper carve-out (Role-C)

- **Main artifact:** `Theo_1B_Authority_Batch_Enumeration_Helper_RoleC.md` — Pass-4 Role-C Verbatim-Edit Handoff.
- **Pipeline:** Theo backend regime. Author = Claude Code (Role-C). Inline executor = **Codex** (Pass 4). Governance change **approved by Walter 2026-06-28**.
- **Targets (2 additive edits):** `governance/THEO_GOLDEN_HANDLER_STANDARD.md` §3 item 1 + `spec/THEO_API_SPEC.md` §1 — add a SECURITY DEFINER **enumeration helper** carve-out for scheduled (timer) jobs (identifiers + owner ids only; per-owner processing under set_config). Existence-helper carve-out preserved.
- **Why:** unblocks the B7 distillation RLS-fix (`theo_due_conversations` cross-owner due-scan), which Codex T13-rejected as exceeding the existence-helper-only sanction.
- **HEAD:** vault-theo `98681f130367433dcc0a89e539d782d51417104f`.
- **Lint:** PASS (exit 0).
