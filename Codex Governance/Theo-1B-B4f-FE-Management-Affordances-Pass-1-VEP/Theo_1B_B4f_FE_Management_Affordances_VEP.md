# Theo 1B — B4f-FE Management Affordances (rename/delete project + rename/delete chat) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against a scratch copy of `src`, reverted) and Walter redeploys the Theo SWA. **Microstep:** the four **management affordances** Walter directed this session ("how do I change the name of a project? how do I delete a project? how do I delete a chat? [rename a chat?]" → chose **"Quick management wins"**): **(1) rename project**, **(2) delete project**, **(3) rename chat**, **(4) delete chat**. All four wire to **already-deployed** handlers — rename/delete project reuse `theo_update_project {id, name}` / `theo_delete_project` (B4a); rename/delete chat use `theo_rename_conversation` / `theo_delete_conversation` (B4f-backend, APPROVED + golden-verified `8980bef`). No new backend, no migration. Behind the single `theoClient` boundary; no browser storage. Sharing / visibility (the "big issue") and artifacts persistence remain deferred tracks (a design pass each) — out of scope here.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `3559b83` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack. **Visual-authority DEVIATION** turn (like B4e): the management affordances (hover-revealed ✎/🗑 row actions, edit-in-place rename, native delete-confirm) are additive UI not present in VA-T1. Per FE Governor a planned visual deviation is valid when **cited + classified (VISUAL-AUTHORITY-DEVIATION) + Rule-Anchored**, with **Walter** as the exemption authority — he directed these exact affordances this session ("rename/delete a project", "delete/rename a chat" → "Quick management wins"). VA-T1 read this turn (`frontend/theo-frontend-reference.jsx` project + recents regions). Consumed handlers are all DEPLOYED + golden-verified (project update/delete B4a; conversation rename/delete B4f `8980bef`); the conversation rename/delete API-Spec §2.1 rows are landing via the in-flight **B4f API-Spec Role-C** (pushed `3559b83`, Codex to execute) — this VEP cites the deployed handlers + the existing §2.2 project row, not an un-landed row (F-P2.5 G-3). The ten proposed files (1 new + 9 modified) were applied to a scratch copy of `src` this turn and pass `npm run typecheck` (exit 0) + `eslint .` (exit 0) + `npm run build` (TheoSurface 232.13 KB / 69.48 KB gzip); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§ UI Authority Reconciliation; §exemption authority) | `git grep -F "A planned visual deviation must be cited and classified" / "Walter is the execution, runtime-acceptance, and exemption authority"` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B; §6; classification-anchor rule) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 deltas) | `git grep -F "three locked surfaces" / "service-module/gateway abstraction"` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (Projects surface) | cited (surface authority) | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 5 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4) | `git grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 6 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 project update/delete; §2.1 conversation rows) | `Read` + `grep -niE "project\|delete_project\|update_project"` this turn | `1069096e2426a13d03c2c4b5177d10944f94b670` |
| 7 | ACTIVE (modify) — `src/theo/components/ProjectsView.tsx` | `Read(full)` this turn | `978de71518596cd716baec06e35bd6b1cc07b4c8` |
| 8 | ACTIVE (modify) — `src/theo/components/Sidebar.tsx` | `Read(full)` this turn | `306ea157a66cba1236062829efecef1fc16f3c4a` |
| 9 | ACTIVE (modify) — `src/theo/components/ProjectDetail.tsx` | `Read(full)` this turn | `e89a9edcc649f7e77471995647740e16cd795234` |
| 10 | ACTIVE (modify) — `src/theo/components/TheoMain.tsx` | `Read(full)` this turn | `d80cb97dec8531c8b1c257ab473578ac8748feb9` |
| 11 | ACTIVE (modify) — `src/theo/TheoSurface.tsx` | `Read(full)` this turn | `da626389dfc3cf94211e8b918f3af509ed039e16` |
| 12 | ACTIVE (modify — state owner) — `src/theo/useTheoState.ts` | `Read(full)` this turn | `783e322a6ee855144b69f7aef74ca5e599578e65` |
| 13 | ACTIVE (modify) — `src/theo/services/theoClient.ts` | `Read(full)` this turn | `64353ecb7198231aae54d60ac175fb41abf2efdd` |
| 14 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` | `Read(full)` this turn | `f363977ad9ca52898341807be66dc001cb26d179` |
| 15 | ACTIVE (modify) — `src/theo/services/gateway.mock.ts` | `Read(full)` this turn | `88f67d825e8f50aeb4b02ca8895afbd076c96fdc` |
| 16 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (project + recents regions) | `Grep("Projects\|Recents\|New project")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §UI-Auth | "A planned visual deviation must be cited and classified" | §F-P2 — the management affordances are classified VISUAL-AUTHORITY-DEVIATION + anchored |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §authority | "Walter is the execution, runtime-acceptance, and exemption authority" | §F-P2 — Walter directed these affordances ("Quick management wins"; exemption authority) |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §F-P1 — management is the completion of the B4 projects/conversations CRUD surface |
| spec/THEO_API_SPEC.md | §2.2 | "POST /api/theo_update_project" | §F-P3 — rename project reuses the deployed generalized update handler (`{id, name}`) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P2 — `renameProject`/`renameConversation`/`deleteConversation` behind `theoClient` (ALLOWED DELTA) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT rows carry full interface + VA-id + contract dependency |

---

## F-P1 — Feature identification
**Microstep:** the **management affordances** that complete the B4 projects/conversations surface (Backend Plan Tier B4 — "Projects + project-knowledge + artifacts + settings CRUD"). With B4a–B4e live (projects, knowledge, conversation↔project wiring, project-home), the user could create and open projects/chats but not **rename or delete** them. B4f-FE adds, Claude-style:
1. **Rename project** — edit-in-place on a Projects-grid card's name → `theo_update_project {id, name}` (deployed B4a).
2. **Delete project** — a card action (native confirm) → `theo_delete_project {id}` (deployed B4a); the project's conversations are kept but unlinked (FK ON DELETE SET NULL).
3. **Rename chat** — edit-in-place on a Recents row and a project-home chat row → `theo_rename_conversation {id, title}` (deployed B4f).
4. **Delete chat** — a row action (native confirm) → `theo_delete_conversation {id}` (deployed B4f); messages cascade, attachments unlink.

Walter directed this scope this session (his management questions → the "Quick management wins" selection). Behind `theoClient`; **no backend change** — every handler is already deployed and golden-verified.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (Projects grid / Recents / project-home rows) | The reference surface has **no rename/delete affordances**. B4f-FE adds hover-revealed ✎ (rename) / 🗑 (delete) row actions (a `.vo-actions` opacity-reveal on `.vo-row`/`.vo-card` hover + `:focus-within` for keyboard), **edit-in-place** rename (the row's title becomes a focused input; Enter/blur commits non-blank, Esc cancels), and a **native `window.confirm`** for the destructive delete. This is a deliberate, additive departure from the reference — **cited, classified, and Rule-Anchored** per FE Governor, **authorized by Walter** (the exemption authority; he asked for exactly these four affordances and chose "Quick management wins"). All existing VA-T1 chrome (card layout, recents row, project-home list) is otherwise preserved; the actions layer on top. | **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3) |
| Reused icons | Rename uses the existing `IcCompose` (pencil) and delete the existing `IcTrash` from `icons.tsx` (VA-T1 glyphs) at `s=14`; no new icon. | VISUAL-AUTHORITY-MATCH (existing glyphs) |
| Gateway / service abstraction (Golden §5) | `renameProject`, `renameConversation`, `deleteConversation` added behind `theoClient` → `gateway.live` (mock fallback); `deleteProject` already existed (B4a). | ALLOWED DELTA |

No un-cited deviation. No browser→model call. `ChatView`, `ArtifactsView`, `ArtifactPanel`, `Customize`, `ui.tsx`, `icons.tsx`, `types.ts` unchanged.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Standalone harness** has no persistent conversations (Recents = static seed). Mock rename echoes the trimmed title; mock delete is a no-op — the optimistic local update reflects until the next mock list. | **PROCEED** — harness-only; the live SWA (Walter's acceptance surface) exercises the real handlers. |
| **G-2** | **Native `window.confirm`** for delete (rather than a bespoke in-surface modal). | **PROCEED (intended)** — a deliberate quick-win: honest, zero-visual-risk, and there is no VA-T1 authority for a custom confirm dialog (the whole affordance is a Walter-authorized deviation). A styled confirm can be a later polish. |
| **G-3** | **API-Spec §2.1 conversation rename/delete rows** land via the in-flight B4f API-Spec Role-C (pushed `3559b83`, Codex to execute). | **PRE-LAND** — the handlers are deployed + golden-verified (`8980bef`); this VEP cites the deployed handlers + the existing §2.2 project row, not an un-landed row. |
| **G-4** | **VA registry.** These affordances are a Walter-authorized deviation from VA-T1, not (yet) a registered VA row. | **PROCEED** — FE Governor validates a deviation via cite + classify + Rule Anchor (done) with Walter as exemption authority; a dedicated VA-registry row can be landed by a later Role-C (VA-T4 precedent) but is not required for this pack. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`.

## F-P3 — Backend / contract grounding
All four consume **already-deployed, golden-verified** handlers — no backend change in this pack:
- **Rename project:** `POST /api/theo_update_project {id, name}` (deployed B4a; the generalized update, §2.2) → `{ project }`, owner-scoped; 0-row → 403/404. The FE sends only `name`.
- **Delete project:** `POST /api/theo_delete_project {id}` (deployed B4a, §2.2) → `{ deleted, id }`; `theo_conversations.project_id` SET NULL (chats kept, unlinked).
- **Rename chat:** `POST /api/theo_rename_conversation {id, title}` (deployed B4f `8980bef`) → `{ conversation: { id, title } }`; bad uuid / blank / >200 → 400; 403/404.
- **Delete chat:** `POST /api/theo_delete_conversation {id}` (deployed B4f `8980bef`) → `{ deleted: true, id }`; messages cascade, attachments SET NULL; 403/404.
- **Transport/auth:** absolute `${VITE_FUNCTIONS_URL}/api/...` + Bearer (same as every other call); mock fallback unconfigured.

## F-P4 — Component reference grounding
**New:** `RowManage.tsx` (`RowActions` hover ✎/🗑 + `InlineEdit` edit-in-place; both presentational, no backend). **Modified surfaces:** `ProjectsView.tsx` (card rename/delete), `Sidebar.tsx` (recents rename/delete), `ProjectDetail.tsx` (project-home chat rename/delete). **Wiring:** `TheoMain.tsx` (forwards project handlers → ProjectsView, chat handlers → ProjectDetail), `TheoSurface.tsx` (forwards chat handlers → Sidebar; adds the `.vo-actions` reveal rule to `STYLE_BLOCK`). **State owner:** `useTheoState.ts` (`renameProject`/`deleteProject`/`renameConversation`/`deleteConversation`, optimistic + resync/reset). **Service/transport:** `theoClient`/`gateway.live`/`gateway.mock` (`renameProject`, `renameConversation`, `deleteConversation`). Governing authority = VA-T1 (deviation, Walter-authorized) + Golden Component Pack (§3 CCT, §5 abstraction) + the deployed B4a/B4f contracts.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; required-before-optional; `on<Event>`; full TS interfaces.

| # | Module (ownership; ACTIVE/NEW) | Interface / behavior (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `components/RowManage.tsx` (**NEW**) | Two presentational exports. `export function RowActions({ onRename, onDelete, renameTitle = "Rename", deleteTitle = "Delete" }: { onRename: () => void; onDelete: () => void; renameTitle?: string; deleteTitle?: string })` — a `<span className="vo-actions">` with a pencil (`IcCompose s={14}`) and trash (`IcTrash s={14}`) ghost button; each `onClick` does `e.stopPropagation()` then the callback (never triggers the row/card open). `export function InlineEdit({ value, editing, onCommit, onCancel, labelStyle, inputStyle }: { value: string; editing: boolean; onCommit: (next: string) => void; onCancel: () => void; labelStyle?: CSSProperties; inputStyle?: CSSProperties })` — renders `<span style={labelStyle}>{value}</span>` when not editing, else a child `EditInput` (mounted only while editing → draft seeds fresh from `value`; `useEffect` focus+select once; `onChange` tracks a local draft; **Enter/blur commit** a trimmed non-blank value else cancel, **Escape cancels**; a `done` ref makes commit **XOR** cancel fire **once** so Escape-then-blur can't double-fire; `onClick` stopPropagation). | VA-T1 → **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3); reuses VA-T1 glyphs | none (pure UI) | PROCEED |
| TC-2 | `components/ProjectsView.tsx` (**ACTIVE**, modify) | `export interface ProjectsViewProps { projects: Project[]; npOpen: boolean; np: NpDraft; onNpChange: (next: NpDraft) => void; onToggleNp: () => void; onCreate: () => void; onOpenProject: (id: string) => void; onRenameProject: (id: string, name: string) => void; onDeleteProject: (id: string) => void }`. Local `const [editingId, setEditingId] = useState<string \| null>(null)`. Each card: `position: relative`; `onClick={() => { if (!editing) onOpenProject(p.id) }}`; a top-right `RowActions` (rename → `setEditingId(p.id)`; delete → `window.confirm(...) && onDeleteProject(p.id)`); the name via `InlineEdit` (`onCommit` → `setEditingId(null)` + `onRenameProject` iff changed; `onCancel` → `setEditingId(null)`). Rest of the card (icon, desc, `n docs · updated`) unchanged. | VA-T1 (Projects grid) + DEVIATION (row actions) | `theo_update_project {id,name}` / `theo_delete_project` (DEPLOYED B4a) | PROCEED |
| TC-3 | `components/Sidebar.tsx` (**ACTIVE**, modify) | `export interface SidebarProps { collapsed: boolean; onToggleCollapse: () => void; view: View; onNavigate: (v: View) => void; nav: NavItem[]; search: string; onSearch: (s: string) => void; recents: { id: string; title: string }[]; onSelectRecent: (id: string) => void; onRenameRecent: (id: string, title: string) => void; onDeleteRecent: (id: string) => void; onNewChat: () => void; workspaceName: string; productName: string; fluid?: boolean }`. Local `editingId`. Each Recents row becomes a flex row: title via `InlineEdit` (flex:1, ellipsis label) + a trailing `RowActions` (rename → `setEditingId(ch.id)`; delete → confirm + `onDeleteRecent`), hidden while editing; `onClick` guarded by `!editing`. Nav/search/footer unchanged. | VA-T1 (Recents rail) + DEVIATION (row actions) | `theo_rename_conversation` / `theo_delete_conversation` (DEPLOYED B4f) | PROCEED |
| TC-4 | `components/ProjectDetail.tsx` (**ACTIVE**, modify) | `export interface ProjectDetailProps { project: Project; chats: ConversationSummary[]; kdraft: KDraft; onKdraftChange: (next: KDraft) => void; onAddKnowledge: () => void; onRemoveKnowledge: (kid: string) => void; onPatchInstructions: (text: string) => void; onStartChat: () => void; onSelectChat: (id: string) => void; onRenameChat: (id: string, title: string) => void; onDeleteChat: (id: string) => void }`. Local `editingId`. Each project-home chat row: title via `InlineEdit` (`c.title \|\| "Untitled chat"`) + trailing `RowActions` (rename/delete, hidden while editing); `onClick` guarded by `!editing`. Collapsible knowledge/instructions sections (B4e) unchanged. | VA-T1 (project-home) + DEVIATION (row actions) | `theo_rename_conversation` / `theo_delete_conversation` (DEPLOYED B4f) | PROCEED |
| TC-5 | `components/TheoMain.tsx` (**ACTIVE**, modify) | `export interface TheoMainProps { t: ReturnType<typeof useTheoState>; mode: "full" \| "panel" }` (**unchanged**). `<ProjectsView>` render gains `onRenameProject={t.renameProject}` + `onDeleteProject={t.deleteProject}`; `<ProjectDetail>` render gains `onRenameChat={t.renameConversation}` + `onDeleteChat={t.deleteConversation}`. No other change. | VA-T1 (main region) | via `theoClient` | PROCEED |
| TC-6 | `TheoSurface.tsx` (**ACTIVE**, modify) | `export interface TheoSurfaceProps { appContext?: AppContext; navSlot?: HTMLElement \| null; mainSlot?: HTMLElement \| null; getAccessToken?: () => Promise<string \| null> }` (**unchanged**). `STYLE_BLOCK` gains two rules: `.vo-actions { opacity: 0; transition: opacity .12s; }` and `.vo-row:hover .vo-actions, .vo-card:hover .vo-actions, .vo-actions:focus-within { opacity: 1; }`. `<Sidebar>` render gains `onRenameRecent={t.renameConversation}` + `onDeleteRecent={t.deleteConversation}`. No other change (portal/standalone branches, effects unchanged). | VA-T1 (federated root) + DEVIATION (reveal rule) | via `theoClient` | PROCEED |
| TC-7 | `useTheoState.ts` (**ACTIVE**, modify — state owner) | Adds four handlers, exposed on the returned object. `renameProject(id, name)`: ignore blank; **optimistic** across `projects` AND held `chatProject` (chip updates live); on success resync name/updated from the returned row; on failure `setError` + `loadProjects`. `deleteProject(id)`: **non-optimistic** (await first) — `setProjects` filter-out, clear `chatProject` iff it was this project, null `projectChatsReq`/`projectChatsState` iff keyed to it, and if `detailId === id` → `setDetailId(null); setView("projects")`. `renameConversation(id, title)`: ignore blank; **optimistic** across `recentsList` AND `projectChatsState.chats`; on failure `setError` + `loadRecents` + `loadProjectChats(detailId)`. `deleteConversation(id)`: **non-optimistic** — filter `recentsList` + `projectChatsState.chats`, and if `conversationId === id` (the open thread) → `newChat()`. | VA-T1 (state owner; no direct surface) | API Spec §2.1/§2.2; DEPLOYED B4a/B4f | PROCEED |
| TC-8 | `services/theoClient.ts` (**ACTIVE**, modify) | Adds `renameProject(id: string, name: string): Promise<Project> { return gatewayRenameProject(id, name); }`, `renameConversation(id: string, title: string): Promise<{ id: string; title: string }> { return gatewayRenameConversation(id, title); }`, `deleteConversation(id: string): Promise<void> { return gatewayDeleteConversation(id); }`. | VA-T1 (no surface) | Golden §5 boundary | PROCEED |
| TC-9 | `services/gateway.live.ts` (**ACTIVE**, modify) | Adds `renameProject(id, name): Promise<Project>` — `if (!apiBase && !tokenProvider) return mockRenameProject(id, name)`; else `POST ${apiBase}/api/theo_update_project` body `{ id, name }` + Bearer; throw on `!res.ok`; `toProject(json.data.project)`. Adds `renameConversation(id, title): Promise<{id;title}>` → `POST .../theo_rename_conversation` body `{ id, title }`; returns `{ id, title }` from `json.data.conversation` (throws if missing). Adds `deleteConversation(id): Promise<void>` → `POST .../theo_delete_conversation` body `{ id }`; throw on `!res.ok`. All three fall back to the mock unconfigured. | VA-T1 (no surface) | `theo_update_project` / `theo_rename_conversation` / `theo_delete_conversation` (DEPLOYED) | PROCEED |
| TC-10 | `services/gateway.mock.ts` (**ACTIVE**, modify) | Adds `renameProject(id, name): Promise<Project>` (mirrors `updateProjectInstructions`; sets `name`+`updated:"just now"`, throws if not found), `renameConversation(id, title): Promise<{id;title}>` (`return { id, title: title.trim() }` — no persistence in the harness), `deleteConversation(id): Promise<void>` (`void id; return`). | VA-T1 (no surface) | mocked-contract | PROCEED |

**Infra:** consumes the already-baked `VITE_FUNCTIONS_URL`. No `vite.config`/dependency change. `ChatView.tsx`, `ArtifactsView.tsx`, `ArtifactPanel.tsx`, `ArtifactCard.tsx`, `Customize.tsx`, `ui.tsx`, `icons.tsx`, `data.ts`, `types.ts`, `swapBlock.ts` unchanged.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `3559b83`: `ProjectsView.tsx`, `Sidebar.tsx`, `ProjectDetail.tsx`, `TheoMain.tsx`, `TheoSurface.tsx`, `useTheoState.ts`, `services/theoClient.ts` + `gateway.live.ts` + `gateway.mock.ts` (all listed in the GCR with blob SHAs); plus the NEW `components/RowManage.tsx`. Guardrails: gateway abstraction preserved (all four route through `theoClient`); no browser→model call; **no `localStorage`/`sessionStorage`** (`editingId` is component-local React state); no Tailwind; no `reporting_*`. Reused-unchanged: VA-T1 icon glyphs (`IcCompose`/`IcTrash`); the B4e project-home + B4c/B4d state (only additive handlers).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; the visual deviation is cited + classified + anchored + Walter-authorized (F-P2); Gap Disclosure present (G-1/G-2/G-4 PROCEED, G-3 PRE-LAND); CCT locked (10 rows, full interfaces, TheoMain/TheoSurface interfaces pasted though unchanged). Validated this turn (`tsc` + `eslint .` exit 0 + `build` green; TheoSurface 232.13 KB / 69.48 KB gzip; `src` reverted). On Codex APPROVAL, Pass 3 commits the ten files and Walter redeploys the Theo SWA → **manage projects and chats end-to-end**: rename a project inline on its card, delete it (its chats kept, unlinked); rename a chat inline in Recents or the project home, delete it (permanently, messages cascaded). Walter SWA acceptance = Visual Acceptance Evidence.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B4f-FE-Management-Affordances-Pass-1-VEP/Theo_1B_B4f_FE_Management_Affordances_VEP.md" --repo-root .
PASS
```

*End of B4f-FE Management Affordances Pass-1 Frontend VEP (plan only).*
