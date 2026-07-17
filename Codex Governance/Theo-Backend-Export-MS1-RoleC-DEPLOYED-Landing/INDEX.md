# Role-C Verbatim-Edit Handoff — Export-MS1 `theo_export_spreadsheet` DEPLOYED landing

Post-deploy documentation landing (Theo Governor §11). `theo_export_spreadsheet` is DEPLOYED + golden-curls-GREEN on `vaultgpt-func-theo-tools` (Codex-APPROVED VEP, package commit `44171d96f518040703c8ea722e95ac957a59336b`). This handoff flips the two governing rows from PROPOSED to DEPLOYED. **Verbatim edits only — no behavior change.**

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: E3
Turn issued against HEAD: vault-theo `__PKG_COMMIT__`.
Currency-anchor form: git blob SHA at HEAD.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This whole handoff — exact before/after below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.12 | "PROPOSED until the Export-MS1 VEP lands DEPLOYED" | Edit 3 flips this to DEPLOYED |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §6 HF-T7 | "PROPOSED (Tier Export; `theo_export_spreadsheet`; authored at Export-MS1)" | Edit 4 flips this to DEPLOYED |

### Currency anchors (blob SHAs @ HEAD)
- THEO_API_SPEC.md `227eb10c148dd265f597e12f6ae7a161bda7cfff`; THEO_GOLDEN_HANDLER_STANDARD.md `afeb51759fb7dab3289a625aa0af94e592a26e2b`.

### Deploy evidence (this landing rests on)
DEPLOYED to `vaultgpt-func-theo-tools` via ZipDeploy 2026-07-17; golden curls: unauth 401, `{}`→400 INVALID_REQUEST, unknown-field→400 INVALID_REQUEST, 21-sheets→400 PAYLOAD_TOO_LARGE, happy→200 (`exports/<oid>/<uuid>.xlsx` read-SAS w/ Content-Disposition), GET download 200 xlsx with numeric cells + bold header; 502 UPSTREAM_ERROR path proven in local smoke test.

## Edits (exact before/after; each unique at HEAD)

### Edit 1 — API Spec §2.12 capability status (line 115), PROPOSED → DEPLOYED
BEFORE:
`| export structured data → downloadable \`.xlsx\` | \`PROPOSED\` (Export-MS1): \`POST /api/theo_export_spreadsheet\``
AFTER:
`| export structured data → downloadable \`.xlsx\` | \`DEPLOYED\` (Export-MS1, 2026-07-17): \`POST /api/theo_export_spreadsheet\``

### Edit 2 — API Spec §2.12 status column (line 115), 1B-proposed → 1B-deployed
BEFORE (the status cell near end of the row):
`Final request/response shape is locked at the Export-MS1 VEP. | \`1B-proposed\` | HF-T7 spreadsheet export broker`
AFTER:
`Final request/response shape is locked at the Export-MS1 VEP. | \`1B-deployed\` | HF-T7 spreadsheet export broker`

### Edit 3 — API Spec §2.12 trailing note (line 117)
BEFORE:
`PROPOSED until the Export-MS1 VEP lands DEPLOYED. No \`theo_*\` schema is added.`
AFTER:
`DEPLOYED — Export-MS1 landed 2026-07-17 (Codex-APPROVED VEP; golden curls green on \`vaultgpt-func-theo-tools\`). No \`theo_*\` schema is added.`

### Edit 4 — Golden Handler §6 HF-T7 status (line 56)
BEFORE:
`| PROPOSED (Tier Export; \`theo_export_spreadsheet\`; authored at Export-MS1) |`
AFTER:
`| DEPLOYED (Tier Export; \`theo_export_spreadsheet\`; Export-MS1 landed 2026-07-17) |`

## No other changes
No behavior, contract, or schema changes. Handler/function.json unchanged. FE + `func-premium` tool-manifest wiring remain the paired follow-ons (out of scope here).

## Requested action
Codex: verify each before/after is byte-faithful at HEAD and APPROVE the landing; Claude Code commits the verified edits (per the confined verified-landing authority).
