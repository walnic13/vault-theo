# Codex Governance Package — Theo 1B B8a Attachments Substrate (theo_attachments schema) — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B8a_Attachments_Schema_VEP.md` — Pass-1 Backend VEP (plan only).
- **Deploy file:** `b8a_migration.sql` (== §DDL). Read-only check: `b8a_verify.sql` (== §VERIFY).
- **Microstep:** Tier B8a substrate — `theo_attachments` table (Backend Plan §7 Tier B8 / §5 row): owner-scoped RLS + `theo_attachment_exists_unscoped`; Blob pointer into `theo-content`; FK→theo_conversations. Mirrors the B2/B7a DDL idiom.
- **Scope:** storage substrate only. Upload handler (B8b, gated by D-8) + gateway injection (B8c) + FE (B8d) follow.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Deploy = Walter (Pass 3, as pgadmin_vault); Claude Code runs §VERIFY.
- **HEAD:** vault-theo `3d05cd0ac04fcdc0cf08983bf39c4f27d262e859`.
- **Lint:** PASS (exit 0).
