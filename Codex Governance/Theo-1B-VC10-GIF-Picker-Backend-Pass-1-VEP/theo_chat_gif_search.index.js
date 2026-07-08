// VC-10 — GIF picker search (Path A: hardened server-side GIPHY proxy). The GIPHY API key lives ONLY in
// the GIPHY_API_KEY app setting (never sent to the client); the browser never talks to GIPHY directly for
// search. Returns a SANITIZED subset (id/title/url/preview/dimensions); rating pinned workplace-safe.
const GIPHY_API_BASE = "https://api.giphy.com/v1/gifs";
const GIPHY_RATING = process.env.GIPHY_RATING || "pg-13"; // workplace-safe default
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;
const CACHE_TTL_MS = 120 * 1000; // short-TTL per-instance cache to spare the 100/hr beta quota

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}

// GIPHY returns image width/height as STRINGS ("268"); coerce to a positive int or null.
function toInt(v) { const n = parseInt(String(v == null ? "" : v), 10); return Number.isFinite(n) && n > 0 ? n : null; }

// Sanitize one GIPHY search hit → only the fields the client needs (no passthrough of GIPHY's full payload).
function sanitizeGif(g) {
  if (!g || typeof g.id !== "string" || !g.images) return null;
  const disp = g.images.fixed_height || g.images.downsized || g.images.original || {};
  const prev = g.images.fixed_height_small || g.images.preview_gif || disp || {};
  if (!disp.url) return null;
  return {
    provider: "giphy",
    id: g.id,
    title: typeof g.title === "string" ? g.title.slice(0, 200) : "",
    url: disp.url,
    preview_url: prev.url || disp.url,
    width: toInt(disp.width),
    height: toInt(disp.height),
  };
}

const _cache = new Map(); // key -> { at, gifs }
function cacheGet(key) {
  const e = _cache.get(key);
  if (!e) return null;
  if (Date.now() - e.at > CACHE_TTL_MS) { _cache.delete(key); return null; }
  return e.gifs;
}
function cacheSet(key, gifs) {
  if (_cache.size > 200) _cache.clear(); // bounded, best-effort
  _cache.set(key, { at: Date.now(), gifs });
}

function requestJson(urlStr) {
  return new Promise((resolve, reject) => {
    const https = require("https");
    const url = new URL(urlStr);
    const rq = https.request(
      { method: "GET", hostname: url.hostname, path: url.pathname + url.search, headers: { Accept: "application/json" } },
      (res) => {
        let data = "";
        res.on("data", (c) => { data += c; });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, body: data }); });
      }
    );
    rq.on("error", reject);
    rq.end();
  });
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
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'query' is required and must be a non-empty string.", 400));
  }
  if (query.length > 100) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'query' must be 100 characters or fewer.", 400));
  }
  // Strict integer limit (parseInt('1.5')→1 would silently pass) per the parseInt-drift discipline.
  let limit = DEFAULT_LIMIT;
  if (body.limit != null && String(body.limit).trim() !== "") {
    const raw = String(body.limit).trim();
    if (!/^[0-9]+$/.test(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'limit' must be a positive integer.", 400));
    }
    limit = parseInt(raw, 10);
    if (limit < 1) limit = 1;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
  }

  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    context.log.error("theo_chat_gif_search: GIPHY_API_KEY not configured");
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "GIF search is not configured.", 500));
  }

  const cacheKey = `${GIPHY_RATING}|${limit}|${query.toLowerCase()}`;
  const cached = cacheGet(cacheKey);
  if (cached) {
    return send(context, 200, successBody({ query, gifs: cached, cached: true }));
  }

  try {
    const url =
      `${GIPHY_API_BASE}/search?api_key=${encodeURIComponent(apiKey)}` +
      `&q=${encodeURIComponent(query)}&limit=${limit}&rating=${encodeURIComponent(GIPHY_RATING)}` +
      `&lang=en&bundle=messaging_non_clips`;
    const r = await requestJson(url);
    if (r.statusCode === 429) {
      return send(context, 429, errorBody("RATE_LIMITED", "GIF search is busy; please try again in a moment.", 429));
    }
    if (r.statusCode < 200 || r.statusCode >= 300) {
      context.log.error("theo_chat_gif_search: GIPHY upstream error", r.statusCode);
      return send(context, 502, errorBody("UPSTREAM_ERROR", "GIF search is temporarily unavailable.", 502));
    }
    let payload;
    try { payload = JSON.parse(r.body || "{}"); } catch { return send(context, 502, errorBody("UPSTREAM_ERROR", "GIF search returned an unexpected response.", 502)); }
    const gifs = Array.isArray(payload.data) ? payload.data.map(sanitizeGif).filter(Boolean) : [];
    cacheSet(cacheKey, gifs);
    return send(context, 200, successBody({ query, gifs, cached: false }));
  } catch (err) {
    context.log.error("theo_chat_gif_search failed", err);
    return send(context, 502, errorBody("UPSTREAM_ERROR", "GIF search is temporarily unavailable.", 502));
  }
};
