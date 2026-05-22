import { Nav } from '@/components/site/nav';
import { Footer } from '@/components/site/footer';
import { MetaPixel } from '@/components/site/meta-pixel';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // NOTE: no `overflow-hidden` on this outer div — that's what
    // breaks `position: sticky` on the nav.
    //
    // The previous version had an ambient pink-radial backdrop at the
    // top (h-640px), which gave every marketing page a subtle pink
    // tint behind the navbar. That tint stopped where pages started
    // their own opaque background, producing a visible horizontal seam
    // right under the floating nav pill. Removed so the navbar area
    // and the page below share one continuous color. The home Hero
    // section still applies its own pink radial inside its own
    // boundary, so the warm welcome tint is preserved where it counts.
    <div className="relative flex min-h-dvh flex-col bg-cream text-ink">
      {/* Meta Pixel scoped to the marketing layout — covers the whole
          funnel (landing, pricing, /create, checkout) but NOT the
          private /p/[shortId] receiver pages, which live outside this
          layout and shouldn't be ad-tracked. */}
      <MetaPixel />
      <Nav />
      <main className="relative flex-1">{children}</main>
      <Footer />
    </div>
  );
}
