# VC-13.1 — Forward carries attachment + gif — Pass 1 Backend VEP (index)

**Regime:** Theo backend (lint-gated; Codex Pass 2). **Pass:** 1 (plan-only). **Repo:** `vault-theo` `development` @ `e452a71`. **Lint:** PASS.

## Microstep
Correctness fix (discovered + disclosed in the VC-10 VEP §P2.5): `theo_chat_forward_message` copied only `body`, so forwarding an attachment-only (VC-9) or gif-only (VC-10) message (body NULL) **violated `theo_chat_messages_body_ck`** (400/500), and a captioned attachment/gif forward silently **dropped** the attachment/gif. VC-13.1 makes the forward **carry the source's `attachment_*` + `gif_*`** into the copy and **project** them (`attachment`/`gif`, raw blob_path never exposed).

## Files
| File | Role |
| ---- | ---- |
| `Theo_1B_VC13_1_Forward_Rich_Message_Backend_VEP.md` | Pass 1 VEP: GCR + Rule Anchor + P1–P8 + §SM + §HG.1 + §API-SPEC + §DEPLOY + §CURL. |
| `theo_chat_forward_message.index.js` (MODIFY) | Deployable — source read + INSERT + RETURNING carry attachment_*/gif_*; project attachment/gif; drop raw cols. |
| `theo_chat_forward_message.function.json` | UNCHANGED (byte-exact deploy). |
| `deterministic_note_to_codex.md` | Short pointer Walter forwards to Codex. |

## Key facts
- **No migration, no schema/RLS change** — the columns shipped in VC-9/VC-10. Primary Reference = deployed VC-19 forward (blob `251853a0`).
- **Byte-verified delta** = only the source SELECT + INSERT/RETURNING carry + the attachment/gif projection + raw-column deletes. Archived gate, membership, deleted-source 400, seq-retry, error map all preserved. `node --check` clean; inlined code byte-matches the artifact.
- Copy references the ORIGINAL sender's blob; download stays message-membership-gated (not owner-gated). Gif copies the stored GIPHY URLs (no fresh GIPHY call).
- **No FE change** — the bubble already renders `attachment`/`gif` from `list_messages`.

## Pass 3 (on Codex APPROVE)
No migration. Claude Code deploys the one overwrite to `vaultgpt-func-chat` (inventory unchanged, 21) + golden curls (incl. the previously-broken attachment-only + gif-only forward → 201), then the Role-C (Pass 4) API-Spec §2.10 note.
