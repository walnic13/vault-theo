# Theo 1B — VC-1 Native In-Vault Chat Backend Spine (backend: `theo_chat_negotiate` / `theo_chat_create_dm` / `theo_chat_create_channel` / `theo_chat_list_threads` / `theo_chat_list_messages` / `theo_chat_send_message` / `theo_chat_mark_read` + 3 participant-scoped chat tables + Azure Web PubSub realtime transport) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2, APPROVED / REJECTED only). Walter executes the migration + deploys the handlers at Pass 3 (to the **dedicated `vaultgpt-func-chat`** app — **never** the monolith); Claude Code runs golden curls after deploy; Role-C (Pass 4) lands the Plan / API-Spec / Schema documentation. This pack is **plan-only** — no code is deployed by authoring it.
>
> **Scope (VC-1 = the working realtime chat spine):** 7 HTTP handlers + 3 new `theo_chat_*` Postgres tables with **participant-scoped, non-recursive RLS**, plus the **Azure Web PubSub** realtime transport (negotiate token + per-thread group publish). This is the backend for the native in-Vault chat (the People panel growing into a Teams-style DM + group-channel surface) whose realtime + full-scope decisions Walter locked 2026-07-03. Post-hoc channel-membership editing (`add_member` / `remove_member`) is a small **VC-1.2** fast-follow and is **out of scope** here. All handlers deploy to the **new dedicated `vaultgpt-func-chat`** Function App (Windows, Node 22, Functions v4, on the existing EP1 plan `ASP-VaultTax-931c`) — mirroring the streaming sidecar precedent — so the chat surface can scale and run v4 independently of the read-only monolith.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `d20a5cd` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-1 native-chat spine; P1–P8 walked; migration + verify SQL, Primary Reference pair inlined byte-verbatim, 7 greenfield handlers + function.json bindings inlined byte-verbatim; Web PubSub classified as a P3 external-system DEVIATION (justified: Walter directive + provisioned infra + server-SDK research). No `reporting_*` / `corporate-reporting` change. No monolith change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register) | `git grep -F "VEP Format"` + `git grep -F "Gap Register"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4/§4A.1 P-track) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates; reviewer regime) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary; §4 new-external-system deltas) | `git grep -F "selects **exactly one** deployed handler file"` + `git grep -F "new-domain or new-external-system helper"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis) | `git grep -F "Pass 1 (Claude Code VEP)"` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (ownership-only scope; native chat NOT yet in plan → Gap Register) | `git grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `git grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_` table + RLS conventions) | `git grep -F "theo_projects"` this turn | `59924ef06b64e62b4cc6a268793d52bd82945cbd` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (separate-app / v4-sidecar precedent; monolith-untouched) | `git grep -F "the monolith \`theo_message\` is unchanged"` this turn | `c0e51f8d5f76d185a8bdd6d831f14409b763a273` |
| 10 | **Primary Reference handler** (deployed owner/participant-scoped mutation, set_config triad, exists-unscoped 403/404) — `Codex Governance/Theo-1B-B5c-Per-Member-Invite-Backend-Pass-1-VEP/theo_share_project.index.js` | `Read(full)` this turn | `ae57565d894cc6ad0d8ddaf38e6f665d0f63a69a` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-B5c-Per-Member-Invite-Backend-Pass-1-VEP/theo_share_project.function.json` | `Read(full)` this turn | `0cd7aca291c5e9034534348c29cdc88e891685ca` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` and sidecar `vaultgpt-func-stream` are READ-ONLY (Walter hard rule) — all deploys target the new `vaultgpt-func-chat`. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3, §5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Verbatim Clause Text MUST be a direct substring of the source doc as read this turn" | Rule Anchor Table — every quote is a literal substring verified this turn |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §MIGRATION + §SM + §HG + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR — Gap Register |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — this pack is Pass 1, Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 + §P2.5 — native chat is participant-scoped and NOT yet in the Plan → PROCEED gap w/ future-trigger (Walter-authorized) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_share_project` pair |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — Azure Web PubSub classified DEVIATION (justified) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — chat handlers touch only `theo_chat_*`; no `reporting_*`, no monolith |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — participant-scoped RLS is a cited extension of the ownership family (self-contained, non-recursive) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_projects" | §MIGRATION — new `theo_chat_*` tables follow the `theo_` + RLS conventions |
| spec/THEO_API_SPEC.md | separate-app | "the monolith `theo_message` is unchanged" | §P2 — dedicated `vaultgpt-func-chat`; monolith read-only/untouched |
| spec/THEO_API_SPEC.md | v4 precedent | "Runs on the **v4 sidecar**" | §P3 — new chat app on EP1 mirrors the deployed v4 sidecar precedent |
| Codex Governance/Theo-1B-B5c-Per-Member-Invite-Backend-Pass-1-VEP/theo_share_project.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.* — every chat handler reuses the Primary Reference set_config triad idiom |
| Codex Governance/Theo-1B-B5c-Per-Member-Invite-Backend-Pass-1-VEP/theo_share_project.function.json | binding | "httpTrigger" | §SM-FJ + §FJ.* — anonymous httpTrigger binding (EasyAuth gates identity) |

## P1 — Feature identification

**Microstep:** VC-1, the native in-Vault chat realtime backend spine. The People panel evolves into a Teams-style messaging surface with **direct messages** and **group channels**, delivered in realtime.

**New endpoints (7), all on `vaultgpt-func-chat`:**
- `GET  /api/theo_chat_negotiate` — issue a Web PubSub client access token scoped to exactly the caller's thread groups.
- `POST /api/theo_chat_create_dm` — get-or-create the canonical DM thread for the caller ↔ a peer OID.
- `POST /api/theo_chat_create_channel` — create a named group channel with an initial member list (creator auto-included).
- `GET  /api/theo_chat_list_threads` — the caller's threads, each with last-message preview + unread count.
- `GET  /api/theo_chat_list_messages?threadId=<uuid>` — a thread's messages, seq-cursor paged.
- `POST /api/theo_chat_send_message` — persist a message (atomic per-thread seq) then publish it to the thread's Web PubSub group.
- `POST /api/theo_chat_mark_read` — advance the caller's `last_read_seq` (monotonic) for unread tracking.

**New data (3 tables):** `theo_chat_threads`, `theo_chat_thread_members`, `theo_chat_messages` (see §MIGRATION / §P6).

**Out of scope (VC-1):** channel membership editing after creation (`add_member` / `remove_member` = VC-1.2); presence + typing indicators (VC-3); the FE docked chat surface (VC-2, a separate vault-origin FE VEP); search / mentions (VC-4).

**Plan status:** native chat is a Walter-directed project (realtime-via-Web-PubSub + DMs-and-channels locked 2026-07-03) that is **not yet represented** in the Theo Phase 1B Backend Plan (the Plan's stated posture is "sharing/membership RLS models (ownership-only unless Walter authorizes)"). Walter has authorized this work and directed authoring ("go straight to authoring, but remember we'll need to maintain governance, going through codex"). This is recorded as a **PROCEED** gap with a mandatory future-trigger in §P2.5 (Plan / API-Spec / Schema Role-C amendments).

## P2 — Architecture & boundary reconciliation

**Handler family.** All 7 handlers are Family-B HTTP handlers mirroring the deployed Primary Reference (`theo_share_project`): `pg` Pool with `connectionString: process.env.POSTGRES_CONNECTION_STRING` + `ssl:{rejectUnauthorized:false}` (relying on the chat app's libpq `PG*` env, exactly as the monolith's deployed handlers do — there is no `POSTGRES_CONNECTION_STRING` app-setting; the value is `undefined` and `pg` falls back to `PGHOST/PGUSER/...`); `getPrincipal` / `getClaimValue` reading the Entra OID from the EasyAuth `x-ms-client-principal` header; validate-before-SQL; connect → `set_config` triad (`app.current_user_id` / `request.jwt.claim.sub` / `request.jwt.claim.oid` = OID) → participant-scoped predicate → `{data,meta}` / `{error}` envelope; anonymous `httpTrigger` binding (EasyAuth enforces identity).

**RLS family.** Participant-scoped is a **cited extension of the deployed ownership family** ("Default family: ownership-based", Architecture §5.2): instead of `created_by = auth.uid()`, chat rows are visible when `auth.uid() = ANY(member_oids)`. This is SELECT/INSERT/UPDATE-scoped exactly as ownership is, and is **self-contained and non-recursive** (see §P8).

**Boundary.** Chat handlers read/write **only** the 3 new `theo_chat_*` tables. Per Golden §3 ("It MUST NOT read or write" `reporting_*` tables) there is **no** `reporting_*` / `corporate-reporting` access, **no** Blob, **no** Graph, **no** gateway/Foundry call, and **no** touch of `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages`. Deploy target is the **new dedicated `vaultgpt-func-chat`** app; the monolith `vaultgpt-func-premium` and the streaming sidecar `vaultgpt-func-stream` are **READ-ONLY** and untouched (Walter hard rule; mirrors the API Spec precedent "the monolith `theo_message` is unchanged").

**Validation before SQL.** Every handler validates typed inputs (UUID / OID regex; strict `^[0-9]+$` before `parseInt` for `seq`/`limit`/`before`; body-length caps) and returns a deterministic 400 before any SQL or Web PubSub call.

## P2.5 / GR — Gap Register

Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| Native chat / VC is not represented in the Theo Phase 1B Backend Plan (nor in the API Spec or Azure Postgres Schema). The Plan's current posture is ownership-only. | Walter expressly directed this work and locked its scope 2026-07-03 (realtime via Web PubSub; DMs + group channels), and this turn directed "go straight to authoring, but remember we'll need to maintain governance, going through codex." The absence is a documentation-currency gap, not a missing decision — the authority is Walter's standing directive, not an in-Plan tier. | **PROCEED** with mandatory future-trigger: a Role-C (Pass 4) amendment MUST land adding the VC tier to `THEO_PHASE_1B_BACKEND_PLAN.md`, plus API-Spec (`spec/THEO_API_SPEC.md`) entries for the 7 chat routes and Schema (`spec/THEO_AZURE_POSTGRES_SCHEMA.md`) entries for the 3 `theo_chat_*` tables. Sequenced after Pass 3 deploy + golden curls (documents deployed reality), same as prior tiers' Role-C handoffs. |
| Web PubSub is a new external system with no deployed Theo handler mirror. | Classified as a **DEVIATION** in §P3, justified by Walter's verbatim directive + provisioned infra + server-SDK research; isolated to the new chat app. | **PROCEED** — see §P3. |

## P3 — External-system reconciliation

**Azure Web PubSub — DEVIATION (justified).** Per Golden §4, a "new-domain or new-external-system helper" that has no EXACT deployed-handler mirror is a DEVIATION that "must be justified or removed." Chat realtime has no deployed Theo precedent, so the Web PubSub integration is classified **DEVIATION** and justified as follows:

1. **Walter authorization, verbatim, predating this VEP:** the realtime-transport decision was locked 2026-07-03 — *"Realtime push via Azure Web PubSub"* (not polling) — and Walter directed *"go straight to authoring, but remember we'll need to maintain governance, going through codex."* Walter additionally set the enterprise posture: *"never shortcuts for free services … This is a premium enterprise level product that needs to scale so we must treat it that way always. entirely azure based windows."*
2. **Provisioned infra (VC-1a, already live):** Azure Web PubSub `vaultgpt-webpubsub` (Standard_S1, 1 unit, uksouth — paid tier per the enterprise-scale rule); hub `vaultchat`; connection string present on the chat app as `WebPubSubConnectionString`.
3. **Integration pattern (server SDK, no Functions binding):** the handlers use the `@azure/web-pubsub` server SDK **directly** — `new WebPubSubServiceClient(process.env.WebPubSubConnectionString, "vaultchat")`. Negotiate calls `getClientAccessToken({ userId, groups, roles })` and returns `{ url }`; send publishes with `serviceClient.group(threadId).sendToAll(...)`. No Functions trigger/output binding or extension bundle is used, so the pattern is model-agnostic and adds no coupling to the runtime.
4. **Isolation + scale:** the integration lives **only** in the new `vaultgpt-func-chat` app (Windows, v4, EP1) — mirroring the deployed v4 sidecar precedent ("Runs on the **v4 sidecar**") — so it neither touches nor risks the read-only monolith.
5. **Durability-first:** `theo_chat_send_message` persists to Postgres and commits **before** publishing; the publish is best-effort (a publish failure is logged, never fails the durable send — recipients still receive the message on their next `list_messages` / reconnect).

No other external system is contacted. No Blob, no Graph, no Foundry, no `reporting_*`.

## P4 — Contract reconciliation

**Envelope (mirrors the Primary Reference byte-for-byte):** success → `{ data: {...}, meta: { timestamp, version: "1.0" } }`; error → `{ error: { code, message, status, timestamp } }`.

Per-endpoint success shapes:
- `theo_chat_negotiate` → `200 { url, hub, groups }` (`groups` = the caller's thread ids the token is scoped to).
- `theo_chat_create_dm` → `201 { thread, created:true }` on create; `200 { thread, created:false }` when the canonical DM already exists.
- `theo_chat_create_channel` → `201 { thread, created:true }`.
- `theo_chat_list_threads` → `200 { threads: [{ id, kind, name, member_oids, created_by, dm_key, created_at, updated_at, last_read_seq, unread_count, last_message }] }`.
- `theo_chat_list_messages` → `200 { messages: [{ id, thread_id, seq, sender_oid, body, created_at }], page: { limit, has_more, next_before } }`.
- `theo_chat_send_message` → `201 { message: { id, thread_id, seq, sender_oid, body, created_at } }`.
- `theo_chat_mark_read` → `200 { read_state: { thread_id, member_oid, last_read_seq } }`.

Inputs: `create_dm` `{ peer_oid }`; `create_channel` `{ name, member_oids[] }`; `list_messages` `?threadId&before?&limit?`; `send_message` `{ thread_id, body }`; `mark_read` `{ thread_id, seq }`. Unknown/extra fields are ignored (not persisted); malformed typed inputs → 400.

## P5 — Error-model reconciliation

Identical mapping to the Primary Reference:
- Missing/invalid EasyAuth identity → **401** `UNAUTHORIZED`.
- Invalid JSON body → **400** `BAD_REQUEST`.
- Failed input validation (bad UUID/OID, empty/oversized body, non-integer seq/limit) → **400** `INVALID_REQUEST` (or `PAYLOAD_TOO_LARGE` for oversize body).
- Caller not a participant of the target thread → **404** `NOT_FOUND` (no existence leak), raised as an `isKnown` error.
- Postgres `42501` (RLS denial) → **403** `FORBIDDEN`.
- Postgres `23503` (FK violation) → **404** `NOT_FOUND`.
- Postgres `23514` (CHECK violation) → **400** `INVALID_REQUEST`.
- `send_message` seq-race exhaustion (`23505` after retries) → **409** `CONFLICT`.
- Anything else → **500** `INTERNAL_SERVER_ERROR`.

`isKnown` custom errors carry `{code,status}` and are re-mapped verbatim (mirrors `buildKnownError`).

## P6 — Data-shape reconciliation

Three new tables (full DDL in §MIGRATION):
- **`theo_chat_threads`** — `id uuid PK`, `kind text CHECK (dm|channel)`, `name text` (channel label; NULL for DM), `member_oids text[]` (participants + the RLS gate), `created_by text`, `dm_key text` (canonical sorted-OID-pair identity; NULL for channel; unique partial index), `created_at`, `updated_at` (bumped per message).
- **`theo_chat_thread_members`** — `(thread_id, member_oid) PK`, `last_read_seq bigint` (unread math), `joined_at`. Membership *authority* is `threads.member_oids`; this table holds per-member read state.
- **`theo_chat_messages`** — `id uuid PK`, `thread_id`, `seq bigint` (per-thread monotonic; `UNIQUE(thread_id, seq)`), `sender_oid`, `body text CHECK (len 1..8000)`, `created_at`.

Follows the `theo_` naming + RLS conventions of the deployed schema (anchor: "theo_projects", Schema §3).

## P7 — Idempotency / concurrency

- **DM creation is idempotent:** the canonical `dm_key` (sorted OID pair joined by `|`) + unique partial index guarantees A↔B and B↔A resolve to one thread; a concurrent create that loses the unique race re-selects the winning row and returns `created:false`.
- **Channel creation** is not idempotent by design (distinct named channels are allowed); creator + members deduped case-insensitively.
- **Message seq** is assigned atomically inside `INSERT … SELECT COALESCE(MAX(seq),0)+1`; the `UNIQUE(thread_id, seq)` constraint catches a concurrent sender and the handler retries (up to 5×) before returning `409`.
- **`mark_read`** upserts with `GREATEST(existing, incoming)` so read state never moves backwards; re-sending the same seq is a no-op.
- **Web PubSub publish** is best-effort and post-commit (never double-persists; never fails the send).

## P8 — Security / RLS reconciliation

**set_config triad.** Every handler opens its transaction (or its first statement) with the deployed triad `set_config('app.current_user_id'|'request.jwt.claim.sub'|'request.jwt.claim.oid', <OID>, false)` so the connection role's RLS evaluates as the signed-in user — identical to the Primary Reference.

**Participant-scoped RLS, self-contained, NON-RECURSIVE (the B5c T12 lesson).** `theo_chat_threads` carries `member_oids text[]`, so its SELECT policy is fully self-contained: `auth.uid() = ANY(member_oids)` — no subquery, no reference to another table. `theo_chat_messages` and `theo_chat_thread_members` gate by referencing `theo_chat_threads` (self-contained), and `theo_chat_threads` references **neither** back. No policy triggers evaluation of a table whose policy references it → no recursion. **No SECURITY DEFINER helper and no new elevated-read class are introduced** (Golden §3): only ordinary `auth.uid()` primitives, a cited extension of the ownership family ("Default family: ownership-based").

**Defense in depth.** Handlers keep an explicit participant predicate (`WHERE id = $1 AND $2 = ANY(member_oids)`) in addition to RLS; a non-participant read yields 0 rows → deterministic 404, no existence leak. Writes are the caller's own rows only (`sender_oid = auth.uid()`, `created_by = auth.uid()`, own `last_read_seq`), enforced by both the handler and the RLS `WITH CHECK`.

**No leakage.** Responses carry no tokens, no upstream URLs, no model credentials. The negotiate URL is a per-caller scoped Web PubSub client token (join/publish limited to the caller's own thread groups). OIDs returned are the participant identities the FE already resolves via the People roster (same identity surface as the deployed `theo_list_people` / share flow) — not a new disclosure.

## §MIGRATION — `vc1_chat_migration.sql` (additive + reversible; run by Walter at Pass 3)

Additive, idempotent (`IF NOT EXISTS`), and reversible. No top-level transaction control (Golden §5.2); Walter executes. `-- label` comments only.

```sql
-- Theo VC-1 — native in-Vault chat backend spine. ADDITIVE + REVERSIBLE. New tables in the Vault DB
-- (vaultgpt-postgres-prod). Participant-scoped RLS. Handlers deploy to the DEDICATED vaultgpt-func-chat
-- app (Windows v4, EP1) — NEVER the monolith. Idempotent; safe to re-run.
--
-- RLS non-recursion (design-critical — the B5c T12 lesson): theo_chat_threads carries member_oids text[]
-- (the participant list), so its SELECT policy is SELF-CONTAINED: `auth.uid() = ANY(member_oids)` — no
-- subquery, no other table. theo_chat_messages and theo_chat_thread_members gate by referencing
-- theo_chat_threads (self-contained), and threads references NEITHER back — so no policy triggers a
-- table whose policy references it. NO SECURITY DEFINER helper, NO new elevated-read class (Golden
-- Handler §3 / API Spec §1 unchanged) — only ordinary ownership-family auth.uid() primitives.

-- 1) Threads — a DM or a channel. member_oids = the current participants (Entra OIDs) and the RLS gate.
CREATE TABLE IF NOT EXISTS public.theo_chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('dm','channel')),
  name text,                                          -- channel display name; NULL for a dm
  member_oids text[] NOT NULL DEFAULT '{}',           -- current participants (Entra OIDs); the RLS gate
  created_by text NOT NULL,                           -- creator's Entra OID
  dm_key text,                                        -- canonical dm identity (sorted oid pair 'a|b'); NULL for channel
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()       -- bumped on each new message (drives thread ordering)
);
-- Canonical DM dedup: at most one dm thread per unordered oid pair.
CREATE UNIQUE INDEX IF NOT EXISTS theo_chat_threads_dm_key_uk
  ON public.theo_chat_threads (dm_key) WHERE dm_key IS NOT NULL;
-- Membership containment lookups (auth.uid() = ANY(member_oids)).
CREATE INDEX IF NOT EXISTS theo_chat_threads_members_gin
  ON public.theo_chat_threads USING gin (member_oids);

-- 2) Per-member read state (unread tracking). Membership AUTHORITY is threads.member_oids; this table
--    holds last_read_seq per member. (Kept in sync with member_oids by the handlers, one transaction.)
CREATE TABLE IF NOT EXISTS public.theo_chat_thread_members (
  thread_id uuid NOT NULL REFERENCES public.theo_chat_threads(id) ON DELETE CASCADE,
  member_oid text NOT NULL,
  last_read_seq bigint NOT NULL DEFAULT 0,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (thread_id, member_oid)
);
CREATE INDEX IF NOT EXISTS theo_chat_members_oid_idx
  ON public.theo_chat_thread_members (member_oid);

-- 3) Messages — seq is a per-thread monotonic sequence (ordering + unread math).
CREATE TABLE IF NOT EXISTS public.theo_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.theo_chat_threads(id) ON DELETE CASCADE,
  seq bigint NOT NULL,
  sender_oid text NOT NULL,
  body text NOT NULL CHECK (length(body) > 0 AND length(body) <= 8000),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (thread_id, seq)
);
CREATE INDEX IF NOT EXISTS theo_chat_messages_thread_seq_idx
  ON public.theo_chat_messages (thread_id, seq);

ALTER TABLE public.theo_chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theo_chat_thread_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theo_chat_messages ENABLE ROW LEVEL SECURITY;

-- ── RLS: participant-scoped, SELF-CONTAINED (no recursion, no SECURITY DEFINER) ──

-- threads: a participant reads; a participant-creator inserts; a participant updates (bump/rename/members
-- — the handler enforces finer rules, e.g. channel rename by creator, dm immutable).
DROP POLICY IF EXISTS "theo_chat_thread_select" ON public.theo_chat_threads;
CREATE POLICY "theo_chat_thread_select" ON public.theo_chat_threads
  FOR SELECT TO authenticated
  USING (auth.uid() = ANY (member_oids));
DROP POLICY IF EXISTS "theo_chat_thread_insert" ON public.theo_chat_threads;
CREATE POLICY "theo_chat_thread_insert" ON public.theo_chat_threads
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND auth.uid() = ANY (member_oids));
DROP POLICY IF EXISTS "theo_chat_thread_update" ON public.theo_chat_threads;
CREATE POLICY "theo_chat_thread_update" ON public.theo_chat_threads
  FOR UPDATE TO authenticated
  USING (auth.uid() = ANY (member_oids))
  WITH CHECK (auth.uid() = ANY (member_oids));

-- members (read state): see your own row, OR any member row of a thread you belong to (via threads,
-- self-contained). Insert a row only into a thread you belong to. Update only YOUR OWN read state.
DROP POLICY IF EXISTS "theo_chat_member_select" ON public.theo_chat_thread_members;
CREATE POLICY "theo_chat_member_select" ON public.theo_chat_thread_members
  FOR SELECT TO authenticated
  USING (
    member_oid = auth.uid()
    OR thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids))
  );
DROP POLICY IF EXISTS "theo_chat_member_insert" ON public.theo_chat_thread_members;
CREATE POLICY "theo_chat_member_insert" ON public.theo_chat_thread_members
  FOR INSERT TO authenticated
  WITH CHECK (thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)));
DROP POLICY IF EXISTS "theo_chat_member_update" ON public.theo_chat_thread_members;
CREATE POLICY "theo_chat_member_update" ON public.theo_chat_thread_members
  FOR UPDATE TO authenticated
  USING (member_oid = auth.uid())
  WITH CHECK (member_oid = auth.uid());
DROP POLICY IF EXISTS "theo_chat_member_delete" ON public.theo_chat_thread_members;
CREATE POLICY "theo_chat_member_delete" ON public.theo_chat_thread_members
  FOR DELETE TO authenticated
  USING (thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)));

-- messages: read if you're a participant of the thread (via threads, self-contained); insert only your
-- own message into a thread you belong to. (No UPDATE/DELETE policy in v1 — messages are immutable.)
DROP POLICY IF EXISTS "theo_chat_message_select" ON public.theo_chat_messages;
CREATE POLICY "theo_chat_message_select" ON public.theo_chat_messages
  FOR SELECT TO authenticated
  USING (thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)));
DROP POLICY IF EXISTS "theo_chat_message_insert" ON public.theo_chat_messages;
CREATE POLICY "theo_chat_message_insert" ON public.theo_chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_oid = auth.uid()
    AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids))
  );
```

**Read-only verification (run after the migration):**

```sql
-- Theo VC-1 — read-only verification (run after vc1_chat_migration.sql). SELECT-only; no writes.

-- V1) the three tables exist + RLS enabled.
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname IN ('theo_chat_threads','theo_chat_thread_members','theo_chat_messages')
ORDER BY c.relname;

-- V2) columns of each table.
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name IN ('theo_chat_threads','theo_chat_thread_members','theo_chat_messages')
ORDER BY table_name, ordinal_position;

-- V3) keys, FKs, uniques, checks.
SELECT c.relname AS table_name, con.conname, con.contype
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname IN ('theo_chat_threads','theo_chat_thread_members','theo_chat_messages')
ORDER BY c.relname, con.contype, con.conname;

-- V4) indexes (dm_key unique-partial, members gin, oid, messages thread_seq).
SELECT tablename, indexname FROM pg_indexes
WHERE schemaname = 'public' AND tablename IN ('theo_chat_threads','theo_chat_thread_members','theo_chat_messages')
ORDER BY tablename, indexname;

-- V5) policies present (threads: select/insert/update; members: select/insert/update/delete;
--     messages: select/insert). No SECURITY DEFINER function created by this migration.
SELECT c.relname AS tablename, p.polname, p.polcmd
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname IN ('theo_chat_threads','theo_chat_thread_members','theo_chat_messages')
ORDER BY c.relname, p.polname;
```

## §SM — Primary Reference (deployed `theo_share_project.index.js`, byte-verbatim)

Per Golden §2 ("selects **exactly one** deployed handler file"), the canonical Primary Reference is the deployed **`theo_share_project`** handler (B5c) — the closest deployed analog: an owner/participant-scoped mutation over a `theo_` table using the set_config triad, exists-unscoped 403/404 discrimination, and the `{data,meta}`/`{error}` envelope. Inlined full-verbatim (blob `ae57565d894cc6ad0d8ddaf38e6f665d0f63a69a`):

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
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  if (typeof req.body === "object") {
    return req.body;
  }
  return {};
}

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  err.isKnown = true;
  return err;
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
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
  try {
    body = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  }
  // member_oid is an Entra object id (UUID-shaped), the same identity theo_list_people returns.
  const memberOid = typeof body.member_oid === "string" ? body.member_oid.trim() : "";
  if (!isUuid(memberOid)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'member_oid' is required and must be a valid UUID (Entra object id).", 400));
  }
  if (memberOid === oid) {
    return send(context, 400, errorBody("INVALID_REQUEST", "You cannot invite yourself to a project you own.", 400));
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Only the project OWNER may invite. Explicit ownership scope (connection role enforces RLS;
    // this predicate is the primary gate): id AND created_by = the signed-in OID. Exists-but-not-
    // owned → 403; absent → 404 (via the deployed SECURITY DEFINER existence helper). No leakage.
    const owned = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
      [projectId, oid]
    );
    if (owned.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_exists_unscoped($1::uuid) AS e`,
        [projectId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this project.", 403)
        : buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // Idempotent invite: (project_id, member_oid) is the PK; re-inviting is a no-op. invited_by
    // records the owner. RLS INSERT policy independently requires invited_by = auth.uid() + owner.
    await client.query(
      `
      INSERT INTO public.theo_project_members (project_id, member_oid, invited_by)
      VALUES ($1, $2, $3)
      ON CONFLICT (project_id, member_oid) DO NOTHING
      `,
      [projectId, memberOid, oid]
    );

    await client.query("COMMIT");

    return send(context, 200, successBody({ shared: true, project_id: projectId, member_oid: memberOid }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_share_project failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // FK violation: project deleted mid-op (defensive; ownership verified above).
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

## §SM-FJ — Primary Reference function.json (deployed `theo_share_project.function.json`, byte-verbatim)

Blob `0cd7aca291c5e9034534348c29cdc88e891685ca`:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_share_project"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG — Handlers (7 GREENFIELD full replacements)

All 7 are greenfield chat handlers; each reuses the Primary Reference boilerplate verbatim (envelope, `getPrincipal`/`getClaimValue`, `parseBody`, `buildKnownError`, `isUuid`, set_config triad, error map) and adds only its endpoint-specific logic. `theo_chat_negotiate` and `theo_chat_send_message` additionally use the `@azure/web-pubsub` server SDK (the P3 DEVIATION).

### §HG.1 — `theo_chat_negotiate` (GREENFIELD)

Issues a Web PubSub client access token scoped to exactly the caller's thread groups (RLS-filtered), with per-thread `joinLeaveGroup` + `sendToGroup` roles.

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
  if (!process.env.WebPubSubConnectionString) {
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Chat realtime is not configured.", 500));
  }

  const client = await pool.connect();
  try {
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // The caller's threads (RLS returns only threads where the caller is a participant). The Web PubSub
    // token is scoped to EXACTLY these thread groups — the client can join + publish (typing/ephemeral)
    // only to its own threads. New threads created later require a re-negotiate (the FE re-fetches on
    // create/first-open). Group name = the thread id.
    const rows = await client.query(
      `SELECT id FROM public.theo_chat_threads WHERE $1 = ANY(member_oids) ORDER BY updated_at DESC LIMIT 1000`,
      [oid]
    );
    const threadIds = rows.rows.map((r) => r.id);

    const roles = [];
    for (const tid of threadIds) {
      roles.push(`webpubsub.joinLeaveGroup.${tid}`);
      roles.push(`webpubsub.sendToGroup.${tid}`);
    }

    const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
    // userId = the caller's OID; groups = auto-join the caller's threads; roles = per-thread scoped.
    const token = await serviceClient.getClientAccessToken({ userId: oid, groups: threadIds, roles });

    return send(context, 200, successBody({ url: token.url, hub: HUB, groups: threadIds }));
  } catch (err) {
    context.log.error("theo_chat_negotiate failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to connect to chat.", 403));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

**§FJ.1 — `theo_chat_negotiate.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_chat_negotiate"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### §HG.2 — `theo_chat_create_dm` (GREENFIELD)

Canonical get-or-create by sorted OID-pair `dm_key`; race-safe; seeds both members' read-state rows.

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
// Entra object ids are GUIDs; a DM peer is identified by its OID.
function isOid(value) {
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

  const peerOid = typeof body.peer_oid === "string" ? body.peer_oid.trim() : "";
  if (!isOid(peerOid)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'peer_oid' is required and must be a valid Entra object id.", 400));
  }
  if (peerOid.toLowerCase() === oid.toLowerCase()) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Cannot open a direct message with yourself.", 400));
  }

  // Canonical DM identity: the unordered pair, sorted, joined by '|'. Guarantees A↔B and B↔A resolve to
  // one thread (backed by the unique partial index on dm_key).
  const pair = [oid, peerOid].sort((a, b) => a.localeCompare(b));
  const dmKey = `${pair[0]}|${pair[1]}`;

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

    await client.query("BEGIN");

    // Get-or-create. Existing DM (either party already created it) → return it. RLS lets the caller see it
    // because the caller is in member_oids.
    const existing = await client.query(
      `SELECT id, kind, name, member_oids, created_by, dm_key, created_at, updated_at
       FROM public.theo_chat_threads
       WHERE dm_key = $1 AND $2 = ANY(member_oids)`,
      [dmKey, oid]
    );
    if (existing.rowCount > 0) {
      await client.query("COMMIT");
      return send(context, 200, successBody({ thread: existing.rows[0], created: false }));
    }

    // Create the thread with BOTH members present in member_oids (so the RLS INSERT check —
    // created_by = auth.uid() AND auth.uid() = ANY(member_oids) — passes and the peer can immediately see it).
    let thread;
    try {
      const ins = await client.query(
        `INSERT INTO public.theo_chat_threads (kind, name, member_oids, created_by, dm_key)
         VALUES ('dm', NULL, ARRAY[$1, $2]::text[], $1, $3)
         RETURNING id, kind, name, member_oids, created_by, dm_key, created_at, updated_at`,
        [oid, peerOid, dmKey]
      );
      thread = ins.rows[0];
    } catch (e) {
      // Concurrent create raced us to the unique dm_key — re-select the winning row and return it.
      if (e && e.code === "23505") {
        await client.query("ROLLBACK");
        await client.query("BEGIN");
        const race = await client.query(
          `SELECT id, kind, name, member_oids, created_by, dm_key, created_at, updated_at
           FROM public.theo_chat_threads WHERE dm_key = $1 AND $2 = ANY(member_oids)`,
          [dmKey, oid]
        );
        await client.query("COMMIT");
        if (race.rowCount > 0) return send(context, 200, successBody({ thread: race.rows[0], created: false }));
        throw buildKnownError("CONFLICT", "Could not open the conversation; please retry.", 409);
      }
      throw e;
    }

    // Read-state rows for both members (membership authority stays threads.member_oids; these track unread).
    await client.query(
      `INSERT INTO public.theo_chat_thread_members (thread_id, member_oid)
       VALUES ($1, $2), ($1, $3)
       ON CONFLICT (thread_id, member_oid) DO NOTHING`,
      [thread.id, oid, peerOid]
    );

    await client.query("COMMIT");
    return send(context, 201, successBody({ thread, created: true }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_create_dm failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Request violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

**§FJ.2 — `theo_chat_create_dm.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_create_dm"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### §HG.3 — `theo_chat_create_channel` (GREENFIELD)

Creates a named channel; creator auto-included; members deduped; member cap enforced.

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const MAX_NAME = 120;
const MAX_MEMBERS = 200;

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
function isOid(value) {
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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'name' is required and must be non-empty.", 400));
  }
  if (name.length > MAX_NAME) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'name' exceeds ${MAX_NAME} characters.`, 400));
  }

  const rawMembers = Array.isArray(body.member_oids) ? body.member_oids : [];
  for (const m of rawMembers) {
    if (!isOid(typeof m === "string" ? m.trim() : m)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Every entry in 'member_oids' must be a valid Entra object id.", 400));
    }
  }

  // Creator is always a member. De-dupe (case-insensitive on OID) and include the caller.
  const seen = new Map();
  seen.set(oid.toLowerCase(), oid);
  for (const m of rawMembers) {
    const v = m.trim();
    if (!seen.has(v.toLowerCase())) seen.set(v.toLowerCase(), v);
  }
  const members = Array.from(seen.values());
  if (members.length > MAX_MEMBERS) {
    return send(context, 400, errorBody("INVALID_REQUEST", `A channel may have at most ${MAX_MEMBERS} members.`, 400));
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

    await client.query("BEGIN");

    const ins = await client.query(
      `INSERT INTO public.theo_chat_threads (kind, name, member_oids, created_by, dm_key)
       VALUES ('channel', $1, $2::text[], $3, NULL)
       RETURNING id, kind, name, member_oids, created_by, dm_key, created_at, updated_at`,
      [name, members, oid]
    );
    const thread = ins.rows[0];

    // Read-state rows for every member (values(...) built from the member list).
    const values = members.map((_, i) => `($1, $${i + 2})`).join(", ");
    await client.query(
      `INSERT INTO public.theo_chat_thread_members (thread_id, member_oid)
       VALUES ${values}
       ON CONFLICT (thread_id, member_oid) DO NOTHING`,
      [thread.id, ...members]
    );

    await client.query("COMMIT");
    return send(context, 201, successBody({ thread, created: true }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_create_channel failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create a channel.", 403));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Request violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

**§FJ.3 — `theo_chat_create_channel.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_create_channel"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### §HG.4 — `theo_chat_list_threads` (GREENFIELD)

The caller's threads with last-message preview + unread count (via `last_read_seq`), newest-updated first.

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

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

    // RLS returns only the caller's threads. For each: the caller's read state (last_read_seq), the last
    // message (for the list preview), and the unread count (messages after last_read_seq not sent by the
    // caller). All joins stay within RLS-visible rows.
    const rows = await client.query(
      `
      SELECT
        t.id, t.kind, t.name, t.member_oids, t.created_by, t.dm_key, t.created_at, t.updated_at,
        COALESCE(mem.last_read_seq, 0) AS last_read_seq,
        lm.seq        AS last_seq,
        lm.body       AS last_body,
        lm.sender_oid AS last_sender_oid,
        lm.created_at AS last_message_at,
        COALESCE(unread.cnt, 0) AS unread_count
      FROM public.theo_chat_threads t
      LEFT JOIN public.theo_chat_thread_members mem
        ON mem.thread_id = t.id AND mem.member_oid = $1
      LEFT JOIN LATERAL (
        SELECT m.seq, m.body, m.sender_oid, m.created_at
        FROM public.theo_chat_messages m
        WHERE m.thread_id = t.id
        ORDER BY m.seq DESC
        LIMIT 1
      ) lm ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::bigint AS cnt
        FROM public.theo_chat_messages m2
        WHERE m2.thread_id = t.id
          AND m2.seq > COALESCE(mem.last_read_seq, 0)
          AND m2.sender_oid <> $1
      ) unread ON true
      WHERE $1 = ANY (t.member_oids)
      ORDER BY t.updated_at DESC
      LIMIT 1000
      `,
      [oid]
    );

    const threads = rows.rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      name: r.name,
      member_oids: r.member_oids,
      created_by: r.created_by,
      dm_key: r.dm_key,
      created_at: r.created_at,
      updated_at: r.updated_at,
      last_read_seq: Number(r.last_read_seq),
      unread_count: Number(r.unread_count),
      last_message: r.last_seq == null ? null : {
        seq: Number(r.last_seq),
        body: r.last_body,
        sender_oid: r.last_sender_oid,
        created_at: r.last_message_at,
      },
    }));

    return send(context, 200, successBody({ threads }));
  } catch (err) {
    context.log.error("theo_chat_list_threads failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list conversations.", 403));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

**§FJ.4 — `theo_chat_list_threads.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_chat_list_threads"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### §HG.5 — `theo_chat_list_messages` (GREENFIELD)

Seq-cursor paged message history; membership-gated (404 for non-participants).

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

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
    const params = [threadId];
    let where = `thread_id = $1`;
    if (before != null) { params.push(before); where += ` AND seq < $${params.length}`; }
    params.push(limit);
    const rows = await client.query(
      `SELECT id, thread_id, seq, sender_oid, body, created_at
       FROM public.theo_chat_messages
       WHERE ${where}
       ORDER BY seq DESC
       LIMIT $${params.length}`,
      params
    );

    const ordered = rows.rows.slice().reverse();
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

**§FJ.5 — `theo_chat_list_messages.function.json`**

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

### §HG.6 — `theo_chat_send_message` (GREENFIELD)

Atomic per-thread seq assignment (retry on race) → persist + bump thread → best-effort publish to the thread's Web PubSub group.

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const MAX_BODY = 8000;

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
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'body' is required and must be non-empty.", 400));
  }
  if (text.length > MAX_BODY) {
    return send(context, 400, errorBody("PAYLOAD_TOO_LARGE", `Message exceeds ${MAX_BODY} characters.`, 400));
  }

  let client = null;
  let saved = null;
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

    // Insert with the next per-thread seq computed atomically in the INSERT…SELECT; the UNIQUE(thread_id,
    // seq) guards against a concurrent sender — retry a few times on a 23505 race, then bump the thread.
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages (thread_id, seq, sender_oid, body)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3 FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at
          `,
          [threadId, oid, text]
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

**§FJ.6 — `theo_chat_send_message.function.json`**

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

### §HG.7 — `theo_chat_mark_read` (GREENFIELD)

Monotonic `last_read_seq` upsert (`GREATEST`) for unread tracking.

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
  // seq to mark read up to (inclusive). Strict-regex before parseInt.
  const rawSeq = body.seq != null ? String(body.seq).trim() : "";
  if (!/^[0-9]+$/.test(rawSeq)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'seq' is required and must be a non-negative integer.", 400));
  }
  const seq = parseInt(rawSeq, 10);

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

    // Membership gate — not a participant → 404.
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Upsert the caller's read state; never move last_read_seq backwards (GREATEST). The member INSERT/UPDATE
    // RLS policies restrict this to the caller's own row within a thread they belong to.
    const upd = await client.query(
      `
      INSERT INTO public.theo_chat_thread_members (thread_id, member_oid, last_read_seq)
      VALUES ($1, $2, $3)
      ON CONFLICT (thread_id, member_oid)
      DO UPDATE SET last_read_seq = GREATEST(public.theo_chat_thread_members.last_read_seq, EXCLUDED.last_read_seq)
      RETURNING thread_id, member_oid, last_read_seq
      `,
      [threadId, oid, seq]
    );

    return send(context, 200, successBody({ read_state: upd.rows[0] }));
  } catch (err) {
    context.log.error("theo_chat_mark_read failed", err);
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

**§FJ.7 — `theo_chat_mark_read.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_mark_read"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §PARITY — Structural mirror parity

- **Boilerplate reuse (EXACT):** all 7 handlers reuse the Primary Reference's `send`/`nowIso`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`buildKnownError`/`isUuid` helpers and the `pg` Pool construction verbatim. CORS methods differ only by GET vs POST per endpoint.
- **Auth idiom (EXACT):** set_config triad + `x-ms-client-principal` OID extraction + anonymous `httpTrigger` binding (with explicit `route`), identical to `theo_share_project` / its function.json ("httpTrigger").
- **ALLOWED DELTA (participant-scope):** predicate `auth.uid() = ANY(member_oids)` in place of `created_by = auth.uid()` — a cited extension of the ownership family (Architecture §5.2 "Default family: ownership-based"); SELECT/INSERT/UPDATE scoped, self-contained, non-recursive.
- **DEVIATION (Web PubSub):** `theo_chat_negotiate` + `theo_chat_send_message` add the `@azure/web-pubsub` server SDK — the single new external system, justified in §P3 (Walter directive + provisioned infra + server-SDK research), isolated to `vaultgpt-func-chat`.

## §DEPLOY (Walter, Pass 3)

All steps target **`vaultgpt-func-chat`** (NEVER the monolith or the sidecar).

1. **Migration:** run `vc1_chat_migration.sql` against `vaultgpt-postgres-prod` as `pgadmin_vault` (creates 3 tables + indexes + participant-scoped RLS policies; additive/idempotent).
2. **Verify:** run `vc1_chat_verify.sql` (read-only) — confirm 3 tables with `rls_enabled = true`, expected columns, the `dm_key` unique-partial + `member_oids` gin + `messages(thread_id,seq)` indexes, and the policy set (threads select/insert/update; members select/insert/update/delete; messages select/insert).
3. **Dependency:** ensure the chat app has `@azure/web-pubsub` and `pg` in its deployed `node_modules` (add to the chat app's `package.json` if not already present; `npm install` in Kudu CMD per the pinning discipline).
4. **Deploy handlers:** create/redeploy the 7 functions (`theo_chat_negotiate` / `theo_chat_create_dm` / `theo_chat_create_channel` / `theo_chat_list_threads` / `theo_chat_list_messages` / `theo_chat_send_message` / `theo_chat_mark_read`), each as `<name>/index.js` + `<name>/function.json`.
5. **Confirm settings:** `WebPubSubConnectionString` present (VC-1a) and the libpq `PG*` env present; EasyAuth (authV2) enabled; CORS allows the vault-origin SWA origins.
6. **Restart** the chat app; confirm the 7 functions are listed and healthy.

## §CURL (Claude Code golden verification, post-deploy)

Run by Claude Code after Walter confirms deploy. Bearer via `az account get-access-token` for the chat app's audience (`api://4e1a1e31-…`); tokens never printed. Deterministic scenarios:

1. **Negotiate (200):** `GET /api/theo_chat_negotiate` → `{ data: { url, hub:"vaultchat", groups:[…] } }`; assert `url` is a `wss://` Web PubSub client URL and `hub === "vaultchat"`.
2. **Create DM (201 then 200 idempotent):** `POST /api/theo_chat_create_dm { peer_oid }` → 201 `created:true`; repeat → 200 `created:false` with the same `thread.id`.
3. **Create channel (201):** `POST /api/theo_chat_create_channel { name, member_oids:[peer] }` → 201; assert caller ∈ `thread.member_oids` and `kind==="channel"`.
4. **Send (201) + seq:** `POST /api/theo_chat_send_message { thread_id, body:"hello" }` → 201 `message.seq===1`; second send → `seq===2`.
5. **List messages (200 paged):** `GET /api/theo_chat_list_messages?threadId=…&limit=1` → newest-cursor page; assert `page.has_more` + `page.next_before` behave.
6. **List threads (200 unread):** `GET /api/theo_chat_list_threads` → the DM + channel present, `unread_count` reflects unsent-by-caller messages, `last_message` populated.
7. **Mark read (200 monotonic):** `POST /api/theo_chat_mark_read { thread_id, seq:2 }` → `last_read_seq===2`; re-post `seq:1` → still `2` (GREATEST).
8. **Not-a-participant (404):** a second identity calling `list_messages`/`send_message` on a thread it doesn't belong to → 404 `NOT_FOUND` (no existence leak).
9. **Validation (400):** `send_message` with empty `body`, `list_messages?threadId=not-a-uuid`, `mark_read` with `seq:"1.5"` → 400 each.

*End of Pass 1 Backend VEP.*
