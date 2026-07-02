# B4b Project Knowledge CRUD — Walter deploy steps (run after Codex APPROVED)

Three new functions on the shared `vaultgpt-func-premium` app. **No migration**, no env var, no dependency change (the `theo_project_knowledge` table + RLS + `theo_project_knowledge_exists_unscoped` helper are deployed from B2; `pg` + connection vars present).

1. **theo_add_project_knowledge** — create from `theo_add_project_knowledge.index.js` + `.function.json` (POST).
2. **theo_list_project_knowledge** — from `theo_list_project_knowledge.index.js` + `.function.json` (GET).
3. **theo_remove_project_knowledge** — from `theo_remove_project_knowledge.index.js` + `.function.json` (POST).
4. Reply **"B4b deployed"** → Claude Code runs the golden curls (create project → add → list → remove → validation → project-ownership guard → cleanup), captured under `.local/`.

Then the batched B4a+B4b API-Spec §2.2 Projects Role-C lands before the B4c FE-live VEP.
