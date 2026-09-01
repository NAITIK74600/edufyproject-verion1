"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * Thin fixed indicator at the very top of the viewport showing scroll
 * progress through the whole page — a small but constant orientation cue,
 * consistent with the "systems" motif (numbered sections, progress rails).
 */
export function ScrollProgressBar() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[60] h-[2.5px] w-full origin-left brand-gradient"
      style={{ scaleX }}
    />
  );
}
