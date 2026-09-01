import type { Metadata } from "next";
import { getPrograms } from "@/lib/db";
import { ProgramsBrowser } from "@/components/ProgramsBrowser";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";

// ISR: cache the programs listing and revalidate hourly (see src/lib/db.ts).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore immersive Edufyi Tech Solutions programs in AI/ML, Data Science, Cybersecurity, and HR.",
};

export default async function ProgramsPage() {
  const programs = await getPrograms();
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Programs"
        title={<>Find the program that moves your career</>}
        subtitle="Mentor-led, project-based, and built for placement outcomes."
      />
      <div className="mt-12">
        <ProgramsBrowser programs={programs} />
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-12 text-center card-glow">
        <h3 className="text-2xl font-bold">Ready to enroll?</h3>
        <p className="max-w-xl text-[var(--color-muted-foreground)]">
          See every plan side by side — from self-paced learning to full placement support — and pay securely online.
        </p>
        <Button href="/pricing" variant="primary" size="lg">
          View pricing &amp; enroll
        </Button>
      </div>
    </div>
  );
}
