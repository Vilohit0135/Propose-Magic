export const metadata = {
  title: 'Privacy — ProposeMagic',
  description: 'How we handle your data.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">Privacy</div>
      <h1 className="mt-3 font-playfair text-4xl md:text-5xl">
        The short version: we keep very little, and we don&apos;t sell it.
      </h1>
      <p className="mt-4 text-sm text-ink-soft">Last updated: April 21, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-muted">
        <Section title="What we collect">
          <ul className="list-disc space-y-2 pl-5">
            <li>Names (yours and theirs) you enter in the wizard.</li>
            <li>An optional one-sentence story.</li>
            <li>Your email address (for the delivery link).</li>
            <li>Photos and/or video clips you upload, if any.</li>
            <li>Payment confirmation from Razorpay (never the card number itself).</li>
            <li>Aggregate usage metrics (scene views, taps) — never tied to a named person.</li>
          </ul>
        </Section>

        <Section title="What we don't collect">
          <ul className="list-disc space-y-2 pl-5">
            <li>Phone numbers.</li>
            <li>Physical addresses.</li>
            <li>Device contacts or location.</li>
            <li>Anything from the recipient other than their interaction with the page (taps, reactions, yes click).</li>
          </ul>
        </Section>

        <Section title="How we use it">
          <p>
            Names and stories go to Claude (our AI writer) to generate the message. Photos go to
            Cloudinary (our image CDN) to render on the page. Emails go to Resend so we can send
            you the delivery link. Razorpay gets payment details. That&apos;s it.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            The generated page is kept indefinitely so the link never breaks. Personal data in
            our database (names, email, story) is kept as long as the page exists. Request
            deletion any time —{' '}
            <a href="mailto:hello@proposemagic.in" className="underline">
              hello@proposemagic.in
            </a>
            .
          </p>
        </Section>

        <Section title="Who we share it with">
          <p>
            Our infrastructure providers only — Claude (Anthropic), Cloudinary, Razorpay, Resend,
            Supabase, and Vercel. We never sell, rent, or trade your data to third parties. We
            don&apos;t run targeted ads and we don&apos;t track you across the web.
          </p>
        </Section>

        <Section title="Your rights">
          <ul className="list-disc space-y-2 pl-5">
            <li>Access — ask us what we have about you.</li>
            <li>Deletion — ask us to remove it.</li>
            <li>Correction — ask us to fix it.</li>
            <li>Portability — ask us for a copy.</li>
          </ul>
          <p className="mt-3">
            Reach us at{' '}
            <a href="mailto:hello@proposemagic.in" className="underline">
              hello@proposemagic.in
            </a>{' '}
            and we&apos;ll respond within a week.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we change what we collect or how we use it, we&apos;ll update this page and change
            the date above. For material changes, we&apos;ll email anyone who has an active page.
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
