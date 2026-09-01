import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

type Props = {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  index,
  title,
  subtitle,
  center = true,
  className = "",
}: Props) {
  return (
    <div
      className={`${center ? "mx-auto text-center" : ""} max-w-2xl ${className}`}
    >
      <Reveal as="div" className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        {index && (
          <span className="data-label text-[var(--color-muted-foreground)]">{index}</span>
        )}
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
            {eyebrow}
          </span>
        )}
      </Reveal>
      <Reveal as="div" delay={80}>
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-[2.75rem] leading-[1.1]">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal as="div" delay={160}>
          <p className="mt-4 text-base text-[var(--color-muted-foreground)] sm:text-lg">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
