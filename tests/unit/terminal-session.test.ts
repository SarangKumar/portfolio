import { describe, expect, it } from "@jest/globals";
import {
  readTerminalSession,
  writeTerminalSession,
} from "@/features/terminal/terminal-session";

describe("terminal session", () => {
  it("keeps CMD state in memory across reader calls", () => {
    writeTerminalSession({
      ...readTerminalSession(),
      open: true,
      cwd: "/analytics",
      history: ["ls"],
    });

    expect(readTerminalSession()).toMatchObject({
      open: true,
      cwd: "/analytics",
      history: ["ls"],
    });
  });
});
