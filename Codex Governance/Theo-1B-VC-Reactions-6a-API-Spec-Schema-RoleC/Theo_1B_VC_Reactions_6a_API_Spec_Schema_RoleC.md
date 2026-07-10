# Theo 1B — VC-Reactions (#6a) Emoji Reactions: API-Spec §2.10 + Schema §3 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-Reactions reality (deployed to `vaultgpt-func-chat` 2026-07-10; migration run by Walter; handlers golden-curl-verified). **APPROVED / REJECTED only.** Codex, please finish with the `[Codex Pass 4]` **commit** (a Role-C is complete only when committed at HEAD — this satisfies the next FE VEP's T22).

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `9114504b40f3a7ed568aaafee8b9bd4c49ae41b2` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-10) VC-Reactions reality — API-Spec §2.10 `read / send messages` row gains two routes (`POST theo_chat_add_reaction`, `POST theo_chat_remove_reaction`) and the `list_messages` projection gains `reactions: [{ emoji, oids:[…] }]`; Schema §3 gains a new participant-scoped table `theo_chat_message_reactions`. Verbatim before/after against the committed spec. Migration was run by Walter; the three handlers (add/remove + modified `list_messages`) deployed via Kudu VFS + golden-curl-verified (add→`added:true`, idempotent re-add→`added:false`, remove→`removed:true`, re-remove→`removed:false`; empty emoji/bad uuid→400; non-participant message→404; `list_messages` projects `reactions`).
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row — edit target line 92) | `grep -n "read / send messages"` this turn | `576ab56471337ae85764c2f79783f76c6c62e411` |
| 2 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 chat tables — insert after `theo_chat_messages` row, line 40) | `grep -n "Message within a chat thread"` this turn | `f916ba72cd668f311e1df92b0929d49708dd8f4b` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | EDIT 1 — add/remove routes + `reactions` projection |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Message within a chat thread" | EDIT 2 — new `theo_chat_message_reactions` table row |

## Verbatim edits (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10 (line 92) — add the reaction routes + `reactions` projection at the end of the row

**BEFORE (exact substring — the tail of the `read / send messages` row):**
```
The copied attachment references the ORIGINAL sender's blob; download stays membership-gated via `theo_chat_attachment_download` (a target participant can retrieve it; a non-participant cannot). | `theo_chat_messages` + `theo_chat_threads` + `theo-content` Blob (func-chat managed identity) + Web PubSub + GIPHY REST API (outbound, server-side) |
```
**AFTER (exact):**
```
The copied attachment references the ORIGINAL sender's blob; download stays membership-gated via `theo_chat_attachment_download` (a target participant can retrieve it; a non-participant cannot). **VC-Reactions — DEPLOYED 2026-07-10:** `POST /api/theo_chat_add_reaction` `{ message_id, emoji }` → **201** `{ added, message_id, emoji }` and `POST /api/theo_chat_remove_reaction` `{ message_id, emoji }` → **200** `{ removed, message_id, emoji }` — a per-(message, caller, emoji) toggle. Add is idempotent (`INSERT … ON CONFLICT (message_id, oid, emoji) DO NOTHING` → `added:false` when the caller already reacted with that emoji); remove is idempotent (`removed:false` when nothing matched — no existence leak, no 404). `emoji` is bounded free text (1..32 chars, no C0/DEL control chars → **400** otherwise); a bad `message_id` → **400**; on ADD, a message the caller cannot see (non-participant, resolved under RLS) → **404** (REMOVE is idempotent and never 404s). Each mutation fires a best-effort `{ type:"reaction_added"|"reaction_removed", thread_id, message_id, emoji, oid }` to the thread's Web PubSub group (a publish failure never fails the durable write). `list_messages` messages now also carry `reactions` — `[{ emoji, oids:[<reactor oid>…] }]` grouped by emoji (`[]` when none; `[]` on a tombstone — delete-for-everyone parity with `attachment`/`gif`); the FE derives per-emoji count + "mine" from `oids`. A newly sent/published message (`send_message`) carries no reactions (the FE defaults it to `[]`). | `theo_chat_messages` + `theo_chat_threads` + `theo_chat_message_reactions` + `theo-content` Blob (func-chat managed identity) + Web PubSub + GIPHY REST API (outbound, server-side) |
```

### EDIT 2 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 (after line 40) — add the `theo_chat_message_reactions` table row

**BEFORE (exact substring — the tail of the `theo_chat_messages` row):**
```
Exposed to clients as a `gif` object (masked to `null` on a tombstone). No RLS change. | DEPLOYED — VC-1 (§8) |
```
**AFTER (exact — same line, then a NEW row appended on the next line):**
```
Exposed to clients as a `gif` object (masked to `null` on a tombstone). No RLS change. | DEPLOYED — VC-1 (§8) |
| `theo_chat_message_reactions` | Emoji reaction on a chat message (Tier VC-Reactions) | PK `id uuid`; `message_id uuid` FK→`theo_chat_messages(id)` ON DELETE CASCADE, `thread_id uuid` FK→`theo_chat_threads(id)` ON DELETE CASCADE (denormalised from the message so the RLS gate + realtime group are self-contained — no join to `theo_chat_messages` in policy), `oid text` (reactor Entra OID), `emoji text` (CHECK `length(emoji) BETWEEN 1 AND 32`), `created_at`; UNIQUE `(message_id, oid, emoji)` (a user reacts with a given emoji at most once); indexes on `(message_id)` and `(thread_id)`. **Participant-scoped** RLS mirroring `theo_chat_messages` (not the §2 ownership baseline): SELECT for a participant of the reaction's thread (`thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY(member_oids))`); INSERT/DELETE restricted to the caller's OWN reaction (`oid = auth.uid()` AND participant). Self-contained/non-recursive (threads reference neither back). **No SECURITY DEFINER and no new elevated-read class** — reactions are owner-writable rows, so a definer (which the Golden Handler class reserves for 403/404 existence discrimination) is not needed. Projected by `theo_chat_list_messages` as `reactions:[{ emoji, oids:[…] }]` per message (`[]` on a tombstone); mutated by `theo_chat_add_reaction` (`ON CONFLICT DO NOTHING`) / `theo_chat_remove_reaction` (idempotent DELETE) with a best-effort `reaction_added`/`reaction_removed` Web PubSub publish to the thread group. **VC-Reactions, DEPLOYED 2026-07-10.** | DEPLOYED — VC-Reactions (§8) |
```

## Scope note
API-Spec §2.10 (line 92) + Schema §3 (new table row after line 40) only. No Plan delta (the VC tier is recorded). No handler/code change (documents deployed reality). The new table adds a participant-scoped, owner-writable relation mirroring the existing `theo_chat_messages` RLS idiom — no change to the existing chat tables, policies, or the app-role boundary; no `reporting_*`, monolith, sidecar, Blob, or Graph touched.

*End of Role-C Verbatim-Edit Handoff.*
