# Theo 1B — VC-1.2 Channel Membership + First-Class Admin (migration `admin_oid` + `create_channel`/`list_threads` MODIFY + new `theo_chat_add_member` / `theo_chat_remove_member`) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2, APPROVED / REJECTED only). **Walter runs the migration at Pass 3 FIRST**, then Claude Code deploys the four handlers to the **dedicated `vaultgpt-func-chat`** app (§1E / DR-T7) and runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 + Schema deltas. Plan-only — no code/DDL executed by authoring it.
>
> **Scope (VC-1.2 = channel membership management with a first-class admin):** (1) a small **migration** adding `theo_chat_threads.admin_oid` (the channel administrator's OID), backfilled `= created_by`; (2) MODIFY `theo_chat_create_channel` to stamp `admin_oid = creator`; (3) MODIFY `theo_chat_list_threads` to project `admin_oid` (so the FE gates the manage-members UI to the admin); (4) NEW `theo_chat_add_member` / `theo_chat_remove_member`, **admin-gated** (`admin_oid = caller`), mutating `member_oids[]` + the per-member read-state row. Channels model (Walter-locked): private/invite-only; creator = admin; admin adds/removes; the admin cannot be removed (transfer = VC-15). The manage-members FE = a separate vault-origin **VC-1.2-FE** VEP.
>
> **Migration ordering (design-critical):** the migration MUST run **before** the handlers deploy — the modified `create_channel`/`list_threads` and the new handlers all reference `admin_oid`; deploying them against a table without the column would 500. Walter runs `vc1_2_admin_migration.sql`, THEN authorizes/there-is the handler deploy.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `8445ffeb1d7af30397fc6d19add28f1db1f65af6` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-1.2 channel membership + first-class admin. P1–P8 walked; additive+reversible migration (admin_oid + backfill) with verify SQL; Primary Reference = deployed `theo_chat_create_channel` pair inlined byte-verbatim; two MODIFY handlers (create_channel stamps admin_oid; list_threads projects admin_oid — CURRENT + MODIFIED full replacements) + two NEW handlers (add_member / remove_member, admin-gated) inlined full; function.json bindings for the two new routes + unchanged bindings for the two modified. No RLS change (admin authority enforced in-handler; thread UPDATE policy unchanged and preserved — admin is always a member). No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register) | `grep -F "VEP Format"` + `grep -F "Gap Register"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4A P-track) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary; §4 external-system) | `grep -F "selects **exactly one** deployed handler file"` + `grep -F "new-domain or new-external-system helper"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis; §1E deploy exception) | `grep -F "Pass 1 (Claude Code VEP)"` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (ownership-only posture → VC tier already recorded VC-1) | `grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_` conventions; the `theo_chat_*` tables + the new `admin_oid`) | `grep -F "theo_projects"` this turn | `62b898b881ad64023f99ae10414093681aaa84c8` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 chat contract — the add/remove routes + admin_oid delta land here at Pass 4) | `grep -F "the monolith \`theo_message\` is unchanged"` this turn | `e3c036d782f58f08c43405c7d384d9b71ae181cc` |
| 10 | **Primary Reference handler** (deployed channel-membership mutation: member_oids + read-state seeding + set_config triad) — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_create_channel.index.js` | `Read(full)` this turn | `8a4e0f032e9993fd49841a2bc225b404b6e9c38e` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_create_channel.function.json` | `Read(full)` this turn | (bindings; inlined §SM-FJ) |
| 12 | **MODIFY target B (deployed CURRENT)** — `Codex Governance/Theo-1B-VC8-Read-Receipts-Backend-Pass-1-VEP/theo_chat_list_threads.index.js` (the VC-8 deployed source of record) | `Read(full)` this turn | `f10d260900fb04a041b1354b5b84c6f5e22c38a8` |
| 13 | **Schema basis (tables + RLS)** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (`theo_chat_threads`; thread UPDATE policy `auth.uid() = ANY(member_oids)`) | `Read(full)` this turn | `67ff9b5f654e146c01590d9ce0f9286969e54103` |
| 14 | **Membership idiom** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_create_dm.index.js` (get-or-create + read-state seed; error map) | `Read(full)` this turn | `088ca0e7080b7b696ba1fa674916d3f22760fcc4` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` + streaming sidecar `vaultgpt-func-stream` READ-ONLY — deploy targets `vaultgpt-func-chat`. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §MIGRATION + §SM + §HG + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P2.5 — VC tier Walter-directed; Plan gap recorded at VC-1 |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_create_channel` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — no new external system; no Web PubSub in VC-1.2 |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — VC-1.2 touches only `theo_chat_*`; no `reporting_*` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — admin-gate (admin_oid = caller) is a cited extension of the ownership family |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_projects" | §MIGRATION / §P6 — `admin_oid` follows the `theo_` conventions |
| spec/THEO_API_SPEC.md | separate-app | "the monolith `theo_message` is unchanged" | §P2 — dedicated `vaultgpt-func-chat`; monolith untouched |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_create_channel.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.* — every handler keeps the deployed set_config triad |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_create_channel.function.json | binding | "httpTrigger" | §FJ — anonymous httpTrigger bindings (EasyAuth gates identity) |

## P1 — Feature identification
**Microstep:** VC-1.2 — channel membership management with a first-class administrator. Walter-locked channels model: private/invite-only; the creator is the admin; the admin adds/removes members; the admin cannot be removed (transfer = VC-15). Walter directed enterprise-grade — the admin is an explicit `admin_oid` column from the start (not implicit `created_by`).

**Migration (1):** `theo_chat_threads.admin_oid text` (nullable, additive), backfilled `= created_by`.
**Handlers modified (2):** `theo_chat_create_channel` (stamp `admin_oid = creator`); `theo_chat_list_threads` (project `admin_oid`).
**Handlers new (2), on `vaultgpt-func-chat`:** `POST /api/theo_chat_add_member` `{ thread_id, member_oid }`; `POST /api/theo_chat_remove_member` `{ thread_id, member_oid }` — both admin-gated.

**Out of scope (VC-1.2):** the manage-members FE (vault-origin **VC-1.2-FE**); leave / transfer-admin / rename / archive (VC-15); a realtime membership push (added members join the group on their next negotiate/reload — same pattern as a new DM peer); public/discoverable channels.

**Plan status:** the VC tier is Walter-directed and was reconciled against the Plan's ownership-only posture at VC-1 (PROCEED gap + Role-C future-trigger). VC-1.2's documentation delta (API-Spec routes + `admin_oid`; Schema `admin_oid`) is a Role-C at Pass 4.

## P2 — Architecture & boundary reconciliation
**Handler family.** All four are Family-B HTTP handlers mirroring the Primary Reference (`theo_chat_create_channel`): `pg` Pool on the chat app's libpq `PG*` env; EasyAuth `x-ms-client-principal` OID; validate-before-SQL; `set_config` triad; participant/admin predicate; `{data,meta}`/`{error}` envelope; anonymous `httpTrigger`.
**Admin authority.** `admin_oid` is the channel administrator. add/remove gate `admin_oid = caller` (after a participant + kind='channel' check). This is a cited extension of the ownership family ("Default family: ownership-based") — admin ≈ owner for channels.
**Boundary.** Reads/writes only `theo_chat_*`. Per Golden §3 ("It MUST NOT read or write" `reporting_*`) no `reporting_*`/monolith/Blob/Graph/Foundry. Deploy target `vaultgpt-func-chat`; monolith + sidecar READ-ONLY ("the monolith `theo_message` is unchanged").
**Validation before SQL.** UUID `thread_id` + OID `member_oid`, deterministic 400 before SQL.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| API-Spec §2.10 + Schema will change (add the two routes; `admin_oid`). | Documentation-currency delta on the Walter-directed, already-recorded VC tier — not a missing decision. | **PROCEED** with mandatory future-trigger: a Role-C (Pass 4) amendment updates `spec/THEO_API_SPEC.md` §2.10 (add/remove routes + `admin_oid` on `create_channel`/`list_threads`) and `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (`theo_chat_threads.admin_oid`). Sequenced after Pass 3 deploy + curls (documents deployed reality). |
| Added members don't get a live realtime membership push. | An added member's receive-only token groups are fixed at connect; they join the channel's group on their next negotiate/reload — identical to how a new DM's peer joins. | **PROCEED** — a server-pushed force-join is a later enhancement (noted in §P1 out-of-scope). |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**No external system in VC-1.2.** No Web PubSub, Blob, Graph, or Foundry. Per Golden §4 a "new-domain or new-external-system helper" would need justification; VC-1.2 introduces none — pure Postgres membership mutation over the existing `theo_chat_*` tables.

## P4 — Contract reconciliation
Envelope unchanged (`{data,meta}`/`{error}`).
- `theo_chat_create_channel` → `201 { thread, created:true }` — `thread` now includes `admin_oid`.
- `theo_chat_list_threads` → `200 { threads: [{ …, admin_oid, members_read }] }` — adds `admin_oid` (null for legacy/dm).
- `theo_chat_add_member` `{ thread_id, member_oid }` → `200 { thread_id, member_oid, added:boolean }` (`added:false` if already a member — idempotent).
- `theo_chat_remove_member` `{ thread_id, member_oid }` → `200 { thread_id, member_oid, removed:boolean }`.
Malformed input → 400; non-participant → 404; non-channel → 400; non-admin → 403; removing the admin → 400.

## P5 — Error-model reconciliation
Mirrors the Primary Reference: 401 (no identity) / 400 (bad JSON, bad UUID/OID, non-channel, remove-admin) / 404 (non-participant, `isKnown`) / 403 (non-admin `isKnown`, or `42501`) / 23514 → 400 / else 500. `isKnown` errors carry `{code,status}` and are re-mapped verbatim.

## P6 — Data-shape reconciliation
One additive column: `theo_chat_threads.admin_oid text` (nullable; backfilled `= created_by`; `create_channel` stamps it for new channels). No new table, no index (admin lookups are by PK). Follows the `theo_` conventions (anchor "theo_projects"). Full DDL in §MIGRATION.

## P7 — Idempotency / concurrency
- `add_member` is idempotent: `added:false` if already a member (checked in-txn); the `theo_chat_thread_members` seed is `ON CONFLICT DO NOTHING`.
- `remove_member` is idempotent: `removed:false` if not a member.
- Both run in a `BEGIN…COMMIT` after a single admin/participant fetch; the array mutation (`array_append`/`array_remove`) + the read-state row change commit atomically.
- The admin is always a member, so the thread UPDATE RLS `WITH CHECK (auth.uid() = ANY(member_oids))` holds through both operations.

## P8 — Security / RLS reconciliation
**set_config triad.** Every handler opens with the deployed triad (`set_config('app.current_user_id'|'request.jwt.claim.sub'|'request.jwt.claim.oid', <OID>, false)`).
**Admin-gate + participant scope, NO RLS change.** add/remove first fetch the thread under RLS + an explicit `$2 = ANY(member_oids)` participant predicate (non-participant → 404, no existence leak), then require `kind='channel'` and `admin_oid = caller` (else 400/403). The thread UPDATE policy (`auth.uid() = ANY(member_oids)`) is **unchanged** and still satisfied (the admin/caller remains a member across add/remove). No SECURITY DEFINER helper, no new elevated-read class (Golden §3) — only ordinary participant/admin `auth.uid()` predicates (the cited ownership-family extension). `admin_oid` is projected only to participants via the existing thread SELECT RLS.
**No leakage.** Responses carry OIDs (participant identities the FE already resolves via People) + booleans — no tokens/bodies/URLs.

## §MIGRATION — `vc1_2_admin_migration.sql` (additive + reversible; run by Walter at Pass 3 BEFORE the handler deploy)

Additive, idempotent (`IF NOT EXISTS`), reversible. No top-level transaction control (Golden §5.2); Walter executes. `-- label` comments only.

```sql
-- Theo VC-1.2 — first-class channel admin. ADDITIVE + REVERSIBLE. Adds theo_chat_threads.admin_oid
-- (the channel administrator's Entra OID), backfilled = created_by for existing rows. Idempotent;
-- safe to re-run. Run by Walter at Pass 3 BEFORE the VC-1.2 handlers are deployed (the modified
-- create_channel / list_threads and the new add_member / remove_member reference admin_oid). No RLS
-- change: admin authority is enforced in the handlers (admin_oid = caller), consistent with the
-- existing ownership-family pattern; the thread UPDATE policy (auth.uid() = ANY(member_oids)) is
-- unchanged and still holds (the admin is always a member, so add/remove preserve the WITH CHECK).

-- 1) The admin column. Nullable + additive (no default that references another column). For a channel
--    it is the administrator's OID; for a dm it is backfilled to created_by but carries no admin
--    semantics (DMs have no admin surface).
ALTER TABLE public.theo_chat_threads ADD COLUMN IF NOT EXISTS admin_oid text;

-- 2) Backfill: the creator is the administrator of every existing thread.
UPDATE public.theo_chat_threads SET admin_oid = created_by WHERE admin_oid IS NULL;
```

**Read-only verification (run after the migration):**

```sql
-- Theo VC-1.2 — read-only verification (run after vc1_2_admin_migration.sql). SELECT-only.

-- V1) the column exists.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_chat_threads' AND column_name = 'admin_oid';

-- V2) no thread left unbackfilled (expect 0).
SELECT COUNT(*) AS unbackfilled FROM public.theo_chat_threads WHERE admin_oid IS NULL;

-- V3) every channel's admin is one of its members (expect 0 violations).
SELECT COUNT(*) AS admin_not_member
FROM public.theo_chat_threads
WHERE kind = 'channel' AND admin_oid IS NOT NULL AND NOT (admin_oid = ANY (member_oids));
```

## §SM — Primary Reference (deployed `theo_chat_create_channel.index.js`, byte-verbatim)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the deployed **`theo_chat_create_channel`** — a channel-membership mutation over `theo_chat_*` with the set_config triad, `member_oids` handling, and `theo_chat_thread_members` read-state seeding (the exact idioms VC-1.2's new handlers reuse). Blob `8a4e0f032e9993fd49841a2bc225b404b6e9c38e`:

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

### §SM-FJ — Primary Reference function.json (deployed `theo_chat_create_channel.function.json`, byte-verbatim)

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

## §HG.1 — `theo_chat_create_channel` (MODIFY: stamp `admin_oid = creator`)

**Delta vs §SM (deployed CURRENT):** the INSERT adds the `admin_oid` column set to `$3` (the creator OID) and returns it. No other change.

**MODIFIED (full replacement — file `theo_chat_create_channel.index.js` in this package):**

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

    // VC-1.2: the creator is the channel administrator (admin_oid = the caller's OID). First-class
    // admin from creation, so add/remove-member + the later transfer/rename/archive gate on it.
    const ins = await client.query(
      `INSERT INTO public.theo_chat_threads (kind, name, member_oids, created_by, dm_key, admin_oid)
       VALUES ('channel', $1, $2::text[], $3, NULL, $3)
       RETURNING id, kind, name, member_oids, created_by, dm_key, created_at, updated_at, admin_oid`,
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

**§FJ.1 — `theo_chat_create_channel.function.json` (UNCHANGED; deploy bundle):** identical to §SM-FJ.

## §HG.2 — `theo_chat_list_threads` (MODIFY: project `admin_oid`)

**Delta vs deployed CURRENT (VC-8, blob `f10d260900fb04a041b1354b5b84c6f5e22c38a8`):** add `t.admin_oid` to the SELECT and `admin_oid: r.admin_oid` to the projection. No other change (members_read + all VC-8 fields preserved).

**MODIFIED (full replacement — file `theo_chat_list_threads.index.js` in this package):**

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
    // message (for the list preview), the unread count (messages after last_read_seq not sent by the
    // caller), the OTHER participants' read positions (members_read, VC-8), and — VC-1.2 — the channel
    // administrator (admin_oid), so the FE can gate the manage-members UI to the admin. All joins stay
    // within RLS-visible rows (the theo_chat_member_select policy lets a participant read any member row
    // of a thread they belong to). members_read excludes the caller's own row.
    const rows = await client.query(
      `
      SELECT
        t.id, t.kind, t.name, t.member_oids, t.created_by, t.dm_key, t.created_at, t.updated_at, t.admin_oid,
        COALESCE(mem.last_read_seq, 0) AS last_read_seq,
        lm.seq        AS last_seq,
        lm.body       AS last_body,
        lm.sender_oid AS last_sender_oid,
        lm.created_at AS last_message_at,
        COALESCE(unread.cnt, 0) AS unread_count,
        COALESCE(reads.members_read, '[]'::json) AS members_read
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
      LEFT JOIN LATERAL (
        SELECT json_agg(
                 json_build_object('oid', om.member_oid, 'last_read_seq', om.last_read_seq)
                 ORDER BY om.member_oid
               ) AS members_read
        FROM public.theo_chat_thread_members om
        WHERE om.thread_id = t.id AND om.member_oid <> $1
      ) reads ON true
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
      // VC-1.2: the channel administrator's OID (null for legacy/unbackfilled or a dm). The FE gates
      // the manage-members UI to `admin_oid === self`.
      admin_oid: r.admin_oid,
      last_read_seq: Number(r.last_read_seq),
      unread_count: Number(r.unread_count),
      last_message: r.last_seq == null ? null : {
        seq: Number(r.last_seq),
        body: r.last_body,
        sender_oid: r.last_sender_oid,
        created_at: r.last_message_at,
      },
      // VC-8: other participants' read positions (Teams-style "Seen"). Empty array when alone / no peers.
      members_read: Array.isArray(r.members_read)
        ? r.members_read.map((x) => ({ oid: x.oid, last_read_seq: Number(x.last_read_seq) }))
        : [],
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

**§FJ.2 — `theo_chat_list_threads.function.json` (UNCHANGED; deploy bundle):** the deployed GET binding (methods `["get","options"]`, route `theo_chat_list_threads`).

## §HG.3 — `theo_chat_add_member` (GREENFIELD)

Admin-gated append to a channel's `member_oids` + read-state seed. Idempotent (`added:false` if already a member). Full — file `theo_chat_add_member.index.js`:

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

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
  // member_oid is an Entra object id (UUID-shaped), the same identity theo_list_people returns.
  const memberOid = typeof body.member_oid === "string" ? body.member_oid.trim() : "";
  if (!isUuid(memberOid)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'member_oid' is required and must be a valid Entra object id.", 400));
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

    // Fetch the thread the caller can see (RLS + explicit participant predicate). Absent / not a
    // participant → 404 (no existence leak). Then: only a CHANNEL has membership management, and only
    // the ADMIN (admin_oid = caller) may add members.
    const t = await client.query(
      `SELECT kind, admin_oid, member_oids FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (t.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    const row = t.rows[0];
    if (row.kind !== "channel") {
      throw buildKnownError("INVALID_REQUEST", "Members can only be added to a channel.", 400);
    }
    if (row.admin_oid !== oid) {
      throw buildKnownError("FORBIDDEN", "Only the channel admin can add members.", 403);
    }
    const already = Array.isArray(row.member_oids) && row.member_oids.includes(memberOid);
    if (!already && Array.isArray(row.member_oids) && row.member_oids.length >= MAX_MEMBERS) {
      throw buildKnownError("INVALID_REQUEST", `A channel may have at most ${MAX_MEMBERS} members.`, 400);
    }

    if (!already) {
      // Append the new member (admin remains a member → the UPDATE RLS WITH CHECK still holds).
      await client.query(
        `UPDATE public.theo_chat_threads SET member_oids = array_append(member_oids, $2), updated_at = now() WHERE id = $1`,
        [threadId, memberOid]
      );
      // Seed the new member's read-state row (unread math). Idempotent.
      await client.query(
        `INSERT INTO public.theo_chat_thread_members (thread_id, member_oid)
         VALUES ($1, $2) ON CONFLICT (thread_id, member_oid) DO NOTHING`,
        [threadId, memberOid]
      );
    }

    await client.query("COMMIT");
    return send(context, 200, successBody({ thread_id: threadId, member_oid: memberOid, added: !already }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_add_member failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
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

**§FJ.3 — `theo_chat_add_member.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_add_member"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.4 — `theo_chat_remove_member` (GREENFIELD)

Admin-gated removal; the admin cannot be removed (transfer first — VC-15). Full — file `theo_chat_remove_member.index.js`:

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
  const memberOid = typeof body.member_oid === "string" ? body.member_oid.trim() : "";
  if (!isUuid(memberOid)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'member_oid' is required and must be a valid Entra object id.", 400));
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

    // Fetch the thread the caller can see (RLS + participant predicate). Absent / not a participant →
    // 404. Only a CHANNEL has membership management; only the ADMIN may remove members; and the admin
    // cannot be removed (transfer admin first — VC-15). Removing self as a non-admin is "leave" (VC-15),
    // out of scope here.
    const t = await client.query(
      `SELECT kind, admin_oid, member_oids FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (t.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    const row = t.rows[0];
    if (row.kind !== "channel") {
      throw buildKnownError("INVALID_REQUEST", "Members can only be removed from a channel.", 400);
    }
    if (row.admin_oid !== oid) {
      throw buildKnownError("FORBIDDEN", "Only the channel admin can remove members.", 403);
    }
    if (memberOid === row.admin_oid) {
      throw buildKnownError("INVALID_REQUEST", "The channel admin cannot be removed; transfer admin first.", 400);
    }

    const present = Array.isArray(row.member_oids) && row.member_oids.includes(memberOid);
    if (present) {
      // Remove the member (the admin/caller remains → the UPDATE RLS WITH CHECK still holds).
      await client.query(
        `UPDATE public.theo_chat_threads SET member_oids = array_remove(member_oids, $2), updated_at = now() WHERE id = $1`,
        [threadId, memberOid]
      );
      // Clean up their read-state row (they lose access via RLS regardless).
      await client.query(
        `DELETE FROM public.theo_chat_thread_members WHERE thread_id = $1 AND member_oid = $2`,
        [threadId, memberOid]
      );
    }

    await client.query("COMMIT");
    return send(context, 200, successBody({ thread_id: threadId, member_oid: memberOid, removed: present }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_remove_member failed", err);
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

**§FJ.4 — `theo_chat_remove_member.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_remove_member"
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
After Pass 3 (migration + deploy + curls), a Role-C amendment lands:
- `spec/THEO_API_SPEC.md` §2.10: add `POST theo_chat_add_member` / `POST theo_chat_remove_member`; note `create_channel`/`list_threads` now carry `admin_oid`.
- `spec/THEO_AZURE_POSTGRES_SCHEMA.md`: `theo_chat_threads.admin_oid text` (channel administrator; backfilled `= created_by`).

## §DEPLOY — Pass 3 (Walter migration FIRST, then Claude Code deploy to `vaultgpt-func-chat`)
1. **Walter** runs `vc1_2_admin_migration.sql` + the verify SQL (admin authority is Walter's DB domain; and the column MUST exist before the handlers deploy).
2. **Claude Code** deploys the four handlers to `vaultgpt-func-chat` (Kudu VFS surgical writes; §1E / DR-T7): the two modified `index.js` (create_channel, list_threads) + the two new function dirs (add_member, remove_member with their function.json). No monolith/sidecar write; no app-setting change.
3. Restart; confirm the function list now includes `theo_chat_add_member` + `theo_chat_remove_member`; run §CURL.

## §CURL — post-deploy verification (Claude Code; az-login token, as the signed-in user)
1. `GET theo_chat_list_threads` → each channel now carries `admin_oid`.
2. `POST theo_chat_create_channel { name }` → `thread.admin_oid` == the caller.
3. `POST theo_chat_add_member { thread_id, member_oid }` (as admin) → `200 { added:true }`; a repeat → `{ added:false }`; `list_threads` shows the new member in `member_oids`.
4. `POST theo_chat_remove_member { thread_id, member_oid }` (as admin) → `200 { removed:true }`; removing the admin → `400`; a non-admin caller → `403`; a non-channel → `400`.
Structural/status checks only — no OIDs/bodies logged (no-leakage).

## §SM-NOTE — structural mirror
All four keep the Primary Reference boilerplate (envelope, principal/claim parsing, set_config triad, error map, `buildKnownError`, `isUuid`) verbatim. add/remove reuse the create_channel/create_dm membership + read-state idioms; the admin gate mirrors the create_dm exists-unscoped 403/404 discrimination. No new dependency, no new external system.

## Requested Pass 2 verdict
APPROVED / REJECTED (Codex). On APPROVED: Walter runs the migration (+ verify), then Claude Code deploys the four handlers to `vaultgpt-func-chat` (Pass 3), runs §CURL, and lands the §API-SPEC + Schema Role-C (Pass 4). The manage-members FE follows as vault-origin **VC-1.2-FE**.

*End of Pass 1 Backend VEP (plan-only).*
