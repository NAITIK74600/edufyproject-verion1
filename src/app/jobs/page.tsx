import type { Metadata } from "next";
import Link from "next/link";
import { getCareerPaths } from "@/lib/db";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { domainIcon, IconSparkle, IconArrowRight, IconBriefcase, IconPin, IconDownload } from "@/components/icons";
import { careerPathSlug, SITE, withBase } from "@/lib/config";

// ISR: cache the jobs/career-paths listing and revalidate hourly.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Career Paths",
  description:
    "Explore the roles, industries, and career progression each Edufyi Tech Solutions domain unlocks.",
};

const openRoles = [
  {
    title: "Marketing Lead Generation Specialist",
    location: "HSR 2nd Sector, Bengaluru",
    type: "Probation (3 months) → Full-time",
    comp: "₹7 LPA CTC post-probation · ₹30,000/mo during probation",
    summary:
      "Develop and implement lead generation strategies, identify target markets, and run campaigns to attract potential learners.",
    pdf: "/careers/marketing-lead-generation-specialist.pdf",
  },
  {
    title: "Business Development Associate (BDA)",
    location: "HSR Sector 1, Bengaluru",
    type: "Probation (3 months) → Full-time",
    comp: "UG ₹4.5+2.5 LPA · PG ₹6.5+2.5 LPA · ₹18k+12k/mo during probation",
    summary:
      "Identify and connect with clients and educational institutions, build lasting relationships, and promote our EdTech products.",
    pdf: "/careers/business-development-associate.pdf",
  },
  {
    title: "Business Operations Executive (BOE)",
    location: "HSR Sector 1, Bengaluru",
    type: "Probation (3 months) → Full-time",
    comp: "UG ₹4.5+2.5 LPA · PG ₹6.5+2.5 LPA · ₹18k+12k/mo during probation",
    summary:
      "Guide students toward suitable programs, nurture professional relationships, and support organizational growth initiatives.",
    pdf: "/careers/business-operations-executive.pdf",
  },
];

export default async function CareerPathsPage() {
  const paths = await getCareerPaths();
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Career paths"
        title={<>Where each domain can take you</>}
        subtitle="Typical roles, hiring industries, and how your career grows over time."
      />

      <div className="mt-14 space-y-10">
        {paths.map((cp, idx) => {
          const Icon = domainIcon[cp.domain] ?? IconSparkle;
          return (
            <Reveal
              key={cp.domain}
              delay={idx * 60}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl brand-gradient text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[var(--color-foreground)]">{cp.domain}</h2>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{cp.tagline}</p>
                </div>
                <Link
                  href={`/jobs/${careerPathSlug(cp.domain)}`}
                  data-cursor="Explore"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white
                  bg-[linear-gradient(325deg,#0b6f9e_0%,#2ad7ea_52%,#0b6f9e_90%)] [background-size:280%_auto] [background-position:0%_center]
                  shadow-[0_0_14px_rgba(42,215,234,0.35),inset_2px_2px_5px_rgba(160,235,255,0.4),inset_-2px_-2px_5px_rgba(11,80,120,0.5)]
                  transition-[background-position,box-shadow,gap] duration-500
                  hover:[background-position:100%_center] hover:gap-3 hover:shadow-[0_0_26px_rgba(42,215,234,0.6),inset_2px_2px_5px_rgba(160,235,255,0.45),inset_-2px_-2px_5px_rgba(11,80,120,0.55)]
                  active:scale-95"
                >
                  Explore path <IconArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                    Typical roles
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {cp.roles.map((r) => (
                      <div
                        key={r.title}
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background-2)] p-4"
                      >
                        <div className="font-semibold text-[var(--color-foreground)]">{r.title}</div>
                        <div className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                          {r.desc}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="mt-6 text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                    Hiring industries
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cp.industries.map((ind) => (
                      <span
                        key={ind}
                        className="rounded-full bg-[var(--color-muted)] px-3 py-1 text-sm text-[var(--color-muted-foreground)]"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                    Career progression
                  </h3>
                  <ol className="mt-4 space-y-3">
                    {cp.progression.map((step, i) => (
                      <li key={step.stage} className="flex items-center gap-4">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/15 text-sm font-bold text-[var(--color-primary)]">
                          {i + 1}
                        </span>
                        <div className="flex flex-1 items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-background-2)] px-4 py-2.5">
                          <span className="text-sm font-medium text-[var(--color-foreground)]">{step.stage}</span>
                          <span className="text-xs text-[var(--color-muted-foreground)]">
                            {step.years}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <section className="mt-24">
        <SectionHeading
          eyebrow="We're hiring"
          title={<>Open positions at Edufyi</>}
          subtitle="Join our team in Bengaluru. Download the full job description for each role."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {openRoles.map((role, i) => (
            <Reveal
              key={role.title}
              delay={i * 60}
              className="flex h-full flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl brand-gradient text-white">
                  <IconBriefcase className="h-5 w-5" />
                </span>
                <div className="flex flex-wrap justify-end gap-2">
                  <a
                    href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Application for ${role.title}`)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white
                    bg-[linear-gradient(325deg,#0b6f9e_0%,#2ad7ea_52%,#0b6f9e_90%)] [background-size:280%_auto] [background-position:0%_center]
                    shadow-[0_0_14px_rgba(42,215,234,0.35),inset_2px_2px_5px_rgba(160,235,255,0.4),inset_-2px_-2px_5px_rgba(11,80,120,0.5)]
                    transition-[background-position,box-shadow] duration-500
                    hover:[background-position:100%_center] hover:shadow-[0_0_26px_rgba(42,215,234,0.6),inset_2px_2px_5px_rgba(160,235,255,0.45),inset_-2px_-2px_5px_rgba(11,80,120,0.55)]
                    active:scale-95"
                  >
                    Apply
                  </a>
                  <a
                    href={withBase(role.pdf)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    <IconDownload className="h-4 w-4" /> View JD
                  </a>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[var(--color-foreground)]">{role.title}</h3>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
                <IconPin className="h-4 w-4 shrink-0" /> {role.location}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {role.summary}
              </p>
              <dl className="mt-4 space-y-1.5 text-xs text-[var(--color-muted-foreground)]">
                <div>
                  <dt className="inline font-semibold text-[var(--color-foreground)]">Type: </dt>
                  <dd className="inline">{role.type}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-[var(--color-foreground)]">Compensation: </dt>
                  <dd className="inline">{role.comp}</dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mt-16 text-center">
        <Button href="/programs" size="lg">
          Find your program <IconArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
