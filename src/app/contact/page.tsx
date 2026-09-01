import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SITE, BRANCHES } from "@/lib/config";
import { IconMail, IconPhone, IconPin, IconWhatsapp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Edufyi Tech Solutions team.",
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-[var(--color-secondary)]/15 blur-[120px]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
            Contact
          </span>
          <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
            Let&apos;s <span className="brand-gradient-text">talk</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-[var(--color-muted-foreground)]">
            Questions about a program, placements, or partnerships? Reach out and
            our team will get back to you.
          </p>

          <div className="mt-8 space-y-4">
            <ContactRow Icon={IconMail} label="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
            <ContactRow Icon={IconPhone} label="Phone" value={SITE.phone} href={`tel:${SITE.phoneHref}`} />
            <ContactRow Icon={IconWhatsapp} label="WhatsApp" value="Chat with us instantly" href={SITE.whatsapp} />
            {BRANCHES.map((b) => (
              <ContactRow key={b.label} Icon={IconPin} label={b.label} value={b.address} />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  Icon,
  label,
  value,
  href,
}: {
  Icon: (p: { className?: string }) => React.JSX.Element;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className={`flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4${href ? " transition-colors hover:border-[var(--color-primary)]/50" : ""}`}>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-xs text-[var(--color-muted-foreground)]">{label}</div>
        <div className="text-sm font-medium text-[var(--color-foreground)]">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
