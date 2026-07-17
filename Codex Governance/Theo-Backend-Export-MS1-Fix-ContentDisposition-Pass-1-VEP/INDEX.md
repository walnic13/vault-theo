# Theo Backend — Export-MS1 fix: RFC-5987 Content-Disposition — Pass 1 VEP

Bug fix to the DEPLOYED `theo_export_spreadsheet` (`vaultgpt-func-theo-tools`). Dev-SWA verification (Walter, 2026-07-17) surfaced a real defect: a **non-ASCII filename** (an em dash "—" the model chose: `Seedcamp V LP 2021 K-1 — Shakil Khan.xlsx`) made the read-SAS `rscd` (Content-Disposition) query value invalid → Azure Blob returned `InvalidQueryParameterValue` on `rscd`, so **Download** failed. The FE download card, tool-loop, and streaming all worked; only the download link's Content-Disposition was malformed. **One ALLOWED-DELTA line changes.** Self-contained: fixed handler under `handlers/`, deployed original under `primary-reference/`.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `__PKG_COMMIT__`.
Currency-anchor form: git blob SHA at HEAD.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary reference (deployed handler) copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — the fix touches only the read-SAS Content-Disposition delivery; response envelope unchanged |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "**Claude Code deploys** these via Kudu VFS after a Codex-APPROVED VEP" | §6 Deploy — Kudu VFS to func-theo-tools |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-Export-MS1-Fix-ContentDisposition-Pass-1-VEP/primary-reference/theo_export_spreadsheet.index.js.md | primary-ref | "Managed-identity user-delegation SAS issuance" | §4 — Family-B + SAS/MI helper block unchanged |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-Export-MS1-Fix-ContentDisposition-Pass-1-VEP/handlers/theo_export_spreadsheet/index.js | fix | "the SAS `rscd` (Content-Disposition) query value must be valid ASCII" | The one changed region |

### Currency anchors (blob SHAs @ HEAD)
- THEO_GOLDEN_HANDLER_STANDARD.md `49aa225aa6145adced121846de990725da5fe0f0`.
- Deployed handler = the Export-MS1 package `handlers/theo_export_spreadsheet/index.js` at HEAD (source of truth; Kudu-GET before the PUT).

## §1 Feature Identification + Architecture & boundary reconciliation
- **Defect:** the read-SAS builder set `rscd = attachment; filename="<filename>"`; when `<filename>` contains any non-ASCII character, the value is not a valid HTTP header / SAS query value and Azure rejects the whole download URL (`InvalidQueryParameterValue`, param `rscd`). Reproduced live 2026-07-17.
- **Fix (one region, ~L446):** build the Content-Disposition per RFC 6266 — an ASCII fallback `filename="<ascii>"` (non-ASCII → `-`) **plus** `filename*=UTF-8''<encodeURIComponent(filename)>`. The whole value is pure ASCII (verified), so the SIGNED `rscd` and the query param stay valid and identical; the browser downloads with the real Unicode name via `filename*`. Nothing else changes — same write/read SAS flow, same response envelope, same validation.
- **Boundary unchanged:** stateless; func-theo-tools; MI user-delegation SAS; as-the-user; no schema/migration.

## §2 Gap Register
**PROCEED.** (1) The signed `rscd` and the query `rscd` both derive from the same `contentDisposition` string (computeUserDelegationSignature `params.rscd` = the `qp.set("rscd", …)` value), so ASCII-normalising it keeps signature ↔ param consistent. (2) The ASCII fallback replaces any non-ASCII with `-`; `filename*` preserves the exact name for browsers. (3) No contract/schema change; the §2.12 response is byte-identical. (4) `node --check` PASS; ASCII-only output verified locally.

## §3 Sub-phase walk (P1–P8)
- P1 defect + fix (§1). P2 boundary unchanged (§1). P3 Gap (§2, PROCEED). P4 API §2.12 unchanged. P5 primary reference = deployed `theo_export_spreadsheet` (copied verbatim). P6 no new external call/auth/helper — one string-build region. P7 golden curls (§5). P8 this pack + lint PASS.

## §4 Structural Mirror Table
Primary Reference = the deployed `theo_export_spreadsheet` (this VEP's `primary-reference/`).

| Region | vs deployed | Classification | Anchor |
|---|---|---|---|
| Entire handler EXCEPT the Content-Disposition line | byte-identical | **EXACT** | primary-ref |
| `contentDisposition` build (~L446): ASCII `filename="…"` + `filename*=UTF-8''…` | was `filename="<raw>"` (broke on non-ASCII) | **ALLOWED DELTA** — RFC 6266 delivery fix; response shape + SAS machinery unchanged | Golden Handler §4 + fix anchor |

No DEVIATION rows.

## §5 Golden Curls (run by Claude Code against `vaultgpt-func-theo-tools` at Pass-3; never print the token)
Auth: `az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e` as `wmansfield@vault-tax.com`.
1. **Regression happy (ASCII name):** POST a valid `sheets` payload with `filename:"K-1 Export"` → **200**; GET `downloadUrl` → **200** xlsx (unchanged).
2. **The fix (non-ASCII name):** POST with `filename:"Seedcamp V LP 2021 K-1 — Shakil Khan"` (em dash) → **200**; **GET the `downloadUrl` → 200** (NOT `InvalidQueryParameterValue`), `Content-Type` xlsx, `Content-Disposition` carries both `filename="…-…"` and `filename*=UTF-8''…%E2%80%94…`; bytes are a valid `.xlsx`. This is the exact case that failed on the dev SWA.

## §6 Deploy (Pass-3, on APPROVAL) — Claude Code to `vaultgpt-func-theo-tools` (DR-T7/DR-T10; Golden Handler §5.5)
1. Resolve SCM host (`az functionapp show … enabledHostNames`); Kudu-GET the live `theo_export_spreadsheet/index.js` (rollback baseline).
2. Kudu VFS PUT the fixed `index.js` (If-Match:*, GET-back diff); restart; unauth health (401).
3. Run §5 golden curls (the non-ASCII case is the acceptance gate). No Role-C needed (contract unchanged — API §2.12 stays as-is).

## §7 Out of scope
No FE change (the card already renders correctly). No contract/schema change.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-Export-MS1-Fix-ContentDisposition-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS. `node --check` PASS on the handler.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys to `vaultgpt-func-theo-tools` + runs §5 golden curls (the em-dash case must download 200).
