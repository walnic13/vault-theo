# Theo 1B — Thinking-status mark: animated Vault spiral (nautilus) — Pass 1 FE VEP

**Author:** Claude Code (Pass 1) · **Reviewer:** Codex (Pass 2) · **Regime:** Vault Theo frontend · Plan-only.

Adds an animated Vault mark (Spiral of Theodorus logo + continued nautilus tail, breathing build→unbuild→rebuild loop) to the LEFT of the rotating verb in `ChatView`'s `StatusLine`. The two intentional status surfaces (verb rotator + dots; `AgentActivity` "Thinking… · tokens"; `ThinkingPanel`) are untouched. No backend / contract / schema change.

## Contents
- `Theo_1B_ThinkingMark_Spiral_FE_VEP.md` — the VEP body (GCR, Rule Anchor Table, F-P1…F-P7).
- `proposed-src/theo/components/SpiralAssemble.tsx` — **NEW** component (the mark). Blob `b460afa1a5fc438e95fbf6fbc280a9a3be9cc218`.
- `proposed-src/theo/components/ChatView.tsx` — **MODIFY** (one import + one JSX element in `StatusLine`). Blob `549e9c936a46204b6616a6fd14310389fab81bf1`. ACTIVE @ HEAD = `8d51b0e30c817d93fc9fc6cf3fcbb20c8527aadb`.

## Validation (this turn, against `src`, reverted)
`tsc --noEmit` exit 0 · `eslint` exit 0 (no warnings) · `vite build` exit 0 (TheoSurface 316.35 kB / 91.69 kB gzip).

## On APPROVAL (Pass 3)
Copy both files from `proposed-src/` into `src/`, remove the unused `SpiralLine.tsx` scratch file, re-verify green, commit to `development`; Walter accepts on the Theo dev SWA.
