# Theo FE — Drag-and-Drop Attachments — Pass 1 Verified Evidence Pack (Plan Only)

Add drag-and-drop file attaching to the Theo chat surface (Akshay feedback #3). Dropping files anywhere on the chat panel attaches them via the **existing** upload path; a transient "Drop files to attach" overlay appears only while a file drag is over the panel. FE-only, no backend change, no new prop.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack (frontend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Turn issued against HEAD: vault-theo `b081d4a1ef41972ea7b6a91553915ccb179ee7d9` (pre-commit; the GCR HEAD is repointed to the package-present commit on landing per Conformance T25)
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback), captured via `git rev-parse HEAD:<path>` this turn. Absolute paths used in the Rule Anchor Table.

| # | Document (name + absolute path) | Read this turn | Currency anchor (HEAD blob SHA) |
|---|--------------------------------|----------------|---------------------------------|
| 1 | THEO FRONTEND GROUNDING CONFORMANCE STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | Grep (§4A/§4B, this turn) | `fa95a9703a66884b186ed08755c788476133d992` |
| 2 | THEO GOLDEN COMPONENT PACK STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | referenced (CCT format) | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 3 | VA-T1 reference surface — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/frontend/theo-frontend-reference.jsx | registered §4B (composer authority) | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 4 | c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/components/ChatView.tsx | Read (props + composer, this turn) | `8909fd4517ae72fbe1f0f17dfafe71195190e049` |
| 5 | c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/useTheoState.ts | Read (addFiles, this turn) | `4432001bec10c2c79e1fb4f7bdcd5284fd9e4688` |

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B VA-T1 | "The definitive Claude-for-Teams replica surface" | §2 Vision Reconciliation — the composer is VA-T1's surface; the drop affordance is a transient drag-state of it |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4A F-P2 | "Confirm no conflict with CURRENT visual/surface authorities." | §2 Vision Reconciliation gate |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/components/ChatView.tsx | current-surface | "onAddFiles: (files: FileList | File[]) => void;" | §3 CCT — drop reuses this existing prop; no new prop added |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/useTheoState.ts | current-surface | "Add picked/dropped files" | §4 Impl — the state layer's addFiles already handles dropped files |

## §1 Feature Identification (F-P1)
Akshay feedback #3: "it would be nice if file attachments could also be added using drag and drop." Today attachments are added only via the paperclip → hidden `<input type="file">` → `onFilePick` → `onAddFiles` (ChatView), or a large paste (`onAddPastedText`). The state layer's `addFiles(files: FileList | File[])` is **already** documented as handling "picked/dropped files" and runs the SAS-upload path — so drag-drop needs **no state-layer or backend change**, only a ChatView drop zone that calls the existing `onAddFiles`. Backend dependency: NONE new (the deployed attachment-upload path is unchanged). Pass 3 NOT BLOCKED.

## §2 UI Authority Reconciliation (F-P2)
**VA-T1 (Theo Frontend Reference Surface) — CURRENT.** The composer + attachment chips are VA-T1's surface. The drag-drop affordance is a **transient drag-state** of that composer — visible only while a file is dragged over the panel — not a new persistent surface element (analogous to a focus/hover state). It reuses VA-T1's existing `Paperclip` glyph and `C` palette in the zero-dependency inline-style idiom (no Tailwind, no browser storage). No redesign of any persistent VA-T1 element; attachment chips, textarea, and action row are unchanged. Therefore this cites VA-T1 as VISUAL-AUTHORITY-MATCH; no new VA-Tn is introduced. (If Codex judges the transient overlay a distinct surface warranting its own VA, that is a fast follow — a Walter-approved mockup + Role-C registration — but the state-of-VA-T1 position is asserted here.)

## §3 Component Contract Table (F-P5)

### ChatView (CHANGED — internal only; `src/theo/components/ChatView.tsx`)
**Prop interface (complete, literal — UNCHANGED by this microstep):**
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
**VA-id citation:** VA-T1 (composer surface; transient drag-state affordance). **API dependency:** none directly — ChatView delegates to `onAddFiles` → `useTheoState.addFiles` → `theoClient.uploadAttachment` (`theo_create_attachment_upload`, DEPLOYED, UNCHANGED). Presentational drop handling only.

## §4 Implementation Plan (Pass 3 — NOT BLOCKED)
ChatView only:
1. Add local drag state: `const [dragging, setDragging] = useState(false)` + a `dragDepth` ref (enter/leave counter so child elements don't flicker the state).
2. Wrap the existing `<>` children in a single `position:relative; flex:1; minHeight:0; display:flex; flexDirection:column` container carrying `onDragEnter/onDragOver/onDragLeave/onDrop`.
3. Guards: act only when `attachmentsAvailable` AND `e.dataTransfer.types` includes `"Files"` (ignore text drags — those still route through `onAddPastedText`/textarea). `onDragOver` sets `dropEffect="copy"` + `preventDefault`. `onDrop` → `preventDefault`, reset state, `if (e.dataTransfer.files?.length) onAddFiles(e.dataTransfer.files)` (the same entry point as the paperclip).
4. Transient overlay (only while `dragging`): an `inset:0`, `pointerEvents:none`, coral-tinted wash + a centered pill (`Paperclip` + "Drop files to attach") in the `C` palette / inline-style idiom. No animation (reduced-motion safe). Removed the instant the drag ends/drops.
5. No new props, no state-layer change, no backend change. Existing chips + uploading/ready status render unchanged.

## §5 Gap Register (F-P2.5)
NO-GAPS. FE-only; reuses the deployed upload path; the sole reconciliation note (transient overlay vs a dedicated VA) is addressed in §2.

## §6 Out of scope
No change to the upload path, paperclip picker, paste-to-attachment, attachment chips, the state layer, or any backend. No new VA reference artifact (unless Codex requires one per §2).
