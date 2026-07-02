# Codex Governance Package — Theo 1B B5d Owner "Shared" Badge (backend) Pass-1 VEP

- **Main artifact:** `Theo_1B_B5d_Owner_Shared_Badge_Backend_VEP.md` — Pass-1 backend VEP (plan + modified handler). Reviewer = Codex (Pass 2).
- **Why:** Walter observed on the SWA (2026-07-02) that a **private project shared with specific members** shows **no grid badge for the owner** (only `visibility='group'` badges today). `theo_list_projects` returns `is_owner`/`visibility`/`shared_with_me` (="am I an invitee") but no signal that an owner's project has invitees.
- **Change:** one MODIFIED handler (`theo_list_projects`) gains an **owner-gated `member_count`** column — `CASE WHEN created_by = $1 THEN (SELECT count(*) FROM theo_project_members …) ELSE 0 END` — so a non-owner never learns another project's co-member count. **No migration, no new table/endpoint/RLS.** Single additive SELECT expression; all else byte-identical to the deployed B5c handler.
- **Primary Reference:** deployed B5c `theo_list_projects` pair (inlined §SM/§SM-FJ).
- **Validation:** `node --check` clean; single-delta diff vs B5c confirmed; microstep lint → PASS. HEAD `cf40248`.
- **Pipeline:** on APPROVAL → Walter redeploys the one function → Claude Code golden curl (owner private+invite → `member_count>0`; non-owner → 0) → **B5d-FE** (grid badge "Shared" when `visibility==='group' || memberCount>0`) → next §2.2 Role-C touch notes `member_count`.
