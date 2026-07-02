# DEPLOY — Theo B7a Memory CRUD Handlers

> Apply after Codex APPROVES. Four NEW functions on `vaultgpt-func-premium`. No migration, no env var, no dependency.

1. `theo_list_user_memory`  → index.js = `theo_list_user_memory.index.js`; function.json = `theo_list_user_memory.function.json` (GET/OPTIONS).
2. `theo_create_user_memory` → `theo_create_user_memory.index.js` + `.function.json` (POST/OPTIONS).
3. `theo_update_user_memory` → `theo_update_user_memory.index.js` + `.function.json` (POST/OPTIONS).
4. `theo_delete_user_memory` → `theo_delete_user_memory.index.js` + `.function.json` (POST/OPTIONS).
5. Reply "B7a handlers deployed" → Claude Code runs the golden curls (create→list→update→delete→validation→cross-user isolation).

Each file == the VEP §HG/§FJ inline (byte-identical); handlers are `node --check` clean.
