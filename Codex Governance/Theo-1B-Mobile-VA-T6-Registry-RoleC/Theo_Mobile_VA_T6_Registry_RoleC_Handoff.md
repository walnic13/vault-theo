# Role-C Verbatim-Edit Handoff — Theo Narrow-Viewport (Mobile) Hosted Behavior + VA-T6 Registration

> Pass 4 documentation-update package (Theo FE regime; Theo Frontend Governor §10 Verbatim-Edit Handoff / Role-C). Author = Claude Code (Role-C). Executor = **Codex**. Authority = Walter (2026-07-08 — "make Theo mobile friendly", phone-first). Registers the Theo-side authority for the mobile / narrow-viewport hosted surface so the paired Theo-surface FE VEP (Pkg 2b) can cite it. Mirrors, on the Theo side, the landed Origin shell authority **VO1 §2B / §10B / §12** (`corporate-reporting` VA-F1, landed @ `279875e`). Two additive verbatim edits.

---

## Grounding Conformance Receipt
Turn Type: Pass 4 — Documentation-update package (Role-C authoring)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Repo / HEAD: vault-theo `development` @ `23feabfe270434261bccd7673c6de1b8fc098d2d`

Blob SHAs @ HEAD (git-verifiable):
- `governance/THEO_1A_FRONTEND_HANDOVER.md` — `aad6396703b5a2b6d204986e5064504cec939895` (TARGET, EDIT 1)
- `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` — `1055b8b35043fe40a1c4cf1559585514ec30e789` (TARGET, EDIT 2)
- `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` — `0035a1d9fed103d07bf420b957c3727ec47fcc6b`
- `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` — `b9c0e11d6e52aace2f97caec845a70e66372b713`

Cross-repo driver (referenced, not edited here): `corporate-reporting` VO1 §2B/§10B/§12 (VA-F1), landed @ `279875e`, VO1 blob `baa750b0`.

## Rule Anchor Table

| file | section | quote |
| ---- | ------- | ----- |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "New rows added at the bottom with a monotonically increasing" |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §4 | "Theo is hosted **inside the Origin shell** as the default landing surface" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §10 | "Verbatim-Edit Handoff / Role-C" |

**Why this package exists:** Golden Component Pack §5 (anchor 1) requires any narrow-viewport visual change to the Theo surface to be classified a VISUAL-AUTHORITY-DEVIATION with a Rule Anchor to a registered authority; FE Conformance §4B (anchor 2) requires the authority be registered before it may be cited. The mobile vision is landed on the Origin side (VO1 §12) but is not in Theo's §4B registry. This Role-C adds the Theo-side spec (EDIT 1) and registers it as VA-T6 (EDIT 2), so Pkg 2b can cite VA-T6.

---

## Edit set (2 verbatim edits)

Codex executes verbatim; each BEFORE anchor must be found exactly once or HALT. No edits outside the handoff scope (Theo FE Governor §10). Target repo: `vault-theo`.

### EDIT 1 — `governance/THEO_1A_FRONTEND_HANDOVER.md` — append §4.1 after the §4 "Mount mechanism" bullet

**Locate (BEFORE) — found once:**

```
- **Mount mechanism:** in-shell Module Federation (no iframe); the Origin shell consumes the Theo federated surface(s). No refactor of existing Origin behaviour beyond these additive mounts.
```

**Replace with (AFTER):**

```
- **Mount mechanism:** in-shell Module Federation (no iframe); the Origin shell consumes the Theo federated surface(s). No refactor of existing Origin behaviour beyond these additive mounts.

### 4.1 Narrow-viewport (mobile) hosted behavior (Walter-approved 2026-07-08)

This refines the hosted mount for narrow (mobile / phone) viewports, consistent with the landed Origin shell authority VO1 §2B / §10B / §12 (`corporate-reporting` VA-F1). It is realised by the Vault Origin shell responsive foundation (Origin-side) plus a narrow-viewport CSS adaptation of the Theo surface. The wide-viewport surface (VA-T1) is reproduced unchanged; the narrow rules are additive.

- **Single-column reflow.** Below a narrow-viewport breakpoint (a phone-width threshold aligned to the Origin shell breakpoint), Theo's hosted surface presents as a single full-width column: the 9/10 main view fills the viewport and Theo's nav is reached through the Origin shell's off-canvas drawer (Origin owns the drawer; Theo's nav is portaled into it). Theo's own `.vo-aside` hide rule applies only to the standalone dev harness, never to the hosted nav.
- **Artifact viewer as a full-screen overlay.** The versioned artifact panel, which docks beside the chat on the desktop, presents as a full-screen overlay over the chat on narrow viewports rather than a side-by-side pane (there is no room for two panes on a phone). Closing it returns to the chat.
- **Touch-first affordances.** Hover-revealed manage affordances (recents rename/delete, card actions) are presented as always-visible / tap-reachable on touch input, since touch has no hover state.
- **Faithful wide surface.** On wide viewports the VA-T1 surface is reproduced exactly; the narrow-viewport rules do not alter the wide rendered surface. This is a viewport adaptation of VA-T1, not a redesign; the driving vision authority is the landed VO1 §2B / §10B / §12.
```

### EDIT 2 — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` — append VA-T6 to the §4B registry

**Locate (BEFORE) — found once:**

```
`56a3be463cddde10f6a02db0031b50952aa2cfa28ee33f206f284cb949f9812a` |

Append rules:
```

**Replace with (AFTER):**

```
`56a3be463cddde10f6a02db0031b50952aa2cfa28ee33f206f284cb949f9812a` |
| VA-T6 | Theo Narrow-Viewport (Mobile) Hosted Surface | `governance/THEO_1A_FRONTEND_HANDOVER.md` §4.1 | The narrow-viewport (mobile) adaptation of the hosted Theo surface: single-column reflow (nav via the Origin off-canvas drawer), artifact viewer as a full-screen overlay, touch-first (tap-reachable) manage affordances; wide-viewport VA-T1 surface unchanged. Driving authority = landed Origin VO1 §2B/§10B/§12 (VA-F1). | CURRENT — landed via Role-C |

Append rules:
```

---

## Scope attestation
These two edits are enumerated in this note, limited to the authoritative Theo frontend governance document set (THEO_1A_FRONTEND_HANDOVER.md §4.1 new; §4B registry VA-T6 new), introduce no new scope beyond the Walter-approved mobile direction, and do not alter any approved VEP, implementation evidence, or microstep sequence. VA-T6 is CURRENT on landing per §4B append rule 3 (Walter approval + Pass 4 landing).

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-Mobile-VA-T6-Registry Role-C handoff. Open with a governance-bound GCR + Rule Anchor Table (Theo FE Conformance §3–§5). Apply the two verbatim edits to vault-theo (EDIT 1 BEFORE = the §4 'Mount mechanism' bullet; EDIT 2 BEFORE = the VA-T5 sha line + 'Append rules:') — each found exactly once; HALT on mismatch. Two files, two additive edits (HANDOVER §4.1 new; §4B VA-T6 row). Mirrors the landed Origin VO1 §2B/§10B/§12."*

*End of Role-C Verbatim-Edit Handoff.*
