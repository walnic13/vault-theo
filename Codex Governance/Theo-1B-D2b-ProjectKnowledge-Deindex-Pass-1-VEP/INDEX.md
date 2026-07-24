# Theo Backend — `theo_remove_project_knowledge` de-index on removal (Phase D / D2b): Pass-1 Verified Evidence Pack

Backend Verified Evidence Pack (plan). Phase D / D2b: after `theo_remove_project_knowledge` (premium) hard-deletes a knowledge row, it **deletes that item's docs from the Azure AI Search `theo-project-knowledge` index** (find the item's chunk docs by `knowledge_id`, then delete them by key) so removed knowledge is no longer retrievable. This closes the de-index half of Phase D / D2 (D1+D2a index on ingest; this removes on delete). It is defence-in-depth alongside D3's live-DB intersect (which already excludes a removed item from retrieval); together, removed knowledge is both dropped at retrieval AND purged from the index. De-index is **NON-FATAL** (a Search failure never fails the removal — the row is already deleted). No new npm dependency (Search over `https`), no schema change, no contract change (response shape identical). Deploys to premium via the **DR-T14** surgical Kudu VFS carve-out. `node --check` PASS this turn.

Reuse: `requestUrl`, `parseJsonSafe`, `getAadToken` are **byte-identical to the deployed `theo_add_project_knowledge_file` (D1)** (verified this turn). The new `deindexKnowledge` helper composes two already-deployed patterns on the **same** `vaultgpt-search` service (no new external system): its query mirrors the deployed `searchProjectKnowledge` (D3), and its `docs/index` delete mirrors the deployed `upsertDocs` (D1) with `@search.action: "delete"`. De-index is within the Walter-directed D2 scope ("on-ingest RAG indexing + de-index for project text knowledge") that DR-T14's rationale names for `theo_remove_project_knowledge`.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5

Turn issued against HEAD: `@@ISSUED_HEAD@@` (vault-theo, `development`; grounding parent `8f1dc7e322e037f01ab2259a7c4cf04a520faa43`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Baseline-verification note: the Primary Reference below was fetched **live** from `vaultgpt-func-premium` (Kudu VFS `site/wwwroot/theo_remove_project_knowledge/{index.js,function.json}`, ARM-bearer GET, HTTP 200) this turn (index.js blob `7aebd8d50ad2ec0c9670becf8778a7bc2ed4ebff`, function.json blob `9f94287423a257bb09736838b018b0983935f0f2`); both inlined verbatim (spliced from disk, no reconstruction).

### §4 Documents grounded this turn (Full Baseline)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Claude Code Theo Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3/§4/§7) | `Grep` this turn | `d553df9d8bb0e7977a215c6ebf2b554dd3f88e43` |
| 2 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2/§4/§5/§5.5 + DR-T14) | `Read` this turn | `61957b1bcf7f9fb0953ad8d6204d3e7bdde16f0a` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5/§10) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1E DR-T14 — theo_remove_project_knowledge named) | `Read`+`Grep` this turn | `7e31e35eea3a8712d8317e6bb52ea6bca4f9876b` |
| 5 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 boundary, §5 RLS, §6 RAG) | `Grep` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 `theo_remove_project_knowledge`) | `Grep` this turn | `c99a66f39b4ec03644701c266e49aaf2bf52c2ed` |
| 7 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§5 `theo_project_knowledge` — immutable, hard-delete) | `Read`+`Grep` this turn | `fa9aad4c75019de0b621e31b5d33ef97f3689639` |
| 8 | Primary Reference (deployed, live-fetched) — `theo_remove_project_knowledge/index.js` (premium) — blob `7aebd8d50ad2ec0c9670becf8778a7bc2ed4ebff` | `Read` this turn (+ live Kudu fetch) | `7aebd8d50ad2ec0c9670becf8778a7bc2ed4ebff` (inlined verbatim below) |
| 8b | Primary Reference (deployed) — `theo_remove_project_knowledge/function.json` (paired binding — Golden Handler §2) — blob `9f94287423a257bb09736838b018b0983935f0f2` | `Read` this turn (+ live Kudu fetch) | `9f94287423a257bb09736838b018b0983935f0f2` (inlined verbatim below) |
| 9 | Authorized-reuse source (deployed) — `theo_add_project_knowledge_file/index.js` (D1) — requestUrl/parseJsonSafe/getAadToken + upsertDocs/searchProjectKnowledge patterns | `Read` this turn | `edbb107fc22ea22b36f424725b6a42767822a555` (reused helpers byte-identical; verified this turn) |

## Premium deploy authority: DR-T14
DR-T14 (Walter-granted 2026-07-24, Path B; Role-C APPROVED + applied `0a8f99f`) names `theo_remove_project_knowledge` as a Projects-domain knowledge handler Claude Code MAY deploy to premium via surgical Kudu VFS after a Codex-APPROVED VEP, with rationale "on-ingest RAG indexing + de-index for project text knowledge (Phase D / D2)".

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "exactly one" | §Primary Reference — canonical deployed theo_remove_project_knowledge (handler + function.json) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "an EXACT mirror against a deployed handler containing that helper" | §Structural Mirror — requestUrl/parseJsonSafe/getAadToken byte-identical to deployed D1 |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "ALLOWED DELTA" | §Structural Mirror — deindexKnowledge + on-removal block = ALLOWED DELTAs (composed from deployed Search patterns) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "EXCEPTION (DR-T14, 2026-07-24)" | §Deploy — premium surgical Kudu VFS of theo_remove_project_knowledge |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 | "Primary reference artifact cited without full verbatim inline this turn" | §Primary Reference — handler + function.json full verbatim inline below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T14 | "theo_remove_project_knowledge" | §Deploy — the authority naming this handler |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | §5 | "theo_project_knowledge" | §P3 — target table; hard-delete (immutable), de-index follows |

## Architecture & boundary reconciliation (§4A.1 P2)
- **§1 boundary** — reads/deletes only `theo_project_knowledge` (Postgres, unchanged) + deletes docs in the shared `vaultgpt-search` `theo-project-knowledge` index. No `reporting_*`. Search is the already-used B7b system; de-index is a delete on it (no new external system).
- **§5 theo_ schema + RLS** — unchanged Postgres access (`set_config` + explicit `created_by` on the DELETE); the de-index runs only for the row the caller actually deleted (`RETURNING id`), so it can never purge another owner's docs.
- **§6 RAG** — the de-index half of HF-T4 project knowledge.
- **Deploy** — premium classic per-fn; DR-T14 surgical Kudu VFS overwrite of `theo_remove_project_knowledge/index.js` ONLY.

## §1 Feature Identification + boundary
- **Change:** append a non-fatal de-index block to `theo_remove_project_knowledge` after COMMIT — `getAadToken(SEARCH_SCOPE)` then `deindexKnowledge(removedId)` (search the index for `knowledge_id eq '<removedId>'`, delete the returned doc keys) — plus the SEARCH_* config + the reused helpers (`requestUrl`/`parseJsonSafe`/`getAadToken`) + the new `deindexKnowledge`.
- **Boundary:** one handler edit; no new dep; no schema change; no contract change (same route + `{deleted, id}` response). De-index failures are swallowed (logged) — the 200 + the DB delete stand. `node --check` PASS. Handler blob `bbf20f3a602185c4e91275d911f20ae0f5a733d2`; +116 / −1 vs the live baseline (all net-new de-index code — the premium handler had no HTTP/Search helpers).

## §2 Gap Register
**PROCEED.**
- **(1) Reused helpers byte-identical to a deployed handler.** requestUrl/parseJsonSafe/getAadToken verified byte-identical to the deployed D1 handler this turn. §4/T12 clean. PROCEED.
- **(2) deindexKnowledge is an ALLOWED DELTA, no new external system.** Its query mirrors the deployed searchProjectKnowledge (D3); its docs/index delete mirrors the deployed upsertDocs (D1) with `@search.action: "delete"`; same `vaultgpt-search`. Within the Walter-directed D2 "de-index" scope that DR-T14 names. PROCEED.
- **(3) No schema/contract change.** theo_project_knowledge unchanged (hard-delete already deployed); response shape identical. PROCEED.
- **(4) Non-fatal + owner-safe.** De-index runs only for the row actually deleted (`RETURNING id`, owner-scoped); a Search failure is caught + logged; the 200 stands. PROCEED.
- **(5) Belt-and-suspenders with D3.** Even before de-index, D3's live-DB intersect already prevents retrieval of a removed item; D2b additionally purges the index so the doc does not linger. PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** Phase D/D2b — de-index project knowledge on removal (HF-T4 de-index half).
- **P2:** architecture reconciliation above (theo_ + vaultgpt-search; no reporting_*).
- **P2.5:** Gap Register (PROCEED).
- **P3:** no schema change; `theo_project_knowledge` hard-delete unchanged; Search docs deleted by key.
- **P4:** no contract change (route + `{deleted, id}` response identical).
- **P5:** Primary Reference = live-fetched deployed `theo_remove_project_knowledge` (handler + function.json inlined verbatim); reused helpers byte-identical to D1; Structural Mirror + unified diff below.
- **P6:** no migration; handler SQL unchanged (the DELETE + set_config + exists-check are the deployed ones).
- **P7:** golden curls below (add→index→remove→verify Search doc gone; regression); Claude Code runs post-deploy.
- **P8:** this pack.

## Primary Reference (deployed, live-fetched `theo_remove_project_knowledge`) — FULL VERBATIM (Conformance T9)
Byte-faithful content of the deployed premium handler (blob `7aebd8d50ad2ec0c9670becf8778a7bc2ed4ebff`), fetched live this turn and spliced from disk — no reconstruction:
```javascript
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

### Primary Reference paired `function.json` (deployed) — FULL VERBATIM (Golden Handler §2 / Conformance T9)
Blob `9f94287423a257bb09736838b018b0983935f0f2` (deployed premium; route binding UNCHANGED by this VEP — index.js-only deploy):
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

## Exact unified diff vs the live-fetched baseline (authoritative delta)
```diff
--- deployed baseline (7aebd8d5)
+++ D2b handler (bbf20f3a)
@@ -5,4 +5,12 @@
   ssl: { rejectUnauthorized: false },
 });
+
+// Phase D / D2b - de-index on removal (Azure AI Search project-knowledge index). SEARCH_* config +
+// getAadToken/requestUrl/parseJsonSafe reused byte-identically from the deployed
+// theo_add_project_knowledge_file (D1) per the Walter-directed D2 scope + DR-T14. De-index is NON-FATAL.
+const SEARCH_ENDPOINT = (process.env.THEO_SEARCH_ENDPOINT || "").replace(/\/+$/, "");
+const PK_SEARCH_INDEX = process.env.THEO_PK_SEARCH_INDEX || "theo-project-knowledge";
+const SEARCH_API_VERSION = process.env.THEO_SEARCH_API_VERSION || "2023-11-01";
+const SEARCH_SCOPE = "https://search.azure.com/.default";
 
 const corsHeaders = {
@@ -98,4 +106,97 @@
 }
 
+// ---- HTTPS helper + AAD token: byte-identical from the deployed theo_add_project_knowledge_file (D1) ----
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
+function parseJsonSafe(raw) {
+  if (typeof raw !== "string" || raw.trim() === "") return null;
+  try {
+    return JSON.parse(raw);
+  } catch {
+    return null;
+  }
+}
+
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
+// ---- Phase D / D2b de-index helper. Query shape mirrors the deployed searchProjectKnowledge (D3);
+// the docs/index delete mirrors the deployed upsertDocs (D1) with @search.action "delete". Same
+// vaultgpt-search service (no new external system). ----
+async function deindexKnowledge(searchToken, knowledgeId) {
+  const qBody = JSON.stringify({ filter: `knowledge_id eq '${knowledgeId.replace(/'/g, "''")}'`, select: "id", top: 1000 });
+  const q = await requestUrl(
+    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(PK_SEARCH_INDEX)}/docs/search?api-version=${SEARCH_API_VERSION}`,
+    { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${searchToken}`, "Content-Length": Buffer.byteLength(qBody) } },
+    qBody
+  );
+  const payload = parseJsonSafe(q.body);
+  if (q.statusCode < 200 || q.statusCode >= 300 || !payload || !Array.isArray(payload.value)) {
+    throw new Error(`deindexKnowledge search failed (HTTP ${q.statusCode}).`);
+  }
+  const ids = payload.value.map((d) => d && d.id).filter((id) => typeof id === "string");
+  if (ids.length === 0) return 0;
+  const delBody = JSON.stringify({ value: ids.map((id) => ({ "@search.action": "delete", id })) });
+  const d = await requestUrl(
+    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(PK_SEARCH_INDEX)}/docs/index?api-version=${SEARCH_API_VERSION}`,
+    { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${searchToken}`, "Content-Length": Buffer.byteLength(delBody) } },
+    delBody
+  );
+  if (d.statusCode < 200 || d.statusCode >= 300) {
+    throw new Error(`deindexKnowledge delete failed (HTTP ${d.statusCode}).`);
+  }
+  return ids.length;
+}
+
+
 module.exports = async function (context, req) {
   if (req.method === "OPTIONS") {
@@ -169,5 +270,19 @@
     await client.query("COMMIT");
 
-    return send(context, 200, successBody({ deleted: true, id: deleted.rows[0].id }));
+    const removedId = deleted.rows[0].id;
+
+    // Phase D / D2b - best-effort de-index (NON-FATAL: a de-index failure NEVER fails the removal; the row
+    // is already deleted). Delete the removed item's Search docs so it is no longer retrievable. Complements
+    // D3's live-DB intersect (defence-in-depth).
+    try {
+      if (SEARCH_ENDPOINT) {
+        const searchToken = await getAadToken(SEARCH_SCOPE);
+        await deindexKnowledge(searchToken, removedId);
+      }
+    } catch (deindexErr) {
+      context.log.error("theo_remove_project_knowledge: de-index failed (non-fatal)", deindexErr);
+    }
+
+    return send(context, 200, successBody({ deleted: true, id: removedId }));
   } catch (err) {
     if (client) {
```

## Structural Mirror Table (Golden Handler §5.1)
| Region | Reference (deployed) | Classification | Anchor |
|---|---|---|---|
| Entire baseline handler body (validation, BEGIN/set_config, owner-scoped DELETE, exists-check, COMMIT, catch/finally) | deployed theo_remove_project_knowledge (primary ref) | **EXACT** (unchanged) | Golden Handler §2 "exactly one" |
| SEARCH_* config (SEARCH_ENDPOINT/PK_SEARCH_INDEX/SEARCH_API_VERSION/SEARCH_SCOPE) | deployed D1 handler config subset | **ALLOWED DELTA** (config) | Golden Handler §4 "ALLOWED DELTA" |
| requestUrl / parseJsonSafe / getAadToken | deployed D1 handler | **AUTHORIZED REUSE — EXACT** (byte-identical to D1, verified this turn) | Golden Handler §4 "an EXACT mirror against a deployed handler containing that helper" |
| deindexKnowledge | deployed searchProjectKnowledge (D3) query + deployed upsertDocs (D1) docs/index delete | **ALLOWED DELTA** (composed from deployed Search patterns; same vaultgpt-search; @search.action "delete") | Golden Handler §4 "ALLOWED DELTA" |
| on-removal de-index block (after COMMIT, non-fatal) | new | **ALLOWED DELTA** | Golden Handler §4 "ALLOWED DELTA" |

## New handler + package
Included: `theo_remove_project_knowledge/index.js` (blob `bbf20f3a602185c4e91275d911f20ae0f5a733d2`; `node --check` PASS) + `function.json` (blob `9f94287423a257bb09736838b018b0983935f0f2` — deployed binding, UNCHANGED; the Golden Handler §2 pair, inlined verbatim above; NOT redeployed). No `package.json` change (no new dep; Node built-in `https`). Deploy unit = the single `index.js` (premium Kudu VFS surgical overwrite, DR-T14 / §5.5).

## Golden Curls (P7; run by Claude Code post-deploy)
Bearer via `az account get-access-token` for `api://4e1a1e31-…/access_as_user`; premium base.
```
# GC-D2b-1 (de-index) — create a project; add TEXT knowledge with a probe token (theo_add_project_knowledge,
#   D2a) -> 201; confirm >=1 doc in theo-project-knowledge for that knowledge_id. Then
#   theo_remove_project_knowledge {knowledge_id} -> 200 {deleted:true}. Re-query the index for that
#   knowledge_id -> expect 0 docs (the on-removal de-index purged them).
# GC-D2b-2 (regression) — bad knowledge_id -> 400; unknown/foreign knowledge_id -> 404/403; no-bearer -> 401
#   (unchanged; de-index is non-fatal so a reachable-Search removal still 200s and still deletes the row).
# (test project cleaned up after)
```

## Parity Checklist (Golden Handler §5.4)
- [x] Single canonical Primary Reference (deployed theo_remove_project_knowledge) — handler index.js AND paired function.json both inlined full verbatim; live-fetched byte-faithful.
- [x] requestUrl/parseJsonSafe/getAadToken byte-identical to the deployed D1 handler (verified this turn); deindexKnowledge composed from deployed Search patterns (no new external system).
- [x] Structural mirror classifies every region; de-index block + deindexKnowledge = ALLOWED DELTAs.
- [x] De-index runs only for the owner-scoped deleted row (RETURNING id); cannot purge another owner's docs.
- [x] Only theo_ tables + the shared vaultgpt-search; no reporting_*; no new external system; no new npm dep.
- [x] No schema change; no contract change.
- [x] De-index NON-FATAL (removal still 200 + row deleted on Search failure).
- [x] node --check PASS; unified diff = purely the additive de-index code; golden curls incl. index-purge verification; Claude Code runs post-deploy.
- [x] Premium deploy scoped to DR-T14 surgical Kudu VFS of this one handler; mechanical lint PASS.

## §Deploy (Pass-3, on APPROVAL) — Claude Code, `vaultgpt-func-premium` surgical Kudu VFS (DR-T14 / §5.5)
1. Kudu VFS PUT `site/wwwroot/theo_remove_project_knowledge/index.js` (blob `bbf20f3a`) over the deployed file (ARM-bearer; If-Match the current ETag), GET-back + diff to confirm byte-identical, then `az functionapp restart`. **Only** this handler file is touched (DR-T14 scope).
2. Claude Code runs GC-D2b-1..2 and reports.
3. No Role-C (route + response shape unchanged; the RAG index is an internal artifact).

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-D2b-ProjectKnowledge-Deindex-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review (APPROVED / REJECTED only). On APPROVED, Claude Code deploys the single handler file to premium via DR-T14 surgical Kudu VFS overwrite and runs the golden curls.
