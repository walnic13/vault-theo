# DEPLOY — Theo B2 Persistence Substrate (Azure execution)

> Deploy package for Walter. Apply **only after Codex APPROVES** (done — `6eeafcd`). Schema + RLS + Blob container. No handler, no dependency, no `reporting_*` change.

## Step 1 — Run the migration (Postgres)
Azure Portal → the **`vaultgpt`** Azure Database for PostgreSQL → **Query editor** (or `psql`), connected as the **migration-capable role** (not `pgadmin_vault`, not the app role). Open **`b2_migration.sql`** in this folder, copy the whole file, paste, and run.

- Plain PostgreSQL; **no `BEGIN`/`COMMIT`** in the script (run as-is). Idempotent — safe to re-run.
- Creates 7 `theo_*` tables, enables RLS + 4 ownership policies each (28 total), and 4 `_exists_unscoped` SECURITY DEFINER helpers + grants.
- Uses `auth.uid()` and `gen_random_uuid()`, both already present in the shared instance (used by `reporting_*`).

## Step 2 — Create the Blob container
Azure Portal → the `vaultgpt` **storage account** → **Containers** → **+ Container** → name **`theo-content`**, access level **Private**. (No blobs written until B4; B2 just needs the container to exist as the pointer target.)

## Step 3 — Tell Claude Code
Reply "B2 deployed" and I'll run the read-only verification (`b2_verify.sql`) against the instance and capture the result under `.local/`:
- 7 `theo_*` tables present,
- every table `rowsecurity = true` with **4** policies,
- 4 `_exists_unscoped` helpers present.

Then I author the schema-doc Role-C (update vault-theo `spec/THEO_AZURE_POSTGRES_SCHEMA.md` from SKELETON → **DEPLOYED** with this DDL) and we move to **B3** (persist conversations/messages + wire the gateway to save turns).

## Files
- `b2_migration.sql` — the migration (byte-identical to the VEP `§B2-DDL`). **Run this.**
- `b2_verify.sql` — read-only checks (Claude Code runs post-deploy; safe `SELECT`s only).
