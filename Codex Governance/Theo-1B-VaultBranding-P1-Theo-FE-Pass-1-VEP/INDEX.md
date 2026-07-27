# Theo 1B — Vault branding Phase 1 (Theo chat surface) — Pass 1 FE VEP

**Author:** Claude Code (Pass 1) · **Reviewer:** Codex (Pass 2) · **Regime:** Vault Theo frontend · Plan-only.

Retires the Claude-style `Burst` asterisk (VA-T1 L39–57) across Theo's chat surface in favour of the Vault logo (Spiral of Theodorus), and de-messes the thinking row by moving the breathing mark into the avatar gutter (resting = static logo; thinking = breathing; `StatusLine` → verb + dots). Processing model (verb rotator, dots, `AgentActivity`, `ThinkingPanel`) unchanged. No backend / contract / schema change.

## Contents
- `Theo_1B_VaultBranding_P1_Theo_FE_VEP.md` — the VEP body (GCR, Rule Anchor Table, F-P1…F-P7).
- `proposed-src/theo/components/VaultMark.tsx` — **NEW** static/build-once mark. Blob `807b8dea7a5052b584c26f1c640168ea177978a5`.
- `proposed-src/theo/components/ChatView.tsx` — **MODIFY** (hero/avatar/pre-reply/StatusLine). Blob `5634aaf0f380712cff8bb8e04c720a51438d3892` (ACTIVE @ HEAD `549e9c93…`).
- `proposed-src/theo/components/Sidebar.tsx` — **MODIFY** (lockup mark). Blob `f046a36ee3712fa04a7e780d75217e6e0d2c068b` (ACTIVE @ HEAD `cccb13c0…`).
- `proposed-src/theo/components/icons.tsx` — **MODIFY** (retire `Burst` + unused `C` import). Blob `d77a0fa33152845573b6f755a3ad69a609c7e928` (ACTIVE @ HEAD `6b29147e…`).

## Validation (this turn, against `src`, reverted)
`tsc --noEmit` exit 0 · `eslint` exit 0 (no warnings) · `vite build` exit 0 (TheoSurface 325.10 kB / 95.54 kB gzip) · no residual `Burst` usage.

## On APPROVAL (Pass 3)
Copy the four files from `proposed-src/` into `src/`, re-verify green, commit to `development`; Walter accepts on the Theo dev SWA. Phase 2 (Origin shell) + a VA-T1 Role-C reference update follow separately.
