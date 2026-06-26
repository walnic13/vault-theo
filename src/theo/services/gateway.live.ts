// 1B LIVE gateway. Calls the deployed server-side Theo model gateway
// (POST `${VITE_FUNCTIONS_URL}/api/theo_message`; HF-T1 Foundry-Claude broker). The gateway holds
// the model credential server-side — the browser never sees a model key. The call is CROSS-ORIGIN
// to the Functions app (mirroring Origin's reporting clients: absolute base URL + Bearer, NOT a
// same-origin `/api/*` proxy — Origin's SWA has none), so the user's Entra access token is attached
// as `Authorization: Bearer` for the Functions app's EasyAuth. That is the SAME token Origin already
// mints for reporting (`api://<app-id>/access_as_user`) — golden-curl-verified 200 against the
// deployed handler. NO browser storage (1A handover §2.5).
//
// Until a live backend is configured (no `VITE_FUNCTIONS_URL` and no `configureGateway` token/base),
// this delegates to the in-repo 1A mock so the standalone vault-theo dev harness keeps working.
import type { GatewayRequest, GatewayResponse } from "../types";
import { sendMessage as mockSend } from "./gateway.mock";

type TokenProvider = () => Promise<string | null>;

function normalizeBase(v: unknown): string {
  return typeof v === "string" ? v.replace(/\/+$/, "") : "";
}

let tokenProvider: TokenProvider | null = null;
let apiBase: string = normalizeBase((import.meta.env as Record<string, unknown>).VITE_FUNCTIONS_URL);

// Configured once by the federated TheoSurface mount with the Origin shell's token provider (and,
// optionally, the Functions base URL). Supplying a token provider switches this gateway mock → live.
export function configureGateway(opts: { getAccessToken?: TokenProvider | null; baseUrl?: string | null }): void {
  if (opts.getAccessToken !== undefined) tokenProvider = opts.getAccessToken;
  if (opts.baseUrl != null) apiBase = normalizeBase(opts.baseUrl);
}

export async function sendMessage(req: GatewayRequest): Promise<GatewayResponse> {
  // No live backend wired (standalone dev harness) → preserve the 1A mock behavior unchanged.
  if (!apiBase && !tokenProvider) {
    return mockSend(req);
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (tokenProvider) {
    const token = await tokenProvider();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  // GatewayRequest {model, max_tokens, system, messages} → body {max_tokens, system, messages}.
  // The handler injects the configured model (THEO_FOUNDRY_DEPLOYMENT); the client's `model` is unused.
  const res = await fetch(`${apiBase}/api/theo_message`, {
    method: "POST",
    credentials: "same-origin",
    headers,
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

  // Non-2xx → surface the handler's `{ error: { message } }` (the existing chat error state shows it).
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
