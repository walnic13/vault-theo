# Theo Frontend — FindImage inline display (render `event: vault_image` from the tool result): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (implementation is Pass 3 against the approved Component Contract Table). The FE half of Option A: render a `theo_find_image` result **directly from the tool result** so the model never transcribes the (often long / percent-encoded) image URL into markdown — the transcription that produced the broken-image icon (Nadal, observed live 2026-07-23). The paired backend VEP emits an additive `event: vault_image` SSE frame carrying the exact URL (mirroring `event: vault_export`); this VEP consumes that frame across the existing streaming plumbing and renders the image inline **reusing the deployed VA-T1 image treatment** (the markdown `img` override in `lib/markdown.tsx`) — **no new component, no new VA-id, no new visual authority**. Four additive edits mirroring the `vault_export → download` path: `types.ts` (`InlineImage` + `Message.image`), `services/gateway.live.ts` (`StreamHandlers.onImage` + a `vault_image` parse branch), `useTheoState.ts` (`onImage` → `imagePayload` → `patchLastAssistant({ image })`), `components/ChatView.tsx` (an inline `<img>` after the download card). **This FE VEP deploys FIRST** (its handler is dormant until the backend emits frames — images meanwhile still render the old markdown way), then the backend VEP.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `f52a4e9679a307abd9b2b0f0cc84e9206340f236` (vault-theo, `development` — the commit that first contains this package; grounding reads performed against parent `78e1982dac1cc08accf2f7e7781d976ee6bbcacf`). The paired backend VEP (`event: vault_image` emission) is at vault-theo `Codex Governance/Theo-Backend-FindImage-InlineDisplay-Pass-1-VEP/` (APPROVED). Working tree also carried untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not source/governance, not grounding).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix, §4B VA registry, §6 CCT gates) | `Grep("Component Contract Table"/"Full Baseline"/"VA-T1")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT, §5 Allowed Deltas) | `Grep("Allowed Deltas"/"reproduce faithfully")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | `git rev-parse` this turn | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` | `git rev-parse` this turn | `b8155889ebfb44a153192e63796812a94aa87004` |
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 SSE frame family) | `Grep("event: vault_export")` this turn | `39aac571f29f94ebfb468902b41a0bb8d2c80329` |
| 8 | Deployed render authority — `src/theo/lib/markdown.tsx` (the VA-T1 `img` override reused here) | `Read` this turn | `b5e6ebde8bb9a7e0f08427148b64de63d6cd1754` |
| 9 | Structural-mirror targets — `src/theo/services/gateway.live.ts` `6199dc93dbaad45ee87c043db555df5a6347a0e5`; `src/theo/useTheoState.ts` `6ab96a966fa06f695aa33be5aa9dbc4e37cc2aa9`; `src/theo/types.ts` `d1ccaaeb53c7b734ef7556286ead60f0b1c2b9e7`; `src/theo/components/ChatView.tsx` `88fe1f31b2084a015d377b79ddd79e06e113485b` | `Read` this turn | (per file, left) |

VA registry (§4B): **VA-T1** (Theo surface / markdown rendering incl. the inline `img` override) — the sole visual authority; no new VA-id. Registered CURRENT in Conformance §4B (doc SHA `c614d51…`).

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT below — locks ChatView's full prop interface + VA-T1 citation + the `vault_image` data dependency |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Allowed Deltas" | §Structural Mirror — the inline `<img>` reuses the VA-T1 image treatment (same style object as the deployed markdown `img` override); a data-sourced delta, not a redesign |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below (complete: prop interface + VA-id + data dependency) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "event: vault_export" | §1 — the consumed `event: vault_image` frame is the additive sibling of the documented `event: vault_export` frame; parsed the same way |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/lib/markdown.tsx | img-override | "Inline image display" | §1/CCT — the render reuses this deployed VA-T1 `img` treatment (`maxWidth:100%`, `height:auto`, `borderRadius:8`) verbatim in style |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Prop interface (full TS; **unchanged** by this VEP) | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `ChatView` (`src/theo/components/ChatView.tsx`) | `interface ChatViewProps { messages: Message[]; loading: boolean; error: string; draft: string; attachments: ComposerAttachment[]; attachmentsAvailable: boolean; onDraftChange: (s: string) => void; onSend: (text?: string) => void; onStop: () => void; queuedText: string \| null; onCancelQueued: () => void; onAddFiles: (files: FileList \| File[]) => void; onAddPastedText: (text: string) => boolean; onRemoveAttachment: (localId: string) => void; chatProject: Project \| null; assistantName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode; voiceAvailable: boolean; recording: boolean; transcribing: boolean; recordingSeconds: number; onStartDictation: () => void; onStopDictation: () => void; onCancelDictation: () => void; playingIdx: number \| null; synthesizingIdx: number \| null; onReadAloud: (idx: number, text: string) => void; onStopReadAloud: () => void; reviewFund?: string; reviewMode?: boolean; sigmaMode?: boolean }` — **no prop added or changed**; the image arrives through the existing `messages: Message[]` prop (the `Message` type gains an optional `image?: InlineImage`, a data-type change, not a prop-signature change). | **VA-T1** (Theo surface / markdown rendering) — the inline `<img>` reuses the exact style of the deployed markdown `img` override (`lib/markdown.tsx`): `{ maxWidth: "100%", height: "auto", borderRadius: 8 }` (+ the download-card slot margin `4px 0 14px`). No new visual authority. | The additive `event: vault_image` SSE frame `{ url, title?, source?, pageUrl?, license?, creator? }` from `theo_message_stream` (API §2.1; paired backend VEP), parsed in `gateway.live.ts` → `StreamHandlers.onImage` → `useTheoState` sets `Message.image` → ChatView renders `<img src={m.image.url}>`. No new endpoint; consumed fields: `url` (required, https-guarded) + optional `title` (alt). |

New supporting type (`types.ts`): `interface InlineImage { url: string; title?: string; source?: string; pageUrl?: string; license?: string; creator?: string }` and `Message.image?: InlineImage`. Non-component service/state edits (`gateway.live.ts`, `useTheoState.ts`) are data-plumbing mirroring the deployed `onExport`/`exportPayload`/`download` path (Structural Mirror below), not visual components.

## Component Structural Mirror
Every edit mirrors the deployed `vault_export → FileDownload → download` path (the DR-T11 download-card plumbing), swapping the export payload for the image frame.

| Region | Deployed mirror (LIVE) | This VEP | Classification |
|---|---|---|---|
| `types.ts` payload type + `Message` field | `interface FileDownload {…}` + `Message.download?` | add `interface InlineImage {…}` + `Message.image?` | **EXACT mirror** (new sibling type + optional field) |
| `gateway.live.ts` handler type | `onExport?: (d: FileDownload) => void;` | add `onImage?: (img: InlineImage) => void;` | **EXACT mirror** |
| `gateway.live.ts` SSE parse | `if (evt.includes("event: vault_export")) { …onExport?.({…}); continue; }` | add `if (evt.includes("event: vault_image")) { …onImage?.({…}); continue; }` (https-guarded on `url`) | **EXACT mirror** (additive branch; no substring collision with existing event names) |
| `useTheoState.ts` accumulator + handler + finalize | `let exportPayload…; onExport: (d)=>{exportPayload=d; patchLastAssistant({download:d})}; …{download: exportPayload}` | `let imagePayload…; onImage: (img)=>{imagePayload=img; patchLastAssistant({image:img})}; …{image: imagePayload}` | **EXACT mirror** |
| `ChatView.tsx` render slot | `{m.download && <DownloadCard download={m.download} />}` | `{m.image && m.image.url && <img … VA-T1 style … />}` | **ALLOWED DELTA** — renders via the VA-T1 `img` treatment (reused verbatim) instead of a bespoke card; no new component/VA |

No DEVIATION rows. `DownloadCard`, the voice controls, `AgentActivity`, the review-agent stream reader, and all other regions are byte-unchanged.

## §1 Feature Identification + boundary
- **Feature:** consume `event: vault_image` and render the image inline from the tool result. The FE holds the exact URL (from the frame), so `<img src>` is set programmatically — the model never writes the URL, eliminating the markdown-transcription mangling (the broken-icon root cause).
- **Render authority:** the deployed VA-T1 markdown `img` override already displays `https` images with `maxWidth:100%`, rounded corners; this VEP renders the same `<img>` treatment from message state. No redesign, no new component (Golden Component Pack §5 Allowed Delta).
- **Boundary:** four additive edits (one optional `Message` field + parse/handler plumbing + one `<img>` render). No prop-signature change, no new component/VA-id, no endpoint, no persistence, no Tailwind, no new dependency. 1A mock path unaffected (mock never emits the frame).
- **Sequencing (deploy FIRST):** this FE change is harmless until the backend emits `vault_image` (the handler is dormant; images still render the old markdown way). It MUST deploy before the backend VEP so there is no interim where the model stops emitting markdown but the FE can't yet render the frame.

## §2 Gap Register
**PROCEED.**
- **(1) Deploy order.** FE first (dormant), backend second — §1 / paired-VEP §6. Disclosed, PROCEED.
- **(2) Ephemeral (not persisted).** `Message.image` is set from the live stream only; on conversation reload the image is absent (the backend persists the model's text, which — post backend-VEP — no longer contains the URL). This parallels the download card (also live-turn-only). Acceptable for v1; a later enhancement could persist an image reference. Disclosed, PROCEED.
- **(3) https guard.** The parser only invokes `onImage` when `url` starts `https://`; the handler URL is guaranteed on `upload.wikimedia.org` / `api.openverse.org` (handler VEP). `<img>` needs no markdown escaping (no transcription). PROCEED.
- **(4) Attribution.** `source`/`license`/`creator`/`pageUrl` are carried on `InlineImage` for a future caption; v1 renders the image only and relies on the model's prose caption (backend-VEP tool description instructs it to mention creator/license for Openverse). No new component needed now. Disclosed, PROCEED.
- **(5) No new VA-id / reference artifact.** Reuses VA-T1; §4B unchanged. PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Feature/scope:** §1 — inline image render from `event: vault_image`.
- **F-P2 Visual authority:** VA-T1 (markdown `img` override) reused; no new VA (§4B unchanged).
- **F-P3 Component Contract Table:** above — ChatView prop interface (unchanged) + VA-T1 + `vault_image` data dependency.
- **F-P4 Structural mirror:** the deployed `vault_export → download` plumbing (table above).
- **F-P5 Allowed-delta check:** the `<img>` reuses the VA-T1 style object; data-sourced delta, no redesign (Golden Component Pack §5).
- **F-P6 Contract dependency:** `event: vault_image` (API §2.1; paired backend VEP) — additive; absent frame = no image (safe).
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + Structural Mirror + lint PASS).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod served from `development`)
1. Apply the four edits to the repo files (diffs in this pack); run `tsc --noEmit` FIRST (vite build skips typecheck — a type error would ship a white screen), then the vite build.
2. Commit + push `development` (salmon-river serves both dev and prod Theo from the push).
3. **Deploy BEFORE** the paired backend VEP. Walter verifies in Theo after the backend also ships: "show me an image of Nadal winning the French Open" → the image renders inline (no broken icon); a normal chat turn is unchanged.

## §5 Out of scope
The backend `event: vault_image` emission + the `theo_find_image` tool-description change are the paired **backend** VEP (already APPROVED). No new component/card, no new VA-id/reference artifact, no persistence, no attribution caption (v1), no premium.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-FindImage-InlineDisplay-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the four edits, runs `tsc` + vite build, and pushes `development` (deploying FIRST, before the paired backend VEP).
