# Codex Governance Package — Theo 1B B5 P2A API-Spec Role-C

- **Main artifact:** `Theo_1B_B5_P2A_API_Spec_Role_C_Handoff.md` — Pass-4 Role-C verbatim-edit handoff. Author = Claude Code (Role-C). Inline executor = Codex.
- **What it does:** ONE edit to ONE target — inserts a new **§2.9 People / roster** section into `spec/THEO_API_SPEC.md` documenting the deployed `theo_list_people` endpoint (delegated Graph OBO; roster of the `Vault Staff` group + live presence + photos; read-only; keyed by OID; no Theo DB/Blob).
- **Authority:** endpoint Codex-APPROVED @ `612374a`, deployed + golden-verified 2026-07-02 (200 full roster + live presence, 401 unauthenticated).
- **Shape:** exact BEFORE/AFTER; anchored on the §2.8 trailing paragraph ("All attachment endpoints execute as the signed-in user") → new §2.9 → unchanged `## §3 Boundary`. No source/handler/schema change; documentation only.
- **Currency:** vault-theo HEAD `612374a`; target spec blob `6f8723a`.
- **Pipeline:** Codex executes the edit verbatim per Codex Review §4, opening with a governance-bound GCR + Rule Anchor Table. Next after this lands → Phase 2B (vault-origin People panel).
