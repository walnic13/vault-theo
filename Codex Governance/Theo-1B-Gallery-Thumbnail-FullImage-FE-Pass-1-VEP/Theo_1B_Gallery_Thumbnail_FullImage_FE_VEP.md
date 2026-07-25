# Theo 1B — FindImage Gallery Thumbnail Full-Image FE (show the whole image, no crop) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) to `development` and the Theo dev SWA serves it (Walter accepts). **Microstep:** the FindImage multi-image gallery renders each thumbnail cover-cropped into a fixed 150px band (`objectFit: "cover"`), so the thumbnail never shows the whole photo (Walter: the thumbnails should "resize the image so they fit into the thumbnail"). This VEP switches the gallery thumbnails to **natural height** (`height: "auto"`, no crop) so each image is shown whole at its true aspect ratio, and aligns the grid to the top (`alignItems: "start"`) so varying-height images sit cleanly. The tap-to-expand full-screen viewer (landed) is unchanged. Two-line style change in `ChatView.tsx`; no component/prop/backend/contract/schema change.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `a743569070caf12ca5a510ee1c3b7679a4fb0f88` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix; Pass-1 row = Full Baseline Grounding). Frontend sub-phases F-P1…F-P7 walked; the backend P/I/E track does not apply → `N/A`. The registered VA-T1 artifact (`frontend/theo-frontend-reference.jsx`) is grep'd this turn (no image gallery in the reference surface — the FindImage gallery is Vault-specific and unregistered; see G-1). The change is a pure **visual** re-sizing of the existing gallery thumbnail render (cover-crop → natural aspect), classified **VISUAL-AUTHORITY-DEVIATION** (Golden Pack §5) and anchored below; Walter (runtime-acceptance authority) requested it. No new component, prop, state, backend, or contract. The one proposed file was applied to `src` this turn and passes `npm run typecheck` (`tsc --noEmit`, exit 0), `eslint` (exit 0, **no warnings** on `ChatView.tsx`), and `npm run build` (vite; TheoSurface 299.40 kB / 87.03 kB gzip, exit 0); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>` / `git hash-object`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5; §4 matrix; §4B Registry; §6 T6/T21) | `Read`/`Grep` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 2 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 Allowed Deltas / DEVIATION) | `Grep` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 3 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 guardrails) | `Grep` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 4 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | cited (surface authority) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (chat surface; no gallery) | `Grep` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 7 | ACTIVE (modify) — `src/theo/components/ChatView.tsx` (gallery thumbnail render; baseline = the landed lightbox version) | `Read(full-region)` this turn | `822e3fd64d2b86ea9443904551c8a69bba18814c` |
| 8 | **PROPOSED** — `proposed-src/theo/components/ChatView.tsx` (content-addressed; the reviewed source) | authored + validated this turn | `35b07ab7af0af0b449a156ad24301aa4386d43b8` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`. No Tailwind/CSS-in-JS. No new backend/contract/schema/component/prop.

---

## Rule Anchor Table
| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Full Baseline Grounding" | GCR grounding mode (Pass 1 FE VEP) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Every structural/visual classification (EXACT, ALLOWED DELTA, DEVIATION, APPROVED, REJECTED, DEPLOYED, PROPOSED, NOT_IMPLEMENTED, VISUAL-AUTHORITY-MATCH, VISUAL-AUTHORITY-DEVIATION) MUST be backed by at least one Rule Anchor" | §F-P2 classification anchored |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A VA-id not registered in §4B is invalid as a citation" | §F-P2 cites only registered VA-T1 |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" | §F-P2 — thumbnail re-size = VISUAL-AUTHORITY-DEVIATION |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope. Each row locks three surfaces:" | §F-P5 CCT (1 row, full literal, no `any`) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`; 1A state is React/in-memory" | §F-P4 — no state/storage added (pure style) |

---

## F-P1 — Feature identification
**Microstep:** FindImage gallery thumbnails **show the whole image**. A tool-found image batch (`m.image.images: InlineImageItem[]`) renders in a grid; each thumbnail currently uses `width: "100%", height: 150, objectFit: "cover"` — the image is scaled to FILL a fixed 150px band and the overflow is cropped, so the thumbnail never shows the whole photo (worst on mobile's single column). This VEP:
1. **Thumbnail** — `multi` branch changes to `width: "100%", height: "auto"` (drop the fixed height + `objectFit: "cover"`), so each image renders whole at its natural aspect ratio, scaled to the grid-column width. (The single-image branch already used `height: "auto"` — unchanged.)
2. **Grid** — the gallery grid gains `alignItems: "start"` so now-variable-height images align to the top of their row rather than stretching, keeping the grid tidy.
3. **Stale comment** — the `ImageLightbox` header comment (landed with the tap-to-expand viewer) described the thumbnails as "cover-cropped for a tidy grid"; since this VEP removes that crop, the comment is updated to describe the now-uncropped thumbnails (the viewer opens a grid-scaled image large). Comment-only; no behavioural change.

**Out of scope:** the tap-to-expand full-screen viewer (landed, unchanged — still the full-res view); the video link-card thumbnail (a separate 160×90 `cover` thumb, unrelated to Walter's image report); the crop was the prior behaviour and is being removed by choice.

## F-P2 — UI Authority Reconciliation
| VA-id (registered §4B) | Reconciliation | Classification (anchored) |
| --- | --- | --- |
| VA-T1 (Theo chat message surface) | The gallery is not part of the registered reference surface (VA-T1 has no image gallery). The rest of the chat surface is untouched. | **VISUAL-AUTHORITY-MATCH** — no change to any registered surface region (FE Conformance §6) |
| FindImage gallery thumbnail render (deployed; no registered VA — see G-1) | The thumbnail changes from a cover-cropped 150px tile to a natural-aspect full image; the grid aligns items to the top. This is a visual change to the rendered surface, governed by Walter's request (runtime-acceptance authority, FE Conformance §23). | **VISUAL-AUTHORITY-DEVIATION** — anchored to Golden Pack §5 ("Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor"); Walter SWA screenshot = Visual Acceptance Evidence |

No Tailwind/CSS-in-JS conversion (prohibited DEVIATION — §5). Inline-style / `C` idiom preserved.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **No registered VA-id for the FindImage gallery.** §4B registers VA-T1…VA-T10; none covers the gallery (same gap disclosed in the landed lightbox VEP). | **PROCEED** — the change is classified VISUAL-AUTHORITY-DEVIATION anchored to Golden Pack §5; only the registered VA-T1 is cited (T21-safe). A VA-T11 registration Role-C for the gallery/viewer remains an optional post-acceptance follow-up. |
| **G-2** | **Desktop multi-column grid** now has variable-height images; a row's shorter image leaves whitespace below it (masonry not implemented). | **PROCEED (accepted)** — Walter chose whole-image thumbnails over uniform tiles; `alignItems: "start"` keeps it tidy; true masonry is out of scope. Mobile (single column) has no gaps. |
| **G-3** | **Standalone dev harness** renders no FindImage results (mock gateway). | **PROCEED** — harness-only; no gallery to render. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting`; no backend/contract/schema/component/prop change.

## F-P3 — Backend / contract grounding
- **No backend, contract, API Spec, or schema change.** The change is purely presentational CSS-in-inline-style on the existing gallery `<img>` and its grid container. The rendered data (`m.image.images: InlineImageItem[]`) and all types are unchanged. No gateway/model call (Governor §6.1 preserved).

## F-P4 — Component reference grounding
**PRIMARY REFERENCE:** the deployed gallery render in `src/theo/components/ChatView.tsx` (structural mirror = its current form; only two style properties change). No new component, no new state (Governor §6.3 — nothing added to storage or state; a pure style edit). `types.ts`/`useTheoState.ts`/gateway/`theoClient.ts`/the `ImageLightbox` component **unchanged**.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; the row: interface (full TS) + VA-id + contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `ChatView` (Theo surface; **ACTIVE**, modify) | `ChatViewProps` **UNCHANGED** (full literal locked in §F-P5.1). Delta = two inline-style properties in the gallery render plus one stale-comment fix: (a) the grid container gains `alignItems: "start"`; (b) the `multi` thumbnail `<img>` style changes from `{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, display: "block", border }` to `{ width: "100%", height: "auto", borderRadius: 8, display: "block", border }`; and (c) the `ImageLightbox` header comment is updated (it previously described the thumbnails as "cover-cropped") — comment-only, no code behaviour. No prop/state/handler/signature change. | VA-T1 (surface unchanged); gallery render (VISUAL-AUTHORITY-DEVIATION, §5) | None (renders existing `m.image.images: InlineImageItem[]`) | PROCEED |

**Infra:** no `vite.config`/dependency change. Single file touched: `ChatView.tsx` (2 lines).

## F-P5.1 — Locked interface literals (T20 — full literal CCT surfaces)
**`ChatViewProps`** (`src/theo/components/ChatView.tsx`) — full literal, **UNCHANGED** by this VEP (pasted per T20; the change is style + comment only, no prop change):
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
}
```
**`InlineImageItem`** (`src/theo/types.ts`) — UNCHANGED, the rendered element shape:
```typescript
export interface InlineImageItem { imageUrl: string; title?: string; source?: string; pageUrl?: string; license?: string; creator?: string }
```

## F-P6 — Repository & active-surface grounding
Target read this turn: `src/theo/components/ChatView.tsx` (baseline blob `822e3fd` @ HEAD `a743569` — the landed lightbox version). The single proposed file — `proposed-src/theo/components/ChatView.tsx`, content-addressed blob `35b07ab7af0af0b449a156ad24301aa4386d43b8` (the HEAD-independent currency anchor; verify via `git cat-file -p 35b07ab`; the reviewed-commit SHA is carried in the submission note, not restated here) — was applied to `src` this turn and reverted after validation (the package carries only `proposed-src/`). Guardrails: no browser→model call; no `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`. Validated: `tsc --noEmit` exit 0, `eslint` exit 0 (**no warnings** on `ChatView.tsx`), `vite build` exit 0 (TheoSurface 299.40 kB / 87.03 kB gzip).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present (G-1…G-3 PROCEED); CCT locked (1 ACTIVE modify row + §F-P5.1 full literal). No implementation begun — the one file was validated this turn (`tsc` + `eslint` exit 0 + `build` green, `src` reverted). On Codex APPROVAL, Pass 3 commits `ChatView.tsx` to `development` (the Theo dev SWA serves it; Walter accepts) → **gallery thumbnails show the whole image** (no crop; mobile no longer clips). Walter SWA acceptance (a screenshot of the gallery vs this CCT + acceptance note) = Visual Acceptance Evidence for the VISUAL-AUTHORITY-DEVIATION.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-Gallery-Thumbnail-FullImage-FE-Pass-1-VEP/Theo_1B_Gallery_Thumbnail_FullImage_FE_VEP.md" --repo-root .
PASS
```

*End of FindImage Gallery Thumbnail Full-Image FE Pass-1 Frontend VEP (plan only).*
