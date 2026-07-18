# Theo Backend — Tool-Loop: surface tool activity (`event: tool` / `event: tool_result`) — Pass 1 VEP

Additive change to the DEPLOYED `theo_message_stream` (`vaultgpt-func-stream`). The general-chat tool-loop currently dispatches a tool **silently** — the FE can't show which tool Theo picked or its progress (unlike the Sigma review agent, which streams live activity). This emits the **same clean `event: tool` / `event: tool_result` frames the Sigma agent emits**, so the FE can render live agent activity (VA-T7 `AgentActivity`) for general chat. Two additive `stream.write` lines; no behaviour change to dispatch, persistence, `vault_export`, or normal chat. Prerequisite for the paired FE change (which renders them). Self-contained: handler under `functions/`, deployed original under `primary-reference/`.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `e3a07552d8a37224d9331b47fbb62464ef9426b3`.
Currency-anchor form: git blob SHA at HEAD.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary reference (deployed handler) copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — the change adds two additive SSE frames; request/response/dispatch contract otherwise unchanged |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "and `vaultgpt-func-stream` (v4 programming model" | §6 Deploy — Kudu VFS to func-stream |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "each deterministic tool the instant it fires" | The Sigma sibling's `event: tool`/`event: tool_result` protocol this mirrors |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-ToolLoop-ToolActivity-Pass-1-VEP/functions/theo_message_stream.js | delta | "Surface the tool call to the client the instant it fires" | The one changed region (the dispatch loop) |

### Currency anchors (blob SHAs @ HEAD)
- THEO_GOLDEN_HANDLER_STANDARD.md `49aa225aa6145adced121846de990725da5fe0f0`; THEO_API_SPEC.md `015431576fb8e7f634025b785c97ea4022b93f0c`.
- Deployed handler = the source of truth (Kudu-GET this turn from func-stream; verbatim in `primary-reference/`; the ToolLoop-MS1 + max_tokens-fix state).

## §1 Feature Identification + Architecture & boundary reconciliation
- **Change (one region, the dispatch loop ~L1014):** for each dispatched general-chat tool, emit `event: tool` `{name, input}` immediately **before** `dispatchChatTool`, and `event: tool_result` `{name, ok}` immediately **after** — mirroring the clean events `sigma_review_agent_stream` already streams (API Spec §2.1). These are additive SSE frames alongside the existing verbatim relay + `vault_export` + `vault_meta`.
- **Why:** the FE's `AgentActivity` (VA-T7) renders exactly these events into a live "using `<tool>` … ✓" activity view; today only the Sigma path emits them, so general-chat tool calls are invisible. This unblocks the paired FE change.
- **Boundary unchanged:** dispatch (as the signed-in user), the tool_result fed back to the model, persistence, `vault_export`, and normal (no-tool) chat are byte-identical. No new external call, no schema, no auth change. The `input` in `event: tool` is the model's own tool_use input (already leaving the tenant to the model); the FE truncates it for display.

## §2 Gap Register
**PROCEED.** (1) Deploying this before the FE change is safe — the current FE ignores unknown `event: tool`/`event: tool_result` frames (it only parses raw frames + `vault_meta`/`vault_error`/`vault_export`), so behaviour is unchanged until the FE lands. (2) `event: tool` carries the tool_use `input`; for a large export payload this adds bytes to the stream — acceptable (one frame per tool call; the FE truncates for display). If ever a concern, a later change can summarise `input` server-side. (3) No contract/schema change; API §2.1 already documents the tool-loop (a Role-C may later note the additive general-chat `tool`/`tool_result` events, paired with the FE landing). (4) `node --check` PASS; diff is the two emit lines + comment only.

## §3 Sub-phase walk (P1–P8)
- P1 change (§1). P2 boundary unchanged (§1). P3 Gap (§2, PROCEED). P4 API §2.1 tool-loop contract (additive events; the Sigma sibling is the precedent). P5 primary reference = deployed `theo_message_stream` (copied verbatim; diff = one region). P6 no new external call/auth/helper. P7 golden curls (§5). P8 this pack + lint PASS.

## §4 Structural Mirror Table
Primary Reference = the deployed `theo_message_stream`. Pattern precedent = deployed `sigma_review_agent_stream` (emits `event: tool`/`event: tool_result` the instant each tool fires).

| Region | vs deployed | Classification | Anchor |
|---|---|---|---|
| Entire handler EXCEPT the dispatch loop | byte-identical | **EXACT** | primary-ref |
| dispatch loop (~L1014): `event: tool` before dispatch + `event: tool_result` after | 2 additive `stream.write` lines (+comment) mirroring the Sigma stream | **ALLOWED DELTA** — additive SSE frames; dispatch/response/persistence unchanged | Golden Handler §4 + API §2.1 (Sigma precedent) + delta anchor |

No DEVIATION rows.

## §5 Golden Curls (run by Claude Code against `vaultgpt-func-stream` at Pass-3; never print the token)
Auth: `az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e` as `wmansfield@vault-tax.com`. Base `.../api/theo_message_stream`.
1. **Tool turn now emits activity:** POST a prompt that induces the export tool (e.g. "Use the spreadsheet export tool to make a 1-sheet K-1 workbook…") → `200` stream; assert an **`event: tool`** frame (`data.name == "theo_export_spreadsheet"`, `data.input` present) streams **before**, and an **`event: tool_result`** frame (`data.name`, `data.ok == true`) **after**, the tool runs — then `vault_export` + `vault_meta`. (Pre-change: neither `tool` nor `tool_result` appeared.)
2. **Normal chat regression:** a plain question streams native text + `vault_meta`, **no** `event: tool`/`tool_result`/`vault_export` — unchanged.

## §6 Deploy (Pass-3, on APPROVAL) — Claude Code to `vaultgpt-func-stream` (DR-T11; Golden Handler §5.5)
1. Resolve SCM host; Kudu-GET the live `src/functions/theo_message_stream.js` (rollback baseline).
2. Kudu VFS PUT the updated file → `/site/wwwroot/src/functions/theo_message_stream.js` (If-Match:*, GET-back diff); restart; unauth health (401).
3. Run §5 golden curls. No Role-C required for the deploy (additive events); a Role-C noting the general-chat `tool`/`tool_result` events lands paired with the FE change.

## §7 Out of scope
The **FE** that renders these events (wiring `onTool`/`onToolResult` into `sendMessageStream` + the general-chat `send()`; the enhanced `AgentActivity` view with reasoning line + token count + status verbs; the VA-T7 visual update) is the paired FE VEP — authored after Walter approves the rendered activity-panel preview.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-ToolLoop-ToolActivity-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS. `node --check` PASS on the handler.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys to `vaultgpt-func-stream` + runs §5 golden curls.
