# Theo Frontend — Sigma review-agent streaming + agent-activity render (VA-T7) — Pass-1 Frontend Verified Evidence Pack

Plan-only VEP. Wires Theo's chat FE to the deployed streaming K-1 review agent: for `app_key === 'sigma'`, route the turn to `sigma_review_agent_stream` (same func-stream `streamBase`, different path) instead of `theo_message_stream`, parse its `delta`/`tool`/`tool_result`/`done` SSE protocol, and render the **VA-T7 agent-activity surface** (live activity panel + persistent tool chips). Theo's general chat path (`sendMessageStream` / `theo_message_stream`) is untouched. Reviewer: Codex (FE).

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: __HEADSHA__ (vault-theo development; updated to the commit that first adds this VEP — artifact-presence probe resolves there and at every later commit)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
```

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend §4A track, hence `N/A`.)

Current-turn grounding: Read `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4B (VA-T1/VA-T5/**VA-T7** registered `7fae8dd`) + `THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` + `CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md`; `spec/THEO_API_SPEC.md` §2.1 (`sigma_review_agent_stream`, deployed); the VA-T7 reference `artifacts/theo-agent-activity-reference.jsx`; the active surface `src/theo/services/gateway.live.ts` (`sendMessageStream`, `StreamHandlers`, the SSE reader) + `src/theo/useTheoState.ts` (the streaming send + `patchLastAssistant`) + the chat renderer `src/theo/components/{ChatView,TheoMain}.tsx`.

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
|-------------------|-----------|----------------------|----------------------|
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §6 | "mapping every component region to the Primary Reference region with its EXACT / ALLOWED DELTA / DEVIATION" | Structural Mirror Table (F-I2) below |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §7 | "reproduced faithfully, no redesign" | `AgentActivity` reproduces the VA-T7 reference (no redesign) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "Every backend-bound call (chat, projects, artifacts, settings, retrieval) routes through one services/contracts module — no scattered inline fetches" | the sigma stream call lives in `gateway.live.ts` (`sendReviewAgentStream`), not inline |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "MUST be registered here before it may be cited." | VA-T7 registered `7fae8dd`, then cited here |
| spec/THEO_API_SPEC.md | §2.1 | "the K-1 review-specialist turn" | contract dependency: `sigma_review_agent_stream` (deployed) |

## F-P1 — Feature identification

Microstep: the streaming K-1 review agent is deployed + verified (`sigma_review_agent_stream` on func-stream); the FE must consume it so a review chat in the dock shows the agent working live. Walter (2026-07-14): the render is VA-T7 — activity panel + persistent chips, Claude-Code-style. In scope: `gateway.live.ts` (a new `sendReviewAgentStream` + extend `StreamHandlers`); `useTheoState` (route to it when `appContext.app_key==='sigma'`; hold `reasoning` + `tools` on the streaming assistant message); a new `AgentActivity` component rendering VA-T7; the chat renderer mounts it on a sigma assistant turn. Deferred: the Sigma-FE passing `app_context = { sigma_review_id, files }` (separate Sigma-FE VEP); layer-1 memory (server-side, later). Theo's general chat is unchanged.

## F-P2 — UI Authority Reconciliation

- **VA-T7** (Theo Agent Activity Rendering) — the activity panel + persistent chips: **VISUAL-AUTHORITY-MATCH**. `AgentActivity` reproduces the registered reference (`artifacts/theo-agent-activity-reference.jsx`) faithfully — the running panel (spinner + streaming reasoning + live tool rows), the collapsed done-summary, and the deduped chips.
- **VA-T1** (Theo Frontend Reference Surface) — the live-chat surface hosting the agent turn: **VISUAL-AUTHORITY-MATCH**; the agent message is a chat turn like any other, with `AgentActivity` above the answer body. The chip idiom follows **VA-T5** (citation chips). No redesign of the chat surface.

No VISUAL-AUTHORITY-DEVIATION claimed. Only §4B-registered VA-ids (VA-T1/T5/T7) are cited.

## F-P2.5 — Gap Disclosure

**PROCEED.** (1) **`app_context` contract:** the FE reads `review_id` + `files` from `appContext.app_context`; those are provided by the **Sigma-FE** VEP (Sigma passes `{ sigma_review_id, files }` when a review is open). Until that lands, the sigma route is inert (no `app_key==='sigma'` context arrives) — the general chat path is unaffected. Coupled, disclosed. PROCEED. (2) **VA-T7** registered this turn (`7fae8dd`) — cited, not pre-cited. PROCEED. (3) **Single service module:** the new call goes in `gateway.live.ts` (Governor §6), not inline. PROCEED. No PRE-LAND/ESCALATE.

## F-P3 — Contract grounding

- **Streaming agent (deployed):** `POST ${streamBase}/api/sigma_review_agent_stream` — same `streamBase` (func-stream) as `theo_message_stream`, different path (THEO_API_SPEC §2.1). Body `{ review_id, messages, files, conversation_id?, user_text? }` (review_id + files from `appContext.app_context`). SSE protocol: `event: delta {kind:'text'|'thinking', text}` → `onText`/`onThinking`; `event: tool {name,input}` → `onTool`; `event: tool_result {name,ok}` → `onToolResult`; `event: done {conversation_id, model}` → `onMeta`; `event: error` → throw. Pre-stream JSON errors surfaced like `sendMessageStream`.
- **Auth:** the same shell/harness `getAccessToken` (shared Vault API token) `authHeaders()` already uses — unchanged. No new endpoint fetched outside `gateway.live.ts`.

## F-P4 — Component reference grounding (Primary Reference)

**PRIMARY REFERENCE: `artifacts/theo-agent-activity-reference.jsx` (VA-T7)** for the new `AgentActivity` component (panel + chips) — reproduced faithfully. The `sendReviewAgentStream` service function mirrors the existing `sendMessageStream` (VA-T1 gateway idiom: `fetch` the stream, read the SSE body incrementally, dispatch per event) — ACTIVE structural reference. Not GREENFIELD (panel = VA-T7 reference; stream client = the sendMessageStream idiom); not composite.

## F-P5 — Component Contract Table

| Component (ownership) | Prop / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
|---|---|---|---|---|
| `AgentActivity` (NEW; renders VA-T7) | `interface AgentActivityProps { running: boolean; reasoning: string; tools: { name: string; input: unknown; status: 'running' \| 'done' \| 'fail' }[]; fund?: string; defaultOpen?: boolean }` | VA-T7 (activity panel + chips); chip idiom VA-T5 | none (presentational) | PROCEED |
| `sendReviewAgentStream` (gateway.live.ts; NEW service fn) | `function sendReviewAgentStream(req: GatewayRequest, handlers: StreamHandlers, opts?: { signal?: AbortSignal }): Promise<void>` | n/a (service module — Governor §6) | `POST ${streamBase}/api/sigma_review_agent_stream`; parses `delta`/`tool`/`tool_result`/`done`; `review_id`+`files` from `req.app_context` | PROCEED |
| `StreamHandlers` (gateway.live.ts; ACTIVE, extend) | `interface StreamHandlers { onText: (delta: string) => void; onThinking?: (delta: string) => void; onCitation?: (c: StreamCitation) => void; onMeta?: (meta: { conversation_id?: string; model?: string }) => void; onTool?: (t: { name: string; input: unknown }) => void; onToolResult?: (t: { name: string; ok: boolean }) => void }` | n/a | — | PROCEED |
| `useTheoState` (ACTIVE, modify) | (existing signature) — when `appContext.app_key === 'sigma'`, call `sendReviewAgentStream` (else `sendMessageStream`); hold `reasoning` + `tools[]` on the streaming assistant message via `patchLastAssistant` | VA-T1 (state) | the gateway (`sendReviewAgentStream`) | PROCEED |
| chat message renderer (`ChatView`/`TheoMain`; ACTIVE, modify) | renders `<AgentActivity running reasoning tools fund />` above the answer body when the assistant turn carries agent-activity fields | VA-T1 (chat surface) + VA-T7 | — | PROCEED |

Supporting types: `GatewayRequest` (existing; already carries `app_key`/`app_context`); the assistant message model gains optional `reasoning?: string` + `tools?: {name,input,status}[]`.

## Component Structural Mirror Table (F-I2)

| Region (Theo FE) | Primary Reference | Classification |
|---|---|---|
| `AgentActivity` — running panel (spinner · streaming reasoning + cursor · live tool rows w/ status dots) + done summary (collapse) + persistent deduped chips | VA-T7 reference `theo-agent-activity-reference.jsx` | EXACT (reproduced faithfully) |
| `sendReviewAgentStream` (fetch stream + incremental SSE reader + per-event dispatch) | `sendMessageStream` (VA-T1 gateway idiom) | ALLOWED DELTA (different path `sigma_review_agent_stream`; parses `delta`/`tool`/`tool_result`/`done` not `content_block_delta`/`vault_meta`) |
| `StreamHandlers` + `onTool`/`onToolResult` | existing `StreamHandlers` | ALLOWED DELTA (additive optional handlers) |
| `useTheoState` route + hold `reasoning`/`tools` | existing streaming send + `patchLastAssistant` | ALLOWED DELTA (an `app_key==='sigma'` branch; the general path unchanged) |
| chip idiom | VA-T5 citation chips | ALLOWED DELTA (tool chips reuse the chip idiom) |

## F-P6 — Repository & active-surface grounding

Target files (Read this turn): `src/theo/services/gateway.live.ts`, `src/theo/useTheoState.ts`, `src/theo/components/{ChatView,TheoMain}.tsx`; Primary Reference `artifacts/theo-agent-activity-reference.jsx`. Add: `src/theo/components/AgentActivity.tsx`. Guardrails: the sigma call routes through `gateway.live.ts` (single service module, Governor §6); zero-dependency inline-style for `AgentActivity` (VA-T1/VA-T5/VA-T7 idiom); no browser storage; `theo_message_stream` + `sendMessageStream` untouched (general chat unaffected); no `corporate-reporting`/`sigma` code change (the Sigma-FE `app_context` is a separate package).

## F-P7 — Plan body (Pass-3, on APPROVAL)

1. **`gateway.live.ts`**: add `sendReviewAgentStream(req, handlers, opts)` — `fetch(`${streamBase}/api/sigma_review_agent_stream`)` with body `{ review_id: req.app_context?.sigma_review_id, files: req.app_context?.files, messages: req.messages, conversation_id?, user_text? }`; reuse the incremental SSE reader; dispatch `delta`(text/thinking)→`onText`/`onThinking`, `tool`→`onTool`, `tool_result`→`onToolResult`, `done`→`onMeta`, `error`→throw. Extend `StreamHandlers` with `onTool?`/`onToolResult?`.
2. **`AgentActivity.tsx`**: reproduce the VA-T7 reference (running panel + done summary + chips), zero-dep inline-style.
3. **`useTheoState`**: when `appContext.app_key==='sigma'`, call `sendReviewAgentStream`; add `onTool`/`onToolResult` that push/patch `tools[]` and hold streamed `reasoning` on the assistant message (via `patchLastAssistant`).
4. **Chat renderer** (`ChatView`/`TheoMain`): render `<AgentActivity>` above the answer body when the assistant turn carries `reasoning`/`tools`.
5. **Verify**: `tsc` clean; `vite build` green; a harness/dev render of `AgentActivity` (running + done states) matches the VA-T7 reference; the general chat path unchanged.
6. **Pass-3 evidence** → SWA test plan; once the Sigma-FE `app_context` VEP also lands, Walter opens a review in `vault-sigma-dev` and watches the agent work live in the dock.

## Mechanical lint

Command: `node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Frontend-Sigma-Agent-Activity-Pass-1-VEP/INDEX.md" --repo-root .`

Expect `PASS` and exit `0`.

## Requested action

Codex Pass-2 review against Frontend Conformance §6 + the Golden Component Pack. Plan-only; no code changed. On APPROVED, Claude Code executes Pass-3 per F-P7 on `development`. The Sigma-FE `app_context` VEP (Sigma passes `{ sigma_review_id, files }`) is the paired package that lights it up end-to-end.
