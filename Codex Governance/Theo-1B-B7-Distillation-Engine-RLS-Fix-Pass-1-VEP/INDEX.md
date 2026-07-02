# Codex Governance Package — Theo 1B B7 Distillation Engine (RLS-FIX) — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B7_Distillation_Engine_RLS_Fix_VEP.md` — Pass-1 Backend VEP (plan only). **Supersedes** `Theo-1B-B7-Distillation-Engine-Pass-1-VEP`.
- **Deploy files:** `b7d2_migration.sql` (§DDL — idempotent column/index + NEW `theo_due_conversations` SECURITY DEFINER scan helper), `theo_distill_memory.index.js` (§HG — revised: uses the helper + per-owner set_config), `theo_distill_memory.function.json` (§FJ — unchanged timerTrigger). `DEPLOY.md` has the steps.
- **Why:** the deployed timer fires fine but scanned `theo_conversations` directly; as a user-less batch under RLS it found 0 rows (logged `0 conversation(s) due`; RO test proved all 12 due). Fix = SECURITY DEFINER cross-owner scan (sanctioned idiom, API Spec §1) + per-owner set_config for the reads/writes. Isolation preserved.
- **Primary Reference:** deployed `theo_message` pair (§SM `f41362bb` + §SM-FJ `bd476fc8`).
- **HEAD:** vault-theo `badd85b91d02bc1f9e3c37c08d1d7bcfdec556ec`.
- **Lint:** PASS (exit 0). Handler node --check clean; migration idempotent.
