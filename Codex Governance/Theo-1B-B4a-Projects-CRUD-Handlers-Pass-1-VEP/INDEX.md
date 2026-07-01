# Codex Governance Package — Theo 1B B4a Projects CRUD Handlers Pass-1 VEP

- **Main artifact:** `Theo_1B_B4a_Projects_CRUD_Handlers_VEP.md` — Pass-1 backend VEP (plan + complete handlers + one additive migration). Reviewer = Codex (Pass 2).
- **Microstep:** Tier **B4a** — Projects core CRUD over the deployed `theo_projects` table (B2), making the Projects surface real and persistent (today it is in-memory mock and lost on reload). Four GREENFIELD handlers + four `function.json`:
  - `theo_list_projects` (GET) — the caller's projects, newest-updated first.
  - `theo_create_project` (POST) — `name` + optional `description`/`instructions`/`app_key` → 201.
  - `theo_update_project` (POST) — rename + edit description/instructions/app_key (generalizes the v0.1 "patch-instructions" contract, Claude-style).
  - `theo_delete_project` (POST) — permanent; dependents cascade (`theo_project_knowledge`, `theo_user_memory`) / SET NULL (`theo_conversations`, `theo_artifacts`).
- **Migration:** `b4a_migration.sql` — one additive nullable column `theo_projects.description text` (the Projects cards surface a description; B2 deployed `name`/`instructions`/`app_key` only). Read-only verify: `b4a_verify.sql`.
- **Primary Reference:** the **deployed** `theo_create_user_memory` pair (B7a) — same-repo Theo mutation pattern (`set_config` triad, FK-ownership→404, `_exists_unscoped` 403/404, error mapping); inlined byte-identical (§SM/§SM-FJ).
- **Pattern:** Family-B; every query explicitly `created_by = $oid` (connection role bypasses RLS); `theo_project_exists_unscoped` for 403/404; deterministic 400s before SQL.
- **Validation:** all four handlers `node --check` clean; four `function.json` JSON-valid; microstep lint → PASS; HEAD `f3530c4`.
- **Scope boundary:** project *knowledge* CRUD (B4b), the FE mock→live swap (B4c), and conversation↔project wiring (B4d) are the separate following microsteps.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2).
