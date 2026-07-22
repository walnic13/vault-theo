# Theo Image Display (show images in chat via markdown image) — Frontend — Pass 1 Verified Evidence Pack (Plan Only)

Walter-directed (2026-07-23). When a user asks Theo to SHOW an image (e.g. "show me a golden retriever"), Theo fetches it with `theo_fetch_image` (which returns the image to the MODEL as a vision block so Theo can SEE it), then only DESCRIBES it — nothing is displayed. `theo_fetch_image` is vision-only and is never emitted to the FE, so the user gets a description, never a picture (repeatedly). The FE markdown renderer ALREADY renders a markdown image `![alt](https://…)` as a visible `<img>` (react-markdown v9, no `img` strip). So the fix is FE-only: (1) instruct Theo (base prompt) to DISPLAY an image by emitting a markdown image from a directly-viewable https URL (Wikimedia/Wikipedia), not fetch-and-describe; (2) add a small `img` renderer override (https-only + `max-width:100%`) so the displayed image is safe and doesn't overflow the bubble. Salmon-river FE only — no premium, no backend.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack (Claude Code internal VEP pass; §4C)
Pass: Pass 1
Grounding Mode: Full Baseline Grounding
Sub-phase Track: N/A
Turn issued against HEAD: 848b95a2dca3b35532c6f78922d0036123ab0ec4

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor |
| - | ------------------------------- | ------------------------------ | --------------- |
| 1 | CLAUDE CODE THEO FRONTEND GOVERNOR STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | Grounded (§2 Planning Gate; §3 VEP Format) this turn | blob `b9c0e11d6e52aace2f97caec845a70e66372b713` (structural, §8 fallback) |
| 2 | THEO PHASE 1A FRONTEND PLAN — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1A_FRONTEND_PLAN.md | Grounded (F-P1 feature authority) this turn | blob `901271478e8bec29177d379fadbbf3d4701a90fe` (structural, §8 fallback) |
| 3 | THEO API SPEC — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | Read (§2.1 stream — theo_fetch_image tool_result is a MODEL vision block, never FE-emitted; §2.14) this turn | blob `dc0e6e0cc9c8dce9f003bebcb951fd4af30c97f3` (structural, §8 fallback) |
| 4 | THEO FRONTEND GROUNDING CONFORMANCE STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | Grounded (§3 GCR; §4/§4A Full Baseline; §4B VA registry; §5 Rule Anchor) this turn | blob `c614d51c49a0870bb7a4903e63f96ce2dbef314d` (structural, §8 fallback) |
| 5 | CODEX THEO FRONTEND REVIEW STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | Grounded (Pass-2 reviewer behavior) this turn | blob `e2b7e0ba91486371414da688ae3697f02a11e252` (structural, §8 fallback) |
| 6 | THEO GOLDEN COMPONENT PACK STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | Read (§3 CCT; §5 Allowed Deltas / VISUAL-AUTHORITY-DEVIATION; §12 DEVIATION → §21A) this turn | blob `0035a1d9fed103d07bf420b957c3727ec47fcc6b` (structural, §8 fallback) |
| 7 | THEO EXECUTION ORCHESTRATION STANDARD — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | Grounded (role vocabulary; no Decision-Register entry) this turn | blob `be066f12147d1eb13b51f025b275f5413ab51f0e` (structural, §8 fallback) |
| 8 | VA-T2 (architecture) + VA-T4 (§3A mount) — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | Grounded (surface architecture; prompt seam) this turn | blob `07451ce9d912830b3c15fedf74761d00c59f97b2` (structural, §8 fallback) |
| 9 | VA-T3 — Theo 1A Frontend Handover — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_1A_FRONTEND_HANDOVER.md | Grounded (§0.1/§6 no Tailwind conversion — inline-style preserved; §5 swap block) this turn | blob `b8155889ebfb44a153192e63796812a94aa87004` (structural, §8 fallback) |
| 10 | VA-T1 — Theo Frontend Reference Surface — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/frontend/theo-frontend-reference.jsx | Grounded (Claude-for-Teams chat surface — inline markdown rendering idiom) this turn | first-20: "import React, { useState, useRef, useEffect } from "react"; /* ──────────────────────────────────────────────────────────────────────── VAULT ORIGIN — Claude-for-Teams shell (bridge build) Chats (live)" · last-20: "style={{ padding: "22px 24px", fontSize: 14.5, color: C.ink }}><Formatted text={curVer().content} /></div> )} </div> </aside> )} </div> </main> </div> ); }" |
| 11 | ACTIVE — markdown.tsx — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/lib/markdown.tsx | Read (full; `Formatted` L44–51; `MD` element map L19–42 — NO `img` override; no sanitizer/allowedElements) this turn | first-20: "// Markdown rendering for the Theo surface. // - `Formatted` renders full block markdown (CommonMark + GFM: headings, ordered/nested lists," · last-20: "tokens (URLs, hashes) breaking the bubble width. return ( <div style={{ overflowWrap: "anywhere" }}> <Markdown remarkPlugins={[remarkGfm]} components={MD}>{text}</Markdown> </div> ); }" |
| 12 | ACTIVE — swapBlock.ts — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/swapBlock.ts | Read (`BASE_PROMPT` L15–20) this turn | first-20: "/* ─── SWAP BLOCK ───────────────────────────────────────────────────────── Single point of truth for branding + model + prompts (1A handover §5). Surgical Theo" · last-20: "Keep one short conversational sentence outside the markers. To revise an existing ` + `artifact, reuse the same exact title.`;" |
| 13 | ACTIVE — prompt.ts — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/lib/prompt.ts | Read (`buildSystemPrompt` L16–31 composes `BASE_PROMPT`) this turn | first-20: "// System-prompt assembly + greeting — ported verbatim from VA-T1 (L84–107). // In 1A this feeds the mock gateway; in" · last-20: ""Good evening, <name>" home. const who = (name && name.trim()) || USER_NAME; return who ? `${part}, ${who}` : part; }" |

## Rule Anchor Table

| Source doc | Clause id | Verbatim clause text | Applied in output at |
| ---------- | --------- | -------------------- | -------------------- |
| src/theo/lib/markdown.tsx | header (L7) | "XSS-safe: markdown only, NO raw HTML (no rehype-raw)" | §1/§2 — markdown image `![](url)` already renders as an `<img>` (default react-markdown img; no sanitizer strips it); the `img` override only hardens it (https-only + max-width), no raw HTML enabled |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 Allowed Deltas | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor" | §3 CCT-2 — the styled `img` (visible inline image in a chat reply) is classified VISUAL-AUTHORITY-DEVIATION, Walter-directed (§21A) 2026-07-23 |
| src/theo/lib/prompt.ts | `buildSystemPrompt` (L17) | "BASE_PROMPT" | §1/§3 CCT-1 — the display instruction rides `BASE_PROMPT`, composed into the sent system prompt (both chat paths) |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §0.1/§6 | "no Tailwind" | §2 — the `img` override uses inline-style (the VA-T1/`MD`-map idiom), NOT Tailwind — no §5 AD-visual DEVIATION |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 rule 2 | "Verbatim Clause Text MUST be a direct substring as read this turn" | This Rule Anchor Table — every quote is a literal this-turn substring |

## §1 Feature Identification (F-P1)
- **Root cause:** `theo_fetch_image` returns the image to the MODEL as a vision block (API Spec §2.1) and is **never emitted to the FE** — so a "show me X" request yields a description, never a picture. The FE renderer already turns `![alt](https://…)` into a visible `<img>` (markdown.tsx has no `img` strip / sanitizer). So DISPLAY = Theo emitting a markdown image with a directly-viewable URL.
- **Edit 1 — `src/theo/swapBlock.ts` `BASE_PROMPT`:** append display guidance. Proposed: *" To SHOW the user what something looks like (a person, animal, place, thing), display it inline as a markdown image `![short description](https://…)` using a DIRECTLY-VIEWABLE https image URL found via web search — prefer Wikimedia Commons / Wikipedia (upload.wikimedia.org), which load directly; do NOT use Getty, Bravo, or news/stock URLs (they block hotlinking and won't load). The image-fetch tool only lets you SEE an image to analyze it — it displays nothing to the user, so to show an image you MUST emit the markdown image."* Rides `BASE_PROMPT` → both chat paths, client-sent (no backend/premium deploy).
- **Edit 2 — `src/theo/lib/markdown.tsx` `MD` map:** add an `img` override (after `td:`, before the map's closing brace):
  ```tsx
  img: ({ src, alt }) =>
    typeof src === "string" && src.startsWith("https://")
      ? <img src={src} alt={alt || ""} style={{ maxWidth: "100%", height: "auto", borderRadius: 8, margin: "8px 0" }} />
      : null,
  ```
  https-only (defense-in-depth over react-markdown's default urlTransform), `max-width:100%` so a large photo can't overflow the bubble, rounded corners + margin (VA-T1 token idiom, inline-style — no Tailwind). A non-https `src` renders nothing.
- **Boundary:** two FE files (`swapBlock.ts`, `markdown.tsx`). No backend, no `theo_fetch_image` change, no new dependency, no browser storage, no raw-HTML enablement (`rehype-raw` NOT added). `Formatted`/`splitAssistant`/other `MD` entries unchanged.

## §2 UI Authority Reconciliation (F-P2)
- **VA-T1 (Claude-for-Teams chat surface):** the reference is a Claude replica, and Claude renders markdown images inline in replies — so inline image display is within the VA-T1 idiom. The renderer already emits the default `<img>` for `![](url)`; **Edit 2 hardens it** (https-only + width cap + token styling). Because it is a visible rendered-surface element, it is classified **VISUAL-AUTHORITY-DEVIATION** (Golden Pack §5) with this Rule Anchor + **Walter's §21A authorization (Walter-directed image display, 2026-07-23)**. Edit 1 (prompt text) is behavioral — **EXACT**, no rendered-surface change.
- **VA-T3 §0.1/§6 (no Tailwind in 1A):** the `img` override is **inline-style** (the exact `MD`-map idiom used by every other element), not Tailwind/CSS-in-JS — so it is not a prohibited AD-visual conversion.
- **markdown.tsx §7 "NO raw HTML":** unchanged — `rehype-raw` is NOT added; only the markdown-image node is styled. A literal `<img>` typed as HTML in model text stays escaped.
- No conflict with any CURRENT VA authority; no new authority invented.

## §2.5 Gap Disclosure (F-P2.5)
**PROCEED.**
1. **VISUAL-AUTHORITY-DEVIATION (Edit 2) is authorized:** Walter directed image display (2026-07-23) — the §21A authorization; anchored (Rule Anchor #2). **PROCEED.**
2. **Renderer already supports images:** Edit 1 makes them appear TODAY; Edit 2 only hardens/sizes. If Edit 2 were omitted, images would still display (unstyled, possibly overflowing) — so the two are independent + safe. **PROCEED.**
3. **Viewable-URL dependency:** display works only if Theo emits a directly-fetchable URL; Edit 1 steers to Wikimedia (`upload.wikimedia.org` allows hotlinking). Getty/Bravo URLs would fail to load (broken `<img>`) — the prompt tells Theo to avoid them. Best-effort (LLM + Wikimedia coverage). **PROCEED.**
4. **Security:** https-only guard + no `rehype-raw`; react-markdown's default urlTransform already strips dangerous protocols. No new XSS surface. **PROCEED.**

## §3 Component Contract Table (F-P5)

| Component (proposed/active) | Prop / input interface | Visual authority citation | Data / contract dependency | Impl eligibility |
|-----------------------------|------------------------|---------------------------|----------------------------|------------------|
| CCT-1 · `BASE_PROMPT` (swap-block prompt const) — Theo surface prompt; **ACTIVE** (`src/theo/swapBlock.ts`) | Exported template-string const consumed by `buildSystemPrompt` (`prompt.ts` L17). **Change:** append the image-DISPLAY instruction (emit `![alt](url)` from a viewable Wikimedia URL; fetch-tool is vision-only). No signature/type change; no `any`. | VA-T1 (prompt assembly, "ported verbatim from VA-T1") — **EXACT** (behavioral/prompt text; no rendered-surface change) | none — relies on already-deployed built-in `web_search` + the existing renderer; adds no request/endpoint | **PROCEED** |
| CCT-2 · `Formatted` / `MD` map — Theo markdown renderer; **ACTIVE** (`src/theo/lib/markdown.tsx`) | `export function Formatted({ text }: { text: string })` — signature UNCHANGED. **Change:** add an `img` entry to the `MD: Components` map: `img: ({ src, alt }) => (typeof src === "string" && src.startsWith("https://")) ? <img src={src} alt={alt || ""} style={{ maxWidth: "100%", height: "auto", borderRadius: 8, margin: "8px 0" }} /> : null`. No `any`; inline-style (no Tailwind); no other `MD` entry touched. | VA-T1 chat message surface — **VISUAL-AUTHORITY-DEVIATION** (styled inline image now displayed in a reply), anchored (Golden Pack §5) + Walter §21A (image display directed 2026-07-23) | none — pure presentational; the `<img src>` is a public https URL Theo emits (no fetch/endpoint) | **PROCEED** |

## §4 Implementation Plan (Pass 3 — NOT BLOCKED)
1. `src/theo/swapBlock.ts`: append the image-display instruction to `BASE_PROMPT` (concatenated template segment after "…qualified preparer.").
2. `src/theo/lib/markdown.tsx`: add the `img` override to the `MD` map (per CCT-2).
3. Verify: `npx tsc --noEmit` CLEAN + `npm run build` GREEN. On `development` (salmon-river = dev+prod Theo — no premium). Walter validates: "show me a golden retriever" → Theo replies with a visible inline image (Wikimedia), sized within the bubble; a Getty/Bravo URL is avoided. Emit F-I2 mirror (CCT-1 EXACT; CCT-2 VISUAL-AUTHORITY-DEVIATION authorized) + F-I4 parity at Pass 3.

## §5 Structural Mirror / Visual-Parity note (Pass-3 preview)
- F-I2: `BASE_PROMPT` = EXACT (prompt text); the `MD` `img` addition = VISUAL-AUTHORITY-DEVIATION (authorized) — inline-style, no Tailwind (AD-visual respected); all other `MD` entries + `Formatted` EXACT.
- F-I4: the only new visual element is a width-capped, rounded inline image in assistant replies; palette/type/other elements unchanged.

## §6 Out of scope
`theo_fetch_image` (vision-only tool — unchanged; a user-facing image *card* / `vault_image` event is a heavier future option, not this pass); the server Operating Ruleset (would require a premium-monolith deploy — excluded); enabling raw HTML (`rehype-raw`) — NOT done; any backend/contract; non-image markdown elements.

## Requested action
Codex Pass-2 review (Conformance §3–§6; Golden Component Pack §3/§5/§12; VA-T1; VA-T3 no-Tailwind). On APPROVED, Claude Code implements per §4 on `development`, Walter validates the "show me an image" behavior, then lands.
