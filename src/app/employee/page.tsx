import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Employee Portal — Coming Soon",
  description: "The Employee Portal is coming soon to Edufyi Tech Solutions.",
};

export default function EmployeePage() {
  return (
    <ComingSoon
      eyebrow="Employee Portal"
      title="Employee Portal"
      description="A dedicated space for the Edufyi Tech Solutions team — HR, resources, and internal tools. Launching soon."
      features={["Team resources", "HR self-service", "Internal tools"]}
    />
  );
}
