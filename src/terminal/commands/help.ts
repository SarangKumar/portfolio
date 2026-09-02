import type { CommandDefinition } from "@/terminal/types";

export const helpCommand: CommandDefinition = {
  name: "help",
  aliases: ["?"],
  summaryKey: "commands.help",
  run(_parsed, registry) {
    return {
      kind: "help",
      commands: registry.list().map((command) => ({
        name: command.name,
        aliases: command.aliases ?? [],
        summaryKey: command.summaryKey,
      })),
    };
  },
};
