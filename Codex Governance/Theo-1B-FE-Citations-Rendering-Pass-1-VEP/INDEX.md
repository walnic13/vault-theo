# Codex Governance Package — Theo 1B Frontend Citations Rendering — Pass 1 VEP

- **Main artifact:** `Theo_1B_FE_Citations_Rendering_VEP.md` — full Pass-1 Frontend VEP (plan only). **Reproduces VA-T5.**
- **Pipeline:** Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2).
- **HEAD:** vault-theo `86ce982aaf0d3d478dbc961a5ec1b7019bc2f58e` (`development`).
- **Microstep:** render B1.7's `web_search` citations as the Claude-style inline affordance, **faithfully reproducing VA-T5** (`artifacts/theo-citations-reference.jsx`, registered §4B). Citation data already reaches the client (B1.7, golden-curl-verified real fields); this adds the display.
- **Scope:** 1 NEW component `CitedText`/`CitationMarker` (reproduces VA-T5) + `useTheoState` (build `{text,citations[]}` runs in `send`) + `ChatView` (render runs); `types.ts` contracts (`Citation`/`CitedRun` + `Message.runs?` + widened `GatewayResponse`). `gateway.live.ts` unchanged.
- **Classification:** VISUAL-AUTHORITY-MATCH (reproduce VA-T5; structural mirror, Golden §5); additive to VA-T1. Two Pass-3 hardenings: viewport-edge collision (G-2) + graceful favicon→globe fallback (G-1, ships safe; CSP allowlist a fast-follow).
- **Lint:** `tools/lint_microstep_submission.mjs … --repo-root .` → PASS (exit 0).
- **Requested verdict:** Codex APPROVED or REJECTED.
