# Codex Governance Package — Theo 1B B2 Persistence Substrate — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B2_Persistence_Substrate_VEP.md` — full Pass-1 Backend VEP (plan only) with the complete Walter-executable DDL.
- **Pipeline:** Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Deploy = Walter (Pass 3); Claude Code verifies (read-only SQL).
- **HEAD:** vault-theo `9e1620a8d7a12ffb93d3446d4d8e0c1e1e4658b4` (`development`).
- **Microstep:** Tier B2 — the `theo_*` persistence substrate: 7 tables (`theo_projects`, `theo_conversations`, `theo_messages`, `theo_project_knowledge`, `theo_artifacts`, `theo_artifact_versions`, `theo_user_settings`) + RLS (4 ownership policies each, `auth.uid()`) + `_exists_unscoped` helpers + Blob content container. Foundation for B3/B4 persistence and the memory layer (C).
- **Mirrors** the deployed corporate-reporting ownership-RLS pattern (referenced, not forked); `auth.uid()`/`set_config` pre-exist in the shared `vaultgpt` instance.
- **Walter-approved design (this turn):** `app_key text NULL` (no CHECK yet), `citations jsonb` on `theo_messages`, Blob for artifact-version bodies + large knowledge (messages inline), RO-SQL verification.
- **Gaps:** Blob container (PRE-LAND deploy prereq); ZDR/client-PII (PRE-LAND, D-3); memory tables deferred to the memory tier; no handler in scope (B3+ wires CRUD).
- **Lint:** PASS (exit 0).
- **Requested verdict:** Codex APPROVED or REJECTED.
