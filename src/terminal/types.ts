import type { VaultCwd } from "@/terminal/vault-path";
import type { VaultClient } from "@/terminal/vault-client";

export type ParsedCommand = {
  raw: string;
  name: string;
  args: readonly string[];
};

export type CommandResult =
  | { kind: "noop" }
  | { kind: "unknown"; name: string }
  | { kind: "clear" }
  | { kind: "help"; commands: readonly CommandHelpEntry[] }
  | { kind: "lines"; lines: readonly string[]; tone?: "default" | "error" }
  | {
      kind: "chdir";
      path: VaultCwd;
      lines: readonly string[];
      tone?: "default" | "error";
    };

export type CommandHelpEntry = {
  name: string;
  aliases: readonly string[];
  summaryKey: string;
};

export type VaultCopy = {
  notConfigured: string;
  locked: string;
  unlocked: string;
  invalidPassword: string;
  rateLimited: string;
  usageUnlock: string;
  listingRoot: string;
  listingOpen: string;
  noEntry: string;
  nowHere: string;
  lockedAgain: string;
};

export type CommandContext = {
  cwd: VaultCwd;
  vault: VaultClient;
  vaultCopy: VaultCopy;
};

export type CommandDefinition = {
  name: string;
  aliases?: readonly string[];
  summaryKey: string;
  hidden?: boolean;
  run: (
    parsed: ParsedCommand,
    registry: CommandLookup,
    context: CommandContext,
  ) => CommandResult | Promise<CommandResult>;
};

export type CommandLookup = {
  get(name: string): CommandDefinition | undefined;
  list(): readonly CommandDefinition[];
};
