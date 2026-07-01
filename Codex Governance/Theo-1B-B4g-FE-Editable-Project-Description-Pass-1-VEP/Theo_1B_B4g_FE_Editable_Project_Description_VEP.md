# Theo 1B — B4g-FE Editable Project Description — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against a scratch copy of `src`, reverted) and Walter redeploys the Theo SWA. **Microstep:** the **editable project description** Walter directed this session ("I should be able to update the description of the project as well… that is not editable at the moment"). Today `ProjectDetail` shows `project.desc` as a static subtitle; B4g makes it **edit-in-place** (click the subtitle — or the "Add a description…" placeholder when empty — Enter/blur saves, Esc cancels), wired to the **already-deployed** `theo_update_project {id, description}` (B4a; the generalized update already accepts `description`, `""` allowed to clear). No new backend, no migration. Behind the single `theoClient` boundary; no browser storage. Reuses the B4f `InlineEdit` component (extended with a backward-compatible `allowEmpty` so a description can be cleared, while rename stays non-blank).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `0988bb1` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack. **Visual-authority DEVIATION** turn (minor; like B4e/B4f): the project description becomes an edit-in-place field (was a static subtitle in the B4e project-home). Per FE Governor a planned visual deviation is valid when **cited + classified (VISUAL-AUTHORITY-DEVIATION) + Rule-Anchored**, with **Walter** as the exemption authority — he directed exactly this ("I should be able to update the description"). VA-T1 read this turn (`frontend/theo-frontend-reference.jsx` project region). The consumed handler is DEPLOYED + golden-verified (`theo_update_project` accepts `{id, description}`, B4a) and documented in API-Spec §2.2. The seven proposed files (all modifications) were applied to a scratch copy of `src` this turn and pass `npm run typecheck` (exit 0) + `eslint .` (exit 0) + `npm run build` (TheoSurface 233.77 KB / 69.80 KB gzip); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§ UI Authority Reconciliation; §exemption authority) | `git grep -F "A planned visual deviation must be cited and classified" / "Walter is the execution, runtime-acceptance, and exemption authority"` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B; §6; classification-anchor rule) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 deltas) | `git grep -F "three locked surfaces" / "service-module/gateway abstraction"` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (Projects surface) | cited (surface authority) | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 5 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4) | `git grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 6 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 `theo_update_project {id, …, description?}`) | `grep -niE "update_project\|description"` this turn | `82cc8153151d9edfb6fd7fd4a6cfc70b0b3ebc49` |
| 7 | ACTIVE (modify — extend `InlineEdit`) — `src/theo/components/RowManage.tsx` | `Read(full)` this turn | `78835d8e61c38c736f1956c9a5d9d22e22651d31` |
| 8 | ACTIVE (modify — editable description) — `src/theo/components/ProjectDetail.tsx` | `Read(full)` this turn | `9d25730876683ac9dc0adbc03b1c5ec5d09de58a` |
| 9 | ACTIVE (modify — pass handler) — `src/theo/components/TheoMain.tsx` | `Read(full)` this turn | `fd79031025a341461cf0ce3a9ce63b5d7ca07917` |
| 10 | ACTIVE (modify — state owner) — `src/theo/useTheoState.ts` | `Read(full)` this turn | `179dcda62995b11cd827afa9635cc4eb6330bdd2` |
| 11 | ACTIVE (modify) — `src/theo/services/theoClient.ts` | `Read(full)` this turn | `03288e522790f75577a13caad54dd9d1d118456b` |
| 12 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` | `Read(full)` this turn | `be5fd8db9e5ffa009c7992507684e980fb76afac` |
| 13 | ACTIVE (modify) — `src/theo/services/gateway.mock.ts` | `Read(full)` this turn | `2b0238eb8b51ff99351fc375cb9d20595b0d4313` |
| 14 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (project region) | `Grep("Projects\|New project\|Workspaces")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §UI-Auth | "A planned visual deviation must be cited and classified" | §F-P2 — the editable description is classified VISUAL-AUTHORITY-DEVIATION + anchored |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §authority | "Walter is the execution, runtime-acceptance, and exemption authority" | §F-P2 — Walter directed the editable description (exemption authority) |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §F-P1 — editable description completes project-attribute editing (name/description/instructions) |
| spec/THEO_API_SPEC.md | §2.2 | "POST /api/theo_update_project" | §F-P3 — description edit reuses the deployed generalized update (`{id, description}`) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P2 — `updateProjectDescription` behind `theoClient` (ALLOWED DELTA) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT rows carry full interface + VA-id + contract dependency |

---

## F-P1 — Feature identification
**Microstep:** the **editable project description** — the last non-editable project attribute. With B4a–B4f live (create, knowledge, conversation wiring, project home, rename/delete of projects + chats, editable instructions), the project **name** and **instructions** are editable but the **description** is a static subtitle. Walter directed this session that it be editable. B4g makes `ProjectDetail`'s description **edit-in-place** (click subtitle / "Add a description…" placeholder → focused input; Enter/blur saves, Esc cancels; empty allowed to clear), wired to the deployed `theo_update_project {id, description}` (B4a). Behind `theoClient`; **no backend change** (the handler already accepts `description`, `""`-clearable).

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (ProjectDetail description subtitle) | The B4e project-home renders `project.desc` as a static subtitle `<p>`. B4g makes it **edit-in-place**: click to edit; empty shows a muted "Add a description…" affordance (so it's discoverable + editable even when blank). A deliberate, additive departure — **cited, classified, Rule-Anchored**, **authorized by Walter** (exemption authority; his verbatim ask this session). Same interaction idiom as the B4f rename edit-in-place. | **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3) |
| `InlineEdit` (B4f reusable) | Extended with a backward-compatible `allowEmpty?: boolean` (default false). Rename keeps its non-blank guard (unchanged behavior); the description passes `allowEmpty` so a cleared value commits `""`. | ALLOWED DELTA (additive optional prop) |
| Gateway / service abstraction (Golden §5) | `updateProjectDescription` added behind `theoClient` → `gateway.live` (mock fallback), mirroring the existing `updateProjectInstructions`. | ALLOWED DELTA |

No un-cited deviation. No browser→model call. `ProjectsView`, `Sidebar`, `ChatView`, `ui.tsx`, `icons.tsx`, `types.ts` unchanged.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Standalone harness** persists the description in the in-memory mock only (lost on reload); the live SWA persists via `theo_update_project`. | **PROCEED** — harness-only; live SWA (Walter's acceptance surface) exercises the real handler. |
| **G-2** | **Single-line input** for the description (max 500 chars server-side). A very long description edits on one scrolling line. | **PROCEED (intended)** — descriptions are short subtitles; the server caps at 500. A multi-line editor is unnecessary polish. |
| **G-3** | **Empty-clear** relies on the new `InlineEdit` `allowEmpty` path; the deployed handler accepts `description: ""`. | **PROCEED** — `theo_update_project` documents `description` "may be `""` to clear" (§2.2); the FE commits the trimmed value (incl. `""`). |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`.

## F-P3 — Backend / contract grounding
- **Edit description:** `POST /api/theo_update_project {id, description}` (deployed B4a, §2.2; the generalized update — `description` may be `""` to clear) → `{ project }`, owner-scoped; 0-row → 403/404. The FE sends only `description`.
- **Transport/auth:** absolute `${VITE_FUNCTIONS_URL}/api/...` + Bearer (same as every other call); mock fallback unconfigured. No backend change in this pack.

## F-P4 — Component reference grounding
**Extended:** `RowManage.tsx` (`InlineEdit`/`EditInput` gain `allowEmpty?: boolean`). **Modified surface:** `ProjectDetail.tsx` (description subtitle → edit-in-place via `InlineEdit allowEmpty`; new prop `onPatchDescription`). **Wiring:** `TheoMain.tsx` (pass `onPatchDescription={t.patchDescription}`). **State owner:** `useTheoState.ts` (`patchDescription` — optimistic across the projects list + held `chatProject`, with chip-rollback on failure). **Service/transport:** `theoClient`/`gateway.live`/`gateway.mock` (`updateProjectDescription`). Governing authority = VA-T1 (deviation, Walter-authorized) + Golden Component Pack (§3 CCT, §5 abstraction) + the deployed B4a `theo_update_project` contract.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; required-before-optional; `on<Event>`; full TS interfaces.

| # | Module (ownership; ACTIVE/NEW) | Interface / behavior (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `components/RowManage.tsx` (**ACTIVE**, modify) | `InlineEdit` + inner `EditInput` gain `allowEmpty?: boolean` (default `false`, appended after existing optional props). Commit rule becomes `const t = v.trim(); if (t || allowEmpty) onCommit(t); else onCancel();` — rename (no `allowEmpty`) keeps its non-blank guard; description passes `allowEmpty` so a cleared value commits `""`. New signature: `InlineEdit({ value: string; editing: boolean; onCommit: (next: string) => void; onCancel: () => void; labelStyle?: CSSProperties; inputStyle?: CSSProperties; allowEmpty?: boolean })`. `RowActions` unchanged. | VA-T1 (no surface); B4f reusable | none (pure UI) | PROCEED |
| TC-2 | `components/ProjectDetail.tsx` (**ACTIVE**, modify) | `interface ProjectDetailProps { project: Project; chats: ConversationSummary[]; kdraft: KDraft; onKdraftChange: (next: KDraft) => void; onAddKnowledge: () => void; onRemoveKnowledge: (kid: string) => void; onPatchInstructions: (text: string) => void; onStartChat: () => void; onSelectChat: (id: string) => void; onRenameChat: (id: string, title: string) => void; onDeleteChat: (id: string) => void; onPatchDescription: (text: string) => void }`. Local `const [descEditing, setDescEditing] = useState(false)`. The subtitle renders `<InlineEdit value={project.desc} editing allowEmpty onCommit={(next) => { setDescEditing(false); if (next !== project.desc) onPatchDescription(next); }} onCancel={() => setDescEditing(false)} />` when editing, else a `<p onClick={() => setDescEditing(true)}>` showing `project.desc` or a muted "Add a description…" placeholder. Chats list + collapsible knowledge/instructions (B4e/B4f) unchanged. | VA-T1 → **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3) | `theo_update_project {id, description}` (DEPLOYED B4a) | PROCEED |
| TC-3 | `components/TheoMain.tsx` (**ACTIVE**, modify) | `export interface TheoMainProps { t: ReturnType<typeof useTheoState>; mode: "full" \| "panel" }` (**unchanged**). `<ProjectDetail>` render gains `onPatchDescription={t.patchDescription}`. No other change. | VA-T1 (main region) | via `theoClient` | PROCEED |
| TC-4 | `useTheoState.ts` (**ACTIVE**, modify — state owner) | Adds `patchDescription(text: string)`, exposed on the returned object. Guards on `detailId`; `const desc = text.trim()`; snapshots `prevChatDesc` (held chip's desc iff this project); **optimistic** across `projects` AND held `chatProject`; on success resync `desc`/`updated` from the returned row; **on failure** `setError` + `loadProjects()` **AND roll back the held chip's `desc`** to `prevChatDesc` (same independent-`chatProject` discipline as B4f `renameProject`). Committed once (edit-in-place) — no debounce (unlike `patchInstructions`). | VA-T1 (state owner; no direct surface) | API Spec §2.2; DEPLOYED B4a | PROCEED |
| TC-5 | `services/theoClient.ts` (**ACTIVE**, modify) | Adds `updateProjectDescription(id: string, description: string): Promise<Project> { return gatewayUpdateProjectDescription(id, description); }` (imports `updateProjectDescription as gatewayUpdateProjectDescription` from `gateway.live`). | VA-T1 (no surface) | Golden §5 boundary | PROCEED |
| TC-6 | `services/gateway.live.ts` (**ACTIVE**, modify) | Adds `updateProjectDescription(id, description): Promise<Project>` — `if (!apiBase && !tokenProvider) return mockUpdateProjectDescription(id, description)`; else `POST ${apiBase}/api/theo_update_project` body `{ id, description }` + Bearer; throw on `!res.ok`; `toProject(json.data.project)`. Mirrors `updateProjectInstructions`. | VA-T1 (no surface) | `theo_update_project` (DEPLOYED B4a) | PROCEED |
| TC-7 | `services/gateway.mock.ts` (**ACTIVE**, modify) | Adds `updateProjectDescription(id, description): Promise<Project>` — sets `desc: description` + `updated: "just now"` on the in-memory project, throws if not found. Mirrors `updateProjectInstructions`. | VA-T1 (no surface) | mocked-contract | PROCEED |

**Infra:** consumes the already-baked `VITE_FUNCTIONS_URL`. No `vite.config`/dependency change. `ProjectsView.tsx`, `Sidebar.tsx`, `ChatView.tsx`, `ArtifactsView.tsx`, `ArtifactPanel.tsx`, `Customize.tsx`, `ui.tsx`, `icons.tsx`, `types.ts`, `swapBlock.ts`, `TheoSurface.tsx` unchanged.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `0988bb1`: `RowManage.tsx` (`allowEmpty`), `ProjectDetail.tsx` (editable description), `TheoMain.tsx` (prop), `useTheoState.ts` (`patchDescription`), `services/theoClient.ts` + `gateway.live.ts` + `gateway.mock.ts` (`updateProjectDescription`). Guardrails: gateway abstraction preserved (routes through `theoClient`); no browser→model call; **no `localStorage`/`sessionStorage`** (`descEditing` is component-local React state); no Tailwind; no `reporting_*`. Reused-unchanged: the B4f `InlineEdit`/`RowActions` (extended additively); the B4e project-home layout + B4c/B4d/B4f state.

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; the visual deviation is cited + classified + anchored + Walter-authorized (F-P2); Gap Disclosure present (G-1/G-2/G-3 all PROCEED); CCT locked (7 rows, full interfaces, TheoMain interface pasted though unchanged). Validated this turn (`tsc` + `eslint .` exit 0 + `build` green; TheoSurface 233.77 KB / 69.80 KB gzip; `src` reverted). On Codex APPROVAL, Pass 3 commits the seven files and Walter redeploys the Theo SWA → **the project description is editable**: open a project, click its description (or "Add a description…"), edit, Enter to save; reload persists. Walter SWA acceptance = Visual Acceptance Evidence.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B4g-FE-Editable-Project-Description-Pass-1-VEP/Theo_1B_B4g_FE_Editable_Project_Description_VEP.md" --repo-root .
PASS
```

*End of B4g-FE Editable Project Description Pass-1 Frontend VEP (plan only).*
