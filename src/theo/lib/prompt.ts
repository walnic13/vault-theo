// System-prompt assembly + greeting — ported verbatim from VA-T1 (L84–107).
// In 1A this feeds the mock gateway; in 1B it feeds the real gateway / system-prompt
// assembly seam unchanged.
import type { Project, StyleKey } from "../types";
import { BASE_PROMPT, ARTIFACT_RULES, USER_NAME } from "../swapBlock";
import { STYLES } from "../data";

export function buildSystemPrompt(styleKey: StyleKey, custom: string, project: Project | null): string {
  let p = BASE_PROMPT + (STYLES.find((s) => s.key === styleKey)?.mod || "") + ARTIFACT_RULES;
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

export function greeting(): string {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return USER_NAME ? `${part}, ${USER_NAME}` : part;
}
