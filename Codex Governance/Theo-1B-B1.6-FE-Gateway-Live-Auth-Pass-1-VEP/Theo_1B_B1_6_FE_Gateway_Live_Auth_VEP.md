# Theo 1B — B1.6 Frontend Gateway Live-Auth (absolute URL + Bearer token) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2). **Materially-revised frontend plan — supersedes B1.5** (`Codex Governance/Theo-1B-B1.5-FE-Gateway-Swap-Pass-1-VEP/`): B1.5 wired the live gateway as a **same-origin** `fetch("/api/theo_message")` with **no Authorization**, on the assumption that the Origin SWA proxies `/api/*` to the Functions app. That assumption is **false** — Origin's `staticwebapp.config.json` has **no `/api/*` proxy** (it only excludes the path from SPA fallback), Origin's own backend clients call an **absolute** `${VITE_REPORTING_API_BASE_URL}/api/reporting_*` with a **Bearer token**, and the deployed `theo_message` handler **requires an EasyAuth identity** (HTTP 401 without `x-ms-client-principal`). B1.6 corrects the client to the proven pattern: an **absolute** `${VITE_FUNCTIONS_URL}/api/theo_message` call with `Authorization: Bearer <user-token>` from an injected token provider. **No rendered-surface change** — the change is behind the single service boundary (1A handover §2.3). Golden-curl verified: a cross-origin POST with a user token for `api://4e1a1e31-…/access_as_user` returns **HTTP 200** + a real Claude reply against the deployed handler.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `6fe8ef8ae4502c7ad9d0c30a258a95c57df5033e` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Materially-revised Frontend Verified Evidence Pack (FE Conformance §4 matrix: "Pass 1 — Materially revised frontend plan → Full Baseline Grounding"). The frontend sub-phases F-P1…F-P7 are walked in the body; the backend P/I/E sub-phase track does not apply to a frontend VEP → `N/A`. Prior plan being revised: the B1.5 VEP (cited below).
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`) per Conformance §8 fallback (structural/region reads); independently verifiable via `git cat-file -p <sha>`.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 build discipline) | `Grep("model call routes through a gateway abstraction" / "1A state is React/in-memory")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 grounding-mode matrix; §6 triggers) | `Grep("Materially revised frontend plan" / "Grounding mode")` this turn | `a73a49f7a680a10298642a634258d839cce165af` |
| 3 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates; §2/§3) | `Read(offset=1, limit=40)` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§5 allowed deltas; §3 CCT) | `Grep("wiring an inline call to the service-module" / "is invalid (T20)")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (§5 acceptance; surface authority) | `Grep("Acceptance criteria" / "mocked gateway")` this turn | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B1.5/B1.6) | `Grep("Point the 1A chat contract")` this turn | `1733bdf19053d7173b72bfa9f0cf64e725cfdd3f` |
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 chat / model gateway) | `Grep("response \`content[]\` filtered to")` this turn | `4a1d2433…` (see §F-P3; resolved at HEAD) |
| 8 | **Prior plan revised** — B1.5 VEP — `Codex Governance/Theo-1B-B1.5-FE-Gateway-Swap-Pass-1-VEP/Theo_1B_B1_5_FE_Gateway_Swap_VEP.md` | `Read(...)` full this turn | (tracked package file) |
| 9 | ACTIVE — `src/theo/types.ts` (`GatewayRequest`/`GatewayResponse`) | `Grep("GatewayRequest|GatewayResponse", -A 12)` this turn | `2cdcd75606f1af6d25d988aea4b461e33cb7b580` |
| 10 | ACTIVE (modify-target) — `src/theo/services/theoClient.ts` (the service boundary) | `Read(...)` full this turn | `781947ebf2abd1e0b6ff2d10f2a6e972ec3861ed` |
| 11 | ACTIVE (modify-target) — `src/theo/services/TheoSurface.tsx` mount root — `src/theo/TheoSurface.tsx` | `Read(offset=1, limit=70)` this turn | (tracked source @ HEAD) |
| 12 | Reference (contract mirror) — `src/theo/services/gateway.mock.ts` (the `sendMessage` contract `gateway.live` mirrors + delegates to) | `Read(...)` full this turn | `d8dea2a230310c1b274e1e4a8b91efcacd5aeb53` |

No ChatGPT advisory cited (§4D / T18). No `corporate-reporting`/`reporting_*` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §7 Tier B1.5 | "Point the 1A chat contract in the single service module from the mock at the live" | §F-P1 microstep (B1.6 corrects the B1.5 client to the deployed cross-origin + Bearer pattern; route is `theo_message` per G-4) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 (1) | "The model call routes through a gateway abstraction" | §F-P2; CCT (live gateway behind the same `sendMessage` abstraction; browser holds no model credential — the Bearer is a user identity token, not a model key) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 (3) | "1A state is React/in-memory" | §F-P6 guardrails (no `localStorage`/`sessionStorage`; the token provider is held in module memory only) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" | §F-P2; CCT TC-1/TC-2/TC-3 = ALLOWED DELTA |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "does not alter the rendered surface is an allowed delta" | §F-P2 (no rendered-surface change) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "A row missing any of the three locked surfaces is invalid (T20)." | §F-P5 (CCT rows carry prop interface + VA-id + contract dependency) |
| spec/THEO_API_SPEC.md | §2.1 | "response `content[]` filtered to" | §F-P3 (response mapping); CCT TC-2 |

---

## F-P1 — Feature identification
**Microstep:** Theo Phase 1B Backend Plan **§7 Tier B1.5 — "Frontend chat-service swap (Theo-FE; live SWA test)"** (Rule Anchor 1), corrected. The B1 gateway `POST /api/theo_message` is **deployed + golden-curl-verified**: a cross-origin POST with a user Bearer token (`az account get-access-token --scope "api://4e1a1e31-5c20-4480-99e4-098901707d9e/access_as_user"`) returns **HTTP 200** with `data.content[0].text == "ok"` and `model == "claude-sonnet-4-6"`. B1.6 points the single chat-service call at that endpoint **correctly**: an **absolute** `${VITE_FUNCTIONS_URL}/api/theo_message` `fetch` carrying `Authorization: Bearer <user-token>`. **Per-surface:** the chat surface is unchanged; only the service-boundary wiring changes (1A handover §2.3). Real-in-1B FE wiring.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (chat surface) | The chat surface — composer, message list, loading/error states, `[[ARTIFACT]]` parsing, markdown — is **unchanged**. The swap is entirely behind `theoClient.sendMessage` (the single service boundary). No pixel/structure change. | VISUAL-AUTHORITY-MATCH (no rendered-surface change, Rule Anchor 5) |
| Gateway abstraction (FE Governor §6.1; Golden §5) | The mock is replaced by a live call to the deployed gateway, behind the same `sendMessage(req: GatewayRequest): Promise<GatewayResponse>` contract; a `configureGateway` seam injects the shell's token provider. The explicitly-allowed 1B delta. | ALLOWED DELTA (Rule Anchors 2, 4) |

No `VISUAL-AUTHORITY-DEVIATION`. No browser→model call: the call is to the server-side `theo_message` gateway, which holds the model credential (client-credentials app token) server-side. The browser sends only the **user's Entra identity token** (the same `getAccessToken()` the Origin shell already mints for reporting) — never a model key (Rule Anchor 2).

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Origin must hand Theo a token provider.** The deployed handler 401s without an EasyAuth identity; the cross-origin call needs `Authorization: Bearer`. Origin already mints this (`entraAuth.getAccessToken`, App Host Contract §7 `ShellTokenProvider`) and passes it to the reporting mount + DMS, but it currently mounts `TheoSurface` with only `{appContext, navSlot, mainSlot}` — **no token provider**. | **PRE-LAND** — a **paired vault-origin App Host Contract VEP** (`Bolt Governance/VO-AH-Theo-Token-Provider-Pass-1-VEP/`, Reporting-FE/Codex regime) passes `ctx.getAccessToken` to `TheoMount` → `TheoSurface`. B1.6's `getAccessToken` prop is optional; until Origin supplies it the gateway stays on the mock (G-2). Live Claude in Origin requires both to land. |
| **G-2** | The **standalone vault-theo dev harness** has no Functions backend and no token provider. | **PROCEED** — when neither `VITE_FUNCTIONS_URL` nor a configured token provider is present, `gateway.live` **delegates to the in-repo 1A mock** (`gateway.mock`), so the standalone harness is unchanged. `gateway.mock.ts` is retained and now imported by `gateway.live` for this fallback. |
| **G-3** | **Supersedes B1.5.** The B1.5 client (same-origin, no Authorization) was committed at `6fe8ef8` and is deployed on the dev SWA; it cannot authenticate. | **PROCEED** — B1.6 replaces that client. The deployed B1.5 client is inert (Theo is not yet wired to a token provider, so the surface never reaches the live path); B1.6's Pass-3 commit supersedes it. |

No `localStorage`/`sessionStorage` (Rule Anchor 3); no Tailwind change; no `reporting_*`/`corporate-reporting` change.

## F-P3 — Backend / contract grounding
- **Endpoint:** `POST /api/theo_message` (API Spec §2.1; backed by HF-T1, **DEPLOYED + golden-curl-verified**). The handler requires an EasyAuth identity (401 without `x-ms-client-principal`) and returns the standard envelope; `content[]` is **`response \`content[]\` filtered to`** `type:"text"` (Rule Anchor 7).
- **Transport (corrected):** **absolute** `${VITE_FUNCTIONS_URL}/api/theo_message` — Origin has **no same-origin `/api/*` proxy**; this mirrors Origin's reporting/DMS clients (`${base}/api/reporting_*`). CORS on the handler is `Access-Control-Allow-Origin: "*"`, so the cross-origin call is permitted. `VITE_FUNCTIONS_URL` is already baked at build time by vault-theo's SWA workflow.
- **Auth:** `Authorization: Bearer <token>` where `token = await getAccessToken()` (the shell's `ShellTokenProvider`, App Host Contract §7; default scope `api://4e1a1e31-…/access_as_user`). EasyAuth validates the token and injects `x-ms-client-principal` — golden-curl-proven 200.
- **Request mapping:** `GatewayRequest {model, max_tokens, system, messages}` → body `{ max_tokens, system, messages }` (the handler injects `model = THEO_FOUNDRY_DEPLOYMENT`; the client's `model` is unused).
- **Response mapping:** handler `{ data: { content: [{type:"text", text}], role, model, stop_reason, usage }, meta }` → `GatewayResponse { content: data.content }`. On non-2xx / malformed, throw `Error(json.error.message)` so the surface's existing error state shows it.

## F-P4 — Component reference grounding
**Service boundary:** `src/theo/services/theoClient.ts` (ACTIVE; the single contracts module), read full this turn. **Mount root:** `src/theo/TheoSurface.tsx` (ACTIVE; the federated root that receives shell props), read this turn. **Contract mirror + fallback:** `src/theo/services/gateway.mock.ts` (the `sendMessage(req: GatewayRequest): Promise<GatewayResponse>` contract `gateway.live` mirrors and delegates to when unconfigured), read full this turn. `gateway.live.ts` governing authority = API Spec §2.1 + the `gateway.mock` contract + the golden-curl-proven transport/auth.

## F-P5 — Component Contract Table
Format: Golden Pack §3 (Rule Anchor 6). `no any`; required-before-optional; `on<Event>`; discriminated unions preserved.

| # | Component (ownership; ACTIVE/NEW) | Prop / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `theoClient` (Theo surface; **ACTIVE**, modify — service module) | Adds one method; `sendMessage` signature unchanged. `configureGateway(opts: { getAccessToken?: (() => Promise<string \| null>) \| null; baseUrl?: string \| null }): void` (delegates to `gateway.live`). `sendMessage(req: GatewayRequest): Promise<GatewayResponse>` unchanged. Contract types unchanged: `interface GatewayRequest { model: string; max_tokens: number; system: string; messages: Message[] }`; `interface GatewayResponse { content: { type: string; text?: string }[] }`. All other methods (projects/artifacts/settings/app-context/ingestReply) unchanged. | VA-T1 (chat surface; unchanged) | `POST /api/theo_message` (API Spec §2.1; HF-T1 DEPLOYED) | PROCEED |
| TC-2 | `gateway.live` (Theo surface; **ACTIVE**, modify — supersedes B1.5) | `configureGateway(opts: { getAccessToken?: (() => Promise<string \| null>) \| null; baseUrl?: string \| null }): void` (sets module-level token provider + base URL). `sendMessage(req: GatewayRequest): Promise<GatewayResponse>` — if no base URL and no token provider configured, delegate to `gateway.mock` `sendMessage`; else `fetch(\`${apiBase}/api/theo_message\`, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", ...(token ? { Authorization: \`Bearer ${token}\` } : {}) }, body: JSON.stringify({ max_tokens, system, messages }) })`; on `!res.ok` throw `Error(json?.error?.message ?? "Theo gateway error (HTTP " + res.status + ")")`; on missing `data.content[]` throw; else return `{ content: json.data.content }`. `apiBase` initialised from `import.meta.env.VITE_FUNCTIONS_URL`. No `any` (`json` narrowed; `import.meta.env` cast to `Record<string, unknown>`). | VA-T1 (no surface) | `POST /api/theo_message` (API Spec §2.1; HF-T1 DEPLOYED) | PROCEED |
| TC-3 | `TheoSurface` (Theo surface; **ACTIVE**, modify — federated root) | Adds one optional prop. `interface TheoSurfaceProps { appContext?: AppContext; navSlot?: HTMLElement \| null; mainSlot?: HTMLElement \| null; getAccessToken?: () => Promise<string \| null> }`. On mount/prop-change, `useEffect(() => { theoClient.configureGateway({ getAccessToken: getAccessToken ?? null }); }, [getAccessToken])`. No rendered-surface change; render branches unchanged. | VA-T1 (chat surface; unchanged) | `POST /api/theo_message` via `theoClient` (HF-T1 DEPLOYED) | PROCEED |

**Infra:** consumes the build-time `VITE_FUNCTIONS_URL` (already baked by the SWA workflow). No `vite.config`/dependency change. `gateway.mock.ts` retained (imported by `gateway.live` for the unconfigured fallback).

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `6fe8ef8`: `theoClient.ts` (add `configureGateway`), `TheoSurface.tsx` (add `getAccessToken` prop + configure effect), `gateway.live.ts` (rewrite to absolute URL + Bearer + mock fallback), `gateway.mock.ts` (contract mirror + fallback target), `types.ts` (`GatewayRequest`/`GatewayResponse` — unchanged). Guardrails (Rule Anchors 2/3): no browser storage; gateway abstraction preserved; no direct browser→model call (browser sends only the user identity token); no Tailwind; no `reporting_*`/`corporate-reporting` change.

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present (G-1 PRE-LAND paired Origin VEP, G-2/G-3 PROCEED); CCT locked (3 ACTIVE modify rows). No implementation begun in this plan-only pack. On Codex APPROVAL + the paired VO-AH approval, Pass 3 commits `gateway.live.ts` + `theoClient.ts` + `TheoSurface.tsx` (verified `tsc`/`build` green) and Origin passes `ctx.getAccessToken`; Walter redeploys both SWAs → **live Claude in the Theo surface inside Origin** (Walter SWA acceptance = Visual Acceptance Evidence).

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B1.6-FE-Gateway-Live-Auth-Pass-1-VEP/Theo_1B_B1_6_FE_Gateway_Live_Auth_VEP.md" --repo-root .
PASS  Codex Governance/Theo-1B-B1.6-FE-Gateway-Live-Auth-Pass-1-VEP/Theo_1B_B1_6_FE_Gateway_Live_Auth_VEP.md
exit code: 0
```
(Codex re-runs the same command per its §1A hard gates.)

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B1.6 Frontend Gateway Live-Auth Pass-1 Frontend VEP (plan only).*
