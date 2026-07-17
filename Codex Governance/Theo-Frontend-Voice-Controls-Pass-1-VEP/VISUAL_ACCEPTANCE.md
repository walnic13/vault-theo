# Voice Controls — Pass-3 Visual Acceptance Evidence (F-E1)

Closes the Theo Voice Controls FE microstep (Codex-APPROVED VEP `6680ac5`; VA-T8).

- **Surface vs authority:** the implemented controls reproduce **VA-T8** faithfully — the dictation mic in the composer action row (idle mic → recording tray with waveform + tabular-nums timer + "up to 7:00" + Cancel → coral-tinted Stop) and the per-reply **Read aloud** control (idle speaker text-button → playing equalizer). Warm Vault palette (`C`), `SANS`, 34×34 action-button geometry — no redesign. Walter's screenshots (dev SWA, `salmon-river`) show both controls in place, matching VA-T8.
- **Walter acceptance (2026-07-17):** "okay, that works great, mic and read aloud." Dictation records → transcribes → drops into the composer; Read aloud plays the reply in the default neural voice (`en-US-AvaMultilingualNeural`). End-to-end verified on the dev SWA.
- **Backends:** `theo_transcribe_audio` (Whisper) + `theo_synthesize_speech` (Azure AI Speech), DEPLOYED + golden-verified on `vaultgpt-func-chat`, in-tenant (Switzerland North).
- **Pass-3 routing resolution (G-APIBASE):** the FE routes the two voice calls to a dedicated `chatBase` (`VITE_CHAT_FUNCTIONS_URL` → `vaultgpt-func-chat`), mirroring the `streamBase`/func-stream pattern — because `apiBase` is the monolith (`func-premium`) which does not host the voice handlers. func-chat CORS was extended with the `salmon-river` (vault-theo-dev) origin. Shipped `4ed20bc`.
- **F-E2 (Pending Role-C):** **NO-DRIFT** — the living authority docs are already correct (API Spec §2.11 states the routes are on func-chat; VA-T8 is registered in §4B; Phase 1B Plan Tier Voice is current). The `chatBase` routing is captured in code + this evidence record; no governed-document edit is required.
