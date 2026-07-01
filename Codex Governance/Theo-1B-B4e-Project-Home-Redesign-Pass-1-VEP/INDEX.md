# Codex Governance Package — Theo 1B B4e Project-Home Redesign Pass-1 VEP

- **Main artifact:** `Theo_1B_B4e_Project_Home_Redesign_VEP.md` — Pass-1 frontend VEP (plan). Reviewer = Codex (Pass 2).
- **Microstep:** Tier **B4e (FE)** — the project-home redesign Walter directed: `ProjectDetail` becomes a home for its chats. **A Walter-authorized VISUAL-AUTHORITY-DEVIATION** from the VA-T1 layout (cited + classified + Rule-Anchored per FE Governor).
  - **Chats-first** — per-project chat list (`theo_list_conversations?projectId`, B4d) + "New chat in this project"; empty state when none.
  - **Collapsible** Project knowledge + Custom instructions (expanded until the project has chats, then collapsed; user-toggleable).
  - **Artifact-panel scope** — panel shows only in chat/artifacts views (no longer lingers on the project home) and clears on thread switch.
- **Changed (6 files in `proposed-src/theo/`):** `components/ProjectDetail.tsx` (redesign), `components/TheoMain.tsx` (props + artifact gate), `useTheoState.ts` (`projectChats` + `loadProjectChats` + artifact-close), `services/gateway.live.ts` + `gateway.mock.ts` + `theoClient.ts` (`listProjectConversations`).
- **No backend change** — consumes the deployed B4d `?projectId` list. API-Spec row lands via the in-flight B4d Role-C (disclosed PRE-LAND G-4).
- **Validation:** 6 files applied to a scratch `src` → `tsc` + `eslint` (exit 0) + `build` clean (TheoSurface 225.7 KB / 67.8 KB gzip); `src` reverted. Microstep lint → PASS. HEAD `2287265`.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Pass 3 applies the 6 files, Walter redeploys the Theo SWA (Visual Acceptance Evidence).
