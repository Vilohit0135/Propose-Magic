import Link from 'next/link';

export const metadata = {
  title: 'FAQ — ProposeMagic',
  description:
    'Answers to what people usually ask before making one — pricing, the AI letter, anonymous reveal, music, video, 48h privacy, and more.',
};

type FaqItem = { q: string; a: React.ReactNode };
type FaqCategory = { id: string; title: string; intro: string; items: FaqItem[] };

const CATEGORIES: FaqCategory[] = [
  {
    id: 'general',
    title: 'General',
    intro: 'The basics — accounts, generation time, occasions.',
    items: [
      {
        q: 'Do I need to create an account?',
        a: 'No. There are no accounts, no passwords, no apps. You fill in the wizard, we build the page, you get a link.',
      },
      {
        q: 'How long does it take to generate?',
        a: 'Most pages are ready in under a minute. Letter generation runs against Gemini and usually returns in 5-15 seconds; video transcoding is the longest step at ~30s per clip.',
      },
      {
        q: 'What occasions do you cover?',
        a: 'Marriage proposals are live now (named or anonymous). Birthdays, the full eight-day Valentine\'s week, and anniversaries (1st, 3rd, 5th, 10th, 25th, 50th) are built and queueing for public release.',
      },
      {
        q: 'Can I use this outside India?',
        a: 'Pricing is in INR via Razorpay right now. Anyone can receive the link from anywhere in the world — only the sender needs to pay in INR. International payment options are coming.',
      },
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing & billing',
    intro: 'How payment works, refunds, and what each tier ships.',
    items: [
      {
        q: 'Do I pay per recipient?',
        a: 'No — one payment, one page, one link. Share it as many times as you want during the 48-hour window.',
      },
      {
        q: 'What\'s the difference between the three packages?',
        a: 'Every package ships the full chat-thread proposal: AI letter, anonymous reveal, background music with seek, share-as-image card, email + WhatsApp ping on yes, 48h privacy wipe. The difference is purely media — Basic has no photos/video, Photos lets you upload up to 10 photos, Photos + Video adds an Instagram-style 5-clip reel.',
      },
      {
        q: 'Refunds?',
        a: (
          <>
            If the page fails to generate, we refund automatically — no
            ticket needed. Otherwise, reach out at{' '}
            <a
              href="mailto:hello@proposemagic.in"
              className="font-semibold text-rose-deep hover:underline"
            >
              hello@proposemagic.in
            </a>{' '}
            and we&apos;ll work it out.
          </>
        ),
      },
      {
        q: 'What if Gemini fails to write the letter?',
        a: 'We retry automatically. If it still can\'t generate, we fall back to a template letter in your tone — and you can edit it before sending. If the page can\'t be created at all, we refund automatically.',
      },
    ],
  },
  {
    id: 'ai',
    title: 'The AI letter & quiz',
    intro: 'Who writes what, how to influence it, and how editable it is.',
    items: [
      {
        q: 'Who writes the message?',
        a: 'Gemini writes it in the tone you pick — romantic, poetic, funny, cinematic, or simple. The story field you fill in is the most important input: the richer the story, the more specific and personal the letter. You can regenerate until it feels right.',
      },
      {
        q: 'Can I edit the AI-generated quiz?',
        a: 'Yes. After we generate quiz questions from your story, you see every clue / option / correct answer in an editor. Tweak any of them before saving.',
      },
      {
        q: 'What if I don\'t have a story to share?',
        a: 'Skip it. The AI keeps the letter universal and emotional rather than fabricating specific memories. The anonymous quiz falls back to default personality-based questions instead of story-grounded ones.',
      },
      {
        q: 'Can they reply?',
        a: 'Yes. The big "Yes, I will" button at the end triggers a confetti moment, fires a WhatsApp + email notification to you, and unlocks the share-as-image card. They can also send hearts in the composer and react to the letter with multiple emojis throughout.',
      },
    ],
  },
  {
    id: 'flow',
    title: 'The flow & features',
    intro: 'Anonymous reveal, music, photos, video — the levers you control.',
    items: [
      {
        q: 'Can I stay anonymous?',
        a: 'Yes — for marriage proposals, you can choose the anonymous "Love Proposal" sub-flow. Your contact header is blurred the entire time, the letter is signed "— ???", and you pick one of three quiz styles (three-clue, trivia, sensory). The receiver only earns your real name when she gets the quiz right; it then crossfades letter-by-letter into every prior message.',
      },
      {
        q: 'How does the background music work?',
        a: 'Paste any YouTube link in the wizard. Pick the exact second the song should start (1:55 if that\'s where the chorus drops). The song fades in the moment the receiver taps the entry gate. A small speaker pill stays in the corner the whole time so she can mute or unmute any time. The song loops, restarting from your chosen second.',
      },
      {
        q: 'What photos should I upload?',
        a: '2–10 photos of the two of you. Higher contrast and faces close to camera work best. Photos compress client-side before upload (saves your bandwidth) and arrange themselves into one of four tasteful layouts you choose: slideshow, polaroid strip, sepia filmstrip, or scrollable grid. Layouts auto-drift so she sees every photo without lifting a finger.',
      },
      {
        q: 'Is there a video package?',
        a: 'Yes — Photos + Video (₹199). Upload up to 5 short clips. They open as a full-screen vertical "reel" in the receiver page — collab handle with both names, swipe up to advance, like/comment/share rail. Each clip is transcoded client-side to ~720p with VP9 audio so even 30MB phone clips drop to 6-8MB before upload.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & safety',
    intro: 'How long things live, what we keep, and how the wipe actually works.',
    items: [
      {
        q: 'How long is the page live?',
        a: 'The link is active for 48 hours from creation. After that, photos / video / names / the letter are all permanently wiped from our database and Cloudinary storage. Anyone clicking the link past the window sees a "this page has faded" page. This is a privacy guarantee built into the product, not a setting.',
      },
      {
        q: 'Why only 48 hours?',
        a: 'Because the moment is meant to be ephemeral. After yes (or no), there\'s no good reason to keep the receiver\'s name, your story, the photos and video lying on a server forever. The PNG share-card lets you keep a permanent souvenir on your own phone instead.',
      },
      {
        q: 'Is my data sold?',
        a: 'No. We never sell or share user data. We keep only what we need to render the page and send you one notification email + WhatsApp on yes. After 48 hours, we keep only anonymous analytics (which template was picked, which sub-flow, whether yes was tapped) — no PII.',
      },
      {
        q: 'How are uploads stored?',
        a: 'Photos and video are uploaded directly from your browser to Cloudinary using a signed one-time URL (the secret never touches our server during upload). At the 48h mark, our cron sweep calls Cloudinary\'s destroy API to permanently remove every asset.',
      },
      {
        q: 'What happens if I mess up?',
        a: 'You can preview the full page before sharing the link. If you don\'t like the AI letter, regenerate it. If you don\'t like the quiz questions, edit them. If the page itself doesn\'t work, email us — we\'ll regenerate or refund.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="relative mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">
        FAQ
      </div>
      <h1 className="mt-3 font-playfair text-4xl leading-[1.05] md:text-5xl">
        Questions, <em className="italic text-rose">answered</em>.
      </h1>
      <p className="mt-4 text-base text-ink-muted">
        Five categories. Tap any question to expand. Didn&apos;t find
        yours?{' '}
        <a
          href="mailto:hello@proposemagic.in"
          className="font-semibold text-rose-deep underline"
        >
          Email us.
        </a>
      </p>

      {/* Category jump nav — sticks below the page nav so users can
          hop between sections on long pages. */}
      <nav
        aria-label="Category jump links"
        className="sticky top-20 z-20 -mx-5 mt-10 flex flex-wrap items-center gap-2 border-y border-rose/15 bg-cream/85 px-5 py-3 backdrop-blur md:-mx-8 md:px-8"
      >
        {CATEGORIES.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="rounded-full border border-rose/20 bg-white/70 px-4 py-1.5 text-xs font-medium text-rose-deep transition-colors hover:bg-rose-soft"
          >
            {c.title}
          </a>
        ))}
      </nav>

      {CATEGORIES.map((cat) => (
        <section key={cat.id} id={cat.id} className="mt-16 scroll-mt-32">
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-deep">
            {cat.title}
          </div>
          <h2 className="mt-2 font-playfair text-2xl md:text-3xl">
            {cat.intro}
          </h2>

          <div className="mt-6 overflow-hidden rounded-2xl border border-rose/15 bg-white">
            {cat.items.map((item, i) => (
              <details
                key={i}
                className="group border-b border-rose/10 last:border-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left font-semibold text-ink hover:bg-rose-soft/40">
                  <span>{item.q}</span>
                  <span className="text-rose transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-ink-muted">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}

      <div className="relative mt-20 overflow-hidden rounded-2xl border border-rose/15 bg-gradient-to-br from-rose-soft via-[#fde6ea] to-[#f9d9e0] p-10 text-center md:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,116,138,0.18),transparent_60%)]"
        />
        <h2 className="relative font-playfair text-2xl italic text-ink md:text-3xl">
          Still curious?
        </h2>
        <p className="relative mt-3 text-sm text-ink-muted">
          Email us, or just start one — most things make sense once you&apos;re inside the wizard.
        </p>
        <div className="relative mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/create"
            className="rounded-full bg-rose-deep px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,21,56,0.35)] hover:opacity-90"
          >
            Start one →
          </Link>
          <a
            href="mailto:hello@proposemagic.in"
            className="rounded-full border border-rose/30 bg-white/70 px-6 py-3 text-sm font-semibold text-rose-deep hover:bg-white"
          >
            Email hello@proposemagic.in
          </a>
        </div>
      </div>
    </div>
  );
}
