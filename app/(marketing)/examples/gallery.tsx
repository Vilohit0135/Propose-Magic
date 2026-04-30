'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { EXAMPLES } from '@/lib/examples';
import { TEMPLATES } from '@/lib/tokens';
import type { FlowId } from '@/lib/types';

// All client-side: filter chips, shuffle, hover-reveal animations.
// Putting this in a separate "use client" file keeps the parent page
// a server component (better metadata, no extra hydration cost).

type FilterId = 'all' | FlowId;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'propose', label: 'Proposals' },
  { id: 'birthday', label: 'Birthdays' },
  { id: 'valentines', label: "Valentine's" },
  { id: 'anniversary', label: 'Anniversaries' },
];

export function ExamplesGallery() {
  const [filter, setFilter] = useState<FilterId>('all');
  const [hovered, setHovered] = useState<string | null>(null);
  const [seed, setSeed] = useState(0);

  // Apply filter, then shuffle if the user has hit "Surprise me".
  const filtered = useMemo(() => {
    const matching =
      filter === 'all' ? EXAMPLES : EXAMPLES.filter((e) => e.state.flow === filter);
    if (seed === 0) return matching;
    return [...matching].sort((a, b) => {
      const ah = hashSeed(a.slug, seed);
      const bh = hashSeed(b.slug, seed);
      return ah - bh;
    });
  }, [filter, seed]);

  return (
    <>
      {/* Filter pills + shuffle button — sticky so they stay visible
          when the gallery scrolls past on mobile. */}
      <div className="sticky top-20 z-20 -mx-5 mt-10 flex flex-wrap items-center gap-2 border-y border-black/5 bg-cream/85 px-5 py-3 backdrop-blur md:-mx-8 md:px-8">
        {FILTERS.map((f) => {
          const count =
            f.id === 'all'
              ? EXAMPLES.length
              : EXAMPLES.filter((e) => e.state.flow === f.id).length;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={
                active
                  ? 'rounded-full bg-rose-deep px-4 py-1.5 text-xs font-semibold text-white'
                  : 'rounded-full border border-ink/15 bg-white/70 px-4 py-1.5 text-xs font-medium text-ink-muted hover:border-rose/40 hover:text-ink'
              }
            >
              {f.label}
              <span className="ml-1.5 text-[10px] opacity-60">{count}</span>
            </button>
          );
        })}
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="ml-auto rounded-full border border-rose/30 bg-rose-soft px-4 py-1.5 text-xs font-semibold text-rose-deep hover:bg-rose-soft/70"
        >
          ✦ Surprise me
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-black/15 bg-white/60 p-12 text-center text-sm text-ink-muted">
          No examples in this category yet — try another filter or hit{' '}
          <span className="font-semibold text-rose">Surprise me</span>.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => {
            const t = TEMPLATES[ex.template];
            const isHovered = hovered === ex.slug;
            return (
              <Link
                key={ex.slug}
                href={`/p/${ex.slug}`}
                onMouseEnter={() => setHovered(ex.slug)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(ex.slug)}
                onBlur={() => setHovered(null)}
                className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="relative flex h-60 items-center justify-center overflow-hidden p-8"
                  style={{
                    background: `radial-gradient(ellipse at center, ${t.palette.bg2} 0%, ${t.palette.bg} 100%)`,
                  }}
                >
                  {/* Drifting particles — tied to template */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute opacity-60"
                      style={{
                        left: `${10 + i * 17}%`,
                        top: `${15 + (i % 2) * 45}%`,
                        fontSize: 14,
                        animation: `particleRise ${5 + i}s linear ${-i}s infinite`,
                      }}
                    >
                      {t.particle}
                    </span>
                  ))}

                  {/* Default state: cinematic title card. */}
                  <div
                    className="relative text-center transition-opacity duration-500"
                    style={{
                      fontFamily: t.fonts.display,
                      color: t.palette.text,
                      textShadow: `0 0 20px ${t.palette.accent}80`,
                      opacity: isHovered ? 0 : 1,
                    }}
                  >
                    <div
                      className="text-[10px] uppercase tracking-[0.3em]"
                      style={{ color: t.palette.muted }}
                    >
                      A journey for
                    </div>
                    <div
                      className="mt-2 font-playfair text-3xl italic"
                      style={{ color: t.palette.accent }}
                    >
                      {ex.state.toName}
                    </div>
                    <div
                      className="mt-2 text-[10px] uppercase tracking-[0.3em]"
                      style={{ color: t.palette.muted }}
                    >
                      from {ex.state.isAnonymous ? 'someone special' : ex.state.fromName}
                    </div>
                  </div>

                  {/* Hover state: live chat preview. Slides up from
                      the bottom and animates typing dots so the user
                      sees what the page actually feels like. */}
                  <div
                    className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 transition-all duration-500"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
                    }}
                  >
                    <div
                      className="max-w-[80%] self-start rounded-2xl border px-3 py-1.5 text-[12px] backdrop-blur-sm"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        borderColor: 'rgba(255,255,255,0.15)',
                        color: t.palette.text,
                      }}
                    >
                      Hey {ex.state.toName.split(/\s+/)[0]}
                    </div>
                    <div
                      className="max-w-[85%] self-start rounded-2xl border px-3 py-1.5 text-[12px] backdrop-blur-sm"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        borderColor: 'rgba(255,255,255,0.15)',
                        color: t.palette.text,
                      }}
                    >
                      Can I show you something?
                    </div>
                    <div
                      className="flex w-12 items-center gap-1 self-start rounded-2xl border px-3 py-2.5"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        borderColor: 'rgba(255,255,255,0.15)',
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: t.palette.text,
                            opacity: 0.7,
                            animation: `typingBounce 1.2s ${i * 0.2}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Anonymous + tone badges */}
                  <div className="absolute right-3 top-3 flex flex-wrap items-center gap-1">
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                      style={{
                        background: 'rgba(0,0,0,0.45)',
                        color: '#fff',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {ex.state.tone}
                    </span>
                    {ex.state.isAnonymous && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                        style={{
                          background: 'rgba(255,255,255,0.18)',
                          color: '#fff',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        ✦ anon
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <div className="text-sm font-semibold">{ex.label}</div>
                    <div className="text-xs text-ink-muted">{ex.blurb}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-rose transition group-hover:translate-x-1">
                    Play →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-16 rounded-2xl border border-black/10 bg-white p-8 text-center md:p-12">
        <div className="font-playfair text-3xl">Want your own?</div>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          These were built with the same 5-step wizard you can use right now.
        </p>
        <Link
          href="/create"
          className="mt-5 inline-block rounded-full bg-rose-deep px-7 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Create yours →
        </Link>
      </div>
    </>
  );
}

function hashSeed(slug: string, seed: number): number {
  let h = seed;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}
