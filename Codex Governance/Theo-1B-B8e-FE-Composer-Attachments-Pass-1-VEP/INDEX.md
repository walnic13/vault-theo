# Codex Governance Package — Theo 1B B8e Composer Attachments + Paste-to-Attachment (Frontend) — Pass 1 VEP

- **Main artifact:** `Theo_1B_B8e_FE_Composer_Attachments_VEP.md` — Pass-1 **frontend** VEP (plan: Component Contract Table + prop interfaces + UI-authority reconciliation + gap disclosure). Reviewer = Codex (Pass 2).
- **Microstep:** Tier B8e — Claude-exact composer: paperclip attach control + upload via the deployed B8b SAS flow + attachment chips (status/remove/expandable preview) + **large-paste-to-attachment** (a paste ≥1,500 chars becomes a collapsed, expandable "Pasted text" chip). Reuses the deployed B8b→B8d backend 100% (files + pastes both → `attachment_ids`).
- **Validated implementation (Pass-3 payload):** `proposed-src/` — 6 changed files (5 full + the TheoMain ChatView-block edit), `tsc --noEmit` + `eslint` clean this turn. NOT applied to `src/` (applied at Pass 3 on approval).
- **Authority:** Primary Reference = ACTIVE `src/theo/components/ChatView.tsx` (blob 5f996792); VA-T1 reference surface; new affordances classified VISUAL-AUTHORITY-DEVIATION (Walter-directed §WALTER-AUTH, additive, VA-T1 tokens).
- **PRE-LAND:** G-1 Blob CORS on vaultgptstorage01 (browser PUT). **Follow-on:** B8f reload-parity list endpoint.
- **Regime:** Theo-FE (Codex-reviewed). Pipeline: Pass 1 VEP (this) → Pass 2 Codex → Pass 3 apply+SWA test+screenshot.
- **HEAD:** vault-theo `46948af80eafd88498fb3a92a406cd6751ece9ed`.
- **Lint:** PASS (exit 0).
