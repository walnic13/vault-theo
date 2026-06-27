# Theo 1B — Frontend Citations Rendering (reproduce VA-T5 inline citations) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2). **Microstep:** B1.7 made the deployed `theo_message` gateway return Anthropic `web_search` citations on its `type:"text"` blocks (golden-curl-verified: real fields `{ type:"web_search_result_location", cited_text, url, title, encrypted_index }`). This VEP renders them as the **Claude-style inline citation affordance** — **faithfully reproducing VA-T5** (`artifacts/theo-citations-reference.jsx`): a favicon+index chip after each cited claim, hover/focus source card with the cited snippet. Walter directive: "reproduce it; do not redesign it." **Reproduces VA-T5; additive to the VA-T1 chat surface.**

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `86ce982aaf0d3d478dbc961a5ec1b7019bc2f58e` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 Frontend VEP. F-P1…F-P7 walked; backend P/I/E track N/A for a frontend VEP. Reproduces the now-registered VA-T5 (FE Conformance §4B, landed `a7d70bc`).
Currency anchors: blob SHA (via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`. (NB: VA-T5's §4B **sha256** pin `56a3be46…` is the file content hash; the GCR cites the git **blob** SHA.)

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 build discipline) | `Grep("model call routes through a gateway abstraction")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; **§4B VA-T5**; §6) | `Grep("VA-T5 | Theo Citation Rendering Reference")` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Read(offset=1, limit=40)` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 EXACT/structural mirror) | `Grep("structural mirror of the Primary Reference")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (§5 acceptance) | `Grep("Acceptance criteria")` this turn | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 gateway response shape, incl. the documented `citations[]` clause) | `Grep("may attach a \`citations\` array to text blocks")` this turn | `b5bbd57e1544404ffe98d92fd33e98c8dc4f0289` |
| 7 | **VA-T5 reference (reproduce)** — `artifacts/theo-citations-reference.jsx` | `Read(full, 1–193)` this turn | `030d69469e7e6c36a700d66e85696ba31158ea67` |
| 8 | ACTIVE (modify) — `src/theo/types.ts` (`Message`/`GatewayResponse`; new `Citation`/`CitedRun`) | `Read(full)` this turn | `2cdcd75606f1af6d25d988aea4b461e33cb7b580` |
| 9 | ACTIVE (modify) — `src/theo/useTheoState.ts` (the `send` flow → build runs) | `Read(full)` this turn | `d411ad4be413a65b71ecbdae638126ca531485b5` |
| 10 | ACTIVE (modify) — `src/theo/components/ChatView.tsx` (assistant render) | `Read(full)` this turn | `9355548cb88cc7523376e40f60390ffa3486cb57` |
| 11 | **VA-T1** reference surface (cited in CCT CC-3) — `frontend/theo-frontend-reference.jsx` | `Read(offset=1, limit=20)` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§4D / T18). No `corporate-reporting`/`reporting_*` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "Reproduce faithfully, do not redesign." | §F-P2 / §F-P4 — VA-T5 is the registered authority; `CitedText` reproduces it |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "structural mirror of the Primary Reference" | §F-P2 / §CCT — `CitedText`/`CitationMarker` is an EXACT structural mirror of VA-T5 (tokens tuned to the Theo `C` palette per the reference's own note) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 (1) | "The model call routes through a gateway abstraction" | §F-P3 — citations arrive on the existing gateway response; no new browser call, no model credential |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 (3) | "1A state is React/in-memory" | §F-P6 — runs/citations carried in-memory on the `Message`; no `localStorage`/`sessionStorage` |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "A row missing any of the three locked surfaces is invalid (T20)." | §F-P5 — CCT rows carry prop interface + VA-id + contract dependency |
| spec/THEO_API_SPEC.md | §2.1 | "response `content[]` filtered to" | §F-P3 — citations ride the `type:"text"` blocks the gateway returns |
| spec/THEO_API_SPEC.md | §2.1 | "may attach a `citations` array to text blocks" | §F-P3 — the documented citation contract (locked via the API-Spec citations-shape Role-C); resolves T22 |

---

## §WA — Walter authorization (verbatim, predating this VEP)
> "Implement inline citation rendering matching the reference theo-citations-reference.jsx. Reproduce it; do not redesign it."

(Following "i'd like to add web fetch and citations to our internet grounding".) Authorizes reproducing VA-T5 in the chat surface.

## F-P1 — Feature identification
Render web-grounding **citations** inline, reproducing VA-T5. B1.7 returns citations on the gateway's `type:"text"` blocks; today `useTheoState.send` joins the text and **drops** them. This VEP maps each assistant text block to a `{ text, citations[] }` run, carries the runs in-memory on the assistant `Message`, and renders them with a reproduced `CitedText` component (favicon+index chip → hover/focus source card). Completes the "citations" half of grounding (the `web_search`/`web_fetch` backend is live in B1.7).

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| **VA-T5** (citation rendering reference) | `CitedText`/`CitationMarker` **faithfully reproduces** the registered reference (`artifacts/theo-citations-reference.jsx`): same structure (per-run text + trailing chips; sequential index; favicon+index chip; hover/focus source card with host, title, 3-line `cited_text`; adjacent chips for multi-source; real `<a target="_blank" rel="noopener noreferrer">` + aria-label). Tokens tuned to the Theo `C` palette per the reference's own note. | **VISUAL-AUTHORITY-MATCH** (reproduce VA-T5 — Rule Anchors 1, 2) |
| VA-T1 (chat surface) | Additive only: a chip row/inline chips appear within the assistant answer; the composer, user bubbles, loading/error, markdown, artifact handling are **unchanged**. Chips render only when a message carries citations. | VISUAL-AUTHORITY-MATCH (existing surface unchanged; citation affordance governed by VA-T5) |
| Gateway abstraction (FE Governor §6.1) | Citations arrive on the **existing** `theoClient.sendMessage` response (B1.7). No new call, no model credential. | unchanged (Rule Anchor 3) |

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1 (favicon egress)** | VA-T5's `faviconFor()` requests `google.com/s2/favicons` (external). In the locked-down frontend this may be CSP-blocked. | **PROCEED** — VA-T5 already degrades gracefully (`onError` → inline `Globe` SVG, zero-egress). Ships safe: favicons render where egress permits, globes otherwise. A CSP allowlist for that host (or a gateway favicon proxy) is a noted fast-follow for guaranteed favicons; not blocking. |
| **G-2 (viewport collision)** | VA-T5 opens the source card centered-above; near the chat-column edges a 300px card can clip. The reference leaves this to the implementer. | **PROCEED** — Pass 3 adds edge-aware positioning (measure + flip/shift within the viewport) on top of the reproduced card; behaviour otherwise identical to VA-T5. |
| **G-3 (citations + artifacts)** | A message renders **either** the `CitedText` runs (when citations present) **or** the artifact-remapped display (`renderAssistant`), not both. | **PROCEED** — `web_search`-grounded answers do not emit `[[ARTIFACT]]` blocks (those are draft outputs), so the two do not co-occur in practice; documented limitation, refine if needed. |
| **G-4 (persistence)** | Runs/citations are in-memory only. | **PROCEED** — consistent with 1A in-memory state (Rule Anchor 4); persistence is tier B3. |

No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting` change.

## F-P3 — Backend / contract grounding
- **Source (verified live):** gateway `data.content` = `type:"text"` blocks, each optionally carrying `citations: [{ type:"web_search_result_location", url, title, cited_text, encrypted_index }]`. Golden-curl-confirmed against the deployed handler — binding to these **real** fields (not the reference's `{url,title,cited_text}` placeholder).
- **Client contract (now documented in API Spec §2.1):** §2.1 documents the citation shape on text blocks — "may attach a `citations` array to text blocks" (locked via the API-Spec citations-shape Role-C; resolves T22). `GatewayResponse` content item gains optional `citations` to surface them; `gateway.live.ts` already returns the whole `data.content` array — **no gateway.live change**.
- **Mapping (the real work):** in `send`, map each `type:"text"` block to a run `{ text: b.text ?? "", citations: (b.citations ?? []).map((c) => ({ url: c.url, title: c.title, cited_text: c.cited_text })) }`; preserve citation→span association exactly as returned (no re-aggregation that detaches a citation from its claim); sequential index across the message; attach `runs` to the assistant `Message` only when any run has citations.

## F-P4 — Component reference grounding
**Primary Reference = VA-T5** (`artifacts/theo-citations-reference.jsx`, read full this turn) — reproduced as a new `src/theo/components/CitedText.tsx` (`CitedText` + `CitationMarker` + `Favicon` + `Globe` + `hostOf`/`faviconFor`), tokens tuned to the Theo theme `C`. ACTIVE modify-targets read full this turn: `types.ts`, `useTheoState.ts`, `ChatView.tsx`. `gateway.live.ts` unchanged.

## F-P5 — Component Contract Table
Format: Golden Pack §3 (Rule Anchor 5). `no any`; required-before-optional; `on<Event>`; discriminated unions preserved.

| # | Component (ownership; ACTIVE/NEW) | Prop / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| CC-1 | `CitedText` / `CitationMarker` (Theo surface; **NEW/GREENFIELD** — reproduces VA-T5) | `interface Citation { url: string; title: string; cited_text?: string }`; `interface CitedRun { text: string; citations: Citation[] }`; `function CitedText({ runs, startIndex }: { runs: CitedRun[]; startIndex?: number }): JSX.Element`; `function CitationMarker({ index, citation }: { index: number; citation: Citation }): JSX.Element`. Reproduces VA-T5 structure/behaviour (favicon+index chip; hover/focus source card; sequential index; adjacent chips; real `<a target="_blank" rel="noopener noreferrer">` + aria-label; `cited_text` 3-line clamp). Adds Pass-3 edge-collision positioning (G-2) and the VA-T5 `onError`→`Globe` favicon fallback (G-1). No `any`. | **VA-T5** (reproduce faithfully) | `theoClient.sendMessage` response `data.content[].citations` (B1.7 DEPLOYED) | PROCEED |
| CC-2 | `useTheoState` (Theo surface; **ACTIVE**, modify — state hook) | The `send` flow builds runs: `const blocks = (res.content || []).filter((b) => b.type === "text"); const runs = blocks.map((b) => ({ text: b.text ?? "", citations: (b.citations ?? []).map((c) => ({ url: c.url ?? "", title: c.title ?? "", cited_text: c.cited_text })) })); const hasCites = runs.some((r) => r.citations.length > 0);` then `setMessages((m) => [...m, { role: "assistant", content: display, ...(hasCites ? { runs } : {}) }])`. `sendMessage`/`ingestReply` signatures unchanged. Type contracts (types.ts): new `Citation`/`CitedRun`; `interface Message { role: Role; content: string; runs?: CitedRun[] }`; `interface GatewayResponse { content: { type: string; text?: string; citations?: { url?: string; title?: string; cited_text?: string }[] }[] }`. | VA-T1 (no direct render) | gateway response (B1.7 DEPLOYED) | PROCEED |
| CC-3 | `ChatView` (Theo surface; **ACTIVE**, modify — assistant render) | Prop interface **unchanged**: `interface ChatViewProps { messages: Message[]; loading: boolean; error: string; draft: string; onDraftChange: (s: string) => void; onSend: (text?: string) => void; chatProject: Project \| null; assistantName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode }`. Assistant branch: when `m.runs?.some((r) => r.citations.length)`, render `<CitedText runs={m.runs} />`; else `renderAssistant(m.content)` (unchanged). | **VA-T5** (citation render) + VA-T1 (surface otherwise unchanged) | gateway response (B1.7 DEPLOYED) | PROCEED |

**Infra:** none. No dependency, `vite.config`, route, storage, or Tailwind change. `gateway.live.ts` unchanged.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `a7d70bc`: `types.ts` (add `Citation`/`CitedRun`; widen `Message`/`GatewayResponse`), `useTheoState.ts` (build runs in `send`), `ChatView.tsx` (render runs). NEW: `src/theo/components/CitedText.tsx` (reproduce VA-T5). Reference: `gateway.live.ts` (unchanged). Guardrails (Rule Anchors 3/4): in-memory only (no browser storage); no direct browser→model call; no Tailwind; no `reporting_*`/`corporate-reporting` change.

## F-P7 — VEP assembly
GCR + Rule Anchors open the pack; §WA quotes the authorization; F-P1→F-P6 walked; Gap Disclosure present (all PROCEED); CCT locked (1 NEW reproducing VA-T5 + 2 ACTIVE modify). No implementation begun. On Codex APPROVAL, Pass 3 adds `CitedText.tsx` (faithful VA-T5 reproduction + G-1/G-2 hardenings), the runs mapping, and the ChatView branch (verified `tsc`/`build` green); Origin's runtime remote picks up the rebuilt vault-theo → **inline citations with hover source cards under grounded Theo answers** (Walter SWA acceptance = Visual Acceptance Evidence).

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-FE-Citations-Rendering-Pass-1-VEP/Theo_1B_FE_Citations_Rendering_VEP.md" --repo-root .
PASS  Codex Governance/Theo-1B-FE-Citations-Rendering-Pass-1-VEP/Theo_1B_FE_Citations_Rendering_VEP.md
exit code: 0
```
(Codex re-runs the same command per its §1A hard gates.)

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of Frontend Citations Rendering Pass-1 Frontend VEP (plan only) — reproduces VA-T5.*
