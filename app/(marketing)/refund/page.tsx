import Link from 'next/link';
import { RefundForm } from '@/components/site/refund-form';

export const metadata = {
  title: 'Refund & Cancellation — ProposeMagic',
  description: 'When and how we refund ProposeMagic orders.',
};

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">
        Refund &amp; cancellation
      </div>
      <h1 className="mt-3 font-playfair text-4xl md:text-5xl">
        If the page isn&apos;t right, you don&apos;t pay.
      </h1>
      <p className="mt-4 text-sm text-ink-soft">Last updated: April 21, 2026</p>

      <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-ink-muted">
        <Section title="When we refund automatically">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-ink">Page failed to generate.</strong> If our system
              couldn&apos;t produce your page (AI timeout, infrastructure error, anything on our
              end), we refund the full amount within 24 hours. You don&apos;t need to ask.
            </li>
            <li>
              <strong className="text-ink">Duplicate charge.</strong> If Razorpay accidentally
              charges you twice for the same order, we refund the extra charge automatically.
            </li>
          </ul>
        </Section>

        <Section title="When we refund on request">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-ink">Within 24 hours, link not shared.</strong> If you
              haven&apos;t yet sent the link to the recipient, we&apos;ll cancel and refund in
              full. Email{' '}
              <a href="mailto:refunds@proposemagic.in" className="underline">
                refunds@proposemagic.in
              </a>{' '}
              with your order ID.
            </li>
            <li>
              <strong className="text-ink">Page quality issue.</strong> If the AI-written message
              doesn&apos;t feel right, email us — we&apos;ll regenerate at no cost. If you
              still want a refund after that, we&apos;ll refund.
            </li>
          </ul>
        </Section>

        <Section title="When we can't refund">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-ink">The recipient has opened the link.</strong> Once the
              page has been opened, it&apos;s considered delivered.
            </li>
            <li>
              <strong className="text-ink">More than 7 days have passed.</strong> After a week,
              the refund window closes regardless of whether the link was shared.
            </li>
            <li>
              <strong className="text-ink">Violation of our terms.</strong> Pages removed for
              violating our{' '}
              <a href="/terms" className="underline">
                Terms of Service
              </a>{' '}
              are not eligible for refund.
            </li>
          </ul>
        </Section>

        <Section title="How to request a refund">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Email{' '}
              <a href="mailto:refunds@proposemagic.in" className="underline">
                refunds@proposemagic.in
              </a>{' '}
              from the address you used at checkout.
            </li>
            <li>Include your order ID (the 12-character short ID at the end of your page URL).</li>
            <li>Tell us why — one sentence is fine. We don&apos;t require a reason.</li>
            <li>We reply the same day and issue the refund within 5–7 business days.</li>
          </ol>
        </Section>

        <Section title="Processing time">
          <p>
            Once we approve a refund, Razorpay processes it in 5–7 business days. The money
            lands back in the original payment method — UPI, card, netbanking, or wallet. Banks
            occasionally take another 1–2 days to show it in your account.
          </p>
        </Section>

        <Section title="Cancellation during generation">
          <p>
            If you realize you&apos;ve made a mistake after paying but before the page is
            delivered, email us immediately. Generation takes under a minute, so it&apos;s a
            tight window — but if we catch it in time we&apos;ll cancel and refund without
            charging.
          </p>
        </Section>

        <Section title="Chargebacks">
          <p>
            We ask that you email us before filing a chargeback. Nine times out of ten we can
            resolve the issue faster than a chargeback would. Unauthorized chargebacks may
            result in your email being blocked from future purchases.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            Write to us at{' '}
            <a href="mailto:refunds@proposemagic.in" className="underline">
              refunds@proposemagic.in
            </a>{' '}
            or{' '}
            <a href="mailto:hello@proposemagic.in" className="underline">
              hello@proposemagic.in
            </a>
            . We&apos;re humans and we read every one.
          </p>
        </Section>
      </div>

      <div className="mt-16 rounded-2xl border border-black/10 bg-cream-dark/30 p-7">
        <h3 className="font-playfair text-xl">The short version</h3>
        <p className="mt-2 text-sm text-ink-muted">
          If anything goes wrong on our end, we refund automatically. If anything goes wrong on
          your end, email us — we&apos;re reasonable. We&apos;d rather lose a small payment than
          lose your trust.
        </p>
      </div>

      <div className="mt-16" id="request">
        <div className="text-xs font-semibold uppercase tracking-wider text-rose">
          Request form
        </div>
        <h2 className="mt-2 font-playfair text-3xl md:text-4xl">File a refund request.</h2>
        <p className="mt-3 max-w-xl text-sm text-ink-muted">
          Faster than email for most cases — we&apos;ll confirm on the address you give us.
        </p>
        <div className="mt-6">
          <RefundForm />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink hover:border-ink/40"
        >
          Contact us
        </Link>
        <Link
          href="/terms"
          className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink hover:border-ink/40"
        >
          Read terms
        </Link>
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
