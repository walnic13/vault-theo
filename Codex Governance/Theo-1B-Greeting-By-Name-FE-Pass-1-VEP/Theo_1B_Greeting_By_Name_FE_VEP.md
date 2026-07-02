# Theo 1B — Greeting By Name (home greeting + "Theo knows who it's with") — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) and Walter redeploys the Theo SWA. **Microstep:** personalize Theo to the signed-in Vault user (Walter-directed). Two parts, both sourced from the deployed `theo_list_people` (§2.9) roster's `isSelf` row `displayName` — no new backend: (1) the **home landing greets by first name** ("Good evening, Walter"), filling the greeting's pre-existing `USER_NAME` slot; (2) the **system prompt tells Theo who it is working with** (`You are speaking with <full name>.`) so Theo can address the user and knows the identity. Behind `theoClient`; loaded best-effort on mount.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `778ecde` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack. The **home greeting** fills the greeting function's pre-existing `USER_NAME` slot (`greeting()` already rendered `${part}, ${USER_NAME}` when set — VA-T1 L84–107 port), so the home `<h1>` is unchanged in structure; this is a **reconciled** use of the existing VA-T1 greeting surface, not a new element. The **system-prompt personalization** (`You are speaking with <name>.`) is a behavioral/context addition (not a visual surface) — Walter-directed ("I'd like it to know that I'm Walter"). Both draw the name from the deployed, golden-verified `theo_list_people` (§2.9) `isSelf` row (`displayName`); no new backend, no new endpoint, no contract change. VA-T1 read this turn (`frontend/theo-frontend-reference.jsx` greeting region). The three proposed files were applied to `src` this turn and pass `npm run typecheck` (exit 0) + `eslint` (exit 0) + `npm run build` (TheoSurface 247.59 KB / 72.75 KB gzip); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§UI Authority Reconciliation; §exemption authority) | `git grep -F "A planned visual deviation must be cited and classified" / "Walter is the execution, runtime-acceptance, and exemption authority"` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B; §6) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 deltas) | `git grep -F "three locked surfaces" / "service-module/gateway abstraction"` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (home landing / greeting) | cited (surface authority) | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 5 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.9 People / roster — supplies isSelf displayName) | `git grep -F "theo_list_people"` this turn | `0441bc726b3b7bb2cfb52483371d0dff6f24c0bd` |
| 6 | ACTIVE (modify) — `src/theo/lib/prompt.ts` (`greeting(name?)` + `buildSystemPrompt(…, userName?)`) | `Read(full)` this turn | `ae479205930dee6d0c070db296f096f8d165870b` |
| 7 | ACTIVE (modify — state owner) — `src/theo/useTheoState.ts` (derive `selfName`/`selfFullName` from `people`; feed greeting + prompt; expose `loadPeople`) | `Read(full)` this turn | `1e65bc5a35a53f2ce76345ba8475f152deeae6f0` |
| 8 | ACTIVE (modify) — `src/theo/TheoSurface.tsx` (`loadPeople` on mount) | `Read(full)` this turn | `3a4dc36cefde97d156fff0e70507408e23b0f745` |
| 9 | Reference (unchanged) — `src/theo/swapBlock.ts` (`USER_NAME` fallback = "") | `Read` this turn | `8133574363a644916b0b02752276dee662712aab` |
| 10 | Reference (unchanged) — `src/theo/components/ChatView.tsx` (renders `greeting` in the home `<h1>`) | `Read` this turn | `c0b821d815743dd4603c138d5c32c733bc25354d` |
| 11 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (greeting region) | `Grep("greeting\|Good ")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §UI-Auth | "A planned visual deviation must be cited and classified" | §F-P2 — greeting fills the existing VA-T1 slot (reconciled); prompt-name is behavioral, Walter-directed |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §authority | "Walter is the execution, runtime-acceptance, and exemption authority" | §F-P2 — Walter directed the personalization |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P2 — name comes via `theoClient.listPeople()` (existing boundary) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT rows carry full interface + VA-id + contract dependency |

---

## F-P1 — Feature identification
**Microstep:** personalize Theo to the signed-in user (Walter-directed). (1) The home landing `<h1>` greeting becomes "Good <part>, <FirstName>" using the signed-in user's name; (2) the system prompt gains `You are speaking with <Full Name>.` so Theo knows/addresses the user. Both names come from the deployed `theo_list_people` (§2.9) `isSelf` row `displayName` — the same roster the People panel + invite picker use. No backend change.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (home landing greeting) | The home `<h1>` already renders a `greeting` string; `greeting()` already supported a `USER_NAME` slot ("${part}, ${USER_NAME}"). This fills that slot with the signed-in user's first name — the **Claude-parity** "Good evening, <name>" the reference surface intends. No new element; structure unchanged. | **RECONCILED** with VA-T1 (existing greeting slot; Walter-directed) |
| System prompt (behavioral) | `buildSystemPrompt` gains an optional `userName` → appends `You are speaking with <name>.`. Not a visual surface — a context/personalization addition so Theo knows the user. | Behavioral delta (Walter-directed; no VA surface) |
| Gateway / service abstraction (Golden §5) | The name is read via the existing `theoClient.listPeople()` (§2.9), derived in `useTheoState` from the `isSelf` row. | ALLOWED DELTA (existing boundary) |

No un-cited visual deviation. No browser→model call beyond the existing gateway. `ProjectsView`, `ProjectDetail`, `Sidebar`, `RowManage` unchanged.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Async name** — the roster loads on mount (best-effort); until it resolves, `selfName` is "" and the greeting falls back to the bare time-of-day ("Good evening"), then updates to include the name on resolve. No flash of a *wrong* name. | **PROCEED** — graceful progressive fill, same pattern as Recents/Projects mount loads. |
| **G-2** | **Harness** roster is empty (`listPeople` mock → []), so `selfName` stays "" and the greeting is the bare time-of-day in the standalone dev harness; the live SWA (roster present) shows the name. | **PROCEED** — harness-only; live SWA exercises it. |
| **G-3** | **Roster call on mount** — `loadPeople` (OBO→Graph) now also runs on Theo mount (for the name); it also pre-warms the invite picker. Best-effort, non-blocking; a failure leaves the bare greeting. | **PROCEED** — one async best-effort call; acceptable + reused. |
| **G-4** | **First-name heuristic** — `selfName` = first whitespace-delimited token of `displayName` ("Walter Mansfield" → "Walter"). A mononym uses the whole name; the full name is used verbatim in the system prompt. | **PROCEED** — standard first-name display; no edge that shows a wrong name. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`.

## F-P3 — Backend / contract grounding
Consumes the deployed, golden-verified `theo_list_people` (§2.9): `GET /api/theo_list_people` → `{ people: [{ id, displayName, …, isSelf }], self }`. The FE reads the `isSelf` row's `displayName`. No backend change; no new endpoint/field. Transport/auth via the existing `theoClient` → gateway (Bearer; mock fallback).

## F-P4 — Component reference grounding
**Modified (3):** `lib/prompt.ts` (`greeting(name?: string)` uses `name || USER_NAME`; `buildSystemPrompt(styleKey, custom, project, userName?)` appends `You are speaking with <name>.`), `useTheoState.ts` (derive `selfFullName`/`selfName` from `people.find(isSelf)`; `greeting(selfName)`; `buildSystemPrompt(…, selfFullName)` in `send`; expose `loadPeople`), `TheoSurface.tsx` (call `loadPeople()` in the mount effect). **Reused-unchanged:** `swapBlock.ts` (`USER_NAME` stays "" fallback), `ChatView.tsx` (renders `greeting` unchanged), `theoClient`/`gateway.*` (`listPeople` from B5c). Governing authority = VA-T1 (greeting slot, reconciled) + Golden Component Pack (§5 abstraction) + the deployed `theo_list_people` contract.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; full TS interfaces.

| # | Module (ownership; ACTIVE/NEW) | Interface / behavior (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `lib/prompt.ts` (**ACTIVE**, modify) | `export function greeting(name?: string): string` → `const who = (name && name.trim()) \|\| USER_NAME; return who ? \`${part}, ${who}\` : part;`. `export function buildSystemPrompt(styleKey: StyleKey, custom: string, project: Project \| null, userName?: string): string` → appends `\` You are speaking with ${userName.trim()}.\`` when `userName?.trim()`. | VA-T1 (greeting slot, reconciled) | `theo_list_people` displayName | PROCEED |
| TC-2 | `useTheoState` (**ACTIVE**, modify — state owner) | Derived: `const selfFullName = (people.find((p) => p.isSelf)?.displayName ?? "").trim();` and `const selfName = selfFullName ? selfFullName.split(/\s+/)[0] : "";`. `send` uses `buildSystemPrompt(styleKey, custom, chatProject, selfFullName)`. Return exposes `greeting: greeting(selfName)` and `loadPeople`. No new state (reuses `people`). | VA-T1 (state owner) | `theo_list_people` (via `theoClient.listPeople`) | PROCEED |
| TC-3 | `TheoSurface` (**ACTIVE**, modify) | Mount effect destructures `loadPeople` from `t` and calls `void loadPeople()` alongside `loadRecents`/`loadProjects`/`loadGalleryArtifacts`; `loadPeople` added to the effect deps. No prop/JSX change. | VA-T4 (mount) | via `theoClient` | PROCEED |

**Infra:** consumes the already-baked `VITE_FUNCTIONS_URL`. No `vite.config`/dependency change. `ChatView.tsx`, `swapBlock.ts`, `ProjectsView.tsx`, `ProjectDetail.tsx`, `Sidebar.tsx`, `data.ts` unchanged.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `778ecde`: `lib/prompt.ts`, `useTheoState.ts`, `TheoSurface.tsx` (all in the GCR with blob SHAs); references `swapBlock.ts`, `ChatView.tsx`. Guardrails: name via the existing `theoClient.listPeople` boundary; no browser→model call beyond the gateway; **no `localStorage`/`sessionStorage`**; no Tailwind; no `reporting_*`. Reused-unchanged: the B5c roster plumbing (`people`, `listPeople`).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; the greeting is a reconciled use of the existing VA-T1 slot + a Walter-directed behavioral personalization (F-P2); Gap Disclosure present (G-1…G-4 all PROCEED); CCT locked (3 rows, full interfaces). Validated this turn (`tsc` + `eslint` exit 0 + `build` green; TheoSurface 247.59 KB / 72.75 KB gzip; `src` reverted). On Codex APPROVAL, Pass 3 commits the three files and Walter redeploys the Theo SWA → the home landing greets the signed-in user by first name and Theo knows who it is working with. Walter SWA acceptance = Visual Acceptance Evidence.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-Greeting-By-Name-FE-Pass-1-VEP/Theo_1B_Greeting_By_Name_FE_VEP.md" --repo-root .
PASS
```

*End of Greeting By Name Pass-1 Frontend VEP (plan only).*
