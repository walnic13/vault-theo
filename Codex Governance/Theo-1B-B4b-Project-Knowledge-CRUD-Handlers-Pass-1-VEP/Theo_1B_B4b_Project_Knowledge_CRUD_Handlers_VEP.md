# Theo 1B — B4b Project Knowledge CRUD Handlers (`theo_*_project_knowledge`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handlers provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** Tier **B4b (handlers)** — the project-knowledge CRUD set over the deployed `theo_project_knowledge` table (B2): `theo_add_project_knowledge`, `theo_list_project_knowledge` (read), `theo_remove_project_knowledge`. These back the Claude-style **project knowledge** panel (add/list/remove reference items a project injects into Theo's context). Follows B4a (projects core CRUD, deployed + verified). **Text knowledge only** (`source_type='text'`, inline `content`); file-backed knowledge (`source_type='file'` + Blob pointer, reusing the B8 upload pipeline) is a deferred fast-follow. **Every query is explicitly scoped `created_by = $oid`** — the shared Functions connection role bypasses RLS, so isolation is enforced in the query (per the deployed SEC user-isolation fix), with RLS the second layer; the referenced project's ownership is verified before any add/list. Family-B pattern; mutations `connect→BEGIN→set_config→…→COMMIT` / `catch ROLLBACK + 42501→403/23503→404/23514→400` with `theo_project_knowledge_exists_unscoped` for 403/404 on remove; read is the same minus `BEGIN/COMMIT`. **No migration** (the table is fully deployed from B2). **Ungated** (user-managed CRUD; no model/index/Blob traffic).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `1b6497ff125d5b01c8a2ebe98623f2b94b8fb9f2` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference (Golden §2) = the **deployed** `theo_create_user_memory` **pair** — same-repo Theo mutation pattern with the **FK-ownership-then-insert** shape this microstep needs (verify a referenced parent is owned → 404 else; then INSERT with `set_config` triad / COMMIT + 42501/23503/23514 mapping; inlined verbatim §SM) and its deployed `function.json` (inlined verbatim §SM-FJ). The read handler (`theo_list_project_knowledge`) follows the deployed read idiom (`theo_list_user_memory`/`theo_list_conversations`) with an ownership pre-check; remove ownership 403/404 via the deployed `theo_project_knowledge_exists_unscoped` helper (B2 §5). Contract basis = the deployed `theo_project_knowledge` table (Schema §3/§5; B2 DDL lines 116–128, RO-verified) + Backend Plan Tier B4. No migration. API Spec §2.2 knowledge row is finalized post-deploy (§GR G-2), batched with the B4a Projects Role-C. Validation precedes SQL (deterministic 400s). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `grep -F "Gap Register"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `Grep("§4A\\.1")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | `grep -F "executes the directed edits"` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §4 deltas; §5 SM; §6 HF-T2) | `Read(full)` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (pass axis) | `grep -F "the model swap point"` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B4) | `Grep("B4")` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 row + §5 `theo_project_knowledge` DEPLOYED) | `Read(full)` this turn | `59924ef06b64e62b4cc6a268793d52bd82945cbd` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§1 route naming; §2.2 Projects knowledge) | `Read(full)` this turn | `c5d6c7b68469ae6605fd625890a8474fabe333c9` |
| 10 | **Deployed table DDL** — `Codex Governance/Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/b2_migration.sql` (`theo_project_knowledge`, lines 116–128) | `Read(offset=115,limit=16)` this turn | `2f2b6ddf8bf87525bc1a43e34bb7f82351a54b7c` |
| 11 | **Primary Reference handler** (deployed Theo FK-ownership+insert pattern) — `Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_create_user_memory.index.js` | `Read(full)` this turn | `9dafc7a0931642b3ac6c05eb8f7b3618b7fa4b23` |
| 12 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_create_user_memory.function.json` | `Read(full)` this turn | `de8f818677215accdf525e4e0ca61a8df8846cc2` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §P1 — B4b project-knowledge CRUD handlers |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference handler = deployed `theo_create_user_memory` |
| Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_create_user_memory.function.json | binding | "httpTrigger" | §SM-FJ — Primary Reference function.json |
| Codex Governance/Theo-1B-B7a-Memory-CRUD-Handlers-Pass-1-VEP/theo_create_user_memory.index.js | mutation | "set_config('app.current_user_id', $1, false)" | §HG.1–§HG.3 — per-request session context |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §HG.1–§HG.3 — every query scoped `created_by = $oid` |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_project_knowledge" | §HG.1–§HG.3 — handlers operate over the deployed B2 table |
| Codex Governance/Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/b2_migration.sql | DDL | "CHECK (source_type IN ('text','file'))" | §P3/§HG.1 — source_type fixed 'text'; file deferred |
| spec/THEO_API_SPEC.md | §2.2 | "add / remove project knowledge" | §P1/§P4 — the operations this microstep implements |

---

## P1 — Feature identification
**Microstep:** Theo Phase 1B **Tier B4b (handlers)** — the project-knowledge CRUD set over the deployed `theo_project_knowledge` table (Rule Anchor on Plan Tier B4: "Projects + project-knowledge + artifacts + settings CRUD"; API Spec §2.2 "add / remove project knowledge"). Three handlers back the Claude-style knowledge panel: **add** (a titled text item under a project), **list** (a project's knowledge items), **remove** (permanent; the table is immutable). This is the persistence for project knowledge; combined with B4a it makes the whole Projects surface durable. **Text knowledge only** (`source_type='text'`, inline `content`). **Out of scope (separate microsteps):** file-backed knowledge (`source_type='file'` + Blob pointer, reusing B8 upload) — a deferred fast-follow; the FE mock→live swap (B4c); conversation↔project wiring (B4d); RAG retrieval over knowledge (Tier B6 — B4b injects/returns inline content, no vectorization).

## P2 — Architecture & boundary reconciliation
- **Family-B.** `pg` Pool over `POSTGRES_CONNECTION_STRING`; per-request `set_config` triad; mutations `connect→BEGIN→…→COMMIT` with `catch ROLLBACK`; read is the same minus `BEGIN/COMMIT`. Identical helper block to the deployed Theo handlers.
- **Explicit ownership (SEC-fix discipline).** Every SELECT/INSERT/DELETE carries `created_by = $oid`; the shared connection role bypasses RLS, so the predicate — not RLS — enforces per-user isolation. Add/list verify the **referenced project is owned** (`SELECT 1 … WHERE id=$project AND created_by=$oid`) before touching knowledge — a non-owned/absent project → 404 (list splits 403/404 via `theo_project_exists_unscoped`). Remove on a non-owned id → 0 rows → `theo_project_knowledge_exists_unscoped` → 403/404.
- **Validation before SQL.** `isUuid` on `project_id`/`knowledge_id`; non-blank `title` ≤200; non-empty `content` ≤10000 — all deterministic 400s before any query.
- **Boundary.** Reads/writes only `theo_project_knowledge` + an ownership `SELECT 1` on `theo_projects` (both deployed B2); **no `reporting_*` access**; no Blob, no model gateway. `source_type` fixed to `'text'` (the DB CHECK allows `text`/`file`; file-backed is a later microstep). 23503→404, 23514→400 mapped defensively.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** Three new functions on the shared `vaultgpt-func-premium` app. **No migration** (the `theo_project_knowledge` table + RLS + `theo_project_knowledge_exists_unscoped` helper are deployed from B2); `pg` + connection vars already present. | **PRE-LAND** — §DEPLOY; Claude Code golden curls confirm (incl. cross-user isolation + project-ownership guard). |
| G-2 | **Authority-doc update post-deploy.** API Spec §2.2 knowledge row is finalized to name the three endpoints (`theo_add/list/remove_project_knowledge`). | **PRE-LAND** — batched into the single B4a+B4b Projects Role-C, landing before the B4c FE-live VEP cites it (T22 prevention). |
| G-3 | **File-backed knowledge + RAG.** `source_type='file'` (Blob pointer, reusing B8 upload) and Azure AI Search retrieval over knowledge (Tier B6) — B4b injects/returns inline text only. | **PROCEED (future-trigger).** Separate, sequenced microsteps; not in this pack. |

No write SQL executes in this pack (plan only); no migration. No `reporting_*` change.

## P3 — Backend / contract grounding
Contract basis = the deployed `theo_project_knowledge` table (Schema §3/§5; B2 DDL lines 116–128: `project_id` FK ON DELETE CASCADE, `title` NOT NULL CHECK non-blank, `source_type text NOT NULL DEFAULT 'text' CHECK (source_type IN ('text','file'))`, `content` NULL, Blob-pointer columns NULL, `created_at`; immutable — no `updated_at`). Response envelope = the standard `{ data, meta }` / `{ error }` shape. Endpoints (new): `POST /api/theo_add_project_knowledge`; `GET /api/theo_list_project_knowledge` (`?projectId`); `POST /api/theo_remove_project_knowledge` — route naming `theo_<operation>_<entity>` (API Spec §1). API Spec §2.2 knowledge row finalized to these three post-deploy (G-2).

## P4 — Per-handler contract
- **`theo_add_project_knowledge`** (POST): validates `project_id` (uuid) + `title` (non-blank ≤200) + `content` (non-empty ≤10000); verifies the project is owned (else 404); `INSERT (created_by, project_id, title, source_type, content) VALUES ($1,$2,$3,'text',$4) RETURNING id, project_id, title, source_type, content, created_at` → **201** `{ knowledge }`; 23503→404, 23514→400.
- **`theo_list_project_knowledge`** (GET): `?projectId` (uuid, required → 400); resolves project ownership (owned → list; exists-not-owned → 403; absent → 404); `SELECT … WHERE project_id=$1 AND created_by=$2 ORDER BY created_at ASC, id ASC LIMIT 500` → **200** `{ knowledge: [...] }`.
- **`theo_remove_project_knowledge`** (POST): `knowledge_id` (uuid) + optional `project_id` (uuid, validated if present); `DELETE … WHERE id=$1 AND created_by=$2 RETURNING id`; 0 rows → 403/404 via `theo_project_knowledge_exists_unscoped` → **200** `{ deleted:true, id }` (permanent — the table is immutable).

## P5 — Component reference grounding
Primary Reference (Golden §2) = the **deployed** `theo_create_user_memory` **pair** — the handler (Theo mutation pattern with the exact **verify-parent-owned → INSERT** shape this microstep needs, inlined byte-identical §SM) and its deployed `function.json` (inlined byte-identical §SM-FJ; `httpTrigger` POST/OPTIONS, underscore route, anonymous — EasyAuth in front). The three handlers reuse that deployed helper block verbatim, the `theo_list_user_memory` read idiom, and the `*_exists_unscoped` ownership idiom; only the `theo_project_knowledge`-specific columns/validation differ (ALLOWED DELTA per Golden §4: table/column names, the validated field set, the RLS-scoped query, the response shape). The three new `function.json` (§FJ.1–§FJ.3) follow the §SM-FJ binding shape (list = GET/OPTIONS; mutations = POST/OPTIONS). No new external-system helper is introduced (no DEVIATION).

## P6 — Repository & active-surface grounding
New artifacts (this package): three `*.index.js` + three `*.function.json`. No existing source changed; no migration. Guardrails: no browser storage (backend); no `reporting_*`; explicit `created_by` on every query; `node --check` clean for all three handlers; `function.json` methods = GET (list) / POST (mutations), routes match handler names, `authLevel` anonymous.

## P7 — Risk / regression
- **Greenfield handlers:** three new functions; no change to deployed handlers/tables/policies; no migration.
- **Isolation:** explicit `created_by` on every query + project-ownership pre-check on add/list (verified by the cross-user golden curl).
- **Permanent delete:** `theo_project_knowledge` is immutable, so remove is a hard delete; ownership-checked first. `theo_delete_project` (B4a) already cascades knowledge — this handler removes a single item.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3 PROCEED future-trigger); Primary Reference inlined byte-identical (§SM/§SM-FJ); three full handlers (§HG.1–§HG.3) + three `function.json` (§FJ.1–§FJ.3) inlined, each `node --check` / JSON-valid; Structural Mirror Table (§SM-TABLE) + parity checklist (§PARITY). No migration. Plan-only. On Codex APPROVAL, Walter deploys the three functions; Claude Code golden-curls (create project → add → list → remove → validation → project-ownership guard → cross-user isolation); then the batched B4a+B4b API-Spec Projects Role-C (G-2).

---

## §SM — Primary Reference (deployed `theo_create_user_memory`, byte-identical; Theo FK-ownership+insert pattern)
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

  // ---- Validate inputs before any SQL (deterministic 400s) ----
  const scope = typeof body.scope === "string" && body.scope.trim() !== "" ? body.scope.trim() : "user";
  if (scope !== "user" && scope !== "project") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'scope' must be 'user' or 'project'.", 400));
  }

  const projectId =
    body.project_id != null && typeof body.project_id === "string" && body.project_id.trim() !== ""
      ? body.project_id.trim()
      : null;
  if (projectId !== null && !isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id', when supplied, must be a valid UUID.", 400));
  }
  // Invariant (mirrors the DB CHECK): project scope iff project_id present.
  if ((scope === "project") !== (projectId !== null)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required when scope='project' and must be omitted otherwise.", 400));
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (content === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'content' is required and must be a non-empty string.", 400));
  }
  if (content.length > CONTENT_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'content' must be at most ${CONTENT_MAX_LEN} characters.`, 400));
  }

  let kind = "fact";
  if (body.kind != null) {
    if (typeof body.kind !== "string" || body.kind.trim() === "") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'kind', when supplied, must be a non-empty string.", 400));
    }
    kind = body.kind.trim().slice(0, KIND_MAX_LEN);
  }

  const sourceConversationId =
    body.source_conversation_id != null && typeof body.source_conversation_id === "string" && body.source_conversation_id.trim() !== ""
      ? body.source_conversation_id.trim()
      : null;
  if (sourceConversationId !== null && !isUuid(sourceConversationId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'source_conversation_id', when supplied, must be a valid UUID.", 400));
  }

  let salience = 0;
  if (body.salience != null) {
    if (!Number.isInteger(body.salience)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'salience', when supplied, must be an integer.", 400));
    }
    salience = body.salience;
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
    // a referenced project / conversation MUST belong to the caller, else 404 (no leakage).
    if (projectId !== null) {
      const owned = await client.query(
        `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
        [projectId, oid]
      );
      if (owned.rowCount === 0) {
        throw buildKnownError("NOT_FOUND", "Referenced project not found.", 404);
      }
    }
    if (sourceConversationId !== null) {
      const owned = await client.query(
        `SELECT 1 FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
        [sourceConversationId, oid]
      );
      if (owned.rowCount === 0) {
        throw buildKnownError("NOT_FOUND", "Referenced conversation not found.", 404);
      }
    }

    // created_by = the signed-in OID (explicit ownership; the connection role bypasses RLS).
    const inserted = await client.query(
      `
      INSERT INTO public.theo_user_memory
        (created_by, scope, project_id, kind, content, source_conversation_id, salience)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id, scope, project_id, kind, content, source_conversation_id, salience, created_at, updated_at
      `,
      [oid, scope, projectId, kind, content, sourceConversationId, salience]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({ memory: inserted.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_create_user_memory failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to create memory.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // FK violation: project_id / source_conversation_id not owned or absent.
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Referenced project or conversation not found.", 404));
    }
    // CHECK violation (scope/project invariant or non-empty content), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Memory item violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

## §SM-FJ — Primary Reference function.json (deployed `theo_create_user_memory.function.json`, byte-identical)
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_create_user_memory"
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

## §HG.1 — `theo_add_project_knowledge/index.js` (full)
```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const TITLE_MAX_LEN = 200;
const CONTENT_MAX_LEN = 10000;

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

  // ---- Validate inputs before any SQL (deterministic 400s) ----
  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (title === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'title' is required and must be a non-empty string.", 400));
  }
  if (title.length > TITLE_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'title' must be at most ${TITLE_MAX_LEN} characters.`, 400));
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (content === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'content' is required and must be a non-empty string.", 400));
  }
  if (content.length > CONTENT_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'content' must be at most ${CONTENT_MAX_LEN} characters.`, 400));
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
    const owned = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
      [projectId, oid]
    );
    if (owned.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // created_by = the signed-in OID (explicit ownership; the connection role bypasses RLS).
    // source_type is fixed to 'text' (inline content); file-backed knowledge is a later microstep.
    const inserted = await client.query(
      `
      INSERT INTO public.theo_project_knowledge
        (created_by, project_id, title, source_type, content)
      VALUES ($1, $2, $3, 'text', $4)
      RETURNING
        id, project_id, title, source_type, content, created_at
      `,
      [oid, projectId, title, content]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({ knowledge: inserted.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_add_project_knowledge failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to add knowledge to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // FK violation: project_id absent or not owned.
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    }
    // CHECK violation (title non-blank or source_type), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Knowledge item violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```
## §FJ.1 — `theo_add_project_knowledge/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_add_project_knowledge"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.2 — `theo_list_project_knowledge/index.js` (full)
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

  const projectId =
    req.query && typeof req.query.projectId === "string" ? req.query.projectId.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'projectId' is required and must be a valid UUID.", 400));
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

    // Resolve project ownership first (explicit created_by; the connection role bypasses RLS):
    // owned → list; not owned but exists → 403; absent → 404. No leakage of others' projects.
    const owned = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
      [projectId, oid]
    );
    if (owned.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_exists_unscoped($1::uuid) AS e`,
        [projectId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this project.", 403)
        : buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    const result = await client.query(
      `
      SELECT
        id,
        project_id,
        title,
        source_type,
        content,
        created_at
      FROM public.theo_project_knowledge
      WHERE project_id = $1 AND created_by = $2
      ORDER BY created_at ASC, id ASC
      LIMIT 500
      `,
      [projectId, oid]
    );

    return send(context, 200, successBody({ knowledge: result.rows }));
  } catch (err) {
    context.log.error("theo_list_project_knowledge failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this project.", 403));
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
## §FJ.2 — `theo_list_project_knowledge/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_project_knowledge"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.3 — `theo_remove_project_knowledge/index.js` (full)
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

  const knowledgeId = typeof body.knowledge_id === "string" ? body.knowledge_id.trim() : "";
  if (!isUuid(knowledgeId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'knowledge_id' is required and must be a valid UUID.", 400));
  }
  // project_id is optional context; when supplied it must be a valid UUID (ownership is enforced by
  // the created_by predicate on the knowledge row itself, so project_id is not required for security).
  if (body.project_id != null) {
    const pid = typeof body.project_id === "string" ? body.project_id.trim() : "";
    if (!isUuid(pid)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id', when supplied, must be a valid UUID.", 400));
    }
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

    // Explicit ownership scope (connection role bypasses RLS): permanent delete of a knowledge row
    // the caller owns. theo_project_knowledge is immutable, so removal is a hard delete.
    const deleted = await client.query(
      `DELETE FROM public.theo_project_knowledge WHERE id = $1 AND created_by = $2 RETURNING id`,
      [knowledgeId, oid]
    );

    if (deleted.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_knowledge_exists_unscoped($1::uuid) AS e`,
        [knowledgeId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this knowledge item.", 403)
        : buildKnownError("NOT_FOUND", "Knowledge item not found.", 404);
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ deleted: true, id: deleted.rows[0].id }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_remove_project_knowledge failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this knowledge item.", 403));
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
## §FJ.3 — `theo_remove_project_knowledge/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_remove_project_knowledge"
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
| Region | Primary Reference region (`theo_create_user_memory`) | Classification |
| --- | --- | --- |
| `pg` Pool + `ssl` | identical | EXACT |
| `corsHeaders` (GET for list; POST for mutations) | identical (POST); list swaps method to `GET, OPTIONS` (matches deployed `theo_list_user_memory`) | EXACT / ALLOWED DELTA (method string) |
| `send`/`nowIso`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`buildKnownError`/`isUuid` | identical helper block (list omits `parseBody`, unused for GET) | EXACT |
| OID extraction + 401 | identical | EXACT |
| Input validation (deterministic 400s) | same discipline; `theo_project_knowledge` field set (`project_id`/`title`/`content`/`knowledge_id`) | ALLOWED DELTA (validated field set) |
| `connect`→`BEGIN`→`set_config` triad (mutations); `set_config` only (list) | identical | EXACT |
| Parent-ownership pre-check (`SELECT 1 FROM theo_projects WHERE id=$ AND created_by=$` → 404) | identical to the memory create FK-ownership check | EXACT |
| RLS-scoped SQL (`INSERT`/`SELECT`/`DELETE` over `theo_project_knowledge`, `created_by = $oid`) | same idiom; `theo_project_knowledge` table/columns | ALLOWED DELTA (table/column names; RLS-scoped query) |
| 0-row remove → `theo_project_knowledge_exists_unscoped` → 403/404; list 403/404 via `theo_project_exists_unscoped` | same idiom as `theo_update/delete_user_memory` | ALLOWED DELTA (helper name) |
| `COMMIT` + success envelope (`{ knowledge }` / `{ knowledge: [...] }` / `{ deleted, id }`) | same `{ data, meta }` shape | ALLOWED DELTA (response payload) |
| `catch` ROLLBACK + 42501→403 / 23503→404 / 23514→400 / isKnown / 500 | identical mapping | EXACT |
| `function.json` (httpTrigger, anonymous, underscore route; GET list / POST mutations) | identical binding shape | EXACT / ALLOWED DELTA (method + route name) |

No new external-system helper; no DEVIATION.

## §PARITY — Golden Handler Standard parity checklist (§5.4)
- [x] Single canonical Primary Reference handler + function.json selected and inlined full-verbatim (§SM/§SM-FJ).
- [x] Structural Mirror Table present, every region classified + anchored (§SM-TABLE).
- [x] Executes as the signed-in user (OID); explicit `created_by` predicate on every query + parent-project ownership pre-check; RLS second layer.
- [x] Reads/writes only `theo_` tables; no `reporting_*`; no tokens/OIDs/URLs leaked in responses or logs.
- [x] Input validated against contract; deterministic 400s before SQL; spec status codes (401/400/403/404/500).
- [x] No migration (table deployed B2); no prohibited psql meta-commands (no SQL fences beyond inline queries).
- [x] Deterministic golden curls for every endpoint (§CURL); `node --check` clean; `function.json` JSON-valid.

---

## §DEPLOY — Walter deploy steps (three new functions; no migration, no env, no dependency)
1. Create `theo_add_project_knowledge` (§HG.1 + §FJ.1).
2. Create `theo_list_project_knowledge` (§HG.2 + §FJ.2).
3. Create `theo_remove_project_knowledge` (§HG.3 + §FJ.3).
4. Reply "B4b deployed" → Claude Code runs §CURL.

## §CURL — verification plan (token via `az`; never printed; captured under `.local/`)
Uses the deployed B4a `theo_create_project` to make a parent project, then:
1. **Create project** — `POST theo_create_project {name:"KB Test"}` → 201 + `project.id` (P).
2. **Add** — `POST theo_add_project_knowledge {project_id:P, title:"Fund structure", content:"Cayman feeder → Delaware master."}` → **201** + `knowledge.id` (K); `source_type="text"`.
3. **List** — `GET theo_list_project_knowledge?projectId=P` → 200; includes K; own rows only; chronological.
4. **Remove** — `POST theo_remove_project_knowledge {knowledge_id:K}` → 200 `{deleted:true}`; re-list omits K.
5. **Validation** — add with blank `title` → 400; add with empty `content` → 400; add with bad `project_id` uuid → 400; list without `projectId` → 400.
6. **Project-ownership guard** — add/list with a random nonexistent `project_id` → **404**. Endpoint difference (by design, mirroring the deployed create-vs-update idiom): `theo_add_project_knowledge` collapses a **non-owned or absent** parent project to **404** (single `SELECT 1 … created_by=$oid` → no existence leak, like the memory create Primary Reference); `theo_list_project_knowledge` splits an **existing-foreign** project as **403** (via `theo_project_exists_unscoped`) vs absent **404** (the 403 path needs a 2nd identity — not curl-run).
7. **Cleanup** — delete project P (`theo_delete_project`) → 200 (cascades any remaining knowledge).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B4b Project Knowledge CRUD Handlers Pass-1 Backend VEP (plan only).*
