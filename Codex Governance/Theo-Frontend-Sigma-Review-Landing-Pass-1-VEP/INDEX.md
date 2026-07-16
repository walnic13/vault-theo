# Theo Frontend — Sigma review-assistant landing + "Review assistant" label — Pass-1 Frontend Verified Evidence Pack

Plan-only VEP. Part 2 of the #5 custom-Theo-dock program (Sigma's "Theo · Review assistant"). When Theo is armed with a Sigma review context, the dock still shows the **generic** landing ("How can I help with your work today?" + generic starters) and the header chip reads the raw key `sigma`. This makes the review dock **review-aware**: (a) a review-focused landing — subtitle names the fund + review-scoped **action pills** (Walk me through the exceptions / Explain a control / Draft an attestation / Check the Sch L tie-out / Summarize for Jake) in place of the generic starters; (b) the app-context chip reads **"Review assistant · <fund>"**. Reuses the existing prop-driven landing seam (greeting/subtitle/starters already flow `TheoMain → ChatView`, and the subtitle already varies by `chatProject`) — no new surface, no backend, no system-prompt change (review turns already route to `sigma_review_agent_stream` with its server-side review ruleset). Reviewer: Codex (FE).

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

Current-turn grounding: Read `src/theo/useTheoState.ts` (`hasReviewContext(ctx)` lines 36–41 — `app_key==='sigma'` + uuid `sigma_review_id` + `files.input`/`files.output` pointers; `appContext` state line 74; the return object lines 714–729 incl. `greeting`/`appContext`); `src/theo/components/TheoMain.tsx` (`TheoMainProps` lines 25–32; `appLabel = appContextLabel(t.appContext)`; the `<ChatView … greeting={t.greeting} starters={STARTERS} reviewFund={…fund_name} />` mount); `src/theo/components/ChatView.tsx` (`ChatViewProps` lines 13–36; the landing block lines 180–188 — `messages.length===0` → `Burst` + `<h1>{greeting}</h1>` + subtitle `chatProject ? "Working in …" : "How can I help…"` + `starters.map` pills); `src/theo/lib/appContext.ts` (`APP_NAMES` lines 7–13 — no `sigma`; `appContextLabel` lines 15–25); `src/theo/data.ts` (`STARTERS` lines 24–26); `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4B (VA-T1 / VA-T3 / VA-T7) + `THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` §5–§7.

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
|-------------------|-----------|----------------------|----------------------|
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §7 | "reproduced faithfully, no redesign" | landing structure/styles unchanged; only context-driven copy + pills vary (F-P2) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "MUST be registered here before it may be cited." | VA-T1 / VA-T3 / VA-T7 — registered |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "app-context chip" | the "Review assistant · <fund>" chip IS the VA-T1 app-context chip, given a `sigma` label |

## F-P1 — Feature identification

Microstep: the Sigma dock (Codex-APPROVED, shipped) mounts the real `TheoSurface` with `app_context = { app_key:'sigma', sigma_review_id, files, fund_name }`. Today that context only (i) routes the send to `sigma_review_agent_stream` (`hasReviewContext`) and (ii) surfaces `fund_name` to `AgentActivity`; the **landing** and the **chip** are generic — the dock "just sits there" with a generic welcome (Walter 2026-07-16). This VEP makes the landing + chip review-aware. In scope: `src/theo/useTheoState.ts` (expose `reviewMode`), `src/theo/components/TheoMain.tsx` (pass review starters + `reviewMode`), `src/theo/components/ChatView.tsx` (`reviewMode` prop → review subtitle/opener + pills), `src/theo/lib/appContext.ts` (`sigma` → "Review assistant · <fund>"), `src/theo/data.ts` (`REVIEW_STARTERS`). Deferred (later #5 packages): project-scoped chats (each review = a Theo project); the dock symmetric resize (Sigma-FE, submitted separately); a streamed proactive opener (no seed seam today — the opener is landing copy here).

## F-P2 — UI Authority Reconciliation

- **VA-T1** (reference surface — landing / chat / **app-context chip**) — the **review landing**: **VISUAL-AUTHORITY-MATCH.** The landing markup (Burst + serif `<h1>` greeting + subtitle + wrapped pill row) is **unchanged**; review mode only supplies **context-driven content** through the *existing* prop seam — the subtitle (which already branches on `chatProject`) gains a review branch, and `starters` carry review pills instead of generic ones. This is the same context-variation VA-T1 already exhibits (the `chatProject` subtitle branch + the app-context chip), not a structural redesign.
- **VA-T1** — the **chip**: **VISUAL-AUTHORITY-MATCH.** "Review assistant · <fund>" is the existing app-context chip (same element/styles), now given a `sigma` display name + a fund anchor — exactly the chip's purpose.
- **VA-T3** (app-context layer, context-only/no-fetch): `reviewMode` is derived from the already-ingested `appContext` via the existing `hasReviewContext`; no fetch, no new context source.
- **VA-T7** (review activity): unchanged — review turns still stream to `sigma_review_agent_stream`; `reviewFund` still feeds `AgentActivity`.
- No new VA. Only VA-T1 / VA-T3 / VA-T7 (registered §4B) cited. No VISUAL-AUTHORITY-DEVIATION.

## F-P2.5 — Gap Disclosure

**PROCEED.** (1) The "proactive opener" is rendered as **landing copy** (a review subtitle/opener line naming the fund), not a streamed assistant message — there is no message-seed seam today (a real streamed opener is a later enhancement; disclosed). (2) The action pills call the existing `onSend(text)`, which routes to `sigma_review_agent_stream` because `hasReviewContext` holds — so they drive real review turns with no new wiring. (3) `reviewMode` is fail-closed: a Sigma dock with `app_context=null` (generic chat) is NOT review mode (same guard as the stream routing), so the generic landing is unchanged everywhere else. (4) The chip anchor uses `fund_name` when present, else "Review". Disclosed, PROCEED. No PRE-LAND/ESCALATE.

## F-P3 — Contract grounding

No backend call, no contract, no system-prompt change. `reviewMode = hasReviewContext(appContext)` is pure client state derived from the already-ingested `app_context` (VA-T3). Review turns' contract (`sigma_review_agent_stream`) is unchanged.

## F-P4 — Component reference grounding (Primary Reference)

**PRIMARY REFERENCE: the deployed `src/theo/components/{ChatView,TheoMain}.tsx` + `src/theo/lib/appContext.ts` + `src/theo/useTheoState.ts`** against VA-T1. Not GREENFIELD, not composite.

## F-P5 — Component Contract Table

| Component (ownership) | Prop / input interface (TypeScript — full literal) | Visual authority | Data / contract dependency | Impl eligibility |
|---|---|---|---|---|
| `ChatView` (`ChatView.tsx`; ACTIVE, modify) | `export interface ChatViewProps { messages: Message[]; loading: boolean; error: string; draft: string; attachments: ComposerAttachment[]; attachmentsAvailable: boolean; onDraftChange: (s: string) => void; onSend: (text?: string) => void; onStop: () => void; queuedText: string \| null; onCancelQueued: () => void; onAddFiles: (files: FileList \| File[]) => void; onAddPastedText: (text: string) => boolean; onRemoveAttachment: (localId: string) => void; chatProject: Project \| null; assistantName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode; reviewFund?: string; reviewMode?: boolean }` — only `reviewMode?: boolean` added. Landing (`messages.length===0`): when `reviewMode`, subtitle → review opener (`I've loaded ${reviewFund ?? 'this fund'}'s workpapers — pick where to start, or ask me anything about this review.`); pills come from `starters` (review set) unchanged in markup. | VA-T1 (landing) — MATCH | none | PROCEED |
| `TheoMain` (`TheoMain.tsx`; ACTIVE, modify) | `export interface TheoMainProps { t: ReturnType<typeof useTheoState>; mode: "full" \| "panel"; suppressNarrowHeader?: boolean }` — **props unchanged** (`t.reviewMode` arrives via the `ReturnType` inference). Change (JSX only): `starters={t.reviewMode ? REVIEW_STARTERS : STARTERS}` + `reviewMode={t.reviewMode}` passed to `ChatView`; `REVIEW_STARTERS` imported from `../data`. | VA-T1 | `useTheoState.reviewMode` | PROCEED |
| `appContextLabel` (`lib/appContext.ts`; ACTIVE, modify) | `export function appContextLabel(ctx: AppContext): string \| null` — signature unchanged. `APP_NAMES` gains `sigma: "Review assistant"`; anchor branch gains `else if ("sigma_review_id" in c) anchor = typeof c.fund_name === "string" ? String(c.fund_name) : "Review";` → chip "Review assistant · <fund>". | VA-T1 (app-context chip) | consumes `app_context.fund_name` | PROCEED |
| `useTheoState` return (`useTheoState.ts`; ACTIVE, modify) | Return object gains one field: `reviewMode: hasReviewContext(appContext)` (a `boolean`; `hasReviewContext` already defined lines 36–41). No signature/type-name change (return type is inferred). | n/a (state hook) | derives from `appContext` (VA-T3) | PROCEED |
| `REVIEW_STARTERS` (`data.ts`; ACTIVE, add) | `export const REVIEW_STARTERS: string[] = ["Walk me through the exceptions", "Explain a control", "Draft an attestation", "Check the Sch L tie-out", "Summarize for Jake"];` | n/a (static list; mirrors `STARTERS`) | none | PROCEED |

No `any`. Interfaces pasted full-literal; the only added members are `ChatViewProps.reviewMode?`, `useTheoState`'s `reviewMode` return field, `APP_NAMES.sigma`, and the `REVIEW_STARTERS` constant.

## Component Structural Mirror Table (F-I2)

| Region (Theo FE) | Primary Reference | Classification |
|---|---|---|
| `ChatView` landing subtitle — review branch | deployed landing subtitle (`chatProject ? … : …`, line 184) | VISUAL-AUTHORITY-MATCH (adds a third context branch to the existing context-driven subtitle; same element/styles) |
| `ChatView` landing pills (`starters.map`) | deployed pills (line 185–187) | EXACT (markup unchanged; `starters` content is review pills via the prop) |
| `TheoMain` → `ChatView` prop passing (`starters`/`reviewMode`) | deployed `TheoMain` ChatView mount | ALLOWED DELTA (prop-selection only; no structure change) |
| `appContextLabel` `sigma` name + fund anchor | deployed `appContextLabel` | ALLOWED DELTA (same fn/return; a new `APP_NAMES` entry + a `sigma_review_id` anchor branch, mirroring the `workpaper_id` branch) |
| `useTheoState` `reviewMode` return field | deployed return object | ALLOWED DELTA (additive derived boolean; `hasReviewContext` already exists) |
| `REVIEW_STARTERS` | deployed `STARTERS` | ALLOWED DELTA (sibling static list) |

## F-P6 — Repository & active-surface grounding

Target files (Read this turn): `src/theo/components/ChatView.tsx`, `src/theo/components/TheoMain.tsx`, `src/theo/lib/appContext.ts`, `src/theo/useTheoState.ts`, `src/theo/data.ts`. Guardrails: additive only — the landing markup + composer + message list are unchanged (only the subtitle gains a review branch + the pills come from the review `starters`); no system-prompt/`buildSystemPrompt` change; the review-stream routing + `AgentActivity` are untouched; no `any`; no backend, no new VA.

## F-P7 — Plan body (Pass-3, on APPROVAL)

1. **`data.ts`**: add `REVIEW_STARTERS` (the five action pills).
2. **`useTheoState.ts`**: add `reviewMode: hasReviewContext(appContext),` to the returned object (near `appContext`).
3. **`TheoMain.tsx`**: import `REVIEW_STARTERS`; on the `<ChatView>` mount pass `starters={t.reviewMode ? REVIEW_STARTERS : STARTERS}` and `reviewMode={t.reviewMode}`.
4. **`ChatView.tsx`**: add `reviewMode?: boolean` to `ChatViewProps`; in the landing, when `reviewMode` render the review opener subtitle (`I've loaded ${reviewFund ?? 'this fund'}'s workpapers — pick where to start, or ask me anything about this review.`) instead of the generic subtitle; the pill row is unchanged (renders the review `starters`).
5. **`lib/appContext.ts`**: `APP_NAMES.sigma = "Review assistant"`; add the `sigma_review_id` → `fund_name` anchor branch.
6. **Verify**: `tsc` + `vite build` green; on `vault-theo` dev (mounted in `vault-sigma-dev`) open a run review → the dock shows "Review assistant · <fund>" chip + the review opener + the five review pills; clicking a pill starts a review-agent turn (streams via `sigma_review_agent_stream`); a Sigma dock with no review armed (or general Theo elsewhere) shows the unchanged generic landing; no `any`.
7. **Pass-3 evidence** → dev-SWA test plan; Walter opens a review and sees the review-driven dock.

## Mechanical lint

Command: `node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Frontend-Sigma-Review-Landing-Pass-1-VEP/INDEX.md" --repo-root .`

Expect `PASS` and exit `0`.

## Requested action

Codex Pass-2 review against Frontend Conformance §6 + the Golden Component Pack. Plan-only; no code changed. On APPROVED, Claude Code executes Pass-3 per F-P7 on `development` (vault-theo). The project-scoped chats (each review = a Theo project) follow as their own package.
