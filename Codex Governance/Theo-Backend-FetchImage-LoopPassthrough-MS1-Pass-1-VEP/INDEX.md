# Theo Backend — FetchImage LoopPassthrough-MS1 (tool-loop image `tool_result` + `chat-tools` registry) — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. The **engine half** of IMG-2 (paired with the `vault-theo-tools` `theo_fetch_image` handler VEP). Two surgical changes to Theo core on `vaultgpt-func-stream`: (1) `theo_message_stream.js` — when a dispatched tool returns `{ image:{ media_type, data(base64), … } }` (i.e. `theo_fetch_image`), build the `tool_result` as a real Anthropic **image content block** so the model can SEE the fetched image (today every tool result is `JSON.stringify(out)` — text only); (2) `engine/chat-tools.js` — register `theo_fetch_image` (`downloadable:false`). Full modified files under `functions/` + `engine/`; deployed baselines under `primary-reference/`.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `54618866962353a4548af6e45f7c0ef95fe296b4` (the commit that first contains this package; grounding reads against parent `ded6a1e8db95a4321a0da07d80405c37c3423315`; cited-doc blob SHAs below are HEAD-stable).
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary Reference — deployed `theo_message_stream.js` + `chat-tools.js` copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "Bounded agentic tool-loop" | §1/§4 — the loop this VEP modifies |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "feeds the `tool_result` back" | §4 — the `tool_result` contract amended to allow an image content-block array |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.8 | "attachment_ids" | §4 — image content blocks are the deployed convention (attachment pipeline); the passthrough reuses that block shape |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Claude Code deploys" | §6 — Kudu VFS deploy to `vaultgpt-func-stream` (v4 programming model) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | tool-dispatch | "tool-dispatch" | §1 Architecture & boundary reconciliation — confined to the existing tool-dispatch seam |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-FetchImage-LoopPassthrough-MS1-Pass-1-VEP/primary-reference/theo_message_stream.LIVE.js.md | primary-ref | "content: JSON.stringify(out)" | §4 — the exact line the passthrough replaces (conditional) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-FetchImage-LoopPassthrough-MS1-Pass-1-VEP/primary-reference/chat-tools.LIVE.js.md | primary-ref | "const CHAT_TOOLS" | §4 — the registry the `theo_fetch_image` entry appends to |

### Currency anchors (blob SHAs @ HEAD)
- THEO_GOLDEN_HANDLER_STANDARD.md `d2b240dd14ba8f678c5d75488a2225d53791ccce`; THEO_API_SPEC.md `dd0460ec5692f363d4096eed61de8117dae62a2a`; THEO_ARCHITECTURE_AND_STRUCTURE.md `07451ce9d912830b3c15fedf74761d00c59f97b2`.
- Primary-reference source blobs @ HEAD: deployed loop `theo_message_stream.js` `e1510c795ab45e877bc94f3072a6eb68fc3b0e38`; `chat-tools.js` `643b6cbe413954accad584271077ee46668d919d` (copied verbatim into `primary-reference/`; Pass-3 Kudu-GETs the LIVE file as the true deploy base per Golden Handler §5.5).

## §1 Feature Identification + Architecture & boundary reconciliation
- **Feature (PROPOSED → this VEP):** the tool-loop image `tool_result` passthrough + the `theo_fetch_image` `chat-tools` registration. When `dispatchChatTool` returns a payload with `out.image` (base64 + media_type), the loop builds `tool_result.content` as `[{type:"image",source:{type:"base64",media_type,data}}, {type:"text", …provenance}]`; for every other tool it remains `JSON.stringify(out)` (unchanged). The registry gains one entry (`theo_fetch_image`, `downloadable:false`) so the model is offered the tool.
- **Boundary:** confined to `vaultgpt-func-stream` **core** (the engine, per the tools-repo governance boundary — this is why it is a `vault-theo` package, not a `vault-theo-tools` one). **No new external system**: the loop already dispatches tools as the signed-in user (OBO bearer) and already relays image content blocks from user turns (attachment pipeline, API §2.8) — this reuses that block shape on the tool-result path. No DB, no schema, no new auth. Amends the `tool_result` **content contract** (API §2.1) from "string only" to "string OR content-block array"; the registry append mirrors the deployed export entry.

## §2 Gap Register
**PROCEED.**
- **(1) Paired-package dependency.** The registry entry points at `theo_fetch_image` on `vaultgpt-func-theo-tools`; it must exist for the tool to work. Deploy order: the **Package A handler** deploys first (or together), then this loop package. Until both are live, nothing regresses (the new branch only fires when a tool returns `out.image`, which only `theo_fetch_image` does). Recorded, PROCEED.
- **(2) Content-block-array `tool_result` is a standard Anthropic shape** — the same `{type:"image",source:{type:"base64",…}}` block the gateway already accepts in user turns (API §2.8 attachment injection). The upstream Anthropic-shape Foundry gateway accepts a content-block array as `tool_result.content`. PROCEED.
- **(3) base64 payload size.** A fetched image (≤10 MB → ~13 MB base64) rides in the loop `convo` as one `tool_result`; `THEO_TOOL_LOOP_MAX_TOKENS` (default 16384) governs the model's OUTPUT, not input, and the handler caps the image at 10 MB, so the request stays bounded. PROCEED.
- **(4) API Spec §2.1 amendment** (document the `tool_result` content shape: string OR content-block array) is PROPOSED here; Role-C flips it to DEPLOYED after the Pass-3 integration verify. PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1 Feature identification:** §1 — loop image passthrough + `theo_fetch_image` registration (IMG-2 engine half).
- **P2 Architecture/boundary:** confined to the func-stream tool-dispatch seam; reuses the deployed image-content-block convention (§2.8); no new external system/auth/schema. (§1 Boundary.)
- **P3 Gap register:** §2 (PROCEED).
- **P4 Contract grounding:** API §2.1 tool-loop; amends the `tool_result` content shape (string → string|content-block-array). This VEP locks it; Role-C to DEPLOYED post-verify.
- **P5 Handler grounding:** Primary Reference = deployed `theo_message_stream.js` (+ `chat-tools.js`) copied verbatim under `primary-reference/`. Structural Mirror §4.
- **P6 Boundary re-check:** two surgical edits (one conditional at the `tool_result` build; one registry append); all other loop behavior byte-unchanged.
- **P7 Curl/verify:** integration verify (live chat turn) + regression check, run by Claude Code post-deploy (§5).
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + lint PASS).

## §4 Structural Mirror Table
Primary Reference = deployed `theo_message_stream.js` (the loop being modified) + `chat-tools.js` (the registry). Copied verbatim under `primary-reference/`.

| Region | vs Primary Reference | Classification | Anchor |
|---|---|---|---|
| `tool_result` assembly: OLD `content: JSON.stringify(out)` → NEW conditional — `out.image` present ⇒ `[{type:"image",source:{type:"base64",media_type,data}},{type:"text",…}]`; else `JSON.stringify(out)` (unchanged) | in-place modification of one statement | **ALLOWED DELTA** — extends `tool_result.content` to the Anthropic content-block-array form for image-returning tools; the string path for every other tool is byte-unchanged | API §2.1 ("feeds the `tool_result` back") + §2.8 (image content blocks are the deployed convention) |
| `chat-tools.js` `CHAT_TOOLS`: append one entry `theo_fetch_image` (`downloadable:false`, `input_schema:{url}`) | registry append | **ALLOWED DELTA** — mirrors the deployed `theo_export_spreadsheet` entry shape; `downloadable:false` (no `vault_export`, the image surfaces via the model turn) | primary-ref (`const CHAT_TOOLS`) |
| All other loop logic (dispatch, OBO bearer, `event: tool`/`tool_result`/`vault_export`, `MAX_TOOL_TURNS`, streaming) | unchanged | **EXACT** | primary-ref |

No DEVIATION rows.

## §5 Verification (run by Claude Code post-deploy; both packages live)
The loop is streaming/model-driven, so verification is an integration scenario + a regression check (Golden Handler curl-determinism note: the model's decision to call a tool is not deterministically curl-forced; verified via a scripted chat turn + code-path review):
1. **Image round-trip (happy):** a chat turn containing a public https image URL + "what's in this image?" → the model calls `theo_fetch_image` → the loop delivers the image block → the model describes the image (not "I can't see it"). Assert the stream shows `event: tool {name:"theo_fetch_image"}` then `event: tool_result {ok:true}` and the answer references the image content.
2. **SSRF/deny passthrough:** a turn with `https://169.254.169.254/…` → `theo_fetch_image` returns 400 `URL_NOT_ALLOWED` → `out.error` set → the loop takes the STRING path (`JSON.stringify(out)`) → the model reports it couldn't fetch it. (Confirms the image branch only fires on a real image payload.)
3. **Regression:** a `theo_export_spreadsheet` turn still returns a `JSON.stringify(out)` `tool_result` and still emits `event: vault_export` (non-image tools unchanged).

## §6 Deploy (Pass-3, on APPROVAL) — Kudu VFS to `vaultgpt-func-stream` (Golden Handler §5.5); deploy AFTER/with Package A
1. Resolve the region-stamped SCM host: `az functionapp show -n vaultgpt-func-stream -g Vault-Tax --query enabledHostNames`.
2. **Kudu-GET the LIVE files as the true base** (Golden Handler §5.5 — the deployed file is the source of truth): `/site/wwwroot/src/functions/theo_message_stream.js` (v4 programming model) and `/site/wwwroot/engine/chat-tools.js`. Re-apply the two edits in §4 to the live base (this package's copies are the intent; diff-confirm the only deltas are the `tool_result` conditional + the registry entry).
3. Surgical PUT both files (get current as rollback baseline; `If-Match:*`; `Content-Type: application/octet-stream`; expect 204; GET-back + diff); `az functionapp restart -n vaultgpt-func-stream -g Vault-Tax`.
4. Run §5 verification. On green, Role-C flips API Spec §2.1 (tool_result content-shape amendment) + Golden Handler §6 HF-T9 to DEPLOYED. Never print the token.

## §7 Out of scope
The `theo_fetch_image` handler itself = Package A (`vault-theo-tools`). No FE work (the image surfaces in the model's turn; no card). No `theo_*` schema. `theo_message` on `vaultgpt-func-premium` (non-streaming) is unchanged.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-FetchImage-LoopPassthrough-MS1-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED (and with Package A deployed), Claude Code deploys the two edits to `vaultgpt-func-stream` per §6 + runs §5 verification.
