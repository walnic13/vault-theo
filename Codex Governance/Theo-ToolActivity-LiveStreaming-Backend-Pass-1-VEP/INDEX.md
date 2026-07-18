# Theo Backend — Tool-Loop live activity: block-start `event: tool` + live `event: vault_tokens` — Pass 1 VEP

Refinement to the DEPLOYED `theo_message_stream` (`vaultgpt-func-stream`) tool-loop activity. Today the general-chat loop surfaces a tool only **after** its whole `tool_use` payload has streamed (the dispatch loop emits `event: tool` `{name, input}` just before `dispatchChatTool`), and the FE's only token signal is the native `message_delta.usage` — emitted **once at each turn's end**. Result (Walter, dev SWA): a spreadsheet-export turn shows a spinner + rotating placeholder verbs for the ~1.5 min the model spends emitting the `tool_use` JSON, then a sudden dump — no live "what it's doing" and no climbing token count, unlike Claude Code. Timing probe this turn proved the stream **is** flushing live (frames arrive 2.5s→25s, not buffered); the gap is that the ~1.5-min build is invisible `input_json_delta` with nothing surfaced. This change surfaces it:

1. Emit **`event: tool` `{ name }`** the instant the `tool_use` **block opens** (`content_block_start`), not after its input finishes — so the FE flips to the tool-aware verb ("Building your spreadsheet…") at the START of the build. No `input` is sent (still streaming; rendering it produced the "weird code-looking" row Walter saw) — the FE shows a clean tool row + verb. The late dispatch-loop emit is removed.
2. Emit **`event: vault_tokens` `{ tokens }`** — a running **cumulative** output-token count, throttled (~every 100 tokens of streamed content), so the header climbs **live** during the otherwise-silent build. It is a char/4 estimate between turns that **snaps to the authoritative `usage.output_tokens`** at each `message_delta`; `tok.realBefore` carries the exact prior-turn total so the number is monotonic and accurate across the loop.

Dispatch, tool_result, `vault_export`, persistence, and the verbatim native relay are unchanged. Self-contained: handler under `functions/`, deployed baseline under `primary-reference/`.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `54fab31e725f3b8876b3656c7dcb1faff2aa0eae`.
Currency-anchor form: git blob SHA at HEAD.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary reference (deployed handler) copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — the change adds one SSE frame type and re-times another; request/response/dispatch contract otherwise unchanged |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "and `vaultgpt-func-stream` (v4 programming model" | §6 Deploy — Kudu VFS to func-stream |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "Each dispatched general-chat tool also streams" | §6 API-Spec Role-C — the clause re-timed (block-start, `{name}` only) + extended (`event: vault_tokens`) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-ToolActivity-LiveStreaming-Backend-Pass-1-VEP/functions/theo_message_stream.js | delta | "Surface the tool the instant its block opens" | The two changed regions (relayTurnRaw + the dispatch loop) |

### Currency anchors (blob SHAs @ HEAD `54fab31`)
- THEO_GOLDEN_HANDLER_STANDARD.md `49aa225aa6145adced121846de990725da5fe0f0`; THEO_API_SPEC.md `44a7d209f1097b54825bca2730ddf6d911bf9a6f`; artifacts/theo-agent-activity-reference.jsx (VA-T7) `e31215a3067e8c96d0287ffcaaf24554027c482a`.
- Deployed handler = the source of truth (the ToolLoop-ToolActivity state, Codex-APPROVED + deployed 2026-07-17). Copied verbatim in `primary-reference/`; Pass-3 Kudu-GETs the live file to confirm the rollback baseline before PUT.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Change (two regions):**
  - `relayTurnRaw` (~L641): (a) on `content_block_start` for a chat-tool `tool_use` block, emit `event: tool` `{name}` immediately; (b) accumulate a char estimate across `text_delta` + `input_json_delta` + `thinking_delta`, emit throttled `event: vault_tokens` `{tokens: realBefore + est}`, and on `message_delta` snap to `{tokens: realBefore + usage.output_tokens}`; return `turnOutputTokens`. New param `tok` (cumulative prior-turn tokens).
  - Dispatch loop (~L1035): add `const tok = { realBefore: 0 }`, pass it into `relayTurnRaw`, accumulate `tok.realBefore += turnOutputTokens` per turn, and **remove** the old `event: tool` `{name, input}` emit (now emitted earlier, at block-start, without `input`).
- **Why:** the FE `AgentActivity` (VA-T7) renders a tool-aware verb + a live climbing token count. Surfacing the tool at block-start makes the verb appear at the START of the ~1.5-min build (not the end); the live `vault_tokens` gives continuous visible progress during that build (the payload itself streams as invisible `input_json_delta`). This is the Claude-Code "watch it work" behaviour Walter asked for.
- **Boundary unchanged:** dispatch (as the signed-in user), the `tool_result` fed back to the model, persistence, `vault_export`, `vault_meta`, and the verbatim native relay are byte-identical. No new external call, no schema, no auth change. `event: tool` now carries LESS (only `name`, no `input`) — strictly less egress. `event: vault_tokens` carries only an integer count derived from the model's own output (no new data leaves the tenant).

## §2 Gap Register
**PROCEED.** (1) **Deploy-before-FE is safe.** The current deployed FE parses only the native frames + `vault_meta`/`vault_error`/`vault_export` + the existing `event: tool`/`event: tool_result`; an unknown `event: vault_tokens` frame is ignored, and `event: tool` without `input` still parses (`input` becomes `undefined`, which the current FE tolerates). So behaviour is unchanged until the paired FE lands. (2) **Normal (no-tool) chat now also carries additive `event: vault_tokens` frames** — harmless: the current FE ignores them, and the paired FE renders the token count only inside the activity panel (which normal chat does not show). Native text + `vault_meta` are otherwise byte-identical. (3) The token count is an **estimate** between turn boundaries (char/4) that snaps to the exact `usage.output_tokens` at each `message_delta` — matching how Claude Code surfaces a live count; the DONE total is authoritative. (4) `node --check` PASS; the diff is the two regions + comments only (63 changed lines vs the deployed baseline).

## §3 Sub-phase walk (P1–P8)
- P1 change (§1). P2 boundary unchanged (§1). P3 Gap (§2, PROCEED). P4 API §2.1 contract — the general-chat `event: tool` clause is re-timed + extended with `event: vault_tokens`; §6 carries the Role-C. P5 primary reference = deployed `theo_message_stream` (copied verbatim; diff = two regions). P6 no new external call/auth/helper. P7 golden curls (§5). P8 this pack + lint PASS.

## §4 Structural Mirror Table
Primary Reference = the deployed `theo_message_stream` (ToolLoop-ToolActivity state). Pattern precedent = the deployed `sigma_review_agent_stream` (streams `event: tool` at the instant each tool fires; a live activity view).

| Region | vs deployed | Classification | Anchor |
|---|---|---|---|
| Entire handler EXCEPT `relayTurnRaw` + the dispatch loop | byte-identical | **EXACT** | primary-ref |
| `relayTurnRaw`: block-start `event: tool {name}`, char estimate + throttled/​snapped `event: vault_tokens`, `tok` param, `turnOutputTokens` return | additive SSE emits + parse accounting; verbatim relay + reconstruct unchanged | **ALLOWED DELTA** — additive frames + one moved emit; response/dispatch/persistence unchanged | Golden Handler §4 + API §2.1 + delta anchor |
| dispatch loop: `tok` accumulator threaded in; old `event: tool {name,input}` emit removed | the emit moved earlier (to block-start) + cumulative-token bookkeeping | **ALLOWED DELTA** — re-timing of an existing frame; dispatch/tool_result/vault_export unchanged | API §2.1 + delta anchor |

No DEVIATION rows.

## §5 Golden Curls (run by Claude Code against `vaultgpt-func-stream` at Pass-3; never print the token)
Auth: `az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e` as `wmansfield@vault-tax.com`. Base `.../api/theo_message_stream`. A timing-aware reader (per this turn's `streamprobe.py`) asserts arrival order + monotonic tokens.
1. **Tool turn — early tool + live climbing tokens:** POST a prompt that induces the export tool (e.g. "Use the spreadsheet export tool to build a 3-sheet K-1 workbook…") → `200` stream. Assert: an **`event: tool`** frame (`data.name == "theo_export_spreadsheet"`, **no `data.input`**) arrives EARLY (at block-start, before the `input_json_delta` run completes); a sequence of **`event: vault_tokens`** frames arrives DURING the build with **monotonically non-decreasing** `data.tokens`, snapping to a final value at `message_delta`; then **`event: tool_result`** (`data.ok == true`) → `vault_export` → `vault_meta`. (Pre-change: `event: tool` appeared only at the END, carried `input`, and no `vault_tokens` streamed.)
2. **Normal chat regression:** a plain question streams native text + additive **`event: vault_tokens`** (climbing) + `vault_meta`, and **no** `event: tool`/`tool_result`/`vault_export`. Native text + `vault_meta` unchanged.

## §6 Deploy (Pass-3, on APPROVAL) + API-Spec Role-C — Claude Code to `vaultgpt-func-stream` (DR-T11; Golden Handler §5.5)
1. Resolve SCM host; Kudu-GET the live `src/functions/theo_message_stream.js` (rollback baseline; confirm it matches `primary-reference/`).
2. Kudu VFS PUT the updated file → `/site/wwwroot/src/functions/theo_message_stream.js` (If-Match:*, GET-back diff); restart; unauth health (401).
3. Run §5 golden curls (timing-aware).
4. **API-Spec §2.1 Role-C (applied after golden-verify, BEFORE the paired FE VEP cites it — T22 sequence).** Amend the general-chat events sentence in the `theo_message_stream` row from:
   > Each dispatched general-chat tool also streams `event: tool` / `data: { name, input }` (the instant it fires, before dispatch) and `event: tool_result` / `data: { name, ok }` (after) …

   to:
   > Each dispatched general-chat tool also streams `event: tool` / `data: { name }` (the instant its `tool_use` block **opens** — before the input finishes streaming, so the FE can show the tool-aware activity verb during the build) and `event: tool_result` / `data: { name, ok }` (after) … The handler additionally streams `event: vault_tokens` / `data: { tokens }` throughout — a running **cumulative** output-token count (a char/4 estimate between turns that snaps to the authoritative `usage.output_tokens` at each `message_delta`) for the VA-T7 live token counter; emitted on all turns (ignored by the FE outside the activity panel).

   (Exact before/after is a Role-C doc edit, not a behaviour change; it documents what this deploy makes true.)

## §7 Out of scope
The **FE** that consumes these (swap `onUsage`→`onTokens` on `event: vault_tokens`; the processing/streaming two-mode toggle that shows the climbing count during silent build and hides it while text streams; `AgentActivity` gating the token span on `!(running && streaming)`) is the paired FE VEP — authored/submitted AFTER this deploys and §2.1 documents `vault_tokens` at HEAD (T22). FE code is already written + `tsc`/`vite build` green, held for that VEP.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-ToolActivity-LiveStreaming-Backend-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS. `node --check` PASS on the handler.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys to `vaultgpt-func-stream`, runs §5 golden curls, then applies the §6 API-Spec §2.1 Role-C.
