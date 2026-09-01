"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * A minimal custom cursor: a small dot with a trailing ring. On hover over
 * any element marked `data-cursor="view"` / `data-cursor="drag"` etc., the
 * ring grows and shows a short label — used to hint interactivity on
 * program cards, draggable rows, and other custom components.
 *
 * Desktop (fine-pointer) only — hidden via CSS (`.cursor-fine-only`) rather
 * than a JS-computed state flag, so no listener setup is skipped based on a
 * client/server mismatch. Untouched under prefers-reduced-motion.
 */
export function Cursor() {
  const prefersReducedMotion = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const [isDown, setIsDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 30 });
  const ringY = useSpring(y, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.body.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement)?.closest("[data-cursor]");
      setLabel(target ? target.getAttribute("data-cursor") : null);
    };
    const onDown = () => setIsDown(true);
    const onUp = () => setIsDown(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [prefersReducedMotion, x, y]);

  if (prefersReducedMotion) return null;

  return (
    <div className="cursor-fine-only">
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full border border-[var(--color-primary)]/40"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        initial={{ width: 32, height: 32, backgroundColor: "rgba(0,107,191,0)" }}
        animate={{
          width: label ? 64 : isDown ? 20 : 32,
          height: label ? 64 : isDown ? 20 : 32,
          backgroundColor: label ? "rgba(0,107,191,0.06)" : "rgba(0,107,191,0)",
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {label && (
          <span className="data-label text-[9px] text-[var(--color-primary)]">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
