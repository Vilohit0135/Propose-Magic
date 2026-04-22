'use client';

import React, { useEffect, useState } from 'react';
import { DEMO_PHOTOS } from '@/lib/tokens';
import { getMessage } from '@/lib/mock-data';
import type { OrderState, TemplateDef } from '@/lib/types';
import { Grain, Particles } from '../particles';

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
  return (
    <div style={{ position: 'relative', width: 240, height: 280 }}>
      {photos.slice(0, 5).map((p, i) => {
        const rot = (i - 2) * 6;
        const offsetY = i * 8;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translateY(${offsetY}px) rotate(${rot}deg)`,
              width: 180,
              height: 220,
              background: '#fff',
              padding: 10,
              paddingBottom: 30,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              animation: `polaroidDrop 0.8s ${i * 0.15}s both cubic-bezier(.2,.9,.3,1.1)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          </div>
        );
      })}
    </div>
  );
}

export function SlideshowLayout({ photos }: { photos: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx((i) => (i + 1) % photos.length), 3000);
    return () => clearInterval(iv);
  }, [photos.length]);
  return (
    <div style={{ position: 'relative', width: 260, height: 320, borderRadius: 8, overflow: 'hidden' }}>
      {photos.map((p, i) => (
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
            transition: 'opacity 1.2s',
            filter: 'brightness(0.95)',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 60px rgba(255,255,255,0.3)',
        }}
      />
    </div>
  );
}

export function FilmstripLayout({ photos }: { photos: string[] }) {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        padding: '0 10px',
        display: 'flex',
        gap: 8,
        scrollbarWidth: 'none',
      }}
    >
      {photos.map((p, i) => (
        <div
          key={i}
          style={{
            flexShrink: 0,
            width: 180,
            height: 240,
            padding: 6,
            background: '#1a0a05',
            borderTop: '2px dashed #c9a87a40',
            borderBottom: '2px dashed #c9a87a40',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'sepia(0.2) saturate(1.1)',
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function GridLayout({ photos }: { photos: string[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        width: '100%',
        maxWidth: 320,
      }}
    >
      {photos.slice(0, 6).map((p, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={p}
          alt=""
          style={{
            width: '100%',
            aspectRatio: '1',
            objectFit: 'cover',
            borderRadius: 6,
            animation: `fadeInUp 0.8s ${i * 0.12}s both`,
          }}
        />
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
