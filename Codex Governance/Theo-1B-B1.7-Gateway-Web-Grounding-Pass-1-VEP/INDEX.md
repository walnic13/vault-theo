# Codex Governance Package — Theo 1B B1.7 Gateway Internet Grounding — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B1_7_Gateway_Web_Grounding_VEP.md` — full Pass-1 Backend VEP (plan only) with the complete copy-paste replacement handler.
- **Deploy package:** `DEPLOY.md` — Azure copy-paste steps (handler byte-identical to §HG.3; `function.json` unchanged; optional `THEO_WEB_*` settings). Apply only after Codex APPROVES.
- **Pipeline:** Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Deploy = Walter (Pass 3); Claude Code runs golden curls.
- **HEAD:** vault-theo `69af037913c91cb304b660e57b144e99b2c0d789` (`development`).
- **Microstep:** enable Anthropic server-side `web_search` + `web_fetch` on the deployed `theo_message` gateway → live-web-grounded Theo answers with citations. Within HF-T1 scope + architecture §2.3.
- **Feasibility:** golden-curl-proven this turn against the deployed Foundry endpoint — `web_search` 200 (`web_search_requests:1`, citation, current answer); `web_fetch` 200 with `anthropic-beta: web-fetch-2025-09-10` (`web_fetch_requests:1`).
- **Delta (confined):** `api/theo_message/index.js` upstream call only — add `tools:[web_search, web_fetch]` + the web-fetch beta header + env-configurable `max_uses`/allowlist constants. `function.json` unchanged. Everything else byte-identical to the deployed B1 handler (§SM: EXACT except 3 regions; verified by diff). Citations already flow on the returned `text` blocks (no response-shape change).
- **Verification:** §HG.1 byte-identical to deployed `theo_message`; §HG.3 + §HG.1 both `node --check` clean; diff = exactly the 4 intended insertions.
- **Out of scope (paired follow-up):** frontend citation-chip rendering (Walter-directed; separate FE VEP). B1.7 makes the citation data available.
- **Lint:** `tools/lint_microstep_submission.mjs … --repo-root .` → PASS (exit 0).
- **Requested verdict:** Codex APPROVED or REJECTED.
