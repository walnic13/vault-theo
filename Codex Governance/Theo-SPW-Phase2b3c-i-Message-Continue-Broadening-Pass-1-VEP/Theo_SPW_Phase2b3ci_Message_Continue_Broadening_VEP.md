# Theo — Shared Project Workspace Phase 2b-3c-i: `theo_message` continue broadening (func-premium) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; on APPROVAL Claude Code deploys the one modified handler to `vaultgpt-func-premium` via **Kudu VFS** (PUT + GET-back byte-diff + restart) and runs authenticated golden curls. **Shared Project Workspace, Phase 2b-3c-i (the non-streaming continue path).** The deployed `theo_message` gates appends on explicit `created_by = $oid` (the shared Functions role BYPASSES RLS), so a member cannot continue a published thread. This microstep rewires its persistence path onto the deployed Phase-2b-3a `theo_conversation_access(uuid)` classifier: **(1)** gate the append on the helper (`'owner'|'member'|NULL`; NULL → the existing 403/404 discrimination); **(2)** lock the conversation row `FOR UPDATE` + compute `seq` **conversation-wide** (all authors) so concurrent member appends can't collide and a member's turn appends after every prior message; **(3)** bump `updated_at` by id (access confirmed) so a member post surfaces the shared thread as recently active. **Message INSERTs keep `created_by = caller`** (attribution — a member posts as themselves). The brand-new-conversation branch, the caller's own attachment-link + memory reads, and the model's client-supplied history are all unchanged. No DB/DDL change; no FE change. (`theo_message_stream` on func-stream is the paired Phase 2b-3c-ii.)

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding parent (source baseline): `2af89b28acee9d69e1a9da3d2e94e005b4538665` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the forward submission note; all currency anchors below are tip-independent blob SHAs. The **Primary Reference is the LIVE deployed handler** pulled from func-premium Kudu VFS this turn (blob `93cfce8b8939978020b2b077bb39d9b8a9d96725`).
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Single-handler continue-broadening microstep — NO DB/DDL change (the `theo_conversation_access` helper is already DEPLOYED + verified, schema §11). The modified `theo_message` preserves the entire deployed scaffolding (pg Pool, EasyAuth OID, CORS, the model gateway + tool loop, `set_config` RLS context, memory/attachment reads, `theo_conversation_exists_unscoped` 403/404 discrimination, BEGIN/COMMIT) and changes ONLY the persistence authorization: helper-gated append + conversation row-lock + conversation-wide seq + updated_at bump (§P5 diff). Message INSERTs keep `created_by = caller` (attribution). Modified handler passes `node --check`. Deploy = Kudu VFS (Golden Handler §5.5); curl verification is Claude Code's job. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA) |
| - | ---------------------- | ------------------------------ | -------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | carried grounding (this program; blob-anchored) | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§4/§5) | carried grounding (this program; blob-anchored) | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | carried grounding (this program; blob-anchored) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary reference; §4 allowed deltas; §5.5 deploy + curl) | `Grep` this program (blob-anchored) | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1E deploy authority) | carried grounding (this program; blob-anchored) | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 6 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§11 `theo_conversation_access` helper + publish columns) | `Grep("theo_conversation_access")` (2b-3b, this program) | `abe14dc5d45b8a78b4d2b7303f0bd1257da120ec` |
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 publish contracts — the continue path this opens) | carried grounding (this program; blob-anchored) | `9291b9eecade963514a9f3854bd7cbeb862d9e2f` |
| 8 | **Primary Reference (LIVE deployed handler + function.json)** — func-premium `theo_message` (pulled from Kudu VFS this turn) | `curl`(Kudu VFS GET) + `Read`(persistence block) + `node --check` this turn | `93cfce8b8939978020b2b077bb39d9b8a9d96725` (index.js; function.json `bd476fc8d144ed9592b561b4c0ded84f5911cff0`) |
| 9 | Deployed access-helper migration (referenced) — `Codex Governance/Theo-SPW-Phase2b3a-Conversation-Access-Helper-Pass-1-VEP/spw_phase2b3a_migration.sql` | `Read` this program (2b-3a) | `4d589f83b4954b43196bd7074b1fe29075df0c8f` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No write SQL / no migration (helper already deployed). No FE change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §P5 — Primary Reference = LIVE `theo_message` (inlined verbatim) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Curl verification" | §CURLS — Claude runs authenticated golden curls post-deploy |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §11 | "theo_conversation_access" | §P2/§P5 — the append path is rewired onto the deployed classifier |

---

## P1 — Feature identification
SPW **Phase 2b-3c-i**: make a published conversation CONTINUABLE (non-streaming) by a project member. The deployed `theo_message` (func-premium) gates appends on `created_by = $oid` (the connection role BYPASSES RLS), so a member cannot post into the owner's published thread. This microstep rewires the persistence path onto the deployed `theo_conversation_access(uuid)` classifier, serializes concurrent appends, computes seq conversation-wide, and bumps updated_at for a member post — while attributing each message to its author. Paired with the streaming handler in Phase 2b-3c-ii. No new surface — the enabling backend continue change.

## P2 — Architecture & boundary reconciliation
- **Helper-gated append (single authorization point).** Append authorization moves from `created_by = $oid` to `theo_conversation_access($1) IS NOT NULL` (schema §11 — Rule Anchor). NULL keeps the exact existing 403/404 discrimination via `theo_conversation_exists_unscoped`. The classifier's `'member'` branch is byte-for-byte the §11 access set, so continue access matches the RLS model (and the 2b-3b read gate).
- **Attribution preserved.** Both message INSERTs keep `created_by = caller` (the member posts as themselves), so a multi-party thread attributes each turn to its author — exactly what the 2b-3b conversation-wide read renders.
- **Multi-party seq safety.** A `SELECT 1 FROM theo_conversations WHERE id=$1 FOR UPDATE` locks the conversation row for the rest of the txn, so two members posting at once serialize; seq is then `count(*)` over the whole conversation (all authors). Under the owner-only path this is a no-op (no contention) and identical seq to before (the owner's own count == the conversation count for a private thread).
- **Recency for the shared list.** `updated_at` is bumped by id (access confirmed) so a member's post surfaces the shared conversation in `theo_list_project_conversations` (ordered `updated_at DESC`); owner-only would have left it stale for member posts.
- **Unchanged:** the brand-new-conversation INSERT (`created_by = caller`), the attachment-link (`created_by = caller` — a member links their OWN attachments), the memory read (`created_by = caller` — the member's own memory), the model's client-supplied message history, `set_config`, and the tool loop.
- **Boundary.** One handler on func-premium; no DB change; no `reporting_*`; no FE; deps unchanged.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (`PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Claude Code, Kudu VFS).** PUT the modified `theo_message/index.js` to func-premium; GET-back byte-diff; restart. `function.json` unchanged (POST/OPTIONS). Rollback = re-PUT the retained LIVE baseline (blob `93cfce8`). | **PRE-LAND** — §DEPLOY; Claude runs §CURLS after. |
| G-2 | **Curls.** Owner continues own conversation → 200 (unchanged); non-participant append → 403; absent → 404; unauth → 401; new conversation (no id) → 200 (unchanged). Member-continue-200 needs a two-user fixture (verified via the 2c FE / a manual two-account check — same limitation disclosed in 2b-3b). | **PRE-LAND** — §CURLS. |
| G-3 | **Streaming continue (Phase 2b-3c-ii).** `theo_message_stream` (func-stream) applies the same access gate + seq lock + updated_at bump + attributed INSERT, plus its own project-knowledge/active-project lookups. | **PROCEED (future-trigger)** — the paired, larger handler; separate governed VEP. |
| G-4 | **Cross-author attachment re-inject in a shared thread.** A member's turn re-injects only the member's OWN prior attachments (`created_by = caller`); the owner's attachment CONTENT is already in the client-supplied history text. A deeper "re-inject every author's attachments" is a later enhancement, not required for correctness. | **PROCEED (future)** — disclosed, not a blocker. |

No write SQL. No `reporting_*` change.

## P3 — Backend / contract grounding
No contract shape change: `POST /api/theo_message` is unchanged; the change is WHO may append (owner OR published-project member) and the multi-party seq/updated_at semantics. This realizes the continue half of the Phase-2b-2 publish contracts (API Spec §2.2 — doc 7); no API-Spec edit needed here (the §2.2 row already flags that member read/continue lands in Phase 2b-3). Errors unchanged: 401/403/404/400.

## P4 — Schema definition
None. The `theo_conversation_access` helper + publish columns are already deployed (schema §11). This microstep consumes them.

## P5 — Component reference grounding (Primary Reference + handler delta)
**Primary Reference (Golden Handler §2 — exactly one deployed handler + function.json, inlined verbatim):** the **LIVE** `theo_message` on func-premium, pulled from Kudu VFS this turn (blob `93cfce8`). The modified handler preserves this scaffolding entirely; the **ALLOWED DELTA (§4 — the RLS-scoped query + the deployed governed classifier)** is exactly the unified diff below (access gate; conversation row-lock + conversation-wide seq; updated_at by id). Staged AFTER file: `handlers/theo_message.index.js` (`node --check` clean). `function.json` unchanged (POST/OPTIONS).

Unified diff (LIVE → staged), the complete change set:
```diff
@@ -817,13 +817,17 @@
 
     let conversationId = requestedConversationId;
     if (conversationId) {
-      // Explicit ownership scope (the shared connection role bypasses RLS): a user may only
-      // append to a conversation they own. Non-owned id → 0 rows → 403 (exists) / 404 (absent).
-      const owned = await client.query(
-        `SELECT id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
-        [conversationId, oid]
+      // SPW Phase 2b-3c: appending to an existing conversation is gated by the deployed classifier
+      // theo_conversation_access — 'owner' (the author) or 'member' (it is published to a project the
+      // caller participates in) may continue the thread; NULL means no access. The shared connection
+      // role bypasses RLS, so this explicit gate is the authorization boundary. NULL → 403 (exists) /
+      // 404 (absent), the same discrimination as before via theo_conversation_exists_unscoped.
+      const access = await client.query(
+        `SELECT public.theo_conversation_access($1::uuid) AS role`,
+        [conversationId]
       );
-      if (owned.rowCount === 0) {
+      const accessRole = access.rows[0] ? access.rows[0].role : null; // 'owner' | 'member' | null
+      if (!accessRole) {
         const existsResult = await client.query(
           `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
           [conversationId]
@@ -847,9 +851,19 @@
     }
 
 
+    // SPW Phase 2b-3c: serialize concurrent appends to a SHARED conversation — lock the conversation
+    // row for the rest of this txn so two members posting at once cannot compute the same seq. A no-op
+    // under the owner-only path (no contention). Access is already confirmed above.
+    await client.query(
+      `SELECT 1 FROM public.theo_conversations WHERE id = $1 FOR UPDATE`,
+      [conversationId]
+    );
+
+    // SPW Phase 2b-3c: seq is per-CONVERSATION (all authors) so a member's turn appends after every
+    // prior message in the shared thread, not just the caller's own.
     const seqResult = await client.query(
-      `SELECT count(*)::int AS n FROM public.theo_messages WHERE conversation_id = $1 AND created_by = $2`,
-      [conversationId, oid]
+      `SELECT count(*)::int AS n FROM public.theo_messages WHERE conversation_id = $1`,
+      [conversationId]
     );
     const baseSeq = seqResult.rows[0].n;
 
@@ -889,9 +903,11 @@
       ]
     );
 
+    // SPW Phase 2b-3c: bump updated_at by id (access confirmed above) — a member's post must surface
+    // the shared conversation as recently active (theo_list_project_conversations orders updated_at DESC).
     await client.query(
-      `UPDATE public.theo_conversations SET updated_at = now() WHERE id = $1 AND created_by = $2`,
-      [conversationId, oid]
+      `UPDATE public.theo_conversations SET updated_at = now() WHERE id = $1`,
+      [conversationId]
     );
 
     await client.query("COMMIT");
```

LIVE `theo_message/index.js` (Primary Reference, verbatim — the deployed bytes):
```js
const https = require("https");
const http = require("http");
const { Pool } = require("pg");

const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT;
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MAX_TOKENS = 4096;
const TITLE_MAX_LEN = 80;

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
// (Storage Blob Data Contributor, granted in B8b). Native (PDF/image) inject as document/image
// content blocks; extract-class inject the stored extracted text. Budgets bound the upstream payload.
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
    if (match && typeof match.val === "string" && match.val.trim() !== "") {
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
// blob reads use the Function's system-assigned identity (Storage Blob Data Contributor, B8b).
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
    context.log.error("theo_message: storage token for attachments failed (non-fatal)", tokErr);
    return rows.map((r) => ({ type: "text", text: `[Attached file "${r.filename}" could not be loaded.]` }));
  }

  const blocks = [];
  let nativeBytes = 0;
  let extractChars = 0;
  for (const row of rows) {
    // B8f: honor finalize's classification — a row marked extract-class (e.g. a large PDF promoted
    // to text) injects its extracted text, not a giant document block, even though content_type is
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
      context.log.error(`theo_message: attachment ${row.id} load failed (non-fatal)`, attErr);
      blocks.push({ type: "text", text: `[Attached file "${row.filename}" could not be loaded.]` });
    }
  }
  return blocks;
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
    return send(
      context,
      401,
      errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401)
    );
  }

  if (!FOUNDRY_BASE || !FOUNDRY_DEPLOYMENT) {
    context.log.error("theo_message: missing gateway configuration");
    return send(
      context,
      500,
      errorBody("INTERNAL_SERVER_ERROR", "Model gateway is not configured.", 500)
    );
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)
    );
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Field 'messages' must be a non-empty array.", 400)
    );
  }

  const maxTokens = Number.isInteger(body.max_tokens) ? body.max_tokens : DEFAULT_MAX_TOKENS;
  const systemPrompt = typeof body.system === "string" ? body.system : null;

  // B3 persistence inputs: optional conversation id + app-context anchor; the new user turn is
  // the last user message in the submitted history.
  const requestedConversationId =
    typeof body.conversation_id === "string" && body.conversation_id.trim() !== ""
      ? body.conversation_id.trim()
      : null;
  const appKey =
    typeof body.app_key === "string" && body.app_key.trim() !== "" ? body.app_key.trim() : null;
  const appContext =
    body.app_context != null && typeof body.app_context === "object" ? body.app_context : null;
  // The client sends the user turn as a STRING in messages[] AND any attachment_ids as a SEPARATE
  // top-level field — so userText (persistence/title/history-query) derivation is unchanged; the
  // attachment content blocks are assembled server-side for the upstream payload only.
  const lastUserIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m && m.role === "user" && typeof m.content === "string") return i;
    }
    return -1;
  })();
  const userText = lastUserIndex >= 0 ? messages[lastUserIndex].content : "";

  if (requestedConversationId !== null && !isUuid(requestedConversationId)) {
    return send(
      context,
      400,
      errorBody("BAD_REQUEST", "Field 'conversation_id' must be a valid UUID.", 400)
    );
  }

  // B8d: validate attachment_ids (optional; array of unique UUIDs, capped count).
  let attachmentIds = [];
  if (body.attachment_ids != null) {
    if (!Array.isArray(body.attachment_ids)) {
      return send(context, 400, errorBody("BAD_REQUEST", "Field 'attachment_ids' must be an array of UUIDs.", 400));
    }
    attachmentIds = [...new Set(body.attachment_ids)];
    if (attachmentIds.length > ATTACH_MAX_COUNT) {
      return send(context, 400, errorBody("BAD_REQUEST", `At most ${ATTACH_MAX_COUNT} attachments may be sent per message.`, 400));
    }
    if (!attachmentIds.every((id) => isUuid(id))) {
      return send(context, 400, errorBody("BAD_REQUEST", "Every entry in 'attachment_ids' must be a valid UUID.", 400));
    }
    if (attachmentIds.length > 0 && lastUserIndex < 0) {
      return send(context, 400, errorBody("BAD_REQUEST", "Attachments require a user message with text content.", 400));
    }
  }

  // ---- Memory injection (B7): prepend the user's distilled memory profile to the system prompt ----
  // Read-only, user-scoped (explicit created_by; the shared connection role bypasses RLS), and
  // NON-FATAL — a memory-fetch failure must never break chat, so it degrades to no memory block.
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
      context.log.error("theo_message: memory fetch failed (non-fatal)", memErr);
    } finally {
      if (memClient) {
        memClient.release();
      }
    }
  }
  // ---- History-RAG injection (B7b-2): recall relevant excerpts from the user's PAST conversations ----
  // Non-fatal + user-scoped (created_by filter is the isolation boundary). Skipped silently if the
  // embedding/search config is absent or the index is empty. The current conversation is excluded.
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
      context.log.error("theo_message: history-RAG retrieval failed (non-fatal)", histErr);
    }
  }

  context.log("theo ruleset " + THEO_RULESET_VERSION);
  const effectiveSystem =
    [THEO_RULESET, memoryBlock, historyBlock, systemPrompt].filter((s) => typeof s === "string" && s.trim() !== "").join("\n\n") || null;

  let client = null;
  try {
    // ---- B8d: fetch the OWNED attachment rows + assemble content blocks (before the upstream call) ----
    // Owner-scoped (explicit created_by); any requested id not owned/found → 404 (no leakage).
    // Building the blocks (blob reads) is degrade-on-error; the ownership check is strict.
    // B8k: CONVERSATION-SCOPED attachments (no cap). Fetch every file attached anywhere in this
    // conversation, not just this turn's. Prior turns are already linked by message_seq (== their
    // user-turn index in messages[]); this turn's attachment_ids are not yet linked, so they map to
    // lastUserIndex. Owner-scoped (explicit created_by). rowsBySeq: message-index -> attachment rows[].
    const rowsBySeq = new Map();
    {
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
            throw buildKnownError("NOT_FOUND", "One or more attachments were not found.", 404);
          }
          const orderById = new Map(attachmentIds.map((id, i) => [id, i]));
          const cur = res.rows.sort((a, b) => orderById.get(a.id) - orderById.get(b.id));
          if (!rowsBySeq.has(lastUserIndex)) rowsBySeq.set(lastUserIndex, []);
          rowsBySeq.get(lastUserIndex).push(...cur);
        }
      } finally {
        attClient.release();
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

    const token = await getFoundryToken();

    const upstreamPayload = JSON.stringify({
      model: FOUNDRY_DEPLOYMENT,
      max_tokens: maxTokens,
      ...(effectiveSystem ? { system: effectiveSystem } : {}),
      messages: messagesForUpstream,
      tools: buildGroundingTools(),
      stream: false,
    });

    const upstream = await requestUrl(
      `${FOUNDRY_BASE}/anthropic/v1/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "anthropic-version": ANTHROPIC_VERSION,
          "anthropic-beta": WEB_FETCH_BETA,
          "Content-Length": Buffer.byteLength(upstreamPayload),
        },
      },
      upstreamPayload
    );

    const parsed = parseJsonSafe(upstream.body);

    if (upstream.statusCode < 200 || upstream.statusCode >= 300 || !parsed) {
      context.log.error("theo_message: gateway non-2xx", upstream.statusCode);
      if (upstream.statusCode === 429) {
        return send(
          context,
          429,
          errorBody("RATE_LIMITED", "Model gateway rate limit exceeded.", 429)
        );
      }
      return send(
        context,
        502,
        errorBody("BAD_GATEWAY", "Model gateway call failed.", 502)
      );
    }

    const textContent = Array.isArray(parsed.content)
      ? parsed.content.filter((b) => b && b.type === "text")
      : [];
    const assistantModel = typeof parsed.model === "string" ? parsed.model : FOUNDRY_DEPLOYMENT;
    const assistantText = textContent
      .map((b) => (typeof b.text === "string" ? b.text : ""))
      .join("");
    const assistantCitations = textContent.flatMap((b) =>
      Array.isArray(b.citations) ? b.citations : []
    );

    // ---- Persist the turn (HF-T2; explicit created_by ownership; shared vaultgpt instance) ----
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
      // Explicit ownership scope (the shared connection role bypasses RLS): a user may only
      // append to a conversation they own. Non-owned id → 0 rows → 403 (exists) / 404 (absent).
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
        assistantText,
        assistantModel,
        assistantCitations.length ? JSON.stringify(assistantCitations) : null,
      ]
    );

    await client.query(
      `UPDATE public.theo_conversations SET updated_at = now() WHERE id = $1 AND created_by = $2`,
      [conversationId, oid]
    );

    await client.query("COMMIT");

    return send(
      context,
      200,
      successBody({
        conversation_id: conversationId,
        role: typeof parsed.role === "string" ? parsed.role : "assistant",
        model: assistantModel,
        content: textContent,
        stop_reason: parsed.stop_reason != null ? parsed.stop_reason : null,
        usage: parsed.usage != null ? parsed.usage : null,
      })
    );
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_message failed", err);

    if (err && err.code === "42501") {
      return send(
        context,
        403,
        errorBody("FORBIDDEN", "You do not have permission for this conversation.", 403)
      );
    }

    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(
        context,
        err.status,
        errorBody(err.code, err.message, err.status)
      );
    }

    return send(
      context,
      500,
      errorBody("INTERNAL_SERVER_ERROR", "Failed to process message.", 500)
    );
  } finally {
    if (client) {
      client.release();
    }
  }
};
```
LIVE `theo_message/function.json` (verbatim; unchanged by this microstep):
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_message"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## P6 — Repository & active-surface grounding
Pass-3 deploys the staged `handlers/theo_message.index.js` to func-premium via Kudu VFS (overwrite `/site/wwwroot/theo_message/index.js`), GET-back byte-diff, restart. The LIVE baseline (blob `93cfce8`) is retained in `primary-reference/` for rollback. Guardrails: no `reporting_*`; no DB change; `function.json`/other handlers untouched; modified handler `node --check` clean. Verified via §CURLS. (The package also commits the modified handler + LIVE baseline to `development` for provenance; func-premium is deployed by VFS, not run-from-package.)

## P7 — Risk / regression
- **Live-traffic handler — minimal, additive-authorization delta.** Confined to the persistence authorization: helper gate + row-lock + drop two `created_by` filters. Owner appends are unchanged behavior (an owner classifies `'owner'`; the FOR-UPDATE lock is uncontended; `count(*)` over the conversation == the owner's own count for a private thread; updated_at by id updates the owner's own row). No path removed; 403/404 discrimination byte-preserved.
- **No over-exposure.** A member may append only to a conversation the deployed classifier admits (owner OR published-in-their-project) — the same predicate as §11 RLS + the 2b-3b read gate. Non-participant → 403; absent → 404.
- **Concurrency correctness.** The conversation row-lock serializes concurrent multi-party appends, preventing seq collisions that the prior owner-only path never had to consider.
- **Attribution integrity.** Message INSERTs keep `created_by = caller`; a member can never post as another user.
- **Rollback is instant.** Re-PUT the retained LIVE baseline via VFS + restart. `node --check` clean; no dependency/config change.
- **Determinism:** authenticated golden curls (§CURLS) assert owner-continue-200 (regression), new-conversation-200, non-participant-403, absent-404, unauth-401 post-deploy.

## P8 — VEP assembly
GCR + Rule Anchors open the pack; P1–P8 walked; Gap Register (G-1 deploy PRE-LAND; G-2 curls PRE-LAND; G-3 streaming PROCEED; G-4 attachment re-inject PROCEED); Primary Reference = LIVE handler inlined verbatim + the complete unified diff + staged AFTER handler (`node --check` clean); Kudu VFS §DEPLOY; golden curls §CURLS. Plan-only. On Codex APPROVAL, Claude Code executes Pass-3 (VFS PUT + GET-back diff + restart, run §CURLS), commits to `development`; then Phase 2b-3c-ii (the streaming continue path).

---

## §DEPLOY — Kudu VFS deploy (Claude Code; Golden Handler §5.5)
1. Management token (`az account get-access-token --resource https://management.core.windows.net/`); SCM host `vaultgpt-func-premium-a7agb7f5a8d8eeet.scm.uksouth-01.azurewebsites.net`.
2. **PUT** the staged `handlers/theo_message.index.js` → `/api/vfs/site/wwwroot/theo_message/index.js` (`If-Match: *`).
3. **GET-back** the same VFS path and byte-diff against the staged file (MUST be identical).
4. `az functionapp restart -n vaultgpt-func-premium -g Vault-Tax`.
5. **Rollback:** PUT the retained LIVE baseline `primary-reference/theo_message.LIVE.index.js` (blob `93cfce8`) back + restart.

## §CURLS — authenticated golden curls (Claude Code; §5.5)
Auth: `az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e` (Bearer; never printed). Base `https://vaultgpt-func-premium-a7agb7f5a8d8eeet.uksouth-01.azurewebsites.net`. Edges:
- **Owner path (regression):** `POST theo_message` with a `conversationId` the caller owns + a short prompt → **200** (turn persists; seq/updated_at correct).
- **New conversation (regression):** `POST theo_message` with NO conversationId → **200** (creates the conversation, as before).
- **Non-participant:** `POST` with a `conversationId` published to a project the caller is NOT in → **403**; a private non-owned conversation → **403**.
- **Absent:** random-uuid conversationId → **404**; bad uuid → **400**; unauth → **401**.
- **Member path (new — two-user fixture, FE/manual):** as a project member, `POST` with the owner's PUBLISHED conversationId → **200**, the turn appended with `created_by = the member` (attribution) after the owner's messages.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of SPW Phase 2b-3c-i `theo_message` continue-broadening Pass-1 Backend VEP (plan only).*
