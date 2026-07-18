# Role-C Verbatim-Edit Handoff — API Spec §2.1: document the general-chat `event: tool` / `event: tool_result` activity events

Documents the **already-DEPLOYED** general-chat activity events on the `theo_message_stream` §2.1 contract row. The tool-loop now streams `event: tool {name,input}` before each dispatch and `event: tool_result {name,ok}` after (Codex-APPROVED backend VEP; deployed + golden-verified on func-stream 2026-07-18), mirroring the Sigma stream — but §2.1's `theo_message_stream` row only recorded the loop + `vault_export`/`vault_meta`. This one-edit Role-C brings the contract into line with the shipped behaviour, so the paired FE VEP can ground its render against the accepted authority (Codex T22). **Verbatim edit only — documents live behaviour; no code change.**

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: E3
Turn issued against HEAD: vault-theo `d5bdd4ca0fc6668bcffef08f8f619276ee11e8d2`.
Currency-anchor form: git blob SHA at HEAD.

## Rule Anchor Table

| file | section | quote |
| ---- | ------- | ----- |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" |
| spec/THEO_API_SPEC.md | §2.1 | "loops up to `MAX_TOOL_TURNS`; a downloadable result additionally emits an additive `event: vault_export`" |

### Currency anchors (blob SHAs @ HEAD)
- spec/THEO_API_SPEC.md `015431576fb8e7f634025b785c97ea4022b93f0c`.

### Deploy evidence (this documents)
`event: tool` / `event: tool_result` DEPLOYED to `vaultgpt-func-stream` 2026-07-18 (Codex-APPROVED VEP; golden-verified: a tool turn streamed `event: tool {name:"theo_export_spreadsheet",input:{…}}` → `event: tool_result {name,ok:true}` → `vault_export` → `vault_meta`, in order; normal chat emitted none).

## Edit — API Spec §2.1, `theo_message_stream` row (document the activity events)
BEFORE:
`feeds the \`tool_result\` back, and loops up to \`MAX_TOOL_TURNS\`; a downloadable result additionally emits an additive \`event: vault_export\``
AFTER:
`feeds the \`tool_result\` back, and loops up to \`MAX_TOOL_TURNS\`. Each dispatched general-chat tool also streams \`event: tool\` / \`data: { name, input }\` (the instant it fires, before dispatch) and \`event: tool_result\` / \`data: { name, ok }\` (after) — the same clean activity events \`sigma_review_agent_stream\` emits — so the FE can render live agent activity (VA-T7). A downloadable result additionally emits an additive \`event: vault_export\``

## No other changes
Documents deployed behaviour on the one contract row; no schema/behaviour change. The `sigma_review_agent_stream` row already documents these events for its stream.

## Requested action
Codex: verify the before/after is byte-faithful at HEAD and APPROVE. On APPROVED, Claude Code commits the verified edit; the paired FE VEP (Theo-Frontend-ToolActivity) is then re-submitted grounding its render against this §2.1 shape.
