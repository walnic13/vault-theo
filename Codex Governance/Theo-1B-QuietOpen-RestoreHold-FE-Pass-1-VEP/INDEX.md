# Theo FE — quiet cold-open restore hold + desktop-never-expire restore — Pass 1 Verified Evidence Pack (Plan Only)

Walter (2026-07-28): the app should just open — "without any interference" — and there are **two splash screens** before Theo is usable. Theo paints the second one: a full-screen **branded** cover (`RestoringSplash` — warm-sand `#E9D6B6` + a large Spiral) while it decides restore-vs-greeting. Walter also sharpened the model:
- **Desktop never expires** — always come back to exactly where you left off (Theo/Connect/Sigma), no matter how many hours; the space "should never update/refresh".
- **Mobile:** < 4 h → restore where you left off; > 4 h → open the new Theo greeting (the animated building-logo screen, which is itself the nice splash).

Two changes, both in vault-theo (the paired vault-origin quiet-boot is **VEP-W**; Origin's mobile "resume the exact *app*" persistence is a separate follow-on):
- **`ChatView.tsx` — `RestoringSplash` becomes a QUIET neutral hold.** From the full-screen warm-sand Spiral → the app surface (`C.bg` `#FAF9F5`) with a small **static** `VaultMark size={40}` (matching the greeting's mark). It no longer reads as a branded splash; on a COLD decision it lifts into the greeting, whose `variant="building"` mark then animates — the one branded building-logo moment. Drops the now-unused `SpiralMark` import. T13 comment sweep (props doc + the two `RestoringSplash` comments + the render-site comment).
- **`useTheoState.ts` — the 4 h staleness cap becomes MOBILE-ONLY.** On **desktop** the restore gate always reopens the last chat regardless of elapsed time (never expires); on **narrow (mobile)** the existing 4 h cap still routes a >4 h gap to the fresh greeting. One `isNarrow` guard on the existing cap; no other restore-logic change.

**Two files, FE only. No gateway/API/schema/tool change.** Supersedes the *visual look* of `Theo-1B-ColdOpen-RestoreSplash-FE` (the cover) while preserving the *logic* of `Theo-1B-Restore-Staleness-Cap-FE` (now platform-split).

### Pass-1 revision (post-Codex REJECT: T23)
- **T23 (hard-gated §4B anchor not applied):** the Rule Anchor Table now carries an explicit **Theo FE Conformance §4B** row (quote "build-once greeting hero") grounding the VA-T11 visual-authority claim the CCT depends on. VA-T11 is verified registered and CURRENT in §4B at HEAD (registry line 161, landed via Role-C 2026-07-27), so the citation is valid — it was previously only described in the GCR, now an applied row.
- **No code change:** the diff is unchanged; proposed blobs still ChatView `401c3d2f00ed379126711a42e06ede0d79dcdc80`, useTheoState `18389a7b13a7a421336a5fd26724dbf3aca1e333`. tsc + build + eslint remain exit 0; mjs lint PASS.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Reviewer: Codex (Theo frontend review).
Turn issued against HEAD: vault-theo `c4593ce61f60758d49735ddcb3974d3bcefc52ab`. Cited source unmodified at HEAD; the proposed files are carried under `proposed-src/`.

Documents read this turn (Full Baseline Grounding — the Theo FE baseline set), each with its concrete blob SHA at HEAD:
- `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§5 Rule-Anchor obligation; §6 T20 invalidity; §4B Visual Authority Registry) — blob `aca008660566997795a991a5816f4011d757c942`.
- `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§4 prop-interface conventions; §5 "any visual change … VISUAL-AUTHORITY-DEVIATION"; §3/§6 CCT format) — blob `0035a1d9fed103d07bf420b957c3727ec47fcc6b`.
- `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (Pass-2 rubric) — blob `e2b7e0ba91486371414da688ae3697f02a11e252`.
- VO1 (app-host shell authority) `C:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/corporate-reporting/frontend/governance/reference-artifacts/visiondocs/VO1-vault-origin-platform-shell.md` (§2B mobile default surface = Theo; §9 launcher — in-app state preserved / resume) — blob `f567084127cc6293eea9739e572d4e2fa5fdb12b` (corporate-reporting HEAD `23ee7966c76932f3e8bae4c50c52be21af7dc350`).
- `src/theo/components/ChatView.tsx` (the `RestoringSplash` cover + the `restoring` prop) — ACTIVE blob `5634aaf0f380712cff8bb8e04c720a51438d3892`.
- `src/theo/useTheoState.ts` (the restore-on-reopen gate + `RESTORE_MAX_AGE_MS`) — ACTIVE blob `1b97aed31e0c18ada5da79e3d87be76d38bf9cfb`.

## Rule Anchor Table

| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "MUST be backed by at least one Rule Anchor" | §2 classification (VISUAL-AUTHORITY-DEVIATION + behavioral) is anchored |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 T20 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | §3 CCT locks the full prop interface + VA-id + dependency |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "build-once greeting hero" | §2/§3 the cold greeting's building mark + the cover's static mark are the registered §4B VA-T11 surface (CURRENT, line 161); the quiet-cover treatment is the VISUAL-AUTHORITY-DEVIATION against it |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." | §2 the cover look change is classified VISUAL-AUTHORITY-DEVIATION |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "TypeScript types for every prop" | §3 CCT prop interface pastes the full typed `ChatViewProps` literal |
| C:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/corporate-reporting/frontend/governance/reference-artifacts/visiondocs/VO1-vault-origin-platform-shell.md | §2B | "directly into a Theo chat" | §1 mobile opens into Theo → the mobile >4h path lands on the Theo greeting |
| C:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/corporate-reporting/frontend/governance/reference-artifacts/visiondocs/VO1-vault-origin-platform-shell.md | §9 | "In-app state is preserved" | §1 desktop never-expire restore — the user re-launches and resumes exactly where they left off |

### Currency note (blob SHAs @ vault-theo HEAD `c4593ce`)
- ChatView.tsx ACTIVE `5634aaf0f380712cff8bb8e04c720a51438d3892` → PROPOSED `401c3d2f00ed379126711a42e06ede0d79dcdc80`.
- useTheoState.ts ACTIVE `1b97aed31e0c18ada5da79e3d87be76d38bf9cfb` → PROPOSED `18389a7b13a7a421336a5fd26724dbf3aca1e333`.

## §1 Feature Identification + Architecture & boundary reconciliation
- **`ChatView.tsx` — the cover (`RestoringSplash`):** the portaled full-viewport gate is kept (still covers the whole surface, over the mobile top strip, so no greeting flash), but its treatment changes from a **branded splash** (`background: "#E9D6B6"` + `SpiralMark` sized ~36% of viewport) to a **quiet neutral hold** (`background: C.bg` `#FAF9F5` + `VaultMark size={40} variant="static"`). The `spiral` sizing calc and the `SpiralMark` import are removed (import now unused). The `restoring?: boolean` prop and the `{restoring && <RestoringSplash />}` render site are byte-unchanged apart from their comments. Three comments (the `restoring?` prop doc; the two `RestoringSplash` comments; the render-site comment) are rewritten to describe the quiet hold — no residual "branded splash / warm sand / Spiral / manifest splash" wording (T13 sweep; the only remaining `#E9D6B6` is the unrelated confetti `COLORS` array, and "not a branded splash" appears as an explicit negation).
- **`useTheoState.ts` — the restore gate:** the restore-on-reopen effect is unchanged except the staleness cap. Was: `if (!lastTouched || now - lastTouched > RESTORE_MAX_AGE_MS) { setRestoring(false); return; }` (applied to all viewports). Now: an `isNarrow` (`window.matchMedia("(max-width: 767.98px)")`) guard wraps it — `if (isNarrow && (!lastTouched || now - lastTouched > RESTORE_MAX_AGE_MS)) { … }` — so **desktop always falls through to `selectRecent(recentsList[0].id)`** (restore, no expiry) and **mobile keeps the 4 h cap** (>4 h → greeting). The earlier guards (already-in-a-chat / composing / `recentsList.length === 0`) are unchanged, so an empty user still lands on the greeting on both platforms.
- **Boundary:** two files; the cold-open cover + the restore-decision hook. No gateway/API/schema/tool/contract change; no message/attachment/voice/review-panel change. The restore *target* (`recentsList[0]` = last-touched) and the `restoring` gate mechanics are unchanged; only the cover's pixels and the cap's platform scope change.
- **§4B Visual Authority Registry:** the governing mark authority is **VA-T11** (Vault Mark) — the greeting's `variant="building"` mark is unchanged; the cover now shows the same mark family as a small `static` variant. The *branded-splash treatment* of the cover is the surface being deviated from; no new VA-id is introduced.

## §2 Classification
- **VISUAL-AUTHORITY-DEVIATION (Walter-directed)** for the `RestoringSplash` cover — a visual change to the rendered surface (branded warm-sand Spiral → quiet neutral mark), classified per Golden Component Pack §5 ("Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor.") and anchored per FE Conformance §5. The branded building-logo moment is **not** removed — it relocates to the greeting the cover lifts into on a cold open (VA-T11, unchanged). Walter is runtime-acceptance authority (dev-SWA acceptance = Visual Acceptance Evidence).
- **Behavioral (non-visual)** for the mobile-only staleness cap — desktop-never-expire vs mobile-4h restore, anchored to VO1 §2B (mobile opens "directly into a Theo chat" → the mobile >4h greeting) + VO1 §9 ("In-app state is preserved" → desktop resume where left off).

## §3 Component Contract Table

| # | Component (ownership; NEW/ACTIVE) | Prop interface | Visual authority (VA-id) | API dependency |
|---|---|---|---|---|
| CT-1 | `ChatView` (Theo chat surface; **ACTIVE**, modify — visual) | Full locked literal (every prop typed; no `any`): `export interface ChatViewProps { messages: Message[]; loading: boolean; error: string; draft: string; attachments: ComposerAttachment[]; attachmentsAvailable: boolean; onDraftChange: (s: string) => void; onSend: (text?: string) => void; onStop: () => void; queuedText: string \| null; onCancelQueued: () => void; onAddFiles: (files: FileList \| File[]) => void; onAddPastedText: (text: string) => boolean; onRemoveAttachment: (localId: string) => void; chatProject: Project \| null; assistantName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode; voiceAvailable: boolean; recording: boolean; transcribing: boolean; recordingSeconds: number; onStartDictation: () => void; onStopDictation: () => void; onCancelDictation: () => void; playingIdx: number \| null; synthesizingIdx: number \| null; onReadAloud: (idx: number, text: string) => void; onStopReadAloud: () => void; reviewFund?: string; reviewMode?: boolean; sigmaMode?: boolean; restoring?: boolean; }` — **unchanged** (no prop delta). Delta is internal to the `RestoringSplash` function (quiet cover) + removal of the unused `SpiralMark` import. | **VA-T11** (Vault Mark; §4B) — greeting mark unchanged; the cover's branded-splash treatment → VISUAL-AUTHORITY-DEVIATION (Walter) | None |
| CT-2 | `useTheoState` (Theo state hook; **ACTIVE**, modify — non-visual) | Hook signature unchanged: `export function useTheoState(): { … }` (large returned state object; no shape change). Delta is internal to the restore-on-reopen `useEffect`: an `isNarrow` guard makes the existing `RESTORE_MAX_AGE_MS` (4 h) cap mobile-only; desktop always restores. No return-shape / callback change. | N/A — non-visual hook | None (restore target is the already-loaded `recentsList`; no new fetch) |

## §4 Gap Register
**PROCEED.**
- **G-1 — the quiet cover still shows briefly on every cold mount (both platforms).** By design — it prevents the greeting flash while the restore decision resolves; it is neutral (app surface + small static mark) and lifts to the restored chat (warm/desktop) or the greeting (mobile >4h). **PROCEED.**
- **G-2 — mobile "resume the exact *app*" (Sigma/Connect, not just Theo) needs Origin persistence.** This VEP restores Theo's last *chat*; restoring the last *surface/app* on a mobile warm launch is Origin shell work (no last-route persistence today) — a separate vault-origin VEP. Desktop already resumes via tab/URL persistence; this VEP removes the one thing that broke it (Theo's 4 h cap). **PROCEED** — disclosed, not silently capped.
- **G-3 — pre-existing eslint warning** (`react-hooks/exhaustive-deps`: `selectRecent` missing from the restore effect's deps) is present on ACTIVE `useTheoState.ts` at HEAD (unchanged by this edit) and is a 0-error warning. Left untouched — adding `selectRecent` to the deps could refire the once-only restore effect. **PROCEED.**
- **G-4 — no gateway/API/schema/tool change; standalone Theo harness unaffected** (matchMedia guarded for `window`). PROCEED.

## §5 Verification (this turn)
- `npx tsc --noEmit` → **exit 0**.
- `npm run build` (vite federated build) → **exit 0**.
- `npx eslint src/theo/components/ChatView.tsx src/theo/useTheoState.ts` → **exit 0** (one pre-existing `selectRecent` deps warning, G-3).
- `node tools/lint_microstep_submission.mjs` on this pack → PASS (see below).
- Post-land (dev SWA): on **desktop**, reopening Theo after hours returns to the last chat (no reset, quiet hold only briefly); on **mobile**, < 4 h returns to the last chat, > 4 h opens the greeting (building-logo). Neither shows the warm-sand Spiral cover; combined with VEP-W neither shows the Origin boot splash.

## §6 Land (Pass-3, on APPROVAL)
Copy `proposed-src/theo/components/ChatView.tsx` → `src/theo/components/ChatView.tsx` and `proposed-src/theo/useTheoState.ts` → `src/theo/useTheoState.ts`; re-verify `tsc --noEmit` + `npm run build` + `eslint`; commit to `development`; deploy the federated remote per the normal vault-theo dev flow. Land with/after **VEP-W** (Origin quiet boot) so both splashes go quiet together; Walter accepts on the dev SWA.

## §7 Out of scope
No gateway/API/schema/tool change; no change to the greeting composition, message/attachment/voice/review surfaces, or the restore target/ordering; no Origin last-route persistence (the mobile "resume the exact app" piece — separate vault-origin VEP, G-2). No change to `usePushSubscription`/notifications.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-QuietOpen-RestoreHold-FE-Pass-1-VEP/INDEX.md"` — PASS (GCR fields exact; Rule Anchor quotes are literal substrings of the cited files at HEAD).

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code lands `ChatView.tsx` + `useTheoState.ts` to `development` per §6 and deploys the federated remote; Walter verifies on the dev SWA (with VEP-W).
