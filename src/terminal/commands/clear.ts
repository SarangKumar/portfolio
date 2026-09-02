import type { CommandDefinition } from "@/terminal/types";

export const clearCommand: CommandDefinition = {
  name: "clear",
  aliases: ["cls", "reset"],
  summaryKey: "commands.clear",
  run() {
    return { kind: "clear" };
  },
};
