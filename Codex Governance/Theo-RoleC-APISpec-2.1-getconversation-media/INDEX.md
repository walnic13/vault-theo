# Role-C Verbatim-Edit Handoff — API Spec §2.1: `theo_get_conversation` returns `media` (Chat Media Persistence Part 3)

Pass-4 Role-C documentation amendment — the **companion contract documentation for Part 3**, sequenced with the Part 3 handler VEP (`Codex Governance/Theo-1B-MediaPersist-GetConversation-Pass-1-VEP/`). Part 3 adds the new `theo_messages.media` column to `theo_get_conversation`'s message projection, so a reloaded thread returns each assistant turn's persisted inline media (images/videos). The deployed §2.1 "Get conversation" row enumerates the returned message fields (`{ id, seq, role, content, model, citations, created_at }`) — so `media` would be an **undocumented** additive response field. This Role-C adds it. **Applied on the Part 3 landing (post-deploy documentation, matching the D3 §2.1 / PdfExtract §2.2 precedents).** One additive edit to the §2.1 `theo_get_conversation` row. No code/schema change.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Documentation-update package
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Turn issued against HEAD: `2ae1a7200e64a4465355544c70b509f62e682598` (vault-theo, `development`; grounding parent `26b0dbfb44c23caffba65c944e08f275266e3863`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Grounding-mode basis: Conformance §4 "Documentation-update package" row = Targeted Current-Turn Grounding. Application is gated on the Part 3 handler deploy + golden curls — this Role-C is applied only after `theo_get_conversation` on premium actually returns `media`.

### §4 Documents grounded this turn
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo API Spec (target — §2.1 `theo_get_conversation` row) — `spec/THEO_API_SPEC.md` | `Read`+`Grep` this turn | `c99a66f39b4ec03644701c266e49aaf2bf52c2ed` |
| 2 | Claude Code Theo Governor Standard (Verbatim-Edit Handoff §11) — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` | `Grep` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 3 | Theo Azure Postgres Schema (§5 `theo_messages.media`) — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` | `Grep` this turn | `a698d85692b3ccaf052e639f226c76d31c20c0df` |
| 4 | Theo Grounding Conformance Standard (§3/§5) — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "messages: [{ id, seq, role, content, model, citations, created_at }]" | Edit 1 — the response enumeration being extended with `media` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "exact before/after text for each edit" | Edit 1 is an exact before/after block |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |

## Verbatim edit to `spec/THEO_API_SPEC.md` (§2.1 `theo_get_conversation` row)

### Edit 1 — document the additive `media` response field
BEFORE (exact substring):
```
response `{ conversation, messages: [{ id, seq, role, content, model, citations, created_at }] }`
```
AFTER:
```
response `{ conversation, messages: [{ id, seq, role, content, model, citations, media, created_at }] }` (`media` is the additive nullable jsonb `{ image?, video? }` an assistant turn's fetched images/videos were persisted with — Chat Media Persistence; written by `theo_message_stream`, NULL for turns with no persisted media / pre-migration rows)
```

## Boundary / no-drift
- One governed doc edited (`spec/THEO_API_SPEC.md` §2.1), one additive response field documented on the `theo_get_conversation` row. Other status codes / the `conversation` object / ordering are unchanged.
- No code/schema change. Applied post-Part-3-deploy (the field is live before it is documented) — matches the D3 §2.1 / PdfExtract §2.2 documentation-after-deploy precedent. `theo_messages.media` itself is documented by the Part 1 schema addendum.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-RoleC-APISpec-2.1-getconversation-media/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-4 Role-C review (APPROVED / REJECTED only), reviewed **together with** the Part 3 handler VEP it documents. On APPROVED, Claude Code applies Edit 1 byte-faithfully to `spec/THEO_API_SPEC.md` **immediately after** the Part 3 handler is deployed to premium + golden-curl-verified, and commits.
