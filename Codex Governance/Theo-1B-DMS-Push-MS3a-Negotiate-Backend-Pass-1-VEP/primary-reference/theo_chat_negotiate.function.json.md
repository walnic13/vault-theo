# Primary Reference (Golden Handler §2) — deployed `theo_chat_negotiate` `function.json`

Deployed on `vaultgpt-func-chat` (classic v4). Inlined FULL VERBATIM. `dms_negotiate/function.json` is an EXACT mirror modulo the `route` value (`dms_negotiate` vs `theo_chat_negotiate`): same anonymous httpTrigger, same `get`/`options` methods, same `req`/`res` binding shape.

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_chat_negotiate"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```
