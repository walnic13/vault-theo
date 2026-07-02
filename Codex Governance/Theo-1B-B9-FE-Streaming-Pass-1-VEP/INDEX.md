# Codex Governance Package — Theo 1B B9-FE Streaming Pass-1 VEP

- **Main artifact:** `Theo_1B_B9_FE_Streaming_VEP.md` — Pass-1 frontend VEP (plan). Reviewer = Codex (Pass 2).
- **Scope:** the FE half of B9 streaming — repoint chat at the deployed `theo_message_stream` sidecar, render tokens live, rotating "silly processing terms" status word during the pre-first-token gap, and a collapsible Thinking panel (Foundry `thinking_delta` passthrough verified). Additive affordances (VISUAL-AUTHORITY-DEVIATION, §WALTER-AUTH); existing bubble/composer unchanged.
- **Changed files (5, in `proposed-src/theo/`):** `types.ts` (Message.thinking), `services/gateway.live.ts` (+sendMessageStream/StreamHandlers), `services/theoClient.ts` (passthrough), `useTheoState.ts` (send reworked to stream), `components/ChatView.tsx` (+StatusLine +ThinkingPanel + streaming render). NOT applied to `src/` (Pass 3 on approval).
- **Validation:** `npm run typecheck` + `eslint` (5 files) + `npm run build` → all clean (this turn). Microstep lint → PASS.
- **Backend dependency:** `theo_message_stream` deployed + golden-verified (`.local/b9_streaming_verify_2026-06-30.txt`).
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2).
- **HEAD:** vault-theo `a42a75ef522a43a28ba78a2599ff4a3c2afc7f43`.
