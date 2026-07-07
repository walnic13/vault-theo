const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const MAX_BODY = 8000;
const GIPHY_API_BASE = "https://api.giphy.com/v1/gifs";

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
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
// GIPHY ids are short alphanumerics; validate strictly before it ever reaches a URL path (no injection).
function isGiphyId(value) { return typeof value === "string" && /^[A-Za-z0-9]{1,64}$/.test(value); }
// GIPHY returns width/height as STRINGS; coerce to a positive int or null.
function toInt(v) { const n = parseInt(String(v == null ? "" : v), 10); return Number.isFinite(n) && n > 0 ? n : null; }

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

// Resolve a GIPHY gif by id server-side → canonical URLs. The client sends ONLY the id; the URLs stored are
// the ones GIPHY returns (never a client-supplied URL — no SSRF/stored-XSS vector).
async function resolveGiphyGif(gifId) {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) throw buildKnownError("INTERNAL_SERVER_ERROR", "GIF sending is not configured.", 500);
  const url = `${GIPHY_API_BASE}/${encodeURIComponent(gifId)}?api_key=${encodeURIComponent(apiKey)}`;
  const r = await requestJson(url);
  if (r.statusCode === 404) throw buildKnownError("INVALID_REQUEST", "GIF not found.", 400);
  if (r.statusCode === 429) throw buildKnownError("RATE_LIMITED", "GIF service is busy; please try again in a moment.", 429);
  if (r.statusCode < 200 || r.statusCode >= 300) throw buildKnownError("UPSTREAM_ERROR", "GIF service is temporarily unavailable.", 502);
  let payload;
  try { payload = JSON.parse(r.body || "{}"); } catch { throw buildKnownError("UPSTREAM_ERROR", "GIF service returned an unexpected response.", 502); }
  const g = payload.data;
  if (!g || typeof g.id !== "string" || !g.images) throw buildKnownError("INVALID_REQUEST", "GIF not found.", 400);
  const disp = g.images.fixed_height || g.images.downsized || g.images.original || {};
  const prev = g.images.fixed_height_small || g.images.preview_gif || disp || {};
  if (!disp.url) throw buildKnownError("INVALID_REQUEST", "GIF has no usable rendition.", 400);
  return {
    provider: "giphy",
    id: g.id,
    url: disp.url,
    preview_url: prev.url || disp.url,
    width: toInt(disp.width),
    height: toInt(disp.height),
    title: typeof g.title === "string" ? g.title.slice(0, 200) : "",
  };
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

  const threadId = typeof body.thread_id === "string" ? body.thread_id.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'thread_id' is required and must be a valid UUID.", 400));
  }
  const gifId = typeof body.gif_id === "string" ? body.gif_id.trim() : "";
  if (!isGiphyId(gifId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'gif_id' is required and must be a valid GIPHY id.", 400));
  }
  // Optional caption. Absent → a GIF-only message (body NULL, allowed by the VC-10 body CHECK).
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (text.length > MAX_BODY) {
    return send(context, 400, errorBody("PAYLOAD_TOO_LARGE", `Message exceeds ${MAX_BODY} characters.`, 400));
  }
  const bodyParam = text.length ? text : null;

  let client = null;
  let saved = null;
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

    // Membership + archived gate (mirrors theo_chat_send_message / VC-19): not a participant → 404;
    // archived channel is closed to NEW messages → 409. A DM never has archived_at set.
    const acc = await client.query(
      `SELECT archived_at FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    if (acc.rows[0].archived_at != null) {
      throw buildKnownError("CONVERSATION_ARCHIVED", "This conversation is archived; you can no longer post to it.", 409);
    }

    // Resolve the GIF by id against GIPHY (server-side; the client never supplies a URL). Runs after auth +
    // membership so an unauthenticated/non-member caller never triggers an upstream call.
    const gif = await resolveGiphyGif(gifId);

    // Insert with the next per-thread seq computed atomically; UNIQUE(thread_id, seq) guards a concurrent
    // sender — retry on a 23505 race. Mirrors the deployed theo_chat_send_message insert loop.
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages
            (thread_id, seq, sender_oid, body,
             gif_provider, gif_id, gif_url, gif_preview_url, gif_width, gif_height, gif_title)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4, $5, $6, $7, $8, $9, $10
          FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id,
                    gif_provider, gif_id, gif_url, gif_preview_url, gif_width, gif_height, gif_title
          `,
          [threadId, oid, bodyParam, gif.provider, gif.id, gif.url, gif.preview_url, gif.width, gif.height, gif.title]
        );
        await client.query(`UPDATE public.theo_chat_threads SET updated_at = now() WHERE id = $1`, [threadId]);
        await client.query("COMMIT");
        saved = ins.rows[0];
      } catch (e) {
        try { await client.query("ROLLBACK"); } catch {}
        if (e && e.code === "23505") continue; // seq race — recompute and retry
        throw e;
      }
    }
    if (!saved) {
      throw buildKnownError("CONFLICT", "Could not assign a message sequence; please retry.", 409);
    }

    // Shape to the standard message projection exactly (parity with list_messages / send_message):
    // a GIF message is never a reply/forward/attachment and never (freshly) deleted.
    saved.reply_to = null;
    saved.deleted = false;
    saved.deleted_at = null;
    saved.forwarded = false;
    saved.attachment = null;
    saved.gif = {
      provider: saved.gif_provider,
      id: saved.gif_id,
      url: saved.gif_url,
      preview_url: saved.gif_preview_url,
      width: saved.gif_width == null ? null : Number(saved.gif_width),
      height: saved.gif_height == null ? null : Number(saved.gif_height),
      title: saved.gif_title,
    };
    delete saved.gif_provider; delete saved.gif_id; delete saved.gif_url; delete saved.gif_preview_url;
    delete saved.gif_width; delete saved.gif_height; delete saved.gif_title;

    // Publish to the thread's Web PubSub group so every connected participant receives it instantly.
    // Best-effort: already durably persisted; a publish failure must not fail the send.
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "message",
          thread_id: saved.thread_id,
          message: saved,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_send_gif publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ message: saved }));
  } catch (err) {
    context.log.error("theo_chat_send_gif failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Message violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
