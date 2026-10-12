"use client";

import { Menu, Search, SquareTerminal, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Link as NavLink } from "@/content/types";
import { cn } from "@/lib/utils";
import { BeanMark } from "./bean";
import { useT } from "./labels-provider";
import { CommandPalette } from "./command-palette";
import { Terminal, type TerminalData } from "./terminal";
import { ThemeToggle } from "./theme-toggle";

export function SiteChrome({
  data,
  nav,
}: {
  data: TerminalData;
  nav: NavLink[];
}) {
  const t = useT();
  const pathname = usePathname();
  const [palette, setPalette] = useState(false);
  const [term, setTerm] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const menuOpen = menu === pathname;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
      const typing = (e.target as HTMLElement)?.closest(
        "input,textarea,[contenteditable]",
      );
      if (!typing && e.key === "`") {
        e.preventDefault();
        setTerm((t) => !t);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
      >
        Skip to content
      </a>
      <header
        style={{ viewTransitionName: "site-header" }}
        className="bg-background/80 border-border sticky top-0 z-30 border-b backdrop-blur-md"
      >
        <div className="container-x flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <BeanMark />
            <span className="font-serif text-lg">{data.name}</span>
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  isActive(n.href)
                    ? "bg-primary/12 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPalette(true)}
              className="text-muted-foreground hidden gap-2 rounded-full sm:inline-flex"
              aria-label="Open search (⌘K)"
            >
              <Search className="size-3.5" /> {t("nav.search")}{" "}
              <kbd className="tag">⌘K</kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPalette(true)}
              className="sm:hidden"
              aria-label="Search"
            >
              <Search className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setTerm((t) => !t)}
              aria-label="Toggle terminal (`)"
              aria-pressed={term}
            >
              <SquareTerminal className="size-4" />
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setMenu(menuOpen ? null : pathname)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </Button>
          </div>
        </div>
        {menuOpen ? (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="container-x border-border flex flex-col border-t py-3 lg:hidden"
          >
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "py-2 font-serif text-2xl",
                  isActive(n.href) ? "text-primary" : "",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
      <CommandPalette
        index={data.index}
        open={palette}
        onClose={() => setPalette(false)}
      />
      {term ? <Terminal data={data} onClose={() => setTerm(false)} /> : null}
    </>
  );
}
