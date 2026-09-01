import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { StatCounter } from "@/components/StatCounter";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import {
  IconBrain,
  IconRocket,
  IconShield,
  IconUsers,
  IconCloud,
  IconCode,
  IconNetwork,
  IconTrendingUp,
  IconRobot,
  IconCompass,
  IconPulse,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Edufyi Tech Solutions is a technology company working across AI, SaaS, software development, IT & B2B services, digital transformation, EdTech, and technology training.",
};

const values = [
  { Icon: IconRocket, title: "Outcomes over hype", desc: "We measure success by placements and real skills, not vanity metrics." },
  { Icon: IconBrain, title: "Learn by building", desc: "Every program is anchored in real projects that ship to your portfolio." },
  { Icon: IconUsers, title: "Mentorship first", desc: "You learn from practitioners who've done the job you want." },
  { Icon: IconShield, title: "Integrity", desc: "Transparent pricing, honest guidance, and support that lasts beyond the course." },
];

const services = [
  {
    Icon: IconRobot,
    title: "AI & Intelligent Solutions",
    desc: "AI-powered tools that automate tasks and support better decisions.",
  },
  {
    Icon: IconCloud,
    title: "SaaS & Software Products",
    desc: "Software built around specific problems, designed for simplicity.",
  },
  {
    Icon: IconCode,
    title: "Custom Software Development",
    desc: "Web, mobile, and enterprise solutions tailored to how our clients work.",
  },
  {
    Icon: IconNetwork,
    title: "IT & B2B Services",
    desc: "Technology services that strengthen operations and digital capability.",
  },
  {
    Icon: IconTrendingUp,
    title: "Digital Transformation",
    desc: "Modernizing systems through the right mix of software, automation, and AI.",
  },
  {
    Icon: IconBrain,
    title: "EdTech Solutions",
    desc: "Technology that supports learning, career growth, and employability.",
  },
  {
    Icon: IconUsers,
    title: "Technology Training",
    desc: "Practical, industry-oriented training for students and professionals.",
  },
];

const missionCommitments = [
  {
    Icon: IconCloud,
    title: "Building Innovative SaaS Products",
    desc: "Developing AI-powered SaaS products that solve genuine market needs and deliver real value to users.",
  },
  {
    Icon: IconCompass,
    title: "Solving Business Problems Through Technology",
    desc: "Understanding what our clients are actually up against, and designing practical, scalable solutions instead of forcing one-size-fits-all products.",
  },
  {
    Icon: IconTrendingUp,
    title: "Accelerating Digital Transformation",
    desc: "Helping organizations modernize their systems, automate workflows, and build more efficient digital operations through SaaS and modern tools.",
  },
  {
    Icon: IconShield,
    title: "Delivering High-Quality Software",
    desc: "Building secure, scalable, user-centric SaaS products that are designed to grow with our clients, not just work on day one.",
  },
  {
    Icon: IconRobot,
    title: "Empowering Businesses with AI",
    desc: "Making AI practical, not abstract — integrating intelligent automation and data-driven decision-making into SaaS products people actually use.",
  },
  {
    Icon: IconNetwork,
    title: "Creating Technology Partnerships",
    desc: "Working closely with startups, enterprises, and institutions as a true SaaS and technology partner, from the first idea through deployment and beyond.",
  },
  {
    Icon: IconBrain,
    title: "Bridging Technology and Talent",
    desc: "Through our EdTech and training programs, helping students and professionals build practical, industry-relevant skills for the SaaS and tech economy.",
  },
  {
    Icon: IconPulse,
    title: "Innovating Continuously",
    desc: "Staying curious, testing new technologies, and constantly improving the SaaS products and solutions we build.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div aria-hidden className="absolute inset-0 grid-lines" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
            About Edufyi Tech Solutions
          </span>
          <h1 className="mt-6 text-4xl font-bold sm:text-6xl">
            Building technology that{" "}
            <span className="brand-gradient-text">grows with people</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--color-muted-foreground)]">
            A technology company working across AI, SaaS, software development,
            IT & B2B services, digital transformation, EdTech, and technology training.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-10 md:grid-cols-4">
          <StatCounter value={12000} suffix="+" label="Learners trained" />
          <StatCounter value={94} suffix="%" label="Placement rate" />
          <StatCounter value={120} suffix="+" label="Hiring partners" />
          <StatCounter value={50} suffix="+" label="College programs" />
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <SectionHeading center={false} eyebrow="About us" title={<>Who we are</>} />
        <div className="mt-6 space-y-4 text-[var(--color-muted-foreground)]">
          <p>
            Edufyi Tech Solutions began with a focus on education and training, and has
            since grown into a broader technology company working across AI, SaaS,
            software development, IT and B2B services, digital transformation, EdTech,
            and technology training.
          </p>
          <p>
            We start by understanding the problem — then build the right solution. We
            partner with businesses, institutions, and entrepreneurs to turn ideas into
            working products, whether that means a new SaaS platform, custom software,
            AI integration, process automation, or modernizing legacy systems.
          </p>
        </div>
      </section>

      {/* What we do */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading eyebrow="What we do" title={<>Our capabilities</>} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              key={s.title}
              delay={i * 60}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 card-glow"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl brand-gradient text-white">
                <s.Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--color-foreground)]">{s.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <SectionHeading center={false} eyebrow="How we work" title={<>Problem first, always</>} />
        <div className="mt-6 space-y-4 text-[var(--color-muted-foreground)]">
          <p>
            We don&apos;t build technology because it&apos;s trending. We start with the
            problem, the people affected, and the intended outcome — then build
            accordingly. Whether it&apos;s a startup, an established business, an
            institution, or an individual learner, our approach stays practical,
            transparent, and results-focused.
          </p>
          <p>
            At Edufyi, we&apos;re building more than software — we&apos;re building
            capabilities that grow with the people and businesses we serve.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <SectionHeading center={false} eyebrow="Our vision" title={<>Where we&apos;re headed</>} />
        <div className="mt-6 space-y-4 text-[var(--color-muted-foreground)]">
          <p>
            To become a globally trusted technology company that changes the way
            businesses, institutions, and individuals engage with technology.
          </p>
          <p>
            We believe AI, SaaS, and digital platforms should be more than tools — they
            should be enablers of growth, innovation, and opportunity. Our vision is to
            build SaaS products and technology ecosystems that simplify complex processes,
            make businesses more intelligent, and make digital experiences genuinely useful.
          </p>
          <p>
            We&apos;re focused on identifying real problems and turning them into scalable
            SaaS solutions and technology products that create lasting value — from helping
            businesses automate and modernize their operations through SaaS platforms, to
            building intelligent products that empower the next generation through technology
            and learning. Our goal is to make technology, and SaaS in particular, more
            accessible, more practical, and more impactful.
          </p>
          <p>
            We see Edufyi growing into a multi-dimensional technology ecosystem — where SaaS
            products, services, AI, digital transformation, and knowledge come together to
            solve problems that matter. Ultimately, our vision is to build technology and
            software that drives real progress — for businesses, institutions, professionals,
            students, and society at large.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <SectionHeading center={false} eyebrow="Our mission" title={<>What drives us</>} />
          <div className="mt-6 space-y-4 text-[var(--color-muted-foreground)]">
            <p>
              Our mission is simple: build, deliver, and continuously improve technology
              solutions that solve real problems and create measurable value.
            </p>
            <p>
              We bring together AI, modern software engineering, SaaS technology, digital
              transformation, and deep industry expertise to help organizations turn ideas
              into reliable products, streamline operations, improve customer experiences,
              and unlock new growth opportunities.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {missionCommitments.map((c, i) => (
            <Reveal
              key={c.title}
              delay={i * 50}
              className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 card-glow"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl brand-gradient text-white">
                <c.Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-[var(--color-foreground)]">{c.title}</h3>
                <p className="mt-1.5 text-sm text-[var(--color-muted-foreground)]">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-4 text-[var(--color-muted-foreground)]">
          <p>
            At the core of everything we do is one belief: technology should solve problems,
            create opportunities, and make progress possible.
          </p>
          <p>
            We aim to bring together innovation and execution, technology and human need,
            ideas and real-world impact — building SaaS solutions that aren&apos;t just
            technically strong, but genuinely useful, accessible, and built to last.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading eyebrow="Our values" title={<>What we stand for</>} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal
              key={v.title}
              delay={i * 80}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 card-glow"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl brand-gradient text-white">
                <v.Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--color-foreground)]">{v.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{v.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl border border-[var(--color-border)] brand-gradient animate-gradient px-8 py-14 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Join thousands building their future
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/programs" variant="invert" size="lg">
              Explore Programs
            </Button>
            <Button href="/partners" variant="outline-invert" size="lg">
              Partner With Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
