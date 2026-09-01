"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  /** "inView" (default) reveals on scroll-into-view; "mount" plays
   *  immediately — for above-the-fold content where "reveal on scroll"
   *  wouldn't make sense (mirrors TextReveal's same distinction). */
  trigger?: "inView" | "mount";
};

const tags = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  article: motion.article,
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Premium scroll-reveal: subtle rise + scale-in with an eased cubic-bezier,
 *  rather than a plain opacity fade. Respects prefers-reduced-motion. */
export function Reveal({ children, className = "", delay = 0, as = "div", trigger = "inView" }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const Tag = tags[as];

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const animationProps =
    trigger === "mount"
      ? { initial: { opacity: 0, y: 32, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 } }
      : {
          initial: { opacity: 0, y: 32, scale: 0.97 },
          whileInView: { opacity: 1, y: 0, scale: 1 },
          viewport: { once: true, margin: "-60px" } as const,
        };

  return (
    <Tag className={className} {...animationProps} transition={{ duration: 0.7, delay: delay / 1000, ease: EASE }}>
      {children}
    </Tag>
  );
}

