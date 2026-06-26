# Codex Governance Package — Theo 1B B1.5 Frontend Gateway Swap — Pass 1 VEP

- **Main artifact:** `Theo_1B_B1_5_FE_Gateway_Swap_VEP.md` — full Pass-1 Frontend VEP (plan only).
- **Pipeline:** Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2).
- **HEAD:** vault-theo `966dafd94571a53b48d9f6dacfe1f71414f3e5ea` (`development`).
- **Microstep:** Theo Phase 1B Backend Plan §7 **Tier B1.5** — swap the single chat-service call (`theoClient.sendMessage`) from the in-repo mock to a live `fetch('/api/theo_message')` (the B1 gateway, deployed + golden-curl-verified) so Theo answers with real Claude in the Origin SWA. **No rendered-surface change** (behind the service boundary).
- **Scope:** 2 components — `theoClient` (ACTIVE; import `./gateway.mock` → `./gateway.live`) + `gateway.live` (NEW/GREENFIELD; fetch + request/response mapping). VA-T1 unchanged. No storage/Tailwind/`reporting_*` change.
- **Classification:** VISUAL-AUTHORITY-MATCH (surface unchanged); swap = ALLOWED DELTA (Golden §5 — wiring the service call to the gateway abstraction). `gateway.mock.ts` retained (unimported).
- **Requested verdict:** Codex APPROVED or REJECTED.
