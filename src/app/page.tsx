import Link from "next/link";
import { withBase } from "@/lib/config";
import { getFeaturedPrograms, getTestimonials, getSuccessStories } from "@/lib/db";
import { ProgramCard } from "@/components/ProgramCard";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { Button } from "@/components/Button";
import { HeroHeadline } from "@/components/HeroHeadline";
import { HeroStats } from "@/components/HeroStats";
import { RoleCycler } from "@/components/RoleCycler";
import { HeroPlacementTicker } from "@/components/HeroPlacementTicker";
import { ScrollCue } from "@/components/ScrollCue";
import { ScrollStory } from "@/components/ScrollStory";
import { Spotlight } from "@/components/Spotlight";
import { HeroVideo } from "@/components/HeroVideo";
import { SectionNav } from "@/components/SectionNav";
import {
  IconArrowRight,
  IconRocket,
  IconUsers,
  IconSparkle,
  IconCheck,
} from "@/components/icons";

// ISR: render the home page statically and refresh it hourly instead of
// querying the database on every visit — lets one cached page serve unlimited
// concurrent traffic.
export const revalidate = 3600;

const navItems = [
  { id: "hero", label: "Intro" },
  { id: "journey", label: "Journey" },
  { id: "paths", label: "Paths" },
  { id: "programs", label: "Programs" },
  { id: "partners-network", label: "Partners" },
  { id: "testimonials", label: "Stories" },
  { id: "cta", label: "Start" },
];

// Real alumni placements & credential partners, sourced from the live Edufyi site.
const alumniCompanies = [
  { src: "/alumni-logos/accenture.png", alt: "Accenture" },
  { src: "/alumni-logos/amazon.png", alt: "Amazon" },
  { src: "/alumni-logos/apple.png", alt: "Apple" },
  { src: "/alumni-logos/capgemini.png", alt: "Capgemini" },
  { src: "/alumni-logos/deloitte.png", alt: "Deloitte" },
  { src: "/alumni-logos/dxc.png", alt: "DXC Technology" },
  { src: "/alumni-logos/hcl.png", alt: "HCL" },
  { src: "/alumni-logos/infosys.png", alt: "Infosys" },
  { src: "/alumni-logos/kpmg.png", alt: "KPMG" },
  { src: "/alumni-logos/tcs.png", alt: "TCS" },
  { src: "/alumni-logos/tech-mahindra.png", alt: "Tech Mahindra" },
  { src: "/alumni-logos/wipro.png", alt: "Wipro" },
];
const prestigiousPartners = [
  { src: "/partners/airtel.jpg", alt: "Airtel" },
  { src: "/partners/au.png", alt: "AU Small Finance Bank" },
  { src: "/partners/aws.webp", alt: "Amazon Web Services" },
  { src: "/partners/axis.png", alt: "Axis Bank" },
  { src: "/partners/google-workspace.webp", alt: "Google Workspace" },
  { src: "/partners/idfc-first-bank.webp", alt: "IDFC FIRST Bank" },
  { src: "/partners/indusind.jpg", alt: "IndusInd Bank" },
  { src: "/partners/jio.jpg", alt: "Jio" },
  { src: "/partners/playo.webp", alt: "Playo" },
  { src: "/partners/razorpay.png", alt: "Razorpay" },
  { src: "/partners/vi.png", alt: "Vi" },
  { src: "/partners/yes-bank.png", alt: "Yes Bank" },
];
const toolsTaught = [
  { src: "/tools-logos/android.png", alt: "Android" },
  { src: "/tools-logos/autocad.png", alt: "AutoCAD" },
  { src: "/tools-logos/matlab.png", alt: "MATLAB" },
  { src: "/tools-logos/mqtt.png", alt: "MQTT" },
  { src: "/tools-logos/nodejs.png", alt: "Node.js" },
  { src: "/tools-logos/wireshark.png", alt: "Wireshark" },
  { src: "/tools-logos/react.png", alt: "React.js" },
  { src: "/tools-logos/java.png", alt: "Java" },
  { src: "/tools-logos/flask.png", alt: "Flask" },
  { src: "/tools-logos/adobe.png", alt: "Adobe" },
  { src: "/tools-logos/ibm.png", alt: "IBM" },
  { src: "/tools-logos/meta.png", alt: "Meta" },
  { src: "/tools-logos/microsoft.png", alt: "Microsoft" },
  { src: "/tools-logos/apple.png", alt: "Apple" },
  { src: "/tools-logos/cisco.png", alt: "Cisco" },
  { src: "/tools-logos/unity.png", alt: "Unity" },
];

const paths = [
  {
    title: "I want to learn",
    desc: "Master an in-demand tech skill with mentor-led, project-based programs.",
    href: "/programs",
    cta: "Explore Programs",
    Icon: IconRocket,
    bg: "/path-poster-learn-real.png",
  },
  {
    title: "I want to get placed",
    desc: "Build a real portfolio and get placement assistance into top companies.",
    href: "/career-paths",
    cta: "Explore Career Paths",
    Icon: IconSparkle,
    bg: "/path-poster-placement-real.png",
  },
  {
    title: "I'm a college or company",
    desc: "Partner with us for training, hiring, and collaborative programs.",
    href: "/partners",
    cta: "Partner With Us",
    Icon: IconUsers,
    bg: "/path-poster-partner-real.png",
  },
];

const partnerColleges = [
  { src: "/partners-network/lpu.png", alt: "Lovely Professional University" },
  { src: "/partners-network/galgotia-university.png", alt: "Galgotia University" },
  { src: "/partners-network/sibm.png", alt: "SIBM" },
  { src: "/partners-network/pune-business-school.png", alt: "Pune Business School" },
  { src: "/partners-network/tecnia.png", alt: "Tecnia Institute" },
  { src: "/partners-network/nsb.png", alt: "NSB Academy" },
  { src: "/partners-network/jyothy.png", alt: "Jyothy Institute" },
  { src: "/partners-network/vvism.png", alt: "VVISM" },
  { src: "/partners-network/cit.jpg", alt: "Cauvery Institute of Technology" },
  { src: "/partners-network/fast.png", alt: "FAST" },
  { src: "/partners-network/tpg.png", alt: "TPG" },
  { src: "/partners-network/atomxel.png", alt: "Atomxel" },
  { src: "/partners-network/veridion-solutions.jpeg", alt: "Veridion Solutions" },
  { src: "/partners-network/my-tech-builders.jpeg", alt: "My Tech Builders" },
  { src: "/partners-network/pleasure-pharmaceuticals.jpeg", alt: "Pleasure Pharmaceuticals" },
  { src: "/partners-network/elythra-a.jpeg", alt: "Partner organization" },
];
const govtApprovals = [
  { src: "/govt-approvals/aicte.png", alt: "AICTE" },
  { src: "/govt-approvals/apsche.png", alt: "APSCHE" },
  { src: "/govt-approvals/dpiit.png", alt: "DPIIT — Startup India" },
  { src: "/govt-approvals/mca.png", alt: "Ministry of Corporate Affairs" },
  { src: "/govt-approvals/msme.png", alt: "MSME" },
  { src: "/govt-approvals/iso.png", alt: "ISO Certified" },
  { src: "/govt-approvals/vtu.png", alt: "Visvesvaraya Technological University" },
];

export default async function Home() {
  const [programs, testimonials, successStories] = await Promise.all([
    getFeaturedPrograms(),
    getTestimonials(),
    getSuccessStories(),
  ]);

  return (
    <>
      <SectionNav items={navItems} />

      {/* ============ HERO ============ */}
      <section id="hero" className="hero-dark relative overflow-hidden">
        <HeroVideo />
        <Spotlight />
        <HeroPlacementTicker stories={successStories} />
        <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-20 text-center sm:pt-28 lg:pt-24">
          {/* Editorial, centered hero copy — no filler visual panel */}
          <div className="mx-auto flex flex-col items-center">
            <Reveal trigger="mount">
              <span className="shimmer inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-[var(--color-accent)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent-2)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent-2)]" />
                </span>
                Admissions open for the 2026 cohort
              </span>
            </Reveal>

            <HeroHeadline />

            <Reveal trigger="mount" delay={140}>
              <RoleCycler />
            </Reveal>

            <Reveal trigger="mount" delay={220}>
              <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--color-muted-foreground)]">
                Immersive, mentor-led programs in AI/ML, Data Science, Cybersecurity,
                and HR — engineered around real projects and real placement outcomes.
              </p>
            </Reveal>

            <Reveal trigger="mount" delay={280}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Button href="/programs" variant="accent" size="lg">
                  Explore Programs <IconArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/register" variant="outline-invert" size="lg">
                  Register Interest
                </Button>
              </div>
            </Reveal>

            <Reveal trigger="mount" delay={400}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--color-muted-foreground)]">
                {["Real-world projects", "Industry mentors", "Placement assistance"].map((f) => (
                  <span key={f} className="inline-flex items-center gap-2">
                    <IconCheck className="h-4 w-4 text-[var(--color-accent-2)]" /> {f}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Trust stats — inline data strip, not a boxed "stats card" */}
          <HeroStats />

          <ScrollCue className="mx-auto mt-14 hidden sm:flex" />
        </div>
      </section>

      {/* ============ TRUST TICKER (moved up for immediate credibility) ============ */}
      <section aria-label="Companies our alumni work at" className="border-y border-[var(--color-border)] bg-[var(--color-background-2)]/60 py-6">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-[var(--color-muted-foreground)]">
            Our alumni now work at
          </p>
          <Marquee logos={alumniCompanies} />
        </div>
      </section>

      {/* ============ SCROLL STORY (pinned scrollytelling) ============ */}
      <section id="journey">
        <ScrollStory />
      </section>

      {/* ============ PATH SELECTION (bento) ============ */}
      <section id="paths" className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading
          index="02 / 08"
          eyebrow="Choose your path"
          title={<>Where do you want to go?</>}
          subtitle="Tell us who you are and we'll point you to the right place."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 md:grid-rows-2">
          {paths.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 100}
              className={`group relative isolate flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 card-glow ${
                i === 0 ? "md:row-span-2 md:p-10" : ""
              }`}
            >
              <img
                src={p.bg}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-card)]/40"
              />
              {i === 0 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
                />
              )}
              <span
                className={`inline-flex items-center justify-center rounded-xl brand-gradient text-white ${
                  i === 0 ? "h-14 w-14" : "h-12 w-12"
                }`}
              >
                <p.Icon className={i === 0 ? "h-7 w-7" : "h-6 w-6"} />
              </span>
              <h3 className={`mt-5 font-semibold text-[var(--color-foreground)] ${i === 0 ? "text-2xl" : "text-xl"}`}>
                {p.title}
              </h3>
              <p className={`mt-2 flex-1 text-[var(--color-muted-foreground)] ${i === 0 ? "max-w-sm text-base" : "text-sm"}`}>
                {p.desc}
              </p>
              <Link
                href={p.href}
                data-cursor="Explore"
                className="mt-5 inline-flex w-fit items-center gap-1 text-sm font-medium text-[var(--color-primary)] transition-transform group-hover:translate-x-1 after:absolute after:inset-0 after:z-10 after:content-['']"
              >
                <span className="sr-only">{p.title}: </span>{p.cta} <IconArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ PROGRAMS ============ */}
      <section id="programs" className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
          <SectionHeading
            center={false}
            index="03 / 08"
            eyebrow="Flagship programs"
            title={<>Programs built for outcomes</>}
            subtitle="Immersive tracks, each ending with a job-ready portfolio."
          />
          <Button href="/programs" variant="secondary">
            View all <IconArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, i) => (
            <Reveal key={program.slug} delay={i * 80} className="h-full">
              <ProgramCard program={program} index={i} showPrice={false} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ PARTNER COLLEGES & COMPANIES (logo wall) ============ */}
      <section id="partners-network" className="border-y border-[var(--color-border)] bg-[var(--color-background-2)]/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            index="04 / 08"
            eyebrow="Our network"
            title={<>Partner colleges &amp; companies</>}
            subtitle="We train, upskill, and place talent with leading institutions and organizations across India."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {partnerColleges.map((logo, i) => (
              <Reveal
                key={logo.src}
                delay={i * 50}
                className="flex items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-2)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBase(logo.src)}
                  alt={logo.alt}
                  className="h-14 w-auto max-w-full object-contain sm:h-16"
                  loading="lazy"
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/partners" variant="secondary">
              Partner with us <IconArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS (draggable, snap-scroll carousel) ============ */}
      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading
          index="05 / 08"
          eyebrow="Success stories"
          title={<>Careers, transformed</>}
          subtitle="Real learners, real placements, real growth."
        />
        <div className="mt-12">
          <TestimonialsCarousel items={testimonials} />
        </div>
      </section>

      {/* ============ TRUST MARQUEES ============ */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-background-2)]/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            center={false}
            index="06 / 08"
            eyebrow="Trusted & recognized"
            title={<>Backed by prestigious partners and the tools that matter</>}
          />
          <div className="mt-12 space-y-8">
            <PartnerRow label="Prestigious Partners" logos={prestigiousPartners} />
            <PartnerRow label="Tools You'll Learn" logos={toolsTaught} reverse />
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section id="cta" className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] brand-gradient animate-gradient px-8 py-16 text-center">
          <div aria-hidden className="absolute inset-0 bg-black/12" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Your next chapter starts here
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/90">
              Join the 2026 cohort. Register your interest today — no payment
              required, just a conversation about your goals.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/register" variant="invert" size="lg">
                Register Interest
              </Button>
              <Button href="/contact" variant="outline-invert" size="lg">
                Talk to us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GOVERNMENT APPROVALS & RECOGNITIONS ============ */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-background-2)]/50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
              Recognized &amp; approved
            </span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Government approvals &amp; recognitions</h2>
            <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted-foreground)]">
              Registered and recognized by leading government bodies and standards authorities.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {govtApprovals.map((logo, i) => (
              <Reveal
                key={logo.src}
                delay={i * 50}
                className="flex items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-2)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBase(logo.src)}
                  alt={logo.alt}
                  className="h-14 w-auto max-w-full object-contain sm:h-16"
                  loading="lazy"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PartnerRow({
  label,
  items,
  logos,
  reverse,
}: {
  label: string;
  items?: string[];
  logos?: { src: string; alt: string }[];
  reverse?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex shrink-0 items-center gap-2.5 sm:w-44">
        <span aria-hidden className="h-4 w-0.5 rounded-full bg-[var(--color-accent)]" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
          {label}
        </p>
      </div>
      <div className="min-w-0 flex-1">
        <Marquee items={items} logos={logos} reverse={reverse} />
      </div>
    </div>
  );
}
