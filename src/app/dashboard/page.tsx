import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getEnrollmentsByUserId } from "@/lib/db";
import { getPlanFeatures } from "@/lib/pricing";
import { Button } from "@/components/Button";
import { LogoutButton } from "@/components/LogoutButton";
import { IconRocket, IconBrain, IconCheck, IconSparkle } from "@/components/icons";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Edufyi Tech Solutions learning dashboard.",
};

export default async function DashboardPage() {
  const jar = await cookies();
  const session = verifySessionToken(jar.get(SESSION_COOKIE_NAME)?.value);
  // proxy.ts already redirects unauthenticated requests to /login before this
  // renders, but a server-side check here keeps the page safe on its own too.
  if (!session) redirect("/login?next=/dashboard");

  const enrollments = await getEnrollmentsByUserId(session.userId);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="brand-gradient-text">{session.fullName.split(" ")[0]}</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Here&apos;s your program at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(session.role === "admin" || session.role === "super_admin") && (
            <Button href="/admin" variant="secondary">
              Admin Panel
            </Button>
          )}
          <Button href="/programs" variant="secondary">
            Browse programs
          </Button>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* Enrolled plans + unlocked facilities */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl brand-gradient text-white">
              <IconBrain className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-[var(--color-foreground)]">Your enrolments</h2>
              <p className="text-xs text-[var(--color-muted-foreground)]">Cohort 2026</p>
            </div>
          </div>

          {enrollments.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-background-2)] p-6 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                You haven&apos;t enrolled in a plan yet.
              </p>
              <div className="mt-4 flex justify-center">
                <Button href="/pricing" variant="primary">View pricing &amp; enrol</Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {enrollments.map((e) => {
                const features = getPlanFeatures(e.plan_id);
                return (
                  <div
                    key={e.id}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background-2)] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-[var(--color-foreground)]">{e.plan_name}</h3>
                        {e.course_title && (
                          <p className="text-xs text-[var(--color-muted-foreground)]">{e.course_title}</p>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-2)]/15 px-3 py-1 text-xs font-semibold text-[var(--color-accent-2)]">
                        <IconCheck className="h-3.5 w-3.5" /> Access active
                      </span>
                    </div>
                    {features.length > 0 && (
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-foreground)]/90">
                            <IconCheck className="h-4 w-4 shrink-0 text-[var(--color-accent-2)]" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="font-semibold text-[var(--color-foreground)]">Your profile</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full brand-gradient text-lg font-bold text-white">
              {session.fullName.charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="font-medium text-[var(--color-foreground)]">{session.fullName}</div>
              <div className="text-xs text-[var(--color-muted-foreground)]">{session.email}</div>
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--color-muted-foreground)]">Status</dt>
              <dd className="text-[var(--color-foreground)]">{enrollments.length > 0 ? "Enrolled" : "Registered"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-muted-foreground)]">Plans</dt>
              <dd className="text-[var(--color-foreground)]">{enrollments.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Reserved LMS slot — do not build LMS logic yet (per plan) */}
      <div className="mt-6 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-background-2)]/50 p-8 text-center">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-secondary)]/15 text-[var(--color-accent)]">
          <IconRocket className="h-5 w-5" />
        </span>
        <h2 className="mt-4 flex items-center justify-center gap-2 text-lg font-semibold text-[var(--color-foreground)]">
          <IconSparkle className="h-4 w-4 text-[var(--color-accent)]" /> Learning Management System
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-muted-foreground)]">
          Your lessons, videos, and assignments will appear here. The LMS embed
          slot is reserved and integrates in a later phase.
        </p>
      </div>
    </div>
  );
}

