"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => obs.disconnect();
}

export function toggleTheme() {
  const next = document.documentElement.classList.contains("dark")
    ? "light"
    : "dark";
  document.documentElement.classList.toggle("dark", next === "dark");
  localStorage.setItem("theme", next);
}

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {dark ? (
        <Sun size={20} strokeWidth={1.75} className="size-5" />
      ) : (
        <Moon size={20} strokeWidth={1.75} className="size-5" />
      )}
    </Button>
  );
}
