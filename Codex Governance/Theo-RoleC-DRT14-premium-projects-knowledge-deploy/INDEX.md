# Role-C Verbatim-Edit Handoff — DR-T14: narrow premium deploy exception for Projects-knowledge handlers (Phase D / D2)

Pass-4 Role-C governance amendment recording **Walter's premium-deploy grant (Path B, 2026-07-24)**. Phase D / D2 puts on-ingest RAG indexing + de-index into the project **text**-knowledge handlers, which live on the shared monolith **`vaultgpt-func-premium`** (`theo_add_project_knowledge`, `theo_remove_project_knowledge`). Today §1E makes premium an **absolute exclusion** ("Claude Code MUST NEVER … deploy to it"). This amendment **narrowly** extends the DR-T7/§1E deployment exception to premium for **those Projects-domain knowledge handlers ONLY**, via **surgical Kudu VFS overwrite** (premium is classic per-fn — Golden Handler §5.5), after a Codex-APPROVED VEP. Everything else on the shared monolith stays excluded: all `reporting_*` and non-Projects Theo handlers remain Walter-deploy-only; **no** DB writes/migrations/merges; **no** premium app-setting/resource changes. This is a **cross-cutting** amendment — every LIVE statement of "premium is READ-ONLY" across the four governance docs gets the DR-T14 carve-out (10 edits); the append-only Decision Register rows (DR-T7/T11/T12/T13) are left as-dated. No code/schema change.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Documentation-update package
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Turn issued against HEAD: `4bba9a77f3e4fb9f520de16534f3d08cf7af1bb2` (vault-theo, `development`; grounding parent `b29e2ebe8c6029cb6fb6d9ed8bb4cc23343563a6`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Grounding-mode basis: Conformance §4 "Documentation-update package" row = Targeted Current-Turn Grounding. Walter grant: "yes, take on d2" + "path b" (2026-07-24), following the explicit "i'll give you permission to deploy to premium" — the Path-B choice being Claude-direct premium deploy for the Projects-knowledge handlers rather than the Walter-self-deploy model.

### §4 Documents grounded this turn
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Execution Orchestration Standard (target — §1A/§1E/DR table/Executor) — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` | `Read`+`Grep` this turn | `c39c3aba90d3b7edd59f816d50d20a233ab46cc5` |
| 2 | Theo Golden Handler Standard (target — §5.5 deploy split) — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` | `Read`+`Grep` this turn | `5581657066da5d15227c7116eebf44cef5d04c93` |
| 3 | Claude Code Theo Backend Governor Standard (target — authorization boundary) — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` | `Grep` this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 4 | Theo Phase 1B Backend Plan (target — authority row) — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` | `Grep` this turn | `28183604ddfcfe80fa3f3dda6f78e437b88d32d6` |
| 5 | Theo Grounding Conformance Standard (§3/§5) — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "Absolute exclusions" | Edits 1–5 — the exclusion narrowed + DR-T14 added |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1A | "sole authority who may grant governance exemptions" | this amendment records Walter's explicit, scoped, dated grant |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Walter self-deploys" | Edit 6 — premium deploy-split gets the DR-T14 carve-out |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Authorization boundary | "only the monolith `vaultgpt-func-premium` remains READ-ONLY" | Edit 7 — carve-out |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1B_BACKEND_PLAN.md | Authority row | "only the monolith `vaultgpt-func-premium` remains READ-ONLY" | Edit 8 — carve-out |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "exact before/after text for each edit" | every edit below is an exact before/after block |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |

## Verbatim edits

### Edit 1 — Orchestration §1E: add the DR-T14 in-scope bullet (after the run-from-package bullet)
BEFORE (exact substring):
```
These actions are scoped strictly to the designated run-from-package app's own deploy artifact + its `WEBSITE_RUN_FROM_PACKAGE` setting — no other app setting, resource, or app is in scope. The exclusions below are unchanged: `vaultgpt-func-premium` remains READ-ONLY; database writes/migrations remain Walter-only; branch merges remain Walter-only.
```
AFTER:
```
These actions are scoped strictly to the designated run-from-package app's own deploy artifact + its `WEBSITE_RUN_FROM_PACKAGE` setting — no other app setting, resource, or app is in scope. The exclusions below are unchanged: `vaultgpt-func-premium` remains READ-ONLY (save the narrow DR-T14 carve-out); database writes/migrations remain Walter-only; branch merges remain Walter-only.
- **In scope (premium Projects-knowledge handlers — DR-T14, Walter-granted 2026-07-24, Path B):** narrowly, for the shared monolith **`vaultgpt-func-premium`**, Claude Code MAY deploy — via **surgical Kudu VFS overwrite** of the named handler's `index.js` (+ `function.json` only if it changed; premium is classic per-fn `/site/wwwroot/<fn>/…`, Golden Handler §5.5) — the **Projects-domain knowledge handlers** `theo_add_project_knowledge` and `theo_remove_project_knowledge` (plus any future project-knowledge handler named in its Codex-APPROVED VEP), after a Codex-APPROVED VEP, then runs the golden curls. This is the ONLY premium deploy Claude Code may perform: every OTHER premium handler (all `reporting_*` and non-Projects Theo handlers), and ALL app-setting/resource changes on premium, remain out of scope; DB writes/migrations/merges remain Walter-only.
```

### Edit 2 — Orchestration §1E: narrow the Absolute-exclusions clause
BEFORE (exact substring):
```
- **Absolute exclusions:** the monolith **`vaultgpt-func-premium`** is **READ-ONLY** — Claude Code MUST NEVER write, deploy to, or otherwise mutate it (Walter self-deploys the monolith via the Portal; Claude Code still runs its golden curls per Golden Handler §5.5). All **database writes and migrations remain Walter-only**; Claude Code runs only read-only (`SELECT`) verification SQL. **Branch merges remain Walter-only.**
```
AFTER:
```
- **Absolute exclusions (narrowed by DR-T14, 2026-07-24):** the monolith **`vaultgpt-func-premium`** is **READ-ONLY EXCEPT** for the Projects-domain knowledge handlers named in the DR-T14 in-scope bullet above (`theo_add_project_knowledge`, `theo_remove_project_knowledge`, + future project-knowledge handlers named in an APPROVED VEP), which Claude Code MAY deploy via surgical Kudu VFS overwrite after a Codex-APPROVED VEP. For every OTHER premium handler (all `reporting_*` and non-Projects Theo handlers) Claude Code MUST NEVER write, deploy to, or otherwise mutate premium (Walter self-deploys those via the Portal; Claude Code still runs its golden curls per Golden Handler §5.5). All **database writes and migrations remain Walter-only**; Claude Code runs only read-only (`SELECT`) verification SQL; **no premium app-setting/resource change is in scope**. **Branch merges remain Walter-only.**
```

### Edit 3 — Orchestration: add the DR-T14 Decision Register row (after the DR-T13 row)
BEFORE (exact substring):
```
Go-forward standard for new apps; existing apps (`vaultgpt-func-chat` / `vaultgpt-func-theo-tools` / `vaultgpt-func-stream`) migrate later; target end-state is **GitHub Actions CI/CD** (mirrors the vault-theo FE SWA CI). Precondition: Codex-APPROVED VEP. | Golden Handler §5.5; this standard §1E |
```
AFTER:
```
Go-forward standard for new apps; existing apps (`vaultgpt-func-chat` / `vaultgpt-func-theo-tools` / `vaultgpt-func-stream`) migrate later; target end-state is **GitHub Actions CI/CD** (mirrors the vault-theo FE SWA CI). Precondition: Codex-APPROVED VEP. | Golden Handler §5.5; this standard §1E |
| DR-T14 | **Premium Projects-knowledge deploy authority** (Walter-directed 2026-07-24, "Path B"): narrowly extends the DR-T7 / §1E scoped deployment exception to the shared monolith **`vaultgpt-func-premium`** for **Projects-domain knowledge handlers ONLY** — `theo_add_project_knowledge` and `theo_remove_project_knowledge` (plus future project-knowledge handlers named in their Codex-APPROVED VEPs). Claude Code MAY deploy these named handlers' `index.js` (+ `function.json` only if changed) via **surgical Kudu VFS overwrite** (premium is classic per-fn `/site/wwwroot/<fn>/…`, Golden Handler §5.5) after a Codex-APPROVED VEP, then runs the golden curls. **Strictly excluded, unchanged:** every other premium handler (all `reporting_*` + non-Projects Theo handlers) stays Walter-deploy-only; **no** database writes/migrations, **no** branch merges, **no** app-setting/resource change on premium; DB/migrations/merges remain Walter-only. Rationale: Phase D / D2 on-ingest RAG indexing + de-index for project **text** knowledge lives in these premium handlers; the carve-out contains the shared-monolith blast radius to the two named handlers. | this standard §1E; Golden Handler §5.5; Phase D D2 |
```

### Edit 4 — Orchestration §1A: carve-out in the Claude-Code role line
BEFORE (exact substring):
```
the Projects app `vaultgpt-func-projects`) after a Codex-APPROVED VEP; only the monolith `vaultgpt-func-premium` remains READ-ONLY / never written by Claude Code.
```
AFTER:
```
the Projects app `vaultgpt-func-projects`) after a Codex-APPROVED VEP; the monolith `vaultgpt-func-premium` remains READ-ONLY / never written by Claude Code EXCEPT the narrow DR-T14 carve-out (2026-07-24) — the Projects-domain knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge`, which Claude Code MAY deploy to premium via surgical Kudu VFS after a Codex-APPROVED VEP.
```

### Edit 5 — Orchestration Executor table: premium deploy row carve-out
BEFORE (exact substring):
```
| Deployment — gateway, SWA, monolith Function App (`vaultgpt-func-premium`) | **Walter** |
```
AFTER:
```
| Deployment — gateway, SWA, monolith Function App (`vaultgpt-func-premium`) — EXCEPT the DR-T14 Projects-knowledge handler carve-out | **Walter** (premium; Claude Code only for the DR-T14 `theo_add_project_knowledge`/`theo_remove_project_knowledge` handlers, after an APPROVED VEP) |
```

### Edit 6 — Golden Handler §5.5: premium deploy-split gets the DR-T14 carve-out
BEFORE (exact substring):
```
`vaultgpt-func-premium` (monolith; classic per-fn) — **Walter self-deploys** by copy-pasting the handler file(s) into the Azure Portal UI; Claude Code delivers the complete `index.js` (+ `function.json` only if it changed).
```
AFTER:
```
`vaultgpt-func-premium` (monolith; classic per-fn) — **Walter self-deploys** by copy-pasting the handler file(s) into the Azure Portal UI; Claude Code delivers the complete `index.js` (+ `function.json` only if it changed). **EXCEPTION (DR-T14, 2026-07-24):** for the Projects-domain knowledge handlers `theo_add_project_knowledge` and `theo_remove_project_knowledge` (+ future project-knowledge handlers named in an APPROVED VEP) ONLY, Claude Code MAY deploy directly via **surgical Kudu VFS overwrite** of the handler's `/site/wwwroot/<fn>/index.js` (same per-fn mechanism as func-chat) after a Codex-APPROVED VEP; every other premium handler stays Walter-self-deploy.
```

### Edit 7 — Governor: authorization-boundary carve-out
BEFORE (exact substring):
```
only the monolith `vaultgpt-func-premium` remains READ-ONLY / never written by Claude Code (extended 2026-07-17 by DR-T10/DR-T11).
```
AFTER:
```
the monolith `vaultgpt-func-premium` remains READ-ONLY / never written by Claude Code (extended 2026-07-17 by DR-T10/DR-T11), EXCEPT the narrow DR-T14 carve-out (2026-07-24) under which Claude Code MAY deploy the Projects-domain knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge` to premium via surgical Kudu VFS after a Codex-APPROVED VEP.
```

### Edit 8 — Phase 1B Plan: authority-row carve-out
BEFORE (exact substring):
```
only the monolith `vaultgpt-func-premium` remains READ-ONLY. |
```
AFTER:
```
only the monolith `vaultgpt-func-premium` remains READ-ONLY, EXCEPT the narrow DR-T14 carve-out (2026-07-24) for the Projects-domain knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge` (Claude Code MAY deploy these to premium via surgical Kudu VFS after a Codex-APPROVED VEP). |
```

### Edit 9 — Golden Handler §5.5: premium curl-split statement gets the DR-T14 carve-out
BEFORE (exact substring):
```
The split is: Walter deploys the premium handler manually → **Claude Code runs the golden curls**
```
AFTER:
```
The split is: Walter deploys the premium handler manually (EXCEPT the DR-T14 Projects-knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge`, which Claude Code deploys directly via surgical Kudu VFS after a Codex-APPROVED VEP) → **Claude Code runs the golden curls**
```

### Edit 10 — Golden Handler §5.5: run-from-package preconditions premium-READ-ONLY carve-out
BEFORE (exact substring):
```
Preconditions unchanged (Codex-APPROVED VEP; Walter-only DB/migrations/merges; `vaultgpt-func-premium` READ-ONLY); the DR-T7/§1E deploy exception is **extended by the §1E amendment (DR-T13, below)**
```
AFTER:
```
Preconditions unchanged (Codex-APPROVED VEP; Walter-only DB/migrations/merges; `vaultgpt-func-premium` READ-ONLY except the narrow DR-T14 Projects-knowledge-handler carve-out, 2026-07-24); the DR-T7/§1E deploy exception is **extended by the §1E amendment (DR-T13, below)**
```

## Boundary / no-drift
- Four governed docs edited (Orchestration ×5, Golden Handler ×3, Governor ×1, Plan ×1 = 10 edits). Every LIVE statement of the premium READ-ONLY rule now carries the DR-T14 carve-out; the append-only Decision Register rows DR-T7/T11/T12/T13 are left as-dated (historical). No other value changes.
- The exception is **narrow**: only `theo_add_project_knowledge` + `theo_remove_project_knowledge` (+ future project-knowledge handlers named in an APPROVED VEP), only surgical Kudu VFS overwrite, only after Codex APPROVAL. All `reporting_*`, all other Theo premium handlers, all DB/migrations/merges, and all premium app-setting/resource changes remain excluded / Walter-only.
- No code/schema change.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-RoleC-DRT14-premium-projects-knowledge-deploy/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-4 Role-C review (APPROVED / REJECTED only). On APPROVED, Claude Code applies Edits 1–10 byte-faithfully and commits. DR-T14 is the precondition for the D2 handler VEPs (premium `theo_add_project_knowledge` indexing + `theo_remove_project_knowledge` de-index).
