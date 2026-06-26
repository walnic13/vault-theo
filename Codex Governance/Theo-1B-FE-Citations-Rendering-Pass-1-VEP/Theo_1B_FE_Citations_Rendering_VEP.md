# Theo 1B — Frontend Citations Rendering (web-grounding source chips) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2). **Microstep:** B1.7 made the deployed `theo_message` gateway return Anthropic `web_search` citations on its `type:"text"` blocks (golden-curl-verified: 1 citation, `url`+`title`). This VEP renders those citations as **source chips** beneath assistant answers so users can see and click where a grounded answer came from. The citation **data already flows** to the client; only the **display** is added. This is an **additive VISUAL-AUTHORITY-DEVIATION** on VA-T1 (a new surface element the 1A reference does not contain), authorized by Walter's verbatim directive (§WA), styled in the surface's existing chip vocabulary (no redesign).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `8e766829e380034d723a394485bec006952a31bb` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 Frontend VEP (FE Conformance §4 matrix). F-P1…F-P7 walked; the backend P/I/E sub-phase track does not apply to a frontend VEP → `N/A`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); independently verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 build discipline) | `Grep("model call routes through a gateway abstraction")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B VA-T1; §6 triggers) | `Grep("VA-T1")` this turn | `a73a49f7a680a10298642a634258d839cce165af` |
| 3 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Read(offset=1, limit=40)` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 visual-deviation rule) | `Grep("must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (§5 acceptance; surface authority) | `Grep("Acceptance criteria")` this turn | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 chat / model gateway response shape) | `Grep("response \`content[]\` filtered to")` this turn | `4a1d2433c111ad7861e69f6d36acf72b8ef3e1d5` |
| 7 | ACTIVE (modify) — `src/theo/types.ts` (`Message`/`GatewayResponse`; new `Citation`) | `Read(full)` this turn | `2cdcd75606f1af6d25d988aea4b461e33cb7b580` |
| 8 | ACTIVE (modify) — `src/theo/useTheoState.ts` (the `send` flow) | `Read(full)` this turn | `d411ad4be413a65b71ecbdae638126ca531485b5` |
| 9 | ACTIVE (modify) — `src/theo/components/ChatView.tsx` (assistant message render) | `Read(full)` this turn | `9355548cb88cc7523376e40f60390ffa3486cb57` |
| 10 | Reference (unchanged) — `src/theo/services/gateway.live.ts` (returns `data.content` incl. citations) | `Read(full)` this turn | `76f8a7e9276f9cea42b5628e8ac514b589633648` |

No ChatGPT advisory cited (§4D / T18). No `corporate-reporting`/`reporting_*` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." | §F-P2 — citation chips classified VISUAL-AUTHORITY-DEVIATION (Walter-authorized §WA) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "reproduce faithfully, do not redesign" | §F-P2 — the deviation is purely **additive** (chips below the existing assistant bubble); the reproduced VA-T1 surface is otherwise unchanged |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 (1) | "The model call routes through a gateway abstraction" | §F-P3 — citations arrive via the existing gateway response; no new browser call, no model credential |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 (3) | "1A state is React/in-memory" | §F-P6 — citations carried in-memory on the `Message`; no `localStorage`/`sessionStorage` |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "A row missing any of the three locked surfaces is invalid (T20)." | §F-P5 — CCT rows carry prop interface + VA-id + contract dependency |
| spec/THEO_API_SPEC.md | §2.1 | "response `content[]` filtered to" | §F-P3 — citations ride the `type:"text"` blocks the gateway returns |

---

## F-P1 — Feature identification
**Microstep:** render web-grounding **citations** in the Theo chat surface. B1.7 (deployed, golden-curl-verified) returns Anthropic `web_search` citations on the gateway response's `type:"text"` blocks (`{url, title, …}`). Today `useTheoState.send` joins the text and **drops** the citations; this VEP collects them, carries them in-memory on the assistant `Message`, and `ChatView` renders them as clickable **source chips** beneath the answer. Completes the "citations" half of the grounding work (the `web_fetch`/`web_search` backend is live in B1.7).

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (chat surface) | The 1A reference surface (VA-T1) contains **no citation element**. This VEP adds a **"Sources" chip row beneath assistant messages** — a new rendered element. It is purely **additive** (the existing composer, message bubbles, markdown, artifact handling, loading/error states are untouched) and uses the surface's **existing chip vocabulary** (the `.vo-chip` style + theme `C` tokens already used for prompt starters), so it reads as native — not a redesign. | **VISUAL-AUTHORITY-DEVIATION** (Rule Anchors 1, 2) — Walter-authorized (§WA) |
| Gateway abstraction (FE Governor §6.1) | Citations arrive on the **existing** `theoClient.sendMessage` response (B1.7). No new network call, no model credential, no second endpoint. | ALLOWED DELTA / unchanged (Rule Anchor 3) |

## §WA — Walter authorization (verbatim, predating this VEP)
> "i'd like to add web fetch and citations to our internet grounding"

This authorizes the additive citation-chips VISUAL-AUTHORITY-DEVIATION on VA-T1 (Golden §5 / Rule Anchor 1).

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | Only `web_search` produces citation blocks; `web_fetch` answers may carry none (golden curl: web_fetch returned 0 citations). | **PROCEED** — by design; the chip row renders only when `m.citations` is non-empty, so non-grounded / fetch-only answers look exactly as today (no empty row). |
| **G-2** | Anthropic citation objects carry more fields (`cited_text`, `encrypted_index`, type); the chip uses only `url` + `title`. | **PROCEED** — minimal faithful display; `Citation` is typed `{url, title}` and mapped from the response; extra fields ignored. Per-claim inline footnote markers are a possible later refinement, out of scope here. |
| **G-3** | Citations are in-memory only (no persistence). | **PROCEED** — consistent with 1A in-memory state (Rule Anchor 4); persistence is a later tier (B3) alongside conversation storage. |

No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting` change.

## F-P3 — Backend / contract grounding
- **Source:** the deployed `theo_message` gateway (B1.7) returns `data.content` = `type:"text"` blocks, each optionally carrying `citations: [{ type:"web_search_result_location", url, title, cited_text, encrypted_index }]` (Anthropic web_search). Golden-curl-verified.
- **Client contract (widen, backward-compatible):** `GatewayResponse` content item gains optional `citations`. `gateway.live.ts` already returns the whole `data.content` array (citations pass through untouched) — **no gateway.live change**, only the type widens to surface them.
- **Mapping:** in `send`, after filtering `type:"text"` blocks, flat-map `b.citations`, dedupe by `url`, map to `Citation {url, title}`, attach to the assistant `Message` (only when non-empty).

## F-P4 — Component reference grounding
ACTIVE modify-targets, read full this turn: `types.ts` (`Message`/`GatewayResponse`; new `Citation`), `useTheoState.ts` (`send`), `ChatView.tsx` (assistant render). Reference (unchanged): `gateway.live.ts`. No new file. Surface authority = VA-T1 (chips are an additive VISUAL-AUTHORITY-DEVIATION).

## F-P5 — Component Contract Table
Format: Golden Pack §3 (Rule Anchor 5). `no any`; required-before-optional; `on<Event>`; discriminated unions preserved.

| # | Component (ownership; ACTIVE/NEW) | Prop / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| CC-1 | `ChatView` (Theo surface; **ACTIVE**, modify — assistant render) | Prop interface **unchanged**: `interface ChatViewProps { messages: Message[]; loading: boolean; error: string; draft: string; onDraftChange: (s: string) => void; onSend: (text?: string) => void; chatProject: Project \| null; assistantName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode }`. The change is render-only: in the assistant branch, when `m.citations?.length`, render a "Sources" row of chips — each `<a href={c.url} target="_blank" rel="noopener noreferrer">` styled with the existing `.vo-chip` class + theme `C` tokens — beneath `renderAssistant(m.content)`. `Message` now carries `citations?`. | **VA-T1** — additive VISUAL-AUTHORITY-DEVIATION (source chips; §F-P2, Rule Anchors 1/2) | `theoClient.sendMessage` response `data.content[].citations` (B1.7 DEPLOYED) | PROCEED |
| CC-2 | `useTheoState` (Theo surface; **ACTIVE**, modify — state hook) | The `send` flow gains citation collection: from `res.content` `type:"text"` blocks, `const citations = dedupeByUrl(blocks.flatMap((b) => b.citations ?? [])).map((c) => ({ url: c.url, title: c.title }))`; append `{ role: "assistant", content: display, ...(citations.length ? { citations } : {}) }`. `sendMessage`/`ingestReply` signatures unchanged. Type contracts (types.ts): new `interface Citation { url: string; title: string }`; `interface Message { role: Role; content: string; citations?: Citation[] }`; `interface GatewayResponse { content: { type: string; text?: string; citations?: { url?: string; title?: string }[] }[] }`. | VA-T1 (no direct render) | `theoClient.sendMessage` response (B1.7 DEPLOYED) | PROCEED |

**Infra:** none. No dependency, `vite.config`, route, storage, or Tailwind change. `gateway.live.ts` unchanged.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `8e76682`: `types.ts` (add `Citation`; widen `Message`/`GatewayResponse`), `useTheoState.ts` (collect citations in `send`), `ChatView.tsx` (render chips). Reference: `gateway.live.ts` (unchanged — already returns `data.content` incl. citations). Guardrails (Rule Anchors 3/4): citations in-memory only (no browser storage); no direct browser→model call; no Tailwind; no `reporting_*`/`corporate-reporting` change.

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; §WA quotes the authorization; Gap Disclosure present (all PROCEED); CCT locked (2 ACTIVE modify rows). No implementation begun. On Codex APPROVAL, Pass 3 implements the type widen + `send` collection + `ChatView` chip render (verified `tsc`/`build` green); the rebuilt vault-theo remote is picked up by Origin at runtime → **citations visible under grounded Theo answers in Origin** (Walter SWA acceptance = Visual Acceptance Evidence).

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-FE-Citations-Rendering-Pass-1-VEP/Theo_1B_FE_Citations_Rendering_VEP.md" --repo-root .
PASS  Codex Governance/Theo-1B-FE-Citations-Rendering-Pass-1-VEP/Theo_1B_FE_Citations_Rendering_VEP.md
exit code: 0
```
(Codex re-runs the same command per its §1A hard gates.)

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of Frontend Citations Rendering Pass-1 Frontend VEP (plan only).*
