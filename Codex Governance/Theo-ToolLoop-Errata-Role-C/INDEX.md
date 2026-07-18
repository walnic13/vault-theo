# Role-C Verbatim-Edit Handoff — Tool-loop errata: align live docs to the shipped design

Corrects four Codex-confirmed stale references in the **live** Vault Theo authority docs. When the tool capability moved from the original Tier-Export plan (a manifest-driven wiring in `theo_message` on `func-premium`) to the shipped design (the general-chat tool-loop in `theo_message_stream` on `func-stream`, driven by the `chat-tools` registry, DR-T11), several references lagged. The shipped system is correct; these are **documentation errata only** — no behavior change. Confirmed genuine by Codex during the `vault-theo-tools` platform-doc ratification (2026-07-18). Historical `Codex Governance/` packages are point-in-time records and are **not** edited.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: E3
Turn issued against HEAD: vault-theo `__PKG_COMMIT__`.
Currency-anchor form: git blob SHA at HEAD.

## Rule Anchor Table

| file | section | quote |
| ---- | ------- | ----- |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" |
| spec/THEO_API_SPEC.md | §2.12 | "tool-manifest wiring in `theo_message` on `vaultgpt-func-premium`, Walter-deployed" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T10 | "registry-driven via `THEO_TOOL_MANIFEST`" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T11 | "API Spec §2.10 (`theo_message_stream`)" |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier Export | "`vaultgpt-func-premium` (tool-manifest wiring, Walter-deployed)" |

### Currency anchors (blob SHAs @ HEAD)
- spec/THEO_API_SPEC.md `3a317a934d6b2c88081a96f2ef12c7a9ebb30609`; governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md `81918381737bdefee77aaf1364edf8cfc1dc5889`; governance/THEO_PHASE_1B_BACKEND_PLAN.md `5d8b70e8c053424d9631ac433ca6c051f5fd5b16`.

## The correction (in one line)
The model-facing tool wiring is the **general-chat tool-loop in `theo_message_stream` (`vaultgpt-func-stream`), Claude-deployed, driven by the `chat-tools` registry** — NOT a manifest-driven wiring in `theo_message` on `func-premium` (which is unchanged), and NOT `THEO_TOOL_MANIFEST` (the separate, empty Reporting-app-action surface). The tool-loop contract is **API Spec §2.1**, not §2.10.

## Edits (exact before/after; each unique at HEAD)

### Edit 1 — API Spec §2.12 (the `theo_export_spreadsheet` row)
BEFORE:
`Invoked as a Theo tool (model-facing tool-manifest wiring in \`theo_message\` on \`vaultgpt-func-premium\`, Walter-deployed).`
AFTER:
`Invoked as a Theo tool via the general-chat tool-loop in \`theo_message_stream\` (\`vaultgpt-func-stream\`; \`chat-tools\` registry, DR-T11), Claude-deployed — \`theo_message\` on \`vaultgpt-func-premium\` is unchanged.`

### Edit 2 — Orchestration DR-T9
BEFORE:
`the model-facing tool-manifest wiring in \`theo_message\` (\`vaultgpt-func-premium\`) is Walter-deployed.`
AFTER:
`the model-facing wiring is the general-chat tool-loop in \`theo_message_stream\` (\`vaultgpt-func-stream\`; \`chat-tools\` registry, DR-T11), Claude-deployed — \`theo_message\` on \`vaultgpt-func-premium\` is unchanged.`

### Edit 3 — Orchestration DR-T10 (registry mechanism)
BEFORE:
`The \`theo_message\` tool-loop (\`func-premium\`) dispatches to tool endpoints there as the signed-in user (OBO), registry-driven via \`THEO_TOOL_MANIFEST\`.`
AFTER:
`The general-chat tool-loop in \`theo_message_stream\` (\`func-stream\`, DR-T11) dispatches to tool endpoints there as the signed-in user (forwarded bearer), registry-driven via the **\`chat-tools\` registry** (NOT \`THEO_TOOL_MANIFEST\`, which is the separate, empty surface for Reporting app-action tools).`

### Edit 4 — Orchestration DR-T11 (spec section)
BEFORE:
`this standard §1E; API Spec §2.10 (\`theo_message_stream\`); MS1 backend VEP (mechanics) |`
AFTER:
`this standard §1E; API Spec §2.1 (\`theo_message_stream\`); MS1 backend VEP (mechanics) |`

### Edit 5 — Phase 1B Tier Export (Deliverable, ~L204)
BEFORE:
`Invoked as a Theo tool: the model-facing tool-manifest wiring in \`theo_message\` (\`vaultgpt-func-premium\`) is Walter-deployed; the handler on \`vaultgpt-func-theo-tools\` is Claude-deployed (DR-T7/DR-T10).`
AFTER:
`Invoked as a Theo tool via the general-chat tool-loop in \`theo_message_stream\` (\`vaultgpt-func-stream\`; \`chat-tools\` registry, DR-T11) — the loop and the handler on \`vaultgpt-func-theo-tools\` are both Claude-deployed (DR-T7/DR-T10/DR-T11); \`theo_message\` on \`vaultgpt-func-premium\` is unchanged.`

### Edit 6 — Phase 1B Tier Export (Deploy target, ~L206)
BEFORE:
`\`vaultgpt-func-premium\` (tool-manifest wiring, Walter-deployed) and \`vaultgpt-func-chat\`/\`vaultgpt-func-stream\` otherwise untouched.`
AFTER:
`the general-chat tool-loop lives on \`vaultgpt-func-stream\` (\`theo_message_stream\`, DR-T11, Claude-deployed); \`vaultgpt-func-premium\` and \`vaultgpt-func-chat\` are otherwise untouched.`

## No other changes
Behavior is unchanged (the shipped system was always correct). Historical `Codex Governance/` VEP/amendment packages (e.g. the Tier-Export + segregation amendments, the fix VEPs) retain their original text as point-in-time records.

## Requested action
Codex: verify each before/after is byte-faithful at HEAD and APPROVE. On APPROVED, Claude Code commits the verified edits.
