# Theo Backend — empty-turn guard: never finalize a silent "(no response)" — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. Fix for the Agustin/Jared feedback "watch it work → **(no response)** and stops." `"(no response)"` is the FE fallback ([theoClient.ts:114]) shown when the assistant turn assembled **empty**. The streaming tool-loop in `functions/theo_message_stream.js` (on `vaultgpt-func-stream`) accumulates `finalText` across turns and finalizes it; if a turn produces no text AND no download/media (e.g. a `theo_export_spreadsheet` `tool_use` **truncated by `max_tokens`** — `stop_reason: "max_tokens"`, so the `if (stopReason !== "tool_use") break` exits with empty text), it finalizes a blank turn → the FE's bare "(no response)". **Single file, five additive edits:** track whether any user-visible output was produced (`emittedExport`/`mediaImage`/`mediaVideo`) + the last `stop_reason`; and at finalize, if the turn produced nothing and no `vault_error` was already emitted, stream a clear **`vault_error`** (the FE throws on it → shows a retryable message) — tailored to a `max_tokens` cut-off (the common cause, e.g. an oversized export). No happy-path change, no new SSE frame type (`vault_error` is already the documented mid-stream-failure contract, API §2.1), no contract/FE/schema/DB change. `node --check` PASS; diff-verified as exactly the five additive edits.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `e0d1bed7382f78860209a1b93a37d66d43e72fc0` (grounding parent; the commit that CONTAINS this package is given in the Codex note). Baseline = the in-repo current-deployed handler snapshot `Theo-1B-MediaPersist-Stream-Pass-1-VEP/functions/theo_message_stream.js` (sha256 `eb4348439d014c77a63dde85cae62fe7315b6cb506a11fdc1b0f197da0d86862`), copied verbatim under `primary-reference/`; Pass-3 GETs the deployed file from Kudu and baseline-matches before PUT (rebase the five edits if it differs).
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | This GCR + Rule Anchor Table + mechanical lint |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary Reference — the deployed `theo_message_stream.js` copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T11 | "DR-T11" | §1 — the bounded agentic tool-loop whose finalize this edit guards |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | tool-dispatch | "tool-dispatch" | §1 — the streaming loop is the tool-dispatch surface; no dispatch/tool change |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "event: vault_error" | §1 — the empty-turn guard reuses the ALREADY-documented mid-stream-failure `vault_error` frame; no new frame/contract |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-EmptyTurnGuard-Stream-Pass-1-VEP/primary-reference/theo_message_stream.LIVE.js | primary-ref | "event: vault_export" | §4 — Structural Mirror: diff-verified only the five additive guard edits; all emissions/loop unchanged |

### Currency anchors (blob SHAs @ grounding parent `e0d1bed`)
- THEO_GROUNDING_CONFORMANCE_STANDARD.md `7c0d902bdff3b6c0af475b483e31ed796214e57b`; CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md `e44cdd85d3d0e5df332dc754cdec731e2e68022e`; CODEX_THEO_BACKEND_REVIEW_STANDARD.md `d2e1b9881b6e2ed7d77921a055feffb0852257fd`; THEO_GOLDEN_HANDLER_STANDARD.md `f8f0e5ea36447502e35fb87b373c94e376f05cbb`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `565559b699c1309f8e750b0dbbac859c13d807c8`; THEO_ARCHITECTURE_AND_STRUCTURE.md `07451ce9d912830b3c15fedf74761d00c59f97b2`; THEO_API_SPEC.md `a667f4174659b0d7b6e7aa54709047249627420a`; THEO_AZURE_POSTGRES_SCHEMA.md `a698d85692b3ccaf052e639f226c76d31c20c0df`.
- Proposed `functions/theo_message_stream.js` sha256 `69bdf25997e594cd090031e564f86031f5b2a57a3d7a83bf8dcb7403bb882083`; baseline `primary-reference/theo_message_stream.LIVE.js` sha256 `eb4348439d014c77a63dde85cae62fe7315b6cb506a11fdc1b0f197da0d86862`.

### Full Baseline doc set (Conformance §4 backend) — grounded this turn
Governor, Conformance (this GCR/Rule-Anchor/lint), Codex Review, Golden Handler (§2 primary-ref), Orchestration (DR-T11 tool-loop), Architecture (tool-dispatch), API Spec (§2.1 — the stream endpoint + the documented `event: vault_error` mid-stream-failure frame), Schema — **N/A (no DB/schema/migration; a defensive stream-finalize guard)**, cited for completeness per Conformance §4.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Problem:** the tool-loop finalize persists/relays `finalText`; when a turn yields no text and no download/media, the FE renders a bare "(no response)". The dominant trigger is a `theo_export_spreadsheet` `tool_use` truncated by `max_tokens` (its `stop_reason` is `"max_tokens"`, not `"tool_use"`, so the loop's `if (stopReason !== "tool_use" …) break` exits with empty text and never dispatches the tool → no card AND no answer).
- **Edit (five additive changes, one file):**
  1. declare `emittedExport`/`emittedError`/`lastStopReason` alongside the existing `mediaImage`/`mediaVideo`;
  2. record `lastStopReason = stopReason` each turn;
  3. set `emittedExport = true` when a `vault_export` frame is written;
  4. set `emittedError = true` at the two existing "The model stream was interrupted." `vault_error` sites;
  5. at finalize, if `!emittedError && finalText.trim() === "" && !emittedExport && !mediaImage && !mediaVideo`, stream a clear `vault_error` — the `max_tokens` case names the likely cause (oversized export cut off; retry/narrow), else a generic "didn't return a response — please try again."
- **Why it's safe / minimal:** `vault_error` is ALREADY the documented mid-stream-failure frame (API §2.1) and the FE already throws on it (`gateway.live.ts` — surfaces a retryable message). The guard fires ONLY on a genuinely empty, error-free turn; every path that produced text, a download card, an image, a video, or an existing error is untouched. No new SSE frame, no dispatch/tool/loop change, no contract/FE/schema/DB/MI/premium change.
- **Boundary:** one file on `vaultgpt-func-stream` (the streaming loop's finalize). Deploy target `vaultgpt-func-stream`. No premium, no `corporate-reporting`/`reporting_*`.
- **Relation to the FE Track-A fix (landed `e0d1bed`):** Track A steers Excel requests to `theo_export_spreadsheet` (so the model actually calls the tool); this backend guard ensures that when a call nonetheless produces nothing (e.g. truncation) the user gets a clear, retryable message instead of a silent "(no response)". Complementary.

## §2 Gap Register
**PROCEED.**
- **(1) Not a retry.** Because each turn's SSE is relayed to the client VERBATIM as it streams, re-running a truncated turn would double-stream to the FE. So the guard SURFACES a clear error rather than silently retrying — the correct, non-duplicating fix. PROCEED.
- **(2) `max_tokens` floor unchanged.** The tool-loop `max_tokens` floor (32768, env `THEO_TOOL_LOOP_MAX_TOKENS`) is untouched; raising it for very large exports is an env-tunable operational knob, not this code change. This VEP makes the failure *legible* rather than silent. PROCEED.
- **(3) Persistence unchanged.** The finalize still calls `persistTurn` as before; an empty turn that now emits `vault_error` may still persist an empty assistant row (pre-existing behaviour → shows "(no response)" only on later reload, not live). Not worsened by this VEP; a persist-skip-when-empty refinement is a separate future item. PROCEED.
- **(4) No contract / Role-C.** `event: vault_error` is already documented (API §2.1); no new frame, field, endpoint, or tool. NO-GAP.
- **(5) No schema/migration/keys/npm/premium/FE.** PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** §1 — guard the tool-loop finalize so an empty turn surfaces a clear `vault_error`, not "(no response)".
- **P2 Architecture/boundary:** one file in the func-stream streaming loop's finalize; reuses the existing `vault_error` frame; no FE/contract change. (§1.)
- **P3 Gap register:** §2 (PROCEED).
- **P4 Contract grounding:** API §2.1 already documents `event: vault_error` (mid-stream failure); no contract change; no Role-C.
- **P5 Primary-reference grounding:** the deployed `theo_message_stream.js` (in-repo current-deployed snapshot, copied verbatim under `primary-reference/`; Pass-3 GET-baseline-matches before PUT). Structural Mirror §4.
- **P6 Boundary re-check:** five additive edits; `node --check` PASS; diff-verified against the baseline snapshot as the only changes (§4/§5).
- **P7 Verification:** `node --check` + diff this turn (§5); post-deploy live re-confirm on func-stream.
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + Structural Mirror + lint PASS).

## §4 Structural Mirror Table
Primary Reference = the current-deployed `theo_message_stream.js` (in-repo snapshot under `primary-reference/theo_message_stream.LIVE.js`, sha256 `eb43484…`).

| Region | vs Primary Reference (baseline) | Classification | Anchor |
|---|---|---|---|
| Entire file except the five additive guard edits | byte-identical | **EXACT** (diff-verified — see §5) | Golden Handler §2 |
| New `let emittedExport/emittedError/lastStopReason` (beside the existing `mediaImage/mediaVideo`) | added declarations | **ALLOWED DELTA** (additive local state) | §1 |
| `lastStopReason = stopReason;` after `finalText += text;` | added line | **ALLOWED DELTA** | §1 |
| `emittedExport = true;` inside the existing `vault_export` write block | added line | **ALLOWED DELTA** | §1 |
| `emittedError = true;` at the two existing "interrupted" `vault_error` sites | added lines | **ALLOWED DELTA** (guards double-emit) | §1 |
| Finalize empty-turn guard (streams a tailored `vault_error` when the turn produced nothing) | added block | **ALLOWED DELTA** (reuses the API §2.1 `vault_error` frame) | §1; API §2.1 |
| The tool-loop, all tool dispatch, every SSE emission (`tool`/`tool_result`/`vault_export`/`vault_image`/`vault_video`/`vault_tokens`/`vault_meta`), persistence, `max_tokens` floor | unchanged | **EXACT** | Architecture tool-dispatch; Orchestration DR-T11 |

No DEVIATION rows.

## §5 Verification (this turn; re-confirm post-deploy)
- `node --check functions/theo_message_stream.js` → **PASS**.
- `diff primary-reference/theo_message_stream.LIVE.js functions/theo_message_stream.js` → exactly the five additive edits above (three var declarations block, `lastStopReason=`, `emittedExport=true`, `emittedError=true` ×2, the finalize guard block). No other lines changed.
- Post-deploy (on func-stream): (a) a normal chat answer streams + persists unchanged (no spurious `vault_error`); (b) an export / image / video / normal reply each still emits its frame and no guard fires; (c) a turn that produces no text and no card (e.g. force a very large export that truncates at `max_tokens`) now streams the tailored `vault_error` ("cut off… try again / narrow") and the FE shows it — instead of a silent "(no response)".

## §6 Deploy (Pass-3, on APPROVAL) — Kudu VFS to `vaultgpt-func-stream` (NOT premium)
1. SCM `vaultgpt-func-stream-cyb4g8bhatddencs.scm.uksouth-01.azurewebsites.net`. GET `/site/wwwroot/src/functions/theo_message_stream.js` as the rollback baseline and **baseline-match** it against `primary-reference/theo_message_stream.LIVE.js` (sha256 `eb43484…`). **If it differs** (a later hotfix), re-apply the five additive edits onto the true deployed baseline, re-`node --check` + re-diff, and note the rebase before PUT.
2. Kudu VFS PUT `functions/theo_message_stream.js` → `/site/wwwroot/src/functions/theo_message_stream.js` (GET the ETag first; PUT with `If-Match:<etag>` per the func-stream 409 gotcha; expect 204; GET-back + diff = the five additive edits only).
3. `az functionapp restart -n vaultgpt-func-stream -g Vault-Tax`.
4. Run §5 post-deploy verification. Never print/log the publishing credential or any token.

## §7 Out of scope
No FE change (the FE already throws on `vault_error`). No new SSE frame, no contract/Role-C, no schema/migration. The `max_tokens` floor and any large-export chunking are separate operational/design items. Skipping persistence of an empty turn (so reload doesn't show "(no response)") is a separate future refinement. No premium.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-EmptyTurnGuard-Stream-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys the file to `vaultgpt-func-stream` per §6 (baseline-match first) + runs §5 post-deploy verification. No Role-C (no contract change).
