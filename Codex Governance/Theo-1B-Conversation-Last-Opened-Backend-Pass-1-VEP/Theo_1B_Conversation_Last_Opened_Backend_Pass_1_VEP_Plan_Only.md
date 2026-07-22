# Theo 1B — Conversation `last_opened_at` (restore-last-opened) Backend — Pass 1 Verified Evidence Pack (Plan Only)

Walter-directed (2026-07-22). Mobile reopen of Theo (a cold PWA reload) lands on a fresh new chat because Theo's active conversation is in-memory only with no restore. The robust fix restores the **exact last-opened** conversation. This backend pass adds a per-conversation `last_opened_at` flag: a migration adds the column; `theo_get_conversation` stamps it on open (owner-scoped); `theo_list_conversations` returns it and orders by it so the list head is the last-opened conversation. The frontend restore (select the list head on mount) is a paired vault-theo FE VEP that follows the API-Spec Role-C.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Pass: Pass 1
Grounding Mode: Full Baseline Grounding
Sub-phase Track: N/A
Turn issued against HEAD: fb412f9d54e17153b47fbacf108786b1fc015a05

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | CLAUDE CODE THEO BACKEND GOVERNOR STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Grounded (Local Grounding Workflow / VEP Format / Gap Register) this turn | blob `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` (structural, §8 fallback; git rev-parse this turn) |
| 2 | THEO API SPEC — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | Read (§0 scope; §2.1 conversations — list line 28, get line 29) this turn | blob `a2b420f9ffe2676abf5cb466bef5039f177ea9f9` (structural, §8 fallback) |
| 3 | THEO AZURE POSTGRES SCHEMA — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | Grounded (theo_conversations row §3; §5 B2 DDL pointer) this turn | blob `e6143cf55839120b696e03c6702a1144ac3cc2c9` (structural, §8 fallback) |
| 4 | THEO GOLDEN HANDLER STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | Grep + Read (§5.2 Golden SQL Standard) this turn | blob `d675b2822e6c5901a601a0023aa9f067b1967b14` (structural, §8 fallback) |
| 5 | THEO EXECUTION ORCHESTRATION STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | Read (role vocabulary; Decision-Register owner — no in-scope entry) this turn | blob `be066f12147d1eb13b51f025b275f5413ab51f0e` (structural, §8 fallback) |
| 6 | THEO GROUNDING CONFORMANCE STANDARD (backend) — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | Grep + Read (§3 GCR; §4 turn-type matrix — backend VEP Full Baseline set; §5 Rule Anchor) this turn | blob `7c0d902bdff3b6c0af475b483e31ed796214e57b` (structural, §8 fallback) |
| 7 | CODEX THEO BACKEND REVIEW STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | Grounded (Pass-2 reviewer behavior; hard gates) this turn | blob `d2e1b9881b6e2ed7d77921a055feffb0852257fd` (structural, §8 fallback) |
| 8 | THEO PHASE 1B BACKEND PLAN — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1B_BACKEND_PLAN.md | Grounded (conversation-persistence tier; this is an additive refinement of the B2/B3/B4 conversation substrate) this turn | blob `28183604ddfcfe80fa3f3dda6f78e437b88d32d6` (structural, §8 fallback) |
| 9 | THEO ARCHITECTURE AND STRUCTURE — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | Grounded (repo boundaries; func-theo monolith; §8 production order) this turn | blob `07451ce9d912830b3c15fedf74761d00c59f97b2` (structural, §8 fallback) |
| 10 | PRIMARY REFERENCE (deployed) — theo_get_conversation.index.js — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-1B-B3-SEC-User-Isolation-Fix-Pass-1-VEP/theo_get_conversation.index.js | Read (full) this turn | blob `aafa65bcbd69cdf2f6423b2add3b8950059ac0dd` |
| 11 | PRIMARY REFERENCE (deployed) — theo_get_conversation.function.json — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-1B-B3b-Conversation-Read-Handlers-Pass-1-VEP/theo_get_conversation.function.json | Read (full) this turn | blob `11257bb1733f0f351b04fc58e2355119c754902b` |
| 12 | PRIMARY REFERENCE (deployed) — theo_list_conversations.index.js — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-1B-B4d-Conversation-Project-Wiring-Backend-Pass-1-VEP/theo_list_conversations.index.js | Read (full) this turn | blob `539a3d1d09cdf7cb0b1c047626f187ab8eebbc51` |
| 13 | PRIMARY REFERENCE (deployed) — theo_list_conversations.function.json — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-1B-B3b-Conversation-Read-Handlers-Pass-1-VEP/theo_list_conversations.function.json | Read (full) this turn | blob `e29314aa4ef356267d4f6fbcb8ea0a25631bf849` |
| 14 | DDL TRUTH (deployed) — theo_conversations CREATE + RLS — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/b2_migration.sql | Grounded (theo_conversations table + owner policies) this turn | blob `2f2b6ddf8bf87525bc1a43e34bb7f82351a54b7c` |

## Rule Anchor Table

| Source doc | Clause id | Verbatim clause text | Applied in output at |
| ---------- | --------- | -------------------- | -------------------- |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.2 | "Migration files carry no top-level transaction control" | §4 — the migration has no BEGIN/COMMIT/ROLLBACK/END and uses `-- label` comments |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.2 | "Walter executes all writes/migrations" | §6 — Walter runs the migration as pgadmin_vault; Claude Code deploys handlers only |
| Codex Governance/Theo-1B-B3-SEC-User-Isolation-Fix-Pass-1-VEP/theo_get_conversation.index.js | ownership-scope comment | "the shared Functions connection role bypasses RLS" | §5 — the new stamp UPDATE is explicitly owner-scoped (`created_by = $2`), mirroring the handler's existing in-query isolation |
| Codex Governance/Theo-1B-B4d-Conversation-Project-Wiring-Backend-Pass-1-VEP/theo_list_conversations.index.js | list SELECT | "ORDER BY updated_at DESC, id DESC" | §5 — extended to `ORDER BY last_opened_at DESC NULLS LAST, updated_at DESC, id DESC` |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Full Baseline Grounding" | GCR — this backend VEP declares Full Baseline Grounding with the complete §4 doc set |

## §1 Feature Identification + boundary
- **Feature:** persist which conversation the user last OPENED, so the frontend can restore it on reopen (fixing the mobile cold-reload "new chat" bug). Additive: one nullable column + one owner-scoped stamp on the existing open path + one ORDER BY change. **No new handler, no new route, no new table.**
- **Handlers touched (deployed, `vaultgpt-func-theo` monolith):** `theo_get_conversation` (GET) — add the stamp; `theo_list_conversations` (GET) — return + order by the column. function.json for both is **unchanged** (route/methods/auth identical).
- **Schema:** `public.theo_conversations` gains `last_opened_at timestamptz` (nullable). RLS unchanged — the four deployed owner policies (`theo_conversation_select_own`/`_insert_own`/`_update_own`/`_delete_own`, keyed on `created_by = auth.uid()`) already cover the new column; the stamp is an owner-scoped UPDATE permitted by `theo_conversation_update_own`.
- **Boundary:** vault-theo backend only (migration + two handlers). No streaming/chat app, no other handler, no `theo_messages` change. The paired **API-Spec Role-C** (add `last_opened_at` to the list/get response shape) and **FE restore VEP** (select list head on mount) are separate, sequenced turns.

## §2 Handler-family + Golden SQL compliance
- **Family:** both handlers are Family-B read handlers (GET; EasyAuth `x-ms-client-principal` → Entra OID; `isUuid` input validation; owner-scoped queries because the shared Functions role bypasses RLS; `successBody`/`errorBody` envelope). The changes preserve the family shape — the get handler gains one owner-scoped write (the stamp) but remains a GET whose primary purpose is the read; no envelope, auth, or validation change.
- **Golden SQL §5.2:** the migration carries no top-level transaction control and no psql meta-commands; section labels are `-- label` comments; idempotent (`add column if not exists`, `create index if not exists`). Walter executes it.

## §3 Handler / Migration Contract
| Artifact | Route · Method · Auth | Change | Response-shape delta | Reference currency (deployed) |
|----------|----------------------|--------|----------------------|-------------------------------|
| `theo_get_conversation` (`.index.js` + `.function.json`) | `theo_get_conversation` · GET/OPTIONS · EasyAuth (anonymous trigger + OID claim) | Add `last_opened_at` to the conversation SELECT; add a best-effort owner-scoped `UPDATE … SET last_opened_at = now() WHERE id=$1 AND created_by=$2` after ownership is confirmed (try/catch — never fails the read). function.json UNCHANGED. | `data.conversation` gains `last_opened_at: string \| null` (the pre-stamp value for this response). No other field changes; messages unchanged. | index `aafa65bcbd69cdf2f6423b2add3b8950059ac0dd`; function.json `11257bb1733f0f351b04fc58e2355119c754902b` |
| `theo_list_conversations` (`.index.js` + `.function.json`) | `theo_list_conversations` · GET/OPTIONS · EasyAuth | Add `last_opened_at` to the SELECT column list; change ORDER BY to `last_opened_at DESC NULLS LAST, updated_at DESC, id DESC`. function.json UNCHANGED; limit/projectId params UNCHANGED. | each `data.conversations[]` gains `last_opened_at: string \| null`; list is now ordered last-opened-first. | index `539a3d1d09cdf7cb0b1c047626f187ab8eebbc51`; function.json `e29314aa4ef356267d4f6fbcb8ea0a25631bf849` |
| migration `migration_theo_conversations_last_opened_at.sql` | n/a (Walter runs as pgadmin_vault) | `ALTER TABLE … ADD COLUMN IF NOT EXISTS last_opened_at timestamptz` + `CREATE INDEX IF NOT EXISTS … (created_by, last_opened_at DESC)`. RLS unchanged. | — | DDL truth: `b2_migration.sql` `2f2b6ddf8bf87525bc1a43e34bb7f82351a54b7c` |

**Structural mirror (both handlers):** EXACT vs the deployed primary reference except the named regions above — imports/CORS/`send`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`isUuid`/auth/`set_config`/error handling are byte-identical. The full modified handlers are inlined verbatim in §5 (no ellipsis).

## §4 Migration (Golden SQL §5.2 — Walter executes as pgadmin_vault)
File: `migration_theo_conversations_last_opened_at.sql` (in this package).
```sql
alter table public.theo_conversations
  add column if not exists last_opened_at timestamptz;

create index if not exists idx_theo_conversations_created_by_last_opened_desc
  on public.theo_conversations (created_by, last_opened_at desc);

comment on column public.theo_conversations.last_opened_at is
  'Timestamp the owner last OPENED this conversation (stamped by theo_get_conversation on open). '
  'Distinct from updated_at (last message). Frontend restores the newest last_opened_at on reopen. '
  'NULL for conversations not opened since this migration; list ORDER BY uses NULLS LAST.';
```

## §5 Modified handlers (full verbatim — deploy artifacts in this package)

### `theo_get_conversation.index.js`
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

  const conversationId =
    req.query && typeof req.query.conversationId === "string" ? req.query.conversationId.trim() : "";
  if (!isUuid(conversationId)) {
    return send(
      context,
      400,
      errorBody("INVALID_REQUEST", "Query parameter 'conversationId' is required and must be a valid UUID.", 400)
    );
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

    // Explicit ownership scope: the shared Functions connection role bypasses RLS, so the
    // by-id read MUST also filter created_by = the signed-in OID. A non-owned id yields 0 rows
    // here and is then discriminated 403 (exists, not owned) vs 404 (absent) via the helper.
    const convResult = await client.query(
      `
      SELECT
        id,
        title,
        model,
        project_id,
        app_key,
        app_context,
        created_at,
        updated_at,
        last_opened_at
      FROM public.theo_conversations
      WHERE id = $1 AND created_by = $2
      `,
      [conversationId, oid]
    );

    if (convResult.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [conversationId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      return exists
        ? send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403))
        : send(context, 404, errorBody("NOT_FOUND", "Conversation not found.", 404));
    }

    // Restore-on-reopen: stamp last_opened_at now that ownership is confirmed. Owner-scoped
    // (created_by = the signed-in OID; the deployed theo_conversation_update_own policy permits it).
    // Best-effort — a stamp failure MUST NOT fail the read, so it is caught and logged only. The
    // returned conversation row above reflects the pre-stamp value; the frontend does not depend on
    // the stamp being reflected in this response (it reorders via theo_list_conversations).
    try {
      await client.query(
        `UPDATE public.theo_conversations SET last_opened_at = now() WHERE id = $1 AND created_by = $2`,
        [conversationId, oid]
      );
    } catch (stampErr) {
      context.log.error("theo_get_conversation last_opened_at stamp failed (non-fatal)", stampErr);
    }

    const messagesResult = await client.query(
      `
      SELECT
        id,
        seq,
        role,
        content,
        model,
        citations,
        created_at
      FROM public.theo_messages
      WHERE conversation_id = $1 AND created_by = $2
      ORDER BY seq ASC, created_at ASC
      `,
      [conversationId, oid]
    );

    return send(
      context,
      200,
      successBody({ conversation: convResult.rows[0], messages: messagesResult.rows })
    );
  } catch (err) {
    context.log.error("theo_get_conversation failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

### `theo_get_conversation.function.json` (UNCHANGED)
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_get_conversation"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### `theo_list_conversations.index.js`
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

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

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

  let limit = DEFAULT_LIMIT;
  if (req.query && typeof req.query.limit === "string" && req.query.limit.trim() !== "") {
    const raw = req.query.limit.trim();
    const n = /^[0-9]+$/.test(raw) ? parseInt(raw, 10) : NaN;
    if (!Number.isInteger(n) || n < 1 || n > MAX_LIMIT) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'limit', when supplied, must be an integer 1..200.", 400));
    }
    limit = n;
  }

  // B4d: optional per-project filter. When supplied, must be a valid UUID; scopes the list to the
  // signed-in user's conversations linked to that project (theo_conversations.project_id).
  let projectId = null;
  if (req.query && typeof req.query.projectId === "string" && req.query.projectId.trim() !== "") {
    projectId = req.query.projectId.trim();
    if (!isUuid(projectId)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'projectId', when supplied, must be a valid UUID.", 400));
    }
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

    // Explicit ownership scope: the shared Functions connection role bypasses RLS, so per-user
    // isolation MUST be enforced in the query itself (created_by = the signed-in OID), not by RLS.
    // Optional project filter appended; LIMIT is always the last positional parameter.
    const conditions = ["created_by = $1"];
    const params = [oid];
    if (projectId !== null) {
      params.push(projectId);
      conditions.push(`project_id = $${params.length}`);
    }
    params.push(limit);
    const limitParam = params.length;

    // Restore-on-reopen: last_opened_at (stamped by theo_get_conversation on open) leads the sort so
    // conversations[0] is the conversation the owner most recently OPENED. NULLS LAST keeps rows never
    // opened since the migration behind opened ones; updated_at DESC, id DESC remain the tiebreakers
    // (and the whole-list behavior pre-migration, when every last_opened_at is NULL).
    const result = await client.query(
      `
      SELECT
        id,
        title,
        model,
        project_id,
        app_key,
        created_at,
        updated_at,
        last_opened_at
      FROM public.theo_conversations
      WHERE ${conditions.join(" AND ")}
      ORDER BY last_opened_at DESC NULLS LAST, updated_at DESC, id DESC
      LIMIT $${limitParam}
      `,
      params
    );

    return send(context, 200, successBody({ conversations: result.rows }));
  } catch (err) {
    context.log.error("theo_list_conversations failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list conversations.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

### `theo_list_conversations.function.json` (UNCHANGED)
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_conversations"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §6 Implementation / deploy plan + API-Spec preview
1. **Walter runs the migration** `migration_theo_conversations_last_opened_at.sql` as `pgadmin_vault` against `vaultgpt-postgres-prod` (schema `public`).
2. **Claude Code deploys** the two handlers to `vaultgpt-func-theo` (Kudu VFS PUT + GET-back diff + restart + 401 probe, Golden Handler §5.5), after Codex APPROVED.
3. **API-Spec Role-C** (separate turn): add `last_opened_at: string | null` to the `theo_list_conversations` / `theo_get_conversation` response shapes in `spec/THEO_API_SPEC.md` §2.1, and note the list ORDER BY (last-opened-first). This MUST land before the FE VEP cites the field.
4. **FE restore VEP** (separate vault-theo FE VEP): on mount, once Recents load, if no active conversation and no draft, select `recents[0]` (now the last-opened) via the existing `selectRecent` path; add `last_opened_at` to `ConversationSummary`.

## §7 Gap Register
**PROCEED.**
1. **Read handler gains a write (stamp on get).** `theo_get_conversation` is no longer strictly read-only — it performs one owner-scoped `UPDATE` per open. Chosen as the minimal surface (no new endpoint / round-trip). The write is wrapped in try/catch so a stamp failure never fails the read, and is owner-scoped (RLS-equivalent isolation). **PROCEED.** (Alternative — a separate `theo_touch_conversation` write handler — is available if Codex/Walter prefer read/write separation.)
2. **Post-migration rollout.** Immediately after the migration every `last_opened_at` is NULL → `NULLS LAST` makes the list fall through to today's `updated_at DESC, id DESC` (no behavior change) until conversations are opened; the flag then takes over. **PROCEED.**
3. **RLS unchanged.** New nullable column on the existing RLS table; the four `theo_conversation_*_own` policies already cover it; the stamp UPDATE is permitted by `theo_conversation_update_own`. No policy change. **PROCEED.**
4. **Concurrency.** `last_opened_at = now()` is a last-writer-wins timestamp; opening the same conversation from two sessions is benign (both stamp ~now). **PROCEED.**

## §8 Out of scope
The FE restore (paired FE VEP); the API-Spec Role-C (separate turn); `theo_messages`; streaming/chat apps; any other handler; a per-user last-active pointer (the per-conversation timestamp is the chosen design); making the stamp reflected in the get response body.

## Requested action
Codex Pass-2 review (Grounding Conformance §3–§6; Golden Handler Pack incl. §5.2 Golden SQL; Schema/RLS; API contract). On APPROVED: Walter runs the migration as pgadmin_vault; Claude Code deploys the two handlers to `vaultgpt-func-theo` + probes; then the API-Spec Role-C, then the FE restore VEP.
