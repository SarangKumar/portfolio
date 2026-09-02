import type { ParsedCommand } from "@/terminal/types";

export function parseCommand(input: string): ParsedCommand | null {
  const raw = input.trim();

  if (!raw) {
    return null;
  }

  const [name = "", ...args] = raw.split(/\s+/);

  return {
    raw,
    name: name.toLowerCase(),
    args,
  };
}
