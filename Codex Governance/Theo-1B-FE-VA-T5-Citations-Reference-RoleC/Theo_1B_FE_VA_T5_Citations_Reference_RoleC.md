# Role-C Verbatim-Edit Handoff — register VA-T5 (Theo Citation Rendering Reference) in FE Conformance §4B

> Pass 4 documentation-update (Theo frontend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Registers the committed `artifacts/theo-citations-reference.jsx` as Visual Authority **VA-T5** so the FE Citations Rendering VEP may cite it and reproduce it faithfully. Walter-approved governance landing (§4B append rule 3). One file, one append edit.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `bc7c0e4ba8e4f9d5340b39d5f3f11c5a112b194a` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4B Visual Authority Registry) | `Grep("VA-T4 | Theo-in-Origin Mount Layout" / "A new row is a governance change")`; `sed §4B` this turn | `a73a49f7a680a10298642a634258d839cce165af` |
| 2 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("Codex executes the directed edits")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 3 | Reference artifact being registered — `artifacts/theo-citations-reference.jsx` | `Read(full, 1–193)` this turn; `sha256sum` this turn | `56a3be463cddde10f6a02db0031b50952aa2cfa28ee33f206f284cb949f9812a` (sha256 == git blob, byte-preserved via `-text`) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDIT 1 — Codex appends the VA-T5 row verbatim to the §4B registry |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A new row is a governance change" | this pack is the Walter-approved Pass-4 §4B governance landing |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "New rows added at the bottom with a monotonically increasing" | EDIT 1 appends VA-T5 immediately after VA-T4 (monotonic; VA-T4 = the current last row) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
Walter directed reproducing the Claude-style inline-citation pattern from `theo-citations-reference.jsx` ("reproduce it; do not redesign it"). To cite + reproduce it under the FE regime, the artifact must be a registered Visual Authority (§4B; un-registered citation = T21). The file is committed byte-preserving (`bc7c0e4`, sha256 `56a3be46…`). This Role-C appends it as **VA-T5**, after which the FE Citations Rendering VEP reproduces it as VISUAL-AUTHORITY-MATCH.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once or HALT. Target repo: `vault-theo`. Target file: `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md`.

### EDIT 1 — append the VA-T5 row to the §4B Visual Authority Registry

**Locate (BEFORE) — found once:**

```
| VA-T4 | Theo-in-Origin Mount Layout | `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §3A + `governance/THEO_1A_FRONTEND_HANDOVER.md` §4 | The hosted mount layout: Theo as the Origin 9/10 landing surface; permanent collapsible Theo nav section in the 1/10 (below Vault Files, above Vault Origin Apps); app-sidebar stacking; in-app right-hand Theo panel ("Open Theo" 9/10 toggle); in-shell Module Federation (no iframe) | CURRENT — landed via Role-C |
```

**Replace with (AFTER):**

```
| VA-T4 | Theo-in-Origin Mount Layout | `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §3A + `governance/THEO_1A_FRONTEND_HANDOVER.md` §4 | The hosted mount layout: Theo as the Origin 9/10 landing surface; permanent collapsible Theo nav section in the 1/10 (below Vault Files, above Vault Origin Apps); app-sidebar stacking; in-app right-hand Theo panel ("Open Theo" 9/10 toggle); in-shell Module Federation (no iframe) | CURRENT — landed via Role-C |
| VA-T5 | Theo Citation Rendering Reference | `artifacts/theo-citations-reference.jsx` | Inline web-grounding citation affordance: a favicon+sequential-index chip immediately after each cited claim; hover/focus opens a source card (host, title, 3-line-clamped cited_text snippet); adjacent chips for multi-source claims; each chip a real `<a target="_blank" rel="noopener noreferrer">` with an aria-label; keyboard-accessible. Zero-dependency inline-style idiom (matches VA-T1). Reproduce faithfully, do not redesign. | CURRENT — landed via Role-C; sha256 verified `56a3be463cddde10f6a02db0031b50952aa2cfa28ee33f206f284cb949f9812a` |
```

## Note
Append-only; VA-T1…VA-T4 unchanged. VA-T5 path points at the byte-preserved committed artifact (sha256 pinned, matches the git blob). No other §4B change. After this lands, the FE Citations Rendering VEP (next package) cites VA-T5 and reproduces it.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-FE-VA-T5-Citations-Reference-RoleC/Theo_1B_FE_VA_T5_Citations_Reference_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-FE-VA-T5-Citations-Reference-RoleC/Theo_1B_FE_VA_T5_Citations_Reference_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-FE-VA-T5 Role-C. Apply EDIT 1 to `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4B verbatim (BEFORE anchor found exactly once); HALT on mismatch. One file, one append (VA-T5 after VA-T4)."*

*End of Role-C Verbatim-Edit Handoff.*
