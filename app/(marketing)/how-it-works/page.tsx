import Link from 'next/link';

export const metadata = {
  title: 'How it works — ProposeMagic',
  description: 'Five steps from idea to a page they\'ll never forget.',
};

const STEPS = [
  {
    n: 1,
    title: 'Tell us who & why',
    copy: 'Your name, theirs, the occasion — proposal, birthday, Valentine\'s, or anniversary. Drop in a sentence of your story if you\'ve got one; skip it if you haven\'t.',
    emoji: '✍️',
  },
  {
    n: 2,
    title: 'Pick the vibe',
    copy: 'Choose your flow, sub-flow, tone of voice, and one of six cinematic templates — rose dark, sakura, ocean, midnight, cinematic, or golden hour.',
    emoji: '🎨',
  },
  {
    n: 3,
    title: 'Add your media (optional)',
    copy: 'Photos arrange themselves into one of four tasteful layouts. On the Photos + Video package, five short clips thread through the scenes.',
    emoji: '📸',
  },
  {
    n: 4,
    title: 'We generate the page',
    copy: 'AI writes the message in your chosen tone. We compose a 7-scene journey — opening, where it began, memories, the letter, the pause, the question, the yes.',
    emoji: '✨',
  },
  {
    n: 5,
    title: 'Share the link',
    copy: 'One shareable URL goes to your email. Send it to them on WhatsApp. They tap through, react, and hit "yes". You get notified.',
    emoji: '💌',
  },
];

const FEATURES = [
  {
    title: '7-scene cinematic journey',
    copy: 'Opening → where it began → memories → the letter → the pause → the question → yes. Paced like a film.',
  },
  {
    title: 'AI-written in your tone',
    copy: 'Romantic, poetic, funny, cinematic, or simple. Five voices, one that sounds like you.',
  },
  {
    title: 'Anonymous + reveal quiz',
    copy: 'Hide your name behind a three-clue, trivia, or sensory quiz. Name revealed cinematically before the big moment.',
  },
  {
    title: 'Gamification that feels right',
    copy: 'Heart taps, reactions, confetti. A running "No" button that dodges. A stat card at the end.',
  },
  {
    title: 'Mobile-first, phone-native',
    copy: 'Designed for a 380px viewport. Every scene advances on tap. Haptic feedback on key moments.',
  },
  {
    title: 'Zero friction',
    copy: 'No account. No password. No app to install. Pay, share, done.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">How it works</div>
      <h1 className="mt-3 max-w-3xl font-playfair text-4xl md:text-6xl">
        From idea to unforgettable — in under five minutes.
      </h1>
      <p className="mt-5 max-w-xl text-ink-muted">
        Five steps. No accounts. No downloads. Just a link you can send on WhatsApp and watch
        them fall in love with.
      </p>

      <section className="mt-16 space-y-5">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className="grid gap-6 rounded-2xl border border-black/10 bg-white p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:p-8"
          >
            <div className="flex items-center gap-4 md:flex-col md:items-start">
              <div className="font-playfair text-5xl italic text-rose md:text-7xl">
                {s.n}
              </div>
              <div className="text-4xl md:hidden">{s.emoji}</div>
            </div>
            <div>
              <h2 className="font-playfair text-2xl md:text-3xl">{s.title}</h2>
              <p className="mt-2 text-ink-muted">{s.copy}</p>
            </div>
            <div className="hidden text-6xl md:block">{s.emoji}</div>
            {i < STEPS.length - 1 && null}
          </div>
        ))}
      </section>

      <section className="mt-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-rose">What you get</div>
        <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
          More than a page — a moment.
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="font-semibold text-ink">{f.title}</div>
              <p className="mt-2 text-sm text-ink-muted">{f.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-2xl border border-black/10 bg-[#1a0a12] p-10 text-center text-white md:p-16">
        <h2 className="font-playfair text-3xl italic md:text-4xl">Ready to build theirs?</h2>
        <p className="mt-3 text-[#c9a2a0]">Start from scratch — it takes about five minutes.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/create"
            className="rounded-full bg-gradient-to-r from-[#d4a574] to-[#f4c6a8] px-6 py-3 text-sm font-semibold text-[#1a0a12]"
          >
            Create yours →
          </Link>
          <Link
            href="/examples"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
          >
            See examples
          </Link>
        </div>
      </section>
    </div>
  );
}
