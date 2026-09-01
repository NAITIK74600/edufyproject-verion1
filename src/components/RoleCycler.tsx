"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

// Real outcome roles pulled from the four domains we train — not
// decorative copy, the same titles shown in the Career Path Simulator.
const ROLES = ["AI/ML Engineer", "Data Scientist", "Cybersecurity Analyst", "HR Business Partner"];

/**
 * A cycling-word line under the hero headline — "Get placed as a ⟶ [role]"
 * — where the role flips through real outcome titles with a 3D-feeling
 * vertical wipe (clip-mask + rotateX), the clearest "text animation" moment
 * on the page besides the headline's own word reveal.
 */
export function RoleCycler() {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2200);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <p className="mt-4 text-sm font-medium text-[var(--color-muted-foreground)]">
        Placing graduates as {ROLES[0]}, {ROLES[1]}, and more.
      </p>
    );
  }

  return (
    <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-[var(--color-muted-foreground)] sm:text-base">
      Training you to become a
      <span className="relative inline-grid h-6 place-items-start overflow-hidden text-left sm:h-7">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={ROLES[index]}
            className="col-start-1 row-start-1 whitespace-nowrap font-semibold text-[var(--color-primary)]"
            initial={{ y: 24, opacity: 0, rotateX: 45 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: -24, opacity: 0, rotateX: -45 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {ROLES[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}
