export const metadata = {
  title: 'Terms — ProposeMagic',
  description: 'The rules for using ProposeMagic.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">Terms</div>
      <h1 className="mt-3 font-playfair text-4xl md:text-5xl">
        The deal — in plain English.
      </h1>
      <p className="mt-4 text-sm text-ink-soft">Last updated: April 21, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-muted">
        <Section title="Who this is with">
          <p>
            ProposeMagic is operated by SuperCX Technologies Private Limited, based in Bengaluru,
            India. When we say &quot;we&quot;, that&apos;s who we mean. When we say &quot;you&quot;,
            we mean the person using the service.
          </p>
        </Section>

        <Section title="What we do">
          <p>
            We generate a personalized, shareable cinematic page based on the details you
            provide. We host it indefinitely at a short URL and send that URL to your email.
          </p>
        </Section>

        <Section title="What you agree to">
          <ul className="list-disc space-y-2 pl-5">
            <li>You own the rights to any photos, video, and text you upload.</li>
            <li>You&apos;re not uploading anything sexual, violent, hateful, or illegal.</li>
            <li>You&apos;re not impersonating someone else in a way that could harm them.</li>
            <li>You&apos;re at least 16 years old.</li>
          </ul>
        </Section>

        <Section title="What we agree to">
          <ul className="list-disc space-y-2 pl-5">
            <li>Generate your page within a reasonable time (usually under a minute).</li>
            <li>Keep the link live — we don&apos;t expire pages.</li>
            <li>Refund automatically if the page fails to generate.</li>
            <li>Handle your data as described in our{' '}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
              .
            </li>
          </ul>
        </Section>

        <Section title="Payments & refunds">
          <p>
            Payment is processed by Razorpay. Prices are in INR and inclusive of GST where
            applicable. Refunds:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Full refund if the page fails to generate (automatic).</li>
            <li>Full refund within 24 hours if you haven&apos;t shared the link — email us.</li>
            <li>No refund after the link has been opened by the recipient.</li>
          </ul>
        </Section>

        <Section title="Takedowns & abuse">
          <p>
            If content on a ProposeMagic page targets or harms the person it&apos;s addressed to,
            they can email{' '}
            <a href="mailto:abuse@proposemagic.in" className="underline">
              abuse@proposemagic.in
            </a>{' '}
            and we&apos;ll remove it. We also remove content that violates the agreements above.
          </p>
        </Section>

        <Section title="Liability">
          <p>
            We do our best, but we can&apos;t guarantee uptime or outcomes (we can&apos;t promise
            they&apos;ll say yes!). Our liability is limited to what you paid for the page.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If we change these terms in a material way, we&apos;ll email you if you have an active
            page. Continued use after a change means you accept the updated terms.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These terms are governed by the laws of India. Disputes fall under the jurisdiction
            of the courts of Bengaluru.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            <a href="mailto:hello@proposemagic.in" className="underline">
              hello@proposemagic.in
            </a>
            {' · '}
            SuperCX Technologies Pvt Ltd, Bengaluru, Karnataka, India.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-playfair text-2xl text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
