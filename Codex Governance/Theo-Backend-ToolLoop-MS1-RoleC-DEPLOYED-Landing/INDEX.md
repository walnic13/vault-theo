# Role-C Verbatim-Edit Handoff — Tool-Loop MS1 `theo_message_stream` DEPLOYED landing (API Spec §2.10)

Post-deploy documentation landing (Theo Governor §11). The general-chat tool-loop (DR-T11) is **DEPLOYED + golden-verified** on `vaultgpt-func-stream` (Codex-APPROVED VEP `5041b85`). This handoff records the tool-loop + `event: vault_export` on the `theo_message_stream` API Spec §2.10 row. **Verbatim edits only — behavior already live; docs catch up.**

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: E3
Turn issued against HEAD: vault-theo `1bc87e6a57d7b397b638c5c481809f7fab82e6c4`.
Currency-anchor form: git blob SHA at HEAD.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff format |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.10 | "then a final app event `event: vault_meta`" | Edit 1 inserts the tool-loop + `event: vault_export` before this clause |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T11 | "emits a new **`event: vault_export`** SSE frame carrying a downloadable result" | The capability this landing records DEPLOYED |

### Currency anchors (blob SHAs @ HEAD)
- THEO_API_SPEC.md `041dc861860a25c8fa406895530f8bde8d23513e`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `81918381737bdefee77aaf1364edf8cfc1dc5889`.

### Deploy evidence (this landing rests on)
DEPLOYED to `vaultgpt-func-stream` via Kudu VFS 2026-07-17 (GET-back identical); golden curls: unauth 401, OPTIONS 401 (EasyAuth), **regression** (normal chat = native text frames + `vault_meta`, no `vault_export`), **happy** (Theo called `theo_export_spreadsheet` → `event: vault_export` with an owner-scoped downloadUrl → GET 200 valid `.xlsx`, sheet "K-1", numeric Amount cells).

## Edits (exact before/after; each unique at HEAD)

### Edit 1 — API Spec §2.10 `theo_message_stream` contract body (add the tool-loop + `event: vault_export`)
BEFORE:
`token-by-token, then a final app event \`event: vault_meta\` / \`data: { conversation_id, model }\`; persists the full turn on stream completion`
AFTER:
`token-by-token. **Bounded agentic tool-loop (DR-T11, DEPLOYED 2026-07-17):** the built-in \`web_search\`/\`web_fetch\` PLUS registered \`vaultgpt-func-theo-tools\` tools (\`engine/chat-tools.js\`; first \`theo_export_spreadsheet\`) are exposed to the model; when the model calls a general-chat tool the handler dispatches it over HTTP to func-theo-tools **as the signed-in user** (forwarded bearer; shared \`api://4e1a1e31-…\` audience), feeds the \`tool_result\` back, and loops up to \`MAX_TOOL_TURNS\`; a downloadable result additionally emits an additive \`event: vault_export\` / \`data: { downloadUrl, filename, contentType, byteSize, expiresAt }\`. Normal (no-tool) chat is byte-unchanged. Then a final app event \`event: vault_meta\` / \`data: { conversation_id, model }\`; persists the full turn on stream completion`

### Edit 2 — API Spec §2.10 `theo_message_stream` status cell (record DEPLOYED)
BEFORE:
`(B9; golden-verified) | HF-T1 gateway (sidecar) + \`theo_conversations\`/\`theo_messages\` (HF-T2) |`
AFTER:
`(B9; golden-verified); **tool-loop + \`event: vault_export\` DEPLOYED 2026-07-17** (DR-T11; golden-verified: normal-chat regression + a tool turn that streamed \`vault_export\` → a valid downloadable \`.xlsx\`) | HF-T1 gateway (sidecar) + \`theo_conversations\`/\`theo_messages\` (HF-T2) |`

## No other changes
The tool-loop mechanics + registry live in code (func-stream `src/functions/theo_message_stream.js` + `src/engine/chat-tools.js`); DR-T11 already carries the capability decision. No schema/contract change beyond the additive `event: vault_export`.

## Requested action
Codex: verify each before/after is byte-faithful at HEAD and APPROVE; Claude Code commits the verified edits, then authors the FE VEP.
