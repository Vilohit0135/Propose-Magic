import Link from 'next/link';

export const metadata = {
  title: 'Contact — ProposeMagic',
  description: 'How to reach ProposeMagic — one inbox for support, refunds, press, partnerships.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">
        Contact
      </div>
      <h1 className="mt-3 font-playfair text-4xl md:text-5xl">
        Every customer matters.{' '}
        <em className="italic text-rose">Every email gets read.</em>
      </h1>

      {/* One inbox, one paragraph. Cleaner than three cards that all
          point to variations of the same place. */}
      <div className="mt-8 rounded-3xl border border-rose/15 bg-white p-7 md:p-10">
        <p className="text-base leading-relaxed text-ink-muted md:text-lg">
          Whatever you&apos;re writing about — a question about the wizard, a
          refund, an invitation to collaborate, a feature you wish we had —
          send it to{' '}
          <a
            href="mailto:hello@proposemagic.in"
            className="font-semibold text-rose-deep hover:underline"
          >
            hello@proposemagic.in
          </a>
          . One inbox, one team, every message gets read. Support replies
          land within a day; refunds we process the same day.
        </p>
        <a
          href="mailto:hello@proposemagic.in"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-rose-deep px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(139,21,56,0.3)] hover:opacity-90"
        >
          Email hello@proposemagic.in →
        </a>
      </div>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-cream-dark/30 p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Office
          </div>
          <div className="mt-2 text-sm text-ink">
            SuperCX Technologies Pvt Ltd
            <br />
            Bengaluru, Karnataka 560001
            <br />
            India
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-cream-dark/30 p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Response time
          </div>
          <div className="mt-2 text-sm text-ink">
            Support: within 24 hours
            <br />
            Refunds: same day
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-cream-dark/30 p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Working hours
          </div>
          <div className="mt-2 text-sm text-ink">
            Mon–Sat · 10am–7pm IST
            <br />
            Sunday: urgent only
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-rose/15 bg-white p-7 md:p-10">
        <h2 className="font-playfair text-2xl md:text-3xl">
          Quick checklist before you email us
        </h2>
        <ul className="mt-5 space-y-3 text-sm text-ink-muted">
          <li className="flex gap-3">
            <span className="text-rose">→</span>
            <span>
              <strong className="text-ink">Wrong details on the page?</strong> If
              it&apos;s been under 24 hours and you haven&apos;t shared the
              link, email us with your order ID — we&apos;ll regenerate for
              free with the corrected input.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-rose">→</span>
            <span>
              <strong className="text-ink">Page not generating?</strong> Don&apos;t worry —
              you won&apos;t be charged. Email{' '}
              <a
                href="mailto:hello@proposemagic.in"
                className="font-semibold text-rose-deep hover:underline"
              >
                hello@proposemagic.in
              </a>{' '}
              with your order ID and we&apos;ll process it the same day.
            </span>
          </li>
        </ul>
      </section>

      <div className="mt-16 text-center">
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 rounded-full border border-rose/30 bg-white/70 px-6 py-3 text-sm font-semibold text-rose-deep hover:bg-rose-soft"
        >
          Check the FAQ first →
        </Link>
      </div>
    </div>
  );
}
