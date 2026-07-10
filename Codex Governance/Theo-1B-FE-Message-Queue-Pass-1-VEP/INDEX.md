# Codex Governance Package — Theo 1B FE "Queue next message" Pass-1 VEP

- **Main artifact:** `Theo_1B_FE_Message_Queue_VEP.md` — Pass-1 Frontend VEP (plan only). Reviewer = Codex (Pass 2). FE-VEP shape: GCR + Rule Anchor Table + F-P1…F-P8 + CCT + Mechanical lint block.
- **Microstep:** a Claude/ChatGPT-style **queue-the-next-message** affordance, building on the shipped Stop button. While Theo is streaming, submitting a message (Enter) does not interrupt the reply — it is **queued** (text-only, v1) and shown as a cancelable **"Queued" chip** above the composer; it **auto-sends when the current turn ends** (normal completion or user Stop). One pending message; queuing again replaces it.
- **No backend, no migration, no new contract** — pure client-side state on the existing B9 streaming path; reuses `send(textArg?)` to flush the queued text.
- **Proposed source (`proposed-src/theo/`)** — 3 modified, 0 new:
  - `useTheoState.ts` — `queued` state + `queuedRef`; `send()` gains a "queue instead of send while `loading`" branch (captures the draft text, clears the draft, returns); a `useEffect([loading])` **flush** that auto-sends the queued text once the turn ends; discard-queue on a hard send error; `cancelQueued()`; `queued`/`cancelQueued` exposed in the return.
  - `components/ChatView.tsx` — adds `queuedText`/`onCancelQueued` props; a `canSubmit` gate so **Enter submits while streaming** (routing to the queue); renders the cancelable "Queued" chip above the composer. Send/Stop buttons unchanged.
  - `components/TheoMain.tsx` — passes `queuedText={t.queued}` and `onCancelQueued={t.cancelQueued}` into `<ChatView>`.
  - `TheoSurface.tsx` UNCHANGED (no new prop) — Read this turn to confirm; carried in the GCR/CCT for grounding only, not shipped in `proposed-src/`.
- **Classification:** VISUAL-AUTHORITY-DEVIATION (the Queued chip + queue-while-streaming behavior are additive UI not in VA-T1, whose composer has only a Send button disabled while loading; cited + classified + Rule-Anchored per FE Governor; Walter = exemption authority).
- **Validation this turn:** applied the three edits, `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`, exit 0), then reverted `src` (package carries only `proposed-src/`; CRLF-normalized). Microstep lint → PASS.
- **Currency:** vault-theo HEAD `c9673af87462c16c0f8e3970322b47cff50f7581`.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Pass 3 apply to `development` + Walter redeploys the Theo SWA.
