import type { Testimonial } from "@/lib/types";
import { IconStar } from "./icons";
import { Reveal } from "./Reveal";

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((t, i) => (
        <Reveal
          key={t.name}
          delay={i * 80}
          className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-1)] card-glow"
        >
          <div className="flex gap-0.5 text-[var(--color-accent)]">
            {Array.from({ length: t.rating }).map((_, s) => (
              <IconStar key={s} className="h-4 w-4" />
            ))}
          </div>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-foreground)]/90">
            “{t.quote}”
          </p>
          <div className="mt-5 flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full brand-gradient text-sm font-bold text-white">
              {t.name.charAt(0)}
            </span>
            <div>
              <div className="text-sm font-semibold text-[var(--color-foreground)]">{t.name}</div>
              <div className="text-xs text-[var(--color-muted-foreground)]">
                {t.role}
                {t.company ? ` · ${t.company}` : ""}
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
