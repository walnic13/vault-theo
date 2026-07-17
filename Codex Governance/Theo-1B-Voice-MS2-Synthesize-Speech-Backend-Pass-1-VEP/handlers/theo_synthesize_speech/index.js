const crypto = require("crypto");

// ---- Voice-MS2 (HF-T6 audio gateway broker): text-to-speech (read-aloud).
// Accepts response text and returns synthesized audio from in-tenant Azure AI Speech
// neural voices, brokered with the Function's managed identity (keyless). No text/audio
// leaves the tenant; no credential/endpoint reaches the browser. STATELESS — no theo_* table.
// Mirrors the deployed HF-T6 sibling theo_transcribe_audio (func-chat) helper set + MI-token
// pattern; the outbound Azure AI Speech call is the DR-T8 / API-Spec §2.11 authorized delta.
//
// v1 ships ONE premium default voice (no FE picker); the optional `voice` override is
// validated against a curated allow-list so a voice picker is later a FE-only change.
const TTS_ENDPOINT = process.env.THEO_TTS_ENDPOINT;         // e.g. https://switzerlandnorth.tts.speech.microsoft.com
const TTS_RESOURCE_ID = process.env.THEO_TTS_RESOURCE_ID;   // ARM resource id for the Speech AAD `aad#{id}#{token}` header
const DEFAULT_VOICE = process.env.THEO_TTS_DEFAULT_VOICE || "en-US-AvaMultilingualNeural";
const OUTPUT_FORMAT = process.env.THEO_TTS_OUTPUT_FORMAT || "audio-24khz-48kbitrate-mono-mp3";
const MAX_CHARS = Number(process.env.THEO_TTS_MAX_CHARS || 8000);
const COGNITIVE_SCOPE = "https://cognitiveservices.azure.com/";

// Curated premium neural voices (all confirmed in the Switzerland North catalog). v1 uses
// DEFAULT_VOICE; an optional body `voice` must be one of these (SSML-injection-safe + curated).
const ALLOWED_VOICES = [
  "en-US-AvaMultilingualNeural",
  "en-US-AndrewMultilingualNeural",
  "en-US-EmmaMultilingualNeural",
  "en-US-JennyNeural",
  "en-GB-SoniaNeural",
  "en-GB-RyanNeural",
];

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

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return { error: { code, message, status, timestamp: nowIso() } };
}

function successBody(data) {
  return { data, meta: { timestamp: nowIso(), version: "1.0" } };
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
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}

// ---- XML escaper for SSML text content (standard; also present verbatim in the deployed
// theo_create_attachment_upload sibling). Prevents SSML/markup injection from user text.
function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// ---- Raw https helper — BINARY variant of the theo_transcribe_audio `requestUrl`: collects
// the response as a Buffer (audio bytes) instead of a utf8 string; writes an optional body.
function requestUrlBinary(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => { chunks.push(chunk); });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: Buffer.concat(chunks) });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// ---- Managed-identity access token (verbatim from the theo_transcribe_audio Primary Reference; keyless).
async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error(
      "Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing). " +
      "Ensure System Assigned Managed Identity is enabled on the Function App."
    );
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  // token response is small JSON — use a text collector inline (mirrors the sibling's requestUrl).
  const r = await new Promise((resolve, reject) => {
    const https = require("https");
    const url = new URL(tokenUrl);
    const rq = https.request(
      { method: "GET", hostname: url.hostname, port: url.port ? Number(url.port) : undefined, path: url.pathname + url.search, headers: { "X-IDENTITY-HEADER": identityHeader } },
      (res) => { let data = ""; res.on("data", (c) => { data += c; }); res.on("end", () => resolve({ statusCode: res.statusCode || 0, body: data })); }
    );
    rq.on("error", reject);
    rq.end();
  });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) {
    throw new Error("Managed Identity token endpoint did not return access_token.");
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
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  // ---- Validate inputs before any outbound call (deterministic 400s) ----
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'text' is required and must be a non-empty string.", 400));
  }
  if (text.length > MAX_CHARS) {
    return send(context, 400, errorBody("PAYLOAD_TOO_LARGE", `Field 'text' exceeds the ${MAX_CHARS}-character limit.`, 400));
  }

  let voice = DEFAULT_VOICE;
  if (body.voice !== undefined && body.voice !== null && body.voice !== "") {
    if (typeof body.voice !== "string" || !ALLOWED_VOICES.includes(body.voice)) {
      return send(
        context,
        400,
        errorBody("INVALID_REQUEST", `Field 'voice' must be one of the supported voices: ${ALLOWED_VOICES.join(", ")}.`, 400)
      );
    }
    voice = body.voice;
  }

  if (!TTS_ENDPOINT || !TTS_RESOURCE_ID) {
    context.log.error("theo_synthesize_speech: THEO_TTS_ENDPOINT/THEO_TTS_RESOURCE_ID not configured.");
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Speech synthesis is not configured.", 500));
  }

  try {
    const token = await getManagedIdentityAccessToken(COGNITIVE_SCOPE);
    const lang = voice.split("-").slice(0, 2).join("-") || "en-US";
    const ssml =
      `<speak version='1.0' xml:lang='${lang}'>` +
      `<voice name='${voice}'>${xmlEscape(text)}</voice></speak>`;

    const url = `${TTS_ENDPOINT.replace(/\/$/, "")}/cognitiveservices/v1`;
    const r = await requestUrlBinary(
      url,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer aad#${TTS_RESOURCE_ID}#${token}`,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": OUTPUT_FORMAT,
          "User-Agent": "vault-theo",
          "Content-Length": Buffer.byteLength(ssml, "utf8"),
        },
      },
      Buffer.from(ssml, "utf8")
    );

    if (r.statusCode < 200 || r.statusCode >= 300) {
      context.log.error(`theo_synthesize_speech: Azure AI Speech synthesis failed (${r.statusCode}).`);
      return send(context, 502, errorBody("UPSTREAM_ERROR", "The speech synthesis service returned an error.", 502));
    }
    if (!r.body || !r.body.length) {
      context.log.error("theo_synthesize_speech: empty audio from synthesis service.");
      return send(context, 502, errorBody("UPSTREAM_ERROR", "The speech synthesis service returned no audio.", 502));
    }

    return send(context, 200, successBody({
      audio_base64: r.body.toString("base64"),
      content_type: "audio/mpeg",
      voice,
    }));
  } catch (err) {
    context.log.error("theo_synthesize_speech failed", err);
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred synthesizing the audio.", 500));
  }
};
