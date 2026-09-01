import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCareerPaths, getProgram } from "@/lib/db";
import { CareerSimulator } from "@/components/CareerSimulator";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { domainIcon, IconSparkle, IconArrowRight } from "@/components/icons";
import { careerPathSlug, careerPathProgramSlug } from "@/lib/config";

// ISR: statically render each domain page and revalidate hourly.
export const revalidate = 3600;

export async function generateStaticParams() {
  const paths = await getCareerPaths();
  return paths.map((cp) => ({ domain: careerPathSlug(cp.domain) }));
}

async function getPathBySlug(slug: string) {
  const paths = await getCareerPaths();
  return paths.find((cp) => careerPathSlug(cp.domain) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const cp = await getPathBySlug(domain);
  if (!cp) return { title: "Career Path" };
  return {
    title: `${cp.domain} Career Path`,
    description: cp.tagline,
  };
}

export default async function CareerPathDetailPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const cp = await getPathBySlug(domain);
  if (!cp) notFound();

  const Icon = domainIcon[cp.domain] ?? IconSparkle;
  const programSlug = careerPathProgramSlug[cp.domain];
  const program = programSlug ? await getProgram(programSlug) : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      {/* Back link */}
      <Link
        href="/career-paths"
        data-cursor="Back"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
      >
        <IconArrowRight className="h-4 w-4 rotate-180" /> All career paths
      </Link>

      {/* Hero */}
      <Reveal className="mt-8">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] brand-gradient animate-gradient p-8 text-white sm:p-12">
          <span aria-hidden className="absolute inset-0 bg-black/15" />
          <div className="relative flex flex-wrap items-center gap-5">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Icon className="h-8 w-8" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                Career path
              </span>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{cp.domain}</h1>
            </div>
          </div>
          <p className="relative mt-6 max-w-xl text-lg text-white/90">{cp.tagline}</p>
        </div>
      </Reveal>

      {/* Interactive trajectory slider, scoped to this single domain */}
      <Reveal className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
          Drag to see where this path leads
        </h2>
        <div className="mt-6">
          <CareerSimulator paths={[cp]} showSelector={false} footerLink={false} />
        </div>
      </Reveal>

      {/* Related program CTA */}
      {program && (
        <Reveal className="mt-12">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 sm:flex-row sm:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                Train for this path
              </span>
              <h3 className="mt-2 text-2xl font-bold text-[var(--color-foreground)]">
                {program.title}
              </h3>
              <p className="mt-2 max-w-xl text-[var(--color-muted-foreground)]">
                {program.short_desc}
              </p>
            </div>
            <Button href={`/programs/${program.slug}`} size="lg">
              Explore program <IconArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      )}

      <div className="mt-16 text-center">
        <Button href="/programs" variant="secondary" size="lg">
          Browse all programs <IconArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
