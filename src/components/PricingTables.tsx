"use client";

import Link from "next/link";
import { useState } from "react";
import {
  COURSE_FEATURES,
  COURSE_TIERS,
  PROFESSIONAL_TIERS,
  type ListTier,
  type MatrixTier,
} from "@/lib/pricing";
import { formatINR } from "@/lib/config";
import { IconCheck, IconClose } from "@/components/icons";
import { SHINY_BUTTON_CLASS } from "@/components/ui/shiny-button";

type Tab = "course" | "professional";

type Props = {
  courseSlug?: string | null;
  courseTitle?: string | null;
};

export function PricingTables({ courseSlug = null }: Props) {
  const [tab, setTab] = useState<Tab>("course");

  // Payments open in Phase 2 (post payment-testing sign-off). At launch, every
  // "Enroll Now" click hands off to the Register Interest flow instead of a
  // live Razorpay checkout — see src/app/register for that capture form.
  const registerHref = courseSlug ? `/register?program=${encodeURIComponent(courseSlug)}` : "/register";

  return (
    <div>
      {/* Tab switch */}
      <div className="mx-auto flex w-fit items-center gap-1 rounded-full glass p-1">
        {(
          [
            ["course", "Course Pricing"],
            ["professional", "Professional Course Pricing"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
              tab === id
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "course" ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {COURSE_TIERS.map((tier) => (
            <MatrixCard key={tier.id} tier={tier} registerHref={registerHref} />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {PROFESSIONAL_TIERS.map((tier) => (
            <ListCard key={tier.id} tier={tier} registerHref={registerHref} />
          ))}
        </div>
      )}
    </div>
  );
}

function CardHeader({
  name,
  price,
  tagline,
  accent,
}: {
  name: string;
  price: number;
  tagline: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-t-2xl px-6 py-7 text-center text-white"
      style={{ background: `linear-gradient(160deg, ${accent}, ${accent}cc)` }}
    >
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="mt-2 text-3xl font-extrabold tracking-tight">{formatINR(price)}</p>
      <p className="mt-1 text-sm text-white/85">{tagline}</p>
    </div>
  );
}

function EnrollButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className={`mt-6 block w-full cursor-pointer rounded-xl px-6 py-3 text-center font-semibold ${SHINY_BUTTON_CLASS}`}
    >
      Register Interest
    </Link>
  );
}

function MatrixCard({
  tier,
  registerHref,
}: {
  tier: MatrixTier;
  registerHref: string;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border bg-[var(--color-card)] card-glow ${
        tier.highlighted
          ? "border-[var(--color-primary)]/60 ring-1 ring-[var(--color-primary)]/40"
          : "border-[var(--color-border)]"
      }`}
    >
      <CardHeader name={tier.name} price={tier.price} tagline={tier.tagline} accent={tier.accent} />
      <div className="flex flex-1 flex-col p-6">
        <ul className="space-y-3 text-sm">
          {COURSE_FEATURES.map((feature, i) => {
            const on = tier.included[i];
            return (
              <li
                key={feature}
                className={`flex items-center gap-3 ${
                  on ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]/60"
                }`}
              >
                {on ? (
                  <IconCheck className="h-4 w-4 shrink-0 text-[var(--color-accent-2)]" />
                ) : (
                  <IconClose className="h-4 w-4 shrink-0 text-[var(--color-primary)]/50" />
                )}
                <span className={on ? "" : "line-through"}>{feature}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto">
          <EnrollButton href={registerHref} />
        </div>
      </div>
    </div>
  );
}

function ListCard({
  tier,
  registerHref,
}: {
  tier: ListTier;
  registerHref: string;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border bg-[var(--color-card)] card-glow ${
        tier.highlighted
          ? "border-[var(--color-primary)]/60 ring-1 ring-[var(--color-primary)]/40"
          : "border-[var(--color-border)]"
      }`}
    >
      <CardHeader name={tier.name} price={tier.price} tagline={tier.tagline} accent={tier.accent} />
      <div className="flex flex-1 flex-col p-6">
        <ul className="space-y-3 text-sm text-[var(--color-foreground)]">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <IconCheck className="h-4 w-4 shrink-0 text-[var(--color-accent-2)]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <EnrollButton href={registerHref} />
        </div>
      </div>
    </div>
  );
}

