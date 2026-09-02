export const TERMINAL_HISTORY_LIMIT = 50;

export function pushHistory(
  history: readonly string[],
  command: string,
): readonly string[] {
  const trimmed = command.trim();

  if (!trimmed) {
    return history;
  }

  const next = [...history, trimmed];

  if (next.length <= TERMINAL_HISTORY_LIMIT) {
    return next;
  }

  return next.slice(-TERMINAL_HISTORY_LIMIT);
}

export function historyValue(
  history: readonly string[],
  cursor: number | null,
): string | undefined {
  if (cursor === null || cursor < 0 || cursor >= history.length) {
    return undefined;
  }

  return history[cursor];
}

export function stepHistory(
  history: readonly string[],
  cursor: number | null,
  direction: "older" | "newer",
): number | null {
  if (history.length === 0) {
    return null;
  }

  if (direction === "older") {
    if (cursor === null) {
      return history.length - 1;
    }

    return Math.max(0, cursor - 1);
  }

  if (cursor === null) {
    return null;
  }

  if (cursor >= history.length - 1) {
    return null;
  }

  return cursor + 1;
}
