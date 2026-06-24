# Theo-1A-Pass-A-Productionise-Shell-Pass-1-VEP — Index

1. **Package purpose:** plan-only Pass-1 Frontend VEP for **Theo Phase 1A, Pass A** — productionise the canonical reference surface (VA-T1 `frontend/theo-frontend-reference.jsx`) into `vault-theo` as a typed, component-split, faithfully-reproduced **Theo** shell, with every backend-bound call behind a single service/contracts module and a **mocked gateway** (no direct browser→model call). Theo-branded (surgical).
2. **Package scope:** PLAN-ONLY. IN scope: handover §2.1 (lift+componentize), §2.2 (mocked gateway abstraction), §2.3 (single service module), §2.5 (no browser storage), §5 (SWAP BLOCK, Theo branding); the Component Contract Table; per-surface real-in-1A/true-in-1B; acceptance plan. OUT of scope / DEFERRED to Pass B: handover §2.4 app-context chip + §4 `vault-origin` context-broadcast/mount wiring. OUT entirely: implementation (this turn), persistence/RAG/RLS/live gateway (1B), backend handlers (1B), any `corporate-reporting` change, Tailwind conversion, browser storage, surface redesign.
3. **Authoring/grounding HEAD:** `walnic13/vault-theo` · `development` @ `451a4c687b0066a8f61f98bb970bd3c4a4e533f7`.
4. **Reviewer / pass:** Codex Pass 2. Reviewer authority: `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md`.
5. **Controlling review path:** `Theo_1A_Pass_A_VEP_Plan_Only.md`.
6. **Complete file list:**
   - `Theo_1A_Pass_A_VEP_Plan_Only.md` — the Pass-1 Frontend VEP body (GCR + Rule Anchor Table + F-P1–F-P7 walk + Component Contract Table + Gap Disclosure + plan + acceptance).
   - `INDEX.md` — this file.
7. **Submission HEAD:** the package commit on the dev branch (a markdown file cannot embed its own commit SHA; the exact SHA is in the chat handoff). Authoring HEAD `451a4c6` per §3.
8. **Gate result:** **PROCEED** for Pass A (single-repo faithful productionisation + service boundary + mocked gateway + surgical branding), with the app-context layer scoped to **Pass B**.
9. **Implementation status:** **BLOCKED** — plan-only; Pass 3 implementation gated on Codex Pass-2 APPROVED + explicit Walter authorization.
10. **Exact requested action:** **Codex Pass 2 APPROVED / REJECTED** on this plan-only Pass A VEP.
11. **Authority notes:** PRIMARY REFERENCE = VA-T1 (substrate, not greenfield; Golden Component Pack §2); VA-T1/T2/T3 are CURRENT in FE Conformance §4B (sha-verified). The standalone "Theo Phase 1A Frontend Plan" doc is not yet authored — VA-T3 (1A handover) is the governing 1A scope authority (disclosed in §5 Gap Disclosure).

## Boundary

Plan-only VEP. No `vault-theo` runtime/source change in this turn; no `corporate-reporting` change; no `vault-origin` change (Pass A); no backend/handler/schema change; no merge to `main`.
