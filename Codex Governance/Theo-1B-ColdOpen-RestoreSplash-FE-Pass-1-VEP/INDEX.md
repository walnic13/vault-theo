# Codex Governance Package — Theo 1B Cold-open Restore Splash FE Pass-1 VEP

- **Main artifact:** `Theo_1B_ColdOpen_RestoreSplash_FE_VEP.md` — Pass-1 frontend VEP (plan). Reviewer = Codex (Pass 2). Open it with the governance-bound GCR + Rule Anchor Table (Theo FE Conformance §3/§5).
- **Microstep:** on cold app open, Theo mounts to the new-chat greeting, then `loadRecents` settles and a restore effect reopens the last chat — the user sees the greeting **flash** then flip (Walter, mobile: "goes to the main theo screen for a moment then flips to the previous chat — janky"). Hold a **branded splash** (warm sand `#E9D6B6` + Spiral of Theodorus — matching the deployed PWA boot splash) from mount until the restore resolves, so the app opens **splash → last chat** (or greeting if nothing to restore).
- **Changed (4 files, staged in `proposed-src/`):**
  - `components/SpiralMark.tsx` (**NEW**) — the spiral mark; SVG inlined **byte-verbatim** from the deployed `vault-origin/public/icon.svg` (renders identically standalone + federated).
  - `useTheoState.ts` — restore gate: `restoring` (init true) + `recentsLoaded`; `loadRecents` `finally` marks loaded; the restore effect resolves `restoring` (drop on in-chat/composing/empty, else restore then drop); returns `restoring`.
  - `components/ChatView.tsx` — `ChatViewProps.restoring?`; `RestoringSplash` (full-cover `#E9D6B6` + centered `SpiralMark`); render while `restoring`.
  - `components/TheoMain.tsx` — passes `restoring={t.restoring}`.
- **Visual classification:** the splash = **VISUAL-AUTHORITY-DEVIATION** (new-in-Theo surface, faithful reproduction of the deployed Origin PWA splash) anchored to Golden Pack §5; steady-state chat surface = **VISUAL-AUTHORITY-MATCH**; the gate = **ALLOWED DELTA**. Only registered VA-T1 cited (T21-safe). **No `localStorage`/`sessionStorage`** (Governor §6.3). Walter SWA (open app on mobile → splash → last chat, no flash) = Visual Acceptance Evidence.
- **Contract:** none — restore ordering already server-sourced; no backend/API/schema change.
- **Validation:** 4 files applied to `src` this turn → `tsc --noEmit` (exit 0) + `eslint` (exit 0; one pre-existing exhaustive-deps warning on the restore effect) + `vite build` (exit 0; TheoSurface 306.78 kB / 90.39 kB gzip); `src` reverted. Microstep lint → PASS. Proposed-src blobs: `SpiralMark`=`404f9463`, `ChatView`=`311a900e`, `TheoMain`=`230e0257`, `useTheoState`=`a6f1daed`.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Pass 3 commits the 4 files to `development`; the Theo dev SWA serves it.
