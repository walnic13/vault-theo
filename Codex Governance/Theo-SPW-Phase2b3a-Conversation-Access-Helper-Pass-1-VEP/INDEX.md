# Codex Governance Package — SPW Phase 2b-3a Conversation-Access Helper (Pass 1 Backend VEP)

- **Main artifact:** `Theo_SPW_Phase2b3a_Conversation_Access_Helper_VEP.md` — Pass-1 backend VEP (plan only; Codex reviews Pass 2).
- **Runnable migration:** `spw_phase2b3a_migration.sql` (== the VEP §DDL, byte-identical) — Walter runs as `pgadmin_vault` at Pass 3.
- **Verify:** `spw_phase2b3a_verify.sql` (== the VEP §VERIFY) — Claude Code runs read-only post-deploy.
- **Scope:** one SECURITY DEFINER helper `theo_conversation_access(uuid) → 'owner'|'member'|NULL` — the single audited home of the publish-to-project read/continue access predicate (the `'member'` branch mirrors the deployed §11 policy set byte-for-byte). Read-only; additive function only; no table/column/policy/row change; RLS unchanged.
- **Why:** the deployed chat handlers BYPASS RLS and gate on `created_by = $oid` app-SQL, so a published transcript is not readable/continuable by a member until the chat handlers call this helper (Phase 2b-3b read; 2b-3c continue). Centralizing the predicate keeps the live-handler edits small + uniform + reviewed-once.
- **Grounding parent:** vault-theo `2fbaae5e43c145360dc4567df53c69a32875a72e`; currency anchors are tip-independent blob SHAs. Carrying commit named in the forward note.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Walter deploys → Claude §VERIFY → schema §11 helper-note Role-C (G-2) → Phase 2b-3b read-broadening handler VEP (G-3) → Phase 2b-3c continue-broadening (G-4).
