# Theo 1B — Operating Ruleset (grounding + auditability system prompt) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete handlers for Walter to deploy at Pass 3, after which Claude Code runs the golden checks. **Microstep:** the **Vault Theo Operating Ruleset** — a versioned governance artifact (`vault-theo-rules v1.0`) that makes Theo ground tax specifics in retrieved sources, show auditable work, gate by materiality, and refuse to fabricate. It is injected **server-side as the LEADING system block** on every turn — ahead of the memory + history-RAG blocks and the user's style/custom/project prompt — in **both** gateway handlers (`theo_message` monolith + `theo_message_stream` sidecar), so it is **mandatory and non-bypassable**. Surgical, diff-verified change (identical in both handlers): add the `THEO_RULESET`/`THEO_RULESET_VERSION` consts (embedding the governed text verbatim), prepend `THEO_RULESET` to `effectiveSystem`, and log the version per turn for audit. **No schema change. No `reporting_*`.** The ruleset leverages the web search/fetch tools already attached every turn (so Theo can be specific AND verified, not vague).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Turn issued against HEAD: `e9d715172f5a4ddf758ddadda0de9f96e48ae102` (vault-theo, `development`)
Detail: Pass 1 backend VEP injecting one governed system-prompt artifact into two deployed handlers. Primary Reference (1/2) = the deployed B8i `theo_message` (blob `7b912574`) — §H-MESSAGE inlines the corrected full file; the only delta is §CHANGESET. Primary Reference (2/2) = the deployed B9 `theo_message_stream` (blob `2939303f`) — §H-STREAM inlines the corrected full file; same §CHANGESET delta. The governed ruleset artifact is §RULESET (`THEO_OPERATING_RULESET.md`), embedded **byte-identically** as the `THEO_RULESET` const in both handlers (verified: embedded == artifact). **No schema change** (no DDL; per-turn audit is a `context.log` line + the version const + the git-versioned artifact). `node --check` clean for both handlers. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | cited; unchanged blob @ HEAD | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§4 EXACT mirror) | `Grep("EXACT mirror")` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A DR-T2 model gateway) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§2.3 HF-T1 gateway; §5.2 ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 7 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (context; HF-T1 chat gateway) | cited @ HEAD | `2bb5a638b301d49b19f401517560d81ede979352` |
| 8 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 gateway; request/response unchanged) | cited @ HEAD | `c5d6c7b68469ae6605fd625890a8474fabe333c9` |
| 9 | **Primary Reference (1/2)** — deployed B8i `theo_message` — `Codex Governance/Theo-1B-B8i-Reload-Parity-Backend-Pass-1-VEP/theo_message.index.js` | `Read(full)` this turn | `7b9125749968537fdcb2bec2d64c4a924387c81c` |
| 10 | **Primary Reference (2/2)** — deployed B9 `theo_message_stream` — `Codex Governance/Theo-1B-B9-Streaming-Backend-Pass-1-VEP/proposed-app/src/functions/theo_message_stream.js` | `Read(full)` this turn | `2939303ffa2d1164ed2987aa0052ae34f3ed07f3` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No write SQL / no schema change.

## §WALTER-AUTH — verbatim authorization for the ruleset content + server-side injection
Walter's directive this turn-sequence (the feature authority):
> "the next biggest thing is having a ruleset for theo, one that makes sure it grounds to recent information and that shows its work, grounded in facts it has pulled and supported … tax law in particular needs to be auditable, we need to ensure that hallucination risk is minimised as much as possible … a system prompt that theo must read each turn."

Approving the drafted ruleset text and the architecture:
> "let's go with your prompt" … (on server-side injection in both handlers) "let's go with your recommendation".

This authorizes the `THEO_OPERATING_RULESET.md` text (§RULESET) and its mandatory server-side injection as the leading system block in both gateway handlers.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "EXACT mirror against a deployed handler" | §H-MESSAGE / §H-STREAM are the deployed handlers + the §CHANGESET delta only |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T2 | "the model swap point" | the ruleset is injected at the gateway, the single model entry point |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | unchanged — all queries remain explicit `created_by`-scoped |

---

## P1 — Feature identification
The **Vault Theo Operating Ruleset**: a versioned system-prompt artifact that encodes how Theo must behave for tax work — ground specifics in retrieved sources and cite them, show auditable reasoning (authority → rule → application → conclusion), gate analysis by materiality (don't rabbit-hole into untriggered regimes), keep fund/partnership parties distinct, anchor to provided documents, and **never fabricate** a citation/section/rate. It directly answers Walter's requirement for a per-turn ruleset that minimises hallucination and makes tax answers auditable (§WALTER-AUTH). It is an enhancement to the existing gateway (no new endpoint, no contract change).

## P2 — Architecture & boundary reconciliation
- **Where it lives.** A governed artifact `governance/THEO_OPERATING_RULESET.md` (§RULESET) is the single source of truth; its text is embedded **byte-identically** as `THEO_RULESET` (with `THEO_RULESET_VERSION`) in both handlers. The VEP that changes the ruleset re-embeds it, keeping doc and code in lock-step.
- **How it is applied.** In each handler the existing `effectiveSystem` is built from `[memoryBlock, historyBlock, systemPrompt]`; this change prepends `THEO_RULESET` → `[THEO_RULESET, memoryBlock, historyBlock, systemPrompt]`, so the ruleset is the **leading** system block every turn, ahead of memory, history, and the client's prompt. Because it is server-side, a client cannot omit or override it (it always leads). The grounding rules are actionable because the gateway already attaches `web_search` + `web_fetch` every turn.
- **Audit.** The governing version is a deployed constant (`THEO_RULESET_VERSION`), the artifact is git-versioned, and each turn logs `theo ruleset <version>` (App Insights). Together these map any turn (by date) to the ruleset that governed it. (Durable per-turn DB stamping is a deferred option — would need an additive column; G-3.)
- **Boundary.** Reads/writes nothing new; **no schema change**; **no `reporting_*`**; managed-identity/Postgres/Blob/Foundry posture unchanged. Request/response contracts of both endpoints are byte-identical — only the upstream system prompt gains a leading block.

## P2.5 / GR — Gap Register
Vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`.
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy both handlers (Walter).** Replace `theo_message/index.js` on the monolith (`vaultgpt-func-premium`, v3 copy-paste) and `theo_message_stream` on the sidecar (`vaultgpt-func-stream`, v4 zip). function.json unchanged. | **PRE-LAND** — §DEPLOY; Claude Code runs §GOLDEN after. |
| G-2 | **Land the governance artifact.** `THEO_OPERATING_RULESET.md` → `governance/THEO_OPERATING_RULESET.md` (authority source of truth). | **PRE-LAND** — committed with this package's apply (Pass 3); the embedded const is already byte-identical to it. |
| G-3 | **Per-turn provenance.** Audit today = deployed version const + git-versioned artifact + App Insights `context.log`. A durable per-turn DB stamp (a `ruleset_version` column on `theo_messages`) is not included to avoid a schema change. | **PROCEED (future-trigger)** — add the additive column later if turn-level DB provenance is wanted. |
| G-4 | **Behavioural control, not a hard guarantee.** The ruleset strongly shapes behaviour (and the web tools make grounding real), but model adherence is probabilistic; Vault's professional review remains the backstop (the ruleset itself says output is always reviewed). | **PROCEED** — §GOLDEN spot-checks the key behaviours; the control + tools + review together minimise hallucination risk. |

No write SQL. No `reporting_*` change. No schema change.

## P3 — Backend / contract grounding
No contract change. Both endpoints' request/response shapes are unchanged; only the server-built `system` sent upstream gains the leading ruleset block. The persisted turn is unchanged (same columns). No DDL.

## P4 — Schema definition
None. (Per-turn ruleset-version persistence is explicitly deferred — G-3.)

## P5 — Component reference grounding
- **Primary Reference (1/2):** deployed B8i `theo_message` (blob `7b912574`) — §H-MESSAGE inlines the corrected full file; only the §CHANGESET delta differs.
- **Primary Reference (2/2):** deployed B9 `theo_message_stream` (blob `2939303f`) — §H-STREAM inlines the corrected full file; the **same** §CHANGESET delta.
- The injected text is the governed §RULESET artifact, embedded verbatim (verified byte-identical in both handlers).

## §CHANGESET — exact additive delta (diff-verified; identical in both handlers)
Versus the deployed bases (`7b912574` / `2939303f`), each handler gains exactly:
1. **Ruleset constants** after `const TITLE_MAX_LEN = 80;` — a comment, `const THEO_RULESET_VERSION = "vault-theo-rules v1.0";`, and `const THEO_RULESET = ` + a template literal holding the governed ruleset text **verbatim** (byte-identical to §RULESET).
2. **Leading injection** — the `effectiveSystem` array changes from `[memoryBlock, historyBlock, systemPrompt]` to `[THEO_RULESET, memoryBlock, historyBlock, systemPrompt]` (ruleset leads; filter/join unchanged).
3. **Per-turn audit log** — `context.log("theo ruleset " + THEO_RULESET_VERSION);` immediately before `const effectiveSystem =`.

`diff` vs each base confirms the only removed line is the old `effectiveSystem` array line; everything else is byte-for-byte the deployed handler. `node --check` clean for both.

## P6 — Repository & active-surface grounding
Changed/added artifacts (this package): `THEO_OPERATING_RULESET.md` (new governance artifact) + `theo_message.index.js` (supersedes the B8i deploy copy) + `theo_message_stream.js` (supersedes the B9 deploy copy). `node --check` clean for both; embedded ruleset == artifact (verified). function.json for both unchanged.

## P7 — Risk / regression
- **Chat behaviour:** the ruleset is prepended to the system prompt; everything else (memory, history-RAG, attachment injection, web tools, persistence, streaming relay) is byte-identical → no functional regression. A plain request ("draft an email") still works; the ruleset scopes grounding to *tax specifics*, not every query, so it doesn't force needless searches.
- **Token cost:** the ruleset adds ~4 KB (~1k tokens) to the system prompt each turn — negligible against the model/context budget.
- **Both endpoints stay in lock-step:** the identical const + injection in `theo_message` and `theo_message_stream` means streaming and non-streaming chat behave the same.
- **No schema / no `reporting_*` / no infra change.**

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) + §WALTER-AUTH open the pack; P1–P8 walked; Gap Register (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED); §CHANGESET the diff-verified delta; §RULESET the governed artifact; §H-MESSAGE / §H-STREAM the corrected full handlers; §FJ note (function.json unchanged); §DEPLOY both deploys + the artifact landing; §GOLDEN the behaviour checks. Plan-only. On Codex APPROVAL, Walter lands the artifact + deploys both handlers; Claude Code runs §GOLDEN.

---

## §RULESET — `governance/THEO_OPERATING_RULESET.md` (governed artifact; embedded verbatim as `THEO_RULESET`)
```text
# Theo Operating Ruleset

**Ruleset id:** `vault-theo-rules v1.0`
**Status:** proposed (Pass 1). On approval lands at `governance/THEO_OPERATING_RULESET.md` (authority source of truth) and is embedded verbatim as the `THEO_RULESET` constant (with `THEO_RULESET_VERSION = "vault-theo-rules v1.0"`) in the gateway handlers `theo_message` (monolith) and `theo_message_stream` (sidecar).
**How it is applied:** injected server-side as the **leading system block** on every turn, ahead of the memory + history-RAG blocks and the user's style/custom/project prompt. Mandatory and non-bypassable (a client cannot omit it). The version is logged per turn (App Insights) for audit; the deployed version + this doc's git history map any turn (by date) to the ruleset that governed it.

---

## Ruleset text (embedded verbatim in the handlers as `THEO_RULESET`)

You are Theo, Vault's AI assistant for tax and advisory work, used by Vault's tax professionals as a research and drafting aid. Your output is always reviewed before it is relied on. You have live web search/fetch tools, and you receive the user's own materials (uploaded documents, the active workpaper/engagement context). You do not otherwise reach into client systems or data. Accuracy, grounded in retrievable sources, is your highest priority — above being comprehensive, fast, or agreeable.

GROUNDING — BE SPECIFIC AND VERIFIED
You have search/fetch tools; use them. For any specific authority or figure — an IRC § (26 U.S.C.), a Treasury Reg (26 C.F.R.; note proposed/temporary/final), an IRS Notice/Revenue Ruling/Revenue Procedure, a case, a rate, threshold, dollar amount, deadline, or effective date — retrieve and verify it THIS TURN, then cite it precisely. Do not assert these specifics from training or unaided recall, and do not go vague to avoid them: the right move is to look it up and cite it, not to hedge.
- Prefer primary/official sources (the Code, Regs, IRS.gov, official opinions) over secondary commentary; say when you rely on secondary. Be tax-year/date aware, flag fast-moving areas (Pillar 2, GILTI/FTC, digital assets), and note when a source may be superseded.
- Never fabricate a citation, section/ruling number, case, rate, or date. If you cannot verify a specific, say "I couldn't verify this — confirm against [authority]." "I don't have a verified source for that" is a good answer; a confident invented one is the worst possible outcome.

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

---

## Change control
- This ruleset is versioned. Any change bumps `THEO_RULESET_VERSION` and is made through the governed pipeline (Pass 1 VEP / Role-C), keeping the doc and the embedded handler constants in lock-step.
- The text above and the `THEO_RULESET` constant in both handlers MUST be byte-identical (modulo the JS string literal wrapper). The VEP that introduces or changes this ruleset inlines both so the match is verifiable.
```

## §H-MESSAGE — `theo_message/index.js` (complete; monolith, ruleset-injected)
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
const THEO_RULESET_VERSION = "vault-theo-rules v1.0";
const THEO_RULESET = `
You are Theo, Vault's AI assistant for tax and advisory work, used by Vault's tax professionals as a research and drafting aid. Your output is always reviewed before it is relied on. You have live web search/fetch tools, and you receive the user's own materials (uploaded documents, the active workpaper/engagement context). You do not otherwise reach into client systems or data. Accuracy, grounded in retrievable sources, is your highest priority — above being comprehensive, fast, or agreeable.

GROUNDING — BE SPECIFIC AND VERIFIED
You have search/fetch tools; use them. For any specific authority or figure — an IRC § (26 U.S.C.), a Treasury Reg (26 C.F.R.; note proposed/temporary/final), an IRS Notice/Revenue Ruling/Revenue Procedure, a case, a rate, threshold, dollar amount, deadline, or effective date — retrieve and verify it THIS TURN, then cite it precisely. Do not assert these specifics from training or unaided recall, and do not go vague to avoid them: the right move is to look it up and cite it, not to hedge.
- Prefer primary/official sources (the Code, Regs, IRS.gov, official opinions) over secondary commentary; say when you rely on secondary. Be tax-year/date aware, flag fast-moving areas (Pillar 2, GILTI/FTC, digital assets), and note when a source may be superseded.
- Never fabricate a citation, section/ruling number, case, rate, or date. If you cannot verify a specific, say "I couldn't verify this — confirm against [authority]." "I don't have a verified source for that" is a good answer; a confident invented one is the worst possible outcome.

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
        if (nativeBytes + buf.length > ATTACH_NATIVE_BUDGET_BYTES) {
          blocks.push({ type: "text", text: `[Attached file "${row.filename}" omitted — exceeds the per-message attachment size budget.]` });
          continue;
        }
        nativeBytes += buf.length;
        const b64 = buf.toString("base64");
        if (native === "document") {
          blocks.push({ type: "document", source: { type: "base64", media_type: row.content_type, data: b64 } });
        } else {
          blocks.push({ type: "image", source: { type: "base64", media_type: row.content_type, data: b64 } });
        }
        blocks.push({ type: "text", text: `(above is the attached file "${row.filename}")` });
      } else if (isExtractRow && row.extracted_text_path) {
        const text = await downloadBlobText(storageToken, row.extracted_text_path);
        const remaining = ATTACH_EXTRACT_BUDGET_CHARS - extractChars;
        if (remaining <= 0) {
          blocks.push({ type: "text", text: `[Attached file "${row.filename}" omitted — exceeds the per-message extracted-text budget.]` });
          continue;
        }
        const clipped = text.length > remaining ? text.slice(0, remaining) + "\n…[truncated]" : text;
        extractChars += clipped.length;
        blocks.push({ type: "text", text: `Attached file "${row.filename}" (${row.content_type}):\n\n${clipped}` });
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
    let attachmentRows = [];
    if (attachmentIds.length > 0) {
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
        const res = await attClient.query(
          `
          SELECT id, filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path
          FROM public.theo_attachments
          WHERE id = ANY($1::uuid[]) AND created_by = $2
          `,
          [attachmentIds, oid]
        );
        attachmentRows = res.rows;
      } finally {
        attClient.release();
      }
      if (attachmentRows.length !== attachmentIds.length) {
        throw buildKnownError("NOT_FOUND", "One or more attachments were not found.", 404);
      }
      // Preserve the caller's attachment order.
      const orderById = new Map(attachmentIds.map((id, i) => [id, i]));
      attachmentRows.sort((a, b) => orderById.get(a.id) - orderById.get(b.id));
    }

    const attachmentBlocks = await buildAttachmentBlocks(context, attachmentRows);

    // Build the upstream messages. When attachments are present, the last user message's string
    // content becomes a block array: [ ...attachmentBlocks, { type:"text", text: <original text> } ].
    // When absent, the messages array is sent UNCHANGED (byte-for-byte the deployed behaviour).
    let messagesForUpstream = messages;
    if (attachmentBlocks.length > 0 && lastUserIndex >= 0) {
      messagesForUpstream = messages.map((m, i) => {
        if (i !== lastUserIndex) return m;
        return {
          ...m,
          content: [...attachmentBlocks, { type: "text", text: userText }],
        };
      });
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

## §H-STREAM — `theo_message_stream` (complete; sidecar v4, ruleset-injected)
```js
const { app } = require("@azure/functions");
const https = require("https");
const http = require("http");
const { Pool } = require("pg");
const { PassThrough } = require("node:stream");

// HTTP streaming must be explicitly enabled in the v4 Node model (proven on Windows EP1, Gate 2).
app.setup({ enableHttpStream: true });

const FOUNDRY_BASE = process.env.THEO_FOUNDRY_BASE;
const FOUNDRY_DEPLOYMENT = process.env.THEO_FOUNDRY_DEPLOYMENT;
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MAX_TOKENS = 4096;
const TITLE_MAX_LEN = 80;

// Vault Theo Operating Ruleset (governance/THEO_OPERATING_RULESET.md). Injected server-side as the
// LEADING system block every turn (ahead of memory + history + the client system prompt) so it is
// mandatory and non-bypassable. Keep byte-identical to the governed doc; bump the version on change.
const THEO_RULESET_VERSION = "vault-theo-rules v1.0";
const THEO_RULESET = `
You are Theo, Vault's AI assistant for tax and advisory work, used by Vault's tax professionals as a research and drafting aid. Your output is always reviewed before it is relied on. You have live web search/fetch tools, and you receive the user's own materials (uploaded documents, the active workpaper/engagement context). You do not otherwise reach into client systems or data. Accuracy, grounded in retrievable sources, is your highest priority — above being comprehensive, fast, or agreeable.

GROUNDING — BE SPECIFIC AND VERIFIED
You have search/fetch tools; use them. For any specific authority or figure — an IRC § (26 U.S.C.), a Treasury Reg (26 C.F.R.; note proposed/temporary/final), an IRS Notice/Revenue Ruling/Revenue Procedure, a case, a rate, threshold, dollar amount, deadline, or effective date — retrieve and verify it THIS TURN, then cite it precisely. Do not assert these specifics from training or unaided recall, and do not go vague to avoid them: the right move is to look it up and cite it, not to hedge.
- Prefer primary/official sources (the Code, Regs, IRS.gov, official opinions) over secondary commentary; say when you rely on secondary. Be tax-year/date aware, flag fast-moving areas (Pillar 2, GILTI/FTC, digital assets), and note when a source may be superseded.
- Never fabricate a citation, section/ruling number, case, rate, or date. If you cannot verify a specific, say "I couldn't verify this — confirm against [authority]." "I don't have a verified source for that" is a good answer; a confident invented one is the worst possible outcome.

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

// Extended thinking (B9): OFF unless THEO_THINKING_BUDGET_TOKENS > 0 is set, AND only after the
// Foundry thinking-passthrough is verified (see VEP §GOLDEN). When enabled, the upstream stream
// includes thinking_delta events, which are relayed VERBATIM to the client (the FE renders them in
// a collapsible panel). Thinking is NOT persisted as message content (ephemeral, like Claude).
const THINKING_BUDGET = parsePositiveInt(process.env.THEO_THINKING_BUDGET_TOKENS, 0);

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
// (Storage Blob Data Contributor). Native (PDF/image) inject as document/image content blocks;
// extract-class inject the stored extracted text. Budgets bound the upstream payload.
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

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return { error: { code, message, status, timestamp: nowIso() } };
}

// Extract the EasyAuth client principal (v4: headers is a Headers object — use .get()).
function getPrincipal(request) {
  const raw = request.headers.get("x-ms-client-principal");
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
// blob reads use the Function's system-assigned identity (Storage Blob Data Contributor).
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
    context.error("theo_message_stream: storage token for attachments failed (non-fatal)", tokErr);
    return rows.map((r) => ({ type: "text", text: `[Attached file "${r.filename}" could not be loaded.]` }));
  }

  const blocks = [];
  let nativeBytes = 0;
  let extractChars = 0;
  for (const row of rows) {
    // Honor finalize's classification — a row marked extract-class (e.g. a large PDF promoted to
    // text) injects its extracted text, not a giant document block, even though content_type is
    // application/pdf. Only non-extract rows with a native media type inject document/image blocks.
    const isExtractRow = row.ingestion_class === "extract"; // extract-class NEVER falls back to native (T13)
    const native = !isExtractRow && NATIVE_MEDIA_TYPES[row.content_type];
    try {
      if (native) {
        const buf = await downloadBlobBinary(storageToken, row.blob_path);
        if (nativeBytes + buf.length > ATTACH_NATIVE_BUDGET_BYTES) {
          blocks.push({ type: "text", text: `[Attached file "${row.filename}" omitted — exceeds the per-message attachment size budget.]` });
          continue;
        }
        nativeBytes += buf.length;
        const b64 = buf.toString("base64");
        if (native === "document") {
          blocks.push({ type: "document", source: { type: "base64", media_type: row.content_type, data: b64 } });
        } else {
          blocks.push({ type: "image", source: { type: "base64", media_type: row.content_type, data: b64 } });
        }
        blocks.push({ type: "text", text: `(above is the attached file "${row.filename}")` });
      } else if (isExtractRow && row.extracted_text_path) {
        const text = await downloadBlobText(storageToken, row.extracted_text_path);
        const remaining = ATTACH_EXTRACT_BUDGET_CHARS - extractChars;
        if (remaining <= 0) {
          blocks.push({ type: "text", text: `[Attached file "${row.filename}" omitted — exceeds the per-message extracted-text budget.]` });
          continue;
        }
        const clipped = text.length > remaining ? text.slice(0, remaining) + "\n…[truncated]" : text;
        extractChars += clipped.length;
        blocks.push({ type: "text", text: `Attached file "${row.filename}" (${row.content_type}):\n\n${clipped}` });
      } else {
        blocks.push({ type: "text", text: `[Attached file "${row.filename}" (${row.content_type}) is stored but could not be read into this message.]` });
      }
    } catch (attErr) {
      context.error(`theo_message_stream: attachment ${row.id} load failed (non-fatal)`, attErr);
      blocks.push({ type: "text", text: `[Attached file "${row.filename}" could not be loaded.]` });
    }
  }
  return blocks;
}

// Parse the accumulated upstream SSE text to reconstruct the assistant turn for persistence.
// (The raw SSE is relayed to the client verbatim; this parse is ONLY for the DB write.) Thinking
// deltas are intentionally ignored — thinking is ephemeral and not persisted as message content.
function parseSseForPersistence(raw) {
  let text = "";
  let model = null;
  let stopReason = null;
  let usage = null;
  const citations = [];
  for (const ev of raw.split("\n\n")) {
    const dataLine = ev.split("\n").find((l) => l.startsWith("data:"));
    if (!dataLine) continue;
    const json = parseJsonSafe(dataLine.slice(5).trim());
    if (!json || typeof json.type !== "string") continue;
    if (json.type === "message_start" && json.message && typeof json.message.model === "string") {
      model = json.message.model;
    } else if (json.type === "content_block_delta" && json.delta) {
      if (json.delta.type === "text_delta" && typeof json.delta.text === "string") {
        text += json.delta.text;
      } else if (json.delta.type === "citations_delta" && json.delta.citation) {
        citations.push(json.delta.citation);
      }
    } else if (json.type === "message_delta") {
      if (json.delta && json.delta.stop_reason != null) stopReason = json.delta.stop_reason;
      if (json.usage != null) usage = json.usage;
    }
  }
  return { text, citations, model, stopReason, usage };
}

// Persist the completed turn (HF-T2; explicit created_by ownership; shared vaultgpt instance).
// Mirrors theo_message's persistence EXACTLY (incl. B8i message_seq linkage). Returns conversationId.
async function persistTurn(opts) {
  const { oid, requestedConversationId, appKey, appContext, userText, attachmentIds, acc } = opts;
  const assistantModel = acc.model || FOUNDRY_DEPLOYMENT;
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

    let conversationId = requestedConversationId;
    if (conversationId) {
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
        acc.text,
        assistantModel,
        acc.citations.length ? JSON.stringify(acc.citations) : null,
      ]
    );

    await client.query(
      `UPDATE public.theo_conversations SET updated_at = now() WHERE id = $1 AND created_by = $2`,
      [conversationId, oid]
    );

    await client.query("COMMIT");
    return conversationId;
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
}

app.http("theo_message_stream", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const jsonErr = (status, code, message) => ({
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      jsonBody: errorBody(code, message, status),
    });

    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    const principal = getPrincipal(request);
    const oid = getClaimValue(principal, [
      "http://schemas.microsoft.com/identity/claims/objectidentifier",
      "oid",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    ]);
    if (!oid) return jsonErr(401, "UNAUTHORIZED", "Missing or invalid EasyAuth identity.");
    if (!FOUNDRY_BASE || !FOUNDRY_DEPLOYMENT) {
      context.error("theo_message_stream: missing gateway configuration");
      return jsonErr(500, "INTERNAL_SERVER_ERROR", "Model gateway is not configured.");
    }

    let body;
    try {
      body = JSON.parse((await request.text()) || "{}");
    } catch {
      return jsonErr(400, "BAD_REQUEST", "Request body is not valid JSON.");
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonErr(400, "BAD_REQUEST", "Field 'messages' must be a non-empty array.");
    }

    let maxTokens = Number.isInteger(body.max_tokens) ? body.max_tokens : DEFAULT_MAX_TOKENS;
    const systemPrompt = typeof body.system === "string" ? body.system : null;

    const requestedConversationId =
      typeof body.conversation_id === "string" && body.conversation_id.trim() !== ""
        ? body.conversation_id.trim()
        : null;
    const appKey =
      typeof body.app_key === "string" && body.app_key.trim() !== "" ? body.app_key.trim() : null;
    const appContext =
      body.app_context != null && typeof body.app_context === "object" ? body.app_context : null;

    const lastUserIndex = (() => {
      for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i];
        if (m && m.role === "user" && typeof m.content === "string") return i;
      }
      return -1;
    })();
    const userText = lastUserIndex >= 0 ? messages[lastUserIndex].content : "";

    if (requestedConversationId !== null && !isUuid(requestedConversationId)) {
      return jsonErr(400, "BAD_REQUEST", "Field 'conversation_id' must be a valid UUID.");
    }

    let attachmentIds = [];
    if (body.attachment_ids != null) {
      if (!Array.isArray(body.attachment_ids)) {
        return jsonErr(400, "BAD_REQUEST", "Field 'attachment_ids' must be an array of UUIDs.");
      }
      attachmentIds = [...new Set(body.attachment_ids)];
      if (attachmentIds.length > ATTACH_MAX_COUNT) {
        return jsonErr(400, "BAD_REQUEST", `At most ${ATTACH_MAX_COUNT} attachments may be sent per message.`);
      }
      if (!attachmentIds.every((id) => isUuid(id))) {
        return jsonErr(400, "BAD_REQUEST", "Every entry in 'attachment_ids' must be a valid UUID.");
      }
      if (attachmentIds.length > 0 && lastUserIndex < 0) {
        return jsonErr(400, "BAD_REQUEST", "Attachments require a user message with text content.");
      }
    }

    // ---- Memory injection (B7): prepend the user's distilled memory profile to the system prompt ----
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
        context.error("theo_message_stream: memory fetch failed (non-fatal)", memErr);
      } finally {
        if (memClient) {
          memClient.release();
        }
      }
    }

    // ---- History-RAG injection (B7b-2): recall relevant excerpts from the user's PAST conversations ----
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
        context.error("theo_message_stream: history-RAG retrieval failed (non-fatal)", histErr);
      }
    }

    context.log("theo ruleset " + THEO_RULESET_VERSION);
    const effectiveSystem =
      [THEO_RULESET, memoryBlock, historyBlock, systemPrompt].filter((s) => typeof s === "string" && s.trim() !== "").join("\n\n") || null;

    // ---- Attachments: fetch OWNED rows + assemble blocks; strict ownership (404 on any missing) ----
    let attachmentRows = [];
    try {
      if (attachmentIds.length > 0) {
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
          const res = await attClient.query(
            `
            SELECT id, filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path
            FROM public.theo_attachments
            WHERE id = ANY($1::uuid[]) AND created_by = $2
            `,
            [attachmentIds, oid]
          );
          attachmentRows = res.rows;
        } finally {
          attClient.release();
        }
        if (attachmentRows.length !== attachmentIds.length) {
          return jsonErr(404, "NOT_FOUND", "One or more attachments were not found.");
        }
        const orderById = new Map(attachmentIds.map((id, i) => [id, i]));
        attachmentRows.sort((a, b) => orderById.get(a.id) - orderById.get(b.id));
      }
    } catch (attErr) {
      context.error("theo_message_stream: attachment fetch failed", attErr);
      return jsonErr(500, "INTERNAL_SERVER_ERROR", "Failed to load attachments.");
    }

    // ---- Pre-stream conversation ownership check (so a non-owned id is a clean JSON 403/404, not a
    // mid-stream error). Persistence re-checks under the transaction as defense-in-depth. ----
    if (requestedConversationId) {
      let chkClient = null;
      try {
        chkClient = await pool.connect();
        await chkClient.query(
          `
          SELECT
            set_config('app.current_user_id', $1, false),
            set_config('request.jwt.claim.sub', $1, false),
            set_config('request.jwt.claim.oid', $1, false)
          `,
          [oid]
        );
        const owned = await chkClient.query(
          `SELECT id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
          [requestedConversationId, oid]
        );
        if (owned.rowCount === 0) {
          const existsResult = await chkClient.query(
            `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
            [requestedConversationId]
          );
          const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
          return exists
            ? jsonErr(403, "FORBIDDEN", "You do not have access to this conversation.")
            : jsonErr(404, "NOT_FOUND", "Conversation not found.");
        }
      } catch (chkErr) {
        context.error("theo_message_stream: conversation ownership check failed", chkErr);
        return jsonErr(500, "INTERNAL_SERVER_ERROR", "Failed to verify the conversation.");
      } finally {
        if (chkClient) chkClient.release();
      }
    }

    const attachmentBlocks = await buildAttachmentBlocks(context, attachmentRows);

    let messagesForUpstream = messages;
    if (attachmentBlocks.length > 0 && lastUserIndex >= 0) {
      messagesForUpstream = messages.map((m, i) => {
        if (i !== lastUserIndex) return m;
        return {
          ...m,
          content: [...attachmentBlocks, { type: "text", text: userText }],
        };
      });
    }

    // ---- Open the upstream Foundry stream; decide JSON-error vs stream from the response status ----
    let token;
    try {
      token = await getFoundryToken();
    } catch (e) {
      return jsonErr(e.status || 500, e.code || "INTERNAL_SERVER_ERROR", e.message || "Model gateway token failed.");
    }

    if (THINKING_BUDGET > 0 && maxTokens <= THINKING_BUDGET) {
      maxTokens = THINKING_BUDGET + 1024; // Anthropic requires max_tokens > thinking budget
    }
    const upstreamPayload = JSON.stringify({
      model: FOUNDRY_DEPLOYMENT,
      max_tokens: maxTokens,
      ...(effectiveSystem ? { system: effectiveSystem } : {}),
      messages: messagesForUpstream,
      tools: buildGroundingTools(),
      stream: true,
      ...(THINKING_BUDGET > 0 ? { thinking: { type: "enabled", budget_tokens: THINKING_BUDGET } } : {}),
    });

    const upstreamRes = await new Promise((resolve) => {
      const u = new URL(`${FOUNDRY_BASE}/anthropic/v1/messages`);
      const lib = u.protocol === "http:" ? http : https;
      const r = lib.request(
        {
          method: "POST",
          hostname: u.hostname,
          port: u.port ? Number(u.port) : 443,
          path: u.pathname + u.search,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "anthropic-version": ANTHROPIC_VERSION,
            "anthropic-beta": WEB_FETCH_BETA,
            "Content-Length": Buffer.byteLength(upstreamPayload),
            Accept: "text/event-stream",
          },
        },
        (res) => resolve(res)
      );
      r.on("error", (e) => {
        context.error("theo_message_stream: upstream connect failed", e);
        resolve(null);
      });
      r.write(upstreamPayload);
      r.end();
    });

    if (!upstreamRes) {
      return jsonErr(502, "BAD_GATEWAY", "Model gateway call failed.");
    }
    if (upstreamRes.statusCode < 200 || upstreamRes.statusCode >= 300) {
      const errText = await new Promise((res) => {
        let d = "";
        upstreamRes.setEncoding("utf8");
        upstreamRes.on("data", (c) => { d += c; });
        upstreamRes.on("end", () => res(d));
        upstreamRes.on("error", () => res(d));
      });
      context.error("theo_message_stream: gateway non-2xx", upstreamRes.statusCode, errText.slice(0, 300));
      if (upstreamRes.statusCode === 429) {
        return jsonErr(429, "RATE_LIMITED", "Model gateway rate limit exceeded.");
      }
      return jsonErr(502, "BAD_GATEWAY", "Model gateway call failed.");
    }

    // ---- 2xx → stream. Relay upstream SSE verbatim to the client AND accumulate for persistence. ----
    const stream = new PassThrough();
    let rawAll = "";
    upstreamRes.setEncoding("utf8");
    upstreamRes.on("data", (chunk) => {
      rawAll += chunk;
      stream.write(chunk);
    });
    upstreamRes.on("end", async () => {
      let conversationId = null;
      try {
        const acc = parseSseForPersistence(rawAll);
        conversationId = await persistTurn({
          oid, requestedConversationId, appKey, appContext, userText, attachmentIds, acc,
        });
        // Emit a final app-level event so the FE learns the (possibly new) conversation id.
        stream.write(`event: vault_meta\ndata: ${JSON.stringify({ conversation_id: conversationId, model: acc.model || FOUNDRY_DEPLOYMENT })}\n\n`);
      } catch (perr) {
        // The answer was already streamed to the user; a persistence failure must not crash the
        // response — log it and tell the FE the turn was not saved (it just won't appear in history).
        context.error("theo_message_stream: persistence failed (answer already streamed)", perr);
        stream.write(`event: vault_meta\ndata: ${JSON.stringify({ conversation_id: null, persisted: false })}\n\n`);
      } finally {
        stream.end();
      }
    });
    upstreamRes.on("error", (e) => {
      context.error("theo_message_stream: upstream stream error", e);
      try { stream.write(`event: vault_error\ndata: ${JSON.stringify({ message: "The model stream was interrupted." })}\n\n`); } catch {}
      stream.end();
    });

    return {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
      body: stream,
    };
  },
});
```

## §FJ — function.json (both unchanged)
No change to either handler's binding. `theo_message` keeps its v3 `function.json` (POST/OPTIONS, anonymous); `theo_message_stream` keeps its v4 `app.http` registration. Methods, route, and auth level are unchanged.

## §DEPLOY — Walter deploy steps
1. **Land the artifact:** add `THEO_OPERATING_RULESET.md` → `governance/THEO_OPERATING_RULESET.md` (committed with this package on approval).
2. **Monolith (`vaultgpt-func-premium`, v3 copy-paste):** replace `theo_message/index.js` with §H-MESSAGE.
3. **Sidecar (`vaultgpt-func-stream`, v4 zip):** replace `theo_message_stream` with §H-STREAM (rebuild + zip-deploy as in B9; `node_modules` bundled; function.json/registration unchanged).
4. Reply "ruleset deployed" → Claude Code runs §GOLDEN against both endpoints.

## §GOLDEN — behaviour checks (Claude Code, post-deploy; token via `az`, never printed)
Run against both `theo_message` (monolith) and `theo_message_stream` (sidecar):
1. **Anti-fabrication:** ask for a citation Theo cannot verify (an obscure/likely-nonexistent ruling) → it declines or flags ("I couldn't verify this — confirm against [authority]") rather than inventing a number.
2. **Grounding + currency:** ask a tax specific (e.g., a current rate / a revenue procedure) → it uses search, cites a primary/official source, and notes the year/effective date.
3. **Materiality gating:** describe a simple fund transaction with no US-real-property facts → FIRPTA/USRPHC appears (if at all) only as a brief, labelled "contingent overlay," not as "key."
4. **Auditable shape:** a substantive question yields authority → rule → application → conclusion with the cite at the claim.
5. **Regression:** a non-tax request ("draft a short client email") → normal, helpful answer with no forced search; zero-attachment and attachment paths unchanged; streaming still streams.
6. **Injection present:** both endpoints carry the ruleset as the leading system block (the per-turn `theo ruleset <version>` log line appears in App Insights). Evidence under `.local/`.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of Operating Ruleset Pass-1 Backend VEP (plan only).*
