import type {
  CommandContext,
  CommandLookup,
  CommandResult,
} from "@/terminal/types";
import { parseCommand } from "@/terminal/parse";

export async function executeCommand(
  input: string,
  registry: CommandLookup,
  context: CommandContext,
): Promise<CommandResult> {
  const parsed = parseCommand(input);

  if (!parsed) {
    return { kind: "noop" };
  }

  const command = registry.get(parsed.name);

  if (!command) {
    return { kind: "unknown", name: parsed.name };
  }

  return command.run(parsed, registry, context);
}
