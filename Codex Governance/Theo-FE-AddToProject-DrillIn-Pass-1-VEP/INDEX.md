# Theo Frontend — "Add to project" drill-in (replace side-flyout submenu): Pass-1 Frontend VEP

Plan-only Frontend VEP (implementation is Pass 3). Walter-directed 2026-07-23: the "Add to project" **side-flyout submenu has no horizontal room on either side** (desktop clips it; the mobile drawer has none), so replace it with a **drill-in** — clicking "Add to project" swaps the menu content **in place** to a "‹ Add to project" back header + a scrollable project list (same popover width), and picking a project links it and closes. Implemented once in the shared `components/ConvMenu.tsx` (`ConvMenuItems`), so BOTH the header (`ChatMenu`) and the sidebar-row (`RowMenu`) menus get it. The `submenuSide` prop is removed (no side flyout remains); `ChatMenu` + `RowMenu` drop that argument (and `RowMenu`'s comment is updated). No backend/contract change; no browser storage. `tsc --noEmit` + `vite build` verified green this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `<PKG_COMMIT_SHA>` (vault-theo, `development`; grounding parent `152e386558aec6bc30b1dc1f253f3c34a30cff97` — the deployed submenu-side-fix / shared-menu state). No backend/contract change. Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§6 CCT gates) | `Grep("Component Contract Table")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§5 Allowed Deltas / VISUAL-AUTHORITY-DEVIATION / §21A) | `Grep("VISUAL-AUTHORITY-DEVIATION")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§2.5 no browser storage) | `git rev-parse` this turn | `b8155889ebfb44a153192e63796812a94aa87004` |
| 6 | Edited — `components/ConvMenu.tsx` `adf5fd30e67b8a48ab13f1cee1124f4e82942cd0` (drill-in; `submenuSide` removed); `components/ChatMenu.tsx` `e8625cab98aa3511546cd780edd8d6ccbe34eefa` (drop arg); `components/RowMenu.tsx` `28d9033a8cce7398b8ca0afa574a5c17dce7c719` (drop arg + comment) | `Read` this turn | (per file) |

VA registry (§4B): unchanged — the conversation menu is the existing Walter-directed VISUAL-AUTHORITY-DEVIATION (§5/§21A); the drill-in changes only HOW the project list is presented (in-place, replacing the side flyout). No new VA-id.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "VISUAL-AUTHORITY-DEVIATION" | §1/CCT — the drill-in is a presentation change within the existing Walter-directed VISUAL-AUTHORITY-DEVIATION (§21A) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT — full props for ConvMenuItems/ChatMenu/RowMenu + VA + data dependencies |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_1A_FRONTEND_HANDOVER.md | §2.5 | "No browser storage" | §1 — the drill-in view state (`"main"`/`"projects"`) is React state; nothing persisted |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Prop interface (full TS) | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `ConvMenuItems` (`src/theo/components/ConvMenu.tsx`) — **changed** | `{ conversation: ConversationSummary; projects: Project[]; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void; onDelete: (id: string) => void; onStartRename: () => void; close: () => void }` — **`submenuSide?: "left" \| "right"` REMOVED** (no side flyout). Adds an internal `view: "main" \| "projects"` state: "Add to project" sets `view="projects"`, which replaces the item list in place with a "‹ Add to project" back header + a scrollable (`maxHeight:280`) project list; picking a project calls `onAddToProject` + `close`; back returns to `"main"`. State resets on remount (menu close). | Existing VISUAL-AUTHORITY-DEVIATION (§5/§21A); drill-in presentation only, no new surface. No new VA-id. | Reads `ConversationSummary` (`starred`/`project_id`/`title`) + `Project[]`; actions call the deployed conversation handlers via callbacks; delete uses `window.confirm`. |
| `ChatMenu` (`src/theo/components/ChatMenu.tsx`) | `{ conversation: ConversationSummary; projects: Project[]; onRename: (id: string, title: string) => void; onDelete: (id: string) => void; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void }` — **unchanged**; the only edit drops the now-removed `submenuSide="right"` argument on its `<ConvMenuItems>` render. | Unchanged (header VISUAL-AUTHORITY-DEVIATION). | Unchanged. |
| `RowMenu` (`src/theo/components/RowMenu.tsx`) | `{ conversation: ConversationSummary; projects: Project[]; onStartRename: () => void; onDelete: (id: string) => void; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void }` — **unchanged**; edits drop the `submenuSide="right"` argument + update the header comment (no side flyout). | Unchanged (row ⋮ VISUAL-AUTHORITY-DEVIATION). | Unchanged. |

## §1 Feature Identification + boundary
- **Fix:** replace the side-flyout project submenu with a drill-in inside `ConvMenuItems`. "Add to project" → `view="projects"` → the menu content becomes a back header + scrollable project list (same popover width). Pick → `onAddToProject` + close; back → `view="main"`. Removes `submenuSide` (both open-directions are dead now that there's no flyout); `ChatMenu`/`RowMenu` drop the argument.
- **Why:** the menu is anchored in a narrow sidebar (desktop) / near-full-width drawer (mobile); a side flyout has no room either direction (Walter-observed off-screen both ways). A drill-in stays within the popover width and scrolls — works on desktop and mobile.
- **Boundary:** vault-theo FE only — one shared component's presentation (`ConvMenu.tsx`) + two one-line caller edits. No prop added (one removed), no new component/VA-id/endpoint/dependency, no backend/contract change, no browser storage (§2.5 — `view` is transient React state). `tsc --noEmit` + `vite build` green (verified).
- **Deploy timing:** independent; fixes the off-screen submenu (both surfaces) on deploy.

## §2 Gap Register
**PROCEED.**
- **(1) Presentation change within the existing deviation.** Drill-in vs side flyout; same menu, same VA-id (§5/§21A). Disclosed, PROCEED.
- **(2) `submenuSide` prop removed.** No side flyout remains; both callers drop the argument (diff-verified). No other consumer. PROCEED.
- **(3) No browser storage (§2.5).** The `view` drill-in state is transient React state; resets when the menu closes. PROCEED.
- **(4) Shared once.** The drill-in lives in `ConvMenuItems`, so header + row menus stay identical (no drift). PROCEED.
- **(5) No contract/Role-C; no new VA-id; handlers unchanged (T22 clean).** PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** drill-in "Add to project" (replace the side flyout).
- **F-P2 Visual authority:** unchanged deviation (§21A); presentation only.
- **F-P3 CCT:** above (ConvMenuItems changed; ChatMenu/RowMenu callers).
- **F-P4 Structural mirror:** the deployed `ConvMenuItems` menu + the existing project-list rendering (now in-place).
- **F-P5 Allowed-delta:** drill-in presentation + `submenuSide` removal = ALLOWED DELTAs within the deviation.
- **F-P6 Contract dependency:** unchanged (deployed conversation handlers).
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + lint PASS; `tsc` + `vite build` green).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the 3 file edits; `tsc --noEmit` (green — verified) + vite build.
2. Commit + push `development`.
3. Verify in Theo (desktop + mobile): open the header chevron OR a Recents-row ⋮ → "Add to project" → the menu content drills in to the project list (back header + scrollable list) within the same popover, fully on-screen; picking a project links it; back returns to the main menu.
4. No Role-C (no contract change).

## §5 Out of scope
Any other menu behaviour. Add-to-project move/remove (set-once backend). `ProjectDetail` rows. No backend change.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-AddToProject-DrillIn-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the 3 edits, runs `tsc` + vite build, and pushes `development`. No Role-C.
