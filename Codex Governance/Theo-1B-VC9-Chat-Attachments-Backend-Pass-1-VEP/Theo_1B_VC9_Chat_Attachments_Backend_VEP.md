# Theo 1B — VC-9 Chat Attachments Backend (migration: attachment columns on `theo_chat_messages` + MODIFY `theo_chat_send_message`/`theo_chat_list_messages` + NEW `theo_chat_attachment_download`; REUSE deployed `theo_create_attachment_upload`) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). **Walter runs the migration at Pass 3 FIRST**, then Claude Code deploys to the **dedicated `vaultgpt-func-chat`** app (§1E / DR-T7) + runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 + Schema §3 deltas. Plan-only.
>
> **Scope (VC-9 = "attachment IS a message"):** a participant attaches ONE file to a chat message (WhatsApp/Slack idiom — Walter-confirmed data model). (1) a **migration** adding four nullable `attachment_*` columns to `theo_chat_messages` + relaxing the body CHECK so a live message may be attachment-only (NULL body); (2) **REUSE** the DEPLOYED `theo_create_attachment_upload` (issues the managed-identity user-delegation `cw` SAS, unchanged); (3) MODIFY `theo_chat_send_message` to accept an optional `attachment { blob_path, filename, content_type }`, verify caller-ownership of the blob, **HEAD the blob for the AUTHORITATIVE size** (never trust a client-claimed size), and persist + project it; (4) MODIFY `theo_chat_list_messages` to project the `attachment` preview; (5) NEW `theo_chat_attachment_download` — a membership-gated short-lived **read** SAS so recipients can download.
>
> **Privacy + auth:** a caller may only attach a blob under their OWN owner-scoped key `attachments/<oid>/<uuid>` (written by their own upload SAS); the raw `blob_path` is NEVER projected to clients — `list_messages`/`send_message` expose only `{ filename, content_type, byte_size }`, and a download URL is minted per-request by `theo_chat_attachment_download` ONLY after the RLS `theo_chat_message_select` policy confirms the caller is a participant of the message's thread. No RLS change (the `theo_chat_message_insert` `WITH CHECK` is column-agnostic).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `e6b88dfe349494a2b5dde20bf82488f539018a96` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-9 chat attachments (attachment-is-a-message). P1–P8 walked; additive+reversible migration (four nullable `attachment_*` columns + a relaxed body CHECK + a coherence CHECK) with verify SQL; Primary Reference = the DEPLOYED `theo_chat_send_message` (VC-19 state, carrying the archived write-gate) inlined byte-verbatim + its function.json; REUSE the DEPLOYED `theo_create_attachment_upload` (SAS signer — inlined full as the external-system technique reference) + the DEPLOYED `theo_finalize_attachment` blob-HEAD technique; one NEW handler (`theo_chat_attachment_download` — membership-gated read SAS) + two MODIFY (`send_message` accepts+persists+projects the attachment; `list_messages` projects it) inlined full. Client-claimed size is never trusted (blob HEAD is authoritative); the raw blob_path is never projected; a deleted message masks its attachment in BOTH read paths (Codex R1 — VC-12 "delete for everyone" parity). No RLS change (justified §P8). No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` / `theo_attachments` NOT touched (chat attachments are a distinct per-message pointer).
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register) | `grep -F "VEP Format"` + `grep -F "Gap Register"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4A P-track) | `grep -F "MUST open with a Grounding Conformance Receipt"` + `awk §4A.1` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary; §4 external-system) | `grep -F "selects **exactly one** deployed handler file"` + `grep -F "It MUST NOT read or write"` + `grep -F "new-domain or new-external-system helper"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis; §1E deploy exception) | `grep -F "Pass 1 (Claude Code VEP)"` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (ownership/sharing posture → VC tier recorded VC-1) | `grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` row — new columns; §7 `theo_attachments` blob-pointer convention) | `Read(§3+§7 rows)` + `grep -F "Body lives in Blob; the row holds only the pointer"` this turn | `b53d043f6a97f9e8ccc71ca73a88dcc88ae1c630` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row — attachment fields + the download route land at Pass 4) | `grep -F "read / send messages"` this turn | `8e2655a5aa8b2c6815a3a6d852ff46d1365d5adb` |
| 10 | **Primary Reference handler** (DEPLOYED message send — insert+seq+publish+gate the attachment path extends) — `Codex Governance/Theo-1B-VC19-Archived-Send-Gate-Backend-Pass-1-VEP/theo_chat_send_message.index.js` | `Read(full)` this turn; deployed get-back byte-matches | `fc7ef0e4f2a72d14265f3fe4cda86f825bc497d2` |
| 11 | **Primary Reference function.json** (DEPLOYED) — `Codex Governance/Theo-1B-VC19-Archived-Send-Gate-Backend-Pass-1-VEP/theo_chat_send_message.function.json` | `Read(full)` this turn | `0284d265cd81bec4c34b5513d46c41b7ba6601ff` |
| 12 | **External-system technique 1** (DEPLOYED SAS signer the download mirrors — MI user-delegation SAS) — `Codex Governance/Theo-1B-B8b-SAS-Signature-Fix-Pass-1-VEP/theo_create_attachment_upload.index.js` | `Read(full)` this turn | `bc1aa7c51ad5b55e84d4fa625b443cab70dc8175` |
| 13 | **External-system technique 2** (DEPLOYED blob-HEAD the send path mirrors — authoritative size) — `Codex Governance/Theo-1B-B8h-Large-Document-Handling-Pass-1-VEP/theo_finalize_attachment.index.js` | `Read(full)` this turn | `488a697aa5ea99986b5fb5e61167de6192292652` |
| 14 | **Modify basis 2** — DEPLOYED `theo_chat_list_messages.index.js` (the `attachment` projection extends this) — `Codex Governance/Theo-1B-VC13-Forward-Message-Backend-Pass-1-VEP/theo_chat_list_messages.index.js` | `Read(full)` this turn; deployed get-back byte-matches | `efa5e8bb6c122fc87e28dabfd9ddef85e5d611a6` |
| 15 | **RLS basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (`theo_chat_message_insert` WITH CHECK column-agnostic; `theo_chat_message_select` participant-scoped) | `Read(full)`/`sed` this turn; cited | `67ff9b5f654e146c01590d9ce0f9286969e54103` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` + streaming sidecar `vaultgpt-func-stream` READ-ONLY — deploy targets `vaultgpt-func-chat`. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` / `theo_attachments` NOT touched.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §MIGRATION + §SM + §HG + §API-SPEC + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P2.5 — VC tier Walter-directed; recorded VC-1 |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_send_message` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 / §EXT — Blob is the already-used external system; the download read-SAS reuses the deployed technique |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — VC-9 touches only `theo_chat_*` + the existing `theo-content` blob container |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — participant-scoped attachment is an ownership-family extension; no RLS change |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Message within a chat thread" | §P6 — the `theo_chat_messages` row gains four nullable columns |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §7 | "Body lives in Blob; the row holds only the pointer" | §P6 / §MIGRATION — the message row holds only the blob pointer (mirrors `theo_attachments`) |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | §API-SPEC — the attachment fields + download route land on this row |
| Codex Governance/Theo-1B-VC19-Archived-Send-Gate-Backend-Pass-1-VEP/theo_chat_send_message.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.1 — the attachment path keeps the deployed set_config triad + gates |
| Codex Governance/Theo-1B-B8b-SAS-Signature-Fix-Pass-1-VEP/theo_create_attachment_upload.index.js | owner-scoped key | "attachments/${oid}/${attachmentId}" | §HG.1 / §P8 — send re-asserts the caller owns `attachments/<oid>/<uuid>` |
| Codex Governance/Theo-1B-B8h-Large-Document-Handling-Pass-1-VEP/theo_finalize_attachment.index.js | blob HEAD | "AUTHORITATIVE byte size" | §HG.1 — send HEADs the blob for the authoritative size |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql | insert policy | "theo_chat_message_insert" | §P8 — the column-agnostic INSERT WITH CHECK is unchanged |

## P1 — Feature identification
**Microstep:** VC-9 — chat attachments under the Walter-confirmed **"attachment IS a message"** model: a file send persists ONE normal message row whose `attachment_*` columns point at a blob in the existing `theo-content` container; the bubble is one file plus an optional caption.

**Migration:** four nullable columns on `theo_chat_messages` (`attachment_blob_path`, `attachment_filename`, `attachment_content_type`, `attachment_byte_size`) + a relaxed `theo_chat_messages_body_ck` (a live message may be attachment-only) + a coherence CHECK (`theo_chat_messages_attachment_ck`, all-null or all-present).
**Reused (0 change):** `theo_create_attachment_upload` — the DEPLOYED managed-identity user-delegation `cw` SAS issuer (owner-scoped key `attachments/<oid>/<uuid>`, 15-min TTL). VC-9 supports EXACTLY its deployed content-type allow-list.
**New (1), on `vaultgpt-func-chat`:** `POST /api/theo_chat_attachment_download` `{ message_id }` → a membership-gated 15-min **read** SAS + a download URL.
**Modified (2):** `theo_chat_send_message` (accept/validate/HEAD/persist/project an attachment; body becomes an optional caption) + `theo_chat_list_messages` (project the `attachment` preview).

**Out of scope (VC-9):** the FE (composer attach control + upload orchestration + bubble render + download = vault-origin **VC-9-FE**); multiple files per message (v1 is one); attachment types beyond the deployed upload allow-list (pdf/png/jpeg/webp/gif/xlsx/xls/docx/pptx/csv/txt); server-side text extraction / AI ingestion (chat attachments are human-to-human, not injected into a model context — unlike Theo B8c); image thumbnailing/transcoding; virus scanning (a future hardening tier); GIF *search/picker* (that is VC-10, a distinct Azure-only subsystem).

**Plan status:** VC tier Walter-directed, reconciled at VC-1 ("sharing/membership RLS models (ownership-only unless Walter authorizes)"). Doc delta = API-Spec §2.10 (attachment fields + the download route) + Schema §3 (`theo_chat_messages` attachment columns) — Role-C, Pass 4.

## P2 — Architecture & boundary reconciliation
**Handler family.** All handlers are Family-B HTTP handlers mirroring the Primary Reference (`theo_chat_send_message`, VC-19 state): `pg` Pool; EasyAuth OID; validate-before-SQL; `set_config` triad; the atomic `INSERT … SELECT COALESCE(MAX(seq),0)+1` with `23505` retry; best-effort Web PubSub publish; `{data,meta}`/`{error}` envelope; anonymous `httpTrigger`. The send handler adds: parse the optional attachment descriptor, re-assert caller-ownership of the blob key, HEAD the blob (managed identity) for the authoritative size, persist the `attachment_*` columns. `list_messages` adds only the `attachment` projection. `theo_chat_attachment_download` is a new Family-B handler that reads the message under RLS (participant → 404 otherwise) and mints a read SAS with the SAME managed-identity user-delegation technique as the DEPLOYED `theo_create_attachment_upload` (permission `r`, plus a `Content-Disposition` for a filename download).
**Boundary.** Reads/writes only `theo_chat_*` (Postgres) + the existing `theo-content` blob container (via managed identity). Per Golden §3 ("It MUST NOT read or write" outside its domain) no `reporting_*`/monolith/Graph/Foundry, and NOT the Theo `theo_attachments` table (chat attachments are a distinct per-message pointer). Deploy target `vaultgpt-func-chat`; monolith + sidecar READ-ONLY.
**Validation before SQL.** UUID `thread_id`/`message_id`; structural attachment validation (blob_path owner-prefix + UUID id, filename non-empty, content-type in the allow-list) → deterministic 400 before any SQL.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| API-Spec §2.10 + Schema §3 will change (attachment fields on the message projection; the download route; the four new columns). | Documentation-currency delta on the recorded VC tier. | **PROCEED** with a Role-C (Pass 4): `spec/THEO_API_SPEC.md` §2.10 + `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3. Sequenced after Pass 3 deploy + curls. |
| Client-supplied attachment descriptor could forge a pointer to another user's blob or lie about size/type. | **Mitigated in the handler:** send re-asserts the blob key is exactly `attachments/<caller-oid>/<uuid>` (a caller can only reference a blob written by their OWN upload SAS), HEADs the blob for the AUTHORITATIVE byte size (client size is ignored), and only accepts allow-listed content-types. | **PROCEED** — ownership + HEAD + allow-list enforced server-side (§P8). |
| A send could reference a blob that was never actually uploaded (SAS issued, PUT skipped). | The send HEADs the blob first; absent → **400 `ATTACHMENT_NOT_FOUND`**, so no message row points at a missing blob. | **PROCEED** — explicit 400. |
| Recipients must download the raw file, but the raw `blob_path` must not leak (it embeds the sender OID + could be enumerated). | The projection exposes only `{ filename, content_type, byte_size }`; a download URL is minted per-request by `theo_chat_attachment_download` ONLY after the RLS select confirms thread membership; the SAS is single-blob, read-only, 15-min. | **PROCEED** — membership-gated per-request read SAS. |
| TOCTOU: a thread could be archived (VC-19) between the send's gate read and the INSERT. | Same benign cooperative-gate race disclosed + accepted in VC-19 §P2.5 (unchanged here; the archived gate is inherited verbatim from the Primary Reference). | **PROCEED** — inherited VC-19 behaviour. |
| FE not yet built (composer attach, upload orchestration, bubble render, download). | The backend loop is complete and curl-verifiable without the FE. | **PROCEED** — future trigger: **VC-9-FE** (vault-origin). |
| Orphaned blobs if a send fails after upload, or a message is later deleted. | Out of scope for VC-9 (a future blob-GC tier); a soft-deleted message keeps its pointer but the tombstone masks it (see the R1 row), and the download endpoint still requires visibility. Deliberately deferred — no correctness impact. | **PROCEED** — deferred GC noted. |
| **(Codex R1 — RESOLVED)** A deleted attachment message must not remain downloadable — VC-12 "delete for everyone" nulls the body, but the file content must be hidden too. | The VC-12 soft-delete (`theo_chat_delete_message`) sets `deleted_at` + nulls `body`; the attachment columns physically remain (no delete-handler change). VC-9 therefore **masks at read**: `list_messages` projects `attachment:null` when `deleted_at IS NOT NULL`, and `theo_chat_attachment_download` returns **404** for a deleted message BEFORE minting any SAS. So the file is unreachable via the API once deleted (blob_path is never exposed; the raw blob is GC'd by the deferred tier above). | **PROCEED** — read-time tombstone masking in both handlers; a curl in §CURL proves delete → list masks → download denied. |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**Blob is the ALREADY-USED external system** (the `theo-content` container; managed-identity data-plane access is DEPLOYED in `theo_create_attachment_upload` / `theo_finalize_attachment`). Per Golden §4, a "new-domain or new-external-system helper" needs justification; VC-9 introduces **no new external system** — it reuses (a) the deployed user-delegation SAS technique (the download handler mirrors `theo_create_attachment_upload`'s signer with permission `r` + a `Content-Disposition`), and (b) the deployed blob-HEAD technique (`theo_finalize_attachment`'s `getBlobProperties`) for the authoritative size. Web PubSub publish is reused unchanged. The full deployed SAS signer is inlined in §EXT so the download's signer is byte-diffable against it.

## P4 — Contract reconciliation
Envelope unchanged (`{data,meta}`/`{error}`).
- `theo_chat_send_message` `{ thread_id, body?, reply_to_message_id?, attachment? { blob_path, filename, content_type } }` → **201** `{ message }` where `message.attachment` is `{ filename, content_type, byte_size } | null`. `body` is now optional **iff** an `attachment` is present (else still required, non-empty ≤ 8000). Malformed attachment / not-owned blob / unsupported type → **400**; blob not uploaded → **400 `ATTACHMENT_NOT_FOUND`**; archived thread → **409** (VC-19, inherited); non-participant → **404**.
- `theo_chat_list_messages` → each message now also carries `attachment` (`{ filename, content_type, byte_size } | null`); the raw blob_path is never exposed.
- `theo_chat_attachment_download` `{ message_id }` → **200** `{ message_id, filename, content_type, byte_size, downloadUrl, method:"GET", expiresAt }`. Message not visible / no attachment → **404**; bad `message_id` → **400**.
- **REUSE (documented, unchanged):** `theo_create_attachment_upload` `{ filename, content_type }` → **201** `{ attachmentId, upload: { uploadUrl, blobKey, requiredHeaders, expiresAt, … } }`.

## P5 — Error-model reconciliation
Mirrors the Primary Reference: 401 / 400 (bad JSON, bad UUID, bad attachment descriptor, unsupported type — `isKnown` or direct) / 400 `ATTACHMENT_NOT_FOUND` (blob absent) / 404 (thread/message not visible) / 409 (archived — VC-19; seq exhaustion) / 403 (`42501`) / else 500. All new `isKnown` errors re-map through the existing `catch` branch; the `23514` field-constraint → 400 path is preserved (and now also catches a violated attachment/body CHECK as a defensive backstop).

## P6 — Data-shape reconciliation
Four additive nullable columns on `theo_chat_messages` (`attachment_blob_path text`, `attachment_filename text`, `attachment_content_type text`, `attachment_byte_size bigint`). The body CHECK is widened (a live row needs a non-empty body OR an attachment); a coherence CHECK keeps the four columns all-null or all-present. No new table/index — an attachment message is an ordinary INSERT carrying the extra columns; "Body lives in Blob; the row holds only the pointer" (mirrors `theo_attachments`, §7). The API exposes only `{ filename, content_type, byte_size }`; the raw blob_path is stored but never projected. Full DDL in §MIGRATION.

## P7 — Idempotency / concurrency
- Send is NOT idempotent (each call is a new message, as today). The seq INSERT keeps the atomic `INSERT … SELECT COALESCE(MAX(seq),0)+1` + `23505` retry byte-identical to the Primary Reference (now with the attachment columns in the column list).
- The blob HEAD is a pure read before the INSERT; it adds one MI-token fetch + one HEAD on the attachment path only (no effect on plain-text sends).
- `theo_chat_attachment_download` is a pure read + a stateless SAS mint (no write); repeatable, each call returns a fresh 15-min URL.
- `list_messages` is a pure read; the `attachment` projection adds no write and no ordering change.

## P8 — Security / RLS reconciliation
**No RLS change.** The deployed `theo_chat_message_insert` policy `WITH CHECK (sender_oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)))` is column-agnostic — adding the `attachment_*` columns doesn't change what it evaluates. The download read rides `theo_chat_message_select` (participant-scoped) — a caller can only mint a download URL for an attachment on a message they can already see (non-visible → 404, no existence leak). Participant-scoped attachment is an ownership-family extension ("Default family: ownership-based"). No `SECURITY DEFINER`; no new elevated read.
**Blob-pointer forgery defence.** A caller may only attach `attachments/<their-own-oid>/<uuid>` — the send handler re-asserts the exact owner prefix + a UUID id, so a caller cannot attach a blob they didn't upload (the upload SAS only ever writes under their own OID). The authoritative byte size is read from the blob (HEAD), never trusted from the client. Only allow-listed content-types are accepted.
**Download-URL scope.** The minted SAS is single-blob, read-only, `https`-only, 15-min, with `Content-Type` pinned and a `Content-Disposition` filename; the raw blob_path is never returned to the client (only the opaque, expiring URL). Managed identity signs via a short-lived user-delegation key (no account key in code/env).
**Tombstone masking (Codex R1).** VC-12 "delete for everyone" nulls the body; VC-9 extends the same invariant to the FILE. `list_messages` projects `attachment:null` when `deleted_at IS NOT NULL`, and `theo_chat_attachment_download` returns **404** for a deleted message BEFORE minting any SAS — so once a sender deletes an attachment message, the file is no longer retrievable by ANY participant, even one who captured the `message_id` earlier. (The blob itself is reclaimed by the deferred blob-GC tier; masking makes it API-unreachable immediately.)
**No leakage.** Responses/publishes carry only `{ filename, content_type, byte_size }` + (for download) the expiring URL — no tokens, no OIDs, no raw blob path.

## §MIGRATION — `vc9_attachment_migration.sql` (additive + reversible; run by Walter at Pass 3 BEFORE the handler deploy)

Additive columns are idempotent (`ADD COLUMN IF NOT EXISTS`); the body CHECK is dropped+re-added (widened); the coherence CHECK is guarded. No top-level transaction control (Golden §5.2); Walter executes. `-- label` comments only (no psql meta-commands).

```sql
-- Theo VC-9 — chat attachments (attachment IS a message). ADDITIVE + REVERSIBLE. Run by Walter at
-- Pass 3 BEFORE the VC-9 handler deploy. Adds four nullable attachment columns to theo_chat_messages
-- and relaxes the body CHECK so a live message may carry an attachment with NO caption (body NULL).
-- Idempotent; safe to re-run.
--
-- Design notes:
--  * One file per message ("attachment IS a message"): a send with a file persists a normal message row
--    whose attachment_* columns point at a blob in the existing `theo-content` container. No new table.
--  * The blob body lives in Blob; the row holds only the pointer (mirrors theo_attachments, §7).
--  * attachment_blob_path is the owner-scoped key `attachments/<sender-oid>/<id>` written by the caller's
--    own upload SAS (theo_create_attachment_upload); theo_chat_send_message re-asserts the caller owns it
--    and HEADs the blob for the AUTHORITATIVE byte size + content-type (client-claimed values are ignored).
--  * NO RLS change. The theo_chat_message_insert WITH CHECK is column-agnostic; the attachment columns
--    ride the existing participant-scoped policy. The raw blob_path is NEVER projected to clients — a
--    read SAS is issued per-request by theo_chat_attachment_download after a membership check.
--  * body CHECK amendment: a live row (deleted_at IS NULL) must now have EITHER a non-empty body (1..8000)
--    OR an attachment; a tombstone (deleted_at IS NOT NULL) is unconstrained (body already nulled).
--  * attachment coherence CHECK: the four attachment columns are all-NULL (no attachment) or all-present.

-- 1) Additive columns (idempotent).
ALTER TABLE public.theo_chat_messages
  ADD COLUMN IF NOT EXISTS attachment_blob_path    text   NULL,
  ADD COLUMN IF NOT EXISTS attachment_filename     text   NULL,
  ADD COLUMN IF NOT EXISTS attachment_content_type text   NULL,
  ADD COLUMN IF NOT EXISTS attachment_byte_size    bigint NULL;

-- 2) Relax the body CHECK: a live message may be body-only OR attachment-only OR both.
--    Drop the VC-12 constraint and re-add the widened one (guarded so a re-run is a no-op).
DO $mig$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
      AND con.conname = 'theo_chat_messages_body_ck'
  ) THEN
    ALTER TABLE public.theo_chat_messages DROP CONSTRAINT theo_chat_messages_body_ck;
  END IF;

  ALTER TABLE public.theo_chat_messages
    ADD CONSTRAINT theo_chat_messages_body_ck
    CHECK (
      -- tombstone: body already nulled by the soft-delete; unconstrained here.
      (deleted_at IS NOT NULL)
      OR
      -- live: body (if present) is 1..8000, AND at least one of body / attachment is present.
      (
        (body IS NULL OR (length(body) >= 1 AND length(body) <= 8000))
        AND (body IS NOT NULL OR attachment_blob_path IS NOT NULL)
      )
    );
END
$mig$;

-- 3) Attachment coherence: the four attachment columns are all-NULL or all-present (guarded).
DO $mig$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
      AND con.conname = 'theo_chat_messages_attachment_ck'
  ) THEN
    ALTER TABLE public.theo_chat_messages
      ADD CONSTRAINT theo_chat_messages_attachment_ck
      CHECK (
        (attachment_blob_path IS NULL AND attachment_filename IS NULL
           AND attachment_content_type IS NULL AND attachment_byte_size IS NULL)
        OR
        (attachment_blob_path IS NOT NULL AND attachment_filename IS NOT NULL
           AND attachment_content_type IS NOT NULL AND attachment_byte_size IS NOT NULL
           AND attachment_byte_size >= 0)
      );
  END IF;
END
$mig$;
```

**Read-only verification (run after the migration):**

```sql
-- Theo VC-9 — read-only verification (run after vc9_attachment_migration.sql). SELECT-only.

-- V1) the four attachment columns exist with the expected types/nullability.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_chat_messages'
  AND column_name IN ('attachment_blob_path','attachment_filename','attachment_content_type','attachment_byte_size')
ORDER BY column_name;

-- V2) both CHECK constraints exist (widened body CHECK + the coherence CHECK).
SELECT con.conname
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace n ON n.oid = rel.relnamespace
WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
  AND con.contype = 'c' AND con.conname IN ('theo_chat_messages_body_ck','theo_chat_messages_attachment_ck')
ORDER BY con.conname;
```

## §SM — Primary Reference (DEPLOYED `theo_chat_send_message.index.js`, byte-verbatim — the insert+seq+publish+gate pattern VC-9's attachment path extends)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the DEPLOYED **`theo_chat_send_message`** (current VC-19 state — carries the archived write-gate). VC-9's attachment logic slots into this handler. Blob `fc7ef0e4f2a72d14265f3fe4cda86f825bc497d2`:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const MAX_BODY = 8000;
const REPLY_PREVIEW_MAX = 200; // VC-11: cap the quoted-parent snippet to bound the payload.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
// VC-11: shape a parent-message preview for a reply (bounded body snippet). null when there is no parent.
// VC-12: a tombstoned parent has body NULL + deleted:true (the FE renders "message deleted").
function replyPreview(row) {
  if (!row) return null;
  return {
    id: row.id,
    seq: Number(row.seq),
    sender_oid: row.sender_oid,
    body: typeof row.body === "string" ? row.body.slice(0, REPLY_PREVIEW_MAX) : row.body,
    deleted: row.deleted_at != null,
  };
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const threadId = typeof body.thread_id === "string" ? body.thread_id.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'thread_id' is required and must be a valid UUID.", 400));
  }
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'body' is required and must be non-empty.", 400));
  }
  if (text.length > MAX_BODY) {
    return send(context, 400, errorBody("PAYLOAD_TOO_LARGE", `Message exceeds ${MAX_BODY} characters.`, 400));
  }
  // VC-11: optional reply target. Absent → a normal message. Present → must be a well-formed UUID here,
  // and (checked under RLS below) an existing message IN THE SAME THREAD.
  let replyToId = null;
  if (body.reply_to_message_id != null && String(body.reply_to_message_id).trim() !== "") {
    replyToId = String(body.reply_to_message_id).trim();
    if (!isUuid(replyToId)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'reply_to_message_id' must be a valid UUID when provided.", 400));
    }
  }

  let client = null;
  let saved = null;
  let parentPreview = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Membership gate: the caller must be a participant of the thread (RLS + explicit predicate). Not a
    // participant → 404 (no leakage of thread existence). The connection role enforces RLS; this is the gate.
    // VC-19: read archived_at in the SAME gate query — an archived channel is closed to NEW messages.
    const acc = await client.query(
      `SELECT archived_at FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    // VC-19: reject a send into an archived thread with a deterministic 409. A DM never has archived_at set
    // (only a channel is archivable — see theo_chat_archive_channel), so this only ever fires for an archived
    // channel. Archived = read-only: history stays visible, no NEW message lands. This is a cooperative UX
    // write-gate, NOT a security boundary — membership/RLS are unchanged (see the VEP §P8 TOCTOU note).
    if (acc.rows[0].archived_at != null) {
      throw buildKnownError("CONVERSATION_ARCHIVED", "This conversation is archived; you can no longer post to it.", 409);
    }

    // VC-11: validate the reply target is a message IN THIS THREAD (RLS-visible). This both enforces
    // same-thread integrity (a reply can't point at another conversation) and yields the preview columns
    // we return + publish (so the live send and a cold list_messages render an identical `reply_to`).
    // VC-12: carry the parent's deleted_at so replying to a tombstoned message shows a masked preview.
    if (replyToId) {
      const p = await client.query(
        `SELECT id, seq, sender_oid, body, deleted_at FROM public.theo_chat_messages WHERE id = $1 AND thread_id = $2`,
        [replyToId, threadId]
      );
      if (p.rowCount === 0) {
        throw buildKnownError("INVALID_REQUEST", "reply_to_message_id is not a message in this conversation.", 400);
      }
      parentPreview = replyPreview(p.rows[0]);
    }

    // Insert with the next per-thread seq computed atomically in the INSERT…SELECT; the UNIQUE(thread_id,
    // seq) guards against a concurrent sender — retry a few times on a 23505 race, then bump the thread.
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages (thread_id, seq, sender_oid, body, reply_to_message_id)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4 FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id
          `,
          [threadId, oid, text, replyToId]
        );
        await client.query(`UPDATE public.theo_chat_threads SET updated_at = now() WHERE id = $1`, [threadId]);
        await client.query("COMMIT");
        saved = ins.rows[0];
      } catch (e) {
        try { await client.query("ROLLBACK"); } catch {}
        if (e && e.code === "23505") continue; // seq race — recompute and retry
        throw e;
      }
    }
    if (!saved) {
      throw buildKnownError("CONFLICT", "Could not assign a message sequence; please retry.", 409);
    }

    // VC-11: attach the parent preview so the response + realtime payload carry the same `reply_to` shape
    // as list_messages (null for a normal message). VC-12: a freshly-sent message is never deleted — carry
    // deleted:false + deleted_at:null so the message shape matches list_messages exactly.
    saved.reply_to = parentPreview;
    saved.deleted = false;
    saved.deleted_at = null;
    // VC-13: a normally-sent message is never a forward — carry forwarded:false for shape parity with
    // list_messages / theo_chat_forward_message.
    saved.forwarded = false;

    // Publish to the thread's Web PubSub group so every connected participant receives it instantly.
    // Best-effort: the message is already durably persisted; a publish failure must not fail the send
    // (recipients still get it on their next list/reconnect).
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "message",
          thread_id: saved.thread_id,
          message: saved,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_send_message publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ message: saved }));
  } catch (err) {
    context.log.error("theo_chat_send_message failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Message violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

### §SM-FJ — Primary Reference function.json (DEPLOYED `theo_chat_send_message.function.json`, byte-verbatim — UNCHANGED by VC-9)

Blob `0284d265cd81bec4c34b5513d46c41b7ba6601ff`:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_send_message"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §EXT — External-system technique reference (DEPLOYED `theo_create_attachment_upload.index.js`, byte-verbatim — the MI user-delegation SAS signer `theo_chat_attachment_download` mirrors)

Per Golden §4, the download handler introduces NO new external system — it reuses this DEPLOYED signer's exact technique (managed-identity user-delegation key → positional canonical string-to-sign → HMAC), changing only the permission (`r` vs `cw`) and adding a signed `Content-Disposition` (`rscd`). Inlined full so §HG.3's signer is byte-diffable. Blob `bc1aa7c51ad5b55e84d4fa625b443cab70dc8175`:

```js
const crypto = require("crypto");

// ---- Ingestion classes (D-8 RESOLVED): declared-type allow-list + per-class size cap.
// Native-read formats inject as document/image content blocks (cap 10 MB; native reading
// is accurate at/below). Extract-class formats are text-extracted at finalize (cap 50 MB).
const NATIVE_MAX_BYTES = 10 * 1024 * 1024;
const EXTRACT_MAX_BYTES = 50 * 1024 * 1024;
const INGESTION_CLASSES = {
  "application/pdf": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/png": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/jpeg": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/webp": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/gif": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .xlsx
  "application/vnd.ms-excel": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .xls
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .docx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .pptx
  "text/csv": { class: "extract", maxBytes: EXTRACT_MAX_BYTES },
  "text/plain": { class: "extract", maxBytes: EXTRACT_MAX_BYTES },
};
const ALLOWED_CONTENT_TYPES = Object.keys(INGESTION_CLASSES);

const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";
const SAS_TTL_MINUTES = 15;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return { error: { code, message, status, timestamp: nowIso() } };
}

function successBody(data) {
  return { data, meta: { timestamp: nowIso(), version: "1.0" } };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }
  return null;
}

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}

function normalizeContentType(ct) {
  return String(ct || "").split(";")[0].trim().toLowerCase();
}

function cleanFileName(name) {
  if (name === undefined || name === null) return null;
  const raw = String(name).trim();
  if (!raw.length) return null;
  const cleaned = raw.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, " ").trim();
  return cleaned.length ? cleaned.slice(0, 180) : null;
}

// ---- Managed-identity user-delegation SAS issuance (mirrors the deployed axis
// artifacts-upload-url technique; pure crypto + https, no @azure/storage-blob dependency).
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error(
      "Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing). " +
      "Ensure System Assigned Managed Identity is enabled on the Function App."
    );
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) {
    throw new Error("Managed Identity token endpoint did not return access_token.");
  }
  return payload.access_token;
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function encodeBlobPath(blobKey) {
  return blobKey.split("/").map(encodeURIComponent).join("/");
}

function decodeXmlTag(xml, tagName) {
  const m = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i"));
  return m ? m[1] : null;
}

function toIsoNoMillis(d) {
  return new Date(d).toISOString().replace(/\.\d{3}Z$/, "Z");
}

async function getUserDelegationKey(accountName, startTime, expiryTime) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const url = `https://${accountName}.blob.core.windows.net/?restype=service&comp=userdelegationkey`;
  const body =
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<KeyInfo><Start>${xmlEscape(startTime)}</Start><Expiry>${xmlEscape(expiryTime)}</Expiry></KeyInfo>`;
  const r = await requestUrl(
    url,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-ms-version": "2022-11-02",
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(body, "utf8"),
      },
    },
    body
  );
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Get User Delegation Key failed (${r.statusCode}): ${r.body}`);
  }
  const udk = {
    signedOid: decodeXmlTag(r.body, "SignedOid"),
    signedTid: decodeXmlTag(r.body, "SignedTid"),
    signedStart: decodeXmlTag(r.body, "SignedStart"),
    signedExpiry: decodeXmlTag(r.body, "SignedExpiry"),
    signedService: decodeXmlTag(r.body, "SignedService"),
    signedVersion: decodeXmlTag(r.body, "SignedVersion"),
    value: decodeXmlTag(r.body, "Value"),
  };
  if (!udk.signedOid || !udk.signedTid || !udk.signedStart || !udk.signedExpiry || !udk.signedService || !udk.signedVersion || !udk.value) {
    throw new Error("Get User Delegation Key response was missing required fields.");
  }
  return udk;
}

function computeUserDelegationSignature(params, userDelegationKey) {
  // User-delegation SAS canonical string-to-sign for service version >= 2020-12-06
  // (we sign with sv = 2022-11-02). Field order is exact and positional — every field is
  // present (empty string when unused). The block after `sr` is:
  //   sst, ses (signedEncryptionScope, added in 2020-12-06), rscc, rscd, rsce, rscl, rsct.
  // Built as an explicit array (not hand-counted newlines) so the field positions are provable
  // against Azure's canonical (which Azure echoes verbatim in any AuthenticationFailed detail).
  const stringToSign = [
    params.sp,
    params.st,
    params.se,
    params.canonicalizedResource,
    userDelegationKey.signedOid,
    userDelegationKey.signedTid,
    userDelegationKey.signedStart,
    userDelegationKey.signedExpiry,
    userDelegationKey.signedService,
    userDelegationKey.signedVersion,
    "", // signedAuthorizedUserObjectId (saoid)
    "", // signedUnauthorizedUserObjectId (suoid)
    "", // signedCorrelationId (scid)
    "", // signedIP (sip)
    params.spr,
    params.sv,
    params.sr,
    "", // signedSnapshotTime (sst)
    "", // signedEncryptionScope (ses)
    "", // rscc (Cache-Control)
    "", // rscd (Content-Disposition)
    "", // rsce (Content-Encoding)
    "", // rscl (Content-Language)
    params.rsct || "", // rsct (Content-Type)
  ].join("\n");
  const key = Buffer.from(userDelegationKey.value, "base64");
  return crypto.createHmac("sha256", key).update(stringToSign, "utf8").digest("base64");
}

async function buildUserDelegationSas(accountName, containerName, blobKey, permissions, expiresInMinutes, mimeType) {
  const now = new Date();
  const start = new Date(now.getTime() - 5 * 60 * 1000);
  const expiry = new Date(now.getTime() + expiresInMinutes * 60 * 1000);
  const udk = await getUserDelegationKey(accountName, toIsoNoMillis(start), toIsoNoMillis(expiry));

  const sv = "2022-11-02";
  const sr = "b";
  const spr = "https";
  const st = toIsoNoMillis(start);
  const se = toIsoNoMillis(expiry);
  const canonicalizedResource = `/blob/${accountName}/${containerName}/${blobKey}`;

  const sig = computeUserDelegationSignature(
    { sp: permissions, st, se, canonicalizedResource, spr, sv, sr, rsct: mimeType || "" },
    udk
  );

  const qp = new URLSearchParams();
  qp.set("sp", permissions);
  qp.set("st", st);
  qp.set("se", se);
  qp.set("skoid", udk.signedOid);
  qp.set("sktid", udk.signedTid);
  qp.set("skt", udk.signedStart);
  qp.set("ske", udk.signedExpiry);
  qp.set("sks", udk.signedService);
  qp.set("skv", udk.signedVersion);
  qp.set("spr", spr);
  qp.set("sv", sv);
  qp.set("sr", sr);
  if (mimeType) qp.set("rsct", mimeType);
  qp.set("sig", sig);

  return { sas: qp.toString(), expiresAt: se };
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  // ---- Validate inputs before issuing any SAS (deterministic 400s) ----
  const filename = cleanFileName(body.filename);
  if (!filename) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'filename' is required and must be a non-empty string.", 400));
  }

  const contentType = normalizeContentType(body.content_type);
  const ingestion = INGESTION_CLASSES[contentType];
  if (!ingestion) {
    return send(
      context,
      400,
      errorBody(
        "UNSUPPORTED_MEDIA_TYPE",
        `Field 'content_type' must be one of the supported attachment types: ${ALLOWED_CONTENT_TYPES.join(", ")}.`,
        400
      )
    );
  }

  try {
    // Owner-scoped, deterministic blob path: attachments/<oid>/<attachmentId>.
    // The path embeds the caller OID so finalize/delete can prove ownership of the blob,
    // and embeds the attachment id so the persisted row id matches the stored blob 1:1.
    const attachmentId = crypto.randomUUID();
    const blobKey = `attachments/${oid}/${attachmentId}`;

    // Short-lived (15 min), single-blob, create+write SAS; response content-type pinned.
    const { sas, expiresAt } = await buildUserDelegationSas(
      STORAGE_ACCOUNT,
      STORAGE_CONTAINER,
      blobKey,
      "cw",
      SAS_TTL_MINUTES,
      contentType
    );

    const blobUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeBlobPath(blobKey)}`;
    const uploadUrl = `${blobUrl}?${sas}`;

    return send(context, 201, successBody({
      attachmentId,
      filename,
      contentType,
      ingestionClass: ingestion.class,
      maxBytes: ingestion.maxBytes,
      upload: {
        storageProvider: "azure_blob",
        account: STORAGE_ACCOUNT,
        container: STORAGE_CONTAINER,
        blobKey,
        blobUrl,
        uploadUrl,
        method: "PUT",
        requiredHeaders: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": contentType,
        },
        expiresAt,
      },
    }));
  } catch (err) {
    context.log.error("theo_create_attachment_upload failed", err);
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred issuing the upload URL.", 500));
  }
};
```

## §HG.1 — `theo_chat_send_message` (MODIFY: accept + validate + HEAD + persist + project an attachment)

Delta vs DEPLOYED (blob `fc7ef0e4`): attachment constants + MI/HEAD helpers + `attachmentPreview`/`cleanFileName`/`normalizeContentType`; parse the optional `attachment` descriptor (owner-prefix + UUID + allow-list → 400); body optional when an attachment is present; after the membership + archived gate, HEAD the blob for the authoritative size (absent → 400, oversized → 400); the seq INSERT carries the four attachment columns; the response/publish project `attachment` and drop the raw blob_path. Archived gate + reply + forward:false all preserved. Full — file `theo_chat_send_message.index.js`:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const MAX_BODY = 8000;
const REPLY_PREVIEW_MAX = 200; // VC-11: cap the quoted-parent snippet to bound the payload.

// VC-9: chat attachments. Supported types + per-class caps MIRROR the deployed theo_create_attachment_upload
// allow-list (the upload SAS is only ever issued for these types, so send accepts exactly the same set).
const NATIVE_MAX_BYTES = 10 * 1024 * 1024;
const EXTRACT_MAX_BYTES = 50 * 1024 * 1024;
const ATTACHMENT_MAX_BYTES = {
  "application/pdf": NATIVE_MAX_BYTES,
  "image/png": NATIVE_MAX_BYTES,
  "image/jpeg": NATIVE_MAX_BYTES,
  "image/webp": NATIVE_MAX_BYTES,
  "image/gif": NATIVE_MAX_BYTES,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": EXTRACT_MAX_BYTES,
  "application/vnd.ms-excel": EXTRACT_MAX_BYTES,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": EXTRACT_MAX_BYTES,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": EXTRACT_MAX_BYTES,
  "text/csv": EXTRACT_MAX_BYTES,
  "text/plain": EXTRACT_MAX_BYTES,
};
const ALLOWED_ATTACHMENT_TYPES = Object.keys(ATTACHMENT_MAX_BYTES);
const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
// VC-11: shape a parent-message preview for a reply (bounded body snippet). null when there is no parent.
// VC-12: a tombstoned parent has body NULL + deleted:true (the FE renders "message deleted").
function replyPreview(row) {
  if (!row) return null;
  return {
    id: row.id,
    seq: Number(row.seq),
    sender_oid: row.sender_oid,
    body: typeof row.body === "string" ? row.body.slice(0, REPLY_PREVIEW_MAX) : row.body,
    deleted: row.deleted_at != null,
  };
}
// VC-9: normalize/clean the client-declared attachment metadata (filename is cosmetic; content-type gates
// the allow-list; byte size is NOT trusted from the client — it is read authoritatively from the blob).
function normalizeContentType(ct) { return String(ct || "").split(";")[0].trim().toLowerCase(); }
function cleanFileName(name) {
  if (name === undefined || name === null) return null;
  const raw = String(name).trim();
  if (!raw.length) return null;
  const cleaned = raw.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, " ").trim();
  return cleaned.length ? cleaned.slice(0, 180) : null;
}
// VC-9: shape the attachment projection returned/published — the raw blob_path is NEVER exposed (a read SAS
// is issued per-request by theo_chat_attachment_download after a membership check).
function attachmentPreview(row) {
  if (!row || row.attachment_blob_path == null) return null;
  return {
    filename: row.attachment_filename,
    content_type: row.attachment_content_type,
    byte_size: row.attachment_byte_size == null ? null : Number(row.attachment_byte_size),
  };
}

// VC-9: managed-identity blob HEAD (mirrors the deployed theo_finalize_attachment technique) — reads the
// AUTHORITATIVE byte size + confirms the blob exists. Pure https + MI token; no @azure/storage-blob dep.
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const rq = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }); });
      }
    );
    rq.on("error", reject);
    if (body) rq.write(body);
    rq.end();
  });
}
async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error("Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing).");
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) throw new Error("Managed Identity token endpoint did not return access_token.");
  return payload.access_token;
}
function encodeBlobPath(blobKey) { return blobKey.split("/").map(encodeURIComponent).join("/"); }
function blobUrlFor(accountName, containerName, blobKey) {
  return `https://${accountName}.blob.core.windows.net/${containerName}/${encodeBlobPath(blobKey)}`;
}
// HEAD the blob → AUTHORITATIVE byte size (+ stored content-type). Returns null when absent (not uploaded).
async function getBlobProperties(accountName, containerName, blobKey) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const r = await requestUrl(blobUrlFor(accountName, containerName, blobKey), {
    method: "HEAD",
    headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode === 404) return null;
  if (r.statusCode < 200 || r.statusCode >= 300) throw new Error(`HEAD blob failed (${r.statusCode})`);
  const len = Number(r.headers["content-length"]);
  return { contentLength: Number.isFinite(len) ? len : 0, contentType: r.headers["content-type"] || null };
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const threadId = typeof body.thread_id === "string" ? body.thread_id.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'thread_id' is required and must be a valid UUID.", 400));
  }

  // VC-9: optional attachment descriptor { blob_path, filename, content_type }. Structural validation here
  // (deterministic 400 before any SQL); ownership + existence + authoritative size are enforced below.
  // byte_size is intentionally NOT accepted from the client (read from the blob via HEAD).
  let attachment = null;
  if (body.attachment != null) {
    if (typeof body.attachment !== "object" || Array.isArray(body.attachment)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'attachment' must be an object when provided.", 400));
    }
    const blobPath = typeof body.attachment.blob_path === "string" ? body.attachment.blob_path.trim() : "";
    const fname = cleanFileName(body.attachment.filename);
    const ctype = normalizeContentType(body.attachment.content_type);
    // Ownership: a caller may only attach a blob THEY uploaded — the upload SAS writes the deterministic
    // owner-scoped key `attachments/<oid>/<uuid>` (theo_create_attachment_upload). Require exactly that
    // shape: the caller's own OID segment + a UUID id (no extra path segments, no traversal, no cross-OID).
    const ownPrefix = `attachments/${oid}/`;
    const blobSuffix = blobPath.startsWith(ownPrefix) ? blobPath.slice(ownPrefix.length) : null;
    if (blobSuffix == null || !isUuid(blobSuffix)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'attachment.blob_path' is invalid or not owned by the caller.", 400));
    }
    if (!fname) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'attachment.filename' is required and must be a non-empty string.", 400));
    }
    if (!ATTACHMENT_MAX_BYTES[ctype]) {
      return send(context, 400, errorBody("UNSUPPORTED_MEDIA_TYPE", `Field 'attachment.content_type' must be one of: ${ALLOWED_ATTACHMENT_TYPES.join(", ")}.`, 400));
    }
    attachment = { blobPath, filename: fname, contentType: ctype };
  }

  // VC-9: body is now an optional caption when an attachment is present; otherwise it is still required.
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text && !attachment) {
    return send(context, 400, errorBody("INVALID_REQUEST", "A message must have a non-empty 'body' or an 'attachment'.", 400));
  }
  if (text.length > MAX_BODY) {
    return send(context, 400, errorBody("PAYLOAD_TOO_LARGE", `Message exceeds ${MAX_BODY} characters.`, 400));
  }
  const bodyParam = text.length ? text : null; // attachment-only message persists body NULL (allowed by the amended CHECK)

  // VC-11: optional reply target. Absent → a normal message. Present → must be a well-formed UUID here,
  // and (checked under RLS below) an existing message IN THE SAME THREAD.
  let replyToId = null;
  if (body.reply_to_message_id != null && String(body.reply_to_message_id).trim() !== "") {
    replyToId = String(body.reply_to_message_id).trim();
    if (!isUuid(replyToId)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'reply_to_message_id' must be a valid UUID when provided.", 400));
    }
  }

  let client = null;
  let saved = null;
  let parentPreview = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Membership gate: the caller must be a participant of the thread (RLS + explicit predicate). Not a
    // participant → 404 (no leakage of thread existence). The connection role enforces RLS; this is the gate.
    // VC-19: read archived_at in the SAME gate query — an archived channel is closed to NEW messages.
    const acc = await client.query(
      `SELECT archived_at FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    // VC-19: reject a send into an archived thread with a deterministic 409. A DM never has archived_at set
    // (only a channel is archivable — see theo_chat_archive_channel), so this only ever fires for an archived
    // channel. Archived = read-only: history stays visible, no NEW message lands. This is a cooperative UX
    // write-gate, NOT a security boundary — membership/RLS are unchanged (see the VEP §P8 TOCTOU note).
    if (acc.rows[0].archived_at != null) {
      throw buildKnownError("CONVERSATION_ARCHIVED", "This conversation is archived; you can no longer post to it.", 409);
    }

    // VC-9: for an attachment message, HEAD the blob (managed identity) to confirm it exists and to read the
    // AUTHORITATIVE byte size (client-claimed size is never trusted); enforce the per-type cap. Runs only
    // after auth + membership, so an unauthenticated/non-member caller never triggers a blob HEAD.
    let attachmentByteSize = null;
    if (attachment) {
      const props = await getBlobProperties(STORAGE_ACCOUNT, STORAGE_CONTAINER, attachment.blobPath);
      if (props == null) {
        throw buildKnownError("ATTACHMENT_NOT_FOUND", "The attachment has not been uploaded.", 400);
      }
      const cap = ATTACHMENT_MAX_BYTES[attachment.contentType];
      if (props.contentLength > cap) {
        throw buildKnownError("PAYLOAD_TOO_LARGE", `Attachment exceeds the ${Math.floor(cap / (1024 * 1024))} MB limit for its type.`, 400);
      }
      attachmentByteSize = props.contentLength;
    }

    // VC-11: validate the reply target is a message IN THIS THREAD (RLS-visible). This both enforces
    // same-thread integrity (a reply can't point at another conversation) and yields the preview columns
    // we return + publish (so the live send and a cold list_messages render an identical `reply_to`).
    // VC-12: carry the parent's deleted_at so replying to a tombstoned message shows a masked preview.
    if (replyToId) {
      const p = await client.query(
        `SELECT id, seq, sender_oid, body, deleted_at FROM public.theo_chat_messages WHERE id = $1 AND thread_id = $2`,
        [replyToId, threadId]
      );
      if (p.rowCount === 0) {
        throw buildKnownError("INVALID_REQUEST", "reply_to_message_id is not a message in this conversation.", 400);
      }
      parentPreview = replyPreview(p.rows[0]);
    }

    // Insert with the next per-thread seq computed atomically in the INSERT…SELECT; the UNIQUE(thread_id,
    // seq) guards against a concurrent sender — retry a few times on a 23505 race, then bump the thread.
    // VC-9: carry the attachment columns (all NULL for a normal message; the coherence CHECK enforces the
    // all-or-nothing shape).
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages
            (thread_id, seq, sender_oid, body, reply_to_message_id,
             attachment_blob_path, attachment_filename, attachment_content_type, attachment_byte_size)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4, $5, $6, $7, $8
          FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id,
                    attachment_blob_path, attachment_filename, attachment_content_type, attachment_byte_size
          `,
          [
            threadId, oid, bodyParam, replyToId,
            attachment ? attachment.blobPath : null,
            attachment ? attachment.filename : null,
            attachment ? attachment.contentType : null,
            attachment ? attachmentByteSize : null,
          ]
        );
        await client.query(`UPDATE public.theo_chat_threads SET updated_at = now() WHERE id = $1`, [threadId]);
        await client.query("COMMIT");
        saved = ins.rows[0];
      } catch (e) {
        try { await client.query("ROLLBACK"); } catch {}
        if (e && e.code === "23505") continue; // seq race — recompute and retry
        throw e;
      }
    }
    if (!saved) {
      throw buildKnownError("CONFLICT", "Could not assign a message sequence; please retry.", 409);
    }

    // VC-11: attach the parent preview so the response + realtime payload carry the same `reply_to` shape
    // as list_messages (null for a normal message). VC-12: a freshly-sent message is never deleted — carry
    // deleted:false + deleted_at:null so the message shape matches list_messages exactly.
    saved.reply_to = parentPreview;
    saved.deleted = false;
    saved.deleted_at = null;
    // VC-13: a normally-sent message is never a forward — carry forwarded:false for shape parity with
    // list_messages / theo_chat_forward_message.
    saved.forwarded = false;
    // VC-9: project the attachment (filename/content_type/byte_size) or null; the raw blob_path is never
    // exposed (a read SAS is issued per-request by theo_chat_attachment_download). Then drop the raw column
    // from the returned/published row so it can never leak.
    saved.attachment = attachmentPreview(saved);
    delete saved.attachment_blob_path;
    delete saved.attachment_filename;
    delete saved.attachment_content_type;
    delete saved.attachment_byte_size;

    // Publish to the thread's Web PubSub group so every connected participant receives it instantly.
    // Best-effort: the message is already durably persisted; a publish failure must not fail the send
    // (recipients still get it on their next list/reconnect).
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "message",
          thread_id: saved.thread_id,
          message: saved,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_send_message publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ message: saved }));
  } catch (err) {
    context.log.error("theo_chat_send_message failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Message violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

### §HG.1-FJ — `theo_chat_send_message.function.json` (UNCHANGED — byte-identical to §SM-FJ)

## §HG.2 — `theo_chat_list_messages` (MODIFY: project the `attachment` preview on the VC-13 base)

Delta vs DEPLOYED (blob `efa5e8bb`): the SELECT adds the four `attachment_*` columns and each shaped message gains `attachment: { filename, content_type, byte_size } | null` (the raw blob_path is NOT projected). **Codex R1:** the projection is masked to `null` when `deleted_at IS NOT NULL` (a tombstone hides its file, mirroring the nulled body). Cursor/paging/gate/reply/forwarded otherwise unchanged. Full — file `theo_chat_list_messages.index.js`:

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const REPLY_PREVIEW_MAX = 200; // VC-11: cap the quoted-parent snippet to bound the payload (matches send).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  const q = req.query || {};
  const threadId = typeof q.threadId === "string" ? q.threadId.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'threadId' is required and must be a valid UUID.", 400));
  }

  // Cursor: 'before' (exclusive) returns older messages for infinite scroll. Strict-regex before parseInt
  // (parseInt('1.5') → 1 would silently pass a range check) per the parseInt-drift discipline.
  let before = null;
  if (q.before != null && String(q.before).trim() !== "") {
    const raw = String(q.before).trim();
    if (!/^[0-9]+$/.test(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'before' must be a non-negative integer.", 400));
    }
    before = parseInt(raw, 10);
  }

  let limit = DEFAULT_LIMIT;
  if (q.limit != null && String(q.limit).trim() !== "") {
    const raw = String(q.limit).trim();
    if (!/^[0-9]+$/.test(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'limit' must be a positive integer.", 400));
    }
    limit = parseInt(raw, 10);
    if (limit < 1) limit = 1;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Membership gate — not a participant → 404 (no existence leak).
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Fetch newest-first for the cursor, then return ascending for display. RLS also enforces the gate.
    // VC-11: LEFT JOIN LATERAL the replied-to parent (same thread → RLS-visible) for the quote preview.
    // VC-12: carry m.deleted_at + the parent's deleted_at so tombstoned messages/quotes render as deleted
    // (body is already NULL in the DB for a tombstoned row — a soft delete removes the content for all).
    // VC-13: carry m.forwarded_from_message_id ONLY to derive a `forwarded` boolean below (the raw origin
    // id is never returned — it points into a thread the caller may not read).
    // VC-9: carry the attachment_* columns to derive an `attachment` preview below (the raw blob_path is
    // never returned — a read SAS is issued per-request by theo_chat_attachment_download).
    const params = [threadId];
    let where = `m.thread_id = $1`;
    if (before != null) { params.push(before); where += ` AND m.seq < $${params.length}`; }
    params.push(limit);
    const rows = await client.query(
      `SELECT m.id, m.thread_id, m.seq, m.sender_oid, m.body, m.created_at, m.reply_to_message_id, m.deleted_at, m.forwarded_from_message_id,
              m.attachment_blob_path, m.attachment_filename, m.attachment_content_type, m.attachment_byte_size,
              p.id AS p_id, p.seq AS p_seq, p.sender_oid AS p_sender_oid, p.body AS p_body, p.deleted_at AS p_deleted_at
       FROM public.theo_chat_messages m
       LEFT JOIN LATERAL (
         SELECT pm.id, pm.seq, pm.sender_oid, pm.body, pm.deleted_at
         FROM public.theo_chat_messages pm
         WHERE pm.id = m.reply_to_message_id AND pm.thread_id = m.thread_id
         LIMIT 1
       ) p ON true
       WHERE ${where}
       ORDER BY m.seq DESC
       LIMIT $${params.length}`,
      params
    );

    // Shape each row: the message plus a `reply_to` preview (null when not a reply). VC-12: `deleted` +
    // `deleted_at` on both the message and the quoted parent; a tombstoned body is NULL (removed for all).
    const shaped = rows.rows.map((r) => ({
      id: r.id,
      thread_id: r.thread_id,
      seq: Number(r.seq),
      sender_oid: r.sender_oid,
      body: r.body,
      created_at: r.created_at,
      deleted: r.deleted_at != null,
      deleted_at: r.deleted_at,
      // VC-13: expose ONLY the boolean (never the raw origin id — cross-thread privacy).
      forwarded: r.forwarded_from_message_id != null,
      // VC-9: expose the attachment preview (filename/content_type/byte_size) or null; never the raw
      // blob_path (a read SAS is issued per-request by theo_chat_attachment_download after a membership check).
      // VC-9 (Codex R1): a tombstoned message MASKS its attachment too — VC-12 "delete for everyone" nulls
      // the body AND must hide the file. The row keeps the pointer, but it is never projected once deleted.
      attachment: (r.attachment_blob_path == null || r.deleted_at != null) ? null : {
        filename: r.attachment_filename,
        content_type: r.attachment_content_type,
        byte_size: r.attachment_byte_size == null ? null : Number(r.attachment_byte_size),
      },
      reply_to_message_id: r.reply_to_message_id,
      reply_to: r.p_id == null ? null : {
        id: r.p_id,
        seq: Number(r.p_seq),
        sender_oid: r.p_sender_oid,
        body: typeof r.p_body === "string" ? r.p_body.slice(0, REPLY_PREVIEW_MAX) : r.p_body,
        deleted: r.p_deleted_at != null,
      },
    }));

    const ordered = shaped.slice().reverse();
    const hasMore = rows.rowCount === limit;
    const nextBefore = ordered.length > 0 ? Number(ordered[0].seq) : null;

    return send(context, 200, successBody({
      messages: ordered,
      page: { limit, has_more: hasMore, next_before: hasMore ? nextBefore : null },
    }));
  } catch (err) {
    context.log.error("theo_chat_list_messages failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

### §HG.2-FJ — `theo_chat_list_messages.function.json` (UNCHANGED)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_chat_list_messages"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.3 — `theo_chat_attachment_download` (GREENFIELD: membership-gated read SAS)

Mirrors the Primary Reference's Family-B shape + the §EXT SAS signer (permission `r`, plus a signed `Content-Disposition` for a filename download). Reads the message under RLS (participant → else 404; **deleted (Codex R1)** or no attachment → 404), then mints a single-blob, 15-min read SAS. Full — file `theo_chat_attachment_download.index.js`:

```js
const { Pool } = require("pg");
const crypto = require("crypto");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";
const SAS_TTL_MINUTES = 15;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// ---- Managed-identity user-delegation SAS issuance (mirrors the deployed theo_create_attachment_upload
// technique; pure crypto + https, no @azure/storage-blob dependency). Here permission is READ ("r").
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const rq = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }); });
      }
    );
    rq.on("error", reject);
    if (body) rq.write(body);
    rq.end();
  });
}
async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error("Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing).");
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) throw new Error("Managed Identity token endpoint did not return access_token.");
  return payload.access_token;
}
function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function encodeBlobPath(blobKey) { return blobKey.split("/").map(encodeURIComponent).join("/"); }
function decodeXmlTag(xml, tagName) {
  const m = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i"));
  return m ? m[1] : null;
}
function toIsoNoMillis(d) { return new Date(d).toISOString().replace(/\.\d{3}Z$/, "Z"); }

async function getUserDelegationKey(accountName, startTime, expiryTime) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const url = `https://${accountName}.blob.core.windows.net/?restype=service&comp=userdelegationkey`;
  const body =
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<KeyInfo><Start>${xmlEscape(startTime)}</Start><Expiry>${xmlEscape(expiryTime)}</Expiry></KeyInfo>`;
  const r = await requestUrl(
    url,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-ms-version": "2022-11-02",
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(body, "utf8"),
      },
    },
    body
  );
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Get User Delegation Key failed (${r.statusCode}): ${r.body}`);
  }
  const udk = {
    signedOid: decodeXmlTag(r.body, "SignedOid"),
    signedTid: decodeXmlTag(r.body, "SignedTid"),
    signedStart: decodeXmlTag(r.body, "SignedStart"),
    signedExpiry: decodeXmlTag(r.body, "SignedExpiry"),
    signedService: decodeXmlTag(r.body, "SignedService"),
    signedVersion: decodeXmlTag(r.body, "SignedVersion"),
    value: decodeXmlTag(r.body, "Value"),
  };
  if (!udk.signedOid || !udk.signedTid || !udk.signedStart || !udk.signedExpiry || !udk.signedService || !udk.signedVersion || !udk.value) {
    throw new Error("Get User Delegation Key response was missing required fields.");
  }
  return udk;
}

function computeUserDelegationSignature(params, userDelegationKey) {
  // User-delegation SAS canonical string-to-sign for service version >= 2020-12-06 (sv = 2022-11-02).
  // Field order is exact and positional — every field is present (empty when unused). The block after `sr`
  // is: sst, ses (signedEncryptionScope), rscc, rscd, rsce, rscl, rsct. Built as an explicit array so the
  // positions are provable against Azure's canonical. VC-9 adds rscd (Content-Disposition) for downloads.
  const stringToSign = [
    params.sp,
    params.st,
    params.se,
    params.canonicalizedResource,
    userDelegationKey.signedOid,
    userDelegationKey.signedTid,
    userDelegationKey.signedStart,
    userDelegationKey.signedExpiry,
    userDelegationKey.signedService,
    userDelegationKey.signedVersion,
    "", // signedAuthorizedUserObjectId (saoid)
    "", // signedUnauthorizedUserObjectId (suoid)
    "", // signedCorrelationId (scid)
    "", // signedIP (sip)
    params.spr,
    params.sv,
    params.sr,
    "", // signedSnapshotTime (sst)
    "", // signedEncryptionScope (ses)
    "", // rscc (Cache-Control)
    params.rscd || "", // rscd (Content-Disposition)
    "", // rsce (Content-Encoding)
    "", // rscl (Content-Language)
    params.rsct || "", // rsct (Content-Type)
  ].join("\n");
  const key = Buffer.from(userDelegationKey.value, "base64");
  return crypto.createHmac("sha256", key).update(stringToSign, "utf8").digest("base64");
}

async function buildReadSas(accountName, containerName, blobKey, expiresInMinutes, mimeType, contentDisposition) {
  const now = new Date();
  const start = new Date(now.getTime() - 5 * 60 * 1000);
  const expiry = new Date(now.getTime() + expiresInMinutes * 60 * 1000);
  const udk = await getUserDelegationKey(accountName, toIsoNoMillis(start), toIsoNoMillis(expiry));

  const sv = "2022-11-02";
  const sr = "b";
  const spr = "https";
  const st = toIsoNoMillis(start);
  const se = toIsoNoMillis(expiry);
  const canonicalizedResource = `/blob/${accountName}/${containerName}/${blobKey}`;

  const sig = computeUserDelegationSignature(
    { sp: "r", st, se, canonicalizedResource, spr, sv, sr, rsct: mimeType || "", rscd: contentDisposition || "" },
    udk
  );

  const qp = new URLSearchParams();
  qp.set("sp", "r");
  qp.set("st", st);
  qp.set("se", se);
  qp.set("skoid", udk.signedOid);
  qp.set("sktid", udk.signedTid);
  qp.set("skt", udk.signedStart);
  qp.set("ske", udk.signedExpiry);
  qp.set("sks", udk.signedService);
  qp.set("skv", udk.signedVersion);
  qp.set("spr", spr);
  qp.set("sv", sv);
  qp.set("sr", sr);
  if (contentDisposition) qp.set("rscd", contentDisposition);
  if (mimeType) qp.set("rsct", mimeType);
  qp.set("sig", sig);

  return { sas: qp.toString(), expiresAt: se };
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const messageId = typeof body.message_id === "string" ? body.message_id.trim() : "";
  if (!isUuid(messageId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'message_id' is required and must be a valid UUID.", 400));
  }

  let client = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Read the message under RLS — theo_chat_message_select only returns it if the caller is a participant
    // of its thread, so a caller can only obtain a download URL for an attachment they can already see.
    // Absent / not visible → 404 (no existence leak). No attachment on the message → 404.
    const res = await client.query(
      `SELECT attachment_blob_path, attachment_filename, attachment_content_type, attachment_byte_size, deleted_at
       FROM public.theo_chat_messages WHERE id = $1`,
      [messageId]
    );
    if (res.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Message not found.", 404);
    }
    const row = res.rows[0];
    // VC-9 (Codex R1): a tombstoned message masks its attachment — VC-12 "delete for everyone" means the
    // file content must NOT be retrievable once deleted (parity with the nulled body + the masked list
    // projection). Deleted OR no attachment → 404 before any read SAS is minted.
    if (row.deleted_at != null || row.attachment_blob_path == null) {
      throw buildKnownError("NOT_FOUND", "This message has no attachment.", 404);
    }

    // Short-lived (15 min), single-blob READ SAS. Content-Type is pinned to the stored type and a
    // Content-Disposition forces a download with the original filename (ASCII-quoted; quotes stripped).
    const safeName = String(row.attachment_filename || "download").replace(/"/g, "");
    const contentDisposition = `attachment; filename="${safeName}"`;
    const { sas, expiresAt } = await buildReadSas(
      STORAGE_ACCOUNT,
      STORAGE_CONTAINER,
      row.attachment_blob_path,
      SAS_TTL_MINUTES,
      row.attachment_content_type || "",
      contentDisposition
    );

    const blobUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeBlobPath(row.attachment_blob_path)}`;
    const downloadUrl = `${blobUrl}?${sas}`;

    return send(context, 200, successBody({
      message_id: messageId,
      filename: row.attachment_filename,
      content_type: row.attachment_content_type,
      byte_size: row.attachment_byte_size == null ? null : Number(row.attachment_byte_size),
      downloadUrl,
      method: "GET",
      expiresAt,
    }));
  } catch (err) {
    context.log.error("theo_chat_attachment_download failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred issuing the download URL.", 500));
  } finally {
    if (client) client.release();
  }
};
```

### §HG.3-FJ — `theo_chat_attachment_download.function.json` (GREENFIELD)

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_attachment_download" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §API-SPEC — Role-C (Pass 4) documentation delta
`spec/THEO_API_SPEC.md` §2.10 **`read / send messages`** row: (a) `theo_chat_send_message` accepts an optional `attachment { blob_path, filename, content_type }` and `body` is optional when an attachment is present; each message projection (`list_messages`/`send_message`) now also carries `attachment` (`{ filename, content_type, byte_size } | null`); (b) add `POST /api/theo_chat_attachment_download { message_id }` → **200** `{ downloadUrl, filename, content_type, byte_size, expiresAt }` (membership-gated read SAS; not visible / no attachment → **404**); (c) note the REUSED `POST /api/theo_create_attachment_upload` as the chat upload SAS issuer. `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 `theo_chat_messages` row: add the four `attachment_*` columns (blob pointer; the API exposes only the preview + a per-request read SAS) + the widened body CHECK + the coherence CHECK. Authored as a Role-C handoff after Pass-3 deploy + curls.

## §DEPLOY — Pass 3 (infra prereq + Walter migration FIRST, then Claude Code deploy to `vaultgpt-func-chat`)
0. **INFRA PREREQUISITE (Walter / control-plane) — REQUIRED, this is NEW for `vaultgpt-func-chat`.** Unlike the monolith `vaultgpt-func-premium` (which has SystemAssigned MI + a Storage Blob Data role), `vaultgpt-func-chat` currently has **NO managed identity** — the existing 17 chat handlers never needed Blob (they use Postgres + Web PubSub connection strings). VC-9 is the FIRST chat feature to touch Blob, so before deploy the app MUST get: (a) a **system-assigned managed identity** enabled; (b) **Storage Blob Data Contributor** (or at minimum *Reader* for the HEAD/read paths, but *Contributor* matches the monolith and future write needs) on `vaultgptstorage01`; then (c) a **restart** so `IDENTITY_ENDPOINT`/`IDENTITY_HEADER` are injected. Verify with a probe (an authenticated `send_message` with a valid attachment returns **201**, not 500). Without this, `getBlobProperties` / the SAS signer throw and the attachment paths 500. Commands (Walter-run or Claude-Code-run under explicit authorization):
   ```
   az functionapp identity assign --name vaultgpt-func-chat --resource-group Vault-Tax
   # grant the new principalId Storage Blob Data Contributor on the storage account:
   az role assignment create --assignee <principalId> --role "Storage Blob Data Contributor" \
     --scope /subscriptions/<sub>/resourceGroups/Vault-Tax/providers/Microsoft.Storage/storageAccounts/vaultgptstorage01
   az functionapp restart --name vaultgpt-func-chat --resource-group Vault-Tax
   ```
1. **Walter** runs `vc9_attachment_migration.sql` + the verify SQL (the four columns + both CHECKs must exist before deploy).
2. **Claude Code** deploys the NEW `theo_chat_attachment_download/{index.js,function.json}` + overwrites `theo_chat_send_message/index.js` + `theo_chat_list_messages/index.js` via Kudu VFS surgical PUT (ARM bearer; no token logged); restart → confirm the 1 new function registers (inventory 17 → 18); baseline get-back before overwrite; post-deploy get-back byte-matches this pack. `theo_create_attachment_upload` is REUSED unchanged (not re-deployed) — note it lives on the monolith today; if the chat FE calls it via the chat app, confirm the route is reachable or plan to also deploy it to `vaultgpt-func-chat` (it too needs the MI from step 0).

## §CURL — post-deploy verification (Claude Code; az-login token for `api://4e1a1e31-…`; structural only — no OIDs/bodies)
Against a disposable channel the caller owns; a real small file uploaded via the reused upload SAS:
- `POST create_attachment_upload` `{ filename, content_type:"text/plain" }` → **201** `{ upload.uploadUrl, upload.blobKey }`; PUT the bytes to `uploadUrl` (`x-ms-blob-type: BlockBlob`) → **201**.
- `POST send_message` `{ thread_id, attachment:{ blob_path:<blobKey>, filename, content_type:"text/plain" } }` (no body) → **201**; `message.attachment` = `{ filename, content_type, byte_size }` with the AUTHORITATIVE size; no `attachment_blob_path` in the payload.
- `POST send_message` attachment with a `blob_path` NOT under `attachments/<caller-oid>/` → **400** (ownership).
- `POST send_message` attachment `content_type:"application/zip"` → **400 UNSUPPORTED_MEDIA_TYPE**.
- `POST send_message` attachment referencing a never-uploaded blob key → **400 ATTACHMENT_NOT_FOUND**.
- `POST send_message` no body AND no attachment → **400**.
- `GET list_messages?threadId=<t>` → the attachment message carries `attachment` + no raw blob_path; a plain message carries `attachment:null`.
- `POST attachment_download` `{ message_id:<attachment msg> }` → **200** `{ downloadUrl, filename, byte_size, expiresAt }`; a GET on `downloadUrl` → **200** with the bytes + `Content-Disposition`.
- `POST attachment_download` `{ message_id:<plain msg> }` → **404** (no attachment); bad `message_id` → **400**; a message in a thread the caller is NOT in → **404** (membership gate).
- **(Codex R1) delete → mask → deny:** `POST delete_message` `{ message_id:<attachment msg> }` (as its sender) → **200**; then `GET list_messages?threadId=<t>` → that message now shows `deleted:true` + `attachment:null` (masked); then `POST attachment_download` `{ message_id:<same> }` → **404** (the file is no longer retrievable — VC-12 "delete for everyone" now covers the attached file).

## §SM-NOTE — structural mirror
`theo_chat_send_message` keeps the deployed insert+seq+publish+gate pattern + adds the attachment path; `theo_chat_list_messages` adds only the `attachment` projection (masked on tombstones); `theo_chat_attachment_download` is the Family-B shape + the §EXT SAS signer (permission `r` + `Content-Disposition`), gated on membership AND non-deleted. No shared helper/envelope/error-map drift; the new `isKnown` errors ride the existing re-map. `node --check` clean on all three (verified this turn). The download signer's canonical string-to-sign is field-position-identical to §EXT (only `rscd` populated + `sp="r"`). **Codex R1 (RESOLVED):** deleted attachment messages are masked in both read paths (`list_messages` → `attachment:null`; `attachment_download` → 404), extending VC-12 "delete for everyone" to the file content.

## Requested Pass 2 verdict
**APPROVED** or **REJECTED** only. On APPROVED: Walter runs the migration, Claude Code deploys the new handler + two overwrites + curls, then the Role-C (Pass 4) + VC-9-FE.
