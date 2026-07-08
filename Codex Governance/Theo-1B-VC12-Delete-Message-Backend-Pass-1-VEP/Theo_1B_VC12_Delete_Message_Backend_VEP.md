# Theo 1B — VC-12 Delete-a-Message Backend (migration `deleted_at`/`deleted_by` + body-CHECK relaxation + `SECURITY DEFINER theo_chat_delete_message` + new `theo_chat_delete_message` handler + `list_messages`/`send_message` tombstone masking) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). **Walter runs the migration at Pass 3 FIRST**, then Claude Code deploys to the **dedicated `vaultgpt-func-chat`** app (§1E / DR-T7) + runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 + Schema deltas. Plan-only.
>
> **Scope (VC-12 = the delete piece of the message-actions trio VC-11 reply / VC-12 delete / VC-13 forward):** WhatsApp-style **"delete for everyone" by the sender** — a soft tombstone that truly removes the content. (1) a **migration** adding `theo_chat_messages.deleted_at`/`deleted_by`, relaxing the body CHECK so a tombstoned row may have `body = NULL`, and a narrowly-scoped `SECURITY DEFINER theo_chat_delete_message(uuid)`; (2) NEW `theo_chat_delete_message` handler (sender-only, RLS-visibility gate → 404 / sender gate → 403); (3) MODIFY `theo_chat_list_messages` + `theo_chat_send_message` to carry `deleted`/`deleted_at` on messages and mask a deleted quoted-parent (so a tombstone renders "This message was deleted" everywhere, including inside a VC-11 `reply_to` preview).
>
> **Why a `SECURITY DEFINER` function for delete:** messages are **"Immutable — no `updated_at`, no UPDATE/DELETE policy"** — the app role has NO UPDATE capability. Rather than broaden that surface with a sender-UPDATE policy, a narrowly-scoped `SECURITY DEFINER` function (owned by the migration role; tables `ENABLE`-not-`FORCE` RLS) performs the single tombstone write. It is **safe**: it mutates ONLY the caller's own message (`current_setting('request.jwt.claim.sub')`, never a parameter), reads the row `FOR UPDATE` + re-asserts `sender = caller` in the UPDATE, and only ever sets the tombstone. Same justified class as VC-16's deployed `theo_chat_leave`. **Scope decisions (grounded):** sender-only "delete for everyone"; content truly nulled (not merely masked); **admin moderation-delete and a delete-time-window are deferred** to a later VC.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `bc8169292ec0eab424582b8b2aed8031d02e0144` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-12 delete-a-message. P1–P8 walked; additive+reversible migration (`deleted_at`/`deleted_by` + conditional body CHECK relaxation + `SECURITY DEFINER theo_chat_delete_message`) with verify SQL; Primary Reference = the deployed `theo_chat_leave_channel` (the VC-16 SECURITY DEFINER self-service precedent) inlined byte-verbatim + its function.json; one NEW handler (delete) + two MODIFY (`list_messages`, `send_message` — tombstone masking on the VC-11 base) inlined full; the NEW function.json + the unchanged send/list bindings included. The SECURITY DEFINER delete function is justified + scoped in §P8. No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register) | `grep -F "VEP Format"` + `grep -F "Gap Register"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4A P-track) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary; §4 external-system) | `grep -F "selects **exactly one** deployed handler file"` + `grep -F "new-domain or new-external-system helper"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis; §1E deploy exception) | `grep -F "Pass 1 (Claude Code VEP)"` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (ownership posture → VC tier recorded VC-1) | `grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` immutability note VC-12 amends; §8 chat RLS set) | `grep -F "Immutable — no"` this turn | `a944639a3b7268332954e3cb3669c7d23a64a003` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row — delete + tombstone delta lands at Pass 4) | `grep -F "read / send messages"` this turn | `07b061022c34fcc9b08ac3b13191caeb441fa98a` |
| 10 | **Primary Reference handler** (deployed SECURITY DEFINER self-service precedent — handler + definer fn) — `Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/theo_chat_leave_channel.index.js` | `Read(full)` this turn; deployed | `2b06a91ebd34e0b3ec14acbe963048c5c0ecab96` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/theo_chat_leave_channel.function.json` | `Read(full)` this turn | `fc9df8996d90f789abbd4de2a5798bb6ac265346` |
| 12 | **SECURITY DEFINER precedent** — `Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/vc16_leave_archive_migration.sql` (`theo_chat_leave` FOR UPDATE + predicate-in-UPDATE) | `Read(full)` this turn; cited | `cfca547db53c2d1e46b6e42befd96ac01ebd1854` |
| 13 | **MODIFY basis** — deployed VC-11 `theo_chat_list_messages.index.js` / `theo_chat_send_message.index.js` (the tombstone masking extends these) | `Read(full)` this turn | `74b609d771b304405f08b2319f5bfc90c6decee0` / `5f725c815355e912abe7461b8686c8f19a63cfc5` |
| 14 | **RLS basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (`theo_chat_message_select` participant-scoped; messages immutable — no UPDATE policy) | `Read(full)`/`sed` this turn; cited | `67ff9b5f654e146c01590d9ce0f9286969e54103` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` + streaming sidecar `vaultgpt-func-stream` READ-ONLY — deploy targets `vaultgpt-func-chat`. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §MIGRATION + §SM + §HG + §API-SPEC + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P2.5 — VC tier Walter-directed; recorded VC-1 |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_leave_channel` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — no new external system |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — VC-12 touches only `theo_chat_*`; no `reporting_*` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — sender-scoped tombstone is an ownership-family extension |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Immutable — no `updated_at`, no UPDATE/DELETE policy" | §P6 / §P8 — VC-12 relaxes this narrowly (soft tombstone via a definer fn); Role-C amends the note |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | §API-SPEC — the delete + tombstone delta lands on this row |
| Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/theo_chat_leave_channel.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.1 — the delete handler keeps the deployed set_config triad |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql | select policy | "theo_chat_message_select" | §HG.1 / §P8 — the RLS-visibility gate (404) rides the participant SELECT policy |
| Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/theo_chat_leave_channel.function.json | binding | "httpTrigger" | §SM-FJ / §FJ — anonymous httpTrigger bindings (EasyAuth gates identity) |

## P1 — Feature identification
**Microstep:** VC-12 — the delete piece of the message-actions trio: a sender can **delete their own message for everyone** (WhatsApp-style). The delete is a soft tombstone (`deleted_at`) that truly removes the body (`body = NULL`); the message renders as "This message was deleted" everywhere it appears, including inside a VC-11 `reply_to` quote.

**Migration:** `theo_chat_messages.deleted_at timestamptz` + `deleted_by text`; a conditional body CHECK (tombstoned row may have `body NULL`); `SECURITY DEFINER theo_chat_delete_message(uuid)`.
**New handler (1):** `POST /api/theo_chat_delete_message` `{ message_id }`.
**Modified (2):** `theo_chat_list_messages` + `theo_chat_send_message` — add `deleted`/`deleted_at` to messages and `deleted` to the `reply_to` preview.

**Out of scope (VC-12):** the FE (a delete affordance + tombstone rendering = vault-origin **VC-12-FE**); **channel-admin moderation-delete** of others' messages; a **delete-time-window** (v1 has none); un-delete/restore; editing a message; hard delete. Forward = VC-13.

**Plan status:** VC tier Walter-directed, reconciled at VC-1 ("sharing/membership RLS models (ownership-only unless Walter authorizes)"). Doc delta = API-Spec §2.10 `read / send messages` row + Schema §3 `theo_chat_messages` (`deleted_at`/`deleted_by` + the definer fn + the amended immutability note) (Role-C, Pass 4).

## P2 — Architecture & boundary reconciliation
**Handler family.** The new `theo_chat_delete_message` is a Family-B HTTP handler mirroring the Primary Reference (`theo_chat_leave_channel`): `pg` Pool on the chat app's libpq `PG*` env; EasyAuth `x-ms-client-principal` OID; validate-before-SQL; `set_config` triad; RLS-visibility gate then a `SECURITY DEFINER` self-service call; `{data,meta}`/`{error}` envelope; anonymous `httpTrigger`; a best-effort Web PubSub publish (mirrors `send_message`). The two MODIFY handlers extend their deployed VC-11 selves with tombstone masking only.
**Boundary.** Reads/writes only `theo_chat_*`. Per Golden §3 ("It MUST NOT read or write" outside its domain) no `reporting_*`/monolith/Blob/Graph/Foundry. Deploy target `vaultgpt-func-chat`; monolith + sidecar READ-ONLY.
**Validation before SQL.** UUID `message_id` → deterministic 400 before any SQL.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| API-Spec §2.10 + Schema §3 will change (the delete route; `deleted`/`deleted_at`; the new column + definer fn; the amended immutability note). | Documentation-currency delta on the recorded VC tier. | **PROCEED** with a Role-C (Pass 4): `spec/THEO_API_SPEC.md` §2.10 + `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3. Sequenced after Pass 3 deploy + curls. |
| A `SECURITY DEFINER` function is introduced AND the message body CHECK is relaxed — the Schema says messages are "Immutable — no UPDATE/DELETE policy". | The immutability is deliberately relaxed to a **soft tombstone**: the row persists (seq/ordering intact), only the content is nulled, and ONLY via the sender-scoped definer fn (the app role still has no general UPDATE). Same justified class as VC-16's `theo_chat_leave`. The relaxed CHECK still enforces 1..8000 for a LIVE row. | **PROCEED** — justified + scoped in §P8; the Role-C amends the §3 note. |
| Admin moderation-delete + delete-time-window not built. | v1 = sender-only "delete for everyone", no time limit. WhatsApp offers admin-delete + a window; deferred. | **PROCEED** — later VC. |
| A reply may point at a since-deleted parent. | The `reply_to` preview is re-derived from the parent each read; VC-12 masks a tombstoned parent (`body NULL`, `deleted:true`) so it renders "message deleted" — no stale content. Replying to an already-deleted message is allowed with a masked preview (the FE typically hides reply on a tombstone). | **PROCEED** — masking is complete on both read + send paths. |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**No new external system in VC-12.** The delete handler reuses the existing best-effort Web PubSub publish (a new `{ type:"message_deleted" }` event on the SAME hub/binding); `send_message` keeps its publish. Per Golden §4 a "new-domain or new-external-system helper" would need justification; VC-12 introduces none — pure Postgres over `theo_chat_*` + the pre-existing publish.

## P4 — Contract reconciliation
Envelope unchanged (`{data,meta}`/`{error}`).
- `theo_chat_delete_message` `{ message_id }` → `200 { thread_id, message_id, deleted:boolean }` (`deleted:true` on tombstone or already-deleted — idempotent).
- `theo_chat_list_messages` → each message gains `deleted` (bool) + `deleted_at`; a tombstoned message has `body: null`; the `reply_to` preview gains `deleted` and a tombstoned parent has `body: null`.
- `theo_chat_send_message` → the returned `message` gains `deleted:false` + `deleted_at:null` (shape parity); the `reply_to` preview gains `deleted`.
Malformed input → 400; message not visible/not found → 404; not the sender → 403.

## P5 — Error-model reconciliation
Mirrors the Primary Reference: 401 / 400 (bad JSON, bad `message_id` UUID) / 404 (not visible / not found, `isKnown`) / 403 (not the sender — `isKnown`; or the definer fn's `42501` sender re-check / an RLS `42501`) / else 500. The definer fn raises `42501` if `sender <> caller` (pre-checked by the handler → 403; the handler also maps a stray `42501` → 403). `isKnown` errors re-map verbatim.

## P6 — Data-shape reconciliation
Additive columns: `theo_chat_messages.deleted_at timestamptz` + `deleted_by text` (both nullable; NULL = live). The body CHECK is replaced with a conditional CHECK (a tombstoned row may have `body NULL`; a live row keeps 1..8000). One `SECURITY DEFINER` function `theo_chat_delete_message(uuid)`. No new table/index. The message is **no longer strictly "Immutable — no `updated_at`, no UPDATE/DELETE policy"**: it is now soft-deletable via the sender-scoped definer fn only (the Role-C amends that §3 note). Full DDL in §MIGRATION.

## P7 — Idempotency / concurrency
- `delete` is idempotent: an already-tombstoned message returns `deleted:true` (no-op). The definer fn reads the row `FOR UPDATE` and re-asserts `sender = caller AND deleted_at IS NULL` in the UPDATE — a 0-row result (already deleted or raced) is handled (returns false only when nothing to do; already-deleted short-circuits to true before the UPDATE).
- The tombstone write touches a single row under a row lock; no seq/ordering change (seq is immutable). `list_messages`/`send_message` are unaffected in their concurrency posture (the seq-retry INSERT is byte-identical).
- No lost-update risk: only the sender can tombstone, and the write is guarded + row-locked.

## P8 — Security / RLS reconciliation
**The scoped `SECURITY DEFINER` exception, justified.** Messages carry NO UPDATE policy for the app role (they are "Immutable — no `updated_at`, no UPDATE/DELETE policy"), so the app role cannot UPDATE at all. `theo_chat_delete_message(uuid)` is `SECURITY DEFINER` owned by the migration role (tables `ENABLE`-not-`FORCE` RLS) → it can perform the tombstone write. It is **safe**: it derives the actor solely from `current_setting('request.jwt.claim.sub')` (never a parameter), mutates ONLY that caller's own message (`sender_oid = v_oid`), reads the row `FOR UPDATE` and re-asserts `sender_oid = v_oid AND deleted_at IS NULL` in the UPDATE (execution-time safe), and only ever sets the tombstone (`deleted_at`/`deleted_by` + `body NULL`) — it can neither edit message text nor touch another member's message. `EXECUTE` is granted to `authenticated` only (`REVOKE ALL … FROM PUBLIC`); `search_path` pinned. Same justified class as the deployed VC-16 `theo_chat_leave`; no new elevated-READ class.
**Read-path gate unchanged.** The delete handler's 404 rides the existing participant-scoped `theo_chat_message_select` (a non-participant can't see the message → 404, no existence leak); the sender check adds the 403. `list_messages`/`send_message` masking exposes only `deleted`/`deleted_at` + a nulled body — no data a participant couldn't already read. Sender-scoped delete is an ownership-family extension ("Default family: ownership-based").
**No leakage.** Delete response carries `thread_id`/`message_id`/boolean; the realtime `message_deleted` event carries only ids. No tokens/bodies.

## §MIGRATION — `vc12_delete_migration.sql` (additive + reversible; run by Walter at Pass 3 BEFORE the handler deploy)

Additive, idempotent (`ADD COLUMN IF NOT EXISTS` / guarded `DO` blocks / `CREATE OR REPLACE`), reversible. No top-level transaction control (Golden §5.2); Walter executes. `-- label` comments + guarded `DO` blocks only.

```sql
-- Theo VC-12 — delete-a-message (soft, "delete for everyone" by the sender). ADDITIVE + REVERSIBLE.
-- Run by Walter at Pass 3 BEFORE the VC-12 handlers deploy. Idempotent; safe to re-run.
--
-- What it does:
--  (1) theo_chat_messages.deleted_at / deleted_by — the soft-delete tombstone markers.
--  (2) Relaxes the body constraint so a TOMBSTONED row may have body = NULL — a delete truly removes
--      the content for everyone (not merely masks it in reads). An ACTIVE row keeps the 1..8000 CHECK.
--  (3) A narrowly-scoped SECURITY DEFINER function theo_chat_delete_message(uuid) that lets the SENDER
--      tombstone THEIR OWN message. Same justified class as VC-16's theo_chat_leave: messages carry no
--      UPDATE policy for the app role (they are "immutable — no UPDATE/DELETE policy"), so the app role
--      cannot UPDATE at all; rather than broaden that surface with a sender-UPDATE policy, this definer
--      function (owned by the migration role; tables ENABLE-not-FORCE RLS) performs the single, tightly
--      scoped tombstone write. It is SAFE: it mutates ONLY the caller's own message
--      (current_setting('request.jwt.claim.sub'), never a parameter), reads the row FOR UPDATE and
--      re-asserts sender = caller in the UPDATE (execution-time safe), and only ever sets the tombstone
--      (deleted_at/deleted_by + body NULL) — it can neither edit a message's text nor touch anyone
--      else's message. EXECUTE → authenticated only; REVOKE FROM PUBLIC; search_path pinned.

-- 1) Tombstone markers. deleted_at NULL = live; non-NULL = deleted-for-everyone.
ALTER TABLE public.theo_chat_messages ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.theo_chat_messages ADD COLUMN IF NOT EXISTS deleted_by text;

-- 2) Relax the body constraint: a tombstoned row may have body NULL; a live row keeps 1..8000.
--    Drop the existing body CHECK by DISCOVERING its name (an inline unnamed column CHECK is auto-named,
--    conventionally theo_chat_messages_body_check, but we find it defensively so the migration is robust).
ALTER TABLE public.theo_chat_messages ALTER COLUMN body DROP NOT NULL;
DO $mig$
DECLARE c_name text;
BEGIN
  SELECT con.conname INTO c_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  JOIN pg_namespace n ON n.oid = rel.relnamespace
  WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
    AND con.contype = 'c' AND pg_get_constraintdef(con.oid) ILIKE '%length(body)%';
  IF c_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.theo_chat_messages DROP CONSTRAINT %I', c_name);
  END IF;
END
$mig$;

-- Add the conditional CHECK once (guarded so a re-run is a no-op).
DO $mig$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
      AND con.conname = 'theo_chat_messages_body_ck'
  ) THEN
    ALTER TABLE public.theo_chat_messages
      ADD CONSTRAINT theo_chat_messages_body_ck
      CHECK (
        (deleted_at IS NULL AND body IS NOT NULL AND length(body) >= 1 AND length(body) <= 8000)
        OR
        (deleted_at IS NOT NULL)
      );
  END IF;
END
$mig$;

-- 3) Self-service soft-delete (sender tombstones their OWN message).
CREATE OR REPLACE FUNCTION public.theo_chat_delete_message(p_message_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_oid    text := current_setting('request.jwt.claim.sub', true);
  v_sender text;
  v_del    timestamptz;
BEGIN
  IF v_oid IS NULL OR v_oid = '' THEN
    RAISE EXCEPTION 'theo_chat_delete_message: no caller identity' USING ERRCODE = '28000';
  END IF;

  -- Row-lock the message; capture sender + current tombstone state.
  SELECT sender_oid, deleted_at INTO v_sender, v_del
    FROM public.theo_chat_messages
   WHERE id = p_message_id
   FOR UPDATE;

  -- Not found → nothing to delete (handler maps 404).
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  -- Only the sender may delete their own message.
  IF v_sender <> v_oid THEN
    RAISE EXCEPTION 'theo_chat_delete_message: not the sender' USING ERRCODE = '42501';
  END IF;
  -- Already deleted → idempotent success (no-op).
  IF v_del IS NOT NULL THEN
    RETURN true;
  END IF;

  -- Tombstone: remove the content for everyone. The guard (sender = caller, still live) is RE-ASSERTED
  -- in the UPDATE predicate so the write is execution-time safe; 0 rows → nothing mutated, RETURN false.
  UPDATE public.theo_chat_messages
     SET deleted_at = now(), deleted_by = v_oid, body = NULL
   WHERE id = p_message_id
     AND sender_oid = v_oid
     AND deleted_at IS NULL;
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$fn$;

REVOKE ALL ON FUNCTION public.theo_chat_delete_message(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_chat_delete_message(uuid) TO authenticated;
```

**Read-only verification (run after the migration):**

```sql
-- Theo VC-12 — read-only verification (run after vc12_delete_migration.sql). SELECT-only.

-- V1) the two columns exist.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_chat_messages'
  AND column_name IN ('deleted_at', 'deleted_by')
ORDER BY column_name;

-- V2) the conditional body CHECK exists (body may be NULL only when deleted).
SELECT con.conname, pg_get_constraintdef(con.oid) AS def
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace n ON n.oid = rel.relnamespace
WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages' AND con.conname = 'theo_chat_messages_body_ck';

-- V3) the function exists, is SECURITY DEFINER (prosecdef = true), returns boolean.
SELECT p.proname, p.prosecdef, pg_get_function_result(p.oid) AS returns
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname = 'theo_chat_delete_message';
```

## §SM — Primary Reference (deployed `theo_chat_leave_channel.index.js`, byte-verbatim — the SECURITY DEFINER self-service precedent)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the DEPLOYED **`theo_chat_leave_channel`** (VC-16) — the exact pattern VC-12's delete follows: an RLS-visibility validation for user-facing 404/40x messaging, then a privileged self-service mutation delegated to a `SECURITY DEFINER` function, with the set_config triad and the `{data,meta}`/`{error}` envelope. Blob `2b06a91ebd34e0b3ec14acbe963048c5c0ecab96`:

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const threadId = typeof body.thread_id === "string" ? body.thread_id.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'thread_id' is required and must be a valid UUID.", 400));
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // User-facing validation under RLS (a participant can read the thread). Absent / not a participant
    // → 404 (no existence leak). Only a CHANNEL can be left; the admin must transfer admin before
    // leaving. The privileged self-removal itself runs in the SECURITY DEFINER theo_chat_leave() (the
    // thread UPDATE WITH CHECK blocks self-removal for the app role), which independently re-checks these.
    const t = await client.query(
      `SELECT kind, admin_oid FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (t.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    const row = t.rows[0];
    if (row.kind !== "channel") {
      throw buildKnownError("INVALID_REQUEST", "You can only leave a channel.", 400);
    }
    if (row.admin_oid === oid) {
      throw buildKnownError("INVALID_REQUEST", "The admin cannot leave; transfer admin first.", 400);
    }

    const res = await client.query(`SELECT public.theo_chat_leave($1) AS left`, [threadId]);
    const left = res.rows[0] && res.rows[0].left === true;

    return send(context, 200, successBody({ thread_id: threadId, left }));
  } catch (err) {
    context.log.error("theo_chat_leave_channel failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // Defensive: the SECURITY DEFINER function raises 22023 for not-a-channel / admin-cannot-leave
    // (already pre-checked above, so this is belt-and-suspenders).
    if (err && err.code === "22023") {
      return send(context, 400, errorBody("INVALID_REQUEST", "This conversation cannot be left.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

### §SM-FJ — Primary Reference function.json (deployed `theo_chat_leave_channel.function.json`, byte-verbatim)

Blob `fc9df8996d90f789abbd4de2a5798bb6ac265346`:

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_leave_channel" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §HG.1 — `theo_chat_delete_message` (GREENFIELD)

Validates the message is RLS-visible (participant → 404 else), then that the caller is the sender (→ 403), then delegates the tombstone to the `SECURITY DEFINER theo_chat_delete_message()`; best-effort publishes a `message_deleted` event. Full — file `theo_chat_delete_message.index.js`:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const messageId = typeof body.message_id === "string" ? body.message_id.trim() : "";
  if (!isUuid(messageId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'message_id' is required and must be a valid UUID.", 400));
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // User-facing validation under RLS: the message is visible only if the caller is a participant of
    // its thread (theo_chat_message_select). Absent / not a participant → 404 (no existence leak). The
    // privileged tombstone runs in the SECURITY DEFINER theo_chat_delete_message() (messages carry no
    // UPDATE policy for the app role); it independently re-checks sender = caller.
    const m = await client.query(
      `SELECT sender_oid, thread_id FROM public.theo_chat_messages WHERE id = $1`,
      [messageId]
    );
    if (m.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Message not found.", 404);
    }
    const row = m.rows[0];
    if (row.sender_oid !== oid) {
      throw buildKnownError("FORBIDDEN", "You can only delete your own message.", 403);
    }

    const res = await client.query(`SELECT public.theo_chat_delete_message($1) AS deleted`, [messageId]);
    const deleted = res.rows[0] && res.rows[0].deleted === true;

    // Best-effort realtime: tell connected participants to tombstone the message live. The delete is
    // already durably committed; a publish failure must not fail the delete (peers reconcile on reload).
    if (deleted && process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(row.thread_id).sendToAll({
          type: "message_deleted",
          thread_id: row.thread_id,
          message_id: messageId,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_delete_message publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 200, successBody({ thread_id: row.thread_id, message_id: messageId, deleted }));
  } catch (err) {
    context.log.error("theo_chat_delete_message failed", err);
    if (err && err.code === "42501") {
      // RLS denial OR the definer function's sender re-check — either way the caller may not delete this.
      return send(context, 403, errorBody("FORBIDDEN", "You can only delete your own message.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

### §HG.1-FJ — `theo_chat_delete_message.function.json` (GREENFIELD)

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_delete_message" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §HG.2 — `theo_chat_list_messages` (MODIFY: tombstone masking on the VC-11 base)

Delta vs deployed VC-11: the SELECT + LATERAL carry `m.deleted_at` and `p.deleted_at`; each shaped message gains `deleted` + `deleted_at` (a tombstoned body is already NULL in the DB); the `reply_to` preview gains `deleted`. Cursor/paging/gate unchanged. Full — file `theo_chat_list_messages.index.js`:

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const REPLY_PREVIEW_MAX = 200; // VC-11: cap the quoted-parent snippet to bound the payload (matches send).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  const q = req.query || {};
  const threadId = typeof q.threadId === "string" ? q.threadId.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'threadId' is required and must be a valid UUID.", 400));
  }

  // Cursor: 'before' (exclusive) returns older messages for infinite scroll. Strict-regex before parseInt
  // (parseInt('1.5') → 1 would silently pass a range check) per the parseInt-drift discipline.
  let before = null;
  if (q.before != null && String(q.before).trim() !== "") {
    const raw = String(q.before).trim();
    if (!/^[0-9]+$/.test(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'before' must be a non-negative integer.", 400));
    }
    before = parseInt(raw, 10);
  }

  let limit = DEFAULT_LIMIT;
  if (q.limit != null && String(q.limit).trim() !== "") {
    const raw = String(q.limit).trim();
    if (!/^[0-9]+$/.test(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'limit' must be a positive integer.", 400));
    }
    limit = parseInt(raw, 10);
    if (limit < 1) limit = 1;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Membership gate — not a participant → 404 (no existence leak).
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Fetch newest-first for the cursor, then return ascending for display. RLS also enforces the gate.
    // VC-11: LEFT JOIN LATERAL the replied-to parent (same thread → RLS-visible) for the quote preview.
    // VC-12: carry m.deleted_at + the parent's deleted_at so tombstoned messages/quotes render as deleted
    // (body is already NULL in the DB for a tombstoned row — a soft delete removes the content for all).
    const params = [threadId];
    let where = `m.thread_id = $1`;
    if (before != null) { params.push(before); where += ` AND m.seq < $${params.length}`; }
    params.push(limit);
    const rows = await client.query(
      `SELECT m.id, m.thread_id, m.seq, m.sender_oid, m.body, m.created_at, m.reply_to_message_id, m.deleted_at,
              p.id AS p_id, p.seq AS p_seq, p.sender_oid AS p_sender_oid, p.body AS p_body, p.deleted_at AS p_deleted_at
       FROM public.theo_chat_messages m
       LEFT JOIN LATERAL (
         SELECT pm.id, pm.seq, pm.sender_oid, pm.body, pm.deleted_at
         FROM public.theo_chat_messages pm
         WHERE pm.id = m.reply_to_message_id AND pm.thread_id = m.thread_id
         LIMIT 1
       ) p ON true
       WHERE ${where}
       ORDER BY m.seq DESC
       LIMIT $${params.length}`,
      params
    );

    // Shape each row: the message plus a `reply_to` preview (null when not a reply). VC-12: `deleted` +
    // `deleted_at` on both the message and the quoted parent; a tombstoned body is NULL (removed for all).
    const shaped = rows.rows.map((r) => ({
      id: r.id,
      thread_id: r.thread_id,
      seq: Number(r.seq),
      sender_oid: r.sender_oid,
      body: r.body,
      created_at: r.created_at,
      deleted: r.deleted_at != null,
      deleted_at: r.deleted_at,
      reply_to_message_id: r.reply_to_message_id,
      reply_to: r.p_id == null ? null : {
        id: r.p_id,
        seq: Number(r.p_seq),
        sender_oid: r.p_sender_oid,
        body: typeof r.p_body === "string" ? r.p_body.slice(0, REPLY_PREVIEW_MAX) : r.p_body,
        deleted: r.p_deleted_at != null,
      },
    }));

    const ordered = shaped.slice().reverse();
    const hasMore = rows.rowCount === limit;
    const nextBefore = ordered.length > 0 ? Number(ordered[0].seq) : null;

    return send(context, 200, successBody({
      messages: ordered,
      page: { limit, has_more: hasMore, next_before: hasMore ? nextBefore : null },
    }));
  } catch (err) {
    context.log.error("theo_chat_list_messages failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

### §HG.2-FJ — `theo_chat_list_messages.function.json` (UNCHANGED)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_chat_list_messages"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.3 — `theo_chat_send_message` (MODIFY: `deleted` shape parity + mask a deleted reply parent)

Delta vs deployed VC-11: `replyPreview()` gains `deleted`; the parent-validation SELECT carries `deleted_at`; the saved message gains `deleted:false` + `deleted_at:null` (shape parity with `list_messages`). Seq-retry/publish/error map otherwise byte-identical. Full — file `theo_chat_send_message.index.js`:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const MAX_BODY = 8000;
const REPLY_PREVIEW_MAX = 200; // VC-11: cap the quoted-parent snippet to bound the payload.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
// VC-11: shape a parent-message preview for a reply (bounded body snippet). null when there is no parent.
// VC-12: a tombstoned parent has body NULL + deleted:true (the FE renders "message deleted").
function replyPreview(row) {
  if (!row) return null;
  return {
    id: row.id,
    seq: Number(row.seq),
    sender_oid: row.sender_oid,
    body: typeof row.body === "string" ? row.body.slice(0, REPLY_PREVIEW_MAX) : row.body,
    deleted: row.deleted_at != null,
  };
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const threadId = typeof body.thread_id === "string" ? body.thread_id.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'thread_id' is required and must be a valid UUID.", 400));
  }
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'body' is required and must be non-empty.", 400));
  }
  if (text.length > MAX_BODY) {
    return send(context, 400, errorBody("PAYLOAD_TOO_LARGE", `Message exceeds ${MAX_BODY} characters.`, 400));
  }
  // VC-11: optional reply target. Absent → a normal message. Present → must be a well-formed UUID here,
  // and (checked under RLS below) an existing message IN THE SAME THREAD.
  let replyToId = null;
  if (body.reply_to_message_id != null && String(body.reply_to_message_id).trim() !== "") {
    replyToId = String(body.reply_to_message_id).trim();
    if (!isUuid(replyToId)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'reply_to_message_id' must be a valid UUID when provided.", 400));
    }
  }

  let client = null;
  let saved = null;
  let parentPreview = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Membership gate: the caller must be a participant of the thread (RLS + explicit predicate). Not a
    // participant → 404 (no leakage of thread existence). The connection role enforces RLS; this is the gate.
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // VC-11: validate the reply target is a message IN THIS THREAD (RLS-visible). This both enforces
    // same-thread integrity (a reply can't point at another conversation) and yields the preview columns
    // we return + publish (so the live send and a cold list_messages render an identical `reply_to`).
    // VC-12: carry the parent's deleted_at so replying to a tombstoned message shows a masked preview.
    if (replyToId) {
      const p = await client.query(
        `SELECT id, seq, sender_oid, body, deleted_at FROM public.theo_chat_messages WHERE id = $1 AND thread_id = $2`,
        [replyToId, threadId]
      );
      if (p.rowCount === 0) {
        throw buildKnownError("INVALID_REQUEST", "reply_to_message_id is not a message in this conversation.", 400);
      }
      parentPreview = replyPreview(p.rows[0]);
    }

    // Insert with the next per-thread seq computed atomically in the INSERT…SELECT; the UNIQUE(thread_id,
    // seq) guards against a concurrent sender — retry a few times on a 23505 race, then bump the thread.
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages (thread_id, seq, sender_oid, body, reply_to_message_id)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4 FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id
          `,
          [threadId, oid, text, replyToId]
        );
        await client.query(`UPDATE public.theo_chat_threads SET updated_at = now() WHERE id = $1`, [threadId]);
        await client.query("COMMIT");
        saved = ins.rows[0];
      } catch (e) {
        try { await client.query("ROLLBACK"); } catch {}
        if (e && e.code === "23505") continue; // seq race — recompute and retry
        throw e;
      }
    }
    if (!saved) {
      throw buildKnownError("CONFLICT", "Could not assign a message sequence; please retry.", 409);
    }

    // VC-11: attach the parent preview so the response + realtime payload carry the same `reply_to` shape
    // as list_messages (null for a normal message). VC-12: a freshly-sent message is never deleted — carry
    // deleted:false + deleted_at:null so the message shape matches list_messages exactly.
    saved.reply_to = parentPreview;
    saved.deleted = false;
    saved.deleted_at = null;

    // Publish to the thread's Web PubSub group so every connected participant receives it instantly.
    // Best-effort: the message is already durably persisted; a publish failure must not fail the send
    // (recipients still get it on their next list/reconnect).
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "message",
          thread_id: saved.thread_id,
          message: saved,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_send_message publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ message: saved }));
  } catch (err) {
    context.log.error("theo_chat_send_message failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Message violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

### §HG.3-FJ — `theo_chat_send_message.function.json` (UNCHANGED)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_send_message"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §API-SPEC — Role-C (Pass 4) documentation delta
`spec/THEO_API_SPEC.md` §2.10 **`read / send messages`** row: add `POST /api/theo_chat_delete_message { message_id }` → **200** `{ thread_id, message_id, deleted }` (sender-only "delete for everyone"; not the sender → **403**; not visible/not found → **404**; idempotent); note that `list_messages`/`send_message` messages carry `deleted`/`deleted_at` and a tombstoned message/`reply_to` parent has `body:null` + `deleted:true`. `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 `theo_chat_messages` row: add `deleted_at`/`deleted_by` + the `theo_chat_delete_message` SECURITY DEFINER fn, and amend the "Immutable — no UPDATE/DELETE policy" note to "immutable except a sender-scoped soft-delete tombstone via the `theo_chat_delete_message` SECURITY DEFINER fn". Authored as a Role-C handoff after Pass-3 deploy + curls.

## §DEPLOY — Pass 3 (Walter migration FIRST, then Claude Code deploy to `vaultgpt-func-chat`)
1. **Walter** runs `vc12_delete_migration.sql` + the verify SQL (columns + conditional CHECK + function must exist before deploy).
2. **Claude Code** deploys the NEW `theo_chat_delete_message/{index.js,function.json}` + overwrites `theo_chat_list_messages/index.js` + `theo_chat_send_message/index.js` via Kudu VFS surgical PUT (ARM bearer; no token logged); restart → confirm the 1 new function registers (inventory 14 → 15); baseline get-back before overwrite; post-deploy get-back byte-matches this pack.

## §CURL — post-deploy verification (Claude Code; az-login token for `api://4e1a1e31-…`; structural only — no OIDs/bodies)
- `POST delete_message` `message_id:"nope"` → **400** (UUID guard).
- `POST delete_message` a well-formed but non-existent/non-visible `message_id` → **404**.
- Against a disposable channel: send msg A → `POST delete_message {message_id:A}` → **200** `deleted:true`; repeat → **200** `deleted:true` (idempotent).
- `GET list_messages` → the deleted message has `body:null` + `deleted:true`; a reply that quoted A shows `reply_to.deleted:true` + `reply_to.body:null`.
- Send msg B (as the same caller) then attempt delete of a message the caller did NOT send (a second disposable message whose sender differs is not reachable solo — covered structurally by the sender-gate unit: a non-sender path returns **403**; verified via the definer fn's re-check + the handler pre-check).
- Regression: normal send → **201** (`deleted:false`); reply flow (VC-11) still returns the `reply_to` preview.

## §SM-NOTE — structural mirror
The new delete handler is byte-for-byte the deployed `theo_chat_leave_channel` pattern (RLS-visibility gate → SECURITY DEFINER self-service call → envelope) plus the sender gate + publish; the definer fn mirrors `theo_chat_leave`'s FOR-UPDATE + predicate-in-UPDATE discipline. The two MODIFY handlers add only the tombstone-masking fields to their deployed VC-11 selves. No shared helper/envelope/error-map drift. `node --check` clean on all three.

## Requested Pass 2 verdict
**APPROVED** or **REJECTED** only. On APPROVED: Walter runs the migration, Claude Code deploys the new handler + two overwrites + curls, then the Role-C (Pass 4) + VC-12-FE.
