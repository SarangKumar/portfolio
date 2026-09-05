"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { AdminNav, type AdminNavCopy } from "@/features/admin/admin-nav";
import { IconButton } from "@/components/ui/icon-button";
import { adminNavItems, type AdminNavItem } from "@/config/admin-navigation";
import { motionTransitions } from "@/lib/motion";
import { useMotionTransition } from "@/lib/use-motion-transition";

type AdminMobileNavProps = {
  labels: AdminNavCopy;
  openLabel: string;
  closeLabel: string;
  navLabel: string;
  items?: readonly AdminNavItem[];
  pathname: string;
};

export function AdminMobileNav({
  labels,
  openLabel,
  closeLabel,
  navLabel,
  items = adminNavItems,
  pathname,
}: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const titleId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const transition = useMotionTransition(motionTransitions.expansion);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    function onViewportChange() {
      if (media.matches) {
        setOpen(false);
      }
    }

    media.addEventListener("change", onViewportChange);
    return () => media.removeEventListener("change", onViewportChange);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement;
    const panel = panelRef.current;
    const focusable = panel?.querySelector<HTMLElement>("a, button");
    focusable?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <IconButton
        ref={buttonRef}
        size="sm"
        variant="ghost"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X /> : <Menu />}
      </IconButton>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="admin-mobile-nav"
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <button
              type="button"
              className="absolute inset-0 bg-background/80"
              aria-label={closeLabel}
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
            />
            <motion.div
              ref={panelRef}
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={transition}
              className="relative flex h-full w-64 max-w-[85vw] flex-col border-r border-border bg-card"
            >
              <p id={titleId} className="sr-only">
                {navLabel}
              </p>
              <nav aria-label={navLabel} className="flex-1 overflow-y-auto">
                <AdminNav
                  items={items}
                  labels={labels}
                  pathname={pathname}
                  onNavigate={() => setOpen(false)}
                />
              </nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
