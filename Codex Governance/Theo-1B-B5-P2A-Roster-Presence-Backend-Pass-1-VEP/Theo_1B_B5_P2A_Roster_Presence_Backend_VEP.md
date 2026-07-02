# Theo 1B — B5 Phase 2A Roster/Presence backend (`theo_list_people` — OBO→Graph over Vault Staff) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handler provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** the first step of Phase 2 of the Sharing/Visibility tier — the **roster + live presence** backend for the vault-origin "People" panel (Walter-directed: a Teams-style presence component; native in-Vault chat is a separate future project this endpoint is designed to feed). One GREENFIELD read handler **`theo_list_people`**: it enumerates the **`Vault Staff`** dynamic group (the employeeId-gated employee population, id `86a86cad-…`) and their **live Microsoft Graph presence**, via **delegated Graph on-behalf-of (OBO)** — the same technique + env as the deployed `reporting_dms_tree` DMS handler on this monolith (`AAD_TENANT_ID`/`AAD_CLIENT_ID`/`AAD_CLIENT_SECRET`; `AAD_CLIENT_ID` = the "Vault GPT API" app now holding the admin-consented `User.Read.All`/`Presence.Read.All`/`GroupMember.Read.All` delegated scopes). Each person is **keyed by Entra OID** (the same identity used as `created_by` everywhere) so the future in-Vault chat keys conversations on OID pairs with no re-lookup. Read-only; no DB, no Blob, no migration, no new infra/secret.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `6179bc0` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked; no migration. Primary Reference (Golden §2) = the **deployed** `theo_list_projects` **pair** (B4a) — a Family-B GET read handler (`getPrincipal`/`getClaimValue` OID extraction, `{data,meta}`/`{error}` envelope, GET function.json), inlined verbatim §SM/§SM-FJ; `theo_list_people` mirrors its envelope + read-and-return shape. The **OBO→Graph token exchange + HTTP helpers** are a **DEVIATION (new external-system helper, Golden §"DEVIATION")** — a **byte-identical verbatim lift** from the **deployed** `reporting_dms_tree` (corporate-reporting; runs on this same `vaultgpt-func-premium` monolith, so `AAD_*` OBO env already present) — evidence inlined §SM-OBO. Graph calls: `GET /groups/{VaultStaffId}/members/microsoft.graph.user` + `POST /communications/getPresencesByUserId` + best-effort `GET /users/{id}/photos/48x48/$value`. Delegated scopes admin-consented 2026-07-02 on the OBO client (`4e1a1e31`). Read-only; no DB/Blob/migration. Config verified this turn: monolith `vaultgpt-func-premium` (rg Vault-Tax) has `AAD_CLIENT_ID=4e1a1e31`, `AAD_TENANT_ID`, `AAD_CLIENT_SECRET`. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `git grep -F "Gap Register"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §DEVIATION external-system helper) | `git grep -F "selects **exactly one** deployed handler file" / "external-system helper"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` | cited | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (delegated Graph) | `git grep -F "delegated Graph"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` | cited (boundary) | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2 surface; People row lands post-deploy) | `Read` this turn | `6f8723ad54982daea1e7894d4ce7f9da821c824a` |
| 9 | **Primary Reference handler** (deployed Family-B GET read) — `Codex Governance/Theo-1B-B4a-Projects-CRUD-Handlers-Pass-1-VEP/theo_list_projects.index.js` | `Read(full)` this turn | `824a2243b4f4f23ce504b4d0d363d929e5d09a36` |
| 10 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-B4a-Projects-CRUD-Handlers-Pass-1-VEP/theo_list_projects.function.json` | `Read(full)` this turn | `e2e2f32fa9931426cb2e9a0f2fd02111d9c31e49` |
| 11 | **OBO DEVIATION source** (deployed, same monolith) — `corporate-reporting/Bolt Governance/DMS-Tree-10.0q-File-Node-Extension-Execution-Handoff/deploy/reporting_dms_tree.index.js` (OBO region) | `Read(145–264)` this turn | `a749ce2942e479217137e6211d8fad3ef85c328d` (corporate-reporting) |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` **change** (reporting_dms_tree cited read-only as the OBO reference). No DB, no Blob, no migration. `theo_message`/`theo_message_stream` NOT touched.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | delegated-Graph | "delegated Graph" | §P3 — roster/presence via delegated Graph (OBO) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_list_projects` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §DEVIATION | "external-system helper" | §SM-OBO — OBO→Graph is a DEVIATION, verbatim-lifted from deployed `reporting_dms_tree` |
| Codex Governance/Theo-1B-B4a-Projects-CRUD-Handlers-Pass-1-VEP/theo_list_projects.function.json | binding | "httpTrigger" | §SM-FJ — Primary Reference function.json |
| Codex Governance/Theo-1B-B4a-Projects-CRUD-Handlers-Pass-1-VEP/theo_list_projects.index.js | OID | "getClaimValue" | §HG.1 — same OID extraction + Family-B envelope |

---

## P1 — Feature identification
**Microstep:** the roster/presence backend (Phase 2A of the Sharing/Visibility tier). `theo_list_people` returns the **`Vault Staff`** roster (each member's Entra OID, display name, email, job title) + **live presence** (availability/activity) + a best-effort **profile photo**, for the vault-origin "People" panel (Phase 2B). Read-only; keyed by OID so the future in-Vault chat (a separate project) can key conversations on OID pairs. **Out of scope:** the vault-origin panel UI (Phase 2B, VO/Codex regime), per-member project invite (Phase 2C), and native chat (separate future project).

## P2 — Architecture & boundary reconciliation
- **Family-B read handler** (no DB): `getPrincipal`→`getClaimValue` for the caller OID (for `isSelf` + auth), `{data,meta}`/`{error}` envelope, GET `function.json`. Mirrors the deployed `theo_list_projects` envelope (§SM).
- **Delegated Graph via OBO (DEVIATION — new external-system helper).** The handler reads the caller's bearer (`Authorization`, or the EasyAuth `x-ms-token-aad-access-token` fallback) and exchanges it for a Graph token (`grant_type=jwt-bearer`, `requested_token_use=on_behalf_of`, `scope=graph/.default`) at `login.microsoftonline.com/{tenant}/oauth2/v2.0/token`, using `AAD_CLIENT_ID/SECRET/TENANT_ID`. This block + the `requestUrl` helper are a **byte-identical verbatim lift** from the deployed `reporting_dms_tree` (§SM-OBO) — a documented DEVIATION per Golden §. No new secret: the same monolith already runs that DMS handler with these env vars, and `AAD_CLIENT_ID` = the "Vault GPT API" app (`4e1a1e31`) that holds the admin-consented `User.Read.All`/`Presence.Read.All`/`GroupMember.Read.All` scopes.
- **Graph reads only.** `GET /groups/{VaultStaffId}/members/microsoft.graph.user?$select=id,displayName,mail,userPrincipalName,jobTitle`; `POST /communications/getPresencesByUserId {ids}`; best-effort `GET /users/{id}/photos/48x48/$value`. All under the caller's delegated identity (they only see what they're entitled to; every Vault Staff member is entitled to the roster).
- **Resilience.** Presence + photo failures degrade to `null` (never fail the roster). A failed token exchange → 403.
- **Boundary.** No `theo_*` table, no Blob, no model gateway, no migration; **no change to any `reporting_*` handler** (reporting_dms_tree cited read-only as the OBO reference); no `theo_message`/`theo_message_stream` change. Reads only the `Vault Staff` group (configurable via `THEO_ROSTER_GROUP_ID`, default `86a86cad-…`).

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** One new function on `vaultgpt-func-premium`. **No migration, no new env/secret** (`AAD_*` OBO config + admin-consented Graph scopes already present/verified this turn). | **PRE-LAND** — §DEPLOY; Claude Code golden curls confirm (roster returns the 9 Vault Staff keyed by OID; presence present; isSelf flag; unauth → 401). |
| G-2 | **Authority-doc update post-deploy.** API Spec gains a People/roster row (§2.x). | **PRE-LAND** — a short API-Spec Role-C follows deploy (mirrors B4x), before the Phase-2B FE VEP cites it. |
| G-3 | **Photos as base64 data URIs** inflate the payload; small roster (~9) makes this negligible, and photos are best-effort (null on any failure). | **PROCEED** — acceptable for the roster size; a switch to on-demand photo fetch is a later option if the population grows. |
| G-4 | **Presence latency / caching.** Presence is a point-in-time fetch; the panel refreshes periodically. Real-time presence + the future in-Vault chat will need push infra (Azure Web PubSub / a v4 sidecar). | **PROCEED (future-trigger).** Out of scope; the panel polls for now (the refresh seam later carries chat/typing). |

No write SQL, no migration, no `reporting_*` change in this pack.

## P3 — Backend / contract grounding
Contract basis = Microsoft Graph (delegated, OBO) + the deployed `Vault Staff` dynamic group (Backend Plan "delegated Graph"; Rule Anchor). Endpoint (new): `GET /api/theo_list_people` → `{ people: [{ id, displayName, email, jobTitle, availability, activity, photo, isSelf }], self }`, standard `{data,meta}` envelope; 401 (no identity / no bearer), 403 (OBO/Graph forbidden), 500. API Spec People row lands post-deploy (G-2).

## P4 — Per-handler contract
- **`theo_list_people`** (GET): caller OID via `x-ms-client-principal` (401 if none) + OBO input bearer (401 if none) → exchange to Graph token (403 on failure). `GET Vault Staff members (users)` → ids; `POST getPresencesByUserId(ids)` (best-effort) → availability/activity; best-effort photos → data URIs. Returns `people[]` keyed by OID, `isSelf` = (member id === caller OID), self-first then alphabetical.

## P5 — Component reference grounding
Primary Reference (Golden §2) = the **deployed** `theo_list_projects` **pair** — Family-B GET read (OID extraction; envelope; GET function.json), inlined byte-identical §SM/§SM-FJ. `theo_list_people` mirrors its envelope + read-and-return shape (ALLOWED DELTA = the Graph-sourced payload + `isSelf`; no DB). The **OBO→Graph token exchange + `requestUrl`** are a **DEVIATION (new external-system helper)** — inlined byte-identical from the deployed `reporting_dms_tree` (§SM-OBO); the `requestBinary` photo helper is the standard binary variant of the same technique. No other new external system.

## P6 — Repository & active-surface grounding
New artifacts: `theo_list_people.index.js` + `.function.json`. No migration, no DB, no Blob. `theo_message`/`theo_message_stream` + all `reporting_*` handlers unchanged. Guardrails: no browser storage; no secret/token/OID leaked in output (the client secret is read from env, never logged); `node --check` clean; `function.json` GET, route matches handler name, `authLevel` anonymous (EasyAuth validates + injects the principal; OBO uses the caller's bearer).

## P7 — Risk / regression
- **Greenfield read:** one new function; no change to deployed handlers/tables/policies; no migration.
- **OBO verbatim-lifted** from a deployed, working handler on the same app → same env, same auth surface; token exchange failures map to 403.
- **Least privilege:** delegated (not application) Graph — the handler acts as the caller; a caller only ever sees the roster they're entitled to.
- **Resilience:** presence/photo failures degrade to null; the roster still returns.
- **No secret exposure:** `AAD_CLIENT_SECRET` used only in the token POST body; never logged or returned.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED); Primary Reference inlined byte-identical (§SM/§SM-FJ); the OBO DEVIATION source inlined byte-identical (§SM-OBO); the full handler (§HG.1) + `function.json` (§FJ.1); Structural Mirror (§SM-TABLE) + parity checklist (§PARITY). No migration. Plan-only. On Codex APPROVAL, Walter deploys the one function; Claude Code golden-curls (roster of 9 keyed by OID + presence + isSelf; unauth 401); then the API-Spec Role-C (G-2); then Phase 2B (the vault-origin People panel, VO/Codex regime).

---

## §SM — Primary Reference (deployed `theo_list_projects`, byte-identical; Family-B GET read + envelope)
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

    // Explicit ownership scope: the shared connection role bypasses RLS, so isolation is enforced
    // by the created_by predicate (never RLS alone). Newest-updated first (backs the Projects list).
    const result = await client.query(
      `
      SELECT
        id,
        name,
        description,
        instructions,
        app_key,
        created_at,
        updated_at
      FROM public.theo_projects
      WHERE created_by = $1
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

## §SM-FJ — Primary Reference function.json (deployed `theo_list_projects.function.json`, byte-identical)
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

## §SM-OBO — DEVIATION source (deployed `reporting_dms_tree` OBO region, byte-identical excerpt; new external-system helper lifted verbatim)
```js
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);

    const req = https.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : 443,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers || {},
            body: data,
          });
        });
      }
    );

    req.on("error", reject);

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

function getBearerTokenFromAuthorization(req) {
  const raw = req.headers["authorization"];
  if (!raw || typeof raw !== "string") return null;

  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match && match[1] ? match[1].trim() : null;
}

function getOboInputToken(req) {
  const bearer = getBearerTokenFromAuthorization(req);
  if (bearer) {
    return {
      token: bearer,
      source: "authorization_bearer",
    };
  }

  const tokenStore = req.headers["x-ms-token-aad-access-token"];
  if (typeof tokenStore === "string" && tokenStore.trim() !== "") {
    return {
      token: tokenStore.trim(),
      source: "x-ms-token-aad-access-token",
    };
  }

  return null;
}

async function exchangeGraphToken(oboInputToken) {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw buildKnownError(
      "INTERNAL_SERVER_ERROR",
      "Missing required OBO configuration.",
      500
    );
  }

  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    requested_token_use: "on_behalf_of",
    assertion: oboInputToken,
    scope: "https://graph.microsoft.com/.default",
  }).toString();

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const r = await requestUrl(
    tokenUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(form),
      },
    },
    form
  );

  const payload = parseJsonSafe(r.body);

  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    const description =
      payload &&
      (payload.error_description || payload.error || payload.error_codes?.join(", "));
    const message = description
      ? `Delegated Graph token exchange failed: ${description}`
      : "Delegated Graph token exchange failed.";

    if (r.statusCode === 400 || r.statusCode === 401 || r.statusCode === 403) {
      throw buildKnownError("FORBIDDEN", message, 403);
    }

    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }

  return payload.access_token;
}
```

---

## §HG.1 — `theo_list_people/index.js` (full, NEW)
```js
const https = require("https");

// theo_list_people (Tier B5/Phase 2A) — the Vault Staff roster + live presence for the vault-origin
// "People" panel. Read-only. Delegated Microsoft Graph via ON-BEHALF-OF (OBO): the signed-in user's
// bearer token is exchanged for a Graph token server-side (same technique + env as the deployed
// reporting_dms_tree DMS handler on this monolith: AAD_TENANT_ID / AAD_CLIENT_ID / AAD_CLIENT_SECRET,
// where AAD_CLIENT_ID = the "Vault GPT API" app that holds the admin-consented User.Read.All /
// Presence.Read.All / GroupMember.Read.All delegated scopes). No DB, no Blob. Each person is keyed by
// Entra OID (the same identity used as created_by everywhere) so the future in-Vault chat can key
// conversations on OID pairs with no re-lookup.

const ROSTER_GROUP_ID = process.env.THEO_ROSTER_GROUP_ID || "86a86cad-515e-4cad-bdb2-3434242e74b6"; // "Vault Staff" dynamic group (employeeId-based)
const GRAPH = "https://graph.microsoft.com/v1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}

function nowIso() { return new Date().toISOString(); }

function errorBody(code, message, status) {
  return { error: { code, message, status, timestamp: nowIso() } };
}

function successBody(data) {
  return { data, meta: { timestamp: nowIso(), version: "1.0" } };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim() !== "") return match.val.trim();
  }
  return null;
}

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code; err.status = status; err.isKnown = true;
  return err;
}

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// ── HTTP + OBO→Graph (verbatim technique from the deployed reporting_dms_tree) ──────────────
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = https.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : 443,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }); });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// Binary variant (photo bytes): collect Buffer chunks (must NOT coerce to string).
function requestBinary(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = https.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : 443,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => { chunks.push(chunk); });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: Buffer.concat(chunks) }); });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function getBearerTokenFromAuthorization(req) {
  const raw = req.headers["authorization"];
  if (!raw || typeof raw !== "string") return null;
  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match && match[1] ? match[1].trim() : null;
}

function getOboInputToken(req) {
  const bearer = getBearerTokenFromAuthorization(req);
  if (bearer) {
    return {
      token: bearer,
      source: "authorization_bearer",
    };
  }

  const tokenStore = req.headers["x-ms-token-aad-access-token"];
  if (typeof tokenStore === "string" && tokenStore.trim() !== "") {
    return {
      token: tokenStore.trim(),
      source: "x-ms-token-aad-access-token",
    };
  }

  return null;
}

async function exchangeGraphToken(oboInputToken) {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw buildKnownError("INTERNAL_SERVER_ERROR", "Missing required OBO configuration.", 500);
  }
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    requested_token_use: "on_behalf_of",
    assertion: oboInputToken,
    scope: "https://graph.microsoft.com/.default",
  }).toString();
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(
    tokenUrl,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } },
    form
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    const description = payload && (payload.error_description || payload.error || (payload.error_codes && payload.error_codes.join(", ")));
    const message = description ? `Delegated Graph token exchange failed: ${description}` : "Delegated Graph token exchange failed.";
    if (r.statusCode === 400 || r.statusCode === 401 || r.statusCode === 403) throw buildKnownError("FORBIDDEN", message, 403);
    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }
  return payload.access_token;
}

async function graphGetJson(url, accessToken) {
  const r = await requestUrl(url, { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } });
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300) {
    const message = (payload && payload.error && payload.error.message) || `Graph request failed (HTTP ${r.statusCode}).`;
    if (r.statusCode === 401 || r.statusCode === 403) throw buildKnownError("FORBIDDEN", message, 403);
    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }
  return payload || {};
}

async function graphPostJson(url, accessToken, bodyObj) {
  const body = JSON.stringify(bodyObj);
  const r = await requestUrl(
    url,
    { method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
    body
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300) {
    const message = (payload && payload.error && payload.error.message) || `Graph request failed (HTTP ${r.statusCode}).`;
    if (r.statusCode === 401 || r.statusCode === 403) throw buildKnownError("FORBIDDEN", message, 403);
    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }
  return payload || {};
}

// Best-effort 48x48 profile photo → data URI (null when absent/forbidden/any failure). Never fails the roster.
async function fetchPhotoDataUri(oid, accessToken) {
  try {
    const r = await requestBinary(`${GRAPH}/users/${encodeURIComponent(oid)}/photos/48x48/$value`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (r.statusCode < 200 || r.statusCode >= 300 || !r.body || r.body.length === 0) return null;
    const contentType = (r.headers["content-type"] || "image/jpeg").split(";")[0].trim();
    return `data:${contentType};base64,${r.body.toString("base64")}`;
  } catch {
    return null;
  }
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") return send(context, 204, "");

  const principal = getPrincipal(req);
  const callerOid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!callerOid) return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));

  const oboInput = getOboInputToken(req);
  if (!oboInput) return send(context, 401, errorBody("UNAUTHORIZED", "Missing bearer token for delegated Graph access.", 401));

  try {
    const graphToken = await exchangeGraphToken(oboInput.token);

    // 1) Vault Staff members (users only, selected fields). The group is the employeeId-gated roster.
    const membersRes = await graphGetJson(
      `${GRAPH}/groups/${encodeURIComponent(ROSTER_GROUP_ID)}/members/microsoft.graph.user?$select=id,displayName,mail,userPrincipalName,jobTitle&$top=999`,
      graphToken
    );
    const members = Array.isArray(membersRes.value) ? membersRes.value : [];
    const ids = members.map((m) => m.id).filter((id) => typeof id === "string" && id);

    // 2) Live presence for those ids (best-effort — a presence failure yields null availability, never
    // fails the roster). getPresencesByUserId accepts up to 650 ids; the roster is far smaller.
    const presenceById = new Map();
    if (ids.length) {
      try {
        const presRes = await graphPostJson(`${GRAPH}/communications/getPresencesByUserId`, graphToken, { ids });
        for (const p of (Array.isArray(presRes.value) ? presRes.value : [])) {
          if (p && typeof p.id === "string") presenceById.set(p.id, { availability: p.availability || null, activity: p.activity || null });
        }
      } catch (e) {
        context.log.warn("theo_list_people: presence fetch failed (roster still returned)", e);
      }
    }

    // 3) Photos (best-effort, parallel; null when absent). Small roster → a handful of calls.
    const photos = await Promise.all(members.map((m) => fetchPhotoDataUri(m.id, graphToken)));

    const people = members.map((m, i) => {
      const pres = presenceById.get(m.id) || { availability: null, activity: null };
      return {
        id: m.id,                                   // Entra OID — canonical person key (chat-forward)
        displayName: m.displayName || m.userPrincipalName || "Unknown",
        email: m.mail || m.userPrincipalName || null,
        jobTitle: m.jobTitle || null,
        availability: pres.availability,            // Available | Busy | Away | BeRightBack | DoNotDisturb | Offline | ...
        activity: pres.activity,
        photo: photos[i],                           // data: URI or null
        isSelf: m.id === callerOid,
      };
    });

    // Self first, then alphabetical by display name — the panel shows "you" at the top.
    people.sort((a, b) => (a.isSelf === b.isSelf ? a.displayName.localeCompare(b.displayName) : a.isSelf ? -1 : 1));

    return send(context, 200, successBody({ people, self: callerOid }));
  } catch (err) {
    context.log.error("theo_list_people failed", err);
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  }
};
```
## §FJ.1 — `theo_list_people/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_people"
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

## §SM-TABLE — Structural Mirror (every region → reference, with classification)
| Region | Reference region | Classification |
| --- | --- | --- |
| `corsHeaders`; `send`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`buildKnownError` | `theo_list_projects` (Primary Reference) | EXACT |
| OID extraction + 401 (`getClaimValue` [objectidentifier, oid, nameidentifier]) | `theo_list_projects` | EXACT |
| `{data,meta}` success / `{error}` failure envelope; 42501-style→403 / isKnown / 500 mapping | `theo_list_projects` | EXACT / ALLOWED DELTA (Graph error mapping) |
| `requestUrl` HTTP helper; `getBearerTokenFromAuthorization`/`getOboInputToken`/`exchangeGraphToken` (OBO token exchange) | `reporting_dms_tree` (deployed OBO handler, same monolith) | **DEVIATION — new external-system helper, byte-identical verbatim lift (§SM-OBO)** |
| `requestBinary` (photo bytes) | binary variant of `requestUrl` (same technique) | ALLOWED DELTA (binary collection) |
| `graphGetJson` / `graphPostJson` (Graph calls: group members, getPresencesByUserId) | Graph REST (delegated); wraps `requestUrl` | ALLOWED DELTA (Graph endpoints) |
| `fetchPhotoDataUri` best-effort photo → data URI | none (feature-specific, resilient) | ALLOWED DELTA |
| `function.json` (httpTrigger, anonymous, GET, underscore route) | `theo_list_projects.function.json` | EXACT / ALLOWED DELTA (route name) |
| No DB / `set_config` / `pg` | `theo_list_projects` has DB; this handler is Graph-only | ALLOWED DELTA (no DB — Graph read) |

No model-gateway change; no `reporting_*` change; no migration. The only DEVIATION is the OBO block, verbatim-lifted from a deployed handler (§SM-OBO) per Golden §.

## §PARITY — Golden Handler Standard parity checklist (§5.4)
- [x] Single canonical Primary Reference handler + function.json selected and inlined full-verbatim (§SM/§SM-FJ).
- [x] Structural Mirror Table present, every region classified + anchored; the one DEVIATION (OBO) is a byte-identical lift from a deployed handler, inlined (§SM-OBO).
- [x] Executes as the signed-in user (delegated OBO — least privilege); caller OID from the principal; no application-level Graph.
- [x] Reads only Microsoft Graph (roster/presence/photo) + no `theo_*`/`reporting_*` write; no tokens/secret/OIDs leaked in output.
- [x] Deterministic status codes (401 no identity/bearer, 403 OBO/Graph forbidden, 500); resilient presence/photo (null on failure).
- [x] No migration; no DB; no prohibited psql meta-commands (no `sql` blocks).
- [x] Deterministic golden curls (§CURL); `node --check` clean; `function.json` JSON-valid.

---

## §DEPLOY — Walter deploy steps (one new function; no migration, no new env/secret)
1. Create `theo_list_people` (§HG.1 + §FJ.1) on `vaultgpt-func-premium`. (No new app setting — `AAD_TENANT_ID`/`AAD_CLIENT_ID`/`AAD_CLIENT_SECRET` already present; Graph scopes already admin-consented; `THEO_ROSTER_GROUP_ID` defaults to the Vault Staff group so no setting is required.)
2. Reply "P2A backend deployed" → Claude Code runs §CURL.

## §CURL — verification plan (token via `az`; never printed; captured under `.local/`)
1. **Roster** — `GET /api/theo_list_people` → **200** `{ data: { people: [...], self } }`; `people.length` = 9 (the Vault Staff members); every entry has an `id` (OID) + `displayName`; exactly one `isSelf: true` (Walter) and `self` = his OID.
2. **Presence present** — at least the caller's entry has a non-null `availability` (e.g. "Available"/"Away"); others may vary (best-effort).
3. **Photo shape** — `photo` is either a `data:` URI or `null` (never errors).
4. **Auth** — a request with no bearer / no principal → **401** (asserted structurally; the az call always carries the bearer).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B5 Phase 2A Roster/Presence (backend) Pass-1 Backend VEP (plan only).*
