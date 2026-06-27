# Role-C Verbatim-Edit Handoff — API Spec §2.1 document web-grounding citation shape

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Documents the **deployed, golden-curl-verified** B1.7 citation response shape in Theo API Spec §2.1 so the contract is locked (the FE Citations Rendering VEP cites it; un-spec'd contract = T22). The fields are additive and backward-compatible — the response shape is otherwise unchanged.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `a7d70bc6795641c5c508ad5177b9882398700194` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 chat / model gateway) | `sed -n '24p'` this turn | `4a1d2433c111ad7861e69f6d36acf72b8ef3e1d5` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `sed §4` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDIT 1 — Codex applies the §2.1 shape edit verbatim |
| spec/THEO_API_SPEC.md | §2.1 | "response `content[]` filtered to" | EDIT 1 target row (the §2.1 chat/model-gateway Shape cell) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
B1.7 (deployed, golden-curl-verified) returns Anthropic `web_search`/`web_fetch` citations on the gateway's `type:"text"` content blocks — real fields `{ type:"web_search_result_location", url, title, cited_text, encrypted_index }`. The contract was additive (B1.7 left the documented shape unchanged), so §2.1 does not yet lock the citation fields. The FE Citations Rendering VEP depends on them; this edit documents them so the cited contract exists (resolves the FE VEP T22). Additive, backward-compatible.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once or HALT. Target repo: `vault-theo`. Target file: `spec/THEO_API_SPEC.md`.

### EDIT 1 — §2.1 Shape cell: document the citation array

**Locate (BEFORE) — found once:**

```
| Send message → assistant reply | Standard Anthropic Messages API (`model`, `max_tokens`, `system`, `messages[]`); response `content[]` filtered to `type:"text"`; artifact markers `[[ARTIFACT …]]` parsed client-side | `1A-contract` (mock gateway) / `1B-deployed` — **DEPLOYED 2026-06-26** (`POST /api/theo_message`) | HF-T1 model gateway broker |
```

**Replace with (AFTER):**

```
| Send message → assistant reply | Standard Anthropic Messages API (`model`, `max_tokens`, `system`, `messages[]`); response `content[]` filtered to `type:"text"`; `web_search`/`web_fetch` grounding (B1.7) may attach a `citations` array to text blocks — each entry `{ type:"web_search_result_location", url, title, cited_text, encrypted_index }` (additive, backward-compatible); artifact markers `[[ARTIFACT …]]` parsed client-side | `1A-contract` (mock gateway) / `1B-deployed` — **DEPLOYED 2026-06-26** (`POST /api/theo_message`) | HF-T1 model gateway broker |
```

## Note
Only the §2.1 Shape cell changes (the `citations` clause inserted before the artifact-markers clause). Route/status/backing unchanged. Golden-curl-verified field shape (B1.7). After this lands, the FE Citations Rendering VEP cites the documented shape (T22 resolved).

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-API-Spec-Citations-Shape-RoleC/Theo_1B_API_Spec_Citations_Shape_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-API-Spec-Citations-Shape-RoleC/Theo_1B_API_Spec_Citations_Shape_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-API-Spec-Citations-Shape Role-C. Apply EDIT 1 to `spec/THEO_API_SPEC.md` §2.1 verbatim (BEFORE anchor found exactly once); HALT on mismatch. One file, one edit (Shape cell adds the citations array clause)."*

*End of Role-C Verbatim-Edit Handoff.*
