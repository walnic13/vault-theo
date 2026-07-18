# THEO EXECUTION ORCHESTRATION STANDARD

Scope: Vault Theo (backend + frontend pipelines). The role-vocabulary, executor-model, and Decision-Register truth owner for the Theo execution pipeline.
Filename / location: `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md`.

> **Status: v0.1 DRAFT.** Establishes the orchestration layer the Conformance Standards reference (§4A P1 / F-P1 "role vocabulary" + "Decision Register"). Adapted from the Corporate Reporting Execution Orchestration Standard and retargeted to Theo per `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §0b. The pass model itself is owned by the Conformance Standards §4C (this standard points at it, does not restate it).

---

## §1 Authority and Relationship

This standard owns the role vocabulary (§1A), the executor model (§1C), and the Decision Register (§1B). The four-pass model is owned by `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` §4C and `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4C. Substantive truth (schema, contracts, handler/component structure) lives in the spec docs and Golden standards. On conflict over a matter another document owns, that document governs; detection is a halt + Role-C trigger.

## §1A Role Vocabulary (BINDING)

- **Claude Code** — author. Produces VEPs (Pass 1), implementation packages (Pass 3 execution), and Role-C verbatim-edit handoffs (Pass 4 authoring). Confined to a dedicated `vault-theo` development branch. Plans and hands off; never executes database writes or migrations; never merges. **Scoped deployment exception (§1E, DR-T7):** MAY execute Pass-3 deployment of handler/function code to a Walter-designated dedicated Theo Function App (`vaultgpt-func-chat`, `vaultgpt-func-theo-tools`, and the streaming sidecar `vaultgpt-func-stream`) after a Codex-APPROVED VEP; only the monolith `vaultgpt-func-premium` remains READ-ONLY / never written by Claude Code.
- **Codex** — reviewer (Pass 2) and Role-C inline executor (Pass 4). Approves or rejects (only those two verdicts); executes verbatim Role-C edits. Does not author plans or substantive governance content. Replaces Corporate Reporting's "Bolt."
- **ChatGPT** — Walter-advisory second opinion only. **Out of the formal pipeline.** Reviews Claude Code and Codex output each turn (and pre-reviews plans/packages in detail to conserve expensive Codex review turns), and produces deterministic per-turn advisory notes Walter may forward to whichever LLM is relevant — each note opening with a grounding directive that forces the recipient to re-ground. No ChatGPT artifact is a pipeline gate, grounding, or approval input. Neither Claude Code nor Codex acts on a ChatGPT note directly — they act on Walter's direction. Governed by `governance/CHATGPT_THEO_INFORMAL_REVIEW_STANDARD.md`.
- **Walter** — authority. Sole execution authority for database writes, migrations, and merges; sole deployment authority except the §1E scoped Theo-app deployment exception granted to Claude Code (DR-T7); sole runtime-acceptance authority; and sole authority who may grant governance exemptions (explicit, scoped, dated, recorded) — of which §1E is one.

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
| DR-T7 | **Scoped deployment exception**: Claude Code MAY deploy handler/function code (+ `function.json`) to the Walter-designated dedicated Theo Function Apps — `vaultgpt-func-chat`, `vaultgpt-func-theo-tools`, and the streaming sidecar `vaultgpt-func-stream` — after a Codex-APPROVED VEP; only the monolith (`vaultgpt-func-premium`) remains READ-ONLY; DB writes/migrations/merges remain Walter-only; Claude Code runs only read-only (`SELECT`) verification SQL. Walter-granted 2026-07-04 (`vaultgpt-func-chat`); extended to `vaultgpt-func-theo-tools` 2026-07-17 (DR-T10); extended to `vaultgpt-func-stream` 2026-07-17 (DR-T11, aligning with Golden Handler §5.5, which already recorded the func-stream deploy procedure). | this standard §1E |
| DR-T8 | **In-tenant Voice I/O** (Walter-directed 2026-07-17): Theo gains speech-to-text (dictation) and text-to-speech (read-aloud) via a keyless managed-identity **audio gateway broker** (Golden Handler HF-T6) to in-tenant Azure Cognitive Services — Azure OpenAI **Whisper** (STT) and **Azure AI Speech** neural voices (TTS). No third-party voice service; no client audio leaves the tenant; distinct from the Anthropic-hosted Claude *text* model (architecture §2.4). Deploys to `vaultgpt-func-chat` (DR-T7); stateless (no `theo_*` table, no migration). | `THEO_PHASE_1B_BACKEND_PLAN.md` Tier Voice; Golden Handler Standard §6 HF-T6 |
| DR-T9 | **Theo → downloadable Excel** (Walter-directed 2026-07-17): Theo emits a typed/formatted `.xlsx` from data it extracts (first use case: prior-year K-1 → current-year workpaper input), built **in-tenant** with SheetJS via a **spreadsheet export broker** (Golden Handler HF-T7), delivered as a short-TTL owner-scoped read-SAS download. Tool-driven (the model calls it on request), with a review-before-export step (accuracy-first). Deploys to `vaultgpt-func-theo-tools` (DR-T7/DR-T10); stateless (no `theo_*` table, no migration); the model-facing wiring is the general-chat tool-loop in `theo_message_stream` (`vaultgpt-func-stream`; `chat-tools` registry, DR-T11), Claude-deployed — `theo_message` on `vaultgpt-func-premium` is unchanged. v1.1 adds workpaper-template mapping. | `THEO_PHASE_1B_BACKEND_PLAN.md` Tier Export; Golden Handler Standard §6 HF-T7; API Spec §2.12 |
| DR-T10 | **Theo tools segregated to a dedicated Function App** (Walter-directed 2026-07-17): Theo's model-callable **tools** live in a dedicated `vaultgpt-func-theo-tools` Function App on the existing EP1 Premium plan (≈$0; same dedicated-app-on-EP1 pattern as `func-stream`/`func-dms`), not the monolith — isolating blast radius, keeping cold-start small at hundreds-of-tools scale, and making the tool library Claude-deployable end-to-end. **Windows, Azure Functions runtime v4, provisioned to mirror `func-stream`/`func-dms` exactly** (not the legacy v3 monolith). Own system-assigned MI; EasyAuth on the shared audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`. The general-chat tool-loop in `theo_message_stream` (`func-stream`, DR-T11) dispatches to tool endpoints there as the signed-in user (forwarded bearer), registry-driven via the **`chat-tools` registry** (NOT `THEO_TOOL_MANIFEST`, which is the separate, empty surface for Reporting app-action tools). Claude Code provisions it via Walter-granted `az` and deploys to it under the extended DR-T7 exception (after a Codex-APPROVED VEP). | this standard §1E; `THEO_PHASE_1B_BACKEND_PLAN.md` Tier Export |
| DR-T11 | **General-chat streaming tool-loop + func-stream deploy authority** (Walter-directed 2026-07-17): (a) Theo's general chat gains a **streaming agentic tool-loop** in `theo_message_stream` (`vaultgpt-func-stream`) — converting today's verbatim SSE relay into a parsed loop (reusing the Sigma `engine/tool-loop.js` spine, already on func-stream) that exposes registered **`vaultgpt-func-theo-tools`** tools to the model, dispatches `tool_use` to the tool endpoint as the signed-in user (shared `api://4e1a1e31-…` audience), feeds back `tool_result`, and emits a new **`event: vault_export`** SSE frame carrying a downloadable result `{downloadUrl,filename,contentType,byteSize,expiresAt}` (first tool: `theo_export_spreadsheet`, DR-T9). (b) **Deploy authority**: `vaultgpt-func-stream` joins the DR-T7 scoped deployment exception — Claude Code MAY deploy to it after a Codex-APPROVED VEP; only `vaultgpt-func-premium` remains READ-ONLY. Aligns the authority docs with Golden Handler §5.5. Concrete stream-event protocol + tool registry are specified at the MS1 backend VEP. | this standard §1E; API Spec §2.1 (`theo_message_stream`); MS1 backend VEP (mechanics) |

## §1C Executor Model

| Operation | Executor |
|-----------|----------|
| Plan / VEP / implementation package authoring | Claude Code |
| Plan review (approve/reject) | Codex |
| Role-C documentation edits | Codex (inline), directed by Claude Code's verbatim handoff |
| Database writes, migrations, seed loads | **Walter** (from Claude Code's Walter-executable SQL) |
| Read-only grounding/verification SQL | Claude Code (local, `SELECT`-only) |
| Deployment — gateway, SWA, monolith Function App (`vaultgpt-func-premium`) | **Walter** |
| Deployment — handler/function code to the designated dedicated Theo Function Apps (`vaultgpt-func-chat`, `vaultgpt-func-theo-tools`, `vaultgpt-func-stream`) | **Claude Code** (§1E / DR-T7 scoped exception; only after a Codex-APPROVED VEP) |
| Branch merge | **Walter** |
| Runtime / SWA acceptance | **Walter** |

## §1D Pipeline Orchestration

Microsteps flow Pass 1 (Claude Code VEP) → Pass 2 (Codex review) → Pass 3 (Walter execution + verification) → Pass 4 (Role-C documentation), per Conformance §4C (backend) / §4C (frontend). Passes are ordered, non-skippable, non-substitutable. ChatGPT advisory review may occur alongside any pass at Walter's request but is never one of the four passes. No pass proceeds without the prior pass's recorded output (an approved VEP before execution; a Walter execution confirmation before verification).

## §1E Scoped Deployment Authority Exception (Walter-granted, dated 2026-07-04)

Walter, as the sole authority who may grant governance exemptions (§1A), grants Claude Code a narrow, standing deployment exception (Decision Register DR-T7):

- **In scope:** Claude Code MAY execute Pass-3 deployment of **handler/function code + `function.json`** to a **Walter-designated dedicated Theo Function App**. The designated apps are **`vaultgpt-func-chat`**, **`vaultgpt-func-theo-tools`** (both Windows, Functions v4, EP1 plan `ASP-VaultTax-931c`), and the streaming sidecar **`vaultgpt-func-stream`** (Windows, Functions v4 programming model, EP1); `vaultgpt-func-theo-tools` was added by the DR-T10 amendment and `vaultgpt-func-stream` by the DR-T11 amendment (both Walter-granted 2026-07-17; func-stream aligns with the deploy procedure already recorded in Golden Handler §5.5). Adding any further app to this exception requires a further Walter-granted, Role-C-recorded amendment.
- **Precondition:** a Codex-APPROVED VEP for the microstep. No deployment before Pass-2 APPROVAL.
- **Absolute exclusions:** the monolith **`vaultgpt-func-premium`** is **READ-ONLY** — Claude Code MUST NEVER write, deploy to, or otherwise mutate it (Walter self-deploys the monolith via the Portal; Claude Code still runs its golden curls per Golden Handler §5.5). All **database writes and migrations remain Walter-only**; Claude Code runs only read-only (`SELECT`) verification SQL. **Branch merges remain Walter-only.**
- **Post-deploy:** Claude Code runs the deterministic golden-curl verification and reports results; documentation Role-C (Pass 4) follows per the normal pipeline.
