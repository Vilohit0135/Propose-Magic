'use client';

import React from 'react';
import type { OrderState } from '@/lib/types';
import { Scene5_5Reveal } from '../scenes-5-7';

export function RevealModal({
  state,
  onDone,
}: {
  state: OrderState;
  onDone: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        animation: 'bubbleIn 0.35s both',
      }}
    >
      <Scene5_5Reveal state={state} onTap={onDone} />
    </div>
  );
}
