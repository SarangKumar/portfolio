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
  executeCommand,
  formatCommandResult,
  historyValue,
  parseCommand,
  pushHistory,
  stepHistory,
} from "@/terminal";

type OutputLine = {
  id: number;
  text: string;
  tone: "input" | "output" | "error" | "system";
};

export function PublicTerminal() {
  const t = useTranslations("terminal");
  const panelId = useId();
  const titleId = useId();
  const inputId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const lineId = useRef(0);
  const draftRef = useRef("");
  const transition = useMotionTransition(motionTransitions.expansion);
  const registry = useMemo(() => createPublicCommandRegistry(), []);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<readonly string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [lines, setLines] = useState<readonly OutputLine[]>([]);

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

    inputRef.current?.focus();

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
  }, [close, open, t]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = value;
    const parsed = parseCommand(raw);

    setValue("");
    setCursor(null);
    draftRef.current = "";
    setHistory((current) => pushHistory(current, raw));

    if (!parsed) {
      return;
    }

    trackTerminalCommand(parsed.name);

    const formatted = formatCommandResult(executeCommand(raw, registry), copy);

    if (formatted.clear) {
      setLines([]);
      return;
    }

    addLines([
      { text: `$ ${parsed.raw}`, tone: "input" },
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
        "flex flex-col border-t border-border bg-card",
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
                $
              </span>
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
