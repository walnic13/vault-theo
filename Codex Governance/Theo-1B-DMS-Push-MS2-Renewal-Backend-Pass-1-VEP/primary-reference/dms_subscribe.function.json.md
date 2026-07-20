# Primary Reference (Golden Handler §2) — deployed `dms_subscribe` `function.json`

Deployed on `vaultgpt-func-chat` (classic v4). Inlined FULL VERBATIM. This is the HTTP-trigger binding of the Primary Reference handler. MS2's `dms_renew_subscriptions/function.json` is a **GREENFIELD** binding delta: a `timerTrigger` replaces the `httpTrigger` (no deployed timer handler exists on any func app — all 29 func-chat functions are httpTrigger, verified this turn), so there is no deployed timer function.json to mirror; the timer binding follows the standard Azure Functions v4 classic `timerTrigger` shape (NCRONTAB `schedule`).

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "dms_subscribe"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```
