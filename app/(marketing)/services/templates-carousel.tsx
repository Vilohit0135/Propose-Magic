'use client';

import { useEffect, useRef, useState } from 'react';
import { TEMPLATES } from '@/lib/tokens';
import type { TemplateId } from '@/lib/types';

// Templates with proper informational text — *why* you'd reach for each
// one rather than just a colour swatch. The user navigates with prev/
// next buttons, scroll-snap, or by tapping a dot.

type TemplateMeta = {
  id: TemplateId;
  description: string;
  bestFor: string;
};

const META: TemplateMeta[] = [
  {
    id: 'rose_dark',
    description:
      'The default romantic register. Deep wine background, warm gold accents, drifting roses. Reads as cinematic and grown-up.',
    bestFor: 'A long-anticipated marriage proposal, a tenth anniversary, a confession that\'s been months in the making.',
  },
  {
    id: 'sakura',
    description:
      'Soft pastel pink with creamy gold. Cormorant Garamond italics, sakura petals drifting in. Light and tender — the only template that uses a pale background.',
    bestFor: 'First-love confessions, Valentine\'s week (especially Rose, Teddy, Hug days), gentle anonymous reveals.',
  },
  {
    id: 'midnight',
    description:
      'Deep blue-black, lavender accents, Cinzel inscriptions, drifting stars. Cosmic and theatrical, like the question carries the weight of the universe.',
    bestFor: 'Anniversaries beyond ten years, Cinematic-tone proposals, anonymous reveals with high-drama trivia quizzes.',
  },
  {
    id: 'ocean',
    description:
      'Calm teal-on-navy. Cool, expansive, quietly confident. Lora typography. Particles ripple instead of fall. Reads as steady and eternal rather than urgent.',
    bestFor: 'Decade anniversaries, "we\'re building a life" proposals, partners who hate ornament and love precision.',
  },
  {
    id: 'cinematic',
    description:
      'Letterbox black-and-gold. Bodoni Moda headlines. Heavy, dramatic, screenplay-ish — letter takes over the screen with a deliberate hush.',
    bestFor: 'The "final scene" proposal. Cinematic-tone letters. Pairs beautifully with the photos_video package.',
  },
  {
    id: 'golden_hour',
    description:
      'Sunset coral fading to amber. Cormorant typography with warm gold particles. Reads as nostalgic, sun-soaked, summer-of-our-lives.',
    bestFor: 'First-anniversary proposals, summer engagements, "remember the trip when…" letters.',
  },
];

export function TemplatesCarousel() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Sync the active index with whatever card is currently snapped — so
  // dragging the strip with a touch updates the indicator + caption.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.querySelector('[data-template-card]') as HTMLElement | null;
      if (!card) return;
      const cardWidth = card.offsetWidth + 20; // gap-5
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActive(Math.max(0, Math.min(META.length - 1, idx)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goto = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-template-card]') as HTMLElement | null;
    if (!card) return;
    const cardWidth = card.offsetWidth + 20;
    el.scrollTo({ left: cardWidth * i, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          className="-mx-5 flex gap-5 overflow-x-auto scroll-smooth px-5 pb-4 md:-mx-8 md:px-8"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {META.map((m) => (
            <TemplateCard key={m.id} meta={m} />
          ))}
        </div>

        {/* Prev/next chevrons — desktop only since touch users have
            native swipe + the dots below. */}
        <button
          aria-label="Previous template"
          onClick={() => goto(Math.max(0, active - 1))}
          disabled={active === 0}
          className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-rose/30 bg-white text-rose-deep shadow-md transition hover:bg-rose-soft disabled:opacity-30 md:flex"
        >
          ‹
        </button>
        <button
          aria-label="Next template"
          onClick={() => goto(Math.min(META.length - 1, active + 1))}
          disabled={active === META.length - 1}
          className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-rose/30 bg-white text-rose-deep shadow-md transition hover:bg-rose-soft disabled:opacity-30 md:flex"
        >
          ›
        </button>
      </div>

      {/* Position dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {META.map((m, i) => (
          <button
            key={m.id}
            onClick={() => goto(i)}
            aria-label={`Go to ${TEMPLATES[m.id].name}`}
            className={
              i === active
                ? 'h-2 w-8 rounded-full bg-rose transition-all'
                : 'h-2 w-2 rounded-full bg-rose/30 transition-all hover:bg-rose/50'
            }
          />
        ))}
      </div>
      <div className="mt-3 text-center text-xs uppercase tracking-[0.25em] text-rose-deep">
        {TEMPLATES[META[active].id].name} · {active + 1} / {META.length}
      </div>
    </div>
  );
}

function TemplateCard({ meta }: { meta: TemplateMeta }) {
  const t = TEMPLATES[meta.id];
  return (
    <article
      data-template-card
      className="flex-shrink-0 overflow-hidden rounded-2xl border border-rose/15 bg-white shadow-sm"
      style={{
        scrollSnapAlign: 'start',
        width: 'min(420px, calc(100vw - 40px))',
      }}
    >
      <div
        className="relative h-64 overflow-hidden p-5"
        style={{
          background: `radial-gradient(ellipse at center, ${t.palette.bg2} 0%, ${t.palette.bg} 100%)`,
        }}
      >
        {/* Drifting particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="absolute opacity-60"
            style={{
              left: `${8 + i * 15}%`,
              top: `${10 + (i % 2) * 50}%`,
              fontSize: 16,
              animation: `particleRise ${5 + i}s linear ${-i}s infinite`,
            }}
          >
            {t.particle}
          </span>
        ))}

        {/* Mock chat */}
        <div className="relative flex h-full flex-col justify-end gap-1.5">
          <div
            className="max-w-[80%] self-start rounded-2xl border px-3 py-1.5 text-[12px]"
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: t.palette.text,
              fontFamily: t.fonts.body,
              backdropFilter: 'blur(6px)',
            }}
          >
            Hey Priya
          </div>
          <div
            className="max-w-[85%] self-start rounded-2xl border px-3 py-1.5 text-[12px]"
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: t.palette.text,
              fontFamily: t.fonts.body,
              backdropFilter: 'blur(6px)',
            }}
          >
            Can I show you something?
          </div>
          <div
            className="flex w-12 items-center gap-1 self-start rounded-2xl border px-3 py-2"
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

        {/* Palette swatch row */}
        <div className="absolute right-3 top-3 flex gap-1">
          <span
            className="h-4 w-4 rounded-full border-2 border-white/40"
            style={{ background: t.palette.accent }}
          />
          <span
            className="h-4 w-4 rounded-full border-2 border-white/40"
            style={{ background: t.palette.accent2 }}
          />
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-playfair text-2xl text-ink">{t.name}</h3>
          <span className="text-xs uppercase tracking-[0.2em] text-rose">
            {t.particle}
          </span>
        </div>
        <p className="mt-1 text-xs italic text-ink-soft">{t.vibe}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {meta.description}
        </p>
        <div className="mt-4 rounded-xl bg-rose-soft px-4 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-deep">
            Best for
          </div>
          <p className="mt-1.5 text-sm leading-snug text-rose-deep/80">
            {meta.bestFor}
          </p>
        </div>
      </div>
    </article>
  );
}
