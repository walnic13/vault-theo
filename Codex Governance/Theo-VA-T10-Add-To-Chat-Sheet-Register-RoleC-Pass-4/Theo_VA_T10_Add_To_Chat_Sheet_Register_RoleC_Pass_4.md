# Theo — Register VA-T10 (mobile "Add to chat" attachment sheet) — Role-C (Pass-4)

A Visual Authority Registry addition (§4B append). Walter directed (2026-07-20, with a Claude-app screenshot) that Theo's mobile attachment affordance match Claude: today the composer paperclip triggers a bare `<input type="file">`, so a phone hands off to the **raw native OS file chooser** (Camera / Camcorder / Files) — undesigned and off-brand. The target is a designed in-app **"Add to chat"** bottom sheet. Per §4B rule 3 a new VA row "is a governance change: Walter approval + a Pass 4 landing required", so this Role-C registers the new authority (**VA-T10**) + its reference artifact **before** the implementation VEP may cite it (§6 T21). This package commits the reference artifact and proposes the single append-only §4B row; the implementation is a separate Pass-1 Frontend VEP authored after this lands. Doc + reference-artifact only; no product code, no backend.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 4 — Documentation-update package (Role-C authoring)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Turn issued against HEAD: `cb41ce846d149220a2220e9f8bb3b9ff66264592` (vault-theo, `development` — the commit that first contains this package + the new reference artifact; grounding reads performed against parent `59d14566a8b6ee743a9631965682dea54a636338`). Working tree also carried 4 untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not source/governance, not used as grounding).
Currency-anchor form: git blob SHA at HEAD.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4B Visual Authority Registry + append rules; §5 Rule Anchors; §6 T21) | `Read`/`Grep` of §4B registry + append rules + T21 this turn | `dac971eeb9bd1c628d1113740cded9e2ffea09c9` |
| 2 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§5 visual-deviation rule — a new rendered surface is a visual authority) | `Read(...THEO_GOLDEN_COMPONENT_PACK_STANDARD.md)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 3 | VA-T8 reference (idiom mirror) — `artifacts/theo-voice-controls-reference.jsx` (the zero-dep inline-style reference idiom VA-T10 follows) | `Read(artifacts/theo-voice-controls-reference.jsx)` this turn | `805c4bfb…` (sha256; §4B-registered) |
| 4 | NEW VA-T10 reference artifact — `artifacts/theo-add-to-chat-sheet-reference.jsx` (the surface being registered; committed in this package) | `Write` + `sha256sum` this turn | sha256 `dd855db6d41438ca02bd293a3ab260234d2e682d605d61b9f49d581cacce95a4` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "New rows added at the bottom with a monotonically increasing" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A new row is a governance change: Walter approval + a Pass 4 landing required." |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "citing a VA-id path not registered here is automatically invalid" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." |
| artifacts/theo-add-to-chat-sheet-reference.jsx | header | "REPLACES the raw native OS file chooser" |

## §1 What + why
**Drift/need:** there is no registered visual authority for a designed mobile attachment menu; the composer paperclip currently delegates to the OS's native chooser. Walter (2026-07-20, Claude screenshot) directed a Claude-match in-app **"Add to chat"** sheet. A new rendered surface is a visual authority (Golden Component Pack §5), and it must be registered in §4B before any Component Contract Table may cite it (§6 T21).

**Reference artifact (committed in this package):** `artifacts/theo-add-to-chat-sheet-reference.jsx` — a zero-dependency, inline-style, no-Tailwind, no-storage reference in the VA-T1/VA-T5/VA-T7/VA-T8/VA-T9 idiom. It renders: a translucent backdrop (tap/✕ dismiss), a drag-handle pill, an "Add to chat" header, and a row of three cards — **Camera** (`accept="image/*" capture="environment"`), **Photos** (`accept="image/*"`), **Files** (any file) — each routing the picked File(s) into the EXISTING upload+vision pipeline (`onAddFiles` → `attachment_ids`). Mobile-only (narrow, `max-width: 767.98px`); the wide VA-T1 composer + its file dialog are unchanged. Claude's Research / Web-search / Tool-access / Add-to-project rows are Claude-specific and intentionally NOT reproduced. sha256 `dd855db6d41438ca02bd293a3ab260234d2e682d605d61b9f49d581cacce95a4`.

## §2 The edit (§4B append — OLD → NEW)
Append one row to the §4B Visual Authority Registry, immediately after the VA-T9 row (append-only, monotonic id per §4B rule 1). No existing row is changed.

NEW row to add:
> \| VA-T10 \| Theo "Add to chat" Attachment Sheet (mobile) \| `artifacts/theo-add-to-chat-sheet-reference.jsx` \| The Claude-mobile-match "Add to chat" bottom sheet that REPLACES the raw native OS file chooser (Camera / Camcorder / Files) a bare `<input type="file">` triggers on a phone. On NARROW viewports (`max-width: 767.98px` — Theo's breakpoint) the composer paperclip opens a designed sheet: a translucent backdrop (tap / ✕ to dismiss), a drag-handle pill, an "Add to chat" header, and a row of THREE cards — **Camera** (`accept="image/*" capture="environment"`), **Photos** (`accept="image/*"` gallery), **Files** (any file) — each routing the picked File(s) into the EXISTING upload+vision pipeline (`onAddFiles` → `useTheoState.addFiles` → SAS upload → `attachment_ids`). WIDE viewports keep the normal file dialog (the VA-T1 composer is unchanged). Claude's Research / Web-search / Tool-access / Add-to-project rows are Claude-specific and intentionally NOT reproduced. No new backend / contract. Zero-dependency inline-style (the VA-T1/VA-T5/VA-T7/VA-T8/VA-T9 idiom); no Tailwind, no browser storage. Reproduce faithfully, do not redesign. \| CURRENT — landed via Role-C 2026-07-20 (Walter-approved); sha256 verified `dd855db6d41438ca02bd293a3ab260234d2e682d605d61b9f49d581cacce95a4` \|

## §3 Scope / sweep
- Only §4B is edited (one appended row); no other section or doc asserts a conflicting attachment-menu authority. VA-T1 (reference surface) is unchanged — the wide composer + file dialog are untouched; VA-T6 (narrow-viewport hosted surface) is unaffected (this is a composer affordance, not a layout reflow).
- The reference artifact is a NEW file (no existing artifact superseded; §4B rule 2 N/A).
- No product/source code changes in this package (the `ChatView` implementation is a separate Pass-1 VEP that will cite VA-T10 once registered).

## §4 Gap Register
**PROCEED.** Walter-directed (2026-07-20 screenshot = the §4B-rule-3 approval); append-only registry addition + a new reference artifact; the implementation is a separate governed Pass-1 VEP. **PROCEED.**

## §5 Requested action
Codex Pass-4 review of the §4B VA-T10 append + the committed reference artifact, against Frontend Conformance §3–§5 and Golden Component Pack §5. On APPROVED, Claude Code lands the verbatim §4B row in `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md`, then authors the Pass-1 implementation VEP (ChatView "Add to chat" sheet) citing the now-registered VA-T10.

## Mechanical lint
Run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission> --repo-root .`), verbatim:

```
PASS  Codex Governance/Theo-VA-T10-Add-To-Chat-Sheet-Register-RoleC-Pass-4/Theo_VA_T10_Add_To_Chat_Sheet_Register_RoleC_Pass_4.md
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note
Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5). This is a Pass-4 §4B append (governance change per §4B rule 3; Walter-approved via the 2026-07-20 screenshot). Confirm: append-only + monotonic id (VA-T10 follows VA-T9); the reference artifact is present at the cited HEAD (T25) and matches the cited sha256; it follows the zero-dep inline-style / no-Tailwind / no-storage idiom (Golden Component Pack); no existing row altered. Verdict APPROVED or REJECTED only. On APPROVED, Claude Code lands the row and proceeds to the implementation VEP.
