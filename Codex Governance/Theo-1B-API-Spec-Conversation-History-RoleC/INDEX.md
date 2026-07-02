# Codex Governance Package — API Spec §2.1 Conversation History (Role-C)

- **Main artifact:** `Theo_1B_API_Spec_Conversation_History_RoleC.md` — Pass-4 Role-C Verbatim-Edit Handoff.
- **Pipeline:** Theo backend regime. Author = Claude Code (Role-C). Inline executor = **Codex** (Pass 4).
- **Target:** `spec/THEO_API_SPEC.md` §2.1 — ONE verbatim edit, additive (re-emits the send-message row + appends 3 rows: persist-turn, list-conversations, get-conversation).
- **Why:** locks the deployed/approved B3a (`conversation_id` round-trip) + B3b (`theo_list_conversations` / `theo_get_conversation`) contract in the spec so the paired FE durable-chat-wiring VEP cites it (T22 prevention).
- **HEAD:** vault-theo `2a121fb49a3dafdace3042fd16d65feeabe29212`.
- **Lint:** PASS (exit 0).
