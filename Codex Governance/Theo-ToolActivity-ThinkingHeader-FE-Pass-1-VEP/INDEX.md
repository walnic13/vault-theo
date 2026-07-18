# Theo Frontend — general-chat header reads a plain "Thinking…" — Pass-1 Frontend VEP

Small polish (Walter, dev SWA). The activity-panel header currently cycles a playful/tool-aware "blend verb" ("Number-wrangling…" → "Building your spreadsheet…") next to the live token count. Walter wants the header to just say **"Thinking…"** (the specific tool already shows in its own row below, and the playful animated status word already lives in the host's `StatusLine` beneath the panel — which he likes there). This makes the general-chat running header a static "Thinking…" and removes the now-unused blend-verb machinery. One `AgentActivity` edit; no prop/type/contract change; Sigma's "Reviewing <fund>…" header unchanged. Visual authority: **VA-T7 §4B** (updated + landed with this package). `tsc` clean + `vite build` green.

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
| 5 | VA-T7 reference surface — `artifacts/theo-agent-activity-reference.jsx` (updated: general-chat header = plain "Thinking…"; playful word in the host StatusLine) | `Read(artifacts/theo-agent-activity-reference.jsx)` this turn | `__VAT7SHA__` |
| 6 | ACTIVE component (mirror target) — `src/theo/components/AgentActivity.tsx` (label + verb machinery) | `Read(src/theo/components/AgentActivity.tsx)` this turn | `9f4e61d6c56d955acfd9c378b999d795a6ec4346` |
| 7 | ACTIVE surface — `src/theo/components/ChatView.tsx` (the host `StatusLine` — playful word, unchanged) | `Grep(ChatView.tsx StatusLine)` this turn | `62f22461093b16e4c5012ad517a7e8d5a36601f6` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "the general-chat header reads a plain **\"Thinking…\"**" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "select **exactly one** existing component file as the structural mirror target" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

---

## F-P1 — Feature identification
The panel header cycled a playful verb ("Number-wrangling…") that switched to a tool-aware verb ("Building your spreadsheet…") once a tool fired. Walter wants the header to simply read "Thinking…" while running — the specific tool is already visible in its own row (`theo_export_spreadsheet()`), and the playful animated status word already appears in the host's `StatusLine` below the panel. This sets the general-chat running header to a static "Thinking…".

## F-P2 — UI authority reconciliation
- **VA-T7 §4B** (Frontend Conformance, CURRENT — updated + landed in this same commit): the general-chat running header reads a plain **"Thinking…"** (the playful animated status word lives in the host `StatusLine` beneath the panel, not this header); the reference's general-chat states C0/C/C2 pass `title="Thinking…"`. §4B `sha256` updated to the current artifact in the same commit. Sigma header ("Reviewing <fund>…") and the DONE factual summary are unchanged.
- **VA-T1** governs the rest — unchanged.

## F-P3 — Contract grounding
No contract/stream change — a label string + dead-code removal.

## F-P4 — Component grounding (primary reference)
`PRIMARY REFERENCE: src/theo/components/AgentActivity.tsx` (§2 — the existing component is the mirror target; a modify). **Allowed delta (§5):** the general-chat running `label` becomes the literal `"Thinking…"`; the now-unused blend-verb machinery is removed (the `PLAYFUL_VERBS` array, `TOOL_VERBS` map, `toolAwareVerb()`, and the `verbIdx`/`rotating`/rotation-`useEffect`). `chatDoneLabel()` (the DONE summary), the Sigma label, and everything else are unchanged. No new prop, no new dependency, no browser storage.

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
- **(2) Visual authority:** VA-T7 §4B (updated) — general-chat running header = plain "Thinking…"; playful word in the host StatusLine.
- **(3) Data/contract dependency:** none. Internal only: (a) the chat running branch of `label` becomes `"Thinking…"` (was the `toolAwareVerb`/`PLAYFUL_VERBS[verbIdx]` blend); (b) removed as now-unused: `PLAYFUL_VERBS`, `TOOL_VERBS`, `toolAwareVerb()`, the `verbIdx` state, `rotating`, `rotatingRef`, and the rotation `useEffect`. `useState`/`useEffect`/`useRef` remain imported (used by `open` + the reasoning auto-scroll). `chatDoneLabel()` and the Sigma branch unchanged.

## F-P6 — Build guardrails (Governor §6)
Inline-style unchanged; **no `localStorage`/`sessionStorage`**; no new dependency; removing the rotation `setInterval` also removes a timer (net simpler). `tsc --noEmit` clean + `vite build` green.

## F-P7 — Gap Register
**PROCEED.** (1) **Tool visibility preserved** — the specific tool still shows in its own row (`theo_export_spreadsheet()`); only the header umbrella verb changes to "Thinking…". (2) **Playful animation preserved** — it already lives in the host `StatusLine` below the panel (unchanged by this VEP). (3) **Sigma unaffected** — its "Reviewing <fund>…" header is a separate branch. (4) **DONE summary unchanged** — `chatDoneLabel()` still yields "Used the spreadsheet export tool" etc. (5) No prop/type/contract change → no ripple to `ChatView`/`useTheoState`.

## F-P8 — Out of scope
Markdown rendering of the thinking stream; changing the host `StatusLine` word list; the DONE summary text.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-ToolActivity-ThinkingHeader-FE-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review of the Component Contract Table. On APPROVED, Claude Code commits the `AgentActivity` edit to `development` for Walter to verify on the dev SWA.
