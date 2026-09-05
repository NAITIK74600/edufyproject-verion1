import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProgram, getPrograms, getCareerPaths } from "@/lib/db";
import { careerPathSlug } from "@/lib/config";
import { programBrochure } from "@/lib/brochures";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { CareerSimulator } from "@/components/CareerSimulator";
import {
  IconStar,
  IconClock,
  IconLevel,
  IconCheck,
  IconArrowRight,
  IconDownload,
  domainIcon,
  programIcon,
  IconSparkle,
} from "@/components/icons";

// ISR: statically render each program page and revalidate hourly.
export const revalidate = 3600;

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return { title: "Program not found" };
  return {
    title: program.title,
    description: program.short_desc,
  };
}

export default async function ProgramDetail({
  params,
}: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();

  const Icon = programIcon[program.slug] ?? domainIcon[program.category] ?? IconSparkle;
  const brochure = programBrochure[program.slug];

  // Career trajectory for this program's domain (only 4 domains have a mapped
  // path — programs outside them simply don't render the slider).
  const careerPaths = await getCareerPaths();
  const careerPath = careerPaths.find((cp) => cp.domain === program.category) ?? null;

  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div aria-hidden className="absolute inset-0 grid-lines" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-[var(--color-secondary)]/15 blur-[120px]"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <Link
            href="/programs"
            className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)]"
          >
            ← All programs
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl brand-gradient text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-[var(--color-muted)] px-3 py-1 text-xs font-medium text-[var(--color-muted-foreground)]">
                  {program.category}
                </span>
              </div>
              <h1 className="mt-5 text-4xl font-bold sm:text-5xl">{program.title}</h1>
              <p className="mt-4 max-w-2xl text-lg text-[var(--color-muted-foreground)]">
                {program.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--color-muted-foreground)]">
                <span className="inline-flex items-center gap-2">
                  <IconClock className="h-4 w-4" /> {program.duration}
                </span>
                <span className="inline-flex items-center gap-2">
                  <IconLevel className="h-4 w-4" /> {program.level}
                </span>
                <span className="inline-flex items-center gap-2 text-[var(--color-accent)]">
                  <IconStar className="h-4 w-4" /> {Number(program.rating).toFixed(1)} rating
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {program.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full glass px-3 py-1 text-xs text-[var(--color-muted-foreground)]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Enrolment block */}
            <aside className="h-fit rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 lg:sticky lg:top-24">
              <p className="text-sm text-[var(--color-muted-foreground)]">Flexible plans</p>
              <p className="mt-1 text-2xl font-bold text-[var(--color-foreground)]">
                From self-paced to full placement support
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                EMI options available · Scholarships for early applicants
              </p>
              <div className="mt-5">
                <Button href={`/pricing?course=${program.slug}`} variant="accent" className="w-full">
                  View Pricing &amp; Enroll
                </Button>
              </div>
              <ul className="mt-6 space-y-2.5">
                {program.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-[var(--color-foreground)]/90">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-2)]" />
                    {o}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-16">
            {/* Curriculum */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Curriculum</h2>
                {brochure && (
                  <a
                    href={brochure}
                    download
                    data-cursor="Download"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/15"
                  >
                    <IconDownload className="h-4 w-4" /> Download Brochure
                  </a>
                )}
              </div>
              <div className="mt-6 space-y-3">
                {program.syllabus.map((module, i) => (
                  <Reveal
                    key={module}
                    delay={i * 50}
                    className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/15 text-sm font-bold text-[var(--color-primary)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium text-[var(--color-foreground)]">{module}</span>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-2xl font-bold">6 real-world projects</h2>
              <p className="mt-2 text-[var(--color-muted-foreground)]">
                Every project ships to your portfolio.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {program.projects.map((p, i) => (
                  <Reveal
                    key={p.title}
                    delay={i * 50}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 card-glow"
                  >
                    <div className="flex items-center gap-2 text-[var(--color-accent)]">
                      <IconSparkle className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Project {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-[var(--color-foreground)]">{p.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{p.desc}</p>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Mentors */}
            <section>
              <h2 className="text-2xl font-bold">Learn from mentors who&apos;ve done it</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {program.mentors.map((m, i) => (
                  <Reveal
                    key={m.name}
                    delay={i * 60}
                    className="flex gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
                  >
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full brand-gradient text-lg font-bold text-white">
                      {m.name.charAt(0)}
                    </span>
                    <div>
                      <h3 className="font-semibold text-[var(--color-foreground)]">{m.name}</h3>
                      <p className="text-xs text-[var(--color-accent)]">{m.role}</p>
                      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{m.bio}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          </div>

          {/* Tools sidebar */}
          <aside className="h-fit space-y-8 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Tools & technologies</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {program.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-lg glass px-3 py-1.5 text-sm text-[var(--color-foreground)]/90"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl brand-gradient p-6">
              <h3 className="text-lg font-semibold text-white">Ready to start?</h3>
              <p className="mt-2 text-sm text-white/90">
                Choose a plan and enrol online — access is granted the moment your payment succeeds.
              </p>
              <Button
                href={`/pricing?course=${program.slug}`}
                variant="invert"
                className="mt-4 w-full"
              >
                View Pricing &amp; Enroll <IconArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* Career trajectory for this program's domain */}
      {careerPath && (
        <section className="border-t border-[var(--color-border)] bg-[var(--color-background-2)]/40">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                  Where this program leads
                </span>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Drag to see your {careerPath.domain} career path
                </h2>
                <p className="mt-2 max-w-xl text-[var(--color-muted-foreground)]">
                  A real, data-backed trajectory — roles, industries, and growth stages for this domain.
                </p>
              </div>
              <Link
                href={`/jobs/${careerPathSlug(careerPath.domain)}`}
                data-cursor="View"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition-all hover:gap-3"
              >
                Full career path <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <Reveal className="mt-8">
              <CareerSimulator paths={[careerPath]} showSelector={false} footerLink={false} />
            </Reveal>
          </div>
        </section>
      )}
    </article>
  );
}
