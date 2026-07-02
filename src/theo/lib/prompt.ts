// System-prompt assembly + greeting — ported verbatim from VA-T1 (L84–107).
// In 1A this feeds the mock gateway; in 1B it feeds the real gateway / system-prompt
// assembly seam unchanged.
import type { Project, StyleKey } from "../types";
import { BASE_PROMPT, ARTIFACT_RULES, USER_NAME } from "../swapBlock";
import { STYLES } from "../data";

export function buildSystemPrompt(styleKey: StyleKey, custom: string, project: Project | null, userName?: string): string {
  let p = BASE_PROMPT + (STYLES.find((s) => s.key === styleKey)?.mod || "") + ARTIFACT_RULES;
  // Personalization: tell Theo who it is working with (the signed-in Vault user's display name, from
  // theo_list_people isSelf). Presentational context only — Theo may address the user by name.
  if (userName && userName.trim()) p += ` You are speaking with ${userName.trim()}.`;
  if (custom.trim()) p += " Standing guidance from the team: " + custom.trim();
  if (project) {
    p += `\n\nYou are working inside the project "${project.name}". Project instructions: ${project.instructions || "(none)"}.`;
    if (project.knowledge.length) {
      p += " Project knowledge you may reference:\n";
      project.knowledge.forEach((k) => { p += `\n--- ${k.title} ---\n${k.content}\n`; });
    }
  }
  return p;
}

export function greeting(name?: string): string {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  // Prefer the signed-in user's first name (theo_list_people isSelf); fall back to the static
  // USER_NAME, then to the bare time-of-day greeting. Matches the Claude "Good evening, <name>" home.
  const who = (name && name.trim()) || USER_NAME;
  return who ? `${part}, ${who}` : part;
}
