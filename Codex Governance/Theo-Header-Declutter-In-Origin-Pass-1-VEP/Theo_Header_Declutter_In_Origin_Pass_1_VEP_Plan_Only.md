# Theo Header Declutter (In-Origin mount) — Pass 1 Verified Evidence Pack (Plan Only)

Walter-directed (2026-07-22). When Theo is mounted inside Vault Origin's 9/10 (`mode="panel"`), its chat header shows a static "Claude Sonnet 4.6 ▾" model label and a right-aligned "Theo in Origin" label. Both are clutter in the hosted context and add no function. This VEP **suppresses those two elements in panel mode only** (`mode !== "panel"` gate on the two lines); the standalone dev-harness surface (`mode="full"`) is byte-unchanged. One file, `src/theo/components/TheoMain.tsx`; no new prop (the `mode` discriminator already exists); no backend.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack (Claude Code internal VEP pass; §4C)
Pass: Pass 1
Turn issued against HEAD: 58058e9d3f686093f17070fdee114343067f1ea7
Grounding Mode: Targeted Current-Turn Grounding
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | THEO FRONTEND GROUNDING CONFORMANCE STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | Read (§3 GCR; §4B VA registry; §5 Rule Anchor; §8 currency) this turn | blob `c614d51c49a0870bb7a4903e63f96ce2dbef314d` (structural, §8 fallback; obtained by git rev-parse this turn) |
| 2 | THEO GOLDEN COMPONENT PACK STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | Read (§3 CCT canonical format; §5 Allowed Deltas / VISUAL-AUTHORITY-DEVIATION) this turn | blob `0035a1d9fed103d07bf420b957c3727ec47fcc6b` (structural, §8 fallback) |
| 3 | CLAUDE CODE THEO FRONTEND GOVERNOR STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | Read (§2 Planning Gate; §3 VEP Format + CCT) this turn | blob `b9c0e11d6e52aace2f97caec845a70e66372b713` (structural, §8 fallback) |
| 4 | VA-T1 — Theo Frontend Reference Surface — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/frontend/theo-frontend-reference.jsx | Read (offset≈333, the chats-view header: model label + `{ASSISTANT_NAME} in {PRODUCT_NAME}`) this turn | first-20: "import React, { useState, useRef, useEffect } from "react"; /* ──────────────────────────────────────────────────────────────────────── VAULT ORIGIN — Claude-for-Teams shell (bridge build) Chats (live)" · last-20: "style={{ padding: "22px 24px", fontSize: 14.5, color: C.ink }}><Formatted text={curVer().content} /></div> )} </div> </aside> )} </div> </main> </div> ); }" |
| 5 | VA-T4 — Theo-in-Origin Mount Layout — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | Read (§3A hosted mount: in-app right-hand Theo panel) this turn | blob `07451ce9d912830b3c15fedf74761d00c59f97b2` (structural, §8 fallback) |
| 6 | ACTIVE — TheoMain.tsx — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/components/TheoMain.tsx | Read (full 1–65: `mode` prop L27/L34; chats header L50–57; model label L52; `{ASSISTANT_NAME} in {PRODUCT_NAME}` L57) this turn | first-20: "// TheoMain — Pass B extract of the TheoShell 9/10 main region (VA-T1 main; VA-T2 §3A.1/§3A.4). // The view-switched header" · last-20: ""artifacts") && ( <ArtifactPanel artifact={t.art} openVersion={t.openArt ? t.openArt.v : -1} onSelectVersion={t.selectVersion} onCopy={t.copyArt} copied={t.copied} onClose={t.closeArt} /> )} </div> </div> ); }" |

## Rule Anchor Table

| Source doc | Clause id | Verbatim clause text | Applied in output at |
| ---------- | --------- | -------------------- | -------------------- |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 Allowed Deltas | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" | §3 CCT — the panel-mode suppression is classified VISUAL-AUTHORITY-DEVIATION (from VA-T1) with the VA-T4 anchor |
| frontend/theo-frontend-reference.jsx | chats-view header (L335/L339) | "{ASSISTANT_NAME} in {PRODUCT_NAME}" | §1/§3 — the exact right-aligned label being suppressed in panel mode originates in the VA-T1 reference header |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §3A (VA-T4) | "resizable right-hand split panel" | §2/§3 — panel mode = the hosted in-Origin context; VA-T4 authorizes the hosted-surface chrome adaptation (basis parallel to VA-T6's mobile header suppression) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 rule 2 | "Verbatim Clause Text MUST be a direct substring as read this turn" | This Rule Anchor Table — every quote is a literal this-turn substring |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope" | §3 CCT — one row (TheoMain, ACTIVE) |

## §1 Feature Identification (F-P1)
- **Feature:** in `TheoMain.tsx`, gate two chats-view header elements on `mode !== "panel"` so they render only in the standalone surface (`mode="full"`) and are **suppressed when Theo is hosted in Origin** (`mode="panel"`):
  - **L52** — the static model label `{MODEL_LABEL}` ("Claude Sonnet 4.6") + its `▾` glyph (a display `<span>`, not an interactive picker).
  - **L57** — the right-aligned `<div>{ASSISTANT_NAME} in {PRODUCT_NAME}</div>` ("Theo in Origin").
- **Kept in panel mode:** the style badge (L53), the app-context chip (L54), and the project chip (L55) — those carry live context and are useful in the hosted "in-app Theo" surface.
- **Boundary:** one file (`src/theo/components/TheoMain.tsx`); the `mode` prop already exists (L27/L34) so **no prop threading** through `TheoSurface`. No change to `mode="full"` rendering, to any other view (`projects`/`artifacts`/`customize`/`project`), to `suppressNarrowHeader`, to the swap block, or to any backend/contract.

## §2 UI Authority Reconciliation (F-P2)
- **VA-T1 (reference surface).** The chats header — model label (reference L335) + `{ASSISTANT_NAME} in {PRODUCT_NAME}` (reference L339) — is defined by VA-T1 and reproduced verbatim in `TheoMain`. Removing two of its elements in panel mode is a **VISUAL-AUTHORITY-DEVIATION from VA-T1**, scoped to `mode="panel"`. In `mode="full"` the surface remains an EXACT reproduction of VA-T1 (unchanged).
- **VA-T4 (Theo-in-Origin mount) authorizes it.** VA-T4 governs the hosted mount — the "resizable right-hand split panel" / 9/10-landing context (`mode="panel"`). Chrome that is redundant in the host (the shell already conveys product identity; the model is not user-selectable here) is adapted for the hosted surface, exactly as VA-T6 authorizes suppressing the whole header on narrow. This VEP is a hosted-context adaptation under VA-T4, not a redesign of the VA-T1 surface.
- **No conflict** with VA-T2/VA-T3 (architecture/handover) — the `mode` discriminator and the panel/full split are their existing contract. No new authority is invented.

## §2.5 Gap Disclosure (F-P2.5)
**PROCEED.**
1. The change is a **VISUAL-AUTHORITY-DEVIATION** (VA-T1) confined to `mode="panel"`, anchored to VA-T4 (Rule Anchor #1/#3). `mode="full"` is EXACT. **PROCEED.**
2. `mode` is already an in-scope prop (L27/L34); no prop threading, no `TheoSurface` change. **PROCEED.**
3. No backend / contract / RLS surface is touched (pure presentational gate). **PROCEED.**

## §3 Component Contract Table (F-P5)

| Component (proposed/active) | Prop / input interface | Visual authority citation | Data / contract dependency | Impl eligibility |
|-----------------------------|------------------------|---------------------------|----------------------------|------------------|
| `TheoMain` — Theo surface; **ACTIVE** (`src/theo/components/TheoMain.tsx`) | `interface TheoMainProps { t: ReturnType<typeof useTheoState>; mode: "full" \| "panel"; suppressNarrowHeader?: boolean; }` — **unchanged this pass** (no prop added; the change gates existing header lines on the existing `mode`) | VA-T1 chats-view header (reference L335 model label + L339 `{ASSISTANT_NAME} in {PRODUCT_NAME}`) — classification: **VISUAL-AUTHORITY-DEVIATION** in `mode="panel"` (L52 + L57 suppressed), **EXACT** in `mode="full"`; authorized by **VA-T4** §3A ("resizable right-hand split panel") per Rule Anchors #1/#3 | none — presentational; no service-module/gateway call, no contract/endpoint (the header reads only in-memory `t`/swap-block constants) | **PROCEED** |

## §4 Implementation Plan (Pass 3 — NOT BLOCKED)
1. `src/theo/components/TheoMain.tsx`: wrap **L52** (the `{MODEL_LABEL}` span) and **L57** (`<div …>{ASSISTANT_NAME} in {PRODUCT_NAME}</div>`) in a `{mode !== "panel" && ( … )}` guard so they render only when `mode === "full"`. Leave L53/L54/L55 (style/app/project chips) and the non-chats header branch unchanged.
2. Verify: `npm run build` (vite; run `tsc` first per the vault-theo build note) GREEN; the standalone (`mode="full"`) header is byte-unchanged; the hosted (`mode="panel"`) header no longer shows the model label or "Theo in Origin". Emit the F-I2 Structural Mirror (L52/L57 = VISUAL-AUTHORITY-DEVIATION panel-only; all else EXACT) + F-I4 visual-parity checklist at Pass 3.
3. Deploy on `development` (salmon-river serves dev+prod Theo); Walter validates in the Origin-hosted Theo surface; land.

## §5 Structural Mirror / Visual-Parity note (Pass-3 preview)
- Structural Mirror (F-I2): L52 + L57 → **VISUAL-AUTHORITY-DEVIATION** (panel-mode suppression, anchored VA-T4); every other region of `TheoMain` → **EXACT** vs VA-T1. No inline-style→Tailwind conversion (AD-visual respected; no §5 DEVIATION).
- Visual-Parity (F-I4): `mode="full"` matches VA-T1 exactly; `mode="panel"` matches VA-T1 minus the two authorized-suppressed elements, chips + palette (`C`) + type stacks unchanged.

## §6 Out of scope
`mode="full"` rendering; `suppressNarrowHeader` / narrow mobile chrome (VA-T6); the swap block (`MODEL_LABEL`/`ASSISTANT_NAME`/`PRODUCT_NAME` values); non-chats header views; any other component; any backend / contract / RLS; the Origin shell (vault-origin) side.

## Requested action
Codex Pass-2 review (Conformance §3–§6; Golden Component Pack §3/§5; VA-T1 + VA-T4). On APPROVED, Claude Code implements per §4 on `development`, Walter validates the Origin-hosted Theo surface, then lands.
