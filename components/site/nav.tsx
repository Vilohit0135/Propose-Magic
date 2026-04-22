'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/examples', label: 'Examples' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="font-playfair text-2xl italic text-ink">
          Propose<span className="text-rose">Magic</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                isActive(l.href)
                  ? 'text-sm font-semibold text-ink'
                  : 'text-sm text-ink-muted hover:text-ink'
              }
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/create"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Create yours →
          </Link>
        </nav>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 md:hidden"
        >
          <span className="text-lg">{open ? '×' : '☰'}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-cream md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={
                  isActive(l.href)
                    ? 'rounded-lg bg-rose-soft px-3 py-2.5 text-sm font-semibold text-ink'
                    : 'rounded-lg px-3 py-2.5 text-sm text-ink-muted hover:bg-black/5'
                }
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/create"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-ink px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Create yours →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
