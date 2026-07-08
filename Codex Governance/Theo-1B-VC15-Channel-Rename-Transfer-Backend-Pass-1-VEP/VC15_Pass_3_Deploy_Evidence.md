# VC-15 Channel Rename + Transfer-Admin (+ admin-surface hardening) — Pass 3 Deploy Evidence

**Feature:** VC-15 — `theo_chat_rename_channel` + `theo_chat_transfer_admin` (NEW), + R2 hardening of `theo_chat_add_member`/`theo_chat_remove_member` (MODIFY).
**VEP:** `Theo_1B_VC15_...VEP.md` — **Codex APPROVED** (Pass 2 re-review R2, HEAD `a995f2f`; lint PASS; `node --check` ×4 clean).
**Authority:** Orchestration §1E / DR-T7 (`vaultgpt-func-chat` only). **No migration.** **Date:** 2026-07-05.

---

## 1. Deploy (Kudu VFS surgical writes; ARM bearer, no secret logged)
- Baselines confirmed byte-identical before overwrite (add_member/remove_member = VC-1.2 deployed); rollback copies captured.
- New: `theo_chat_rename_channel/{index.js,function.json}` → **201/201**; `theo_chat_transfer_admin/{index.js,function.json}` → **201/201**.
- Overwrite (R2): `theo_chat_add_member/index.js` → **204**; `theo_chat_remove_member/index.js` → **204**.
- Restart → function inventory **12** (prior 10 + `theo_chat_rename_channel` + `theo_chat_transfer_admin`).

## 2. Authenticated golden curls (az-login token, as `wmansfield@vault-tax.com`; structural only)

| # | Check | Result |
| - | ----- | ------ |
| — | create verify channel → `thread.admin_oid == caller` | **true** |
| 1 | `rename_channel` (admin) | **200** |
| 2 | `transfer_admin` → a current member | **200** |
| 3 | **R2:** OLD admin `rename_channel` after transfer | **403** |
| 4 | **R2:** OLD admin `add_member` after transfer | **403** |
| 5 | `transfer_admin` to self | **400** |
| 6 | `transfer_admin` to a non-member | **400** |
| 7 | `rename_channel` on a non-participant thread | **404** |

Checks 3–4 confirm the execution-time admin guard across the whole surface: once admin is transferred, the former admin can neither rename nor add/remove. Bogus non-person UUIDs used for the member/target so **no real teammate or real channel was mutated**; residue: two throwaway verify channels (archivable once VC-16 lands).

## 3. Boundary
No migration; no `reporting_*`/monolith/sidecar write; RLS unchanged (member_oids preserved by rename/transfer; the guarded add/remove UPDATEs keep the caller a member → WITH CHECK holds).

## 4. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 gains `theo_chat_rename_channel` / `theo_chat_transfer_admin` (authored alongside).
- **VC-15-FE:** rename input + transfer-admin control in the Members panel (admin-only).
- **VC-16:** leave + archive (the one migration).
