# Codex Governance Package — Theo API Spec §2.1 route correction + DEPLOYED (Role-C)

- **Main artifact:** `Theo_1B_API_Spec_Route_DEPLOYED_RoleC.md` — Pass-4 Role-C Verbatim-Edit Handoff (lint PASS).
- **Pipeline:** Vault Theo backend regime · Pass 4 Role-C · Author = Claude Code · Executor = **Codex**.
- **HEAD:** vault-theo `1fd3870b81b35ce2378b77ced17396e5cb9e91fb` (`development`).
- **Edit:** `spec/THEO_API_SPEC.md` §2.1 — `1B-deployed` (`POST /api/theo/message`) → `1B-deployed` **DEPLOYED 2026-06-26** (`POST /api/theo_message`). Corrects the never-deployed slash route to the deployed underscore route + marks DEPLOYED (B1, golden-curl-verified).
- **Resolves:** the FE B1.5 **T22** (the VEP cites the deployed `theo_message`; the spec documented `/api/theo/message`). Part of the B1 close-out doc-update.
- **Lint:** `tools/lint_microstep_submission.mjs … --repo-root .` → PASS (exit 0).
