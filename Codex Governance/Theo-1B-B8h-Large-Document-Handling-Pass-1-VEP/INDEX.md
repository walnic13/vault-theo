# Codex Governance Package — Theo 1B B8h Large-Document Handling — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B8h_Large_Document_Handling_VEP.md` (plan only).
- **Deploy files:** `theo_finalize_attachment.index.js` (Level 2: PDF >3MB → pdf-parse extract-class) + `theo_message.index.js` (Level 1: inject by ingestion_class + tighter native budget) + unchanged function.jsons.
- **Fixes:** large/text-dense PDFs timed out ("Couldn't reach the assistant") because they injected as huge document blocks. Now a >3MB PDF is text-extracted (pdf-parse) + budgeted → fast + answerable; small PDFs stay native. No schema change (reuses B8c columns).
- **Dep (PRE-LAND, Kudu):** `pdf-parse`. **Walter-auth:** "proceed with levels 1 and 2" (§WALTER-AUTH).
- **Primary refs:** deployed B8c finalize (b829d98d) + B8d-MI-fix theo_message (9912d297); diff-verified additive (§CHANGESET).
- **Pipeline:** Pass 1 (this) → Codex Pass 2 → Walter Kudu install + redeploy 2 handlers → Claude golden curls.
- **HEAD:** vault-theo `ec73341819df3974dd43880e4af963fddc4b3423`. **Lint:** PASS.
