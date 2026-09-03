import type {
  CommandContext,
  CommandDefinition,
  CommandResult,
} from "@/terminal/types";
import {
  ANALYTICS_FOLDER,
  normalizeVaultCwd,
  resolveVaultTarget,
  unlockPassword,
} from "@/terminal/vault-path";

async function denyUnlessUnlocked(
  context: CommandContext,
): Promise<CommandResult | null> {
  const status = await context.vault.status();

  if (!status.configured) {
    return {
      kind: "lines",
      tone: "error",
      lines: [context.vaultCopy.notConfigured],
    };
  }

  if (!status.unlocked) {
    return {
      kind: "lines",
      tone: "error",
      lines: [context.vaultCopy.locked],
    };
  }

  return null;
}

export const pwdCommand: CommandDefinition = {
  name: "pwd",
  summaryKey: "commands.pwd",
  hidden: true,
  run(_parsed, _registry, context) {
    return { kind: "lines", lines: [context.cwd] };
  },
};

export const cdCommand: CommandDefinition = {
  name: "cd",
  summaryKey: "commands.cd",
  hidden: true,
  async run(parsed, _registry, context) {
    const target = resolveVaultTarget(context.cwd, parsed.args[0] ?? "/");

    if (!target) {
      return {
        kind: "lines",
        tone: "error",
        lines: [context.vaultCopy.noEntry],
      };
    }

    if (target === "/" || target === "/analytics") {
      if (target === "/analytics") {
        const denied = await denyUnlessUnlocked(context);

        if (denied) {
          return denied;
        }
      }

      const path = normalizeVaultCwd(target);

      return {
        kind: "chdir",
        path,
        lines: [context.vaultCopy.nowHere.replace("{path}", path)],
      };
    }

    return {
      kind: "lines",
      tone: "error",
      lines: [context.vaultCopy.noEntry],
    };
  },
};

export const lsCommand: CommandDefinition = {
  name: "ls",
  aliases: ["dir"],
  summaryKey: "commands.ls",
  hidden: true,
  async run(parsed, _registry, context) {
    const target = resolveVaultTarget(context.cwd, parsed.args[0] ?? "");

    if (!target) {
      return {
        kind: "lines",
        tone: "error",
        lines: [context.vaultCopy.noEntry],
      };
    }

    if (target === "/") {
      const status = await context.vault.status();
      const marker = status.unlocked
        ? context.vaultCopy.listingOpen
        : context.vaultCopy.listingRoot;

      return { kind: "lines", lines: [`analytics/  ${marker}`] };
    }

    if (target === "/analytics") {
      const denied = await denyUnlessUnlocked(context);

      if (denied) {
        return denied;
      }

      return { kind: "lines", lines: ["json", "summary"] };
    }

    return {
      kind: "lines",
      tone: "error",
      lines: [context.vaultCopy.noEntry],
    };
  },
};

export const catCommand: CommandDefinition = {
  name: "cat",
  aliases: ["open", "view"],
  summaryKey: "commands.cat",
  hidden: true,
  async run(parsed, _registry, context) {
    const target = resolveVaultTarget(context.cwd, parsed.args[0] ?? "");

    if (target !== "/analytics/summary" && target !== "/analytics/json") {
      return {
        kind: "lines",
        tone: "error",
        lines: [context.vaultCopy.noEntry],
      };
    }

    const denied = await denyUnlessUnlocked(context);

    if (denied) {
      return denied;
    }

    const view = target.endsWith("json") ? "json" : "summary";
    const result = await context.vault.read(view);

    if (!result.ok) {
      return {
        kind: "lines",
        tone: "error",
        lines: [
          result.error === "unconfigured"
            ? context.vaultCopy.notConfigured
            : context.vaultCopy.locked,
        ],
      };
    }

    return { kind: "lines", lines: result.lines };
  },
};

export const unlockCommand: CommandDefinition = {
  name: "unlock",
  summaryKey: "commands.unlock",
  hidden: true,
  async run(parsed, _registry, context) {
    const folder = parsed.args[0]?.toLowerCase();
    const password = unlockPassword(parsed.args);

    if (folder && folder !== ANALYTICS_FOLDER) {
      return {
        kind: "lines",
        tone: "error",
        lines: [context.vaultCopy.noEntry],
      };
    }

    if (!password) {
      return {
        kind: "lines",
        tone: "error",
        lines: [context.vaultCopy.usageUnlock],
      };
    }

    const result = await context.vault.unlock(password);

    if (!result.ok) {
      const message =
        result.error === "unconfigured"
          ? context.vaultCopy.notConfigured
          : result.error === "rate_limited"
            ? context.vaultCopy.rateLimited
            : context.vaultCopy.invalidPassword;

      return { kind: "lines", tone: "error", lines: [message] };
    }

    return {
      kind: "chdir",
      path: "/analytics",
      lines: [context.vaultCopy.unlocked],
    };
  },
};

export const lockCommand: CommandDefinition = {
  name: "lock",
  summaryKey: "commands.lock",
  hidden: true,
  async run(_parsed, _registry, context) {
    await context.vault.lock();

    return {
      kind: "chdir",
      path: "/",
      lines: [context.vaultCopy.lockedAgain],
    };
  },
};

export const analyticsFolderCommands: readonly CommandDefinition[] = [
  pwdCommand,
  cdCommand,
  lsCommand,
  catCommand,
  unlockCommand,
  lockCommand,
];
