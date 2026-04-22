'use client';

import React, { useEffect, useState } from 'react';
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
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTyped('');
    setDone(false);
    setPicked(null);
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

  const handleReact = (emoji: string) => {
    setPicked(emoji);
    onReact(emoji);
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
              padding: '60px 28px 24px',
              overflowY: 'auto',
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

            {done && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 18,
                  paddingTop: 24,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  {['😍', '🥹', '💕', '😭', '🤗'].map((e) => (
                    <button
                      key={e}
                      onClick={() => handleReact(e)}
                      aria-label={`React ${e}`}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 99,
                        border: `1px solid ${withAlpha(t.palette.text, 0.12)}`,
                        background:
                          picked === e
                            ? withAlpha(t.palette.accent, 0.25)
                            : withAlpha(t.palette.accent2, 0.08),
                        fontSize: 20,
                        cursor: 'pointer',
                        transform: picked === e ? 'scale(1.15)' : 'scale(1)',
                        transition: 'background 0.2s, transform 0.2s',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <button
                  onClick={onClose}
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
