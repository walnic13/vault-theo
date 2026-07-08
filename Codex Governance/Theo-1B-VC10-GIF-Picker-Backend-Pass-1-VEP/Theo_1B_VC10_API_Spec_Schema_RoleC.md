# Theo 1B — VC-10 GIF Picker: API-Spec §2.10 + Schema §3 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-10 reality. **APPROVED / REJECTED only.** Codex, please finish with the `[Codex Pass 4]` **commit**.

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `b9edad5e4f162919bbda7b7cb1e9c971e29e9a27` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-07) VC-10 reality — API-Spec §2.10 `read / send messages` row gains the `theo_chat_gif_search` + `theo_chat_send_gif` routes + the `gif` message projection; Schema §3 `theo_chat_messages` row gains the seven `gif_*` columns + the gif-aware body CHECK + the gif coherence CHECK + the attach/gif exclusion CHECK. Migration run by Walter + verified (V1–V3); handlers deployed + golden-verified (see the sibling `VC10_Pass_3_Deploy_Evidence.md`). Two verbatim before/after edits against the committed specs.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row) | `grep -o` row tail this turn | `b0976ff8fbccaf28495cc0f1e7594893221bf844` |
| 2 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` row) | `grep -o` row tail this turn | `0c5c5a713984be22f7e9144eccbfb0c33bce7e69` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | EDIT 1 — gif routes + gif field |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Message within a chat thread" | EDIT 2 — gif columns + CHECKs |

## Verbatim edits (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10 — append the VC-10 gif note at the end of the `read / send messages` row

**BEFORE (exact substring):**
```
ATTACHMENT_NOT_FOUND`**. | `theo_chat_messages` + `theo_chat_threads` + `theo-content` Blob (func-chat managed identity) + Web PubSub |
```
**AFTER (exact):**
```
ATTACHMENT_NOT_FOUND`**. **VC-10 — DEPLOYED 2026-07-07 (GIF picker, Path A hardened GIPHY proxy):** `POST /api/theo_chat_gif_search { query, limit? }` → **200** `{ query, gifs:[{ provider, id, title, url, preview_url, width, height }], cached }` — a server-side GIPHY search proxy (`GIPHY_API_KEY` stays server-side; results sanitized; `rating=pg-13`; short-TTL cache); bad query/limit → **400**; upstream 429 → **429 `RATE_LIMITED`**; other upstream error → **502 `UPSTREAM_ERROR`**. `POST /api/theo_chat_send_gif { thread_id, gif_id, body? }` → **201** `{ message }` — resolves the gif by id against GIPHY server-side (the client sends ONLY the id, never a URL) and stores the canonical GIPHY CDN URLs; `message.gif` = `{ provider, id, url, preview_url, width, height, title }`; gif not found / bad id → **400**, non-participant → **404**, archived → **409**. `list_messages`/`send_message` messages now also carry `gif` (`{…}|null`; masked to `null` on a tombstone, VC-12 parity). GIF rendering hotlinks the GIPHY CDN (`media*.giphy.com`) — Path A, ToS-compliant (nothing rehosted); "Powered by GIPHY" attribution + a CDN-scoped CSP are VC-10-FE obligations. | `theo_chat_messages` + `theo_chat_threads` + `theo-content` Blob (func-chat managed identity) + Web PubSub + GIPHY REST API (outbound, server-side) |
```

### EDIT 2 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 — append the gif columns + CHECKs at the end of the `theo_chat_messages` row

**BEFORE (exact substring):**
```
downloads are minted per-request by `theo_chat_attachment_download` (membership-gated read SAS). No RLS change. | DEPLOYED — VC-1 (§8) |
```
**AFTER (exact):**
```
downloads are minted per-request by `theo_chat_attachment_download` (membership-gated read SAS). No RLS change. **VC-10, DEPLOYED 2026-07-07 (GIF picker, Path A):** `gif_provider text NULL`, `gif_id text NULL`, `gif_url text NULL`, `gif_preview_url text NULL`, `gif_width int NULL`, `gif_height int NULL`, `gif_title text NULL` — an EXTERNAL reference to a GIPHY gif (canonical GIPHY CDN URLs, resolved server-side by `theo_chat_send_gif` from a client-supplied `gif_id` only — never a client URL; NOT a self-hosted blob). The `theo_chat_messages_body_ck` CHECK was further WIDENED so a live message may be GIF-only (`(body IS NOT NULL) OR (attachment_blob_path IS NOT NULL) OR (gif_id IS NOT NULL)`); `theo_chat_messages_gif_ck` keeps the core three (provider/id/url) all-present-or-all-NULL; `theo_chat_messages_attach_gif_excl_ck` forbids a message being both an attachment and a gif. Exposed to clients as a `gif` object (masked to `null` on a tombstone). No RLS change. | DEPLOYED — VC-1 (§8) |
```

## Scope note
API-Spec §2.10 + Schema §3 only. No Plan delta (the VC tier is recorded). No handler/code change (documents deployed reality). No RLS/policy change (the gif INSERT rides the existing column-agnostic `theo_chat_message_insert`). GIPHY is a new external system (Golden §4) — documented in the row's systems cell.

*End of Role-C Verbatim-Edit Handoff.*
