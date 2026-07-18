# Role-C Verbatim-Edit Handoff — VA-T7 update: AgentActivity gains general-chat consumer + token count + blend verb

Evolves the **Walter-approved** (2026-07-18, rendered preview) VA-T7 agent-activity design: the same `AgentActivity` component now also serves the **general-chat tool-loop** (`theo_message_stream`, DR-T11), with a live **token count** in the header and a **blend running-verb** (playful while thinking → context-aware once a tool fires), plus a **reasoning line** for general-chat turns. Updates the reference artifact `artifacts/theo-agent-activity-reference.jsx` (now demonstrates both consumers, states A–D) and its §4B registry entry (description + sha256). Prerequisite for the paired FE VEP that renders it. **Verbatim §4B edits + the updated reference artifact — no shipped component code.**

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 4 — Role-C Verbatim-Edit Handoff (VA update)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

(Frontend regime; the lint's P/I/E enumeration is the backend track, hence `N/A` — a documentation VA-update Role-C.)

## Rule Anchor Table

| file | section | quote |
| ---- | ------- | ----- |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "MUST contain a **Component Contract Table**" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "citing a VA-id path not registered here is automatically invalid" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "`done`→collapse" |
| artifacts/theo-agent-activity-reference.jsx | ref | "the general-chat tool-loop (`theo_message_stream`, DR-T11)" |

### Currency anchors (blob SHAs @ HEAD)
- THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md `4cecc7dc1319700e6c382180c1bd8ea3131db51c`; CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md `b9c0e11d6e52aace2f97caec845a70e66372b713`.
- Updated artifact `artifacts/theo-agent-activity-reference.jsx` sha256 `dccb662e56c9b6e3a6827f80669c81e54e566b6c5dc851812cb6b1dc1c246d90` (committed in this package; was `aa4d1032…`).

## Provenance
Walter approved the rendered activity-panel preview (AskUserQuestion, 2026-07-18): the VA-T7 panel + reasoning line + live token count + tool chips + collapse-to-summary, with **blend verbs** (playful while thinking → context-aware once a tool fires). The reference artifact now reproduces that, showing both the Sigma review agent (states A/B) and a general-chat export turn (states C/D). No redesign of the existing Sigma states.

## Edit 1 — Frontend Conformance §4B, VA-T7 row description (add the general-chat consumer + token count + blend verb)
BEFORE:
`\`done\`→collapse. Zero-dependency inline-style (the VA-T1/VA-T5 idiom); no Tailwind, no browser storage. Reproduce faithfully, do not redesign.`
AFTER:
`\`done\`→collapse. **Also consumed by the general-chat tool-loop** (\`theo_message_stream\`, DR-T11; first tool \`theo_export_spreadsheet\` → the VA-T9 download card): the same events, PLUS a live **token count** in the header (\`message_delta.usage.output_tokens\`, tabular-nums) and a **blend running-verb** (playful while only thinking → context-aware once a tool fires); the panel label generalises beyond the review context. Zero-dependency inline-style (the VA-T1/VA-T5 idiom); no Tailwind, no browser storage. Reproduce faithfully, do not redesign.`

## Edit 2 — Frontend Conformance §4B, VA-T7 row sha256 (reference artifact updated)
BEFORE:
`sha256 verified \`aa4d1032051cbd88c647c10d68b2b0daf3831fd5abd3db52c9021e6af23ab367\``
AFTER:
`sha256 verified \`dccb662e56c9b6e3a6827f80669c81e54e566b6c5dc851812cb6b1dc1c246d90\` (updated 2026-07-18: + general-chat consumer, token count, blend verb, reasoning line — Walter-approved)`

## No other changes
Only the VA-T7 §4B row (description + sha) changes; the reference artifact is updated in place. The Sigma states are unchanged in shape. No component code ships (the FE VEP + Pass-3 implementation follow).

## Requested action
Codex: verify each before/after is byte-faithful at HEAD, the reference artifact exists at the cited path, and its sha256 matches; APPROVE. On APPROVED, Claude Code commits the verified edit + updated artifact, then authors the tool-activity FE VEP citing VA-T7.
