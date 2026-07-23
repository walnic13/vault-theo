# Theo Frontend — chat-header title + dropdown menu (Star / Rename / Add to project / Delete): Pass-1 Frontend VEP

Plan-only Frontend VEP (implementation is Pass 3). Walter-directed 2026-07-23 (replicate the Claude chat-header affordance): the active saved conversation shows its **title + a chevron in the header's upper-left**; clicking opens a dropdown menu — **Star / Unstar · Rename · Add to project (submenu of the user's projects) · Delete**. Grounds on the deployed `starred` contract (Conversation-Star backend, API §2.1 + new `theo_set_conversation_starred`, landed 2026-07-23). New component `components/ChatMenu.tsx` (the title+chevron button + popover menu + edit-in-place rename + click-outside); wired in `components/TheoMain.tsx` (chats header). Supporting additive edits: `useTheoState.ts` (`setConversationStarred` optimistic toggle + `addConversationToProject` + exposes `conversationId`/`currentConversation`), `types.ts` (`ConversationSummary.starred`), `services/{theoClient,gateway.live,gateway.mock}.ts` (`setConversationStarred` client through the gateway), `components/icons.tsx` (`IcStar`/`IcChevron`, VA-T1 SV idiom). **Mark as unread is intentionally omitted** (no read/unread model — Walter-agreed). "Add to project" uses the deployed set-once handler (assign an unlinked chat; a chat already in a project shows its project ✓ and the others disabled — move/remove is a later backend relax). No browser storage. `tsc --noEmit` + `vite build` verified green this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `<PKG_COMMIT_SHA>` (vault-theo, `development` — the commit that first contains this package; grounding parent `26c9d7718f3e67ecdcbb014e7afba6adc6e21cf5` — the commit that landed the Conversation-Star backend Role-C). The paired backend is DEPLOYED + golden-verified on premium (`theo_set_conversation_starred`; `theo_list_conversations` returns `starred`; API §2.1). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance, not grounding).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix, §6 CCT gates, §4B VA registry) | `Grep("Component Contract Table")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT, §5 Allowed Deltas / VISUAL-AUTHORITY-DEVIATION / §21A) | `Grep("VISUAL-AUTHORITY-DEVIATION")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§2.5 no browser storage) | `git rev-parse` this turn | `b8155889ebfb44a153192e63796812a94aa87004` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_list_conversations` `starred`; `theo_set_conversation_starred`) | `Grep("theo_set_conversation_starred")` this turn | `4d2e23d096dbc6b89e0f48bc009ebfc5cf283215` |
| 7 | Edited (components) — `TheoMain.tsx` `e19505af6ddc5faf3d0f634da87148689fb518bf`; **new** `ChatMenu.tsx`; `icons.tsx` `ff228f16af6025bb4798fc3081591a26f1bc2baf` | `Read` this turn | (per file) |
| 8 | Edited (state/services/types) — `useTheoState.ts` `0a5b0d3bf26a5c820343c5fc55883a2768b7fac1`; `types.ts` `3b49db020a9be55dcc787a1af9fb38e82cafa86d`; `services/theoClient.ts` `1707dc3beb0b0aa332adc3edf26cdae4d4e24b34`; `services/gateway.live.ts` `6e76d818f3b3376f54adf2e139832f67ba5d1ce1`; `services/gateway.mock.ts` `2cf4f0626d8afd458ee472930fa88f45192242f6` | `Read` this turn | (per file) |

VA registry (§4B): the **ChatMenu title + dropdown** is a NEW UI surface — a **Walter-directed VISUAL-AUTHORITY-DEVIATION** (Golden Component Pack §5/§21A, replicate-Claude 2026-07-23); it reuses VA-T1 tokens (`C.*`), the VA-T1 icon SV idiom, and the deployed `RowManage` edit-in-place rename pattern. No new VA-id.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "VISUAL-AUTHORITY-DEVIATION" | §1/CCT — the ChatMenu title + dropdown is a Walter-directed VISUAL-AUTHORITY-DEVIATION (§21A) 2026-07-23 |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT — full props for ChatMenu/TheoMain + VA + the conversation-handler data dependencies |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_1A_FRONTEND_HANDOVER.md | §2.5 | "No browser storage" | §1 — menu state is React state; nothing persisted client-side |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "theo_set_conversation_starred" | §1 — the Star item calls this deployed endpoint (via the gateway) |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Prop interface (full TS) | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `ChatMenu` — **NEW** (`src/theo/components/ChatMenu.tsx`) | `{ conversation: ConversationSummary; projects: Project[]; onRename: (id: string, title: string) => void; onDelete: (id: string) => void; onToggleStar: (id: string, starred: boolean) => void; onAddToProject: (id: string, projectId: string) => void }` | **Walter-directed VISUAL-AUTHORITY-DEVIATION** (§5/§21A) — new title+chevron button + popover menu (Star/Rename/Add-to-project submenu/Delete); reuses `C.*` tokens, the VA-T1 icon SV idiom, and the `RowManage` edit-in-place rename. No new VA-id. | Consumes `ConversationSummary` (`title`/`starred`/`project_id`) + `Project[]`; the actions call the deployed `theo_rename_conversation`/`theo_delete_conversation`/`theo_set_conversation_project`/`theo_set_conversation_starred` via the parent-supplied callbacks. No direct fetch. |
| `TheoMain` (`src/theo/components/TheoMain.tsx`) | `interface TheoMainProps { t: ReturnType<typeof useTheoState>; mode: "full" \| "panel"; suppressNarrowHeader?: boolean }` — **unchanged**; adds a conditional `<ChatMenu>` at the start of the chats-header left cluster when `t.conversationId && t.currentConversation`. | Reuses the existing 54px header (VA-T1) — the ChatMenu deviation sits inside it; no layout change to the header itself. | `t.conversationId`, `t.currentConversation`, `t.projects`, and the four `t.*` action handlers (all from `useTheoState`). |
| `useTheoState` — hook (`src/theo/useTheoState.ts`) | `export function useTheoState()` — **propless**; return shape gains `conversationId`, `currentConversation` (`recentsList.find(id) ?? null`), `setConversationStarred`, `addConversationToProject` (all additive; existing members unchanged). | n/a (state hook). | `theoClient.setConversationStarred` (new) + the existing `setConversationProject`/`renameConversation`/`deleteConversation`; optimistic `recentsList` update on star. |

Supporting (non-component) edits: `types.ts` (`ConversationSummary.starred: boolean`), `services/theoClient.ts` + `services/gateway.live.ts` + `services/gateway.mock.ts` (`setConversationStarred` through the gateway → `POST /api/theo_set_conversation_starred`, mock no-op), `components/icons.tsx` (`IcStar` w/ `filled`, `IcChevron` — VA-T1 SV idiom).

## §1 Feature Identification + boundary
- **Feature:** an active saved conversation's title + chevron in the header upper-left; the dropdown = Star/Unstar · Rename (edit-in-place) · Add to project (submenu of `projects`) · Delete (confirm). Star toggles via the deployed handler with an optimistic `recentsList` update; a starred chat shows a small filled star by the title. Add-to-project links an unlinked chat (set-once) and reflects the project pill; a chat already in a project shows ✓ on its project and disables the others. Delete reuses the existing confirm + `theo_delete_conversation`. Only rendered when `conversationId` exists (a new unsaved chat shows no title menu — Claude parity).
- **Boundary:** vault-theo FE only. One new component + a conditional render in `TheoMain` + additive state/handlers/type/client/icons. No backend (all four handlers deployed), no rendered-header layout change (the menu sits in the existing header), no browser storage (§2.5), no new dependency. `tsc --noEmit` + `vite build` green (verified). 1A mock path compiles (mock `setConversationStarred` + `starred` literals).
- **Mark as unread:** omitted — no read/unread model exists; Walter-agreed to skip rather than ship a hollow item.

## §2 Gap Register
**PROCEED.**
- **(1) VISUAL-AUTHORITY-DEVIATION (Walter-directed).** The title+chevron+dropdown is a new UI surface, classified VISUAL-AUTHORITY-DEVIATION (§5/§21A), replicate-Claude 2026-07-23. Reuses VA-T1 tokens/icons/rename-pattern. Disclosed, PROCEED.
- **(2) Add-to-project is set-once.** The deployed `theo_set_conversation_project` assigns an unlinked chat; the menu disables already-linked moves + marks the current project ✓. Move/remove = a later backend relax (out of scope). Disclosed, PROCEED.
- **(3) Mark as unread omitted.** No read/unread model; Walter-agreed skip. NO-GAP.
- **(4) No browser storage (§2.5).** Menu open/edit/hover are React state; nothing persisted. PROCEED.
- **(5) Contract pre-existence (T22).** All four actions call handlers DEPLOYED + documented at the grounding parent (`theo_set_conversation_starred` + list `starred` landed 2026-07-23; rename/delete/set-project pre-existing). No proceed-gap. PROCEED.
- **(6) No new VA-id / reference-artifact.** VA-T1 idioms reused. PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** chat-header title + dropdown menu (Star/Rename/Add-to-project/Delete).
- **F-P2 Visual authority:** new ChatMenu surface = VISUAL-AUTHORITY-DEVIATION (§21A, Walter-directed); reuses VA-T1 tokens/icons; no new VA-id.
- **F-P3 CCT:** above (ChatMenu/TheoMain/useTheoState + supporting).
- **F-P4 Structural mirror:** the deployed header (TheoMain), the `RowManage` edit-in-place rename, the icon SV idiom, the `setConversationProject` client (mirrored for `setConversationStarred`).
- **F-P5 Allowed-delta / deviation:** ChatMenu = deviation; the state/client/type/icon additions are ALLOWED DELTAs (additive).
- **F-P6 Contract dependency:** the four deployed conversation handlers (API §2.1); `starred` on `ConversationSummary` (deployed list field).
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + lint PASS; `tsc` + `vite build` green).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the 8 file edits (7 edited + 1 new `ChatMenu.tsx`); `tsc --noEmit` (green — verified) + vite build.
2. Commit + push `development`.
3. Verify in Theo: open a saved chat → the title + chevron shows top-left; the menu opens with Star/Rename/Add-to-project/Delete; Star toggles + shows the star (and persists across reload via the deployed `starred`); Rename edits in place; Add-to-project (from an unlinked chat) links + shows the project pill; Delete confirms + removes. New unsaved chat shows no title menu.
4. No Role-C (no contract change — the backend is already documented).

## §5 Out of scope
"Mark as unread" (no model). Add-to-project move/remove (set-once backend unchanged). A dedicated "Starred" recents section / star-sort (this VEP surfaces the flag + toggle; sectioning is a later FE increment). Any other component/surface. Browser-storage persistence (prohibited, §2.5). No premium/backend change.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-ChatHeader-Menu-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the 8 edits, runs `tsc` + vite build, and pushes `development`. No Role-C (backend already deployed + documented).
