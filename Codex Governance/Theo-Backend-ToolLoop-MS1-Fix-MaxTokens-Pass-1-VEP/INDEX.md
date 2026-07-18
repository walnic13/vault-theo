# Theo Backend — Tool-Loop MS1 fix: max_tokens floor for tool_use — Pass 1 VEP

Bug fix to the DEPLOYED `theo_message_stream` (`vaultgpt-func-stream`). Dev-SWA testing (Walter, 2026-07-18) with a real 303 KB K-1 hit an intermittent failure: Theo produced intro text but **no download card** (or "(no response)"). Reproduced by golden curl: a multi-sheet K-1 export makes the model emit a large `tool_use`, but the chat-sized token cap (FE sends `max_tokens: 1500`; thinking bumps it only to ~4096) **truncates the `tool_use` mid-block** → `stop_reason: "max_tokens"` (never `"tool_use"`) → the loop never dispatches → no `event: vault_export`. **One ALLOWED-DELTA region** (a max_tokens floor). Self-contained: fixed handler under `functions/`, deployed original under `primary-reference/`.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `7d155f6aad76e5bbc4e43466410ef53962230398`.
Currency-anchor form: git blob SHA at HEAD.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary reference (deployed handler) copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — the fix changes only the per-turn max_tokens ceiling; request/response/SSE contract unchanged |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "and `vaultgpt-func-stream` (v4 programming model" | §6 Deploy — Kudu VFS to func-stream |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.10 | "loops up to `MAX_TOOL_TURNS`" | The tool-loop whose tool_use this fix lets complete |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-ToolLoop-MS1-Fix-MaxTokens-Pass-1-VEP/functions/theo_message_stream.js | fix | "Floor the ceiling so a tool_use can complete" | The one changed region (~L726) |

### Currency anchors (blob SHAs @ HEAD)
- THEO_GOLDEN_HANDLER_STANDARD.md `49aa225aa6145adced121846de990725da5fe0f0`; THEO_API_SPEC.md `3a317a934d6b2c88081a96f2ef12c7a9ebb30609`.
- Deployed handler = the Tool-Loop MS1 package `functions/theo_message_stream.js` at HEAD (source of truth; Kudu-GET before the PUT).

## §1 Feature Identification + Architecture & boundary reconciliation
- **Defect (evidence):** golden curl with "build a workbook with 6 sheets … ~15 rows each" streamed `stop_reason:"max_tokens"`, `output_tokens:4096`, `thinking_tokens:396`, **zero `vault_export`** — the model was mid-`tool_use` when it hit the cap. In the loop, `stopReason !== "tool_use"` → break without dispatch. The FE's `max_tokens:1500` + the existing `THINKING_BUDGET+1024` bump both land at ~4096, far too small for a full K-1 export payload (all boxes + supplemental schedules + Form 926 as JSON rows).
- **Fix (one region, ~L726):** after `maxTokens` is resolved, floor it to `THEO_TOOL_LOOP_MAX_TOKENS` (default **16384**, env-overridable): `if (maxTokens < TOOL_LOOP_MIN_MAX_TOKENS) maxTokens = TOOL_LOOP_MIN_MAX_TOKENS;`. `max_tokens` is a **ceiling, not a target** — ordinary chat replies still stop at `end_turn` well below it (no cost or latency change for normal chat, which the golden curls confirm), while a tool_use now has room to complete → `stop_reason:"tool_use"` → dispatch → `vault_export`.
- **Boundary unchanged:** the request/response/SSE contract, tool-loop structure, persistence, and the existing thinking-budget guard are all untouched; only the numeric ceiling moves. No schema/migration. func-stream, as-the-user.

## §2 Gap Register
**PROCEED.** (1) 16384 comfortably fits a single K-1 extraction (~a few thousand output tokens incl. thinking); env `THEO_TOOL_LOOP_MAX_TOKENS` gives headroom for larger workbooks without a redeploy. (2) A *pathologically* huge workbook could still exceed even a raised cap; that residual edge (graceful "export too large — try fewer sheets/rows" messaging on a `max_tokens` truncation) is a noted follow-up, not this fix. (3) The thinking guard (`maxTokens <= THINKING_BUDGET` → bump) is now a no-op under the higher floor — harmless, left in place. (4) `node --check` PASS; diff is the floor region only.

## §3 Sub-phase walk (P1–P8)
- P1 defect + fix (§1). P2 boundary unchanged (§1). P3 Gap (§2, PROCEED). P4 API §2.10 contract unchanged (no additive events; ceiling only). P5 primary reference = deployed `theo_message_stream` (copied verbatim; diff = one region). P6 no new external call/auth/helper. P7 golden curls (§5). P8 this pack + lint PASS.

## §4 Structural Mirror Table
Primary Reference = the deployed `theo_message_stream` (this VEP's `primary-reference/`).

| Region | vs deployed | Classification | Anchor |
|---|---|---|---|
| Entire handler EXCEPT the max_tokens floor | byte-identical | **EXACT** | primary-ref |
| max_tokens floor (~L726): `TOOL_LOOP_MIN_MAX_TOKENS` (default 16384, env-overridable) applied after `maxTokens` resolution | new 2-line floor | **ALLOWED DELTA** — per-turn ceiling only; request/response/SSE contract + loop structure unchanged | Golden Handler §4 + fix anchor |

No DEVIATION rows.

## §5 Golden Curls (run by Claude Code against `vaultgpt-func-stream` at Pass-3; never print the token)
Auth: `az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e` as `wmansfield@vault-tax.com`. Base `.../api/theo_message_stream`.
1. **The failing case, now fixed:** POST `messages:[{role:user, content:"Use the spreadsheet export tool to build a workbook with 6 sheets (K-1 Summary, Capital Account, Liabilities & Ownership, Box 13W Detail, K-3 Part II, Form 926), each with ~15 rows of realistic partnership K-1 figures. Then confirm it's ready."}]` → `200` stream; assert `stop_reason:"tool_use"` (NOT `max_tokens`) appears, an **`event: vault_export`** frame streams with a `downloadUrl`, then `vault_meta`. GET the `downloadUrl` → `200` valid `.xlsx` with all 6 sheets. (Pre-fix this exact prompt gave `max_tokens` + no export — the regression gate.)
2. **Normal chat regression:** POST a plain question ("In one sentence, what is a K-1?") → `200`, native text frames + `vault_meta`, no `vault_export`, replies stop naturally (short) — confirming the higher ceiling doesn't change ordinary chat.

## §6 Deploy (Pass-3, on APPROVAL) — Claude Code to `vaultgpt-func-stream` (DR-T11; Golden Handler §5.5)
1. Resolve SCM host (`az functionapp show … enabledHostNames`); Kudu-GET the live `src/functions/theo_message_stream.js` (rollback baseline).
2. Kudu VFS PUT the fixed file → `/site/wwwroot/src/functions/theo_message_stream.js` (If-Match:*, GET-back diff); restart; unauth health (401).
3. Run §5 golden curls (case 1 is the acceptance gate). No Role-C needed (contract unchanged — no doc update).

## §7 Out of scope
No FE change (the card renders correctly once the tool fires). No contract/schema change. Graceful truncation-messaging for pathologically large workbooks = noted follow-up.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-ToolLoop-MS1-Fix-MaxTokens-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS. `node --check` PASS on the handler.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys to `vaultgpt-func-stream` + runs §5 golden curls (case 1: the 6-sheet K-1 export must stream `vault_export` + download 200).
