# Theo Frontend — project-scoped review chats (arm review project + scope the drawer) — Pass-1 Frontend Verified Evidence Pack

Plan-only VEP. Part 4 (final) of the #5 custom-Theo-dock program. Ties Sigma review chats to a durable per-review Theo **project** (Walter 2026-07-16: chats saved in the review's project; new chats stay in it): (a) a `getOrCreateReviewProject` client method → the deployed `theo_get_or_create_review_project` (Role-C at HEAD); (b) on review arm, resolve the one project for `sigma_review_id` and keep every fresh review chat **in** it; (c) **scope the ☰ drawer's recents** to that project (only this review's chats). Reuses the existing project↔conversation seam (`startInProject` + the after-first-turn `setConversationProject`) + the existing recents filter. Reviewer: Codex (FE).

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: __HEAD__ (vault-theo development; the commit that first adds this VEP — artifact-presence probe resolves there and at every later commit)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
```

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend §4A track, hence `N/A`.)

Current-turn grounding: Read `src/theo/services/gateway.live.ts` (`createProject` lines 522–537 — the `POST theo_create_project` → `toProject` idiom to mirror); `src/theo/services/theoClient.ts` (`createProject` delegation line 118); `src/theo/useTheoState.ts` (`hasReviewContext` 36–41; `appContext` 74; `ingestAppContext` 109; `recents = recentsList.filter(title includes search)` 120; `loadChatProject` 202–217; `newChat` 225 — resets thread + `setChatProject(null)`; `startInProject(id)` 219–235 — awaits `loadChatProject` then resets thread; `send` project-link 457–458; return 714–729 incl. `reviewMode`); `src/theo/types.ts` (`Project` 29–44; `ConversationSummary.project_id` 119–123); `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4B (VA-T1 / VA-T3) + `THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` §7; `spec/THEO_API_SPEC.md` §2.2 (`theo_get_or_create_review_project`, at HEAD via the Role-C).

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
|-------------------|-----------|----------------------|----------------------|
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §7 | "reproduced faithfully, no redesign" | recents list + landing UI unchanged; content scoped by review context (F-P2) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "MUST be registered here before it may be cited." | VA-T1 (sidebar/projects/chat) + VA-T3 (app-context) — registered |
| spec/THEO_API_SPEC.md | §2.2 | "theo_get_or_create_review_project" | F-P3: `getOrCreateReviewProject` → the deployed route (at HEAD) |

## F-P1 — Feature identification

Microstep: after 5.2, the Sigma dock is review-aware but its chats still land in the **global** recents with no project home (a review reopened later can't find its chats; a "New chat" isn't scoped). This wires each review to a durable Theo project. In scope: `src/theo/services/gateway.live.ts` + `src/theo/services/theoClient.ts` (`getOrCreateReviewProject`); `src/theo/useTheoState.ts` (`reviewProjectId` state + an arm effect + a re-arm effect + recents scoping). Deferred: including the period in the project name (needs a small Sigma-FE `app_context` add — the name uses `fund_name` here); a drawer project-header chip (the 5.2 "Review assistant · <fund>" chip already signals scope).

## F-P2 — UI Authority Reconciliation

- **VA-T1** (sidebar recents / projects / chat): **VISUAL-AUTHORITY-MATCH.** No UI/markup change. The recents list is scoped by `project_id` in review mode — the **same list component**, an additional filter alongside the existing search filter (precedent: `recents` already filters by `search`; `ProjectDetail` already lists a project's own chats). New review chats are placed in the review project via the existing `startInProject` (the same mechanism the Projects UI uses). No new surface.
- **VA-T3** (app-context, context-only/no-fetch): the review project is resolved from the already-ingested `app_context` (`sigma_review_id`); the one network call is the deployed get-or-create (a write the app_context layer's no-*app-data*-fetch rule doesn't preclude — it creates/reads a Theo project, not app data).
- No new VA. Only VA-T1 / VA-T3 (registered §4B) cited.

## F-P2.5 — Gap Disclosure

**PROCEED.** (1) **Arm** is stale-switch-guarded: an effect keyed on the review id captures `rid` + a `reviewArmRef`; the async `getOrCreateReviewProject` result is applied to `reviewProjectId` only if `reviewArmRef.current === rid` (mirrors the load-effect `live` guard + `SigmaApp.reviewCtxReq`). Non-review context clears `reviewProjectId`. (2) **Re-arm** effect: when `reviewProjectId` is set AND `messages.length === 0` AND `chatProject?.id !== reviewProjectId`, call `startInProject(reviewProjectId)` — this uniformly puts the *fresh* review chat in the project on initial open, after the Sigma per-review `newChatNonce` fire (which empties the thread), and after the user's "New chat"; it never fires while a conversation is in progress (`messages.length > 0`) or once already in the project (no loop). (3) **recents scoping**: `recents` gains `&& (reviewProjectId ? c.project_id === reviewProjectId : true)` — in review mode the drawer shows only this review's chats; outside review mode it is unchanged. (4) Name uses `fund_name` (period not in `app_context` today) — cosmetic; the project is keyed by `source_ref = sigma_review_id`, so identity is correct regardless of name, and a user rename sticks. Disclosed, PROCEED. No PRE-LAND/ESCALATE.

## F-P3 — Contract grounding

`getOrCreateReviewProject(appKey, sourceRef, name)` → `POST /api/theo_get_or_create_review_project` `{ app_key, source_ref, name }` → `{ data: { project } }` (deployed; API-Spec §2.2 at HEAD), mapped via the existing `toProject`. No other contract. The conversation↔project link on first turn (`setConversationProject`) is unchanged.

## F-P4 — Component reference grounding (Primary Reference)

**PRIMARY REFERENCE: the deployed `src/theo/services/gateway.live.ts` (`createProject`) + `src/theo/useTheoState.ts`** (the `startInProject`/`recents`/arm seam). Not GREENFIELD, not composite.

## F-P5 — Component Contract Table

| Component (ownership) | Prop / input interface (TypeScript — full literal) | Visual authority | Data / contract dependency | Impl eligibility |
|---|---|---|---|---|
| `getOrCreateReviewProject` (`gateway.live.ts` + `theoClient.ts`; ACTIVE, add) | `export async function getOrCreateReviewProject(appKey: string, sourceRef: string, name: string): Promise<Project>` — mirrors `createProject`: `POST ${apiBase}/api/theo_get_or_create_review_project` body `{ app_key: appKey, source_ref: sourceRef, name: name.trim() }`, `toProject(json.data.project)`; throws on non-JSON / `!res.ok` / missing `data.project`. Exposed on the client as `getOrCreateReviewProject(appKey: string, sourceRef: string, name: string): Promise<Project>`. | n/a (service module) | `theo_get_or_create_review_project` (deployed) | PROCEED |
| `useTheoState` (`useTheoState.ts`; ACTIVE, modify) | Adds `const [reviewProjectId, setReviewProjectId] = useState<string \| null>(null)` + `const reviewArmRef = useRef<string \| null>(null)`. **Arm effect** (deps `[reviewMode, appContext]`): compute `rid` = review id when `reviewMode` else null; `reviewArmRef.current = rid`; if null `setReviewProjectId(null)`; else `getOrCreateReviewProject('sigma', rid, fund)` then guard `reviewArmRef.current === rid` → `setReviewProjectId(p.id)`. **Re-arm effect** (deps `[reviewProjectId, messagesLen, chatProjectId]`): if `reviewProjectId && messages.length === 0 && chatProject?.id !== reviewProjectId` → `void startInProject(reviewProjectId)`. **recents**: `recentsList.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) && (reviewProjectId ? c.project_id === reviewProjectId : true))`. `startInProject`/`newChat`/`send`/`ingestAppContext` bodies unchanged. | VA-T1 (recents list) — MATCH | `getOrCreateReviewProject`; `ConversationSummary.project_id` | PROCEED |

No `any`. `getOrCreateReviewProject` returns the existing `Project` type (the extra `source_ref` field is ignored by `toProject`; no `Project`-type change). Only additive state + two effects + one filter clause.

## Component Structural Mirror Table (F-I2)

| Region (Theo FE) | Primary Reference | Classification |
|---|---|---|
| `getOrCreateReviewProject` gateway fn | deployed `createProject` gateway fn | ALLOWED DELTA (same fetch/`toProject` idiom; new route + `{app_key,source_ref,name}` body) |
| arm effect (resolve `reviewProjectId`, `reviewArmRef` guard) | deployed load-effect `live` guard + `SigmaApp.reviewCtxReq` | EXACT-INTENT (same request-key discipline for the reused-instance review switch) |
| re-arm effect (`startInProject(reviewProjectId)` for a fresh empty review chat) | deployed `startInProject` (used by ProjectDetail "Start a chat") | ALLOWED DELTA (invokes the deployed project-arm on the review's fresh chat) |
| recents scoping filter | deployed `recents` search filter | ALLOWED DELTA (one added predicate on the same list; content-scope, no UI change) |

## F-P6 — Repository & active-surface grounding

Target files (Read this turn): `src/theo/services/gateway.live.ts`, `src/theo/services/theoClient.ts`, `src/theo/useTheoState.ts`, `src/theo/types.ts`. Guardrails: additive only — the new gateway fn + client method; `reviewProjectId` state + two effects + the recents predicate; `startInProject`/`newChat`/`send`/`ingestAppContext`/the Sidebar/ChatView markup unchanged; no `any`; no backend change; the arm is stale-guarded and the re-arm is idempotent (no loop, never fires mid-conversation).

## F-P7 — Plan body (Pass-3, on APPROVAL)

1. **`gateway.live.ts`**: add `getOrCreateReviewProject(appKey, sourceRef, name)` mirroring `createProject` (POST the new route; `toProject`). **`theoClient.ts`**: expose `getOrCreateReviewProject(appKey, sourceRef, name)` delegating to the gateway.
2. **`useTheoState.ts`**: add `reviewProjectId` state + `reviewArmRef`; the arm effect (deps `[reviewMode, appContext]`) resolving `reviewProjectId` (stale-guarded); the re-arm effect (deps `[reviewProjectId, messages.length, chatProject?.id]`) → `startInProject(reviewProjectId)` for a fresh empty review chat; scope `recents` by `project_id` when `reviewProjectId` set.
3. **Verify**: `tsc` + `vite build` green; on the dev SWA, open a review → the dock's fresh chat is in the review's project (send a turn → it appears under that project); the ☰ drawer shows only this review's chats; "New chat" starts another chat in the same project; reopening the review restores its chats; switching review A→B mid-resolve never mis-scopes (arm guard); general Theo elsewhere is unchanged; no `any`.
4. **Pass-3 evidence** → dev-SWA test plan; Walter starts two chats in one review + reopens it.

## Mechanical lint

Command: `node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Frontend-Review-Project-Scoped-Chats-Pass-1-VEP/INDEX.md" --repo-root .`

Expect `PASS` and exit `0`.

## Requested action

Codex Pass-2 review against Frontend Conformance §6 + the Golden Component Pack. Plan-only; no code changed. On APPROVED, Claude Code executes Pass-3 per F-P7 on `development` (vault-theo). This completes #5 (the custom Theo review dock).
