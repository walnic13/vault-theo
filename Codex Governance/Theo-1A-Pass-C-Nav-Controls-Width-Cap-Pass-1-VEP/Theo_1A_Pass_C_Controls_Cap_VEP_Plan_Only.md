# Theo Phase 1A — Pass C (Hosted Nav-Controls Width Cap) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend. Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Plan-only; no implementation begun (FE Governor §2). Scope = the second acceptance-driven polish item of **Plan §3 Pass C**: in the hosted (fluid) nav, the "New chat" button and "Search" field must not grow when the Origin 1/10 panel is dragged wider — they should hold their VA-T1 intrinsic size (Walter SWA-acceptance finding). vault-theo only; follows the merged hosted-nav-fit Pass C (`ccb4a54`).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn-type: Pass 1 — Frontend Verified Evidence Pack
Turn issued against HEAD: `ccb4a5443ec76124416df3beee36d7b7452af7f7` (vault-theo, `development`)
Grounding mode: Full Baseline Grounding (Conformance §4, Claude Code | Pass 1 — Frontend Verified Evidence Pack)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `Read(...)` this turn (full) | first-20: "# CLAUDE CODE — THEO FRONTEND GOVERNOR STANDARD Scope: Vault Theo frontend. Binds Claude Code's authoring behavior in the Theo" · blob `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (§3 Pass C row; §5) | `Read(...offset=33,limit=30)` this turn | first-20: "## §3 Pass sequence (the microsteps; each is sourced here at F-P1) Phase 1A is delivered in governed passes. Each pass runs" · blob `19fbc7890f24e563252403cda76441a83a42ca73` |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1/§2.5 — in-scope = none) | `Grep(^### 2.1\|app_context, ...)` this turn | blob `a524eefd859130f68561466e9535b2354871d97a` (§8 structural-row fallback) |
| 4 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4B, §6, §8) | `Read(...)` this turn (full) | first-20: "# THEO FRONTEND GROUNDING CONFORMANCE STANDARD Scope: Vault Theo frontend only. No other project or pipeline is in scope. Adoption: Immediate on" · blob `a73a49f7a680a10298642a634258d839cce165af` |
| 5 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | `Read(...)` this turn (full) | first-20: "# CODEX — THEO FRONTEND REVIEW STANDARD Scope: Vault Theo frontend. Binds Codex's reviewer behavior (Pass 2) and Role-C inline-execution behavior (Pass" · blob `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2, §5) | `Read(...)` this turn (full) | first-20: "# THEO GOLDEN COMPONENT PACK STANDARD Scope: Vault Theo frontend components. The component-structure / Component Contract Table / visual-parity truth owner for Theo" · blob `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 7 | §4B Visual Authority Registry (within #4) — VA-T1, VA-T4 | (within `a73a49f7…`, read this turn) | rows VA-T1/VA-T4 present |
| 8 | VA-T1 Reference Surface — `frontend/theo-frontend-reference.jsx` (Sidebar L297–328: New chat L305–308, Search L310–314) | `Read(...offset=297,limit=34)` this turn | blob `433f6236344f6e8bdbc49db85a53036427610fed`; full-file sha256 `fe473eed3364505824639d3ef0c9fd0059f2d1ae164ae22976fc3268aed33f2a` (= registered VA-T1) |
| 9 | ACTIVE (modify-target) — `src/theo/components/Sidebar.tsx` (post-merge; carries `fluid?`) | `Read(...)` this turn | blob `133b8da79b8a1be87de73a13f0b310bc83ea1c78` (captured this turn) |

No ChatGPT advisory note cited (§4D / T18). No `corporate-reporting` / `reporting_*` document in scope. `TheoSurface` is unchanged this pass (it already passes `fluid`); not a modify-target.

---

## RULE ANCHORS

| # | Source doc | Clause id | Verbatim clause text | Applied in output at |
| - | ---------- | --------- | -------------------- | -------------------- |
| 1 | Theo Phase 1A Frontend Plan | §3 Pass C row | "Acceptance & polish" | §F-P1 (microstep) |
| 2 | VA-T1 Reference Surface | L298 | "width: railW" | §F-P1; §F-P2 (rail = 270 ⇒ control content width 246) |
| 3 | VA-T1 Reference Surface | L306 | "background: C.coral, color: \"#fff\", border: \"none\", borderRadius: 10" | §F-P2 (New chat control — VA-T1 size preserved) |
| 4 | VA-T1 Reference Surface | L311 | "background: \"#fff\", border: `1px solid ${C.line2}`, borderRadius: 9" | §F-P2 (Search control — VA-T1 size preserved) |
| 5 | Theo Golden Component Pack Standard | §5 | "a CSS / inline-style change that does not alter the rendered surface is an allowed delta" | §F-P2 (maxWidth cap = inline-style; restores VA-T1 control size) |
| 6 | Theo Golden Component Pack Standard | §2 | "select **exactly one** existing component file as the structural mirror target" | §F-P4 (Sidebar.tsx) |
| 7 | Theo Golden Component Pack Standard | §3 | "A row missing any of the three locked surfaces is invalid (T20)." | §F-P5 (CCT row) |
| 8 | Claude Code Theo FE Governor Standard | §6 (4) | "no Tailwind / CSS-in-JS conversion in 1A" | §F-P2; §F-P6 (inline-style only) |
| 9 | Claude Code Theo FE Governor Standard | §6 (6) | "No change to `corporate-reporting` or any `reporting_*` table/endpoint" | §F-P6 guardrails |

---

## Pass & Sub-Phase Walk
Pass 1 (Conformance §4C; §4A.1). F-P1…F-P7. No HTTP contract (F-P3 = none in scope).

## F-P1 — Feature identification
**Microstep:** Plan **§3 Pass C — "Acceptance & polish"** (Rule Anchor 1). Item: at Walter's SWA acceptance of the merged hosted-nav-fit (`ccb4a54`), the hosted (`fluid`) nav's **"New chat" button and "Search" field grow with the panel** when the Origin 1/10 is dragged wider — because both use `width:"100%"` inside the now-fluid `<aside>`. The fix caps them at their **VA-T1 intrinsic control width** so they render at the same size as in the standalone 270px rail regardless of panel width. **No pass is inferred** (Pass C exists; §4A.1 sourcing rule satisfied); **no new scope** — it conforms the hosted controls to VA-T1 sizing (Rule Anchors 2–4).

**Per-surface real-in-1A vs true-in-1B:** presentational/CSS only — **real-in-1A**; no 1B dependency.

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (New chat L305–308; Search L310–314) | In VA-T1 the controls are `width:"100%"` **within a fixed 270px rail** (L298 `width: railW`), giving an intrinsic content width of **246px** (270 − 2×12px wrapper padding). The cap sets `maxWidth: 246` on the New chat button and the Search container **when `fluid`**, so hosted controls hold that exact VA-T1 size and stop growing past it; they remain left-aligned (wrapper unchanged). Standalone (non-fluid) is untouched. | VISUAL-AUTHORITY-MATCH (controls render at VA-T1 246px); cap = ALLOWED DELTA inline-style (Rule Anchors 2–5) |

No `VISUAL-AUTHORITY-DEVIATION`: the cap **restores** the VA-T1 control size in the fluid container; palette, typography, padding, radius unchanged. Inline-style only — no Tailwind (Rule Anchor 8).

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | At a panel narrower than 270px (Origin `MIN_WIDTH` 200px), the controls render below 246px (they fill the slot, `maxWidth` not reached) — expected and faithful (they never exceed VA-T1 size; "fine at smallest" per the SWA finding). | **PROCEED** — `maxWidth` is a ceiling, not a fixed width; sub-246 panels simply show the controls smaller, matching the collapsed-rail behaviour Walter accepted. |

Per-surface real-in-1A. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`/`vault-origin` change.

## F-P3 — Backend / contract grounding
**No contract in scope.** Presentational `maxWidth` on two existing controls. Chat (§2.1) and app-context (§2.5) contracts unchanged. No endpoint, no gateway change.

## F-P4 — Component reference grounding
**Canonical Primary Reference:** `src/theo/components/Sidebar.tsx` (ACTIVE; post-merge, carries `fluid?`), read this turn (Rule Anchor 6). Its New chat (L47) + Search (L52–53) mirror VA-T1 L305–314 (read this turn). No GREENFIELD component.

## F-P5 — Component Contract Table
Format: Golden Pack §3 (Rule Anchor 7). `no any`; required-before-optional.

| # | Component (ownership; ACTIVE/NEW) | Prop / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `Sidebar` (Theo surface; **ACTIVE**, modify) | `SidebarProps` **unchanged** (incl. `fluid?: boolean` from `ccb4a54`). Internal change only: when `fluid`, the **New chat `<button>`** and the **Search container `<div>`** add `maxWidth: 246` (`box-sizing:border-box`); when `fluid` false/absent, unchanged. No prop added or removed. | VA-T1 New chat L305–308 + Search L310–314 (intrinsic 246px in the 270 rail) | none (presentational; state/handlers from `TheoSurface`) | PROCEED |

**Infra:** none. No `vite.config.ts`, federation, dependency, contract, or new-file change. `TheoSurface` untouched.

## F-P6 — Repository & active-surface grounding
Target read this turn and confirmed ACTIVE: `src/theo/components/Sidebar.tsx` (blob `133b8da7…`). No deprecated/orphaned targets. Guardrails (Rule Anchors 8, 9): inline-style `maxWidth` only — **no Tailwind/CSS-in-JS** (T26); no browser storage; no direct browser→model call; no `reporting_*`/`corporate-reporting`/`vault-origin` change.

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present; CCT locked (1 ACTIVE row). No implementation begun. On Codex APPROVAL, Pass 3 adds `maxWidth: 246` to the two hosted controls in `Sidebar`, verified `tsc`/`build` green and demonstrated on the Origin dev SWA (controls hold size when the 1/10 is widened) + the vault-theo standalone harness (unchanged).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of Pass C (Nav-Controls Width Cap) Pass-1 Frontend VEP (plan only).*
