// 1A MOCK gateway. NO network call, NO credential, NO browser→Anthropic/Foundry call
// (FE Governor §6; 1A handover §2.2/§6). Returns a deterministic stub reply in the
// STANDARD ANTHROPIC MESSAGES API shape, so the real Foundry-backed gateway (1B) drops in
// behind this contract with no surface change. The real gateway is a vault-theo server-side
// endpoint (e.g. POST /api/theo/message) holding Foundry creds via Entra managed identity.
import type { GatewayRequest, GatewayResponse } from "../types";

export async function sendMessage(req: GatewayRequest): Promise<GatewayResponse> {
  const last = [...req.messages].reverse().find((m) => m.role === "user")?.content ?? "";
  await new Promise<void>((r) => setTimeout(r, 450)); // simulate latency so the loading state shows
  const wantsArtifact = /\b(draft|email|letter|memo|checklist|table|summary|plan|template|code)\b/i.test(last);
  let text =
    `This is a mock reply from the Theo 1A gateway stub — no live model is wired yet; this in-repo ` +
    `mock exercises the surface against the standard Messages API contract.\n\n` +
    `You said: "${last.slice(0, 240)}"`;
  if (wantsArtifact) {
    text =
      `Drafted below — open it in the side panel. Ask again with the same request to create a v2.\n\n` +
      `[[ARTIFACT title="Mock Deliverable" type="document"]]\n` +
      `# Mock Deliverable\n\n` +
      `A mock artifact from the 1A gateway stub, exercising the Artifacts side panel and versioning.\n\n` +
      `- Replace this with a real Foundry-Claude response in 1B.\n` +
      `- The \`[[ARTIFACT]]\` marker protocol is preserved exactly.\n` +
      `[[/ARTIFACT]]`;
  }
  return { content: [{ type: "text", text }] };
}
