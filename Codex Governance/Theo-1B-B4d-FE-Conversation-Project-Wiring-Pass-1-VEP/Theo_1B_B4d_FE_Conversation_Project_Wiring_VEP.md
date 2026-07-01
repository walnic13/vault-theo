# Theo 1B — B4d Frontend Conversation↔Project Wiring (tag on send + restore on reload) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against a scratch copy of `src`, reverted) and Walter redeploys the Theo SWA. **Microstep:** wire the FE to the **deployed, golden-curl-verified** B4d-backend (`theo_set_conversation_project` + `theo_list_conversations ?projectId`). Two behaviours behind the single `theoClient` boundary: (1) **tag** — after a project chat's first turn returns a `conversation_id`, call `theo_set_conversation_project` (owner-scoped, idempotent set-once) so the chat belongs to the project; (2) **restore** — reopening a chat that has a `project_id` re-sets the active project (the existing chip). No rendered-surface change; the **per-project chat list display + project-home redesign are B4e**.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `25c590f` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix). Real-in-1B FE wiring. Frontend sub-phases F-P1…F-P7 walked; the backend P/I/E track does not apply → `N/A`. The registered VA-T1 artifact is read this turn: `frontend/theo-frontend-reference.jsx` (the project chip + chats surface — no visual change here). The consumed contract (`theo_set_conversation_project`; `theo_list_conversations`; `theo_get_conversation` returning `project_id`) is **deployed + golden-curl-verified** (B4d-backend `25c590f`; capture `.local/b4d_conversation_project_verify_2026-07-01.txt`). API Spec §2.1 documents `List conversations` / `Get conversation` (both returning `project_id`); the new `theo_set_conversation_project` row + the `?projectId` note land via a short API-Spec Role-C (§F-P2.5 G-4, PRE-LAND) — this FE VEP does not Rule-Anchor the un-landed rows, citing the deployed handler + the B4d-backend VEP as the contract basis. The four proposed files were applied to a scratch copy of `src` this turn and pass `npm run typecheck` + `eslint` (exit 0) + `npm run build` (TheoSurface 223 KB / 67 KB gzip); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6) | `grep -F "gateway abstraction" / "1A state is React/in-memory"` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B; §6) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 deltas) | `grep -F "three locked surfaces" / "service-module/gateway abstraction"` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | cited (surface authority) | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4) | `grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 List/Get conversation → `project_id`) | `Read(full)` + `grep -F "List conversations" / "Get conversation"` this turn | `4b978ef428c7b519387a7c8edc4838432a3f72bf` |
| 8 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` (live transport) | `Read(full)` this turn | `36018b4d26f26782c849b2d6a96061cfc595de40` |
| 9 | ACTIVE (modify) — `src/theo/services/gateway.mock.ts` (unconfigured fallback) | `Read(full)` this turn | `1ac5fcac93c311853ce82cc16553538e8a0d26f3` |
| 10 | ACTIVE (modify) — `src/theo/services/theoClient.ts` (single service boundary) | `Read(full)` this turn | `c8e92bafdf7034f8c98df76409047444c815ff26` |
| 11 | ACTIVE (modify) — `src/theo/useTheoState.ts` (state owner: send / selectRecent) | `Read(full)` this turn | `bf95dc158f4929446ee7dbe1e885c8297de37df2` |
| 12 | Reference (types; UNCHANGED) — `src/theo/types.ts` (`ConversationSummary.project_id`) | `Read(full)` this turn | `992c36fe7f553a871867c846e978cf70af0c177b` |
| 13 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (project chip + chats surface) | `Grep("Projects\|chatProject")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §F-P1 — microstep source (the FE wiring half) |
| spec/THEO_API_SPEC.md | §2.1 | "List conversations" | §F-P3 — `?projectId` list (deployed B4d) |
| spec/THEO_API_SPEC.md | §2.1 | "Get conversation" | §F-P3 — reload returns `project_id` → restore |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "gateway abstraction" | §F-P2/§F-P4 — the setter routes through `theoClient`/`gateway.live` |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "1A state is React/in-memory" | §F-P6 guardrail — `chatProject` is React state; no browser storage |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P2 — CCT rows = ALLOWED DELTA |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT rows carry interface + VA-id + contract dependency |

---

## F-P1 — Feature identification
**Microstep:** Theo Phase 1B **Tier B4d (FE)** — conversation↔project wiring, the frontend half. Backend (`theo_set_conversation_project` + `theo_list_conversations ?projectId`) is deployed + golden-verified. This VEP:
1. **Tag on send** — `useTheoState.send`, after a turn completes and a `conversation_id` is known, calls `theoClient.setConversationProject(conversationId, chatProject.id)` when the chat is in a project (idempotent set-once server-side, best-effort).
2. **Restore on reload** — `useTheoState.selectRecent`, when the reloaded conversation carries a `project_id`, **awaits `loadChatProject(pid)`** which loads the project's metadata + knowledge into a **self-contained held `chatProject` object** (see F-P4). The chat's project context is therefore independent of the `projects` list, so the next `send` injects full project context — the chip *and* the knowledge/instructions. (`chatProject` is no longer derived from the `projects` list — that made restore fragile: an empty/late list, or the mount `loadProjects()` resolving afterward and mapping `knowledge:[]`, could strip the context. Codex B4d-FE re-review finding.)

**Out of scope (B4e):** the per-project chat list *display* and the project-home redesign (chats-first, collapsible knowledge/instructions, artifact-panel close-on-navigate). B4d-FE adds the data behaviours only; `listProjectConversations` display lands with B4e.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (chat surface + project chip) | VA-T1 read this turn: the active-project chip is existing chrome driven by `chatProject`. B4d-FE changes `chatProject` from a **derived** value (`projects.find(chatProjectId)`) to a **held state object** (metadata + knowledge, loaded via `loadChatProject`), and sets it on enter/restore. The chip's rendering (name + close) is byte-unchanged — it reads `chatProject.name` exactly as before — and the tag-on-send call is invisible. No new/removed UI. | VISUAL-AUTHORITY-MATCH (no rendered-surface change) |
| Gateway / service abstraction (FE Governor §6; Golden §5) | One method (`setConversationProject`) added behind `theoClient` → `gateway.live` (mock no-op fallback). The explicitly-allowed 1B delta. | ALLOWED DELTA |

No `VISUAL-AUTHORITY-DEVIATION`. No component render change (`ChatView`/`ProjectDetail`/`TheoMain` untouched). No browser→model call (the setter hits the Functions app with the user's Entra Bearer, same as `sendMessage`).

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Standalone vault-theo dev harness** has no Functions backend / persistent conversations. | **PROCEED** — `gateway.live.setConversationProject`, unconfigured, delegates to `gateway.mock` (a no-op); `selectRecent`'s restore reads the mock `getConversation` (`project_id: null`) → no restore. Harness visually unchanged. |
| **G-2** | **Tag is best-effort.** The setter call is `void …catch(() => {})` — a failed link must never disrupt the delivered turn. | **PROCEED** — the server handler is idempotent set-once, so a later turn re-links harmlessly; the chat itself already carried the project context in its system prompt (B4c). |
| **G-3** | **Per-project chat list display + project-home redesign.** Rendering a project's chats and the chats-first layout are B4e. | **PROCEED (future-trigger)** — B4d-FE adds only tag + restore; `listProjectConversations` display lands with B4e. |
| **G-6** | **`loadChatProject` fails closed.** If `listProjectKnowledge` / the fallback `listProjects` fails, or the requested project can't be resolved, `chatProject` is set to `null` (not left as a prior project). `startInProject` then aborts (error, no view switch, no tag); `selectRecent` loads the thread without a project chip. | **PROCEED (intended)** — a failed switch must never start/tag a chat with the *wrong* project; a project-less chat (or a surfaced error) is the safe degradation. |
| **G-5** | **Held `chatProject` is a snapshot** taken at enter/restore (`loadChatProject`). Editing a project's knowledge/instructions in the detail view while a chat in that project is already open won't reflect in that live chat until it's re-entered. | **PROCEED (intended)** — a conversation's project context is snapshotted at entry (as Claude does); the normal flow is configure-then-chat, not edit-mid-chat. `loadChatProject` re-runs on the next `startInProject`/reload. |
| **G-4** | **API-Spec rows for the B4d endpoints not yet landed.** `theo_set_conversation_project` + the `?projectId` note are deployed + golden-verified but not yet in API Spec §2.x. | **PRE-LAND** — a short API-Spec Role-C follows (mirrors B4a/B4b). This FE VEP does **not** Rule-Anchor the un-landed rows; it cites the deployed handler + the B4d-backend VEP as the contract basis, and the existing §2.1 List/Get rows (which already return `project_id`). |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting` change.

## F-P3 — Backend / contract grounding
- **`theo_set_conversation_project`** (deployed B4d, golden-verified): `POST {conversation_id, project_id}` → `{ data: { conversation_id, project_id } }`; owner-scoped, idempotent set-once (200 even when already linked); nonexistent project/conversation → 404; bad uuid → 400.
- **`theo_get_conversation`** (API Spec §2.1, deployed): returns `conversation.project_id` — the reload path reads it to restore the project.
- **`theo_list_conversations ?projectId`** (deployed B4d): additive filter — consumed by B4e's per-project list, not this VEP.
- **Transport/auth:** absolute `${VITE_FUNCTIONS_URL}/api/theo_set_conversation_project` with `Authorization: Bearer <token>` (same pattern as `sendMessage`); CORS `*`; `credentials: "same-origin"`.

## F-P4 — Component reference grounding
**Transport:** `src/theo/services/gateway.live.ts` — `setConversationProject(conversationId, projectId): Promise<void>` (POST + Bearer; mock fallback). **Fallback:** `src/theo/services/gateway.mock.ts` — `setConversationProject` no-op. **Service boundary:** `src/theo/services/theoClient.ts` — one passthrough. **State owner:** `src/theo/useTheoState.ts` — `chatProject` is now held state loaded via `loadChatProject` (metadata + knowledge, self-contained); `send` calls the setter after finalize (best-effort, `chatProject?.id`); `startInProject`/`selectRecent` `await loadChatProject(id)`; `newChat`/`clearChatProject` clear it. Governing authority = the deployed B4d handlers + API Spec §2.1.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; `on<Event>`; every row: method interface (full TS) + VA-id + contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Method / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `gateway.mock` (Theo surface; **ACTIVE**, modify) | Adds `setConversationProject(conversationId: string, projectId: string): Promise<void>` — a no-op (`void conversationId; void projectId; return;`); the harness has no persistent conversations to tag. All other mocks unchanged. | VA-T1 (no surface) | mocked-contract (1A fallback) | PROCEED |
| TC-2 | `gateway.live` (Theo surface; **ACTIVE**, modify) | Adds `setConversationProject(conversationId: string, projectId: string): Promise<void>` — `if (!apiBase && !tokenProvider) return mockSetConversationProject(conversationId, projectId)`; else `POST \`${apiBase}/api/theo_set_conversation_project\`` with Bearer, body `{ conversation_id: conversationId, project_id: projectId }`; on `!res.ok` throw `Error(json?.error?.message ?? …)`. Imports `setConversationProject as mockSetConversationProject`. | VA-T1 (no surface) | `theo_set_conversation_project` (DEPLOYED B4d) | PROCEED |
| TC-3 | `theoClient` (Theo surface; **ACTIVE**, modify) | Adds one passthrough: `setConversationProject(conversationId: string, projectId: string): Promise<void> { return gatewaySetConversationProject(conversationId, projectId); }` (imported from `./gateway.live`). All existing methods unchanged. | VA-T1 (no surface) | API Spec §2.1; B4d handler | PROCEED |
| TC-4 | `useTheoState` (Theo surface; **ACTIVE**, modify — state owner) | **`chatProject` becomes held state** — `const [chatProject, setChatProject] = useState<Project \| null>(null)` replaces the `chatProjectId` state + the derived `const chatProject = projects.find(...)`. NEW `async function loadChatProject(id: string): Promise<boolean>` — loads the project into a self-contained held object; **returns true only if the requested project actually loaded, and FAILS CLOSED** (`catch`/unresolved → `setChatProject(null); return false`) so a failed switch never leaves a prior/other project active (Codex B4d-FE finding: wrong-project context/tag). Body: `const knowledge = await theoClient.listProjectKnowledge(id); let meta = projects.find((p) => p.id === id); if (!meta) { const list = await theoClient.listProjects(); meta = list.find((p) => p.id === id); } if (!meta) { setChatProject(null); return false; } setChatProject({ ...meta, knowledge }); return true;`. **Metadata prefers the local `projects` entry** (which carries any un-saved optimistic instruction edit — `patchInstructions` is debounced 800ms — so a chat started right after an edit uses the fresh instructions, not stale server ones; Codex B4d-FE finding), falling back to a fresh server list only when the project isn't loaded locally; **knowledge is always server-sourced** (add/remove are immediate, hence authoritative). A plain function (not `useCallback`) so it reads current `projects`. `startInProject(id)`: `setChatProject(null)` first, then `const ok = await loadChatProject(id); if (!ok) { setError(…); return; }` (fail closed — no view switch, no tag) before clear/switch; `selectRecent` clears then `await loadChatProject(pid)` on restore (correct-or-null). `newChat`: `setChatProject(null)`. `clearChatProject`: `() => setChatProject(null)`. `send`: after `if (convId) setConversationId(convId)`, adds `const cpId = chatProject?.id; if (convId && cpId) void theoClient.setConversationProject(convId, cpId).catch(() => {})` (best-effort tag). `selectRecent`: top `setChatProject(null)`; after load, `if (d.conversation && d.conversation.project_id) await loadChatProject(d.conversation.project_id)`. Because `chatProject` is held (not list-derived), neither an empty/late `projects` list nor a later `loadProjects()` mapping `knowledge:[]` can strip the active chat's context — closing the Codex B4d-FE re-review finding. Exposed handler names unchanged (`chatProject` still returned; `clearChatProject`/`startInProject` unchanged signatures). | VA-T1 (chat surface; unchanged render) | API Spec §2.1; B4d handler | PROCEED |

**Infra:** consumes the already-baked `VITE_FUNCTIONS_URL`. No `vite.config`/dependency change. `ChatView.tsx`, `ProjectDetail.tsx`, `TheoMain.tsx`, `types.ts` are **unchanged** (`ConversationSummary.project_id` already exists from B3b).

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `25c590f`: `gateway.live.ts` (+ setter), `gateway.mock.ts` (+ no-op), `theoClient.ts` (+ passthrough), `useTheoState.ts` (send tag + selectRecent restore). Guardrails: gateway abstraction preserved; no browser→model call (user Bearer only); **no `localStorage`/`sessionStorage`** (`chatProject` is React state); no Tailwind; no `reporting_*`/`corporate-reporting`. Unchanged-but-relied-on: the existing project-chip rendering (VA-T1) driven by `chatProject`.

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present (G-1/G-2/G-3 PROCEED; G-4 PRE-LAND); CCT locked (4 ACTIVE modify rows, each with full method interface + VA-id + contract dependency). No implementation begun — but the four files were validated this turn (`tsc` + `eslint` exit 0 + `build` green, `src` reverted). On Codex APPROVAL, Pass 3 commits the four files and Walter redeploys the Theo SWA → **chats created in a project belong to it and restore on reload**; the visible per-project list + redesign land with B4e (Walter SWA acceptance = Visual Acceptance Evidence).

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B4d-FE-Conversation-Project-Wiring-Pass-1-VEP/Theo_1B_B4d_FE_Conversation_Project_Wiring_VEP.md" --repo-root .
PASS
```

*End of B4d Frontend Conversation↔Project Wiring Pass-1 Frontend VEP (plan only).*
