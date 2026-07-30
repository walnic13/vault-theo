# Role-C Verbatim-Edit Handoff — register VA-T12 (SPW surfaces) in the Theo Frontend §4B Visual Authority Registry

> Pass 4 documentation-update (Theo FRONTEND regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Walter approved the Shared Project Workspace frontend look 2026-07-30 (the three surfaces: attributed multi-party thread, publish control, "Shared in this project" list). The canonical reference `artifacts/theo-spw-surfaces-reference.jsx` is committed (blob `188061f9c043acf222f6f610903869438b30b8ba`; sha256 `03c2970c9e0f13b7fdc6d8868578a94c3db561a5d0a3fdd054bcb06f21d52c59`). This Role-C appends **one new row (VA-T12)** to the §4B Visual Authority Registry of `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` so the Phase-2c FE VEPs (2c-ii / 2c-iii / 2c-iv) may cite it (§4B: a VA-id not registered is an invalid citation). Append-only; no existing row altered (§4B append rules 1–3 satisfied: bottom-append, next monotonic id VA-T12 — VA-T10/T11 already used, Walter-approved + this Pass-4 landing).

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Pass 4 — Documentation-update package (Role-C authoring)
Grounding parent (source baseline): `1ab308b596ecf03d0cfdbfe1ced9ba0272b99e78` (vault-theo, `development`) — this Role-C package is carried at a later reviewed commit named only in the forward note; all currency anchors below are tip-independent blob SHAs
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA) |
| - | ------------------------------- | ------------------------------ | -------------------------- |
| 1 | **TARGET** Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4B Visual Authority Registry — append-only) | `grep -oF`(VA-T11 row tail, count=1) + `sed -n '160,166p'` this turn | `1e6213e404dbd16f70798f701ae1df36cbc9af25` |
| 2 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§2 review; Role-C inline execution) | carried grounding (this program; blob-anchored) | `25cc488091d619d8f6642b10552df0d019a87933` |
| 3 | **VA-T12 canonical reference (committed)** — `artifacts/theo-spw-surfaces-reference.jsx` | authored + committed this session (`1ab308b`); sha256 computed this turn | `188061f9c043acf222f6f610903869438b30b8ba` (sha256 `03c2970c9e0f13b7fdc6d8868578a94c3db561a5d0a3fdd054bcb06f21d52c59`) |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A VA-id not registered in §4B is invalid as a citation." |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "New rows added at the bottom with a monotonically increasing" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A new row is a governance change: Walter approval" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

## Rationale
§4B is the append-only Visual Authority Registry; a Pass-1 FE VEP may only cite a VA-id registered here. The SPW frontend look is Walter-approved (2026-07-30) and its canonical reference `.jsx` is committed + sha256-pinned, so the registry gains one VA-T12 row (next free id — VA-T10 = the mobile Add-to-chat sheet, VA-T11 = the Vault identity mark). This unblocks the 2c-ii/2c-iii/2c-iv FE VEPs, each of which will cite VA-T12 for its rendered surface. Pure append after the VA-T11 row; no existing byte changes.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once (verified `grep -oF` = 1) or HALT. One file, one additive row append. Target file: `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (the end of the VA-T11 row — the last row of §4B).

### EDIT 1 — append the VA-T12 row after the VA-T11 row

**Locate (BEFORE) — the tail of the VA-T11 row, found exactly once:**

```
Phase-2 Origin shell `1c6f3ec` + Phase-3 login splash `b30b8c0` (vault-origin) |
```

**Replace with (AFTER) — the same tail, then the new VA-T12 row on the next line:**

```
Phase-2 Origin shell `1c6f3ec` + Phase-3 login splash `b30b8c0` (vault-origin) |
| VA-T12 | Theo Shared Project Workspace Surfaces | `artifacts/theo-spw-surfaces-reference.jsx` | The three surfaces that make a PUBLISHED project conversation usable by its participants (backends DEPLOYED + golden-curl-verified: API Spec §2.2 publish contracts; per-message `created_by` in §2.1; Schema §11 publish substrate). **(A) Attributed multi-party thread** — each turn gains a BYLINE above the message: the author's ROSTER PHOTO (`Person.photo` from `theo_list_people`, §2.9; a circular `<img>`, object-fit cover, 1px hairline ring) with tinted INITIALS as the fallback, + the author's display NAME resolved from `message.created_by` via the roster, + an "Owner · you" tag (coralSoft) when the caller authored the turn; Theo's turns keep a coral spiral avatar + "Theo" (coralDk). A slim coral-soft "Shared in this project" BANNER sits atop a published thread; under the composer a one-line note reads "You're continuing a shared thread — your reply posts as <you>". A PRIVATE (single-author) conversation SUPPRESSES the bylines (the VA-T1 surface is unchanged; attribution appears only once shared). **(B) Publish control** — a "Publish to project" item in the existing chat menu (shown ONLY on a conversation the caller OWNS that is linked to a project) that flips to "Unpublish" once shared, + a coral header state chip ("Shared in <Project>"); one-click, reversible (`theo_publish_conversation` / `theo_unpublish_conversation`). **(C) "Shared in this project" list** — a project-home section (header + count pill; each row an author mini-avatar + conversation TITLE + a muted "<author> · shared <when> · updated <when>" meta; a row opens the shared conversation), mirroring the existing "Chats in this project" section (`theo_list_project_conversations`). Everything else on the surface is unchanged (VA-T1). Zero-dependency inline-style (the VA-T1/VA-T5/VA-T7/VA-T8/VA-T9/VA-T10 idiom); no Tailwind, no browser storage. Reproduce faithfully, do not redesign. | CURRENT — landed via Role-C 2026-07-30 (Walter-approved); sha256 verified `03c2970c9e0f13b7fdc6d8868578a94c3db561a5d0a3fdd054bcb06f21d52c59` |
```

## Note
Registers VA-T12 (SPW surfaces) via one additive §4B row. No other section touched; no existing-byte change; the §4A tables + T-code gates are unchanged. This is the visual authority the Phase-2c FE VEPs (2c-ii attributed render, 2c-iii publish control, 2c-iv shared list) cite.

Scope attestation: this edit is enumerated here, limited to `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4B, appends only the VA-T12 row for the committed + sha256-pinned reference `artifacts/theo-spw-surfaces-reference.jsx`, and alters no other content, VEP, or reference.

## Codex activation note (Walter forwards)

```
Codex is activated to execute the SPW VA-T12 Registration Role-C handoff (vault-theo, "Codex Governance/Theo-Frontend-SPW-VA-T12-Registration-RoleC/Theo_Frontend_SPW_VA_T12_Registration_RoleC.md"). Open with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo Frontend Conformance §3/§5). Apply EDIT 1 to governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md §4B verbatim — the BEFORE anchor is the tail of the VA-T11 row ("Phase-2 Origin shell `1c6f3ec` + Phase-3 login splash `b30b8c0` (vault-origin) |"), which MUST be found exactly once; append the new VA-T12 row on the next line per the AFTER text; HALT on any mismatch. Confirm the cited reference artifacts/theo-spw-surfaces-reference.jsx is present at HEAD and its sha256 = 03c2970c9e0f13b7fdc6d8868578a94c3db561a5d0a3fdd054bcb06f21d52c59. One file, one additive row — no line-ending normalization, no other edits. Emit APPROVED or REJECTED only.
```
