# Theo 1B — FindImage Gallery Lightbox FE (tap a thumbnail → full-image viewer) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) to `development` and the Theo dev SWA serves it (Walter accepts). **Microstep:** a FindImage image gallery currently renders cover-cropped thumbnails; on a narrow (mobile) viewport the single-column grid clips each photo to a 150px band, so the full image can't be seen (Walter report: "a photo of Chipper Jones … each photo is cut off"). This VEP keeps the tidy cropped grid and makes each thumbnail **tap-to-expand** into a full-screen in-app viewer (`objectFit: contain`, whole frame, caption + "Open original" link). Single-file change to `ChatView.tsx`; mirrors the **deployed VA-T10 dialog idiom** (`AddToChatSheet`). No backend/contract/schema change.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `935eef1ab01a6d7d1d4810988962730eeca78c50` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix; §87 Pass-1 row = Full Baseline Grounding). Frontend sub-phases F-P1…F-P7 walked; the backend P/I/E track does not apply → `N/A`. The registered VA-T1 artifact (`frontend/theo-frontend-reference.jsx`) is grep'd this turn (the reference chat surface has no image-gallery / no lightbox — this affordance is Vault-specific, not a Claude-for-Teams replica surface). The **primary reference is the deployed `AddToChatSheet` dialog** (the registered **VA-T10** idiom) inside the same `ChatView.tsx`; the new centered full-image viewer is the visual delta, classified **VISUAL-AUTHORITY-DEVIATION** (Golden Pack §5) and anchored below. No new backend/contract: the viewer consumes the existing `InlineImageItem` shape already rendered by the gallery (from `event: vault_image`). The one proposed file was applied to `src` this turn and passes `npm run typecheck` (`tsc --noEmit`, exit 0), `eslint` (exit 0, **no warnings** on `ChatView.tsx`), and `npm run build` (vite; TheoSurface 299.40 kB / 87.03 kB gzip, exit 0); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>` / `git hash-object`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5; §4 matrix; §4B Registry; §6 T6/T21/T26) | `Read`/`Grep` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 2 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 Allowed Deltas / DEVIATION / GREENFIELD) | `Grep` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 3 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 CCT; §6.1 gateway, §6.3 no browser storage) | `Grep` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 4 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | cited (surface authority) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (chat surface; no gallery/lightbox) | `Grep` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 7 | ACTIVE (modify) — `src/theo/components/ChatView.tsx` (gallery render + `AddToChatSheet` primary reference, same file) | `Read(full-region)` this turn | `760cef70c522fdf44799d02eb8730b5d85986709` |
| 8 | **Consumed type** — `src/theo/types.ts` (`InlineImageItem`, unchanged) | `Grep` this turn | `bc2654bb2ce6b4dacb26e48e5bef3d57448a645b` |
| 9 | **PROPOSED** — `proposed-src/theo/components/ChatView.tsx` (content-addressed; the reviewed source) | authored + validated this turn | `822e3fd64d2b86ea9443904551c8a69bba18814c` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`. No Tailwind/CSS-in-JS. No new backend/contract/schema.

---

## Rule Anchor Table
| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Full Baseline Grounding" | GCR grounding mode (Pass 1 FE VEP) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Every structural/visual classification (EXACT, ALLOWED DELTA, DEVIATION, APPROVED, REJECTED, DEPLOYED, PROPOSED, NOT_IMPLEMENTED, VISUAL-AUTHORITY-MATCH, VISUAL-AUTHORITY-DEVIATION) MUST be backed by at least one Rule Anchor" | §F-P2 classifications each anchored |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A VA-id not registered in §4B is invalid as a citation" | §F-P2/§F-P5 cite only registered VA-T1 + VA-T10 |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" | §F-P2 — the full-image viewer = VISUAL-AUTHORITY-DEVIATION |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope. Each row locks three surfaces:" | §F-P5 CCT (2 rows, full literals, no `any`) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`; 1A state is React/in-memory" | §F-P4 — viewer state is a single React `useState` |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "never a direct browser→Anthropic/Foundry call" | §F-P3 — no model call; pure render of existing data |

---

## F-P1 — Feature identification
**Microstep:** FindImage gallery **lightbox**. A tool-found image batch (`event: vault_image` → `m.image.images: InlineImageItem[]`) renders as a cover-cropped thumbnail grid. On narrow viewports the grid collapses to one column and each thumbnail is clipped to a fixed 150px band (`objectFit: "cover"`), so the full photo is not visible. This VEP:
1. **Keeps** the cropped thumbnail grid unchanged (the tidy layout Walter chose to retain).
2. **Adds** a full-screen in-app viewer: tapping any thumbnail opens the whole image (`objectFit: contain`), with caption (title · source · creator · license) and an "Open original ↗" link; dismiss via backdrop tap, ✕ button, or Esc.
3. The thumbnail wrapper changes from `<a href target="_blank">` (opened a new browser tab) to a `<button>` that opens the in-app viewer; the external link is preserved **inside** the viewer.

**Out of scope:** the video render (unchanged — Walter's report is images only); the thumbnail crop itself (retained by choice); persistence (media already persists + reloads — separate landed feature).

## F-P2 — UI Authority Reconciliation
| VA-id (registered §4B) | Reconciliation | Classification (anchored) |
| --- | --- | --- |
| VA-T1 (Theo chat message surface) | The viewer is a `position: fixed` overlay above the chat surface; the chat pixels beneath are unchanged, and the thumbnail grid render is byte-identical (same cover crop). | **VISUAL-AUTHORITY-MATCH** — surface beneath + thumbnails unchanged (FE Conformance §6; Golden Pack §5 AD-visual: no rendered-surface change to existing regions) |
| VA-T10 (Theo "Add to chat" Attachment Sheet — the registered dialog idiom) | The viewer **mirrors the deployed `AddToChatSheet` dialog idiom**: `role="dialog"` + `aria-modal` + translucent backdrop + tap/✕ dismiss + `IcClose` + `env(safe-area-inset-*)` padding + the `vt-fade-in` keyframe. Same inline-style / `C`+`SANS` idiom (no Tailwind, no browser storage). | **EXACT** (dialog idiom = structural mirror of the deployed VA-T10 primary reference) |
| New surface — the centered full-image viewer body (image + caption + "Open original") | No reference-pack analog (VA-T1 has no gallery/lightbox); this is the net-new visual delta. Governed by Walter's explicit request (runtime-acceptance authority, FE Conformance §23) + Golden Pack §5. | **VISUAL-AUTHORITY-DEVIATION** — anchored to Golden Pack §5 ("Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor"); Walter SWA screenshot = Visual Acceptance Evidence |
| Thumbnail interaction (wrapper `<a target="_blank">` → `<button onClick>`) | Thumbnail **render** is identical; only the activation target changes (in-app viewer instead of a new browser tab). Behavioural, not visual. | **ALLOWED DELTA** (interaction wiring; Golden Pack §5) |

No conversion of the inline-style system to Tailwind/CSS-in-JS (that would be a prohibited DEVIATION — §5). Registration of a dedicated `VA-T11` reference artifact for the viewer is a reasonable **post-acceptance Role-C follow-up** (mirrors how VA-T9/VA-T10 were registered), but is not required to build: §5 sanctions the VISUAL-AUTHORITY-DEVIATION path for a net-new surface with a Rule Anchor, and the idiom is already registered (VA-T10).

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **No registered VA-id for the FindImage gallery/viewer.** §4B registers VA-T1…VA-T10; none covers the image gallery. | **PROCEED** — the viewer is classified VISUAL-AUTHORITY-DEVIATION anchored to Golden Pack §5, mirroring the **registered** VA-T10 dialog idiom; only registered VA-ids are cited (T21-safe). A VA-T11 registration Role-C may follow post-acceptance. |
| **G-2** | **The cropped thumbnail still clips on mobile.** The grid crop is retained by choice (Walter selected "cropped grid + tap-to-expand"). | **PROCEED (intended)** — the full image is now reachable in one tap; the tidy uniform grid is kept deliberately. |
| **G-3** | **Standalone dev harness** renders no FindImage results (mock gateway returns none). | **PROCEED** — harness-only; the viewer is inert with no image (null state → returns `null`). |
| **G-4** | **Focus management** — the viewer sets `role="dialog"`/`aria-modal` + Esc-to-close + `aria-label`, matching the deployed `AddToChatSheet` (which has no focus trap either). | **PROCEED (parity)** — matches the registered VA-T10 accessibility posture; a focus trap would exceed the mirrored idiom. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting` change; no backend/contract/schema change.

## F-P3 — Backend / contract grounding
- **No new backend, contract, or API Spec change.** The viewer renders the **existing** `InlineImageItem` shape (`{ imageUrl, title?, source?, pageUrl?, license?, creator? }`) already present on `m.image.images` (produced by the FindImage tool's `event: vault_image`, already rendered by the deployed gallery). No gateway call, no model call — a pure render of data already in component state.
- **Gateway abstraction preserved** (Governor §6.1): there is no browser→model call anywhere in this change.

## F-P4 — Component reference grounding
**PRIMARY REFERENCE:** the **deployed `AddToChatSheet`** dialog in `src/theo/components/ChatView.tsx` (the VA-T10 idiom) — structural mirror for the overlay (`role="dialog"` + `aria-modal` + backdrop `onClick={onClose}` + inner `stopPropagation` + `IcClose` + `env(safe-area-inset-*)` + `vt-fade-in`/`SHEET_KEYFRAMES`). **State owner:** `ChatView` gains one component-local `useState<InlineImageItem | null>` (Governor §6.3 — React/in-memory, no browser storage). **Types:** consumes the existing `InlineImageItem` (`src/theo/types.ts`, unchanged) — added only to `ChatView`'s type import. No new dependency, no `vite.config` change. `types.ts`/`useTheoState.ts`/gateway/`theoClient.ts` **unchanged**.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; every row: interface (full TS) + VA-id + contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `ChatView` (Theo surface; **ACTIVE**, modify) | `ChatViewProps` **UNCHANGED** (full literal locked in §F-P5.1). Delta: (a) import adds `InlineImageItem`; (b) new component-local `const [lightboxImage, setLightboxImage] = useState<InlineImageItem \| null>(null);`; (c) gallery thumbnail wrapper `<a href target="_blank">` → `<button type="button" onClick={() => setLightboxImage(im)} aria-label=…>` (thumbnail `<img>` unchanged); (d) renders `<ImageLightbox item={lightboxImage} onClose={() => setLightboxImage(null)} />`. | VA-T1 (surface beneath unchanged); VA-T10 (dialog idiom) | None (renders existing `m.image.images: InlineImageItem[]`) | PROCEED |
| TC-2 | `ImageLightbox` (Theo surface; **NEW** — mirrors VA-T10) | `function ImageLightbox({ item, onClose }: { item: InlineImageItem \| null; onClose: () => void })` — returns `null` when `item` is null; else a `role="dialog"` `aria-modal` fixed-inset overlay: `IcClose` button, `<img>` (`objectFit: contain`, `maxHeight: 80vh`, `stopPropagation`), caption (`title · source · creator · license`) + `<a … target="_blank" rel="noopener noreferrer">Open original ↗</a>`; Esc-to-close via a `useEffect` keydown listener; backdrop `onClick={onClose}`. No `any`. | VA-T10 (EXACT dialog idiom) + VISUAL-AUTHORITY-DEVIATION (new viewer body, anchored §5) | Consumes `InlineImageItem` (existing type; no contract) | PROCEED |

**Infra:** no `vite.config`/dependency change. `types.ts`/`useTheoState.ts`/`gateway.live.ts`/`gateway.mock.ts`/`theoClient.ts` **unchanged**. Single file touched: `ChatView.tsx`.

## F-P5.1 — Locked interface literals (T20 — full literal CCT surfaces)
**`ChatViewProps`** (`src/theo/components/ChatView.tsx`) — full literal, **UNCHANGED** by this VEP (pasted per T20; the change adds a subcomponent + state + a wrapper element, not a prop):
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
**`ImageLightbox` props** (NEW, `src/theo/components/ChatView.tsx`) — full literal:
```typescript
function ImageLightbox({ item, onClose }: { item: InlineImageItem | null; onClose: () => void })
```
**`InlineImageItem`** (`src/theo/types.ts`) — UNCHANGED, the consumed element shape:
```typescript
export interface InlineImageItem { imageUrl: string; title?: string; source?: string; pageUrl?: string; license?: string; creator?: string }
```

## F-P6 — Repository & active-surface grounding
Target read this turn: `src/theo/components/ChatView.tsx` (baseline blob `760cef7` @ HEAD `935eef1`; the deployed gallery render + the `AddToChatSheet` primary reference live here). The single proposed file — `proposed-src/theo/components/ChatView.tsx`, content-addressed blob `822e3fd64d2b86ea9443904551c8a69bba18814c` (the HEAD-independent currency anchor; verify via `git cat-file -p 822e3fd`; the reviewed-commit SHA is carried in the submission note, not restated here) — was applied to `src` this turn and reverted after validation (the package carries only `proposed-src/`). Guardrails: gateway abstraction preserved; no browser→model call; no `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`. Validated: `tsc --noEmit` exit 0, `eslint` exit 0 (**no warnings** on `ChatView.tsx`), `vite build` exit 0 (TheoSurface 299.40 kB / 87.03 kB gzip).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present (G-1…G-4 PROCEED); CCT locked (1 ACTIVE modify + 1 NEW row + §F-P5.1 full literals). No implementation begun — the one file was validated this turn (`tsc` + `eslint` exit 0 + `build` green, `src` reverted). On Codex APPROVAL, Pass 3 commits `ChatView.tsx` to `development` (the Theo dev SWA serves it; Walter accepts) → **tapping a gallery thumbnail opens the full image in-app** (mobile no longer clips). Walter SWA acceptance (a screenshot of the viewer vs this CCT + acceptance note) = Visual Acceptance Evidence for the VISUAL-AUTHORITY-DEVIATION.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-Gallery-Lightbox-FE-Pass-1-VEP/Theo_1B_Gallery_Lightbox_FE_VEP.md" --repo-root .
PASS
```

*End of FindImage Gallery Lightbox FE Pass-1 Frontend VEP (plan only).*
