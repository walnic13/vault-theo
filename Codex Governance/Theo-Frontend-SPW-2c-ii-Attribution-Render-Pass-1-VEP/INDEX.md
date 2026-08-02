# Codex Governance Package — SPW Phase 2c-ii Attributed Multi-Party Render (Pass 1 Frontend VEP)

- **Main artifact:** `Theo_Frontend_SPW_2cii_Attribution_Render_Pass_1_VEP.md` — Pass-1 Frontend VEP (plan only; Codex Pass 2).
- **Scope:** the "who said what" render (VA-T12 surface A) — a per-turn BYLINE (roster photo + name + "Owner/You" tag) shown in a MULTI-AUTHOR thread; private single-author thread unchanged (VA-T1). Composer "reply posts as you" note in a shared thread.
- **CCT:** CCT-1 ChatView (+ new `people` prop, byline render) · CCT-2 AuthorByline (GREENFIELD, VA-T12) · CCT-3 Message/PersistedMessage (+`created_by`) · CCT-4 useTheoState (paintConversation maps created_by).
- **Data:** deployed — `theo_get_conversation` messages[].created_by (§2.1, 2b-3d) resolved via `theo_list_people` roster (§2.9). No new backend/service.
- **VA:** cites VA-T12 (registered §4B). **Shared-in-project banner deferred to 2c-iii** (needs publish state).
- **Grounding parent:** vault-theo `7646afde4c60363c9efc6539cd560f0e0e9f6b0f`; tip-independent blob anchors.
- **Pass-3:** implement on `development` → **Walter dev-SWA Visual Acceptance** (private = no bylines; shared = author photo/name/tags).
