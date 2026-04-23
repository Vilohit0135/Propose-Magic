'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { TemplateDef, VideoTreatmentId } from '@/lib/types';
import { Grain } from '../../particles';
import { withAlpha } from './bubbles';

export function VideoPopup({
  open,
  poster,
  videoUrl,
  treatment,
  toName,
  t,
  onClose,
}: {
  open: boolean;
  poster: string;
  videoUrl: string | null;
  treatment: VideoTreatmentId;
  toName: string;
  t: TemplateDef;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  const [captionsIn, setCaptionsIn] = useState(false);

  useEffect(() => {
    if (!open) {
      setStarted(false);
      setCaptionsIn(false);
      return;
    }
    const t1 = setTimeout(() => setCaptionsIn(true), 700);
    return () => clearTimeout(t1);
  }, [open]);

  const startPlayback = () => {
    if (!videoUrl) return;
    setStarted(true);
    requestAnimationFrame(() => {
      const el = videoRef.current;
      if (!el) return;
      // Try with sound first; browsers that refuse will replay muted.
      void el.play().catch(() => {
        el.muted = true;
        void el.play();
      });
    });
  };

  const filter =
    treatment === 'vintage'
      ? 'sepia(0.35) contrast(1.08)'
      : treatment === 'dreamy'
        ? 'brightness(1.08) saturate(1.05)'
        : treatment === 'fullbleed'
          ? 'none'
          : 'brightness(0.92)';

  const firstName = (toName.trim().split(/\s+/)[0] || 'you');

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
            transition={{ duration: 0.8, delay: 0.15 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '56px 22px 24px',
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
              A little something
            </div>
            <div
              style={{
                width: 32,
                height: 1,
                background: t.palette.accent,
                margin: '0 auto 22px',
                opacity: 0.6,
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.2, 0.8, 0.3, 1] }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 440,
                aspectRatio: '9 / 16',
                maxHeight: '56vh',
                borderRadius: 22,
                overflow: 'hidden',
                background: '#000',
                boxShadow: `0 30px 80px ${withAlpha(t.palette.accent, 0.25)}, 0 0 0 1px ${withAlpha(t.palette.text, 0.08)}`,
              }}
            >
              {started && videoUrl ? (
                /* eslint-disable-next-line jsx-a11y/media-has-caption */
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  autoPlay
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter,
                  }}
                />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={poster}
                    alt=""
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter,
                    }}
                  />
                  {treatment === 'letterbox' && (
                    <>
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: 0,
                          height: '10%',
                          background: '#000',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: '10%',
                          background: '#000',
                        }}
                      />
                    </>
                  )}
                  <button
                    onClick={startPlayback}
                    disabled={!videoUrl}
                    aria-label={videoUrl ? 'Play video' : 'Video preview'}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      border: 'none',
                      background: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: videoUrl ? 'pointer' : 'default',
                    }}
                  >
                    <span
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 99,
                        background: withAlpha(t.palette.accent, 0.8),
                        color: t.palette.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        border: `1px solid ${withAlpha(t.palette.text, 0.25)}`,
                        backdropFilter: 'blur(6px)',
                        boxShadow: `0 12px 36px ${withAlpha(t.palette.accent, 0.5)}`,
                        animation: 'pulseBreath 2.4s infinite',
                      }}
                    >
                      ▶
                    </span>
                  </button>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={captionsIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.3, 1] }}
              style={{
                marginTop: 28,
                maxWidth: 420,
                width: '100%',
                textAlign: 'center',
                fontFamily: t.fonts.display,
                fontStyle: 'italic',
                fontSize: 18,
                lineHeight: 1.65,
                color: t.palette.text,
                textShadow: `0 0 30px ${withAlpha(t.palette.accent, 0.2)}`,
              }}
            >
              <div>Then you walked in.</div>
              <div style={{ marginTop: 6 }}>
                Everything changed — softly, completely.
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 14,
                  color: t.palette.muted,
                  fontStyle: 'italic',
                }}
              >
                You made my whole life beautiful, {firstName}.
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={captionsIn ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              onClick={onClose}
              style={{
                marginTop: 28,
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
              Keep going →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
