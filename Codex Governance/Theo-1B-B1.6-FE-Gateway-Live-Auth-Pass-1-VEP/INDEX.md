# Codex Governance Package — Theo 1B B1.6 Frontend Gateway Live-Auth — Pass 1 VEP

- **Main artifact:** `Theo_1B_B1_6_FE_Gateway_Live_Auth_VEP.md` — full Pass-1 Frontend VEP (plan only).
- **Pipeline:** Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2).
- **HEAD:** vault-theo `6fe8ef8ae4502c7ad9d0c30a258a95c57df5033e` (`development`).
- **Supersedes:** the B1.5 VEP (`Codex Governance/Theo-1B-B1.5-FE-Gateway-Swap-Pass-1-VEP/`). B1.5 wired the live gateway as a **same-origin** `fetch("/api/theo_message")` with **no Authorization** — wrong: Origin has no `/api/*` proxy, and the handler 401s without an EasyAuth identity. B1.6 corrects the client.
- **Microstep:** Theo Phase 1B Backend Plan §7 **Tier B1.5**, corrected — point the single chat call (`theoClient.sendMessage`) at the deployed gateway via an **absolute** `${VITE_FUNCTIONS_URL}/api/theo_message` `fetch` with `Authorization: Bearer <user-token>` (golden-curl-verified 200). **No rendered-surface change.**
- **Scope:** 3 ACTIVE-modify components — `gateway.live` (absolute URL + Bearer + mock fallback), `theoClient` (+`configureGateway`), `TheoSurface` (+optional `getAccessToken` prop). VA-T1 unchanged. No storage/Tailwind/`reporting_*` change.
- **Classification:** VISUAL-AUTHORITY-MATCH (surface unchanged); gateway wiring = ALLOWED DELTA (Golden §5).
- **Paired dependency (G-1, PRE-LAND):** vault-origin App Host Contract VEP (`Bolt Governance/VO-AH-Theo-Token-Provider-Pass-1-VEP/`) passes `ctx.getAccessToken` to the Theo mount. Live Claude in Origin needs **both** packages to land.
- **Lint:** `tools/lint_microstep_submission.mjs … --repo-root .` → PASS (exit 0).
- **Requested verdict:** Codex APPROVED or REJECTED.
