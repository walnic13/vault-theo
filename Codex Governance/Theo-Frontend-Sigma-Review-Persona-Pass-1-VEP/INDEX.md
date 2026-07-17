# Theo Frontend — Sigma app-level review persona (Theo reasons as the K-1 review assistant across Sigma) — Pass-1 Frontend Verified Evidence Pack

Plan-only VEP. #5 follow-on (Walter 2026-07-16): opening Theo in Sigma with no review selected should NOT show generic Theo — it should be a **Sigma review assistant from the start**, a tier *above* any single review's project. Two additions: (a) a **Sigma review persona** injected into the FE-composed system prompt whenever `app_key==='sigma'`, so app-level Sigma chat actually reasons like a K-1 review specialist (knows the 4-workbook set, the Axiom→run→attest→submit→sign-off workflow, the output-Sch-L-ties-to-TB assurance, and the deterministic-tools/never-fabricate discipline); (b) a **`sigmaMode` app-level landing** (review-assistant identity + orienting opener + guidance pills) distinct from both the review-specific landing (5.2) and generic Theo. Chat at the app level routes to general Theo (`theo_message_stream`) — the review *agent* still engages only when a specific fund is armed; the server-side Operating Ruleset is untouched (still prepended by the backend). Reviewer: Codex (FE).

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: 223f6dce99ac0229d4a3a0bfeb09f5136848cfb0 (vault-theo development; the commit that first adds this VEP — artifact-presence probe resolves there and at every later commit)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
```

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend §4A track, hence `N/A`.)

Current-turn grounding: Read `src/theo/lib/prompt.ts` (`buildSystemPrompt(styleKey, custom, project, userName?)` lines 8–24 — composes `BASE_PROMPT` + style mod + `ARTIFACT_RULES` + name + custom + project; **no app branch**); `src/theo/useTheoState.ts` (`hasReviewContext` 36–41; `appContext` state; the general-chat request `system: buildSystemPrompt(styleKey, custom, chatProject, selfFullName)` line 439, sent only on the `!useReviewAgent` path — the review agent [`hasReviewContext`, line ~424] does NOT use it; return object incl. `reviewMode`); `src/theo/components/TheoMain.tsx` (the `<ChatView … starters={t.reviewMode ? REVIEW_STARTERS : STARTERS} reviewMode={t.reviewMode} />` mount); `src/theo/components/ChatView.tsx` (landing block — `reviewMode`/`chatProject` subtitle branches + `starters.map` pills); `src/theo/data.ts` (`STARTERS`, `REVIEW_STARTERS`); `src/theo/lib/appContext.ts` (`APP_NAMES.sigma = "Review assistant"`, added in 5.2); `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4B (VA-T1 / VA-T3) + `THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` §7. Confirmed the server-side Operating Ruleset is prepended by the chat handler (not `buildSystemPrompt`) — this VEP does not touch it.

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
|-------------------|-----------|----------------------|----------------------|
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §7 | "reproduced faithfully, no redesign" | landing structure unchanged; context-driven copy/pills + a non-visual system-prompt addition (F-P2) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "MUST be registered here before it may be cited." | VA-T1 (landing/chat) + VA-T3 (app-context) — registered |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "app-context chip" | the `sigma` app-context (already chipped "Review assistant", 5.2) now also drives the persona + app-level landing |

## F-P1 — Feature identification

Microstep: in Sigma, `app_key='sigma'` is set even with no review armed (`app_context` null), but today that state falls through to **generic Theo** (5.2's `reviewMode` requires a specific review). Walter: it should be a **Sigma review assistant** app-wide, reasoning like a review specialist, above any single review's project. In scope: `src/theo/lib/prompt.ts` (`SIGMA_REVIEW_PERSONA` + an `appKey` branch in `buildSystemPrompt`); `src/theo/data.ts` (`REVIEW_APP_STARTERS`); `src/theo/useTheoState.ts` (`sigmaMode` derived + return + pass `app_key` to `buildSystemPrompt`); `src/theo/components/TheoMain.tsx` (3-way starters + `sigmaMode` prop); `src/theo/components/ChatView.tsx` (`sigmaMode` app-level landing opener). Deferred: app-level TOOLS (read the worklist / "what's pending for Jake") — needs Sigma-side capabilities; hardening the persona server-side (it is FE-composed guidance here, like project instructions).

## F-P2 — UI Authority Reconciliation

- **VA-T1** (landing / chat): **VISUAL-AUTHORITY-MATCH.** The landing markup is unchanged; `sigmaMode` supplies context-driven copy (opener) + pills through the existing prop seam — the same context-variation VA-T1 already exhibits (the `chatProject` subtitle branch, the app-context chip, and 5.2's review branch). No new surface.
- **VA-T3** (app-context, context-only/no-fetch): both the persona keying and the landing are derived from the already-ingested `app_context.app_key`; no fetch, no new context source.
- **System prompt (non-visual):** `SIGMA_REVIEW_PERSONA` is FE-composed behavioral guidance prepended by `buildSystemPrompt` when `app_key==='sigma'` — the same mechanism that already injects style mods, standing/custom guidance, and project instructions. It is NOT the server-side Operating Ruleset (grounding/anti-hallucination), which the chat handler still prepends unchanged and which this VEP does not touch. No VISUAL-AUTHORITY-DEVIATION.
- No new VA. Only VA-T1 / VA-T3 (registered §4B) cited.

## F-P2.5 — Gap Disclosure

**PROCEED.** (1) `sigmaMode = appContext.app_key === "sigma"` is the broad app tier; `reviewMode = hasReviewContext(appContext)` (a specific review) stays the strict tier. Landing precedence: `reviewMode` (5.2 review landing) → else `sigmaMode` (this app-level landing) → else generic. Starters likewise 3-way. (2) The persona reaches the model only on **general-chat turns** (`theo_message_stream`, `system: buildSystemPrompt(...)`, line 439). Review-armed turns route to `sigma_review_agent_stream`, which uses its own **server-side** review ruleset and does NOT send `buildSystemPrompt`'s output — so the FE persona and the agent ruleset never collide (the persona governs app-level chat; the agent ruleset governs a running review). (3) The persona is **always-on in Sigma** (keyed on `app_key`, not a user setting) but **inert everywhere else** (`app_key!=='sigma'` → not prepended) — general Theo + other apps unchanged, fail-closed. (4) Persona content is grounded in the real Sigma review system (4-workbook set, Axiom→run→attest→submit→sign-off, output-Sch-L-ties-to-TB, deterministic-tools/never-fabricate); it is behavioral framing, not a security control, so it lives as an FE constant (like project instructions), not the governance-doc'd server-side ruleset. Disclosed, PROCEED. No PRE-LAND/ESCALATE.

## F-P3 — Contract grounding

No backend call, no contract change. `SIGMA_REVIEW_PERSONA` is prepended into the existing `GatewayRequest.system` string (composed by `buildSystemPrompt`, sent on the deployed `theo_message_stream` path). The server-side Operating Ruleset the handler prepends is unchanged.

## F-P4 — Component reference grounding (Primary Reference)

**PRIMARY REFERENCE: the deployed `src/theo/lib/prompt.ts` (`buildSystemPrompt`) + `src/theo/components/{ChatView,TheoMain}.tsx` + `src/theo/useTheoState.ts`** against VA-T1. Not GREENFIELD, not composite.

## F-P5 — Component Contract Table

| Component (ownership) | Prop / input interface (TypeScript — full literal) | Visual authority | Data / contract dependency | Impl eligibility |
|---|---|---|---|---|
| `buildSystemPrompt` (`prompt.ts`; ACTIVE, modify) | `export function buildSystemPrompt(styleKey: StyleKey, custom: string, project: Project \| null, userName?: string, appKey?: string \| null): string` — only `appKey?: string \| null` added. When `appKey === "sigma"`, prepend `SIGMA_REVIEW_PERSONA + "\n\n"` to the composed prompt (before `BASE_PROMPT`); all existing composition (style/name/custom/project) unchanged. | n/a (prompt seam; non-visual) | consumed on the `theo_message_stream` request `system` | PROCEED |
| `SIGMA_REVIEW_PERSONA` (`prompt.ts`; ACTIVE, add) | `export const SIGMA_REVIEW_PERSONA: string` — the app-level review-assistant persona (grounded in the Sigma review system; full text in F-P7). | n/a (constant) | none | PROCEED |
| `REVIEW_APP_STARTERS` (`data.ts`; ACTIVE, add) | `export const REVIEW_APP_STARTERS: string[] = ["How does a K-1 review work?", "What do the controls check?", "Walk me through kickoff → review → sign-off", "What should I look at first?"]` | n/a (static list) | none | PROCEED |
| `useTheoState` (`useTheoState.ts`; ACTIVE, modify) | Return gains `sigmaMode: appContext.app_key === "sigma"` (boolean). Call site line 439 → `system: buildSystemPrompt(styleKey, custom, chatProject, selfFullName, appContext.app_key)`. No other change. | n/a (state hook) | `appContext.app_key` | PROCEED |
| `TheoMain` (`TheoMain.tsx`; ACTIVE, modify) | `TheoMainProps` unchanged (`t.sigmaMode` via the `ReturnType` inference). JSX: `starters={t.reviewMode ? REVIEW_STARTERS : (t.sigmaMode ? REVIEW_APP_STARTERS : STARTERS)}` + `sigmaMode={t.sigmaMode}` passed to `ChatView`; import `REVIEW_APP_STARTERS`. | VA-T1 | `useTheoState.sigmaMode` | PROCEED |
| `ChatView` (`ChatView.tsx`; ACTIVE, modify) | `ChatViewProps` gains `sigmaMode?: boolean` (full literal in 5.2's CCT + this field). Landing subtitle precedence: `reviewMode` → review opener (5.2) ; else `sigmaMode` → `"I'm your K-1 review assistant. Open a fund from the worklist to start a review — I'll walk you through the exceptions, explain the controls, and help you sign off. Or ask me how reviews work."` ; else the generic/`chatProject` subtitle. Pills unchanged (render `starters`). | VA-T1 (landing) — MATCH | none | PROCEED |

No `any`. Additive only: one optional `appKey` param, one persona constant, one starters constant, one derived boolean, one `ChatViewProps` field, and the 3-way starters/opener selection.

## Component Structural Mirror Table (F-I2)

| Region (Theo FE) | Primary Reference | Classification |
|---|---|---|
| `buildSystemPrompt` `appKey` branch (prepend `SIGMA_REVIEW_PERSONA`) | deployed `buildSystemPrompt` (style/custom/project composition) | ALLOWED DELTA (same compose-into-`system` mechanism as style/project; a new app-keyed block; server-side ruleset untouched) |
| `ChatView` `sigmaMode` landing subtitle | deployed landing subtitle (`reviewMode`/`chatProject` branches) | VISUAL-AUTHORITY-MATCH (adds a branch to the existing context-driven subtitle) |
| `TheoMain` 3-way starters + `sigmaMode` prop | deployed `TheoMain` ChatView mount | ALLOWED DELTA (prop selection only) |
| `useTheoState` `sigmaMode` + `appKey` passthrough | deployed return + call site | ALLOWED DELTA (additive derived boolean + one arg) |
| `REVIEW_APP_STARTERS` / `SIGMA_REVIEW_PERSONA` | deployed `STARTERS` / `buildSystemPrompt` blocks | ALLOWED DELTA (sibling constants) |

## F-P6 — Repository & active-surface grounding

Target files (Read this turn): `src/theo/lib/prompt.ts`, `src/theo/data.ts`, `src/theo/useTheoState.ts`, `src/theo/components/TheoMain.tsx`, `src/theo/components/ChatView.tsx`. Guardrails: additive — the persona prepends only when `app_key==='sigma'`; the landing gains a `sigmaMode` branch; starters 3-way; the server-side Operating Ruleset, the review-agent path, the composer/message list, and generic-Theo behavior are untouched; no `any`; no backend change.

## F-P7 — Plan body (Pass-3, on APPROVAL)

1. **`prompt.ts`**: add `export const SIGMA_REVIEW_PERSONA` =
> "You are Theo, operating as the Vault Sigma K-1 review assistant. Sigma reviews partnership (Form 1065) Schedule K-1 tax workpapers — one fund per period, built from a four-workbook set: (1) Input Sheets (trial balance + supporting schedules), (2) Output (Schedule K-1s, Schedule K, M-1, and the Balance Sheet / Schedule L — the client deliverable), (3) Tables (lookup/rate tables), and (4) Data Connection (the GoSystems import synthesis). The workflow: an Axiom kickoff (prior-year issues, PFIC, carried interest, special allocations) is signed off to start; Sigma runs a catalog of deterministic controls; the preparer clears each exception (explains it, and you re-verify with the tools before it is resolved); the review is submitted to the reviewer (Jake); the reviewer signs off; the review is then ready for the client. The core assurance is that the output Schedule L ties to the input trial balance — every output line pulls from the TB, so the totals reconcile by construction; a break means an override, a broken link, or a hardcode. Deterministic tools do ALL arithmetic and cite the exact cells; you orchestrate, judge, and explain — you never compute figures yourself and never fabricate a number, cell, or control result. When a specific fund's review is open you drive it with those tools and give cell-cited verdicts. Here, at the app level with no fund open yet, orient the reviewer: explain what the controls check, walk through the workflow, advise what to look at first, and point them to open a fund from the worklist to begin. Be rigorous, specific, and concise; if unsure, say so rather than guess."
   ; and in `buildSystemPrompt`, add the optional `appKey` param + `if (appKey === "sigma") p = SIGMA_REVIEW_PERSONA + "\n\n" + p;` (before the userName/custom/project additions).
2. **`data.ts`**: add `REVIEW_APP_STARTERS` (the four guidance pills).
3. **`useTheoState.ts`**: add `sigmaMode: appContext.app_key === "sigma"` to the return; pass `appContext.app_key` as the 5th arg at the line-439 `buildSystemPrompt` call.
4. **`TheoMain.tsx`**: import `REVIEW_APP_STARTERS`; `starters={t.reviewMode ? REVIEW_STARTERS : (t.sigmaMode ? REVIEW_APP_STARTERS : STARTERS)}`; pass `sigmaMode={t.sigmaMode}`.
5. **`ChatView.tsx`**: add `sigmaMode?: boolean`; landing subtitle precedence `reviewMode → sigmaMode → generic`.
6. **Verify**: `tsc` + `vite build` green; on the dev SWA, open Sigma without a review → the dock shows the Sigma review-assistant opener + guidance pills (not generic Theo), and asking "what do the controls check?" gets a review-specialist answer (persona active); open a fund → the review-specific landing (5.2) + the review agent drive it; open general Theo elsewhere → unchanged generic Theo; no `any`.
7. **Pass-3 evidence** → dev-SWA test plan; Walter opens Sigma (no review) and converses with the app-level review assistant.

## Mechanical lint

Command: `node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Frontend-Sigma-Review-Persona-Pass-1-VEP/INDEX.md" --repo-root .`

Expect `PASS` and exit `0`.

## Requested action

Codex Pass-2 review against Frontend Conformance §6 + the Golden Component Pack. Plan-only; no code changed. On APPROVED, Claude Code executes Pass-3 per F-P7 on `development` (vault-theo).
