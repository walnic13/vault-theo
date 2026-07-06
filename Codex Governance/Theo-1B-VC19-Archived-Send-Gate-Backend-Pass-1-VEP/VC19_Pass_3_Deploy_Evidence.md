# VC-19 Archived-Thread Write-Gate — Pass 3 Deploy Evidence

**Feature:** VC-19 — reject a NEW message (send or forward-in) into an archived channel with **409 `CONVERSATION_ARCHIVED`**. Two MODIFY handlers; no migration.
**VEP:** `Theo_1B_VC19_Archived_Send_Gate_Backend_VEP.md` — **Codex APPROVED** (Pass 2, HEAD `df466ed`; lint PASS; `node --check` clean on both).
**Authority:** Orchestration §1E / DR-T7 (deploy to `vaultgpt-func-chat` only). **No migration** (`theo_chat_threads.archived_at` shipped in VC-16). **Date:** 2026-07-06.

---

## 1. Sequence
1. **No migration** — the gate reads the existing `theo_chat_threads.archived_at` (VC-16). Pre-deploy confirmation: the two live baselines were captured and **byte-match** the deployed VC-13 source I grounded against (send 9307 B, forward 7747 B; neither carried the `CONVERSATION_ARCHIVED` marker).
2. **Claude Code deployed** via Kudu VFS surgical PUT (ARM bearer; no token/secret logged):
   - overwrite `theo_chat_send_message/index.js` → **204**; `theo_chat_forward_message/index.js` → **204**.
   - **Baselines** captured before overwrite (rollback copies retained); **get-back** of both re-fetched and `diff` (modulo CRLF) **byte-matches** the approved package source, and each now carries exactly one `CONVERSATION_ARCHIVED` marker.
   - `function.json` UNCHANGED for both (not re-deployed).
3. Restart → inventory **17 → 17** (MODIFY only; no new function). Both routes present.

## 2. Authenticated golden curls (az-login token for `api://4e1a1e31-…`, as `wmansfield@vault-tax.com`; structural only — no OIDs/bodies)

End-to-end against two disposable solo channels created by the caller — **A** (active) and **Z** (then archived) — plus seed messages `mA` (in A) and `mZ` (in Z). No real teammate/thread mutated.

| # | Check | Expected | Result |
| - | ----- | -------- | ------ |
| a | `POST send_message` bad `thread_id` | 400 | **400** `INVALID_REQUEST` |
| b | `POST send_message` into ACTIVE A | 201 | **201** (regression — gate does not affect active threads) |
| c | `POST archive_channel` Z | 200 | **200** |
| d | `POST send_message` into ARCHIVED Z | 409 | **409** `CONVERSATION_ARCHIVED` |
| e | `POST forward_message` mA → ACTIVE A | 201 | **201** (regression) |
| f | `POST forward_message` mA → ARCHIVED Z | 409 | **409** `CONVERSATION_ARCHIVED` |
| g | `POST forward_message` mZ (lives in archived Z) → ACTIVE A | 201 | **201** (forwarding OUT of an archived channel stays allowed) |
| h | `GET list_messages?threadId=Z` (archived) | 200 | **200** (reading archived history unaffected) |

All paths behave per the VEP. The 409 rides the existing `isKnown` re-map (no new `catch` branch). **DM note:** the gate can never fire on a DM — `theo_chat_archive_channel` rejects any non-channel, so `archived_at` is only ever set on a channel; a DM always passes (structurally covered, no separate live curl needed since a DM requires a second identity).

**Residue:** two disposable channels ("VC-19 verify A/B" — Z now archived) owned by the caller — harmless, archivable via VC-16.

## 3. Boundary
No migration (the column pre-exists). No `reporting_*`/monolith/sidecar write. RLS unchanged — the `theo_chat_message_insert` WITH CHECK is state-agnostic; the archived gate is an application-layer cooperative write-gate layered on the unchanged membership boundary. No `SECURITY DEFINER`. No message-shape change. `function.json` unchanged for both handlers.

## 4. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 `read / send messages` row — add the 409 `CONVERSATION_ARCHIVED` note for send + forward. No Schema delta (the `archived_at` column already documented §3). Authored alongside as `Theo_1B_VC19_API_Spec_RoleC.md`.
- **VC-19-FE:** disabled composer + "This channel is archived" banner + 409→friendly-message mapping (vault-origin microstep).
