# Theo Backend — web_search / web_fetch dynamic-filtering upgrade — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. Upgrade Theo's built-in server-side grounding tools on `vaultgpt-func-stream` from the basic tool-type versions to the **`_20260209` dynamic-filtering** versions. Single file, three-part additive edit in `functions/theo_message_stream.js`: bump `web_fetch_20250910` → **`web_fetch_20260209`** and `web_search_20250305` → **`web_search_20260209`** in `buildGroundingTools()`, plus a comment update. The `_20260209` versions add **automatic dynamic filtering** — Claude code-filters search/fetch results before they reach the context window (better accuracy + token efficiency); it is built into the tool version and activates automatically (no `code_execution` declaration, no extra beta header). No contract/FE change, no new SSE frame, no schema/DB. `max_uses`, the `THEO_WEB_FETCH_ALLOWED_DOMAINS` allowlist, and the existing `anthropic-beta: web-fetch-2025-09-10` header are all preserved (minimal-delta). **Foundry capability probe (this turn):** the deployed model `claude-sonnet-4-6` on `vaultgpt-foundry` accepts both `_20260209` tool types (HTTP 200) and a forced live query ("current UK corporation tax rate") executed a real `server_tool_use` → `web_search_tool_result` and answered "25%" with a source. `node --check` PASS on the edited file.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `<PKG_COMMIT_SHA>` (the commit that first contains this package; grounding reads against pre-package parent `7df97f49c44b099a8d215499e102b70e558c464b`). The edited file's LIVE snapshot was GET-verified from Kudu this turn; Foundry acceptance of the target tool types was empirically probed this turn (see §5). Cited-doc blob SHAs resolved at the grounding parent.
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary Reference — deployed `theo_message_stream.js` copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T11 | "DR-T11" | §1 — the streaming loop that attaches the built-in grounding tools to every upstream call |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | tool-dispatch | "tool-dispatch" | §1 — server-side grounding tools are part of the upstream Foundry-Claude tool set |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "web_search" | §1 — the API Spec names the built-in `web_search`/`web_fetch` tools without version strings; the version bump changes no documented contract |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-WebTools-DynamicFilter-Pass-1-VEP/primary-reference/theo_message_stream.LIVE.js.md | primary-ref | "event: vault_image" | §4 — only the two server-tool `type` strings + a comment change; the loop / all emissions are unchanged |

### Currency anchors (blob SHAs @ grounding parent `7df97f4`)
- THEO_GROUNDING_CONFORMANCE_STANDARD.md `7c0d902bdff3b6c0af475b483e31ed796214e57b`; CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md `c3f2267b751d5e9f4f025331359c4d3013bcbe8a`; CODEX_THEO_BACKEND_REVIEW_STANDARD.md `d2e1b9881b6e2ed7d77921a055feffb0852257fd`; THEO_GOLDEN_HANDLER_STANDARD.md `5ce25a120605cc67e02bc094835484614d8f8bf7`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `be066f12147d1eb13b51f025b275f5413ab51f0e`; THEO_ARCHITECTURE_AND_STRUCTURE.md `07451ce9d912830b3c15fedf74761d00c59f97b2`; THEO_API_SPEC.md `b22211a6cdca98143a46c9f8173afd6254e995e1`; THEO_AZURE_POSTGRES_SCHEMA.md `e6143cf55839120b696e03c6702a1144ac3cc2c9`.

### Full Baseline doc set (Conformance §4 backend) — grounded this turn
Governor, Conformance (this GCR/Rule-Anchor/lint), Codex Review, Golden Handler (§2 primary-ref), Orchestration (DR-T11), Architecture (tool-dispatch), API Spec (§2.1 names the built-in web tools, no version strings), Schema — **N/A (no DB/schema/migration; two tool-version strings)**, cited for completeness per Conformance §4.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Edit — `buildGroundingTools()` version bump:** `web_fetch_20250910` → `web_fetch_20260209`, `web_search_20250305` → `web_search_20260209`. The `_20260209` versions add **dynamic filtering** (Claude code-filters results before context → higher accuracy + fewer tokens; built in, automatic, no extra tool/beta). Everything else in the tool defs (`name`, `max_uses`, the `THEO_WEB_FETCH_ALLOWED_DOMAINS` allowlist) is unchanged; a comment is updated to describe the new behaviour.
- **Header preserved (minimal-delta):** the `anthropic-beta: web-fetch-2025-09-10` header is retained. The probe (§5) confirmed `web_fetch_20260209` is accepted both with and without it, so it is now legacy/optional; it is kept to hold the upstream request byte-minimal vs the deployed baseline (a future cleanup may drop it + the `WEB_FETCH_BETA` const).
- **Boundary:** one file on `vaultgpt-func-stream` (the streaming loop's tool set). No new endpoint, no SSE frame change, no FE change, no DB/schema/migration/Blob/MI, no premium. Server tools run upstream on Foundry-Claude's side; the FE contract (`event:` frames) is untouched. Deploy target `vaultgpt-func-stream`.
- **Model/platform verified:** deployed model `claude-sonnet-4-6` on Microsoft Foundry (`vaultgpt-foundry.services.ai.azure.com/anthropic/v1/messages`). Foundry lists web search/fetch as β; the authoritative platform table does not pin a version for Foundry, so acceptance was **empirically probed this turn** (§5) rather than assumed — both `_20260209` types accepted + a real search executed end-to-end.

## §2 Gap Register
**PROCEED.**
- **(1) Foundry version support — empirically verified.** The authoritative platform-availability table lists Foundry web search/fetch as β without a version; rather than assume parity, a live probe against the deployed Foundry endpoint confirmed `web_search_20260209` + `web_fetch_20260209` are accepted (HTTP 200) and that a forced live query executed a real search and returned a correct sourced answer. Disclosed, PROCEED.
- **(2) Dynamic filtering is automatic + additive.** Built into the tool version; no `code_execution` declaration, no new beta header, no config. Accuracy/token improvement only; no behaviour the FE depends on changes. PROCEED.
- **(3) No contract / Role-C.** API §2.1 names the built-in `web_search`/`web_fetch` without version strings, so the bump documents no new contract; no Role-C. NO-GAP.
- **(4) Legacy beta header retained.** `web-fetch-2025-09-10` kept for minimal-delta (verified still accepted); future-cleanup note only. PROCEED.
- **(5) No schema/migration/keys/npm/premium.** PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** §1 — bump the two grounding-tool versions to `_20260209` (dynamic filtering).
- **P2 Architecture/boundary:** two tool-version strings in the func-stream streaming loop; upstream server tools; no FE/contract change. (§1.)
- **P3 Gap register:** §2 (PROCEED).
- **P4 Contract grounding:** API §2.1 (built-in web tools, no version pinned); no contract change.
- **P5 Primary-reference grounding:** deployed `theo_message_stream.js` (LIVE snapshot, GET-verified from Kudu, verbatim under `primary-reference/`). Structural Mirror §4.
- **P6 Boundary re-check:** three-line change (comment + two `type` strings); `node --check` PASS; diff-verified against the LIVE snapshot as the only changes.
- **P7 Verification:** Foundry capability probe done this turn (§5); post-deploy live-chat re-confirm.
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + lint PASS).

## §4 Structural Mirror Table
Primary Reference = deployed `theo_message_stream.js` (LIVE, GET-verified this turn).

| Region | vs Primary Reference (LIVE) | Classification | Anchor |
|---|---|---|---|
| Entire file except the two `type` strings + one comment | byte-identical | **EXACT** (diff-verified: only the two tool-version strings + the `buildGroundingTools` comment change) | Golden Handler §2 |
| `web_fetch` `type`: `web_fetch_20250910` → `web_fetch_20260209` | version bump (same tool family; adds dynamic filtering) | **ALLOWED DELTA** (server-tool version upgrade) | §1; Foundry-probed §5 |
| `web_search` `type`: `web_search_20250305` → `web_search_20260209` | version bump (same tool family; adds dynamic filtering) | **ALLOWED DELTA** (server-tool version upgrade) | §1; Foundry-probed §5 |
| `buildGroundingTools` comment | reworded to describe dynamic filtering + the legacy beta header | **ALLOWED DELTA** (comment) | §1 |
| tool `name`/`max_uses`/`allowed_domains`, the streaming loop, headers, all SSE emissions | unchanged | **EXACT** | Architecture tool-dispatch |

No DEVIATION rows.

## §5 Verification (Foundry capability probe done this turn; re-confirm post-deploy; never print the token/secret)
Probe (this turn, against the deployed Foundry endpoint, AAD user token for `https://ai.azure.com` — the app's SP client-secret was NOT used or read):
1. `web_search_20260209` + `web_fetch_20260209` each attached to a trivial call → **HTTP 200** (accepted; not rejected as unknown tool type). Baseline `web_search_20250305` also 200 (control).
2. `web_fetch_20260209` accepted **without** the `web-fetch` beta header (header confirmed legacy/optional).
3. Forced live query "current UK corporation tax main rate; cite a source" with `web_search_20260209` → the model emitted `server_tool_use` + `web_search_tool_result` and answered **25%** with a source (real search executed end-to-end).

Post-deploy (on func-stream): a normal live-data chat turn ("what is today's …") still triggers `event: tool` (`web_search`) and returns a grounded answer; normal no-tool chat unchanged; `theo_find_image`/`theo_find_video`/`theo_export_spreadsheet` still emit their frames.

## §6 Deploy (Pass-3, on APPROVAL) — Kudu VFS to `vaultgpt-func-stream` (NOT premium)
1. SCM `vaultgpt-func-stream-cyb4g8bhatddencs.scm.uksouth-01.azurewebsites.net`. GET the current file as a rollback baseline (matches this pack's LIVE snapshot).
2. Kudu VFS PUT `functions/theo_message_stream.js` → `/site/wwwroot/src/functions/theo_message_stream.js` (GET the ETag first and PUT with `If-Match:<etag>` per the func-stream 409 gotcha; expect 204; GET-back + diff = the three changes only).
3. `az functionapp restart -n vaultgpt-func-stream -g Vault-Tax`.
4. Run §5 post-deploy verification.

## §7 Out of scope
No FE change, no SSE frame change, no schema. The `THEO_WEB_FETCH_ALLOWED_DOMAINS` static allowlist mechanism is unchanged (dynamic filtering is a separate, automatic result-quality feature). Dropping the legacy `web-fetch` beta header is a deferred future cleanup, not this VEP. No premium.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-WebTools-DynamicFilter-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys the file to `vaultgpt-func-stream` per §6 + runs §5 post-deploy verification. No Role-C (no contract change).
