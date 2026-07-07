# Theo 1B — VC-13.1 Forward carries attachment/gif: API-Spec §2.10 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-13.1 reality. **APPROVED / REJECTED only.** Codex, please finish with the `[Codex Pass 4]` **commit**.

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `5434bf1c7afb80b85c2af6a83bd3d98a80a72e36` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-07) VC-13.1 reality — API-Spec §2.10 `read / send messages` row gains a note that `theo_chat_forward_message` now carries the source's `attachment` / `gif` into the forwarded copy (was body-only). NO Schema delta (the `attachment_*` / `gif_*` columns are already documented §3, VC-9/VC-10). NO migration. Handler deployed + golden-verified (see the sibling `VC13_1_Pass_3_Deploy_Evidence.md`). One verbatim before/after edit.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row) | `grep -o` row tail this turn | `77819fb0f179981a3d798cd07bb9918790621733` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | EDIT 1 — the forward-carries-attachment/gif note |

## Verbatim edit (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10 — append the VC-13.1 note at the end of the `read / send messages` row description

**BEFORE (exact substring):**
```
a CDN-scoped CSP are VC-10-FE obligations. | `theo_chat_messages` + `theo_chat_threads` + `theo-content` Blob (func-chat managed identity) + Web PubSub + GIPHY REST API (outbound, server-side) |
```
**AFTER (exact):**
```
a CDN-scoped CSP are VC-10-FE obligations. **VC-13.1 — DEPLOYED 2026-07-07:** `theo_chat_forward_message` now carries the source message's `attachment` / `gif` into the forwarded copy — previously it copied only `body`, which silently dropped an attachment/gif and (for an attachment-only / gif-only source, whose `body` is NULL) violated `theo_chat_messages_body_ck` with a 400. The forwarded `message` projection now includes `attachment` (`{ filename, content_type, byte_size } | null`; the raw blob_path is never exposed) and `gif` (`{…}|null`), matching `list_messages` / `send_message` / `send_gif`. The copied attachment references the ORIGINAL sender's blob; download stays membership-gated via `theo_chat_attachment_download` (a target participant can retrieve it; a non-participant cannot). | `theo_chat_messages` + `theo_chat_threads` + `theo-content` Blob (func-chat managed identity) + Web PubSub + GIPHY REST API (outbound, server-side) |
```

## Scope note
API-Spec §2.10 only. No Schema delta (the `attachment_*` / `gif_*` columns are already documented in §3, VC-9/VC-10). No Plan delta. No handler/code change (documents deployed reality). No RLS/policy change (the forward INSERT rides the existing column-agnostic `theo_chat_message_insert`).

*End of Role-C Verbatim-Edit Handoff.*
