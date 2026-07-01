# Theo 1B — B4h-FE Artifacts Persistence (persist-on-ingest + gallery + reload re-derive) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against a scratch copy of `src`, reverted) and Walter redeploys the Theo SWA. **Microstep:** wire the deployed B4h artifact endpoints (`theo_upsert_artifact` / `theo_list_artifacts` / `theo_get_artifact`, API Spec §2.3) so artifacts actually **persist**: (1) **persist-on-ingest** — after a reply's `[[ARTIFACT]]` blocks are ingested during `send`, best-effort `theo_upsert_artifact` (create-or-add-version by title), tagged with the conversation; (2) **cross-chat gallery** — the Artifacts tab loads `theo_list_artifacts` (summaries) on mount / on open; clicking one fetches `theo_get_artifact` (versions + content from Blob) into the panel; (3) **reload re-derive** — reopening a chat rebuilds its in-thread artifacts by re-running the ingest pipeline over each persisted assistant turn (the raw `[[ARTIFACT]]` blocks are retained in `theo_messages.content` — verified live), so reopened chats render their artifact cards again. Behind the single `theoClient` boundary; no new backend; no browser storage.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `db79681` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack. **Visual-authority DEVIATION** turn (minor; like B4e–B4g): `ArtifactsView` now renders persisted-artifact **summaries** (metadata: type/version/updated) rather than in-memory `Artifact`s with a body preview (the gallery list carries no content — content is fetched on open). Per FE Governor a planned visual deviation is valid when **cited + classified (VISUAL-AUTHORITY-DEVIATION) + Rule-Anchored**, with **Walter** as the exemption authority — he directed artifacts persistence this session ("let's knock out artifacts persistence"; "the artifacts section doesn't seem to work"). VA-T1 read this turn (`frontend/theo-frontend-reference.jsx` artifacts region). Consumed endpoints are DEPLOYED + golden-verified (B4h `9c9c4d8`) and documented in API-Spec §2.3 (landed `db79681`). The design fact that reopened chats can re-derive artifacts client-side was **verified this turn by read-only SQL** (13/71 assistant turns retain the raw `[[ARTIFACT]]` markers in `theo_messages.content`). The eight proposed files were applied to a scratch copy of `src` this turn and pass `npm run typecheck` (exit 0) + `eslint .` (exit 0) + `npm run build` (TheoSurface 236.97 KB / 70.44 KB gzip); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§ UI Authority Reconciliation; §exemption authority) | `git grep -F "A planned visual deviation must be cited and classified" / "Walter is the execution, runtime-acceptance, and exemption authority"` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B; §6) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 deltas) | `git grep -F "three locked surfaces" / "service-module/gateway abstraction"` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (Artifacts surface) | cited (surface authority) | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 5 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4 artifacts CRUD) | `git grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 6 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.3 artifacts — landed) | `git grep -F "upsert / list / get / delete artifacts"` this turn | `4808c4dd6d43013c6defe94e636542e47d639449` |
| 7 | ACTIVE (modify) — `src/theo/types.ts` (add `ArtifactSummary`) | `Read(full)` this turn | `992c36fe7f553a871867c846e978cf70af0c177b` |
| 8 | ACTIVE (modify — state owner) — `src/theo/useTheoState.ts` | `Read(full)` this turn | `0d5b41519d6a2b54e11597a795c623f56a115544` |
| 9 | ACTIVE (modify) — `src/theo/TheoSurface.tsx` | `Read(full)` this turn | `790c2a19d2b9c1c0e17bd9044e93083f44c17340` |
| 10 | ACTIVE (modify) — `src/theo/services/theoClient.ts` | `Read(full)` this turn | `5405dc0a00a3bf87460905a5a0e748a66a744c8b` |
| 11 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` | `Read(full)` this turn | `034f671dff50b14e7da5b51f8a7ef7222fdf1fac` |
| 12 | ACTIVE (modify) — `src/theo/services/gateway.mock.ts` | `Read(full)` this turn | `223284d8dae70a38848d00e2e70cca0391415e1f` |
| 13 | ACTIVE (modify) — `src/theo/components/ArtifactsView.tsx` | `Read(full)` this turn | `617d67619baef27862f3357eb7cd13896bd7d2c1` |
| 14 | ACTIVE (modify) — `src/theo/components/TheoMain.tsx` | `Read(full)` this turn | `ce2b4870491687db7def5a29584c513c300f48b7` |
| 15 | **Reused-unchanged** — `src/theo/lib/artifacts.ts` (parseArtifacts/upsert/remapToIds) | `Read(full)` this turn | `7d08753015398d23be0de6704e59d7c72aeb7c06` |
| 16 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (artifacts region) | `Grep("Artifacts\|ARTIFACT")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §UI-Auth | "A planned visual deviation must be cited and classified" | §F-P2 — the gallery-summary render is classified VISUAL-AUTHORITY-DEVIATION + anchored |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §authority | "Walter is the execution, runtime-acceptance, and exemption authority" | §F-P2 — Walter directed artifacts persistence (exemption authority) |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §F-P1 — artifacts persistence is the named B4 surface |
| spec/THEO_API_SPEC.md | §2.3 | "upsert / list / get / delete artifacts" | §F-P3 — consumes the deployed §2.3 endpoints |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P2 — persist/list/get behind `theoClient` (ALLOWED DELTA) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT rows carry full interface + VA-id + contract dependency |

---

## F-P1 — Feature identification
**Microstep:** artifacts persistence FE — the visible completion of Tier B4 ("… + artifacts + settings CRUD"). With B4h-backend live (upsert/list/get/delete over `theo_artifacts` + Blob-pointer versions), B4h-FE wires it in three parts:
1. **Persist-on-ingest** — `send` best-effort `theo_upsert_artifact({title,type,content,conversation_id})` for each parsed `[[ARTIFACT]]` block (create-or-add-version by title, matching the in-memory `upsert`), then refresh the gallery.
2. **Cross-chat gallery** — the Artifacts tab (`ArtifactsView`) loads `theo_list_artifacts` summaries on mount + on open; a card click fetches `theo_get_artifact` (versions + content from Blob) and opens it in `ArtifactPanel`.
3. **Reload re-derive** — `selectRecent` rebuilds the reopened thread's in-memory artifacts by re-running `ingestReply` over each persisted assistant turn (the raw `[[ARTIFACT]]` blocks are retained in `theo_messages.content` — verified this turn), swapping markers for artifact-card placeholders so reopened chats render their cards.

Walter directed this ("let's knock out artifacts persistence"; "the artifacts section doesn't seem to work"). Behind `theoClient`; no backend change.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (Artifacts gallery grid) | `ArtifactsView` now renders **persisted summaries** (`ArtifactSummary`: type · v{n} · "Updated …") instead of in-memory `Artifact`s with a content-body preview — the list endpoint returns metadata only (content is fetched on open, from Blob). Card chrome (grid, icon, type pill, title) is otherwise preserved; only the third line changes from a body excerpt to an updated/"Click to open" line. Cited + classified + Rule-Anchored; **Walter-authorized**. | **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3) |
| VA-T1 (ArtifactCard / ArtifactPanel / in-thread) | **Unchanged.** In-thread cards + the versioned side panel render the in-memory `Artifact` exactly as before; reload re-derivation reconstructs those in-memory artifacts, so the surface is identical to a freshly-streamed thread. | VISUAL-AUTHORITY-MATCH |
| Gateway / service abstraction (Golden §5) | `persistArtifact` / `listServerArtifacts` / `getServerArtifact` added behind `theoClient` → `gateway.live` (mock fallback). | ALLOWED DELTA |

No un-cited deviation. No browser→model call. `ArtifactCard`, `ArtifactPanel`, `ChatView`, `Sidebar`, `ProjectsView`, `ProjectDetail`, `ui.tsx`, `lib/artifacts.ts` unchanged.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Standalone harness** has no backend — persist is a no-op (stub id) and the gallery is empty; the in-memory + reload-re-derive paths still work (mock chat replies rarely emit `[[ARTIFACT]]`). | **PROCEED** — harness-only; the live SWA (Walter's acceptance surface) exercises the real endpoints. |
| **G-2** | **Best-effort persist.** A failed `theo_upsert_artifact` during `send` is swallowed — the artifact still shows live (in-memory) and, because the raw `[[ARTIFACT]]` block is in the persisted turn, a later reload re-derives it; only the gallery row is delayed until the next successful persist. | **PROCEED (intended)** — persistence never blocks the delivered turn. |
| **G-3** | **Gallery vs in-thread id spaces.** Gallery artifacts use server uuids; in-thread (re-derived) artifacts use client ids. They are separate concerns (gallery list vs open-thread cards); opening a gallery artifact merges the fetched `Artifact` into the in-memory set by its server id so the panel resolves it. | **PROCEED** — no collision (distinct id spaces; panel looks up by whichever id `openArt` holds). |
| **G-4** | **Re-derive + citations.** A reopened assistant turn that both cited sources AND emitted an artifact: the re-derived `display` (markers → placeholders) is used for BOTH the message content and the single reload `CitedRun.text`, so `[[ARTIFACT]]` never shows in a cited span. | **PROCEED** — handled in `selectRecent`. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`.

## F-P3 — Backend / contract grounding
Consumes the deployed, golden-verified B4h endpoints (API Spec §2.3, landed `db79681`):
- **Persist:** `POST /api/theo_upsert_artifact {title,type,content,conversation_id?}` → `{ artifact:{ id, current_version, … } }` (201 new / 200 new-version), owner-scoped, content→Blob.
- **Gallery list:** `GET /api/theo_list_artifacts` → `{ artifacts:[{ id, title, type, current_version, updated_at, … }] }` newest-updated-first (metadata only).
- **Open:** `GET /api/theo_get_artifact?artifactId=<uuid>` → `{ artifact:{ …, versions:[{ version_number, content, … }] } }` (content read from Blob).
- **Transport/auth:** absolute `${VITE_FUNCTIONS_URL}/api/...` + Bearer (same as every other call); mock fallback unconfigured. No backend change in this pack.

## F-P4 — Component reference grounding
**Modified:** `types.ts` (`ArtifactSummary`), `services/theoClient.ts` (`ingestReply` returns blocks; `resetArtifacts`/`mergeArtifact`; `persistArtifact`/`listServerArtifacts`/`getServerArtifact` passthroughs), `services/gateway.live.ts` (three live calls + `RawArtifact` → `ArtifactSummary`/`Artifact` mappers), `services/gateway.mock.ts` (stubs), `useTheoState.ts` (state owner — `galleryArtifacts`, `loadGalleryArtifacts`, persist-on-ingest in `send`, reload re-derive in `selectRecent`, `openGalleryArtifact`, gallery-load on `go("artifacts")`, in-memory reset on `newChat`/`startInProject`), `components/ArtifactsView.tsx` (render summaries), `components/TheoMain.tsx` (gallery props), `TheoSurface.tsx` (load gallery on mount). **Reused-unchanged:** `lib/artifacts.ts` (parseArtifacts/upsert/remapToIds), `ArtifactCard`, `ArtifactPanel`. Governing authority = VA-T1 (minor deviation, Walter-authorized) + Golden Component Pack (§3 CCT, §5 abstraction) + the deployed §2.3 contract.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; required-before-optional; `on<Event>`; full TS interfaces.

| # | Module (ownership; ACTIVE/NEW) | Interface / behavior (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `types.ts` (**ACTIVE**, modify) | Adds `export interface ArtifactSummary { id: string; title: string; type: ArtifactType; currentVersion: number; updated: string }` (gallery row; metadata only — the in-memory `Artifact` keeps carrying `versions`). | VA-T1 (no surface) | API Spec §2.3 | PROCEED |
| TC-2 | `services/gateway.mock` (**ACTIVE**, modify) | Adds `persistArtifact(input): Promise<{id:string;currentVersion:number}>` (stub id), `listServerArtifacts(): Promise<ArtifactSummary[]>` (`[]`), `getServerArtifact(id): Promise<Artifact>` (stub — never reached; gallery empty). | VA-T1 (no surface) | mocked-contract | PROCEED |
| TC-3 | `services/gateway.live` (**ACTIVE**, modify) | Adds `persistArtifact(input: { title: string; type: string; content: string; conversationId?: string \| null }): Promise<{ id: string; currentVersion: number }>` → `POST theo_upsert_artifact` (omit `conversation_id` when falsy); `listServerArtifacts(): Promise<ArtifactSummary[]>` → `GET theo_list_artifacts` (maps `RawArtifact` → `ArtifactSummary` via `relTime(updated_at)`); `getServerArtifact(id: string): Promise<Artifact>` → `GET theo_get_artifact?artifactId=` (maps versions → `{content, ts}`). All fall back to the mock unconfigured; throw on `!res.ok`. | VA-T1 (no surface) | `theo_upsert/list/get_artifact` (DEPLOYED B4h) | PROCEED |
| TC-4 | `services/theoClient` (**ACTIVE**, modify) | `ingestReply(reply: string): { display: string; openId: string \| null; blocks: ArtifactBlock[] }` (now also returns the parsed blocks). Adds `resetArtifacts(): void` (clears the in-memory set), `mergeArtifact(a: Artifact): void` (upsert-by-id into the set), and passthroughs `persistArtifact(input): Promise<{id;currentVersion}>`, `listServerArtifacts(): Promise<ArtifactSummary[]>`, `getServerArtifact(id): Promise<Artifact>`. In-memory `listArtifacts()` unchanged. | VA-T1 (no surface) | Golden §5 boundary | PROCEED |
| TC-5 | `useTheoState` (**ACTIVE**, modify — state owner) | Adds `const [galleryArtifacts, setGalleryArtifacts] = useState<ArtifactSummary[]>([])` + `loadGalleryArtifacts = useCallback(async () => { try { setGalleryArtifacts(await theoClient.listServerArtifacts()); } catch {} }, [])`. `go(v)` → `if (v === "artifacts") void loadGalleryArtifacts()`. `newChat`/`startInProject` → `theoClient.resetArtifacts(); setArtifacts([])` (fresh working set). `send` finalize → destructure `blocks`; after ingest, `void Promise.all(blocks.map((b) => theoClient.persistArtifact({ title:b.title, type:b.type, content:b.content, conversationId: convId \|\| conversationId }))).then(() => loadGalleryArtifacts()).catch(() => {})`. `selectRecent` → `theoClient.resetArtifacts()` then per assistant turn `const { display } = theoClient.ingestReply(m.content)` (rebuild artifacts; `display` used for content AND the single reload `CitedRun.text`), then `setArtifacts(theoClient.listArtifacts())`. `openGalleryArtifact(id: string)` → `getServerArtifact` → `mergeArtifact` → `setArtifacts(...)` → `setOpenArt({ id, v: -1 })`. Returns `galleryArtifacts`, `loadGalleryArtifacts`, `openGalleryArtifact` additionally. | VA-T1 (state owner; no direct surface) | API Spec §2.3; DEPLOYED B4h | PROCEED |
| TC-6 | `components/ArtifactsView` (**ACTIVE**, modify) | `export interface ArtifactsViewProps { artifacts: ArtifactSummary[]; onOpenArtifact: (id: string) => void }`. Card renders `{a.type}{a.currentVersion > 1 ? ` · v${a.currentVersion}` : ""}` + title + a muted `{a.updated ? \`Updated ${a.updated} · \` : ""}Click to open` line (no body preview — summaries carry no content). Empty-state + grid chrome unchanged. | VA-T1 → **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3) | `theo_list_artifacts` (DEPLOYED B4h) | PROCEED |
| TC-7 | `components/TheoMain` (**ACTIVE**, modify) | `export interface TheoMainProps { t: ReturnType<typeof useTheoState>; mode: "full" \| "panel" }` (**unchanged**). `<ArtifactsView>` render gains `artifacts={t.galleryArtifacts}` + `onOpenArtifact={t.openGalleryArtifact}` (was `t.artifacts` / `t.openArtifact`). No other change; `ArtifactPanel` gate unchanged. | VA-T1 (main region) | via `theoClient` | PROCEED |
| TC-8 | `TheoSurface` (**ACTIVE**, modify) | `export interface TheoSurfaceProps { appContext?: AppContext; navSlot?: HTMLElement \| null; mainSlot?: HTMLElement \| null; getAccessToken?: () => Promise<string \| null> }` (**unchanged**). Mount effect destructures + calls `void loadGalleryArtifacts()` alongside `loadRecents`/`loadProjects`; dep array gains `loadGalleryArtifacts`. No other change. | VA-T1 (federated root) | via `theoClient` | PROCEED |

**Infra:** consumes the already-baked `VITE_FUNCTIONS_URL`. No `vite.config`/dependency change. `ArtifactCard.tsx`, `ArtifactPanel.tsx`, `ChatView.tsx`, `Sidebar.tsx`, `ProjectsView.tsx`, `ProjectDetail.tsx`, `RowManage.tsx`, `Customize.tsx`, `ui.tsx`, `icons.tsx`, `lib/artifacts.ts`, `swapBlock.ts` unchanged.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `db79681`: `types.ts`, `useTheoState.ts`, `TheoSurface.tsx`, `services/theoClient.ts` + `gateway.live.ts` + `gateway.mock.ts`, `components/ArtifactsView.tsx` + `TheoMain.tsx` (all in the GCR with blob SHAs); reused-unchanged `lib/artifacts.ts`. Guardrails: gateway abstraction preserved (persist/list/get route through `theoClient`); no browser→model call; **no `localStorage`/`sessionStorage`** (`galleryArtifacts` is React state, the in-memory working set lives in `theoClient`); no Tailwind; no `reporting_*`. Design fact (reopened-chat re-derivation) grounded by read-only SQL this turn.

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; the visual deviation is cited + classified + anchored + Walter-authorized (F-P2); Gap Disclosure present (G-1…G-4 all PROCEED); CCT locked (8 rows, full interfaces, TheoMain/TheoSurface interfaces pasted though unchanged). Validated this turn (`tsc` + `eslint .` exit 0 + `build` green; TheoSurface 236.97 KB / 70.44 KB gzip; `src` reverted). On Codex APPROVAL, Pass 3 commits the eight files and Walter redeploys the Theo SWA → **artifacts persist**: generate one in chat (it saves), reopen the chat (its card is back), open the Artifacts tab (it's listed across chats), click it (versions + content load from Blob). Walter SWA acceptance = Visual Acceptance Evidence.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B4h-FE-Artifacts-Persistence-Pass-1-VEP/Theo_1B_B4h_FE_Artifacts_Persistence_VEP.md" --repo-root .
PASS
```

*End of B4h-FE Artifacts Persistence Pass-1 Frontend VEP (plan only).*
