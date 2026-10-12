"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-linked parallax for any element with `data-parallax="<speed>"`.
 * Uses the independent `translate` property (GPU-composited, no layout, and it
 * doesn't fight `transform`-based entrance animations). One rAF per frame.
 * Disabled entirely under prefers-reduced-motion.
 */
export function ParallaxController() {
  const pathname = usePathname();
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let els: HTMLElement[] = [];
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const speed = Number(el.dataset.parallax) || 0;
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        // Clamp so elements never drift far enough to overlap neighbours.
        const max = Number(el.dataset.parallaxMax) || 24;
        const raw = (r.top + r.height / 2 - vh / 2) * speed;
        const offset = Math.max(-max, Math.min(max, raw));
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const start = () => {
      els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-parallax]"),
      );
      if (mq.matches) {
        els.forEach((el) => (el.style.translate = ""));
        return;
      }
      for (const el of els) el.style.willChange = "translate";
      update();
    };

    start();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", start);
    };
  }, [pathname]);
  return null;
}
