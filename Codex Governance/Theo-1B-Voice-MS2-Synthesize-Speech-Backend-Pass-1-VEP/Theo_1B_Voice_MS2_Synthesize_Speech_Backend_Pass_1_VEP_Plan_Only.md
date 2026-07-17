# Theo 1B — Voice-MS2: Text-to-Speech (`theo_synthesize_speech`, Backend, Pass 1 VEP, Plan-Only)

Plan-only Verified Evidence Pack. No handler is deployed and no app settings are set in this turn. This pack delivers **Voice-MS2** of the Codex-APPROVED **Tier Voice** (Phase 1B Backend Plan §7): a new stateless `theo_synthesize_speech` handler on `vaultgpt-func-chat` (HF-T6 audio gateway broker) that accepts response text and returns synthesized audio from **in-tenant Azure AI Speech** neural voices, brokered keyless with the Function's managed identity. **v1 ships one premium default voice (no picker)** — `en-US-AvaMultilingualNeural` — with an optional validated `voice` override so a picker is later a FE-only change. No `theo_*` table, no migration. Sibling to the DEPLOYED Voice-MS1 `theo_transcribe_audio`.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `28ebada304fe2cf713968ff9d81a683c32e01b3b` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8

Currency anchors below are the git blob SHA of each cited file at HEAD (verifiable via `git cat-file -p <sha>`); the mechanical currency check is satisfied by literal-substring Rule Anchors at HEAD.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3 Never-Guess; §4 Schema Reality Lock; §7 Golden Curl+Handler; §8 VEP Format + Gap Register) | `Read(governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md)` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4/§4A P-track; §5 Rule Anchor Table; §6/§10 triggers incl. T12/T40) | `Read(governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md)` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 Primary Reference; §3 handler structure; §4 Allowed Deltas / new-external-system; §5 Structural Mirror + curl; §5.5 deploy/Kudu; §6 HF-T6) | `Read(governance/THEO_GOLDEN_HANDLER_STANDARD.md)` this turn | `4cadb2813a72b0ee83e38b72dce925ffe626621b` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A role vocabulary; §1B DR-T8; §1E/DR-T7 deploy exception) | `Read(governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md)` this turn | `131e6e62772b0bca46468473556418651e3a6660` |
| 5 | Theo API Spec — `spec/THEO_API_SPEC.md` (§1 route naming; §2.11 Voice I/O — the synthesize row this microstep realizes; the transcribe row is now DEPLOYED) | `Read(spec/THEO_API_SPEC.md)` this turn | `cc3988e2c58567eafd39273203cec5c8afd49035` |
| 6 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§1 conventions; §2 RLS baseline — establishes NO table is added here) | `Read(spec/THEO_AZURE_POSTGRES_SCHEMA.md)` this turn | `dd3f274e6cd57ed1c870dce2585867cc753c0dab` |
| 7 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier Voice — Voice-MS2 bullet, the feature entry this microstep identifies against; Voice-MS1 now DEPLOYED) | `Read(governance/THEO_PHASE_1B_BACKEND_PLAN.md)` this turn | `cbd0246ef8b3d5c85cde7740764908ab39aacc9e` |
| 8 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 repo boundary; §2/§2.4 model-gateway seam + inference-locus; §5 theo_ schema/RLS) | `Read(governance/THEO_ARCHITECTURE_AND_STRUCTURE.md)` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 9 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A hard gates; §2 review; §3 verdict) | `Read(governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md)` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 10 | Primary Reference handler — `Codex Governance/Theo-1B-Voice-MS2-Synthesize-Speech-Backend-Pass-1-VEP/primary-reference/theo_transcribe_audio.index.js` (LIVE deployed func-chat HF-T6 sibling, Kudu-GET this turn) | `Bash(Kudu-GET …theo_transcribe_audio/index.js)` this turn | `adb2767f548ac334e4344ae69e08dad2ebbb9292` |
| 11 | Primary Reference function.json — `Codex Governance/Theo-1B-Voice-MS2-Synthesize-Speech-Backend-Pass-1-VEP/primary-reference/theo_transcribe_audio.function.json` (LIVE deployed, Kudu-GET this turn) | `Bash(Kudu-GET …theo_transcribe_audio/function.json)` this turn | `7ee561158114c282a8c6174229d2cfc06e302afd` |
| 12 | Walter authorization (HF-T6 TTS new external system) — `Codex Governance/Theo-1B-Voice-MS2-Synthesize-Speech-Backend-Pass-1-VEP/WALTER_AUTHORIZATION_HF-T6-TTS.md` (verbatim Walter direction 2026-07-17 + DR-T8 pointer; Golden Handler §4 predating authorization) | authored this turn | `n/a — package artifact (predating Walter authorization, quoted verbatim)` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "Every substantive Claude Code or Codex turn MUST open with a table of the form:" |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive Claude Code or Codex turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "The Gap Register vocabulary is closed:" |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "Claude Code MUST NOT assert any schema object, column, policy, function, endpoint contract, status code, or external-system behavior that it has not read this turn" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "A **new-domain or new-external-system helper** classified as ALLOWED DELTA requires either an EXACT mirror against a deployed handler containing that helper" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Kudu VFS surgical overwrite" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §6 | "Audio gateway broker" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B | "In-tenant Voice I/O" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "vaultgpt-func-chat" |
| spec/THEO_API_SPEC.md | §1 | "Route naming: `theo_<operation>_<entity>`" |
| spec/THEO_API_SPEC.md | §2.11 | "synthesize response text → speech audio (read-aloud)" |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "Canonical ownership column: **`created_by text NOT NULL`**" |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §2.4 | "Foundry-Claude inference runs on Anthropic-hosted infrastructure, not Azure-tenant-native" |
| Codex Governance/Theo-1B-Voice-MS2-Synthesize-Speech-Backend-Pass-1-VEP/primary-reference/theo_transcribe_audio.index.js | MI-token | "async function getManagedIdentityAccessToken(resource)" |

Sub-phase Track rationale: **P8 (VEP assembly)** is the established convention for a full backend plan VEP in this repo. The turn walks the full P1–P8 spine; the Rule Anchor Table carries the Conformance §3/§5 anchors (P8), the Governor anchors (§3/§8), the Golden Handler anchors (P5: §2/§4/§5.5/§6), the API-Spec anchors (P4: §1/§2.11), the Schema anchor (P3: §1), the Orchestration anchors (§1B/§1E), the Architecture anchor (P2: §2.4), and the Primary-Reference anchor.

---

## P1 — Feature identification

**Microstep:** Tier Voice, **Voice-MS2** — `theo_synthesize_speech` (read-aloud / text-to-speech). Feature entry: Phase 1B Backend Plan §7 "Tier Voice", Voice-MS2 bullet; contract: API Spec §2.11 (`theo_synthesize_speech`, `1B-PROPOSED`); handler family: Golden Handler §6 HF-T6; decision: Orchestration §1B DR-T8. Sibling `theo_transcribe_audio` (Voice-MS1) is DEPLOYED (2026-07-17).

**Scope.** One net-new HTTP handler `POST /api/theo_synthesize_speech` on `vaultgpt-func-chat`. Body `{ text, voice? }` → `{ audio_base64, content_type, voice }`. The handler resolves the caller OID (EasyAuth), validates text (non-empty, ≤ `THEO_TTS_MAX_CHARS` chars) + the optional `voice` (against a curated allow-list), XML-escapes the text into SSML, acquires a managed-identity token for `https://cognitiveservices.azure.com/`, and POSTs to the in-tenant Azure AI Speech synthesis endpoint (the resource's **custom-subdomain** `/tts/cognitiveservices/v1`, plain `Authorization: Bearer <MI token>` — the SAME auth the deployed Whisper sibling uses on this resource), returning the synthesized MP3 as base64. **Stateless** — no `theo_*` table, no migration, no persistence.

**v1 simplicity (Walter, 2026-07-17: "simple and high quality to start").** v1 ships ONE premium default voice `en-US-AvaMultilingualNeural` (no FE picker). The optional `voice` override is validated against a curated allow-list of 6 premium neural voices so a picker is later a FE-only change against an unchanged backend.

Out of scope: the FE per-message read-aloud control + any voice picker (Theo-FE passes); SSML style/prosody controls; streaming synthesis (v1 is buffered).

**Route / object naming.** `theo_<operation>_<entity>` (API Spec §1) → `theo_synthesize_speech`, matching the §2.11 registration.

**Role vocabulary (Orchestration §1A).** Claude Code authors (Pass 1). Codex reviews (Pass 2). On APPROVED, Claude Code sets the app settings + deploys to `vaultgpt-func-chat` (DR-T7) and runs the golden curls. No deploy before Pass-2 APPROVAL.

---

## P2 — Architecture & boundary reconciliation

- **Repository / app boundary (Architecture §1; Orchestration §1E / DR-T7).** Net-new-additive on `vaultgpt-func-chat` — the only app Claude Code may deploy to, and the app hosting the DEPLOYED HF-T6 sibling `theo_transcribe_audio`. Monolith + stream sidecar untouched. No `reporting_*` access (T40 clean).
- **theo_ schema + RLS baseline (Architecture §5; Schema §1/§2).** No table/column/policy/function added or touched — stateless. Schema Reality Lock (Governor §4): N/A (nothing to classify).
- **Model gateway seam (Architecture §2 / §2.4).** A keyless-MI gateway of the HF-T1 class, to a different in-tenant endpoint — Azure AI Speech TTS — not the Anthropic Messages endpoint. Per §2.4 the Claude text model is Anthropic-hosted (Sweden Central); the Speech audio model is true in-tenant Azure Cognitive Services (DR-T8), so no text/audio leaves the tenant.
- **New external system → Golden Handler §4 / Conformance §10 T12.** The outbound Azure AI Speech call is a new external system with no EXACT deployed mirror. §4 permits an ALLOWED DELTA with "a Walter authorization quoted verbatim and predating the VEP" — LANDED as DR-T8 (Orchestration §1B, Codex-APPROVED `f466ffd`) and quoted verbatim in `WALTER_AUTHORIZATION_HF-T6-TTS.md`. See Gap G-NEWEXTERNAL.
- **Credential posture.** The cognitive token is acquired server-side by the Function's managed identity and sent as a plain `Authorization: Bearer <token>` to the resource's **custom-subdomain** Speech endpoint — the SAME auth pattern the deployed Whisper sibling uses on this resource (verified this turn: the regional endpoint + `aad#` form 401s the managed identity, while the custom-subdomain + plain bearer succeeds). No key/endpoint/token reaches the browser; the response carries only base64 audio.
- **Injection safety.** User text is XML-escaped into the SSML `<voice>` element (the `xmlEscape` helper, also present in the deployed `theo_create_attachment_upload`); the `voice` attribute is constrained to a curated allow-list, so neither field can inject SSML/markup.
- **Tool dispatch / Tool Manifest (Architecture §4).** Not touched — no `reporting_*` endpoint consumed.

---

## Gap Register

Vocabulary is closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §8.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-NEWEXTERNAL | The outbound Azure AI Speech TTS call is a **new external system** (Golden Handler §4 / T12) — no deployed handler contains an EXACT mirror. | **PROCEED** | Resolved by the LANDED Walter authorization recorded as **DR-T8** (Orchestration §1B, Codex-APPROVED `f466ffd`, predating this VEP) + quoted verbatim in `WALTER_AUTHORIZATION_HF-T6-TTS.md`. The MI-token acquisition is an **EXACT byte-identical** reuse of the deployed `getManagedIdentityAccessToken` AND its `requestUrl` helper (Primary Reference `theo_transcribe_audio`; confirmed by `diff` this turn — both zero-diff). The only helper delta is `requestUrlBinary` (a Buffer-response variant of `requestUrl`, required for audio bytes), classified ALLOWED DELTA; the Speech custom-subdomain endpoint + SSML body are the external-system delta under DR-T8. The **auth is now IDENTICAL to the sibling's Whisper call** — a plain `Authorization: Bearer <MI token>` to the same custom-subdomain cognitive resource. The synthesis path (custom-subdomain `/tts/cognitiveservices/v1` + plain-bearer + SSML + output-format) was **live-probed this turn** (HTTP 200, MP3 `fff3` frame header). |
| G-PROVISION | The two `vaultgpt-func-chat` app settings (`THEO_TTS_ENDPOINT`, `THEO_TTS_DEFAULT_VOICE`) are not set to their final values yet. | **PRE-LAND** | Set by Claude Code **only after** Codex APPROVAL, at Pass 3, before the happy-path curl: `THEO_TTS_ENDPOINT=https://wmans-mqxwlcdp-switzerlandnorth.cognitiveservices.azure.com` (the resource **custom subdomain** — NOT the regional `tts.speech.microsoft.com` host, which 401s the MI), `THEO_TTS_DEFAULT_VOICE=en-US-AvaMultilingualNeural`. No `THEO_TTS_RESOURCE_ID` is needed (plain-bearer auth, no `aad#` wrapper). **No new MI role and no model deployment** — the func-chat MI (`5a0cf3c6-07c9-4412-aa50-e39987ae3bfb`) already holds `Cognitive Services User` on that resource (granted for Voice-MS1) and is proven to call it (Whisper), which covers Speech data-plane; Azure AI Speech is a service on the resource (nothing to deploy). |
| G-VOICE-SELECTION | Walter asked whether to offer a voice selection; directed "simple and high quality to start." | **PROCEED** | v1 = one premium default (`en-US-AvaMultilingualNeural`), no FE picker. The handler accepts an optional `voice` validated against a curated allow-list (`en-US` Ava/Andrew/Emma Multilingual, `en-US` Jenny, `en-GB` Sonia/Ryan — all confirmed in the region catalog this turn), so a picker is later a FE-only change; the backend needs no re-approval to light it up. |
| G-TRANSPORT | Response returns the full audio inline as base64 (buffered), not a stream. | PROCEED | Deliberate for v1 — a Theo message is bounded (`THEO_TTS_MAX_CHARS`, default 8000), so buffered base64 is simple and adequate; the FE plays it directly. Streaming synthesis (chunked) is a noted future option, not required for v1. |
| G-PRIMARY | Golden Handler §5.5: "The deployed handler is the source of truth." | **NO DRIFT** (PROCEED) | Primary Reference `theo_transcribe_audio` was **Kudu-GET live from func-chat wwwroot this turn** (blob `adb2767f`, byte-identical to the DEPLOYED MS1 handler), copied into `primary-reference/`. |
| G-PLAN | Feature must exist in the governed plan (Conformance §4A.1 P1). | PROCEED | Tier Voice + Voice-MS2 landed in Phase 1B Backend Plan §7 at `f466ffd`; this microstep identifies against it. |

---

## P3 — Schema grounding (DEPLOYED vs PROPOSED)

**No schema objects are in scope.** `theo_synthesize_speech` is stateless: reads no `theo_*` table, writes none, adds none. Schema Reality Lock (Governor §4) is satisfied vacuously. No `auth.uid()`/`set_config` (no DB connection). **No migration** (P6). The only DEPLOYED facts relied on are infrastructural: the func-chat System-Assigned MI (`5a0cf3c6-07c9-4412-aa50-e39987ae3bfb`, holding `Cognitive Services User` on the Switzerland North resource — granted for Voice-MS1, verified this turn) and the IMDS token env (`IDENTITY_ENDPOINT`/`IDENTITY_HEADER`).

---

## P4 — Contract grounding

Realizes the PROPOSED API Spec §2.11 row `theo_synthesize_speech`. Contract as implemented:

- **Route:** `POST /api/theo_synthesize_speech` on `vaultgpt-func-chat` (+ `OPTIONS` → 204).
- **Request body (JSON):** `{ text: string (non-empty, ≤ THEO_TTS_MAX_CHARS, default 8000), voice?: string ∈ curated allow-list }`.
- **Response 200:** `{ data: { audio_base64: string, content_type: "audio/mpeg", voice: string }, meta: {...} }`.
- **Errors** (`{error:{code,message,status,timestamp}}`): `401 UNAUTHORIZED`; `400 BAD_REQUEST` (body not JSON); `400 INVALID_REQUEST` (missing/empty `text`, or unsupported `voice`); `400 PAYLOAD_TOO_LARGE` (`text` over cap); `502 UPSTREAM_ERROR` (Speech non-2xx or empty audio); `500 INTERNAL_SERVER_ERROR` (MI/token/unexpected or endpoint unconfigured).

On DEPLOYED + curl-verified, a Pass-4 Role-C flips the §2.11 `theo_synthesize_speech` row to `1B-deployed` and the Golden Handler §6 HF-T6 status to fully DEPLOYED.

---

## P5 — Handler grounding

### Canonical Primary Reference (exactly one; Golden Handler §2)

**`theo_transcribe_audio`** — the DEPLOYED HF-T6 sibling on `vaultgpt-func-chat` (Voice-MS1, deployed 2026-07-17), **Kudu-GET live from wwwroot this turn** (deployed source of truth per §5.5). Closest deployed pattern: same app, same family, EasyAuth OID, `{data,meta}`/`{error}` envelopes, deterministic pre-call 400s, and `getManagedIdentityAccessToken(resource)` acquiring a keyless MI token to call an in-tenant cognitive endpoint. `theo_synthesize_speech` reuses that helper set and swaps the transcription call for the DR-T8-authorized Azure AI Speech call. No composite reference (§2 / T10).

#### Primary Reference — `theo_transcribe_audio/index.js` (FULL VERBATIM, LIVE deployed)

```js
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
```

#### Primary Reference — `theo_transcribe_audio/function.json` (FULL VERBATIM, LIVE deployed)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_transcribe_audio"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### Structural Mirror Table (Golden Handler §5.1)

| Handler region (`theo_synthesize_speech`) | Primary Reference region | Classification | Basis / Rule Anchor |
| ------------------------------------------ | ------------------------ | -------------- | ------------------- |
| `require("crypto")`, `corsHeaders`, `send`, `nowIso`, `errorBody`, `successBody`, `getPrincipal`, `getClaimValue`, `parseBody` | same | EXACT | verbatim byte-identical |
| `requestUrl(urlStr, options, body)` (string response collector) | same | EXACT | verbatim byte-identical (confirmed by `diff` this turn); reused by `getManagedIdentityAccessToken` for the token call |
| `getManagedIdentityAccessToken(resource)` | same | EXACT | verbatim byte-identical (confirmed by `diff` this turn); calls `requestUrl` exactly as the sibling does, with `"https://cognitiveservices.azure.com/"` (resource string = a config value, not a structural change) |
| Config constants (`TTS_ENDPOINT`/`DEFAULT_VOICE`/`OUTPUT_FORMAT`/`MAX_CHARS`/`ALLOWED_VOICES`/`COGNITIVE_SCOPE`) | `AOAI_AUDIO_ENDPOINT`/`WHISPER_DEPLOYMENT`/`MAX_AUDIO_BYTES`/`AUDIO_CONTENT_TYPES`/`COGNITIVE_SCOPE` | ALLOWED DELTA | Golden Handler §4 "endpoint names; the specific validated field set"; `COGNITIVE_SCOPE` is byte-identical to the sibling |
| Handler shell: OPTIONS→204, OID→401, `parseBody`→400, validate→400, `try/catch`→500 | same shell | EXACT (structure) | mirror of the Primary Reference control flow; validated field set (`text`/`voice` + char cap) is the ALLOWED DELTA |
| `xmlEscape(s)` | (not in this reference; present verbatim in the deployed sibling `theo_create_attachment_upload`) | ALLOWED DELTA (standard helper) | Golden Handler §4; standard XML escaper for SSML injection-safety, byte-identical to the deployed `theo_create_attachment_upload` copy |
| `requestUrlBinary(...)` (Buffer response collector) | `requestUrl(...)` (string response collector) | ALLOWED DELTA | Golden Handler §4; binary-response variant required because the TTS response is audio bytes — added ALONGSIDE the byte-verbatim `requestUrl` (which stays for the token call); only the response accumulation differs (`Buffer.concat(chunks)` vs `data += chunk`), request shape identical |
| Outbound Azure AI Speech POST (custom-subdomain `/tts/cognitiveservices/v1`, SSML body, **plain `Bearer <MI token>`** auth — same as the sibling's Whisper POST — `X-Microsoft-OutputFormat`, `User-Agent`) | Outbound Whisper POST (custom-subdomain `/openai/…`, multipart, plain `Bearer <MI token>`) | ALLOWED DELTA (new external system) | Golden Handler §4; DR-T8 + `WALTER_AUTHORIZATION_HF-T6-TTS.md`; auth pattern byte-for-byte the sibling's; live-probed 200 this turn |
| Response `200 successBody({ audio_base64, content_type, voice })` | `200 successBody({ text })` | ALLOWED DELTA | Golden Handler §4 "the contract's response shape" (API Spec §2.11) |
| `function.json` (anonymous httpTrigger, `post`+`options`, `route: theo_synthesize_speech`, http out) | same shape, `route: theo_transcribe_audio` | ALLOWED DELTA | Golden Handler §4 "endpoint names"; EasyAuth upstream unchanged |

No region is an unjustified DEVIATION.

### New handler — `theo_synthesize_speech/index.js` (complete, copy-paste-ready)

Ships in this package at `handlers/theo_synthesize_speech/index.js`, reproduced verbatim:

```js
const crypto = require("crypto");

// ---- Voice-MS2 (HF-T6 audio gateway broker): text-to-speech (read-aloud).
// Accepts response text and returns synthesized audio from in-tenant Azure AI Speech
// neural voices, brokered with the Function's managed identity (keyless). No text/audio
// leaves the tenant; no credential/endpoint reaches the browser. STATELESS — no theo_* table.
// Mirrors the deployed HF-T6 sibling theo_transcribe_audio (func-chat): SAME custom-subdomain
// cognitive endpoint + SAME plain `Authorization: Bearer <MI token>` auth (the sibling's Whisper
// call). The Speech synthesis endpoint/SSML body is the DR-T8 / API-Spec §2.11 authorized delta.
const TTS_ENDPOINT = process.env.THEO_TTS_ENDPOINT; // custom subdomain, e.g. https://<resource>.cognitiveservices.azure.com
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

// ---- Raw https helper (verbatim from the theo_transcribe_audio Primary Reference):
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

// ---- Raw https helper — BINARY variant of the Primary Reference `requestUrl`: collects
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

  if (!TTS_ENDPOINT) {
    context.log.error("theo_synthesize_speech: THEO_TTS_ENDPOINT not configured.");
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Speech synthesis is not configured.", 500));
  }

  try {
    const token = await getManagedIdentityAccessToken(COGNITIVE_SCOPE);
    const lang = voice.split("-").slice(0, 2).join("-") || "en-US";
    const ssml =
      `<speak version='1.0' xml:lang='${lang}'>` +
      `<voice name='${voice}'>${xmlEscape(text)}</voice></speak>`;

    // Custom-subdomain Speech endpoint + plain Bearer MI token — the SAME auth pattern the
    // deployed sibling uses for Whisper (a plain-bearer MI call to this cognitive resource).
    const url = `${TTS_ENDPOINT.replace(/\/$/, "")}/tts/cognitiveservices/v1`;
    const r = await requestUrlBinary(
      url,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
```

### New handler — `theo_synthesize_speech/function.json` (complete)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_synthesize_speech"
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

## P6 — SQL grounding

**None.** Voice-MS2 is stateless — no migration, no seed, no Walter-executable SQL, no verification SQL, no `theo_*` object created or touched.

---

## P7 — Curl grounding (deterministic golden curls)

Run at Pass 3 (after APPROVAL + app-settings + deploy) from the live `az` session; bearer for the EasyAuth audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e/access_as_user`. Base `https://vaultgpt-func-chat.azurewebsites.net/api`.

Deterministic (verifiable immediately post-deploy, no Speech dependency):

1. **OPTIONS → 204.**
2. **Missing auth → 401** (EasyAuth upstream / handler 401).
3. **Missing text → 400 `INVALID_REQUEST`.** body `{}` or `{"voice":"en-US-AvaMultilingualNeural"}`.
4. **Empty text → 400 `INVALID_REQUEST`.** body `{"text":"   "}`.
5. **Unsupported voice → 400 `INVALID_REQUEST`.** body `{"text":"hi","voice":"xx-XX-Nope"}`.
6. **Over-cap text → 400 `PAYLOAD_TOO_LARGE`.** body `text` longer than `THEO_TTS_MAX_CHARS`.

Happy path (requires the app settings — run last at Pass 3):

7. **Valid text → 200 `{ data: { audio_base64, content_type:"audio/mpeg", voice } }`.** body `{"text":"Hello from Theo. Your workpaper review is ready."}` ⇒ `200`, `data.audio_base64` decodes to a non-empty MP3 (`0xFFFx` frame header). Command/response captured under `.local/` (audio bytes not printed). The synthesis path (custom-subdomain `/tts/cognitiveservices/v1` + plain-bearer auth + SSML + output-format) was pre-verified live this turn (200, MP3).

---

## Provisioning steps (Pass 3, post-APPROVAL only — Walter's deployment gate)

Executed by Claude Code (az authority granted 2026-07-17), strictly **after** Codex APPROVED and before the happy-path curl:

1. **Set app settings** on `vaultgpt-func-chat`: `THEO_TTS_ENDPOINT=https://wmans-mqxwlcdp-switzerlandnorth.cognitiveservices.azure.com` (custom subdomain), `THEO_TTS_DEFAULT_VOICE=en-US-AvaMultilingualNeural` (and remove any prior `THEO_TTS_RESOURCE_ID`, unused under plain-bearer auth).
2. **Deploy the handler** to `vaultgpt-func-chat` via Kudu VFS surgical overwrite (§5.5): PUT `theo_synthesize_speech/index.js` + `function.json`, GET-back diff, restart, unauth-curl health (expect 401).
3. **No new MI role, no model deployment** — the func-chat MI already holds `Cognitive Services User` on the Switzerland North resource (granted for Voice-MS1), which covers Speech data-plane; Azure AI Speech is a service on that resource.

---

## Parity checklist (Golden Handler §5.4)

- [x] Exactly one canonical Primary Reference (handler + function.json), inlined FULL VERBATIM (§2 / T9). No composite (T10).
- [x] Structural Mirror Table maps every region EXACT / ALLOWED DELTA; no unjustified DEVIATION (§5.1).
- [x] New-external-system delta authorized by a verbatim Walter authorization predating the VEP (§4) — DR-T8 + `WALTER_AUTHORIZATION_HF-T6-TTS.md`.
- [x] EasyAuth OID → 401; `{data,meta}`/`{error}` envelopes; deterministic pre-call 400s; SSML injection-safe (xmlEscape + voice allow-list) (Governor §7).
- [x] No secrets/tokens/endpoints leaked (Golden Handler §3.4).
- [x] Deploy target `vaultgpt-func-chat` only (DR-T7 / §1E); monolith + sidecar untouched.
- [x] Stateless — no migration, no `theo_*` object (P3/P6); no `reporting_*` access (T40).
- [x] Deterministic golden curls for every status path (§5.3 / P7).
- [x] Mechanical-lint PASS block attached (below; T24).

## Mechanical lint

Mechanical lint run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission> --repo-root .`), verbatim output:

```
PASS  Codex Governance/Theo-1B-Voice-MS2-Synthesize-Speech-Backend-Pass-1-VEP/Theo_1B_Voice_MS2_Synthesize_Speech_Backend_Pass_1_VEP_Plan_Only.md
EXIT=0
```

Codex re-runs the linter independently (§1A Mechanical-Lint Gate / T24) and rejects on any discrepancy.

## Codex activation note

Open your Pass-2 turn with a governance-bound GCR + Rule Anchor Table (Conformance §3–§5; Codex Review §2). Run the §1A hard gates first (T29/T30/T24/GCR). Then substance: single Primary Reference inlined full-verbatim (T9); new-external-system delta carries the DR-T8 + verbatim-Walter-authorization predating basis (§4 / T12); SSML injection-safety (xmlEscape + voice allow-list); no `reporting_*` (T40); stateless (no migration). Verdict is APPROVED or REJECTED only (T16).
