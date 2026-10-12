"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type { SearchItem } from "@/lib/derive";
import { cn } from "@/lib/utils";
import { ProjectIcon } from "./project-icon";

export function filterIndex(index: SearchItem[], q: string) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return index;
  return index.filter((i) => {
    const hay =
      `${i.title} ${i.subtitle} ${i.keywords} ${i.group}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}

export function CommandPalette({
  index,
  open,
  onClose,
}: {
  index: SearchItem[];
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return <PaletteBody index={index} onClose={onClose} />;
}

function PaletteBody({
  index,
  onClose,
}: {
  index: SearchItem[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const results = useMemo(() => filterIndex(index, q).slice(0, 40), [index, q]);

  function go(item: SearchItem | undefined) {
    if (!item) return;
    onClose();
    if (item.href.startsWith("http"))
      window.open(item.href, "_blank", "noopener");
    else router.push(item.href);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="fade-up bg-popover text-popover-foreground border-border w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-border flex items-center gap-2 border-b px-4">
          <Search className="text-muted-foreground size-4" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              }
              if (e.key === "Enter") go(results[active]);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={
              results[active] ? `pal-${results[active].id}` : undefined
            }
            placeholder="Search projects, writing, library, diagrams…"
            className="h-12 flex-1 bg-transparent text-sm outline-none"
          />
          <kbd className="tag">esc</kbd>
        </div>
        <ul
          id="palette-list"
          ref={listRef}
          role="listbox"
          className="max-h-[50vh] overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <li className="text-muted-foreground p-4 text-sm">No results.</li>
          ) : null}
          {results.map((r, i) => (
            <li
              key={r.id}
              id={`pal-${r.id}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r)}
              className={cn(
                "flex cursor-pointer items-baseline justify-between gap-4 rounded-lg px-3 py-2",
                i === active && "bg-accent",
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                {r.group === "Projects" ? (
                  <ProjectIcon src={r.icon} title={r.title} size={28} />
                ) : null}
                <span className="min-w-0">
                  <span className="block truncate text-sm">{r.title}</span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {r.subtitle}
                  </span>
                </span>
              </span>
              <span className="tag shrink-0">{r.group}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
