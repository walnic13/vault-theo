# Role-C Verbatim-Edit Handoff — Apps Phase B / B1 pre-lands (FE Plan pass row + VA-T6 header clause)

> Pass 4 documentation-update package (Theo Frontend Conformance §4C Pass 4). Author = Claude Code (Role-C). Inline executor = **Codex**. Authority = Walter (Apps Phase B "full Claude-ification" mobile direction, 2026-07-09). Lands the two PRE-LAND gaps disclosed by the B1 Pass-1 VEP (`Codex Governance/VO-Apps-B1-Theo-Mobile-Chrome-Contract-Pass-1-VEP/`): **G1** — add the Apps-Phase-B B1 pass row to the Theo Phase 1A Frontend Plan §3 (the F-P1 sourcing rule requires a cited pass row before Pass 3); **G2** — add an explicit VA-T6 §4.1 clause authorizing suppression of Theo's own mobile header so the Origin host owns a single top bar. Two verbatim edits across two governed documents. No §4B registry row added (VA-T4 and VA-T6 already registered; this extends VA-T6's source clause only).

---

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Pass 4 — Documentation-update package (Role-C authoring)
Pass: Pass 4
Sub-phase Track: N/A
Turn issued against HEAD: `be6180093db56f044fe1efa8c80021a148b4dfe9` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding

| # | Document (name + path) | Read invocation this turn | Currency anchor (HEAD blob SHA) |
|---|------------------------|---------------------------|---------------------------------|
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§10 Role-C) | Grep(Role-C / Verbatim-Edit Handoff) this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4C Pass 4) | Read(full) this turn | `07e8dabbccc1d0394a493c6a6b358e38253e4f4b` |
| 3 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§4 Role-C execution) | Grep(§4 Role-C) this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | **TARGET** Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (§3 pass table) | Read(offset=41,limit=3) this turn | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 5 | **TARGET** Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§4.1 VA-T6) | Read(offset=114,limit=4) this turn | `097c2f2417872533374334a5cc031eb1ec583c60` |

---

## Rule Anchor Table

| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §10 Verbatim-Edit Handoff / Role-C | "Claude Code emits a Role-C Verbatim-Edit Handoff (exact before/after text) for Codex to execute; it does not silently edit governed documents." |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4C Pass 4 | "Verbatim documentation edits to the Theo Frontend Governor, this Standard, Theo Phase 1A Frontend Plan, §4B Visual Authority Registry" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §4 Role-C Inline Execution | "edits only the named target documents" |
| governance/THEO_PHASE_1A_FRONTEND_PLAN.md | §3 Sourcing rule (F-P1) | "New passes are added to this table by a Role-C update before their VEP is authored; a pass is never inferred." |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §4.1 VA-T6 | "the driving vision authority is the landed VO1 §2B / §10B / §12." |

These anchors authorize: the handoff format (Governor §10); Pass-4 verbatim edits to the FE Plan + Handover (Conformance §4C); Codex verbatim inline execution scoped to the named targets (Codex Review §4); the requirement that lands EDIT 1 (FE Plan §3 sourcing rule); the VA-T6 authority extended by EDIT 2 (Handover §4.1).

---

## Edit set (2 verbatim edits across 2 governed documents)

Both targets are in `vault-theo` at HEAD `be61800`. Codex executes each edit verbatim; the BEFORE anchor MUST be found exactly once or HALT. No substantive additions beyond the AFTER text.

---

### EDIT 1 — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` §3 — INSERT the B1 pass row after the Pass C row

**Locate (BEFORE) — found once (the Pass C table row):**

```
| **Pass C** | Acceptance & polish | Keyboard/focus a11y polish; assemble Pass-3 Visual Acceptance Evidence; confirm 1A "done" against §5 (VA-T3 §7). | `vault-theo` | **Done** — merged + Walter SWA-accepted 2026-06-25 (shell reskin + per-column header, hosted nav-fit, nav-controls width cap, warm 9/10 landing, left-panel accordion, auth-logo aspect) |
```

**Replace with (AFTER):**

```
| **Pass C** | Acceptance & polish | Keyboard/focus a11y polish; assemble Pass-3 Visual Acceptance Evidence; confirm 1A "done" against §5 (VA-T3 §7). | `vault-theo` | **Done** — merged + Walter SWA-accepted 2026-06-25 (shell reskin + per-column header, hosted nav-fit, nav-controls width cap, warm 9/10 landing, left-panel accordion, auth-logo aspect) |
| **Apps Phase B — B1** | Mobile chrome contract (TheoSurface) | Add two OPTIONAL props to the federated `theoApp/TheoSurface` remote so the Vault Origin mobile shell owns a single top bar and can trigger Theo new-chat: `suppressNarrowHeader?: boolean` (TheoMain suppresses its own main-view header on narrow viewports ≤767.98px so the Origin host bar is the single mobile header — VISUAL-AUTHORITY-DEVIATION, VA-T6 §4.1) and `newChatNonce?: number` (on change calls the existing in-memory `useTheoState` `newChat()`). Additive + backward-compatible (absent ⇒ current behaviour); wide-viewport surface unchanged; no gateway / tool-dispatch / app-context change. VA-T4 (§3A mount model, unchanged) + VA-T6 (§4.1 narrow hosted surface). | `vault-theo` (Vault Origin host consumes the props in the separate package B2) | Planned |
```

---

### EDIT 2 — `governance/THEO_1A_FRONTEND_HANDOVER.md` §4.1 — INSERT a host-owned-mobile-bar clause after the "Single-column reflow" bullet

**Locate (BEFORE) — found once (the Single-column reflow bullet):**

```
- **Single-column reflow.** Below a narrow-viewport breakpoint (a phone-width threshold aligned to the Origin shell breakpoint), Theo's hosted surface presents as a single full-width column: the 9/10 main view fills the viewport and Theo's nav is reached through the Origin shell's off-canvas drawer (Origin owns the drawer; Theo's nav is portaled into it). Theo's own `.vo-aside` hide rule applies only to the standalone dev harness, never to the hosted nav.
```

**Replace with (AFTER):**

```
- **Single-column reflow.** Below a narrow-viewport breakpoint (a phone-width threshold aligned to the Origin shell breakpoint), Theo's hosted surface presents as a single full-width column: the 9/10 main view fills the viewport and Theo's nav is reached through the Origin shell's off-canvas drawer (Origin owns the drawer; Theo's nav is portaled into it). Theo's own `.vo-aside` hide rule applies only to the standalone dev harness, never to the hosted nav.
- **Host-owned mobile top bar (single header).** On narrow viewports the Vault Origin shell provides the single top bar (menu + Vault brand + one-tap new-chat); to avoid a stacked double header, Theo's own main-view header is suppressed on narrow viewports (≤767.98px) when the host sets the `suppressNarrowHeader` signal on the hosted surface. This is a viewport adaptation of VA-T1, not a redesign: the wide-viewport header is unchanged; the driving vision authority is the landed VO1 §2B / §10B / §12 and the installable-app / Claude-app mobile direction of VO1 §2C.
```

---

## Note

Records the two B1 pre-lands only: the FE Plan §3 pass row (F-P1 sourcing) and the VA-T6 §4.1 host-owned-mobile-bar clause (authorizing the header-suppression the B1 VEP classified VISUAL-AUTHORITY-DEVIATION). No §4B registry row is added — VA-T4 and VA-T6 are already registered and CURRENT; EDIT 2 extends VA-T6's source clause (Handover §4.1), which the registry row already points at. No Phase Plan scope beyond the B1 microstep. No implementation, no app-source change. After these land, the B1 VEP's PRE-LAND gaps G1/G2 are resolved and B1 Pass 3 may proceed on Codex approval.

Scope attestation: this edit is enumerated here, limited to the authoritative Theo frontend governance document set (Theo Phase 1A Frontend Plan; Theo 1A Frontend Handover / VA-T6), introduces no scope beyond the Walter-approved Apps-Phase-B mobile direction, and alters no approved VEP, implementation evidence, or microstep sequence.

## Codex activation note (Walter forwards)
*"Codex is activated to execute the VO-Apps-B1 Role-C handoff. Open with a governance-bound GCR + Rule Anchor Table (Theo Frontend Conformance §3–§5). Apply the two verbatim edits to `vault-theo` at HEAD be61800 — EDIT 1 inserts the Apps-Phase-B B1 pass row after the Pass C row in `THEO_PHASE_1A_FRONTEND_PLAN.md` §3; EDIT 2 inserts the host-owned-mobile-bar clause after the Single-column-reflow bullet in `THEO_1A_FRONTEND_HANDOVER.md` §4.1. Each BEFORE anchor must be found exactly once; HALT on mismatch. Two documents, two additive edits, no substantive additions."*

*End of Role-C Verbatim-Edit Handoff.*
