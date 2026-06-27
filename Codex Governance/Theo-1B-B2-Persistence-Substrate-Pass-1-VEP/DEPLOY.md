# DEPLOY — Theo B2 Persistence Substrate (Azure execution)

> Deploy package for Walter. Apply **only after Codex APPROVES** (done — `6eeafcd`). Schema + RLS + Blob container. No handler, no dependency, no `reporting_*` change.

## Step 1 — Run the migration (Postgres)
Azure Portal → the **`vaultgpt`** Azure Database for PostgreSQL → **Query editor** (or `psql`), connected as the **migration-capable role** (not `pgadmin_vault`, not the app role). Open **`b2_migration.sql`** in this folder, copy the whole file, paste, and run.

- Plain PostgreSQL; **no `BEGIN`/`COMMIT`** in the script (run as-is). Idempotent — safe to re-run.
- Creates 7 `theo_*` tables, enables RLS + 4 ownership policies each (28 total), and 4 `_exists_unscoped` SECURITY DEFINER helpers + grants.
- Uses `auth.uid()` and `gen_random_uuid()`, both already present in the shared instance (used by `reporting_*`).

## Step 2 — Create the Blob **container** (NOT a storage account)
`theo-content` is a **container** inside a storage **account** — container names allow hyphens; storage-account names do **not** (lowercase letters + numbers only). Do **not** create a storage account named `theo-content`.

- **Preferred:** open an **existing** storage account (check the **Vault-Origin** resource group) → **Containers** → **+ Container** → name **`theo-content`**, access **Private**.
- **Or** create a dedicated account first with a valid name (e.g. `vaultgpttheo` — lowercase, no hyphens), then add the **`theo-content`** container inside it.

(No blobs written until B4; B2 just needs the container to exist as the `blob_container` pointer target. B4 wires the account access via managed identity + `Storage Blob Data Contributor`.)

## Step 3 — Tell Claude Code
Reply "B2 deployed" and I'll run the read-only verification (`b2_verify.sql`) against the instance and capture the result under `.local/`:
- 7 `theo_*` tables present,
- every table `rowsecurity = true` with **4** policies,
- 4 `_exists_unscoped` helpers present.

Then I author the schema-doc Role-C (update vault-theo `spec/THEO_AZURE_POSTGRES_SCHEMA.md` from SKELETON → **DEPLOYED** with this DDL) and we move to **B3** (persist conversations/messages + wire the gateway to save turns).

## Files
- `b2_migration.sql` — the migration (byte-identical to the VEP `§B2-DDL`). **Run this.**
- `b2_verify.sql` — read-only checks (Claude Code runs post-deploy; safe `SELECT`s only).
