# Theo Frontend — project-scoped review chats (arm review project + scope the drawer) — Pass-1 Frontend Verified Evidence Pack

Plan-only VEP. Part 4 (final) of the #5 custom-Theo-dock program. Ties Sigma review chats to a durable per-review Theo **project** (Walter 2026-07-16: chats saved in the review's project; new chats stay in it): (a) a `getOrCreateReviewProject` client method → the deployed `theo_get_or_create_review_project` (Role-C at HEAD); (b) on review arm, resolve the one project for `sigma_review_id` and keep every fresh review chat **in** it; (c) **scope the ☰ drawer's recents** to that project (only this review's chats). Reuses the existing project↔conversation seam (`startInProject` + the after-first-turn `setConversationProject`) + the existing recents filter. Reviewer: Codex (FE).

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: 7d6479dd27224be5a07e9d6d1f39ba5f319665c6 (vault-theo development; the commit that first adds this VEP — artifact-presence probe resolves there and at every later commit)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
```

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend §4A track, hence `N/A`.)

## Codex-rejection correction (v2)

v1 REJECTED (F-P2.5/F-P7): the arm/re-arm plan kept an un-keyed `reviewProjectId`, so on review A → review B it stayed A's id until B's async get-or-create resolved — during that window the recents filter could show A's chats under B, and the re-arm could `startInProject(A)` (messages empty). **Fix (fail-closed + keyed):** the state is now `reviewProject: { rid: string; id: string } | null` — the project id is **tagged with the review it belongs to**. A derived `activeReviewProjectId = reviewProject && reviewProject.rid === currentRid ? reviewProject.id : null` is the **only** value the recents-scoping and re-arm consume, so the moment the review id changes it is `null` until B's own get-or-create resolves — never A's id. The arm effect additionally **clears `reviewProject` immediately** when `currentRid` changes (belt-and-suspenders) and applies B's result only under `reviewArmRef.current === currentRid`. During the window recents fall back to unscoped (all chats — never the wrong review's), and re-arm cannot fire for a stale project. The CCT, F-P2.5, Structural Mirror, and F-P7 reflect v2.

## Codex-rejection correction (v3)

v2 REJECTED (F-P2.5/F-P7): the keyed state fixed stale **re-arm**, but the recents predicate `activeReviewProjectId ? scoped : true` **failed open** during the A→B resolve window — with `activeReviewProjectId` null it showed ALL recents (A's + unrelated chats), violating review-mode scope and letting an A chat be selected under B. **Fix (fail-closed recents):** three-way — `!currentRid` (not review mode) → global (unchanged); review mode + project resolved → scoped to it; review mode + `currentRid` set but `activeReviewProjectId` not yet resolved → **empty** (a brief loading gap), never global. Predicate: `!currentRid ? true : (activeReviewProjectId ? c.project_id === activeReviewProjectId : false)`. F-P2.5 (3), the CCT recents, and F-P7 reflect v3.

Current-turn grounding: Read `src/theo/services/gateway.live.ts` (`createProject` lines 522–537 — the `POST theo_create_project` → `toProject` idiom to mirror); `src/theo/services/theoClient.ts` (`createProject` delegation line 118); `src/theo/useTheoState.ts` (`hasReviewContext` 36–41; `appContext` 74; `ingestAppContext` 109; `recents = recentsList.filter(title includes search)` 120; `loadChatProject` 202–217; `newChat` 225 — resets thread + `setChatProject(null)`; `startInProject(id)` 219–235 — awaits `loadChatProject` then resets thread; `send` project-link 457–458; return 714–729 incl. `reviewMode`); `src/theo/types.ts` (`Project` 29–44; `ConversationSummary.project_id` 119–123); `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4B (VA-T1 / VA-T3) + `THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` §7; `spec/THEO_API_SPEC.md` §2.2 (`theo_get_or_create_review_project`, at HEAD via the Role-C).

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
|-------------------|-----------|----------------------|----------------------|
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §7 | "reproduced faithfully, no redesign" | recents list + landing UI unchanged; content scoped by review context (F-P2) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "MUST be registered here before it may be cited." | VA-T1 (sidebar/projects/chat) + VA-T3 (app-context) — registered |
| spec/THEO_API_SPEC.md | §2.2 | "theo_get_or_create_review_project" | F-P3: `getOrCreateReviewProject` → the deployed route (at HEAD) |

## F-P1 — Feature identification

Microstep: after 5.2, the Sigma dock is review-aware but its chats still land in the **global** recents with no project home (a review reopened later can't find its chats; a "New chat" isn't scoped). This wires each review to a durable Theo project. In scope: `src/theo/services/gateway.live.ts` + `src/theo/services/theoClient.ts` (`getOrCreateReviewProject`); `src/theo/useTheoState.ts` (`reviewProject` keyed state + arm + re-arm effects + recents scoping). Deferred: including the period in the project name (needs a small Sigma-FE `app_context` add — the name uses `fund_name` here); a drawer project-header chip (the 5.2 "Review assistant · <fund>" chip already signals scope).

## F-P2 — UI Authority Reconciliation

- **VA-T1** (sidebar recents / projects / chat): **VISUAL-AUTHORITY-MATCH.** No UI/markup change. The recents list is scoped by `project_id` in review mode — the **same list component**, an additional filter alongside the existing search filter (precedent: `recents` already filters by `search`; `ProjectDetail` already lists a project's own chats). New review chats are placed in the review project via the existing `startInProject` (the same mechanism the Projects UI uses). No new surface.
- **VA-T3** (app-context, context-only/no-fetch): the review project is resolved from the already-ingested `app_context` (`sigma_review_id`); the one network call is the deployed get-or-create (a write the app_context layer's no-*app-data*-fetch rule doesn't preclude — it creates/reads a Theo project, not app data).
- No new VA. Only VA-T1 / VA-T3 (registered §4B) cited.

## F-P2.5 — Gap Disclosure

**PROCEED.** The state is **keyed to the review**: `reviewProject: { rid: string; id: string } | null`, and `currentRid` = (review mode ? `app_context.sigma_review_id` : null) is derived each render. The **only** id the consumers use is the derived `activeReviewProjectId = reviewProject && reviewProject.rid === currentRid ? reviewProject.id : null` — so a stale (review-A) project is structurally never used for review B (mismatched `rid` → `null`).

(1) **Arm** effect (deps `[reviewMode, appContext]`): set `reviewArmRef.current = currentRid`; if `!currentRid`, `setReviewProject(null)` and return; else **immediately** `setReviewProject(prev => (prev && prev.rid === currentRid ? prev : null))` (drop any other review's project the instant the id changes — fail-closed), then `getOrCreateReviewProject('sigma', currentRid, fund)` and apply **only** under `reviewArmRef.current === currentRid` → `setReviewProject({ rid: currentRid, id: p.id })` (mirrors the load-effect `live` guard + `SigmaApp.reviewCtxReq`).
(2) **Re-arm** effect (deps `[activeReviewProjectId, messages.length, chatProject?.id]`): when `activeReviewProjectId` (proven to belong to the current review) AND `messages.length === 0` AND `chatProject?.id !== activeReviewProjectId`, call `startInProject(activeReviewProjectId)` — puts the *fresh* review chat in the project on initial open, after the Sigma per-review `newChatNonce` fire, and after the user's "New chat"; never fires mid-conversation (`messages.length > 0`), once already in the project (no loop), or for a stale project (`activeReviewProjectId` is `null` during an A→B window).
(3) **recents scoping (fail-closed)**: `recents` predicate (AND the search filter) = `!currentRid ? true : (activeReviewProjectId ? c.project_id === activeReviewProjectId : false)`. Not review mode (`!currentRid`) → global (unchanged). Review mode with the project **resolved** → only this review's chats. Review mode while the project is **still resolving** (or on an A→B switch, before B resolves) → **empty** (fail closed — a brief loading gap), so the drawer never shows global recents nor review A's chats under review B, and no A chat is selectable under B.
(4) Name uses `fund_name` (period not in `app_context` today) — cosmetic; the project is keyed by `source_ref = sigma_review_id`, so identity is correct regardless of name, and a user rename sticks. Disclosed, PROCEED. No PRE-LAND/ESCALATE.

## F-P3 — Contract grounding

`getOrCreateReviewProject(appKey, sourceRef, name)` → `POST /api/theo_get_or_create_review_project` `{ app_key, source_ref, name }` → `{ data: { project } }` (deployed; API-Spec §2.2 at HEAD), mapped via the existing `toProject`. No other contract. The conversation↔project link on first turn (`setConversationProject`) is unchanged.

## F-P4 — Component reference grounding (Primary Reference)

**PRIMARY REFERENCE: the deployed `src/theo/services/gateway.live.ts` (`createProject`) + `src/theo/useTheoState.ts`** (the `startInProject`/`recents`/arm seam). Not GREENFIELD, not composite.

## F-P5 — Component Contract Table

| Component (ownership) | Prop / input interface (TypeScript — full literal) | Visual authority | Data / contract dependency | Impl eligibility |
|---|---|---|---|---|
| `getOrCreateReviewProject` (`gateway.live.ts` + `theoClient.ts`; ACTIVE, add) | `export async function getOrCreateReviewProject(appKey: string, sourceRef: string, name: string): Promise<Project>` — mirrors `createProject`: `POST ${apiBase}/api/theo_get_or_create_review_project` body `{ app_key: appKey, source_ref: sourceRef, name: name.trim() }`, `toProject(json.data.project)`; throws on non-JSON / `!res.ok` / missing `data.project`. Exposed on the client as `getOrCreateReviewProject(appKey: string, sourceRef: string, name: string): Promise<Project>`. | n/a (service module) | `theo_get_or_create_review_project` (deployed) | PROCEED |
| `useTheoState` (`useTheoState.ts`; ACTIVE, modify) | Adds `const [reviewProject, setReviewProject] = useState<{ rid: string; id: string } \| null>(null)` + `const reviewArmRef = useRef<string \| null>(null)`; derived `const currentRid = reviewMode && typeof appContext.app_context?.sigma_review_id === "string" ? (appContext.app_context.sigma_review_id as string) : null` and `const activeReviewProjectId = reviewProject && reviewProject.rid === currentRid ? reviewProject.id : null`. **Arm effect** (deps `[reviewMode, appContext]`): `reviewArmRef.current = currentRid`; `if (!currentRid) { setReviewProject(null); return; }`; `setReviewProject(prev => (prev && prev.rid === currentRid ? prev : null))`; `getOrCreateReviewProject('sigma', currentRid, fund)` → guard `reviewArmRef.current === currentRid` → `setReviewProject({ rid: currentRid, id: p.id })`. **Re-arm effect** (deps `[activeReviewProjectId, messages.length, chatProject?.id]`): `if (activeReviewProjectId && messages.length === 0 && chatProject?.id !== activeReviewProjectId) void startInProject(activeReviewProjectId)`. **recents** (fail-closed in review mode): `recentsList.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) && (!currentRid ? true : (activeReviewProjectId ? c.project_id === activeReviewProjectId : false)))`. `startInProject`/`newChat`/`send`/`ingestAppContext` bodies unchanged. | VA-T1 (recents list) — MATCH | `getOrCreateReviewProject`; `ConversationSummary.project_id` | PROCEED |

No `any`. `getOrCreateReviewProject` returns the existing `Project` type (the extra `source_ref` field is ignored by `toProject`; no `Project`-type change). Only additive state + two effects + one filter clause.

## Component Structural Mirror Table (F-I2)

| Region (Theo FE) | Primary Reference | Classification |
|---|---|---|
| `getOrCreateReviewProject` gateway fn | deployed `createProject` gateway fn | ALLOWED DELTA (same fetch/`toProject` idiom; new route + `{app_key,source_ref,name}` body) |
| arm effect (keyed `reviewProject={rid,id}`, immediate clear-on-rid-change, `reviewArmRef` guard) | deployed load-effect `live` guard + `SigmaApp.reviewCtxReq` | EXACT-INTENT (same request-key discipline; fail-closed on every review-id change) |
| re-arm effect (`startInProject(activeReviewProjectId)` — only when the project is proven current) | deployed `startInProject` (used by ProjectDetail "Start a chat") | ALLOWED DELTA (invokes the deployed project-arm on the review's fresh chat; gated by `activeReviewProjectId`, never a stale id) |
| recents scoping via `currentRid`/`activeReviewProjectId` (fail-closed in review mode) | deployed `recents` search filter | ALLOWED DELTA (one added predicate on the same list; global outside review mode, scoped when resolved, empty while resolving — no UI change) |

## F-P6 — Repository & active-surface grounding

Target files (Read this turn): `src/theo/services/gateway.live.ts`, `src/theo/services/theoClient.ts`, `src/theo/useTheoState.ts`, `src/theo/types.ts`. Guardrails: additive only — the new gateway fn + client method; `reviewProjectId` state + two effects + the recents predicate; `startInProject`/`newChat`/`send`/`ingestAppContext`/the Sidebar/ChatView markup unchanged; no `any`; no backend change; the arm is stale-guarded and the re-arm is idempotent (no loop, never fires mid-conversation).

## F-P7 — Plan body (Pass-3, on APPROVAL)

1. **`gateway.live.ts`**: add `getOrCreateReviewProject(appKey, sourceRef, name)` mirroring `createProject` (POST the new route; `toProject`). **`theoClient.ts`**: expose `getOrCreateReviewProject(appKey, sourceRef, name)` delegating to the gateway.
2. **`useTheoState.ts`**: add `reviewProject: { rid: string; id: string } | null` state + `reviewArmRef`; derive `currentRid` + `activeReviewProjectId` (rid-matched); the arm effect (deps `[reviewMode, appContext]`) — set `reviewArmRef`, clear on `!currentRid`, immediately drop a mismatched `reviewProject`, then `getOrCreateReviewProject` applied only under `reviewArmRef.current === currentRid` as `{ rid: currentRid, id }`; the re-arm effect (deps `[activeReviewProjectId, messages.length, chatProject?.id]`) → `startInProject(activeReviewProjectId)` for a fresh empty review chat; scope `recents` fail-closed: `!currentRid ? true : (activeReviewProjectId ? c.project_id === activeReviewProjectId : false)`.
3. **Verify**: `tsc` + `vite build` green; on the dev SWA, open review A → its fresh chat is in A's project (send a turn → appears under A); ☰ drawer shows only A's chats; "New chat" starts another chat in A; reopening A restores its chats; **switch A→B rapidly → during B's resolve the drawer shows NO recents (empty/loading, NOT global — fail closed) and no `startInProject(A)` fires; once B resolves the drawer shows only B's chats**; general Theo (no review armed) shows global recents unchanged; no `any`.
4. **Pass-3 evidence** → dev-SWA test plan; Walter starts two chats in one review + reopens it.

## Mechanical lint

Command: `node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Frontend-Review-Project-Scoped-Chats-Pass-1-VEP/INDEX.md" --repo-root .`

Expect `PASS` and exit `0`.

## Requested action

Codex Pass-2 review against Frontend Conformance §6 + the Golden Component Pack. Plan-only; no code changed. On APPROVED, Claude Code executes Pass-3 per F-P7 on `development` (vault-theo). This completes #5 (the custom Theo review dock).
