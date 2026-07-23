# Primary Reference — deployed `engine/chat-tools.js` on vaultgpt-func-stream (LIVE snapshot)

Fetched via Kudu VFS GET `/site/wwwroot/src/engine/chat-tools.js` on 2026-07-23. Verbatim, full, no ellipsis.

```js
'use strict';
/**
 * General-chat tool registry + HTTP dispatch (DR-T11).
 *
 * Unlike the Sigma engine tools (pure functions of a parsed-workbook ctx), general-chat tools are
 * model-callable capabilities backed by HTTP endpoints on `vaultgpt-func-theo-tools`. The streaming
 * loop in theo_message_stream exposes CHAT_TOOL_SCHEMAS to Claude, dispatches each `tool_use` block
 * to its endpoint AS THE SIGNED-IN USER (the caller's bearer is forwarded — func-stream and
 * func-theo-tools share the api://4e1a1e31-... audience, so the same delegated token authorizes the
 * call), feeds the tool_result back, and — for a `downloadable` tool — emits an `event: vault_export`
 * SSE frame carrying the result so the FE can render a download card.
 *
 * Add a tool = one CHAT_TOOLS entry. Every dispatch is a stateless HTTPS POST; no in-process side
 * effects and no elevated credentials (the user's own token, nothing more).
 */
const https = require('https');
const http = require('http');

// Base URL of the Theo tools app (override via env). Trailing slashes trimmed.
const TOOLS_BASE = (process.env.THEO_TOOLS_BASE || 'https://vaultgpt-func-theo-tools.azurewebsites.net').replace(/\/+$/, '');
const TOOL_TIMEOUT_MS = parseInt(process.env.THEO_TOOL_TIMEOUT_MS, 10) > 0 ? parseInt(process.env.THEO_TOOL_TIMEOUT_MS, 10) : 60000;

// The registry. `downloadable: true` marks a tool whose success result is a file
// ({ downloadUrl, filename, contentType, byteSize, expiresAt }) → the loop emits event: vault_export.
const CHAT_TOOLS = [
  {
    name: 'theo_export_spreadsheet',
    route: 'theo_export_spreadsheet',
    downloadable: true,
    description:
      'Generate a downloadable Excel (.xlsx) workbook from structured data the user asked to export ' +
      '(for example, figures you extracted from a prior-year K-1 or other document). Call this when the ' +
      'user wants their data AS a spreadsheet / Excel file to download. Provide typed columns and rows: ' +
      'put numbers as JSON numbers and dates as ISO date strings so the cells are real numeric/date cells. ' +
      'The result is shown to the user as a download card, so after the tool returns, briefly confirm the ' +
      'file is ready — do not paste the raw link.',
    input_schema: {
      type: 'object',
      properties: {
        filename: { type: 'string', description: 'Friendly file name WITHOUT extension, e.g. "2024 K-1 Export".' },
        sheets: {
          type: 'array',
          description: 'One or more sheets to write.',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Sheet/tab name.' },
              columns: {
                type: 'array',
                description: 'Ordered column definitions.',
                items: {
                  type: 'object',
                  properties: {
                    key: { type: 'string', description: 'Row-object key this column reads.' },
                    header: { type: 'string', description: 'Column header text (defaults to key).' },
                    type: { type: 'string', enum: ['text', 'number', 'date'], description: 'Cell type (default text).' },
                  },
                  required: ['key'],
                },
              },
              rows: {
                type: 'array',
                description: 'Each row is an object keyed by the column keys.',
                items: { type: 'object', additionalProperties: true },
              },
            },
            required: ['columns'],
          },
        },
      },
      required: ['sheets'],
    },
  },
  {
    name: 'theo_fetch_image',
    route: 'theo_fetch_image',
    downloadable: false,
    description:
      'Fetch an image from an https URL that is ALREADY in the conversation (a link the user pasted, ' +
      'or one surfaced by web_search) so you can SEE it. Input: { url }. The image is returned to you ' +
      'as a viewable image. Call this when the user references an image by URL and asks what it shows / ' +
      'to describe or analyze it. Only https image URLs are supported (png, jpeg, webp, gif); do not ' +
      'invent URLs — only fetch ones present in the conversation.',
    input_schema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'The https URL of the image to fetch (must already appear in the conversation).' },
      },
      required: ['url'],
    },
  },
];

const BY_NAME = new Map(CHAT_TOOLS.map((t) => [t.name, t]));

// Anthropic tool schemas (name/description/input_schema only) exposed to the model alongside the
// built-in web_search/web_fetch tools.
const CHAT_TOOL_SCHEMAS = CHAT_TOOLS.map(({ name, description, input_schema }) => ({ name, description, input_schema }));

const isChatTool = (name) => BY_NAME.has(name);
const isDownloadable = (name) => { const t = BY_NAME.get(name); return !!(t && t.downloadable); };

// One HTTPS POST returning { statusCode, body } (body parsed JSON or null). Never throws.
function postJson(urlStr, bearer, bodyObj) {
  return new Promise((resolve) => {
    let url;
    try { url = new URL(urlStr); } catch { return resolve({ statusCode: 0, body: null }); }
    const lib = url.protocol === 'http:' ? http : https;
    const payload = JSON.stringify(bodyObj || {});
    const req = lib.request(
      {
        method: 'POST',
        hostname: url.hostname,
        port: url.port ? Number(url.port) : 443,
        path: url.pathname + url.search,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearer}`,
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let d = '';
        res.on('data', (c) => { d += c; });
        res.on('end', () => { let j = null; try { j = d ? JSON.parse(d) : null; } catch { j = null; } resolve({ statusCode: res.statusCode || 0, body: j }); });
      }
    );
    req.on('error', () => resolve({ statusCode: 0, body: null }));
    req.setTimeout(TOOL_TIMEOUT_MS, () => { try { req.destroy(); } catch {} resolve({ statusCode: 0, body: null }); });
    req.write(payload);
    req.end();
  });
}

/**
 * Dispatch a client-side chat tool over HTTP to func-theo-tools AS THE USER (bearer forwarded).
 * Returns the tool's own success `data` object (what the model reads back as tool_result), or a
 * compact { error } string the model can read and relay. Never throws.
 */
async function dispatchChatTool(name, input, opts) {
  const bearer = opts && opts.bearer;
  const tool = BY_NAME.get(name);
  if (!tool) return { error: `unknown tool ${name}` };
  if (!bearer) return { error: 'no delegated token available to call the tool as the user' };
  const res = await postJson(`${TOOLS_BASE}/api/${tool.route}`, bearer, input || {});
  if (res.statusCode >= 200 && res.statusCode < 300 && res.body && res.body.data) return res.body.data;
  const msg = (res.body && res.body.error && res.body.error.message) || `tool call failed (HTTP ${res.statusCode})`;
  return { error: msg };
}

module.exports = { CHAT_TOOLS, CHAT_TOOL_SCHEMAS, isChatTool, isDownloadable, dispatchChatTool };
```
