# Codex Governance Package — Theo 1B B5c API-Spec Role-C

- **Main artifact:** `Theo_1B_B5c_API_Spec_Role_C_Handoff.md` — Pass-4 Role-C verbatim-edit handoff. Author = Claude Code (Role-C). Inline executor = Codex.
- **What it does:** TWO edits to `spec/THEO_API_SPEC.md` §2.2 — (1) update the stale "Per-member invite … Phase 2" forward-reference in the B5a visibility row; (2) insert a row documenting the deployed `theo_share_project` / `theo_unshare_project` / `theo_list_project_members` endpoints + the member-shared read semantics + the new `shared_with_me` field on `theo_list_projects`.
- **Authority:** B5c backend Codex-APPROVED @ `8200683`, deployed + golden-verified 2026-07-02 (owner path share/unshare/list_members 200 + 400/401 negatives; member path via RO SQL — member sees shared private project, non-member/ex-member 0 rows).
- **Shape:** exact BEFORE/AFTER, both anchors verified unique substrings; documentation only; no source/handler/schema change.
- **Currency:** vault-theo HEAD `8200683`; target spec blob `30f1cac`.
- **Pipeline:** Codex executes verbatim per Codex Review §4 (open with a governance-bound GCR + Rule Anchor Table). Closes B5c-backend Gap Register G-2; then → **B5c-FE invite picker**.
