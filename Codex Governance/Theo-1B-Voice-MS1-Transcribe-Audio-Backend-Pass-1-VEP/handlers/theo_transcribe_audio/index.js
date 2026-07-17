const crypto = require("crypto");

// ---- Voice-MS1 (HF-T6 audio gateway broker): speech-to-text.
// Accepts a short base64 audio clip and returns its transcript from the in-tenant
// Azure OpenAI Whisper deployment, brokered with the Function's managed identity
// (keyless; scope https://cognitiveservices.azure.com/). No audio leaves the tenant;
// no credential/endpoint reaches the browser. STATELESS — no theo_* table, no persistence.
// Mirrors the deployed theo_create_attachment_upload (func-chat) helper set + MI-token
// pattern; the outbound cognitive call is the DR-T8 / API-Spec §2.11 authorized delta.
const AOAI_AUDIO_ENDPOINT = process.env.THEO_AOAI_AUDIO_ENDPOINT; // e.g. https://vaultgpt.openai.azure.com
const WHISPER_DEPLOYMENT = process.env.THEO_WHISPER_DEPLOYMENT || "whisper";
const AOAI_AUDIO_API_VERSION = process.env.THEO_AOAI_AUDIO_API_VERSION || "2024-06-01";
const COGNITIVE_SCOPE = "https://cognitiveservices.azure.com/";
const MAX_AUDIO_BYTES = Number(process.env.THEO_TRANSCRIBE_MAX_BYTES || 8 * 1024 * 1024); // 8 MB dictation cap

// Closed audio allow-list → the filename extension sent to Whisper (multipart requires a filename).
const AUDIO_CONTENT_TYPES = {
  "audio/webm": "clip.webm",
  "audio/ogg": "clip.ogg",
  "audio/mp4": "clip.mp4",
  "audio/mpeg": "clip.mp3",
  "audio/wav": "clip.wav",
  "audio/x-wav": "clip.wav",
};
const ALLOWED_AUDIO_TYPES = Object.keys(AUDIO_CONTENT_TYPES);

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

function normalizeContentType(ct) {
  return String(ct || "").split(";")[0].trim().toLowerCase();
}

// ---- Raw https helper (verbatim from the theo_create_attachment_upload Primary Reference):
// writes an optional request body (string OR Buffer) and buffers the response text.
function requestUrl(urlStr, options = {}, body = null) {
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
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// ---- Managed-identity access token (verbatim from the Primary Reference; keyless).
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
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) {
    throw new Error("Managed Identity token endpoint did not return access_token.");
  }
  return payload.access_token;
}

// ---- multipart/form-data builder for the Whisper transcription POST (audio is binary,
// so the body is assembled as a Buffer). DR-T8 / API-Spec §2.11 authorized outbound shape.
function buildMultipart(fields, file) {
  const boundary = "----theoaudio" + crypto.randomBytes(16).toString("hex");
  const CRLF = "\r\n";
  const parts = [];
  for (const [name, value] of Object.entries(fields)) {
    parts.push(Buffer.from(
      `--${boundary}${CRLF}Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}${value}${CRLF}`,
      "utf8"
    ));
  }
  parts.push(Buffer.from(
    `--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="${file.filename}"${CRLF}` +
    `Content-Type: ${file.contentType}${CRLF}${CRLF}`,
    "utf8"
  ));
  parts.push(file.buffer);
  parts.push(Buffer.from(`${CRLF}--${boundary}--${CRLF}`, "utf8"));
  return { boundary, body: Buffer.concat(parts) };
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
  const contentType = normalizeContentType(body.content_type);
  if (!ALLOWED_AUDIO_TYPES.includes(contentType)) {
    return send(
      context,
      400,
      errorBody(
        "UNSUPPORTED_MEDIA_TYPE",
        `Field 'content_type' must be one of the supported audio types: ${ALLOWED_AUDIO_TYPES.join(", ")}.`,
        400
      )
    );
  }

  const audioB64 = typeof body.audio_base64 === "string" ? body.audio_base64.trim() : "";
  if (!audioB64) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'audio_base64' is required and must be a non-empty base64 string.", 400));
  }

  let audioBuf;
  try {
    audioBuf = Buffer.from(audioB64, "base64");
  } catch {
    audioBuf = Buffer.alloc(0);
  }
  if (!audioBuf.length) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'audio_base64' did not decode to any audio bytes.", 400));
  }
  if (audioBuf.length > MAX_AUDIO_BYTES) {
    return send(context, 400, errorBody("PAYLOAD_TOO_LARGE", `Audio clip exceeds the ${MAX_AUDIO_BYTES}-byte limit.`, 400));
  }

  if (!AOAI_AUDIO_ENDPOINT) {
    context.log.error("theo_transcribe_audio: THEO_AOAI_AUDIO_ENDPOINT not configured.");
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Transcription is not configured.", 500));
  }

  try {
    const token = await getManagedIdentityAccessToken(COGNITIVE_SCOPE);
    const { boundary, body: mpBody } = buildMultipart(
      { response_format: "json" },
      { filename: AUDIO_CONTENT_TYPES[contentType], contentType, buffer: audioBuf }
    );
    const base = AOAI_AUDIO_ENDPOINT.replace(/\/$/, "");
    const url =
      `${base}/openai/deployments/${encodeURIComponent(WHISPER_DEPLOYMENT)}/audio/transcriptions` +
      `?api-version=${encodeURIComponent(AOAI_AUDIO_API_VERSION)}`;

    const r = await requestUrl(
      url,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": mpBody.length,
        },
      },
      mpBody
    );

    if (r.statusCode < 200 || r.statusCode >= 300) {
      context.log.error(`theo_transcribe_audio: Whisper transcription failed (${r.statusCode}).`);
      return send(context, 502, errorBody("UPSTREAM_ERROR", "The transcription service returned an error.", 502));
    }

    let text = "";
    try {
      const parsed = JSON.parse(r.body || "{}");
      text = typeof parsed.text === "string" ? parsed.text.trim() : "";
    } catch {
      text = "";
    }

    return send(context, 200, successBody({ text }));
  } catch (err) {
    context.log.error("theo_transcribe_audio failed", err);
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred transcribing the audio.", 500));
  }
};
