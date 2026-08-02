# Codex Governance Package — SPW Phase 2a Schema-Doc DEPLOYED Role-C

- **Main artifact:** `Theo_SPW_Phase2a_Schema_Doc_DEPLOYED_RoleC.md` — Pass-4 Role-C verbatim-edit handoff (Codex executes).
- **Purpose:** record Shared Project Workspace Phase 2a (Publish-to-Project) as DEPLOYED in `spec/THEO_AZURE_POSTGRES_SCHEMA.md` — one additive `## §11` section (three publish columns + partial index + three broadened RLS policies; five owner-only policies untouched), citing the committed migration as canonical DDL.
- **Edit:** 1 verbatim append after the §10 (SPW Phase 1 Roles) closing sentence. No existing-byte change.
- **Pipeline:** Author = Claude Code (Role-C, Pass 4). Executor = Codex. Deployed migration already landed (by Walter as `pgadmin_vault`) + read-only-verified this session (`spw_phase2a_verify.sql`). Canonical migration Codex-APPROVED at `b438453`.
- **Grounding parent:** vault-theo `b438453e523c617224c6acda2848a10b248c931b`; currency anchors are tip-independent blob SHAs. Carrying commit named in the forward note.
