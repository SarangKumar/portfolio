import type { Transition, Variants } from "motion/react";

/**
 * Motion conventions for the design system.
 * Durations match the CSS tokens in `src/styles/tokens.css`.
 * Keep motion short and linear-ish — no bounce, no large travel.
 */
export const motionDurations = {
  fast: 0.12,
  default: 0.18,
  slow: 0.28,
} as const;

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const motionTransitions = {
  hover: {
    duration: motionDurations.fast,
    ease: motionEase,
  },
  focus: {
    duration: motionDurations.fast,
    ease: motionEase,
  },
  press: {
    duration: 0.1,
    ease: motionEase,
  },
  entrance: {
    duration: motionDurations.default,
    ease: motionEase,
  },
  expansion: {
    duration: motionDurations.default,
    ease: motionEase,
  },
} as const satisfies Record<string, Transition>;

export const hoverVariants = {
  rest: { y: 0 },
  hover: { y: -1 },
} as const satisfies Variants;

export const pressVariants = {
  rest: { scale: 1 },
  press: { scale: 0.985 },
} as const satisfies Variants;

export const entranceVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
} as const satisfies Variants;

export const expansionVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
} as const satisfies Variants;

export function withReducedMotion(
  reducedMotion: boolean | null,
  transition: Transition = motionTransitions.entrance,
): Transition {
  if (reducedMotion) {
    return { duration: 0 };
  }

  return transition;
}
