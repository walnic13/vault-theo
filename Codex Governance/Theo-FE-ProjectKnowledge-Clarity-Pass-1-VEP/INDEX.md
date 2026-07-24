# Theo Frontend — Project knowledge + custom-instructions clarity & dead-button fix: Pass-1 Frontend VEP

Plan-only Frontend VEP (implementation is Pass 3). Phase A of the Projects best-in-class program (Walter-directed 2026-07-23). Three FE-only problems on the project-home surface (`ProjectDetail`): (1) **"+ Add knowledge" silently no-ops** — `useTheoState.addKnowledge` returns early unless BOTH title and content are non-empty, with no disabled state, hint, or busy feedback, so a partial entry reads as a broken button; (2) **no explanation** of what "Project knowledge" or "Custom instructions" are / what to put; (3) a **dev-speak footnote** ("Injected into context … Azure AI Search / pgvector in production"). Fix, all inside `components/ProjectDetail.tsx`: add a plain-language description to each section, replace the footnote with user copy, give the Add-knowledge button a **disabled-until-valid** state + a "Add a title and some content to save." hint + an **"Adding…"** busy state (awaiting the existing `onAddKnowledge`; the existing `setError` toast surfaces backend failures; the draft is retained on error), and clearer field placeholders + an instructions example. No new prop except widening `onAddKnowledge` to `() => void | Promise<void>` so the button can await it; no new component/VA-id/endpoint/dependency; no backend/contract change; no browser storage (`kBusy` is transient React state). `tsc --noEmit` + `vite build` verified green this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `c151ce394a010b9812c02f4b70681a61cd257603` (vault-theo, `development`; grounding parent `68df10b500d998e302f71e7c62721421bf3fd56a` — the deployed menu width-fix). No backend/contract change. Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance; not used as grounding evidence this turn).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§6 CCT gates) | `Grep("Component Contract Table row missing")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§5 Allowed Deltas / VISUAL-AUTHORITY-DEVIATION) | `Grep("ALLOWED DELTA")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§2.5 no browser storage) | `Grep("No browser storage")` this turn | `b8155889ebfb44a153192e63796812a94aa87004` |
| 6 | Edited (package copy) — `Codex Governance/Theo-FE-ProjectKnowledge-Clarity-Pass-1-VEP/src/theo/components/ProjectDetail.tsx` `29be38b0f70c854428e04c89e3f9ed57fa07388c` | `Read` + `Edit` this turn | (edited-content blob = committed package-copy blob) |

VA registry (§4B): unchanged — the project-home surface (`ProjectDetail`, B4e redesign) is an existing Walter-directed VISUAL-AUTHORITY-DEVIATION; this adds explanatory copy + button affordance state within it. No new VA-id.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "ALLOWED DELTA" | §1/CCT — descriptive copy + disabled/busy button state are ALLOWED DELTAs on the existing project-home surface (no new surface) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "VISUAL-AUTHORITY-DEVIATION" | §1 — change lands within the existing project-home VISUAL-AUTHORITY-DEVIATION; no new deviation |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §10 T20 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT — full ProjectDetailProps interface + VA + data/contract dependency |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_1A_FRONTEND_HANDOVER.md | §2.5 | "No browser storage" | §1 — `kBusy` is transient React state; nothing persisted |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Prop interface (full TS) | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `ProjectDetail` (`src/theo/components/ProjectDetail.tsx`) — **changed** | `{ project: Project; chats: ConversationSummary[]; kdraft: KDraft; onKdraftChange: (next: KDraft) => void; onAddKnowledge: () => void \| Promise<void>; onRemoveKnowledge: (kid: string) => void; onPatchInstructions: (text: string) => void; onStartChat: () => void; onSelectChat: (id: string) => void; onRenameChat: (id: string, title: string) => void; onDeleteChat: (id: string) => void; onPatchDescription: (text: string) => void; onSetVisibility: (id: string, visibility: "private" \| "group") => void; visibilityBusy: boolean; members: ProjectMember[]; people: Person[]; onShareMember: (projectId: string, memberOid: string) => void; onUnshareMember: (projectId: string, memberOid: string) => void; memberPendingKey: string \| null }` — the **only** prop change is widening `onAddKnowledge` from `() => void` to `() => void \| Promise<void>` so the button can `await` it for the busy state. Adds internal transient state `kBusy: boolean` + a derived `canAddKnowledge` (title & content non-empty). | Existing project-home VISUAL-AUTHORITY-DEVIATION (§5); copy + affordance state only. No new VA-id. | Unchanged — `onAddKnowledge` calls the deployed `theo_add_project_knowledge` via `useTheoState.addKnowledge`; validation is FE-side (button disabled until valid); backend failures surface through the existing `setError`. No new/changed request. |

## §1 Feature Identification + boundary
- **Fix (Phase A of Projects best-in-class program):** inside `ProjectDetail.tsx` only — (a) a description `<p>` atop the Project-knowledge section + the Custom-instructions section; (b) replace the "Injected into context … Azure AI Search / pgvector in production" footnote with "Everything here is available to Theo in every chat in this project."; (c) the Add-knowledge button becomes `disabled={!canAddKnowledge || kBusy}` with an `"Adding…"` label while the POST is in flight (`onClick` awaits `onAddKnowledge`), plus a "Add a title and some content to save." hint when invalid; (d) clearer field placeholders + an instructions-example placeholder.
- **Why:** the button appears broken (silent early-return on incomplete input); the sections give no guidance on what to enter or why. Descriptions + a never-silent button (disabled+hint / busy / retained-input-on-error) resolve both without touching the backend.
- **Boundary:** vault-theo FE only — one component. One prop widened (`onAddKnowledge`), no prop removed/added; no new component/VA-id/endpoint/dependency; no backend/contract change; no browser storage (§2.5 — `kBusy` transient). The existing `addKnowledge` validation/`setError` in `useTheoState` is unchanged (the disabled button is defence-in-depth in front of it). `tsc --noEmit` + `vite build` green (verified).
- **Deploy timing:** independent; ships the clarity + button fix on deploy. Survives the later `vaultgpt-func-projects` migration untouched (the gateway abstracts which app serves `theo_add_project_knowledge`).

## §2 Gap Register
**PROCEED.**
- **(1) Presentation + affordance ALLOWED DELTA.** Copy + disabled/busy button on the existing surface; same VA-id (§5). PROCEED.
- **(2) Prop widening only.** `onAddKnowledge: () => void` → `() => void | Promise<void>`; the sole caller (`TheoMain` → `t.addKnowledge`, an `async` fn) is already compatible (diff-verified). No other consumer. PROCEED.
- **(3) No browser storage (§2.5).** `kBusy` is transient React state; resets on unmount. PROCEED.
- **(4) Backend unchanged (T22 clean).** Button still calls the deployed `theo_add_project_knowledge`; no contract/Role-C. Later phases (file ingest, RAG) are separate governed packages. PROCEED.
- **(5) No new VA-id.** PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** project-knowledge/instructions clarity + Add-knowledge button feedback.
- **F-P2 Visual authority:** unchanged deviation; copy + affordance only.
- **F-P3 CCT:** above (`ProjectDetail` changed; one prop widened).
- **F-P4 Structural mirror:** the deployed `ProjectDetail` project-home layout + `Section`/`InputBox` primitives (reused, unchanged).
- **F-P5 Allowed-delta:** description copy + footnote copy + disabled/busy button + placeholders = ALLOWED DELTAs within the deviation (§5).
- **F-P6 Contract dependency:** unchanged (deployed `theo_add_project_knowledge`).
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + lint PASS; `tsc` + `vite build` green).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the one-file edit (from this package's `src/theo/components/ProjectDetail.tsx` copy); `tsc --noEmit` (green — verified) + vite build.
2. Commit + push `development`.
3. Verify in Theo: open a Project → each section shows its description; the Add-knowledge button is disabled with a hint until both fields are filled, shows "Adding…" during save, and keeps input + shows the error toast if the save fails.
4. No Role-C (no contract change).

## §5 Out of scope
File-as-knowledge ingest (Phase C), RAG retrieval (Phase D), the `vaultgpt-func-projects` migration (Phase B). Any `useTheoState` behaviour change beyond awaiting `onAddKnowledge`. No backend change.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-ProjectKnowledge-Clarity-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the one-file edit (from this package's copy), runs `tsc` + vite build, and pushes `development`. No Role-C.
