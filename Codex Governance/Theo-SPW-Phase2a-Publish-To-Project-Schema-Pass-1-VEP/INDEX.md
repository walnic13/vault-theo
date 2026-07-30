# Codex Governance Package — Theo SPW Phase 2a: publish-to-project schema/RLS substrate — Pass 1 Backend VEP

- **Main artifact:** `Theo_SPW_Phase2a_Publish_To_Project_Schema_VEP.md` — Pass-1 Backend VEP (plan only).
- **Deploy file:** `spw_phase2a_migration.sql` (== §DDL). Read-only check: `spw_phase2a_verify.sql` (== §VERIFY).
- **Microstep:** SPW Phase 2a — publish-to-project substrate. Adds `published_to_project` (+ `published_at`/`published_by`) to `theo_conversations`; broadens SELECT (conversations+messages) + INSERT (messages) so a PUBLISHED conversation in a project is readable + continuable (multi-party, attributed) by the project's creator/owner/members. Owner-only UPDATE/DELETE unchanged; private-by-default; attribution via existing per-message `created_by`; non-recursive (B5c pattern).
- **Authorization:** sharing/membership RLS out of default 1B scope "unless Walter authorizes" — SPW program authorized 2026-07-30; Phase 2 read+write directed.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Deploy = Walter (Pass 3, `pgadmin_vault`); Claude runs §VERIFY. Then schema-doc §11 Role-C + Phase 2b handlers.
- **Grounding parent:** vault-theo `f1f996d`. Package carried at the review tip (see forward note).
