# Codex Governance Package — Theo 1B B5d-FE Owner "Shared" Badge Pass-1 VEP

- **Main artifact:** `Theo_1B_B5d_FE_Owner_Shared_Badge_VEP.md` — Pass-1 Frontend VEP (plan only). Reviewer = Codex (Pass 2).
- **Microstep:** the owner's Projects grid now badges **"Shared"** for a **privately-shared** project (≥1 invited member), not only `visibility='group'` — closing the gap Walter saw on the SWA (2026-07-02: "Test Project" private+shared-with-Jared showed no badge). Consumes the deployed, golden-verified B5d owner-gated `member_count` on `theo_list_projects`.
- **Backend: already deployed + golden-verified** (B5d `f3868e6`: owner private+invite → member_count=1; non-owner row → 0, no leak). No backend change.
- **Proposed source (`proposed-src/theo/`)** — 4 modifications: `types.ts` (`Project` +`memberCount`), `services/gateway.live.ts` (`RawProject` +`member_count`, `toProject` maps it), `services/gateway.mock.ts` (seed/create +`memberCount`; `listProjects` reflects the harness member store), `components/ProjectsView.tsx` (badge condition `|| (p.isOwner && p.memberCount > 0)`).
- **Classification:** VISUAL-AUTHORITY-DEVIATION (extends the B5a/B5c badge; Walter flagged the gap). Owner-gated (backend + `p.isOwner` guard) → no co-member-count exposure.
- **Validation this turn:** applied to `src` → `tsc` (0) + `eslint` (0) + `build` green (TheoSurface 247.15 KB / 72.63 KB gzip); `src` reverted (package carries only `proposed-src/`). Microstep lint → PASS.
- **Currency:** vault-theo HEAD `f3868e6`.
- **Pipeline:** on APPROVAL → Pass 3 apply the 4 files to `development` + Walter redeploys the Theo SWA. Then one `development→main` promotion carries **B5c-FE + B5d-FE** to vault-origin.com — completing the B5 sharing/visibility tier.
