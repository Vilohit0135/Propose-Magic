import Link from 'next/link';
import { PACKAGES } from '@/lib/tokens';
import type { PackageId } from '@/lib/types';

export const metadata = {
  title: 'Pricing — ProposeMagic',
  description:
    'Three packages. Every one is the full chat-thread proposal — AI letter, anonymous reveal, background music, image-share, 48h privacy wipe.',
};

const COMPARE_ROWS: {
  label: string;
  basic: string;
  photos: string;
  photos_video: string;
}[] = [
  // What every package gets — feature parity on the AI + magic side.
  { label: 'Cinematic chat-thread reveal', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: '6 visual templates', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'AI-written letter (Gemini)', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Five tone choices', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Anonymous reveal — 3 quiz styles', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'AI quiz generated from your story', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Letter-by-letter name reveal', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Background song (any YouTube link)', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Custom song start time', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Persistent mute pill', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Heart-tap + emoji reactions', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Dodging "no" button', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Share-as-PNG image card', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Email + WhatsApp ping on yes', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: '48-hour automatic privacy wipe', basic: '✓', photos: '✓', photos_video: '✓' },
  { label: 'Tinyurl short link delivery', basic: '✓', photos: '✓', photos_video: '✓' },
  // What changes between tiers — the media you can drop in.
  { label: 'Photo upload', basic: '—', photos: 'Up to 10', photos_video: 'Up to 10' },
  { label: '4 photo layouts (slideshow / polaroid / filmstrip / grid)', basic: '—', photos: '✓', photos_video: '✓' },
  { label: 'Auto-drifting photo reveal', basic: '—', photos: '✓', photos_video: '✓' },
  { label: 'Client-side photo compression', basic: '—', photos: '✓', photos_video: '✓' },
  { label: 'Video clips (Instagram-style reel)', basic: '—', photos: '—', photos_video: 'Up to 5 clips' },
  { label: 'Client-side video transcode (~720p)', basic: '—', photos: '—', photos_video: '✓' },
  { label: 'Swipe-up reel navigation', basic: '—', photos: '—', photos_video: '✓' },
  { label: 'Collab handle on reel', basic: '—', photos: '—', photos_video: '✓' },
];

export default function PricingPage() {
  return (
    <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">
        Pricing
      </div>
      <h1 className="mt-3 font-playfair text-4xl leading-[1.05] md:text-5xl">
        Three packages.{' '}
        <em className="italic text-rose">All the magic, regardless.</em>
      </h1>
      <p className="mt-5 max-w-2xl text-base text-ink-muted md:text-lg">
        Every package ships the full cinematic chat journey, the AI letter,
        the anonymous reveal, the background song, the share-card, and the
        48-hour privacy wipe. Pick based on how much media — photos, video
        — you want to bring along for the ride.
      </p>

      {/* === Pricing cards =========================================== */}
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {(Object.entries(PACKAGES) as [PackageId, (typeof PACKAGES)[PackageId]][]).map(
          ([id, pkg]) => (
            <div
              key={id}
              className={
                id === 'photos'
                  ? 'relative rounded-2xl border-2 border-rose bg-white p-7 shadow-[0_18px_40px_rgba(201,116,138,0.18)]'
                  : 'relative rounded-2xl border border-rose/15 bg-white p-7 shadow-sm'
              }
            >
              {id === 'photos' && (
                <div className="absolute -top-3 left-7 rounded-full bg-rose px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Most loved
                </div>
              )}
              <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-deep">
                {pkg.name}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-playfair text-5xl">₹{pkg.price}</span>
                <span className="text-sm text-ink-muted">one-time</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {pkg.tagline}
              </p>
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
                    ? 'mt-7 block rounded-full bg-rose-deep py-3 text-center text-sm font-semibold text-white hover:opacity-90'
                    : 'mt-7 block rounded-full border border-rose/30 py-3 text-center text-sm font-semibold text-rose-deep hover:bg-rose-soft'
                }
              >
                Start with {pkg.name}
              </Link>
            </div>
          )
        )}
      </div>

      {/* === What's always included =================================== */}
      <section className="relative mt-24 overflow-hidden rounded-3xl border border-rose/15 bg-rose-soft/60 p-7 md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,116,138,0.18),transparent_60%)]"
        />
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-deep">
            What every tier gets
          </div>
          <h2 className="mt-3 font-playfair text-2xl md:text-3xl">
            All sixteen <em className="italic text-rose">non-negotiables</em>.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Even the ₹49 basic package opens with a song fade-in, runs the
            chat-thread typewriter, ships the AI letter, supports the
            anonymous quiz reveal, and pings you the moment she says yes.
            Tier choice is purely about the media you upload.
          </p>
          <ul className="mt-6 grid gap-x-6 gap-y-2 text-sm text-ink-muted md:grid-cols-2">
            {[
              'Chat-thread cinematic reveal',
              '6 visual templates',
              'AI letter via Gemini, in your tone',
              'Anonymous reveal (3 quiz styles)',
              'AI quiz generated from your story',
              'Letter-by-letter name reveal',
              'Background song with custom seek',
              'Persistent mute pill in corner',
              'Heart-tap + emoji reactions',
              'Dodging "no" button',
              'Share-as-PNG image card',
              'Email + WhatsApp ping on yes',
              'Tinyurl short link delivery',
              '48h automatic privacy wipe',
              'Mobile-native (380px+)',
              'No account required',
            ].map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-rose">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* === Comparison table ======================================== */}
      <section className="mt-20">
        <h2 className="font-playfair text-2xl md:text-3xl">
          Side-by-side comparison
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Sixteen rows of feature parity, then eight rows of tier-specific
          media. The "Most loved" Photos tier is highlighted in rose.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-rose/15 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose/15 bg-rose-soft/60">
                  <th className="px-5 py-4 text-left font-semibold text-ink">Feature</th>
                  <th className="px-5 py-4 text-center font-semibold text-ink">Basic</th>
                  <th className="px-5 py-4 text-center font-semibold text-rose">Photos</th>
                  <th className="px-5 py-4 text-center font-semibold text-ink">Photos + Video</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r) => (
                  <tr
                    key={r.label}
                    className="border-b border-rose/10 last:border-0"
                  >
                    <td className="px-5 py-3.5 text-ink-muted">{r.label}</td>
                    <td className="px-5 py-3.5 text-center">{r.basic}</td>
                    <td className="px-5 py-3.5 bg-rose-soft/30 text-center">{r.photos}</td>
                    <td className="px-5 py-3.5 text-center">{r.photos_video}</td>
                  </tr>
                ))}
                <tr className="bg-rose-soft/50">
                  <td className="px-5 py-4 font-semibold text-ink">Price</td>
                  <td className="px-5 py-4 text-center font-playfair text-xl">₹49</td>
                  <td className="px-5 py-4 text-center font-playfair text-xl text-rose">₹99</td>
                  <td className="px-5 py-4 text-center font-playfair text-xl">₹199</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing questions live on the FAQ page now — single source of
          truth for everything users ask, organised into categories. */}
      <section className="mt-16 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-playfair text-xl text-ink md:text-2xl">
            More questions about pricing?
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            48-hour expiry, refunds, AI fallback, edits — answered on the FAQ page.
          </p>
        </div>
        <Link
          href="/faq"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-rose/30 bg-white px-5 py-2.5 text-sm font-semibold text-rose-deep hover:bg-rose-soft"
        >
          See FAQ →
        </Link>
      </section>

      {/* === CTA ==================================================== */}
      <section className="relative mt-20 overflow-hidden rounded-2xl border border-rose/15 bg-gradient-to-br from-rose-soft via-[#fde6ea] to-[#f9d9e0] p-10 text-center md:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,116,138,0.18),transparent_60%)]"
        />
        <h2 className="relative font-playfair text-3xl italic text-ink md:text-4xl">
          Pick your tier and start.
        </h2>
        <p className="relative mt-3 text-ink-muted">
          One payment, one link, 48 hours of magic, then quiet.
        </p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/create"
            className="rounded-full bg-rose-deep px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,21,56,0.35)] hover:opacity-90"
          >
            Start now →
          </Link>
          <Link
            href="/services"
            className="rounded-full border border-rose/30 bg-white/70 px-6 py-3 text-sm font-semibold text-rose-deep hover:bg-white"
          >
            Read the details
          </Link>
        </div>
      </section>
    </div>
  );
}
