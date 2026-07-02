# Theo 1B — B5d-FE Owner "Shared" Badge (grid badge on `memberCount`) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) and Walter redeploys the Theo SWA. **Microstep:** the FE half of B5d — the **owner's Projects grid now badges "Shared" for a privately-shared project** (one it has invited members to), not only for `visibility='group'`. Consumes the deployed, golden-verified B5d `member_count` on `theo_list_projects` (owner-gated). Three-line surface change: `Project` gains `memberCount`, the gateway maps it, and the `ProjectsView` badge condition adds `|| (p.isOwner && p.memberCount > 0)`. Closes the gap Walter observed on the SWA (2026-07-02). Behind `theoClient`; no backend change.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `f3868e6` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack. **Visual-authority DEVIATION** turn (extends the existing B5a/B5c sharing badge): the owner's grid badge now also fires for a privately-shared project (`memberCount > 0`), reusing the same pill chrome/tokens. Per FE Governor a planned visual deviation is valid when **cited + classified (VISUAL-AUTHORITY-DEVIATION) + Rule-Anchored**, with **Walter** as the exemption authority — he flagged the missing owner badge on the SWA this session. VA-T1 read this turn (`frontend/theo-frontend-reference.jsx` project region). Consumed contract deployed + golden-verified (`theo_list_projects` owner-gated `member_count`, B5d `f3868e6`; owner private+invite → `member_count=1`, owner private/none → 0, group → 0, non-owner row → 0 no-leak). The four proposed files were applied to `src` this turn and pass `npm run typecheck` (exit 0) + `eslint` (exit 0) + `npm run build` (TheoSurface 247.15 KB / 72.63 KB gzip); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§UI Authority Reconciliation; §exemption authority) | `git grep -F "A planned visual deviation must be cited and classified" / "Walter is the execution, runtime-acceptance, and exemption authority"` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B; §6) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 deltas) | `git grep -F "three locked surfaces" / "service-module/gateway abstraction"` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (Projects surface) | cited (surface authority) | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 5 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4 projects CRUD) | `git grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 6 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 projects) | `git grep -F "set project visibility / group-visible sharing"` this turn | `30f1cacb83458acf636f44113ddbbf72d09859d0` |
| 7 | ACTIVE (modify) — `src/theo/types.ts` (`Project` +`memberCount`) | `Read(full)` this turn | `5b67947b654d605a20ef68a3a18434c3c9051122` |
| 8 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` (`RawProject` +`member_count`, `toProject` maps it) | `Read(full)` this turn | `2ac91bd21f212a186940e0a33b1966bff45b3920` |
| 9 | ACTIVE (modify) — `src/theo/services/gateway.mock.ts` (seed/create +`memberCount`; `listProjects` reflects the member store) | `Read(full)` this turn | `76924b0084a326a57227a0a3cd32a0b2632ece0b` |
| 10 | ACTIVE (modify) — `src/theo/components/ProjectsView.tsx` (badge condition) | `Read(full)` this turn | `8fd3f09c68f8ba75ae0afcf3c8c16d7bd38ede07` |
| 11 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (project region) | `Grep("Projects\|project")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §UI-Auth | "A planned visual deviation must be cited and classified" | §F-P2 — the extended owner badge is classified VISUAL-AUTHORITY-DEVIATION + anchored |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §authority | "Walter is the execution, runtime-acceptance, and exemption authority" | §F-P2 — Walter flagged the missing owner badge (exemption authority) |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §F-P1 — memberCount extends the projects list surface |
| spec/THEO_API_SPEC.md | §2.2 | "set project visibility / group-visible sharing" | §F-P3 — consumes the §2.2 list (B5d owner-gated member_count) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P2 — member_count mapped in gateway.live → `Project` (ALLOWED DELTA) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT rows carry full interface + VA-id + contract dependency |

---

## F-P1 — Feature identification
**Microstep:** owner "Shared" grid badge. With B5d-backend live (`theo_list_projects` returns an owner-gated `member_count`), the Projects grid badges an owner's **privately-shared** project (≥1 invitee) as "Shared" — not only `visibility='group'`. Closes the gap Walter observed: "Test Project" (private, shared with Jared) showed no badge. Non-owner badge logic (B5c `sharedWithMe`) is unchanged. Behind `theoClient`; no backend change.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (Projects grid) | The existing sharing pill's *render condition* gains `|| (p.isOwner && p.memberCount > 0)`; the pill chrome, tokens, and label logic are unchanged (owner still reads "Shared"). Cited + anchored; **Walter-authorized** (he flagged the gap). | **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; extends the B5a/B5c badge) |
| Gateway / service abstraction (Golden §5) | `Project` gains `memberCount`; `RawProject`+`member_count`, `toProject` maps it (default 0); mock seed/create add it + `listProjects` reflects the harness member store. | ALLOWED DELTA |

No un-cited deviation. No browser→model call. `ProjectDetail`, `useTheoState`, `theoClient`, `ChatView`, `Sidebar`, `RowManage`, `TheoMain` unchanged.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Owner-gated count** — `member_count` is 0 for non-owner rows (backend `CASE created_by=$1`), so the new clause `p.isOwner && p.memberCount > 0` only ever fires for the owner; a non-owner's badge is still driven by `sharedWithMe`/`visibility` (B5c). No co-member-count exposure. | **PROCEED** — owner-gated server-side + guarded by `p.isOwner` in the condition. |
| **G-2** | **Harness** roster is empty, but the mock member store (`shareProject`) now feeds `listProjects` `memberCount`, so the badge is exercisable locally by inviting in the harness (mock). | **PROCEED** — harness coherent; live SWA exercises real invites. |
| **G-3** | **API Spec note** — §2.2 gains a `member_count` mention on the next Role-C touch (additive read field). | **PROCEED (non-blocking)** — documented in the B5d backend VEP G-3. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`.

## F-P3 — Backend / contract grounding
Consumes the deployed, golden-verified B5d contract:
- `GET /api/theo_list_projects` rows now carry `member_count` (integer; owner-gated — 0 for non-owner rows). All other fields unchanged.
- **Transport/auth:** absolute `${VITE_FUNCTIONS_URL}/api/...` + Bearer; mock fallback unconfigured. No backend change in this pack.

## F-P4 — Component reference grounding
**Modified (4):** `types.ts` (`Project` +`memberCount`), `services/gateway.live.ts` (`RawProject` +`member_count`, `toProject` maps `memberCount: typeof r.member_count === "number" ? r.member_count : 0`), `services/gateway.mock.ts` (seed/create +`memberCount: 0`; `listProjects` maps `memberCount` from the harness member store), `components/ProjectsView.tsx` (badge condition). **Reused-unchanged:** `useTheoState`, `theoClient`, `ProjectDetail`, `RowManage`. Governing authority = VA-T1 (deviation, Walter-authorized) + Golden Component Pack (§3 CCT, §5 abstraction) + the deployed B5d contract.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; full TS interfaces.

| # | Module (ownership; ACTIVE/NEW) | Interface / behavior (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `types.ts` (**ACTIVE**, modify) | `Project` gains `memberCount: number` (after `sharedWithMe`). | VA-T1 (no surface) | API Spec §2.2 (B5d) | PROCEED |
| TC-2 | `services/gateway.live` (**ACTIVE**, modify) | `RawProject` +`member_count?: number`; `toProject` sets `memberCount: typeof r.member_count === "number" ? r.member_count : 0`. | VA-T1 (no surface) | `theo_list_projects` (`member_count`, DEPLOYED B5d) | PROCEED |
| TC-3 | `services/gateway.mock` (**ACTIVE**, modify) | Seed map + `createProject` add `memberCount: 0`. `listProjects` maps `memberCount: (mockMembers[p.id] ?? []).length` (owner-scoped harness reflection). | VA-T1 (no surface) | mocked-contract | PROCEED |
| TC-4 | `components/ProjectsView` (**ACTIVE**, modify) | Badge render condition becomes `{(p.visibility === "group" \|\| p.sharedWithMe \|\| (p.isOwner && p.memberCount > 0)) && (…)}`; label logic unchanged (`p.isOwner ? "Shared" : p.sharedWithMe ? "Shared with you" : "Shared with the team"`). No prop change (`ProjectsViewProps` unchanged). | VA-T1 → **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized) | `theo_list_projects` (`member_count`, DEPLOYED B5d) | PROCEED |

**Infra:** consumes the already-baked `VITE_FUNCTIONS_URL`. No `vite.config`/dependency change. `useTheoState.ts`, `theoClient.ts`, `ProjectDetail.tsx`, `TheoMain.tsx`, `RowManage.tsx`, `Sidebar.tsx`, `data.ts` unchanged.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `f3868e6`: `types.ts`, `services/gateway.live.ts` + `gateway.mock.ts`, `components/ProjectsView.tsx` (all in the GCR with blob SHAs). Guardrails: gateway abstraction preserved (`member_count` mapped in gateway.live → `Project`); no browser→model call; **no `localStorage`/`sessionStorage`**; no Tailwind; no `reporting_*`. Reused-unchanged: the B5c sharing surface (invite section, `sharedWithMe` badge).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; the visual deviation is cited + classified + anchored + Walter-authorized (F-P2); Gap Disclosure present (G-1…G-3 all PROCEED); CCT locked (4 rows, full interfaces, ProjectsView interface noted unchanged). Validated this turn (`tsc` + `eslint` exit 0 + `build` green; TheoSurface 247.15 KB / 72.63 KB gzip; `src` reverted). On Codex APPROVAL, Pass 3 commits the four files and Walter redeploys the Theo SWA → an owner's privately-shared project now badges **"Shared"** on the grid (closing Walter's observed gap); non-owner badges unchanged. Walter SWA acceptance = Visual Acceptance Evidence.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B5d-FE-Owner-Shared-Badge-Pass-1-VEP/Theo_1B_B5d_FE_Owner_Shared_Badge_VEP.md" --repo-root .
PASS
```

*End of B5d-FE Owner "Shared" Badge Pass-1 Frontend VEP (plan only).*
