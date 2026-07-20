# Primary Reference (Golden Handler §2) — deployed `theo_transcribe_audio` `function.json`

Retrieved this turn from the live Kudu VFS (`/site/wwwroot/theo_transcribe_audio/function.json`, HTTP 200). Inlined FULL VERBATIM. Establishes the deployed classic-v4 binding idiom (anonymous httpTrigger, `post`/`options`, named `req`/`res`, per-function `route`). Pass-4 changes NO binding — `dms_subscribe/function.json` is unchanged from MS1 Pass-1 (already `post`/`options`, route `dms_subscribe`).

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_transcribe_audio"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```
