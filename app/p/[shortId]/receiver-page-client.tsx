'use client';

import React from 'react';
import type { OrderState } from '@/lib/types';
import { ReceiverJourney } from '@/components/journey/receiver-journey';

export function ReceiverPageClient({ state }: { state: OrderState }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        // Pin the whole receiver surface to viewport so messages growing past
        // the fold don't enlarge the page itself — scroll stays inside the
        // chat container. Prevents the mobile address bar from collapsing the
        // layout mid-scroll and keeps position:absolute children from
        // escaping to window scroll.
      }}
    >
      <ReceiverJourney state={state} />
    </div>
  );
}
