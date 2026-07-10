# Walter Authorization — G-READCLASS elevated cross-owner read class (Apps Phase C / C2)

**Date:** 2026-07-09
**Authority:** Walter (execution + governance-exemption authority)
**Package:** `Theo-1B-VCpush-C2-Push-Sender-Backend-Pass-1-VEP`
**Gate resolved:** Gap Register **G-READCLASS (ESCALATE)** in the C2 Pass-1 VEP.

## What is authorized
A new **elevated cross-owner read class**: a `SECURITY DEFINER` helper
`theo_chat_get_push_subscriptions(p_oids text[])` that returns other users'
Web Push subscription material (`endpoint`, `p256dh`, `auth`) to the
`theo_chat_send_message` HTTP handler, for the **sole purpose** of sending
Web Push notifications to a chat message's recipients.

This exceeds the pre-existing Golden Handler §3 SECURITY-DEFINER patterns
(existence helper / timer returning only identifiers), so per Golden Handler §4
it required an explicit Walter authorization predating the C2 Implementation
Package. This document is that authorization.

## Verbatim authorization
Walter, 2026-07-09, in response to the C2 G-READCLASS decision request:

> "yes, i authorize"

## Scope and bound mitigations (part of the authorization)
The authorization is scoped to the C2 design as planned, with these mitigations
binding on the Implementation Package:
- Recipient OIDs are **server-derived** from `theo_chat_threads.member_oids`
  (never taken from client input) and gated by the sender's own thread
  membership (the sender must be a member to read the thread).
- The helper returns **only** the RFC-8291-necessary fields
  (`endpoint`, `p256dh`, `auth`, `created_by`) — no other user content.
- `SET search_path = public, pg_temp`, `auth.uid()` guard, `REVOKE ALL FROM
  PUBLIC`, `GRANT EXECUTE TO authenticated` (invoked only by the func-chat DB
  role via the send handler; not reachable by end users directly).
- The push keys are Web Push **encryption** material (subscription public key +
  auth secret), not login/identity credentials.

This authorization does not generalize to any other cross-owner content read;
it is specific to Web Push recipient subscription material for the sender path.
