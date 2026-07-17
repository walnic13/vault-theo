# Theo Frontend — VA-T8 Voice Controls: Role-C Verbatim-Edit Handoff (Pass 4)

Registers the Walter-approved **voice-controls reference surface** as **VA-T8** in the §4B Visual Authority Registry of `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md`, so the forthcoming voice FE VEP can cite it (else T21). **One verbatim edit, one target doc.** The reference `.jsx` is committed (`artifacts/theo-voice-controls-reference.jsx`, sha256 `d97a5896…`); this handoff only appends the registry row. **Codex executes verbatim; Claude Code authors only.** Walter approved the look this turn.

## Grounding Conformance Receipt

Role: Claude Code (Role-C authoring)
Turn Type: Pass 4 — Documentation-update package (Role-C Verbatim-Edit Handoff)
Turn issued against HEAD: `c739613185e135e3ff8b87d9a51dddc224a10d0d` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Targeted grounding is authorized for a Pass-4 documentation-update package by Frontend Conformance §4 (Claude Code | Pass 4 — Documentation-update package → Targeted Current-Turn Grounding). (Frontend sub-phase spine is F-P/F-I/F-E; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4B Visual Authority Registry — edit target + append rules; §4C Pass 4; §3 GCR) | `Read(governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md)` this turn | `ce3522897845f2ffa4bccb9aa00d434f4be2c5ce` |
| 2 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§10 Verbatim-Edit Handoff / Role-C) | `Grep(pattern="Verbatim-Edit\|Role-C", path=governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md)` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 3 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§4 Role-C Inline Execution) | `Grep(pattern="verbatim\|Role-C", path=governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md)` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | VA-T8 reference artifact — `artifacts/theo-voice-controls-reference.jsx` (the surface being registered; committed `c739613`; sha256 `d97a5896fcbff653e8cb1a68aa1bc6ec7dbc8b7d593321eba93874c1f9ddb64f`) | `Read(artifacts/theo-voice-controls-reference.jsx)` (authored this turn) | `ab12ab072b494137d6c6c33f9096584a1d1f9d34` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §10 | "Claude Code emits a Role-C Verbatim-Edit Handoff (exact before/after text) for Codex to execute" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §4 | "Codex is the Pass 2 frontend plan reviewer and the Pass 4 Role-C inline executor." |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "New rows added at the bottom with a monotonically increasing `VA-Tn` identifier." |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A new row is a governance change: Walter approval + a Pass 4 landing required." |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4C | "Role-C documentation-update pass" |

> Walter approval (this turn, verbatim): the proposed voice-controls mockup was presented and Walter replied **"looks great"** / **"looks great"** — the §4B "Walter approval" precondition for a new VA row.

---

## EDIT 1 (only edit) — append the VA-T8 row to `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4B

Target: the §4B Visual Authority Registry table. Insert **one new row** immediately after the existing `VA-T7` row (the last row, before the blank line preceding "Append rules:").

### BEFORE (verbatim; found EXACTLY ONCE — the tail of the VA-T7 row)

```
CURRENT — landed via Role-C 2026-07-14 (Walter-approved); sha256 verified `aa4d1032051cbd88c647c10d68b2b0daf3831fd5abd3db52c9021e6af23ab367` |
```

### AFTER (the same VA-T7 tail, then the new VA-T8 row on the next line)

```
CURRENT — landed via Role-C 2026-07-14 (Walter-approved); sha256 verified `aa4d1032051cbd88c647c10d68b2b0daf3831fd5abd3db52c9021e6af23ab367` |
| VA-T8 | Theo Voice Controls | `artifacts/theo-voice-controls-reference.jsx` | The voice controls added to the Theo chat surface: (1) a **dictation** mic button in the composer action row (idle mic → RECORDING tray with an animated waveform + tabular-nums timer + Cancel + "Listening… up to 7:00" + a coral-tinted STOP; on stop the transcript drops into the composer draft for review — nothing is sent automatically; client caps at 7:00), wiring MediaRecorder → `theo_transcribe_audio`; (2) a **read-aloud** control in an actions row under each assistant reply (idle muted "Read aloud" speaker text-button → PLAYING coralDk with a tiny equalizer + "Playing…"; tap to stop; one premium default voice for v1 — the backend accepts an optional `voice`, so a picker is a later FE-only add), wiring `theo_synthesize_speech`. Everything else on the surface is unchanged (VA-T1). Backends DEPLOYED (API Spec §2.11). Zero-dependency inline-style (the VA-T1/VA-T5/VA-T7 idiom); no Tailwind, no browser storage. Reproduce faithfully, do not redesign. | CURRENT — landed via Role-C 2026-07-17 (Walter-approved); sha256 verified `d97a5896fcbff653e8cb1a68aa1bc6ec7dbc8b7d593321eba93874c1f9ddb64f` |
```

---

## Notes

- Documentation-only Role-C landing. The reference `.jsx` is already committed (`c739613`); this handoff only appends the §4B row so the voice FE VEP can cite VA-T8 (Frontend Conformance §6 T21 requires the VA-id be registered before citation).
- sha256 in the row matches the committed artifact (`d97a5896fcbff653e8cb1a68aa1bc6ec7dbc8b7d593321eba93874c1f9ddb64f`) — Codex may re-hash `artifacts/theo-voice-controls-reference.jsx` to verify.
- After this lands, the voice FE Pass-1 VEP identifies its Component Contract Table against VA-T8 and wires the composer mic → `theo_transcribe_audio` and the read-aloud control → `theo_synthesize_speech` (both DEPLOYED).

## Codex activation note

Open your Role-C turn with a governance-bound GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §4). Then apply EDIT 1 **verbatim**: locate the found-once BEFORE anchor (the VA-T7 row tail) in `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4B and replace it with the AFTER text (a pure insertion of the one new VA-T8 row after the preserved VA-T7 row). Edit only that file; make no substantive additions of your own. Optionally re-hash `artifacts/theo-voice-controls-reference.jsx` and confirm it equals the row's sha256. **HALT** and report if the BEFORE anchor is not found exactly once, or if any Rule Anchor quote is not a literal substring at HEAD. Verdict is APPROVED or REJECTED only.
