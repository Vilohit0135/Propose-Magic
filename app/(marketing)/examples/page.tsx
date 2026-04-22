import Link from 'next/link';
import { EXAMPLES } from '@/lib/examples';
import { TEMPLATES } from '@/lib/tokens';

export const metadata = {
  title: 'Examples — ProposeMagic',
  description: 'Live examples of ProposeMagic journeys across flows, templates, and reveals.',
};

export default function ExamplesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose">Live examples</div>
      <h1 className="mt-3 max-w-3xl font-playfair text-4xl md:text-5xl">
        Six finished journeys. Tap any to play through.
      </h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        Each example is a real receiver page — tap through scenes, send a few hearts, try the
        reveal quiz on the anonymous birthday one.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map((ex) => {
          const t = TEMPLATES[ex.template];
          return (
            <Link
              key={ex.slug}
              href={`/p/${ex.slug}`}
              className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="relative flex h-56 items-center justify-center p-8"
                style={{
                  background: `radial-gradient(ellipse at center, ${t.palette.bg2} 0%, ${t.palette.bg} 100%)`,
                }}
              >
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
                <div
                  className="relative text-center"
                  style={{
                    fontFamily: t.fonts.display,
                    color: t.palette.text,
                    textShadow: `0 0 20px ${t.palette.accent}80`,
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
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <div className="text-sm font-semibold">{ex.label}</div>
                  <div className="text-xs text-ink-muted">{ex.blurb}</div>
                </div>
                <div className="text-sm font-semibold text-rose transition group-hover:translate-x-0.5">
                  Play →
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 rounded-2xl border border-black/10 bg-white p-8 text-center md:p-12">
        <div className="font-playfair text-3xl">Want your own?</div>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          These were built with the same 5-step wizard you can use right now.
        </p>
        <Link
          href="/create"
          className="mt-5 inline-block rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Create yours →
        </Link>
      </div>
    </div>
  );
}
