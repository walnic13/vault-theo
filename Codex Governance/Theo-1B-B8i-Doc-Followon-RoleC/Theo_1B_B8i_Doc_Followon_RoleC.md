# Role-C Verbatim-Edit Handoff — B8i reload-parity DEPLOYED: Schema §7 `message_seq` + API §2.8 list endpoint

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Records the **deployed + golden-curl-verified** B8i reload-parity backend (vault-theo `0fd197c`, deployed 2026-06-30) in the two authority specs: (1) `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §7 gains a "Tier B8i addendum" line for the additive `theo_attachments.message_seq` column; (2) `spec/THEO_API_SPEC.md` §2.8 gains a row for the new `theo_list_conversation_attachments` read endpoint. Two verbatim edits; documentation-only. This is the B8i G-3 follow-on (same post-deploy pattern as the B8c column documentation).

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `0fd197c5a3fb1e69d1a5aa78ff371b9a7f557d8d` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET 1** Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§7 `theo_attachments` as-built) | `Read(§7)` this turn | `f9164d8a22194b87e9601c5dcc61528bc7c7be2e` |
| 2 | **TARGET 2** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.8 Attachments) | `Read(§2.8)` this turn | `70d7b15d0c743ae1d0020fb5650b5bad7d367b79` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDIT 1 + EDIT 2 — Codex applies verbatim |
| spec/THEO_API_SPEC.md | §2 | "Contract Surface" | EDIT 2 — §2.8 new read-endpoint row |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
B8i (reload parity) is deployed and golden-curl-verified (evidence `.local/b8i_reload_parity_verify_2026-06-30.txt`): the additive `theo_attachments.message_seq int` column was run as `pgadmin_vault`, `theo_message` now binds a sent attachment to its user-turn seq, and the new owner-scoped `theo_list_conversation_attachments` endpoint returns attachments with `message_seq` aligned to `theo_get_conversation` user-turn seqs (`[0,2] === [0,2]`). The two authority specs must record the new column and endpoint. Documentation-only; two edits.

## Edit set (2 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT.

### EDIT 1 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §7: append the B8i addendum to the `theo_attachments` as-built paragraph
**Locate (BEFORE) — found once:**
```
The new columns inherit the table's four ownership policies. Canonical DDL: `Codex Governance/Theo-1B-B8c-Attachment-Extraction-Pass-1-VEP/b8c_addendum.sql`.
```
**Replace with (AFTER):**
```
The new columns inherit the table's four ownership policies. Canonical DDL: `Codex Governance/Theo-1B-B8c-Attachment-Extraction-Pass-1-VEP/b8c_addendum.sql`. **Tier B8i addendum (DEPLOYED 2026-06-30):** additive `message_seq int` NULL — the `theo_messages.seq` of the user turn an attachment was sent with (set by `theo_message` at send; NULL when never sent in a message, or for pre-B8i rows). No CHECK/FK (a per-conversation ordinal, not a global key — same promotable posture as `ingestion_class`); inherits the table's four ownership policies; no backfill. Lets a reloaded thread draw per-message attachment chips (read via `theo_list_conversation_attachments`). Canonical DDL: `Codex Governance/Theo-1B-B8i-Reload-Parity-Backend-Pass-1-VEP/b8i_addendum.sql`.
```

### EDIT 2 — `spec/THEO_API_SPEC.md` §2.8: add a row for the new list endpoint (after the read-path row)
**Locate (BEFORE) — found once:**
```
| read uploaded files into a chat (PDF/image as document/image content blocks; Excel/Word/PPT/CSV/TXT — and PDFs > 3 MB — extracted to text) | `1B-deployed` — **DEPLOYED 2026-06-30** (B8c extraction + B8d gateway injection + B8h large-document handling): `theo_message` accepts `attachment_ids` and injects, per the row's `ingestion_class`, a native PDF/image block (≤ 3 MB PDF / image) or the **budgeted extracted text**; a PDF **> 3 MB** is text-extracted (B8h, `pdf-parse`) rather than sent as a giant document block, bounding the synchronous request. Golden-curl + SWA verified; the FE composer (B8e) is live. | HF-T1 gateway + `theo_attachments` |
```
**Replace with (AFTER):**
```
| read uploaded files into a chat (PDF/image as document/image content blocks; Excel/Word/PPT/CSV/TXT — and PDFs > 3 MB — extracted to text) | `1B-deployed` — **DEPLOYED 2026-06-30** (B8c extraction + B8d gateway injection + B8h large-document handling): `theo_message` accepts `attachment_ids` and injects, per the row's `ingestion_class`, a native PDF/image block (≤ 3 MB PDF / image) or the **budgeted extracted text**; a PDF **> 3 MB** is text-extracted (B8h, `pdf-parse`) rather than sent as a giant document block, bounding the synchronous request. Golden-curl + SWA verified; the FE composer (B8e) is live. | HF-T1 gateway + `theo_attachments` |
| list a conversation's attachments (reload parity) | `1B-deployed` — **DEPLOYED 2026-06-30** (B8i): `GET /api/theo_list_conversation_attachments?conversationId=<uuid>`. Owner-scoped; resolves conversation ownership first (403 not-owned via `theo_conversation_exists_unscoped` / 404 absent / 400 bad-or-missing id), then returns `{ attachments: [{ id, filename, content_type, byte_size, ingestion_class, message_seq, created_at }] }` ordered by `message_seq` (NULLS LAST), `created_at`. `message_seq` is the `theo_messages.seq` of the user turn the file was sent with (set by `theo_message` at send), so a reloaded thread draws attachment chips on the matching message; golden-curl-verified (`message_seq` aligns with `theo_get_conversation` user-turn seqs). | `theo_attachments` (HF-T2) |
```

## Note
Two verbatim edits, documentation-only: Schema §7 records the additive `message_seq` column (B8i addendum, same pattern as the B8c columns); API §2.8 adds the `theo_list_conversation_attachments` read-endpoint row. Both reflect deployed + golden-curl-verified behaviour. No code, no schema, no other docs.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B8i-Doc-Followon-RoleC/Theo_1B_B8i_Doc_Followon_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-B8i-Doc-Followon-RoleC/Theo_1B_B8i_Doc_Followon_RoleC.md
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-B8i-Doc-Followon Role-C. Apply EDIT 1 to `spec/THEO_AZURE_POSTGRES_SCHEMA.md` and EDIT 2 to `spec/THEO_API_SPEC.md` verbatim (each BEFORE anchor found exactly once; HALT on mismatch): Schema §7 gains the B8i `message_seq` addendum; API §2.8 gains the `theo_list_conversation_attachments` row. Documentation-only."*

*End of Role-C Verbatim-Edit Handoff.*
