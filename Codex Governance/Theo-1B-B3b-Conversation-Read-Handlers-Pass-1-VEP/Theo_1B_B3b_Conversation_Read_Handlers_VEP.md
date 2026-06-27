# Theo 1B — B3b Conversation Read Handlers (`theo_list_conversations` + `theo_get_conversation`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handlers provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier B3 (read side, B3b) — two new GREENFIELD read-only handlers over the deployed B2 substrate, under ownership RLS: `theo_list_conversations` (the user's threads, newest-first — backs Recents) and `theo_get_conversation` (a thread + its ordered messages with `citations` — backs reload, and gives the per-row read-back to confirm B3a persistence). Family-B **read** pattern (`pg` Pool → `set_config(oid)` → RLS `SELECT` → `client.release()`, no `BEGIN/COMMIT`), mirroring the deployed `reporting_list_entities`. The paired FE wiring (real recents + reload + echoing `conversation_id`) follows.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `31720ab34f72bf67134d1ca4b3f171680ee03841` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference handler (Golden §2) = the deployed `reporting_list_entities` (read pattern; inlined verbatim §HG.1). The get-by-id specifics (`isUuid` 400, by-id SELECT, `_exists_unscoped` 403/404) are the established Family-B pattern already deployed in `theo_message` (B3a, GCR #11) and `reporting_get_workpaper` (GCR #12) — referenced, blob-pinned. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 VEP Format + Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates; §2/§4) | `Read(offset=1, limit=30)` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §5 SM) | `Grep("selects \*\*exactly one\*\* deployed handler file")` this turn | `2ee83c036e21a5dabe3405b6532c3471c680da0b` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles; §1B DR-T2) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B3) | `Grep("theo_conversations\` + \`theo_messages\` handlers")` this turn | `1733bdf19053d7173b72bfa9f0cf64e725cfdd3f` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 conversation/message shapes) | `Grep("may attach a \`citations\` array to text blocks")` this turn | `b5bbd57e1544404ffe98d92fd33e98c8dc4f0289` |
| 9 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 DEPLOYED-B2 tables; §5 DDL) | `Read(full)` this turn | `2c9d013b9bbff00c8023a8a19497bbab5f97a4f7` |
| 10 | **Primary Reference handler** (deployed read pattern) — `../corporate-reporting/reference-artifacts/handlers/reporting_list_entities.index.js.md` | `Read(full, 1–176)` this turn | blob `7fd1568e2563e05bc2d95c4cece966f6377105ca` (corporate-reporting `38da0d6a722de6042ece0a6c5979b13dff7da736`) |
| 11 | Deployed `theo_message` (B3a; established `isUuid`/`_exists_unscoped` reference) — `api/theo_message/index.js` | `Read(full)` this turn | `549f9a57f8c05ed99b2ce5ac1e586e28109d1deb` |
| 12 | Get-by-id pattern reference — `../corporate-reporting/reference-artifacts/handlers/reporting_get_workpaper.index.js.md` (`isUuid` + by-id + 404) | `Read(offset=49, limit=70)` this turn | blob `9280231958623e5cef2083e96376966e41d0b94c` (corporate-reporting `38da0d6a722de6042ece0a6c5979b13dff7da736`) |

No ChatGPT advisory cited (§4D / T18). Read-only; writes nothing; no `reporting_*` access.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B3 | "theo_conversations` + `theo_messages` handlers" | §P1 / §HG.3 / §HG.5 — the list + get read handlers |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §P5 / §HG.1 — Primary Reference = deployed `reporting_list_entities` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §HG.3 / §HG.5 — `set_config(oid)`; RLS SELECT returns only the signed-in user's rows |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §2 | "Four separate policies per table" | §P3 — reads go through the deployed B2 SELECT ownership policy |
| spec/THEO_API_SPEC.md | §2.1 | "may attach a `citations` array to text blocks" | §HG.5 — `theo_get_conversation` returns each message's persisted `citations` |

---

## P1 — Feature identification
**Role/Decision Register (Orchestration §1A/§1B):** Claude Code authors (Pass 1); Codex reviews (Pass 2); Walter deploys (Pass 3); Claude Code golden-curls. **Microstep:** Theo Phase 1B **Tier B3** read handlers (Rule Anchor 3) — `theo_list_conversations` (Recents) + `theo_get_conversation` (reload + per-row read-back). Read-only over the DEPLOYED B2 substrate; ownership RLS. Completes the durable-chat loop (B3a writes; B3b reads) ahead of the paired FE wiring.

## P2 — Architecture & boundary reconciliation
- **Read pattern (Family-B):** `pg` Pool over `POSTGRES_CONNECTION_STRING` (as `vaultgpt_app`), per-request `set_config(oid)`, RLS-scoped `SELECT`, `client.release()` in `finally`; **no `BEGIN/COMMIT`** (read-only). Mirrors the deployed `reporting_list_entities` (§HG.1).
- **Get-by-id:** `theo_get_conversation` validates `conversationId` with the Family-B `isUuid` (deterministic 400 — established B3a / `reporting_get_workpaper`) and discriminates 403/404 via the deployed `theo_conversation_exists_unscoped` (B2).
- **Boundary:** reads only `theo_conversations` / `theo_messages` (deployed B2); **no `reporting_*` access**; no writes. `auth.uid()` / `vaultgpt_app` / default-ACL grant model are the verified shared-instance facts.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** Two new functions (`theo_list_conversations`, `theo_get_conversation`) added to the shared `vaultgpt-func-premium` app. `POSTGRES_CONNECTION_STRING` + `pg` already present (used by `reporting_*` + B3a). | **PRE-LAND** — enumerated in §DEPLOY; Claude Code golden curls confirm. |
| G-2 | **Paired FE wiring.** Recents/reload only become visible once the FE calls these + echoes `conversation_id`. | **PROCEED** — backend-first; the FE VEP follows (Theo FE regime). |
| G-3 | **API Spec contract.** Two new GET endpoints + their response shapes are not yet in §2.1. | **PROCEED** — additive; an API-Spec Role-C records them on land (B3 close-out). |
| G-4 | **Pagination.** `theo_list_conversations` caps at `limit` (default 50, max 200), newest-first; no cursor yet. | **PROCEED** — sufficient for Recents; cursor pagination is a later refinement if thread counts grow. |

## P3 — Schema grounding
All objects are **DEPLOYED** (Tier B2, verified): `theo_conversations` (SELECT — list + by-id), `theo_messages` (SELECT by `conversation_id`, ordered by `seq`), `theo_conversation_exists_unscoped(uuid)` (403/404). Reads go through the four-policy ownership RLS (Rule Anchor 6), SELECT policy keyed on `auth.uid()`. No schema change; no `reporting_*` object touched.

## P4 — Contract grounding
Two new GET endpoints (route convention `theo_<operation>_<entity>`): `GET /api/theo_list_conversations` (optional `?limit`) → `{ data: { conversations: [{id,title,model,project_id,app_key,created_at,updated_at}] } }`; `GET /api/theo_get_conversation?conversationId=<uuid>` → `{ data: { conversation: {…,app_context}, messages: [{id,seq,role,content,model,citations,created_at}] } }` (each message's `citations` is the persisted web-grounding array, Rule Anchor 7). Additive; API-Spec §2.1 Role-C on land (§GR G-3).

## P5 — Handler grounding
Primary Reference (Golden §2; Rule Anchor 4) = the deployed `reporting_list_entities` (`../corporate-reporting/reference-artifacts/handlers/reporting_list_entities.index.js.md`, blob `7fd1568e…`), inlined verbatim §HG.1 — the canonical Family-B **read** pattern (`pg` Pool, `set_config`, RLS SELECT, `42501`→403, `client.release()`, no txn). Both new handlers (§HG.3 list, §HG.5 get) are structural mirrors of it. The get's `isUuid` 400 + `_exists_unscoped` 403/404 are the established Family-B pattern already deployed in `theo_message` (B3a, GCR #11) and `reporting_get_workpaper` (GCR #12) — referenced, blob-pinned. Both `function.json` (§HG.4, §HG.6) follow the deployed Theo binding shape (GET/OPTIONS, underscore route, anonymous).

## SM — Structural Mirror (B3b handlers ↔ deployed `reporting_list_entities` §HG.1)
| Region | Classification | Basis |
| --- | --- | --- |
| `require("pg")` + module `pool`; `corsHeaders` (GET/OPTIONS); the 6 shared helpers (`send`/`nowIso`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`); OPTIONS→204; EasyAuth `oid` 401 | EXACT | byte-identical to §HG.1 (deployed `reporting_list_entities`) |
| Read body: `pool.connect()` → `set_config(oid)` → RLS `SELECT` → `successBody({…})`; `catch` `42501`→403 + 500; `finally` `client.release()` | EXACT-mirror | the §HG.1 read pattern; theo `SELECT`s target deployed B2 `theo_*` under ownership RLS |
| `theo_list_conversations`: `?limit` validation (400) + `SELECT … ORDER BY updated_at DESC LIMIT $1` → `{conversations}` | ALLOWED DELTA | the microstep's list contract (§P4) |
| `theo_get_conversation`: `isUuid` 400 on `conversationId`; by-id `SELECT`; `theo_conversation_exists_unscoped` 403/404; messages `SELECT … ORDER BY seq` → `{conversation, messages}` | ALLOWED DELTA | established Family-B get-by-id pattern (deployed `theo_message` B3a / `reporting_get_workpaper`); reads deployed B2 objects |
| `function.json` (both): GET/OPTIONS, underscore route, anonymous | ALLOWED DELTA | deployed Theo binding shape (per-entity route) |

No DEVIATION regions.

## WA — Walter authorization (Conformance §10 T12 / Golden §4) — quoted verbatim, predating this VEP
> "we want memory persistence within a project and over the entire user and their own chats and projects"

> "proceed please" (this turn — authorizing B3b read handlers per the design: backend-first list + get, FE wiring to follow)

Plus Theo Phase 1B Plan Tier B3 ("`theo_conversations` + `theo_messages` handlers", Rule Anchor 3).

## HG — Handler grounding (verbatim artifacts)

### HG.1 — Primary Reference handler (verbatim) — deployed `reporting_list_entities` (blob `7fd1568e…`)
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

const CLIENT_SITE_ID_MIN_LEN = 1;
const CLIENT_SITE_ID_MAX_LEN = 200;

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

  const clientSiteId = req.query && typeof req.query.clientSiteId === "string" ? req.query.clientSiteId.trim() : "";
  if (clientSiteId.length < CLIENT_SITE_ID_MIN_LEN || clientSiteId.length > CLIENT_SITE_ID_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'clientSiteId' is required and must be a non-empty string of length 1..200.", 400));
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

    const clientSiteAccessResult = await client.query(
      `
      SELECT 1
      FROM public.reporting_client_sites
      WHERE site_id = $1
        AND is_active = TRUE
      LIMIT 1
      `,
      [clientSiteId]
    );

    if (clientSiteAccessResult.rowCount === 0) {
      return send(context, 404, errorBody("NOT_FOUND", "Client site not found.", 404));
    }

    const entitiesResult = await client.query(
      `
      SELECT
        id,
        client_site_id,
        entity_name,
        functional_currency,
        entity_classification,
        tax_jurisdiction,
        federal_ein,
        incorporation_date,
        state_of_incorporation,
        country_of_tax_residence,
        naics_code,
        business_activity_desc,
        product_service_desc,
        address,
        created_by,
        created_at,
        updated_at
      FROM public.reporting_entities
      WHERE client_site_id = $1
      ORDER BY entity_name ASC, id ASC
      `,
      [clientSiteId]
    );

    return send(context, 200, successBody({ entities: entitiesResult.rows }));
  } catch (err) {
    context.log.error("reporting_list_entities failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list entities for this client site.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

### HG.3 — `theo_list_conversations/index.js` to deploy (COMPLETE, copy-paste ready)
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
    const n = parseInt(req.query.limit, 10);
    if (!Number.isInteger(n) || n < 1 || n > MAX_LIMIT) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'limit', when supplied, must be an integer 1..200.", 400));
    }
    limit = n;
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

    const result = await client.query(
      `
      SELECT
        id,
        title,
        model,
        project_id,
        app_key,
        created_at,
        updated_at
      FROM public.theo_conversations
      ORDER BY updated_at DESC, id DESC
      LIMIT $1
      `,
      [limit]
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

### HG.4 — `theo_list_conversations/function.json` (COMPLETE)
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

### HG.5 — `theo_get_conversation/index.js` to deploy (COMPLETE, copy-paste ready)
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
        updated_at
      FROM public.theo_conversations
      WHERE id = $1
      `,
      [conversationId]
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
      WHERE conversation_id = $1
      ORDER BY seq ASC, created_at ASC
      `,
      [conversationId]
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

### HG.6 — `theo_get_conversation/function.json` (COMPLETE)
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

## P6 — SQL grounding
No migration (B2 deployed). The SQL B3b executes is embedded in §HG.3/§HG.5 — parameterised RLS-scoped `SELECT`s on deployed `theo_conversations`/`theo_messages` + the `set_config` session context + the `theo_conversation_exists_unscoped` call. All parameterised; read-only; no `BEGIN/COMMIT`.

## P7 / CURL — Golden curls (Claude Code runs post-deploy)
Claude Code acquires a user token (`az`; never printed); captures under `.local/`:
1. **List** — `GET /api/theo_list_conversations` → 200, `data.conversations[]` includes the B3a conversation `00419de2-…` (title from its first user message), newest-first.
2. **Get (read-back)** — `GET /api/theo_get_conversation?conversationId=00419de2-…` → 200, `data.conversation` + `data.messages[]` = **4 ordered messages** (seq 0–3, alternating user/assistant) — the per-row confirmation of B3a persistence.
3. **Malformed id** — `?conversationId=not-a-uuid` → **400**.
4. **Foreign id** — a valid-UUID not owned → **404** (or 403 if it exists under another user).
5. **Limit validation** — `?limit=0` → **400**.

## DEPLOY — Walter deploy steps (two new functions; no migration, no new dependency)
1. Create function **`theo_list_conversations`** (folder under the app) with §HG.3 `index.js` + §HG.4 `function.json`.
2. Create function **`theo_get_conversation`** with §HG.5 `index.js` + §HG.6 `function.json`.
3. `POSTGRES_CONNECTION_STRING` + `pg` already present on the shared `vaultgpt-func-premium` app (reporting + B3a). No new secret, no migration.
4. Notify Claude Code to run the §CURL golden curls.

## P8 — VEP assembly + mechanical lint
GCR (§3) + Rule Anchor Table (§5) open the pack; P1–P8 walked; Gap Register present (G-1…G-4); §SM classifies every region (no DEVIATION); §WA quotes the authorization; §HG.1/§HG.3–§HG.6 inline the artifacts verbatim. On Codex APPROVAL, Walter deploys the two functions; Claude Code runs §CURL (incl. the per-row read-back confirming B3a persistence).

```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B3b-Conversation-Read-Handlers-Pass-1-VEP/Theo_1B_B3b_Conversation_Read_Handlers_VEP.md" --repo-root .
PASS  Codex Governance/Theo-1B-B3b-Conversation-Read-Handlers-Pass-1-VEP/Theo_1B_B3b_Conversation_Read_Handlers_VEP.md
exit code: 0
```
(Codex re-runs the same command per its §1A hard gates.)

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B3b Conversation Read Handlers Pass-1 Backend VEP (plan only).*
