import type { CommandDefinition, CommandLookup } from "@/terminal/types";

export class CommandRegistry implements CommandLookup {
  private readonly commands = new Map<string, CommandDefinition>();
  private readonly names = new Map<string, CommandDefinition>();

  register(command: CommandDefinition) {
    this.names.set(command.name.toLowerCase(), command);
    this.commands.set(command.name.toLowerCase(), command);

    for (const alias of command.aliases ?? []) {
      this.commands.set(alias.toLowerCase(), command);
    }
  }

  get(name: string): CommandDefinition | undefined {
    return this.commands.get(name.toLowerCase());
  }

  list(): readonly CommandDefinition[] {
    return [...this.names.values()]
      .filter((command) => !command.hidden)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function createCommandRegistry(
  commands: readonly CommandDefinition[] = [],
): CommandRegistry {
  const registry = new CommandRegistry();

  for (const command of commands) {
    registry.register(command);
  }

  return registry;
}
