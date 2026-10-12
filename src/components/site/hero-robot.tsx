"use client";

import { RobotHead } from "robot-heads";
import { useEffect, useRef, useState } from "react";

/** Theme-aware robot head for the home hero (orange shell, warm LEDs). */
export function HeroRobot({ max = 380 }: { max?: number }) {
  const [dark, setDark] = useState<boolean | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  // Size to the grid column (proportional at 1024–1920px), capped.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize(Math.round(Math.min(max, e.contentRect.width * 0.8))),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [max]);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.classList.contains("dark"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  // Render only after mount so the canvas uses the right theme colours.
  return (
    <div
      ref={box}
      className="flex aspect-square w-full max-w-[420px] items-center justify-center"
    >
      {dark === null || !size ? null : (
        <RobotHead
          shape="square"
          state="speaking"
          size={size}
          color={dark ? "#FF8A3D" : "#F07A3A"}
          trimColor={dark ? "#3a2414" : "#f3d9c4"}
          screenColor={dark ? "#ffe9d6" : "#fff4ea"}
          speed={0.8}
          seed={0.42}
          aria-label="Animated robot head — click me"
        />
      )}
    </div>
  );
}
