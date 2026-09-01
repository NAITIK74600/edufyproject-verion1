"use client";

import { useMemo, useState } from "react";
import type { SuccessStory } from "@/lib/types";
import { Reveal } from "./Reveal";
import { IconLinkedin, IconStar } from "./icons";

export function SuccessBrowser({ stories }: { stories: SuccessStory[] }) {
  const domains = useMemo(() => {
    const set = new Set(stories.map((s) => s.domain));
    return ["All", ...Array.from(set)];
  }, [stories]);
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? stories : stories.filter((s) => s.domain === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {domains.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setActive(d)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all ${
              d === active
                ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-2)]"
                : "glass text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s, i) => (
          <Reveal
            key={s.name}
            delay={i * 60}
            className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-1)] card-glow"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full brand-gradient text-lg font-bold text-white">
                {s.name.charAt(0)}
              </span>
              <div>
                <div className="font-semibold text-[var(--color-foreground)]">{s.name}</div>
                <div className="text-xs text-[var(--color-accent)]">{s.outcome}</div>
              </div>
            </div>
            <div className="mt-4 flex gap-0.5 text-[var(--color-accent)]">
              {Array.from({ length: 5 }).map((_, k) => (
                <IconStar key={k} className="h-3.5 w-3.5" />
              ))}
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-foreground)]/90">
              “{s.quote}”
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-muted-foreground)]">
              <span>
                {s.program}
                {s.company ? ` · ${s.company}` : ""}
              </span>
              {s.linkedin_url && (
                <a
                  href={s.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.name} on LinkedIn`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg glass text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
                >
                  <IconLinkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
