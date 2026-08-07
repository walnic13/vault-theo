# Theo — Agent Mode (§6D(3) app-aware vs general, right-panel) — Pass 1 Frontend VEP (CODE-BEARING)

> Reviewer: **Codex** (Pass 2). THEO frontend regime; **code-bearing** — the three changed source files are committed WITH this VEP (currency below is base @ pre-feature parent → proposed @ review HEAD). **RE-ISSUE (Delta Grounding)** correcting the prior REJECT (the mode was recomputed from live context; it is now LATCHED at launch — see the Delta basis). Implements the Codex-**APPROVED** App Host **§6D(3) Agent mode** (vault-origin `docs/architecture/VAULT_ORIGIN_APP_HOST_CONTRACT.md`, dev blob `840a5a7b50592e660b35f2a6391991f2c87b9ab4`): the right-panel Theo carries an explicit, per-tab, launch-latched, switchable mode — **app-aware** vs **general**. Fixes the dev-SWA defect where launching Theo from Sigma resurfaced the last **personal** chat instead of the review assistant. Three files: `src/theo/useTheoState.ts` (latched `agentMode` + `effectiveAppContext` threading + cold-open-restore suppression), `src/theo/TheoSurface.tsx` (passes the launch context into the hook so the mode latches at mount), and `src/theo/components/TheoMain.tsx` (the mode chip; Codex PASS, unchanged). Standalone/general Theo is behaviourally unchanged (mode latches general with no launch context). vault-dottie mirrors this next; vault-origin conveys the launch default (already: context present ⇒ app-aware).

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Pass 1 — Codex-rejection correction / delta-evidence pack (code-bearing)
Grounding Mode: Delta Grounding
Pass: Pass 1
Sub-phase Track: N/A
Turn issued against HEAD: vault-theo development 915fb5d (pre-feature parent) → this commit (proposed)
```
Delta basis (THEO Conformance §4 — Pass 1 rejection-correction → Delta Grounding): prior artifact = this VEP + code @ vault-theo `4951f84`, Codex Pass-2 **REJECTED** on one narrow ground — the mode was **recomputed from live context** (`agentMode = userMode ?? (appContext.app_key ? …)`), so an already-open general tab could flip to app-aware when the shell later offered context, violating §6D(3) "The shell offering context does NOT by itself force app-aware mode; the agent owns the mode." Correction (affected sections revised this turn): the mode is now **LATCHED AT LAUNCH** — `useTheoState(launchAppContext)` initialises `agentMode` once from the launch context and changes it ONLY via the user's mode chip; `TheoSurface` passes the launch context in; the ingest effect still threads live context DATA but never re-derives the mode. The chip (TheoMain, Codex PASS) is unchanged. (Frontend sub-phase track = F-P1–F-P7 per THEO Conformance §4A.1; the lint's P/I/E track = `N/A`. Code-bearing currency: each changed file base @ pre-feature parent `915fb5d` → proposed @ this commit.)

| # | Document / file (absolute path) | Read tool invocation this turn | Currency anchor |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | AUTHORITY (cross-repo) — App Host §6D(3) — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-origin/docs/architecture/VAULT_ORIGIN_APP_HOST_CONTRACT.md` (the agent-mode contract this VEP implements) | `Read(§6D)` this turn | blob `840a5a7b50592e660b35f2a6391991f2c87b9ab4` @ vault-origin dev |
| 2 | Claude Code THEO FE Governor — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 — accept `{app_key, app_context}` from Origin; single service module) | `Grep(§6)` this turn | blob `3afec7ea4b13650ce2bf28bf32073179a35e7b24` |
| 3 | THEO FE Grounding Conformance — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4A.1 sub-phases; §4B VA-T1 app-context chip) | `Read(§4B)` this turn | blob `4f2f42e799be5db31e1e35e523d656ff4c1c057e` |
| 4 | THEO Golden Component Pack — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§6 mirror; §7 reproduce faithfully) | `Grep(§6/§7)` this turn | blob `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Codex THEO FE Review — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (Pass-2 reviewer) | grounded; unchanged @ HEAD | blob `25cc488091d619d8f6642b10552df0d019a87933` |
| 6 | CODE — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/useTheoState.ts` (mode LATCHED at launch via `launchAppContext` param + `effectiveAppContext` + restore suppression + exposed switcher) | `Read`/`Edit` this turn | base `6190aa83256e242a416420b22470d9750798ac1e` @ `915fb5d` → proposed `f696fceec662626ba2336487ae420c341350f081` |
| 7 | CODE — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/components/TheoMain.tsx` (the §6D(3) mode chip — Codex PASS, unchanged) | `Read`/`Edit` this turn | base `64862381f69a25d66a60471a73be4a1bc06a996f` @ `915fb5d` → proposed `e10d39c7c9ffe16d0ebfa804d10685fd175ada2f` |
| 8 | CODE — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/TheoSurface.tsx` (passes the LAUNCH context into `useTheoState` so the mode latches at mount) | `Read`/`Edit` this turn | base `e620f74f173ed3e70ed41f12976c7c394a0a9b36` @ `915fb5d` → proposed `516b1f102364aa63a48b12ae9dfb556aac4009a3` |

Currency note: full 40-char blob SHAs captured this turn. Code-bearing: rows 6/7 give base @ parent `915fb5d` → proposed @ this commit; the authority + governance rows give the blob @ their HEAD.

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text (read this turn) | Applied in output at |
|-------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-origin/docs/architecture/VAULT_ORIGIN_APP_HOST_CONTRACT.md | §6D(3) | "The shell offering context does NOT by itself force app-aware mode; the agent owns the mode" | agentMode LATCHED at launch (init from launchAppContext), changed only by the user chip — never re-derived from live appContext (resolves the REJECT) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-origin/docs/architecture/VAULT_ORIGIN_APP_HOST_CONTRACT.md | §6D(3) | "MUST NOT restore an unrelated prior or general conversation on that launch" | useTheoState restore-gate suppression (F-I2 region 3) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-origin/docs/architecture/VAULT_ORIGIN_APP_HOST_CONTRACT.md | §6D(3) | "behaves exactly as a context-free launch (`app_key` treated as null)" | `effectiveAppContext` = EMPTY_APP_CONTEXT in general mode (F-I2 region 2) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-origin/docs/architecture/VAULT_ORIGIN_APP_HOST_CONTRACT.md | §6D(3) | "lets the user switch to **general**" | TheoMain mode chip + `setAgentMode` (F-I2 region 4/5) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "Accept `{ app_key, app_context }` from Origin" | the appContext the mode governs (unchanged inbound contract) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B VA-T1 | "app-context chip" | the mode chip is the §4B VA-T1 app-context chip made switchable |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §7 | "reproduced faithfully, no redesign" | the chip reuses the VA-T1 pill idiom; ChatView greeting/starters unchanged |

## F-P1 — Feature identification
Microstep: **Theo Agent Mode** — the vault-theo implementation of App Host **§6D(3)**. The right-panel Theo carries an explicit **app-aware vs general** mode (default app-aware when Origin publishes an app context; general otherwise), switchable via an in-header chip. In app-aware mode Theo operates as the app's assistant (Sigma review persona + per-review project + review agent) and does NOT restore an unrelated personal chat on launch; in general mode it ignores the published context entirely (a regular personal Theo). Authority: App Host §6D(3) (driving, cross-repo) + VA-T1 (the app-context chip surface). Out of scope: any backend/`theo_*` change (none); the vault-dottie mirror + the vault-origin launch-default (separate packages).

## F-P2 — UI Authority Reconciliation
- **VA-T1** (Theo reference surface — registers the "app-context chip"): **VISUAL-AUTHORITY-MATCH**. The chip already exists (static app-context label); this makes it a **switchable** mode control (app-aware coral pill ⇄ general neutral pill) in the same header pill idiom — no redesign. Reproduce faithfully (§7).
- **App Host §6D(3)** (driving authority): the contract's three tenets — contextual default, MUST-NOT-restore on app-aware launch, switchable-to-general (`app_key` null) — are implemented verbatim (Rule Anchors).
- No VISUAL-AUTHORITY-DEVIATION. No VA-id outside THEO §4B cited as authority (§6D(3) is cited as the cross-repo driving contract, by prose + path, not as a VA-id).

## F-P2.5 — Gap Disclosure
**PROCEED.** (1) **Switching mode starts a fresh chat** (`setAgentMode` calls `newChat`) so the new mode lands cleanly (app-aware re-arms the review chat; general shows a fresh general chat) rather than leaving the prior mode's thread open under the new mode — a deliberate, disclosed UX choice consistent with §6D(3) "app-aware … the scoped/per-target thread" and "general … a context-free launch". (2) **Launch-latched (resolves the prior REJECT)**: `agentMode` is latched ONCE at mount from the launch context (`launchAppContext`, passed synchronously by `TheoSurface`) and changed ONLY by the user chip — a later host context update never flips it (§6D(3) "context availability ≠ mode"). Because the launch context is read synchronously in the `useState` initialiser, there is no ingest-timing race with the cold-open restore gate. `appContextAvailable` stays LIVE, so if the shell offers context to an already-open general tab the chip appears (offering the switch) without forcing app-aware. (3) **No backend/contract/dependency change.** No PRE-LAND/ESCALATE.

## F-P3 — Contract grounding
- Inbound: the shell's `appContext` (`{ app_key, app_context }`, THEO Governor §6) — unchanged; the mode layer sits between it and the review logic.
- The review agent (`sigma_review_agent_stream`) + per-review project (`getOrCreateReviewProject`) are DEPLOYED and unchanged; they now key off `effectiveAppContext` (general mode → they simply don't engage). No new `theo_*` call; single service module (`theoClient`) preserved.
- No backend / schema / dependency change.

## F-P4 — Component reference grounding (Primary Reference)
**PRIMARY REFERENCE: VA-T1** (`frontend/theo-frontend-reference.jsx`, sha256-verified in §4B) — the definitive Theo surface incl. the app-context chip. The mode chip is that chip, made switchable, in the VA-T1 header pill idiom (inline-style, no Tailwind, no browser storage). `useTheoState` is the ACTIVE state hook (its own structural reference); the change is additive derived-state + one suppression branch + exposed setters. Not GREENFIELD; not composite.

## F-P5 — Component Contract Table

| Component (ownership) | Prop / state interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
|---|---|---|---|---|
| `useTheoState(launchAppContext?: AppContext)` (ACTIVE hook; the state contract) | takes the LAUNCH context as an arg; inits `appContext` from it (`launchAppContext ?? theoClient.getAppContext()`); **LATCHES** `agentMode: "app-aware" \| "general"` ONCE in the `useState` initialiser from the launch context (`… .app_key ? "app-aware" : "general"`) — never recomputed from live `appContext`, so a later host context update cannot flip the mode (§6D(3)); memoised `effectiveAppContext: AppContext = agentMode === "general" ? EMPTY_APP_CONTEXT : appContext`; exposes `agentMode`, `appContextAvailable: boolean` (live — the chip appears when context is offered), `setAgentMode: (m) => void` (raw latched-state setter + `newChat`; the ONLY thing that changes the mode); swaps the review consumers (`currentRid`, `hasReviewContext`, `buildSystemPrompt` app_key, the stream request `app_key`/`app_context`, `reviewMode`, `sigmaMode`) from `appContext` → `effectiveAppContext`; adds a restore-gate branch: app-aware launch (`effectiveAppContext.app_key`) drops the gate WITHOUT restoring the last personal chat | VA-T1 (state behind the surface) | inbound `appContext` (Governor §6); no new backend | PROCEED |
| `TheoSurface` (ACTIVE; wires the launch context) | calls `useTheoState(appContext)` — passing the LAUNCH app-context prop synchronously so the mode latches at mount (no ingest-timing race); the existing mount `ingestAppContext(appContext)` effect still threads live context DATA updates (chip label, an in-app-aware review change) but never re-derives the mode | VA-T1 | the `appContext` prop (Governor §6) | PROCEED |
| `TheoMain` header (ACTIVE; the mode chip) | replaces the static `appLabel` chip with: when `t.appContextAvailable`, a `<button>` pill showing `t.agentMode === "app-aware" ? (appLabel ?? "App assistant") : "General"` + a `⇄`, `onClick={() => t.setAgentMode(t.agentMode === "app-aware" ? "general" : "app-aware")}`; app-aware = coralTint pill, general = neutral (`C.line`) pill; hidden when no app context (unchanged plain Theo) | VA-T1 — "app-context chip" | `t.agentMode`, `t.appContextAvailable`, `t.setAgentMode`, `appContextLabel(t.appContext)` | PROCEED |

## Component Structural Mirror Table (F-I2)
| Region (Theo) | Primary Reference | Classification |
|---|---|---|
| latched `agentMode` state (init from `launchAppContext`) + memoised `effectiveAppContext` (region 1–2) | `useTheoState` existing `appContext` state | ALLOWED DELTA (additive latched state; general substitutes EMPTY_APP_CONTEXT) |
| `TheoSurface` → `useTheoState(appContext)` (launch-context pass) | existing `useTheoState()` call | ALLOWED DELTA (additive optional arg; wires the launch latch) |
| restore-gate suppression on app-aware launch (region 3) | `useTheoState` cold-open restore gate | ALLOWED DELTA (one added early-return; §6D(3) "MUST NOT restore an unrelated…") |
| review consumers → `effectiveAppContext` (region 3, send) | existing `appContext` consumers | EXACT (same logic; source swapped to the mode-gated context) |
| `setAgentMode` + exposed `agentMode`/`appContextAvailable` (region 4) | existing exposed setters | ALLOWED DELTA (additive) |
| the mode chip (region 5) | VA-T1 app-context chip | ALLOWED DELTA (static label → switchable pill; same idiom, no redesign) |

## F-P6 — Repository & active-surface grounding
Target files (Read + Edited this turn, ACTIVE): `src/theo/useTheoState.ts`, `src/theo/components/TheoMain.tsx`, `src/theo/TheoSurface.tsx` (the launch-context pass). Guardrails: single service module (`theoClient`) unchanged; inline-style, no Tailwind, no browser storage (VA-T1 idiom); no `theo_*`/schema/dependency change; general/standalone Theo behaviourally unchanged (mode defaults general with no app context). Verified this turn: `tsc --noEmit -p tsconfig.app.json` exit 0; `npm run build` green (emits `__federation_expose_TheoSurface`). Untracked working-tree items (`.tmp/`, `artifacts/*.xlsx`) are NOT part of this change and are excluded from the commit.

## F-P7 — Plan / impl body
Code committed with this VEP (three files above). On APPROVED → deploy vault-theo dev SWA; then the vault-dottie mirror; SWA test: launch Theo from Sigma (worklist ⇒ Sigma-assistant greeting, no personal chat; open review ⇒ review-scoped) → chip shows "Reviewing: <fund>"/"App assistant"; click → "General" (regular Theo); click back → app-aware; launch Theo from the rail with no app ⇒ general (unchanged).

## Mechanical lint
Command: `node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Agent-Mode-Pass-1-VEP/Theo_Agent_Mode_Pass_1_VEP.md" --repo-root .` — expect `PASS`, exit `0`.

## Requested action
Codex Pass-2 review against THEO Frontend Conformance §6 + Golden Component Pack. **RE-ISSUE (Delta Grounding)** correcting the prior REJECT (mode recomputed from live context → could flip an open general tab). Code-bearing (THREE files committed with this VEP; base @ pre-feature `915fb5d` → proposed @ this commit). Confirm the REJECT is resolved: (1) **`agentMode` is LATCHED at launch** — `useTheoState(launchAppContext)` inits it once in the `useState` initialiser and changes it ONLY via the user chip (`setAgentMode`); it is NEVER re-derived from live `appContext`, so the shell offering context to an already-open tab cannot flip the mode (§6D(3) "context availability ≠ mode"); `TheoSurface` passes the launch context synchronously (no ingest-timing race). (2) §6D(3) otherwise verbatim — contextual default AT LAUNCH, app-aware MUST-NOT-restore, switchable-to-general (`app_key` null via `effectiveAppContext`). (3) review consumers correctly gated through `effectiveAppContext` (general fully ignores the context). (4) the mode chip is the VA-T1 app-context chip made switchable (no redesign; unchanged from the PASS'd prior turn). (5) no `theo_*`/schema/dependency change; general/standalone Theo unchanged; tsc clean; vite build green. On APPROVED, Claude Code deploys dev + hands the SWA test plan. Emit APPROVED or REJECTED only.

*End of Theo Agent Mode Pass-1 Frontend VEP (code-bearing).*
