# Theo Frontend Governance — Theo Snapshot Storage Exception — Role-C authority amendment (Pass 4, documentation-update)

Walter authorized (2026-07-29) a **scoped browser-storage exception** for the Theo frontend so its cold-launch latency can be removed the same way the DMS remote's was: persist a small instant-paint snapshot to `localStorage`. Today Theo FE persists **nothing** (a hard 1A guardrail — Codex **T26** / **F-P6**), so every launch is a cold network fetch: `TheoSurface` mount fires `loadRecents` (`theo_list_conversations`, which blocks the restore gate) and then a serial `selectRecent` → `theo_get_conversation` for the last conversation, and `loadPeople` for the self-identity greeting. This amendment adds a **named, narrow exception** — modeled on the DMS Snapshot Storage Exception (Governor §6.3, vault-dms) — permitting the Theo FE to persist ONLY (a) the recents list, (b) the last-opened conversation's first page, and (c) the self-identity row, per authenticated principal, as an instant-paint seed that is **always revalidated on the governed API path**. Because the persisted snapshot never serves an unrevalidated read, it does **not** constitute a "snapshot lane bypassing the authority regime" (Architecture §, Singular audit story) — every real read remains an attributable API call; the cache only removes the blank cold-launch. The 1A "persistence is 1B" ban was always scoped to Phase 1A; we are in 1B. Substance authorized by Walter; this package stages the authority edits for Codex review. **No code in this package** — the paired Theo FE localStorage VEP carries the FE change and may cite this exception only once it is APPROVED.

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Pass 4 — Documentation-update (Role-C authority amendment)
Turn issued against HEAD: a39ac8e16781f954cea83063fd78f70fcf4fbe69 (development; grounding reads against this HEAD. Working tree carries only UNTRACKED non-blocking dirt — `.tmp/` scratch + four `artifacts/*.xlsx` workbook templates — none tracked, none governance/source; not used as grounding for this turn.)
Grounding Mode: Full Baseline Grounding
Pass: Pass 4
Sub-phase Track: N/A
```

Current-turn grounding: Read the Theo FE authority docs' storage-prohibition + audit-story sites at HEAD `a39ac8e` — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` item 3 "No browser storage" (blob `b9c0e11`, authority source), `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` F-P6 + T26 (blob `aca00866`), `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` "Singular audit story" (blob `07451ce9`), and `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (blob `e2b7e0b`). Confirmed vault-theo's copies carry the PLAIN ban (no pre-existing exception). Template: the DMS Snapshot Storage Exception (vault-dms) + its 2026-07-29 localStorage amendment.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|-------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | item 3 | "No browser storage." | §2/§3 — the authority-source ban amended to add the named Theo Snapshot Storage Exception |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | F-P6 | "no `localStorage`/`sessionStorage`" | §3 — F-P6 gains the exception carve-out |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | T26 | "`localStorage`/`sessionStorage` use" | §3 — T26 amended so the authorized exception does not trigger |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | Singular audit story | "no snapshot lane bypassing the authority regime" | §3b — reconciled: a revalidation-preserving instant-paint seed is not a bypassing snapshot lane |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | surface-fidelity guardrails | "no `localStorage`/`sessionStorage`" | §3 site 4 — the Codex reviewer's own storage guardrail gains the exception carve-out |

## §1 — Authorization
Walter, 2026-07-29 (this session): **"we should also upgrade theo as well, there is latency there that can be fixed with localstorage"**, and on the proposed shape: **"yep, that's the shape i want"** (modeled on the DMS exception — metadata/first-page + self-identity only, per-principal namespace + foreign-purge, mandatory revalidation, never tokens/secrets). Scope granted: the Theo FE (`vault-theo` `src/theo/`) may persist the instant-paint snapshot defined in §2 to browser storage.

## §2 — The exception (as it will read in the Governor)
The Theo FE MAY use `sessionStorage` or `localStorage` to persist an instant-paint snapshot consisting of ONLY: (a) the **recents list** (conversation summaries — ids, titles, last-touched timestamps as returned by `theo_list_conversations`); (b) the **last-opened conversation's first page** (the `theo_get_conversation` messages + their persisted citations/media metadata); and (c) the **self-identity row** (the `listPeople` self display name/id used for the greeting). Constraints (all BINDING): **metadata + first-page + self-identity ONLY** — never access tokens, secrets, credentials, model keys, or conversation history beyond the first page; **namespaced per authenticated principal** (Entra OID: `vault-theo:v1:<oid>:*`); because `localStorage` survives session end and Theo has no logout seam of its own, at-rest isolation is the per-principal namespace **plus an active purge of foreign-principal namespaces on mount**; employees-only origin; **ALWAYS paired with revalidation** — the snapshot is an instant-paint seed, never authoritative-stale, and the governed loaders (`theo_list_conversations` / `theo_get_conversation` / `listPeople`) always fetch fresh and overwrite; all writes try/guarded (quota/privacy-mode → in-memory behavior). All other Theo browser storage, and any other repo/surface, remains prohibited under this rule.

## §3 — Sweep (all four prohibition mention-sites, made consistent)
| # | Doc | Site | Edit (before → after) |
|---|-----|------|------------------------|
| 1 | CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | item 3 "No browser storage." (authority source) | Renamed "No browser storage — scoped exception."; full Theo Snapshot Storage Exception text (§2) added; "Persistence is 1B" retained (this IS the 1B persistence). |
| 2 | THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | F-P6 | "no `localStorage`/`sessionStorage`** (1A handover §2.5)" → "… **except the Theo Snapshot Storage Exception (Governor item 3 — scoped recents/first-page/self-identity snapshot, per-principal, always revalidated)**". |
| 3 | THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | T26 | "`localStorage`/`sessionStorage` use" → "… **(other than the Walter-authorized Theo Snapshot Storage Exception, Governor item 3 — which does NOT trigger T26)**". |
| 4 | CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | surface-fidelity guardrails (item 3, line 31) | "no `localStorage`/`sessionStorage`" → "no `localStorage`/`sessionStorage` **except the Walter-authorized Theo Snapshot Storage Exception (Governor item 3 — scoped recents/first-page/self-identity snapshot, per-principal, always revalidated), which is NOT a trigger**". |

## §3b — Architecture reconciliation (Singular audit story)
The "no snapshot lane bypassing the authority regime" principle (Architecture §, Singular audit story) is **preserved, not weakened**: the exception is defined so the snapshot NEVER serves an unrevalidated read — every mount still calls the governed loaders, which fetch fresh and overwrite the seed. The cache removes the blank cold-launch only; it is not an alternate read path. A one-line clause is added at that principle noting that "a revalidation-preserving instant-paint seed under the Theo Snapshot Storage Exception is not a snapshot lane within the meaning of this principle." (CODEX_THEO_FRONTEND_REVIEW_STANDARD.md has its OWN surface-fidelity storage guardrail — swept as site 4 in §3, mirroring the Governor/Conformance wording — so the reviewer gate that evaluates the paired FE VEP carries no unswept contradiction.)

## §4 — Boundary / provenance
Authority-doc documentation edit only; no code, no runtime, no API/contract change. The Governor Standard remains the authority source; Conformance + Architecture reference it. This amendment **enables** the paired **Theo FE localStorage VEP** (recents + last-opened conversation first page + self-identity → per-principal `localStorage`, seeded at `TheoSurface`/`useTheoState` mount, revalidated by the existing loaders), which is groundable only once this exception is APPROVED. Reviewer: Codex.

## §5 — Boundary reconciliation & Gap Register
- **Architecture boundary:** unchanged in substance — the governed API path remains the sole authoritative read; the exception adds a seed layer that is always revalidated (§3b). Content scope is strictly bounded (recents + first page + self-identity), never tokens/secrets/deep history.
- **Gap Register: NO-GAPS.** Substance Walter-authorized (§1); shape confirmed by Walter ("that's the shape i want"); the audit-story principle is explicitly reconciled (§3b); at-rest hygiene (per-principal namespace + foreign-purge) matches the DMS precedent; the ban was always scoped to 1A and we are in 1B.

## Mechanical lint
Command: `node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Snapshot-Storage-Exception-Role-C/INDEX.md" --repo-root .` — expect `PASS`.

## Requested action
Codex Pass-2 review of this authority amendment (consistency of the four-site sweep + the Architecture §3b reconciliation; scope faithful to Walter's 2026-07-29 authorization; the per-principal namespace + foreign-purge boundary and mandatory-revalidation adequacy). On APPROVED it is authoritative and the paired Theo FE localStorage VEP may cite it.
