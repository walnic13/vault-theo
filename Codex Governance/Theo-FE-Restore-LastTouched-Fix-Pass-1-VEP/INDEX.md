# Theo Frontend — restore/Recents order by last-TOUCHED (reopen-lands-on-wrong-chat fix): Pass-1 Frontend VEP

Plan-only Frontend VEP (implementation is Pass 3). **Bug fix** (Walter-reported 2026-07-23, mobile + desktop): on reopen, Theo restores an **older** conversation, not the latest one the user was in (e.g. the recent image/video chats). Root cause (grounded): the restore opens `recentsList[0]`, and `theo_list_conversations` orders `last_opened_at DESC **NULLS LAST**, updated_at DESC`. `last_opened_at` is stamped **only** by `theo_get_conversation` (explicit open); a chat that was **created + messaged** via the stream (which bumps `updated_at` but never calls get) has a **NULL** `last_opened_at`, so it sorts *behind* any older explicitly-opened chat despite being the most recent activity. Fix: in `useTheoState.loadRecents`, re-sort the returned list client-side by **last-touched = max(`last_opened_at`, `updated_at`)** so `recentsList[0]` (the restore target) and the Recents display are the conversation the user most recently *interacted with*. One file (`src/theo/useTheoState.ts`); `ConversationSummary` already carries both timestamps (no type change). No rendered-surface/layout change (same Recents treatment; only the data sort key changes). `tsc --noEmit` verified green this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `38589a27b066cf6ca28a55c0ae321e5a2e339a82` (vault-theo, `development` — the commit that first contains this package; grounding parent `94c1c3822038ed2afbc6603b2a84932a97eb2e85`). Backend unchanged (already deployed): `theo_list_conversations` returns `last_opened_at` + `updated_at` per conversation (API §2.1/§2.15). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance, not grounding).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix, §6 CCT gates) | `Grep("Component Contract Table")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT, §5 Allowed Deltas / §16 state) | `Grep("One row per component in scope")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§2.5 no browser storage) | `git rev-parse` this turn | `b8155889ebfb44a153192e63796812a94aa87004` |
| 6 | Theo Architecture — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (VA-T2/T4 mount) | `git rev-parse` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_list_conversations` returns `last_opened_at` + `updated_at`; server order is `last_opened_at DESC NULLS LAST, updated_at DESC`) | `Grep("last_opened_at")` this turn | `c20e254e7aa020a3594026b0863a085c0d3f525d` |
| 8 | Edited — `src/theo/useTheoState.ts` (`loadRecents` L195; restore effect L207–214) | `Read` this turn | `fe683f82c54a15084b4c3a82f59ad706a276bc02` |
| 9 | `src/theo/types.ts` — `ConversationSummary` already carries `updated_at` + `last_opened_at` (no change) | `Read` this turn | `3b49db020a9be55dcc787a1af9fb38e82cafa86d` |

VA registry (§4B): **VA-T1** (Theo Chats surface / Recents) — this change makes **no** rendered-surface/layout change (same Recents treatment; only the client-side sort key of the list data changes), so it is **EXACT** vs VA-T1, not a VISUAL-AUTHORITY-DEVIATION.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope" | §3 CCT — one row: the `useTheoState` hook |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT — propless hook signature + VA-T1 (EXACT) + the `theo_list_conversations` data dependency |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_1A_FRONTEND_HANDOVER.md | §2.5 | "No browser storage" | §1 — the ordering stays server-sourced + client-sorted in memory; no localStorage/sessionStorage |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "last_opened_at" | §1 — the FE re-sorts on the `last_opened_at` + `updated_at` fields this endpoint returns |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Interface (full; **unchanged**) | Visual authority (VA-id) | Data / contract dependency | Verdict |
|---|---|---|---|---|
| `useTheoState` — Theo surface state hook; **ACTIVE** (`src/theo/useTheoState.ts`) | `export function useTheoState()` — **propless**; returns the surface state/handlers object (return shape **unchanged**). Change is internal to `loadRecents`: after `listConversations(50)`, sort the returned `ConversationSummary[]` by last-touched `const touched = (c: ConversationSummary) => Math.max(Date.parse(c.last_opened_at \|\| "") \|\| 0, Date.parse(c.updated_at \|\| "") \|\| 0)` descending before `setRecentsList`. The existing restore effect (opens `recentsList[0]`) and its `draft`/`attachments` once-guard are unchanged. No new returned member; no new state. | **VA-T1** (Chats / Recents) — **EXACT**: no rendered-surface/layout/treatment change; only the client-side sort key of the Recents data changes (the list renders identically, ordered by last-touched instead of the server's last-opened-first). Not a VISUAL-AUTHORITY-DEVIATION (Golden Pack §5 covers visual/layout changes, not data ordering). | `theo_list_conversations` (API §2.1, DEPLOYED) — consumes the returned `last_opened_at` + `updated_at`; no new/changed request, no new call site. | **PROCEED** |

## §1 Feature Identification + boundary
- **Fix:** in `useTheoState.loadRecents`, re-sort the `theo_list_conversations` result by last-touched = `max(last_opened_at, updated_at)` DESC before `setRecentsList`. This makes `recentsList[0]` (the restore-on-reopen target) and the Recents display the conversation the user most recently **interacted with** — fixing "reopen lands on an older chat" when the latest chat was created+messaged but never explicitly reopened (NULL `last_opened_at`).
- **Why the server order isn't enough:** `theo_list_conversations` orders `last_opened_at DESC NULLS LAST, updated_at DESC` (API §2.1); `last_opened_at` is stamped only by `theo_get_conversation`. A messaged-but-not-reopened chat has NULL `last_opened_at` → sorts behind older opened chats. Messaging bumps `updated_at` (verified in the stream persist), so `max(last_opened_at, updated_at)` restores the correct recency. (A source-of-truth backend `ORDER BY GREATEST(last_opened_at, updated_at)` is an optional follow-up on the monolith; the FE sort fixes the realistic case within the returned window.)
- **Boundary:** vault-theo FE only — one function in `src/theo/useTheoState.ts`. No type change (`ConversationSummary` already has both fields), no backend, no other component, no rendered-surface/layout change, no browser storage (§2.5 — the list is server-sourced, sorted in memory), no new dependency. `tsc --noEmit` green (verified this turn). 1A mock path unaffected.
- **Deploy timing:** independent; fixes the reopen behaviour on deploy.

## §2 Gap Register
**PROCEED.**
- **(1) No rendered-surface change → EXACT vs VA-T1.** Same Recents component/treatment; only the data sort key changes. Not a VISUAL-AUTHORITY-DEVIATION (Golden Pack §5). PROCEED.
- **(2) No browser storage (§2.5).** The order is derived in memory from the server response; nothing persisted client-side. PROCEED.
- **(3) Restore guard unchanged.** The `draft`/`attachments`/`conversationId`/`messages` once-guard on the restore effect is untouched — an in-progress compose still suppresses restore (T13/F-P7 preserved). PROCEED.
- **(4) Window edge (disclosed).** The server returns up to 50 (limit) ordered `NULLS LAST`; the FE re-sort corrects order *within* the returned set. If a user had >50 conversations and the active one fell outside the returned 50, only a backend `GREATEST(...)` order would recover it — noted as the optional monolith follow-up (out of scope here). PROCEED.
- **(5) No contract/Role-C.** Consumes existing fields; no API change. NO-GAP.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** re-sort Recents/restore by last-touched.
- **F-P2 Visual authority:** VA-T1 EXACT; no surface change.
- **F-P3 CCT:** above — propless `useTheoState`, VA-T1 EXACT, `theo_list_conversations` dependency.
- **F-P4 Structural mirror:** the existing `loadRecents`/restore effect (this adds a client-side sort only).
- **F-P5 Allowed-delta:** data-ordering behaviour change; EXACT vs VA-T1 (no visual deviation).
- **F-P6 Contract dependency:** `theo_list_conversations` `last_opened_at` + `updated_at` (API §2.1; DEPLOYED).
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + lint PASS; `tsc` green).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the `loadRecents` edit; `tsc --noEmit` (green — verified) + vite build.
2. Commit + push `development`.
3. Verify: with a chat created+messaged (never reopened) as the most recent activity, reopen Theo → it restores THAT chat (not an older opened one); Recents lists it first; New chat still starts blank; empty user still sees the greeting.
4. No Role-C (no contract change).

## §5 Out of scope
The optional backend `theo_list_conversations` `ORDER BY GREATEST(last_opened_at, updated_at)` (monolith; source-of-truth + >50 edge). The restore once-guard (unchanged). Any other component/surface. Browser-storage persistence (prohibited, §2.5). No premium.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-Restore-LastTouched-Fix-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the `loadRecents` edit, runs `tsc` + vite build, and pushes `development`. No Role-C (no contract change).
