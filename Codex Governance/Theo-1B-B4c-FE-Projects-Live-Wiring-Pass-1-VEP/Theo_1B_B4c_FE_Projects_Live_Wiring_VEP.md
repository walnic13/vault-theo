# Theo 1B — B4c Frontend Projects Live-Wiring (mock → live `theo_*_project` / `theo_*_project_knowledge`) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against a scratch copy of `src`, reverted) and Walter redeploys the Theo SWA. **Microstep:** point the Projects surface off the 1A in-memory store onto the **deployed, golden-curl-verified** B4a/B4b handlers (API Spec §2.2). Projects + their knowledge now persist per-user server-side, so a project set up once (name, instructions, knowledge) survives reload — the Claude-parity behaviour Walter is testing (the "VC Advice" workstream). All changes sit behind the single `theoClient` service boundary (1A handover §2.3); the rendered Projects surface is reproduced faithfully — no redesign.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `7c91527` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix: "Pass 1 — Frontend Verified Evidence Pack → Full Baseline Grounding"). Real-in-1B FE wiring (not a revision). Frontend sub-phases F-P1…F-P7 walked in the body; the backend P/I/E sub-phase track does not apply to a frontend VEP → `N/A`. The registered VA-T1 artifact is read this turn (not merely the §4B registry): `frontend/theo-frontend-reference.jsx` — the Projects region (L383–394) + the reference state model (`INIT_PROJECTS` L159; `addProject`/`patchProject`/`addKnowledge`/`removeKnowledge` L226–235), whose in-memory shape B4c replaces with the live calls. The consumed contract (`theo_list/create/update/delete_project` + `theo_add/list/remove_project_knowledge`) is documented in API Spec §2.2 (landed this session via the B4 Projects Role-C) and deployed + golden-curl-verified (B4a `1b6497f`; B4b `2360c04`; captures `.local/b4a_projects_verify_2026-07-01.txt`, `.local/b4b_project_knowledge_verify_2026-07-01.txt`). The five proposed source files were applied to a scratch copy of `src` this turn and pass `npm run typecheck` + `eslint` (exit 0) + `npm run build` (TheoSurface 222 KB / 67 KB gzip); `src` was then reverted so this package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); independently verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 build discipline) | `grep -F "gateway abstraction" / "1A state is React/in-memory"` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B Registry; §6 triggers) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (hard gates) | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 allowed deltas) | `grep -F "three locked surfaces" / "service-module/gateway abstraction"` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (Projects surface authority) | cited (surface authority) | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4 Projects CRUD) | `grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 Projects — the 7 deployed endpoints) | `Read(full)` + `grep -F "list / create / update / delete projects"` this turn | `4b978ef428c7b519387a7c8edc4838432a3f72bf` |
| 8 | ACTIVE (modify) — `src/theo/services/gateway.mock.ts` (unconfigured fallback + projects store) | `Read(full)` this turn | `a80cd49e123bb198250f8fbdc429756449340c6a` |
| 9 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` (live transport) | `Read(full)` this turn | `60623fab4e49981302aadf5d51f753074e29ba6c` |
| 10 | ACTIVE (modify) — `src/theo/services/theoClient.ts` (single service boundary) | `Read(full)` this turn | `5e9c14bcee2f4a62722d0d1213474b7b48dce9ee` |
| 11 | ACTIVE (modify) — `src/theo/useTheoState.ts` (state owner: projects / knowledge / instructions) | `Read(full)` this turn | `72c73f6c4fa1e26896d68df9beefd1d435aa1ed2` |
| 12 | ACTIVE (modify) — `src/theo/TheoSurface.tsx` (federated root; wires loadProjects) | `Read(full)` this turn | `8b40948639e13d04713f4dd6adc7099a15fd5555` |
| 13 | Reference (consumer; UNCHANGED) — `src/theo/components/ProjectsView.tsx` (project list + create) | `Read(full)` this turn | `978de71518596cd716baec06e35bd6b1cc07b4c8` |
| 14 | Reference (consumer; UNCHANGED) — `src/theo/components/ProjectDetail.tsx` (knowledge + instructions) | `Read(full)` this turn | `da06a88461be513a350a0867c503abda071824e0` |
| 15 | Reference (types; UNCHANGED) — `src/theo/types.ts` (`Project`/`Knowledge`/`NpDraft`/`KDraft`) | `Read(full)` this turn | `992c36fe7f553a871867c846e978cf70af0c177b` |
| 16 | Reference (seed for mock; UNCHANGED) — `src/theo/data.ts` (`INIT_PROJECTS`) | `Read(full)` this turn | `80b7b7b35b5e56320fb3540e5f739addbca29517` |
| 17 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (Projects region L383–394; state model L159/L226–235) | `Grep("Projects\|New project\|Workspaces")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §F-P1 — microstep source (the FE half) |
| spec/THEO_API_SPEC.md | §2.2 | "list / create / update / delete projects" | §F-P3 — consumed project endpoints |
| spec/THEO_API_SPEC.md | §2.2 | "add / list / remove project knowledge" | §F-P3 — consumed knowledge endpoints |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "gateway abstraction" | §F-P2/§F-P4 — live projects route through `theoClient`/`gateway.live` |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "1A state is React/in-memory" | §F-P6 guardrail — projects/knowledge are React state; no browser storage |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P2 — CCT rows = ALLOWED DELTA |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — every CCT row carries interface + VA-id + contract dependency |

---

## F-P1 — Feature identification
**Microstep:** Theo Phase 1B Backend Plan **Tier B4 — Projects + project-knowledge CRUD** (Rule Anchor 2), the frontend half. The backend (B4a projects core CRUD; B4b project-knowledge CRUD) is **deployed + golden-curl-verified** and documented in API Spec §2.2. This VEP swaps the Projects surface from the 1A in-memory store to those live handlers, behind the single `theoClient` boundary:
1. **List live** — the Projects grid loads from `theo_list_projects` on mount (replacing the seeded `INIT_PROJECTS`), newest-updated first.
2. **Create / instructions / knowledge live** — "+ New project" → `theo_create_project`; the instructions editor → `theo_update_project` (debounced); "+ Add knowledge" / remove → `theo_add/remove_project_knowledge`.
3. **Knowledge on open** — opening a project lazy-loads its items via `theo_list_project_knowledge` (the list endpoint omits knowledge), so a project's knowledge is present before "Start a chat in this project" injects it into the system prompt.

**Real-in-1B FE wiring**; entirely behind `theoClient`; faithful surface reproduction (no redesign). Persistence is the whole point: the "VC Advice" project (instructions + knowledge) now survives reload.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (Projects list + detail; `frontend/theo-frontend-reference.jsx` L383–394, state model L159/L226–235) | VA-T1 read this turn: the reference renders the "Workspaces that bundle chats, knowledge and instructions." header + "+ New project" + project cards, and models projects **in-memory** (`INIT_PROJECTS`, `addProject`/`patchProject`/`addKnowledge`/`removeKnowledge`). B4c keeps `ProjectsView`/`ProjectDetail` **byte-unchanged** (they consume the same `Project[]`/`Project` props); only the **source** of that data changes (in-memory store → live `theo_*` calls) and edits become async/optimistic. The reference header comment itself anticipates this: "Projects (live: knowledge + instructions injected)" (L5). Rendered output is pixel-identical. | VISUAL-AUTHORITY-MATCH (no rendered-surface change) |
| Gateway / service abstraction (FE Governor §6; Golden §5) | The seven project/knowledge methods are added behind the same `theoClient` → `gateway.live` abstraction; unconfigured harness → `gateway.mock`. The explicitly-allowed 1B delta. | ALLOWED DELTA (Rule Anchors 5/7) |

No `VISUAL-AUTHORITY-DEVIATION`. No `ProjectsView`/`ProjectDetail`/`ui.tsx`/`TheoMain.tsx` change. No browser→model call (the calls hit the Functions app with the user's Entra Bearer, same as `sendMessage`); the browser holds no model credential.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Standalone vault-theo dev harness** has no Functions backend / token provider. | **PROCEED** — the seven `gateway.live` project methods, when neither `VITE_FUNCTIONS_URL` nor a token provider is configured, delegate to `gateway.mock` (which now holds the in-memory projects store moved out of `theoClient`, seeded from `INIT_PROJECTS`). The standalone harness is visually unchanged. |
| **G-2** | **Instruction save is debounced (800 ms).** Editing project instructions updates local state instantly but PATCHes (`theo_update_project`) only after an 800 ms pause, to avoid a request per keystroke. | **PROCEED** — an immediate reload within the debounce window could drop the last <800 ms of edits; this is standard autosave behaviour. The chat injection reads the **local** `chatProject.instructions`, so a chat started before the save lands still uses the latest text. |
| **G-3** | **`theo_list_projects` omits knowledge** (B4a decision), so a project's `knowledge[]` is loaded separately — and the first project chat must not race that load. | **PROCEED** — `startInProject` is **async and `await`s `refreshProjectKnowledge(id)` before switching to the chat view**, so the loaded knowledge is in `projects` state (hence in the derived `chatProject`) before any `send` builds `buildSystemPrompt(…, chatProject)`. `openProject` also warms it for the detail view. (The "Start a chat" button is not disabled during the await; the load is a single GET, so the brief wait is unguarded — a loading affordance is a later UI refinement, not required for correctness.) |
| **G-4** | **`theo_delete_project` has no FE surface yet.** The delete-project handler is deployed; the Projects UI has no delete control. | **PROCEED (future-trigger)** — `gateway.live`/`theoClient` expose `deleteProject` for a future "delete project" affordance; B4c wires no delete UI (none exists in VA-T1). Unwired export, no behaviour. |
| **G-5** | **Live data requires the Origin token provider.** Projects return real rows only when Origin supplies `getAccessToken` (the same provider `sendMessage`/recents use). | **PROCEED** — already landed (B1.6 + the VO-AH token-provider wiring); absent a provider the surface stays on the mock (G-1). |
| **G-6** | **Project-grid doc count reads "0 docs" after reload until a project is opened.** `toProject` sets `knowledge: []` (the list endpoint omits knowledge), and `ProjectsView` renders `{p.knowledge.length} docs`; the count fills in once `openProject`/`startInProject` loads that project's knowledge. Within a session (create/add/remove) the count is live. | **PROCEED (disclosed cosmetic)** — a data-parity wrinkle on the grid only, not the injected knowledge (which is loaded on open/start per G-3). A `knowledge_count` on `theo_list_projects` (a small additive B4a-follow-on) would remove it; out of B4c scope. |

Verbatim: no other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting` change.

## F-P3 — Backend / contract grounding
All seven contracts are documented in **API Spec §2.2** (Rule Anchors 3/4) and deployed + golden-curl-verified (B4a/B4b):
- **List projects:** `GET /api/theo_list_projects` → `{ data: { projects: [{ id, name, description, instructions, app_key, created_at, updated_at }] } }`, newest-updated-first, RLS `created_by`-scoped.
- **Create:** `POST /api/theo_create_project` `{ name, description?, instructions? }` → **201** `{ data: { project } }`.
- **Update:** `POST /api/theo_update_project` `{ id, instructions }` → `{ data: { project } }` (B4c sends only `instructions`; the handler also accepts `name`/`description`/`app_key`).
- **Add knowledge:** `POST /api/theo_add_project_knowledge` `{ project_id, title, content }` → **201** `{ data: { knowledge: { id, project_id, title, source_type, content, created_at } } }`.
- **List knowledge:** `GET /api/theo_list_project_knowledge?projectId=<uuid>` → `{ data: { knowledge: [...] } }`, chronological.
- **Remove knowledge:** `POST /api/theo_remove_project_knowledge` `{ knowledge_id }` → `{ data: { deleted: true, id } }`.
- **Transport/auth:** absolute `${VITE_FUNCTIONS_URL}/api/...` with `Authorization: Bearer <token>` from the injected provider (same pattern as `sendMessage`, B1.6). CORS `*` on the handlers; `credentials: "same-origin"`. Backend rows map to the FE `Project`/`Knowledge` shapes in `gateway.live` (`toProject`/`toKnowledge`; `updated_at`→`updated` via `relTime`), so the surface is unchanged.

## F-P4 — Component reference grounding
**Service boundary:** `src/theo/services/theoClient.ts` (ACTIVE) — the in-memory projects store + `INIT_PROJECTS` import are **removed**; seven async passthroughs added. **Transport:** `src/theo/services/gateway.live.ts` — seven live functions + `RawProject`/`RawKnowledge` mappers, each with a mock fallback. **Fallback:** `src/theo/services/gateway.mock.ts` — holds the in-memory projects store (moved from `theoClient`) + seven mock functions. **State owner:** `src/theo/useTheoState.ts` — `projects` starts `[]`; `loadProjects` added; create/add/remove async; `patchInstructions` debounced; `openProject` lazy-loads knowledge. **Mount:** `src/theo/TheoSurface.tsx` — `void loadProjects()` in the configure effect. **Consumers (UNCHANGED):** `ProjectsView`/`ProjectDetail` (VA-T1) consume the same `Project[]`/`Project` props. Governing authority = API Spec §2.2 + the deployed handler shapes.

## F-P5 — Component Contract Table
Format: Golden Pack §3 (Rule Anchor 8). `no any`; required-before-optional; `on<Event>`; discriminated unions preserved. Every row: method interface (full TS) + VA-id + data/contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Method / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `gateway.mock` (Theo surface; **ACTIVE**, modify — unconfigured fallback) | Chat/recents mocks unchanged. Adds the projects store (moved from `theoClient`): `let mockProjects: Project[] = INIT_PROJECTS.map((p) => ({ ...p, knowledge: p.knowledge.slice() }))` + `listProjects(): Promise<Project[]>` · `createProject(d: NpDraft): Promise<Project>` · `updateProjectInstructions(id: string, instructions: string): Promise<Project>` · `deleteProject(id: string): Promise<void>` · `listProjectKnowledge(projectId: string): Promise<Knowledge[]>` · `addProjectKnowledge(projectId: string, k: KDraft): Promise<Knowledge>` · `removeProjectKnowledge(knowledgeId: string): Promise<void>`. Same in-memory semantics the reference `INIT_PROJECTS` model had (VA-T1 L226–235). | VA-T1 (standalone Projects seed; unchanged) | mocked-contract (1A fallback; declared) | PROCEED |
| TC-2 | `gateway.live` (Theo surface; **ACTIVE**, modify — live transport) | Local mappers `interface RawProject { id: string; name: string; description?: string \| null; instructions?: string \| null; app_key?: string \| null; created_at?: string; updated_at?: string }`, `interface RawKnowledge { id: string; project_id: string; title: string; source_type?: string; content?: string \| null; created_at?: string }`; `toProject(r): Project` (`desc: r.description ?? ""`, `knowledge: []`, `updated: relTime(r.updated_at)`), `toKnowledge(r): Knowledge`. Seven exports, each `if (!apiBase && !tokenProvider) return mock…` else `fetch` with Bearer + `{ data, error }` envelope handling: `listProjects(): Promise<Project[]>` (GET) · `createProject(d: NpDraft): Promise<Project>` (POST `{ name, description, instructions }`) · `updateProjectInstructions(id: string, instructions: string): Promise<Project>` (POST `{ id, instructions }`) · `deleteProject(id: string): Promise<void>` (POST `{ id }`) · `listProjectKnowledge(projectId: string): Promise<Knowledge[]>` (GET `?projectId`) · `addProjectKnowledge(projectId: string, k: KDraft): Promise<Knowledge>` (POST `{ project_id, title, content }`) · `removeProjectKnowledge(knowledgeId: string): Promise<void>` (POST `{ knowledge_id }`). No `any` (`json` narrowed per call). | VA-T1 (no surface) | API Spec §2.2; HF-T2 handlers (DEPLOYED) | PROCEED |
| TC-3 | `theoClient` (Theo surface; **ACTIVE**, modify — service boundary) | Drops `let projects` + the `INIT_PROJECTS` import; adds `Knowledge` to the type import. Seven passthroughs: `listProjects(): Promise<Project[]>` · `createProject(d: NpDraft): Promise<Project>` · `updateProjectInstructions(id: string, instructions: string): Promise<Project>` · `deleteProject(id: string): Promise<void>` · `listProjectKnowledge(projectId: string): Promise<Knowledge[]>` · `addProjectKnowledge(projectId: string, k: KDraft): Promise<Knowledge>` · `removeProjectKnowledge(knowledgeId: string): Promise<void>` (each delegates to the `gateway.live` fn). All other methods (chat, attachments, recents, artifacts, settings, app-context) unchanged. | VA-T1 (no surface) | API Spec §2.2 | PROCEED |
| TC-4 | `useTheoState` (Theo surface; **ACTIVE**, modify — state owner) | `const [projects, setProjects] = useState<Project[]>([])` (was `() => theoClient.listProjects()`). `useRef` added to the React import; `const instrTimer = useRef<ReturnType<typeof setTimeout> \| null>(null)`. `loadProjects = useCallback(async () => { try { setProjects(await theoClient.listProjects()); } catch {} }, [])`; `refreshProjectKnowledge = useCallback(async (id: string) => { try { const items = await theoClient.listProjectKnowledge(id); setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, knowledge: items } : p))); } catch {} }, [])`. `openProject(id)` now also `void refreshProjectKnowledge(id)` (warms the detail view). `async startInProject(id)` now `await refreshProjectKnowledge(id)` **before** `setChatProjectId`/`setView("chats")`, so the loaded knowledge is in `projects` state (→ derived `chatProject`) before any `send` builds the system prompt (Codex B4c fix). `async createProject()` → `theoClient.createProject(np)`, prepend. `patchInstructions(text)` → optimistic local `setProjects(...)` + debounced `theoClient.updateProjectInstructions(id, text)` (`INSTRUCTIONS_SAVE_DEBOUNCE_MS = 800`). `async addKnowledge()` → `theoClient.addProjectKnowledge`, append. `async removeKnowledge(kid)` → optimistic filter + `theoClient.removeProjectKnowledge(kid)` (resync on catch). Returns add `loadProjects`. Component-facing handler names (`createProject`/`patchInstructions`/`addKnowledge`/`removeKnowledge`) unchanged. | VA-T1 (Projects surface; unchanged render) | API Spec §2.2 | PROCEED |
| TC-5 | `TheoSurface` (Theo surface; **ACTIVE**, modify — federated root) | Props unchanged: `interface TheoSurfaceProps { appContext?: AppContext; navSlot?: HTMLElement \| null; mainSlot?: HTMLElement \| null; getAccessToken?: () => Promise<string \| null> }`. Destructures `loadProjects` from `t`; the existing configure effect gains `void loadProjects();` after `void loadRecents();` (deps `[getAccessToken, loadRecents, loadProjects]`; both loaders `useCallback`-stable → runs on mount + token change). No render-branch / layout change. | VA-T1 (chat + sidebar + projects; unchanged) | via `theoClient` (HF-T2 DEPLOYED) | PROCEED |

**Infra:** consumes the already-baked `VITE_FUNCTIONS_URL`. No `vite.config`/dependency change. `ProjectsView.tsx`, `ProjectDetail.tsx`, `ui.tsx`, `TheoMain.tsx`, `types.ts`, `data.ts` (`INIT_PROJECTS` now consumed by `gateway.mock`) are **unchanged**.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `7c91527`: `gateway.mock.ts` (projects store + 7 mock fns), `gateway.live.ts` (7 live fns + mappers), `theoClient.ts` (7 passthroughs; store removed), `useTheoState.ts` (projects state/loaders; async create/add/remove; debounced instructions; openProject knowledge load), `TheoSurface.tsx` (loadProjects on mount). Guardrails (Rule Anchors 5/6): gateway abstraction preserved (all calls route through `theoClient`/`gateway.live`); no browser→model call (user Bearer only); **no `localStorage`/`sessionStorage`** (`projects` is React state); no Tailwind; no `reporting_*`/`corporate-reporting` change. Unchanged-but-relied-on: `ProjectsView`/`ProjectDetail` (VA-T1 consumers), `lib/prompt.ts` `buildSystemPrompt(styleKey, custom, chatProject)` (injects the now-live project instructions + knowledge).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present (G-1…G-5 PROCEED; G-4 future-trigger); CCT locked (5 ACTIVE modify rows, each with full method interface + VA-id + contract dependency). No implementation begun in this plan-only pack — but the five proposed files were validated this turn (`tsc` + `eslint` exit 0 + `build` green, then `src` reverted). On Codex APPROVAL, Pass 3 commits the five files and Walter redeploys the Theo SWA → **projects + their knowledge persist per-user across reload inside Origin** (Walter SWA acceptance = Visual Acceptance Evidence): the "VC Advice" project set up once stays.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B4c-FE-Projects-Live-Wiring-Pass-1-VEP/Theo_1B_B4c_FE_Projects_Live_Wiring_VEP.md" --repo-root .
PASS
```

*End of B4c Frontend Projects Live-Wiring Pass-1 Frontend VEP (plan only).*
