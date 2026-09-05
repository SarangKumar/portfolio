"use client";

import { ChevronsUpDown, SquareTerminal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { trackTerminalCommand, trackTerminalOpen } from "@/analytics/events";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import { motionTransitions } from "@/lib/motion";
import { useMotionTransition } from "@/lib/use-motion-transition";
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
} from "@/terminal";
import { createHttpVaultClient } from "@/terminal/vault-client";
import type { VaultCopy } from "@/terminal/types";
import type { VaultCwd } from "@/terminal/vault-path";
import {
  readTerminalSession,
  writeTerminalSession,
  type TerminalOutputLine,
} from "@/features/terminal/terminal-session";

type OutputLine = TerminalOutputLine;

export function PublicTerminal() {
  const t = useTranslations("terminal");
  const panelId = useId();
  const titleId = useId();
  const inputId = useId();
  const passwordId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const transition = useMotionTransition(motionTransitions.expansion);
  const registry = useMemo(() => createPublicCommandRegistry(), []);
  const vault = useMemo(() => createHttpVaultClient(), []);
  const stored = readTerminalSession();
  const lineId = useRef(stored.lineId);
  const draftRef = useRef(stored.draft);

  const [open, setOpen] = useState(stored.open);
  const [cwd, setCwd] = useState<VaultCwd>(stored.cwd);
  const [value, setValue] = useState(stored.value);
  const [history, setHistory] = useState<readonly string[]>(stored.history);
  const [cursor, setCursor] = useState<number | null>(stored.cursor);
  const [lines, setLines] = useState<readonly OutputLine[]>(stored.lines);
  const unlockDraft = splitUnlockDraft(value);
  const passwordMode = unlockDraft !== null;

  const copy = useMemo(
    () => ({
      unknown: t("unknown"),
      helpIntro: t("helpIntro"),
      commandSummaries: {
        help: t("commands.help"),
        clear: t("commands.clear"),
      },
    }),
    [t],
  );

  const vaultCopy = useMemo(
    (): VaultCopy => ({
      notConfigured: t.raw("vault.notConfigured"),
      locked: t.raw("vault.locked"),
      unlocked: t.raw("vault.unlocked"),
      invalidPassword: t.raw("vault.invalidPassword"),
      rateLimited: t.raw("vault.rateLimited"),
      usageUnlock: t.raw("vault.usageUnlock"),
      listingRoot: t.raw("vault.listingRoot"),
      listingOpen: t.raw("vault.listingOpen"),
      noEntry: t.raw("vault.noEntry"),
      nowHere: t.raw("vault.nowHere"),
      lockedAgain: t.raw("vault.lockedAgain"),
    }),
    [t],
  );

  const addLines = useCallback((entries: readonly Omit<OutputLine, "id">[]) => {
    setLines((current) => [
      ...current,
      ...entries.map((entry) => {
        lineId.current += 1;
        return { ...entry, id: lineId.current };
      }),
    ]);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  }, []);

  const openTerminal = useCallback(() => {
    setOpen(true);
    trackTerminalOpen();
  }, []);

  const toggle = useCallback(() => {
    if (open) {
      close();
      return;
    }

    openTerminal();
  }, [close, open, openTerminal]);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "`" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (passwordMode) {
      passwordRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }

    setLines((current) => {
      if (current.length > 0) {
        return current;
      }

      lineId.current += 1;
      return [{ id: lineId.current, text: t("welcome"), tone: "system" }];
    });

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, open, passwordMode, t]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    writeTerminalSession({
      open,
      cwd,
      value,
      history,
      cursor,
      lines,
      lineId: lineId.current,
      draft: draftRef.current,
    });
  }, [open, cwd, value, history, cursor, lines]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = value;
    const parsed = parseCommand(raw);

    setValue("");
    setCursor(null);
    draftRef.current = "";

    if (!parsed) {
      return;
    }

    setHistory((current) =>
      pushHistory(current, historyCommandLine(raw, parsed.name)),
    );
    trackTerminalCommand(parsed.name);

    const formatted = formatCommandResult(
      await executeCommand(raw, registry, { cwd, vault, vaultCopy }),
      copy,
    );

    if (formatted.cwd) {
      setCwd(formatted.cwd);
    }

    if (formatted.clear) {
      setLines([]);
      return;
    }

    addLines([
      { text: `$ ${displayCommandLine(raw, parsed.name)}`, tone: "input" },
      ...formatted.lines.map((text) => ({
        text,
        tone:
          formatted.tone === "error" ? ("error" as const) : ("output" as const),
      })),
    ]);
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (cursor === null) {
        draftRef.current = value;
      }
      const nextCursor = stepHistory(history, cursor, "older");
      const nextValue = historyValue(history, nextCursor);
      setCursor(nextCursor);
      if (nextValue !== undefined) {
        setValue(nextValue);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextCursor = stepHistory(history, cursor, "newer");
      setCursor(nextCursor);
      if (nextCursor === null) {
        setValue(draftRef.current);
        return;
      }
      const nextValue = historyValue(history, nextCursor);
      if (nextValue !== undefined) {
        setValue(nextValue);
      }
    }
  }

  return (
    <div
      className={cn(
        "sticky bottom-0 z-40 flex flex-col border-t border-border bg-card",
        open
          ? "h-[var(--terminal-open)] min-h-64"
          : "h-[var(--terminal-ribbon)]",
      )}
    >
      <div
        className={cn(
          "flex h-[var(--terminal-ribbon)] shrink-0 items-center gap-2 px-3",
          open && "border-b border-border",
        )}
      >
        <button
          ref={launcherRef}
          type="button"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={open ? t("close") : t("open")}
          onClick={toggle}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <SquareTerminal className="size-3.5 shrink-0 text-primary" />
          <span id={titleId} className="type-label text-foreground">
            {t("ribbonLabel")}
          </span>
          <span className="hidden truncate type-metadata sm:inline">
            {t("ribbonHint")}
          </span>
          <ChevronsUpDown className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
        </button>
        {open ? (
          <IconButton
            ref={closeRef}
            size="sm"
            variant="ghost"
            aria-label={t("close")}
            onClick={close}
          >
            <X />
          </IconButton>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="terminal-panel"
            id={panelId}
            role="region"
            aria-labelledby={titleId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              className="min-h-0 flex-1 overflow-y-auto px-3 py-2 font-mono type-small"
            >
              <ul className="stack-compact">
                {lines.map((line) => (
                  <li
                    key={line.id}
                    className={cn(
                      "whitespace-pre-wrap break-words",
                      line.tone === "input" && "text-foreground",
                      line.tone === "output" && "text-muted-foreground",
                      line.tone === "system" && "text-muted-foreground",
                      line.tone === "error" && "text-destructive",
                    )}
                  >
                    {line.text}
                  </li>
                ))}
              </ul>
            </div>
            <form
              onSubmit={submit}
              className="flex items-center gap-1 border-t border-border px-3 py-1.5"
            >
              <span
                aria-hidden="true"
                className="font-mono type-small text-primary"
              >
                {cwd === "/analytics" ? "analytics $" : "$"}
              </span>
              {unlockDraft ? (
                <>
                  <span className="shrink-0 font-mono type-small text-foreground">
                    {unlockDraft.visible.trimEnd()}
                  </span>
                  <label htmlFor={passwordId} className="sr-only">
                    {t("vault.passwordLabel")}
                  </label>
                  <input
                    ref={passwordRef}
                    id={passwordId}
                    type="password"
                    value={unlockDraft.secret}
                    onChange={(event) => {
                      setValue(`${unlockDraft.visible}${event.target.value}`);
                      setCursor(null);
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Backspace" &&
                        unlockDraft.secret.length === 0
                      ) {
                        event.preventDefault();
                        setValue(unlockDraft.visible.trimEnd());
                        return;
                      }
                      onInputKeyDown(event);
                    }}
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="send"
                    className={cn(
                      "min-w-0 flex-1 bg-transparent font-mono type-small text-foreground outline-none",
                      "placeholder:text-muted-foreground",
                    )}
                  />
                </>
              ) : (
                <>
                  <label htmlFor={inputId} className="sr-only">
                    {t("inputLabel")}
                  </label>
                  <input
                    ref={inputRef}
                    id={inputId}
                    value={value}
                    onChange={(event) => {
                      setValue(event.target.value);
                      setCursor(null);
                    }}
                    onKeyDown={onInputKeyDown}
                    type="text"
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="send"
                    className={cn(
                      "min-w-0 flex-1 bg-transparent font-mono type-small text-foreground outline-none",
                      "placeholder:text-muted-foreground",
                    )}
                  />
                </>
              )}
              <button type="submit" tabIndex={-1} className="sr-only">
                {t("run")}
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
