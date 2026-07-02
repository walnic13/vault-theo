# Codex Governance Package — Theo 1A Pass B (Theo-in-Origin Mount + App-Context) — Pass 1 VEP

**Pipeline:** Vault Theo frontend · Author = Claude Code (Pass 1) · Reviewer = Codex (Pass 2) · Authority = Walter
**Microstep:** Theo Phase 1A Frontend Plan §3 **Pass B** (delivers acceptance #5 + #8)
**Status:** PLAN ONLY — awaiting Codex Pass 2. No implementation begun.
**vault-theo HEAD:** `c19d12a3699c345707858a9715787942084b4872` (`development`)

## Contents
- `Theo_1A_Pass_B_VEP_Plan_Only.md` — full Pass 1 VEP (GCR + Rule Anchors + F-P1…F-P7 + Gap Disclosure + Component Contract Table).

## Scope (vault-theo side)
Decompose the Pass-A `TheoShell` into a federated **`TheoSurface`** that mounts once and portals **`TheoNav`** (1/10 section) + **`TheoMain`** (9/10 landing / in-app right panel) into shell-provided slots, keeping a single `useTheoState`. Module Federation expose (no iframe). App-context ingress (`appContext` prop) + header chip (presentational, no fetch). Standalone dev harness + DEV injector retained.

## Key reviewer pointers
- **State-sharing:** one federated `TheoSurface` + React portals → single state tree (no cross-mount sync).
- **CCT:** TC-1 TheoSurface (GREENFIELD) · TC-2 TheoNav (ALLOWED DELTA of Sidebar) · TC-3 TheoMain · TC-4 app-context chip · TC-5 useTheoState · TC-6 theoClient · TC-7 appContextLabel · TC-8 dev injector.
- **Gap G-1 (PRE-LAND):** Origin-side hosting (1/10 slot, 9/10 host, right-panel toggle, `AppHostContext` accessor, consuming the remote) is **paired Reporting-FE work** (App Host §6A) — separate VEP/PR; acceptance #8 is cross-repo.
- Supersedes the earlier chip-only Pass B draft (never committed).
