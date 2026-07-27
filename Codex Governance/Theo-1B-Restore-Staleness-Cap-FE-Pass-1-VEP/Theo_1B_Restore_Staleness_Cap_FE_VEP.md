# Theo 1B — Restore-on-reopen: 4-hour staleness cap — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) to `development` and the Theo dev SWA serves it (Walter accepts). **Microstep:** the cold-open restore-on-reopen gate in `useTheoState.ts` currently reopens the last-touched conversation with **no time cap** — so a return after any gap (hours, days) lands on a stale chat. This VEP adds a **staleness cap (Walter-set: 4 hours)**: on the one-time restore decision, if the last chat's last-touched time (`max(last_opened_at, updated_at)`) is older than 4h (or absent), the gate drops to the **fresh Theo greeting** instead of restoring — "resume within a working session, else start fresh". One file (`useTheoState.ts`), internal to the existing restore effect. No visual-surface change, no new state, no browser storage, no backend/contract/schema change.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `a206e5d74a7c38084f019baaa93a2079c7cf06bf` (vault-theo, `development`, base at authoring; the commit that CONTAINS this package is given in the Codex note)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix; Pass-1 row = Full Baseline Grounding). Frontend sub-phases F-P1…F-P6 walked; the backend P/I/E track does not apply → `N/A`. This caps the restore-on-reopen behaviour: `useTheoState`'s restore effect (decides once via `didRestoreRef` at the first Recents settle) gains a **4-hour staleness check** before it calls `selectRecent(recentsList[0].id)` — `const RESTORE_MAX_AGE_MS = 4*60*60*1000; const lastTouched = max(Date.parse(last_opened_at), Date.parse(updated_at)); if (!lastTouched || Date.now()-lastTouched > RESTORE_MAX_AGE_MS) { setRestoring(false); return; }`. When stale, the gate drops and the app shows the normal new-chat greeting (VA-T1). No change to the ordering, the "already-in-a-chat / composing / empty-user" guards, the `restoring` splash, or the returned state shape. **No `localStorage`/`sessionStorage`** — the timestamps are server-sourced (`theo_list_conversations` → `last_opened_at`/`updated_at`, already consumed) and compared to `Date.now()` in memory. The proposed file was applied to `src` this turn and passes `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`, exit 0) + `eslint` (exit 0; one **pre-existing** `react-hooks/exhaustive-deps` warning on the same effect's `selectRecent` omission — present at HEAD `a206e5d`, unchanged by this VEP) + `npm run build` (vite; TheoSurface 325.25 kB / 95.57 kB gzip, exit 0); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>` / `git hash-object`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5; §4 matrix; §4B; §6 classification) | `Read`/`Grep` this turn | `aca008660566997795a991a5816f4011d757c942` (current HEAD — post VA-T11 landing `a206e5d`) |
| 2 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT) | `Grep` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 3 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6.3 no browser storage; §2 plan-only) | `Grep` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 4 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | cited (surface authority) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (chat surface + greeting) | `Grep` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 7 | **VA-T3** (registered §4B) — `governance/THEO_1A_FRONTEND_HANDOVER.md` (no-browser-storage discipline) | `Grep` this turn | `b8155889ebfb44a153192e63796812a94aa87004` |
| 8 | ACTIVE (modify) — `src/theo/useTheoState.ts` (restore-on-reopen effect) | `Read`/`Edit` this turn | `a6f1daed6c99446776ae1942592d00eba272c0be` |
| 9 | **PROPOSED** — `proposed-src/theo/useTheoState.ts` | authored + validated this turn | `1b97aed31e0c18ada5da79e3d87be76d38bf9cfb` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. **No `localStorage`/`sessionStorage`** (Governor §6.3). No Tailwind/CSS-in-JS. No new backend/contract/schema. No new dependency.

---

## Rule Anchor Table
| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Full Baseline Grounding" | GCR grounding mode (Pass 1 FE VEP) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Every structural/visual classification (EXACT, ALLOWED DELTA, DEVIATION, APPROVED, REJECTED, DEPLOYED, PROPOSED, NOT_IMPLEMENTED, VISUAL-AUTHORITY-MATCH, VISUAL-AUTHORITY-DEVIATION) MUST be backed by at least one Rule Anchor" | §F-P2 classification anchored |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A VA-id not registered in §4B is invalid as a citation" | §F-P2 cites only registered VA-T1/VA-T3 |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope. Each row locks three surfaces:" | §F-P5 CCT (1 row, no interface change) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`; 1A state is React/in-memory" | §F-P4 — server-sourced timestamps + `Date.now()`, no storage |

---

## F-P1 — Feature identification
**Microstep:** cap the restore-on-reopen window. `useTheoState`'s restore effect (a one-shot, gated by `didRestoreRef`, that runs at the first Recents settle) today unconditionally reopens `recentsList[0]` (the last-touched conversation) when the user is not already in a chat / composing and there is something to restore. This VEP inserts a **4-hour staleness check** immediately before the restore call:
- compute `lastTouched = max(Date.parse(recentsList[0].last_opened_at), Date.parse(recentsList[0].updated_at))`;
- if `!lastTouched` OR `Date.now() - lastTouched > 4h`, call `setRestoring(false)` and `return` (drop the gate → the app shows the fresh Theo greeting, VA-T1);
- otherwise restore as before.

**Out of scope / unchanged:** the last-touched ordering in `loadRecents`; the "already-in-a-chat / composing / empty-user" guards; the `restoring` branded splash; `selectRecent`; the returned state object shape; every other surface. No new state variable (a effect-local `const` (declared inside the restore `useEffect`) + `Date.now()`), no browser storage, no backend/contract change.

## F-P2 — UI Authority Reconciliation
| VA-id (registered §4B) | Reconciliation | Classification (anchored) |
| --- | --- | --- |
| VA-T1 (Theo chat surface + new-chat greeting) | Both possible landing surfaces already exist and are unchanged: the restored chat (VA-T1 chat) and the new-chat greeting (VA-T1 home). This VEP only changes *which* one the cold-open lands on when the last chat is stale (>4h) — it now lands on the existing greeting instead of the existing chat. No surface is added, removed, or restyled. | **VISUAL-AUTHORITY-MATCH** (both surfaces unchanged; a behavioural gate, not a visual change; FE Conformance §6) |
| VA-T3 (1A handover — no browser storage) | The staleness comparison uses server-sourced timestamps (`theo_list_conversations` → `last_opened_at`/`updated_at`, already consumed for ordering) and `Date.now()`, held in memory only. No `localStorage`/`sessionStorage`. | **VISUAL-AUTHORITY-MATCH** (no-storage discipline preserved) |

No Tailwind/CSS-in-JS. No `localStorage`/`sessionStorage`.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **`Date.now()` at the restore decision** — the cutoff is evaluated once, when the one-shot restore effect fires (client clock). | **PROCEED** — the restore decision is inherently a one-time cold-open event; a client-clock comparison is appropriate and needs no persistence. Clock skew is immaterial at a 4-hour granularity. |
| **G-2** | **Threshold is a hard-coded constant** (`RESTORE_MAX_AGE_MS = 4h`), not user-configurable. | **PROCEED** — Walter-set value (4h); a named `const` with an explaining comment keeps it a one-line tune later. No settings surface in scope. |
| **G-3** | **Pre-existing eslint warning** — `react-hooks/exhaustive-deps` flags the same restore effect's `selectRecent` omission from its dep array. | **PROCEED (pre-existing, unchanged)** — present at HEAD `a206e5d` before this VEP; the effect is an intentional one-shot (`didRestoreRef`) so `selectRecent` is deliberately excluded. This VEP neither introduces nor resolves it (out of scope); `eslint` still exits 0 (warning, not error). |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting`; no backend/contract/schema change.

## F-P3 — Backend / contract grounding
- **No backend, contract, API Spec, or schema change.** `theo_list_conversations` is already consumed and already returns `last_opened_at` / `updated_at` (used for the last-touched ordering); this VEP only reads those existing fields at the restore decision. No gateway/model call added (Governor §6.1 preserved).

## F-P4 — Component reference grounding
**PRIMARY REFERENCE:** the existing `useTheoState.ts` restore effect (the structural mirror is its current form; the change is a guard inserted before the existing `selectRecent` call). No new state (Governor §6.3 — a effect-local `const` (declared inside the restore `useEffect`) + `Date.now()`, no storage). Ordering/guards/`restoring` splash/`selectRecent`/returned state **unchanged**.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; the row: interface + VA-id + contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `useTheoState` (Theo state hook; **ACTIVE**, modify) | `export function useTheoState()` — **returned state object UNCHANGED** (incl. `restoring: boolean`, consumed by `ChatView` via `restoring?`). Delta = a 4-hour staleness guard inside the existing restore `useEffect`, before `selectRecent(recentsList[0].id)`; no new field, no signature change, no new hook/state. | VA-T1 (both landing surfaces unchanged); VA-T3 (no storage) | `theo_list_conversations` — reads existing `last_opened_at` / `updated_at` (already consumed for ordering); no new endpoint/field | PROCEED |

**Infra:** no `vite.config`/dependency change. Only `useTheoState.ts` touched. `ChatView`/`VaultMark`/`SpiralAssemble`/gateway **unchanged** (`ChatView` still receives the same `restoring` flag).

## F-P6 — Validation (this turn, against `src`, reverted)
- `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`) → **exit 0**.
- `npx eslint src/theo/useTheoState.ts` → **exit 0**; one pre-existing `react-hooks/exhaustive-deps` warning (the restore effect's `selectRecent`), present at HEAD, unchanged by this VEP (G-3).
- `npm run build` (vite) → **exit 0**; `__federation_expose_TheoSurface` 325.25 kB (gzip 95.57 kB).
- After validation, `src` reverted to HEAD; the package carries the proposed source only under `proposed-src/`.

## F-P7 — Landing plan (Pass 3, on APPROVAL)
Copy `proposed-src/theo/useTheoState.ts` → `src/theo/useTheoState.ts`; re-verify `tsc`/`eslint`/`build` green; commit to `development`; the Theo dev SWA serves it; Walter accepts (reopen within 4h → last chat; after 4h → fresh greeting).
