# Codex Governance Package — Theo 1B B4d-FE Conversation↔Project Wiring Pass-1 VEP

- **Main artifact:** `Theo_1B_B4d_FE_Conversation_Project_Wiring_VEP.md` — Pass-1 frontend VEP (plan). Reviewer = Codex (Pass 2).
- **Microstep:** Tier **B4d (FE)** — wire the FE to the deployed B4d-backend so a chat belongs to its project. Behind the single `theoClient` boundary; **no rendered-surface change**.
  - **Tag on send** — after a project chat's first turn returns a `conversation_id`, `useTheoState.send` calls `theo_set_conversation_project` (idempotent set-once, best-effort).
  - **Restore on reload** — `selectRecent` restores the held `chatProject` (via `loadChatProject`) from the reloaded `conversation.project_id`, loading its knowledge (project chip + context reappear).
- **Changed (4 files in `proposed-src/theo/`):** `services/gateway.live.ts` (+ `setConversationProject`), `services/gateway.mock.ts` (+ no-op), `services/theoClient.ts` (+ passthrough), `useTheoState.ts` (send tag + selectRecent restore).
- **Out of scope (B4e):** the per-project chat list *display* + project-home redesign (chats-first, collapsible knowledge/instructions, artifact-panel close-on-navigate).
- **Contract basis:** deployed + golden-verified B4d handlers (`theo_set_conversation_project`; `theo_list_conversations ?projectId`) + API Spec §2.1 List/Get (return `project_id`). The API-Spec rows for the new endpoints land via a short Role-C (disclosed PRE-LAND G-4) — not Rule-Anchored here.
- **Validation:** 4 files applied to a scratch `src` → `tsc` + `eslint` (exit 0) + `build` clean (TheoSurface 223 KB/67 KB gzip); `src` reverted. Microstep lint → PASS. HEAD `25c590f`.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Pass 3 applies the 4 files, Walter redeploys the Theo SWA.
