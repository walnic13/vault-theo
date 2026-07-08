# Theo 1B — VC-18 Hard-Delete-a-Channel: API-Spec §2.10 + Schema §8 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-18 reality. **APPROVED / REJECTED only.** Codex, please finish with the `[Codex Pass 4]` **commit** (a Role-C is complete only when committed at HEAD — satisfies VC-17-FE's T22 for the Delete item).

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `0af890c3bcf25f146f8143ce8c35fc73783d9341` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-05) VC-18 reality — API-Spec §2.10 admin-lifecycle row gains `POST theo_chat_delete_channel` (admin-only permanent delete; cascades messages + members); Schema §8 documents the admin-only `theo_chat_thread_delete` policy (amends the "no DELETE" note). Verbatim before/after against the committed spec. Migration was run by Walter; handler deployed + golden-verified (see the sibling deploy-evidence).
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 admin-lifecycle row — edit target line 95) | `grep -n "channel admin lifecycle"` this turn | `1274f5cff90a788eaed2178c55ed39e6b9ca143b` |
| 2 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§8 policy list — edit target line 85) | `grep -n "Policies: \`theo_chat_threads\`"` this turn | `7b6174c16946948c704e22116885072b4ecaad2e` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "channel admin lifecycle" | EDIT 1 — the delete route joins the admin-lifecycle row |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §8 | "no DELETE" | EDIT 2 — the admin-only DELETE policy replaces the "no DELETE" note |

## Verbatim edits (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10 (line 95) — add the delete-channel route to the admin-lifecycle row

**BEFORE (exact substring):**
```
VC-15 also hardened `theo_chat_add_member` / `theo_chat_remove_member` with the same execution-time admin guard (member_oids preserved → the thread UPDATE `WITH CHECK (auth.uid() = ANY(member_oids))` holds). | `theo_chat_threads` |
```
**AFTER (exact):**
```
VC-15 also hardened `theo_chat_add_member` / `theo_chat_remove_member` with the same execution-time admin guard (member_oids preserved → the thread UPDATE `WITH CHECK (auth.uid() = ANY(member_oids))` holds). **VC-18 — DEPLOYED 2026-07-05:** `POST /api/theo_chat_delete_channel` `{ thread_id }` → **200** `{ thread_id, deleted:true }` — admin-only **PERMANENT** delete (distinct from the soft VC-16 archive); the thread row is removed and its `theo_chat_thread_members` + `theo_chat_messages` cascade away (`ON DELETE CASCADE`). Admin-gated at execution time (`FOR UPDATE` + `admin_oid = caller AND kind='channel'` in the `DELETE` + 0-row → **403**) and by the new admin-only `theo_chat_thread_delete` RLS policy; a best-effort `{ type:"channel_deleted", thread_id }` is published to the group. Non-participant → **404**; non-channel (dm) → **400**; non-admin → **403**. | `theo_chat_threads` |
```

### EDIT 2 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §8 (line 85) — document the admin-only DELETE policy

**BEFORE (exact substring):**
```
Policies: `theo_chat_threads` — SELECT/UPDATE `auth.uid() = ANY(member_oids)`, INSERT `created_by = auth.uid() AND auth.uid() = ANY(member_oids)`, no DELETE;
```
**AFTER (exact):**
```
Policies: `theo_chat_threads` — SELECT/UPDATE `auth.uid() = ANY(member_oids)`, INSERT `created_by = auth.uid() AND auth.uid() = ANY(member_oids)`, DELETE `admin_oid = auth.uid()` (**VC-18, DEPLOYED 2026-07-05** — policy `theo_chat_thread_delete`; admin-only channel hard-delete, cascades members + messages via the existing `ON DELETE CASCADE` FKs; a DM has `admin_oid` NULL so is never deletable; no SECURITY DEFINER);
```

## Scope note
API-Spec §2.10 (line 95) + Schema §8 (line 85) only. No Plan delta (the VC tier is recorded). No handler/code change (documents deployed reality). One additive RLS policy; no `SECURITY DEFINER`; no new elevated-read class.

*End of Role-C Verbatim-Edit Handoff.*
