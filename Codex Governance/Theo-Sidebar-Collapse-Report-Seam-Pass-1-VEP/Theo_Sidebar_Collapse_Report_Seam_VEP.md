# Theo Sidebar-Collapse Report Seam — Pass 1 Frontend VEP (remote side of the 1/10 icon-strip collapse; parity with Dottie)

> Companion to the Dottie sidebar-collapse work (Walter: "both Dottie + Theo together"). Theo's internal `Sidebar` has a "Toggle sidebar" button that flips `collapsed` (`railW = collapsed ? 58 : 270`). Mounted in Origin the host owns the 1/10 panel width, so a collapsed 58px rail sits inside a wider panel (a dead gap). To let the host shrink the 1/10 panel to icon-strip width when Theo is collapsed, the surface must **report** its collapse to the host. This package is the **REMOTE side**: `TheoSurface` gains an optional `onSidebarCollapsed?(collapsed: boolean)` prop, fired when the internal `t.collapsed` changes — the exact ref-held idiom already used for `onNavState`. The Origin side (host consumes it → panel width, for both Theo's persistent mount and Dottie's surface mount) is a companion vault-origin package. FE-only; no backend/route/schema.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack (host↔remote collapse-report seam; remote side)
Grounding parent (source baseline): `da430853c288852ae250fb134c842d5416088379` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

Working-tree disclosure (Class B, non-blocking): untracked `.tmp/` and `artifacts/*.xlsx` workbook files are present; none are tracked/modified, none used as grounding evidence for this turn.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD / proposed) |
| - | ------------------------------- | ------------------------------ | -------------------------------------------- |
| 1 | VISUAL/ARCH AUTHORITY — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (Pass B — Theo mounted in Origin; nav as a permanent collapsible 1/10 section; federated modules) | `Grep`(lines 40, 59) this turn | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 2 | FE Grounding Conformance — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR + Rule Anchor) | grounded; unchanged @ HEAD | `4f2f42e799be5db31e1e35e523d656ff4c1c057e` |
| 3 | FE Governor — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (reproduce faithfully / no redesign) | grounded; unchanged @ HEAD | `3afec7ea4b13650ce2bf28bf32073179a35e7b24` |
| 4 | Codex FE Review — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (Pass-2; APPROVED/REJECTED only) | grounded; unchanged @ HEAD | `25cc488091d619d8f6642b10552df0d019a87933` |
| 5 | PRIMARY REFERENCE / CHANGED — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/TheoSurface.tsx` (the single federated surface; adds `onSidebarCollapsed` seam mirroring `onNavState`) | `Read`(§126–137) + `Edit` this turn | base @HEAD `c03088ae7ae5337e03e971211f11505909140c3e` → proposed `e620f74f173ed3e70ed41f12976c7c394a0a9b36` |

No ChatGPT advisory cited. No backend / route / schema / migration; one ACTIVE source file.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text (read this turn) | Applied in output at |
| -------------------------- | --------- | ------------------------------------- | -------------------- |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1A_FRONTEND_PLAN.md | Pass B | "nav as a permanent collapsible 1/10 section" | §1 — the 1/10 is collapsible; the seam reports the internal collapse so the shell can size the panel to icon-strip width |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1A_FRONTEND_PLAN.md | Pass B | "expose them as federated module(s)" | §1 — the surface is a federated remote the Origin shell consumes; the seam is a one-way host-integration report (App Host §6A in-process, never postMessage) |

---

## §1 — Feature
Theo's internal `Sidebar` "Toggle sidebar" button flips `collapsed` (`railW = collapsed ? 58 : 270`). Standalone that narrows the rail; mounted in Origin, the host owns the 1/10 panel width (Theo is mounted as "a permanent collapsible 1/10 section", "expose[d] … as federated module(s)"), so a collapsed 58px rail sits inside a wider panel — the same dead gap Walter flagged on Dottie. This package adds an optional `onSidebarCollapsed?(collapsed: boolean)` prop to `TheoSurfaceProps`, fired whenever internal `t.collapsed` changes — the exact ref-held idiom already used for `onNavState` (report internal nav state to the host). The host-side response (panel → icon-strip width) is a **separate vault-origin package**; this remote change is inert until a host wires the callback (standalone unaffected). The full disappear-collapse (re-click the active rail icon → Origin `panelCollapsed`) is already shell-owned and untouched.

## §2 — Architecture & boundary
One ACTIVE file, `TheoSurface.tsx`: (a) `TheoSurfaceProps` gains `onSidebarCollapsed?: (collapsed: boolean) => void` (optional, additive — existing callers unchanged); (b) it is destructured in the component signature; (c) a ref-held reporting effect fires `onSidebarCollapsedRef.current?.(t.collapsed)` keyed on `t.collapsed` — identical pattern to the adjacent `onNavState` effect. No change to `Sidebar`, `useTheoState`, the portal branch, the standalone branch, or any other prop. No new file/component/route/backend/schema/dependency. **Not a redesign** — a one-way host-report seam mirroring the existing `onNavState`/`backNonce`/`newChatNonce` host-integration seams. Byte-symmetric with the Dottie seam (same component lineage).

## §3 — Verification (this turn, local)
`tsc --noEmit -p tsconfig.app.json` → **exit 0**. `npm run build` → **clean** (TheoSurface federated chunk emits, 331.60 kB). This turn, on `development` @ `da43085`. The seam is optional and standalone/unwired hosts are unaffected (the ref is undefined → the effect's optional-chain no-ops). End-to-end behaviour (panel shrinks to icon-strip) is exercised once the companion vault-origin package wires the callback + drives the panel width (§GAP G-1).

## §CCT — Component Contract Table
| Component (file) | Prop / input interface (TS) | Visual authority (VA-id) | Data / contract dependency |
| --- | --- | --- | --- |
| `TheoSurface` (`TheoSurface.tsx`) | `TheoSurfaceProps` gains `onSidebarCollapsed?: (collapsed: boolean) => void` — optional, additive; fired on internal `t.collapsed` change; all existing props (`appContext`, `navSlot`, `mainSlot`, `getAccessToken`, `suppressNarrowHeader`, `newChatNonce`, `onNavigate`, `onNavState`, `backNonce`) unchanged | THEO_PHASE_1A_FRONTEND_PLAN Pass B (Theo nav = collapsible 1/10 federated surface the shell owns) | none new — reports existing `useTheoState().collapsed`; host consumption is the companion Origin package |

## §GAP — Gap Disclosure
**PROCEED.**
- **G-1 — Host side is a companion package.** The 1/10 panel actually shrinks to icon-strip width only once the vault-origin package wires `onSidebarCollapsed` through the mount → `ShellFrame` → `ShellLeftPanel` (icon-strip width when collapsed) for both the Theo persistent mount and the Dottie surface mount. This remote seam is a safe, inert-until-consumed precondition. Disclosed; sequenced next.
- **G-2 — Symmetric with Dottie.** The identical seam is already committed in vault-dottie's `TheoSurface` (`5cb6fb9`); this is the Theo half of Walter's "both together". Disclosed.
- **G-3 — Full disappear-collapse unchanged.** Re-click the active rail icon → Origin `panelCollapsed` (panel gone) is already shell-owned; not touched here. Disclosed.

## §DELTA — changed files (before → after evidence)
One file (GCR row 5). `TheoSurface.tsx` (`c03088ae`→`e620f74f`): adds the optional `onSidebarCollapsed` prop to `TheoSurfaceProps` (with a doc comment), destructures it in the component signature, and adds the ref-held reporting effect (keyed on `t.collapsed`) directly after the existing `onNavState` effect. No other bytes changed; `Sidebar`/portal/standalone branches untouched.

## §CODEX — activation (Walter forwards)

```
Codex is activated for Pass-2 FRONTEND review of the Theo Sidebar-Collapse Report Seam, vault-theo,
"Codex Governance/Theo-Sidebar-Collapse-Report-Seam-Pass-1-VEP/Theo_Sidebar_Collapse_Report_Seam_VEP.md" @ commit <HEAD>.
Open Pass-2 with a governance-bound GCR + Rule Anchor Table; hard-gate; emit only APPROVED or REJECTED. FE-only, no
backend/schema/route. Parity with the committed Dottie seam (Walter: "both Dottie + Theo together"). Theo's Sidebar "Toggle
sidebar" flips internal collapsed (railW 270->58) but the host owns the 1/10 panel width (Theo mounted as "a permanent
collapsible 1/10 section", "expose[d] as federated module(s)"), so a collapsed rail leaves a dark gap. Fix (remote side):
TheoSurface gains optional onSidebarCollapsed(collapsed) fired on internal t.collapsed change — the SAME ref-held idiom as the
adjacent onNavState reporting effect. Inert until a host wires it; standalone unaffected. The Origin side (consume it -> panel
width, for both the Theo persistent mount and the Dottie surface mount) is a companion vault-origin package (G-1). The full
disappear-collapse (re-click rail icon -> Origin panelCollapsed) is already shell-owned and untouched. Review: not a redesign —
one ACTIVE file, one additive optional prop + one reporting effect mirroring onNavState; Sidebar/portal/standalone branches
unchanged; existing callers unchanged. tsc exit 0 + vite build clean. Mechanical lint PASS. Emit APPROVED or REJECTED only.
```

*End of Theo Sidebar-Collapse Report Seam Pass-1 Frontend VEP.*
