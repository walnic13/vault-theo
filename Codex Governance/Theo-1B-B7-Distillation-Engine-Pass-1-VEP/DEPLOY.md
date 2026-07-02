# DEPLOY — Theo B7 Distillation Engine

> Apply after Codex APPROVES. One migration + one NEW timer function. No env var required (defaults apply); reuses existing Foundry + Postgres settings.

1. Run `b7d_migration.sql` against the shared `vaultgpt` Postgres **as `pgadmin_vault`** (adds `theo_conversations.last_distilled_at` + a partial index; idempotent).
2. Create a NEW function **`theo_distill_memory`** on `vaultgpt-func-premium`: `index.js` = `theo_distill_memory.index.js`, `function.json` = `theo_distill_memory.function.json` (timerTrigger, schedule `0 */15 * * * *`).
3. (Optional) tune via app settings: THEO_DISTILL_IDLE_MINUTES (30), THEO_DISTILL_BATCH (20), THEO_DISTILL_MAX_FACTS (8), THEO_DISTILL_MAX_TOKENS (1024).
4. Reply "B7 distillation deployed" → Claude Code verifies (age an idle conversation → confirm theo_user_memory gains distilled items + last_distilled_at set; cross-user isolation).

Files == VEP §DDL/§HG/§FJ (byte-identical); handler node --check clean.
