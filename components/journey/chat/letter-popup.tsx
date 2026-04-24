'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { TemplateDef } from '@/lib/types';
import { Grain } from '../../particles';
import { RevealingName } from './identity-reveal';
import { withAlpha } from './bubbles';

export function LetterPopup({
  open,
  text,
  signatureName,
  anonSignature,
  t,
  onReact,
  onClose,
}: {
  open: boolean;
  text: string;
  signatureName: string;
  anonSignature: boolean;
  t: TemplateDef;
  onReact: (emoji: string) => void;
  onClose: () => void;
}) {
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  // Set of emojis she has tapped so far. Multi-select: each emoji can be
  // added/removed by tapping. Only committed to the parent's `reactions`
  // array (which the YesCard stats line reads) when she closes the
  // letter — so toggling doesn't spam duplicates into the stats.
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setTyped('');
    setDone(false);
    setPicked(new Set());
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    let i = 0;
    const iv = setInterval(() => {
      i += 2;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(iv);
  }, [open, text]);

  // Follow the caret as new characters stream in so long letters never
  // leave the bottom below the fold.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !open) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [typed, done, open]);

  const toggleReact = (emoji: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(emoji)) next.delete(emoji);
      else next.add(emoji);
      return next;
    });
  };

  // Commit only the finally-picked set to parent reactions on close.
  // Anything unpicked is never seen by the stats line.
  const handleClose = () => {
    picked.forEach((e) => onReact(e));
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 180,
            background: `radial-gradient(ellipse at center, ${t.palette.bg2} 0%, ${t.palette.bg} 75%)`,
            color: t.palette.text,
            overflow: 'hidden',
          }}
        >
          <Grain />
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Scrollable letter region — only the body can scroll. The
                reactions + close button live in a fixed footer below so
                they can never be clipped off-screen. */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                scrollBehavior: 'smooth',
                padding: '60px 28px 12px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  color: t.palette.accent,
                  marginBottom: 8,
                }}
              >
                A letter for you
              </div>
              <div
                style={{
                  width: 32,
                  height: 1,
                  background: t.palette.accent,
                  margin: '0 auto 28px',
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  flex: 1,
                  fontFamily: t.fonts.display,
                  fontStyle: 'italic',
                  fontSize: 19,
                  lineHeight: 1.7,
                  color: t.palette.text,
                  whiteSpace: 'pre-wrap',
                  maxWidth: 540,
                  margin: '0 auto',
                  width: '100%',
                  textShadow: `0 0 40px ${withAlpha(t.palette.accent, 0.15)}`,
                }}
              >
                {typed}
                {!done && (
                  <span style={{ opacity: 0.5, animation: 'blink 1s infinite' }}>|</span>
                )}
                {done && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    style={{
                      marginTop: 22,
                      fontSize: 16,
                      color: t.palette.accent,
                      textAlign: 'right',
                    }}
                  >
                    — <RevealingName
                      name={signatureName}
                      reveal={!anonSignature}
                      color={t.palette.accent}
                      accent={t.palette.accent}
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Pinned footer — sits below the scroll region so all five
                emoji buttons and the close CTA are always fully visible,
                regardless of how long the letter is or how far the
                reader has scrolled. */}
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  flexShrink: 0,
                  padding: '14px 18px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 14,
                  background: `linear-gradient(180deg, transparent 0%, ${t.palette.bg} 40%)`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    justifyContent: 'center',
                    flexWrap: 'nowrap',
                    maxWidth: '100%',
                  }}
                >
                  {['😍', '🥹', '💕', '😭', '🤗'].map((e) => {
                    const isPicked = picked.has(e);
                    return (
                      <button
                        key={e}
                        onClick={() => toggleReact(e)}
                        aria-label={`React ${e}`}
                        aria-pressed={isPicked}
                        style={{
                          width: 42,
                          height: 42,
                          flexShrink: 0,
                          borderRadius: 99,
                          border: `1px solid ${
                            isPicked
                              ? t.palette.accent
                              : withAlpha(t.palette.text, 0.12)
                          }`,
                          background: isPicked
                            ? t.palette.accent
                            : withAlpha(t.palette.accent2, 0.08),
                          fontSize: 20,
                          cursor: 'pointer',
                          transform: isPicked ? 'scale(1.22)' : 'scale(1)',
                          transition:
                            'background 0.25s, transform 0.25s, box-shadow 0.25s',
                          backdropFilter: 'blur(6px)',
                          boxShadow: isPicked
                            ? `0 0 0 3px ${withAlpha(t.palette.accent, 0.35)}, 0 8px 22px ${withAlpha(t.palette.accent, 0.55)}`
                            : 'none',
                        }}
                      >
                        {e}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 99,
                    border: `1px solid ${t.palette.accent}`,
                    background: withAlpha(t.palette.accent, 0.12),
                    color: t.palette.text,
                    fontSize: 13,
                    letterSpacing: 1.5,
                    cursor: 'pointer',
                    fontFamily: t.fonts.body,
                    animation: 'pulseBreath 2.5s infinite',
                  }}
                >
                  Close this letter →
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
