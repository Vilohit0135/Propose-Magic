'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { DEMO_PHOTOS } from '@/lib/tokens';
import { getMessage } from '@/lib/mock-data';
import type { OrderState, TemplateDef } from '@/lib/types';
import { Grain, Particles } from '../particles';

// Slowly auto-scrolls a track so the receiver sees every photo without
// needing to realize she can swipe. Pauses when she manually drags/scrolls,
// resumes after a short idle window. Works on either axis — horizontal for
// filmstrip/polaroid, vertical for grid.
function useAutoDrift(
  pxPerSecond = 24,
  axis: 'x' | 'y' = 'x',
  resumeAfterMs = 2800,
) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = performance.now();
    let direction = 1;
    let paused = false;
    let resumeTimer: number | null = null;

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused) {
        const contentSize = axis === 'x' ? el.scrollWidth : el.scrollHeight;
        const viewSize = axis === 'x' ? el.clientWidth : el.clientHeight;
        if (contentSize > viewSize + 1) {
          const delta = pxPerSecond * dt * direction;
          if (axis === 'x') el.scrollLeft += delta;
          else el.scrollTop += delta;
          const pos = axis === 'x' ? el.scrollLeft : el.scrollTop;
          const max = contentSize - viewSize;
          if (pos >= max - 1) {
            if (axis === 'x') el.scrollLeft = max;
            else el.scrollTop = max;
            direction = -1;
          } else if (pos <= 0) {
            if (axis === 'x') el.scrollLeft = 0;
            else el.scrollTop = 0;
            direction = 1;
          }
        }
      }
      raf = requestAnimationFrame(step);
    };

    const pause = () => {
      paused = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, resumeAfterMs);
    };

    // Pause strategy:
    //   - wheel: always pauses (desktop/trackpad).
    //   - pointerdown + pointermove: pause only if the pointer drags
    //     more than 10px in OUR drift axis — so a vertical chat scroll
    //     (finger-on-photo but moving down the page) doesn't kill a
    //     horizontal drift. A deliberate horizontal swipe does.
    //
    // Previous attempts (touchstart → scroll-delta watcher) both misread
    // our own sub-pixel RAF writes as user motion and paused immediately,
    // so the drift appeared "stuck" on mobile. Drag-distance detection is
    // the only mode that cleanly distinguishes intent without parsing our
    // own scroll events.
    let pointerStart: { x: number; y: number; id: number } | null = null;

    const onPointerDown = (e: PointerEvent) => {
      pointerStart = { x: e.clientX, y: e.clientY, id: e.pointerId };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerStart || e.pointerId !== pointerStart.id) return;
      const dx = Math.abs(e.clientX - pointerStart.x);
      const dy = Math.abs(e.clientY - pointerStart.y);
      const driftAxis = axis === 'x' ? dx : dy;
      if (driftAxis > 10) {
        pause();
        pointerStart = null;
      }
    };

    const onPointerEnd = (e: PointerEvent) => {
      if (pointerStart && e.pointerId === pointerStart.id) pointerStart = null;
    };

    el.addEventListener('wheel', pause, { passive: true });
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerEnd);
    el.addEventListener('pointercancel', onPointerEnd);

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimer) window.clearTimeout(resumeTimer);
      el.removeEventListener('wheel', pause);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerEnd);
      el.removeEventListener('pointercancel', onPointerEnd);
    };
  }, [pxPerSecond, axis, resumeAfterMs]);
  return ref;
}

const MOMENT_LABELS = [
  'moment one',
  'moment two',
  'moment three',
  'moment four',
  'moment five',
  'moment six',
  'moment seven',
  'moment eight',
  'moment nine',
  'moment ten',
];

export function Scene1Opening({
  state,
  t,
  onTap,
}: {
  state: OrderState;
  t: TemplateDef;
  onTap: () => void;
}) {
  const displayFrom = state.isAnonymous ? 'someone special' : state.fromName;
  return (
    <div
      onClick={onTap}
      style={{
        position: 'absolute',
        inset: 0,
        cursor: 'pointer',
        background: `radial-gradient(ellipse at center, ${t.palette.bg2} 0%, ${t.palette.bg} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        textAlign: 'center',
      }}
    >
      <Particles template={state.template} density={1.2} />
      <Grain />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: t.fonts.body,
            fontSize: 11,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: t.palette.muted,
            animation: 'fadeInUp 1s 0.2s both',
          }}
        >
          A Journey for
        </div>
        <div
          style={{
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 54,
            lineHeight: 1.1,
            fontWeight: 500,
            marginTop: 18,
            color: t.palette.text,
            textShadow: `0 0 30px ${t.palette.accent}80, 0 0 60px ${t.palette.accent}40`,
            animation: 'fadeInUp 1.2s 0.8s both',
          }}
        >
          {state.toName}
        </div>
        <div
          style={{
            fontFamily: t.fonts.body,
            fontSize: 13,
            color: t.palette.muted,
            marginTop: 24,
            animation: 'fadeInUp 1s 1.8s both',
          }}
        >
          from {displayFrom}, with love
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          animation: 'pulseFade 2s 2.5s infinite',
          zIndex: 5,
        }}
      >
        <div style={{ fontSize: 10, color: t.palette.muted, letterSpacing: 2 }}>TAP TO BEGIN</div>
        <div style={{ fontSize: 16, color: t.palette.accent, marginTop: 4 }}>↓</div>
      </div>
    </div>
  );
}

export function Scene2Began({
  state,
  t,
  onTap,
}: {
  state: OrderState;
  t: TemplateDef;
  onTap: () => void;
}) {
  const photo = state.photos[0] || DEMO_PHOTOS[0];
  return (
    <div onClick={onTap} style={{ position: 'absolute', inset: 0, cursor: 'pointer', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'kenBurns 14s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to top, ${t.palette.bg}dd 0%, transparent 60%)`,
        }}
      />
      <Particles template={state.template} density={0.5} />
      <Grain />
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 24,
          right: 24,
          zIndex: 5,
          animation: 'fadeInUp 1.2s 0.5s both',
        }}
      >
        <div
          style={{
            fontFamily: t.fonts.body,
            fontSize: 10,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: t.palette.accent,
            marginBottom: 10,
          }}
        >
          Chapter One
        </div>
        <div
          style={{
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 34,
            lineHeight: 1.15,
            color: '#fff',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          Where it began…
        </div>
        <div
          style={{
            fontFamily: t.fonts.body,
            fontSize: 12,
            color: t.palette.muted,
            marginTop: 12,
            letterSpacing: 1,
          }}
        >
          Mumbai · June 2022
        </div>
      </div>
    </div>
  );
}

export function Scene3Memories({
  state,
  t,
  onTap,
}: {
  state: OrderState;
  t: TemplateDef;
  onTap: () => void;
}) {
  const layout = state.photoLayout || 'polaroid';
  const photos = state.photos.length ? state.photos : DEMO_PHOTOS.slice(0, 6);
  return (
    <div
      onClick={onTap}
      style={{
        position: 'absolute',
        inset: 0,
        cursor: 'pointer',
        background: `linear-gradient(180deg, ${t.palette.bg2} 0%, ${t.palette.bg} 100%)`,
        padding: '80px 20px 60px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Particles template={state.template} density={0.6} />
      <Grain />
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            fontFamily: t.fonts.body,
            fontSize: 10,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: t.palette.accent,
          }}
        >
          Chapter Two
        </div>
        <div
          style={{
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 28,
            marginTop: 6,
            color: t.palette.text,
          }}
        >
          The memories
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {layout === 'polaroid' && <PolaroidLayout photos={photos} />}
        {layout === 'slideshow' && <SlideshowLayout photos={photos} />}
        {layout === 'filmstrip' && <FilmstripLayout photos={photos} />}
        {layout === 'grid' && <GridLayout photos={photos} />}
      </div>
    </div>
  );
}

export function PolaroidLayout({ photos }: { photos: string[] }) {
  const items = photos.slice(0, 8);
  const scrollerRef = useAutoDrift(20);
  return (
    <div
      ref={scrollerRef}
      style={{
        width: '100%',
        display: 'flex',
        gap: 16,
        padding: '8px 14px 16px',
        overflowX: 'auto',
        scrollSnapType: 'x proximity',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        justifyContent: items.length <= 3 ? 'center' : 'flex-start',
      }}
    >
      {items.map((p, i) => {
        const rot = ((i % 2 === 0 ? -1 : 1) * (2 + (i % 3))) * 1.2;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28, scale: 0.7, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: rot }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.7,
              delay: 0.12 + i * 0.18,
              ease: [0.2, 0.9, 0.3, 1.2],
            }}
            style={{
              flexShrink: 0,
              scrollSnapAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 118,
                background: '#fff',
                padding: 8,
                paddingBottom: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p}
                alt=""
                style={{
                  width: '100%',
                  height: 130,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: '"Playfair Display", serif',
                fontStyle: 'italic',
                fontSize: 11,
                letterSpacing: 0.4,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {MOMENT_LABELS[i] ?? `moment ${i + 1}`}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function SlideshowLayout({ photos }: { photos: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (photos.length === 0) return;
    const iv = setInterval(() => setIdx((i) => (i + 1) % photos.length), 3000);
    return () => clearInterval(iv);
  }, [photos.length]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.2, 0.9, 0.3, 1] }}
      style={{
        position: 'relative',
        width: 240,
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: '0 14px 40px rgba(0,0,0,0.45)',
      }}
    >
      {photos.map((p, i) => {
        const offset = i - idx;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={p}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: i === idx ? 1 : 0,
              transform: `translate3d(${offset === 0 ? 0 : offset > 0 ? '40px' : '-40px'}, 0, 0) scale(${i === idx ? 1 : 1.04})`,
              transition:
                'opacity 0.9s ease, transform 1.1s cubic-bezier(0.2,0.8,0.3,1)',
              filter: 'brightness(0.97)',
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 60px rgba(255,255,255,0.3)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 12,
          bottom: 10,
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'rgba(255,255,255,0.95)',
          textShadow: '0 2px 8px rgba(0,0,0,0.65)',
        }}
      >
        {MOMENT_LABELS[idx] ?? `moment ${idx + 1}`}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 12,
          bottom: 10,
          fontSize: 10,
          letterSpacing: 1.5,
          color: 'rgba(255,255,255,0.75)',
          textShadow: '0 2px 6px rgba(0,0,0,0.6)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {idx + 1} / {photos.length}
      </div>
    </motion.div>
  );
}

export function FilmstripLayout({ photos }: { photos: string[] }) {
  const items = photos.slice(0, 8);
  const scrollerRef = useAutoDrift(28);
  return (
    <div
      ref={scrollerRef}
      style={{
        width: '100%',
        overflowX: 'auto',
        padding: '4px 14px 16px',
        display: 'flex',
        gap: 10,
        scrollbarWidth: 'none',
        scrollSnapType: 'x proximity',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {items.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -14, scale: 0.94 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            delay: 0.1 + i * 0.14,
            ease: [0.2, 0.9, 0.3, 1],
          }}
          style={{
            flexShrink: 0,
            scrollSnapAlign: 'center',
            width: 130,
            padding: '6px 6px 10px',
            background: '#1a0a05',
            borderTop: '2px dashed rgba(201,167,122,0.45)',
            borderBottom: '2px dashed rgba(201,167,122,0.45)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p}
            alt=""
            style={{
              width: '100%',
              height: 160,
              objectFit: 'cover',
              filter: 'sepia(0.2) saturate(1.1)',
            }}
          />
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: 10,
              color: 'rgba(201,167,122,0.85)',
              letterSpacing: 0.4,
            }}
          >
            {MOMENT_LABELS[i] ?? `moment ${i + 1}`}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function GridLayout({ photos }: { photos: string[] }) {
  const items = photos.slice(0, 10);
  const scrollerRef = useAutoDrift(14, 'y');
  return (
    <div
      ref={scrollerRef}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        width: '100%',
        maxWidth: 340,
        maxHeight: 360,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        padding: '4px 0 10px',
      }}
    >
      {items.map((p, i) => (
        <motion.figure
          key={i}
          initial={{ opacity: 0, y: 18, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            delay: 0.1 + i * 0.15,
            ease: [0.2, 0.9, 0.3, 1.1],
          }}
          style={{ margin: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p}
            alt=""
            style={{
              width: '100%',
              aspectRatio: '1',
              objectFit: 'cover',
              borderRadius: 8,
              display: 'block',
            }}
          />
          <figcaption
            style={{
              marginTop: 4,
              textAlign: 'center',
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: 10,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: 0.3,
            }}
          >
            {MOMENT_LABELS[i] ?? `moment ${i + 1}`}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

export function Scene4Letter({
  state,
  t,
  setReactions,
  onTap,
}: {
  state: OrderState;
  t: TemplateDef;
  setReactions: React.Dispatch<React.SetStateAction<string[]>>;
  onTap: () => void;
}) {
  const [typed, setTyped] = useState('');
  const msg =
    state.generatedMessage ?? getMessage(state.subFlow, state.tone, state.isAnonymous);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i += 2;
      setTyped(msg.slice(0, i));
      if (i >= msg.length) clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [msg]);
  const bgPhoto = state.photos[0] || DEMO_PHOTOS[2];
  const [floats, setFloats] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const addReact = (emoji: string) => {
    setReactions((r) => [...r, emoji]);
    const id = Math.random();
    setFloats((f) => [...f, { id, emoji, x: Math.random() * 60 - 30 }]);
    setTimeout(() => setFloats((f) => f.filter((fl) => fl.id !== id)), 2000);
  };
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {state.package !== 'basic' ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(28px) brightness(0.35)',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 40%, ${t.palette.bg2} 0%, ${t.palette.bg} 70%)`,
            animation: 'radialPulse 5s ease-in-out infinite',
          }}
        />
      )}
      <Particles template={state.template} density={0.5} />
      <Grain />
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          padding: '80px 28px 140px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: t.fonts.body,
            fontStyle: 'italic',
            fontSize: 13,
            color: t.palette.muted,
            marginBottom: 18,
            animation: 'fadeInUp 0.8s both',
          }}
        >
          I&apos;ve been thinking about this for a while…
        </div>
        <div
          style={{
            fontFamily: t.fonts.display,
            fontSize: 19,
            lineHeight: 1.65,
            color: t.palette.text,
            fontStyle: 'italic',
            minHeight: 200,
          }}
        >
          {typed}
          <span style={{ opacity: 0.5, animation: 'blink 1s infinite' }}>|</span>
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: t.fonts.display,
            fontStyle: 'italic',
            fontSize: 16,
            color: t.palette.accent,
            textAlign: 'right',
            opacity: typed.length >= msg.length ? 1 : 0,
            transition: 'opacity 1s',
          }}
        >
          — {state.isAnonymous ? '???' : state.fromName}
        </div>
      </div>
      {/* Reaction bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          zIndex: 10,
        }}
      >
        {['😍', '🥹', '💕', '😭', '🤗'].map((e) => (
          <button
            key={e}
            onClick={() => addReact(e)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 99,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            {e}
          </button>
        ))}
      </div>
      {floats.map((f) => {
        const s: React.CSSProperties = {
          position: 'absolute',
          bottom: 100,
          left: '50%',
          fontSize: 30,
          pointerEvents: 'none',
          animation: 'reactFloat 2s ease-out forwards',
          zIndex: 20,
        };
        (s as Record<string, string>)['--rx'] = `${f.x}px`;
        return (
          <span key={f.id} style={s}>
            {f.emoji}
          </span>
        );
      })}
      {typed.length >= msg.length && (
        <button
          onClick={onTap}
          style={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 20px',
            borderRadius: 99,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: t.palette.text,
            fontSize: 12,
            letterSpacing: 1,
            cursor: 'pointer',
            zIndex: 15,
            animation: 'fadeInUp 0.6s both',
          }}
        >
          continue ↓
        </button>
      )}
    </div>
  );
}
