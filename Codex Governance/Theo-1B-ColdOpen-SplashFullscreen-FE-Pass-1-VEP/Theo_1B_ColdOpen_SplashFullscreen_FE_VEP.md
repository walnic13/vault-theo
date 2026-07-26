# Theo 1B — Cold-open splash: full-viewport parity with the PWA boot splash — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) to `development` and the Theo dev SWA serves it (Walter accepts). **Microstep:** the landed cold-open `RestoringSplash` renders `position: absolute; inset: 0` **inside `ChatView`**, so on mobile it is clipped to the ChatView box — a thin top strip (the app top bar / safe-area) stays uncovered, and the spiral (fixed 112px, centred in the smaller box) looks smaller than the OS/Origin PWA boot splash (Walter: "a thin white strip at the top remains … the Origin splash covers the entire screen and the logo is ~30% larger"). This VEP makes the splash **full-viewport**: it is **portaled to `document.body`** with `position: fixed; inset: 0` (covers the entire screen, over the top bar / behind the safe-area strip) and the spiral is sized to the manifest splash's on-screen **proportion (~36% of viewport width, capped)** so it matches the boot-splash logo. Same warm sand `#E9D6B6` + same byte-verbatim spiral. One file (`ChatView.tsx`); no backend/contract/schema change.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `116b4395cfe8da5bfb6ae0e7ad0f94aeb7cfe28a` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix; Pass-1 row = Full Baseline Grounding). Frontend sub-phases F-P1…F-P7 walked; the backend P/I/E track does not apply → `N/A`. This refines the just-landed cold-open splash (commit `116b439`) so it reaches full-viewport parity with the **deployed vault-origin PWA boot splash** (`background_color #E9D6B6` + `public/icon.svg`, Origin blob `61fe5d5c`) — the splash body remains a **VISUAL-AUTHORITY-DEVIATION** (faithful reproduction of the deployed Origin splash) anchored below, with Walter (runtime-acceptance authority) reporting the mismatch + the target. The change is `ChatView.tsx`-only: the `RestoringSplash` overlay goes from `position: absolute` (ChatView-box-clipped) to a `document.body` **portal** with `position: fixed; inset: 0` + high z-index (full-screen), and the spiral from fixed `112` to `min(round(innerWidth × 0.36), 200)` (manifest proportion). `SpiralMark`/`useTheoState`/`TheoMain` **unchanged**. The proposed file was applied to `src` this turn and passes `npm run typecheck` (`tsc --noEmit`, exit 0) + `eslint` (exit 0, **no warnings** on `ChatView.tsx`) + `npm run build` (vite; TheoSurface 306.96 kB / 90.46 kB gzip, exit 0); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>` / `git hash-object`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5; §4 matrix; §4B; §6 T6/T21) | `Read`/`Grep` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 2 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 Allowed Deltas / DEVIATION) | `Grep` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 3 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6.3 no browser storage) | `Grep` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 4 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | cited (surface authority) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (chat surface; no splash) | `Grep` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 7 | **Splash reference** — deployed `vault-origin/public/icon.svg` + manifest `background_color #E9D6B6` (the full-screen boot splash being matched) | cited (deployed splash) | Origin `61fe5d5ca6d3f6cf53e2a3b539f7a9a74d159d5a` |
| 8 | ACTIVE (modify) — `src/theo/components/ChatView.tsx` (`RestoringSplash`) | `Read`/`Edit` this turn | `311a900e56f5372e4d0de418da405df94b57f2d8` |
| 9 | **PROPOSED** — `proposed-src/theo/components/ChatView.tsx` | authored + validated this turn | `8d51b0e30c817d93fc9fc6cf3fcbb20c8527aadb` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. **No `localStorage`/`sessionStorage`** (Governor §6.3). No Tailwind/CSS-in-JS. No new backend/contract/schema.

---

## Rule Anchor Table
| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Full Baseline Grounding" | GCR grounding mode (Pass 1 FE VEP) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Every structural/visual classification (EXACT, ALLOWED DELTA, DEVIATION, APPROVED, REJECTED, DEPLOYED, PROPOSED, NOT_IMPLEMENTED, VISUAL-AUTHORITY-MATCH, VISUAL-AUTHORITY-DEVIATION) MUST be backed by at least one Rule Anchor" | §F-P2 classification anchored |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A VA-id not registered in §4B is invalid as a citation" | §F-P2 cites only registered VA-T1 |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" | §F-P2 — the full-viewport splash = VISUAL-AUTHORITY-DEVIATION |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope. Each row locks three surfaces:" | §F-P5 CCT (1 row, full literal, no `any`) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`; 1A state is React/in-memory" | §F-P4 — portal render, no storage |

---

## F-P1 — Feature identification
**Microstep:** cold-open splash **full-viewport parity**. The landed `RestoringSplash` is `position: absolute; inset: 0` inside `ChatView`, so it is clipped to the ChatView box — on mobile the app top bar / safe-area strip stays uncovered, and the fixed-112px spiral (centred in that smaller box) reads smaller than the OS/Origin PWA boot splash. This VEP:
1. **Full-screen** — render `RestoringSplash` via `createPortal(…, document.body)` with `position: fixed; inset: 0` + a high z-index, so it covers the entire viewport (over the top bar, behind the safe-area strip) exactly like the manifest boot splash. `typeof document === "undefined"` guard (SSR/no-DOM → renders nothing).
2. **Logo size** — spiral size = `min(round(window.innerWidth × 0.36), 200)` (the boot splash's on-screen proportion, ~36% of viewport width measured from the reference screenshot), capped for large screens — so it visually matches the boot-splash logo rather than a fixed 112px.

**Out of scope:** the restore gate logic (`useTheoState`, unchanged); `SpiralMark` (unchanged — same byte-verbatim icon); the OS status bar itself (drawn by the UA per `theme-color`, outside web paint).

## F-P2 — UI Authority Reconciliation
| VA-id (registered §4B) | Reconciliation | Classification (anchored) |
| --- | --- | --- |
| VA-T1 (Theo chat message surface) | The splash is still a transient overlay shown only during the cold-open restore window; the steady-state VA-T1 surface (greeting / restored chat) is unchanged. Portaling to `document.body` does not alter the chat surface DOM. | **VISUAL-AUTHORITY-MATCH** (steady-state surface unchanged; FE Conformance §6) |
| Deployed Origin PWA boot splash (`#E9D6B6` + `icon.svg`) | The splash now covers the full viewport at the manifest's logo proportion — closer parity with the deployed boot splash than the landed absolute/112px version. Same warm sand, same byte-verbatim spiral. | **VISUAL-AUTHORITY-DEVIATION** — anchored to Golden Pack §5; reference = the deployed Origin splash; Walter (runtime-acceptance authority) reported the mismatch + target; his SWA acceptance = Visual Acceptance Evidence |

No Tailwind/CSS-in-JS. No `localStorage`/`sessionStorage`.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Portal to `document.body`.** The splash renders outside the Theo mount so a `position: fixed` overlay is not clipped/trapped by a host mount container's stacking/overflow. | **PROCEED** — a body portal + `position: fixed` is the standard full-screen-overlay technique for a federated remote (Theo shares the host document); a very high z-index sits it above host chrome. No storage/network; purely a render target (Governor §6.3 unaffected). |
| **G-2** | **OS status bar** (drawn by the UA per Origin's `theme-color`) is outside web paint, so the web splash cannot recolor the physical status-bar pixels. | **PROCEED (out of scope)** — the reported white strip is app top-bar / safe-area (web-paintable), which the full-viewport fixed splash now covers; the UA status bar follows `theme-color` and is unchanged by any web overlay. |
| **G-3** | **Viewport-proportional size read at render** (`window.innerWidth`). | **PROCEED** — read once when the transient splash mounts (no resize during the brief cold-open); SSR-guarded (`typeof window`). Matches the manifest's proportional logo. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting`; no backend/contract/schema change.

## F-P3 — Backend / contract grounding
- **No backend, contract, API Spec, or schema change.** Pure presentational change to the restore-splash overlay (render target + positioning + logo size). No gateway/model call (Governor §6.1 preserved). `SpiralMark` remains a static inlined SVG.

## F-P4 — Component reference grounding
**PRIMARY REFERENCE:** the just-landed `RestoringSplash` in `src/theo/components/ChatView.tsx` (structural mirror = its current form; the overlay div's positioning + the spiral size change, plus the `createPortal` wrapper). The splash-look reference is the deployed Origin boot splash (`#E9D6B6` + `icon.svg`). No new state (Governor §6.3 — the portal is a render target, not storage). `SpiralMark`/`useTheoState`/`TheoMain`/gateway **unchanged**.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; the row: interface (full TS) + VA-id + contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `ChatView` (Theo surface; **ACTIVE**, modify) | `ChatViewProps` **UNCHANGED** (`restoring?: boolean` already present; full literal locked in §F-P5.1). Delta = (a) add `import { createPortal } from "react-dom";`; (b) `RestoringSplash` returns `createPortal(<div style={{ position: "fixed", inset: 0, zIndex: 2147483000, background: "#E9D6B6", … }}>…</div>, document.body)` with a `typeof document === "undefined"` guard; (c) spiral size `112` → `min(round(window.innerWidth × 0.36), 200)`. No prop/state/handler change. | VA-T1 (steady-state unchanged); splash = DEVIATION | None (static SVG) | PROCEED |

**Infra:** no `vite.config`/dependency change (`react-dom` is already a project dependency). `SpiralMark.tsx`/`useTheoState.ts`/`TheoMain.tsx`/gateway **unchanged**. Single file touched: `ChatView.tsx`.

## F-P5.1 — Locked interface literals (T20 — full literal CCT surfaces)
**`ChatViewProps`** (`src/theo/components/ChatView.tsx`) — full literal, **UNCHANGED** by this VEP (the change is inside `RestoringSplash`, no prop change; `restoring?` was added by the prior landed VEP):
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

## F-P6 — Repository & active-surface grounding
Target read this turn: `src/theo/components/ChatView.tsx` (baseline blob `311a900e` @ HEAD `116b439` — the landed cold-open splash). The single proposed file — `proposed-src/theo/components/ChatView.tsx`, content-addressed blob `8d51b0e30c817d93fc9fc6cf3fcbb20c8527aadb` (HEAD-independent currency anchor; verify via `git cat-file -p 8d51b0e`; the reviewed-commit SHA is carried in the submission note) — was applied to `src` this turn and reverted after validation (package carries only `proposed-src/`). Guardrails: gateway abstraction preserved; no browser→model call; **no `localStorage`/`sessionStorage`**; no Tailwind; no `reporting_*`/`corporate-reporting`. Validated: `tsc --noEmit` exit 0, `eslint` exit 0 (**no warnings** on `ChatView.tsx`), `vite build` exit 0 (TheoSurface 306.96 kB / 90.46 kB gzip).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present (G-1…G-3 PROCEED); CCT locked (1 ACTIVE modify row + §F-P5.1 full literal). No implementation begun — the one file was validated this turn (`tsc` + `eslint` exit 0 + `build` green, `src` reverted). On Codex APPROVAL, Pass 3 commits `ChatView.tsx` to `development` (the Theo dev SWA serves it; Walter accepts) → **the cold-open splash covers the full screen with the boot-splash logo size** (no top strip; matches the OS/Origin splash). Walter SWA acceptance (open the app on mobile; the splash covers the whole screen, logo matches, then lands on the last chat) = Visual Acceptance Evidence for the VISUAL-AUTHORITY-DEVIATION.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-ColdOpen-SplashFullscreen-FE-Pass-1-VEP/Theo_1B_ColdOpen_SplashFullscreen_FE_VEP.md" --repo-root .
PASS
```

*End of Cold-open splash full-viewport parity FE Pass-1 Frontend VEP (plan only).*
