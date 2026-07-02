# Role-C Verbatim-Edit Handoff — 1B Backend Plan: add the Memory Layer (Tier B7, option C)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Amends `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (v0.3 → v0.4) to **operationalize the architecture's named 1B `memory` pillar** (Architecture §8.2: "persistence, RLS, RAG, memory"). Adds **Tier B7 — Memory layer (option C)**: a distilled per-user **memory profile** (`theo_user_memory`, surfaced across all chats/projects) plus **cross-chat history-RAG** over the user's own `theo_messages` — both RLS-scoped and injected at HF-T1 system-prompt assembly. The amendment is plan-only (no schema DDL, no handler): it adds scope, a PROPOSED schema row, a 1A→1B seam row, the new tier, Decision-Register entries (D-7; D-3/D-5 gating extended), and an acceptance criterion. Walter is the plan-content authority (he chose option C); the plan remains DRAFT/NOT-YET-AUTHORITATIVE pending his approval.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `af6433092294376786869d23613618962b4471c4` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§1/§5/§6/§7/§8/§9) | `sed §1/§5/§6/§8/§9` this turn | `1733bdf19053d7173b72bfa9f0cf64e725cfdd3f` |
| 2 | Theo Architecture & Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§6 RAG; §8.2 seam; §2.4 ZDR) | `Read(offset=213, limit=8)` + `Grep("memory")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 3 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 deployed set; additive namespacing) | `Grep("theo_user_settings" / "additively namespaced")` this turn | `2c9d013b9bbff00c8023a8a19497bbab5f97a4f7` |
| 4 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 5 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | All EDITs — Codex applies verbatim |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §8.2 | "persistence, RLS, RAG, memory" | EDIT 3/4/5/6 — the memory pillar this amendment operationalizes |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §8 | "First authorized tool-dispatch endpoint" | EDIT 7 — D-7 added after the D-6 row |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
Walter chose **option C** for Theo memory: a distilled per-user *memory profile* (Claude-style, surfaced across all chats and projects) **and** memory of all prior discussions via *cross-chat history-RAG*. The architecture already names `memory` as a 1B pillar (§8.2) but the backend plan does not yet operationalize it — B6 RAG covers only the tax corpus + project knowledge, not the user's own conversation history, and no distilled-profile store exists. This amendment adds the memory layer as **Tier B7** (sequenced after B6, since it reuses the B6 Azure AI Search resource and the HF-T1 assembly seam), with its Decision-Register gates: **D-7** (distillation policy/trigger/model + user memory controls), **D-3** ZDR (memory distillation and history-RAG send chat content to the model/index → client-PII), and the **D-5** Azure AI Search sub-item (now also indexes `theo_messages`). Plan-only: the `theo_user_memory` DDL and handlers are authored per-microstep when B7 lands (the schema doc's DEPLOYED set is untouched here).

## Edit set (8 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT. Target repo: `vault-theo`. Target file: `governance/THEO_PHASE_1B_BACKEND_PLAN.md`.

### EDIT 1 — status line: v0.3 → v0.4
**Locate (BEFORE) — found once:**
```
**Status: DRAFT v0.3 — NOT YET AUTHORITATIVE.**
```
**Replace with (AFTER):**
```
**Status: DRAFT v0.4 — NOT YET AUTHORITATIVE.**
```

### EDIT 2 — status paragraph: note the v0.4 memory-layer addition
**Locate (BEFORE) — found once:**
```
and assigns **golden-curl execution to Claude Code** (§2A).
```
**Replace with (AFTER):**
```
and assigns **golden-curl execution to Claude Code** (§2A); **v0.4** adds **Tier B7 — the memory layer (option C)** — a distilled per-user memory profile (`theo_user_memory`) plus cross-chat history-RAG over the user's own `theo_messages` — operationalizing the architecture's named 1B *memory* pillar (Architecture §8.2).
```

### EDIT 3 — §1 In scope: add the Memory item
**Locate (BEFORE) — found once:**
```
5. **Tool dispatch** (HF-T3) — model tool-calls routed to authorized `reporting_*` endpoints, executed **as the signed-in user** through the published Reporting API (never direct table access).
```
**Replace with (AFTER):**
```
5. **Tool dispatch** (HF-T3) — model tool-calls routed to authorized `reporting_*` endpoints, executed **as the signed-in user** through the published Reporting API (never direct table access).
6. **Memory** (option C; HF-T4 + system-prompt assembly) — a distilled per-user **memory profile** (`theo_user_memory`) surfaced across all chats/projects, plus **cross-chat history-RAG** over the user's own `theo_messages`; both RLS-scoped and injected at HF-T1 system-prompt assembly. Operationalizes the architecture's 1B `memory` pillar (Architecture §8.2). Gated by D-3 (ZDR), the D-5 Azure AI Search sub-item, and D-7 (distillation policy).
```

### EDIT 4 — §5 schema: add the `theo_user_memory` PROPOSED row
**Locate (BEFORE) — found once:**
```
| `theo_user_settings` | per-user style + custom instructions | text PK = Entra OID; prepended to the system prompt |
```
**Replace with (AFTER):**
```
| `theo_user_settings` | per-user style + custom instructions | text PK = Entra OID; prepended to the system prompt |
| `theo_user_memory` *(B7, option C)* | distilled cross-chat memory item | `created_by` (Entra OID), `scope text` (`'user'`\|`'project'`), `project_id uuid NULL` (set when `scope='project'`), `kind text`, `content text`, `source_conversation_id uuid NULL`, `salience`/`updated_at`; user-viewable/editable; injected at system-prompt assembly; ownership RLS |
```

### EDIT 5 — §6 seam: add the Memory surface row
**Locate (BEFORE) — found once:**
```
| Retrieval | stub results | real Azure AI Search retrieval, RLS-scoped (HF-T4) |
```
**Replace with (AFTER):**
```
| Retrieval | stub results | real Azure AI Search retrieval, RLS-scoped (HF-T4) |
| Memory (option C) | *absent in 1A* | distilled per-user profile (`theo_user_memory`) + cross-chat history-RAG over `theo_messages`, RLS-scoped, injected at system-prompt assembly (B7) |
```

### EDIT 6 — §7: add Tier B7 after Tier B6
**Locate (BEFORE) — found once:**
```
- **Completion.** Project-knowledge-grounded answers retrieve real sources scoped to the user; Claude Code golden curls / eval pass.

---

## 8. Open decisions (Walter) — Decision Register seed
```
**Replace with (AFTER):**
```
- **Completion.** Project-knowledge-grounded answers retrieve real sources scoped to the user; Claude Code golden curls / eval pass.

### Tier B7 — Memory layer (option C; HF-T4 + HF-T1 assembly)
- **Purpose.** Give Theo durable memory across the user's chats and projects: a distilled profile of stable facts/preferences (Claude-style) **and** recall of prior discussions.
- **Deliverables.**
  - **B7a — Distilled memory profile.** `theo_user_memory` table (§5) + 4-policy ownership RLS + `_exists_unscoped(uuid)`; a **distillation step** (server-side model call, governed by D-7) that extracts stable memory items from completed turns (scope `user` or `project`); CRUD handlers so the user can **view/edit/delete** their memory (Claude-style controls); items injected at HF-T1 system-prompt assembly (user-scoped always; project-scoped when a `project_id` / `app_key` is active).
  - **B7b — Cross-chat history-RAG.** Extend the B6 Azure AI Search index to also index the user's own `theo_messages` (RLS-scoped to `created_by`); top-k hybrid retrieval injected at HF-T1 assembly so prior-conversation context is recalled across threads.
- **Completion.** A fact stated in one chat is recalled in another (profile); a question about a past discussion retrieves the relevant prior turns (history-RAG); the user can inspect and edit their memory; all strictly RLS-scoped to the signed-in user. **Gated:** D-3 ZDR (distillation + indexing are client-PII flows), the D-5 Azure AI Search sub-item (history-RAG index), and D-7 (distillation policy) — no live client-PII memory traffic before these resolve.

---

## 8. Open decisions (Walter) — Decision Register seed
```

### EDIT 7 — §8: add Decision D-7 after D-6
**Locate (BEFORE) — found once:**
```
| **D-6** | First authorized tool-dispatch endpoint (Tool Manifest empty at v0.1). | **OPEN.** Adding an endpoint to the authorized set is a governance change requiring explicit Walter direction. Gates B5. |
```
**Replace with (AFTER):**
```
| **D-6** | First authorized tool-dispatch endpoint (Tool Manifest empty at v0.1). | **OPEN.** Adding an endpoint to the authorized set is a governance change requiring explicit Walter direction. Gates B5. |
| **D-7** | Memory distillation policy (option C): trigger (post-turn / periodic / on-demand), extraction model, retention + salience, and user memory controls (view/edit/delete). | **OPEN.** Walter sets the distillation policy + model + retention; ownership-only RLS unless Walter authorizes otherwise. Gates B7. |
```

### EDIT 8 — §8: extend the PRE-LAND summary to include B7 gates
**Locate (BEFORE) — found once:**
```
Remaining open items are **PRE-LAND** for their tiers: D-3 gates live client-PII traffic (non-PII dev test proceeds earlier); the AI-Search sub-item of D-5 gates B6; D-6 gates B5. No tier proceeds on a guessed decision.
```
**Replace with (AFTER):**
```
Remaining open items are **PRE-LAND** for their tiers: D-3 gates live client-PII traffic (non-PII dev test proceeds earlier); the AI-Search sub-item of D-5 gates B6 **and the B7 history-RAG index**; D-6 gates B5; **D-7 gates B7 (memory distillation policy)**. B7's memory traffic is client-PII, so it is additionally gated by D-3. No tier proceeds on a guessed decision.
```

## Note
Eight additive/verbatim edits to one file (`governance/THEO_PHASE_1B_BACKEND_PLAN.md`). No DDL, no handler, no schema-doc change (the DEPLOYED set in `THEO_AZURE_POSTGRES_SCHEMA.md` is untouched; `theo_user_memory` DDL is authored per-microstep when B7 lands). §9 acceptance is left as-is in this pass — B7 completion is captured in its tier block (the §9 "done" list is the v1 surface set; memory can fold into a later acceptance pass once D-7 resolves). Plan remains DRAFT / NOT-YET-AUTHORITATIVE pending Walter approval.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-Plan-Memory-Layer-C-Amendment-RoleC/Theo_1B_Plan_Memory_Layer_C_Amendment_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-Plan-Memory-Layer-C-Amendment-RoleC/Theo_1B_Plan_Memory_Layer_C_Amendment_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-Plan-Memory-Layer-C Role-C. Apply EDITs 1–8 to `governance/THEO_PHASE_1B_BACKEND_PLAN.md` verbatim (each BEFORE anchor found exactly once; HALT on any mismatch). One file: v0.3→v0.4 status, §1 memory scope item, §5 `theo_user_memory` PROPOSED row, §6 Memory seam row, §7 new Tier B7, §8 D-7 + extended PRE-LAND summary. Additive only — no existing tier/decision text removed."*

*End of Role-C Verbatim-Edit Handoff.*
