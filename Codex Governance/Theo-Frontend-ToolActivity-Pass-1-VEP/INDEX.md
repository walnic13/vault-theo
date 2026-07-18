# Theo Frontend — Tool-Loop Activity View (general chat): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (no component code lands this turn; implementation is Pass 3 against the approved Component Contract Table). Renders the general-chat tool-loop's live activity — Theo's reasoning, the tool it grabbed (`theo_export_spreadsheet` …) with a live status dot, and a running **token count** — by extending the existing **`AgentActivity`** (VA-T7) to general chat. The backend already streams `event: tool` / `event: tool_result` (DEPLOYED) and `message_delta.usage`. Visual authority: **VA-T7** (updated + landed for this design). Everything else on the surface is unchanged (VA-T1).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `__PKG_COMMIT__` (vault-theo, `development` — the commit that contains this package)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A F-P; §4B VA-T7; §5; §6 T20) | `Read`/`Grep` §4B (VA-T7 row) + §3/§5/§6 this turn | `f0ac903276e40584b9f5f9bd4b3e29228ef73cec` |
| 2 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 tool-loop + `event: tool`/`tool_result`) | `Read(spec/THEO_API_SPEC.md §2.1)` this turn | `015431576fb8e7f634025b785c97ea4022b93f0c` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 primary reference; §3 CCT; §4 props; §5 deltas) | `Grep(§2/§3/§4/§5)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 CCT; §6 build guardrails) | `Grep(§3/§6)` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 6 | VA-T7 reference surface — `artifacts/theo-agent-activity-reference.jsx` (the updated activity authority: general-chat consumer, token count, blend verb) | `Read(artifacts/theo-agent-activity-reference.jsx)` this turn | `dccb662e56c9b6e3a6827f80669c81e54e566b6c5dc851812cb6b1dc1c246d90` |
| 7 | ACTIVE component (mirror target) — `src/theo/components/AgentActivity.tsx` (the component modified) | `Read(src/theo/components/AgentActivity.tsx)` this turn | `455ddc80a45a791b5c05384993e4f737f27483f9` |
| 8 | ACTIVE service seam — `src/theo/services/gateway.live.ts` (`StreamHandlers` + `sendMessageStream` parse loop) | `Read(gateway.live.ts)` this turn | `46a561a74f2b54c04a25b8513fe6122658a9e2a2` |
| 9 | ACTIVE state — `src/theo/useTheoState.ts` (general-chat `send()` handlers) | `Read(useTheoState.ts §send)` this turn | `6578193c25499e2f7bb43da89b0bb822f6ad9cfc` |
| 10 | ACTIVE surface — `src/theo/components/ChatView.tsx` (assistant-branch render + full `ChatViewProps`) | `Read(ChatView.tsx)` this turn | `a1a30930158ef7cfaddf9a4e12b369a81acc47eb` |
| 11 | Shared types — `src/theo/types.ts` (`Message`; `AgentToolCall`) | `Read(src/theo/types.ts)` this turn | `8001b9fc4ae0eefa0839436f15cf55822380b8e7` |

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
| spec/THEO_API_SPEC.md | §2.1 | "each deterministic tool the instant it fires" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

---

## F-P1 — Feature identification
The general-chat tool-loop (`theo_message_stream`, DR-T11) now streams `event: tool` / `event: tool_result` (DEPLOYED + verified) and `message_delta.usage`. The FE ignores them, so a tool call is invisible. This renders them as the Claude-Code-style live activity — reasoning + the tool firing (status dot → ✓) + a running token count — by extending `AgentActivity` (VA-T7) to general chat. First producer: `theo_export_spreadsheet`.

## F-P2 — UI authority reconciliation
- **VA-T7** (Frontend Conformance §4B, CURRENT — updated for this design): the activity panel above the answer, now with a general-chat consumer, a live token count (header, tabular-nums), a **blend running-verb** (playful while only thinking → context-aware once a tool fires), and the reasoning line. Sigma states unchanged.
- **VA-T1** governs the rest — unchanged. The panel already renders for Sigma; this extends it to general-chat tool turns.

## F-P3 — Contract grounding
- Source: API Spec §2.1 — `theo_message_stream` emits `event: tool {name,input}` + `event: tool_result {name,ok}` (DEPLOYED) and native `message_delta.usage.output_tokens`.
- Consumed only in `sendMessageStream` (func-stream): new parse branches → `onTool` / `onToolResult` (existing handlers) + a new `onUsage`. Wired in `useTheoState.send()` to populate `Message.tools` / `Message.reasoning` / `Message.tokens`.

## F-P4 — Component grounding (primary reference)
`PRIMARY REFERENCE: src/theo/components/AgentActivity.tsx` (§2 — the existing component is the structural mirror target; this is a modify, not greenfield). The change is additive: two optional props + an internal blend-verb/label/token derivation. **Allowed deltas (§5):** the blend verb (a component-local rotating playful label while `running && !tools.length`, switching to a tool-aware label once `tools.length`); the token-count header element; a `mode` that generalises the review-specific label. No new dependency; no browser storage; the rotating verb uses a `setInterval` cleared on unmount/done (Governor §6 — component-scoped, no global state).

## F-P5 — Component Contract Table (the three locked surfaces per §3; full literal interfaces per T20)

### Component 1 — `AgentActivity` (`src/theo/components/AgentActivity.tsx`) — MODIFIED
- **(1) Prop interface** (full literal AFTER change; required before optional; no `any`):
```ts
export interface AgentActivityProps {
  running: boolean;
  reasoning: string;
  tools: AgentToolCall[];
  fund?: string;                       // review context (Sigma); absent ⇒ general chat
  mode?: "review" | "chat";            // NEW: selects the label family (default "review" when fund set, else "chat")
  tokens?: number;                     // NEW: live output-token count for the header (hidden when falsy)
  defaultOpen?: boolean;
}
```
- **(2) Visual authority:** VA-T7 (`artifacts/theo-agent-activity-reference.jsx`, updated) — reproduce faithfully.
- **(3) Data/contract dependency:** none new — reads its props. Internal derivation: header label = review label (`Reviewing <fund>…` / `Checked <fund> · N tools`) when `mode==="review"`, else the general-chat **blend verb** — a playful rotating verb (`Noodling…`, `Number-wrangling…`, `Crunching…`) while `running && tools.length===0`, switching to a tool-aware verb once a tool fires (`theo_export_spreadsheet` → `Building your spreadsheet…`; generic `Using <tool>…`), and `Used <tool>` when done. `tokens` renders via a `TokenCount` element (mono, `tabular-nums`, hidden when falsy).

### Component 2 — shared types (`src/theo/types.ts`) — `Message` gains one optional field
- **Modified interface** `Message` (full literal after change):
```ts
export interface Message { role: Role; content: string; runs?: CitedRun[]; attachments?: SentAttachment[]; thinking?: string; reasoning?: string; tools?: AgentToolCall[]; download?: FileDownload; tokens?: number }
```
- **(2) VA:** N/A. **(3) dependency:** none. (`AgentToolCall` unchanged.)

### Component 3 — service seam (`src/theo/services/gateway.live.ts`) — `StreamHandlers` gains `onUsage`; `sendMessageStream` parses the events
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
  onUsage?: (u: { output_tokens: number }) => void;
}
```
- **(2) VA:** N/A (transport). **(3) dependency:** `sendMessageStream` gains, in its parse loop, branches (mirroring `sendReviewAgentStream`, §5 — through the gateway abstraction): on `evt.includes("event: tool_result")` → `onToolResult`; else on `evt.includes("event: tool")` → `onTool` (order: `tool_result` before `tool`, per the existing Sigma comment); and on a `message_delta` frame with `j.usage`, call `onUsage({ output_tokens: j.usage.output_tokens })`. Additive; existing branches unchanged.

### Component 4 — `ChatView` (`src/theo/components/ChatView.tsx`) — invocation change; **prop interface UNCHANGED**
- **(1) Prop interface** (full literal, unchanged — reads `m.tools`/`m.reasoning`/`m.tokens` off the existing `messages`; no new prop):
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
- **(2) Visual authority:** VA-T7. **(3) Data/contract dependency:** the existing `AgentActivity` invocation (assistant branch, ~L349) gains `mode={reviewFund ? "review" : "chat"}` and `tokens={m.tokens}`; and the `ThinkingPanel` line (~L352) is guarded so it does **not** also render when the activity panel already shows the reasoning for a tool turn: `{m.thinking && !(m.tools && m.tools.length) ? <ThinkingPanel …/> : null}` (avoids duplicate reasoning). No new prop.

### Component 5 — state wiring (`src/theo/useTheoState.ts`) — general-chat `send()` (internal; return unchanged)
- **(1) Interface:** none (internal handlers; `useTheoState`'s return is unchanged — `tools`/`reasoning`/`tokens` ride inside `messages`). **(3) dependency:** the `sendMessageStream` call gains: `onTool` (push `{name, input, status:"running"}` to `toolCalls`; on the FIRST tool, copy the accumulated `think` into `reasoning` so the activity panel shows Theo's reasoning; `patchLastAssistant({ tools, reasoning })`), `onToolResult` (resolve the most-recent running row of that name → `done`/`fail`), and `onUsage` (`tokensOut = u.output_tokens`; `patchLastAssistant({ tokens: tokensOut })`) — mirroring the Sigma path's `onTool`/`onToolResult`. Finalize `patchLastAssistant` re-asserts `tools`/`reasoning`/`tokens`. **(2) VA:** N/A.

## F-P6 — Build guardrails (Governor §6)
Inline-style only (`C.*`/`SANS`/`MONO`); **no `localStorage`/`sessionStorage`**; no new dependency; the rotating-verb `setInterval` is component-scoped and cleared on unmount + when `!running`/`tools.length` (no leak); keep the reference surface's inline-style approach.

## F-P7 — Gap Register
**PROCEED.** (1) **Reasoning duplication:** guarded — `ThinkingPanel` is suppressed on tool turns (the activity panel shows the reasoning); non-tool turns keep `ThinkingPanel` unchanged. (2) **Non-tool chat unaffected:** the activity panel renders only when `m.tools?.length` (general chat) — a plain reply populates neither `tools` nor (general-chat) `reasoning`, so no panel appears (Sigma's `reasoning`-driven render is unchanged). (3) **Token count** is best-effort from `message_delta.usage`; absent ⇒ hidden. (4) **Mock gateway** needs no change (never emits these events). (5) Persistence of `tools`/`tokens` across reload is out of scope (ephemeral activity; the persisted turn keeps text + citations as today).

## F-P8 — Out of scope
Pass-3 implementation (the edits above). Persisting activity across reload; a configurable playful-verb set; applying the activity view to the non-streaming `theo_message` path — later.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Frontend-ToolActivity-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review of the Component Contract Table. On APPROVED, Claude Code implements Pass 3 (the 5 surfaces above), captures screenshot evidence against VA-T7, and commits to `development` for Walter to verify on the dev SWA.
