"use client";

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

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
type RazorpayInstance = { open: () => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;
declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type Tab = "course" | "professional";

type Props = {
  courseSlug?: string | null;
  courseTitle?: string | null;
  isLoggedIn?: boolean;
  userName?: string;
  userEmail?: string;
};

export function PricingTables({
  courseSlug = null,
  courseTitle = null,
  isLoggedIn = false,
  userName = "",
  userEmail = "",
}: Props) {
  const [tab, setTab] = useState<Tab>("course");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  // Guest checkout details — only collected when the visitor isn't logged in.
  const [pending, setPending] = useState<{ planId: string; planName: string } | null>(null);
  const [guest, setGuest] = useState({ full_name: userName, email: userEmail, phone: "" });

  function startEnroll(planId: string, planName: string) {
    setNotice(null);
    if (isLoggedIn) {
      void pay(planId, planName, {});
    } else {
      setPending({ planId, planName }); // open the details form first
    }
  }

  async function pay(
    planId: string,
    planName: string,
    buyer: { full_name?: string; email?: string; phone?: string }
  ) {
    setBusyId(planId);
    try {
      const ok = await loadRazorpay();
      if (!ok) {
        setNotice({ type: "error", text: "Couldn't load the payment window. Check your connection." });
        return;
      }

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, courseSlug, courseTitle }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: "error", text: data.error ?? "Could not start the payment." });
        return;
      }

      const rzp = new window.Razorpay!({
        key: data.keyId,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: "Edufyi Tech Solutions",
        description: courseTitle ? `${planName} — ${courseTitle}` : `${planName} plan`,
        theme: { color: "#16a6db" },
        prefill: {
          name: buyer.full_name || userName || undefined,
          email: buyer.email || userEmail || undefined,
          contact: buyer.phone || undefined,
        },
        handler: async (response: RazorpayResponse) => {
          const verify = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, ...buyer }),
          });
          const vd = await verify.json();
          if (verify.ok && vd.verified && vd.accessProvisioned) {
            setNotice({
              type: "success",
              text: vd.accountCreated
                ? `Payment successful! We've emailed your login details — check your inbox, then head to your dashboard.`
                : `Payment successful! Your ${planName} access is now active on your dashboard.`,
            });
          } else if (verify.ok && vd.verified) {
            setNotice({
              type: "success",
              text: `Payment received for ${planName}. Our team will confirm your access shortly.`,
            });
          } else {
            setNotice({ type: "error", text: vd.error ?? "Payment could not be verified. If you were charged, contact support." });
          }
        },
      });
      rzp.open();
    } catch {
      setNotice({ type: "error", text: "Network error. Please try again." });
    } finally {
      setBusyId(null);
    }
  }

  function submitGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!pending) return;
    const { planId, planName } = pending;
    setPending(null);
    void pay(planId, planName, guest);
  }

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

      {notice && (
        <p
          role="status"
          className={`mx-auto mt-6 max-w-xl rounded-xl px-4 py-3 text-center text-sm ${
            notice.type === "success"
              ? "bg-[var(--color-accent-2)]/15 text-[var(--color-accent-2)]"
              : "bg-[var(--color-primary-tint)] text-[var(--color-primary)]"
          }`}
        >
          {notice.text}
        </p>
      )}

      {tab === "course" ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {COURSE_TIERS.map((tier) => (
            <MatrixCard
              key={tier.id}
              tier={tier}
              busy={busyId === tier.id}
              onEnroll={() => startEnroll(tier.id, tier.name)}
            />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {PROFESSIONAL_TIERS.map((tier) => (
            <ListCard
              key={tier.id}
              tier={tier}
              busy={busyId === tier.id}
              onEnroll={() => startEnroll(tier.id, tier.name)}
            />
          ))}
        </div>
      )}

      {pending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPending(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitGuest}
            className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6"
          >
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
              Your details for {pending.planName}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              We&apos;ll create your account and email your login after payment.
            </p>
            <div className="mt-5 space-y-4">
              <input
                required
                placeholder="Full name"
                value={guest.full_name}
                onChange={(e) => setGuest((g) => ({ ...g, full_name: e.target.value }))}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-2)] px-4 py-2.5 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={guest.email}
                onChange={(e) => setGuest((g) => ({ ...g, email: e.target.value }))}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-2)] px-4 py-2.5 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
              />
              <input
                required
                type="tel"
                placeholder="Phone"
                value={guest.phone}
                onChange={(e) => setGuest((g) => ({ ...g, phone: e.target.value }))}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background-2)] px-4 py-2.5 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setPending(null)}
                className="flex-1 cursor-pointer rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold ${SHINY_BUTTON_CLASS}`}
              >
                Continue to pay
              </button>
            </div>
          </form>
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

function EnrollButton({ busy, onEnroll }: { busy: boolean; onEnroll: () => void }) {
  return (
    <button
      type="button"
      onClick={onEnroll}
      disabled={busy}
      className={`mt-6 w-full cursor-pointer rounded-xl px-6 py-3 font-semibold ${SHINY_BUTTON_CLASS} disabled:opacity-60`}
    >
      {busy ? "Please wait…" : "Enroll Now"}
    </button>
  );
}

function MatrixCard({
  tier,
  busy,
  onEnroll,
}: {
  tier: MatrixTier;
  busy: boolean;
  onEnroll: () => void;
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
          <EnrollButton busy={busy} onEnroll={onEnroll} />
        </div>
      </div>
    </div>
  );
}

function ListCard({
  tier,
  busy,
  onEnroll,
}: {
  tier: ListTier;
  busy: boolean;
  onEnroll: () => void;
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
          <EnrollButton busy={busy} onEnroll={onEnroll} />
        </div>
      </div>
    </div>
  );
}
