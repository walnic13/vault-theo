# Theo Phase 1A — Pass B (Theo-in-Origin Mount + App-Context) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend. Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Plan-only; no implementation begun (FE Governor §2). Re-authored against the landed mount authority (VA-T2 §3A, VA-T3 §4, Plan §3 Pass B + §5#8, VA-T4) — supersedes the earlier chip-only Pass B draft.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn-type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `c19d12a3699c345707858a9715787942084b4872` (vault-theo, `development`)
Grounding mode: Delta Grounding — Codex-rejection correction (Conformance §4 "Pass 1 — Codex-rejection correction / delta-evidence pack")
Delta scope (Conformance §3 rule 7): rejected prior artifact = this VEP at commit `fb2c14a` (PR #7); inbound Codex verdict = **REJECTED on T20** (CCT rows TC-5/TC-6 VA-id column = `n/a`); affected sections = CCT rows TC-5 and TC-6 (VA-id citations added), grounded this turn against VA-T3 §2.3/§2.4 + Golden Pack §3. All other rows, sub-phases, and grounding are unchanged from the Full-Baseline pack (carried forward).

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `Read(...)` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (§3 Pass B, §5#8) | `Read(...offset=33)` this turn | `19fbc7890f24e563252403cda76441a83a42ca73` |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.5 app-context; §2.1 chat) | `Read(...)` this turn | `a524eefd859130f68561466e9535b2354871d97a` |
| 4 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4B registry incl. VA-T4) | `Grep(VA-T4, ...)` this turn | `a73a49f7a680a10298642a634258d839cce165af` |
| 5 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | `Read(...)` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` | `Read(...)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 7 | §4B Visual Authority Registry (within #4) — VA-T1/T2/T3/T4 | `Grep(VA-T4, ...)` this turn | (within `a73a49f7…`) |
| 8 | VA-T2 Architecture — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §3A Origin Host & Mount Model | `Grep(## 3A. Origin Host, -A30)` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 9 | VA-T3 Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` §4 Origin-side additive work | `Grep(## 4. Origin-side, -A12)` this turn | `aad6396703b5a2b6d204986e5064504cec939895` |
| 10 | VA-T1 Reference Surface — `frontend/theo-frontend-reference.jsx` (chip L337; Sidebar L297–328) | regions read this session; blob captured this turn | `433f6236344f6e8bdbc49db85a53036427610fed`; sha256 `fe473eed…f2a` |
| 11 | Primary ref (active) — `src/theo/TheoShell.tsx` | `Read(...)` this turn | `aca1f1c64615e259727fdc8d2eeb400324571632` |
| 12 | Primary ref (active) — `src/theo/components/Sidebar.tsx` | `Read(...)` this turn | `8c8084bd11ababe0cf48213ddebb5ccdf9d7b522` |
| 13 | Primary ref (active) — `src/theo/types.ts` | `Read(...)` this turn | `65d0514d1769c2e48cb467f859e6d5373f3c21fe` |
| 14 | Modify-target (active) — `src/theo/useTheoState.ts` | blob captured this turn; content per Pass-A | `1f751e12d743c16d5f9a7d685e7242335832a32c` |
| 15 | Modify-target (active) — `src/theo/services/theoClient.ts` | blob captured this turn; content per Pass-A | `bd629b073e4a531254a9d9041c56c872b529c8b8` |
| 16 | Modify-target (active) — `vite.config.ts` (no federation today) | `Read(...)` this turn | `c39dec30d81103c9df52c575379dced18151a11e` |

Cross-repo note: the Origin-side hosting (App Host Contract §6A) is **vault-origin / Reporting-FE-regime** work, not authored here; it is the paired dependency in Gap G-1.

---

## RULE ANCHORS

| # | Source doc | Clause id | Verbatim clause text | Applied in output at |
| - | ---------- | --------- | -------------------- | -------------------- |
| 1 | Theo Phase 1A Frontend Plan | §3 Pass B | "decompose the Pass-A `TheoShell` into mountable nav + main surfaces and expose them as federated module(s)" | §F-P1; CCT TC-1/TC-2/TC-3 |
| 2 | Theo Phase 1A Frontend Plan | §5 #8 | "Theo is **mounted in the Origin shell** per architecture §3A: nav as a permanent collapsible 1/10 section ... main as the Origin 9/10 landing surface, an in-app right-hand Theo panel, via in-shell Module Federation (no iframe)." | §F-P1 acceptance mapping |
| 3 | VA-T2 Architecture | §3A.2 | "Theo's navigation (Chats / Projects / Artifacts / Customize, search, recents) mounts as a **permanent, collapsible section in the Origin 1/10 left panel**" | CCT TC-2 (TheoNav) |
| 4 | VA-T2 Architecture | §3A.4 | "activating it opens Theo's chat as a **resizable right-hand split panel** within the 9/10 (the app on the left, Theo on the right)." | CCT TC-3 (TheoMain right-panel mode) |
| 5 | VA-T2 Architecture | §3A.5 | "Theo exposes its mountable surfaces (navigation section + main/chat view) as federated module(s) the Origin shell consumes, receiving the shell `AppHostContext`." | CCT TC-1 (TheoSurface federated root) |
| 6 | VA-T3 Handover | §4 | "Origin passes `{ app_key, app_context }` to the mounted Theo surface via the shell `AppHostContext` (in-process props), never cross-origin `postMessage`" | §F-P3; CCT TC-1 prop `appContext` |
| 7 | Theo API Spec | §2.5 | "receive `{app_key, app_context}` from Origin; carry on conversation | `1A-contract` (presentational; carried on conversation, in-memory)" | §F-P3; CCT TC-5/TC-6 |
| 8 | Theo Golden Component Pack Standard | §5 | "Allowed deltas for 1A productionisation: splitting the monolith into components without rendered-surface change" | §F-P2; CCT TC-2/TC-3 = ALLOWED DELTA |
| 9 | Theo Golden Component Pack Standard | §8 | "the package states `PRIMARY REFERENCE: GREENFIELD` for those rows and names the governing authority" | CCT TC-1/TC-4/TC-7 = GREENFIELD |
| 10 | Claude Code Theo FE Governor Standard | §6 (5) | "Accept `{ app_key, app_context }` from Origin, carry it on the conversation, and surface it via the header chip idiom — context-only; 1A does not fetch app data" | CCT TC-4 (chip, no fetch) |
| 11 | Claude Code Theo FE Governor Standard | §6 (6) | "`vault-origin` changes are additive (context-broadcast + Theo mount point) only." | §F-P2.5 Gap G-1 (Origin work paired/additive) |
| 12 | Theo FE Conformance Standard | §6 T26 | "no `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS conversion of the reference surface in 1A" | §F-P6 guardrails |
| 13 | Theo Golden Component Pack Standard | §3 | "A row missing any of the three locked surfaces is invalid (T20)." | CCT — every row (incl. TC-5/TC-6) now carries a VA-id citation |
| 14 | VA-T3 Handover | §2.4 | "Persist it onto the conversation model (1A: in-memory; 1B: `theo_conversations.app_key` / `app_context`)." | CCT TC-5 VA-id citation |
| 15 | VA-T3 Handover | §2.3 | "route them through a single contracts/services module" | CCT TC-6 VA-id citation |

---

## Pass & Sub-Phase Walk
Pass 1 (Conformance §4C). Sub-phases F-P1…F-P7 below. F-P3 covers an in-process app-context contract (no new HTTP endpoint).

## F-P1 — Feature identification
**Microstep:** Plan §3 **Pass B — Theo-in-Origin mount + app-context** (Rule Anchors 1, 2). Delivers Plan §5 acceptance **#5** (app-context chip) and **#8** (Origin-shell mount). Touches `vault-theo` (this VEP) + `vault-origin` (additive, paired — Gap G-1).

**This VEP's scope = the vault-theo deliverables:** decompose the Pass-A `TheoShell` into mountable surfaces, expose them via Module Federation, ingest + surface app-context, retain a standalone dev harness. **Per-surface real-in-1A vs true-in-1B:** mountable split + app-context chip + carry-on-conversation = *real in 1A* (exercised standalone via a dev injector; federated remote buildable); live Origin hosting completes with the paired Origin step (cross-repo); persistence + tool-dispatch on `app_context` = *true in 1B*.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 | The rendered nav (Sidebar L297–328) and main/chat regions are reproduced unchanged; only their **DOM parents** change (portaled into shell slots when hosted). No pixel change. | VISUAL-AUTHORITY-MATCH; split = ALLOWED DELTA (Rule Anchor 8) |
| VA-T4 | The hosted mount layout (9/10 landing; permanent 1/10 nav section; in-app right panel; Module Federation, no iframe). | MATCH |
| VA-T2 §3A / VA-T3 §4 | Nav section (§3A.2), in-app right panel (§3A.4), federated mount receiving `AppHostContext` (§3A.5), in-process app-context props (§4). | MATCH |

No `VISUAL-AUTHORITY-DEVIATION`. The chip (TC-4) reuses the VA-T1 L337 removable-chip idiom; the app-context chip is non-removable in 1A.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Origin-side hosting is paired Reporting-FE work.** The 1/10 Theo slot, the 9/10 landing host, the right-panel "Open Theo" toggle, consuming the `theoApp/TheoSurface` remote, and the additive `AppHostContext` app-context accessor live in **`vault-origin`** (App Host Contract §6A), governed by the Reporting-FE regime — **not** this Theo VEP (Rule Anchor 11). | **PRE-LAND** on the Origin side: this VEP delivers a **standalone-capable, federated-exposed `TheoSurface`** the Origin step consumes. Acceptance #8 is cross-repo and completes when the paired Origin step lands. The vault-theo deliverables PROCEED now. |
| **G-2** | The host→Theo `appContext` prop shape is an **in-process contract** (App Host §1A; VA-T3 §4 — no `postMessage`). The matching vault-origin `AppHostContext.getAppContext()` lands in the paired step. | **PROCEED** — define `AppContext` locally (TC-5/types); the standalone dev injector supplies it in 1A; the host passes it as a prop when mounted. |
| **G-3** | Module Federation **expose** requires adding `@originjs/vite-plugin-federation` + a `vite.config.ts` expose block (vault-theo has none today). | **PROCEED** — real-in-1A build change, consistent with App Host §6A and vault-origin's existing host config. Does not alter the rendered surface. |

No `localStorage`/`sessionStorage`, no Tailwind, no `reporting_*`/`corporate-reporting` change (Rule Anchor 12).

## F-P3 — Backend / contract grounding
- **App-context (API Spec §2.5; Rule Anchor 7):** `1A-contract`, presentational, carried in-memory on the conversation; `1B-deployed` → `theo_conversations.app_key`/`app_context`. Shape: `AppContext = { app_key: string | null; app_context: Record<string, unknown> | null }` (opaque jsonb; VA-T2 §3.2). **No app-data fetch in 1A** (Rule Anchor 10).
- **Chat (API Spec §2.1):** unchanged from Pass A (mock gateway, Anthropic Messages shape).
- **Transport:** in-process React prop via the shell `AppHostContext` (Rule Anchor 6); no HTTP endpoint, no `postMessage`. No invented deployed shape.

## F-P4 — Component reference grounding
**Canonical Primary Reference (structural mirror target):** the Pass-A active surface — `src/theo/TheoShell.tsx` (container; owns `useTheoState`, renders `Sidebar` + view-switched main + `ArtifactPanel`) and `src/theo/components/Sidebar.tsx` (presentational nav). Read this turn. The new `TheoSurface` root, the app-context chip, and `lib/appContext.ts` are **`PRIMARY REFERENCE: GREENFIELD`** — governing authority Plan §3 Pass B + VA-T4 + VA-T2 §3A + VA-T3 §4 (Rule Anchor 9).

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; required-before-optional; `on<Event>`; discriminated unions preserved.

| # | Component (ownership; ACTIVE/NEW) | Prop / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `TheoSurface` (Theo surface; **NEW/GREENFIELD** federated root; wraps Pass-A `TheoShell`) | `interface AppContext { app_key: string \| null; app_context: Record<string, unknown> \| null }` · `interface TheoSurfaceProps { appContext?: AppContext; navSlot?: HTMLElement \| null; mainSlot?: HTMLElement \| null }` — owns `useTheoState`; when `navSlot`+`mainSlot` present (hosted) portals `TheoNav`→navSlot and `TheoMain`→mainSlot (one state tree); else renders the Pass-A inline layout (standalone). Exposed via Module Federation as `theoApp/TheoSurface`. | VA-T4; VA-T2 §3A.5 | host `appContext` prop (App Host §6A, in-process; API Spec §2.5 real-in-1A) | PROCEED |
| TC-2 | `TheoNav` (Theo surface; ACTIVE refactor of `Sidebar`) | current `SidebarProps` (collapsed/onToggleCollapse/view/onNavigate/nav/search/onSearch/recents/onSelectRecent/onNewChat/workspaceName/productName) — unchanged; rendered into the 1/10 slot when hosted | VA-T1 L297–328 (Sidebar); VA-T2 §3A.2 | none (presentational; fed by TC-1) | PROCEED |
| TC-3 | `TheoMain` (Theo surface; ACTIVE extract of `TheoShell` main) | `interface TheoMainProps { t: ReturnType<typeof useTheoState>; mode: "full" \| "panel" }` — the view-switched header + active view + `ArtifactPanel` + `renderAssistant`; `mode:"panel"` = the in-app right-docked presentation | VA-T1 main region; VA-T2 §3A.1/§3A.4 | none (presentational; fed by TC-1) | PROCEED |
| TC-4 | App-context chip (Theo surface; **NEW/GREENFIELD**; in `TheoMain` chat header) | consumes `t.appContext`; renders the VA-T1 L337 pill when `app_key !== null` (non-removable in 1A); label via TC-7 | VA-T1 L337 chip idiom; VA-T3 §2.4 | `t.appContext` (TC-5) | PROCEED |
| TC-5 | `useTheoState` (ACTIVE; extend) | add `appContext: AppContext` (state) + `ingestAppContext(ctx: AppContext): void` (syncs the TC-1 prop → state + `theoClient.setAppContext`); carried on the conversation, **not** fetched | VA-T3 §2.4 (app-context layer — "Persist it onto the conversation model (1A: in-memory)") | TC-6; API Spec §2.5 | PROCEED |
| TC-6 | `services/theoClient.ts` (ACTIVE; extend) | `getAppContext(): AppContext` · `setAppContext(ctx: AppContext): void` (module-memory; default `{app_key:null, app_context:null}`) | VA-T3 §2.3 (single contracts/services module) + §2.4 (app-context carry) | API Spec §2.5 (`1A-contract` in-memory; `1B` → `theo_conversations`) | PROCEED |
| TC-7 | `lib/appContext.ts` (**NEW/GREENFIELD**) | `appContextLabel(ctx: AppContext): string \| null` → e.g. `"Corporate Reporting · Workpaper"`; `null` when `app_key===null`; degrades to app name when `app_context` empty | VA-T3 §2.4 (label example) | pure | PROCEED |
| TC-8 | Dev context injector (**NEW/GREENFIELD**; `import.meta.env.DEV` only) | standalone-only control calling `ingestAppContext` with a sample `{app_key:"reporting", app_context:{workpaper_id:"…"}}`; excluded from production | Plan §3 Pass B; VA-T3 §4 | TC-5 | PROCEED |

**Infra (F-P6, not a component):** `vite.config.ts` gains `@originjs/vite-plugin-federation` with `expose: { "./TheoSurface": "src/theo/TheoSurface.tsx" }` + React/react-dom shared singletons; `App.tsx` renders `<TheoSurface />` standalone (with TC-8 in DEV).

## F-P6 — Repository & active-surface grounding
Target files read/blob-confirmed this turn: `TheoShell.tsx`, `Sidebar.tsx`, `types.ts`, `vite.config.ts` (Read this turn); `useTheoState.ts`, `theoClient.ts` (blob-confirmed this turn, Pass-A surface). All ACTIVE (merged Pass A @ `c19d12a`); no deprecated/orphaned targets. Guardrails (Rule Anchor 12): no browser storage; no Tailwind/CSS-in-JS; no direct browser→model call (chip presentational); no `reporting_*`/`corporate-reporting` change; vault-origin changes are additive + paired (G-1).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present; Component Contract Table locked. No implementation begun. On Codex APPROVAL, Pass 3 implements the vault-theo decomposition + federation expose + app-context, demonstrable on `vault-theo-dev` via the dev injector; full Origin hosting completes with the paired Reporting-FE step (G-1).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of Pass B Pass-1 Frontend VEP (plan only).*
