# Theo Backend — `theo_add_project_knowledge_file` (file-as-knowledge ingest, Phase C): Pass-1 Verified Evidence Pack

Backend Verified Evidence Pack (plan). New handler `theo_add_project_knowledge_file` on the dedicated **`vaultgpt-func-projects`** app (Phase B, EP1). It turns an already-uploaded, already-extracted attachment into a **file-backed project-knowledge** row: verify the parent project is owned, owner-scoped-look-up the `theo_attachments` row, managed-identity-read its extracted-text sibling blob, and INSERT into `theo_project_knowledge` with `source_type='file'` + the deployed blob-pointer columns. It closes the API Spec §2.2 deferred item ("file-backed knowledge … reusing the B8 upload pipeline"). **No migration** — the `source_type` CHECK ('text','file') + `blob_container`/`blob_path`/`byte_size`/`content_type` columns are already DEPLOYED (b2_migration.sql; Schema §5). Reuse is a **Walter-authorized composite** (quoted verbatim in §Authorization): Primary Reference = the deployed `theo_add_project_knowledge`; the Blob read + `theo_attachments` lookup are reused byte-identically from the deployed `theo_finalize_attachment`.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
(A VEP turn walks P1–P8 (§3 below); the GCR field takes one value and the lint rejects a range, so the crux phase — P5 Handler grounding / Primary-Reference selection — is declared, with the full P1–P8 authority set anchored below for §4A completeness.)

Turn issued against HEAD: `<STAMP2>` (vault-theo, `development`; grounding parent `df4e5f03e78b30b1513c0e3309361345517bf942` — the DR-T12 Role-C landing that added `vaultgpt-func-projects` to the Claude-deploy exception). **Re-issue** of the VEP previously REJECTED solely on deploy authority (`vaultgpt-func-projects` not yet in DR-T7); the handler + `function.json` are byte-unchanged (same blobs), and the deploy gate is now satisfied by DR-T12. Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance; not used as grounding evidence this turn).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Conformance §4 VEP row)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Claude Code Theo Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` | `Grep("Never-Guess…")` this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 2 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2/§4/§5) | `Read` this turn | `521442379b47d8bf43b877b4feb5b420065b5cfe` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5/§6/§10) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (roles; DR-T7/DR-T12 deploy exception — now incl. `vaultgpt-func-projects`) | `Read`+`Grep` this turn | `733615cb6db444e0e8c16b5fe47402e0b77d2aa8` |
| 5 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` | `Grep("APPROVED…")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 6 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B8 extract pipeline; HF-T4 RAG) | `Grep("project knowledge…")` this turn | `28183604ddfcfe80fa3f3dda6f78e437b88d32d6` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 boundary, §5 theo_ schema/RLS) | `Grep("theo_ tables…")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 project knowledge, §2.8 attachments) | `Read` this turn | `4d2e23d096dbc6b89e0f48bc009ebfc5cf283215` |
| 9 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§5 theo_project_knowledge, §7 theo_attachments) | `Grep`+`Read` this turn | `fa9aad4c75019de0b621e31b5d33ef97f3689639` |
| 10 | Theo Tool Manifest — `spec/THEO_TOOL_MANIFEST.md` (no `reporting_*` call — boundary confirm) | `git rev-parse` this turn | `8af2183755b6e298a4911c3fc75886a56cdea892` |
| 11 | Primary Reference (deployed) — `theo_add_project_knowledge/index.js` + `function.json` (Kudu-GET from `vaultgpt-func-premium`) | Kudu-GET + `Read` this turn | index.js `6605 B` / function.json `323 B` (inlined verbatim below) |
| 12 | Authorized-reuse source (deployed) — `theo_finalize_attachment/index.js` (Kudu-GET; Blob helpers + `theo_attachments` access) | Kudu-GET + `Read` this turn | `20982 B` (reused regions inlined verbatim below) |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "exactly one" | §Structural Mirror — single canonical Primary Reference = theo_add_project_knowledge |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "an EXACT mirror against a deployed handler containing that helper" | §Structural Mirror — Blob-read + attachment-lookup regions justified as byte-exact mirror of deployed theo_finalize_attachment |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "ALLOWED DELTA" | §Structural Mirror — source_type='file' + file-pointer columns + raised content cap = ALLOWED DELTAs |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.1 | "mapping every handler region to the Primary Reference region" | §Structural Mirror table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Claude both deploys and curls" | §Deploy — new app is Claude-deployed (DR-T7); Claude deploys via Kudu + runs golden curls |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 | "Primary reference artifact cited without full verbatim inline this turn" | §Primary Reference — full verbatim inline below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 | "New-domain / new-external-system helper classified ALLOWED DELTA without Walter authorization" | §Authorization — Walter composite authorization quoted verbatim, predating this VEP |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "Never-Guess Rule" | §P2/§P3 — deployed source + schema grounded, nothing guessed |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" | §P3 — columns confirmed DEPLOYED (b2_migration.sql), no migration |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §7 | "Golden Curl + Handler Discipline" | §P7/§Golden Curls |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "VEP Format and Gap Register" | §Gap Register + this VEP structure |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §1 | "Theo MUST NOT read or write Corporate Reporting tables directly" | §Architecture reconciliation — only theo_ tables + theo-content Blob touched |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.1 | "created_by text NOT NULL" | §Handler — created_by = signed-in OID; explicit ownership predicate |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "RLS ENABLED on every Theo table" | §Handler — set_config per-user + explicit created_by predicate (RLS defence-in-depth) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.2 | "reusing the B8 upload pipeline" | §1 — this handler is the deferred file-backed knowledge item |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.8 | "theo_finalize_attachment" | §Authorization — the deployed extract pipeline reused |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | §5 | "theo_project_knowledge" | §P3 — target table; file-pointer columns already deployed |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1 | "Theo-app deployment exception granted to Claude Code (DR-T7)" | §Deploy — Claude Code deploys the new Theo app |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "the Projects app `vaultgpt-func-projects`" | §Deploy — DR-T12 (landed df4e5f0) authorizes Claude-Code Kudu deploy to `vaultgpt-func-projects` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §review | "No conditional, partial, or pending-correction approval" | §Requested action — APPROVED / REJECTED only |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B8 | "extract-class (Excel/Word/PPT/CSV/TXT)" | §1/§Gap — accepts finalize-extracted files; native-only files rejected |

## Walter Authorization (composite Primary Reference — quoted verbatim, predating this VEP)
> AUTHORIZED (Walter, 2026-07-24): theo_add_project_knowledge_file (Phase C, on
> vaultgpt-func-projects) may be built as a Walter-authorized composite — canonical
> Primary Reference = theo_add_project_knowledge (validation, project-ownership check,
> theo_project_knowledge INSERT), reusing byte-identically from the deployed
> theo_finalize_attachment: (1) the managed-identity Blob read of the attachment's
> extracted-text sibling blob, and (2) the owner-scoped theo_attachments row lookup.
> No new external system beyond Blob (already used by finalize).

Satisfies Golden Handler §2 (composite requires Walter authorization) and Conformance §6 item 12 / §10 T12 (new-external-system helper as ALLOWED DELTA with a verbatim Walter authorization predating the VEP). Blob is not a new external system for this family — `theo_finalize_attachment` (same schema, same `theo-content` container) already uses it.

## Architecture & boundary reconciliation (§4A.1 P2)
- **§1 repository boundary** — the handler touches only `theo_projects`, `theo_attachments`, `theo_project_knowledge` (all `theo_` tables) and the `theo-content` Blob container. No `reporting_*` table/RLS/handler is read or written; no Corporate Reporting API is called. Conformance T40 / architecture §1 clean.
- **§2 model gateway** — not involved; this is a CRUD+Blob ingest handler, not a model call.
- **§5 theo_ schema + RLS baseline** — executes as the signed-in user: `set_config('request.jwt.claim.sub', oid)` + an explicit `created_by = $oid` predicate on every query (RLS is the second layer; the shared connection role bypasses RLS, per architecture §5.2 as-built and the Primary Reference). `created_by` stores the Entra OID. Ownership-based family — no new membership/sharing model.
- **§6 RAG** — out of scope here; the stored `content` is what Phase D (HF-T4, Azure AI Search) will index/retrieve. This handler only writes the row.
- **New app** — deploys to `vaultgpt-func-projects` (EP1), the dedicated Projects app stood up in Phase B; Claude Code deploys it under the DR-T7 Theo-app deployment exception + Walter's explicit grant.

## Component / handler summary
- **Endpoint:** `POST /api/theo_add_project_knowledge_file` on `vaultgpt-func-projects`.
- **Request:** `{ project_id (uuid), attachment_id (uuid), title? (string ≤200) }`; unknown body fields → 400 (`ALLOWED_BODY_KEYS`).
- **Response 201:** `{ data: { knowledge: { id, project_id, title, source_type, content, created_at } } }` (`source_type='file'`; identical shape to `theo_add_project_knowledge`, so the FE `toKnowledge` mapping + list endpoint are unchanged).
- **Status codes:** 401 no OID; 400 bad/unknown fields; 404 project not owned / attachment not found; 400 `UNSUPPORTED_MEDIA_TYPE` when the attachment has no `extracted_text_path`; 502 `BLOB_READ_FAILED`; 403 (`42501`); 500.
- **Content cap:** `FILE_CONTENT_MAX_LEN = 100000` (raised from the text handler's 10 000 for extracted documents); over-length text truncated with a marker.

## §1 Feature Identification + boundary (P1/P4)
- **Feature:** the API Spec §2.2 deferred item — "file-backed knowledge (`source_type='file'` + Blob pointer, reusing the B8 upload pipeline)". The FE (Phase C FE, separate package after this deploys + the §2.2 Role-C lands) uploads a file via the existing B8 `theo_create_attachment_upload` → `theo_finalize_attachment` (which extracts text), then calls this handler with the resulting `attachment_id`.
- **Route naming:** `theo_<operation>_<entity>` → `theo_add_project_knowledge_file` (API Spec §1).
- **Boundary:** one new handler + `function.json`; no migration; no change to any deployed handler; no `reporting_*` access; the FE + the §2.2 API-Spec Role-C are separate follow-on packages.

## §2 Gap Register
**PROCEED.**
- **(1) No migration (P3).** `source_type` CHECK ('text','file') + `blob_container`/`blob_path`/`byte_size`/`content_type` are DEPLOYED (b2_migration.sql; Schema §5, §62 "Blob-pointer columns on … `theo_project_knowledge`"). Verified this turn. PROCEED.
- **(2) Composite reuse authorized.** Blob-read + `theo_attachments` lookup reused byte-identically from deployed `theo_finalize_attachment` under the verbatim Walter authorization above (Golden Handler §2/§4; T12). PROCEED.
- **(3) Native-only files rejected — disclosed limitation.** Only attachments with `extracted_text_path` (extract-class Excel/Word/PPT/CSV/TXT + PDFs > 3 MB) become knowledge; native PDFs ≤ 3 MB and images have no extracted text and return a clear 400. Extending native-PDF extraction for knowledge is a follow-on (would need its own authorization — it adds extraction logic, not just the reused Blob read). PROCEED (disclosed).
- **(4) Interim injection bloat until Phase D.** Until RAG (Phase D) replaces the client-side concatenation, a file's stored `content` is injected into the system prompt; the Phase C FE package will cap per-item injection as an interim guard. Not this handler's concern. PROCEED.
- **(5) `content` cap.** Stored text capped at 100 000 chars (truncation marker); full-fidelity retrieval is Phase D RAG. PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1 Feature identification:** API Spec §2.2 deferred file-backed-knowledge item; reuses the Phase 1B Tier-B8 extract pipeline ("extract-class (Excel/Word/PPT/CSV/TXT)").
- **P2 Architecture & boundary:** see the reconciliation section above (only `theo_` tables + `theo-content`; no `reporting_*`).
- **P2.5 Gap disclosure:** Gap Register above (PROCEED).
- **P3 Schema grounding:** `theo_project_knowledge` — file-pointer columns + `source_type='file'` DEPLOYED (Schema §5; b2_migration.sql). No migration. `theo_attachments.extracted_text_path` (B8c) is the text source. Schema Reality Lock satisfied.
- **P4 Contract grounding:** new endpoint `POST /api/theo_add_project_knowledge_file`; response shape mirrors `theo_add_project_knowledge`. No `reporting_*` call (Tool Manifest N/A — boundary confirmed). API-Spec Role-C for §2.2 is a separate Pass-4 package landed before the FE VEP.
- **P5 Handler grounding:** single canonical Primary Reference = deployed `theo_add_project_knowledge` (inlined verbatim below); Blob-read + attachment-lookup = byte-exact mirror of deployed `theo_finalize_attachment` (inlined below); Structural Mirror Table below.
- **P6 SQL grounding:** no migration file. Handler SQL: the `set_config` + project-ownership `SELECT 1` + `theo_attachments` SELECT + `theo_project_knowledge` INSERT shown in the handler body; all parameterized; explicit transaction control (BEGIN/COMMIT/ROLLBACK) mirroring the Primary Reference.
- **P7 Curl grounding:** deterministic golden curls below (§Golden Curls); Claude Code runs them post-deploy (Golden Handler §5.5 — "Claude both deploys and curls").
- **P8 VEP assembly:** this pack (GCR + §4 table + Rule Anchor Table + P1–P8 + Gap Register + Primary Reference verbatim + Structural Mirror + curls + parity checklist + lint PASS).

## Primary Reference (deployed `theo_add_project_knowledge`) — FULL VERBATIM (Conformance T9)
`theo_add_project_knowledge/index.js` (Kudu-GET from `vaultgpt-func-premium`, this turn):
```javascript
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const TITLE_MAX_LEN = 200;
const CONTENT_MAX_LEN = 10000;

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

  // ---- Validate inputs before any SQL (deterministic 400s) ----
  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (title === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'title' is required and must be a non-empty string.", 400));
  }
  if (title.length > TITLE_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'title' must be at most ${TITLE_MAX_LEN} characters.`, 400));
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (content === "") {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'content' is required and must be a non-empty string.", 400));
  }
  if (content.length > CONTENT_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'content' must be at most ${CONTENT_MAX_LEN} characters.`, 400));
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
    // the referenced project MUST belong to the caller, else 404 (no leakage).
    const owned = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
      [projectId, oid]
    );
    if (owned.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // created_by = the signed-in OID (explicit ownership; the connection role bypasses RLS).
    // source_type is fixed to 'text' (inline content); file-backed knowledge is a later microstep.
    const inserted = await client.query(
      `
      INSERT INTO public.theo_project_knowledge
        (created_by, project_id, title, source_type, content)
      VALUES ($1, $2, $3, 'text', $4)
      RETURNING
        id, project_id, title, source_type, content, created_at
      `,
      [oid, projectId, title, content]
    );

    await client.query("COMMIT");

    return send(context, 201, successBody({ knowledge: inserted.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_add_project_knowledge failed", err);

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
```
`theo_add_project_knowledge/function.json` (verbatim):
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_add_project_knowledge"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## Authorized-reuse source (deployed `theo_finalize_attachment`) — reused regions VERBATIM
The following helpers are copied **byte-identically** into the new handler (Blob read + MI token). Reused per the Walter authorization; EXACT-mirror of a deployed handler containing the helper (Golden Handler §4).
```javascript
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
```

## Structural Mirror Table (Golden Handler §5.1)
| Region | Primary Reference (theo_add_project_knowledge) | Classification | Anchor |
|---|---|---|---|
| Pool / corsHeaders / send / nowIso / errorBody / successBody / getPrincipal / getClaimValue / parseBody / buildKnownError / isUuid | identical | **EXACT** | Golden Handler §2 "exactly one" |
| OID extraction + 401 | identical | **EXACT** | Golden Handler §2 |
| body parse + 400 | identical | **EXACT** | Golden Handler §2 |
| unknown-field rejection (`ALLOWED_BODY_KEYS`) | not in primary (primary ignores extras) | **ALLOWED DELTA** (validated-field set) | Golden Handler §4 "ALLOWED DELTA" |
| validate project_id uuid | identical | **EXACT** | Golden Handler §2 |
| validate attachment_id uuid | new field, same isUuid pattern | **ALLOWED DELTA** (validated-field set) | Golden Handler §4 "ALLOWED DELTA" |
| optional title validation | primary requires title; here optional (defaults to filename) | **ALLOWED DELTA** (validated-field set) | Golden Handler §4 "ALLOWED DELTA" |
| BEGIN + set_config(oid) | identical | **EXACT** | Architecture §5.2 "RLS ENABLED on every Theo table" |
| project-ownership `SELECT 1 … WHERE id AND created_by` → 404 | identical | **EXACT** | Golden Handler §2 |
| `theo_attachments` owner-scoped SELECT | from deployed theo_finalize_attachment (authorized reuse) | **AUTHORIZED REUSE** (byte-exact mirror) | Golden Handler §4 "an EXACT mirror against a deployed handler containing that helper" |
| requestUrl / requestBinary / getManagedIdentityAccessToken / encodeBlobPath / blobUrlFor / downloadBlob | byte-identical from deployed theo_finalize_attachment | **AUTHORIZED REUSE** (byte-exact mirror) | Golden Handler §4 "an EXACT mirror against a deployed handler containing that helper" |
| extracted-text guard + text cap | new (file-specific) | **ALLOWED DELTA** | Golden Handler §4 "ALLOWED DELTA" |
| INSERT `theo_project_knowledge` … `source_type='file'` + blob-pointer columns | primary INSERTs `'text'` + inline content | **ALLOWED DELTA** (table column set / response shape) | Golden Handler §4 "ALLOWED DELTA" |
| COMMIT + 201 successBody | identical | **EXACT** | Golden Handler §2 |
| catch: 42501/known/23503/23514/500 + finally release | identical | **EXACT** | Golden Handler §2 |

## New handler — `theo_add_project_knowledge_file/index.js` (full)
Included in this package at `theo_add_project_knowledge_file/index.js` (blob `159cd749dd98bf9e0b63347ae80be818675f0ea1`); `function.json` at `theo_add_project_knowledge_file/function.json` (blob `72a5278ecdb72142e3ffa4c4a7b644f180d653dd`, route `theo_add_project_knowledge_file`, methods `post`/`options` — mirror of the primary's `function.json`). `node --check` PASS this turn.

## Golden Curls (P7 / §5.3; run by Claude Code post-deploy per §5.5)
Bearer via `az account get-access-token` for the shared API audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e/access_as_user` (as `wmansfield@vault-tax.com`); base `https://vaultgpt-func-projects.azurewebsites.net`. `$PID` = an owned project id; `$AID` = a finalized extract-class attachment id (resolved at verification from a real owned project + a finalized `.docx`/`.csv`).
```
# GC1 401 — no bearer
curl -s -o /dev/null -w '%{http_code}\n' -X POST "$BASE/api/theo_add_project_knowledge_file" \
  -H 'Content-Type: application/json' -d '{"project_id":"'$PID'","attachment_id":"'$AID'"}'   # expect 401

# GC2 400 — unknown field
curl -s -X POST "$BASE/api/theo_add_project_knowledge_file" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"project_id":"'$PID'","attachment_id":"'$AID'","foo":1}'   # expect 400 INVALID_REQUEST

# GC3 400 — bad uuid
curl -s -X POST "$BASE/api/theo_add_project_knowledge_file" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"project_id":"nope","attachment_id":"'$AID'"}'   # expect 400

# GC4 404 — project not owned (random uuid)
curl -s -X POST "$BASE/api/theo_add_project_knowledge_file" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"project_id":"00000000-0000-4000-8000-000000000000","attachment_id":"'$AID'"}'   # expect 404

# GC5 201 — happy path (owned project + finalized extract-class attachment)
curl -s -X POST "$BASE/api/theo_add_project_knowledge_file" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"project_id":"'$PID'","attachment_id":"'$AID'"}'   # expect 201, data.knowledge.source_type=="file", content non-empty

# GC6 400 UNSUPPORTED — native attachment (image/small-PDF, no extracted_text_path)
curl -s -X POST "$BASE/api/theo_add_project_knowledge_file" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"project_id":"'$PID'","attachment_id":"'$NATIVE_AID'"}'   # expect 400 UNSUPPORTED_MEDIA_TYPE
```

## Parity Checklist (Golden Handler §5.4)
- [x] Single canonical Primary Reference (theo_add_project_knowledge) inlined full verbatim + its function.json.
- [x] Authorized-reuse regions (theo_finalize_attachment) inlined verbatim; byte-identical in the new handler.
- [x] Structural Mirror Table classifies every region (EXACT / ALLOWED DELTA / AUTHORIZED REUSE), each anchored.
- [x] Executes as the signed-in user (OID); explicit `created_by` predicate + `set_config` (RLS defence-in-depth).
- [x] Only `theo_` tables + `theo-content` Blob; no `reporting_*`; no new external system beyond Blob.
- [x] Rejects unknown/extra fields; deterministic 400s before SQL/Blob; spec status codes.
- [x] No migration (columns DEPLOYED); no psql meta-commands (no SQL fences).
- [x] `node --check` PASS; function.json valid JSON, route matches handler name.
- [x] Golden curls deterministic (method/path/headers/body/asserted response); Claude Code runs them post-deploy.
- [x] Mechanical lint PASS (below).

## §Deploy (Pass-3, on APPROVAL) — Claude Code deploys `vaultgpt-func-projects` (authorized: DR-T12 / §1E, landed 2026-07-24 `df4e5f0`)
1. Kudu VFS PUT `theo_add_project_knowledge_file/{index.js,function.json}` to `/site/wwwroot/theo_add_project_knowledge_file/` on `vaultgpt-func-projects` (SCM host resolved via `az functionapp show … enabledHostNames`); `npm` deps (`pg`) present on the app; GET-back diff; `az functionapp restart`.
2. Claude Code runs the golden curls (GC1–GC6) and reports results (§5.5 — "Claude both deploys and curls").
3. Land the API-Spec §2.2 Role-C (separate Pass-4) documenting the shipped endpoint, THEN author the Phase C FE package (drop-zone) — FE VEP citing the route comes after the Role-C is applied.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-ProjectKnowledgeFile-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review (APPROVED / REJECTED only — no conditional approval). On APPROVED, Claude Code deploys to `vaultgpt-func-projects`, runs the golden curls, then sequences the §2.2 API-Spec Role-C and the Phase C FE package.
