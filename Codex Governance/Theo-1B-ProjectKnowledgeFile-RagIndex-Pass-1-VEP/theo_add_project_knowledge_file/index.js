const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const TITLE_MAX_LEN = 200;
// File-backed knowledge holds extracted document text (not hand-typed), so the inline-content
// ceiling is raised well above the text-knowledge 10 000 cap; text beyond this is truncated with a
// marker (Phase D RAG retrieval over the stored content is the scale answer — API Spec §2.6).
const FILE_CONTENT_MAX_LEN = 100000;
// theo-content Blob account/container (identical resolution to the deployed theo_finalize_attachment).
const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
// Phase D — RAG on-ingest indexing (Azure AI Search project-knowledge index). Config + helpers
// (getAadToken/ensureIndex/embedBatch/upsertDocs) reused byte-identically from the deployed
// theo_index_messages (B7b1) per the Walter-authorized composite (2026-07-24), adapted only for the
// theo-project-knowledge index + content chunking. Indexing is NON-FATAL (never fails the add).
const EMBED_ENDPOINT = (process.env.THEO_EMBED_ENDPOINT || "").replace(/\/+$/, "");
const EMBED_DEPLOYMENT = process.env.THEO_EMBED_DEPLOYMENT;
const EMBED_API_VERSION = process.env.THEO_EMBED_API_VERSION || "2023-05-15";
const SEARCH_ENDPOINT = (process.env.THEO_SEARCH_ENDPOINT || "").replace(/\/+$/, "");
const PK_SEARCH_INDEX = process.env.THEO_PK_SEARCH_INDEX || "theo-project-knowledge";
const SEARCH_API_VERSION = process.env.THEO_SEARCH_API_VERSION || "2023-11-01";
const EMBED_SCOPE = "https://cognitiveservices.azure.com/.default";
const SEARCH_SCOPE = "https://search.azure.com/.default";
const CHUNK_CHARS = 2000; // project-knowledge docs are large; chunk for retrieval granularity
const EMBED_BATCH = 64;
// Only these body fields are accepted; any extra key is rejected (Golden Handler §3.3).
const ALLOWED_BODY_KEYS = new Set(["project_id", "attachment_id", "title"]);

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
    if (match && typeof match.val === "string" && match.val.trim()) {
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

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

// ---- Managed-identity data-plane Blob read (reused byte-identically from the deployed
// theo_finalize_attachment per the Walter-authorized composite; this handler READS only).
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

// Binary variant: collects Buffer chunks (must NOT coerce to string — blobs are binary zips).
function requestBinary(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const https = require("https");
    const url = new URL(urlStr);
    const req = https.request(
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

function encodeBlobPath(blobKey) {
  return blobKey.split("/").map(encodeURIComponent).join("/");
}

function blobUrlFor(accountName, containerName, blobKey) {
  return `https://${accountName}.blob.core.windows.net/${containerName}/${encodeBlobPath(blobKey)}`;
}

async function downloadBlob(accountName, containerName, blobKey) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const r = await requestBinary(blobUrlFor(accountName, containerName, blobKey), {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`GET blob failed (${r.statusCode})`);
  }
  return r.body; // Buffer
}

// ---- Phase D RAG indexing helpers (byte-identical reuse of the deployed theo_index_messages B7b1,
// per the Walter-authorized composite; adapted only for the theo-project-knowledge index) ----
function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Client-credentials token for a given Azure resource scope (same AAD app as the gateway).
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

// PUT the index definition (create-or-update; idempotent). Vector field matches text-embedding-3-small (1536).
async function ensureIndex(searchToken) {
  const indexDef = {
    name: PK_SEARCH_INDEX,
    fields: [
      { name: "id", type: "Edm.String", key: true, filterable: true },
      { name: "knowledge_id", type: "Edm.String", filterable: true },
      { name: "project_id", type: "Edm.String", filterable: true },
      { name: "created_by", type: "Edm.String", filterable: true },
      { name: "title", type: "Edm.String", searchable: true },
      { name: "content", type: "Edm.String", searchable: true },
      { name: "chunk_index", type: "Edm.Int32", filterable: true, sortable: true },
      { name: "created_at", type: "Edm.DateTimeOffset", filterable: true, sortable: true },
      {
        name: "content_vector",
        type: "Collection(Edm.Single)",
        searchable: true,
        dimensions: 1536,
        vectorSearchProfile: "theo-vec-profile",
      },
    ],
    vectorSearch: {
      algorithms: [{ name: "theo-hnsw", kind: "hnsw" }],
      profiles: [{ name: "theo-vec-profile", algorithm: "theo-hnsw" }],
    },
  };
  const body = JSON.stringify(indexDef);
  const r = await requestUrl(
    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(PK_SEARCH_INDEX)}?api-version=${SEARCH_API_VERSION}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${searchToken}`,
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body
  );
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`ensureIndex failed (HTTP ${r.statusCode}): ${r.body.slice(0, 300)}`);
  }
}

// Batch-embed an array of strings → array of 1536-d vectors (order preserved).
async function embedBatch(embedToken, inputs) {
  const body = JSON.stringify({ input: inputs });
  const r = await requestUrl(
    `${EMBED_ENDPOINT}/openai/deployments/${encodeURIComponent(EMBED_DEPLOYMENT)}/embeddings?api-version=${EMBED_API_VERSION}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${embedToken}`,
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.data)) {
    throw new Error(`embedBatch failed (HTTP ${r.statusCode}): ${r.body.slice(0, 300)}`);
  }
  return payload.data
    .slice()
    .sort((a, b) => (a.index || 0) - (b.index || 0))
    .map((d) => d.embedding);
}

// Upsert documents into the index (mergeOrUpload).
async function upsertDocs(searchToken, docs) {
  const body = JSON.stringify({ value: docs.map((d) => ({ "@search.action": "mergeOrUpload", ...d })) });
  const r = await requestUrl(
    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(PK_SEARCH_INDEX)}/docs/index?api-version=${SEARCH_API_VERSION}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${searchToken}`,
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body
  );
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`upsertDocs failed (HTTP ${r.statusCode}): ${r.body.slice(0, 300)}`);
  }
}

// Split large knowledge content into fixed-size chunks (retrieval granularity).
function chunkText(s) {
  const chunks = [];
  for (let i = 0; i < s.length; i += CHUNK_CHARS) chunks.push(s.slice(i, i + CHUNK_CHARS));
  return chunks.length ? chunks : [""];
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

  // ---- Validate inputs before any SQL / blob access (deterministic 400s) ----
  // Reject unknown/extra body fields (Golden Handler §3.3).
  for (const k of Object.keys(body)) {
    if (!ALLOWED_BODY_KEYS.has(k)) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Unknown field '${k}' is not allowed.`, 400));
    }
  }

  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  }

  const attachmentId = typeof body.attachment_id === "string" ? body.attachment_id.trim() : "";
  if (!isUuid(attachmentId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'attachment_id' is required and must be a valid UUID.", 400));
  }

  // Optional title override; defaults to the attachment filename. When present it must be a
  // non-blank string within the length cap.
  let titleOverride = null;
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'title', when provided, must be a non-empty string.", 400));
    }
    if (body.title.trim().length > TITLE_MAX_LEN) {
      return send(context, 400, errorBody("INVALID_REQUEST", `Field 'title' must be at most ${TITLE_MAX_LEN} characters.`, 400));
    }
    titleOverride = body.title.trim();
  }

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

    // FK ownership (the connection role bypasses RLS, so FK existence does NOT prove ownership):
    // the referenced project MUST belong to the caller, else 404 (no leakage). EXACT mirror of
    // theo_add_project_knowledge.
    const owned = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
      [projectId, oid]
    );
    if (owned.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // Owner-scoped attachment lookup (authorized reuse of the deployed theo_finalize_attachment
    // theo_attachments access pattern): fetch the row's blob pointer + extracted-text path.
    const att = await client.query(
      `
      SELECT filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path
      FROM public.theo_attachments
      WHERE id = $1 AND created_by = $2
      `,
      [attachmentId, oid]
    );
    if (att.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Attachment not found.", 404);
    }
    const row = att.rows[0];

    // Obtain the file's text. Project knowledge is injected as text, so a file MUST yield text.
    //  (a) extract-class files (Excel/Word/PPT/CSV/TXT + PDFs > 3 MB) already have their text at
    //      finalize's `extracted_text_path` sibling blob — read it (reused byte-identically from
    //      theo_finalize_attachment).
    //  (b) a PDF finalize left NATIVE (<= 3 MB, no extracted_text_path) is text-extracted HERE via
    //      pdf-parse over the ORIGINAL blob (byte-identical to theo_finalize_attachment B8h;
    //      Walter-authorized 2026-07-24) — text PDFs are a common knowledge source.
    //  (c) anything else (images, scanned/image-only PDFs with no text layer) → 400 (OCR not yet supported).
    let text;
    try {
      if (row.extracted_text_path) {
        const buf = await downloadBlob(STORAGE_ACCOUNT, row.blob_container, row.extracted_text_path);
        text = buf.toString("utf8");
      } else if (row.content_type === "application/pdf") {
        const buf = await downloadBlob(STORAGE_ACCOUNT, row.blob_container, row.blob_path);
        const pdfParse = require("pdf-parse/lib/pdf-parse.js"); // pin pdf-parse@1.1.1; inner lib avoids the index.js debug-block (reads a test PDF when module.parent is falsy, as in Functions)
        const data = await pdfParse(buf);
        text = (data && data.text) || "";
      } else {
        throw buildKnownError(
          "UNSUPPORTED_MEDIA_TYPE",
          "This file has no extractable text. Add a Word, Excel, PowerPoint, CSV, TXT, or a text-based PDF (scanned/image-only PDFs need OCR — not yet supported).",
          400
        );
      }
    } catch (extractErr) {
      if (extractErr && extractErr.isKnown === true) throw extractErr;
      context.log.error("theo_add_project_knowledge_file: text extraction failed", extractErr);
      throw buildKnownError("BLOB_READ_FAILED", "Couldn't read the file's text.", 502);
    }

    text = (text || "").trim();
    if (text === "") {
      throw buildKnownError("UNSUPPORTED_MEDIA_TYPE", "The file produced no readable text.", 400);
    }
    if (text.length > FILE_CONTENT_MAX_LEN) {
      text = text.slice(0, FILE_CONTENT_MAX_LEN) + "\n\n[Content truncated for length.]";
    }

    const title = titleOverride || String(row.filename || "Untitled file").trim().slice(0, TITLE_MAX_LEN) || "Untitled file";

    // ALLOWED DELTA vs theo_add_project_knowledge: source_type='file' + the deployed file-pointer
    // columns (blob_container/blob_path/byte_size/content_type — b2_migration.sql; Schema §5), the
    // original file's pointer carried through for later download. created_by = the signed-in OID.
    const inserted = await client.query(
      `
      INSERT INTO public.theo_project_knowledge
        (created_by, project_id, title, source_type, content, blob_container, blob_path, byte_size, content_type)
      VALUES ($1, $2, $3, 'file', $4, $5, $6, $7, $8)
      RETURNING
        id, project_id, title, source_type, content, created_at
      `,
      [oid, projectId, title, text, row.blob_container, row.blob_path, row.byte_size, row.content_type]
    );

    await client.query("COMMIT");

    const knowledge = inserted.rows[0];

    // Phase D — best-effort on-ingest RAG indexing (NON-FATAL: an index failure NEVER fails the add;
    // the row is already committed). Chunk the stored text, embed each chunk, and upsert one doc per
    // chunk into the project-knowledge index (created idempotently), scoped by project_id + created_by.
    try {
      if (EMBED_ENDPOINT && EMBED_DEPLOYMENT && SEARCH_ENDPOINT) {
        const chunks = chunkText(text);
        const [embedToken, searchToken] = await Promise.all([getAadToken(EMBED_SCOPE), getAadToken(SEARCH_SCOPE)]);
        await ensureIndex(searchToken);
        const vectors = [];
        for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
          const vecs = await embedBatch(embedToken, chunks.slice(i, i + EMBED_BATCH));
          vectors.push(...vecs);
        }
        const docs = chunks.map((c, i) => ({
          id: `${knowledge.id}-${i}`,
          knowledge_id: knowledge.id,
          project_id: knowledge.project_id,
          created_by: oid,
          title: knowledge.title,
          content: c,
          chunk_index: i,
          created_at: knowledge.created_at,
          content_vector: vectors[i],
        }));
        await upsertDocs(searchToken, docs);
      }
    } catch (indexErr) {
      context.log.error("theo_add_project_knowledge_file: RAG indexing failed (non-fatal)", indexErr);
    }

    return send(context, 201, successBody({ knowledge }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_add_project_knowledge_file failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to add knowledge to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // FK violation: project_id absent or not owned.
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    }
    // CHECK violation (title non-blank or source_type), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Knowledge item violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
