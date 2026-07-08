# Theo 1B — VC-18 Hard-Delete-a-Channel Backend (migration: admin-only DELETE policy on `theo_chat_threads` + new `theo_chat_delete_channel` handler; children cascade) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). **Walter runs the migration at Pass 3 FIRST**, then Claude Code deploys the handler to the **dedicated `vaultgpt-func-chat`** app (§1E / DR-T7) + runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 + Schema deltas. Plan-only.
>
> **Scope (VC-18 = the true hard-delete Walter asked for, alongside the soft VC-16 archive):** a channel **admin permanently deletes** a channel; its messages + members are removed by the existing `ON DELETE CASCADE` FKs. (1) a **migration** adding an ADMIN-ONLY `DELETE` policy on `theo_chat_threads` (`USING (admin_oid = auth.uid())`); (2) NEW `theo_chat_delete_channel` handler (admin-gated, execution-time safe, cascade delete). No new column; no `SECURITY DEFINER` (the DELETE policy + the existing cascade suffice).
>
> **Why a policy, not `SECURITY DEFINER`:** the two child tables already FK `theo_chat_threads(id)` `ON DELETE CASCADE` (VC-1), so deleting the thread row removes members + messages (a referential action performed as the table owner — not subject to child RLS). The app role has NO `DELETE` policy on `theo_chat_threads` today (VC-1 = SELECT/INSERT/UPDATE only); an admin-only `DELETE` policy is the minimal, natural RLS addition, and the handler applies the same execution-time admin guard as VC-15/VC-16 (`FOR UPDATE` + admin predicate in the `DELETE` + 0-row → 403). A DM has `admin_oid` NULL → the policy is false for a DM; the handler also requires `kind='channel'`.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `de8c6d2d85e3f11fdff0725e05303784d56284dd` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-18 hard-delete-a-channel. P1–P8 walked; additive+reversible migration (admin-only `theo_chat_thread_delete` policy) with verify SQL; Primary Reference = the deployed `theo_chat_archive_channel` (the VC-16 admin-gated channel mutation) inlined byte-verbatim + its function.json; one NEW handler (delete_channel) inlined full + its function.json; the delete relies on the existing child `ON DELETE CASCADE` FKs. No `SECURITY DEFINER`. No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
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
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§8 chat RLS policy set — `theo_chat_threads` SELECT/INSERT/UPDATE, no DELETE today; the new DELETE policy lands here) | `grep -F "participant-scoped"` this turn | `7b6174c16946948c704e22116885072b4ecaad2e` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 chat contract — delete-channel route lands at Pass 4) | `grep -F "channel admin lifecycle"` this turn | `1274f5cff90a788eaed2178c55ed39e6b9ca143b` |
| 10 | **Primary Reference handler** (deployed admin-gated channel mutation, execution-time safe) — `Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/theo_chat_archive_channel.index.js` | `Read(full)` this turn; deployed | `f60ed69132880d6bc796961d0ab0a404912e23b1` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/theo_chat_archive_channel.function.json` | `Read(full)` this turn | `f4c612cea2cd06f0cc6ee6480b2a9b79b3c49f91` |
| 12 | **Cascade + RLS basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (child FKs `ON DELETE CASCADE`; thread has SELECT/INSERT/UPDATE, NO DELETE policy) | `Read(full)`/`grep` this turn; cited | `67ff9b5f654e146c01590d9ce0f9286969e54103` |

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
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_archive_channel` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — no new external system |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — VC-18 touches only `theo_chat_*`; no `reporting_*` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — admin-gated DELETE is an ownership-family extension |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql | cascade | "ON DELETE CASCADE" | §P6 / §P8 — deleting the thread cascades members + messages |
| spec/THEO_API_SPEC.md | §2.10 | "channel admin lifecycle" | §API-SPEC — the delete-channel route joins the admin-lifecycle row |
| Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/theo_chat_archive_channel.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.1 — delete_channel keeps the deployed set_config triad |
| Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/theo_chat_archive_channel.function.json | binding | "httpTrigger" | §SM-FJ / §FJ — anonymous httpTrigger bindings (EasyAuth gates identity) |

## P1 — Feature identification
**Microstep:** VC-18 — a channel **admin permanently deletes** a channel (the true hard-delete alongside VC-16's soft archive). The thread row is removed and its `theo_chat_thread_members` + `theo_chat_messages` cascade away. Irreversible; admin-only; channel-only.

**Migration:** an admin-only `DELETE` policy `theo_chat_thread_delete` on `theo_chat_threads` (`USING (admin_oid = auth.uid())`).
**New handler (1):** `POST /api/theo_chat_delete_channel` `{ thread_id }`.

**Out of scope (VC-18):** the FE (delete in the per-channel ⋯ menu = vault-origin **VC-17-FE**, alongside archive/rename/leave + the `+`-into-list move); a confirm/undo window (the FE will confirm); deleting a DM (DMs aren't deletable — no admin); bulk delete.

**Plan status:** VC tier Walter-directed ("Both" — keep archive AND add hard delete), reconciled at VC-1 ("sharing/membership RLS models (ownership-only unless Walter authorizes)"). Doc delta = API-Spec §2.10 admin-lifecycle row + Schema §8 DELETE policy (Role-C, Pass 4).

## P2 — Architecture & boundary reconciliation
**Handler family.** `theo_chat_delete_channel` is a Family-B HTTP handler byte-for-byte mirroring the Primary Reference (`theo_chat_archive_channel`): `pg` Pool; EasyAuth OID; validate-before-SQL; `set_config` triad; `BEGIN` → `FOR UPDATE` participant/channel/admin gate (404/400/403) → the guarded mutation → `COMMIT`; `{data,meta}`/`{error}` envelope; anonymous `httpTrigger`; best-effort Web PubSub publish. The only substantive difference: the guarded mutation is a `DELETE … WHERE id=$1 AND admin_oid=$2 AND kind='channel'` (vs archive's `UPDATE … SET archived_at`), and the publish is `{ type:"channel_deleted" }`.
**Boundary.** Reads/writes only `theo_chat_*`. Per Golden §3 ("It MUST NOT read or write" outside its domain) no `reporting_*`/monolith/Blob/Graph/Foundry. Deploy target `vaultgpt-func-chat`; monolith + sidecar READ-ONLY.
**Validation before SQL.** UUID `thread_id` → deterministic 400 before any SQL.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| API-Spec §2.10 + Schema §8 will change (the delete-channel route; the new DELETE policy). | Documentation-currency delta on the recorded VC tier. | **PROCEED** with a Role-C (Pass 4): `spec/THEO_API_SPEC.md` §2.10 + `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §8. Sequenced after Pass 3 deploy + curls. |
| A new RLS policy (`DELETE`) is added to the chat set. | Minimal + admin-scoped (`admin_oid = auth.uid()`); the chat set previously had SELECT/INSERT/UPDATE only. No `SECURITY DEFINER`, no elevated-read. Ownership-family extension. | **PROCEED** — justified in §P8; Role-C documents §8. |
| Hard delete is IRREVERSIBLE (cascades messages + members). | Walter-directed ("Both" — archive kept for the reversible path; delete is the permanent one). The FE (VC-17-FE) gates delete behind a confirm step; the backend is admin-only + execution-time-guarded. | **PROCEED** — matches the Walter-locked model; FE confirms. |
| No realtime for a channel a member is viewing when the admin deletes it. | Best-effort `{ type:"channel_deleted" }` publish tells connected clients to drop it; others reconcile on next `list_threads` (the thread is simply gone). | **PROCEED** — best-effort + eventual reconcile. |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**No new external system in VC-18.** The handler reuses the existing best-effort Web PubSub publish (a new `{ type:"channel_deleted" }` event on the SAME hub/binding). Per Golden §4 a "new-domain or new-external-system helper" would need justification; VC-18 introduces none — pure Postgres over `theo_chat_*` + the pre-existing publish.

## P4 — Contract reconciliation
Envelope unchanged (`{data,meta}`/`{error}`).
- `theo_chat_delete_channel` `{ thread_id }` → `200 { thread_id, deleted:true }`.
Malformed input → 400; non-participant → 404; non-channel (dm) → 400; non-admin → 403. The deleted thread + its messages/members are gone (cascade); it disappears from `list_threads` (the row no longer exists).

## P5 — Error-model reconciliation
Mirrors the Primary Reference: 401 / 400 (bad JSON, bad UUID, non-channel) / 404 (non-participant, `isKnown`) / 403 (non-admin `isKnown`, or the RLS `42501` DELETE denial) / else 500. `isKnown` errors re-map verbatim. `ROLLBACK` on any error inside the transaction.

## P6 — Data-shape reconciliation
No new table/column. One additive RLS policy (`theo_chat_thread_delete`). The delete relies on the existing `theo_chat_thread_members` + `theo_chat_messages` FKs `ON DELETE CASCADE` (VC-1) — no cascade DDL is added. Full DDL in §MIGRATION.

## P7 — Idempotency / concurrency
- The `DELETE` is guarded by `FOR UPDATE` on the thread row (taken in the pre-check SELECT) so a concurrent `transfer_admin` (also `FOR UPDATE`) serializes: `admin_oid` cannot change between the check and the delete. The admin predicate is re-asserted in the `DELETE` (0 rows → 403) as belt-and-suspenders.
- Not idempotent by nature (a second delete of a now-absent thread → the SELECT returns 0 rows → 404, which the FE treats as "already gone"). The whole handler runs in one transaction; `ROLLBACK` on error.
- Cascade deletes of children happen atomically within the same transaction as the parent delete.

## P8 — Security / RLS reconciliation
**The admin-only `DELETE` policy, justified.** VC-1 gave `theo_chat_threads` SELECT/INSERT/UPDATE policies and NO DELETE — the app role cannot delete a thread today. VC-18 adds `theo_chat_thread_delete FOR DELETE TO authenticated USING (admin_oid = auth.uid())`: only the channel admin may delete, and (since a DM has `admin_oid` NULL) a DM is never deletable via this policy. The handler adds the execution-time guard (`FOR UPDATE` + `admin_oid = caller AND kind='channel'` in the `DELETE` + 0-row → 403), matching the VC-15/VC-16 admin-mutation discipline. No `SECURITY DEFINER` is introduced (unlike leave/delete-message, where the app role had no policy path); no new elevated-READ class. The admin-gated delete is an ownership-family extension ("Default family: ownership-based").
**Cascade safety.** Deleting the thread row cascades to `theo_chat_thread_members` + `theo_chat_messages` via their `ON DELETE CASCADE` FKs — a referential action performed as the table owner, so it correctly removes the children regardless of their RLS. No orphan rows.
**No leakage.** The response carries `thread_id` + a boolean; the realtime `channel_deleted` event carries only the id. No tokens/bodies.

## §MIGRATION — `vc18_delete_channel_migration.sql` (additive + reversible; run by Walter at Pass 3 BEFORE the handler deploy)

Additive, idempotent (`DROP POLICY IF EXISTS` + `CREATE POLICY`), reversible. No top-level transaction control (Golden §5.2); Walter executes. `-- label` comments only.

```sql
-- Theo VC-18 — hard-delete a channel (admin-only, PERMANENT; cascades messages + members).
-- ADDITIVE + REVERSIBLE. Run by Walter at Pass 3 BEFORE the VC-18 handler deploy. Idempotent (re-runnable).
--
-- Why only a policy (no SECURITY DEFINER, no column):
--  * theo_chat_thread_members and theo_chat_messages already FK theo_chat_threads(id) ON DELETE CASCADE
--    (VC-1), so deleting the thread row removes its members + messages automatically. A cascade is a
--    referential action performed as the table owner — it is NOT subject to the child tables' RLS.
--  * The app role has NO DELETE policy on theo_chat_threads (VC-1 created SELECT/INSERT/UPDATE only), so
--    it cannot delete at all today. This adds an ADMIN-ONLY DELETE policy. A DM has admin_oid NULL, so
--    USING (admin_oid = auth.uid()) is false for a DM — only a CHANNEL ADMIN can delete; the handler also
--    requires kind = 'channel' and applies the execution-time admin guard (FOR UPDATE + admin predicate
--    in the DELETE + 0-row → 403), mirroring the VC-15/VC-16 admin-mutation discipline. No SECURITY
--    DEFINER is needed (unlike leave/delete-message, where the app role had no policy path at all).

DROP POLICY IF EXISTS "theo_chat_thread_delete" ON public.theo_chat_threads;
CREATE POLICY "theo_chat_thread_delete" ON public.theo_chat_threads
  FOR DELETE TO authenticated
  USING (admin_oid = auth.uid());
```

**Read-only verification (run after the migration):**

```sql
-- Theo VC-18 — read-only verification (run after vc18_delete_channel_migration.sql). SELECT-only.

-- V1) the admin-only DELETE policy exists on theo_chat_threads.
SELECT polname, polcmd, pg_get_expr(polqual, polrelid) AS using_expr
FROM pg_policy pol
JOIN pg_class rel ON rel.oid = pol.polrelid
JOIN pg_namespace n ON n.oid = rel.relnamespace
WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_threads' AND pol.polname = 'theo_chat_thread_delete';
-- expect polcmd 'd' (DELETE) and using_expr referencing admin_oid = auth.uid().

-- V2) the child FKs still cascade (unchanged by this migration; confirms the cascade the handler relies on).
SELECT con.conname, con.confdeltype, rel.relname
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace n ON n.oid = rel.relnamespace
WHERE n.nspname = 'public' AND rel.relname IN ('theo_chat_thread_members', 'theo_chat_messages')
  AND con.contype = 'f' AND con.confrelid = 'public.theo_chat_threads'::regclass;
-- expect confdeltype 'c' (CASCADE) for both.
```

## §SM — Primary Reference (deployed `theo_chat_archive_channel.index.js`, byte-verbatim)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the DEPLOYED **`theo_chat_archive_channel`** (VC-16) — the admin-gated channel mutation VC-18's delete mirrors exactly (set_config triad, `BEGIN` → `FOR UPDATE` participant/channel/admin gate → guarded mutation → `COMMIT`, `42501`/`isKnown` error map, envelope). Blob `f60ed69132880d6bc796961d0ab0a404912e23b1`:

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

    await client.query("BEGIN");

    // ROW-LOCK the thread (FOR UPDATE) so admin authority can't change under a concurrent transfer.
    // Absent / not a participant → 404. Only a CHANNEL is archivable; only the ADMIN may archive.
    const t = await client.query(
      `SELECT kind, admin_oid FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids) FOR UPDATE`,
      [threadId, oid]
    );
    if (t.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    const row = t.rows[0];
    if (row.kind !== "channel") {
      throw buildKnownError("INVALID_REQUEST", "Only a channel can be archived.", 400);
    }
    if (row.admin_oid !== oid) {
      throw buildKnownError("FORBIDDEN", "Only the channel admin can archive the channel.", 403);
    }

    // Admin predicate is IN the UPDATE (execution-time safe: 0 rows if admin changed under a race);
    // idempotent (archived_at set once); admin remains a member → the thread UPDATE WITH CHECK holds.
    const upd = await client.query(
      `UPDATE public.theo_chat_threads SET archived_at = now(), updated_at = now()
         WHERE id = $1 AND admin_oid = $2 AND archived_at IS NULL
       RETURNING id`,
      [threadId, oid]
    );
    // rowCount 0 could mean already archived (idempotent success) OR admin changed under a race.
    // Re-read the archived state to disambiguate: still-visible + archived → success; else 403.
    if (upd.rowCount === 0) {
      const chk = await client.query(
        `SELECT archived_at IS NOT NULL AS archived, admin_oid FROM public.theo_chat_threads WHERE id = $1`,
        [threadId]
      );
      const r = chk.rows[0];
      if (!r || r.admin_oid !== oid || r.archived !== true) {
        throw buildKnownError("FORBIDDEN", "Only the channel admin can archive the channel.", 403);
      }
    }

    await client.query("COMMIT");
    return send(context, 200, successBody({ thread_id: threadId, archived: true }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_archive_channel failed", err);
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

### §SM-FJ — Primary Reference function.json (deployed `theo_chat_archive_channel.function.json`, byte-verbatim)

Blob `f4c612cea2cd06f0cc6ee6480b2a9b79b3c49f91`:

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_archive_channel" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §HG.1 — `theo_chat_delete_channel` (GREENFIELD)

Mirrors the Primary Reference; the guarded mutation is a cascade `DELETE` (vs `UPDATE … archived_at`) and the publish is `{ type:"channel_deleted" }`. `DELETE` is not idempotent (a re-delete → the SELECT returns 0 → 404), so there is no post-mutation re-read (0 rows from the guarded DELETE under the `FOR UPDATE` lock ⇒ 403). Full — file `theo_chat_delete_channel.index.js`:

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

    await client.query("BEGIN");

    // ROW-LOCK the thread (FOR UPDATE) so admin authority can't change under a concurrent transfer.
    // Absent / not a participant → 404. Only a CHANNEL is deletable; only the ADMIN may delete.
    const t = await client.query(
      `SELECT kind, admin_oid FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids) FOR UPDATE`,
      [threadId, oid]
    );
    if (t.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    const row = t.rows[0];
    if (row.kind !== "channel") {
      throw buildKnownError("INVALID_REQUEST", "Only a channel can be deleted.", 400);
    }
    if (row.admin_oid !== oid) {
      throw buildKnownError("FORBIDDEN", "Only the channel admin can delete the channel.", 403);
    }

    // Admin predicate is IN the DELETE (execution-time safe: 0 rows if admin changed under a race). The
    // theo_chat_thread_delete RLS policy (admin_oid = auth.uid()) is the second gate. Deleting the thread
    // CASCADES to theo_chat_thread_members + theo_chat_messages via their ON DELETE CASCADE FKs.
    const del = await client.query(
      `DELETE FROM public.theo_chat_threads WHERE id = $1 AND admin_oid = $2 AND kind = 'channel' RETURNING id`,
      [threadId, oid]
    );
    if (del.rowCount === 0) {
      // Under the FOR UPDATE lock this only happens if admin changed before the lock; not the admin → 403.
      throw buildKnownError("FORBIDDEN", "Only the channel admin can delete the channel.", 403);
    }

    await client.query("COMMIT");

    // Best-effort realtime: tell connected participants the channel is gone so they drop it live. The
    // delete is already committed; a publish failure must not fail the delete (peers reconcile on reload).
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "channel_deleted",
          thread_id: threadId,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_delete_channel publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 200, successBody({ thread_id: threadId, deleted: true }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_delete_channel failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "Only the channel admin can delete the channel.", 403));
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

### §HG.1-FJ — `theo_chat_delete_channel.function.json` (GREENFIELD)

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_delete_channel" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §API-SPEC — Role-C (Pass 4) documentation delta
`spec/THEO_API_SPEC.md` §2.10 admin-lifecycle row: add `POST /api/theo_chat_delete_channel { thread_id }` → **200** `{ thread_id, deleted:true }` — admin-only PERMANENT delete (cascades messages + members); non-admin → **403**, non-channel → **400**, non-participant → **404**; distinct from the soft `archive`. `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §8: document the admin-only `theo_chat_thread_delete` policy (`USING (admin_oid = auth.uid())`) + that a channel delete cascades to `theo_chat_thread_members`/`theo_chat_messages`. Authored as a Role-C handoff after Pass-3 deploy + curls.

## §DEPLOY — Pass 3 (Walter migration FIRST, then Claude Code deploy to `vaultgpt-func-chat`)
1. **Walter** runs `vc18_delete_channel_migration.sql` + the verify SQL (the DELETE policy must exist before deploy).
2. **Claude Code** deploys the NEW `theo_chat_delete_channel/{index.js,function.json}` via Kudu VFS surgical PUT (ARM bearer; no token logged); restart → confirm the 1 new function registers (inventory 15 → 16); post-deploy get-back byte-matches this pack.

## §CURL — post-deploy verification (Claude Code; az-login token for `api://4e1a1e31-…`; structural only — no OIDs/bodies)
- `POST delete_channel` `thread_id:"nope"` → **400** (UUID guard).
- `POST delete_channel` a well-formed but non-participant thread → **404**.
- Against a disposable channel the caller admins: `POST delete_channel` → **200** `deleted:true`; a follow-up `GET list_threads` no longer lists it; `GET list_messages?threadId=<deleted>` → **404** (thread + messages gone via cascade).
- `POST delete_channel` on a **DM** the caller is in → **400** (only a channel can be deleted).
- Non-admin delete path → **403** (structurally covered by the handler pre-check + the RLS DELETE policy; not solo-reproducible).

## §SM-NOTE — structural mirror
`theo_chat_delete_channel` is byte-for-byte the deployed `theo_chat_archive_channel` (set_config triad, `BEGIN`/`FOR UPDATE` gate/`COMMIT`, error map, envelope, best-effort publish) with the guarded `UPDATE … archived_at` replaced by a guarded cascade `DELETE` and the publish type `channel_deleted`. No shared helper/envelope/error-map drift. `node --check` clean.

## Requested Pass 2 verdict
**APPROVED** or **REJECTED** only. On APPROVED: Walter runs the migration, Claude Code deploys the handler + curls, then the Role-C (Pass 4) + VC-17-FE (the ⋯ menu with delete/archive/rename/leave + the `+`-into-list move).
