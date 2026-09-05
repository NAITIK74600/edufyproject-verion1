import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { PricingTables } from "@/components/PricingTables";
import { getProgram } from "@/lib/db";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Edufyi Tech Solutions programs — from self-paced learning to full placement support.",
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;
  const program = course ? await getProgram(course) : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Pricing"
        title={
          program ? <>Enrol in {program.title}</> : <>Choose the plan that gets you placed</>
        }
        subtitle={
          program
            ? "Pick a plan below and register your interest — our team will help you complete enrollment."
            : "Pick a course tier or a professional track and register your interest — payments open in Phase 2."
        }
      />
      <div className="mt-12">
        <PricingTables courseSlug={program?.slug ?? null} courseTitle={program?.title ?? null} />
      </div>
    </div>
  );
}
