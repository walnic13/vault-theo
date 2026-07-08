# VC-9.1 — Deploy `theo_create_attachment_upload` to func-chat (host-parity) — Pass 1 Backend VEP (index)

**Regime:** Theo backend (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development` @ `1f35c8e`. **Lint:** PASS. **Walter decision:** deploy the upload handler to func-chat (over the cross-app alternative) so the whole chat attachment flow is one host/audience.

## Microstep
Deploy the DEPLOYED, Codex-approved `theo_create_attachment_upload` (B8b SAS-signature-fix, blob `bc1aa7c5`) **byte-identically** to `vaultgpt-func-chat`. **No code change, no migration, no contract change (route already in API Spec §2.10) → no Role-C.** Rationale: `chatClient.ts` targets only `VITE_CHAT_API_BASE_URL` (func-chat); the upload-SAS step must be on that host. func-chat now has the MI + Storage Blob Data Contributor (provisioned + verified in VC-9) that this handler needs to mint the SAS. Theo keeps the monolith copy; chat uses func-chat's.

## Files
| File | Role |
| ---- | ---- |
| `Theo_1B_VC9_1_Upload_Handler_On_FuncChat_VEP.md` | Pass 1 VEP: GCR + Rule Anchor + P1–P8 + §SM + §DEPLOY + §CURL. |
| `theo_create_attachment_upload.index.js` | Deployable (byte-identical to the approved B8b `bc1aa7c5`). |
| `theo_create_attachment_upload.function.json` | Deployable (route `theo_create_attachment_upload`). |
| `deterministic_note_to_codex.md` | Short pointer Walter forwards to Codex. |

## Key facts
- **No new external system** — Blob is already used by func-chat (VC-9 send-HEAD + download-SAS, curl-verified). Same MI user-delegation technique, `cw` permission.
- **No DB/RLS** — the handler is stateless (SAS issuance only).
- Live monolith Kudu SCM wasn't reachable this turn (HTTP 000); the approved package blob `bc1aa7c5` (last approved change to this handler) is the source of truth. `node --check` clean; inlined code byte-matches the artifact.

## Pass 3 (on Codex APPROVE)
No migration. Claude Code deploys the handler to `vaultgpt-func-chat` (Kudu VFS; inventory 20→21) + a golden curl (upload SAS mints on func-chat MI + a PUT to the SAS works). No Role-C. Then **VC-9-FE** (single-host attachment flow: upload + send + list + download all on func-chat).
