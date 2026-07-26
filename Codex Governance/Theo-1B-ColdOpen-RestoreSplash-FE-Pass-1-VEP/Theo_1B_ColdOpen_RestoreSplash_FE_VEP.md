# Theo 1B — Cold-open restore splash (kill the new-chat greeting flash) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) to `development` and the Theo dev SWA serves it (Walter accepts). **Microstep:** on a cold app open, Theo mounts with `conversationId = null` and immediately renders the **new-chat greeting**, then `loadRecents` settles and a restore effect reopens the last chat — so the user sees the greeting **flash** then flip to their previous chat (Walter, mobile: "it goes to the main theo screen for a moment then flips to the previous chat — janky"). This VEP holds a **branded splash** (warm sand `#E9D6B6` + the Spiral of Theodorus — matching the deployed PWA boot splash the user already sees on open) over the surface from mount until the restore decision resolves, so the app opens **splash → last chat** (or greeting when there is genuinely nothing to restore) with no greeting flash. No backend/contract/schema change.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `69e4b04205afcb3ca4aa3bb9f81f8e0e2b1a54db` (vault-theo, `development`; main == development)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix; Pass-1 row = Full Baseline Grounding). Frontend sub-phases F-P1…F-P7 walked; the backend P/I/E track does not apply → `N/A`. The registered VA-T1 artifact (`frontend/theo-frontend-reference.jsx`) is grep'd this turn (the reference chat surface has no cold-open splash — this is a Vault-specific PWA affordance, not a Claude-for-Teams replica surface). The splash reproduces the **deployed vault-origin PWA boot splash** (`background_color #E9D6B6` + `public/icon.svg` — the Spiral of Theodorus), so the new `SpiralMark` SVG is **byte-verbatim** from the deployed `vault-origin/public/icon.svg` (Origin blob `61fe5d5c`), inlined (not an asset URL) so it renders identically standalone and federated; the splash body is classified **VISUAL-AUTHORITY-DEVIATION** (new-in-Theo surface, faithful reproduction of the deployed Origin splash) anchored below, with Walter (runtime-acceptance authority) requesting it + supplying the reference screenshot. The four proposed files were applied to `src` this turn and pass `npm run typecheck` (`tsc --noEmit`, exit 0) + `eslint` (exit 0; one **pre-existing** `react-hooks/exhaustive-deps` *warning* on the restore effect in `useTheoState.ts`, unchanged in nature by this VEP) + `npm run build` (vite; TheoSurface 306.78 kB / 90.39 kB gzip, exit 0); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>` / `git hash-object`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5; §4 matrix; §4B Registry; §6 T6/T21) | `Read`/`Grep` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 2 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 Allowed Deltas / DEVIATION / GREENFIELD) | `Read`/`Grep` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 3 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6.3 no browser storage; state) | `Grep` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 4 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | cited (surface authority) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (chat surface; no splash) | `Grep` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 7 | **Splash byte-source** — deployed `vault-origin/public/icon.svg` (PWA splash icon; `background_color #E9D6B6`) — the SVG inlined byte-verbatim into `SpiralMark` | `Read(full)` this turn | Origin `61fe5d5ca6d3f6cf53e2a3b539f7a9a74d159d5a` |
| 8 | ACTIVE (modify — state owner) — `src/theo/useTheoState.ts` (restore gate) | `Read`/`Edit` this turn | `d1b35acd67db70f5aa0aff1be18a429adf40f6b3` |
| 9 | ACTIVE (modify) — `src/theo/components/ChatView.tsx` (splash render + prop) | `Read`/`Edit` this turn | `35b07ab7af0af0b449a156ad24301aa4386d43b8` |
| 10 | ACTIVE (modify) — `src/theo/components/TheoMain.tsx` (passes `restoring`) | `Read`/`Edit` this turn | `99ec4149ac3d7925657604ca439a2a1301b1af1e` |
| 11 | **PROPOSED (NEW)** — `proposed-src/theo/components/SpiralMark.tsx` | authored + validated this turn | `404f9463022646c8f21af6cf72f39c76778bddd8` |
| 12 | **PROPOSED** — `proposed-src/theo/components/ChatView.tsx` | authored + validated this turn | `311a900e56f5372e4d0de418da405df94b57f2d8` |
| 13 | **PROPOSED** — `proposed-src/theo/components/TheoMain.tsx` | authored + validated this turn | `230e025745084099a3a3486b4e34d53658466d4f` |
| 14 | **PROPOSED** — `proposed-src/theo/useTheoState.ts` | authored + validated this turn | `a6f1daed6c99446776ae1942592d00eba272c0be` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. **No `localStorage`/`sessionStorage`** (the restore ordering stays server-sourced; the gate is React state only — Governor §6.3). No Tailwind/CSS-in-JS. No new backend/contract/schema.

---

## Rule Anchor Table
| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Full Baseline Grounding" | GCR grounding mode (Pass 1 FE VEP) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Every structural/visual classification (EXACT, ALLOWED DELTA, DEVIATION, APPROVED, REJECTED, DEPLOYED, PROPOSED, NOT_IMPLEMENTED, VISUAL-AUTHORITY-MATCH, VISUAL-AUTHORITY-DEVIATION) MUST be backed by at least one Rule Anchor" | §F-P2 classifications each anchored |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A VA-id not registered in §4B is invalid as a citation" | §F-P2 cites only registered VA-T1; the splash is DEVIATION (§5) not a VA-id claim |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" | §F-P2 — the restore splash = VISUAL-AUTHORITY-DEVIATION |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "When the Component Contract Table includes NEW/GREENFIELD components (no deployed/substrate analog), the package states `PRIMARY REFERENCE: GREENFIELD`" | §F-P4 — `SpiralMark` reference = the deployed Origin splash (not greenfield: byte-verbatim substrate) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope. Each row locks three surfaces:" | §F-P5 CCT (4 rows, full literals, no `any`) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`; 1A state is React/in-memory" | §F-P4 — restore gate is React state; no browser storage |

---

## F-P1 — Feature identification
**Microstep:** cold-open restore splash. Today `useTheoState` mounts with `conversationId = null` / `messages = []`, so `ChatView` renders the new-chat greeting; after the gateway token wires, `loadRecents()` settles and a restore effect calls `selectRecent(recentsList[0].id)` to reopen the last-touched chat — the visible **greeting → chat** flip. This VEP:
1. **Gate (`useTheoState`)** — add `restoring` (init `true`) + `recentsLoaded` (init `false`). `loadRecents` sets `recentsLoaded` in a `finally`. The restore effect waits for `recentsLoaded`, then: if already in a chat / composing, or there is nothing to restore (`recentsList.length === 0`) → `setRestoring(false)` (show current/greeting); else `selectRecent(recentsList[0].id).finally(() => setRestoring(false))` (restore, then drop the gate → land on the chat). Return `restoring`.
2. **Splash (`SpiralMark` + `ChatView`)** — a NEW `SpiralMark` inlines the deployed Origin PWA splash icon (`icon.svg`, byte-verbatim). `ChatView` gains `restoring?: boolean`; while true it renders `RestoringSplash` — a full-cover `#E9D6B6` overlay with the centered `SpiralMark` — so the greeting never shows during restore.
3. **Wire (`TheoMain`)** — pass `restoring={t.restoring}` to `ChatView`.

**Out of scope:** the Origin host boot splash (already deployed — this only continues its look inside Theo); the restore ordering logic (unchanged — still server-sourced last-touched, no persistence); any backend.

## F-P2 — UI Authority Reconciliation
| VA-id (registered §4B) | Reconciliation | Classification (anchored) |
| --- | --- | --- |
| VA-T1 (Theo chat message surface) | The splash is a transient full-cover overlay shown only during the cold-open restore window; once `restoring` clears, the VA-T1 surface (greeting or restored chat) renders exactly as today — no persistent change to the chat surface. | **VISUAL-AUTHORITY-MATCH** (steady-state surface unchanged; FE Conformance §6) |
| Deployed Origin PWA boot splash (`background_color #E9D6B6` + `icon.svg`) | `RestoringSplash` reproduces the deployed splash's look (warm sand + Spiral of Theodorus), and `SpiralMark`'s SVG is **byte-verbatim** from the deployed `vault-origin/public/icon.svg`. The new in-Theo surface is the visual delta. | **VISUAL-AUTHORITY-DEVIATION** — anchored to Golden Pack §5; the reference is the deployed Origin splash (byte-verbatim substrate); Walter (runtime-acceptance authority) requested it + supplied the reference screenshot; his SWA acceptance = Visual Acceptance Evidence |
| State reconstruction (`useTheoState` restore gate) | Adds `restoring`/`recentsLoaded` React state + resolves the gate at the existing restore decision points. Behavioural (when the gate drops), not a new visual on the steady-state surface. | **ALLOWED DELTA** (state wiring; Golden Pack §5; no browser storage — Governor §6.3) |

No Tailwind/CSS-in-JS conversion. No `localStorage`/`sessionStorage`.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **No registered VA-id for a Theo cold-open splash.** §4B has no splash entry. | **PROCEED** — classified VISUAL-AUTHORITY-DEVIATION anchored to Golden Pack §5, reproducing the **deployed** Origin splash (byte-verbatim icon); only the registered VA-T1 is cited (T21-safe). A VA registration Role-C could follow post-acceptance. |
| **G-2** | **Standalone dev harness** (mock gateway) resolves `recentsLoaded` fast with empty recents → brief splash then greeting. | **PROCEED** — harness-only; the gate self-clears (empty recents → `setRestoring(false)`), so no hang; a brief splash is acceptable. |
| **G-3** | **`loadRecents` failure** would otherwise hang the splash. | **PROCEED (handled)** — `recentsLoaded` is set in `loadRecents`'s `finally` (success or failure) and `selectRecent(...).finally(...)` clears the gate on a failed restore, so the splash always resolves. |
| **G-4** | **Pre-existing `exhaustive-deps` warning** on the restore effect (`selectRecent` dep) is unchanged in nature (a warning, not an error; eslint exit 0). | **PROCEED (disclosed)** — not introduced here; the effect already omitted `selectRecent`; left as-is. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting`; no backend/contract/schema change.

## F-P3 — Backend / contract grounding
- **No backend, contract, API Spec, or schema change.** The restore ordering already comes from `theo_list_conversations` (server last-touched) re-sorted client-side; this VEP only gates the UI on the existing async settle. No gateway/model call added (Governor §6.1 preserved). `SpiralMark` is a static inlined SVG (no asset fetch).

## F-P4 — Component reference grounding
**PRIMARY REFERENCE:** for `SpiralMark`, the **deployed `vault-origin/public/icon.svg`** (Origin blob `61fe5d5c`) — the SVG is spliced byte-verbatim (verified this turn) so the mark is pixel-identical to the boot splash; `#E9D6B6` is the deployed manifest `background_color`. For `ChatView`/`TheoMain`/`useTheoState`, the PRIMARY REFERENCE is their own deployed form (structural mirror). **State owner:** `useTheoState` — the restore gate (`restoring`/`recentsLoaded`) is component-local React state (Governor §6.3 — no browser storage). No new dependency; `gateway`/`theoClient`/`types.ts` unchanged.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; every row: interface (full TS) + VA-id + contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `SpiralMark` (Theo surface; **NEW**) | `export function SpiralMark({ size = 108 }: { size?: number })` — renders the inlined Spiral-of-Theodorus SVG (byte-verbatim from Origin `icon.svg`) via `dangerouslySetInnerHTML` on a static string constant (no user input). No `any`. | Deployed Origin PWA splash (VISUAL-AUTHORITY-DEVIATION, §5) | None (static SVG) | PROCEED |
| TC-2 | `ChatView` (Theo surface; **ACTIVE**, modify) | `ChatViewProps` gains `restoring?: boolean;` (additive optional; after `sigmaMode`) — full literal locked in §F-P5.1. Delta: import `SpiralMark`; new module-level `RestoringSplash` (full-cover `#E9D6B6` overlay + centered `SpiralMark`); render `{restoring && <RestoringSplash />}` in the surface root. No other prop change. | VA-T1 (steady-state unchanged); splash = DEVIATION | None | PROCEED |
| TC-3 | `TheoMain` (Theo surface; **ACTIVE**, modify) | `TheoMainProps` **UNCHANGED** — adds one attribute `restoring={t.restoring}` to the `<ChatView>` element (reads the new `useTheoState` field). No interface change. | VA-T1 (unchanged) | `useTheoState.restoring` | PROCEED |
| TC-4 | `useTheoState` (Theo surface; **ACTIVE**, modify — state owner) | Adds `const [recentsLoaded, setRecentsLoaded] = useState(false);` + `const [restoring, setRestoring] = useState(true);`; `loadRecents` gains `finally { setRecentsLoaded(true); }`; the restore effect gates on `recentsLoaded` and resolves `restoring` (drop on in-chat/composing/empty, else `selectRecent(...).finally(() => setRestoring(false))`); returns `restoring`. No signature/handler-name change; no browser storage. | VA-T1 (chat surface; unchanged render) | `theo_list_conversations` (existing; ordering unchanged) | PROCEED |

**Infra:** no `vite.config`/dependency change. `gateway.live.ts`/`gateway.mock.ts`/`theoClient.ts`/`types.ts`/media components **unchanged**.

## F-P5.1 — Locked interface literals (T20 — full literal CCT surfaces)
**`ChatViewProps`** (`src/theo/components/ChatView.tsx`) — full literal AFTER this VEP (the only change is the additive `restoring?` member):
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
**`SpiralMark`** (NEW, `src/theo/components/SpiralMark.tsx`) — full literal signature:
```typescript
export function SpiralMark({ size = 108 }: { size?: number })
```
**`TheoMainProps`** (`src/theo/components/TheoMain.tsx`) — UNCHANGED (the change is one JSX attribute on `<ChatView>`, not a prop):
```typescript
export interface TheoMainProps {
  t: ReturnType<typeof useTheoState>;
  mode: "full" | "panel"; // "full" = 9/10 landing; "panel" = in-app right-docked panel (Origin host)
  suppressNarrowHeader?: boolean;
}
```

## F-P6 — Repository & active-surface grounding
Targets read this turn (proposed-src content-addressed blobs — HEAD-independent currency anchors; the reviewed-commit SHA is carried in the submission note): `SpiralMark.tsx`=`404f9463` (NEW), `ChatView.tsx`=`311a900e`, `TheoMain.tsx`=`230e0257`, `useTheoState.ts`=`a6f1daed`; baselines @ HEAD `69e4b04` — `ChatView`=`35b07ab7`, `TheoMain`=`99ec4149`, `useTheoState`=`d1b35acd`. The four files were applied to `src` this turn and reverted after validation (package carries only `proposed-src/`). Guardrails: gateway abstraction preserved; no browser→model call; **no `localStorage`/`sessionStorage`**; no Tailwind; no `reporting_*`/`corporate-reporting`. Validated: `tsc --noEmit` exit 0, `eslint` exit 0 (one pre-existing `exhaustive-deps` warning only), `vite build` exit 0 (TheoSurface 306.78 kB / 90.39 kB gzip).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present (G-1…G-4 PROCEED); CCT locked (1 NEW + 3 ACTIVE modify rows + §F-P5.1 full literals). No implementation begun — but the four files were validated this turn (`tsc` + `eslint` exit 0 + `build` green, `src` reverted). On Codex APPROVAL, Pass 3 commits the four files to `development` (the Theo dev SWA serves it; Walter accepts) → **the app opens on the branded splash, then lands directly on the last chat** (no greeting flash). Walter SWA acceptance (open the app on mobile; observe splash → last chat, no greeting flash) = Visual Acceptance Evidence for the VISUAL-AUTHORITY-DEVIATION.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-ColdOpen-RestoreSplash-FE-Pass-1-VEP/Theo_1B_ColdOpen_RestoreSplash_FE_VEP.md" --repo-root .
PASS
```

*End of Cold-open restore splash FE Pass-1 Frontend VEP (plan only).*
