// Shared types — mirror the reference surface's in-memory shapes exactly (CCT §2A).
import type { JSX } from "react";

export type Role = "user" | "assistant";
// Web-grounding citation (from the gateway's web_search/web_fetch text blocks; API Spec §2.1).
export interface Citation { url: string; title: string; cited_text?: string }
// A cited span: a run of assistant text followed by the citations attached to it.
export interface CitedRun { text: string; citations: Citation[] }
export interface Message { role: Role; content: string; runs?: CitedRun[] }

export interface Knowledge { id: string; title: string; content: string }
export interface Project {
  id: string; name: string; desc: string; updated: string;
  instructions: string; knowledge: Knowledge[];
}

export type ArtifactType = "document" | "code" | "html";
export interface ArtifactVersion { content: string; ts: number }
export interface Artifact { id: string; title: string; type: ArtifactType; versions: ArtifactVersion[] }
export interface ArtifactBlock { title: string; type: ArtifactType; content: string }

export type StyleKey = "normal" | "concise" | "explanatory" | "formal";
export interface Style { key: StyleKey; label: string; desc: string; mod: string }

export interface OpenArtifact { id: string; v: number }   // v < 0 ⇒ latest version
export type View = "chats" | "projects" | "project" | "artifacts" | "customize";

export type IconComp = (props: { s?: number }) => JSX.Element;
export interface NavItem { key: View; label: string; Icon: IconComp }

export interface NpDraft { name: string; desc: string; instructions: string }
export interface KDraft { title: string; content: string }

export interface GatewayRequest {
  model: string; max_tokens: number; system: string; messages: Message[];
  conversation_id?: string;                          // B3a: omit to start a new thread
  app_key?: string | null;                           // B3a: persisted on a new conversation
  app_context?: Record<string, unknown> | null;      // B3a: opaque anchor (jsonb)
}
export interface GatewayResponse {
  content: { type: string; text?: string; citations?: { url?: string; title?: string; cited_text?: string }[] }[];
  conversation_id?: string;                          // B3a: server-assigned/echoed thread id
}

// Conversation history (B3b read endpoints; API Spec §2.1). Recents + reload.
export interface ConversationSummary {
  id: string; title: string; model: string | null;
  project_id: string | null; app_key: string | null;
  created_at: string; updated_at: string;
}
export interface PersistedMessage {
  id: string; seq: number; role: Role; content: string;
  model: string | null;
  citations: { url?: string; title?: string; cited_text?: string }[] | null;
  created_at: string;
}
export interface ConversationDetail {
  conversation: ConversationSummary & { app_context?: Record<string, unknown> | null };
  messages: PersistedMessage[];
}

export interface Settings { styleKey: StyleKey; custom: string }

// App-context (Pass B) — the anchor Origin broadcasts to the hosted Theo surface in-process
// (App Host §6A; VA-T3 §2.4; API Spec §2.5). app_key = active app (null = Origin-level general
// chat); app_context = opaque jsonb anchor (e.g. { workpaper_id, period_id }). Carried on the
// conversation in 1A (in-memory); 1B → theo_conversations.app_key / app_context. Context-only.
export interface AppContext { app_key: string | null; app_context: Record<string, unknown> | null }
