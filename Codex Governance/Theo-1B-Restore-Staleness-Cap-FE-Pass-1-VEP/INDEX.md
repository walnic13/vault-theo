# Theo 1B — Restore-on-reopen 4-hour staleness cap — Pass 1 FE VEP

**Author:** Claude Code (Pass 1) · **Reviewer:** Codex (Pass 2) · **Regime:** Vault Theo frontend · Plan-only.

Adds a 4-hour staleness cap to the cold-open restore gate in `useTheoState.ts`: reopen the last chat only if it was touched within 4h (`max(last_opened_at, updated_at)`), else land on the fresh Theo greeting. Behavioural gate only — both surfaces (restored chat / greeting) are unchanged VA-T1; no new state; no browser storage; no backend/contract/schema change.

## Contents
- `Theo_1B_Restore_Staleness_Cap_FE_VEP.md` — the VEP body (GCR, Rule Anchor Table, F-P1…F-P7).
- `proposed-src/theo/useTheoState.ts` — **MODIFY** (staleness guard in the restore effect). Blob `1b97aed31e0c18ada5da79e3d87be76d38bf9cfb` (ACTIVE @ HEAD `a6f1daed…`).

## Validation (this turn, against `src`, reverted)
`tsc --noEmit` exit 0 · `eslint` exit 0 (one **pre-existing** exhaustive-deps warning on the same effect, unchanged) · `vite build` exit 0 (TheoSurface 325.25 kB / 95.57 kB gzip).

## On APPROVAL (Pass 3)
Copy the file into `src/`, re-verify green, commit to `development`; Walter accepts (reopen <4h → last chat; >4h → fresh greeting).
