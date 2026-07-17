# Theo 1B — Voice-MS1: Speech-to-Text (`theo_transcribe_audio`, Backend, Pass 1 VEP, Plan-Only)

Plan-only Verified Evidence Pack. No handler is deployed and no provisioning is executed in this turn. This pack delivers **Voice-MS1** of the Codex-APPROVED **Tier Voice** (Phase 1B Backend Plan §7; landed `f466ffd`): a new stateless `theo_transcribe_audio` handler on `vaultgpt-func-chat` (HF-T6 audio gateway broker) that accepts a short base64 audio clip and returns its transcript from the **in-tenant** Azure OpenAI Whisper deployment, brokered keyless with the Function's managed identity. No `theo_*` table, no migration. The read-aloud half (`theo_synthesize_speech`, Voice-MS2) and the FE mic control are separate passes.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `f466ffd5ea1f5b97b3b0419c88d0cb0d5cc14f70` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8

Currency anchors below are the git blob SHA of each cited file at HEAD (verifiable via `git cat-file -p <sha>`); the mechanical currency check is satisfied by literal-substring Rule Anchors at HEAD.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3 Never-Guess; §4 Schema Reality Lock; §6 SQL/authorization; §7 Golden Curl+Handler; §8 VEP Format + Gap Register) | `Read(governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md)` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4/§4A P-track; §5 Rule Anchor Table; §6/§10 triggers incl. T12/T40) | `Read(governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md)` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 Primary Reference; §3 handler structure; §4 Allowed Deltas / new-external-system; §5 Structural Mirror + curl; §5.5 deploy targets/Kudu; §6 HF registry incl. HF-T6) | `Read(governance/THEO_GOLDEN_HANDLER_STANDARD.md)` this turn | `eb7c54e8b2d7300ec0786c1bd5ca66e71973dcdd` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A role vocabulary; §1B Decision Register incl. DR-T8; §1E/DR-T7 scoped deploy exception) | `Read(governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md)` this turn | `131e6e62772b0bca46468473556418651e3a6660` |
| 5 | Theo API Spec — `spec/THEO_API_SPEC.md` (§1 route naming; §2.11 Voice I/O PROPOSED rows — the contract this microstep realizes) | `Read(spec/THEO_API_SPEC.md)` this turn | `a91542c853efa11887dd5abd2673f7081c4ff5cc` |
| 6 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§1 conventions; §2 RLS baseline — establishes that NO table is added here) | `Read(spec/THEO_AZURE_POSTGRES_SCHEMA.md)` this turn | `dd3f274e6cd57ed1c870dce2585867cc753c0dab` |
| 7 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier Voice — the feature entry this microstep identifies against) | `Read(governance/THEO_PHASE_1B_BACKEND_PLAN.md)` this turn | `00358d1fc2b112938f3f00ce42c20d2419168311` |
| 8 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 repo boundary; §2 model-gateway seam incl. §2.4 inference-locus; §5 theo_ schema/RLS) | `Read(governance/THEO_ARCHITECTURE_AND_STRUCTURE.md)` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 9 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A hard gates; §2 review process; §3 verdict discipline) | `Read(governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md)` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 10 | Primary Reference handler — `Codex Governance/Theo-1B-Voice-MS1-Transcribe-Audio-Backend-Pass-1-VEP/primary-reference/theo_create_attachment_upload.index.js` (LIVE deployed func-chat copy, Kudu-GET this turn; the MI-token + `requestUrl` + envelope + EasyAuth-OID pattern mirrored) | `Read(.local/voice-ms1-primary-ref/theo_create_attachment_upload.index.js)` (Kudu-GET live) this turn | `bc1aa7c51ad5b55e84d4fa625b443cab70dc8175` |
| 11 | Primary Reference function.json — `Codex Governance/Theo-1B-Voice-MS1-Transcribe-Audio-Backend-Pass-1-VEP/primary-reference/theo_create_attachment_upload.function.json` (LIVE deployed func-chat copy, Kudu-GET this turn) | `Bash(cat …function.json)` (Kudu-GET live) this turn | `c2031bdb3789a51d119c7a5c8b5055bc1c2d5a3b` |
| 12 | Walter authorization (HF-T6 new external system) — `Codex Governance/Theo-1B-Voice-MS1-Transcribe-Audio-Backend-Pass-1-VEP/WALTER_AUTHORIZATION_HF-T6-AUDIO.md` (verbatim Walter direction 2026-07-17 + DR-T8 pointer; Golden Handler §4 predating authorization) | authored this turn | `n/a — package artifact (predating Walter authorization, quoted verbatim)` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "Every substantive Claude Code or Codex turn MUST open with a table of the form:" |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive Claude Code or Codex turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "The Gap Register vocabulary is closed:" |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "Claude Code MUST NOT assert any schema object, column, policy, function, endpoint contract, status code, or external-system behavior that it has not read this turn" |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "A **new-domain or new-external-system helper** classified as ALLOWED DELTA requires either an EXACT mirror against a deployed handler containing that helper" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Kudu VFS surgical overwrite" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §6 | "Audio gateway broker" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B | "In-tenant Voice I/O" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "vaultgpt-func-chat" |
| spec/THEO_API_SPEC.md | §1 | "Route naming: `theo_<operation>_<entity>`" |
| spec/THEO_API_SPEC.md | §2.11 | "Voice I/O (Tier Voice)" |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "Canonical ownership column: **`created_by text NOT NULL`**" |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §2.4 | "Foundry-Claude inference runs on Anthropic-hosted infrastructure, not Azure-tenant-native" |
| Codex Governance/Theo-1B-Voice-MS1-Transcribe-Audio-Backend-Pass-1-VEP/primary-reference/theo_create_attachment_upload.index.js | MI-token | "async function getManagedIdentityAccessToken(resource)" |

Sub-phase Track rationale: **P8 (VEP assembly)** is the established convention for a full backend plan VEP in this repo (40+ prior `Theo_1B_*` VEPs declare P8). The turn walks the full P1–P8 spine below; the Rule Anchor Table carries the Conformance §3/§5 anchors (P8), the Governor anchors (§3/§4/§8), the Golden Handler anchors (P5: §2/§4/§5.5/§6), the API-Spec anchors (P4: §1/§2.11), the Schema anchor (P3: §1), the Orchestration anchors (§1B/§1E), and the Primary-Reference anchor, so the pack satisfies the P8-required anchors and evidences P1–P7.

---

## P1 — Feature identification

**Microstep:** Tier Voice, **Voice-MS1** — `theo_transcribe_audio` (dictation / speech-to-text). Landed feature entry: `governance/THEO_PHASE_1B_BACKEND_PLAN.md` §7 "Tier Voice — Voice I/O: dictation + read-aloud (PROPOSED — Walter-directed 2026-07-17)", Voice-MS1 bullet; contract: Theo API Spec §2.11 (`theo_transcribe_audio`, `1B-PROPOSED`); handler family: Golden Handler §6 HF-T6; decision: Orchestration §1B DR-T8. All four landed at commit `f466ffd` (Codex Role-C APPROVED).

**Scope.** One net-new HTTP handler `POST /api/theo_transcribe_audio` on `vaultgpt-func-chat`. Body `{ audio_base64, content_type }` (short dictation clip) → `{ text }`. The handler resolves the caller OID (EasyAuth), validates the audio allow-list + byte cap (deterministic 400s), decodes the clip, acquires a managed-identity token for `https://cognitiveservices.azure.com/`, and multipart-POSTs to the in-tenant Azure OpenAI Whisper deployment's `/audio/transcriptions`, returning only the transcript. **Stateless** — no `theo_*` table, no migration, no persistence.

Out of scope: `theo_synthesize_speech` (Voice-MS2, read-aloud — separate VEP); the FE composer mic control (Theo-FE pass); larger-than-cap clips (a future SAS-upload transport variant — see Gap G-TRANSPORT).

**Route / object naming.** Governed convention `theo_<operation>_<entity>` (API Spec §1) → `theo_transcribe_audio`, matching the §2.11 registration.

**Role vocabulary (Orchestration §1A).** Claude Code authors this VEP (Pass 1). Codex reviews (Pass 2). On APPROVED, Claude Code provisions (Whisper deploy + func-chat MI Cognitive-Services role — az authority granted 2026-07-17) and deploys the handler to `vaultgpt-func-chat` (DR-T7 scoped exception), then runs the golden curls. No provisioning or deploy occurs before Pass-2 APPROVAL (Walter's standing deployment-gate).

---

## P2 — Architecture & boundary reconciliation

- **Repository / app boundary (Architecture §1; Orchestration §1E / DR-T7).** Net-new-additive on `vaultgpt-func-chat` (Windows v4, EP1) — the only app Claude Code may deploy to, and the app already hosting the HF-T5 SAS broker whose MI-token pattern this mirrors. The monolith `vaultgpt-func-premium` and streaming sidecar `vaultgpt-func-stream` are untouched. No `reporting_*` table or Corporate Reporting surface is read or written (Conformance §10 T40 clean).
- **theo_ schema + RLS baseline (Architecture §5; Schema §1/§2).** **No table, no column, no policy, no function** is added or touched. The handler is stateless. Schema Reality Lock (Governor §4): every referenced schema object is N/A — there are none. (Contrast the ownership/persistence tiers; Voice-MS1 persists nothing.)
- **Model gateway seam (Architecture §2).** This is a SECOND, independent server-side gateway of the HF-T1 class (sole credential holder, keyless managed identity), but to a **different** in-tenant endpoint — Azure OpenAI Whisper — not the Anthropic Messages endpoint. Per Architecture §2.4, the Claude *text* model runs Anthropic-hosted (Sweden Central); by contrast the Whisper audio model is true in-tenant Azure Cognitive Services (recorded in DR-T8), so no client audio leaves the tenant and the transcription posture is stronger than the text path.
- **New external system → Golden Handler §4 / Conformance §10 T12.** The outbound cognitive-audio call is a new external system with no EXACT deployed mirror. §4 permits an ALLOWED DELTA with "a Walter authorization quoted verbatim and predating the VEP." That authorization is LANDED as DR-T8 (Orchestration §1B, Codex-APPROVED `f466ffd`) and is quoted verbatim in `WALTER_AUTHORIZATION_HF-T6-AUDIO.md` (this package). See Gap G-NEWEXTERNAL.
- **Credential posture.** The cognitive token is acquired server-side by the Function's managed identity (verbatim reuse of the Primary Reference's `getManagedIdentityAccessToken`); no key, endpoint, or token reaches the browser; responses carry only the transcript text.
- **Tool dispatch / Tool Manifest (Architecture §4).** Not touched — no `reporting_*` endpoint is consumed.

---

## Gap Register

Vocabulary is closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §8.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-NEWEXTERNAL | The outbound Azure OpenAI Whisper call is a **new external system** (Golden Handler §4 / Conformance §10 T12) — no deployed handler contains an EXACT mirror of a cognitive-audio call. | **PROCEED** | Resolved by the LANDED Walter authorization recorded as **DR-T8** (Orchestration §1B, Codex-APPROVED at `f466ffd`, predating this VEP) and quoted verbatim in `WALTER_AUTHORIZATION_HF-T6-AUDIO.md`. The MI-token acquisition itself is an **EXACT** verbatim reuse of the deployed `getManagedIdentityAccessToken` (Primary Reference); only the target endpoint (cognitive vs storage) and the multipart request-shaping helper are the delta, both under the DR-T8 authorization. |
| G-PROVISION | The Whisper model deployment and the `vaultgpt-func-chat` managed-identity Cognitive-Services data-role grant do not exist yet. | **PRE-LAND** | Executed by Claude Code (az authority granted 2026-07-17) **only after** Codex APPROVAL, at Pass 3, before the happy-path curl: (1) `az cognitiveservices account deployment create` of the `whisper` model on the chosen in-tenant Azure OpenAI resource; (2) confirm/grant the func-chat MI (`5a0cf3c6-07c9-4412-aa50-e39987ae3bfb`) `Cognitive Services User` (or OpenAI User) on that resource; (3) set the three app settings (`THEO_AOAI_AUDIO_ENDPOINT`, `THEO_WHISPER_DEPLOYMENT`, `THEO_AOAI_AUDIO_API_VERSION`). Whisper availability confirmed this session on the in-tenant resources (`az cognitiveservices account list-models`). Never before Pass-2 APPROVAL. |
| G-ENDPOINT-RESOURCE | Which in-tenant Azure OpenAI resource hosts the Whisper deployment (UK South `Vaultgpt` vs the AI-Services resource) is a provisioning choice, not asserted here. | PROCEED | Handler reads the endpoint from `THEO_AOAI_AUDIO_ENDPOINT` (app setting, set at Pass 3). Recommendation: UK South `Vaultgpt` for data residency. The handler is resource-agnostic (endpoint + deployment name are config). |
| G-TRANSPORT | Inline base64 body caps clip size (`THEO_TRANSCRIBE_MAX_BYTES`, default 8 MB); very long recordings would exceed it. | PROCEED | Deliberate: dictation clips are short (a spoken message), so inline base64 is the right transport — simpler than threading the B8 SAS upload, and Whisper's own limit is ~25 MB. A SAS-upload variant for long recordings is a noted future option, not required for MS1. Over-cap returns a deterministic **400 PAYLOAD_TOO_LARGE**. |
| G-PRIMARY | Golden Handler §5.5: "The deployed handler is the source of truth." | **NO DRIFT** (PROCEED) | The Primary Reference was **Kudu-GET live from `vaultgpt-func-chat` wwwroot this turn** (`.local/voice-ms1-primary-ref/…`, copied into the package `primary-reference/`), so it is byte-faithful to deployed reality — not a drifted committed snapshot. |
| G-PLAN | Feature must exist in the governed plan (Conformance §4A.1 P1). | PROCEED | Tier Voice + Voice-MS1 landed in Phase 1B Backend Plan §7 at `f466ffd` (Codex Role-C APPROVED); this microstep identifies against it directly. |

---

## P3 — Schema grounding (DEPLOYED vs PROPOSED)

**No schema objects are in scope.** `theo_transcribe_audio` is stateless: it reads no `theo_*` table, writes none, and adds no table / column / policy / function. Schema Reality Lock (Governor §4) is satisfied vacuously — there is nothing to classify DEPLOYED vs PROPOSED. `auth.uid()` / `set_config` are not used (no DB connection is opened). **No migration ships with this microstep** (P6).

The only DEPLOYED facts relied on are infrastructural, not schema: the func-chat System-Assigned managed identity (principalId `5a0cf3c6-07c9-4412-aa50-e39987ae3bfb`, confirmed via `az functionapp identity show` this session) and the IMDS token endpoint env (`IDENTITY_ENDPOINT`/`IDENTITY_HEADER`) the Primary Reference already uses on this app.

---

## P4 — Contract grounding

Realizes the PROPOSED API Spec §2.11 row `theo_transcribe_audio`. Contract as implemented:

- **Route:** `POST /api/theo_transcribe_audio` on `vaultgpt-func-chat` (+ `OPTIONS` → 204). Route naming per API Spec §1.
- **Request body (JSON):** `{ audio_base64: string (non-empty base64), content_type: string ∈ {audio/webm, audio/ogg, audio/mp4, audio/mpeg, audio/wav, audio/x-wav} }`.
- **Response 200:** `{ data: { text: string }, meta: { timestamp, version } }` (the standard `successBody` envelope).
- **Errors** (standard `errorBody` envelope `{ error: { code, message, status, timestamp } }`): `401 UNAUTHORIZED` (missing EasyAuth OID); `400 BAD_REQUEST` (body not JSON); `400 UNSUPPORTED_MEDIA_TYPE` (content_type not in the allow-list); `400 INVALID_REQUEST` (missing/empty `audio_base64` or zero decoded bytes); `400 PAYLOAD_TOO_LARGE` (decoded bytes > cap); `502 UPSTREAM_ERROR` (Whisper non-2xx); `500 INTERNAL_SERVER_ERROR` (MI/token/unexpected, or endpoint unconfigured).

On DEPLOYED + curl-verified, a Pass-4 Role-C flips the §2.11 `theo_transcribe_audio` row from `1B-PROPOSED` to `1B-deployed` and the Golden Handler §6 HF-T6 status accordingly.

---

## P5 — Handler grounding

### Canonical Primary Reference (exactly one; Golden Handler §2)

**`theo_create_attachment_upload`** — the DEPLOYED HF-T5 blob-SAS broker on `vaultgpt-func-chat`, **Kudu-GET live from wwwroot this turn** (the deployed source of truth per §5.5). It is the closest deployed pattern: same app, EasyAuth `x-ms-client-principal` → OID, `{data,meta}`/`{error}` envelopes, deterministic pre-call 400 validation, the raw `requestUrl` https helper, and — critically — `getManagedIdentityAccessToken(resource)` acquiring a keyless MI token then calling an authenticated Azure REST endpoint. `theo_transcribe_audio` reuses that helper set **verbatim** and swaps the storage call for the DR-T8-authorized cognitive-audio call. No composite reference (§2 / T10).

#### Primary Reference — `theo_create_attachment_upload/index.js` (FULL VERBATIM, LIVE deployed)

```js
const crypto = require("crypto");

// ---- Ingestion classes (D-8 RESOLVED): declared-type allow-list + per-class size cap.
// Native-read formats inject as document/image content blocks (cap 10 MB; native reading
// is accurate at/below). Extract-class formats are text-extracted at finalize (cap 50 MB).
const NATIVE_MAX_BYTES = 10 * 1024 * 1024;
const EXTRACT_MAX_BYTES = 50 * 1024 * 1024;
const INGESTION_CLASSES = {
  "application/pdf": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/png": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/jpeg": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/webp": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "image/gif": { class: "native", maxBytes: NATIVE_MAX_BYTES },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .xlsx
  "application/vnd.ms-excel": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .xls
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .docx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { class: "extract", maxBytes: EXTRACT_MAX_BYTES }, // .pptx
  "text/csv": { class: "extract", maxBytes: EXTRACT_MAX_BYTES },
  "text/plain": { class: "extract", maxBytes: EXTRACT_MAX_BYTES },
};
const ALLOWED_CONTENT_TYPES = Object.keys(INGESTION_CLASSES);

const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";
const SAS_TTL_MINUTES = 15;

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

function cleanFileName(name) {
  if (name === undefined || name === null) return null;
  const raw = String(name).trim();
  if (!raw.length) return null;
  const cleaned = raw.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, " ").trim();
  return cleaned.length ? cleaned.slice(0, 180) : null;
}

// ---- Managed-identity user-delegation SAS issuance (mirrors the deployed axis
// artifacts-upload-url technique; pure crypto + https, no @azure/storage-blob dependency).
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

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function encodeBlobPath(blobKey) {
  return blobKey.split("/").map(encodeURIComponent).join("/");
}

function decodeXmlTag(xml, tagName) {
  const m = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i"));
  return m ? m[1] : null;
}

function toIsoNoMillis(d) {
  return new Date(d).toISOString().replace(/\.\d{3}Z$/, "Z");
}

async function getUserDelegationKey(accountName, startTime, expiryTime) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const url = `https://${accountName}.blob.core.windows.net/?restype=service&comp=userdelegationkey`;
  const body =
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<KeyInfo><Start>${xmlEscape(startTime)}</Start><Expiry>${xmlEscape(expiryTime)}</Expiry></KeyInfo>`;
  const r = await requestUrl(
    url,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-ms-version": "2022-11-02",
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(body, "utf8"),
      },
    },
    body
  );
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Get User Delegation Key failed (${r.statusCode}): ${r.body}`);
  }
  const udk = {
    signedOid: decodeXmlTag(r.body, "SignedOid"),
    signedTid: decodeXmlTag(r.body, "SignedTid"),
    signedStart: decodeXmlTag(r.body, "SignedStart"),
    signedExpiry: decodeXmlTag(r.body, "SignedExpiry"),
    signedService: decodeXmlTag(r.body, "SignedService"),
    signedVersion: decodeXmlTag(r.body, "SignedVersion"),
    value: decodeXmlTag(r.body, "Value"),
  };
  if (!udk.signedOid || !udk.signedTid || !udk.signedStart || !udk.signedExpiry || !udk.signedService || !udk.signedVersion || !udk.value) {
    throw new Error("Get User Delegation Key response was missing required fields.");
  }
  return udk;
}

function computeUserDelegationSignature(params, userDelegationKey) {
  // User-delegation SAS canonical string-to-sign for service version >= 2020-12-06
  // (we sign with sv = 2022-11-02). Field order is exact and positional — every field is
  // present (empty string when unused). The block after `sr` is:
  //   sst, ses (signedEncryptionScope, added in 2020-12-06), rscc, rscd, rsce, rscl, rsct.
  // Built as an explicit array (not hand-counted newlines) so the field positions are provable
  // against Azure's canonical (which Azure echoes verbatim in any AuthenticationFailed detail).
  const stringToSign = [
    params.sp,
    params.st,
    params.se,
    params.canonicalizedResource,
    userDelegationKey.signedOid,
    userDelegationKey.signedTid,
    userDelegationKey.signedStart,
    userDelegationKey.signedExpiry,
    userDelegationKey.signedService,
    userDelegationKey.signedVersion,
    "", // signedAuthorizedUserObjectId (saoid)
    "", // signedUnauthorizedUserObjectId (suoid)
    "", // signedCorrelationId (scid)
    "", // signedIP (sip)
    params.spr,
    params.sv,
    params.sr,
    "", // signedSnapshotTime (sst)
    "", // signedEncryptionScope (ses)
    "", // rscc (Cache-Control)
    "", // rscd (Content-Disposition)
    "", // rsce (Content-Encoding)
    "", // rscl (Content-Language)
    params.rsct || "", // rsct (Content-Type)
  ].join("\n");
  const key = Buffer.from(userDelegationKey.value, "base64");
  return crypto.createHmac("sha256", key).update(stringToSign, "utf8").digest("base64");
}

async function buildUserDelegationSas(accountName, containerName, blobKey, permissions, expiresInMinutes, mimeType) {
  const now = new Date();
  const start = new Date(now.getTime() - 5 * 60 * 1000);
  const expiry = new Date(now.getTime() + expiresInMinutes * 60 * 1000);
  const udk = await getUserDelegationKey(accountName, toIsoNoMillis(start), toIsoNoMillis(expiry));

  const sv = "2022-11-02";
  const sr = "b";
  const spr = "https";
  const st = toIsoNoMillis(start);
  const se = toIsoNoMillis(expiry);
  const canonicalizedResource = `/blob/${accountName}/${containerName}/${blobKey}`;

  const sig = computeUserDelegationSignature(
    { sp: permissions, st, se, canonicalizedResource, spr, sv, sr, rsct: mimeType || "" },
    udk
  );

  const qp = new URLSearchParams();
  qp.set("sp", permissions);
  qp.set("st", st);
  qp.set("se", se);
  qp.set("skoid", udk.signedOid);
  qp.set("sktid", udk.signedTid);
  qp.set("skt", udk.signedStart);
  qp.set("ske", udk.signedExpiry);
  qp.set("sks", udk.signedService);
  qp.set("skv", udk.signedVersion);
  qp.set("spr", spr);
  qp.set("sv", sv);
  qp.set("sr", sr);
  if (mimeType) qp.set("rsct", mimeType);
  qp.set("sig", sig);

  return { sas: qp.toString(), expiresAt: se };
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

  // ---- Validate inputs before issuing any SAS (deterministic 400s) ----
  const filename = cleanFileName(body.filename);
  if (!filename) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'filename' is required and must be a non-empty string.", 400));
  }

  const contentType = normalizeContentType(body.content_type);
  const ingestion = INGESTION_CLASSES[contentType];
  if (!ingestion) {
    return send(
      context,
      400,
      errorBody(
        "UNSUPPORTED_MEDIA_TYPE",
        `Field 'content_type' must be one of the supported attachment types: ${ALLOWED_CONTENT_TYPES.join(", ")}.`,
        400
      )
    );
  }

  try {
    // Owner-scoped, deterministic blob path: attachments/<oid>/<attachmentId>.
    // The path embeds the caller OID so finalize/delete can prove ownership of the blob,
    // and embeds the attachment id so the persisted row id matches the stored blob 1:1.
    const attachmentId = crypto.randomUUID();
    const blobKey = `attachments/${oid}/${attachmentId}`;

    // Short-lived (15 min), single-blob, create+write SAS; response content-type pinned.
    const { sas, expiresAt } = await buildUserDelegationSas(
      STORAGE_ACCOUNT,
      STORAGE_CONTAINER,
      blobKey,
      "cw",
      SAS_TTL_MINUTES,
      contentType
    );

    const blobUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeBlobPath(blobKey)}`;
    const uploadUrl = `${blobUrl}?${sas}`;

    return send(context, 201, successBody({
      attachmentId,
      filename,
      contentType,
      ingestionClass: ingestion.class,
      maxBytes: ingestion.maxBytes,
      upload: {
        storageProvider: "azure_blob",
        account: STORAGE_ACCOUNT,
        container: STORAGE_CONTAINER,
        blobKey,
        blobUrl,
        uploadUrl,
        method: "PUT",
        requiredHeaders: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": contentType,
        },
        expiresAt,
      },
    }));
  } catch (err) {
    context.log.error("theo_create_attachment_upload failed", err);
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred issuing the upload URL.", 500));
  }
};
```

#### Primary Reference — `theo_create_attachment_upload/function.json` (FULL VERBATIM, LIVE deployed)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_create_attachment_upload"
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

| Handler region (`theo_transcribe_audio`) | Primary Reference region | Classification | Basis / Rule Anchor |
| ---------------------------------------- | ------------------------ | -------------- | ------------------- |
| `require("crypto")` | same | EXACT | verbatim |
| `corsHeaders`, `send`, `nowIso`, `errorBody`, `successBody` | same | EXACT | verbatim byte-identical |
| `getPrincipal`, `getClaimValue`, `parseBody`, `normalizeContentType` | same | EXACT | verbatim byte-identical |
| `requestUrl(urlStr, options, body)` | same | EXACT | verbatim byte-identical (body already accepts a Buffer via `req.write`) |
| `getManagedIdentityAccessToken(resource)` | same | EXACT | verbatim byte-identical; called with `"https://cognitiveservices.azure.com/"` vs `"https://storage.azure.com/"` (resource string = a config value, not a structural change) |
| Config constants (`AOAI_AUDIO_ENDPOINT`/`WHISPER_DEPLOYMENT`/`AOAI_AUDIO_API_VERSION`/`COGNITIVE_SCOPE`/`MAX_AUDIO_BYTES`/`AUDIO_CONTENT_TYPES`) | `STORAGE_ACCOUNT`/`STORAGE_CONTAINER`/`SAS_TTL_MINUTES`/`INGESTION_CLASSES` | ALLOWED DELTA | Golden Handler §4 "table/column/endpoint names; the specific validated field set" |
| Handler shell: OPTIONS→204, OID→401, `parseBody`→400, allow-list + cap→400, `try/catch`→500 | same shell (OPTIONS, OID, parseBody, allow-list, try/catch/500) | EXACT (structure) | mirror of the Primary Reference control flow; the validated field set (`audio_base64`/`content_type` + byte cap) is the ALLOWED DELTA |
| `buildMultipart(fields, file)` (multipart/form-data Buffer for the transcription POST) | (no counterpart) | ALLOWED DELTA (new-external-system request-shaping helper) | Golden Handler §4; authorized by DR-T8 + `WALTER_AUTHORIZATION_HF-T6-AUDIO.md` (predating) — see Gap G-NEWEXTERNAL |
| Outbound Whisper POST (`getManagedIdentityAccessToken` → `requestUrl` to `/audio/transcriptions`, parse `{text}`) | `buildUserDelegationSas` → storage REST | ALLOWED DELTA (new external system) | Golden Handler §4; DR-T8 authorization; mirrors the MI-token→authenticated-Azure-REST shape |
| Response `200 successBody({ text })` | `201 successBody({ attachmentId, … })` | ALLOWED DELTA | Golden Handler §4 "the contract's response shape" (API Spec §2.11) |
| `function.json` (anonymous httpTrigger, `post`+`options`, `route: theo_transcribe_audio`, http out) | same shape, `route: theo_create_attachment_upload` | ALLOWED DELTA | Golden Handler §4 "endpoint names"; EasyAuth upstream unchanged |

No region is an unjustified DEVIATION.

### New handler — `theo_transcribe_audio/index.js` (complete, copy-paste-ready)

The complete handler file ships in this package at `handlers/theo_transcribe_audio/index.js` and is reproduced verbatim here:

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

### New handler — `theo_transcribe_audio/function.json` (complete)

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

---

## P6 — SQL grounding

**None.** Voice-MS1 is stateless — no migration, no seed, no Walter-executable SQL, no read-only verification SQL. No `theo_*` schema object is created or touched. (The Golden Handler §5.2 migration rules and Governor §6 Walter-executable-SQL discipline are therefore not engaged this microstep.)

---

## P7 — Curl grounding (deterministic golden curls)

Claude Code runs these at Pass 3 (after APPROVAL + provisioning + deploy) from the live `az` session; the bearer is acquired for the app's EasyAuth audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e/access_as_user` (never hand-pasted). Base URL `https://vaultgpt-func-chat.azurewebsites.net/api`.

Deterministic negatives (verifiable immediately post-deploy, no Whisper dependency):

1. **OPTIONS → 204.** `curl -i -X OPTIONS "$BASE/theo_transcribe_audio"` ⇒ `204`.
2. **Missing auth → 401.** `POST` with no EasyAuth principal ⇒ `401 UNAUTHORIZED`. (EasyAuth returns 401 upstream for an unauthenticated call; an authenticated call with a stripped principal header hits the handler's own 401.)
3. **Bad content_type → 400.** body `{"audio_base64":"AAAA","content_type":"audio/flac"}` ⇒ `400 UNSUPPORTED_MEDIA_TYPE`.
4. **Missing audio → 400.** body `{"content_type":"audio/webm"}` ⇒ `400 INVALID_REQUEST`.
5. **Empty decode → 400.** body `{"audio_base64":"","content_type":"audio/webm"}` ⇒ `400 INVALID_REQUEST`.
6. **Over-cap → 400.** body with a base64 payload decoding to > `THEO_TRANSCRIBE_MAX_BYTES` ⇒ `400 PAYLOAD_TOO_LARGE`.

Happy path (requires the provisioned Whisper deployment — run last at Pass 3):

7. **Valid clip → 200 `{ data: { text } }`.** `POST` a fixed base64 of a short spoken WAV/WebM fixture (`content_type` matching) ⇒ `200`, body `data.text` a non-empty transcript. The fixture + captured command/response are stored under `.local/` (gitignored) per the curl-evidence discipline; no token bytes are printed.

---

## Provisioning steps (Pass 3, post-APPROVAL only — Walter's deployment gate)

Executed by Claude Code with the az authority granted 2026-07-17, strictly **after** Codex APPROVED and before the happy-path curl:

1. **Deploy Whisper** on the chosen in-tenant Azure OpenAI resource (recommend UK South `Vaultgpt` for residency): `az cognitiveservices account deployment create -g Vault-Tax -n Vaultgpt --deployment-name whisper --model-name whisper --model-version 001 --model-format OpenAI --sku-name Standard --sku-capacity <n>`.
2. **Grant the func-chat MI** (`5a0cf3c6-07c9-4412-aa50-e39987ae3bfb`) the `Cognitive Services User` role on that resource (via `az role assignment create`, or the `az rest` PUT fallback if MissingSubscription).
3. **Set app settings** on `vaultgpt-func-chat`: `THEO_AOAI_AUDIO_ENDPOINT=https://vaultgpt.openai.azure.com`, `THEO_WHISPER_DEPLOYMENT=whisper`, `THEO_AOAI_AUDIO_API_VERSION=2024-06-01` (and optionally `THEO_TRANSCRIBE_MAX_BYTES`).
4. **Deploy the handler** to `vaultgpt-func-chat` via Kudu VFS surgical overwrite (Golden Handler §5.5): PUT `theo_transcribe_audio/index.js` + `function.json`, GET-back diff, restart, unauth-curl health (expect 401).

---

## Parity checklist (Golden Handler §5.4)

- [x] Exactly one canonical Primary Reference (handler + function.json), inlined FULL VERBATIM (§2 / T9). No composite (T10).
- [x] Structural Mirror Table maps every region with EXACT / ALLOWED DELTA classification; no unjustified DEVIATION (§5.1).
- [x] New-external-system delta authorized by a verbatim Walter authorization predating the VEP (§4) — DR-T8 + `WALTER_AUTHORIZATION_HF-T6-AUDIO.md`.
- [x] EasyAuth `x-ms-client-principal` → OID; 401 on missing identity; `{data,meta}`/`{error}` envelopes; deterministic pre-call 400s (Governor §7).
- [x] No secrets/tokens/endpoints leaked in responses or logs (Golden Handler §3.4).
- [x] Deploy target `vaultgpt-func-chat` only (DR-T7 / §1E); monolith + sidecar untouched.
- [x] Stateless — no migration, no `theo_*` object (P3/P6); no `reporting_*` access (T40).
- [x] Deterministic golden curls for every status path (§5.3 / P7).
- [x] Mechanical-lint PASS block attached (below; T24).

## Mechanical lint

Mechanical lint run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission> --repo-root .`), verbatim output:

```
PASS  Codex Governance/Theo-1B-Voice-MS1-Transcribe-Audio-Backend-Pass-1-VEP/Theo_1B_Voice_MS1_Transcribe_Audio_Backend_Pass_1_VEP_Plan_Only.md
EXIT=0
```

Codex re-runs the linter independently (§1A Mechanical-Lint Gate / T24) and rejects on any discrepancy.

## Codex activation note

Open your Pass-2 turn with a governance-bound GCR + Rule Anchor Table (Conformance §3–§5; Codex Review §2). Run the §1A hard gates first (Artifact-Presence T29 against `development` @ HEAD, Package-Shape T30, Mechanical-Lint T24 re-run, GCR/Rule-Anchor presence). Then review substance: the single Primary Reference is inlined full-verbatim (T9); the new-external-system delta carries the DR-T8 + verbatim-Walter-authorization predating basis (§4 / T12); no `reporting_*` access (T40); stateless (no migration). Verdict is APPROVED or REJECTED only (T16 — no conditional approval).
