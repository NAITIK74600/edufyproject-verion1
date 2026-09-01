import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SectionHeading } from "@/components/SectionHeading";
import { PricingTables } from "@/components/PricingTables";
import { getProgram } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

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

  const jar = await cookies();
  const session = verifySessionToken(jar.get(SESSION_COOKIE_NAME)?.value);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Pricing"
        title={
          program ? <>Enrol in {program.title}</> : <>Choose the plan that gets you placed</>
        }
        subtitle={
          program
            ? "Pick a plan below — pay securely and your access is granted instantly."
            : "Pick a course tier or a professional track — pay securely and start learning."
        }
      />
      <div className="mt-12">
        <PricingTables
          courseSlug={program?.slug ?? null}
          courseTitle={program?.title ?? null}
          isLoggedIn={Boolean(session)}
          userName={session?.fullName ?? ""}
          userEmail={session?.email ?? ""}
        />
      </div>
    </div>
  );
}
