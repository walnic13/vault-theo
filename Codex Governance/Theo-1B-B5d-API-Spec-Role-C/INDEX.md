# Codex Governance Package — Theo 1B B5d API-Spec Role-C

- **Main artifact:** `Theo_1B_B5d_API_Spec_Role_C_Handoff.md` — Pass-4 Role-C verbatim-edit handoff. Author = Claude Code (Role-C). Inline executor = Codex.
- **What it does:** ONE edit to `spec/THEO_API_SPEC.md` §2.2 — appends the deployed owner-gated `member_count` field to the B5c row's `theo_list_projects` field list (closes the non-blocking B5d-backend Gap Register G-3 doc scrap).
- **Authority:** B5d backend Codex-APPROVED @ `f3868e6`, deployed + golden-verified (owner private+invite → `member_count=1`, non-owner row → 0 no-leak).
- **Shape:** exact BEFORE/AFTER; anchor verified a unique substring; documentation only; no source/handler/schema change (`member_count` is a computed owner-gated SELECT expression, not a stored column).
- **Currency:** vault-theo HEAD `cdaf6d6`; target spec blob `0441bc7`.
- **Pipeline:** Codex executes verbatim per Codex Review §4 (open with a governance-bound GCR + Rule Anchor Table). Final doc scrap of the B5 tier.
