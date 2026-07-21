# Theo Frontend — Collapsible "Recents" section (VA-T1): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (implementation is Pass 3 against the approved Component Contract Table). Walter-directed (2026-07-22): make the Theo sidebar's **"Recents"** section collapsible. Today the "Recents" label + recent-chat list render unconditionally whenever the sidebar is expanded (`Sidebar.tsx`; the list is gated only by the whole-sidebar `collapsed`). This turns the "Recents" label into a collapse header — a chevron toggling a new internal `recentsExpanded` state (default **open**, so the current look is unchanged until the user collapses) — so the recents list can fold away. Behavior-only visual affordance; no prop/contract/backend change; everything else on the sidebar unchanged (VA-T1).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `__STAMP__` (vault-theo, `development` — the commit that first contains this package; grounding reads performed against parent `714bb54c45dc5337eaabf4fbd3959cdc1e0a28d8`). Working tree also carried 4 untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not grounding).
Currency-anchor form: git blob SHA at HEAD.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 guardrails — no storage; inline-style) | `Grep("No `localStorage` / `sessionStorage`")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchors; §6 T20; §4B VA registry) | `Read`/`Grep` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§4 prop conventions; §5 visual-deviation rule) | `Read(...THEO_GOLDEN_COMPONENT_PACK_STANDARD.md)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | ACTIVE surface — `src/theo/components/Sidebar.tsx` (the "Recents" label + list; complete `SidebarProps`) | `Read(src/theo/components/Sidebar.tsx)` this turn | `ad38b6a848f98468843e05eb15e2056bccdbac76` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "citing a VA-id path not registered here is automatically invalid" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |
| src/theo/components/Sidebar.tsx | header | "Sidebar — VA-T1" |

---

## F-P1 — Feature identification
**Feature (Walter-directed 2026-07-22):** collapsible "Recents". In `Sidebar.tsx`, the expanded sidebar renders a `Recents` label div followed by the scrollable recent-chat list (both under the existing `{!collapsed && (…)}` whole-sidebar gate). The change: turn the `Recents` label into a **button** (label + a chevron) that toggles a new internal `recentsExpanded` state (default `true`); the recent-chat list renders only when `recentsExpanded`. Collapsing folds the list away (the label/chevron remain); expanding restores it.

**Role vocabulary.** Claude Code authors (Pass 1); Codex reviews (Pass 2); on APPROVED Claude Code implements on `development` (Pass 3) + emits the SWA test plan; Walter validates on the dev SWA.

---

## F-P2 — UI Authority Reconciliation
- **VA-T1 (reference surface)** shows the "Recents" section always-open. Adding a collapse chevron to the Recents header is a small **VISUAL-AUTHORITY-DEVIATION** from VA-T1, **Walter-directed 2026-07-22**, classified + anchored per Golden Component Pack §5 (Rule Anchor 5). It is additive + reversible: default-open preserves the current appearance; only the fold affordance is new. No new VA-id (a minor affordance on an existing section, not a new registered surface); the reference-artifact reconciliation (if Walter wants the chevron reflected in the VA-T1 `.jsx`) is a deferred optional Role-C. Palette (`C`), fonts (`SANS`), the row rendering (InlineEdit/RowActions), and the rest of the sidebar are unchanged.

---

## Architecture & boundary reconciliation
FE-only, single file (`Sidebar.tsx`), one new internal state (`recentsExpanded`) mirroring the existing `editingId` internal-state idiom. No prop, contract, backend, route, or persisted-state change. No `corporate-reporting`/`reporting_*`. The Recents data + row handlers (`recents`, `onSelectRecent`, `onRenameRecent`, `onDeleteRecent`) are unchanged.

---

## F-P2.5 / Gap Disclosure
Vocabulary closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §5.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-DEFAULT | Default open vs closed. | **PROCEED** | Default **open** (`recentsExpanded = true`) so the current look is unchanged until the user collapses (Walter: "make it collapsable", not "collapsed by default"). |
| G-PERSIST | Collapsed state is not persisted across reloads. | **PROCEED** | In-session component state only (no `localStorage`, Governor §6). A reload returns to the default-open state — acceptable for a view affordance; persistence is a later FE-only add if wanted. |

Per-surface real-in-1A vs true-in-1B: the sidebar/Recents is **real** now; unchanged by the 1A/1B seam.

---

## F-P3 — Backend / contract grounding
**No contract change.** Presentation-only; the recents list + its handlers are unchanged (`theo_list_conversations` / rename / delete are untouched).

---

## F-P4 — Component reference grounding
**Canonical Primary Reference: `src/theo/components/Sidebar.tsx`** (the ACTIVE component; the `Recents` label + list block is the structural-mirror target; the existing `{!collapsed && (…)}` gate + the `editingId` internal-state pattern are the in-file idiom the `recentsExpanded` toggle mirrors). No new components.

---

## F-P5 — Component Contract Table

### CCT-1 · `Sidebar` — ACTIVE (Theo surface), modified · VA-T1 (Recents section gains a collapse chevron; else unchanged) · no contract/handler dependency change · **PROCEED**

**No prop-interface change** — the toggle is a new internal state (like `editingId`); no prop added/changed. The complete current `SidebarProps` (unchanged; required-before-optional; no `any`) is locked here per T20:
```ts
export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  view: View;
  onNavigate: (v: View) => void;
  nav: NavItem[];
  search: string;
  onSearch: (s: string) => void;
  recents: { id: string; title: string }[];
  onSelectRecent: (id: string) => void;
  onRenameRecent: (id: string, title: string) => void;
  onDeleteRecent: (id: string) => void;
  onNewChat: () => void;
  workspaceName: string;
  productName: string;
  fluid?: boolean;
}
```

**The change (illustrative — final at Pass 3):** a new `const [recentsExpanded, setRecentsExpanded] = useState(true);`; the `Recents` label `<div>` becomes a `<button>` (label + a chevron glyph from `./icons`, e.g. the existing chevron idiom) calling `setRecentsExpanded(v => !v)`; the recent-list `<div className="vo-scroll">…</div>` renders only when `recentsExpanded`. No `any`; inline-style preserved (no Tailwind); no storage.

---

## F-P6 — Repository & active-surface grounding
- Target file (read this turn): `src/theo/components/Sidebar.tsx` — the `Recents` label + list within the `{!collapsed && …}` block.
- **Guardrails honored (Governor §6 / Conformance §6 T26):** **no `localStorage`/`sessionStorage`** (in-session state only); **inline-style preserved** (one added button + a chevron, no Tailwind/CSS-in-JS); no direct browser→model call; no `corporate-reporting`/`reporting_*` change; `[[ARTIFACT]]`/SWAP BLOCK untouched.

---

## F-P7 — Visual-parity + SWA test plan (Pass-3 obligations, previewed)
- **No VA-registry edit** (F-P2): VA-T1 design intent unchanged; this is an additive collapse affordance on the existing Recents section.
- **SWA test plan (F-I5):** on `development` deploy, Walter: (1) the sidebar shows "Recents" with a chevron, list visible (default open, unchanged look); (2) click the chevron → the recents list folds away, label/chevron remain; (3) click again → list restores; (4) New chat / Search / nav / row rename+delete all unchanged. Screenshot of the collapsed + expanded Recents = Pass-3 Visual Acceptance Evidence.

## Mechanical lint
Run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission> --repo-root .`), verbatim:

```
__LINT__
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note
Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §2). Hard gates: CCT completeness (T20 — CCT-1 pastes the complete literal `SidebarProps`, no prop change), VA-id (T21 — no VA edit; VA-T1 unchanged design), contract (T22 — none), artifact presence (T25), GCR/Rule-Anchor (T1/T5). Substance: an additive `recentsExpanded` collapse affordance on the existing Recents section, classified under Golden Component Pack §5 as a Walter-directed VA-T1 deviation (default-open; no redesign); guardrails T26 (inline-style, no storage, no Tailwind). Verdict APPROVED or REJECTED only.
