import Link from 'next/link';

export const metadata = {
  title: 'FAQ — ProposeMagic',
  description: 'Answers to what people usually ask before making one.',
};

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Do I need to create an account?',
    a: 'No. There are no accounts, no passwords, no apps. You fill in the wizard, we build the page, you get a link.',
  },
  {
    q: 'How long does it take to generate?',
    a: 'Most pages are ready in under a minute. The longest we\'ve seen is about two minutes.',
  },
  {
    q: 'Who writes the message?',
    a: 'An AI (Claude) writes it in the tone you pick — romantic, poetic, funny, cinematic, or simple. If you give us a sentence of your story, it\'ll use that. Otherwise it keeps it universal. You can regenerate until it feels right.',
  },
  {
    q: 'Can I stay anonymous?',
    a: 'Yes — for Love Proposals and Anonymous Birthdays, there\'s a cinematic quiz reveal. Your name appears only after they solve three clues, three trivia questions, or a sensory unlock. The name is always revealed before the final question.',
  },
  {
    q: 'Can they reply?',
    a: 'Yes. The big button at the end — "Yes, I will", "Make a wish", "Still yes" — triggers a confetti moment and notifies you. They can also react with emoji, tap hearts, and save the page as an image.',
  },
  {
    q: 'What photos should I upload?',
    a: '2–10 photos of the two of you. Higher contrast and faces close to camera work best. We apply tasteful filters per template — we never change the people.',
  },
  {
    q: 'Is there a video package?',
    a: 'Yes — Photos + Video (₹199). Upload up to 5 short clips; they\'re mapped to scenes 1, 3, 5, 6, and 7. Four treatments available: cinematic letterbox, dreamy blur, vintage film, full bleed.',
  },
  {
    q: 'What happens if I mess up?',
    a: 'You can preview the full page before sharing. If you don\'t like it, email us — we\'ll regenerate or refund.',
  },
  {
    q: 'How long is the page live?',
    a: 'Forever. The link won\'t expire.',
  },
  {
    q: 'Is it safe?',
    a: 'Yes. Photos are stored encrypted. Short IDs are unguessable. We don\'t sell your data. We only keep what we need to render the page and send you one email.',
  },
  {
    q: 'What occasions do you cover?',
    a: 'Proposals (marriage + love), birthdays (named + anonymous), the full eight-day Valentine\'s week, and anniversaries (1st, 3rd, 5th, 10th, 25th, 50th).',
  },
  {
    q: 'Can I use this outside India?',
    a: 'Right now the pricing is in INR via Razorpay. Anyone can receive the link from anywhere. International payment options are coming.',
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">FAQ</div>
      <h1 className="mt-3 font-playfair text-4xl md:text-5xl">Questions, answered.</h1>
      <p className="mt-4 text-ink-muted">
        Didn&apos;t find what you were looking for?{' '}
        <a href="mailto:hello@proposemagic.in" className="font-semibold text-ink underline">
          Email us.
        </a>
      </p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-black/10 bg-white">
        {FAQS.map((item, i) => (
          <details
            key={i}
            className="group border-b border-black/5 last:border-0"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left font-semibold text-ink hover:bg-cream-dark/20">
              <span>{item.q}</span>
              <span className="text-rose transition group-open:rotate-45">+</span>
            </summary>
            <div className="px-6 pb-6 pt-0 text-sm text-ink-muted">{item.a}</div>
          </details>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/create"
          className="inline-block rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Start one →
        </Link>
      </div>
    </div>
  );
}
