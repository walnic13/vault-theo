# Theo Restore-Splash Contain — Pass 1 Frontend VEP (parity with Dottie; fix the full-screen cold-open flash in a compact mount)

> Parity with the Dottie restore-splash fix. `ChatView`'s cold-open `RestoringSplash` rendered `position:fixed; inset:0; zIndex:2147483000` portaled to `document.body` — a full-VIEWPORT cover. When a fresh Theo instance mounts in a compact Origin right-panel tab, its cold-open `restoring` hold blankets the ENTIRE screen (over the 9/10 + other panels) until restore resolves → a whole-app flash on launch. Fix: render the splash **contained** — `position:absolute; inset:0` within `ChatView`'s already-`relative` root — so it covers only this instance's chat area (still hides the greeting flash) and never the whole viewport. FE-only; one function; no backend/schema/route.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack (cold-open restore-hold containment; parity with Dottie)
Grounding parent (source baseline): `e6b7c6b09d36242e7e8a35c76967791a6544d3f3` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

Currency labelling: CODE-BEARING package — at the review HEAD the changed file's blob IS the proposed blob; the base is cited at the PARENT commit `e6b7c6b` and the proposed is the review-HEAD blob (anchored to the blob SHA).

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (unchanged: @ HEAD; changed: base @ parent → proposed @ review HEAD) |
| - | ------------------------------- | ------------------------------ | -------------------------------------------- |
| 1 | VISUAL/ARCH AUTHORITY — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (Pass B — Theo mounted in Origin as federated module(s) into shell slots) | `Grep`(Pass B) this turn | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 2 | FE Grounding Conformance — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR + Rule Anchor) | grounded; unchanged @ HEAD | `4f2f42e799be5db31e1e35e523d656ff4c1c057e` |
| 3 | FE Governor — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (reproduce faithfully / no redesign) | grounded; unchanged @ HEAD | `3afec7ea4b13650ce2bf28bf32073179a35e7b24` |
| 4 | Codex FE Review — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (Pass-2; APPROVED/REJECTED only) | grounded; unchanged @ HEAD | `25cc488091d619d8f6642b10552df0d019a87933` |
| 5 | CHANGED — `c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/components/ChatView.tsx` (`RestoringSplash` contained; the now-unused `createPortal` import removed) | `Read`(§416–432, §587) + `Edit` this turn | base @ parent `e6b7c6b` `7bf970f1947183dc43dafaef5c3de57fe94eff2e` → proposed @ review HEAD `455545137bcca2b5950bf9b8f5031fbd2c754e73` |

No ChatGPT advisory cited. No backend / route / schema / migration.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text (read this turn) | Applied in output at |
| -------------------------- | --------- | ------------------------------------- | -------------------- |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1A_FRONTEND_PLAN.md | Pass B | "expose them as federated module(s)" | §1 — Theo renders into shell-owned slots; a cold-open hold must contain to its slot, not blanket the shell |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1A_FRONTEND_PLAN.md | Pass B | "nav as a permanent collapsible 1/10 section" | §1 — Theo is a hosted surface within the shell's owned columns; its overlay must respect those boundaries |

---

## §1 — Feature
`ChatView`'s `RestoringSplash` is the quiet neutral cold-open hold (shown while `useTheoState`'s restore decision resolves, so no greeting flashes before a restore lands). It rendered `position:fixed; inset:0; zIndex:2147483000` portaled to `document.body` — full-viewport. Every mount shares this: a fresh Theo instance in a **compact Origin right-panel tab** blanketed the WHOLE screen during its cold-open until restore resolved (Theo is "expose[d] … as federated module(s)" into the shell's owned slots — Phase 1A Pass B — so it must not overpaint the shell). Fix: the splash renders **contained** — `position:absolute; inset:0; zIndex:40` (no portal) within `ChatView`'s root, which is **already `position:relative`**. It now covers only this instance's chat area (the greeting is still hidden) in every mount (panel tab → the panel; 9/10 → the 9/10; standalone → the main). Byte-parity with the Dottie fix (vault-dottie).

## §2 — Architecture & boundary
One ACTIVE file, `ChatView.tsx`: `RestoringSplash` switches from `createPortal(<div position:fixed inset:0 zIndex:2147483000>, document.body)` to an inline `<div position:absolute inset:0 zIndex:40>`; the now-unused `createPortal` import is removed; the `typeof document` guard is dropped (no `document` access remains). Mark, background (`C.bg`), and the `{restoring && <RestoringSplash />}` gate unchanged. No new file/component/prop/route/backend/schema/dependency. **Not a redesign** — the same hold, contained to the surface.

## §3 — Verification (this turn, local)
`tsc --noEmit -p tsconfig.app.json` → **exit 0**. `npm run build` → **clean** (TheoSurface federated chunk emits). This turn. Behaviour: a Theo instance in a compact right-panel tab cold-opens without flashing the whole screen.

## §CCT — Component Contract Table
| Component (file) | Prop / input interface (TS) | Visual authority (VA-id) | Data / contract dependency |
| --- | --- | --- | --- |
| `ChatView` (`ChatView.tsx`) | `ChatViewProps` unchanged (incl. `restoring?: boolean`); internal `RestoringSplash` swaps `position:fixed`+`document.body` portal → `position:absolute` inline within the existing `position:relative` root | THEO_PHASE_1A_FRONTEND_PLAN Pass B (hosted federated surface in shell slots) | none (presentational cold-open hold) |

## §GAP — Gap Disclosure
**PROCEED.**
- **G-1 — Greeting still hidden.** The greeting is inside `ChatView`'s root, still fully covered by the contained splash. Disclosed.
- **G-2 — All mounts contained.** The 9/10 + standalone cold-open now contain to their surface (previously whole-viewport); equal-or-better. Disclosed.
- **G-3 — Deploy + eyeball.** Lands on `development` → salmon-river/ashy-plant, verified mounted in Origin. PROCEED.

## §DELTA — changed files (before → after evidence)
One file (GCR row 5). `ChatView.tsx` (`7bf970f1`→`45554513`): `RestoringSplash` `position:fixed`+`document.body` portal → contained `position:absolute inset:0 zIndex:40`; removed the now-unused `createPortal` import + the `typeof document` guard. No other bytes changed.

## §CODEX — activation (Walter forwards)

```
Codex is activated for Pass-2 FRONTEND review of the Theo Restore-Splash Contain, vault-theo,
"Codex Governance/Theo-Restore-Splash-Contain-Pass-1-VEP/Theo_Restore_Splash_Contain_VEP.md" @ commit <HEAD>. Open Pass-2 with a
governance-bound GCR + Rule Anchor Table; hard-gate; emit only APPROVED or REJECTED. FE-only, no backend/schema/route. Parity
with the Dottie restore-splash fix. ChatView's cold-open RestoringSplash rendered position:fixed inset:0 zIndex:2147483000
portaled to document.body — full-viewport; a fresh Theo instance in a compact Origin right-panel tab blanketed the ENTIRE screen
during its cold-open restore hold (Theo is "expose[d] as federated module(s)" into shell slots — Phase 1A Pass B — so it must not
overpaint the shell). Fix: render it CONTAINED — position:absolute inset:0 zIndex:40 (no portal) within ChatView's
already-relative root — so it covers only this instance's chat area (still hides the greeting) and never the whole viewport.
Removed the now-unused createPortal import + the typeof-document guard. One ACTIVE file; ChatViewProps unchanged; not a redesign;
byte-parity with vault-dottie. tsc exit 0 + vite build clean. Mechanical lint PASS. Emit APPROVED or REJECTED only.
```

*End of Theo Restore-Splash Contain Pass-1 Frontend VEP.*
