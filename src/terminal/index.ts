export { parseCommand } from "@/terminal/parse";
export { executeCommand } from "@/terminal/execute";
export { createCommandRegistry } from "@/terminal/registry";
export {
  createPublicCommandRegistry,
  publicCommands,
} from "@/terminal/commands/public";
export { formatCommandResult } from "@/terminal/format";
export {
  displayCommandLine,
  historyCommandLine,
  splitUnlockDraft,
} from "@/terminal/vault-path";
export {
  historyValue,
  pushHistory,
  stepHistory,
  TERMINAL_HISTORY_LIMIT,
} from "@/terminal/history";
export type {
  CommandContext,
  CommandDefinition,
  CommandLookup,
  CommandResult,
  ParsedCommand,
  VaultCopy,
} from "@/terminal/types";
