# Codex Governance Package — Theo 1B D4-FE Project-Knowledge RAG Wiring Pass-1 VEP

- **Main artifact:** `Theo_1B_D4_FE_ProjectKnowledge_RAG_Wiring_VEP.md` — Pass-1 frontend VEP (plan). Reviewer = Codex (Pass 2). Open it with the governance-bound GCR + Rule Anchor Table (Theo FE Conformance §3/§5); hard-gate before substance.
- **Microstep:** Tier **D4 (FE)** — wire the FE to the deployed Phase D RAG backend; **no rendered-surface change**.
  - **Send `project_id`** — `useTheoState.send` includes the active `chatProject.id` in the `theo_message_stream` request (via `gateway.live.sendMessageStream`), so D3 retrieves the project's indexed knowledge server-side.
  - **Retire client-side concatenation** — `buildSystemPrompt` no longer inlines all project knowledge + the interim `PER_ITEM_MAX=6000` cap (D1/D2a index on ingest; D3 injects query-relevant items). Project name + instructions stay client-composed.
- **Changed (4 files, staged in `proposed-src/theo/`):** `types.ts` (`GatewayRequest.project_id?`), `useTheoState.ts` (send threads `project_id`; folded pre-existing `let think`→`const think`), `services/gateway.live.ts` (`sendMessageStream` body +`project_id`, stream-only), `lib/prompt.ts` (retire knowledge concat).
- **Contract basis:** deployed + golden-verified D3 (`theo_message_stream` accepts `project_id`); API Spec §2.1 documents it (Role-C applied `b29e2eb`).
- **Validation:** 4 files applied to `src` this turn → `tsc --noEmit` (exit 0) + `eslint` (exit 0; one pre-existing `exhaustive-deps` warning) + `vite build` (exit 0; TheoSurface 297.43 kB / 86.65 kB gzip); `src` reverted. Microstep lint → PASS. HEAD `f7f47ab`.
- **Out of scope / follow-on:** the one-time backfill of pre-existing `theo_project_knowledge` rows (G-3) — a separate governed data op.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Pass 3 commits the 4 files to `development`; the Theo dev SWA serves it (Walter accepts).
