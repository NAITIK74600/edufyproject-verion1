"use client";

import { useMemo, useState } from "react";
import type { Program } from "@/lib/types";
import { ProgramCard } from "./ProgramCard";
import { Reveal } from "./Reveal";

export function ProgramsBrowser({ programs }: { programs: Program[] }) {
  const categories = useMemo(() => {
    const set = new Set(programs.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [programs]);

  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? programs
      : programs.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-2)]"
                  : "glass text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-[var(--color-muted-foreground)]">
          No programs in this category yet.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((program, i) => (
            <Reveal key={program.slug} delay={i * 60} className="h-full">
              <ProgramCard program={program} index={i} showPrice={false} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
