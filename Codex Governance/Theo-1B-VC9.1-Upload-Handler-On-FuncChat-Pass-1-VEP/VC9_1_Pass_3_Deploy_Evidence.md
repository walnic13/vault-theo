# VC-9.1 Deploy `theo_create_attachment_upload` to func-chat — Pass 3 Deploy Evidence

**Feature:** VC-9.1 — host-parity: deploy the approved `theo_create_attachment_upload` (B8b `bc1aa7c5`) byte-identically to `vaultgpt-func-chat`.
**VEP:** `Theo_1B_VC9_1_Upload_Handler_On_FuncChat_VEP.md` — **Codex APPROVED** (Pass 2, HEAD `66c8451`; lint PASS; `node --check` clean; byte parity confirmed by Codex).
**Authority:** Orchestration §1E / DR-T7 (deploy to `vaultgpt-func-chat` only). **No migration. No Role-C** (contract already in API Spec §2.10). **Date:** 2026-07-07.

---

## 1. Deploy (Kudu VFS surgical PUT; ARM bearer; no token logged)
- Confirmed **absent** (404) on func-chat before the PUT.
- NEW `theo_create_attachment_upload/{index.js,function.json}` → **201/201**.
- **Get-back** byte-matches the approved package source (`bc1aa7c5`).
- Restart → inventory **20 → 21**; `theo_create_attachment_upload` registered. The monolith copy is untouched.

## 2. Authenticated golden curls (az-login token for `api://4e1a1e31-…`, as `wmansfield@vault-tax.com`; structural — no OIDs/bodies)

| # | Check | Expected | Result |
| - | ----- | -------- | ------ |
| 1 | `POST theo_create_attachment_upload` `{filename:"vc91.txt", content_type:"text/plain"}` on func-chat | 201, owner-scoped blobKey | **201**; `blobKey = attachments/<caller-oid>/<uuid>`; `uploadUrl` host `vaultgptstorage01.blob.core.windows.net` (**func-chat MI mints a user-delegation SAS**) |
| 2 | PUT bytes to the issued `cw` SAS (`x-ms-blob-type: BlockBlob`) | 201 | **201** (**the issued SAS actually works — func-chat MI create+write path confirmed**) |
| 3 | `POST theo_create_attachment_upload` `{content_type:"application/zip"}` | 400 | **400** `UNSUPPORTED_MEDIA_TYPE` (regression) |

The whole chat attachment flow is now on ONE host: **upload (VC-9.1) + send + list + download (VC-9)** all on `vaultgpt-func-chat` — the single base (`VITE_CHAT_API_BASE_URL`) the FE client targets. No cross-app auth/CORS surface.

## 3. Boundary
No migration; no DB/RLS touch (stateless SAS issuer). Deploy target `vaultgpt-func-chat` only; monolith copy untouched (Theo B8 still uses it). Blob access via func-chat MI (Storage Blob Data Contributor). No new external system. No Role-C (route + shape already in API Spec §2.10).

**Residue:** one test blob at `attachments/<caller-oid>/…` (harmless).

## 4. Follow-ups
- **VC-9-FE** — now unblocked as a clean single-host flow (upload → PUT → send-with-attachment → list → download), all on `vaultgpt-func-chat`.
