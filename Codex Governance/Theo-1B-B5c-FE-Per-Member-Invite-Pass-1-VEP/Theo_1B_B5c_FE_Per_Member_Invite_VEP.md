# Theo 1B — B5c-FE Per-Member Invite (invite picker + members list + "Shared with you" badge) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) and Walter redeploys the Theo SWA. **Microstep:** the FE for Phase-2 per-member sharing (Tier B5c) — wire the deployed `theo_share_project` / `theo_unshare_project` / `theo_list_project_members` + the `shared_with_me` read field (B5c backend, §2.2, golden-verified `8200683`). Three parts: (1) an **owner-only invite section** on the project home — current members (name resolved from the roster) with a revoke control + a picker of teammates (sourced from the deployed `theo_list_people` roster, §2.9) not already invited; (2) a **"Shared with you" grid badge** distinguishing a targeted invite (`shared_with_me`, even on a private project) from a team-wide `group` project; (3) the shared-with-me read-only note refined to say "Shared with you" for an invite. Behind the single `theoClient` boundary; no new backend.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `33d77dd` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: **Codex-fix revision (Pass-2 REJECT round 1):** `projectMembers` was one global array written unconditionally by `loadProjectMembers(id)`, so a slow members load for Project A could render (and be revoked against) under Project B — cross-project bleed. Fixed by **keying members by projectId** exactly like the deployed `projectChatsState`: state is now `projectMembersState: { projectId; members } | null` + a `projectMembersReq` ref (latest-opened owner project); the derived `projectMembers` surfaces only `detailId`'s members; `loadProjectMembers` and the share/unshare re-lists write only when `projectMembersReq.current === id`; `openProject` sets the req + clears the state (no stale flash). Pass 1 — Frontend Verified Evidence Pack. **Visual-authority DEVIATION** turn (like B4e–B4h-FE / B5a-FE): new sharing affordances (an owner-only invite picker + members list on the project home; a "Shared with you" grid badge). Per FE Governor a planned visual deviation is valid when **cited + classified (VISUAL-AUTHORITY-DEVIATION) + Rule-Anchored**, with **Walter** as the exemption authority — he directed the per-member invite this session (the B5a "both, phased" per-member half; "reuse the People roster"). VA-T1 read this turn (`frontend/theo-frontend-reference.jsx` project region). Consumed contract deployed + golden-verified (`theo_share_project`/`theo_unshare_project`/`theo_list_project_members` + `shared_with_me` on `theo_list_projects`, B5c `8200683`; owner path share/unshare/list_members 200 + 400/401 negatives; member path via RO SQL — member sees shared private project, non-member/ex-member 0 rows) and documented by the §2.2 B5c Role-C (authored `33d77dd`, pending Codex inline execution). The eight proposed files were applied to `src` this turn and pass `npm run typecheck` (exit 0) + `eslint` (exit 0) + `npm run build` (TheoSurface 246.99 KB / 72.57 KB gzip); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§UI Authority Reconciliation; §exemption authority) | `git grep -F "A planned visual deviation must be cited and classified" / "Walter is the execution, runtime-acceptance, and exemption authority"` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B; §6) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 deltas) | `git grep -F "three locked surfaces" / "service-module/gateway abstraction"` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (Projects surface) | cited (surface authority) | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 5 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4 projects CRUD) | `git grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 6 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 sharing — B5c row via the pending §2.2 Role-C) | `git grep -F "set project visibility / group-visible sharing"` this turn | `30f1cacb83458acf636f44113ddbbf72d09859d0` |
| 7 | ACTIVE (modify) — `src/theo/types.ts` (`Project` +`sharedWithMe`; +`ProjectMember`/`Person`) | `Read(full)` this turn | `0791cd0f0629ef4501bc518a5f361684272cf2ec` |
| 8 | ACTIVE (modify — state owner) — `src/theo/useTheoState.ts` | `Read(full)` this turn | `542e1a354bb4775f06747b4dfea52f796a3ecd50` |
| 9 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` | `Read(full)` this turn | `86f7f5b2ed9243b08a2b180a7792e6e65f380f74` |
| 10 | ACTIVE (modify) — `src/theo/services/gateway.mock.ts` | `Read(full)` this turn | `2ba968b567a1f75d90c1ac0a10dfffcfc5a1fc9b` |
| 11 | ACTIVE (modify) — `src/theo/services/theoClient.ts` | `Read(full)` this turn | `ca7f7d1f3f10078af2f7f3d65cf12f1411c93cd2` |
| 12 | ACTIVE (modify) — `src/theo/components/ProjectDetail.tsx` | `Read(full)` this turn | `74a511a2bf03d9808152f80d4478fae5663877b5` |
| 13 | ACTIVE (modify) — `src/theo/components/ProjectsView.tsx` | `Read(full)` this turn | `ec228e502ce867f0ab1c5b2fc1596b9fe8f16b83` |
| 14 | ACTIVE (modify) — `src/theo/components/TheoMain.tsx` | `Read(full)` this turn | `be6c463e8c261c188348800639dbab2fae3b624b` |
| 15 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (project region) | `Grep("Projects\|Workspaces\|project")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §UI-Auth | "A planned visual deviation must be cited and classified" | §F-P2 — the invite picker + members list + "Shared with you" badge are classified VISUAL-AUTHORITY-DEVIATION + anchored |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §authority | "Walter is the execution, runtime-acceptance, and exemption authority" | §F-P2 — Walter directed the per-member invite (exemption authority) |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §F-P1 — per-member invite extends the projects surface |
| spec/THEO_API_SPEC.md | §2.2 | "set project visibility / group-visible sharing" | §F-P3 — consumes the §2.2 sharing family (B5c share/unshare/list_members + shared_with_me extend it) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P2 — share/unshare/list_members/listPeople behind `theoClient` (ALLOWED DELTA) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT rows carry full interface + VA-id + contract dependency |

---

## F-P1 — Feature identification
**Microstep:** per-member invite FE (Tier B5c). With B5c-backend live (`theo_project_members` + share/unshare/list_members handlers + `shared_with_me` on `theo_list_projects`), the FE now:
1. **Invite section** (project home, owner-only) — a "Shared with" list of current members (name/avatar resolved from the `theo_list_people` roster) each with a revoke (unshare) control, plus a picker (`<select>`) of teammates not already invited (and not the owner), calling `theo_share_project`. Hidden on `group`-visible projects (already team-wide). 
2. **Grid badge** — a project shared with the caller shows **"Shared with you"** (`shared_with_me`, even while private); owner+group still shows **"Shared"**; non-owner group shows **"Shared with the team"**.
3. **Read-only note** on a shared-with-me project home refined to "Shared with you" (invite) vs "Shared with the team" (group).

Walter directed this (B5a "both, phased" → per-member half; "reuse the People roster"). Behind `theoClient`; no backend change.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (project home) | Adds an owner-only **invite section** (members list with revoke + a teammate picker) below the existing sharing toggle; refines the member read-only note wording. Card/section chrome reuses the existing `C.card`/`C.line2`/`C.coralSoft` tokens + the `IcTrash` idiom. Cited + classified + Rule-Anchored; **Walter-authorized**. | **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3) |
| VA-T1 (Projects grid) | The sharing pill now also renders for `shared_with_me` (invited, even private) with a distinct "Shared with you" label. Card chrome otherwise unchanged. | **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized) |
| Gateway / service abstraction (Golden §5) | `shareProject`/`unshareProject`/`listProjectMembers`/`listPeople` added behind `theoClient` → `gateway.live` (mock fallback); `Project` gains `sharedWithMe`; new `ProjectMember`/`Person` types. | ALLOWED DELTA |

No un-cited deviation. No browser→model call. `ChatView`, `Sidebar`, `RowManage`, `ArtifactsView`, `ArtifactPanel`, `ui.tsx`, `icons.tsx`, `data.ts` unchanged.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Standalone harness** has a single local user and an empty roster (`listPeople` mock returns `[]`), so the picker shows "No teammates to invite" and no members appear; the members-list/empty-state + badge logic still exercise via the in-memory mock store. | **PROCEED** — harness-only; the live SWA (roster + multiple users) exercises invite/revoke end-to-end. |
| **G-2** | **Member names** are resolved by joining `theo_list_project_members` (OIDs) against the `theo_list_people` roster; a member no longer in the roster falls back to showing the raw OID. | **PROCEED** — graceful fallback; the roster is the Vault Staff set that gates login, so an active member is present. |
| **G-3** | **Owner-only member load** — `theo_list_project_members` is owner-only (403 for non-owners), so `openProject` loads members + roster **only when `isOwner`**; a shared-with-me detail skips the call (no 403 noise) and shows no invite section. | **PROCEED** — gated by `isOwner` at open. |
| **G-4** | **Per-(project\|oid) in-flight guard** — share/unshare use a `memberReq` guard + `memberPending` disabled row (same discipline as the B5a `visReq`/`visPending` toggle), then re-list members from the server (source of truth) on settle, so rapid invite/revoke can't leave a stale membership. | **PROCEED (guarded)** — serialized per (project, member). |
| **G-5** | **Keyed member state (Codex R1 fix)** — members are held in `projectMembersState` keyed by `projectId` + guarded by a `projectMembersReq` ref (mirroring the deployed `projectChatsState`/`projectChatsReq`); the derived `projectMembers` surfaces only the OPEN project's members, and every async members write (`loadProjectMembers` + share/unshare re-list) lands only when `projectMembersReq.current === id`. A slow load for Project A therefore can neither render nor be revoked-against under Project B. | **PROCEED (keyed)** — no cross-project bleed; identical discipline to the accepted B4e chats keying. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`.

## F-P3 — Backend / contract grounding
Consumes the deployed, golden-verified B5c contract (API Spec §2.2, B5c row via the pending §2.2 Role-C `33d77dd`):
- **Share / unshare:** `POST /api/theo_share_project` / `theo_unshare_project` `{project_id, member_oid}` (owner-only; idempotent) → `{ shared|unshared: true, … }`; self-invite/bad-uuid → 400; non-owner/absent → 403/404.
- **List members:** `GET /api/theo_list_project_members?projectId=<uuid>` (owner-only) → `{ members: [{ project_id, member_oid, invited_by, created_at }] }`.
- **Roster (picker source):** `GET /api/theo_list_people` (§2.9) → `{ people: [{ id, displayName, email, jobTitle, availability, activity, photo, isSelf }], self }`.
- **List (broadened):** `GET /api/theo_list_projects` rows now also carry `shared_with_me` (boolean), and the set includes projects shared with the caller.
- **Transport/auth:** absolute `${VITE_FUNCTIONS_URL}/api/...` + Bearer; mock fallback unconfigured. No backend change in this pack.

## F-P4 — Component reference grounding
**Modified (8):** `types.ts` (`Project` +`sharedWithMe`; new `ProjectMember`/`Person`), `services/gateway.live.ts` (`RawProject` +`shared_with_me`, `toProject` maps it; `shareProject`/`unshareProject`/`listProjectMembers`/`listPeople` + `RawMember`/`RawPerson` mappers), `services/gateway.mock.ts` (seed/create add `sharedWithMe`; in-memory member store + the four mock fns; empty roster), `services/theoClient.ts` (four passthroughs), `useTheoState.ts` (state owner — `projectMembers`/`people`/`memberReq`/`memberPending`; `loadProjectMembers`/`loadPeople`; owner-gated load in `openProject`; `shareMember`/`unshareMember` guarded actions), `components/ProjectDetail.tsx` (owner-only invite section + note wording), `components/ProjectsView.tsx` (badge extended for `sharedWithMe`), `components/TheoMain.tsx` (wire the five new props). **Reused-unchanged:** `RowManage`, `ChatView`, `Sidebar`, `data.ts` (INIT_PROJECTS unchanged — `sharedWithMe` is set in the gateway.mock seed map). Governing authority = VA-T1 (deviation, Walter-authorized) + Golden Component Pack (§3 CCT, §5 abstraction) + the deployed B5c contract.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; required-before-optional; `on<Event>`; full TS interfaces.

| # | Module (ownership; ACTIVE/NEW) | Interface / behavior (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `types.ts` (**ACTIVE**, modify) | `Project` gains `sharedWithMe: boolean` (after `isOwner`). New: `export interface ProjectMember { memberOid: string; invitedBy: string; createdAt: string }` and `export interface Person { id: string; displayName: string; email: string \| null; jobTitle: string \| null; availability: string \| null; activity: string \| null; photo: string \| null; isSelf: boolean }`. | VA-T1 (no surface) | API Spec §2.2 / §2.9 | PROCEED |
| TC-2 | `services/gateway.mock` (**ACTIVE**, modify) | Seed map + `createProject` add `sharedWithMe: false`. In-memory `mockMembers: Record<string,string[]>`. Adds `shareProject(projectId: string, memberOid: string): Promise<void>` / `unshareProject(projectId: string, memberOid: string): Promise<void>` (idempotent add/remove), `listProjectMembers(projectId: string): Promise<ProjectMember[]>`, `listPeople(): Promise<Person[]>` (returns `[]` — no Graph in the harness). | VA-T1 (no surface) | mocked-contract | PROCEED |
| TC-3 | `services/gateway.live` (**ACTIVE**, modify) | `RawProject` +`shared_with_me?: boolean`; `toProject` sets `sharedWithMe: r.shared_with_me === true`. Adds `shareProject(projectId: string, memberOid: string): Promise<void>` / `unshareProject(...)` → `POST theo_share_project`/`theo_unshare_project` `{project_id, member_oid}`; `listProjectMembers(projectId: string): Promise<ProjectMember[]>` → `GET theo_list_project_members?projectId`; `listPeople(): Promise<Person[]>` → `GET theo_list_people`; `RawMember`/`RawPerson` interfaces + `toMember`/`toPerson` mappers (filter rows missing the id). Mock fallback unconfigured. | VA-T1 (no surface) | `theo_share_project`/`theo_unshare_project`/`theo_list_project_members`/`theo_list_people` (DEPLOYED B5c/B5-P2A) | PROCEED |
| TC-4 | `services/theoClient` (**ACTIVE**, modify) | Adds `shareProject(projectId: string, memberOid: string): Promise<void>`, `unshareProject(projectId: string, memberOid: string): Promise<void>`, `listProjectMembers(projectId: string): Promise<ProjectMember[]>`, `listPeople(): Promise<Person[]>` — each a passthrough to the gateway.live fn. | VA-T1 (no surface) | Golden §5 boundary | PROCEED |
| TC-5 | `useTheoState` (**ACTIVE**, modify — state owner) | **Members KEYED by projectId** (Codex R1 fix, mirroring `projectChatsState`): `const [projectMembersState, setProjectMembersState] = useState<{ projectId: string; members: ProjectMember[] } \| null>(null)` + `const projectMembersReq = useRef<string \| null>(null)`; derived `const projectMembers = projectMembersState && projectMembersState.projectId === detailId ? projectMembersState.members : []` (surfaces only the open project's members). Roster global: `const [people, setPeople] = useState<Person[]>([])`. Guards: `const memberReq = useRef<Set<string>>(new Set())`, `const [memberPending, setMemberPending] = useState<string \| null>(null)`. `loadProjectMembers(id)` writes `setProjectMembersState({projectId:id,members})` **only if `projectMembersReq.current === id`** (else drops the stale response); `loadPeople()` best-effort. `openProject` sets `projectMembersReq.current = id; setProjectMembersState(null)` then loads members + roster **only when the found project `isOwner`**. `shareMember(projectId, memberOid)` / `unshareMember(...)`: **guard** `const key = projectId+"|"+memberOid; if (memberReq.current.has(key)) return`; add key + `setMemberPending(key)`; call the client; on settle re-list keyed (`if (projectMembersReq.current === projectId) setProjectMembersState({projectId,members})`); on failure `setError`; **`finally`** delete key + clear pending. Exposes `projectMembers` (derived), `people`, `shareMember`, `unshareMember`, `memberPending`. | VA-T1 (state owner) | API Spec §2.2/§2.9; DEPLOYED B5c | PROCEED |
| TC-6 | `components/ProjectDetail` (**ACTIVE**, modify) | `ProjectDetailProps` gains `members: ProjectMember[]`, `people: Person[]`, `onShareMember: (projectId: string, memberOid: string) => void`, `onUnshareMember: (projectId: string, memberOid: string) => void`, `memberPendingKey: string \| null`. New **owner-only invite section** rendered `{isOwner && project.visibility !== "group" && (…)}`: a "Shared with" list (`members.map` → avatar initial from the roster-resolved `Person` + name/jobTitle + a revoke `<button disabled={memberPendingKey === project.id+"\|"+m.memberOid}>` calling `onUnshareMember`), or an empty-state line; then a picker `<select value="">` over `people.filter(p => !p.isSelf && !members.some(m => m.memberOid === p.id))` whose `onChange` calls `onShareMember(project.id, oid)` (disabled when none). Member read-only note refined: `project.sharedWithMe ? "Shared with you" : "Shared with the team"`. | VA-T1 → **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized) | `theo_share_project`/`unshare`/`list_members` + `theo_list_people` (DEPLOYED) | PROCEED |
| TC-7 | `components/ProjectsView` (**ACTIVE**, modify) | Badge condition broadened to `{(p.visibility === "group" \|\| p.sharedWithMe) && (…)}`; label `{p.isOwner ? "Shared" : p.sharedWithMe ? "Shared with you" : "Shared with the team"}`. No prop change (`ProjectsViewProps` unchanged). | VA-T1 → **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized) | `theo_list_projects` (`shared_with_me`, DEPLOYED B5c) | PROCEED |
| TC-8 | `components/TheoMain` (**ACTIVE**, modify) | `TheoMainProps` unchanged (`{ t, mode }`). `<ProjectDetail>` render gains `members={t.projectMembers} people={t.people} onShareMember={t.shareMember} onUnshareMember={t.unshareMember} memberPendingKey={t.memberPending}`. No other change. | VA-T1 (main region) | via `theoClient` | PROCEED |

**Infra:** consumes the already-baked `VITE_FUNCTIONS_URL`. No `vite.config`/dependency change. `RowManage.tsx`, `ChatView.tsx`, `Sidebar.tsx`, `ArtifactsView.tsx`, `ArtifactPanel.tsx`, `Customize.tsx`, `ui.tsx`, `icons.tsx`, `data.ts`, `swapBlock.ts` unchanged.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `33d77dd`: `types.ts`, `useTheoState.ts`, `components/ProjectDetail.tsx` + `ProjectsView.tsx` + `TheoMain.tsx`, `services/theoClient.ts` + `gateway.live.ts` + `gateway.mock.ts` (all in the GCR with blob SHAs). Guardrails: gateway abstraction preserved (share/unshare/list_members/listPeople through `theoClient`); no browser→model call; **no `localStorage`/`sessionStorage`** (member/roster state is component/hook React state); no Tailwind; no `reporting_*`. Reused-unchanged: `RowManage` (B4f), the B4e project-home + B5a sharing surface (`setProjectVisibility` toggle, `is_owner`/`visibility`).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; the visual deviation is cited + classified + anchored + Walter-authorized (F-P2); Gap Disclosure present (G-1…G-5 all PROCEED); CCT locked (8 rows, full interfaces, TheoMain/ProjectsView interfaces noted unchanged). Validated this turn (`tsc` + `eslint` exit 0 + `build` green; TheoSurface 246.99 KB / 72.57 KB gzip; `src` reverted). On Codex APPROVAL, Pass 3 commits the eight files and Walter redeploys the Theo SWA → **per-member sharing works end-to-end**: an owner opens a project, invites specific teammates from the roster picker; those colleagues see the project ("Shared with you") in their grid, open it read-only, and start their own chats with its knowledge/instructions; owners revoke anytime; no chat transcripts are exposed (config-only). Walter SWA acceptance = Visual Acceptance Evidence.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B5c-FE-Per-Member-Invite-Pass-1-VEP/Theo_1B_B5c_FE_Per_Member_Invite_VEP.md" --repo-root .
PASS
```

*End of B5c-FE Per-Member Invite Pass-1 Frontend VEP (plan only).*
