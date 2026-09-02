import { describe, expect, it } from "@jest/globals";
import {
  createPublicCommandRegistry,
  executeCommand,
  formatCommandResult,
  historyValue,
  parseCommand,
  pushHistory,
  stepHistory,
  TERMINAL_HISTORY_LIMIT,
} from "@/terminal";
import type { CommandDefinition } from "@/terminal";

const copy = {
  unknown: "Command not found: {name}. Type help.",
  helpIntro: "Available commands:",
  commandSummaries: {
    help: "List available commands",
    clear: "Clear the terminal output",
  },
};

const ping: CommandDefinition = {
  name: "ping",
  summaryKey: "commands.ping",
  run() {
    return { kind: "lines", lines: ["pong"] };
  },
};

describe("parseCommand", () => {
  it("returns null for empty input", () => {
    expect(parseCommand("")).toBeNull();
    expect(parseCommand("   ")).toBeNull();
  });

  it("splits a command name and arguments", () => {
    expect(parseCommand("  Help  one  two ")).toEqual({
      raw: "Help  one  two",
      name: "help",
      args: ["one", "two"],
    });
  });
});

describe("executeCommand", () => {
  const registry = createPublicCommandRegistry();

  it("no-ops on empty input", () => {
    expect(executeCommand("   ", registry)).toEqual({ kind: "noop" });
  });

  it("runs help and its alias", () => {
    expect(executeCommand("help", registry)).toMatchObject({ kind: "help" });
    expect(executeCommand("?", registry)).toMatchObject({ kind: "help" });
  });

  it("runs clear aliases", () => {
    expect(executeCommand("clear", registry)).toEqual({ kind: "clear" });
    expect(executeCommand("cls", registry)).toEqual({ kind: "clear" });
    expect(executeCommand("reset", registry)).toEqual({ kind: "clear" });
  });

  it("returns unknown for unregistered commands", () => {
    expect(executeCommand("sudo", registry)).toEqual({
      kind: "unknown",
      name: "sudo",
    });
  });
});

describe("command registry", () => {
  it("lists unique public commands without requiring UI changes", () => {
    const registry = createPublicCommandRegistry([ping]);

    expect(registry.list().map((command) => command.name)).toEqual([
      "clear",
      "help",
      "ping",
    ]);
    expect(executeCommand("ping", registry)).toEqual({
      kind: "lines",
      lines: ["pong"],
    });
  });
});

describe("formatCommandResult", () => {
  const registry = createPublicCommandRegistry();

  it("formats unknown commands", () => {
    expect(formatCommandResult(executeCommand("nope", registry), copy)).toEqual(
      {
        clear: false,
        tone: "error",
        lines: ["Command not found: nope. Type help."],
      },
    );
  });

  it("formats help listings", () => {
    const formatted = formatCommandResult(
      executeCommand("help", registry),
      copy,
    );

    expect(formatted.clear).toBe(false);
    expect(formatted.lines[0]).toBe("Available commands:");
    expect(formatted.lines).toEqual(
      expect.arrayContaining([
        "clear (cls, reset) — Clear the terminal output",
        "help (?) — List available commands",
      ]),
    );
  });

  it("falls back to summaryKey for unregistered copy", () => {
    const formatted = formatCommandResult(
      executeCommand("help", createPublicCommandRegistry([ping])),
      copy,
    );

    expect(formatted.lines).toEqual(
      expect.arrayContaining(["ping — commands.ping"]),
    );
  });
});

describe("command history", () => {
  it("ignores blank entries and caps length", () => {
    expect(pushHistory(["help"], "  ")).toEqual(["help"]);

    const filled = Array.from({ length: TERMINAL_HISTORY_LIMIT }, (_, index) =>
      String(index),
    );
    const next = pushHistory(filled, "overflow");

    expect(next).toHaveLength(TERMINAL_HISTORY_LIMIT);
    expect(next[0]).toBe("1");
    expect(next.at(-1)).toBe("overflow");
  });

  it("steps through older and newer entries from a draft cursor", () => {
    const history = ["help", "clear"];

    expect(stepHistory(history, null, "older")).toBe(1);
    expect(historyValue(history, 1)).toBe("clear");
    expect(stepHistory(history, 1, "older")).toBe(0);
    expect(stepHistory(history, 0, "newer")).toBe(1);
    expect(stepHistory(history, 1, "newer")).toBeNull();
    expect(historyValue(history, null)).toBeUndefined();
  });
});
