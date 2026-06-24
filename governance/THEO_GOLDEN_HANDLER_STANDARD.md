# THEO GOLDEN HANDLER STANDARD

Scope: Vault Theo backend handlers. The structural / SQL / curl truth owner for Theo handler implementation.
Filename / location: `governance/THEO_GOLDEN_HANDLER_STANDARD.md`.

> **Status: v0.1 DRAFT — canonical structures only.** This standard establishes the handler-structure, SQL, and curl conventions Theo backend handlers MUST follow, and is the truth owner the Conformance Standard §4A (P5/P6/P7, I2–I5) and the Theo Backend Governor §7 point at. The concrete handler **family registry** (§6) is a starter, populated as Theo backend handlers are authored through Phase 1B against the Theo API Spec and Theo Azure Postgres Schema. Reporting-specific families (Graph delegation, Tier-3 mapping, seed-load) are NOT carried.

---

## §1 Authority

The Conformance Standard governs grounding/format/invalidity. This standard governs handler structure, the Golden SQL Standard, and the Golden Curl Standard. The Theo Azure Postgres Schema owns DDL/RLS truth; the Theo API Spec owns contract truth. On conflict over those, those documents govern.

## §2 Canonical Primary Reference Selection

For each implementation package, Claude Code selects **exactly one** deployed handler file and **exactly one** deployed `function.json` file as the canonical Primary Reference, and inlines both full-verbatim in the turn (Conformance §6 T9). **Composite** selection (two handlers contributing different portions of the target pattern) is prohibited without Walter authorization (T10). When no deployed Theo handler yet exists for the pattern (greenfield), the package declares `PRIMARY REFERENCE: GREENFIELD` and names the governing authority (Theo API Spec entry + this standard's pattern §3) as the reference instead.

## §3 Handler Structure (Theo conventions)

Every Theo handler:
1. Authenticates the caller and executes **as the signed-in user** (Entra OID), honouring deployed RLS — never with elevated/service credentials except where a SECURITY DEFINER existence helper is explicitly invoked for 403/404 discrimination (architecture §5.1).
2. Reads/writes only `theo_` tables (architecture §5). It MUST NOT read or write `reporting_*` tables; any Corporate Reporting data is obtained by calling the published Reporting API as the user, per the Theo Tool Manifest (architecture §0a/§1.3/§4.3).
3. Validates input against the Theo API Spec contract; rejects unknown/extra fields; returns the spec's status codes.
4. Leaks nothing sensitive (no tokens, no raw OIDs/usernames, no upstream URLs, no model credentials) in responses or logs.
5. For the model gateway handler specifically: holds the Foundry credential server-side (Entra managed identity, keyless), brokers the standard Anthropic Messages API shape, and is the model swap point (architecture §2).

## §4 Allowed Deltas

A handler region is classified **EXACT** (byte-identical structural mirror of the Primary Reference) or **ALLOWED DELTA** (a permitted variation). Allowed deltas are limited to: table/column/endpoint names; the specific validated field set; the specific RLS-scoped query; the contract's response shape. A **new-domain or new-external-system helper** classified as ALLOWED DELTA requires either an EXACT mirror against a deployed handler containing that helper, or a Walter authorization quoted verbatim and predating the VEP (Conformance §6 item 12 / §10 T12). Anything else is a **DEVIATION** and must be justified or removed.

## §5 Structural Mirror Table, SQL Standard, Curl Standard

- **§5.1 Structural Mirror Table.** The implementation package emits a table mapping every handler region to the Primary Reference region with its EXACT / ALLOWED DELTA / DEVIATION classification, each backed by a Rule Anchor.
- **§5.2 Golden SQL Standard.** Migration files carry no top-level transaction control (`BEGIN`/`COMMIT`/`ROLLBACK`/`END`); handler-execution SQL uses explicit transaction control where required. Governed SQL blocks contain no prohibited psql meta-commands (`\echo`, `\set`, `\i`, `\copy`, `\gset`, `\connect`, `\c`, `\q`, `\watch`, `\!`, etc.); use `-- label` SQL comments for section labels (Conformance §10 T26). Walter executes all writes/migrations.
- **§5.3 Golden Curl Standard.** Every in-scope endpoint gets a deterministic golden curl: fixed method + path + headers + body, no unbound placeholders, reproducible inputs, and an asserted response shape. Curl determinism is enforced at Conformance §4A P7 / I4.
- **§5.4 Parity Checklist.** The package emits a parity checklist confirming each structural requirement of this standard is met.

## §6 Handler Family Registry (Theo starter)

Stable-id registry of Theo backend handler families, populated as families are authored.

| HF-id | Family | Scope | Status |
|-------|--------|-------|--------|
| HF-T1 | Model gateway broker | Server-side Foundry-Claude broker (Anthropic Messages API shape; Entra managed identity; web_search/web_fetch/code-exec built-ins) | PROPOSED (architecture §2; authored in 1B) |
| HF-T2 | `theo_` CRUD + RLS | Ownership-based CRUD over `theo_conversations` / `theo_messages` / `theo_projects` / `theo_project_knowledge` / `theo_artifacts` / `theo_artifact_versions` / `theo_user_settings` | PROPOSED (architecture §5.3; authored in 1B) |
| HF-T3 | Tool dispatch | Dispatch of app-action tools (published `reporting_*` etc.) as the signed-in user via the Tool Manifest | PROPOSED (architecture §4; authored in 1B) |
| HF-T4 | RAG retrieval | Azure AI Search hybrid retrieval over tax corpus + project knowledge, RLS-scoped, at the system-prompt assembly seam | PROPOSED (architecture §6; authored in 1B) |

Append rule: new families are added with a monotonically increasing `HF-Tn` id by a Walter-approved Role-C landing as each is authored against the Theo API Spec + Schema.
