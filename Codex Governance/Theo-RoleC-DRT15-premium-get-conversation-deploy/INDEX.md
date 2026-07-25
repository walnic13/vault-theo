# Role-C Verbatim-Edit Handoff — DR-T15: narrow premium deploy exception for `theo_get_conversation` (Chat Media Persistence)

Pass-4 Role-C governance amendment recording **Walter's premium-deploy grant (2026-07-25)** for the Chat Media Persistence fix. Fetched images/videos are streamed + rendered live but never persisted, so a reloaded chat loses them (only `content` + `citations` survive). The fix persists a new `theo_messages.media` column and returns it on reload; the reload-read lives in **`theo_get_conversation`** on the shared monolith **`vaultgpt-func-premium`**. DR-T14 (2026-07-24) narrowly opened premium deploy for the two Projects-domain knowledge handlers only; **`theo_get_conversation` is a chat handler outside that set**, so this DR-T15 narrowly extends the carve-out to it. Walter's words: "any updates you need to make to the monolith i give you permission." Everything else stays excluded: all `reporting_*` + other Theo premium handlers remain Walter-deploy-only; the `media` column migration is Walter-executed (DB migrations remain Walter-only); no branch merges; no app-setting/resource change on premium. Cross-cutting: every LIVE statement carrying the DR-T14 premium carve-out gets the DR-T15 addition (11 edits across 4 docs); the append-only DR ledger rows (DR-T7/T11/T12/T13/T14) are left as-dated.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Documentation-update package
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Turn issued against HEAD: `@@ISSUED_HEAD@@` (vault-theo, `development`; grounding parent `32f7fc3ecb9b74c98ae8fa76f32945a20f6b795`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Grounding-mode basis: Conformance §4 "Documentation-update package" row = Targeted Current-Turn Grounding. Walter grant: "okay, any updates you need to make to the monolith i give you permission" (2026-07-25), for the Chat Media Persistence monolith update (`theo_get_conversation` reload-read). Precedent + carve-out language: DR-T14 (2026-07-24), swept identically.

### §4 Documents grounded this turn
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Execution Orchestration Standard (target — §1A/§1E/DR table/Executor) — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` | `Read`+`Grep` this turn | `7e31e35eea3a8712d8317e6bb52ea6bca4f9876b` |
| 2 | Theo Golden Handler Standard (target — §5.5 deploy split) — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` | `Grep` this turn | `61957b1bcf7f9fb0953ad8d6204d3e7bdde16f0a` |
| 3 | Claude Code Theo Backend Governor Standard (target — authorization boundary) — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` | `Grep` this turn | `d553df9d8bb0e7977a215c6ebf2b554dd3f88e43` |
| 4 | Theo Phase 1B Backend Plan (target — authority row) — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` | `Grep` this turn | `2bc6ffb02adc4b2259ff69fc9e27b1181ef0416f` |
| 5 | Theo Grounding Conformance Standard (§3/§5) — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "Absolute exclusions (narrowed by DR-T14, 2026-07-24)" | Edits 1–6 — the exclusion narrowed further + DR-T15 added |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1A | "sole authority who may grant governance exemptions" | records Walter's explicit, scoped, dated grant |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "EXCEPTION (DR-T14, 2026-07-24)" | Edits 7–9 — premium deploy split gets the DR-T15 addition |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Authorization boundary | "EXCEPT the narrow DR-T14 carve-out (2026-07-24)" | Edit 10 — carve-out addition |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1B_BACKEND_PLAN.md | Authority row | "EXCEPT the narrow DR-T14 carve-out (2026-07-24)" | Edit 11 — carve-out addition |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "exact before/after text for each edit" | every edit below is an exact before/after block |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |

## Verbatim edits

### Edit 1 — Orchestration: add the DR-T15 Decision Register row (after the DR-T14 row)
BEFORE (exact substring):
```
the carve-out contains the shared-monolith blast radius to the two named handlers. | this standard §1E; Golden Handler §5.5; Phase D D2 |
```
AFTER:
```
the carve-out contains the shared-monolith blast radius to the two named handlers. | this standard §1E; Golden Handler §5.5; Phase D D2 |
| DR-T15 | **Premium media-persistence deploy authority** (Walter-directed 2026-07-25): extends the DR-T14 premium deploy carve-out to the shared monolith **`vaultgpt-func-premium`** chat-read handler **`theo_get_conversation`** — Claude Code MAY deploy its `index.js` (+ `function.json` only if changed) via **surgical Kudu VFS overwrite** (premium is classic per-fn, Golden Handler §5.5) after a Codex-APPROVED VEP, then runs the golden curls. Rationale: the Chat Media Persistence fix returns the new `theo_messages.media` column on reload so fetched images/videos re-render; the reload-read lives in `theo_get_conversation`. **Strictly excluded, unchanged:** every other premium handler (all `reporting_*` + Theo handlers beyond the DR-T14/DR-T15 named set) stays Walter-deploy-only; **no** database writes/migrations (the `media` column migration is Walter-executed), **no** branch merges, **no** app-setting/resource change on premium. | this standard §1E; Golden Handler §5.5; Chat Media Persistence |
```

### Edit 2 — Orchestration §1E: add the DR-T15 in-scope bullet (after the DR-T14 in-scope bullet)
BEFORE (exact substring):
```
every OTHER premium handler (all `reporting_*` and non-Projects Theo handlers), and ALL app-setting/resource changes on premium, remain out of scope; DB writes/migrations/merges remain Walter-only.
```
AFTER:
```
every OTHER premium handler (all `reporting_*` and non-Projects Theo handlers), and ALL app-setting/resource changes on premium, remain out of scope; DB writes/migrations/merges remain Walter-only.
- **In scope (premium media-persistence read — DR-T15, Walter-granted 2026-07-25):** narrowly, for the shared monolith **`vaultgpt-func-premium`**, Claude Code MAY additionally deploy — via **surgical Kudu VFS overwrite** of the handler's `index.js` (+ `function.json` only if changed) — the chat-read handler **`theo_get_conversation`** (to return the new `theo_messages.media` column for reload re-render), after a Codex-APPROVED VEP, then runs the golden curls. Same strict bounds as DR-T14: every OTHER premium handler + ALL app-setting/resource changes remain out of scope; DB writes/migrations/merges remain Walter-only (the `media` column migration is Walter-executed).
```

### Edit 3 — Orchestration §1E: narrow the Absolute-exclusions clause further
BEFORE (exact substring):
```
- **Absolute exclusions (narrowed by DR-T14, 2026-07-24):** the monolith **`vaultgpt-func-premium`** is **READ-ONLY EXCEPT** for the Projects-domain knowledge handlers named in the DR-T14 in-scope bullet above (`theo_add_project_knowledge`, `theo_remove_project_knowledge`, + future project-knowledge handlers named in an APPROVED VEP), which Claude Code MAY deploy via surgical Kudu VFS overwrite after a Codex-APPROVED VEP.
```
AFTER:
```
- **Absolute exclusions (narrowed by DR-T14 2026-07-24 + DR-T15 2026-07-25):** the monolith **`vaultgpt-func-premium`** is **READ-ONLY EXCEPT** for the handlers named in the DR-T14 and DR-T15 in-scope bullets above (DR-T14: `theo_add_project_knowledge`, `theo_remove_project_knowledge`, + future project-knowledge handlers named in an APPROVED VEP; DR-T15: `theo_get_conversation` — media-persistence reload-read), which Claude Code MAY deploy via surgical Kudu VFS overwrite after a Codex-APPROVED VEP.
```

### Edit 4 — Orchestration §1A: extend the Claude-Code role carve-out
BEFORE (exact substring):
```
EXCEPT the narrow DR-T14 carve-out (2026-07-24) — the Projects-domain knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge`, which Claude Code MAY deploy to premium via surgical Kudu VFS after a Codex-APPROVED VEP.
```
AFTER:
```
EXCEPT the narrow DR-T14 (2026-07-24) + DR-T15 (2026-07-25) carve-outs — the Projects-domain knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge` (DR-T14) and the chat-read handler `theo_get_conversation` (DR-T15, media-persistence read), which Claude Code MAY deploy to premium via surgical Kudu VFS after a Codex-APPROVED VEP.
```

### Edit 5 — Orchestration Executor table: premium deploy row carve-out
BEFORE (exact substring):
```
| Deployment — gateway, SWA, monolith Function App (`vaultgpt-func-premium`) — EXCEPT the DR-T14 Projects-knowledge handler carve-out | **Walter** (premium; Claude Code only for the DR-T14 `theo_add_project_knowledge`/`theo_remove_project_knowledge` handlers, after an APPROVED VEP) |
```
AFTER:
```
| Deployment — gateway, SWA, monolith Function App (`vaultgpt-func-premium`) — EXCEPT the DR-T14 / DR-T15 handler carve-outs | **Walter** (premium; Claude Code only for the DR-T14 `theo_add_project_knowledge`/`theo_remove_project_knowledge` + DR-T15 `theo_get_conversation` handlers, after an APPROVED VEP) |
```

### Edit 6 — Orchestration §1E run-from-package bullet: exclusions note
BEFORE (exact substring):
```
The exclusions below are unchanged: `vaultgpt-func-premium` remains READ-ONLY (save the narrow DR-T14 carve-out); database writes/migrations remain Walter-only; branch merges remain Walter-only.
```
AFTER:
```
The exclusions below are unchanged: `vaultgpt-func-premium` remains READ-ONLY (save the narrow DR-T14 / DR-T15 carve-outs); database writes/migrations remain Walter-only; branch merges remain Walter-only.
```

### Edit 7 — Golden Handler §5.5 deploy split
BEFORE (exact substring):
```
**EXCEPTION (DR-T14, 2026-07-24):** for the Projects-domain knowledge handlers `theo_add_project_knowledge` and `theo_remove_project_knowledge` (+ future project-knowledge handlers named in an APPROVED VEP) ONLY, Claude Code MAY deploy directly via **surgical Kudu VFS overwrite** of the handler's `/site/wwwroot/<fn>/index.js` (same per-fn mechanism as func-chat) after a Codex-APPROVED VEP; every other premium handler stays Walter-self-deploy.
```
AFTER:
```
**EXCEPTION (DR-T14, 2026-07-24; DR-T15, 2026-07-25):** for the Projects-domain knowledge handlers `theo_add_project_knowledge` and `theo_remove_project_knowledge` (+ future project-knowledge handlers named in an APPROVED VEP) — DR-T14 — and the chat-read handler `theo_get_conversation` (media-persistence reload-read) — DR-T15 — ONLY, Claude Code MAY deploy directly via **surgical Kudu VFS overwrite** of the handler's `/site/wwwroot/<fn>/index.js` (same per-fn mechanism as func-chat) after a Codex-APPROVED VEP; every other premium handler stays Walter-self-deploy.
```

### Edit 8 — Golden Handler §5.5 curl-split statement
BEFORE (exact substring):
```
The split is: Walter deploys the premium handler manually (EXCEPT the DR-T14 Projects-knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge`, which Claude Code deploys directly via surgical Kudu VFS after a Codex-APPROVED VEP) → **Claude Code runs the golden curls**
```
AFTER:
```
The split is: Walter deploys the premium handler manually (EXCEPT the DR-T14 Projects-knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge` + the DR-T15 handler `theo_get_conversation`, which Claude Code deploys directly via surgical Kudu VFS after a Codex-APPROVED VEP) → **Claude Code runs the golden curls**
```

### Edit 9 — Golden Handler §5.5 run-from-package preconditions
BEFORE (exact substring):
```
Preconditions unchanged (Codex-APPROVED VEP; Walter-only DB/migrations/merges; `vaultgpt-func-premium` READ-ONLY except the narrow DR-T14 Projects-knowledge-handler carve-out, 2026-07-24);
```
AFTER:
```
Preconditions unchanged (Codex-APPROVED VEP; Walter-only DB/migrations/merges; `vaultgpt-func-premium` READ-ONLY except the narrow DR-T14 Projects-knowledge-handler carve-out 2026-07-24 + the DR-T15 `theo_get_conversation` carve-out 2026-07-25);
```

### Edit 10 — Governor: authorization-boundary carve-out
BEFORE (exact substring):
```
EXCEPT the narrow DR-T14 carve-out (2026-07-24) under which Claude Code MAY deploy the Projects-domain knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge` to premium via surgical Kudu VFS after a Codex-APPROVED VEP.
```
AFTER:
```
EXCEPT the narrow DR-T14 carve-out (2026-07-24) under which Claude Code MAY deploy the Projects-domain knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge`, and the narrow DR-T15 carve-out (2026-07-25) under which Claude Code MAY deploy the chat-read handler `theo_get_conversation` (media-persistence read), to premium via surgical Kudu VFS after a Codex-APPROVED VEP.
```

### Edit 11 — Phase 1B Plan: authority-row carve-out
BEFORE (exact substring):
```
EXCEPT the narrow DR-T14 carve-out (2026-07-24) for the Projects-domain knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge` (Claude Code MAY deploy these to premium via surgical Kudu VFS after a Codex-APPROVED VEP).
```
AFTER:
```
EXCEPT the narrow DR-T14 carve-out (2026-07-24) for the Projects-domain knowledge handlers `theo_add_project_knowledge`/`theo_remove_project_knowledge` and the narrow DR-T15 carve-out (2026-07-25) for the chat-read handler `theo_get_conversation` (media-persistence read) — Claude Code MAY deploy these to premium via surgical Kudu VFS after a Codex-APPROVED VEP.
```

## Boundary / no-drift
- Four governed docs edited (Orchestration ×6, Golden Handler ×3, Governor ×1, Plan ×1 = 11 edits). Every LIVE statement carrying the DR-T14 premium carve-out now also carries the DR-T15 addition; the append-only DR ledger rows (DR-T7/T11/T12/T13/T14) are left as-dated.
- The exception is **narrow**: adds ONLY `theo_get_conversation` (the media-persistence reload-read), only surgical Kudu VFS, only after Codex APPROVAL. All `reporting_*`, all other premium handlers, all DB/migrations/merges (incl. the `media` column migration — Walter-executed), and all premium app-setting/resource changes remain excluded / Walter-only.
- No code/schema change in this Role-C.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-RoleC-DRT15-premium-get-conversation-deploy/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-4 Role-C review (APPROVED / REJECTED only). On APPROVED, Claude Code applies Edits 1–11 byte-faithfully and commits. DR-T15 is the precondition for the Chat Media Persistence `theo_get_conversation` premium deploy (Part 3).
