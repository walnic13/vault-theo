# Role-C Verbatim-Edit Handoff — API Spec §2.8: gateway injection DEPLOYED (B8d)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Advances the §2.8 Attachments read-path row in `spec/THEO_API_SPEC.md` from "gateway injection sequenced" to **DEPLOYED** — `theo_message` now injects native PDF/image content blocks + extracted text for owner-scoped attachments (B8d, golden-curl-verified: Claude answered "$42,000 / Da Vinci Fund III LP" from an uploaded PDF + XLSX). One verbatim edit; documentation-only. This closes the attachments **backend** read path; only the FE composer (B8e, Theo-FE regime) remains.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `4b621ee1193253d32d4fdfa321a6ff68b73481f3` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.8 Attachments read-path row) | `Grep("read uploaded files into a chat")` this turn | `be621ba62396a12c8ddd873d4805e433bc1d82cc` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDIT 1 — Codex applies verbatim |
| spec/THEO_API_SPEC.md | §2 | "Contract Surface" | EDIT 1 — §2.8 read-path status |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
B8d (gateway injection) is deployed and golden-curl-verified: `theo_message` accepts `attachment_ids` and injects native PDF/image content blocks + extracted text for owner-scoped attachments; Claude answered grounded in an uploaded PDF and XLSX (evidence `.local/b8d_payoff_verify_2026-06-29.txt`). The API Spec read-path row must advance from "sequenced" to DEPLOYED. Documentation-only; single edit.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once or HALT. Target: `spec/THEO_API_SPEC.md`.

### EDIT 1 — §2.8: advance the read-path row to DEPLOYED
**Locate (BEFORE) — found once:**
```
| read uploaded files into a chat (PDF/image as document/image content blocks; Excel/Word/PPT/CSV/TXT extracted to text) | `1B` — extraction-at-upload **DEPLOYED 2026-06-29** (B8c: extract-class text stored at `extracted_text_path`); gateway injection sequenced (B8d: `theo_message` injects native blocks / extracted text per token budget) | HF-T1 gateway + `theo_attachments` |
```
**Replace with (AFTER):**
```
| read uploaded files into a chat (PDF/image as document/image content blocks; Excel/Word/PPT/CSV/TXT extracted to text) | `1B-deployed` — **DEPLOYED 2026-06-29** (B8c extraction-at-upload + B8d gateway injection): `theo_message` accepts an optional top-level `attachment_ids: uuid[]`; for each owner-scoped attachment it injects a native PDF/image base64 `document`/`image` block or the extracted text (from `extracted_text_path`) into the upstream user turn, token/size-budgeted; non-owned id → 404. Golden-curl-verified (Claude answered grounded in an uploaded PDF + XLSX). FE composer (B8e) surfaces it in the UI. | HF-T1 gateway + `theo_attachments` |
```

## Note
One verbatim edit to `spec/THEO_API_SPEC.md` §2.8: the read-path row advances to DEPLOYED (B8c + B8d), documenting the deployed + golden-curl-verified attachment read path. Additive; documentation-only.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B8d-API-Spec-ReadPath-RoleC/Theo_1B_B8d_API_Spec_ReadPath_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-B8d-API-Spec-ReadPath-RoleC/Theo_1B_B8d_API_Spec_ReadPath_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-B8d-API-Spec-ReadPath Role-C. Apply EDIT 1 to `spec/THEO_API_SPEC.md` verbatim (BEFORE anchor found exactly once; HALT on mismatch): advance the §2.8 read-path row to DEPLOYED (B8c + B8d gateway injection). Documentation-only."*

*End of Role-C Verbatim-Edit Handoff.*
