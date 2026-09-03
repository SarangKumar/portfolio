export const ANALYTICS_FOLDER = "analytics";

export type VaultCwd = "/" | "/analytics";

export function normalizeVaultCwd(value: string): VaultCwd {
  return value === "/analytics" ? "/analytics" : "/";
}

export function resolveVaultTarget(cwd: VaultCwd, target = ""): string | null {
  const trimmed = target.trim();

  if (!trimmed || trimmed === ".") {
    return cwd;
  }

  if (trimmed === "/" || trimmed === "~") {
    return "/";
  }

  if (trimmed === "..") {
    return cwd === "/analytics" ? "/" : "/";
  }

  const absolute = trimmed.startsWith("/")
    ? trimmed
    : cwd === "/"
      ? `/${trimmed}`
      : `${cwd}/${trimmed}`;

  const collapsed = absolute.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";

  if (
    collapsed === "/" ||
    collapsed === "/analytics" ||
    collapsed === "/analytics/summary" ||
    collapsed === "/analytics/json"
  ) {
    return collapsed;
  }

  return null;
}

export function isUnlockCommand(name: string): boolean {
  return name === "unlock";
}

export function displayCommandLine(raw: string, name: string): string {
  if (isUnlockCommand(name)) {
    return "unlock analytics ****";
  }

  return raw;
}

export function historyCommandLine(raw: string, name: string): string {
  if (isUnlockCommand(name)) {
    return "unlock analytics";
  }

  return raw;
}

export function unlockPassword(args: readonly string[]): string {
  if (args[0]?.toLowerCase() === ANALYTICS_FOLDER) {
    return args.slice(1).join(" ");
  }

  return args.join(" ");
}

export function splitUnlockDraft(
  value: string,
): { visible: string; secret: string } | null {
  const match = value.match(/^(unlock\s+analytics\s+)([\s\S]*)$/i);

  if (!match?.[1]) {
    return null;
  }

  return { visible: match[1], secret: match[2] ?? "" };
}
