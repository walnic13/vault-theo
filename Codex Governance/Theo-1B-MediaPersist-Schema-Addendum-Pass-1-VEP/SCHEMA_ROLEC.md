# Role-C Verbatim-Edit Handoff — Schema §5: `theo_messages.media` (Chat Media Persistence Part 1 documentation)

Pass-4 Role-C documentation amendment — the **schema-authority half of Part 1** (the DDL is `media_addendum.sql` in this same package). It documents the additive `theo_messages.media jsonb NULL` column in `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §5, so the accepted schema authority is current before the Part 2 (persist) + Part 3 (read) handler VEPs ground against it (Codex flagged the drift: the schema spec still stopped at `citations`). Mirrors the B8c/B8i addendum-documentation pattern. Two additive edits (the `theo_messages` §5 row + the additive-columns list). No code change; the migration itself is Walter-executed (`media_addendum.sql`).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Documentation-update package
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Turn issued against HEAD: `@@ISSUED_HEAD@@` (vault-theo, `development`; grounding parent `ec8f6d564b65f43fbf0608d14bcf7fb29d1ffe69`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Grounding-mode basis: Conformance §4 "Documentation-update package" row = Targeted Current-Turn Grounding. This lands the schema-authority documentation for `theo_messages.media`; the canonical DDL is `media_addendum.sql` (Walter-executed migration).

### §4 Documents grounded this turn
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Azure Postgres Schema (target — §5 `theo_messages`) — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` | `Read`+`Grep` this turn | `fa9aad4c75019de0b621e31b5d33ef97f3689639` |
| 2 | Claude Code Theo Governor Standard (Verbatim-Edit Handoff §11) — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` | `Grep` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 3 | Theo Grounding Conformance Standard (§3/§5) — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | §5 | "citations jsonb NULL` (web-grounding citations). Immutable" | Edit 1 — the `theo_messages` column list gains `media jsonb NULL` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | §5 | "Additive vs the §3 column sketch" | Edit 2 — the additive-columns list gains `theo_messages.media jsonb` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "exact before/after text for each edit" | Edits 1–2 are exact before/after blocks |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |

## Verbatim edits to `spec/THEO_AZURE_POSTGRES_SCHEMA.md`

### Edit 1 — the `theo_messages` §5 row: add `media jsonb NULL`
BEFORE (exact substring):
```
`citations jsonb NULL` (web-grounding citations). Immutable — no `updated_at`.
```
AFTER:
```
`citations jsonb NULL` (web-grounding citations), `media jsonb NULL` (Chat Media Persistence, 2026-07-25: an assistant turn's persisted inline media `{ image?, video? }` — fetched images/videos written by `theo_message_stream` at turn persist, returned by `theo_get_conversation` for reload re-render; NULL for turns with no persisted media / pre-migration rows; short-TTL SAS export NOT persisted. Additive; no RLS change; no backfill. Canonical DDL: `Codex Governance/Theo-1B-MediaPersist-Schema-Addendum-Pass-1-VEP/media_addendum.sql`). Immutable — no `updated_at`.
```

### Edit 2 — the additive-columns list: add `theo_messages.media jsonb`
BEFORE (exact substring):
```
`theo_messages.seq` (ordering key) + `theo_messages.citations jsonb` (web-grounding citations);
```
AFTER:
```
`theo_messages.seq` (ordering key) + `theo_messages.citations jsonb` (web-grounding citations) + `theo_messages.media jsonb` (Chat Media Persistence inline media, 2026-07-25);
```

## Boundary / no-drift
- One governed doc edited (`spec/THEO_AZURE_POSTGRES_SCHEMA.md` §5), two additive entries documenting the new `theo_messages.media` column. No other table/column changes; no RLS change; no backfill.
- The migration itself is `media_addendum.sql` (Walter-executed). This Role-C only makes the schema authority current so the Part 2/Part 3 handler VEPs (which read/write `media`) ground against a schema doc that lists it.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-MediaPersist-Schema-Addendum-Pass-1-VEP/SCHEMA_ROLEC.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-4 Role-C review (APPROVED / REJECTED only). On APPROVED, Claude Code applies Edits 1–2 byte-faithfully to `spec/THEO_AZURE_POSTGRES_SCHEMA.md` and commits — after which the Part 3 handler VEP + the §2.1 Role-C re-ground against the updated schema blob and resubmit. (This documentation may land ahead of Walter's migration; the column becomes live when the migration runs.)
