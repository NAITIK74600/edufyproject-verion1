"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, withBase, type NavItem } from "@/lib/config";
import { IconMenu, IconClose, IconChevronDown } from "./icons";
import { SHINY_BUTTON_CLASS } from "./ui/shiny-button";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--color-border)] bg-[var(--color-background)]/85 shadow-[var(--shadow-1)] backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
          <Image
            src={withBase("/edufyi-logo.png")}
            alt="Edufyi Tech logo"
            width={36}
            height={36}
            priority
            className="h-9 w-9 object-contain [filter:drop-shadow(0_0_10px_rgba(42,215,234,0.35))]"
          />
          <span className="text-[var(--color-foreground)]">
            Edufyi<span className="brand-gradient-text">Tech</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <NavDropdown key={item.label} item={item} pathname={pathname} />
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                  pathname === item.href
                    ? "font-semibold text-[var(--color-primary)]"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${SHINY_BUTTON_CLASS}`}
          >
            Register
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg glass text-[var(--color-foreground)] lg:hidden"
        >
          {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    type="button"
                    aria-expanded={mobileExpanded === item.label}
                    onClick={() =>
                      setMobileExpanded((v) => (v === item.label ? null : item.label))
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  >
                    {item.label}
                    <IconChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        mobileExpanded === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="ml-3 flex flex-col gap-1 border-l border-[var(--color-border)] pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                        >
                          {child.label}
                          {child.badge && <ComingSoonPill label={child.badge} />}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-3 flex gap-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border-[1.5px] border-[var(--color-primary)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--color-primary)]"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className={`flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-semibold ${SHINY_BUTTON_CLASS}`}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function ComingSoonPill({ label }: { label: string }) {
  return (
    <span className="shrink-0 rounded-full bg-[var(--color-warning)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-warning)]">
      {label}
    </span>
  );
}

function NavDropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active =
    pathname === item.href ||
    (item.children?.some((c) => pathname === c.href) ?? false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors ${
          active
            ? "font-semibold text-[var(--color-primary)]"
            : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
        }`}
      >
        {item.label}
        <IconChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={item.label}
          className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/95 p-1.5 shadow-[var(--shadow-3)] backdrop-blur-xl"
        >
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-[var(--color-primary)]/[0.06] ${
                pathname === child.href
                  ? "font-semibold text-[var(--color-primary)]"
                  : "text-[var(--color-foreground)]"
              }`}
            >
              {child.label}
              {child.badge && <ComingSoonPill label={child.badge} />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
