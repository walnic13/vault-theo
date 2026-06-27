# Codex Governance Package — Theo 1B FE Markdown Links + Cited-Path Markdown — Pass 1 VEP

- **Main artifact:** `Theo_1B_FE_Markdown_Links_VEP.md` — full Pass-1 Frontend VEP (plan only).
- **Pipeline:** Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2).
- **HEAD:** vault-theo `ce557810995e92134e62d4fb379659912ee690b7` (`development`).
- **Microstep:** render markdown `[label](url)` as hyperlinks (the shared `inline()`, ported from VA-T1, has no link support) and route `CitedText` run text through the markdown renderer (it currently renders plain text). Fixes raw links/bold in grounded answers. Walter directive: "shouldn't those be hyperlinks?"
- **Scope:** `lib/markdown.tsx` `inline()` (+link branch) + `CitedText.tsx` (run text via `inline()`/`Formatted`). No backend/contract change.
- **Classification:** additive VISUAL-AUTHORITY-DEVIATION (VA-T1 renderer has no links; VA-T5 renders runs plain), Walter-authorized (§WA). Chip structure/behaviour unchanged.
- **Lint:** PASS (exit 0).
- **Requested verdict:** Codex APPROVED or REJECTED.
