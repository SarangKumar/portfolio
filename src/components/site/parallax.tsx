"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

/**
 * Scroll-linked parallax for any element with `data-parallax="<speed>"`.
 * Uses the independent `translate` property (GPU-composited, no layout, and it
 * doesn't fight `transform`-based entrance animations). One rAF per frame.
 * Disabled entirely under prefers-reduced-motion.
 */
export function ParallaxController() {
  const pathname = usePathname();
  const first = useRef(true);
  // After the first page, the view transition is the entrance; the per-element
  // fade-up would play a second time underneath it and look like a shift.
  useLayoutEffect(() => {
    if (first.current) first.current = false;
    else document.documentElement.dataset.navigated = "";
  }, [pathname]);
  // Layout effect: offsets are set in the same commit as the route change, so
  // the view-transition snapshot already has them (no post-transition jump).
  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let els: HTMLElement[] = [];
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const speed = Number(el.dataset.parallax) || 0;
        const max = Number(el.dataset.parallaxMax) || 24;
        const cur = parseFloat(el.style.translate.split(" ")[1] || "0") || 0;
        const r = el.getBoundingClientRect();
        // Untranslated layout position, so the measurement has no feedback.
        const top = r.top - cur;
        if (r.bottom < -400 || top > vh + 400) continue;
        const clamp = (v: number) => Math.max(-max, Math.min(max, v));
        const center = top + r.height / 2;
        // Offset relative to the element's position at scrollY = 0: every
        // element is exactly in place at the top of a page (first paint,
        // hydration, navigation), then drifts as you scroll.
        const atTop = center + window.scrollY;
        const offset = clamp(
          clamp((center - vh / 2) * speed) - clamp((atTop - vh / 2) * speed),
        );
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
