# Codex Governance Package — SPW Phase 2b-3d API-Spec Role-C

- **Main artifact:** `SPW_Phase2b3d_API_Spec_RoleC.md` — Pass-4 Role-C verbatim-edit handoff (Codex executes).
- **Purpose:** record `theo_get_conversation`'s new per-message `created_by` in `spec/THEO_API_SPEC.md` §2.1 (EDIT 1) + true-up the stale "owner-scoped read / not-owned → 403" wording, since SPW Phase 2b-3b broadened READ to owner-or-published-member (EDIT 2).
- **Edits:** 2 in-place edits in the §2.1 theo_get_conversation row. No other content touched.
- **Pipeline:** Author = Claude Code (Role-C, Pass 4). Executor = Codex. Handler deployed to func-premium + golden-curl-verified; handler package Codex-APPROVED at `1e9b736`.
- **Grounding parent:** vault-theo `1e9b73614e61d72c724d359cd8afa6c46f1af706`; tip-independent blob anchors. Carrying commit named in the forward note.
- This is the T22 authority the Phase 2c FE cites before rendering attribution / relying on member read.
