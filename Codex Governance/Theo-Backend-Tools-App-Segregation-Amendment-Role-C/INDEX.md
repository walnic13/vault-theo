# Theo Backend — Tools-App segregation amendment (Role-C) — for Codex

Establishes a dedicated **`vaultgpt-func-theo-tools`** Function App (existing EP1 Premium plan) as the home for Theo's model-callable **tools** — the differentiator surface expected to grow to hundreds of tools. Segregating tools from the chat gateway / CRUD / feature apps isolates blast radius, keeps each app small (cold-start), and makes the whole tool library **Claude-deployable end-to-end** (no monolith touch). This amendment: (a) adds **DR-T10** (tools-app segregation), (b) **extends the DR-T7 deploy exception** to name `vaultgpt-func-theo-tools` alongside `vaultgpt-func-chat`, and (c) **re-targets Tier Export** (deploy home `func-chat` → `func-theo-tools`). Walter-directed 2026-07-17; Walter granted `az` to provision the app. **Plan amendment only** — no code, no provisioning here. Eight verbatim edits for the Pass-4 inline executor after APPROVAL.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 4 — Documentation-update package (Role-C authoring)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Turn issued against HEAD: vault-theo `cbe9dc6b1ecb5da04c2736f16ebfe932b4e9babc` (package-present; the four target docs are unmodified here; blob SHAs below). Grounding reads were against parent `b4252cadac415a8240e079af27d9ace211ae9b46`.
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T7 | "the Walter-designated dedicated Theo Function App — `vaultgpt-func-chat` only — after a Codex-APPROVED VEP" | Edit 1 — extend DR-T7 to name `vaultgpt-func-theo-tools` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1A Claude role | "a Walter-designated dedicated Theo Function App (currently `vaultgpt-func-chat` only)" | Edit 2 — role line names both apps |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1C deploy row | "Deployment — handler/function code to the designated dedicated Theo Function App (`vaultgpt-func-chat`)" | Edit 3 — deploy-authority row names both apps |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier Export | "**Deploy target.** `vaultgpt-func-chat` only (DR-T7)" | Edit 5 — Tier Export deploy home → func-theo-tools |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §6 HF-T7 | "Deploys to `vaultgpt-func-chat` (DR-T7)." | Edit 7 — HF-T7 deploy home → func-theo-tools |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.12 | "`POST /api/theo_export_spreadsheet` on `vaultgpt-func-chat`" | Edit 8 — §2.12 deploy home → func-theo-tools |

### Currency anchors (blob SHAs @ HEAD `b4252ca`)
- THEO_EXECUTION_ORCHESTRATION_STANDARD.md `97329131489b8661281ff98b987a745d59a6e3e1`; THEO_PHASE_1B_BACKEND_PLAN.md `1a7404366d8ced59a5e8f4984e7c939ece78185b`; THEO_GOLDEN_HANDLER_STANDARD.md `fcea72696eb6c5d80b1e64ee7171add5a8f4e18d`; THEO_API_SPEC.md `d26994012ca7a387b5aafcfd7644780e007d30f0`.

## Design summary
- **New app:** `vaultgpt-func-theo-tools` on the existing **EP1** Premium plan (≈$0; same dedicated-app-on-EP1 pattern as `func-stream` / `func-dms`). **Windows, Azure Functions runtime v4, Node — provisioned to mirror the existing v4 sidecars (`func-stream` / `func-dms`) exactly** (NOT the legacy v3 monolith `func-premium`); its config (runtime, Node version, app-settings shape) is copied from a deployed v4 app as the template. Own system-assigned MI; EasyAuth on the shared audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e` (shell token + OBO unchanged). Provisioned by Claude Code via the Walter-granted `az` **after this amendment is APPROVED**.
- **What lives there:** Theo's model-callable **tools** (first resident: `theo_export_spreadsheet`; hundreds to follow). The chat gateway + tool-*loop* orchestration stays in `func-premium` (Walter); `func-chat` keeps its voice/attachment/native-chat feature endpoints; `func-stream`/`func-dms` unchanged.
- **Dispatch + scale:** `theo_message`'s tool-loop (func-premium) invokes tool endpoints on `func-theo-tools` cross-app as the signed-in user (OBO/EasyAuth), the same in-tenant hop apps already make to `func-dms`. Tools are registered via the existing `THEO_TOOL_MANIFEST` so adding a tool = deploy the handler to func-theo-tools + a manifest entry (registry-driven; no per-tool monolith code deploy) — the "hundreds of tools" path.
- **Deploy authority:** the DR-T7 scoped exception now covers **both** `vaultgpt-func-chat` and `vaultgpt-func-theo-tools` (Claude-deployable Theo apps, only after a Codex-APPROVED VEP); `func-premium` + `func-stream` remain READ-ONLY to Claude Code.

## Gap Register
**PROCEED.** No code/schema; a plan + deploy-authority amendment. Provisioning (app + MI + EasyAuth + Storage role) is a post-APPROVAL Claude Code `az` action (Walter-granted 2026-07-17), mirroring the func-chat setup. Export-MS1's handler is authored (`Codex Governance/Theo-Backend-Export-MS1-Pass-1-VEP/handlers/`) and unchanged by this amendment — only its deploy home moves to func-theo-tools.

---

## Edit 1 — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1B (DR-T7 row)
**Before:**
```
| DR-T7 | **Scoped deployment exception**: Claude Code MAY deploy handler/function code (+ `function.json`) to the Walter-designated dedicated Theo Function App — `vaultgpt-func-chat` only — after a Codex-APPROVED VEP; the monolith (`vaultgpt-func-premium`) and streaming sidecar (`vaultgpt-func-stream`) remain READ-ONLY; DB writes/migrations/merges remain Walter-only; Claude Code runs only read-only (`SELECT`) verification SQL. Walter-granted 2026-07-04. | this standard §1E |
```
**After:**
```
| DR-T7 | **Scoped deployment exception**: Claude Code MAY deploy handler/function code (+ `function.json`) to the Walter-designated dedicated Theo Function Apps — `vaultgpt-func-chat` and `vaultgpt-func-theo-tools` — after a Codex-APPROVED VEP; the monolith (`vaultgpt-func-premium`) and streaming sidecar (`vaultgpt-func-stream`) remain READ-ONLY; DB writes/migrations/merges remain Walter-only; Claude Code runs only read-only (`SELECT`) verification SQL. Walter-granted 2026-07-04 (`vaultgpt-func-chat`); extended to `vaultgpt-func-theo-tools` 2026-07-17 (DR-T10). | this standard §1E |
```

## Edit 2 — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1A (Claude role line)
**Before:**
```
**Scoped deployment exception (§1E, DR-T7):** MAY execute Pass-3 deployment of handler/function code to a Walter-designated dedicated Theo Function App (currently `vaultgpt-func-chat` only) after a Codex-APPROVED VEP; the monolith `vaultgpt-func-premium` and the streaming sidecar `vaultgpt-func-stream` remain READ-ONLY / never written by Claude Code.
```
**After:**
```
**Scoped deployment exception (§1E, DR-T7):** MAY execute Pass-3 deployment of handler/function code to a Walter-designated dedicated Theo Function App (`vaultgpt-func-chat` and `vaultgpt-func-theo-tools`) after a Codex-APPROVED VEP; the monolith `vaultgpt-func-premium` and the streaming sidecar `vaultgpt-func-stream` remain READ-ONLY / never written by Claude Code.
```

## Edit 3 — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1C (deployment-authority table row)
**Before:**
```
| Deployment — handler/function code to the designated dedicated Theo Function App (`vaultgpt-func-chat`) | **Claude Code** (§1E / DR-T7 scoped exception; only after a Codex-APPROVED VEP) |
```
**After:**
```
| Deployment — handler/function code to the designated dedicated Theo Function Apps (`vaultgpt-func-chat`, `vaultgpt-func-theo-tools`) | **Claude Code** (§1E / DR-T7 scoped exception; only after a Codex-APPROVED VEP) |
```

## Edit 4 — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1B (append DR-T10 after the DR-T9 row)
**Before (the DR-T9 row):**
```
| DR-T9 | **Theo → downloadable Excel** (Walter-directed 2026-07-17): Theo emits a typed/formatted `.xlsx` from data it extracts (first use case: prior-year K-1 → current-year workpaper input), built **in-tenant** with SheetJS via a **spreadsheet export broker** (Golden Handler HF-T7), delivered as a short-TTL owner-scoped read-SAS download. Tool-driven (the model calls it on request), with a review-before-export step (accuracy-first). Deploys to `vaultgpt-func-chat` (DR-T7); stateless (no `theo_*` table, no migration); the model-facing tool-manifest wiring in `theo_message` (`vaultgpt-func-premium`) is Walter-deployed. v1.1 adds workpaper-template mapping. | `THEO_PHASE_1B_BACKEND_PLAN.md` Tier Export; Golden Handler Standard §6 HF-T7; API Spec §2.12 |
```
**After (DR-T9 re-targeted to func-theo-tools + new DR-T10 appended):**
```
| DR-T9 | **Theo → downloadable Excel** (Walter-directed 2026-07-17): Theo emits a typed/formatted `.xlsx` from data it extracts (first use case: prior-year K-1 → current-year workpaper input), built **in-tenant** with SheetJS via a **spreadsheet export broker** (Golden Handler HF-T7), delivered as a short-TTL owner-scoped read-SAS download. Tool-driven (the model calls it on request), with a review-before-export step (accuracy-first). Deploys to `vaultgpt-func-theo-tools` (DR-T7/DR-T10); stateless (no `theo_*` table, no migration); the model-facing tool-manifest wiring in `theo_message` (`vaultgpt-func-premium`) is Walter-deployed. v1.1 adds workpaper-template mapping. | `THEO_PHASE_1B_BACKEND_PLAN.md` Tier Export; Golden Handler Standard §6 HF-T7; API Spec §2.12 |
| DR-T10 | **Theo tools segregated to a dedicated Function App** (Walter-directed 2026-07-17): Theo's model-callable **tools** live in a dedicated `vaultgpt-func-theo-tools` Function App on the existing EP1 Premium plan (≈$0; same dedicated-app-on-EP1 pattern as `func-stream`/`func-dms`), not the monolith — isolating blast radius, keeping cold-start small at hundreds-of-tools scale, and making the tool library Claude-deployable end-to-end. **Windows, Azure Functions runtime v4, provisioned to mirror `func-stream`/`func-dms` exactly** (not the legacy v3 monolith). Own system-assigned MI; EasyAuth on the shared audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`. The `theo_message` tool-loop (`func-premium`) dispatches to tool endpoints there as the signed-in user (OBO), registry-driven via `THEO_TOOL_MANIFEST`. Claude Code provisions it via Walter-granted `az` and deploys to it under the extended DR-T7 exception (after a Codex-APPROVED VEP). | this standard §1E; `THEO_PHASE_1B_BACKEND_PLAN.md` Tier Export |
```

## Edit 5 — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` Tier Export (Deploy target line)
**Before:**
```
- **Deploy target.** `vaultgpt-func-chat` only (DR-T7); `vaultgpt-func-premium` (tool-manifest wiring, Walter-deployed) and `vaultgpt-func-stream` otherwise untouched. **Frontend** (Download card + in-chat review affordance) follows as Theo-FE passes after the backend microstep lands.
```
**After:**
```
- **Deploy target.** `vaultgpt-func-theo-tools` (the dedicated Theo-tools app, DR-T10; Claude-deployable under the extended DR-T7); `vaultgpt-func-premium` (tool-manifest wiring, Walter-deployed) and `vaultgpt-func-chat`/`vaultgpt-func-stream` otherwise untouched. **Frontend** (Download card + in-chat review affordance) follows as Theo-FE passes after the backend microstep lands.
```

## Edit 6 — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` Tier Export (Export-MS1 deliverable line — deploy home)
**Before:**
```
  - **Export-MS1 — `theo_export_spreadsheet`** (HF-T7): a `vaultgpt-func-chat` handler that accepts structured data (one or more sheets: name + headers + typed rows + optional metadata) and returns an owner-scoped, short-TTL **read SAS** download URL for the generated `.xlsx` (built server-side with SheetJS, uploaded to `theo-content` via the HF-T5 managed-identity user-delegation SAS pattern). Stateless — no schema change, no migration. Invoked as a Theo tool: the model-facing tool-manifest wiring in `theo_message` (`vaultgpt-func-premium`) is Walter-deployed (Theo premium/chat split); the handler on func-chat is Claude-deployed (DR-T7).
```
**After:**
```
  - **Export-MS1 — `theo_export_spreadsheet`** (HF-T7): a `vaultgpt-func-theo-tools` handler that accepts structured data (one or more sheets: name + headers + typed rows + optional metadata) and returns an owner-scoped, short-TTL **read SAS** download URL for the generated `.xlsx` (built server-side with SheetJS, uploaded to `theo-content` via the HF-T5 managed-identity user-delegation SAS pattern). Stateless — no schema change, no migration. Invoked as a Theo tool: the model-facing tool-manifest wiring in `theo_message` (`vaultgpt-func-premium`) is Walter-deployed; the handler on `vaultgpt-func-theo-tools` is Claude-deployed (DR-T7/DR-T10).
```

## Edit 7 — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` §6 (HF-T7 row deploy phrase)
**Before:**
```
| HF-T7 | Spreadsheet export broker | Server-side builder that turns structured data (typed sheets: headers + rows) into a formatted `.xlsx` in-process (SheetJS — numbers/dates as real cell types, header/section formatting), uploads it owner-scoped to Blob `theo-content` via the HF-T5 managed-identity user-delegation write-SAS pattern, and returns a short-TTL **read** SAS download URL. No credential/endpoint leaks to the browser. Stateless (no `theo_*` table). Deploys to `vaultgpt-func-chat` (DR-T7). | PROPOSED (Tier Export; `theo_export_spreadsheet`; authored at Export-MS1) |
```
**After:**
```
| HF-T7 | Spreadsheet export broker | Server-side builder that turns structured data (typed sheets: headers + rows) into a formatted `.xlsx` in-process (SheetJS — numbers/dates as real cell types, header/section formatting), uploads it owner-scoped to Blob `theo-content` via the HF-T5 managed-identity user-delegation write-SAS pattern, and returns a short-TTL **read** SAS download URL. No credential/endpoint leaks to the browser. Stateless (no `theo_*` table). Deploys to `vaultgpt-func-theo-tools` (DR-T7/DR-T10). | PROPOSED (Tier Export; `theo_export_spreadsheet`; authored at Export-MS1) |
```

## Edit 8 — `spec/THEO_API_SPEC.md` §2.12 (deploy home + tool-loop note)
**Before:**
```
`POST /api/theo_export_spreadsheet` on `vaultgpt-func-chat`;
```
**After:**
```
`POST /api/theo_export_spreadsheet` on `vaultgpt-func-theo-tools`;
```

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-Tools-App-Segregation-Amendment-Role-C/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review of this Role-C amendment. On APPROVED: the 8 edits land (Pass-4 inline); Claude Code provisions `vaultgpt-func-theo-tools` via the Walter-granted `az` — **Windows, Functions runtime v4, mirroring `func-stream`/`func-dms` exactly** (config copied from a deployed v4 app), on EP1 + system MI + EasyAuth 4e1a1e31 + Storage role; then the Export-MS1 VEP (already-authored handler) is finalized against the func-theo-tools target for review → deploy → golden curls.
