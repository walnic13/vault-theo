# Theo 1B — B3b Frontend Durable-Chat Wiring (conversation_id echo + real Recents + click-to-reload) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`build` green) and Walter redeploys the Theo SWA. **Microstep:** wire the Theo surface to the **deployed, golden-curl-verified** durable-chat backend (B3a persistence + B3b read endpoints, now documented in API Spec §2.1). Three threads of one capability: (1) **echo `conversation_id`** so multi-turn chats persist server-side under the signed-in user; (2) **real Recents** from `theo_list_conversations` (replacing the static `RECENTS` seed); (3) **click-to-reload** a thread via `theo_get_conversation`, rehydrating the transcript including persisted citations. All changes sit behind the single `theoClient` service boundary (1A handover §2.3); the rendered surface is reproduced faithfully — no redesign.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `c2027c9c968c6f31dfed66acce427e5c445f1410` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix: "Pass 1 — Frontend Verified Evidence Pack → Full Baseline Grounding"). New frontend feature (not a revision). Frontend sub-phases F-P1…F-P7 walked in the body; the backend P/I/E sub-phase track does not apply to a frontend VEP → `N/A`. The consumed contract (`conversation_id` round-trip + `theo_list_conversations` + `theo_get_conversation`) is documented in API Spec §2.1 (landed this session via the Conversation-History Role-C) and deployed + golden-curl-verified (B3a `4c4120f`; B3b `2a121fb4`; captures `.local/b3a_verify_result_2026-06-27.txt`, `.local/b3b_verify_result_2026-06-27.txt`).
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); independently verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 build discipline) | `Grep("gateway abstraction" / "1A state is React/in-memory")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B Registry; §6 triggers) | `Grep("MUST open with a Grounding Conformance Receipt" / "Visual Authority Registry")` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates; §2/§3) | `Read(offset=1, limit=45)` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 allowed deltas) | `Grep("three locked surfaces" / "service-module/gateway abstraction")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (Recents row; surface authority) | `Grep("Real conversation history from")` this turn | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B3 Recents / reload) | `Grep("real history from" / "reloaded chat thread")` this turn | `1733bdf19053d7173b72bfa9f0cf64e725cfdd3f` |
| 7 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 persist-turn / list / get rows) | `Read(offset=1, limit=55)` this turn | `010133b146b5fa8c5ed1820f6b25b40f6bb1656b` |
| 8 | ACTIVE (modify) — `src/theo/types.ts` (`GatewayRequest`/`GatewayResponse`; new conversation types) | `Read(full)` this turn | `5d9dfcd4549e96aa07e1125d77e8d2a1078fcd47` |
| 9 | ACTIVE (modify) — `src/theo/services/theoClient.ts` (single service boundary) | `Read(full)` this turn | `1f327bc480452d58bd0525b6428aba7d55c73d3b` |
| 10 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` (live transport) | `Read(full)` this turn | `76f8a7e9276f9cea42b5628e8ac514b589633648` |
| 11 | ACTIVE (modify) — `src/theo/services/gateway.mock.ts` (unconfigured fallback) | `Read(full)` this turn | `d8dea2a230310c1b274e1e4a8b91efcacd5aeb53` |
| 12 | ACTIVE (modify) — `src/theo/useTheoState.ts` (state owner: send / newChat / recents) | `Read(full)` this turn | `e78b6bf9a2f8b2cb053a6e92b0130beffe7c293e` |
| 13 | ACTIVE (modify) — `src/theo/components/Sidebar.tsx` (Recents region; VA-T1) | `Read(full)` this turn | `094366ed3a20eb6f1c7e54d9adaa261a35f9bfd3` |
| 14 | ACTIVE (modify) — `src/theo/TheoSurface.tsx` (federated root; wires recents) | `Read(full)` this turn | `182fa0095b477f97cebe49091c9f7d1beacaf616` |
| 15 | Reference (reload render path; UNCHANGED) — `src/theo/components/ChatView.tsx` (L53 renders `<CitedText runs>`) | `Read(full)` this turn | `5f996792073761d8527641c7bf4dcd4a6fc3b4ee` |
| 16 | **Primary reference component** (VA-T5; UNCHANGED) — `src/theo/components/CitedText.tsx` (`{ runs: CitedRun[] }`) | `Read(offset=1, limit=40)` this turn | `7c4e566009a08a4a5f703ab0777eb45655516e52` |
| 17 | Reference (seed being replaced) — `src/theo/data.ts` (`RECENTS`) | `Read(full)` this turn | `80b7b7b35b5e56320fb3540e5f739addbca29517` |
| 18 | Deployed contract — `api/theo_message/index.js` (B3a request/response shape) | `Read(full)` this turn | `549f9a57f8c05ed99b2ce5ac1e586e28109d1deb` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table per §3–§5" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_PHASE_1A_FRONTEND_PLAN.md | Recents | "Real conversation history from `theo_conversations`" | §F-P1; §F-P5 TC-5/TC-6 — Recents now from `theo_list_conversations` |
| spec/THEO_API_SPEC.md | §2.1 | "List conversations → Recents" | §F-P3; §F-P5 TC-3/TC-4 — `theo_list_conversations` |
| spec/THEO_API_SPEC.md | §2.1 | "Get conversation → reload thread" | §F-P3; §F-P5 TC-3/TC-4 — `theo_get_conversation` reload |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 (1) | "The model call routes through a gateway abstraction" | §F-P2; the new reads route through the same `theoClient`/`gateway.live` abstraction |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 (3) | "1A state is React/in-memory" | §F-P6 guardrail — `conversationId`/`recentsList` are React state; no browser storage |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" | §F-P2; CCT rows = ALLOWED DELTA |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "A row missing any of the three locked surfaces is invalid (T20)." | §F-P5 — every CCT row carries prop/method interface + VA-id + contract dependency |

---

## F-P1 — Feature identification
**Microstep:** Theo Phase 1B Backend Plan **Tier B3 — Recents (`real history from theo_conversations`) + reloaded chat thread** (Rule Anchor 2/6), the frontend half. The backend (B3a turn-persistence; B3b `theo_list_conversations` / `theo_get_conversation`) is **deployed + golden-curl-verified** and documented in API Spec §2.1. This VEP wires the Theo surface to it:
1. **Echo `conversation_id`** — `useTheoState.send` submits the current thread id (when present) and stores the id the gateway returns, so each turn appends to the same server-side `theo_conversations` row instead of starting a new thread.
2. **Real Recents** — the Sidebar Recents list is populated from `theo_list_conversations` (newest-first), replacing the static `RECENTS` seed.
3. **Click-to-reload** — selecting a recent calls `theo_get_conversation` and rehydrates `messages`, including persisted `citations` rendered through the existing `CitedText` path (VA-T5).

**Real-in-1B FE wiring**; entirely behind the single `theoClient` boundary; faithful surface reproduction (no redesign).

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (Sidebar Recents region; chat surface) | The Recents list still renders the same row chrome (`.vo-row`, ellipsised title, hover) and the chat surface is unchanged. Only the **source** of the list changes (static seed → live `theo_list_conversations`) and rows become clickable to reload. Prop type widens `string[]` → `{ id; title }[]`; rendered output (a list of conversation titles) is pixel-identical. | VISUAL-AUTHORITY-MATCH (no rendered-surface change; Rule Anchors 7/8) |
| VA-T5 (inline citation rendering) | Reloaded assistant turns carry persisted `citations`; they render through the **unchanged** `CitedText` via `ChatView` L53 (`m.runs?.some(...) ? <CitedText runs={m.runs}/> : renderAssistant(...)`). No `CitedText`/`ChatView` change. | VISUAL-AUTHORITY-MATCH (existing render path reused) |
| Gateway / service abstraction (FE Governor §6.1; Golden §5) | Two read methods (`listConversations`, `getConversation`) and the `conversation_id` request/response fields are added behind the same `theoClient` → `gateway.live` abstraction; unconfigured → `gateway.mock`. The explicitly-allowed 1B delta. | ALLOWED DELTA (Rule Anchors 5/7) |

No `VISUAL-AUTHORITY-DEVIATION`. No browser→model call (the reads hit the Functions app with the user's Entra Bearer, same as `sendMessage`); the browser holds no model credential.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Standalone vault-theo dev harness** has no Functions backend / token provider. | **PROCEED** — `gateway.live.listConversations`/`getConversation`, when neither `VITE_FUNCTIONS_URL` nor a token provider is configured, delegate to `gateway.mock` (mirroring `sendMessage`). The mock surfaces the existing `RECENTS` seed as read-only summaries and returns an empty transcript on reload, so the standalone harness is visually unchanged. |
| **G-2** | **Reload citation granularity.** Persisted `citations` are a single flat array per assistant message (the gateway flattens per-block citations on write — `api/theo_message` L362). The live send path maps one `run` per text block; reload has only the flat array. | **PROCEED** — reload attaches the message's flat `citations` as a **single** `CitedRun` (`{ text: content, citations }`). Faithful to what is persisted; renders correctly through `CitedText`. Per-block split is a live-turn-only refinement, not persisted, and out of scope. |
| **G-3** | **Live data requires the Origin token provider.** Recents/reload return real rows only when Origin supplies `getAccessToken` (the same provider `sendMessage` uses). | **PROCEED** — already landed (B1.6 + the paired VO-AH token-provider wiring). No new dependency; absent a provider the surface stays on the mock (G-1). |

Verbatim: no other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting` change.

## F-P3 — Backend / contract grounding
All three contracts are documented in **API Spec §2.1** (Rule Anchors 3/4) and deployed + golden-curl-verified:
- **Persist turn (B3a):** `POST /api/theo_message` additionally accepts optional `conversation_id` (UUID), `app_key`, `app_context`; response `data` returns `conversation_id`. Request mapping adds those fields (omitted when absent); response mapping reads `data.conversation_id`.
- **List (B3b):** `GET /api/theo_list_conversations?limit=<1..200>` → `{ data: { conversations: [{ id, title, model, project_id, app_key, created_at, updated_at }] } }`, newest-first, RLS-scoped. Default no `?limit` (handler default 50); the client requests `limit=50`.
- **Get (B3b):** `GET /api/theo_get_conversation?conversationId=<uuid>` → `{ data: { conversation, messages: [{ id, seq, role, content, model, citations, created_at }] } }`, ordered by `seq`; `citations` is the persisted array (or `null`). 400 invalid id / 404 not-found / 403 not-owned — surfaced through the existing chat error state.
- **Transport/auth:** absolute `${VITE_FUNCTIONS_URL}/api/...` with `Authorization: Bearer <token>` from the injected provider (same pattern as `sendMessage`, B1.6). CORS `*` on the handlers; `credentials: "same-origin"`.

## F-P4 — Component reference grounding
**Service boundary:** `src/theo/services/theoClient.ts` (ACTIVE; single contracts module) — gains `listConversations`/`getConversation` passthroughs. **Transport:** `src/theo/services/gateway.live.ts` — `sendMessage` body/response extended; two GET readers added; **fallback:** `src/theo/services/gateway.mock.ts` gains the two readers (RECENTS-derived). **State owner:** `src/theo/useTheoState.ts`. **Recents view:** `src/theo/components/Sidebar.tsx` (VA-T1). **Mount:** `src/theo/TheoSurface.tsx`. **Reload render path (UNCHANGED):** `ChatView` L53 → `CitedText` (VA-T5; primary reference component, prop `{ runs: CitedRun[] }`). Governing authority for the new types = API Spec §2.1 + the deployed handler shapes (`api/theo_message`, B3b read handlers).

## F-P5 — Component Contract Table
Format: Golden Pack §3 (Rule Anchor 8). `no any`; required-before-optional; `on<Event>`; discriminated unions preserved. Every row: prop/method interface (full TS) + VA-id + data/contract dependency.

| # | Component (ownership; ACTIVE/NEW) | Prop / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `types.ts` (Theo surface; **ACTIVE**, modify — contract types) | `interface GatewayRequest { model: string; max_tokens: number; system: string; messages: Message[]; conversation_id?: string; app_key?: string \| null; app_context?: Record<string, unknown> \| null }` · `interface GatewayResponse { content: { type: string; text?: string; citations?: { url?: string; title?: string; cited_text?: string }[] }[]; conversation_id?: string }` · NEW `interface ConversationSummary { id: string; title: string; model: string \| null; project_id: string \| null; app_key: string \| null; created_at: string; updated_at: string }` · NEW `interface PersistedMessage { id: string; seq: number; role: Role; content: string; model: string \| null; citations: { url?: string; title?: string; cited_text?: string }[] \| null; created_at: string }` · NEW `interface ConversationDetail { conversation: ConversationSummary & { app_context?: Record<string, unknown> \| null }; messages: PersistedMessage[] }`. Existing types unchanged. | VA-T1 (no surface) | API Spec §2.1 persist/list/get rows | PROCEED |
| TC-2 | `gateway.mock` (Theo surface; **ACTIVE**, modify — unconfigured fallback) | Adds two readers; `sendMessage` unchanged. `listConversations(limit?: number): Promise<ConversationSummary[]>` → maps `RECENTS` (imported from `../data`) to read-only summaries (`id: \`mock-\${i}\``, empty timestamps), sliced to `limit ?? 50`. `getConversation(id: string): Promise<ConversationDetail>` → `{ conversation: { id, title: "Mock conversation", model: null, project_id: null, app_key: null, created_at: "", updated_at: "", app_context: null }, messages: [] }`. | VA-T1 (standalone Recents seed; unchanged) | mocked-contract (1A fallback; declared) | PROCEED |
| TC-3 | `gateway.live` (Theo surface; **ACTIVE**, modify — live transport) | `sendMessage(req: GatewayRequest): Promise<GatewayResponse>` — body adds `...(req.conversation_id ? { conversation_id: req.conversation_id } : {})`, `...(req.app_key != null ? { app_key: req.app_key } : {})`, `...(req.app_context != null ? { app_context: req.app_context } : {})`; returns `{ content, conversation_id: typeof json?.data?.conversation_id === "string" ? json.data.conversation_id : undefined }`. NEW `listConversations(limit?: number): Promise<ConversationSummary[]>` — unconfigured (`!apiBase && !tokenProvider`) → `mockList(limit)`; else `GET \`${apiBase}/api/theo_list_conversations${limit != null ? \`?limit=${limit}\` : ""}\`` with Bearer; on `!res.ok` throw `Error(json?.error?.message ?? ...)`; return `Array.isArray(json?.data?.conversations) ? json.data.conversations : []`. NEW `getConversation(id: string): Promise<ConversationDetail>` — unconfigured → `mockGet(id)`; else `GET \`${apiBase}/api/theo_get_conversation?conversationId=${encodeURIComponent(id)}\`` with Bearer; throw on `!res.ok` / missing `data.conversation`/`data.messages`; return `json.data`. No `any` (`json` narrowed per call). | VA-T1 (no surface) | API Spec §2.1 list/get; HF-T2 read handlers (DEPLOYED) | PROCEED |
| TC-4 | `theoClient` (Theo surface; **ACTIVE**, modify — service boundary) | Adds two passthroughs; all existing methods unchanged. `listConversations(limit?: number): Promise<ConversationSummary[]> { return gatewayList(limit); }` · `getConversation(id: string): Promise<ConversationDetail> { return gatewayGet(id); }` (imported from `./gateway.live`). | VA-T1 (no surface) | API Spec §2.1 list/get | PROCEED |
| TC-5 | `useTheoState` (Theo surface; **ACTIVE**, modify — state owner) | Adds `const [conversationId, setConversationId] = useState<string \| null>(null)` and `const [recentsList, setRecentsList] = useState<ConversationSummary[]>([])`. `recents` = `recentsList.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))`. `loadRecents` = `useCallback(async () => { try { setRecentsList(await theoClient.listConversations(50)); } catch { /* keep current */ } }, [])`. `send`: request adds `...(conversationId ? { conversation_id: conversationId } : {})`, `app_key: appContext.app_key`, `app_context: appContext.app_context`; on success `if (res.conversation_id) setConversationId(res.conversation_id)` then `void loadRecents()`. `newChat`/`startInProject` also `setConversationId(null)`. NEW `async function selectRecent(id: string)`: clears error/view, `const d = await theoClient.getConversation(id)`, maps `d.messages` → `Message[]` (assistant rows with non-empty `citations` → `{ role:"assistant", content, runs:[{ text: content, citations: cites.map((c)=>({ url: c.url ?? "", title: c.title ?? "", cited_text: c.cited_text })) }] }`; else `{ role, content }`), `setMessages(msgs); setConversationId(id)`; on throw `setError("Couldn't load that conversation.")`. Returns add `recents` (now `ConversationSummary[]`), `selectRecent`, `loadRecents`. (`useCallback` added to the React import; `RECENTS` import dropped.) | VA-T1 (Recents + chat surface) | API Spec §2.1 persist/list/get | PROCEED |
| TC-6 | `Sidebar` (Theo surface; **ACTIVE**, modify — VA-T1 Recents region) | `interface SidebarProps { collapsed: boolean; onToggleCollapse: () => void; view: View; onNavigate: (v: View) => void; nav: NavItem[]; search: string; onSearch: (s: string) => void; recents: { id: string; title: string }[]; onSelectRecent: (id: string) => void; onNewChat: () => void; workspaceName: string; productName: string; fluid?: boolean }`. Only `recents` (was `string[]`) and `onSelectRecent` (was `(r: string) => void`) change. Render: `recents.map((c) => (<div key={c.id} className="vo-row" onClick={() => onSelectRecent(c.id)} style={...unchanged}>{c.title}</div>))`; empty-state row unchanged. | VA-T1 (sidebar L297–328; rendered output identical) | consumes `theo_list_conversations` summaries via state | PROCEED |
| TC-7 | `TheoSurface` (Theo surface; **ACTIVE**, modify — federated root) | Props unchanged: `interface TheoSurfaceProps { appContext?: AppContext; navSlot?: HTMLElement \| null; mainSlot?: HTMLElement \| null; getAccessToken?: () => Promise<string \| null> }`. Destructures `loadRecents` from `t`. The existing configure effect gains a recents load: `useEffect(() => { theoClient.configureGateway({ getAccessToken: getAccessToken ?? null }); void loadRecents(); }, [getAccessToken, loadRecents])` (`loadRecents` is `useCallback`-stable, so the effect runs on mount + token change only). `Sidebar` wiring updates to `recents={t.recents} onSelectRecent={t.selectRecent}` (was a no-op `() => t.go("chats")`). No render-branch / layout change. | VA-T1 (chat + sidebar; unchanged) | via `theoClient` (HF-T2 DEPLOYED) | PROCEED |

**Infra:** consumes the already-baked `VITE_FUNCTIONS_URL`. No `vite.config`/dependency change. `ChatView.tsx`, `CitedText.tsx`, `TheoMain.tsx`, `data.ts` (`RECENTS` retained for the mock fallback) are **unchanged**.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `c2027c9c`: `types.ts` (add fields + 3 types), `gateway.mock.ts` (2 readers), `gateway.live.ts` (send body/response + 2 readers), `theoClient.ts` (2 passthroughs), `useTheoState.ts` (conversationId + recents state, send/newChat/selectRecent/loadRecents), `Sidebar.tsx` (recents prop + click), `TheoSurface.tsx` (load recents + wire selectRecent). Guardrails (Rule Anchors 5/6): gateway abstraction preserved (reads route through `theoClient`/`gateway.live`); no browser→model call (user Bearer only); **no `localStorage`/`sessionStorage`** (`conversationId`/`recentsList` are React state); no Tailwind; no `reporting_*`/`corporate-reporting` change. Unchanged-but-relied-on: `ChatView` L53 (reload citation render), `CitedText` (VA-T5).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present (G-1/G-2/G-3 all PROCEED); CCT locked (7 ACTIVE modify rows, each with full prop/method interface + VA-id + contract dependency). No implementation begun in this plan-only pack. On Codex APPROVAL, Pass 3 commits the seven files (verified `tsc`/`build` green) and Walter redeploys the Theo SWA → **durable multi-turn chats with real Recents + click-to-reload (incl. citations) inside Origin** (Walter SWA acceptance = Visual Acceptance Evidence).

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B3b-FE-Durable-Chat-Wiring-Pass-1-VEP/Theo_1B_B3b_FE_Durable_Chat_Wiring_VEP.md" --repo-root .
PASS  Codex Governance/Theo-1B-B3b-FE-Durable-Chat-Wiring-Pass-1-VEP/Theo_1B_B3b_FE_Durable_Chat_Wiring_VEP.md
exit code: 0
```
(Codex re-runs the same command per its §1A hard gates.)

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B3b Frontend Durable-Chat Wiring Pass-1 Frontend VEP (plan only).*
