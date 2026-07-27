# Theo 1B — Artifact rules: route spreadsheet/Excel → export tool — Pass 1 FE VEP

**Author:** Claude Code (Pass 1) · **Reviewer:** Codex (Pass 2) · **Regime:** Vault Theo frontend · Plan-only.

Fixes the "Theo makes a markdown table, not a real Excel file" feedback (Agustin + Jared). Amends `ARTIFACT_RULES` in `swapBlock.ts`: drop "table" from the artifact-deliverable list and add an explicit rule that spreadsheet/Excel/"export"/"download" requests call the already-deployed `theo_export_spreadsheet` tool (→ `vault_export` → the VA-T9 download card) instead of inlining a table/artifact. Prompt-string constant only; no visual/state/storage/backend/contract change.

## Contents
- `Theo_1B_ArtifactRules_Spreadsheet_Export_FE_VEP.md` — the VEP body (GCR, Rule Anchor Table, F-P1…F-P7).
- `proposed-src/theo/swapBlock.ts` — **MODIFY** (`ARTIFACT_RULES` content). Blob `c0f5abebedbffe031fb8f93049117a92ca454a37` (ACTIVE @ HEAD `3707995c…`).

## Validation (this turn, against `src`, reverted)
`tsc --noEmit` exit 0 · `eslint` exit 0 · `vite build` exit 0 (TheoSurface 325.81 kB / 95.84 kB gzip).

## Scope note
This is the routing fix (model now calls the export tool for Excel). The separate "(no response)" backend fix (empty-turn / `max_tokens`-during-tool_use handling in `theo_message_stream`) is Track B — a backend package to follow.

## On APPROVAL (Pass 3)
Copy the file into `src/`, re-verify green, commit to `development`; Walter accepts (ask for an Excel → real `.xlsx` download card).
