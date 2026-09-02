"use client";

import { useReducedMotion, type Transition } from "motion/react";
import { motionTransitions, withReducedMotion } from "@/lib/motion";

export function useMotionTransition(
  transition: Transition = motionTransitions.entrance,
): Transition {
  const reducedMotion = useReducedMotion();
  return withReducedMotion(reducedMotion, transition);
}
