# Codex Governance Package — SPW Phase 2b-1 Publish-Gates Schema (Pass 1 Backend VEP)

- **Main artifact:** `Theo_SPW_Phase2b1_Publish_Gates_Schema_VEP.md` — Pass-1 backend VEP (plan only; Codex reviews Pass 2).
- **Runnable migration:** `spw_phase2b1_migration.sql` (== the VEP §DDL, byte-identical) — Walter runs as `pgadmin_vault` at Pass 3.
- **Verify:** `spw_phase2b1_verify.sql` (== the VEP §VERIFY) — Claude Code runs read-only post-deploy.
- **Scope:** three SECURITY DEFINER gate functions driving the deployed Phase 2a publish columns (Schema §11): `theo_publish_conversation(uuid)` (owner-only), `theo_unpublish_conversation(uuid)` (owner-only), `theo_list_project_conversations(uuid)` (member-visible). Reuses the deployed `theo_project_effective_role` (Schema §10). Additive functions only; no table/column/policy/row change; RLS unchanged.
- **Grounding parent:** vault-theo `7a96a654d88fed973aa597d442a2bc62c35094db`; currency anchors are tip-independent blob SHAs. Carrying commit named in the forward note.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Walter deploys → Claude §VERIFY → schema §11 Role-C (G-2) → Phase 2b-2 handlers (G-3) → Phase 2b-3 chat broadening (G-4).
