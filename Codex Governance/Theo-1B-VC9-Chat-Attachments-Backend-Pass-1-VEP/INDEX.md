# VC-9 — Chat attachments (attachment IS a message) — Pass 1 Backend VEP (index)

**Regime:** Theo backend (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development` @ `e6b88df`. **Lint:** `tools/lint_microstep_submission.mjs` → **PASS**. **Data model:** Walter-confirmed — one file per message bubble.

## Microstep
Attach ONE file to a chat message. A migration adds four nullable `attachment_*` columns to `theo_chat_messages` + relaxes the body CHECK (a live message may be attachment-only) + a coherence CHECK. `send_message` accepts an optional `attachment { blob_path, filename, content_type }`, re-asserts caller-ownership of the blob key, **HEADs the blob for the authoritative size**, and persists + projects it (body becomes an optional caption). `list_messages` projects the `attachment` preview. A NEW `theo_chat_attachment_download` mints a membership-gated read SAS so recipients can download. The DEPLOYED `theo_create_attachment_upload` (cw SAS) is **reused unchanged**.

## Files
| File | Role |
| ---- | ---- |
| `Theo_1B_VC9_Chat_Attachments_Backend_VEP.md` | Pass 1 VEP: GCR + Rule Anchor + P1–P8 + §MIGRATION + §SM + §EXT + §HG.1/§HG.2/§HG.3 + §API-SPEC + §DEPLOY + §CURL. |
| `vc9_attachment_migration.sql` | Walter-run migration (4 columns + widened body CHECK + coherence CHECK; additive/reversible). |
| `theo_chat_send_message.index.js` (MODIFY) | Deployable — attachment accept/validate/HEAD/persist/project (on the VC-19 base). |
| `theo_chat_list_messages.index.js` (MODIFY) | Deployable — `attachment` projection (on the VC-13 base). |
| `theo_chat_attachment_download.index.js` (NEW) + `.function.json` | Deployable — membership-gated read SAS. |
| `theo_chat_send_message.function.json` / `theo_chat_list_messages.function.json` | UNCHANGED (byte-exact deploy). |
| `deterministic_note_to_codex.md` | Short pointer Walter forwards to Codex. |

## Scope facts
- **Privacy:** a caller may only attach `attachments/<own-oid>/<uuid>`; the raw blob_path is NEVER projected; downloads are per-request, membership-gated, 15-min read SAS.
- **No new external system** — reuses the DEPLOYED MI user-delegation SAS signer (inlined full in §EXT for byte-diff) + the blob-HEAD technique. No `theo_attachments` table (chat attachments are a distinct per-message pointer). No RLS change.
- All three handlers `node --check` clean; the VEP's inlined code byte-matches the deployable artifacts (§SM matches the deployed VC-19 send; §EXT matches the deployed upload signer).

## Pass 3 (on Codex APPROVE)
Walter runs the migration; Claude Code deploys the NEW download handler + two overwrites to `vaultgpt-func-chat` (Kudu VFS; inventory 17→18) + golden curls, then the Role-C (Pass 4) API-Spec §2.10 + Schema §3 deltas. **VC-9-FE** (composer attach + upload orchestration + bubble render + download) is a separate vault-origin microstep.
