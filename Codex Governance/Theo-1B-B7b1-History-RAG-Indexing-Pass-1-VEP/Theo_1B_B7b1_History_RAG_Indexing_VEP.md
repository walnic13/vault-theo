# Theo 1B — B7b-1 History-RAG Indexing (`theo_index_messages` timer) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete migration + handler provided for Walter to deploy at Pass 3, after which Claude Code verifies. **Microstep:** Tier **B7b-1 (indexing pipeline)** — the first half of cross-chat history-RAG. A **separate** timer (`theo_index_messages`, CRON `:05/:20/:35/:50`) ensures a `theo-messages` Azure AI Search index exists, then per idle conversation **batch-embeds its messages** (`text-embedding-3-small`, 1536-d) and **upserts them** into the index (`mergeOrUpload`), scoped per owner. Reuses the deployed distillation timer's structure (timer + `pg` + per-owner `set_config` + the sanctioned SECURITY DEFINER enumeration carve-out) but is **independent** (own `last_indexed_at` watermark + own enumeration helper) so the already-distilled conversations are still indexed, and the working distillation timer is **untouched**. No chat-path/contract change. Retrieval + injection is the paired **B7b-2**. D-3 ZDR + the D-5 Azure AI Search resource are both resolved/provisioned + auth-verified this session.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `801007a8711348dff23973f6807fac5d74c1ebbe` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Primary Reference (Golden §2) = the deployed `theo_distill_memory` (the RLS-fix version running in Azure; blob `a9fe40b3`, §SM) + its timer `function.json` (blob `fe5890b2`, §SM-FJ) — `theo_index_messages` mirrors its idiom (timerTrigger; `pg` Pool; cross-owner SECURITY DEFINER enumeration; per-owner `set_config`; AAD client-credentials token via `getAadToken`). `theo_index_due_conversations` is the sanctioned scheduled-job **enumeration helper** (Golden Handler §3 item 1(b) / API Spec §1). Embedding (`text-embedding-3-small`, 1536-d) + Search data-plane AAD auth were **golden-curl-verified this session** (HTTP 200; embedding dims=1536; Search `indexes:[]` under RBAC). New app settings (`THEO_EMBED_*`, `THEO_SEARCH_*`, `THEO_INDEX_*`) enumerated in §DEPLOY. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 enumeration carve-out) | `Grep("enumeration helper")` this turn | `af4ef9fd93ce886ad968d3644599e54e29c67220` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§1.6 / Tier B7 cross-chat history-RAG) | `Grep("cross-chat history-RAG")` this turn | `f433158a9ef37789ae3a7133906d3c08c31c1783` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§6 Azure AI Search; §5.2 ownership) | `Grep("Azure AI Search")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo API Spec — `spec/THEO_API_SPEC.md` (§1 enumeration carve-out; §2.7 Memory) | `Grep("enumeration helper invoked only by scheduled")` this turn | `f491b3986dd1fdbcaa91346def08520217fc9370` |
| 9 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_messages`/`theo_conversations`) | `Grep("theo_messages")` this turn | `95538419e01ff95d20342e6b65d97c332912c614` |
| 10 | **Primary Reference handler** (deployed timer; mirrored idiom) — `Codex Governance/Theo-1B-B7-Distillation-Engine-RLS-Fix-Pass-1-VEP/theo_distill_memory.index.js` | `Read(full)` this turn | `a9fe40b34ea8cbe204ace29af5838b65066bd6c3` |
| 11 | **Primary Reference function.json** (deployed timerTrigger) — `Codex Governance/Theo-1B-B7-Distillation-Engine-RLS-Fix-Pass-1-VEP/theo_distill_memory.function.json` | `Read(full)` this turn | `fe5890b2f7582bfe131f08fa6d1c2222afcae729` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B7 | "cross-chat history-RAG" | §P1 — the indexing half of history-RAG |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "SECURITY DEFINER **enumeration helper**" | §DDL — `theo_index_due_conversations` (scheduled-job carve-out) |
| spec/THEO_API_SPEC.md | §1 | "enumeration helper invoked only by scheduled (timer) handlers" | §DDL — the sanctioned cross-owner index scan |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §6 | "Azure AI Search" | §HG — the `theo-messages` hybrid index |

---

## P1 — Feature identification
**Microstep:** Theo Phase 1B **Tier B7b-1** — the indexing pipeline for cross-chat history-RAG (Rule Anchor on Plan Tier B7 "cross-chat history-RAG"). A scheduled timer embeds each user's conversation messages and upserts them into an Azure AI Search index, so B7b-2 can later retrieve prior-discussion context at chat time. No HTTP surface; no chat-path change; no user content leaves the tenant (embeddings are the Switzerland-North Azure OpenAI deployment; the index is the UK-South `vaultgpt-search`).

## P2 — Architecture & boundary reconciliation
- **Separate, independent timer.** `theo_index_messages` (timerTrigger `:05/:20/:35/:50`) is distinct from `theo_distill_memory` — own `last_indexed_at` watermark + own `theo_index_due_conversations` enumeration helper. This (a) leaves the working distillation timer untouched, and (b) indexes the **already-distilled** conversations (whose `last_distilled_at` is set) because `last_indexed_at` is independent.
- **Cross-owner enumeration (sanctioned).** `theo_index_due_conversations(idle, limit)` is `SECURITY DEFINER` (Golden §3 item 1(b) / API Spec §1 carve-out), returning `(id, created_by)` only. Per conversation, `set_config(owner)` then read that owner's messages under RLS.
- **Embedding + index.** Ensure index (idempotent `PUT`); batch-embed message contents (`text-embedding-3-small`, 1536-d; verified) in ≤64-message chunks; `mergeOrUpload` documents (`id`=message id, `conversation_id`, `created_by` [filterable], `role`, `content`, `content_vector`, `created_at`). AAD client-credentials (same `AAD_*` app) for the `cognitiveservices.azure.com` + `search.azure.com` scopes — keyless, golden-curl-verified.
- **Isolation.** `created_by` is a filterable field on every document; B7b-2's queries will filter `created_by = $oid` (same explicit discipline as the SEC fix). The enumeration helper exposes no content. Per-conversation reads run under each owner's `set_config`.
- **Boundary.** Reads `theo_conversations`/`theo_messages`; writes the Search index + the `last_indexed_at` watermark; **no `reporting_*`**; no model gateway / chat change.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** (a) Run §DDL as `pgadmin_vault` (adds `last_indexed_at` + `theo_index_due_conversations`); (b) create the new `theo_index_messages` timer function (§HG + §FJ); (c) add app settings `THEO_EMBED_ENDPOINT`/`THEO_EMBED_DEPLOYMENT`/`THEO_EMBED_API_VERSION`, `THEO_SEARCH_ENDPOINT`/`THEO_SEARCH_INDEX`/`THEO_SEARCH_API_VERSION` (defaults in §DEPLOY). | **PRE-LAND** — §DEPLOY; Claude Code verifies the index fills + per-owner doc counts. |
| G-2 | **NEW binding type — `timerTrigger`** (second timer; precedent now exists in `distillTimer`). | **PROCEED** — code idiom mirrors the deployed distillation timer (Primary Reference §SM). |
| G-3 | **Azure prereqs.** Embedding deployment + Search service + service-principal grants. | **PROCEED (DONE).** D-5 resource provisioned (`vaultgpt-search`); `text-embedding-3-small` deployed; "Vault GPT API" granted Cognitive Services OpenAI User + Search Service/Index Data Contributor; all golden-curl-verified this session. D-3 ZDR resolved. |
| G-4 | **B7b-2 retrieval + injection** (query-time hybrid search → inject) is the paired next microstep. | **PROCEED (future-trigger)** — separate VEP; B7b-1 only builds the corpus (no chat-path change). |
| G-5 | **Index-failure retry.** A conversation that fails indexing is **not** watermarked → retried next tick (idempotent `mergeOrUpload`). Bounded by `THEO_INDEX_BATCH`. | **PROCEED** — transient-failure self-heal; bounded cost. |

No write SQL executed in this pack (plan only). No `reporting_*` change.

## P3 — Backend / contract grounding
No HTTP contract (timer). `theo_index_due_conversations` = SECURITY DEFINER enumeration helper (Golden §3 / API Spec §1). The index schema (in §HG `ensureIndex`) matches `text-embedding-3-small` (1536-d, verified). Reads conform to deployed `theo_messages` (Schema §3). API Spec §2.7 already notes history-RAG over `theo_messages` (1B / B7b).

## P4 — Configuration (new app settings; §DEPLOY)
`THEO_EMBED_ENDPOINT` = `https://wmans-mqxwlcdp-switzerlandnorth.cognitiveservices.azure.com`; `THEO_EMBED_DEPLOYMENT` = `text-embedding-3-small`; `THEO_EMBED_API_VERSION` = `2023-05-15`. `THEO_SEARCH_ENDPOINT` = `https://vaultgpt-search.search.windows.net`; `THEO_SEARCH_INDEX` = `theo-messages`; `THEO_SEARCH_API_VERSION` = `2023-11-01`. Optional: `THEO_INDEX_IDLE_MINUTES` (30), `THEO_INDEX_BATCH` (20). Reuses existing `AAD_*` + `POSTGRES_CONNECTION_STRING`.

## P5 — Component reference grounding
Primary Reference (Golden §2) = the deployed `theo_distill_memory` pair (§SM handler `a9fe40b3` + §SM-FJ function.json `fe5890b2`) — the timer + `pg` + cross-owner SECURITY DEFINER enumeration + per-owner `set_config` + AAD client-credentials idiom. `theo_index_messages` reuses the helper block (`parseJsonSafe`/`requestUrl`/generalised `getAadToken`) and adds `ensureIndex`/`embedBatch`/`upsertDocs`. The `timerTrigger` binding follows the deployed `distillTimer` shape.

## P6 — Repository & active-surface grounding
New artifacts: `b7b1_migration.sql`, `theo_index_messages.index.js`, `theo_index_messages.function.json`. No existing source changed (distillation timer untouched). Guardrails: SECURITY DEFINER scoped to a read-only ids/owners scan + `SET search_path`; per-owner `set_config`; `created_by` filterable on every indexed doc; no `reporting_*`; keyless AAD auth (verified). Handler `node --check` clean; migration idempotent (`ADD COLUMN IF NOT EXISTS`, `CREATE OR REPLACE FUNCTION`).

## P7 — Risk / regression
- **Distillation untouched:** separate timer/function/watermark — zero impact on the working distillation engine.
- **Bounded cost:** ≤`THEO_INDEX_BATCH` conversations/tick; batched embeddings (≤64/call).
- **Idempotent:** `PUT` index + `mergeOrUpload` docs; re-runs safe; failed conversations retry (not watermarked).
- **Isolation:** per-owner `set_config` reads + `created_by` on every doc; enumeration exposes no content.
- **Residency:** embeddings in Switzerland North (EU), index in UK South — both in-tenant; consistent with the confirmed ZDR posture.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1 PRE-LAND; G-2/G-3/G-4/G-5 PROCEED); Primary Reference pair inlined byte-identical (§SM + §SM-FJ); migration (§DDL) + handler (§HG, `node --check` clean) + function.json (§FJ) inlined. Plan-only. On Codex APPROVAL, Walter runs §DDL + creates the timer + adds the app settings; Claude Code verifies the `theo-messages` index fills with the user's documents (per-owner), then authors **B7b-2** (retrieval + injection).

---

## §SM — Primary Reference handler (deployed `theo_distill_memory`, byte-identical; timer + pg + enumeration idiom)
```js
const https = require("https");
const { Pool } = require("pg");

const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT;
const ANTHROPIC_VERSION = "2023-06-01";
const CONTENT_MAX_LEN = 4000;
const KIND_MAX_LEN = 64;
const TRANSCRIPT_MAX_CHARS = 24000;

function parsePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

// Tunable via app settings; safe defaults per D-7 (distill on idle/close; cheap extraction; durable facts only).
const IDLE_MINUTES = parsePositiveInt(process.env.THEO_DISTILL_IDLE_MINUTES, 30);
const BATCH = parsePositiveInt(process.env.THEO_DISTILL_BATCH, 20);
const MAX_FACTS = parsePositiveInt(process.env.THEO_DISTILL_MAX_FACTS, 8);
const DISTILL_MAX_TOKENS = parsePositiveInt(process.env.THEO_DISTILL_MAX_TOKENS, 1024);

// Persistence pool (shared `vaultgpt` instance). The timer is a server-side batch process with no user
// identity; it reads across owners (the connection role bypasses RLS) and writes each memory row with
// created_by = the conversation's owner explicitly (never RLS-derived).
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

async function getFoundryToken() {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing required model gateway configuration.");
  }

  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://ai.azure.com/.default",
  }).toString();

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(
    tokenUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(form),
      },
    },
    form
  );

  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    throw new Error("Model gateway token request failed.");
  }
  return payload.access_token;
}

const EXTRACTION_SYSTEM =
  "You extract durable, long-term memory about the USER from a chat transcript with a tax assistant. " +
  "Return ONLY a JSON array (no prose, no code fences) of at most %MAX% objects, each " +
  '{"content": string, "kind": "fact"|"preference"|"profile", "salience": integer 0-10}. ' +
  "Include ONLY stable facts/preferences about the user that would help in future, unrelated chats " +
  "(e.g. their name, role, firm, working/style preferences, recurring entities or matters they own). " +
  "EXCLUDE one-off question content, transient task details, anything already present in EXISTING MEMORY, " +
  "and any third party's confidential data. If nothing qualifies, return [].";

module.exports = async function (context, distillTimer) {
  if (!FOUNDRY_BASE || !FOUNDRY_DEPLOYMENT) {
    context.log.error("theo_distill_memory: missing model gateway configuration");
    return;
  }

  let token;
  try {
    token = await getFoundryToken();
  } catch (err) {
    context.log.error("theo_distill_memory: token acquisition failed", err);
    return;
  }

  const client = await pool.connect();
  try {
    // Cross-owner due-scan via a SECURITY DEFINER helper (runs as the owner → bypasses RLS). The timer
    // has no signed-in user, so a direct RLS-scoped scan would match nothing; the helper returns only
    // ids + owners for scheduling. All actual reads/writes below run under each owner's set_config context.
    const due = await client.query(
      `SELECT id, created_by FROM public.theo_due_conversations($1, $2)`,
      [IDLE_MINUTES, BATCH]
    );

    context.log(`theo_distill_memory: ${due.rowCount} conversation(s) due`);

    for (const conv of due.rows) {
      try {
        // Establish this conversation's owner context so RLS permits the per-owner reads/writes below
        // (insert WITH CHECK created_by = auth.uid(); select/update USING created_by = auth.uid()).
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
          SELECT role, content
          FROM public.theo_messages
          WHERE conversation_id = $1 AND created_by = $2
          ORDER BY seq ASC, created_at ASC
          `,
          [conv.id, conv.created_by]
        );

        if (msgs.rowCount === 0) {
          await client.query(
            `UPDATE public.theo_conversations SET last_distilled_at = now() WHERE id = $1 AND created_by = $2`,
            [conv.id, conv.created_by]
          );
          continue;
        }

        const existing = await client.query(
          `
          SELECT content
          FROM public.theo_user_memory
          WHERE created_by = $1 AND scope = 'user'
          ORDER BY salience DESC, updated_at DESC
          LIMIT 100
          `,
          [conv.created_by]
        );

        const transcript = msgs.rows
          .map((m) => `${m.role}: ${typeof m.content === "string" ? m.content : ""}`)
          .join("\n")
          .slice(0, TRANSCRIPT_MAX_CHARS);
        const existingList = existing.rows.map((r) => `- ${r.content}`).join("\n") || "(none)";

        const systemPrompt = EXTRACTION_SYSTEM.replace("%MAX%", String(MAX_FACTS));
        const userContent = `EXISTING MEMORY:\n${existingList}\n\nTRANSCRIPT:\n${transcript}`;
        const payload = JSON.stringify({
          model: FOUNDRY_DEPLOYMENT,
          max_tokens: DISTILL_MAX_TOKENS,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }],
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
              "Content-Length": Buffer.byteLength(payload),
            },
          },
          payload
        );

        let facts = [];
        const parsed = parseJsonSafe(upstream.body);
        if (upstream.statusCode >= 200 && upstream.statusCode < 300 && parsed && Array.isArray(parsed.content)) {
          const text = parsed.content
            .filter((b) => b && b.type === "text")
            .map((b) => (typeof b.text === "string" ? b.text : ""))
            .join("")
            .trim();
          const arr = parseJsonSafe(text);
          if (Array.isArray(arr)) {
            facts = arr;
          }
        } else {
          context.log.error(`theo_distill_memory: extraction non-2xx for ${conv.id}`, upstream.statusCode);
        }

        await client.query("BEGIN");
        let inserted = 0;
        for (const f of facts.slice(0, MAX_FACTS)) {
          const content =
            f && typeof f.content === "string" ? f.content.trim().slice(0, CONTENT_MAX_LEN) : "";
          if (content === "") continue;
          const kind =
            f && typeof f.kind === "string" && f.kind.trim() !== "" ? f.kind.trim().slice(0, KIND_MAX_LEN) : "fact";
          const salience =
            f && Number.isInteger(f.salience) ? Math.max(0, Math.min(10, f.salience)) : 0;
          await client.query(
            `
            INSERT INTO public.theo_user_memory
              (created_by, scope, project_id, kind, content, source_conversation_id, salience)
            VALUES ($1, 'user', NULL, $2, $3, $4, $5)
            `,
            [conv.created_by, kind, content, conv.id, salience]
          );
          inserted++;
        }
        await client.query(
          `UPDATE public.theo_conversations SET last_distilled_at = now() WHERE id = $1 AND created_by = $2`,
          [conv.id, conv.created_by]
        );
        await client.query("COMMIT");

        context.log(`theo_distill_memory: conversation ${conv.id} -> ${inserted} memory item(s)`);
      } catch (convErr) {
        try { await client.query("ROLLBACK"); } catch {}
        context.log.error(`theo_distill_memory: conversation ${conv.id} failed`, convErr);
        // Mark distilled so a persistently-failing conversation does not hot-loop the batch each tick;
        // it re-distills only if it gains new activity (updated_at advances).
        try {
          await client.query(
            `UPDATE public.theo_conversations SET last_distilled_at = now() WHERE id = $1 AND created_by = $2`,
            [conv.id, conv.created_by]
          );
        } catch (markErr) {
          context.log.error(`theo_distill_memory: watermark update failed for ${conv.id}`, markErr);
        }
      }
    }
  } catch (err) {
    context.log.error("theo_distill_memory: batch failed", err);
  } finally {
    client.release();
  }
};
```

## §SM-FJ — Primary Reference function.json (deployed `theo_distill_memory/function.json`, byte-identical timerTrigger)
```json
{
  "bindings": [
    {
      "name": "distillTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */15 * * * *"
    }
  ]
}
```

---

## §DDL — `b7b1_migration.sql` (complete; Walter-executable; idempotent)
```sql
-- ============================================================================
-- Theo 1B — Tier B7b-1 indexing watermark + cross-owner due-for-indexing enumeration helper
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent.
--
-- The history-RAG indexer is a scheduled (timer) job with NO signed-in user; like the distillation
-- timer it cannot satisfy the per-user RLS predicate on a cross-owner scan. This adds (1) an
-- independent `last_indexed_at` watermark (separate from last_distilled_at, so already-distilled
-- conversations are still picked up for indexing) and (2) a SECURITY DEFINER enumeration helper — the
-- sanctioned scheduled-job enumeration carve-out (Golden Handler §3 item 1(b) / API Spec §1) — that
-- returns the due (id, created_by) list across all owners (identifiers + owner ids only, no content).
-- ============================================================================

ALTER TABLE public.theo_conversations
  ADD COLUMN IF NOT EXISTS last_indexed_at timestamptz NULL;

CREATE INDEX IF NOT EXISTS idx_theo_conversations_index_scan
  ON public.theo_conversations (updated_at)
  WHERE last_indexed_at IS NULL OR last_indexed_at < updated_at;

CREATE OR REPLACE FUNCTION public.theo_index_due_conversations(p_idle_minutes int, p_limit int)
RETURNS TABLE (id uuid, created_by text)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.created_by
  FROM public.theo_conversations c
  WHERE c.updated_at < now() - ((p_idle_minutes)::text || ' minutes')::interval
    AND (c.last_indexed_at IS NULL OR c.last_indexed_at < c.updated_at)
  ORDER BY c.updated_at ASC
  LIMIT p_limit;
$$;
GRANT EXECUTE ON FUNCTION public.theo_index_due_conversations(int, int) TO authenticated;
```

## §HG — `theo_index_messages/index.js` (full; timer-triggered indexer)
```js
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
```

## §FJ — `theo_index_messages/function.json` (NEW timerTrigger; offset :05/:20/:35/:50)
```json
{
  "bindings": [
    {
      "name": "indexTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 5,20,35,50 * * * *"
    }
  ]
}
```

---

## §DEPLOY — Walter deploy steps
1. Run `b7b1_migration.sql` against the shared `vaultgpt` Postgres **as `pgadmin_vault`** (adds `last_indexed_at` + `theo_index_due_conversations`; idempotent).
2. Add app settings on `vaultgpt-func-premium`: `THEO_EMBED_ENDPOINT=https://wmans-mqxwlcdp-switzerlandnorth.cognitiveservices.azure.com`, `THEO_EMBED_DEPLOYMENT=text-embedding-3-small`, `THEO_EMBED_API_VERSION=2023-05-15`, `THEO_SEARCH_ENDPOINT=https://vaultgpt-search.search.windows.net`, `THEO_SEARCH_INDEX=theo-messages`, `THEO_SEARCH_API_VERSION=2023-11-01`.
3. Create a NEW function **`theo_index_messages`**: `index.js` = §HG, `function.json` = §FJ (timerTrigger `0 5,20,35,50 * * * *`).
4. Reply "B7b-1 deployed" → Claude Code verifies (the `theo-messages` index is created and fills with the caller's messages; per-owner doc counts; `last_indexed_at` stamped), then authors B7b-2.

## §VERIFY — post-deploy check (Claude Code)
After a tick: `GET {SEARCH_ENDPOINT}/indexes/theo-messages/docs/$count` and a filtered `search=*&$filter=created_by eq '<oid>'` (via `az` search token) → documents present for the caller; spot-check a doc has `content_vector` (1536) + correct `created_by`/`conversation_id`; RO catalog shows `last_indexed_at` stamped on processed conversations; confirm a second user's messages index only under that user's `created_by`.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B7b-1 History-RAG Indexing Pass-1 Backend VEP (plan only).*
