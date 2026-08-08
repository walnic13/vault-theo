# Theo FE — Governance Loop Author Side (Phase 1c) — Pass 1 FE VEP (CODE-BEARING)

> Reviewer: **Codex** (frontend). **Code-bearing** — 6 vault-theo files. Phase 1c (final) of the Vault Governance Loop (Codex-APPROVED contract, vault-origin `3dcd976`): Theo's AUTHOR side. In app-aware review mode, a "⚖ Hand to Dottie" header affordance enumerates the review's exceptions (a NEW `sigma_get_review` client on func-sigma, as the signed-in user) to assemble a `GovernanceNote` (§GL3), and hands it to Dottie via `onRequestAgentHandoff({ target_agent:'dottie' })` (App Host §6D(4), the FE-B forward seam). When Dottie returns a `GovernanceVerdictSet` (the P1a return leg → Theo's `app_context.governance_claim`), Theo ingests it (nonce-guarded, app-aware-isolated) and shows a cleared/changes chip. Closes the Theo→Dottie→Theo loop. Advisory. Reuses shipped foundations; the only new backend touch is the read-only `sigma_get_review`.

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack (code-bearing; Governance Loop author side)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Grounding parent (source baseline): vault-theo development f102fffe998991358072bdfc99bfb37246fac735 (+ authority: vault-origin loop contract 3dcd976, Codex-APPROVED)
```
The reviewed artifact is the CHILD commit adding this package + the 6 source edits; its commit SHA + this VEP's own blob are reviewer-stamped (self-contained `.md`). The 6 changed files' proposed blobs are concrete (below).

| # | Document / file (absolute path) | Read this turn | Currency (blob) |
| - | ------------------------------- | -------------- | --------------- |
| 1 | AUTHORITY — Vault Governance Loop Contract §GL3/§GL5/§GL7 (Codex-APPROVED) — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-origin/Codex Governance/VO-AH-Vault-Governance-Loop-Contract-Pass-1/VO_AH_Vault_Governance_Loop_Contract_Pass_1.md` | `Read` this turn | `3dcd976284a825e4079ec6344225e7f459cd2264` |
| 2 | DEPLOYED `sigma_get_review` (the enumerated-exceptions source; returns `{ review, checks[] }`) — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/sigma/Codex Governance/Sigma-Backend-SummaryFigures-Pass-1-VEP/handlers/sigma_get_review/index.js` | grounded (deployed; read prior turn) | `7486300f8fa48af25c98a63291eb5d981a1f652d` |
| 3 | Reporting FE Governor — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/corporate-reporting/frontend/governance/CLAUDE_CODE_REPORTING_FRONTEND_GOVERNOR_STANDARD.md` | grounded; unchanged | `74303aa34c7ed1e7a82099612f07edfc253f50fe` |
| 4 | Codex FE Review — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/corporate-reporting/frontend/governance/CODEX_REPORTING_FRONTEND_REVIEW_STANDARD.md` | grounded; unchanged | `8732c728fc54b53af2d388ea9e733a798c91de9a` |

### Code currency (base @ grounding parent `f102fff` → proposed @ review HEAD)
| Source file (absolute path) | Base blob | Proposed blob |
| --------------------------- | --------- | ------------- |
| `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/services/gateway.live.ts` | `e7ac3c0d3087e921e62a088f05a9c6891da1e621` | `89f7be849e13f738302bde227511507999b6677e` |
| `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/services/theoClient.ts` | `b5d961d515f292407eff2af1b32a8b08ab191520` | `170303d00fb4508049451feadfadeebd4f84f941` |
| `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/useTheoState.ts` | `f696fceec662626ba2336487ae420c341350f081` | `a3225bf3de4cb7d790bd65db734d0524aea60b93` |
| `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/TheoSurface.tsx` | `516b1f102364aa63a48b12ae9dfb556aac4009a3` | `4260220debe35502952927a189c3c16ca29f3baf` |
| `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/components/TheoMain.tsx` | `e10d39c7c9ffe16d0ebfa804d10685fd175ada2f` | `1fdf2fb642e0f92fc901f6f2274cf19617b84ff2` |
| `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/.github/workflows/azure-static-web-apps-development.yml` | `5dbd2022b65b8124002a7c31aa8b86bb34e4bcfc` | `11eeff24daf395cee86ab84831a73e78a4f8e321` |

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text (read this turn) | Applied in output at |
| -------------------------- | --------- | ------------------------------------- | -------------------- |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-origin/Codex Governance/VO-AH-Vault-Governance-Loop-Contract-Pass-1/VO_AH_Vault_Governance_Loop_Contract_Pass_1.md | §GL3 | "Theo assembles this at a gate and hands it to Dottie" | `useTheoState.buildDottieNote()` assembles the note; the TheoMain button hands it off |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-origin/Codex Governance/VO-AH-Vault-Governance-Loop-Contract-Pass-1/VO_AH_Vault_Governance_Loop_Contract_Pass_1.md | §GL3 | "No `app_key` inside the claim" | `buildDottieNote` returns `{ kind, target, gates, theo_note, items }` — no `app_key` (the shell stamps it) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-origin/Codex Governance/VO-AH-Vault-Governance-Loop-Contract-Pass-1/VO_AH_Vault_Governance_Loop_Contract_Pass_1.md | §GL5 | "target_agent: 'dottie'" | the "Hand to Dottie" button calls `onRequestAgentHandoff({ target_agent: 'dottie', claim: note })` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-origin/Codex Governance/VO-AH-Vault-Governance-Loop-Contract-Pass-1/VO_AH_Vault_Governance_Loop_Contract_Pass_1.md | §GL4 | "the shell stamps `app_key`; Theo reads the app from `app_context.app_key`" | the verdict-set ingest reads the shell-threaded `governance_claim`; no app identity in the claim |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/sigma/Codex Governance/Sigma-Backend-SummaryFigures-Pass-1-VEP/handlers/sigma_get_review/index.js | checks-select | "control_id, control_group, ctype, severity, status, computed, delta, cell_refs" | `getReview` returns the checks; `buildDottieNote` filters `status==='exception'` → items by `control_id` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/corporate-reporting/frontend/governance/CLAUDE_CODE_REPORTING_FRONTEND_GOVERNOR_STANDARD.md | §1.1A | "Mandatory repo-visible package" | §PERSISTENCE — committed + pushed this turn |

## §1 — Feature / sourcing
Phase 1c (final) of the Governance Loop: Theo's author side for the Sigma exception-clearance gate. Reuses the FE-B forward seam (`onRequestAgentHandoff`) + the P1a return leg + the Loop contract shapes. The ONE new backend touch is a read-only `sigma_get_review` (func-sigma, shared audience) to enumerate exceptions client-side (Theo holds only the review anchor). No mutation; advisory.

## §CCT — Component Change Table
API dependency: **`sigma_get_review`** (DEPLOYED on func-sigma, blob `7486300f`) — read-only GET, as the signed-in user (shared EasyAuth audience). NEW base `VITE_SIGMA_FUNCTIONS_URL` (defaults to the func-sigma host; injectable via `configureGateway`).

| File | Change | Signature / shape | Classification |
|---|---|---|---|
| `gateway.live.ts` | add `sigmaBase` (`VITE_SIGMA_FUNCTIONS_URL`, default func-sigma host) + `configureGateway({ sigmaBaseUrl })`; new `getReview` GET client (mirrors `getConversation`) | `getReview(reviewId, opts?): Promise<{ checks: Array<Record<string,unknown>>; fund_name? }>` | ADDITIVE (new base + read-only client) |
| `theoClient.ts` | import `getReview as gatewayGetReview` + façade passthrough | `getReview(reviewId, opts?) { return gatewayGetReview(reviewId, opts); }` | ADDITIVE |
| `useTheoState.ts` | `buildDottieNote()` (fetch `getReview` → filter `status==='exception'` → assemble the note; null if none); verdict-set ingest (nonce-guarded, app-aware) → `governanceVerdict` summary; `newChat()` clears it; expose `buildDottieNote`/`governanceVerdict` | note `{ kind:'governance_note', target:{review_id}, gates:['sigma.exception_clearance'], theo_note, items:[{gate, ref:{control_id}}] }` (no `app_key`) | ALLOWED DELTA (new action + derived state + ingest; no existing behaviour changed) |
| `TheoSurface.tsx` | add optional `onRequestAgentHandoff` prop; pass to `TheoMain` at BOTH render sites | `onRequestAgentHandoff?: (handoff: { target_agent: string; claim: Record<string, unknown> }) => void;` | ADDITIVE (optional) |
| `TheoMain.tsx` | add optional `onRequestAgentHandoff` prop; "⚖ Hand to Dottie" button (gated `onRequestAgentHandoff && t.reviewMode && t.agentMode==='app-aware'`) → `buildDottieNote` → handoff; a `governanceVerdict` cleared/changes chip | button `onClick` builds the note then hands off `{ target_agent:'dottie', claim: note }` | ADDITIVE (optional) |
| `azure-static-web-apps-development.yml` | add `VITE_SIGMA_FUNCTIONS_URL=https://vaultgpt-func-sigma.azurewebsites.net` to the dev build env | (dev workflow only — the dev-SWA's own branch-owned workflow) | ADDITIVE (dev build env) |

**No existing behaviour changes.** All source edits are additive/optional: general mode blanks `effectiveAppContext` (no note assembly, no ingest); a surface without `onRequestAgentHandoff` (standalone) hides the button; the `getReview` base defaults safely; `newChat` clears the verdict summary (§6D(3) isolation, mirrors P1b).

## §GAP — Gap Register
**PROCEED.**
- **G-1 — New func-sigma read touch.** `getReview` is the only new backend call — read-only, as-user, on the DEPLOYED `sigma_get_review` (shared audience; func-sigma CORS `*`). No mutation, no new backend. Disclosed.
- **G-2 — New env var (dev now; prod at promotion).** `VITE_SIGMA_FUNCTIONS_URL` is added to the DEV workflow here (the dev-SWA's own branch-owned workflow). The MAIN workflow needs it too — applied on `main` at promotion (two-SWA pattern; workflows are branch-owned), alongside the vault-dottie `VITE_FUNCTIONS_URL` fix. Tracked for promotion. Disclosed.
- **G-3 — Advisory + §6D(3) isolation.** `buildDottieNote`/`governanceVerdict` + the affordances exist only in app-aware mode; `newChat()` (which `setAgentMode` funnels through) clears the verdict summary; nothing authoritative is mutated. `tsc` clean. PROCEED.
- **G-4 — Verify on dev-SWA (Pass-3).** The full Theo→Dottie→Theo loop is exercised once all of Phase 1 (this + P1a + P1b) co-lands; Walter verifies on the dev-SWA before the coordinated promotion. PROCEED.

## §PERSISTENCE — Governor §1.1A
Committed + pushed to `development` this turn: the 6 files + this VEP under `Codex Governance/Theo-Governance-Loop-Author-Pass-1-VEP/`. No unrelated files; no Class B `.xlsx`.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Governance-Loop-Author-Pass-1-VEP/Theo_Governance_Loop_Author_Pass_1.md" --repo-root .` — expect PASS.

## §CODEX — activation (Walter forwards)

```
Codex is activated for Pass-2 FRONTEND review of the Theo Governance Loop Author Side (Phase 1c, code-bearing),
"vault-theo/Codex Governance/Theo-Governance-Loop-Author-Pass-1-VEP/Theo_Governance_Loop_Author_Pass_1.md"
committed at vault-theo development <HEAD> + corporate-reporting f928152. Open Pass-2 with a governance-bound GCR +
Rule Anchor Table; hard-gate; emit only APPROVED or REJECTED. CODE-BEARING (6 files; base @ f102fff → proposed blobs).
Final piece of the Codex-APPROVED Governance Loop contract (3dcd976): Theo's author side for the Sigma
exception-clearance gate. In app-aware review mode, "⚖ Hand to Dottie" runs buildDottieNote (NEW read-only
sigma_get_review on func-sigma, as-user → filter status==='exception' → assemble the GovernanceNote, NO app_key —
shell stamps it) and hands it to Dottie via onRequestAgentHandoff (target_agent:'dottie', FE-B seam). Dottie's
returned GovernanceVerdictSet (P1a return leg → app_context.governance_claim) is ingested nonce-guarded + app-aware,
shown as a cleared/changes chip. Review: (1) claim carries no app_key (§6D(4)); (2) as-user read-only getReview
(new VITE_SIGMA_FUNCTIONS_URL base, default func-sigma host; dev workflow updated, prod at promotion); (3) §6D(3)
isolation — general mode blanks the context (no note/ingest); newChat() (setAgentMode funnels through it) clears the
verdict summary; standalone hides the button; (4) advisory — nothing mutated in Sigma; (5) additive/optional; tsc
clean. VEP blob reviewer-stamped; the 6 source blobs concrete. Emit APPROVED or REJECTED only.
```

*End of Theo Governance Loop Author Side (Phase 1c) Pass-1 FE VEP.*
