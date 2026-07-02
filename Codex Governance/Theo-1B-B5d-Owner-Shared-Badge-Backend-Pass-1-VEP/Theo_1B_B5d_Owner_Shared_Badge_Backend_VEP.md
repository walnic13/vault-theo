# Theo 1B — B5d Owner "Shared" Badge (backend: `theo_list_projects` + owner `member_count`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handler provided for Walter to redeploy at Pass 3, after which Claude Code runs the golden curl. **Microstep:** a one-column read broadening so the **owner's** Projects grid can badge a **privately-shared** project as "Shared" (today only `visibility='group'` badges; a private project the owner has invited specific members to shows no badge — Walter-observed on the SWA 2026-07-02). `theo_list_projects` gains a **`member_count`** column, gated to the caller's OWN rows (`CASE WHEN created_by = $1`) so a non-owner never learns another project's co-member count. **No migration, no new table, no new endpoint** — a single additive SELECT expression on the deployed B5c `theo_list_projects`. One MODIFIED handler; the paired B5d-FE badges "Shared" when `visibility==='group' || memberCount>0`.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `cf40248` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. **No migration** — a single additive read-only SELECT expression (`member_count`) on the deployed B5c `theo_list_projects`. Primary Reference (Golden §2) = the **deployed** `theo_list_projects` **pair** (B5c) — the exact handler being extended; inlined verbatim §SM/§SM-FJ. The MODIFIED handler is its own deployed self with the single ALLOWED DELTA of the owner-gated `member_count` column (`CASE WHEN created_by = $1 THEN (SELECT count(*) FROM theo_project_members …) ELSE 0 END`) — no WHERE change, no new table, no auth change. Contract basis = deployed `theo_projects` + `theo_project_members` (B5c). Config-only sharing unchanged; conversations/messages RLS untouched. Validation precedes SQL (unchanged from B5c). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `git grep -F "Gap Register"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §4 deltas; §5 SM) | `git grep -F "selects **exactly one** deployed handler file"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (pass axis) | cited | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4 projects CRUD) | `git grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `git grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_projects`) | `git grep -F "theo_projects"` this turn | `59924ef06b64e62b4cc6a268793d52bd82945cbd` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 projects) | `Read` this turn | `30f1cacb83458acf636f44113ddbbf72d09859d0` |
| 10 | **Primary Reference handler** (deployed B5c `theo_list_projects`) — `Codex Governance/Theo-1B-B5c-Per-Member-Invite-Backend-Pass-1-VEP/theo_list_projects.index.js` | `Read(full)` this turn | `b355f0356bb01503e19c03988d7ee456d3affd34` |
| 11 | **Primary Reference function.json** (deployed B5c) — `Codex Governance/Theo-1B-B5c-Per-Member-Invite-Backend-Pass-1-VEP/theo_list_projects.function.json` | `Read(full)` this turn | `e2e2f32fa9931426cb2e9a0f2fd02111d9c31e49` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. `theo_message`/`theo_message_stream` NOT touched. No table/migration/RLS change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §P1 — member_count extends the deployed projects list |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed B5c `theo_list_projects` |
| Codex Governance/Theo-1B-B5c-Per-Member-Invite-Backend-Pass-1-VEP/theo_list_projects.function.json | binding | "httpTrigger" | §SM-FJ — Primary Reference function.json |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P2 — owner-gated count is a cited, SELECT-only, owner-scoped read |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_projects" | §P6 — reads deployed `theo_projects` + `theo_project_members`; no shape change |

---

## P1 — Feature identification
**Microstep:** the owner "Shared" grid badge. Walter observed on the SWA (2026-07-02) that a private project shared with specific members shows no grid badge for the owner, while a group-visible one shows "Shared". `theo_list_projects` currently returns `is_owner` + `visibility` + `shared_with_me` (the last = "am I an invitee"), so the owner's card has no signal that a private project has invitees. This adds an owner-gated **`member_count`** so the paired B5d-FE badges "Shared" when `visibility==='group' || memberCount>0`.

## P2 — Architecture & boundary reconciliation
- **Family-B read** — unchanged shape (connect → set_config triad → SELECT → `{data,meta}`); the ownership predicate + validation are byte-identical to the deployed B5c handler.
- **Ownership family, owner-scoped read (Architecture §5.2).** `member_count` is computed **only for the caller's own rows** (`CASE WHEN created_by = $1 …`); a non-owner row (group-visible or shared-with-me owned by someone else) returns `0`, so no co-member count leaks. SELECT-only; RLS untouched.
- **No RLS/table/migration.** The subquery reads the existing `theo_project_members` (deployed B5c). No new policy, no recursion (a plain count subquery under the caller's session; `theo_project_members` SELECT policy already permits `invited_by = auth.uid()`, i.e. the owner sees its rows).
- **Boundary.** Reads only `theo_projects` + `theo_project_members`; no `reporting_*`, no Blob, no gateway, no Graph; `theo_message`/`theo_message_stream` untouched.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Redeploy (Walter).** One MODIFIED function (`theo_list_projects`) redeployed on `vaultgpt-func-premium`; no migration, no other function. | **PRE-LAND** — §DEPLOY; Claude Code golden curl confirms (owner private project with an invite → `member_count>0`; owner private with none → 0; non-owner group/shared row → 0). |
| G-2 | **Paired FE (B5d-FE).** `Project.memberCount` + the grid badge condition (`visibility==='group' || memberCount>0` for owner). | **PRE-LAND** — a small B5d-FE VEP follows this deploy (mirrors B5c-FE). |
| G-3 | **API Spec note.** §2.2 already lists `theo_list_projects` returning `shared_with_me`; a one-line note adds `member_count`. | **PROCEED** — folded into the next §2.2 Role-C touch (non-blocking; additive read field). |

## P3 — External-system reconciliation
None. Pure Postgres over the deployed schema; no Graph/Blob/gateway/`reporting_*`.

## P4 — Contract reconciliation
`theo_list_projects` rows gain `member_count` (integer; `0` for non-owner rows). All existing fields (`id`,`name`,`description`,`instructions`,`app_key`,`visibility`,`is_owner`,`shared_with_me`,`created_at`,`updated_at`) unchanged. Envelope `{data:{projects:[…]},meta}` unchanged. Additive — no existing consumer breaks.

## P5 — Error-model reconciliation
Unchanged from the deployed handler (42501→403; else 500). No new inputs, no new failure modes (the count is a read).

## P6 — Data-shape reconciliation
`member_count` = `count(*)::int` of `theo_project_members` rows for the project, only when `created_by = $1`; else `0`. No table/column added; reads deployed `theo_project_members` (B5c).

## P7 — Idempotency / concurrency
Read-only; no write, no ordering hazard.

## P8 — Security / RLS reconciliation
- Runs under the per-request `set_config` triad; ownership predicate + validation byte-identical to the deployed handler.
- **No leakage:** the count is owner-gated (`CASE created_by = $1`); a non-owner never learns another project's co-member count. Members/transcripts RLS untouched.
- No new elevated read, no SECURITY DEFINER, no policy change.

---

## §SM — Primary Reference (deployed B5c `theo_list_projects.index.js`, byte-verbatim)

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

    // B5c: return the caller's OWN projects, any GROUP-VISIBLE project (B5a), plus any project SHARED
    // WITH the caller via a theo_project_members row (per-member invite). Explicit predicate (the
    // shared connection role's RLS is the defense layer). `is_owner` (B5a) badges shared-by-others;
    // `shared_with_me` distinguishes an explicit invite from a group-visible project so the FE can
    // badge them differently. Newest-updated first (backs the Projects list).
    const result = await client.query(
      `
      SELECT
        id,
        name,
        description,
        instructions,
        app_key,
        visibility,
        (created_by = $1) AS is_owner,
        EXISTS (
          SELECT 1 FROM public.theo_project_members m
          WHERE m.project_id = theo_projects.id AND m.member_oid = $1
        ) AS shared_with_me,
        created_at,
        updated_at
      FROM public.theo_projects
      WHERE created_by = $1
        OR visibility = 'group'
        OR id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = $1)
      ORDER BY updated_at DESC, id DESC
      LIMIT 500
      `,
      [oid]
    );

    return send(context, 200, successBody({ projects: result.rows }));
  } catch (err) {
    context.log.error("theo_list_projects failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list projects.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

## §SM-FJ — Primary Reference function.json (deployed B5c, byte-verbatim)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_projects"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

---

## §HG.1 — `theo_list_projects` (MODIFIED — single ALLOWED DELTA: owner-gated `member_count`)

Diff vs the Primary Reference = exactly the added `member_count` SELECT expression (owner-gated `CASE`); every other line — helpers, `set_config` triad, WHERE, ORDER/LIMIT, error map, function.json — is byte-identical.

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

    // B5c: return the caller's OWN projects, any GROUP-VISIBLE project (B5a), plus any project SHARED
    // WITH the caller via a theo_project_members row (per-member invite). Explicit predicate (the
    // shared connection role's RLS is the defense layer). `is_owner` (B5a) badges shared-by-others;
    // `shared_with_me` distinguishes an explicit invite from a group-visible project so the FE can
    // badge them differently. Newest-updated first (backs the Projects list).
    const result = await client.query(
      `
      SELECT
        id,
        name,
        description,
        instructions,
        app_key,
        visibility,
        (created_by = $1) AS is_owner,
        EXISTS (
          SELECT 1 FROM public.theo_project_members m
          WHERE m.project_id = theo_projects.id AND m.member_oid = $1
        ) AS shared_with_me,
        -- B5d: owner-only invitee count so the grid can badge an OWNER's private project as "Shared"
        -- once it has member invites (visibility='group' already badges team-wide). Gated to the
        -- caller's OWN rows (CASE created_by = $1) so a non-owner never learns another project's
        -- co-member count; non-owners get 0 and rely on shared_with_me for their badge.
        (CASE WHEN created_by = $1
              THEN (SELECT count(*)::int FROM public.theo_project_members m2 WHERE m2.project_id = theo_projects.id)
              ELSE 0 END) AS member_count,
        created_at,
        updated_at
      FROM public.theo_projects
      WHERE created_by = $1
        OR visibility = 'group'
        OR id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = $1)
      ORDER BY updated_at DESC, id DESC
      LIMIT 500
      `,
      [oid]
    );

    return send(context, 200, successBody({ projects: result.rows }));
  } catch (err) {
    context.log.error("theo_list_projects failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list projects.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

**§FJ.1 — `theo_list_projects.function.json` (unchanged from deployed)**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_projects"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

---

## §DEPLOY (Walter, Pass 3)
Redeploy the single MODIFIED function `theo_list_projects` on `vaultgpt-func-premium` (index.js + function.json). No migration, no other function, no app-setting change. Restart; then Claude Code runs §CURL.

## §CURL (Claude Code golden verification, post-deploy)
Via the owner's az token + RO SQL cross-check:
1. **Owner, private project WITH an invite** → `theo_list_projects` row has `is_owner=true`, `visibility='private'`, `shared_with_me=false`, **`member_count>=1`**.
2. **Owner, private project with NO invite** → `member_count=0`.
3. **Owner, group-visible project** → `member_count` = its invitee count (badge already fires on `group`).
4. **Non-owner** (RO SQL impersonation of an invitee): the shared row returns `member_count=0` (owner-gated — no co-member leak) while `shared_with_me=true`.

---

*End of Pass 1 Backend VEP.*
