# Codex Governance Package — 1B Plan Memory Layer (option C) Amendment (Role-C)

- **Main artifact:** `Theo_1B_Plan_Memory_Layer_C_Amendment_RoleC.md` — Pass-4 Role-C Verbatim-Edit Handoff.
- **Pipeline:** Theo backend regime. Author = Claude Code (Role-C). Inline executor = **Codex** (Pass 4). Plan-content authority = Walter (chose option C).
- **Target:** `governance/THEO_PHASE_1B_BACKEND_PLAN.md` — 8 verbatim additive edits (v0.3→v0.4; §1 memory scope; §5 `theo_user_memory` PROPOSED row; §6 Memory seam row; §7 new Tier B7; §8 D-7 + PRE-LAND summary).
- **What it adds:** Tier B7 — memory layer (option C): B7a distilled per-user memory profile (`theo_user_memory`, Claude-style, user/project scope, user-editable) + B7b cross-chat history-RAG over `theo_messages`; injected at HF-T1 assembly; RLS-scoped.
- **Gates:** D-7 (distillation policy) + D-3 (ZDR, client-PII) + D-5 AI-Search sub-item.
- **Plan-only:** no DDL/handler; schema doc DEPLOYED set untouched (theo_user_memory DDL lands per-microstep at B7).
- **HEAD:** vault-theo `af6433092294376786869d23613618962b4471c4`.
- **Lint:** PASS (exit 0).
