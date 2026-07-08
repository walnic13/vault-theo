# Theo 1B — VC-11 Reply-to-Message Backend (migration `theo_chat_messages.reply_to_message_id` + `send_message` accepts a reply target + `list_messages` returns the quoted parent) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). **Walter runs the migration at Pass 3 FIRST**, then Claude Code deploys the two modified handlers to the **dedicated `vaultgpt-func-chat`** app (§1E / DR-T7) + runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 + Schema deltas. Plan-only.
>
> **Scope (VC-11 = first of the message-actions trio VC-11 reply / VC-12 delete / VC-13 forward):** (1) a **migration** adding `theo_chat_messages.reply_to_message_id uuid NULL` (self-FK, `ON DELETE SET NULL`); (2) MODIFY `theo_chat_send_message` to accept an optional `reply_to_message_id`, validate it is a message **in the same thread**, persist it, and return/publish an enriched `reply_to` preview; (3) MODIFY `theo_chat_list_messages` to return each message's `reply_to` quoted-parent preview (`null` when not a reply).
>
> **Why no RLS change:** the deployed `theo_chat_message_insert` policy is `WITH CHECK (sender_oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)))` — column-agnostic, so adding one column to an INSERT the caller is already authorized to make does not touch the policy. Messages remain immutable (no UPDATE/DELETE policy). Same-thread integrity of the reply pointer is enforced in the handler.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `0c95e02e9d76a5649341591e34ff564eb7da39e2` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-11 reply-to-message. P1–P8 walked; additive+reversible migration (`reply_to_message_id` self-FK, `ON DELETE SET NULL`) with verify SQL; Primary Reference = the DEPLOYED `theo_chat_send_message` (the handler being modified) inlined byte-verbatim (pre-modification) + its function.json; two MODIFY handlers (`send_message`, `list_messages`) inlined full; unchanged function.json bindings included. No RLS change (justified in §P8). No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
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
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` row — the new column; §8 immutable-message note) | `grep -F "Immutable — no"` this turn | `a944639a3b7268332954e3cb3669c7d23a64a003` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 chat contract — `read / send messages` row lands the reply delta at Pass 4) | `grep -F "read / send messages"` this turn | `07b061022c34fcc9b08ac3b13191caeb441fa98a` |
| 10 | **Primary Reference handler** (deployed message send — the handler being modified) — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.index.js` | `Read(full)` this turn; deployed get-back byte-matches | `483a0b4dfbeeff882b5d73055914f76e8024601a` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.function.json` | `Read(full)` this turn | `0284d265cd81bec4c34b5513d46c41b7ba6601ff` |
| 12 | **Modified handler basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_list_messages.index.js` (the other handler modified) | `Read(full)` this turn; deployed get-back byte-matches | `28b02e928c8f346d20b077b10f60d69d79d1d964` |
| 13 | **RLS basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (`theo_chat_message_insert` WITH CHECK — column-agnostic; messages immutable) | `Read(full)`/`sed` this turn; cited | `67ff9b5f654e146c01590d9ce0f9286969e54103` |

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
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_send_message` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — no new external system |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — VC-11 touches only `theo_chat_*`; no `reporting_*` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — participant-scoped set is an ownership-family extension; no RLS change |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Immutable — no `updated_at`, no UPDATE/DELETE policy" | §P6 / §P8 — a reply is a normal INSERT; messages stay immutable |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | §API-SPEC — the reply delta lands on this row |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.1 — the modified handler keeps the deployed set_config triad |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql | insert policy | "theo_chat_message_insert" | §P8 — the column-agnostic INSERT WITH CHECK is unchanged |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.function.json | binding | "httpTrigger" | §SM-FJ — anonymous httpTrigger binding (EasyAuth gates identity) |

## P1 — Feature identification
**Microstep:** VC-11 — the first of the message-actions trio: a message may **quote-reply** to an earlier message in the **same thread** (WhatsApp-style). The reply persists a pointer to its parent; the send response, the realtime publish, and `list_messages` all carry a bounded `reply_to` preview so the quoted message renders identically on the live path and on cold load.

**Migration:** `theo_chat_messages.reply_to_message_id uuid NULL` — self-FK → `theo_chat_messages(id)` `ON DELETE SET NULL`.
**Modified handlers (2), on `vaultgpt-func-chat`:** `POST /api/theo_chat_send_message` `{ thread_id, body, reply_to_message_id? }`; `GET /api/theo_chat_list_messages?threadId=…` (adds `reply_to` to each message).

**Out of scope (VC-11):** the FE (reply affordance + quoted-message rendering = vault-origin **VC-11-FE**); message **delete** (VC-12) and **forward** (VC-13); threaded/nested reply views (v1 is a single-level quote); editing a message; cross-thread replies (explicitly rejected — a reply target must be in the same thread).

**Plan status:** VC tier Walter-directed, reconciled at VC-1 ("sharing/membership RLS models (ownership-only unless Walter authorizes)"). Doc delta = API-Spec §2.10 `read / send messages` row + Schema `theo_chat_messages.reply_to_message_id` (Role-C, Pass 4).

## P2 — Architecture & boundary reconciliation
**Handler family.** Both modified handlers remain Family-B HTTP handlers identical in shape to the Primary Reference (`theo_chat_send_message`): `pg` Pool on the chat app's libpq `PG*` env; EasyAuth `x-ms-client-principal` OID; validate-before-SQL; `set_config` triad; participant predicate; `{data,meta}`/`{error}` envelope; anonymous `httpTrigger`. The only new logic is: (send) parse + UUID-validate an optional `reply_to_message_id`, verify it names a message in the same thread (yielding the preview columns), include it in the INSERT and the returned/published `reply_to`; (list) a `LEFT JOIN LATERAL` to the parent for the same `reply_to` preview.
**Boundary.** Reads/writes only `theo_chat_*`. Per Golden §3 ("It MUST NOT read or write" outside its domain) no `reporting_*`/monolith/Blob/Graph/Foundry. Deploy target `vaultgpt-func-chat`; monolith + sidecar READ-ONLY.
**Validation before SQL.** UUID `thread_id` (existing) and, when present, UUID `reply_to_message_id` — deterministic 400 before any SQL.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| API-Spec §2.10 + Schema §3 will change (the `reply_to` request/response fields; the new column). | Documentation-currency delta on the recorded VC tier. | **PROCEED** with a Role-C (Pass 4): `spec/THEO_API_SPEC.md` §2.10 `read / send messages` row + `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 `theo_chat_messages` (+ the reply pointer). Sequenced after Pass 3 deploy + curls. |
| A reply's parent could later be deleted (VC-12). | VC-12 is planned as a **soft** delete (the row persists as a tombstone), so the `ON DELETE SET NULL` FK will not normally fire — the reply keeps pointing at the parent and the FE renders "message deleted" from the tombstone. `SET NULL` is a defensive fallback for any future hard delete (reply degrades to no-quote, never blocks). | **PROCEED** — forward-compatible by design; VC-12 decides the tombstone rendering. |
| No realtime edit of an already-delivered quote. | The `reply_to` preview is a point-in-time snapshot (bounded to 200 chars); if a parent's body ever changed it would not retro-update in already-rendered quotes. Messages are immutable, so this cannot happen in v1. | **PROCEED** — moot under message immutability. |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**No new external system in VC-11.** `send_message` retains its existing best-effort Web PubSub publish (unchanged binding/shape besides the enriched `message.reply_to`). Per Golden §4 a "new-domain or new-external-system helper" would need justification; VC-11 introduces none — pure Postgres over `theo_chat_*` plus the pre-existing publish.

## P4 — Contract reconciliation
Envelope unchanged (`{data,meta}`/`{error}`).
- `theo_chat_send_message` `{ thread_id, body, reply_to_message_id? }` → `201 { message }` where `message` now includes `reply_to_message_id` (uuid|null) and `reply_to` (`{ id, seq, sender_oid, body }` preview | null). A normal (non-reply) send is byte-compatible with today plus two null fields.
- `theo_chat_list_messages` → `200 { messages: [{ …, reply_to_message_id, reply_to }], page }` — each message gains `reply_to_message_id` + the `reply_to` preview (null when not a reply).
- The realtime `{ type:"message", … , message }` payload carries the same enriched `message`.
Malformed input → 400; non-participant of the target thread → 404; `reply_to_message_id` not a message in this thread → 400.

## P5 — Error-model reconciliation
Mirrors the Primary Reference: 401 (no identity) / 400 (bad JSON, bad `thread_id` UUID, blank/oversized body, bad `reply_to_message_id` UUID, or reply target not in this thread — `isKnown`) / 404 (non-participant, `isKnown`) / 409 (seq exhaustion, unchanged) / 403 (`42501`) / else 500. `isKnown` errors re-map verbatim; the `23514` field-constraint → 400 path is unchanged.

## P6 — Data-shape reconciliation
One additive column: `theo_chat_messages.reply_to_message_id uuid NULL` (self-FK, `ON DELETE SET NULL`). No new table; no new index (the preview resolves by parent **primary key**, `reply_to_message_id → id`). The message row is still **"Immutable — no `updated_at`, no UPDATE/DELETE policy"** — a reply is an ordinary INSERT that merely carries one more column. Full DDL in §MIGRATION.

## P7 — Idempotency / concurrency
- The reply pointer does not change the send path's concurrency posture: the same atomic `INSERT … SELECT COALESCE(MAX(seq),0)+1` with `UNIQUE(thread_id, seq)` retry-on-`23505` is preserved verbatim (only the column list + one bound param `$4` are added).
- The same-thread reply check is a read inside the request; the parent is validated to exist in the thread before the INSERT. If the (immutable) parent exists it cannot vanish mid-request; there is no lock needed because nothing about the parent is mutated.
- `list_messages` is a pure read; the `LATERAL` join adds no write and no ordering change (still `ORDER BY m.seq DESC`, reversed for display).

## P8 — Security / RLS reconciliation
**No RLS change — the deployed policy is column-agnostic.** The `theo_chat_message_insert` policy is `WITH CHECK (sender_oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)))`. Adding `reply_to_message_id` to the INSERT column list does not alter what the policy evaluates — the caller is already authorized to insert into that thread as themselves. `theo_chat_message_select` (participant-scoped) already governs both the inserted message and the `LATERAL` parent read, so the quoted preview can only ever surface a message the caller may already read. The participant-scoped set is an ownership-family extension ("Default family: ownership-based"); VC-11 introduces no new elevated-read class and no `SECURITY DEFINER` helper.
**Same-thread integrity (defence in depth).** The FK guarantees `reply_to_message_id` references a real message; the handler additionally requires that message be in the **same thread** (`WHERE id = $reply AND thread_id = $thread`) so a reply can never quote a message from another conversation, even one the caller can read. A cross-thread or non-existent target → deterministic 400.
**set_config triad** preserved (`"set_config('app.current_user_id'"`). **No leakage** — the preview is bounded to 200 chars and carries only fields the caller may already read; no tokens/URLs.

## §MIGRATION — `vc11_reply_migration.sql` (additive + reversible; run by Walter at Pass 3 BEFORE the handler deploy)

Additive, idempotent (`ADD COLUMN IF NOT EXISTS`), reversible. No top-level transaction control (Golden §5.2); Walter executes. `-- label` comments only.

```sql
-- Theo VC-11 — reply-to-message. ADDITIVE + REVERSIBLE. Run by Walter at Pass 3 BEFORE the VC-11
-- handler deploy. ONE addition: theo_chat_messages.reply_to_message_id (a self-referential nullable
-- pointer to the message being replied to). Idempotent; safe to re-run.
--
-- Design notes:
--  * The column is a self-FK to theo_chat_messages(id). ON DELETE SET NULL is DEFENSIVE: messages are
--    immutable today (no UPDATE/DELETE policy) and VC-12 delete is planned as a SOFT delete (the row
--    persists as a tombstone), so SET NULL will not normally fire — a reply keeps pointing at its parent
--    (the FE renders "message deleted" from the tombstone). Should any future HARD delete ever remove a
--    parent, replies degrade gracefully to "no quote" rather than blocking the delete.
--  * NO RLS change. The existing theo_chat_message_insert policy
--    WITH CHECK (sender_oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads
--    WHERE auth.uid() = ANY (member_oids))) is column-agnostic and still holds — reply_to_message_id is
--    just another column on an INSERT the caller is already authorized to make. Same-thread integrity of
--    the pointer is enforced in the handler (a reply may only target a message in the same thread).
--  * NO new index: the reply preview is fetched by parent PK (reply_to_message_id -> id), a primary-key
--    lookup that needs no index on the child column.

ALTER TABLE public.theo_chat_messages
  ADD COLUMN IF NOT EXISTS reply_to_message_id uuid NULL
  REFERENCES public.theo_chat_messages(id) ON DELETE SET NULL;
```

**Read-only verification (run after the migration):**

```sql
-- Theo VC-11 — read-only verification (run after vc11_reply_migration.sql). SELECT-only.

-- V1) the column exists, is uuid, nullable.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_chat_messages' AND column_name = 'reply_to_message_id';

-- V2) the self-FK exists with ON DELETE SET NULL.
SELECT con.conname, con.confdeltype
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace n ON n.oid = rel.relnamespace
WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
  AND con.contype = 'f' AND pg_get_constraintdef(con.oid) ILIKE '%reply_to_message_id%';
-- confdeltype 'n' = SET NULL.
```

## §SM — Primary Reference (deployed `theo_chat_send_message.index.js`, byte-verbatim — the handler VC-11 modifies)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the DEPLOYED **`theo_chat_send_message`** (pre-modification) — the exact handler VC-11 modifies, showing the pattern the change preserves: the set_config triad, the membership gate (404), the atomic seq assignment with `23505` retry, the best-effort Web PubSub publish, and the `{data,meta}`/`{error}` envelope. Blob `483a0b4dfbeeff882b5d73055914f76e8024601a` (deployed get-back byte-matches):

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

### §SM-FJ — Primary Reference function.json (deployed `theo_chat_send_message.function.json`, byte-verbatim)

Blob `0284d265cd81bec4c34b5513d46c41b7ba6601ff` (unchanged by VC-11 — the route/methods are identical):

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

## §HG.1 — `theo_chat_send_message` (MODIFY: accept + persist + return a reply target)

Delta vs the Primary Reference: (a) `REPLY_PREVIEW_MAX = 200` + a `replyPreview()` shaper; (b) parse + UUID-validate optional `reply_to_message_id`; (c) after the membership gate, when a reply target is present, `SELECT id, seq, sender_oid, body FROM theo_chat_messages WHERE id = $reply AND thread_id = $thread` — 0 rows → 400 (same-thread integrity), else build the preview; (d) the INSERT column list + `RETURNING` gain `reply_to_message_id` and one bound param `$4`; (e) `saved.reply_to` is attached and flows into both the 201 response and the publish. Everything else (seq retry, publish, error map) is byte-identical. Full — file `theo_chat_send_message.index.js`:

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
function replyPreview(row) {
  if (!row) return null;
  return {
    id: row.id,
    seq: Number(row.seq),
    sender_oid: row.sender_oid,
    body: typeof row.body === "string" ? row.body.slice(0, REPLY_PREVIEW_MAX) : row.body,
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
    if (replyToId) {
      const p = await client.query(
        `SELECT id, seq, sender_oid, body FROM public.theo_chat_messages WHERE id = $1 AND thread_id = $2`,
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
    // as list_messages (null for a normal message).
    saved.reply_to = parentPreview;

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

### §HG.1-FJ — `theo_chat_send_message.function.json` (UNCHANGED)
Byte-identical to §SM-FJ (route/methods unchanged); included for the deploy pair.

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

## §HG.2 — `theo_chat_list_messages` (MODIFY: return the quoted-parent `reply_to` preview)

Delta vs deployed: `REPLY_PREVIEW_MAX = 200`; the SELECT aliases `m.` and gains `m.reply_to_message_id` + a `LEFT JOIN LATERAL` fetching the parent (`pm.id/seq/sender_oid/body WHERE pm.id = m.reply_to_message_id AND pm.thread_id = m.thread_id`); rows are mapped to a shaped object with `reply_to` (null when `p_id` is null). Cursor/paging/gate all unchanged. Full — file `theo_chat_list_messages.index.js`:

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
    // VC-11: LEFT JOIN LATERAL the replied-to parent (same thread → RLS-visible) for the quote preview;
    // p.id IS NULL when the message is not a reply (or the parent is no longer resolvable).
    const params = [threadId];
    let where = `m.thread_id = $1`;
    if (before != null) { params.push(before); where += ` AND m.seq < $${params.length}`; }
    params.push(limit);
    const rows = await client.query(
      `SELECT m.id, m.thread_id, m.seq, m.sender_oid, m.body, m.created_at, m.reply_to_message_id,
              p.id AS p_id, p.seq AS p_seq, p.sender_oid AS p_sender_oid, p.body AS p_body
       FROM public.theo_chat_messages m
       LEFT JOIN LATERAL (
         SELECT pm.id, pm.seq, pm.sender_oid, pm.body
         FROM public.theo_chat_messages pm
         WHERE pm.id = m.reply_to_message_id AND pm.thread_id = m.thread_id
         LIMIT 1
       ) p ON true
       WHERE ${where}
       ORDER BY m.seq DESC
       LIMIT $${params.length}`,
      params
    );

    // Shape each row: the message plus a `reply_to` preview (null when not a reply). Matches send_message.
    const shaped = rows.rows.map((r) => ({
      id: r.id,
      thread_id: r.thread_id,
      seq: Number(r.seq),
      sender_oid: r.sender_oid,
      body: r.body,
      created_at: r.created_at,
      reply_to_message_id: r.reply_to_message_id,
      reply_to: r.p_id == null ? null : {
        id: r.p_id,
        seq: Number(r.p_seq),
        sender_oid: r.p_sender_oid,
        body: typeof r.p_body === "string" ? r.p_body.slice(0, REPLY_PREVIEW_MAX) : r.p_body,
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

## §API-SPEC — Role-C (Pass 4) documentation delta
`spec/THEO_API_SPEC.md` §2.10 **`read / send messages`** row: `list_messages` messages gain `reply_to_message_id` + a `reply_to: { id, seq, sender_oid, body }` (bounded 200-char) preview (null when not a reply); `send_message` accepts an optional `reply_to_message_id` and returns the same enriched `message`; a `reply_to_message_id` that is not a message in the same thread → **400**. `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 `theo_chat_messages` row gains `reply_to_message_id uuid NULL` (self-FK, `ON DELETE SET NULL`). Authored as a Role-C handoff after Pass-3 deploy + curls.

## §DEPLOY — Pass 3 (Walter migration FIRST, then Claude Code deploy to `vaultgpt-func-chat`)
1. **Walter** runs `vc11_reply_migration.sql` + the verify SQL (column + self-FK must exist before deploy).
2. **Claude Code** overwrites `theo_chat_send_message/index.js` + `theo_chat_list_messages/index.js` on `vaultgpt-func-chat` via Kudu VFS surgical PUT (ARM bearer; no token logged); function.json unchanged (no new function → no restart needed for registration, but restart to drop the warm module cache). Baseline get-back captured before overwrite; post-deploy get-back byte-matches this pack.

## §CURL — post-deploy verification (Claude Code; az-login token for `api://4e1a1e31-…`; structural only — no OIDs/bodies)
- `POST send_message` with `reply_to_message_id:"nope"` → **400** (UUID guard).
- `POST send_message` with a well-formed but non-existent `reply_to_message_id` (in a real, disposable thread the caller owns) → **400** (not a message in this thread).
- `POST send_message` normal (no reply) → **201**, `message.reply_to_message_id = null`, `message.reply_to = null` (back-compat).
- `POST send_message` replying to a real message in the same disposable thread → **201**, `message.reply_to` preview present + correct `seq`/`sender_oid`.
- `GET list_messages` on that thread → **200**, the reply carries `reply_to`; a normal message carries `reply_to: null`.
- `POST send_message` bad `thread_id` → **400**; non-participant thread → **404** (regression).

## §SM-NOTE — structural mirror
Both modified handlers are byte-for-byte the deployed Primary Reference pattern plus the additive reply logic described in §HG.1/§HG.2; no shared helper, envelope, or error-map drift. `node --check` clean on both.

## Requested Pass 2 verdict
**APPROVED** or **REJECTED** only. On APPROVED: Walter runs the migration, Claude Code deploys the two overwrites + curls, then the Role-C (Pass 4) + VC-11-FE.
