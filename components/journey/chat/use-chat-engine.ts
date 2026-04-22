'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage, ChatSection } from './script';

export type EnginePhase = 'typing' | 'gap' | 'locked' | 'complete';

export type EngineState = {
  shownCount: number;
  phase: EnginePhase;
  currentSection: ChatSection;
};

const REDUCED_TYPING = 200;
const REDUCED_GAP = 400;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function useChatEngine(messages: ChatMessage[], paused: boolean) {
  const [shownCount, setShownCount] = useState(0);
  const [phase, setPhase] = useState<EnginePhase>(
    messages.length === 0 ? 'complete' : 'typing',
  );
  const [reduced] = useState<boolean>(() => prefersReducedMotion());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (paused) return;
    if (phase === 'complete' || phase === 'locked') return;

    if (phase === 'typing') {
      const nextMsg = messages[shownCount];
      if (!nextMsg) {
        setPhase('complete');
        return;
      }
      const delay = reduced ? REDUCED_TYPING : nextMsg.typingMs;
      timerRef.current = setTimeout(() => {
        setShownCount((c) => c + 1);
        setPhase('gap');
      }, delay);
      return clear;
    }

    if (phase === 'gap') {
      const justShown = messages[shownCount - 1];
      const next = messages[shownCount];
      if (!next) {
        timerRef.current = setTimeout(
          () => setPhase('complete'),
          reduced ? REDUCED_GAP : (justShown?.gapAfterMs ?? 0),
        );
        return clear;
      }
      const gap = reduced ? REDUCED_GAP : (justShown?.gapAfterMs ?? 0);
      const crossesSection = next.section !== justShown.section;
      timerRef.current = setTimeout(() => {
        setPhase(crossesSection ? 'locked' : 'typing');
      }, gap);
      return clear;
    }
    return undefined;
  }, [phase, shownCount, messages, reduced, paused]);

  useEffect(() => () => clear(), []);

  const advance = useCallback(() => {
    if (phase === 'locked') setPhase('typing');
  }, [phase]);

  const skip = useCallback(() => {
    clear();
    setShownCount(messages.length);
    setPhase('complete');
  }, [messages.length]);

  const currentSection: ChatSection =
    shownCount > 0
      ? messages[Math.min(shownCount - 1, messages.length - 1)].section
      : messages[0]?.section ?? 'hello';

  return {
    shownMessages: messages.slice(0, shownCount),
    isTyping: phase === 'typing' && !paused,
    locked: phase === 'locked',
    complete: phase === 'complete',
    currentSection,
    reduced,
    advance,
    skip,
  };
}
