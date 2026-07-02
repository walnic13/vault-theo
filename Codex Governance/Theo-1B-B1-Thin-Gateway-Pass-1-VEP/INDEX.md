# Codex Governance Package — Theo 1B B1 Thin Model Gateway (HF-T1) — Pass 1 VEP

- **Main artifact:** `Theo_1B_B1_Thin_Gateway_VEP.md` — full Pass-1 Verified Evidence Pack.
- **Pipeline:** Vault Theo backend. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Walter deploys.
- **Controlling review path:** `Codex Governance/Theo-1B-B1-Thin-Gateway-Pass-1-VEP/Theo_1B_B1_Thin_Gateway_VEP.md`
- **HEAD:** vault-theo `development` (committed below). Cross-repo Primary Reference: corporate-reporting `eafa2b3`.
- **Microstep:** Plan §7 **Tier B1 — Thin model gateway (HF-T1), stateless** — `POST /api/theo_message` brokers a chat turn to Claude via Azure AI Foundry (connection proven 2026-06-26). No `theo_*` persistence (Tier B3).
- **Scope:** 1 NEW handler (`theo_message`) + `function.json`. Primary Reference (mirror) = `reporting_probe_dms_connection` (inlined verbatim). Foundry-call = ALLOWED DELTA, Walter-authorized (T12). No SQL, no schema, no `reporting_*`/`theo_*` access.
- **Mechanical lint:** `node tools/lint_microstep_submission.mjs … --repo-root .` → **PASS (exit 0)**.
- **Requested verdict:** Codex APPROVED or REJECTED.
- **File list:** `INDEX.md`, `Theo_1B_B1_Thin_Gateway_VEP.md`.
