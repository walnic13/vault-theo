# Codex Governance Package — Theo 1B B4f-FE Management Affordances Pass-1 VEP

- **Main artifact:** `Theo_1B_B4f_FE_Management_Affordances_VEP.md` — Pass-1 Frontend VEP (plan only). Reviewer = Codex (Pass 2). FE-VEP shape: GCR + Rule Anchor Table + F-P1…F-P7 + CCT + Mechanical lint block.
- **Microstep:** Tier **B4f-FE** — the four **management affordances** Walter directed ("Quick management wins"): rename project, delete project, rename chat, delete chat. Completes the B4 projects/conversations management surface.
- **Backends: all already deployed + golden-verified** — no backend change, no migration:
  - rename/delete **project** reuse `theo_update_project {id, name}` / `theo_delete_project` (B4a).
  - rename/delete **chat** use `theo_rename_conversation` / `theo_delete_conversation` (B4f-backend, `8980bef`).
- **Proposed source (`proposed-src/theo/`)** — 1 new + 9 modified:
  - **NEW** `components/RowManage.tsx` — reusable `RowActions` (hover ✎/🗑) + `InlineEdit` (edit-in-place; Enter/blur commit, Esc cancel, one-shot commit-XOR-cancel guard).
  - `components/ProjectsView.tsx` (card rename/delete), `components/Sidebar.tsx` (recents rename/delete), `components/ProjectDetail.tsx` (project-home chat rename/delete).
  - `components/TheoMain.tsx` (forward project handlers), `TheoSurface.tsx` (forward chat handlers to Sidebar + `.vo-actions` hover-reveal in `STYLE_BLOCK`).
  - `useTheoState.ts` (4 handlers: optimistic rename, non-optimistic delete + open-thread/detail reset), `services/theoClient.ts` + `gateway.live.ts` + `gateway.mock.ts` (`renameProject`, `renameConversation`, `deleteConversation`).
- **Classification:** VISUAL-AUTHORITY-DEVIATION (Walter-authorized management affordances; cited + classified + Rule-Anchored per FE Governor; Walter = exemption authority). Native `window.confirm` for delete = deliberate quick-win (G-2).
- **Validation this turn:** applied to a scratch copy of `src` → `tsc` (exit 0) + `eslint .` (exit 0) + `build` green (TheoSurface 232.22 KB / 69.51 KB gzip); `src` reverted (package carries only `proposed-src/`). Microstep lint → PASS.
- **Codex Pass-2 REJECT round 1 → fixed:** `renameProject`'s catch path now rolls back the independently-held `chatProject` chip (snapshot-and-restore), not only the `projects` list — a failed rename no longer leaves the stale optimistic name on the active chip (TC-7).
- **Currency:** vault-theo HEAD `3684a3d`. API-Spec §2.1 conversation rename/delete rows **landed** via the B4f API-Spec Role-C @ `3684a3d` (G-3 PROCEED).
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Pass 3 apply to `development` + Walter redeploys the Theo SWA.
