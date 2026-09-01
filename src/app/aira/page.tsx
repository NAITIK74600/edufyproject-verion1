import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "AIRA Portal — Coming Soon",
  description: "The AIRA Portal is coming soon to Edufyi Tech Solutions.",
};

export default function AiraPage() {
  return (
    <ComingSoon
      eyebrow="AIRA Portal"
      title="AIRA is coming soon"
      description="Our AI-powered learning and research assistant is being crafted. Get ready for a smarter way to learn, build, and grow with Edufyi Tech Solutions."
      features={["AI mentor", "Smart learning paths", "Instant doubt-solving"]}
    />
  );
}
