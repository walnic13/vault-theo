# Theo 1A — Pass C (Hosted-Nav Fit) — Pass 1 VEP package

- **Main artifact:** `Theo_1A_Pass_C_VEP_Plan_Only.md` — the full Pass-1 Frontend VEP (plan only).
- **Author:** Claude Code (Pass 1). **Reviewer:** Codex (Pass 2).
- **HEAD:** `dde1cfc0484e3e292f36ab9026fe5f5d5ef6fb2c` (vault-theo, `development`).
- **Microstep:** Plan §3 **Pass C — "Acceptance & polish"**; first item = the hosted Theo nav fits the Origin 1/10 left panel without horizontal overflow (Walter SWA finding on the Pass B mount).
- **Scope:** vault-theo only. 2 ACTIVE components — `Sidebar` (adds `fluid?: boolean`), `TheoSurface` (passes `fluid={!!(navSlot && mainSlot)}`). No contract, federation, dependency, or `vault-origin`/`reporting_*` change.
- **Classification:** standalone surface VISUAL-AUTHORITY-MATCH (VA-T1 270 rail preserved); hosted fluid width = ALLOWED DELTA (Golden §5 AD-visual; VA-T2 §3A.2 / VA-T3 §4 hosted-fit authority). No VISUAL-AUTHORITY-DEVIATION.
