# Sigma review agent — `save_attestation` tool (Theo persists its judgment) — Pass-1 VEP

Controlling artifact for Codex review. Self-contained: the edited streaming handler `functions/sigma_review_agent_stream.js` + its deployed baseline `primary-reference/sigma_review_agent_stream.LIVE.js`. Closes the Step-4 **Theo-driven attest** loop: after the agent judges a preparer's explanation of an exception, it PERSISTS the attestation (preparer_response + theo_assessment + resolved) by calling the deployed `sigma_save_attestation` endpoint **OBO as the signed-in preparer** — the §1 boundary (Theo writes Sigma review state only through Sigma's published API, never a cross-table write). Streaming (dock) agent only; the engine stays pure-compute. Reviewer: Codex (backend).

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: cab24b8 (vault-theo development; the commit that first adds this package — artifact-presence probe resolves there and at every later commit)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
```

Current-turn grounding (concrete tool calls this turn): fetched the DEPLOYED `sigma_review_agent_stream.js` from func-stream (`vaultgpt-func-stream-cyb4g8bhatddencs.scm.uksouth-01`) and confirmed it is byte-identical (CRLF-modulo) to the tracked package source — used as the Primary Reference baseline; Read `governance/THEO_OPERATING_RULESET.md` §1 (leading-block rule), `governance/THEO_GOLDEN_HANDLER_STANDARD.md` §5.1, `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` §2, `spec/THEO_API_SPEC.md` §2.1 (the `sigma_review_agent_stream` row); confirmed the deployed Sigma contract `POST /api/sigma_save_attestation` (sigma `d859c4a`, golden-curl-verified 2026-07-15) — cited cross-repo by prose; `node --check` clean on the edited handler; diff vs baseline = exactly the four intended edits.

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
| ----------------- | --------- | -------------------- | -------------------- |
| governance/THEO_OPERATING_RULESET.md | §1 | "injected server-side as the **leading system block** on every turn, ahead of the memory + history-RAG blocks" | the added ruleset line stays inside the server-side `K1_REVIEW_RULESET` (not caller-supplied); it instructs the agent to persist attestations |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.1 | "mapping every handler region to the Primary Reference region with its EXACT / ALLOWED DELTA / DEVIATION classification" | Structural Mirror Table (P5) below |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §2 | "Every substantive turn from Claude Code or Codex MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | this GCR + Rule Anchor Table |
| spec/THEO_API_SPEC.md | §2.1 | "the K-1 review-specialist turn" | the endpoint whose loop this VEP extends with one tool |

## Purpose

Step-4 package 1 deployed the Sigma endpoint `sigma_save_attestation`. But in the Theo-driven attest model Walter chose, **Theo is the caller** — the preparer discusses an exception in the dock, and Theo (after judging) must persist the attestation. Nothing calls the endpoint yet. This VEP gives the streaming review agent a `save_attestation` tool so the loop actually closes: the agent judges → persists via Sigma's API → the 9/10 panel reflects the state (once the FE package renders it).

## Scope

- **In scope:** four minimal edits to the deployed `sigma_review_agent_stream.js` (func-stream): (1) a server-side `K1_REVIEW_RULESET` line instructing the agent to call `save_attestation` when the preparer explains/attests; (2) a `SAVE_ATTESTATION_SCHEMA` (agent-layer Anthropic tool schema); (3) send `tools: [...TOOL_SCHEMAS, SAVE_ATTESTATION_SCHEMA]` to Foundry; (4) a loop branch that, for `save_attestation`, `await`s a new `sigmaSaveAttestation(reviewId, input, token)` helper (HTTP POST to `${SIGMA_API_BASE_URL}/api/sigma_save_attestation`, OBO) instead of the synchronous engine `dispatch`. Deploy: func-stream (Kudu VFS PUT the one file + restart; no new deps, no new app settings — `SIGMA_API_BASE_URL` already set for `sigmaGetReview`).
- **Out of scope (separate packages / deliberate):** the deterministic **engine** (`tool-loop.js` `TOOL_SCHEMAS`/`dispatch`) stays PURE — the side-effecting tool lives in the agent handler where the OBO token + review_id already are, so the engine's compute tools remain synchronous + I/O-free. The **non-streaming** `sigma_review_agent` (func-sigma) does NOT get the tool — it is not the dock path (the dock uses the streaming agent); adding it there would require making the shared `runReviewLoop` async, deferred until that agent is actually used for attest. The Sigma **FE** clickable-exceptions surface (renders attestation state + focuses Theo on a control) is the next package.

## Contract (P4)

- **Consumed (deployed, unchanged):** `POST /api/sigma_save_attestation` `{ review_id, prompt_id, prompt_text?, preparer_response?, theo_assessment?, resolved? }` → `{ data: { attestation } }` (sigma `d859c4a`; owner-scoped, OBO). `sigmaSaveAttestation` sends only the fields the model supplied (COALESCE-preserve server-side) + the handler's own `reviewId`; on non-2xx it returns `{ error }` so the tool_result carries the failure and the loop continues (never crashes the stream).
- **Emitted (unchanged protocol):** the existing `tool` / `tool_result` SSE events already carry `save_attestation` (name + input, then `ok`) — the FE's VA-T7 activity panel renders it with no protocol change. No change to `delta`/`done`/`error`.
- **Boundary (§1):** the call is OBO as the signed-in preparer to Sigma's published API — Theo never writes `sigma_*` tables directly; Sigma never reads `theo_*`. `theo_assessment` is owner-authored (the agent acts as the owner), not a privileged assertion.

## Gap Register (P2.5)

**PROCEED.** (1) The non-streaming `sigma_review_agent` lacks `save_attestation` (out of scope; not the dock path) — disclosed, PROCEED; a later package adds it if that agent is used for attest (needs an async `runReviewLoop`). (2) `save_attestation` failures return `{ error }` in the tool_result (the model can retry / report) rather than aborting the turn — deliberate resilience, PROCEED. (3) No new app setting — `SIGMA_API_BASE_URL` is already present (used by `sigmaGetReview`); verified this endpoint reuses it. PROCEED. No PRE-LAND/ESCALATE.

## Architecture & boundary reconciliation (P2)

The handler already calls Sigma's API OBO (`sigmaGetReview`) and reuses `httpsRequest` + the delegated `token`; `sigmaSaveAttestation` is the same idiom (POST instead of GET). The engine (`require('../engine/tool-loop')`) is untouched: `TOOL_SCHEMAS`/`dispatch` stay pure synchronous compute; the sole side-effecting tool is defined + dispatched in the handler, `await`ed in the loop (which is already an async IIFE). The mandatory server-side `K1_REVIEW_RULESET` (Operating Ruleset §1 leading block) gains one instruction — still server-side, non-bypassable, not caller-supplied. `theo_message_stream` and every other Theo handler are untouched. No new table, no migration, no new credential, no elevated access.

## Handler grounding (P5) — Primary Reference + Structural Mirror Table

**Primary Reference:** the deployed `sigma_review_agent_stream.js` itself (`primary-reference/sigma_review_agent_stream.LIVE.js` — fetched from func-stream this turn, byte-identical to the tracked source). Single, non-composite. All four edits are permitted deltas (the specific tool set / the specific external call, same OBO idiom as the existing `sigmaGetReview`).

| Region | Primary Reference region | Classification |
|---|---|---|
| everything except the four edits below | deployed `sigma_review_agent_stream.js` | EXACT (byte-identical) |
| `K1_REVIEW_RULESET` — one added persist-attestation instruction | the deployed server-side ruleset const | ALLOWED DELTA (additive line inside the same server-side leading block; Operating Ruleset §1) |
| `SAVE_ATTESTATION_SCHEMA` (agent-layer tool schema) | the deployed engine `TOOL_SCHEMAS` idiom (Anthropic tool-schema shape) | ALLOWED DELTA (additive schema, handler-local; engine `TOOL_SCHEMAS` unchanged) |
| Foundry payload `tools: [...TOOL_SCHEMAS, SAVE_ATTESTATION_SCHEMA]` | deployed `tools: TOOL_SCHEMAS` | ALLOWED DELTA (concatenates the one agent-layer tool) |
| `sigmaSaveAttestation` helper (OBO POST to Sigma) | deployed `sigmaGetReview` (OBO GET to Sigma via `httpsRequest`) | ALLOWED DELTA (same OBO idiom; POST + body vs GET + query — a new-external-call variant against the already-consumed Sigma API) |
| tool-loop branch: `await sigmaSaveAttestation` for `save_attestation`, else `dispatch` | deployed synchronous `dispatch` in the loop | ALLOWED DELTA (one `await`ed branch for the side-effecting tool; compute tools unchanged) |

No DEVIATION. Engine unchanged.

## Curl / verification (P7) — run on deploy (Claude Code)

Deterministic golden verification (streaming endpoint; token per Golden Handler §5.5, `api://4e1a1e31…`), against the LG OPP review (`e0afe9cf-…`) + its bound `files`:
1. Baseline (no attestation yet): `GET sigma_list_attestations?reviewId=<LG OPP>` on func-sigma → **200**, empty (or the prior test row cleared).
2. Stream a turn whose message instructs an attest, e.g. `messages:[{role:"user",content:"For INT.no-external-links I broke the links and hard-coded the values — record that."}]` → the SSE carries a `tool {name:"save_attestation", input:{prompt_id:"INT.no-external-links", …}}` event then `tool_result {name:"save_attestation", ok:true}`, and a `done` event.
3. Confirm persistence: `GET sigma_list_attestations?reviewId=<LG OPP>` → **200**; an attestation with `prompt_id:"INT.no-external-links"` + a non-null `theo_assessment` + `preparer_response` is present — proving Theo persisted OBO through Sigma's API.
4. Regression: a compute-only turn ("which exceptions are still open?") still streams `recompute_control`/`scan_*` tool events + a cell-cited answer (the engine path is unchanged); `theo_message_stream` regression (a plain chat) still streams normally.

## VEP assembly (P8)

Package = this INDEX + `functions/sigma_review_agent_stream.js` (edited) + `primary-reference/sigma_review_agent_stream.LIVE.js` (deployed baseline). `node --check` clean; diff vs baseline = the four edits; lint PASS (below). On APPROVED: Claude Code deploys the one file to func-stream (Kudu VFS PUT + restart), runs the verification above, then the Role-C (THEO_API_SPEC §2.1 note that the streaming agent now persists attestations via `save_attestation`). The Sigma-FE clickable-exceptions package follows.

## Mechanical lint

Command: `node tools/lint_microstep_submission.mjs "Codex Governance/Sigma-ReviewAgent-Stream-SaveAttestation-Pass-1-VEP/INDEX.md" --repo-root .`

Expect `PASS` and exit `0`.

## Requested action

Codex Pass-2 review against the Backend Review Standard + Golden Handler Standard. Plan-only; nothing deployed yet. On APPROVED, Claude Code executes the deploy + verification + Role-C per P8.
