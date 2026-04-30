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
  fromPhone: '',
  flow: 'propose',
  subFlow: 'marriage',
  tone: 'romantic',
  template: 'rose_dark',
  package: 'basic',
  photos: [],
  photoLayout: 'polaroid',
  videos: [],
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
  // <div> instead of nested <main> — the marketing layout already
  // wraps children in <main>. paddingTop gives breathing room below
  // the sticky nav so the wizard doesn't feel jammed up against it
  // when she opens /create.
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        paddingTop: 32,
      }}
    >
      <CreationFlow state={state} setState={setState} />
    </div>
  );
}
