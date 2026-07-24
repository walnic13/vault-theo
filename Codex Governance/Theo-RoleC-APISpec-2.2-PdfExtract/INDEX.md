# Role-C Verbatim-Edit Handoff — API Spec §2.2: native text PDFs accepted (PdfExtract, post-deploy)

Pass-4 Role-C documentation amendment — the **post-deploy §2.2 correction** committed in the PdfExtract VEP (Gap §2). The `theo_add_project_knowledge_file` PDF-extraction change is **DEPLOYED + golden-curl-verified** on `vaultgpt-func-projects` (GC-PDF: a native text PDF → **201** `source_type='file'` with `pdf-parse`d text; GC6: native image → 400 with the OCR note; GC5/GC1 regression pass). This corrects the §2.2 file-knowledge row, which still says native PDFs ≤ 3 MB → 400, to reflect the deployed behavior (native text PDFs are accepted; only images / scanned-image PDFs → 400), closing the brief disclosed doc-vs-runtime window. Two before/after edits to the §2.2 row in `spec/THEO_API_SPEC.md`. No code/schema change.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Documentation-update package
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Turn issued against HEAD: `2c30eb21bbc84803ee21cb00f264c209c566d019` (vault-theo, `development`; grounding parent `3dea26feb416a35f4f0e8a7899f5ceaff5da55d1`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Grounding-mode basis: Conformance §4 "Documentation-update package" row = Targeted Current-Turn Grounding. Deploy evidence: PdfExtract VEP APPROVED (package 639a4ba) + deployed (run-from-package `pkg-639a4ba.zip`, pg+pdf-parse); golden curls this session — GC-PDF 201 (native text PDF, pdf-parse), GC5 201 (.txt), GC6 400 (native image), GC1 401; test data deleted after.

### §4 Documents grounded this turn
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo API Spec (target — §2.2) — `spec/THEO_API_SPEC.md` | `Grep` this turn | `94145351007d3b336320fb56ac3719b9d0ce860e` |
| 2 | Claude Code Theo Governor Standard (Verbatim-Edit Handoff) — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11) | `Grep` this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.2 | "native PDFs ≤ 3 MB / images" | Edit 2 — the rejection clause being corrected to reflect deployed native-PDF acceptance |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.2 | "add project knowledge from a file" | the row being amended |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "exact before/after text for each edit" | Edits 1–2 below are exact before/after blocks |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |

## Verbatim edits to `spec/THEO_API_SPEC.md` (§2.2 "add project knowledge from a file" row)

### Edit 1 — extraction description: add the in-handler pdf-parse fallback
BEFORE (exact substring):
```
reads its `extracted_text_path` sibling blob via managed identity; INSERTs
```
AFTER:
```
reads its `extracted_text_path` sibling blob via managed identity (or, when finalize left a PDF native with no extracted text, `pdf-parse`s the original blob in-handler — PdfExtract 2026-07-24); INSERTs
```

### Edit 2 — accepted-types / rejection clause: native text PDFs are accepted
BEFORE (exact substring):
```
Only attachments with extracted text (extract-class Excel/Word/PPT/CSV/TXT + PDFs > 3 MB) are accepted; native PDFs ≤ 3 MB / images → **400** `UNSUPPORTED_MEDIA_TYPE`.
```
AFTER:
```
Accepts any text-bearing document — extract-class (Excel/Word/PPT/CSV/TXT) + **PDFs of any size** (native PDFs ≤ 3 MB are text-extracted in-handler via `pdf-parse`, PdfExtract 2026-07-24; golden-curl-verified 201); only **images / scanned-image PDFs** (no text layer) → **400** `UNSUPPORTED_MEDIA_TYPE` (OCR not yet supported).
```

## Boundary / no-drift
- One governed doc edited (`spec/THEO_API_SPEC.md` §2.2), two additive corrections. Documents already-deployed + golden-curl-verified behavior; closes the disclosed doc-vs-runtime window from the PdfExtract VEP.
- The route, request/response shape, and other status codes are unchanged; only the accepted-input note is corrected.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-RoleC-APISpec-2.2-PdfExtract/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-4 Role-C review (APPROVED / REJECTED only). On APPROVED, Claude Code applies the two edits byte-faithfully to `spec/THEO_API_SPEC.md` and commits — closing the PdfExtract doc-vs-runtime window.
