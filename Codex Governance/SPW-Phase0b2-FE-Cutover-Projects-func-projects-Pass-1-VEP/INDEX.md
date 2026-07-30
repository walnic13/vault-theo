# Codex Governance Package — SPW Phase 0b-2: FE cutover of Projects to func-projects — Pass 1 Frontend VEP

- **Main artifact:** `SPW_Phase0b2_FE_Cutover_Projects_func_projects_VEP.md` — Pass-1 Frontend VEP (plan only).
- **Changed file:** `proposed-src/theo/services/gateway.live.ts` — the 15 project-domain fetch calls repointed `${apiBase}` → `${projectsBase}` (func-projects). Base-URL only; no signature/shape/auth/render change.
- **Microstep:** Shared Project Workspace Phase 0b-2 (FE half). Points the Projects surface at the func-projects handlers relocated + golden-verified in Phase 0b-1 (vault-projects `a9b4897`). Reversible (premium still serves; rollback = revert the file).
- **Pre-verified this turn:** tsc/eslint/build green; func-projects CORS `*` + browser preflight 200; auth Bearer token accepted; 13 handlers behavior-identical.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Pass-3 = commit to `development` → Theo SWA CI redeploys; Claude verifies on salmon-river dev.
- **Grounding parent:** vault-theo `072d10d549b09c587f38abd173a739685e4c7573` (FE + spec source). This package is carried by a later `development` commit (the branch tip at review — see the Codex forward note; not baked here).
