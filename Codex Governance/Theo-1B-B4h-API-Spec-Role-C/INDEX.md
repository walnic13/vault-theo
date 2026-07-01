# Codex Governance Package — Theo 1B B4h API-Spec Role-C

- **Main artifact:** `Theo_1B_B4h_API_Spec_Role_C_Handoff.md` — Pass-4 Role-C Verbatim-Edit Handoff. Executor = Codex (inline).
- **Purpose:** finalize `spec/THEO_API_SPEC.md` §2.3 (Artifacts) from the `1A-contract` placeholder to the deployed B4h endpoints (`theo_upsert_artifact` / `theo_list_artifacts` / `theo_get_artifact` / `theo_delete_artifact`), mirroring how §2.2 Projects was finalized. Closes B4h-backend Gap Register **G-2**.
- **Edit:** 1 verbatim edit to 1 target — replace the single §2.3 placeholder row with the deployed upsert/list/get/delete contract (Blob-pointer version content; owner-scoped parent-link 404; cascade delete).
- **Authority:** the endpoints are DEPLOYED + golden-verified (2026-07-01; B4h-backend VEP Codex-APPROVED `9c9c4d8`; evidence `.local/b4h_artifacts_verify_2026-07-01.txt`). Documentation-only — no source/handler/schema change.
- **No companion edit:** Schema §3/§5 already records the tables + helper + FK.
- **Currency:** vault-theo HEAD `9c9c4d8`; target blob `82cc815`.
- **Pipeline:** Author = Claude Code (Role-C, Pass 4). Executor = Codex (Pass 4 inline).
