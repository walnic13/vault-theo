# Theo 1B — B5a-FE Project Visibility (share toggle + "Shared" badge + ownership-gated edits) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against a scratch copy of `src`, reverted) and Walter redeploys the Theo SWA. **Microstep:** the FE for Phase-1 sharing (Tier B5) — wire the deployed `theo_set_project_visibility` + the group-visible read broadening (B5a backend, §2.2). Three parts: (1) a **sharing toggle** on the project home (owner flips Private ↔ "Shared with the team"); (2) a **"Shared" / "Shared with you" badge** on the Projects grid (using the new `is_owner` + `visibility` from `theo_list_projects`); (3) **ownership-gated editing** — a shared-with-me project (`isOwner=false`) is **read-only + chattable** (member sees knowledge/instructions, starts their own chats, but can't edit config, share, rename, or delete). Config-only sharing (chat transcripts stay private, enforced server-side). Behind the single `theoClient` boundary; no new backend.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `0560ea8` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack. **Visual-authority DEVIATION** turn (like B4e–B4h-FE): new sharing affordances (a Private/Shared toggle on the project home, "Shared"/"Shared with you" grid badges) + ownership-gated edit affordances (a shared-with-me project renders read-only). Per FE Governor a planned visual deviation is valid when **cited + classified (VISUAL-AUTHORITY-DEVIATION) + Rule-Anchored**, with **Walter** as the exemption authority — he directed the sharing feature this session ("both, phased"; group-visible half). VA-T1 read this turn (`frontend/theo-frontend-reference.jsx` project region). Consumed contract deployed + golden-verified (`theo_set_project_visibility` + list/knowledge/set-conversation-project broadening, B5a `bfde0cd`) and documented in API-Spec §2.2 (landed `0560ea8`). The nine proposed files were applied to a scratch copy of `src` this turn and pass `npm run typecheck` (exit 0) + `eslint .` (exit 0) + `npm run build` (TheoSurface 240.27 KB / 71.11 KB gzip); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§ UI Authority Reconciliation; §exemption authority) | `git grep -F "A planned visual deviation must be cited and classified" / "Walter is the execution, runtime-acceptance, and exemption authority"` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B; §6) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 deltas) | `git grep -F "three locked surfaces" / "service-module/gateway abstraction"` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (Projects surface) | cited (surface authority) | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 5 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4 projects CRUD) | `git grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 6 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 project visibility — landed) | `git grep -F "set project visibility / group-visible sharing"` this turn | `6f8723ad54982daea1e7894d4ce7f9da821c824a` |
| 7 | ACTIVE (modify) — `src/theo/types.ts` (`Project` +`visibility`/`isOwner`) | `Read(full)` this turn | `5946530b1b93a15c76e2075311144adda8b7e720` |
| 8 | ACTIVE (modify) — `src/theo/data.ts` (seed type relaxed) | `Read(full)` this turn | `80b7b7b35b5e56320fb3540e5f739addbca29517` |
| 9 | ACTIVE (modify — state owner) — `src/theo/useTheoState.ts` | `Read(full)` this turn | `dfb0774fa10adf1c5b39096634ec721e518c27d0` |
| 10 | ACTIVE (modify) — `src/theo/components/ProjectsView.tsx` | `Read(full)` this turn | `6421c659ccd98c8396f3c0fb4ee4a93cb1e9db0e` |
| 11 | ACTIVE (modify) — `src/theo/components/ProjectDetail.tsx` | `Read(full)` this turn | `3724978b878f5bfbe1a5784525cbe299d9bba58b` |
| 12 | ACTIVE (modify) — `src/theo/components/TheoMain.tsx` | `Read(full)` this turn | `dc2a122afe66bd8611e6d388d2c52dfbf6cf79f7` |
| 13 | ACTIVE (modify) — `src/theo/services/theoClient.ts` | `Read(full)` this turn | `8a2449660ba8914af94466694288658ad04e5d01` |
| 14 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` | `Read(full)` this turn | `c71f9597697473a89503ed583e6e0fb6895c940f` |
| 15 | ACTIVE (modify) — `src/theo/services/gateway.mock.ts` | `Read(full)` this turn | `ae3895d100df17024d634ec852e24355ec797351` |
| 16 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (project region) | `Grep("Projects\|Workspaces")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §UI-Auth | "A planned visual deviation must be cited and classified" | §F-P2 — the share toggle + badges + read-only gating are classified VISUAL-AUTHORITY-DEVIATION + anchored |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §authority | "Walter is the execution, runtime-acceptance, and exemption authority" | §F-P2 — Walter directed the sharing feature (exemption authority) |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §F-P1 — visibility extends the projects surface |
| spec/THEO_API_SPEC.md | §2.2 | "set project visibility / group-visible sharing" | §F-P3 — consumes the deployed §2.2 endpoint + read semantics |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P2 — `setProjectVisibility` behind `theoClient` (ALLOWED DELTA) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT rows carry full interface + VA-id + contract dependency |

---

## F-P1 — Feature identification
**Microstep:** project sharing FE (Tier B5 Phase 1). With B5a-backend live (`visibility` + group-visible RLS/handler broadening), the FE now:
1. **Sharing toggle** (project home, owner-only) — Private ↔ "Shared with the team", calling `theo_set_project_visibility`.
2. **Grid badges** — a group-visible project shows **"Shared"** (owner) or **"Shared with you"** (someone else's); the grid now includes others' group-visible projects (from the broadened `theo_list_projects`).
3. **Ownership-gated editing** — `isOwner=false` (shared-with-me) → read-only config (description/knowledge/instructions/visibility not editable; no rename/delete on the card) but **still chattable** (member starts their own chats; `theo_set_conversation_project` accepts the group-visible project). Config-only sharing (transcripts stay private — enforced server-side).

Walter directed this ("both, phased" → group-visible half). Behind `theoClient`; no backend change.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (project home) | Adds a Private/Shared **toggle** (owner) or a read-only "Shared with you" note (member); gates description/knowledge/instructions editing to the owner. Cited + classified + Rule-Anchored; **Walter-authorized**. | **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3) |
| VA-T1 (Projects grid) | Cards gain a **"Shared"/"Shared with you"** pill (group-visible), and rename/delete row-actions are **owner-only** (hidden on shared-with-me cards). Card chrome otherwise unchanged. | **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized) |
| Gateway / service abstraction (Golden §5) | `setProjectVisibility` added behind `theoClient` → `gateway.live` (mock fallback); `Project` gains `visibility`/`isOwner` mapped from the deployed rows. | ALLOWED DELTA |

No un-cited deviation. No browser→model call. `ChatView`, `Sidebar`, `RowManage`, `ArtifactsView`, `ArtifactPanel`, `ui.tsx`, `icons.tsx` unchanged.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Standalone harness** has a single local user, so `isOwner` is always true and no "shared with you" cards appear; the toggle + "Shared" badge still exercise. | **PROCEED** — harness-only; the live SWA (with the employees-only gate + multiple users) exercises cross-user sharing. |
| **G-2** | **"0 docs" on grid cards** for group-visible projects (pre-existing G-6: `theo_list_projects` omits knowledge; count is 0 until opened). | **PROCEED (pre-existing)** — unrelated to B5a; a `knowledge_count` follow-on is still deferred. |
| **G-3** | **Optimistic toggle** — visibility flips immediately; on server failure it rolls back (projects list + held `chatProject`) and shows an error. | **PROCEED (intended)** — same optimistic+rollback discipline as B4f/B4g. |
| **G-4** | **Per-member invite + roster** (`theo_project_members`, presence panel) is Phase 2. | **PROCEED (future-trigger).** Not in this pack; needs the Graph admin-consent (out of scope here). |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`.

## F-P3 — Backend / contract grounding
Consumes the deployed, golden-verified B5a contract (API Spec §2.2, landed `0560ea8`):
- **Set visibility:** `POST /api/theo_set_project_visibility {id, visibility}` (owner-only) → `{ project: { id, visibility } }`; 403/404 non-owner/absent.
- **List (broadened):** `GET /api/theo_list_projects` → each row now carries `visibility` + `is_owner`, and the set includes group-visible projects owned by others.
- **Knowledge / chat link (broadened):** `theo_list_project_knowledge` + `theo_set_conversation_project` accept an owned ∨ group-visible project — a member reads the shared config + links their own chats.
- **Transport/auth:** absolute `${VITE_FUNCTIONS_URL}/api/...` + Bearer; mock fallback unconfigured. No backend change in this pack.

## F-P4 — Component reference grounding
**Modified:** `types.ts` (`Project` +`visibility`/`isOwner`, `ProjectVisibility`), `data.ts` (seed type relaxed to `Omit<Project,"visibility"|"isOwner">[]`), `services/gateway.live.ts` (`RawProject` +fields, `toProject` maps them, `setProjectVisibility`), `services/gateway.mock.ts` (seed/create add fields, `setProjectVisibility`), `services/theoClient.ts` (`setProjectVisibility` passthrough), `useTheoState.ts` (state owner — `setProjectVisibility` optimistic+rollback), `components/ProjectsView.tsx` (badge + owner-gated actions), `components/ProjectDetail.tsx` (toggle + ownership-gated edits + member read-only), `components/TheoMain.tsx` (`onSetVisibility`). **Reused-unchanged:** `RowManage`, `ChatView`, `Sidebar`. Governing authority = VA-T1 (deviation, Walter-authorized) + Golden Component Pack (§3 CCT, §5 abstraction) + the deployed B5a contract.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; required-before-optional; `on<Event>`; full TS interfaces.

| # | Module (ownership; ACTIVE/NEW) | Interface / behavior (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `types.ts` (**ACTIVE**, modify) | `export type ProjectVisibility = "private" \| "group"`. `Project` gains `visibility: ProjectVisibility; isOwner: boolean` (after `knowledge`). | VA-T1 (no surface) | API Spec §2.2 | PROCEED |
| TC-2 | `data.ts` (**ACTIVE**, modify) | `INIT_PROJECTS` retyped `Omit<Project, "visibility" \| "isOwner">[]` (harness seed; gateway.mock adds the fields on load). No literal change. | VA-T1 (no surface) | — | PROCEED |
| TC-3 | `services/gateway.mock` (**ACTIVE**, modify) | Seed map + `createProject` set `visibility: "private"`, `isOwner: true`. Adds `setProjectVisibility(id: string, visibility: string): Promise<{ id: string; visibility: string }>` (updates in-memory; returns normalized value). | VA-T1 (no surface) | mocked-contract | PROCEED |
| TC-4 | `services/gateway.live` (**ACTIVE**, modify) | `RawProject` gains `visibility?: string \| null`, `is_owner?: boolean`. `toProject` maps `visibility` (`"group"`→group else private) + `isOwner` (`is_owner !== false`, so create/update — which omit it — default owned). Adds `setProjectVisibility(id: string, visibility: string): Promise<{ id: string; visibility: string }>` → `POST theo_set_project_visibility`, returns `{ id, visibility }` from `data.project` (throws if missing). Mock fallback unconfigured. | VA-T1 (no surface) | `theo_set_project_visibility` (DEPLOYED B5a) | PROCEED |
| TC-5 | `services/theoClient` (**ACTIVE**, modify) | Adds `setProjectVisibility(id: string, visibility: string): Promise<{ id: string; visibility: string }> { return gatewaySetProjectVisibility(id, visibility); }`. | VA-T1 (no surface) | Golden §5 boundary | PROCEED |
| TC-6 | `useTheoState` (**ACTIVE**, modify — state owner) | Adds `setProjectVisibility(id: string, visibility: "private" \| "group")`: snapshot prior `visibility` (list) + held `chatProject.visibility`; **optimistic** across `projects` + `chatProject`; on success normalize from the returned value; **on failure** `setError` + roll back both (same independent-`chatProject` discipline as B4f/B4g). Exposed on the returned object. | VA-T1 (state owner) | API Spec §2.2; DEPLOYED B5a | PROCEED |
| TC-7 | `components/ProjectsView` (**ACTIVE**, modify) | `ProjectsViewProps` unchanged (already has `onRenameProject`/`onDeleteProject`). Card: `{p.isOwner && (<RowActions …/>)}` (owner-only rename/delete); footer gains a pill `{p.visibility === "group" && <span>{p.isOwner ? "Shared" : "Shared with you"}</span>}`. | VA-T1 → **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized) | `theo_list_projects` (visibility/is_owner, DEPLOYED B5a) | PROCEED |
| TC-8 | `components/ProjectDetail` (**ACTIVE**, modify) | Adds `onSetVisibility: (id: string, visibility: "private" \| "group") => void` to `ProjectDetailProps`. `const isOwner = project.isOwner`. Description editable only when `isOwner` (else read-only text). New **sharing row**: owner → a toggle button calling `onSetVisibility(project.id, project.visibility === "group" ? "private" : "group")`; member → a read-only "Shared with you · read-only" pill. Knowledge remove buttons + add-form are `{isOwner && …}`; instructions render an `InputBox` (owner) or read-only `<p>` (member). Chats list + new-chat + chat rename/delete unchanged (member's own chats). | VA-T1 → **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized) | `theo_set_project_visibility` + broadened reads (DEPLOYED B5a) | PROCEED |
| TC-9 | `components/TheoMain` (**ACTIVE**, modify) | `TheoMainProps` unchanged (`{ t, mode }`). `<ProjectDetail>` render gains `onSetVisibility={t.setProjectVisibility}`. No other change. | VA-T1 (main region) | via `theoClient` | PROCEED |

**Infra:** consumes the already-baked `VITE_FUNCTIONS_URL`. No `vite.config`/dependency change. `RowManage.tsx`, `ChatView.tsx`, `Sidebar.tsx`, `ArtifactsView.tsx`, `ArtifactPanel.tsx`, `Customize.tsx`, `ui.tsx`, `icons.tsx`, `swapBlock.ts` unchanged.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `0560ea8`: `types.ts`, `data.ts`, `useTheoState.ts`, `components/ProjectsView.tsx` + `ProjectDetail.tsx` + `TheoMain.tsx`, `services/theoClient.ts` + `gateway.live.ts` + `gateway.mock.ts` (all in the GCR with blob SHAs). Guardrails: gateway abstraction preserved (`setProjectVisibility` through `theoClient`); no browser→model call; **no `localStorage`/`sessionStorage`** (`descEditing` etc. are component-local React state); no Tailwind; no `reporting_*`. Reused-unchanged: `RowManage` (B4f), the B4e project-home + B4f/B4g state.

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; the visual deviation is cited + classified + anchored + Walter-authorized (F-P2); Gap Disclosure present (G-1…G-4 all PROCEED); CCT locked (9 rows, full interfaces, TheoMain/ProjectsView interfaces noted unchanged). Validated this turn (`tsc` + `eslint .` exit 0 + `build` green; TheoSurface 240.27 KB / 71.11 KB gzip; `src` reverted). On Codex APPROVAL, Pass 3 commits the nine files and Walter redeploys the Theo SWA → **sharing works end-to-end**: an owner flips a project to "Shared with the team"; colleagues see it in their grid ("Shared with you"), open it read-only, and start their own chats with its knowledge/instructions; owners keep full edit control; no chat transcripts are exposed. Walter SWA acceptance = Visual Acceptance Evidence.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B5a-FE-Project-Visibility-Pass-1-VEP/Theo_1B_B5a_FE_Project_Visibility_VEP.md" --repo-root .
PASS
```

*End of B5a-FE Project Visibility Pass-1 Frontend VEP (plan only).*
