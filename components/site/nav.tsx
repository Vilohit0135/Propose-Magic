'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// "Home" + "Create" lead the order; remaining links follow as a quieter
// secondary group. Putting Create up front matches the user's primary
// intent on the marketing site (build a proposal, fast).
const PRIMARY_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/create', label: 'Create' },
];

const SECONDARY_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/examples', label: 'Examples' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header className="sticky top-3 z-40 px-2 md:top-4 md:px-3">
      <div
        className={[
          'relative mx-auto flex max-w-7xl items-center justify-between overflow-hidden',
          'rounded-full border border-rose/25 bg-rose-soft/90 px-4 py-2.5 md:px-7 md:py-3',
          'shadow-[0_8px_24px_rgba(201,116,138,0.18)] backdrop-blur-md',
        ].join(' ')}
      >
        {/* Subtle drifting micro-petals inside the pill — same visual
            language as the hero RosePetals, scaled way down so it reads
            as ambient sparkle rather than a busy effect. */}
        <NavPetals />

        <Link
          href="/"
          className="relative z-10 font-playfair text-xl italic text-ink md:text-2xl"
        >
          Propose<span className="text-rose">Magic</span>
        </Link>

        <nav className="relative z-10 hidden items-center gap-1 md:flex">
          {[...PRIMARY_LINKS, ...SECONDARY_LINKS].map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  'rounded-full px-3.5 py-1.5 text-sm transition-colors',
                  active
                    ? // Active = dark pink fill, white text, soft glow.
                      'bg-rose-deep text-white shadow-[0_4px_14px_rgba(139,21,56,0.35)]'
                    : 'text-ink-muted hover:bg-white/60 hover:text-ink',
                ].join(' ')}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/create"
            className="ml-2 rounded-full bg-rose-deep px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(139,21,56,0.3)] hover:opacity-90"
          >
            Create yours →
          </Link>
        </nav>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-rose/30 bg-white/80 text-ink md:hidden"
        >
          <span className="text-base">{open ? '×' : '☰'}</span>
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-rose/25 bg-rose-soft/95 p-3 shadow-lg backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1">
            {[...PRIMARY_LINKS, ...SECONDARY_LINKS].map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={
                    active
                      ? 'rounded-full bg-rose-deep px-4 py-2.5 text-sm font-semibold text-white shadow-sm'
                      : 'rounded-full px-4 py-2.5 text-sm text-ink-muted hover:bg-white/60'
                  }
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/create"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-rose-deep px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_4px_14px_rgba(139,21,56,0.3)]"
            >
              Create yours →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// Tiny drifting petals inside the nav pill — same visual idea as the
// hero RosePetals, but at a much smaller scale and with a horizontal
// drift so they live within the pill's height. Pure decoration; no
// interaction surface (`pointer-events-none`).
function NavPetals() {
  // Petals fly across the pill from left to right. Staggered start
  // delays keep the stream continuous; varied vertical positions and
  // durations stop the motion from looking like a march.
  const petals = [
    { top: '24%', size: 7, dur: '18s', delay: '0s', fill: '#c9748a', opacity: 0.55 },
    { top: '58%', size: 5, dur: '22s', delay: '-3s', fill: '#e8a6b4', opacity: 0.5 },
    { top: '34%', size: 8, dur: '20s', delay: '-7s', fill: '#d4a574', opacity: 0.6 },
    { top: '64%', size: 6, dur: '24s', delay: '-12s', fill: '#c9748a', opacity: 0.5 },
    { top: '20%', size: 5, dur: '19s', delay: '-15s', fill: '#e8a6b4', opacity: 0.45 },
    { top: '50%', size: 7, dur: '23s', delay: '-19s', fill: '#d4a574', opacity: 0.55 },
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {petals.map((p, i) => {
        const style: React.CSSProperties = {
          left: 0,
          top: p.top,
          width: p.size,
          height: Math.round(p.size * 1.2),
          animation: `navPetalDrift ${p.dur} linear ${p.delay} infinite`,
        };
        // CSS custom property feeds the keyframe's opacity stops so the
        // fade-in / fade-out at the edges respects per-petal opacity.
        (style as Record<string, string>)['--nav-petal-opacity'] = String(p.opacity);
        return (
          <span key={i} className="absolute" style={style}>
            <svg width="100%" height="100%" viewBox="0 0 20 24" fill="none">
              <path
                d="M10 0 C4 5 2 11 3 16 C4 20 6 23 10 23 C14 23 16 20 17 16 C18 11 16 5 10 0 Z"
                fill={p.fill}
              />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
