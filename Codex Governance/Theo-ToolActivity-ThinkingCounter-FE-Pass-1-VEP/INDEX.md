# Theo Frontend — show the live token counter DURING thinking (planning phase visible) — Pass-1 Frontend VEP

Final piece of the "watch it work" experience. The backend now streams a **visible thinking/planning phase** on every working turn (adaptive thinking; plus the plan-before-tool nudge makes even a K-1 export stream ~13s of planning — verified live). But the shipped FE **hides** the token counter while thinking streams and only renders the activity panel once a tool fires — so that planning phase currently shows as a bare thinking blip with no climbing count. This routes the general-chat thinking stream into the **activity panel's reasoning line** and marks thinking as **"processing"** (not "streaming"), so the panel renders from the first thinking token and the counter **shows + climbs through the planning phase** — hiding only while the final answer streams. Two edits in `useTheoState` (state wiring); no component/prop/type change. Visual authority: **VA-T7 §4B** (corrected + landed with this package). Code written + `tsc` clean + `vite build` green.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `__PKGSHA__` (vault-theo, `development` — the commit that contains this package + the VA-T7/§4B correction)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A F-P; §4B VA-T7; §5; §6 T20/T21) | `Read`/`Grep` §4B (VA-T7 row) this turn | `__CONFSHA__` |
| 2 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `event: vault_tokens`) | `Grep(§2.1)` this turn | `ce1ad227ca4f66a5c9c74ccdb185f3d2c3974cd3` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 deltas) | `Grep(§3/§5)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 CCT; §6 build guardrails) | `Grep(§3/§6)` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 6 | VA-T7 reference surface — `artifacts/theo-agent-activity-reference.jsx` (corrected: count SHOWN through thinking + build, HIDDEN only while the answer streams; new state C0 = thinking phase) | `Read(artifacts/theo-agent-activity-reference.jsx)` this turn | `__VAT7SHA__` |
| 7 | ACTIVE state (mirror target) — `src/theo/useTheoState.ts` (general-chat `send()` handlers) | `Read`/`Grep(useTheoState.ts §send)` this turn | `0635dc92cf0368e40369da6bd5afef8cf31ca227` |
| 8 | ACTIVE surface — `src/theo/components/ChatView.tsx` (AgentActivity render condition; ThinkingPanel guard) | `Grep(ChatView.tsx)` this turn | `62f22461093b16e4c5012ad517a7e8d5a36601f6` |
| 9 | ACTIVE component — `src/theo/components/AgentActivity.tsx` (token span gate `!(running && streaming)`) | Read earlier this session; unchanged this VEP | `f54fbbcb617ffb27c2bef40c305399dff7244941` |
| 10 | Shared types — `src/theo/types.ts` (`Message.streaming?`, `reasoning?`) | `Grep(types.ts)` this turn | `2354efcac5dd42df2c106b3992b5460cfe763ec7` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "SHOWN throughout \"processing\"" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| spec/THEO_API_SPEC.md | §2.1 | "streams `event: vault_tokens`" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

---

## F-P1 — Feature identification
The backend streams a visible thinking/planning phase (reasoning) with a climbing `vault_tokens` count before/while it works. The shipped FE (a) routes general-chat thinking into `Message.thinking` → a separate `ThinkingPanel` (not the activity panel), and (b) marks thinking as "streaming", which HIDES the counter. So the planning phase shows without the climbing count and outside the unified panel. This routes thinking into the activity panel's reasoning line and treats thinking as "processing" so the counter shows + climbs through it — the "Thinking… Nk tokens" phase, then the build, then the answer (count hides).

## F-P2 — UI authority reconciliation
- **VA-T7 §4B** (Frontend Conformance, CURRENT — corrected + landed in this same commit): the two-mode toggle is clarified to **count SHOWN throughout the thinking/planning phase AND the build ("processing"), HIDDEN only while the final answer streams**, returning at DONE. New reference state **C0** demonstrates the thinking phase (reasoning streams + climbing count + playful verb, no tool yet). The §4B `sha256` is updated to the current artifact in the same commit (authority registered at HEAD, not ahead of it). Sigma states unchanged.
- **VA-T1** governs the rest — unchanged.

## F-P3 — Contract grounding
- Source: API Spec §2.1 — `event: vault_tokens` (cumulative, monotonic) streams throughout, including during the backend's new thinking phase. Native `thinking_delta` → the FE's `onThinking`.
- Consumed in `useTheoState.send()` (general-chat branch): `onThinking` appends to `reasoning` (was `thinking`) + patches `streaming: false`; `onTokens` sets the count (unchanged). No new event, no gateway change.

## F-P4 — Component grounding (primary reference)
`PRIMARY REFERENCE: src/theo/useTheoState.ts` (§ the general-chat `send()` handlers — the state-wiring mirror target; a modify). The change is a **§5 allowed delta — wiring the existing stream handlers**: route the `onThinking` delta into `reasoning` and mark it `streaming:false`. No component edit: `ChatView` already renders `AgentActivity` when `m.reasoning` is present, and `AgentActivity` already shows the token span when `!(running && streaming)` — so populating `reasoning` during thinking + `streaming:false` makes the panel appear and the counter climb with no component/prop change. `ThinkingPanel` (keyed on `m.thinking`) simply stops rendering for general chat (thinking no longer flows to `m.thinking`), avoiding a double panel. No new dependency; no browser storage.

## F-P5 — Component Contract Table

### Component 1 — state wiring (`src/theo/useTheoState.ts`) — general-chat `send()` (internal; return unchanged) — MODIFIED
- **(1) Interface:** none (internal stream handlers; `useTheoState`'s return is unchanged — `reasoning`/`tokens`/`streaming` ride inside `messages`). No new prop anywhere.
- **(2) Visual authority:** VA-T7 §4B (corrected) — the activity panel's reasoning line + "playful while only thinking" verb + the token count SHOWN through processing. New state C0 depicts exactly this.
- **(3) Data/contract dependency — the two edits:**
  - `onThinking`: was `think += d; lastTextAt = Date.now(); patchLastAssistant({ thinking: think, streaming: true })` → now `reasoning += d; patchLastAssistant({ reasoning, streaming: false })`. Thinking now feeds the activity panel's reasoning line (so `ChatView`'s existing `(m.reasoning || m.tools)` condition renders the panel from the first thinking token), and is marked **processing** (`streaming:false`) so the counter shows + climbs; `lastTextAt` is NOT updated (thinking is not answer text, so `onTokens`' 500ms recency correctly keeps "processing").
  - `onTool`: drop the now-redundant `if (toolCalls.length === 0 && think) reasoning = think;` (reasoning already holds the thinking); the rest of `onTool` is unchanged.
  - Unchanged: `onText` still sets `streaming:true` + `lastTextAt` (answer flowing ⇒ count hides); `onTokens` still sets the count and flips to processing after ~500ms without answer text; finalize still clears `streaming` and re-asserts `reasoning`/`tokens`.

## F-P6 — Build guardrails (Governor §6)
Inline-style only (unchanged components); **no `localStorage`/`sessionStorage`**; no new dependency; `Date.now()` is a pure read in the state layer (no timer). `tsc --noEmit` clean + `vite build` green (TheoSurface federated bundle produced).

## F-P7 — Gap Register
**PROCEED.** (1) **Panel now appears for any general-chat turn that thinks** (reasoning populated) — desired: a thinking turn shows the "Thinking… Nk tokens" panel; a trivial turn with no thinking (verified backend: 0 thinking frames) sets no reasoning → no panel → plain answer, unchanged. (2) **No double panel:** `ThinkingPanel` is keyed on `m.thinking`, which general chat no longer sets, so only the activity panel shows. (3) **Toggle correctness:** thinking = processing (count shown); only the answer (`onText`) flips to streaming (count hidden) — matches the corrected VA-T7 §4B. (4) **Reasoning is ephemeral** (not persisted; same as `thinking` was) — on reload a finished general-chat turn shows text only, unchanged. (5) **Sigma path unaffected** (separate `sendReviewAgentStream`; its `onThinking`→`reasoning` was already the pattern).

## F-P8 — Out of scope
Persisting reasoning/tokens across reload; a richer done-label for thinking-only turns ("Done" is acceptable); the non-streaming `theo_message` path.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-ToolActivity-ThinkingCounter-FE-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review of the Component Contract Table. On APPROVED, Claude Code commits the `useTheoState` edit to `development` and captures screenshot evidence against VA-T7 (state C0 — thinking phase with climbing counter) for Walter to verify on the dev SWA.
