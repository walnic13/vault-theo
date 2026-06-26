const https = require("https");
const { DefaultAzureCredential } = require("@azure/identity");

// Model gateway config (Function App settings; see §DEPLOY).
const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;             // e.g. https://vaultgpt-foundry.services.ai.azure.com
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT; // e.g. claude-sonnet-4-6
const FOUNDRY_SCOPE = "https://ai.azure.com/.default";
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
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body,
  };
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
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = https.request({
      method: options.method || "GET",
      hostname: url.hostname,
      port: url.port ? Number(url.port) : 443,
      path: url.pathname + url.search,
      headers: options.headers || {},
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }));
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// Single shared credential instance; uses the Function App's managed identity at runtime.
const credential = new DefaultAzureCredential();

async function getFoundryToken() {
  const t = await credential.getToken(FOUNDRY_SCOPE);
  if (!t || !t.token) {
    throw buildKnownError("INTERNAL_SERVER_ERROR", "Failed to acquire model gateway token.", 500);
  }
  return t.token;
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

  if (!FOUNDRY_BASE || !FOUNDRY_DEPLOYMENT) {
    context.log.error("theo_message: missing gateway configuration");
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Model gateway is not configured.", 500));
  }

  let parsedBody;
  try {
    parsedBody = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  const messages = parsedBody.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return send(context, 400, errorBody("BAD_REQUEST", "Field 'messages' must be a non-empty array.", 400));
  }
  const maxTokens = Number.isInteger(parsedBody.max_tokens) ? parsedBody.max_tokens : DEFAULT_MAX_TOKENS;
  const systemPrompt = typeof parsedBody.system === "string" ? parsedBody.system : null;

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
          "Authorization": `Bearer ${token}`,
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
        return send(context, 429, errorBody("RATE_LIMITED", "Model gateway rate limit exceeded.", 429));
      }
      return send(context, 502, errorBody("BAD_GATEWAY", "Model gateway call failed.", 502));
    }

    const textContent = Array.isArray(parsed.content)
      ? parsed.content.filter((b) => b && b.type === "text")
      : [];

    return send(context, 200, successBody({
      role: typeof parsed.role === "string" ? parsed.role : "assistant",
      model: typeof parsed.model === "string" ? parsed.model : FOUNDRY_DEPLOYMENT,
      content: textContent,
      stop_reason: parsed.stop_reason != null ? parsed.stop_reason : null,
      usage: parsed.usage != null ? parsed.usage : null,
    }));
  } catch (err) {
    context.log.error("theo_message failed", err);
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Failed to process message.", 500));
  }
};
