import Link from 'next/link';
import { FLOWS, PACKAGES, TEMPLATES } from '@/lib/tokens';
import type { FlowId, PackageId, TemplateId } from '@/lib/types';

export const metadata = {
  title: 'Services — ProposeMagic',
  description:
    'What ProposeMagic builds for you — cinematic pages for proposals, birthdays, Valentine\'s, and anniversaries.',
};

const FLOW_COPY: Record<FlowId, { tagline: string; body: string }> = {
  propose: {
    tagline: 'For the moment you\'ve been rehearsing in your head for months.',
    body: 'Two sub-flows — a named marriage proposal or an anonymous love proposal with a reveal quiz. Cinematic letter-by-letter typewriter. A yes button that pulses. A "No" button that dodges three times before vanishing.',
  },
  birthday: {
    tagline: 'Make the one you can\'t stop thinking of feel picked-out.',
    body: 'Named or anonymous. An anonymous birthday uses the same reveal mechanic as a Love Proposal — three-clue, trivia, or sensory quiz before the "make a wish" button.',
  },
  valentines: {
    tagline: 'All eight days — from Rose Day to Valentine\'s Day.',
    body: 'One sub-flow for each day of the Valentine\'s week: rose, propose, chocolate, teddy, promise, hug, kiss, V-day. Each gets its own question and particle.',
  },
  anniversary: {
    tagline: 'One year, three, five, ten, twenty-five, fifty.',
    body: 'Six milestone sub-flows. Ocean for cool decades, golden hour for warm firsts, midnight for tenths — any template works, but some just land.',
  },
};

const REVEALS = [
  {
    title: 'Three Clues',
    body: 'You write three one-line hints. They read each, then pick from four names. Your name is always one of them.',
  },
  {
    title: 'Trivia Quiz',
    body: 'Three multiple-choice questions only they\'d know the answer to. Each correct answer reveals more of your name, letter by letter.',
  },
  {
    title: 'Sensory Unlock',
    body: 'Pick a colour. Pick a song. Pick a memory. No wrong answers — your name appears as they tap through.',
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">Services</div>
      <h1 className="mt-3 max-w-3xl font-playfair text-4xl md:text-6xl">
        One service, shaped for every kind of moment.
      </h1>
      <p className="mt-5 max-w-xl text-ink-muted">
        Every page we build is the full 7-scene cinematic journey — opening, memories, letter,
        question, yes. What changes is the occasion, the voice, the visuals, and what&apos;s in
        between.
      </p>

      {/* Occasions */}
      <section className="mt-16">
        <div className="text-xs font-semibold uppercase tracking-wider text-rose">
          Four occasions
        </div>
        <h2 className="mt-2 font-playfair text-3xl md:text-4xl">What we build pages for.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {(Object.entries(FLOWS) as [FlowId, (typeof FLOWS)[FlowId]][]).map(([id, f]) => (
            <div
              key={id}
              className="rounded-2xl border border-black/10 bg-white p-7"
            >
              <div className="flex items-start justify-between">
                <div className="text-5xl">{f.icon}</div>
                <div className="rounded-full bg-cream-dark/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  {Object.keys(f.subFlows).length} sub-flow
                  {Object.keys(f.subFlows).length > 1 ? 's' : ''}
                </div>
              </div>
              <div className="mt-5 font-playfair text-2xl">{f.name}</div>
              <div className="mt-1 text-sm italic text-ink-muted">{FLOW_COPY[id].tagline}</div>
              <p className="mt-4 text-sm text-ink-muted">{FLOW_COPY[id].body}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {Object.entries(f.subFlows)
                  .slice(0, 4)
                  .map(([sfId, sf]) => (
                    <span
                      key={sfId}
                      className="rounded-full border border-black/10 bg-cream-dark/30 px-3 py-1 text-[11px] text-ink-muted"
                    >
                      {sf.particle} {sf.name}
                    </span>
                  ))}
                {Object.keys(f.subFlows).length > 4 && (
                  <span className="rounded-full px-3 py-1 text-[11px] text-ink-soft">
                    +{Object.keys(f.subFlows).length - 4} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="mt-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-rose">
          Three packages
        </div>
        <h2 className="mt-2 font-playfair text-3xl md:text-4xl">Pick based on the media.</h2>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Every package is the full 7-scene journey. The differences are what shows up inside the
          scenes.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {(Object.entries(PACKAGES) as [PackageId, (typeof PACKAGES)[PackageId]][]).map(
            ([id, pkg]) => (
              <div
                key={id}
                className="rounded-2xl border border-black/10 bg-white p-7"
              >
                <div className="flex items-baseline gap-2">
                  <div className="font-playfair text-3xl">₹{pkg.price}</div>
                  <div className="text-sm text-ink-muted">· {pkg.name}</div>
                </div>
                <p className="mt-2 text-sm text-ink-muted">{pkg.tagline}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-rose">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
        <div className="mt-6 text-sm">
          <Link href="/pricing" className="font-semibold text-ink hover:underline">
            Full package comparison →
          </Link>
        </div>
      </section>

      {/* Templates */}
      <section className="mt-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-rose">
          Six visual templates
        </div>
        <h2 className="mt-2 font-playfair text-3xl md:text-4xl">A palette for every mood.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(TEMPLATES) as [TemplateId, (typeof TEMPLATES)[TemplateId]][]).map(
            ([id, t]) => (
              <div
                key={id}
                className="overflow-hidden rounded-2xl border border-black/10 bg-white"
              >
                <div
                  className="relative h-36"
                  style={{
                    background: `radial-gradient(ellipse at center, ${t.palette.bg2} 0%, ${t.palette.bg} 100%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center font-playfair italic"
                    style={{
                      color: t.palette.accent,
                      textShadow: `0 0 16px ${t.palette.accent}80`,
                      fontSize: 28,
                    }}
                  >
                    {t.particle}
                  </div>
                </div>
                <div className="px-5 py-3">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-ink-muted">{t.vibe}</div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Reveal mechanics */}
      <section className="mt-20">
        <div className="text-xs font-semibold uppercase tracking-wider text-rose">
          Anonymous reveal (optional)
        </div>
        <h2 className="mt-2 font-playfair text-3xl md:text-4xl">
          Hide your name behind a small puzzle.
        </h2>
        <p className="mt-3 max-w-2xl text-ink-muted">
          For Love Proposals and Anonymous Birthdays, you can keep yourself hidden until they
          solve a tiny quiz. Your name reveals cinematically — letter by letter — before the big
          question.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {REVEALS.map((r) => (
            <div key={r.title} className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="font-semibold">{r.title}</div>
              <p className="mt-2 text-sm text-ink-muted">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 rounded-2xl border border-black/10 bg-[#1a0a12] p-10 text-center text-white md:p-16">
        <h2 className="font-playfair text-3xl italic md:text-4xl">Pick yours.</h2>
        <p className="mt-3 text-[#c9a2a0]">
          Five minutes from here to a link you can text them.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/create"
            className="rounded-full bg-gradient-to-r from-[#d4a574] to-[#f4c6a8] px-6 py-3 text-sm font-semibold text-[#1a0a12]"
          >
            Start building →
          </Link>
          <Link
            href="/examples"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
          >
            See live examples
          </Link>
        </div>
      </section>
    </div>
  );
}
