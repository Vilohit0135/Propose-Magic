import Link from 'next/link';
import { FLOWS, PACKAGES, TEMPLATES } from '@/lib/tokens';
import type { FlowId, PackageId, TemplateId } from '@/lib/types';
import { RosePetals } from '@/components/site/rose-petals';
import { RoseSparkles } from '@/components/site/rose-sparkles';

export const metadata = {
  title: 'ProposeMagic — The proposal she will never forget',
  description:
    'A proposal that unfolds like a conversation. Typing dots, photos, a letter that takes over the screen — then the question. Built in minutes, remembered forever.',
};

const SECONDARY_FLOWS: FlowId[] = ['birthday', 'valentines', 'anniversary'];

const FEATURED_TEMPLATES: TemplateId[] = ['rose_dark', 'sakura', 'midnight'];

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ProposalShowcase />
      <PersonalisedHighlights />
      <SecondaryOccasions />
      <Templates />
      <HowItWorksTeaser />
      <PricingAndCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,116,138,0.18),_transparent_60%)]" />
      <RosePetals />
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
        <div className="text-xs uppercase tracking-[0.3em] text-ink-muted">
          proposemagic.in · proposals that feel like a conversation
        </div>
        <h1 className="mt-5 max-w-3xl font-playfair text-[44px] leading-[1.05] md:text-[72px]">
          Make them say <em className="text-rose italic">yes</em> to a moment
          they&apos;ll never forget.
        </h1>
        <p className="mt-6 max-w-xl text-base text-ink-muted md:text-lg">
          Not a website. A conversation. Messages arrive the way real ones do —
          typing dots, photos, a letter that takes over the screen. Then the
          question. Built in five minutes, felt forever.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-7 py-4 text-base font-semibold text-white hover:opacity-90"
          >
            Make your proposal →
          </Link>
          <Link
            href="/p/ex-rose-proposal"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/60 px-7 py-4 text-base font-semibold text-ink hover:bg-white"
          >
            See it in action
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
          <span>Chat-style reveal</span>
          <span className="text-ink-soft">·</span>
          <span>AI quiz from your story</span>
          <span className="text-ink-soft">·</span>
          <span>Background song</span>
          <span className="text-ink-soft">·</span>
          <span>Reel-style video</span>
          <span className="text-ink-soft">·</span>
          <span>Ready in 5 min</span>
        </div>
      </div>
    </section>
  );
}

function ProposalShowcase() {
  // Mostly-shared journey, with a fork for anonymous vs signed flow.
  // Renders as a single timeline; the fork step splits into two
  // parallel branches that visually rejoin afterward.
  const steps: JourneyStep[] = [
    {
      kind: 'shared',
      tag: 'Moment 01',
      title: 'A soft tap to begin',
      body:
        '“Take a breath. Let it come slowly.” A gentle gate appears — partly so the page feels intentional, partly so the browser allows your song to play with sound. Her tap is the start.',
      highlight: 'Entry gate',
      Visual: VisualEntryGate,
    },
    {
      kind: 'shared',
      tag: 'Moment 02',
      title: 'Your song, exactly where you wanted it',
      body:
        'Paste any YouTube link. Pick the precise second it starts — 1:55 if that\'s where the chorus drops. A speaker pill stays in the corner the whole time so she can mute or bring the song back any time without leaving the page.',
      highlight: 'Background music · custom seek · always-visible mute pill',
      Visual: VisualMusicPill,
    },
    {
      kind: 'shared',
      tag: 'Moment 03',
      title: 'Messages arrive, one breath at a time',
      body:
        'Typing dots. One short line. Another. Then a chapter title slides in and your photos drift across the layout you picked — gently auto-scrolling so she sees them all without lifting a finger.',
      highlight: 'Chat-style reveal · animated photo layouts',
      Visual: VisualChatStream,
    },
    {
      kind: 'fork',
      tag: 'Moment 04',
      title: 'Two ways the story can unfold',
      anon: {
        label: 'Anonymous',
        title: 'She earns your name',
        body:
          'The contact header is blurred the whole time. We generate quiz clues from your story — questions only the real recipient could solve. The moment she gets it right, your name crossfades letter-by-letter into every prior message.',
        highlight: 'AI quiz · blurred header · letter-by-letter name reveal',
        Visual: VisualQuiz,
      },
      signed: {
        label: 'Signed',
        title: 'She knows it\'s you, all along',
        body:
          'Your name shows in the contact header from message one. No quiz, no fork — the story walks straight from chat to letter, signed in your name. Faster, quieter, more intimate.',
        highlight: 'Named contact header · direct path to the letter',
        Visual: VisualNamed,
      },
    },
    {
      kind: 'shared',
      tag: 'Moment 05',
      title: 'A reel of your moments, in her hands',
      body:
        'Up to 5 video clips open as a full-screen vertical reel. Swipe up between them. A collab handle with both your names sits at the bottom, with like / comment / share icons on the right — the language she already knows from Instagram, repurposed for one person.',
      highlight: 'Up to 5 clips · client-side compressed · swipe-up reel',
      Visual: VisualReel,
    },
    {
      kind: 'shared',
      tag: 'Moment 06',
      title: 'The letter takes over',
      body:
        'The chat dissolves into a full-screen italic letter, typed out one character at a time and signed in your name. She picks reactions before closing — hearts, holding-back-tears, sobs — saved to the memory of the moment.',
      highlight: 'AI-written · typewriter reveal · multi-emoji reactions',
      Visual: VisualLetter,
    },
    {
      kind: 'shared',
      tag: 'Moment 07',
      title: 'Tension. Then the question.',
      body:
        '“I don\'t want anything to change. I love how we are now. But I can\'t wait any longer.” Then her name. Then a ready-check. Then the question card slides in — with a “no” button that gracefully skitters around every time she goes near it.',
      highlight: 'Three-beat tension · ready-check gate · dodging "no"',
      Visual: VisualQuestion,
    },
    {
      kind: 'shared',
      tag: 'Moment 08',
      title: 'Yes — and you find out instantly',
      body:
        'Confetti. Her name in the headline, with the moment date underneath. The card shares as a PNG image, not just a link. The same instant she taps yes, you get an email and a WhatsApp — the world is different now.',
      highlight: 'Image share · email + WhatsApp notification',
      Visual: VisualYes,
    },
    {
      kind: 'shared',
      tag: 'Moment 09',
      title: '48 hours, then everything is wiped',
      body:
        'The link works for 48 hours, then photos, video, names, the letter — all gone. Cloudinary destroys the media, the database keeps only anonymous analytics. A privacy guarantee built into the product, not a setting she has to find.',
      highlight: 'Automatic 48h expiry',
      Visual: VisualFaded,
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-black/5 bg-cream-dark/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,116,138,0.12),_transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            The proposal flow
          </div>
          <h2 className="mt-4 font-playfair text-4xl leading-[1.05] text-ink md:text-6xl">
            Not a page she scrolls.
            <br />
            <em className="italic text-rose">A conversation she walks into.</em>
          </h2>
          <p className="mt-5 max-w-xl text-base text-ink-muted md:text-lg">
            Every typing dot, every pause, every chapter — choreographed for
            the one minute that matters. Here&apos;s every beat she lives
            through, in order.
          </p>
        </div>

        <ol className="relative mt-14 ml-2 border-l border-rose/30 pl-6 md:ml-4 md:pl-10">
          {steps.map((step, i) => (
            <JourneyMoment key={step.tag} step={step} index={i} />
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-7 py-4 text-base font-semibold text-white hover:opacity-90"
          >
            Build your proposal →
          </Link>
          <Link
            href="/p/ex-rose-proposal"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/60 px-7 py-4 text-base font-semibold text-ink hover:bg-white"
          >
            Walk through a live one
          </Link>
        </div>
      </div>
    </section>
  );
}

type Branch = {
  label: string;
  title: string;
  body: string;
  highlight: string;
  Visual: () => React.ReactElement;
};

type JourneyStep =
  | {
      kind: 'shared';
      tag: string;
      title: string;
      body: string;
      highlight: string;
      Visual: () => React.ReactElement;
    }
  | {
      kind: 'fork';
      tag: string;
      title: string;
      anon: Branch;
      signed: Branch;
    };

function JourneyMoment({ step, index }: { step: JourneyStep; index: number }) {
  if (step.kind === 'fork') {
    return (
      <li className={`relative ${index === 0 ? 'pt-0' : 'pt-10'} pb-2`}>
        <span
          aria-hidden
          className="absolute -left-[33px] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-rose/40 bg-white text-[11px] font-semibold text-rose shadow-sm md:-left-[51px] md:h-9 md:w-9 md:text-xs"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="mb-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rose">
            {step.tag}
          </div>
          <h3 className="mt-2 font-playfair text-2xl leading-tight text-ink md:text-[28px]">
            {step.title}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-ink-muted">
            The story forks here, depending on whether the sender stays
            anonymous or signs from message one.
          </p>
        </div>

        {/* The actual fork — two branches drawn side-by-side. SVG
            connectors above each one signal "this path begins from the
            shared trunk above." */}
        <div className="grid gap-4 md:grid-cols-2">
          <BranchCard variant="anon" branch={step.anon} />
          <BranchCard variant="signed" branch={step.signed} />
        </div>
        <div className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-rose/70">
          ↓ both paths rejoin here
        </div>
      </li>
    );
  }

  const Visual = step.Visual;
  return (
    <li className={`relative ${index === 0 ? 'pt-0' : 'pt-10'} pb-2`}>
      <span
        aria-hidden
        className="absolute -left-[33px] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-rose/40 bg-white text-[11px] font-semibold text-rose shadow-sm md:-left-[51px] md:h-9 md:w-9 md:text-xs"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md md:flex md:items-stretch">
        <div className="md:order-2 md:w-[42%] md:flex-shrink-0">
          <Visual />
        </div>
        <div className="px-6 py-6 md:order-1 md:flex-1 md:px-8 md:py-7">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rose">
            {step.tag}
          </div>
          <h3 className="mt-2 font-playfair text-2xl leading-tight text-ink md:text-[28px]">
            {step.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
            {step.body}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose/20 bg-rose-soft px-3 py-1.5 text-[11px] font-medium text-rose-deep">
            <span className="h-1.5 w-1.5 rounded-full bg-rose" />
            {step.highlight}
          </div>
        </div>
      </div>
    </li>
  );
}

function BranchCard({
  variant,
  branch,
}: {
  variant: 'anon' | 'signed';
  branch: Branch;
}) {
  const Visual = branch.Visual;
  // Visual divider color shifts subtly between branches so the user
  // can see at a glance "this is the anonymous track" vs "this is
  // the signed track."
  const barColor = variant === 'anon' ? '#c9748a' : '#d4a574';
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: SAKURA.bg2 }}>
        <span
          className="h-1.5 w-6 rounded-full"
          style={{ background: barColor }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: SAKURA.text }}>
          If {branch.label.toLowerCase()}
        </span>
      </div>
      <Visual />
      <div className="px-5 py-5">
        <h4 className="font-playfair text-xl leading-tight text-ink">
          {branch.title}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {branch.body}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose/20 bg-rose-soft px-3 py-1.5 text-[11px] font-medium text-rose-deep">
          <span className="h-1.5 w-1.5 rounded-full bg-rose" />
          {branch.highlight}
        </div>
      </div>
    </div>
  );
}

// Sakura template palette — used across all the visual mocks so the
// marketing previews match how a Sakura-template proposal actually
// looks (the lightest, most pink theme we ship).
const SAKURA = {
  bg: '#fdf2f4',
  bg2: '#f9d9e0',
  accent: '#c9748a',
  accent2: '#d4a574',
  text: '#5a2a38',
  muted: '#a06275',
};

// === Visual mockups for each journey step ============================
// All use the same dark gradient backdrop as the actual receiver flow
// (rose_dark template colors) so the marketing visuals match what the
// sender will actually see when she opens the link.

function VisualFrame({
  children,
  bg = `linear-gradient(165deg, ${SAKURA.bg2}, ${SAKURA.bg})`,
}: {
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <div
      className="relative h-56 w-full overflow-hidden border-y border-black/5 md:h-full md:border-y-0 md:border-l"
      style={{ background: bg }}
    >
      {children}
    </div>
  );
}

function VisualEntryGate() {
  return (
    <VisualFrame>
      <div className="flex h-full flex-col items-center justify-center px-5 text-center">
        <div
          className="text-[34px] leading-none"
          style={{
            color: SAKURA.accent,
            filter: `drop-shadow(0 0 18px ${SAKURA.accent}80)`,
          }}
        >
          ♥
        </div>
        <div
          className="mt-3 font-playfair text-lg italic"
          style={{ color: SAKURA.text }}
        >
          A little something for Priya.
        </div>
        <div
          className="mt-2 font-playfair text-xs italic"
          style={{ color: SAKURA.muted }}
        >
          Take a breath. Let it come slowly.
        </div>
        <div
          className="mt-4 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{
            border: `1px solid ${SAKURA.accent}`,
            background: `${SAKURA.accent}26`,
            color: SAKURA.text,
          }}
        >
          Tap anywhere to begin →
        </div>
      </div>
    </VisualFrame>
  );
}

function VisualMusicPill() {
  return (
    <VisualFrame>
      <div className="flex h-full flex-col items-center justify-center px-5 text-center">
        <div
          className="rounded-2xl px-4 py-3"
          style={{
            border: `1px solid ${SAKURA.accent}30`,
            background: '#ffffffa6',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            className="text-[9px] font-semibold uppercase tracking-[0.25em]"
            style={{ color: SAKURA.accent }}
          >
            Now playing
          </div>
          <div
            className="mt-1 font-playfair text-sm italic"
            style={{ color: SAKURA.text }}
          >
            Perfect — Ed Sheeran
          </div>
          <div
            className="mt-1 text-[10px]"
            style={{ color: SAKURA.muted }}
          >
            starts at 1:55
          </div>
        </div>
        <div
          className="mt-3 text-[10px] uppercase tracking-[0.2em]"
          style={{ color: SAKURA.muted }}
        >
          ↘ persistent mute pill
        </div>
      </div>
      <span
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md"
        style={{
          border: `1px solid ${SAKURA.accent}b3`,
          background: `${SAKURA.accent}33`,
        }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={SAKURA.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      </span>
    </VisualFrame>
  );
}

function VisualChatStream() {
  const bubbleStyle = {
    background: '#ffffffd0',
    border: `1px solid ${SAKURA.accent}1f`,
    color: SAKURA.text,
    backdropFilter: 'blur(6px)',
  };
  return (
    <VisualFrame>
      <div className="flex h-full flex-col justify-end gap-1.5 p-4">
        <div
          className="max-w-[70%] self-start rounded-2xl px-3 py-1.5 text-[12px]"
          style={bubbleStyle}
        >
          Hey Priya
        </div>
        <div
          className="max-w-[80%] self-start rounded-2xl px-3 py-1.5 text-[12px]"
          style={bubbleStyle}
        >
          I&apos;ve been sitting on something for a while…
        </div>
        <div
          className="flex w-12 items-center gap-1 self-start rounded-2xl px-3 py-2.5"
          style={bubbleStyle}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: SAKURA.accent,
                opacity: 0.7,
                animation: `typingBounce 1.2s ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function VisualReel() {
  return (
    <VisualFrame bg="#1a0a12">
      <div className="relative h-full w-full">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 30%, ${SAKURA.accent}55 0%, #1a0a12 70%)`,
          }}
        />
        <div className="absolute left-3 right-3 top-3 flex gap-1">
          {[100, 100, 60, 0, 0].map((fill, i) => (
            <div
              key={i}
              className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full bg-white"
                style={{ width: `${fill}%` }}
              />
            </div>
          ))}
        </div>
        <div className="absolute left-3 top-7 text-[10px] font-bold tracking-wide text-white">
          Reels
        </div>
        <div className="absolute bottom-12 right-3 flex flex-col items-center gap-3 text-white">
          <ReelIcon stroke="#ff3b5c" filled />
          <ReelIcon shape="comment" />
          <ReelIcon shape="share" />
        </div>
        <div className="absolute bottom-3 left-3 right-12">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-9 flex-shrink-0">
              <div
                className="absolute left-0 top-0 h-5 w-5 rounded-full border-2"
                style={{
                  borderColor: '#1a0a12',
                  background: `linear-gradient(135deg, ${SAKURA.accent2}, ${SAKURA.accent})`,
                }}
              />
              <div
                className="absolute left-3 top-0 h-5 w-5 rounded-full border-2"
                style={{
                  borderColor: '#1a0a12',
                  background: `linear-gradient(135deg, ${SAKURA.accent}, ${SAKURA.accent2})`,
                }}
              />
            </div>
            <div className="text-[10px] text-white">
              <div className="font-bold leading-tight">@rahul_priya</div>
              <div className="opacity-70">Rahul &amp; Priya · 42.3K views</div>
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function ReelIcon({
  shape = 'heart',
  stroke = '#fff',
  filled = false,
}: {
  shape?: 'heart' | 'comment' | 'share';
  stroke?: string;
  filled?: boolean;
}) {
  if (shape === 'heart') {
    return (
      <svg width={20} height={20} viewBox="0 0 24 24" fill={filled ? stroke : 'none'} stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  if (shape === 'comment') {
    return (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    );
  }
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function VisualLetter() {
  return (
    <VisualFrame>
      <div className="flex h-full flex-col items-center justify-between px-5 py-5 text-center">
        <div>
          <div
            className="text-[8px] font-semibold uppercase tracking-[0.4em]"
            style={{ color: SAKURA.accent }}
          >
            A letter for you
          </div>
          <div
            className="mt-2 h-px w-6 opacity-60"
            style={{ background: SAKURA.accent }}
          />
        </div>
        <div
          className="font-playfair text-[12px] italic leading-[1.55]"
          style={{ color: SAKURA.text }}
        >
          From the first moment, I knew my heart had found its home in you.
          <span className="inline-block w-px align-middle opacity-60">|</span>
        </div>
        <div className="flex gap-2">
          {['😍', '🥹', '💕', '😭', '🤗'].map((e, i) => (
            <span
              key={i}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[14px]"
              style={
                i === 0
                  ? {
                      background: SAKURA.accent,
                      border: `1px solid ${SAKURA.accent}`,
                      transform: 'scale(1.18)',
                      boxShadow: `0 0 12px ${SAKURA.accent}80`,
                    }
                  : {
                      background: '#ffffffb0',
                      border: `1px solid ${SAKURA.accent}26`,
                    }
              }
            >
              {e}
            </span>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function VisualQuiz() {
  return (
    <VisualFrame>
      <div className="flex h-full flex-col items-center justify-center px-4 text-center">
        <div
          className="mb-1 text-[8px] font-semibold uppercase tracking-[0.35em]"
          style={{ color: SAKURA.accent }}
        >
          Question 1 of 3
        </div>
        <div
          className="mb-3 max-w-[220px] font-playfair text-[12px] italic leading-tight"
          style={{ color: SAKURA.text }}
        >
          When I&apos;m nervous, I usually…
        </div>
        <div className="grid w-full max-w-[220px] grid-cols-2 gap-1.5">
          {['rehearse', 'go quiet', 'joke', 'write it'].map((opt, i) => (
            <div
              key={i}
              className="rounded-md px-2 py-1 text-[9px]"
              style={
                i === 0
                  ? {
                      border: `1px solid ${SAKURA.accent}`,
                      background: `${SAKURA.accent}33`,
                      color: SAKURA.text,
                    }
                  : {
                      border: `1px solid ${SAKURA.accent}26`,
                      background: '#ffffffa6',
                      color: SAKURA.muted,
                    }
              }
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

// Mini-mock for the SIGNED branch — same chat as anon but the contact
// header explicitly shows the sender's name, no quiz, no blur.
function VisualNamed() {
  return (
    <VisualFrame>
      <div className="flex h-full flex-col px-4 py-4">
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{
            background: '#ffffffd0',
            border: `1px solid ${SAKURA.accent}26`,
          }}
        >
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full"
            style={{
              background: `linear-gradient(135deg, ${SAKURA.accent}, ${SAKURA.accent2})`,
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            R
          </span>
          <span
            className="text-[10px] font-semibold"
            style={{ color: SAKURA.text }}
          >
            Rahul
          </span>
          <span
            className="ml-auto text-[8px] uppercase tracking-[0.2em]"
            style={{ color: SAKURA.muted }}
          >
            Online
          </span>
        </div>
        <div className="mt-3 flex flex-1 flex-col justify-end gap-1.5">
          <div
            className="max-w-[80%] self-start rounded-2xl px-3 py-1.5 text-[11px]"
            style={{
              background: '#ffffffd0',
              border: `1px solid ${SAKURA.accent}1f`,
              color: SAKURA.text,
            }}
          >
            Hey Priya
          </div>
          <div
            className="max-w-[80%] self-start rounded-2xl px-3 py-1.5 text-[11px]"
            style={{
              background: '#ffffffd0',
              border: `1px solid ${SAKURA.accent}1f`,
              color: SAKURA.text,
            }}
          >
            I&apos;ve been sitting on something…
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function VisualQuestion() {
  return (
    <VisualFrame>
      <div className="flex h-full flex-col items-center justify-center px-5 text-center">
        <div
          className="text-[9px] italic"
          style={{ color: SAKURA.muted }}
        >
          And so, Priya…
        </div>
        <div
          className="mt-2 font-playfair text-[18px] italic leading-tight"
          style={{ color: SAKURA.text }}
        >
          Will you marry me?
        </div>
        <div
          className="mt-3 h-px w-8 opacity-60"
          style={{ background: SAKURA.accent }}
        />
        <div
          className="mt-3 text-[9px] tracking-[0.2em]"
          style={{ color: SAKURA.muted }}
        >
          — RAHUL
        </div>
        <div
          className="mt-4 rounded-full px-5 py-1.5 text-[10px] font-bold"
          style={{
            background: `linear-gradient(90deg, ${SAKURA.accent}, ${SAKURA.accent2})`,
            color: '#fff',
            boxShadow: `0 0 18px ${SAKURA.accent}66`,
          }}
        >
          Yes, I will! 💍
        </div>
        <div
          className="mt-2 rounded-full px-3 py-1 text-[9px]"
          style={{
            border: `1px solid ${SAKURA.accent}40`,
            background: '#ffffff80',
            color: SAKURA.muted,
            transform: 'translate(36px,-6px) rotate(-6deg)',
          }}
        >
          no
        </div>
      </div>
    </VisualFrame>
  );
}

function VisualYes() {
  return (
    <VisualFrame>
      <div className="flex h-full flex-col items-center justify-center px-5 text-center">
        <div
          className="font-playfair text-[26px] italic leading-tight"
          style={{ color: SAKURA.text }}
        >
          Priya
        </div>
        <div
          className="font-playfair text-[16px] italic leading-tight"
          style={{
            color: SAKURA.accent,
            textShadow: `0 0 18px ${SAKURA.accent}80`,
          }}
        >
          said YES! 💍
        </div>
        <div
          className="mt-2 font-playfair text-[11px] italic"
          style={{ color: SAKURA.accent }}
        >
          Rahul <span className="opacity-50">&amp;</span> Priya
        </div>
        <div
          className="mt-1 text-[8px] tracking-[0.3em]"
          style={{ color: SAKURA.muted }}
        >
          {formatToday()}
        </div>
        <div className="mt-3 flex gap-2">
          <div
            className="rounded-full px-3 py-1 text-[9px] font-bold"
            style={{
              background: `linear-gradient(90deg, ${SAKURA.accent}, ${SAKURA.accent2})`,
              color: '#fff',
            }}
          >
            Share this moment →
          </div>
          <div
            className="rounded-full px-3 py-1 text-[9px]"
            style={{
              border: `1px solid ${SAKURA.accent}40`,
              color: SAKURA.muted,
            }}
          >
            Save as image
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function VisualFaded() {
  return (
    <VisualFrame bg={`linear-gradient(180deg, ${SAKURA.bg2} 0%, #ead7dd 100%)`}>
      <div className="flex h-full flex-col items-center justify-center px-5 text-center">
        <div className="text-[28px]" style={{ color: SAKURA.muted }}>
          ⏳
        </div>
        <div
          className="mt-2 font-playfair text-[16px] italic"
          style={{ color: SAKURA.text }}
        >
          This page has faded.
        </div>
        <div
          className="mt-2 max-w-[220px] text-[10px] leading-relaxed"
          style={{ color: SAKURA.muted }}
        >
          Links live for 48 hours. Photos, video, names, the letter — all
          wiped for privacy.
        </div>
      </div>
    </VisualFrame>
  );
}

function formatToday(): string {
  return new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function ShowcaseCard({
  tag,
  title,
  body,
  children,
}: {
  tag: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-60 overflow-hidden border-b border-black/5 bg-gradient-to-b from-[#2a0e1c] to-[#1a0a12]">
        {children}
      </div>
      <div className="p-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rose">
          {tag}
        </div>
        <div className="mt-2 font-playfair text-xl text-ink">{title}</div>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
      </div>
    </div>
  );
}

function MockChat() {
  return (
    <div className="flex h-full flex-col justify-end gap-2 p-4">
      <MockBubble>Hey Priya</MockBubble>
      <MockBubble>I&apos;ve been sitting on something for a while…</MockBubble>
      <MockTypingDots />
    </div>
  );
}

function MockChapter() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
      <div className="text-[9px] uppercase tracking-[0.35em] text-[#d4a574]">
        Chapter one
      </div>
      <div className="font-playfair text-xl italic text-white">
        Where it all began
      </div>
      <div className="mt-1 h-px w-8 bg-[#d4a574] opacity-60" />
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 w-16 rounded-md bg-gradient-to-br from-[#5a2530] to-[#2a0e1c]"
            style={{
              opacity: 0.85,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MockLetter() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-5 text-center">
      <div className="text-[9px] uppercase tracking-[0.35em] text-[#d4a574]">
        A letter for you
      </div>
      <div className="mt-2 h-px w-8 bg-[#d4a574] opacity-60" />
      <div className="mt-4 max-w-[220px] font-playfair text-[13px] italic leading-[1.55] text-white">
        From the first moment, I knew my heart had found its home in you. Every
        sunrise since has been brighter
        <span className="inline-block w-px align-middle opacity-60">|</span>
      </div>
    </div>
  );
}

function MockBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[85%] self-start rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[13px] text-white backdrop-blur-sm">
      {children}
    </div>
  );
}

function MockTypingDots() {
  return (
    <div className="flex w-14 items-center gap-1 self-start rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-3">
      <span className="h-1.5 w-1.5 rounded-full bg-white/70 [animation:typingBounce_1.2s_0s_infinite]" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/70 [animation:typingBounce_1.2s_0.2s_infinite]" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/70 [animation:typingBounce_1.2s_0.4s_infinite]" />
    </div>
  );
}

function FeatureRow({
  glyph,
  title,
  body,
}: {
  glyph: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-5 rounded-2xl border border-black/5 bg-white p-6">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-rose/30 bg-rose-soft text-lg text-rose">
        {glyph}
      </div>
      <div>
        <div className="font-playfair text-lg text-ink">{title}</div>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
      </div>
    </div>
  );
}

// "What makes it personal" — three large feature cards directly under
// the journey map, calling out the AI-driven and music personalisation
// since those are the hardest things for senders to picture from copy.
function PersonalisedHighlights() {
  return (
    <section className="relative overflow-hidden bg-white">
      <RoseSparkles />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at top, ${SAKURA.bg2} 0%, transparent 60%)`,
          opacity: 0.4,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            What makes it personal
          </div>
          <h2 className="mt-4 font-playfair text-4xl leading-[1.05] text-ink md:text-5xl">
            Built from <em className="italic text-rose">your</em> story.
          </h2>
          <p className="mt-4 max-w-xl text-base text-ink-muted md:text-lg">
            Three things that turn a template into a one-of-one moment —
            the letter, the quiz, the song. All shaped by what you tell us.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <HighlightCard
            eyebrow="AI letter"
            title="A letter only you could have written"
            body="Type the moments that matter — first meeting, inside jokes, the trip, the song you keep replaying. We weave the specific threads into a 4-6 sentence letter in your voice. Cinematic, romantic, or simple — your choice of tone."
            Visual={HighlightLetterVisual}
            tags={['Powered by Gemini', '4-6 sentences', 'Tone-controlled']}
          />
          <HighlightCard
            eyebrow="AI quiz"
            title="Clues only she could solve"
            body="The same story powers the anonymous reveal. We generate 3-clue puzzles or trivia questions that reference the actual specific things from your relationship — places, habits, turning points. Edit anything before it ships."
            Visual={HighlightQuizVisual}
            tags={['Three clue styles', 'Editable before send', 'Story-grounded']}
          />
          <HighlightCard
            eyebrow="Background song"
            title="Scored to her reading"
            body="Paste any YouTube link. Pick the exact second the song begins — 1:55 if that's where the chorus drops. The music fades in the moment she taps to begin and a mute pill stays in the corner the whole way through."
            Visual={HighlightMusicVisual}
            tags={['Any YouTube link', 'Custom seek time', 'Persistent mute pill']}
          />
        </div>
      </div>
    </section>
  );
}

function HighlightCard({
  eyebrow,
  title,
  body,
  Visual,
  tags,
}: {
  eyebrow: string;
  title: string;
  body: string;
  Visual: () => React.ReactElement;
  tags: string[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-rose/15 bg-white shadow-sm">
      <Visual />
      <div className="p-7">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-rose">
          {eyebrow}
        </div>
        <h3 className="mt-2 font-playfair text-xl leading-tight text-ink md:text-2xl">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-rose/15 bg-rose-soft px-2.5 py-1 text-[10px] font-medium text-rose-deep"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HighlightLetterVisual() {
  // Story-input → AI → Letter visualisation. Left side shows what the
  // sender types (story snippets); right side is the generated letter.
  return (
    <div
      className="relative h-56"
      style={{
        background: `linear-gradient(165deg, ${SAKURA.bg2}, ${SAKURA.bg})`,
      }}
    >
      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4">
        <div className="space-y-1.5 text-[10px]" style={{ color: SAKURA.text }}>
          <div className="text-[8px] font-semibold uppercase tracking-[0.2em]" style={{ color: SAKURA.muted }}>
            Your story
          </div>
          <div className="rounded-md px-2 py-1.5" style={{ background: '#ffffffd0', border: `1px solid ${SAKURA.accent}1a` }}>
            We met on the train to Goa
          </div>
          <div className="rounded-md px-2 py-1.5" style={{ background: '#ffffffd0', border: `1px solid ${SAKURA.accent}1a` }}>
            She always laughs at my bad jokes
          </div>
          <div className="rounded-md px-2 py-1.5" style={{ background: '#ffffffd0', border: `1px solid ${SAKURA.accent}1a` }}>
            Our song is one she taught me
          </div>
        </div>
        <div className="text-2xl" style={{ color: SAKURA.accent }}>
          →
        </div>
        <div
          className="rounded-2xl px-3 py-3 font-playfair text-[10px] italic leading-[1.5]"
          style={{
            background: '#ffffffe5',
            border: `1px solid ${SAKURA.accent}33`,
            color: SAKURA.text,
          }}
        >
          From a Goa train to a song you taught me — every one of your
          laughs has been the answer
          <span className="inline-block w-px align-middle opacity-60">|</span>
        </div>
      </div>
    </div>
  );
}

function HighlightQuizVisual() {
  return (
    <div
      className="relative h-56"
      style={{
        background: `linear-gradient(165deg, ${SAKURA.bg2}, ${SAKURA.bg})`,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5">
        <div
          className="text-[8px] font-semibold uppercase tracking-[0.35em]"
          style={{ color: SAKURA.accent }}
        >
          Clue 2 of 3
        </div>
        <div
          className="max-w-[260px] rounded-2xl px-4 py-3 text-center font-playfair text-[12px] italic leading-snug"
          style={{
            background: '#ffffffe5',
            border: `1px solid ${SAKURA.accent}33`,
            color: SAKURA.text,
          }}
        >
          &ldquo;We met somewhere it was raining.&rdquo;
        </div>
        <div className="grid w-full max-w-[260px] grid-cols-2 gap-1.5">
          {['Rohan', 'Rahul', 'Kabir', 'Aryan'].map((name, i) => (
            <div
              key={name}
              className="rounded-md px-2 py-1.5 text-center text-[10px]"
              style={
                i === 1
                  ? {
                      background: SAKURA.accent,
                      color: '#fff',
                      border: `1px solid ${SAKURA.accent}`,
                      fontWeight: 600,
                    }
                  : {
                      background: '#ffffffd0',
                      border: `1px solid ${SAKURA.accent}26`,
                      color: SAKURA.text,
                    }
              }
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HighlightMusicVisual() {
  return (
    <div
      className="relative h-56"
      style={{
        background: `linear-gradient(165deg, ${SAKURA.bg2}, ${SAKURA.bg})`,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-5">
        <div
          className="flex w-full max-w-[260px] items-center gap-3 rounded-2xl px-3 py-3"
          style={{
            background: '#ffffffe5',
            border: `1px solid ${SAKURA.accent}33`,
          }}
        >
          <span
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
            style={{
              background: `linear-gradient(135deg, ${SAKURA.accent}, ${SAKURA.accent2})`,
              color: '#fff',
            }}
          >
            ♪
          </span>
          <div className="min-w-0 flex-1">
            <div
              className="truncate font-playfair text-[12px] italic"
              style={{ color: SAKURA.text }}
            >
              Perfect — Ed Sheeran
            </div>
            <div
              className="text-[9px]"
              style={{ color: SAKURA.muted }}
            >
              Custom start: 1:55
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[9px]" style={{ color: SAKURA.muted }}>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{
              border: `1px solid ${SAKURA.accent}80`,
              background: `${SAKURA.accent}26`,
              color: SAKURA.text,
            }}
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </span>
          <span className="uppercase tracking-[0.2em]">
            Mute pill, always available
          </span>
        </div>
      </div>
    </div>
  );
}

function SecondaryOccasions() {
  // Each banner is a self-contained promo poster. They slide infinitely
  // in the marquee below; the array gets duplicated to make the loop
  // visually seamless. Tone of each banner matches the occasion so the
  // strip reads like a parade of mini-campaigns.
  const banners: PromoBanner[] = [
    {
      eyebrow: 'Birthday',
      title: 'A birthday she\'ll keep talking about',
      subtitle:
        'Cake-day deserves more than a forwarded GIF. A letter, photos, the song you\'ve always called hers.',
      bg: 'linear-gradient(135deg, #f9c74f 0%, #f3722c 100%)',
      text: '#3b1700',
      accent: '#7a3a0a',
      glyph: '🎂',
    },
    {
      eyebrow: 'Valentine\'s week',
      title: 'All seven days, in one link',
      subtitle:
        'Rose Day, Propose Day, Chocolate Day, Teddy Day, Promise Day, Hug Day, Kiss Day. One cinematic page that unfolds for each.',
      bg: 'linear-gradient(135deg, #ff8da1 0%, #ffd1dc 100%)',
      text: '#5a0e1f',
      accent: '#8b1538',
      glyph: '🌹',
    },
    {
      eyebrow: 'Anniversary',
      title: 'A decade in one breath',
      subtitle:
        'First date, first home, fifth year, tenth. A timeline that ends in a letter only the two of you would understand.',
      bg: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
      text: '#1a0e3d',
      accent: '#3d2a8b',
      glyph: '∞',
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-black/5 bg-cream-dark/30">
      <div className="mx-auto max-w-6xl px-5 pt-14 md:px-8 md:pt-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose">
              Also beautiful for
            </div>
            <h2 className="mt-3 font-playfair text-3xl md:text-5xl">
              Every kind of moment that matters.
            </h2>
            <p className="mt-3 max-w-xl text-base text-ink-muted">
              The proposal journey you saw above? It runs for birthdays,
              Valentine&apos;s week, anniversaries, and the random Tuesdays
              too. Same chat-thread cinema, different occasion.
            </p>
          </div>
          <Link
            href="/examples"
            className="hidden flex-shrink-0 text-sm font-semibold text-ink hover:underline md:block"
          >
            See examples →
          </Link>
        </div>
      </div>

      {/* Auto-scrolling promo strip. The track is duplicated so the
          translateX(-50%) animation produces a seamless loop. */}
      <div className="promo-marquee relative mt-10 overflow-hidden pb-14 md:mt-12 md:pb-20">
        {/* Soft edge fades so the banners feather out on both sides
            instead of getting hard-cut by the viewport edge. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-cream-dark/30 to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-cream-dark/30 to-transparent md:w-24" />

        <div
          className="promo-marquee-track flex w-max gap-5 px-5 md:gap-6 md:px-8"
          style={{
            animation: 'promoMarquee 38s linear infinite',
          }}
        >
          {[...banners, ...banners].map((b, i) => (
            <PromoCard key={`${b.eyebrow}-${i}`} banner={b} />
          ))}
        </div>
      </div>
    </section>
  );
}

type PromoBanner = {
  eyebrow: string;
  title: string;
  subtitle: string;
  bg: string;
  text: string;
  accent: string;
  glyph: string;
};

function PromoCard({ banner }: { banner: PromoBanner }) {
  return (
    <div
      className="relative flex h-72 w-[300px] flex-shrink-0 flex-col justify-between overflow-hidden rounded-3xl px-6 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.12)] md:h-80 md:w-[440px] md:px-8 md:py-8"
      style={{ background: banner.bg, color: banner.text }}
    >
      {/* Soft gloss / glyph backdrop in the corner. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-2 select-none text-[140px] leading-none opacity-20 md:text-[180px]"
        style={{ color: banner.accent }}
      >
        {banner.glyph}
      </div>

      <div className="relative">
        <div
          className="text-[10px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: banner.accent }}
        >
          {banner.eyebrow}
        </div>
        <h3 className="mt-3 font-playfair text-2xl italic leading-[1.1] md:text-3xl">
          {banner.title}
        </h3>
        <p
          className="mt-3 max-w-[18rem] text-sm leading-relaxed md:text-base"
          style={{ color: banner.text, opacity: 0.85 }}
        >
          {banner.subtitle}
        </p>
      </div>

      <div className="relative mt-4 flex items-center justify-between">
        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-85 md:text-sm"
          style={{ background: banner.accent, color: '#fff' }}
        >
          Make one →
        </Link>
        <span className="text-3xl md:text-4xl">{banner.glyph}</span>
      </div>
    </div>
  );
}

// Informational section about how templates work — replaces the
// older "card swatch" picker. Templates aren't a feature you pick from
// a grid; they're a *vocabulary* the whole page speaks. This section
// teaches that idea instead of just listing thumbnails.
function Templates() {
  return (
    <section className="relative overflow-hidden border-y border-black/5 bg-white/50">
      <RoseSparkles />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,165,116,0.10),_transparent_55%)]"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose">
              About the templates
            </div>
            <h2 className="mt-3 font-playfair text-3xl leading-tight md:text-5xl">
              Pick a <em className="italic text-rose">mood</em>.
              <br />
              The page paints itself.
            </h2>
            <p className="mt-5 text-base text-ink-muted md:text-lg">
              A template isn&apos;t a skin we slap on at the end. It&apos;s a
              choice that changes the colour of every text bubble, the
              typography of the letter, the particles drifting in the
              background, the glow behind your name on the yes screen.
              Pick the one that feels like the moment — the rest follows.
            </p>

            <div className="mt-8 space-y-4">
              <Bullet
                title="Six palettes, six moods."
                body="Rose Dark for cinematic, Sakura for soft pink, Midnight for cosmic mystery, Ocean for calm, Cinematic for dramatic letterbox, Golden Hour for warm sunset."
              />
              <Bullet
                title="Typography that fits the feeling."
                body="Playful italic Cormorant for Sakura, dramatic Bodoni for Cinematic, Cinzel inscriptions for Midnight. The letter reads in the right voice automatically."
              />
              <Bullet
                title="Particles that match the air."
                body="Roses for Rose Dark, sakura petals for Sakura, stars for Midnight, gold dust for Golden Hour. Drifting in the background the entire reveal."
              />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/examples"
                className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Walk through all six →
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/80 px-6 py-3 text-sm font-semibold text-ink hover:bg-white"
              >
                Pick yours in the wizard
              </Link>
            </div>
          </div>

          {/* Right column: a tight visual list of all six templates as
              colour swatches with one-liners — informational, not a
              swatch picker. Hovering does nothing; this is reference
              material, not an action. */}
          <div className="relative">
            <div className="rounded-3xl border border-black/5 bg-cream-dark/40 p-6 md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-deep">
                The six
              </div>
              <ul className="mt-5 space-y-3">
                {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => (
                  <TemplateListRow key={id} id={id} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bullet({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden
        className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose"
      />
      <div>
        <span className="font-semibold text-ink">{title}</span>{' '}
        <span className="text-ink-muted">{body}</span>
      </div>
    </div>
  );
}

function TemplateListRow({ id }: { id: TemplateId }) {
  const t = TEMPLATES[id];
  return (
    <li className="flex items-center gap-4 rounded-xl bg-white/80 px-4 py-3 transition hover:bg-white">
      {/* Three-stop palette read at a glance — bg, accent, text. */}
      <div className="flex flex-shrink-0 items-center gap-1">
        <span
          className="h-7 w-7 rounded-full border border-black/10"
          style={{
            background: `linear-gradient(135deg, ${t.palette.bg2}, ${t.palette.bg})`,
          }}
        />
        <span
          className="h-7 w-7 -ml-3 rounded-full border-2 border-white shadow-sm"
          style={{ background: t.palette.accent }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-playfair text-base text-ink">{t.name}</span>
          <span className="text-xs text-ink-soft">{t.particle}</span>
        </div>
        <div className="text-xs text-ink-muted">{t.vibe}</div>
      </div>
    </li>
  );
}

function TemplateCard({ id }: { id: TemplateId }) {
  const t = TEMPLATES[id];
  return (
    <div
      className="overflow-hidden rounded-2xl border border-black/5 shadow-sm"
      style={{
        background: `radial-gradient(ellipse at top, ${t.palette.bg2} 0%, ${t.palette.bg} 85%)`,
      }}
    >
      <div className="relative h-64 overflow-hidden p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="absolute opacity-50"
            style={{
              left: `${10 + i * 22}%`,
              top: `${15 + (i % 2) * 55}%`,
              fontSize: 12,
              animation: `particleRise ${5 + i}s linear ${-i}s infinite`,
            }}
          >
            {t.particle}
          </span>
        ))}
        <div className="relative flex h-full flex-col justify-end gap-2">
          <TemplateMockBubble t={t}>Hey Priya</TemplateMockBubble>
          <TemplateMockBubble t={t}>
            Can I show you something?
          </TemplateMockBubble>
          <div
            className="flex w-12 items-center gap-1 self-start rounded-2xl border px-3 py-2.5"
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: t.palette.text,
                  opacity: 0.6,
                  animation: `typingBounce 1.2s ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-black/5 bg-white/90 px-5 py-3 backdrop-blur-sm">
        <div>
          <div className="text-sm font-semibold">{t.name}</div>
          <div className="text-xs text-ink-muted">{t.vibe}</div>
        </div>
        <span
          className="inline-block h-4 w-4 rounded-full border border-black/10"
          style={{ background: t.palette.accent }}
        />
      </div>
    </div>
  );
}

function TemplateMockBubble({
  t,
  children,
}: {
  t: (typeof TEMPLATES)[TemplateId];
  children: React.ReactNode;
}) {
  return (
    <div
      className="max-w-[85%] self-start rounded-2xl border px-3 py-2 text-[12px] leading-snug"
      style={{
        background: 'rgba(255,255,255,0.06)',
        borderColor: 'rgba(255,255,255,0.1)',
        color: t.palette.text,
        fontFamily: t.fonts.body,
        backdropFilter: 'blur(6px)',
      }}
    >
      {children}
    </div>
  );
}

function HowItWorksTeaser() {
  const steps = [
    {
      n: 1,
      title: 'Tell us your story',
      copy: "Their name, your name, the moments that matter. The richer the story, the more personal everything we build.",
      tag: '~ 90 seconds',
      glyph: '✎',
      pillars: ['Names', 'Story', 'Tone'],
    },
    {
      n: 2,
      title: 'Pick the textures',
      copy: 'Template, photo layout, up to 5 video clips, a background song with a custom start time, and an optional anonymous reveal quiz built from your story.',
      tag: '~ 2 minutes',
      glyph: '✦',
      pillars: ['Template', 'Photos & video', 'Music', 'Quiz'],
    },
    {
      n: 3,
      title: 'We compose the moment',
      copy: 'AI-written letter in your voice. Quiz clues only she could solve. Chat thread choreographed beat by beat. One link to share — alive for 48 hours.',
      tag: 'Instant',
      glyph: '♥',
      pillars: ['AI letter', 'AI quiz', 'Shareable link', '48h privacy'],
    },
  ];
  return (
    <section className="relative overflow-hidden bg-cream-dark/30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,116,138,0.10),_transparent_60%)]"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-rose">
              How it works
            </div>
            <h2 className="mt-3 font-playfair text-4xl leading-[1.05] md:text-5xl">
              Three steps. <em className="italic text-rose">Five minutes.</em>
            </h2>
            <p className="mt-4 max-w-xl text-base text-ink-muted">
              Less time than ordering chai. More memorable than dinner.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-rose" />
            <span className="font-semibold uppercase tracking-[0.2em] text-rose-deep">
              Total: ~ 5 min
            </span>
          </div>
        </div>

        {/* Connected step strip with arrows between cards on desktop. */}
        <div className="relative mt-12">
          {/* Hairline connector line behind the cards on desktop. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[10%] right-[10%] top-12 hidden h-px bg-gradient-to-r from-rose/0 via-rose/40 to-rose/0 md:block"
          />
          <div className="relative grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className="relative flex flex-col rounded-3xl border border-rose/15 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Round numeric badge that sits on the connector line. */}
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-deep text-lg font-bold text-white shadow-[0_4px_12px_rgba(139,21,56,0.25)]">
                    {s.n}
                  </span>
                  <span
                    className="text-2xl text-rose"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(201,116,138,0.4))' }}
                  >
                    {s.glyph}
                  </span>
                  <span className="ml-auto rounded-full bg-rose-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-deep">
                    {s.tag}
                  </span>
                </div>
                <div className="mt-5 font-playfair text-2xl text-ink">
                  {s.title}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {s.copy}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {s.pillars.map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-rose/15 bg-rose-soft px-2.5 py-0.5 text-[10px] font-medium text-rose-deep"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Inline arrow between cards on desktop. */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute right-[-22px] top-12 hidden text-2xl text-rose md:block"
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-7 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Start now →
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-rose/30 bg-white/60 px-6 py-3 text-sm font-semibold text-rose-deep hover:bg-white"
          >
            See the full walkthrough
          </Link>
        </div>
      </div>
    </section>
  );
}

// Combined Pricing + Final-CTA section. The pricing cards sit inside the
// same warm pink "ready when you are" frame that used to be a separate
// dark CTA below — so the page closes on a single, unified moment of
// "here's what it costs, here's the button" instead of two thuds.
function PricingAndCTA() {
  return (
    <section className="relative overflow-hidden border-t border-rose/15 bg-gradient-to-br from-rose-soft via-[#fde6ea] to-[#f9d9e0]">
      <RoseSparkles />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,116,138,0.22),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-deep">
            Ready when you are
          </div>
          <h2 className="mx-auto mt-5 max-w-3xl font-playfair text-4xl leading-[1.05] italic text-ink md:text-6xl">
            Make them feel unforgettable. <span className="text-rose">From ₹49.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-ink-muted md:text-lg">
            Two minutes to build. One link to share. Three packages — same
            cinematic chat journey, only the media inside changes.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {(Object.entries(PACKAGES) as [PackageId, (typeof PACKAGES)[PackageId]][]).map(
            ([id, pkg]) => (
              <div
                key={id}
                className={
                  id === 'photos'
                    ? 'relative rounded-2xl border-2 border-rose bg-white p-7 shadow-[0_18px_40px_rgba(201,116,138,0.18)]'
                    : 'rounded-2xl border border-rose/15 bg-white/95 p-7 shadow-sm'
                }
              >
                {id === 'photos' && (
                  <div className="absolute -top-3 left-7 rounded-full bg-rose px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Most loved
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <div className="font-playfair text-4xl">₹{pkg.price}</div>
                  <div className="text-sm text-ink-muted">· {pkg.name}</div>
                </div>
                <p className="mt-2 text-sm text-ink-muted">{pkg.tagline}</p>
                <ul className="mt-5 space-y-2 text-sm text-ink-muted">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-rose">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/create"
                  className={
                    id === 'photos'
                      ? 'mt-6 block rounded-full bg-rose-deep py-3 text-center text-sm font-semibold text-white hover:opacity-90'
                      : 'mt-6 block rounded-full border border-rose/30 py-3 text-center text-sm font-semibold text-rose-deep hover:bg-rose-soft'
                  }
                >
                  Start with {pkg.name}
                </Link>
              </div>
            )
          )}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-rose-deep px-8 py-4 text-base font-semibold text-white shadow-[0_8px_24px_rgba(139,21,56,0.35)] hover:opacity-95"
          >
            Make your proposal →
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold text-rose-deep hover:underline"
          >
            Compare packages →
          </Link>
        </div>
      </div>
    </section>
  );
}
