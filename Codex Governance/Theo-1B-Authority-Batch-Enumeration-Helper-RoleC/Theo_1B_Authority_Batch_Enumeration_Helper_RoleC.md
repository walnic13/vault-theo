# Role-C Verbatim-Edit Handoff — sanction a SECURITY DEFINER enumeration helper for scheduled jobs (Golden Handler §3 + API Spec §1)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. **Walter-approved governance change (2026-06-28):** the Theo authorities currently permit a SECURITY DEFINER read ONLY as an *existence helper* for 403/404 discrimination. The B7 memory-distillation feature (option C) requires a **scheduled (timer) job** to enumerate work across all owners, which no current clause sanctions. This adds a narrow, sibling carve-out: a **SECURITY DEFINER enumeration helper**, invoked **only by scheduled (timer) handlers**, returning **only identifiers + owner ids (never user content)**, whose results are processed **per-owner under that owner's session context**. Two additive verbatim edits (Golden Handler §3 item 1; API Spec §1); the existing existence-helper carve-out is preserved unchanged. This unblocks the re-submitted B7 distillation RLS-fix VEP (`theo_due_conversations`).

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `98681f130367433dcc0a89e539d782d51417104f` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§3 item 1 credential rule) | `sed -n '17,25p'` this turn | `2ee83c036e21a5dabe3405b6532c3471c680da0b` |
| 2 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§1 Conventions credential rule) | `sed -n '10,16p'` this turn | `0d5ac940baf402cf369862694adcac394232c137` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDIT 1/2 — Codex applies verbatim |
| spec/THEO_API_SPEC.md | §1 | "No service-credential reads except an explicit SECURITY DEFINER existence helper" | EDIT 2 — the clause extended with the enumeration-helper carve-out |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
Codex correctly rejected the B7 distillation RLS-fix (T13): its `theo_due_conversations` SECURITY DEFINER **cross-owner enumeration** is broader than the sanctioned *existence helper* (403/404 only). Rather than misclassify it, the authority is extended — with Walter's approval — to explicitly permit a tightly-scoped enumeration helper for scheduled jobs. Guardrails baked into the wording: timer-handlers only; identifiers + owner ids only (no user content ever returned elevated); and all subsequent data access per-owner under `set_config` (RLS-valid, isolated). Additive; the existence-helper rule is unchanged.

## Edit set (2 verbatim edits, 2 files)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT.

### EDIT 1 — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` §3 item 1
**Locate (BEFORE) — found once:**
```
1. Authenticates the caller and executes **as the signed-in user** (Entra OID), honouring deployed RLS — never with elevated/service credentials except where a SECURITY DEFINER existence helper is explicitly invoked for 403/404 discrimination (architecture §5.1).
```
**Replace with (AFTER):**
```
1. Authenticates the caller and executes **as the signed-in user** (Entra OID), honouring deployed RLS — never with elevated/service credentials except (a) where a SECURITY DEFINER existence helper is explicitly invoked for 403/404 discrimination (architecture §5.1), or (b) where a **scheduled (timer) handler** invokes an explicit SECURITY DEFINER **enumeration helper** that returns ONLY identifiers + owner ids (never user content) to schedule per-owner work, after which the handler processes each owner under that owner's session context (`set_config`). No other elevated/service-credential reads are permitted.
```

### EDIT 2 — `spec/THEO_API_SPEC.md` §1 Conventions
**Locate (BEFORE) — found once:**
```
- Every endpoint executes **as the signed-in user** (Entra OID), honouring deployed RLS (architecture §3.3 / §5.2). No service-credential reads except an explicit SECURITY DEFINER existence helper.
```
**Replace with (AFTER):**
```
- Every endpoint executes **as the signed-in user** (Entra OID), honouring deployed RLS (architecture §3.3 / §5.2). No service-credential reads except (a) an explicit SECURITY DEFINER existence helper, or (b) an explicit SECURITY DEFINER enumeration helper invoked only by scheduled (timer) handlers, returning ONLY identifiers + owner ids (no user content), whose results are processed per-owner under that owner's session context.
```

## Note
Two additive edits across two files. The existing existence-helper carve-out is preserved verbatim; each edit only *extends* the exception with the narrowly-scoped enumeration-helper category. No other text changes. After this lands, the B7 distillation RLS-fix VEP is re-submitted citing carve-out (b).

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-Authority-Batch-Enumeration-Helper-RoleC/Theo_1B_Authority_Batch_Enumeration_Helper_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-Authority-Batch-Enumeration-Helper-RoleC/Theo_1B_Authority_Batch_Enumeration_Helper_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-Authority-Batch-Enumeration-Helper Role-C (Walter-approved governance change). Apply EDIT 1 to `governance/THEO_GOLDEN_HANDLER_STANDARD.md` §3 item 1 and EDIT 2 to `spec/THEO_API_SPEC.md` §1 verbatim (each BEFORE anchor found exactly once; HALT on mismatch). Both are additive — they extend the existing SECURITY DEFINER existence-helper exception with a narrow scheduled-job enumeration-helper carve-out (identifiers + owner ids only; per-owner processing). No other text changes."*

*End of Role-C Verbatim-Edit Handoff.*
