import Link from 'next/link';
import { ExamplesGallery } from './gallery';

export const metadata = {
  title: 'Examples — ProposeMagic',
  description:
    'Live examples of ProposeMagic chat-thread proposals across flows, templates, anonymous reveals, and tones. Tap any to walk through it.',
};

const WHAT_TO_LOOK_FOR = [
  {
    title: 'The opening tap',
    body: 'A gentle entry gate appears with the receiver\'s first name. Her tap is what gives the browser permission to play your background song with sound.',
  },
  {
    title: 'How the chat unfolds',
    body: 'Typing dots, then a single short line. Then another. Section chips break the flow into chapters — Hello, Memories, Letter, Question, Yes — so it never feels like a wall of text.',
  },
  {
    title: 'The photo layout you picked',
    body: 'Polaroids that auto-drift sideways. A slideshow that crossfades. A filmstrip with sepia. A scrollable grid. Each example shows a different one of the four.',
  },
  {
    title: 'The letter takeover',
    body: 'The chat dissolves and a full-screen italic letter types itself out one character at a time. Five emoji reactions sit pinned at the bottom — pick any, multiple if you want.',
  },
  {
    title: 'The anonymous reveal',
    body: 'On the anonymous birthday example, the contact header is blurred and the signature reads "— ???". Solve the quiz to watch your name crossfade letter-by-letter into every prior message.',
  },
  {
    title: 'The yes screen',
    body: 'Confetti, the headline with her name, a "share this moment" button that exports the card as a PNG (not just a link). Try the dodging "no" button before tapping yes.',
  },
];

const FLOW_LEGEND = [
  {
    flow: 'Proposals',
    body: 'Marriage proposals — named (signed in your name) or anonymous (with quiz reveal). The flagship flow.',
    count: 1,
  },
  {
    flow: 'Birthdays',
    body: 'Cake-day with photos, AI letter, and the "make a wish" beat. Anonymous version uses the same quiz reveal as proposals.',
    count: 1,
  },
  {
    flow: "Valentine's",
    body: 'A sub-flow for each of the eight V-week days — Rose, Propose, Chocolate, Teddy, Promise, Hug, Kiss, Vday. Each has its own particle and question.',
    count: 1,
  },
  {
    flow: 'Anniversaries',
    body: 'Milestone sub-flows for first / fifth / tenth / twenty-fifth. Calmer pacing, deeper templates.',
    count: 2,
  },
];

export default function ExamplesPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      {/* === Hero =========================================== */}
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">
        Live examples
      </div>
      <h1 className="mt-3 max-w-3xl font-playfair text-4xl leading-[1.05] md:text-6xl">
        Six finished journeys.{' '}
        <em className="italic text-rose">Tap any to play through.</em>
      </h1>
      <p className="mt-5 max-w-2xl text-base text-ink-muted md:text-lg">
        Each example is a real receiver page on a permanent demo URL —
        not a marketing mock. Walk through every scene, send hearts in
        the composer, react to the letter with multiple emojis, try the
        reveal quiz on the anonymous one, even tap yes on the question
        card. They&apos;re full proposals, just with stand-in names.
      </p>

      {/* === Filter chips + gallery (interactive) =========== */}
      <div className="mt-2">
        <ExamplesGallery />
      </div>

      {/* === What to look for ============================== */}
      <section className="mt-24">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-deep">
          What to look for
        </div>
        <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
          Six things <em className="italic text-rose">worth noticing</em>{' '}
          as you walk through.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ink-muted">
          The examples are easy to skim — but the real craft sits in the
          micro-decisions. Here&apos;s what most people miss on the
          first watch.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {WHAT_TO_LOOK_FOR.map((item, i) => (
            <div
              key={item.title}
              className="relative flex gap-4 rounded-2xl border border-rose/15 bg-white p-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose/30 bg-rose-soft text-sm font-bold text-rose-deep">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <div className="font-playfair text-lg text-ink">
                  {item.title}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Flow legend ================================== */}
      <section className="mt-24">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-deep">
          The four flows
        </div>
        <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
          What the filter chips actually filter.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ink-muted">
          Each example sits inside one of four occasion flows. The
          proposal flow is live now; birthday, Valentine&apos;s, and
          anniversary are demoable through these examples but the public
          create-flow for them rolls out shortly.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {FLOW_LEGEND.map((f) => (
            <div
              key={f.flow}
              className="rounded-2xl border border-rose/15 bg-white p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="font-playfair text-lg text-ink">{f.flow}</div>
                <span className="rounded-full border border-rose/15 bg-rose-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-deep">
                  {f.count} example{f.count > 1 ? 's' : ''}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* === Tips ========================================= */}
      <section className="mt-20 rounded-3xl border border-rose/15 bg-rose-soft/60 p-7 md:p-10">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-deep">
          Watching tips
        </div>
        <h3 className="mt-3 font-playfair text-2xl md:text-3xl">
          Best on a phone, in a quiet moment, with sound on.
        </h3>
        <ul className="mt-5 space-y-2.5 text-sm text-ink-muted">
          <li className="flex gap-2">
            <span className="text-rose">♫</span>
            <span>
              Examples don&apos;t auto-play music (stand-in pages have no
              song). Your real created proposals do — and the receiver
              gets a soft tap-to-begin gate that doubles as the
              user-gesture browsers need to allow audio.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-rose">📱</span>
            <span>
              The chat is mobile-native. On a desktop the layout still
              works but the scroll-snap reel and the dodging "no" feel
              best on a phone.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-rose">↩</span>
            <span>
              Tap "yes" on the question card to see the celebration
              screen. Confetti, share-as-image, and the stats line all
              come alive. Examples don&apos;t actually fire the
              email/WhatsApp ping — only your real created proposal will.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-rose">✦</span>
            <span>
              Try the anonymous birthday example specifically — that one
              shows the quiz reveal mechanic, blurred contact header,
              and the letter-by-letter name crossfade animation that
              makes anonymous proposals so dramatic.
            </span>
          </li>
        </ul>
      </section>

      {/* === CTA ========================================== */}
      <section className="relative mt-20 overflow-hidden rounded-2xl border border-rose/15 bg-gradient-to-br from-rose-soft via-[#fde6ea] to-[#f9d9e0] p-10 text-center md:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,116,138,0.18),transparent_60%)]"
        />
        <h2 className="relative font-playfair text-3xl italic text-ink md:text-4xl">
          Inspired? Build yours.
        </h2>
        <p className="relative mt-3 text-ink-muted">
          Five minutes from here to a link you can text them.
        </p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/create"
            className="rounded-full bg-rose-deep px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,21,56,0.35)] hover:opacity-90"
          >
            Create yours →
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-full border border-rose/30 bg-white/70 px-6 py-3 text-sm font-semibold text-rose-deep hover:bg-white"
          >
            See how it works
          </Link>
        </div>
      </section>
    </div>
  );
}
