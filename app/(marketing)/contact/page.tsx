import Link from 'next/link';

export const metadata = {
  title: 'Contact — ProposeMagic',
  description: 'How to reach ProposeMagic — support, refunds, press, partnerships.',
};

const CONTACTS = [
  {
    label: 'General & Support',
    email: 'hello@proposemagic.in',
    blurb: 'Questions about your page, the wizard, or anything else. We reply within a day.',
  },
  {
    label: 'Refunds',
    email: 'refunds@proposemagic.in',
    blurb: 'Page didn\'t generate? Want to cancel within 24 hours? Write here with your order ID.',
  },
  {
    label: 'Abuse reports',
    email: 'abuse@proposemagic.in',
    blurb: 'If a ProposeMagic page targets you or someone you know, we\'ll take it down within 24 hours.',
  },
  {
    label: 'Press & partnerships',
    email: 'press@proposemagic.in',
    blurb: 'Collaboration, features, stories. We like hearing from people.',
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">Contact</div>
      <h1 className="mt-3 font-playfair text-4xl md:text-5xl">
        We&apos;re small enough to read every email.
      </h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        Pick the inbox that fits best — or just email{' '}
        <a href="mailto:hello@proposemagic.in" className="font-semibold text-ink underline">
          hello@proposemagic.in
        </a>{' '}
        and we&apos;ll route you.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {CONTACTS.map((c) => (
          <a
            key={c.label}
            href={`mailto:${c.email}`}
            className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-rose">
              {c.label}
            </div>
            <div className="mt-2 font-playfair text-xl text-ink">{c.email}</div>
            <p className="mt-3 text-sm text-ink-muted">{c.blurb}</p>
            <div className="mt-4 text-sm font-semibold text-ink group-hover:underline">
              Open email →
            </div>
          </a>
        ))}
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
            <br />
            Abuse: within 24 hours
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

      <section className="mt-16 rounded-2xl border border-black/10 bg-white p-7 md:p-10">
        <h2 className="font-playfair text-2xl md:text-3xl">Quick checklist before you email us</h2>
        <ul className="mt-5 space-y-3 text-sm text-ink-muted">
          <li className="flex gap-3">
            <span className="text-rose">→</span>
            <span>
              <strong className="text-ink">Lost your link?</strong> We can resend it if you share
              the email you used at checkout.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-rose">→</span>
            <span>
              <strong className="text-ink">Wrong details on the page?</strong> If it&apos;s been
              under 24 hours and you haven&apos;t shared the link, we can regenerate for free.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-rose">→</span>
            <span>
              <strong className="text-ink">Page not generating?</strong> Don&apos;t worry — you
              won&apos;t be charged. Email refunds@proposemagic.in with your order ID.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-rose">→</span>
            <span>
              <strong className="text-ink">Want a custom tone or template?</strong> We take
              requests on{' '}
              <a href="mailto:hello@proposemagic.in" className="underline">
                hello@proposemagic.in
              </a>
              .
            </span>
          </li>
        </ul>
      </section>

      <div className="mt-16 text-center">
        <Link
          href="/faq"
          className="text-sm font-semibold text-ink hover:underline"
        >
          Check the FAQ first →
        </Link>
      </div>
    </div>
  );
}
