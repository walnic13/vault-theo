# Theo Frontend — FindImage prompt tool-first (`BASE_PROMPT`: always call `theo_find_image`, never hand-write an image URL): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (implementation is Pass 3). Fixes a **tool-bypass** observed live 2026-07-23: asked to "show me an image of Nadal winning the French Open", Theo did **not** call `theo_find_image` — it recalled an image URL from a prior conversation ("in a previous conversation I successfully showed this image: …`Rafael_Nadal_at_the_2008_French_Open_10.jpg`") and hand-wrote a markdown image, which broke (the recalled URL was hallucinated/never worked). A second live example (2026-07-23): asked for "another image, actually in the moment of winning", Theo again skipped the tool and hand-wrote two guessed Wikimedia URLs ("images 7 and 9 from that series"), both broken, hedging "if that one doesn't load perfectly". Root cause: `swapBlock.ts` `BASE_PROMPT` still instructs *"to show an image you MUST emit the markdown image … using a https image URL found via web search"* — it actively tells the model to hand-write image markdown, so the model can (and did) skip the tool and reuse/guess an unreliable URL. The reliable display path (render-from-frame via `theo_find_image` → `event: vault_image`) is already deployed; this VEP makes the model actually **use** it: flip the `BASE_PROMPT` display instruction to **tool-first** — ALWAYS call `theo_find_image`, and NEVER hand-write / paste / guess / recall an image URL. One FE file (`swapBlock.ts`), one prompt block; no visual change, no new component/VA-id.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `5a1e256f0091df1f6a5b0c1654908cbe35ac5651` (vault-theo, `development` — the commit that first contains this package; grounding reads performed against parent `3f4806e170fded4ee0c0cfe8bd999933d65a50d5`). Working tree also carried untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not source/governance, not grounding).
Currency-anchor form: git blob SHA at HEAD.

### §4 Documents grounded this turn (Full Baseline — Frontend Conformance §4 matrix)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Frontend Governor — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `git rev-parse` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix, §6 CCT gates, §8 currency) | `Grep("Component Contract Table")` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Theo Golden Component Pack — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT, §5 Allowed Deltas) | `Grep("Allowed Deltas")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | Codex Theo Frontend Review — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | `git rev-parse` this turn | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` | `git rev-parse` this turn | `b8155889ebfb44a153192e63796812a94aa87004` |
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.15 theo_find_image; §2.1 vault_image display) | `Grep("theo_find_image")` this turn | `39aac571f29f94ebfb468902b41a0bb8d2c80329` |
| 8 | ACTIVE (edited) — `src/theo/swapBlock.ts` (`BASE_PROMPT`, L15–26) | `Read` this turn | `7366255fe24e5337ef66a9d8f7f91dbfecb26490` |
| 9 | Consumer — `src/theo/lib/prompt.ts` (`buildSystemPrompt` composes `BASE_PROMPT` into the sent system prompt, both chat paths) | `Grep("BASE_PROMPT")` this turn | (in-repo @ HEAD) |

VA registry (§4B): **VA-T1** (Theo surface) — unchanged; this VEP makes **no visual change** (a prompt-string edit), so there is **no VISUAL-AUTHORITY-DEVIATION** and no new VA-id.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Allowed Deltas" | §1 — a `BASE_PROMPT` text edit with no rendered-surface change; NOT a VISUAL-AUTHORITY-DEVIATION (contrast the prior image-display VEP, which added the `img`) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" | CCT below — the `BASE_PROMPT` config row (prop interface N/A; VA N/A no visual surface; data dependency = `theo_find_image`) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" | CCT below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.15 | "theo_find_image" | §1 — the prompt now mandates this deployed tool for all image display |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/src/theo/lib/prompt.ts | buildSystemPrompt | "BASE_PROMPT" | §1 — the edited instruction rides `BASE_PROMPT`, composed into the system prompt on both chat paths (client-sent) |

## Component Contract Table (Frontend Conformance §6 / Golden Component Pack §3)
| "Surface" | Prop interface | Visual authority (VA-id) | Data / contract dependency |
|---|---|---|---|
| `swapBlock.ts` `BASE_PROMPT` (a prompt-config `const string`, composed by `buildSystemPrompt` in `lib/prompt.ts` into the system prompt on both chat paths) | **N/A** — not a React component; `BASE_PROMPT` is an exported `const` string, no props. | **N/A** — no rendered surface; makes no visual change (the image still renders via the deployed VA-T1 `img` treatment, unchanged). No VISUAL-AUTHORITY-DEVIATION. | The `theo_find_image` tool (API §2.15) via the `chat-tools` tool-loop (`theo_message_stream`, DR-T11); its result displays via `event: vault_image` (API §2.1, deployed). The prompt now **mandates** that tool for image display and forbids hand-written/pasted/recalled image URLs. |

No component is added or modified; there is no visual surface, so no VA citation applies (Frontend Conformance §6 CCT row is complete with the justified N/A cells + the data dependency, per the prior BASE_PROMPT precedent `Theo-Image-Display-FE-Pass-1-VEP`).

## §1 Feature Identification + boundary
- **Edit (one FE file, `src/theo/swapBlock.ts` `BASE_PROMPT`):** replace the "display it inline as a markdown image … you MUST emit the markdown image" block with tool-first guidance: *"To SHOW the user what something looks like, ALWAYS call the `theo_find_image` tool with a concise subject — it returns a verified image that the app displays AUTOMATICALLY. Do NOT write a markdown image yourself, do NOT paste or invent an image URL, and NEVER reuse an image URL from your memory or a previous conversation — remembered or hand-written image URLs are unreliable and will not display. After the tool returns, briefly confirm/describe (for a CC result, mention creator and licence). If nothing is found, say so. (The separate image-fetch tool only lets you SEE an image URL already in the conversation to analyze it.)"*
- **Why:** the deployed render-from-frame path only fires when the model CALLS `theo_find_image`. The old prompt told the model to hand-write image markdown, so it bypassed the tool and reused a stale remembered URL → broken image. This edit closes the bypass at its source (the instruction) and neutralises the polluting memory (recalled image URLs are explicitly forbidden for display).
- **Boundary:** one FE file, one prompt block. No component, no visual change, no new VA-id, no `markdown.tsx`/`theo_fetch_image`/backend change, no new dependency, no storage. `ARTIFACT_RULES` and branding constants unchanged. Rides `BASE_PROMPT` → both chat paths, client-sent (no premium deploy).

## §2 Gap Register
**PROCEED.**
- **(1) Depends on the deployed tool + display path.** `theo_find_image` (handler + registration) and the `event: vault_image` render-from-frame path are DEPLOYED + verified (2026-07-23). This edit routes the model to them. PROCEED.
- **(2) Memory pollution neutralised, not erased.** A distilled memory falsely claims a prior image URL "worked". This VEP forbids reusing remembered image URLs for display (always call the tool), so the bad memory no longer yields a broken image. Surgically editing per-user distilled memory is out of scope; the prompt guard is the fix. Disclosed, PROCEED.
- **(3) No visual change → no VISUAL-AUTHORITY-DEVIATION** (§5); CCT N/A cells justified (no component/surface). PROCEED.
- **(4) tsc gate:** `swapBlock.ts` is a plain string edit; Pass-3 runs `tsc --noEmit` (green) before build. PROCEED.

## §3 Frontend sub-phase walk (F-P1–F-P7)
- **F-P1 Scope:** flip `BASE_PROMPT` image guidance to tool-first (§1).
- **F-P2 Visual authority:** none touched (VA-T1 render unchanged); no new VA.
- **F-P3 CCT:** above — `BASE_PROMPT` config row (N/A prop/VA + `theo_find_image` data dependency).
- **F-P4 Structural mirror:** the prior `BASE_PROMPT` edit (`Theo-Image-Display-FE-Pass-1-VEP`) — same file, same `const`, same composition path.
- **F-P5 Allowed-delta / deviation:** prompt-text only; no rendered-surface change → not a deviation (§5).
- **F-P6 Contract dependency:** `theo_find_image` (API §2.15) + `event: vault_image` (API §2.1), both deployed.
- **F-P7 Assembly:** this pack (GCR + §4 table + Rule Anchor Table + CCT + lint PASS).

## §4A Deploy (Pass-3, on APPROVAL) — vault-theo FE (salmon-river; dev+prod from `development`)
1. Apply the one-block `BASE_PROMPT` edit; run `tsc --noEmit` (green), then vite build.
2. Commit + push `development` (salmon-river serves dev + prod).
3. Verify in Theo: "show me an image of Nadal winning the French Open" → Theo now **calls `theo_find_image`** (visible tool row) and the image renders inline from `event: vault_image`; the model writes no markdown image / no URL and does not reuse a remembered URL.

## §5 Out of scope
No `markdown.tsx` / `theo_fetch_image` / backend change (all deployed). No new component/card/VA-id. No per-user memory surgery (the prompt guard handles it). No premium.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-FindImage-PromptToolFirst-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code applies the `BASE_PROMPT` edit, runs `tsc` + vite build, and pushes `development`.
