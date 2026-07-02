const https = require("https");
const { Pool } = require("pg");

// Embedding (Azure OpenAI) + Azure AI Search config (app settings).
const EMBED_ENDPOINT = (process.env.THEO_EMBED_ENDPOINT || "").replace(/\/+$/, "");
const EMBED_DEPLOYMENT = process.env.THEO_EMBED_DEPLOYMENT;
const EMBED_API_VERSION = process.env.THEO_EMBED_API_VERSION || "2023-05-15";
const SEARCH_ENDPOINT = (process.env.THEO_SEARCH_ENDPOINT || "").replace(/\/+$/, "");
const SEARCH_INDEX = process.env.THEO_SEARCH_INDEX || "theo-messages";
const SEARCH_API_VERSION = process.env.THEO_SEARCH_API_VERSION || "2023-11-01";

const EMBED_SCOPE = "https://cognitiveservices.azure.com/.default";
const SEARCH_SCOPE = "https://search.azure.com/.default";

const CONTENT_MAX_CHARS = 8000; // cap per message (indexed content + embedding input)
const EMBED_BATCH = 64; // messages per embedding call

function parsePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

const IDLE_MINUTES = parsePositiveInt(process.env.THEO_INDEX_IDLE_MINUTES, 30);
const BATCH = parsePositiveInt(process.env.THEO_INDEX_BATCH, 20);

// Persistence pool (shared `vaultgpt` instance). Scheduled batch with no user identity; cross-owner
// enumeration runs via the SECURITY DEFINER helper, and per-conversation reads run under each owner's
// set_config context (explicit created_by). No user content is exposed elevated.
const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

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
    const req = https.request(
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
          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data });
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
    name: SEARCH_INDEX,
    fields: [
      { name: "id", type: "Edm.String", key: true, filterable: true },
      { name: "conversation_id", type: "Edm.String", filterable: true },
      { name: "created_by", type: "Edm.String", filterable: true },
      { name: "role", type: "Edm.String", filterable: true },
      { name: "content", type: "Edm.String", searchable: true },
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
    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(SEARCH_INDEX)}?api-version=${SEARCH_API_VERSION}`,
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
    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(SEARCH_INDEX)}/docs/index?api-version=${SEARCH_API_VERSION}`,
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

module.exports = async function (context, indexTimer) {
  if (!EMBED_ENDPOINT || !EMBED_DEPLOYMENT || !SEARCH_ENDPOINT) {
    context.log.error("theo_index_messages: missing embedding/search configuration");
    return;
  }

  let embedToken;
  let searchToken;
  try {
    embedToken = await getAadToken(EMBED_SCOPE);
    searchToken = await getAadToken(SEARCH_SCOPE);
  } catch (err) {
    context.log.error("theo_index_messages: token acquisition failed", err);
    return;
  }

  try {
    await ensureIndex(searchToken);
  } catch (err) {
    context.log.error("theo_index_messages: ensureIndex failed", err);
    return;
  }

  const client = await pool.connect();
  try {
    // Cross-owner due-for-indexing scan via the SECURITY DEFINER enumeration helper (ids + owners only).
    const due = await client.query(
      `SELECT id, created_by FROM public.theo_index_due_conversations($1, $2)`,
      [IDLE_MINUTES, BATCH]
    );

    context.log(`theo_index_messages: ${due.rowCount} conversation(s) due for indexing`);

    for (const conv of due.rows) {
      try {
        // Per-owner context so RLS permits reading this owner's messages + stamping the watermark.
        await client.query(
          `
          SELECT
            set_config('app.current_user_id', $1, false),
            set_config('request.jwt.claim.sub', $1, false),
            set_config('request.jwt.claim.oid', $1, false)
          `,
          [conv.created_by]
        );

        const msgs = await client.query(
          `
          SELECT id, role, content, created_at
          FROM public.theo_messages
          WHERE conversation_id = $1 AND created_by = $2
          ORDER BY seq ASC, created_at ASC
          `,
          [conv.id, conv.created_by]
        );

        const rows = msgs.rows.filter((m) => typeof m.content === "string" && m.content.trim() !== "");

        // Index in embedding-sized batches (order preserved).
        for (let i = 0; i < rows.length; i += EMBED_BATCH) {
          const chunk = rows.slice(i, i + EMBED_BATCH);
          const inputs = chunk.map((m) => m.content.slice(0, CONTENT_MAX_CHARS));
          const vectors = await embedBatch(embedToken, inputs);
          const docs = chunk.map((m, j) => ({
            id: m.id,
            conversation_id: conv.id,
            created_by: conv.created_by,
            role: m.role,
            content: m.content.slice(0, CONTENT_MAX_CHARS),
            created_at: new Date(m.created_at).toISOString(),
            content_vector: vectors[j],
          }));
          await upsertDocs(searchToken, docs);
        }

        // Stamp the indexing watermark (own connection; per-owner RLS context set above).
        await client.query(
          `UPDATE public.theo_conversations SET last_indexed_at = now() WHERE id = $1 AND created_by = $2`,
          [conv.id, conv.created_by]
        );

        context.log(`theo_index_messages: conversation ${conv.id} -> ${rows.length} message(s) indexed`);
      } catch (convErr) {
        context.log.error(`theo_index_messages: conversation ${conv.id} failed (will retry next tick)`, convErr);
        // Do NOT stamp last_indexed_at on failure → the conversation is retried next tick (indexing is
        // idempotent via mergeOrUpload, so a partial batch re-runs safely).
      }
    }
  } catch (err) {
    context.log.error("theo_index_messages: batch failed", err);
  } finally {
    client.release();
  }
};
