# Theo Operating Ruleset v1.2 — Real-time / current-facts grounding — Verified Evidence Pack

> Theo backend regime. Pass 1 VEP. Author = Claude Code. Reviewer = **Codex**. Authority = Walter (2026-07-10). Fixes a behavior failure: asked to "look up the current X" (a live football score), Theo answered a specific, fluent, invented score from unaided recall instead of using its web search tool. The existing GROUNDING section is framed around tax authorities (IRC §, Regs, cases, rates), so a general current-events fact slipped the gate. v1.2 adds the "REAL-TIME & CURRENT FACTS — ALWAYS SEARCH, NEVER RECALL (ALL TOPICS, NOT ONLY TAX)" block to the Operating Ruleset (v1.1→v1.2), generalizing the search-and-verify gate to ALL current / time-varying / externally-verifiable facts — in the governed doc AND both gateway handlers' `THEO_RULESET` (byte-identical, per the ruleset's own change-control rule).

## Grounding Conformance Receipt
Turn Type: Pass 1 — Verified Evidence Pack (ruleset content; handler THEO_RULESET modification)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Repo / HEAD: vault-theo `development` @ `4fcf064e68a9f9707daf821fbdf95072eb763041`

Files:
- `governance/THEO_OPERATING_RULESET.md` — authority doc, edited to v1.2 on `development` this turn. Currency anchor @ HEAD blob `0d82157cfcfa13f16ba6635fdd6b79d817230677` (pre-edit; the v1.2 block + version markers are the working-tree edit landed with this package).
- Primary References (current-LIVE deployed handlers, Kudu-GET this session = Golden Handler §5.5 source of truth; the repo `.LIVE` copies are stale at v1.0): `theo_message.LIVE.index.js`, `theo_message_stream.LIVE.js` (in-package, copied verbatim from the deployed files; both carry `THEO_RULESET_VERSION = "vault-theo-rules v1.1"`).
- Replacements: `theo_message.index.js`, `theo_message_stream.js` — `THEO_RULESET_VERSION = "vault-theo-rules v1.2"` + the REAL-TIME block; `node --check` clean; `diff` vs the LIVE base = version line + inserted block ONLY (5 lines each: a blank line + the 4-line block); original line endings preserved (stream = LF, premium = CRLF); the two `THEO_RULESET` templates **byte-identical to each other AND to the doc** (all 6643 chars modulo line endings; verified this turn).
- Standards grounded @ HEAD: `governance/THEO_GOLDEN_HANDLER_STANDARD.md` blob `865afc9fab567fd2ace06f4c26b9ee0203be38b8`; `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` blob `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d`.

## Rule Anchor Table

| file | section | quote |
| ---- | ------- | ----- |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "The deployed handler is the source of truth" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "Allowed Deltas" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E/DR-T7 | "after a Codex-APPROVED VEP" |
| governance/THEO_OPERATING_RULESET.md | change control | "MUST be byte-identical" |
| governance/THEO_OPERATING_RULESET.md | v1.2 block | "REAL-TIME & CURRENT FACTS — ALWAYS SEARCH, NEVER RECALL" |
| Codex Governance/Theo-1B-Ruleset-v1.2-Realtime-Grounding-Pass-1-VEP/theo_message_stream.js | THEO_RULESET v1.2 | "REAL-TIME & CURRENT FACTS — ALWAYS SEARCH, NEVER RECALL" |

## Architecture & boundary reconciliation

No code-path, schema, endpoint, or binding change (P2 confirmed): only the content of the `THEO_RULESET` system-prompt constant + its version, mirrored in the authority doc. The ruleset is still injected as the leading system block every turn (unchanged mechanism — `effectiveSystem = [THEO_RULESET, memoryBlock, historyBlock, systemPrompt]`), and the web_search / web_fetch grounding tools are already attached to every upstream call (`buildGroundingTools()`; unchanged). The addition **generalizes the existing GROUNDING gate**: the GROUNDING section directs search-and-verify for tax authorities/figures, so a general current-events fact (a live score) fell outside it; the new REAL-TIME block extends the same "look it up THIS TURN, never state a specific from unaided recall" discipline to ALL current / time-varying / externally-verifiable facts (scores/results, prices/markets, breaking news, weather, elections, "today/now/latest" anything). `THEO_RULESET_VERSION` bumps to `vault-theo-rules v1.2` (per-turn App Insights audit). The ruleset's own change-control rule requires the doc and both handler constants to be byte-identical — **verified byte-identical this turn** for both handlers (6643 chars modulo line endings).

## Gap Disclosure

**PROCEED.** (1) This is a guardrail strengthening, not a guarantee — Theo output remains a reviewed drafting aid (the ruleset itself says "always reviewed before it is relied on"), and the block hardens but cannot fully guarantee tool-invocation behavior; it reduces the *behavioral* recurrence of confidently answering current facts from unaided recall. The reliable mechanism (web_search/web_fetch) is already wired and unchanged; this VEP makes its use mandatory in the prompt for the missed class of question. (2) Deploy: `theo_message` (premium) → **Walter** copy-paste; `theo_message_stream` (func-stream) → **Claude Code** via Kudu (per Walter's chat+stream authorization; DR-T7 designates only `vaultgpt-func-chat`, so the func-stream deploy runs under Walter's separate standing authorization for the streaming sidecar, as it did for v1.1). No further gaps.

## Structural Mirror (P5, Golden Handler §5.1)

Primary Reference = the two LIVE (deployed, v1.1) handlers. Every region EXACT except:
| Region | Classification | Change |
| ------ | -------------- | ------ |
| `THEO_RULESET_VERSION` (both handlers) | ALLOWED DELTA (§4) | `v1.1` → `v1.2`. |
| `THEO_RULESET` constant (both handlers) | ALLOWED DELTA (§4) | insert the "REAL-TIME & CURRENT FACTS — ALWAYS SEARCH, NEVER RECALL (ALL TOPICS, NOT ONLY TAX)" block immediately after the GROUNDING section and before the "DOCUMENTS THE USER PROVIDES" section; byte-identical to the authority doc. |

`node --check` clean; `diff` vs LIVE = version line + block only (identical delta between the two handlers); line endings preserved per file.

## Verification plan
- **Deterministic golden curl (Claude, post-deploy):** authenticated trivial `POST` to each endpoint → HTTP 200 (handler loads; ruleset compiles). Deploy-integrity: Kudu GET-back byte-match (stream); restart; 401 unauth probe. `THEO_RULESET_VERSION = "vault-theo-rules v1.2"` observable in App Insights per turn (`context.log("theo ruleset " + THEO_RULESET_VERSION)`).
- **FE acceptance (Walter):** re-run the "look up the current X" test — ask Theo for a live/current fact (e.g. a football score, today's price/headline). Theo should **use web search and cite** the result, or say plainly it can't verify it and offer to look it up — never state a specific invented current fact from unaided recall.

## Deploy (post-APPROVED)
`theo_message_stream` → Claude via Kudu (func-stream region-stamped host: resolve with `az functionapp show -n vaultgpt-func-stream -g Vault-Tax --query enabledHostNames`; PUT `If-Match: *`, GET-back diff, restart, 401 probe). `theo_message` → Walter copy-paste into `vaultgpt-func-premium` (index.js only; `function.json` unchanged). Both then Claude-curl-verified (authenticated `az` bearer; Walter never runs curls). Doc v1.2 lands on `development` with this package.
