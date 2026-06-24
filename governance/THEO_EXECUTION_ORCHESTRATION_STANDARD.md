# THEO EXECUTION ORCHESTRATION STANDARD

Scope: Vault Theo (backend + frontend pipelines). The role-vocabulary, executor-model, and Decision-Register truth owner for the Theo execution pipeline.
Filename / location: `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md`.

> **Status: v0.1 DRAFT.** Establishes the orchestration layer the Conformance Standards reference (§4A P1 / F-P1 "role vocabulary" + "Decision Register"). Adapted from the Corporate Reporting Execution Orchestration Standard and retargeted to Theo per `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §0b. The pass model itself is owned by the Conformance Standards §4C (this standard points at it, does not restate it).

---

## §1 Authority and Relationship

This standard owns the role vocabulary (§1A), the executor model (§1C), and the Decision Register (§1B). The four-pass model is owned by `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` §4C and `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4C. Substantive truth (schema, contracts, handler/component structure) lives in the spec docs and Golden standards. On conflict over a matter another document owns, that document governs; detection is a halt + Role-C trigger.

## §1A Role Vocabulary (BINDING)

- **Claude Code** — author. Produces VEPs (Pass 1), implementation packages (Pass 3 execution), and Role-C verbatim-edit handoffs (Pass 4 authoring). Confined to a dedicated `vault-theo` development branch. Plans and hands off; never executes database writes, migrations, or deployments; never merges.
- **Codex** — reviewer (Pass 2) and Role-C inline executor (Pass 4). Approves or rejects (only those two verdicts); executes verbatim Role-C edits. Does not author plans or substantive governance content. Replaces Corporate Reporting's "Bolt."
- **ChatGPT** — Walter-advisory second opinion only. **Out of the formal pipeline.** Produces deterministic per-turn advisory notes Walter may forward; no ChatGPT artifact is a pipeline gate, grounding, or approval input. Neither Claude Code nor Codex acts on a ChatGPT note directly — they act on Walter's direction.
- **Walter** — authority. Sole execution authority (database writes, migrations, deployments, merges), sole runtime-acceptance authority, and sole authority who may grant governance exemptions (explicit, scoped, dated, recorded).

## §1B Theo Architecture Decision Register (Append-Only) — starter

Append-only register of committed Theo architecture/product decisions. Referenced by Conformance §4A P1 / F-P1. New entries require Walter approval + a Role-C landing. Each entry's substantive truth owner is the architecture doc section cited.

| DR-id | Decision | Truth owner |
|-------|----------|-------------|
| DR-T1 | App-context is **context-only**: Origin broadcasts `{app_key, app_context}` (the anchor), never client data; Theo reads through the app's API as the signed-in user. | architecture §3 |
| DR-T2 | A **server-side model gateway** is the only holder of model credentials (Entra managed identity, keyless); standard Anthropic Messages API shape; the model swap point. | architecture §2 |
| DR-T3 | **Tool-dispatch**: an app's published API is Theo's tool surface for that app; built-in Foundry tools + app-action tools (via Tool Manifest) + RAG; context-scoped. Theo never accesses another app's tables directly. | architecture §4 |
| DR-T4 | **`theo_` schema** conventions + RLS baseline (created_by = Entra OID; four policies per table; ownership default); net-new, additively namespaced in the shared `vaultgpt` instance; no direct `reporting_*` access. | architecture §0a / §5 |
| DR-T5 | **Frontend-first** delivery: 1A builds the complete surface against mocked contracts + in-memory state; 1B makes every surface true (persistence, RLS, RAG) behind validated contracts. | architecture §8.1 / §8.2 |
| DR-T6 | **Legacy early-Theo tables** (`conversations`, `chat_messages`, `theo_users`, etc.) are not preserved/migrated; decommissioning is a separate non-blocking workstream; do not build on or drop them without Walter direction. | architecture §7 |

## §1C Executor Model

| Operation | Executor |
|-----------|----------|
| Plan / VEP / implementation package authoring | Claude Code |
| Plan review (approve/reject) | Codex |
| Role-C documentation edits | Codex (inline), directed by Claude Code's verbatim handoff |
| Database writes, migrations, seed loads | **Walter** (from Claude Code's Walter-executable SQL) |
| Read-only grounding/verification SQL | Claude Code (local, `SELECT`-only) |
| Deployment (handlers, gateway, SWA) | **Walter** |
| Branch merge | **Walter** |
| Runtime / SWA acceptance | **Walter** |

## §1D Pipeline Orchestration

Microsteps flow Pass 1 (Claude Code VEP) → Pass 2 (Codex review) → Pass 3 (Walter execution + verification) → Pass 4 (Role-C documentation), per Conformance §4C (backend) / §4C (frontend). Passes are ordered, non-skippable, non-substitutable. ChatGPT advisory review may occur alongside any pass at Walter's request but is never one of the four passes. No pass proceeds without the prior pass's recorded output (an approved VEP before execution; a Walter execution confirmation before verification).
