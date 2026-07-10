# Theo 1B — FE "Queue next message" (submit while streaming; auto-send on turn end) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc --noEmit` green — validated this turn by applying the three edits, typechecking, then reverting `src`) and Walter redeploys the Theo SWA. **Microstep:** a Claude/ChatGPT-style **queue the next message** affordance, built on the shipped Stop button. While Theo is streaming, submitting a message (Enter) does NOT interrupt the reply — it is **queued** (text-only, v1), shown as a cancelable **"Queued" chip** above the composer, and **auto-sends when the current turn ends** (normal completion or user Stop). One pending message; queuing again replaces it. Behind the state owner + the single `theoClient` boundary; no new backend, no migration, no browser storage — the flush reuses the existing `send(textArg?)`.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (FE Pass 1 plan)
Turn issued against HEAD: `c9673af87462c16c0f8e3970322b47cff50f7581` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack, building on the shipped Stop-generating change (HEAD `c9673af`). **Visual-authority DEVIATION** turn: the "Queued" chip and the queue-while-streaming behavior are additive UI not present in VA-T1 (the reference composer has a single Send button, merely *disabled* while `loading`, and no queue affordance — `frontend/theo-frontend-reference.jsx`, Read this turn). Per FE Governor a planned visual deviation is valid when **cited + classified (VISUAL-AUTHORITY-DEVIATION) + Rule-Anchored**, with **Walter** as the exemption authority (he directed the queue affordance). No new backend: the queued message is flushed through the already-deployed B9 streaming path via the existing `send(textArg?)`. The three modified files were edited this turn, `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`) passed (exit 0), and `src` was reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§UI-Authority Reconciliation; §exemption authority) | `Grep("A planned visual deviation must be cited and classified" / "Walter is the execution")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5 GCR + Rule Anchor Table) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `07e8dabbccc1d0394a493c6a6b358e38253e4f4b` |
| 3 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT / three locked surfaces; §5 allowed deltas) | `Grep("three locked surfaces" / "service-module/gateway abstraction")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 4 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (composer / Send-button region) | `Grep("vo-send" / "onSend" / "canSend")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 5 | ACTIVE (modify — state owner) — `src/theo/useTheoState.ts` (`loading`, refs cluster, `send`, `stop`, return object) | `Read(full)` this turn | `9d51f7743ef74fe0014fc23f071c32de5e9080c5` |
| 6 | ACTIVE (modify) — `src/theo/components/ChatView.tsx` (props interface; Enter gate; queued chip) | `Read(full)` this turn | `3538e3173a804874f9a28977c05f291196add0dc` |
| 7 | ACTIVE (modify) — `src/theo/components/TheoMain.tsx` (ChatView wiring) | `Read(full)` this turn | `317a3da67e7407f2fb7867bfa96338912a8a3b89` |
| 8 | REFERENCED (unchanged — confirm no new prop) — `src/theo/TheoSurface.tsx` (`TheoSurfaceProps`) | `Read(full)` this turn | `38c5d6a5420618e7ae23c8c7eccb1f52b895b3af` |

No ChatGPT advisory cited (§6). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §UI-Auth | "A planned visual deviation must be cited and classified" | §F-P2 — the Queued chip + queue behavior classified VISUAL-AUTHORITY-DEVIATION + anchored |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §authority | "Walter is the execution, runtime-acceptance, and exemption authority" | §F-P2 — Walter directed the queue affordance (exemption authority) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — each CCT row carries full interface + VA-id + contract dependency |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" | §F-P2 — the flush reuses `send(textArg?)` → `theoClient` (ALLOWED DELTA; no new call) |
| frontend/theo-frontend-reference.jsx | VA-T1 composer | "onClick={() => send()}" | §F-P2 — VA-T1 composer's single Send button is `disabled={!draft.trim() \|\| loading}` (no submit while loading, no queue affordance); queue-while-streaming + the chip are additive |
| src/theo/components/ChatView.tsx | canSend gate | "const canSend = (!!draft.trim() || hasReady) && !loading && !uploading;" | §F-P4/TC-2 — a new `canSubmit` (drops `!loading`) lets Enter submit while streaming → `send()` queues |
| src/theo/useTheoState.ts | send guard | "if (loading || uploading) return;" | §F-P4/TC-1 — replaced by an `uploading` guard + a `loading` → queue branch |
| src/theo/useTheoState.ts | send finalize | "} finally { setLoading(false); abortRef.current = null; userStoppedRef.current = false; }" | §F-P4/TC-1 — turn end → the flush effect auto-sends the queued text |
| src/theo/components/TheoMain.tsx | ChatView wiring | "onDraftChange={t.setDraft} onSend={t.send} onStop={t.stop}" | §F-P4/TC-3 — gains `queuedText={t.queued} onCancelQueued={t.cancelQueued}` |
| src/theo/TheoSurface.tsx | surface props | "export interface TheoSurfaceProps {" | §F-P5/TC-4 — UNCHANGED; no new TheoSurface prop is required |

---

## F-P1 — Feature identification
**Microstep:** a **queue the next message** affordance on the Theo chat, matching the Claude / ChatGPT idiom, built on the shipped Stop button. Today, while a reply streams, Enter is gated by `canSend` (a no-op while `loading`) — a user who thinks of their next question must wait for the current reply to finish before typing it in. This microstep adds, purely client-side:
1. **Queue on submit-while-streaming** — while `loading`, pressing Enter with draft text does not interrupt the current reply; it stores the text as the single pending **queued** message and clears the draft (so the user sees it was accepted).
2. **Cancelable chip** — a small **"Queued"** chip renders above the composer showing the pending text, with an ✕ to cancel it before it fires.
3. **Auto-send on turn end** — when the current turn ends (normal completion OR a user Stop), the queued message is automatically sent. A hard send error discards the queue (the failed turn's own text is restored to the draft by the existing error path).

The whole feature is client-side state on the existing streaming path; the flush reuses the existing `send(textArg?)`. **No backend change, no migration, no new contract.**

## F-P2 — Architecture & boundary reconciliation (UI Authority + service boundary)
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (composer) | The reference composer gates submission on `canSend` (disabled while `loading`) and has **no queue affordance**. This microstep, while `loading`, lets Enter submit (a new `canSubmit` gate that drops `!loading`) so `send()` can **queue** instead of send, and renders an additive **"Queued" chip** above the textarea. The Send button (not loading) and the Stop button (loading) are **unchanged**; all other composer chrome is preserved. This is a deliberate, additive departure from the reference — **cited, classified, and Rule-Anchored** per FE Governor, **authorized by Walter** (the exemption authority; he directed the queue affordance). | **VISUAL-AUTHORITY-DEVIATION** (Walter-authorized; Rule Anchors 2/3) |
| Gateway / service abstraction (Golden §5) | The flush sends the queued text by **reusing the existing `send(textArg?)`** (which already routes through `theoClient` → `gateway.live`). No new network call, no new gateway method, no browser→model call. | ALLOWED DELTA (reuses the service-module/gateway abstraction) |
| State owner (`useTheoState`) | One new state (`queued`) + one ref (`queuedRef`), a queue branch in `send()`, a `useEffect([loading])` flush, a discard-on-error line, and a `cancelQueued()` handler. Presentational surfaces unchanged except the added `queuedText`/`onCancelQueued` props. | ALLOWED DELTA (behind the state owner + service boundary) |

No un-cited deviation. `TheoSurface.tsx` is UNCHANGED (no new prop). `theoClient.ts`/`gateway.live.ts` are UNCHANGED (the flush reuses `send`). All other surfaces unchanged.

## F-P3 — Backend / contract grounding
**No backend change, no migration, no new API row.** A queued message is flushed by calling the existing `send(queuedText)` when the current turn ends; that path already targets the deployed `theo_message_stream` (B9). Nothing new is sent to the server; there is no "queue" concept server-side.

## F-P4 — Component reference grounding
**State owner:** `useTheoState.ts` — a `queued: string | null` state + `queuedRef` mirror; `send()` computes `text`/`ready`/`uploading` then: `if (uploading) return;` → `if (loading) { if (text) { setQueued(text); queuedRef.current = text; setDraft(""); } return; }` (queue instead of send/interrupt) → else the existing send path. A `useEffect([loading])` **flush**: when `!loading && queuedRef.current`, it captures the text, clears `queued`/`queuedRef`, and calls `send(q)` (a fresh closure where `loading` is false, so it sends rather than re-queues). The real-error `catch` clears `queued`/`queuedRef` so a hard failure discards the follow-up (the failed turn's text is already restored to the draft). New `cancelQueued()`. **Surface:** `ChatView.tsx` adds `queuedText`/`onCancelQueued` props, a `canSubmit` gate (Enter submits while streaming), and the cancelable "Queued" chip. **Wiring:** `TheoMain.tsx` passes `queuedText={t.queued}`/`onCancelQueued={t.cancelQueued}`. Governing authority = VA-T1 (Walter-authorized deviation) + Golden Component Pack (§3 CCT, §5 abstraction) + the deployed B9 streaming path.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; required-before-optional; `on<Event>`; full TS interfaces.

| # | Module (ownership; ACTIVE/NEW) | Interface / behavior (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `useTheoState.ts` (**ACTIVE**, modify — state owner) | Adds `const [queued, setQueued] = useState<string \| null>(null)` and `const queuedRef = useRef<string \| null>(null)`. `send()`'s guard becomes `if (uploading) return;` then `if (loading) { if (text) { setQueued(text); queuedRef.current = text; setDraft(""); } return; }` before the existing `if (!text && ready.length === 0) return;`. New flush effect: `useEffect(() => { if (loading \|\| !queuedRef.current) return; const q = queuedRef.current; queuedRef.current = null; setQueued(null); void send(q); }, [loading])`. In the real-error `catch` (after the existing rollback): `queuedRef.current = null; setQueued(null);`. New `function cancelQueued() { queuedRef.current = null; setQueued(null); }`. Return object gains `queued` + `cancelQueued`. | VA-T1 (state owner; no direct surface) | none new — reuses the deployed B9 stream via `send()` | PROCEED |
| TC-2 | `components/ChatView.tsx` (**ACTIVE**, modify) | `export interface ChatViewProps { messages: Message[]; loading: boolean; error: string; draft: string; attachments: ComposerAttachment[]; attachmentsAvailable: boolean; onDraftChange: (s: string) => void; onSend: (text?: string) => void; onStop: () => void; queuedText: string \| null; onCancelQueued: () => void; onAddFiles: (files: FileList \| File[]) => void; onAddPastedText: (text: string) => boolean; onRemoveAttachment: (localId: string) => void; chatProject: Project \| null; assistantName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode }` (**adds `queuedText`, `onCancelQueued`**). New `const canSubmit = (!!draft.trim() \|\| hasReady) && !uploading;`; the textarea Enter handler changes `if (canSend) onSend()` → `if (canSubmit) onSend()` (send() decides send-vs-queue by `loading`). A cancelable "Queued" chip renders above the composer when `queuedText` is non-empty (coral "Queued" label, truncated preview, ✕ `aria-label="Cancel queued message"` → `onCancelQueued()`). The visible Send button stays gated by `canSend`; the Stop button (loading) is unchanged. | VA-T1 (composer) + **DEVIATION** (Queued chip + queue-while-streaming; Rule Anchors 2/3) | via `theoClient` (no new contract) | PROCEED |
| TC-3 | `components/TheoMain.tsx` (**ACTIVE**, modify) | `export interface TheoMainProps { t: ReturnType<typeof useTheoState>; mode: "full" \| "panel"; suppressNarrowHeader?: boolean }` (**unchanged**). The `<ChatView>` render gains `queuedText={t.queued}` and `onCancelQueued={t.cancelQueued}`. No other change. | VA-T1 (main region) | via `theoClient` | PROCEED |
| TC-4 | `TheoSurface.tsx` (**REFERENCED**, unchanged) | `export interface TheoSurfaceProps { appContext?: AppContext; navSlot?: HTMLElement \| null; mainSlot?: HTMLElement \| null; getAccessToken?: () => Promise<string \| null>; suppressNarrowHeader?: boolean; newChatNonce?: number }` (**UNCHANGED**). No new prop: the queue is internal to `useTheoState`/`ChatView`, wired via `TheoMain`. Confirmed by Read this turn. | VA-T1 (federated root) | n/a | PROCEED (no change) |

**Infra:** no `vite.config`/dependency change; no new env; no `localStorage`/`sessionStorage` (`queuedRef` is a React ref). `services/theoClient.ts`, `services/gateway.live.ts`, and all other surfaces unchanged.

## F-P6 — Repository & active-surface grounding
Targets Read this turn, ACTIVE @ vault-theo `c9673af`: `useTheoState.ts`, `components/ChatView.tsx`, `components/TheoMain.tsx`, and `TheoSurface.tsx` (all listed in the GCR with blob SHAs). Guardrails: gateway abstraction preserved (the flush reuses `send()` → `theoClient` → `gateway.live`); no browser→model call; **no `localStorage`/`sessionStorage`**; no Tailwind; no `reporting_*`. Reused-unchanged: the whole B9 streaming path, the Stop button, and the `.vo-send` slot. Typecheck verified this turn (`tsc --noEmit` exit 0; `src` reverted).

## F-P7 — Gap Register
Vocabulary: PROCEED / PRE-LAND / ESCALATE / NO-GAPS.

| Gap | Description | Disposition |
| --- | --- | --- |
| **G-1** | **Queue fires after Stop.** Because the flush keys on the turn ending (`loading` → false), pressing **Stop** while a message is queued ends the current turn and then auto-sends the queued message. This is intended (the queued question "sends when the current turn ends"), and the user can ✕-cancel the chip before Stop to prevent it. | **PROCEED (intended)** — matches the "auto-send when the turn ends" model; cancelable. |
| **G-2** | **Attachments not queued (v1).** The queue captures draft **text** only. If files are staged while a reply streams, they remain in the composer (not queued); on flush, `send(q)` includes whatever attachments are staged at that moment (normally none, since the prior send cleared them). | **PROCEED (intended v1 scope)** — text-only queue; attachment-aware queuing is a follow-up. |
| **G-3** | **Single pending message.** Only one message queues; submitting again while one is pending replaces it (last-wins). No multi-item queue. | **PROCEED (intended)** — matches the Claude/ChatGPT single-pending idiom. |
| **G-4** | **Hard-error discard.** On a non-abort send failure, the queued follow-up is discarded (the failed turn's own text is restored to the draft by the existing error path) rather than auto-sent onto a failed turn. | **PROCEED** — predictable; avoids firing a follow-up after a failure. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`.

## F-P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P7 walked; the visual deviation is cited + classified + anchored + Walter-authorized (F-P2); Architecture & boundary reconciliation present (F-P2); Gap Register present (G-1…G-4, all PROCEED). CCT locked (4 rows, full interfaces; `ChatViewProps` gains `queuedText`/`onCancelQueued`; `TheoMainProps`/`TheoSurfaceProps` pasted literal though unchanged; `useTheoState` return gains `queued`/`cancelQueued`). Validated this turn (`tsc --noEmit` exit 0; `src` reverted). On Codex APPROVAL, Pass 3 commits the three files and Walter redeploys the Theo SWA → **queue end-to-end**: while Theo streams, type + Enter to queue the next question (shown as a cancelable chip), and it auto-sends when the current reply finishes or you Stop.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-FE-Message-Queue-Pass-1-VEP/Theo_1B_FE_Message_Queue_VEP.md" --repo-root .
PASS
```

*End of FE Message-Queue Pass-1 Frontend VEP (plan only).*
