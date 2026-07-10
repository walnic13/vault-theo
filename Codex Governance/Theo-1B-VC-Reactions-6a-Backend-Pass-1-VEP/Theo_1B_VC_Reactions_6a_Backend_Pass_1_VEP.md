# Theo 1B — VC-Reactions (#6a-BE) Chat Emoji Reactions Backend (migration `theo_chat_message_reactions` + new `theo_chat_add_reaction` / `theo_chat_remove_reaction` + `list_messages` reactions aggregate) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). **Walter runs the migration at Pass 3 FIRST**, then Claude Code deploys to the **dedicated `vaultgpt-func-chat`** app (Windows v4, EP1) via Kudu VFS + runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 + Schema §3 deltas. Plan-only — NO deploy, NO SQL run, NO commit in this turn.
>
> **Scope (#6a-BE = the backend half of enhancement-backlog item 6 "hover-reactions"; 6a = reactions):** a participant **adds** or **removes** an emoji reaction on a message they can see; every reaction is surfaced in `list_messages` as an emoji-grouped aggregate. (1) a **migration** adding `public.theo_chat_message_reactions` (participant-scoped RLS mirroring VC-1 `theo_chat_messages` exactly); (2) NEW `theo_chat_add_reaction` (`{ message_id, emoji }` → idempotent `INSERT … ON CONFLICT DO NOTHING`); (3) NEW `theo_chat_remove_reaction` (`{ message_id, emoji }` → idempotent scoped `DELETE`); (4) MODIFY `theo_chat_list_messages` to carry `reactions: [{ emoji, oids:[…] }]` on every message.
>
> **Privacy + auth:** both mutations run as the signed-in user under RLS; a caller can only react to a message they can already see (the message is resolved under `theo_chat_message_select`) and can only add/remove their OWN reaction (`oid = auth.uid()`, enforced by the reactions INSERT/DELETE policies). No `SECURITY DEFINER`; no new elevated-read class. Best-effort Web PubSub `reaction_added` / `reaction_removed` events mirror the deployed `theo_chat_delete_message` publish idiom.
>
> **Deviation from the task brief (grounded, disclosed):** the brief named the VC-13 `theo_chat_list_messages` copy as the modify basis, but the REAL files diverge — the VC-13 artifact lacks the VC-9 `attachment` and VC-10 `gif` projections. The richest, most-recently-committed `list_messages` artifact is the **VC-10** copy (blob `56d44151017c095ed52d581ba1e59248d7c5b04f`, committed 2026-07-07; carries reply + delete + forward + attachment + gif). Per Theo Golden Handler Standard §5.5 ("The deployed handler is the source of truth"), this VEP bases the MODIFY on the VC-10 copy so the reactions add does NOT regress attachment/gif. See §GR gap R-1 and the Pass-3 deploy note (Kudu-GET the LIVE file first).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `8e2d9b12dd2d9ef31c4cfe15280be32dc1038bcb` (vault-theo, `development`, working tree clean modulo unrelated `.xlsx` dirt elsewhere — none in this repo)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-Reactions #6a-BE. P1–P8 walked; additive + reversible migration (new `theo_chat_message_reactions` table + participant-scoped RLS mirroring VC-1) with read-only verify SQL; Primary Reference = the DEPLOYED `theo_chat_delete_message` (VC-12) inlined byte-verbatim + its function.json (the resolve-message→act→publish mutation pattern the two new handlers mirror); two NEW handlers (add/remove reaction) + one MODIFY (`list_messages` reactions aggregate on the VC-10 base) inlined full. RLS uses `auth.uid()` with the deployed `set_config` triad; no `SECURITY DEFINER`. No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register) | `Grep -F "VEP Format"` + `Grep -F "Gap Register"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4A.1 P-track) | `Read` §4A.1 lines 104–153 + `Grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (regime reviewer) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary + SECURITY DEFINER; §5.2 migration SQL; §5.5 Kudu VFS) | `Grep -nE "§3|§5.2|§5.5|SECURITY DEFINER|Kudu"` + verified substrings this turn | `865afc9fab567fd2ace06f4c26b9ee0203be38b8` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis; §1E deploy exception) | `Grep -F "Pass 1 (Claude Code VEP)"` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (ownership/membership RLS posture) | `Grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `Grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis (schema)** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` — the new child table) | `Grep -F "Message within a chat thread"` this turn | `f916ba72cd668f311e1df92b0929d49708dd8f4b` |
| 9 | **Contract basis (API)** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` — reactions routes land at Pass 4) | `Grep -F "read / send messages"` this turn | `576ab56471337ae85764c2f79783f76c6c62e411` |
| 10 | **Primary Reference handler** (deployed mutation resolve→act→publish) — `Codex Governance/Theo-1B-VC12-Delete-Message-Backend-Pass-1-VEP/theo_chat_delete_message.index.js` | `Read(full)` this turn | `d41ca3ea683a823ee4fb26ee94404735631b1ffd` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-VC12-Delete-Message-Backend-Pass-1-VEP/theo_chat_delete_message.function.json` | `Read(full)` this turn | `fdf6b1d39d9deece21f08189f894be4f3a5c5118` |
| 12 | **Modify basis** — richest deployed `theo_chat_list_messages` — `Codex Governance/Theo-1B-VC10-GIF-Picker-Backend-Pass-1-VEP/theo_chat_list_messages.index.js` (reply + delete + forward + attachment + gif) | `Read(full)` this turn | `56d44151017c095ed52d581ba1e59248d7c5b04f` |
| 13 | **RLS basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (`theo_chat_message_select` participant idiom + `auth.uid()`) | `Read(full)` this turn | `67ff9b5f654e146c01590d9ce0f9286969e54103` |
| 14 | **Publish-idiom cross-check** — newest `theo_chat_send_message` — `Codex Governance/Theo-1B-VCpush-C2-Push-Sender-Backend-Pass-1-VEP/handlers/theo_chat_send_message/index.js` (`new WebPubSubServiceClient(...)` + `HUB`) | `Read(full)` this turn | `7595f2ed75648654ee8dc124ddf171a82e759ab0` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` + streaming sidecar `vaultgpt-func-stream` READ-ONLY — deploy target `vaultgpt-func-chat`. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §MIGRATION + §SM + §HG + §API-SPEC + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §GR |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | membership RLS | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P8 — participant-scoped reactions RLS is the recorded chat membership family |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_delete_message` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | §SM + §SM-FJ — handler + function.json PAIR inlined verbatim |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "where a SECURITY DEFINER existence helper is explicitly invoked for 403/404 discrimination" | §P8 — reactions use plain RLS INSERT/DELETE, NO SECURITY DEFINER (allowed delta vs delete's definer) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.2 | "Migration files carry no top-level transaction control" | §MIGRATION — idempotent DDL, no BEGIN/COMMIT, no psql meta |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Kudu VFS surgical overwrite" | §DEPLOY — Pass-3 Kudu VFS PUT to `vaultgpt-func-chat` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — participant-scoped reactions are an ownership-family extension |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Message within a chat thread" | §P6 — `theo_chat_message_reactions` is a child of the `theo_chat_messages` row |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | §API-SPEC — reactions routes + `reactions` field land on this row (Role-C) |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql | select policy | "thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids))" | §MIGRATION — the reactions SELECT/INSERT/DELETE policies mirror this exact self-contained idiom |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql | auth.uid() | "auth.uid() = ANY (member_oids)" | §MIGRATION / §P8 — the exact current-user predicate reused (no invented current_setting) |
| Codex Governance/Theo-1B-VC12-Delete-Message-Backend-Pass-1-VEP/theo_chat_delete_message.index.js | set_config triad | "set_config('app.current_user_id', $1, false)" | §HG.1 / §HG.2 — both new handlers keep the deployed set_config triad (RLS impersonation) |
| Codex Governance/Theo-1B-VC12-Delete-Message-Backend-Pass-1-VEP/theo_chat_delete_message.function.json | binding | "httpTrigger" | §SM-FJ / §HG-FJ — anonymous httpTrigger binding (EasyAuth gates identity) |
| Codex Governance/Theo-1B-VCpush-C2-Push-Sender-Backend-Pass-1-VEP/handlers/theo_chat_send_message/index.js | publish idiom | "new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB)" | §HG.1 / §HG.2 — the best-effort `reaction_added`/`reaction_removed` publish mirrors this |
| Codex Governance/Theo-1B-VC10-GIF-Picker-Backend-Pass-1-VEP/theo_chat_list_messages.index.js | projection | "LEFT JOIN LATERAL" | §HG.3 — the reactions aggregate is a new LEFT JOIN LATERAL beside the existing reply-parent lateral |

## P1 — Feature identification
**Microstep:** VC-Reactions #6a-BE — the backend for chat emoji reactions (enhancement-backlog item 6 "hover-reactions + context menu"; 6a = reactions, backend). A participant adds/removes an emoji on a message they can see; reactions surface in `list_messages`.

**Migration:** new `public.theo_chat_message_reactions` (`id`, `message_id`→`theo_chat_messages` ON DELETE CASCADE, `thread_id`→`theo_chat_threads` ON DELETE CASCADE, `oid`, `emoji` CHECK 1–32, `created_at`, UNIQUE `(message_id, oid, emoji)`; indexes on `message_id` + `thread_id`) with participant-scoped RLS mirroring VC-1.
**New handlers (2), on `vaultgpt-func-chat`:** `POST /api/theo_chat_add_reaction { message_id, emoji }`; `POST /api/theo_chat_remove_reaction { message_id, emoji }`.
**Modified (1):** `theo_chat_list_messages` — adds `reactions: [{ emoji, oids:[…] }]` (empty array when none).

**Out of scope (#6a-BE):** the FE (hover picker + reaction chips = vault-origin **#6a-FE**); the right-click context menu (item 6b); reaction counts beyond the `oids` array; per-emoji notifications/Web-Push; reacting via the streaming sidecar or the monolith.

**Plan status:** chat membership tier is Walter-directed and recorded at VC-1 ("sharing/membership RLS models (ownership-only unless Walter authorizes)"). Doc delta = API-Spec §2.10 `read / send messages` row (two routes + the `reactions` field) + Schema §3 (new `theo_chat_message_reactions` table) — Role-C (Pass 4).

## P2 — Architecture & boundary reconciliation
**Handler family.** `theo_chat_add_reaction` / `theo_chat_remove_reaction` are Family-B HTTP handlers byte-for-byte mirroring the Primary Reference (`theo_chat_delete_message`): `pg` Pool; EasyAuth OID via the `x-ms-client-principal` claim set; validate-before-SQL (`isUuid` + emoji guard); the `set_config` triad RLS impersonation; a single scoped write; best-effort Web PubSub publish; `{data,meta}`/`{error}` envelope + the same error map (401/400/404/403(42501)/500). The only new logic vs the reference: add resolves the message's `thread_id` under RLS then does an idempotent `INSERT … ON CONFLICT DO NOTHING`; remove does an idempotent owner-scoped `DELETE … RETURNING thread_id`. The MODIFY handler adds only a `reactions` LATERAL aggregate + one projected field.
**Boundary.** Reads/writes only `theo_chat_*`. Per Golden §3 no `reporting_*`/monolith/Blob/Graph/Foundry. Deploy target `vaultgpt-func-chat`; monolith + streaming sidecar READ-ONLY. NO new npm dependency — Node built-ins + already-present `pg` and `@azure/web-pubsub` only.
**Validation before SQL.** UUID `message_id` + a bounded, control-char-free `emoji` (1–32) → deterministic 400 before any SQL.

## §GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| **R-1: `list_messages` artifact divergence.** The task brief named the VC-13 `theo_chat_list_messages` copy as the MODIFY basis, but the real VC-13 artifact LACKS the VC-9 `attachment` and VC-10 `gif` projections; the VC-10 copy (blob `56d4415…`, committed 2026-07-07, the newest by commit date) is the fully-reconciled shape (reply+delete+forward+attachment+gif). | Basing the MODIFY on the VC-13 copy would REGRESS attachment + gif on the deployed app. Golden §5.5: "The deployed handler is the source of truth." | **PROCEED** on the VC-10 copy; AND at Pass 3 Claude Code MUST Kudu-GET the LIVE `theo_chat_list_messages/index.js`, confirm it matches the VC-10 shape (or re-base the reactions delta onto the live file), then add ONLY the reactions LATERAL + `reactions` field. |
| **R-2: API-Spec §2.10 + Schema §3 will change** (two new routes; the `reactions` field; the new table). | Documentation-currency delta on the recorded chat tier. | **PROCEED** with a Role-C (Pass 4): `spec/THEO_API_SPEC.md` §2.10 + `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3. Sequenced after Pass-3 deploy + curls. |
| **R-3: reactions on a tombstoned (deleted) message.** `list_messages` masks `attachment`/`gif` on a tombstone but the reactions aggregate is NOT masked. | A reaction is aggregate metadata (emoji + reactor OIDs), not message content; showing it on a "message deleted" placeholder is harmless and matches common chat UX. No content leaks. | **PROCEED** — reactions independent of the tombstone mask; documented inline in §HG.3. |
| **R-4: emoji is a free-text `text` column (CHECK 1–32), not an allow-list.** | A malicious client could store an arbitrary ≤32-char string, not a real emoji. It is only ever echoed back to thread participants (who could already send arbitrary message bodies), and control chars are rejected. FE renders it as text. | **PROCEED** — bounded + control-char-free is sufficient for v1; a curated allow-list is a possible future tightening (noted, no in-scope change). |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**No new external system.** The two handlers reuse the existing best-effort Web PubSub publish (`new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB)` with `HUB = "vaultchat"`, `.group(threadId).sendToAll({ type: … })`) exactly as deployed in `theo_chat_delete_message` / `theo_chat_send_message`. Per Golden §4 a "new-domain or new-external-system helper" would need justification; this microstep introduces none — pure Postgres over `theo_chat_*` + the pre-existing publish.

## P4 — Contract reconciliation
Envelope unchanged (`{data,meta}`/`{error}`).
- `theo_chat_add_reaction` `{ message_id, emoji }` → **201** `{ added: boolean, message_id, emoji }`. Idempotent (`ON CONFLICT DO NOTHING` → `added:false` on a repeat). Publishes `{ type:"reaction_added", thread_id, message_id, emoji, oid }` to the thread group on a real add.
- `theo_chat_remove_reaction` `{ message_id, emoji }` → **200** `{ removed: boolean, message_id, emoji }`. Idempotent (nothing to remove → `removed:false`). Publishes `{ type:"reaction_removed", thread_id, message_id, emoji, oid }` on a real remove.
- `theo_chat_list_messages` → each message now also carries `reactions: [{ emoji, oids:[text…] }]` (empty array when none). No existing field changed.
Malformed input → 400; message not visible / not found (add) → 404; RLS denial → 403.

## P5 — Error-model reconciliation
Mirrors the Primary Reference:
- **add:** 401 (no EasyAuth) / 400 (bad JSON, bad `message_id` UUID, bad `emoji`, or `23514` field-constraint) / 404 (message not visible/absent — `isKnown`) / 403 (`42501` RLS INSERT denial) / else 500.
- **remove:** 401 / 400 (bad JSON, bad `message_id`, bad `emoji`) / 403 (`42501`) / else 500. No 404 — remove is idempotent (nothing matched → `removed:false`, 200), so there is no existence leak.
`isKnown` errors re-map verbatim (code/status/message); the `23514` → 400 path is preserved for add.

## P6 — Data-shape reconciliation
One additive table `public.theo_chat_message_reactions` (child of `theo_chat_messages` — "Message within a chat thread"): `id uuid PK`, `message_id uuid NOT NULL` (FK → messages, `ON DELETE CASCADE`), `thread_id uuid NOT NULL` (FK → threads, `ON DELETE CASCADE`; denormalised so the RLS gate is self-contained), `oid text NOT NULL`, `emoji text NOT NULL CHECK (length(emoji) BETWEEN 1 AND 32)`, `created_at timestamptz NOT NULL DEFAULT now()`, `UNIQUE (message_id, oid, emoji)`. Indexes on `(message_id)` (the `list_messages` aggregate) and `(thread_id)`. No change to any existing table/column. Full DDL in §MIGRATION.

## P7 — Idempotency / concurrency
- **add** is idempotent: `INSERT … ON CONFLICT (message_id, oid, emoji) DO NOTHING`. A concurrent duplicate add resolves to a single row (`added:false` for the loser). Single-statement autocommit — no explicit txn needed (matches the reference's single privileged call).
- **remove** is idempotent: `DELETE … WHERE message_id=$1 AND oid=$2 AND emoji=$3`. A repeat (already removed) → `removed:false`, 200.
- `list_messages` is a pure read; the reactions LATERAL adds no write and no ordering change (aggregate is correlated per `m.id`).
- The message-resolve read (add) is an ordinary read inside the request; the UNIQUE constraint is the durable concurrency guard.

## P8 — Security / RLS reconciliation
**Participant-scoped RLS mirroring VC-1 exactly — no recursion, no SECURITY DEFINER.** The reactions policies reuse the deployed `theo_chat_message_select` idiom verbatim:
- **SELECT** `USING (thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)))` — a participant of the reaction's thread reads it.
- **INSERT** `WITH CHECK (oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)))` — you may add ONLY your own reaction into a thread you belong to.
- **DELETE** `USING (oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)))` — you may remove ONLY your own reaction.

`theo_chat_message_reactions` gates by referencing `theo_chat_threads` (self-contained: `auth.uid() = ANY (member_oids)`); `theo_chat_threads` references NEITHER back — so no policy triggers a table whose policy references it (the VC-1 non-recursion invariant holds). The handlers set the deployed `set_config` triad (`app.current_user_id` / `request.jwt.claim.sub` / `request.jwt.claim.oid`) so `auth.uid()` resolves the signed-in OID under the RLS-enforcing connection role. **No `SECURITY DEFINER`; no new elevated-read class** — this is the Golden §3 allowed alternative to a definer: the messages table needs a definer for its immutable soft-delete, but reactions are ordinary owner-writable rows, so plain RLS INSERT/DELETE suffices (participant-scoped ownership family, "Default family: ownership-based"). **No leakage:** the add/remove responses + publishes carry only `{ thread_id, message_id, emoji, oid }` (the reactor's own OID + the emoji); no tokens/URLs. `message_id` not visible to the caller → add returns 404 (the message resolve rides `theo_chat_message_select`); remove simply matches nothing (200 `removed:false`).

## §MIGRATION — `migration_theo_chat_message_reactions.sql` (additive + reversible; run by Walter at Pass 3 BEFORE the handler deploy)

Additive, idempotent (`CREATE TABLE/INDEX IF NOT EXISTS`, `DROP POLICY IF EXISTS … CREATE POLICY`), reversible (`DROP TABLE public.theo_chat_message_reactions CASCADE`). NO top-level transaction control (Golden §5.2); NO psql meta-commands (`-- label` comments only); Walter executes.

```sql
-- Theo VC-Reactions (#6a-BE) — chat message emoji reactions. ADDITIVE + REVERSIBLE. New table in the
-- Vault DB (vaultgpt-postgres-prod). Participant-scoped RLS mirroring the VC-1 theo_chat_messages idiom.
-- Handlers deploy to the DEDICATED vaultgpt-func-chat app (Windows v4, EP1) — NEVER the monolith.
-- Idempotent; safe to re-run. NO top-level transaction control (Theo Golden Handler Standard §5.2);
-- Walter executes at Pass 3 BEFORE the handler deploy.
--
-- RLS non-recursion (the VC-1 design-critical idiom): theo_chat_message_reactions gates by referencing
-- theo_chat_threads (self-contained — auth.uid() = ANY(member_oids)); theo_chat_threads references
-- NEITHER back, so no policy triggers a table whose policy references it. NO SECURITY DEFINER helper,
-- NO new elevated-read class — only ordinary ownership-family auth.uid() primitives, exactly as the
-- VC-1 theo_chat_message_select / _insert policies use.

-- 1) Reactions — one row per (message, reactor OID, emoji). thread_id is denormalised from the message
--    (its own NOT NULL FK) so the RLS gate is self-contained (no join to theo_chat_messages in policy).
CREATE TABLE IF NOT EXISTS public.theo_chat_message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.theo_chat_messages(id) ON DELETE CASCADE,
  thread_id uuid NOT NULL REFERENCES public.theo_chat_threads(id) ON DELETE CASCADE,
  oid text NOT NULL,                                   -- reactor's Entra OID
  emoji text NOT NULL CHECK (length(emoji) BETWEEN 1 AND 32),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, oid, emoji)                      -- a user reacts with a given emoji at most once
);
-- Aggregate-by-message (list_messages projection) + cascade-on-thread-delete lookups.
CREATE INDEX IF NOT EXISTS theo_chat_message_reactions_message_idx
  ON public.theo_chat_message_reactions (message_id);
CREATE INDEX IF NOT EXISTS theo_chat_message_reactions_thread_idx
  ON public.theo_chat_message_reactions (thread_id);

ALTER TABLE public.theo_chat_message_reactions ENABLE ROW LEVEL SECURITY;

-- SELECT: a participant of the reaction's thread reads it (self-contained via threads — the exact
-- theo_chat_message_select idiom: thread_id IN (SELECT id FROM theo_chat_threads WHERE auth.uid() = ANY(member_oids))).
DROP POLICY IF EXISTS "theo_chat_message_reaction_select" ON public.theo_chat_message_reactions;
CREATE POLICY "theo_chat_message_reaction_select" ON public.theo_chat_message_reactions
  FOR SELECT TO authenticated
  USING (thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)));

-- INSERT: you may add ONLY your OWN reaction (oid = auth.uid()) into a thread you belong to.
DROP POLICY IF EXISTS "theo_chat_message_reaction_insert" ON public.theo_chat_message_reactions;
CREATE POLICY "theo_chat_message_reaction_insert" ON public.theo_chat_message_reactions
  FOR INSERT TO authenticated
  WITH CHECK (
    oid = auth.uid()
    AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids))
  );

-- DELETE: you may remove ONLY your OWN reaction (oid = auth.uid()) from a thread you belong to.
DROP POLICY IF EXISTS "theo_chat_message_reaction_delete" ON public.theo_chat_message_reactions;
CREATE POLICY "theo_chat_message_reaction_delete" ON public.theo_chat_message_reactions
  FOR DELETE TO authenticated
  USING (
    oid = auth.uid()
    AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids))
  );
```

**Read-only verification (run after the migration; SELECT-only):**

```sql
-- Theo VC-Reactions — read-only verification (run after migration_theo_chat_message_reactions.sql).

-- V1) the table exists with the expected columns + types.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_chat_message_reactions'
ORDER BY ordinal_position;

-- V2) RLS is enabled on the table.
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'theo_chat_message_reactions';

-- V3) the three policies exist (select/insert/delete).
SELECT polname, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'theo_chat_message_reactions'
ORDER BY polname;

-- V4) the UNIQUE(message_id, oid, emoji) + the emoji length CHECK exist.
SELECT con.conname, con.contype, pg_get_constraintdef(con.oid) AS def
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace n ON n.oid = rel.relnamespace
WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_message_reactions'
  AND con.contype IN ('u','c')
ORDER BY con.conname;
```

## §SM — Primary Reference (deployed `theo_chat_delete_message.index.js`, byte-verbatim — the resolve-message→act→publish mutation pattern the reaction handlers mirror)

Per Golden §2 ("selects **exactly one** deployed handler file" … "inlines both full-verbatim in the turn"), the Primary Reference is the DEPLOYED **`theo_chat_delete_message`** (VC-12) — the single-scoped-mutation pattern the reaction handlers mirror (set_config triad, resolve a message under RLS, one scoped write, best-effort publish, `{data,meta}`/`{error}` envelope + error map). Blob `d41ca3ea683a823ee4fb26ee94404735631b1ffd`:

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

### §SM-FJ — Primary Reference function.json (deployed `theo_chat_delete_message.function.json`, byte-verbatim)

Blob `fdf6b1d39d9deece21f08189f894be4f3a5c5118`:

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_delete_message" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §HG.1 — `theo_chat_add_reaction` (GREENFIELD)

Mirrors the Primary Reference; adds an emoji guard, resolves the message's thread under RLS (404 if not visible), and does an idempotent `INSERT … ON CONFLICT DO NOTHING`, then publishes `reaction_added`. Full — file `handlers/theo_chat_add_reaction/index.js`:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const EMOJI_MAX = 32;

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
// VC-Reactions: an emoji is a short, non-empty string (1-32 chars) with no control characters. The DB
// CHECK (length(emoji) BETWEEN 1 AND 32) is the durable guard; this is the deterministic 400 before SQL.
function isValidReactionEmoji(value) {
  if (typeof value !== "string") return false;
  if (value.length < 1 || value.length > EMOJI_MAX) return false;
  if (value.trim().length < 1) return false;                 // reject whitespace-only
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return false;          // reject C0 control chars + DEL
  }
  return true;
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
  const emoji = typeof body.emoji === "string" ? body.emoji : "";
  if (!isValidReactionEmoji(emoji)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'emoji' is required and must be 1-32 characters with no control characters.", 400));
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

    // Membership gate: resolve the message under RLS. theo_chat_message_select returns it ONLY if the
    // caller is a participant of its thread, so a caller can only react to a message they can already
    // see. Absent / not a participant → 404 (no existence leak). thread_id is read here (not client-
    // supplied) and carried into the INSERT so the reaction is always attributed to the true thread.
    const m = await client.query(
      `SELECT thread_id FROM public.theo_chat_messages WHERE id = $1`,
      [messageId]
    );
    if (m.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Message not found.", 404);
    }
    const threadId = m.rows[0].thread_id;

    // Idempotent add. The theo_chat_message_reaction_insert RLS policy independently enforces
    // oid = auth.uid() AND caller ∈ thread. ON CONFLICT (message_id, oid, emoji) DO NOTHING → re-adding
    // the same reaction is a no-op (added:false). Single statement runs in autocommit; no explicit txn.
    const ins = await client.query(
      `INSERT INTO public.theo_chat_message_reactions (message_id, thread_id, oid, emoji)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (message_id, oid, emoji) DO NOTHING
       RETURNING id`,
      [messageId, threadId, oid, emoji]
    );
    const added = ins.rowCount > 0;

    // Best-effort realtime: tell connected participants to render the reaction live. The row is already
    // durably committed; a publish failure must not fail the request (peers reconcile on their next list).
    if (added && process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "reaction_added",
          thread_id: threadId,
          message_id: messageId,
          emoji,
          oid,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_add_reaction publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ added, message_id: messageId, emoji }));
  } catch (err) {
    context.log.error("theo_chat_add_reaction failed", err);
    if (err && err.code === "42501") {
      // RLS denial (INSERT WITH CHECK) — the caller may not react in this conversation.
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Reaction violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

### §HG.1-FJ — `theo_chat_add_reaction.function.json` (GREENFIELD)

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_add_reaction" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §HG.2 — `theo_chat_remove_reaction` (GREENFIELD)

Mirrors the Primary Reference; idempotent owner-scoped `DELETE … RETURNING thread_id`, then publishes `reaction_removed` on a real removal. No 404 (idempotent). Full — file `handlers/theo_chat_remove_reaction/index.js`:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const EMOJI_MAX = 32;

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
// VC-Reactions: an emoji is a short, non-empty string (1-32 chars) with no control characters (must match
// the value the client sent to theo_chat_add_reaction). Deterministic 400 before any SQL.
function isValidReactionEmoji(value) {
  if (typeof value !== "string") return false;
  if (value.length < 1 || value.length > EMOJI_MAX) return false;
  if (value.trim().length < 1) return false;                 // reject whitespace-only
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return false;          // reject C0 control chars + DEL
  }
  return true;
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
  const emoji = typeof body.emoji === "string" ? body.emoji : "";
  if (!isValidReactionEmoji(emoji)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'emoji' is required and must be 1-32 characters with no control characters.", 400));
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

    // Idempotent remove. The theo_chat_message_reaction_delete RLS policy independently enforces
    // oid = auth.uid() AND caller ∈ thread; the WHERE oid = $2 makes it doubly explicit that a caller
    // can only remove their OWN reaction. Nothing matching (already gone / never existed / not a
    // participant) → removed:false, 200 (idempotent — no existence leak, no 404). RETURNING thread_id
    // yields the group id for the best-effort publish. Single statement runs in autocommit.
    const del = await client.query(
      `DELETE FROM public.theo_chat_message_reactions
       WHERE message_id = $1 AND oid = $2 AND emoji = $3
       RETURNING thread_id`,
      [messageId, oid, emoji]
    );
    const removed = del.rowCount > 0;
    const threadId = removed ? del.rows[0].thread_id : null;

    // Best-effort realtime: tell connected participants to drop the reaction live. Already durably
    // committed; a publish failure must not fail the request (peers reconcile on their next list).
    if (removed && process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "reaction_removed",
          thread_id: threadId,
          message_id: messageId,
          emoji,
          oid,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_remove_reaction publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 200, successBody({ removed, message_id: messageId, emoji }));
  } catch (err) {
    context.log.error("theo_chat_remove_reaction failed", err);
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

### §HG.2-FJ — `theo_chat_remove_reaction.function.json` (GREENFIELD)

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_remove_reaction" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §HG.3 — `theo_chat_list_messages` (MODIFY: project the `reactions` aggregate on the VC-10 base)

Delta vs the deployed VC-10 copy (blob `56d4415…` — the richest reconciled shape: reply + delete + forward + attachment + gif): (1) the SELECT adds `rc.reactions AS reactions` + a new `LEFT JOIN LATERAL` aggregating `theo_chat_message_reactions` grouped by emoji for `m.id`; (2) each shaped message gains `reactions: r.reactions == null ? [] : r.reactions`. Cursor/paging/gate/reply/deleted/attachment/gif all UNCHANGED. Full — file `handlers/theo_chat_list_messages/index.js`:

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
    // VC-13: carry m.forwarded_from_message_id ONLY to derive a `forwarded` boolean below (the raw origin
    // id is never returned — it points into a thread the caller may not read).
    // VC-9: carry the attachment_* columns to derive an `attachment` preview below (the raw blob_path is
    // never returned — a read SAS is issued per-request by theo_chat_attachment_download).
    // VC-Reactions: LEFT JOIN LATERAL an emoji-grouped aggregate of theo_chat_message_reactions for each
    // message → reactions:[{ emoji, oids:[...] }] ([] when none). RLS on the reactions table also scopes
    // it to the caller's threads; the aggregate rides the same participant gate as the messages.
    const params = [threadId];
    let where = `m.thread_id = $1`;
    if (before != null) { params.push(before); where += ` AND m.seq < $${params.length}`; }
    params.push(limit);
    const rows = await client.query(
      `SELECT m.id, m.thread_id, m.seq, m.sender_oid, m.body, m.created_at, m.reply_to_message_id, m.deleted_at, m.forwarded_from_message_id,
              m.attachment_blob_path, m.attachment_filename, m.attachment_content_type, m.attachment_byte_size,
              m.gif_provider, m.gif_id, m.gif_url, m.gif_preview_url, m.gif_width, m.gif_height, m.gif_title,
              p.id AS p_id, p.seq AS p_seq, p.sender_oid AS p_sender_oid, p.body AS p_body, p.deleted_at AS p_deleted_at,
              rc.reactions AS reactions
       FROM public.theo_chat_messages m
       LEFT JOIN LATERAL (
         SELECT pm.id, pm.seq, pm.sender_oid, pm.body, pm.deleted_at
         FROM public.theo_chat_messages pm
         WHERE pm.id = m.reply_to_message_id AND pm.thread_id = m.thread_id
         LIMIT 1
       ) p ON true
       LEFT JOIN LATERAL (
         SELECT COALESCE(
                  json_agg(json_build_object('emoji', rx.emoji, 'oids', rx.oids) ORDER BY rx.emoji),
                  '[]'::json
                ) AS reactions
         FROM (
           SELECT r.emoji, array_agg(r.oid ORDER BY r.oid) AS oids
           FROM public.theo_chat_message_reactions r
           WHERE r.message_id = m.id
           GROUP BY r.emoji
         ) rx
       ) rc ON true
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
      // VC-13: expose ONLY the boolean (never the raw origin id — cross-thread privacy).
      forwarded: r.forwarded_from_message_id != null,
      // VC-9: expose the attachment preview (filename/content_type/byte_size) or null; never the raw
      // blob_path (a read SAS is issued per-request by theo_chat_attachment_download after a membership check).
      // VC-9 (Codex R1): a tombstoned message MASKS its attachment too — VC-12 "delete for everyone" nulls
      // the body AND must hide the file. The row keeps the pointer, but it is never projected once deleted.
      attachment: (r.attachment_blob_path == null || r.deleted_at != null) ? null : {
        filename: r.attachment_filename,
        content_type: r.attachment_content_type,
        byte_size: r.attachment_byte_size == null ? null : Number(r.attachment_byte_size),
      },
      // VC-10: expose the GIF (external GIPHY reference) or null; masked to null on a tombstone (VC-12
      // "delete for everyone" parity, mirroring attachment). The stored URLs are canonical GIPHY CDN URLs.
      gif: (r.gif_id == null || r.deleted_at != null) ? null : {
        provider: r.gif_provider,
        id: r.gif_id,
        url: r.gif_url,
        preview_url: r.gif_preview_url,
        width: r.gif_width == null ? null : Number(r.gif_width),
        height: r.gif_height == null ? null : Number(r.gif_height),
        title: r.gif_title,
      },
      // VC-Reactions: emoji reactions grouped by emoji -> [{ emoji, oids:[...] }]; [] when none. Independent
      // of the tombstone mask (a reaction is aggregate metadata, not message content). COALESCE in the SQL
      // guarantees a JSON array, so this is defensive only.
      reactions: r.reactions == null ? [] : r.reactions,
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

### §HG.3-FJ — `theo_chat_list_messages.function.json` (UNCHANGED — copied verbatim from the deployed copy)

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

## §API-SPEC — Role-C (Pass 4) documentation delta
`spec/THEO_API_SPEC.md` §2.10 **`read / send messages`** row: add `POST /api/theo_chat_add_reaction { message_id, emoji }` → **201** `{ added, message_id, emoji }` (idempotent; message not visible → **404**; bad input → **400**) and `POST /api/theo_chat_remove_reaction { message_id, emoji }` → **200** `{ removed, message_id, emoji }` (idempotent); note that `list_messages` messages now also carry `reactions: [{ emoji, oids:[…] }]`. `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3: add the `theo_chat_message_reactions` table row (child of `theo_chat_messages`; participant-scoped RLS; UNIQUE `(message_id, oid, emoji)`). Authored as a Role-C handoff after Pass-3 deploy + curls.

## §DEPLOY — Pass 3 (Walter migration FIRST, then Claude Code deploy to `vaultgpt-func-chat`)
1. **Walter** runs `migration_theo_chat_message_reactions.sql` + the verify SQL (the table + policies must exist before deploy).
2. **Claude Code** deploys the NEW `theo_chat_add_reaction/{index.js,function.json}` + `theo_chat_remove_reaction/{index.js,function.json}` via **Kudu VFS surgical overwrite** (ARM bearer; `If-Match: *`; `--data-binary`; expect 204; no token logged) to `vaultgpt-func-chat`. For `theo_chat_list_messages`: **Kudu-GET the LIVE `/site/wwwroot/theo_chat_list_messages/index.js` FIRST** (the deployed handler is the source of truth — gap R-1), confirm it matches the VC-10 shape in §HG.3, add ONLY the reactions LATERAL + `reactions` field, then PUT. Restart → confirm the 2 new functions register; baseline get-back before each overwrite; post-deploy get-back byte-matches this pack.

## §CURL — post-deploy verification (Claude Code; az-login token for the chat app; structural only — no OIDs/bodies)
Against a disposable channel the caller owns with one message M:
- `POST add_reaction` `message_id:"nope"` → **400** (UUID guard); valid `message_id` + `emoji:""` → **400** (emoji guard); + `emoji` containing a control char → **400**.
- `POST add_reaction` a non-existent/non-visible `message_id` + valid emoji → **404**.
- `POST add_reaction` M + `emoji:"👍"` → **201** `{ added:true }`; repeat → **201** `{ added:false }` (idempotent).
- `GET list_messages?threadId=<ch>` → M carries `reactions:[{ emoji:"👍", oids:[<caller>] }]`; a message with none carries `reactions:[]`; regression: `attachment`/`gif`/`reply_to`/`forwarded` fields still present + unchanged.
- `POST remove_reaction` M + `emoji:"👍"` → **200** `{ removed:true }`; repeat → **200** `{ removed:false }` (idempotent); `GET list_messages` → M `reactions:[]`.

## §SM-NOTE — structural mirror
`theo_chat_add_reaction` / `theo_chat_remove_reaction` are the deployed `theo_chat_delete_message` resolve→act→publish pattern (set_config triad, single scoped write, best-effort publish, `{data,meta}`/`{error}` envelope + error map) with two ALLOWED DELTAS: (a) plain RLS INSERT/DELETE instead of a SECURITY DEFINER call (reactions are owner-writable; Golden §3 permits ordinary RLS where no definer discrimination is needed), (b) the emoji guard + idempotent `ON CONFLICT DO NOTHING` / owner-scoped `DELETE`. `list_messages` adds only the reactions LATERAL + one projected field on the VC-10 base. No shared helper/envelope/error-map drift. `node --check` clean on all three handlers; all function.json valid JSON.

## Requested Pass 2 verdict
**APPROVED** or **REJECTED** only. On APPROVED: Walter runs the migration, Claude Code deploys the two new handlers + the `list_messages` overwrite (Kudu-GET live first) + curls, then the Role-C (Pass 4) + #6a-FE.
