# Role-C Verbatim-Edit Handoff — DR-T12: add `vaultgpt-func-projects` to the Claude-Code deployment exception

Pass-4 Role-C documentation amendment. Records the Walter-granted (2026-07-24) addition of the dedicated Projects app **`vaultgpt-func-projects`** to the DR-T7 / §1E scoped Claude-Code deployment exception, exactly as `vaultgpt-func-theo-tools` (DR-T10) and `vaultgpt-func-stream` (DR-T11) were added. Edits one file — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` — in four places (§1C table row, §1B DR-T7 register line, a new §1B DR-T12 register row, §1E in-scope list). No behaviour/code change; this only records the granted deploy authority so the Phase C handler VEP can be re-issued with a satisfied deploy gate.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Documentation-update package
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Turn issued against HEAD: `<STAMP>` (vault-theo, `development`; grounding parent `246f9a47952710a3d46746e308ff8bf050311f6e`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Grounding-mode basis: Conformance §4 "Documentation-update package" row = Targeted Current-Turn Grounding (Governor documentation-update sections + the target document + this Standard).

### §4 Documents grounded this turn
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Execution Orchestration Standard (target being edited) — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A/§1B/§1C/§1E, DR-T7/DR-T10/DR-T11) | `Read`+`Grep` this turn | `be066f12147d1eb13b51f025b275f5413ab51f0e` |
| 2 | Claude Code Theo Governor Standard (documentation-update / Verbatim-Edit Handoff) — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11) | `Grep` this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Walter Authorization (quoted verbatim, predating this handoff)
> AUTHORIZED (Walter, 2026-07-24): Add vaultgpt-func-projects (Windows, Functions v4,
> EP1 plan ASP-VaultTax-931c, system-assigned MI, EasyAuth on the shared audience
> api://4e1a1e31-5c20-4480-99e4-098901707d9e) to the DR-T7 / §1E scoped Claude-Code
> deployment exception as a new Decision Register entry DR-T12. Claude Code MAY deploy
> handler/function code + function.json to vaultgpt-func-projects after a Codex-APPROVED
> VEP; vaultgpt-func-premium remains READ-ONLY; DB writes/migrations/merges remain
> Walter-only; Claude Code runs read-only SELECT verification + golden curls. Record via
> Role-C amendment to THEO_EXECUTION_ORCHESTRATION_STANDARD.md (§1C table, §1E in-scope,
> DR-T7 register line, + new DR-T12 row).

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "Adding any further app to this exception requires a further Walter-granted, Role-C-recorded amendment." | This amendment is that Walter-granted, Role-C-recorded amendment (adds `vaultgpt-func-projects`) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1A | "Role-C inline executor (Pass 4)" | Pass-4 Role-C handoff for Codex to review + land |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "exact before/after text for each edit" | Edits 1–4 below are exact before/after blocks |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |

## Verbatim edits to `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md`

### Edit 1 — §1C Executor Model table (deployment row)
BEFORE:
```
| Deployment — handler/function code to the designated dedicated Theo Function Apps (`vaultgpt-func-chat`, `vaultgpt-func-theo-tools`, `vaultgpt-func-stream`) | **Claude Code** (§1E / DR-T7 scoped exception; only after a Codex-APPROVED VEP) |
```
AFTER:
```
| Deployment — handler/function code to the designated dedicated Theo Function Apps (`vaultgpt-func-chat`, `vaultgpt-func-theo-tools`, `vaultgpt-func-stream`, `vaultgpt-func-projects`) | **Claude Code** (§1E / DR-T7 scoped exception; only after a Codex-APPROVED VEP) |
```

### Edit 2 — §1B Decision Register, DR-T7 row (append `vaultgpt-func-projects` to the app list + extension note)
BEFORE:
```
| DR-T7 | **Scoped deployment exception**: Claude Code MAY deploy handler/function code (+ `function.json`) to the Walter-designated dedicated Theo Function Apps — `vaultgpt-func-chat`, `vaultgpt-func-theo-tools`, and the streaming sidecar `vaultgpt-func-stream` — after a Codex-APPROVED VEP; only the monolith (`vaultgpt-func-premium`) remains READ-ONLY; DB writes/migrations/merges remain Walter-only; Claude Code runs only read-only (`SELECT`) verification SQL. Walter-granted 2026-07-04 (`vaultgpt-func-chat`); extended to `vaultgpt-func-theo-tools` 2026-07-17 (DR-T10); extended to `vaultgpt-func-stream` 2026-07-17 (DR-T11, aligning with Golden Handler §5.5, which already recorded the func-stream deploy procedure). | this standard §1E |
```
AFTER:
```
| DR-T7 | **Scoped deployment exception**: Claude Code MAY deploy handler/function code (+ `function.json`) to the Walter-designated dedicated Theo Function Apps — `vaultgpt-func-chat`, `vaultgpt-func-theo-tools`, the streaming sidecar `vaultgpt-func-stream`, and the Projects app `vaultgpt-func-projects` — after a Codex-APPROVED VEP; only the monolith (`vaultgpt-func-premium`) remains READ-ONLY; DB writes/migrations/merges remain Walter-only; Claude Code runs only read-only (`SELECT`) verification SQL. Walter-granted 2026-07-04 (`vaultgpt-func-chat`); extended to `vaultgpt-func-theo-tools` 2026-07-17 (DR-T10); extended to `vaultgpt-func-stream` 2026-07-17 (DR-T11, aligning with Golden Handler §5.5, which already recorded the func-stream deploy procedure); extended to `vaultgpt-func-projects` 2026-07-24 (DR-T12). | this standard §1E |
```

### Edit 3 — §1B Decision Register, NEW DR-T12 row (insert immediately after the DR-T11 row)
INSERT (new line directly below the existing DR-T11 register row):
```
| DR-T12 | **Projects app deploy authority** (Walter-directed 2026-07-24): the dedicated Projects backend app **`vaultgpt-func-projects`** (Windows, Functions v4, EP1 plan `ASP-VaultTax-931c`; system-assigned MI; EasyAuth on the shared audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`; stood up in the Projects best-in-class program, Phase B) **joins the DR-T7 scoped deployment exception** — Claude Code MAY deploy handler/function code + `function.json` to it after a Codex-APPROVED VEP; `vaultgpt-func-premium` remains READ-ONLY; DB writes/migrations/merges remain Walter-only; Claude Code runs read-only (`SELECT`) verification SQL + the deterministic golden curls. First handler: `theo_add_project_knowledge_file` (file-as-knowledge ingest, Phase C). | this standard §1E; Projects program Phase B/C |
```

### Edit 4 — §1E in-scope paragraph (add `vaultgpt-func-projects` to the designated apps + DR-T12 note)
BEFORE:
```
- **In scope:** Claude Code MAY execute Pass-3 deployment of **handler/function code + `function.json`** to a **Walter-designated dedicated Theo Function App**. The designated apps are **`vaultgpt-func-chat`**, **`vaultgpt-func-theo-tools`** (both Windows, Functions v4, EP1 plan `ASP-VaultTax-931c`), and the streaming sidecar **`vaultgpt-func-stream`** (Windows, Functions v4 programming model, EP1); `vaultgpt-func-theo-tools` was added by the DR-T10 amendment and `vaultgpt-func-stream` by the DR-T11 amendment (both Walter-granted 2026-07-17; func-stream aligns with the deploy procedure already recorded in Golden Handler §5.5). Adding any further app to this exception requires a further Walter-granted, Role-C-recorded amendment.
```
AFTER:
```
- **In scope:** Claude Code MAY execute Pass-3 deployment of **handler/function code + `function.json`** to a **Walter-designated dedicated Theo Function App**. The designated apps are **`vaultgpt-func-chat`**, **`vaultgpt-func-theo-tools`** (both Windows, Functions v4, EP1 plan `ASP-VaultTax-931c`), the streaming sidecar **`vaultgpt-func-stream`** (Windows, Functions v4 programming model, EP1), and the Projects app **`vaultgpt-func-projects`** (Windows, Functions v4, EP1 plan `ASP-VaultTax-931c`, system-assigned MI, EasyAuth on the shared audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`); `vaultgpt-func-theo-tools` was added by the DR-T10 amendment, `vaultgpt-func-stream` by the DR-T11 amendment (both Walter-granted 2026-07-17; func-stream aligns with the deploy procedure already recorded in Golden Handler §5.5), and `vaultgpt-func-projects` by the DR-T12 amendment (Walter-granted 2026-07-24). Adding any further app to this exception requires a further Walter-granted, Role-C-recorded amendment.
```

## Boundary / no-drift
- One governed doc edited; four localized edits; all mechanical/additive (records granted authority). No code, no handler, no schema, no API contract change.
- The three existing designated apps + the `vaultgpt-func-premium` READ-ONLY exclusion + Walter-only DB/migrations/merges are all preserved verbatim.
- After landing, the Phase C handler VEP (`Theo-1B-ProjectKnowledgeFile-Pass-1-VEP`) is re-issued with its deploy section citing DR-T12.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-RoleC-DR-T12-ProjectsApp-Deploy/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-4 Role-C review of these four verbatim edits (APPROVED / REJECTED only). On APPROVED, Claude Code applies them byte-faithfully to `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` and commits.
