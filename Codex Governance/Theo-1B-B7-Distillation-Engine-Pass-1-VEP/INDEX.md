# Codex Governance Package — Theo 1B B7 Distillation Engine — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B7_Distillation_Engine_VEP.md` — Pass-1 Backend VEP (plan only).
- **Deploy files:** `b7d_migration.sql` (§DDL — adds `theo_conversations.last_distilled_at` + index), `theo_distill_memory.index.js` (§HG — timer function), `theo_distill_memory.function.json` (§FJ — timerTrigger, 15-min CRON). `DEPLOY.md` has the steps.
- **Microstep:** Tier B7 distillation — a timer function scans idle conversations and runs a cheap Foundry-Claude extraction (≤8 durable facts as JSON, dedup vs existing memory) → writes `theo_user_memory` with `created_by` = the conversation owner. Auto-populates memory (B7a CRUD curates; injection recalls). Implements D-7 RESOLVED.
- **NEW binding:** `timerTrigger` (first timer in Theo; no deployed precedent) — disclosed (G-2). Handler code idiom mirrors deployed `theo_message` (Foundry + pg); Primary Reference pair = `theo_message` handler (§SM, `f41362bb`) + function.json (§SM-FJ, `bd476fc8`).
- **Isolation/safety:** explicit `created_by` per write; per-conversation transactions + error isolation + watermark-on-failure; bounded batch (≤20 calls/tick); extraction-only (no web tools). node --check clean; migration idempotent.
- **Gates:** ungated (D-3 ZDR + D-7 RESOLVED).
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Deploy = Walter (Pass 3); Claude Code verifies.
- **HEAD:** vault-theo `056f9b35046c7063a40b49bf84eeb4c688053972`.
- **Lint:** PASS (exit 0).
