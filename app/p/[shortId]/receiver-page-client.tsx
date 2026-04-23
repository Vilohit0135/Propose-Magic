'use client';

import React from 'react';
import type { OrderState } from '@/lib/types';
import { ReceiverJourney } from '@/components/journey/receiver-journey';

export function ReceiverPageClient({ state }: { state: OrderState }) {
  const hasMusic = !!state.musicVideoId;
  return (
    <>
      {/* React 19 hoists these into <head> during SSR so the DNS/TCP/TLS
          handshakes to YouTube's CDNs are already done by the time the
          <BackgroundMusic> iframe starts fetching its embed HTML. Shaves
          200-500ms off the "song starts" delay on cold loads. */}
      {hasMusic && (
        <>
          <link rel="preconnect" href="https://www.youtube.com" />
          <link rel="preconnect" href="https://i.ytimg.com" />
          <link rel="preconnect" href="https://s.ytimg.com" />
          <link rel="dns-prefetch" href="https://googlevideo.com" />
        </>
      )}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        <ReceiverJourney state={state} />
      </div>
    </>
  );
}
