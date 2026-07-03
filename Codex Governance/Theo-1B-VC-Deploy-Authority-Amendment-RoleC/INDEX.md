# Theo 1B — Scoped Deployment-Authority Amendment — Role-C Verbatim-Edit Handoff (package index)

**Regime:** Theo backend governance. **Type:** Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) — Claude Code authors exact before/after edits; **Codex executes them inline**. **Reviewer/executor:** Codex (APPROVED / REJECTED only). **Lint:** PASS.

## Purpose
Records a **Walter-granted, scoped, dated (2026-07-04)** deployment exception: Claude Code MAY deploy handler/function code to the **dedicated `vaultgpt-func-chat` app only**, after a Codex-APPROVED VEP. Grounded in Orchestration Standard §1A ("sole authority who may grant governance exemptions (explicit, scoped, dated, recorded)"). All other boundaries preserved: DB writes / migrations / merges remain **Walter-only**; the monolith `vaultgpt-func-premium` and streaming sidecar `vaultgpt-func-stream` remain **READ-ONLY / never written by Claude Code**; Claude Code runs only read-only (`SELECT`) verification SQL.

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC_Deploy_Authority_Amendment_RoleC.md` | The handoff: GCR + Rule Anchor Table + Walter directive (verbatim) + 7 verbatim before/after edits across 3 governed docs. |

## The 7 edits (for Codex to apply verbatim)
1–5. `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` — §1A Claude Code role; §1A Walter role; §1B new DR-T7; §1C Executor table Deployment row split; new **§1E Scoped Deployment Authority Exception**.
6. `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` §6 — Authorization boundary carve-out.
7. `governance/THEO_PHASE_1B_BACKEND_PLAN.md` — RACI row carve-out.

## Sequencing
On Codex execution of EDITs 1–7, the amendment is live and the already-APPROVED VC-1 Pass-3 deployment (7 handlers → `vaultgpt-func-chat`) proceeds under §1E, followed by Claude Code's golden-curl verification. No monolith/sidecar write at any point.
