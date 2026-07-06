# Theo 1B — VC-13 Forward-a-Message Backend (migration `theo_chat_messages.forwarded_from_message_id` + new `theo_chat_forward_message` + `list_messages`/`send_message` `forwarded` projection) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). **Walter runs the migration at Pass 3 FIRST**, then Claude Code deploys to the **dedicated `vaultgpt-func-chat`** app (§1E / DR-T7) + runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 + Schema deltas. Plan-only.
>
> **Scope (VC-13 = the forward piece of the message-actions trio VC-11 reply / VC-12 delete / VC-13 forward):** a participant **forwards** a message they can see into another thread they belong to; the copy is marked "Forwarded". (1) a **migration** adding `theo_chat_messages.forwarded_from_message_id uuid NULL` (self-FK, `ON DELETE SET NULL`); (2) NEW `theo_chat_forward_message` (`{ message_id, to_thread_id }` — reads the source under RLS, copies its body server-side into the target thread); (3) MODIFY `theo_chat_list_messages` + `theo_chat_send_message` to carry a `forwarded` **boolean** on every message.
>
> **Privacy + auth:** the source is read under RLS, so a caller can only forward a message they can already see; the body is copied server-side (not client-supplied); the raw `forwarded_from_message_id` (which points into the source thread) is NEVER projected to clients — only the derived `forwarded` boolean is. No RLS change (the `theo_chat_message_insert` `WITH CHECK` is column-agnostic and independently enforces the caller belongs to the target thread).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `0b2319789b09c04169eddc375fde9b25522c7941` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-13 forward-a-message. P1–P8 walked; additive+reversible migration (`forwarded_from_message_id` self-FK, `ON DELETE SET NULL`) with verify SQL; Primary Reference = the DEPLOYED `theo_chat_send_message` (VC-12) inlined byte-verbatim + its function.json; one NEW handler (forward) + two MODIFY (`list_messages` projects `forwarded`, `send_message` carries `forwarded:false`) inlined full; the forward reads the source under RLS + copies its body. No RLS change (justified §P8). No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
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
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` row — the new column) | `grep -F "Message within a chat thread"` this turn | `66e8908b40019e406449192dd26b8f6a2c9c5243` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row — the forward route + `forwarded` land at Pass 4) | `grep -F "read / send messages"` this turn | `97885afd31b5ce84d9095bc674b33529c63db67e` |
| 10 | **Primary Reference handler** (deployed message send — insert+seq+publish the forward mirrors) — `Codex Governance/Theo-1B-VC12-Delete-Message-Backend-Pass-1-VEP/theo_chat_send_message.index.js` | `Read(full)` this turn; deployed get-back byte-matches | `a8cafbcf9e411cde5b2da304fcd19b7f771ef7b1` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-VC12-Delete-Message-Backend-Pass-1-VEP/theo_chat_send_message.function.json` | `Read(full)` this turn | `0284d265cd81bec4c34b5513d46c41b7ba6601ff` |
| 12 | **Modify basis** — deployed VC-12 `theo_chat_list_messages.index.js` (the `forwarded` projection extends this) | `Read(full)` this turn; deployed get-back byte-matches | `05dacd0130bd4f394196a7d9d47db75222e4322e` |
| 13 | **RLS basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (`theo_chat_message_insert` WITH CHECK — column-agnostic + target-membership enforced) | `Read(full)`/`sed` this turn; cited | `67ff9b5f654e146c01590d9ce0f9286969e54103` |

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
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — VC-13 touches only `theo_chat_*`; no `reporting_*` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — participant-scoped forward is an ownership-family extension; no RLS change |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Message within a chat thread" | §P6 — the `theo_chat_messages` row gains one nullable column; a forward is a normal INSERT of a new row |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | §API-SPEC — the forward delta lands on this row |
| Codex Governance/Theo-1B-VC12-Delete-Message-Backend-Pass-1-VEP/theo_chat_send_message.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.1 — the forward handler keeps the deployed set_config triad |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql | insert policy | "theo_chat_message_insert" | §P8 — the column-agnostic INSERT WITH CHECK enforces target membership; unchanged |
| Codex Governance/Theo-1B-VC12-Delete-Message-Backend-Pass-1-VEP/theo_chat_send_message.function.json | binding | "httpTrigger" | §SM-FJ — anonymous httpTrigger binding (EasyAuth gates identity) |

## P1 — Feature identification
**Microstep:** VC-13 — the forward piece of the message-actions trio: a participant **forwards** a message they can see into another thread they belong to (WhatsApp-style). The forwarded copy carries a "Forwarded" marker; the body is copied server-side from the RLS-visible source.

**Migration:** `theo_chat_messages.forwarded_from_message_id uuid NULL` — self-FK → `theo_chat_messages(id)` `ON DELETE SET NULL`.
**New handler (1), on `vaultgpt-func-chat`:** `POST /api/theo_chat_forward_message` `{ message_id, to_thread_id }`.
**Modified (2):** `theo_chat_list_messages` + `theo_chat_send_message` — carry a `forwarded` boolean on each message.

**Out of scope (VC-13):** the FE (a "Forward" affordance + target-thread picker + "Forwarded" label = vault-origin **VC-13-FE**); forwarding to multiple threads at once (v1 is one target); forwarding attachments (VC-9); exposing the origin thread/sender (privacy — only a boolean); a source-preview quote in the target.

**Plan status:** VC tier Walter-directed, reconciled at VC-1 ("sharing/membership RLS models (ownership-only unless Walter authorizes)"). Doc delta = API-Spec §2.10 `read / send messages` row + Schema §3 `theo_chat_messages.forwarded_from_message_id` (Role-C, Pass 4).

## P2 — Architecture & boundary reconciliation
**Handler family.** `theo_chat_forward_message` is a Family-B HTTP handler byte-for-byte mirroring the Primary Reference (`theo_chat_send_message`): `pg` Pool; EasyAuth OID; validate-before-SQL; `set_config` triad; the atomic `INSERT … SELECT COALESCE(MAX(seq),0)+1` with `23505` retry; best-effort Web PubSub publish; `{data,meta}`/`{error}` envelope; anonymous `httpTrigger`. The only new logic: it first reads the SOURCE message under RLS (404 if not visible; 400 if the source is deleted), verifies target membership, and copies the source body into the target thread with `forwarded_from_message_id` set. The two MODIFY handlers add only the `forwarded` boolean to their deployed VC-12 selves.
**Boundary.** Reads/writes only `theo_chat_*`. Per Golden §3 ("It MUST NOT read or write" outside its domain) no `reporting_*`/monolith/Blob/Graph/Foundry. Deploy target `vaultgpt-func-chat`; monolith + sidecar READ-ONLY.
**Validation before SQL.** UUID `message_id` + `to_thread_id` → deterministic 400 before any SQL.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| API-Spec §2.10 + Schema §3 will change (the forward route; the `forwarded` field; the new column). | Documentation-currency delta on the recorded VC tier. | **PROCEED** with a Role-C (Pass 4): `spec/THEO_API_SPEC.md` §2.10 `read / send messages` row + `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3. Sequenced after Pass 3 deploy + curls. |
| Forwarding copies the source BODY into the target (no live link to the origin). | Deliberate — the target participants may not be able to read the origin thread; a copy + a `forwarded` marker is the WhatsApp idiom. Provenance (`forwarded_from_message_id`) is stored but never exposed. | **PROCEED** — copy-by-value + boolean marker only. |
| A `forwarded_from_message_id` FK across threads. | It records the origin (for future audit) with `ON DELETE SET NULL`; it is NEVER projected to clients (list/send/forward expose only `forwarded`), so a target participant cannot resolve or read the origin. | **PROCEED** — justified + privacy-scoped in §P8. |
| Forwarding a since-deleted message. | The handler rejects a tombstoned source (`deleted_at` set) with **400** — its body is null, nothing to forward. | **PROCEED** — explicit 400. |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**No new external system in VC-13.** The forward handler reuses the existing best-effort Web PubSub publish (a `{ type:"message" }` event to the TARGET thread's group). Per Golden §4 a "new-domain or new-external-system helper" would need justification; VC-13 introduces none — pure Postgres over `theo_chat_*` + the pre-existing publish.

## P4 — Contract reconciliation
Envelope unchanged (`{data,meta}`/`{error}`).
- `theo_chat_forward_message` `{ message_id, to_thread_id }` → `201 { message }` where `message` has the full projection + `forwarded:true` (and `reply_to:null`, `deleted:false`). Published to the target thread's group.
- `theo_chat_list_messages` / `theo_chat_send_message` → each message now also carries `forwarded` (bool; the raw origin id is never exposed).
Malformed input → 400; source not visible/not found → 404; source is deleted → 400; target not a participant → 404.

## P5 — Error-model reconciliation
Mirrors the Primary Reference: 401 / 400 (bad JSON, bad `message_id`/`to_thread_id` UUID, deleted source — `isKnown`) / 404 (source not visible, or target not a participant — `isKnown`) / 409 (seq exhaustion) / 403 (`42501`) / else 500. `isKnown` errors re-map verbatim; the `23514` field-constraint → 400 path is preserved.

## P6 — Data-shape reconciliation
One additive column: `theo_chat_messages.forwarded_from_message_id uuid NULL` (self-FK, `ON DELETE SET NULL`). No new table/index. A forward is an ordinary **INSERT of a NEW row** — it does not mutate the source (the only row-mutation on `theo_chat_messages` is VC-12's sender-scoped soft-delete, unrelated here). The API exposes a `forwarded` boolean derived from the column; the raw id is not projected. Full DDL in §MIGRATION.

## P7 — Idempotency / concurrency
- Forward is NOT idempotent (each call creates a new copy — like a normal send). The INSERT uses the same atomic `INSERT … SELECT COALESCE(MAX(seq),0)+1` + `23505` retry as `send_message`.
- The source read + target-membership check are ordinary reads inside the request; the source is immutable-of-content (a tombstone is rejected up front), so nothing about it can change mid-request in a way that matters.
- `list_messages` is a pure read; the `forwarded` projection adds no write and no ordering change.

## P8 — Security / RLS reconciliation
**No RLS change — the deployed policy is column-agnostic + enforces both ends.** The forward INSERT is governed by the deployed `theo_chat_message_insert` policy `WITH CHECK (sender_oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)))` — so the caller can only insert into a target thread they belong to, as themselves; adding `forwarded_from_message_id` to the column list doesn't change what the policy evaluates. The SOURCE read rides `theo_chat_message_select` (participant-scoped) — a caller can only forward a message they can already see (a non-visible source → 404, no existence leak). No `SECURITY DEFINER`; no new elevated-read class. Participant-scoped forward is an ownership-family extension ("Default family: ownership-based").
**Cross-thread privacy.** `forwarded_from_message_id` points into the SOURCE thread; it is NEVER projected to clients — `list_messages`/`send_message`/`forward` expose only the derived `forwarded` boolean, so a target participant cannot resolve or read the origin. The forwarded body is a copy already authorised for the forwarder to read.
**No leakage.** The forward response/publish carry the standard message projection + `forwarded:true`; no tokens/URLs, no origin id.

## §MIGRATION — `vc13_forward_migration.sql` (additive + reversible; run by Walter at Pass 3 BEFORE the handler deploy)

Additive, idempotent (`ADD COLUMN IF NOT EXISTS`), reversible. No top-level transaction control (Golden §5.2); Walter executes. `-- label` comments only.

```sql
-- Theo VC-13 — forward-a-message. ADDITIVE + REVERSIBLE. Run by Walter at Pass 3 BEFORE the VC-13
-- handler deploy. ONE addition: theo_chat_messages.forwarded_from_message_id (a self-referential
-- nullable pointer to the ORIGINAL message a forward was copied from). Idempotent; safe to re-run.
--
-- Design notes:
--  * Self-FK to theo_chat_messages(id), ON DELETE SET NULL (the origin may later be deleted; a forward
--    keeps its own copied body regardless). Non-NULL only for a forwarded message.
--  * NO RLS change. The existing theo_chat_message_insert policy
--    WITH CHECK (sender_oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads
--    WHERE auth.uid() = ANY (member_oids))) is column-agnostic — a forward is an ordinary INSERT the
--    caller is authorized to make (as themselves, into a target thread they belong to).
--    theo_chat_forward_message reads the SOURCE message under RLS (so a caller can only forward a
--    message they can already see) and copies its body server-side.
--  * The API exposes only a `forwarded` BOOLEAN (= forwarded_from_message_id IS NOT NULL); the raw
--    origin id is NEVER projected to clients (it points into the source thread, which the target
--    participants may not be able to read — no cross-thread leak).
--  * NO new index: provenance is written on INSERT and read only as the boolean.

ALTER TABLE public.theo_chat_messages
  ADD COLUMN IF NOT EXISTS forwarded_from_message_id uuid NULL
  REFERENCES public.theo_chat_messages(id) ON DELETE SET NULL;
```

**Read-only verification (run after the migration):**

```sql
-- Theo VC-13 — read-only verification (run after vc13_forward_migration.sql). SELECT-only.

-- V1) the column exists, is uuid, nullable.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_chat_messages' AND column_name = 'forwarded_from_message_id';

-- V2) the self-FK exists with ON DELETE SET NULL (confdeltype 'n').
SELECT con.conname, con.confdeltype
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace n ON n.oid = rel.relnamespace
WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
  AND con.contype = 'f' AND pg_get_constraintdef(con.oid) ILIKE '%forwarded_from_message_id%';
```

## §SM — Primary Reference (deployed `theo_chat_send_message.index.js`, byte-verbatim — the insert+seq+publish pattern VC-13's forward mirrors)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the DEPLOYED **`theo_chat_send_message`** (VC-12) — the message-insert pattern the forward handler mirrors (set_config triad, membership gate, the atomic seq INSERT with `23505` retry, best-effort publish, `{data,meta}`/`{error}` envelope + error map). Blob `a8cafbcf9e411cde5b2da304fcd19b7f771ef7b1`:

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

### §SM-FJ — Primary Reference function.json (deployed `theo_chat_send_message.function.json`, byte-verbatim)

Blob `0284d265cd81bec4c34b5513d46c41b7ba6601ff`:

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

## §HG.1 — `theo_chat_forward_message` (GREENFIELD)

Mirrors the Primary Reference; adds a source read (RLS-visible → 404, deleted → 400), a target-membership gate (404), and the copy INSERT with `forwarded_from_message_id`. Full — file `theo_chat_forward_message.index.js`:

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
  const toThreadId = typeof body.to_thread_id === "string" ? body.to_thread_id.trim() : "";
  if (!isUuid(toThreadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'to_thread_id' is required and must be a valid UUID.", 400));
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

    // Read the SOURCE message under RLS — theo_chat_message_select only returns it if the caller is a
    // participant of its thread, so a caller can only forward a message they can already see. Absent /
    // not visible → 404 (no existence leak). The body is copied server-side (not client-supplied).
    const srcRes = await client.query(
      `SELECT body, deleted_at FROM public.theo_chat_messages WHERE id = $1`,
      [messageId]
    );
    if (srcRes.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Message not found.", 404);
    }
    const src = srcRes.rows[0];
    if (src.deleted_at != null) {
      throw buildKnownError("INVALID_REQUEST", "Cannot forward a deleted message.", 400);
    }
    const srcBody = src.body;

    // Target membership: the caller must belong to the destination thread. Not a participant → 404.
    // (The theo_chat_message_insert WITH CHECK independently enforces this on the INSERT below.)
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [toThreadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Insert the copy into the target thread with the next per-thread seq computed atomically; the
    // UNIQUE(thread_id, seq) guards a concurrent sender — retry on a 23505 race, then bump the thread.
    // forwarded_from_message_id records provenance (the API exposes only the derived `forwarded` bool).
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages (thread_id, seq, sender_oid, body, forwarded_from_message_id)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4 FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id
          `,
          [toThreadId, oid, srcBody, messageId]
        );
        await client.query(`UPDATE public.theo_chat_threads SET updated_at = now() WHERE id = $1`, [toThreadId]);
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

    // Shape to match the list_messages / send_message message projection exactly: a forward is never a
    // reply and never (freshly) deleted; `forwarded` is the ONLY provenance exposed (never the raw origin id).
    saved.reply_to = null;
    saved.deleted = false;
    saved.deleted_at = null;
    saved.forwarded = true;

    // Publish to the TARGET thread's group so its participants receive the forwarded message instantly.
    // Best-effort: already durably persisted; a publish failure must not fail the forward.
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(toThreadId).sendToAll({
          type: "message",
          thread_id: saved.thread_id,
          message: saved,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_forward_message publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ message: saved }));
  } catch (err) {
    context.log.error("theo_chat_forward_message failed", err);
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

### §HG.1-FJ — `theo_chat_forward_message.function.json` (GREENFIELD)

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_forward_message" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §HG.2 — `theo_chat_list_messages` (MODIFY: project the `forwarded` boolean on the VC-12 base)

Delta vs deployed VC-12: the SELECT adds `m.forwarded_from_message_id` and each shaped message gains `forwarded: r.forwarded_from_message_id != null` (the raw id is NOT projected). Cursor/paging/gate/reply/deleted all unchanged. Full — file `theo_chat_list_messages.index.js`:

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
    const params = [threadId];
    let where = `m.thread_id = $1`;
    if (before != null) { params.push(before); where += ` AND m.seq < $${params.length}`; }
    params.push(limit);
    const rows = await client.query(
      `SELECT m.id, m.thread_id, m.seq, m.sender_oid, m.body, m.created_at, m.reply_to_message_id, m.deleted_at, m.forwarded_from_message_id,
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
      // VC-13: expose ONLY the boolean (never the raw origin id — cross-thread privacy).
      forwarded: r.forwarded_from_message_id != null,
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

## §HG.3 — `theo_chat_send_message` (MODIFY: carry `forwarded:false` for shape parity)

Delta vs deployed VC-12: `saved.forwarded = false;` added next to `saved.deleted = false;` (a normally-sent/reply message is never a forward). Everything else byte-identical. Full — file `theo_chat_send_message.index.js`:

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
    // VC-13: a normally-sent message is never a forward — carry forwarded:false for shape parity with
    // list_messages / theo_chat_forward_message.
    saved.forwarded = false;

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
Byte-identical to §SM-FJ.

## §API-SPEC — Role-C (Pass 4) documentation delta
`spec/THEO_API_SPEC.md` §2.10 **`read / send messages`** row: add `POST /api/theo_chat_forward_message { message_id, to_thread_id }` → **201** `{ message }` (forwards a source the caller can see into a thread they belong to; source not visible → **404**, deleted source → **400**, target not a participant → **404**); note that `list_messages`/`send_message` messages now also carry `forwarded` (bool). `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 `theo_chat_messages` row: add `forwarded_from_message_id uuid NULL` (self-FK, `ON DELETE SET NULL`; exposed only as the `forwarded` boolean). Authored as a Role-C handoff after Pass-3 deploy + curls.

## §DEPLOY — Pass 3 (Walter migration FIRST, then Claude Code deploy to `vaultgpt-func-chat`)
1. **Walter** runs `vc13_forward_migration.sql` + the verify SQL (the column + self-FK must exist before deploy).
2. **Claude Code** deploys the NEW `theo_chat_forward_message/{index.js,function.json}` + overwrites `theo_chat_list_messages/index.js` + `theo_chat_send_message/index.js` via Kudu VFS surgical PUT (ARM bearer; no token logged); restart → confirm the 1 new function registers (inventory 16 → 17); baseline get-back before overwrite; post-deploy get-back byte-matches this pack.

## §CURL — post-deploy verification (Claude Code; az-login token for `api://4e1a1e31-…`; structural only — no OIDs/bodies)
Against two disposable channels the caller owns (A with a message, B empty):
- `POST forward_message` `message_id:"nope"` / `to_thread_id:"nope"` → **400** (UUID guards).
- `POST forward_message` a non-existent/non-visible `message_id` → **404**.
- `POST forward_message` a real A-message into a well-formed but non-participant `to_thread_id` → **404**.
- `POST forward_message` a real A-message → B → **201**; `message.forwarded === true`, body equals the source body; a follow-up `GET list_messages?threadId=B` shows it with `forwarded:true`.
- `POST forward_message` a **deleted** message (delete one in A first) → **400**.
- Regression: `GET list_messages` on A → a normal message has `forwarded:false`; `POST send_message` → **201** `message.forwarded===false`.

## §SM-NOTE — structural mirror
`theo_chat_forward_message` is the deployed `theo_chat_send_message` insert+seq+publish pattern plus a source read + target-membership gate + the `forwarded_from_message_id` column; `list_messages`/`send_message` add only the `forwarded` boolean. No shared helper/envelope/error-map drift. `node --check` clean on all three.

## Requested Pass 2 verdict
**APPROVED** or **REJECTED** only. On APPROVED: Walter runs the migration, Claude Code deploys the new handler + two overwrites + curls, then the Role-C (Pass 4) + VC-13-FE.
