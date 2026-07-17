# Theo Backend — Tool-Loop MS1 `theo_message_stream` general-chat tool-loop — Pass 1 VEP

Controlling artifact for Codex review. Converts the deployed `theo_message_stream` (`vaultgpt-func-stream`) from a single-call **verbatim SSE relay** into a **parsed streaming agentic tool-loop** (DR-T11) that exposes registered `vaultgpt-func-theo-tools` tools to the model, dispatches `tool_use` to the tool endpoint **as the signed-in user**, and emits a new **`event: vault_export`** SSE frame for a downloadable result. First tool: `theo_export_spreadsheet` (DR-T9, DEPLOYED). This is what lets Theo actually *produce* the Excel Akshay asked for.

Self-contained: working handler under `functions/`, new registry under `engine/`, deployed originals under `primary-reference/`.

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
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary references copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "a Walter authorization quoted verbatim and predating the VEP" | §4 — the tool-loop + new-external-system dispatch (`chat-tools.js`) is authorized by DR-T11 (landed, predates this VEP) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "and `vaultgpt-func-stream` (v4 programming model" | §6 Deploy — Kudu VFS to func-stream (`src/functions/` + `src/engine/`) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T11 | "emits a new **`event: vault_export`** SSE frame carrying a downloadable result" | The loop's export emission (§4) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.10 | "then a final app event `event: vault_meta`" | The preserved wire contract this VEP extends (§1) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-ToolLoop-MS1-Pass-1-VEP/primary-reference/theo_message_stream.LIVE.js | primary-ref | "Relay upstream SSE verbatim to the client AND accumulate for persistence" | Primary reference (the file this VEP converts) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-ToolLoop-MS1-Pass-1-VEP/primary-reference/sigma_review_agent_stream.LIVE.js | mirror-ref | "drive the agentic loop asynchronously" | Structural-mirror reference (the working streaming tool-loop) |

### Currency anchors (blob SHAs @ HEAD)
- THEO_GOLDEN_HANDLER_STANDARD.md `49aa225aa6145adced121846de990725da5fe0f0`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `81918381737bdefee77aaf1364edf8cfc1dc5889`; THEO_API_SPEC.md `041dc861860a25c8fa406895530f8bde8d23513e`.
- Deployed source-of-truth SHAs (Kudu-GET this turn from func-stream, verbatim in `primary-reference/`): `theo_message_stream.js`, `sigma_review_agent_stream.js`, `src/engine/tool-loop.js`.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Change:** `theo_message_stream` (deployed on `vaultgpt-func-stream`, v4 programming model) today makes ONE upstream Foundry call and relays the Anthropic SSE **verbatim**, then persists + emits `event: vault_meta`. It has **no tool-loop** — the model cannot call a Theo tool. This VEP wraps the upstream call in a **bounded agentic loop** (`MAX_TOOL_TURNS`, default 8): each turn's native SSE is still relayed **verbatim** (FE contract unchanged — `sendMessageStream` parses native frames), and after each turn the handler inspects the reconstructed assistant content; if the model requested a **general-chat tool** (`stop_reason:"tool_use"` + a name in the registry) it dispatches the tool over HTTP to `vaultgpt-func-theo-tools` **as the signed-in user** (forwarding the caller's bearer — shared `api://4e1a1e31-…` audience), emits **`event: vault_export`** for a `downloadable` result, feeds the `tool_result` back, and loops. When the model stops calling tools, the accumulated assistant text + citations persist as one turn and `event: vault_meta` closes the stream (unchanged).
- **New file `engine/chat-tools.js`:** the general-chat tool **registry** (`{name, route, downloadable, description, input_schema}`) + `dispatchChatTool()` (stateless HTTPS POST to the tool endpoint). First entry: `theo_export_spreadsheet`. Adding a tool = one registry entry.
- **Boundary:** executes as the signed-in user (EasyAuth OID for identity; the delegated bearer forwarded for the tool call — no elevated credential). **No `reporting_*` access.** New external system = `vaultgpt-func-theo-tools` HTTP (a Theo-owned app), authorized by **DR-T11**. Persistence (`theo_conversations`/`theo_messages`, B8i) is **unchanged** (same `persistTurn`). No `theo_*` schema change, no migration.

## §2 Gap Register
**PROCEED.** (1) **Web/server tools coexistence:** built-in `web_search`/`web_fetch` are server-side (resolved upstream within a turn; `stop_reason` ≠ `tool_use`), so they never enter the client dispatch path — the loop only dispatches registry tools. A turn that mixes a server tool and a pending client `tool_use` does not occur in practice (server tools resolve inline); the reconstructed assistant turn preserves `text` + `tool_use` blocks exactly (server_tool_use/result blocks are not replayed, and only a `tool_use` turn is ever replayed). (2) **Golden-curl determinism:** an agentic loop is model-driven; the happy-path curl uses an explicit "use the spreadsheet export tool" instruction to deterministically induce one tool call (§5). (3) **`MAX_TOOL_TURNS`** bounds runaway loops. (4) Tool-app CORS is not needed (server-to-server HTTP, not browser). (5) No schema/migration.

## §3 Sub-phase walk (P1–P8)
- **P1 Feature:** §1 — tool-loop conversion; DR-T11 capability.
- **P2 Architecture/boundary:** §1 Boundary — func-stream; as-user HTTP dispatch to func-theo-tools; no reporting_*, no schema.
- **P3 Gap register:** §2 (PROCEED).
- **P4 Contract:** API Spec §2.10 (`theo_message_stream`, `1B-deployed`); this VEP adds the tool-loop + `event: vault_export` (Role-C at deploy).
- **P5 Handler grounding:** primary reference = deployed `theo_message_stream.js` (the file converted); structural mirror = deployed `sigma_review_agent_stream.js` (the working streaming tool-loop) + `engine/tool-loop.js` (the spine). All three copied verbatim under `primary-reference/`.
- **P6 Boundary re-check:** the only new interaction is the DR-T11-authorized as-user HTTP tool dispatch; everything else (Foundry call, memory/history/attachments, persistence) is byte-unchanged.
- **P7 Golden curls:** §5, run against func-stream post-deploy.
- **P8 Assembly:** this pack + lint PASS.

## §4 Structural Mirror Table
Primary Reference = deployed `theo_message_stream.js`. Structural mirror for the new loop = deployed `sigma_review_agent_stream.js`.

| Region (converted `theo_message_stream.js`) | vs reference | Classification | Anchor |
|---|---|---|---|
| Family-B helpers, ruleset, memory/history-RAG, attachments, `persistTurn`, request validation, ownership checks | byte-identical to the deployed `theo_message_stream.js` | **EXACT** | primary-ref |
| `getOboInputToken` | byte-identical to `sigma_review_agent_stream.js` | **EXACT (mirror)** | mirror-ref |
| `relayTurnRaw` | `sigma_review_agent_stream.relayTurn` + **verbatim raw relay retained** (writes the native chunk to the client) + citations capture | **ALLOWED DELTA** — same parse shape; the verbatim relay preserves the §2.10 native-frame contract | Golden Handler §4 (response shape) + mirror-ref |
| `openUpstream` | the deployed inline upstream-open, extracted to a fn; tools now `[...buildGroundingTools(), ...CHAT_TOOL_SCHEMAS]` | **ALLOWED DELTA** — same call; adds the registry tools | primary-ref |
| Agentic loop (`MAX_TOOL_TURNS`; dispatch; `event: vault_export`; tool_result feedback; accumulate text→one persisted turn) | mirrors `sigma_review_agent_stream`'s loop (turn → relay → tool_use? → dispatch → tool_result → loop) | **ALLOWED DELTA** — authorized by **DR-T11**; func-theo-tools HTTP dispatch replaces Sigma's in-proc engine dispatch | Golden Handler §4 (Walter-authorization-predating) + DR-T11 + mirror-ref |
| `engine/chat-tools.js` (registry + `dispatchChatTool` HTTPS POST) | new; the new external system (func-theo-tools HTTP) | **ALLOWED DELTA** — authorized by DR-T11 (predates VEP) | Golden Handler §4 + DR-T11 |
| removed `parseSseForPersistence` | folded into `relayTurnRaw` | **ALLOWED DELTA** (dead-code removal; parse moved) | primary-ref |

No DEVIATION rows. FE consumer contract unchanged except the additive `event: vault_export` (handled by the paired FE VEP).

## §5 Golden Curls (run by Claude Code against `vaultgpt-func-stream` at Pass-3; never print the token)
Auth: `TOKEN=$(az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e --query accessToken -o tsv)` as `wmansfield@vault-tax.com`. Base `https://<func-stream-host>/api/theo_message_stream`.
1. **OPTIONS** → `204`.
2. **Unauth** POST → `401`.
3. **Regression (no tool):** POST `{ messages:[{role:"user",content:"In one sentence, what is a partnership K-1?"}] }` → `200` `text/event-stream`; assert native `content_block_delta` text frames stream and a final `event: vault_meta` — normal chat still works, no `vault_export`.
4. **Happy (tool):** POST `{ messages:[{role:"user",content:"Use the spreadsheet export tool to make an Excel file: one sheet \"K-1\" with columns Box (text) and Amount (number), rows Box=1/Amount=12345.67 and Box=2/Amount=-987."}] }` → `200` stream containing **`event: vault_export`** with `data.downloadUrl` (+ filename/byteSize) and a final `event: vault_meta`. Then **GET the `downloadUrl`** → `200`, xlsx content-type, valid PK-zip, numeric `Amount` cells (reuses the Export-MS1 verification).
5. **Sibling regression:** one `sigma_review_agent_stream` curl unaffected (shared app).

## §6 Deploy (Pass-3, on APPROVAL) — Claude Code to `vaultgpt-func-stream` (DR-T11; Golden Handler §5.5)
1. Resolve SCM host: `az functionapp show -n vaultgpt-func-stream -g Vault-Tax --query enabledHostNames` (region-stamped).
2. Kudu VFS surgical PUT (ARM bearer, `If-Match:*`, GET-back diff): `functions/theo_message_stream.js` → `/site/wwwroot/src/functions/theo_message_stream.js`; `engine/chat-tools.js` → `/site/wwwroot/src/engine/chat-tools.js`. (No `function.json` — v4 programming model registers routes in code.)
3. `az functionapp restart -n vaultgpt-func-stream -g Vault-Tax`; unauth health (expect 401).
4. Run §5 golden curls. On green, Role-C updates API Spec §2.10 (`theo_message_stream` gains the tool-loop + `event: vault_export`) + notes DR-T11 DEPLOYED.
5. `THEO_TOOLS_BASE` app setting optional (defaults to the provisioned host).

## §7 Out of scope
FE (`DownloadCard` + `onExport`/`vault_export`) is the paired FE VEP. Non-streaming `theo_message` (func-premium) tool-loop parity is a later MS (streaming is the live chat path). Additional tools = later registry entries.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-ToolLoop-MS1-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS. `node --check` PASS on both `functions/theo_message_stream.js` and `engine/chat-tools.js`.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys to `vaultgpt-func-stream` per §6 + runs §5 golden curls.
