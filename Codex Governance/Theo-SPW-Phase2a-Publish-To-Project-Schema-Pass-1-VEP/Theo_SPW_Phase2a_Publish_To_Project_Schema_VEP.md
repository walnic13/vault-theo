# Theo — SPW Phase 2a: publish-to-project conversation-sharing substrate (theo_conversations flag + RLS broadening) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete Walter-executable migration for deploy at Pass 3, after which Claude Code runs the read-only catalog verification. **Shared Project Workspace, Phase 2a (schema/RLS substrate for publish-to-project).** This is the sensitive core-chat change the current design deliberately forbids: it broadens RLS on `theo_conversations` + `theo_messages` beyond strict ownership so a conversation the author **publishes to a project** becomes **readable AND continuable (multi-party, attributed)** by that project's Creator / Owner / Members. Adds `published_to_project` (+ `published_at`/`published_by`) to `theo_conversations`; **SELECT** on conversations + messages and **INSERT** on messages broaden to *"mine OR a published chat in a project I belong to"*; conversation/message **UPDATE/DELETE stay owner-only** (publish/unpublish is an owner UPDATE; members can't rename/delete others' chats). **Private-by-default:** linking a chat to a project does NOT publish it — publish is an explicit owner action. **Attribution:** `theo_messages.created_by` is already the per-message author, so multi-party threads attribute automatically; a member INSERTs only as themselves. **Substrate only** — the publish/list/read/post handlers (2b) and FE (2c) ride on this. Non-recursive RLS (mirrors the deployed B5c membership pattern).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding parent (schema + governance state this migration applies against): vault-theo `f1f996d1ada39f0660d75885156366028e1c6674` (`development`). This package's controlling directory is carried by a later `development` commit — the branch tip at review, named in the Codex forward note, NOT baked here. Doc currency anchors below are git blob SHAs (tip-independent, verifiable via `git cat-file`).
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Schema + RLS-broadening microstep (no handler, no model call — handlers are 2b). Additive column + a partial index + a drop/recreate of THREE existing policies (theo_conversation_select_own, theo_message_select_own, theo_message_insert_own) to add the published-project-member branch; the five other conversation/message policies (conversation INSERT/UPDATE/DELETE + message UPDATE/DELETE) are unchanged (owner-only). RLS non-recursion preserved: theo_conversations.SELECT → theo_projects.SELECT + theo_project_members.SELECT (both self-contained per B5c; neither references conversations/messages back), theo_messages.SELECT/INSERT → theo_conversations.SELECT → … → terminates. Attribution is the existing per-message created_by. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§4/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 2 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Read` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (schema/RLS discipline) | `Read` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 5 | **Microstep authorization** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (sharing/membership RLS gate) | `Grep("sharing/membership RLS models")` this turn | `97645ecd0bc9e3c25082dd2a333c82ab83446584` |
| 6 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 ownership RLS baseline) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 7 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§1 sharing-authorization gate; §2 4-policy RLS; §3 theo_conversations/messages) | `Grep("Membership/sharing models") / "Four separate policies per table"` this turn | `df1f29a8f4cab01fb7c2f40ab152941825846203` |
| 8 | **Broadened baseline (deployed DDL)** — B2 migration — `Codex Governance/Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/b2_migration.sql` (the strict `created_by = auth.uid()` conversation/message policies being extended) | `Read` this turn | `2f2b6ddf8bf87525bc1a43e34bb7f82351a54b7c` |

No ChatGPT advisory cited. No `reporting_*` change. No write SQL executed (plan only; Walter runs the migration at Pass 3).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P7 — the RLS broadening rides on Walter's SPW authorization |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "Membership/sharing models are introduced only by explicit Walter-authorized schema update" | §P1/§P2 — publish-to-project = Walter-authorized sharing RLS |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §2 | "Four separate policies per table" | §DDL — extends 3 of the 4 conversation/message policies; the rest unchanged |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P2 — ownership is the baseline; published-project-member is the additive branch |

---

## P1 — Feature identification
SPW **Phase 2a**: the schema/RLS substrate for publish-to-project (the Jared-facing capability). Adds a publish flag to `theo_conversations` and broadens conversation/message RLS so a **published** conversation in a project is readable + continuable by the project's Creator/Owner/Members. Sharing/membership RLS is out of default 1B scope "unless Walter authorizes" (Backend Plan; Schema §1 — anchors); Walter authorized the SPW program (2026-07-30) and directed Phase 2 read+write. Delivers **only** the column + index + policy broadening — no handler, no surface, no model call (2b/2c).

## P2 — Architecture & boundary reconciliation
- **Publish model (private-by-default).** `published_to_project boolean DEFAULT false` + `published_at`/`published_by`. A conversation is shared iff `published_to_project=true AND project_id IS NOT NULL`. Publish = an explicit owner UPDATE (owner-only UPDATE policy unchanged); linking to a project alone never shares.
- **Read + write broadening.** SELECT (conversations + messages) and INSERT (messages) gain a branch: the conversation is published to a project the caller belongs to (creator ∪ owner/member via a `theo_project_members` row). INSERT keeps `created_by = auth.uid()` so a member continues a thread only as themselves (attribution). UPDATE/DELETE on both tables stay strictly owner-only — a member cannot rename/unpublish/delete a shared conversation or edit/delete others' messages.
- **Attribution (no new column).** `theo_messages.created_by` is already set to `auth.uid()` per insert, so each turn records its author; multi-party threads attribute automatically (Architecture §5.2 — ownership baseline; here `created_by` doubles as per-message author).
- **Non-recursion (mirrors B5c).** `theo_conversations.SELECT` references `theo_projects` + `theo_project_members`; `theo_messages.SELECT/INSERT` reference `theo_conversations`. `theo_projects.SELECT` → `theo_project_members` (self-contained), `theo_project_members.SELECT` self-contained, and neither references conversations/messages back — no cycle. Defense-in-depth: the connection role enforces RLS AND the 2b handlers set the OID session context + carry explicit predicates.
- **Boundary.** Additive column + index + 3 policy redefinitions on existing `theo_*` tables in the shared `vaultgpt` instance; no `reporting_*`; no new table; no function; the 5 owner-only policies untouched.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (`PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** One idempotent, additive migration on shared `vaultgpt` Postgres (as `pgadmin_vault`). It **redefines 3 live policies** (conversation/message SELECT + message INSERT) — behavior-affecting for RLS, but additive (only adds an OR branch; owner access unchanged). No app/env/dependency change. | **PRE-LAND** — §DEPLOY; Claude runs §VERIFY (policy predicates + columns) after. |
| G-2 | **Schema-doc §11.** `spec/THEO_AZURE_POSTGRES_SCHEMA.md` gains a §11 DEPLOYED record (publish columns + the broadened policies) after deploy. | **PRE-LAND** — a short schema-doc Role-C follows (mirrors the Phase 1 §10 Role-C). |
| G-3 | **Phase 2b handlers.** `theo_publish_conversation`/`theo_unpublish_conversation` (owner sets/clears the flag + `published_at`/`_by`), `theo_list_project_conversations` (published convs in a project, attributed), and the read/post path — `theo_get_conversation` + `theo_message`/`theo_message_stream` must drop any owner-only explicit predicate so a member can read + continue a published conversation (RLS now permits it). | **PROCEED (next microstep)** — 2b VEP(s); the publish/list handlers land in func-projects, the read/post changes on the chat apps. |
| G-4 | **Phase 2c FE.** Publish/unpublish control, "Shared in this project" list, attributed multi-party rendering + continuation. | **PROCEED (future)** — a later FE VEP grounding on the 2b contracts. |

No write SQL in this pack (plan only). No `reporting_*` change.

## P3 — Backend / contract grounding
No HTTP contract here (no handler). The substrate the 2b handlers consume: a conversation is shared when `published_to_project=true AND project_id` set; RLS then exposes it (read + member-continue) to the project's creator/owner/members. The schema doc gains its §11 record post-deploy (G-2). 2b will add `theo_publish_conversation`/`theo_unpublish_conversation`/`theo_list_project_conversations` and broaden the read/post handlers.

## P4 — Schema definition
See §DDL (complete idempotent migration): additive `published_to_project`/`published_at`/`published_by` columns + a partial index + drop/recreate of the 3 broadened policies. The 5 owner-only policies (conversation INSERT/UPDATE/DELETE; message UPDATE/DELETE) are untouched.

## P5 — Component reference grounding
Broadened baseline = the deployed B2 migration (blob `2f2b6ddf` — doc 8): the strict `theo_conversation_select_own`/`theo_message_select_own`/`theo_message_insert_own` policies (`created_by = auth.uid()`) that this VEP extends with the published-project-member OR-branch. The project-access subquery (`creator ∪ theo_project_members`) reproduces the deployed B5c membership-RLS predicate (schema §… B5c) verbatim in shape, preserving non-recursion.

## P6 — Repository & active-surface grounding
New artifacts (this package): `spw_phase2a_migration.sql` (== §DDL), `spw_phase2a_verify.sql` (== §VERIFY). No source/handler/active-surface file changed. Guardrails: no `reporting_*`; additive column/index; only the 3 named policies redefined (owner access preserved as an OR branch); non-recursive; the 5 owner-only policies untouched. Verified via §VERIFY post-deploy.

## P7 — Risk / regression
- **Additive + reversible.** `ADD COLUMN IF NOT EXISTS` (existing rows default unpublished/private → no conversation becomes visible until an owner explicitly publishes) + `CREATE INDEX IF NOT EXISTS` + guarded `DROP/CREATE POLICY`. The reversal block (restore strict `created_by=auth.uid()`) is in the migration footer.
- **Owner access unchanged.** Each broadened policy keeps `created_by = auth.uid()` as the first OR-branch — existing single-user behavior is byte-equivalent; the new branch only ADDS access to *published* conversations for project members.
- **No recursion / no data exposed silently.** Non-recursive (mirrors B5c). Nothing is exposed until `published_to_project=true` (an explicit owner action in 2b); default-false means the migration itself shares nothing.
- **Least exposure on write.** INSERT keeps `created_by = auth.uid()` — a member can only post as themselves into a *published* conversation of a project they belong to; UPDATE/DELETE stay owner-only.
- **No live-traffic risk until 2b.** No handler reads the flag / relies on the new branch until the 2b handlers land; existing owner-scoped queries are unaffected.

## P8 — VEP assembly
GCR + Rule Anchors open the pack; P1–P8 walked; Gap Register (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED); complete migration in §DDL; read-only verification in §VERIFY. Plan-only. On Codex APPROVAL, Walter runs the migration; Claude runs §VERIFY; then the schema-doc §11 Role-C (G-2) and the Phase-2b handler VEP(s) (G-3).

---

## §DDL — `spw_phase2a_migration.sql` (complete; Walter-executable; idempotent)
```sql
-- ============================================================================
-- Theo Shared Project Workspace — Phase 2a: publish-to-project (conversation sharing substrate).
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; NO top-level BEGIN/COMMIT (migration governance). Idempotent + reversible.
--
-- WHAT: adds a publish flag to theo_conversations and broadens RLS so a conversation the author
-- PUBLISHES to a project becomes both READABLE and CONTINUABLE (multi-party, attributed) by that
-- project's Creator / Owner / Members. This is the substrate for SPW Phase 2 (publish + attributed
-- multi-party threads); the handlers (2b) and FE (2c) ride on it.
--
-- MODEL (private-by-default): linking a conversation to a project (`project_id`) does NOT publish it.
-- Publishing is an explicit OWNER action that sets `published_to_project=true` (an owner UPDATE — the
-- owner-only UPDATE policy is unchanged). A conversation is shared iff `published_to_project=true` AND
-- `project_id IS NOT NULL`. Only then do the broadened SELECT/INSERT policies expose it to members.
--
-- ATTRIBUTION: theo_messages.created_by is already set to auth.uid() on every insert, so each message
-- records ITS AUTHOR. In a multi-party published thread this attributes each turn automatically — no
-- new column needed. A member may INSERT only as themselves (created_by = auth.uid()).
--
-- RLS NON-RECURSION (mirrors the B5c membership-RLS design): theo_conversations.SELECT references
-- theo_projects + theo_project_members; theo_messages.SELECT/INSERT reference theo_conversations.
-- theo_projects.SELECT references theo_project_members (self-contained), theo_project_members.SELECT is
-- self-contained, and NEITHER references theo_conversations/theo_messages back — so there is no cycle.
-- The project-access subquery (creator ∪ member-row) is identical in every policy for auditability.
--
-- AUTHORIZATION: broadening conversation/message RLS beyond ownership is out of default 1B scope
-- ("sharing/membership RLS models — ownership-only unless Walter authorizes"). Walter authorized the
-- Shared Project Workspace program (design 2026-07-30); Phase 2 read+write was explicitly directed.
-- ============================================================================

-- 1) publish columns (additive; existing rows default unpublished/private).
ALTER TABLE public.theo_conversations
  ADD COLUMN IF NOT EXISTS published_to_project boolean NOT NULL DEFAULT false;
ALTER TABLE public.theo_conversations
  ADD COLUMN IF NOT EXISTS published_at timestamptz NULL;
ALTER TABLE public.theo_conversations
  ADD COLUMN IF NOT EXISTS published_by text NULL;

-- Partial index for the members-view lookup (published conversations per project).
CREATE INDEX IF NOT EXISTS idx_theo_conversations_published
  ON public.theo_conversations (project_id)
  WHERE published_to_project = true;

-- 2) theo_conversations SELECT: own OR a conversation PUBLISHED to a project the caller belongs to
--    (creator ∪ owner/member via a theo_project_members row). INSERT/UPDATE/DELETE stay owner-only,
--    so publish/unpublish is an owner UPDATE and members cannot rename/delete a shared conversation.
DROP POLICY IF EXISTS "theo_conversation_select_own" ON public.theo_conversations;
CREATE POLICY "theo_conversation_select_own" ON public.theo_conversations
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR (
      published_to_project = true
      AND project_id IS NOT NULL
      AND project_id IN (
        SELECT id FROM public.theo_projects WHERE created_by = auth.uid()
        UNION
        SELECT project_id FROM public.theo_project_members WHERE member_oid = auth.uid()
      )
    )
  );

-- 3) theo_messages SELECT: own OR belongs to a conversation published to a project the caller belongs to.
DROP POLICY IF EXISTS "theo_message_select_own" ON public.theo_messages;
CREATE POLICY "theo_message_select_own" ON public.theo_messages
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR conversation_id IN (
      SELECT c.id FROM public.theo_conversations c
      WHERE c.published_to_project = true AND c.project_id IS NOT NULL
        AND c.project_id IN (
          SELECT id FROM public.theo_projects WHERE created_by = auth.uid()
          UNION
          SELECT project_id FROM public.theo_project_members WHERE member_oid = auth.uid()
        )
    )
  );

-- 4) theo_messages INSERT (multi-party continuation): the caller's OWN conversation, OR a PUBLISHED
--    conversation in a project the caller belongs to. `created_by = auth.uid()` ALWAYS (attribution —
--    a member posts only as themselves). This is the write-side broadening that lets members continue
--    a shared thread; UPDATE/DELETE stay owner-only (a member cannot edit/delete others' messages).
DROP POLICY IF EXISTS "theo_message_insert_own" ON public.theo_messages;
CREATE POLICY "theo_message_insert_own" ON public.theo_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND (
      conversation_id IN (
        SELECT id FROM public.theo_conversations WHERE created_by = auth.uid()
      )
      OR conversation_id IN (
        SELECT c.id FROM public.theo_conversations c
        WHERE c.published_to_project = true AND c.project_id IS NOT NULL
          AND c.project_id IN (
            SELECT id FROM public.theo_projects WHERE created_by = auth.uid()
            UNION
            SELECT project_id FROM public.theo_project_members WHERE member_oid = auth.uid()
          )
      )
    )
  );

-- ============================================================================
-- REVERSIBILITY (manual, if ever needed; not run at deploy) — restore the strict ownership baseline:
--   DROP POLICY IF EXISTS "theo_message_insert_own" ON public.theo_messages;
--   CREATE POLICY "theo_message_insert_own" ON public.theo_messages FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
--   DROP POLICY IF EXISTS "theo_message_select_own" ON public.theo_messages;
--   CREATE POLICY "theo_message_select_own" ON public.theo_messages FOR SELECT TO authenticated USING (created_by = auth.uid());
--   DROP POLICY IF EXISTS "theo_conversation_select_own" ON public.theo_conversations;
--   CREATE POLICY "theo_conversation_select_own" ON public.theo_conversations FOR SELECT TO authenticated USING (created_by = auth.uid());
--   DROP INDEX IF EXISTS public.idx_theo_conversations_published;
--   ALTER TABLE public.theo_conversations DROP COLUMN IF EXISTS published_by;
--   ALTER TABLE public.theo_conversations DROP COLUMN IF EXISTS published_at;
--   ALTER TABLE public.theo_conversations DROP COLUMN IF EXISTS published_to_project;
-- ============================================================================
```

## §VERIFY — post-deploy read-only catalog probe (Claude Code runs via `.local\run-reporting-ro-query.ps1`)
```sql
-- SPW Phase 2a — post-deploy verification (read-only; catalog only).
-- Claude Code runs this via .local\run-reporting-ro-query.ps1 after Walter deploys the migration.

-- 1) publish columns present on theo_conversations
SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS type, a.attnotnull AS not_null,
       pg_get_expr(d.adbin, d.adrelid) AS default_expr
FROM pg_attribute a
LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
WHERE a.attrelid = 'public.theo_conversations'::regclass
  AND a.attname IN ('published_to_project','published_at','published_by')
  AND NOT a.attisdropped
ORDER BY a.attname;

-- 2) partial published index
SELECT indexname, indexdef FROM pg_indexes
WHERE schemaname='public' AND tablename='theo_conversations' AND indexname='idx_theo_conversations_published';

-- 3) broadened policies — SELECT on conversations + messages, INSERT on messages (show the predicate)
SELECT c.relname AS tbl, p.polname,
       CASE p.polcmd WHEN 'r' THEN 'SELECT' WHEN 'a' THEN 'INSERT' WHEN 'w' THEN 'UPDATE' WHEN 'd' THEN 'DELETE' END AS cmd,
       pg_get_expr(p.polqual, p.polrelid) AS using_expr,
       pg_get_expr(p.polwithcheck, p.polrelid) AS check_expr
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname IN ('theo_conversations','theo_messages')
ORDER BY c.relname, p.polname;
-- Expect: theo_conversation_select_own USING references published_to_project + theo_project_members;
-- theo_message_select_own USING references theo_conversations(published_to_project);
-- theo_message_insert_own WITH CHECK references created_by=auth.uid() + published conversation;
-- theo_conversation_{insert,update,delete}_own + theo_message_{update,delete}_own still created_by=auth.uid().

-- 4) RLS still enabled on both tables
SELECT relname, relrowsecurity AS rls FROM pg_class
WHERE relnamespace='public'::regnamespace AND relname IN ('theo_conversations','theo_messages');
```

## §DEPLOY — Walter deploy steps
1. Run `spw_phase2a_migration.sql` against the shared `vaultgpt` Postgres **as `pgadmin_vault`** (the owner; same as every prior theo migration — NOT via the RO tool).
2. Reply "SPW Phase 2a deployed" → Claude Code runs §VERIFY (publish columns + the 3 broadened policy predicates + the 5 owner-only policies intact + RLS enabled), then prepares the schema-doc §11 Role-C (G-2) and the Phase-2b handler VEP (G-3).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of SPW Phase 2a publish-to-project schema Pass-1 Backend VEP (plan only).*
