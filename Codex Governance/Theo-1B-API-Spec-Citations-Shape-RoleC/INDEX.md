# Codex Governance Package — Theo 1B API Spec Citations Shape (Role-C)

- **Main artifact:** `Theo_1B_API_Spec_Citations_Shape_RoleC.md` — Pass-4 Role-C Verbatim-Edit Handoff (lint PASS).
- **Pipeline:** Vault Theo backend regime · Pass 4 Role-C · Author = Claude Code · Executor = **Codex**.
- **HEAD:** vault-theo `a7d70bc6795641c5c508ad5177b9882398700194` (`development`).
- **Edit:** `spec/THEO_API_SPEC.md` §2.1 Shape cell — document the deployed B1.7 `web_search`/`web_fetch` `citations[]` shape (`{type:"web_search_result_location", url, title, cited_text, encrypted_index}`) on text blocks. Additive, backward-compatible; golden-curl-verified.
- **Why:** locks the citation contract so the FE Citations Rendering VEP can cite it (resolves T22). BEFORE anchor unique (1×).
- **Lint:** `tools/lint_microstep_submission.mjs … --repo-root .` → PASS (exit 0).
