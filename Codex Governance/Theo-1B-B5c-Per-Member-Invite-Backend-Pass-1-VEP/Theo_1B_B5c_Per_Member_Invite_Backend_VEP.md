# Theo 1B — B5c Per-Member Project Invite (backend: `theo_share_project` / `theo_unshare_project` / `theo_list_project_members` + member-shared RLS/handler broadening) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete migration + handlers provided for Walter to deploy at Pass 3, after which Claude Code runs the golden curls. **Microstep:** the **per-member invite** half of the Sharing/Visibility tier (Tier B5) — the Phase-2 fast-follow to B5a's group-visible sharing (Walter's "both, phased" decision). A project owner invites **specific** Vault users (by Entra OID, the same identity `theo_list_people` returns) to a project; an invited member can read that project + its knowledge/instructions and chat with **their own** conversations in it (**config-only sharing** — `theo_conversations`/`theo_messages` RLS UNCHANGED). **Additive, reversible migration** (new `theo_project_members` table + broadened SELECT-only RLS on `theo_projects` + `theo_project_knowledge`; no SECURITY DEFINER helper — see R1 below). Three GREENFIELD handlers (`theo_share_project`, `theo_unshare_project`, `theo_list_project_members`, all owner-only) + three MODIFIED handlers (`theo_list_projects`, `theo_list_project_knowledge`, `theo_set_conversation_project`) broaden their explicit predicate from `owned ∨ group-visible` to `owned ∨ group-visible ∨ shared-with-me`. No Microsoft Graph, no Blob, no model gateway; no vault-origin change (the FE invite picker is the paired B5c-FE microstep).

---

**R1 REVISION (Codex Pass-2 REJECT, valid — fixed):** R0 broke the `theo_projects`↔`theo_project_members` RLS cycle with two new SECURITY DEFINER enumeration helpers. Codex correctly fired **T12**: that is a *new* elevated-read helper class (not an existing `_exists_unscoped` existence helper, not a scheduled-timer enumeration helper) used by HTTP-path RLS policies, and the pack quoted no prior Walter authorization/amendment for the class. **Fixed by removing both helpers entirely** — no SECURITY DEFINER, no new elevated-read class. The cycle is now broken by keeping the membership SELECT policy **self-contained**: a member is authorized by `member_oid = auth.uid()` and the owner by `invited_by = auth.uid()` (invited_by is always the owning inviter, set by `theo_share_project` + enforced by the INSERT policy; ownership does not transfer). Because that policy references no other table, `theo_projects`' member subquery terminates at it and there is no mutual recursion. This uses only ordinary ownership-family RLS primitives (`auth.uid()`) — the authorized default family (Architecture §5.2) — so no authority amendment is required.

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `6504992` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked; includes an **additive schema migration** (§MIGRATION) whose RLS avoids the `theo_projects`↔`theo_project_members` cross-reference cycle by a **self-contained membership SELECT policy** (`member_oid = auth.uid() OR invited_by = auth.uid()`) — NO SECURITY DEFINER helper, only ordinary ownership-family `auth.uid()` primitives (R1 fix for Codex T12). Primary Reference (Golden §2) = the **deployed** `theo_set_project_visibility` **pair** (B5a) — owner-scoped mutation over `theo_projects` with the `set_config` triad / owner predicate / 0-row → `theo_project_exists_unscoped` → 403-404 / 42501-isKnown-500 mapping, inlined verbatim §SM/§SM-FJ. The three GREENFIELD handlers mirror it (owner-only writes/reads over the new membership table). The three MODIFIED handlers are their own deployed B5a selves with the single ALLOWED DELTA of broadening the project predicate to add `OR id IN (member rows)` (list_projects also adds a `shared_with_me` boolean). Contract basis = deployed `theo_projects` + `theo_project_knowledge` (Schema §3/§5) + Backend Plan Tier B4. Config-only sharing: `theo_conversations`/`theo_messages` RLS UNCHANGED. Schema change is Walter-authorized (sharing-model decision — per-member invite, the B5a Phase-2 fast-follow). Validation precedes SQL. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `git grep -F "Gap Register"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §4 deltas; §5 SM) | `git grep -F "selects **exactly one** deployed handler file"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (pass axis) | cited | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B4 projects CRUD) | `git grep -F "Projects + project-knowledge + artifacts + settings CRUD"` this turn | `2bb5a638b301d49b19f401517560d81ede979352` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `git grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3/§5 `theo_projects` + `theo_project_knowledge`) | `git grep -F "theo_projects"` this turn | `59924ef06b64e62b4cc6a268793d52bd82945cbd` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 projects) | `Read` this turn | `30f1cacb83458acf636f44113ddbbf72d09859d0` |
| 10 | **Primary Reference handler** (deployed owner-scoped mutation over theo_projects) — `Codex Governance/Theo-1B-B5a-Project-Visibility-Backend-Pass-1-VEP/theo_set_project_visibility.index.js` | `Read(full)` this turn | `1338320e88afe815d61de4c8d5e9f78eead256bf` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-B5a-Project-Visibility-Backend-Pass-1-VEP/theo_set_project_visibility.function.json` | `Read(full)` this turn | `fc070822653e082a197f13c8e214b66d1ad4458f` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. `theo_message`/`theo_message_stream` NOT touched. `theo_conversations`/`theo_messages` RLS NOT touched (config-only sharing).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B4 | "Projects + project-knowledge + artifacts + settings CRUD" | §P1 — per-member invite extends the deployed projects CRUD surface |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_set_project_visibility` |
| Codex Governance/Theo-1B-B5a-Project-Visibility-Backend-Pass-1-VEP/theo_set_project_visibility.function.json | binding | "httpTrigger" | §SM-FJ — Primary Reference function.json |
| Codex Governance/Theo-1B-B5a-Project-Visibility-Backend-Pass-1-VEP/theo_set_project_visibility.index.js | 0-row | "theo_project_exists_unscoped" | §HG.1/§HG.2/§HG.3 — owner 0-row → 403/404 (same idiom) |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P2 — member-shared is a cited, SELECT-only extension of the ownership family |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_projects" | §MIGRATION — new membership table + broadened SELECT RLS on the deployed tables |

---

## P1 — Feature identification
**Microstep:** project **per-member invite** — the second half of the Sharing/Visibility tier (Walter's "both, phased" decision; extends Plan Tier B4 + B5a group-visibility). B5a made a project either `private` or `group`-visible; B5c adds **targeted** sharing to specific users. This adds:
- **`theo_share_project`** (POST `{project_id, member_oid}`, owner-only) — invite a specific Vault user (by Entra OID) to a project.
- **`theo_unshare_project`** (POST `{project_id, member_oid}`, owner-only) — revoke.
- **`theo_list_project_members`** (GET `?projectId`, owner-only) — list who a project is shared with.
- A project shared with the caller (a `theo_project_members` row) becomes readable (project + knowledge/instructions), and the caller may link **their own** conversation to it. Members chat with **their own** conversations — config-only sharing (transcripts stay private).

**Out of scope (paired / later):** the FE invite picker (B5c-FE, reuses the `theo_list_people` roster + the `shared_with_me` flag); native chat.

## P2 — Architecture & boundary reconciliation
- **Family-B.** `pg` Pool; per-request `set_config` triad; the two write handlers (`theo_share_project`/`theo_unshare_project`) and `theo_set_conversation_project` are mutations `connect→BEGIN→…→COMMIT` with `catch ROLLBACK`; the reads (`theo_list_project_members`, `theo_list_projects`, `theo_list_project_knowledge`) keep the read shape (connect, set_config, query).
- **Ownership family + a cited membership extension (Architecture §5.2 "Default family: ownership-based").** Writes stay owner-only (only the owner invites/revokes; membership INSERT/DELETE RLS requires project ownership). The **SELECT-only** policies on `theo_projects` + `theo_project_knowledge` gain a deliberate `OR id IN (member rows)` clause — a cited, minimal read-broadening, layered on B5a's `OR visibility = 'group'`. Handlers carry the matching explicit predicate; RLS is the defense layer.
- **RLS non-recursion (design-critical; R1 — no SECURITY DEFINER).** `theo_projects`' SELECT policy references membership, so `theo_project_members`' SELECT policy MUST NOT reference `theo_projects` (that mutual cycle is what Postgres rejects as "infinite recursion detected in policy"). We keep the membership **SELECT policy self-contained**: `member_oid = auth.uid() OR invited_by = auth.uid()` — the member sees their own row; the owner sees rows they invited (`invited_by` = the owner, stamped by `theo_share_project` and enforced by the INSERT policy; ownership does not transfer, so `invited_by = auth.uid()` is exactly "members of the projects I own"). Because that policy references no other table, `theo_projects`' member subquery terminates at it. The membership **INSERT/DELETE** policies may reference `theo_projects` for the owner check — that path is `projects.SELECT → members.SELECT` (self-contained) and terminates. No SECURITY DEFINER helper, no new elevated-read class — only the authorized ownership-family `auth.uid()` primitives (Architecture §5.2).
- **Config-only sharing boundary.** `theo_conversations` + `theo_messages` RLS is **untouched** — a shared project shares its config (knowledge/instructions), never another user's chat transcripts. `theo_set_conversation_project` lets a member link **their own** conversation to a shared project; the conversation stays owner-scoped.
- **Validation before SQL.** `isUuid` on `project_id` and `member_oid` (Entra OIDs are UUID-shaped); self-invite → deterministic 400 — all before any query.
- **Boundary.** Reads/writes only `theo_projects` (owner check), `theo_project_knowledge` (read), `theo_project_members` (new), `theo_conversations.project_id` link (owner-scoped); **no `reporting_*`**; no Blob, no model gateway, no Graph; **no change to `theo_message`/`theo_message_stream`**.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Migration + deploy (Walter).** One new table + three membership policies + two SELECT-policy broadenings (§MIGRATION; no SECURITY DEFINER helper — R1); three new functions + three redeployed functions on `vaultgpt-func-premium`. Additive + reversible; Walter-authorized (sharing-model decision — per-member invite). | **PRE-LAND** — §DEPLOY; Claude Code golden curls confirm (owner invites member → member reads shared project + knowledge → member links own chat → non-member still blocked → owner-only invite/revoke/list → private stays isolated). |
| G-2 | **Authority-doc update post-deploy.** API Spec §2.2 gains the `theo_share_project`/`theo_unshare_project`/`theo_list_project_members` rows + the member-shared read semantics + the `shared_with_me` field on list_projects. | **PRE-LAND** — a short API-Spec Role-C follows deploy (mirrors B4x/B5a), before the B5c-FE VEP cites it. |

## P3 — External-system reconciliation
None. No Microsoft Graph, no Blob, no model gateway, no `reporting_*`. Pure Postgres over the deployed Theo schema + a new additive table.

## P4 — Contract reconciliation
- Envelope: `{ data, meta }` success / `{ error:{code,message,status,timestamp} }` — identical to the deployed Family-B handlers.
- `theo_share_project` → `{ shared:true, project_id, member_oid }`; `theo_unshare_project` → `{ unshared:true, project_id, member_oid }`; `theo_list_project_members` → `{ members:[{project_id,member_oid,invited_by,created_at}] }`.
- `theo_list_projects` gains `shared_with_me` (boolean) alongside the B5a `is_owner`/`visibility`. `theo_list_project_knowledge` / `theo_set_conversation_project` shapes unchanged.

## P5 — Error-model reconciliation
Deployed map preserved: 42501→403; 23503 (FK, project deleted mid-op)→404; `isKnown` (403/404 owner split via `theo_project_exists_unscoped`)→ its status; 400 for bad UUID / self-invite / bad JSON; else 500. Idempotent share (ON CONFLICT DO NOTHING) and unshare (DELETE no-op) stay 200.

## P6 — Data-shape reconciliation
`theo_project_members`: `project_id uuid FK→theo_projects(id) ON DELETE CASCADE`, `member_oid text`, `invited_by text`, `created_at timestamptz default now()`, PK `(project_id, member_oid)`. Deleting a project cascades its membership rows. `member_oid`/`invited_by` are Entra OIDs (text, as `created_by` is elsewhere).

## P7 — Idempotency / concurrency
Share is idempotent via the PK + `ON CONFLICT DO NOTHING`; unshare is idempotent (DELETE of an absent row is a no-op). `theo_set_conversation_project` keeps its set-once idempotency. No cross-request ordering hazard (single-statement writes in a transaction).

## P8 — Security / RLS reconciliation
- Every query runs under the per-request `set_config` triad; the connection role enforces RLS, so handlers keep explicit owner/access predicates as the primary gate and RLS as defense.
- Writes owner-only (membership INSERT/DELETE RLS requires project ownership; `invited_by = auth.uid()`). Reads broadened SELECT-only to `owned ∨ group ∨ member`.
- **No RLS recursion** (§P2): the self-contained membership SELECT policy (`member_oid = auth.uid() OR invited_by = auth.uid()`) breaks the projects↔members cycle with no SECURITY DEFINER helper and no new elevated-read class.
- **No transcript exposure**: `theo_conversations`/`theo_messages` RLS untouched.
- No leakage: exists-but-not-owned → 403, absent → 404 via the deployed SECURITY DEFINER existence helper.

---

## §MIGRATION — `b5c_migration.sql` (additive + reversible; run by Walter at Pass 3)

```sql
-- Theo B5c — Per-member project invite. ADDITIVE + REVERSIBLE.
-- Adds theo_project_members (a project owner invites specific Vault users to a project by Entra OID)
-- and broadens the SELECT-only RLS on theo_projects + theo_project_knowledge so a project SHARED
-- WITH the caller (a member row) is readable, in addition to owned + group-visible (B5a). Project
-- INSERT/UPDATE/DELETE and knowledge INSERT/UPDATE/DELETE stay OWNER-ONLY. Membership rows are
-- owner-managed. Conversations / messages RLS is UNCHANGED (config-only sharing: members chat with
-- their own conversations; no one reads another user's transcripts). Idempotent; safe to re-run.
--
-- RLS non-recursion (NO new elevated-read helper): theo_projects' SELECT policy references
-- theo_project_members, so theo_project_members' OWN policies MUST NOT reference theo_projects (that
-- would create the mutual projects<->members cycle Postgres rejects as "infinite recursion detected
-- in policy"). We keep the membership SELECT policy SELF-CONTAINED: a member sees rows where
-- member_oid = auth.uid(); the owner sees rows where invited_by = auth.uid(). Because only a project
-- owner can insert a membership row (INSERT policy below) and invited_by is stamped with that owner's
-- OID, `invited_by = auth.uid()` is exactly "the members of the projects I own" — no theo_projects
-- lookup, no cycle. The membership INSERT/DELETE policies MAY reference theo_projects for the owner
-- check: that path is projects.SELECT -> members.SELECT (self-contained) and terminates. This uses
-- only the ordinary ownership-family RLS primitives (auth.uid()); it introduces NO SECURITY DEFINER
-- helper and NO new elevated-read class.

-- 1) Membership table: (project_id, member_oid) grants READ access to a specific user.
CREATE TABLE IF NOT EXISTS public.theo_project_members (
  project_id uuid NOT NULL REFERENCES public.theo_projects(id) ON DELETE CASCADE,
  member_oid text NOT NULL,
  invited_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, member_oid)
);

-- Lookup index for the member -> projects direction (RLS member subquery + list).
CREATE INDEX IF NOT EXISTS theo_project_members_member_idx
  ON public.theo_project_members (member_oid);

ALTER TABLE public.theo_project_members ENABLE ROW LEVEL SECURITY;

-- 2) Membership RLS (owner-managed; a member may see their OWN membership row).
--    SELECT: the member themselves OR the owner who invited them (invited_by). SELF-CONTAINED — no
--    reference to theo_projects, so no projects<->members recursion. invited_by is always the owning
--    inviter (set by theo_share_project + enforced by the INSERT policy; ownership does not transfer).
DROP POLICY IF EXISTS "theo_project_member_select_own" ON public.theo_project_members;
CREATE POLICY "theo_project_member_select_own" ON public.theo_project_members
  FOR SELECT TO authenticated
  USING (
    member_oid = auth.uid()
    OR invited_by = auth.uid()
  );

--    INSERT: only the project OWNER may add a member; invited_by must be the owner themselves. The
--    theo_projects subquery is safe (projects.SELECT -> members.SELECT is self-contained; terminates).
DROP POLICY IF EXISTS "theo_project_member_insert_own" ON public.theo_project_members;
CREATE POLICY "theo_project_member_insert_own" ON public.theo_project_members
  FOR INSERT TO authenticated
  WITH CHECK (
    invited_by = auth.uid()
    AND project_id IN (SELECT id FROM public.theo_projects WHERE created_by = auth.uid())
  );

--    DELETE: only the project OWNER may remove a member.
DROP POLICY IF EXISTS "theo_project_member_delete_own" ON public.theo_project_members;
CREATE POLICY "theo_project_member_delete_own" ON public.theo_project_members
  FOR DELETE TO authenticated
  USING (
    project_id IN (SELECT id FROM public.theo_projects WHERE created_by = auth.uid())
  );
--    (No UPDATE policy: membership rows are immutable — share/unshare is INSERT/DELETE.)

-- 3) Broaden theo_projects SELECT: own OR group-visible OR shared-with-me (member row).
--    (INSERT/UPDATE/DELETE unchanged — owner-only.) The member subquery reads theo_project_members
--    under its SELF-CONTAINED SELECT policy, so this does not recurse.
DROP POLICY IF EXISTS "theo_project_select_own" ON public.theo_projects;
CREATE POLICY "theo_project_select_own" ON public.theo_projects
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR visibility = 'group'
    OR id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = auth.uid())
  );

-- 4) Broaden theo_project_knowledge SELECT: own OR belongs to a group-visible OR shared-with-me project.
--    (INSERT/UPDATE/DELETE unchanged — only the project owner adds/removes knowledge.) Both subqueries
--    terminate: the group subquery hits projects.SELECT (-> members.SELECT self-contained); the member
--    subquery hits members.SELECT (self-contained).
DROP POLICY IF EXISTS "theo_project_knowledge_select_own" ON public.theo_project_knowledge;
CREATE POLICY "theo_project_knowledge_select_own" ON public.theo_project_knowledge
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR project_id IN (SELECT id FROM public.theo_projects WHERE visibility = 'group')
    OR project_id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = auth.uid())
  );
```

**Read-only verification — `b5c_verify.sql`:**

```sql
-- Theo B5c — read-only verification (run after b5c_migration.sql). SELECT-only; no writes.

-- V1) theo_project_members table + RLS enabled.
SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'theo_project_members';

-- V2) columns of theo_project_members.
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_project_members'
ORDER BY ordinal_position;

-- V3) primary key + foreign key on theo_project_members.
SELECT con.conname, con.contype
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'theo_project_members'
ORDER BY con.contype, con.conname;

-- V4) the member index.
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'theo_project_members'
ORDER BY indexname;

-- V5) membership policies (3: select/insert/delete) + broadened project/knowledge SELECT policies.
--     Confirms the membership SELECT policy is present (self-contained) and the projects/knowledge
--     SELECT policies were re-created with the member clause. No SECURITY DEFINER helper is used.
SELECT c.relname AS tablename, p.polname, p.polcmd
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('theo_project_members', 'theo_projects', 'theo_project_knowledge')
ORDER BY c.relname, p.polname;
```

---

## §SM — Primary Reference (deployed `theo_set_project_visibility.index.js`, byte-verbatim)

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const VALID_VISIBILITY = ["private", "group"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  if (typeof req.body === "object") {
    return req.body;
  }
  return {};
}

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  err.isKnown = true;
  return err;
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);

  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!isUuid(id)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'id' is required and must be a valid UUID.", 400));
  }

  const visibility = typeof body.visibility === "string" ? body.visibility.trim() : "";
  if (!VALID_VISIBILITY.includes(visibility)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'visibility' must be one of 'private' or 'group'.", 400));
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Explicit ownership scope (connection role bypasses RLS): only the project OWNER may change
    // visibility — id AND created_by = the signed-in OID. Group-visible readers cannot re-share.
    const updated = await client.query(
      `
      UPDATE public.theo_projects
      SET visibility = $1, updated_at = now()
      WHERE id = $2 AND created_by = $3
      RETURNING id, visibility
      `,
      [visibility, id, oid]
    );

    if (updated.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_exists_unscoped($1::uuid) AS e`,
        [id]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this project.", 403)
        : buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ project: updated.rows[0] }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_set_project_visibility failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // CHECK violation (visibility vocabulary), defensive (validated above).
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Project violates a field constraint.", 400));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

## §SM-FJ — Primary Reference function.json (deployed `theo_set_project_visibility.function.json`, byte-verbatim)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_set_project_visibility"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

---

## §HG — Handlers (3 GREENFIELD + 3 MODIFIED full replacements)

### §HG.1 — `theo_share_project` (GREENFIELD)

POST {project_id, member_oid} — owner-only invite; idempotent INSERT into theo_project_members (ON CONFLICT DO NOTHING); self-invite → 400; exists-not-owned → 403 / absent → 404.

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  if (typeof req.body === "object") {
    return req.body;
  }
  return {};
}

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  err.isKnown = true;
  return err;
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);

  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  }
  // member_oid is an Entra object id (UUID-shaped), the same identity theo_list_people returns.
  const memberOid = typeof body.member_oid === "string" ? body.member_oid.trim() : "";
  if (!isUuid(memberOid)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'member_oid' is required and must be a valid UUID (Entra object id).", 400));
  }
  if (memberOid === oid) {
    return send(context, 400, errorBody("INVALID_REQUEST", "You cannot invite yourself to a project you own.", 400));
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Only the project OWNER may invite. Explicit ownership scope (connection role enforces RLS;
    // this predicate is the primary gate): id AND created_by = the signed-in OID. Exists-but-not-
    // owned → 403; absent → 404 (via the deployed SECURITY DEFINER existence helper). No leakage.
    const owned = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
      [projectId, oid]
    );
    if (owned.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_exists_unscoped($1::uuid) AS e`,
        [projectId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this project.", 403)
        : buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // Idempotent invite: (project_id, member_oid) is the PK; re-inviting is a no-op. invited_by
    // records the owner. RLS INSERT policy independently requires invited_by = auth.uid() + owner.
    await client.query(
      `
      INSERT INTO public.theo_project_members (project_id, member_oid, invited_by)
      VALUES ($1, $2, $3)
      ON CONFLICT (project_id, member_oid) DO NOTHING
      `,
      [projectId, memberOid, oid]
    );

    await client.query("COMMIT");

    return send(context, 200, successBody({ shared: true, project_id: projectId, member_oid: memberOid }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_share_project failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // FK violation: project deleted mid-op (defensive; ownership verified above).
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

**§FJ.1 — `theo_share_project.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_share_project"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### §HG.2 — `theo_unshare_project` (GREENFIELD)

POST {project_id, member_oid} — owner-only revoke; idempotent DELETE; 403/404 split.

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  if (typeof req.body === "object") {
    return req.body;
  }
  return {};
}

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  err.isKnown = true;
  return err;
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);

  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  }
  const memberOid = typeof body.member_oid === "string" ? body.member_oid.trim() : "";
  if (!isUuid(memberOid)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'member_oid' is required and must be a valid UUID (Entra object id).", 400));
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Only the project OWNER may revoke a member. Verify ownership first (exists-but-not-owned →
    // 403; absent → 404), then delete the membership row. No leakage of projects the caller can't own.
    const owned = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
      [projectId, oid]
    );
    if (owned.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_exists_unscoped($1::uuid) AS e`,
        [projectId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this project.", 403)
        : buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // Idempotent revoke: deleting a non-existent membership row is a no-op (unshare stays 200).
    await client.query(
      `DELETE FROM public.theo_project_members WHERE project_id = $1 AND member_oid = $2`,
      [projectId, memberOid]
    );

    await client.query("COMMIT");

    return send(context, 200, successBody({ unshared: true, project_id: projectId, member_oid: memberOid }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_unshare_project failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

**§FJ.2 — `theo_unshare_project.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_unshare_project"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### §HG.3 — `theo_list_project_members` (GREENFIELD)

GET ?projectId — owner-only member list; returns {members:[{project_id,member_oid,invited_by,created_at}]}; 403/404 split.

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  err.isKnown = true;
  return err;
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);

  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  const projectId =
    req.query && typeof req.query.projectId === "string" ? req.query.projectId.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'projectId' is required and must be a valid UUID.", 400));
  }

  let client = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // The member list is OWNER-ONLY (an invitee sees the shared project in their own list, not the
    // full roster of co-members). Resolve ownership first: owned → list; exists-but-not-owned → 403;
    // absent → 404 (via the deployed SECURITY DEFINER existence helper). No leakage.
    const owned = await client.query(
      `SELECT 1 FROM public.theo_projects WHERE id = $1 AND created_by = $2`,
      [projectId, oid]
    );
    if (owned.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_exists_unscoped($1::uuid) AS e`,
        [projectId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this project.", 403)
        : buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    const result = await client.query(
      `
      SELECT
        project_id,
        member_oid,
        invited_by,
        created_at
      FROM public.theo_project_members
      WHERE project_id = $1
      ORDER BY created_at ASC, member_oid ASC
      LIMIT 500
      `,
      [projectId]
    );

    return send(context, 200, successBody({ members: result.rows }));
  } catch (err) {
    context.log.error("theo_list_project_members failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

**§FJ.3 — `theo_list_project_members.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_project_members"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### §HG.4 — `theo_list_projects` (MODIFIED (B5a→B5c))

ALLOWED DELTA: WHERE adds `OR id IN (member rows)`; SELECT adds `shared_with_me` boolean. All else byte-identical to the deployed B5a handler.

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);

  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  const client = await pool.connect();

  try {
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // B5c: return the caller's OWN projects, any GROUP-VISIBLE project (B5a), plus any project SHARED
    // WITH the caller via a theo_project_members row (per-member invite). Explicit predicate (the
    // shared connection role's RLS is the defense layer). `is_owner` (B5a) badges shared-by-others;
    // `shared_with_me` distinguishes an explicit invite from a group-visible project so the FE can
    // badge them differently. Newest-updated first (backs the Projects list).
    const result = await client.query(
      `
      SELECT
        id,
        name,
        description,
        instructions,
        app_key,
        visibility,
        (created_by = $1) AS is_owner,
        EXISTS (
          SELECT 1 FROM public.theo_project_members m
          WHERE m.project_id = theo_projects.id AND m.member_oid = $1
        ) AS shared_with_me,
        created_at,
        updated_at
      FROM public.theo_projects
      WHERE created_by = $1
        OR visibility = 'group'
        OR id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = $1)
      ORDER BY updated_at DESC, id DESC
      LIMIT 500
      `,
      [oid]
    );

    return send(context, 200, successBody({ projects: result.rows }));
  } catch (err) {
    context.log.error("theo_list_projects failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list projects.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

**§FJ.4 — `theo_list_projects.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_projects"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### §HG.5 — `theo_list_project_knowledge` (MODIFIED (B5a→B5c))

ALLOWED DELTA: the access predicate adds `OR id IN (member rows)`. All else byte-identical to the deployed B5a handler.

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  err.isKnown = true;
  return err;
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);

  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  const projectId =
    req.query && typeof req.query.projectId === "string" ? req.query.projectId.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Query parameter 'projectId' is required and must be a valid UUID.", 400));
  }

  let client = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // B5c: resolve project ACCESS first — owned OR group-visible (B5a) OR shared-with-me (a
    // theo_project_members row). Explicit predicate (connection role's RLS is defense). Accessible →
    // list; exists but not accessible → 403; absent → 404. No leakage of private projects.
    const access = await client.query(
      `
      SELECT 1 FROM public.theo_projects
      WHERE id = $1
        AND (
          created_by = $2
          OR visibility = 'group'
          OR id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = $2)
        )
      `,
      [projectId, oid]
    );
    if (access.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_project_exists_unscoped($1::uuid) AS e`,
        [projectId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this project.", 403)
        : buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // Knowledge belongs to the project (rows carry the owner's created_by). Access is authorized
    // above, so list ALL of the project's knowledge — a shared project shares its knowledge /
    // instructions with members (config-only sharing). No created_by filter here.
    const result = await client.query(
      `
      SELECT
        id,
        project_id,
        title,
        source_type,
        content,
        created_at
      FROM public.theo_project_knowledge
      WHERE project_id = $1
      ORDER BY created_at ASC, id ASC
      LIMIT 500
      `,
      [projectId]
    );

    return send(context, 200, successBody({ knowledge: result.rows }));
  } catch (err) {
    context.log.error("theo_list_project_knowledge failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this project.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

**§FJ.5 — `theo_list_project_knowledge.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_list_project_knowledge"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### §HG.6 — `theo_set_conversation_project` (MODIFIED (B5a→B5c))

ALLOWED DELTA: the accessible-project predicate adds `OR id IN (member rows)`. All else byte-identical to the deployed B5a handler.

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  if (typeof req.body === "object") {
    return req.body;
  }
  return {};
}

function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code;
  err.status = status;
  err.isKnown = true;
  return err;
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);

  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  const conversationId = typeof body.conversation_id === "string" ? body.conversation_id.trim() : "";
  if (!isUuid(conversationId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'conversation_id' is required and must be a valid UUID.", 400));
  }
  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // B5c: the referenced project must be ACCESSIBLE to the caller — owned OR group-visible (B5a)
    // OR shared-with-me (a theo_project_members row). The connection role's RLS is defense, so FK
    // existence does NOT prove access. A member may link their OWN conversation to a shared project
    // (config-only sharing: their chat, the shared project). Not accessible → 404 (no leakage).
    const accessibleProject = await client.query(
      `
      SELECT 1 FROM public.theo_projects
      WHERE id = $1
        AND (
          created_by = $2
          OR visibility = 'group'
          OR id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = $2)
        )
      `,
      [projectId, oid]
    );
    if (accessibleProject.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Project not found.", 404);
    }

    // Fetch the conversation owner-scoped; 0 rows → 403 (existing-foreign) / 404 (absent) via helper.
    const conv = await client.query(
      `SELECT id, project_id FROM public.theo_conversations WHERE id = $1 AND created_by = $2`,
      [conversationId, oid]
    );
    if (conv.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [conversationId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      throw exists
        ? buildKnownError("FORBIDDEN", "You do not have access to this conversation.", 403)
        : buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Set the project link only when currently unset (a conversation belongs to one project, set
    // once). Idempotent: an already-linked conversation returns its current project_id unchanged.
    let resultProjectId = conv.rows[0].project_id;
    if (resultProjectId == null) {
      const updated = await client.query(
        `
        UPDATE public.theo_conversations
        SET project_id = $1, updated_at = now()
        WHERE id = $2 AND created_by = $3 AND project_id IS NULL
        RETURNING project_id
        `,
        [projectId, conversationId, oid]
      );
      resultProjectId = updated.rowCount > 0 ? updated.rows[0].project_id : projectId;
    }

    await client.query("COMMIT");

    return send(context, 200, successBody({ conversation_id: conversationId, project_id: resultProjectId }));
  } catch (err) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch {}
    }

    context.log.error("theo_set_conversation_project failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    // FK violation: project_id not owned or absent (defensive; validated above).
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

**§FJ.6 — `theo_set_conversation_project.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_set_conversation_project"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

---

## §PARITY — Structural mirror parity

- **GREENFIELD (§HG.1–3)** reuse the Primary Reference boilerplate verbatim (send / nowIso / errorBody / successBody / getPrincipal / getClaimValue / parseBody / buildKnownError / isUuid) and its owner-scope idiom: `set_config` triad → owner predicate (`id AND created_by`) → 0-row → `theo_project_exists_unscoped` → 403/404 → error map. `theo_list_project_members` drops `parseBody` (GET) exactly as the deployed `theo_list_project_knowledge` does.
- **MODIFIED (§HG.4–6)** are the deployed B5a handlers with the single ALLOWED DELTA of the `OR id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = $n)` predicate (and `shared_with_me` in list_projects). Diff against the B5a package files modulo that delta confirms byte-parity of all boilerplate + error mapping.

---

## §DEPLOY (Walter, Pass 3)
1. Run `b5c_migration.sql` against `vaultgpt-postgres-prod` (schema `public`) as the migration role; then `b5c_verify.sql` (read-only) to confirm the table + membership/broadened policies (no SECURITY DEFINER helper is created).
2. Create three new functions on `vaultgpt-func-premium`: `theo_share_project`, `theo_unshare_project`, `theo_list_project_members` (index.js + function.json each).
3. Redeploy the three MODIFIED functions: `theo_list_projects`, `theo_list_project_knowledge`, `theo_set_conversation_project` (B4d lesson — each modified handler needs its own redeploy).
4. Restart the Function App. Then Claude Code runs §CURL.

## §CURL (Claude Code golden verification, post-deploy)
Two users (owner O, member M) via az-acquired delegated tokens (never printed):
1. **O creates/owns a project P** (existing theo_create_project). `theo_list_projects` as **M** does NOT list P.
2. **O `theo_share_project` {P, M.oid}** → 200 `{shared:true}`. `theo_list_projects` as **M** now lists P with `is_owner=false, shared_with_me=true`.
3. **M `theo_list_project_knowledge` ?projectId=P** → 200 (reads O's knowledge). **M `theo_set_conversation_project`** links M's own conversation to P → 200.
4. **M `theo_share_project`/`theo_unshare_project`/`theo_list_project_members` on P** → 403 (owner-only). **M** cannot invite others.
5. **O `theo_list_project_members` ?projectId=P** → 200 lists M. **O `theo_unshare_project` {P, M.oid}** → 200; `theo_list_projects` as **M** no longer lists P; **M** knowledge read → 403.
6. **Self-invite** (O invites O) → 400. **Bad UUID** → 400. **Unauthenticated** → 401.
7. **Private isolation:** a private, unshared project of O is never listed/readable by M (403/absent).

---

*End of Pass 1 Backend VEP.*
