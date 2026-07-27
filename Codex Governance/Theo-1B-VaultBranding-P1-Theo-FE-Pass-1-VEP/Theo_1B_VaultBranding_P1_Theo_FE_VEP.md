# Theo 1B — Vault branding Phase 1 (Theo chat surface): retire the Claude burst — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) to `development` and the Theo dev SWA serves it (Walter accepts). **Microstep:** replace the Claude-style `Burst` mark (a coral 12-spoke asterisk, ported verbatim from VA-T1 L39–57) with the Vault logo (Spiral of Theodorus) across Theo's chat surface, and de-mess the thinking row. Four call-sites: the greeting hero, the assistant message avatar, the pre-reply row, and the sidebar workspace lockup. A new **`VaultMark`** component supplies the static / build-once logo (byte-verbatim `icon.svg` wedges, transparent); the active "thinking" state reuses the already-landed **`SpiralAssemble`** (breathing loop). **Thinking-row de-mess:** the breathing mark moves from an inline element inside `StatusLine` (landed in the prior VEP `cb9f42c`) into the **avatar gutter** — the in-progress assistant avatar *is* the breathing mark, resting avatars are the static logo, and `StatusLine` returns to verb + dots. The processing model (verb rotator, bouncing dots, `AgentActivity` "Thinking… · tokens" panel, `ThinkingPanel`) is **unchanged**. `Burst` is retired from `icons.tsx`. Four files; no backend / contract / schema change.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `f731cf2837c47ea5f20d6ddd66cd2f4792b18686` (vault-theo, `development`, base at authoring; the commit that CONTAINS this package is given in the Codex note)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix; Pass-1 row = Full Baseline Grounding). Frontend sub-phases F-P1…F-P7 walked; the backend P/I/E track does not apply → `N/A`. This is Phase 1 of the branding reconciliation (Walter-approved plan): retire the `Burst` asterisk (VA-T1-verbatim) in favour of the Vault logo across Theo's chat surface. NEW `VaultMark.tsx` (static + `building` one-time-assemble variants; byte-verbatim `icon.svg` wedges, transparent, reduced-motion-safe). `ChatView.tsx`: greeting hero `Burst 40` → `VaultMark size=40 variant="building"`; assistant avatar `Burst 22` → `{loading && i === last ? <SpiralAssemble 22/> : <VaultMark 22/>}` (breathing while that message generates, static at rest); pre-reply row `Burst 22` → `SpiralAssemble 22`; and the inline `SpiralAssemble` added to `StatusLine` in `cb9f42c` is **removed** so `StatusLine` returns to verb + dots (the breathing mark now lives in the avatar gutter — the thinking-row de-mess). `Sidebar.tsx`: lockup `Burst 20` → `VaultMark 20`. `icons.tsx`: `Burst()` + its now-unused `C` import retired. The two intentional status surfaces (verb rotator + dots; `AgentActivity`; `ThinkingPanel`) and `ChatViewProps`/`SidebarProps` are unchanged. Proposed files applied to `src` this turn and pass `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`, exit 0) + `eslint` (exit 0, no warnings on the four files) + `npm run build` (vite; TheoSurface 325.10 kB / 95.54 kB gzip, exit 0); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>` / `git hash-object`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5; §4 matrix; §4B; §6 classification) | `Read`/`Grep` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 2 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 Allowed Deltas / DEVIATION) | `Grep` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 3 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6.3 no browser storage; §2 plan-only) | `Grep` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 4 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | cited (surface authority) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (the Theo surface: chat surface + the Sidebar at L297–328; source of the retired `Burst` L39–57) | `Grep` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 7 | **Logo reference** — deployed `vault-origin/public/icon.svg` (wedge bytes inlined verbatim into `VaultMark` + `SpiralAssemble`) | `Read` this turn (cross-repo) | Origin blob `61fe5d5ca6d3f6cf53e2a3b539f7a9a74d159d5a` (verify: `git -C <vault-origin> cat-file -p 61fe5d5c…`) |
| 8 | ACTIVE (modify) — `src/theo/components/ChatView.tsx` | `Read`/`Edit` this turn | `549e9c936a46204b6616a6fd14310389fab81bf1` |
| 9 | ACTIVE (modify) — `src/theo/components/Sidebar.tsx` | `Read`/`Edit` this turn | `cccb13c0e259ed4f89e1502619e82b583ca14aed` |
| 10 | ACTIVE (modify) — `src/theo/components/icons.tsx` | `Read`/`Edit` this turn | `6b29147e1589c1bf067a1113ac2e04fe5b131764` |
| 11 | **PROPOSED (NEW)** — `proposed-src/theo/components/VaultMark.tsx` | authored + validated this turn | `807b8dea7a5052b584c26f1c640168ea177978a5` |
| 12 | **PROPOSED** — `proposed-src/theo/components/ChatView.tsx` | authored + validated this turn | `5634aaf0f380712cff8bb8e04c720a51438d3892` |
| 13 | **PROPOSED** — `proposed-src/theo/components/Sidebar.tsx` | authored + validated this turn | `f046a36ee3712fa04a7e780d75217e6e0d2c068b` |
| 14 | **PROPOSED** — `proposed-src/theo/components/icons.tsx` | authored + validated this turn | `d77a0fa33152845573b6f755a3ad69a609c7e928` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. **No `localStorage`/`sessionStorage`** (Governor §6.3). No Tailwind/CSS-in-JS. No new backend/contract/schema. No new dependency.

---

## Rule Anchor Table
| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Full Baseline Grounding" | GCR grounding mode (Pass 1 FE VEP) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Every structural/visual classification (EXACT, ALLOWED DELTA, DEVIATION, APPROVED, REJECTED, DEPLOYED, PROPOSED, NOT_IMPLEMENTED, VISUAL-AUTHORITY-MATCH, VISUAL-AUTHORITY-DEVIATION) MUST be backed by at least one Rule Anchor" | §F-P2 classifications anchored |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A VA-id not registered in §4B is invalid as a citation" | §F-P2 cites only registered VA-T1 |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" | §F-P2 — retiring Burst for the Vault mark = VISUAL-AUTHORITY-DEVIATION |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope. Each row locks three surfaces:" | §F-P5 CCT (4 rows, full literals, no `any`) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`; 1A state is React/in-memory" | §F-P4 — pure render + timers, no storage |

---

## F-P1 — Feature identification
**Microstep:** retire the Claude-style `Burst` asterisk and unify Theo's chat surface on the Vault logo (Spiral of Theodorus), with a clean single-mark thinking row.

1. **NEW `VaultMark.tsx`** — the static / build-once identity mark. Byte-verbatim `icon.svg` wedges (sand tile omitted → transparent), rendered in the logo's own local-coordinate viewBox (computed from the path vertices). `variant="static"` (default) renders the finished logo; `variant="building"` assembles seed→out **once** on mount (reveal order = reversed document index via `data-o`) and then holds — no loop. `prefers-reduced-motion: reduce` holds the finished mark. Static markup, no user input / network / storage.
2. **`ChatView.tsx`** — four edits: (a) import `VaultMark`, drop the now-unused `Burst`; (b) greeting hero `Burst 40` → `VaultMark size={40} variant="building"`; (c) assistant avatar `Burst 22` → `{loading && i === messages.length - 1 ? <SpiralAssemble size={22} /> : <VaultMark size={22} />}` — the in-progress assistant avatar **breathes**, resting avatars are the **static** logo; (d) pre-reply row `Burst 22` → `SpiralAssemble 22`; (e) **remove** the inline `<SpiralAssemble size={20} />` that the prior VEP (`cb9f42c`) added to `StatusLine`, so `StatusLine` returns to **verb + dots**.
3. **`Sidebar.tsx`** — the workspace lockup `Burst 20` → `VaultMark 20` (before "{workspaceName} · {productName}").
4. **`icons.tsx`** — retire `Burst()` and its now-unused `import { C }`.

**Thinking-row de-mess (the intent):** before this VEP the in-progress row stacked the `Burst` avatar **and** the inline `SpiralAssemble` in `StatusLine` **and** the dots — two marks of the same family. After: one Vault mark in the avatar gutter (breathing while working → static when done), with `StatusLine` showing just the rotating verb + dots — mirroring Claude's single-leading-mark placement.

**Out of scope / preserved exactly (the processing model):** the verb rotator (`STATUS_WORDS` + `setInterval`), the three bouncing dots, the `AgentActivity` "Thinking… · tokens" panel, and the collapsible `ThinkingPanel` are **unchanged**. `SpiralMark.tsx` (cold-open splash), `ChatViewProps`, `SidebarProps`, and the gateway are unchanged. No Origin-shell change (that is Phase 2).

## F-P2 — UI Authority Reconciliation
| VA-id (registered §4B) | Reconciliation | Classification (anchored) |
| --- | --- | --- |
| VA-T1 (Theo chat message surface) | The `Burst` mark is VA-T1-verbatim (reference L39–57). This VEP replaces it, at every chat-surface call-site, with the Vault logo (static/build) or the breathing mark (thinking). Layout, spacing, message structure, verb rotator, dots, and the thinking/activity panels are otherwise unchanged. | **VISUAL-AUTHORITY-DEVIATION** — anchored to Golden Pack §5; the retired element is VA-T1 L39–57; reference brand = deployed `vault-origin/public/icon.svg`; Walter (runtime-acceptance authority) approved the Vault-logo direction (design review + the approved reconciliation plan) and accepts on the dev SWA = Visual Acceptance Evidence. A Role-C update registering the Vault mark in the VA-T1 reference is recommended as a follow-up (see G-1). |

No Tailwind/CSS-in-JS. No `localStorage`/`sessionStorage`.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **VA-T1 reference still shows `Burst`.** The registered reference (`frontend/theo-frontend-reference.jsx` L39–57) still depicts the asterisk; this VEP deviates from it deliberately. | **PROCEED** — classified VISUAL-AUTHORITY-DEVIATION with Walter (runtime-acceptance authority) accepting; a Role-C update to the reference registering the Vault mark is recommended as a separate follow-up so future grounding matches. Not a blocker (Golden Pack §5 permits an accepted deviation). |
| **G-2** | **Avatar shape differs by state** — resting avatar = logo (`VaultMark`), in-progress avatar = logo + nautilus tail (`SpiralAssemble`). | **PROCEED** — intentional: the mark grows the breathing nautilus while working and settles to the resting logo when the answer lands (a state transition, gutter-consistent). Both are the same byte-verbatim logo core. |
| **G-3** | **Modifies a just-landed change** — removes the inline `SpiralAssemble` that `cb9f42c` added to `StatusLine`. | **PROCEED** — this is the approved de-mess (relocate the animation to the avatar gutter); the prior VEP's mark is not lost, only moved. Processing-model logic unchanged. |
| **G-4** | **`dangerouslySetInnerHTML`** inlines the static SVG in `VaultMark` (as `SpiralMark`/`SpiralAssemble` do). | **PROCEED** — compile-time constant assembled from byte-verbatim wedge bytes; no user/network input (no XSS surface). |
| **G-5** | **`Burst` retired from `icons.tsx`.** | **PROCEED** — no remaining importer (grep: only `ChatView`/`Sidebar`, both swapped); the unused `C` import is removed with it to keep eslint clean. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting`; no backend/contract/schema change; no new dependency.

## F-P3 — Backend / contract grounding
- **No backend, contract, API Spec, or schema change.** Pure presentational rebrand of the chat-surface marks. No gateway/model call (Governor §6.1 preserved); all marks are static inlined SVG (+ local timers for the build/breathe animations).

## F-P4 — Component reference grounding
**PRIMARY REFERENCE (pattern):** the landed `SpiralMark.tsx` (byte-verbatim `icon.svg`, `dangerouslySetInnerHTML`, reduced-motion guard) and `SpiralAssemble.tsx` (seed→out reveal via `data-o`, timer loop) — `VaultMark` follows the same idioms (static/build-once, no loop). The brand reference is the deployed Vault logo (`vault-origin/public/icon.svg`). No new state (Governor §6.3 — a ref + `useEffect` timers for `building`, no storage). `SpiralMark`/`SpiralAssemble`/`ChatViewProps`/`SidebarProps`/gateway **unchanged**.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; each row = interface (full TS) + VA-id + contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `VaultMark` (Theo surface; **NEW**) | `export function VaultMark({ size = 22, variant = "static" }: { size?: number; variant?: "static" | "building" })` (full literal from source, line 46; returns a `JSX.Element` via inferred return type). Props: `size` (px, default 22) and `variant` (`"static"` \| `"building"`, default `"static"`). Internal `useRef<HTMLSpanElement>` + `useEffect` (build-once timers on `variant === "building"`). Renders an `aria-hidden` span with inlined SVG. | Vault logo mark = **VISUAL-AUTHORITY-DEVIATION** (Golden Pack §5); brand ref = deployed `icon.svg` | None (static SVG + local timers) | PROCEED |
| TC-2 | `ChatView` (Theo surface; **ACTIVE**, modify) | `ChatViewProps` **UNCHANGED** (full literal in §F-P5.1). Delta = import swap (`Burst`→`VaultMark`); hero `VaultMark building`; avatar conditional `SpiralAssemble`/`VaultMark`; pre-reply `SpiralAssemble`; remove inline `SpiralAssemble` from `StatusLine`. No prop/state/handler change; verb rotator, dots, `AgentActivity`, `ThinkingPanel` untouched. | VA-T1 marks → DEVIATION; layout MATCH | None (pure UI) | PROCEED |
| TC-3 | `Sidebar` (Theo surface; **ACTIVE**, modify) | `SidebarProps` **UNCHANGED** (full literal in §F-P5.1). Delta = import swap (`Burst`→`VaultMark`) + lockup mark `Burst 20` → `VaultMark 20`. No prop change. | VA-T1 (the Sidebar is VA-T1 — `Sidebar.tsx` header: "Sidebar — VA-T1 L297–328"); lockup mark → **VISUAL-AUTHORITY-DEVIATION** (Golden Pack §5) | None | PROCEED |
| TC-4 | `icons` (Theo surface; **ACTIVE**, modify) | Module of icon components; no exported interface. Delta = **remove** `export function Burst(...)` and its now-unused `import { C } from "../theme";`. All other `Ic*` exports unchanged. | n/a (mark removed) | None | PROCEED |

**Infra:** no `vite.config`/dependency change. `SpiralMark.tsx`/`SpiralAssemble.tsx`/`useTheoState.ts`/`TheoMain.tsx`/gateway **unchanged**. Files touched: `VaultMark.tsx` (NEW), `ChatView.tsx`, `Sidebar.tsx`, `icons.tsx`.

## F-P5.1 — Locked interface literals (T20 — full literal CCT surfaces)
**`VaultMark`** signature (`src/theo/components/VaultMark.tsx`, line 46) — full literal from source:
```typescript
export function VaultMark({ size = 22, variant = "static" }: { size?: number; variant?: "static" | "building" })
```

**`ChatViewProps`** (`src/theo/components/ChatView.tsx`) — full literal, **UNCHANGED** by this VEP:
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

**`SidebarProps`** (`src/theo/components/Sidebar.tsx`) — full literal, **UNCHANGED** by this VEP:
```typescript
export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  view: View;
  onNavigate: (v: View) => void;
  nav: NavItem[];
  search: string;
  onSearch: (s: string) => void;
  recents: ConversationSummary[];
  projects: Project[];
  onToggleStar: (id: string, starred: boolean) => void;
  onAddToProject: (id: string, projectId: string) => void;
  onSelectRecent: (id: string) => void;
  onRenameRecent: (id: string, title: string) => void;   // B4f
  onDeleteRecent: (id: string) => void;                   // B4f
  onNewChat: () => void;
  workspaceName: string;
  productName: string;
  // Pass C (hosted-nav fit): when hosted in the Origin 1/10 slot, the aside fills the slot
  // (width:100%) instead of the fixed 270/58 standalone rail — VA-T2 §3A.2 / VA-T3 §4. Set by
  // TheoSurface only in the portaled branch; absent/false standalone (VA-T1 270 rail preserved).
  fluid?: boolean;
}
```

## F-P6 — Validation (this turn, against `src`, reverted)
- `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`) → **exit 0**.
- `npx eslint VaultMark.tsx ChatView.tsx Sidebar.tsx icons.tsx` → **exit 0** (no warnings).
- `npm run build` (vite) → **exit 0**; `__federation_expose_TheoSurface` 325.10 kB (gzip 95.54 kB).
- `grep Burst src/theo/components/` → only the header comment in `icons.tsx`; **no remaining `Burst` usage**.
- Reduced-motion verified in `VaultMark` (early `opacity:1` hold; `building` timers skipped).
- After validation, `src` reverted to HEAD; the package carries the proposed source only under `proposed-src/`.

## F-P7 — Landing plan (Pass 3, on APPROVAL)
On Codex APPROVAL: copy the four `proposed-src/theo/components/*.tsx` (`VaultMark.tsx` NEW; `ChatView.tsx`, `Sidebar.tsx`, `icons.tsx` modified) into `src/theo/components/`; re-verify `tsc`/`eslint`/`build` green; commit to `development`; the Theo dev SWA serves it; Walter accepts on the dev SWA (Visual Acceptance Evidence for the DEVIATION). Phase 2 (Origin shell `Sparkles` → Vault mark) and the recommended VA-T1 Role-C reference update follow as separate packages.
