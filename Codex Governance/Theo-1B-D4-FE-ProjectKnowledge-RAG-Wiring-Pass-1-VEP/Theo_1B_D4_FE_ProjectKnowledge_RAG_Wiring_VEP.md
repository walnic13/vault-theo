# Theo 1B — D4 Frontend Project-Knowledge RAG Wiring (send `project_id` + retire client-side knowledge concatenation) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) to `development` and the Theo dev SWA serves it (Walter accepts). **Microstep:** wire the FE to the **deployed, golden-curl-verified** Phase D RAG backend. Two behaviours behind the existing gateway boundary: (1) **send `project_id`** — `useTheoState.send` includes the active `chatProject.id` in the `theo_message_stream` request so D3 retrieves the project's indexed knowledge server-side; (2) **retire the client-side knowledge concatenation** — `buildSystemPrompt` no longer inlines all project knowledge (+ the interim `PER_ITEM_MAX=6000` cap), because D1/D2a index knowledge on ingest and D3 injects the query-relevant items server-side. No rendered-surface change. **The one-time backfill of pre-existing knowledge rows is a separate follow-on (F-P2.5 G-3).**

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `f7f47abcec3f1fb1bad60b841d6eebaaee923393` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix). Real-in-1B FE wiring. Frontend sub-phases F-P1…F-P7 walked; the backend P/I/E track does not apply → `N/A`. The registered VA-T1 artifact is read this turn: `frontend/theo-frontend-reference.jsx` (the project chip + chat surface — no visual change here). The consumed contract (`theo_message_stream` accepting `project_id`; D3 retrieval seam) is **deployed + golden-curl-verified this session** (D3 GC-D3a..e; D2a GC-D2a-2 end-to-end retrieval), and **API Spec §2.1 documents the `project_id` request field** (the §2.1 Role-C applied at `b29e2eb`). The four proposed files were applied to `src` this turn and pass `npm run typecheck` (`tsc --noEmit`, exit 0) + `eslint` (exit 0; one **pre-existing** `react-hooks/exhaustive-deps` *warning* at `useTheoState.ts:226`, unchanged by this VEP) + `npm run build` (vite; TheoSurface 297.43 kB / 86.65 kB gzip, exit 0); `src` reverted so the package carries only `proposed-src/`. **Disclosed dev-harness fold (F-P2.5 G-5):** a pre-existing `prefer-const` **error** at `useTheoState.ts:478` (`let think` — read once, never reassigned; unrelated to D4) is folded to `const think` so the package is eslint-clean.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 gateway/state) | `Grep` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5; §4 matrix; §4A; §4B) | `Read` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 primary ref; §3 CCT; §5 deltas) | `Read` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | cited (surface authority) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_message_stream` — accepts additive `project_id`) | `Grep` this turn | `c99a66f39b4ec03644701c266e49aaf2bf52c2ed` |
| 7 | ACTIVE (modify) — `src/theo/types.ts` (`GatewayRequest`) | `Read(full)` this turn | `72af59e50baf9c575250137e2635675fdd6d56e4` |
| 8 | ACTIVE (modify) — `src/theo/useTheoState.ts` (state owner: send request) | `Read(full)` this turn | `8692f1588cf35e053763f728f1bf53c109064176` |
| 9 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` (live transport: `sendMessageStream` body) | `Read(full)` this turn | `6e26e17aa3f86820e10666a52c6de3089ee81948` |
| 10 | ACTIVE (modify) — `src/theo/lib/prompt.ts` (`buildSystemPrompt`) | `Read(full)` this turn | `2d16076d4eda1f049952397964694abb430039ee` |
| 11 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (project chip + chat surface) | `Grep`/read this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`. No Tailwind/CSS-in-JS.

---

## Rule Anchor Table
| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Full Baseline Grounding" | GCR grounding mode (Pass 1 FE VEP) |
| spec/THEO_API_SPEC.md | §2.1 | "same request shape" | §F-P3 — `theo_message_stream` accepts the additive `project_id` (D3; §2.1 Role-C applied b29e2eb) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "gateway abstraction" | §F-P4 — `project_id` flows through the existing gateway body; no new browser→model call |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT rows carry interface + VA-id + contract dependency |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "service-module/gateway abstraction" | §F-P2 — the gateway/state deltas are ALLOWED DELTAs |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "does not alter the rendered surface" | §F-P2 — system-prompt assembly change is invisible (VISUAL-AUTHORITY-MATCH) |

---

## F-P1 — Feature identification
**Microstep:** Theo Phase 1B **D4 (FE)** — project-knowledge RAG wiring, the frontend half of Phase D. The backend (D1 file-index, D2a text-index, D2b de-index, D3 retrieval) is deployed + golden-verified this session. This VEP:
1. **Send `project_id`** — `useTheoState.send` adds `...(chatProject ? { project_id: chatProject.id } : {})` to the request object. It flows through `theoClient.sendMessageStream` → `gateway.live.sendMessageStream`, which adds `...(req.project_id != null ? { project_id: req.project_id } : {})` to the `theo_message_stream` body. D3 then resolves the active project and injects the query-relevant, project-scoped knowledge server-side. (`GatewayRequest` gains an optional `project_id?: string | null`.)
2. **Retire the client-side knowledge concatenation** — `buildSystemPrompt` drops the `if (project.knowledge.length) { … PER_ITEM_MAX=6000 … }` block. Project **name + instructions** stay client-composed (D3 retrieves knowledge, not instructions). This prevents double-injection now that D3 is live and lets large knowledge sets scale (the whole point of Phase D — beyond the interim cap).

**Out of scope:** the one-time **backfill** of pre-existing `theo_project_knowledge` rows (created before D1/D2a) is a separate data operation (F-P2.5 G-3), not FE code. `project_id` is sent ONLY on the streaming path (`theo_message_stream`, D3); the non-streaming `theo_message` fallback does not do project RAG (unchanged).

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (chat surface + project chip) | VA-T1 read this turn: the active-project chip + chat surface are existing chrome driven by `chatProject`. D4 changes only (a) what is put in the `theo_message_stream` request body (`project_id`) and (b) how `buildSystemPrompt` assembles the system string (knowledge no longer concatenated). Both are invisible to the rendered surface — no component renders differently; the chip, composer, and message list are byte-unchanged. | VISUAL-AUTHORITY-MATCH (no rendered-surface change) |
| Gateway / service abstraction (FE Governor §6; Golden §5) | One optional field (`project_id`) added to `GatewayRequest` + the stream body; the send path threads `chatProject.id`. The explicitly-allowed gateway-wiring delta. | ALLOWED DELTA |
| System-prompt assembly (`lib/prompt.ts`) | The knowledge-concatenation block is removed; project name/instructions retained. Behavioural (what text is sent to the model), not visual. | ALLOWED DELTA |

No `VISUAL-AUTHORITY-DEVIATION`. No component render change (`ChatView`/`ProjectDetail`/`TheoMain`/`ProjectsView` untouched). No browser→model call (the stream still hits func-stream with the user's Entra Bearer).

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Standalone dev harness** (no live backend) → mock path. With the client concatenation retired, a pure-mock project chat no longer shows project knowledge in the prompt (mock has no RAG). | **PROCEED** — harness-only. Production uses the live func-stream + D3 RAG (verified). The mock is a dev convenience; project knowledge in mock was never authoritative. |
| **G-2** | **Behavioural change: all-knowledge → top-K relevance.** The retired block injected ALL knowledge (to the cap) every turn; D3 injects the query-relevant top-K. | **PROCEED (intended)** — this IS the Phase D upgrade: relevance retrieval that scales past the interim per-item cap. Verified end-to-end (D3 GC-D3a; D2a GC-D2a-2 — probe surfaced only via RAG). |
| **G-3** | **Backfill of pre-existing knowledge rows.** Rows created before D1/D2a deployed today are not yet in the `theo-project-knowledge` index; until backfilled, D3 cannot retrieve them (though the client concat that previously surfaced them is now removed). | **PRE-LAND / follow-on** — a one-time backfill (embed + upsert existing rows, keyed by their `knowledge_id`, idempotent) follows as a separate governed data op; it needs a read of `theo_project_knowledge` (no local RO SQL runner in vault-theo `.local`). Disclosed; NOT blocking this FE change (new adds index on ingest; D3 intersect keeps retrieval correct). |
| **G-4** | **`project_id` sent only on the stream path.** The non-streaming `theo_message` fallback (used when `streamBase` is unset) does not receive `project_id` and does not do project RAG. | **PROCEED (intended)** — D3 (project RAG) lives only in `theo_message_stream`; the non-stream fallback is a degraded dev path. Matches the backend (only theo_message_stream reads project_id). |
| **G-5** | **Pre-existing dev-harness lint fix folded.** `useTheoState.ts:478` `let think` (read once at :571, never reassigned) tripped `prefer-const` — pre-existing, unrelated to D4. | **PROCEED (disclosed fold)** — folded to `const think` (behaviour-neutral) so the package is eslint-clean, per FE Governor build-gate discipline. The pre-existing `exhaustive-deps` *warning* at :226 is left unchanged (warning, not error). |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting` change.

## F-P3 — Backend / contract grounding
- **`theo_message_stream`** (deployed; D3, DR-T11 `func-stream`): accepts the additive-optional `project_id` (UUID) request field; resolves the active project (explicit `project_id`, else the conversation's `theo_conversations.project_id`), retrieves query-relevant project knowledge from the `theo-project-knowledge` index (owner+project scoped, intersected with live DB rows), and injects it into the system prompt. **API Spec §2.1 documents `project_id`** (Role-C applied `b29e2eb`; present-but-invalid → 400). Verified this session: GC-D3a (retrieval), GC-D3e (malformed→400), GC-D2a-2 (end-to-end).
- **Transport/auth:** the existing `${streamBase}/api/theo_message_stream` POST with `Authorization: Bearer <token>` (unchanged); `project_id` is one more optional body field alongside `conversation_id`/`app_key`/`app_context`/`attachment_ids`.

## F-P4 — Component reference grounding
**PRIMARY REFERENCE:** the ACTIVE deployed FE modules themselves (structural mirror = their current form); the registered substrate `frontend/theo-frontend-reference.jsx` (VA-T1) is the surface authority (no surface change). **State owner:** `src/theo/useTheoState.ts` — `send` threads `chatProject.id` into the request (best-effort; omitted when no active project). **Transport:** `src/theo/services/gateway.live.ts` — `sendMessageStream` adds `project_id` to the stream body only. **Types:** `src/theo/types.ts` — `GatewayRequest.project_id?: string | null`. **Prompt assembly:** `src/theo/lib/prompt.ts` — `buildSystemPrompt` retires the knowledge concatenation. Governing authority = the deployed D3 seam + API Spec §2.1.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; every row: interface (full TS) + VA-id + contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Interface change (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `types.ts` (Theo surface; **ACTIVE**, modify) | `GatewayRequest` gains `project_id?: string \| null;` (additive optional; placed after `attachment_ids?: string[]`). No other member changes; `GatewayResponse`/`ConversationSummary`/`AppContext` unchanged. **Full literal `GatewayRequest` locked in §F-P5.1.** | VA-T1 (no surface) | API Spec §2.1 `theo_message_stream` (`project_id`) | PROCEED |
| TC-2 | `useTheoState` (Theo surface; **ACTIVE**, modify — state owner) | In `send`, the request object gains `...(chatProject ? { project_id: chatProject.id } : {})` (after the `attachment_ids` spread). `chatProject` is the existing held `Project \| null`. No signature/handler-name change. Plus the disclosed pre-existing fold `let think` → `const think` (behaviour-neutral). | VA-T1 (chat surface; unchanged render) | API Spec §2.1; D3 seam | PROCEED |
| TC-3 | `gateway.live` (Theo surface; **ACTIVE**, modify) | In `sendMessageStream`'s `theo_message_stream` body, add `...(req.project_id != null ? { project_id: req.project_id } : {})` (after the `attachment_ids` spread). **Stream path ONLY** — `sendMessage` (non-stream) is unchanged. Signature unchanged. **Full `sendMessageStream` signature + `StreamHandlers` interface locked in §F-P5.1.** | VA-T1 (no surface) | `theo_message_stream` (DEPLOYED D3) | PROCEED |
| TC-4 | `prompt.ts` (Theo surface; **ACTIVE**, modify) | `buildSystemPrompt(styleKey, custom, project, userName?, appKey?)` signature unchanged. Body: remove the `if (project.knowledge.length) { p += " Project knowledge…"; const PER_ITEM_MAX = 6000; project.knowledge.forEach(…) }` block; keep the project name + instructions line. Replaced with a comment recording that D1/D2a+D3 now inject knowledge server-side. `Project.knowledge` remains on the type (still rendered in `ProjectDetail`). | VA-T1 (no surface) | D3 seam (server-side knowledge injection) | PROCEED |

**Infra:** consumes the already-baked `VITE_STREAM_FUNCTIONS_URL`/config; no `vite.config`/dependency change. `theoClient.ts` is **unchanged** — `sendMessageStream` passes the typed `GatewayRequest` straight through, so widening the type carries `project_id` with no code change. `gateway.mock.ts` unchanged (optional field; mock ignores it). `ChatView.tsx`/`ProjectDetail.tsx`/`TheoMain.tsx` unchanged.

## F-P5.1 — Locked interface literals (T20 — full literal CCT surfaces)

**`GatewayRequest`** (`src/theo/types.ts`) — full literal AFTER this VEP (the only change is the additive final member `project_id?`):
```typescript
export interface GatewayRequest {
  model: string; max_tokens: number; system: string; messages: Message[];
  conversation_id?: string;                          // B3a: omit to start a new thread
  app_key?: string | null;                           // B3a: persisted on a new conversation
  app_context?: Record<string, unknown> | null;      // B3a: opaque anchor (jsonb)
  attachment_ids?: string[];                         // B8d: owner-scoped attachments to inject
  project_id?: string | null;                        // D4: active project for project-scoped knowledge RAG (theo_message_stream, D3)
}
```

**`sendMessageStream` signature** (`src/theo/services/gateway.live.ts`; and the identical passthrough in `theoClient.ts`) — UNCHANGED by this VEP:
```typescript
export async function sendMessageStream(req: GatewayRequest, handlers: StreamHandlers, opts?: { signal?: AbortSignal }): Promise<void>
```

**`StreamHandlers`** (`src/theo/services/gateway.live.ts`) — full literal, UNCHANGED by this VEP (locked as the consumed handler surface):
```typescript
export interface StreamHandlers {
  onText: (delta: string) => void;
  onThinking?: (delta: string) => void;
  onCitation?: (c: StreamCitation) => void;
  onMeta?: (meta: { conversation_id?: string; model?: string }) => void;
  onTool?: (t: { name: string; input: unknown }) => void;
  onToolResult?: (t: { name: string; ok: boolean }) => void;
  onExport?: (d: FileDownload) => void;
  onImage?: (img: InlineImage) => void;
  onVideo?: (v: InlineVideo) => void;
  onTokens?: (t: { tokens: number }) => void;
}
```
(Comments elided in the StreamHandlers literal for length; the member set + types are byte-exact to the deployed interface at `gateway.live.ts:901`. Only `GatewayRequest` changes this VEP — one additive optional member.)

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `f7f47ab`: `types.ts` (+`project_id`), `useTheoState.ts` (send +`project_id`; folded `const think`), `services/gateway.live.ts` (stream body +`project_id`), `lib/prompt.ts` (retire knowledge concat). Guardrails: gateway abstraction preserved; no browser→model call (user Bearer only); no `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`. Validated: `tsc --noEmit` exit 0, `eslint` exit 0 (pre-existing warning only), `vite build` exit 0; `src` reverted (package carries only `proposed-src/`).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present (G-1/G-2/G-4/G-5 PROCEED; G-3 PRE-LAND backfill follow-on); CCT locked (4 ACTIVE modify rows, each with full interface + VA-id + contract dependency). No implementation begun — but the four files were validated this turn (`tsc` + `eslint` exit 0 + `build` green, `src` reverted). On Codex APPROVAL, Pass 3 commits the four files to `development` (the Theo dev SWA serves it; Walter accepts) → **project chats send `project_id`, D3 injects query-relevant project knowledge, and the client no longer double-injects/caps it**. The one-time backfill (G-3) follows as a separate governed data op.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-D4-FE-ProjectKnowledge-RAG-Wiring-Pass-1-VEP/Theo_1B_D4_FE_ProjectKnowledge_RAG_Wiring_VEP.md" --repo-root .
PASS
```

*End of D4 Frontend Project-Knowledge RAG Wiring Pass-1 Frontend VEP (plan only).*
