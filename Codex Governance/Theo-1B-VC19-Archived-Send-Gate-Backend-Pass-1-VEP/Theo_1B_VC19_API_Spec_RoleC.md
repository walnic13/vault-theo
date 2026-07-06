# Theo 1B — VC-19 Archived-Thread Write-Gate: API-Spec §2.10 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-19 reality. **APPROVED / REJECTED only.** Codex, please finish with the `[Codex Pass 4]` **commit** (a Role-C is complete only when committed at HEAD).

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `df466ed5a98f150cecea1c41b6171cef5de9407b` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-06) VC-19 reality — API-Spec §2.10 `read / send messages` row gains a note that `theo_chat_send_message` + `theo_chat_forward_message` now return **409 `CONVERSATION_ARCHIVED`** when the (target) thread is archived. NO Schema delta (the `theo_chat_threads.archived_at` column is already documented §3, VC-16). NO migration (the column pre-exists). Handlers deployed + golden-verified (see the sibling `VC19_Pass_3_Deploy_Evidence.md`). One verbatim before/after against the committed spec.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row — edit target line 92) | `grep -n "read / send messages"` this turn | `181f8207411a9e77a481669e674e2b0c0425e9a2` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | EDIT 1 — the 409 archived note on the row |

## Verbatim edit (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10 (line 92) — append the VC-19 archived write-gate note at the end of the row

**BEFORE (exact substring):**
```
the raw origin id is never exposed (only the boolean — cross-thread privacy). | `theo_chat_messages` + `theo_chat_threads` + Web PubSub |
```
**AFTER (exact):**
```
the raw origin id is never exposed (only the boolean — cross-thread privacy). **VC-19 — DEPLOYED 2026-07-06:** an **archived channel is read-only** — `POST /api/theo_chat_send_message` and `POST /api/theo_chat_forward_message` (forward-in) now return **409** `{ error.code: "CONVERSATION_ARCHIVED" }` when the (target) thread is archived (`theo_chat_threads.archived_at` non-NULL, VC-16); reading history (`list_messages`) and **forwarding OUT** of an archived channel stay allowed, and a DM never triggers it (only a channel is archivable). The gate is a cooperative application-layer write-gate layered on the unchanged membership/RLS boundary. | `theo_chat_messages` + `theo_chat_threads` + Web PubSub |
```

## Scope note
API-Spec §2.10 (line 92) only. No Schema delta (the `archived_at` column is already documented in Schema §3, VC-16). No Plan delta (the VC tier is recorded). No handler/code change (documents deployed reality). No RLS/policy change (the gate is application-layer; the `theo_chat_message_insert` policy is unchanged and state-agnostic).

*End of Role-C Verbatim-Edit Handoff.*
