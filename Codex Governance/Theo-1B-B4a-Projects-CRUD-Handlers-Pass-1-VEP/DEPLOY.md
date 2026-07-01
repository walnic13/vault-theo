# B4a Projects CRUD — Walter deploy steps (run after Codex APPROVED)

One additive migration + four new functions on the shared `vaultgpt-func-premium` app. No env var, no dependency change (`pg` + connection vars already present from B2/B3).

1. **Migration.** Run `b4a_migration.sql` against `vaultgpt-postgres-prod` (adds the nullable `theo_projects.description` column; inherits existing RLS policies).
2. **theo_list_projects** — create the function from `theo_list_projects.index.js` + `theo_list_projects.function.json` (GET).
3. **theo_create_project** — from `theo_create_project.index.js` + `.function.json` (POST).
4. **theo_update_project** — from `theo_update_project.index.js` + `.function.json` (POST).
5. **theo_delete_project** — from `theo_delete_project.index.js` + `.function.json` (POST).
6. Reply **"B4a deployed"** → Claude Code runs `b4a_verify.sql` (read-only) + the golden curls (create → list → update → delete → validation → cross-user isolation), captured under `.local/`.

Then the short API-Spec §2.2 Projects Role-C (naming the four deployed endpoints) lands before the B4c FE-live VEP cites it.
