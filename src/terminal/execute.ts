import { parseCommand } from "@/terminal/parse";
import type { CommandLookup, CommandResult } from "@/terminal/types";

export function executeCommand(
  input: string,
  registry: CommandLookup,
): CommandResult {
  const parsed = parseCommand(input);

  if (!parsed) {
    return { kind: "noop" };
  }

  const command = registry.get(parsed.name);

  if (!command) {
    return { kind: "unknown", name: parsed.name };
  }

  return command.run(parsed, registry);
}
