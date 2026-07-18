# Theo Frontend — Tool-Loop live-streaming feel: live `vault_tokens` count + processing/streaming toggle — Pass-1 Frontend VEP

Refinement to the shipped general-chat activity view (`AgentActivity`, VA-T7). Backend now DEPLOYED + golden-verified (2026-07-18): `event: tool` fires at the tool_use block **open** (`{name}` only), and a new `event: vault_tokens` streams a **live cumulative** output-token count (monotonic-clamped). This FE consumes them so the experience matches Claude Code (Walter, dev SWA): the tool-aware verb + a **climbing** token count show during the ~1.5-min silent build, and the count **hides while answer/thinking text streams** (the text is the signal) — cycling per tool turn. Two optional props (`Message.streaming`, `AgentActivity.streaming`), one handler swap (`onUsage`→`onTokens`), one parse branch (`event: vault_tokens`), and the recency toggle in `send()`. Visual authority: **VA-T7** (updated + landed with this package). Code is written + `tsc --noEmit` clean + `vite build` green (working tree), landing on APPROVAL (Pass 3).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `d0e107ae4dfa19b4965a793a770ddbc2a96b763c` (vault-theo, `development` — the commit that contains this package + the VA-T7 update)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A F-P; §4B VA-T7; §5; §6 T20) | `Read`/`Grep` §4B + §3/§5/§6 this turn | `cb4345647b39294f0234b79d62123edaaff23d43` |
| 2 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 tool-loop; block-start `event: tool` + `event: vault_tokens`) | `Read(spec/THEO_API_SPEC.md §2.1)` + `Grep` this turn | `ce1ad227ca4f66a5c9c74ccdb185f3d2c3974cd3` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 primary reference; §3 CCT; §4 props; §5 deltas) | `Grep(§2/§3/§4/§5)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 CCT; §6 build guardrails) | `Grep(§3/§6)` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 6 | VA-T7 reference surface — `artifacts/theo-agent-activity-reference.jsx` (updated: `event: vault_tokens` source + the two-mode token toggle; states C/C2/D) | `Read(artifacts/theo-agent-activity-reference.jsx)` this turn | `a8f5535785e2cf3c129a5fe751c48aa6d38633ab` |
| 7 | ACTIVE component (mirror target) — `src/theo/components/AgentActivity.tsx` | `Read(src/theo/components/AgentActivity.tsx)` this turn | `a889190126a2bdae1a9b0287fb7ed83dad1dad5f` |
| 8 | ACTIVE service seam — `src/theo/services/gateway.live.ts` (`StreamHandlers` + `sendMessageStream` parse loop) | `Read`/`Grep(gateway.live.ts)` this turn | `283a15a5ff5fa93a9cfcfb80a594602c6aff26c5` |
| 9 | ACTIVE state — `src/theo/useTheoState.ts` (general-chat `send()` handlers) | `Read`/`Grep(useTheoState.ts §send)` this turn | `410409dd81fb82f94db9424ac486441de6367879` |
| 10 | ACTIVE surface — `src/theo/components/ChatView.tsx` (assistant-branch `AgentActivity` invocation) | `Read`/`Grep(ChatView.tsx)` this turn | `f43bbd6994e15e50fdb44b2bd1088d8082671028` |
| 11 | Shared types — `src/theo/types.ts` (`Message`; `AgentToolCall`) | `Read(src/theo/types.ts)` this turn | `2a5c86a26accc4359dc1b073a8026520fe8e1e84` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "Also consumed by the general-chat tool-loop" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "select **exactly one** existing component file as the structural mirror target" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "A row missing any of the three locked surfaces is invalid (T20)." |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "MUST contain a **Component Contract Table**" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "Keep the reference surface's inline-style approach" |
| spec/THEO_API_SPEC.md | §2.1 | "streams `event: vault_tokens`" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

---

## F-P1 — Feature identification
The shipped activity view (VA-T7, general chat) renders reasoning + tool rows + a token count, but: (a) the count only updated from `message_delta.usage` at each turn's END (no live climb), and (b) `event: tool` arrived only after the whole `tool_use` payload streamed (verb late; the arg-dump rendered as a raw "code" row). Backend is now fixed + deployed (block-start `event: tool {name}`; live cumulative `event: vault_tokens`). This FE consumes them so the count climbs live during the silent build and the verb shows from the start — and adds the **two-mode toggle**: the count shows during silent "processing," hides while text streams. Cycles per tool turn. First producer: `theo_export_spreadsheet`.

## F-P2 — UI authority reconciliation
- **VA-T7** (Frontend Conformance §4B, CURRENT). Both the artifact AND its **§4B registry row land in this same commit** — the row's `sha256` is updated to `b52ee86189c4ce6a0f6092e008ca0305a3f453afd9f66bc9beaf6408d331a34f` (= the current artifact) and its description is updated (token source → `event: vault_tokens` cumulative/monotonic; the two-mode processing/streaming toggle; block-start `{name}`-only general-chat tool rows), so the authority this VEP cites is registered at HEAD, not ahead of it. The panel now sources the header count from `event: vault_tokens` (cumulative, monotonic) and demonstrates the **two-mode toggle** — states **C** (PROCESSING: count climbs), **C2** (STREAMING: count hidden, answer flowing), **D** (DONE: final total). Sigma states A/B unchanged (no toggle; count always shown).
- **VA-T1** governs the rest — unchanged.

## F-P3 — Contract grounding
- Source: API Spec §2.1 — `theo_message_stream` emits `event: tool` `{name}` at the tool_use block open, `event: tool_result` `{name,ok}`, and `event: vault_tokens` `{tokens}` (cumulative; monotonic-clamped upper bound; emitted on all turns). Golden-verified this deploy.
- Consumed only in `sendMessageStream` (func-stream): a new `event: vault_tokens` parse branch → `onTokens` (replaces the removed native `message_delta.usage`→`onUsage` branch). Wired in `useTheoState.send()` to set `Message.tokens` (absolute) and drive `Message.streaming` (the toggle).

## F-P4 — Component grounding (primary reference)
`PRIMARY REFERENCE: src/theo/components/AgentActivity.tsx` (§2 — the existing component is the structural mirror target; this is a modify, not greenfield). Additive: one optional prop (`streaming`) that gates the existing token span. **Allowed deltas (§5):** the token span renders only when `!(running && streaming)` (VA-T7 two-mode toggle). No new dependency; no browser storage; no new global state. The recency logic that computes `streaming` lives in `useTheoState.send()` (state layer), not the component.

## F-P5 — Component Contract Table (the three locked surfaces per §3; full literal interfaces per T20)

### Component 1 — `AgentActivity` (`src/theo/components/AgentActivity.tsx`) — MODIFIED
- **(1) Prop interface** (full literal AFTER change; required before optional; no `any`):
```ts
export interface AgentActivityProps {
  running: boolean;
  reasoning: string;
  tools: AgentToolCall[];
  fund?: string;                       // review context (Sigma); absent ⇒ general chat
  mode?: "review" | "chat";            // selects the label family (default: "review" when fund set, else "chat")
  tokens?: number;                     // live output-token count for the header (hidden when falsy)
  streaming?: boolean;                 // NEW: text is actively streaming ⇒ hide the live token count while
                                       // running (the text is the signal). Count shows during silent
                                       // "processing" stretches and at DONE. (VA-T7 two-mode toggle.)
  defaultOpen?: boolean;
}
```
- **(2) Visual authority:** VA-T7 (`artifacts/theo-agent-activity-reference.jsx`, updated — states C/C2/D). Reproduce faithfully.
- **(3) Data/contract dependency:** none new — reads its props. Single change to the render: the header token span condition becomes `typeof tokens === "number" && tokens > 0 && !(running && streaming)` (was: without the `!(running && streaming)` clause).

### Component 2 — shared types (`src/theo/types.ts`) — `Message` gains one optional field
- **Modified interface** `Message` (full literal after change):
```ts
export interface Message { role: Role; content: string; runs?: CitedRun[]; attachments?: SentAttachment[]; thinking?: string; reasoning?: string; tools?: AgentToolCall[]; download?: FileDownload; tokens?: number; streaming?: boolean }
```
- **(2) VA:** N/A. **(3) dependency:** none. (`AgentToolCall` unchanged.)

### Component 3 — service seam (`src/theo/services/gateway.live.ts`) — `StreamHandlers.onUsage`→`onTokens`; `sendMessageStream` parses `event: vault_tokens`
- **(1) Interface** (full literal after change; new member optional/last):
```ts
export interface StreamHandlers {
  onText: (delta: string) => void;
  onThinking?: (delta: string) => void;
  onCitation?: (c: StreamCitation) => void;
  onMeta?: (meta: { conversation_id?: string; model?: string }) => void;
  onTool?: (t: { name: string; input: unknown }) => void;
  onToolResult?: (t: { name: string; ok: boolean }) => void;
  onExport?: (d: FileDownload) => void;
  onTokens?: (t: { tokens: number }) => void;   // NEW (replaces onUsage): absolute CUMULATIVE count from event: vault_tokens (set, don't sum)
}
```
- **(2) VA:** N/A (transport). **(3) dependency:** `sendMessageStream`'s parse loop **removes** the native `message_delta.usage`→`onUsage` branch and **adds** (after the `event: tool` branch; not a substring collision — `"event: vault_tokens".includes("event: tool")` is false): on `evt.includes("event: vault_tokens")` → `handlers.onTokens?.({ tokens: j.tokens })` when `typeof j.tokens === "number"`. `event: tool` now carries only `{name}` (`input` is `undefined`) — the existing `onTool` branch is unchanged and tolerates it. Additive/removal only; other branches unchanged.

### Component 4 — state wiring (`src/theo/useTheoState.ts`) — general-chat `send()` (internal; return unchanged)
- **(1) Interface:** none (internal handlers; `useTheoState`'s return is unchanged — `tokens`/`streaming` ride inside `messages`). **(3) dependency:** the `sendMessageStream` call:
  - `onText`/`onThinking` also set `lastTextAt = Date.now()` and `patchLastAssistant({ …, streaming: true })` (text is flowing).
  - `onTokens` replaces `onUsage`: `tokensOut = t.tokens` (absolute); if `Date.now() - lastTextAt > 500` (no fresh text ⇒ silent build) `patchLastAssistant({ tokens: tokensOut, streaming: false })`, else `patchLastAssistant({ tokens: tokensOut })`.
  - Locals added: `let lastTextAt = 0;` (alongside `tokensOut`). Finalize `patchLastAssistant` sets `streaming: false` so DONE shows the total.
  This is the two-mode toggle: text flowing ⇒ `streaming:true` (count hides); only-token updates for >500ms ⇒ `streaming:false` (count shows/climbs). Cycles per tool turn. **(2) VA:** N/A.

### Component 5 — `ChatView` (`src/theo/components/ChatView.tsx`) — invocation change; **prop interface UNCHANGED**
- **(1) Prop interface** (full literal, unchanged — reads `m.streaming` off the existing `messages`; no new prop):
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
  onStop: () => void;
  queuedText: string | null;
  onCancelQueued: () => void;
  onAddFiles: (files: FileList | File[]) => void;
  onAddPastedText: (text: string) => boolean;
  onRemoveAttachment: (localId: string) => void;
  chatProject: Project | null;
  assistantName: string;
  greeting: string;
  starters: string[];
  renderAssistant: (content: string) => ReactNode;
  voiceAvailable: boolean;
  recording: boolean;
  transcribing: boolean;
  recordingSeconds: number;
  onStartDictation: () => void;
  onStopDictation: () => void;
  onCancelDictation: () => void;
  playingIdx: number | null;
  synthesizingIdx: number | null;
  onReadAloud: (idx: number, text: string) => void;
  onStopReadAloud: () => void;
  reviewFund?: string;
  reviewMode?: boolean;
  sigmaMode?: boolean;
}
```
- **(2) Visual authority:** VA-T7. **(3) Data/contract dependency:** the existing `AgentActivity` invocation (assistant branch) gains `streaming={m.streaming}` (alongside the existing `tokens={m.tokens}`). No new prop; no other change.

## F-P6 — Build guardrails (Governor §6)
Inline-style only (`C.*`/`SANS`/`MONO`); **no `localStorage`/`sessionStorage`**; no new dependency; `Date.now()` is a pure read in the state layer (no timer, nothing to clean up); keep the reference surface's inline-style approach. `tsc --noEmit` clean + `vite build` green (TheoSurface federated bundle produced).

## F-P7 — Gap Register
**PROCEED.** (1) **Toggle precision:** `streaming` flips on any text/thinking delta and back to processing after ~500ms of only-token updates — a heuristic that faithfully reproduces the Claude-Code cadence (verified against the deployed stream: `event: tool` @3.7s, tokens climbing 102→1760 through a silent ~20s build, answer text after). Edge flicker is bounded by the 500ms window. (2) **Sigma path unaffected:** Sigma passes no `streaming`, so `!(running && streaming)` is always true → its count shows exactly as before. (3) **Non-tool chat:** no activity panel renders (unchanged); the additive `vault_tokens` frames are consumed harmlessly (no panel to show them). (4) **Mock gateway** needs no change (never emits these events). (5) **Backend prerequisite MET:** `event: vault_tokens` + block-start `event: tool` are DEPLOYED + documented in API §2.1 at this HEAD (T22 satisfied).

## F-P8 — Out of scope
Pass-3 = committing the 5 edits above (already written + green). Persisting activity/tokens across reload; a configurable recency window; the non-streaming `theo_message` path — later.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-ToolActivity-LiveStreaming-FE-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review of the Component Contract Table. On APPROVED, Claude Code commits the 5 surfaces to `development` and captures screenshot evidence against VA-T7 (states C/C2/D) for Walter to verify on the dev SWA.
