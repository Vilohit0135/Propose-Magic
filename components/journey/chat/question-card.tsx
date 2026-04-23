'use client';

import React, { useState } from 'react';
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
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  // Keeps cycling — never runs out. After the first few, it settles on a
  // resigned loop so the button never hides and never gives up.
  const NO_LABELS = ['no', 'really?', 'come on…', 'no way', 'please?', 'fine 😢', 'don’t'];

  const dodge = (e?: React.SyntheticEvent) => {
    e?.stopPropagation?.();
    // Jitter stays lively forever — amplitude floor keeps it moving.
    const max = Math.max(30, 72 - dodges * 6);
    setNoPos({ x: (Math.random() - 0.5) * max, y: (Math.random() - 0.5) * max });
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
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.15 }}
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
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 64,
            height: 3,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${t.palette.accent}, ${t.palette.accent2})`,
          }}
        />

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
          onMouseEnter={dodge}
          onFocus={dodge}
          onClick={dodge}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          style={{
            marginTop: 14,
            width: '60%',
            padding: '12px 20px',
            borderRadius: 99,
            border: `1px solid ${withAlpha(t.palette.text, 0.25)}`,
            background: withAlpha(t.palette.text, 0.06),
            color: t.palette.muted,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            transform: `translate(${noPos.x}px, ${noPos.y}px)`,
            transition:
              'transform 0.35s cubic-bezier(.3,1.5,.5,1), background 0.2s, border-color 0.2s',
            fontFamily: t.fonts.body,
          }}
        >
          {NO_LABELS[dodges % NO_LABELS.length]}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function firstName(full: string): string {
  const trimmed = full.trim();
  if (!trimmed) return 'you';
  return trimmed.split(/\s+/)[0];
}
