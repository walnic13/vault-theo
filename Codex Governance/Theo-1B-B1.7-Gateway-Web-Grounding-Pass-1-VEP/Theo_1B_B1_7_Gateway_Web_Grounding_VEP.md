# Theo 1B — B1.7 Gateway Internet Grounding (`web_search` + `web_fetch`) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; the complete replacement handler is provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** enable Anthropic's server-side `web_search` + `web_fetch` tools on the deployed `theo_message` model gateway so Theo answers are grounded in live web data with citations. **Feasibility proven this turn (golden curls against the deployed Foundry endpoint):** `web_search` → HTTP 200, `server_tool_use`+`web_search_tool_result`+`text` blocks, `web_search_requests:1`, 1 citation, current real answer; `web_fetch` (with `anthropic-beta: web-fetch-2025-09-10`) → HTTP 200, `web_fetch_tool_result`, `web_fetch_requests:1`, correct fetched content. The delta is confined to the upstream Foundry call; all auth/identity/envelope behavior is byte-identical to the deployed B1 handler.

---

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `69af037913c91cb304b660e57b144e99b2c0d789` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked below. Full Baseline per Conformance §4 (Verified Evidence Pack / backend plan). The only deployed-state change is the upstream Foundry payload + one request header; no schema, no `reporting_*`, no `function.json` change.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); independently verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 VEP Format + Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `Grep("MUST open with a Grounding Conformance Receipt"); sed §4A.1` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` | listed (Pass-2 reviewer authority) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 model gateway; §4 allowed delta; HF-T1 scope) | `Grep("HF-T1" / "brokers the standard Anthropic Messages API shape" / "new-domain or new-external-system helper")` this turn | `2ee83c036e21a5dabe3405b6532c3471c680da0b` |
| 5 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§2 model gateway seam; §2.3 live web access) | `Grep("live web access" / "server-side gateway")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (HF-T1 gateway; §7 tiers) | `Grep` this turn | `1733bdf19053d7173b72bfa9f0cf64e725cfdd3f` |
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 chat / model gateway) | `Grep("response \`content[]\` filtered to")` this turn | `4a1d2433c111ad7861e69f6d36acf72b8ef3e1d5` |
| 8 | **Primary Reference handler** (deployed, EXACT base) — `api/theo_message/index.js` | `Read(full, 1–313)` this turn | `09d1e2a7e532b978aa550c94a8d44aa12c35a26b` |
| 9 | Deployed function.json (unchanged) — `api/theo_message/function.json` | `Read(full)` this turn | `bd476fc8d144ed9592b561b4c0ded84f5911cff0` |
| 10 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§1 `theo_` conventions; §2 RLS baseline — no `theo_` object in B1.7 scope) | `Grep("theo_ prefix" / "created_by")` this turn | `32edb90e396c0cf1efd3c4659d7818ae01dccad3` |
| 11 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A role vocabulary; §1B Decision Register DR-T2) | `Grep("DR-T2" / "Decision Register")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |

No ChatGPT advisory cited (Conformance §4D / T18). No `corporate-reporting`/`reporting_*` change. GCR carries the full Conformance §4 backend-plan Full-Baseline document set (Governor, API Spec, Azure Postgres Schema, Golden Handler, Execution Orchestration, Conformance, Codex Review, 1B Plan, Architecture + primary-reference artifacts).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "**Gap Register** (proactive disclosure of foreseeable downstream gaps with a `PROCEED` / `PRE-LAND` / `ESCALATE` pivot, or a verbatim `NO-GAPS` certification)" | §P2.5 / GR Gap Register |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §2.3 | "Theo can browse live without a separate search integration." | §P1 / §P2 — the grounding capability this VEP enables |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | HF-T1 | "web_search/web_fetch/code-exec built-ins" | §P1 / §P5 — the tools are within HF-T1's registered scope |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "brokers the standard Anthropic Messages API shape" | §SM — `tools` is part of the standard Messages request shape (the ALLOWED DELTA region) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "a Walter authorization quoted verbatim and predating the VEP" | §WA — authorizes the grounding-tools delta |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §HG.1 / §P5 — Primary Reference = the deployed `theo_message` handler |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §2 | "server-side gateway" | §P2 — the gateway holds the credential and brokers every model call (unchanged) |
| spec/THEO_API_SPEC.md | §2.1 | "response `content[]` filtered to" | §P4 — endpoint + response contract unchanged; tools run server-side |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T2 | "A **server-side model gateway** is the only holder of model credentials (Entra managed identity, keyless); standard Anthropic Messages API shape; the model swap point." | §P1 / §P2.5 — the model-gateway Decision Register entry this microstep extends (auth method unchanged from B1) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "All Theo tables use the **`theo_` prefix**, plural snake_case nouns." | §P3 / §P6 — schema authority; B1.7 references no `theo_` object (stateless), confirmed against the conventions |

---

## P1 — Feature identification
**Role / Decision Register (Orchestration §1A/§1B; Rule Anchor 10):** Claude Code authors this Pass-1 VEP; Codex reviews (Pass 2); Walter deploys (Pass 3). The microstep extends the model-gateway Decision Register entry **DR-T2** (server-side gateway, standard Anthropic Messages API shape, model swap point) by enabling its in-scope server-side tools. **Microstep:** internet grounding for the deployed `theo_message` model gateway (HF-T1). HF-T1's registered scope already names `web_search/web_fetch/code-exec built-ins` (Rule Anchor 4) and architecture §2.3 confirms "Theo can browse live without a separate search integration" (Rule Anchor 3). B1.7 realizes that capability by attaching Anthropic's server-side `web_search` + `web_fetch` tools to the upstream Foundry Messages call. Claude invokes them autonomously only when a query needs live data (the feasibility curls show it does not search for a trivial prompt), and `max_uses` caps spend. Citations returned by `web_search` already travel on the `type:"text"` blocks the handler returns — so grounded answers + citation data reach the client with no response-shape change.

## P2 — Architecture & boundary reconciliation
- **Model gateway seam (architecture §2 / §2.3; Rule Anchors 3, 8).** The gateway remains the sole server-side credential holder and the model swap point; B1.7 changes only what the gateway sends upstream (adds `tools` + the web-fetch beta header). No browser→model call; the browser still sends only `{max_tokens, system, messages}` and a user identity token.
- **Auth method unchanged.** B1.7 does not touch the client-credentials token exchange or EasyAuth identity gate reconciled in B1 (§GR G-5); those regions are byte-identical (§SM).
- **Boundary.** No `reporting_*`/`corporate-reporting` access; no `theo_` schema/RLS interaction (B1.7 is stateless, like B1); no `function.json` change (tools are request-body + header only). Repository boundary (architecture §1) intact.

## P2.5 / GR — Gap Register
Grounded against the Governor §8 Gap Register vocabulary (closed: `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`) and the Orchestration §1B Decision Register (Rule Anchor 10); no Decision Register conflict — B1.7 extends DR-T2's in-scope server-side tools.
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy prerequisite (Walter, at deploy).** New optional app settings `THEO_WEB_SEARCH_MAX_USES` / `THEO_WEB_FETCH_MAX_USES` (default 5 each if unset) and optional `THEO_WEB_FETCH_ALLOWED_DOMAINS` (comma-separated; unset ⇒ no allowlist). No new secret. | **PROCEED** — handler defaults are safe when the settings are absent; enumerated in §DEPLOY; Claude Code's golden curl (§CURL) confirms post-deploy. |
| G-2 | **`web_fetch` safety surface.** `web_fetch` pulls full pages into model context (prompt-injection / untrusted-content surface). | **PROCEED** — bounded by `max_uses` and the optional `THEO_WEB_FETCH_ALLOWED_DOMAINS` allowlist; the gateway holds no tool other than these two server-side Anthropic tools; no local network egress (the fetch executes Anthropic-side, not from the Function app). |
| G-3 | **Citations rendering.** The grounded answer's citations travel on the returned `text` blocks, but the 1A chat surface does not yet render them. | **PROCEED** — out of scope for this backend VEP; a paired **frontend** VEP will widen `GatewayResponse` and render citation chips (Walter-directed). B1.7 makes the data available; no backend gap. |
| G-4 | **ZDR / data residency.** Web tools send query/fetch content to Anthropic-hosted infra (US). | **PRE-LAND** — same posture as B1 G-3: non-PII test traffic until Walter confirms ZDR; gates client-PII go-live, not this connection capability. |

## P3 — Schema grounding
N/A — B1.7 is stateless (no `theo_` table, column, policy, or function referenced). Confirmed against the **Theo Azure Postgres Schema §1 conventions** ("All Theo tables use the **`theo_` prefix**…", `created_by` ownership) and **§2 RLS baseline** (Rule Anchor 11): the microstep touches no `theo_` object, so no DEPLOYED/PROPOSED schema delta applies. Persistence remains a later tier (B3). Substantive conclusion after grounding the Schema authority, not a skipped sub-phase.

## P4 — Contract grounding
- **Endpoint:** `POST /api/theo_message` (API Spec §2.1; HF-T1 DEPLOYED). **Unchanged** — no route, method, request, or response-shape change. The client request stays `{max_tokens, system, messages}`; the response stays the `{data:{role,model,content,stop_reason,usage}, meta}` envelope with `content` = the `response \`content[]\` filtered to` `type:"text"` blocks (Rule Anchor 9). `web_search` citations ride on those text blocks (additive, backward-compatible).
- Route-naming convention `theo_<operation>_<entity>` unaffected.

## P5 — Handler grounding
Primary Reference (Golden §2; Rule Anchor 7) = the **deployed `theo_message` handler** (`api/theo_message/index.js`, blob `09d1e2a7…`), itself the B1 Codex-approved Family-B handler (shared envelope/identity helpers byte-identical to `reporting_probe_dms_connection`). Inlined full verbatim at §HG.1 (Conformance T9). The B1.7 replacement handler (§HG.3) is an EXACT structural mirror of it except the single upstream-call region (ALLOWED DELTA — §SM). `function.json` is unchanged (§HG.4).

## SM — Structural Mirror Table
Mapping every region of the B1.7 handler (§HG.3) to the Primary Reference (§HG.1, deployed `theo_message`).

| Region | Classification | Basis |
| --- | --- | --- |
| `require("https")`; `FOUNDRY_BASE`/`FOUNDRY_DEPLOYMENT`/`ANTHROPIC_VERSION`/`DEFAULT_MAX_TOKENS` consts | EXACT | byte-identical |
| `corsHeaders` | EXACT | byte-identical |
| `send`/`nowIso`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`buildKnownError`/`parseJsonSafe`/`requestUrl` helpers | EXACT | byte-identical (the 10 shared Family-B helpers) |
| `getFoundryToken` (client-credentials token exchange) | EXACT | byte-identical |
| OPTIONS handling; EasyAuth `oid` 401 gate; config check; body parse; `messages` validation; `maxTokens`/`systemPrompt` | EXACT | byte-identical |
| **Grounding constants** (`WEB_FETCH_BETA`, `parsePositiveInt`, `WEB_SEARCH_MAX_USES`, `WEB_FETCH_MAX_USES`, `WEB_FETCH_ALLOWED_DOMAINS`) + **`buildGroundingTools()`** helper | **ALLOWED DELTA** | new code; the tools are HF-T1-scope built-ins (Rule Anchor 4) + Walter-authorized (§WA, Rule Anchor 6); part of the standard Messages request shape (Golden §3, Rule Anchor 5) |
| **Upstream payload** — adds `tools: buildGroundingTools()` | **ALLOWED DELTA** | the contract's request shape (Golden §3); feasibility-proven 200 |
| **Upstream headers** — adds `"anthropic-beta": WEB_FETCH_BETA` | **ALLOWED DELTA** | required for `web_fetch`; feasibility-proven 200 |
| Upstream non-2xx / 429 handling; `textContent` filter; `successBody` response; `catch` error mapping | EXACT | byte-identical |
| `function.json` | EXACT | byte-identical (§HG.4) |

No DEVIATION regions.

## WA — Walter authorization (Conformance §10 T12 / Golden §4) — quoted verbatim, predating this VEP
> "i'd like to add web fetch and citations to our internet grounding"

(Preceded by Walter's "ok" authorizing the B1.7 authoring, and consistent with HF-T1's registered `web_search/web_fetch` scope and architecture §2.3.) This authorizes the grounding-tools ALLOWED DELTA per Golden §4 (Rule Anchor 6).

## HG — Handler grounding (verbatim artifacts)

### HG.1 — Primary Reference handler (verbatim) — deployed `api/theo_message/index.js` (blob `09d1e2a7…`)
```js
const https = require("https");

const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT;
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MAX_TOKENS = 4096;

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
    if (match && typeof match.val === "string" && match.val.trim() !== "") {
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

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

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

async function getFoundryToken() {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw buildKnownError(
      "INTERNAL_SERVER_ERROR",
      "Missing required model gateway configuration.",
      500
    );
  }

  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://ai.azure.com/.default",
  }).toString();

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const r = await requestUrl(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(form),
    },
  }, form);

  const payload = parseJsonSafe(r.body);

  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    const description =
      payload &&
      (payload.error_description || payload.error || payload.error_codes?.join(", "));
    const message = description
      ? `Model gateway token request failed: ${description}`
      : "Model gateway token request failed.";

    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }

  return payload.access_token;
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
    return send(
      context,
      401,
      errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401)
    );
  }

  if (!FOUNDRY_BASE || !FOUNDRY_DEPLOYMENT) {
    context.log.error("theo_message: missing gateway configuration");
    return send(
      context,
      500,
      errorBody("INTERNAL_SERVER_ERROR", "Model gateway is not configured.", 500)
    );
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)
    );
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Field 'messages' must be a non-empty array.", 400)
    );
  }

  const maxTokens = Number.isInteger(body.max_tokens) ? body.max_tokens : DEFAULT_MAX_TOKENS;
  const systemPrompt = typeof body.system === "string" ? body.system : null;

  try {
    const token = await getFoundryToken();

    const upstreamPayload = JSON.stringify({
      model: FOUNDRY_DEPLOYMENT,
      max_tokens: maxTokens,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages,
      stream: false,
    });

    const upstream = await requestUrl(
      `${FOUNDRY_BASE}/anthropic/v1/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "anthropic-version": ANTHROPIC_VERSION,
          "Content-Length": Buffer.byteLength(upstreamPayload),
        },
      },
      upstreamPayload
    );

    const parsed = parseJsonSafe(upstream.body);

    if (upstream.statusCode < 200 || upstream.statusCode >= 300 || !parsed) {
      context.log.error("theo_message: gateway non-2xx", upstream.statusCode);
      if (upstream.statusCode === 429) {
        return send(
          context,
          429,
          errorBody("RATE_LIMITED", "Model gateway rate limit exceeded.", 429)
        );
      }
      return send(
        context,
        502,
        errorBody("BAD_GATEWAY", "Model gateway call failed.", 502)
      );
    }

    const textContent = Array.isArray(parsed.content)
      ? parsed.content.filter((b) => b && b.type === "text")
      : [];

    return send(
      context,
      200,
      successBody({
        role: typeof parsed.role === "string" ? parsed.role : "assistant",
        model: typeof parsed.model === "string" ? parsed.model : FOUNDRY_DEPLOYMENT,
        content: textContent,
        stop_reason: parsed.stop_reason != null ? parsed.stop_reason : null,
        usage: parsed.usage != null ? parsed.usage : null,
      })
    );
  } catch (err) {
    context.log.error("theo_message failed", err);

    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(
        context,
        err.status,
        errorBody(err.code, err.message, err.status)
      );
    }

    return send(
      context,
      500,
      errorBody("INTERNAL_SERVER_ERROR", "Failed to process message.", 500)
    );
  }
};
```

### HG.3 — B1.7 handler to deploy (COMPLETE, copy-paste ready) — `api/theo_message/index.js`
Delta vs §HG.1: grounding constants + `buildGroundingTools()` (new), `tools:` in the upstream payload, and the `anthropic-beta` header. Everything else byte-identical.
```js
const https = require("https");

const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT;
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MAX_TOKENS = 4096;

// Internet grounding — server-side Foundry-Claude tools (architecture §2.3; HF-T1 scope).
const WEB_FETCH_BETA = "web-fetch-2025-09-10";

function parsePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

const WEB_SEARCH_MAX_USES = parsePositiveInt(process.env.THEO_WEB_SEARCH_MAX_USES, 5);
const WEB_FETCH_MAX_USES = parsePositiveInt(process.env.THEO_WEB_FETCH_MAX_USES, 5);
const WEB_FETCH_ALLOWED_DOMAINS = (process.env.THEO_WEB_FETCH_ALLOWED_DOMAINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

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
    if (match && typeof match.val === "string" && match.val.trim() !== "") {
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

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

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

async function getFoundryToken() {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw buildKnownError(
      "INTERNAL_SERVER_ERROR",
      "Missing required model gateway configuration.",
      500
    );
  }

  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://ai.azure.com/.default",
  }).toString();

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const r = await requestUrl(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(form),
    },
  }, form);

  const payload = parseJsonSafe(r.body);

  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    const description =
      payload &&
      (payload.error_description || payload.error || payload.error_codes?.join(", "));
    const message = description
      ? `Model gateway token request failed: ${description}`
      : "Model gateway token request failed.";

    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }

  return payload.access_token;
}

// Server-side grounding tools attached to every upstream Messages call. Claude invokes them
// autonomously only when a query needs live web data; max_uses caps spend. web_fetch carries an
// optional domain allowlist (THEO_WEB_FETCH_ALLOWED_DOMAINS) and requires the web-fetch beta header.
function buildGroundingTools() {
  const webFetch = {
    type: "web_fetch_20250910",
    name: "web_fetch",
    max_uses: WEB_FETCH_MAX_USES,
  };
  if (WEB_FETCH_ALLOWED_DOMAINS.length > 0) {
    webFetch.allowed_domains = WEB_FETCH_ALLOWED_DOMAINS;
  }
  return [
    { type: "web_search_20250305", name: "web_search", max_uses: WEB_SEARCH_MAX_USES },
    webFetch,
  ];
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
    return send(
      context,
      401,
      errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401)
    );
  }

  if (!FOUNDRY_BASE || !FOUNDRY_DEPLOYMENT) {
    context.log.error("theo_message: missing gateway configuration");
    return send(
      context,
      500,
      errorBody("INTERNAL_SERVER_ERROR", "Model gateway is not configured.", 500)
    );
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)
    );
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Field 'messages' must be a non-empty array.", 400)
    );
  }

  const maxTokens = Number.isInteger(body.max_tokens) ? body.max_tokens : DEFAULT_MAX_TOKENS;
  const systemPrompt = typeof body.system === "string" ? body.system : null;

  try {
    const token = await getFoundryToken();

    const upstreamPayload = JSON.stringify({
      model: FOUNDRY_DEPLOYMENT,
      max_tokens: maxTokens,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages,
      tools: buildGroundingTools(),
      stream: false,
    });

    const upstream = await requestUrl(
      `${FOUNDRY_BASE}/anthropic/v1/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "anthropic-version": ANTHROPIC_VERSION,
          "anthropic-beta": WEB_FETCH_BETA,
          "Content-Length": Buffer.byteLength(upstreamPayload),
        },
      },
      upstreamPayload
    );

    const parsed = parseJsonSafe(upstream.body);

    if (upstream.statusCode < 200 || upstream.statusCode >= 300 || !parsed) {
      context.log.error("theo_message: gateway non-2xx", upstream.statusCode);
      if (upstream.statusCode === 429) {
        return send(
          context,
          429,
          errorBody("RATE_LIMITED", "Model gateway rate limit exceeded.", 429)
        );
      }
      return send(
        context,
        502,
        errorBody("BAD_GATEWAY", "Model gateway call failed.", 502)
      );
    }

    const textContent = Array.isArray(parsed.content)
      ? parsed.content.filter((b) => b && b.type === "text")
      : [];

    return send(
      context,
      200,
      successBody({
        role: typeof parsed.role === "string" ? parsed.role : "assistant",
        model: typeof parsed.model === "string" ? parsed.model : FOUNDRY_DEPLOYMENT,
        content: textContent,
        stop_reason: parsed.stop_reason != null ? parsed.stop_reason : null,
        usage: parsed.usage != null ? parsed.usage : null,
      })
    );
  } catch (err) {
    context.log.error("theo_message failed", err);

    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(
        context,
        err.status,
        errorBody(err.code, err.message, err.status)
      );
    }

    return send(
      context,
      500,
      errorBody("INTERNAL_SERVER_ERROR", "Failed to process message.", 500)
    );
  }
};
```

### HG.4 — function.json (UNCHANGED) — `api/theo_message/function.json`
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_message"
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
N/A — no SQL. B1.7 is stateless (no schema interaction); the Theo Azure Postgres Schema migration-file rules (§1/§2, Rule Anchor 11) yield no migration for this microstep. Substantive conclusion after grounding the Schema authority; not a skipped sub-phase.

## P7 / CURL — Golden curls (Claude Code runs post-deploy)
Claude Code acquires the token (`az account get-access-token`) and runs these against the deployed handler; never prints token bytes; captures results under `.local/` (gitignored). Feasibility was already proven this turn directly against Foundry (HTTP 200 for both tools). Post-deploy, the handler-level curls confirm end-to-end through EasyAuth:

1. **web_search** — `POST {func}/api/theo_message` (user Bearer for `api://<app-id>/access_as_user`), body `{"max_tokens":256,"messages":[{"role":"user","content":"Use web search: one headline from this week and the date. One sentence."}]}` → expect HTTP 200, `data.content[0].text` grounded + a `citations` entry.
2. **web_fetch** — same endpoint, body `{"max_tokens":256,"messages":[{"role":"user","content":"Fetch https://example.com and give its main heading."}]}` → expect HTTP 200, `data.content[].text` reflecting fetched content.
3. **no-tool regression** — `{"messages":[{"role":"user","content":"Reply with exactly: ok"}]}` → HTTP 200, `text:"ok"`, no search/fetch performed (cost-neutral when grounding isn't needed).

## DEPLOY — Walter deploy steps (no SQL; no dependency; copy-paste handler)
1. Replace `api/theo_message/index.js` with §HG.3 in full (Azure Portal or deploy pipeline). `function.json` unchanged (§HG.4).
2. (Optional) set Function App settings: `THEO_WEB_SEARCH_MAX_USES` (default 5), `THEO_WEB_FETCH_MAX_USES` (default 5), `THEO_WEB_FETCH_ALLOWED_DOMAINS` (comma-separated; unset ⇒ no allowlist). None required for the handler to run.
3. No new secret, no dependency (`require("https")` only), no `package.json` change.
4. Notify Claude Code to run the §CURL golden curls.

## P8 — VEP assembly + mechanical lint
GCR (§3) + Rule Anchor Table (§5) open the pack; P1–P8 walked; Gap Register present (G-1…G-4); §SM classifies every region (no DEVIATION); §WA quotes the Walter authorization verbatim; §HG.1/§HG.3/§HG.4 inline the artifacts verbatim. On Codex APPROVAL, Walter deploys §HG.3 and Claude Code runs the §CURL curls.

```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B1.7-Gateway-Web-Grounding-Pass-1-VEP/Theo_1B_B1_7_Gateway_Web_Grounding_VEP.md" --repo-root .
PASS  Codex Governance/Theo-1B-B1.7-Gateway-Web-Grounding-Pass-1-VEP/Theo_1B_B1_7_Gateway_Web_Grounding_VEP.md
exit code: 0
```
(Codex re-runs the same command per its hard gates.)

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B1.7 Gateway Internet Grounding Pass-1 Backend VEP (plan only).*
