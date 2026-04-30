import Link from 'next/link';

export const metadata = {
  title: 'How it works — ProposeMagic',
  description:
    'Five steps from idea to a chat-thread proposal page that opens with a song, reveals letter-by-letter, and notifies you the moment she says yes.',
};

const STEPS = [
  {
    n: 1,
    title: 'Tell us your story',
    copy:
      'Their first name, your name, your gender pronoun, and an email so we can send you the link. Then a story field — first meeting, inside jokes, the trip, the song you keep replaying. The richer the story, the more personal everything we build for you.',
    pillars: ['Names', 'Story (the most important field)', 'Email', 'Sender phone (optional)'],
    glyph: '✎',
    estimate: '~ 90 seconds',
  },
  {
    n: 2,
    title: 'Pick the textures',
    copy:
      'Choose your tone (romantic, poetic, funny, cinematic, simple), one of six visual templates (Rose Dark, Sakura, Ocean, Midnight, Cinematic, Golden Hour), and a sub-flow — named marriage proposal or anonymous love proposal with a quiz reveal.',
    pillars: ['Tone of voice', 'Visual template', 'Named or anonymous'],
    glyph: '✦',
    estimate: '~ 30 seconds',
  },
  {
    n: 3,
    title: 'Drop in the media',
    copy:
      'Up to 10 photos in your choice of layout (slideshow, polaroid, filmstrip, grid). Up to 5 short video clips for the Instagram-style reel popup. A YouTube link for the background song with a custom start time — 1:55 if that\'s where the chorus drops. Skip any of these for the basic package.',
    pillars: ['Photos with auto-drift', 'Up to 5 video clips', 'Background song + seek'],
    glyph: '🎬',
    estimate: '~ 2 minutes',
  },
  {
    n: 4,
    title: 'We compose the moment',
    copy:
      'Gemini writes a 4-6 sentence letter in your tone, weaving specific threads from your story. For anonymous flows, the same story powers a personalised quiz — three-clue, trivia, or sensory — so the receiver earns your name with clues only she could solve. Photos compress client-side; videos transcode to ~720p before upload to save your bandwidth.',
    pillars: ['AI letter', 'AI quiz from story', 'Client-side compression'],
    glyph: '♥',
    estimate: 'Instant',
  },
  {
    n: 5,
    title: 'Share the link',
    copy:
      'You get a short tinyurl link (no propose-magic domain text) plus an email with everything. Send it on WhatsApp. The moment she taps yes, we ping you instantly via email and WhatsApp — so you find out in real time. The link lives for 48 hours, then photos, video, names, the letter — all wiped for privacy.',
    pillars: ['Short link', 'Email + WhatsApp ping on yes', '48h auto-wipe'],
    glyph: '📤',
    estimate: 'Instant',
  },
];

const RECEIVER_BEATS = [
  {
    title: 'A soft tap to begin',
    copy: '"Take a breath. Let it come slowly." A gate appears that doubles as the user-gesture browsers need to allow audio. Her tap starts everything.',
  },
  {
    title: 'The song fades in',
    copy: 'Plays from your chosen second, loops with the same start point. A speaker pill stays in the corner so she can mute or bring it back.',
  },
  {
    title: 'Messages stream in',
    copy: 'Typing dots, one short line at a time. Photos drift across the layout you picked, automatically scrolling so she sees them all.',
  },
  {
    title: 'A reel of your moments',
    copy: 'Up to 5 clips open as a full-screen vertical reel — collab handle with both your names, swipe up to advance, like/comment/share rail.',
  },
  {
    title: 'The letter takes over',
    copy: 'Full-screen italic typewriter, signed in your name (or "— ???" if anonymous). She picks reactions before closing.',
  },
  {
    title: 'Anonymous? AI quiz reveal',
    copy: 'Her contact header is blurred. The instant she gets the quiz right, your name crossfades letter-by-letter into every prior message.',
  },
  {
    title: 'Tension. Then the question.',
    copy: 'Three lines of build-up, then a ready-check, then the question card with a "no" button that gracefully skitters around when she goes near it.',
  },
  {
    title: 'Yes — and you find out',
    copy: 'Confetti, share-as-image, save as PNG. Email + WhatsApp ping fires to you the same instant.',
  },
];

const GUARANTEES = [
  {
    title: '48-hour privacy wipe',
    copy: 'Photos, video, names, letter — all destroyed after 48h. The link still resolves but lands on a "faded" page. Built into the product, not a setting she has to find.',
  },
  {
    title: 'No account, no app',
    copy: 'You don\'t sign up. She doesn\'t download anything. One link in WhatsApp, one tap to begin.',
  },
  {
    title: 'Mobile-native by construction',
    copy: 'Designed for a 380px viewport. Touch-first scroll-snap reels, persistent floating mute, dodging "no" button — it all just works on a phone.',
  },
  {
    title: 'Refund if it fails',
    copy: 'If we can\'t generate the page (Gemini outage, Cloudinary refusing your upload), we automatically refund. No tickets to file.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">
        How it works
      </div>
      <h1 className="mt-3 max-w-3xl font-playfair text-4xl leading-[1.05] md:text-6xl">
        Five steps. <em className="italic text-rose">Five minutes.</em>
      </h1>
      <p className="mt-5 max-w-2xl text-base text-ink-muted md:text-lg">
        Less time than ordering chai. The AI writes the letter, the AI
        builds the quiz, the song fades in on her tap, and the WhatsApp
        notification fires the moment she says yes. Here&apos;s every
        step from your side, then every beat from hers.
      </p>

      {/* === STEPS — your side ============================================= */}
      <section className="mt-16">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-deep">
          Your five steps
        </div>
        <div className="mt-6 space-y-5">
          {STEPS.map((s, i) => (
            <article
              key={s.n}
              className="relative grid gap-6 rounded-3xl border border-rose/15 bg-white p-7 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-start md:gap-10 md:p-9"
            >
              {/* Numeric badge + glyph */}
              <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-5">
                <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-rose-deep text-xl font-bold text-white shadow-[0_4px_14px_rgba(139,21,56,0.3)]">
                  {s.n}
                </span>
                <span
                  className="text-3xl text-rose md:text-4xl"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(201,116,138,0.4))' }}
                >
                  {s.glyph}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-playfair text-2xl text-ink md:text-3xl">
                    {s.title}
                  </h3>
                  <span className="rounded-full bg-rose-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-deep">
                    {s.estimate}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
                  {s.copy}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.pillars.map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-rose/15 bg-rose-soft px-2.5 py-0.5 text-[10px] font-medium text-rose-deep"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="hidden text-3xl text-rose/40 md:block"
                >
                  ↓
                </span>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* === RECEIVER BEATS — their side ==================================== */}
      <section className="mt-24">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-deep">
          Eight beats she lives through
        </div>
        <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
          What unfolds when{' '}
          <em className="italic text-rose">she opens the link.</em>
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ink-muted">
          Every beat is choreographed — the song timing, the typing
          delays, the letter pace, the question gate. Here&apos;s exactly
          what she sees, in order.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {RECEIVER_BEATS.map((b, i) => (
            <div
              key={b.title}
              className="relative flex gap-4 rounded-2xl border border-rose/15 bg-white p-6"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-rose/30 bg-rose-soft text-sm font-bold text-rose-deep">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <div className="font-playfair text-lg text-ink">{b.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  {b.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === GUARANTEES ==================================================== */}
      <section className="mt-24">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-deep">
          What you always get
        </div>
        <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
          The non-negotiables.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {GUARANTEES.map((g) => (
            <div
              key={g.title}
              className="rounded-2xl border border-rose/15 bg-white p-6"
            >
              <div className="font-playfair text-lg text-ink">{g.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {g.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* === CTA =========================================================== */}
      <section className="relative mt-20 overflow-hidden rounded-2xl border border-rose/15 bg-gradient-to-br from-rose-soft via-[#fde6ea] to-[#f9d9e0] p-10 text-center md:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,116,138,0.18),transparent_60%)]"
        />
        <h2 className="relative font-playfair text-3xl italic text-ink md:text-4xl">
          Ready to build theirs?
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
            href="/examples"
            className="rounded-full border border-rose/30 bg-white/70 px-6 py-3 text-sm font-semibold text-rose-deep hover:bg-white"
          >
            See examples
          </Link>
        </div>
      </section>
    </div>
  );
}
