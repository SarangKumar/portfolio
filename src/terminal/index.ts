export { parseCommand } from "@/terminal/parse";
export { executeCommand } from "@/terminal/execute";
export { createCommandRegistry } from "@/terminal/registry";
export {
  createPublicCommandRegistry,
  publicCommands,
} from "@/terminal/commands/public";
export { formatCommandResult } from "@/terminal/format";
export {
  historyValue,
  pushHistory,
  stepHistory,
  TERMINAL_HISTORY_LIMIT,
} from "@/terminal/history";
export type {
  CommandDefinition,
  CommandLookup,
  CommandResult,
  ParsedCommand,
} from "@/terminal/types";
