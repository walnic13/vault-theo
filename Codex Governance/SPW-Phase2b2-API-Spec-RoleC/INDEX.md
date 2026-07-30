# Codex Governance Package — SPW Phase 2b-2 API-Spec Role-C

- **Main artifact:** `SPW_Phase2b2_API_Spec_RoleC.md` — Pass-4 Role-C verbatim-edit handoff (Codex executes).
- **Purpose:** record the three deployed SPW Phase 2b-2 publish contracts in `spec/THEO_API_SPEC.md` §2.2 — one new table row (`theo_publish_conversation` / `theo_unpublish_conversation` / `theo_list_project_conversations`) that also supersedes the B5a/B5c "config-only … no chat transcripts are shared" clause (publish-to-project is the first transcript sharing).
- **Edit:** 1 verbatim table-row insertion before the project-knowledge row. No existing-byte change.
- **Pipeline:** Author = Claude Code (Role-C, Pass 4). Executor = Codex. Handlers deployed to `vaultgpt-func-projects` (`pkg-f98f640`) + golden-curl-verified; handler package Codex-APPROVED at vault-projects `2f749b8`.
- **Grounding parent:** vault-theo `48a9dc682ed438c9f86fd698c5b4be2028b75c4c`; currency anchors are tip-independent blob SHAs. Carrying commit named in the forward note.
- This is the T22 authority the Phase 2c FE cites before wiring the publish control.
