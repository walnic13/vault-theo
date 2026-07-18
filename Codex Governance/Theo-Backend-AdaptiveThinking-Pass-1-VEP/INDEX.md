# Theo Backend — Adaptive thinking + effort (live "Thinking… Nk tokens" phase) — Pass 1 VEP

Change to the DEPLOYED `theo_message_stream` (`vaultgpt-func-stream`) thinking configuration. Today the handler runs **fixed** extended thinking (`thinking: {type:"enabled", budget_tokens: 2048}`) — which on `claude-sonnet-4-6` produces only ~1 second of thinking, so a spreadsheet-export turn shows no live progress: the model thinks briefly, then the `tool_use` JSON arrives from the gateway in a burst at the end, and the token counter jumps rather than climbs (Walter, dev SWA; measured this turn — first `vault_tokens` at 15.0s in a burst). This switches thinking to **adaptive** (`thinking: {type:"adaptive"}` + `output_config: {effort:"medium"}`) — the model self-scales thinking depth to task difficulty and streams a **continuous, task-proportional `thinking_delta` phase** (measured this turn on the live gateway: **~40–140s** of continuously streamed thinking on a hard prompt; ~seconds on a trivial one). Because that phase streams incrementally, the already-deployed `event: vault_tokens` estimate climbs smoothly through it — the live "Thinking… Nk tokens" experience, superseding the deprecated fixed budget. Self-contained: handler under `functions/`, deployed baseline under `primary-reference/`.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `891ec277ea19a64cc43576eaffbeec7939d1de49` (the commit that contains this package).
Currency-anchor form: git blob SHA at HEAD.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary reference (deployed handler) copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — the SSE response shape is unchanged; adaptive just yields more `thinking_delta` frames + a longer `vault_tokens` stream |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "and `vaultgpt-func-stream` (v4 programming model" | §6 Deploy — Kudu VFS to func-stream |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "streams `event: vault_tokens`" | §1 — the live counter this change makes climb during the thinking phase (contract already documented; no wire change) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-AdaptiveThinking-Pass-1-VEP/functions/theo_message_stream.js | delta | "adaptive can spend thousands of tokens on the" | The changed regions (thinking config + max_tokens floor) |

### Currency anchors (blob SHAs @ HEAD `891ec27`)
- THEO_GOLDEN_HANDLER_STANDARD.md `49aa225aa6145adced121846de990725da5fe0f0`; THEO_API_SPEC.md `ce1ad227ca4f66a5c9c74ccdb185f3d2c3974cd3`.
- Deployed handler = the source of truth (the ToolActivity-LiveStreaming state, Codex-APPROVED + deployed 2026-07-18). Copied verbatim in `primary-reference/`; Pass-3 Kudu-GETs the live file to confirm the rollback baseline before PUT.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Change (three regions, config only — no control-flow change):**
  - New env-driven mode selectors (`THINKING_MODE` default `"adaptive"`, `THINKING_EFFORT` default `"medium"`); `THINKING_BUDGET` retained for the legacy `"enabled"` path only.
  - `openUpstream` payload: when `THINKING_MODE === "adaptive"`, send `thinking: {type:"adaptive"}` + `output_config: {effort: THINKING_EFFORT}` instead of `thinking: {type:"enabled", budget_tokens: N}`. Legacy `"enabled"`/`"off"` paths preserved behind the mode switch.
  - Tool-loop `max_tokens` floor raised 16384 → 32768 (env-overridable) so adaptive thinking (which can spend thousands of tokens *before* the `tool_use`) cannot starve a large export mid-loop; and the legacy `budget_tokens`→`max_tokens` bump is gated to `"enabled"` mode.
- **Why:** verified this turn against the live gateway (`claude-sonnet-4-6`): adaptive + effort is **accepted (HTTP 200)** and streams continuous thinking for tens of seconds (vs ~1s at the fixed 2048 budget). The deployed `event: vault_tokens` estimate is fed by `thinking_delta` chars, so it climbs live through that phase — the Claude-Code "Thinking… Nk tokens" feel Walter asked for. Adaptive self-scales, so simple chats stay fast (no fixed per-turn spend).
- **Boundary unchanged:** the SSE wire contract, the tool-loop, dispatch, persistence, `event: tool`/`tool_result`/`vault_export`/`vault_tokens`/`vault_meta` are all byte-identical in shape. No new external call, no schema, no auth change. The only observable difference is *more* `thinking_delta` frames + a longer `vault_tokens` stream (both already part of the contract). **Verified safe:** a 2-turn adaptive tool-loop probe this turn confirmed the loop still works when the assistant turn's thinking blocks are dropped on the echo-back (HTTP 200 either way) — so the existing assistant-turn reconstruction needs no change.

## §2 Gap Register
**PROCEED.** (1) **Model support verified this turn** — `claude-sonnet-4-6` accepted `thinking:{type:"adaptive"}` + `output_config:{effort}` (HTTP 200); Sonnet 4.6 is the recommended-adaptive tier and `budget_tokens` is deprecated on it. (2) **Latency:** adaptive at `effort:"high"` spent an entire 8k-token budget on thinking (no answer) in this turn's probe — hence `effort:"medium"` (visible climb, keeps latency sane) + the 32768 floor (thinking + a multi-sheet K-1 export + reply all fit). Tunable at runtime via `THEO_THINKING_EFFORT` without a redeploy. (3) **No wire-contract change** → no API-Spec Role-C required (§2.1 already documents `event: vault_tokens`; adaptive only lengthens that stream). (4) **Rollback** = redeploy the `primary-reference/` baseline and/or set `THEO_THINKING_MODE=enabled`. (5) `node --check` PASS; the diff is the three config regions + comments only.

## §3 Sub-phase walk (P1–P8)
- P1 change (§1). P2 boundary unchanged (§1). P3 Gap (§2, PROCEED). P4 API §2.1 — the `vault_tokens` counter this change makes climb; no wire change. P5 primary reference = deployed `theo_message_stream` (copied verbatim; diff = three config regions). P6 no new external call/auth/helper; `output_config.effort` is a payload field on the existing Foundry call, verified accepted this turn. P7 golden curls (§5). P8 this pack + lint PASS.

## §4 Structural Mirror Table
Primary Reference = the deployed `theo_message_stream` (ToolActivity-LiveStreaming state).

| Region | vs deployed | Classification | Anchor |
|---|---|---|---|
| Entire handler EXCEPT the thinking config, the openUpstream thinking clause, and the max_tokens floor | byte-identical | **EXACT** | primary-ref |
| Thinking config selectors (`THINKING_MODE`/`THINKING_EFFORT`) + openUpstream `adaptive` clause | fixed `budget_tokens` → `adaptive` + `effort`, behind a mode switch (legacy paths preserved) | **ALLOWED DELTA** — payload-field change on the existing Foundry call; response shape unchanged | Golden Handler §4 + delta anchor |
| `max_tokens` floor 16384 → 32768 + legacy-bump gated to `"enabled"` | headroom so adaptive thinking can't starve the tool_use | **ALLOWED DELTA** — a ceiling raise; no behavior change for replies that stop naturally | delta anchor |

No DEVIATION rows.

## §5 Golden Curls (run by Claude Code against `vaultgpt-func-stream` at Pass-3; never print the token)
Auth: `az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e` as `wmansfield@vault-tax.com`. Base `.../api/theo_message_stream`. A timing-aware reader asserts the thinking phase + counter climb.
1. **Tool turn — long live thinking + climbing tokens, export still completes:** POST a prompt that induces the export tool (e.g. "Use the spreadsheet export tool to build a 3-sheet K-1 workbook…") → `200` stream. Assert: `thinking_delta` frames stream **continuously for many seconds** (first well before the tool fires; not a ~1s blip); `event: vault_tokens` climbs monotonically **during that thinking phase** (not only at the end); then `event: tool` (`theo_export_spreadsheet`) → `tool_result` (`ok:true`) → `vault_export` → `vault_meta`. Critically, assert the **export still completes** (thinking did not consume `max_tokens` before the tool_use — the 32768 floor holds).
2. **Normal chat regression:** a plain question streams `thinking_delta` (brief — adaptive scales down) + native text + climbing `vault_tokens` + `vault_meta`; a full answer is produced (thinking does not starve the reply). No `event: tool`/`tool_result`/`vault_export`.

## §6 Deploy (Pass-3, on APPROVAL) — Claude Code to `vaultgpt-func-stream` (DR-T11; Golden Handler §5.5)
1. Resolve SCM host; Kudu-GET the live `src/functions/theo_message_stream.js` (rollback baseline; confirm it matches `primary-reference/`).
2. Kudu VFS PUT the updated file → `/site/wwwroot/src/functions/theo_message_stream.js` (If-Match:*, GET-back diff).
3. Set app setting `THEO_THINKING_EFFORT=medium` on `vaultgpt-func-stream` (benign config; makes the effort tunable without a redeploy — the handler already defaults to it, so this is explicit-for-ops). `THEO_THINKING_MODE` left unset (defaults to `adaptive`). Restart; unauth health (401).
4. Run §5 golden curls (timing-aware). No API-Spec Role-C required (no wire-contract change).

## §7 Out of scope
The paired **FE** refinement (show the live token counter DURING the thinking phase — the shipped toggle currently hides it while thinking streams — and render the activity panel from the first thinking, routing thinking into its reasoning line) is a separate FE VEP, authored next. This backend change is what makes the thinking phase long enough to be worth showing.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-AdaptiveThinking-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS. `node --check` PASS on the handler.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys to `vaultgpt-func-stream`, sets `THEO_THINKING_EFFORT=medium`, and runs §5 golden curls.
