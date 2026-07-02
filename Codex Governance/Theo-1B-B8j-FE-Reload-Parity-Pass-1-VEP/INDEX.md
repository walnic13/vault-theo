# Codex Governance Package — Theo 1B B8j FE Reload-Parity Pass-1 VEP

- **Main artifact:** `Theo_1B_B8j_FE_Reload_Parity_VEP.md` — Pass-1 frontend VEP (plan). Reviewer = Codex (Pass 2).
- **Scope:** FE consumer of the deployed B8i backend — on thread reload, hydrate each user turn's attachment chips from `theo_list_conversation_attachments`, grouped by `message_seq`. Data-only; reuses the landed B8e `SentAttachments`/`Chip` rendering (no component/visual change). Closes the B8e G-3 reload-parity gap.
- **Changed files (4, in `proposed-src/theo/`):** `types.ts`, `services/gateway.live.ts`, `services/theoClient.ts`, `useTheoState.ts`. NOT applied to `src/` (Pass 3 applies on approval).
- **Validation:** `npm run typecheck` + `eslint` on all four → clean (this turn). Microstep lint → PASS.
- **Basis:** B8i deployed + golden-verified 2026-06-30 (`.local/b8i_reload_parity_verify_2026-06-30.txt`).
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2).
- **HEAD:** vault-theo `977331295c21851861546c742ab0b478e98cb63b`.
