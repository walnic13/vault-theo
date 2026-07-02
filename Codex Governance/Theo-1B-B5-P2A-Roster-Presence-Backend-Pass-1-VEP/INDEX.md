# Codex Governance Package — Theo 1B B5 Phase 2A Roster/Presence (backend) Pass-1 VEP

- **Main artifact:** `Theo_1B_B5_P2A_Roster_Presence_Backend_VEP.md` — Pass-1 backend VEP (plan + handler). Reviewer = Codex (Pass 2).
- **Microstep:** Tier **B5 Phase 2A** — the roster/presence backend for the vault-origin "People" panel (Phase 2B). One GREENFIELD read handler `theo_list_people`.
- **What it does:** enumerates the **`Vault Staff`** dynamic group (employeeId-gated employees, id `86a86cad-…`) + **live Microsoft Graph presence** + best-effort photos, via **delegated Graph OBO** (same technique + env as the deployed `reporting_dms_tree`: `AAD_TENANT_ID`/`AAD_CLIENT_ID`(=4e1a1e31, the consented "Vault GPT API" app)/`AAD_CLIENT_SECRET`). Returns `{ people: [{ id(OID), displayName, email, jobTitle, availability, activity, photo, isSelf }], self }`. **Keyed by Entra OID** so the future in-Vault chat keys on OID pairs (chat-forward design).
- **No migration, no DB, no Blob, no new env/secret** — OBO config + admin-consented Graph scopes (`User.Read.All`/`Presence.Read.All`/`GroupMember.Read.All`) already present on the monolith (verified this turn).
- **Primary Reference:** deployed `theo_list_projects` pair (Family-B GET read + envelope), inlined verbatim (§SM/§SM-FJ). **OBO = DEVIATION** (new external-system helper) — byte-identical lift from deployed `reporting_dms_tree`, inlined (§SM-OBO).
- **Validation:** `node --check` clean; function.json JSON-valid; microstep lint → PASS; HEAD `6179bc0`.
- **Design-for-chat:** roster keyed by OID; the panel (2B) is a "People" container meant to grow a chat sub-view; presence-refresh seam later carries chat/typing. Native in-Vault chat = separate future project.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Walter deploys 1 function → golden curls → API-Spec Role-C → Phase 2B (vault-origin People panel, VO/Codex regime) → Phase 2C (per-member invite).
