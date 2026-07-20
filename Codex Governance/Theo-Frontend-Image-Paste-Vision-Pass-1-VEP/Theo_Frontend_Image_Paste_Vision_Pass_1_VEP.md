# Theo Frontend — Paste an image into the composer (clipboard → existing vision pipeline): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (implementation is Pass 3 against the approved Component Contract Table). **IMG-1** of the Walter-directed Theo image program (2026-07-20): make Theo read pasted images the way Claude does. Today the composer's paperclip **and** drag-drop already accept image files (no `accept` filter) and route them through the SAS-upload pipeline, and the deployed streaming gateway already injects a native image as an Anthropic `{type:"image", source:{…}}` vision block — so an *attached* or *dropped* image is already read by Claude Sonnet 4.6. The single gap is **clipboard paste**: the composer's `onPaste` reads `text/plain` only, so a pasted screenshot is silently dropped. This VEP adds image detection to `onPaste`, routing pasted image files into the **same** existing `onAddFiles` upload path — closing the "Theo can't read images" gap Walter reported. **Behavior-only: no visual-surface change, no component-prop change, no backend/contract change.**

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `ee9d8b8e00ff025acc6f92e43811597e6ff6a314` (vault-theo, `development` — the commit that first contains this package; grounding reads performed against parent `bf3627baef8a91ad1f521327f3d86b6f10073bda`). Working tree carried 4 untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not source/governance, not used as grounding for this turn).
Currency-anchor form: git blob SHA at HEAD.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 guardrails — no storage; inline-style; no direct browser→model call) | `Grep("No \`localStorage\` / \`sessionStorage\`")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (F-P1 — the composer is the "Chats"/"Full chat UI" surface; this is a behavior tweak to it) | `Grep("Full chat UI")` this turn | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (attachment endpoints §2: create-upload / finalize / `theo_message` injection — the EXISTING vision-block contract; NO change) | `Read(spec/THEO_API_SPEC.md)` + `Grep("accepts \`attachment_ids\`")` this turn | `dd0460ec5692f363d4096eed61de8117dae62a2a` |
| 4 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchors; §6 T20 CCT; §4B VA registry) | `Read(...THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md)` this turn | `dac971eeb9bd1c628d1113740cded9e2ffea09c9` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates — CCT completeness) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 Primary Reference; §4 prop conventions; §5 visual-deviation rule — shows this change does NOT trigger it) | `Read(...THEO_GOLDEN_COMPONENT_PACK_STANDARD.md)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 7 | ACTIVE surface — `src/theo/components/ChatView.tsx` (`onPaste` L276–279 text-only; `onFilePick`/`onDrop` L280–315 already route any file via `onAddFiles`; complete `ChatViewProps` unchanged) | `Read(src/theo/components/ChatView.tsx, offset=255, limit=160)` this turn | `09e9b815a0aa82d0462b08a6f693d4bb4c81cf22` |
| 8 | ACTIVE state — `src/theo/useTheoState.ts` (`addFiles` L332–340 → `uploadOne` → `attachment_ids`; the pipeline pasted images will reuse unchanged) | `Read(src/theo/useTheoState.ts, offset=300, limit=100)` this turn | `290214c594a1a65275f32e7b9d898042ae6a0f0d` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "citing a VA-id path not registered here is automatically invalid" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "select **exactly one** existing component file as the structural mirror target" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |
| spec/THEO_API_SPEC.md | §2 (attachments) | "accepts `attachment_ids`" |
| src/theo/components/ChatView.tsx | onPaste | "captured as an attachment" |

Sub-phase note: this Pass-1 VEP walks F-P1–F-P7 below; the Rule Anchor Table carries the Conformance §3/§5/§6/§4B anchors (F-P7 / F-P2), the Golden Component Pack §5 visual-deviation rule + §2/§4 primary-reference/prop anchors (F-P2/F-P4/F-P5), the Governor §6 guardrail anchor (F-P6), the API-Spec attachment-contract anchor (F-P3), and the ACTIVE-surface `onPaste` anchor (F-P6).

---

## F-P1 — Feature identification
**Feature (IMG-1):** clipboard-image paste in the Theo composer. The **composer** is the "Chats" / "Full chat UI" surface in the 1A Frontend Plan; this is a behavior tweak to it, not a new surface.

**The one change:** `ChatView.onPaste` (currently `src/theo/components/ChatView.tsx:276–279`) reads only `e.clipboardData.getData("text/plain")`. Extend it to first inspect `e.clipboardData.files` for `image/*` entries; if present (and `attachmentsAvailable`), `preventDefault()` and route them through the **existing** `onAddFiles(files)` handler (the same one the paperclip and drag-drop already use), then return; otherwise fall through to the unchanged text-paste behavior.

**Why this is the whole fix (no other surface changes):**
- The paperclip `<input type="file" multiple>` has **no `accept` filter** (`ChatView.tsx:410`) → already accepts images → `onFilePick` → `onAddFiles`.
- Drag-and-drop `onDrop` already routes `dataTransfer.files` (any type) via `onAddFiles` (`ChatView.tsx:309–315`).
- `useTheoState.addFiles` uploads any file by its browser MIME (`contentType = f.type`, `useTheoState.ts:336`) → `uploadOne` → SAS PUT → `attachment_ids`.
- The deployed streaming gateway classifies PNG/JPEG/WebP/GIF as `native` and injects an `{type:"image", source:{type:"base64",…}}` vision block; Claude Sonnet 4.6 has vision. (Confirmed in the deployed handler; API Spec §2, "read uploaded files … as document/image content blocks", "accepts `attachment_ids`".)

So a *pasted* image, once routed through `onAddFiles`, is already read end-to-end on the streaming path. Only `onPaste` was blind to it.

**Role vocabulary.** Claude Code authors (Pass 1); Codex reviews (Pass 2); on APPROVED Claude Code implements on `development` (Pass 3) + emits the SWA test plan; Walter validates on the dev SWA.

---

## F-P2 — UI Authority Reconciliation
**No visual-authority impact.** A pasted image renders through the **existing, already-authorized** attachment `Chip` (uploading → ready), identical to a paperclip/dropped file — no new rendered element, no geometry/palette/type change. Per Golden Component Pack §5 ("Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor") this change is evaluated and found **NOT** to be a visual deviation: it changes only *what a paste event does with clipboard files*, not the rendered surface. **VA-T1** (reference surface — composer box, textarea, chips, palette `C`, fonts) is **unchanged**; **VA-T8** (composer voice/send controls) is **unchanged**. No VA registry edit, no Role-C.

---

## Architecture & boundary reconciliation
FE-only, single-file. The paste handler crosses no boundary it doesn't already cross: it calls the existing `onAddFiles` prop (already wired to `useTheoState.addFiles`), which owns the SAS-upload + `attachment_ids` seam. No new service module, gateway, endpoint, or federation prop. The browser never calls the model directly — the pasted image travels the existing blob-upload → `attachment_ids` → gateway injection path (Governor §6). No `corporate-reporting` / `reporting_*` involvement.

---

## F-P2.5 / Gap Disclosure
Vocabulary closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §5.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-FALLBACK | The checked-in non-streaming fallback handler `api/theo_message/index.js` does not inject `attachment_ids` (only the streaming path + the B8d/B8k `theo_message` variants do). If streaming fell back to it, a pasted (or any) image would be dropped. | **PROCEED** | Out of scope for IMG-1 (FE). The FE fix makes pasted images work end-to-end on the **streaming** path, which is the deployed production path (func-stream `streamBase` is set; the fallback fires only when it is unset). This is a pre-existing, path-independent backend condition, not introduced by this change. Flagged as a small **optional** separate backend hardening (belt-and-suspenders parity for the fallback) Walter can elect; it is not required for pasted-image reading to work. |
| G-HEIC | iOS screenshots paste as PNG; a photo shared as HEIC is not in the native allow-list (PNG/JPEG/WebP/GIF). | **PROCEED** | Matches the existing paperclip/drop behavior and the deployed allow-list (API §2 finalize enforces it → 400 `UNSUPPORTED_MEDIA_TYPE`); no regression. Pasted screenshots (the reported case) are PNG and covered. |

Per-surface real-in-1A vs true-in-1B: the composer's paste behavior is **real** now; the attachment upload + vision injection it reuses are live 1B (DEPLOYED B8b/B8c/B8d), unchanged by this VEP.

---

## F-P3 — Backend / contract grounding
**No contract change.** Pasted images reuse the existing, DEPLOYED attachment contract verbatim: `POST /api/theo_create_attachment_upload` → SAS PUT → `POST /api/theo_finalize_attachment` → `theo_message`/`theo_message_stream` "accepts `attachment_ids`" and injects the native image as a document/image content block (API Spec §2 attachment endpoints). This VEP touches **the composer paste handler only** — no service-module, gateway, or endpoint change.

---

## F-P4 — Component reference grounding
**Canonical Primary Reference: `src/theo/components/ChatView.tsx`** (the ACTIVE component being modified; `onPaste` is the structural-mirror target — the sibling `onDrop`/`onFilePick` handlers are the existing pattern the image branch mirrors). No new components. No composite primary reference.

---

## F-P5 — Component Contract Table

### CCT-1 · `ChatView` — ACTIVE (Theo surface), modified · VA-T1 (unchanged chrome) / VA-T8 (unchanged controls) · calls existing handler only (`onAddFiles`); no contract change · **PROCEED**

**No prop-interface change** — the image-paste branch uses the **existing** `onAddFiles` and `attachmentsAvailable` props already on `ChatViewProps`. The complete current `ChatViewProps` (unchanged; required-before-optional; no `any`) is locked here per T20:
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

**The `onPaste` change (illustrative — final form at Pass 3):** an image-first branch added ahead of the existing text branch; `onAddFiles` already accepts `File[]`.
```ts
function onPaste(e: ClipboardEvent<HTMLTextAreaElement>) {
  // Clipboard image (e.g. a pasted screenshot) → route into the SAME upload+vision pipeline as the
  // paperclip/drag-drop (onAddFiles → useTheoState.addFiles), so Claude receives it as an image block.
  const imgs = Array.from(e.clipboardData.files ?? []).filter((f) => f.type.startsWith("image/"));
  if (imgs.length && attachmentsAvailable) { e.preventDefault(); onAddFiles(imgs); return; }
  const text = e.clipboardData.getData("text/plain");
  if (text && onAddPastedText(text)) e.preventDefault();   // captured as an attachment → don't insert
}
```
No `any`; inline-style/handler idiom preserved; no new import (reuses `ClipboardEvent`, already imported).

---

## F-P6 — Repository & active-surface grounding
- Target file on the **active surface** (read this turn): `src/theo/components/ChatView.tsx`. `onPaste`, `onFilePick`, `onDrop` are inline in it; `addFiles` lives in `src/theo/useTheoState.ts` (unchanged). No deprecated/orphaned code.
- **Guardrails honored (Governor §6 / Conformance §6 T26):** **no `localStorage`/`sessionStorage`**; **inline-style preserved** — no style/Tailwind/CSS-in-JS change at all (behavior-only); **no direct browser→model call** (the pasted image goes through the existing blob-upload → `attachment_ids` → gateway path); no change to `corporate-reporting`/`reporting_*`; `[[ARTIFACT]]`/SWAP BLOCK untouched.

---

## F-P7 — Visual-parity + SWA test plan (Pass-3 obligations, previewed)
- **No visual authority to re-land** (F-P2): VA-T1/VA-T8 unchanged; no VA-registry edit.
- **Structural mirror (F-I2):** the image branch mirrors the existing `onDrop` file-routing (`onAddFiles(files)`), so paste, drop, and paperclip share one upload path.
- **SWA test plan (F-I5):** on `development` deploy, Walter (dev SWA / "Vault Dev"): (1) copy a screenshot (⌘⇧4 / Snip & Sketch / right-click-copy an image) and **paste into the composer** → an attachment chip appears (uploading → ready), same as the paperclip; (2) send a message like "what's in this image?" → Theo describes the pasted image; (3) paperclip-attaching and drag-dropping an image still work (unchanged); (4) pasting **text** still inserts into the box (large text still becomes a "Pasted text" chip) — text paste behavior unregressed. Screenshot of Theo correctly describing a pasted image = the Pass-3 Acceptance Evidence.

## Mechanical lint
Run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission> --repo-root .`), verbatim:

```
PASS  Codex Governance/Theo-Frontend-Image-Paste-Vision-Pass-1-VEP/Theo_Frontend_Image_Paste_Vision_Pass_1_VEP.md
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note
Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §2). Hard gates: CCT completeness (T20 — CCT-1 pastes the complete literal `ChatViewProps`; no prop change), VA-id registration (T21 — no VA edit; VA-T1/VA-T8 unchanged), contract existence (T22 — no contract change; the attachment/`attachment_ids` injection contract already exists, API §2), artifact presence (T25 — present at the cited HEAD), GCR/Rule-Anchor (T1/T5). Substance: this is a **behavior-only** paste handler change that reuses the existing `onAddFiles` upload+vision pipeline (paperclip/drop already accept images); confirm it is **not** a VISUAL-AUTHORITY-DEVIATION (Golden Component Pack §5 — no rendered-surface change) + surface-fidelity guardrails (T26 — no storage, no Tailwind, inline preserved, no direct browser→model call). Verdict APPROVED or REJECTED only.
