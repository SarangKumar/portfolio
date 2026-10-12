"use client";

import { RobotHead } from "robot-heads";
import { useEffect, useState } from "react";

/** Theme-aware robot head for the home hero (orange shell, warm LEDs). */
export function HeroRobot({ size = 280 }: { size?: number }) {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.classList.contains("dark"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  // Render only after mount so the canvas uses the right theme colours.
  if (dark === null) return <span style={{ width: size, height: size }} />;
  return (
    <RobotHead
      shape="circle"
      state="idle"
      size={size}
      color={dark ? "#FF7A1A" : "#E85D00"}
      trimColor={dark ? "#3a2414" : "#f3d9c4"}
      screenColor={dark ? "#ffe9d6" : "#fff4ea"}
      speed={0.8}
      seed={0.42}
      aria-label="Animated robot head — click me"
    />
  );
}
