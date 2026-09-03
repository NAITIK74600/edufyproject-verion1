"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { BrainCircuit, Compass, Hammer, GraduationCap, Rocket } from "lucide-react";
import { withBase } from "@/lib/config";

type Stage = {
  Icon: typeof Compass;
  title: string;
  desc: string;
  accent: string;
  /** Full-bleed background image for this stage, shown at full color. */
  image: string;
  /** When set, the background is a scroll-driven frame sequence instead of a static image. */
  sequence?: { dir: string; frameCount: number };
  /** When set, the background is a looping video instead of a static image/sequence. */
  video?: string;
};

// Scroll-driven frame sequence. The JPEG frames live in /public/<dir> named
// ezgif-frame-001.jpg… and are drawn to a canvas, with the frame index mapped
// to this stage's slice of the scroll timeline.
const framePath = (dir: string, i: number) =>
  withBase(`/${dir}/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`);

function FrameSequence({
  progress,
  dir,
  frameCount,
  active,
}: {
  progress: MotionValue<number>;
  dir: string;
  frameCount: number;
  /** Preload/draw only while the stage is active or adjacent, to avoid a
   *  large upfront payload when many sequences share one page. */
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(-1);
  const loaded = useRef(false);

  const draw = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    // Cover fit: fill the canvas, cropping overflow, centered.
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    currentFrame.current = index;
  }, []);

  // Preload every frame the first time this stage becomes active/adjacent, so
  // scrubbing is instant without loading all sequences up front.
  useEffect(() => {
    if (!active || loaded.current) return;
    loaded.current = true;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = framePath(dir, i);
      imgs.push(img);
    }
    imagesRef.current = imgs;
    const first = () => draw(currentFrame.current < 0 ? 0 : currentFrame.current);
    if (imgs[0].complete) first();
    else imgs[0].onload = first;
  }, [active, draw, dir, frameCount]);

  useEffect(() => {
    const onResize = () => draw(currentFrame.current < 0 ? 0 : currentFrame.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  useMotionValueEvent(progress, "change", (v) => {
    const index = Math.min(frameCount - 1, Math.max(0, Math.round(v * (frameCount - 1))));
    if (index !== currentFrame.current) draw(index);
  });

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

const stages: Stage[] = [
  {
    Icon: Compass,
    title: "Discover Your Path",
    desc: "Explore AI/ML, Data Science, Cybersecurity, or HR — and find the domain that fits where you want to go.",
    accent: "#006bbf",
    image: "/icons/discover-path.png",
    video: "/video/discover-your-path.mp4",
  },
  {
    Icon: Hammer,
    title: "Learn By Building",
    desc: "Six real-time and capstone projects per program. No filler theory — you ship things that work.",
    accent: "#24c5db",
    image: "/icons/learn-by-building.png",
  },
  {
    Icon: GraduationCap,
    title: "Get Mentored",
    desc: "1:1 guidance from engineers and leaders already doing the job you're training for.",
    accent: "#04708f",
    image: "/icons/get-mentored.png",
  },
  {
    Icon: BrainCircuit,
    title: "Practice With AIRA",
    desc: "Build confidence with AI-powered practice, mock interviews, instant feedback, and personalised support for every step of your career preparation.",
    accent: "#2ad7ea",
    image: "/icons/practice-with-aira.png",
  },
  {
    Icon: Rocket,
    title: "Get Placed",
    desc: "Portfolio reviews, mock interviews, and warm introductions to our 120+ hiring partners.",
    accent: "#16a34a",
    image: "/icons/get-placed.png",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Scroll progress within each stage's own slice of the timeline (0 → 1),
  // used to scrub that stage's frame sequence. stages is a fixed-length
  // module constant, so calling the hook per stage keeps a stable hook order.
  const n = stages.length;
  /* eslint-disable react-hooks/rules-of-hooks */
  const stageProgress = stages.map((_, i) =>
    useTransform(scrollYProgress, [i / n, (i + 1) / n], [0, 1]),
  );
  /* eslint-enable react-hooks/rules-of-hooks */

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(stages.length - 1, Math.max(0, Math.floor(v * stages.length)));
    setActive(idx);
  });

  // Respect reduced-motion: render a simple static stacked list, no pinning.
  if (prefersReducedMotion) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="space-y-10">
          {stages.map((s, i) => (
            <div key={s.title} className="flex items-start gap-5">
              <span
                className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
                style={{ background: s.accent }}
              >
                <s.Icon className="h-6 w-6" />
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 text-2xl font-bold text-[var(--color-foreground)]">{s.title}</h3>
                <p className="mt-2 max-w-md text-[var(--color-muted-foreground)]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${stages.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Full-bleed stage photography — each stage's image crossfades in at
             full, vivid color (no wash/scrim over the image itself). */}
        {stages.map((s, i) => (
          <motion.div
            key={s.title}
            aria-hidden
            className="absolute inset-0"
            animate={{ opacity: active === i ? 1 : 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={
              s.sequence || s.video || !s.image
                ? { background: "#050c13" }
                : {
                    backgroundImage: `url(${withBase(s.image)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
            }
          >
            {s.sequence && (
              <FrameSequence
                progress={stageProgress[i]}
                dir={s.sequence.dir}
                frameCount={s.sequence.frameCount}
                active={Math.abs(active - i) <= 1}
              />
            )}
            {s.video && (
              <video
                className="h-full w-full object-cover"
                src={withBase(s.video)}
                autoPlay
                loop
                muted
                playsInline
                preload={Math.abs(active - i) <= 1 ? "auto" : "none"}
              />
            )}
          </motion.div>
        ))}

        {/* Directional scrim behind the copy only — fully opaque under the
             text column (the source images bake in their own duplicate
             headline there) fading to clear by mid-image so the character
             illustration keeps its full, vivid color. */}
        <div
          aria-hidden
          className="absolute inset-0 hidden lg:block bg-[linear-gradient(to_right,rgba(4,10,14,0.97)_0%,rgba(4,10,14,0.94)_32%,rgba(4,10,14,0.55)_50%,rgba(4,10,14,0)_72%)]"
        />
        {/* Mobile scrim: a mostly-dark vertical wash so the full-width copy
             stays legible over the cropped frame on small screens. */}
        <div
          aria-hidden
          className="absolute inset-0 lg:hidden bg-[linear-gradient(to_top,rgba(4,10,14,0.94)_0%,rgba(4,10,14,0.72)_50%,rgba(4,10,14,0.62)_100%)]"
        />
        {/* Bottom fade so the mobile progress dots always sit on dark ground. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent lg:hidden"
        />

        <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 px-6 lg:pl-36 lg:pr-10">
          {/* Left: eyebrow + crossfading stage copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm">
              Your journey with us
            </span>
            <div className="relative mt-6 h-64 sm:h-56">
              {stages.map((s, i) => (
                <motion.div
                  key={s.title}
                  className="absolute inset-0 flex flex-col justify-center"
                  animate={{
                    opacity: active === i ? 1 : 0,
                    y: active === i ? 0 : active > i ? -28 : 28,
                  }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <span className="font-mono text-sm text-white/70">
                    {String(i + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                  </span>
                  {/* Cinematic clip-reveal, word by word — replays every time
                       this stage becomes active, not just once on mount. */}
                  <h3 className="mt-2 flex flex-wrap text-3xl font-bold text-white sm:text-4xl">
                    {s.title.split(" ").map((word, wi) => (
                      <span key={wi} className="mr-[0.28em] inline-block overflow-hidden pb-1">
                        <motion.span
                          className="inline-block"
                          animate={{ y: active === i ? "0%" : "110%" }}
                          transition={{
                            duration: 0.6,
                            ease: EASE,
                            delay: active === i ? 0.08 + wi * 0.06 : 0,
                          }}
                        >
                          {word}
                        </motion.span>
                      </span>
                    ))}
                  </h3>
                  <p className="mt-4 max-w-md text-white/85">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Left-docked vertical progress rail (desktop only) — anchored to
             the section edge, not the copy column, so it reads as a
             persistent journey timeline rather than a boxed-in element. */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-30% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 sm:left-6 lg:left-10 lg:flex"
        >
          <div className="relative flex h-96 w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl">
            <div className="relative h-[calc(100%-3.5rem)] w-px">
              <div className="absolute inset-0 bg-white/25" />
              <motion.div
                className="absolute left-0 top-0 w-px bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]"
                style={{ height: railHeight }}
              />
              {stages.map((s, i) => {
                const pct = (i / (stages.length - 1)) * 100;
                const isActive = active >= i;
                const isCurrent = active === i;
                return (
                  <motion.span
                    key={s.title}
                    className="absolute left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2"
                    style={{ top: `${pct}%` }}
                    animate={{
                      scale: isCurrent ? 1.18 : isActive ? 1 : 0.82,
                      backgroundColor: isActive ? s.accent : "rgba(255,255,255,0.14)",
                      borderColor: isActive ? s.accent : "rgba(255,255,255,0.4)",
                      color: isActive ? "#ffffff" : "rgba(255,255,255,0.7)",
                      boxShadow: isCurrent
                        ? `0 0 0 6px ${s.accent}33, 0 10px 24px ${s.accent}70`
                        : "0 2px 8px rgba(0,0,0,0.35)",
                    }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {/* Pulsing ring — draws the eye to the current stage. */}
                    {isCurrent && (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full"
                        style={{ border: `2px solid ${s.accent}` }}
                        animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    <motion.span
                      animate={{ rotate: isCurrent ? 360 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="flex"
                    >
                      <s.Icon className="h-5 w-5" />
                    </motion.span>
                  </motion.span>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Mobile progress dots */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl lg:hidden">
          {stages.map((s, i) => (
            <span
              key={s.title}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: active === i ? "1.75rem" : "0.375rem",
                background: active === i ? s.accent : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
