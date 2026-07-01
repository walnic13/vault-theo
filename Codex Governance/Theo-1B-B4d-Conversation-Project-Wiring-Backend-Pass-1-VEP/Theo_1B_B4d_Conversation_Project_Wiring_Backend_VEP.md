# Theo 1B — B4d Conversation↔Project Wiring (backend: `theo_set_conversation_project` + `theo_list_conversations` `?projectId`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handlers provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier **B4d (backend)** — the data that makes a chat "belong to" a project: (1) a **new** `theo_set_conversation_project` handler the FE calls once after a project chat's first turn returns a `conversation_id`, owner-scoped, that links the conversation to the project (`theo_conversations.project_id`, the column deployed in B3); (2) an **additive `?projectId` filter** on the deployed `theo_list_conversations` so a project can list *all* its chats (not just whatever fits the Recents window). **The model gateway handlers (`theo_message` / `theo_message_stream`) are UNTOUCHED** — linking is a separate concern, kept out of the streaming path. No migration (the `project_id` column + `theo_conversation_exists_unscoped` helper exist from B2/B3). Every query is explicitly `created_by = $oid`-scoped; RLS is the second layer. The FE half (send the setter call, restore the project on reload, per-project chat list) is the separate B4d-FE microstep; the project-home redesign is B4e.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `1e2edcbc43fda1442938db07215f56eab26ee916` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference (Golden §2) = the **deployed** `theo_update_user_memory` **pair** — same-repo Theo owner-scoped UPDATE pattern (BEGIN / `set_config` triad / owner-scoped UPDATE / 0-row → `_exists_unscoped` → 403/404 / COMMIT; inlined verbatim §SM) and its deployed `function.json` (§SM-FJ). `theo_set_conversation_project` is a GREENFIELD handler mirroring that pattern over `theo_conversations`, plus a project FK-ownership pre-check (the same `SELECT 1 … created_by` idiom the family uses in `theo_create_user_memory`; ALLOWED DELTA §SM-TABLE), using the deployed `theo_conversation_exists_unscoped` helper (B2 §5) for 403/404. `theo_list_conversations` gains one additive optional `?projectId` filter (§CHANGESET), a byte-minimal delta to the deployed SEC-fix handler. Contract basis = deployed `theo_conversations` (Schema §3/§5; `project_id uuid NULL` FK→`theo_projects`) + Backend Plan Tier B4. No migration. API Spec §2.1 list row + a new §2.2/§2.1 set-project row follow post-deploy (§GR G-2). Validation precedes SQL. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `grep -F "Gap Register"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `Grep("§4A\\.1")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §4 deltas; §5 SM) | `grep -F "selects **exactly one** deployed handler file"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (pass axis) | cited | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B4) | `grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_conversations.project_id`; §5 `theo_conversation_exists_unscoped`) | `grep -F "theo_conversation"` this turn | `59924ef06b64e62b4cc6a268793d52bd82945cbd` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 List conversations; §2.2 Projects) | `Read(full)` + `grep -F "List conversations"` this turn | `4b978ef428c7b519387a7c8edc4838432a3f72bf` |
| 10 | **Primary Reference handler** (deployed owner-scoped UPDATE + `_exists_unscoped`) — `Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_update_user_memory.index.js` | `Read(full)` this turn | `8e4f5e97bf6f8c68acc135a6a6eca25efb006e04` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_update_user_memory.function.json` | `Read(full)` this turn | `23da9799f1a9ecded001393d2be28fd2cf0612fa` |
| 12 | **Modify-base** (deployed SEC-fix) — `Codex Governance/Theo-1B-B3-SEC-User-Isolation-Fix-Pass-1-VEP/theo_list_conversations.index.js` | `Read(full)` this turn | `9430e35074bee24cb2c8b27c0554267a7df7275a` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. `theo_message` / `theo_message_stream` NOT touched.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §P1 — B4d conversation↔project wiring |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_update_user_memory` |
| Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_update_user_memory.function.json | binding | "httpTrigger" | §SM-FJ — Primary Reference function.json |
| Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_update_user_memory.index.js | mutation | "theo_user_memory_exists_unscoped" | §HG.1 — 0-row → `theo_conversation_exists_unscoped` 403/404 (same idiom) |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §HG.1–§HG.2 — every query scoped `created_by = $oid` |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3/§5 | "theo_conversation" | §HG.1 — operates over `theo_conversations.project_id`; `theo_conversation_exists_unscoped` helper |
| spec/THEO_API_SPEC.md | §2.1 | "List conversations" | §CHANGESET — `theo_list_conversations` gains `?projectId` |

---

## P1 — Feature identification
**Microstep:** Theo Phase 1B **Tier B4d (backend)** — conversation↔project wiring (Rule Anchor on Plan Tier B4). Two deliverables:
1. **`theo_set_conversation_project`** (new) — links a conversation to a project (`theo_conversations.project_id`). The FE (B4d-FE) calls it once after a project chat's first turn returns a `conversation_id`; owner-scoped, idempotent (sets only when currently null — a conversation belongs to one project), verifies both the project and the conversation are the caller's.
2. **`theo_list_conversations` `?projectId`** — an additive optional filter so a project lists all its own conversations.

Together these let the FE tag a chat with its project, restore the project on reload (`theo_conversations.project_id` is already returned by `theo_list_conversations` / `theo_get_conversation`), and render a per-project chat list. **`theo_message` / `theo_message_stream` are deliberately NOT modified** — the gateway/streaming path stays exactly as deployed; linking is a discrete owner-scoped write.

## P2 — Architecture & boundary reconciliation
- **Family-B.** `pg` Pool over `POSTGRES_CONNECTION_STRING`; per-request `set_config` triad; the setter mutation is `connect→BEGIN→…→COMMIT` with `catch ROLLBACK`; the list read adds no transaction. Identical helper block to the deployed Theo handlers.
- **Explicit ownership (SEC-fix discipline).** Every query carries `created_by = $oid`; the shared connection role bypasses RLS, so the predicate enforces isolation. The setter verifies the referenced **project** is owned (`SELECT 1 … created_by` → 404) and the **conversation** is owned (0-row → `theo_conversation_exists_unscoped` → 403/404) before writing. The list filter is `created_by = $oid AND project_id = $projectId`.
- **Validation before SQL.** `isUuid` on `conversation_id`/`project_id` (setter) and `?projectId` (list) — deterministic 400s before any query.
- **Boundary.** Reads/writes only `theo_conversations` + an ownership `SELECT 1` on `theo_projects` (both deployed); **no `reporting_*`**; **no change to `theo_message`/`theo_message_stream`**; no Blob; no model gateway. Idempotent set-once (`project_id IS NULL` guard) — cannot reassign a conversation to a different project.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** One new function (`theo_set_conversation_project`) + one redeploy of `theo_list_conversations` (additive `?projectId`). **No migration** (`theo_conversations.project_id` + `theo_conversation_exists_unscoped` are deployed from B2/B3). | **PRE-LAND** — §DEPLOY; Claude Code golden curls confirm (set → list-by-project → idempotency → cross-user isolation). |
| G-2 | **Authority-doc update post-deploy.** API Spec §2.1 gains the `?projectId` filter note on the list row, and a new row for `theo_set_conversation_project`. | **PRE-LAND** — a short API-Spec Role-C follows deploy (mirrors the B4a/B4b Projects Role-C), before the B4d-FE VEP cites it (T22 prevention). |
| G-3 | **FE wiring + project-home redesign.** Sending the setter call after the first project turn, restoring `chatProjectId` on reload, and the per-project chat list (B4d-FE); the chats-first ProjectDetail redesign + collapsible knowledge/instructions + artifact-panel close-on-navigate (B4e). | **PROCEED (future-trigger).** Separate, sequenced microsteps; not in this pack. |

No write SQL executes in this pack (plan only); no migration. No `reporting_*` change.

## P3 — Backend / contract grounding
Contract basis = deployed `theo_conversations` (Schema §3/§5; `project_id uuid NULL` FK→`theo_projects` ON DELETE SET NULL; `theo_conversation_exists_unscoped(uuid)` helper). Response envelope = standard `{ data, meta }` / `{ error }`. Endpoints: `POST /api/theo_set_conversation_project` `{ conversation_id, project_id }` → `{ data: { conversation_id, project_id } }` (new); `GET /api/theo_list_conversations?projectId=<uuid>` (additive optional filter; existing `?limit` unchanged). API Spec rows land post-deploy (G-2).

## P4 — Per-handler contract
- **`theo_set_conversation_project`** (POST): validates `conversation_id`/`project_id` uuids (400); verifies project owned (404) + conversation owned (0-row → 403 existing-foreign / 404 absent via `theo_conversation_exists_unscoped`); `UPDATE theo_conversations SET project_id=$1, updated_at=now() WHERE id=$2 AND created_by=$3 AND project_id IS NULL` (idempotent — an already-linked conversation returns its current `project_id` unchanged) → **200** `{ conversation_id, project_id }`.
- **`theo_list_conversations`** (GET): unchanged except an additive optional `?projectId` (uuid → 400 if malformed); when present, `WHERE created_by=$1 AND project_id=$2 ORDER BY updated_at DESC, id DESC LIMIT $n`. Existing behaviour (no `?projectId`) byte-identical.

## P5 — Component reference grounding
Primary Reference (Golden §2) = the **deployed** `theo_update_user_memory` **pair** — the owner-scoped UPDATE pattern (`set_config` triad; `UPDATE … WHERE id AND created_by`; 0-row → `_exists_unscoped` → 403/404; 42501/isKnown mapping), inlined byte-identical §SM/§SM-FJ. `theo_set_conversation_project` mirrors it over `theo_conversations`, adding a project FK-ownership `SELECT 1 … created_by` pre-check (the same idiom `theo_create_user_memory` uses; ALLOWED DELTA §SM-TABLE) and the `project_id IS NULL` set-once guard (ALLOWED DELTA — the RLS-scoped query). `theo_list_conversations` is an EXACT copy of the deployed SEC-fix handler plus the additive `?projectId` filter (§CHANGESET). No new external-system helper (no DEVIATION).

## P6 — Repository & active-surface grounding
New artifacts: `theo_set_conversation_project.index.js` + `.function.json`; modified `theo_list_conversations.index.js` (+ `.function.json` unchanged). No migration. `theo_message`/`theo_message_stream` unchanged. Guardrails: no browser storage (backend); no `reporting_*`; explicit `created_by` on every query; `node --check` clean both handlers; `function.json` methods = POST (setter) / GET (list), routes match handler names, `authLevel` anonymous.

## P7 — Risk / regression
- **Greenfield setter:** new function; no change to deployed handlers/tables/policies; no migration.
- **`theo_list_conversations` additive filter:** default path (no `?projectId`) is byte-identical (verified §CHANGESET); the filter only narrows results for the caller's own rows.
- **Idempotent + set-once:** the `project_id IS NULL` guard means a conversation is linked at most once and cannot be reassigned; repeated FE calls are safe no-ops.
- **Gateway untouched:** `theo_message`/`theo_message_stream` are not modified — no streaming/chat regression risk.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3 PROCEED future-trigger); Primary Reference inlined byte-identical (§SM/§SM-FJ); the `theo_list_conversations` additive delta shown as a diff (§CHANGESET) + full modified handler (§HG.2); the new setter full (§HG.1) + `function.json` (§FJ.1), each `node --check` / JSON-valid; Structural Mirror (§SM-TABLE) + parity checklist (§PARITY). No migration. Plan-only. On Codex APPROVAL, Walter deploys the setter + redeploys `theo_list_conversations`; Claude Code golden-curls (set → list-by-project → idempotency → validation → cross-user isolation); then the API-Spec Role-C (G-2); then B4d-FE.

---

## §CHANGESET — `theo_list_conversations` additive delta (diff-verified vs deployed SEC-fix `9430e35`)
Two additions only; the default (`?projectId` absent) path is byte-identical.
```
+ // (helper) isUuid — added (mirrors every other Theo handler)
+ function isUuid(value) { return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value); }

  // ...after the `limit` parse...
+ let projectId = null;
+ if (req.query && typeof req.query.projectId === "string" && req.query.projectId.trim() !== "") {
+   projectId = req.query.projectId.trim();
+   if (!isUuid(projectId)) return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'projectId', when supplied, must be a valid UUID.", 400));
+ }

  // ...the single SELECT becomes a dynamic WHERE (created_by always $1; optional project_id; LIMIT last)...
- WHERE created_by = $1
- ORDER BY updated_at DESC, id DESC
- LIMIT $2
- [oid, limit]
+ WHERE ${conditions.join(" AND ")}          // "created_by = $1" [+ " AND project_id = $2"]
+ ORDER BY updated_at DESC, id DESC
+ LIMIT $${limitParam}                        // limit is always the last positional param
+ params                                       // [oid] (+ projectId) + limit
```

---

## §SM — Primary Reference (deployed `theo_update_user_memory`, byte-identical; owner-scoped UPDATE + `_exists_unscoped`)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const KIND_MAX_LEN = 64;
const CONTENT_MAX_LEN = 4000;

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

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!isUuid(id)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'id' is required and must be a valid UUID.", 400));
  }

  // Editable fields: content, kind, salience (scope/project_id are immutable identity of the item).
  // At least one updatable field must be present.
  const updates = [];
  const params = [];

  if (body.content != null) {
    if (typeof body.content !== "string" || body.content.trim() === "") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'content', when supplied, must be a non-empty string.", 400));
    }
    if (body.content.trim().length > CONTENT_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'content' must be at most ${CONTENT_MAX_LEN} characters.`, 400));
    }
    params.push(body.content.trim());
    updates.push(`content = $${params.length}`);
  }

  if (body.kind != null) {
    if (typeof body.kind !== "string" || body.kind.trim() === "") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'kind', when supplied, must be a non-empty string.", 400));
    }
    params.push(body.kind.trim().slice(0, KIND_MAX_LEN));
    updates.push(`kind = $${params.length}`);
  }

  if (body.salience != null) {
    if (!Number.isInteger(body.salience)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'salience', when supplied, must be an integer.", 400));
    }
    params.push(body.salience);
    updates.push(`salience = $${params.length}`);
  }

  if (updates.length === 0) {
    return send(context, 400, errorBody("INVALID_REQUEST", "At least one updatable field ('content', 'kind', or 'salience') is required.", 400));
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

    // Explicit ownership scope (connection role bypasses RLS): id AND created_by = the signed-in OID.
    params.push(id);
    const idParam = params.length;
    params.push(oid);
    const oidParam = params.length;

    const updated = await client.query(
      `
      UPDATE public.theo_user_memory
      SET ${updates.join(", ")}, updated_at = now()
      WHERE id = $${idParam} AND created_by = $${oidParam}
      RETURNING
        id, scope, project_id, kind, content, source_conversation_id, salience, created_at, updated_at
      `,
      params
    );

    if (updated.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_user_memory_exists_unscoped($1::uuid) AS e`,
        [id]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this memory item.", 403)
        : buildKnownError("NOT_FOUND", "Memory item not found.", 404);
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ memory: updated.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_update_user_memory failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this memory item.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

## §SM-FJ — Primary Reference function.json (deployed `theo_update_user_memory.function.json`, byte-identical)
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_update_user_memory"
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

## §HG.1 — `theo_set_conversation_project/index.js` (full)
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

  const conversationId = typeof body.conversation_id === "string" ? body.conversation_id.trim() : "";
  if (!isUuid(conversationId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'conversation_id' is required and must be a valid UUID.", 400));
  }
  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
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

    // FK ownership (the connection role bypasses RLS, so FK existence does NOT prove ownership):
    // the referenced project MUST belong to the caller, else 404 (no leakage).
    const ownedProject = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
      [projectId, oid]
    );
    if (ownedProject.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // Fetch the conversation owner-scoped; 0 rows → 403 (existing-foreign) / 404 (absent) via helper.
    const conv = await client.query(
      `SELECT id, project_id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
      [conversationId, oid]
    );
    if (conv.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [conversationId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this conversation.", 403)
        : buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Set the project link only when currently unset (a conversation belongs to one project, set
    // once). Idempotent: an already-linked conversation returns its current project_id unchanged.
    let resultProjectId = conv.rows[0].project_id;
    if (resultProjectId == null) {
      const updated = await client.query(
        `
        UPDATE public.theo_conversations
        SET project_id = $1, updated_at = now()
        WHERE id = $2 AND created_by = $3 AND project_id IS NULL
        RETURNING project_id
        `,
        [projectId, conversationId, oid]
      );
      resultProjectId = updated.rowCount > 0 ? updated.rows[0].project_id : projectId;
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ conversation_id: conversationId, project_id: resultProjectId }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_set_conversation_project failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // FK violation: project_id not owned or absent (defensive; validated above).
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
## §FJ.1 — `theo_set_conversation_project/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_set_conversation_project"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.2 — `theo_list_conversations/index.js` (full; deployed SEC-fix + additive `?projectId`)
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
      WHERE ${conditions.join(" AND ")}
      ORDER BY updated_at DESC, id DESC
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
## §FJ.2 — `theo_list_conversations/function.json` (UNCHANGED — GET/OPTIONS, deployed)
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

---

## §SM-TABLE — Structural Mirror (every region → Primary Reference, with classification)
| Region | Primary Reference region (`theo_update_user_memory`) | Classification |
| --- | --- | --- |
| `pg` Pool + `ssl`; `corsHeaders` (POST); helper block (`send`/`nowIso`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`buildKnownError`/`isUuid`) | identical | EXACT |
| OID extraction + 401; `parseBody` + 400 | identical | EXACT |
| Input validation (deterministic 400s) | same discipline; `conversation_id`/`project_id` uuids | ALLOWED DELTA (validated field set) |
| `connect`→`BEGIN`→`set_config` triad | identical | EXACT |
| Project FK-ownership pre-check (`SELECT 1 FROM theo_projects WHERE id AND created_by` → 404) | same idiom as `theo_create_user_memory`'s FK-ownership check | ALLOWED DELTA (family idiom) |
| Owner-scoped fetch + 0-row → `theo_conversation_exists_unscoped` → 403/404 | identical to the memory update `_exists_unscoped` split (helper name differs) | ALLOWED DELTA (helper/table name) |
| Set-once UPDATE (`… WHERE id AND created_by AND project_id IS NULL RETURNING project_id`) | same owner-scoped UPDATE-RETURNING idiom | ALLOWED DELTA (RLS-scoped query; set-once guard) |
| `COMMIT` + success envelope (`{ conversation_id, project_id }`) | same `{ data, meta }` shape | ALLOWED DELTA (response payload) |
| `catch` ROLLBACK + 42501→403 / isKnown / 23503→404 / 500 | identical mapping (+ defensive 23503) | EXACT / ALLOWED DELTA |
| `theo_list_conversations` — deployed SEC-fix + `isUuid` + `?projectId` parse + dynamic WHERE | n/a (EXACT copy of the deployed handler + additive filter; §CHANGESET) | ALLOWED DELTA (additive filter) |
| `function.json` (httpTrigger, anonymous, underscore route; POST setter / GET list) | identical binding shape | EXACT / ALLOWED DELTA (method + route) |

No new external-system helper; no DEVIATION. `theo_message`/`theo_message_stream` unmodified.

## §PARITY — Golden Handler Standard parity checklist (§5.4)
- [x] Single canonical Primary Reference handler + function.json selected and inlined full-verbatim (§SM/§SM-FJ).
- [x] Structural Mirror Table present, every region classified + anchored (§SM-TABLE); additive list delta shown as a diff (§CHANGESET).
- [x] Executes as the signed-in user (OID); explicit `created_by` predicate on every query + project FK-ownership pre-check; RLS second layer.
- [x] Reads/writes only `theo_` tables; no `reporting_*`; no gateway-handler change; no tokens/OIDs/URLs leaked.
- [x] Input validated against contract; deterministic 400s before SQL; spec status codes (401/400/403/404/500).
- [x] No migration; no prohibited psql meta-commands (no governed `sql` blocks).
- [x] Deterministic golden curls for every endpoint (§CURL); `node --check` clean both handlers; `function.json` JSON-valid.

---

## §DEPLOY — Walter deploy steps (one new function + one redeploy; no migration, no env, no dependency)
1. Create `theo_set_conversation_project` (§HG.1 + §FJ.1).
2. Redeploy `theo_list_conversations` from §HG.2 (function.json §FJ.2 unchanged).
3. Reply "B4d backend deployed" → Claude Code runs §CURL.

## §CURL — verification plan (token via `az`; never printed; captured under `.local/`)
Uses the deployed `theo_create_project` (B4a) + a real chat turn to make a conversation:
1. **Setup** — `POST theo_create_project {name:"B4d Test"}` → 201 `project.id` (P); a `theo_message`/stream turn → `conversation_id` (C).
2. **Set** — `POST theo_set_conversation_project {conversation_id:C, project_id:P}` → **200** `{ conversation_id:C, project_id:P }`.
3. **List by project** — `GET theo_list_conversations?projectId=P` → 200; includes C; own rows only; **omits** conversations not linked to P.
4. **List unfiltered still works** — `GET theo_list_conversations` → 200; includes C (with `project_id=P`) among all threads.
5. **Idempotency** — `POST theo_set_conversation_project {conversation_id:C, project_id:P}` again → 200, `project_id` still P (set-once; no error).
6. **Validation** — bad `conversation_id`/`project_id` uuid → 400; `?projectId=not-a-uuid` → 400.
7. **Ownership** — set with a nonexistent `project_id` → 404; set a nonexistent `conversation_id` → 404; (existing-foreign → 403, needs a 2nd identity — not curl-run).
8. **Cleanup** — `theo_delete_project {id:P}` → 200 (sets C.project_id back to NULL via the FK ON DELETE SET NULL).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B4d Conversation↔Project Wiring (backend) Pass-1 Backend VEP (plan only).*
