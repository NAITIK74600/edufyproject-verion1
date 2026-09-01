import Link from "next/link";
import Image from "next/image";
import { SITE, BRANCHES, withBase } from "@/lib/config";
import {
  IconMail,
  IconPhone,
  IconPin,
  IconLinkedin,
  IconInstagram,
} from "./icons";

const columns = [
  {
    title: "Programs",
    links: [
      { href: "/programs", label: "All Programs" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/career-paths", label: "Career Paths" },
      { href: "/success-stories", label: "Success Stories" },
      { href: "/partners", label: "For Colleges & Companies" },
      { href: "/register", label: "Register" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/aira", label: "AIRA Portal" },
      { href: "/employee", label: "Employee Portal" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--color-border)] bg-[var(--color-background-2)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
            <Image
              src={withBase("/edufyi-logo.png")}
              alt="Edufyi Tech logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain [filter:drop-shadow(0_0_10px_rgba(42,215,234,0.3))]"
            />
            Edufyi<span className="brand-gradient-text">Tech</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-muted-foreground)]">
            {SITE.parentCompany} — a technology solutions and EdTech company
            helping learners master AI, data, security, and people skills with
            real-time projects and placement support.
          </p>
          <div className="mt-6 space-y-2 text-sm text-[var(--color-muted-foreground)]">
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-[var(--color-primary)]">
              <IconMail className="h-4 w-4" /> {SITE.email}
            </a>
            <a href={`tel:${SITE.phoneHref}`} className="flex items-center gap-2 hover:text-[var(--color-primary)]">
              <IconPhone className="h-4 w-4" /> {SITE.phone}
            </a>
          </div>
          <div className="mt-5 space-y-3">
            {BRANCHES.map((b) => (
              <div key={b.label} className="flex gap-2 text-xs text-[var(--color-muted-foreground)]">
                <IconPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  <span className="font-medium text-[var(--color-foreground)]">{b.label}: </span>
                  {b.address}
                </span>
              </div>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-[var(--color-foreground)]">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-[var(--color-muted-foreground)] sm:flex-row">
          <p>© {new Date().getFullYear()} Edufyi Tech Solutions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/legal/privacy" className="hover:text-[var(--color-primary)]">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-[var(--color-primary)]">Terms</Link>
            <div className="flex items-center gap-2">
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg glass text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
              >
                <IconLinkedin className="h-4 w-4" />
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg glass text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
              >
                <IconInstagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
