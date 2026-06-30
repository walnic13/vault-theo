# Theo 1B — B9-FE Streaming (live tokens + status words + Thinking panel) — Pass 1 VEP

> Pipeline: Vault Theo **frontend** regime. Author = Claude Code (Pass 1 Plan). Reviewer = **Codex** (Pass 2). This is the **plan** (Component Contract Table + UI-authority reconciliation + gap disclosure); the code is the Pass-3 Implementation Package. **Microstep:** Tier **B9-FE** — the visible payoff of streaming. Repoint Theo's chat call from the buffered `theo_message` to the deployed, golden-verified `theo_message_stream` (sidecar), render the answer **token-by-token as it arrives**, show a rotating **"silly processing terms"** status word during the pre-first-token gap (~3.4s) and while the model is only thinking, and surface a collapsible **Thinking** panel fed by `thinking_delta` (Foundry passthrough verified). Reuses the existing assistant-bubble rendering + VA-T1 tokens; the status word + thinking panel are **additive** affordances (VISUAL-AUTHORITY-DEVIATION, §WALTER-AUTH). Implementation **drafted + `tsc`+`eslint`+`build`-clean** in `proposed-src/`. Five files; no new prop on `ChatView` (the streaming state lives in `useTheoState` + the existing `messages`/`loading` props).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Turn issued against HEAD: `a42a75ef522a43a28ba78a2599ff4a3c2afc7f43` (vault-theo, `development`)
Detail: Pass 1 frontend VEP; §4A.1 sub-phases F-P1, F-P2, F-P2.5, F-P4, F-P5, F-P7 walked. Primary Reference component (Golden Component Pack §2) = the **ACTIVE** `src/theo/components/ChatView.tsx` (blob `fa429fff`) — the chat view the streaming render extends. New presentational sub-components `StatusLine` / `ThinkingPanel` are GREENFIELD, governed by VA-T1's token system + §WALTER-AUTH. The live-streaming affordances (status word during the gap; the Thinking disclosure) are **additive beyond the captured VA-T1 surface** → classified **VISUAL-AUTHORITY-DEVIATION**, authorized verbatim by Walter (§WALTER-AUTH). Contract dependency = the deployed + golden-verified `theo_message_stream` (B9 backend, `a42a75e`) through the single `theoClient` → `gateway.live` boundary. Implementation drafted + validated this turn (`npm run typecheck` + `eslint` on the 5 files + `npm run build` → clean) in `proposed-src/`. No browser storage (1A handover §2.5).

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 VEP/CCT; §4 UI reconciliation; §5 gap) | `Grep("Component Contract Table")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A spine; §5 gap) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited; unchanged blob @ HEAD | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 primary ref; §3 CCT; §8 greenfield) | `Grep("existing component file as the structural mirror target")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§0.1 no-redesign; §2.3 service boundary; §2.5 no storage) | `Grep("Do not redesign it")` this turn | `aad6396703b5a2b6d204986e5064504cec939895` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 streaming sidecar; "streaming-style load") | `Grep("streaming")` this turn | `54f22fe12b5bc0c6e3c089be2474ff0226d1497c` |
| 7 | **Contract dependency** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 gateway contract) | cited; contract basis @ HEAD | `1f166aad5f56635fb850f0e2376bda9f2adc8bc2` |
| 8 | **VA-T1** Theo Frontend Reference Surface — `frontend/theo-frontend-reference.jsx` (chat bubble + tokens) | `Grep("vo-send")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 9 | **Primary Reference component (ACTIVE)** — `src/theo/components/ChatView.tsx` | `Read(full)` this turn | `fa429fff1206426a579e043277ee22da9bf09812` |
| 10 | ACTIVE state under change — `src/theo/useTheoState.ts` (`send`) | `Read(send region)` this turn | `c1d8b39fadb057491e14cd6afb403dec4e1b9c76` |
| 11 | ACTIVE service under change — `src/theo/services/gateway.live.ts` (sendMessage sibling) | `Read(full)` this turn | `750260295634f92beae6a2c89361d06ee781822e` |

No ChatGPT advisory cited. No `reporting_*` / `corporate-reporting` change. No backend change (the B9 backend `theo_message_stream` is deployed + golden-verified). No browser storage introduced (1A handover §2.5).

## §WALTER-AUTH — verbatim directive authorizing the streaming UX (additive beyond VA-T1)
Walter, current feature directive (the authority for the live-token render + status words + thinking display):
> "the streaming is now urgent … i'd like to replicate exactly how claude code manages streaming, using silly processing terms while it's gathering information, etc. and then showing its thinking during the process."
This authorizes the additive streaming affordances (the rotating status word during the pre-first-token gap and the collapsible Thinking panel), reproduced in VA-T1's existing token system; the existing chat bubble + composer are unchanged.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "Component Contract Table" | §F-P5 — CCT for the in-scope components |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "existing component file as the structural mirror target" | §F-P4 — Primary Reference = ACTIVE ChatView.tsx |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §0.1 | "Do not redesign it." | §F-P2 — existing bubble/composer unchanged; additions classified VISUAL-AUTHORITY-DEVIATION |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §7 | "streaming (a deliberate sidecar — see the streaming assessment)" | §F-P1 — the B9 streaming microstep |
| frontend/theo-frontend-reference.jsx | chat | "vo-send" | §F-P2 — additions reuse VA-T1 tokens |

---

## §F-P1 — Feature identification
Tier **B9-FE** (the FE half of the Plan's "deliberate sidecar" streaming follow-on). Today `useTheoState.send` awaits the full `theo_message` reply (seconds of dead air), then renders it at once. B9-FE makes Theo stream:
- **Repoint** the chat call → `theoClient.sendMessageStream` → `POST /api/theo_message_stream` (the deployed sidecar).
- **Live render** — an empty assistant turn is appended immediately; text deltas append into it as they arrive (the existing `renderAssistant` bubble grows live).
- **Status words** — a rotating "silly processing term" (`Percolating…`, `Reconciling…`, `Consulting the ledger…`) shows until the first token lands and while the model is only thinking — masking the ~3.4s pre-first-token latency (the adoption risk Walter flagged).
- **Thinking panel** — a collapsible disclosure fed by `thinking_delta` (Foundry passthrough verified this session); dormant until `THEO_THINKING_BUDGET_TOKENS` is set on the sidecar, then it lights up with no FE change.
All chat interaction is **true-in-1B** against the deployed sidecar; the standalone dev harness degrades gracefully (non-streaming mock, whole reply at once).

## §F-P2 — UI Authority Reconciliation
- **VA-T1 — preserved, not redesigned.** The chat bubble, the assistant `Burst` avatar, the composer, and the disclaimer are **unchanged** (1A handover §0.1). The streamed answer renders through the **existing** `renderAssistant(m.content)` path — same bubble, just populated incrementally.
- **Additive affordances (VISUAL-AUTHORITY-DEVIATION, §WALTER-AUTH).** Two additions, both in VA-T1's token system (`C.ink3`/`C.bubble`/`C.line2`/`SANS`/`vo-bounce`): **(1)** `StatusLine` — the rotating status word + the existing bouncing-dots motion, shown in the assistant slot before the first token; **(2)** `ThinkingPanel` — a collapsible "Thinking…/Thought process" disclosure (same inline-`pre` idiom as the B8e attachment preview). Neither alters an existing rendered element; both are additive and Walter-authorized. No conversion of the inline-style system (1A handover §0.1).

## §F-P2.5 — Gap Disclosure
Vocabulary `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Backend dependency.** `theo_message_stream` must be live on the sidecar. It **is** — deployed + golden-verified this session (incremental SSE through Easy-Auth, persistence parity). | **PROCEED** — satisfied. |
| G-2 | **Repoint of the chat call.** `send` now calls `sendMessageStream` instead of `sendMessage`. The non-streaming `theoClient.sendMessage` / `gateway.sendMessage` remain in the code (unused by chat) as a still-working fallback path; not removed. | **PROCEED** — additive method; old path retained. |
| G-3 | **Thinking is dormant until enabled.** With `THEO_THINKING_BUDGET_TOKENS` unset on the sidecar, no `thinking_delta` arrives, so `m.thinking` stays undefined and the panel never renders. Setting the env (Foundry passthrough verified) lights it up with **no FE change**. | **PROCEED (future-trigger)** — flip the sidecar env when wanted. |
| G-4 | **Standalone dev harness** (no live backend) → `sendMessageStream` falls back to the non-streaming mock and emits the whole reply once (no live tokens, no status word beyond the first frame). | **PROCEED** — degraded-but-safe; the live SWA mount streams. |
| G-5 | **Partial-markdown flicker.** `renderAssistant` runs on incomplete markdown mid-stream (e.g., a half-written list); resolves when the next delta lands and on finalize (`ingestReply`). Cosmetic. | **PROCEED** — accepted; matches how streaming chat UIs behave. |
| G-6 | **Citations at end, not live.** `citations_delta` is accumulated and attached as a single `CitedRun` on stream completion (same shape `selectRecent` uses for reloaded threads), not span-mapped live. | **PROCEED** — consistent with the reload path; web-grounded answers still show their sources. |

Per-surface status (1A handover §3): streaming is **true-in-1B** against the deployed sidecar; the harness degrades to non-streaming (safe).

## §F-P4 — Component reference grounding
Primary Reference (Golden Component Pack §2) = the **ACTIVE** `src/theo/components/ChatView.tsx` (blob `fa429fff`) — the chat view extended. `StatusLine` / `ThinkingPanel` are **GREENFIELD** (§8), governed by VA-T1 (token system) + §WALTER-AUTH. The streaming data path routes through the single `theoClient` → `gateway.live` boundary (1A handover §2.3): the new `sendMessageStream` is the **streaming sibling** of the existing `sendMessage` (same request shape; the reply arrives via SSE-delta callbacks). No new service module; no surface bypass.

## §F-P5 — Component Contract Table
Prop interfaces are the literal TypeScript (required-before-optional; **no `any`**), as implemented + `tsc`-validated in `proposed-src/`.

### CCT-1 — `ChatView` (ACTIVE; extended — props UNCHANGED)
- **Ownership:** Theo surface, ACTIVE. **VA-id:** VA-T1 (chat bubble; the streaming additions classified VISUAL-AUTHORITY-DEVIATION per §F-P2). **Change in B9-FE:** internal render only — renders `StatusLine` (when the last assistant turn is still empty and `loading`) and `ThinkingPanel` (when `m.thinking` is set); the streamed answer uses the existing `renderAssistant`. **No prop added** — streaming state lives in `useTheoState` + the existing `messages`/`loading`.
- **Prop interface (literal, unchanged):**
```ts
export interface ChatViewProps {
  messages: Message[];
  loading: boolean;
  error: string;
  draft: string;
  attachments: ComposerAttachment[];
  attachmentsAvailable: boolean;
  onDraftChange: (s: string) => void;
  onSend: (text?: string) => void;
  onAddFiles: (files: FileList | File[]) => void;
  onAddPastedText: (text: string) => boolean;
  onRemoveAttachment: (localId: string) => void;
  chatProject: Project | null;
  assistantName: string;
  greeting: string;
  starters: string[];
  renderAssistant: (content: string) => ReactNode;
}
```
- **Contract dependency:** consumes `Message` (now with optional `thinking?: string`); the streaming assistant turn is the last message, patched live by `useTheoState.send`.

### CCT-2 — `StatusLine` (NEW; sub-component of ChatView)
- **Ownership:** Theo surface, NEW. **Primary Reference:** GREENFIELD (Golden Component Pack §8). **VA-id:** **VA-T1** (reuses `C.ink3`/`SANS`/`vo-bounce`) — additive affordance, **VISUAL-AUTHORITY-DEVIATION** authorized §WALTER-AUTH.
- **Prop interface (literal):**
```ts
function StatusLine(): JSX.Element
```
- **Contract dependency:** none (presentational); self-contained interval rotates `STATUS_WORDS` every 1.9s while mounted (it mounts only while the streaming turn is pre-first-token).

### CCT-3 — `ThinkingPanel` (NEW; sub-component of ChatView)
- **Ownership:** Theo surface, NEW. **Primary Reference:** GREENFIELD (Golden Component Pack §8). **VA-id:** **VA-T1** (same inline-`pre` disclosure idiom as the B8e attachment preview) — additive affordance, **VISUAL-AUTHORITY-DEVIATION** authorized §WALTER-AUTH.
- **Prop interface (literal):**
```ts
function ThinkingPanel(props: { text: string; live: boolean }): JSX.Element
```
- **Contract dependency:** none; reads `Message.thinking`. `live` (loading && last && no content yet) toggles the "Thinking…" vs "Thought process" label. Collapsed by default.

### Contract/state surfaces changed (non-visual; service boundary + state + types)
| File | Change | Contract |
| --- | --- | --- |
| `src/theo/types.ts` | `Message` += `thinking?: string` | shape only |
| `src/theo/services/gateway.live.ts` | +`sendMessageStream(req, handlers)` + `StreamHandlers`/`StreamCitation` — fetches `theo_message_stream`, reads `response.body` reader, dispatches SSE deltas (text/thinking/citation) + `vault_meta`/`vault_error`; dev-harness fallback → mock once | `POST /api/theo_message_stream` (SSE) — the B9 backend contract |
| `src/theo/services/theoClient.ts` | +`sendMessageStream` passthrough | single service boundary (1A handover §2.3) |
| `src/theo/useTheoState.ts` | `send` reworked: append empty assistant placeholder → `sendMessageStream` with callbacks accumulating text/thinking/citations + `patchLastAssistant` live → finalize (ingestReply + citation run) on stream end; restore on error (`slice(0,-2)`) | in-memory only (no browser storage) |
| `src/theo/components/ChatView.tsx` | +`StatusLine` + `ThinkingPanel`; assistant render shows thinking panel + live text + status word; the fallback dots block guarded to non-assistant-last | presentational |

## §F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) + §WALTER-AUTH open the pack; F-P1/F-P2/F-P2.5/F-P4/F-P5/F-P7 walked; UI-authority reconciliation done (VA-T1 preserved; additions classified VISUAL-AUTHORITY-DEVIATION, Walter-authorized); Gap Disclosure present (G-1 satisfied; G-2..G-6 PROCEED); Component Contract Table with literal prop interfaces (CCT-1..3) + the contract/state surfaces. **Implementation drafted + validated** — see §IMPL. On Codex APPROVAL → Pass 3 applies `proposed-src/` to `src/`, re-runs typecheck/eslint/build, emits the Component Structural Mirror + SWA test plan → Walter merges + SWA-tests → Pass 3 Visual Acceptance Evidence (a recording/screenshot of a streaming reply + status word).

## §IMPL — drafted + validated implementation (Pass-3 payload, in `proposed-src/`)
The five changed files are written and **validated against the live repo toolchain this turn**: `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`) → **clean**; `eslint` on all five → **clean (exit 0)**; `npm run build` → **clean** (the `TheoSurface` federated bundle builds, 55→59 kB with the streaming additions). Staged in `Codex Governance/Theo-1B-B9-FE-Streaming-Pass-1-VEP/proposed-src/theo/` (5 files); NOT yet applied to `src/` (applied at Pass 3 on approval). Region classification (Golden Component Pack §4): the existing bubble/composer = **VISUAL-AUTHORITY-MATCH** (unchanged); `StatusLine` + `ThinkingPanel` + the streaming render = **VISUAL-AUTHORITY-DEVIATION** (additive, §WALTER-AUTH); service/state/types = **ALLOWED DELTA** (service-boundary streaming sibling + contract types, 1A handover §2.3).

## §DEPLOY / Pass-3 path
1. Codex Pass 2 reviews this VEP + CCT. 2. On APPROVAL, Pass 3 applies `proposed-src/` to `src/`, re-runs `typecheck`+`eslint`+`build`, emits the Component Structural Mirror + SWA test plan. 3. Walter merges to `development` + SWA-tests on the dev SWA: send a message → status word appears within ~1s, the answer streams in token-by-token, the turn persists (reload shows it); (optionally) set `THEO_THINKING_BUDGET_TOKENS` on the sidecar → the Thinking panel lights up. 4. Pass 3 Visual Acceptance Evidence (recording/screenshot). No backend step (the sidecar is live).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B9-FE Streaming Pass-1 Frontend VEP (plan).*
