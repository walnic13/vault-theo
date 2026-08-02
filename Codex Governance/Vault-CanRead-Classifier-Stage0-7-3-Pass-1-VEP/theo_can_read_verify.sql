-- theo_can_read_verify.sql — READ-ONLY verification for Stage-0 §7.3 (theo_can_read). No writes; safe to re-run.
-- Run post-migration. All statements are SELECT / set_config (session-local) only.

-- ── 1) CATALOG: function exists, SECURITY DEFINER, search_path pinned, EXECUTE to authenticated (not PUBLIC) ──
SELECT p.proname,
       p.prosecdef                                                   AS is_security_definer,   -- expect t
       pg_get_function_identity_arguments(p.oid)                     AS args,                  -- 6-arg signature
       (SELECT string_agg(cfg, ', ') FROM unnest(p.proconfig) cfg)   AS settings,              -- expect search_path=public
       pg_catalog.array_to_string(p.proacl, ' ')                     AS acl                    -- expect authenticated=X, no PUBLIC=X
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname = 'public' AND p.proname = 'theo_can_read';

-- ── 2) FUNCTIONAL (read-only). Fixtures = the deployed §7.2 golden-curl test items in project 'Test 2'
--       (5e70e748-81f2-423b-8e55-a9bb10717915), all owned by Walter (225f17d0-…, the project creator + a partner).
--       Substitute a real non-owner member OID for the floor matrix (see §2c); the full firm-role-floor matrix is
--       exercised end-to-end by the §7.4 handler (which resolves a real associate's firm role via OBO).

-- 2a) OWNER reads their OWN L1.5 context items of every type ⇒ all TRUE (owner shortcut, any firm role)
SELECT set_config('request.jwt.claim.sub', '225f17d0-18bb-48f1-b4e2-addd4048c2b8', false);
SELECT info_type,
       public.theo_can_read('L1.5', NULL, id, project_id, 'partner', NULL) AS owner_reads   -- expect TRUE for all
  FROM public.theo_project_context_items
 WHERE project_id = '5e70e748-81f2-423b-8e55-a9bb10717915'
 ORDER BY info_type;

-- 2b) A NON-MEMBER caller (random OID, not owner, not a project member) ⇒ FALSE for every item, any firm role
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000ab', false);
SELECT info_type,
       public.theo_can_read('L1.5', NULL, id, project_id, 'partner', NULL) AS nonmember_reads  -- expect FALSE for all
  FROM public.theo_project_context_items
 WHERE project_id = '5e70e748-81f2-423b-8e55-a9bb10717915'
 ORDER BY info_type;

-- 2c) INFO-TYPE FLOOR (needs a real non-owner MEMBER of 'Test 2'). With that member's OID as caller:
--       commercial → TRUE only if firm ∈ {partner,director,senior_manager}; governance → {…,manager};
--       personnel → {partner,director}; factual/technical/deliberative → TRUE on membership alone.
--     Example (replace <MEMBER_OID>): an associate-level member must be DENIED the three restricted tags:
--       SELECT set_config('request.jwt.claim.sub', '<MEMBER_OID>', false);
--       SELECT info_type,
--              public.theo_can_read('L1.5', NULL, id, project_id, 'associate', NULL) AS assoc_member_reads
--         FROM public.theo_project_context_items
--        WHERE project_id = '5e70e748-81f2-423b-8e55-a9bb10717915' ORDER BY info_type;
--       -- expect: factual/technical/deliberative TRUE; commercial/governance/personnel FALSE (fail-closed).

-- 2d) UNRESOLVED firm role (NULL) as a non-owner member ⇒ restricted tags FALSE (least-privileged). Same shape as 2c
--     with p_firm_role => NULL.

-- 2e) L1 personal memory — INVIOLABLE. The owner reads their own row ⇒ TRUE; anyone else ⇒ FALSE.
--       (pick any theo_user_memory row the test caller owns; scope='user')
SELECT set_config('request.jwt.claim.sub', '225f17d0-18bb-48f1-b4e2-addd4048c2b8', false);
SELECT public.theo_can_read('L1', NULL, id, NULL, NULL, NULL) AS owner_reads_own_L1   -- expect TRUE
  FROM public.theo_user_memory
 WHERE created_by = '225f17d0-18bb-48f1-b4e2-addd4048c2b8' AND scope = 'user'
 LIMIT 1;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000ab', false);
SELECT public.theo_can_read('L1', NULL, id, NULL, NULL, NULL) AS other_reads_L1        -- expect FALSE
  FROM public.theo_user_memory
 WHERE created_by = '225f17d0-18bb-48f1-b4e2-addd4048c2b8' AND scope = 'user'
 LIMIT 1;

-- 2f) L2 / L3 (reserved) ⇒ FALSE (fail-closed until those schemas land)
SELECT public.theo_can_read('L2', NULL, gen_random_uuid(), NULL, 'partner', NULL) AS l2_reads,  -- expect FALSE
       public.theo_can_read('L3', NULL, gen_random_uuid(), NULL, 'partner', NULL) AS l3_reads;  -- expect FALSE
