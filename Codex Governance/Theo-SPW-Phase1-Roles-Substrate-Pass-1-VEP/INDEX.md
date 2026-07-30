# Codex Governance Package — Theo Shared Project Workspace Phase 1: role model on `theo_project_members` — Pass 1 Backend VEP

- **Main artifact:** `Theo_SPW_Phase1_Roles_Substrate_VEP.md` — Pass-1 Backend VEP (plan only).
- **Deploy file:** `spw_phase1_migration.sql` (== §DDL). Read-only check: `spw_phase1_verify.sql` (== §VERIFY).
- **Program:** Shared Project Workspace (Walter-approved design 2026-07-30). **Phase 1 "Roles & permissions" foundation.**
- **Microstep:** add a `role` (owner|member) column to the deployed `theo_project_members` + five governed SECURITY DEFINER gate functions (`theo_project_effective_role`, `_list_members`, `_add_member`, `_set_member_role`, `_remove_member`) enforcing Creator / Owner / Member. Substrate only — Phase 1b wires the handlers.
- **Model:** Creator = `theo_projects.created_by` (implicit; mints/demotes Owners); Owner (creator ∨ `role='owner'`) adds/removes Members + lists roster; Member has no management power. RLS UNCHANGED (function-gated writes; B5c non-recursion preserved).
- **Authorization:** sharing/membership RLS is out of default 1B scope "unless Walter authorizes" (Backend Plan; Schema §1) — Walter authorized 2026-07-30 (precedent: B5a/B5c).
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Deploy = Walter (Pass 3, as `pgadmin_vault`); Claude Code runs §VERIFY.
- **HEAD:** vault-theo `fad23986222fbb876d031c92c6f49fe50d3bbfd8`.
