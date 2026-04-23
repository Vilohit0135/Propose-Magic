'use client';

import { useState } from 'react';
import { CreationFlow } from '@/components/creation/creation-flow';
import type { OrderState } from '@/lib/types';

const INITIAL: OrderState = {
  fromName: '',
  fromGender: 'he',
  toName: '',
  story: '',
  email: '',
  flow: 'propose',
  subFlow: 'marriage',
  tone: 'romantic',
  template: 'rose_dark',
  package: 'basic',
  photos: [],
  photoLayout: 'polaroid',
  videoUrl: null,
  videoTreatment: 'letterbox',
  musicUrl: '',
  musicVideoId: null,
  musicStartSeconds: null,
  scratchIndex: null,
  isAnonymous: false,
  revealStyle: 'three_clues',
  revealDifficulty: 'easy',
  revealContent: null,
};

export function CreationFlowPage() {
  const [state, setState] = useState<OrderState>(INITIAL);
  return (
    <main
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        background: '#fafaf7',
      }}
    >
      <CreationFlow state={state} setState={setState} />
    </main>
  );
}
