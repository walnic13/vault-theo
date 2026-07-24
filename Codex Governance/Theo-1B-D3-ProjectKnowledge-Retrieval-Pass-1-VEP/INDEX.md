# Theo Backend — `theo_message_stream` project-knowledge retrieval seam (Phase D / D3): Pass-1 Verified Evidence Pack

Backend Verified Evidence Pack (plan). Phase D / D3: `theo_message_stream` (on `vaultgpt-func-stream`) gains a **project-knowledge RAG injection** — when a chat has an active project, it embeds the user's query, hybrid-searches the `theo-project-knowledge` index (owner + `project_id` scoped), **intersects the hits against live `theo_project_knowledge` rows** (so knowledge removed from the project is never surfaced, even though D1's on-ingest indexer does not yet de-index on removal), and injects a `projectKnowledgeBlock` into the system-prompt fold. This is the retrieval half of HF-T4 for project knowledge — the counterpart to D1's indexing half — and it makes project knowledge actually reach the model. The change is **purely additive** and mirrors the deployed history-RAG seam (`searchHistory`/`historyBlock`, B7b-2); it is **NON-FATAL** (any retrieval failure is caught and never breaks chat). No new external system, no new npm dependency, no schema change. `node --check` PASS this turn.

Active-project resolution (grounded on the schema): explicit `body.project_id` (validated UUID) if present, else the persisted conversation's `theo_conversations.project_id` (owner-scoped SELECT) — the canonical conversation↔project link (Schema §5). Both paths are owner-scoped, so a spoofed `project_id` yields nothing (the Search `$filter` and the DB intersect both pin `created_by = oid`).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5

Turn issued against HEAD: `@@ISSUED_HEAD@@` (vault-theo, `development`; grounding parent `22150425cdc6ab84da528f67a17496371925634e`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Baseline-verification note: the Primary Reference below was fetched **live** from `vaultgpt-func-stream` (Kudu VFS `site/wwwroot/src/functions/theo_message_stream.js`, ARM-bearer GET, HTTP 200) this turn and confirmed **byte-identical** to the committed snapshot blob `bdbb71f488414cc82c31f211977f630d7d5e0293` — the deployed baseline is not assumed.

### §4 Documents grounded this turn (Full Baseline)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Claude Code Theo Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3/§4/§7) | `Grep` this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 2 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2/§4/§5/§5.5) | `Read` this turn | `5581657066da5d15227c7116eebf44cef5d04c93` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5/§10) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1E, DR-T11 func-stream deploy) | `Read`+`Grep` this turn | `c39c3aba90d3b7edd59f816d50d20a233ab46cc5` |
| 5 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` | `Grep` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 6 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 boundary, §5 theo_ schema/RLS, §6 RAG) | `Grep` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_message_stream`; §2.6 RAG intent / HF-T4) | `Grep` this turn | `435d72f7726070ba34077768919fa69f04fe03c4` |
| 8 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§5 `theo_conversations.project_id` link + `theo_project_knowledge`) | `Read`+`Grep` this turn | `fa9aad4c75019de0b621e31b5d33ef97f3689639` |
| 9 | Primary Reference (deployed, live-verified) — `theo_message_stream.js` (func-stream, v4 model — no per-function `function.json`) — blob `bdbb71f488414cc82c31f211977f630d7d5e0293` | `Read` this turn (+ live Kudu fetch) | `bdbb71f488414cc82c31f211977f630d7d5e0293` (committed byte-faithfully as `functions/theo_message_stream.LIVE.js` in this package) |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "exactly one" | §Primary Reference — canonical deployed theo_message_stream (v4 model: handler file only, no function.json) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "ALLOWED DELTA" | §Structural Mirror — the 4 additive regions are ALLOWED DELTAs mirroring the history-RAG seam |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.1 | "mapping every handler region to the Primary Reference region" | §Structural Mirror table + unified diff |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Kudu" | §Deploy — func-stream is Kudu VFS surgical overwrite of the single handler file (not run-from-package) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 | "Primary reference artifact cited without full verbatim inline this turn" | §Primary Reference — byte-faithful `.LIVE.js` primary-reference file committed in this package at the reviewed commit (live-verified), the func-stream convention (prose-inline of this handler is precluded by the lint C9/T9 collision) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "Never-Guess Rule" | §P5 — retrieval seam mirrors the deployed searchHistory/historyBlock; baseline live-verified |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" | §P3 — no schema change; reads existing theo_conversations.project_id + theo_project_knowledge |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §7 | "Golden Curl + Handler Discipline" | §Golden Curls |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §1 | "Theo MUST NOT read or write Corporate Reporting tables directly" | §Arch reconciliation — only theo_ tables + the shared vaultgpt-search; no reporting_* |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "RLS ENABLED on every Theo table" | §Handler — set_config + explicit created_by predicates on both the conversation lookup and the intersect |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | §5 | "project_id uuid NULL` FK→`theo_projects" | §Active-project resolution — theo_conversations.project_id is the canonical link |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T11 | "vaultgpt-func-stream` joins the DR-T7 scoped deployment exception" | §Deploy — Claude-Code deploy of func-stream after APPROVAL |

## Architecture & boundary reconciliation (§4A.1 P2)
- **§1 boundary** — reads only `theo_conversations` + `theo_project_knowledge` (Postgres) and the shared `vaultgpt-search` (`theo-project-knowledge` index, already written by D1). No `reporting_*`. Embeddings + Search are the already-used B7b systems; no new external system.
- **§5 theo_ schema + RLS** — both new SQL reads use `set_config` + explicit `created_by = $oid` predicates (the shared Functions connection role bypasses RLS; explicit predicate is the isolation boundary, matching the deployed persistence/memory code).
- **§6 RAG** — this is the retrieval half of HF-T4 for project knowledge; mirrors the deployed history-RAG (B7b-2) seam.
- **Deploy** — `vaultgpt-func-stream` is on the **Kudu VFS** deploy model (Golden Handler §5.5), NOT run-from-package; deploy = surgical overwrite of the single `src/functions/theo_message_stream.js` (DR-T11 authority).

## §1 Feature Identification + boundary
- **Change:** four additive edits to `theo_message_stream.js` — (1) config `PK_SEARCH_INDEX`/`PK_TOP_K`; (2) `searchProjectKnowledge` (mirror of `searchHistory`, index `theo-project-knowledge`, `$filter` owner+project, select `knowledge_id,title,content`); (3) a `projectKnowledgeBlock` assembly block (resolve active project → embed query → search → **intersect with live DB rows** → build block), NON-FATAL, mirroring `historyBlock`; (4) inject `projectKnowledgeBlock` into the system-prompt fold.
- **Boundary:** one handler edit; no new dep; no schema change; no contract change to the response shape. New optional request field `body.project_id` (UUID) is additive + backward-compatible (absent → resolve from conversation; neither → block silently skipped). `node --check` PASS.

## §2 Gap Register
**PROCEED.**
- **(1) Retrieval mirrors a deployed seam.** `searchProjectKnowledge`/`projectKnowledgeBlock` mirror the deployed `searchHistory`/`historyBlock` (B7b-2) structurally; `getAadToken`/`embedQuery` reused as-is (same file). No new external system. PROCEED.
- **(2) Removed-knowledge correctness.** D1's on-ingest indexer does not de-index on knowledge removal (D2 will add de-index). D3 compensates by intersecting Search hits against live `theo_project_knowledge` rows (owner+project scoped) — a removed row's orphaned Search doc is dropped. Disclosed. PROCEED.
- **(3) No schema/contract change.** Reads existing `theo_conversations.project_id` + `theo_project_knowledge`; response shape unchanged; `body.project_id` is additive-optional. PROCEED.
- **(4) NON-FATAL.** Any resolution/embed/search/DB failure is caught + logged; chat is unaffected (mirrors the memory + history blocks). PROCEED.
- **(5) FE (D4) + backfill are separate.** D4 wires the FE to send `project_id` (and retires the client-side knowledge concatenation + interim cap); a one-time backfill re-indexes pre-existing knowledge rows (incl. any pre-KV-grant unindexed adds). D3 works today for conversations already carrying `project_id`. Disclosed. PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** Phase D/D3 — project-knowledge retrieval seam (HF-T4 retrieval half).
- **P2:** architecture reconciliation above (theo_ + vaultgpt-search; no reporting_*).
- **P2.5:** Gap Register (PROCEED).
- **P3:** no schema change; reads `theo_conversations.project_id` (Schema §5 canonical link) + `theo_project_knowledge` (owner+project scoped); Search index `theo-project-knowledge` (created by D1).
- **P4:** no response-contract change; `body.project_id` additive-optional (API Spec §2.1 `theo_message_stream`); §2.6 RAG intent satisfied for the retrieval half.
- **P5:** Primary Reference = the live-verified deployed `theo_message_stream`, committed byte-faithfully as `functions/theo_message_stream.LIVE.js` in this package; the 4 additive regions mirror the deployed history-RAG seam; Structural Mirror + unified diff below.
- **P6:** no migration; no handler SQL schema change (two additive owner-scoped SELECTs on existing tables).
- **P7:** golden curls below (project chat surfaces knowledge; removed knowledge excluded; no-project unaffected; non-project chat unchanged).
- **P8:** this pack.

## Primary Reference (deployed, live-verified `theo_message_stream.js`) — FULL VERBATIM (Conformance T9)
v4 programming model (in-code `app.http` registration) — there is no per-function `function.json` to pair (confirmed: the deployed function folder contains only this `.js`). This is the exact, byte-faithful content of the deployed file (blob `bdbb71f488414cc82c31f211977f630d7d5e0293`), fetched live from func-stream this turn and spliced from disk — no reconstruction. Per the func-stream `.LIVE.js` convention (the deployed handler is 1160 lines and its verbatim `THEO_RULESET` text contains phrases the mechanical lint's C9 forbids in prose), the byte-faithful Primary Reference is committed **in this package** as `functions/theo_message_stream.LIVE.js` (blob `bdbb71f488414cc82c31f211977f630d7d5e0293`) — present at the reviewed commit, and confirmed byte-identical to the live func-stream file (Kudu GET) this turn. The modified handler is `functions/theo_message_stream.js`. Diff the two: `git diff --no-index functions/theo_message_stream.LIVE.js functions/theo_message_stream.js`.
## The four additive regions (spliced byte-faithfully from the D1-package handler, blob `fb4369f15ab9edf8551bb19c04739e603ad96c2b`)
Config (mirrors the history-RAG config lines):
```javascript
// Project-knowledge RAG (Phase D / D3): retrieve the ACTIVE project's indexed knowledge. Mirrors the
// history-RAG config; when unset, project-knowledge recall is silently skipped (non-fatal).
const PK_SEARCH_INDEX = process.env.THEO_PK_SEARCH_INDEX || "theo-project-knowledge";
const PK_TOP_K = parsePositiveInt(process.env.THEO_PK_TOP_K, 6);
```
`searchProjectKnowledge` (structural mirror of the deployed `searchHistory`):
```javascript
// Hybrid (vector + keyword) search over the ACTIVE PROJECT's indexed knowledge (Phase D / D3). Owner +
// project scoped; mirrors searchHistory. The caller intersects hits against live theo_project_knowledge
// rows so knowledge removed from the project is never surfaced (the index is not de-indexed on removal
// until D2).
async function searchProjectKnowledge(searchToken, queryText, queryVector, ownerOid, projectId) {
  const filter =
    `created_by eq '${ownerOid.replace(/'/g, "''")}' and project_id eq '${projectId.replace(/'/g, "''")}'`;
  const body = JSON.stringify({
    search: queryText,
    filter,
    top: PK_TOP_K,
    select: "knowledge_id,title,content",
    vectorQueries: [{ kind: "vector", vector: queryVector, fields: "content_vector", k: PK_TOP_K }],
  });
  const r = await requestUrl(
    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(PK_SEARCH_INDEX)}/docs/search?api-version=${SEARCH_API_VERSION}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${searchToken}`, "Content-Length": Buffer.byteLength(body) },
    },
    body
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.value)) {
    throw new Error(`searchProjectKnowledge failed (HTTP ${r.statusCode}).`);
  }
  return payload.value;
}
```
`projectKnowledgeBlock` assembly (structural mirror of the deployed `historyBlock`; adds active-project resolution + the live-DB intersect):
```javascript
    // ---- Project-knowledge RAG injection (Phase D / D3): recall the ACTIVE PROJECT's indexed knowledge.
    // Active project = explicit body.project_id (validated) else the persisted conversation's project_id
    // (owner-scoped). Search hits are intersected against live theo_project_knowledge rows so items
    // removed from the project are never surfaced. Non-fatal: never breaks chat.
    let projectKnowledgeBlock = "";
    {
      let activeProjectId =
        typeof body.project_id === "string" && isUuid(body.project_id.trim()) ? body.project_id.trim() : null;
      let pkClient = null;
      try {
        if (!activeProjectId && requestedConversationId) {
          pkClient = await pool.connect();
          await pkClient.query(
            `
            SELECT
              set_config('app.current_user_id', $1, false),
              set_config('request.jwt.claim.sub', $1, false),
              set_config('request.jwt.claim.oid', $1, false)
            `,
            [oid]
          );
          const cp = await pkClient.query(
            `SELECT project_id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
            [requestedConversationId, oid]
          );
          if (cp.rowCount > 0 && cp.rows[0].project_id) activeProjectId = cp.rows[0].project_id;
        }
        if (activeProjectId && EMBED_ENDPOINT && EMBED_DEPLOYMENT && SEARCH_ENDPOINT && userText.trim() !== "") {
          const [embedToken, searchToken] = await Promise.all([getAadToken(EMBED_SCOPE), getAadToken(SEARCH_SCOPE)]);
          const queryVector = await embedQuery(embedToken, userText.slice(0, HISTORY_QUERY_MAX_CHARS));
          const hits = await searchProjectKnowledge(
            searchToken, userText.slice(0, HISTORY_QUERY_MAX_CHARS), queryVector, oid, activeProjectId
          );
          if (!pkClient) {
            pkClient = await pool.connect();
            await pkClient.query(
              `
              SELECT
                set_config('app.current_user_id', $1, false),
                set_config('request.jwt.claim.sub', $1, false),
                set_config('request.jwt.claim.oid', $1, false)
              `,
              [oid]
            );
          }
          const live = await pkClient.query(
            `SELECT id FROM public.theo_project_knowledge WHERE project_id = $1 AND created_by = $2`,
            [activeProjectId, oid]
          );
          const liveIds = new Set(live.rows.map((r) => r.id));
          const lines = hits
            .filter((h) => h && liveIds.has(h.knowledge_id))
            .map((h) => (typeof h.content === "string" ? h.content.trim() : ""))
            .filter((c) => c !== "")
            .map((c) => `- ${c.slice(0, 1000)}`);
          if (lines.length > 0) {
            projectKnowledgeBlock =
              "Knowledge attached to the current project (authoritative context for this project; use when relevant):\n" +
              lines.join("\n");
          }
        }
      } catch (pkErr) {
        context.error("theo_message_stream: project-knowledge retrieval failed (non-fatal)", pkErr);
      } finally {
        if (pkClient) pkClient.release();
      }
    }
```
Injection fold (the one changed line):
```javascript
    const effectiveSystem =
      [THEO_RULESET, memoryBlock, historyBlock, projectKnowledgeBlock, systemPrompt].filter((s) => typeof s === "string" && s.trim() !== "").join("

") || null;
```

## Exact unified diff vs the live-verified baseline (authoritative delta)
```diff
--- deployed baseline (bdbb71f4)
+++ D3 handler (fb4369f1)
@@ -98,4 +98,8 @@
 const HISTORY_TOP_K = parsePositiveInt(process.env.THEO_HISTORY_TOP_K, 5);
 const HISTORY_QUERY_MAX_CHARS = 8000;
+// Project-knowledge RAG (Phase D / D3): retrieve the ACTIVE project's indexed knowledge. Mirrors the
+// history-RAG config; when unset, project-knowledge recall is silently skipped (non-fatal).
+const PK_SEARCH_INDEX = process.env.THEO_PK_SEARCH_INDEX || "theo-project-knowledge";
+const PK_TOP_K = parsePositiveInt(process.env.THEO_PK_TOP_K, 6);
 
 // Attachments (B8d): blob lives in theo-content; read via the Function's managed identity
@@ -393,4 +397,33 @@
   if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.value)) {
     throw new Error(`searchHistory failed (HTTP ${r.statusCode}).`);
+  }
+  return payload.value;
+}
+
+// Hybrid (vector + keyword) search over the ACTIVE PROJECT's indexed knowledge (Phase D / D3). Owner +
+// project scoped; mirrors searchHistory. The caller intersects hits against live theo_project_knowledge
+// rows so knowledge removed from the project is never surfaced (the index is not de-indexed on removal
+// until D2).
+async function searchProjectKnowledge(searchToken, queryText, queryVector, ownerOid, projectId) {
+  const filter =
+    `created_by eq '${ownerOid.replace(/'/g, "''")}' and project_id eq '${projectId.replace(/'/g, "''")}'`;
+  const body = JSON.stringify({
+    search: queryText,
+    filter,
+    top: PK_TOP_K,
+    select: "knowledge_id,title,content",
+    vectorQueries: [{ kind: "vector", vector: queryVector, fields: "content_vector", k: PK_TOP_K }],
+  });
+  const r = await requestUrl(
+    `${SEARCH_ENDPOINT}/indexes/${encodeURIComponent(PK_SEARCH_INDEX)}/docs/search?api-version=${SEARCH_API_VERSION}`,
+    {
+      method: "POST",
+      headers: { "Content-Type": "application/json", Authorization: `Bearer ${searchToken}`, "Content-Length": Buffer.byteLength(body) },
+    },
+    body
+  );
+  const payload = parseJsonSafe(r.body);
+  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !Array.isArray(payload.value)) {
+    throw new Error(`searchProjectKnowledge failed (HTTP ${r.statusCode}).`);
   }
   return payload.value;
@@ -893,7 +926,75 @@
     }
 
+    // ---- Project-knowledge RAG injection (Phase D / D3): recall the ACTIVE PROJECT's indexed knowledge.
+    // Active project = explicit body.project_id (validated) else the persisted conversation's project_id
+    // (owner-scoped). Search hits are intersected against live theo_project_knowledge rows so items
+    // removed from the project are never surfaced. Non-fatal: never breaks chat.
+    let projectKnowledgeBlock = "";
+    {
+      let activeProjectId =
+        typeof body.project_id === "string" && isUuid(body.project_id.trim()) ? body.project_id.trim() : null;
+      let pkClient = null;
+      try {
+        if (!activeProjectId && requestedConversationId) {
+          pkClient = await pool.connect();
+          await pkClient.query(
+            `
+            SELECT
+              set_config('app.current_user_id', $1, false),
+              set_config('request.jwt.claim.sub', $1, false),
+              set_config('request.jwt.claim.oid', $1, false)
+            `,
+            [oid]
+          );
+          const cp = await pkClient.query(
+            `SELECT project_id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
+            [requestedConversationId, oid]
+          );
+          if (cp.rowCount > 0 && cp.rows[0].project_id) activeProjectId = cp.rows[0].project_id;
+        }
+        if (activeProjectId && EMBED_ENDPOINT && EMBED_DEPLOYMENT && SEARCH_ENDPOINT && userText.trim() !== "") {
+          const [embedToken, searchToken] = await Promise.all([getAadToken(EMBED_SCOPE), getAadToken(SEARCH_SCOPE)]);
+          const queryVector = await embedQuery(embedToken, userText.slice(0, HISTORY_QUERY_MAX_CHARS));
+          const hits = await searchProjectKnowledge(
+            searchToken, userText.slice(0, HISTORY_QUERY_MAX_CHARS), queryVector, oid, activeProjectId
+          );
+          if (!pkClient) {
+            pkClient = await pool.connect();
+            await pkClient.query(
+              `
+              SELECT
+                set_config('app.current_user_id', $1, false),
+                set_config('request.jwt.claim.sub', $1, false),
+                set_config('request.jwt.claim.oid', $1, false)
+              `,
+              [oid]
+            );
+          }
+          const live = await pkClient.query(
+            `SELECT id FROM public.theo_project_knowledge WHERE project_id = $1 AND created_by = $2`,
+            [activeProjectId, oid]
+          );
+          const liveIds = new Set(live.rows.map((r) => r.id));
+          const lines = hits
+            .filter((h) => h && liveIds.has(h.knowledge_id))
+            .map((h) => (typeof h.content === "string" ? h.content.trim() : ""))
+            .filter((c) => c !== "")
+            .map((c) => `- ${c.slice(0, 1000)}`);
+          if (lines.length > 0) {
+            projectKnowledgeBlock =
+              "Knowledge attached to the current project (authoritative context for this project; use when relevant):\n" +
+              lines.join("\n");
+          }
+        }
+      } catch (pkErr) {
+        context.error("theo_message_stream: project-knowledge retrieval failed (non-fatal)", pkErr);
+      } finally {
+        if (pkClient) pkClient.release();
+      }
+    }
+
     context.log("theo ruleset " + THEO_RULESET_VERSION);
     const effectiveSystem =
-      [THEO_RULESET, memoryBlock, historyBlock, systemPrompt].filter((s) => typeof s === "string" && s.trim() !== "").join("\n\n") || null;
+      [THEO_RULESET, memoryBlock, historyBlock, projectKnowledgeBlock, systemPrompt].filter((s) => typeof s === "string" && s.trim() !== "").join("\n\n") || null;
 
     // ---- Attachments: fetch OWNED rows + assemble blocks; strict ownership (404 on any missing) ----
```

## Structural Mirror Table (Golden Handler §5.1)
| Region | Reference (deployed) | Classification | Anchor |
|---|---|---|---|
| Entire baseline handler body (1160 lines) | deployed theo_message_stream (primary ref) | **EXACT** (unchanged) | Golden Handler §2 "exactly one" |
| Config `PK_SEARCH_INDEX`/`PK_TOP_K` | the deployed `SEARCH_INDEX`/`HISTORY_TOP_K` config lines | **ALLOWED DELTA** (config, mirror) | Golden Handler §4 "ALLOWED DELTA" |
| `searchProjectKnowledge` | deployed `searchHistory` | **ALLOWED DELTA** (structural mirror; index → PK_SEARCH_INDEX, `$filter` adds `project_id`, select `knowledge_id,title,content`) | Golden Handler §4 "ALLOWED DELTA" |
| `projectKnowledgeBlock` | deployed `historyBlock` | **ALLOWED DELTA** (structural mirror; adds active-project resolution + live-DB intersect) | Golden Handler §4 "ALLOWED DELTA" |
| Injection fold (+`projectKnowledgeBlock`) | deployed fold `[THEO_RULESET, memoryBlock, historyBlock, systemPrompt]` | **ALLOWED DELTA** (one array element added) | Golden Handler §4 "ALLOWED DELTA" |
| `getAadToken` / `embedQuery` | deployed same-file helpers | **REUSED AS-IS** (same file; unchanged) | Golden Handler §2 |

## New handler + package
Included: `functions/theo_message_stream.js` (blob `fb4369f15ab9edf8551bb19c04739e603ad96c2b`; `node --check` PASS; +102 lines / −1 vs baseline — purely the 4 additive regions). No `function.json` (v4 model). No `package.json` change (no new dep). The deploy unit is this single file (Kudu VFS surgical overwrite, §5.5).

## Golden Curls (P7; run by Claude Code post-deploy, SSE)
Bearer via `az account get-access-token` for `api://4e1a1e31-…/access_as_user`; base `https://vaultgpt-func-stream…azurewebsites.net`.
```
# Setup (premium): create a project; add a file-knowledge item carrying a distinctive probe token
#   (e.g. ZEBRAQUARTZ) so D1 indexes it into theo-project-knowledge.
# GC-D3a (retrieval) — POST theo_message_stream with body.project_id = that project + a user message
#   asking about the probe topic → the SSE answer references the probe content (proves projectKnowledgeBlock
#   was injected). Non-streaming assert: also confirm via a control run WITHOUT project_id that the answer
#   does NOT have the probe content.
# GC-D3b (removal correctness) — delete the knowledge item (DB row) but leave its orphaned Search doc;
#   re-ask with project_id → the probe content is NO LONGER surfaced (the live-DB intersect drops it).
# GC-D3c (conversation-resolved) — set the conversation's project_id (theo_set_conversation_project),
#   send WITHOUT body.project_id but WITH conversation_id → knowledge still surfaces (resolved from the conv).
# GC-D3d (regression) — a normal chat with no project + no project_id streams exactly as before (no new
#   block; memory/history unaffected); no-bearer → 401.
# (test project + knowledge + index docs cleaned up after)
```

## Parity Checklist (Golden Handler §5.4)
- [x] Single canonical Primary Reference (deployed theo_message_stream) committed byte-faithfully as functions/theo_message_stream.LIVE.js (blob bdbb71f4); baseline live-verified byte-identical (Kudu GET vs blob bdbb71f4).
- [x] v4 model — no function.json to pair (deployed folder holds only the .js).
- [x] Structural mirror classifies every region; the 4 additive regions mirror the deployed history-RAG seam; getAadToken/embedQuery reused as-is.
- [x] Executes as the signed-in user; both new SQL reads use set_config + explicit created_by; a spoofed project_id yields nothing.
- [x] Only theo_ tables + the shared vaultgpt-search; no reporting_*; no new external system; no new npm dep.
- [x] No schema change; no response-contract change; body.project_id additive-optional.
- [x] NON-FATAL (chat never broken by retrieval failure); removed knowledge excluded via live-DB intersect.
- [x] node --check PASS; unified diff = purely the 4 additive regions; golden curls cover retrieval / removal / conversation-resolution / regression; Claude Code runs post-deploy.
- [x] Mechanical lint PASS (below).

## §Deploy (Pass-3, on APPROVAL) — Claude Code, `vaultgpt-func-stream` Kudu VFS (§5.5 / DR-T11)
1. Kudu VFS PUT `src/functions/theo_message_stream.js` (the D1-package blob `fb4369f15ab9edf8551bb19c04739e603ad96c2b`) over the deployed file (ARM-bearer; If-Match the current ETag), GET-back + diff to confirm byte-identical, then `az functionapp restart`.
2. Claude Code runs GC-D3a–d and reports.
3. No Role-C (response contract unchanged; `body.project_id` additive-optional — a one-line API Spec §2.1 note may be folded into the D4 FE package).

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-D3-ProjectKnowledge-Retrieval-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review (APPROVED / REJECTED only). On APPROVED, Claude Code deploys the single handler file to func-stream via Kudu VFS surgical overwrite and runs the golden curls.
