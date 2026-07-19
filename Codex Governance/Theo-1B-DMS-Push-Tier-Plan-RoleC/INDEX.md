# Codex Governance Package — Theo Backend Plan: Tier DMS-Push (Role-C)

Pass-4 Role-C documentation-update. Adds a new **Tier DMS-Push** to the Theo Phase 1B Backend Plan §7 (after Tier Export, before §8) — the P1 governed-plan anchor that authorizes `vaultgpt-func-chat` to host the DMS live-mirror **Layer 3** real-time change-notification infrastructure (Graph subscriptions + Web PubSub fan-out), so the subsequent DMS-Push backend VEP has a plan entry to cite (P1). Additive only (+one tier block, no deletions). Substance = Walter-directed (2026-07-19), mirroring the existing Walter-directed Tier Voice / Tier Export additions.

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Pass 4 — Documentation-update package (Role-C authoring/landing)
Grounding Mode: Full Baseline Grounding
Pass: Pass 4
Sub-phase Track: N/A
Turn issued against HEAD: vault-theo `b539b0a966a607f23eec611f88b1ecaf94bfd394` (the commit that lands this amendment + package; grounding reads were against parent `3b4b7cd`)
Currency-anchor form: git blob SHA at parent HEAD (Conformance §2/§8 fallback; the cited region is a structural table/tier block).
```

| # | Document (absolute path) | Read this turn | Currency anchor (blob SHA @ parent) |
|---|--------------------------|----------------|--------------------------------------|
| 1 | THEO PHASE 1B BACKEND PLAN — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1B_BACKEND_PLAN.md | Read §7 (Tier Voice + Tier Export templates; §8 boundary) this turn | `c864966864e2b79e6febb6a7367fb82b8f3d0efc` |
| 2 | THEO GROUNDING CONFORMANCE STANDARD — …/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | Read §3/§4/§4A (P1 anchor requirement; Role-C turn type) this turn | (structural; §4A.1 P1 row) |
| 3 | THEO GOLDEN HANDLER STANDARD — …/governance/THEO_GOLDEN_HANDLER_STANDARD.md | Read §4 (new-external-interaction gate — the Graph subscription endpoints, Walter-authorized) this turn | (structural; §4) |

## Rule Anchor Table

| Source doc | Clause id | Verbatim clause text | Applied in output at |
|------------|-----------|----------------------|----------------------|
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §1 living-plan | "It is a *living* plan: each backend microstep updates the three Theo backend authority docs" | Tier DMS-Push follows the living-plan tier idiom (Contracts + Completion gate rows) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "A **new-domain or new-external-system helper**" | The Graph `/v1.0/subscriptions` endpoints declared as an allowed delta under the verbatim Walter authorization (recorded in the tier) |

## The edit (additive; applied this turn)

**Target:** `governance/THEO_PHASE_1B_BACKEND_PLAN.md` §7 — insert a new `### Tier DMS-Push — DMS live-mirror change-notifications (PROPOSED — Walter-directed 2026-07-19)` block immediately after the Tier Export block (its `Completion gate` line) and before the `---` preceding `## 8`. No other text changed.

**Tier content (as landed):** Purpose (func-chat hosts the L3 stateful subscription + fan-out plumbing; DMS semantics stay in vault-dms; trigger-only signal → delegated `dms_delta` preserves per-user trimming); Authorizations (Walter 2026-07-19: Graph subscription endpoints + admin-consent); Deliverables (DMS-Push-MS1 spine: `dms_change_subscriptions` migration + `dms_notifications` receiver + `dms_subscribe`; DMS-Push-MS2 renewal timer); Deploy target (`vaultgpt-func-chat`, DR-T7); Contracts (new API Spec + Schema + Golden Handler rows, PROPOSED); Completion gate (VEP → Codex → Walter migration → deploy + handshake/subscribe verify → Role-C to DEPLOYED; external prereqs: admin-consent applied ✓, notification endpoint reachable).

**Post-edit plan blob:** recorded by the landing commit.

## Boundary / provenance
Documentation-only; no code, no runtime, no schema change in this package. It only creates the P1 plan anchor + records the Walter authorizations so the DMS-Push backend VEP can ground against it. Reviewer: Codex (Theo backend, Pass-4 byte-verification of the additive tier).

## Requested action
Codex Pass-2/Pass-4: byte-verify the additive Tier DMS-Push block against the §7 tier template and confirm the Walter authorizations are recorded. On APPROVED it is authoritative and the DMS-Push-MS1 backend VEP may cite it as its P1 anchor.
