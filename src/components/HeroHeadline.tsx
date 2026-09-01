"use client";

import { motion } from "motion/react";
import { TextReveal } from "./TextReveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The hero's kinetic headline: two lines revealed word-by-word (TextReveal),
 * with a refined highlight bar that sweeps in behind "Get Placed." after the
 * text lands — a literal "text animation" moment rather than a static gradient.
 */
export function HeroHeadline() {
  return (
    <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.5rem] xl:text-[5rem]">
      <TextReveal as="span" className="block" trigger="mount">
        Learn. Build.
      </TextReveal>

      <span className="relative inline-block w-fit">
        <motion.span
          aria-hidden
          className="absolute inset-x-0 bottom-[0.1em] -z-10 h-[0.34em] origin-left rounded-full bg-[var(--color-secondary)]/25"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.85, delay: 0.85, ease: EASE }}
        />
        <TextReveal as="span" className="relative block brand-gradient-text text-glow" delay={0.15} trigger="mount">
          Get Placed.
        </TextReveal>
      </span>
    </h1>
  );
}
