import Link from "next/link";
import { Button } from "./Button";
import { IconSparkle, IconArrowRight } from "./icons";

export function ComingSoon({
  eyebrow,
  title,
  description,
  features,
}: {
  eyebrow: string;
  title: string;
  description: string;
  features?: string[];
}) {
  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden">
      <div aria-hidden className="absolute inset-0 grid-lines" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary)]/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-2xl px-6 py-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
          <IconSparkle className="h-4 w-4 animate-pulse-glow" />
          {eyebrow}
        </span>
        <h1 className="mt-6 text-4xl font-bold sm:text-6xl">
          <span className="brand-gradient-text">{title}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-[var(--color-muted-foreground)]">
          {description}
        </p>

        {features && features.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {features.map((f) => (
              <span
                key={f}
                className="rounded-full glass px-4 py-2 text-sm text-[var(--color-foreground)]/90"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/programs" size="lg">
            Explore Programs <IconArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Notify me
          </Button>
        </div>

        <p className="mt-8 text-sm text-[var(--color-muted-foreground)]">
          Meanwhile, head back to the{" "}
          <Link href="/" className="text-[var(--color-primary)] hover:underline">
            homepage
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
