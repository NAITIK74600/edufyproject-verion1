import type Lenis from "lenis";

// Module-level singleton so any component can trigger a Lenis-smoothed
// scroll without prop-drilling or context boilerplate for a single instance.
let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

/** Smoothly scrolls to a target element/selector, using Lenis physics when
 *  available and falling back to native smooth scroll otherwise. */
export function scrollToTarget(target: string | HTMLElement) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { offset: -16, duration: 1.1 });
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
