# Theo Frontend — conversation-menu popover width cap + project-name truncation (off-screen balloon fix): Pass-1 Frontend VEP

Plan-only Frontend VEP (implementation is Pass 3). **Bug fix** to the just-shipped drill-in conversation menu (Walter-observed 2026-07-23, desktop + mobile): the "Add to project" drill-in list renders correctly but a **long project name balloons the popover far wider than its container** (e.g. "Advice - Series A, B, C - Preferred Stock Purchase"); because the sidebar-row (`RowMenu`) popover is anchored to the row's **right** edge (`right: 0`), the overflow spills off the **left** of the viewport and clips. Root cause: the popover surfaces had `minWidth` only (no width cap), and the project-name span could not truncate (no `minWidth: 0` / `flex` on the flex child, so the ellipsis never engaged). Fix: give each popover a **fixed width + `maxWidth: calc(100vw - 20px)` + `boxSizing: border-box`** (`RowMenu` 240 — narrower because it is right-anchored inside the narrow sidebar; `ChatMenu` 264 — left-anchored, grows into the content area), and make the project-name span **`flex: 1; minWidth: 0`** so long names ellipsize instead of widening the box (the `✓` becomes `flexShrink: 0`). Pure presentation (CSS values); no prop/contract/backend change, no browser storage. `tsc --noEmit` + `vite build` verified green this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `253db0479edc9ac8bc2d39bd05f86503f175bad2` (vault-theo, `development`; grounding parent `1f89620724554899506af6fff330eea9a4fb874c` — the deployed drill-in menu). No backend/contract change. Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance; not used as grounding evidence this turn).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§6 CCT gates) | `Grep("Component Contract Table")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§5 Allowed Deltas / VISUAL-AUTHORITY-DEVIATION) | `Grep("ALLOWED DELTA")` + `Grep("VISUAL-AUTHORITY-DEVIATION")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§2.5 no browser storage) | `Grep("browser storage")` this turn | `b8155889ebfb44a153192e63796812a94aa87004` |
| 6 | Edited (package copies) — `Codex Governance/Theo-FE-ChatMenu-Width-Fix-Pass-1-VEP/src/theo/components/ChatMenu.tsx` `349669a44ee7f01fa0a0efc3309869c8fcac7b0e`; `RowMenu.tsx` `1e8ee8404a582b4341f28b65be6206560842aedf`; `ConvMenu.tsx` `b2bdb99ddb5229a9ef8e4bdec1e7be3c71444a6d` | `Read` + `Edit` this turn | (per file; edited-content blob = committed package-copy blob) |

VA registry (§4B): unchanged — the conversation menu is the existing Walter-directed VISUAL-AUTHORITY-DEVIATION (§5); this only bounds the popover width and truncates long names so the existing menu stays on-screen. No new VA-id.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "ALLOWED DELTA" | §1/CCT — the width cap + name truncation is an ALLOWED DELTA (an overflow/positioning fix on the existing menu; no new surface) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "VISUAL-AUTHORITY-DEVIATION" | §1 — change lands within the existing Walter-directed VISUAL-AUTHORITY-DEVIATION; no new deviation |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT — full props for ChatMenu/RowMenu/ConvMenuItems (all unchanged) + VA + data dependencies |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_1A_FRONTEND_HANDOVER.md | §2.5 | "No browser storage" | §1 — CSS-only change; no state added, nothing persisted |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Prop interface (full TS; **unchanged**) | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `ChatMenu` (`src/theo/components/ChatMenu.tsx`) | `{ conversation: ConversationSummary; projects: Project[]; onRename: (id: string, title: string) => void; onDelete: (id: string) => void; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void }` — **no prop added/changed**. Sole edit: the popover `surface` style changes `minWidth: 224` → `width: 264, maxWidth: "calc(100vw - 20px)", boxSizing: "border-box"` (left-anchored header menu grows into the content area). | Unchanged — header VISUAL-AUTHORITY-DEVIATION (§5). No new VA-id. | Unchanged — renders `ConvMenuItems`; actions call the deployed conversation handlers via callbacks. No new/changed request. |
| `RowMenu` (`src/theo/components/RowMenu.tsx`) | `{ conversation: ConversationSummary; projects: Project[]; onStartRename: () => void; onDelete: (id: string) => void; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void }` — **no prop added/changed**. Sole edit: the popover `surface` style changes `minWidth: 220` → `width: 240, maxWidth: "calc(100vw - 20px)", boxSizing: "border-box"` (narrower because right-anchored `right: 0` inside the narrow sidebar — a bounded width keeps the box on-screen). | Unchanged — row ⋮ VISUAL-AUTHORITY-DEVIATION (§5). No new VA-id. | Unchanged — renders `ConvMenuItems`; actions call the deployed conversation handlers via callbacks. No new/changed request. |
| `ConvMenuItems` (`src/theo/components/ConvMenu.tsx`) | `{ conversation: ConversationSummary; projects: Project[]; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void; onDelete: (id: string) => void; onStartRename: () => void; close: () => void }` — **no prop added/changed**. Sole edit: in the drill-in project list, the project-name `<span>` gains `flex: 1, minWidth: 0` (so `overflow/textOverflow/whiteSpace` ellipsis engages within the now-bounded popover) and the `✓` `<span>` changes `marginLeft: "auto"` → `flexShrink: 0`. Drill-in `view` state (`"main"`/`"projects"`) unchanged. | Existing VISUAL-AUTHORITY-DEVIATION (§5); truncation presentation only. No new VA-id. | Reads `ConversationSummary` (`starred`/`project_id`/`title`) + `Project[]`; actions call the deployed conversation handlers via callbacks; delete uses `window.confirm`. Unchanged. |

## §1 Feature Identification + boundary
- **Fix:** bound both menu popovers to a fixed width with a viewport `maxWidth` guard, and make the drill-in project names truncate. `ChatMenu` surface `minWidth: 224` → `width: 264, maxWidth: "calc(100vw - 20px)", boxSizing: "border-box"`; `RowMenu` surface `minWidth: 220` → `width: 240, maxWidth: "calc(100vw - 20px)", boxSizing: "border-box"`; `ConvMenu` project-name span `+flex: 1, +minWidth: 0`, `✓` span `marginLeft:auto` → `flexShrink: 0`.
- **Why:** a long project name has no width bound → the popover balloons; `RowMenu` is right-anchored (`right: 0`) in the narrow sidebar, so the overflow runs off the **left** of the viewport (Walter-observed, desktop + mobile). A fixed width + `minWidth:0` ellipsis keeps the box a predictable, on-screen size and truncates long names. `RowMenu` uses the smaller 240 so the right-anchored box stays within the viewport on the narrow desktop sidebar; `ChatMenu` is left-anchored so 264 grows into the ample content area.
- **Boundary:** vault-theo FE only — three CSS-value edits across the two menu surfaces + one drill-in list span. No prop added/changed, no new component/VA-id/endpoint/dependency, no backend/contract change, no browser storage (§2.5). `tsc --noEmit` + `vite build` green (verified).
- **Deploy timing:** independent; fixes the off-screen balloon on both surfaces on deploy.

## §2 Gap Register
**PROCEED.**
- **(1) Presentation-only ALLOWED DELTA.** Width cap + truncation on the existing menu; same VA-id (§5). Golden Pack §5. PROCEED.
- **(2) No prop/contract change.** All three components' prop interfaces unchanged; only style values change. T20/T22 clean. PROCEED.
- **(3) No browser storage (§2.5).** CSS-only; no new state, nothing persisted. PROCEED.
- **(4) Shared drill-in unchanged.** The `ConvMenuItems` `view` drill-in behaviour is untouched; only the name-span truncation is added, so header + row menus stay identical. PROCEED.
- **(5) No new VA-id; handlers unchanged (T22 clean); no Role-C (no contract change).** PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** cap the two menu popover widths + truncate drill-in project names.
- **F-P2 Visual authority:** unchanged deviation (§5); overflow/presentation only.
- **F-P3 CCT:** above — all three components' props unchanged.
- **F-P4 Structural mirror:** the deployed drill-in `ConvMenuItems` project list + the two caller surfaces.
- **F-P5 Allowed-delta:** width cap + `boxSizing` + name-span truncation = ALLOWED DELTAs within the deviation (§5).
- **F-P6 Contract dependency:** unchanged (deployed conversation handlers).
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + lint PASS; `tsc` + `vite build` green).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the 3 file edits (from this package's `src/theo/components/` copies); `tsc --noEmit` (green — verified) + vite build.
2. Commit + push `development`.
3. Verify in Theo (desktop + mobile): open the header chevron OR a Recents-row ⋮ → "Add to project" → the project list stays a fixed-width, fully on-screen box; a long project name truncates with an ellipsis (full name in the row's `title`), the `✓` stays visible on the current project. Picking links it; back returns to the main menu.
4. No Role-C (no contract change).

## §5 Out of scope
Any other menu behaviour. The drill-in navigation itself (unchanged). Add-to-project move/remove (set-once backend). `ProjectDetail` rows. No backend change.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-ChatMenu-Width-Fix-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the 3 edits (from this package's copies), runs `tsc` + vite build, and pushes `development`. No Role-C.
