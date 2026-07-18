# Theo Frontend — pin the header + auto-scroll the thinking region — Pass-1 Frontend VEP

Readability fix for the live thinking panel (Walter, dev SWA): the reasoning box grows unbounded, so the header (verb + live token count) scrolls off-screen once the thinking gets long, and the stream reads as one runaway block. This caps the reasoning into a **fixed-height, auto-scrolling region** — the header stays PINNED/visible however long the thinking runs, the newest thinking is always in view (the stream "advances"), and `pre-wrap` preserves the summary's paragraph/list breaks. One component edit in `AgentActivity` (the reasoning `<div>` + a scroll-to-bottom effect); no prop/type/contract change. Visual authority: **VA-T7 §4B** (updated + landed with this package). `tsc` clean + `vite build` green.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `__PKGSHA__` (vault-theo, `development` — the commit that contains this package + the VA-T7/§4B update)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4B VA-T7; §5; §6 T20/T21) | `Read`/`Grep` §4B (VA-T7 row) this turn | `__CONFSHA__` |
| 2 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 primary reference; §3 CCT; §5 deltas) | `Grep(§2/§3/§5)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 3 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 CCT; §6 build guardrails) | `Grep(§3/§6)` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 4 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | VA-T7 reference surface — `artifacts/theo-agent-activity-reference.jsx` (updated: fixed-height auto-scrolling reasoning region + pinned header + `pre-wrap`) | `Read(artifacts/theo-agent-activity-reference.jsx)` this turn | `__VAT7SHA__` |
| 6 | ACTIVE component (mirror target) — `src/theo/components/AgentActivity.tsx` (the reasoning render region) | `Read(src/theo/components/AgentActivity.tsx)` this turn | `__AGENTSHA__` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "fixed-height auto-scrolling region" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "select **exactly one** existing component file as the structural mirror target" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "Keep the reference surface's inline-style approach" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

---

## F-P1 — Feature identification
The thinking now streams live (backend adaptive thinking), but the FE renders the reasoning in an unbounded `<div>`: as it grows, the panel header (verb + live token count) scrolls out of view and the text reads as one runaway block. This caps the reasoning into a fixed-height region that auto-scrolls to the newest text while running, keeping the header pinned and the latest thinking in view, and `pre-wrap` preserves paragraph/list breaks.

## F-P2 — UI authority reconciliation
- **VA-T7 §4B** (Frontend Conformance, CURRENT — updated + landed in this same commit): the reasoning streams in a **fixed-height auto-scrolling region** so the header stays pinned and the newest thinking is in view; `pre-wrap` preserves breaks. The reference `ActivityPanel` reasoning `<div>` carries `maxHeight`/`overflowY:auto`/`whiteSpace:pre-wrap` and a comment documenting the live auto-scroll. §4B `sha256` updated to the current artifact in the same commit.
- **VA-T1** governs the rest — unchanged.

## F-P3 — Contract grounding
No contract/stream change. Pure presentation of the existing `reasoning` prop.

## F-P4 — Component grounding (primary reference)
`PRIMARY REFERENCE: src/theo/components/AgentActivity.tsx` (§2 — the existing component is the structural mirror target; a modify). **Allowed delta (§5):** the reasoning `<div>` gains `maxHeight: 180`, `overflowY: "auto"`, `whiteSpace: "pre-wrap"` + a `ref`; a `useEffect` scrolls that ref to `scrollHeight` on `[reasoning, running]` while `running` (auto-advance to newest). No new prop, no new dependency, no browser storage; inline-style preserved.

## F-P5 — Component Contract Table

### Component 1 — `AgentActivity` (`src/theo/components/AgentActivity.tsx`) — MODIFIED
- **(1) Prop interface** (full literal — UNCHANGED by this VEP):
```ts
export interface AgentActivityProps {
  running: boolean;
  reasoning: string;
  tools: AgentToolCall[];
  fund?: string;                       // review context (Sigma); absent ⇒ general chat
  mode?: "review" | "chat";            // selects the label family (default: "review" when fund set, else "chat")
  tokens?: number;                     // live output-token count for the header (hidden when falsy)
  streaming?: boolean;                 // text actively streaming ⇒ hide the live count while running
  defaultOpen?: boolean;
}
```
- **(2) Visual authority:** VA-T7 §4B (updated) — fixed-height auto-scrolling reasoning region + pinned header + `pre-wrap`.
- **(3) Data/contract dependency:** none new. Two internal changes: (a) the reasoning `<div>` style gains `whiteSpace: "pre-wrap", maxHeight: 180, overflowY: "auto"` and `ref={reasoningRef}`; (b) a `const reasoningRef = useRef<HTMLDivElement | null>(null)` + `useEffect(() => { const el = reasoningRef.current; if (el && running) el.scrollTop = el.scrollHeight; }, [reasoning, running])` to auto-scroll to the newest thinking while running. `useEffect`/`useRef` are already imported. The header (verb + `TokenCount`) is unchanged and now stays visible because the panel height is bounded.

## F-P6 — Build guardrails (Governor §6)
Inline-style only (`maxHeight`/`overflowY`/`whiteSpace` inline); **no `localStorage`/`sessionStorage`**; no new dependency; the effect only reads/sets `scrollTop` (no timer, nothing to clean up); keep the reference surface's inline-style approach. `tsc --noEmit` clean + `vite build` green.

## F-P7 — Gap Register
**PROCEED.** (1) **`maxHeight: 180`** shows ~8–10 lines with older thinking scrollable above — matches the Claude-Code "advancing" feel; the value is a style constant, tunable later. (2) **Auto-scroll only while `running`** — once done, the user can freely scroll the (still-capped) reasoning; the finished panel is collapsible as before. (3) **Applies to both consumers** (Sigma review + general chat) — both benefit from a pinned header during long reasoning; no consumer-specific branch. (4) **No prop/type/contract change** → no ripple to `ChatView`/`useTheoState`. (5) `pre-wrap` only adds breaks where the summary already contains them (no content transform); rich-markdown rendering of the thinking is a deliberate non-goal here (perf on a fast stream) — a possible later enhancement.

## F-P8 — Out of scope
Markdown rendering of the thinking stream (bold/lists); a user-resizable region; persisting reasoning across reload.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-ToolActivity-ThinkingBox-FE-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review of the Component Contract Table. On APPROVED, Claude Code commits the `AgentActivity` edit to `development` for Walter to verify on the dev SWA.
