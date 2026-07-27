# Theo FE — Mobile nav-drawer dismiss on destination select — Pass 1 Verified Evidence Pack (Plan Only)

Walter-reported (2026-07-27): on the phone, selecting a Theo nav destination (a recent, New chat, or a nav view) from the host's ☰ pop-out drawer navigates Theo but leaves the drawer open; it should dismiss. Theo's `Sidebar` is portaled into the host's nav slot, so Theo owns no drawer state — the host (Origin) opens/closes it. This VEP adds a host-facing **`onNavigate`** signal to `TheoSurface` that fires when the user picks a destination from the portaled nav, so the host can dismiss its drawer (VO1 §10B). One file: `src/theo/TheoSurface.tsx`. Optional prop; management-only actions (rename/delete/star/add-to-project), search, and section toggles deliberately do not fire it. No visual change; the companion host wiring is a separate vault-origin VEP.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Reviewer: Codex (Theo frontend review).
Turn issued against HEAD: vault-theo `7fd66c7c37da1d74fb3df4434271bbf9e9f20106`. Cited source unmodified at HEAD; the proposed file is carried under `proposed-src/`.

Documents read this turn (Full Baseline Grounding — the Theo FE baseline set):
- `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§5 Rule-Anchor obligation; §6 invalidity triggers; §4B Visual Authority Registry) — blob at HEAD.
- `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (Component Contract Table format; allowed delta) — blob at HEAD.
- `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (Pass-2 rubric) — blob at HEAD.
- VO1 (App-host shell authority) `…/corporate-reporting/frontend/governance/reference-artifacts/visiondocs/VO1-vault-origin-platform-shell.md` (§10B drawer dismiss-on-select).
- `src/theo/TheoSurface.tsx` (the portaled `Sidebar` + `createPortal(nav, navSlot)` mount seam).

## Rule Anchor Table

| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "MUST be backed by at least one Rule Anchor" | §2 classification (behavioral, non-visual) is anchored |
| C:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/corporate-reporting/frontend/governance/reference-artifacts/visiondocs/VO1-vault-origin-platform-shell.md | §10B | "Selecting a Theo destination, a file, a person, a channel, or a product from the drawer performs the action and dismisses the drawer." | §1 the behavior this signal enables (host dismisses its drawer on a Theo destination select) |

### Currency note (blob SHAs @ HEAD `7fd66c7c`)
- TheoSurface.tsx ACTIVE `2769273fc862f54abedbff4b0dedb0d24ca08f5f` → PROPOSED `ca28086a810e9036baaeb4be2569c48c736ce27c`.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Seam:** `TheoSurface` builds `nav = <Sidebar …/>` and, in the hosted branch, does `createPortal(nav, navSlot)` — so on the Origin phone app the Sidebar renders inside the host's ☰ drawer. Selecting a recent runs `t.selectRecent`, New chat runs `t.newChat`, and a nav view runs `t.go` — all Theo-internal; the host is never told, so its drawer stays open (VO1 §10B expects a destination select to dismiss the drawer).
- **Change (`TheoSurface.tsx`):** add optional `onNavigate?: () => void` to `TheoSurfaceProps`. Wrap exactly the three Sidebar **destination** callbacks so each runs Theo's handler and then fires the host signal: `onSelectRecent={(id) => { t.selectRecent(id); onNavigate?.(); }}`, `onNewChat={() => { t.newChat(); onNavigate?.(); }}`, `onNavigate={(k) => { t.go(k); onNavigate?.(); }}`. Management callbacks (`onRenameRecent`, `onDeleteRecent`, `onToggleStar`, `onAddToProject`), `onSearch`, and `onToggleCollapse` are left unwrapped, so managing/searching inside the drawer does not dismiss it.
- **Boundary:** one file; a single additive optional prop + three one-line callback wrappers. No visual/layout/animation change; `Sidebar`, `useTheoState`, and every other component are untouched. Standalone (no host) passes no `onNavigate`, so the callback is a no-op and standalone behavior is unchanged. No gateway/API/schema/tool change. Mount seam unchanged (same single `useTheoState` tree, same `createPortal`).
- **§4B Visual Authority Registry:** no new or changed VA — this is a behavioral signal with no rendered surface; no VA-id is introduced.

## §2 Classification
**Behavioral, non-visual** — an optional host-callback wiring. Not an EXACT/ALLOWED-DELTA/DEVIATION visual classification (no rendered change), so no VISUAL-AUTHORITY-* classification applies; anchored to FE Conformance §5 (every relied-upon rule appears) + VO1 §10B (the drawer-dismiss authority the signal serves).

## §3 Component Contract Table

| # | Component (ownership; NEW/ACTIVE) | Prop interface | Visual authority (VA-id) | API dependency |
|---|---|---|---|---|
| CT-1 | `TheoSurface` (Theo federated root; **ACTIVE**, modify) | Adds `onNavigate?: () => void` to `TheoSurfaceProps` (existing props unchanged: `appContext?`, `navSlot?`, `mainSlot?`, `getAccessToken?`, `suppressNarrowHeader?`, `newChatNonce?`). Fired only on a nav-destination selection; optional (absent ⇒ current behaviour). No render/visual change. | N/A — no rendered surface; §4B unchanged | None |

## §4 Gap Register
**PROCEED.**
- **G-1 — host must consume `onNavigate` to see the effect.** This VEP only emits the signal; the host (Origin) wiring that dismisses the drawer is a companion vault-origin VEP. Until that lands, `onNavigate` is an unused optional prop (no regression). **PROCEED.**
- **G-2 — which callbacks dismiss.** Only the three destinations (select recent / new chat / nav view) fire it; management/search/toggle do not — matching VO1 §10B ("selecting a destination … dismisses"), not management actions. **PROCEED.**
- **G-3 — no gateway/API/schema/tool/visual change; standalone unaffected.** PROCEED.

## §5 Verification (this turn)
- `npx tsc --noEmit` → **exit 0**.
- `npm run build` (vite federated build) → **exit 0**.
- `node tools/lint_microstep_submission.mjs` on this pack → PASS (see Pass-2).
- Post-land behaviour (with the companion host wiring): on the phone, tapping a recent / New chat / a nav view in the ☰ drawer navigates AND dismisses the drawer; managing a row or searching keeps it open; standalone unchanged.

## §6 Land (Pass-3, on APPROVAL)
Copy `proposed-src/theo/TheoSurface.tsx` → `src/theo/TheoSurface.tsx`; re-verify `tsc --noEmit` + `npm run build`; commit to `development`; deploy the federated remote per the normal vault-theo dev flow. Sequence: land this (emits `onNavigate`) before/with the companion vault-origin VEP (consumes it to dismiss the drawer).

## §7 Out of scope
No visual/layout change, no standalone drawer behavior, no gateway/API/schema/tool change. The host drawer-dismiss wiring is the companion vault-origin VEP.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code lands `TheoSurface.tsx` to `development` per §6.
