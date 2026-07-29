# Primary Reference (deployed, byte-verbatim) — `theo_chat_mark_read/function.json`

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_mark_read"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```
