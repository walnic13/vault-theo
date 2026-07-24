# Theo Frontend — Project-knowledge file drop-zone (attach a file → file-backed knowledge): Pass-1 Frontend VEP

Plan-only Frontend VEP (implementation is Pass 3). Phase C FE of the Projects best-in-class program: add an **"Upload a file"** control to the Project-knowledge section so an owner can attach a file (email template, sample engagement letter, etc.) and have its extracted text become a **file-backed knowledge item**. Wires to the deployed, golden-curl-verified `theo_add_project_knowledge_file` (API Spec §2.2, landed) via a new `projectsBase` gateway route: pick file → `theoClient.uploadAttachment` (the deployed B8 create→upload→finalize handshake) → `addProjectKnowledgeFile(project_id, attachment_id)` → the returned `source_type='file'` item appends to the list (badged **File**). Also: an **interim per-item injection cap** in `buildSystemPrompt` (6 000 chars/item, truncation-marked) so a large file can't blow the system prompt before Phase D RAG. 8 files: `components/ProjectDetail.tsx` (+`TheoMain.tsx` thread), `services/{gateway.live,gateway.mock,theoClient}.ts`, `useTheoState.ts`, `types.ts`, `lib/prompt.ts`. `tsc --noEmit` + `vite build` verified green this turn.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `298acc611a4f4a1938bb9c77f6f34fbda2dfe719` (vault-theo, `development`; grounding parent `5437f4d6752e81aab6822628e431d356fc1793f7` — the §2.2 API-Spec Role-C landing documenting the route). No backend change (the handler + route are already deployed + documented). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance; not used as grounding evidence this turn).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§6 CCT gates / T20) | `Grep("Component Contract Table row missing")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§5 Allowed Deltas / VISUAL-AUTHORITY-DEVIATION) | `Grep("ALLOWED DELTA")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§2.5 no browser storage) | `Grep("No browser storage")` this turn | `b8155889ebfb44a153192e63796812a94aa87004` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 `theo_add_project_knowledge_file` route — the contract this FE cites) | `Grep("add project knowledge from a file")` this turn | `94145351007d3b336320fb56ac3719b9d0ce860e` |
| 7 | Edited (package copies) — `Codex Governance/Theo-FE-ProjectKnowledge-FileDropzone-Pass-1-VEP/src/theo/…`: `types.ts` `72af59e50baf9c575250137e2635675fdd6d56e4`; `useTheoState.ts` `8692f1588cf35e053763f728f1bf53c109064176`; `services/gateway.live.ts` `6e26e17aa3f86820e10666a52c6de3089ee81948`; `services/gateway.mock.ts` `a8dde065a9299c2ea100a0ca2d1c99addd453d7d`; `services/theoClient.ts` `5db2e68c253985beb6359b15ac283b1fcdedb0f2`; `lib/prompt.ts` `2d16076d4eda1f049952397964694abb430039ee`; `components/ProjectDetail.tsx` `e66936164051e9e6e344c1059c6fa3952b479bc8`; `components/TheoMain.tsx` `99ec4149ac3d7925657604ca439a2a1301b1af1e` | `Read`+`Edit` this turn | (per file; edited-content blob = committed package-copy blob) |

VA registry (§4B): unchanged — the project-home surface (`ProjectDetail`) is an existing Walter-directed VISUAL-AUTHORITY-DEVIATION; this adds an upload affordance + a "File" badge within it. No new VA-id.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "ALLOWED DELTA" | §1/CCT — the upload control + File badge + per-item injection cap are ALLOWED DELTAs on the existing surface |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "VISUAL-AUTHORITY-DEVIATION" | §1 — lands within the existing project-home deviation; no new deviation |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §10 T20 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT — full props + VA + contract dependency (the §2.2 route) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_1A_FRONTEND_HANDOVER.md | §2.5 | "No browser storage" | §1 — `kFileBusy`/`fileInputRef` are transient React state/ref; file bytes go straight to Blob via SAS; nothing persisted in the browser |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.2 | "add project knowledge from a file" | CCT contract dependency — the deployed route this FE calls |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| Component | Prop interface (full TS) | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `ProjectDetail` (`src/theo/components/ProjectDetail.tsx`) — **changed** | `{ project: Project; chats: ConversationSummary[]; kdraft: KDraft; onKdraftChange: (next: KDraft) => void; onAddKnowledge: () => void \| Promise<void>; onAddKnowledgeFile: (file: File) => void \| Promise<void>; onRemoveKnowledge: (kid: string) => void; onPatchInstructions: (text: string) => void; onStartChat: () => void; onSelectChat: (id: string) => void; onRenameChat: (id: string, title: string) => void; onDeleteChat: (id: string) => void; onPatchDescription: (text: string) => void; onSetVisibility: (id: string, visibility: "private" \| "group") => void; visibilityBusy: boolean; members: ProjectMember[]; people: Person[]; onShareMember: (projectId: string, memberOid: string) => void; onUnshareMember: (projectId: string, memberOid: string) => void; memberPendingKey: string \| null }` — **only new prop: `onAddKnowledgeFile`**. Adds internal transient `kFileBusy: boolean` + `fileInputRef` (hidden `<input type=file>`); an owner-only "Upload a file" control (busy "Uploading…"), and a **File** badge on `source_type==='file'` items. | Existing project-home VISUAL-AUTHORITY-DEVIATION (§5); upload affordance + badge only. No new VA-id. | `onAddKnowledgeFile` → `useTheoState.addKnowledgeFile` → `theoClient.uploadAttachment` (deployed B8 `theo_create_attachment_upload`→`theo_finalize_attachment`) then **`POST /api/theo_add_project_knowledge_file`** (API Spec §2.2, deployed on `vaultgpt-func-projects` via the new `projectsBase` route). Failures surface via the existing `setError`. |
| `TheoMain` (`src/theo/components/TheoMain.tsx`) — **changed (1 line)** | `{ t: ReturnType<typeof useTheoState>; mode: "full" \| "panel"; suppressNarrowHeader?: boolean }` — **prop interface UNCHANGED**. The sole edit threads the existing `useTheoState` value into the child: `<ProjectDetail … onAddKnowledgeFile={t.addKnowledgeFile} … />` (no `TheoMainProps` field added/changed). | Unchanged. | Passes `t.addKnowledgeFile` (from `useTheoState`) to `ProjectDetail`; no new/changed request of its own. |

## §1 Feature Identification + boundary
- **Feature (Phase C FE):** an owner-only "Upload a file" control in the Project-knowledge section. Flow: file pick → `onAddKnowledgeFile(file)` → `useTheoState.addKnowledgeFile` uploads via the deployed B8 pipeline (`theoClient.uploadAttachment` = create SAS → PUT to Blob → finalize/extract) then calls `theoClient.addProjectKnowledgeFile(projectId, attachmentId)` → the returned `source_type='file'` `Knowledge` appends to the project's list, badged **File**.
- **Routing:** `theo_add_project_knowledge_file` lives on `vaultgpt-func-projects` (not the monolith), so `gateway.live` gains a `projectsBase` (mirroring `streamBase`/`chatBase`: `VITE_PROJECTS_FUNCTIONS_URL` or `configureGateway({projectsBaseUrl})`, defaulting to the known func-projects host so it never falls back to `apiBase`). Bearer via the existing `authHeaders()` (shared audience — cross-app validated).
- **Interim injection cap:** `buildSystemPrompt` caps each knowledge item's injected text at 6 000 chars (truncation-marked) so a large file can't blow the system prompt pre-RAG. Retired by Phase D (HF-T4 relevance retrieval).
- **Supporting edits:** `types.ts` (`Knowledge.source_type?`), `gateway.mock.ts` (mock `addProjectKnowledgeFile` for the standalone harness), `theoClient.ts` (passthrough).
- **Boundary:** vault-theo FE only — 8 files. One new prop (`onAddKnowledgeFile`); no component/VA-id removed; no NEW backend/contract (the route is deployed + documented in §2.2 — **T22 clean**); no browser storage (§2.5 — transient state/ref; bytes go to Blob via SAS). `tsc --noEmit` + `vite build` green (verified).
- **Deploy timing:** independent; ships the drop-zone on deploy. Also gives the end-to-end path to re-confirm GC5/GC6 through the UI.

## §2 Gap Register
**PROCEED.**
- **(1) Presentation + affordance ALLOWED DELTA.** Upload control + File badge on the existing surface; same VA-id (§5). PROCEED.
- **(2) Contract pre-existence (T22).** `POST /api/theo_add_project_knowledge_file` is DEPLOYED + documented in API Spec §2.2 (grounding parent `5437f4d`) before this FE VEP. PROCEED.
- **(3) Cross-app routing.** `projectsBase` mirrors the deployed `streamBase`/`chatBase` per-app pattern; defaults to the func-projects host so it works standalone + federated. PROCEED.
- **(4) No browser storage (§2.5).** `kFileBusy`/`fileInputRef` transient; file bytes stream to Blob via the B8 SAS; nothing persisted in the browser. PROCEED.
- **(5) Interim injection cap disclosed.** 6 000 chars/item is an interim guard; Phase D RAG replaces it. PROCEED.
- **(6) Only extract-class files become knowledge (backend-enforced).** Native small PDFs/images → the handler's 400 surfaces via `setError` with guidance. Disclosed. PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** file drop-zone → file-backed project knowledge.
- **F-P2 Visual authority:** unchanged deviation; upload affordance + badge only.
- **F-P3 CCT:** above (`ProjectDetail` changed; `TheoMain` threads the prop).
- **F-P4 Structural mirror:** the deployed `ProjectDetail` knowledge form + the B8 `uploadAttachment` client + the `streamBase`/`chatBase` per-app routing pattern (reused for `projectsBase`).
- **F-P5 Allowed-delta:** upload control + File badge + `projectsBase` route + per-item injection cap = ALLOWED DELTAs.
- **F-P6 Contract dependency:** `theo_add_project_knowledge_file` (API Spec §2.2, deployed) + B8 upload handlers (deployed).
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + lint PASS; `tsc` + `vite build` green).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the 8 file edits (from this package's `src/theo/…` copies); `tsc --noEmit` (green — verified) + vite build.
2. Commit + push `development`.
3. Verify in Theo (desktop): open a Project → Project knowledge → "Upload a file" → pick a `.docx`/`.csv`/`.txt` → it uploads (Uploading…) and appears as a **File** knowledge item with its extracted text; a native image/small-PDF surfaces the backend's friendly error. (This is the UI re-confirmation of GC5/GC6.)
4. No Role-C (the route is already documented in §2.2).

## §5 Out of scope
RAG retrieval (Phase D). Download-original-file affordance. Editing a knowledge item. Removing the interim injection cap (Phase D). No backend change.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-ProjectKnowledge-FileDropzone-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the 8 edits (from this package's copies), runs `tsc` + vite build, and pushes `development`. No Role-C.
