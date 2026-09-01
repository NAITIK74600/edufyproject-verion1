"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { withBase } from "@/lib/config";

/**
 * Full-page ambient background video. Autoplays muted + looped, pauses when
 * scrolled out of view, and never autoplays under `prefers-reduced-motion`.
 * Purely decorative (aria-hidden) and sits behind a dark scrim + brand tint so
 * foreground content stays legible.
 */
export function BackgroundVideo({
  src,
  poster,
}: {
  src: string;
  poster?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || prefersReducedMotion) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [prefersReducedMotion]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay={!prefersReducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster ? withBase(poster) : undefined}
      >
        <source src={withBase(src)} type="video/mp4" />
      </video>

      {/* Legibility scrim + brand tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,12,19,0.86) 0%, rgba(5,12,19,0.78) 45%, rgba(5,12,19,0.9) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 30%, rgba(0,107,191,0.25), transparent 70%)",
        }}
      />
    </div>
  );
}
