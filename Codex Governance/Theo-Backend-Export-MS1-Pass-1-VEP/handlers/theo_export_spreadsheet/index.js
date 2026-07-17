const crypto = require("crypto");
// In-tenant workbook generation (DR-T9). xlsx-js-style is the SheetJS community engine with cell
// styling (bold headers) — same XLSX.utils API as the `xlsx` lib already proven loaded in this
// tenant (B8c extraction / Sigma engine); it writes real typed cells (numbers/dates), so exported
// values are usable (no "Text-to-Columns"). No network; pure in-process build.
const XLSX = require("xlsx-js-style");

const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";
const SAS_TTL_MINUTES = 15;
const XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// Deterministic input caps (bound the synchronous build + payload).
const MAX_SHEETS = 20;
const MAX_COLS = 100;
const MAX_ROWS = 10000;
const MAX_CELL_CHARS = 5000;
const MAX_TOTAL_CELLS = 200000;

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

function cleanFileName(name) {
  if (name === undefined || name === null) return null;
  const raw = String(name).trim();
  if (!raw.length) return null;
  const cleaned = raw.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, " ").trim();
  return cleaned.length ? cleaned.slice(0, 180) : null;
}

// ---- Managed-identity user-delegation SAS issuance (mirrors the deployed
// theo_create_attachment_upload technique; pure crypto + https, no @azure/storage-blob dependency).
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
  // present (empty string when unused). ALLOWED DELTA vs the primary reference: the rscd
  // (Content-Disposition) field is POPULATED for the read SAS (a friendly download filename),
  // where the primary reference left it empty. It occupies its exact canonical position (after
  // rscc, before rsce) — no field is added or reordered.
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
    params.rscd || "", // rscd (Content-Disposition)
    "", // rsce (Content-Encoding)
    "", // rscl (Content-Language)
    params.rsct || "", // rsct (Content-Type)
  ].join("\n");
  const key = Buffer.from(userDelegationKey.value, "base64");
  return crypto.createHmac("sha256", key).update(stringToSign, "utf8").digest("base64");
}

async function buildUserDelegationSas(accountName, containerName, blobKey, permissions, expiresInMinutes, mimeType, contentDisposition) {
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
    { sp: permissions, st, se, canonicalizedResource, spr, sv, sr, rsct: mimeType || "", rscd: contentDisposition || "" },
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
  if (contentDisposition) qp.set("rscd", contentDisposition);
  qp.set("sig", sig);

  return { sas: qp.toString(), expiresAt: se };
}

// ---- Workbook build (in-tenant SheetJS). Typed cells: numbers→numeric, dates→date, else text. ----
function coerceCell(value, type) {
  if (value === null || value === undefined || value === "") return "";
  if (type === "number") {
    const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
    return Number.isFinite(n) ? n : String(value);
  }
  if (type === "date") {
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? String(value) : d;
  }
  return String(value);
}

function buildWorkbookBuffer(sheets) {
  const wb = XLSX.utils.book_new();
  const usedNames = new Set();
  sheets.forEach((sheet, i) => {
    const columns = sheet.columns;
    const header = columns.map((c) => (c.header != null ? String(c.header) : String(c.key)));
    const rows = (sheet.rows || []).map((r) => columns.map((c) => coerceCell(r ? r[c.key] : "", c.type)));
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    // Bold header row.
    columns.forEach((_, ci) => {
      const addr = XLSX.utils.encode_cell({ r: 0, c: ci });
      if (ws[addr]) ws[addr].s = { font: { bold: true } };
    });
    // Reasonable column widths from the header length.
    ws["!cols"] = columns.map((c) => ({ wch: Math.min(60, Math.max(10, String(c.header || c.key || "").length + 2)) }));
    // Sanitize + de-dupe the sheet tab name (Excel: ≤31 chars, no \ / ? * [ ] :).
    let name = String(sheet.name || `Sheet${i + 1}`).replace(/[\\/?*[\]:]+/g, " ").trim().slice(0, 31) || `Sheet${i + 1}`;
    let n = name;
    let k = 1;
    while (usedNames.has(n.toLowerCase())) { n = `${name.slice(0, 27)} (${++k})`.slice(0, 31); }
    usedNames.add(n.toLowerCase());
    XLSX.utils.book_append_sheet(wb, ws, n);
  });
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}

function validateSheets(sheets) {
  if (!Array.isArray(sheets) || sheets.length < 1 || sheets.length > MAX_SHEETS) {
    return `Field 'sheets' must be a non-empty array of at most ${MAX_SHEETS} sheets.`;
  }
  let totalCells = 0;
  for (const sheet of sheets) {
    if (!sheet || typeof sheet !== "object") return "Each sheet must be an object.";
    const columns = sheet.columns;
    if (!Array.isArray(columns) || columns.length < 1 || columns.length > MAX_COLS) {
      return `Each sheet needs a 'columns' array of 1..${MAX_COLS} column definitions.`;
    }
    for (const c of columns) {
      if (!c || typeof c !== "object" || typeof c.key !== "string" || !c.key.trim()) {
        return "Each column needs a non-empty string 'key'.";
      }
      if (c.type !== undefined && !["text", "number", "date"].includes(c.type)) {
        return "Column 'type' must be one of 'text' | 'number' | 'date'.";
      }
    }
    const rows = sheet.rows;
    if (rows !== undefined && !Array.isArray(rows)) return "Sheet 'rows' must be an array.";
    const rowCount = Array.isArray(rows) ? rows.length : 0;
    if (rowCount > MAX_ROWS) return `A sheet may have at most ${MAX_ROWS} rows.`;
    totalCells += (rowCount + 1) * columns.length;
    if (totalCells > MAX_TOTAL_CELLS) return `Workbook exceeds the ${MAX_TOTAL_CELLS}-cell limit.`;
    for (const r of Array.isArray(rows) ? rows : []) {
      if (r && typeof r === "object") {
        for (const c of columns) {
          const v = r[c.key];
          if (typeof v === "string" && v.length > MAX_CELL_CHARS) {
            return `A cell exceeds the ${MAX_CELL_CHARS}-character limit.`;
          }
        }
      }
    }
  }
  return null;
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

  const invalid = validateSheets(body.sheets);
  if (invalid) {
    return send(context, 400, errorBody("INVALID_REQUEST", invalid, 400));
  }

  // Friendly download filename (defaults; always ends .xlsx).
  let filename = cleanFileName(body.filename) || "Theo Export.xlsx";
  if (!/\.xlsx$/i.test(filename)) filename = `${filename}.xlsx`;

  try {
    const buffer = buildWorkbookBuffer(body.sheets);
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "Workbook generation produced no output.", 500));
    }

    // Owner-scoped, deterministic blob path: exports/<oid>/<exportId>.xlsx.
    const exportId = crypto.randomUUID();
    const blobKey = `exports/${oid}/${exportId}.xlsx`;
    const blobUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeBlobPath(blobKey)}`;

    // 1) Short-lived create+write SAS; server PUTs the generated bytes.
    const writeSas = await buildUserDelegationSas(STORAGE_ACCOUNT, STORAGE_CONTAINER, blobKey, "cw", SAS_TTL_MINUTES, XLSX_CONTENT_TYPE);
    const putRes = await requestUrl(
      `${blobUrl}?${writeSas.sas}`,
      { method: "PUT", headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": XLSX_CONTENT_TYPE, "Content-Length": buffer.length } },
      buffer
    );
    if (putRes.statusCode < 200 || putRes.statusCode >= 300) {
      throw new Error(`Blob PUT failed (${putRes.statusCode}): ${putRes.body}`);
    }

    // 2) Short-lived read SAS with a Content-Disposition filename → the download URL.
    const contentDisposition = `attachment; filename="${filename.replace(/"/g, "")}"`;
    const readSas = await buildUserDelegationSas(STORAGE_ACCOUNT, STORAGE_CONTAINER, blobKey, "r", SAS_TTL_MINUTES, XLSX_CONTENT_TYPE, contentDisposition);
    const downloadUrl = `${blobUrl}?${readSas.sas}`;

    return send(context, 200, successBody({
      downloadUrl,
      filename,
      contentType: XLSX_CONTENT_TYPE,
      byteSize: buffer.length,
      expiresAt: readSas.expiresAt,
    }));
  } catch (err) {
    context.log.error("theo_export_spreadsheet failed", err);
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred generating the spreadsheet.", 500));
  }
};
