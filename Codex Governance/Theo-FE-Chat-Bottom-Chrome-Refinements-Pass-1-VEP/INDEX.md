# Theo Frontend — chat bottom-chrome refinements: center the ↓ above the composer + move the disclaimer to the end of the chat chain — Pass-1 Frontend Verified Evidence Pack

Plan-only VEP. Two Walter refinements to the Theo chat (2026-07-29):
1. *"the down arrow is in a less than ideal spot, it's sitting inside the chat box to the right where it should be like claude, above the chat box (not touching the chat box) and centered."* — today the ↓ is `position:absolute; right:20; bottom:96` (right-aligned, near the composer). Reposition it **centered + just above the composer, not touching it** (the Claude placement).
2. *"the disclaimer on theo can make mistakes shouldn't be permanent below the chat box, that takes up so much space, where the chat box should be bottom of screen. the disclaimer should be at the bottom of the chat string, following the last theo message (not on each theo message, it just prints at the bottom of the chain)."* — today the "{assistantName} can make mistakes…" line is permanent chrome inside the composer wrapper (below the input card), pushing the composer up. Move it OUT of the composer and render it **once at the end of the message chain** (inside the scroll column, after the last message), so the composer sits at the bottom of the screen and the disclaimer scrolls with the conversation.

Scope: `src/theo/components/ChatView.tsx` only. No prop change (both use existing state/props — `assistantName`, `messages`, the existing scroll state); no other component, no backend/contract. Reviewer: Codex (Theo frontend review).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Reviewer: Codex (Theo frontend review).
Turn issued against HEAD: vault-theo `31a49b2778b3973c8e4403b5f4f140bf7c22a1ce` (development; working tree carries only UNTRACKED non-blocking dirt — `.tmp/` + `artifacts/*.xlsx`; not grounding). Cited source unmodified at HEAD; plan-only.
Currency-anchor form: git blob SHA at HEAD.

Documents read this turn (Full Baseline Grounding):
- `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` — blob `3afec7ea4b13650ce2bf28bf32073179a35e7b24`.
- `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§5 Rule-Anchor; §6 T20; §4B VA-T1) — blob `1e6213e404dbd16f70798f701ae1df36cbc9af25`.
- `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§5 visual-deviation rule) — blob `0035a1d9fed103d07bf420b957c3727ec47fcc6b`.
- `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` — blob `25cc488091d619d8f6642b10552df0d019a87933`.
- `src/theo/components/ChatView.tsx` (the surface edited; the ↓ at its current `right:20;bottom:96` and the disclaimer at its current below-composer line) — blob `c5823b851faf2491b95ab95fd5949d6d7f197b81`.

## Rule Anchor Table

| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B VA-T1 | "reproduce faithfully, do not redesign" | §2 — the chat surface; both changes are position-only refinements of existing elements, no redesign |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" | §2 — the ↓ reposition + disclaimer relocation are VISUAL-AUTHORITY-DEVIATIONs, anchored + Walter-authorized |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "MUST be backed by at least one Rule Anchor" | §2 classification anchored here |

## §1 — Feature Identification + Architecture & boundary reconciliation
Microstep: two position-only refinements in `ChatView` — recenter the ↓ affordance above the composer, and relocate the disclaimer from permanent below-composer chrome to the end of the message chain (so the composer sits at the bottom). **Architecture & boundary reconciliation:** local to `ChatView`; no data/streaming/prop/contract change. The ↓ moves into the composer wrapper (made `position:relative`) so it can anchor just above the box regardless of composer height; the disclaimer element (same text/style) moves from the composer's max-width column to the end of the scroller's message column. No `useTheoState`/gateway/API touch.

## §2 — Classification
**Two VISUAL-AUTHORITY-DEVIATIONs (position-only), Walter-authorized.** Both are repositionings of existing rendered elements on the VA-T1 chat surface — no new element, no restyle, no redesign; the ↓ and the disclaimer keep their existing appearance and only change where they sit. Per Golden Component Pack §5 ("Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor"), classified as deviations, anchored above. **Walter's authorization (verbatim, 2026-07-29):** *"the down arrow is in a less than ideal spot … where it should be like claude, above the chat box (not touching the chat box) and centered"* and *"the disclaimer on theo can make mistakes shouldn't be permanent below the chat box … the disclaimer should be at the bottom of the chat string, following the last theo message (not on each theo message, it just prints at the bottom of the chain)."* Inline-style `C` palette preserved (no Tailwind; 1A guardrail held).

## §3 — Component Contract Table

| # | Component (ownership; NEW/ACTIVE) | Prop interface | Visual authority (VA-id) | API dependency |
|---|---|---|---|---|
| CT-1 | `ChatView` (`src/theo/components/ChatView.tsx`; **ACTIVE**, modify — position-only) | `ChatViewProps` — full literal below. **Prop interface UNCHANGED** (both refinements use existing `assistantName` + the existing scroll state/`messages`). No `any`. | VA-T1 (chat surface) — position-only VISUAL-AUTHORITY-DEVIATIONs (§2) | None |

**Full literal prop interface (verbatim @ HEAD `31a49b2`, UNCHANGED by this slice):**
```ts
export interface ChatViewProps {
  messages: Message[];
  loading: boolean;
  conversationId: string | null;   // thread-change reset signal (from useTheoState.conversationId)
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
  restoring?: boolean;
}
```

## §4 — Gap Register
**NO-GAPS.** Authority present + CURRENT (VA-T1 §4B; Golden Pack §5, anchored); both changes are position-only refinements of existing elements, Walter-authorized; no prop/contract/data/backend change. The ↓ behavior (visibility, smooth-scroll, cue) and the disclaimer text are unchanged — only placement moves.

## §5 — Verification (Pass-3)
`npx tsc --noEmit -p tsconfig.app.json` clean; `npm run build` green; `npx eslint` no new errors. Manual: the ↓ (when scrolled up) is horizontally centered and floats just above the composer with a clear gap (not touching); the composer sits at the bottom of the screen with NO permanent disclaimer beneath it; the "{assistantName} can make mistakes…" line appears once at the end of the conversation (after the last message, scrolls with the chain), and is absent on the empty greeting state.

## §6 — Plan body (Pass-3, on APPROVAL) — all in `src/theo/components/ChatView.tsx`
1. **Recenter the ↓ above the composer.** Give the composer wrapper (`<div style={{ padding: "8px 24px 16px", flexShrink: 0 }}>`) `position: "relative"`. Move the existing `{!atBottom && (<button …>…</button>)}` block to be a child of that wrapper, and change its style from `{ position:"absolute", right:20, bottom:96 }` to `{ position:"absolute", left:"50%", transform:"translateX(-50%)", bottom:"calc(100% + 10px)" }` (keep the rest: 40px circle, `C.card`/`C.line2`/`C.ink2`, shadow, the chevron svg, the `newBelow` coral dot). This centers it horizontally and floats it ~10px above the composer's top edge (not touching), regardless of composer height. **REWRITE the ↓'s adjacent source comment (currently "Absolute within the §502 relative wrapper, just above the composer.") to describe the new geometry — e.g. "Absolute within the composer wrapper (position:relative), centered just above the composer (not touching)." — so the source prose matches the runtime placement (T13).**
2. **Move the disclaimer to the end of the chat chain.** REMOVE the current below-composer disclaimer `<div style={{ textAlign:"center", fontSize:11.5, color:C.ink3, marginTop:9 }}>{assistantName} can make mistakes. Verify tax conclusions before relying on them.</div>` from inside the composer's max-width column. ADD the same element (text unchanged; `margin:"18px 0 4px"`) as the LAST child of the scroller's message column (`<div style={{ maxWidth: 740, margin: "0 auto", padding: "28px 24px 8px" }}>`), after the streaming/loading indicator — so it renders once, after the last message, only when `messages.length > 0` (it is inside the non-empty branch, so the empty greeting shows no disclaimer). With the disclaimer gone from the composer wrapper, the composer (a `flexShrink:0` last child) sits at the bottom of the surface.
3. **Verify + deploy** per §5; commit + push `development`; the Theo remote publishes via its dev workflow.

## §7 — Out of scope
The ↓ visibility/scroll/cue logic (unchanged); the disclaimer text/wording; the composer internals; any surface redesign; anything outside `ChatView.tsx`.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-Chat-Bottom-Chrome-Refinements-Pass-1-VEP/INDEX.md"` — expect PASS.

## Requested action
Codex Pass-2 review against the Theo FE Conformance + Golden Component Pack (position-only VISUAL-AUTHORITY-DEVIATIONs + Walter authorization; CCT prop-interface unchanged; no backend/contract). Plan-only. On APPROVED, Claude Code executes Pass-3 per §6 on `development`, verifies (tsc/build), and the Theo remote publishes via its dev workflow.
