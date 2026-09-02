import { clearCommand } from "@/terminal/commands/clear";
import { helpCommand } from "@/terminal/commands/help";
import { createCommandRegistry } from "@/terminal/registry";
import type { CommandDefinition } from "@/terminal/types";

/**
 * Minimal public command set. Register additional commands here
 * (or pass them into createCommandRegistry) without changing the terminal UI.
 */
export const publicCommands: readonly CommandDefinition[] = [
  helpCommand,
  clearCommand,
];

export function createPublicCommandRegistry(
  extra: readonly CommandDefinition[] = [],
) {
  return createCommandRegistry([...publicCommands, ...extra]);
}
