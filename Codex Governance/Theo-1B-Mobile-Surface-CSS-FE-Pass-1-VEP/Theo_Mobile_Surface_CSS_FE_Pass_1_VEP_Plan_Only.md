# Theo Narrow-Viewport Surface CSS (Mobile) — FE Pass 1 VEP (Plan Only)

> Theo FE regime. Pass 1 Verified Evidence Pack, plan-only. Author = Claude Code. Reviewer = **Codex**. Authority = Walter (2026-07-08 — "make Theo mobile friendly"). **Package 2b** — the Theo-surface narrow-viewport adaptation, gated by the landed **VA-T6** (`7c67d12`). A CSS-only change to `src/theo/TheoSurface.tsx` (the injected STYLE_BLOCK + the standalone-root class marker). Fixes the phone bug where Theo's nav is blank inside the Origin drawer, and makes the artifact panel a full-screen overlay + manage actions tap-reachable on touch.

## Grounding Conformance Receipt
Turn Type: Pass 1 — Frontend Verified Evidence Pack (plan-only)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Repo / HEAD: vault-theo `development` @ `7c67d12af4b4b23050b939d9ca796ad5a65263a9`

Documents grounded this turn (blob SHAs @ HEAD, git-verifiable):
- `governance/THEO_1A_FRONTEND_HANDOVER.md` §4.1 (VA-T6 authority) — `097c2f2417872533374334a5cc031eb1ec583c60`
- `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4B (VA-T6 registered) — `07e8dabbccc1d0394a493c6a6b358e38253e4f4b`
- `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` §5 (visual-authority-deviation rule) — `0035a1d9fed103d07bf420b957c3727ec47fcc6b`
- `src/theo/TheoSurface.tsx` (TARGET — STYLE_BLOCK + standalone root) — `982787b792507524f1c4c97562c55423f43198ea`
- Backend baseline (Theo API Spec / Postgres Schema): N/A — client-only CSS; no gateway/contract/endpoint dependency.

## Rule Anchor Table

| file | section | quote |
| ---- | ------- | ----- |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "Theo Narrow-Viewport (Mobile) Hosted Surface" |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §4.1 | "hide rule applies only to the standalone dev harness, never to the hosted nav" |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §4.1 | "presents as a full-screen overlay over the chat on narrow viewports" |
| src/theo/TheoSurface.tsx | STYLE_BLOCK | ".vo-aside{ display:none !important; }" |
| src/theo/TheoSurface.tsx | STYLE_BLOCK | ".vo-actions { opacity: 0; transition: opacity .12s; }" |

## Architecture & boundary reconciliation

The driving vision is the landed Origin authority VO1 §2B/§10B/§12 (VA-F1, corporate-reporting @ `279875e`); its Theo-side mirror is now registered as **VA-T6** (`THEO_1A_FRONTEND_HANDOVER.md` §4.1) at vault-theo `7c67d12`. Per Golden Component Pack §5 (anchor 1), the narrow-viewport change alters the rendered surface and is therefore a **VISUAL-AUTHORITY-DEVIATION** from VA-T1, authorized by VA-T6 (anchors 2–4). The wide-viewport VA-T1 surface is reproduced unchanged (the deviation is gated entirely inside `@media` blocks). Boundary: one file, CSS-only; no component split, no inline-style→Tailwind conversion (that would be a prohibited DEVIATION per Golden Pack §5), no prop/state/handler change, no gateway/contract touch. This is a viewport adaptation, not a redesign.

## Gap Disclosure

**NO-GAPS.** The change is fully authorized by landed VA-T6; the wide surface is untouched; the Origin shell half (drawer host, single-column, dvh) is already shipped (Pkg 1 + 1.1). The citation popover is already viewport-clamped (`CitedText.tsx` collision handling) so it needs no change; on touch the citation link opens the source directly. No downstream trigger.

## Component Contract Table

COMPONENT CONTRACT TABLE
Microstep: Theo Narrow-Viewport Surface CSS (Theo mobile Pkg 2b)

| # | Component | Prop interface | VA-id citation | Contract dependency |
|---|-----------|----------------|----------------|---------------------|
| 1 | `TheoSurface` (`src/theo/TheoSurface.tsx`) | UNCHANGED — `interface TheoSurfaceProps { appContext?: AppContext; navSlot?: HTMLElement \| null; mainSlot?: HTMLElement \| null; getAccessToken?: () => Promise<string \| null>; }` (no prop added/removed/retyped) | VA-T6 §4.1 (narrow-viewport hosted behavior — the deviation authority) + VA-T1 (wide surface, reproduced unchanged) | None — client-only CSS; no gateway/contract/endpoint |

## Plan body (for Pass 3) — two CSS-only edits to `src/theo/TheoSurface.tsx`

**Edit 1 — STYLE_BLOCK narrow-viewport rules (current line 38).** Replace the single `@media (max-width: 720px){ … }` rule with an aligned, correctly-scoped pair:

- **Before:** `@media (max-width: 720px){ .vo-aside{ display:none !important; } .vo-panel{ position:absolute !important; inset:0 !important; width:100% !important; flex:none !important; z-index:20; } }`
- **After:** `@media (max-width: 767.98px){ .vo-standalone .vo-aside{ display:none !important; } .vo-panel{ position:absolute !important; inset:0 !important; width:100% !important; min-width:0 !important; flex:none !important; z-index:20; } }` followed by `@media (hover: none){ .vo-actions{ opacity:1 !important; } }`

Changes: (a) breakpoint `720`→`767.98px` to align with the Origin shell breakpoint (no 720–768 seam); (b) `.vo-aside`→`.vo-standalone .vo-aside` so the nav-hide applies ONLY to the standalone dev harness, never the hosted nav portaled into Origin's drawer (fixes the blank-Theo-nav bug — anchor 3); (c) add `min-width:0 !important` so the full-screen artifact overlay does not overflow a ~375px viewport (the `.vo-panel` `minWidth:380` inline is otherwise retained); (d) add `@media (hover: none){ .vo-actions{ opacity:1 } }` so hover-revealed manage actions (`.vo-actions`, anchor 6) are tap-reachable on touch input (VA-T6 touch-first affordances).

**Edit 2 — standalone-root class marker (current line 108).** Add `className="vo-standalone"` to the standalone-layout root `<div>` (the `if (navSlot && mainSlot)` hosted branch has no such wrapper, so the scoped `.vo-standalone .vo-aside` rule cannot match the hosted nav). Style object unchanged.

**Boundary.** One file; STYLE_BLOCK string + one className. No change to the hosted portal branch logic, TheoMain, ArtifactPanel, Sidebar, or any prop/state. Wide surface byte-unchanged.

**Pass-3 plan.** `npm run typecheck` + `npm run build` clean; Component Structural Mirror classifying the STYLE_BLOCK region as VISUAL-AUTHORITY-DEVIATION (VA-T6, anchored) and all other regions EXACT; SWA test plan (hosted, in Origin dev SWA at ~375px): (1) open the Origin drawer → Theo nav (Chats/Projects/Artifacts/Customize, search, recents) is VISIBLE, not blank; (2) open an artifact → full-screen overlay over the chat, no horizontal overflow; (3) a recents row → rename/delete affordances are visible/tap-reachable without hover; (4) desktop-width regression → the VA-T1 surface is unchanged (rail, 46% artifact pane, hover-reveal all intact).
