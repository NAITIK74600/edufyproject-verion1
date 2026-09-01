"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { scrollToTarget } from "@/lib/scroll";

type NavItem = { id: string; label: string };

/**
 * Persistent right-edge wayfinding rail — a mono-indexed dot per major
 * section, highlighting the current one as you scroll and jumping on click.
 * Desktop only (lg+); on mobile the scroll-progress bar already provides
 * a lightweight equivalent, and a full dot rail would crowd a small screen.
 */
export function SectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToTarget(`#${item.id}`)}
            className="group flex cursor-pointer items-center gap-2.5"
            aria-label={`Jump to ${item.label}`}
            aria-current={isActive}
          >
            <span
              className={`data-label text-[10px] transition-all duration-300 ${
                isActive
                  ? "translate-x-0 text-[var(--color-primary)] opacity-100"
                  : "translate-x-2 text-[var(--color-muted-foreground)] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {item.label}
            </span>
            <motion.span
              className="block rounded-full bg-[var(--color-border)]"
              animate={{
                width: isActive ? 20 : 6,
                height: 6,
                backgroundColor: isActive ? "var(--color-primary)" : "var(--color-border)",
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </button>
        );
      })}
    </nav>
  );
}
