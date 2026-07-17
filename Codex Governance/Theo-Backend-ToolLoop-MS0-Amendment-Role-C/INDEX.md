# Role-C Amendment Handoff — General-Chat Tool-Loop capability (DR-T11) + func-stream deploy-authority alignment

Amendment-first governance for the **general-chat streaming tool-loop** (the foundation for all future Theo model-callable tools) and for **`vaultgpt-func-stream` joining the Claude-Code deploy exception** (Walter-granted 2026-07-17). **Verbatim edits only — a capability/authority decision, no code.** Mechanics (the `theo_message_stream` stream-event spec + the func-theo-tools tool registry) are specified at the MS1 backend VEP that this DR authorizes.

> **Latent contradiction this resolves (disclosed):** Golden Handler §5.5 already lists `vaultgpt-func-stream` under "**Claude Code deploys** these" (with its region-stamped SCM host, verified 2026-07-08), but Orchestration §1A/§1C/§1E/DR-T7 and Governor §6 still call func-stream **READ-ONLY**. That is a pre-existing conflict. Walter's 2026-07-17 grant + this amendment align Orchestration + Governor to Golden Handler §5.5 (func-stream is Claude-deployable; only the monolith `vaultgpt-func-premium` stays READ-ONLY).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance amendment)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: E3
Turn issued against HEAD: vault-theo `d473201fd7c0307d4991c0d9bee17c81e30d939a`.
Currency-anchor form: git blob SHA at HEAD.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff format |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "the streaming sidecar **`vaultgpt-func-stream`** are **READ-ONLY**" | Edits 4–5 remove func-stream from the READ-ONLY exclusion |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T7 | "the monolith (`vaultgpt-func-premium`) and streaming sidecar (`vaultgpt-func-stream`) remain READ-ONLY" | Edit 2 extends DR-T7 to func-stream |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "**Claude Code deploys** these via Kudu VFS after a Codex-APPROVED VEP" | Alignment basis — func-stream deploy already recorded here (no edit; cited as the truth this amendment aligns to) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1B_BACKEND_PLAN.md | regime row | "the monolith + streaming sidecar remain READ-ONLY" | Edit 9 — the binding deploy-authority regime row (adds func-stream) |

### Currency anchors (blob SHAs @ HEAD)
- THEO_EXECUTION_ORCHESTRATION_STANDARD.md `123b09507b4fdebad25f5bad7e83364a93518f95`; CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md `bf2314f6eee3c947177712482c6e59dce6a796f5`; THEO_GOLDEN_HANDLER_STANDARD.md `49aa225aa6145adced121846de990725da5fe0f0`; THEO_PHASE_1B_BACKEND_PLAN.md `d202ff644986754a389570d98c9f633d41812adb`.

## Architecture & boundary reconciliation
- **Capability (DR-T11a):** general Theo chat gains a **streaming agentic tool-loop** in `theo_message_stream` (`vaultgpt-func-stream`). Today that handler verbatim-relays the upstream Anthropic SSE; the loop converts it to a parsed relay (the Sigma `sigma_review_agent_stream` pattern, reusing `engine/tool-loop.js` already deployed on func-stream) that: exposes registered **`vaultgpt-func-theo-tools`** tools to the model, dispatches `tool_use` to the tool endpoint **as the signed-in user** (forwarding the caller's bearer — func-stream and func-theo-tools share the `api://4e1a1e31-…` audience), feeds `tool_result` back, and emits a new **`event: vault_export`** SSE frame for a downloadable result `{downloadUrl,filename,contentType,byteSize,expiresAt}`. First tool: `theo_export_spreadsheet` (DR-T9). **Stateless w.r.t. new schema** — no `theo_*` table (persistence of turns is unchanged).
- **Authority (DR-T11b):** `vaultgpt-func-stream` joins the DR-T7 scoped deployment exception. Only `vaultgpt-func-premium` (monolith) remains READ-ONLY. This aligns Orchestration + Governor to Golden Handler §5.5.
- **Boundary unchanged:** no `reporting_*` access; no DB writes/migrations by Claude Code; merges Walter-only; monolith READ-ONLY.

## Gap Register
**PROCEED.** (1) The MS1 backend VEP specifies the concrete stream-event protocol (event names/payloads), the tool-registry shape (name → schema → func-theo-tools endpoint), and the dispatch/auth mechanics; this amendment lands only the capability decision + deploy authority (amendment-first). (2) The Phase Plan Tier + API Spec §2.10 behavioral row for the loop land at MS1 Role-C (as each prior tier did on deploy). (3) func-stream is the **v4 programming-model** layout (`src/functions/<fn>.js`, per Golden Handler §5.5) — noted for MS1 deploy mechanics.

## Edits (exact before/after; each unique at HEAD)

### Edit 1 — Orchestration §1A (Claude Code role), func-stream out of READ-ONLY
BEFORE:
`**Scoped deployment exception (§1E, DR-T7):** MAY execute Pass-3 deployment of handler/function code to a Walter-designated dedicated Theo Function App (\`vaultgpt-func-chat\` and \`vaultgpt-func-theo-tools\`) after a Codex-APPROVED VEP; the monolith \`vaultgpt-func-premium\` and the streaming sidecar \`vaultgpt-func-stream\` remain READ-ONLY / never written by Claude Code.`
AFTER:
`**Scoped deployment exception (§1E, DR-T7):** MAY execute Pass-3 deployment of handler/function code to a Walter-designated dedicated Theo Function App (\`vaultgpt-func-chat\`, \`vaultgpt-func-theo-tools\`, and the streaming sidecar \`vaultgpt-func-stream\`) after a Codex-APPROVED VEP; only the monolith \`vaultgpt-func-premium\` remains READ-ONLY / never written by Claude Code.`

### Edit 2 — Orchestration DR-T7 row, extend to func-stream
BEFORE:
`| DR-T7 | **Scoped deployment exception**: Claude Code MAY deploy handler/function code (+ \`function.json\`) to the Walter-designated dedicated Theo Function Apps — \`vaultgpt-func-chat\` and \`vaultgpt-func-theo-tools\` — after a Codex-APPROVED VEP; the monolith (\`vaultgpt-func-premium\`) and streaming sidecar (\`vaultgpt-func-stream\`) remain READ-ONLY; DB writes/migrations/merges remain Walter-only; Claude Code runs only read-only (\`SELECT\`) verification SQL. Walter-granted 2026-07-04 (\`vaultgpt-func-chat\`); extended to \`vaultgpt-func-theo-tools\` 2026-07-17 (DR-T10). | this standard §1E |`
AFTER:
`| DR-T7 | **Scoped deployment exception**: Claude Code MAY deploy handler/function code (+ \`function.json\`) to the Walter-designated dedicated Theo Function Apps — \`vaultgpt-func-chat\`, \`vaultgpt-func-theo-tools\`, and the streaming sidecar \`vaultgpt-func-stream\` — after a Codex-APPROVED VEP; only the monolith (\`vaultgpt-func-premium\`) remains READ-ONLY; DB writes/migrations/merges remain Walter-only; Claude Code runs only read-only (\`SELECT\`) verification SQL. Walter-granted 2026-07-04 (\`vaultgpt-func-chat\`); extended to \`vaultgpt-func-theo-tools\` 2026-07-17 (DR-T10); extended to \`vaultgpt-func-stream\` 2026-07-17 (DR-T11, aligning with Golden Handler §5.5, which already recorded the func-stream deploy procedure). | this standard §1E |`

### Edit 3 — Orchestration §1B register, add DR-T11 (insert immediately AFTER the DR-T10 row)
INSERT this new row on its own line directly after the existing `| DR-T10 | … |` row:
`| DR-T11 | **General-chat streaming tool-loop + func-stream deploy authority** (Walter-directed 2026-07-17): (a) Theo's general chat gains a **streaming agentic tool-loop** in \`theo_message_stream\` (\`vaultgpt-func-stream\`) — converting today's verbatim SSE relay into a parsed loop (reusing the Sigma \`engine/tool-loop.js\` spine, already on func-stream) that exposes registered **\`vaultgpt-func-theo-tools\`** tools to the model, dispatches \`tool_use\` to the tool endpoint as the signed-in user (shared \`api://4e1a1e31-…\` audience), feeds back \`tool_result\`, and emits a new **\`event: vault_export\`** SSE frame carrying a downloadable result \`{downloadUrl,filename,contentType,byteSize,expiresAt}\` (first tool: \`theo_export_spreadsheet\`, DR-T9). (b) **Deploy authority**: \`vaultgpt-func-stream\` joins the DR-T7 scoped deployment exception — Claude Code MAY deploy to it after a Codex-APPROVED VEP; only \`vaultgpt-func-premium\` remains READ-ONLY. Aligns the authority docs with Golden Handler §5.5. Concrete stream-event protocol + tool registry are specified at the MS1 backend VEP. | this standard §1E; API Spec §2.10 (\`theo_message_stream\`); MS1 backend VEP (mechanics) |`

### Edit 4 — Orchestration §1C executor table, Walter deployment row (drop sidecar)
BEFORE:
`| Deployment — gateway, SWA, monolith/sidecar Function Apps | **Walter** |`
AFTER:
`| Deployment — gateway, SWA, monolith Function App (\`vaultgpt-func-premium\`) | **Walter** |`

### Edit 5 — Orchestration §1C executor table, Claude deployment row (add func-stream)
BEFORE:
`| Deployment — handler/function code to the designated dedicated Theo Function Apps (\`vaultgpt-func-chat\`, \`vaultgpt-func-theo-tools\`) | **Claude Code** (§1E / DR-T7 scoped exception; only after a Codex-APPROVED VEP) |`
AFTER:
`| Deployment — handler/function code to the designated dedicated Theo Function Apps (\`vaultgpt-func-chat\`, \`vaultgpt-func-theo-tools\`, \`vaultgpt-func-stream\`) | **Claude Code** (§1E / DR-T7 scoped exception; only after a Codex-APPROVED VEP) |`

### Edit 6 — Orchestration §1E in-scope list (add func-stream)
BEFORE:
`- **In scope:** Claude Code MAY execute Pass-3 deployment of **handler/function code + \`function.json\`** to a **Walter-designated dedicated Theo Function App**. The designated apps are **\`vaultgpt-func-chat\`** and **\`vaultgpt-func-theo-tools\`** (both Windows, Functions v4, EP1 plan \`ASP-VaultTax-931c\`); \`vaultgpt-func-theo-tools\` was added by this DR-T10 amendment (Walter-granted 2026-07-17). Adding any further app to this exception requires a further Walter-granted, Role-C-recorded amendment.`
AFTER:
`- **In scope:** Claude Code MAY execute Pass-3 deployment of **handler/function code + \`function.json\`** to a **Walter-designated dedicated Theo Function App**. The designated apps are **\`vaultgpt-func-chat\`**, **\`vaultgpt-func-theo-tools\`** (both Windows, Functions v4, EP1 plan \`ASP-VaultTax-931c\`), and the streaming sidecar **\`vaultgpt-func-stream\`** (Windows, Functions v4 programming model, EP1); \`vaultgpt-func-theo-tools\` was added by the DR-T10 amendment and \`vaultgpt-func-stream\` by the DR-T11 amendment (both Walter-granted 2026-07-17; func-stream aligns with the deploy procedure already recorded in Golden Handler §5.5). Adding any further app to this exception requires a further Walter-granted, Role-C-recorded amendment.`

### Edit 7 — Orchestration §1E exclusions (monolith-only)
BEFORE:
`- **Absolute exclusions (unchanged):** the monolith **\`vaultgpt-func-premium\`** and the streaming sidecar **\`vaultgpt-func-stream\`** are **READ-ONLY** — Claude Code MUST NEVER write, deploy to, or otherwise mutate them. All **database writes and migrations remain Walter-only**; Claude Code runs only read-only (\`SELECT\`) verification SQL. **Branch merges remain Walter-only.**`
AFTER:
`- **Absolute exclusions:** the monolith **\`vaultgpt-func-premium\`** is **READ-ONLY** — Claude Code MUST NEVER write, deploy to, or otherwise mutate it (Walter self-deploys the monolith via the Portal; Claude Code still runs its golden curls per Golden Handler §5.5). All **database writes and migrations remain Walter-only**; Claude Code runs only read-only (\`SELECT\`) verification SQL. **Branch merges remain Walter-only.**`

### Edit 8 — Governor §6 authorization boundary (func-stream deployable)
BEFORE:
`under which Claude Code MAY deploy handler/function code to the designated dedicated Theo Function Apps (\`vaultgpt-func-chat\` and \`vaultgpt-func-theo-tools\`) after a Codex-APPROVED VEP; the monolith \`vaultgpt-func-premium\` and streaming sidecar \`vaultgpt-func-stream\` remain READ-ONLY / never written by Claude Code.`
AFTER:
`under which Claude Code MAY deploy handler/function code to the designated dedicated Theo Function Apps (\`vaultgpt-func-chat\`, \`vaultgpt-func-theo-tools\`, and the streaming sidecar \`vaultgpt-func-stream\`) after a Codex-APPROVED VEP; only the monolith \`vaultgpt-func-premium\` remains READ-ONLY / never written by Claude Code (extended 2026-07-17 by DR-T10/DR-T11).`

### Edit 9 — Phase Plan regime row (binding deploy-authority row, add func-stream)
BEFORE:
`| DB writes / migrations / deploys | **Walter only** for DB writes, migrations, and merges. Claude Code plans + hands off Walter-executable SQL; never writes the DB. **Deploy exception (Orchestration §1E / DR-T7, 2026-07-04; extended to \`vaultgpt-func-theo-tools\` 2026-07-17 / DR-T10):** Claude Code MAY deploy handler/function code to the designated dedicated Theo Function Apps (\`vaultgpt-func-chat\` and \`vaultgpt-func-theo-tools\`) after a Codex-APPROVED VEP; the monolith + streaming sidecar remain READ-ONLY. |`
AFTER:
`| DB writes / migrations / deploys | **Walter only** for DB writes, migrations, and merges. Claude Code plans + hands off Walter-executable SQL; never writes the DB. **Deploy exception (Orchestration §1E / DR-T7, 2026-07-04; extended to \`vaultgpt-func-theo-tools\` 2026-07-17 / DR-T10; extended to \`vaultgpt-func-stream\` 2026-07-17 / DR-T11):** Claude Code MAY deploy handler/function code to the designated dedicated Theo Function Apps (\`vaultgpt-func-chat\`, \`vaultgpt-func-theo-tools\`, and the streaming sidecar \`vaultgpt-func-stream\`) after a Codex-APPROVED VEP; only the monolith \`vaultgpt-func-premium\` remains READ-ONLY. |`

## No other changes
Golden Handler §5.5 already records the func-stream deploy split — **no edit** (cited as the alignment basis). The Phase Plan **binding regime row** (line 32) IS amended (Edit 9). The Phase Plan **per-tier** "untouched func-stream" notes (Voice tier ~L196; Export tier ~L206) are **per-tier historical facts** — they correctly describe what those specific tiers touched and are **not** amended (verified: neither asserts a global READ-ONLY regime). API Spec §2.10 line 101 ("monolith … and streaming sidecar … are unchanged") is a per-family note about the `theo_chat_*` endpoints — **not** amended.

## Requested action
Codex: verify each before/after is byte-faithful at HEAD, confirm the func-stream sweep is exhaustive (no remaining doc calls func-stream globally READ-ONLY), and APPROVE the amendment. On APPROVED, Claude Code commits the verified edits, then authors the MS1 backend VEP.
