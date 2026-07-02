# Theo 1B — B4f Conversation Management (backend: `theo_rename_conversation` + `theo_delete_conversation`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handlers provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** the conversation-management completion of the deployed conversations surface — B3 built create/read/list; this adds **update (rename)** and **delete** to finish the HF-T2 ownership CRUD over `theo_conversations` (Walter-directed this session: "how do I rename/delete a chat"). Two GREENFIELD handlers: `theo_rename_conversation` (set title) and `theo_delete_conversation` (permanent; `theo_messages` cascade, `theo_attachments` unlink per the deployed FKs). Owner-scoped (`created_by = $oid`), RLS second layer; 403/404 via the deployed `theo_conversation_exists_unscoped`. **No migration** (table + helper deployed B2). **Ungated.** The FE affordances (rename/delete chat + rename/delete project) are the paired B4f-FE microstep; project rename/delete reuse the already-deployed `theo_update_project`/`theo_delete_project` (B4a).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `ae98ac7` (vault-theo, `development`; grounding blobs below were read at `089fec0` and are unchanged — the package commit only added this pack)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference (Golden §2) = the **deployed** `theo_update_user_memory` **pair** — same-repo Theo owner-scoped UPDATE pattern (BEGIN / `set_config` triad / owner-scoped UPDATE / 0-row → `_exists_unscoped` → 403/404 / COMMIT; inlined verbatim §SM/§SM-FJ). `theo_rename_conversation` mirrors it over `theo_conversations` (title update); `theo_delete_conversation` mirrors the family delete idiom (`theo_delete_user_memory`; ALLOWED DELTA). Both use the deployed `theo_conversation_exists_unscoped` helper (B2 §5). Contract basis = deployed `theo_conversations` (Schema §3/§5; `title text NULL`; `theo_messages` FK ON DELETE CASCADE; `theo_attachments.conversation_id` ON DELETE SET NULL) + Backend Plan HF-T2 (ownership CRUD over conversations). No migration. API Spec §2.1 gains rename/delete rows post-deploy (§GR G-2). Validation precedes SQL. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `grep -F "Gap Register"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `Grep("§4A\\.1")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §4 deltas; §5 SM) | `grep -F "selects **exactly one** deployed handler file"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (pass axis) | cited | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (HF-T2 conversations CRUD) | `grep -F "Ownership-scoped CRUD over the"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_conversations`; §5 `theo_conversation_exists_unscoped`) | `grep -F "theo_conversations"` this turn | `59924ef06b64e62b4cc6a268793d52bd82945cbd` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 conversations) | `Read` this turn | `1069096e2426a13d03c2c4b5177d10944f94b670` |
| 10 | **Primary Reference handler** (deployed owner-scoped UPDATE + `_exists_unscoped`) — `Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_update_user_memory.index.js` | `Read(full)` this turn | `8e4f5e97bf6f8c68acc135a6a6eca25efb006e04` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_update_user_memory.function.json` | `Read(full)` this turn | `23da9799f1a9ecded001393d2be28fd2cf0612fa` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. `theo_message`/`theo_message_stream` NOT touched.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | HF-T2 | "Ownership-scoped CRUD over the" | §P1 — conversation rename/delete complete the conversations CRUD (B3 = create/read) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_update_user_memory` |
| Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_update_user_memory.function.json | binding | "httpTrigger" | §SM-FJ — Primary Reference function.json |
| Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_update_user_memory.index.js | mutation | "theo_user_memory_exists_unscoped" | §HG.1/§HG.2 — 0-row → `theo_conversation_exists_unscoped` 403/404 (same idiom) |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §HG.1/§HG.2 — every query scoped `created_by = $oid` |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_conversations" | §HG.1/§HG.2 — operate over the deployed table; FK cascade/set-null on delete |

---

## P1 — Feature identification
**Microstep:** conversation management — the **update (rename)** and **delete** verbs that complete the HF-T2 ownership CRUD over `theo_conversations` (Rule Anchor: Plan HF-T2 "Ownership-scoped CRUD over the `theo_*` tables (conversations, …)"). B3 delivered create / read / list; this adds:
- **`theo_rename_conversation`** — set a conversation's `title` (the FE "rename chat").
- **`theo_delete_conversation`** — permanently delete the caller's conversation; `theo_messages` cascade (deleted with the thread), `theo_attachments.conversation_id` SET NULL (files survive, unlinked) per the deployed FKs.

Walter-directed this session (SWA feedback: rename/delete a chat). User-managed CRUD; no model/index/Blob traffic; `theo_message`/`theo_message_stream` untouched. **Out of scope (paired B4f-FE):** the FE rename/delete affordances for chats **and** projects (project rename/delete reuse the deployed `theo_update_project`/`theo_delete_project`, B4a — no new backend).

## P2 — Architecture & boundary reconciliation
- **Family-B.** `pg` Pool over `POSTGRES_CONNECTION_STRING`; per-request `set_config` triad; both are mutations `connect→BEGIN→…→COMMIT` with `catch ROLLBACK`. Identical helper block to the deployed Theo handlers.
- **Explicit ownership (SEC-fix discipline).** Every query carries `created_by = $oid`; the shared connection role bypasses RLS, so the predicate enforces isolation. 0-row update/delete → `theo_conversation_exists_unscoped` → 403 (existing-foreign) / 404 (absent).
- **Validation before SQL.** `isUuid` on `id`; non-blank `title` ≤200 (rename) — deterministic 400s before any query.
- **Boundary.** Reads/writes only `theo_conversations` (deployed B2); **no `reporting_*`**; no Blob, no model gateway, **no change to `theo_message`/`theo_message_stream`**. Delete relies on the deployed child-table FKs (`theo_messages` CASCADE; `theo_attachments` SET NULL) — no manual child cleanup needed.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** Two new functions on the shared `vaultgpt-func-premium` app. **No migration** (`theo_conversations` + `theo_conversation_exists_unscoped` deployed B2). | **PRE-LAND** — §DEPLOY; Claude Code golden curls confirm (rename → delete → cascade → validation → cross-user isolation). |
| G-2 | **Authority-doc update post-deploy.** API Spec §2.1 gains rename + delete rows for the conversations surface. | **PRE-LAND** — a short API-Spec Role-C follows deploy (mirrors B4d), before the B4f-FE VEP cites it (T22 prevention). |
| G-3 | **FE affordances (paired B4f-FE).** Rename/delete chat wire to these two handlers; rename/delete project reuse the deployed `theo_update_project`/`theo_delete_project` (B4a). | **PROCEED (future-trigger).** Separate FE microstep; not in this pack. |

No write SQL executes in this pack (plan only); no migration. No `reporting_*` change.

## P3 — Backend / contract grounding
Contract basis = deployed `theo_conversations` (Schema §3/§5; `title text NULL`; `theo_conversation_exists_unscoped(uuid)` helper; child FKs: `theo_messages` ON DELETE CASCADE, `theo_attachments.conversation_id` ON DELETE SET NULL). Response envelope = standard `{ data, meta }` / `{ error }`. Endpoints (new): `POST /api/theo_rename_conversation` `{ id, title }` → `{ conversation: { id, title } }`; `POST /api/theo_delete_conversation` `{ id }` → `{ deleted: true, id }`. API Spec §2.1 rows land post-deploy (G-2).

## P4 — Per-handler contract
- **`theo_rename_conversation`** (POST): `id` uuid + `title` (non-blank ≤200); `UPDATE theo_conversations SET title=$1, updated_at=now() WHERE id=$2 AND created_by=$3 RETURNING id, title`; 0 rows → 403/404 via helper → **200** `{ conversation: { id, title } }`.
- **`theo_delete_conversation`** (POST): `id` uuid; `DELETE FROM theo_conversations WHERE id=$1 AND created_by=$2 RETURNING id`; 0 rows → 403/404 → **200** `{ deleted: true, id }` (permanent; messages cascade, attachments unlink).

## P5 — Component reference grounding
Primary Reference (Golden §2) = the **deployed** `theo_update_user_memory` **pair** — owner-scoped UPDATE (`set_config` triad; `UPDATE … WHERE id AND created_by`; 0-row → `_exists_unscoped` → 403/404; 42501/isKnown/500 mapping), inlined byte-identical §SM/§SM-FJ. `theo_rename_conversation` mirrors it (title update over `theo_conversations`; ALLOWED DELTA = table/column/helper names + the validated field set). `theo_delete_conversation` mirrors the same family's delete idiom (`theo_delete_user_memory`: owner-scoped `DELETE … RETURNING id` + 0-row `_exists_unscoped` 403/404). No new external-system helper (no DEVIATION).

## P6 — Repository & active-surface grounding
New artifacts: `theo_rename_conversation.index.js` + `.function.json`; `theo_delete_conversation.index.js` + `.function.json`. No migration. `theo_message`/`theo_message_stream` unchanged. Guardrails: no browser storage; no `reporting_*`; explicit `created_by` on every query; `node --check` clean both handlers; `function.json` methods = POST, routes match handler names, `authLevel` anonymous.

## P7 — Risk / regression
- **Greenfield:** two new functions; no change to deployed handlers/tables/policies; no migration.
- **Isolation:** explicit `created_by` on every query (verified by the cross-user golden curl).
- **Permanent delete:** hard-deletes; ownership-checked first; children follow deployed FK actions (messages cascade; attachments unlink, not deleted).
- **Rename:** `title text NULL` has no DB CHECK; the handler enforces non-blank ≤200.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3 PROCEED); Primary Reference inlined byte-identical (§SM/§SM-FJ); two full handlers (§HG.1/§HG.2) + two `function.json` (§FJ.1/§FJ.2) inlined, each `node --check` / JSON-valid; Structural Mirror (§SM-TABLE) + parity checklist (§PARITY). No migration. Plan-only. On Codex APPROVAL, Walter deploys the two functions; Claude Code golden-curls (rename → delete → cascade → validation → cross-user isolation); then the API-Spec Role-C (G-2); then B4f-FE.

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

## §HG.1 — `theo_rename_conversation/index.js` (full)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const TITLE_MAX_LEN = 200;

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

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (title === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'title' is required and must be a non-empty string.", 400));
  }
  if (title.length > TITLE_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'title' must be at most ${TITLE_MAX_LEN} characters.`, 400));
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
    const updated = await client.query(
      `
      UPDATE public.theo_conversations
      SET title = $1, updated_at = now()
      WHERE id = $2 AND created_by = $3
      RETURNING id, title
      `,
      [title, id, oid]
    );

    if (updated.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [id]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this conversation.", 403)
        : buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ conversation: updated.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_rename_conversation failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
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
## §FJ.1 — `theo_rename_conversation/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_rename_conversation"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.2 — `theo_delete_conversation/index.js` (full)
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

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!isUuid(id)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'id' is required and must be a valid UUID.", 400));
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

    // Explicit ownership scope (connection role bypasses RLS): permanent delete of the caller's own
    // conversation. theo_messages CASCADE (deleted with the thread); theo_attachments.conversation_id
    // SET NULL (attachments survive, unlinked) per the deployed FKs (Schema §3).
    const deleted = await client.query(
      `DELETE FROM public.theo_conversations WHERE id = $1 AND created_by = $2 RETURNING id`,
      [id, oid]
    );

    if (deleted.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [id]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this conversation.", 403)
        : buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ deleted: true, id: deleted.rows[0].id }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_delete_conversation failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
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
## §FJ.2 — `theo_delete_conversation/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_delete_conversation"
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
| `pg` Pool + `ssl`; `corsHeaders` (POST); helper block | identical | EXACT |
| OID extraction + 401; `parseBody` + 400 | identical | EXACT |
| Input validation (deterministic 400s) | same discipline; `id` uuid (+ non-blank `title` ≤200 for rename) | ALLOWED DELTA (validated field set) |
| `connect`→`BEGIN`→`set_config` triad | identical | EXACT |
| Owner-scoped SQL — rename: `UPDATE theo_conversations SET title=…, updated_at=now() WHERE id AND created_by RETURNING id, title`; delete: `DELETE … WHERE id AND created_by RETURNING id` | same owner-scoped UPDATE / DELETE-RETURNING idiom (`theo_update`/`theo_delete_user_memory`) | ALLOWED DELTA (table/column names; verb) |
| 0-row → `theo_conversation_exists_unscoped` → 403/404 | identical to the memory `_exists_unscoped` split (helper name differs) | ALLOWED DELTA (helper name) |
| `COMMIT` + success envelope (`{ conversation }` / `{ deleted, id }`) | same `{ data, meta }` shape | ALLOWED DELTA (response payload) |
| `catch` ROLLBACK + 42501→403 / isKnown / 500 | identical mapping | EXACT |
| `function.json` (httpTrigger, anonymous, underscore route; POST) | identical binding shape | EXACT / ALLOWED DELTA (route name) |

No new external-system helper; no DEVIATION. `theo_message`/`theo_message_stream` unmodified. Delete's child-row handling is delegated to the deployed FKs (no manual cleanup).

## §PARITY — Golden Handler Standard parity checklist (§5.4)
- [x] Single canonical Primary Reference handler + function.json selected and inlined full-verbatim (§SM/§SM-FJ).
- [x] Structural Mirror Table present, every region classified + anchored (§SM-TABLE).
- [x] Executes as the signed-in user (OID); explicit `created_by` predicate on every query; RLS second layer.
- [x] Reads/writes only `theo_` tables; no `reporting_*`; no gateway-handler change; no tokens/OIDs/URLs leaked.
- [x] Input validated against contract; deterministic 400s before SQL; spec status codes (401/400/403/404/500).
- [x] No migration; no prohibited psql meta-commands (no governed `sql` blocks).
- [x] Deterministic golden curls for every endpoint (§CURL); `node --check` clean both handlers; `function.json` JSON-valid.

---

## §DEPLOY — Walter deploy steps (two new functions; no migration, no env, no dependency)
1. Create `theo_rename_conversation` (§HG.1 + §FJ.1).
2. Create `theo_delete_conversation` (§HG.2 + §FJ.2).
3. Reply "B4f backend deployed" → Claude Code runs §CURL.

## §CURL — verification plan (token via `az`; never printed; captured under `.local/`)
Uses a minimal `theo_message` turn to make a conversation:
1. **Setup** — `POST theo_message {max_tokens:16, messages:[{role:"user",content:"ping"}]}` → `conversation_id` (C).
2. **Rename** — `POST theo_rename_conversation {id:C, title:"Renamed thread"}` → **200** `{ conversation:{ id:C, title:"Renamed thread" } }`; a `theo_list_conversations` shows the new title.
3. **Validation** — rename with blank `title` → 400; bad `id` uuid → 400; delete bad `id` → 400.
4. **Ownership** — rename/delete a nonexistent `id` → **404**; (existing-foreign → 403, needs a 2nd identity — not curl-run).
5. **Delete** — `POST theo_delete_conversation {id:C}` → **200** `{deleted:true}`; `theo_get_conversation?conversationId=C` → 404 (gone); `theo_list_conversations` omits C (messages cascaded).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B4f Conversation Management (backend) Pass-1 Backend VEP (plan only).*
