# SPW Phase 0b-2 — FE cutover: point the 15 project `gateway.live` calls at `projectsBase` (func-projects) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the one changed file to `development` (verified `tsc`/`eslint`/`build` green this turn against `src`, reverted) → the Theo SWA CI redeploys (salmon-river dev + the vault-origin-mounted remote). **Microstep:** the paired FE half of the Shared Project Workspace Phase 0b consolidation. The 13 core project handlers are now **DEPLOYED + golden-verified on `vaultgpt-func-projects`** (Phase 0b-1, vault-projects `a9b4897`; all 13 authenticated curls pass). This VEP **repoints the 15 project-domain fetch call sites** in `src/theo/services/gateway.live.ts` from `${apiBase}` (the premium monolith) to the already-wired `${projectsBase}` (func-projects) — the same base the existing `addProjectKnowledgeFile` call already uses. **Single-file, base-URL-only change:** no function signature, request/response shape, auth, or rendered-surface change (all behind the `theoClient`/`gateway.live` boundary; 1A handover §2.3). Premium keeps serving these routes, so this is a reversible cutover (rollback = revert the file).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `072d10d549b09c587f38abd173a739685e4c7573` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 Frontend VEP (FE Conformance §4 matrix → Full Baseline Grounding). Real-in-1B FE cutover (not a revision). Frontend sub-phases F-P1…F-P7 walked below; the backend P/I/E track does not apply to a frontend VEP → `N/A`. The single changed file `src/theo/services/gateway.live.ts` was read this turn; the 15 `${apiBase}` project call sites are enumerated in §F-P4. The change was applied to `src` this turn and passes `npm run typecheck` (exit 0) + `eslint` on the file (exit 0) + `npm run build` (TheoSurface 321.75 KB / 96.55 KB gzip, built ✓); `src` was then reverted so this package carries only `proposed-src/`. **Cutover pre-verified this turn:** func-projects platform CORS = `*` and a simulated browser preflight (unauth OPTIONS + Origin + `Access-Control-Request-Method`) to `/api/theo_list_projects` returned **HTTP 200 + `Access-Control-Allow-Origin: *`**; the 13 relocated handlers are live + behavior-identical (Phase 0b-1 golden curls); `authHeaders()` sends the same `Authorization: Bearer` shell-identity token func-projects already accepted in those curls. No CORS/EasyAuth change needed.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); independently verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 gateway abstraction / build discipline) | `grep -F "gateway abstraction"` this turn | `3afec7ea4b13650ce2bf28bf32073179a35e7b24` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5 GCR; §4 matrix) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `1e6213e404dbd16f70798f701ae1df36cbc9af25` |
| 3 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (hard gates) | cited (regime reviewer) | `25cc488091d619d8f6642b10552df0d019a87933` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 allowed deltas — service-module) | `grep -F "service-module/gateway abstraction" / "three locked surfaces"` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2 project endpoints; func-projects deploy) | `grep -F "list / create / update / delete projects"` this turn | `60a2d548d75022c01595d6e5860c5003b76abe20` |
| 6 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Projects domain) | cited (domain) | `97645ecd0bc9e3c25082dd2a333c82ab83446584` |
| 7 | ACTIVE (modify — the ONLY changed file) — `src/theo/services/gateway.live.ts` (project calls; `projectsBase` already defined) | `Read(full)` + `grep` call sites this turn | `7c5aa141f6ce2575b0320437e7628b1dceff4b01` |
| 8 | Phase 0b-1 relocation (deployed handlers being consumed) — vault-projects `SPW-Phase0b1-…` (13 handlers on func-projects) | golden-curl-verified this session (vault-projects `a9b4897`) | tracked (sibling repo) |

No ChatGPT advisory cited. No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`. No rendered-surface change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "gateway abstraction" | §F-P2/§F-P4 — cutover is a base-URL swap behind `gateway.live`/`theoClient` |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P5 — the CCT row (gateway.live) is a service-module ALLOWED DELTA |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT row carries interface + VA-id + contract dependency |
| spec/THEO_API_SPEC.md | §2 | "list / create / update / delete projects" | §F-P3 — consumed contracts (unchanged; host moved to func-projects) |

---

## F-P1 — Feature identification
SPW Phase 0b-2: the FE half of the func-projects consolidation. Phase 0b-1 relocated the 13 core project handlers to `vaultgpt-func-projects` (deployed + golden-verified). This microstep points the FE's project-domain calls at that app by swapping their base URL from `${apiBase}` (premium) to `${projectsBase}` (func-projects, already defined + defaulted in `gateway.live.ts`). After this, the Projects surface talks to the dedicated app end-to-end. Reversible (premium still serves the routes; rollback = revert the file). No new feature, no render change.

## F-P2 — Surface / boundary reconciliation
- **Boundary honored.** All project calls already route through the `theoClient` → `gateway.live` service boundary (FE Governor §6 "gateway abstraction"). This change touches ONLY the transport base URL inside `gateway.live.ts`; `theoClient` signatures and every component (`ProjectsView`, `ProjectDetail`, `useTheoState`) are untouched. No rendered-surface change.
- **`projectsBase` already exists.** Defined at `gateway.live.ts` (`VITE_PROJECTS_FUNCTIONS_URL` || `DEFAULT_PROJECTS_BASE = "https://vaultgpt-func-projects.azurewebsites.net"`) and already used by `addProjectKnowledgeFile`. This VEP extends that same base to the other 15 project call sites.
- **Auth unchanged.** Every call uses `authHeaders()` → `Authorization: Bearer <shell token>` (cross-origin EasyAuth). func-projects accepts that exact audience token (Phase 0b-1 golden curls). `credentials: "same-origin"` is unchanged (auth is the Bearer header, not cookies).

## F-P3 — Consumed contract grounding
Contracts UNCHANGED — only the host moved (Phase 0b-1 is byte-faithful). The consumed endpoints keep their deployed API Spec §2 shapes: `theo_list_projects`/`_create_project`/`_update_project`/`_delete_project` ("list / create / update / delete projects"), `theo_set_project_visibility`, `theo_share_project`/`_unshare_project`/`_list_project_members`, `theo_set_conversation_project`, `theo_list_project_knowledge`/`_add_project_knowledge`/`_remove_project_knowledge`, `theo_get_or_create_review_project`. Response shapes identical → the FE mappers are untouched. (`addProjectKnowledgeFile` already on `projectsBase` — unchanged.)

## F-P4 — The change (15 call sites; base URL only)
In `src/theo/services/gateway.live.ts`, swap `${apiBase}` → `${projectsBase}` at exactly these project call sites (verified this turn; NON-project calls `theo_message`/`theo_list_conversations`/`theo_get_conversation` remain on `${apiBase}` — 4 confirmed untouched):

| line | call |
|------|------|
| 488 | `theo_list_projects` |
| 501 | `theo_set_project_visibility` |
| 520 | `theo_share_project` |
| 535 | `theo_unshare_project` |
| 555 | `theo_list_project_members` |
| 600 | `theo_create_project` |
| 619 | `theo_get_or_create_review_project` |
| 636 | `theo_update_project` |
| 655 | `theo_update_project` |
| 674 | `theo_update_project` |
| 691 | `theo_delete_project` |
| 707 | `theo_list_project_knowledge` |
| 722 | `theo_add_project_knowledge` |
| 760 | `theo_remove_project_knowledge` |
| 779 | `theo_set_conversation_project` |

The modified file is staged at `proposed-src/theo/services/gateway.live.ts`. Diff = 15 lines changed; 0 `${apiBase}` project calls remain.

## F-P5 — Component/service Contract Table (Golden Component Pack §3)
| # | Module (ownership; ACTIVE) | Interface / signatures | Visual authority | Contract dependency |
|---|---|---|---|---|
| CT-1 | `gateway.live` service module (`src/theo/services/gateway.live.ts`; **ACTIVE**, modify) | **All exported function signatures UNCHANGED** (no `theoClient`/component change). **ALLOWED DELTA (§5 "service-module/gateway abstraction"):** the 15 project fetch calls' base URL `${apiBase}` → `${projectsBase}` (the pattern `addProjectKnowledgeFile` already uses). No render; no props. | N/A (service module — no rendered surface; the Projects surface authority is unchanged) | **DEPLOYED** func-projects `theo_*` project endpoints (Phase 0b-1; API Spec §2 shapes unchanged) |

## F-P6 — Guardrails
No `localStorage`/`sessionStorage`; no browser storage. No rendered-surface change (base URL only). No new dependency, no new env (`projectsBase` already defined + defaulted). No `theoClient`/component/type change. No `reporting_*`/`corporate-reporting` change. Auth path unchanged (`authHeaders()` Bearer).

## F-P7 — Risk / regression + verification
- **Reversible cutover, no downtime.** Premium still serves all 15 routes; if func-projects misbehaves, rollback = revert `gateway.live.ts` (one file) → back on premium instantly.
- **Pre-verified this turn:** (a) `tsc`/`eslint`/`build` green (applied to `src`, reverted); (b) func-projects platform CORS `*` + browser-preflight simulation → 200 + `Access-Control-Allow-Origin: *`; (c) the 13 relocated handlers live + behavior-identical (Phase 0b-1 golden curls: list 200, validation 400, ownership 404, create 201 → delete 200); (d) auth: `authHeaders()` Bearer token already accepted by func-projects.
- **Post-deploy (Pass-3):** Claude verifies on the salmon-river dev SWA (Projects list loads, create/rename/delete a project, add/remove knowledge, visibility/share) hitting func-projects; Walter confirms. Then the premium project routes go dormant (Walter may prune later — noted in 0b-1 G-2).

## Gap Register (FE Governor / Conformance vocabulary)
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy = commit to `development` → Theo SWA CI redeploys** (salmon-river dev + the vault-origin-mounted remote). No Walter Azure step. | **PRE-LAND** — Pass-3; Claude commits the one file, verifies on the dev SWA. |
| G-2 | Premium project routes stay live (dormant post-cutover; premium READ-ONLY). | **PROCEED** — 0b-1 G-2; optional Walter premium tidy later. |
| G-3 | Prod cutover (kind-tree) rides the normal dev→main promotion once verified on dev. | **PROCEED** — standard promotion, Walter-authorized. |

## F-P8 — Assembly
GCR + Rule Anchors open the pack; F-P1…F-P7 walked; single-file base-URL swap staged in `proposed-src/`; CCT row = service-module ALLOWED DELTA; verification green + cutover pre-verified (CORS/preflight/handlers/auth). Plan-only. On Codex APPROVAL, Pass-3 commits `gateway.live.ts` to `development`; the SWA CI redeploys; Claude verifies on salmon-river.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of SPW Phase 0b-2 FE cutover Pass-1 Frontend VEP (plan only).*
