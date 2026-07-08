# Theo 1B — Scoped Deployment-Authority Amendment (Claude Code MAY deploy handler/function code to the dedicated `vaultgpt-func-chat` app only) — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. This is a **Role-C Verbatim-Edit Handoff** (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4 executor model, §1C). It amends three governed documents to record a Walter-granted, scoped, dated deployment exception. **APPROVED / REJECTED only.** Claude Code does not self-edit governed documents; Codex applies the verbatim edits below.

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance amendment)
Turn issued against HEAD: `5d91bf2` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records a Walter-granted scoped deployment exception (Claude Code MAY deploy handler/function code to the dedicated `vaultgpt-func-chat` app only, post-APPROVED-VEP; monolith + sidecar READ-ONLY; DB writes/migrations/merges remain Walter-only). Amends the Orchestration Standard (§1A/§1B/§1C + new §1E), the Backend Governor Standard (§6), and the Phase 1B Backend Plan (RACI). Verbatim before/after for each edit below.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles; §1B Decision Register; §1C executor model) | `Read` §1 (lines 10–49) this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 2 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§6 Authorization boundary; §11 Role-C verbatim-edit mechanism) | `Read` §5–§12 (lines 28–62) this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 3 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (RACI: DB writes / migrations / deploys) | `Grep` line 32 this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 4 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3, §5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this handoff) |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1A | "sole authority who may grant governance exemptions (explicit, scoped, dated, recorded)" | Authority basis — Walter grants this exception; recorded per that clause |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §6 | "Claude Code never deploys" | EDIT 6 — amended to carve the scoped exception |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | RACI | "never deploys, never writes the DB" | EDIT 7 — amended to carve the scoped exception |

## Purpose

Walter has granted Claude Code a **narrow, standing, scoped** deployment exception and directed that it be formally documented. Walter's verbatim direction this turn:

> "i ran the sql and will continue to run sql as you suggest. you should always be the one that does the sql verification. i'd also like you to deploy the handlers. we can make sure we formalise this now so we have this documented properly. ONLY read only permissions still for the monolith function app."

This exception is grounded in the Orchestration Standard §1A clause naming Walter "sole authority who may grant governance exemptions (explicit, scoped, dated, recorded)." The edits below record it as **explicit** (enumerated scope), **scoped** (one designated app), **dated** (2026-07-04), and **recorded** (Decision Register DR-T7 + §1E). All other execution boundaries are preserved: DB writes/migrations/merges remain Walter-only; the monolith and streaming sidecar Function Apps remain READ-ONLY; Claude Code runs only read-only verification SQL.

## Verbatim edits (Codex to apply inline)

### EDIT 1 — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1A (Claude Code role)

**BEFORE (exact):**
```
- **Claude Code** — author. Produces VEPs (Pass 1), implementation packages (Pass 3 execution), and Role-C verbatim-edit handoffs (Pass 4 authoring). Confined to a dedicated `vault-theo` development branch. Plans and hands off; never executes database writes, migrations, or deployments; never merges.
```
**AFTER (exact):**
```
- **Claude Code** — author. Produces VEPs (Pass 1), implementation packages (Pass 3 execution), and Role-C verbatim-edit handoffs (Pass 4 authoring). Confined to a dedicated `vault-theo` development branch. Plans and hands off; never executes database writes or migrations; never merges. **Scoped deployment exception (§1E, DR-T7):** MAY execute Pass-3 deployment of handler/function code to a Walter-designated dedicated Theo Function App (currently `vaultgpt-func-chat` only) after a Codex-APPROVED VEP; the monolith `vaultgpt-func-premium` and the streaming sidecar `vaultgpt-func-stream` remain READ-ONLY / never written by Claude Code.
```

### EDIT 2 — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1A (Walter role)

**BEFORE (exact):**
```
- **Walter** — authority. Sole execution authority (database writes, migrations, deployments, merges), sole runtime-acceptance authority, and sole authority who may grant governance exemptions (explicit, scoped, dated, recorded).
```
**AFTER (exact):**
```
- **Walter** — authority. Sole execution authority for database writes, migrations, and merges; sole deployment authority except the §1E scoped Theo-app deployment exception granted to Claude Code (DR-T7); sole runtime-acceptance authority; and sole authority who may grant governance exemptions (explicit, scoped, dated, recorded) — of which §1E is one.
```

### EDIT 3 — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1B (append Decision Register row after the DR-T6 row)

**INSERT (exact) — new final row of the §1B table, immediately after the `| DR-T6 | ... | architecture §7 |` row:**
```
| DR-T7 | **Scoped deployment exception**: Claude Code MAY deploy handler/function code (+ `function.json`) to the Walter-designated dedicated Theo Function App — `vaultgpt-func-chat` only — after a Codex-APPROVED VEP; the monolith (`vaultgpt-func-premium`) and streaming sidecar (`vaultgpt-func-stream`) remain READ-ONLY; DB writes/migrations/merges remain Walter-only; Claude Code runs only read-only (`SELECT`) verification SQL. Walter-granted 2026-07-04. | this standard §1E |
```

### EDIT 4 — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1C (Executor Model table — replace the single Deployment row)

**BEFORE (exact):**
```
| Deployment (handlers, gateway, SWA) | **Walter** |
```
**AFTER (exact):**
```
| Deployment — gateway, SWA, monolith/sidecar Function Apps | **Walter** |
| Deployment — handler/function code to the designated dedicated Theo Function App (`vaultgpt-func-chat`) | **Claude Code** (§1E / DR-T7 scoped exception; only after a Codex-APPROVED VEP) |
```

### EDIT 5 — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (insert a new `## §1E` section immediately AFTER the §1D Pipeline Orchestration paragraph, so ordering reads §1A…§1D, §1E)

**INSERT (exact) — as a new section immediately after the §1D paragraph that ends "…a Walter execution confirmation before verification)." and before the next `##` heading:**
```
## §1E Scoped Deployment Authority Exception (Walter-granted, dated 2026-07-04)

Walter, as the sole authority who may grant governance exemptions (§1A), grants Claude Code a narrow, standing deployment exception (Decision Register DR-T7):

- **In scope:** Claude Code MAY execute Pass-3 deployment of **handler/function code + `function.json`** to a **Walter-designated dedicated Theo Function App**. The only designated app is **`vaultgpt-func-chat`** (Windows, Functions v4, EP1 plan `ASP-VaultTax-931c`). Adding any other app to this exception requires a further Walter-granted, Role-C-recorded amendment.
- **Precondition:** a Codex-APPROVED VEP for the microstep. No deployment before Pass-2 APPROVAL.
- **Absolute exclusions (unchanged):** the monolith **`vaultgpt-func-premium`** and the streaming sidecar **`vaultgpt-func-stream`** are **READ-ONLY** — Claude Code MUST NEVER write, deploy to, or otherwise mutate them. All **database writes and migrations remain Walter-only**; Claude Code runs only read-only (`SELECT`) verification SQL. **Branch merges remain Walter-only.**
- **Post-deploy:** Claude Code runs the deterministic golden-curl verification and reports results; documentation Role-C (Pass 4) follows per the normal pipeline.

```

### EDIT 6 — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` §6 (Authorization boundary bullet)

**BEFORE (exact):**
```
- **Authorization boundary:** Claude Code plans and hands off; Walter executes all database writes, migrations, and deployments. Claude Code never deploys.
```
**AFTER (exact):**
```
- **Authorization boundary:** Claude Code plans and hands off; Walter executes all database writes and migrations. Claude Code never writes or migrates the database. **Deployment:** Walter deploys, except the scoped exception (Theo Execution Orchestration Standard §1E, DR-T7; Walter-granted 2026-07-04) under which Claude Code MAY deploy handler/function code to the designated dedicated Theo Function App (`vaultgpt-func-chat` only) after a Codex-APPROVED VEP; the monolith `vaultgpt-func-premium` and streaming sidecar `vaultgpt-func-stream` remain READ-ONLY / never written by Claude Code.
```

### EDIT 7 — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (RACI row: DB writes / migrations / deploys)

**BEFORE (exact):**
```
| DB writes / migrations / deploys | **Walter only**. Claude Code plans + hands off Walter-executable SQL; never deploys, never writes the DB. |
```
**AFTER (exact):**
```
| DB writes / migrations / deploys | **Walter only** for DB writes, migrations, and merges. Claude Code plans + hands off Walter-executable SQL; never writes the DB. **Deploy exception (Orchestration §1E / DR-T7, 2026-07-04):** Claude Code MAY deploy handler/function code to the designated dedicated Theo Function App (`vaultgpt-func-chat` only) after a Codex-APPROVED VEP; the monolith + streaming sidecar remain READ-ONLY. |
```

## Post-execution note

Once Codex has applied EDITs 1–7 and the amendment is on `development`, the VC-1 Pass-3 deployment (7 chat handlers → `vaultgpt-func-chat`) proceeds under §1E against the already-APPROVED VC-1 VEP (`5d91bf2`), followed by Claude Code's golden-curl verification. No monolith or sidecar write occurs at any point.

*End of Role-C Verbatim-Edit Handoff.*
