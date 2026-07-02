# Codex Governance Package — Theo 1B B4c FE Projects Live-Wiring Pass-1 VEP

- **Main artifact:** `Theo_1B_B4c_FE_Projects_Live_Wiring_VEP.md` — Pass-1 frontend VEP (plan). Reviewer = Codex (Pass 2).
- **Microstep:** Tier **B4c (FE)** — swap the Projects surface off the 1A in-memory store onto the deployed B4a/B4b handlers (API Spec §2.2), so projects + their knowledge persist per-user across reload. Behind the single `theoClient` boundary; **no rendered-surface change** (ProjectsView/ProjectDetail unchanged).
- **Changed (5 files in `proposed-src/theo/`):**
  - `services/gateway.mock.ts` — holds the in-memory projects store (moved from theoClient) + 7 mock fns (standalone-harness fallback).
  - `services/gateway.live.ts` — 7 live functions (`theo_list/create/update/delete_project` + `theo_add/list/remove_project_knowledge`) + `RawProject`/`RawKnowledge`→FE mappers, mock fallback.
  - `services/theoClient.ts` — 7 async passthroughs; in-memory store + `INIT_PROJECTS` import removed.
  - `useTheoState.ts` — `projects` starts `[]`; `loadProjects`; async create/add/remove; **debounced (800ms) instructions save**; `openProject` lazy-loads knowledge.
  - `TheoSurface.tsx` — `void loadProjects()` in the mount effect (after `loadRecents`).
- **Three decisions:** instructions persist on an 800ms debounce (no PATCH-per-keystroke); knowledge lazy-loads on project open (list endpoint omits it); projects load after `configureGateway` (mount effect). `theo_delete_project` exposed but unwired (no delete UI yet).
- **Validation:** the 5 files were applied to a scratch copy of `src` this turn → `npm run typecheck` + `eslint` (exit 0) + `npm run build` clean (TheoSurface 222 KB / 67 KB gzip); `src` then reverted. Microstep lint → PASS. HEAD `7c91527`.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Pass 3 applies the 5 files, Walter redeploys the Theo SWA.
