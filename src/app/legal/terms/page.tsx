import type { Metadata } from "next";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of Edufyi Tech Solutions.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="text-4xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
        Last updated: {new Date().getFullYear()}
      </p>

      <div className="mt-8 space-y-6 text-[var(--color-muted-foreground)]">
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">1. Acceptance of terms</h2>
          <p className="mt-2">
            By accessing or using the Edufyi Tech Solutions website and services, you agree to be
            bound by these terms. If you do not agree, please do not use our services.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">2. Programs & enrollment</h2>
          <p className="mt-2">
            Program details, curriculum, and pricing are provided for information and
            may change. Registration of interest does not constitute a binding
            enrollment or payment until confirmed by our team.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">3. Payments</h2>
          <p className="mt-2">
            Payments, when enabled, are processed securely through a third-party
            provider. Refund and cancellation terms will be shared at the time of
            enrollment.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">4. Intellectual property</h2>
          <p className="mt-2">
            All content, materials, and branding on this site are the property of
            Edufyi Tech Solutions and may not be reproduced without permission.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">5. Limitation of liability</h2>
          <p className="mt-2">
            Edufyi Tech Solutions is not liable for any indirect or consequential damages arising
            from the use of our website or services, to the extent permitted by law.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)]">6. Contact</h2>
          <p className="mt-2">
            Questions about these terms? Email{" "}
            <a href={`mailto:${SITE.email}`} className="text-[var(--color-primary)] hover:underline">
              {SITE.email}
            </a>
            .
          </p>
        </section>
        <p className="text-sm italic">
          This is a templated document provided for launch and should be reviewed by
          legal counsel before final publication.
        </p>
      </div>
    </article>
  );
}
