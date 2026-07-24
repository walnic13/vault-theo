# Role-C Verbatim-Edit Handoff — DR-T13: run-from-package deploy model (enterprise go-forward standard)

Pass-4 Role-C documentation amendment. Records Walter's 2026-07-24 direction to move Theo Function Apps to an **immutable, versioned run-from-package** deploy model built with **`npm ci` from a committed lockfile** (no `node_modules` in source) — first adopter **`vaultgpt-func-projects`** — instead of the legacy per-handler Kudu VFS overwrite. Two edits: (1) Golden Handler §5.5 gains a run-from-package procedure bullet (the deploy-procedure truth for run-from-package apps); (2) a new DR-T13 register row in the Execution Orchestration Standard. No code/schema/contract change; this records the deploy-model decision so the Phase C deploy executes per a governed procedure (avoids §5.5 doc-vs-runtime drift, Conformance §6 T13).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Documentation-update package
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Turn issued against HEAD: `<STAMP>` (vault-theo, `development`; grounding parent `5bed1895da440295f6f20c7119a4280e079ce7b5`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Grounding-mode basis: Conformance §4 "Documentation-update package" row = Targeted Current-Turn Grounding (Governor documentation-update sections + target documents + this Standard).

### §4 Documents grounded this turn
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Golden Handler Standard (target — §5.5 deploy procedure) — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` | `Read` this turn | `521442379b47d8bf43b877b4feb5b420065b5cfe` |
| 2 | Theo Execution Orchestration Standard (target — §1B DR register) — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` | `Read`+`Grep` this turn | `733615cb6db444e0e8c16b5fe47402e0b77d2aa8` |
| 3 | Claude Code Theo Governor Standard (Verbatim-Edit Handoff) — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11) | `Grep` this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 4 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Walter Authorization (quoted verbatim, predating this handoff)
> [Claude recommended: "Target run-from-package built with npm ci, evolving to GitHub Actions CI/CD — the same CI model your frontend already uses."] Walter: **"pivot now"** (2026-07-24) — adopt run-from-package for `vaultgpt-func-projects` now; also, earlier same day: *"i'd prefer node modules going forward to be best in class, enterprise."*

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Deploy Targets & SCM / Kudu Host Procedure" | Edit 1 — adds the run-from-package procedure bullet to §5.5 |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "The deployed handler is the source of truth." | Edit 1 — new bullet inserted immediately after this one |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B | "Theo Architecture Decision Register" | Edit 2 — appends DR-T13 to the register |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "exact before/after text for each edit" | Edits 1–2 below are exact before/after blocks (Edit 2 is a pure new-row insertion) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |

## Verbatim edits

### Edit 1 — Golden Handler §5.5: insert a run-from-package procedure bullet immediately after the "deployed handler is the source of truth" bullet
INSERT (new bullet directly below the existing `- **The deployed handler is the source of truth.** …` line, at the same indentation):
```
  - **Run-from-package deploy model (enterprise go-forward standard; Walter-directed 2026-07-24, DR-T13).** New Theo Function Apps — first adopter **`vaultgpt-func-projects`** — deploy via an **immutable, versioned run-from-package artifact**, NOT the per-handler Kudu VFS surgical overwrite above. Claude Code builds the app package with **`npm ci` from the committed `package-lock.json`** (deterministic, lockfile-pinned; `node_modules` is NEVER committed to source), uploads the versioned `.zip` to Blob (a dedicated `deploy-packages` container in the app's own storage account), sets **`WEBSITE_RUN_FROM_PACKAGE`** to reference that package, and `az functionapp restart`s. Deploys are **atomic** (whole-package pointer swap); **rollback** = repoint `WEBSITE_RUN_FROM_PACKAGE` at the prior versioned package; **`/site/wwwroot` is READ-ONLY**, so the per-handler VFS surgical overwrite does NOT apply to run-from-package apps (the whole package is rebuilt + redeployed per change). Preconditions/authority are unchanged (Codex-APPROVED VEP; DR-T7/§1E deploy exception; Walter-only DB/migrations/merges). **Curl verification remains Claude Code's job.** This §5.5 run-from-package procedure is the deploy-procedure truth for run-from-package apps and **supersedes any VEP §Deploy step describing VFS** for such an app. The existing VFS model (above) remains in force for `vaultgpt-func-chat` / `vaultgpt-func-theo-tools` / `vaultgpt-func-stream` until each is migrated. Target end-state: this build+deploy runs under **GitHub Actions CI/CD** (mirroring the vault-theo FE's existing SWA CI) — a later governed step.
```

### Edit 2 — Execution Orchestration §1B Decision Register: insert a new DR-T13 row immediately after the DR-T12 row
INSERT (new line directly below the existing DR-T12 register row):
```
| DR-T13 | **Run-from-package deploy model** (enterprise; Walter-directed 2026-07-24): Theo Function Apps move to an immutable, versioned **run-from-package** artifact built with **`npm ci` from a committed lockfile** (no `node_modules` in source), deployed by setting **`WEBSITE_RUN_FROM_PACKAGE`** to a versioned Blob package (atomic swap; rollback = repoint; **read-only `wwwroot`**). First adopter: **`vaultgpt-func-projects`** (Projects program Phase C). The per-handler Kudu VFS overwrite (Golden Handler §5.5) does NOT apply to run-from-package apps. Go-forward standard for new apps; existing apps (`vaultgpt-func-chat` / `vaultgpt-func-theo-tools` / `vaultgpt-func-stream`) migrate later; target end-state is **GitHub Actions CI/CD** (mirrors the vault-theo FE SWA CI). Preconditions/authority unchanged (Codex-APPROVED VEP; DR-T7/§1E; Walter-only DB/migrations/merges). | Golden Handler §5.5; this standard §1E |
```

## Boundary / no-drift
- Two governed docs edited: Golden Handler §5.5 (deploy-procedure truth-owner) + Execution Orchestration §1B (DR register). Both additive.
- The existing VFS model + the `vaultgpt-func-premium` READ-ONLY exclusion + Walter-only DB/migrations/merges are preserved verbatim; only a new run-from-package model is added alongside, scoped to run-from-package apps (first adopter func-projects).
- After landing, the Phase C handler VEP deploy executes per the amended §5.5 run-from-package procedure; the VEP's substance (handler code, ownership, structural mirror) is unchanged.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-RoleC-DR-T13-RunFromPackage-Deploy/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-4 Role-C review of these two verbatim edits (APPROVED / REJECTED only). On APPROVED, Claude Code applies them byte-faithfully and commits, then executes the Phase C run-from-package deploy per the amended §5.5.
