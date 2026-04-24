'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { OrderState, SubFlow, TemplateDef } from '@/lib/types';
import { withAlpha } from './bubbles';

export function QuestionCard({
  state,
  sub,
  t,
  onYes,
}: {
  state: OrderState;
  sub: SubFlow;
  t: TemplateDef;
  onYes: () => void;
}) {
  const [dodges, setDodges] = useState(0);
  // Null while the button sits in its natural flow position under Yes.
  // Becomes absolute {left, top} once the user tries to interact — that's
  // when it starts roaming the whole card instead of wiggling in place.
  const [noPos, setNoPos] = useState<{ left: number; top: number } | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const noBtnRef = useRef<HTMLButtonElement | null>(null);
  // Keeps cycling — never runs out. After the first few, it settles on a
  // resigned loop so the button never hides and never gives up.
  const NO_LABELS = ['no', 'really?', 'come on…', 'no way', 'please?', 'fine 😢', 'don’t'];

  const dodge = (e?: React.SyntheticEvent) => {
    e?.stopPropagation?.();
    const card = cardRef.current;
    const btn = noBtnRef.current;
    if (!card || !btn) return;

    const cardRect = card.getBoundingClientRect();
    const btnW = btn.offsetWidth;
    const btnH = btn.offsetHeight;
    const edge = 14; // keep at least this much space from card edges
    const gap = 16; // minimum breathing room between No and Yes

    // Carve the card into two safe slices that are guaranteed not to
    // overlap the Yes rect: everything above Yes, and everything below
    // it. Picking within one of these slices means the No button CAN
    // NEVER end up on top of Yes — no retry loop needed, no accidental
    // Yes-taps. Old retry code could fall through to an overlapping
    // position after 10 unlucky rolls; this one is overlap-free by
    // construction.
    const yes = yesButtonZone(card);
    const maxLeft = Math.max(edge, cardRect.width - btnW - edge);
    const left = edge + Math.random() * (maxLeft - edge);

    const aboveMaxTop = yes.top - btnH - gap;
    const belowMinTop = yes.bottom + gap;
    const belowMaxTop = cardRect.height - btnH - edge;

    const canAbove = aboveMaxTop > edge;
    const canBelow = belowMaxTop > belowMinTop;

    let top: number;
    if (canAbove && canBelow) {
      // Bias slightly upward — there's usually more room above the
      // Yes button, which keeps the No button's motion feeling playful
      // rather than squeezed into the bottom strip.
      const useBelow = Math.random() < 0.3;
      top = useBelow
        ? belowMinTop + Math.random() * (belowMaxTop - belowMinTop)
        : edge + Math.random() * (aboveMaxTop - edge);
    } else if (canAbove) {
      top = edge + Math.random() * (aboveMaxTop - edge);
    } else if (canBelow) {
      top = belowMinTop + Math.random() * (belowMaxTop - belowMinTop);
    } else {
      // Extreme edge case: card so small that neither slice fits the
      // button. Pin to the top edge — overlap is still impossible
      // because we clamp top below yes.top - btnH.
      top = edge;
    }

    setNoPos({ left, top });
    setDodges((d) => d + 1);
  };

  const first = firstName(state.toName);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 160,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.15 }}
        data-yes-card
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 380,
          padding: '40px 28px 28px',
          borderRadius: 26,
          background: `linear-gradient(165deg, ${t.palette.bg2}, ${t.palette.bg})`,
          color: t.palette.text,
          border: `1px solid ${withAlpha(t.palette.accent, 0.4)}`,
          boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 80px ${withAlpha(
            t.palette.accent,
            0.35,
          )}`,
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          style={{
            fontFamily: t.fonts.body,
            fontSize: 13,
            fontStyle: 'italic',
            color: t.palette.muted,
          }}
        >
          And so, {first}…
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.75, ease: [0.2, 0.8, 0.3, 1] }}
          style={{
            marginTop: 18,
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 32,
            lineHeight: 1.15,
            color: t.palette.text,
            textShadow: `0 0 30px ${withAlpha(t.palette.accent, 0.5)}`,
          }}
        >
          {sub.question}
        </motion.div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.6 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          style={{
            width: 44,
            height: 1,
            background: t.palette.accent,
            margin: '22px auto 0',
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          style={{
            fontFamily: t.fonts.body,
            fontSize: 12,
            letterSpacing: 1.5,
            color: t.palette.muted,
            marginTop: 10,
          }}
        >
          — {state.fromName}
        </motion.div>

        <motion.button
          data-yes-btn
          onClick={onYes}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            marginTop: 32,
            width: '100%',
            padding: '18px 24px',
            borderRadius: 99,
            border: 'none',
            background: `linear-gradient(90deg, ${t.palette.accent}, ${t.palette.accent2})`,
            color: t.palette.bg,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: `0 0 30px ${withAlpha(t.palette.accent, 0.6)}`,
            animation: 'pulseBreath 2.5s infinite',
            fontFamily: t.fonts.body,
          }}
        >
          Yes, I will! {sub.particle}
        </motion.button>

        <motion.button
          ref={noBtnRef}
          onMouseEnter={dodge}
          onFocus={dodge}
          onClick={dodge}
          onTouchStart={dodge}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          style={{
            // Switches from document flow to absolute once she tries
            // to touch it — that's when the dodge starts covering the
            // whole card rather than wiggling in place.
            position: noPos ? 'absolute' : 'relative',
            left: noPos ? `${noPos.left}px` : undefined,
            top: noPos ? `${noPos.top}px` : undefined,
            marginTop: noPos ? 0 : 14,
            width: 'auto',
            padding: '12px 22px',
            borderRadius: 99,
            border: `1px solid ${withAlpha(t.palette.text, 0.25)}`,
            background: withAlpha(t.palette.text, 0.06),
            color: t.palette.muted,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition:
              'left 0.45s cubic-bezier(.3,1.5,.5,1), top 0.45s cubic-bezier(.3,1.5,.5,1), background 0.2s, border-color 0.2s',
            fontFamily: t.fonts.body,
            zIndex: 2,
          }}
        >
          {NO_LABELS[dodges % NO_LABELS.length]}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Small rect-in-card region to protect the Yes button from being
// covered by the roaming No button. Padded ±12px so they never sit
// flush against each other either.
function yesButtonZone(card: HTMLElement): {
  left: number;
  top: number;
  right: number;
  bottom: number;
} {
  const cardRect = card.getBoundingClientRect();
  const yes = card.querySelector<HTMLElement>('[data-yes-btn]');
  if (!yes) return { left: 0, top: 0, right: 0, bottom: 0 };
  const yr = yes.getBoundingClientRect();
  const pad = 12;
  return {
    left: yr.left - cardRect.left - pad,
    top: yr.top - cardRect.top - pad,
    right: yr.right - cardRect.left + pad,
    bottom: yr.bottom - cardRect.top + pad,
  };
}

function firstName(full: string): string {
  const trimmed = full.trim();
  if (!trimmed) return 'you';
  return trimmed.split(/\s+/)[0];
}
