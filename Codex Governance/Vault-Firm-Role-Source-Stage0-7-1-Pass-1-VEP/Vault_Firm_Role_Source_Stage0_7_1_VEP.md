# Vault Firm-Role Source (Stage-0 §7.1) — `theo_get_my_role` + `resolveFirmRole` mapping — Pass-1 VEP

Backend implementation VEP (Pass 1) for **Stage-0 §7.1 firm-role source** of the Codex-APPROVED access-policy engine design ([[Vault_Access_Policy_Engine_Stage0_Design.md]] §6 G-2, §7.1). Delivers the engine's **firm-role dimension**: the canonical **`resolveFirmRole(jobTitle)`** mapping + a read-only handler **`theo_get_my_role`** that resolves the CALLER's firm role from their Entra/Graph `jobTitle` (delegated OBO), so the engine (`theo_can_read`, §7.3+) has a firm-role value to gate on. **Code-only — NO migration.** Rank hierarchy per [[VAULT_MEMORY_ARCHITECTURE.md]] Amendment 7: `partner > director > senior_manager > manager > associate > preparer > (null)`.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Verified Evidence Pack (backend implementation package)
Grounding parent (source baseline): `9940a3fa3c8d60ab4952505bb54fa38fa92dc27f` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the Codex activation note; currency anchors below are tip-independent blob SHAs
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Stage-0 DESIGN (this VEP implements §7.1) — `Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md` | Codex-APPROVED (`33f5655`); §6 G-2 / §7.1 this turn | `0e6779235c9b39935c4e63688f06a27ae92a8175` |
| 2 | GOVERNING VISION — `governance/VAULT_MEMORY_ARCHITECTURE.md` (§1 L2 role list; §3 info-type×role; Amendment 7 rank hierarchy) | `Grep`(firm-role taxonomy) + Amendment-7 edit this turn | `d17ddd0d97887b38e6db3297c56db9d6b3cfe9cf` |
| 3 | Golden Handler — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (handler structure, Golden SQL N/A, Golden Curl, §5.5 deploy) | `Grep("SECURITY DEFINER")` (Golden SQL n/a here — no DB) this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 4 | Backend Governor — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3 Never-Guess; §4 Schema Reality Lock; §8 VEP format) | `Grep("Never-Guess")` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 5 | Grounding Conformance — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 6 | Execution Orchestration — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1C Walter-runs-config/migrations; §1D pass order; §1E Claude-deploy-to-dedicated-func-apps) | `Grep("ordered, non-skippable")` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 7 | **PRIMARY REFERENCE (DEPLOYED)** — `theo_list_people` handler + function.json (OBO→Graph pattern + env, structural mirror; Golden Handler §2 requires BOTH files) | `Read`(theo_list_people.index.js + function.json, full) this turn; byte-faithful copies in-package | index.js `5ae78419dd7dd7b0873c6a97c197a09744ee508a`; function.json `fca156d9ba172f4eedb35b1d7f1c99abf51a2283` |
| 8 | CONTRACT TRUTH — `spec/THEO_API_SPEC.md` (§2 Contract Surface — the handler-route contract owner; `theo_get_my_role` NOT yet present → the §5 Role-C gap) | `Grep("theo_get_my_role")` (0 hits — absent) + `Grep("## §2 Contract Surface")` this turn | `ccab715b326ab365551e2e13db7292a1ba1d7dd4` |
| 9 | DEPLOYED FACT — `func-theo-tools` app settings (no AAD OBO env present) | `az functionapp config appsettings list` (names only) this turn | live Azure state (§3 precondition) |
| 10 | DEPLOYED FACT — Vault Staff jobTitles (mapping ground truth) | `az rest` Graph group-members `$select=jobTitle` this turn | live Azure state (§2) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (head) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "Never-Guess" | §2 mapping grounded on real deployed jobTitles (az) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" | §3 grounded on the live func-theo-tools env fact |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | Golden SQL | "SECURITY DEFINER" | N/A — this handler has NO DB/SQL (code-only OBO read) |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1D | "ordered, non-skippable" | §3 pass order (Walter config → Codex → Claude deploy) |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §A-7 | "partner > director > senior manager > manager > associate > preparer" | §2 the mapping's rank order |
| spec/THEO_API_SPEC.md | §2 | "## §2 Contract Surface (1A) → Deployed Endpoints (1B)" | §5 Gap G-APISPEC — the new route's contract row lands here via Role-C post-deploy |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "deployed `function.json` file as the canonical Primary Reference" | §6/row 7 — primary reference = the deployed `theo_list_people` index.js AND function.json (both anchored) |

---

## §1 — Feature + design

**Feature.** `theo_get_my_role` — a read-only handler that returns the caller's `{ oid, job_title, firm_role }`, resolving `firm_role` from the caller's Entra/Graph `jobTitle` (delegated OBO) via the canonical `resolveFirmRole` mapping. This delivers §7.1's firm-role source: a verifiable resolution endpoint + the canonical mapping the engine's read-handlers reuse in-process (§7.3+). Fail-closed (unmapped ⇒ `null` ⇒ least-privileged).

**Design (primary reference = the deployed `theo_list_people`, §6).** `theo_get_my_role` reuses `theo_list_people`'s exact structure + OBO→Graph helpers verbatim (EasyAuth `x-ms-client-principal` → OID; `getOboInputToken` → `exchangeGraphToken` → Graph token; `graphGetJson`), differing only in the Graph call (the CALLER's own profile `/users/{oid}?$select=id,jobTitle` instead of the group roster) and the `resolveFirmRole` mapping + response shape. Self-contained (each Function App handler carries its own helpers). No DB, no Blob, no migration.

**Where it composes.** Per the approved design, the engine (`theo_can_read`) takes `p_firm_role` as an input resolved in the calling handler; `resolveFirmRole` is that resolution's canonical mapping. Until the engine lands (§7.3+), firm role degrades to `null` ⇒ least-privileged, so SPW (project-role gated) is unaffected. `theo_get_my_role` also lets the FE show/gate on the caller's firm role.

## §2 — The `resolveFirmRole` mapping (Never-Guess: grounded on deployed jobTitles)

DEPLOYED ground truth (via `az rest` Graph, this turn — the "Vault Staff" group, 9 members): `Partner`, `Co-Founder and Partner`, `Senior Manager` (×2), `Manager` (×3), `Director`, `Administrative Assistant`; `department` is **null** across all, so `jobTitle` is the sole signal.

Mapping (case-insensitive substring, MOST-SENIOR-FIRST so "Senior Manager" resolves before "Manager" and "Co-Founder and Partner" resolves to partner; fail-closed default `null`):

| jobTitle (contains, lowercased) | → firm_role | Deployed title covered |
| ------------------------------- | ----------- | ---------------------- |
| `partner` | `partner` | Partner, Co-Founder and Partner |
| `director` | `director` | Director (Amendment 7 — its own rank between partner + SM) |
| `senior manager` | `senior_manager` | Senior Manager |
| `manager` | `manager` | Manager |
| `associate` | `associate` | (future) |
| `preparer` | `preparer` | (future) India Preparer / Preparer |
| anything else / empty / null | `null` (least-privileged) | Administrative Assistant, unset |

Self-test this turn (`node -e`) confirmed all deployed + future titles resolve correctly (Partner/Co-Founder and Partner→partner; Director→director; Senior Manager→senior_manager; Manager→manager; Administrative Assistant→null; Associate→associate; India Preparer→preparer; empty/null→null). This exact function is inlined in §6 and reused verbatim by the engine handlers later.

## §3 — Deploy (Pass-3, on APPROVAL) — precondition + mechanism

**PRECONDITION (Walter-run config, like a migration — §1C).** `func-theo-tools` currently has **no** AAD OBO env (confirmed via `az` this turn — the `AAD_*` app settings are absent). Before deploy, Walter adds three app settings to `vaultgpt-func-theo-tools` (the SAME "Vault GPT API" app values already on the OBO-Graph host):
```
az functionapp config appsettings set -n vaultgpt-func-theo-tools -g Vault-Tax -o none --settings \
  AAD_TENANT_ID=<tenant> AAD_CLIENT_ID=4e1a1e31-5c20-4480-99e4-098901707d9e AAD_CLIENT_SECRET=<Vault GPT API secret>
```
(Claude never handles/echoes the secret; `-o none` so `az` doesn't print settings. The app already holds the admin-consented `User.Read.All` delegated scope `theo_list_people` uses, so `/users/{oid}` OBO works once the env is present.)

**DEPLOY (Claude, §1E — dedicated Theo Function App).** Classic-v4 Kudu VFS surgical overwrite to `vaultgpt-func-theo-tools` (per the tools-platform deploy idiom): resolve the SCM host via `az functionapp show … enabledHostNames`; PUT `/site/wwwroot/theo_get_my_role/{index.js,function.json}` (If-Match:*); GET-back byte-diff; `az functionapp restart`; 401-unauth health. No `theo_list_people`/premium change.

**Route not model-callable.** `theo_get_my_role` is infra (engine/FE-facing), NOT a `THEO_TOOL_MANIFEST` model-callable tool — no manifest entry.

## §4 — Golden curls (deterministic verification, Pass-3)

Auth: `az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e` (Bearer; never printed). Host: the resolved `func-theo-tools` SCM/app host.

1. **Authenticated (Walter) → 200 + partner.** `GET /api/theo_get_my_role` with `Authorization: Bearer <token>` ⇒ `200` `{ data: { oid: "<Walter oid>", job_title: "Co-Founder and Partner", firm_role: "partner" }, meta: {...} }`. (Walter's deployed title is Co-Founder and Partner.)
2. **Unauthenticated → 401.** No bearer / no EasyAuth principal ⇒ `401 UNAUTHORIZED` (EasyAuth + the handler's identity guard).
3. **OPTIONS → 204.** CORS preflight ⇒ `204`.
4. **(Env-absent negative, pre-precondition) → 500 INTERNAL_SERVER_ERROR** ("Missing required OBO configuration") — proves the precondition is load-bearing; disappears once Walter adds the AAD env.

## §5 — Gap Register

**PROCEED.** No ESCALATE conditions. The design authority, amended vision doc, and API-Spec contract owner are all CURRENT and grounded; the one contract gap below is a standard PRE-LAND Role-C (deploy → API-Spec documentation), not a missing authority.
- **G-APISPEC — the `theo_get_my_role` route contract row is not yet in `spec/THEO_API_SPEC.md` §2: PRE-LAND (Role-C, post-deploy).** Confirmed this turn (`Grep` → 0 hits). Per the deployed Theo backend pattern (a route is documented in API-Spec §2 AFTER it is deployed + golden-curl-verified, via a Pass-4 Role-C — exactly as `theo_publish_conversation`/`theo_get_conversation` landed), this VEP authors the handler now and adds the §2 contract row (`GET /api/theo_get_my_role` → `{ oid, job_title, firm_role }`, 401/204/500 edges, `func-theo-tools`) via a Role-C handoff **after** the Pass-3 deploy + golden curls pass. This is the disclosed contract gap; it does NOT block Pass-2 (the deploy-then-document ordering is the standard).
- **Director / Administrative Assistant mappings — RESOLVED (Walter-directed).** Director = its own rank `director` (Amendment 7); Administrative Assistant = `null`/least-privileged. Both baked into the mapping + the vision doc.
- **AAD OBO env on func-theo-tools — PRE-LAND (Walter config).** The one Walter-run precondition (§3); the deploy + curls assume it. Not a code gap.
- **Firm-role dimension consumer — PROCEED.** The engine (`theo_can_read`, §7.3) consumes `resolveFirmRole`; until then firm role degrades to `null` ⇒ least-privileged ⇒ SPW unaffected (the design's safe-degradation, Codex-confirmed).
- **jobTitle drift (future titles) — PROCEED.** The mapping covers the current + expected future titles + fail-closes on anything else; a new unmapped rank simply resolves least-privileged until the mapping is extended (a code edit, no migration).

---

## §6 — Handler artifacts (byte-faithful)

### §6.1 — PRIMARY REFERENCE (DEPLOYED) `theo_list_people.index.js` (verbatim, full)

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

### §6.2 — PRIMARY REFERENCE `theo_list_people.function.json` (verbatim)

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

### §6.3 — NEW `theo_get_my_role.index.js` (full)

```js
const https = require("https");

// theo_get_my_role (Vault memory architecture Stage-0 §7.1 — firm-role source). Read-only. Resolves the
// CALLER's firm role from their Entra/Graph `jobTitle` via a delegated Microsoft Graph ON-BEHALF-OF (OBO)
// fetch — the same technique + env (AAD_TENANT_ID / AAD_CLIENT_ID / AAD_CLIENT_SECRET, the "Vault GPT API"
// app with admin-consented User.Read.All) as the deployed theo_list_people roster handler. No DB, no Blob.
// Firm role gates access in the memory model (VAULT_MEMORY_ARCHITECTURE.md §3/§4); mapping is fail-closed
// (unmapped / non-fee-earner jobTitle → null → least-privileged). Rank hierarchy (Amendment 7):
// partner > director > senior_manager > manager > associate > preparer > (null).

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

// ── HTTP + OBO→Graph (verbatim technique from the deployed theo_list_people) ──────────────
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

function getBearerTokenFromAuthorization(req) {
  const raw = req.headers["authorization"];
  if (!raw || typeof raw !== "string") return null;
  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match && match[1] ? match[1].trim() : null;
}

function getOboInputToken(req) {
  const bearer = getBearerTokenFromAuthorization(req);
  if (bearer) {
    return { token: bearer, source: "authorization_bearer" };
  }
  const tokenStore = req.headers["x-ms-token-aad-access-token"];
  if (typeof tokenStore === "string" && tokenStore.trim() !== "") {
    return { token: tokenStore.trim(), source: "x-ms-token-aad-access-token" };
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

// ── Firm-role mapping (VAULT_MEMORY_ARCHITECTURE.md §1/§3, Amendment 7; grounded on the deployed Vault
// Staff titles: Partner / Co-Founder and Partner, Director, Senior Manager, Manager, Administrative
// Assistant). Case-insensitive substring match, MOST-SENIOR-FIRST so "Senior Manager" resolves before
// "Manager" and "Co-Founder and Partner" resolves to partner. Fail-closed: any unmapped / non-fee-earner
// title → null → least-privileged. CANONICAL: the engine's read-handlers reuse this exact mapping in-process.
function resolveFirmRole(jobTitle) {
  if (typeof jobTitle !== "string") return null;
  const t = jobTitle.trim().toLowerCase();
  if (!t) return null;
  if (t.includes("partner")) return "partner";
  if (t.includes("director")) return "director";
  if (t.includes("senior manager")) return "senior_manager";
  if (t.includes("manager")) return "manager";
  if (t.includes("associate")) return "associate";
  if (t.includes("preparer")) return "preparer";
  return null;
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
    // The CALLER's own profile — jobTitle is the firm-role signal (department is null across Vault Staff).
    const me = await graphGetJson(`${GRAPH}/users/${encodeURIComponent(callerOid)}?$select=id,jobTitle`, graphToken);
    const jobTitle = me && typeof me.jobTitle === "string" ? me.jobTitle : null;
    const firmRole = resolveFirmRole(jobTitle);
    return send(context, 200, successBody({ oid: callerOid, job_title: jobTitle, firm_role: firmRole }));
  } catch (err) {
    context.log.error("theo_get_my_role failed", err);
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  }
};
```

### §6.4 — NEW `theo_get_my_role.function.json`

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_get_my_role"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## Codex activation note (Walter forwards)

```
Codex is activated for Pass-2 review of the Vault Firm-Role Source Stage-0 §7.1 VEP (vault-theo,
"Codex Governance/Vault-Firm-Role-Source-Stage0-7-1-Pass-1-VEP/Vault_Firm_Role_Source_Stage0_7_1_VEP.md").
Open your Pass-2 turn with a governance-bound GCR + Rule Anchor Table (Theo Grounding Conformance §3/§5).
Backend implementation package, CODE-ONLY (no migration/SQL). Review: (1) the new theo_get_my_role handler
(§6.3) vs the DEPLOYED theo_list_people primary reference (§6.1) — is the OBO->Graph technique reused
faithfully (getPrincipal/getClaimValue/getOboInputToken/exchangeGraphToken/graphGetJson identical),
caller-OID-from-EasyAuth, no DB/Blob, self-contained helpers, SQLSTATE/error mapping preserved? (2) the
Graph call change (the caller's own /users/{oid}?$select=id,jobTitle vs the group roster) — correct + minimal?
(3) resolveFirmRole (§2/§6.3) — grounded on the DEPLOYED Vault Staff jobTitles, most-senior-first ordering
(Senior Manager before Manager; partner catches Co-Founder and Partner), Amendment-7 rank (director its own
rank), fail-closed null for Administrative Assistant/unmapped? (4) the §3 deploy: the Walter-run AAD-OBO-env
precondition on func-theo-tools (grounded on the live az fact it's absent), classic-v4 Kudu VFS deploy to the
dedicated func-theo-tools app (§1E), not model-callable (no manifest); (5) the §4 golden curls
(auth->200+partner, unauth->401, options->204, env-absent->500) deterministic? (6) safe degradation (firm
role null => least-privileged => SPW unaffected). Emit APPROVED or REJECTED only.
```
