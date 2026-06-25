# Role-C Verbatim-Edit Handoff — Theo-in-Origin Mount Model

> Pass 4 documentation-update package (Conformance §4C Pass 4). Author = Claude Code (Role-C). Inline executor = Codex. Authority for the change = Walter (architecture intent given 2026-06-25, confirmed via clarification: Theo hosted in the Origin shell — landing surface in the 9/10, permanent nav section in the 1/10 between Vault Files and Vault Origin Apps, app-sidebar stacking, VS Code-style right-hand Theo panel in-app, in-shell Module Federation). These edits make that intent groundable authority so Pass B can be re-authored against it.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn-type: Pass 4 — Documentation-update package (Role-C authoring)
Turn issued against HEAD: `308a05a05d656a25b363d934d5c47680e542e764` (vault-theo, `development`)
Grounding mode: Targeted Current-Turn Grounding

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§10 Role-C) | `Read(governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md)` | blob `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 Pass-4 row; §4C; §4B) | `Read(governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md)` | blob `67fcf110f9aa080953cf16722ea2e4ff9b8b93f8` |
| 3 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§4 Role-C execution) | `Read(governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md)` | blob `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | **TARGET** Theo Architecture & Structure (VA-T2) — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` | `Read(governance/THEO_ARCHITECTURE_AND_STRUCTURE.md)` | blob `5021e2f9b38de1d43e5b0ff12991ddfe422dcfed` |
| 5 | **TARGET** Theo 1A Frontend Handover (VA-T3) — `governance/THEO_1A_FRONTEND_HANDOVER.md` | `Read(governance/THEO_1A_FRONTEND_HANDOVER.md)` | blob `47afb958f6377f3b1b8d411341b2aeeb82e977f0` |
| 6 | **TARGET** Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | `Read(governance/THEO_PHASE_1A_FRONTEND_PLAN.md)` | blob `6037563f35c95268aa5c52f252abb948feb6da6c` |
| 7 | Cross-repo authority — `vault-origin/docs/architecture/VAULT_ORIGIN_APP_HOST_CONTRACT.md` (§1A mount strategy) | `Grep(^#{1,3} \|iframe…, VAULT_ORIGIN_APP_HOST_CONTRACT.md)` | blob `1bdc7f3505479d92862093dea6ef1cde30fb6be8` |

---

## RULE ANCHORS

| # | Source doc | Clause id | Verbatim clause text | Applied in output at |
| - | ---------- | --------- | -------------------- | -------------------- |
| 1 | Claude Code Theo Frontend Governor Standard | §10 | "On documentation drift against implemented reality, or any change to a governed document, Claude Code emits a Role-C Verbatim-Edit Handoff (exact before/after text) for Codex to execute; it does not silently edit governed documents." | This handoff's edit format |
| 2 | Theo Frontend Grounding Conformance Standard | §4C Pass 4 | "Verbatim documentation edits to the Theo Frontend Governor, this Standard, Theo Phase 1A Frontend Plan, §4B Visual Authority Registry" | Edits target the Plan + VA-T2 + VA-T3 |
| 3 | Codex Theo Frontend Review Standard | §4 | "Codex executes the directed edits **verbatim**, edits only the named target documents" | Execution instruction to Codex |
| 4 | Theo Architecture & Structure (VA-T2) | §1.2 | "Origin also hosts the Theo surface within the Origin shell." | Edit 1 grounds the new §3A in existing intent |
| 5 | Theo Phase 1A Frontend Plan | §7 | "This plan is updated after each pass completes (status column; new passes; per-surface refinements) via Role-C" | Edits 3 + 4 (Plan §3 row, §5 criterion) |
| 6 | Vault Origin App Host Contract | §1A | "In-shell module / workspace-mode mounting is the target; iframe is rejected as a default" | Mount-mechanism clauses (no iframe) in Edits 1, 2, 3 |
| 7 | Theo Frontend Grounding Conformance Standard | §4B append rule 3 | "A new row is a governance change: Walter approval + a Pass 4 landing required." | Edit 5 (VA-T4 registry row) |

---

## Edit set (5 verbatim edits across 4 governed documents)

All target documents are in `vault-theo` at HEAD `308a05a`. Codex executes each edit verbatim; no substantive additions beyond the AFTER text below.

---

### EDIT 1 — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` — INSERT new §3A before §4

**Locate this anchor (BEFORE):**

```
## 4. The Tool-Dispatch Model
```

**Replace with (AFTER):**

```
## 3A. Origin Host & Mount Model (Theo-in-Origin)

Theo is hosted **inside the Vault Origin shell** (§1.2), not as a standalone destination. The standalone `vault-theo` SWA is a development harness; the production surface is Theo mounted in Origin. This model is BINDING.

### 3A.1 Default landing surface
At the Origin root (no app open), **Theo is the landing surface**: Theo's main view occupies the Origin 9/10 content panel, replacing the prior static welcome placeholder.

### 3A.2 Theo navigation as a permanent shell section
Theo's navigation (Chats / Projects / Artifacts / Customize, search, recents) mounts as a **permanent, collapsible section in the Origin 1/10 left panel**, positioned **below the Vault Files section and above the Vault Origin Apps section**, collapsible like the other shell sections.

### 3A.3 App selection
When a product is opened from Vault Origin Apps, that app's sidebar mounts **below the Theo section** (still above Vault Origin Apps), and the app takes over the 9/10 content panel as its landing page.

### 3A.4 In-app Theo access (VS Code idiom)
While an app owns the 9/10, Theo remains reachable via an **"Open Theo" control at the top of the 9/10**; activating it opens Theo's chat as a **resizable right-hand split panel** within the 9/10 (the app on the left, Theo on the right).

### 3A.5 Mount mechanism (BINDING)
Theo mounts **in-shell via Module Federation** — never an iframe, never a separate embedded site (Vault Origin App Host Contract §1A). Theo exposes its mountable surfaces (navigation section + main/chat view) as federated module(s) the Origin shell consumes, receiving the shell `AppHostContext`. The model call still routes through the Theo gateway (§2); hosting in Origin changes neither the gateway nor the context-only app-context contract (§3).

## 4. The Tool-Dispatch Model
```

---

### EDIT 2 — `governance/THEO_1A_FRONTEND_HANDOVER.md` — REPLACE §4 in full

**Locate (BEFORE):**

```
## 4. Origin-side additive work (`vault-origin`)

- Add the **context-broadcast**: when an app opens or the active anchor changes, pass `{ app_key, app_context }` to the Theo surface (props / context / event — your call, kept additive).
- Add the **Theo surface mount point** within the Origin shell.
- Nothing else. No refactor of existing Origin behaviour.
```

**Replace with (AFTER):**

```
## 4. Origin-side additive work (`vault-origin`)

Theo is hosted **inside the Origin shell** as the default landing surface, not a standalone destination (architecture §3A). The additive `vault-origin` work is:

- **Theo navigation section (1/10):** a permanent, collapsible Theo section in the Origin left panel, **below Vault Files and above Vault Origin Apps**, holding Theo's navigation (Chats / Projects / Artifacts / Customize, search, recents).
- **Theo landing surface (9/10):** Theo's main view as the Origin root landing content (replacing the static welcome placeholder). When an app is opened, the app takes the 9/10 and its sidebar stacks below the Theo section.
- **In-app Theo panel:** an "Open Theo" control at the top of the 9/10 that opens Theo's chat as a resizable **right-hand split panel** while an app owns the 9/10 (the VS Code idiom).
- **Context-broadcast (in-process):** Origin passes `{ app_key, app_context }` to the mounted Theo surface via the shell `AppHostContext` (in-process props), never cross-origin `postMessage` (App Host Contract §1A). `app_key` reflects the active app (`NULL` = Origin-level general chat); `app_context` is the opaque anchor. Context-only — 1A does not fetch app data (§2.4).
- **Mount mechanism:** in-shell Module Federation (no iframe); the Origin shell consumes the Theo federated surface(s). No refactor of existing Origin behaviour beyond these additive mounts.
```

---

### EDIT 3 — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` — REPLACE the §3 Pass B row

**Locate (BEFORE):**

```
| **Pass B** | App-context layer | App-context chip in the chat header (`{app_key, app_context}`, carried on the conversation; presentational, no app-data fetch); **+ additive `vault-origin`** context-broadcast wiring + Theo surface mount point. VA-T3 §2.4/§4 | `vault-theo` + `vault-origin` (additive) | Planned |
```

**Replace with (AFTER):**

```
| **Pass B** | Theo-in-Origin mount + app-context | Mount Theo **inside the Origin shell** (architecture §3A; VA-T3 §4): Theo nav as a permanent collapsible 1/10 section (below Vault Files, above Vault Origin Apps); Theo main as the Origin 9/10 landing surface; app-sidebar stacking; in-app right-hand Theo panel via a 9/10 "Open Theo" toggle (VS Code idiom); in-shell **Module Federation** (no iframe, App Host Contract §1A) — decompose the Pass-A `TheoShell` into mountable nav + main surfaces and expose them as federated module(s). App-context: Origin broadcasts `{app_key, app_context}` in-process via `AppHostContext`; Theo carries it on the conversation and surfaces the anchor (presentational, no app-data fetch). VA-T3 §2.4/§4; architecture §3A | `vault-theo` + `vault-origin` (additive) | Planned |
```

---

### EDIT 4 — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` — ADD acceptance criterion #8 in §5

**Locate (BEFORE):**

```
7. SWAP BLOCK intact and centralised.

These map across the passes: Pass A delivers 1, 2, 3, 4, 6, 7; Pass B delivers 5; Pass C confirms the whole and produces Visual Acceptance Evidence.
```

**Replace with (AFTER):**

```
7. SWAP BLOCK intact and centralised.
8. Theo is **mounted in the Origin shell** per architecture §3A: nav as a permanent collapsible 1/10 section (below Vault Files, above Vault Origin Apps), main as the Origin 9/10 landing surface, an in-app right-hand Theo panel, via in-shell Module Federation (no iframe).

These map across the passes: Pass A delivers 1, 2, 3, 4, 6, 7; Pass B delivers 5 and 8; Pass C confirms the whole and produces Visual Acceptance Evidence.
```

---

### EDIT 5 — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` — ADD VA-T4 registry row in §4B

**Locate (BEFORE):**

```
| VA-T3 | Theo 1A Frontend Handover | `governance/THEO_1A_FRONTEND_HANDOVER.md` | Productionisation contract for the 1A surface (gateway swap, contracts-vs-mocks, app-context layer, per-surface real-in-1A vs true-in-1B, guardrails, acceptance criteria) | CURRENT — landed byte-preserving |

Append rules:
```

**Replace with (AFTER):**

```
| VA-T3 | Theo 1A Frontend Handover | `governance/THEO_1A_FRONTEND_HANDOVER.md` | Productionisation contract for the 1A surface (gateway swap, contracts-vs-mocks, app-context layer, per-surface real-in-1A vs true-in-1B, guardrails, acceptance criteria) | CURRENT — landed byte-preserving |
| VA-T4 | Theo-in-Origin Mount Layout | `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §3A + `governance/THEO_1A_FRONTEND_HANDOVER.md` §4 | The hosted mount layout: Theo as the Origin 9/10 landing surface; permanent collapsible Theo nav section in the 1/10 (below Vault Files, above Vault Origin Apps); app-sidebar stacking; in-app right-hand Theo panel ("Open Theo" 9/10 toggle); in-shell Module Federation (no iframe) | CURRENT — landed via Role-C |

Append rules:
```

---

## Companion dependency (NOT executed here — flagged for Walter)

The **Origin shell** changes (a permanent Theo 1/10 section; the 9/10 Theo landing host; the app-sidebar stacking; the VS Code-style right panel; consuming the Theo federated remote; an additive `AppHostContext` app-context accessor) touch **`vault-origin`**, governed by `vault-origin/docs/architecture/VAULT_ORIGIN_APP_HOST_CONTRACT.md`. That contract presently frames mounting around the single-app `/app/:appId` viewport (§3/§6) and does not yet describe a **persistent assistant-panel mount** (Theo as a non-routed, always-present section + right panel). Recommendation: a **companion App Host Contract update in `vault-origin`'s own regime** to (a) admit a persistent assistant mount alongside the workspace-app mount, and (b) register the additive `AppHostContext` app-context accessor — landed before/with Pass B Increment B-ii. This Theo-pipeline handoff does not edit the `vault-origin` contract.

## §4B Visual Authority Registry note

**VA-T4 is included as EDIT 5** (recommended) so Pass B's UI Authority Reconciliation can cite a registered VA-id for the hosted layout. This Role-C is the Pass 4 landing that Conformance §4B append rule 3 requires for a new row; doing it here avoids a separate governance cycle. If Walter prefers to omit VA-T4, drop EDIT 5 and Pass B grounds against §3A + VA-T3 §4 prose instead.

---

*End of Role-C Verbatim-Edit Handoff.*
