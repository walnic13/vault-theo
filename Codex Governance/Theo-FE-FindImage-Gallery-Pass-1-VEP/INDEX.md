# Theo Frontend — FindImage gallery + per-image caption render: Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (implementation is Pass 3). The FE half of the gallery program: render the `theo_find_image` results as a **grid of images, each with a caption underneath** (source caption + source + link + licence), consuming the `images[]` array now carried on the deployed `event: vault_image` frame. Walter-directed 2026-07-23: (a) "mini-gallery" of the top results; (b) "images need to return data summarising each image, probably in a caption underneath each image" — the per-image caption gives the provenance he was missing (what the image is + where it's from), from the data the handler already returns (`title`/`source`/`pageUrl`/`license`/`creator`), attributed, not model-guessed. Reuses the deployed VA-T1 image treatment for the images; the multi-image grid + caption is a **Walter-directed VISUAL-AUTHORITY-DEVIATION** (Golden Component Pack §5/§21A). Three additive FE edits: `types.ts` (`InlineImageItem` + `InlineImage.images[]`), `services/gateway.live.ts` (carry `images[]` off the frame), `components/ChatView.tsx` (the gallery+caption render, replacing the single `<img>`). A single result renders as one image + caption (backward-compatible). `tsc --noEmit` verified green this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `57d835edba65b76073bcfb0eb5947f3c338b54d0` (vault-theo, `development` — the commit that first contains this re-grounded package; grounding reads against parent `9e9de5402d269588b961699ba1b2932f8f40524d` — the API-Spec Role-C commit that lands the `images[]` contract into accepted authority). **T22 pre-existence (resolves the Pass-2 REJECT):** the cited contract shapes now EXIST in accepted authority at the grounding parent — API Spec §2.1 documents `event: vault_image` `data: { …, images }` (gallery array), and §2.15 documents the `theo_find_image` 200 `data:{ …, images }`, both at blob `1d47ca209cc9572036efc91c9cd86ea13dae25ca`. The Role-C transcribes the already-deployed, Codex-approved backend (`images[]` on the frame — func-stream VEP; `images[]` in the handler response — vault-theo-tools gallery handler, golden-verified 2026-07-23). No proceed-gap remains: the contract is authority-resident before this FE VEP, per the deploy → Role-C applied → FE VEP sequence. Working tree also carried untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not source/governance, not grounding).
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
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `event: vault_image` `data:{…,images}`; §2.15 theo_find_image `data:{…,images}`) — the `images[]` contract now authority-resident (Role-C `9e9de54`) | `Grep("event: vault_image")` this turn | `1d47ca209cc9572036efc91c9cd86ea13dae25ca` |
| 8 | Deployed render authority — `src/theo/lib/markdown.tsx` (the VA-T1 `img` treatment reused) | `Read` this turn | `b5e6ebde8bb9a7e0f08427148b64de63d6cd1754` |
| 9 | Edited — `src/theo/types.ts` `9d5f4591a163a4d90b4c0975ce46eea7ad1c7719`; `src/theo/services/gateway.live.ts` `1e7048e31c7c505c2fd2778327763a2cef8783a5`; `src/theo/components/ChatView.tsx` `d002bbba613332c07ec65afd5c98badd3f5215e4` | `Read` this turn | (per file, left) |

VA registry (§4B): **VA-T1** (Theo surface / image treatment) is the reused authority; the multi-image grid + per-image caption is a **VISUAL-AUTHORITY-DEVIATION** of VA-T1, Walter-directed (§21A) — no new VA-id.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "VISUAL-AUTHORITY-DEVIATION" | §1/CCT — the gallery grid + per-image caption is a VISUAL-AUTHORITY-DEVIATION of VA-T1, Walter-directed (§21A) 2026-07-23 |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT — full ChatViewProps + VA-T1 citation + the `vault_image images[]` data dependency |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "event: vault_image" | §1 — the FE consumes the `images[]` array carried on this deployed frame |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/lib/markdown.tsx | img-override | "Inline image display" | §1/CCT — each gallery image reuses this deployed VA-T1 `img` treatment (`maxWidth`/`height`/`borderRadius`) |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Prop interface (full TS; **unchanged** by this VEP) | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `ChatView` (`src/theo/components/ChatView.tsx`) | `interface ChatViewProps { messages: Message[]; loading: boolean; error: string; draft: string; attachments: ComposerAttachment[]; attachmentsAvailable: boolean; onDraftChange: (s: string) => void; onSend: (text?: string) => void; onStop: () => void; queuedText: string \| null; onCancelQueued: () => void; onAddFiles: (files: FileList \| File[]) => void; onAddPastedText: (text: string) => boolean; onRemoveAttachment: (localId: string) => void; chatProject: Project \| null; assistantName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode; voiceAvailable: boolean; recording: boolean; transcribing: boolean; recordingSeconds: number; onStartDictation: () => void; onStopDictation: () => void; onCancelDictation: () => void; playingIdx: number \| null; synthesizingIdx: number \| null; onReadAloud: (idx: number, text: string) => void; onStopReadAloud: () => void; reviewFund?: string; reviewMode?: boolean; sigmaMode?: boolean }` — **no prop added/changed**; images arrive via the existing `messages: Message[]` prop (`Message.image: InlineImage` now carries `images?: InlineImageItem[]`, a data-type change). | **VA-T1** (Theo image treatment), reused for each image; the multi-image grid + caption is a **VISUAL-AUTHORITY-DEVIATION** of VA-T1, Walter-directed (§21A). No new VA-id. | The `images[]` array on the deployed `event: vault_image` SSE frame (API §2.1) — each item `{ imageUrl, title?, source?, pageUrl?, license?, creator? }` from the deployed gallery handler (API §2.15). Parsed in `gateway.live.ts` → `onImage` → `Message.image.images`; consumed fields: `imageUrl` (https), `title`/`source`/`pageUrl`/`license`/`creator` (caption). No new endpoint. |

New supporting type (`types.ts`): `interface InlineImageItem { imageUrl: string; title?: string; source?: string; pageUrl?: string; license?: string; creator?: string }` + `InlineImage.images?: InlineImageItem[]`. `gateway.live.ts` is data-plumbing (carry `images[]`); `useTheoState` unchanged (passes the whole `image` object through).

## Component Structural Mirror
Mirrors the deployed single-image `vault_image` render (VEP FindImage-InlineDisplay) — extended to a list with captions.

| Region | Deployed (LIVE) | This VEP | Classification |
|---|---|---|---|
| `types.ts` | `InlineImage { url, title?, source?, pageUrl?, license?, creator? }` | add `InlineImageItem` + `InlineImage.images?: InlineImageItem[]` | **EXACT mirror** (additive sibling type + optional field) |
| `gateway.live.ts` `event: vault_image` parse | reads `url`/`title`/`source`/`pageUrl`/`license`/`creator` | add `images: Array.isArray(j.images) ? j.images : undefined` | **EXACT mirror** (additive passthrough) |
| `ChatView.tsx` render | `{m.image && m.image.url && <img … VA-T1 style …/>}` (single) | a grid of `{ <a><img VA-T1 style/></a> + <figcaption> caption }`; falls back to the single `m.image.url` as a 1-item list | **VISUAL-AUTHORITY-DEVIATION** of VA-T1 (grid + caption), Walter-directed §21A; each `<img>` reuses the VA-T1 treatment |
| `useTheoState` / other renders | unchanged | unchanged | **EXACT** |

No DEVIATION rows beyond the disclosed, Walter-directed VISUAL-AUTHORITY-DEVIATION.

## §1 Feature Identification + boundary
- **Render:** `ChatView` maps `m.image.images` (or the single `m.image.url` as a 1-item list) to a responsive grid (`repeat(auto-fill, minmax(200px,1fr))` for multi; single column for one). Each cell = a `<figure>` with the image (VA-T1 treatment: `borderRadius`, `objectFit:"cover"` at a fixed height for the grid; full-width `height:auto` for a single) wrapped in an `<a target=_blank>` to `pageUrl` (source), and a `<figcaption>` caption underneath: **source caption (`title`, in `C.ink2`) · source · creator · licence** (muted `C.ink3`) — the provenance data Walter asked for, from the handler's `images[]`, attributed (never model-guessed).
- **Why:** the image was right but Theo was vague about *what* it was; the tool already returns each image's source caption + source + link + licence, so the FE surfaces it as an honest per-image caption.
- **Boundary:** three additive FE edits; **no prop-signature change**, no new component file, no new VA-id (VA-T1 reused; the grid+caption is a Walter-directed VISUAL-AUTHORITY-DEVIATION), no new endpoint, no persistence, no Tailwind, no new dependency. `tsc --noEmit` green (verified this turn). 1A mock path unaffected.
- **Deploy timing:** the paired backend (`images[]` on the frame) is already live, so this FE change lights up the gallery on deploy; before it, the single top image renders (as today) — no ordering constraint.

## §2 Gap Register
**PROCEED.**
- **(1) VISUAL-AUTHORITY-DEVIATION (Walter-directed).** The multi-image grid + per-image caption exceeds VA-T1's single-image treatment; classified VISUAL-AUTHORITY-DEVIATION per Golden Component Pack §5/§21A, Walter-directed 2026-07-23 (mini-gallery + captions). Each image still uses the VA-T1 treatment. Disclosed, PROCEED.
- **(2) Caption is source-verifiable, not model-generated.** The caption shows the handler-returned `title` (the source's own caption) + `source`/`creator`/`licence` — attributed provenance, no hallucination. If a source `title` is generic, the caption is still honest (what the source says). PROCEED.
- **(3) Ephemeral.** `images[]` (and the blob-SAS URLs) are live-turn only (parallels the single image + download card). PROCEED.
- **(4) Role-C — ALREADY LANDED (NO-GAP).** API §2.15 (`images[]`) + §2.1 (`images[]` on `vault_image`) gallery documentation is already in accepted authority at the grounding parent (Role-C commit `9e9de54`, API Spec blob `1d47ca20`), landed before this FE VEP to satisfy T22 contract pre-existence. No documentation work remains for this VEP. NO-GAP.
- **(5) No new VA-id/reference-artifact** (VA-T1 reused). PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** gallery grid + per-image provenance caption from `images[]`.
- **F-P2 Visual authority:** VA-T1 reused; grid+caption = VISUAL-AUTHORITY-DEVIATION (§21A, Walter-directed); no new VA-id.
- **F-P3 CCT:** above — ChatView prop interface (unchanged) + VA-T1 + `vault_image images[]` dependency.
- **F-P4 Structural mirror:** the deployed single-image `vault_image` render (table above).
- **F-P5 Allowed-delta / deviation:** grid+caption is a Walter-directed VISUAL-AUTHORITY-DEVIATION (§5/§21A); images reuse VA-T1.
- **F-P6 Contract dependency:** `images[]` on `event: vault_image` (API §2.1; deployed) from the gallery handler (API §2.15; deployed).
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + Structural Mirror + lint PASS; `tsc` green).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the three edits; run `tsc --noEmit` (green — verified this turn), then vite build.
2. Commit + push `development` (salmon-river serves dev + prod).
3. Verify in Theo: "show me the moment Nadal won the French Open" → a **gallery** of relevant shots, each with a caption underneath (source caption · source · link); single-result queries render one image + caption.
4. Role-C: **already landed** (commit `9e9de54`, API Spec §2.15 `images[]` + §2.1 `images[]` on `vault_image`, blob `1d47ca20`) — no documentation step remains for this deploy.

## §5 Out of scope
The gallery handler (`images[]`) and the frame carry are the deployed vault-theo-tools + func-stream VEPs. No new component/VA-id/reference-artifact (VA-T1 reused). No lightbox/zoom beyond the source-link `<a>` (a future enhancement). No persistence. No premium.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-FindImage-Gallery-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the three edits, runs `tsc` + vite build, and pushes `development`. The paired API-Spec Role-C is **already landed** (commit `9e9de54`) — no further documentation step remains.
