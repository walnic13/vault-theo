# Theo 1B — VC-1 Native Chat API Spec + Schema documentation — Role-C Verbatim-Edit Handoff (package index)

**Regime:** Theo backend governance. **Type:** Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) — Claude Code authors exact before/after edits; **Codex executes them inline** (Pass 4). **Reviewer/executor:** Codex (APPROVED / REJECTED only). **Lint:** PASS.

## Purpose
Documents the **already-deployed + golden-verified** VC-1 native chat backend (7 handlers on `vaultgpt-func-chat`, 3 `theo_chat_*` tables) in the two governed specs. No behavior change — records deployed reality. Closes the VC-1 Gap Register future-trigger for the API Spec + Schema (the Phase 1B Plan tier entry folds into the plan's next amendment).

## Contents
| File | Role |
| ---- | ---- |
| `Theo_1B_VC1_API_Spec_Schema_RoleC.md` | GCR + Rule Anchor Table + 4 verbatim before/after edits. |

## The 4 edits (for Codex to apply verbatim)
1. `spec/THEO_API_SPEC.md` — insert new **§2.10 In-Vault chat / channels** group (4-contract table + participant-scope prose) immediately before `## §3 Boundary`.
2. `spec/THEO_AZURE_POSTGRES_SCHEMA.md` — §3 heading: cite `Tier VC-1 §8`.
3. `spec/THEO_AZURE_POSTGRES_SCHEMA.md` — §3 registry: add rows for `theo_chat_threads` / `theo_chat_thread_members` / `theo_chat_messages` after the `theo_attachments` row.
4. `spec/THEO_AZURE_POSTGRES_SCHEMA.md` — append new **§8 DEPLOYED DDL — Tier VC-1** section at EOF (participant-scoped RLS documented as the Codex-APPROVED deviation; canonical DDL pointer to the VC-1 migration).

## Key facts recorded
- 7 routes: negotiate / create_dm / create_channel / list_threads / list_messages / send_message / mark_read.
- Participant-scoped RLS (`auth.uid() = ANY(member_oids)`), non-recursive, no `_exists_unscoped` helper, no new elevated-read class — the Walter-authorized/Codex-APPROVED (VC-1 VEP `5d91bf2`) deviation from the §2 ownership baseline.
- Realtime via Azure Web PubSub (hub `vaultchat`), server-authoritative publish, receive-only client tokens.
- Deployed to `vaultgpt-func-chat` under Orchestration §1E/DR-T7; monolith + sidecar unchanged.
