'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackMeta } from '@/lib/meta-client';

// Meta (Facebook) Pixel + Conversions API bootstrap. Activates only
// when NEXT_PUBLIC_META_PIXEL_ID is set — empty env → renders nothing.
//
// The inline snippet only does `fbq('init')`. PageView is NOT fired by
// the snippet; instead trackMeta() fires it, which sends it to both
// the browser pixel AND the Conversions API with one shared event_id
// (so the two copies deduplicate). PageView fires:
//   - once on first load — from the Script onReady callback, which is
//     guaranteed to run after the snippet has defined window.fbq
//   - again on every client-side route change — from the effect below
//     (its first run is skipped so the initial view isn't double-sent)

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function MetaPixel() {
  const pathname = usePathname();
  const initialDone = useRef(false);

  useEffect(() => {
    if (!PIXEL_ID) return;
    if (!initialDone.current) {
      // First effect run = initial mount. The initial PageView is
      // handled by the Script onReady callback instead.
      initialDone.current = true;
      return;
    }
    trackMeta('PageView');
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        onReady={() => {
          // fbq exists by now — fire the first PageView through
          // trackMeta so it reaches CAPI too, with an event_id.
          trackMeta('PageView');
        }}
      >
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
