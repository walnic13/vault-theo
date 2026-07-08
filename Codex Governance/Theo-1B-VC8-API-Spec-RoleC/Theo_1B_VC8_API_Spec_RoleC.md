# Theo 1B — VC-8 Read-Receipts API-Spec §2.10 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. This is a **Role-C Verbatim-Edit Handoff** (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). It documents the deployed VC-8 reality in `spec/THEO_API_SPEC.md` §2.10. **APPROVED / REJECTED only.** Claude Code does not self-edit governed documents; Codex applies the verbatim edits below.

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `0e5cdbe5232e0e295c2548d34c1581d6fcf77470` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records the DEPLOYED (2026-07-05) VC-8 Teams-style read-receipts reality in the API Spec §2.10 — `theo_chat_list_threads` now returns `members_read`; `theo_chat_mark_read` now publishes a transient `read` group event. Verbatim before/after for each edit. No schema/Plan delta (no DDL; VC tier already recorded). VC-8 backend VEP was Codex-APPROVED; both handlers deployed to `vaultgpt-func-chat` (§1E / DR-T7), verified.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 chat contract — the edit target) | `grep -n` §2.10 `list_threads`/`mark_read` this turn | `e3c036d782f58f08c43405c7d384d9b71ae181cc` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "updated_at, last_read_seq, unread_count, last_message }] }" | EDIT A — `list_threads` gains `members_read` |
| spec/THEO_API_SPEC.md | §2.10 | "read_state: { thread_id, member_oid, last_read_seq } }` — monotonic upsert" | EDIT B — `mark_read` publishes the `read` event |

## Verbatim edits (Codex to apply inline in `spec/THEO_API_SPEC.md` §2.10)

### EDIT A — `theo_chat_list_threads` response gains `members_read`

**BEFORE (exact substring):**
```
updated_at, last_read_seq, unread_count, last_message }] }` newest-updated-first (`unread_count` counts only messages from **others**).
```
**AFTER (exact):**
```
updated_at, last_read_seq, unread_count, last_message, members_read }] }` newest-updated-first (`unread_count` counts only messages from **others**; **VC-8 — DEPLOYED 2026-07-05** — adds `members_read: [{ oid, last_read_seq }]`, the OTHER participants' read positions for Teams-style "Seen" (excludes the caller; `[]` when none) — read under the existing `theo_chat_member_select` RLS policy; no schema change).
```

### EDIT B — `theo_chat_mark_read` publishes a transient `read` event

**BEFORE (exact substring):**
```
read_state: { thread_id, member_oid, last_read_seq } }` — monotonic upsert (`GREATEST`; never moves backwards). Non-participant → **404**; non-integer `seq` → **400**.
```
**AFTER (exact):**
```
read_state: { thread_id, member_oid, last_read_seq } }` — monotonic upsert (`GREATEST`; never moves backwards). Non-participant → **404**; non-integer `seq` → **400**. **VC-8 — DEPLOYED 2026-07-05:** on success also publishes a transient `{ type:"read", thread_id, reader_oid, last_read_seq }` to the thread's `vaultchat` Web PubSub group (best-effort, post-commit; HTTP body unchanged) so the OTHER participants' "Seen" indicator advances live.
```

## Scope note
API-Spec §2.10 only. No Schema delta (no DDL — `last_read_seq` storage + the peer-read RLS policy already exist from VC-1). No Plan delta (the VC tier was recorded at VC-1). No handler/code change (this documents already-deployed reality).

*End of Role-C Verbatim-Edit Handoff.*
