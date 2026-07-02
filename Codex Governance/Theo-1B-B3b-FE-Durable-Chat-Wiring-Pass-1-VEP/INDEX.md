# Codex Governance Package — Theo 1B B3b FE Durable-Chat Wiring — Pass 1 Frontend VEP

- **Main artifact:** `Theo_1B_B3b_FE_Durable_Chat_Wiring_VEP.md` — full Pass-1 Frontend VEP (plan only).
- **Pipeline:** Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Deploy = Walter (Pass 3); Walter SWA acceptance = Visual Acceptance Evidence.
- **HEAD:** vault-theo `c2027c9c968c6f31dfed66acce427e5c445f1410` (`development`).
- **Microstep:** Tier B3 FE half — (1) echo `conversation_id` (durable threads), (2) real Recents from `theo_list_conversations`, (3) click-to-reload via `theo_get_conversation` (incl. persisted citations). All behind the single `theoClient` boundary; faithful surface (no redesign).
- **Consumed contract:** API Spec §2.1 persist-turn / list / get rows (landed this session via the Conversation-History Role-C); deployed + golden-curl-verified (B3a/B3b).
- **CCT:** 7 ACTIVE modify rows (types, gateway.mock, gateway.live, theoClient, useTheoState, Sidebar, TheoSurface). ChatView/CitedText/TheoMain unchanged.
- **Gaps:** G-1/G-2/G-3 all PROCEED (standalone mock fallback; flat-citation reload; token provider already wired).
- **Lint:** PASS (exit 0).
- **Requested verdict:** Codex APPROVED or REJECTED.
