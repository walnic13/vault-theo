# Sigma review agent — streaming (`sigma_review_agent_stream` on func-stream) — Pass-1 VEP

Controlling artifact for Codex review. Self-contained: the streaming handler `functions/sigma_review_agent_stream.js` (v4, `enableHttpStream`), the deterministic `engine/` (deployed alongside it), and the single Primary Reference `primary-reference/theo_message_stream.LIVE.js` (the deployed streaming handler this mirrors). `primary-reference/sigma_review_agent.index.js` is included as context only — the prior Codex-APPROVED loop/ruleset this reuses verbatim, cited by prose (NOT a co-Primary Reference). Adds the **real-time streaming** K-1 review agent as a **sibling** handler on Theo's existing streaming app (func-stream) — same v4 / SSE mechanism as `theo_message_stream`, so streaming is consistent across all of Theo, but purpose-built for the agentic tool loop and leaving `theo_message_stream` untouched (safety). Streams thinking + text deltas AND emits a tool event the instant each deterministic tool fires (Claude-Code-style, unbuffered). Reviewer: Codex (backend).

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: 11e405e (vault-theo development; updated to the commit that first adds this package — artifact-presence probe resolves there and at every later commit)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
```

Current-turn grounding (concrete tool calls this turn): fetched + read the DEPLOYED `theo_message_stream.js` from func-stream (`app.setup({enableHttpStream:true})`, `getFoundryToken`, the `stream:true` Foundry POST, the `PassThrough` relay, `parseSseForPersistence`, `persistTurn`); Read `governance/THEO_GOLDEN_HANDLER_STANDARD.md` §5; `governance/THEO_OPERATING_RULESET.md` §1; `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` §2–§3; `governance/THEO_PHASE_1B_BACKEND_PLAN.md`; the sigma engine `tool-loop.js`/`registry.js`/`sheet-tools.js`; the non-streaming Primary Reference `sigma/…/sigma_review_agent/index.js`; the Sigma contract `sigma/spec/SIGMA_API_SPEC.md` §2.6 (`sigma_get_review`); verified the func-stream programming model (v4, `main: src/functions/*.js`, `@azure/functions ^4.5.0`, `FUNCTIONS_EXTENSION_VERSION ~4`) + that func-premium/func-sigma are classic (buffered) — so streaming belongs on func-stream.

## Codex-rejection correction (v2)

v1 was REJECTED at Pass 2 (T10): it declared a **composite** Primary Reference (`theo_message_stream.LIVE.js` + `sigma_review_agent.index.js`) with only rationale, not a quoted Walter authorization. Fix: **single, non-composite Primary Reference** = `theo_message_stream.LIVE.js` (the closest deployed handler of the same kind — a v4 `enableHttpStream` streaming handler on the same app, func-stream; shares the transport/persist/Foundry-stream/SSE). The agent loop + `K1_REVIEW_RULESET` + `reviewStateBlock` + tool dispatch are **reused verbatim from the prior Codex-APPROVED `sigma_review_agent`** (sigma `b1266dd`) — cited by prose as reused, prior-approved code, classified GREENFIELD-to-this-handler in the Structural Mirror. No composite; no Walter authorization required.

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
| ----------------- | --------- | -------------------- | -------------------- |
| governance/THEO_OPERATING_RULESET.md | §1 | "injected server-side as the **leading system block** on every turn, ahead of the memory + history-RAG blocks" | `K1_REVIEW_RULESET` is the server-side, non-bypassable leading block (a client cannot supply/omit it); review-state follows |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.1 | "mapping every handler region to the Primary Reference region with its EXACT / ALLOWED DELTA / DEVIATION classification" | Structural Mirror Table (P5) below |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §2 | "Every substantive turn from Claude Code or Codex MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | this GCR + Rule Anchor Table |

## Purpose

The non-streaming `sigma_review_agent` (deployed on func-sigma, Codex-approved, golden-curl-verified) proves the tool-driven K-1 agent works — but it buffers (~50s, then the whole answer). Walter's requirement: **see the agent think + see each tool call the instant it fires, in real time, exactly like Claude Code** — not buffered. This handler delivers that as a streaming tool loop on **func-stream**, the single streaming app for all of Theo (one consistent streaming experience; no per-agent streaming styles).

## Scope

- **In scope:** the streaming handler `sigma_review_agent_stream` (v4 `app.http`, `enableHttpStream`) + the deterministic `engine/` deployed onto func-stream (`src/engine/`). It runs the agentic loop: each Foundry call `stream:true`; relay `thinking`+`text` deltas live; emit `tool`/`tool_result` events as tools fire; run tools in-process; persist to Theo's conversation at end. Review state via `sigma_get_review`; workbook `ctx` OBO via vault-dms. Deploy: func-stream (Kudu VFS PUT `src/functions/sigma_review_agent_stream.js` + `src/engine/*.js`; add `xlsx` dep + `npm install`; add `SIGMA_API_BASE_URL` + `DMS_API_BASE_URL` app settings — Foundry + Postgres already present).
- **Out of scope (separate packages):** the Theo **FE** `vault_tool` renderer (render the live tool chips) + FE routing of `app_key='sigma'` chats to this endpoint; the Sigma **FE** passing `app_context = { sigma_review_id, files }`; layer-1 memory injection (server-side, later). `theo_message_stream` is untouched.

## Contract (P4) — new streaming endpoint

`POST /api/sigma_review_agent_stream` (SSE). Body: `{ review_id (uuid), messages ([{role:'user'|'assistant', content:string|array}], non-empty), files ({ input:{driveId,itemId}, output:{…}, tables?, dataconn? }), conversation_id? (uuid), user_text? (str) }`. Response: **`text/event-stream`** with the clean event protocol:
- `event: delta` `data: { kind:"text"|"thinking", text }` — model output, streamed live/unbuffered.
- `event: tool` `data: { name, input }` — the instant a deterministic tool fires.
- `event: tool_result` `data: { name, ok }` — after it runs in-process.
- `event: done` `data: { conversation_id, model }` — turn complete (persisted to Theo's conversation).
- `event: error` `data: { message }` — a gateway/stream failure (mid-stream).
Pre-stream errors (before the SSE opens) are JSON: missing identity/token → **401**; bad `review_id`/empty or malformed `messages`/bad `files.{input,output}` → **400**; review foreign → **403**; absent → **404**; workbook set unresolvable → **422**; token failure → **500**. Server-side ruleset (non-bypassable); no system/ruleset/memory from the body.

## Gap Register (P2.5)

**PROCEED.** (1) **func-stream provisioning delta:** needs the `engine/` files + the `xlsx` dep + `SIGMA_API_BASE_URL`/`DMS_API_BASE_URL` app settings (Foundry + Postgres already present) — applied at deploy on APPROVED; future-trigger, PROCEED. (2) **FE coupling:** the live tool chips need a Theo-FE `vault_tool` renderer + `app_key='sigma'` routing — a separate FE VEP; the text/thinking already stream against today's FE reader. Disclosed, PROCEED. (3) **ctx per turn:** the workbook set is OBO-loaded + parsed per request (a resident cache is a later scale optimization) — PROCEED. (4) **Engine on two apps:** the deterministic engine now rides func-sigma (non-streaming agent + run_review) AND func-stream (this streaming agent) — same source deployed to both; acceptable duplication, PROCEED. No PRE-LAND/ESCALATE.

## Architecture & boundary reconciliation (P2)

The handler runs on func-stream (a **vault-theo** app) and **writes only `theo_*`** (the conversation — `theo_conversations`/`theo_messages`, mirroring `theo_message_stream.persistTurn`), so Theo owns the transcript. It reads the review's state via the **published `sigma_get_review` API** (OBO, as the user) — **never a direct `sigma_*` table read**, so the Sigma↔Theo table boundary holds. Workbooks are OBO-read via vault-dms (SharePoint stays the file authority). The deterministic engine (compute-only; reads workbooks, no DB) runs in-process for tool calls. The model call is client-credentials to Foundry (`ai.azure.com/.default`, same as `theo_message_stream`). All arithmetic is done by the engine tools; the model never computes a figure. The ruleset is a server-side constant (non-bypassable — Operating Ruleset §1).

## Handler grounding (P5) — Primary Reference + Structural Mirror Table

**Primary Reference (single, non-composite): the deployed `theo_message_stream.LIVE.js`** — the closest deployed handler of the same kind: a v4 `enableHttpStream` streaming handler on the same app (func-stream). It supplies the transport skeleton: `enableHttpStream`, `getFoundryToken`, the `stream:true` Foundry POST, the `PassThrough` relay, `persistTurn`, the SSE headers, the v4 helpers. The agent's loop + `K1_REVIEW_RULESET` + `reviewStateBlock` + tool `dispatch`/`TOOL_SCHEMAS` + `ctx`-load are **reused verbatim from the prior Codex-APPROVED `sigma_review_agent`** (sigma `b1266dd`) — prior-approved code, cited by prose, classified GREENFIELD-to-this-handler below (not from the Primary Reference). Single, non-composite.

| Region (sigma_review_agent_stream) | Primary Reference region | Classification |
|---|---|---|
| `getPrincipal`/`getClaimValue`/`getOboInputToken` (v4 `headers.get`), `corsHeaders`, `nowIso` | `theo_message_stream` helpers | EXACT |
| `getFoundryToken` (client-credentials, `ai.azure.com/.default`) | `theo_message_stream.getFoundryToken` | EXACT (logic; `https.request` form vs the file's `requestUrl` helper) |
| `openFoundryStream` (`stream:true` POST, `Accept: text/event-stream`) + the `PassThrough` client stream + SSE headers + return `{status,headers,body:stream}` | `theo_message_stream` upstream Promise + relay + return | EXACT (transport) |
| `persistTurn` (INSERT `theo_conversations` if new + user/assistant `theo_messages` + `updated_at`) | `theo_message_stream.persistTurn` | EXACT (byte-faithful pattern; drops attachments/citations not used here) |
| `K1_REVIEW_RULESET` (server-side const), `reviewStateBlock`, `dispatch`/`TOOL_SCHEMAS`, `ctx`-load | — (not in the Primary Reference) | GREENFIELD — reused verbatim from the prior Codex-APPROVED `sigma_review_agent` (sigma `b1266dd`), prose-cited |
| `relayTurn` (parse upstream SSE → forward `delta` events + accumulate blocks/stop_reason) + the agentic `for`-loop + `tool`/`tool_result` events | — | GREENFIELD (streaming tool loop: the one novel region — replaces the Primary Reference's verbatim relay) |
| review state via `sigmaGetReview` (HTTP to the published `sigma_get_review`) | — (not in the Primary Reference) | GREENFIELD (published Sigma API; this app must not read `sigma_*` directly) |
| `theo_message_stream`'s web-search/fetch tools, thinking-budget, history-RAG, attachments | that handler's extras | DEVIATION-REMOVED (the review agent uses only the deterministic engine tools; no web tools, no attachments — justified: tool-grounded review) |

## Golden curls (P7) — run on deploy (Claude Code)

Token per Golden Handler §5.5 (`az account get-access-token --resource api://4e1a1e31-…`). Bound to the verified **LG OPP Q2 2026** review + workbook set (same as the non-streaming agent's curls — `review_id` + `files` bound at deploy):
1. Unauth `POST` → **401**; authed missing `review_id` / `messages:[{}]` / missing `files.input` → **400**; foreign review → **403**; random uuid → **404** (all JSON, pre-stream).
2. Authed, LG OPP `review_id` + bound `files` + `messages:[{role:"user",content:"Which exceptions are still open, and what should I check first?"}]` → **200 `text/event-stream`**; the SSE contains `event: delta` (kind:text) frames **arriving incrementally** (not one buffered blob), **≥1 `event: tool`** frame (e.g. `recompute_control`), and a terminal `event: done` with a `conversation_id`. Verified with `curl -N` (no-buffer) so the incremental arrival is observable.
3. Re-fetch the persisted conversation (`theo_get_conversation`) → the assistant turn is stored under `app_key='sigma'`, `app_context.sigma_review_id = <review_id>`.

## SQL grounding (P6)

No migration. Writes only existing `theo_*` tables via `persistTurn` (INSERT `theo_conversations` if new + two `theo_messages` + `updated_at`), byte-faithful to `theo_message_stream`, under the triple `set_config` session + `created_by` predicates. Reads no `sigma_*` table (review state via `sigma_get_review`).

## VEP assembly (P8)

Package = this INDEX + `functions/sigma_review_agent_stream.js` + `engine/{tool-loop,registry,sheet-tools}.js` + `primary-reference/{theo_message_stream.LIVE.js, sigma_review_agent.index.js}`. Lint PASS (below); all JS `node --check` clean. On APPROVED: Kudu-deploy to func-stream (`src/functions/` + `src/engine/`), add the `xlsx` dep (`npm install` in Kudu) + `SIGMA_API_BASE_URL`/`DMS_API_BASE_URL` app settings, restart, run the golden curls (`curl -N`), then a Role-C adds the route to `THEO_API_SPEC`. The Theo-FE `vault_tool` renderer + Sigma-FE `app_context` VEPs follow.

## Mechanical lint

Command: `node tools/lint_microstep_submission.mjs "Codex Governance/Sigma-ReviewAgent-Stream-Pass-1-VEP/INDEX.md" --repo-root .`

Expect `PASS` and exit `0`.

## Requested action

Codex Pass-2 review against the Backend Review Standard + Golden Handler Standard. Plan-only; no code deployed yet. On APPROVED, Claude Code executes the deploy + provisioning + golden curls + Role-C per P8.
