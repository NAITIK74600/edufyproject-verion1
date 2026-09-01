import type { Metadata } from "next";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Edufyi Tech Solutions collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
        Last updated: {new Date().getFullYear()}
      </p>

      <div className="mt-8 space-y-6 text-[var(--color-muted-foreground)]">
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">1. Information we collect</h2>
          <p className="mt-2">
            When you register interest, contact us, or submit a partnership inquiry,
            we collect the details you provide — such as your name, email, phone
            number, and message — to respond and support your enrollment.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">2. How we use your data</h2>
          <p className="mt-2">
            We use your information to communicate about programs, process
            registrations, provide support, and improve our services. We do not sell
            your personal data.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">3. Data storage & security</h2>
          <p className="mt-2">
            Your data is stored securely in managed infrastructure and protected with
            industry-standard safeguards. Access is limited to authorized team members.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">4. Your rights</h2>
          <p className="mt-2">
            You may request access to, correction of, or deletion of your personal
            data at any time by contacting us.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">5. Contact</h2>
          <p className="mt-2">
            For privacy questions, email{" "}
            <a href={`mailto:${SITE.email}`} className="text-[var(--color-primary)] hover:underline">
              {SITE.email}
            </a>
            .
          </p>
        </section>
        <p className="text-sm italic">
          This is a templated policy provided for launch and should be reviewed by
          legal counsel before final publication.
        </p>
      </div>
    </article>
  );
}
