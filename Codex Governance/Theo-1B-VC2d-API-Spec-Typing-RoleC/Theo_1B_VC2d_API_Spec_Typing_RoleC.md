# Theo 1B — VC-2d `theo_chat_typing` API Spec documentation — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. **Role-C Verbatim-Edit Handoff** (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the **deployed + golden-verified** VC-2d typing endpoint in the API Spec §2.10. **APPROVED / REJECTED only.** Claude Code does not self-edit governed documents; Codex applies the verbatim edit.

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (spec documentation of deployed reality)
Turn issued against HEAD: `bfda29e` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Adds the deployed `theo_chat_typing` (VC-2d; golden-verified 2026-07-04 — 200 participant / 404 non-participant / 400 validation) as a row in Theo API Spec §2.10. Ephemeral endpoint — no Schema change (no table/row), so no Schema-doc edit. One verbatim edit.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 In-Vault chat; insertion after the mark_read row) | `Grep`/`Read` §2.10 (lines 87–95) this turn | `f2475efe720dbba0ebb58e2fd0018095c9a6c931` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4 Role-C row) | `git grep -F "Role-C documentation-update execution"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `git grep -F "emits a Role-C Verbatim-Edit Handoff"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 4 | VC-2d handler (deployed contract source) — `Codex Governance/Theo-1B-VC2d-Chat-Typing-Backend-Pass-1-VEP/theo_chat_typing.index.js` | `Read(full)` earlier this session; golden-verified deployed | Codex-APPROVED @ `bfda29e` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3, §5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Role-C documentation-update execution" | Codex executes this as the Role-C row turn-type |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "In-Vault chat / channels (Tier VC-1)" | EDIT — new typing row appended to the §2.10 table |

## Purpose
`theo_chat_typing` is DEPLOYED to `vaultgpt-func-chat` and golden-verified (2026-07-04): `POST /api/theo_chat_typing { thread_id }` → 200 `{ typing:true }` (participant-gated); 404 non-participant; 400 validation. It is **ephemeral** (best-effort Web PubSub broadcast; no DB write, no `theo_chat_messages` row), so there is **no Schema change** — this handoff edits only the API Spec §2.10. Records deployed reality (closes the VC-2d Gap Register future-trigger for the API Spec).

## Verbatim edit (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10 (append a typing row immediately after the `mark read` row)

**BEFORE (exact — the `mark read` row):**
```
| mark read (unread tracking) | `1B-deployed` — **DEPLOYED 2026-07-04** (VC-1): `POST /api/theo_chat_mark_read` `{ thread_id, seq }` → **200** `{ read_state: { thread_id, member_oid, last_read_seq } }` — monotonic upsert (`GREATEST`; never moves backwards). Non-participant → **404**; non-integer `seq` → **400**. | `theo_chat_thread_members` |
```
**AFTER (exact — the same row, then the new typing row):**
```
| mark read (unread tracking) | `1B-deployed` — **DEPLOYED 2026-07-04** (VC-1): `POST /api/theo_chat_mark_read` `{ thread_id, seq }` → **200** `{ read_state: { thread_id, member_oid, last_read_seq } }` — monotonic upsert (`GREATEST`; never moves backwards). Non-participant → **404**; non-integer `seq` → **400**. | `theo_chat_thread_members` |
| typing indicator (ephemeral) | `1B-deployed` — **DEPLOYED 2026-07-04** (VC-2d; golden-verified): `POST /api/theo_chat_typing` `{ thread_id }` → **200** `{ typing: true }` — participant-gated; best-effort publishes an **ephemeral** `{ type:'typing', thread_id, sender_oid }` to the thread's Web PubSub group. **No persistence** — no `theo_chat_messages` row, no seq, no DB write. Non-participant → **404**; missing/invalid `thread_id` → **400**. Server-relayed (client tokens are receive-only, so the client cannot broadcast typing itself). | Azure Web PubSub (hub `vaultchat`) + `theo_chat_threads` (membership read) |
```

## Post-execution note
After Codex applies EDIT 1, API Spec §2.10 documents all VC chat endpoints incl. `theo_chat_typing`. No Schema-doc edit (ephemeral; §8 `theo_chat_*` unchanged). The VC-2d FE increment (composer typing ping + "…typing" indicator) then grounds against this §2.10 row.

*End of Role-C Verbatim-Edit Handoff.*
