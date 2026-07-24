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

    // Only files whose text was extracted at finalize (extract-class + large PDFs) can become
    // project knowledge — the extracted text is what is stored + injected/retrieved. Native
    // PDFs (<=3 MB) and images have no extracted_text_path and are rejected with guidance.
    if (!row.extracted_text_path) {
      throw buildKnownError(
        "UNSUPPORTED_MEDIA_TYPE",
        "This file has no extractable text. Add a Word, Excel, PowerPoint, CSV, or TXT file (or a text-based PDF) as project knowledge.",
        400
      );
    }

    // Read the extracted-text sibling blob via managed identity (reused byte-identically from
    // theo_finalize_attachment). The container is the value finalize stored on the row.
    let text;
    try {
      const buf = await downloadBlob(STORAGE_ACCOUNT, row.blob_container, row.extracted_text_path);
      text = buf.toString("utf8");
    } catch (blobErr) {
      context.log.error("theo_add_project_knowledge_file: extracted-text blob read failed", blobErr);
      throw buildKnownError("BLOB_READ_FAILED", "Couldn't read the file's extracted text.", 502);
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

    return send(context, 201, successBody({ knowledge: inserted.rows[0] }));
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
