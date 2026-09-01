import type { Metadata } from "next";
import { getPrograms } from "@/lib/db";
import { RegisterForm } from "@/components/RegisterForm";
import { IconCheck } from "@/components/icons";

// ISR: the register page only needs the (rarely-changing) program list, so
// cache it and revalidate hourly. The form itself is a client component.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Register Interest",
  description:
    "Register your interest in an Edufyi Tech Solutions program. No payment required — our team follows up to help you enroll.",
};

const perks = [
  "Personalized program guidance",
  "Scholarship & EMI options",
  "Priority seat in the 2026 cohort",
  "No payment required to register",
];

export default async function RegisterPage() {
  const programs = await getPrograms();

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-[var(--color-primary)]/15 blur-[120px]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
            Admissions 2026
          </span>
          <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
            Register your <span className="brand-gradient-text">interest</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-[var(--color-muted-foreground)]">
            Tell us which program excites you. Our admissions team will reach out
            to walk you through curriculum, fees, and scholarships.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm text-[var(--color-foreground)]/90">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent-2)]/15 text-[var(--color-accent-2)]">
                  <IconCheck className="h-3.5 w-3.5" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-2xl glass p-5 text-sm text-[var(--color-muted-foreground)]">
            <span className="font-medium text-[var(--color-foreground)]">Payments open in Phase 2.</span>{" "}
            At launch we capture registrations only — Razorpay checkout goes live
            after payment testing is signed off.
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
          <RegisterForm programs={programs} />
        </div>
      </div>
    </div>
  );
}
