'use client';

import React from 'react';
import type { OrderState } from '@/lib/types';
import { ReceiverJourney } from '@/components/journey/receiver-journey';

export function ReceiverPageClient({ state }: { state: OrderState }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        overflow: 'hidden',
      }}
    >
      <ReceiverJourney state={state} />
    </div>
  );
}
