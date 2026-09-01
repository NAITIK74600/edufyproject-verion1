"use client";

import { motion, useReducedMotion } from "motion/react";

/** A minimal "scroll to continue" cue — bouncing chevron under a fading
 *  label, mounted after the hero's main choreography settles. Ties the
 *  hero into the same cinematic-motion language used further down the
 *  page (ScrollStory's progress rail, CareerSimulator's scrubber). */
export function ScrollCue({ className = "" }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none flex-col items-center gap-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]/70">
        Scroll
      </span>
      <motion.svg
        width="14"
        height="20"
        viewBox="0 0 14 20"
        fill="none"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted-foreground)]/50" />
        <path d="M1 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]/70" />
      </motion.svg>
    </motion.div>
  );
}
