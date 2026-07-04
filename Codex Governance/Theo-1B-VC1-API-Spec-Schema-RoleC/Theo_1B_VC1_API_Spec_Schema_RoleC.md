# Theo 1B — VC-1 Native Chat: API Spec (7 routes) + Schema (3 tables) documentation — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. **Role-C Verbatim-Edit Handoff** (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the **already-deployed + golden-verified** VC-1 native chat backend (deployed to `vaultgpt-func-chat` under Orchestration §1E/DR-T7) in the two governed specs. **APPROVED / REJECTED only.** Claude Code does not self-edit governed documents; Codex applies the verbatim edits below.

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (spec documentation of deployed reality)
Turn issued against HEAD: `232e46e` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Documents deployed VC-1 chat backend — 7 routes into Theo API Spec (new §2.10, inserted before §3 Boundary) and 3 `theo_chat_*` tables into the Azure Postgres Schema (§3 registry rows + §3 header + new §8 tier section). Deployed reality verified by golden curls 2026-07-04. The chat tables use a participant-scoped (member_oids) RLS model — documented as the Walter-authorized, Codex-APPROVED (VC-1 VEP @ `5d91bf2`) deviation from the §2 ownership baseline; non-recursive; no new SECURITY DEFINER / elevated-read class. 4 verbatim edits below.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2 Contract Surface; §3 Boundary; insertion point) | `Read` §2.9–§3 (lines 83–89) this turn | `c0e51f8d5f76d185a8bdd6d831f14409b763a273` |
| 2 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 registry; §5–§7 tier sections; append point) | `Read` §3 (lines 25–44) this turn | `59924ef06b64e62b4cc6a268793d52bd82945cbd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor; §4 Role-C row) | `git grep -F "Role-C documentation-update execution"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `git grep -F "emits a Role-C Verbatim-Edit Handoff"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 5 | VC-1 canonical migration + verify — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (+ `vc1_chat_verify.sql`) | `Read(full)` earlier this session; cited as canonical DDL | migration deployed @ `5d91bf2` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3, §5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Role-C documentation-update execution" | Codex executes this as the Role-C row turn-type |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2 | "Contract Surface (1A) → Deployed Endpoints (1B)" | EDIT 1 — new §2.10 chat group joins the deployed-endpoint surface |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Structural Table Set" | EDITs 2–4 — 3 new `theo_chat_*` tables registered + §8 tier section |

## Scope note

The VC-1 native chat backend is **DEPLOYED to `vaultgpt-func-chat` and golden-verified** (2026-07-04). This handoff records that deployed reality in the two specs; it makes **no** behavior change. The three chat tables intentionally use a **participant-scoped** RLS model (`auth.uid() = ANY(member_oids)`) rather than the §2 ownership baseline (`created_by = auth.uid()`); this was authored, Codex-APPROVED, and Walter-deployed via the VC-1 VEP (`5d91bf2`) and is documented as such in EDIT 4 (self-contained, non-recursive; no `theo_chat_*_exists_unscoped` helper and no new elevated-read class). Schema §1/§2 remain the ownership baseline for ownership-family tables; §8 documents the sanctioned per-feature deviation.

## Verbatim edits (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` (insert a new `### §2.10` group immediately BEFORE `## §3 Boundary`)

**BEFORE (exact — the target line to insert before):**
```
## §3 Boundary
```
**AFTER (exact — new §2.10 group, one blank line, then the unchanged `## §3 Boundary`):**
```
### §2.10 In-Vault chat / channels (Tier VC-1) — backs the People-panel native chat surface
| Contract | Status | Backing |
|----------|--------|---------|
| negotiate a realtime connection | `1B-deployed` — **DEPLOYED 2026-07-04** (VC-1; golden-verified): `GET /api/theo_chat_negotiate` (no body) → **200** `{ url, hub, groups }`. Issues an Azure Web PubSub **client access token** (hub `vaultchat`) scoped to exactly the caller's thread groups (RLS-filtered). **Receive-only:** the token's `groups` auto-join the caller for delivery; **no client role** is granted (no `sendToGroup`/`joinLeaveGroup`), so a browser cannot publish directly — all sends are server-authoritative via `theo_chat_send_message`. Unauthenticated → **401**. Runs on the dedicated **`vaultgpt-func-chat`** app (Windows v4, EP1), not the monolith. | Azure Web PubSub (`vaultgpt-webpubsub`, hub `vaultchat`) + `theo_chat_threads` |
| open / list DMs + channels | `1B-deployed` — **DEPLOYED 2026-07-04** (VC-1): `POST /api/theo_chat_create_dm` `{ peer_oid }` → **201** (new) / **200** (existing) `{ thread, created }` — canonical get-or-create keyed by a sorted-OID-pair `dm_key` (A↔B resolve to one thread). `POST /api/theo_chat_create_channel` `{ name, member_oids[] }` → **201** `{ thread, created:true }` (creator auto-included; members deduped; caps enforced). `GET /api/theo_chat_list_threads` → **200** `{ threads: [{ id, kind, name, member_oids, created_by, dm_key, created_at, updated_at, last_read_seq, unread_count, last_message }] }` newest-updated-first (`unread_count` counts only messages from **others**). Self/invalid `peer_oid`, blank channel name, or non-OID members → **400**. | `theo_chat_threads` + `theo_chat_thread_members` |
| read / send messages | `1B-deployed` — **DEPLOYED 2026-07-04** (VC-1): `GET /api/theo_chat_list_messages?threadId=<uuid>&before=<seq>&limit=<n>` → **200** `{ messages: [{ id, thread_id, seq, sender_oid, body, created_at }], page: { limit, has_more, next_before } }` (seq-cursor paged; ascending for display). `POST /api/theo_chat_send_message` `{ thread_id, body }` → **201** `{ message }` — assigns the next per-thread `seq` atomically (retry on race; **409** on exhaustion), persists + commits, then **best-effort** publishes to the thread's Web PubSub group (a publish failure never fails the durable send). Non-participant of the target thread → **404** (no existence leak); blank/oversized (>8000) body or bad `threadId` → **400**. | `theo_chat_messages` + `theo_chat_threads` + Web PubSub |
| mark read (unread tracking) | `1B-deployed` — **DEPLOYED 2026-07-04** (VC-1): `POST /api/theo_chat_mark_read` `{ thread_id, seq }` → **200** `{ read_state: { thread_id, member_oid, last_read_seq } }` — monotonic upsert (`GREATEST`; never moves backwards). Non-participant → **404**; non-integer `seq` → **400**. | `theo_chat_thread_members` |

All `theo_chat_*` endpoints execute as the signed-in user (Entra OID from EasyAuth `x-ms-client-principal`) on the dedicated `vaultgpt-func-chat` app; access is **participant-scoped** — a caller reads/sends only in threads where its OID is in `theo_chat_threads.member_oids` (enforced by non-recursive RLS AND an explicit predicate; a non-participant gets **404**, no existence leak). Realtime is Azure Web PubSub (hub `vaultchat`) with **server-authoritative** publish (clients hold receive-only tokens). The monolith `vaultgpt-func-premium` and streaming sidecar `vaultgpt-func-stream` are unchanged. Post-hoc channel membership editing (`theo_chat_add_member` / `theo_chat_remove_member`) is the VC-1.2 fast-follow.

## §3 Boundary
```

### EDIT 2 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 heading (cite the new tier)

**BEFORE (exact):**
```
## §3 Structural Table Set (DDL DEPLOYED — Tier B2 §5; Tier B7a §6; Tier B8a §7)
```
**AFTER (exact):**
```
## §3 Structural Table Set (DDL DEPLOYED — Tier B2 §5; Tier B7a §6; Tier B8a §7; Tier VC-1 §8)
```

### EDIT 3 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 registry (append 3 rows immediately after the `theo_attachments` row)

**BEFORE (exact — the `theo_attachments` registry row):**
```
| `theo_attachments` | File attached to a chat (Attachments, Tier B8) | `conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `filename text` (non-empty CHECK), `content_type text`, `byte_size bigint` (CHECK `>= 0`), `blob_container`/`blob_path` (pointer into the existing `theo-content` container), `ingestion_class text` + `extracted_text_path text NULL` (B8c extraction metadata). Body lives in Blob; the row holds only the pointer. | DEPLOYED — B8a (§7) + B8c addendum |
```
**AFTER (exact — the same row, then three new `theo_chat_*` rows):**
```
| `theo_attachments` | File attached to a chat (Attachments, Tier B8) | `conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `filename text` (non-empty CHECK), `content_type text`, `byte_size bigint` (CHECK `>= 0`), `blob_container`/`blob_path` (pointer into the existing `theo-content` container), `ingestion_class text` + `extracted_text_path text NULL` (B8c extraction metadata). Body lives in Blob; the row holds only the pointer. | DEPLOYED — B8a (§7) + B8c addendum |
| `theo_chat_threads` | Native in-Vault chat thread — DM or channel (Tier VC-1) | `kind text` (CHECK `dm`\|`channel`), `name text NULL` (channel label; NULL for a DM), `member_oids text[]` (participant Entra OIDs — the RLS gate), `created_by text` (creator OID), `dm_key text NULL` (canonical sorted-OID-pair; UNIQUE partial index WHERE not null), `created_at`/`updated_at` (bumped per message → newest-first ordering). gin index on `member_oids`. **Participant-scoped** RLS (not the §2 ownership baseline) — see §8. | DEPLOYED — VC-1 (§8) |
| `theo_chat_thread_members` | Per-member read-state for a chat thread (Tier VC-1) | PK `(thread_id, member_oid)`; `thread_id` FK→`theo_chat_threads` ON DELETE CASCADE, `member_oid text`, `last_read_seq bigint` (monotonic unread cursor), `joined_at`. Membership **authority** is `theo_chat_threads.member_oids`; this table tracks read state. | DEPLOYED — VC-1 (§8) |
| `theo_chat_messages` | Message within a chat thread (Tier VC-1) | `thread_id` FK→`theo_chat_threads` ON DELETE CASCADE, `seq bigint` (per-thread monotonic; UNIQUE per thread), `sender_oid text`, `body text` (CHECK length 1..8000), `created_at`. Immutable — no `updated_at`, no UPDATE/DELETE policy. | DEPLOYED — VC-1 (§8) |
```

### EDIT 4 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (append a new `## §8` tier section at EOF)

**INSERT (exact) — after the final line (which ends ``…Codex Governance/Theo-1B-B8i-Reload-Parity-Backend-Pass-1-VEP/b8i_addendum.sql`.``), preceded by one blank line:**
```

## §8 DEPLOYED DDL — Tier VC-1 (2026-07-04)

**Status:** DEPLOYED + read-only-verified against `vaultgpt-postgres-prod` (schema `public`). Verification (catalog read-only): `theo_chat_threads`, `theo_chat_thread_members`, `theo_chat_messages` all present with RLS enabled; **participant-scoped** policy set present — `theo_chat_threads` SELECT/INSERT/UPDATE, `theo_chat_thread_members` SELECT/INSERT/UPDATE/DELETE, `theo_chat_messages` SELECT/INSERT (messages are immutable — no UPDATE/DELETE); constraints — `theo_chat_threads.kind IN ('dm','channel')`, `theo_chat_messages.body` length 1..8000, `theo_chat_messages` UNIQUE `(thread_id, seq)`, both child tables FK→`theo_chat_threads(id)` ON DELETE CASCADE; indexes — `dm_key` UNIQUE partial (WHERE `dm_key IS NOT NULL`), `member_oids` gin, `theo_chat_messages(thread_id, seq)`.

**Canonical DDL (single source of truth):** `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (Codex-APPROVED at `5d91bf2`; deployed by Walter); read-only verification `…/vc1_chat_verify.sql`. Not duplicated here.

**As-built specifics (participant-scoped model — a Walter-authorized, Codex-APPROVED deviation from the §2 ownership baseline):** these three tables back the native in-Vault chat (DMs + group channels; Tier VC-1), deployed to the dedicated `vaultgpt-func-chat` app (Windows v4, EP1) with Azure Web PubSub (hub `vaultchat`) for realtime delivery. Unlike the ownership-family tables (§2, keyed on `created_by = auth.uid()`), access is **participant-scoped**: `theo_chat_threads` carries `member_oids text[]` and its SELECT policy is the self-contained `auth.uid() = ANY(member_oids)`; `theo_chat_thread_members` and `theo_chat_messages` gate by referencing `theo_chat_threads` (self-contained), and `theo_chat_threads` references neither back — so the policy set is **non-recursive** (the B5c SECURITY-DEFINER recursion trap is avoided by design). Deliberately **no `theo_chat_*_exists_unscoped` SECURITY DEFINER helper and no new elevated-read class**: a non-participant read returns 0 rows → the handler maps to **404** (no existence leak). Policies: `theo_chat_threads` — SELECT/UPDATE `auth.uid() = ANY(member_oids)`, INSERT `created_by = auth.uid() AND auth.uid() = ANY(member_oids)`, no DELETE; `theo_chat_thread_members` — SELECT (own row OR a thread you belong to), INSERT (into a thread you belong to), UPDATE (your own read-state only), DELETE (a thread you belong to); `theo_chat_messages` — SELECT (a thread you belong to), INSERT (`sender_oid = auth.uid()` into a thread you belong to), immutable. Participant scoping is enforced by RLS AND by explicit predicates in the VC-1 handlers (the shared Functions connection role bypasses RLS — defence in depth). `theo_chat_threads.updated_at` is bumped by `theo_chat_send_message` to drive newest-first ordering; `theo_chat_thread_members.last_read_seq` is a monotonic (`GREATEST`) unread cursor. Realtime publish is **server-authoritative** — clients hold receive-only Web PubSub tokens (no `sendToGroup` role). Boundary: net-new additive tables; no `reporting_*` touched; monolith/sidecar unchanged.
```

## Post-execution note

After Codex applies EDITs 1–4 on `development`, the Theo API Spec and Azure Postgres Schema fully document the deployed VC-1 chat backend, closing the VC-1 §P2.5 Gap Register future-trigger for those two docs. (The Phase 1B Backend Plan tier entry for native chat remains a separate future-trigger — folded into the plan's next amendment.)

*End of Role-C Verbatim-Edit Handoff.*
