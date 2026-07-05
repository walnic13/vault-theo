# Theo 1B — VC-15 Channel Admin Lifecycle (rename + transfer-admin) Backend — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2, APPROVED / REJECTED only). Claude Code deploys the two new handlers to the **dedicated `vaultgpt-func-chat`** app (§1E / DR-T7) after APPROVAL + runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 delta. **No migration, no DB step from Walter.** Plan-only.
>
> **Scope (VC-15 = the no-migration half of the channel admin lifecycle):** two NEW handlers — `POST /api/theo_chat_rename_channel` `{ thread_id, name }` and `POST /api/theo_chat_transfer_admin` `{ thread_id, new_admin_oid }` — both **admin-gated** (`admin_oid = caller`) and both mutating only existing columns (`name`, `admin_oid`) with `member_oids` **unchanged**, so the deployed thread UPDATE RLS `WITH CHECK (auth.uid() = ANY(member_oids))` continues to hold (the admin/caller stays a member). **No schema change, no RLS change.**
>
> **Why leave + archive are NOT here (grounded split):** `leave` removes the CALLER from `member_oids` → the thread UPDATE `WITH CHECK` (new row must still contain `auth.uid()`) FAILS for self-removal → it needs an RLS accommodation (a `SECURITY DEFINER` leave fn or a policy change). `archive` needs an `archived_at` column. Both require a migration and are deferred to **VC-16** (one migration). VC-15 is the clean, migration-free half — deployable end-to-end today.
>
> **R1 fix (Codex Pass 2):** the admin gate is now **execution-time safe under concurrent transfer**. The gate read is `SELECT … FOR UPDATE` (row-locks the thread for the txn, so a concurrent `theo_chat_transfer_admin` blocks until this commits), AND the admin predicate is folded INTO the UPDATE (`WHERE id = $1 AND admin_oid = $caller`) with a **0-row guard → 403**. Previously the JS check + `WHERE id=$1`-only UPDATE were not atomic under READ COMMITTED: an admin could pass the check, lose admin to a concurrent transfer, and still rename/transfer (RLS only requires membership). Both handlers now re-assert admin authority at write time.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `bac0cec8826d4f8d28dd6f89a621e1f30c30455e` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-15 channel rename + transfer-admin. P1–P8 walked; NO migration, NO RLS change (both handlers mutate only name/admin_oid; member_oids unchanged so the deployed thread UPDATE WITH CHECK holds — grounded in the VC-1 policy). Primary Reference = deployed `theo_chat_add_member` (VC-1.2 admin-gated channel mutation) inlined byte-verbatim; two NEW handlers inlined full + function.json bindings. Admin authority = admin_oid (VC-1.2). No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register) | `grep -F "VEP Format"` + `grep -F "Gap Register"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4A P-track) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary; §4 external-system) | `grep -F "selects **exactly one** deployed handler file"` + `grep -F "new-domain or new-external-system helper"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis; §1E deploy exception) | `grep -F "Pass 1 (Claude Code VEP)"` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (ownership-only posture → VC tier recorded VC-1) | `grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§8 `theo_chat_threads`; thread UPDATE policy `auth.uid() = ANY(member_oids)`; admin_oid VC-1.2) | `grep -F "theo_projects"` this turn | `62b898b881ad64023f99ae10414093681aaa84c8` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 chat contract — the rename/transfer routes land here at Pass 4) | `grep -F "the monolith \`theo_message\` is unchanged"` this turn | `e3c036d782f58f08c43405c7d384d9b71ae181cc` |
| 10 | **Primary Reference handler** (deployed admin-gated channel mutation: set_config triad, participant+admin gate, member_oids UPDATE preserving WITH CHECK) — `Codex Governance/Theo-1B-VC1.2-Channel-Members-Backend-Pass-1-VEP/theo_chat_add_member.index.js` | `Read(full)` this turn | `003674dcd9dc457036eb6a372dcf34ecf3bfc8bc` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-VC1.2-Channel-Members-Backend-Pass-1-VEP/theo_chat_add_member.function.json` | `Read(full)` this turn | `fc719a1d05d98f475f937bfd9eac68a093dc1322` |
| 12 | **RLS basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (thread UPDATE policy — the WITH CHECK that rename/transfer preserve and leave would violate) | `Read(full)` prior turn; cited | `67ff9b5f654e146c01590d9ce0f9286969e54103` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` + streaming sidecar `vaultgpt-func-stream` READ-ONLY — deploy targets `vaultgpt-func-chat`. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §SM + §HG + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P2.5 — VC tier Walter-directed; recorded VC-1 |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_add_member` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — no new external system |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — VC-15 touches only `theo_chat_*`; no `reporting_*` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — admin-gate (admin_oid = caller) is the ownership-family extension |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_projects" | §P6 — no schema change; `theo_` conventions unchanged |
| spec/THEO_API_SPEC.md | separate-app | "the monolith `theo_message` is unchanged" | §P2 — dedicated `vaultgpt-func-chat`; monolith untouched |
| Codex Governance/Theo-1B-VC1.2-Channel-Members-Backend-Pass-1-VEP/theo_chat_add_member.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.* — both handlers keep the deployed set_config triad + admin gate |
| Codex Governance/Theo-1B-VC1.2-Channel-Members-Backend-Pass-1-VEP/theo_chat_add_member.function.json | binding | "httpTrigger" | §FJ — anonymous httpTrigger bindings (EasyAuth gates identity) |

## P1 — Feature identification
**Microstep:** VC-15 — the channel admin lifecycle, no-migration half. Walter-locked channels model: the admin can **rename** the channel and **transfer admin** to another current member.

**New handlers (2), on `vaultgpt-func-chat`; NO schema change:**
- `POST /api/theo_chat_rename_channel` `{ thread_id, name }` → `200 { thread_id, name }` — admin-gated; updates `name`.
- `POST /api/theo_chat_transfer_admin` `{ thread_id, new_admin_oid }` → `200 { thread_id, admin_oid }` — admin-gated; `new_admin_oid` must be a different current member; sets `admin_oid = new_admin_oid`.

**Out of scope (VC-15):** `leave` + `archive` (→ VC-16, need a migration — see the preamble split); the FE (rename input + transfer/leave controls = a vault-origin **VC-15-FE** VEP); a realtime rename/transfer push (members see it on their next `list_threads`/reload — same pattern as membership).

**Plan status:** VC tier Walter-directed, reconciled at VC-1 (PROCEED gap + Role-C future-trigger). VC-15's only doc delta is the API-Spec §2.10 routes (Role-C, Pass 4).

## P2 — Architecture & boundary reconciliation
**Handler family.** Both are Family-B HTTP handlers mirroring the Primary Reference (`theo_chat_add_member`): `pg` Pool on the chat app's libpq `PG*` env; EasyAuth `x-ms-client-principal` OID; validate-before-SQL; `set_config` triad; participant + admin predicate; `{data,meta}`/`{error}` envelope; anonymous `httpTrigger`.
**Admin authority.** Gate on `admin_oid = caller` (VC-1.2), after a participant + `kind='channel'` check. Cited extension of the ownership family ("Default family: ownership-based").
**Boundary.** Reads/writes only `theo_chat_threads`. Per Golden §3 ("It MUST NOT read or write" `reporting_*`) no `reporting_*`/monolith/Blob/Graph/Foundry. Deploy target `vaultgpt-func-chat`; monolith + sidecar READ-ONLY ("the monolith `theo_message` is unchanged").
**Validation before SQL.** UUID `thread_id`/`new_admin_oid`; non-empty `name` ≤ 120; deterministic 400 before SQL.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| API-Spec §2.10 will gain the two routes. | Documentation-currency delta on the recorded VC tier. | **PROCEED** with a Role-C (Pass 4) amendment adding `theo_chat_rename_channel` / `theo_chat_transfer_admin` to `spec/THEO_API_SPEC.md` §2.10. Sequenced after Pass 3 deploy + curls. |
| No realtime rename/transfer push. | Members see the new name/admin on their next `list_threads`/reload (same as membership changes). | **PROCEED** — a server push is a later enhancement. |
| The stale schema §8 sentence "the shared Functions connection role bypasses RLS" contradicts the corrected reality (RLS IS enforced — the B7 timer-isolation SEC fix). VC-15's WITH-CHECK reasoning depends on RLS being enforced. | Not a VC-15 change; a pre-existing doc-currency error. VC-15 is CORRECT under the enforced-RLS reality (rename/transfer keep the caller a member; leave would violate WITH CHECK — hence deferred). | **PROCEED** — flagged for a separate Role-C to correct §8; does not block VC-15. |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**No external system in VC-15.** No Web PubSub/Blob/Graph/Foundry. Per Golden §4 a "new-domain or new-external-system helper" would need justification; VC-15 introduces none — pure Postgres UPDATE over `theo_chat_threads`.

## P4 — Contract reconciliation
Envelope unchanged (`{data,meta}`/`{error}`).
- `theo_chat_rename_channel` `{ thread_id, name }` → `200 { thread_id, name }`.
- `theo_chat_transfer_admin` `{ thread_id, new_admin_oid }` → `200 { thread_id, admin_oid }`.
Malformed input / blank/oversized name → 400; non-participant → 404; non-channel → 400; non-admin → 403; transfer to self → 400; new admin not a current member → 400.

## P5 — Error-model reconciliation
Mirrors the Primary Reference: 401 (no identity) / 400 (bad JSON, bad UUID, blank/long name, non-channel, self-transfer, non-member new admin) / 404 (non-participant, `isKnown`) / 403 (non-admin `isKnown`, or `42501`) / 23514 → 400 / else 500. `isKnown` errors carry `{code,status}` and re-map verbatim.

## P6 — Data-shape reconciliation
**No schema change.** Both handlers UPDATE existing `theo_chat_threads` columns (`name`, `admin_oid`) added at VC-1 / VC-1.2. `theo_` conventions unchanged (anchor "theo_projects").

## P7 — Idempotency / concurrency
- `rename` is naturally idempotent (same name → same state); a concurrent rename last-writer-wins (single UPDATE).
- `transfer_admin` sets `admin_oid`; re-issuing with the same `new_admin_oid` is a no-op-equivalent (admin already set).
- **Concurrency (R1):** the gate `SELECT … FOR UPDATE` row-locks the thread for the txn, so two concurrent admin operations on the same thread serialize (the second blocks until the first commits, then re-reads the fresh `admin_oid`). Additionally the admin predicate is IN the UPDATE (`WHERE id = $1 AND admin_oid = $caller`) with a 0-row → 403 guard, so even under READ COMMITTED an admin that loses authority to a concurrent transfer cannot rename/transfer (the UPDATE matches 0 rows). The `member_oids`-preserving UPDATE keeps the WITH CHECK satisfied.
- Both run in one `BEGIN…COMMIT`; `member_oids` is never mutated.

## P8 — Security / RLS reconciliation
**set_config triad.** Both open with the deployed triad.
**Admin-gate + participant scope; NO RLS change; WITH CHECK preserved.** Each handler fetches the thread under RLS + an explicit `$2 = ANY(member_oids)` predicate (non-participant → 404, no leak), then requires `kind='channel'` and `admin_oid = caller` (else 400/403). Because both UPDATEs leave `member_oids` unchanged (the admin/caller remains a member), the deployed thread UPDATE policy `USING (auth.uid() = ANY(member_oids)) WITH CHECK (auth.uid() = ANY(member_oids))` continues to be satisfied — no policy change is needed or made. (This is precisely why `leave`, which removes the caller from `member_oids`, is deferred to VC-16 where the RLS accommodation is designed.) No SECURITY DEFINER helper, no new elevated-read class.
**No leakage.** Responses carry `thread_id` + `name`/`admin_oid` (a participant identity) — no tokens/bodies/URLs.

## §MIGRATION — none
VC-15 introduces **no** DDL. Both operations mutate existing columns; RLS is unchanged. (The `admin_oid` column exists from VC-1.2; `name` from VC-1.) Nothing for Walter to run — deploy is the only Pass-3 action.

## §SM — Primary Reference (deployed `theo_chat_add_member.index.js`, byte-verbatim)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the deployed **`theo_chat_add_member`** (VC-1.2) — the closest deployed analog: an admin-gated channel mutation with the set_config triad, the participant+admin gate (404/400/403 discrimination), a `member_oids`-preserving UPDATE, and the `{data,meta}`/`{error}` envelope. Blob `003674dcd9dc457036eb6a372dcf34ecf3bfc8bc`:

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

### §SM-FJ — Primary Reference function.json (deployed `theo_chat_add_member.function.json`, byte-verbatim)

Blob `fc719a1d05d98f475f937bfd9eac68a093dc1322`:

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

## §HG.1 — `theo_chat_rename_channel` (GREENFIELD)

Admin-gated rename of a channel (`name` UPDATE; `member_oids` untouched → WITH CHECK holds). Full — file `theo_chat_rename_channel.index.js`:

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const MAX_NAME = 120;

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
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'name' is required and must be non-empty.", 400));
  }
  if (name.length > MAX_NAME) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'name' exceeds ${MAX_NAME} characters.`, 400));
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

    // Fetch the thread the caller can see (RLS + explicit participant predicate) and ROW-LOCK it
    // (FOR UPDATE) so a concurrent transfer_admin cannot change admin_oid between this check and the
    // UPDATE. Absent / not a participant → 404. Only a CHANNEL is renamable; only the ADMIN may rename.
    const t = await client.query(
      `SELECT kind, admin_oid FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids) FOR UPDATE`,
      [threadId, oid]
    );
    if (t.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    const row = t.rows[0];
    if (row.kind !== "channel") {
      throw buildKnownError("INVALID_REQUEST", "Only a channel can be renamed.", 400);
    }
    if (row.admin_oid !== oid) {
      throw buildKnownError("FORBIDDEN", "Only the channel admin can rename the channel.", 403);
    }

    // Admin predicate is IN the UPDATE (execution-time safe: 0 rows if admin changed under a race),
    // and the admin remains a member → the thread UPDATE RLS WITH CHECK (auth.uid() = ANY(member_oids)) holds.
    const upd = await client.query(
      `UPDATE public.theo_chat_threads SET name = $2, updated_at = now() WHERE id = $1 AND admin_oid = $3
       RETURNING id, name`,
      [threadId, name, oid]
    );
    if (upd.rowCount === 0) {
      throw buildKnownError("FORBIDDEN", "Only the channel admin can rename the channel.", 403);
    }

    await client.query("COMMIT");
    return send(context, 200, successBody({ thread_id: threadId, name: upd.rows[0].name }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_rename_channel failed", err);
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

**§FJ.1 — `theo_chat_rename_channel.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_rename_channel"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.2 — `theo_chat_transfer_admin` (GREENFIELD)

Admin-gated transfer of admin to another current member (`admin_oid` UPDATE; `member_oids` untouched → WITH CHECK holds). Full — file `theo_chat_transfer_admin.index.js`:

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
  const newAdminOid = typeof body.new_admin_oid === "string" ? body.new_admin_oid.trim() : "";
  if (!isUuid(newAdminOid)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'new_admin_oid' is required and must be a valid Entra object id.", 400));
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

    // Fetch the thread the caller can see (RLS + explicit participant predicate) and ROW-LOCK it
    // (FOR UPDATE) so two concurrent transfers can't both pass the admin check. Absent / not a
    // participant → 404. Only a CHANNEL has an admin; only the current ADMIN may transfer; and the
    // new admin must be a DIFFERENT current member.
    const t = await client.query(
      `SELECT kind, admin_oid, member_oids FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids) FOR UPDATE`,
      [threadId, oid]
    );
    if (t.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    const row = t.rows[0];
    if (row.kind !== "channel") {
      throw buildKnownError("INVALID_REQUEST", "Only a channel has an administrator.", 400);
    }
    if (row.admin_oid !== oid) {
      throw buildKnownError("FORBIDDEN", "Only the current channel admin can transfer admin.", 403);
    }
    if (newAdminOid === oid) {
      throw buildKnownError("INVALID_REQUEST", "You are already the admin; choose a different member.", 400);
    }
    if (!Array.isArray(row.member_oids) || !row.member_oids.includes(newAdminOid)) {
      throw buildKnownError("INVALID_REQUEST", "The new admin must be a current member of the channel.", 400);
    }

    // Admin predicate is IN the UPDATE (execution-time safe: 0 rows if admin changed under a race).
    // Only admin_oid changes; member_oids is untouched and the caller remains a member → the thread
    // UPDATE RLS WITH CHECK (auth.uid() = ANY(member_oids)) holds.
    const upd = await client.query(
      `UPDATE public.theo_chat_threads SET admin_oid = $2, updated_at = now() WHERE id = $1 AND admin_oid = $3
       RETURNING id, admin_oid`,
      [threadId, newAdminOid, oid]
    );
    if (upd.rowCount === 0) {
      throw buildKnownError("FORBIDDEN", "Only the current channel admin can transfer admin.", 403);
    }

    await client.query("COMMIT");
    return send(context, 200, successBody({ thread_id: threadId, admin_oid: upd.rows[0].admin_oid }));
  } catch (err) {
    if (client) { try { await client.query("ROLLBACK"); } catch {} }
    context.log.error("theo_chat_transfer_admin failed", err);
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

**§FJ.2 — `theo_chat_transfer_admin.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_transfer_admin"
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
After Pass 3 (deploy + curls): `spec/THEO_API_SPEC.md` §2.10 gains `POST theo_chat_rename_channel` `{ thread_id, name }` → `200 { thread_id, name }` and `POST theo_chat_transfer_admin` `{ thread_id, new_admin_oid }` → `200 { thread_id, admin_oid }` — both admin-gated (non-participant 404, non-channel 400, non-admin 403, self-transfer / non-member new-admin 400). No Schema delta (no DDL).

## §DEPLOY — Pass 3 (Claude Code, `vaultgpt-func-chat` only; no migration)
Deploy the two new function dirs (`theo_chat_rename_channel`, `theo_chat_transfer_admin`, each `index.js` + `function.json`) via Kudu VFS (§1E / DR-T7). No app-setting change, no monolith/sidecar write, **no migration**. Restart; confirm the function list now includes both; run §CURL.

## §CURL — post-deploy verification (Claude Code; az-login token; structural only)
1. `POST theo_chat_rename_channel { thread_id, name }` (as admin, on a verify channel) → `200`; `list_threads` shows the new name.
2. `POST theo_chat_transfer_admin { thread_id, new_admin_oid }` (as admin, to a current member) → `200 { admin_oid == new }`; a follow-up admin action by the OLD admin → `403` (they're no longer admin); transfer to self → `400`; transfer to a non-member → `400`; a non-admin caller → `403`; a non-channel → `400`.
No OIDs/bodies logged.

## §SM-NOTE — structural mirror
Both keep the Primary Reference boilerplate (envelope, principal/claim parsing, set_config triad, error map, `buildKnownError`, `isUuid`) verbatim; the participant+admin gate mirrors `add_member`; the UPDATEs preserve `member_oids` so the WITH CHECK holds. No new dependency, no new external system, no schema change.

## Requested Pass 2 verdict
APPROVED / REJECTED (Codex). On APPROVED: Claude Code deploys both handlers to `vaultgpt-func-chat` (Pass 3), runs §CURL, and lands the §API-SPEC Role-C (Pass 4). The rename/transfer/leave FE follows as vault-origin **VC-15-FE**; `leave` + `archive` (with their migration) are **VC-16**.

*End of Pass 1 Backend VEP (plan-only).*
