"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
  useReducedMotion,
} from "motion/react";
import type { CareerPath } from "@/lib/types";
import { domainIcon, IconArrowRight } from "./icons";

const DOMAIN_ACCENT: Record<string, string> = {
  "AI/ML": "#006bbf",
  "Data Science": "#24c5db",
  Cybersecurity: "#04708f",
  HR: "#16a34a",
};

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEW_W = 800;
const VIEW_H = 200;
// Stage x-positions across the SVG viewBox; y alternates to make the
// trajectory read as a rising path, not a flat timeline.
const STAGE_X = [70, 290, 510, 730];
const STAGE_Y = [140, 90, 110, 50];

/** Snaps a raw 0..1 drag progress to the nearest of `count` stage indices —
 *  pulled out as a pure function so the drag→stage mapping is independently
 *  verifiable without needing a browser. */
export function progressToStageIndex(progress: number, count: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.round(clamped * (count - 1));
}

function buildPathD(): string {
  let d = `M ${STAGE_X[0]} ${STAGE_Y[0]}`;
  for (let i = 1; i < STAGE_X.length; i++) {
    const prevX = STAGE_X[i - 1];
    const prevY = STAGE_Y[i - 1];
    const x = STAGE_X[i];
    const y = STAGE_Y[i];
    const midX = (prevX + x) / 2;
    d += ` C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
  }
  return d;
}

const PATH_D = buildPathD();

/**
 * Interactive "career trajectory" scrubber — drag (or use arrow keys) to
 * travel the four real progression stages of a domain (sourced from the
 * `career_paths` table, not fabricated), with a hand-drawn wave path that
 * reveals itself under a magnetic, spring-snapped handle. Replaces a static
 * link-out list with a direct-manipulation feature — the kind of thing a
 * static template wouldn't ship, because it's driven entirely by the site's
 * own data model.
 */
export function CareerSimulator({
  paths,
  showSelector = true,
  footerLink = true,
}: {
  paths: CareerPath[];
  /** Hide the domain switcher when the simulator is already scoped to one domain. */
  showSelector?: boolean;
  /** Hide the "see full details" link when already on a detail page. */
  footerLink?: boolean;
}) {
  const [domainIndex, setDomainIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const progress = useTransform(x, [0, Math.max(trackWidth, 1)], [0, 1]);
  const active = paths[domainIndex] ?? paths[0];
  const accent = DOMAIN_ACCENT[active?.domain] ?? "#006bbf";
  const stageCount = active?.progression.length ?? 4;

  // Refs mirroring the latest stageIndex/stageCount so the mount-once
  // ResizeObserver below can reposition the handle after a resize without
  // depending on (and re-subscribing to) React state.
  const stageIndexRef = useRef(0);
  const stageCountRef = useRef(stageCount);
  useEffect(() => {
    stageIndexRef.current = stageIndex;
    stageCountRef.current = stageCount;
  }, [stageIndex, stageCount]);

  useEffect(() => {
    if (!pathRef.current) return;
    setPathLength(pathRef.current.getTotalLength());
  }, []);

  // Measures the track and keeps the handle aligned with the current stage
  // on resize. This is the ONLY place that reacts to width changes — it
  // must not also depend on `stageIndex`, or every stage change would
  // re-trigger this effect and fight the explicit spring in `jumpToStage`,
  // which was causing jumps to silently land on the wrong stage.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setTrackWidth(width);
      const target = (stageIndexRef.current / (stageCountRef.current - 1)) * width;
      x.set(target);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [x]);

  useMotionValueEvent(progress, "change", (v) => {
    const idx = progressToStageIndex(v, stageCount);
    setStageIndex((prev) => (prev === idx ? prev : idx));
  });

  const dashOffset = useTransform(progress, [0, 1], [pathLength, 0]);
  const handleTop = useTransform(
    progress,
    [0, 1 / 3, 2 / 3, 1],
    STAGE_Y.map((y) => `${(y / VIEW_H) * 100}%`),
  );

  const stage = active?.progression[stageIndex];
  const role = active?.roles[stageIndex % (active.roles.length || 1)];

  function jumpToStage(i: number) {
    if (trackWidth === 0) return;
    setStageIndex(i);
    // Critically damped (damping > ~2*sqrt(stiffness)) so the puck glides
    // straight to the target stage without overshooting past it — an
    // oscillating spring here would transiently cross other stage
    // boundaries and flash the wrong label mid-flight.
    animate(x, (i / (stageCount - 1)) * trackWidth, { type: "spring", stiffness: 300, damping: 40 });
  }

  // Switching domains resets the scrubber to stage 0 — driven from the
  // click handler itself (not an effect keyed on domainIndex), so it's a
  // direct response to user input rather than a derived side effect.
  function selectDomain(i: number) {
    setDomainIndex(i);
    setStageIndex(0);
    x.set(0);
  }

  function onHandleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      jumpToStage(Math.min(stageCount - 1, stageIndex + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      jumpToStage(Math.max(0, stageIndex - 1));
    }
  }

  const stageDots = useMemo(
    () => STAGE_X.map((sx, i) => ({ x: (sx / VIEW_W) * 100, y: (STAGE_Y[i] / VIEW_H) * 100, i })),
    [],
  );

  if (!active) return null;

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8 lg:p-10">
      {/* Domain selector */}
      {showSelector && (
      <div className="flex flex-wrap gap-2">
        {paths.map((p, i) => {
          const Icon = domainIcon[p.domain];
          const isActive = i === domainIndex;
          return (
            <button
              key={p.domain}
              type="button"
              onClick={() => selectDomain(i)}
              data-cursor="Explore"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "border-transparent text-white shadow-[var(--shadow-2)]"
                  : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-foreground)]"
              }`}
              style={isActive ? { background: DOMAIN_ACCENT[p.domain] } : undefined}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {p.domain}
            </button>
          );
        })}
      </div>
      )}

      <p className="mt-4 max-w-lg text-sm text-[var(--color-muted-foreground)]">{active.tagline}</p>

      {prefersReducedMotion ? (
        /* Reduced-motion fallback: a plain static stepper, no drag/SVG. */
        <ol className="mt-8 grid gap-3 sm:grid-cols-4">
          {active.progression.map((stg, i) => (
            <li key={stg.stage} className="rounded-xl border border-[var(--color-border)] p-4">
              <span className="text-xs font-mono text-[var(--color-muted-foreground)]">{stg.years}</span>
              <p className="mt-1 font-semibold text-[var(--color-foreground)]">{stg.stage}</p>
              {i === 0 && <span className="mt-2 block text-xs text-[var(--color-accent)]">Start here</span>}
            </li>
          ))}
        </ol>
      ) : (
        <>
          {/* Trajectory scrubber */}
          <div className="relative mt-10 h-44 select-none sm:h-52" ref={trackRef}>
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="none"
              aria-hidden
            >
              {/* Ghost track (full path, faint) */}
              <path d={PATH_D} fill="none" stroke="var(--color-border)" strokeWidth={3} strokeLinecap="round" />
              {/* Revealed portion, drawn up to the current drag progress */}
              <motion.path
                ref={pathRef}
                d={PATH_D}
                fill="none"
                stroke={accent}
                strokeWidth={3}
                strokeLinecap="round"
                style={{ strokeDasharray: pathLength, strokeDashoffset: dashOffset }}
              />
            </svg>

            {/* Stage nodes */}
            {stageDots.map(({ x: xPct, y: yPct, i }) => {
              const isReached = i <= stageIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => jumpToStage(i)}
                  aria-label={`Jump to ${active.progression[i].stage}`}
                  data-cursor="Jump"
                  className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                  style={{ left: `${xPct}%`, top: `${yPct}%` }}
                >
                  <motion.span
                    className="flex h-4 w-4 items-center justify-center rounded-full border-2"
                    animate={{
                      scale: isReached ? 1 : 0.75,
                      backgroundColor: isReached ? accent : "var(--color-background)",
                      borderColor: isReached ? accent : "var(--color-border)",
                    }}
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                </button>
              );
            })}

            {/* Draggable handle — mouse/touch drag, arrow-key accessible */}
            <motion.div
              role="slider"
              tabIndex={0}
              aria-label="Career stage"
              aria-valuemin={0}
              aria-valuemax={stageCount - 1}
              aria-valuenow={stageIndex}
              aria-valuetext={stage?.stage}
              onKeyDown={onHandleKeyDown}
              drag="x"
              dragConstraints={trackRef}
              dragElastic={0.06}
              dragMomentum={false}
              onDragEnd={() => {
                const idx = progressToStageIndex(progress.get(), stageCount);
                jumpToStage(idx);
              }}
              data-cursor="Drag"
              style={{
                x,
                top: handleTop,
              }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing"
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 -m-3 rounded-full"
                style={{ border: `2px solid ${accent}` }}
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-[var(--shadow-3)]"
                style={{ background: accent }}
              >
                <IconArrowRight className="h-4 w-4" />
              </span>
            </motion.div>
          </div>

          {/* Current stage readout */}
          <motion.div
            key={`${domainIndex}-${stageIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1"
          >
            <span className="font-mono text-xs text-[var(--color-muted-foreground)]">{stage?.years}</span>
            <h4 className="text-xl font-bold text-[var(--color-foreground)]">{stage?.stage}</h4>
            {role && <span className="text-sm text-[var(--color-muted-foreground)]">— {role.desc}</span>}
          </motion.div>
        </>
      )}

      {/* Roles + industries */}
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Roles this path unlocks
          </h5>
          <div className="mt-3 flex flex-wrap gap-2">
            {active.roles.map((r) => (
              <span
                key={r.title}
                className="rounded-full bg-[var(--color-muted)] px-3 py-1.5 text-sm text-[var(--color-muted-foreground)]"
              >
                {r.title}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Industries hiring
          </h5>
          <div className="mt-3 flex flex-wrap gap-2">
            {active.industries.map((ind) => (
              <span
                key={ind}
                className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-muted-foreground)]"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>

      {footerLink && (
      <div className="mt-8">
        <Link
          href="/career-paths"
          data-cursor="View"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:gap-3 transition-all"
        >
          See full career path details <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
      )}
    </div>
  );
}
