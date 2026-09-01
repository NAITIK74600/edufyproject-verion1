import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { IconSparkle } from "@/components/icons";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Edufyi Tech Solutions dashboard.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div aria-hidden className="absolute inset-0 grid-lines" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--color-primary)]/15 blur-[120px]"
      />
      <div className="relative mx-auto w-full max-w-md px-6 py-16">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
          <div className="flex justify-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl brand-gradient text-white">
              <IconSparkle className="h-6 w-6" />
            </span>
          </div>
          <h1 className="mt-5 text-center text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-center text-sm text-[var(--color-muted-foreground)]">
            Log in to access your program dashboard.
          </p>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>

          <p className="mt-6 text-center text-sm text-[var(--color-muted-foreground)]">
            New here?{" "}
            <Link href="/register" className="text-[var(--color-primary)] hover:underline">
              Register your interest
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

