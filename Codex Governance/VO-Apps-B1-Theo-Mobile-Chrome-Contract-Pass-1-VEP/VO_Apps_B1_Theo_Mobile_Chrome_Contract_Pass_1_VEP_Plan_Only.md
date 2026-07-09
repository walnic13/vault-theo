# VO Apps Phase B — Package B1: Theo Mobile-Chrome Contract (TheoSurface/TheoMain seam)
## Pass 1 Frontend Verified Evidence Pack — PLAN ONLY

Author: Claude Code · Reviewer: Codex · Repo: `vault-theo` · Branch: `development`

---

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Pass: Pass 1
Sub-phase Track: N/A
Turn issued against HEAD: f340609b043a61e363e4daf38e6b1e439d8b384f
Grounding Mode: Full Baseline Grounding

> Sub-phase Track is `N/A`: this is a frontend VEP, which is not on the backend P/I/E sub-phase tracks. The FE sub-phase spine (F-P1–F-P7) is walked below per Frontend Conformance §4A.1; the `N/A` value correctly skips the backend-only completeness checks (C10) while the FE structural obligations (GCR, Rule Anchor Table, sub-phase walk, UI Authority Reconciliation, Gap Disclosure, Component Contract Table) are all present.

Currency anchors below are the §8 fallback form (git blob SHA obtained via `git rev-parse HEAD:<path>` this turn) — permitted for these structural authority reads.

| # | Document (name + absolute path) | Read invocation this turn | Currency anchor (HEAD blob SHA) |
|---|---------------------------------|---------------------------|---------------------------------|
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | Read(governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md, limit=50) | b9c0e11d6e52aace2f97caec845a70e66372b713 |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | Read(governance/THEO_PHASE_1A_FRONTEND_PLAN.md, limit=60) | d125cbdc4048a0b4120d3682bc8ecb76db134219 |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` | Read(spec/THEO_API_SPEC.md, limit=45) | b6324c7901ba1a42a17d7649c8e6497920325c92 |
| 4 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` | Read(governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md) | 07e8dabbccc1d0394a493c6a6b358e38253e4f4b |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | Read(governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md, limit=40) | e2b7e0ba91486371414da688ae3697f02a11e252 |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` | Read(governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md) | 0035a1d9fed103d07bf420b957c3727ec47fcc6b |
| 7 | Theo Architecture and Structure (§3A VA-T4 mount model) — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` | Read(governance/THEO_ARCHITECTURE_AND_STRUCTURE.md, offset=116, limit=20) + Grep(§3A) | 07451ce9d912830b3c15fedf74761d00c59f97b2 |
| 8 | Theo 1A Frontend Handover (§4 VA-T4, §4.1 VA-T6) — `governance/THEO_1A_FRONTEND_HANDOVER.md` | Read(governance/THEO_1A_FRONTEND_HANDOVER.md) | 097c2f2417872533374334a5cc031eb1ec583c60 |
| 9 | Target component — `src/theo/TheoSurface.tsx` | Read(src/theo/TheoSurface.tsx) | a304bbfb506d3ea7b04d798ec77790345ad3db87 |
| 10 | Target component — `src/theo/components/TheoMain.tsx` | Read(src/theo/components/TheoMain.tsx) | bf960b4107cf986c8f27ac0d2d126a6a310be83f |
| 11 | `newChat()` definition region — `src/theo/useTheoState.ts` | Read(src/theo/useTheoState.ts, offset=175, limit=40) | 9148193fa1d9a7618aaf81b3f8c7ab6d60a1859e |

§4B Visual Authority Registry (Frontend Conformance §4B) was read this turn (row 4) and the in-scope VA-ids cited below (VA-T1, VA-T4, VA-T6) are all registered there. No primary reference component is inlined verbatim because this is a **plan-only Pass 1 VEP** (full-verbatim inline is a Pass 3 / F-I2 obligation, T9); the two target components are read in full this turn (rows 9–10) and their contracts are locked in the Component Contract Table below.

---

## Rule Anchor Table

| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 Component Contract Table | "No implementation may begin without an approved Component Contract Table" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 Allowed Deltas | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §4.1 VA-T6 narrow-viewport | "the 9/10 main view fills the viewport and Theo's nav is reached through the Origin shell's off-canvas drawer" |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §4.1 VA-T6 wide unchanged | "On wide viewports the VA-T1 surface is reproduced exactly; the narrow-viewport rules do not alter the wide rendered surface." |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §4.1 VA-T6 driving authority | "the driving vision authority is the landed VO1 §2B / §10B / §12." |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §3A.5 VA-T4 mount model | "hosting in Origin changes neither the gateway nor the context-only app-context contract" |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §3A.5 VA-T4 federated surfaces | "Theo exposes its mountable surfaces (navigation section + main/chat view) as federated module(s) the Origin shell consumes, receiving the shell" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B Visual Authority Registry | "Any VEP or Rule Anchor Table citing a VA-id path not registered here is automatically invalid per §6 T21." |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §4 UI Authority Reconciliation | "A planned visual deviation must be cited and classified (VISUAL-AUTHORITY-DEVIATION) with a Rule Anchor, or it is invalid." |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A Hard Gates | "A Pass 1 VEP MUST carry a Component Contract Table with, per row, the prop interface, the VA-id citation, and the data/contract dependency." |
| governance/THEO_PHASE_1A_FRONTEND_PLAN.md | §3 Sourcing rule (F-P1) | "a Pass-1 Frontend VEP MUST cite its pass row here. New passes are added to this table by a Role-C update before their VEP is authored; a pass is never inferred." |

Each classification below is backed by at least one anchor above (Frontend Conformance §5 rule 5): the ALLOWED DELTA prop additions by Golden Pack §5; the narrow header-hide VISUAL-AUTHORITY-DEVIATION by Golden Pack §5 + Governor §4 + VA-T6 §4.1; the mount-model / boundary claim by VA-T4 §3A.5; VA-id validity by Conformance §4B.

---

## Sub-Phase Walk (F-P1–F-P7)

**F-P1 — Feature identification.** The microstep is **VO Apps Phase B, package B1** — the enabling `vault-theo` contract change letting the Vault Origin mobile shell own a single top bar and trigger Theo new-chat. It adds two OPTIONAL props to the federated `theoApp/TheoSurface` remote and one optional suppress flag to `TheoMain`. Per-surface classification (1A handover §3 idiom): all behaviour is **real-in-1A** (pure client UI seam); there is **no true-in-1B backend leg** because no wire contract is added. **Sourcing gap:** the Phase 1A Frontend Plan §3 pass table currently enumerates only 1A passes A/B/C (all Done) and has **no row** for this Apps-Phase-B B1 microstep; the sourcing rule requires a cited pass row. Disclosed as a PRE-LAND gap in F-P2.5 (Gap G1). F-P1 sources this turn against the Apps-Phase-B program direction plus VA-T6 (the CURRENT registered authority for the narrow-viewport hosted-chrome adaptation), pending the Role-C plan-row landing.

**F-P2 — UI authority reconciliation.** See the dedicated "Architecture & boundary reconciliation" and "UI Authority Reconciliation (F-P2)" sections below. Reconciled against VA-T1 (wide reference surface — unchanged), VA-T4 (mount model — unchanged), VA-T6 (narrow hosted surface — the authority for the mobile chrome change).

**F-P2.5 — Gap disclosure.** See "Gap Disclosure (F-P2.5)". Two PRE-LAND gaps disclosed (G1 pass-row sourcing; G2 VA-T6 header-suppression clause).

**F-P3 — Backend / contract grounding.** **N/A — no in-scope backend/wire contract.** B1 is a UI prop seam. The Theo API Spec (read this turn) enumerates only `theo_*` data/gateway endpoints (§2.1 chat/gateway, §2.2 projects, §2.3 artifacts, …); none is touched, added, or reshaped. `suppressNarrowHeader` and `newChatNonce` are in-process React props on the federated surface; `newChatNonce` drives the **existing, already-shipped** in-memory `t.newChat()` (`src/theo/useTheoState.ts:191`) — no new request/response shape exists to lock. No mocked-gateway contract change.

**F-P4 — Component reference grounding.** Primary reference = the two ACTIVE target components themselves (`src/theo/TheoSurface.tsx`, `src/theo/components/TheoMain.tsx`), both read in full this turn (GCR rows 9–10). These are productionised descendants of VA-T1 already in the repo; this is an additive edit to active components, not a greenfield lift, so no `frontend/theo-frontend-reference.jsx` substrate re-lift is required. Full-verbatim inline is deferred to the Pass 3 F-I2 structural-mirror package (plan-only turn).

**F-P5 — Component Contract Table assembly.** See "Component Contract Table (F-P5)" — one row each for `TheoSurface` and `TheoMain`, each locking prop interface + VA-id + contract dependency.

**F-P6 — Repository & active-surface grounding.** Both target files are on the active surface (`src/theo/…`, imported by the exposed remote — TheoSurface is the `theoApp/TheoSurface` default export; TheoMain is rendered by TheoSurface in both the hosted portal branch and the standalone branch). No deprecated/orphaned code touched. No `localStorage`/`sessionStorage`. The inline-style + single `<style>` STYLE_BLOCK idiom is preserved; **no Tailwind/CSS-in-JS conversion** — the narrow header-hide is added as one media-query rule inside the existing STYLE_BLOCK, matching the existing `@media (max-width: 767.98px)` block.

**F-P7 — VEP assembly.** This document: GCR + Rule Anchor Table open the pack (Frontend Conformance §3/§5), followed by the sub-phase walk, reconciliation, gap disclosure, Component Contract Table, plan body, and Pass-3 plan.

---

## Architecture & boundary reconciliation (F-P2)

This is the F-P2 architecture-and-boundary reconciliation required of a Pass 1 VEP. The change is **additive and boundary-preserving**:

- **Mount model (VA-T4, architecture §3A.5) — unchanged.** Theo remains mounted in-shell via Module Federation; TheoSurface stays the single exposed remote portaling nav + main into the Origin-provided slots. Anchor: "hosting in Origin changes neither the gateway nor the context-only app-context contract" and "Theo exposes its mountable surfaces (navigation section + main/chat view) as federated module(s) the Origin shell consumes, receiving the shell". The two new props ride the existing in-process prop seam (the same seam that already carries `appContext`, `navSlot`, `mainSlot`, `getAccessToken`); they add nothing to the federation boundary, the gateway, tool-dispatch, or the app-context contract.
- **Boundary.** No gateway/model-call change; no service/contracts-module change; no tool-dispatch change; no `corporate-reporting` / `reporting_*` change; no browser storage; no styling-system conversion. `vault-origin` consumes these optional props host-side (additive) and is out of scope for this `vault-theo` VEP.
- **Cross-repo note (prose only, not in the Rule Anchor Table).** The Vault Origin App Host Contract (`vault-origin/docs/architecture/VAULT_ORIGIN_APP_HOST_CONTRACT.md` §6A) governs the Theo mount mechanism and the in-process context seam, but it does **not** enumerate the `TheoSurface` prop list. Because both new props are OPTIONAL and additive (absent ⇒ current behavior), they require **no App Host Contract amendment**. This file is intentionally excluded from the Rule Anchor Table because the linter resolves anchor paths against the `vault-theo` repo root only.

---

## UI Authority Reconciliation (F-P2)

| Authority | Scope in this change | Classification | Anchor |
|-----------|----------------------|----------------|--------|
| VA-T1 (reference surface, wide) | Wide-viewport rendered surface | **UNCHANGED** — no wide-viewport pixels change; the header-hide rule is gated `@media (max-width: 767.98px)` | VA-T6 §4.1 "On wide viewports the VA-T1 surface is reproduced exactly; the narrow-viewport rules do not alter the wide rendered surface." |
| VA-T4 (mount model) | Federation + mount seam | **UNCHANGED** — additive optional props on the existing prop seam | §3A.5 "hosting in Origin changes neither the gateway nor the context-only app-context contract" |
| VA-T6 (narrow hosted surface) | Narrow-viewport chrome: hide TheoMain's 54px header when the host owns the single top bar | **VISUAL-AUTHORITY-DEVIATION** (rendered-surface change on narrow), anchored to VA-T6 | VA-T6 §4.1 "the 9/10 main view fills the viewport and Theo's nav is reached through the Origin shell's off-canvas drawer"; driving authority "the driving vision authority is the landed VO1 §2B / §10B / §12." |

**Classification decision — header-hide-on-narrow = VISUAL-AUTHORITY-DEVIATION (not silently within-scope).** Golden Component Pack §5 is categorical: "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." Hiding TheoMain's own `<header>` on narrow viewports **is** a change to the rendered surface, so — even though it only occurs ≤767.98px and only when the host opts in via `suppressNarrowHeader` — it is classified **VISUAL-AUTHORITY-DEVIATION** and anchored to VA-T6, whose narrow-viewport authority establishes single-column reflow with the Origin shell owning the mobile chrome (drawer + single top bar), driven by the landed Origin VO1 §2B/§10B/§12. Governor §4 confirms this is the required treatment: "A planned visual deviation must be cited and classified (VISUAL-AUTHORITY-DEVIATION) with a Rule Anchor, or it is invalid." The `newChatNonce` prop is **not** a visual deviation (it fires the existing `newChat()`; it changes no pixels) and needs no visual classification.

---

## Gap Disclosure (F-P2.5)

Gap Register — vocabulary PROCEED / PRE-LAND / ESCALATE:

- **G1 — PRE-LAND (F-P1 sourcing).** The Phase 1A Frontend Plan §3 pass table has no row for this Apps-Phase-B B1 microstep, yet the sourcing rule states "a Pass-1 Frontend VEP MUST cite its pass row here. New passes are added to this table by a Role-C update before their VEP is authored; a pass is never inferred." **PRE-LAND:** a Role-C update adding the Apps-Phase-B / B1 pass row to §3 (Touches: `vault-theo` + `vault-origin` additive) MUST land before Pass 3 execution so the microstep is properly sourced. This plan does not invent the row; it is sourced provisionally against VA-T6 (a CURRENT registered §4B authority) and the Apps-Phase-B program direction, and the gap is surfaced for Codex/Walter.
- **G2 — PRE-LAND (VA-T6 clause scope).** VA-T6 §4.1 authorizes the narrow-viewport single-column reflow and that "Theo's nav is reached through the Origin shell's off-canvas drawer" (Origin owns the mobile chrome; driving authority VO1 §2B/§10B/§12), but it does **not** yet explicitly enumerate suppressing TheoMain's own 54px header to prevent a stacked double header under the host's single top bar. The header-hide is within VA-T6's "Origin owns the mobile chrome" intent, but the specific suppression is not spelled out. **PRE-LAND:** a VA-T6 §4.1 Role-C clause making the double-header suppression explicit (Theo's own narrow header yields to the Origin single top bar when the host requests it) should land alongside/before Pass 3. Meanwhile the change is classified VISUAL-AUTHORITY-DEVIATION and anchored to VA-T6 (F-P2), so nothing proceeds unanchored.

No ESCALATE items (VA-T6 is a CURRENT, registered authority; this is a clarifying extension, not a missing-authority halt). This is not a `NO-GAPS` turn.

---

## Component Contract Table (F-P5)

**Row 1 — `TheoSurface`** (Theo surface; ACTIVE; the exposed `theoApp/TheoSurface` remote)

(a) Prop / input interface — full updated `TheoSurfaceProps` (existing props preserved; two new OPTIONAL props appended; required-before-optional satisfied — all props optional; no `any`):

```ts
export interface TheoSurfaceProps {
  // EXISTING — unchanged
  appContext?: AppContext;                          // inbound Origin app-context (in-process; App Host §6A)
  navSlot?: HTMLElement | null;                     // shell nav slot; portal target
  mainSlot?: HTMLElement | null;                    // shell main slot; portal target
  getAccessToken?: () => Promise<string | null>;    // Entra token provider (mock -> live gateway)
  // NEW — additive, optional, backward-compatible (absent => current behavior)
  suppressNarrowHeader?: boolean;                   // when true, hide TheoMain's own top header on narrow (<=767.98px) so the Origin host bar is the single header
  newChatNonce?: number;                            // when this value CHANGES, TheoSurface invokes the existing t.newChat() to start a fresh chat (skips initial mount)
}
```

(b) Visual authority citation — VA-T4 (Theo-in-Origin Mount Layout; Frontend Conformance §4B; `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §3A + `governance/THEO_1A_FRONTEND_HANDOVER.md` §4) for the federated mount seam the props ride; VA-T6 (Narrow-Viewport Hosted Surface; §4B; 1A handover §4.1) for the narrow-chrome behavior `suppressNarrowHeader` drives. Both VA-ids are registered in §4B (verified this turn).

(c) Data / contract dependency — **None — UI prop seam; no backend/API contract.** `newChatNonce` triggers the existing in-memory `t.newChat()` (`useTheoState.ts:191`); no wire/mocked-gateway contract is added or consumed.

**Row 2 — `TheoMain`** (Theo surface; ACTIVE; rendered by TheoSurface in both the hosted portal branch and the standalone branch)

(a) Prop / input interface — full updated `TheoMainProps` (required `t`, `mode` first; one new OPTIONAL flag appended; no `any`):

```ts
export interface TheoMainProps {
  t: ReturnType<typeof useTheoState>;   // EXISTING (required) — the single state tree owned by TheoSurface
  mode: "full" | "panel";               // EXISTING (required) — "full" = 9/10 landing; "panel" = in-app right panel
  suppressNarrowHeader?: boolean;       // NEW — additive, optional; when true, TheoMain hides its own top header on narrow (<=767.98px) viewports only
}
```

(b) Visual authority citation — VA-T6 (Narrow-Viewport Hosted Surface; §4B; 1A handover §4.1) — the authority for hiding TheoMain's own 54px header on narrow so the Origin host bar is the single header; wide-viewport header behavior stays VA-T1-faithful. Registered in §4B (verified this turn).

(c) Data / contract dependency — **None — UI prop seam; no backend/API contract.** Purely presentational; `suppressNarrowHeader` only toggles a CSS class controlling a media-query header-hide.

---

## Plan body (intended edits — Pass 3, plan-only here)

**Edit 1 — `src/theo/TheoSurface.tsx`: extend `TheoSurfaceProps`.** Append the two optional props to the interface (as in the Component Contract Table Row 1) and destructure them in the `TheoSurface({ … })` signature: `appContext, navSlot, mainSlot, getAccessToken, suppressNarrowHeader, newChatNonce`.

**Edit 2 — `src/theo/TheoSurface.tsx`: `newChatNonce` effect (skip initial mount).** Add a change-detecting effect that fires the existing `t.newChat()` only when `newChatNonce` changes, never on first mount. Because `newChat` is a plain function recreated each render, hold it in a ref so the effect can depend solely on `newChatNonce`:

```ts
const newChatRef = useRef(t.newChat);
newChatRef.current = t.newChat;                 // always latest, no dep churn
const nonceInitRef = useRef(true);
useEffect(() => {
  if (nonceInitRef.current) { nonceInitRef.current = false; return; } // skip initial mount
  newChatRef.current();                          // fire only on subsequent changes
}, [newChatNonce]);
```

(Add `useRef` to the existing `import { useEffect } from "react"`.)

**Edit 3 — `src/theo/TheoSurface.tsx`: forward the suppress flag + add one media-query rule.** Pass `suppressNarrowHeader` to `TheoMain` in BOTH render branches: hosted `createPortal(<TheoMain t={t} mode="panel" suppressNarrowHeader={suppressNarrowHeader} />, mainSlot)` and standalone `<TheoMain t={t} mode="full" suppressNarrowHeader={suppressNarrowHeader} />`. Append one rule to the existing `STYLE_BLOCK` (which is rendered in both branches), matching the existing `@media (max-width: 767.98px)` idiom:

```css
@media (max-width: 767.98px){ .vo-suppress-narrow-header > header{ display:none !important; } }
```

**Edit 4 — `src/theo/components/TheoMain.tsx`: accept + apply the flag.** Add `suppressNarrowHeader?: boolean` to `TheoMainProps`; destructure it; add the class to the root `<div data-theo-main-mode={mode}>` only when true, e.g. `className={suppressNarrowHeader ? "vo-suppress-narrow-header" : undefined}`. The existing 54px `<header>` remains a direct child of that root, so the `> header` selector hides exactly it, and only ≤767.98px. No markup, palette, typography, spacing, or wide-viewport behavior changes.

**Boundary statement.** Additive and backward-compatible: both TheoSurface props and the TheoMain flag are OPTIONAL; absent ⇒ byte-identical current behavior (standalone dev harness passes neither, so it is unchanged). The ONLY rendered-surface change is the narrow (≤767.98px) header-hide when the host sets `suppressNarrowHeader` (classified VISUAL-AUTHORITY-DEVIATION, anchored to VA-T6). Wide-viewport surface is unchanged (VA-T1-faithful). No change to the gateway/model call, the service/contracts module, tool-dispatch, the app-context contract, the federation boundary, browser-storage posture, or the styling system; no `corporate-reporting`/`reporting_*` touch; `vault-origin` host wiring is out of scope for this VEP.

---

## Pass-3 plan

**Build/typecheck gate.** `npm run typecheck` and `npm run build` MUST be clean. Optional props are additive, so existing call sites (standalone harness; current Origin mount) type-check unchanged.

**Component Structural Mirror note (F-I2 preview).** At Pass 3 the structural-mirror table will classify: TheoSurface prop additions + `newChatNonce` effect = **ALLOWED DELTA** (additive wiring, no rendered-surface change — Golden Pack §5); TheoMain prop addition = **ALLOWED DELTA**; the narrow header-hide media rule = exactly **one VISUAL-AUTHORITY-DEVIATION** on narrow, anchored to VA-T6. No EXACT-region regressions on wide.

**SWA test plan (Walter, dev SWA).**
- **Mobile (viewport ≤767.98px, host sets `suppressNarrowHeader`):** exactly one top bar (the Origin host bar); Theo's own 54px header is hidden — no stacked double header. The chat/main view fills the column. The wide surface's other regions render normally.
- **Mobile — one-tap new chat:** tapping the host top-bar "New chat" (which bumps `newChatNonce`) starts a fresh Theo chat (messages cleared, back on the Chats view) without a page reload; it does NOT fire on initial mount.
- **Wide (>768px):** Theo's header is present and the surface is byte-faithful to the current build (VA-T1) — the header-hide rule does not apply; new-chat via nonce still works if the host wires it.
- **Backward-compat:** with neither prop supplied (standalone dev harness / unchanged host), behavior is identical to today on both viewports.

Pass 3 proceeds only against a Codex-APPROVED VEP and after the G1 pass-row and G2 VA-T6 Role-C clauses are landed.

---

*End of Pass 1 Frontend VEP — plan only. No application source modified; no commit; no push.*
