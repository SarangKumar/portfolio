import type { CommandResult } from "@/terminal/types";

export type TerminalCopy = {
  unknown: string;
  helpIntro: string;
  commandSummaries: Readonly<Record<string, string>>;
};

export type FormattedOutput = {
  clear: boolean;
  lines: readonly string[];
  tone: "default" | "error";
};

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

export function formatCommandResult(
  result: CommandResult,
  copy: TerminalCopy,
): FormattedOutput {
  if (result.kind === "noop") {
    return { clear: false, lines: [], tone: "default" };
  }

  if (result.kind === "clear") {
    return { clear: true, lines: [], tone: "default" };
  }

  if (result.kind === "unknown") {
    return {
      clear: false,
      lines: [interpolate(copy.unknown, { name: result.name })],
      tone: "error",
    };
  }

  if (result.kind === "help") {
    const listings = result.commands.map((command) => {
      const summary = copy.commandSummaries[command.name] ?? command.summaryKey;
      const aliases =
        command.aliases.length > 0 ? ` (${command.aliases.join(", ")})` : "";

      return `${command.name}${aliases} — ${summary}`;
    });

    return {
      clear: false,
      lines: [copy.helpIntro, ...listings],
      tone: "default",
    };
  }

  return { clear: false, lines: result.lines, tone: "default" };
}
