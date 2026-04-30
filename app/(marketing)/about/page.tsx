import Link from 'next/link';

export const metadata = {
  title: 'About — ProposeMagic',
  description: 'Why we built ProposeMagic — and who it\'s for.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">About</div>
      <h1 className="mt-3 font-playfair text-4xl md:text-5xl">
        Built for the moments that matter.
      </h1>

      <div className="mt-10 text-[15px] leading-relaxed text-ink-muted">
        <p>
          Every year, millions of people in India plan a proposal, a birthday surprise, a
          Valentine&apos;s gesture, an anniversary note. Most of them settle for a forwarded GIF
          and a typed-out paragraph that doesn&apos;t quite say what they mean.
        </p>

        <p className="mt-5">
          We thought that was a solvable problem. Words are hard. Design is expensive. Coding
          a mini-website for one person is absurd. But a page — cinematic, paced, written in
          your voice, styled in a mood that matches yours, delivered on a short URL you can
          send on WhatsApp — that&apos;s doable. That&apos;s what ProposeMagic is.
        </p>

        <p className="mt-5">
          Under the hood: Claude Haiku writes the message, Next.js and React render the journey,
          Razorpay handles payments, Cloudinary stores the media, Resend sends the email. Six
          templates, four flows, 31 sub-flows, three reveal mechanics. Five tones of voice.
          All of it assembled in the minute it takes you to pour a glass of water.
        </p>

        <p className="mt-5">
          We&apos;re a small team in India building products for people who care about small,
          true moments. If that&apos;s you, welcome.
        </p>

        <p className="mt-10 text-ink">
          — The ProposeMagic team
          <br />
          <span className="text-sm text-ink-soft">SuperCX Technologies · Bengaluru</span>
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="font-playfair text-3xl text-rose">2 min</div>
          <div className="mt-1 text-sm text-ink-muted">Average build time</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="font-playfair text-3xl text-rose">7 scenes</div>
          <div className="mt-1 text-sm text-ink-muted">Cinematic journey per page</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="font-playfair text-3xl text-rose">0</div>
          <div className="mt-1 text-sm text-ink-muted">Accounts ever created</div>
        </div>
      </div>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link
          href="/create"
          className="rounded-full bg-rose-deep px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Create yours →
        </Link>
        <a
          href="mailto:hello@proposemagic.in"
          className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink hover:border-ink/40"
        >
          Say hi
        </a>
      </div>
    </div>
  );
}
