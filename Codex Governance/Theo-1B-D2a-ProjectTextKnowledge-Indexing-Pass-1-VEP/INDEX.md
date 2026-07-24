# Theo Backend — `theo_add_project_knowledge` on-ingest RAG indexing (Phase D / D2a): Pass-1 Verified Evidence Pack

Backend Verified Evidence Pack (plan). Phase D / D2a: after the `theo_project_knowledge` INSERT, `theo_add_project_knowledge` (the **text**-knowledge handler on the shared monolith `vaultgpt-func-premium`) **chunks the stored text, embeds each chunk, and upserts one doc per chunk into the Azure AI Search `theo-project-knowledge` index** (created idempotently), scoped by `project_id` + `created_by`. This is the text-knowledge counterpart to D1 (which indexed **file**-knowledge in `theo_add_project_knowledge_file`); together they index all project knowledge on ingest so the D3 retrieval seam surfaces it in chat. Indexing is **NON-FATAL** (an embed/Search failure never fails the add — the row is already committed). No new npm dependency (embeddings + Search over `https`), no schema change, no contract change (response shape identical). Deploys to premium via the **DR-T14** surgical Kudu VFS carve-out (approved + applied `0a8f99f`). `node --check` PASS this turn.

The indexing code is **byte-identical to the deployed `theo_add_project_knowledge_file` (D1)** on-ingest indexer — every reused helper (`requestUrl`, `parseJsonSafe`, `getAadToken`, `ensureIndex`, `embedBatch`, `upsertDocs`, `chunkText`) was verified byte-identical to D1 this turn; D1's `getAadToken`/`embedBatch` are in turn byte-identical to the deployed `theo_index_messages` (B7b1), `ensureIndex`/`upsertDocs` are the project-adapted forms. Reuse is under the Walter-authorized composite (2026-07-24) that named `theo_add_project_knowledge` (D2) explicitly.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5

Turn issued against HEAD: `0c78d1601ba2d9bf45176713cd3f682c018026aa` (vault-theo, `development`; grounding parent `0a8f99f952419abb1a2764ab35639826bf72684a`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Baseline-verification note: the Primary Reference below was fetched **live** from `vaultgpt-func-premium` (Kudu VFS `site/wwwroot/theo_add_project_knowledge/index.js`, ARM-bearer GET, HTTP 200) this turn (blob `b867eca08c6945cf5da6ec5f08ec19601b187379`); it is inlined verbatim (spliced from disk, no reconstruction).

### §4 Documents grounded this turn (Full Baseline)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Claude Code Theo Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3/§4/§7) | `Grep` this turn | `d553df9d8bb0e7977a215c6ebf2b554dd3f88e43` |
| 2 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2/§4/§5/§5.5 + DR-T14 premium carve-out) | `Read` this turn | `61957b1bcf7f9fb0953ad8d6204d3e7bdde16f0a` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5/§10) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1E DR-T14 premium Projects-knowledge deploy) | `Read`+`Grep` this turn | `7e31e35eea3a8712d8317e6bb52ea6bca4f9876b` |
| 5 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 boundary, §5 theo_ schema/RLS, §6 RAG) | `Grep` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 `theo_add_project_knowledge`; §2.6 RAG intent / HF-T4) | `Grep` this turn | `c99a66f39b4ec03644701c266e49aaf2bf52c2ed` |
| 7 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§5 `theo_project_knowledge` — RAG-indexed) | `Read`+`Grep` this turn | `fa9aad4c75019de0b621e31b5d33ef97f3689639` |
| 8 | Primary Reference (deployed, live-fetched) — `theo_add_project_knowledge/index.js` (premium) — blob `b867eca08c6945cf5da6ec5f08ec19601b187379` | `Read` this turn (+ live Kudu fetch) | `b867eca08c6945cf5da6ec5f08ec19601b187379` (inlined verbatim below) |
| 8b | Primary Reference (deployed) — `theo_add_project_knowledge/function.json` (the paired deployed function.json — Golden Handler §2) — blob `ce3589b4e2e85f6c3a7d4161831a68b60bd6efaa` | `Read` this turn (+ live Kudu fetch) | `ce3589b4e2e85f6c3a7d4161831a68b60bd6efaa` (inlined verbatim below) |
| 9 | Authorized-reuse source (deployed) — `theo_add_project_knowledge_file/index.js` (D1) — blob `edbb107f…` and `theo_index_messages.index.js` (B7b1) — blob `665bdb36fe5e59dbe75dec4a88bc29c4c1519003` | `Read` this turn | `665bdb36fe5e59dbe75dec4a88bc29c4c1519003` (reused helpers byte-identical; verified vs D1 this turn) |

## Walter Authorization (composite — quoted verbatim, predating this VEP)
> AUTHORIZED (Walter, 2026-07-24): For Phase D on-ingest RAG indexing, theo_add_project_knowledge_file
> (vaultgpt-func-projects, D1) AND theo_add_project_knowledge (vaultgpt-func-premium, D2) may be built
> as Walter-authorized composites — each keeping its existing primary reference, and additionally
> reusing byte-identically from the deployed theo_index_messages (B7b1): getAadToken (client-credentials
> for the cognitiveservices + search AAD scopes), ensureIndex, embedBatch, and upsertDocs — adapted only
> for the theo-project-knowledge index (id/knowledge_id/project_id/created_by/title/content/chunk_index/
> created_at + 1536-d content_vector) and content chunking. On-ingest indexing is NON-FATAL (an index
> failure never fails the knowledge add). No new external system (Azure OpenAI embeddings + Azure AI
> Search vaultgpt-search are already used by B7b).

Premium deploy authority: **DR-T14** (Walter-granted 2026-07-24, Path B; Role-C APPROVED + applied `0a8f99f`) — Claude Code MAY deploy `theo_add_project_knowledge` to premium via surgical Kudu VFS after a Codex-APPROVED VEP.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "exactly one" | §Primary Reference — canonical deployed theo_add_project_knowledge |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "an EXACT mirror against a deployed handler containing that helper" | §Structural Mirror — reused helpers byte-identical to deployed D1 handler |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "ALLOWED DELTA" | §Structural Mirror — on-ingest block + chunking = ALLOWED DELTAs |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "EXCEPTION (DR-T14, 2026-07-24)" | §Deploy — premium surgical Kudu VFS of theo_add_project_knowledge |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 | "Primary reference artifact cited without full verbatim inline this turn" | §Primary Reference — full verbatim inline below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T14 | "Premium Projects-knowledge deploy authority" | §Deploy — the authority for this premium deploy |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "RLS ENABLED on every Theo table" | §Handler — set_config + explicit created_by (unchanged); index docs carry created_by + project_id |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | §5 | "theo_project_knowledge" | §P3 — target table; RAG-indexed |

## Architecture & boundary reconciliation (§4A.1 P2)
- **§1 boundary** — only `theo_projects` / `theo_project_knowledge` (Postgres) + the shared `vaultgpt-search` (`theo-project-knowledge` index, already written by D1). No `reporting_*`. Embeddings + Search are the already-used B7b systems.
- **§5 theo_ schema + RLS** — unchanged Postgres access (`set_config` + explicit `created_by`); index docs carry `created_by` + `project_id` as retrieval scope fields.
- **§6 RAG** — the text-knowledge indexing half of HF-T4; mirrors D1 (file-knowledge) + B7b (messages).
- **Deploy** — `vaultgpt-func-premium` is classic per-fn (Kudu VFS); DR-T14 authorizes surgical overwrite of `theo_add_project_knowledge/index.js` ONLY. No other premium handler, no Reporting handler, no DB/migration/merge, no premium app-setting/resource change.

## §1 Feature Identification + boundary
- **Change:** append a non-fatal on-ingest indexing block to `theo_add_project_knowledge` after COMMIT (chunk `content` → getAadToken → ensureIndex → embedBatch → upsertDocs one doc/chunk), plus the config constants + the reused helpers (`requestUrl`/`parseJsonSafe`/`getAadToken`/`ensureIndex`/`embedBatch`/`upsertDocs`/`chunkText`) the premium handler did not previously carry.
- **Boundary:** one handler edit; no new npm dep; no schema change; no contract change (same route + response shape). Indexing failures are swallowed (logged) — the 201 + committed row are unaffected. `node --check` PASS. Handler blob `fc0163383a4714b8dd0d887a5b74a92723470410`; +212 / −1 vs the live baseline (all net-new indexing code — the premium handler had no HTTP/RAG helpers).

## §2 Gap Register
**PROCEED.**
- **(1) Composite reuse authorized + byte-identical to a deployed handler.** All 7 indexing helpers verified byte-identical to the deployed D1 handler this turn (getAadToken/embedBatch in turn byte-identical to theo_index_messages; ensureIndex/upsertDocs project-adapted). Verbatim Walter composite authorization names theo_add_project_knowledge (D2). §4/T12 clean. PROCEED.
- **(2) No schema/contract change.** theo_project_knowledge unchanged; response shape identical (index docs live in Search, not the API response). PROCEED.
- **(3) Non-fatal.** Index/embed/Search failure caught + logged; the add still returns 201. PROCEED.
- **(4) De-index is D2b.** Removing a text-knowledge item does not yet delete its Search doc; the sibling `theo_remove_project_knowledge` de-index VEP (D2b) closes that, and D3's live-DB intersect already prevents a removed item from being retrieved in the meantime. Disclosed. PROCEED.
- **(5) Premium deploy is DR-T14-scoped.** Surgical Kudu VFS of this one handler; approved + applied `0a8f99f`. PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** Phase D/D2a — index text-knowledge on ingest (HF-T4 indexing half for text knowledge).
- **P2:** architecture reconciliation above (theo_ + vaultgpt-search; no reporting_*).
- **P2.5:** Gap Register (PROCEED).
- **P3:** no schema change; `theo_project_knowledge` unchanged; Search index `theo-project-knowledge` created idempotently by `ensureIndex`.
- **P4:** no contract change (route + response shape identical; §2.6 RAG intent satisfied for the text-knowledge indexing half).
- **P5:** Primary Reference = live-fetched deployed `theo_add_project_knowledge` (inlined verbatim); indexing helpers byte-identical to the deployed D1 handler; Structural Mirror + unified diff below.
- **P6:** no migration; handler SQL unchanged (the INSERT + set_config + ownership SELECT are the deployed ones).
- **P7:** golden curls below (incl. verifying an indexed doc + end-to-end retrieval via D3); Claude Code runs post-deploy.
- **P8:** this pack.

## Primary Reference (deployed, live-fetched `theo_add_project_knowledge`) — FULL VERBATIM (Conformance T9)
Byte-faithful content of the deployed premium handler (blob `b867eca08c6945cf5da6ec5f08ec19601b187379`), fetched live this turn and spliced from disk — no reconstruction:
```javascript
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


## Primary Reference paired `function.json` (deployed) — FULL VERBATIM (Golden Handler §2 / Conformance T9)
Blob `ce3589b4e2e85f6c3a7d4161831a68b60bd6efaa` (deployed premium; route binding UNCHANGED by this VEP — index.js-only deploy):
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

## Exact unified diff vs the live-fetched baseline (authoritative delta)
```diff
--- deployed baseline (b867eca0)
+++ D2a handler (fc016338)
@@ -8,4 +8,18 @@
 const TITLE_MAX_LEN = 200;
 const CONTENT_MAX_LEN = 10000;
+// Phase D / D2 - RAG on-ingest indexing (Azure AI Search project-knowledge index). Config + helpers
+// reused from the deployed theo_index_messages (B7b1) + the deployed theo_add_project_knowledge_file (D1)
+// per the Walter-authorized composite: getAadToken + embedBatch byte-identical (EXACT); ensureIndex +
+// upsertDocs adapted reuse (index name -> PK_SEARCH_INDEX / project field set). Indexing is NON-FATAL.
+const EMBED_ENDPOINT = (process.env.THEO_EMBED_ENDPOINT || "").replace(/\/+$/, "");
+const EMBED_DEPLOYMENT = process.env.THEO_EMBED_DEPLOYMENT;
+const EMBED_API_VERSION = process.env.THEO_EMBED_API_VERSION || "2023-05-15";
+const SEARCH_ENDPOINT = (process.env.THEO_SEARCH_ENDPOINT || "").replace(/\/+$/, "");
+const PK_SEARCH_INDEX = process.env.THEO_PK_SEARCH_INDEX || "theo-project-knowledge";
+const SEARCH_API_VERSION = process.env.THEO_SEARCH_API_VERSION || "2023-11-01";
+const EMBED_SCOPE = "https://cognitiveservices.azure.com/.default";
+const SEARCH_SCOPE = "https://search.azure.com/.default";
+const CHUNK_CHARS = 2000; // project-knowledge docs are large; chunk for retrieval granularity
+const EMBED_BATCH = 64;
 
 const corsHeaders = {
@@ -99,4 +113,168 @@
     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
   );
+}
+
+// ---- HTTPS helper: byte-identical requestUrl from the deployed theo_add_project_knowledge_file (D1) ----
+function requestUrl(urlStr, options = {}, body = null) {
+  return new Promise((resolve, reject) => {
+    const http = require("http");
+    const https = require("https");
+    const url = new URL(urlStr);
+    const lib = url.protocol === "http:" ? http : https;
+    const req = lib.request(
+      {
+        method: options.method || "GET",
+        hostname: url.hostname,
+        port: url.port ? Number(url.port) : undefined,
+        path: url.pathname + url.search,
+        headers: options.headers || {},
+      },
+      (res) => {
+        let data = "";
+        res.on("data", (chunk) => { data += chunk; });
+        res.on("end", () => {
+          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data });
+        });
+      }
+    );
+    req.on("error", reject);
+    if (body) req.write(body);
+    req.end();
+  });
+}
+
+// ---- Phase D RAG indexing helpers reused from the deployed theo_index_messages B7b1 per the
+// Walter-authorized composite: getAadToken + embedBatch byte-identical (EXACT); ensureIndex +
+// upsertDocs adapted reuse (index name -> PK_SEARCH_INDEX / project field set) ----
+function parseJsonSafe(raw) {
+  if (typeof raw !== "string" || raw.trim() === "") return null;
+  try {
+    return JSON.parse(raw);
+  } catch {
+    return null;
+  }
+}
+
+// Client-credentials token for a given Azure resource scope (same AAD app as the gateway).
+async function getAadToken(scope) {
+  const tenantId = process.env.AAD_TENANT_ID;
+  const clientId = process.env.AAD_CLIENT_ID;
+  const clientSecret = process.env.AAD_CLIENT_SECRET;
+  if (!tenantId || !clientId || !clientSecret) {
+    throw new Error("Missing required AAD client-credentials configuration.");
+  }
+  const form = new URLSearchParams({
+    client_id: clientId,
+    client_secret: clientSecret,
+    grant_type: "client_credentials",
+    scope,
+  }).toString();
+  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
+  const r = await requestUrl(
+    tokenUrl,
+    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } },
+    form
+  );
+  const payload = parseJsonSafe(r.body);
+  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
+    throw new Error(`Token request failed for scope ${scope} (HTTP ${r.statusCode}).`);
+  }
+  return payload.access_token;
+}
+
+// PUT the index definition (create-or-update; idempotent). Vector field matches text-embedding-3-small (1536).
+async function ensureIndex(searchToken) {
+  const indexDef = {
+    name: PK_SEARCH_INDEX,
+    fields: [
+      { name: "id", type: "Edm.String", key: true, filterable: true },
+      { name: "knowledge_id", type: "Edm.String", filterable: true },
+      { name: "project_id", type: "Edm.String", filterable: true },
+      { name: "created_by", type: "Edm.String", filterable: true },
+      { name: "title", type: "Edm.String", searchable: true },
+      { name: "content", type: "Edm.String", searchable: true },
+      { name: "chunk_index", type: "Edm.Int32", filterable: true, sortable: true },
+      { name: "created_at", type: "Edm.DateTimeOffset", filterable: true, sortable: true },
+      {
+        name: "content_vector",
+        type: "Collection(Edm.Single)",
+        searchable: true,
+        dimensions: 1536,
+        vectorSearchProfile: "theo-vec-profile",
+      },
+    ],
+    vectorSearch: {
+      algorithms: [{ name: "theo-hnsw", kind: "hnsw" }],
+      profiles: [{ name: "theo-vec-profile", algorithm: "theo-hnsw" }],
+    },
+  };
+  const body = JSON.stringify(indexDef);
+  const r = await requestUrl(
+    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(PK_SEARCH_INDEX)}?api-version=${SEARCH_API_VERSION}`,
+    {
+      method: "PUT",
+      headers: {
+        "Content-Type": "application/json",
+        Authorization: `Bearer ${searchToken}`,
+        "Content-Length": Buffer.byteLength(body),
+      },
+    },
+    body
+  );
+  if (r.statusCode < 200 || r.statusCode >= 300) {
+    throw new Error(`ensureIndex failed (HTTP ${r.statusCode}): ${r.body.slice(0, 300)}`);
+  }
+}
+
+// Batch-embed an array of strings → array of 1536-d vectors (order preserved).
+async function embedBatch(embedToken, inputs) {
+  const body = JSON.stringify({ input: inputs });
+  const r = await requestUrl(
+    `${EMBED_ENDPOINT}/openai/deployments/${encodeURIComponent(EMBED_DEPLOYMENT)}/embeddings?api-version=${EMBED_API_VERSION}`,
+    {
+      method: "POST",
+      headers: {
+        "Content-Type": "application/json",
+        Authorization: `Bearer ${embedToken}`,
+        "Content-Length": Buffer.byteLength(body),
+      },
+    },
+    body
+  );
+  const payload = parseJsonSafe(r.body);
+  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.data)) {
+    throw new Error(`embedBatch failed (HTTP ${r.statusCode}): ${r.body.slice(0, 300)}`);
+  }
+  return payload.data
+    .slice()
+    .sort((a, b) => (a.index || 0) - (b.index || 0))
+    .map((d) => d.embedding);
+}
+
+// Upsert documents into the index (mergeOrUpload).
+async function upsertDocs(searchToken, docs) {
+  const body = JSON.stringify({ value: docs.map((d) => ({ "@search.action": "mergeOrUpload", ...d })) });
+  const r = await requestUrl(
+    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(PK_SEARCH_INDEX)}/docs/index?api-version=${SEARCH_API_VERSION}`,
+    {
+      method: "POST",
+      headers: {
+        "Content-Type": "application/json",
+        Authorization: `Bearer ${searchToken}`,
+        "Content-Length": Buffer.byteLength(body),
+      },
+    },
+    body
+  );
+  if (r.statusCode < 200 || r.statusCode >= 300) {
+    throw new Error(`upsertDocs failed (HTTP ${r.statusCode}): ${r.body.slice(0, 300)}`);
+  }
+}
+
+// Split large knowledge content into fixed-size chunks (retrieval granularity).
+function chunkText(s) {
+  const chunks = [];
+  for (let i = 0; i < s.length; i += CHUNK_CHARS) chunks.push(s.slice(i, i + CHUNK_CHARS));
+  return chunks.length ? chunks : [""];
 }
 
@@ -186,5 +364,38 @@
     await client.query("COMMIT");
 
-    return send(context, 201, successBody({ knowledge: inserted.rows[0] }));
+    const knowledge = inserted.rows[0];
+
+    // Phase D / D2 - best-effort on-ingest RAG indexing (NON-FATAL: an index failure NEVER fails the add;
+    // the row is already committed). Byte-mirror of the deployed theo_add_project_knowledge_file (D1) on-ingest
+    // indexer per the Walter-authorized composite; chunk stored text -> embed -> upsert one doc/chunk into the
+    // project-knowledge index (created idempotently), scoped by project_id + created_by.
+    try {
+      if (EMBED_ENDPOINT && EMBED_DEPLOYMENT && SEARCH_ENDPOINT) {
+        const chunks = chunkText(content);
+        const [embedToken, searchToken] = await Promise.all([getAadToken(EMBED_SCOPE), getAadToken(SEARCH_SCOPE)]);
+        await ensureIndex(searchToken);
+        const vectors = [];
+        for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
+          const vecs = await embedBatch(embedToken, chunks.slice(i, i + EMBED_BATCH));
+          vectors.push(...vecs);
+        }
+        const docs = chunks.map((c, i) => ({
+          id: `${knowledge.id}-${i}`,
+          knowledge_id: knowledge.id,
+          project_id: knowledge.project_id,
+          created_by: oid,
+          title: knowledge.title,
+          content: c,
+          chunk_index: i,
+          created_at: knowledge.created_at,
+          content_vector: vectors[i],
+        }));
+        await upsertDocs(searchToken, docs);
+      }
+    } catch (indexErr) {
+      context.log.error("theo_add_project_knowledge: RAG indexing failed (non-fatal)", indexErr);
+    }
+
+    return send(context, 201, successBody({ knowledge }));
   } catch (err) {
     if (client) {
```

## Structural Mirror Table (Golden Handler §5.1)
| Region | Reference (deployed) | Classification | Anchor |
|---|---|---|---|
| Entire baseline handler body (validation, BEGIN/set_config, ownership SELECT, INSERT, COMMIT, catch/finally) | deployed theo_add_project_knowledge (primary ref) | **EXACT** (unchanged) | Golden Handler §2 "exactly one" |
| Config constants (EMBED_*/SEARCH_*/PK_SEARCH_INDEX/scopes/CHUNK_CHARS/EMBED_BATCH) | deployed D1 handler config | **ALLOWED DELTA** (config) + byte-identical to D1 | Golden Handler §4 "ALLOWED DELTA" |
| requestUrl / parseJsonSafe / getAadToken / embedBatch | deployed D1 handler (getAadToken/embedBatch in turn byte-identical to theo_index_messages) | **AUTHORIZED REUSE — EXACT** (byte-identical to D1, verified this turn) | Golden Handler §4 "an EXACT mirror against a deployed handler containing that helper" |
| ensureIndex / upsertDocs | deployed D1 handler | **AUTHORIZED REUSE + ALLOWED DELTA** (project index name/field set) | Golden Handler §4 "ALLOWED DELTA" |
| chunkText | deployed D1 handler | **ALLOWED DELTA** (byte-identical to D1) | Golden Handler §4 "ALLOWED DELTA" |
| on-ingest indexing block (after COMMIT, non-fatal) | deployed D1 handler on-ingest block (`text`→`content`, log label) | **ALLOWED DELTA** | Golden Handler §4 "ALLOWED DELTA" |

## New handler + package
Included: `theo_add_project_knowledge/index.js` (blob `fc0163383a4714b8dd0d887a5b74a92723470410`; `node --check` PASS). `function.json` (blob `ce3589b4` — route binding UNCHANGED from deployed) is included in the package and inlined full-verbatim above (Golden Handler §2 pair); it is NOT redeployed (index.js-only deploy). No `package.json` change (no new dep; premium's existing `pg` covers it; the indexing uses Node built-in `https`). Deploy unit = this single handler file (premium Kudu VFS surgical overwrite, DR-T14 / §5.5).

## Golden Curls (P7; run by Claude Code post-deploy)
Bearer via `az account get-access-token` for `api://4e1a1e31-…/access_as_user`; premium base `https://vaultgpt-func-premium-…uksouth-01.azurewebsites.net`.
```
# GC-D2a-1 (indexing) — create a project (premium), then theo_add_project_knowledge with a distinctive
#   probe token in `content` -> 201. Query Azure AI Search theo-project-knowledge with
#   $filter=knowledge_id eq '<returned id>' -> expect >=1 doc with matching project_id + non-empty
#   content_vector (proves the on-ingest indexer ran).
# GC-D2a-2 (end-to-end retrieval) — POST theo_message_stream (func-stream) with body.project_id = that
#   project + a question about the probe -> the SSE answer surfaces the probe content (D1+D3 loop now
#   also covers TEXT knowledge). Control without project_id -> not surfaced.
# GC-D2a-3 (regression) — bad project_id -> 400; blank content -> 400; no-bearer -> 401 (unchanged;
#   on-ingest is non-fatal so a reachable-Search add still 201s).
# (test project + knowledge + index docs cleaned up after)
```

## Parity Checklist (Golden Handler §5.4)
- [x] Single canonical Primary Reference (deployed theo_add_project_knowledge) — handler index.js AND paired function.json both inlined full verbatim; live-fetched byte-faithful.
- [x] Reused helpers byte-identical to the deployed D1 handler (verified this turn); Walter-authorized composite names D2.
- [x] Structural mirror classifies every region; on-ingest block + chunking = ALLOWED DELTAs.
- [x] Executes as the signed-in user; unchanged Postgres access; index docs carry created_by + project_id.
- [x] Only theo_ tables + the shared vaultgpt-search; no reporting_*; no new external system; no new npm dep.
- [x] No schema change; no contract change.
- [x] Indexing NON-FATAL (add still 201 on index failure).
- [x] node --check PASS; unified diff = purely the additive indexing code; golden curls incl. index-verify + end-to-end retrieval; Claude Code runs post-deploy.
- [x] Premium deploy scoped to DR-T14 surgical Kudu VFS of this one handler; mechanical lint PASS.

## §Deploy (Pass-3, on APPROVAL) — Claude Code, `vaultgpt-func-premium` surgical Kudu VFS (DR-T14 / §5.5)
1. Kudu VFS PUT `site/wwwroot/theo_add_project_knowledge/index.js` (blob `fc016338`) over the deployed file (ARM-bearer; If-Match the current ETag), GET-back + diff to confirm byte-identical, then `az functionapp restart`. **Only** this handler file is touched (DR-T14 scope).
2. Claude Code runs GC-D2a-1..3 and reports.
3. No Role-C (route + response shape unchanged; the RAG index is an internal artifact).

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-D2a-ProjectTextKnowledge-Indexing-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review (APPROVED / REJECTED only). On APPROVED, Claude Code deploys the single handler file to premium via DR-T14 surgical Kudu VFS overwrite and runs the golden curls.
