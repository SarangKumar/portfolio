"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { NavLinks } from "@/components/layout/nav-links";
import { IconButton } from "@/components/ui/icon-button";
import { motionTransitions } from "@/lib/motion";
import { useMotionTransition } from "@/lib/use-motion-transition";

export function MobileNav() {
  const t = useTranslations("accessibility");
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
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
        aria-label={open ? t("closeMenu") : t("openMenu")}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X /> : <Menu />}
      </IconButton>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={menuId}
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
            className="fixed inset-x-0 top-12 z-30 overflow-hidden border-b border-border bg-background md:hidden"
          >
            <nav aria-label={t("main")} className="app-container">
              <NavLinks variant="mobile" onNavigate={() => setOpen(false)} />
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
