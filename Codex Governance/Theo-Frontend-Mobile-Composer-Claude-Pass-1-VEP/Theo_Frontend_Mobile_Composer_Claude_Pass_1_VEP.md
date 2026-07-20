# Theo Frontend — Mobile composer, Claude-match (circular send + mic, no Enter-send): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (implementation is Pass 3 against the approved Component Contract Table). Walter-directed tweaks to the **Theo chat composer** so the phone view matches the Claude mobile composer (screenshot approved 2026-07-20): the **send** button and the **dictation mic** become **circular** (Claude shape) with a **prominent up-arrow**, the **mic moves** from the composer's left cluster to the **right, beside send**, and **Enter no longer sends on narrow** (newline; send via the button — a stray touch-keyboard Enter must not fire). Visual authority: **VA-T8** (composer voice controls) — **evolving** from its landed rounded-square (`borderRadius:10`) shape to the circular Claude shape (Walter-directed); the VA-T8 reference artifact + §4B sha256 update land as a Role-C at Pass-3 so authority + code re-align. Everything else on the surface is unchanged (VA-T1).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `__STAMP_HEAD__` (vault-theo, `development` — the commit that contains this package; grounding reads performed against parent `306e5bd83c92a1f1efd6948e0c3698bf5482ce6b`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§2 gates; §3 VEP/CCT; §4 UI reconciliation; §6 guardrails) | `Grep("Component Contract Table\|localStorage\|reproduce it faithfully")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (F-P1 — the composer is the "Chats" surface; the restyle is a Walter-directed visual evolution) | `Grep("composer\|Full chat UI")` this turn | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.11 Voice I/O — `theo_transcribe_audio`; §2.1 stream — the composer's send path; NO contract change) | `Read(spec/THEO_API_SPEC.md, limit=70)` this turn | `dd0460ec5692f363d4096eed61de8117dae62a2a` |
| 4 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4/§4A F-P track; §4B VA-T8; §5 Rule Anchors; §6 T20/T25/T26) | `Read(...THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md)` this turn | `552575e3cd9024a5a9ff944b154e6615eee20123` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates; surface-fidelity T26) | `Grep("Component Contract Table completeness\|VISUAL-AUTHORITY")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 Primary Reference; §3 CCT; §4 prop conventions; §5 allowed deltas / visual-deviation rule; §7 visual parity) | `Read(...THEO_GOLDEN_COMPONENT_PACK_STANDARD.md)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 7 | VA-T8 reference surface — `artifacts/theo-voice-controls-reference.jsx` (§4B VA-T8; the composer mic + send — the CURRENT rounded-square shape being evolved) | `Read(artifacts/theo-voice-controls-reference.jsx)` this turn | `ab12ab072b494137d6c6c33f9096584a1d1f9d34` |
| 8 | ACTIVE surface — `src/theo/components/ChatView.tsx` (composer action row L408–434: attach + mic left cluster; send/stop right; `onKeyDown` L406; complete `ChatViewProps` unchanged) | `Read(src/theo/components/ChatView.tsx, offset=408, limit=27)` this turn | `62f22461093b16e4c5012ad517a7e8d5a36601f6` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "citing a VA-id path not registered here is automatically invalid" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "select **exactly one** existing component file as the structural mirror target" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| artifacts/theo-voice-controls-reference.jsx | VA-T8 | "Same 34x34 slot as attach/send." |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| spec/THEO_API_SPEC.md | §2.11 | "Voice I/O (Tier Voice)" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

Sub-phase note: this Pass-1 VEP walks F-P1–F-P7 below; the Rule Anchor Table carries the Conformance §3/§5/§6 anchors (F-P7), the §4B VA authority + Golden Component Pack §5 visual-deviation rule (F-P2), the Golden Component Pack §2/§4 primary-reference/prop anchors (F-P4/F-P5), the Governor §6 guardrail anchors (F-P6), and the API-Spec §2.11 contract anchor (F-P3).

---

## F-P1 — Feature identification
**Feature:** Walter-directed mobile-composer tweaks (2026-07-20; Claude screenshot as the target). The **composer** is the "Chats" surface in the 1A Frontend Plan (§3, "Full chat UI, composer…"); these are visual/interaction tweaks to it, not a new surface. Three changes, all narrow-focused:
- **#6a — circular send:** the send/stop button `34×34 borderRadius:10` (rounded square) with a text `↑`/`◼` → a **circle** (`borderRadius:'50%'`, ~40px) with a **bold `ArrowUp`** (send) / filled square (stop). Coral retained (Theo brand) — flag: Walter may swap to black.
- **#6b — mic moved + circular:** the dictation `MicButton` moves from the composer's **left cluster (beside attach) to the right cluster, immediately left of send** (matching Claude + VA-T8's own layout), and becomes a **grey circle** (subtle idle bg; coral-tinted recording preserved).
- **#5 — no Enter-send on narrow:** `ChatView`'s composer `onKeyDown` sends on `Enter` (`!shiftKey`) unconditionally; gate it with a narrow check (`window.matchMedia('(max-width: 767.98px)').matches` — Theo's own breakpoint, TheoSurface §media) so a phone Enter inserts a newline; wide keeps Enter-to-send.

**Role vocabulary.** Claude Code authors (Pass 1); Codex reviews (Pass 2); on APPROVED Claude Code implements on `development` (Pass 3) + lands the VA-T8 evolution (Role-C) + emits the SWA test plan; Walter validates on the dev SWA.

---

## F-P2 — UI Authority Reconciliation
- **VA-T8 (Theo Voice Controls; §4B, landed, sha256 `d97a5896…`)** currently mandates the **rounded-square 34×34** composer buttons ("Same 34x34 slot as attach/send"; `borderRadius:10`). The Claude-match restyle (circles + prominent arrow + mic-right) is a **VISUAL-AUTHORITY-EVOLUTION of VA-T8**, Walter-directed 2026-07-20. Per Golden Component Pack §5 ("Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor") this is classified and anchored (Rule Anchors 5, 8). **Reconciliation:** the VA-T8 reference artifact (`artifacts/theo-voice-controls-reference.jsx`) is updated to the circular/mic-right shape and its §4B sha256 re-registered as a **Role-C landing at Pass-3**, so the implemented surface is VISUAL-AUTHORITY-MATCH to the evolved VA-T8 (no standing deviation).
- **VA-T1 (reference surface)** governs everything else and is **unchanged**: the composer box, textarea, attach button, message layout, palette (`C`), fonts. The mic-move stays within the existing composer action row; the attach button and the "+"/model-pill Claude chrome are **not** added (Walter: no model pill).
- Mic **location** note: the deployed `ChatView` places the mic in the left cluster; VA-T8's own composer places it right (beside send). Moving it right is Walter-directed and realigns to VA-T8's layout (not a new deviation).

---

## F-P2.5 / Gap Disclosure
Vocabulary closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §5.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-VAT8 | The restyle evolves the landed VA-T8 shape. | **PROCEED** | Walter-directed (screenshot 2026-07-20); classified VISUAL-AUTHORITY-EVOLUTION (Rule Anchors 5/8); the VA-T8 `.jsx` + §4B sha256 update is a Role-C landing at Pass-3, re-aligning authority + code. |
| G-COLOR | Send kept coral, not Claude's black. | **PROCEED** | Coral is the Theo/Vault brand accent + matches the just-accepted native-chat send; the restyle matches Claude's shape/prominence/layout, not its colour. A one-line swap to black if Walter prefers. |
| G-NARROW | #5 uses `matchMedia('(max-width:767.98px)')`, not a plumbed prop. | **PROCEED** | Theo already keys its narrow reflow off that exact breakpoint (TheoSurface `@media (max-width:767.98px)`); a local match in the keydown handler needs no cross-federation prop plumbing. Wide Enter-send unchanged. |
| G-NOPILL | No model/"+" pill added. | **PROCEED** | Walter (2026-07-20): "we don't need the opus thinking module pill." Only the mic + send shapes match Claude. |

Per-surface real-in-1A vs true-in-1B: the composer's visual + interaction behaviour is **real** now; the mic's transcription call is live 1B (DEPLOYED `theo_transcribe_audio`, API §2.11), unchanged by this restyle.

---

## F-P3 — Backend / contract grounding
**No contract change.** Send routes through the existing `onSend`/stream path (API §2.1); the mic's dictation still calls `theo_transcribe_audio` (API §2.11, DEPLOYED) via the existing `onStartDictation`/`onStopDictation` handlers. This VEP touches **presentation + the keydown gate only** — no service-module, gateway, or endpoint change.

---

## F-P4 — Component reference grounding
**Canonical Primary Reference: `src/theo/components/ChatView.tsx`** (the ACTIVE component being modified; the composer action row L408–434 is the structural-mirror target). `MicButton` (inline, existing) is restyled in place; no new components. No composite primary reference. The evolved **VA-T8** reference artifact is the visual authority for the new circular/mic-right shape.

---

## F-P5 — Component Contract Table

### CCT-1 · `ChatView` — ACTIVE (Theo surface), modified · VA-T8 (evolved: circular send + circular mic, mic-right) + VA-T1 (unchanged chrome) · calls existing handlers only (`onSend`/`onStop`/`onStartDictation`/`onStopDictation`); no contract change · **PROCEED**

**No prop-interface change** — the restyle + keydown gate use existing props/handlers. The complete current `ChatViewProps` (unchanged; required-before-optional; no `any`) is locked here per T20:
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

### CCT-2 · `MicButton` — ACTIVE/GREENFIELD (inline in ChatView), restyled + relocated · VA-T8 (evolved: grey circle idle / coral-tinted recording stop; ~40px `borderRadius:'50%'`; now in the right cluster beside send) · presentational (no contract) · **PROCEED**

**No prop-interface change** — the existing interface is preserved; only the button's inline style (rounded-square → circle, transparent → subtle grey idle bg) and its JSX position (left cluster → right cluster) change:
```ts
interface MicButtonProps {
  recording: boolean;
  transcribing: boolean;
  disabled: boolean;
  onStart: () => void;
  onStop: () => void;
}
```

**Send/stop buttons** are inline `<button>`s in ChatView (not a separate component) — restyled in place: `borderRadius:10` → `borderRadius:'50%'`, `width/height:34` → `~40`, the `↑` text glyph → `<ArrowUp>` (bold; imported from the icon set / lucide idiom used in the surface), coral fill preserved. No `any`; inline-style preserved (no Tailwind).

---

## F-P6 — Repository & active-surface grounding
- Target file on the **active surface** (read this turn): `src/theo/components/ChatView.tsx`. `MicButton` + the send/stop buttons are inline in it. No deprecated/orphaned code.
- **Guardrails honored (Governor §6 / Conformance §6 T26):** **no `localStorage`/`sessionStorage`**; **inline-style preserved** — the restyle changes only inline `style` values (border-radius/size) + one icon, **no Tailwind/CSS-in-JS**; no direct browser→model call (dictation still via the existing handler → service module); no change to `corporate-reporting`/`reporting_*`; `[[ARTIFACT]]`/SWAP BLOCK untouched.

---

## F-P7 — Visual-parity + SWA test plan (Pass-3 obligations, previewed)
- **VA-T8 evolution (Role-C at Pass-3):** update `artifacts/theo-voice-controls-reference.jsx` composer to circular mic + send (mic right of send) and re-register the VA-T8 sha256 in Frontend Conformance §4B — so the implemented surface is VISUAL-AUTHORITY-MATCH to the evolved VA-T8.
- **Structural mirror (F-I2) + visual parity (F-I4):** the restyle reproduces the evolved VA-T8 faithfully — circular geometry, coral send + grey mic, bold up-arrow, mic-left-of-send, the `C` palette, `SANS` type; states (mic idle/recording; send enabled/disabled; stop) preserved.
- **SWA test plan (F-I5):** on `development` deploy, Walter (dev SWA / "Vault Dev", narrow): (1) the composer send is a coral **circle** with a bold up-arrow; (2) the **mic is a grey circle immediately left of send** (moved from the left); (3) pressing **Enter inserts a newline** (no send) — send only via the button; (4) dictation still records → transcribes into the draft. Screenshot vs the evolved VA-T8 + acceptance note = the Pass-3 Visual Acceptance Evidence.

## Mechanical lint
Run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission> --repo-root .`), verbatim:

```
PASS  Codex Governance/Theo-Frontend-Mobile-Composer-Claude-Pass-1-VEP/Theo_Frontend_Mobile_Composer_Claude_Pass_1_VEP.md
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note
Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §2). Hard gates: CCT completeness (T20 — CCT-1/CCT-2 paste the complete literal interfaces; no prop change), VA-id registration (T21 — VA-T8 in §4B), contract existence (T22 — no contract change; §2.11 unchanged), artifact presence (T25 — present at the cited HEAD), GCR/Rule-Anchor (T1/T5). Substance: the **VISUAL-AUTHORITY-EVOLUTION of VA-T8** (Golden Component Pack §5; Walter-directed; VA-T8 `.jsx` + §4B sha256 re-aligned via Role-C at Pass-3) + surface-fidelity guardrails (T26 — inline-style preserved, no Tailwind, no storage). Verdict APPROVED or REJECTED only.
