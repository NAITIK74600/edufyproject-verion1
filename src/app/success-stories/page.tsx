import type { Metadata } from "next";
import { getSuccessStories } from "@/lib/db";
import { SuccessBrowser } from "@/components/SuccessBrowser";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";

// ISR: cache success stories and revalidate hourly.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Success Stories",
  description:
    "Real learners, real placements. See how Edufyi Tech Solutions graduates landed roles across AI, data, security, and HR.",
};

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <SectionHeading
        eyebrow="Success stories"
        title={<>Outcomes that speak for themselves</>}
        subtitle="Filter by domain to see where our graduates are today."
      />
      <div className="mt-12">
        <SuccessBrowser stories={stories} />
      </div>
      <div className="mt-16 text-center">
        <Button href="/register" variant="accent" size="lg">
          Write your success story
        </Button>
      </div>
    </div>
  );
}
