# Theo Phase 1A — Pass C (Hosted-Nav Fit to the Origin 1/10) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend. Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Plan-only; no implementation begun (FE Governor §2). Scope = the first acceptance-driven polish item of **Plan §3 Pass C**: the hosted Theo nav must fit the Origin 1/10 left panel without horizontal overflow (Walter SWA-acceptance finding on the Pass B mount). vault-theo only.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn-type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `dde1cfc0484e3e292f36ab9026fe5f5d5ef6fb2c` (vault-theo, `development`)
Grounding mode: Full Baseline Grounding (Conformance §4, Claude Code | Pass 1 — Frontend Verified Evidence Pack)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `Read(...)` this turn (full) | first-20: "# CLAUDE CODE — THEO FRONTEND GOVERNOR STANDARD Scope: Vault Theo frontend. Binds Claude Code's authoring behavior in the Theo" · last-20: "Code emits a Role-C Verbatim-Edit Handoff (exact before/after text) for Codex to execute; it does not silently edit governed documents." |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (§3 Pass C row; §5 acceptance) | `Read(...offset=33,limit=30)` this turn | first-20: "## §3 Pass sequence (the microsteps; each is sourced here at F-P1) Phase 1A is delivered in governed passes. Each pass runs" · last-20: "4, 6, 7; Pass B delivers 5 and 8; Pass C confirms the whole and produces Visual Acceptance Evidence." |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 chat; §2.5 app-context — in-scope = none) | `Grep(^### 2.1\|app_context, ...)` this turn | blob SHA fallback (§8 — structural rows): `a524eefd859130f68561466e9535b2354871d97a`; §2.1 first-tokens: "Send message → assistant reply \| Standard Anthropic Messages API (`model`, `max_tokens`, `system`, `messages[]`)" |
| 4 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (incl. §4B registry, §6 triggers, §8) | `Read(...)` this turn (full) | first-20: "# THEO FRONTEND GROUNDING CONFORMANCE STANDARD Scope: Vault Theo frontend only. No other project or pipeline is in scope. Adoption: Immediate on" · last-20: "is local-only to the Claude Code clone, gitignored, and outside Codex's editable governance document set. Codex MUST NOT edit or create `CLAUDE.local.md`." |
| 5 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | `Read(...)` this turn (full) | first-20: "# CODEX — THEO FRONTEND REVIEW STANDARD Scope: Vault Theo frontend. Binds Codex's reviewer behavior (Pass 2) and Role-C inline-execution behavior (Pass" · last-20: "a GCR per the Frontend Conformance §4 (Codex \| Pass 4 row). Codex MUST NOT edit or create `CLAUDE.local.md`." |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 selection; §5 allowed deltas) | `Read(...)` this turn (full) | first-20: "# THEO GOLDEN COMPONENT PACK STANDARD Scope: Vault Theo frontend components. The component-structure / Component Contract Table / visual-parity truth owner for Theo" · last-20: "+ VA-id) as the reference. Greenfield does not waive the Component Contract Table, the prop-interface conventions, or the visual-parity checklist." |
| 7 | §4B Visual Authority Registry (within #4) — VA-T1, VA-T2, VA-T4 | (within `a73a49f7…`, read this turn) | rows VA-T1/VA-T2/VA-T4 present; see #4 read |
| 8 | VA-T1 Reference Surface — `frontend/theo-frontend-reference.jsx` (Sidebar region L297–328) | `Read(...offset=297,limit=34)` this turn | blob SHA `433f6236344f6e8bdbc49db85a53036427610fed`; full-file sha256 `fe473eed3364505824639d3ef0c9fd0059f2d1ae164ae22976fc3268aed33f2a` (= registered VA-T1) |
| 9 | VA-T2 Architecture — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §3A.2 (nav in the 1/10) | `Grep(3A.2\|1/10 left panel, -C2)` this turn | blob SHA fallback (§8 — structural clause): `07451ce9d912830b3c15fedf74761d00c59f97b2`; §3A.2 first-tokens: "### 3A.2 Theo navigation as a permanent shell section Theo's navigation (Chats / Projects / Artifacts / Customize, search, recents) mounts as a" |
| 10 | VA-T4 (within #9 §3A + this) — VA-T3 Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` §4 (Theo navigation section 1/10) | `Read(...offset=100,limit=13)` this turn | blob SHA fallback (§8 — structural clause): `aad6396703b5a2b6d204986e5064504cec939895`; §4 first-tokens: "## 4. Origin-side additive work (`vault-origin`) Theo is hosted **inside the Origin shell** as the default landing surface" |
| 11 | Primary reference (ACTIVE; modify-target) — `src/theo/components/Sidebar.tsx` | `Read(...)` this turn (full) | blob SHA `0a9ec857a00f5422e1b5319e993a71d543a2bc90` (captured this turn) |
| 12 | ACTIVE (modify-target) — `src/theo/TheoSurface.tsx` (hosted-branch wiring) | `Read(...offset=1,limit=80)` this turn | blob SHA `3cc9392088be2cda81ffd59b916e8c738edf444d` (captured this turn) |

No ChatGPT advisory note is cited (Conformance §4D / T18). No `corporate-reporting` / `reporting_*` document in scope.

---

## RULE ANCHORS

| # | Source doc | Clause id | Verbatim clause text | Applied in output at |
| - | ---------- | --------- | -------------------- | -------------------- |
| 1 | Theo Phase 1A Frontend Plan | §3 Pass C row | "Acceptance & polish" | §F-P1 (microstep) |
| 2 | Theo Phase 1A Frontend Plan | §5 #8 | "nav as a permanent collapsible 1/10 section (below Vault Files, above Vault Origin Apps)" | §F-P1; §F-P2 (the fit target) |
| 3 | VA-T2 Architecture | §3A.2 | "mounts as a **permanent, collapsible section in the Origin 1/10 left panel**" | §F-P2; CCT TC-1 visual authority (hosted fit) |
| 4 | VA-T3 Handover | §4 | "a permanent, collapsible Theo section in the Origin left panel, **below Vault Files and above Vault Origin Apps**, holding Theo's navigation" | §F-P2; CCT TC-1 (hosted fit) |
| 5 | Theo Golden Component Pack Standard | §5 | "a CSS / inline-style change that does not alter the rendered surface is an allowed delta" | §F-P2 (hosted fluid width = ALLOWED DELTA); CCT TC-1/TC-2 |
| 6 | Theo Golden Component Pack Standard | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." | §F-P2 (standalone surface unchanged ⇒ no deviation) |
| 7 | Theo Golden Component Pack Standard | §2 | "select **exactly one** existing component file as the structural mirror target" | §F-P4 (Sidebar.tsx) |
| 8 | Theo Golden Component Pack Standard | §3 | "A row missing any of the three locked surfaces is invalid (T20)." | §F-P5 (CCT — every row carries prop interface + VA-id + dependency) |
| 9 | Claude Code Theo FE Governor Standard | §6 (3) | "No `localStorage` / `sessionStorage`; 1A state is React/in-memory." | §F-P6 guardrails |
| 10 | Claude Code Theo FE Governor Standard | §6 (4) | "no Tailwind / CSS-in-JS conversion in 1A" | §F-P2; §F-P6 (inline-style change only) |
| 11 | Claude Code Theo FE Governor Standard | §6 (6) | "No change to `corporate-reporting` or any `reporting_*` table/endpoint" | §F-P6 guardrails |
| 12 | Theo FE Conformance Standard | §6 T26 | "Tailwind/CSS-in-JS conversion of the reference surface in 1A" | §F-P6 (not done — inline style retained) |

---

## Pass & Sub-Phase Walk
Pass 1 (Conformance §4C; §4A.1). Sub-phases F-P1…F-P7 below. No new HTTP contract (F-P3 = no contract in scope).

## F-P1 — Feature identification
**Microstep:** Plan **§3 Pass C — "Acceptance & polish"** (Rule Anchor 1). The specific polish item: at Walter's SWA acceptance of the Pass B Theo-in-Origin mount, the hosted Theo nav was found **not to fit the Origin 1/10 without horizontal stretch** — the Sidebar renders a **fixed-width rail** (`railW = collapsed ? 58 : 270`) that, when portaled into Origin's narrower 1/10 slot, overflows horizontally and oversizes the "New chat" button and "Search" field relative to the slot. This pass conforms the hosted nav to **VA-T2 §3A.2 / VA-T3 §4 / Plan §5 #8** — the nav must be "a permanent, collapsible section **in** the Origin 1/10 left panel" (Rule Anchors 2, 3, 4). **No pass is inferred** (Pass C exists in §3; Conformance §4A.1 sourcing rule satisfied) and **no new scope is added** — the change brings the implementation into conformance with existing landed authority (VA-T2 §3A.2), it does not introduce a new surface.

**Per-surface real-in-1A vs true-in-1B:** the hosted-nav layout fit is **real-in-1A** — purely presentational/CSS (inline-style width), exercised live in the Origin dev SWA (VO-AH-Theo landed) and in the vault-theo standalone harness. No 1B dependency.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (Sidebar L297–328) | The **standalone** surface is unchanged: when no shell slots are present, the `<aside>` keeps its fixed `railW` (270 expanded / 58 collapsed), the navBtn/New chat/Search/Recents/footer layout, the `C` palette, and `SANS` typography exactly as the reference (`fluid` absent/false). | VISUAL-AUTHORITY-MATCH (Rule Anchor 6 — no rendered-surface change standalone) |
| VA-T2 §3A.2 / VA-T3 §4 / Plan §5 #8 | The **hosted** nav (portaled into Origin's 1/10) adopts a **fluid container width** (`width:100%`, `maxWidth:100%`, `box-sizing:border-box`) so it sits **within** the 1/10 without horizontal overflow — realizing "a permanent, collapsible section in the Origin 1/10 left panel." The internal layout is unchanged; "New chat" and "Search" already use `width:"100%"`, so they reflow to the slot (no intrinsic resize, no redesign). | ALLOWED DELTA (Rule Anchors 3, 4, 5 — inline-style width change realizing the hosted-layout authority; children unchanged) |

No `VISUAL-AUTHORITY-DEVIATION`: the rendered surface (children, palette, typography, spacing, states) is reproduced faithfully; only the **container width binding** changes, and only in the hosted branch — an AD-visual inline-style change (Rule Anchor 5), not a Tailwind/CSS-in-JS conversion (Rule Anchors 10, 12).

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Origin-side slot width.** Origin's 1/10 left panel width is owned by the Reporting-FE shell (`ShellLeftPanel`/`ShellFrame`); the fluid Theo nav simply fills whatever width Origin provides. | **PROCEED** — vault-theo-only change; no paired `vault-origin` change is required (the slot already exists from the landed VO-AH-Theo mount; the fluid nav conforms to it). If Walter later wants the 1/10 itself widened, that is a separate Reporting-FE item, out of this VEP's scope. |
| **G-2** | **Collapse interaction in-host.** The Sidebar retains its own collapse toggle (58px rail) for the standalone harness; in-host, Origin's section header also collapses the Theo section. Two collapse affordances coexist (pre-existing from Pass B); this VEP does not change collapse behaviour. | **PROCEED** — out of scope here; flagged for the Pass C acceptance pass / a future polish item if Walter wants the in-host internal toggle suppressed. |

Per-surface real-in-1A: the fit is presentational, real-in-1A. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting` change (Rule Anchors 9, 11, 12).

## F-P3 — Backend / contract grounding
**No contract in scope.** This is a presentational layout change to the Sidebar container width. The chat contract (API Spec §2.1, Anthropic Messages shape) and the app-context contract (§2.5) are **unchanged from Pass A/B** — read this turn to confirm no in-scope contract. No HTTP endpoint, no `postMessage`, no gateway change. No invented shape.

## F-P4 — Component reference grounding
**Canonical Primary Reference (structural mirror target):** `src/theo/components/Sidebar.tsx` (ACTIVE; Pass-A/B presentational nav), read in full this turn (Rule Anchor 7 — exactly one mirror target). Its `<aside>` mirrors VA-T1 L297–328 (read this turn). No GREENFIELD component in this pass (both rows are ACTIVE).

## F-P5 — Component Contract Table
Format: Golden Pack §3 (Rule Anchor 8). `no any`; required-before-optional; `on<Event>`; discriminated unions preserved.

| # | Component (ownership; ACTIVE/NEW) | Prop / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `Sidebar` (Theo surface; **ACTIVE**, modify) | `interface SidebarProps { collapsed: boolean; onToggleCollapse: () => void; view: View; onNavigate: (v: View) => void; nav: NavItem[]; search: string; onSearch: (s: string) => void; recents: string[]; onSelectRecent: (r: string) => void; onNewChat: () => void; workspaceName: string; productName: string; fluid?: boolean }` — **adds optional `fluid?: boolean`**. When `fluid` truthy: the `<aside>` uses `width:"100%"`, `maxWidth:"100%"`, `boxSizing:"border-box"` (fills the host slot); when absent/false: the existing `railW` (270 / 58) is used unchanged. All other props + internal layout unchanged. | VA-T1 L297–328 (standalone EXACT); VA-T2 §3A.2 + VA-T3 §4 (hosted fit) | none (presentational; state/handlers from `TheoSurface`) | PROCEED |
| TC-2 | `TheoSurface` (Theo surface; **ACTIVE**, modify) | `interface TheoSurfaceProps { appContext?: AppContext; navSlot?: HTMLElement \| null; mainSlot?: HTMLElement \| null }` — **unchanged**; the change is internal: it passes `fluid={!!(navSlot && mainSlot)}` to `<Sidebar>` so fluid width applies **only** in the hosted (portaled) branch; the standalone inline branch passes `fluid={false}` (VA-T1 270 rail preserved). | VA-T4 (hosted mount: nav portaled into the 1/10) | host `navSlot`/`mainSlot` props (in-process; App Host §1A — unchanged from Pass B) | PROCEED |

**Infra:** none. No `vite.config.ts`, federation, dependency, or contract change. No new file.

## F-P6 — Repository & active-surface grounding
Target files read this turn and confirmed ACTIVE (merged Pass A/B): `src/theo/components/Sidebar.tsx` (blob `0a9ec857…`), `src/theo/TheoSurface.tsx` (blob `3cc93920…`). No deprecated/orphaned targets. Guardrails (Rule Anchors 9–12): no browser storage; **inline-style width change only — no Tailwind/CSS-in-JS conversion** (T26); no direct browser→model call (presentational); no `reporting_*`/`corporate-reporting` change; no `vault-origin` change required (G-1).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present; Component Contract Table locked (2 ACTIVE rows). No implementation begun. On Codex APPROVAL, Pass 3 implements the `fluid?` prop on `Sidebar` + the `fluid={!!(navSlot && mainSlot)}` wiring in `TheoSurface`, verified `tsc`/`build` green and demonstrated on the Origin dev SWA (hosted nav fits the 1/10) and the vault-theo standalone harness (270 rail unchanged); Walter SWA acceptance produces the Pass-3 Visual Acceptance Evidence.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of Pass C (Hosted-Nav Fit) Pass-1 Frontend VEP (plan only).*
