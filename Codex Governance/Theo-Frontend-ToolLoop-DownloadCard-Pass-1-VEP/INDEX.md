# Theo Frontend — Tool-Loop Download Card: Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (no component code lands this turn; implementation is Pass 3 against the approved Component Contract Table). Adds the **download card** to the Theo chat surface: when an assistant turn produces a downloadable file, the stream carries `event: vault_export` (DR-T11; API §2.10, DEPLOYED + verified) → the FE renders a `DownloadCard` directly after the reply body. First producer: the general-chat tool-loop's `theo_export_spreadsheet` (Akshay #2 Theo→Excel). Visual authority: **VA-T9** (landed). Everything else on the surface is unchanged (VA-T1).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `5f0486487282cc7552825d600e1aa2146fbb9277` (vault-theo, `development` — the commit that contains this package)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A F-P track; §4B VA-T9; §5 Rule Anchors; §6 T20/T25) | `Read`/`Grep` §4B (VA-T9 row) + §3/§5/§6 this turn | `4cecc7dc1319700e6c382180c1bd8ea3131db51c` |
| 2 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `theo_message_stream` tool-loop + additive `event: vault_export`; §2.12 `theo_export_spreadsheet`) | `Read(spec/THEO_API_SPEC.md, §2.10 line 26)` this turn | `3a317a934d6b2c88081a96f2ef12c7a9ebb30609` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 primary reference / greenfield; §3 CCT; §4 prop conventions; §5 allowed deltas; §7 visual parity) | `Grep(§2/§3/§4/§5)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 VEP/CCT; §6 build guardrails: inline-style, no browser storage) | `Grep(§3/§6)` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 6 | VA-T9 reference surface — `artifacts/theo-download-card-reference.jsx` (§4B VA-T9; the download card's visual authority) | `Read(artifacts/theo-download-card-reference.jsx)` this turn | `73e3de62f8c3ccd386fccc60234d57dfb60fd8a1f73e4d890bb8c1cb4d2e88e1` |
| 7 | ACTIVE surface — `src/theo/components/ChatView.tsx` (assistant-turn render + full `ChatViewProps`) | `Read(src/theo/components/ChatView.tsx, offset=1, limit=62)` + `Read(offset=330, limit=45)` this turn | `291347ea7b70026a2a3ba0e30903501772d39c26` |
| 8 | ACTIVE service seam — `src/theo/services/gateway.live.ts` (`StreamHandlers` + `sendMessageStream` SSE parse loop) | `Read(gateway.live.ts, offset=850,limit=70)` + `Read(offset=919,limit=70)` this turn | `b706673ff68647920dd5446ca6683298be833b70` |
| 9 | ACTIVE state — `src/theo/useTheoState.ts` (send() handlers + return; download flows via `messages`) | `Read(useTheoState.ts, offset=470,limit=55)` + `Read(offset=857,limit=30)` this turn | `4432001bec10c2c79e1fb4f7bdcd5284fd9e4688` |
| 10 | Shared types — `src/theo/types.ts` (`Message`; new `FileDownload`) | `Read(src/theo/types.ts)` this turn | `c9045a3cd321e45cbc340e02de8904984d181afb` |
| 11 | Mirror target — `src/theo/components/ArtifactCard.tsx` (the structural-mirror component per §2) | `Read(src/theo/components/ArtifactCard.tsx)` this turn | `99e4672a04adf428e177af3267bf7e1adce7dc71` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "cites a controlling artifact path not present in the working tree at the cited HEAD" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "citing a VA-id path not registered here is automatically invalid" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "The in-chat affordance for a tool-produced downloadable file" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "select **exactly one** existing component file as the structural mirror target" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "A row missing any of the three locked surfaces is invalid (T20)." |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "MUST contain a **Component Contract Table**" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "Keep the reference surface's inline-style approach" |
| spec/THEO_API_SPEC.md | §2.10 | "additive `event: vault_export`" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

---

## F-P1 — Feature identification
When an assistant turn produces a downloadable file, the DEPLOYED backend emits `event: vault_export` / `data: { downloadUrl, filename, contentType, byteSize, expiresAt }` on the `theo_message_stream` SSE (verified 2026-07-17: Theo called `theo_export_spreadsheet` → the frame streamed → the URL resolved to a valid `.xlsx`). Today the FE ignores that frame. This feature renders it as a **DownloadCard** in the assistant turn (VA-T9). Producer-agnostic: any future `downloadable` tool reuses it.

## F-P2 — UI authority reconciliation
- **VA-T9** (Frontend Conformance §4B, CURRENT) is the visual authority — the coral-tint spreadsheet-glyph tile + filename + `Excel spreadsheet · <size>` subtitle + filled-coral Download `<a download target="_blank" rel="noopener noreferrer">`, rendered directly after the reply body. No expiry text (Walter-approved).
- **VA-T1** governs the rest of the surface — unchanged. The card slots in beside the existing `ArtifactCard` render, same idiom; no other surface element moves.

## F-P3 — Contract grounding
- Source contract: API Spec §2.10 — `theo_message_stream` emits the additive `event: vault_export` (DEPLOYED). Payload fields `{ downloadUrl, filename, contentType, byteSize, expiresAt }` (§2.12 export tool result shape).
- The FE consumes it in `sendMessageStream` (the sole consumer of `streamBase`/func-stream) — a new `StreamHandlers.onExport` fired from a `event: vault_export` parse branch, wired in `useTheoState.send()` to set `Message.download`.

## F-P4 — Component grounding (primary reference)
`PRIMARY REFERENCE: src/theo/components/ArtifactCard.tsx` (§2 — exactly one existing component as the structural mirror target). `DownloadCard` mirrors its shape exactly — a clickable inline card (icon tile + title + subtitle), `C.card` bg, `1px solid C.line2`, `borderRadius: 12`, `maxWidth` ~420–430, inline-style, `C.*` tokens. **Allowed deltas (§5):** a trailing action element that is a real `<a href download target=_blank rel=noopener>` (vs ArtifactCard's whole-card `onClick`), and the coral-tint icon tile + coral filled button (VA-T9). No new dependency; no browser storage (Governor §6).

## F-P5 — Component Contract Table (the three locked surfaces per §3; full literal interfaces per T20)

### Component 1 — `DownloadCard` (GREENFIELD; new file `src/theo/components/DownloadCard.tsx`)
- **(1) Prop interface** (required before optional; no `any`):
```ts
interface DownloadCardProps {
  download: FileDownload;
}
```
- **(2) Visual authority:** VA-T9 (`artifacts/theo-download-card-reference.jsx`) — reproduce faithfully.
- **(3) Data/contract dependency:** the `FileDownload` payload from `event: vault_export` (API §2.10); renders `filename`, `formatSize(byteSize)`, and the `downloadUrl` anchor. No network call of its own.

### Component 2 — shared types (`src/theo/types.ts`)
- **New exported interface** (required before optional; no `any`):
```ts
export interface FileDownload {
  downloadUrl: string;
  filename: string;
  contentType?: string;
  byteSize?: number;
  expiresAt?: string;
}
```
- **Modified interface** `Message` (adds one optional field; full literal after change):
```ts
export interface Message { role: Role; content: string; runs?: CitedRun[]; attachments?: SentAttachment[]; thinking?: string; reasoning?: string; tools?: AgentToolCall[]; download?: FileDownload }
```
- **(2) VA:** N/A (type only). **(3) dependency:** none.

### Component 3 — `ChatView` (`src/theo/components/ChatView.tsx`) — render site; **prop interface UNCHANGED**
- **(1) Prop interface** (full literal, unchanged by this feature — `DownloadCard` reads `m.download` off the existing `messages: Message[]`; no new prop):
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
- **(2) Visual authority:** VA-T9 (the new card) + VA-T1 (unchanged rest).
- **(3) Data/contract dependency:** the assistant-branch render gains one line after the reply body (≈ after the `ReadAloudButton` block, L356–364): `{m.download && <DownloadCard download={m.download} />}`. Reads `m.download` from the existing `messages` prop; no new prop, no new call.

### Component 4 — service seam (`src/theo/services/gateway.live.ts`) — `StreamHandlers` gains one optional handler
- **(1) Interface** (full literal after change; the added member is optional/last):
```ts
export interface StreamHandlers {
  onText: (delta: string) => void;
  onThinking?: (delta: string) => void;
  onCitation?: (c: StreamCitation) => void;
  onMeta?: (meta: { conversation_id?: string; model?: string }) => void;
  onTool?: (t: { name: string; input: unknown }) => void;
  onToolResult?: (t: { name: string; ok: boolean }) => void;
  onExport?: (d: FileDownload) => void;
}
```
- **(2) VA:** N/A (transport). **(3) dependency:** `sendMessageStream` gains a parse branch — on a frame whose `evt.includes("event: vault_export")`, call `handlers.onExport?.(j as FileDownload)` (sibling to the existing `event: vault_meta` / `event: vault_error` branches; §5 — wiring through the gateway abstraction, never an inline fetch). `useTheoState.send()` passes `onExport: (d) => patchLastAssistant({ download: d })` into the `sendMessageStream` call and re-asserts `download` in the finalize `patchLastAssistant`. `useTheoState`'s return signature is **unchanged** (`download` rides inside `messages: Message[]`).

## F-P6 — Build guardrails (Governor §6)
Inline-style only (`C.*`/`SANS` tokens; keep the reference surface's inline-style approach); **no `localStorage`/`sessionStorage`**; no new dependency; no Tailwind; zero-dependency SVG glyphs (matching VA-T9). The Download control is a real anchor (`<a href download target="_blank" rel="noopener noreferrer">`) with an `aria-label` — keyboard-accessible, no JS click shim.

## F-P7 — Gap Register
**PROCEED.** (1) **`formatSize`** already exists locally in `ChatView` (L64) and in the VA-T9 reference — Pass-3 lifts one shared helper (or duplicates the ≤4-line fn) rather than importing across a boundary; no contract impact. (2) **Expiry/re-mint:** `expiresAt` is carried in `FileDownload` but not displayed (Walter-approved); the "re-mint on click if expired" behavior is a later enhancement (would add a gateway re-call), out of scope here. (3) **Mock gateway:** `gateway.mock.ts` needs no change — it never emits `vault_export`; the card simply never appears in the standalone harness. (4) No persistence of `download` across reload in MS1 (the SAS is short-lived; a reloaded thread shows the text, not the card) — acceptable; noted.

## F-P8 — Out of scope
Pass-3 implementation (the 4-file change + new `DownloadCard.tsx`) follows on APPROVAL. `expiresAt` re-mint-on-click; download persistence across reload; additional producer tools — later.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Frontend-ToolLoop-DownloadCard-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review of the Component Contract Table. On APPROVED, Claude Code implements Pass 3 (the 4 edits + `DownloadCard.tsx`), captures screenshot evidence against VA-T9, and commits to `development` for Walter to verify on the dev SWA.
