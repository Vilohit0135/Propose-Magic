import Link from 'next/link';
import { FLOWS, PACKAGES, TEMPLATES } from '@/lib/tokens';
import type { FlowId, PackageId, TemplateId } from '@/lib/types';
import { RosePetals } from '@/components/site/rose-petals';

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
      <SecondaryOccasions />
      <Templates />
      <HowItWorksTeaser />
      <PricingTeaser />
      <FinalCTA />
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
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-base font-semibold text-white hover:opacity-90"
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
          <span>6 visual templates</span>
          <span className="text-ink-soft">·</span>
          <span>Ready in 5 min</span>
          <span className="text-ink-soft">·</span>
          <span>No account needed</span>
        </div>
      </div>
    </section>
  );
}

function ProposalShowcase() {
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
            the one minute that matters.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <ShowcaseCard
            tag="Moment one"
            title="Messages arrive"
            body="Typing dots. One short line at a time. It feels like a text you weren't expecting — from someone you can't stop thinking about."
          >
            <MockChat />
          </ShowcaseCard>
          <ShowcaseCard
            tag="Moment two"
            title="The memories open"
            body="A chapter title slides in. Photos animate into the layout you picked. The story so far — in the space of a breath."
          >
            <MockChapter />
          </ShowcaseCard>
          <ShowcaseCard
            tag="Moment three"
            title="The letter takes over"
            body="The chat dissolves. A full-screen letter types itself out in front of her, one character at a time, signed in your name."
          >
            <MockLetter />
          </ShowcaseCard>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <FeatureRow
            glyph="♥"
            title="Tension that builds itself"
            body="Three short lines before the question — “I don't want anything to change. I love how we are now. But I can't wait any longer.” She's on the edge of her seat. Then you ask."
          />
          <FeatureRow
            glyph="✧"
            title="An anonymous mode, if you want drama"
            body="Your name blurs out of the contact header. She has to solve a quiz to see who's been writing. The moment it unlocks, your name crossfades in across every prior message."
          />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-base font-semibold text-white hover:opacity-90"
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

function SecondaryOccasions() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose">
              Also beautiful for
            </div>
            <h2 className="mt-3 font-playfair text-2xl md:text-3xl">
              Birthdays, Valentine&apos;s, anniversaries.
            </h2>
            <p className="mt-3 max-w-lg text-sm text-ink-muted">
              The cinematic scene journey you know — photos, AI letter,
              gamification, the yes moment.
            </p>
          </div>
          <Link
            href="/examples"
            className="hidden text-sm font-semibold text-ink hover:underline md:block"
          >
            See all examples →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {SECONDARY_FLOWS.map((flow) => {
            const f = FLOWS[flow];
            return (
              <div
                key={flow}
                className="flex items-center gap-4 rounded-2xl border border-black/5 bg-cream p-5 transition hover:border-rose/40"
              >
                <div className="text-3xl">{f.icon}</div>
                <div className="min-w-0">
                  <div className="font-playfair text-lg">{f.name}</div>
                  <div className="text-xs text-ink-soft">
                    {Object.keys(f.subFlows).length} sub-flow
                    {Object.keys(f.subFlows).length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Templates() {
  return (
    <section className="border-y border-black/5 bg-white/50">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose">
            6 visual templates
          </div>
          <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
            A palette for every kind of love.
          </h2>
          <p className="mt-3 text-ink-muted">
            From moody rose to cosmic midnight to Japanese sakura. Pick the mood
            that matches yours — your message, photos, and pacing flow through it.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {FEATURED_TEMPLATES.map((id) => (
            <TemplateCard key={id} id={id} />
          ))}
        </div>
        <div className="mt-6 text-sm">
          <Link
            href="/examples"
            className="font-semibold text-ink hover:underline"
          >
            See all 6 templates live →
          </Link>
        </div>
      </div>
    </section>
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
      title: 'Tell us who & why',
      copy: 'Their name, your name, a sentence of your story.',
    },
    {
      n: 2,
      title: 'Pick a vibe',
      copy: 'Template, tone, photos, video moments, optional anonymous reveal.',
    },
    {
      n: 3,
      title: 'We build the conversation',
      copy: 'AI-written letter. Chat thread choreographed beat by beat. One link to share.',
    },
  ];
  return (
    <section className="bg-cream-dark/30">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose">
            How it works
          </div>
          <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
            Three steps, five minutes.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-black/5 bg-white p-7"
            >
              <div className="font-playfair text-5xl italic text-rose">{s.n}</div>
              <div className="mt-4 font-semibold">{s.title}</div>
              <p className="mt-2 text-sm text-ink-muted">{s.copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/how-it-works"
            className="text-sm font-semibold text-ink hover:underline"
          >
            See the full walkthrough →
          </Link>
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  return (
    <section className="border-t border-black/5">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose">
              Pricing
            </div>
            <h2 className="mt-3 font-playfair text-3xl md:text-4xl">
              From forty-nine rupees.
            </h2>
            <p className="mt-3 max-w-md text-ink-muted">
              Every package ships the full chat-thread proposal experience.
              Richer packages add photos and video moments.
            </p>
          </div>
          <Link
            href="/pricing"
            className="text-sm font-semibold text-ink hover:underline"
          >
            Compare packages →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {(Object.entries(PACKAGES) as [PackageId, (typeof PACKAGES)[PackageId]][]).map(
            ([id, pkg]) => (
              <div
                key={id}
                className={
                  id === 'photos'
                    ? 'relative rounded-2xl border-2 border-rose bg-white p-7 shadow-md'
                    : 'rounded-2xl border border-black/10 bg-white p-7'
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
                      ? 'mt-6 block rounded-full bg-ink py-3 text-center text-sm font-semibold text-white hover:opacity-90'
                      : 'mt-6 block rounded-full border border-ink/20 py-3 text-center text-sm font-semibold text-ink hover:border-ink/40'
                  }
                >
                  Start with {pkg.name}
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#1a0a12] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,165,116,0.28),_transparent_65%)]" />
      <div className="relative mx-auto max-w-4xl px-5 py-20 text-center md:px-8 md:py-28">
        <div className="text-xs uppercase tracking-[0.3em] text-[#c9a2a0]">
          Ready when you are
        </div>
        <h2 className="mt-5 font-playfair text-4xl italic md:text-6xl">
          Make them feel unforgettable.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[#c9a2a0]">
          Two minutes to build. One link to share. A conversation they&apos;ll
          remember for the rest of their life.
        </p>
        <div className="mt-8">
          <Link
            href="/create"
            className="inline-block rounded-full bg-gradient-to-r from-[#d4a574] to-[#f4c6a8] px-8 py-4 text-base font-semibold text-[#1a0a12] shadow-[0_0_30px_rgba(212,165,116,0.35)] hover:opacity-95"
          >
            Make your proposal →
          </Link>
        </div>
      </div>
    </section>
  );
}
