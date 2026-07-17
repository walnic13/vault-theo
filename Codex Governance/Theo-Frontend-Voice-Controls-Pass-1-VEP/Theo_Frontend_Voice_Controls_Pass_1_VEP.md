# Theo Frontend — Voice Controls (dictation + read-aloud): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (no component code lands this turn; implementation is Pass 3 against the approved Component Contract Table). Adds the two Walter-approved voice controls to the Theo chat surface — a **dictation mic** in the composer action row and a **read-aloud** control under each assistant reply — wired to the DEPLOYED `theo_transcribe_audio` / `theo_synthesize_speech` backends (API §2.11) through the single service module. Visual authority: **VA-T8** (landed). Everything else on the surface is unchanged (VA-T1).

**Re-issue (v2) — addresses Codex Pass-2 REJECT (2026-07-17):** **T25** — the GCR now cites HEAD `409dd96`, the commit that CONTAINS this package (the prior GCR cited the pre-commit grounding HEAD). **T20** — F-P5 now pastes the COMPLETE literal TypeScript interfaces for every in-scope surface (the full modified `ChatViewProps`, the full `useTheoState` return, and each new component's full prop interface), not "Adds to…".

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `409dd9602057244bf00ba5218a4d70b559542169` (vault-theo, `development` — the commit that contains this package)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 VEP/CCT; §4 UI reconciliation; §5 Gap; §6 build guardrails) | `Read(...GOVERNOR_STANDARD.md)` + `Grep("MUST contain a **Component Contract Table**")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (F-P1 — grep confirmed 0 voice entries → Walter-directed extension) | `Grep(pattern="voice\|dictat\|read.aloud", path=…1A_FRONTEND_PLAN.md)` → 0 this turn | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.11 Voice I/O — `theo_transcribe_audio` + `theo_synthesize_speech`, both DEPLOYED) | `Grep(pattern="theo_(transcribe_audio\|synthesize_speech)\|Voice I/O (Tier Voice)")` this turn | `8ae244ea5d716afd4cf2b4b8f53658e59d361cea` |
| 4 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4/§4A F-P track; §4B VA-T8; §5 Rule Anchors; §6 T20/T25) | `Read(...FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md)` + `Grep(§6 T20/T25)` this turn | `fa95a9703a66884b186ed08755c788476133d992` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates; §2 review; §3 verdict) | `Read(...CODEX_THEO_FRONTEND_REVIEW_STANDARD.md)` + `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 Primary Reference / greenfield; §3 CCT; §4 prop conventions; §5 allowed deltas; §7 visual parity) | `Read(...GOLDEN_COMPONENT_PACK_STANDARD.md)` + `Grep(§3/§4)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 7 | VA-T8 reference surface — `artifacts/theo-voice-controls-reference.jsx` (§4B VA-T8; visual authority for both controls) | `Read(artifacts/theo-voice-controls-reference.jsx)` this turn | `ab12ab072b494137d6c6c33f9096584a1d1f9d34` |
| 8 | ACTIVE surface — `src/theo/components/ChatView.tsx` (composer action row + assistant message render; complete `ChatViewProps` pasted in F-P5) | `Read(src/theo/components/ChatView.tsx, offset=13, limit=30)` this turn | `02a3e56eac8026854d18a01703a9e0bd744284cc` |
| 9 | ACTIVE state — `src/theo/useTheoState.ts` (handlers/state hook; complete return pasted in F-P5) | `Read(src/theo/useTheoState.ts, offset=748, limit=21)` this turn | `81eccab5f761372392996bdf25caf351ba5f7549` |
| 10 | ACTIVE service seam — `src/theo/services/theoClient.ts` + `gateway.live.ts` (single service module; `apiBase` routes every `theo_*` call incl. the func-chat-hosted `theo_create_attachment_upload`) | `Read(theoClient.ts)` + `Read(gateway.live.ts)` + `Grep(apiBase)` this turn | `e729804aa51a63d8dc4392c53957cb57e915766a` |
| 11 | Shared types — `src/theo/types.ts` (exact exported type names for the pasted interfaces) | `Read(src/theo/types.ts)` this turn | `c9045a3cd321e45cbc340e02de8904984d181afb` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "cites a controlling artifact path not present in the working tree at the cited HEAD" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "citing a VA-id path not registered here is automatically invalid" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "select **exactly one** existing component file as the structural mirror target" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "declare `PRIMARY REFERENCE: GREENFIELD`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "A row missing any of the three locked surfaces is invalid (T20)." |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "MUST contain a **Component Contract Table**" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "Keep the reference surface's inline-style approach" |
| spec/THEO_API_SPEC.md | §2.11 | "Voice I/O (Tier Voice)" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

Sub-phase track note: this Pass-1 VEP walks F-P1–F-P7 (below); the Rule Anchor Table carries the Conformance §3/§5/§6 anchors (F-P7 + the corrected T20/T25), the §4B VA authority (F-P2), the Golden Component Pack CCT/primary-reference/allowed-delta/prop-convention anchors (F-P4/F-P5), the Governor CCT + build-guardrail anchors (F-P6), and the API-Spec §2.11 contract anchor (F-P3).

---

## F-P1 — Feature identification

**Feature:** Voice controls on the Theo chat surface — Walter-directed 2026-07-17, look approved ("looks great"). Two additions:
- **Dictation:** a mic button in the composer action row (left cluster, beside the attach button). Press → record; press → stop → transcribe → transcript drops into the composer draft for review (nothing auto-sent). Client caps at 7:00.
- **Read-aloud:** a control in an actions row under each assistant reply. Tap → hear the reply in a natural neural voice; tap → stop. One premium default voice for v1.

**Plan currency (F-P1).** `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` carries **no** voice / dictation / read-aloud entry (grep this turn → 0). Voice is a **Walter-directed extension** on the same footing as the Sigma-FE and mobile passes; its backends are DEPLOYED (API §2.11) and its visual authority VA-T8 is landed. See Gap G-1A-PLAN.

**Role vocabulary.** Claude Code authors (Pass 1). Codex reviews (Pass 2). On APPROVED, Claude Code implements on `development` (Pass 3) + emits the SWA test plan; Walter validates on the dev SWA and accepts.

---

## F-P2 — UI Authority Reconciliation

- **VA-T8 (Theo Voice Controls; §4B, landed `f7ccb28`, sha256 `d97a5896…`)** is the authority for both new controls (mic idle/recording; read-aloud idle/playing). The implementation reproduces VA-T8 faithfully → **VISUAL-AUTHORITY-MATCH**.
- **VA-T1 (reference surface)** governs everything else and is **unchanged**: the composer box, textarea, attach button, send/stop button, message layout, palette (`C`), and fonts are preserved. The mic button reuses the existing 34×34 action-button idiom (same slot family as the `Paperclip` attach + send buttons); the read-aloud button reuses the muted message-affordance idiom.
- No planned VISUAL-AUTHORITY-DEVIATION.

---

## F-P2.5 / Gap Disclosure

Vocabulary closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §5.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-1A-PLAN | Voice is not a feature entry in the 1A Frontend Plan. | **PROCEED** | Walter-directed extension (approved this turn), same footing as the Sigma-FE / mobile passes; backends DEPLOYED (API §2.11); VA-T8 landed. A plan Role-C row is an optional documentation follow-up. |
| G-APIBASE | The voice endpoints are on `vaultgpt-func-chat`; the FE must reach them at the right base URL. | **PROCEED** | `gateway.live` routes **every** `theo_*` call through `apiBase`, including the func-chat-hosted `theo_create_attachment_upload` (confirmed deployed on func-chat this session) — so `apiBase` already resolves to the app that serves the voice handlers. The two new calls reuse `apiBase` + the existing `authHeaders()` Bearer. **Pass-3 confirms** the deployed `apiBase` reaches `theo_transcribe_audio` (a 401/200 probe) before ship. |
| G-BROWSER-API | Dictation needs `getUserMedia` + `MediaRecorder`; read-aloud needs `HTMLAudioElement`. | **PROCEED** | Media/device APIs, **not storage** — the §6 guardrail bans `localStorage`/`sessionStorage` (persistence), which this feature does not use. Mic permission via `getUserMedia` at first record; audio bytes are transient (an in-memory object URL, revoked after playback). No direct browser→model call (both calls go through the gateway/service module). |
| G-MEDIA-TYPE | `MediaRecorder` mime support varies (Chrome → `audio/webm`;Opus, Safari → `audio/mp4`). | **PROCEED** | The recorder picks the first `MediaRecorder.isTypeSupported(...)` type from the §2.11 audio allow-list and sends that `content_type`; the backend allow-list covers them. |
| G-VOICE-PICKER | v1 ships one default voice (no picker). | **PROCEED** | Per Walter ("simple + high quality to start"). The backend accepts an optional `voice`, so a picker is a later FE-only add. |

Per-surface real-in-1A vs true-in-1B: the voice controls' **visual + interaction behaviour is real** now; the transcription/synthesis calls are **live 1B** (DEPLOYED backends), routed through the service module (the standalone harness without a token disables voice, mirroring `attachmentsAvailable()`).

---

## F-P3 — Backend / contract grounding

Both contracts DEPLOYED (API Spec §2.11), called live through the service module (`theoClient` → `gateway.live`, `apiBase` + Bearer):

- **`POST /api/theo_transcribe_audio`** — `{ audio_base64: string, content_type: string }` → `{ text: string }`. Errors 401/400/502/500.
- **`POST /api/theo_synthesize_speech`** — `{ text: string, voice?: string }` → `{ audio_base64: string, content_type: "audio/mpeg", voice: string }`. Errors 401/400/502/500.

New service-module methods (gateway abstraction; no direct browser→model call): each delegates to a new `gateway.live` function that base64-encodes/decodes and `fetch`es `${apiBase}/api/theo_*` with `authHeaders()`, mirroring `sendMessage` / `createAttachmentUpload`; availability gates on `isLive()`.

---

## F-P4 — Component reference grounding

**Canonical Primary Reference: `src/theo/components/ChatView.tsx`** (the ACTIVE component being modified). The composer action row (`Paperclip` attach + send/stop at L247–267) and the assistant-message render (L202–216) are the structural-mirror targets. The three new **inline** sub-components (`MicButton`, `RecordingTray`, `ReadAloudButton`) are **`PRIMARY REFERENCE: GREENFIELD`** — governed by **VA-T8** + the 1A Frontend Plan — following ChatView's existing inline-component idiom (`Paperclip`, `Chip`, `StatusLine`, `ThinkingPanel`) and the `icons.tsx` `SV`-spread idiom. No composite primary reference.

---

## F-P5 — Component Contract Table

One entry per in-scope surface; each locks the three surfaces (complete literal TypeScript prop/input interface — required-before-optional, no `any`; VA-id citation; data/contract dependency) + impl eligibility. Component `Message`/`Project`/`ReactNode`/etc. types are the deployed `src/theo/types.ts` shapes (read this turn).

### CCT-1 · `ChatView` — ACTIVE (Theo surface), modified · VA-T8 (mic + read-aloud regions) + VA-T1 (unchanged chrome) · calls handlers only · **PROCEED**

Complete modified prop interface (existing props preserved; the 11 new required props inserted before the existing optional trio to keep required-before-optional):

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
  voiceAvailable: boolean;                          // NEW — mic/read-aloud shown only when the live backend is wired
  recording: boolean;                               // NEW — dictation is actively recording
  transcribing: boolean;                            // NEW — stopped; transcript request in flight
  recordingSeconds: number;                         // NEW — elapsed record time (drives the tray timer; 7:00 cap)
  onStartDictation: () => void;                     // NEW
  onStopDictation: () => void;                      // NEW — stop → transcribe → fill draft
  onCancelDictation: () => void;                    // NEW — discard the recording
  playingIdx: number | null;                        // NEW — index of the message currently being read aloud
  synthesizingIdx: number | null;                   // NEW — index whose audio request is in flight
  onReadAloud: (idx: number, text: string) => void; // NEW
  onStopReadAloud: () => void;                       // NEW
  reviewFund?: string;
  reviewMode?: boolean;
  sigmaMode?: boolean;
}
```

### CCT-2 · `MicButton` — NEW/GREENFIELD (inline in ChatView) · VA-T8 (composer mic: idle mic glyph / recording coral-tinted stop; 34×34 action-row idiom) · presentational (no contract) · **PROCEED**

```ts
interface MicButtonProps {
  recording: boolean;
  transcribing: boolean;
  disabled: boolean;
  onStart: () => void;
  onStop: () => void;
}
```

### CCT-3 · `RecordingTray` — NEW/GREENFIELD (inline in ChatView) · VA-T8 (coral-soft tray: animated waveform + tabular-nums timer + Cancel + "Listening… up to 7:00") · presentational · **PROCEED**

```ts
interface RecordingTrayProps {
  seconds: number;
  onCancel: () => void;
}
```

### CCT-4 · `ReadAloudButton` — NEW/GREENFIELD (inline in ChatView) · VA-T8 (message actions row: idle "Read aloud" speaker text-button / playing equalizer + "Playing…") · presentational · **PROCEED**

```ts
interface ReadAloudButtonProps {
  playing: boolean;
  loading: boolean;
  onToggle: () => void;
}
```

### CCT-5 · `useTheoState` — ACTIVE (state hook), modified · n/a (state, not a rendered surface) · consumes `theoClient.transcribeAudio` / `synthesizeSpeech` / `voiceAvailable` · **PROCEED**

The hook takes no arguments. Complete modified return contract (existing members preserved verbatim; the 11 new voice members appended). Internal (non-contract) additions: a `MediaRecorder` ref + chunk buffer, a 7:00 cap timer, and an `HTMLAudioElement` ref; read-aloud state is keyed by message **index** (no `Message` type change):

```ts
interface UseTheoStateReturn {
  view: View;
  collapsed: boolean;
  search: string;
  projects: Project[];
  projectChats: ConversationSummary[];
  artifacts: Artifact[];
  galleryArtifacts: ArtifactSummary[];
  detail: Project | null;
  chatProject: Project | null;
  art: Artifact | null;
  openArt: OpenArtifact | null;
  messages: Message[];
  draft: string;
  attachments: ComposerAttachment[];
  attachmentsAvailable: boolean;
  loading: boolean;
  error: string;
  queued: string | null;
  styleKey: StyleKey;
  custom: string;
  saved: boolean;
  copied: boolean;
  npOpen: boolean;
  np: NpDraft;
  kdraft: KDraft;
  recents: ConversationSummary[];
  activeStyle: Style;
  appContext: AppContext;
  reviewMode: boolean;
  sigmaMode: boolean;
  voiceAvailable: boolean;                                   // NEW
  recording: boolean;                                        // NEW
  transcribing: boolean;                                     // NEW
  recordingSeconds: number;                                  // NEW
  playingIdx: number | null;                                 // NEW
  synthesizingIdx: number | null;                            // NEW
  go: (v: View) => void;
  toggleCollapse: () => void;
  setSearch: (s: string) => void;
  setDraft: (s: string) => void;
  newChat: () => void;
  startInProject: (id: string) => Promise<void>;
  openProject: (id: string) => void;
  clearChatProject: () => void;
  send: (textArg?: string) => Promise<void>;
  stop: () => void;
  cancelQueued: () => void;
  ingestAppContext: (ctx: AppContext) => void;
  selectRecent: (id: string) => Promise<void>;
  loadRecents: () => Promise<void>;
  loadProjects: () => Promise<void>;
  loadGalleryArtifacts: () => Promise<void>;
  addFiles: (files: FileList | File[]) => void;
  addPastedText: (text: string) => boolean;
  removeAttachment: (localId: string) => void;
  toggleNp: () => void;
  setNp: (np: NpDraft) => void;
  createProject: () => Promise<void>;
  patchInstructions: (text: string) => void;
  patchDescription: (text: string) => Promise<void>;
  setKdraft: (k: KDraft) => void;
  addKnowledge: () => Promise<void>;
  removeKnowledge: (kid: string) => Promise<void>;
  renameProject: (id: string, name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setProjectVisibility: (id: string, visibility: ProjectVisibility) => Promise<void>;
  visPending: string | null;
  renameConversation: (id: string, title: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  projectMembers: ProjectMember[];
  people: Person[];
  shareMember: (projectId: string, memberOid: string) => Promise<void>;
  unshareMember: (projectId: string, memberOid: string) => Promise<void>;
  memberPending: string | null;
  selectStyle: (k: StyleKey) => void;
  setCustom: (s: string) => void;
  save: () => void;
  copyArt: () => Promise<void>;
  selectVersion: (v: number) => void;
  openArtifact: (id: string) => void;
  openGalleryArtifact: (id: string) => Promise<void>;
  closeArt: () => void;
  greeting: string;
  loadPeople: () => Promise<void>;
  startDictation: () => void;                                // NEW
  stopDictation: () => void;                                 // NEW
  cancelDictation: () => void;                               // NEW
  readAloud: (idx: number, text: string) => void;            // NEW
  stopReadAloud: () => void;                                 // NEW
}
```

### CCT-6 · `theoClient` + `gateway.live` — ACTIVE (single service seam), modified · n/a (service) · `POST /api/theo_transcribe_audio` + `/api/theo_synthesize_speech` (API §2.11, DEPLOYED), via `apiBase` + `authHeaders()` · **PROCEED**

Complete new method interface added to the `theoClient` object (existing methods unchanged):

```ts
interface TheoClientVoiceAdditions {
  voiceAvailable(): boolean;
  transcribeAudio(input: { blob: Blob; contentType: string }): Promise<{ text: string }>;
  synthesizeSpeech(input: { text: string; voice?: string }): Promise<{ blob: Blob; contentType: string }>;
}
```

### CCT-7 · `icons.tsx` — ACTIVE, additive · VA-T8 glyphs · n/a · **PROCEED**

New icon components in the existing `IconComp` idiom (`({ s?: number }) => JSX.Element`), existing icons unchanged:

```ts
export const IcMic: (props: { s?: number }) => JSX.Element;
export const IcSpeaker: (props: { s?: number }) => JSX.Element;
```

Every entry locks the three surfaces (complete literal interface, VA-id, contract dependency) + impl eligibility. No `any`.

---

## F-P6 — Repository & active-surface grounding

- Target files are all on the **active surface** (read this turn): `ChatView.tsx`, `useTheoState.ts`, `theoClient.ts`, `gateway.live.ts`, `icons.tsx`, `types.ts`. No deprecated/orphaned code.
- **Guardrails honored (Governor §6 / Conformance §6 T26):** the two calls route through the **single service module** + gateway abstraction (no scattered fetch, no direct browser→model call); **no `localStorage`/`sessionStorage`** (media APIs only — Gap G-BROWSER-API); **inline-style preserved** (the new controls use inline styles + the `C` palette, mirroring ChatView — no Tailwind/CSS-in-JS); no change to `corporate-reporting`/`reporting_*`; `[[ARTIFACT]]` / SWAP BLOCK untouched.

---

## F-P7 — Visual-parity + SWA test plan (Pass-3 obligations, previewed)

- **Visual parity (F-I4):** at Pass 3 the controls reproduce VA-T8 faithfully — layout, the `C` palette, `SANS` type, the 34×34 action-button geometry, and the four states (mic idle/recording, read-aloud idle/playing) — no redesign.
- **SWA test plan (F-I5):** on `development` deploy, Walter (dev SWA): (1) click the mic → grant permission → speak → stop → confirm the transcript fills the composer for review; (2) confirm the 7:00 cap; (3) tap Read aloud on a reply → hear the default voice → tap to stop. Screenshot vs VA-T8 + acceptance note = the Pass-3 Visual Acceptance Evidence.

## Mechanical lint

Mechanical lint run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission> --repo-root .`), verbatim output:

```
PASS  Codex Governance/Theo-Frontend-Voice-Controls-Pass-1-VEP/Theo_Frontend_Voice_Controls_Pass_1_VEP.md
EXIT=0
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note

Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §2). Run the §1A hard gates: Component Contract Table completeness (T20 — every CCT entry now pastes the complete literal prop/input interface + VA-id + contract dependency), VA-id registration (T21 — VA-T8 in §4B at HEAD), contract existence (T22 — both routes in API §2.11), artifact presence (T25 — this package is present at the cited HEAD `409dd96`), GCR/Rule-Anchor (T1/T5). Then substance: surface-fidelity guardrails (T26); VISUAL-AUTHORITY-MATCH to VA-T8; Gap Disclosure present (T24). Verdict APPROVED or REJECTED only.
