const { app } = require("@azure/functions");
const https = require("https");
const http = require("http");
const { Pool } = require("pg");
const { PassThrough } = require("node:stream");
// General-chat tool registry + HTTP dispatch (DR-T11): the model-callable tools this loop
// exposes to Claude + dispatches to vaultgpt-func-theo-tools as the signed-in user.
const { CHAT_TOOL_SCHEMAS, isChatTool, isDownloadable, dispatchChatTool } = require("../engine/chat-tools");

// HTTP streaming must be explicitly enabled in the v4 Node model (proven on Windows EP1, Gate 2).
app.setup({ enableHttpStream: true });

const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT;
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MAX_TOKENS = 4096;
const TITLE_MAX_LEN = 80;
// Agentic tool-loop bound (DR-T11): max model<->tool round-trips per user turn.
const MAX_TOOL_TURNS = parseInt(process.env.THEO_MAX_TOOL_TURNS, 10) > 0 ? parseInt(process.env.THEO_MAX_TOOL_TURNS, 10) : 8;

// Vault Theo Operating Ruleset (governance/THEO_OPERATING_RULESET.md). Injected server-side as the
// LEADING system block every turn (ahead of memory + history + the client system prompt) so it is
// mandatory and non-bypassable. Keep byte-identical to the governed doc; bump the version on change.
const THEO_RULESET_VERSION = "vault-theo-rules v1.2";
const THEO_RULESET = `
You are Theo, Vault's AI assistant for tax and advisory work, used by Vault's tax professionals as a research and drafting aid. Your output is always reviewed before it is relied on. You have live web search/fetch tools, and you receive the user's own materials (uploaded documents, the active workpaper/engagement context). You do not otherwise reach into client systems or data. Accuracy, grounded in retrievable sources, is your highest priority — above being comprehensive, fast, or agreeable.

GROUNDING — BE SPECIFIC AND VERIFIED
You have search/fetch tools; use them. For any specific authority or figure — an IRC § (26 U.S.C.), a Treasury Reg (26 C.F.R.; note proposed/temporary/final), an IRS Notice/Revenue Ruling/Revenue Procedure, a case, a rate, threshold, dollar amount, deadline, or effective date — retrieve and verify it THIS TURN, then cite it precisely. Do not assert these specifics from training or unaided recall, and do not go vague to avoid them: the right move is to look it up and cite it, not to hedge.
- Prefer primary/official sources (the Code, Regs, IRS.gov, official opinions) over secondary commentary; say when you rely on secondary. Be tax-year/date aware, flag fast-moving areas (Pillar 2, GILTI/FTC, digital assets), and note when a source may be superseded.
- Never fabricate a citation, section/ruling number, case, rate, or date. If you cannot verify a specific, say "I couldn't verify this — confirm against [authority]." "I don't have a verified source for that" is a good answer; a confident invented one is the worst possible outcome.

REAL-TIME & CURRENT FACTS — ALWAYS SEARCH, NEVER RECALL (ALL TOPICS, NOT ONLY TAX)
Your training has a fixed cutoff, so you do NOT know anything that is current or changes over time — live scores or results, prices/markets, breaking or recent news, weather, elections/appointments, "today"/"now"/"currently"/"latest"/"this week/month/year" anything, or any fact a person could look up right now. This applies to EVERY topic, not only tax. For ANY such question you MUST use your web search tool THIS TURN and ground the answer in what it returns, with citations.
- If you did not search, could not, or it returned nothing usable, say plainly "I don't have a verified answer for that — want me to look it up?" and stop. Do NOT state a specific current fact (a score, result, figure, date, name, or outcome) from memory, however confident it feels or however plausibly you can describe it. A fluent, specific, invented answer is the worst possible outcome — worse than "I don't know yet" — because it reads exactly like a verified one.
- Being agreeable, fast, or impressive never justifies an unverified specific; when unsure whether something is current or externally verifiable, search.

DOCUMENTS THE USER PROVIDES — VERIFY, DON'T INFER
Apply the same verify-before-asserting discipline to the user's own documents (uploaded files, workpapers) as to tax authorities. Any claim that a specific clause, section number, defined term, representation, party, figure, or date is present, absent, or says X is a claim you MUST ground in the provided text: locate and quote (or precisely cite) the exact passage before asserting it.
- If you cannot find it in the text you have, say so plainly — "I can't locate that in the document text provided" — and flag that the text may be incomplete or truncated. NEVER infer a document's contents, or that a provision is missing, from what typical or standard documents contain. A confident claim about a document you have not actually located in the text is the same failure as a fabricated citation.
- When the user questions or challenges a claim ("are you sure?", "is that right?", "same as the template?"), treat it as a signal to RE-VERIFY, not to agree. Go back to the source, find and quote the relevant passage, then confirm or correct based on that evidence. Do not flip your answer or capitulate merely to be agreeable — a challenge is never a cue to change your answer without checking.

MATERIALITY FIRST — ANALYZE WHAT THE FACTS TRIGGER (NO RABBIT HOLES)
- Lead with the transaction's form and intended tax treatment, then the primary consequences. Order: (1) form & intended treatment (e.g., §368, §351, asset sale, §1001), (2) primary consequences to each party, (3) cross-border/anti-abuse overlays the facts clearly trigger, (4) remote/contingent overlays — brief and labeled.
- Before raising any special regime (FIRPTA/USRPHC, §1446(f), §367, §7874, PFIC, CFC/GILTI, Pillar 2, etc.): state its factual trigger in one line, check whether the user's facts show it, and if not, label it "not indicated by the facts — contingent overlay" and keep it a short aside (≤ ~15% of the answer). Don't call a regime "key" unless its trigger is present, and once parked, don't re-inflate it later.
- The space you give an issue should track its materiality to THESE facts. Where facts are silent, you may offer a clearly-labeled prior ("funds like this often hold minimal US real property, so FIRPTA is usually not in play — but confirm from the asset facts"), never a fact.

SHOW YOUR WORK (AUDITABLE)
- For each substantive conclusion: the authority (precise cite) → what it says → how it applies to these facts → the conclusion. A reviewer should be able to trace every conclusion to its source. Cite at the claim, not as a trailing list.
- State the facts and assumptions you relied on; if a needed fact is missing, ask or assume-and-flag. Mark confidence where it matters (high confidence / fact-dependent / low-probability absent more facts).
- For partnership/fund transactions keep the parties distinct — corporate parties, the selling fund/partnership, partner/LP consequences (US vs non-US), and the withholding agent's obligations. Never conflate buyer withholding with LP tax consequences.
- When given a document or excerpt, anchor to it: what it establishes, what it does not, and analyze only what follows from it unless the user supplies the missing facts.

TONE AND FORMAT
- Warm, calm, precise, direct. Correct mistakes gently with explanation; do not people-please or agree just to be agreeable; no flattery; stay composed if the user is frustrated. Truth and clarity over soothing.
- Respond in clean Markdown: lead with the answer, then the support. Short questions get a short answer; complex ones get light structure (brief summary → details → next steps / what to verify). Use headings/bullets/tables when they aid scanning, not by default. Plain text if asked.
- Be as concise as accuracy allows. Don't bury the answer, and don't dump raw chain-of-thought — give clear, human-readable reasoning.
`;

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

// Extended thinking. DEFAULT = "adaptive" (Claude decides depth per task, self-scaling to difficulty)
// with an `effort` ceiling — the modern replacement for the deprecated fixed budget_tokens on
// claude-sonnet-4-6 (Foundry deployment; verified accepted). Adaptive streams a continuous,
// task-proportional thinking_delta phase (~40-140s on hard tasks; ~seconds on trivial ones), relayed
// VERBATIM to the client, which is what gives the live "Thinking… Nk tokens" climb (VA-T7) during the
// otherwise-dead wait before a tool_use. Thinking is NOT persisted as message content (ephemeral).
// THEO_THINKING_MODE: "adaptive" (default) | "enabled" (legacy fixed budget) | "off".
// THEO_THINKING_EFFORT: low | medium (default) | high — the adaptive ceiling; high can consume the
// whole max_tokens on hard prompts, so the tool-loop floor below is sized with headroom for it.
const THINKING_MODE = (process.env.THEO_THINKING_MODE || "adaptive").trim().toLowerCase();
const THINKING_EFFORT = (process.env.THEO_THINKING_EFFORT || "medium").trim().toLowerCase();
const THINKING_BUDGET = parsePositiveInt(process.env.THEO_THINKING_BUDGET_TOKENS, 0); // legacy "enabled" mode only

// Plan-before-tool nudge (func-stream tool-loop only; NOT in the shared THEO_OPERATING_RULESET, so the
// monolith is untouched). A file-building tool call (e.g. theo_export_spreadsheet) is a MECHANICAL task
// the model would otherwise do with almost no deliberation — so adaptive thinking self-scales to ~0 and
// there is nothing to stream during the wait. This asks the model to reason through the file's structure
// FIRST, which (a) streams a visible thinking phase the FE can show (the "watch it work" experience) and
// (b) yields a better-structured file. Scoped to file/document-building tools; quick lookups are exempt.
const TOOL_PLANNING_SYSTEM = `
PLAN BEFORE BUILDING A FILE WITH A TOOL
When a request will produce a document, spreadsheet, or other file via a tool (e.g. theo_export_spreadsheet), reason through the structure BEFORE calling the tool: what sheets/sections it needs, the columns and their types, and how each source item (each reported box, figure, or field) maps to a specific typed cell — noting anything ambiguous and how you resolve it. Then call the tool with the planned structure. This planning is part of the work: it produces a correct, well-structured file rather than a hasty one. (This applies only to tools that build a file/document; quick lookups such as web search need no such preamble.)
`;

// History-RAG (B7b-2): embedding + Azure AI Search config. When unset, history recall is silently
// skipped (non-fatal — never breaks chat).
const EMBED_ENDPOINT = (process.env.THEO_EMBED_ENDPOINT || "").replace(/\/+$/, "");
const EMBED_DEPLOYMENT = process.env.THEO_EMBED_DEPLOYMENT;
const EMBED_API_VERSION = process.env.THEO_EMBED_API_VERSION || "2023-05-15";
const SEARCH_ENDPOINT = (process.env.THEO_SEARCH_ENDPOINT || "").replace(/\/+$/, "");
const SEARCH_INDEX = process.env.THEO_SEARCH_INDEX || "theo-messages";
const SEARCH_API_VERSION = process.env.THEO_SEARCH_API_VERSION || "2023-11-01";
const EMBED_SCOPE = "https://cognitiveservices.azure.com/.default";
const SEARCH_SCOPE = "https://search.azure.com/.default";
const HISTORY_TOP_K = parsePositiveInt(process.env.THEO_HISTORY_TOP_K, 5);
const HISTORY_QUERY_MAX_CHARS = 8000;

// Attachments (B8d): blob lives in theo-content; read via the Function's managed identity
// (Storage Blob Data Contributor). Native (PDF/image) inject as document/image content blocks;
// extract-class inject the stored extracted text. Budgets bound the upstream payload.
const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";
const ATTACH_MAX_COUNT = parsePositiveInt(process.env.THEO_ATTACH_MAX_COUNT, 10);
const ATTACH_NATIVE_BUDGET_BYTES = parsePositiveInt(process.env.THEO_ATTACH_NATIVE_BUDGET_BYTES, 14 * 1024 * 1024);
const ATTACH_EXTRACT_BUDGET_CHARS = parsePositiveInt(process.env.THEO_ATTACH_EXTRACT_BUDGET_CHARS, 200000);
const NATIVE_MEDIA_TYPES = {
  "application/pdf": "document",
  "image/png": "image",
  "image/jpeg": "image",
  "image/webp": "image",
  "image/gif": "image",
};

// Persistence pool (Family-B pattern; shared `vaultgpt` instance). The shared Functions connection
// role bypasses RLS, so per-user isolation is enforced by explicit `created_by = $oid` predicates on
// every query below (never by RLS alone) — set_config still establishes the request identity.
const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return { error: { code, message, status, timestamp: nowIso() } };
}

// Extract the EasyAuth client principal (v4: headers is a Headers object — use .get()).
function getPrincipal(request) {
  const raw = request.headers.get("x-ms-client-principal");
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

function getOboInputToken(request) {
  const raw = request.headers.get("authorization");
  const m = raw && typeof raw === "string" ? raw.match(/^Bearer\s+(.+)$/i) : null;
  if (m && m[1]) return m[1].trim();
  const store = request.headers.get("x-ms-token-aad-access-token");
  if (typeof store === "string" && store.trim() !== "") return store.trim();
  return null;
}

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  err.isKnown = true;
  return err;
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
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
    const lib = url.protocol === "http:" ? http : https;

    const req = lib.request(
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

// Binary HTTP GET (collects Buffer chunks; must NOT string-coerce — attachment blobs are binary).
function requestBinary(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
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
        res.on("end", () => {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: Buffer.concat(chunks) });
        });
      }
    );
    req.on("error", reject);
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

// Client-credentials token for an arbitrary Azure resource scope (same AAD app as the gateway).
async function getAadToken(scope) {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing required AAD client-credentials configuration.");
  }
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope,
  }).toString();
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(
    tokenUrl,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } },
    form
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    throw new Error(`Token request failed for scope ${scope} (HTTP ${r.statusCode}).`);
  }
  return payload.access_token;
}

// Embed a single query string → 1536-d vector (text-embedding-3-small).
async function embedQuery(embedToken, text) {
  const body = JSON.stringify({ input: text });
  const r = await requestUrl(
    `${EMBED_ENDPOINT}/openai/deployments/${encodeURIComponent(EMBED_DEPLOYMENT)}/embeddings?api-version=${EMBED_API_VERSION}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${embedToken}`, "Content-Length": Buffer.byteLength(body) },
    },
    body
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.data) || !payload.data[0]) {
    throw new Error(`embedQuery failed (HTTP ${r.statusCode}).`);
  }
  return payload.data[0].embedding;
}

// Hybrid (vector + keyword) search over the user's OWN indexed messages. created_by filter is the
// isolation boundary; the current conversation is excluded so we recall PAST discussions only.
async function searchHistory(searchToken, queryText, queryVector, ownerOid, excludeConversationId) {
  let filter = `created_by eq '${ownerOid.replace(/'/g, "''")}'`;
  if (excludeConversationId) {
    filter += ` and conversation_id ne '${excludeConversationId.replace(/'/g, "''")}'`;
  }
  const body = JSON.stringify({
    search: queryText,
    filter,
    top: HISTORY_TOP_K,
    select: "role,content,created_at",
    vectorQueries: [{ kind: "vector", vector: queryVector, fields: "content_vector", k: HISTORY_TOP_K }],
  });
  const r = await requestUrl(
    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(SEARCH_INDEX)}/docs/search?api-version=${SEARCH_API_VERSION}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${searchToken}`, "Content-Length": Buffer.byteLength(body) },
    },
    body
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.value)) {
    throw new Error(`searchHistory failed (HTTP ${r.statusCode}).`);
  }
  return payload.value;
}

// Managed-identity token (Storage data-plane). Distinct from the AAD client-credentials app above:
// blob reads use the Function's system-assigned identity (Storage Blob Data Contributor).
async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error("Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing).");
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    throw new Error(`Managed Identity token endpoint failed (HTTP ${r.statusCode}).`);
  }
  return payload.access_token;
}

function encodeBlobPath(blobKey) {
  return blobKey.split("/").map(encodeURIComponent).join("/");
}

function blobUrlFor(blobKey) {
  return `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeBlobPath(blobKey)}`;
}

async function downloadBlobBinary(storageToken, blobKey) {
  const r = await requestBinary(blobUrlFor(blobKey), {
    method: "GET",
    headers: { Authorization: `Bearer ${storageToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`GET blob (binary) failed (HTTP ${r.statusCode}).`);
  }
  return r.body; // Buffer
}

async function downloadBlobText(storageToken, blobKey) {
  const r = await requestUrl(blobUrlFor(blobKey), {
    method: "GET",
    headers: { Authorization: `Bearer ${storageToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`GET blob (text) failed (HTTP ${r.statusCode}).`);
  }
  return r.body; // string
}

// Build Anthropic content blocks for the owned attachment rows, honouring the size/char budgets.
// Native (PDF/image) → document/image base64 block; extract-class → text block (stored extracted
// text); unreadable → a short text note. Per-attachment failures degrade to a note (never throw).
async function buildAttachmentBlocks(context, rows) {
  if (!rows.length) return [];
  let storageToken;
  try {
    storageToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  } catch (tokErr) {
    context.error("theo_message_stream: storage token for attachments failed (non-fatal)", tokErr);
    return rows.map((r) => ({ type: "text", text: `[Attached file "${r.filename}" could not be loaded.]` }));
  }

  const blocks = [];
  let nativeBytes = 0;
  let extractChars = 0;
  for (const row of rows) {
    // Honor finalize's classification — a row marked extract-class (e.g. a large PDF promoted to
    // text) injects its extracted text, not a giant document block, even though content_type is
    // application/pdf. Only non-extract rows with a native media type inject document/image blocks.
    const isExtractRow = row.ingestion_class === "extract"; // extract-class NEVER falls back to native (T13)
    const native = !isExtractRow && NATIVE_MEDIA_TYPES[row.content_type];
    try {
      if (native) {
        const buf = await downloadBlobBinary(storageToken, row.blob_path);
        nativeBytes += buf.length; // B8k: no cap — always inject the full file (Walter-directed)
        const b64 = buf.toString("base64");
        if (native === "document") {
          blocks.push({ type: "document", source: { type: "base64", media_type: row.content_type, data: b64 } });
        } else {
          blocks.push({ type: "image", source: { type: "base64", media_type: row.content_type, data: b64 } });
        }
        blocks.push({ type: "text", text: `(above is the attached file "${row.filename}")` });
      } else if (isExtractRow && row.extracted_text_path) {
        const text = await downloadBlobText(storageToken, row.extracted_text_path);
        extractChars += text.length; // B8k: no cap — inject the full extracted text (Walter-directed)
        blocks.push({ type: "text", text: `Attached file "${row.filename}" (${row.content_type}):\n\n${text}` });
      } else {
        blocks.push({ type: "text", text: `[Attached file "${row.filename}" (${row.content_type}) is stored but could not be read into this message.]` });
      }
    } catch (attErr) {
      context.error(`theo_message_stream: attachment ${row.id} load failed (non-fatal)`, attErr);
      blocks.push({ type: "text", text: `[Attached file "${row.filename}" could not be loaded.]` });
    }
  }
  return blocks;
}

// NOTE: the per-turn SSE parse that reconstructs the assistant turn for persistence now lives in
// relayTurnRaw (which both relays verbatim AND parses); the standalone parseSseForPersistence used by
// the old single-call relay was removed with the DR-T11 tool-loop conversion.

// Persist the completed turn (HF-T2; explicit created_by ownership; shared vaultgpt instance).
// Mirrors theo_message's persistence EXACTLY (incl. B8i message_seq linkage). Returns conversationId.
async function persistTurn(opts) {
  const { oid, requestedConversationId, appKey, appContext, userText, attachmentIds, acc } = opts;
  const assistantModel = acc.model || FOUNDRY_DEPLOYMENT;
  let client = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    let conversationId = requestedConversationId;
    if (conversationId) {
      const owned = await client.query(
        `SELECT id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
        [conversationId, oid]
      );
      if (owned.rowCount === 0) {
        const existsResult = await client.query(
          `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
          [conversationId]
        );
        const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
        throw exists
          ? buildKnownError("FORBIDDEN", "You do not have access to this conversation.", 403)
          : buildKnownError("NOT_FOUND", "Conversation not found.", 404);
      }
    } else {
      const title = userText.trim().slice(0, TITLE_MAX_LEN) || "New chat";
      const created = await client.query(
        `
        INSERT INTO public.theo_conversations (created_by, title, model, app_key, app_context)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [oid, title, assistantModel, appKey, appContext != null ? JSON.stringify(appContext) : null]
      );
      conversationId = created.rows[0].id;
    }

    const seqResult = await client.query(
      `SELECT count(*)::int AS n FROM public.theo_messages WHERE conversation_id = $1 AND created_by = $2`,
      [conversationId, oid]
    );
    const baseSeq = seqResult.rows[0].n;

    // B8i: link the sent attachments to this conversation AND to the user-turn seq (owner-scoped;
    // only when not already linked) so a reloaded thread surfaces chips on the matching message.
    if (attachmentIds.length > 0) {
      await client.query(
        `
        UPDATE public.theo_attachments
        SET conversation_id = $1, message_seq = $2
        WHERE id = ANY($3::uuid[]) AND created_by = $4 AND conversation_id IS NULL
        `,
        [conversationId, baseSeq, attachmentIds, oid]
      );
    }

    await client.query(
      `
      INSERT INTO public.theo_messages (created_by, conversation_id, seq, role, content, model)
      VALUES ($1, $2, $3, 'user', $4, NULL)
      `,
      [oid, conversationId, baseSeq, userText]
    );

    await client.query(
      `
      INSERT INTO public.theo_messages (created_by, conversation_id, seq, role, content, model, citations)
      VALUES ($1, $2, $3, 'assistant', $4, $5, $6)
      `,
      [
        oid,
        conversationId,
        baseSeq + 1,
        acc.text,
        assistantModel,
        acc.citations.length ? JSON.stringify(acc.citations) : null,
      ]
    );

    await client.query(
      `UPDATE public.theo_conversations SET updated_at = now() WHERE id = $1 AND created_by = $2`,
      [conversationId, oid]
    );

    await client.query("COMMIT");
    return conversationId;
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Open ONE upstream Foundry Messages stream for the given conversation state. The tool set is the
// built-in grounding tools PLUS the general-chat tool schemas (DR-T11). Resolves the raw response
// (check statusCode) or null on a connect error.
function openUpstream({ messages, token, maxTokens, system, context }) {
  const upstreamPayload = JSON.stringify({
    model: FOUNDRY_DEPLOYMENT,
    max_tokens: maxTokens,
    ...(system ? { system } : {}),
    messages,
    tools: [...buildGroundingTools(), ...CHAT_TOOL_SCHEMAS],
    stream: true,
    ...(THINKING_MODE === "adaptive"
      ? { thinking: { type: "adaptive", display: "summarized" }, output_config: { effort: THINKING_EFFORT } }
      : THINKING_MODE === "enabled" && THINKING_BUDGET > 0
        ? { thinking: { type: "enabled", budget_tokens: THINKING_BUDGET } }
        : {}),
  });
  return new Promise((resolve) => {
    const u = new URL(`${FOUNDRY_BASE}/anthropic/v1/messages`);
    const lib = u.protocol === "http:" ? http : https;
    const r = lib.request(
      {
        method: "POST",
        hostname: u.hostname,
        port: u.port ? Number(u.port) : 443,
        path: u.pathname + u.search,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "anthropic-version": ANTHROPIC_VERSION,
          "anthropic-beta": WEB_FETCH_BETA,
          "Content-Length": Buffer.byteLength(upstreamPayload),
          Accept: "text/event-stream",
        },
      },
      (res) => resolve(res)
    );
    r.on("error", (e) => { if (context) context.error("theo_message_stream: upstream connect failed", e); resolve(null); });
    r.write(upstreamPayload);
    r.end();
  });
}

// Live token throttle: emit a running token estimate roughly every ~100 tokens of streamed content
// (VA-T7 "live token count"). Small enough to feel continuous, large enough not to flood the SSE.
const TOKEN_EMIT_CHAR_STEP = 400;

// Relay ONE upstream turn: forward the native Anthropic SSE to the client VERBATIM (the FE parses the
// native frames — this preserves the existing theo_message_stream wire contract) AND parse it to
// reconstruct the assistant content blocks (text + tool_use), stop_reason, citations, and model — used
// to decide/continue the tool-loop and to persist the turn.
//
// Live agent-activity augmentation (VA-T7, Claude-Code-style "watch it work"):
//   - `event: tool { name }` is emitted the instant a general-chat tool_use block STARTS (at
//     content_block_start, name known) — NOT after the whole tool_use JSON has streamed — so the FE
//     flips to the tool-aware verb ("Building your spreadsheet…") immediately instead of showing
//     rotating placeholder verbs for the whole ~minute the model spends emitting the tool_use payload.
//     No `input` is sent (it is still streaming and would render as a raw-JSON "code" row); the FE
//     shows a clean tool row + verb.
//   - `event: vault_tokens { tokens }` streams a running output-token count so the header climbs LIVE
//     during that otherwise-silent build (the tool_use payload arrives as input_json_delta, which is
//     invisible progress). The count is a char/4 estimate between turn boundaries, RECONCILED toward
//     the authoritative usage.output_tokens at each message_delta but CLAMPED to a monotonic floor
//     (tok.lastEmitted) — so it never decreases and may briefly OVERSTATE (it is an upper bound) until
//     the true cumulative catches up. `tok.realBefore` carries the exact prior-turn totals as the base.
// Resolves { assistantContent, stopReason, text, citations, model, turnOutputTokens }.
function relayTurnRaw(upstreamRes, stream, tok) {
  return new Promise((resolve) => {
    let buf = "";
    const blocks = {};
    let stopReason = null, model = null, text = "";
    let estChars = 0, lastEmitChars = 0, turnOutputTokens = 0;
    const citations = [];
    const realBefore = tok && Number.isInteger(tok.realBefore) ? tok.realBefore : 0;
    // Monotonic non-decreasing guarantee (the VA-T7 live counter must never tick backward): the char/4
    // estimate can overshoot the authoritative usage.output_tokens value at message_delta, so clamp
    // every emit to a running floor (tok.lastEmitted) carried across ALL turns. An overshoot plateaus
    // the count until the true cumulative catches up; it never decreases. This is what §5's curl asserts.
    const emitTokens = (tokens) => {
      const floor = tok && Number.isInteger(tok.lastEmitted) ? tok.lastEmitted : 0;
      const clamped = Math.max(floor, tokens);
      if (tok) tok.lastEmitted = clamped;
      try { stream.write(`event: vault_tokens\ndata: ${JSON.stringify({ tokens: clamped })}\n\n`); } catch {}
    };
    upstreamRes.setEncoding("utf8");
    upstreamRes.on("data", (chunk) => {
      stream.write(chunk); // verbatim relay — FE reads native frames
      buf += chunk;
      let sep;
      while ((sep = buf.indexOf("\n\n")) !== -1) {
        const frame = buf.slice(0, sep); buf = buf.slice(sep + 2);
        let ev = null, data = "";
        for (const line of frame.split("\n")) {
          if (line.startsWith("event:")) ev = line.slice(6).trim();
          else if (line.startsWith("data:")) data += line.slice(5).trim();
        }
        if (!data) continue;
        let d; try { d = JSON.parse(data); } catch { continue; }
        const t = d.type || ev;
        if (t === "message_start") { model = d.message && d.message.model; }
        else if (t === "content_block_start") {
          blocks[d.index] = { type: d.content_block.type, text: "", name: d.content_block.name, id: d.content_block.id, partialJson: "" };
          // Surface the tool the instant its block opens (name known; input still streaming), so the FE
          // shows the tool-aware verb during the build — not rotating placeholder verbs. Chat tools only.
          if (d.content_block && d.content_block.type === "tool_use" && isChatTool(d.content_block.name)) {
            try { stream.write(`event: tool\ndata: ${JSON.stringify({ name: d.content_block.name })}\n\n`); } catch {}
          }
        }
        else if (t === "content_block_delta") {
          const b = blocks[d.index] || (blocks[d.index] = { type: "text", text: "", partialJson: "" });
          if (d.delta.type === "text_delta") { b.text += d.delta.text; text += d.delta.text; estChars += d.delta.text.length; }
          else if (d.delta.type === "input_json_delta") { b.partialJson += d.delta.partial_json; estChars += d.delta.partial_json.length; }
          else if (d.delta.type === "thinking_delta" && typeof d.delta.thinking === "string") { estChars += d.delta.thinking.length; }
          else if (d.delta.type === "citations_delta" && d.delta.citation) { citations.push(d.delta.citation); }
          if (estChars - lastEmitChars >= TOKEN_EMIT_CHAR_STEP) { lastEmitChars = estChars; emitTokens(realBefore + Math.round(estChars / 4)); }
        }
        else if (t === "content_block_stop") { const b = blocks[d.index]; if (b && b.type === "tool_use") { try { b.input = b.partialJson ? JSON.parse(b.partialJson) : {}; } catch { b.input = {}; } } }
        else if (t === "message_delta") {
          if (d.delta && d.delta.stop_reason) stopReason = d.delta.stop_reason;
          if (d.usage && Number.isInteger(d.usage.output_tokens)) { turnOutputTokens = d.usage.output_tokens; emitTokens(realBefore + turnOutputTokens); }
        }
      }
    });
    upstreamRes.on("end", () => {
      const assistantContent = Object.keys(blocks).sort((a, b) => a - b).map((i) => {
        const b = blocks[i];
        if (b.type === "tool_use") return { type: "tool_use", id: b.id, name: b.name, input: b.input || {} };
        if (b.type === "text") return { type: "text", text: b.text };
        return null;
      }).filter(Boolean);
      resolve({ assistantContent, stopReason, text, citations, model: model || FOUNDRY_DEPLOYMENT, turnOutputTokens });
    });
    upstreamRes.on("error", () => resolve({ assistantContent: [], stopReason: "error", text, citations, model: model || FOUNDRY_DEPLOYMENT, turnOutputTokens }));
  });
}

app.http("theo_message_stream", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const jsonErr = (status, code, message) => ({
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      jsonBody: errorBody(code, message, status),
    });

    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    const principal = getPrincipal(request);
    const oid = getClaimValue(principal, [
      "http://schemas.microsoft.com/identity/claims/objectidentifier",
      "oid",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    ]);
    if (!oid) return jsonErr(401, "UNAUTHORIZED", "Missing or invalid EasyAuth identity.");
    if (!FOUNDRY_BASE || !FOUNDRY_DEPLOYMENT) {
      context.error("theo_message_stream: missing gateway configuration");
      return jsonErr(500, "INTERNAL_SERVER_ERROR", "Model gateway is not configured.");
    }

    let body;
    try {
      body = JSON.parse((await request.text()) || "{}");
    } catch {
      return jsonErr(400, "BAD_REQUEST", "Request body is not valid JSON.");
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonErr(400, "BAD_REQUEST", "Field 'messages' must be a non-empty array.");
    }

    let maxTokens = Number.isInteger(body.max_tokens) ? body.max_tokens : DEFAULT_MAX_TOKENS;
    // DR-T11 tool-loop: a tool_use block (e.g. a multi-sheet K-1 export payload) can be far larger than
    // a chat reply. The FE sends a chat-sized cap (~1500) and thinking bumps it only to ~4096 — which
    // truncates a real export mid-tool_use (stop_reason "max_tokens", never "tool_use"), so the loop
    // never dispatches and no card appears. Floor the ceiling so a tool_use can complete; normal replies
    // still stop at their natural end well below it (max_tokens is a ceiling, not a target — no cost/UX
    // change for ordinary chat). Overridable via env for headroom on very large workbooks.
    // Raised 16384 -> 32768 with adaptive thinking: adaptive can spend thousands of tokens on the
    // thinking phase BEFORE the tool_use, so the floor must leave room for thinking + a large tool_use
    // payload + the answer, or thinking starves the export mid-loop (observed: effort=high consumed an
    // entire 8k budget on thinking alone). 32768 covers thinking + a multi-sheet K-1 export + reply.
    const TOOL_LOOP_MIN_MAX_TOKENS = parsePositiveInt(process.env.THEO_TOOL_LOOP_MAX_TOKENS, 32768);
    if (maxTokens < TOOL_LOOP_MIN_MAX_TOKENS) maxTokens = TOOL_LOOP_MIN_MAX_TOKENS;
    const systemPrompt = typeof body.system === "string" ? body.system : null;

    const requestedConversationId =
      typeof body.conversation_id === "string" && body.conversation_id.trim() !== ""
        ? body.conversation_id.trim()
        : null;
    const appKey =
      typeof body.app_key === "string" && body.app_key.trim() !== "" ? body.app_key.trim() : null;
    const appContext =
      body.app_context != null && typeof body.app_context === "object" ? body.app_context : null;

    const lastUserIndex = (() => {
      for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i];
        if (m && m.role === "user" && typeof m.content === "string") return i;
      }
      return -1;
    })();
    const userText = lastUserIndex >= 0 ? messages[lastUserIndex].content : "";

    if (requestedConversationId !== null && !isUuid(requestedConversationId)) {
      return jsonErr(400, "BAD_REQUEST", "Field 'conversation_id' must be a valid UUID.");
    }

    let attachmentIds = [];
    if (body.attachment_ids != null) {
      if (!Array.isArray(body.attachment_ids)) {
        return jsonErr(400, "BAD_REQUEST", "Field 'attachment_ids' must be an array of UUIDs.");
      }
      attachmentIds = [...new Set(body.attachment_ids)];
      if (attachmentIds.length > ATTACH_MAX_COUNT) {
        return jsonErr(400, "BAD_REQUEST", `At most ${ATTACH_MAX_COUNT} attachments may be sent per message.`);
      }
      if (!attachmentIds.every((id) => isUuid(id))) {
        return jsonErr(400, "BAD_REQUEST", "Every entry in 'attachment_ids' must be a valid UUID.");
      }
      if (attachmentIds.length > 0 && lastUserIndex < 0) {
        return jsonErr(400, "BAD_REQUEST", "Attachments require a user message with text content.");
      }
    }

    // ---- Memory injection (B7): prepend the user's distilled memory profile to the system prompt ----
    let memoryBlock = "";
    {
      let memClient = null;
      try {
        memClient = await pool.connect();
        await memClient.query(
          `
          SELECT
            set_config('app.current_user_id', $1, false),
            set_config('request.jwt.claim.sub', $1, false),
            set_config('request.jwt.claim.oid', $1, false)
          `,
          [oid]
        );
        const mem = await memClient.query(
          `
          SELECT content
          FROM public.theo_user_memory
          WHERE created_by = $1 AND scope = 'user'
          ORDER BY salience DESC, updated_at DESC, id DESC
          LIMIT 50
          `,
          [oid]
        );
        if (mem.rowCount > 0) {
          memoryBlock =
            "Saved memory about this user (apply when relevant; do not recite verbatim):\n" +
            mem.rows.map((r) => `- ${r.content}`).join("\n");
        }
      } catch (memErr) {
        context.error("theo_message_stream: memory fetch failed (non-fatal)", memErr);
      } finally {
        if (memClient) {
          memClient.release();
        }
      }
    }

    // ---- History-RAG injection (B7b-2): recall relevant excerpts from the user's PAST conversations ----
    let historyBlock = "";
    if (EMBED_ENDPOINT && EMBED_DEPLOYMENT && SEARCH_ENDPOINT && userText.trim() !== "") {
      try {
        const [embedToken, searchToken] = await Promise.all([getAadToken(EMBED_SCOPE), getAadToken(SEARCH_SCOPE)]);
        const queryVector = await embedQuery(embedToken, userText.slice(0, HISTORY_QUERY_MAX_CHARS));
        const hits = await searchHistory(searchToken, userText.slice(0, HISTORY_QUERY_MAX_CHARS), queryVector, oid, requestedConversationId);
        const lines = hits
          .map((h) => (typeof h.content === "string" ? h.content.trim() : ""))
          .filter((c) => c !== "")
          .map((c) => `- ${c.slice(0, 500)}`);
        if (lines.length > 0) {
          historyBlock =
            "Relevant excerpts from this user's earlier conversations (context only; may be unrelated — use if helpful, do not assume continuity):\n" +
            lines.join("\n");
        }
      } catch (histErr) {
        context.error("theo_message_stream: history-RAG retrieval failed (non-fatal)", histErr);
      }
    }

    context.log("theo ruleset " + THEO_RULESET_VERSION);
    const effectiveSystem =
      [THEO_RULESET, TOOL_PLANNING_SYSTEM, memoryBlock, historyBlock, systemPrompt].filter((s) => typeof s === "string" && s.trim() !== "").join("\n\n") || null;

    // ---- Attachments: fetch OWNED rows + assemble blocks; strict ownership (404 on any missing) ----
    // B8k: CONVERSATION-SCOPED attachments (no cap). Fetch every file attached anywhere in this
    // conversation, not just this turn's. Prior turns are already linked by message_seq (== their
    // user-turn index in messages[]); this turn's attachment_ids are not yet linked, so they map to
    // lastUserIndex. Owner-scoped (explicit created_by). rowsBySeq: message-index -> attachment rows[].
    const rowsBySeq = new Map();
    try {
      const attClient = await pool.connect();
      try {
        await attClient.query(
          `
          SELECT
            set_config('app.current_user_id', $1, false),
            set_config('request.jwt.claim.sub', $1, false),
            set_config('request.jwt.claim.oid', $1, false)
          `,
          [oid]
        );
        if (requestedConversationId) {
          const prior = await attClient.query(
            `
            SELECT id, filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path, message_seq
            FROM public.theo_attachments
            WHERE conversation_id = $1 AND created_by = $2 AND message_seq IS NOT NULL
            ORDER BY message_seq, created_at
            `,
            [requestedConversationId, oid]
          );
          for (const r of prior.rows) {
            if (!rowsBySeq.has(r.message_seq)) rowsBySeq.set(r.message_seq, []);
            rowsBySeq.get(r.message_seq).push(r);
          }
        }
        if (attachmentIds.length > 0) {
          const res = await attClient.query(
            `
            SELECT id, filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path
            FROM public.theo_attachments
            WHERE id = ANY($1::uuid[]) AND created_by = $2
            `,
            [attachmentIds, oid]
          );
          if (res.rows.length !== attachmentIds.length) {
            return jsonErr(404, "NOT_FOUND", "One or more attachments were not found.");
          }
          const orderById = new Map(attachmentIds.map((id, i) => [id, i]));
          const cur = res.rows.sort((a, b) => orderById.get(a.id) - orderById.get(b.id));
          if (!rowsBySeq.has(lastUserIndex)) rowsBySeq.set(lastUserIndex, []);
          rowsBySeq.get(lastUserIndex).push(...cur);
        }
      } finally {
        attClient.release();
      }
    } catch (attErr) {
      context.error("theo_message_stream: attachment fetch failed", attErr);
      return jsonErr(500, "INTERNAL_SERVER_ERROR", "Failed to load attachments.");
    }

    // ---- Pre-stream conversation ownership check (so a non-owned id is a clean JSON 403/404, not a
    // mid-stream error). Persistence re-checks under the transaction as defense-in-depth. ----
    if (requestedConversationId) {
      let chkClient = null;
      try {
        chkClient = await pool.connect();
        await chkClient.query(
          `
          SELECT
            set_config('app.current_user_id', $1, false),
            set_config('request.jwt.claim.sub', $1, false),
            set_config('request.jwt.claim.oid', $1, false)
          `,
          [oid]
        );
        const owned = await chkClient.query(
          `SELECT id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
          [requestedConversationId, oid]
        );
        if (owned.rowCount === 0) {
          const existsResult = await chkClient.query(
            `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
            [requestedConversationId]
          );
          const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
          return exists
            ? jsonErr(403, "FORBIDDEN", "You do not have access to this conversation.")
            : jsonErr(404, "NOT_FOUND", "Conversation not found.");
        }
      } catch (chkErr) {
        context.error("theo_message_stream: conversation ownership check failed", chkErr);
        return jsonErr(500, "INTERNAL_SERVER_ERROR", "Failed to verify the conversation.");
      } finally {
        if (chkClient) chkClient.release();
      }
    }

    // B8k: inject each turn's attachment blocks onto ITS OWN user message (conversation-scoped),
    // so historical turns form a stable, cacheable prefix. One ephemeral cache breakpoint at the
    // last HISTORICAL attachment turn (Anthropic allows ≤4; a single breakpoint caches the whole
    // prefix before it). The current turn's blocks stay uncached (they change each turn).
    let messagesForUpstream = messages;
    if (rowsBySeq.size > 0) {
      const histSeqs = [...rowsBySeq.keys()].filter((s) => s !== lastUserIndex);
      const cacheSeq = histSeqs.length ? Math.max(...histSeqs) : -1;
      messagesForUpstream = await Promise.all(
        messages.map(async (m, i) => {
          const rows = rowsBySeq.get(i);
          if (!rows || rows.length === 0 || !m || m.role !== "user" || typeof m.content !== "string") return m;
          const blocks = await buildAttachmentBlocks(context, rows);
          if (blocks.length === 0) return m;
          if (i === cacheSeq) {
            blocks[blocks.length - 1] = { ...blocks[blocks.length - 1], cache_control: { type: "ephemeral" } };
          }
          return { ...m, content: [...blocks, { type: "text", text: m.content }] };
        })
      );
    }

    // ---- Open the upstream Foundry stream (turn 0) BEFORE committing to the stream, so a
    // pre-stream failure is a clean JSON error; then drive the DR-T11 agentic tool-loop. ----
    let token;
    try {
      token = await getFoundryToken();
    } catch (e) {
      return jsonErr(e.status || 500, e.code || "INTERNAL_SERVER_ERROR", e.message || "Model gateway token failed.");
    }

    if (THINKING_MODE === "enabled" && THINKING_BUDGET > 0 && maxTokens <= THINKING_BUDGET) {
      maxTokens = THINKING_BUDGET + 1024; // legacy enabled-mode only: Anthropic requires max_tokens > thinking budget
    }

    // Delegated token forwarded to func-theo-tools tool endpoints (shared api://4e1a1e31 audience),
    // so a dispatched tool runs AS THE SIGNED-IN USER. Absent → tool calls return a clean error.
    const oboToken = getOboInputToken(request);

    let upstreamRes = await openUpstream({ messages: messagesForUpstream, token, maxTokens, system: effectiveSystem, context });
    if (!upstreamRes) {
      return jsonErr(502, "BAD_GATEWAY", "Model gateway call failed.");
    }
    if (upstreamRes.statusCode < 200 || upstreamRes.statusCode >= 300) {
      const errText = await new Promise((res) => {
        let d = "";
        upstreamRes.setEncoding("utf8");
        upstreamRes.on("data", (c) => { d += c; });
        upstreamRes.on("end", () => res(d));
        upstreamRes.on("error", () => res(d));
      });
      context.error("theo_message_stream: gateway non-2xx", upstreamRes.statusCode, errText.slice(0, 300));
      if (upstreamRes.statusCode === 429) {
        return jsonErr(429, "RATE_LIMITED", "Model gateway rate limit exceeded.");
      }
      return jsonErr(502, "BAD_GATEWAY", "Model gateway call failed.");
    }

    // ---- 2xx → drive the agentic tool-loop. Each turn's native SSE is relayed VERBATIM to the client
    // (FE contract unchanged); when the model requests a general-chat tool we dispatch it over HTTP as
    // the user, emit `event: vault_export` for a downloadable result, feed the tool_result back, and
    // loop. The full assistant text across turns is accumulated for a single persisted turn. ----
    const stream = new PassThrough();
    (async () => {
      const convo = Array.isArray(messagesForUpstream) ? [...messagesForUpstream] : messagesForUpstream;
      let finalText = "";
      let model = FOUNDRY_DEPLOYMENT;
      const citationsAll = [];
      // Cumulative authoritative output tokens across all loop turns; carried into relayTurnRaw so the
      // live `event: vault_tokens` estimate builds on the exact prior-turn totals. `lastEmitted` is the
      // monotonic floor for the emitted count (an overshoot never decreases at message_delta reconcile).
      const tok = { realBefore: 0, lastEmitted: 0 };
      try {
        for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
          const { assistantContent, stopReason, text, citations, model: tm, turnOutputTokens } = await relayTurnRaw(upstreamRes, stream, tok);
          finalText += text;
          tok.realBefore += Number.isInteger(turnOutputTokens) ? turnOutputTokens : 0;
          if (citations.length) citationsAll.push(...citations);
          model = tm || model;
          convo.push({ role: "assistant", content: assistantContent });

          const toolUses = assistantContent.filter((b) => b.type === "tool_use" && isChatTool(b.name));
          if (stopReason !== "tool_use" || toolUses.length === 0) break; // model is done (or only server-side tools ran)

          const results = [];
          for (const tu of toolUses) {
            // The tool call was already surfaced to the client at content_block_start (relayTurnRaw emits
            // `event: tool { name }` the instant the block opens) so the FE shows the tool-aware verb
            // during the build. Here we only report completion + any downloadable result.
            let out;
            try { out = await dispatchChatTool(tu.name, tu.input, { bearer: oboToken }); }
            catch (e) { out = { error: String(e.message) }; }
            stream.write(`event: tool_result\ndata: ${JSON.stringify({ name: tu.name, ok: !(out && out.error) })}\n\n`);
            if (isDownloadable(tu.name) && out && out.downloadUrl) {
              stream.write(`event: vault_export\ndata: ${JSON.stringify({ downloadUrl: out.downloadUrl, filename: out.filename, contentType: out.contentType, byteSize: out.byteSize, expiresAt: out.expiresAt })}\n\n`);
            }
            // IMG-2 image passthrough: a tool that returns { image: { media_type, data(base64), … } }
            // (theo_fetch_image) hands the model a REAL vision block, not stringified text; every other
            // tool result stays a JSON string (unchanged). media_type is constrained to Claude's native
            // image types by the tool itself; a text sibling gives the model the provenance.
            let toolResultContent;
            if (out && out.image && typeof out.image.data === "string" && typeof out.image.media_type === "string") {
              toolResultContent = [
                { type: "image", source: { type: "base64", media_type: out.image.media_type, data: out.image.data } },
                { type: "text", text: `Fetched image (${out.image.media_type}, ${out.image.byte_size} bytes) from ${out.image.source_url}` },
              ];
            } else {
              toolResultContent = JSON.stringify(out);
            }
            results.push({ type: "tool_result", tool_use_id: tu.id, content: toolResultContent });
          }
          convo.push({ role: "user", content: results });

          upstreamRes = await openUpstream({ messages: convo, token, maxTokens, system: effectiveSystem, context });
          if (!upstreamRes || upstreamRes.statusCode < 200 || upstreamRes.statusCode >= 300) {
            stream.write(`event: vault_error\ndata: ${JSON.stringify({ message: "The model stream was interrupted." })}\n\n`);
            upstreamRes = null;
            break;
          }
        }
      } catch (loopErr) {
        context.error("theo_message_stream: tool-loop failed", loopErr);
        try { stream.write(`event: vault_error\ndata: ${JSON.stringify({ message: "The model stream was interrupted." })}\n\n`); } catch {}
      }

      // Finalize: persist the full assistant turn (accumulated text + citations) and emit vault_meta
      // (unchanged persistence + wire contract).
      try {
        const acc = { text: finalText, citations: citationsAll, model };
        const conversationId = await persistTurn({
          oid, requestedConversationId, appKey, appContext, userText, attachmentIds, acc,
        });
        stream.write(`event: vault_meta\ndata: ${JSON.stringify({ conversation_id: conversationId, model: acc.model || FOUNDRY_DEPLOYMENT })}\n\n`);
      } catch (perr) {
        context.error("theo_message_stream: persistence failed (answer already streamed)", perr);
        stream.write(`event: vault_meta\ndata: ${JSON.stringify({ conversation_id: null, persisted: false })}\n\n`);
      } finally {
        stream.end();
      }
    })();

    return {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
      body: stream,
    };
  },
});
