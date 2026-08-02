# Codex Governance Package — SPW Phase 2b-1 Schema-Doc DEPLOYED Role-C

- **Main artifact:** `Theo_SPW_Phase2b1_Schema_Doc_DEPLOYED_RoleC.md` — Pass-4 Role-C verbatim-edit handoff (Codex executes).
- **Purpose:** record the three SPW Phase 2b-1 publish gate functions as DEPLOYED in `spec/THEO_AZURE_POSTGRES_SCHEMA.md` — one additive note at the end of §11 (`theo_publish_conversation`, `theo_unpublish_conversation`, `theo_list_project_conversations`), citing the committed migration as canonical DDL.
- **Edit:** 1 verbatim append after the §11 closing sentence. No existing-byte change.
- **Pipeline:** Author = Claude Code (Role-C, Pass 4). Executor = Codex. Deployed migration already landed (Walter as `pgadmin_vault`) + read-only-verified this session (`spw_phase2b1_verify.sql`). Canonical migration Codex-APPROVED at `e191121`.
- **Grounding parent:** vault-theo `e1911212b8b52256cf0146dcf1beb9baaa010aeb`; currency anchors are tip-independent blob SHAs. Carrying commit named in the forward note.
