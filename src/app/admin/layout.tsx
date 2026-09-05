import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const jar = await cookies();
  const session = verifySessionToken(jar.get(SESSION_COOKIE_NAME)?.value);
  // src/proxy.ts already redirects unauthorized requests before this renders,
  // but a server-side check here keeps this layout safe standalone too.
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "admin" && session.role !== "super_admin") redirect("/dashboard");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Admin <span className="brand-gradient-text">Panel</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Signed in as {session.fullName} ·{" "}
            {session.role === "super_admin" ? "Super Admin" : "Admin"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link
              href="/admin/users"
              className="rounded-full border border-[var(--color-border)] px-4 py-2 transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
            >
              Users
            </Link>
            <Link
              href="/admin/leads"
              className="rounded-full border border-[var(--color-border)] px-4 py-2 transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
            >
              Leads
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
