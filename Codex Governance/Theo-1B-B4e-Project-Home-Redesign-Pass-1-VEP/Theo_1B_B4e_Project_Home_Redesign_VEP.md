# Theo 1B — B4e Project-Home Redesign (chats-first + collapsible knowledge/instructions + artifact-panel scope) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against a scratch copy of `src`, reverted) and Walter redeploys the Theo SWA. **Microstep:** the project-home redesign Walter directed this session — make a project a **home for its chats**: (1) `ProjectDetail` becomes **chats-first** (the project's chat list via `theo_list_conversations?projectId` (B4d) + "New chat in this project"); (2) **Project knowledge** and **Custom instructions** become **collapsible** sections (expanded while the project has no chats, collapsed once it does); (3) the **artifact panel** no longer lingers over the project home — it shows only in chat/artifacts contexts and clears when switching threads. This is a **deliberate visual deviation** from the VA-T1 project-detail layout, authorized by Walter (design direction + approved mock-up, this session). Behind the single `theoClient` boundary; no new backend.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `2287265` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack. **Visual-authority DEVIATION** turn (unlike B4c/B4d-FE, which were MATCH): `ProjectDetail` is redesigned. Per FE Governor §"UI Authority Reconciliation" a planned visual deviation is valid when cited + classified (VISUAL-AUTHORITY-DEVIATION) + Rule-Anchored; Walter is the exemption authority and directed this exact layout this session (chats-first project home; collapsible knowledge/instructions; artifact panel not lingering on the project screen — his verbatim feedback). VA-T1 read this turn (`frontend/theo-frontend-reference.jsx` project region). The consumed per-project list contract (`theo_list_conversations?projectId`) is deployed + golden-verified (B4d `25c590f`); its API-Spec §2.1 row lands via the in-flight B4d Role-C (§F-P2.5 G-4). The six proposed files were applied to a scratch copy of `src` this turn and pass `npm run typecheck` + `eslint` (exit 0) + `npm run build` (TheoSurface 225.7 KB / 67.8 KB gzip); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§ UI Authority Reconciliation; §exemption authority) | `Grep("Walter\|visual authority\|deviat")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B; §6; classification-anchor rule) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 deltas) | `grep -F "three locked surfaces" / "service-module/gateway abstraction"` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (Projects surface) | cited (surface authority) | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 5 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4) | `grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 6 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 List conversations → `?projectId`) | `Read(offset=21,limit=9)` + `grep -F "List conversations"` this turn | `4b978ef428c7b519387a7c8edc4838432a3f72bf` |
| 7 | ACTIVE (redesign) — `src/theo/components/ProjectDetail.tsx` | `Read(full)` this turn | `da06a88461be513a350a0867c503abda071824e0` |
| 8 | ACTIVE (modify) — `src/theo/components/TheoMain.tsx` | `Read(full)` this turn | `1169565099bd5f98d56b44de7a8211f359e30ed8` |
| 9 | ACTIVE (modify) — `src/theo/useTheoState.ts` | `Read(full)` this turn | `245a43b4e9fb99b25059e22ee9ecebcf2b408d96` |
| 10 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` | `Read(full)` this turn | `8d3277d85a256c5a2a3e6b82e86644f5025be305` |
| 11 | ACTIVE (modify) — `src/theo/services/gateway.mock.ts` | `Read(full)` this turn | `decb98776f8a493ea703e8d5d6470493dcab98c8` |
| 12 | ACTIVE (modify) — `src/theo/services/theoClient.ts` | `Read(full)` this turn | `e2bf38607fe1190f141a6d0c5c966ca6aa7cadb6` |
| 13 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (project region) | `Grep("Projects\|New project\|Workspaces")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §UI-Auth | "A planned visual deviation must be cited and classified" | §F-P2 — the ProjectDetail redesign is classified VISUAL-AUTHORITY-DEVIATION + anchored |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §authority | "Walter is the execution, runtime-acceptance, and exemption authority" | §F-P2 — Walter directed + approved this project-home layout (exemption authority) |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §F-P1 — the project-home surface for the B4 projects feature |
| spec/THEO_API_SPEC.md | §2.1 | "List conversations" | §F-P3 — per-project chat list via `theo_list_conversations?projectId` (B4d) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P2 — `listProjectConversations` behind `theoClient` (ALLOWED DELTA) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT rows carry interface + VA-id + contract dependency |

---

## F-P1 — Feature identification
**Microstep:** the **project-home redesign** — the visible completion of the B4 projects feature (Backend Plan Tier B4). With B4a–B4d live (projects, knowledge, and conversation↔project wiring all persistent), B4e turns `ProjectDetail` from a *setup form* into a **project home**:
1. **Chats-first** — the project's chat list (`theo_list_conversations?projectId`, B4d) is the primary surface, with a **"New chat in this project"** button; empty state when the project has no chats yet.
2. **Collapsible setup** — Project knowledge + Custom instructions become collapsible sections (expanded while there are no chats, collapsed once there are — adaptive default, user-toggleable).
3. **Artifact-panel scope** — the artifact side panel shows only in chat/artifacts views (not lingering on the project home) and clears when switching threads (new chat / open a recent).

Walter directed this layout this session (approved mock-up + "author b4e now"). Behind `theoClient`; no backend change (consumes the deployed B4d `?projectId` list).

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (ProjectDetail region) | The current `ProjectDetail` (ported from VA-T1: knowledge + instructions filling the surface) is **redesigned** into a chats-first home with the setup as collapsible sections. This is a deliberate departure from the reference layout — **cited, classified, and Rule-Anchored** per FE Governor (a planned visual deviation is valid when cited + classified + anchored), **authorized by Walter** (the exemption authority; he sketched the layout and approved the mock-up this session: chats-first, collapsible knowledge/instructions, artifact panel not lingering on the project screen). Reused sub-elements (knowledge list + add form; instructions editor) keep their VA-T1 chrome inside the collapsibles. | **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3) |
| VA-T1 (artifact panel) | The artifact panel render is now gated `t.art && (view === "chats" \|\| view === "artifacts")` — a behavioural scope fix (Walter's feedback: the generated email "just stays" on the projects screen). No change to the panel's own rendering; it re-shows on return to a chat. | VISUAL-AUTHORITY-DEVIATION (minor scope; Walter-directed) |
| Gateway / service abstraction (Golden §5) | `listProjectConversations` added behind `theoClient` → `gateway.live` (mock fallback). | ALLOWED DELTA |

No un-cited deviation. No browser→model call. `ChatView`, `ProjectsView`, `Sidebar`, `ui.tsx`, `Customize` unchanged.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Standalone harness** has no project-linked conversations. | **PROCEED** — `gateway.mock.listProjectConversations` returns `[]`; the project-home shows the empty state. Visually coherent. |
| **G-2** | **Adaptive collapse flash.** Sections default expanded (no chats) and collapse once chats load; opening a project *with* chats briefly shows expanded → collapsed as the async list resolves. | **PROCEED (intended)** — the default follows `chats.length` until the user toggles; the flash is a sub-second async settle, not a layout defect. |
| **G-3** | **VA registry.** This redesign is a Walter-authorized deviation from VA-T1; it is not (yet) a registered VA row. | **PROCEED** — FE Governor validates a deviation via cite + classify + Rule Anchor (done) with Walter as exemption authority; a dedicated VA-registry row for the project-home layout can be landed by a later Role-C (VA-T4 precedent) but is not required for this pack. |
| **G-4** | **API-Spec `?projectId` row** is landing via the in-flight B4d Role-C. | **PRE-LAND** — `?projectId` is deployed + golden-verified; this VEP cites the existing §2.1 "List conversations" row + the deployed B4d contract, not an un-landed row. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`.

## F-P3 — Backend / contract grounding
- **Per-project chats:** `GET /api/theo_list_conversations?projectId=<uuid>` (deployed B4d, golden-verified) → `{ conversations: [{ id, title, model, project_id, app_key, created_at, updated_at }] }`, owner-scoped. Consumed by `loadProjectChats` → `projectChats` → the project-home list; each row → `selectRecent(id)` (restores the project, B4d-FE).
- **New chat in project:** the existing `startInProject(id)` (B4d-FE) — no new contract.
- **Transport/auth:** absolute `${VITE_FUNCTIONS_URL}/api/...` + Bearer (same as recents); mock fallback unconfigured. No backend change in this pack.

## F-P4 — Component reference grounding
**Redesigned:** `ProjectDetail.tsx` (chats-first + collapsible sections; new props `chats`, `onSelectChat`). **Modified:** `TheoMain.tsx` (pass `chats={t.projectChats}` + `onSelectChat={t.selectRecent}`; gate `ArtifactPanel` by view). **State owner:** `useTheoState.ts` (`projectChats` state + `loadProjectChats`; `openProject` loads chats; `newChat`/`startInProject`/`selectRecent` clear `openArt`). **Service/transport:** `theoClient`/`gateway.live`/`gateway.mock` (`listProjectConversations`). Governing authority = VA-T1 (deviation, Walter-authorized) + Golden Component Pack (§3 CCT, §5 abstraction) + deployed B4d contract.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; required-before-optional; `on<Event>`; full TS interfaces.

| # | Module (ownership; ACTIVE/NEW) | Interface / behavior (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `gateway.mock` (**ACTIVE**, modify) | Adds `listProjectConversations(projectId: string): Promise<ConversationSummary[]>` → `{ void projectId; return []; }` (no project-linked seeds in the harness). | VA-T1 (no surface) | mocked-contract | PROCEED |
| TC-2 | `gateway.live` (**ACTIVE**, modify) | Adds `listProjectConversations(projectId: string): Promise<ConversationSummary[]>` — `if (!apiBase && !tokenProvider) return mockListProjectConversations(projectId)`; else `GET \`${apiBase}/api/theo_list_conversations?projectId=${encodeURIComponent(projectId)}\`` with Bearer; throw on `!res.ok`; return `Array.isArray(json?.data?.conversations) ? json.data.conversations : []`. | VA-T1 (no surface) | `theo_list_conversations?projectId` (DEPLOYED B4d) | PROCEED |
| TC-3 | `theoClient` (**ACTIVE**, modify) | Adds `listProjectConversations(projectId: string): Promise<ConversationSummary[]> { return gatewayListProjectConversations(projectId); }`. | VA-T1 (no surface) | API Spec §2.1 | PROCEED |
| TC-4 | `useTheoState` (**ACTIVE**, modify — state owner) | Per-project chats **keyed + guarded** (Codex B4e finding — no cross-project bleed/clobber): `const [projectChatsState, setProjectChatsState] = useState<{ projectId: string; chats: ConversationSummary[] } \| null>(null)` + `const projectChatsReq = useRef<string \| null>(null)`. `loadProjectChats = useCallback(async (id) => { try { const chats = await theoClient.listProjectConversations(id); if (projectChatsReq.current === id) setProjectChatsState({ projectId: id, chats }); } catch { if (projectChatsReq.current === id) setProjectChatsState({ projectId: id, chats: [] }); } }, [])` — a response lands only if its project is still the latest opened. Derived `const projectChats = projectChatsState && projectChatsState.projectId === detailId ? projectChatsState.chats : []` — surfaces only the open project's own chats. `openProject(id)` → `projectChatsReq.current = id; setProjectChatsState(null); setDetailId(id); setView("project"); void refreshProjectKnowledge(id); void loadProjectChats(id)` (clears any prior list immediately). Artifact-scope: `newChat`, `startInProject`, `selectRecent` also `setOpenArt(null)`. Returns the derived `projectChats` (an array). | VA-T1 (Projects surface) | API Spec §2.1; B4d | PROCEED |
| TC-5 | `ProjectDetail` (**ACTIVE**, REDESIGN) | `interface ProjectDetailProps { project: Project; chats: ConversationSummary[]; kdraft: KDraft; onKdraftChange: (next: KDraft) => void; onAddKnowledge: () => void; onRemoveKnowledge: (kid: string) => void; onPatchInstructions: (text: string) => void; onStartChat: () => void; onSelectChat: (id: string) => void }`. Chats-first: header "Chats in this project" + "New chat" (`onStartChat`); chat rows (`chats.map` → `onSelectChat(c.id)`) or an empty state. Local collapse state `const [kOpen, setKOpen] = useState<boolean \| null>(null)` / `iOpen`; `knowledgeOpen = kOpen ?? !hasChats` (adaptive default, user-toggleable), same for instructions. Inline `Section` (caret + title + conditional body) wraps the **unchanged** knowledge list/add-form and the instructions `InputBox`. | VA-T1 → **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3) | `theo_list_conversations?projectId` (chats); knowledge/instructions handlers (B4b/B4c) | PROCEED |
| TC-6 | `TheoMain` (**ACTIVE**, modify) | `<ProjectDetail>` render gains `chats={t.projectChats}` + `onSelectChat={t.selectRecent}`. `ArtifactPanel` render gated: `{t.art && (t.view === "chats" \|\| t.view === "artifacts") && (<ArtifactPanel …/>)}`. No other change; header/back-button/other views unchanged. | VA-T1 (main region; artifact-panel scope = Walter-directed deviation) | via `theoClient` | PROCEED |

**Infra:** consumes the already-baked `VITE_FUNCTIONS_URL`. No `vite.config`/dependency change. `ChatView.tsx`, `ProjectsView.tsx`, `Sidebar.tsx`, `ui.tsx`, `Customize.tsx`, `types.ts` unchanged.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `2287265`: `ProjectDetail.tsx` (redesign), `TheoMain.tsx` (props + artifact gate), `useTheoState.ts` (projectChats + loaders + artifact-close), `gateway.live/mock.ts` + `theoClient.ts` (`listProjectConversations`). Guardrails: gateway abstraction preserved; no browser→model call; **no `localStorage`/`sessionStorage`** (`projectChats`/collapse are React state); no Tailwind; no `reporting_*`. Reused-unchanged: knowledge/instructions editing sub-UI (VA-T1 chrome) inside the collapsibles; `selectRecent`/`startInProject` (B4d-FE).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; the visual deviation is cited + classified + anchored + Walter-authorized (F-P2); Gap Disclosure present (G-1/G-2/G-3 PROCEED, G-4 PRE-LAND); CCT locked (6 rows, full interfaces). Validated this turn (`tsc` + `eslint` exit 0 + `build` green, `src` reverted). On Codex APPROVAL, Pass 3 commits the six files and Walter redeploys the Theo SWA → **a project is a home for its chats**: open VC Advice → its chats listed + "New chat in this project"; knowledge/instructions tucked into collapsibles; the artifact panel no longer lingers on the project screen (Walter SWA acceptance = Visual Acceptance Evidence).

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B4e-Project-Home-Redesign-Pass-1-VEP/Theo_1B_B4e_Project_Home_Redesign_VEP.md" --repo-root .
PASS
```

*End of B4e Project-Home Redesign Pass-1 Frontend VEP (plan only).*
