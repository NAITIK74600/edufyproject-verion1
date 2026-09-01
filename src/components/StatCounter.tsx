"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

export function StatCounter({ value, suffix = "", prefix = "", label }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (prefersReduced) {
          setDisplay(value);
          return;
        }
        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="brand-gradient-text text-4xl font-bold sm:text-5xl [font-variant-numeric:tabular-nums]">
        {prefix}
        {display.toLocaleString("en-IN")}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-[var(--color-muted-foreground)]">
        {label}
      </div>
    </div>
  );
}
