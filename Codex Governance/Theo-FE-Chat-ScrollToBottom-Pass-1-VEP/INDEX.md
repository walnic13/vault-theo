# Theo Frontend — chat "scroll to bottom" (↓) affordance with new-message cue — Pass-1 Frontend Verified Evidence Pack

Plan-only VEP. Walter, 2026-07-29: *"can we add a down area feature in the theo chats, where the user can press the down button if they had scrolled up in the chat to go back down to the bottom of the chat"* (chosen shape: "Jump + new-message cue"). Today `ChatView` **hard-snaps to the bottom on every render** — the effect at `ChatView.tsx:446` (`useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [messages, loading])`) is unconditional, and because the streaming patcher replaces the `messages` array reference on every token, it yanks the view to the bottom continuously while a reply streams — so a user who scrolls up to read earlier content is fought back down. This microstep adds a standard chat affordance: a floating **↓** button that appears only when the user has scrolled up, smooth-scrolls to the latest on tap, and shows a subtle **new-message cue** when content grows while scrolled up — and, critically, **gates the existing auto-snap behind a "stuck to bottom" flag** so it no longer fights a scrolled-up user. Scope: `src/theo/components/ChatView.tsx` (scroll-position state + `onScroll`; gate the `:446` snap behind a `stickRef`; a thread-change reset keyed on a new `conversationId` prop; render the ↓ affordance) + a one-line prop pass in `src/theo/components/TheoMain.tsx`. `ChatViewProps` gains **one** prop — `conversationId` (the thread-change reset signal, sourced from the existing `useTheoState.conversationId` state); otherwise the feature reads the existing `messages`/`loading`. No backend/contract. Reviewer: Codex (Theo frontend review).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Reviewer: Codex (Theo frontend review).
Turn issued against HEAD: vault-theo `a2520573da484a4e2899b0ce480c30f5224b4551` (development; working tree carries only UNTRACKED non-blocking dirt — `.tmp/` scratch + four `artifacts/*.xlsx` templates; none tracked/governance/source; not used as grounding). Cited source unmodified at HEAD; plan-only (Pass-3 lands the edit).
Currency-anchor form: git blob SHA at HEAD.

Documents read this turn (Full Baseline Grounding — the Theo FE baseline set), each with its blob SHA at HEAD:
- `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` — blob `3afec7ea4b13650ce2bf28bf32073179a35e7b24`.
- `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§5 Rule-Anchor; §6 T20; §4B VA-T1) — blob `1e6213e404dbd16f70798f701ae1df36cbc9af25`.
- `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§5 visual-deviation rule; §3/§6 CCT) — blob `0035a1d9fed103d07bf420b957c3727ec47fcc6b`.
- `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` — blob `25cc488091d619d8f6642b10552df0d019a87933`.
- `src/theo/components/ChatView.tsx` (the surface edited) — blob `401c3d2f00ed379126711a42e06ede0d79dcdc80`.
- `src/theo/components/TheoMain.tsx` (call-site — passes the new `conversationId` prop) — blob `230e025745084099a3a3486b4e34d53658466d4f`.
- `src/theo/useTheoState.ts` (source of `conversationId` in its return object, line 1010; read for grounding) — blob `20488643c200ab9e7ef0a5096cf05516ccc399ed`.

## Rule Anchor Table

| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B VA-T1 | "reproduce faithfully, do not redesign" | §2 — VA-T1 is the chat surface; the ↓ is an additive floating affordance, everything else on the surface is unchanged |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" | §2 — the new ↓ button is classified VISUAL-AUTHORITY-DEVIATION, backed by this table + Walter's authorization |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "MUST be backed by at least one Rule Anchor" | §2 classification is anchored here |

## §1 — Feature Identification + Architecture & boundary reconciliation
Microstep: add a scrolled-up "jump to latest" affordance to the Theo chat and stop the auto-snap from fighting a scrolled-up user, WITHOUT changing the chat's rendered surface otherwise or any contract. **Architecture & boundary reconciliation:** entirely local to `ChatView` — it already owns the scroller (`scroller` ref, `ChatView.tsx:434`; the `<div ref={scroller} className="vo-scroll" style={{ flex: 1, overflowY: "auto" }}>` at `:523`) inside a `position: relative` wrapper (`:502`); the new state, `onScroll`, and floating button all live there. The message data + streaming seam are unchanged: the new-message cue is derived inside `ChatView` from the existing `messages` prop (its array identity + last-assistant content grow per token — `useTheoState.patchLastAssistant`), so **no `useTheoState`/gateway/API change**. The only behavioral change to existing code is gating the `:446` snap behind a "stuck" flag (preserving today's snap-to-bottom whenever the user is already at/near the bottom, incl. the first paint and normal streaming).

## §2 — Classification
**VISUAL-AUTHORITY-DEVIATION (additive), Walter-authorized.** The floating ↓ button is a new rendered affordance not present in the VA-T1 reference surface, so per Golden Component Pack §5 ("Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor") it is classified as a deviation, backed by the Rule Anchor Table. It is strictly additive — no existing element of the VA-T1 chat surface changes; when the user is at the bottom (the default), nothing new renders. **Walter's authorization (verbatim, 2026-07-29):** *"can we add a down area feature in the theo chats, where the user can press the down button if they had scrolled up in the chat to go back down to the bottom of the chat"*, shape chosen = "Jump + new-message cue" (the ↓ shows a subtle cue when content arrives while scrolled up). The button mirrors the in-file circular-icon idiom (the 40px `borderRadius:"50%"` send button, `ChatView.tsx:707`) using the `C` palette (theme.ts) — inline-style, no Tailwind (1A guardrail preserved). The gating of the `:446` auto-snap is a BEHAVIORAL change (no pixels change); it only stops the existing snap from overriding a deliberate scroll-up.

## §3 — Component Contract Table

| # | Component (ownership; NEW/ACTIVE) | Prop interface | Visual authority (VA-id) | API dependency |
|---|---|---|---|---|
| CT-1 | `ChatView` (`src/theo/components/ChatView.tsx`; **ACTIVE**, modify) | `ChatViewProps` — full literal below; **adds ONE prop, `conversationId: string \| null`** (the thread-change reset signal); all other props unchanged. No `any`. | VA-T1 (chat surface) — additive VISUAL-AUTHORITY-DEVIATION (§2) | None (internal scroll; reads existing `messages`) |
| CT-2 | `TheoMain` (`src/theo/components/TheoMain.tsx`; **ACTIVE**, modify — call-site) | Passes `conversationId={t.conversationId}` into `<ChatView>` (from the existing `useTheoState` return, blob `20488643`, line 1010). TheoMain's own prop interface is UNCHANGED: `interface TheoMainProps { t: ReturnType<typeof useTheoState>; }` (+ its existing slot props). One-line addition, no other change. | VA-T1 | None |

**Full literal prop interface (verbatim @ HEAD `a252057`, with the ONE added prop marked):**
```ts
export interface ChatViewProps {
  messages: Message[];
  loading: boolean;
  conversationId: string | null;   // NEW — thread-change reset signal (from useTheoState.conversationId)
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
**NO-GAPS.** Authority present + CURRENT (VA-T1 §4B; Golden Pack §5 deviation rule, anchored); the deviation is minimal + additive + Walter-authorized; ONE additive prop (`conversationId`, from existing state) + a one-line TheoMain call-site pass, no contract/data/backend change. The behavioral edits are correctness-scoped (Codex T13 fix): the `:446` snap is gated on `stickRef` and its deps stay `[messages, loading]` so a click's `setAtBottom` can't clobber the smooth scroll; the `conversationId`-keyed reset guarantees a thread switch always snaps to the new thread's latest (no stale scrolled-up state). Pre-existing behavior otherwise untouched.

## §5 — Verification (Pass-3)
`npx tsc --noEmit -p tsconfig.app.json` clean; `npm run build` (vite) green; `npx eslint` no new errors. Manual: scroll up mid-conversation → ↓ appears (bottom-right, above the composer); stream a long reply while scrolled up → the view stays put (no yank) and the ↓ shows the new-message cue; tap ↓ → SMOOTH-scroll to latest (not an instant jump), cue clears; at/near bottom → nothing renders and normal snap-on-new-message still works; **scroll up in one chat then open a DIFFERENT chat → the new thread snaps to its latest message (no stale scrolled-up state)**.

## §6 — Plan body (Pass-3, on APPROVAL)
`src/theo/components/TheoMain.tsx`: pass `conversationId={t.conversationId}` into the existing `<ChatView …>` call (`:81`). All other steps are in `src/theo/components/ChatView.tsx`:
1. **Scroll-position state + stick ref.** Add `const [atBottom, setAtBottom] = useState(true)` (drives button visibility) + `const [newBelow, setNewBelow] = useState(false)`, and `const stickRef = useRef(true)` — the snap GATE lives in the ref so updating it never re-triggers the snap effect. `onScroll` on the `:523` scroller: `dist = scrollHeight - scrollTop - clientHeight`; `const bottom = dist < 80`; → `stickRef.current = bottom; setAtBottom(bottom); if (bottom) setNewBelow(false)`.
2. **Gate the auto-snap (`:446`) on the REF, deps unchanged.** `useEffect(() => { if (scroller.current && stickRef.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [messages, loading])`. Deps stay `[messages, loading]` (as today) so it fires on same-thread content growth/streaming and snaps only when stuck. Because it does NOT depend on `atBottom`, a later `setAtBottom(true)` (the click path, step 5) can NEVER re-trigger it into an instant jump — fixing the smooth-scroll clobber.
3. **Thread-change reset (fixes the cross-thread bug).** With the new `conversationId` prop, add an effect keyed on `conversationId`: on change, snap unconditionally to the latest (`scroller.current.scrollTop = scroller.current.scrollHeight`) and reset `stickRef.current = true; setAtBottom(true); setNewBelow(false)`. So opening / restoring / new-chatting a DIFFERENT thread always lands at its latest message regardless of the prior thread's scroll position (the `paintConversation` messages-replace at `useTheoState.ts:469` no longer leaves a stale scrolled-up state).
4. **New-message cue (same-thread growth only).** A ref holds the last-seen growth signal (last index + last assistant `content.length`); an effect on `[messages]`: if the signal grew AND `!stickRef.current`, `setNewBelow(true)`. The step-3 thread-change effect resets it on switch, so a thread open never shows a false cue.
5. **The ↓ affordance.** Between the scroller (ends `:652`) and the composer (`:654`), render — only when `!atBottom` — a floating button absolutely positioned bottom-right of the `:502` `position:relative` wrapper, above the composer, `zIndex` over the list: a 40px `borderRadius:"50%"` circle mirroring the send-button idiom (`background:C.card`, `border:1px solid ${C.line2}`, `color:C.ink2`, `boxShadow:"0 4px 20px rgba(40,38,31,0.10)"`), a down-chevron glyph, `aria-label="Scroll to latest"`; a small `C.coral` dot when `newBelow`. `onClick`: `scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: prefersReducedMotion ? "auto" : "smooth" })`, then `stickRef.current = true; setAtBottom(true); setNewBelow(false)`. Because the snap effect (step 2) depends only on `[messages, loading]`, these updates do NOT re-fire it — the smooth scroll runs to completion with no instant-jump override.
6. **Verify + deploy** per §5 (incl. the thread-switch case); commit + push `development`; the Theo remote publishes via its dev workflow.

## §7 — Out of scope
Any change to message data / streaming / `useTheoState`; the composer; the empty-state greeting; a "N new messages" count (the cue is a subtle dot, not a counter); any surface redesign.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-Chat-ScrollToBottom-Pass-1-VEP/INDEX.md"` — expect PASS (GCR fields exact; Sub-phase Track N/A; Rule Anchor quotes literal at HEAD `a252057`).

## Requested action
Codex Pass-2 review against the Theo FE Conformance + Golden Component Pack (the VISUAL-AUTHORITY-DEVIATION classification + Walter authorization; CCT completeness / prop-interface unchanged; the gating of the `:446` auto-snap is behaviorally sound and preserves at-bottom snap). Plan-only. On APPROVED, Claude Code executes Pass-3 per §6 on `development`, verifies (tsc/build), and the Theo remote publishes via its dev workflow.
