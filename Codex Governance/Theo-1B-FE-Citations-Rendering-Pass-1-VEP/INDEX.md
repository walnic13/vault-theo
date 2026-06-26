# Codex Governance Package — Theo 1B Frontend Citations Rendering — Pass 1 VEP

- **Main artifact:** `Theo_1B_FE_Citations_Rendering_VEP.md` — full Pass-1 Frontend VEP (plan only).
- **Pipeline:** Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2).
- **HEAD:** vault-theo `8e766829e380034d723a394485bec006952a31bb` (`development`).
- **Microstep:** render B1.7's `web_search` citations as clickable **source chips** beneath assistant answers. The citation data already reaches the client (B1.7, golden-curl-verified); this adds the display.
- **Scope:** 2 ACTIVE-modify rows — `ChatView` (render the chips) + `useTheoState` (collect citations in `send`); plus the `types.ts` contracts (`Citation` + `Message.citations?` + widened `GatewayResponse`). `gateway.live.ts` unchanged. No storage/Tailwind/route/`reporting_*` change.
- **Classification:** additive **VISUAL-AUTHORITY-DEVIATION** on VA-T1 (a new surface element), Walter-authorized verbatim (§WA), styled in the existing `.vo-chip` vocabulary (no redesign). Chip row renders only when citations are present.
- **Lint:** `tools/lint_microstep_submission.mjs … --repo-root .` → PASS (exit 0).
- **Requested verdict:** Codex APPROVED or REJECTED.
