# Codex Governance Package — SPW Phase 1b API-Spec Role-C

- **Main artifact:** `SPW_Phase1b_API_Spec_RoleC.md` — Pass-4 Role-C verbatim-edit handoff (Codex executes).
- **Purpose:** record SPW Phase 1b (role-aware sharing) as-built in `spec/THEO_API_SPEC.md` — one additive in-cell clause on the §2 share/unshare/list-members row: share/unshare now creator-or-owner (add/remove Members; owner-status mutation Creator-only); list-members returns `role` + `self_role`; NEW `theo_set_project_member_role` (Creator-only).
- **Edit:** 1 verbatim append after the §2 sentence "Writes (share/unshare) stay owner-only; only the owner invites/revokes." No other change.
- **Pipeline:** Author = Claude Code (Role-C, Pass 4). Executor = Codex. The Phase-1b handlers are already deployed + golden-verified (vault-projects `93e83c1`).
- **Grounding parent:** vault-theo `59b0687`; target API-spec blob `60a2d548`. Package carried at the review tip (see forward note).
