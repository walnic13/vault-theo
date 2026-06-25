# Theo 1A — Pass C (Nav-Controls Width Cap) — Pass 1 VEP package

- **Main artifact:** `Theo_1A_Pass_C_Controls_Cap_VEP_Plan_Only.md` — the full Pass-1 Frontend VEP (plan only).
- **Author:** Claude Code (Pass 1). **Reviewer:** Codex (Pass 2).
- **HEAD:** `ccb4a5443ec76124416df3beee36d7b7452af7f7` (vault-theo, `development`).
- **Microstep:** Plan §3 **Pass C — "Acceptance & polish"**; second item = the hosted "New chat" + "Search" controls hold their VA-T1 intrinsic width (246px = 270 rail − padding) and stop growing when the Origin 1/10 is dragged wider (Walter SWA finding).
- **Scope:** vault-theo only. 1 ACTIVE component — `Sidebar` (internal `maxWidth: 246` on the two controls when `fluid`; props unchanged). No contract/federation/`vault-origin`/`reporting_*` change.
- **Classification:** VISUAL-AUTHORITY-MATCH (controls render at VA-T1 246px); cap = ALLOWED DELTA inline-style (Golden §5). No VISUAL-AUTHORITY-DEVIATION.
- **Companion:** the white-9/10-bg + left-panel-accordion items are **vault-origin** (Reporting-FE regime) — a separate VEP.
