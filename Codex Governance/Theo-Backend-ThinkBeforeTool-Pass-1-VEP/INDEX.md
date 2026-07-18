# Theo Backend — Explicit summarized thinking + plan-before-tool nudge — Pass 1 VEP

Two small changes to the DEPLOYED `theo_message_stream` (`vaultgpt-func-stream`), both making the adaptive-thinking work show up on the **file-export** turn (Walter's actual test), which the prior adaptive change did not fix on its own:

1. **`thinking: {type:"adaptive", display:"summarized"}`** — set `display` explicitly. Verified this turn that `claude-sonnet-4-6` returns summarized (visible) thinking text *by default* today (a reasoning golden curl streamed 10,041 chars of thinking over ~100s), but that default silently flips to `"omitted"` (empty thinking text) on newer models — so pinning `summarized` keeps Theo's visible thinking robust if the Foundry deployment ever moves. No behaviour change on the current model.
2. **A `TOOL_PLANNING_SYSTEM` nudge** (func-stream tool-loop only) — a file-export is a mechanical tool call the model does with ~0 deliberation, so adaptive self-scales thinking to nothing and there's nothing to stream during the wait (golden curl this turn: the export turn produced **1** thinking frame). This asks the model to reason through the file's structure BEFORE calling the tool — which streams a visible thinking phase the FE can show ("watch it work") AND yields a better-structured file. Scoped to file/document-building tools; quick lookups exempt. Deliberately NOT added to the shared `THEO_OPERATING_RULESET` (keeps the READ-ONLY monolith untouched + avoids the byte-identical-ruleset constraint).

Self-contained: handler under `functions/`, deployed baseline under `primary-reference/`.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `910e0916abf01c69095696edc8e3afe66205480c` (the commit that contains this package).
Currency-anchor form: git blob SHA at HEAD.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary reference (deployed handler) copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — SSE response shape unchanged; changes are a `display` field + a system-prompt block |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "and `vaultgpt-func-stream` (v4 programming model" | §6 Deploy — Kudu VFS to func-stream |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "streams `event: vault_tokens`" | §1 — the live counter this makes climb during the export turn's new thinking phase (no wire change) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-ThinkBeforeTool-Pass-1-VEP/functions/theo_message_stream.js | delta | "PLAN BEFORE BUILDING A FILE WITH A TOOL" | The changed regions (thinking display + the tool-planning system block) |

### Currency anchors (blob SHAs @ HEAD `910e091`)
- THEO_GOLDEN_HANDLER_STANDARD.md `49aa225aa6145adced121846de990725da5fe0f0`; THEO_API_SPEC.md `ce1ad227ca4f66a5c9c74ccdb185f3d2c3974cd3`.
- Deployed handler = the source of truth (the AdaptiveThinking state, Codex-APPROVED + deployed 2026-07-18). Copied verbatim in `primary-reference/`; Pass-3 Kudu-GETs the live file to confirm the rollback baseline before PUT.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Change (two regions, config/prompt only — no control-flow change):**
  - `openUpstream` thinking clause: `{type:"adaptive"}` → `{type:"adaptive", display:"summarized"}`.
  - New module const `TOOL_PLANNING_SYSTEM` (a system-prompt block) inserted into `effectiveSystem` **after** `THEO_RULESET` and before memory/history/client-system: `[THEO_RULESET, TOOL_PLANNING_SYSTEM, memoryBlock, historyBlock, systemPrompt]`.
- **Why:** verified this turn against the deployed endpoint — a *reasoning* turn already streams ~100s of visible summarized thinking with the counter climbing 22× during it, but the *export* turn thinks ~0 (1 frame), so the export shows no live progress. The nudge makes the model reason through the workbook structure before the tool call, so the export turn also gets a streamed thinking phase (visible reasoning + climbing counter). `display:"summarized"` guarantees that thinking stays visible.
- **Boundary unchanged:** SSE wire contract, tool-loop, dispatch, persistence, and every `event:` frame shape are byte-identical. `display` is a field on the existing `thinking` param; `TOOL_PLANNING_SYSTEM` is prepended to the `system` string the handler already assembles. No new external call, schema, or auth. The nudge lives ONLY in func-stream (not the shared ruleset), so the monolith `theo_message` and `THEO_OPERATING_RULESET.md` are untouched.

## §2 Gap Register
**PROCEED.** (1) **Display default verified** — sonnet-4-6 returns summarized thinking by default today (10,041 chars streamed this turn); `display:"summarized"` is a robustness pin, not a behaviour change now. (2) **Latency** — the nudge adds a planning phase to file-building turns (Walter-accepted: "more latency… but more natural too"). Scoped to file/document tools; quick lookups (web search) are explicitly exempt in the nudge text, and it is prepended only in func-stream. (3) **Over-triggering** — the nudge is measured ("reason through the structure… then call the tool"), not an aggressive MUST-directive, appropriate for sonnet-4-6's literal instruction-following. (4) **No wire-contract change** → no API-Spec Role-C. (5) **Rollback** = redeploy `primary-reference/`. (6) `node --check` PASS; diff = the two regions + comments (15 changed lines).

## §3 Sub-phase walk (P1–P8)
- P1 change (§1). P2 boundary unchanged (§1). P3 Gap (§2, PROCEED). P4 API §2.1 — the `vault_tokens` counter this makes climb on the export turn; no wire change. P5 primary reference = deployed `theo_message_stream` (copied verbatim; diff = two regions). P6 no new external call/auth/helper; `display` is a field on the existing Foundry call. P7 golden curls (§5). P8 this pack + lint PASS.

## §4 Structural Mirror Table
Primary Reference = the deployed `theo_message_stream` (AdaptiveThinking state).

| Region | vs deployed | Classification | Anchor |
|---|---|---|---|
| Entire handler EXCEPT the thinking clause + the effectiveSystem assembly + the new const | byte-identical | **EXACT** | primary-ref |
| Thinking clause: `+ display:"summarized"` | one field added to the existing `thinking` param | **ALLOWED DELTA** — payload field; response shape unchanged | Golden Handler §4 + delta anchor |
| `TOOL_PLANNING_SYSTEM` const + its slot in `effectiveSystem` | a system-prompt block prepended (func-stream only) | **ALLOWED DELTA** — system-prompt content; no contract/flow change | delta anchor |

No DEVIATION rows.

## §5 Golden Curls (run by Claude Code against `vaultgpt-func-stream` at Pass-3; never print the token)
Auth: `az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e` as `wmansfield@vault-tax.com`. Base `.../api/theo_message_stream`. Timing-aware reader.
1. **Export turn now shows planning:** POST a prompt that induces the export tool ("Use the spreadsheet export tool to build a 3-sheet K-1 workbook…") → `200`. Assert: a **`thinking_delta` phase streams for multiple seconds BEFORE `event: tool`** (not the pre-change 1-frame blip), its text is **non-empty** (summarized) and references the workbook structure, `event: vault_tokens` **climbs during that phase**, then `event: tool` (`theo_export_spreadsheet`) → `tool_result ok:true` → `vault_export` → `vault_meta`, and the export still completes.
2. **Normal chat regression:** a plain question streams native text + `vault_tokens` + `vault_meta`, no `event: tool` — unchanged (nudge inert without a tool).

## §6 Deploy (Pass-3, on APPROVAL) — Claude Code to `vaultgpt-func-stream` (DR-T11; Golden Handler §5.5)
1. Resolve SCM host; Kudu-GET the live `src/functions/theo_message_stream.js` (rollback baseline; confirm it matches `primary-reference/`).
2. Kudu VFS PUT the updated file → `/site/wwwroot/src/functions/theo_message_stream.js` (If-Match:*, GET-back diff); restart; unauth health (401).
3. Run §5 golden curls (timing-aware). No app-setting change; no API-Spec Role-C (no wire-contract change).

## §7 Out of scope
The paired **FE** refinement — show the live token counter DURING the thinking/planning phase (the shipped toggle currently hides it while thinking streams), and render the activity panel from the first thinking token, routing thinking into its reasoning line — is a separate FE VEP (next). This backend change produces the thinking phase; the FE change makes it visible.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-ThinkBeforeTool-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS. `node --check` PASS on the handler.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys to `vaultgpt-func-stream` + runs §5 golden curls.
