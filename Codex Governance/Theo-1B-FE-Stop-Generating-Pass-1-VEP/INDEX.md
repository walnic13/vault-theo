# Codex Governance Package — Theo 1B FE "Stop generating" Pass-1 VEP

- **Main artifact:** `Theo_1B_FE_Stop_Generating_VEP.md` — Pass-1 Frontend VEP (plan only). Reviewer = Codex (Pass 2). FE-VEP shape: GCR + Rule Anchor Table + F-P1…F-P8 + CCT + Mechanical lint block.
- **Microstep:** a Claude/ChatGPT-style **Stop generating** control. While Theo is streaming, the Send button becomes a **Stop** button that aborts generation, KEEPS the partial reply, and re-enables the composer. Composer textarea stays editable while streaming. No message-queuing in v1.
- **No backend, no migration, no new contract** — abort is a pure client-side `AbortController` on the already-deployed B9 `theo_message_stream` streaming fetch (and the one-shot `theo_message` fallback). Server-side the request is dropped mid-flight; no cancel endpoint.
- **Proposed source (`proposed-src/theo/`)** — 5 modified, 0 new:
  - `useTheoState.ts` — `abortRef`/`userStoppedRef` refs; per-turn `AbortController` in `send()`; `{ signal }` into the stream call; abort-aware `catch` (keep-partial on user Stop; do-nothing on switch-abort; skip the real-error rollback in both); `finally` clears the refs; new `stop()`; `abortRef.current?.abort()` at the top of `newChat`/`selectRecent`/`startInProject`; `stop` exposed in the return object.
  - `services/theoClient.ts` — `sendMessageStream(req, handlers, opts?)` passthrough of `opts` (`{ signal? }`).
  - `services/gateway.live.ts` — `sendMessageStream`/`sendMessage` gain `opts?: { signal?: AbortSignal }` and attach `opts?.signal` to their fetch inits (stream + one-shot fallback).
  - `components/ChatView.tsx` — adds required `onStop` prop; while `loading` renders a Stop button (coral, filled-square `◼`, `aria-label="Stop generating"`, never disabled) in the `.vo-send` slot; textarea stays editable; Enter stays gated by `canSend`.
  - `components/TheoMain.tsx` — passes `onStop={t.stop}` into `<ChatView>`.
  - `TheoSurface.tsx` is UNCHANGED (no new prop needed) — Read this turn to confirm; carried in the GCR/CCT for grounding only, not shipped in `proposed-src/`.
- **Classification:** VISUAL-AUTHORITY-DEVIATION (the Stop button is additive UI not in VA-T1, whose composer has only a Send button disabled while loading; cited + classified + Rule-Anchored per FE Governor; Walter = exemption authority).
- **Design-accuracy flag (G-1):** the locked design assumed `selectRecent`/`startInProject` route through `newChat()`; at HEAD they do not, so this pack adds the abort call to those two entry points as well, to realize the design's stated switch-abort intent and avoid a cross-thread partial-patch. Flagged for Codex/Walter.
- **Validation this turn:** overlaid `proposed-src/theo/` onto a scratch copy of `src` → `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`, exit 0); `src` reverted (package carries only `proposed-src/`). Microstep lint → PASS.
- **Currency:** vault-theo HEAD `87e8118ac72a5eb96f9e779116978a3f5a81f384`.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Pass 3 apply to `development` + Walter redeploys the Theo SWA.
