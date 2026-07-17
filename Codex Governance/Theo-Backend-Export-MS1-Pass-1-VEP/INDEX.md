# Theo Backend — Export-MS1 `theo_export_spreadsheet` — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. Self-contained: handler under `handlers/theo_export_spreadsheet/`, deployed primary reference under `primary-reference/`. First resident of the dedicated Theo-tools app (`vaultgpt-func-theo-tools`, DR-T10). `theo_export_spreadsheet` turns structured data (typed sheets) into a downloadable `.xlsx` (Akshay #2 Theo→Excel) — the emit half of Tier Export.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `44171d96f518040703c8ea722e95ac957a59336b` (the commit that contains this package; grounding reads against parent `7f8e6eda2c7e61d42130b0ba508f02ce594dc6db`; cited-doc blob SHAs below are HEAD-stable across that parent→child commit).
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary Reference — `theo_create_attachment_upload` index.js + function.json copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the specific validated field set" | Structural Mirror — validated field set is `{sheets:[{name,columns,rows}]}` (ALLOWED DELTA) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "a Walter authorization quoted verbatim and predating the VEP" | §4 Structural Mirror — the in-tenant SheetJS workbook-build helper is authorized by DR-T9 (landed, predates this VEP) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "**Claude Code deploys** these via Kudu VFS after a Codex-APPROVED VEP" | §6 Deploy — classic-v4 Kudu VFS to func-theo-tools |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.12 | "`POST /api/theo_export_spreadsheet` on `vaultgpt-func-theo-tools`" | §1/§4 — the contract this handler implements |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T9 | "built **in-tenant** with SheetJS via a **spreadsheet export broker**" | §4 — SheetJS build authorization (predates VEP) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T10 | "Theo tools segregated to a dedicated Function App" | §6 — deploy home `vaultgpt-func-theo-tools` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-Export-MS1-Pass-1-VEP/primary-reference/theo_create_attachment_upload.index.js.md | primary-ref | "Managed-identity user-delegation SAS issuance" | §4 — Family-B + SAS/MI helper block reused EXACT verbatim |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-Export-MS1-Pass-1-VEP/handlers/theo_export_spreadsheet/index.js | delta | "field is POPULATED for the read SAS" | §4 — the one SAS-machinery ALLOWED DELTA |

### Currency anchors (blob SHAs @ HEAD)
- THEO_GOLDEN_HANDLER_STANDARD.md `afeb51759fb7dab3289a625aa0af94e592a26e2b`; THEO_API_SPEC.md `227eb10c148dd265f597e12f6ae7a161bda7cfff`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `123b09507b4fdebad25f5bad7e83364a93518f95`.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Feature (PROPOSED → this VEP):** `POST /api/theo_export_spreadsheet` (API Spec §2.12) on **`vaultgpt-func-theo-tools`**. Body `{ filename?, sheets:[{ name, columns:[{key,header,type?}], rows:[{<key>:value}] }] }` → **200** `{ downloadUrl, filename, contentType, byteSize, expiresAt }`. Builds a typed/formatted `.xlsx` in-process, uploads it owner-scoped to Blob, returns a short-TTL read-SAS download URL. First use case: prior-year K-1 data → downloadable workpaper input.
- **Boundary:** **stateless** — no `theo_*` table, no `pg`, no DB, no migration (mirrors Voice). Executes as the signed-in user (EasyAuth OID). The only external system is **Azure Blob** (`theo-content` on `vaultgptstorage01`) — the SAME system the primary reference already brokers — reached with the Function's **managed identity** (keyless). **No new external-system interaction** vs the primary reference (no Graph, no model, no network beyond Blob). Workbook generation is a local in-process computation (SheetJS), authorized by DR-T9.

## §2 Gap Register
**PROCEED.** (1) **`xlsx-js-style` Kudu install** — the handler builds the workbook with `xlsx-js-style` (the SheetJS community engine + cell styling for bold headers). SheetJS (`xlsx`) is already proven loaded in this tenant (B8c extraction, Sigma engine); `xlsx-js-style` is a drop-in fork installed the same way (Kudu `npm install`). Verified at Pass-3 deploy by a golden curl that generates a real `.xlsx` (a load failure surfaces as 500). If it ever fails to load, fall back to plain `xlsx` (typed cells retained; bold dropped). Disclosed, PROCEED. (2) The model-facing **tool-manifest wiring** in `theo_message` (`func-premium`) is Walter-deployed (Theo split) — recorded, not blocking this handler. (3) No schema/migration (stateless).

## §3 Sub-phase walk (P1–P8)
- **P1 Feature identification:** §1 — `theo_export_spreadsheet` PROPOSED (§2.12); implements the Tier Export emit half.
- **P2 Architecture/boundary:** stateless; Blob-only external system (same as primary ref); DR-T9 in-tenant SheetJS; func-theo-tools (DR-T10). (§1 Boundary.)
- **P3 Gap register:** §2 (PROCEED).
- **P4 Contract grounding:** API Spec §2.12 (`1B-proposed`); this VEP locks the request/response shape.
- **P5 Handler grounding:** primary reference deployed **`theo_create_attachment_upload`** (index.js + function.json) copied verbatim under `primary-reference/`. Structural Mirror §4.
- **P6 Boundary re-check:** no new external call/auth/helper beyond the DR-T9-authorized SheetJS build + the rscd-populated SAS delta; stateless.
- **P7 Golden curls:** run by Claude Code against `vaultgpt-func-theo-tools` post-deploy (§5).
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + lint PASS).

## §4 Structural Mirror Table
Primary Reference = deployed `theo_create_attachment_upload` (SAS/MI blob broker; the closest deployed Theo handler — Family-B helpers + managed-identity user-delegation SAS).

| Region (theo_export_spreadsheet) | vs Primary Reference | Classification | Anchor |
|---|---|---|---|
| Error contract: 401 `UNAUTHORIZED`, 400 `INVALID_REQUEST` (shape/unknown-field), 400 `PAYLOAD_TOO_LARGE` (row/cell/sheet/col caps), 502 `UPSTREAM_ERROR` (MI/Blob), 500 (build) | maps status+code to API Spec §2.12 | **contract-locked** — `validateExportRequest` returns typed `{code,status}`; upstream failures caught in a dedicated Phase-2 try → 502; build failures → 500 | API Spec §2.12 + Golden Handler §3.3 |
| Unknown/extra-field rejection at body/sheet/column levels (rows keyed only by declared column keys) | new (spec posture) | **contract-locked** — `firstUnknownKey` against `ALLOWED_{BODY,SHEET,COLUMN}_KEYS` | Golden Handler §3.3 ("rejects unknown/extra fields") |
| Family-B block: `send`/`nowIso`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`cleanFileName` | byte-identical | **EXACT** | Golden Handler §4 (helper block EXACT) |
| SAS/MI block: `requestUrl`/`getManagedIdentityAccessToken`/`xmlEscape`/`encodeBlobPath`/`decodeXmlTag`/`toIsoNoMillis`/`getUserDelegationKey` | byte-identical | **EXACT** | primary-ref anchor |
| `computeUserDelegationSignature` / `buildUserDelegationSas` | identical EXCEPT the canonical `rscd` (Content-Disposition) field is **populated** for the read SAS (a friendly download filename), where the primary ref left it empty; adds a `contentDisposition` param + `rscd` query param | **ALLOWED DELTA** (existing canonical SAS field populated — no field added/reordered) | handler delta anchor |
| `coerceCell` / `buildWorkbookBuffer` (SheetJS: typed cells, bold header row, column widths, sheet-name sanitize/de-dupe) | new in-process build (no primary-ref equivalent) | **ALLOWED DELTA** — authorized by **DR-T9** ("in-tenant … SheetJS … spreadsheet export broker"), quoted verbatim + landed before this VEP; local computation, no new external system | Golden Handler §4 (Walter-authorization-predating clause) + DR-T9 |
| `validateSheets` + input field set `{sheets:[{name,columns,rows}]}` | different validated field set (vs `filename/content_type`) | **ALLOWED DELTA** (the specific validated field set) | Golden Handler §4 |
| `module.exports` flow: validate → build buffer → mint **write** SAS (`cw`) → server **PUT** bytes → mint **read** SAS (`r`, with Content-Disposition) → return `{downloadUrl,…}` | primary ref returns a write SAS to the client (client uploads); here the server generates + PUTs + returns a read SAS | **ALLOWED DELTA** (same external system — Azure Blob; same MI/SAS machinery; the contract's response shape) | Golden Handler §4 ("the contract's response shape") |
| route `theo_export_spreadsheet` (POST/OPTIONS) | vs `theo_create_attachment_upload` | **ALLOWED DELTA** (endpoint name) | Golden Handler §4 |

No DEVIATION rows.

## §5 Golden Curls (run by Claude Code against `vaultgpt-func-theo-tools` at Pass-3 deploy; never print the token)
Auth: `TOKEN=$(az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e --query accessToken -o tsv)` (as `wmansfield@vault-tax.com`).
1. **OPTIONS** `theo_export_spreadsheet` → `204` (or EasyAuth 401 on a bare preflight — documented).
2. **Unauth** POST (no bearer) → `401`.
3. **Bad shape** POST `{}` (no `sheets`) with bearer → `400 INVALID_REQUEST`.
3b. **Unknown field** POST `{ sheets:[…valid…], bogus:1 }` with bearer → `400 INVALID_REQUEST` (`Unknown field 'bogus'`). Also a row with a key not in `columns` → `400 INVALID_REQUEST`.
3c. **Cap** POST a payload with 21 sheets (or a cell > 5000 chars) → `400 PAYLOAD_TOO_LARGE`. (502 `UPSTREAM_ERROR` is the MI/Blob failure code per §2.12 — not deterministically triggerable from a well-formed request; verified by code-path review + the Phase-2 try boundary.)
4. **Happy** POST with bearer, body `{ filename:"K-1 Export", sheets:[{ name:"Schedule K-1", columns:[{key:"box",header:"Box",type:"text"},{key:"desc",header:"Description",type:"text"},{key:"amt",header:"Amount",type:"number"}], rows:[{box:"1",desc:"Ordinary business income",amt:12345.67},{box:"2",desc:"Net rental real estate",amt:-987}] }] }` → **200** `{ downloadUrl, filename:"K-1 Export.xlsx", contentType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", byteSize>0, expiresAt }`. Then **GET the `downloadUrl`** → `200`, `Content-Type` xlsx, non-empty body; assert the bytes are a valid `.xlsx` (PK zip signature `50 4B`), and (parse) that `amt` cells are **numeric** (not text) and the header row is bold — proving typed/styled output + the `xlsx-js-style` lib loaded.

## §6 Deploy (Pass-3, on APPROVAL) — classic-v4 Kudu VFS to `vaultgpt-func-theo-tools` (DR-T7/DR-T10; Golden Handler §5.5)
1. Resolve the region-stamped SCM host: `az functionapp show -n vaultgpt-func-theo-tools -g Vault-Tax --query enabledHostNames`.
2. `npm install xlsx-js-style` into the app (Kudu, per the SheetJS B8c precedent), OR deploy `node_modules` — confirm the module loads.
3. Kudu VFS surgical PUT `handlers/theo_export_spreadsheet/{index.js,function.json}` → `/site/wwwroot/theo_export_spreadsheet/` (If-Match:*; GET-back diff); `az functionapp restart`.
4. Run §5 golden curls; on green, Role-C flips API Spec §2.12 + Golden Handler §6 HF-T7 to DEPLOYED.

## §7 Out of scope
FE (Download card + in-chat review loop) + the `func-premium` tool-manifest wiring (Walter-deployed) are the paired follow-ons; v1.1 = workpaper-template mapping. No `theo_*` schema.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-Export-MS1-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys to `vaultgpt-func-theo-tools` per §6 + runs §5 golden curls.
