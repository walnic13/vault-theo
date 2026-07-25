# Codex Governance Package — Theo 1B Chat Media Persistence FE Pass-1 VEP

- **Main artifact:** `Theo_1B_MediaPersist_FE_VEP.md` — Pass-1 frontend VEP (plan). Reviewer = Codex (Pass 2). Open it with the governance-bound GCR + Rule Anchor Table (Theo FE Conformance §3/§5).
- **Microstep:** Chat Media Persistence **FE** — restore fetched images/videos on reload; **no rendered-surface change** (the inline image/video render already exists for live turns).
  - **Type** — `PersistedMessage` gains `media?: { image?: InlineImage; video?: InlineVideo } | null` (the shape `theo_get_conversation` now returns; flows through untouched).
  - **Restore** — `useTheoState.selectRecent` spreads persisted `media` onto the reloaded assistant message (`image`/`video`) so the existing render fires — mirrors the existing `citations → runs` restore.
- **Changed (2 files, staged in `proposed-src/theo/`):** `types.ts` (`PersistedMessage.media?`), `useTheoState.ts` (`selectRecent` restores media).
- **Contract basis:** Chat Media Persistence Part 3 (`theo_get_conversation` returns `messages[].media`) + companion API Spec §2.1 Role-C. Backend dependency: media is null on reload until Parts 1–3 land (additive + null-safe — no breakage either way).
- **Validation:** 2 files applied to `src` this turn → `tsc --noEmit` (exit 0) + `eslint` (exit 0; one pre-existing exhaustive-deps warning) + `vite build` (exit 0; TheoSurface 297.54 kB / 86.68 kB gzip); `src` reverted. Microstep lint → PASS. HEAD `0cfd77a`.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Pass 3 commits the 2 files to `development`; the Theo dev SWA serves it.
