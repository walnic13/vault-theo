# Role-C Verbatim-Edit Handoff — Theo API Spec §2.1 route correction + DEPLOYED (B1)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Corrects Theo API Spec §2.1 to the **deployed, golden-curl-verified** route and marks the chat/model-gateway endpoint **DEPLOYED**. Resolves the FE B1.5 T22 (the VEP correctly cites the deployed `theo_message`, but the API Spec still documented the never-deployed `/api/theo/message`).

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `1fd3870b81b35ce2378b77ced17396e5cb9e91fb` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C handoff) | `Read(...)` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3, §5) | `Read(...)` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C execution) | `Read(...)` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1) | `git show HEAD:spec/THEO_API_SPEC.md` (lines 21–24) this turn | `a524eefd859130f68561466e9535b2354871d97a` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | EDIT 1 format |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "Every substantive Claude Code or Codex turn MUST open with a table of the form" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive Claude Code or Codex turn MUST include, after the GCR, a Rule Anchor Table" | Rule Anchor Table (this pack) |
| spec/THEO_API_SPEC.md | §2.1 | "response `content[]` filtered to" | EDIT 1 target row (§2.1 chat/model-gateway) |

## Rationale
B1 deployed `theo_message` (underscore route, per the deployed Family-B `function.json` convention; FE B1.5 VEP §GR G-4) and it is **golden-curl-verified** (HTTP 200; `content[0].text == "ok"`; vault-theo `966dafd`). API Spec §2.1 still documents `POST /api/theo/message` (slash) — a route never deployed. This corrects the contract to deployed reality and marks it DEPLOYED, resolving the FE B1.5 **T22**.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor must be found exactly once or HALT. Target repo: `vault-theo`.

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.1 — correct route + mark DEPLOYED

**Locate (BEFORE) — found once:**

```
`1A-contract` (mock gateway) / `1B-deployed` (`POST /api/theo/message`)
```

**Replace with (AFTER):**

```
`1A-contract` (mock gateway) / `1B-deployed` — **DEPLOYED 2026-06-26** (`POST /api/theo_message`)
```

## Note
Route corrected slash → underscore to match the deployed handler (`theo_message`) and marked DEPLOYED (B1, golden-curl-verified). No other §2.1 field changes. This is part of the B1 close-out doc-update; the companion Golden Handler **HF-T1 DEPLOYED** mark and the architecture §2.2 auth-method alignment (client-credentials, B1 VEP §GR G-5) follow in the consolidated B1 close-out Role-C.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-API-Spec-theo-message-Route-RoleC/Theo_1B_API_Spec_Route_DEPLOYED_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-API-Spec-theo-message-Route-RoleC/Theo_1B_API_Spec_Route_DEPLOYED_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-API-Spec route Role-C. Apply EDIT 1 to `spec/THEO_API_SPEC.md` verbatim (BEFORE anchor found exactly once); HALT on mismatch. One file, one edit."*

*End of Role-C Verbatim-Edit Handoff.*
