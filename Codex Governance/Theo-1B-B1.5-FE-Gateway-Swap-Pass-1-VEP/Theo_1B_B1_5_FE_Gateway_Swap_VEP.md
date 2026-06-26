# Theo 1B — B1.5 Frontend Gateway Swap (mock → live `/api/theo_message`) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; no implementation begun (FE Governor §2). Sources from the **Theo Phase 1B Backend Plan §7 Tier B1.5** (gateway-first sequence): now that the B1 gateway (`POST /api/theo_message`) is deployed + golden-curl-verified (200, Claude replies), point the 1A chat service at it so Theo answers live in the Origin SWA. **No rendered-surface change** — the swap is behind the single service boundary (1A handover §2.3).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn-type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `966dafd94571a53b48d9f6dacfe1f71414f3e5ea` (vault-theo, `development`)
Grounding mode: Full Baseline Grounding (Conformance §4, Claude Code | Pass 1 — Frontend Verified Evidence Pack)
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`) per Conformance §8 fallback (structural/region reads); independently verifiable via `git cat-file -p <sha>`.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 build discipline) | `Read(...)` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4/§4A/§6) | `Read(...)` this turn | `a73a49f7a680a10298642a634258d839cce165af` |
| 3 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | `Read(...)` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§5 allowed deltas; §3 CCT) | `Read(...)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (§5 acceptance; surface authority) | `Read(...)` this turn | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B1.5) | `Read(...)` this turn | `1733bdf19053d7173b72bfa9f0cf64e725cfdd3f` |
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 chat / model gateway) | `Read(..., offset=1, limit=45)` this turn | `a524eefd859130f68561466e9535b2354871d97a` |
| 8 | §4B Visual Authority Registry (within #2) — VA-T1 | `Read(...)` this turn | (within `a73a49f7…`) |
| 9 | ACTIVE (modify-target) — `src/theo/types.ts` (`GatewayRequest`/`GatewayResponse`) | `Read(...)` this turn | `2cdcd75606f1af6d25d988aea4b461e33cb7b580` |
| 10 | ACTIVE (modify-target) — `src/theo/services/theoClient.ts` (the service boundary) | `Read(...)` full this turn | `781947ebf2abd1e0b6ff2d10f2a6e972ec3861ed` |
| 11 | Reference (contract mirror) — `src/theo/services/gateway.mock.ts` (the `sendMessage` contract `gateway.live` mirrors) | `Read(...)` full this turn | `d8dea2a230310c1b274e1e4a8b91efcacd5aeb53` |

No ChatGPT advisory cited (§4D / T18). No `corporate-reporting`/`reporting_*` change.

---

## RULE ANCHORS

| # | Source doc | Clause id | Verbatim clause text | Applied in output at |
| - | ---------- | --------- | -------------------- | -------------------- |
| 1 | Theo Phase 1B Backend Plan | §7 Tier B1.5 | "point the 1A chat contract in the single service module from the mock at the live `/api/theo_message` (mock→live swap, no surface change); redeploy" | §F-P1 microstep |
| 2 | Theo Golden Component Pack Standard | §5 | "wiring an inline call to the service-module/gateway abstraction; replacing in-memory stand-ins with the contracts module" | §F-P2; CCT TC-1/TC-2 = ALLOWED DELTA |
| 3 | Theo Golden Component Pack Standard | §5 | "a CSS / inline-style change that does not alter the rendered surface is an allowed delta" | §F-P2 (no rendered-surface change) |
| 4 | Theo API Spec | §2.1 | "response `content[]` filtered to" | §F-P3 (response mapping); CCT TC-2 |
| 5 | Claude Code Theo FE Governor Standard | §6 (3) | "No `localStorage` / `sessionStorage`; 1A state is React/in-memory." | §F-P6 guardrails |
| 6 | Claude Code Theo FE Governor Standard | §6 (1) | "The model call routes through a gateway abstraction" | §F-P2; CCT (live gateway behind the same abstraction) |
| 7 | Theo Golden Component Pack Standard | §3 | "A row missing any of the three locked surfaces is invalid (T20)." | §F-P5 (CCT rows) |

---

## F-P1 — Feature identification
**Microstep:** Theo Phase 1B Backend Plan **§7 Tier B1.5 — "Frontend chat-service swap (Theo-FE; live SWA test)"** (Rule Anchor 1). The B1 gateway `POST /api/theo_message` is **deployed + golden-curl-verified** (HTTP 200; `content[0].text == "ok"`; a real question answered). B1.5 swaps the single chat-service call from the in-repo mock to a live `fetch` of that endpoint so Theo answers with real Claude inside the Origin SWA. **Per-surface:** the chat surface is unchanged; only the service-boundary wiring changes (1A handover §2.3 "each mock swapped for a real call with no surface change"). Real-in-1B FE wiring.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (chat surface) | The chat surface — composer, message list, loading/error states, `[[ARTIFACT]]` parsing, markdown — is **unchanged**. The swap is entirely behind `theoClient.sendMessage` (the single service boundary). No pixel/structure change. | VISUAL-AUTHORITY-MATCH (no rendered-surface change, Rule Anchor 3) |
| Gateway abstraction (FE Governor §6.1; Golden §5) | The mocked gateway is replaced by a live call to the deployed gateway endpoint, behind the same `sendMessage(req: GatewayRequest): Promise<GatewayResponse>` contract — the explicitly-allowed 1B delta. | ALLOWED DELTA (Rule Anchors 2, 6) |

No `VISUAL-AUTHORITY-DEVIATION`. No browser→model call (the call is to the same-origin `/api/theo_message` gateway; the gateway holds the model credential server-side).

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | The **standalone vault-theo dev harness** has no `/api/theo_message` endpoint (that gateway is deployed to the Origin-linked Functions app), so the live call will error there. | **PROCEED** — the deployed **Origin SWA** is B1.5's target. The chat surface's existing `error` state surfaces a gateway failure (not masked by a silent mock fallback — errors stay visible). `gateway.mock.ts` is **retained in-repo** (no longer imported) for reference/regression; a later refinement may add an env-gated mock fallback for the standalone harness if desired. |
| **G-2** | The gateway returns text `content[]`; `[[ARTIFACT]]` markers inside the text are parsed client-side by the existing `ingestReply` (unchanged). | **PROCEED** — the live response shape (`data.content[]` text blocks) matches the mock contract; `ingestReply` already handles markers. |

No `localStorage`/`sessionStorage` (Rule Anchor 5); no Tailwind change; no `reporting_*`/`corporate-reporting` change.

## F-P3 — Backend / contract grounding
- **Endpoint:** `POST /api/theo_message` (API Spec §2.1; backed by HF-T1, **DEPLOYED + curl-verified** at vault-theo `966dafd`). Same-origin; the Origin SWA proxies `/api/*` to the Functions app and Easy Auth attaches identity (no token handling in the browser).
- **Request mapping:** `GatewayRequest {model, max_tokens, system, messages}` → body `{ max_tokens, system, messages }` (the handler injects the configured `model = THEO_FOUNDRY_DEPLOYMENT`; the client's `model` field is not relied on).
- **Response mapping:** handler `{ data: { content: [{type:"text", text}], role, model, stop_reason, usage }, meta }` → `GatewayResponse { content: data.content }` (Rule Anchor 4). On non-2xx / malformed, throw `Error(json.error.message)` so the surface's existing error state shows it.

## F-P4 — Component reference grounding
**Service boundary:** `src/theo/services/theoClient.ts` (ACTIVE; the single contracts module), read full this turn. **Contract mirror:** `src/theo/services/gateway.mock.ts` (the `sendMessage(req: GatewayRequest): Promise<GatewayResponse>` contract the new `gateway.live.ts` mirrors), read full this turn. `gateway.live.ts` is **`PRIMARY REFERENCE: GREENFIELD`** — governing authority = API Spec §2.1 + the `gateway.mock` contract it mirrors.

## F-P5 — Component Contract Table
Format: Golden Pack §3 (Rule Anchor 7). `no any`; required-before-optional; `on<Event>`; discriminated unions preserved.

| # | Component (ownership; ACTIVE/NEW) | Prop / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `theoClient` (Theo surface; **ACTIVE**, modify — service module) | `theoClient.sendMessage(req: GatewayRequest): Promise<GatewayResponse>` — **signature unchanged**; the only change is the import source `./gateway.mock` → `./gateway.live`. All other methods (projects/artifacts/settings/app-context/ingestReply) unchanged. `interface GatewayRequest { model: string; max_tokens: number; system: string; messages: Message[] }`; `interface GatewayResponse { content: { type: string; text?: string }[] }` | VA-T1 (chat surface; unchanged) | `POST /api/theo_message` (API Spec §2.1; HF-T1 DEPLOYED) | PROCEED |
| TC-2 | `gateway.live` (Theo surface; **NEW/GREENFIELD**) | `sendMessage(req: GatewayRequest): Promise<GatewayResponse>` — `fetch("/api/theo_message", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ max_tokens: req.max_tokens, system: req.system, messages: req.messages }) })`; on `!res.ok` or missing `data.content` throw `Error(json?.error?.message ?? "Model gateway error (" + res.status + ")")`; else return `{ content: json.data.content }`. No `any` (`json` narrowed before use). | VA-T1 (no surface) | `POST /api/theo_message` (API Spec §2.1; HF-T1 DEPLOYED) | PROCEED |

**Infra:** none. No `vite.config`/dependency/token change (same-origin fetch; Easy Auth server-side). `gateway.mock.ts` retained (unimported).

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `966dafd`: `theoClient.ts` (modify import + the one call), `types.ts` (`GatewayRequest`/`GatewayResponse` — unchanged), `gateway.mock.ts` (contract mirror). NEW: `gateway.live.ts`. Guardrails (Rule Anchor 5): no browser storage; gateway abstraction preserved; no direct browser→model call; no Tailwind; no `reporting_*`/`corporate-reporting` change.

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present; CCT locked (1 ACTIVE + 1 GREENFIELD). No implementation begun. On Codex APPROVAL, Pass 3 adds `gateway.live.ts` + repoints `theoClient`'s import, verified `tsc`/`build` green; Walter redeploys the Origin SWA → **live Claude in the Theo surface** (Walter SWA acceptance = Visual Acceptance Evidence).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B1.5 Frontend Gateway Swap Pass-1 Frontend VEP (plan only).*
