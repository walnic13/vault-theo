# DEPLOY — Theo B7 Distillation Engine (RLS-fix)

> Apply after Codex APPROVES. Supersedes the prior distillation deploy.

1. Run `b7d2_migration.sql` against the shared `vaultgpt` Postgres **as `pgadmin_vault`** (column/index idempotent — already present; creates the NEW `theo_due_conversations` SECURITY DEFINER function).
2. In the existing **`distillTimer`** function on `vaultgpt-func-premium`, **replace `index.js`** with this folder's `theo_distill_memory.index.js`. Leave `function.json` unchanged.
3. Reply "B7 distillation v2 deployed" → Claude Code verifies (idle conversations + the seed distil into theo_user_memory; last_distilled_at set; cross-owner isolation).

Files == VEP §DDL/§HG/§FJ (byte-identical); handler node --check clean.
