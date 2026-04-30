import { Nav } from '@/components/site/nav';
import { Footer } from '@/components/site/footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // NOTE: no `overflow-hidden` on this outer div — that's what
    // breaks `position: sticky` on the nav. The ambient backdrop below
    // is bounded by `inset-x-0` so it can't cause horizontal scroll
    // anyway, and pages that need their own clipping (showcase,
    // marquee, etc.) handle it inside their own sections.
    <div className="relative flex min-h-dvh flex-col bg-cream text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[640px] bg-[radial-gradient(ellipse_at_top,rgba(201,116,138,0.18),transparent_70%)]"
      />
      <Nav />
      <main className="relative flex-1">{children}</main>
      <Footer />
    </div>
  );
}
