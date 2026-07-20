# Theo FE Mobile-Composer — Pass-3 Execution Evidence

Executed against the Codex-APPROVED Pass-1 VEP (pkg @ `e24dad3`). Branch `development`.

## Changes applied (per F-P7)
**VA-T8 evolution (Role-C):**
- `artifacts/theo-voice-controls-reference.jsx`: added `ArrowUpGlyph` (bold stroke up-arrow); the composer **mic** and **send** buttons `34×34 borderRadius:10` → **40×40 `borderRadius:"50%"`** (circles); mic idle bg `transparent` → `C.bubble` (grey circle); send glyph `↑` → `<ArrowUpGlyph/>`. (The reference already placed mic left-of-send in the right cluster.)
- `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` §4B: VA-T8 sha256 re-registered `d97a5896…` → **`805c4bfb900bd8f6db07ab628b4887dc908d1e70d6de2f0fd1fc40e21f886049`** + evolution note (Walter-approved 2026-07-20).

**ChatView.tsx impl (VISUAL-AUTHORITY-MATCH to evolved VA-T8):**
- **#6b — mic moved + circular:** `MicButton` moved from the composer's left cluster into a **new right cluster beside send**; its button `34×34 borderRadius:10 transparent` → **40×40 `borderRadius:"50%"` `C.bubble`** (grey circle idle; coral-tinted recording preserved); transcribing placeholder matched.
- **#6a — circular send/stop:** send + stop buttons `34×34 borderRadius:10` → **40×40 `borderRadius:"50%"`**; send `↑` text → an inline **bold up-arrow SVG** (`strokeWidth 2.5`); coral fill preserved.
- **#5 — no Enter-send on narrow:** composer `onKeyDown` Enter-send gated with `!(… window.matchMedia("(max-width: 767.98px)").matches)` → newline on a phone; wide keeps Enter-send.

## Verification
- **`npx tsc --noEmit`**: CLEAN.
- **`vite build`**: GREEN (`built in ~6s`).
- VA-T8 reference sha256 recomputed (`sha256sum`) → matches the §4B registry entry.

## Deploy reach (IMPORTANT)
vault-theo `development` → the **salmon-river** SWA rebuilds. Both the dev Origin ("Vault Dev" / proud-field) **and prod `vault-origin.com`** (kind-tree) federate Theo from salmon-river (neither sets `VITE_THEO_REMOTE_URL`), so this composer change goes live on **both** — there is no separate Theo prod promotion (documented topology). This is the normal Theo-FE deploy path.

## Walter verification (on the phone / narrow, "Vault Dev")
1. The composer **send** is a coral **circle** with a bold up-arrow (was a rounded square + `↑`).
2. The **mic** is a **grey circle immediately left of send** (moved from the left cluster).
3. Pressing **Enter inserts a newline** (no send) — send only via the button.
4. Dictation still records → transcribes into the draft; wide/desktop Enter still sends.
Screenshot vs the evolved VA-T8 + acceptance note = Pass-3 Visual Acceptance Evidence.

## Boundary
No prop/contract change; dictation still calls `theo_transcribe_audio` (API §2.11) via the existing handlers; inline-style preserved (no Tailwind); no storage; no `corporate-reporting`/`reporting_*` change. Attach button + no model-pill unchanged (Walter).
