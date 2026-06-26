# THEO PHASE 1B — BACKEND EXECUTION PLAN

> **Status: DRAFT v0.3 — NOT YET AUTHORITATIVE.** Authored by Claude Code as a foundational planning skeleton at Walter's request (2026-06-26). v0.2 baked in Walter's resolved decisions (D-1, D-2, D-4, D-5 — see §8); **v0.3** re-sequences §7 to **gateway-first** (live SWA Claude responses before the persistence layer) and assigns **golden-curl execution to Claude Code** (§2A). It is **pending Codex Pass-2 review and Walter approval** before it governs. It is a *living* plan: each backend microstep updates the three Theo backend authority docs (Theo API Spec, Theo Azure Postgres Schema, Theo Golden Handler Standard) as it lands, in the same shape the Reporting backend plan uses.
>
> **Regime.** This plan is governed by the **Theo backend regime** — `vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md`, `THEO_GROUNDING_CONFORMANCE_STANDARD.md`, `THEO_GOLDEN_HANDLER_STANDARD.md`, with **Codex** as reviewer (Pass 2) and **Walter** as the sole DB-write / deployment authority. It is **not** governed by the Reporting backend Governor Standard. The Corporate Reporting backend standards are referenced as the **proven implementation pattern** the Theo backend reuses and as the **API surface** Theo's tool-dispatch calls — Theo **MUST NOT fork, copy, or restate** them (Theo Tool Manifest §1; Theo Architecture §0a).

---

## 1. Purpose & scope

Phase 1A built the full Theo frontend surface (chat, projects, artifacts, customize, app-context chip), mounted it inside Vault Origin, and ran it entirely against **mocked contracts behind a single service module + a mocked model gateway** (Theo 1A Frontend Plan §5; 1A Handover §2.3). Phase 1B makes those contracts **real** against the deployed Azure backend, with **no rendered-surface change** — every 1A mock is swapped for a live call behind the same service boundary.

**In scope (1B backend):**
1. **Model gateway** (HF-T1) — a real server-side broker to the model (Foundry-Claude), Anthropic Messages API shape, the only credential holder.
2. **Persistence + RLS** (HF-T2) — the `theo_*` Postgres schema and ownership-scoped CRUD handlers for conversations, messages, projects, project-knowledge, artifacts, artifact-versions, and user settings.
3. **App-context persistence** — `theo_conversations.app_key` / `app_context`, carried across reload.
4. **RAG retrieval** (HF-T4) — Azure AI Search over tax corpus + project knowledge, RLS-scoped, injected at system-prompt assembly.
5. **Tool dispatch** (HF-T3) — model tool-calls routed to authorized `reporting_*` endpoints, executed **as the signed-in user** through the published Reporting API (never direct table access).

**Out of scope:** any change to `reporting_*` handlers, tables, or contracts; any rendered-surface redesign; multi-tenant; sharing/membership RLS models (ownership-only unless Walter authorizes).

---

## 2. Governance regime (BINDING)

| Aspect | Theo 1B backend |
|---|---|
| Plan author | Claude Code (Pass 1 VEP) |
| Reviewer | **Codex** (Pass 2) — `CODEX_THEO_BACKEND_REVIEW_STANDARD.md` |
| DB writes / migrations / deploys | **Walter only**. Claude Code plans + hands off Walter-executable SQL; never deploys, never writes the DB. |
| Read-only SQL grounding | `codex_reporting_ro` (SELECT-only) per the local SQL rule |
| Authority docs (truth owners) | Theo API Spec (contract), Theo Azure Postgres Schema (data), Theo Golden Handler Standard (handler pattern), Theo Architecture & Structure (boundaries) |
| Pattern reference (reuse, do not fork) | Reporting Golden Handler Pack (Family B handler shape), Reporting Backend API Spec §3–§5 (auth, session context, 403/404), Reporting Azure Postgres Schema §4–§5 (RLS, existence helpers) |
| Per-microstep cadence | VEP → Codex APPROVED → Implementation Package (Walter-executable SQL + deterministic curls) → Walter executes/deploys → Claude Code updates the three Theo authority docs (Role-C) |
| Never-Guess | Every schema object / column / contract read in a governing doc or established by read-only SQL; DEPLOYED vs PROPOSED classified for every `theo_*` element |

---

## 2A. Operating discipline (BINDING — Walter directives 2026-06-26)

These reuse the Reporting Governor + Golden Handler Pack discipline verbatim:

1. **Claude Code runs all golden curls** (as in the corporate-reporting backend build; the Reporting Governor §1 Phase-D golden-curl execution pattern, standing for Theo 1B per Walter 2026-06-26). Claude Code acquires the bearer token itself via the live `az` session — `az account get-access-token --scope "api://<app-id>/access_as_user"` for handler endpoints, or `--scope "https://ai.azure.com/.default"` for the Foundry endpoint — executes the curl, and captures the verbatim command + response under `.local/` (gitignored), exactly as the corporate-reporting curl artifacts were captured. No hand-pasted tokens; no placeholders. Walter remains responsible for **deploys** (copy-paste handlers into Azure) and **SQL execution**; Claude Code owns curl execution + the captured evidence.
2. **Complete SQL, no placeholders.** Claude Code reads SQL (SELECT-only, `codex_reporting_ro`) for seed-data and current-state grounding, and authors **complete, runnable** migration + seed scripts for Walter to deploy — no placeholders, no bracketed values, no "fill in". Walter executes all DDL/DML.
3. **Complete, copy-paste-ready handlers — no placeholders, no guessing.** When Claude Code delivers a handler it delivers the **entire** handler file, ready to paste into the Azure portal UI. On any change it delivers a **full replacement handler**, never a diff/snippet. No guessed schema, columns, ids, auth, or envelopes — Never-Guess applies categorically (read it in a governing doc or establish it by read-only SQL / reference-artifact inspection first).
4. **Mirror, don't invent.** Each Theo handler names exactly one `corporate-reporting/reference-artifacts/handlers/` Family-B handler as its Primary Reference (inlined verbatim in the VEP), and mirrors its structure; Theo-specific deltas (route, SQL, business fields) are the only changes.

---

## 3. Current backend baseline (grounded 2026-06-26)

- **Compute.** One shared Azure Functions app — `vaultgpt-func-premium` (UK South), Node.js. Reporting and Theo deploy to the **same app** under separate route namespaces (Reporting API Spec §2.2: "Reporting does NOT inherit Theo endpoint namespaces, tables, or business logic by assumption").
- **Deployed handlers live in Azure; the mirror source is the Reporting reference-artifacts (D-1 RESOLVED).** Theo `theo_*` handlers are authored by **mirroring the `corporate-reporting/reference-artifacts/handlers/` (+ `function-json/`) Family-B handlers** — they are the authoritative source for auth, request/response shape, and handler structure. The handlers deploy to the shared Azure Functions app; **Walter deploys** each by copy-pasting the complete handler into the Azure portal UI. Claude Code authors complete, copy-paste-ready handlers (§2A) and the matching Theo reference-artifact + manifest entry; it never deploys.
- **No legacy Theo backend (D-2 RESOLVED).** The early `chat_proxy` + `chat_storage_*` handlers and the early tables (`conversations`, `chat_messages`, `theo_users`) are **explicitly NOT used, extended, or mirrored** — they predate current standards and are not trusted. Theo 1B is built **fresh, modelled on corporate-reporting**. (Physical decommission of the old Azure functions/tables is a Walter operational task, separate from this plan.)
- **Auth (reused verbatim).** Azure Easy Auth injects `x-ms-client-principal`; handlers resolve the Entra **OID** via `getPrincipal(req)` + `getClaimValue(principal, [oid claims])` (Reporting API Spec §4; canonical in `reporting_get_user_identity`). OBO bearer exchange is available for delegated Graph (Reporting API Spec §3a) — not needed by core Theo handlers.
- **Postgres (shared, namespaced).** Shared `vaultgpt` Azure Postgres. Per-request session context is set before queries: `set_config('app.current_user_id', $oid, false)` + `request.jwt.claim.sub` / `.oid` (Reporting API Spec §5). RLS is enforced per-user; 403-vs-404 is discriminated via a `SECURITY DEFINER … _exists_unscoped(uuid)` helper + PostgreSQL `42501` → HTTP 403 (Reporting API Spec §5a; Schema §5).
- **Handler shape (reused — "Family B").** `const { Pool } = require('pg')`; pool with `POSTGRES_CONNECTION_STRING`; `client = await pool.connect()` / `client.release()` in `finally`; narrow per-endpoint CORS; `OPTIONS` → 204; `send/errorBody/successBody/getPrincipal/getClaimValue/parseBody/isUuid` helpers; explicit `BEGIN/COMMIT/ROLLBACK` on mutations; fixed `{error:{code,message,status,timestamp}}` / `{data,meta}` envelopes (Reporting Golden Handler Pack §5/§7).
- **`function.json` (reused).** `authLevel: anonymous` (Easy Auth upstream), `httpTrigger` in / `http` out, narrow `methods`, underscore `route` (no slashes, no path params) (Reporting API Spec §9; Golden Handler Pack §20).
- **Model gateway (D-4 RESOLVED — Azure AI Foundry → Claude).** The Theo 1B gateway (HF-T1) is **new**, built fresh on the Family-B pattern (the legacy `chat_proxy` is not reused), and brokers to **Anthropic Claude via Microsoft Azure AI Foundry** in the standard Anthropic Messages shape; it is the sole model-credential holder and the model swap point. The Azure-side connection (Foundry resource, model deployment, endpoint, and Entra managed-identity / keyless auth) is being set up with Walter (see the Foundry connection walkthrough, §11). ZDR posture remains D-3.
- **Persistence (D-5 RESOLVED — Azure Blob + Azure Postgres).** Structured data → shared `vaultgpt` Azure **Postgres** (`theo_*` tables, RLS). Large/opaque content (artifact-version bodies, project-knowledge source content) → Azure **Blob**, with the Postgres row holding the Blob pointer + metadata. This persistence layer is the core deliverable of 1B. (Azure AI Search for RAG indexing is a separate B6 resource — still D-5-adjacent / to confirm.)

---

## 4. Architecture recap — Theo backend handler families

Per `THEO_GOLDEN_HANDLER_STANDARD.md §6` (registry) and Theo Architecture §2/§4/§5/§6 — all **PROPOSED**, authored in 1B:

| HF-id | Family | Scope |
|---|---|---|
| **HF-T1** | Model gateway broker | `POST /api/theo/message`; brokers to Foundry-Claude in the standard Anthropic Messages shape; sole model-credential holder; the model swap point; system-prompt assembly seam (settings + project knowledge + RAG). Built-in Foundry tools (`web_search`/`web_fetch`/code-exec) travel with the model. |
| **HF-T2** | `theo_*` CRUD + RLS | Ownership-scoped CRUD over the `theo_*` tables (conversations, messages, projects, project-knowledge, artifacts, artifact-versions, user-settings). |
| **HF-T3** | Tool dispatch | Maps model tool-calls → authorized `reporting_*` endpoints; validates against the canonical Reporting API Spec (never a local copy); calls **as the signed-in user**; context-scoped by `app_key`. |
| **HF-T4** | RAG retrieval | Azure AI Search (hybrid vector + BM25) over tax corpus + `theo_project_knowledge`; RLS-scoped to the user; injected at HF-T1 system-prompt assembly. |

---

## 5. The `theo_*` schema (PROPOSED — DDL finalized per-microstep in 1B)

Per `THEO_AZURE_POSTGRES_SCHEMA.md §3` + Theo Architecture §5. Conventions (BINDING): `theo_` prefix; `id uuid PK DEFAULT gen_random_uuid()`; ownership column `created_by text NOT NULL` (Entra OID); `created_at`/`updated_at timestamptz` server-managed (immutable tables omit `updated_at`); per-table `theo_<entity>_exists_unscoped(uuid) -> boolean` helper. RLS: ENABLED on every table; **four** policies (SELECT/INSERT/UPDATE/DELETE), `TO authenticated`, keyed on `created_by = auth.uid()`; no `FOR ALL`, no `USING(true)`.

| Table | Purpose | Notes |
|---|---|---|
| `theo_conversations` | chat thread | `app_key text NULL`, `app_context jsonb NULL`, `project_id uuid NULL`, `title`, `model` |
| `theo_messages` | turn in a thread | `conversation_id uuid FK ON DELETE CASCADE`, `role`, `content`, `model`, ordering key; **immutable** (no `updated_at`) |
| `theo_projects` | project (instructions + knowledge) | `name`, `instructions`, optional `app_key` scope |
| `theo_project_knowledge` | knowledge source under a project | `project_id uuid FK`, source pointer/title/type; RAG-indexed; immutable |
| `theo_artifacts` | artifact record | optional `conversation_id`/`project_id`, `title`, `type`, current-version pointer |
| `theo_artifact_versions` | versioned artifact content | `artifact_id uuid FK`, `version_number int`, content (Blob pointer); immutable |
| `theo_user_settings` | per-user style + custom instructions | text PK = Entra OID; prepended to the system prompt |
| `theo_apps` / `theo_app_tools` *(candidate)* | registry backing the Tool Manifest | may start as config, not tables — 1B decides |

**Boundary (BINDING):** `theo_*` tables are net-new and additive in the shared `vaultgpt` instance. Theo **never** reads/writes `reporting_*` tables directly.

---

## 6. The 1A→1B seam (what 1B makes real, per surface)

Per `THEO_1A_FRONTEND_HANDOVER.md §2/§3`. The single service module means each row is a mock→live swap behind a stable boundary, **no surface change**:

| Surface | Mocked in 1A | Made real in 1B |
|---|---|---|
| Chat | composer, streaming-style load, markdown, artifact markers | live Foundry-Claude via HF-T1; turns persisted (HF-T2) |
| Recents | in-memory list + search | real history from `theo_conversations` (HF-T2) |
| Projects | CRUD + instructions + knowledge in memory | persisted (HF-T2); knowledge RAG-indexed (HF-T4) |
| Artifacts | marker-parsed, versioned by title reuse, in memory | persisted versioned (Blob + Postgres index), survive reload (HF-T2) |
| Customize | style preset + custom instructions in memory | persisted to `theo_user_settings`, applied server-side in the system prompt (HF-T1/HF-T2) |
| App-context chip | received from Origin, carried on conversation | persisted to `theo_conversations.app_key`/`app_context`; drives tool-dispatch (HF-T3) |
| Retrieval | stub results | real Azure AI Search retrieval, RLS-scoped (HF-T4) |

---

## 7. Execution sequence — backend tiers (BINDING ordering; backend-first)

Each tier is one or more governed microsteps. **Completion gate per microstep:** VEP Codex-APPROVED → Implementation Package → Walter executes SQL + deploys the handler → **Claude Code runs the golden curls** + SELECT-only verification → the three Theo authority docs updated → only then the next microstep. Sequencing is a state machine, not a guideline.

**Ordering note (v0.3 — gateway-first, Walter 2026-06-26).** The model connection is the biggest integration unknown and the most motivating to see working, so the sequence front-loads a **live, stateless chat** end-to-end before the persistence layer. The gateway does not depend on the schema (a turn round-trips `messages[]` → Claude → text without saving); persistence then makes it durable. This keeps backend-first integrity (the gateway is backend) while surfacing integration risk first.

### Tier B0 — Foundry connection + foundation
- **Purpose.** Stand up and prove the Azure AI Foundry → Claude connection; lock the baseline handler pattern.
- **Deliverables (split by owner).** Walter: §11 Part A (deploy the Claude model) + Part B (Function managed identity + `Cognitive Services User`) + grant the signed-in user `Cognitive Services User` for the direct test. **Claude Code:** run the §11 Part C Foundry golden curl (token via `az`), capture the 200 + body under `.local/`; select the canonical `corporate-reporting` Family-B Primary Reference handler (inlined verbatim in the B1 VEP).
- **Completion.** Part C curl returns 200 from Claude; Primary Reference handler chosen; D-3 ZDR noted (non-PII test prompts only until confirmed).

### Tier B1 — Thin model gateway (HF-T1), stateless
- **Purpose.** First live, deployable handler: Theo talks to Claude. No database.
- **Deliverables.** Complete copy-paste `POST /api/theo/message` handler mirroring the Family-B Primary Reference for Easy-Auth (`x-ms-client-principal` → OID) + CORS + envelopes, but calling Foundry with the Function's managed identity (scope `https://ai.azure.com/.default`, `anthropic-version: 2023-06-01`), returning `content[]` filtered to text with `[[ARTIFACT …]]` preserved; minimal/default system prompt (settings + RAG come later); its `function.json`; the deterministic golden curl.
- **Completion.** Walter deploys; **Claude Code's golden curl** gets a live Claude completion through the handler as the signed-in user.

### Tier B1.5 — Frontend chat-service swap (Theo-FE; live SWA test)
- **Purpose.** The visible win — Theo in the deployed SWA returns real Claude responses.
- **Deliverables.** Point the 1A chat contract in the single service module from the mock at the live `/api/theo/message` (mock→live swap, no surface change); redeploy. (Theo-FE regime / Codex — small change.)
- **Completion.** **Walter sees live Claude responses in the Origin/Theo SWA.** (Stateless: refresh loses the thread until B3.)

### Tier B2 — Persistence substrate: `theo_*` schema + RLS (HF-T2 foundation)
- **Purpose.** Stand up the data layer the whole surface persists to (the core of 1B).
- **Deliverables.** Complete Walter-executable DDL for the `theo_*` tables (§5), each with the 4-policy RLS set + `_exists_unscoped(uuid)` helper; Blob container for content bodies; schema doc updated DEPLOYED.
- **Completion.** Tables + policies + helpers deployed (Walter); Claude Code's SELECT-only verification confirms RLS shape; Theo Azure Postgres Schema reflects DEPLOYED.

### Tier B3 — Conversations + messages CRUD (HF-T2) + app-context + persist gateway turns
- **Purpose.** Make chats/recents durable; persist `app_key`/`app_context`; wire HF-T1 to save turns.
- **Deliverables.** `theo_conversations` + `theo_messages` handlers (list/create/fetch conversation; append message — create-only); app-context columns written/read; HF-T1 extended to persist each turn.
- **Completion.** Recents + a reloaded chat thread persist for the signed-in user under RLS; Claude Code golden curls pass. ZDR (D-3) confirmed before client-PII traffic.

### Tier B4 — Projects + project-knowledge + artifacts + settings CRUD (HF-T2)
- **Purpose.** Persist the remaining surfaces.
- **Deliverables.** `theo_projects` / `theo_project_knowledge` / `theo_artifacts` / `theo_artifact_versions` / `theo_user_settings` handlers; artifact versioning persisted (Blob body + Postgres index); settings applied server-side in the HF-T1 system prompt.
- **Completion.** Projects, knowledge, artifacts (versioned), and customize survive reload under RLS; Claude Code golden curls pass.

### Tier B5 — Tool dispatch (HF-T3)
- **Purpose.** Let the model act on the anchored app via the published Reporting API.
- **Deliverables.** Tool-dispatch handler mapping tool-id → authorized `reporting_*` endpoint, validated against the canonical Reporting API Spec, called as the signed-in user; context-scoped by `app_key`; Tool Manifest gains its **first Walter-authorized** endpoint row (D-6; empty at v0.1).
- **Completion.** A model tool-call reads Corporate Reporting data **as the user** (RLS at the Reporting layer); no `reporting_*` direct access anywhere in Theo.

### Tier B6 — RAG retrieval (HF-T4)
- **Purpose.** Replace stubbed retrieval with real hybrid search.
- **Deliverables.** Azure AI Search index over tax corpus + `theo_project_knowledge` (indexed on project create/update); top-k hybrid retrieval RLS-scoped to the user; injected at HF-T1 system-prompt assembly.
- **Completion.** Project-knowledge-grounded answers retrieve real sources scoped to the user; Claude Code golden curls / eval pass.

---

## 8. Open decisions (Walter) — Decision Register seed

| id | Decision | Status (2026-06-26) |
|---|---|---|
| **D-1** | Mirror source + deployment home for `theo_*` handlers. | **RESOLVED.** Mirror the `corporate-reporting/reference-artifacts/handlers/` Family-B handlers (auth + shape); handlers deploy to the shared Azure Functions app; Walter copy-pastes complete handlers into the Azure UI. |
| **D-2** | Legacy chat backend disposition. | **RESOLVED.** Not used / not mirrored — `chat_proxy`, `chat_storage_*`, and early tables are excluded; build fresh on the Reporting pattern. Physical decommission is a separate Walter ops task. |
| **D-4** | Model gateway infra. | **RESOLVED (setup in progress).** Anthropic Claude via Azure AI Foundry; HF-T1 is the sole credential holder + swap point; built fresh (no `chat_proxy` reuse). Azure-side connection walkthrough in §11. |
| **D-5** | Persistence backing. | **RESOLVED.** Azure Postgres (`theo_*`, RLS) for structured data + Azure Blob for artifact-version / knowledge content (pointer-in-Postgres). *Sub-item still open:* the Azure AI Search resource for RAG indexing (B6) — confirm/provision. |
| **D-3** | Foundry-Claude **ZDR** posture before any client-PII traffic. | **OPEN.** Zero-data-retention must be contractually confirmed; region limits apply (Theo Architecture §2.4). Non-PII dev/test (B0–B1.5) may proceed; gates live **client-PII** traffic. |
| **D-6** | First authorized tool-dispatch endpoint (Tool Manifest empty at v0.1). | **OPEN.** Adding an endpoint to the authorized set is a governance change requiring explicit Walter direction. Gates B5. |

Remaining open items are **PRE-LAND** for their tiers: D-3 gates live client-PII traffic (non-PII dev test proceeds earlier); the AI-Search sub-item of D-5 gates B6; D-6 gates B5. No tier proceeds on a guessed decision.

---

## 9. Acceptance criteria — 1B "done"

1. Every 1A surface is backed by a real handler behind the unchanged service boundary — no rendered-surface change.
2. Chat runs through the **real model gateway** (HF-T1), never a direct browser→model call; the gateway is the sole credential holder + swap point.
3. Conversations, messages, projects, knowledge, artifacts (versioned), and settings **persist** under `theo_*` with RLS; survive reload; scoped to the signed-in user.
4. `app_key`/`app_context` persist on the conversation and drive tool-dispatch.
5. Tool-dispatch reads/writes Corporate Reporting **only** through the published `reporting_*` API, **as the signed-in user**, validated against the canonical Spec — never direct table access, never a forked copy.
6. RAG retrieval returns real, RLS-scoped sources injected at system-prompt assembly.
7. Every `theo_*` element is DEPLOYED-classified; the three Theo authority docs reflect deployed reality.
8. No change to `reporting_*` handlers/tables/contracts; no browser storage; ownership-only RLS unless Walter authorized otherwise.

---

## 10. Microstep cadence (per tier microstep)

Pass 1 (Claude Code VEP: GCR + Rule Anchors + feature id + arch/boundary reconciliation + **Gap Register** PROCEED/PRE-LAND/ESCALATE/NO-GAPS + schema grounding + contract grounding + handler grounding with a verbatim Primary Reference + Walter-executable SQL + deterministic curls + mechanical-lint PASS) → **Pass 2** Codex APPROVED/REJECTED → **Pass 3** Walter executes the SQL + deploys the handler; **Claude Code runs the golden curls** (token via `az account get-access-token`) and the SELECT-only verification under `codex_reporting_ro`, capturing evidence under `.local/` → **Pass 4** Role-C updates Theo API Spec / Schema / Golden Handler Standard to DEPLOYED reality.

## 11. Azure AI Foundry → Claude connection setup (HF-T1 prerequisite)

Grounded in Microsoft Learn, *Deploy and use Claude models in Microsoft Foundry* (updated 2026-06-12) + *Claude models in Microsoft Foundry*. Values in `<angle brackets>` are tenant-specific — Walter fills them from his subscription; everything else is the documented procedure. This is the Azure-side prerequisite for the HF-T1 gateway (Tier B3).

**Architecture decision baked in:** the HF-T1 gateway authenticates the *user* via Easy Auth for identity/RLS, but calls Foundry using the **Function app's own managed identity** (keyless) — the gateway is the sole model-credential holder; the user's token is never used for the model call, and no model key ever reaches the browser.

### Part A — One-time Azure setup (Walter, in the portal)
> **Discovery 2026-06-26 (Claude Code, `az`):** the subscription has **no Foundry (AIServices) resource** today — the only Cognitive Services account is `Vaultgpt` (kind **OpenAI**, **UK South**, RG `Vault-Tax`), which **cannot serve Claude**. A **new Foundry resource in East US 2 / Sweden Central** must be created. **Data-residency note (feeds D-3):** Claude-in-Foundry inference is Anthropic-hosted in US regions, not UK South — confirm residency/ZDR acceptability before any client-PII traffic.
1. **Subscription/region check.** Need a paid pay-as-you-go Azure subscription in a supported billing region. Claude in Foundry deploys **Global Standard (serverless)** only, in **East US 2** or **Sweden Central**. (CSP and credit-only subscriptions are unsupported.)
2. **Marketplace access.** Partner models require Azure **Marketplace** subscription permission; need **Contributor** or **Owner** on the resource group to deploy.
3. **Create a Microsoft Foundry project** in East US 2 or Sweden Central (or use the `Azure-Samples/claude` starter kit's `azd up`, which provisions account + project + deployment + Entra wiring with no keys).
4. **Deploy the Claude model** from the Foundry portal (e.g. `claude-sonnet-4-6` or `claude-opus-4-6`), choosing a **deployment name** (it can differ from the model id) — note it; HF-T1 sends it as `model`.
5. **Capture the endpoint:** base `https://<resource-name>.services.ai.azure.com/anthropic`; Messages URI `https://<resource-name>.services.ai.azure.com/anthropic/v1/messages`.

### Part B — Keyless wiring for the gateway Function (Walter)
6. **Enable the Function app's managed identity** (system-assigned) — this is the gateway's model credential.
7. **Assign RBAC:** grant that managed identity the **`Cognitive Services User`** role on the Foundry resource. (This is the role the docs require for Entra/keyless calls; 403 = this role missing.)
8. No API key is stored. (API-key auth via `x-api-key` exists as a fallback, but keyless managed identity is the chosen posture.)

### Part C — Golden curl to validate the Foundry endpoint (Claude Code runs this)
**Claude Code executes this** from the live `az` session (Walter does not paste tokens). It validates the Foundry connection directly (bypasses our handler), using the documented Entra scope `https://ai.azure.com/.default`. Prerequisite: Walter has completed Part A (model deployed) and granted the **signed-in user** (`wmansfield@vault-tax.com`) **`Cognitive Services User`** on the Foundry resource so the user-token test can call the endpoint (the Function's managed identity from Part B is for the handler's own calls in Tier B3). Claude Code captures the command + response under `.local/`.
```sh
az login   # interactive, once per session
TOKEN=$(az account get-access-token --scope "https://ai.azure.com/.default" --query accessToken -o tsv)
curl -sS -X POST "https://<resource-name>.services.ai.azure.com/anthropic/v1/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "<deployment-name>",
    "max_tokens": 256,
    "messages": [{ "role": "user", "content": "Reply with the single word: ok" }],
    "stream": false
  }'
```
- 200 + a Messages-API JSON body ⇒ endpoint + RBAC good. 401 ⇒ wrong/expired token or wrong scope (must be `https://ai.azure.com/.default`). 403 ⇒ `Cognitive Services User` not assigned. 404 ⇒ wrong `<resource-name>` or `<deployment-name>`.
- **VERIFIED 2026-06-26 (Claude Code):** `POST https://vaultgpt-foundry.services.ai.azure.com/anthropic/v1/messages`, model `claude-sonnet-4-6`, `anthropic-version: 2023-06-01`, Bearer token scope `https://ai.azure.com/.default` → **HTTP 200**, body `content:[{type:"text",text:"ok"}]`, `stop_reason:"end_turn"`, `usage` present, `inference_geo:"not_available"`. Resource `vaultgpt-foundry` / project `vault-theo` / RG `Vault-Origin` / sub `Vault-GPT` / **Sweden Central**. Evidence: `.local/theo_b0_foundry_connection_test.txt`. **B0 connection proven.**
- **B1 prerequisite (carry-forward):** the §11 Part C test used the *signed-in user's* token (Owner sufficed). The HF-T1 handler calls Foundry with the **Function app's managed identity**, a different principal — so before B1 deploy, that managed identity MUST be granted **`Cognitive Services User`** on `vaultgpt-foundry`.
- The HF-T1 **handler** endpoint (`POST /api/theo/message`) is validated by a separate golden curl whose token is acquired against the **app's** user scope (`az account get-access-token --scope "api://<app-id>/access_as_user"`) for Easy Auth — the handler then calls Foundry with its managed identity internally.

### Part D — How HF-T1 uses it (gateway design, authored in Tier B3)
- Inbound: Easy Auth `x-ms-client-principal` → resolve Entra OID (user identity, for persistence + RLS), exactly the Reporting Family-B pattern.
- Outbound to model: acquire a token via `DefaultAzureCredential` for scope `https://ai.azure.com/.default` (the Function's managed identity), `POST` to the `/anthropic/v1/messages` endpoint with `anthropic-version: 2023-06-01`, body in the standard Anthropic Messages shape (system prompt assembled from `theo_user_settings` + project instructions + RAG), and return `content[]` filtered to text (artifact markers preserved).
- Model swap = change the deployment name / endpoint by configuration; no contract change.

### Open: D-3 ZDR
Claude-in-Foundry inference runs on **Anthropic-hosted** infrastructure (not Azure regional), so **zero-data-retention must be contractually confirmed before any client-PII traffic** flows through HF-T1. This gates B3 go-live with real client data; dev/test with non-PII prompts can proceed earlier.

---

*End of THEO PHASE 1B — BACKEND EXECUTION PLAN (DRAFT v0.3, pending Codex Pass-2 + Walter approval).*
