# Codex Governance Package — Theo 1B B2 Schema Doc DEPLOYED (Role-C)

- **Main artifact:** `Theo_1B_B2_Schema_Doc_DEPLOYED_RoleC.md` — Pass-4 Role-C Verbatim-Edit Handoff (lint PASS).
- **Pipeline:** Vault Theo backend regime · Pass 4 Role-C · Author = Claude Code · Executor = **Codex**.
- **HEAD:** vault-theo `2b75acb0e08432d71376b9b9a673c01bb203a5fc` (`development`).
- **Edits (3, one file `spec/THEO_AZURE_POSTGRES_SCHEMA.md`):** EDIT 1 — §3 table statuses PROPOSED → **DEPLOYED — B2** + record as-built additive columns (`seq`, `citations jsonb`, Blob pointers, free-text `app_key`); EDIT 2 — banner SKELETON → **v0.2 Tier B2 DEPLOYED**; EDIT 3 — append **§5 DEPLOYED DDL record** (verification result, Blob container, as-built specifics, and the canonical DDL reference = committed `b2_migration.sql`).
- **Why:** the schema doc is the `theo_*` data-truth owner; B2 deployed + verified, so the doc accretes to DEPLOYED (the additive growth, tier by tier). Canonical DDL is the version-controlled migration (not re-embedded — no drift).
- **Anchors:** all 3 BEFORE blocks found exactly once; lint PASS (exit 0).
