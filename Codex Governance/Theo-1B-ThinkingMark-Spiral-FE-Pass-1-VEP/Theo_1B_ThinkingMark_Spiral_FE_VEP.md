# Theo 1B — Thinking-status mark: animated Vault spiral (nautilus) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) to `development` and the Theo dev SWA serves it (Walter accepts). **Microstep:** the streaming "thinking" affordance in `ChatView` (`StatusLine`) currently shows the rotating verb (`Percolating…`, `Ruminating…`, …) plus three grey bouncing dots. This VEP adds a small **animated Vault mark** to the LEFT of the verb: the full-colour Spiral of Theodorus logo **plus a continued nautilus tail**, animated as a **breathing loop** (builds layer by layer seed→out, holds, unbuilds outer→seed in reverse, rebuilds — no fade). The logo wedges are byte-verbatim from the deployed `vault-origin/public/icon.svg`; the tail is generated (extra Theodorus triangles grown from the logo's real outer edge in its own local frame, so the logo stays exact and only the tail is synthesised). Two files: **NEW** `SpiralAssemble.tsx` (the mark), **MODIFY** `ChatView.tsx` (one import + one JSX element inside `StatusLine`). The two intentional status surfaces are otherwise **untouched**: `StatusLine`'s verb-rotator + dots stay, and `AgentActivity` ("Thinking… · tokens") + `ThinkingPanel` are unchanged. No backend / contract / schema change.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `06d863f0c6388b1e8edbfabac8415be75390ec62` (vault-theo, `development`, base at authoring; the commit that CONTAINS this package is given in the Codex note)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix; Pass-1 row = Full Baseline Grounding). Frontend sub-phases F-P1…F-P6 walked; the backend P/I/E track does not apply → `N/A`. This adds Theo's "thinking" mark (an animated Vault Spiral-of-Theodorus + continued nautilus tail) to the `StatusLine` verb row in `ChatView.tsx`; the mark itself is a new byte-verbatim-logo component (`SpiralAssemble.tsx`), so the animated status surface is a **VISUAL-AUTHORITY-DEVIATION** (a new decorative affordance not in the static VA-T1 reference) anchored below, with Walter (runtime-acceptance authority) accepting on the dev SWA. The change is additive: `SpiralAssemble` is NEW; `ChatView.tsx` gains one `import` and one `<SpiralAssemble size={20} />` element as the first child of the existing `StatusLine` inline-flex row — no prop/state/handler/`ChatViewProps` change, and the verb rotator, the three bouncing dots, `AgentActivity`, and `ThinkingPanel` are all left exactly as designed. The proposed files were applied to `src` this turn and pass `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`, exit 0) + `eslint` (exit 0, no warnings on `SpiralAssemble.tsx`/`ChatView.tsx`) + `npm run build` (vite; TheoSurface 316.35 kB / 91.69 kB gzip, exit 0); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>` / `git hash-object`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5; §4 matrix; §4B; §6 classification) | `Read`/`Grep` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 2 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 Allowed Deltas / DEVIATION) | `Grep` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 3 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6.3 no browser storage; §2 plan-only) | `Grep` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 4 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | cited (surface authority) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (chat message surface) | `Grep` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 7 | **Logo reference** — deployed `vault-origin/public/icon.svg` (the Spiral of Theodorus; wedge bytes inlined verbatim into `SpiralAssemble`) | `Read` this turn (cross-repo, vault-origin) | Origin blob `61fe5d5ca6d3f6cf53e2a3b539f7a9a74d159d5a` (verify: `git -C <vault-origin> cat-file -p 61fe5d5c…`) |
| 8 | ACTIVE (modify) — `src/theo/components/ChatView.tsx` (`StatusLine`) | `Read`/`Edit` this turn | `8d51b0e30c817d93fc9fc6cf3fcbb20c8527aadb` |
| 9 | **PROPOSED** — `proposed-src/theo/components/ChatView.tsx` | authored + validated this turn | `549e9c936a46204b6616a6fd14310389fab81bf1` |
| 10 | **PROPOSED (NEW)** — `proposed-src/theo/components/SpiralAssemble.tsx` | authored + validated this turn | `b460afa1a5fc438e95fbf6fbc280a9a3be9cc218` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. **No `localStorage`/`sessionStorage`** (Governor §6.3). No Tailwind/CSS-in-JS. No new backend/contract/schema. No new dependency (`react`/`react-dom` already present).

---

## Rule Anchor Table
| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Full Baseline Grounding" | GCR grounding mode (Pass 1 FE VEP) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Every structural/visual classification (EXACT, ALLOWED DELTA, DEVIATION, APPROVED, REJECTED, DEPLOYED, PROPOSED, NOT_IMPLEMENTED, VISUAL-AUTHORITY-MATCH, VISUAL-AUTHORITY-DEVIATION) MUST be backed by at least one Rule Anchor" | §F-P2 classification anchored |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A VA-id not registered in §4B is invalid as a citation" | §F-P2 cites only registered VA-T1 |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" | §F-P2 — the animated thinking mark = VISUAL-AUTHORITY-DEVIATION |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope. Each row locks three surfaces:" | §F-P5 CCT (2 rows, full literals, no `any`) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`; 1A state is React/in-memory" | §F-P4 — pure render + timers, no storage |

---

## F-P1 — Feature identification
**Microstep:** Theo's streaming "thinking" mark. Today, while a turn is loading and before the first token lands, `ChatView`'s `StatusLine` shows a rotating verb (`STATUS_WORDS`: `Percolating…`, `Noodling…`, `Ruminating…`, …) followed by three grey bouncing dots (`vo-bounce`). This VEP adds a small **animated Vault mark** immediately to the LEFT of the verb:

1. **New component `SpiralAssemble.tsx`** — renders the full-colour Vault logo (Spiral of Theodorus, wedge paths **byte-verbatim** from the deployed `vault-origin/public/icon.svg`, sand tile omitted) **plus a continued nautilus tail** (generated Theodorus triangles grown from the logo's real outer edge — shared apex `O≈(88.94,68.06)`, unit `U=108.84/√17`, leading edge angle `85.7°` — in the logo's own local coordinate frame). It animates as a **breathing loop**: build layer by layer seed→out (reveal order = reversed document index via `data-o`), hold, then unbuild outer→seed in reverse, then rebuild — no fade. `prefers-reduced-motion: reduce` holds the finished mark (no animation). Static markup, no user input, no network, no storage.
2. **`ChatView.tsx` (`StatusLine`)** — add `import { SpiralAssemble } from "./SpiralAssemble";` and render `<SpiralAssemble size={20} />` as the **first child** of the existing `StatusLine` inline-flex `<span>`, before the verb `<span>`.

**Out of scope / untouched (design preserved on purpose):** the verb rotator (`STATUS_WORDS` + `setInterval`) and the three bouncing dots stay exactly as they are; `AgentActivity` (the separate "Thinking… · tokens" panel with the coral spinner) is unchanged; `ThinkingPanel` (the collapsible extended-thinking text) is unchanged; `SpiralMark.tsx` (the cold-open splash mark) is unchanged; `ChatViewProps` is unchanged; no gateway/model/contract change.

## F-P2 — UI Authority Reconciliation
| VA-id (registered §4B) | Reconciliation | Classification (anchored) |
| --- | --- | --- |
| VA-T1 (Theo chat message surface) | The steady-state chat message surface (greeting / user + assistant bubbles / cited text) is unchanged. The mark appears only inside the transient `StatusLine` shown while a turn is loading before the first token; it adds no element to the message bubbles or composer. | **VISUAL-AUTHORITY-MATCH** (steady-state surface unchanged; FE Conformance §6) |
| Animated thinking mark (new affordance) | A new small decorative mark is added to the transient thinking row — a rendered-surface visual change not present in the static VA-T1 reference. It reuses the byte-verbatim deployed Vault logo (brand-consistent) plus a generated tail; motion is reduced-motion-safe. | **VISUAL-AUTHORITY-DEVIATION** — anchored to Golden Pack §5; reference = the deployed Vault logo (`vault-origin/public/icon.svg`); Walter (runtime-acceptance authority) approved the mark/animation in design review and accepts on the dev SWA = Visual Acceptance Evidence |

No Tailwind/CSS-in-JS. No `localStorage`/`sessionStorage`.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Generated tail vs hand-drawn logo.** The nautilus tail is synthesised (Theodorus triangles from the logo's real outer edge), not part of the authored `icon.svg`. | **PROCEED** — the logo wedges themselves are byte-verbatim from the deployed `icon.svg` (brand-exact); the tail is an additive decorative continuation in the logo's own frame, accepted by Walter (runtime-acceptance authority) in design review. No brand-mark alteration. |
| **G-2** | **Timer-driven opacity animation** (`setTimeout` build/unbuild loop) mutating inline `style.opacity` on the SVG wedges via a ref, inside `useEffect`. | **PROCEED** — pure in-component render + timers, cleaned up on unmount (`clearTimeout`); no storage/network/state escape (Governor §6.3 unaffected). Mirrors the existing landed `SpiralMark`/dots animation approach. |
| **G-3** | **`prefers-reduced-motion`.** | **PROCEED** — honoured: when `reduce` is set, the mark renders fully built with no animation. |
| **G-4** | **`dangerouslySetInnerHTML`** used to inline the static SVG markup (as the landed `SpiralMark` does). | **PROCEED** — the markup is a compile-time constant assembled from the byte-verbatim logo string + deterministically generated tail polygons; no user/network input flows into it (no XSS surface). |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting`; no backend/contract/schema change; no new dependency.

## F-P3 — Backend / contract grounding
- **No backend, contract, API Spec, or schema change.** Pure presentational addition to the transient thinking affordance. No gateway/model call (Governor §6.1 preserved); the mark is a static inlined SVG animated by local timers. `StatusLine` remains purely presentational (it already ran a `setInterval` verb rotator; this adds a sibling decorative mark).

## F-P4 — Component reference grounding
**PRIMARY REFERENCE (pattern):** the landed `SpiralMark.tsx` cold-open mark and the landed `StatusLine` in `ChatView.tsx` — `SpiralAssemble` follows `SpiralMark`'s technique (byte-verbatim `icon.svg` wedges, `dangerouslySetInnerHTML`, reduced-motion guard) and adds the seed→out reveal + breathing loop; the wiring mirrors how `StatusLine` already composes inline children. The mark's look reference is the deployed Vault logo (`vault-origin/public/icon.svg`). No new state (Governor §6.3 — timers + a ref, no storage). `SpiralMark`/`AgentActivity`/`ThinkingPanel`/`ChatViewProps`/gateway **unchanged**.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; each row = interface (full TS) + VA-id + contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `SpiralAssemble` (Theo surface; **NEW**) | `export function SpiralAssemble({ size = 22 }: { size?: number })` (full literal from source, line 80; returns a `JSX.Element` via inferred return type) — single optional numeric prop `size` (px; default 22, wired at 20 from `StatusLine`). No other props/state; internal `useRef<HTMLSpanElement>` + `useEffect` timer loop. Renders a `role="status" aria-label="Thinking"` span with inlined SVG. | Animated thinking mark = **VISUAL-AUTHORITY-DEVIATION** (Golden Pack §5); brand ref = deployed `icon.svg` | None (static SVG + local timers; no backend/contract) | PROCEED |
| TC-2 | `ChatView` (Theo surface; **ACTIVE**, modify) | `ChatViewProps` **UNCHANGED** (full literal locked in §F-P5.1). Delta = (a) add `import { SpiralAssemble } from "./SpiralAssemble";`; (b) inside the existing `StatusLine` component's returned inline-flex `<span>`, add `<SpiralAssemble size={20} />` as the first child, before the verb `<span>`. No prop/state/handler change; verb rotator, dots, `AgentActivity`, `ThinkingPanel` untouched. | VA-T1 steady-state unchanged (MATCH); the thinking-row mark = DEVIATION | None (pure UI) | PROCEED |

**Infra:** no `vite.config`/dependency change (`react`/`react-dom` already present). `SpiralMark.tsx`/`useTheoState.ts`/`TheoMain.tsx`/gateway **unchanged**. Files touched: `SpiralAssemble.tsx` (NEW), `ChatView.tsx` (modify) — exactly two, both carried in `proposed-src/`.

## F-P5.1 — Locked interface literals (T20 — full literal CCT surfaces)
**`ChatViewProps`** (`src/theo/components/ChatView.tsx`) — full literal, **UNCHANGED** by this VEP (the change is one `import` + one JSX element inside the internal `StatusLine` function; no prop change):
```typescript
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
  queuedText: string | null;        // message-queue: the pending next message (shown as a cancelable chip)
  onCancelQueued: () => void;
  onAddFiles: (files: FileList | File[]) => void;
  onAddPastedText: (text: string) => boolean;
  onRemoveAttachment: (localId: string) => void;
  chatProject: Project | null;
  assistantName: string;
  greeting: string;
  starters: string[];
  renderAssistant: (content: string) => ReactNode;
  // VA-T8 voice: dictation (composer mic) + read-aloud (per assistant reply). Shown only when the
  // live backend is wired (voiceAvailable); state keyed by message index for read-aloud.
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
  // VA-T7: fund label for the review-agent activity panel (from the conversation's app_context; the
  // panel falls back to a generic label when absent). Only sigma review turns carry reasoning/tools.
  reviewFund?: string;
  // Sigma review context armed → review-focused landing (opener names the fund; starters carry the
  // review action pills). Fail-closed: false for generic Theo / a Sigma dock with no review.
  reviewMode?: boolean;
  // In Sigma (with or without a review armed) → app-level review-assistant landing (#5 v2). Distinct
  // from reviewMode (a specific fund) and generic Theo. false everywhere outside Sigma.
  sigmaMode?: boolean;
  // Cold-open restore gate: true from mount until useTheoState resolves whether to reopen the last
  // chat. While true, the branded splash (warm sand + Spiral of Theodorus) covers the surface so the
  // app opens splash → last chat instead of flashing the new-chat greeting first. Absent → false.
  restoring?: boolean;
}
```

**`StatusLine` delta** (the only change to `ChatView.tsx` render) — the mark is added as the first inline child; everything else is byte-identical:
```tsx
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9, color: C.ink3, fontFamily: SANS, fontSize: 14 }}>
      <SpiralAssemble size={20} />
      <span style={{ fontStyle: "italic" }}>{STATUS_WORDS[i]}…</span>
      <span style={{ display: "inline-flex", gap: 4 }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: C.ink3, display: "inline-block", animation: `vo-bounce 1.2s ${d * 0.16}s infinite ease-in-out` }} />)}</span>
    </span>
```

## F-P6 — Validation (this turn, against `src`, reverted)
- `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`) → **exit 0**.
- `npx eslint src/theo/components/SpiralAssemble.tsx src/theo/components/ChatView.tsx` → **exit 0** (no warnings).
- `npm run build` (vite) → **exit 0**; `__federation_expose_TheoSurface` 316.35 kB (gzip 91.69 kB); 322 modules transformed.
- Reduced-motion path verified in source (early `return` holding all wedges at `opacity: 1`).
- After validation, `src` was reverted to HEAD; the package carries the proposed source only under `proposed-src/`.

## F-P7 — Landing plan (Pass 3, on APPROVAL)
On Codex APPROVAL: copy `proposed-src/theo/components/SpiralAssemble.tsx` → `src/theo/components/SpiralAssemble.tsx` (NEW) and `proposed-src/theo/components/ChatView.tsx` → `src/theo/components/ChatView.tsx`; re-verify `tsc`/`eslint`/`build` green; commit to `development`; the Theo dev SWA serves it; Walter accepts on the dev SWA (Visual Acceptance Evidence for the DEVIATION). (No file deletions: `SpiralLine.tsx` was an untracked scratch file, absent at the reviewed commit — nothing to remove.)
