"use client";

import { motion, useReducedMotion } from "motion/react";
import { StatCounter } from "./StatCounter";

const EASE = [0.22, 1, 0.36, 1] as const;

type Stat = { value: number; suffix?: string; label: string };

const STATS: Stat[] = [
  { value: 12000, suffix: "+", label: "Learners trained" },
  { value: 94, suffix: "%", label: "Placement rate" },
  { value: 120, suffix: "+", label: "Hiring partners" },
  { value: 4, suffix: ".9★", label: "Average rating" },
];

/**
 * The hero's trust strip: a top accent line that draws itself in, and each
 * stat cell fading up on its own stagger with a subtle hover-lift — turns a
 * static bordered box into a small choreographed moment instead of just
 * appearing all at once.
 */
export function HeroStats() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="relative mt-20 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/40"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]"
        initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
        whileInView={prefersReducedMotion ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
      />

      <div className="flex flex-wrap items-center justify-between gap-y-10 divide-x divide-[var(--color-border)] px-4 py-8 sm:px-10">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className="flex-1 rounded-xl px-4 py-1 transition-colors duration-300 first:pl-0 last:pr-0 hover:bg-[var(--color-primary)]/[0.04]"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.25 + i * 0.1, ease: EASE }}
            whileHover={prefersReducedMotion ? undefined : { y: -3 }}
          >
            <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
