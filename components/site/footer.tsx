import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/services', label: 'Services' },
      { href: '/how-it-works', label: 'How it works' },
      { href: '/examples', label: 'Examples' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/create', label: 'Create yours' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/refund', label: 'Refunds' },
    ],
  },
];

const HIGHLIGHTS = [
  'AI-written letter',
  'Background music',
  'AI quiz reveal',
  '48h privacy wipe',
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-rose/20 bg-rose-soft text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,116,138,0.18),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-16 md:px-8 md:pt-20">
        {/* Brand row + nav columns */}
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-block font-playfair text-3xl italic"
            >
              Propose<span className="text-rose">Magic</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              AI-powered cinematic pages for proposals, birthdays,
              Valentine&apos;s, and anniversaries. Built in five minutes.
              Lived in forever.
            </p>

            {/* Feature highlight pills — a quick "what makes it special"
                without forcing the reader through another nav column. */}
            <div className="mt-6 flex flex-wrap gap-2">
              {HIGHLIGHTS.map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-rose/20 bg-white/60 px-3 py-1 text-[11px] font-medium text-rose-deep"
                >
                  {h}
                </span>
              ))}
            </div>

            <Link
              href="/create"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-rose-deep px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(139,21,56,0.3)] hover:opacity-90"
            >
              Make your proposal →
            </Link>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-deep">
                {col.title}
              </div>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-muted transition-colors hover:text-rose-deep"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip — copyright + locale + credit */}
        <div className="mt-14 flex flex-col items-start gap-4 border-t border-rose/15 py-6 text-xs text-ink-soft md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© 2026 ProposeMagic</span>
            <span className="text-rose/60">·</span>
            <span>proposemagic.in</span>
            <span className="text-rose/60">·</span>
            <span className="inline-flex items-center gap-1">
              Made with <span className="text-rose">♥</span> in India
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Crafted by</span>
            <a
              href="https://www.supercx.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-rose-deep/10 px-3 py-1 font-semibold text-rose-deep transition-colors hover:bg-rose-deep/20"
            >
              <span>SuperCX</span>
              {/* <span className="text-[10px]">↗</span> */}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
