# THEO TOOL MANIFEST

Scope: declares which **published Corporate Reporting API endpoints** Theo may call as app-action tools (architecture §4.2). A **pointer** to the canonical Corporate Reporting API Spec — never a fork.
Filename / location: `spec/THEO_TOOL_MANIFEST.md`.

> **Status: v0.1 SKELETON — empty authorized set.** No `reporting_*` endpoint is Theo-callable yet. Entries are added per Walter direction as a Theo feature needs them (1B). This manifest specifies *which* endpoints Theo may call, their inputs, and their semantics by **pointer**; the contract truth for each endpoint remains the canonical Corporate Reporting API Spec in the `corporate-reporting` repository (read-only; not copied here).

---

## §1 Binding Rules (architecture §0a / §1.3 / §4)

1. Theo NEVER accesses `reporting_*` tables or RLS directly. All Corporate Reporting reads/writes go through that repo's **published, RLS-governed API**, dispatched through the Theo model gateway **as the signed-in user** (HF-T3).
2. Theo MUST NOT fork, copy, or restate the Corporate Reporting API Spec / Schema / handler standards. They remain the single source of truth in `corporate-reporting`; this manifest references them.
3. Tool availability is **context-scoped**: the app-action tier reflects the current `app_key`. Origin-level chat (`app_key = NULL`) exposes only the built-in (Foundry) + RAG tiers, not app-action tools.
4. Adding an endpoint to the authorized set below is a governance change requiring explicit Walter direction (and, where it changes the regime, a Role-C landing).

## §2 Authorized `reporting_*` Endpoints (Theo-callable) — EMPTY at v0.1

| Tool id | Reporting endpoint | Inputs | Semantics | Canonical contract (read-only) | Status |
|---------|--------------------|--------|-----------|--------------------------------|--------|
| _(none yet)_ | — | — | — | `corporate-reporting/REPORTING_BACKEND_API_SPEC.md` | none authorized |

When the first endpoint is authorized, its row cites the exact `reporting_*` operation + the canonical API Spec section that owns its contract; Theo's dispatch validates against that referenced contract, never a local copy.

## §3 Built-in (Foundry) tool tier (no manifest entry required)

`web_search`, `web_fetch`, and code execution travel with the Foundry-hosted model (architecture §2.3 / §4.2) and are available regardless of `app_key`. They are not Corporate Reporting endpoints and are not listed here.
