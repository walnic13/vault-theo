# Vault Access-Policy Engine — Stage 0 Design (Pass-1 VEP, plan-only)

Plan-only design spec (no code/migration lands this turn). Stage 0 of the Vault memory architecture ([[VAULT_MEMORY_ARCHITECTURE.md]] §10 build order, §4 the engine, §A amendments 1/2) — the **foundational** components that everything downstream traces to:
1. **The `theo_user_memory` ↔ substrate/lens reconciliation** (the §6/§A Stage-0 precondition) — resolved here against deployed reality (§1).
2. **The access-policy engine interface** — a single audited `canRead` decision every read routes through (§2–§3).
3. **The Tag Guard write-path** + fail-closed defaults (§4–§5).
This spec specifies the INTERFACE + policy model + reconciliation; concrete DDL/handlers land in the implementation VEPs enumerated in §7. Per governance, this design is Codex Pass-2 reviewed before any implementation VEP.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Plan (Stage-0 design spec — substantive turn)
Grounding parent (source baseline): `5dbf64aa6c67bbe149cea58bc771e458437d5748` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the Codex activation note; currency anchors below are tip-independent blob SHAs
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(N/A because this is a design/plan spec — no handler or migration lands this turn; the P/I/E implementation tracks begin with the §7 roadmap VEPs.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | GOVERNING VISION — `governance/VAULT_MEMORY_ARCHITECTURE.md` (§4 engine, §5 Tag Guard, §6 substrate/lens, §A amendments, §10 build order) | `Grep("canRead(user, context, item)")` + `Grep("Fail-closed:")` + `Grep("MUST be resolved as part of the Stage 0 design task")` this turn | `a64b4af7297783fc8edbf757d03493077443bbbf` |
| 2 | Backend Governor — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§4 Schema Reality Lock DEPLOYED/PROPOSED; §6 SQL/authorization discipline; §8 VEP format) | `Grep("Never-Guess")` + `Grep("Schema Reality Lock")` + `Grep("DEPLOYED")`/`Grep("PROPOSED")` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 3 | Grounding Conformance — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchor Table; §6 auto-invalidity) | `Grep("MUST open with a Grounding Conformance Receipt")` + `Grep("Rule Anchor Table")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Golden Handler — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (Golden SQL: SECURITY DEFINER, pinned search_path, SQLSTATE→HTTP; deploy §5.5) | `Grep("SECURITY DEFINER")` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 5 | Execution Orchestration — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles; §1C executor/Walter-runs-migrations; §1D pass order; §1E deploy exception) | `Grep("Pass 2")` + `Grep("ordered, non-skippable")` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 6 | Schema truth — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (theo_user_memory §6; theo_conversation_access §11; SPW gates §10/§11) | `Grep("theo_user_memory")` + `Grep("theo_conversation_access")` this turn | `abe14dc5d45b8a78b4d2b7303f0bd1257da120ec` |
| 7 | DEPLOYED artifact — `theo_conversation_access` classifier | Codex Governance/Theo-SPW-Phase2b3a-Conversation-Access-Helper-Pass-1-VEP/spw_phase2b3a_migration.sql (deployed; catalog-verified §11) | tracked package (fn body inlined §2.1) |
| 8 | DEPLOYED artifact — SPW role gates + `theo_user_memory` DDL | spw_phase1_migration.sql + b7a_migration.sql (deployed; catalog-verified) | tracked packages (DDL inlined §1/§2.2) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack head) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §4 | "canRead(user, context, item)" | §2/§3 — the engine interface |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §4 | "Fail-closed:" | §5 — fail-closed defaults |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §6 | "MUST be resolved as part of the Stage 0 design task" | §1 — reconciliation verdict |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" | §1/§2 — DEPLOYED-grounded, no guessed schema |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "Never-Guess" | all schema/DDL cited from deployed migrations |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | Golden SQL | "SECURITY DEFINER" | §3/§4 — engine + Tag Guard fn idiom |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1D | "ordered, non-skippable" | §7 — implementation VEP roadmap + pass order |

---

## §1 — Reconciliation verdict: `theo_user_memory` ↔ substrate/lens (Stage-0 precondition, RESOLVED)

**DEPLOYED reality (Schema Reality Lock; from b7a_migration.sql, deployed + read-only-verified per schema doc §6):** `theo_user_memory` stores personal memory as free-text rows — `content text` (non-empty) + free-text `kind` (`'fact'|'preference'|'profile'`, DEFAULT `'fact'`, **no CHECK**) + `salience int` + `scope text CHECK (scope IN ('user','project'))` coupled 1:1 to `project_id` via `theo_user_memory_scope_project_ck` + provenance FKs (`source_conversation_id`) + owner (`created_by`). Cross-chat recall is a separate Azure AI Search index `theo-messages` (embeddings, keyed `created_by`+`conversation_id`), not in Postgres. Four ownership RLS policies (`created_by = auth.uid()`); the read path bypasses RLS and filters on explicit `created_by = $oid`.

**VERDICT (resolved):** the deployed structure **IS the flexible, user-controlled substrate** the vision doc's default posits ([[VAULT_MEMORY_ARCHITECTURE.md]] §6, §A-3). Six Plates is realised as an **additive lens** with **no destructive change**:
- The **plate/domain discriminator rides on the existing free-text `kind`** (or an additive nullable `plate text` column / side-table), following the established additive-migration idiom (`app_key`, `ingestion_class`, `message_seq` were all added additively). Default lens = Work & Craft; life-integration plates are opt-in metadata on the same rows.
- **No change to the substrate SHAPE is required for the default lens approach** → therefore **no amendment to `VAULT_MEMORY_ARCHITECTURE.md` §6 is triggered** (the doc requires an amendment only "if it changes the substrate shape").

**Two flagged constraints carried into the implementation VEPs (not blocking, but bounded):**
- **C1 — closed plate set would be a migration, not additive.** If the design later wants an enforced plate vocabulary, promoting `kind` (or `plate`) to a CHECK is a Walter-run migration. Keep the lens taxonomy **open (no CHECK)** at Stage 1; harden later only if needed.
- **C2 — a third `scope` (a distinct "life/plate" scope) WOULD change the substrate shape** (relaxing `theo_user_memory_scope_project_ck`) and IS the single most likely future amendment trigger. The Stage-1 lens therefore stays within the existing `scope='user'` rows (plates as metadata), NOT a new scope. If a distinct life-scope is ever required, that is a dated §6 amendment + a Walter-run migration.
- **C3 — history-RAG (Azure AI Search) has no plate/type tag today.** A lens-filtered recall path is net-new (an index field + filter), enumerated in §7, not a Stage-0 reuse.

---

## §2 — The access model (what `canRead` evaluates)

The engine is the single audited answer to **"may the caller read this item, in this context?"** It composes the five matrix dimensions from [[VAULT_MEMORY_ARCHITECTURE.md]] §4. Grounded in the DEPLOYED SPW pattern.

### §2.1 — The seed (DEPLOYED): `theo_conversation_access`
`theo_conversation_access(p_conversation_id uuid) → text` (`'owner'|'member'|NULL`), SECURITY DEFINER, `SET search_path = public`, caller from `current_setting('request.jwt.claim.sub', true)` (**never a parameter** — a caller can only act as themselves), REVOKE PUBLIC / GRANT authenticated. The `'member'` branch = `published_to_project = true AND project_id IS NOT NULL AND project_id ∈ (projects I created ∪ projects where I have a member row)`. This is already a `canRead`-shaped, read-only, single-audited-home classifier. **The engine generalises it: item domain (conversation → any layer/item) + a role × information-type axis.**

### §2.2 — The five dimensions (and where each is resolvable)
| Dimension | Source (DEPLOYED / net-new) | Where evaluated |
| --------- | --------------------------- | --------------- |
| **Per-project role** | DEPLOYED — `theo_project_effective_role(uuid) → 'creator'\|'owner'\|'member'\|NULL`; `theo_project_members.role` | Postgres (SECURITY DEFINER) |
| **Firm role** (partner/SM/manager/associate/preparer) | **NET-NEW — no source today.** MSAL `roles` claim is captured (`entraAuth.ts`) but gates nothing; the "Vault Staff" roster is display-only. Needs a firm-role source (Entra app-role/group → a resolved role, or a `theo_firm_roles` table). See §6 / G-2. | resolved to a value fed to the engine |
| **Information-type tag** (Factual/Technical/Deliberative/Governance/Commercial/Personnel) | **NET-NEW — greenfield.** `theo_user_memory` and L1.5 items have no type tag today. Ships with the L1.5 schema (§7). | Postgres (item's tag column) |
| **Layer** (L1/L1.5/L2/L3) | derived from item type/scope (L1 = `scope='user'`; L1.5 = project item) | Postgres |
| **Lowest-access participant** (collective-chat context) | context-supplied (the set of participant OIDs in the room) | Postgres (min over participants) |
| **SharePoint-Graph reachability** (Rule 5) | DEPLOYED substrate is **OBO passthrough only** — no Vault permission surface; DMS defers 100% to Graph. A Rule-5 check = a **net-new Graph reachability probe** in the handler. See §3.3 / G-3. | **Application layer (OBO Graph), NOT Postgres** |

**Key architectural consequence:** the engine is **not a single Postgres function** — it is a **composition** of (a) a Postgres SECURITY-DEFINER classifier for the DB-knowable dimensions (role × info-type × layer × lowest-participant) AND (b) an application-layer OBO Graph reachability probe for Rule 5, combined as a strict **AND** (both must allow). Postgres cannot reach Graph; the handler orchestrates both. Fail-closed on either.

---

## §3 — The `canRead` interface

### §3.1 — The Postgres classifier (single audited home, DB dimensions)
```
public.theo_can_read(
  p_item_layer   text,     -- 'L1' | 'L1.5' | 'L2' | 'L3'
  p_item_type    text,     -- info-type tag for L1.5 ('factual'|'technical'|'deliberative'|'governance'|'commercial'|'personnel'); NULL for L1
  p_item_id      uuid,     -- the item (or its container: project/conversation/kg-node)
  p_project_id   uuid,     -- the item's project (NULL for L1 personal / firm-wide)
  p_firm_role    text,     -- the caller's resolved firm role (from the §6 firm-role source), or NULL
  p_room_oids    text[]    -- collective-chat participant OIDs for the lowest-participant filter; NULL/empty ⇒ 1:1 context
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
```
- Caller identity is **`current_setting('request.jwt.claim.sub', true)` — NEVER a parameter** (matches the deployed pattern; a caller can only evaluate their own access).
- `p_firm_role` is passed IN (resolved in the handler from the §6 source) because firm role is not yet Postgres-resident; the function treats an unknown/NULL firm role as the least-privileged (fail-closed).
- Semantics: L1 → allow iff `created_by = caller` (personal, inviolable — Rule 1). L1.5 → the caller's effective role (project role ⊕ firm role) meets the item's information-type access rule (§ the §3-table in the vision doc), AND, in a `p_room_oids` context, the item is visible to the **lowest-access participant** (Rule 3). L2/L3 → read-only substrate, rights-filtered (L3 also lowest-participant-filtered).
- **REVOKE ALL FROM PUBLIC; GRANT EXECUTE TO authenticated.** SQLSTATE→HTTP where it raises (28000→401, 42501→403, 22023→400, P0002→404), matching SPW.

### §3.2 — The orchestrated engine (handler entry point)
Every read handler calls one composition:
```
canRead(item) := theo_can_read(...DB dimensions...)   -- Postgres AND
             AND ( item.sharepoint_ref IS NULL         -- Rule 5 (app layer)
                   OR graphReachable(caller_obo_token, item.sharepoint_ref) )
```
`graphReachable` = a bounded OBO HEAD/metadata probe against Graph (the `dms_read_file` OBO idiom), returning allow only on a 2xx; **any Graph 401/403/404/timeout ⇒ deny** (fail-closed). Result is a single boolean; no read path implements its own access logic (Amendment 1).

### §3.3 — Why one function + one composition (not per-feature)
Amendment 1 is the point: today access is scattered (chat handlers inline `created_by`; project/publish via per-purpose gates; DMS pure OBO). The engine unifies them into `theo_can_read` (DB) + the Graph probe (app). "Why can/can't X see Y?" becomes one testable decision. Existing gates (`theo_conversation_access`, `theo_project_effective_role`) become **internal helpers the engine calls**, not parallel access paths.

---

## §4 — Tag Guard (write-path enforcement; ships Stage 1)

Amendment 2: the security-critical write-time control, folded into the L1.5 write functions (NOT the observational Dottie, which is Stage 6). Each L1.5 write is a SECURITY DEFINER function (SPW gate idiom) that enforces, before insert/update:
- **Tag authority:** a given information-type tag may only be applied by a caller whose effective role is authorised for it (e.g. only sign-off authority may write `governance`; only partner/SM may write `commercial`) — else raise `42501`.
- **No untagged writes** to tag-required L1.5 fields — else raise `22023`.
- **Fail-closed:** unknown/absent tag ⇒ treated as the most restrictive ⇒ reject (never silently store as broadly-readable).
- Caller from the JWT claim, never a parameter; REVOKE PUBLIC / GRANT authenticated; SQLSTATE→HTTP.

Tag Guard shares the engine's role-resolution so write-authority and read-access are one policy, not two.

---

## §5 — Fail-closed defaults (Amendment 1)

Everywhere: **untagged, ambiguous, or unresolvable ⇒ deny / most-restrictive.**
- `theo_can_read`: no matching allow rule ⇒ `false`. Unknown `p_item_type`/`p_firm_role` ⇒ least-privileged. NULL caller claim ⇒ `false` (as `theo_conversation_access` already does).
- Graph probe: any non-2xx / error / timeout ⇒ deny.
- Tag Guard: absent/unauthorised tag ⇒ reject the write.
- A mis-tag therefore **over-restricts, never leaks** — the invariant the whole model rests on.

---

## §6 — Gaps + how handled

- **G-2 firm-role source (net-new, the biggest gap).** There is no firm role (partner/SM/…) resolvable today. Stage 0 specifies the engine's **interface** (`p_firm_role` in) and defers the SOURCE to its own scoped design/VEP: options are (a) Entra app-roles/security-groups → resolved in the handler from the token's `roles`/group claims, or (b) a Vault-owned `theo_firm_roles(oid, role)` table (Walter-curated). Recommendation: **(a) Entra app-roles** (firm identity already lives in Entra; avoids a second source of truth), verified against what the deployed token actually carries. Until it exists, the engine treats firm role as NULL ⇒ least-privileged (project role still fully works — SPW is unaffected).
- **G-3 Rule-5 Graph probe (net-new).** No Vault permission surface exists; DMS is OBO passthrough. The engine's Rule-5 check is a new bounded OBO probe (§3.2). Only items carrying a `sharepoint_ref` incur it; pure-DB items skip it.
- **G-1 L1.5 information-typing is greenfield.** `theo_user_memory` and today's project items have no type tag. The tag column + Tag Guard ship with the L1.5 schema VEP (§7). SPW's existing items (conversations, Decision Log) map onto info-types per [[VAULT_MEMORY_ARCHITECTURE.md]] §9.
- **G-4 SPW reconciliation (no second auth model).** Per Amendment 6: `theo_conversation_access`/`theo_project_effective_role` become engine helpers; SPW publish = the promote mechanic; Decision Log = an L1.5 info-type. No parallel authorization system is introduced.

---

## §7 — Implementation roadmap (the VEPs that follow this design; §1D ordered, non-skippable)

Each is a separate Pass-1 VEP → Codex Pass-2 → (Walter-run migration as `pgadmin_vault` + Claude-deployed handlers to the dedicated func apps) → Role-C schema-doc landing:
1. **Firm-role source** (G-2) — decide + implement Entra-app-role resolution (or `theo_firm_roles`); grounded against the deployed token. (Unblocks the engine's role dimension.)
2. **L1.5 schema + information-type tags + Tag Guard** — the Project Context tables with the type tag column, the Tag Guard write functions (§4). *(Engine interface, specified above, constrains this schema — §A-1 sequencing.)*
3. **`theo_can_read` classifier** (§3.1) — the Postgres engine function, absorbing `theo_conversation_access`/`theo_project_effective_role` as helpers.
4. **The orchestrated engine + Graph probe** (§3.2) — the handler-layer composition; migrate existing read handlers to call it (removing inline `created_by` scattering incrementally).
5. **Six Plates lens (opt-in)** — additive `kind`/`plate` metadata on `theo_user_memory` (§1), no scope change; the history-RAG type-filter (C3) if needed.

Stage-1 limbs (TODO tool + SPW Phase-3 moderation/Decision Log) proceed in parallel and consume the engine + L1.5 as they land.

## §8 — Gap Register

**PROCEED.** No missing CURRENT authority (the vision doc + deployed schema fully ground this design); no ESCALATE conditions.
- **G-1 (L1.5 typing greenfield): PROCEED** — ships with the L1.5 VEP (§7.2); design specifies the tag dimension now.
- **G-2 (firm-role source net-new): PROCEED** — interface specified (`p_firm_role`); source is §7.1's own VEP; engine degrades safely (NULL ⇒ least-privileged) meanwhile.
- **G-3 (Rule-5 Graph probe net-new): PROCEED** — app-layer composition specified (§3.2); only SharePoint-backed items incur it.
- **G-4 (SPW reconciliation): PROCEED** — existing gates become engine helpers; no second auth model.
- **C1/C2 (theo_user_memory constraints): PROCEED** — lens rides free-text `kind`, no shape change; a closed set or third scope is a future dated §6 amendment + Walter-run migration, explicitly out of Stage-1 scope.

## Codex activation note (Walter forwards)

```
Codex is activated for Pass-2 review of the Vault Access-Policy Engine Stage-0 Design (vault-theo,
"Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md").
Open your Pass-2 turn with a governance-bound Grounding Conformance Receipt + Rule Anchor Table
(Theo Grounding Conformance §3/§5). This is a PLAN/DESIGN spec (no migration/handler this turn) — review
for: (1) the theo_user_memory reconciliation verdict (§1) — is "substrate confirmed, Six Plates as an
additive lens on free-text `kind`, no shape change ⇒ no §6 amendment" correct against the DEPLOYED b7a
schema, and are constraints C1/C2/C3 accurately bounded? (2) the engine model (§2–§3) — is the
DB-classifier + app-layer Graph-probe COMPOSITION (Postgres can't reach Graph) sound, is caller-from-claim
-never-a-parameter preserved, is the theo_conversation_access generalisation faithful? (3) fail-closed
completeness (§5); (4) Tag Guard write-authority model (§4); (5) the gaps (§6: firm-role source G-2,
Graph probe G-3) — are they correctly deferred to their own VEPs (§7) without blocking, and does the engine
degrade safely (firm role NULL ⇒ least-privileged) so SPW is unaffected? (6) §7 roadmap ordering + the
Walter-runs-migrations / Claude-deploys-to-dedicated-func-apps discipline. Emit APPROVED or REJECTED only.
```
