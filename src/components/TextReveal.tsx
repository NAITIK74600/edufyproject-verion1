"use client";

import { motion, useReducedMotion } from "motion/react";
import { Children, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Splits text into words and clip-reveals them upward, staggered — the
 * kinetic-typography signature used on headings instead of a plain fade.
 * `trigger="mount"` animates immediately (for above-the-fold headlines
 * where "reveal on scroll" wouldn't make sense — it's already in view);
 * `trigger="inView"` (default) waits until scrolled into view, for headings
 * further down the page. Falls back to static text under
 * prefers-reduced-motion.
 */
export function TextReveal({
  children,
  as: Tag = "span",
  delay = 0,
  className = "",
  wordDelay = 0.03,
  trigger = "inView",
}: {
  children: ReactNode;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  delay?: number;
  className?: string;
  wordDelay?: number;
  trigger?: "mount" | "inView";
}) {
  const prefersReducedMotion = useReducedMotion();

  // Only split plain string children; anything else (nested <span> for
  // gradient text, <br/>, etc.) renders as-is so callers keep full control.
  const text = Children.toArray(children).every((c) => typeof c === "string")
    ? Children.toArray(children).join("")
    : null;

  if (prefersReducedMotion || text === null) {
    const Static = Tag as "span";
    return <Static className={className}>{children}</Static>;
  }

  const words = text.split(" ");
  const Wrapper = Tag as "span";
  const animationProps =
    trigger === "mount"
      ? { initial: { y: "110%" }, animate: { y: "0%" } }
      : {
          initial: { y: "110%" },
          whileInView: { y: "0%" },
          viewport: { once: true, margin: "-80px" } as const,
        };

  return (
    <Wrapper className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            {...animationProps}
            transition={{
              duration: 0.7,
              ease: EASE,
              delay: delay + i * wordDelay,
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Wrapper>
  );
}
