# Codex Governance Package — Theo 1B Greeting By Name (FE) Pass-1 VEP

- **Main artifact:** `Theo_1B_Greeting_By_Name_FE_VEP.md` — Pass-1 Frontend VEP (plan only). Reviewer = Codex (Pass 2).
- **Microstep (Walter-directed):** personalize Theo to the signed-in user. (1) the home landing greets by first name ("Good evening, Walter") — fills the greeting's pre-existing `USER_NAME` slot; (2) the system prompt gains `You are speaking with <full name>.` so Theo knows who it's working with. Both names from the deployed `theo_list_people` (§2.9) `isSelf` row `displayName`.
- **Backend: none.** Reuses the deployed roster (§2.9) via the existing `theoClient.listPeople` (B5c).
- **Proposed source (`proposed-src/theo/`)** — 3 modifications: `lib/prompt.ts` (`greeting(name?)`; `buildSystemPrompt(…, userName?)`), `useTheoState.ts` (derive `selfName`/`selfFullName` from `people`; feed greeting + prompt; expose `loadPeople`), `TheoSurface.tsx` (`loadPeople()` on mount). `swapBlock.ts`/`ChatView.tsx` unchanged.
- **Classification:** greeting = RECONCILED with VA-T1 (existing slot); system-prompt name = behavioral personalization (Walter-directed). Graceful async fill (bare time-of-day until the roster resolves — no wrong-name flash).
- **Validation this turn:** applied to `src` → `tsc` (0) + `eslint` (0) + `build` green (TheoSurface 247.59 KB / 72.75 KB gzip); `src` reverted. Microstep lint → PASS.
- **Currency:** vault-theo HEAD `778ecde`.
- **Pipeline:** on APPROVAL → Pass 3 apply the 3 files to `development` + Walter redeploys the Theo SWA. Ships with the pending `development→main` promotion (alongside B5c-FE + B5d-FE).
