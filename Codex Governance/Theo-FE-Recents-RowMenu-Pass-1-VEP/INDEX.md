# Theo Frontend — recents-row ⋮ menu (Star / Rename / Add to project / Delete): Pass-1 Frontend VEP

Plan-only Frontend VEP (implementation is Pass 3). Second half of the Walter-directed chat-menu ask (2026-07-23): replace the sidebar **Recents** rows' old pencil+trash `RowActions` with a Claude-style **⋮ ellipsis** that opens the SAME conversation menu as the header — **Star / Unstar · Rename · Add to project (submenu) · Delete**. The header title dropdown shipped already (ChatMenu, deployed); this brings the identical menu to the recents rows. To avoid two drifting copies, the menu item list is **extracted** into a shared `components/ConvMenu.tsx` (`ConvMenuItems`) consumed by BOTH the header (`ChatMenu`, refactored — no behaviour change) and the new row menu (`RowMenu`). New: `ConvMenu.tsx`, `RowMenu.tsx`. Edited: `ChatMenu.tsx` (uses `ConvMenuItems`), `icons.tsx` (`IcMore` ⋮), `Sidebar.tsx` (recents row uses `RowMenu`; `recents` typed `ConversationSummary[]`; +`projects`/`onToggleStar`/`onAddToProject` props), `TheoSurface.tsx` (threads those three into `<Sidebar>`). Row Rename delegates to the row's existing edit-in-place; the project submenu opens left (narrow sidebar). All actions hit the already-deployed handlers. No browser storage. `tsc --noEmit` + `vite build` verified green this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `c05c88517fb1f15eb2a40e0ba9da42c5ffeb3085` (vault-theo, `development`; grounding parent `e0bd3ca4fe11f1747a49938081fd2a1fc497f838` — the commit that deployed the header ChatMenu). Backend unchanged + deployed: `theo_set_conversation_starred` + `theo_list_conversations.starred` + set-project/rename/delete (API §2.1). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix, §6 CCT) | `Grep("Component Contract Table")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT, §5 Allowed Deltas / VISUAL-AUTHORITY-DEVIATION / §21A) | `Grep("VISUAL-AUTHORITY-DEVIATION")` + `Grep("One row per component in scope")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§2.5 no browser storage) | `git rev-parse` this turn | `b8155889ebfb44a153192e63796812a94aa87004` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 conversation handlers incl. `theo_set_conversation_starred`) | `Grep("theo_set_conversation_starred")` this turn | `4d2e23d096dbc6b89e0f48bc009ebfc5cf283215` |
| 7 | Deployed reference — `components/RowManage.tsx` (the `RowActions`/`InlineEdit` row pattern being replaced/reused) | `Read` this turn | `47903baf7d5a7e0d4f321129c7f9ffab37ecbd73` |
| 8 | Edited — `components/ChatMenu.tsx` `9e2182d1213054ab3571dd6cf56dea0a5679118c`; `components/icons.tsx` `2f9d4ed04976bbdbd86ed37c30d580b8720660bc`; `components/Sidebar.tsx` `90d89c2b06c87e898bcbcc20af9b853202e5f270`; `TheoSurface.tsx` `38c5d6a5420618e7ae23c8c7eccb1f52b895b3af`; **new** `components/ConvMenu.tsx` + `components/RowMenu.tsx` | `Read` this turn | (per file) |

VA registry (§4B): the recents-row **⋮ menu** extends the header ChatMenu **VISUAL-AUTHORITY-DEVIATION** (Golden Component Pack §5/§21A, replicate-Claude 2026-07-23) to the sidebar rows; `ConvMenuItems` is the shared extraction of the already-deployed menu (no new visual). Reuses VA-T1 tokens/icon idiom + the deployed row `InlineEdit` rename. No new VA-id.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "VISUAL-AUTHORITY-DEVIATION" | §1/CCT — the row ⋮ menu extends the Walter-directed VISUAL-AUTHORITY-DEVIATION (§21A) to recents rows |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope" | §4 CCT — one row per unit (RowMenu / ConvMenuItems / ChatMenu / Sidebar) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_1A_FRONTEND_HANDOVER.md | §2.5 | "No browser storage" | §1 — menu open/hover/submenu are React state; nothing persisted |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "theo_set_conversation_starred" | §1 — the row Star item calls this deployed endpoint (via `onToggleStar`) |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Prop interface (full TS) | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `RowMenu` — **NEW** (`src/theo/components/RowMenu.tsx`) | `{ conversation: ConversationSummary; projects: Project[]; onStartRename: () => void; onDelete: (id: string) => void; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void }` | **VISUAL-AUTHORITY-DEVIATION** (§5/§21A) — the ⋮ button (`IcMore`) + popover (right-aligned) inside the hover-revealed `.vo-actions` span, forced visible while open; renders `ConvMenuItems` (submenuSide="left"). Reuses VA-T1 tokens. No new VA-id. | Renders `ConvMenuItems`; actions call the deployed `theo_set_conversation_starred`/`theo_set_conversation_project`/`theo_delete_conversation` via callbacks; Rename delegates to `onStartRename` (the row's `InlineEdit`). No direct fetch. |
| `ConvMenuItems` — **NEW** shared (`src/theo/components/ConvMenu.tsx`) | `{ conversation: ConversationSummary; projects: Project[]; submenuSide?: "left" \| "right"; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void; onDelete: (id: string) => void; onStartRename: () => void; close: () => void }` | Shared item list (Star/Rename/Add-to-project submenu/Delete) — the SAME items the deployed ChatMenu rendered; extraction only, no visual change. | Reads `ConversationSummary` (`starred`/`project_id`/`title`) + `Project[]`; delete uses `window.confirm`; add-to-project disables when already linked. |
| `ChatMenu` (`src/theo/components/ChatMenu.tsx`) — **refactored** | `{ conversation: ConversationSummary; projects: Project[]; onRename: (id: string, title: string) => void; onDelete: (id: string) => void; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void }` — **unchanged**; now renders `ConvMenuItems` (submenuSide="right") in its popover instead of inline item JSX. Title+chevron trigger + `RenameInput` retained. Behaviour identical. | Unchanged (header VISUAL-AUTHORITY-DEVIATION). | Unchanged. |
| `Sidebar` (`src/theo/components/Sidebar.tsx`) | `interface SidebarProps { collapsed: boolean; onToggleCollapse: () => void; view: View; onNavigate: (v: View) => void; nav: NavItem[]; search: string; onSearch: (s: string) => void; recents: ConversationSummary[]; projects: Project[]; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void; onSelectRecent: (id: string) => void; onRenameRecent: (id: string, title: string) => void; onDeleteRecent: (id: string) => void; onNewChat: () => void; workspaceName: string; productName: string; fluid?: boolean }` — **changed**: `recents` retyped `{ id: string; title: string }[]` → `ConversationSummary[]`; added `projects` / `onToggleStar` / `onAddToProject`. The recents row swaps `<RowActions>` → `<RowMenu>` (Rename → existing `setEditingId`; Delete → `onDeleteRecent`; Star/Add-to-project → new handlers); `InlineEdit` rename unchanged. | Row affordance changes pencil+trash → ⋮ (part of the deviation); row layout otherwise unchanged (VA-T1). | `t.projects` + `t.setConversationStarred` + `t.addConversationToProject` (threaded by `TheoSurface`) + the existing `recents`/rename/delete. |
| `TheoSurface` (`src/theo/TheoSurface.tsx`) | `interface TheoSurfaceProps { appContext?: AppContext; navSlot?: HTMLElement \| null; mainSlot?: HTMLElement \| null; getAccessToken?: () => Promise<string \| null>; suppressNarrowHeader?: boolean; newChatNonce?: number }` — **unchanged**; the only edit threads `projects={t.projects}` / `onToggleStar={t.setConversationStarred}` / `onAddToProject={t.addConversationToProject}` into the existing `<Sidebar>` instance (props-only; no logic/state change). | n/a — mount/host wrapper (VA-T2/T3); no rendered change of its own. | Passes `useTheoState` (`t.*`) members through to `Sidebar`. |

Supporting: `icons.tsx` (`IcMore` ⋮, VA-T1 SV idiom). (`TheoSurface` + all edited components are full CCT rows above.)

## §1 Feature Identification + boundary
- **Feature:** each Recents row's hover actions become a single **⋮** that opens the shared conversation menu (Star/Rename/Add-to-project/Delete) — the exact menu the header uses. Rename triggers the row's existing edit-in-place; Delete keeps the existing confirm; Star toggles via the deployed handler (optimistic, from `useTheoState`); Add-to-project links an unlinked chat (set-once; current project ✓, others disabled). Menu is `.vo-actions` hover-revealed but stays visible while open.
- **Shared extraction:** `ConvMenuItems` is the single menu-item source; `ChatMenu` (header) is refactored to use it (no behaviour change), so the header and row menus can't drift.
- **Boundary:** vault-theo FE only — 2 new components + 4 additive edits (ChatMenu refactor, icons, Sidebar, TheoSurface). No backend (all handlers deployed), no row-layout change beyond the affordance swap, no browser storage (§2.5), no new dependency. `tsc --noEmit` + `vite build` green (verified).
- **Scope note:** the project-home chat rows (`ProjectDetail`) keep their current `RowActions` for now (add-to-project is moot inside a project); extending the ⋮ menu there is an optional later increment. This VEP targets the sidebar Recents rows Walter flagged.

## §2 Gap Register
**PROCEED.**
- **(1) VISUAL-AUTHORITY-DEVIATION (Walter-directed).** The row ⋮ menu extends the header deviation (§5/§21A, replicate-Claude). Reuses VA-T1 tokens/icons + row `InlineEdit`. Disclosed, PROCEED.
- **(2) Shared extraction, no header regression.** `ChatMenu` now renders `ConvMenuItems`; the header trigger/rename/behaviour are unchanged (diff limited to the item block → component call). `tsc` + `vite build` green. PROCEED.
- **(3) `recents` retyped `ConversationSummary[]`.** The only caller (`TheoSurface`) already passes `t.recents` (a `ConversationSummary[]`); the retype makes `starred`/`project_id` available to the row menu. No runtime change. PROCEED.
- **(4) Contract pre-existence (T22).** All row actions call handlers deployed + documented at the grounding parent (Star + set-project + rename + delete). No proceed-gap. PROCEED.
- **(5) No browser storage (§2.5); no new VA-id / reference-artifact; add-to-project remains set-once (move/remove deferred).** PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** recents-row ⋮ menu (shared with the header menu).
- **F-P2 Visual authority:** extends the header VISUAL-AUTHORITY-DEVIATION (§21A) to rows; no new VA-id.
- **F-P3 CCT:** above (RowMenu/ConvMenuItems/ChatMenu/Sidebar + supporting).
- **F-P4 Structural mirror:** the deployed ChatMenu (items extracted), the `RowManage` `RowActions`/`InlineEdit` row pattern, the icon SV idiom.
- **F-P5 Allowed-delta / deviation:** row ⋮ = deviation; the extraction + prop/type additions are ALLOWED DELTAs.
- **F-P6 Contract dependency:** the deployed conversation handlers (API §2.1); `ConversationSummary.starred?`.
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + lint PASS; `tsc` + `vite build` green).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the 6 file edits (2 new + 4 edited); `tsc --noEmit` (green — verified) + vite build.
2. Commit + push `development`.
3. Verify in Theo: hover a Recents row → a single ⋮ appears (no more pencil/trash); clicking it opens Star/Rename/Add-to-project/Delete; Star toggles + shows on the header star; Rename edits the row in place; Add-to-project links an unlinked chat; Delete confirms + removes. The header title dropdown still works identically (shared items).
4. No Role-C (no contract change).

## §5 Out of scope
`ProjectDetail` chat-row menu (keeps `RowActions` for now). Add-to-project move/remove. A "Starred" recents section/sort. "Mark as unread" (no model). Any other surface. Browser-storage persistence (§2.5). No backend change.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-Recents-RowMenu-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the 6 edits, runs `tsc` + vite build, and pushes `development`. No Role-C.
