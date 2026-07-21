# Theo Frontend — User message bubble wraps long URLs (VA-T1 overflow fix): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (implementation is Pass 3 against the approved Component Contract Table). A one-property defect fix: the **user message bubble** (`ChatView.tsx` L423) sets `whiteSpace: "pre-wrap"` (wraps at whitespace) but no word-break, so a long unbroken token — a pasted URL — overflows the rounded bubble past its `maxWidth: "82%"` (Walter screenshot, 2026-07-21). Add `wordBreak: "break-word"` so long URLs break **inside** the bubble — mirroring the file's own existing idiom for the same problem (the pasted-text `<pre>` at L262/L312 already uses `whiteSpace:"pre-wrap"` + `wordBreak:"break-word"`). This restores the intended VA-T1 rendering (content contained within the bubble); nothing else changes.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `645a26028f54550e9d72fbb0ef78b051e9d7495f` (vault-theo, `development` — the commit that first contains this package; grounding reads performed against parent `857bdce2e93b1667eab63432a271c502f6beabce`). Working tree also carried 4 untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not source/governance, not grounding).
Currency-anchor form: git blob SHA at HEAD.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 guardrails — no storage; inline-style) | `Grep("No `localStorage` / `sessionStorage`")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchors; §6 T20) | `Read`/`Grep` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§4 prop conventions; §5 visual-deviation rule) | `Read(...THEO_GOLDEN_COMPONENT_PACK_STANDARD.md)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | ACTIVE surface — `src/theo/components/ChatView.tsx` (user bubble L423; the existing `wordBreak:"break-word"` idiom at L262/L312; complete `ChatViewProps`) | `Grep`/`Read(src/theo/components/ChatView.tsx)` this turn | `cd8af9b72b69c4abd70d332f2944c891eb71eb5e` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |
| src/theo/components/ChatView.tsx | user-bubble | "background: C.bubble, borderRadius: 16" |

---

## F-P1 — Feature identification
**Feature:** fix the user message bubble overflowing on a long pasted URL. `ChatView.tsx` L423 renders the user turn as `<div style={{ background: C.bubble, borderRadius: 16, padding: "11px 16px", maxWidth: "82%", fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{m.content}</div>`. `pre-wrap` wraps at whitespace but does **not** break a long unbroken token; a pasted URL therefore renders past the bubble's right edge (Walter screenshot 2026-07-21).

**The one change:** add `wordBreak: "break-word"` to that style object (one property). This is the file's own established idiom for the identical problem — the pasted-text preview `<pre>` (L262) and the collapsed pasted-text chip (L312) already combine `whiteSpace:"pre-wrap"` with `wordBreak:"break-word"`.

**Role vocabulary.** Claude Code authors (Pass 1); Codex reviews (Pass 2); on APPROVED Claude Code implements on `development` (Pass 3) + emits the SWA test plan; Walter validates on the dev SWA.

---

## F-P2 — UI Authority Reconciliation
- **VA-T1 (reference surface)** governs the chat bubble. The intended rendering is content contained within the rounded bubble; a long URL escaping the `maxWidth:"82%"` box is a **rendering defect**, not the authored design. Adding `wordBreak:"break-word"` **restores** VA-T1 conformance (text stays inside the bubble) and reuses VA-T1's own existing token-break idiom (L262/L312). Per Golden Component Pack §5 this visual correction is classified and anchored (Rule Anchor 4); it introduces no new visual design — no VA-registry edit, no new VA-id, no Role-C. Geometry, palette (`C`), radius, padding, and `maxWidth` are all unchanged.

---

## Architecture & boundary reconciliation
FE-only, single file, single style property. No prop, contract, backend, route, service-module, or state change. No `corporate-reporting`/`reporting_*` involvement. Purely a CSS text-wrapping correction on an existing rendered element.

---

## F-P2.5 / Gap Disclosure
Vocabulary closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §5.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-ASSISTANT | The assistant turn (markdown via `renderAssistant`) is not touched. | **PROCEED** | The reported defect is the user bubble; assistant markdown links wrap via react-markdown. If a raw over-long assistant token is later reported, it's a separate follow-up. |
| G-BREAKMODE | `break-word` vs `anywhere`. | **PROCEED** | `wordBreak:"break-word"` matches the file's existing idiom (L262/L312) — consistency over introducing a second wrap mode; it breaks the URL only when it can't fit. |

Per-surface real-in-1A vs true-in-1B: the chat bubble is **real** now; unchanged by 1A/1B seam.

---

## F-P3 — Backend / contract grounding
**No contract change.** Presentation-only; no service-module, gateway, or endpoint interaction.

---

## F-P4 — Component reference grounding
**Canonical Primary Reference: `src/theo/components/ChatView.tsx`** (the ACTIVE component; the user-bubble `<div>` at L423 is the structural-mirror target; the existing `wordBreak:"break-word"` usages at L262/L312 are the in-file idiom being mirrored). No new components.

---

## F-P5 — Component Contract Table

### CCT-1 · `ChatView` — ACTIVE (Theo surface), modified · VA-T1 (unchanged design; overflow-defect correction) · no contract/handler dependency change · **PROCEED**

**No prop-interface change** — the fix adds one inline-style property to an existing element. The complete current `ChatViewProps` (unchanged; required-before-optional; no `any`) is locked here per T20:
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

**The change (illustrative — final at Pass 3):** the user-bubble style gains one property:
```tsx
<div style={{ background: C.bubble, borderRadius: 16, padding: "11px 16px", maxWidth: "82%", fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.content}</div>
```
No `any`; inline-style preserved (no Tailwind); no new import.

---

## F-P6 — Repository & active-surface grounding
- Target file (read this turn): `src/theo/components/ChatView.tsx`, user-bubble `<div>` at L423.
- **Guardrails honored (Governor §6 / Conformance §6 T26):** **no `localStorage`/`sessionStorage`**; **inline-style preserved** (one added property, no Tailwind/CSS-in-JS); no direct browser→model call; no `corporate-reporting`/`reporting_*` change; `[[ARTIFACT]]`/SWAP BLOCK untouched.

---

## F-P7 — Visual-parity + SWA test plan (Pass-3 obligations, previewed)
- **No VA-registry edit** (F-P2): VA-T1 design unchanged; this is an overflow-defect correction reusing the in-file idiom.
- **SWA test plan (F-I5):** on `development` deploy, Walter: (1) paste a long URL into the composer and send → the URL **wraps inside** the user bubble (no overflow past the rounded edge); (2) normal wrapped text + newlines still render as before (`pre-wrap` preserved); (3) desktop + narrow both contained. Screenshot of a wrapped-URL bubble = Pass-3 Visual Acceptance Evidence.

## Mechanical lint
Run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission> --repo-root .`), verbatim:

```
PASS  Codex Governance/Theo-Frontend-Bubble-URL-Wrap-Pass-1-VEP/Theo_Frontend_Bubble_URL_Wrap_Pass_1_VEP.md
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note
Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §2). Hard gates: CCT completeness (T20 — CCT-1 pastes the complete literal `ChatViewProps`; no prop change), VA-id (T21 — no VA edit; VA-T1 unchanged), contract (T22 — none), artifact presence (T25), GCR/Rule-Anchor (T1/T5). Substance: a one-property `wordBreak:"break-word"` overflow-defect correction on the user bubble, reusing the file's existing idiom (L262/L312), classified under Golden Component Pack §5 as a VA-T1 conformance fix (no redesign); guardrails T26 (inline-style, no Tailwind, no storage). Verdict APPROVED or REJECTED only.
