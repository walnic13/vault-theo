# Theo Frontend — Voice Controls (dictation + read-aloud): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (no component code lands this turn; implementation is Pass 3 against the approved Component Contract Table). Adds the two Walter-approved voice controls to the Theo chat surface — a **dictation mic** in the composer action row and a **read-aloud** control under each assistant reply — wired to the DEPLOYED `theo_transcribe_audio` / `theo_synthesize_speech` backends (API §2.11) through the single service module. Visual authority: **VA-T8** (landed). Everything else on the surface is unchanged (VA-T1).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `f7ccb2871ec44b9027a608e9eec535f52cf2912c` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 VEP/CCT; §4 UI reconciliation; §5 Gap; §6 build guardrails; §7 active-surface) | `Read(governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md)` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (F-P1 feature identification — grep confirmed no voice entry → Walter-directed extension) | `Grep(pattern="voice\|dictat\|read.aloud\|mic\|speech\|transcrib", path=governance/THEO_PHASE_1A_FRONTEND_PLAN.md)` this turn | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.11 Voice I/O — `theo_transcribe_audio` + `theo_synthesize_speech`, both DEPLOYED) | `Read(spec/THEO_API_SPEC.md)` (this + prior voice turns) this turn | `8ae244ea5d716afd4cf2b4b8f53658e59d361cea` |
| 4 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4/§4A F-P track; §4B VA-T8; §5 Rule Anchors; §6 triggers) | `Read(governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md)` this turn | `fa95a9703a66884b186ed08755c788476133d992` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates; §2 review; §3 verdict) | `Read(governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md)` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 Primary Reference / greenfield; §3 CCT format; §5 allowed deltas; §7 visual parity) | `Read(governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 7 | VA-T8 reference surface — `artifacts/theo-voice-controls-reference.jsx` (§4B VA-T8; the visual authority for both controls) | `Read(artifacts/theo-voice-controls-reference.jsx)` (authored this turn) | `ab12ab072b494137d6c6c33f9096584a1d1f9d34` |
| 8 | ACTIVE surface — `src/theo/components/ChatView.tsx` (composer action row + assistant message render — the edit target) | `Read(src/theo/components/ChatView.tsx)` this turn | `02a3e56eac8026854d18a01703a9e0bd744284cc` |
| 9 | ACTIVE state — `src/theo/useTheoState.ts` (handlers/state hook — dictation + read-aloud state/handlers added here) | `Read(src/theo/useTheoState.ts)` this turn | `81eccab5f761372392996bdf25caf351ba5f7549` |
| 10 | ACTIVE service seam — `src/theo/services/theoClient.ts` + `gateway.live.ts` (single service module; `apiBase` routes every `theo_*` call incl. the func-chat-hosted `theo_create_attachment_upload`) | `Read(src/theo/services/theoClient.ts)` + `Read(gateway.live.ts)` this turn | `e729804aa51a63d8dc4392c53957cb57e915766a` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "citing a VA-id path not registered here is automatically invalid" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "select **exactly one** existing component file as the structural mirror target" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "declare `PRIMARY REFERENCE: GREENFIELD`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope." |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "Every backend-bound call (chat, projects, artifacts, settings, retrieval) routes through one services/contracts module" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "Keep the reference surface's inline-style approach" |
| spec/THEO_API_SPEC.md | §2.11 | "Voice I/O (Tier Voice)" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

Sub-phase track note: this Pass-1 VEP walks F-P1–F-P7 (below); the Rule Anchor Table carries the Conformance §3/§5 anchors (F-P7), the §4B VA authority (F-P2), the Golden Component Pack CCT/primary-reference/allowed-delta anchors (F-P4/F-P5), the Governor build-guardrail anchors (F-P6), and the API-Spec §2.11 contract anchor (F-P3).

---

## F-P1 — Feature identification

**Feature:** Voice controls on the Theo chat surface — Walter-directed 2026-07-17, look approved ("looks great"). Two additions:
- **Dictation:** a mic button in the composer action row (left cluster, beside the attach button). Press → record; press → stop → transcribe → transcript drops into the composer draft for review (nothing auto-sent). Client caps at 7:00.
- **Read-aloud:** a control in an actions row under each assistant reply. Tap → hear the reply in a natural neural voice; tap → stop. One premium default voice for v1.

**Plan currency (F-P1).** `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` carries **no** voice / dictation / read-aloud entry (grep this turn, empty). Voice is a **Walter-directed extension** on the same footing as the Sigma-FE and mobile passes (extensions to the 1A surface, not 1A-plan rows); its backends are DEPLOYED (API §2.11) and its visual authority VA-T8 is landed. See Gap G-1A-PLAN.

**Role vocabulary.** Claude Code authors (Pass 1). Codex reviews (Pass 2). On APPROVED, Claude Code implements on `development` (Pass 3) + emits the SWA test plan; Walter validates on the dev SWA (records a message, hears Theo reply) and accepts.

---

## F-P2 — UI Authority Reconciliation

- **VA-T8 (Theo Voice Controls; §4B, landed `f7ccb28`, sha256 `d97a5896…`)** is the authority for both new controls — the mic (composer action row: idle mic / recording tray with waveform + timer + Cancel + "Listening… up to 7:00" + coral-tinted stop) and the read-aloud button (under a reply: idle "Read aloud" speaker text-button / playing equalizer + "Playing…"). The implementation reproduces VA-T8 faithfully → **VISUAL-AUTHORITY-MATCH**.
- **VA-T1 (reference surface)** governs everything else and is **unchanged**: the composer box, textarea, attach button, send/stop button, message layout, palette (`C`), and fonts are preserved. The mic button reuses the existing 34×34 action-button idiom (same slot family as the attach `Paperclip` and the send button); the read-aloud button reuses the muted message-affordance idiom. No redesign, no rendered-surface change beyond the VA-T8-authorized additions.
- No planned VISUAL-AUTHORITY-DEVIATION.

---

## F-P2.5 / Gap Disclosure

Vocabulary closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §5.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-1A-PLAN | Voice is not a feature entry in the 1A Frontend Plan. | **PROCEED** | Walter-directed extension (approved this turn), same footing as the Sigma-FE / mobile passes; backends DEPLOYED (API §2.11); VA-T8 landed. A plan Role-C row is an optional documentation follow-up, not a blocker. |
| G-APIBASE | The voice endpoints are on `vaultgpt-func-chat`; the FE must reach them at the right base URL. | **PROCEED** | `gateway.live` routes **every** `theo_*` call through `apiBase`, including the func-chat-hosted `theo_create_attachment_upload` (confirmed deployed on func-chat this session) — so `apiBase` already resolves to the app that serves the voice handlers. The two new calls reuse `apiBase` + the existing `authHeaders()` Bearer, no new base URL. **Pass-3 confirms** the deployed `apiBase` reaches `theo_transcribe_audio` (a 401/200 probe) before ship. |
| G-BROWSER-API | Dictation needs `getUserMedia` + `MediaRecorder`; read-aloud needs `HTMLAudioElement` playback. | **PROCEED** | These are **media/device APIs, not storage** — the §6.3 guardrail bans `localStorage`/`sessionStorage` (persistence), which this feature does not use; nothing is persisted in the browser. Mic permission is requested via `getUserMedia` at first record; audio bytes are transient (an in-memory object URL, revoked after playback). No `localStorage`/`sessionStorage`, no direct browser→model call (both calls go through the gateway/service module). |
| G-MEDIA-TYPE | `MediaRecorder` mime support varies (Chrome → `audio/webm`;Opus, Safari → `audio/mp4`). | **PROCEED** | The recorder picks the first `MediaRecorder.isTypeSupported(...)` type from the §2.11 audio allow-list (`audio/webm`, `audio/mp4`, `audio/ogg`, …) and sends that `content_type`; the backend allow-list already covers them. |
| G-VOICE-PICKER | v1 ships one default voice (no picker). | **PROCEED** | Per Walter ("simple + high quality to start"). The backend accepts an optional `voice`, so a picker is a later FE-only add against an unchanged backend + this same VA (or a VA-T8 addendum if the picker UI warrants it). |

Per-surface real-in-1A vs true-in-1B: the voice controls' **visual + interaction behaviour is real** now; the transcription/synthesis calls are **live 1B** (DEPLOYED backends), routed through the service module (not mocked — the standalone harness without a token simply disables voice, mirroring `attachmentsAvailable()`).

---

## F-P3 — Backend / contract grounding

Both contracts are DEPLOYED (API Spec §2.11) and called live through the service module (`theoClient` → `gateway.live`, `apiBase` + Bearer):

- **`POST /api/theo_transcribe_audio`** — body `{ audio_base64: string, content_type: string }` → `{ text: string }` (standard `{data,meta}` envelope). Errors 401/400/502/500.
- **`POST /api/theo_synthesize_speech`** — body `{ text: string, voice?: string }` → `{ audio_base64: string, content_type: "audio/mpeg", voice: string }`. Errors 401/400/502/500.

New service-module methods (F-I3 gateway abstraction; no direct browser→model call): `theoClient.transcribeAudio(input: { blob: Blob; contentType: string }): Promise<{ text: string }>` and `theoClient.synthesizeSpeech(input: { text: string; voice?: string }): Promise<{ blob: Blob; contentType: string }>`, each delegating to a new `gateway.live` function that base64-encodes/decodes and `fetch`es `${apiBase}/api/theo_*` with `authHeaders()` — mirroring `sendMessage` / `createAttachmentUpload` exactly. Availability gates on `isLive()` (same as attachments).

---

## F-P4 — Component reference grounding

**Canonical Primary Reference: `src/theo/components/ChatView.tsx`** (the ACTIVE component being modified) — the composer action row (the `Paperclip` attach button + send/stop button at L247–267) and the assistant-message render block (L202–216) are the exact structural mirror targets. The mic button mirrors the existing 34×34 attach-button region; the recording tray mirrors the existing `queued`/attachment tray idiom; the read-aloud actions row is added under the assistant body.

The three new inline sub-components (**MicButton**, **RecordingTray**, **ReadAloudButton**) are **`PRIMARY REFERENCE: GREENFIELD`** — no deployed analog — governed by **VA-T8** + the 1A Frontend Plan; they follow the existing inline-component idiom in ChatView (`Paperclip`, `Chip`, `StatusLine`, `ThinkingPanel` are all inline in the same file) and the icon idiom in `icons.tsx` (`SV`-spread inline SVGs). New icons (`IcMic`, `IcSpeaker`) are added to `icons.tsx` in that idiom.

No composite primary reference.

---

## F-P5 — Component Contract Table

| Component (proposed/active) | Prop / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
|---|---|---|---|---|
| **`ChatView`** (ACTIVE — Theo surface; modified) | Adds to `ChatViewProps`: `voiceAvailable: boolean;` `recording: boolean;` `transcribing: boolean;` `recordingSeconds: number;` `onStartDictation: () => void;` `onStopDictation: () => void;` `onCancelDictation: () => void;` `playingIdx: number \| null;` `synthesizingIdx: number \| null;` `onReadAloud: (idx: number, text: string) => void;` `onStopReadAloud: () => void;` (all required; appended after existing props). Existing props unchanged. | VA-T8 (composer mic region + message read-aloud region); VA-T1 for all unchanged chrome | Calls handlers only (no direct contract); the handlers own the service calls | PROCEED |
| **`MicButton`** (NEW/GREENFIELD — inline in ChatView) | `{ recording: boolean; transcribing: boolean; disabled: boolean; onStart: () => void; onStop: () => void }` | VA-T8 (composer mic: idle mic glyph / recording coral-tinted stop; 34×34, action-row idiom) | none (presentational; parent wires handlers) | PROCEED |
| **`RecordingTray`** (NEW/GREENFIELD — inline in ChatView) | `{ seconds: number; onCancel: () => void }` | VA-T8 (coral-soft tray: animated waveform + tabular-nums timer + Cancel + "Listening… up to 7:00") | none | PROCEED |
| **`ReadAloudButton`** (NEW/GREENFIELD — inline in ChatView) | `{ playing: boolean; loading: boolean; onToggle: () => void }` | VA-T8 (message actions row: idle "Read aloud" speaker text-button / playing equalizer + "Playing…") | none | PROCEED |
| **`useTheoState`** (ACTIVE — state hook) | Returns (added): `voiceAvailable: boolean; recording: boolean; transcribing: boolean; recordingSeconds: number; playingIdx: number \| null; synthesizingIdx: number \| null; startDictation: () => void; stopDictation: () => void; cancelDictation: () => void; readAloud: (idx: number, text: string) => void; stopReadAloud: () => void`. Internal: a `MediaRecorder` ref + chunks, a 7:00 cap timer, and an `HTMLAudioElement` ref; read-aloud state keyed by message **index** (no `Message` type change). | n/a (state) | `theoClient.transcribeAudio` / `synthesizeSpeech` | PROCEED |
| **`theoClient` + `gateway.live`** (ACTIVE — single service seam) | `transcribeAudio(input: { blob: Blob; contentType: string }): Promise<{ text: string }>`; `synthesizeSpeech(input: { text: string; voice?: string }): Promise<{ blob: Blob; contentType: string }>`; `voiceAvailable(): boolean` | n/a (service) | `POST /api/theo_transcribe_audio` + `/api/theo_synthesize_speech` (API §2.11, DEPLOYED), via `apiBase` + `authHeaders()` | PROCEED |
| **`icons.tsx`** (ACTIVE) | Adds `IcMic`, `IcSpeaker` (and reuses the existing stop `◼`/`StopGlyph` idiom) as `({ s?: number }) => JSX.Element` in the `SV`-spread idiom | VA-T8 glyphs | n/a | PROCEED |

No `any`; required-before-optional (only `voice?` / `synthesizingIdx` optional/nullable as noted). Every row locks the three surfaces (prop interface, VA-id, contract dependency).

---

## F-P6 — Repository & active-surface grounding

- Target files are all on the **active surface** (read this turn): `ChatView.tsx`, `useTheoState.ts`, `theoClient.ts`, `gateway.live.ts`, `icons.tsx`. No deprecated/orphaned code.
- **Guardrails honored (Governor §6 / Conformance §6 T26):** the two calls route through the **single service module** + gateway abstraction (no scattered fetch, no direct browser→model call); **no `localStorage`/`sessionStorage`** (media APIs only — see Gap G-BROWSER-API); **inline-style preserved** (no Tailwind/CSS-in-JS — the new controls use inline styles + the `C` palette, mirroring ChatView); no change to `corporate-reporting`/`reporting_*`; `[[ARTIFACT]]` / SWAP BLOCK untouched.

---

## F-P7 — Visual-parity + SWA test plan (Pass-3 obligations, previewed)

- **Visual parity (F-I4):** at Pass 3, the implemented controls reproduce VA-T8 faithfully — layout, the `C` palette, `SANS` type, the 34×34 action-button geometry, and the four states (mic idle/recording, read-aloud idle/playing) — no redesign.
- **SWA test plan (F-I5):** on `development` deploy, Walter (dev SWA): (1) click the mic → grant permission → speak → stop → confirm the transcript fills the composer for review; (2) confirm the 7:00 cap; (3) tap Read aloud on a reply → hear the default voice → tap to stop. Screenshot vs VA-T8 + acceptance note = the Pass-3 Visual Acceptance Evidence.

## Mechanical lint

Mechanical lint run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission> --repo-root .`), verbatim output:

```
PASS  Codex Governance/Theo-Frontend-Voice-Controls-Pass-1-VEP/Theo_Frontend_Voice_Controls_Pass_1_VEP.md
EXIT=0
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note

Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §2). Run the §1A hard gates first: Component Contract Table completeness (T20 — every row has prop interface + VA-id + contract dependency), VA-id registration (T21 — VA-T8 is registered in §4B at HEAD), contract existence (T22 — both routes are in API Spec §2.11), artifact presence (T25), GCR/Rule-Anchor (T1/T5). Then substance: surface-fidelity guardrails (T26 — gateway abstraction, no browser storage [media APIs are not storage], inline-style preserved, no reporting_* change); VISUAL-AUTHORITY-MATCH to VA-T8; Gap Disclosure present (T24). Verdict APPROVED or REJECTED only.
