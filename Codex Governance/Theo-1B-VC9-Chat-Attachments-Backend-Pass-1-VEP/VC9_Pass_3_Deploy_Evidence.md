# VC-9 Chat Attachments — Pass 3 Deploy Evidence

**Feature:** VC-9 — attachment-is-a-message. Migration (4 `attachment_*` cols + widened body CHECK + coherence CHECK) + MODIFY `theo_chat_send_message` (accept/validate/HEAD/persist/project) + MODIFY `theo_chat_list_messages` (project, masked on tombstone) + NEW `theo_chat_attachment_download` (membership-gated read SAS). REUSE deployed `theo_create_attachment_upload` (monolith).
**VEP:** `Theo_1B_VC9_Chat_Attachments_Backend_VEP.md` — **Codex APPROVED** (Pass 2 R1, HEAD `70567bb`; lint PASS; `node --check` clean ×3).
**Authority:** Orchestration §1E / DR-T7 (deploy to `vaultgpt-func-chat` only). **Migration run by Walter** ("sql migration complete"). **Infra prereq done:** func-chat SystemAssigned MI + Storage Blob Data Contributor on `vaultgptstorage01` (provisioned this session). **Date:** 2026-07-07.

---

## 1. Migration verification (read-only, `codex_reporting_ro`, run BEFORE deploy)
- **V1** — the four columns exist: `attachment_blob_path` (text), `attachment_byte_size` (bigint), `attachment_content_type` (text), `attachment_filename` (text), all nullable. ✓
- **V2** — both CHECK constraints present: `theo_chat_messages_body_ck` + `theo_chat_messages_attachment_ck`. ✓
- **V3** — body CHECK confirmed WIDENED: `((deleted_at IS NOT NULL) OR (((body IS NULL) OR (length 1..8000)) AND ((body IS NOT NULL) OR (attachment_blob_path IS NOT NULL))))` (attachment-only messages allowed); coherence CHECK all-null-or-all-present with `byte_size >= 0`. ✓ Matches the approved §MIGRATION exactly.

## 2. Deploy (Kudu VFS surgical PUT; ARM bearer; no token logged)
- Baselines captured before overwrite; **byte-match** confirmed: live send == deployed VC-19; live list == deployed VC-13; download **absent** (404) pre-deploy.
- `theo_chat_send_message/index.js` → **204**; `theo_chat_list_messages/index.js` → **204** (overwrites, `If-Match: *`).
- NEW `theo_chat_attachment_download/{index.js,function.json}` → **201/201**.
- **Get-back** of all three re-fetched and `diff` (modulo CRLF) **byte-matches** the approved package source.
- Restart → inventory **17 → 18**; `theo_chat_attachment_download` registered.

## 3. Authenticated golden curls (az-login token for `api://4e1a1e31-…`, as `wmansfield@vault-tax.com`; structural — no OIDs/bodies)

A disposable channel + a 40-byte `text/plain` test blob uploaded to the caller's owner-scoped key `attachments/<oid>/<uuid>`.

| # | Check | Expected | Result |
| - | ----- | -------- | ------ |
| a | `send_message` bad `thread_id` | 400 | **400** `INVALID_REQUEST` |
| b | `send_message` text-only | 201, `attachment:null` | **201**, `attachment:null` |
| c | `send_message` attachment (no body) | 201, authoritative `byte_size`, no raw blob_path | **201**, `byte_size=40` (client sent no size — **MI HEAD proof**), `filename` set, no `attachment_blob_path` in payload |
| d | `send_message` attachment blob_path NOT under `attachments/<caller-oid>/` | 400 | **400** `INVALID_REQUEST` (ownership) |
| e | `send_message` attachment `content_type:"application/zip"` | 400 | **400** `UNSUPPORTED_MEDIA_TYPE` |
| f | `send_message` attachment referencing never-uploaded key | 400 | **400** `ATTACHMENT_NOT_FOUND` (HEAD 404) |
| g | `send_message` no body AND no attachment | 400 | **400** `INVALID_REQUEST` |
| h | `list_messages` | attachment msg carries `attachment`, no raw path; text msg `attachment:null` | **✓** both; `hasRawPath=false` on all |
| i | `attachment_download` (attachment msg) + GET the URL | 200 + bytes + Content-Disposition | **200** `{downloadUrl, filename, byte_size:40}`; GET → **200**, `Content-Disposition: attachment; filename="vc9_test.txt"` (**MI SAS proof**) |
| j | `attachment_download` (plain msg) / bad id | 404 / 400 | **404** `NOT_FOUND` / **400** `INVALID_REQUEST` |
| k | **Codex R1** — delete attachment msg → list masks → download denies | 200 / `attachment:null`+`deleted:true` / 404 | **200**; list shows `deleted:true` + `attachment:null`; `attachment_download` → **404** `NOT_FOUND` |

The two MI-dependent paths (c: blob HEAD; i: user-delegation read SAS) **prove the newly-provisioned func-chat managed identity + Storage Blob Data Contributor are functioning.** The R1 fix (k) is verified end-to-end.

## 4. Boundary
Migration run by Walter (not Claude Code). Deploy targets `vaultgpt-func-chat` only; monolith + sidecar READ-ONLY. RLS unchanged (the `theo_chat_message_insert` WITH CHECK is column-agnostic; download rides `theo_chat_message_select`). Blob access via the func-chat MI (Storage Blob Data Contributor) — no account key in handler code/env. The raw `blob_path` is never projected; downloads are per-request, membership-gated, 15-min read SAS.

**Residue:** one disposable channel ("VC-9 verify") + a 40-byte test blob at `attachments/<caller-oid>/…` — harmless (the referencing message is soft-deleted); the blob is cleanable by the deferred blob-GC tier.

## 5. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 (attachment fields on the message projection + the `theo_chat_attachment_download` route + reused upload note) + Schema §3 (`theo_chat_messages` attachment columns + widened body CHECK + coherence CHECK). Authored alongside as `Theo_1B_VC9_API_Spec_Schema_RoleC.md`.
- **VC-9-FE:** composer attach control + upload orchestration (calls the monolith `theo_create_attachment_upload` for the SAS) + bubble render + download (calls func-chat `theo_chat_attachment_download`).
