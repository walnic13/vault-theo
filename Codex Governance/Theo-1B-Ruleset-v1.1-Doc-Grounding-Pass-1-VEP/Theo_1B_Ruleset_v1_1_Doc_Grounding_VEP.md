# Theo Operating Ruleset v1.1 — Document-grounding + anti-capitulation — Verified Evidence Pack

> Theo backend regime. Pass 1 VEP. Author = Claude Code. Reviewer = **Codex**. Authority = Walter (2026-07-08). Fixes two behavior failures seen on a client deliverable: (1) Theo asserted a document's §2.13 content without locating it (inferred from typical docs); (2) when challenged ("are you sure?"), it flipped to agreement instead of re-checking. Adds the "DOCUMENTS THE USER PROVIDES — VERIFY, DON'T INFER" block to the Operating Ruleset (v1.0→v1.1), in the governed doc AND both gateway handlers' `THEO_RULESET` (byte-identical, per the ruleset's own change-control rule).

## Grounding Conformance Receipt
Turn Type: Pass 1 — Verified Evidence Pack (ruleset content; handler THEO_RULESET modification)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Repo / HEAD: vault-theo `development` @ `9ced7d7`

Files:
- `governance/THEO_OPERATING_RULESET.md` — authority doc, v1.1 (edited on `development` this turn).
- Primary References (current-live handlers = the B8k-deployed source): `theo_message.LIVE.index.js`, `theo_message_stream.LIVE.js` (in-package).
- Replacements: `theo_message.index.js`, `theo_message_stream.js` — `THEO_RULESET_VERSION = "vault-theo-rules v1.1"` + the block; `node --check` clean; diff vs LIVE = version line + block only; `THEO_RULESET` **byte-identical to the doc** (verified this turn).

## Rule Anchor Table

| file | section | quote |
| ---- | ------- | ----- |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "The deployed handler is the source of truth" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "Allowed Deltas" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E/DR-T7 | "after a Codex-APPROVED VEP" |
| governance/THEO_OPERATING_RULESET.md | change control | "MUST be byte-identical" |
| governance/THEO_OPERATING_RULESET.md | v1.1 block | "DOCUMENTS THE USER PROVIDES — VERIFY, DON'T INFER" |
| Codex Governance/Theo-1B-Ruleset-v1.1-Doc-Grounding-Pass-1-VEP/theo_message_stream.js | THEO_RULESET v1.1 | "DOCUMENTS THE USER PROVIDES — VERIFY, DON'T INFER" |

## Architecture & boundary reconciliation

No code-path, schema, endpoint, or binding change (P2 confirmed): only the content of the `THEO_RULESET` system-prompt constant + its version, mirrored in the authority doc. The ruleset is still injected as the leading system block every turn (unchanged mechanism). The addition extends the existing GROUNDING discipline (which covered tax authorities) to claims about the user's provided documents, and hardens the existing soft anti-people-please line into a concrete re-verify-on-challenge rule. `THEO_RULESET_VERSION` bumps to `vault-theo-rules v1.1` (per-turn App Insights audit). The ruleset's own change-control rule requires the doc and both handler constants to be byte-identical — **verified byte-identical this turn** for both handlers.

## Gap Disclosure

**PROCEED.** (1) This is a guardrail strengthening, not a guarantee — Theo output remains a reviewed drafting aid (the ruleset itself says "always reviewed before relied on"); the reliable fix for the specific §2.13 miss is B8k (no-cap: the full document text is now injected — deployed). This VEP reduces the *behavioral* recurrence. (2) Deploy: `theo_message` (premium) → **Walter** copy-paste; `theo_message_stream` (func-stream) → **Claude Code** via Kudu (per Walter's chat+stream authorization; DR-T7 ratification is the separate Orchestration Role-C already flagged in B8k). No further gaps.

## Structural Mirror (P5, Golden Handler §5.1)

Primary Reference = the two LIVE (B8k-deployed) handlers. Every region EXACT except:
| Region | Classification | Change |
| ------ | -------------- | ------ |
| `THEO_RULESET_VERSION` (both handlers) | ALLOWED DELTA (§4) | `v1.0` → `v1.1`. |
| `THEO_RULESET` constant (both handlers) | ALLOWED DELTA (§4) | insert the "DOCUMENTS THE USER PROVIDES — VERIFY, DON'T INFER" block after the GROUNDING section; byte-identical to the authority doc. |

`node --check` clean; diff vs LIVE = 7 lines each (version + block), identical between the two handlers.

## Verification plan
- **Deterministic golden curl (Claude, post-deploy):** authenticated trivial `POST` to each endpoint → HTTP 200 (handler loads; ruleset compiles). Deploy-integrity: Kudu GET-back byte-match (stream); restart; 401 probe. `THEO_RULESET_VERSION = "vault-theo-rules v1.1"` observable in App Insights per turn.
- **FE acceptance (Walter):** re-run the deal scenario — attach the agreements, ask Theo whether a specific section (e.g. §2.13) is present; Theo should quote/cite the actual passage or say it can't locate it, and when challenged should re-check + quote rather than flip.

## Deploy (post-APPROVED)
`theo_message_stream` → Claude via Kudu (func-stream region-stamped host). `theo_message` → Walter copy-paste into `vaultgpt-func-premium` (index.js only). Both then Claude-curl-verified. Doc v1.1 lands on `development` with this package.
