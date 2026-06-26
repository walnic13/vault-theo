// 1B LIVE gateway. Same-origin call to the deployed server-side Theo model gateway
// (POST /api/theo_message; HF-T1 Foundry-Claude broker, holding the model credential
// server-side). Drops in behind the SAME `sendMessage(req): Promise<GatewayResponse>`
// contract as gateway.mock — NO surface change (FE Governor §6; Golden §5 ALLOWED DELTA).
// NO browser→model call, NO credential in the browser: the request is same-origin; the
// Origin SWA proxies /api/* to the Functions app and Easy Auth attaches identity.
// NO browser storage (1A handover §2.5) — request/response only.
import type { GatewayRequest, GatewayResponse } from "../types";

export async function sendMessage(req: GatewayRequest): Promise<GatewayResponse> {
  // GatewayRequest {model, max_tokens, system, messages} → body {max_tokens, system, messages}.
  // The handler injects the configured model (THEO_FOUNDRY_DEPLOYMENT); the client's `model` is not relied on.
  const res = await fetch("/api/theo_message", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      max_tokens: req.max_tokens,
      system: req.system,
      messages: req.messages,
    }),
  });

  let json: { data?: { content?: GatewayResponse["content"] }; error?: { message?: string } } | null = null;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Theo gateway returned a non-JSON response (HTTP ${res.status}).`);
  }

  // Non-2xx → surface the handler's `{ error: { message } }` (existing chat error state shows it).
  if (!res.ok) {
    throw new Error(json?.error?.message || `Theo gateway error (HTTP ${res.status}).`);
  }

  // Success envelope `{ data: { content: [{type:"text", text}], … }, meta }` → GatewayResponse { content }.
  const content = json?.data?.content;
  if (!Array.isArray(content)) {
    throw new Error("Theo gateway response missing data.content[].");
  }
  return { content };
}
