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
  | { kind: "lines"; lines: readonly string[] };

export type CommandHelpEntry = {
  name: string;
  aliases: readonly string[];
  summaryKey: string;
};

export type CommandDefinition = {
  name: string;
  aliases?: readonly string[];
  summaryKey: string;
  run: (parsed: ParsedCommand, registry: CommandLookup) => CommandResult;
};

export type CommandLookup = {
  get(name: string): CommandDefinition | undefined;
  list(): readonly CommandDefinition[];
};
