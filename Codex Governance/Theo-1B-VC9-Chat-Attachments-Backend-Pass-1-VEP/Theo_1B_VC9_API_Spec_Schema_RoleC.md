# Theo 1B — VC-9 Chat Attachments: API-Spec §2.10 + Schema §3 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-9 reality. **APPROVED / REJECTED only.** Codex, please finish with the `[Codex Pass 4]` **commit**.

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `70567bb7426ecf76662b76950092761f5bca1cbd` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-07) VC-9 reality — API-Spec §2.10 `read / send messages` row gains the attachment request/projection fields + the `theo_chat_attachment_download` route + the reused `theo_create_attachment_upload` note; Schema §3 `theo_chat_messages` row gains the four `attachment_*` columns + the widened body CHECK + the coherence CHECK. Migration run by Walter + verified (V1–V3); handlers deployed + golden-verified (see the sibling `VC9_Pass_3_Deploy_Evidence.md`). Two verbatim before/after edits against the committed specs.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row) | `grep -o` row tail this turn | `8e2655a5aa8b2c6815a3a6d852ff46d1365d5adb` |
| 2 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` row) | `grep -o` row tail this turn | `b53d043f6a97f9e8ccc71ca73a88dcc88ae1c630` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | EDIT 1 — attachment fields + download route |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Message within a chat thread" | EDIT 2 — attachment columns + CHECKs |

## Verbatim edits (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10 — append the VC-9 attachment note at the end of the `read / send messages` row

**BEFORE (exact substring):**
```
The gate is a cooperative application-layer write-gate layered on the unchanged membership/RLS boundary. | `theo_chat_messages` + `theo_chat_threads` + Web PubSub |
```
**AFTER (exact):**
```
The gate is a cooperative application-layer write-gate layered on the unchanged membership/RLS boundary. **VC-9 — DEPLOYED 2026-07-07 (attachment IS a message):** `theo_chat_send_message` accepts an optional `attachment { blob_path, filename, content_type }` and `body` becomes optional when an attachment is present (a message must carry a non-empty body OR an attachment); the caller may only reference a blob under their own owner-scoped key `attachments/<oid>/<uuid>` (written by the reused `POST /api/theo_create_attachment_upload` `cw` SAS issuer), and the backend HEADs the blob for the AUTHORITATIVE byte size (client-claimed size is ignored). `list_messages`/`send_message` messages now also carry `attachment` (`{ filename, content_type, byte_size } | null`; the raw `blob_path` is NEVER projected, and a tombstoned message masks it to `null`). `POST /api/theo_chat_attachment_download` `{ message_id }` → **200** `{ message_id, filename, content_type, byte_size, downloadUrl, method:"GET", expiresAt }` mints a 15-min, single-blob, read-only user-delegation SAS (with a `Content-Disposition` filename) ONLY after the RLS select confirms thread membership; not visible / no attachment / deleted → **404**; bad `message_id` → **400**. Malformed/unsupported (`UNSUPPORTED_MEDIA_TYPE`) or not-owned attachment → **400**; a referenced blob that was never uploaded → **400 `ATTACHMENT_NOT_FOUND`**. | `theo_chat_messages` + `theo_chat_threads` + `theo-content` Blob (func-chat managed identity) + Web PubSub |
```

### EDIT 2 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 — append the attachment columns + CHECKs at the end of the `theo_chat_messages` row

**BEFORE (exact substring):**
```
A reply is an ordinary INSERT carrying the extra column; the `theo_chat_message_insert` WITH CHECK is column-agnostic, so RLS is unchanged. | DEPLOYED — VC-1 (§8) |
```
**AFTER (exact):**
```
A reply is an ordinary INSERT carrying the extra column; the `theo_chat_message_insert` WITH CHECK is column-agnostic, so RLS is unchanged. **VC-9, DEPLOYED 2026-07-07 (attachment IS a message):** `attachment_blob_path text NULL`, `attachment_filename text NULL`, `attachment_content_type text NULL`, `attachment_byte_size bigint NULL` — a per-message pointer into the existing `theo-content` blob container (owner-scoped key `attachments/<sender-oid>/<uuid>`; body lives in Blob, the row holds only the pointer). The `theo_chat_messages_body_ck` CHECK was WIDENED so a live message needs a non-empty body (1..8000) OR an attachment (`(body IS NOT NULL) OR (attachment_blob_path IS NOT NULL)`); a new `theo_chat_messages_attachment_ck` keeps the four attachment columns all-NULL or all-present (`byte_size >= 0`). The raw `blob_path` is exposed to clients ONLY as an `attachment` preview (`{ filename, content_type, byte_size }`, masked to `null` on a tombstone); downloads are minted per-request by `theo_chat_attachment_download` (membership-gated read SAS). No RLS change. | DEPLOYED — VC-1 (§8) |
```

## Scope note
API-Spec §2.10 + Schema §3 only. No Plan delta (the VC tier is recorded). No handler/code change (documents deployed reality). No RLS/policy change (the attachment INSERT rides the existing column-agnostic `theo_chat_message_insert`; the download rides `theo_chat_message_select`).

*End of Role-C Verbatim-Edit Handoff.*
