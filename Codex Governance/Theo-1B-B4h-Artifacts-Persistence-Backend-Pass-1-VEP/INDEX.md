# Codex Governance Package — Theo 1B B4h Artifacts Persistence (backend) Pass-1 VEP

- **Main artifact:** `Theo_1B_B4h_Artifacts_Persistence_Backend_VEP.md` — Pass-1 backend VEP (plan + complete handlers). Reviewer = Codex (Pass 2).
- **Microstep:** Tier **B4h (backend)** — make artifacts persistent (Walter-directed: "let's knock out artifacts persistence"). The deployed `theo_artifacts` + `theo_artifact_versions` tables (B2) are currently unused; the FE holds artifacts in memory only. Four GREENFIELD handlers:
  - `theo_upsert_artifact` (POST) — create-or-add-version, keyed by `(created_by, lower(title))` (mirrors the FE `upsert()`); writes version content to Blob, bumps `current_version`.
  - `theo_list_artifacts` (GET, optional `?conversationId`) — owner's artifacts, metadata only.
  - `theo_get_artifact` (GET `?artifactId`) — artifact + all versions, content read back from Blob.
  - `theo_delete_artifact` (POST) — permanent; version rows cascade, version blobs best-effort deleted.
- **Content storage:** version body in Blob (`theo-content`), **server-side via managed identity** — matches the deployed `theo_artifact_versions` Blob-pointer schema exactly. **No migration, no schema change.**
- **Primary Reference:** deployed `theo_finalize_attachment` pair (B8h) — the one deployed handler combining owner-scoped DB writes + managed-identity Blob helpers; inlined byte-verbatim (§SM/§SM-FJ). The four handlers reuse its Blob helper block byte-identical (EXACT).
- **Gateway handlers untouched** (`theo_message`/`theo_message_stream`).
- **Validation:** all four `node --check` clean; function.json JSON-valid; microstep lint → PASS; HEAD `3a480dd`.
- **Pairs with B4h-FE:** persist-on-ingest during `send`, load-on-mount (Artifacts gallery) + reload (re-derive from persisted `[[ARTIFACT]]` blocks, link by title), `ArtifactPanel` version content.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Walter deploys 4 functions → Claude Code golden curls → API-Spec Role-C → B4h-FE.
