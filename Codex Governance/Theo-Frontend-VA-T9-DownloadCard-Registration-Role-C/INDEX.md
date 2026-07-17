# Role-C Verbatim-Edit Handoff — register VA-T9 (Theo Download Card) in the Visual Authority Registry (§4B)

Registers the **Walter-approved** (2026-07-17, "Approve as-is") download-card design as **VA-T9** in the Frontend Conformance §4B Visual Authority Registry, and lands its reference artifact `artifacts/theo-download-card-reference.jsx`. This is the prerequisite for the Tool-Loop FE VEP: citing an unregistered VA-id is automatically invalid, so VA-T9 must be CURRENT at HEAD before the VEP's Component Contract Table can reference it. **Verbatim edit + a new reference artifact — no shipped component code.**

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 4 — Role-C Verbatim-Edit Handoff (VA registration)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

(Frontend regime; the lint's P/I/E enumeration is the backend track, hence `N/A` — a documentation-registration Role-C.)

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "citing a VA-id path not registered here is automatically invalid" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "CURRENT — landed via Role-C 2026-07-17 (Walter-approved); sha256 verified" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "MUST contain a **Component Contract Table**" |

### Currency anchors (blob SHAs @ HEAD)
- THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md `fa95a9703a66884b186ed08755c788476133d992`; CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md `b9c0e11d6e52aace2f97caec845a70e66372b713`.
- New artifact `artifacts/theo-download-card-reference.jsx` sha256 `73e3de62f8c3ccd386fccc60234d57dfb60fd8a1f73e4d890bb8c1cb4d2e88e1` (committed in this package).

## Provenance
Walter approved the rendered card (AskUserQuestion, 2026-07-17): coral-tint spreadsheet-glyph tile + filename + "Excel spreadsheet · <size>" subtitle (expiry text dropped per Walter's "hide expiry, re-mint on click" — `expiresAt` still rides in the payload for the later re-mint enhancement) + filled-coral Download button. Zero-dependency inline-style (VA-T1/T5/T7/T8 idiom).

## Edit — Frontend Conformance §4B, append the VA-T9 row (immediately AFTER the VA-T8 row)
BEFORE (end of the VA-T8 row):
`CURRENT — landed via Role-C 2026-07-17 (Walter-approved); sha256 verified \`d97a5896fcbff653e8cb1a68aa1bc6ec7dbc8b7d593321eba93874c1f9ddb64f\` |`
AFTER:
`CURRENT — landed via Role-C 2026-07-17 (Walter-approved); sha256 verified \`d97a5896fcbff653e8cb1a68aa1bc6ec7dbc8b7d593321eba93874c1f9ddb64f\` |
| VA-T9 | Theo Download Card | \`artifacts/theo-download-card-reference.jsx\` | The in-chat affordance for a tool-produced downloadable file (first producer: the general-chat tool-loop's \`theo_export_spreadsheet\` → \`event: vault_export\`; API Spec §2.10/§2.12, DR-T11). Renders INSIDE the assistant turn directly after the reply body (parallel to the artifact card): a coral-tint rounded tile with a spreadsheet grid glyph (coral stroke), the filename (600 weight, single-line ellipsis), a muted subtitle \`Excel spreadsheet · <human size>\` (NO expiry text — the SAS link is short-lived + re-minted on demand later; \`expiresAt\` rides in the payload), and a filled-coral **Download** button that is a real \`<a href={downloadUrl} download target="_blank" rel="noopener noreferrer">\`. Everything else on the surface is unchanged (VA-T1). Zero-dependency inline-style (the VA-T1/VA-T5/VA-T7/VA-T8 idiom); no Tailwind, no browser storage. Reproduce faithfully, do not redesign. | CURRENT — landed via Role-C 2026-07-17 (Walter-approved); sha256 verified \`73e3de62f8c3ccd386fccc60234d57dfb60fd8a1f73e4d890bb8c1cb4d2e88e1\` |`

## No other changes
Only the §4B registry gains a row; the artifact is added under `artifacts/`. No component code ships (the FE VEP + Pass-3 implementation follow).

## Requested action
Codex: verify the before/after is byte-faithful at HEAD, the artifact exists at the cited path, and its sha256 matches; APPROVE. On APPROVED, Claude Code commits the verified edit + artifact, then authors the Tool-Loop FE VEP citing VA-T9.
