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

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-cream-dark/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div>
          <div className="font-playfair text-2xl italic text-ink">
            Propose<span className="text-rose">Magic</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            AI-powered cinematic pages for proposals, birthdays, Valentine&apos;s, and anniversaries.
            Built in minutes. Lived in forever.
          </p>
          <p className="mt-4 text-xs text-ink-soft">
            Made with <span className="text-rose">♥</span> for India.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink">
              {col.title}
            </div>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-muted hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-black/5">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-5 py-5 text-xs text-ink-soft md:flex-row md:items-center md:px-8">
          <div>© 2026 ProposeMagic · SuperCX Technologies</div>
          <div>proposemagic.in</div>
        </div>
      </div>
    </footer>
  );
}
