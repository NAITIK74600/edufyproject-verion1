import type { Metadata } from "next";
import { B2BForm } from "@/components/B2BForm";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { IconCheck, IconUsers, IconRocket, IconBrain } from "@/components/icons";

export const metadata: Metadata = {
  title: "For Colleges & Companies",
  description:
    "Partner with Edufyi Tech Solutions for training, hiring, collaborative programs, and technology solutions.",
};

const valueProps = [
  {
    Icon: IconBrain,
    title: "Upskill your people",
    desc: "Custom cohorts in AI, data, security, and HR — built to your goals.",
  },
  {
    Icon: IconUsers,
    title: "Hire job-ready talent",
    desc: "Access a pipeline of trained, project-tested candidates.",
  },
  {
    Icon: IconRocket,
    title: "Collaborate & build",
    desc: "Joint programs, hackathons, and technology solutions delivery.",
  },
];

const collaborations = [
  "50+ college training programs delivered",
  "120+ companies hiring our graduates",
  "10,000+ learners trained across India",
  "Government-aligned skilling initiatives",
];

export default function PartnersPage() {
  return (
    <div className="relative overflow-hidden">
      <BackgroundVideo src="/video/partners-bg.mp4" />
      <div aria-hidden className="absolute inset-0 grid-lines opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <SectionHeading
          eyebrow="For Colleges & Companies"
          title={<>Partner with Edufyi Tech Solutions</>}
          subtitle="Train your teams, hire our graduates, or build together. Let's create outcomes at scale."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {valueProps.map((v, i) => (
            <Reveal
              key={v.title}
              delay={i * 80}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 card-glow"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl brand-gradient text-white">
                <v.Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[var(--color-foreground)]">{v.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{v.desc}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-bold">Past collaborations</h2>
            <p className="mt-2 text-[var(--color-muted-foreground)]">
              A track record of measurable impact with institutions and industry.
            </p>
            <ul className="mt-6 space-y-3">
              {collaborations.map((c) => (
                <li key={c} className="flex items-center gap-3 text-sm text-[var(--color-foreground)]/90">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent-2)]/15 text-[var(--color-accent-2)]">
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl glass p-5 text-sm text-[var(--color-muted-foreground)]">
              Inquiries here route to our dedicated partnerships inbox — separate
              from student support — so you always reach the right team.
            </div>
          </div>

          <div
            id="inquiry"
            className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8"
          >
            <h2 className="text-xl font-bold">Partnership inquiry</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Tell us what you need and we&apos;ll respond within two business days.
            </p>
            <div className="mt-6">
              <B2BForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
