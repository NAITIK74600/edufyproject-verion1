"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { setLenisInstance } from "@/lib/scroll";

/**
 * Global smooth-scroll physics engine. Syncs natively with the browser's
 * scroll event (so `window.scrollY`, IntersectionObserver, and Motion's
 * `useScroll` all keep working unmodified) while giving every scroll
 * interaction — wheel, trackpad, touch — the same weighted, cinematic feel.
 *
 * Fully disabled under `prefers-reduced-motion`: the browser's native
 * (instant) scroll takes over with zero behavior change for those users.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    setLenisInstance(lenis);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  return null;
}
