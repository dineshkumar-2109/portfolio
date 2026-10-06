"use client";

import { useReducedMotion } from "motion/react";

/** Shared easing so every animation on the site feels like one system. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: EASE },
};

export const expand = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: EASE },
};

/** True when the person has NOT asked for reduced motion. */
export function useMotionOK(): boolean {
  return !useReducedMotion();
}
