# Theo Frontend — Mobile "Add to chat" attachment sheet (VA-T10): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (implementation is Pass 3 against the approved Component Contract Table). Implements the Codex-APPROVED, now-registered **VA-T10** — the Claude-mobile-match **"Add to chat"** bottom sheet. Today the composer paperclip triggers a bare `<input type="file">`, so on a phone the OS shows its **raw native chooser** (Camera / Camcorder / Files) — undesigned. On NARROW viewports the paperclip will instead open a designed in-app sheet (backdrop + drag-handle + "Add to chat" header + three cards: **Camera** / **Photos** / **Files**), each routing the picked File(s) into the **existing** upload+vision pipeline (`onAddFiles` → `attachment_ids`). WIDE viewports keep the normal file dialog (the VA-T1 composer is unchanged). No backend, no contract change.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `19876386641cf6d7b6d61bd0ac84adb7c6bfabd8` (vault-theo, `development` — the commit that first contains this package; grounding reads performed against parent `80bef860a190b84c8d53a036422b50eecef4511d`, the commit that landed the VA-T10 §4B registration). Working tree also carried 4 untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not source/governance, not used as grounding).
Currency-anchor form: git blob SHA at HEAD.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 guardrails — no storage; inline-style; no direct browser→model call) | `Grep("No `localStorage` / `sessionStorage`")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (F-P1 — the composer is the "Full chat UI" surface; this is a mobile affordance on it) | `Grep("Full chat UI")` this turn | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (attachment endpoints §2: create-upload / finalize / `theo_message` injection — the EXISTING contract the sheet reuses; NO change) | `Grep("accepts `attachment_ids`")` this turn | `dd0460ec5692f363d4096eed61de8117dae62a2a` |
| 4 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchors; §6 T20/T21; §4B VA-T10 — REGISTERED this session) | `Read`/`Grep` (§4B VA-T10 row present) this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates — CCT completeness) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 Primary Reference; §4 prop conventions; §5 visual-deviation rule) | `Read(...THEO_GOLDEN_COMPONENT_PACK_STANDARD.md)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 7 | VA-T10 reference surface — `artifacts/theo-add-to-chat-sheet-reference.jsx` (the registered visual authority the impl reproduces faithfully) | `Read(artifacts/theo-add-to-chat-sheet-reference.jsx)` this turn | `337b29877108e205f6d8a2d4ef9a0a3d2a0dc676` (git blob; §4B sha256 `dd855db6…`) |
| 8 | ACTIVE surface — `src/theo/components/ChatView.tsx` (composer action row: paperclip L416–421 → hidden `fileRef`; `onFilePick`; complete `ChatViewProps`) | `Read(src/theo/components/ChatView.tsx, offset=408, limit=40)` this turn | `43ac501788e6f323847805e5671ee4a0318b28a9` |
| 9 | ACTIVE state — `src/theo/useTheoState.ts` (`addFiles` → `uploadOne` → `attachment_ids`; the pipeline the sheet reuses unchanged) | `Read(src/theo/useTheoState.ts, offset=300, limit=100)` this turn | `290214c594a1a65275f32e7b9d898042ae6a0f0d` |

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
| artifacts/theo-add-to-chat-sheet-reference.jsx | header | "REPLACES the raw native OS file chooser" |
| src/theo/components/ChatView.tsx | onFilePick | "captured as an attachment" |

Sub-phase note: this Pass-1 VEP walks F-P1–F-P7 below; the Rule Anchor Table carries the Conformance §3/§5/§6/§4B anchors (F-P7 / F-P2), the Golden Component Pack §5/§2/§4 anchors (F-P2/F-P4/F-P5), the Governor §6 guardrail (F-P6), the API-Spec attachment-contract anchor (F-P3), the VA-T10 authority (F-P2), and the ACTIVE-surface anchor (F-P6).

---

## F-P1 — Feature identification
**Feature (VA-T10 implementation):** a mobile "Add to chat" bottom sheet for the Theo composer. The composer is the "Full chat UI" surface (1A Frontend Plan); this adds a mobile attachment affordance.

**The change (all in `src/theo/components/ChatView.tsx`):**
1. Add three hidden `<input type="file">` refs: **camera** (`accept="image/*" capture="environment"`), **photos** (`accept="image/*" multiple`), **files** (the existing `fileRef`, `multiple`). Each `onChange` → `onAddFiles(files)` + reset `value` (re-pick) — the existing `onFilePick` pattern.
2. Add `attachOpen` state + a narrow check (`window.matchMedia("(max-width: 767.98px)").matches` — the composer's existing breakpoint idiom, already used in `onKeyDown` L411).
3. The paperclip `onClick` becomes: narrow → `setAttachOpen(true)`; wide → `fileRef.current?.click()` (unchanged wide behavior).
4. Render a new inline `AddToChatSheet` (VISUAL-AUTHORITY-MATCH to VA-T10) whose three cards call `onCamera`/`onPhotos`/`onFiles` (each `.click()`s the matching hidden input, then closes the sheet).

**Role vocabulary.** Claude Code authors (Pass 1); Codex reviews (Pass 2); on APPROVED Claude Code implements on `development` (Pass 3) + emits the SWA test plan; Walter validates on the dev SWA.

---

## F-P2 — UI Authority Reconciliation
- **VA-T10 (Theo "Add to chat" Attachment Sheet; §4B, REGISTERED via Role-C 2026-07-20, sha256 `dd855db6…`)** is the visual authority for the sheet; the implementation is a **VISUAL-AUTHORITY-MATCH** — it reproduces the registered reference (`artifacts/theo-add-to-chat-sheet-reference.jsx`) faithfully (backdrop, drag-handle, "Add to chat" header, three Camera/Photos/Files cards; C palette; SANS; the KEYFRAMES slide-up/fade). Per Golden Component Pack §5, a rendered-surface change is anchored to a registered VA — VA-T10 is that anchor, so this is **not** an unregistered deviation (§6 T21 satisfied — VA-T10 is in §4B).
- **VA-T1 (reference surface)** is **unchanged**: on WIDE the paperclip still opens the file dialog; the composer box/textarea/chips/palette are untouched. The sheet is additive and mobile-only.
- **VA-T6 (narrow-viewport hosted surface)** is unaffected — this is a composer affordance, not a layout reflow.

---

## Architecture & boundary reconciliation
FE-only, single active file (`ChatView.tsx`) plus a new inline presentational component. The sheet crosses no new boundary: each card triggers a hidden `<input>` whose files go to the existing `onAddFiles` prop → `useTheoState.addFiles` → the SAS-upload + `attachment_ids` seam. No new service module, gateway, endpoint, or federation prop. The browser never calls the model directly. No `corporate-reporting` / `reporting_*` involvement.

---

## F-P2.5 / Gap Disclosure
Vocabulary closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §5.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-CAMERA | "Camera" relies on the mobile browser honoring `capture` on a file input. | **PROCEED** | `capture` is widely supported on mobile browsers; where unsupported it gracefully degrades to the same image picker as "Photos" (still routes via `onAddFiles`). No new permission prompt beyond the OS's own camera grant. |
| G-WIDE | The sheet is narrow-only; wide keeps the native file dialog. | **PROCEED** | Walter's request is the phone. "Camera" is meaningless on desktop, and the desktop native dialog is already clean; VA-T10 itself scopes the sheet to narrow (wide VA-T1 unchanged). |
| G-CLAUDEROWS | Claude's Research / Web-search / Tool-access / Add-to-project rows are not built. | **PROCEED** | Out of scope per VA-T10 (Claude-specific; Theo's web search is always-on and projects live elsewhere). The three attachment cards are the registered surface; extra rows are a later scope if Walter wants fuller parity. |

Per-surface real-in-1A vs true-in-1B: the sheet + its upload wiring are **real** now; the attachment upload + vision injection they reuse are live 1B (DEPLOYED B8b/B8c/B8d), unchanged.

---

## F-P3 — Backend / contract grounding
**No contract change.** The three cards reuse the existing, DEPLOYED attachment contract verbatim: `theo_create_attachment_upload` → SAS PUT → `theo_finalize_attachment` → `theo_message`/`theo_message_stream` "accepts `attachment_ids`" and injects the native image/document block (API Spec §2). Presentation + input plumbing only — no service-module, gateway, or endpoint change.

---

## F-P4 — Component reference grounding
**Canonical Primary Reference: `src/theo/components/ChatView.tsx`** (the ACTIVE component being modified; the composer action row is the structural-mirror target). The new inline `AddToChatSheet` reproduces the registered **VA-T10** reference artifact. No composite primary reference.

---

## F-P5 — Component Contract Table

### CCT-1 · `ChatView` — ACTIVE (Theo surface), modified · VA-T10 (new mobile sheet) + VA-T1 (unchanged wide chrome) · calls existing handler only (`onAddFiles`); no contract change · **PROCEED**

**No prop-interface change** — the sheet uses the **existing** `onAddFiles` + `attachmentsAvailable` props already on `ChatViewProps`; the sheet's open-state, the three input refs, and the narrow check are ChatView-internal. The complete current `ChatViewProps` (unchanged; required-before-optional; no `any`) is locked here per T20:
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

### CCT-2 · `AddToChatSheet` — NEW/GREENFIELD (inline in ChatView) · VA-T10 (the registered reference surface — reproduce faithfully) · presentational (no contract; parent wires files to `onAddFiles`) · **PROCEED**

Complete prop interface (required-before-optional; no `any`):
```ts
interface AddToChatSheetProps {
  open: boolean;
  onClose: () => void;
  onCamera: () => void;
  onPhotos: () => void;
  onFiles: () => void;
}
```
Presentational: renders the VA-T10 surface (backdrop tap / ✕ → `onClose`; the three cards → `onCamera`/`onPhotos`/`onFiles`). `role="dialog" aria-modal="true"`, inline-style, no Tailwind, no storage. Returns `null` when `!open`.

**ChatView wiring (illustrative — final at Pass 3):** three hidden inputs + the paperclip branch.
```tsx
const cameraRef = useRef<HTMLInputElement>(null);
const photosRef = useRef<HTMLInputElement>(null);
// fileRef (existing) = Files
const isNarrow = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767.98px)").matches;
// paperclip onClick:
() => { if (isNarrow()) setAttachOpen(true); else fileRef.current?.click(); }
// each hidden input onChange reuses the existing onFilePick idiom → onAddFiles + value reset
```

---

## F-P6 — Repository & active-surface grounding
- Target file on the **active surface** (read this turn): `src/theo/components/ChatView.tsx` (paperclip + `fileRef` + `onFilePick`); `addFiles` lives in `src/theo/useTheoState.ts` (unchanged). No deprecated/orphaned code.
- **Guardrails honored (Governor §6 / Conformance §6 T26):** **no `localStorage`/`sessionStorage`**; **inline-style preserved** — the sheet is inline-style only, matching the VA-T10 reference (no Tailwind/CSS-in-JS); **no direct browser→model call** (files go through the existing upload → `attachment_ids` → gateway path); no change to `corporate-reporting`/`reporting_*`; `[[ARTIFACT]]`/SWAP BLOCK untouched.

---

## F-P7 — Visual-parity + SWA test plan (Pass-3 obligations, previewed)
- **VA-T10 is already registered** (Role-C landed 2026-07-20); no VA-registry edit at Pass-3 — the impl must be VISUAL-AUTHORITY-MATCH to it.
- **Structural mirror (F-I2) + visual parity (F-I4):** the inline `AddToChatSheet` reproduces the VA-T10 reference faithfully — translucent backdrop, drag-handle pill, centered "Add to chat" header with a left ✕, three white cards (52px grey circular icon chip + label), the slide-up/fade keyframes, the `C` palette + `SANS`.
- **SWA test plan (F-I5):** on `development` deploy, Walter (dev SWA / "Vault Dev", on a phone): (1) tap the composer paperclip → the designed **"Add to chat"** sheet slides up (NOT the raw OS chooser); (2) **Photos** → gallery → pick an image → chip appears (uploading→ready) → Theo can describe it; (3) **Camera** → camera opens → capture → chip appears; (4) **Files** → file browser → any file attaches; (5) tap backdrop / ✕ dismisses; (6) on desktop the paperclip still opens the normal file dialog (unchanged). Screenshot of the sheet vs the VA-T10 reference = Pass-3 Visual Acceptance Evidence.

## Mechanical lint
Run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission> --repo-root .`), verbatim:

```
PASS  Codex Governance/Theo-Frontend-Add-To-Chat-Sheet-Pass-1-VEP/Theo_Frontend_Add_To_Chat_Sheet_Pass_1_VEP.md
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note
Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §2). Hard gates: CCT completeness (T20 — CCT-1 pastes the complete literal `ChatViewProps` with no prop change; CCT-2 pastes the complete literal `AddToChatSheetProps`), VA-id registration (T21 — VA-T10 IS registered in §4B this session), contract existence (T22 — no contract change; the attachment/`attachment_ids` injection contract already exists, API §2), artifact presence (T25 — present at cited HEAD), GCR/Rule-Anchor (T1/T5). Substance: the impl is a **VISUAL-AUTHORITY-MATCH to VA-T10** (reproduce faithfully, no redesign — Golden Component Pack §5/§7) + surface-fidelity guardrails (T26 — inline-style, no Tailwind, no storage, no direct browser→model call). Verdict APPROVED or REJECTED only.
