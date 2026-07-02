# Codex Governance Package — Theo 1B B7a Memory Substrate (theo_user_memory schema) — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B7a_Memory_Substrate_Schema_VEP.md` — Pass-1 Backend VEP (plan only).
- **Deploy file:** `b7a_migration.sql` (== §DDL). Read-only check: `b7a_verify.sql` (== §VERIFY).
- **Microstep:** Tier B7a substrate — the `theo_user_memory` table (Memory Layer option C; Backend Plan §7 Tier B7 / §5 row). One table, 4-policy ownership RLS, `_exists_unscoped` helper; FKs to deployed B2 tables. Mirrors the B2 DDL idiom.
- **Scope:** storage substrate ONLY. Distillation engine + injection + B7b history-RAG are gated (D-7 / D-3 ZDR / D-5 AI Search); CRUD handlers (with explicit created_by per the SEC fix) follow as the next microstep. None of those are in this pack.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Deploy = Walter (Pass 3, as pgadmin_vault); Claude Code runs §VERIFY.
- **HEAD:** vault-theo `2aa663c28573ab6e17c4a08764c588bd18aa2680`.
- **Lint:** PASS (exit 0).
- **Requested verdict:** Codex APPROVED or REJECTED.
