// Shared types — mirror the reference surface's in-memory shapes exactly (CCT §2A).
import type { JSX } from "react";

export type Role = "user" | "assistant";
export interface Message { role: Role; content: string }

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

export interface GatewayRequest { model: string; max_tokens: number; system: string; messages: Message[] }
export interface GatewayResponse { content: { type: string; text?: string }[] }

export interface Settings { styleKey: StyleKey; custom: string }
