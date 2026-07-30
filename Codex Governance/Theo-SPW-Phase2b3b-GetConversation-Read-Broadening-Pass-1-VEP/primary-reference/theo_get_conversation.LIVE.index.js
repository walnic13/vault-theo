const { Pool } = require("pg");
const crypto = require("crypto");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

// Chat Media Persistence — persisted image URLs point at our own Blob and were stored with a
// short-TTL read-SAS; the token expires (~60 min) while the blob is durable, so a reloaded
// chat's images 404. On read we re-mint a fresh read-SAS for each persisted image URL under
// this user's own storage prefix (one shared user-delegation key per reload; the shared-UDK
// idiom mirrors the deployed theo_find_image gallery path). Public URLs (Wikimedia/Commons,
// YouTube thumbnails) pass through unchanged. Best-effort: a signing failure never fails the read.
const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";
const IMAGE_RESIGN_TTL_MINUTES = 60;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

// ---- Managed-identity user-delegation SAS — ported VERBATIM from the deployed premium
// theo_create_attachment_upload (pure crypto + https, no @azure/storage-blob dependency; T12
// authorized-helper reuse). Used here to re-mint READ SAS on persisted images. ----
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

// ---- Re-sign step (this handler's addition) --------------------------------------------------
// Decode a persisted blob URL to its blobKey iff it targets OUR account+container AND lives under
// the requesting user's own images/<oid>/ prefix (defense-in-depth: never re-sign another user's
// blob). Non-blob / public URLs return null and are left unchanged.
function blobKeyForOid(rawUrl, oid) {
  if (typeof rawUrl !== "string" || !rawUrl) return null;
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }
  if (parsed.host !== `${STORAGE_ACCOUNT}.blob.core.windows.net`) return null;
  const prefix = `/${STORAGE_CONTAINER}/`;
  if (!parsed.pathname.startsWith(prefix)) return null;
  let blobKey;
  try {
    blobKey = parsed.pathname.slice(prefix.length).split("/").map(decodeURIComponent).join("/");
  } catch {
    return null;
  }
  if (!blobKey || !blobKey.startsWith(`images/${oid}/`)) return null;
  return blobKey;
}

function mimeFromKey(blobKey) {
  const ext = (blobKey.split(".").pop() || "").toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return null;
}

// Build a read-SAS query for one blob against a PRE-FETCHED shared UDK. A decomposition of the
// deployed premium buildUserDelegationSas (UDK fetched once, signed per blob) — the shared-UDK
// idiom mirrors the deployed theo_find_image gallery path so a reload signs N images with one key.
function readSasFromUdk(udk, accountName, containerName, blobKey, st, se, mimeType) {
  const sv = "2022-11-02";
  const sr = "b";
  const spr = "https";
  const permissions = "r";
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
  return qp.toString();
}

// Re-mint fresh read-SAS URLs for persisted blob images across all messages. Mutates media in
// place. One shared UDK per reload; only fetched when at least one blob image is present.
async function resignPersistedMedia(messages, oid, context) {
  const targets = [];
  for (const m of messages) {
    const media = m && m.media;
    if (!media || typeof media !== "object") continue;
    const img = media.image;
    if (!img || typeof img !== "object") continue;
    if (blobKeyForOid(img.url, oid)) {
      targets.push({ get: () => img.url, set: (v) => { img.url = v; } });
    }
    if (Array.isArray(img.images)) {
      for (const it of img.images) {
        if (it && typeof it === "object" && blobKeyForOid(it.imageUrl, oid)) {
          targets.push({ get: () => it.imageUrl, set: (v) => { it.imageUrl = v; } });
        }
      }
    }
  }
  if (targets.length === 0) return;

  const now = new Date();
  const start = new Date(now.getTime() - 5 * 60 * 1000);
  const expiry = new Date(now.getTime() + IMAGE_RESIGN_TTL_MINUTES * 60 * 1000);
  const st = toIsoNoMillis(start);
  const se = toIsoNoMillis(expiry);
  const udk = await getUserDelegationKey(STORAGE_ACCOUNT, st, se);

  for (const t of targets) {
    const blobKey = blobKeyForOid(t.get(), oid);
    if (!blobKey) continue;
    const sas = readSasFromUdk(udk, STORAGE_ACCOUNT, STORAGE_CONTAINER, blobKey, st, se, mimeFromKey(blobKey));
    const blobUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeBlobPath(blobKey)}`;
    t.set(`${blobUrl}?${sas}`);
  }
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

  const conversationId =
    req.query && typeof req.query.conversationId === "string" ? req.query.conversationId.trim() : "";
  if (!isUuid(conversationId)) {
    return send(
      context,
      400,
      errorBody("INVALID_REQUEST", "Query parameter 'conversationId' is required and must be a valid UUID.", 400)
    );
  }

  const client = await pool.connect();

  try {
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Explicit ownership scope: the shared Functions connection role bypasses RLS, so the
    // by-id read MUST also filter created_by = the signed-in OID. A non-owned id yields 0 rows
    // here and is then discriminated 403 (exists, not owned) vs 404 (absent) via the helper.
    const convResult = await client.query(
      `
      SELECT
        id,
        title,
        model,
        project_id,
        app_key,
        app_context,
        created_at,
        updated_at,
        last_opened_at
      FROM public.theo_conversations
      WHERE id = $1 AND created_by = $2
      `,
      [conversationId, oid]
    );

    if (convResult.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [conversationId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      return exists
        ? send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403))
        : send(context, 404, errorBody("NOT_FOUND", "Conversation not found.", 404));
    }

    // Restore-on-reopen: stamp last_opened_at now that ownership is confirmed. Owner-scoped
    // (created_by = the signed-in OID; the deployed theo_conversation_update_own policy permits it).
    // Best-effort — a stamp failure MUST NOT fail the read, so it is caught and logged only. The
    // returned conversation row above reflects the pre-stamp value; the frontend does not depend on
    // the stamp being reflected in this response (it reorders via theo_list_conversations).
    try {
      await client.query(
        `UPDATE public.theo_conversations SET last_opened_at = now() WHERE id = $1 AND created_by = $2`,
        [conversationId, oid]
      );
    } catch (stampErr) {
      context.log.error("theo_get_conversation last_opened_at stamp failed (non-fatal)", stampErr);
    }

    const messagesResult = await client.query(
      `
      SELECT
        id,
        seq,
        role,
        content,
        model,
        citations,
        media,
        created_at
      FROM public.theo_messages
      WHERE conversation_id = $1 AND created_by = $2
      ORDER BY seq ASC, created_at ASC
      `,
      [conversationId, oid]
    );

    const messages = messagesResult.rows;
    // Chat Media Persistence — re-mint fresh read-SAS for persisted blob images before returning
    // (their stored SAS token has expired though the blob is durable). Best-effort: a signing
    // failure MUST NOT fail the read; the stored URLs are left intact and logged.
    try {
      await resignPersistedMedia(messages, oid, context);
    } catch (resignErr) {
      context.log.error("theo_get_conversation media re-sign failed (non-fatal)", resignErr);
    }

    return send(
      context,
      200,
      successBody({ conversation: convResult.rows[0], messages })
    );
  } catch (err) {
    context.log.error("theo_get_conversation failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
