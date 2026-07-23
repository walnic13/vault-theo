# Theo Frontend — FindVideo in-chat player / thumbnail link-card render: Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (implementation is Pass 3). The FE half of the video program: render the `theo_find_video` result inline from the deployed `event: vault_video` SSE frame — an **in-chat YouTube `<iframe>`** (responsive 16:9, privacy-enhanced `youtube-nocookie.com/embed/<id>` from the frame's `embedUrl`) when embeddable, else a **thumbnail link-card** opening `videoUrl` in a new tab. Walter-directed 2026-07-23 ("best user experience" = in-chat embeds). Reuses the deployed image treatment idiom (bordered/rounded media + a muted caption of `title · source · duration`); the video player/link-card is a **Walter-directed VISUAL-AUTHORITY-DEVIATION** (Golden Component Pack §5/§21A). Four additive FE edits: `types.ts` (`InlineVideo` + `Message.video`), `services/gateway.live.ts` (parse `event: vault_video` → `onVideo`), `useTheoState.ts` (wire `onVideo` → `message.video`, persisted like `image`), `components/ChatView.tsx` (the player/link-card render). **No CSP edit** — grounding found no Content-Security-Policy on the Theo SWA (`staticwebapp.config.json`) nor on the `vault-origin` host, so the YouTube iframe is permitted with no `frame-src` change (forward-note: if a CSP is ever introduced, it MUST include `https://www.youtube-nocookie.com`). `tsc --noEmit` verified green this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `<PKG_COMMIT_SHA>` (vault-theo, `development` — the commit that first contains this package; grounding reads against parent `fbbb01970e26f595977b5c4dd5591e3e1f8d682a` — the commit that lands the deployed `event: vault_video` contract into accepted authority). **T22 pre-existence:** the cited contract exists in accepted authority at the grounding parent — API Spec §2.1 documents `event: vault_video` `data: { videoUrl, embedUrl, title, thumbnail, source, duration, date }` and §2.16 documents the `theo_find_video` handler, both at blob `da7dc80f7ea48fabafa136418aae2e3f6c65114a`. The paired backend is live: the `event: vault_video` frame is DEPLOYED + SSE-verified on func-stream (chat-tools registration + frame VEP), and the `theo_find_video` handler is DEPLOYED + golden-verified on vault-theo-tools. Working tree also carried untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not source/governance, not grounding).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix, §6 CCT gates, §4B VA registry) | `Grep("Component Contract Table")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT, §5 Allowed Deltas / VISUAL-AUTHORITY-DEVIATION / §21A) | `Grep("VISUAL-AUTHORITY-DEVIATION")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | `git rev-parse` this turn | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` | `git rev-parse` this turn | `b8155889ebfb44a153192e63796812a94aa87004` |
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `event: vault_video`; §2.16 theo_find_video) — the contract is authority-resident (Role-C `fbbb019`) | `Grep("event: vault_video")` this turn | `da7dc80f7ea48fabafa136418aae2e3f6c65114a` |
| 8 | Deployed render authority — `src/theo/lib/markdown.tsx` (the VA-T1 media treatment the render idiom follows) | `Read` this turn | `b5e6ebde8bb9a7e0f08427148b64de63d6cd1754` |
| 9 | Host CSP check — `staticwebapp.config.json` (Theo SWA) + `vault-origin` sibling `staticwebapp.config.json` | `Read`/`Grep` this turn | no CSP present on either (see §2) |
| 10 | Edited — `src/theo/types.ts` `6ac0be28c00ef6e4cf8e23d1eaeb553b3bfd2b1a`; `src/theo/services/gateway.live.ts` `0a46c41acfb0c9fb4a153bdcb268f35e8c3865cc`; `src/theo/useTheoState.ts` `a2dd3a55355461c32538cc0bd32557a1e6efbbf5`; `src/theo/components/ChatView.tsx` `d1c068ed5002bec9a5200216b50ae6b9da108359` | `Read` this turn | (per file, left) |

VA registry (§4B): the deployed image treatment is the reused idiom (bordered/rounded media + muted caption); the video **in-chat player + thumbnail link-card** is a **VISUAL-AUTHORITY-DEVIATION**, Walter-directed (§21A) — no new VA-id.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "VISUAL-AUTHORITY-DEVIATION" | §1/CCT — the in-chat player + link-card is a VISUAL-AUTHORITY-DEVIATION, Walter-directed (§21A) 2026-07-23 |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT — full ChatViewProps + VA citation + the `event: vault_video` data dependency |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "event: vault_video" | §1 — the FE consumes the `event: vault_video` frame documented here |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/lib/markdown.tsx | img-override | "Inline image display" | §1/CCT — the thumbnail/link-card media reuses the deployed inline-media treatment (`borderRadius`, `objectFit`, `border`) |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Prop interface (full TS; **unchanged** by this VEP) | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `ChatView` (`src/theo/components/ChatView.tsx`) | `interface ChatViewProps { messages: Message[]; loading: boolean; error: string; draft: string; attachments: ComposerAttachment[]; attachmentsAvailable: boolean; onDraftChange: (s: string) => void; onSend: (text?: string) => void; onStop: () => void; queuedText: string \| null; onCancelQueued: () => void; onAddFiles: (files: FileList \| File[]) => void; onAddPastedText: (text: string) => boolean; onRemoveAttachment: (localId: string) => void; chatProject: Project \| null; assistantName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode; voiceAvailable: boolean; recording: boolean; transcribing: boolean; recordingSeconds: number; onStartDictation: () => void; onStopDictation: () => void; onCancelDictation: () => void; playingIdx: number \| null; synthesizingIdx: number \| null; onReadAloud: (idx: number, text: string) => void; onStopReadAloud: () => void; reviewFund?: string; reviewMode?: boolean; sigmaMode?: boolean }` — **no prop added/changed**; the video arrives via the existing `messages: Message[]` prop (`Message.video?: InlineVideo`, a data-type addition). | Deployed inline-media treatment reused for the thumbnail; the in-chat player + link-card is a **VISUAL-AUTHORITY-DEVIATION**, Walter-directed (§21A). No new VA-id. | The `event: vault_video` SSE frame (API §2.1) — `{ videoUrl, embedUrl?, title?, thumbnail?, source?, duration?, date? }` from the deployed `theo_find_video` handler (API §2.16). Parsed in `gateway.live.ts` → `onVideo` → `useTheoState` → `Message.video`. Consumed fields: `embedUrl` (iframe `src`), `videoUrl` (link-card href), `thumbnail`/`title`/`source`/`duration` (link-card + caption). No new endpoint, no new prop. |

Structural mirror (the render idiom): the video block mirrors the deployed `event: vault_image` render pattern in the same `ChatView` map (a `m.video && m.video.videoUrl` guarded block placed directly after the `m.image` block), reusing the bordered/rounded media + muted `C.ink3` caption idiom; `useTheoState` wires `onVideo`/`videoPayload` byte-parallel to `onImage`/`imagePayload` (declare → assign in handler → include in the final `patchLastAssistant`).

## §1 Feature Identification + boundary
- **Render:** `ChatView` renders `m.video` inline: if `embedUrl` is present, a responsive **16:9 YouTube `<iframe>`** (`youtube-nocookie.com/embed/<id>`, `loading="lazy"`, `allowFullScreen`, `maxWidth: 560`) with a caption underneath (`title · source · duration`); else a **thumbnail link-card** (`<a target=_blank>` to `videoUrl` with the `thumbnail` + `title`/`source`/`duration`). No autoplay. Directly from the frame — the model never transcribes a URL.
- **Why:** delivers the "watch it in chat" experience Walter asked for, using the provenance the handler already returns; the privacy-enhanced `youtube-nocookie` embed avoids third-party cookies.
- **Boundary:** four additive FE edits; **no prop-signature change**, no new component file, no new VA-id, no new endpoint, no persistence beyond the existing per-message state, no Tailwind, no new dependency, **no CSP change** (none exists to amend). `tsc --noEmit` green (verified this turn). 1A mock path unaffected.
- **Deploy timing:** the paired backend (`theo_find_video` handler + the `event: vault_video` frame) is already live, so this FE change lights up the in-chat player on deploy; before it, the frame is silently ignored (no regression).

## §2 Gap Register
**PROCEED.**
- **(1) VISUAL-AUTHORITY-DEVIATION (Walter-directed).** The in-chat iframe player + thumbnail link-card exceed the image treatment; classified VISUAL-AUTHORITY-DEVIATION per Golden Component Pack §5/§21A, Walter-directed 2026-07-23 (best-UX in-chat embeds). Disclosed, PROCEED.
- **(2) No CSP allowance needed — grounded NO-GAP.** Grounding found no `Content-Security-Policy` on the Theo SWA (`staticwebapp.config.json` sets only `navigationFallback` + a CORS `Access-Control-Allow-Origin`) nor on the `vault-origin` host SWA config — so the `youtube-nocookie.com` iframe is permitted with no `frame-src` change. **Forward-note:** if a CSP is ever introduced on either the Theo SWA or the `vault-origin` host, it MUST include `frame-src https://www.youtube-nocookie.com` (and `https://www.youtube.com`) or the embed will be blocked. Recorded, PROCEED.
- **(3) Ephemeral.** `event: vault_video` is live-turn only and persisted on the message exactly like `image`/`download` (`useTheoState` final patch). PROCEED.
- **(4) Role-C — already landed.** API §2.1 (`event: vault_video`) + §2.16 (`theo_find_video`) are DEPLOYED at the grounding parent (`fbbb019`). No documentation work remains for this VEP. NO-GAP.
- **(5) No new VA-id / reference-artifact** (deployed media idiom reused). PROCEED.
- **(6) Non-YouTube results.** `embedUrl:""` → the link-card branch (thumbnail + `videoUrl`), so non-embeddable results still render usefully. PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** in-chat player / thumbnail link-card from `event: vault_video`.
- **F-P2 Visual authority:** deployed media idiom reused; player/link-card = VISUAL-AUTHORITY-DEVIATION (§21A, Walter-directed); no new VA-id.
- **F-P3 CCT:** above — ChatView prop interface (unchanged) + VA + `event: vault_video` dependency.
- **F-P4 Structural mirror:** the deployed `event: vault_image` render + `onImage`/`imagePayload` wiring (video block/wiring is byte-parallel).
- **F-P5 Allowed-delta / deviation:** player/link-card is a Walter-directed VISUAL-AUTHORITY-DEVIATION (§5/§21A); the thumbnail reuses the media treatment.
- **F-P6 Contract dependency:** `event: vault_video` (API §2.1; DEPLOYED) from the `theo_find_video` handler (API §2.16; DEPLOYED).
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + structural mirror + lint PASS; `tsc` green).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the four edits; run `tsc --noEmit` (green — verified this turn), then vite build.
2. Commit + push `development` (salmon-river serves dev + prod).
3. Verify in Theo: "show me a video of how the offside rule works" → an **in-chat YouTube player** with a caption; a non-YouTube result renders a thumbnail link-card.
4. Role-C: **already landed** (API §2.1 `event: vault_video` + §2.16, commit `fbbb019`) — no documentation step remains.

## §5 Out of scope
The `theo_find_video` handler + the `event: vault_video` frame are the deployed vault-theo-tools + func-stream VEPs. No new component/VA-id/reference-artifact. No autoplay, no playlist, no in-chat scrubbing beyond the native iframe controls. No CSP change (none exists). No persistence beyond the existing message state. No premium.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-FindVideo-Render-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the four edits, runs `tsc` + vite build, and pushes `development`. The paired Role-C (API §2.1 `event: vault_video` + §2.16) is **already landed** (`fbbb019`) — no further documentation step remains.
