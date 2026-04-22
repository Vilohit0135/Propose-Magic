import Link from 'next/link';
import { PACKAGES } from '@/lib/tokens';
import type { PackageId } from '@/lib/types';

export const metadata = {
  title: 'Pricing — ProposeMagic',
  description: 'Three packages. Every one is the full cinematic journey.',
};

const COMPARE_ROWS: { label: string; basic: string; photos: string; photos_video: string }[] = [
  { label: 'Full 7-scene journey', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: '6 visual templates', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'AI-written message', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Gamification layer', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Anonymous quiz reveal', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Photo upload', basic: '—', photos: 'Up to 10', photos_video: 'Up to 10' },
  { label: '4 photo layouts', basic: '—', photos: '✓', photos_video: '✓' },
  { label: 'Scratch-to-reveal photo', basic: '—', photos: '✓', photos_video: '✓' },
  { label: 'Video moments', basic: '—', photos: '—', photos_video: 'Up to 5 clips' },
  { label: '4 video treatments', basic: '—', photos: '—', photos_video: '✓' },
  { label: 'WhatsApp share + email delivery', basic: '✓', photos: '✓', photos_video: '✓' },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">Pricing</div>
      <h1 className="mt-3 font-playfair text-4xl md:text-5xl">
        Priced so you&apos;ll never think twice.
      </h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        Every package is the full 7-scene journey and all 6 templates. Pick based on how much
        media you want to bring along.
      </p>

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
              <div className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
                {pkg.name}
              </div>
              <div className="mt-2 font-playfair text-5xl">₹{pkg.price}</div>
              <p className="mt-2 text-sm text-ink-muted">{pkg.tagline}</p>
              <ul className="mt-6 space-y-2.5 text-sm text-ink-muted">
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
                    ? 'mt-7 block rounded-full bg-ink py-3 text-center text-sm font-semibold text-white hover:opacity-90'
                    : 'mt-7 block rounded-full border border-ink/20 py-3 text-center text-sm font-semibold text-ink hover:border-ink/40'
                }
              >
                Start with {pkg.name}
              </Link>
            </div>
          )
        )}
      </div>

      <section className="mt-20">
        <h2 className="font-playfair text-2xl md:text-3xl">What&apos;s in each package</h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-cream-dark/40">
                <th className="px-5 py-4 text-left font-semibold text-ink">Feature</th>
                <th className="px-5 py-4 text-center font-semibold text-ink">Basic</th>
                <th className="px-5 py-4 text-center font-semibold text-rose">Photos</th>
                <th className="px-5 py-4 text-center font-semibold text-ink">Photos + Video</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((r) => (
                <tr key={r.label} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3.5 text-ink-muted">{r.label}</td>
                  <td className="px-5 py-3.5 text-center">{r.basic}</td>
                  <td className="px-5 py-3.5 text-center">{r.photos}</td>
                  <td className="px-5 py-3.5 text-center">{r.photos_video}</td>
                </tr>
              ))}
              <tr className="bg-cream-dark/30">
                <td className="px-5 py-4 font-semibold text-ink">Price</td>
                <td className="px-5 py-4 text-center font-playfair text-xl">₹49</td>
                <td className="px-5 py-4 text-center font-playfair text-xl text-rose">₹99</td>
                <td className="px-5 py-4 text-center font-playfair text-xl">₹199</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-black/10 bg-cream-dark/30 p-7">
        <h3 className="font-playfair text-xl">Questions about pricing</h3>
        <div className="mt-4 space-y-5 text-sm text-ink-muted">
          <div>
            <div className="font-semibold text-ink">Do I pay per recipient?</div>
            <p>No — one payment, one page, one link. Share it as many times as you want.</p>
          </div>
          <div>
            <div className="font-semibold text-ink">How long is the page live?</div>
            <p>Forever. The link won&apos;t expire.</p>
          </div>
          <div>
            <div className="font-semibold text-ink">Refunds?</div>
            <p>
              If the page fails to generate, we&apos;ll refund automatically. Otherwise, reach us at{' '}
              <a href="mailto:hello@proposemagic.in" className="underline">
                hello@proposemagic.in
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
