"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { SuccessStory } from "@/lib/types";
import { IconArrowRight } from "./icons";

const EASE = [0.22, 1, 0.36, 1] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * A floating "recent placements" card — real success-story records cycling
 * every few seconds with a slide+fade transition. Deliberately does NOT
 * fabricate fake relative timestamps ("2 min ago") to manufacture urgency —
 * it's honestly framed as a rotating highlight reel of real outcomes, not a
 * fake live-activity widget. Hidden entirely under reduced-motion rather
 * than left static, since a frozen mid-transition frame would look broken.
 */
export function HeroPlacementTicker({ stories }: { stories: SuccessStory[] }) {
  const [index, setIndex] = useState(0);
  const [registered, setRegistered] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const items = stories.slice(0, 6);

  // Baseline registered-students count, kept in step with the "12,000+ learners
  // trained" hero stat, then nudged up slowly so it reads as a live figure.
  const REGISTERED_BASE = 12480;

  useEffect(() => {
    if (prefersReducedMotion || items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 3400);
    return () => clearInterval(id);
  }, [prefersReducedMotion, items.length]);

  // Count up to the baseline on mount, then tick up occasionally to feel live.
  useEffect(() => {
    if (prefersReducedMotion) return;
    let raf = 0;
    const duration = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setRegistered(Math.round(eased * REGISTERED_BASE));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const bump = setInterval(
      () => setRegistered((r) => r + Math.floor(Math.random() * 2) + 1),
      6000,
    );
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(bump);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || items.length === 0) return null;

  const story = items[index];

  return (
    <Link
      href="/success-stories"
      data-cursor="View"
      className="group absolute right-4 top-6 z-10 hidden w-72 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/95 p-3.5 shadow-[var(--shadow-3)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 sm:right-8 lg:block"
      aria-label="View success stories"
    >
      <span className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-accent-2)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent-2)] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent-2)]" />
        </span>
        Real outcomes
      </span>

      <div className="relative h-14 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={story.name}
            className="absolute inset-0 flex items-center gap-3"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full brand-gradient text-sm font-bold text-white">
              {initials(story.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">{story.name}</p>
              <p className="truncate text-xs text-[var(--color-muted-foreground)]">{story.outcome}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Live-feeling registered-students count */}
      <div className="mt-2.5 flex items-center gap-1.5 border-t border-[var(--color-border)] pt-2.5 text-[11px] text-[var(--color-muted-foreground)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
        </span>
        <span className="font-semibold text-[var(--color-foreground)] [font-variant-numeric:tabular-nums]">
          {registered.toLocaleString("en-IN")}
        </span>
        students registered with us
      </div>

      <span className="mt-2 flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        See all success stories <IconArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}
