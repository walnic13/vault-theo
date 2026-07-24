# Theo Frontend — FindVideo embed Error-153 fix (iframe `referrerPolicy`): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (implementation is Pass 3). **Bug fix** to the just-shipped in-chat video player: the YouTube embed renders but shows **"Error 153 — Video player configuration error"** (observed live 2026-07-23, dev SWA). Root cause (grounded, not a Shorts/embedding-disabled issue): YouTube's embedded player refuses to initialise when the `Referer` is stripped, and our `<iframe>` sets **no `referrerPolicy`**, so in the federated SWA context the browser sends no/insufficient referrer. Documented fix: add **`referrerPolicy="strict-origin-when-cross-origin"`** to the iframe (per YouTube's own guidance; we are already on the privacy-enhanced `youtube-nocookie.com` domain, the other half of the documented fix). **One additive attribute** on the existing `event: vault_video` iframe in `components/ChatView.tsx`; no other change. `tsc --noEmit` verified green this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `49c78a208deba66b7080f3709bcea7f19275f557` (vault-theo, `development` — the commit that first contains this package; grounding reads against parent `db9de5175187cfff69276c619e5f3519e571633f` — the deployed FindVideo FE render, VEP B2). No contract/API change; the `event: vault_video` frame + `theo_find_video` handler are unchanged and live. Working tree also carried untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not source/governance, not grounding).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix, §6 CCT gates) | `Grep("Component Contract Table")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§5 Allowed Deltas) | `Grep("VISUAL-AUTHORITY-DEVIATION")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `event: vault_video`, unchanged) | `Grep("event: vault_video")` this turn | `da7dc80f7ea48fabafa136418aae2e3f6c65114a` |
| 6 | Edited — `src/theo/components/ChatView.tsx` (the deployed FindVideo render, VEP B2) | `Read` this turn | `54c175d2bfa1bd494cab901fb59e4948c3c38179` |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "ALLOWED DELTA" | §1/CCT — adding the iframe `referrerPolicy` attribute is an ALLOWED DELTA (a behaviour-fixing attribute on the existing element; no visual change) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT — full ChatViewProps (unchanged) + VA + the `event: vault_video` data dependency (unchanged) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "event: vault_video" | §1 — the fix is on the iframe that renders this (unchanged) frame; no contract change |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Prop interface (full TS; **unchanged** by this VEP) | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `ChatView` (`src/theo/components/ChatView.tsx`) | `interface ChatViewProps { messages: Message[]; loading: boolean; error: string; draft: string; attachments: ComposerAttachment[]; attachmentsAvailable: boolean; onDraftChange: (s: string) => void; onSend: (text?: string) => void; onStop: () => void; queuedText: string \| null; onCancelQueued: () => void; onAddFiles: (files: FileList \| File[]) => void; onAddPastedText: (text: string) => boolean; onRemoveAttachment: (localId: string) => void; chatProject: Project \| null; assistantName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode; voiceAvailable: boolean; recording: boolean; transcribing: boolean; recordingSeconds: number; onStartDictation: () => void; onStopDictation: () => void; onCancelDictation: () => void; playingIdx: number \| null; synthesizingIdx: number \| null; onReadAloud: (idx: number, text: string) => void; onStopReadAloud: () => void; reviewFund?: string; reviewMode?: boolean; sigmaMode?: boolean }` — **no prop added/changed**. | Unchanged — the FindVideo player VISUAL-AUTHORITY-DEVIATION (§21A) from VEP B2; this VEP adds no visual change (a non-visual iframe attribute). No new VA-id. | The `event: vault_video` frame (API §2.1) — **unchanged**. The fix is a browser-referrer attribute on the iframe; no data/contract change. |

## §1 Feature Identification + boundary
- **Fix:** add the attribute `referrerPolicy="strict-origin-when-cross-origin"` to the existing `event: vault_video` YouTube `<iframe>` in `ChatView.tsx` (between `allow=…` and `allowFullScreen`). This makes the browser send a same-origin-preserving referrer with the embed's requests, which YouTube's player requires to build its configuration — resolving **Error 153**. React JSX attribute is `referrerPolicy` (camelCase) → emits the HTML `referrerpolicy` attribute.
- **Root cause (grounded):** Error 153 = "Video player configuration error" is a **missing/stripped `Referer`** issue (YouTube's documented cause + fix), not a Shorts-specific or embedding-disabled problem — a standard video would fail identically in the same referrer context. We already use `youtube-nocookie.com` (the other documented half); the iframe was simply missing the `referrerPolicy` attribute, so in the federated SWA context the referrer was insufficient.
- **Boundary:** one additive attribute on one existing element in one file. No prop change, no new component/VA-id/endpoint/dependency, no CSP change (still none needed), no persistence change, no backend/contract change. `tsc --noEmit` green (verified this turn).
- **Deploy timing:** independent, no ordering constraint; fixes the live player on deploy.

## §2 Gap Register
**PROCEED.**
- **(1) Attribute-only, no visual change.** `referrerPolicy` is a non-visual browser hint on the iframe; the player layout/caption/link-card are unchanged. ALLOWED DELTA (Golden Component Pack §5). PROCEED.
- **(2) Grounded root cause.** YouTube's own guidance: Error 153 stems from a stripped `Referer`; the fix is `strict-origin-when-cross-origin` + youtube-nocookie (both now satisfied). WebSearch/WebFetch this turn (Simon Willison TIL + YouTube docs). PROCEED.
- **(3) Link-card branch unaffected.** Non-embeddable results still render the thumbnail link-card (opens `videoUrl`); this fix only touches the iframe branch. PROCEED.
- **(4) No contract / Role-C.** No API/frame change; nothing to document. NO-GAP.
- **(5) No new VA-id / reference-artifact / dependency / CSP.** PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** add iframe `referrerPolicy` to fix Error 153.
- **F-P2 Visual authority:** unchanged (VEP B2 player deviation); no visual change here.
- **F-P3 CCT:** above — ChatViewProps unchanged + `event: vault_video` dependency unchanged.
- **F-P4 Structural mirror:** the deployed VEP B2 iframe (this adds one attribute).
- **F-P5 Allowed-delta:** the attribute is an ALLOWED DELTA (§5); no deviation change.
- **F-P6 Contract dependency:** `event: vault_video` (API §2.1) unchanged.
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + lint PASS; `tsc` green).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the one-attribute edit; run `tsc --noEmit` (green — verified this turn), then vite build.
2. Commit + push `development` (salmon-river serves dev + prod).
3. Verify in Theo: "show me a video of how the offside rule works" → the YouTube player now **plays inline** (no Error 153).
4. No Role-C (no contract change).

## §5 Out of scope
The `theo_find_video` handler, the `event: vault_video` frame, and the render layout (VEP B2) are unchanged. No CSP change (none exists). No autoplay. No backend change.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-FindVideo-EmbedReferrer-Fix-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the one-attribute edit, runs `tsc` + vite build, and pushes `development`. No Role-C (no contract change).
