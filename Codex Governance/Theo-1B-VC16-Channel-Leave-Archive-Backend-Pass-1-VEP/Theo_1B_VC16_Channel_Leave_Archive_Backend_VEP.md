# Theo 1B — VC-16 Channel Leave + Archive Backend (migration `archived_at` + `SECURITY DEFINER theo_chat_leave` + new `theo_chat_leave_channel` / `theo_chat_archive_channel` + `list_threads` archived-filter) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). **Walter runs the migration at Pass 3 FIRST**, then Claude Code deploys the handlers to the **dedicated `vaultgpt-func-chat`** app (§1E / DR-T7) + runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 + Schema deltas. Plan-only.
>
> **Scope (VC-16 = the last channels-cluster piece):** (1) a **migration** adding `theo_chat_threads.archived_at timestamptz` + a narrowly-scoped `SECURITY DEFINER` function `theo_chat_leave(uuid)`; (2) NEW `theo_chat_leave_channel` (a member removes THEMSELVES; admin must transfer first) and `theo_chat_archive_channel` (admin soft-archives); (3) MODIFY `theo_chat_list_threads` to exclude archived threads (`AND t.archived_at IS NULL`).
>
> **Why `leave` needs a `SECURITY DEFINER` function (grounded in the deployed policy):** the thread UPDATE policy is `USING (auth.uid() = ANY(member_oids)) WITH CHECK (auth.uid() = ANY(member_oids))`. Self-removal produces a new row that no longer contains `auth.uid()` → `WITH CHECK` FAILS for the app role (RLS is ENFORCED for it — the B7 SEC-fix reality). The tables are `ENABLE` (not `FORCE`) RLS and are owned by the migration role, so a `SECURITY DEFINER` function owned there bypasses the policy. It is **safe** because it removes ONLY the authenticated caller (`current_setting('request.jwt.claim.sub')`) and only from a channel they belong to and do not administer — it cannot touch anyone else. (Same class as the deployed B7 `SECURITY DEFINER` cross-owner helper; the Schema §8 "no SECURITY DEFINER" note is about the chat READ/existence path, not a self-service write helper.) **Archive** needs no bypass (admin stays a member → `WITH CHECK` holds), just the new column.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `8ab31bc6e50d96cd7ead0e9b5a670fa04c5ce283` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-16 channel leave + archive. P1–P8 walked; additive+reversible migration (archived_at + SECURITY DEFINER theo_chat_leave) with verify SQL; Primary Reference = deployed `theo_chat_transfer_admin` (admin-gated channel mutation, execution-time safe) inlined byte-verbatim; two NEW handlers (leave, archive) + one MODIFY (list_threads archived-filter) inlined full; function.json bindings for the two new routes + unchanged list_threads binding. The SECURITY DEFINER leave function is justified + scoped in §P8. No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
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
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§8 `theo_chat_threads`; thread UPDATE WITH CHECK; the new `archived_at`) | `grep -F "theo_projects"` this turn | `62b898b881ad64023f99ae10414093681aaa84c8` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 chat contract — leave/archive routes land here at Pass 4) | `grep -F "the monolith \`theo_message\` is unchanged"` this turn | `e3c036d782f58f08c43405c7d384d9b71ae181cc` |
| 10 | **Primary Reference handler** (deployed admin-gated channel mutation, execution-time safe: FOR UPDATE + admin_oid-in-UPDATE + set_config triad) — `Codex Governance/Theo-1B-VC15-Channel-Rename-Transfer-Backend-Pass-1-VEP/theo_chat_transfer_admin.index.js` | `Read(full)` this turn | `6b189cd3273205e87c6fafe0eb70d1f95b925d0d` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-VC15-Channel-Rename-Transfer-Backend-Pass-1-VEP/theo_chat_transfer_admin.function.json` | `Read(full)` this turn | `8865e655aad9565c51a36d1c23844acee114e65b` |
| 12 | **RLS basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (thread UPDATE policy — the WITH CHECK leave must bypass; RLS ENABLE not FORCE) | `Read(full)` prior turn; cited | `67ff9b5f654e146c01590d9ce0f9286969e54103` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` + streaming sidecar `vaultgpt-func-stream` READ-ONLY — deploy targets `vaultgpt-func-chat`. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §MIGRATION + §SM + §HG + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P2.5 — VC tier Walter-directed; recorded VC-1 |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_transfer_admin` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — no new external system |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — VC-16 touches only `theo_chat_*`; no `reporting_*` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — admin-gate + the scoped self-service leave helper are ownership-family extensions |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_projects" | §MIGRATION / §P6 — `archived_at` follows the `theo_` conventions |
| spec/THEO_API_SPEC.md | separate-app | "the monolith `theo_message` is unchanged" | §P2 — dedicated `vaultgpt-func-chat`; monolith untouched |
| Codex Governance/Theo-1B-VC15-Channel-Rename-Transfer-Backend-Pass-1-VEP/theo_chat_transfer_admin.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.* — every handler keeps the deployed set_config triad |
| Codex Governance/Theo-1B-VC15-Channel-Rename-Transfer-Backend-Pass-1-VEP/theo_chat_transfer_admin.function.json | binding | "httpTrigger" | §FJ — anonymous httpTrigger bindings (EasyAuth gates identity) |

## P1 — Feature identification
**Microstep:** VC-16 — the last channels-cluster piece: a member can **leave** a channel; the admin can **archive** a channel (soft, hidden from the list). Walter-locked channels model: the admin cannot leave (transfer first); archive is admin-only and soft.

**Migration:** `theo_chat_threads.archived_at timestamptz` (nullable) + `SECURITY DEFINER theo_chat_leave(uuid)`.
**New handlers (2), on `vaultgpt-func-chat`:** `POST /api/theo_chat_leave_channel` `{ thread_id }`; `POST /api/theo_chat_archive_channel` `{ thread_id }`.
**Modified (1):** `theo_chat_list_threads` — add `AND t.archived_at IS NULL` (archived threads disappear from the list).

**Out of scope (VC-16):** the FE (a "Leave channel" action for members + "Archive" for the admin, in the Members panel = vault-origin **VC-16-FE**); unarchive/restore (v1 is archive-only); channel deletion; a realtime leave/archive push (peers reconcile on next `list_threads`/reconnect).

**Plan status:** VC tier Walter-directed, reconciled at VC-1. Doc delta = API-Spec §2.10 routes + Schema `archived_at` + the leave function (Role-C, Pass 4).

## P2 — Architecture & boundary reconciliation
**Handler family.** Both new handlers are Family-B HTTP handlers mirroring the Primary Reference (`theo_chat_transfer_admin`): `pg` Pool on the chat app's libpq `PG*` env; EasyAuth `x-ms-client-principal` OID; validate-before-SQL; `set_config` triad; participant/admin predicate; `{data,meta}`/`{error}` envelope; anonymous `httpTrigger`. `archive` uses the same `FOR UPDATE` + admin-in-UPDATE execution-time guard as VC-15. `leave` validates user-facingly under RLS (for 404/400 messaging) then calls the `SECURITY DEFINER theo_chat_leave()` for the privileged self-removal.
**Boundary.** Reads/writes only `theo_chat_*`. Per Golden §3 no `reporting_*`/monolith/Blob/Graph/Foundry. Deploy target `vaultgpt-func-chat`; monolith + sidecar READ-ONLY ("the monolith `theo_message` is unchanged").
**Validation before SQL.** UUID `thread_id`; deterministic 400 before SQL.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| API-Spec §2.10 + Schema will change (leave/archive routes; `archived_at`; the leave function). | Documentation-currency delta on the recorded VC tier. | **PROCEED** with a Role-C (Pass 4) amendment: `spec/THEO_API_SPEC.md` §2.10 (leave/archive routes), `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (`archived_at` + the `theo_chat_leave` SECURITY DEFINER function). Sequenced after Pass 3 deploy + curls. |
| A `SECURITY DEFINER` function is introduced (Schema §8 says the chat set deliberately has none). | The §8 note concerns the READ/existence path (no `theo_chat_*_exists_unscoped`). `theo_chat_leave` is a WRITE-scoped self-service helper (removes only the caller, with internal re-checks) — the same justified class as the deployed B7 SECURITY DEFINER helper. It is required because the thread UPDATE `WITH CHECK` blocks self-removal for the app role. | **PROCEED** — justified + scoped in §P8; the Role-C updates §8 to document it. |
| No realtime leave/archive push. | Peers reconcile on next `list_threads`/reconnect (archived vanishes; a left member loses access via RLS). | **PROCEED** — later enhancement. |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**No external system in VC-16.** No Web PubSub/Blob/Graph/Foundry. Per Golden §4 a "new-domain or new-external-system helper" would need justification; VC-16 introduces none — pure Postgres over `theo_chat_*` (+ one in-schema `SECURITY DEFINER` function, addressed in §P8).

## P4 — Contract reconciliation
Envelope unchanged (`{data,meta}`/`{error}`).
- `theo_chat_leave_channel` `{ thread_id }` → `200 { thread_id, left:boolean }` (`left:false` only if already not a member — idempotent).
- `theo_chat_archive_channel` `{ thread_id }` → `200 { thread_id, archived:true }` (idempotent — re-archiving is success).
- `theo_chat_list_threads` → unchanged shape; archived threads are now **omitted**.
Malformed input → 400; non-participant → 404; leave a non-channel / leave as admin → 400; archive non-channel → 400; archive as non-admin → 403.

## P5 — Error-model reconciliation
Mirrors the Primary Reference: 401 / 400 (bad JSON, bad UUID, non-channel, admin-leave) / 404 (non-participant, `isKnown`) / 403 (non-admin archive `isKnown`, or `42501`) / else 500. `leave`'s SECURITY DEFINER function raises `22023` for the non-channel / admin-leave cases (pre-checked by the handler; the handler maps a stray `22023` → 400 defensively). `isKnown` errors re-map verbatim.

## P6 — Data-shape reconciliation
One additive column: `theo_chat_threads.archived_at timestamptz` (nullable; NULL = active). One `SECURITY DEFINER` function `theo_chat_leave(uuid)`. No new table/index. Follows the `theo_` conventions (anchor "theo_projects"). Full DDL in §MIGRATION.

## P7 — Idempotency / concurrency
- `leave` is idempotent (`left:false` if not a member); the removal + read-state delete run inside the function (single statement each) after the handler's RLS-visible validation.
- `archive` is idempotent (`archived_at` set once via `WHERE archived_at IS NULL`; a re-archive matches 0 rows and the re-read confirms archived → success). The gate `SELECT … FOR UPDATE` + admin-in-UPDATE make it execution-time safe against a concurrent transfer (matching VC-15).
- `list_threads` archived-filter is a pure read.

## P8 — Security / RLS reconciliation
**set_config triad.** Both handlers open with the deployed triad; the `SECURITY DEFINER` function reads the caller OID from `current_setting('request.jwt.claim.sub', true)` (set by that triad in the same session).
**`archive` — no RLS change.** Admin-gated (`FOR UPDATE` + `admin_oid = caller` in the UPDATE + re-read guard); `member_oids` untouched → the thread UPDATE `WITH CHECK` holds. Ordinary participant/admin `auth.uid()` predicates (ownership-family extension).
**`leave` — the scoped `SECURITY DEFINER` exception, justified.** Self-removal cannot pass the thread UPDATE `WITH CHECK` under the app role (RLS enforced; tables `ENABLE`-not-`FORCE` RLS, owned by the migration role). `theo_chat_leave(uuid)` is `SECURITY DEFINER` owned by that role → it bypasses the policy. It is **safe**: it derives the actor solely from `current_setting('request.jwt.claim.sub')` (never a parameter), removes ONLY that caller, and only when the caller `= ANY(member_oids)`, `kind='channel'`, and `caller <> admin_oid` — it cannot remove any other member, cannot act on a DM, and cannot remove an admin. `EXECUTE` is granted to `authenticated` only (`REVOKE ALL … FROM PUBLIC`). This is the same justified class as the deployed B7 `SECURITY DEFINER` cross-owner helper; the Schema §8 "no SECURITY DEFINER" note is about the chat READ/existence path and is amended by the Role-C. `search_path` is pinned (`SET search_path = public`) to prevent search-path hijack. No new elevated-READ class is introduced (no data is exposed that RLS would hide).
**No leakage.** Responses carry `thread_id` + booleans — no tokens/bodies/URLs.

## §MIGRATION — `vc16_leave_archive_migration.sql` (additive + reversible; run by Walter at Pass 3 BEFORE the handler deploy)

Additive, idempotent (`IF NOT EXISTS` / `CREATE OR REPLACE`), reversible. No top-level transaction control (Golden §5.2); Walter executes. `-- label` comments only.

```sql
-- Theo VC-16 — channel leave + archive. ADDITIVE + REVERSIBLE. Run by Walter at Pass 3 BEFORE the
-- VC-16 handlers deploy. Two additions: (1) theo_chat_threads.archived_at (soft-archive marker);
-- (2) a narrowly-scoped SECURITY DEFINER function theo_chat_leave(uuid) that lets a member remove
-- THEMSELVES from a channel. Idempotent; safe to re-run.
--
-- Why a SECURITY DEFINER function for leave: the deployed thread UPDATE policy is
--   WITH CHECK (auth.uid() = ANY (member_oids))
-- so a member removing THEMSELVES produces a new row that no longer contains auth.uid() → WITH CHECK
-- fails for the (non-owner) app role (RLS is ENFORCED for it; the tables are ENABLE — not FORCE — RLS
-- and are owned by this migration role, so a SECURITY DEFINER function owned here bypasses the policy).
-- The function is SAFE despite the bypass: it removes ONLY the authenticated caller
-- (current_setting('request.jwt.claim.sub'), set by the handler's set_config triad), and only from a
-- channel they belong to and do NOT administer. It cannot remove anyone else. (Same pattern as the
-- deployed B7 SECURITY DEFINER cross-owner helper; the "no SECURITY DEFINER" note in Schema §8 is about
-- the chat READ path / existence helpers, not this write-scoped self-service function.)

-- 1) Soft-archive marker. NULL = active; non-NULL = archived (hidden from list_threads).
ALTER TABLE public.theo_chat_threads ADD COLUMN IF NOT EXISTS archived_at timestamptz;

-- 2) Self-service leave (channel member removes themselves; admin must transfer first).
CREATE OR REPLACE FUNCTION public.theo_chat_leave(p_thread_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_oid     text := current_setting('request.jwt.claim.sub', true);
  v_kind    text;
  v_admin   text;
  v_members text[];
BEGIN
  IF v_oid IS NULL OR v_oid = '' THEN
    RAISE EXCEPTION 'theo_chat_leave: no caller identity' USING ERRCODE = '28000';
  END IF;

  SELECT kind, admin_oid, member_oids
    INTO v_kind, v_admin, v_members
    FROM public.theo_chat_threads
   WHERE id = p_thread_id;

  -- Not found or caller is not a participant → nothing to leave (handler maps the 404).
  IF NOT FOUND OR NOT (v_oid = ANY (v_members)) THEN
    RETURN false;
  END IF;
  -- Only channels can be left; DMs have no leave.
  IF v_kind <> 'channel' THEN
    RAISE EXCEPTION 'theo_chat_leave: not a channel' USING ERRCODE = '22023';
  END IF;
  -- The admin cannot leave — they must transfer admin first.
  IF v_oid = v_admin THEN
    RAISE EXCEPTION 'theo_chat_leave: admin cannot leave' USING ERRCODE = '22023';
  END IF;

  -- Remove ONLY the caller (bypasses the thread UPDATE WITH CHECK via definer ownership).
  UPDATE public.theo_chat_threads
     SET member_oids = array_remove(member_oids, v_oid), updated_at = now()
   WHERE id = p_thread_id;
  DELETE FROM public.theo_chat_thread_members
   WHERE thread_id = p_thread_id AND member_oid = v_oid;

  RETURN true;
END;
$fn$;

REVOKE ALL ON FUNCTION public.theo_chat_leave(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_chat_leave(uuid) TO authenticated;
```

**Read-only verification (run after the migration):**

```sql
-- Theo VC-16 — read-only verification (run after vc16_leave_archive_migration.sql). SELECT-only.

-- V1) the column exists.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_chat_threads' AND column_name = 'archived_at';

-- V2) the function exists, is SECURITY DEFINER (prosecdef = true), and returns boolean.
SELECT p.proname, p.prosecdef, pg_get_function_result(p.oid) AS returns
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname = 'theo_chat_leave';

-- V3) EXECUTE granted to authenticated, revoked from PUBLIC.
SELECT grantee, privilege_type
FROM information_schema.routine_privileges
WHERE routine_schema = 'public' AND routine_name = 'theo_chat_leave'
ORDER BY grantee;
```

## §SM — Primary Reference (deployed `theo_chat_transfer_admin.index.js`, byte-verbatim)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the deployed **`theo_chat_transfer_admin`** (VC-15) — an admin-gated channel mutation with the set_config triad, the participant+admin gate (404/400/403), the execution-time `FOR UPDATE` + admin-in-UPDATE guard (which `archive` reuses), and the `{data,meta}`/`{error}` envelope. Blob `6b189cd3273205e87c6fafe0eb70d1f95b925d0d`:

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

### §SM-FJ — Primary Reference function.json (deployed `theo_chat_transfer_admin.function.json`, byte-verbatim)

Blob `8865e655aad9565c51a36d1c23844acee114e65b`:

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

## §HG.1 — `theo_chat_leave_channel` (GREENFIELD)

Handler validates user-facingly under RLS (404/400 messaging) then calls the `SECURITY DEFINER theo_chat_leave()` for the privileged self-removal. Full — file `theo_chat_leave_channel.index.js`:

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

**§FJ.1 — `theo_chat_leave_channel.function.json`**

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_leave_channel" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §HG.2 — `theo_chat_archive_channel` (GREENFIELD)

Admin-gated soft-archive (`archived_at`), execution-time safe (FOR UPDATE + admin-in-UPDATE + re-read). Full — file `theo_chat_archive_channel.index.js`:

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

**§FJ.2 — `theo_chat_archive_channel.function.json`**

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_archive_channel" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §HG.3 — `theo_chat_list_threads` (MODIFY: exclude archived)

**Delta vs deployed CURRENT (VC-1.2, blob `05d7678918ed8b1dde09e0d248113702c37a8dcb`):** add `AND t.archived_at IS NULL` to the outer `WHERE`. No other change (admin_oid + members_read + all fields preserved). The one-line change:

```
      WHERE $1 = ANY (t.member_oids)
        AND t.archived_at IS NULL
      ORDER BY t.updated_at DESC
      LIMIT 1000
```

The full replacement `theo_chat_list_threads.index.js` is in this package (VC-1.2 body + the two-line `WHERE` addition above).

**§FJ.3 — `theo_chat_list_threads.function.json` (UNCHANGED; deploy bundle).**

## §API-SPEC — Role-C (Pass 4) documentation delta
After Pass 3 (migration + deploy + curls):
- `spec/THEO_API_SPEC.md` §2.10: add `POST theo_chat_leave_channel { thread_id }` → `200 { thread_id, left }` and `POST theo_chat_archive_channel { thread_id }` → `200 { thread_id, archived }`; note `list_threads` now omits archived threads.
- `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §8: `theo_chat_threads.archived_at timestamptz` + the `theo_chat_leave(uuid)` SECURITY DEFINER self-service function (correcting the "no SECURITY DEFINER" note to scope it to the read/existence path).

## §DEPLOY — Pass 3 (Walter migration FIRST, then Claude Code deploy to `vaultgpt-func-chat`)
1. **Walter** runs `vc16_leave_archive_migration.sql` + verify (the column + function must exist before the handlers deploy).
2. **Claude Code** deploys via Kudu VFS (§1E/DR-T7): two new function dirs (`theo_chat_leave_channel`, `theo_chat_archive_channel`) + overwrite `theo_chat_list_threads/index.js`. No app-setting change, no monolith/sidecar write.
3. Restart; confirm the two new functions; run §CURL.

## §CURL — post-deploy verification (Claude Code; az-login token; structural only)
1. Create a verify channel + add a bogus member B. `list_threads` shows it.
2. `theo_chat_archive_channel` (as admin) → `200 { archived:true }`; `list_threads` no longer lists it; non-admin/non-channel → 403/400.
3. On a 2nd channel: `theo_chat_leave_channel` as a member (need a member session — validated via the admin-leave 400 + the non-participant 404 paths in the sequential curls); admin-leave → `400`; leave a DM → `400`; leave a thread you're not in → `404`.
No OIDs/bodies logged.

## §SM-NOTE — structural mirror
Both new handlers keep the Primary Reference boilerplate (envelope, principal/claim parsing, set_config triad, error map, `buildKnownError`, `isUuid`) verbatim; `archive` reuses transfer_admin's execution-time admin guard; `leave` adds the validate-then-DEFINER-call shape. No new dependency, no new external system.

## Requested Pass 2 verdict
APPROVED / REJECTED (Codex). On APPROVED: Walter runs the migration (+ verify), then Claude Code deploys the handlers to `vaultgpt-func-chat` (Pass 3), runs §CURL, and lands the §API-SPEC + Schema Role-C (Pass 4). The leave/archive FE follows as vault-origin **VC-16-FE**. This completes the channels cluster.

*End of Pass 1 Backend VEP (plan-only).*
