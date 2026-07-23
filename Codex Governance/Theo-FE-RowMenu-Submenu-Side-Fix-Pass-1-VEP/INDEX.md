# Theo Frontend — recents-row ⋮ "Add to project" submenu opens RIGHT (off-screen fix): Pass-1 Frontend VEP

Plan-only Frontend VEP (implementation is Pass 3). **Bug fix** to the just-shipped recents-row ⋮ menu (Walter-observed 2026-07-23): the "Add to project" submenu opens to the **left** and runs **off-screen** — the ⋮ popover already sits at the sidebar's right edge, so there is no room leftward. Fix: flip `RowMenu`'s `ConvMenuItems` `submenuSide` from `"left"` to `"right"` so the project list opens into the main content area (where there is space). One prop value + the adjacent comment in `components/RowMenu.tsx`; no other change (the header `ChatMenu` already uses `"right"` correctly). `tsc --noEmit` + `vite build` verified green this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `<PKG_COMMIT_SHA>` (vault-theo, `development`; grounding parent `536d03c676b7619578d845546b0d9214f4164167` — the deployed recents-row ⋮ menu). No backend/contract change. Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§6 CCT gates) | `Grep("Component Contract Table")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§5 Allowed Deltas) | `Grep("ALLOWED DELTA")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Edited — `components/RowMenu.tsx` (the recents-row ⋮ menu) | `Read` this turn | `06efd0dd0344c87a875cfff5b954b5fe4819ff93` |
| 6 | Shared menu (unchanged) — `components/ConvMenu.tsx` (`ConvMenuItems` `submenuSide` prop consumed) | `Read` this turn | `adf5fd30e67b8a48ab13f1cee1124f4e82942cd0` |

VA registry (§4B): unchanged — the recents-row ⋮ menu is the existing Walter-directed VISUAL-AUTHORITY-DEVIATION (§5/§21A); this only flips the submenu open-direction. No new VA-id.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "ALLOWED DELTA" | §1/CCT — flipping `submenuSide` `"left"`→`"right"` is an ALLOWED DELTA (a positioning fix on the existing menu; no new surface) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT — full RowMenu props (unchanged) + VA + no new data dependency |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Prop interface (full TS; **unchanged**) | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `RowMenu` (`src/theo/components/RowMenu.tsx`) | `{ conversation: ConversationSummary; projects: Project[]; onStartRename: () => void; onDelete: (id: string) => void; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void }` — **no prop added/changed**. The sole change: the `<ConvMenuItems>` it renders is passed `submenuSide="right"` (was `"left"`) + the adjacent comment updated. | Unchanged — the recents-row ⋮ VISUAL-AUTHORITY-DEVIATION (§5/§21A); this only changes the "Add to project" submenu open-direction so it stays on-screen. No new VA-id. | Unchanged — renders `ConvMenuItems`; actions call the deployed conversation handlers via the same callbacks. No new/changed request. |

## §1 Feature Identification + boundary
- **Fix:** `RowMenu` passes `submenuSide="right"` to `ConvMenuItems` (was `"left"`). `ConvMenuItems` already supports both sides (`submenuSide === "left" ? { right: "calc(100% + 4px)" } : { left: "calc(100% + 4px)" }`); the header `ChatMenu` uses `"right"` and is correct. For the sidebar row, the ⋮ popover is right-aligned to the ⋮ at the sidebar's right edge, so a left-opening submenu runs off the left of the viewport; right-opening puts the project list into the main content area (ample room).
- **Boundary:** one value + one comment in `components/RowMenu.tsx`. No prop change, no new component/VA-id/endpoint/dependency, no backend/contract change, no browser storage. `ChatMenu`/`ConvMenuItems` unchanged. `tsc --noEmit` + `vite build` green (verified).
- **Deploy timing:** independent; fixes the off-screen submenu on deploy.

## §2 Gap Register
**PROCEED.**
- **(1) Positioning-only ALLOWED DELTA.** Flips the submenu side; no new surface/behaviour. Golden Pack §5. PROCEED.
- **(2) No prop/contract change.** RowMenu props + all handlers unchanged; the submenu direction is an internal presentation detail. PROCEED.
- **(3) Header unaffected.** `ChatMenu` already used `"right"`; only the row menu changes. PROCEED.
- **(4) No browser storage / no new VA-id / no Role-C (no contract change).** PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** flip the row ⋮ "Add to project" submenu to open right.
- **F-P2 Visual authority:** unchanged deviation (§21A); open-direction only.
- **F-P3 CCT:** above — RowMenu props unchanged.
- **F-P4 Structural mirror:** the deployed `ConvMenuItems` `submenuSide` prop (header already uses `"right"`).
- **F-P5 Allowed-delta:** `submenuSide` value flip = ALLOWED DELTA (§5); no deviation change.
- **F-P6 Contract dependency:** unchanged.
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + lint PASS; `tsc` + `vite build` green).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the one-file edit; `tsc --noEmit` (green — verified) + vite build.
2. Commit + push `development`.
3. Verify in Theo: a Recents-row ⋮ → "Add to project" → the project list now opens to the **right** (into the content area), fully on-screen. Header menu unchanged.
4. No Role-C (no contract change).

## §5 Out of scope
The header `ChatMenu` (already correct). Any other menu behaviour. `ProjectDetail` rows. No backend change.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-RowMenu-Submenu-Side-Fix-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the one-file edit, runs `tsc` + vite build, and pushes `development`. No Role-C.
