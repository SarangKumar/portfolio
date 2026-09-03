import { describe, expect, it } from "@jest/globals";
import {
  createPublicCommandRegistry,
  displayCommandLine,
  executeCommand,
  formatCommandResult,
  historyCommandLine,
  historyValue,
  parseCommand,
  pushHistory,
  splitUnlockDraft,
  stepHistory,
  TERMINAL_HISTORY_LIMIT,
} from "@/terminal";
import type { CommandContext, CommandDefinition, VaultCopy } from "@/terminal";
import type { VaultClient } from "@/terminal/vault-client";
import { unlockPassword } from "@/terminal/vault-path";

const copy = {
  unknown: "Command not found: {name}. Type help.",
  helpIntro: "Available commands:",
  commandSummaries: {
    help: "List available commands",
    clear: "Clear the terminal output",
  },
};

const vaultCopy: VaultCopy = {
  notConfigured: "not configured",
  locked: "locked",
  unlocked: "unlocked",
  invalidPassword: "bad password",
  rateLimited: "slow down",
  usageUnlock: "usage",
  listingRoot: "[locked]",
  listingOpen: "[unlocked]",
  noEntry: "missing",
  nowHere: "{path}",
  lockedAgain: "locked again",
};

function context(
  vault: Partial<VaultClient> = {},
  cwd: CommandContext["cwd"] = "/",
): CommandContext {
  const client: VaultClient = {
    async status() {
      return { configured: true, unlocked: false };
    },
    async unlock() {
      return { ok: false, error: "invalid" };
    },
    async lock() {},
    async read() {
      return { ok: false, error: "locked" };
    },
    ...vault,
  };

  return { cwd, vault: client, vaultCopy };
}

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

  it("no-ops on empty input", async () => {
    expect(await executeCommand("   ", registry, context())).toEqual({
      kind: "noop",
    });
  });

  it("runs help and its alias", async () => {
    expect(await executeCommand("help", registry, context())).toMatchObject({
      kind: "help",
    });
    expect(await executeCommand("?", registry, context())).toMatchObject({
      kind: "help",
    });
  });

  it("runs clear aliases", async () => {
    expect(await executeCommand("clear", registry, context())).toEqual({
      kind: "clear",
    });
    expect(await executeCommand("cls", registry, context())).toEqual({
      kind: "clear",
    });
    expect(await executeCommand("reset", registry, context())).toEqual({
      kind: "clear",
    });
  });

  it("returns unknown for unregistered commands", async () => {
    expect(await executeCommand("sudo", registry, context())).toEqual({
      kind: "unknown",
      name: "sudo",
    });
  });
});

describe("command registry", () => {
  it("lists unique public commands without requiring UI changes", async () => {
    const registry = createPublicCommandRegistry([ping]);

    expect(registry.list().map((command) => command.name)).toEqual([
      "clear",
      "help",
      "ping",
    ]);
    expect(await executeCommand("ping", registry, context())).toEqual({
      kind: "lines",
      lines: ["pong"],
    });
  });

  it("keeps analytics folder commands executable but hidden from help", async () => {
    const registry = createPublicCommandRegistry();
    const formatted = formatCommandResult(
      await executeCommand("help", registry, context()),
      copy,
    );

    expect(registry.get("unlock")).toBeDefined();
    expect(formatted.lines.join("\n")).not.toContain("unlock");
    expect(formatted.lines.join("\n")).not.toContain("cat");
  });
});

describe("formatCommandResult", () => {
  const registry = createPublicCommandRegistry();

  it("formats unknown commands", async () => {
    expect(
      formatCommandResult(
        await executeCommand("nope", registry, context()),
        copy,
      ),
    ).toEqual({
      clear: false,
      tone: "error",
      lines: ["Command not found: nope. Type help."],
    });
  });

  it("formats help listings", async () => {
    const formatted = formatCommandResult(
      await executeCommand("help", registry, context()),
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

  it("falls back to summaryKey for unregistered copy", async () => {
    const formatted = formatCommandResult(
      await executeCommand(
        "help",
        createPublicCommandRegistry([ping]),
        context(),
      ),
      copy,
    );

    expect(formatted.lines).toEqual(
      expect.arrayContaining(["ping — commands.ping"]),
    );
  });
});

describe("hidden analytics folder", () => {
  const registry = createPublicCommandRegistry();

  it("redacts unlock passwords from display and history", () => {
    expect(displayCommandLine("unlock analytics hunter2", "unlock")).toBe(
      "unlock analytics ****",
    );
    expect(historyCommandLine("unlock analytics hunter2", "unlock")).toBe(
      "unlock analytics",
    );
    expect(unlockPassword(["analytics", "hunter2"])).toBe("hunter2");
    expect(splitUnlockDraft("unlock")).toBeNull();
    expect(splitUnlockDraft("unlock analytics")).toBeNull();
    expect(splitUnlockDraft("unlock analytics ")).toEqual({
      visible: "unlock analytics ",
      secret: "",
    });
    expect(splitUnlockDraft("unlock analytics hunter2")).toEqual({
      visible: "unlock analytics ",
      secret: "hunter2",
    });
  });

  it("lists the locked folder without opening it", async () => {
    const result = await executeCommand("ls", registry, context());

    expect(result).toEqual({
      kind: "lines",
      lines: ["analytics/  [locked]"],
    });
  });

  it("unlocks with the password and reads summary plus json", async () => {
    let unlocked = false;
    const vault: Partial<VaultClient> = {
      async status() {
        return { configured: true, unlocked };
      },
      async unlock() {
        unlocked = true;
        return { ok: true };
      },
      async read(view) {
        return {
          ok: true,
          lines: view === "json" ? ['{"count":1}'] : ["events: 1"],
        };
      },
    };

    const opened = await executeCommand(
      "unlock analytics secret",
      registry,
      context(vault),
    );

    expect(opened).toMatchObject({
      kind: "chdir",
      path: "/analytics",
    });

    const listing = await executeCommand(
      "ls",
      registry,
      context(vault, "/analytics"),
    );
    expect(listing).toEqual({ kind: "lines", lines: ["json", "summary"] });

    const summary = await executeCommand(
      "cat summary",
      registry,
      context(vault, "/analytics"),
    );
    expect(summary).toEqual({ kind: "lines", lines: ["events: 1"] });

    const jsonView = await executeCommand(
      "cat json",
      registry,
      context(vault, "/analytics"),
    );
    expect(jsonView).toEqual({ kind: "lines", lines: ['{"count":1}'] });
  });

  it("refuses cd analytics while locked", async () => {
    const result = await executeCommand("cd analytics", registry, context());

    expect(result).toEqual({
      kind: "lines",
      tone: "error",
      lines: ["locked"],
    });
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
