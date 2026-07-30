# Codex Governance Package — SPW Phase 2c-i Publish-to-Project Service Layer (Pass 1 Frontend VEP)

- **Main artifact:** `Theo_Frontend_SPW_2ci_Publish_Service_Pass_1_VEP.md` — Pass-1 Frontend VEP (plan only; Codex Pass 2).
- **Scope:** the FE service-module plumbing for SPW publish — 3 methods on the single service seam (`publishConversation` / `unpublishConversation` / `listPublishedProjectConversations`, on `projectsBase`) across `theoClient` + `gateway.live` + `gateway.mock`, plus one additive shared type `PublishedConversation` (mirrors the deployed `theo_list_project_conversations` row). NO visual surface (VA-T1 unchanged) — foundation for 2c-ii/iii/iv.
- **CCT:** CCT-1 (service seam methods) + CCT-2 (`PublishedConversation` type) — complete literal interfaces; VA n/a (service/type).
- **Backends:** DEPLOYED + golden-curl-verified this program (API §2.2).
- **Grounding parent:** vault-theo `d8c0d9c03d172e6d6f47aaee98fa0d3144ab84b4`; tip-independent blob anchors. Carrying commit named in the forward note.
- **Pass-3 acceptance (service-only):** tsc green + dev-SWA build + standalone smoke — NO SWA screenshot (no rendered surface).
