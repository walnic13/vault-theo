# Theo Backend — TODO tools `chat-tools` registration — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. The `vaultgpt-func-stream` half of the cross-agent TODO tool (paired with the APPROVED + DEPLOYED + golden-green `theo_todos` store + `theo_{create,list,update,complete}_todo` handlers on `vaultgpt-func-theo-tools`). **One additive edit** on `engine/chat-tools.js`: register the four TODO tools in `CHAT_TOOLS` so the streaming loop exposes them to Claude and dispatches them to the deployed handlers **as the signed-in user** (the caller's bearer is forwarded; func-stream + func-theo-tools share audience `api://4e1a1e31-…`). Nothing else changes — the registry mechanism (`BY_NAME`/`CHAT_TOOL_SCHEMAS`/`dispatchChatTool`, DR-T11) is untouched, and unlike a media/export tool these are **non-downloadable, non-media** (the model relays each result as text), so there is **no `theo_message_stream.js` change and no new SSE frame**. Self-contained: the edited `engine/chat-tools.js` + the deployed LIVE snapshot under `primary-reference/`. **Inert without regression**: adding registry entries changes no existing behaviour; the model only calls a TODO tool when the user's request calls for it.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan — a tool-registry registration; no DB/schema/handler change)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Grounding parent (source baseline): vault-theo `b5318cf2d3d3e8c1bf75fdc296c04a57abbd7c29` — the **pre-package parent**; all grounding reads were taken here; the package files do not exist at this parent.
Package / review HEAD: this pack (the controlling `INDEX.md` + `engine/chat-tools.js` + `primary-reference/`) is committed on top of that parent and is the current vault-theo `development` HEAD (resolve `git rev-parse HEAD` at review time). Per-file currency is anchored to the **content-stable blob SHAs** in "Currency anchors" below (Conformance §8) — not a self-referential commit SHA.
The paired `theo_todos` handlers + migration are APPROVED + deployed + golden-verified on `vaultgpt-func-theo-tools` (2026-08-02; vault-theo-tools `a031119`). The base `chat-tools.js` LIVE snapshot was **GET-verified from Kudu this turn** (func-stream `/site/wwwroot/src/engine/chat-tools.js`, blob `8850c347…`, byte-identical to the primary-reference copy).
Currency-anchor form: git blob SHA (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary Reference — the deployed `chat-tools.js` copied full-verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — each tool's `input_schema` matches the deployed `theo_todos` handler's request contract (create/list/update/complete) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T11 | "DR-T11" | §1 — the general-chat tool-loop dispatches the four TODO tools (forwarded bearer, shared audience) — the identical mechanism `theo_find_image` uses |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | tool-dispatch | "tool-dispatch" | §1 — the loop dispatches the tool to func-theo-tools as the signed-in user |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo-tools/spec/VAULT_THEO_TOOLS_PLATFORM.md | §4 | "one handler + one catalog entry" | §1 — the toolbox handlers (deployed) + this `chat-tools` registration entry are the two halves of adding a tool |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-Todo-Tools-Registration-Pass-1-VEP/primary-reference/PRIMARY_REFERENCE.chat-tools.DEPLOYED.js | primary-ref | "const CHAT_TOOLS" | §4 — four additive `CHAT_TOOLS` entries; the registry mechanism/dispatch is byte-unchanged |

### Currency anchors (blob SHAs)
- vault-theo standards @ HEAD `b5318cf`: THEO_GOLDEN_HANDLER_STANDARD.md `f8f0e5ea36447502e35fb87b373c94e376f05cbb`; CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md `e44cdd85d3d0e5df332dc754cdec731e2e68022e`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `565559b699c1309f8e750b0dbbac859c13d807c8`; THEO_ARCHITECTURE_AND_STRUCTURE.md `07451ce9d912830b3c15fedf74761d00c59f97b2`; THEO_GROUNDING_CONFORMANCE_STANDARD.md `7c0d902bdff3b6c0af475b483e31ed796214e57b`.
- vault-theo-tools @ current HEAD (blob verified): VAULT_THEO_TOOLS_PLATFORM.md `3d1e958735da4db8ec23fc8dea98faf904415932`.
- primary-reference (GET-verified from func-stream Kudu this turn): `PRIMARY_REFERENCE.chat-tools.DEPLOYED.js` `8850c347205430b937d5117a8446d8549ec02efc`.
- this package (proposed): `engine/chat-tools.js` `5daea3e61de1968088511b4b0ca5b8db152feb5c` (= deployed base + four additive TODO entries).

### Full Baseline doc set (Conformance §4 backend) — grounded this turn
Governor, Conformance (this GCR/Rule-Anchor/lint), Codex Review, Golden Handler (§2 primary-ref, §4 contract shape), Orchestration (DR-T11), Architecture (tool-dispatch), vault-theo-tools Platform (§4 recipe). Schema / API Spec — **N/A** (no DB/schema/handler change; a registry entry pointing at already-deployed handlers). The paired handlers' API-Spec/catalog Role-C rows are recorded with the store package (Pkg-1) once the tools are usable end-to-end (§2 G-3).

## §1 Feature Identification + Architecture & boundary reconciliation
- **Edit — `chat-tools.js` register the four TODO tools:** add four `CHAT_TOOLS` entries (`theo_create_todo` / `theo_list_todos` / `theo_update_todo` / `theo_complete_todo`; `downloadable: false`; `description` + `input_schema`) so the streaming loop exposes them via `CHAT_TOOL_SCHEMAS` and `dispatchChatTool` POSTs each call to `${TOOLS_BASE}/api/<route>` with the forwarded user bearer (DR-T11) — the identical mechanism `theo_find_image`/`theo_find_video` use. `theo_create_todo` fixes `agent` to `"theo"` (required enum) so Theo-authored items are tagged as his; identity (`created_by`) is the signed-in user, handled server-side by the deployed handler (never passed by the model).
- **Architecture & boundary reconciliation:** one file on `vaultgpt-func-stream` (the tool registry). No new endpoint, no DB/schema/migration/Blob/MI, no premium. The four TODO **handlers are unchanged** (already deployed + golden-green). Registry/dispatch internals (`BY_NAME`/`CHAT_TOOL_SCHEMAS`/`isChatTool`/`isDownloadable`/`dispatchChatTool`/`postJson`, DR-T11) are byte-unchanged — the four entries are purely additive to the `CHAT_TOOLS` array. No new SSE frame (TODO results are non-media/non-download; the model relays them as text). Deploy target `vaultgpt-func-stream`.
- **Inert without regression.** Adding registry entries changes nothing existing: the model calls a TODO tool only when the user's request calls for it; `theo_export_spreadsheet`/`theo_fetch_image`/`theo_find_image`/`theo_find_video`/normal chat are byte-unchanged. No FE change is required (no new frame).

## §2 Gap Register
**PROCEED.**
- **(G-1) `agent` tag = "theo" via required enum.** `theo_create_todo.input_schema.agent` is `enum: ['theo']`, required — deterministic tagging without a dispatch change (the shared `dispatchChatTool` stays generic). Disclosed, PROCEED.
- **(G-2) `project_id` is model-supplied + optional.** Included only when a specific project is in context; the deployed handler enforces membership (403 non-member, fail-closed) and treats a personal TODO (no `project_id`) as owner-only. No session-injection needed. PROCEED.
- **(G-3) Role-C (catalog + API Spec).** The vault-theo-tools platform tool-catalog rows + any THEO_API_SPEC tool-loop mention flip to DEPLOYED once the tool is usable end-to-end — i.e. after this registration ships (Theo side) and the paired **`vault-dottie`** dispatch registration ships (Dottie side). Recorded, PROCEED.
- **(G-4) Dottie half is a separate package.** Making the tools callable from Dottie is the paired `vault-dottie` package (add to the stream tool-array + forward the user bearer for these tools). Out of scope here. PROCEED.
- **(G-5) No schema/migration/keys/npm/FE.** PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1 Feature identification:** §1 — register the four deployed TODO tools in the general-chat loop.
- **P2 Architecture/boundary:** §1 — one additive registry edit; DR-T11 dispatch unchanged; no DB/frame/FE.
- **P3 Schema grounding:** N/A — no DB/schema touched (the handlers + `theo_todos` are already deployed).
- **P4 Contract grounding:** §4 — each `input_schema` matches the deployed handler's request body (create `{agent,title,detail?,project_id?}`; list `{project_id?,status?}`; update `{id,title?,detail?,status?}`; complete `{id}`).
- **P5 Handler grounding (declared track):** §4 — Primary Reference = the deployed `chat-tools.js` (GET-verified from Kudu, blob `8850c347`), copied verbatim under `primary-reference/`; the four entries mirror the existing entry structure exactly (Structural Mirror §4).
- **P6 SQL grounding:** N/A — no SQL.
- **P7 Curl grounding:** §5 — post-deploy verification (registry loads; the four schemas are exposed; a live model turn calls a TODO tool).
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + lint PASS).

## §4 Structural Mirror Table
Primary Reference = the deployed `chat-tools.js` (func-stream, blob `8850c347`, GET-verified this turn), copied verbatim under `primary-reference/`. The four TODO entries are structurally identical to the existing `theo_find_image` / `theo_find_video` entries.

| Region (proposed chat-tools.js) | vs Primary Reference | Classification | Anchor |
|---|---|---|---|
| all module code except the `CHAT_TOOLS` array contents (`require`s, `TOOLS_BASE`, `BY_NAME`, `CHAT_TOOL_SCHEMAS`, `isChatTool`, `isDownloadable`, `postJson`, `dispatchChatTool`, `module.exports`) | byte-identical to the deployed base | **EXACT** | primary-ref "const CHAT_TOOLS" |
| the four new `CHAT_TOOLS` entries: `{ name, route, downloadable:false, description, input_schema }` shape | same entry structure as the existing `theo_find_image`/`theo_find_video` entries | **EXACT (structure)** | Golden §2/§4; primary-ref |
| the entries' `description` + `input_schema` content (TODO create/list/update/complete; `agent` enum `['theo']`; `project_id`/`status`/`id` fields) | new tool content (no primary-ref equivalent) | **ALLOWED DELTA** (the TODO tools) | §1; Golden §4 — matches the deployed handler contracts |

No DEVIATION rows. `node --check` PASS.

## §5 Post-deploy verification (Claude Code, on APPROVAL)
Deploy `engine/chat-tools.js` to `vaultgpt-func-stream` (Kudu VFS PUT `/site/wwwroot/src/engine/chat-tools.js`, GET-back byte-identical to `5daea3e6`, restart). Then:
1. Sanity: `node --check` on the deployed file (via a Kudu GET + local check) — the module loads; `CHAT_TOOL_SCHEMAS` now includes the four TODO tools.
2. Live model turn (as `wmansfield@vault-tax.com` through the Theo streaming path): ask Theo to "add a TODO to confirm the §1446(f) withholding" → assert a `theo_create_todo` `tool_use` is dispatched and a TODO row is created (verify via `theo_list_todos` or the deployed store); then "list my TODOs" → the item is returned. (End-to-end model-callability; the handlers themselves are already golden-verified.)
3. Regression: a normal chat turn + a `theo_find_image` turn behave unchanged.

## §6 Deploy (Pass-3, on APPROVAL) — Kudu VFS to `vaultgpt-func-stream` (Golden §5.5)
1. Resolve the SCM host (`az functionapp show -n vaultgpt-func-stream -g Vault-Tax --query enabledHostNames`).
2. Kudu VFS GET the current `/site/wwwroot/src/engine/chat-tools.js` (rollback baseline; expect blob `8850c347`). PUT the proposed `engine/chat-tools.js` (`If-Match:*`; expect 204). GET-back + diff (expect blob `5daea3e6`). `az functionapp restart -n vaultgpt-func-stream -g Vault-Tax`.
3. Run §5 verification.
4. Role-C (with the Dottie half): catalog + API-Spec rows → DEPLOYED once both agents can call the tools.

## §7 Out of scope
The paired **`vault-dottie`** dispatch registration (add the four tools to Dottie's stream tool-array in the flat gpt-5 Responses-API function shape + forward the incoming user bearer for these tools). Auto-feed (verdicts/flags → TODOs). The console/task-list FE surfacing.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-Todo-Tools-Registration-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys `engine/chat-tools.js` to `vaultgpt-func-stream` per §6 + runs §5 verification; then the paired `vault-dottie` dispatch package makes the tools callable from Dottie too.
