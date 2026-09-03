import type { VaultCwd } from "@/terminal/vault-path";

export type TerminalOutputLine = {
  id: number;
  text: string;
  tone: "input" | "output" | "error" | "system";
};

export type TerminalSession = {
  open: boolean;
  cwd: VaultCwd;
  value: string;
  history: readonly string[];
  cursor: number | null;
  lines: readonly TerminalOutputLine[];
  lineId: number;
  draft: string;
};

function emptySession(): TerminalSession {
  return {
    open: false,
    cwd: "/",
    value: "",
    history: [],
    cursor: null,
    lines: [],
    lineId: 0,
    draft: "",
  };
}

let session = emptySession();

export function readTerminalSession(): TerminalSession {
  return session;
}

export function writeTerminalSession(next: TerminalSession) {
  session = next;
}
