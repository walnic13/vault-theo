# Codex Governance Package — Theo 1B B4g-FE Editable Project Description Pass-1 VEP

- **Main artifact:** `Theo_1B_B4g_FE_Editable_Project_Description_VEP.md` — Pass-1 Frontend VEP (plan only). Reviewer = Codex (Pass 2). FE-VEP shape: GCR + Rule Anchor Table + F-P1…F-P7 + CCT + Mechanical lint block.
- **Microstep:** Tier **B4g-FE** — make the project **description** editable (Walter: "I should be able to update the description… that is not editable at the moment"). Was a static subtitle since B4e.
- **Backend: already deployed** — reuses `theo_update_project {id, description}` (B4a; `description` may be `""` to clear). No backend change, no migration.
- **Proposed source (`proposed-src/theo/`)** — 7 modifications:
  - `components/RowManage.tsx` — `InlineEdit`/`EditInput` gain backward-compatible `allowEmpty?: boolean` (rename stays non-blank; description may clear to "").
  - `components/ProjectDetail.tsx` — description subtitle → edit-in-place (`InlineEdit allowEmpty`; click text / "Add a description…" placeholder; Enter/blur saves, Esc cancels).
  - `components/TheoMain.tsx` — pass `onPatchDescription={t.patchDescription}`.
  - `useTheoState.ts` — `patchDescription` (optimistic across projects + held chatProject; chip-rollback on failure; single commit, no debounce).
  - `services/theoClient.ts` + `gateway.live.ts` + `gateway.mock.ts` — `updateProjectDescription` (mirrors `updateProjectInstructions`).
- **Classification:** VISUAL-AUTHORITY-DEVIATION (minor; Walter-authorized; cited + classified + Rule-Anchored). Same edit-in-place idiom as B4f rename.
- **Validation this turn:** applied to a scratch copy of `src` → `tsc` (exit 0) + `eslint .` (exit 0) + `build` green (TheoSurface 233.77 KB / 69.80 KB gzip); `src` reverted (package carries only `proposed-src/`). Microstep lint → PASS.
- **Currency:** vault-theo HEAD `0988bb1`.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Pass 3 apply to `development` + Walter redeploys the Theo SWA.
