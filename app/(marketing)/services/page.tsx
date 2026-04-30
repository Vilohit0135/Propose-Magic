import Link from 'next/link';
import { FLOWS } from '@/lib/tokens';
import { TemplatesCarousel } from './templates-carousel';

export const metadata = {
  title: 'Services — ProposeMagic',
  description:
    'What ProposeMagic builds for you — a cinematic chat-thread proposal, with optional photos, video reel, anonymous reveal, AI letter, AI quiz, and a song scored to her reading.',
};

export default function ServicesPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      {/* === Hero === */}
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">
        Services
      </div>
      <h1 className="mt-3 max-w-3xl font-playfair text-4xl leading-[1.05] md:text-6xl">
        One cinematic page,{' '}
        <em className="italic text-rose">choreographed for the question</em>.
      </h1>
      <p className="mt-5 max-w-xl text-base text-ink-muted md:text-lg">
        ProposeMagic builds a chat-thread proposal page that unfolds like a
        real conversation — typing dots, photos, a letter, a question, a
        yes. Below: the occasions we ship for, the three packages, the six
        visual templates, and every personalisation lever we put in your
        hands.
      </p>

      {/* === Occasions — propose is the hero, the rest are coming soon === */}
      <Occasions />

      {/* === Visual templates carousel === */}
      <section className="mt-24">
        <div className="text-xs font-semibold uppercase tracking-wider text-rose">
          Six visual templates
        </div>
        <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
          Pick a mood. <em className="italic text-rose">The page paints itself.</em>
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ink-muted">
          Each template is more than a colour swatch — it&apos;s a complete
          atmosphere. Background gradient, accent colour, display font,
          drifting particles, even the glow on her name in the headline
          all change with your choice. Slide through all six.
        </p>
        <div className="mt-10">
          <TemplatesCarousel />
        </div>
      </section>

      {/* === Personalisation features === */}
      <Personalisation />

      {/* === Anonymous reveal styles === */}
      <RevealStyles />
    </div>
  );
}

// === OCCASIONS — proposal is the hero, the rest are coming soon ============

function Occasions() {
  const propose = FLOWS.propose;
  const otherFlows = (Object.entries(FLOWS) as [keyof typeof FLOWS, (typeof FLOWS)[keyof typeof FLOWS]][])
    .filter(([id]) => id !== 'propose');

  return (
    <section className="mt-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">
        Occasions
      </div>
      <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
        Live now: <em className="italic text-rose">Marriage proposals.</em>
      </h2>
      <p className="mt-4 max-w-2xl text-base text-ink-muted">
        We&apos;re launching with the proposal flow first — the
        highest-stakes moment in the lineup, and the one we&apos;ve
        refined the longest. The other occasions are built and queued
        for release.
      </p>

      {/* Hero PROPOSE card — full width, two-column on desktop with a
          live animated chat preview on the right that walks through
          the actual receiver beats. */}
      <article className="relative mt-10 overflow-hidden rounded-3xl border-2 border-rose bg-white shadow-[0_30px_60px_rgba(201,116,138,0.22)] md:grid md:grid-cols-[1.1fr_0.9fr]">
        {/* Live badge */}
        <div className="absolute right-5 top-5 z-10 flex items-center gap-2 rounded-full bg-rose px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_4px_14px_rgba(201,116,138,0.4)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Live now
        </div>

        {/* Left: copy column */}
        <div className="relative px-7 py-9 md:px-10 md:py-12">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{propose.icon}</span>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rose">
              The proposal flow
            </div>
          </div>

          <h3 className="mt-5 font-playfair text-3xl leading-tight md:text-4xl">
            A conversation that ends in a yes.
          </h3>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Typing dots, photos, a video reel, a letter that takes over
            the screen, three lines of tension, then the question. Every
            beat scored to a song that fades in the moment she taps to
            begin. Built in five minutes, lived for the rest of her
            life.
          </p>

          {/* Two sub-flow callouts */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-rose/15 bg-rose-soft/50 px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-deep">
                Sub-flow 01
              </div>
              <div className="mt-1 font-semibold text-ink">Marriage proposal 💍</div>
              <p className="mt-1 text-xs leading-snug text-ink-muted">
                Named. Cinematic. Signed in your name from message one.
              </p>
            </div>
            <div className="rounded-xl border border-rose/15 bg-rose-soft/50 px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-deep">
                Sub-flow 02
              </div>
              <div className="mt-1 font-semibold text-ink">Love proposal ✦</div>
              <p className="mt-1 text-xs leading-snug text-ink-muted">
                Anonymous. She solves an AI quiz before she earns your
                name.
              </p>
            </div>
          </div>

          {/* Inside-the-flow features */}
          <div className="mt-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-deep">
              What&apos;s inside
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-ink-muted">
              {[
                'AI-written letter',
                'Photos auto-drift',
                'Up to 5-clip reel',
                'Background song with seek',
                'Persistent mute pill',
                'Anonymous AI quiz',
                'Letter-by-letter name reveal',
                'Dodging "no" button',
                'Image share + WhatsApp ping',
                '48h privacy wipe',
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-rose">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,21,56,0.35)] hover:opacity-90"
            >
              Build a proposal →
            </Link>
            <Link
              href="/p/ex-rose-proposal"
              className="inline-flex items-center gap-2 rounded-full border border-rose/30 bg-white/70 px-6 py-3 text-sm font-semibold text-rose-deep hover:bg-rose-soft"
            >
              See a live one
            </Link>
          </div>
        </div>

        {/* Right: animated chat preview */}
        <div className="relative h-72 overflow-hidden border-t border-rose/10 md:h-auto md:border-l md:border-t-0">
          <ProposeAnimation />
        </div>
      </article>

      {/* Soon-cards row, faded, no CTA */}
      <div className="relative mt-12">
        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-deep">
          Coming soon
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          Built and in review. Birthday, Valentine&apos;s and Anniversary
          will roll out shortly — the same cinematic chat journey,
          shaped to the occasion.
        </p>
        <div className="relative mt-5 grid gap-4 md:grid-cols-3">
          {/* Soft fade overlay so the row reads as quieter than the
              live propose card above. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-rose-soft/60"
          />
          {otherFlows.map(([id, f]) => (
            <div
              key={id}
              className="relative rounded-2xl border border-rose/15 bg-white/70 p-5 opacity-80 transition-opacity hover:opacity-100"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-3xl">{f.icon}</span>
                <span className="rounded-full border border-rose/30 bg-rose-soft px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-rose-deep">
                  Soon
                </span>
              </div>
              <div className="mt-4 font-playfair text-lg text-ink">
                {f.name}
              </div>
              <div className="mt-1 text-xs text-ink-soft">
                {Object.keys(f.subFlows).length} sub-flow
                {Object.keys(f.subFlows).length > 1 ? 's' : ''} built
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Animated mini-receiver inside the propose hero card. Cycles through
// the actual key beats — typing, photo arrives, letter typewriter,
// "Will you marry me?", yes. Pure CSS animations + a small staged
// useEffect; no library. Loops every ~14s.
function ProposeAnimation() {
  return (
    <div
      className="relative h-full w-full"
      style={{ background: 'linear-gradient(165deg,#2a0e1c,#1a0a12)' }}
    >
      {/* Drifting roses */}
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="absolute opacity-50"
          style={{
            left: `${10 + i * 17}%`,
            top: `-10%`,
            fontSize: 14,
            color: '#c9748a',
            animation: `petalFall ${10 + i * 2}s linear ${-i * 1.5}s infinite`,
          }}
        >
          🌹
        </span>
      ))}

      {/* Beat 1: chat bubbles + typing dots (always visible) */}
      <div className="absolute inset-x-4 top-4 flex flex-col gap-1.5">
        <div
          className="max-w-[85%] self-start rounded-2xl border px-3 py-1.5 text-[12px] backdrop-blur-sm"
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderColor: 'rgba(255,255,255,0.12)',
            color: '#fbeae1',
            animation: 'fadeInUp 0.7s 0.2s both',
          }}
        >
          Hey Priya
        </div>
        <div
          className="max-w-[90%] self-start rounded-2xl border px-3 py-1.5 text-[12px] backdrop-blur-sm"
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderColor: 'rgba(255,255,255,0.12)',
            color: '#fbeae1',
            animation: 'fadeInUp 0.7s 1.6s both',
          }}
        >
          I&apos;ve been sitting on something…
        </div>
        <div
          className="flex w-12 items-center gap-1 self-start rounded-2xl border px-3 py-2 backdrop-blur-sm"
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderColor: 'rgba(255,255,255,0.12)',
            animation: 'fadeInUp 0.5s 3s both',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1 w-1 rounded-full bg-white/70"
              style={{ animation: `typingBounce 1.2s ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>

      {/* Beat 2: question card slides in (centered, glowing) */}
      <div
        className="absolute left-1/2 top-1/2 w-[80%] max-w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-5 py-4 text-center"
        style={{
          background: 'linear-gradient(165deg,#3a1426,#22101c)',
          borderColor: 'rgba(212,165,116,0.5)',
          boxShadow: '0 18px 40px rgba(0,0,0,0.4), 0 0 30px rgba(212,165,116,0.2)',
          animation: 'questionPulse 14s 5.5s infinite',
        }}
      >
        <div
          className="text-[9px] italic"
          style={{ color: '#c9a2a0' }}
        >
          And so, Priya…
        </div>
        <div
          className="mt-2 font-playfair text-[18px] italic leading-tight"
          style={{
            color: '#fff',
            fontFamily: '"Playfair Display", serif',
            textShadow: '0 0 20px rgba(212,165,116,0.6)',
          }}
        >
          Will you marry me?
        </div>
        <div
          className="mt-3 h-px w-8 opacity-70"
          style={{ background: '#d4a574', margin: '12px auto' }}
        />
        <div
          className="rounded-full px-4 py-1.5 text-[11px] font-bold"
          style={{
            background: 'linear-gradient(90deg,#d4a574,#f4c6a8)',
            color: '#1a0a12',
            display: 'inline-block',
            boxShadow: '0 0 18px rgba(212,165,116,0.5)',
          }}
        >
          Yes, I will! 💍
        </div>
      </div>
    </div>
  );
}

// === PERSONALISATION — AI letter, AI quiz, music with seek ==================

function Personalisation() {
  const items = [
    {
      eyebrow: 'AI letter',
      title: 'A letter only you could have written',
      body: 'Type the moments that matter — first meeting, inside jokes, the trip, the song you keep replaying. We weave the specific threads into a 4-6 sentence letter in your voice. Pick the tone: romantic, poetic, funny, cinematic, or simple.',
      tags: ['Powered by Gemini', 'Tone-controlled', '4-6 sentences', 'Story-grounded'],
      glyph: '✎',
    },
    {
      eyebrow: 'AI quiz from your story',
      title: 'Clues only she could solve',
      body: 'For anonymous proposals, the same story powers the reveal quiz. We generate three-clue puzzles, trivia, or sensory questions that reference the actual specific things from your relationship — places, habits, turning points. Edit anything before it ships.',
      tags: ['Three styles', 'Editable before send', 'Identity reveal animation', 'Auto-generated'],
      glyph: '✦',
    },
    {
      eyebrow: 'Anonymous reveal',
      title: 'She earns your name, letter by letter',
      body: 'Her contact header is blurred the entire time. The signature on the letter reads "— ???". The instant she gets the quiz right, your name crossfades letter-by-letter into every prior message — a reveal animation that builds dread and joy simultaneously.',
      tags: ['Blurred contact', 'Crossfade animation', 'Optional', 'Per-letter typewriter'],
      glyph: '✧',
    },
    {
      eyebrow: 'Background music',
      title: 'A song scored to her reading',
      body: 'Paste any YouTube link. Pick the precise second the song begins — 1:55 if that\'s where the chorus drops, 0:42 for that quiet intro you love. The song fades in the moment she taps the entry gate. A speaker pill stays in the corner so she can mute or bring it back any time.',
      tags: ['Any YouTube link', 'Custom seek time', 'Persistent mute pill', 'Looped'],
      glyph: '♫',
    },
  ];
  return (
    <section className="mt-24">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">
        Personalisation
      </div>
      <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
        Built from <em className="italic text-rose">your</em> story.
      </h2>
      <p className="mt-4 max-w-2xl text-base text-ink-muted">
        Four levers turn a template into a one-of-one moment — the
        AI-written letter, the AI-generated quiz, the anonymous reveal,
        and the background song. Every one is shaped by what you tell
        us.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.eyebrow}
            className="flex gap-5 rounded-2xl border border-rose/15 bg-white p-7"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-rose/30 bg-rose-soft text-2xl text-rose">
              {it.glyph}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rose">
                {it.eyebrow}
              </div>
              <h3 className="mt-2 font-playfair text-xl text-ink md:text-2xl">
                {it.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {it.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {it.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-rose/15 bg-rose-soft px-2.5 py-0.5 text-[10px] font-medium text-rose-deep"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// === REVEAL STYLES — anonymous quiz formats =================================

function RevealStyles() {
  const reveals = [
    {
      title: 'Three Clues',
      body: 'You write (or AI-generate) three one-line hints. She reads each, then picks from four names — yours plus three decoys. Most cinematic of the three.',
    },
    {
      title: 'Trivia Quiz',
      body: 'Three multiple-choice questions only she would know the answer to — generated from your story. Each correct answer reveals more of your name, letter by letter.',
    },
    {
      title: 'Sensory Unlock',
      body: 'Pick a colour, a sound, a memory — emotional gut-checks rather than hard facts. No wrong answers, your name appears as she taps through.',
    },
  ];
  return (
    <section className="mt-24">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">
        Anonymous reveal — three styles
      </div>
      <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
        Three ways to <em className="italic text-rose">make her solve for you</em>.
      </h2>
      <p className="mt-4 max-w-2xl text-base text-ink-muted">
        If you choose the anonymous flow, you pick the puzzle style. All
        three end with the same letter-by-letter name reveal — the
        difference is how she gets there.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {reveals.map((r) => (
          <div
            key={r.title}
            className="rounded-2xl border border-rose/15 bg-white p-6"
          >
            <div className="font-playfair text-xl text-ink">{r.title}</div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {r.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

