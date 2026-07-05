# Theo 1B — VC-1.2 Channel Membership + Admin: API-Spec §2.10 + Schema Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-1.2 reality. **APPROVED / REJECTED only.**
>
> **Coordination with the pending VC-8 API-Spec Role-C:** VC-8's Role-C has two edits — EDIT A (add `members_read` to the `list_threads` projection on §2.10 line 91) and EDIT B (document the `mark_read` `read` event). **This VC-1.2 handoff OWNS §2.10 line 91** and **folds in VC-8 EDIT A** (its AFTER adds BOTH `members_read` and `admin_oid` + the two new routes). So: apply **this** handoff's EDIT 1 **instead of** VC-8 API-Spec Role-C EDIT A; VC-8 EDIT B (mark_read `read` event, line 93) remains separately applicable and is untouched here.

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `e80832c72f8878f14fb333d2c58af513205b0088` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-05) VC-1.2 reality — API-Spec §2.10 gains `admin_oid` on create_channel/list_threads + the `theo_chat_add_member`/`theo_chat_remove_member` routes (folding in VC-8's members_read on line 91); Schema §8 `theo_chat_threads` gains `admin_oid`. Verbatim before/after. Migration was run by Walter; handlers deployed + golden-verified.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 chat contract — edit target line 91) | `Read` §2.10 lines 88–95 this turn | `e3c036d782f58f08c43405c7d384d9b71ae181cc` |
| 2 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§8 `theo_chat_threads` row — edit target line 38) | `Read`/`grep` §8 this turn | `62b898b881ad64023f99ae10414093681aaa84c8` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "creator auto-included; members deduped; caps enforced" | EDIT 1 — create_channel/list_threads admin_oid + members_read + new routes |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §8 | "`created_by text` (creator OID), `dm_key text NULL`" | EDIT 2 — `theo_chat_threads.admin_oid` |

## Verbatim edits (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10, line 91 (create/list DMs + channels) — folds in VC-8 members_read + adds VC-1.2 admin_oid + the two new routes

**BEFORE (exact substring of line 91):**
```
`POST /api/theo_chat_create_dm` `{ peer_oid }` → **201** (new) / **200** (existing) `{ thread, created }` — canonical get-or-create keyed by a sorted-OID-pair `dm_key` (A↔B resolve to one thread). `POST /api/theo_chat_create_channel` `{ name, member_oids[] }` → **201** `{ thread, created:true }` (creator auto-included; members deduped; caps enforced). `GET /api/theo_chat_list_threads` → **200** `{ threads: [{ id, kind, name, member_oids, created_by, dm_key, created_at, updated_at, last_read_seq, unread_count, last_message }] }` newest-updated-first (`unread_count` counts only messages from **others**). Self/invalid `peer_oid`, blank channel name, or non-OID members → **400**.
```
**AFTER (exact):**
```
`POST /api/theo_chat_create_dm` `{ peer_oid }` → **201** (new) / **200** (existing) `{ thread, created }` — canonical get-or-create keyed by a sorted-OID-pair `dm_key` (A↔B resolve to one thread). `POST /api/theo_chat_create_channel` `{ name, member_oids[] }` → **201** `{ thread, created:true }` (creator auto-included; members deduped; caps enforced; **VC-1.2 — DEPLOYED 2026-07-05** — the returned `thread` carries `admin_oid` = the creator, the channel administrator). `GET /api/theo_chat_list_threads` → **200** `{ threads: [{ id, kind, name, member_oids, created_by, dm_key, created_at, updated_at, admin_oid, last_read_seq, unread_count, last_message, members_read }] }` newest-updated-first (`unread_count` counts only messages from **others**; **VC-8** `members_read: [{ oid, last_read_seq }]` = the OTHER participants' read positions for Teams-style "Seen", excludes the caller; **VC-1.2** `admin_oid` = the channel administrator's OID, null for a dm). Self/invalid `peer_oid`, blank channel name, or non-OID members → **400**. **VC-1.2 — DEPLOYED 2026-07-05:** `POST /api/theo_chat_add_member` / `POST /api/theo_chat_remove_member` `{ thread_id, member_oid }` → **200** `{ thread_id, member_oid, added }` / `{ thread_id, member_oid, removed }` — **admin-gated** (only `admin_oid` may manage members); idempotent; a non-participant caller → **404**, a non-channel (dm) → **400**, a non-admin caller → **403**, removing the admin → **400** (transfer admin first — VC-15).
```

### EDIT 2 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §8, line 38 (`theo_chat_threads` columns)

**BEFORE (exact substring):**
```
`created_by text` (creator OID), `dm_key text NULL`
```
**AFTER (exact):**
```
`created_by text` (creator OID), `admin_oid text` (channel administrator OID — **VC-1.2, DEPLOYED 2026-07-05**; backfilled `= created_by`; null semantics for a dm), `dm_key text NULL`
```

## Scope note
API-Spec §2.10 (line 91) + Schema §8 (line 38) only. No Plan delta (the VC tier is recorded). No handler/code change (documents deployed reality). This handoff supersedes VC-8 API-Spec Role-C EDIT A (list_threads members_read) by folding it into EDIT 1; VC-8 EDIT B (mark_read `read` event) is independent and still applies.

*End of Role-C Verbatim-Edit Handoff.*
