"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SearchItem } from "@/lib/derive";
import { filterIndex } from "./command-palette";
import { useT } from "./labels-provider";
import { toggleTheme } from "./theme-toggle";

export type TerminalData = {
  name: string;
  role: string;
  location: string;
  handle: string;
  career: string;
  email: string;
  links: { label: string; href: string }[];
  index: SearchItem[];
};

type Line = { kind: "in" | "out"; text: ReactNode };

const GROUPS: Record<string, SearchItem["group"]> = {
  projects: "Projects",
  blogs: "Writing",
  library: "Library",
  architecture: "Architecture",
  arch: "Architecture",
};

export function Terminal({
  data,
  onClose,
}: {
  data: TerminalData;
  onClose: () => void;
}) {
  const router = useRouter();
  const t = useT();
  const vars = {
    name: data.name,
    role: data.role,
    location: data.location,
    handle: data.handle,
    career: data.career,
    email: data.email,
  };
  const [lines, setLines] = useState<Line[]>(() => [
    { kind: "out", text: t("terminal.banner", vars) },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [lines]);

  function list(items: SearchItem[]) {
    if (!items.length) return "nothing found.";
    return items.map((i) => `  ${slugOf(i).padEnd(28)} ${i.title}`).join("\n");
  }

  function run(raw: string) {
    const [cmd = "", ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ");
    const out = (text: ReactNode) =>
      setLines((l) => [...l, { kind: "in", text: raw }, { kind: "out", text }]);
    switch (cmd.toLowerCase()) {
      case "":
        return setLines((l) => [...l, { kind: "in", text: "" }]);
      case "help":
        return out(t("terminal.help"));
      case "clear":
        return setLines([]);
      case "exit":
        return onClose();
      case "theme":
        toggleTheme();
        return out("theme toggled.");
      case "whoami":
        return out(t("terminal.whoami", vars));
      case "status":
        return out(t("terminal.status", vars));
      case "contact":
        return out(
          [
            t("terminal.contact", vars),
            ...data.links.map((l) => `${l.label}: ${l.href}`),
          ].join("\n"),
        );
      case "ls": {
        const group = GROUPS[arg.toLowerCase()];
        if (!group)
          return out("usage: ls <projects|blogs|library|architecture>");
        return out(list(data.index.filter((i) => i.group === group)));
      }
      case "search":
        return out(
          list(
            filterIndex(
              data.index.filter((i) => i.group !== "Pages"),
              arg,
            ),
          ),
        );
      case "open":
      case "cd": {
        const target = arg.toLowerCase().replace(/^\//, "");
        const hit =
          data.index.find((i) => slugOf(i) === target) ??
          data.index.find(
            (i) =>
              i.group === "Pages" &&
              (i.href === `/${target}` ||
                i.title.toLowerCase().startsWith(target)),
          );
        if (!hit || !target) return out(`open: ${arg || "?"}: not found`);
        if (hit.href.startsWith("http"))
          window.open(hit.href, "_blank", "noopener");
        else router.push(hit.href);
        return out(`→ ${hit.href}`);
      }
      default:
        return out(t("terminal.notFound", { cmd }));
    }
  }

  return (
    <div
      role="dialog"
      aria-label="Terminal"
      className="fade-up fixed right-4 bottom-4 z-40 w-[min(42rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-[oklch(0.17_0.01_60)] text-[oklch(0.92_0.02_80)] shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs opacity-70">
          {t("terminal.cwd")}
        </span>
        <button
          onClick={onClose}
          aria-label="Close terminal"
          className="opacity-70 hover:opacity-100"
        >
          <X className="size-4" />
        </button>
      </div>
      <div
        className="h-72 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
        onClick={() => document.getElementById("term-input")?.focus()}
      >
        {lines.map((l, i) => (
          <pre key={i} className="whitespace-pre-wrap">
            {l.kind === "in" ? (
              <span className="text-[oklch(0.74_0.11_62)]">❯ </span>
            ) : null}
            {l.text}
          </pre>
        ))}
        <div ref={endRef} className="flex">
          <span className="text-[oklch(0.74_0.11_62)]">❯&nbsp;</span>
          <input
            id="term-input"
            autoFocus
            aria-label="Terminal input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                run(input);
                if (input.trim()) setHistory((h) => [input, ...h]);
                setHIndex(-1);
                setInput("");
              } else if (e.key === "ArrowUp" && history.length) {
                e.preventDefault();
                const n = Math.min(hIndex + 1, history.length - 1);
                setHIndex(n);
                setInput(history[n]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const n = Math.max(hIndex - 1, -1);
                setHIndex(n);
                setInput(n === -1 ? "" : history[n]);
              } else if (e.key === "Escape") onClose();
            }}
            className="flex-1 bg-transparent outline-none"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

function slugOf(i: SearchItem) {
  if (i.href.startsWith("http")) return i.id;
  return i.href.split(/[/#]/).filter(Boolean).pop() ?? "";
}
