# Role-C Verbatim-Edit Handoff — API Spec §2.1: `theo_message_stream` accepts optional `project_id` (Phase D / D3)

Pass-4 Role-C documentation amendment — the **companion contract documentation for D3**, sequenced with the D3 handler VEP (`Codex Governance/Theo-1B-D3-ProjectKnowledge-Retrieval-Pass-1-VEP/`). D3 adds a project-knowledge RAG injection to `theo_message_stream`; to know the active project it accepts a new **additive-optional** request field `project_id` (UUID; a present-but-invalid value → 400, mirroring `conversation_id`). The deployed §2.1 row currently says `theo_message_stream` has the **"same request shape"** as `theo_message` (whose extra fields are `conversation_id`/`app_key`/`app_context`), so `project_id` would be an **undocumented** request-contract extension — the exact gap Codex flagged on D3 (Golden Handler §3 + API Spec §2.1). This Role-C brings `project_id` into the §2.1 contract. **Applied on the D3 landing (post-deploy documentation, matching the PdfExtract §2.2 precedent)** — Claude Code applies it right after the D3 handler is deployed + golden-curl-verified. One additive edit to the §2.1 `theo_message_stream` row. No code/schema change.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Documentation-update package
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Turn issued against HEAD: `5327e8e524c719f8b09d449d0bc15f8268a5ec99` (vault-theo, `development`; grounding parent `00cb17a5dd306a3d1deea7c3162fd2cfc34b5491`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Grounding-mode basis: Conformance §4 "Documentation-update package" row = Targeted Current-Turn Grounding. Application is gated on the D3 handler deploy + golden curls (GC-D3a–d) — this Role-C is applied only after `theo_message_stream` on func-stream actually accepts `project_id`.

### §4 Documents grounded this turn
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo API Spec (target — §2.1 `theo_message_stream` row) — `spec/THEO_API_SPEC.md` | `Read`+`Grep` this turn | `435d72f7726070ba34077768919fa69f04fe03c4` |
| 2 | Claude Code Theo Governor Standard (Verbatim-Edit Handoff §11) — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` | `Grep` this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 3 | Theo Golden Handler Standard (§3 input contract) — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` | `Read` this turn | `5581657066da5d15227c7116eebf44cef5d04c93` |
| 4 | Theo Grounding Conformance Standard (§3/§5) — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "same request shape" | Edit 1 — the clause being extended with the additive `project_id` field |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "Validates input against the Theo API Spec contract" | this Role-C brings `project_id` into the §2.1 contract so D3's accepted field is documented |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "exact before/after text for each edit" | Edit 1 is an exact before/after block |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |

## Verbatim edit to `spec/THEO_API_SPEC.md` (§2.1 `theo_message_stream` row)

### Edit 1 — document the additive-optional `project_id` request field
BEFORE (exact substring):
```
`POST /api/theo_message_stream` — **same request shape** as `theo_message`; responds `text/event-stream`, relaying the upstream Anthropic SSE
```
AFTER:
```
`POST /api/theo_message_stream` — **same request shape** as `theo_message` plus an optional additive `project_id` (UUID) that names the active project for project-scoped knowledge-RAG injection (Phase D / D3; backward-compatible — omit for non-project chats; when absent the handler resolves the conversation's linked `theo_conversations.project_id`; a present-but-invalid `project_id` → **400**); responds `text/event-stream`, relaying the upstream Anthropic SSE
```

## Boundary / no-drift
- One governed doc edited (`spec/THEO_API_SPEC.md` §2.1), one additive field documented on the `theo_message_stream` row. `theo_message` (non-stream, on the READ-ONLY monolith) is unchanged — `project_id` is a `theo_message_stream`-only additive field, so the "same request shape" clause is amended to "same request shape … plus an optional `project_id`".
- No code/schema change. Applied post-D3-deploy (the field is live before it is documented) — matches the PdfExtract §2.2 documentation-after-deploy precedent; closes the D3 request-contract gap.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-RoleC-APISpec-2.1-project_id/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-4 Role-C review (APPROVED / REJECTED only), reviewed **together with** the D3 handler VEP it documents. On APPROVED, Claude Code applies Edit 1 byte-faithfully to `spec/THEO_API_SPEC.md` **immediately after** the D3 handler is deployed to func-stream + golden-curl-verified, and commits.
