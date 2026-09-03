import { analyticsFolderCommands } from "@/terminal/commands/folder";
import { clearCommand } from "@/terminal/commands/clear";
import { helpCommand } from "@/terminal/commands/help";
import { createCommandRegistry } from "@/terminal/registry";
import type { CommandDefinition } from "@/terminal/types";

/**
 * Public command set plus hidden analytics folder commands.
 * Hidden commands are executable but omitted from help.
 */
export const publicCommands: readonly CommandDefinition[] = [
  helpCommand,
  clearCommand,
  ...analyticsFolderCommands,
];

export function createPublicCommandRegistry(
  extra: readonly CommandDefinition[] = [],
) {
  return createCommandRegistry([...publicCommands, ...extra]);
}
