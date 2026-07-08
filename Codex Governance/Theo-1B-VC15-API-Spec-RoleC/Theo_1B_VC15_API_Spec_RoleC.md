# Theo 1B — VC-15 Channel Rename + Transfer-Admin: API-Spec §2.10 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-15 reality. **APPROVED / REJECTED only.**
>
> **Non-colliding with the pending VC-8 / VC-1.2 API-Spec Role-Cs:** this handoff **adds a new §2.10 table row** after the existing "typing indicator" row (line ~94) — it does not touch line 91 (owned by the VC-1.2 Role-C) or line 93 (owned by the VC-8 Role-C).

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (spec amendment)
Turn issued against HEAD: `a995f2fb4aa7aab13a4718ed4dd1d1f79219b76f` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-05) VC-15 reality — API-Spec §2.10 gains a channel-admin row (`theo_chat_rename_channel` / `theo_chat_transfer_admin`; both execution-time admin-gated; VC-15 also hardened add/remove). Additive new table row (no collision with the VC-8 line-93 / VC-1.2 line-91 Role-Cs). Verbatim before/after.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 chat contract — edit target: after the typing row) | `Read` §2.10 lines 88–95 this turn | `e3c036d782f58f08c43405c7d384d9b71ae181cc` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "Azure Web PubSub (hub `vaultchat`) + `theo_chat_threads` (membership read) |" | EDIT 1 — append the channel-admin row after the typing row |

## Verbatim edit (Codex to apply inline in `spec/THEO_API_SPEC.md` §2.10)

### EDIT 1 — append a new channel-admin row after the "typing indicator" row

**BEFORE (exact substring — the end of the typing row):**
```
Azure Web PubSub (hub `vaultchat`) + `theo_chat_threads` (membership read) |
```
**AFTER (exact — same text, then a new table row):**
```
Azure Web PubSub (hub `vaultchat`) + `theo_chat_threads` (membership read) |
| channel admin lifecycle (rename / transfer) | `1B-deployed` — **DEPLOYED 2026-07-05** (VC-15): `POST /api/theo_chat_rename_channel` `{ thread_id, name }` → **200** `{ thread_id, name }`; `POST /api/theo_chat_transfer_admin` `{ thread_id, new_admin_oid }` → **200** `{ thread_id, admin_oid }`. Both **admin-gated at execution time** (`SELECT … FOR UPDATE` row-lock + `admin_oid = caller` folded into the UPDATE with a 0-row → **403** guard), so a caller that loses admin to a concurrent transfer cannot act. Non-participant → **404**; non-channel → **400**; non-admin → **403**; self-transfer or non-member new-admin → **400**. VC-15 also hardened `theo_chat_add_member` / `theo_chat_remove_member` with the same execution-time admin guard (member_oids preserved → the thread UPDATE `WITH CHECK (auth.uid() = ANY(member_oids))` holds). | `theo_chat_threads` |
```

## Scope note
API-Spec §2.10 only (additive row). No Schema delta (no DDL). No handler/code change (documents deployed reality). `leave` + `archive` (with their migration) are VC-16.

*End of Role-C Verbatim-Edit Handoff.*
