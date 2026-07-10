# Theo 1B — FE "Stop generating" button (abort streaming, keep the partial reply) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc --noEmit` green — validated this turn by overlaying `proposed-src/theo/` onto a scratch copy of `src`, then reverting `src`) and Walter redeploys the Theo SWA. **Microstep:** a Claude/ChatGPT-style **Stop generating** control. While Theo is streaming a reply, the Send button becomes a **Stop** button that aborts generation, KEEPS whatever partial text has streamed, and re-enables the composer. The composer textarea stays editable during streaming. No message-queuing in v1. Behind the single `theoClient` boundary; no new backend, no migration, no browser storage — abort is a pure client-side `AbortController` on the existing streaming fetch.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (FE Pass 1 plan)
Turn issued against HEAD: `87e8118ac72a5eb96f9e779116978a3f5a81f384` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack. **Visual-authority DEVIATION** turn: the Stop control is additive UI not present in VA-T1 (the reference composer has a single Send button that is merely *disabled* while `loading` — `frontend/theo-frontend-reference.jsx` L486, Read this turn). Per FE Governor a planned visual deviation is valid when **cited + classified (VISUAL-AUTHORITY-DEVIATION) + Rule-Anchored**, with **Walter** as the exemption authority. VA-T1 Read this turn (composer / Send-button region). No new backend: abort is client-side over the already-deployed `theo_message_stream` streaming fetch (B9). The five modified files were overlaid onto a scratch copy of `src` this turn and pass `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`, exit 0); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§UI-Authority Reconciliation; §exemption authority) | `Grep("A planned visual deviation must be cited and classified" / "Walter is the execution")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5 GCR + Rule Anchor Table) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `07e8dabbccc1d0394a493c6a6b358e38253e4f4b` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT / three locked surfaces; §5 allowed deltas) | `Grep("three locked surfaces" / "service-module/gateway abstraction")` + `Read(§3–§7)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (composer / Send-button region L484–486) | `Grep("vo-send" / "onSend" / "↑")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 5 | ACTIVE (modify — state owner) — `src/theo/useTheoState.ts` (`loading`, refs cluster, `newChat`, `send`, return object) | `Read(full)` this turn | `9148193fa1d9a7618aaf81b3f8c7ab6d60a1859e` |
| 6 | ACTIVE (modify) — `src/theo/services/theoClient.ts` (`sendMessageStream` passthrough) | `Read(full)` this turn | `cb558c37a877493194a180cd97f28fa9a61855d7` |
| 7 | ACTIVE (modify) — `src/theo/services/gateway.live.ts` (`sendMessage` + `sendMessageStream` fetch init) | `Read(full)` this turn | `321b53e248b7a8141812ab97d22f5234b3156a7f` |
| 8 | ACTIVE (modify) — `src/theo/components/ChatView.tsx` (props interface; Send → Stop) | `Read(full)` this turn | `c0b821d815743dd4603c138d5c32c733bc25354d` |
| 9 | ACTIVE (modify) — `src/theo/components/TheoMain.tsx` (ChatView wiring) | `Read(full)` this turn | `938f58d2e0a763a7ba5f9588be4e33b0be13d773` |
| 10 | REFERENCED (unchanged — confirm no new prop) — `src/theo/TheoSurface.tsx` (`TheoSurfaceProps`) | `Read(full)` this turn | `38c5d6a5420618e7ae23c8c7eccb1f52b895b3af` |

No ChatGPT advisory cited (§6). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §UI-Auth | "A planned visual deviation must be cited and classified" | §F-P2 — the Stop control is classified VISUAL-AUTHORITY-DEVIATION + anchored |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §authority | "Walter is the execution, runtime-acceptance, and exemption authority" | §F-P2 — Walter directed the Stop affordance (exemption authority) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — each CCT row carries full interface + VA-id + contract dependency |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" | §F-P2 — the abort signal threads through `theoClient` → `gateway.live` (ALLOWED DELTA) |
| frontend/theo-frontend-reference.jsx | VA-T1 composer | "onClick={() => send()}" | §F-P2 — VA-T1 composer has only a Send button (disabled while loading); Stop is additive |
| src/theo/components/ChatView.tsx | canSend gate | "const canSend = (!!draft.trim() || hasReady) && !loading && !uploading;" | §F-P4/TC-4 — Enter stays gated by `canSend` (no send while loading); Stop is button-only |
| src/theo/useTheoState.ts | loading state | "const [loading, setLoading] = useState(false);" | §F-P4/TC-1 — `stop()` aborts the in-flight stream; `loading` re-enables the composer on abort |
| src/theo/useTheoState.ts | send finalize | "} finally { setLoading(false); }" | §F-P4/TC-1 — the `finally` also clears `abortRef`/`userStoppedRef` so the next turn starts fresh |
| src/theo/services/theoClient.ts | stream passthrough | "return gatewaySendStream(req, handlers);" | §F-P4/TC-2 — widened to forward `opts` (the abort signal) unchanged |
| src/theo/services/gateway.live.ts | SSE read loop | "const reader = resp.body.getReader();" | §F-P4/TC-3 — aborting the fetch rejects `reader.read()` with AbortError → propagates to `send()` catch |
| src/theo/components/TheoMain.tsx | ChatView wiring | "onDraftChange={t.setDraft} onSend={t.send}" | §F-P4/TC-5 — gains `onStop={t.stop}` |
| src/theo/TheoSurface.tsx | surface props | "export interface TheoSurfaceProps {" | §F-P5/TC-6 — UNCHANGED; no new TheoSurface prop is required |

---

## F-P1 — Feature identification
**Microstep:** a **Stop generating** control on the Theo chat, matching the Claude / ChatGPT idiom. Theo already streams replies token-by-token over the deployed `theo_message_stream` sidecar (B9). Today, while a reply streams, the composer Send button is disabled and there is no way to interrupt a long or wrong answer — the user must wait for the stream to finish. This microstep adds, purely client-side:
1. **Stop button** — while `loading` (a stream is in flight), the primary composer action becomes a **Stop** button (a filled-square glyph, coral, always enabled) in the same `.vo-send` slot; clicking it aborts the stream.
2. **Keep the partial** — on a user Stop, whatever text has already streamed into the assistant turn is KEPT (not rolled back). If nothing streamed yet, only the empty assistant placeholder is dropped (the user's turn is kept).
3. **Re-enable the composer** — `loading` flips false on abort, so Send returns and the user can type/send again. The textarea stays editable throughout streaming.

The whole feature is an `AbortController` on the existing streaming fetch. **No backend change, no migration, no new contract** — the abort never reaches the server as a distinct call (it cancels the in-flight HTTP request).

## F-P2 — Architecture & boundary reconciliation (UI Authority + service boundary)
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (composer / Send button) | The reference composer (`theo-frontend-reference.jsx` L484–486) has a **single Send button**, `disabled={!draft.trim() || loading}`, and no interrupt affordance. This microstep, while `loading`, swaps that Send button for a **Stop** button in the identical `.vo-send` 34×34 slot (coral background, filled-square glyph, `aria-label="Stop generating"`, `title="Stop"`, never disabled). When not loading, the existing Send button (`↑`, gated by `canSend`) is unchanged. This is a deliberate, additive departure from the reference — **cited, classified, and Rule-Anchored** per FE Governor, **authorized by Walter** (the exemption authority; he directed the Stop affordance). All other composer chrome (textarea, attach button, chips, disclaimer) is preserved. | **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3) |
| Gateway / service abstraction (Golden §5) | The abort `signal` threads through the existing boundary only: `useTheoState` owns the `AbortController`; `theoClient.sendMessageStream(req, handlers, opts)` forwards `opts` unchanged; `gateway.live` attaches `opts?.signal` to the streaming fetch (and to the non-streaming one-shot fallback). No new network call; no browser→model call. | ALLOWED DELTA (wiring an inline call to the service-module/gateway abstraction) |
| State owner (`useTheoState`) | Two new refs (`abortRef`, `userStoppedRef`), a per-turn `AbortController` in `send()`, abort-aware `catch`/`finally`, a `stop()` handler, and an abort at each thread-switch entry point (`newChat`, `selectRecent`, `startInProject`). Presentational surfaces unchanged except the added `onStop` prop. | ALLOWED DELTA (behind the state owner + service boundary) |

No un-cited deviation. `ArtifactsView`, `ArtifactPanel`, `Sidebar`, `ProjectsView`, `ProjectDetail`, `Customize`, `ui.tsx`, `icons.tsx`, `types.ts`, `gateway.mock.ts` unchanged. `TheoSurface.tsx` is UNCHANGED (no new prop) — it already threads `t` through `TheoMain`, which owns the ChatView wiring.

## F-P3 — Backend / contract grounding
**No backend change, no migration, no new API row.** Streaming already runs against the deployed `theo_message_stream` handler on the `vaultgpt-func-stream` sidecar (B9). Stop is implemented entirely on the client: a `fetch(..., { signal })` on the existing streaming request. Aborting the signal:
- cancels the in-flight HTTP request to `theo_message_stream` (and, in the no-`streamBase` degrade path and the standalone harness, the one-shot `theo_message` fallback);
- rejects the pending `reader.read()` with a `DOMException` named `AbortError`, which propagates up through `sendMessageStream` into `send()`'s `catch`.
Server-side, the request is simply dropped mid-flight; there is no "cancel" endpoint and none is added.

## F-P4 — Component reference grounding
**State owner:** `useTheoState.ts` — `abortRef`/`userStoppedRef` refs; `send()` creates a per-turn `AbortController`, passes `{ signal }` into the stream call, and gains an abort-aware `catch` (keep-partial on user Stop; do-nothing on an implicit switch-abort; the normal error rollback + `setError` are skipped in both abort cases); `finally` clears the refs; new `stop()`; and `abortRef.current?.abort()` at the top of `newChat`, `selectRecent`, and `startInProject`. **Service/transport:** `theoClient.sendMessageStream` widened with `opts?: { signal?: AbortSignal }` (pure passthrough); `gateway.live.ts` `sendMessageStream`/`sendMessage` gain the same `opts` and attach `opts?.signal` to their fetch inits. **Surface:** `ChatView.tsx` adds the required `onStop` prop and, while `loading`, renders Stop instead of Send; the textarea stays editable and Enter stays gated by `canSend`. **Wiring:** `TheoMain.tsx` passes `onStop={t.stop}`. Governing authority = VA-T1 (Walter-authorized deviation) + Golden Component Pack (§3 CCT, §5 abstraction) + the deployed B9 streaming path.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; required-before-optional; `on<Event>`; full TS interfaces.

| # | Module (ownership; ACTIVE/NEW) | Interface / behavior (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `useTheoState.ts` (**ACTIVE**, modify — state owner) | Adds `const abortRef = useRef<AbortController \| null>(null)` and `const userStoppedRef = useRef(false)`. In `send()`: after `setLoading(true)`, `const ac = new AbortController(); abortRef.current = ac;`; the stream call becomes `theoClient.sendMessageStream(req, handlers, { signal: ac.signal })`; `catch (e)` computes `const aborted = (e as { name?: string })?.name === "AbortError" \|\| ac.signal.aborted;` — if `aborted`: when `userStoppedRef.current` and `acc.trim() === ""` drop only the empty assistant placeholder (`setMessages((m) => m.slice(0, -1))`), else keep the partial already shown; then `return` (both abort branches skip the real-error rollback + `setError`); non-abort errors keep the existing rollback. `finally` becomes `{ setLoading(false); abortRef.current = null; userStoppedRef.current = false; }`. New `function stop() { userStoppedRef.current = true; abortRef.current?.abort(); }`. `newChat()`/`selectRecent()`/`startInProject()` each begin with `abortRef.current?.abort();` (userStoppedRef stays false → discard path). Return object gains `stop`. | VA-T1 (state owner; no direct surface) | none new — reuses the deployed B9 stream | PROCEED |
| TC-2 | `services/theoClient.ts` (**ACTIVE**, modify) | `sendMessageStream(req: GatewayRequest, handlers: StreamHandlers, opts?: { signal?: AbortSignal }): Promise<void> { return gatewaySendStream(req, handlers, opts); }` — one optional param added; pure passthrough. | VA-T1 (no surface) | Golden §5 boundary | PROCEED |
| TC-3 | `services/gateway.live.ts` (**ACTIVE**, modify) | `sendMessageStream(req, handlers, opts?: { signal?: AbortSignal })` attaches `signal: opts?.signal` to the `theo_message_stream` fetch init and forwards `opts` to the no-`streamBase` `sendMessage(req, opts)` fallback. `sendMessage(req: GatewayRequest, opts?: { signal?: AbortSignal })` attaches `signal: opts?.signal` to the `theo_message` fetch init. Mock branches unchanged (nothing to abort). | VA-T1 (no surface) | deployed `theo_message_stream` / `theo_message` (B9) | PROCEED |
| TC-4 | `components/ChatView.tsx` (**ACTIVE**, modify) | `export interface ChatViewProps { messages: Message[]; loading: boolean; error: string; draft: string; attachments: ComposerAttachment[]; attachmentsAvailable: boolean; onDraftChange: (s: string) => void; onSend: (text?: string) => void; onStop: () => void; onAddFiles: (files: FileList \| File[]) => void; onAddPastedText: (text: string) => boolean; onRemoveAttachment: (localId: string) => void; chatProject: Project \| null; assistantName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode }` (**adds `onStop`**). While `loading`, the `.vo-send` slot renders a Stop button (`onClick={() => onStop()}`, `background: C.coral`, not disabled, filled-square `◼`, `aria-label="Stop generating"`, `title="Stop"`); else the existing Send button (`↑`, gated by `canSend`). Textarea stays enabled during loading; the Enter handler stays gated by `canSend` (so Enter is a no-op while loading). | VA-T1 (composer) + **DEVIATION** (Stop button; Rule Anchors 2/3) | via `theoClient` (no new contract) | PROCEED |
| TC-5 | `components/TheoMain.tsx` (**ACTIVE**, modify) | `export interface TheoMainProps { t: ReturnType<typeof useTheoState>; mode: "full" \| "panel"; suppressNarrowHeader?: boolean }` (**unchanged**). The `<ChatView>` render gains `onStop={t.stop}`. No other change. | VA-T1 (main region) | via `theoClient` | PROCEED |
| TC-6 | `TheoSurface.tsx` (**REFERENCED**, unchanged) | `export interface TheoSurfaceProps { appContext?: AppContext; navSlot?: HTMLElement \| null; mainSlot?: HTMLElement \| null; getAccessToken?: () => Promise<string \| null>; suppressNarrowHeader?: boolean; newChatNonce?: number }` (**UNCHANGED**). No new prop: Stop is internal to `useTheoState`/`ChatView`, wired via `TheoMain` — no host signal needed. Confirmed by Read this turn. | VA-T1 (federated root) | n/a | PROCEED (no change) |

**Infra:** no `vite.config`/dependency change; no new env. `AbortController`/`AbortSignal` are standard DOM lib types (already available under `tsconfig.app.json`). `Sidebar.tsx`, `ProjectsView.tsx`, `ProjectDetail.tsx`, `ArtifactsView.tsx`, `ArtifactPanel.tsx`, `Customize.tsx`, `ui.tsx`, `icons.tsx`, `types.ts`, `data.ts`, `gateway.mock.ts` unchanged.

## F-P6 — Repository & active-surface grounding
Targets Read this turn, ACTIVE @ vault-theo `87e8118`: `useTheoState.ts`, `services/theoClient.ts`, `services/gateway.live.ts`, `components/ChatView.tsx`, `components/TheoMain.tsx`, and `TheoSurface.tsx` (all listed in the GCR with blob SHAs). Guardrails: gateway abstraction preserved (the signal routes through `theoClient` → `gateway.live`); no browser→model call; **no `localStorage`/`sessionStorage`** (`abortRef`/`userStoppedRef` are React refs); no Tailwind; no `reporting_*`. Reused-unchanged: the whole B9 streaming path and the `.vo-send` slot styling. Typecheck verified this turn (overlay onto scratch `src` → `tsc --noEmit` exit 0 → `src` reverted).

## F-P7 — Gap Register
Vocabulary: PROCEED / PRE-LAND / ESCALATE / NO-GAPS.

| Gap | Description | Disposition |
| --- | --- | --- |
| **G-1** | **Locked-design entry-point coverage.** The locked design states the `newChat()` abort "also covers selectRecent/startInProject/deleteConversation/newChatNonce which call newChat()". At HEAD, `deleteConversation` and the host `newChatNonce` effect DO funnel through `newChat()`, but `selectRecent()` and `startInProject()` reset the thread **inline** and do **not** call `newChat()`. Left as-literally-worded, switching chats mid-stream via a Recents click or a project "Start a chat" would NOT abort the in-flight stream, so its late `patchLastAssistant` deltas could bleed onto the newly-loaded thread's last assistant turn (cross-thread patch). | **PROCEED** — faithful to the design's stated *intent* ("covers selectRecent/startInProject"), this VEP adds `abortRef.current?.abort();` at the top of `selectRecent()` and `startInProject()` as well as `newChat()`. This realizes the described behavior; it does not expand scope beyond the one changed file. Flagged for Codex/Walter visibility. |
| **G-2** | **Server persistence of a stopped turn is uncertain.** Aborting the fetch drops the request mid-stream; whether `theo_message_stream` persists the partial assistant turn (and how much) before the socket closes is a server-side behavior this FE pack does not control. The KEPT partial is therefore **client-side only** — on reload, the persisted thread may show the full server-completed turn, a truncated turn, or (if the server rolled back) no assistant turn. | **PROCEED** — v1 accepts client-side keep-partial as the Claude/ChatGPT parity behavior; reconciling reload with server persistence is a follow-up (a backend question, out of FE scope). No un-landed contract is cited. |
| **G-3** | **Standalone harness abort.** In the dev harness (no live backend) the stream path resolves the mock synchronously and emits the whole reply in one `onText`; there is no real in-flight fetch to abort, so Stop has nothing to cancel there. | **PROCEED** — harness-only; the live SWA (Walter's acceptance surface) exercises the real streaming fetch and the abort. |
| **G-4** | **No message-queuing.** Per the locked design, v1 does not queue a follow-up message while streaming; Enter stays gated by `canSend` (a no-op while loading), and Stop is the only in-stream action. | **PROCEED (intended)** — explicit v1 scope decision. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`.

## F-P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P7 walked; the visual deviation is cited + classified + anchored + Walter-authorized (F-P2); Architecture & boundary reconciliation present (F-P2); Gap Register present (G-1…G-4, all PROCEED). CCT locked (6 rows, full interfaces; `ChatViewProps` gains `onStop`; `TheoMainProps`/`TheoSurfaceProps` pasted literal though unchanged; `useTheoState` return gains `stop`). Validated this turn (`tsc --noEmit` exit 0 against a scratch overlay of `src`; `src` reverted). On Codex APPROVAL, Pass 3 commits the five files and Walter redeploys the Theo SWA → **Stop generating end-to-end**: while Theo streams, press Stop to abort, keep the partial reply, and resume typing.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-FE-Stop-Generating-Pass-1-VEP/Theo_1B_FE_Stop_Generating_VEP.md" --repo-root .
PASS
```

*End of FE Stop-Generating Pass-1 Frontend VEP (plan only).*
